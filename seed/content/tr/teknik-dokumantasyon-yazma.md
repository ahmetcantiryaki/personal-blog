---
title: "Geliştiricilerin Seveceği Dokümantasyon Yazma"
slug: "teknik-dokumantasyon-yazma"
translationKey: "write-documentation"
locale: "tr"
excerpt: "Geliştiricilerin gerçekten kullandığı teknik dokümantasyon yazma rehberi: göreve dayalı yapı, çalışan kod örnekleri ve dokümanı taze tutan bir inceleme döngüsü."
category: "career-productivity"
tags: ["documentation", "technical-writing", "communication"]
publishedAt: "2026-06-16"
seoTitle: "Teknik Dokümantasyon Yazma: Geliştirici Rehberi"
seoDescription: "Geliştiricilerin kullandığı teknik dokümantasyon yazma: göreve dayalı yapı, çalışan kod ve dokümanı 2026'da güncel tutan inceleme döngüsü."
---

Geliştiricilerin seveceği teknik dokümantasyon yazma işinin en hızlı yolu, sayfayı kodunuzun yapısına göre değil, okurun bitirmeye çalıştığı göreve göre düzenlemektir. Her sayfayı hedefle açın, ilk denemede çalışan kopyala-yapıştır bir örnek verin ve ön koşulları en başta belirtin. Okunan dokümanlar tek bir soruyu hızlıca yanıtlar; çürüyen dokümanlar ise her şeyi aynı anda anlatmaya çalışır.

## İyi bir teknik dokümantasyonu ne yapar?

İyi teknik dokümantasyon bulunabilir, göreve dayalı ve doğrulanabilirdir. Bulunabilir, okurun doğru sayfaya tek aramada ulaşması demektir. Göreve dayalı, her sayfanın iç modüle değil bir hedefe ("bir isteği kimlik doğrula") karşılık gelmesidir. Doğrulanabilir ise her komut ve kod bloğunun gerçekten çalışması demektir; çünkü tek bozuk örnek tüm setin güvenini yıkar.

Klasik hata, dokümanı kod tabanının aynası gibi yazmaktır. Her sınıf için bir sayfa, hiçbir kullanıcı hedefi için sayfa çıkmaz. Okur sizin sınıf adlarınızla düşünmez; "bir dosyayı nasıl yüklerim?" diye düşünür. Bu niyete uyduğunuzda sayfa kendini yazar.

Bir de bakım testi var. Bir doküman, kodu değiştiren pull request'in içinde güncellenemiyorsa kayacaktır. En iyi dokümantasyon kodun yanında yaşar, kod gibi incelenir ve bir örnek çalışmayı bıraktığında derlemeyi bozar.

## 8 adımda teknik dokümantasyon nasıl yazılır?

Her yeni sayfa için kullandığım süreç bu; üç mühendislik ekibinde ve yüzlerce birleştirilmiş doküman PR'ında oturttum. Sırayla uygulayın; çoğu dokümanın başarısız olma nedeni birinci adımı atlamaktır.

1. **Okuru ve görevi adlandırın.** Tek cümle yazın: "X yapmak isteyen bir backend geliştirici." Bunu adlandıramıyorsanız elinizde sayfa değil, bir not vardır.
2. **Hedefle başlayın.** İlk paragraf, okurun neyi yapabilir hâle geleceğini ve kabaca ne kadar süreceğini söyler. Tarih yok, mimari turu yok.
3. **Ön koşulları açıkça listeleyin.** Sürümler, hesaplar, ortam değişkenleri ve izinler. Hiçbir şeyi varsaymayın; eksik bir ön koşul, bir eğitimin takılmasının bir numaralı nedenidir.
4. **Minimum çalışan örnek gösterin.** İşe yarayan en kısa tam parça. Ortasında `...` olan, kimsenin çalıştıramayacağı bir kırpıntı değil.
5. **Aşikâr olanı atlayın, olmayanı açıklayın.** İnsanları tökezleten iki satıra not düşün. Import'ları anlatmayın.
6. **Hata yollarını kapsayın.** Yaygın hatayı, tam hata mesajını ve çözümü gösterin. Okurların ekran görüntüsünü alıp paylaştığı kısım tam da budur.
7. **Yana ve yukarı bağlantı verin.** Parametreler için referansa, sonraki adım için kardeş rehbere ve "neden" için kavram sayfasına yönlendirin.
8. **Bir yabancı gibi test edin.** Her komutu temiz bir kabuğa kopyalayın. Yazmadığınız bir adım gerekiyorsa doküman bozuktur.

## Dokümantasyonun dört türü nedir?

Dört ayrı tür vardır ve bunları tek sayfada karıştırmak en sık yapılan dokümantasyon hatasıdır. Bu çerçeve, 2026'da doküman ekipleri için varsayılan zihinsel model hâline gelen [Diátaxis](https://diataxis.fr/) sisteminden gelir. Her tür, farklı bir ruh hâlindeki farklı bir okura hizmet eder.

| Tür | Okurun hedefi | Yazım biçimi | Örnek |
|-----|---------------|--------------|-------|
| Öğretici (tutorial) | Yaparak öğrenmek | Rehberli, adım adım ders | "İlk API istemcinizi kurun" |
| Nasıl yapılır rehberi | Belirli bir görevi çözmek | Numaralı tarif | "API anahtarı nasıl döndürülür" |
| Referans | Kesin detaya bakmak | Kuru, eksiksiz, yapılandırılmış | Uç nokta ve parametre tabloları |
| Açıklama | Nedenini anlamak | Serbest, kavramsal | "Hız sınırlama nasıl çalışır" |

Kural şu: sayfa başına tek tür. Sürekli mimari açıklamak için duran bir öğretici, yeni başlayanı kaybeder; hikâye anlatan bir referans ise uzmanın vaktini çalar. Bir sayfanın kendisiyle çeliştiğini hissettiğinizde, genelde iki tür üst üste sıkıştırılmıştır; ayırın.

Pratikte bu dört türü ayrı klasörlerde tutmak işe yarar: okur bir öğretici ararken referans tablolarında kaybolmaz, uzman da bir parametreye bakarken uzun bir derse takılmaz. Yeni bir sayfa açarken kendinize tek soru sorun: "Bu okur öğrenmeye mi, çözmeye mi, bakmaya mı, anlamaya mı geldi?" Cevap, sayfanın türünü ve tonunu tek başına belirler.

## İyi bir kod örneği nasıl yazılır?

İyi bir kod örneği eksiksiz, minimum ve kopyala-yapıştır çalışır olmalıdır. Eksiksiz, okurun ihtiyaç duyduğu import ve kurulumu içermesi demektir. Minimum, yolda süs niyetine hiçbir şey olmaması demektir. Çalışır ise, yayımlamadan önce dokümanın iddia ettiği sürümde bunu kendinizin çalıştırması demektir.

Hedeflediğim biçim şu; okurun başarıyı doğrulayabilmesi için beklenen çıktıyı da ekliyorum:

```bash
# Ön koşullar: Node 22+, $WOYABLE_KEY içinde bir API anahtarı
curl -s https://api.example.com/v1/status \
  -H "Authorization: Bearer $WOYABLE_KEY"

# Beklenen çıktı:
# {"status":"ok","region":"eu-central-1"}
```

Yardımcı olan örnekleri sinir bozan örneklerden ayıran üç şey var:

- **Beklenen çıktıyı gösterin.** Okur yalnızca ne yazacağını değil, başarının neye benzediğini de bilmeli.
- **Gerçek yer tutucu adları kullanın.** `$WOYABLE_KEY`, `<ANAHTARINIZ>` ifadesinden iyidir; çünkü kopyala-yapıştırda kabuğu bozmadan hayatta kalır.
- **Sürümü sabitleyin.** "v3.2'de çalışır" dürüstçe yaşlanır; "en son sürüm" ise yayımladığınız an bir yalana dönüşür.

## Dokümantasyonun bayatlamasını nasıl önlersiniz?

Dokümanı güncel tutmanın yolu, onu kod gibi ele almaktır: aynı depoda sürümleyin, aynı pull request içinde inceleyin ve örnekleri sürekli entegrasyonda (CI) test edin. Ayrı bir wiki'de yaşayan dokümantasyon haftalar içinde kayar; çünkü teslim baskısı altında kimse iki yeri aynı anda güncellemez.

Sahada tutan pratik korumalar:

- **Docs-as-code:** Depoda Markdown, insan tarafından incelenen değişiklikler, davranışı değiştiren özellikle birlikte birleştirme.
- **Çalıştırılabilir örnekler:** Kod bloklarınızı çıkarıp çalıştıran bir araçla CI'da koşturun; böylece bozuk bir parça derlemeyi düşürür.
- **`dateModified` damgası:** Sayfanın en son ne zaman doğrulandığını gösterin. 2026'da hem Google hem de yapay zekâ yanıt motorları tazeliği belli eden sayfaları öne çıkarıyor.
- **Sayfa başına bir sahip:** Sahipsiz dokümanlar çürür. Ön bilgiye bir isim ya da ekip koyun ki dürtülecek biri olsun.

Daha derin yapı seçimleri için [temiz kod prensipleri](/tr/temiz-kod-prensipleri) rehberimize bakın; yazmak bir darboğazsa [yapay zekâ araçlarıyla geliştirici verimliliği](/tr/ai-gelistirici-verimliligi) yazımız dokümanı daha hızlı taslaklamayı anlatır. Becerinin kendisini büyütmek içinse [juniordan senior geliştiriciye](/tr/juniordan-senior-gelistiriciye) yazısı, yazmayı bir kaldıraç olarak ele alır.

## Sıkça Sorulan Sorular

### Teknik dokümantasyon ne kadar uzun olmalı?

Görevin gerektirdiği kadar, bir kelime fazla değil. Tek görevlik bir nasıl yapılır rehberi 200 kelime olabilir; bir başlangıç öğreticisi 1.500 kelime. Hedef uzunluk değil, eksiksizliktir. Okur sayfadan ayrılmadan ve bir adımı tahmin etmeden görevi bitirebiliyorsa, sayfa doğru uzunluktadır. Onu hedefe götürmeyen her şeyi çıkarın.

### Dokümanı geliştiriciler mi yoksa teknik yazarlar mı yazmalı?

İkisi de, farklı aşamalarda. İlk taslağı geliştirici yazar; çünkü gerçekte neyin bozulduğunu ve hangi hataların yaygın olduğunu o bilir. Sonra bir teknik yazar yapı, tutarlılık ve netlik için düzenler. 2026'da yüksek performanslı ekiplerin çoğu bu melez modeli kullanıyor: mühendis doğruluktan, yazar okunabilirlikten sorumlu. En kötü sonuç, kodu hiç çalıştırmamış birinin yazdığı dokümandır.

### Teknik dokümantasyon yazmak için hangi araçları kullanmalıyım?

Sade tutun ve koda yakın kalın: depoda Markdown ya da MDX, yayımlamak için Docusaurus, MkDocs veya Starlight gibi bir statik site üreteci ve stili zorlamak için Vale gibi bir linter. Aracın kendisi, iş akışından daha az önemlidir: dokümanlar sürüm kontrolünde, pull request'te incelenen, örnekleri CI'da test edilen. Süslü araçlar, inceleme döngüsünün dışında yaşayan dokümanı kurtarmaz.

### Kimsenin belgelemediği bir iç API'yi nasıl belgelerim?

Ekip sohbetinde en çok sorulan tek soruyla başlayın; ilk sayfanız odur. O tek görevin nasıl yapılır rehberini yazın, çalışan bir örnek ekleyin ve bir dahaki sefere biri sorduğunda kanala bağlantısını bırakın. Momentum, büyük plandan iyidir. Gerçek bir soruyu yanıtlayan tek iyi sayfa, kusursuz içindekiler tablosu olan boş bir wiki'den çok daha fazla iyi niyet kazandırır.
