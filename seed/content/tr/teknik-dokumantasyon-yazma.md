---
title: "Geliştiricilerin Seveceği Dokümantasyon Yazma"
slug: "teknik-dokumantasyon-yazma"
translationKey: "write-documentation"
locale: "tr"
category: "career-productivity"
tags: ["documentation", "technical-writing", "communication"]
publishedAt: "2026-07-07"
excerpt: "Geliştiricilerin kullandığı dokümantasyon yazma rehberi: göreve dayalı sayfalar, çalışan örnekler, çürümeyi durduran döngü ve AI ajanlarının okuduğu yapı."
seoTitle: "Teknik Dokümantasyon Yazma: Geliştirici Rehberi"
seoDescription: "Geliştiricilerin kullandığı dokümantasyon yazma: göreve dayalı yapı, çalışan kod, CI inceleme döngüsü ve 2026'da yapay zekâ ajanlarının temiz okuduğu sayfalar."
---

Geliştiricilerin seveceği dokümantasyon yazmanın en hızlı yolu, her sayfayı kodunuzun yapısına göre değil okurun bitirmeye çalıştığı göreve göre düzenlemektir. Hedefle açın, ilk denemede çalışan kopyala-yapıştır bir örnek verin ve ön koşulları en başta belirtin. Okunan dokümanlar tek soruyu hızlıca yanıtlar; çürüyen dokümanlar ise her şeyi aynı anda anlatmaya çalışır. Bunu zor yoldan öğrendik: kimsenin açmadığı wiki'ler yayımlayarak.

## İyi bir teknik dokümantasyonu ne yapar?

İyi teknik dokümantasyon bulunabilir, göreve dayalı ve doğrulanabilirdir. Bulunabilir, okurun doğru sayfaya tek aramada ulaşması demektir. Göreve dayalı, her sayfanın iç modüle değil bir hedefe ("bir isteği kimlik doğrula") karşılık gelmesidir. Doğrulanabilir ise her komut ve kod bloğunun gerçekten çalışması demektir; çünkü tek bozuk örnek tüm setin güvenini zehirler.

Klasik hata, dokümanı kod tabanının aynası gibi yazmaktır. Her sınıf için bir sayfa, hiçbir kullanıcı hedefi için sayfa çıkmaz. Okur sizin sınıf adlarınızla düşünmez; "bir dosyayı nasıl yüklerim?" diye düşünür. Bu niyete uyduğunuzda sayfa neredeyse kendini yazar.

Bir de bakım testi var. Bir doküman, kodu değiştiren pull request'in içinde güncellenemiyorsa kayacaktır. En iyi dokümantasyon kodun yanında yaşar, kod gibi incelenir ve bir örnek çalışmayı bıraktığında derlemeyi bozar.

## 8 adımda teknik dokümantasyon nasıl yazılır?

Her yeni sayfa için kullandığımız süreç bu; üç mühendislik ekibinde ve yüzlerce birleştirilmiş doküman PR'ında oturttuk. Sırayla uygulayın; çoğu dokümanın başarısız olma nedeni birinci adımı atlamaktır.

1. **Okuru ve görevi adlandırın.** Tek cümle yazın: "X yapmak isteyen bir backend geliştirici." Bunu adlandıramıyorsanız elinizde sayfa değil, bir not vardır.
2. **Hedefle başlayın.** İlk paragraf, okurun neyi yapabilir hâle geleceğini ve kabaca ne kadar süreceğini söyler. Tarih yok, mimari turu yok.
3. **Ön koşulları açıkça listeleyin.** Sürümler, hesaplar, ortam değişkenleri ve izinler. Hiçbir şeyi varsaymayın; eksik bir ön koşul, bir eğitimin takılmasının bir numaralı nedenidir.
4. **Minimum çalışan örnek gösterin.** İşe yarayan en kısa tam parça. Ortasında `...` olan, kimsenin çalıştıramayacağı bir kırpıntı değil.
5. **Aşikâr olanı atlayın, olmayanı açıklayın.** İnsanları tökezleten iki satıra not düşün. Import'ları anlatmayın.
6. **Hata yollarını kapsayın.** Yaygın hatayı, tam hata mesajını ve çözümü gösterin. Okurların ekran görüntüsünü alıp paylaştığı kısım tam da budur.
7. **Yana ve yukarı bağlantı verin.** Parametreler için referansa, sonraki adım için kardeş rehbere ve "neden" için kavram sayfasına yönlendirin.
8. **Bir yabancı gibi test edin.** Her komutu temiz bir kabuğa kopyalayın. Yazmadığınız bir adım gerekiyorsa doküman bozuktur.

## Dokümantasyonun dört türü nedir?

Dört ayrı tür vardır ve bunları tek sayfada karıştırmak en sık yapılan dokümantasyon hatasıdır. Bu çerçeve, Daniele Procida'nın 2020'de oluşturduğu ve bugün doküman ekipleri için varsayılan zihinsel model hâline gelen [Diátaxis](https://diataxis.fr/) sisteminden gelir; Python topluluğu ve Canonical bunu kullanıyor. Her tür, farklı bir ruh hâlindeki farklı bir okura hizmet eder.

| Tür | Okurun hedefi | Yazım biçimi | Örnek |
|-----|---------------|--------------|-------|
| Öğretici (tutorial) | Yaparak öğrenmek | Rehberli, adım adım ders | "İlk API istemcinizi kurun" |
| Nasıl yapılır rehberi | Belirli bir görevi çözmek | Numaralı tarif | "API anahtarı nasıl döndürülür" |
| Referans | Kesin detaya bakmak | Kuru, eksiksiz, yapılandırılmış | Uç nokta ve parametre tabloları |
| Açıklama | Nedenini anlamak | Serbest, kavramsal | "Hız sınırlama nasıl çalışır" |

Kural şu: sayfa başına tek tür. Sürekli mimari açıklamak için duran bir öğretici, yeni başlayanı kaybeder; hikâye anlatan bir referans ise uzmanın vaktini çalar. Bir sayfanın kendisiyle çeliştiğini hissettiğinizde genelde iki tür üst üste sıkıştırılmıştır; ayırın.

## İyi bir kod örneği nasıl yazılır?

İyi bir kod örneği eksiksiz, minimum ve kopyala-yapıştır çalışır olmalıdır. Eksiksiz, okurun ihtiyaç duyduğu import ve kurulumu içermesi demektir. Minimum, yolda süs niyetine hiçbir şey olmaması demektir. Çalışır ise, yayımlamadan önce dokümanın iddia ettiği sürümde bunu kendinizin çalıştırması demektir.

Hedeflediğimiz biçim şu; okurun başarıyı doğrulayabilmesi için beklenen çıktıyı da ekliyoruz:

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

## Dokümanınızın artık ikinci bir okuru var: yapay zekâ ajanları

Gelmesini beklemediğimiz değişim şu. Dokümanınızı artık yalnızca yukarıdan aşağı kaydıran insanlar okumuyor. 2026'da kod asistanları ve ajanlar dokümanı sürekli tüketiyor; parçaları çekip bir bağlam penceresine yerleştiriyorlar. Cursor, Windsurf, Claude Code ve GitHub Copilot cevap vermeden önce sitenizin dokümanına uzanıyor. Diátaxis'in ikinci baharı tam olarak bu yüzden: tek işi iyi yapan bir sayfa temiz çekilir, bir öğreticiyi, bir referansı ve bir görüşü karıştıran 4.000 kelimelik sayfa ise gürültü olarak çekilir.

Buradaki somut araç, ajanları en değerli sayfalarınıza yönlendiren, `/llms.txt` yolundaki Markdown indeksi [llms.txt](https://llmstxt.org/). Eylül 2024'te Jeremy Howard tarafından önerildi ve Temmuz 2026 itibarıyla SE Ranking'in 300.000 alan adı taramasında yaklaşık %10 benimsenme görülüyor; Anthropic, Cursor ve Vercel gibi geliştiriciye dönük şirketlerde ise neredeyse standart. Hâlâ resmî bir norm değil, topluluk anlaşması; o yüzden mecburiyet değil, ucuz bir sigorta gibi görün. Görüşümüz net: ürününüzde bir API varsa bu çeyrek bir `llms.txt` yayımlayın. Maliyeti bir öğleden sonra; kazancı, kullanıcılarınızın çalıştırdığı her ajanın parametrelerinizi uydurmak yerine doğru alıntılaması.

Temiz yapı iki kitleye aynı anda hizmet eder. Bir junior geliştiricinin göz gezdirdiği göreve dayalı sayfa, bir ajanın kelimesi kelimesine çektiği parçadır. İki kez yazmıyorsunuz.

## Dokümantasyonun bayatlamasını nasıl önlersiniz?

Dokümanı güncel tutmanın yolu, onu kod gibi ele almaktır: aynı depoda sürümleyin, aynı pull request içinde inceleyin ve örnekleri sürekli entegrasyonda (CI) test edin. Ayrı bir wiki'de yaşayan dokümantasyon haftalar içinde kayar; çünkü teslim baskısı altında kimse iki yeri aynı anda güncellemez. Zaten [işe yarayan unit testler](/tr/posts/unit-test-nasil-yazilir) yazıyorsanız, aynı disiplini kod parçacıklarınıza da uzatın.

Sahada tutan pratik korumalar:

- **Docs-as-code:** Depoda Markdown, insan incelemesi, davranışı değiştiren özellikle birlikte birleştirme.
- **Çalıştırılabilir örnekler:** Kod bloklarınızı çıkarıp çalıştıran bir araçla CI'da koşturun; böylece bozuk bir parça derlemeyi düşürür.
- **Tazelik damgası:** Sayfanın en son ne zaman doğrulandığını gösterin. Hem Google hem de yapay zekâ yanıt motorları tazeliği belli eden sayfaları öne çıkarıyor.
- **Sayfa başına bir sahip:** Sahipsiz dokümanlar çürür. Ön bilgiye bir isim ya da ekip koyun ki dürtülecek biri olsun.

Araç, iş akışından daha az önemli; yine de Temmuz 2026 itibarıyla mevcut manzara şöyle:

| Araç | Rolü | En son (Tem 2026) | Not |
|------|------|-------------------|-----|
| [Docusaurus](https://docusaurus.io/blog/releases/3.10) | Statik doküman sitesi | 3.10.1 | Son v3 hattı; React 19, AskAI'li DocSearch 4.x |
| Material for MkDocs | Statik doküman sitesi | 9.7.6 | Özellik dondurma (9.7'den beri bakım modu) |
| Starlight | Astro tabanlı doküman | sürekli | Hızlı derleme, içerik ağırlıklı siteler için iyi |
| [Vale](https://vale.sh/) | Metin linter'ı | sürekli | Stil kurallarını CI'da zorlar |

Süslü araçlar, inceleme döngüsünün dışında yaşayan dokümanı kurtarmaz. Tek bir statik üreteç seçin, Vale'i CI'a bağlayın ve her örneği çalıştırılabilir tutun.

## Sıkça Sorulan Sorular

### Teknik dokümantasyon ne kadar uzun olmalı?

Görevin gerektirdiği kadar, bir kelime fazla değil. Tek görevlik bir nasıl yapılır rehberi 200 kelime olabilir; bir başlangıç öğreticisi 1.500 kelime. Hedef uzunluk değil, eksiksizliktir. Okur sayfadan ayrılmadan ve bir adımı tahmin etmeden görevi bitirebiliyorsa, sayfa doğru uzunluktadır. Onu hedefe götürmeyen her şeyi çıkarın. Becerinin kendisini büyütmek içinse [juniordan senior geliştiriciye](/tr/posts/juniordan-senior-gelistiriciye) yazısı, yazmayı bir kaldıraç olarak ele alır.

### Dokümanı geliştiriciler mi yoksa teknik yazarlar mı yazmalı?

İkisi de, farklı aşamalarda. İlk taslağı geliştirici yazar; çünkü gerçekte neyin bozulduğunu ve hangi hataların yaygın olduğunu o bilir. Sonra bir teknik yazar yapı, tutarlılık ve netlik için düzenler. 2026'da yüksek performanslı ekiplerin çoğu bu melez modeli kullanıyor: mühendis doğruluktan, yazar okunabilirlikten sorumlu. En kötü sonuç, kodu hiç çalıştırmamış birinin yazdığı dokümandır. Taslak çıkarmak darboğazınızsa, [yapay zekâ araçlarıyla geliştirici verimliliği](/tr/posts/ai-gelistirici-verimliligi) ilk geçişi hızlandırmayı anlatıyor.

### Teknik dokümantasyon yazmak için hangi araçları kullanmalıyım?

Sade tutun ve koda yakın kalın: depoda Markdown ya da MDX, yayımlamak için Docusaurus, Material for MkDocs veya Starlight gibi bir statik site üreteci ve stili zorlamak için Vale gibi bir linter. Aracın kendisi iş akışından daha az önemli; [temiz kod prensiplerini](/tr/posts/temiz-kod-prensipleri) metne uygulamak (küçük sayfalar, tek sorumluluk, tekrar yok) her üreteçten daha çok işe yarar.

### Yapay zekâ ajanlarının kullanabileceği dokümanı nasıl yazarım?

Her sayfayı tek amaçlı tutun, betimleyici başlıklar kullanın ve çalışan örnekleri kod bloklarına koyun. Ajanlar parçaları çeker; o yüzden kendi içinde tam bir bölüm, dağınık bir sayfayı yener. En iyi sayfalarınıza işaret eden bir `/llms.txt` indeksi yayımlayın ve bir API sunuyorsanız, ajanların metinden tahmin yürütmek yerine araçlarınızı doğrudan çağırabilmesi için [Model Context Protocol](/tr/posts/model-context-protocol-nedir) seçeneğini değerlendirin.
