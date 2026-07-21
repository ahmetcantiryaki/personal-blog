---
title: "Yapay Zeka Tarayıcıları: Comet, Atlas ve Gemini"
slug: "yapay-zeka-tarayicilari-karsilastirma"
translationKey: "agentic-browsers-comparison"
locale: "tr"
excerpt: "Comet, Atlas ve Chrome'daki Gemini, ajan tabanlı tarayıcı için farklı bahisler oynuyor. Yetenek, fiyatlandırma ve prompt injection riskini karşılaştırdık."
category: "ai"
tags: ["ai-agents", "chatgpt", "gemini", "web-security"]
publishedAt: "2026-07-21"
seoTitle: "Yapay Zeka Tarayıcıları 2026: Comet, Atlas, Gemini"
seoDescription: "Temmuz 2026 için ajan tabanlı tarayıcı rehberi: Comet, Atlas, Chrome Gemini ve Edge Copilot karşılaştırması, agent mode ve güvenlik riskleri."
---

Ajan tabanlı tarayıcı (agentic browser), yapay zeka ajanının doğrudan tarama oturumuna gömülü olduğu bir web tarayıcısıdır. Sayfayı özetlemekle yetinmez; kaydırma, tıklama, form doldurma yapar ve sizin adınıza gerçek, oturum açılmış bir tarayıcı içinde çok adımlı görevleri tamamlar: sekmeler arasında fiyat karşılaştırmak, rezervasyon yapmak, bir formu doldurup göndermek gibi.

Bu tek yetenek, kategoriyi birbirinden çok farklı iki bahse böldü. Temmuz 2026 itibarıyla bir grup şirket sıfırdan ajan etrafında kurulmuş bir tarayıcı inşa ediyor; diğer grup ise insanların zaten kullandığı bir tarayıcının üzerine asistan ekliyor. Sıfırdan inşa edilen bahislerden biri kamuoyu önünde açıkça başarısız oldu bile. Aşağıda haritayı, karşılaştırmayı ve bu kategoriyi sıradan bir sohbet botundan gerçekten farklı kılan güvenlik riskini bulacaksınız.

## Aynı Fikre İki Çok Farklı Yaklaşım

### Bağımsız Ajan Tarayıcılar: Comet ve Kapanmakta Olan Atlas

Perplexity'nin Comet'i ve OpenAI'ın ChatGPT Atlas'ı, mümkün olan en cesur yolu seçti: bir eklenti değil, sıfırdan tam bir tarayıcı inşa ettiler ki ajan sekmelere, oturumlara ve çerezlere doğal ve kısıtlanmamış biçimde erişebilsin. İkisi arasında daha atılgan olan Comet oldu. [18 Mart 2026'da iOS'a taşındı](https://www.macrumors.com/2026/03/18/perplexity-comet-browser-iphone/) ve bu lansman daha büyük bir hamleyle birlikte geldi: Comet'in masaüstü çekirdek tarayıcısı tamamen ücretsiz hale geldi; Pro ve Max abonelikleri (aylık 20 dolardan başlayarak) daha derin Deep Research erişimi gibi ek yetenekler için ayrıldı. [iOS uygulaması sesli mod ve Perplexity'nin Deep Research motoruyla geliyor](https://www.perplexity.ai/hub/blog/meet-comet-for-ios), ancak tarayıcı eklentileri desteklemiyor; bu, masaüstü sürümünden ayrıldığı hâlâ süregelen bir eksiklik. Lansmanın kısa süre sonra iOS App Store'da genel sıralamada 3. sıraya kadar çıktığı bildirildi.

Atlas ise tam tersi bir yörüngeye girdi. OpenAI, tarayıcıyı Ekim 2025'te piyasaya sürmüştü; Temmuz 2026'da ise [bağımsız Atlas tarayıcısını kapattığını doğruladı](https://www.macrumors.com/2026/07/10/openais-chatgpt-atlas-browser-shutting-down/) ve kaldırma tarihi 9 Ağustos 2026 olarak belirlendi. Yaklaşık dokuz aylık ömrü boyunca Atlas, OpenAI'ın vaat ettiği Windows, iOS veya Android sürümlerinin hiçbirini hiç çıkarmadı — hayatı boyunca sadece macOS'ta kaldı. OpenAI, ayrı bir tarayıcıyı sürdürmek yerine, aynı "tarayıcınla sohbet et" yeteneğini doğrudan ChatGPT masaüstü uygulamasına taşıyor. Kullanıcılara son tarihten önce yer imlerini HTML olarak dışa aktarmaları söylendi; ChatGPT konuşma geçmişi ise etkilenmiyor, çünkü bu veri tarayıcıda değil hesapta saklanıyor.

### Eklenti Asistanlar: Chrome'daki Gemini ve Edge Copilot

Diğer kamp, tarayıcı pazarında toprak kapma yarışına hiç girmiyor. Google'ın Chrome'a eklediği Gemini entegrasyonu ile Microsoft'un Edge'e eklediği Copilot, zaten pazar payına hâkim olan tarayıcılara ajan özellikleri ekliyor; bu da kullanıcı için sıfır geçiş maliyeti anlamına geliyor — yeni bir uygulama yok, taşınacak yer imi yok, terk edilmiş bir alışkanlık yok. En azından 2026'nın ortası itibarıyla bunun bedeli derinlik: eklenti asistanlar sayfa düzeyinde soru-cevabı ve hafif görev desteğini iyi karşılıyor, ama genellikle sıfırdan inşa edilmiş bir ajan tarayıcının onlarca siteye yayılan uzun, özerk, çok adımlı eylem zincirlerini kurma becerisine erişemiyor.

## Yetenek ve Fiyatlandırma Karşılaştırması

| Ürün | Tür | Platformlar | Agent Mode | Fiyatlandırma | Durum (Temmuz 2026) |
|---|---|---|---|---|---|
| Comet (Perplexity) | Bağımsız tarayıcı | macOS, Windows, iOS | Var — çok adımlı görevler, Deep Research | Ücretsiz; Pro/Max aylık 20 dolardan | Aktif, büyüyor |
| Atlas (OpenAI) | Bağımsız tarayıcı | Yalnızca macOS | Var — "tarayıcınla sohbet et" | ChatGPT planlarına dahil | Kapanıyor, 9 Ağustos 2026'da kaldırılıyor |
| Chrome + Gemini | Eklenti asistan | Windows, macOS, Linux, Android, iOS | Sınırlı — sayfa soru-cevabı, hafif görev desteği | Google/Gemini planlarına dahil | Aktif |
| Edge + Copilot | Eklenti asistan | Windows, macOS | Sınırlı — sayfa soru-cevabı, hafif görev desteği | Edge ile ücretsiz | Aktif |

## Agent Mode Gerçekte Ne Yapıyor?

Genelde üstünkörü geçilen ayrıntı burada: agent mode, "bu sayfayı özetle" komutunun daha akıllı bir versiyonu değil. Bu modu açtığınızda tarayıcı, modele gerçek bir kontrol devrediyor — render edilmiş DOM'u okuyabiliyor, hangi düğmenin "gönder" anlamına geldiğine karar verebiliyor, bir form alanına yazabiliyor, yeni bir URL'ye gidebiliyor ve tek cümleyle tarif ettiğiniz görevi bitirmek için bu döngüyü onlarca kez tekrarlayabiliyor. Bu, [öncü sohbet modellerini](/tr/posts/claude-sonnet-5-gpt-5-6-gemini-3-5-kiyaslamasi) yalnızca akıl yürütme kalitesiyle karşılaştırmaktan kökten farklı bir yetenek; bir ajan tarayıcı, doğru şeye ne kadar güvenilir tıkladığı kadar ne kadar iyi akıl yürüttüğüyle de değerlendiriliyor.

## Bu Kategorinin Görmezden Gelinemeyecek Riski

Bir yapay zeka sistemine, oturum açmış tarayıcı oturumunuzun içinde tıklama ve form doldurma yetkisi vermek, sıradan bir sohbet botunun sahip olmadığı yeni bir risk sınıfı yaratıyor: prompt injection ve sidebar spoofing. Kötü niyetli bir sayfa, içeriğine gizli talimatlar gömebilir — görünmez metin, manipüle edilmiş bir öğe, sahte bir "asistan" paneli — ve ajan bunu bağlamının bir parçası olarak okuyup sanki siz yazmışsınız gibi uygulayabilir. En kötü senaryoda bu, ajanın kendiliğinden bir kimlik avı sayfasına gitmesi, olmaması gereken bir veriyle bir formu göndermesi ya da açık bir sekmeden bir bilgiyi sızdırması anlamına gelebilir. Bu, 2026'da tek bir ürüne özgü bir kusur değil, tüm ajan tarayıcı kategorisinde aktif olarak tartışılan bir sorun; konuyu [agentjacking'in yeni bir AI ajan saldırı sınıfı olarak nasıl ortaya çıktığını](/tr/posts/agentjacking-yeni-ai-ajan-saldirisi) ele aldığımız yazıyla birlikte okumanızı öneririz. Mevcut bir ürünün içine ajan özellikleri ekleyen tarayıcı üreticileri de aynı riske maruz kalıyor — bağımsız-eklenti ayrımının diğer tarafından bakan [Claude in Chrome'un GA sürümüne dair geliştirici güvenlik rehberimize](/tr/posts/claude-in-chrome-ga-gelistirici-guvenlik-rehberi) göz atabilirsiniz.

## Ders Niteliğinde Bir Vaka: Atlas'ın Kapanışı

Atlas, bu kategorinin şimdiye kadar ürettiği en net vaka çalışması. OpenAI baştan sona yeni bir tarayıcı çıkardı, kullanıcılardan günlük tarayıcılarını değiştirmelerini istedi, ardından söz verdiği diğer üç platforma hiç ulaşmadan bir yıldan kısa sürede projeyi durdurdu. Gerekçe de çok şey anlatıyor: OpenAI, ajan tabanlı tarama özelliğini insanların zaten kullandığı bir ürüne — ChatGPT uygulamasına — eklemenin, insanları mevcut tarayıcılarından vazgeçirmeye ikna etmekten daha kolay olduğu sonucuna vardı. Bu, en azından OpenAI'ın bu özel uygulamasında, "bağımsız tarayıcı" bahsinin "eklenti" bahsine kaybettiğinin bir itirafı sayılır. Bu alanı değerlendiren herkes için hatırlatıcı olan şu: tarayıcı, bilgisayar dünyasındaki en yapışkan alışkanlıklardan biri ve kullanıcılardan yıllar boyunca biriktirdikleri yer imlerini, şifreleri ve eklentileri yeni bir eve taşımalarını istemek, iyi bir ajan çıkarmaktan çok daha yüksek bir bar.

## Peki Bağımsız Bir Tarayıcı Gerçekten Doğru Kalıp mı?

Sıfırdan bir tarayıcı inşa etmek, bir yapay zeka ajanını sunmanın gerçekten doğru yolu mu, yoksa bir yan yol mu? Atlas'ın sonu, çoğu kullanıcı için ikincisine işaret ediyor — Chrome ve Edge zaten dağıtım gücüne sahip, Gemini ve Copilot'un yapması gereken tek şey bir platform savaşı kazanmak değil, yetenek farkını kapatmak. Ama Comet'in büyüme eğrisi resmi biraz karmaşıklaştırıyor: ücretsiz katmana geçişi ve iOS'taki hızlı ivmesi, Perplexity'yi zaten varsayılan arama aracı olarak kullanan kişiler için tarayıcı değiştirmenin eskisi kadar büyük bir talep olmadığını gösteriyor — bu kullanıcılar zaten yolun yarısındalar. Benim çıkarımım şu: bağımsız bahis ancak tarayıcının kendisi talebin küçük bir parçası olduğunda hayatta kalıyor, çünkü ürünün gerçek çekim gücü — arama, araştırma, yerleşik bir alışkanlık — geçişi sizin yerinize yapıyor. Bu çekim gücü olmadığında ise varsayılan kazanan eklenti oluyor.

## Sıkça Sorulan Sorular

### Ajan tabanlı tarayıcı tek cümleyle nedir?

Tarama oturumunuzun içinde gerçek eylemler yapabilen — kaydırma, tıklama, form doldurma, sekmeler arasında gezinme — bir yapay zeka ajanı barındıran ve bu sayede sadece sayfa hakkında soru cevaplamak yerine çok adımlı görevleri tamamlayabilen bir tarayıcıdır.

### ChatGPT Atlas tamamen ortadan mı kalkıyor?

Tam olarak değil. OpenAI, bağımsız Atlas tarayıcısını 9 Ağustos 2026'da kullanımdan kaldırıyor, ama aynı "tarayıcınla sohbet et" yeteneği ChatGPT masaüstü uygulamasına taşınıyor. ChatGPT konuşma geçmişiniz etkilenmiyor çünkü veriler hesabınızda saklanıyor; yine de son tarihten önce Atlas'taki yer imlerinizi HTML olarak dışa aktarmanız gerekiyor.

### Prompt injection neden ajan tarayıcılarda sıradan bir sohbet botuna göre daha büyük bir sorun?

Çünkü ajan sadece cevap vermiyor, gerçekten eylem gerçekleştirebiliyor. Kötü niyetli bir web sayfasına gömülü gizli bir talimat, ajanı bir bağlantıya tıklamaya, bir formu göndermeye ya da kullanıcının hiç istemediği bir yere gitmeye yönlendirebilir — tarama ve form doldurma gücü olmayan sıradan bir sohbet botunda böyle bir risk yoktur.

### Comet'e mi geçmeliyim, yoksa Chrome'daki Gemini gibi bir eklenti asistanla mı devam etmeliyim?

Zaten Perplexity ekosisteminde derinseniz ya da en özerk çok adımlı görev desteğini istiyorsanız, Comet'in artık ücretsiz olan katmanı denemeyi düşük riskli hale getiriyor. Günlük tarayıcınızı hiç değiştirmek istemiyorsanız, Chrome'daki Gemini veya Edge'deki Copilot, sıfır geçiş maliyetiyle bu değerin önemli bir kısmını size veriyor.
