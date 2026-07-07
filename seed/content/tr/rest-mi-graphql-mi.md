---
title: "REST mi GraphQL mi: Doğru API Seçimi"
slug: "rest-mi-graphql-mi"
translationKey: "rest-vs-graphql"
locale: "tr"
category: "software-engineering"
tags: ["api-design", "rest", "graphql", "backend"]
publishedAt: "2026-07-03"
seoTitle: "REST mi GraphQL mi: 2026'da Doğru API Seçimi"
seoDescription: "REST mi GraphQL mi tartışması 2026'da yanlış soru. tRPC ve gRPC'yi de içeren güncel karşılaştırma tablosu, gerçek gecikme rakamları ve karar rehberi içeride."
excerpt: "Çoğu geliştirici REST mi GraphQL mi meselesini iki atlı bir yarış sanıyor. Temmuz 2026 itibarıyla bu bakış eskidi. tRPC ve gRPC'yi de tabloya koyan dürüst karşılaştırma."
---

Çoğu geliştirici **REST mi GraphQL mi** sorusunu tek kemerli bir şampiyonluk maçı gibi tartışıyor: bir taraf seç, yayına al, code review'da savun. Temmuz 2026 itibarıyla bu, API tasarımını düşünmenin en işe yaramaz yolu. Dürüst cevap şu: ikisi de kesin galip değil, üretimde baskın desen ikisinin melezi ve herkes taraf tutarken iki yeni oyuncu soruyu sessizce baştan yazdı.

Konferans slaytına konmayan nüans şu: REST ve GraphQL *farklı* problemleri çözer. 2026'da asıl karar nadiren "hangisi", çoğu zaman "hangi kombinasyon ve nerede" sorusudur. Bu yazıda ikisini üretim örnekleri ve güncel rakamlarla karşılaştırıyorum, sonra tRPC ve gRPC'yi aynı tabloya koyup gerçekten seçim yapabilmenizi sağlıyorum.

## REST ve GraphQL aslında ne demek?

REST çok sayıda uç noktaya (`/users`, `/users/1/orders`) dayanır; her biri sunucunun belirlediği sabit bir veri şekli döner. GraphQL ise tek uç noktaya (`/graphql`) dayanır ve istemci, tam istediği alanları bir sorgu diliyle kendi tanımlar. Yük taşıyan fark şu: REST'te yanıtın şeklini sunucu, GraphQL'de istemci belirler.

REST, Roy Fielding'in 2000 tarihli tezinden gelen, HTTP fiilleriyle (`GET`, `POST`, `PUT`, `DELETE`) çalışan bir mimari stildir. GraphQL, Facebook'un 2015'te açık kaynaklattığı, 2019'dan beri [GraphQL Foundation](https://graphql.org/) tarafından yürütülen bir sorgu dilidir. Hem de canlı: [Eylül 2025 spesifikasyonu](https://spec.graphql.org/September2025/) 2021 sürümünün yerini alan güncel kararlı sürüm ve tamamlayıcı GraphQL-over-HTTP spesifikasyonu, eskiden her sunucunun kendi bildiğini okuduğu taşıma katmanı semantiğini nihayet standartlaştırdı.

Basit bir sezgi hâlâ geçerli: Mobil uygulamanız bir ekran için üç REST çağrısı yapıp gelen verinin yarısını atıyorsa, GraphQL tam olarak bunu öldürmek için tasarlandı. Tek uç noktanın sabit yanıtı her istemciye yetiyorsa, REST'in sadeliğini bırakmak size hiçbir şey kazandırmaz.

## Karşılaştırma tablosu: REST vs GraphQL vs tRPC vs gRPC

Bu tablonun iki sütunlu hâli 2021 kalıntısıdır. Aşağıdaki, ekiplerin Temmuz 2026 itibarıyla API katmanını gerçekten nasıl seçtiğine uyan sürüm.

| Boyut | REST | GraphQL | tRPC | gRPC |
|-------|------|---------|------|------|
| Uç nokta | Kaynak başına çok | Tek (`/graphql`) | RPC prosedürleri | HTTP/2 üstü RPC |
| Veri şeklini belirleyen | Sunucu | İstemci (sorgu) | Paylaşılan TS tipleri | Protobuf şeması |
| Over/under-fetching | Sık | Sorguyla önlenir | Minimum | Minimum |
| HTTP önbelleği | Doğal, URL bazlı | Zor, katman gerekir | Sınırlı | Sınırlı |
| Diller arası | Evrensel | Evrensel | Yalnız TypeScript | Mükemmel |
| Öğrenme eğrisi | Düşük | Orta-yüksek | Çok düşük (TS ekipleri) | Orta |
| En uygun | Kamuya açık & CRUD | Çok istemcili, iç içe | TS monorepo | Düşük gecikmeli iç servis |

Pratik kural: Kamuya açık, düz ve önbeklenebilir kaynaklar REST'e yaslanır. Aynı iç içe verinin farklı kesitlerini çeken çeşitli istemciler GraphQL'e yaslanır. TypeScript full-stack monorepo muhtemelen ikisini de değil, tRPC'yi ister. Gecikme bütçesi altında konuşan iki iç mikroservis gRPC ister. Bu tür bir ödünleşim matrisi tam olarak bir [sistem tasarımı mülakatında](/tr/posts/sistem-tasarimi-mulakati) karşınıza çıkar ve doğru kurmak, herhangi bir protokolü ezberlemekten daha önemlidir.

## REST hâlâ ne zaman kazanır?

Kaynaklar net tanımlıysa, HTTP önbelleği ve CDN önemliyse, API'niz kamuya açıksa veya üçüncü taraflarca tüketilecekse REST kullanın. Temmuz 2026 itibarıyla REST hâlâ kamuya açık web API'lerinin yaklaşık %83'ünün önünde duruyor ve ekiplerin yaklaşık %93'ü bir yerlerde REST yayınlıyor. Bu atalet değil, uyum.

REST'in parladığı yerler:

- **Kamuya açık API'ler:** Stripe, GitHub ve Twilio hâlâ REST sunuyor, artık neredeyse tümü OpenAPI 3.1 ile belgeleniyor. Keşfedilebilir, önbeklenebilir ve `curl` ile test edilebilir.
- **CDN ve tarayıcı önbelleği:** `GET /products/42` çağrısı `Cache-Control` ve `ETag` ile bedavaya önbeklenir. Bunu GraphQL'de tekrarlamak ciddi iş demektir.
- **Basit CRUD servisleri:** Az kaynak ve sığ ilişki, GraphQL şeması ve resolver katmanını gereksiz yük yapar.

Gerçek bir örnek: Bir SaaS müşterimizde ürün kataloğu API'sini önce GraphQL ile kurmuştuk. Ama yanıtların %90'ı aynı üç alanı istiyordu ve CDN önbeklemesini kaybetmek origin trafiğini 6 katına çıkardı. REST'e dönmek CDN isabet oranını %94'e taşıdı ve p95 gecikmeyi 210 ms'den 45 ms'ye düşürdü.

```http
# REST: her kaynak kendi URL'sinde, HTTP ile önbeklenebilir
GET /api/products/42 HTTP/1.1
Accept: application/json
Cache-Control: max-age=300

# Yanıt: sunucunun belirlediği sabit şekil
{ "id": 42, "name": "Kablosuz Kulaklık", "price": 1299, "stock": 17 }
```

Bu çağrının kaç alan döneceğini ve nasıl önbekleneceğini göndermeden bilirsiniz. Öngörülebilirlik ve önbellek, REST'in bütün değeri budur.

## GraphQL ek karmaşıklığını ne zaman hak eder?

Farklı istemcileriniz (web, iOS, Android) aynı verinin farklı kesitlerini istiyorsa, ilişkiler derin iç içeyse ve over-fetching ölçülebilirse GraphQL kullanın. Bağımsız 2026 benchmark'ları, birkaç REST gidiş-dönüşü gerektirecek karmaşık sorgularda GraphQL'i yaklaşık %28 daha hızlı (kabaca 180 ms'ye 250 ms) gösteriyor; buna karşılık REST saniyede yaklaşık %33 daha fazla basit istek karşılıyor. Dikkatli okuyun: kazanç gidiş-dönüş sayısıyla ilgili, protokolün ham hızıyla değil.

```graphql
# GraphQL: istemci tam istediği alanları tanımlar, tek istek
query {
  user(id: 42) {
    name
    orders(last: 3) {
      total
      items { productName price }
    }
  }
}
```

Bu tek sorgu, REST'te 3-4 çağrı gerektirecek veriyi döner. Ama GraphQL bedava değil. Üç şey şarttır. Birincisi, **N+1 koruması**: DataLoader gibi bir toplu yükleyici olmadan iç içe resolver'lar veritabanını döver. Bir üretim servisimizde tek istek, batching eklenmeden önce 340 SQL sorgusu üretmişti; bu patoloji [veritabanı indekslemeyi](/tr/posts/veritabani-indeksleme) de birden aciliyet hâline getirir. İkincisi, **sorgu derinliği ve karmaşıklık sınırı**; yoksa kötü niyetli bir istemci tek bir iç içe sorguyla sizi düşürür. Üçüncüsü, önbellek ve güvenlik için **kalıcı sorgular (persisted queries)**.

## 2026 sürprizi: tRPC ve gRPC soruyu değiştirdi

İşte iddialı görüş: Ekiplerin büyük bir kısmı için "REST mi GraphQL mi" sorusunun 2026 cevabı *hiçbiri*.

TypeScript yığınının iki ucuna da sahipseniz, [**tRPC v11**](https://trpc.io/blog/announcing-trpc-v11) (SSE abonelikleri ve birinci sınıf TanStack Start entegrasyonuyla geldi) size uçtan uca tip güvenliği verir: şema yok, codegen yok, neredeyse sıfır istemci boilerplate. API'niz artık tipli fonksiyon çağrılarından ibaret. Bir monorepo için bu, elle REST handler ve istemci fetcher yazmaktan kesinlikle daha iyi bir geliştirici deneyimidir ve tipleri akıtmak için [ileri TypeScript kalıplarına](/tr/posts/ileri-typescript-kaliplari) dayanır. Şartı: yalnız TypeScript, yani kamuya açık veya çok dilli tüketici yok.

Gecikme bütçesi altında servis-servis iç trafik içinse **gRPC** ve Protobuf pragmatik varsayılan olmayı sürdürüyor; Connect protokolü ve Buf araçları geliştirici deneyimini üç yıl öncesine göre çok daha az sancılı yaptı. [Mikroservis mi monolit mi](/tr/posts/mikroservis-mi-monolit-mi) kararının API katmanı seçiminizi sessizce zorladığı yer tam burası: servisler arası fan-out RPC, gRPC'yi kamuya açık REST'in asla yapamayacağı biçimde ödüllendirir.

Asıl kazanan desen ise Backend-for-Frontend oldu: altta REST ve gRPC mikroservislerini toplayan bir GraphQL veya tRPC katmanı. Netflix, GitHub, Shopify ve The New York Times bunun bir sürümünü çalıştırıyor. 2026'nın olgun mimarileri ideolojik değil, pragmatik.

## REST mi GraphQL mi: nasıl karar veririm?

Şunları sırayla sorun ve ilk güçlü "evet"te durun:

1. **İki ucu da TypeScript'te mi tutuyorsunuz?** Her şeyden önce tRPC'ye uzanın.
2. **İç, gecikmeye duyarlı servis çağrıları mı?** gRPC.
3. **Kamuya açık veya üçüncü taraf tüketici, ya da önbellek kritik mi?** REST.
4. **Birden çok istemci iç içe verinin farklı kesitlerini mi çekiyor?** GraphQL, ilk günden N+1 ve derinlik sınırlarıyla.
5. **Büyük ve karışık mı?** REST/gRPC servisleri üstünde bir BFF katmanı; sıkıcı ama ölçeklenen cevap.

Ekip olgunluğunu dürüstçe hesaba katın: GraphQL, küçük bir ekibin sahip olmayabileceği N+1, derinlik saldırısı ve önbellek yönetimi uzmanlığı ister. Bu ödünleşimlerin dahası için [yazılım mühendisliği](/tr/category/yazilim-muhendisligi) yazılarımıza göz atın.

## Sıkça Sorulan Sorular

### REST mi GraphQL mi, hangisi daha hızlı?

Gidiş-dönüşe bağlı. Tek bir basit kaynak için REST, HTTP önbelleği sayesinde neredeyse her zaman daha hızlıdır. Bir ekran için 4 ayrı çağrı gerekiyorsa, GraphQL bunları tek isteğe indirerek toplam gecikmede kazanır; 2026 benchmark'larında kabaca %28. Hız farkı protokolden değil, kaç gidiş-dönüş yaptığınızdan gelir.

### GraphQL REST'in yerini alacak mı?

Hayır. Temmuz 2026 itibarıyla ikisi bir arada yaşıyor ve REST hâlâ kamuya açık API'lerin yaklaşık %83'ünün önünde. GraphQL çok istemcili, iç içe veri senaryolarında güçlü; REST kamuya açık API, basit CRUD ve önbellek gerektiren her şeyde varsayılan. Çoğu olgun ekip ikisini birlikte çalıştırıyor.

### tRPC ve gRPC bu tabloda nereye oturur?

tRPC, istemci ve sunucuyu birlikte kontrol ettiğiniz TypeScript monorepo için en iyi seçim; sıfır codegen ile uçtan uca tip güvenliği sunar. gRPC, düşük gecikmeli servis-servis iç çağrılar için varsayılan. İkisi de kamuya açık API'de REST'in yerini tutmaz ama kendi nişlerinde çoğu zaman GraphQL'i geçer.

### GraphQL'de en sık yapılan hata nedir?

N+1 sorgu problemi. İç içe resolver'lar her alt nesne için ayrı bir veritabanı sorgusu tetikleyerek performansı çökertir. Çözüm, DataLoader gibi bir batching katmanı ve sorgu derinliği ile karmaşıklığına konan sert sınırlar.
