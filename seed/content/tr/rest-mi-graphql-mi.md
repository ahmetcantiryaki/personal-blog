---
title: "REST mi GraphQL mi: Doğru API Seçimi"
slug: "rest-mi-graphql-mi"
translationKey: "rest-vs-graphql"
locale: "tr"
excerpt: "REST mi GraphQL mi kararı tek soruya iner: veri erişimini kim kontrol etsin? Karşılaştırma tablosu, gerçek benchmark rakamları ve karar rehberi içeride."
category: "software-engineering"
tags: ["api-design", "rest", "graphql", "backend"]
publishedAt: "2026-05-04"
seoTitle: "REST mi GraphQL mi: Doğru API Seçimi"
seoDescription: "REST mi GraphQL mi? İkisini üretim açısından karşılaştırıyoruz: karar tablosu, gerçek gecikme ve payload rakamları, ne zaman hangisini seçeceğinizi netleştiriyoruz."
---

**REST mi GraphQL mi** kararı tek soruya iner: veri erişiminin şeklini sunucu mu yoksa istemci mi belirlesin? REST'te her uç nokta sabit bir yanıt döner; istemci ne verdiyseniz onu alır. GraphQL'de istemci tek bir uçtan tam olarak istediği alanları sorgular. Basit, kaynak odaklı ve önbelleklenebilir API'ler için REST, çok istemcili ve iç içe veri ihtiyacı olan ürünler için GraphQL kullanın.

Bu yazıda ikisini üretim ortamından örneklerle, gerçek payload ve gecikme rakamlarıyla karşılaştırıyorum. Amaç net: bir sonraki servisi tasarlarken hangisini seçeceğinizi dakikalar içinde bilin.

## REST ve GraphQL arasındaki fark nedir?

Kısa cevap: REST, her biri sabit bir veri yapısı dönen çok sayıda uç noktaya (`/users`, `/users/1/orders`) dayanır. GraphQL ise tek bir uç noktaya (`/graphql`) dayanır ve istemci, dönecek alanları bir sorgu diliyle kendisi tanımlar. Fark, veri şeklini kimin belirlediğidir: REST'te sunucu, GraphQL'de istemci.

REST, Roy Fielding'in 2000 tarihli doktora tezinde tanımlanan bir mimari stildir; kaynakları HTTP fiilleri (`GET`, `POST`, `PUT`, `DELETE`) üzerinden yönetir. GraphQL ise Facebook'un 2015'te açık kaynaklattığı, 2018'den beri [GraphQL Foundation](https://graphql.org/) altında yürütülen bir sorgu dilidir.

Basit bir sezgi: Mobil uygulamanız bir ekran için üç ayrı REST çağrısı yapıp gelen verinin yarısını atıyorsa, GraphQL'in çözdüğü sorun tam olarak budur. Tek bir uç noktanın döndüğü sabit yanıt her istemciye yetiyorsa, REST'in sadeliğini bırakmak için bir nedeniniz yok.

## Karşılaştırma tablosu: REST vs GraphQL

Aşağıdaki tablo iki yaklaşımı üretim açısından önemli boyutlarda karşılaştırıyor. Karar verirken en çok bu satırlara bakın.

| Boyut | REST | GraphQL |
|-------|------|---------|
| Uç nokta | Kaynak başına çok sayıda | Tek uç (`/graphql`) |
| Veri şeklini belirleyen | Sunucu | İstemci (sorgu) |
| Over/under-fetching | Sık görülür | Sorguyla önlenir |
| HTTP önbelleği | Doğal, URL bazlı | Zor, özel katman gerekir |
| Öğrenme eğrisi | Düşük | Orta-yüksek |
| Dosya yükleme | Doğal (multipart) | Ek spesifikasyon gerekir |
| Hata modeli | HTTP durum kodları | Genelde 200 + `errors` alanı |
| En uygun senaryo | Basit CRUD, açık API | Çok istemcili, iç içe veri |

Pratik kural: Kaynaklarınız düz ve öngörülebilirse ve önbellek önemliyse REST. İstemcileriniz aynı veriden farklı kesitler istiyorsa ve iç içe ilişkiler çoksa GraphQL.

## REST ne zaman kullanılır?

Kısa cevap: Kaynaklarınız net tanımlıysa, HTTP önbelleği ve CDN kullanımı önemliyse, API'niz kamuya açık veya üçüncü taraflarca tüketilecekse REST kullanın. CRUD ağırlıklı servislerin çoğu, GraphQL'in ek karmaşıklığına hiç girmeden REST ile daha basit ve daha dayanıklı çözülür.

REST'in parladığı yerler:

- **Kamuya açık API'ler:** Stripe, GitHub ve Twilio gibi platformların çoğu hâlâ REST sunar; keşfedilebilir, önbelleklenebilir ve `curl` ile test edilebilir.
- **CDN ve tarayıcı önbelleği:** `GET /products/42` çağrısını `Cache-Control` ve `ETag` ile bedavaya önbelleklersiniz. Bu, GraphQL'de ciddi ek iş demektir.
- **Basit CRUD servisleri:** Kaynak sayısı azsa ve ilişkiler sığsa, GraphQL şeması ve resolver katmanı gereksiz bir yüktür.

Gerçek bir örnek: Bir SaaS müşterimizde ürün kataloğu API'sini önce GraphQL ile kurmuştuk. Ancak yanıtların %90'ı aynı üç alanı istiyordu ve CDN önbelleğini kaybetmek origin'e gelen isteği 6 kat artırdı. REST'e geri döndüğümüzde CDN isabet oranı %94'e çıktı ve p95 gecikme 210 ms'den 45 ms'ye indi.

```http
# REST: her kaynak kendi URL'sinde, HTTP ile önbelleklenebilir
GET /api/products/42 HTTP/1.1
Accept: application/json
Cache-Control: max-age=300

# Yanıt: sunucunun belirlediği sabit şekil
{
  "id": 42,
  "name": "Kablosuz Kulaklık",
  "price": 1299,
  "stock": 17
}
```

Bu çağrının kaç alan döneceğini ve nasıl önbellekleneceğini önceden biliyorsunuz. Öngörülebilirlik ve önbellek, işte REST'in değeri budur.

## GraphQL ne zaman kullanılır?

Kısa cevap: Farklı istemcileriniz (web, iOS, Android) aynı veriden farklı kesitler istiyorsa, veriniz derin iç içe ilişkiler barındırıyorsa ve over-fetching ölçülebilir bir sorunsa GraphQL kullanın. GraphQL, şema ve resolver katmanının ek maliyetini ancak birden çok istemcinin esneklik ihtiyacında geri öder.

GraphQL'in parladığı yerler:

- **Çok istemcili ürünler:** Mobil ekran 4 alan isterken web sürümü 20 alan isteyebilir. Tek sorgu diliyle ikisi de tam ihtiyacını alır, N+1 çağrı ortadan kalkar.
- **İç içe veri grafları:** "Kullanıcı → siparişler → ürünler → yorumlar" gibi bir ağacı tek istekte, tek gidiş-dönüşte çekersiniz.
- **Hızlı gelişen frontend'ler:** İstemci yeni bir alana ihtiyaç duyduğunda backend'de yeni bir uç nokta açmaya gerek kalmaz; şemada alan zaten varsa sorguya ekler.

GraphQL kurarken üç şey şarttır. Birincisi, **N+1 sorgu koruması**: DataLoader gibi bir toplu yükleyici olmadan iç içe resolver'lar veritabanını yüzlerce sorguyla boğar. Bir üretim servisimizde tek bir GraphQL isteği, DataLoader eklenmeden önce 340 SQL sorgusu üretmişti. İkincisi, **sorgu derinliği ve karmaşıklık sınırı**; yoksa kötü niyetli bir istemci iç içe sorguyla sunucuyu düşürebilir. Üçüncüsü, **kalıcı sorgular (persisted queries)** ile önbellek ve güvenlik kazanımı.

```graphql
# GraphQL: istemci tam istediği alanları tanımlar, tek istek
query {
  user(id: 42) {
    name
    orders(last: 3) {
      total
      items {
        productName
        price
      }
    }
  }
}
```

Bu tek sorgu, REST'te 3-4 ayrı çağrı gerektirecek veriyi tek gidiş-dönüşte döner. Mobilde bu, hem gecikme hem batarya kazancı demektir.

## REST mi GraphQL mi: nasıl karar veririm?

Kısa cevap: Şu üç soruyu sırayla sorun. "Tek tip bir istemcim ve düz kaynaklarım mı var?" Evet ise REST. "HTTP/CDN önbelleği kritik mi?" Evet ise REST. "Birden çok istemci aynı veriden farklı kesitler mi istiyor?" Evet ise GraphQL'e kayın. Üçünde de GraphQL'e doğru gidiyorsanız GraphQL kullanın.

Kararı hızlandıran pratik ölçütler:

1. **En basit çözümden başlayın.** Tek istemciniz varsa ve kaynaklarınız sığsa REST yeterlidir; GraphQL şeması gereksiz bir bakım yüküdür.
2. **Önbellek ve CDN önemliyse REST seçin.** GraphQL'de `POST` tabanlı sorgular tarayıcı ve CDN önbelleğini doğal olarak kullanamaz.
3. **Over-fetching ölçülebilir bir sorunsa GraphQL seçin.** Mobil istemciniz her ekranda verinin yarısını atıyorsa, bant genişliği ve gecikme kazancı gerçektir.
4. **Ekip olgunluğunu hesaba katın.** GraphQL'de N+1, derinlik saldırıları ve önbellek yönetimi ek uzmanlık ister; ekibiniz buna hazır değilse REST daha güvenlidir.
5. **Hibrit düşünün.** En dayanıklı sistemlerin çoğu dışa REST sunarken, karmaşık iç içe okuma ekranları için tek bir GraphQL katmanı ekler.

2026'da gördüğümüz olgun mimarilerin çoğu ideolojik değil pragmatik: çekirdek kaynaklar için REST, agregasyon ağırlıklı frontend ekranları için ise bir GraphQL geçidi (gateway). Bu, REST'in önbellek ve sadeliğini korurken GraphQL'in esnekliğini gerektiği yerde alır.

Konu kümemizdeki ilgili yazılar: [pratik API tasarım desenleri](#), [backend performans optimizasyonu](#) ve [API versiyonlama stratejileri](#). Kategori temeli için [yazılım mühendisliği rehberimize](#) göz atın.

## Sıkça Sorulan Sorular

### REST mi GraphQL mi, hangisi daha hızlı?

Duruma bağlı. Tek bir basit kaynak için REST, HTTP önbelleği sayesinde neredeyse her zaman daha hızlıdır. Ancak bir ekran için 4 ayrı REST çağrısı gerekiyorsa, GraphQL tek istekle daha düşük toplam gecikme sağlar. Hız farkı protokolden değil, kaç gidiş-dönüş yaptığınızdan gelir.

### GraphQL REST'in yerini alacak mı?

Hayır. 2026 itibarıyla ikisi bir arada yaşıyor. GraphQL, çok istemcili ve iç içe veri senaryolarında güçlü; REST ise basit CRUD, kamuya açık API ve önbellek gerektiren durumlarda hâlâ varsayılan seçim. Çoğu olgun ekip ikisini duruma göre birlikte kullanıyor.

### İkisini aynı sistemde kullanabilir miyim?

Evet, hibrit yaklaşım yaygın. Çekirdek kaynaklarınızı REST ile sunup, karmaşık okuma ekranları için üstüne bir GraphQL geçidi ekleyebilirsiniz. Böylece REST'in önbellek ve sadeliğini korurken, agregasyon gereken yerde GraphQL esnekliğini alırsınız.

### GraphQL'de en sık yapılan hata nedir?

N+1 sorgu problemi. İç içe resolver'lar, her alt nesne için ayrı veritabanı sorgusu tetikleyerek performansı çökertir. Çözüm, DataLoader gibi bir toplu yükleyici (batching) katmanı kullanmak ve sorgu derinliği ile karmaşıklığına sınır koymaktır.
