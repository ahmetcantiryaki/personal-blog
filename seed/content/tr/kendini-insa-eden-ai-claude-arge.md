---
title: "Kendini İnşa Eden AI: Claude Ar-Ge'nin %26'sını Yapıyor"
slug: "kendini-insa-eden-ai-claude-arge"
translationKey: "ai-building-itself-rnd-2026"
locale: "tr"
excerpt: "Kısa cevap: Anthropic, Claude'un kendi model Ar-Ge'sinin %26'sını uçtan uca yürüttüğünü açıkladı; ama bu, insan gözetimi olmadan çalıştığı anlamına gelmiyor."
category: "ai"
tags: ["claude", "ai-agents", "machine-learning", "ai-reliability"]
publishedAt: "2026-09-20"
seoTitle: "Claude Kendi Ar-Ge'sinin %26'sını mı Yapıyor?"
seoDescription: "Kısa cevap: Anthropic, Claude'un kendi model Ar-Ge'sinin %26'sını uçtan uca yürüttüğünü açıkladı; ama bu insan gözetimi olmadan çalıştığı anlamına gelmiyor."
---

Kısa cevap: Anthropic, 17-18 Eylül 2026'da yaptığı açıklamada Claude'un, bir sonraki Claude modelini geliştirme çalışmalarının yaklaşık %26'sını üst düzey bir promptan uçtan uca yürüttüğünü, çalışmanın tamamının ise yaklaşık %90'ının Claude ile "iş birliği içinde" yapıldığını söyledi. Bu, insan gözetimi ortadan kalktığı anlamına gelmiyor — Anthropic'in kendi ifadesiyle bu iş hâlâ "yakın insan yönlendirmesi altında" yürüyor.

## Anthropic'in %26 iddiası tam olarak ne diyor?

Anthropic'in açıklamasına göre Claude, Anthropic'in model araştırma ve geliştirme görevlerinin yaklaşık dörtte birini kendi başına, uçtan uca tamamlıyor; kalan iş yükünün büyük kısmında ise insan mühendislerle birlikte çalışıyor. Şirketin verdiği ikinci rakam daha geniş: Ar-Ge çalışmalarının yaklaşık %90'ı Claude ile "iş birliği" içinde yapılıyor — bu ifade, Claude'un iş yükünün büyük bölümlerini insan yönlendirmesi altında üstlenebildiği anlamına geliyor, ama bu %90'ın ne kadarının tam otonom olduğunu belirtmiyor.

Bu iki rakam farklı şeyleri ölçüyor ve karıştırılmamalı: %26, Claude'un başından sonuna kadar tek başına yaptığı görevlerin oranı; %90 ise Claude'un herhangi bir düzeyde katkı sağladığı görevlerin oranı. İkincisi doğal olarak daha büyük çünkü eşiği çok daha düşük.

## "Uçtan uca, üst düzey bir promptan" ne anlama geliyor?

Anthropic'in "uçtan uca" tanımı, bir mühendisin görevi adım adım tarif etmesi yerine yüksek seviyeli bir hedef ("şu bileşenin performansını artır" gibi) vermesi ve Claude'un bu hedefi kod yazma, test etme ve sonuçları değerlendirme adımlarına bölerek tamamlaması anlamına geliyor. Bu, [AI agent mı workflow mu](/tr/posts/ai-agent-mi-workflow-mu) yazımızda ele aldığımız ayrımın tam da agent ucuna denk düşüyor: önceden tanımlı bir workflow değil, hedefi kendi planlayan bir sistem.

Ama "uçtan uca tamamladı" ifadesi, sonucun insan incelemesi olmadan production'a gittiği anlamına gelmiyor. Anthropic'in açıklaması, bu çalışmaların "yakın insan gözetimi altında" yürüdüğünü açıkça belirtiyor — yani son onay hâlâ insanların elinde.

## Bu, insan gözetimi olmadan mı çalışıyor?

Hayır ve burada abartıyı gerçeklikten ayırmak gerekiyor. Anthropic'in kendi ifadesine göre işin büyük kısmı "yakın insan yönlendirmesi altında" (under close human direction) yapılıyor; bu, Claude'un bir işi baştan sona tek başına planlayıp yürütebildiği ama sonucun kontrolsüz bırakılmadığı anlamına geliyor. "AI kendi kendini geliştiriyor" başlığı medyada yankı bulsa da, gerçek tablo daha çok "AI, insan gözetiminde giderek daha büyük iş parçalarını üstleniyor" şeklinde okunmalı.

Bu ayrım önemli çünkü "recursive self-improvement" (özyinelemeli kendini geliştirme) kavramı AI güvenliği literatüründe spesifik bir anlam taşıyor: bir sistemin insan müdahalesi olmadan kendi yeteneklerini artırması. Anthropic'in açıkladığı senaryo bu tanıma uymuyor — insan yönlendirmesi hâlâ döngünün içinde.

## Kendi kendini geliştiren AI güvenlik açısından neden tartışmalı?

AI güvenliği araştırmacılarının asıl endişesi, bir modelin kendi başarı ölçütünü kendisinin belirlediği ve insan denetiminin giderek azaldığı bir döngü. Anthropic'in %26'lık rakamı bu senaryodan uzak dursa da, trend yönü açık: Claude'un uçtan uca tamamlayabildiği görev oranı zamanla büyüyor. Sorulması gereken soru "bugün ne kadar otonom" değil, "bu oran hangi hızla büyüyor ve hangi noktada insan gözetimi pratikte anlamını yitiriyor" sorusu.

| Ölçüm | Rakam | Ne anlama geliyor |
|---|---|---|
| Uçtan uca Claude tarafından tamamlanan Ar-Ge görevleri | ~%26 | Yüksek seviye promptan başlayıp tek başına tamamlanan iş |
| Claude ile "iş birliği" içinde yapılan Ar-Ge | ~%90 | Herhangi bir düzeyde Claude katkısı içeren iş |
| İnsan gözetim modeli | "Yakın insan yönlendirmesi" | Sonuç kontrolsüz production'a gitmiyor |

## Bu mühendisler için ne anlama geliyor?

Kısa vadede bu, Anthropic'in kendi mühendislerinin rutin, iyi tanımlanmış Ar-Ge görevlerini Claude'a devredip zamanlarını daha belirsiz, yüksek seviye kararlara ayırabildiği anlamına geliyor — [AI'nın geliştiricileri gerçekten hızlandırıp hızlandırmadığı sorusuna](/tr/posts/yapay-zeka-verimlilik-paradoksu) somut bir veri noktası. Uzun vadede ise bu trend, "AI-dayanıklı" becerilerin neye dönüştüğü sorusunu yeniden gündeme getiriyor: uçtan uca otomatikleşen iş arttıkça, insan mühendisin katma değeri daha çok hedef belirleme, değerlendirme ve nihai onay aşamalarında yoğunlaşıyor.

## Bu iddiayı diğer AI şirketlerinin benzer açıklamalarıyla nasıl kıyaslarsınız?

Anthropic tek başına değil: OpenAI ve Google da kendi modellerini kendi araştırma ekiplerinin günlük iş akışına soktuklarını, kod inceleme ve deney tasarımı gibi görevlerde kullandıklarını çeşitli vesilelerle belirtti. Ama bu şirketlerin hiçbiri, Anthropic'in yaptığı gibi "görevlerin şu yüzdesini uçtan uca tamamlıyor" şeklinde somut, sayısallaştırılmış bir rakam paylaşmadı — çoğu açıklama "yoğun şekilde kullanıyoruz" düzeyinde kalıyor. Bu da Anthropic'in %26 rakamını sektördeki en spesifik kendinden bildirilen metriklerden biri yapıyor, ama aynı zamanda karşılaştırılabilecek bir emsal de bulunmuyor.

Bu tür rakamları değerlendirirken akılda tutulması gereken bir nokta, şirketin kendi metriğini kendi tanımlaması: "uçtan uca tamamlanan görev" tanımı, görev karmaşıklığına göre geniş bir yelpazede değişebiliyor — basit bir test yazma görevi ile karmaşık bir mimari değişikliği aynı kategoride sayılıyorsa, %26 rakamının pratik anlamı ciddi ölçüde değişir. Anthropic bu ayrımı kamuya açık şekilde detaylandırmadı.

Yine de rakamın kendisinden bağımsız olarak, yönün ne tarafa gittiği net: 2025'in başında benzer bir metrik kamuya açıklanmamıştı, şimdi ise şirket bunu doğrudan bir başarı göstergesi olarak sunuyor. Bu, AI şirketlerinin "modelimiz kendi geliştirilmesine katkı sağlıyor" mesajını giderek daha rahat bir şekilde dile getirdiğini gösteriyor — bu mesajın pazarlama değeri ile teknik gerçekliği arasındaki mesafeyi kapatmak ise okuyucuya kalıyor.

Okuyucu için pratik bir süzgeç şu olabilir: bir sonraki modelde bu oranın kaça çıktığını takip edin. Rakam yıllar içinde istikrarlı biçimde büyüyorsa, bu gerçek bir yetenek artışına işaret ediyor demektir; tek seferlik bir açıklama olarak kalır ve bir daha güncellenmezse, kendi başına daha az anlam taşır. Aynı şekilde, rakip laboratuvarların benzer bir metriği kendi isteğiyle paylaşıp paylaşmadığını izlemek de, bunun sektör genelinde bir şeffaflık normuna mı yoksa tek bir şirketin pazarlama tercihine mi dönüştüğünü anlamaya yardımcı olacak. Şu an için elimizdeki tek somut veri noktası Anthropic'in kendi açıklaması, bu yüzden temkinli bir okuma en doğrusu; bağımsız bir doğrulama yayımlandığında bu rakamın ne kadar sağlam durduğunu daha net göreceğiz.

## Sıkça Sorulan Sorular

### Claude kendi kendini mi geliştiriyor?

Tam olarak değil. Anthropic, Claude'un kendi model Ar-Ge görevlerinin yaklaşık %26'sını uçtan uca tamamladığını söylüyor, ama bu çalışma "yakın insan yönlendirmesi altında" yürütülüyor — yani Claude insan müdahalesi olmadan kendi yeteneklerini artıran özerk bir döngüde değil.

### Recursive self-improvement (özyinelemeli kendini geliştirme) nedir?

AI güvenliği literatüründe bu terim, bir sistemin insan müdahalesi olmadan kendi yeteneklerini artırmasını ifade ediyor; Anthropic'in açıkladığı %26'lık senaryo, insan yönlendirmesinin hâlâ döngünün içinde olması nedeniyle bu tanıma tam olarak uymuyor.

### Bu %26 iddiası bağımsız olarak doğrulanabilir mi?

Şu an için hayır — rakam doğrudan Anthropic'in kendi açıklamasına dayanıyor ve bağımsız bir denetim veya üçüncü taraf doğrulaması kamuya açıklanmadı; bu tür kendinden bildirilen metriklerin sektör genelinde nasıl ölçüldüğüne dair ortak bir standart da henüz yok.

### Yazılımcılar bu gelişmeden endişelenmeli mi?

Endişeden çok, trendi takip etmek daha faydalı: Claude'un uçtan uca tamamlayabildiği iş oranı büyüdükçe, insan mühendisin rolü rutin uygulamadan hedef belirleme ve sonuç değerlendirmeye kayıyor; bu geçişe hazırlanmak, panik yapmaktan daha yapıcı bir tepki.

Claude'un güncel model ailesi hakkında [Claude Opus 5 Geldi](/tr/posts/claude-opus-5-geldi) yazımıza, AI'a dayanıklı beceriler konusunda [AI'a Dayanıklı Yazılımcı Becerileri](/tr/posts/ai-dayanikli-yazilimci-becerileri) rehberimize bakabilirsiniz. Daha fazla yapay zeka içeriği için [Yapay Zeka kategorimizi](/tr/category/yapay-zeka) ziyaret edin.

Kaynaklar: [Anthropic'in Claude'un kendi Ar-Ge'sine katkısı açıklaması (US News)](https://www.usnews.com/news/business/articles/2026-09-17/anthropic-says-its-model-claude-is-helping-to-build-the-next-version-of-itself) ve [Spectrum Local News haberi](https://spectrumlocalnews.com/us/snplus/business/2026/09/18/anthropic-claude-helping-to-build-next-version).
