---
title: "E-posta Pazarlamada Teslim Edilebilirlik"
slug: "e-posta-pazarlamada-teslim-edilebilirlik"
translationKey: "email-marketing-deliverability-2026"
locale: "tr"
excerpt: "SPF, DKIM ve DMARC artık lüks değil, zorunluluk. Temmuz 2026 itibarıyla kampanyalarınızı spam kutusundan uzak tutmanın sahada test edilmiş kontrol listesi."
category: "digital-marketing"
tags: ["email-marketing", "automation", "best-practices"]
publishedAt: "2026-07-30"
seoTitle: "E-posta Teslim Edilebilirlik Kontrol Listesi"
seoDescription: "SPF, DKIM ve DMARC artık lüks değil, zorunluluk. Temmuz 2026 itibarıyla kampanyalarınızı spam kutusundan uzak tutmanın sahada test edilmiş yol haritası."
---

Gmail adreslerine günde yaklaşık 5.000'den fazla mesaj gönderiyorsanız, Google'ın kendi tanımına göre "toplu gönderici" sayılırsınız ve SPF, DKIM, DMARC ile kimlik doğrulaması yapmanız, şikayet oranını %0,3'ün altında tutmanız, tek tıkla abonelikten çıkma sunmanız gerekir. Bunlardan birini atlarsanız, e-postanız gelen kutusuna değil spam'e düşer.

Bu eşik artık bir yardım dokümanında unutulmuş bir öneri değil, uygulanan bir kapı. [Google ve Yahoo bu kuralları birlikte sıkılaştırdı](https://martech.org/new-rules-for-bulk-email-senders-from-google-yahoo-what-you-need-to-know/) ve Temmuz 2026 itibarıyla "teknik olarak uyumlu olmak" ile "gerçekten teslim edilmek" arasındaki fark daraldı değil, genişledi. Bu, sıfırdan başlayan bir ekibe elimden verdiğim kontrol listesi.

## Kimlik doğrulama: SPF, DKIM, DMARC ve BIMI

Kimlik doğrulama taban çizgisidir, tavan değil. Kim olduğunuzu kanıtlar; içeriğinizin istenip istenmediğini kanıtlamaz. Yine de bu olmadan listedeki hiçbir başka madde bir işe yaramaz.

| Mekanizma | Ne yapar | 2026 zorunluluk seviyesi |
|---|---|---|
| SPF | Domaininiz adına hangi sunucuların e-posta gönderebileceğini listeler | Zorunlu |
| DKIM | Mesajları kriptografik olarak imzalar, alıcı iletim sırasında değiştirilmediğini doğrulayabilir | Zorunlu |
| DMARC | SPF/DKIM başarısız olduğunda alıcıya ne yapması gerektiğini söyler ve size rapor döner | Zorunlu |
| BIMI | Kimliği doğrulanmış e-postaların yanında onaylı logonuzu gösterir | Opsiyonel, ama yaygınlaşıyor |

[Google ve Yahoo'nun kimlik doğrulama gereksinimleri](https://powerdmarc.com/google-and-yahoo-email-authentication-requirements/) toplu göndericiler için artık pazarlık konusu değil. `p=none` DMARC politikası kabul edilebilir bir başlangıç noktasıdır; teslimatı etkilemeden rapor toplamanızı sağlar. Ancak asıl beklenen, kimlik doğrulamanız stabilize oldukça `p=quarantine` veya `p=reject`'e doğru ilerlemenizdir. 2026'da hem Gmail hem Yahoo, birkaç yıl öncesine kıyasla yarım yamalak veya bozuk DMARC kurulumlarına belirgin şekilde daha az tolerans gösteriyor. Eskiden gelen kutusu yerleşiminde hafif bir düşüşe yol açan sorunlar, artık doğrudan reddedilmeye dönüşüyor.

Altta yatan DNS kayıtları, örnek olarak şöyle görünür:

```text
; SPF kaydı (example.com üzerinde TXT)
example.com.    TXT    "v=spf1 include:_spf.example-esp.com ~all"

; DMARC kaydı (_dmarc.example.com üzerinde TXT)
_dmarc.example.com.    TXT    "v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@example.com; pct=100"
```

`example.com` ve ESP include değerini kendi bilgilerinizle değiştirin; bu, olduğu gibi yapıştırılacak bir kayıt değil, kopyalanacak bir şablondur.

## Yeni bir gönderim domaini veya IP'sini ısıtmak

Posta kutusu sağlayıcıları yeni gönderim kaynaklarına varsayılan olarak şüpheyle yaklaşır ve bu haksız da değildir; spam'in büyük kısmı yeni kurulmuş altyapılardan çıkar. Yeni bir domaine, alt domaine veya özel IP'ye geçiyorsanız hacmi kademeli artırın: en meşgul segmentinizle (yakın zamanda açan, yakın zamanda satın alan) başlayın, bir-iki hafta küçük partiler halinde gönderin, açılma ve tıklama oranları sabit kaldıkça hacmi yükseltin. Bunu atlarsanız daha ilk gerçek kampanyanızı göndermeden bir itibar sorunu yaratmış olursunuz.

## Liste hijyeni ve pasif abone politikaları

Hiçbir şeyi açmayan adreslerle dolu bir liste bir varlık değil, bir yüktür. Bir sunset politikası belirleyin: listeniz için "pasif" tanımını yapın (örneğin 90-180 gündür açma veya tıklama yok), bir yeniden etkileşim gönderimi deneyin, hâlâ yanıt vermeyenleri listeden çıkarın veya bastırın. E-postanızı görmezden gelen her alıcı etkileşim oranınızı aşağı çeker, posta kutusu sağlayıcılarının asıl izlediği şey de bu orandır.

Bounce yönetimi de aynı kategoriye girer. Hard bounce'lar hemen ve kalıcı olarak bastırılmalı; soft bounce'lar için ise sessizce birikmesinler diye bir tekrar dene-sonra bastır kuralı gerekir.

## Gmail ve Outlook'un gerçekten dikkate aldığı etkileşim sinyalleri

Kimlik doğrulama sizi değerlendirmeye alır. Etkileşim ise sizi teslim ettirir. 2026'da alıcıların açması, tıklaması, yanıtlaması, yönlendirmesi veya bir mesajı klasörden taşıması -yoksayması veya spam olarak işaretlemesi yerine- posta kutusu sağlayıcılarının gelen kutusu mu spam mi kararı verirken kullandığı baskın sinyaldir. Bu, tek bir olay değil, zaman içindeki bir örüntü olarak değerlendirilir: [itibar sistemleri hacim sıçramalarını, etkileşim düşüşlerini ve liste kalitesi sorunlarını](https://redsift.com/guides/bulk-email-sender-requirements) birlikte ele alır, tıpkı bir kredi notunun tek bir ödemeyi değil bir davranış örüntüsünü yansıtması gibi.

Pratikte bu, en riskli içeriğinizi (yeni teklifler, soğuk yeniden aktivasyon kampanyaları) herkese aynı anda değil, önce en sıcak segmentinize göndermeniz gerektiği anlamına gelir.

## Spam filtrelerini tetikleyen içerik kalıpları

2026'da hâlâ güvenilir şekilde teslim edilebilirliğe zarar veren birkaç alışkanlık var:

- Gövdeyle uyuşmayan yanıltıcı konu satırları
- Link kısaltıcılara veya yönlendirme zincirlerine aşırı bağımlılık
- Neredeyse hiç metin içermeyen, sadece görselden ibaret e-postalar
- Gönderim örüntüsünde ani ve açıklanamayan değişiklikler (pasif bir listenin birden her gün e-posta almaya başlaması)
- Satın alınmış veya taranarak toplanmış listeler; bunlar etkileşimi çökertirken şikayetleri aynı anda tavan yaptırır

Burada biraz da içimden geleni söyleyeyim: ekipler konu satırındaki emojiyi veya ön izleme metnini A/B test etmeye orantısız zaman harcarken, SPF kaydı yanlış yapılandırılmış veya DMARC politikası kimsenin okumadığı raporlarla haftalardır `p=none`'da bekliyor oluyor. Bunu birden fazla kez gördüm; bir pazarlama ekibi, haftalardır sessizce filtrelenen bir domain için metin optimize ediyor. Boyaya uğraşmadan önce tesisatı düzeltin.

## Bounce ve şikayet oranlarını izlemek

%0,30 veya üzerinde bir spam şikayet oranı, domaininizi Gmail'in teslimat iyileştirme desteğinden mahrum bırakır ve -çoğu kişinin gözden kaçırdığı kısım burası- altta yatan sorunu düzeltseniz bile, uygunluğun geri gelmesi için yedi gün üst üste %0,30'un altında kalmanız gerekir. Google'ın gerçek iç yönergesi yayınlanan eşikten daha katı: %0,1'in altında kalın ve %0,3'ü yaklaşılacak bir hedef değil, hiç değmeyeceğiniz bir duvar olarak görün.

Tek tıkla abonelikten çıkma da bu resmin bir parçası. `List-Unsubscribe` ve `List-Unsubscribe-Post` başlıkları ([RFC 8058](https://chronos.agency/blog/gmail-yahoo-email-sender-requirements-2026/)) üzerinden uygulanır, bağlantı giriş yapılmasını zorlamadan çalışmalı ve talep iki gün içinde yerine getirilmelidir. Bulmayı zorlaştırdığınız her abonelikten çıkma isteği, bunun yerine bir spam şikayetine dönüşür; itibarınıza zarar veren de abonelikten çıkmalar değil, şikayetlerdir.

Pazarlama yığınınızın bir kısmını zaten otomatikleştiriyorsanız, teslim edilebilirlik izlemesini elle kontrol etmek yerine bu otomasyona bağlamak doğal bir adım; alt yapıyı [Zapier ve Make ile pazarlama otomasyonu yazımızda](/tr/posts/ai-ile-pazarlama-otomasyonu-zapier-make) ele aldık.

## Gönderim öncesi kontrol listesi ve gelen kutusu testi araçları

Bir sonraki gönderiminizden önce:

- SPF, DKIM ve DMARC'ın hepsi geçiyor ve hizalanıyor
- DMARC politikası en az `p=quarantine`, `p=reject`'e doğru ilerliyor
- Tek tıkla abonelikten çıkma başlığı mevcut ve test edilmiş
- Liste, son üç ayda bir sunset/yeniden etkileşim sürecinden geçmiş
- Bounce ve şikayet oranları yalnızca aylık bir dışa aktarımda değil, bir panoda görünür
- Yeni domain veya IP'ler tam hacimli gönderime geçmeden önce ısınma sürecini tamamlamış
- Konu satırı ve ön izleme metni gerçek içerikle uyuşuyor

Gelen kutusu yerleşimini test etmek için yığında bulunması gereken araçlar: Google Postmaster Tools (Gmail'den doğrudan domain itibarı ve spam oranı verisi), bir seed-list gelen kutusu yerleşim testi aracı ve ESP'nizin kendi kimlik doğrulama denetleyicisi. Hiçbiri gerçek kampanya etkileşimini izlemenin yerini tutmaz, ancak sorunları gerçek bir gönderimden önce yakalarlar.

Bunların hiçbirinin bir anlamı olması için önce listenizin kendisinin sağlam olması gerekiyorsa, [bülten büyütme ve gelir rehberimiz](/tr/posts/bulten-buyutme-ve-gelir-2026) korumaya değer bir liste kurmayı baştan ele alıyor. Gelen kutusunun ötesinde görünürlük de stratejinizin bir parçasıysa, [GEO rehberimize](/tr/posts/geo-yapay-zeka-aramalarinda-gorunurluk) ve ilgili sahadan notlar için [dijital pazarlama kategorimize](/tr/category/dijital-pazarlama) göz atabilirsiniz.

## Sıkça Sorulan Sorular

### Günde 5.000'den az e-posta gönderiyorsam bu kurallar beni bağlar mı?

Resmi toplu gönderici gereksinimleri teknik olarak bu eşiğin altında geçerli değil, ancak her hacimde SPF, DKIM ve DMARC ile kimlik doğrulaması yapmak iyi bir alışkanlıktır; itibar sistemleri eşiğin altında olduğunuz için sıfırlanmaz ve bu alışkanlığı erken kurmak sonradan telaşa düşmenizi önler.

### DMARC'ta `p=none` uzun vadede yeterli mi?

Hayır. Teslimatı riske atmadan rapor toplamak için kabul edilebilir bir başlangıç noktasıdır, ama Google ve Yahoo `p=quarantine` veya `p=reject`'e doğru aktif bir ilerleme bekler. 2026'da süresiz olarak `p=none`'da kalmak, bilinçli bir tercih değil, yarım kalmış bir kurulum olarak okunur.

### Abonelikten çıkma talebini ne kadar hızlı yerine getirmem gerekir?

Tek tıkla abonelikten çıkma gereksinimine göre iki gün içinde. Bağlantı ayrıca giriş yapılmasını zorlayamaz; alıcı çıkmak için önce oturum açmak zorunda kalıyorsa bu sadece bir kullanıcı deneyimi sorunu değil, bir uyum açığıdır.

### %0,3 şikayet eşiğini aşıp aşmadığımı en hızlı nasıl anlarım?

Google Postmaster Tools, Gmail'den doğrudan domain düzeyinde spam oranı verisi gösterir. Bunu kontrol etmek için teslimatta bir düşüş yaşanmasını beklemeyin; hacim düştüğünde saati başlatmadan önce genellikle yedi günlük iyileşme penceresinin çoktan gerisinde kalmış olursunuz.
