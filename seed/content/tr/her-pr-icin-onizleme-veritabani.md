---
title: "Her PR için Dallanan Önizleme Veritabanları"
slug: "her-pr-icin-onizleme-veritabani"
translationKey: "branching-preview-databases-pr-2026"
locale: "tr"
excerpt: "Kısa cevap: copy-on-write dallanma ile her PR saniyeler içinde kendi izole Postgres veritabanını alır, veri kopyalamadan ve staging'i kilitlemeden."
category: "devops-cloud"
tags: ["databases", "ci-cd", "postgresql", "devops"]
publishedAt: "2026-09-19"
seoTitle: "Her PR için Kendi Veritabanı: Copy-on-Write Dallanma"
seoDescription: "Kısa cevap: copy-on-write dallanma ile her PR saniyeler içinde kendi izole Postgres veritabanını alır, veri kopyalamadan ve staging'i kilitlemeden."
---

Kısa cevap: her pull request'e paylaşılan bir staging veritabanı yerine copy-on-write (yaz-üzerine-kopyala) dallanma ile kendi izole Postgres veritabanını verin. Yeni dal, ebeveyn dalın bir işaretçisi olarak başlar, sadece değiştirdiğiniz sayfaları ayrıca saklar — 100 GB'lık bir veritabanını dallandırmak birkaç saniye sürer ve siz yazana kadar ekstra depolama harcamaz.

## Paylaşılan staging veritabanı neden sorun çıkarır?

Tek bir staging veritabanını on kişilik bir ekip paylaştığında üç şey aynı anda kırılıyor: migration'lar çakışıyor, test verisi kirleniyor, ekipler birbirini blokluyor. Biri şema değişikliği deniyor, bir başkası aynı anda entegrasyon testi çalıştırıyor, üçüncü kişi manuel test verisi ekliyor — sonuç, kimsenin güvenmediği ve herkesin "önce ben" dediği ortak bir kaynak.

Bu model küçük ekiplerde bile ölçeklenmiyor çünkü staging bir *kuyruk* hâline geliyor. Bir geliştirici migration'ını staging'e uygulayıp test ederken, aynı dalda çalışan bir başkası ya bekliyor ya da riski göze alıp üstüne yazıyor. PR sayısı arttıkça bu kuyruk uzuyor, insanlar staging'i atlayıp doğrudan production'a güvenmeye başlıyor — ki bu, önizleme ortamının var olma amacını tersine çeviriyor.

## Copy-on-write dallanma nedir?

Copy-on-write dallanma, bir veritabanının storage katmanında anlık, veri kopyalamayan bir kopyasını oluşturma yöntemidir. Yeni dal açıldığında sistem hiçbir veri sayfasını fiilen kopyalamaz; bunun yerine ebeveyn dalın durumuna işaret eden bir referans oluşturur ve yalnızca siz o dalda bir şeyi değiştirdiğinizde farklılaşan sayfaları ayrıca yazar.

Bunun pratik sonucu şu: 100 GB'lık bir production veritabanını dallandırmak, verinin boyutundan bağımsız olarak birkaç saniye sürer. Depolama maliyeti de aynı mantıkla çalışır — dal, yalnızca ebeveynden *saptığı* kadar ek alan tüketir, tam bir kopya için ödeme yapmazsınız. 2026 itibarıyla [Neon'un önizleme ortamları için dallanma yaklaşımına göre](https://neon.com/blog/branching-with-preview-environments), bu, üretim şemasıyla önceden tohumlanmış (pre-seeded) bir veritabanının bir saniyeden kısa sürede oluşturulabilmesi anlamına geliyor — her pull request kapandığında da otomatik olarak siliniyor.

## PR'a özel veritabanı CI'a nasıl bağlanır?

Tipik akış şu dört adımdan oluşur: PR açıldığında `main` ebeveyn dalından PR numarasıyla adlandırılmış bir dal oluşturun (örneğin `ci-pr-123`), migration'ları ve testleri bu dala karşı çalıştırın, PR kapandığında ya da birleştiğinde dalı silin. Bu genelde bir GitHub Action ile otomatikleştiriliyor — insan müdahalesi gerektirmeyen bir yaşam döngüsü.

```yaml
# .github/workflows/pr-database.yml
name: PR Preview Database

on:
  pull_request:
    types: [opened, synchronize, closed]

jobs:
  branch-database:
    runs-on: ubuntu-latest
    steps:
      - name: Create branch for this PR
        if: github.event.action != 'closed'
        run: |
          neonctl branches create \
            --name "ci-pr-${{ github.event.number }}" \
            --parent main

      - name: Run migrations against the branch
        if: github.event.action != 'closed'
        run: |
          DATABASE_URL=$(neonctl connection-string "ci-pr-${{ github.event.number }}") \
            npm run migrate

      - name: Delete branch on PR close
        if: github.event.action == 'closed'
        run: |
          neonctl branches delete "ci-pr-${{ github.event.number }}"
```

Her dal kendi compute endpoint'ini ve kendi bağlantı dizesini (connection string) alır — bu da izolasyonu tam kılar; bir PR'ın çalıştırdığı sorgular başka bir PR'ın dalını hiçbir şekilde etkilemez. Boşta kalan dallar sıfıra ölçeklenebilir (scale to zero), yani sadece ebeveynden farklılaşan kısım için fatura ödersiniz, tam bir veritabanı kopyası için değil — [Neon'un dallanma iş akışları dokümantasyonunda](https://neon.com/use-cases/branching-workflows) da bu model, geliştirici başına ya da CI çalıştırması başına dal açmak için öneriliyor.

## Bu yaklaşım container-per-PR'dan neden daha iyi?

Her PR için ayrı bir container veya veritabanı sunucusu ayağa kaldırmak da izolasyon sağlar, ama bunun bedeli var: yeni bir sunucu başlatmak dakikalar sürer, veriyi tohumlamak veya anonimleştirmek için ayrı bir adım gerekir, teardown çoğu zaman manuel kalır ya da unutulur. Copy-on-write dallanma aynı izolasyonu, ölçek büyüklüğünden bağımsız sabit bir hızda ve otomatik teardown ile verir.

| Yaklaşım | İzolasyon | Hız | Maliyet | Teardown |
|---|---|---|---|---|
| Paylaşılan staging DB | Yok — herkes aynı veriyi kullanır | Anında (kurulum yok) | Düşük, tek instance | Gerekmez, ama kirlenme birikir |
| Container/DB per PR | Tam | Dakikalar (provizyon + seed) | Yüksek, her PR tam kopya | Manuel, sıkça unutulur |
| Copy-on-write dal per PR | Tam | Saniyeler | Sadece fark kadar, idle'da sıfır | Otomatik, PR kapanınca |

Bu tablo aslında tek bir noktayı gösteriyor: instant, isolated, affordable, disposable — dört özellik birlikte gelmezse önizleme ortamı ölçeklenmez. Paylaşılan staging izole değil, container-per-PR hızlı ve ucuz değil. Copy-on-write dallanma dördünü aynı anda veriyor; [CI pipeline'ları için otomatik veritabanı oluşturmayı karşılaştıran bir incelemeye göre](https://neon.com/faqs/best-postgres-platforms-automatic-database-creation-ci-pipeline) de bu kombinasyon, klasik "her PR için yeni sunucu" yaklaşımına kıyasla pipeline süresini saniyelere indiriyor.

## Production verisi içeren dallarda gizlilik nasıl korunur?

Bir dal, ebeveyninde ne varsa onu devralır — ebeveyn production'sa ve gerçek kullanıcı verisi (PII) içeriyorsa, PR dalı da aynı veriyi taşır. Bunun için iki yol var: ya zaten anonimleştirilmiş bir staging dalından dallanmak, ya da dal oluşturulduktan hemen sonra, CI ortamında kullanılmadan önce bir maskeleme adımı çalıştırmak. İkinci yol daha esnek ama pipeline'a bir adım daha ekler; ilk yol daha basit ama anonimleştirilmiş staging dalının güncel tutulmasını gerektirir. [Veritabanı yedekleme ve felaket kurtarma yazımızda](/tr/posts/veritabani-yedekleme-ve-felaket-kurtarma) ele aldığımız "hangi kopyanın nerede yaşadığını bilin" ilkesi burada da geçerli: her dalın hangi ebeveynden türediğini ve o ebeveynin veri hassasiyet düzeyini net tutmak, gizlilik hatalarının en ucuz önlemi.

## Migration'ları merge öncesi test etmek neden işe yarar?

Bir dal, gerçek ve tam işlevsel bir Postgres örneği olduğu için, PR'ınızın şema migration'ını merge etmeden önce o dala karşı çalıştırabilirsiniz. Bu, migration hatasını paylaşılan `main` veritabanında değil, izole bir ortamda yakalamanız anlamına gelir — üretim etkisi sıfır, geri dönüş maliyeti sıfır. [Kesintisiz şema migrasyonları yazımızda](/tr/posts/kesintisiz-sema-migrasyonlari) anlattığımız expand-contract deseni bile, gerçek bir Postgres dalında denenmeden "güvenli" sayılmamalı; bir migration'ın teorik olarak geri alınabilir olması ile pratikte gerçek veriye karşı sorunsuz çalışması aynı şey değil.

Bu akış, bağlantı yönetimi tarafını da etkiliyor: her PR dalının kendi endpoint'i olduğu için, uygulamanızın [PgBouncer ile bağlantı havuzlama](/tr/posts/pgbouncer-postgres-baglanti-havuzu) stratejisini test ortamında da doğru yapılandırmanız gerekiyor — yoksa CI'da paralel çalışan onlarca PR job'u, her biri kendi dalına karşı, bağlantı limitlerini beklenmedik şekilde zorlayabilir.

## "Daha büyük bir staging sunucusu alırız" neden yanlış çözüm?

Paylaşılan staging'in tıkanıklığına genelde verilen cevap, sunucuyu büyütmek ya da ikinci bir staging kurmaktır. Bu yanlış ekonomi: sorun kaynak yetersizliği değil, *paylaşım*. İki staging'iniz olsa bile üç ekip aynı anda çalışıyorsa aynı çakışma iki kopyada da yaşanır, sadece hangi ikilinin çakıştığı değişir. Asıl çözüm veritabanı sayısını azaltmak değil, her iş birimine (PR, geliştirici, CI run) kendi veritabanını vermek — ve bunu, tam kopya maliyetine katlanmadan yapabilmek.

Bu yaklaşımı CI/CD pipeline'ınızın geri kalanına entegre etmek istiyorsanız [CI/CD pipeline nasıl kurulur yazımıza](/tr/posts/cicd-pipeline-nasil-kurulur) bakabilirsiniz; veritabanı dallanmasını genel pipeline mimarisine nerede oturttuğunuzu orada daha geniş ele alıyoruz. Postgres'i zaten uygulamanızın merkezi veri katmanı olarak kullanıyorsanız [her şey için Postgres yazımız](/tr/posts/her-sey-icin-postgres) da bu dallanma modelinin neden özellikle Postgres ekosisteminde bu kadar olgunlaştığını açıklıyor.

Daha fazla altyapı ve veritabanı pratiği için [DevOps & Bulut kategorisine](/tr/category/devops-bulut) göz atabilirsiniz.

## Sıkça Sorulan Sorular

### Her PR için ayrı veritabanı gerçekten gerekli mi?

Küçük, tek geliştiricili projelerde hayır — paylaşılan staging yeterli olabilir. Ama birden fazla kişi aynı anda migration çalıştırıyorsa veya test verisi birbirini kirletiyorsa, PR başına dal, çakışmaları sıfıra indiren en ucuz çözüm çünkü tam kopya maliyeti taşımıyor.

### Copy-on-write dallanma veri kaybı riski taşır mı?

Hayır, dallar birbirinden bağımsızdır. PR dalında yaptığınız bir `DROP TABLE` ya da hatalı migration yalnızca o dalı etkiler; ebeveyn dal (genelde `main` veya production) hiçbir şekilde değişmez çünkü dal kendi farklılaşan sayfalarını ayrı tutar.

### PR dalları ne kadar maliyete çıkar?

Depolama maliyeti yalnızca dalın ebeveynden *saptığı* kadar veriye orantılıdır, tam kopya için ödeme yapmazsınız. Compute tarafında da boşta kalan dallar sıfıra ölçeklenebildiği için, aktif olarak kullanılmayan bir PR dalı neredeyse hiç maliyet çıkarmaz.

### Dallanma production verisindeki gizli bilgileri de kopyalar mı?

Evet — bir dal ebeveyninde ne varsa onu devralır, PII de dahil. Bunu çözmek için ya zaten anonimleştirilmiş bir staging dalından dallanın ya da dal oluşturduktan hemen sonra, CI'da kullanılmadan önce bir maskeleme adımı çalıştırın.
