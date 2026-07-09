---
title: "N+1 Sorgu Problemi Nasıl Çözülür"
slug: "n-plus-one-sorgu-problemi"
translationKey: "fix-n-plus-one-queries"
locale: "tr"
excerpt: "Bir liste endpoint'i 400 sorgu atıyordu, sayfa 6 saniyede açılıyordu. N+1 problemini nasıl tespit ettik, eager loading ile nasıl 400'den 2 sorguya indirdik."
category: "software-engineering"
tags: ["databases", "performance", "backend", "sql"]
publishedAt: "2026-07-09"
seoTitle: "N+1 Sorgu Problemi: Tespit ve Çözüm Rehberi"
seoDescription: "Bir liste endpoint'i 400 sorgu atıyordu, sayfa 6 saniyede açılıyordu. N+1 problemini nasıl tespit ettik, eager loading ile nasıl 400'den 2 sorguya indirdik."
---

Bir müşteri "sipariş listesi sayfası çok yavaş açılıyor" diye bildirdi. Sayfada 200 sipariş vardı, her biri bir müşteri adı ve bir ürün adı gösteriyordu. Query log'larına baktığımızda gördük: liste için 1 sorgu, sonra her sipariş için ayrı ayrı müşteri sorgusu (200 sorgu), sonra her sipariş için ayrı ayrı ürün sorgusu (200 sorgu daha). Toplam 401 sorgu, sayfa açılışı 6 saniye. Bu, N+1 probleminin klasik hâli ve ORM kullanan hemen her ekibin er ya da geç karşılaştığı bir hata.

## N+1 nedir, ORM'ler neden bunu üretir

N+1 sorgu problemi, bir liste çekmek için 1 sorgu attıktan sonra, listedeki her öğe için ilişkili veriyi ayrı ayrı çekmek üzere N ek sorgu atmaktır. Sorun, modern ORM'lerin **lazy loading**'i varsayılan davranış yapmasından kaynaklanıyor: `order.customer.name` yazdığınızda ORM, siz bu satırı çalıştırana kadar müşteri verisini çekmiyor — ve döngü içinde her satırda bu "tembel" erişim yeni bir sorgu tetikliyor. Kod tek başına bakıldığında tamamen masum görünüyor; sorun yalnızca çalışma zamanında, sorgu sayısı loglandığında ortaya çıkıyor.

```js
// N+1 üreten kod - masum görünüyor
const orders = await Order.findAll({ limit: 200 });
for (const order of orders) {
  const customer = await order.getCustomer(); // her satırda +1 sorgu
  const product = await order.getProduct();   // her satırda +1 sorgu daha
  console.log(customer.name, product.name);
}
```

## Tespit etme: query log'ları, APM ve test assertion'ları

N+1'i production'da fark etmeden önce yakalamanın üç yolu var. Birincisi, geliştirme ortamında SQL query log'unu açık tutmak — Rails'in `bullet` gemi ya da Django'nun `django-debug-toolbar`'ı bunu otomatik olarak işaretliyor. İkincisi, APM araçlarında (Datadog, New Relic) bir endpoint'in sorgu sayısını zaman içinde izlemek; sorgu sayısı veri hacmiyle orantılı büyüyorsa (200 sipariş → 401 sorgu, 400 sipariş → 801 sorgu) bu N+1'in imzasıdır. Üçüncüsü — ve en güvenilir olanı — testlere bir **sorgu bütçesi assertion'ı** eklemek: "bu endpoint kaç sipariş dönerse dönsün en fazla 3 sorgu atmalı" gibi bir sınır koymak, regresyonu commit aşamasında yakalar.

## Çözüm 1: Eager loading (JOIN)

En doğrudan çözüm, ilişkili veriyi baştan tek bir sorguda (genelde bir JOIN ile) çekmektir. Çoğu modern ORM bunu bildirimsel olarak destekliyor:

```js
// Sequelize - eager loading ile tek sorgu
const orders = await Order.findAll({
  limit: 200,
  include: [Customer, Product],
});
```

```python
# Django - select_related ile tek sorgu (JOIN)
orders = Order.objects.select_related('customer', 'product')[:200]
```

Bu, 401 sorguyu 1'e indiriyor. Prisma, TypeORM, ActiveRecord'un `includes` metodu ve Django'nun `select_related`/`prefetch_related` çifti aynı fikri farklı isimlerle sunuyor: ilişkiyi baştan bildirin, ORM JOIN'i kendisi kursun.

## Çözüm 2: Dataloader ile batch loading

Eager loading her zaman mümkün değil — özellikle GraphQL resolver'larında, her alan bağımsız çözüldüğü için hangi ilişkilerin gerekeceğini baştan bilemezsiniz. Bu durumda **dataloader** deseni devreye giriyor: tek bir istek döngüsü içindeki tüm "bu müşteriyi getir" çağrılarını toplar, tek bir `WHERE id IN (...)` sorgusuyla toplu olarak çeker.

```js
const customerLoader = new DataLoader(async (customerIds) => {
  const customers = await Customer.findAll({ where: { id: customerIds } });
  const byId = new Map(customers.map(c => [c.id, c]));
  return customerIds.map(id => byId.get(id)); // sıra korunmalı
});

// Resolver içinde N kez çağrılsa bile tek batch sorgu atılır
const customer = await customerLoader.load(order.customerId);
```

[GraphQL'in resmi dataloader kütüphanesi](https://github.com/graphql/dataloader) tam olarak bu senaryo için tasarlandı: bir GraphQL sorgusu 200 sipariş dönerken her biri kendi `customer` alanını bağımsız çözse bile, dataloader bunları tek bir event loop turu içinde toplayıp tek sorguya indiriyor.

## Ne zaman denormalizasyon ya da cache gerekir

Eager loading ve dataloader çoğu N+1'i çözer, ama bazen sorgu sayısı değil sorgu maliyeti sorun olur — örneğin ilişkili tablo çok büyükse JOIN'in kendisi yavaşlar. Bu noktada iki seçenek var: sık okunan, nadiren değişen bir alanı (örneğin sipariş satırında müşteri adının bir kopyasını) denormalize etmek, ya da sonucu bir cache katmanında (Redis) tutmak. [Veritabanı indeksleme yazımızda](/tr/posts/veritabani-indeksleme) ele aldığımız gibi, JOIN maliyetinin büyük kısmı çoğunlukla eksik bir foreign key indeksinden kaynaklanır — denormalizasyona geçmeden önce indeksleri kontrol etmek genelde daha ucuz bir ilk adım.

| Çözüm | Ne zaman uygun | Sorgu sayısı |
|---|---|---|
| Eager loading (JOIN) | İlişkiler baştan biliniyor, REST API | N+1 → 1 |
| Dataloader (batch) | GraphQL resolver'ları, alan bazlı çözümleme | N+1 → 2 (liste + batch) |
| Projeksiyon (yalnızca gereken sütunlar) | Geniş tablolarda gereksiz veri taşımayı azaltmak için | Değişmez, veri hacmi azalır |
| Denormalizasyon | JOIN'in kendisi pahalıysa, okuma çok sık yazma nadirse | 1, ama veri tutarlılığı riski var |
| Cache (Redis vb.) | Aynı veri tekrar tekrar okunuyorsa | 0 (cache hit durumunda) |

## Regresyon testi: sorgu bütçesini kod tabanına gömmek

Bir düzeltme yaptıktan sonra en değerli iş, bunun tekrar bozulmayacağını garanti etmek. Bir test, endpoint'e istek atıp harcanan sorgu sayısını sayar ve bir üst sınırla karşılaştırır:

```js
test('sipariş listesi endpoint\'i sabit sayıda sorgu atar', async () => {
  const queryCountBefore = db.getQueryCount();
  await request(app).get('/orders?limit=200');
  const queryCount = db.getQueryCount() - queryCountBefore;

  expect(queryCount).toBeLessThanOrEqual(3); // liste + batch customer + batch product
});
```

Bu test, [işe yarayan unit testler yazımızda](/tr/posts/unit-test-nasil-yazilir) savunduğumuz "davranışı değil sözleşmeyi test et" prensibinin tam bir örneği: sorgu sayısı bir performans sözleşmesidir ve bu sözleşme bir kod incelemesiyle değil bir assertion'la korunur. Sınırı çok sıkı koymamak da önemli — "tam olarak 3" yerine "en fazla 3" yazmak, ORM'nin iç uygulaması değiştiğinde (örneğin bir versiyon güncellemesiyle) testin gereksiz yere kırılmasını önler.

Açıkçası bu olaydan çıkardığım en büyük ders şuydu: N+1, kötü yazılmış kodun değil, "her satır bağımsız bir nesne" zihniyetinin sonucu. Kod tek satır için doğru görünüyor; sorun yalnızca ölçekte ortaya çıkıyor. [REST mi GraphQL mi karşılaştırmamızda](/tr/posts/rest-mi-graphql-mi) da değindiğimiz gibi, GraphQL'in esnek alan çözümlemesi bu riski büyütüyor — dataloader'sız bir GraphQL API, N+1 üretmek için neredeyse davetiye çıkarıyor. [Temiz kod prensipleri kontrol listemizde](/tr/posts/temiz-kod-prensipleri) de belirttiğimiz gibi, veri erişim mantığını iş mantığından ayırmak bu sınıf hataları erken yakalamayı kolaylaştırıyor.

Daha fazla mühendislik pratiği için [Yazılım Mühendisliği kategorisine](/tr/category/yazilim-muhendisligi) göz atın.

## Sıkça Sorulan Sorular

### N+1 sadece ORM kullanan projelerde mi olur?

Hayır, ama ORM'ler bunu çok daha kolay üretiyor çünkü lazy loading'i şeffaf hale getiriyorlar. Ham SQL yazan bir ekip de aynı hatayı yapabilir — döngü içinde sorgu atmak — ama bunu fark etmesi genellikle daha kolay çünkü sorgu satırı doğrudan görünür.

### Her zaman eager loading mi kullanmalıyım, dataloader mı?

REST API'lerde ve ilişkilerin baştan bilindiği durumlarda eager loading daha basit ve yeterli. GraphQL gibi alan bazlı, esnek sorgulama yapılan sistemlerde dataloader daha doğru çözüm çünkü hangi alanların isteneceğini derleme zamanında bilemezsiniz.

### Eager loading her zaman daha mı hızlı?

Genelde evet ama istisnası var: çok geniş bir ilişkiyi (örneğin bir müşterinin 10.000 siparişini) her seferinde eager yüklemek, aslında hiç kullanılmayacak veriyi taşımak anlamına gelebilir. Bu durumda sayfalama ile birlikte lazy loading, ya da yalnızca gereken alanları çeken bir projeksiyon daha uygun olabilir.

### N+1'i production'a çıkmadan nasıl yakalarım?

CI'da bir sorgu bütçesi testi çalıştırmak en güvenilir yöntem. Kod incelemesi sırasında döngü içinde ORM ilişki erişimi (`order.customer`, `order.getCustomer()`) aramak da işe yarar ama insan gözü kaçırabilir; otomatik bir assertion kaçırmaz.
