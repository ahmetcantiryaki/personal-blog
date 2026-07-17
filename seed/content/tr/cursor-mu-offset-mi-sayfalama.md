---
title: "Cursor mu Offset mi: API Sayfalama"
slug: "cursor-mu-offset-mi-sayfalama"
translationKey: "cursor-vs-offset-pagination"
locale: "tr"
excerpt: "5000. sayfa neden bu kadar yavaş? OFFSET'in taradığı satırları, keyset/cursor sayfalamanın neden hem daha hızlı hem daha doğru olduğunu örneklerle anlatıyoruz."
category: "software-engineering"
tags: ["databases", "api-design", "performance", "postgresql"]
publishedAt: "2026-07-17"
seoTitle: "Cursor mu Offset mi: API Sayfalama Karşılaştırması"
seoDescription: "OFFSET/LIMIT sayfalamanın neden derin sayfalarda çöktüğünü, keyset/cursor sayfalamanın buna nasıl çözüm olduğunu sorgu örnekleri ve tablolarla anlatıyoruz."
---

5000. sayfayı isteyen bir kullanıcı neden 15 saniye bekliyor? Çünkü `OFFSET 99980 LIMIT 20` yazdığınızda Postgres önce 99.980 satırı tarayıp çöpe atıyor, ancak ondan sonra istediğiniz 20 satırı döndürüyor. Sorgu maliyeti offset değeriyle doğru orantılı büyüyor — sayfa 10.000'de "yavaş", sayfa 100.000'de çoğu zaman zaman aşımına uğruyor. Keyset (cursor) sayfalama bu taramayı tamamen ortadan kaldırıyor ve üstüne bir doğruluk hatasını da düzeltiyor.

## OFFSET Neden Yavaş: Taramanın Maliyeti

`LIMIT`/`OFFSET` sayfalama basit görünür ama veritabanı motoru offset'i "atlanacak" bir işaretçi gibi değerlendirmiyor. Sorgu planlayıcı sonuç kümesinin başından itibaren satırları tek tek işliyor, offset kadarını atıyor, kalanından limit kadarını döndürüyor. Yani `OFFSET 0` ile `OFFSET 100000` arasındaki fark, taranan satır sayısında yüz binlik bir farka denk geliyor — indeks olsa bile bu tarama maliyeti doğrudan sorgu süresine yansıyor.

```sql
-- Klasik offset sayfalama: 5000. sayfada 99.980 satır taranıp atılır
SELECT id, title, created_at
FROM articles
ORDER BY created_at DESC, id DESC
LIMIT 20 OFFSET 99980;
```

Küçük, durağan admin tabloları için bu sorun görünmez — birkaç bin satırda taramanın maliyeti milisaniyeler mertebesinde kalır. Ama büyüyen, sık yazılan bir tabloda offset büyüdükçe gecikme de doğrusal artar.

## Keyset (Cursor) Sayfalama: İndeks Seek ile Sabit Maliyet

Keyset sayfalama, "kaçıncı satırdayım" yerine "hangi değerden sonrasını istiyorum" sorusunu sorar. Sıralama sütun(lar)ının son gördüğünüz değerini bir sonraki isteğe cursor olarak taşırsınız; veritabanı bu değeri doğrudan indeksten arayıp (index seek) devamını döndürür — önceki satırları taramaz.

```sql
-- Keyset sayfalama: her sayfa sabit maliyetli bir index seek
SELECT id, title, created_at
FROM articles
WHERE (created_at, id) < ('2026-07-10 09:14:00', 48213)
ORDER BY created_at DESC, id DESC
LIMIT 20;
```

Bu sorgu 1. sayfada da 5000. sayfada da aynı maliyete sahiptir çünkü B-tree indeks, taramaya değil doğrudan seek'e dayanır. `(created_at, id)` bileşik anahtarını kullanmak önemli — sadece `created_at` kullanırsanız aynı zaman damgasına sahip satırlarda sıralama belirsizleşir; `id` ikinci sütun olarak eklendiğinde her satır kombinasyonu benzersiz ve deterministik hale gelir.

| Kriter | OFFSET/LIMIT | Keyset/Cursor |
|---|---|---|
| Sorgu maliyeti | Offset ile doğrusal büyür | Sayfa numarasından bağımsız, sabit |
| Belirli sayfaya atlama | Doğrudan destekler (`page=42`) | Doğrudan desteklemez, sıralı gezinme gerekir |
| Ekleme/silme sırasında tutarlılık | Satır kayması nedeniyle atlama/tekrar riski var | Cursor'a göre sabit, atlama/tekrar olmaz |
| İdeal kullanım | Küçük, durağan, admin arayüzü verisi | Büyüyen, sık güncellenen, sonsuz kaydırmalı listeler |

## Gizli Doğruluk Hatası: Kayan Satırlar

OFFSET sayfalamanın performans sorununun ötesinde, sessizce yanlış sonuç üreten bir doğruluk hatası da var. Kullanıcı 2. sayfayı görüntülerken biri 1. sayfadaki bir kaydı silerse, tüm sonraki satırlar bir pozisyon yukarı kayar; kullanıcının 3. sayfada görmesi gereken bir kayıt artık 2. sayfaya kaymıştır ve kullanıcı onu hiç görmeden atlar. Tam tersi durumda — araya yeni bir kayıt eklenirse — bir kayıt iki kez gösterilebilir. Bu, "sayfayı yeniledim, bir ürün kayboldu" şeklindeki hata bildirimlerinin klasik kaynağıdır.

Keyset sayfalama bu sorunu yapısal olarak ortadan kaldırır: her sayfa "son gördüğüm değerden sonrası" diye tanımlandığı için, listenin başındaki ekleme/silmeler sonraki sayfaların referans noktasını etkilemez. Kullanıcı asla bir kaydı atlamaz ya da iki kez görmez — tabii cursor'ın kendisi (son görülen değer) sabit kaldığı sürece.

## Ne Zaman OFFSET Yeterli

Her sayfalamayı keyset'e çevirmek gerekmiyor. Veri kümesi küçük ve nadiren değişiyorsa (bir ayar sayfasındaki 200 satırlık kullanıcı listesi gibi), OFFSET'in doğrusal maliyeti pratikte hiç hissedilmez ve "42. sayfaya git" gibi doğrudan sayfa numarası desteği kaybedilmez. Keyset'in asıl kazancı, satır sayısı on binleri aştığında ve/veya veri sık ekleme-silme görüyorsa ortaya çıkıyor — tam da sonsuz kaydırmalı akışların, API'lerin ve log görüntüleyicilerin tipik profili.

## Keyset İçin Doğru İndeks Şart

Keyset sayfalamanın hız kazancı, sıralama kriterinizle birebir eşleşen bir bileşik indeksin var olmasına bağlı. `ORDER BY created_at DESC, id DESC` ile sorgu atıyorsanız ama indeksiniz sadece `created_at` üzerindeyse, planlayıcı yine de ek bir sıralama adımına düşebilir ve beklediğiniz sabit maliyeti alamazsınız.

```sql
CREATE INDEX idx_articles_created_id
  ON articles (created_at DESC, id DESC);
```

Bu indeks olmadan keyset sorgunuz "doğru" çalışır ama "hızlı" çalışmaz — `EXPLAIN ANALYZE` ile plan çıktısında `Index Scan` yerine `Seq Scan` veya ek bir `Sort` düğümü görüyorsanız, indeksinizin sıralama sütunlarınızla eşleşmediğinin işaretidir.

## Toplam Sayfa Sayısını Hâlâ Göstermek İstiyorsanız

Keyset sayfalamanın en sık şikayet edilen eksiği, "toplam 1.240 sonuç, 62 sayfa" gibi bir özet göstermenin doğal olarak desteklenmemesi. Pratikte üç yol var: `COUNT(*)`'ı ayrı, önbelleklenmiş bir sorguyla periyodik olarak güncellemek (tam doğru ama gecikmeli); Postgres'in `pg_class.reltuples` gibi yaklaşık istatistiklerinden tahmini bir sayı üretmek (anlık ama kesin değil); ya da arayüzde toplam sayı yerine sadece "sonraki/önceki" gezinmesi sunup toplamı hiç göstermemek. Çoğu üretim API'si (Stripe, GitHub) üçüncü yolu seçiyor — `has_more` bayrağı dönüyor, toplam sayı vermiyor; bu da hem performans hem de tutarlılık açısından en temiz çözüm.

## GraphQL'de Cursor: Relay Bağlantı Kalıbı

GraphQL API'leri tasarlıyorsanız keyset sayfalamanın standart bir kalıbı zaten var: Relay'in bağlantı (connection) spesifikasyonu. `edges`, `node`, `cursor` ve `pageInfo { hasNextPage, endCursor }` alanlarından oluşan bu yapı, keyset mantığının üstüne ince bir sözleşme katmanı ekliyor ve istemci kütüphanelerinin (Apollo, Relay) bunu otomatik önbellekleme ve sayfa birleştirme için kullanmasını sağlıyor. REST API'nizi keyset'e taşıyorsanız, aynı `cursor`/`hasNextPage` sözleşmesini benimsemek istemci tarafında da tutarlılık sağlar.

Üretimde cursor'ı ham `(created_at, id)` çiftini URL'ye koymak yerine base64 ile opak bir token'a çevirmek yaygın pratiktir — hem istemcinin sıralama sütunlarınıza bağımlı hale gelmesini önler hem de iç şema değişikliklerinde API sözleşmesini bozmaz.

```javascript
function encodeCursor(createdAt, id) {
  const raw = JSON.stringify({ createdAt, id });
  return Buffer.from(raw).toString('base64url');
}

function decodeCursor(cursor) {
  return JSON.parse(Buffer.from(cursor, 'base64url').toString());
}
```

Bu yaklaşım Stripe, Slack ve GitHub gibi büyük ölçekli API'lerin de tercih ettiği model — cursor istemci için anlamsız bir string, sunucu için ise doğrudan bir indeks anahtarı. Cursor'ı imzalamak (HMAC ile) isteğe bağlı bir ek güvenlik katmanı: istemcinin cursor içeriğini değiştirip veritabanınıza rastgele bir sıralama değeri enjekte etmesini engeller — özellikle cursor'a ek filtre parametreleri gömüyorsanız bu adımı atlamamak gerekir.

Sayfalamayı hızlandırdıktan sonra sırada genelde indeks stratejisi gelir; [veritabanı indeksleme rehberimiz](/tr/posts/veritabani-indeksleme) hangi sütunların bileşik indekse gireceğini örneklerle gösteriyor. Sayfalanan sorgularınız ilişkili tablolardan veri çekiyorsa [N+1 sorgu problemi](/tr/posts/n-plus-one-sorgu-problemi) yazımız da aynı listelemede karşınıza çıkabilecek ikinci bir performans tuzağını ele alıyor. Sayfalama sonuçlarınızı önbelleğe alıyorsanız [cache stratejileri ve geçersiz kılma](/tr/posts/cache-stratejileri-gecersiz-kilma) rehberimize göz atın.

## Sıkça Sorulan Sorular

### Keyset sayfalama ile belirli bir sayfa numarasına atlayabilir miyim?

Doğrudan değil. Keyset sayfalama "önceki/sonraki" mantığıyla çalışır; "42. sayfaya git" gibi bir özelliğe ihtiyacınız varsa OFFSET'i koruyup sadece derin sayfalarda ek bir optimizasyon (örneğin tahmini sayım) uygulamanız gerekebilir.

### Keyset sayfalama için hangi sütunlar cursor olmalı?

Sıralama kriterinizdeki sütun(lar) artı benzersizliği garanti eden bir sütun (genelde birincil anahtar `id`). `ORDER BY created_at DESC, id DESC` kullanıyorsanız cursor da bu iki değeri taşımalı.

### OFFSET sayfalama gerçekten ne zaman sorun olur?

Tablo satır sayısı on binleri aştığında ve kullanıcılar derin sayfalara (5. sayfanın ötesi) gittiğinde fark hissedilir başlar; yüz binler mertebesinde offset'lerde sorgu süresi kullanılabilirliği bozacak seviyeye çıkabilir.

### Sonsuz kaydırma (infinite scroll) için hangisini seçmeliyim?

Keyset. Sonsuz kaydırma zaten "bir sonraki grubu getir" mantığıyla çalıştığı için keyset'in doğal kullanım alanı; ayrıca kullanıcı kaydırırken arka planda eklenen/silinen kayıtlar yüzünden tekrar veya atlama yaşamazsınız.
