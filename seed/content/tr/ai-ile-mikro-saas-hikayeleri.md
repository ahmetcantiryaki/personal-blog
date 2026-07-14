---
title: "AI ile Mikro-SaaS: Gerçek Maker Hikayeleri"
slug: "ai-ile-mikro-saas-hikayeleri"
translationKey: "micro-saas-ai-stories"
locale: "tr"
excerpt: "Pieter Levels, Danny Postma ve Tony Dinh tek başına nasıl gelir getiren mikro-SaaS kurdu? Gerçek MRR rakamları ve fikirden ilk müşteriye pratik yol haritası."
category: "business"
tags: ["ai-tools", "automation", "productivity", "roadmap", "best-practices"]
publishedAt: "2026-07-14"
seoTitle: "AI ile Mikro-SaaS: Maker Hikayeleri ve Yol Haritası"
seoDescription: "AI ile mikro-SaaS kuran gerçek maker'ların MRR rakamları, kullandıkları araçlar ve fikirden ilk ödeyen müşteriye giden adım adım yol haritası bu rehberde."
---

Bir yazılımcının bilgisayarı, bir kredi kartı ve birkaç AI aboneliği. 2026'da "startup" kurmak için gereken malzeme listesi kabaca bu kadar kısaldı. Kod yazamayan kurucuların bile üç haftada gelir getiren ürün çıkardığı, tek kişilik ekiplerin ayda beş altı haneli rakamlara ulaştığı bir dönemdeyiz. Ama bu tabloda bolca abartı ve hayatta kalma yanılgısı var. Bu yazıda gerçek rakamları olan maker hikayelerini masaya yatırıp, ardından fikirden ilk ödeyen müşteriye giden somut bir yol haritası çıkaracağız.

Önce beklentiyi ayarlayalım: [Indie Hackers](https://www.indiehackers.com/) verilerine göre Stripe'a bağlı ürünlerin yaklaşık yarısı sıfır gelir üretiyor ve mikro-SaaS'ların çoğu ayda 1.000 doların altında kalıyor. Yani aşağıdaki hikayeler kuralın değil, istisnanın örnekleri. Yine de istisnaları incelemek, hangi kalıpların işe yaradığını görmenin en hızlı yolu.

![Dizüstü bilgisayarda tek kişilik SaaS kuran bir maker](/images/blog/micro-saas-ai-stories/01.jpg "Kaynak: Unsplash")

## Pieter Levels: PHP, jQuery ve inatçılıkla 130 bin dolar

Mikro-SaaS dünyasının en çok konuşulan ismi Pieter Levels. Şubat 2023'te [Photo AI](https://photoai.com/) adlı yapay zeka fotoğraf stüdyosunu tek başına yayınladı; slogan basitti: "Fotoğrafçını kov." Ürün, yüklediğiniz birkaç selfie'den profesyonel görünümlü portreler üretiyor.

Rakamların hikayesi şöyle: ilk haftada yaklaşık 5.400 dolar aylık gelir, ikinci ayda 28 bin dolar, altıncı ayda 60 bin doları aşan bir seviye. [Indie Hackers'taki vaka çalışmasına](https://www.indiehackers.com/) ve kamuya açık gelir sayfalarına göre ürün 2025 sonunda ayda 132-138 bin dolar bandına, yani yıllık 1,6 milyon dolar civarı bir seviyeye ulaştı. En çarpıcı kısım maliyet tarafı: aylık giderleri çoğunlukla model API ücretlerinden oluşan 13 bin dolar civarında, yani net kâr marjı yüzde 85'in üzerinde.

Peki teknoloji yığını ne? Modaya uygun hiçbir şey değil. Vanilla PHP, jQuery ve tek dosyalık SQLite. Levels'ın felsefesi şu: araç seçimini değil, problemi ciddiye al. 2026'da giderek daha çok "vibe coding" yaptığını, yani AI ile hızlıca prototip döküp iterasyonu ışık hızına çıkardığını anlatıyor. Bu yaklaşımın disiplinli versiyonunu [spec-driven development yazımızda](/tr/posts/spec-driven-development-rehberi) ayrıntısıyla ele aldık.

Ama asıl ders teknik değil. Levels bu ürünü on yılda inşa ettiği 600 binden fazla takipçili kitleye lanse etti; trafiğinin yarısı doğrudan X/Twitter'dan geliyor. Yani "üç günde ürün, birinci haftada 20 bin dolar" başlığının altındaki dipnot, on yıllık kitle kurma emeği.

## Danny Postma: SEO motoruyla ayda 300 bin dolar

Hollandalı indie hacker Danny Postma'nın hikayesi farklı bir kaldıraç gösteriyor: arama motoru optimizasyonu. Daha önce AI yazı aracı Headlime'ı sekiz ayda yedi haneli bir rakama sattıktan sonra, [HeadshotPro](https://www.headshotpro.com/) adlı yapay zeka vesikalık üreticisini kurdu. [Starter Story'nin analizine](https://www.starterstory.com/stories/headshotpro-breakdown) göre ürün, lansmanından sonraki bir yıl içinde ayda 300 bin dolar gelire ve 196 binden fazla müşteriye ulaştı.

Postma'nın büyümesi Levels'ın aksine sosyal medyaya değil, içerik ve SEO'ya dayanıyordu. "AI headshot", "linkedin fotoğrafı" gibi yüksek niyetli aramaları hedefleyen sayfalar kurdu ve kurumsal takım paketleriyle ortalama sipariş değerini yükseltti. Ders şu: dağıtım kanalınız ürününüz kadar stratejik bir karar. Kitleniz yoksa, arama niyeti olan bir niş seçmek en sağlıklı alternatif.

## Tony Dinh: API çıktığı gün masaya oturmak

Vietnamlı geliştirici Tony Dinh'in [TypingMind](https://www.typingmind.com/) hikayesi hız üzerine bir ders. ChatGPT API'si Mart 2023'te duyurulduğunda, Dinh resmi uygulamada eksik olan özellikleri (sohbet geçmişi araması, klasörler, prompt kütüphanesi, daha hızlı yanıt) ekleyen bir arayüzü sadece beş günde çıkardı. İlk yedi günde 22 bin dolar kazandı; 20 ay sonunda toplam 1 milyon dolara ulaştı ve ilk 12 ayda 171 güncelleme yayınladı. Yan ürünü DevUtils da ayda 5.500 dolar getiriyor.

Buradaki kalıp net: yeni bir platform ya da API çıktığında, resmi ürünün ilk sürümünde her zaman boşluklar olur. O boşluğu ilk dolduran, dağıtım avantajını kapar. Dinh kod yazabilen bir geliştiriciydi ama asıl kazandığı şey zamanlamaydı.

![Gelir grafiği ve büyüme metriklerini gösteren ekran](/images/blog/micro-saas-ai-stories/02.jpg "Kaynak: Unsplash")

## Braden Dennis: AI-native bir veri ürünü

Dördüncü hikaye biraz daha "ciddi" bir örnek. Braden Dennis'in kurduğu [Fiscal.ai](https://fiscal.ai/) (eski adıyla FinChat), finansal veriyi hizmet olarak sunan AI-native bir ürün. Kamuya açık paylaşımlara göre ürün orta-yedi haneli yıllık gelire, yani ayda 400 bin doları aşan bir seviyeye ulaştı ve bunu sıfır reklam harcamasıyla, ürün odaklı büyüme ve doğrudan satışla yaptı.

Fiscal.ai'nin dersi şu: AI, sadece "eğlenceli tüketici oyuncakları" değil, ciddi B2B veri ürünleri de kurdurabiliyor. Yapay zekayı bir özellik olarak değil, verinin kendisini işleyen çekirdek katman olarak konumlandırdığınızda fiyatlandırma gücü tamamen değişiyor.

Bir tüketici uygulaması aylık 20 dolara satılırken, kurumsal bir veri ürünü aynı çabayla yüzlerce dolarlık abonelikler yazabiliyor. Bu fark, hangi müşteri segmentini seçtiğinizin ürünün kendisi kadar belirleyici olduğunu gösteriyor. Solo bir kurucu için B2B'nin dezavantajı daha uzun satış döngüsü, avantajı ise daha az müşteriyle daha yüksek ve daha kararlı gelir. İki yolun da doğrusu yok; sizin sabrınıza, ağınıza ve çözdüğünüz problemin kime ne kadar acı verdiğine bağlı bir tercih bu.

## Ortak kalıplar: hikayelerin arkasındaki matematik

Dört hikayenin ortak noktalarını bir tabloda toplamak, tesadüf ile stratejiyi ayırt etmeye yardımcı oluyor.

| Maker | Ürün | Yaklaşık MRR | Ana dağıtım kanalı |
|---|---|---|---|
| Pieter Levels | Photo AI | ~132 bin $ | X/Twitter kitlesi |
| Danny Postma | HeadshotPro | ~300 bin $ | SEO ve içerik |
| Tony Dinh | TypingMind | ~83 bin $ | Erken zamanlama, topluluk |
| Braden Dennis | Fiscal.ai | ~400 bin $ | Ürün odaklı büyüme + satış |

Görülen ortak temalar üç tane. Birincisi, hepsi tek bir net problemi çözüyor; kimse "her şeyi yapan platform" kurmamış. İkincisi, dağıtım kanalı ürünle aynı anda tasarlanmış; kitle, SEO veya zamanlama tesadüf değil. Üçüncüsü, yüksek marj: yapay zeka API'leri değişken maliyet olsa da, iyi fiyatlanmış bir SaaS'ta bu maliyet gelirin küçük bir yüzdesi kalıyor.

## Fikirden ilk müşteriye: adım adım yol haritası

Şimdi hikayelerden çıkan kalıpları uygulanabilir bir plana dönüştürelim. Bu, hafta sonu projesinden ilk ödeyen müşteriye giden altı adımlık bir güzergâh.

**1. Adım — Kendi ağrınızdan başlayın.** En sağlam mikro-SaaS fikirleri, kurucunun kendi yaşadığı bir sıkıntıdan doğuyor. Tony Dinh, kendi kullandığı ChatGPT arayüzündeki eksiklerden yola çıktı. Zaten anladığınız bir problemi çözerseniz, müşteri araştırmasının yarısını bedavaya yapmış olursunuz.

**2. Adım — Kapsamı acımasızca küçültün.** Tek bir kullanıcı, tek bir görev, tek bir sonuç. "AI ile fotoğraf" yeterince dar; "AI ile her tür medya düzenleme platformu" değil. Dar kapsam hem daha hızlı çıkar hem de anlatması kolay olur.

**3. Adım — Kanıtlanmış yığını kurun.** 2026'nın standart solo yığını oldukça yerleşti: kod için [Cursor](https://cursor.com/) ve Claude Code, arka uç ve veritabanı için [Supabase](https://supabase.com/), barındırma için [Vercel](https://vercel.com/), ödeme için [Stripe](https://stripe.com/). Bu kombinasyon ayda birkaç yüz dolara tek kişilik bir operasyon çalıştırmanızı sağlıyor. AI araçlarını verimlilik açısından nasıl konumlandırdığımızı [AI ile geliştirici verimliliği yazımızda](/tr/posts/ai-gelistirici-verimliligi) ele almıştık.

**4. Adım — Bir hafta içinde çalışan bir MVP çıkarın.** Amaç mükemmellik değil, ilk kullanıcının gerçek bir sonuç almasını sağlayacak minimum akış. AI destekli kodlama en çok burada işe yarıyor: prototip döngüsünü günlere değil saatlere indiriyor. Hangi araçların bu işe uygun olduğuna dair güncel bir listeyi [en popüler yapay zeka araçları yazımızda](/tr/posts/en-populer-yapay-zeka-araclari-2026) bulabilirsiniz.

**5. Adım — Dağıtımı ürünle birlikte kurun.** Bu, çoğu makerın atladığı adım. Kitleniz varsa lansmanı oradan yapın; yoksa arama niyeti olan bir niş seçip ilk günden içerik üretmeye başlayın. "Yaptım ama kimse bilmiyor" mezarlığı, kötü ürünlerden değil, dağıtımı düşünülmemiş ürünlerden doludur.

**6. Adım — İlk günden para isteyin.** Ücretsiz kullanıcı sayısı bir gösterge değil. Gerçek doğrulama, birinin kredi kartını çıkarmasıdır. Fiyatı düşük tutup erken test edin; ödeme yapan ilk on müşteri, bin ücretsiz kullanıcıdan daha fazla şey öğretir. Fiyatlandırmayı sonra yukarı çekmek, baştan bedava alışkanlığı yaratmaktan kolaydır. İlk müşterilerle birebir konuşmayı da ihmal etmeyin; neden ödediklerini ve neyi kaçırdıklarını anlamak, bir sonraki özelliği tahmin etmekten çok daha güvenilir bir yol gösterici olur.

![Fikir panosu ve yol haritası planlaması](/images/blog/micro-saas-ai-stories/03.jpg "Kaynak: Unsplash")

## Gerçeklik kontrolü: neden çoğu proje başarısız oluyor

Bu hikayeleri okuyup "ben de üç günde 20 bin dolar kazanırım" diye düşünmek, tam da tuzağın kendisi. Başarılı örneklerin görünmez maliyetleri var: Levels'ın on yıllık kitlesi, Postma'nın önceki çıkışından gelen deneyim ve sermayesi, Dinh'in teknik hızı. Bu makerlar "bir gecede" başarılı olmadı; yıllarca denedikten sonra doğru anı yakaladılar.

Pratik sonuç şu: ilk ürününüz muhtemelen tutmayacak, ve bu normal. Önemli olan her denemede dağıtım kasınızı, kitle kasınızı ve ürün sezginizi güçlendirmek. Mikro-SaaS bir piyango değil, tekrar tekrar denenerek öğrenilen bir el sanatı. Yapay zeka bu el sanatının prototip kısmını ucuzlattı; ama dağıtım, fiyatlandırma ve sabır hâlâ sizin işiniz. Daha fazla girişimcilik içeriği için [girişimcilik ve iş kategorimize](/tr/category/girisimcilik-is) göz atabilirsiniz.

## Sıkça Sorulan Sorular

### Kod bilmeden AI ile mikro-SaaS kurulur mu?

Kısmen. AI araçları prototip aşamasını dramatik biçimde kolaylaştırdı ve programlama geçmişi olmayan kurucular gelir getiren ürünler çıkarıyor. Ama ödemeler, güvenlik ve ölçeklenme gibi konularda temel teknik anlayış hâlâ fark yaratıyor. En sağlıklı yol, AI ile başlayıp temel kavramları yol üstünde öğrenmek.

### İlk ödeyen müşteriye ulaşmak ne kadar sürer?

Hikayeler yanıltıcı olabilir; birkaç günde gelir gören örnekler istisna. Gerçekçi bir hedef, dar kapsamlı bir ürünle üç ila altı ay içinde ilk ödeyen müşterilere ulaşmak. Kritik değişken teknik hız değil, dağıtım kanalınızın hazır olması.

### Hangi AI yığını en az maliyetle başlatır?

2026'da yerleşmiş kombinasyon Cursor ve Claude Code, Supabase, Vercel ve Stripe. Bu yığın, ayda birkaç yüz dolar sabit maliyetle çalışıyor ve değişken maliyetlerin çoğu kullanım arttıkça geliyor; yani gelir gelmeden büyük harcama yapmadan test edebilirsiniz.

### Kitlem yoksa nasıl dağıtım yaparım?

Kitle kurmak yıllar alır, ama alternatif SEO. Arama niyeti yüksek bir niş seçip ("AI ile X üretme" gibi), ürünle birlikte içerik yayınlamaya başlayın. Danny Postma'nın 300 bin dolarlık büyümesi ağırlıkla bu kanaldan geldi; sabır isteyen ama bileşik getirisi yüksek bir yol.
