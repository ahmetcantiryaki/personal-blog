---
title: "Telefonda Yapay Zeka: 2026'da Gerçekten Ne Çalışıyor"
slug: "telefonda-yapay-zeka-cihaz-ici-ai-2026"
translationKey: "on-device-ai-phones-2026"
locale: "tr"
excerpt: "Apple Intelligence, Gemini Nano ve Galaxy AI cihaz içi işlem vaat ediyor. Temmuz 2026'da telefonda yerelde çalışan ile buluta giden nedir, anlatıyoruz."
category: "technology"
tags: ["gemini", "ai-infrastructure", "machine-learning", "performance", "ai-tools"]
publishedAt: "2026-07-25"
seoTitle: "Cihaz İçi Yapay Zeka 2026: Telefonda Gerçekten Ne Çalışır"
seoDescription: "Apple Intelligence, Gemini Nano ve Galaxy AI cihaz içi işlem vaat ediyor. Temmuz 2026'da telefonda yerelde çalışan ile buluta giden nedir, anlatıyoruz."
---

Telefonunun yapay zekasında bugün gerçekten yerelde çalışan şey, pazarlamanın anlattığından çok daha dar: özetleme, akıllı yanıt, yazım düzeltme ve basit sınıflandırma gibi işleri çipin sinir işleme birimi (NPU) üzerinde yürüten küçük, sıkıştırılmış dil modelleri. Gerçek akıl yürütmeye benzeyen her şey hâlâ bir sunucuya gidiyor. Her büyük üretici artık bunu "cihaz içi yapay zeka" olarak pazarlıyor ama telefonda kalan ile sessizce dışarı çıkan arasındaki ayrım asıl hikâye.

## "Cihaz içi yapay zeka" gerçekte ne demek

Cihaz içi yapay zeka, bir telefonun bellek sınırlarına sığacak kadar küçük bir dil modelinin, isteğini bir veri merkezine göndermek yerine NPU üzerinde çalışması demek. Bunlar GPT-5 ya da Gemini 3 Pro'nun küçültülmüş versiyonları değil; genellikle 1-4 milyar parametre aralığında, birkaç yüz megabaytlık RAM'e sığacak şekilde nicemlenmiş, baştan bu iş için tasarlanmış küçük modeller. Hızlılar ve gizlilik açısından güçlüler ama ham yetenekten ödün veriyorlar. Bir telefona sığan model, bir hızlandırıcı rafında çalışan modelle aynı dünya bilgisine ya da akıl yürütme derinliğine sahip olamaz ve çip iyileştirmeleri kısa vadede bu matematiği değiştirmiyor.

Pratikteki sonuç iki katmanlı bir sistem: küçük görevler ağ isteği olmadan milisaniyeler içinde çözülüyor, derin akıl yürütme, uzun bağlam ya da güncel bilgi gerektiren her şey ise hâlâ cihazdan çıkıyor.

## Şu anda önemli olan üç uygulama

Apple, Google ve Samsung her biri üretim ortamında çalışan bir cihaz içi sistem çıkardı ve aralarındaki fark mimariden çok kapsamda.

**Gemini Nano**, Android'in AICore sistem servisi içinde çalışıyor ve Google, desteklenen görevler için ağ bağlantısı gerekmediğini açıkça belirtiyor. Google'ın kendi geliştirici belgelerine göre, Gemini Nano üzerine kurulu ML Kit GenAI API'leri metin özetleme, yazım ve dil bilgisi düzeltme, yeniden yazma, akıllı yanıt ve basit metin sınıflandırmasını kapsıyor; bunların hepsi Google Tensor, Qualcomm Snapdragon ya da MediaTek Dimensity çipli cihazlarda AICore aracılığıyla tamamen yerelde çalışıyor ([developer.android.com/ai/gemini-nano](https://developer.android.com/ai/gemini-nano)). Pixel telefonlarda bu altyapı, Arama Notları ve Dolandırıcılık Tespiti gibi özellikleri de tamamen cihaz üzerinde çalıştırıyor.

**Apple Intelligence** önce yönlendirme yapan bir yaklaşım izliyor. Cihaz üzerindeki küçük bir model her isteği değerlendiriyor ve yerelde tamamlanıp tamamlanamayacağına karar veriyor; tamamlanabiliyorsa hiçbir veri telefondan çıkmıyor. Bir istek daha fazla kapasite gerektirdiğinde Apple Intelligence, Apple silikonlu sunucularda çalışan Private Cloud Compute'a (PCC) yönleniyor; PCC yalnızca ilgili veriyi işliyor ve Apple'ın kendi güvenlik belgelerine göre yanıt üretildikten hemen sonra bu veriyi hiçbir biçimde saklamadan siliyor ([security.apple.com/blog/private-cloud-compute](https://security.apple.com/blog/private-cloud-compute/)). Apple, Haziran 2026'daki WWDC'de PCC'yi kendi veri merkezlerinin ötesine genişlettiğini ve Gemini model ailesinin arkasındaki teknolojiyi kullanarak Google ile ortaklaşa geliştirdiği yeni nesil Apple Foundation Models'ın, ajan tabanlı araç kullanımı ve karmaşık akıl yürütme gibi daha zorlu işleri Google Cloud üzerinde genişletilmiş PCC altyapısıyla yürüteceğini doğruladı ([apple.com/newsroom, Haziran 2026](https://www.apple.com/newsroom/2026/06/apple-intelligence-brings-powerful-ai-capabilities-into-everyday-experiences/)). Bu, dikkat çekici bir itiraf: Apple'ın kendi çipleri, her "cihaz içi gibi görünen" vaadi tutmaya yetmiyor.

**Galaxy AI**, üçü arasında en tutarsız olanı çünkü Samsung tek bir marka altında iki farklı çip seti gönderiyor. ABD pazarındaki Galaxy S26 telefonları, Hexagon V81 NPU'lu özel bir Snapdragon 8 Elite Gen 5 kullanıyor; Qualcomm ve Samsung'un kendi açıklamalarına göre bu, önceki nesle kıyasla cihaz içi yapay zeka işlemede yaklaşık yüzde 39'luk bir sıçrama sağlıyor. Diğer bölgelerde satılan telefonlar ise Samsung'un kendi Exynos 2600 çipini taşıyor; bu çipin NPU'sunun üretken yapay zeka performansında yüzde 113'e varan bir iyileştirme sağladığı iddia ediliyor. Samsung, her zaman kullanılabilen temel Galaxy AI özelliklerini — arka plan önerileri, bazı düzenleme araçları — bu NPU üzerinde çalıştırıyor ama Circle to Search'ün bir kısmı ve diller arası çeviri dahil pek çok öne çıkan özellik hâlâ canlı bir ağ bağlantısı gerektiriyor.

## Üçü gerçekte nerede duruyor

| Özellik alanı | Apple Intelligence | Gemini Nano | Galaxy AI |
|---|---|---|---|
| Metin düzenleme / yazım düzeltme | Cihaz içi | Cihaz içi | Cihaz içi (çoğunlukla) |
| Özetleme (notlar, bildirimler) | Cihaz içi | Cihaz içi | Karışık |
| Akıllı yanıt / hızlı eylemler | Cihaz içi | Cihaz içi | Cihaz içi |
| Karmaşık akıl yürütme, ajan görevleri | Private Cloud Compute | Bulut (Gemini uygulaması/API) | Bulut |
| Canlı çeviri, görsel üretimi | Çoğunlukla Private Cloud Compute | Karışık | Çoğunlukla bulut |
| Desteklenen görevler için tamamen çevrimdışı çalışır mı | Evet | Evet | Kısmen |

## Yerel çıkarımın gerçekten önemi

Gizlilik argümanı en güçlüsü ve sadece pazarlama dili değil. Çıkarım NPU üzerinde gerçekleştiğinde, taslak bir e-posta, düzenlediğin bir fotoğraf ya da bir sesli not gibi isteğin, düz metin olarak üçüncü bir tarafa hiç gitmek zorunda kalmıyor. Apple'ın PCC modeli, bulut yedeğini bile denetlenebilir ve veri tutmayan bir yapıya kavuşturarak bunu bir adım öteye taşıyor; bu, barındırılan bir dil modeline yapılan tipik bir API çağrısından anlamlı ölçüde farklı bir gizlilik duruşu.

Çevrimdışı çalışabilme ise hak ettiği ilgiyi görmeyen bir kazanım. Bir aramayı özetlemek, akıllı bir yanıt taslağı hazırlamak ya da dolandırıcılık aramasını sınıflandırmak; uçakta, bodrum kattaki bir spor salonunda ya da zayıf bir kırsal bağlantıda çalışır, çünkü hiçbir gidiş-dönüş yok.

## Etrafından dolaşamayacağın fizik

Bir modeli yerelde çalıştırmak, bir deste kâğıt büyüklüğündeki bir cihazda pil tüketmek ve ısı üretmek demek ve bu kısıt, pazarlamanın hızıyla ilerlemiyor. Sürekli cihaz içi çıkarım, bugünün her amiral gemisinde termal olarak sınırlanıyor; bir telefondan on dakika boyunca kesintisiz yerel özetleme istediğinde saat hızları gövdeyi korumak için düşüyor. İlk token gecikmesi cihaz üzerinde gerçekten çok iyi, genellikle 100 milisaniyenin altında, ama bunun nedeni tam olarak modellerin küçük olması; bir görev daha büyük bir modele ihtiyaç duyduğu anda, NPU'nun kapasitesi ne olursa olsun telefondan çıkmak zorunda kalıyor. Sürekli yapay zeka özelliklerinden kaynaklanan pil tüketimi, erken Galaxy S26 ve iPhone 17 serisi incelemelerinde hâlâ en sık dile getirilen şikâyet.

## Gerçek mimari hibrit ve bu iyi bir şey

Üç üreticiden hiçbiri her şeyi yerelde yapan bir telefon inşa etmiyor ve küçük yazıları okuduğunda bunu gizlemedikleri de görülüyor. Gerçek tasarım bir yönlendirici: ucuz, hızlı, gizli görevler NPU'da kalıyor; geniş dünya bilgisi, çok adımlı akıl yürütme ya da güncel bilgi gerektiren her şey bir bulut modeline yükseliyor. Apple'ın PCC'yi çağırıp çağırmayacağına karar veren cihaz içi sınıflandırıcısı bu örüntünün en net kamuya açık örneği ama Google'ın Gemini uygulaması da örtük olarak aynı şeyi yapıyor: Nano yapabildiğini yapıyor, geri kalan istek buluttaki Gemini'ye düşüyor. Bu katmanlı çıkarım yaklaşımı yapay zeka ürünlerinde genel olarak görülen bir örüntü; [yapay zeka tarayıcılarını](/tr/posts/yapay-zeka-tarayicilari-karsilastirma) karşılaştırırken ele aldığım gibi, basit sayfa özetlemesinin karmaşık çok adımlı görevlerden ayrılma biçimine benziyor.

## Gerçekten yerel olan ile bulut yönlendirmeli pazarlama

Lansman sunumlarından değil üretici belgelerinden çıkardığım dürüst değerlendirmem şu: bir özellik görsel üretmeyi, gerçek zamanlı olarak bütün bir konuşmayı çevirmeyi ya da "ajan" gibi okunan herhangi bir şeyi — rezervasyon yapma, birden çok uygulama arasında koordinasyon, derin araştırma — içeriyorsa, pazarlama sayfası nasıl çerçevelerse çerçevelesin bir sunucuya dokunduğunu varsay. Her üç platformda da güvenilir ve doğrulanabilir biçimde cihaz içinde kalan görevler dar: metin temizleme, özetleme, akıllı yanıt ve sınıflandırma. Bu gerçek ve kullanışlı bir yetenek kümesi ama artık standart, sınır değil. İnsanları demolarda gerçekten etkileyen şey hâlâ buluta bağımlı ve bunun 2028'den önce anlamlı biçimde değişeceğini düşünmüyorum, çünkü 3 milyar parametrelik bir cihaz içi model ile sınır modeli arasındaki fark, NPU verimindeki iyileşme kadar hızlı kapanmıyor.

## 2026 nesli bir amiral gemisinden gerçekçi beklenti

Gerçekçi olarak: aynı dar görev kümesinin — yazım düzeltme, özetleme, akıllı yanıt, temel fotoğraf düzenleme — daha hızlı ve daha güvenilir sürümleri, Hexagon V81 ve Exynos 2600 gibi NPU'lar sayesinde iyileşmiş gecikmeyle tamamen çevrimdışı çalışacak. Apple, Google ve Samsung'un "cihaz içi" sayılan şeyi kademeli olarak genişletmeye devam etmesini bekle; bu, NPU'ların birdenbire çok hızlanmasından çok, daha büyük modellerin küçültülmesiyle olacak. 2026 telefonunun sınır sınıfı bir asistana benzer herhangi bir şeyi tamamen çevrimdışı çalıştırmasını bekleme; bu boşluk hibrit yönlendirme meselesi, bu yıl çip iyileştirmesiyle aşılabilecek bir donanım sorunu değil. Aynı yerel-bulut gerilimi [yapay zeka gözlüklerinde](/tr/posts/ai-akilli-gozlukler-2026-meta-android-xr) de yaşanıyor; orada pil ve termal sınırlar telefondan bile daha sıkı. Cihaz içi işlemle ilgili daha fazla araç için [2026'nın en ilginç yapay zeka araçları](/tr/posts/ai-ile-yapilmis-ilginc-araclar-2026) derlememize, mevcut donanımın sınır iş yüklerinden hâlâ ne kadar uzak olduğunu görmek için de [Sora ve Veo ile yapay zeka video üretimi](/tr/posts/ai-video-uretimi-2026-sora-veo) karşılaştırmamıza göz atabilirsin. Daha fazla içerik için [teknoloji kategorimize](/tr/category/teknoloji) uğrayabilirsin.

## Sıkça Sorulan Sorular

### Gemini Nano internet bağlantısı olmadan çalışır mı?

Desteklediği görevler için evet. Google'ın kendi belgeleri, Gemini Nano'nun Android'in AICore servisi üzerinden tamamen cihaz içinde çalıştığını; özetleme, yazım düzeltme, yeniden yazma, akıllı yanıt ve basit sınıflandırmayı AICore desteği olan Pixel, Snapdragon ve Dimensity tabanlı telefonlarda ağ isteği olmadan yürüttüğünü doğruluyor.

### Bazı istekler buluta gidiyorsa Apple Intelligence gerçekten gizli mi?

Private Cloud Compute'a yükselen istekler de gizlilik gözetilerek tasarlandı: Apple'ın güvenlik belgeleri, PCC'nin yalnızca istekle ilgili veriyi işlediğini ve yanıt üretildikten hemen sonra bu veriyi hiçbir biçimde saklamadan sildiğini belirtiyor. Bu, tamamen yerel işlemden farklı bir gizlilik modeli ama tipik bir bulut API çağrısıyla da aynı değil.

### Galaxy AI neden Apple Intelligence ya da Gemini Nano'dan daha tutarsız hissettiriyor?

Büyük ölçüde Samsung'un tek bir Galaxy AI markası altında iki farklı çip — bazı bölgelerde Snapdragon 8 Elite Gen 5, bazılarında Exynos 2600 — göndermesi ve bunların farklı NPU performansına sahip olması yüzünden; ayrıca daha fazla Galaxy AI özelliği, Apple'ın ya da Google'ın temel özellik kümesine kıyasla canlı bulut bağlantısına dayanıyor.

### Telefonlar yakında büyük yapay zeka modellerini tamamen çevrimdışı çalıştırabilecek mi?

2026-2027 için gerçekçi bir zaman çizelgesinde değil. Telefon boyutundaki bir model ile sınır sınıfı bir bulut modeli arasındaki fark, yalnızca NPU hızı meselesi değil, mimari bir fark; bu yüzden hibrit cihaz içi artı bulut yönlendirmenin önümüzdeki yıllarda varsayılan tasarım olarak kalması muhtemel.
