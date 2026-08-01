---
title: "Akıllı Ev 2026: Matter ve Cihaz Uyumu"
slug: "akilli-ev-2026-matter-ve-cihaz-uyumu"
translationKey: "smart-home-matter-interoperability-2026"
locale: "tr"
excerpt: "Matter ve Thread markalar arası uyumu büyük ölçüde çözdü ama kamera gibi kategoriler geride kaldı. 2026'da uyumlu cihaz seçmenin pratik yolu."
category: "technology"
tags: ["smart-home", "web-standards", "integration", "automation", "self-hosting"]
publishedAt: "2026-08-01"
seoTitle: "Akıllı Ev 2026: Matter ve Marka Bağımsız Cihaz Uyumu"
seoDescription: "Matter ve Thread markalar arası uyumu büyük ölçüde çözdü ama kamera gibi kategoriler geride kaldı. 2026'da uyumlu cihaz seçmenin pratik yolu."
---

Marka bağımsız bir akıllı ev kurmak, Matter destekli bir border router seçmek, satın almadan önce her cihazın kendi kategorisinde sertifikalı olup olmadığını kontrol etmek ve otomasyonların internet kesildiğinde de çalışıp çalışmadığını sormak anlamına geliyor. Matter uygulama parçalanmasını büyük ölçüde çözdü ama kategoriden kategoriye kapsam hâlâ eşit değil; asıl fark artık cihazın veriyi yerelde mi işlediğinde saklı.

## Matter ve Thread aslında neyi çözdü, neyi çözemedi?

Matter, Connectivity Standards Alliance (CSA) tarafından geliştirilen ortak bir uygulama katmanı protokolü; Thread ise düşük güçlü, kendi kendini onaran bir mesh ağ. İkisi birlikte, önceden birbiriyle konuşmayan Wi-Fi, Zigbee ve Bluetooth cihazlarını aynı yerel ağda buluşturuyor.

### Tek uygulama vaadi neden gerçekleşti

Matter'dan önce her marka kendi bulut hesabını, kendi uygulamasını ve genelde kendi hub'ını istiyordu. Bir Philips Hue lambası Apple Home'da görünmüyor, bir Aqara sensörü Google Home ile konuşmuyordu. Matter 1.0'dan bu yana sertifikalı bir cihaz; Apple Home, Google Home, Amazon Alexa+ ve Samsung SmartThings gibi birden fazla ekosistemde aynı anda, tek bir eşleştirme koduyla (multi-admin) kayıtlı olabiliyor. Bu, gerçek ve ölçülebilir bir kazanım.

### Hâlâ çözülmeyen yerler

CSA'nın kendi belgelerine göre spesifikasyon önce ışık, kilit, priz, termostat ve sensör gibi köklü kategorilere odaklandı; kamera desteği ancak Matter 1.5 ile (2025 sonunda) onaylandı ve robot süpürge, çamaşır makinesi, EV şarj cihazı gibi kategoriler 2026 boyunca hâlâ olgunlaşıyor ([csa-iot.org/all-solutions/matter](https://csa-iot.org/all-solutions/matter/)). Yani "Matter uyumlu" etiketi görmek yeterli değil; hangi kategoride, hangi sürümle sertifikalı olduğuna bakmak gerekiyor. Ağustos 2026 itibarıyla neredeyse tüm ana kategorilerin 2027'ye kadar Matter sertifikalı ürünlere sahip olması bekleniyor ama şu an için boşluklar gerçek ([matteralpha.com, 2026 kategori raporu](https://www.matteralpha.com/explainer/most-anticipated-matter-features-and-devices-in-2026)).

## Hub mu, border router mı: aradaki fark ne?

İkisi sık karıştırılıyor ama farklı işler görüyor. **Border router**, Thread mesh ağını ev Wi-Fi'sine ve internete köprüleyen küçük bir donanım parçası (çoğu zaman bir akıllı hoparlör ya da TV kutusunun içine gömülü). **Hub**, üzerinde otomasyon mantığının çalıştığı, cihazları kategoriler arasında birbirine bağlayan yazılım katmanı. Bir ekosistemde ikisi de olabilir, biri eksik olabilir ya da hiçbiri olmayabilir.

| Ekosistem | Thread border router | Bulutsuz (yerel) otomasyon | Çoklu-yönetici desteği | Kamera/güvenlik (Matter) |
|---|---|---|---|---|
| Apple Home | Var (HomePod mini, Apple TV 4K) | Ev merkezi varken çoğunlukla yerel | Var | Sınırlı, yeni yayılıyor |
| Google Home | Var (Nest Hub, Google TV) | Kısmen; bazı rutinler buluta gidiyor | Var | Kısmi |
| Amazon Alexa+ | Var (yeni nesil Echo cihazları) | Kısmen; Alexa+ çoğunlukla buluta bağımlı | Var | Kısmi |
| Samsung SmartThings | Var (Hub ve bazı Galaxy cihazları) | Var (Otomasyon Motoru yerelde çalışıyor) | Var | Kısmi |
| Home Assistant | Uyumlu donanımla var | Varsayılan olarak yerel | Var | En geniş, açık kaynak entegrasyonlarla |

Akıllı hoparlör tarafındaki değişimi merak ediyorsan [Gemini for Home'un akıllı hoparlörlere getirdiği yapay zeka katmanına](/tr/posts/gemini-for-home-akilli-hoparlorde-ai) da göz atmakta fayda var; bu hub'lar artık sadece sesli komut değil, otomasyon karar mekanizması olarak da konumlanıyor.

## Gerçekten birbiriyle konuşan cihazları nasıl seçersin?

Kutunun üzerinde "Works with Matter" yazması, kutu içindeki cihazın senin hub'ınla, senin kategorinde, senin ihtiyacın olan özellikle çalışacağı anlamına gelmiyor. Satın almadan önce kontrol edilmesi gereken üç şey var: sertifikanın hangi cihaz kategorisi için verildiği, cihazın hangi Matter sürümünü desteklediği ve üreticinin firmware güncellemelerini ne kadar süre taahhüt ettiği.

Bir cihazın eşleştirme (commissioning) sürecinde paylaştığı QR kod ya da eşleştirme kodu, aslında şuna benzer bir yükü kodluyor:

```json
{
  "version": "10.1",
  "vendorId": "0xFFF1",
  "productId": "0x8001",
  "commissioningFlow": 0,
  "discoveryCapabilities": ["ble", "onNetwork"],
  "discriminator": "3840",
  "setupPinCode": "20202021"
}
```

`vendorId` ve `productId`, cihazın CSA sertifika veritabanında kayıtlı olup olmadığını doğrulamana yarıyor; `commissioningFlow` değeri 0'dan farklıysa cihaz eşleştirme sırasında üreticinin kendi uygulamasına yönlendirme yapıyor olabilir, ki bu genelde markaya özel bir bağımlılığın işareti.

Pratik seçim kriterleri şöyle sıralanabilir:

- Kategori bazında sertifika: ışık için Matter desteği, aynı markanın kamerası için de geçerli olmayabilir.
- Yerel kontrol: cihaz internet kesildiğinde otomasyonlara hâlâ yanıt veriyor mu?
- Çoklu-yönetici: cihazı birden fazla ekosistemde (örneğin hem Apple Home hem Home Assistant) aynı anda kaydedebiliyor musun?
- Firmware taahhüdü: üretici en az üç-beş yıl güncelleme sözü veriyor mu?

## Neden cihaz üzerinde çalışan ve çevrimdışı kontrol öne çıkıyor?

2026'nın tüketici teknolojisi raporlarında tekrar eden tema şu: kullanıcılar artık ayrı uygulamalar ve kopuk deneyimler istemiyor, tek ve tutarlı bir sistem bekliyor ([niceforyou.com, 2026 akıllı ev trendleri](https://www.niceforyou.com/en/magazine/five-smart-home-trends-2026-how-nice-shaping-future-smart-living)). Bu beklentinin doğal uzantısı, verinin mümkün olduğunca evde kalması: gecikme daha düşük, internet kesildiğinde ışık hâlâ yanıyor ve konuşma verisi bir bulut sunucusuna gitmiyor. Telefonlarda cihaz içi yapay zekanın hangi görevleri gerçekten yerelde çözdüğünü, hangilerinin sessizce buluta gittiğini [cihaz içi yapay zeka rehberimizde](/tr/posts/telefonda-yapay-zeka-cihaz-ici-ai-2026) detaylıca ele almıştık; akıllı ev hub'larında da neredeyse aynı ayrım geçerli.

Burada net konuşmak gerekirse: "yapay zeka destekli" etiketiyle satılan pek çok hub, aslında basit bir kural motorunu buluta bağımlı bir dil modeliyle süslüyor. Gerçek çevrimdışı otomasyon hâlâ nadir ve bunu vaat eden ürünlerin çoğu, reklamdaki kadar bağımsız çalışmıyor.

Sesli asistan tarafında da benzer bir çekişme var; kulaklık ve mikrofon donanımının canlı çeviri gibi özellikleri ne kadarını cihazda, ne kadarını buluta göndererek çözdüğü [AI kulaklık ve canlı çeviri iddialarını incelediğimiz yazıda](/tr/posts/ai-kulaklik-ve-canli-ceviri-abarti-mi) tartışılıyor; akıllı ev satın alırken sorulması gereken soru aynı: "Bu özellik gerçekten burada mı çalışıyor, yoksa internet bağlantına mı emanet?"

## Tek marka kilidinden nasıl çıkılır?

Tüm ekosistemi bir günde değiştirmeye çalışmak gereksiz risk. Daha güvenli yol kademeli:

1. Mevcut cihazlarını envantere çıkar; hangileri zaten Matter sertifikalı, hangileri yalnızca markanın kendi bulutuyla çalışıyor.
2. Matter'ı desteklemeyen ama popüler markalardan (örneğin eski nesil Zigbee cihazları) gelen ürünleri, üretici köprüsü (bridge) üzerinden geçici olarak dahil et; bridge, eski cihazı değiştirmeden sertifikalı ekosisteme taşır.
3. Yeni alımlarda kategori bazlı sertifikayı doğrula, marka bağlılığını değil.
4. Thread kimlik bilgilerini (credential) paylaşan bir border router seç, böylece farklı markaların border router'ları aynı mesh ağı destekleyebilir.

Sağlık giyilebilirleri gibi bitişik kategorilerde de aynı uyumluluk baskısı var; halka ve glukoz takip cihazlarının farklı ekosistemlerle nasıl konuştuğuna [sağlık giyilebilirleri yazımızda](/tr/posts/saglik-giyilebilirleri-2026-yuzuk-glukoz) değinmiştik.

## Uyumluluk öncelikli alışveriş kontrol listesi

- Kutuda "Matter" yazısının yanında kategori adı da geçiyor mu (örn. "Matter kilit," "Matter ışık")?
- Marka, cihazı hangi Matter sürümüyle sertifikalandırdığını web sitesinde açıkça belirtiyor mu?
- Cihaz, internet kesintisinde yerel otomasyonlara (örneğin hareket algılayınca ışık yakma) yanıt veriyor mu?
- Border router'ın, seçtiğin hub'la (Apple Home, Google Home, SmartThings, Home Assistant) resmi olarak uyumlu mu?
- Üretici en az üç yıllık firmware güncelleme taahhüdü veriyor mu?
- Cihazı birden fazla hesap/ekosistemde eş zamanlı kaydedebiliyor musun (multi-admin)?

## Sıkça Sorulan Sorular

### Matter, Wi-Fi ve Zigbee'nin yerini mi alıyor?

Hayır. Matter, alt katmanda hangi radyo teknolojisinin (Wi-Fi, Thread, Ethernet) kullanıldığından bağımsız, ortak bir uygulama dili. Zigbee cihazları, üretici köprüsü üzerinden Matter ekosistemine dahil edilebiliyor ama doğrudan Matter konuşmuyor.

### Thread border router'a mutlaka ihtiyacım var mı?

Yalnızca Thread tabanlı cihazların (çoğu kilit, sensör ve bazı priz modelleri) çalışması için gerekli. Wi-Fi tabanlı Matter cihazları için ayrı bir border router şart değil.

### Kamera ve güvenlik cihazlarında Matter'a güvenebilir miyim?

Henüz temkinli olmakta fayda var. Kamera desteği Matter 1.5 ile geldi ve Ağustos 2026 itibarıyla ekosistemler arası kamera entegrasyonu hâlâ olgunlaşıyor; kritik güvenlik cihazlarında markanın kendi belgelerini kontrol etmek gerekiyor.

### Var olan akıllı ev cihazlarımı hemen değiştirmeli miyim?

Hayır. Çalışan cihazları köprü üzerinden geçici olarak dahil edip yalnızca yeni alımlarda kategori bazlı Matter sertifikasını aramak, hem bütçe hem risk açısından daha mantıklı.
