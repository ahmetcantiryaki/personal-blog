---
title: "AI ile Oyun Yapan Geliştiricilerin Hikayeleri"
slug: "ai-ile-oyun-yapan-gelistiriciler"
translationKey: "ai-game-dev-stories"
locale: "tr"
excerpt: "Pieter Levels bir tarayıcı uçuş simülatörünü 17 günde 1 milyon dolar ARR'a taşıdı. AI ile oyun yapan geliştiricilerin gerçek, rakamlı hikayeleri burada."
category: "technology"
tags: ["ai-coding", "ai-tools", "automation", "productivity", "learning"]
publishedAt: "2026-07-14"
seoTitle: "AI ile Oyun Yapan Geliştiriciler: Gerçek Hikayeler"
seoDescription: "Pieter Levels'ın 1 milyon dolarlık uçuş simülatöründen Vibe Jam kazananlarına: AI ile oyun yapan geliştiricilerin gerçek, rakamlı ve eğlenceli hikayeleri."
---

22 Şubat 2025 sabahı, Amsterdam'da yaşayan Hollandalı bir geliştirici olan Pieter Levels bilgisayarının başına oturdu ve kendine basit bir soru sordu: "Acaba yapay zeka gerçekten bir oyun yazabilir mi?" O gün başlattığı deney, birkaç hafta içinde bir milyon dolarlık yıllık gelire koşacak, X'te 100 milyon görüntülenmeyi aşacak ve "vibe coding" denen yeni bir akımın kıvılcımı olacaktı. Bu yazıda, klavye başında tek başına oturup yapay zekaya "şunu yap" diyerek gerçekten oyun çıkaran insanların hikayelerini anlatıyoruz. Abartı yok, uydurma rakam yok; hepsi kaynaklı.

## Üç saatte bir uçuş simülatörü: Pieter Levels'ın hikayesi

Pieter Levels aslında bir gecede meşhur olmadı. Nomad List ve Photo AI gibi projelerle yıllardır tek kişilik girişimlerden geçimini sağlayan, "tek kişilik yazılım fabrikası" olarak tanınan biriydi. Ama oyun yapmayı hiç denememişti. Microsoft Flight Simulator'ı açmanın uzun sürmesinden, güncelleme indirmekten sıkılmıştı; "tarayıcıda açılır açılmaz uçabileceğim bir şey olsa" diye düşünüyordu.

Bütün süreci daha sonra [kendi sitesinde uzun uzun anlattı](https://levels.io/fly-pieter-com-vibecoded-flight-simulator). O sabah Cursor adlı yapay zeka destekli kod editörünü açtı, arka planda Claude ve Grok 3 modellerini çalıştırdı, 3B katman için Three.js kütüphanesini kullandı. Kod yazmıyordu; yapay zekaya ne istediğini İngilizce anlatıyor, çıkan sonucu tarayıcıda deniyor, "şunu düzelt, şurayı ekle" diyordu. Yaklaşık üç saat sonra elinde gökyüzünde uçabildiği kaba bir uçak vardı. Süreci büyük ölçüde canlı olarak X'te paylaştı ve işte tam bu şeffaflık, hikayenin kartopu gibi büyümesini sağladı.

![fly.pieter.com tarayıcı uçuş simülatörü](/images/blog/ai-game-dev-stories/01.jpg "Kaynak: fly.pieter.com ekran goruntusu")

### Rakamlar gerçekten çılgıncaydı

fly.pieter.com kısa sürede çok oyunculu bir tarayıcı simülatörüne dönüştü. Levels'ın kendi anlatımına göre proje **17 günde 0'dan 1 milyon dolar ARR'a** ulaştı; yani aylık yaklaşık 87 bin dolarlık gelire. İlk ayında **320 bin kişi** oyunda uçtu, pik anlarda **22-26 bin** kişi aynı anda gökyüzündeydi. X'teki paylaşımlar toplamda 100 milyondan fazla görüntülenme aldı. Bir yıl sonra bile proje aylık 70 ila 138 bin dolar bandında gelir getirmeye devam ediyordu — hepsi tek kişilik bir operasyonla.

Peki para nereden geliyordu? Levels oyunun içine sponsor reklam alanları koydu. Gökyüzünde marka logolu uçaklar uçuyor, dev "reklam gezegenleri" havada asılı duruyor, tıklanabilir küreler sponsor sitelerine yönlendiriyordu. En büyük alıcılar, geliştirici ve teknoloji meraklısı kitleye ulaşmak isteyen yapay zeka girişimleriydi. Bunun üstüne oyun içi satın almalar da vardı: 29,99 dolara bir F-16 avcı uçağı gibi.

Levels'ın kendisi bu başarının "10 yıllık hazırlığın üstüne geldiğini" defalarca vurguladı. Yani üç saatte oyunu yaptı, ama o oyunu milyonlara duyurabilecek takipçi kitlesini ve dağıtım kasını kurmak on yıl sürmüştü. Bu ayrım, hikayenin en çok atlanan ama en önemli dersi. Yapay zekanın gerçekten geliştiriciyi hızlandırıp hızlandırmadığı tartışmasını [yapay zeka verimlilik paradoksu yazımızda](/tr/posts/yapay-zeka-verimlilik-paradoksu) ayrıntısıyla ele aldık.

Hikayenin en sevdiğim yanı ise şeffaflığın kendisi. Levels her adımı, hataları, çöken sunucuları ve gelen ilk sponsor tekliflerini canlı olarak paylaştı. İnsanlar sadece bir oyunu değil, bir oyunun doğuşunu izliyordu. Bu "açık geliştirme" tarzı, oyunun kendisini bir içerik makinesine dönüştürdü; her paylaşım yeni oyuncu, her yeni oyuncu daha fazla paylaşım getirdi. Kod üç saatte yazılmış olabilir, ama bu geri besleme döngüsünü kurmak asıl ustalıktı.

## Vibe Jam 2025: bin geliştiricinin katıldığı altına hücum

Levels'ın hikayesi tek başına kalsa "şanslı bir istisna" diye geçiştirilebilirdi. Ama olay bir akıma dönüştü. Mart 2025'in sonunda Levels, [Vibe Coding Game Jam](https://jam.pieter.com/) adında bir yarışma başlattı. Kuralları basitti ama radikaldi: kodun en az yüzde 80'i (sonraki edisyonda yüzde 90'ı) yapay zeka tarafından üretilmiş olmalı, oyun tarayıcıda çalışmalı, indirme yok, giriş ekranı yok, ağır yükleme yok.

Sonuç şaşırtıcıydı. Yarışmaya **1.170'ten fazla oyun** gönderildi. Katılımcılar arasında profesyonel yazılımcılar da vardı, hayatında hiç ciddi kod yazmamış meraklılar da. Birçoğu çalışan bir oyunu 48 saatin altında bitirdi. Bir aylık pencere içinde binlerce oynanabilir tarayıcı oyununun çıkabildiğini kanıtlayan ilk büyük etkinlik buydu.

![Vibe Coding Game Jam yarışma sayfası](/images/blog/ai-game-dev-stories/02.jpg "Kaynak: jam.pieter.com ekran goruntusu")

### Taksici oyunu birinciliği kaptı

[Kazananların açıklandığı listeye göre](https://www.indiehackers.com/post/tech/pieter-levels-just-announced-the-winners-of-the-2025-vibe-code-game-jam-Uz0wHG4pI3KBOiFhP5YR), yarışmanın büyük ödülünü **Tomas Bencko** adlı geliştiricinin yaptığı **The Great Taxi Assignment** kazandı ve 10 bin dolar ödülü aldı. GTA'yı andıran bu oyunda oyuncu bir taksi şoförü olarak kalabalık bir şehirde dolaşıyor, tuhaf yolcuları alıp bırakıyor, trafik sıkışıklığı ve beklenmedik olaylarla baş ediyor, kazandığı parayla taksisini hızlandırıp kapasitesini artırıyordu. İkinciliği ise Matt Gordon'un yaptığı, oyuncunun görev alan bir bota dönüştüğü **Vibeware** oyunu 5 bin dolarla kazandı.

Buradaki asıl mesaj ödüller değil, kültürel kaymaydı: Bir aylık sürede binden fazla insan, çoğu geleneksel oyun geliştirme bilgisine sahip olmadan, oynanabilir bir şeyi internete koyabildi. Oyun yapmanın giriş bariyeri, tarihte hiç olmadığı kadar aşağı inmişti.

Katılımcıların anlattıklarına bakınca ortak bir örüntü çıkıyor: kimse baştan büyük bir plan yapmamış. Çoğu, kafasındaki en basit fikirle başlamış, yapay zekaya kabaca anlatmış, çıkan ilk sürümü oynamış ve sonra "şu daha eğlenceli olur" diyerek adım adım büyütmüş. Yani süreç bir mühendislik projesinden çok, bir oyun oynama seansına benziyordu. Bu da yapay zeka çağında üretkenliğin sırrının mükemmel planlama değil, hızlı ve oyuncul deneme olduğunu bir kez daha gösteriyor.

## Vibe Jam 2026: kapibaralar ve olgunlaşan bir akım

Hikaye 2025'te bitmedi. 1 Nisan 2026'da Levels, bu kez Cursor ve Bolt sponsorluğunda [ikinci Vibe Jam](https://vibej.am/2026/)'i başlattı. Ödül havuzu büyümüştü: birinciye 25 bin dolar, toplamda 40 bin dolar nakit. Yaklaşık **1.000 oyun** gönderildi ve bu kez jüride çeşitli oyun geliştiricileri ile yapay zeka uzmanları vardı.

Birinciliği **@leocooout** adlı yapıcının yaptığı "A Game About Capybaras Delivering Food" (Yemek Dağıtan Kapibaralar Hakkında Bir Oyun) kazandı ve 25 bin doları cebe attı. İkincilik "Fanto's Mega-Mart" oyununa 10 bin dolar, üçüncülük "WenWare" oyununa 5 bin dolar olarak gitti. İki yıl arayla bakınca fark net: 2025'te olay "yapay zeka gerçekten oyun yapabiliyor mu" sorusuydu; 2026'da soru "bu oyunlardan hangisi daha eğlenceli ve cilalı" haline gelmişti. Akım olgunlaşmıştı.

## Gerçeklik payı: herkes milyoner olmuyor

Şimdi hikayenin daha az romantik kısmına gelelim, çünkü dürüst olmak zorundayız. 404 Media'nın Levels'ın oyunuyla ilgili haberinin başlığı şuydu: ["Bu Oyun Ayda 50 Bin Dolar Kazanıyor. Seninki Muhtemelen Kazanmayacak."](https://www.404media.co/this-game-created-by-ai-vibe-coding-makes-50-000-a-month-yours-probably-wont/) Bu başlık, tüm coşkuya rağmen soğuk bir gerçeği hatırlatıyor.

Vibe Jam'e binlerce oyun gönderildi ama sadece bir avuç tanesi ödül kazandı, sadece bir tanesi milyon dolarlık gelire ulaştı. itch.io gibi platformlarda ortalama bir indie oyunun yıllık geliri hâlâ birkaç yüz ila birkaç bin dolar bandında geziniyor. Yapay zeka oyun yapmayı kolaylaştırdı, ama oyunu fark ettirmeyi, cilalamayı ve bir kitleye ulaştırmayı kolaylaştırmadı. Pieter Levels'ın on yıllık takipçi kitlesi olmadan aynı oyunu yayınlasaydınız, muhtemelen kimse uçmazdı.

![Pieter Levels'ın fly.pieter.com hikayesini anlattığı yazı](/images/blog/ai-game-dev-stories/03.jpg "Kaynak: levels.io ekran goruntusu")

Bir başka önemli nokta: hızlı üretilen kod, uzun vadede bakım yükü demek. "Kodun karmaşık olması umurumda değil, yeter ki çalışsın" yaklaşımı bir prototip için harika, ama oyun büyüdükçe ve gerçek kullanıcılar geldikçe bu borç faiziyle geri dönüyor. Sektörde bu yüzden "vibe coding bitti mi" tartışması başladı; daha disiplinli bir alternatif olan yaklaşımı [spec-driven development rehberimizde](/tr/posts/spec-driven-development-rehberi) inceledik.

## Bu hikayelerden çıkan dersler

Peki klavye başında oturan bir geliştirici bu hikayelerden ne öğrenmeli? Birkaç net çıkarım var:

### Hız artık bir avantaj değil, temel şart

Üç saatte oynanabilir bir prototip çıkarabiliyorsanız, fikri kafanızda aylarca büyütmenin bir anlamı kalmıyor. Yapay zekanın en büyük hediyesi, "acaba tutar mı" sorusunu saatler içinde deneyle cevaplayabilmeniz. Bu yüzden en iyi vibe coder'lar mükemmel plan yapmaya değil, hızlı denemeye ve elemeye odaklanıyor.

### Dağıtım, koddan daha değerli

fly.pieter.com'un başarısı büyük ölçüde koddan değil, Levels'ın canlı yayın yapması ve on yıllık kitlesiydi. Oyununuzu kimse görmeyecekse, ne kadar iyi olduğu önemli değil. Kendi kitlenizi kurmaya bugünden başlamak, gelecekteki her projenizin çarpanı oluyor.

### Doğru araç, doğru döngü

Vibe coding ile başarılı olan projeler tesadüfen Cursor etrafında kümeleniyor; çünkü dosya farkındalıklı editör davranışı ve "oyna-düzelt-tekrar oyna" sıkı döngüsü tam da oyun geliştirmenin ihtiyaç duyduğu şey. Doğru aracı seçmek, deneme hızınızı doğrudan belirliyor. Hangi araçların öne çıktığını [2026'nın en popüler yapay zeka araçları yazımızda](/tr/posts/en-populer-yapay-zeka-araclari-2026) derledik.

### Küçük ve eğlenceli, büyük ve kusursuzdan iyidir

Kazanan oyunlara bakın: taksici simülatörü, yemek dağıtan kapibaralar. Hiçbiri teknik bir şaheser değil. Ortak noktaları, basit ama tuhaf ve paylaşılası fikirler olmaları. Yapay zeka çağında rekabet avantajı teknik derinlikten çok, akılda kalan bir fikirden geliyor.

Bu hikayelerin en güzel yanı, hepsinin bir hafta sonu denemesiyle başlamış olması. Kendi denemenize başlamak için ilham arıyorsanız, [hafta sonu yapılabilecek yapay zeka projeleri yazımıza](/tr/posts/hafta-sonu-ai-projeleri) göz atabilirsiniz. Belki bir sonraki viral tarayıcı oyununu siz çıkarırsınız — ya da en azından çok eğlenirsiniz.

## Sıkça Sorulan Sorular

### Vibe coding tam olarak nedir?

Vibe coding, yapay zeka asistanını ana geliştirme aracı olarak kullanmak demek. Ne istediğinizi düz İngilizce (ya da Türkçe) anlatıyorsunuz, yapay zeka kodu yazıyor, siz yaratıcı yönü yönlendiriyorsunuz. Terim, eski Tesla ve OpenAI mühendisi Andrej Karpathy tarafından 2025 başında ortaya atıldı. Vibe Jam kurallarında kodun en az yüzde 90'ının yapay zeka tarafından üretilmesi bekleniyordu.

### Gerçekten kod bilmeden oyun yapılabilir mi?

Kısmen evet. Vibe Jam'e katılanların bir kısmı hayatında ciddi kod yazmamış meraklılardı ve çalışan oyunlar çıkardılar. Ancak "çalışan bir prototip" ile "milyonlarca kişinin oynadığı, bakımı yapılabilen bir ürün" arasında büyük fark var. İkincisi için hâlâ mimari, performans ve dağıtım bilgisi gerekiyor.

### fly.pieter.com gerçekten 1 milyon dolar kazandı mı?

Pieter Levels'ın kendi paylaşımlarına göre proje 17 günde 1 milyon dolar yıllık gelire (yaklaşık 87 bin dolar aylık) ulaştı ve uzun süre yüksek gelir getirmeye devam etti. Gelirin ana kaynağı oyun içi sponsor reklam alanlarıydı. Rakamlar geliştiricinin kendi açıklamalarına dayanıyor.

### Ben de aynısını yapıp para kazanabilir miyim?

Teknik olarak oyun yapmak artık çok kolay, ama para kazanmak kolay değil. Binlerce vibe-coded oyun içinde sadece bir avuç tanesi ciddi gelir elde etti. Farkı yaratan şey genellikle kodun kendisi değil, geliştiricinin önceden kurduğu kitle, dağıtım gücü ve fikrin paylaşılabilirliği oluyor. Gerçekçi beklentiyle başlamak en sağlıklısı.
