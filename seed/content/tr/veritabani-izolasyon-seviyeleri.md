---
title: "Veritabanı İzolasyon Seviyeleri Rehberi"
slug: "veritabani-izolasyon-seviyeleri"
translationKey: "transaction-isolation-levels"
locale: "tr"
excerpt: "Hangi izolasyon seviyesine ihtiyacınız var? Dört okuma anomalisini, dört SQL seviyesini ve Postgres'in varsayılanının neden şaşırttığını anlatıyoruz."
category: "software-engineering"
tags: ["databases", "postgresql", "sql", "reliability"]
publishedAt: "2026-07-17"
seoTitle: "Veritabanı İzolasyon Seviyeleri: Hangisine İhtiyacınız Var?"
seoDescription: "Dirty read, non-repeatable read, phantom read ve lost update anomalilerini, dört SQL izolasyon seviyesini ve Postgres'in MVCC modelini örneklerle anlatıyoruz."
---

Hangi izolasyon seviyesine gerçekten ihtiyacınız var? Çoğu ekip bu soruyu hiç sormadan varsayılanı kullanır — ve Postgres'te varsayılan, çoğu geliştiricinin tahmin ettiğinden daha zayıf olan Read Committed'dır. Doğru cevap uygulamanızın hangi eşzamanlılık anomalilerine tahammül edebileceğine bağlı; bu yazı dört anomaliyi, dört standart seviyeyi ve MVCC'nin bunları nasıl uyguladığını netleştiriyor.

## Dört Okuma Anomalisi

İzolasyon seviyeleri, eşzamanlı işlemlerin (transaction) birbirinin verisini ne kadar "görebileceğini" tanımlar. SQL standardı dört anomaliyi adlandırır:

**Dirty read**: Bir işlem, henüz commit edilmemiş — yani her an rollback olabilecek — başka bir işlemin verisini okur. En tehlikeli anomali; okuduğunuz veri gerçekte hiç var olmamış olabilir.

**Non-repeatable read**: Aynı işlem içinde aynı satırı iki kez okuduğunuzda, aradaki commit edilmiş bir güncelleme yüzünden farklı değerler görürsünüz.

**Phantom read**: Aynı işlem içinde aynı koşulla iki kez sorgu çalıştırdığınızda, aradaki commit edilmiş bir ekleme/silme yüzünden satır sayısı değişir — non-repeatable read'in "satır kümesi" versiyonu.

**Lost update**: İki işlem aynı satırı eşzamanlı okuyup güncellediğinde, ikincinin yazması birincinin yazdığı değeri sessizce ezer; hiçbir hata fırlatılmaz, veri sadece kaybolur.

## Dört SQL İzolasyon Seviyesi

SQL standardı bu anomalilere karşı dört seviye tanımlar, en gevşekten en katıya:

| Seviye | Dirty read | Non-repeatable read | Phantom read | Lost update |
|---|---|---|---|---|
| Read Uncommitted | Mümkün | Mümkün | Mümkün | Mümkün |
| Read Committed | Engellenir | Mümkün | Mümkün | Mümkün |
| Repeatable Read | Engellenir | Engellenir | Standartta mümkün | Standartta mümkün |
| Serializable | Engellenir | Engellenir | Engellenir | Engellenir |

Bu tablo standardın *asgari* garantisidir — her veritabanı motoru bu asgariyi karşılamak zorunda ama daha da katı davranabilir. Ve tam olarak burada Postgres farklılaşıyor.

## Postgres'in Sürprizi: Repeatable Read Aslında Snapshot Isolation

Postgres'te Read Uncommitted diye ayrı bir davranış yok — Read Uncommitted istendiğinde motor sessizce Read Committed'a düşer, yani pratikte üç seviye var. Asıl sürpriz Repeatable Read'de: standart bu seviyede phantom read'e ve lost update'e izin verse de, Postgres'in Repeatable Read'i akademik literatürde "Snapshot Isolation" denen tekniği kullanır ve ikisini de engeller. Aynı satırı eşzamanlı güncellemeye çalışan iki Repeatable Read işleminden ilki commit olduğunda, ikincisi sessizce ezmek yerine `could not serialize access due to concurrent update` hatasıyla geri alınır — yani Postgres'te Repeatable Read, standardın izin verdiğinden daha güçlü bir garanti veriyor, ama bu garanti bir hatayı yakalayıp yeniden deneme mantığı gerektiriyor.

MySQL'de (InnoDB) de varsayılan Repeatable Read'dir ve benzer şekilde çoğu phantom senaryosunu engeller — ama iki motorun iç uygulaması farklı, bu yüzden "Repeatable Read" adının aynı olması davranışın bire bir aynı olduğu anlamına gelmiyor. Kritik nokta şu: **Postgres'in varsayılanı Read Committed**, yani her sorgu kendi anlık görüntüsünü (snapshot) alır ve aynı işlem içindeki farklı sorgular farklı commit durumlarını görebilir. Ekiplerin çoğu bunu fark etmeden "zaten güçlü izolasyon var" varsayımıyla kod yazıyor.

## MVCC: Kilitsiz Okumanın Bedeli

Postgres'in Çoklu Sürüm Eşzamanlılık Kontrolü (MVCC) modeli, okuma işlemlerinin yazma işlemlerini hiç bloklamamasını sağlar — her işlem, başladığı andaki tutarlı bir veri anlık görüntüsünü görür, diğer işlemlerin henüz commit etmediği değişikliklerden etkilenmez. Bu, okuma-ağırlıklı iş yüklerinde büyük bir performans kazancı, ama bedeli var: Serializable seviyesinde, veritabanı iki işlemin birbiriyle çakıştığını tespit ettiğinde işlemlerden birini **iptal edip** (`serialization_failure` hatasıyla) uygulamanın yeniden denemesini bekler.

```sql
BEGIN ISOLATION LEVEL SERIALIZABLE;

SELECT balance FROM accounts WHERE id = 42;
-- uygulama mantığı: bakiyeyi kontrol et, düş
UPDATE accounts SET balance = balance - 100 WHERE id = 42;

COMMIT;
-- Çakışma varsa: ERROR: could not serialize access due to concurrent update
```

Bu hatayı yakalayıp yeniden denemek Serializable kullanmanın **zorunlu** bir parçasıdır — bu seviyeyi seçip retry mantığı yazmamak, üretimde rastgele başarısız olan işlemler anlamına gelir.

```javascript
async function withSerializableRetry(fn, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await db.transaction('SERIALIZABLE', fn);
    } catch (err) {
      if (err.code === '40001' && attempt < maxAttempts) {
        await sleep(50 * attempt); // kısa, artan bekleme
        continue;
      }
      throw err;
    }
  }
}
```

## Hangi Seviyeyi Ne Zaman Seçmeli

Pratik kural basit: Read Committed, tekil satır okuma/yazma işlemlerinin çoğunluğu için yeterlidir ve varsayılan olarak kalması genelde doğrudur. Aynı işlem içinde birden fazla sorgunun tutarlı bir anlık görüntü görmesi gerekiyorsa (örneğin bir rapor oluştururken ara toplamların değişmemesi gerekiyorsa) Repeatable Read'e geçin. "Bakiye kontrol et, sonra düş" gibi okuma-sonra-yazma mantığının yarış koşuluna (race condition) karşı tamamen korunması gerektiği finansal veya envanter işlemlerinde Serializable ve retry mantığı zorunlu hale gelir. Aradaki her seviye atlaması bir performans/tutarlılık takası — Serializable'ı her yere uygulamak, gereksiz retry trafiği ve gecikme demek.

İzolasyon seviyesi doğru seçilse bile sorgularınız yavaşsa sorun genelde indeksleme; [veritabanı indeksleme rehberimiz](/tr/posts/veritabani-indeksleme) buna eğiliyor. Şema değişikliklerini üretimde uygularken izolasyon davranışının nasıl etkileşime girdiğini [kesintisiz şema migrasyonları](/tr/posts/kesintisiz-sema-migrasyonlari) yazımızda ele aldık. Bağlantı havuzlaması yapıyorsanız [PgBouncer ile bağlantı havuzu](/tr/posts/pgbouncer-postgres-baglanti-havuzu) rehberi, transaction-mode havuzlamanın izolasyon varsayımlarını nasıl etkilediğini gösteriyor.

## İzolasyon Seviyesi Yerine Açık Kilitleme

Serializable'ın retry mantığı gerektirmesi bazı ekipler için kabul edilemez bir karmaşıklık — bu durumda alternatif, Read Committed'da kalıp kritik satırları açıkça kilitlemek. `SELECT ... FOR UPDATE`, okuduğunuz satırı işlem bitene kadar kilitler; başka bir işlem aynı satırı güncellemeye çalışırsa, sizin işleminiz commit ya da rollback olana kadar bekler.

```sql
BEGIN;

SELECT balance FROM accounts WHERE id = 42 FOR UPDATE;
-- başka bir işlem aynı satırı burada güncellemeye çalışırsa bekler
UPDATE accounts SET balance = balance - 100 WHERE id = 42;

COMMIT;
```

Bu yaklaşımın Serializable'a göre farkı: hata fırlatıp yeniden denetmek yerine, çakışan işlem sırasını beklemeye zorlar — retry mantığı yazmanıza gerek kalmaz ama yüksek eşzamanlılıkta bekleyen işlemler birikip kilitlenme (deadlock) riski oluşturabilir. Hangi satırların kilitleneceği önceden biliniyorsa (tek bir hesap bakiyesi gibi) bu genelde Serializable'dan daha öngörülebilir bir seçim.

## Somut Bir Senaryo: Neden Bu Fark Önemli

Diyelim ki bir stok yönetim sisteminde iki farklı istek aynı anda aynı ürünün stok sayısını okuyup düşürüyor: her ikisi de "stok: 5" görüyor, her ikisi de "stok: 4" yazıyor — oysa iki sipariş de karşılanmışsa stok aslında 3 olmalıydı. Read Committed'da bu senaryo hiçbir hata vermeden sessizce gerçekleşir çünkü her sorgu kendi anlık görüntüsünü görür ve diğerinin henüz commit olmamış değişikliğinden habersizdir. Aynı senaryo Postgres'te Repeatable Read veya Serializable ile çalıştırılırsa, ikinci işlem bir serialization hatasıyla geri alınır ve uygulama yeniden deneyip güncel stok değerini (4) görerek doğru şekilde düşürür. Bu fark, "neden envanterimiz bazen negatife düşüyor" gibi hata ayıklaması haftalarca sürebilecek üretim sorunlarının kök nedenidir.

## Sıkça Sorulan Sorular

### Postgres'in varsayılan izolasyon seviyesi nedir?

Read Committed. Her sorgu kendi başladığı andaki commit edilmiş veriyi görür; aynı işlem içindeki ardışık sorgular farklı sonuçlar verebilir çünkü aralarında başka işlemler commit olmuş olabilir.

### Repeatable Read phantom read'i engeller mi?

SQL standardında hayır, ama Postgres'in Repeatable Read uygulaması Snapshot Isolation kullandığı için evet — Postgres'te bu seviye standardın izin verdiğinden daha güçlü bir garanti sunar.

### Serializable neden işlemleri iptal ediyor?

Veritabanı iki eşzamanlı işlemin sonucunun, onları sırayla çalıştırsaydınız elde edeceğiniz sonuçtan farklı olabileceğini tespit ettiğinde, tutarlılığı korumak için işlemlerden birini iptal eder. Uygulamanın bu hatayı yakalayıp yeniden denemesi gerekir.

### Lost update'i hangi izolasyon seviyesi engeller?

SQL standardının asgari garantisinde sadece Serializable. Ama Postgres'te Repeatable Read ve Serializable'ın ikisi de lost update'i engeller — aynı satırı eşzamanlı güncelleyen ikinci işlem sessizce ezmek yerine bir serialization hatasıyla geri alınır ve yeniden denenmesi gerekir. Read Committed'da ise bu koruma yok; kritik güncellemeler için `SELECT ... FOR UPDATE` gibi açık kilitleme kullanmanız gerekir.
