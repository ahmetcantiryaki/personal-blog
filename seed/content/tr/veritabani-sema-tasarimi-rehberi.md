---
title: "Veritabanı Şema Tasarımı: Pratik Rehber"
slug: "veritabani-sema-tasarimi-rehberi"
translationKey: "database-schema-design-guide"
locale: "tr"
excerpt: "Ürün büyüdükçe bozulmayan bir veritabanı şeması tasarlamak; varlık modelleme, normalizasyon, tip seçimi ve JSONB tuzaklarını kapsayan uçtan uca pratik rehber."
category: "software-engineering"
tags: ["databases", "postgresql", "sql", "software-architecture"]
publishedAt: "2026-08-09"
seoTitle: "Veritabanı Şema Tasarımı: Pratik Rehber"
seoDescription: "Varlık modelleme, normalizasyon, kısıt tasarımı, UUID vs bigint kararı ve JSONB tuzaklarıyla ürün büyüdükçe bozulmayan bir veritabanı şeması nasıl kurulur?"
---

İyi bir veritabanı şeması, altı ay sonra "bunu neden böyle yapmışız" dedirtmeyen şemadır. Şema tasarımının özü üç soruya indirgeniyor: verinizi hangi varlıklara ayıracaksınız, aralarındaki ilişkileri nasıl kısıtlayacaksınız ve hangi alanları ne zaman denormalize edeceksiniz. Bu üç kararı erken ve bilinçli vermek, ilerideki migration acısının büyük kısmını baştan önlüyor.

## Varlıkları ve İlişkileri Modellemek

Şemaya oturmadan önce, ürününüzdeki gerçek dünya kavramlarını (kullanıcı, sipariş, ürün) ayrı tablolara mı yoksa aynı tablonun sütunlarına mı dönüştüreceğinize karar vermeniz gerekiyor. Kural basit: bir varlık kendi başına var olabiliyorsa ve başka bir varlıkla çoktan-çoğa ya da birden-çoğa ilişkiye giriyorsa, ayrı bir tablo hak ediyor. "Sipariş kalemi" bunun klasik örneği — siparişin bir sütunu değil, kendi kimliği ve yaşam döngüsü olan ayrı bir varlık.

İlişkileri çizerken en sık atlanan nokta, kardinaliteyi (bire-bir, bire-çok, çoktan-çoğa) baştan netleştirmemek. Çoktan-çoğa ilişkiler için ayrı bir bağlantı (junction) tablosu gerekiyor; bunu atlayıp bir tarafa dizi ya da JSON sütunu koymak, kısa vadede hızlı ama uzun vadede sorgulanamaz bir veri yapısına dönüşüyor.

## Normalizasyon ve Bilinçli Denormalizasyon

3NF'e (üçüncü normal form) kadar normalize etmek, çoğu OLTP şeması için makul bir varsayılan: her tablo tek bir varlığı temsil eder, her sütun o varlığın doğrudan bir özelliğidir ve tekrar eden veri yoktur. Bu, güncelleme anomalilerini (aynı bilgiyi iki yerde tutup birini güncellemeyi unutmak) yapısal olarak imkânsız hale getiriyor.

Erken denormalizasyon ise genellikle kazandırdığından daha fazlasına mal oluyor. Bir sipariş tablosuna "müşteri adı" sütunu eklemek başta bir join'i ortadan kaldırır gibi görünür, ama müşteri adını değiştirdiğinizde binlerce eski sipariş satırını güncellemeniz ya da tutarsızlığı kabul etmeniz gerekir. Denormalizasyon, ancak ölçüm gösterdiği yerde (gerçek bir performans darboğazı, kanıtlanmış join maliyeti) ve genelde bir önbellek/materialized view katmanı olarak eklenmeli — şemanın varsayılan tasarım ilkesi değil, bilinçli bir istisna olarak.

## Kısıtlar: Doğruluğun Kod Değil Şema Katmanında Garanti Edilmesi

`NOT NULL`, `UNIQUE`, `CHECK` ve yabancı anahtar kısıtları, uygulama kodunun unutabileceği kuralları veritabanı seviyesinde zorunlu kılıyor. Bir e-posta sütununu sadece uygulama tarafında "boş olamaz" diye doğrulamak, ikinci bir servis ya da toplu veri yükleme betiği devreye girdiği an kırılıyor; `NOT NULL` kısıtı bu bug sınıfını baştan imkânsız kılıyor.

```sql
CREATE TABLE orders (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id BIGINT NOT NULL REFERENCES customers(id),
  status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'shipped', 'cancelled')),
  total_cents INTEGER NOT NULL CHECK (total_cents >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Yabancı anahtarlar özellikle küçümsenen bir güvenlik ağı. `customer_id` üzerinde bir FK kısıtı olmadan, silinmiş bir müşteriye ait "hayalet" siparişler birikmeye başlıyor — ve bunu fark etmeniz genelde bir müşteri şikayeti kadar sürüyor.

## Tip Seçimi: UUID mi Bigint mi, Enum mu Lookup Tablosu mu

Birincil anahtar için UUID ile bigint arasındaki seçim, sandığınızdan daha fazla sonuç doğuruyor. Bigint sıralı, indeks dostu ve daha küçük; UUID ise dağıtık sistemlerde çakışmadan üretilebiliyor ve birincil anahtarı dışarı sızdırmanın (URL'de görünmesi gibi) güvenlik riskini azaltıyor.

| Kriter | Bigint | UUID (v4/v7) |
|---|---|---|
| İndeks boyutu | Küçük | Büyük (v4) / orta (v7) |
| Sıralı ekleme performansı | İyi | Kötü (v4) / iyi (v7) |
| Dağıtık üretim (çakışmasız) | Hayır | Evet |
| URL'de görünmesi güvenli mi | Hayır (tahmin edilebilir) | Evet |

Pratikte 2026 itibarıyla UUID v7 (zaman sıralı UUID) çoğu yeni proje için makul bir orta yol: dağıtık üretimin güvenliğini, sıralı ID'lerin indeks performansına yakın bir davranışla birleştiriyor.

Enum tipi ile lookup tablosu arasındaki seçim ise değişme sıklığına bağlı. Sipariş durumu gibi nadiren değişen, sabit bir küme için `CHECK` kısıtlı bir metin sütunu ya da native enum yeterli. Ama "ürün kategorisi" gibi yönetici panelinden eklenip çıkarılabilen bir küme için lookup tablosu (ayrı bir `categories` tablosu + FK) daha doğru — enum'a yeni değer eklemek genelde bir migration gerektirirken, lookup tablosuna satır eklemek gerektirmiyor.

## Soft Delete, Audit Kolonları ve JSONB Tuzağı

Soft delete (`deleted_at` sütunu) verinin fiziksel olarak silinmemesini sağlar ama her sorguya `WHERE deleted_at IS NULL` filtresi eklemeyi unutursanız "silinmiş" veri sızmaya başlar. Bunu bir view ya da ORM seviyesinde varsayılan filtre olarak zorunlu kılmak, insan hatasını en aza indiriyor.

JSONB, PostgreSQL'in en güçlü ama en kötüye kullanılan özelliklerinden biri. Değişken, seyrek doldurulan alanlar (kullanıcı tercihleri, üçüncü taraf webhook payload'ları) için gerçekten uygun. Ama sık sorgulanan, yapısı sabit alanları JSONB içine gömmek iki soruna yol açıyor: PostgreSQL, JSONB alanları için sütun istatistiği tutmadığı için sorgu planlayıcısı akıllı kararlar veremiyor ve JSONB alanları için indeksleme normal sütunlara göre daha sınırlı. [EDB'nin PostgreSQL anti-pattern rehberinde](https://www.enterprisedb.com/blog/postgresql-anti-patterns-unnecessary-jsonhstore-dynamic-columns) de vurgulandığı gibi, JSON blob'larda veri tutmak sorgu planlayıcısını tablo ve sütun istatistiklerine dayanan mantıklı kararlar almaktan mahrum bırakıyor, indeksleme ve tarama tiplerinin çoğunu kaybettiriyor ve sizi oldukça ilkel operasyonlarla sınırlıyor. Kural basit: sık sorguladığınız veri sütun olsun, JSONB sadece meta veri ya da nadiren dokunulan alanlar için kalsın.

Bunun somut bir örneği, bir e-ticaret şemasında "ürün özellikleri" alanı. Renk ve beden gibi neredeyse her üründe filtrelemede kullanılan özellikler ayrı sütun (ya da ayrı bir `product_variants` tablosu) olmalı; ürüne özgü, nadiren filtrelenen teknik detaylar (garanti süresi, üretici kodu gibi) ise JSONB'de rahatça durabilir. Bu ayrımı baştan netleştirmemek, altı ay sonra "neden bu filtre bu kadar yavaş" sorusunun cevabını JSONB içinde arayan bir ekiple sonuçlanıyor.

## Şemayı Güvenle Evrimleştirmek

Şema tasarımı tek seferlik bir karar değil, sürekli evrilen bir süreç. Yeni bir sütun eklemek genelde güvenli, ama `NOT NULL` bir sütun eklemek ya da tip değiştirmek mevcut satırları kilitleyebilir. [Kesintisiz şema migrasyonları yazımızda](/tr/posts/kesintisiz-sema-migrasyonlari) bu konuyu ayrıntılı işledik; kısa özet, büyük değişiklikleri küçük, geri alınabilir adımlara bölmek ve önce nullable ekleyip sonra backfill yapmak.

## Şema İnceleme Kontrol Listesi

Yeni bir tablo ya da migration'ı merge etmeden önce şu listeyi gözden geçirmek işe yarıyor:

- Her tablonun tek, net bir sorumluluğu var mı?
- Zorunlu her ilişki için FK kısıtı tanımlı mı?
- Boş olamayacak sütunlar `NOT NULL` mı?
- Sık sorgulanan alanlar sütun mu, yoksa yanlışlıkla JSONB içine mi gömülmüş?
- Birincil anahtar tipi (bigint/UUID) erişim örüntüsüne uygun mu?
- Migration geriye dönük uyumlu mu, yoksa uygulamayı kesintiye mi uğratıyor?

Bu kontrol listesini [veritabanı indeksleme rehberimizle](/tr/posts/veritabani-indeksleme) ve [transaction izolasyon seviyeleri yazımızla](/tr/posts/veritabani-izolasyon-seviyeleri) birlikte okumak, şemanın sadece doğru değil aynı zamanda performanslı ve tutarlı kalmasını sağlıyor. [PostgreSQL'in resmi dokümantasyonu](https://www.postgresql.org/docs/current/ddl-constraints.html) kısıtlarla ilgili her detay için hâlâ en güvenilir referans.

## Sıkça Sorulan Sorular

### Her zaman 3NF'e kadar normalize etmeli miyim?

Genel kural olarak evet, özellikle işlemsel (OLTP) sistemlerde. Raporlama ya da analitik amaçlı tablolarda kasıtlı denormalizasyon (örneğin bir data warehouse'da) makul, ama bu ayrı bir katman olarak eklenmeli, ana şemanın varsayılanı olmamalı.

### UUID mi bigint mi kullanmalıyım?

Tek sunuculu, klasik bir uygulamada bigint hâlâ en performanslı seçim. Dağıtık üretim, mikroservisler arası paylaşım ya da birincil anahtarın dışarıya sızmaması gerekiyorsa UUID v7'yi tercih edin.

### JSONB kullanmak her zaman kötü mü?

Hayır. Değişken şemalı, nadiren sorgulanan veri için (kullanıcı ayarları, webhook payload'ları) JSONB doğru araç. Sorun, sık sorgulanan ve yapısı sabit alanları da JSONB'ye gömmeye başladığınızda ortaya çıkıyor.

### Soft delete yerine gerçek silme (hard delete) ne zaman tercih edilmeli?

KVKK/GDPR gibi düzenlemeler verinin gerçekten silinmesini gerektirdiğinde, ya da tablo boyutu soft-delete edilmiş satırlarla şişip performansı düşürdüğünde hard delete (genelde periyodik bir temizlik job'ı ile) daha doğru.
