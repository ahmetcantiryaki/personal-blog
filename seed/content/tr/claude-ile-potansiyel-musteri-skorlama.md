---
title: "Claude ile Potansiyel Müşteri Skorlama"
slug: "claude-ile-potansiyel-musteri-skorlama"
translationKey: "lead-scoring-claude-crm-2026"
locale: "tr"
excerpt: "Kısa cevap: önce ideal müşteri profilinizi ve sinyallerinizi siz tanımlayın, CRM verinizi bu rubriğe göre Claude'a skorlatıp insan onayından geçirin."
category: "digital-marketing"
tags: ["claude", "sales", "automation", "privacy"]
publishedAt: "2026-11-06"
seoTitle: "Claude ile Lead Skorlama ve Yönlendirme Rehberi"
seoDescription: "Küçük ekipler için şeffaf lead skorlama: ICP ve sinyal tanımı, Claude ile CRM verisini rubriğe göre skorlama, insan onayı, gizlilik ve kapanan satışla denetim."
---

Kısa cevap: ideal müşteri profilinizi (ICP) ve puanlanacak sinyalleri önce siz yazılı bir rubrik olarak tanımlayın, CRM'den dışa aktardığınız lead verisini bu rubriğe göre Claude'a puanlatıp her puanın gerekçesini de istetin, sıcak leadleri bir insana onaylattıktan sonra satışa yönlendirin. Puanlamayı "kara kutu" bırakmamak, küçük bir ekibin kurumsal bir skorlama aracı almadan güvenebileceği tek yol.

## Küçük Ekipler Lead Skorlamada Neden Zorlanır?

Çünkü kurumsal lead-skorlama araçları genellikle aylık yüzlerce dolar ve bir CRM entegrasyon projesi gerektiriyor, bir veya iki kişilik bir satış ekibi için bu yatırım nadiren kendini amorti ediyor. Sonuç, çoğu küçük ekibin hâlâ leadleri elle, tutarsız bir "hissediyorum" kriteriyle sıraladığı bir durum — aynı profildeki iki lead, hangi satış temsilcisine düştüğüne göre farklı önceliklendiriliyor. Claude'u burada ayrı bir SaaS aracı değil, sizin yazdığınız rubriği uygulayan bir hesap makinesi gibi kullanmak, bu tutarsızlığı kurumsal araç bütçesi olmadan kapatıyor.

## ICP ve Sinyalleri Nasıl Tanımlarsınız?

Kapanan son 20-30 anlaşmaya bakıp üç kategoride ortak noktaları yazın: firma özellikleri (sektör, çalışan sayısı, bütçe aralığı), davranışsal sinyaller (fiyat sayfasını kaç kez ziyaret etti, demo talep etti mi) ve niyet sinyalleri (hangi anahtar kelimeyle geldi, hangi içeriği indirdi). Her sinyale 1-5 arası bir ağırlık verin ve bunu bir sayfalık bir rubrik olarak yazın — bu rubrik Claude'a vereceğiniz talimatın tamamı, model kendi kriterini icat etmiyor, sizinkini uyguluyor.

## Claude'a CRM Verisini Nasıl Verir, Nasıl Skorlatırsınız?

CRM'den lead listesini CSV olarak dışa aktarıp rubriğinizle birlikte Claude'a yükleyin ve her satır için toplam puanı, hangi sinyallerin puanı yükselttiğini ve hangi alanların eksik/belirsiz olduğunu ayrı sütunlarda istetin — gerekçesi olmayan bir puan, bir satış temsilcisinin güvenebileceği bir puan değil. "Eksik alan" sütunu özellikle önemli: model eksik bir veriyi asla kendi tahminiyle doldurmamalı, bunu açıkça "veri yok" diye işaretlemeli.

| Adım | Ne yapılır | Kontrol |
|---|---|---|
| 1. Rubrik | ICP + sinyaller + ağırlıklar, bir sayfa | Son kapanan anlaşmalarla tutarlı mı? |
| 2. Dışa aktarım | CRM'den CSV, kişisel veri minimumda | Gereksiz alan (telefon, e-posta) dışarıda bırakıldı mı? |
| 3. Skorlama | Claude, rubriğe göre puan + gerekçe + eksik alan sütunu | Gerekçesiz puan kabul edilmiyor |
| 4. İnsan onayı | Sıcak leadleri bir satış temsilcisi gözden geçiriyor | Model halüsinasyon bir alan uydurmadı mı? |
| 5. Denetim | Aylık, kapanan/kapanmayan karşılaştırması | Rubrik ağırlıkları güncellenmeli mi? |

## Sıcak Leadleri Nasıl Yönlendirir, İlk Mesajı Nasıl Yazdırırsınız?

Belirli bir puan eşiğinin üstündeki leadleri doğrudan ilgili satış temsilcisine atayın ve Claude'dan her lead için, rubrikteki hangi sinyalin öne çıktığına atıfta bulunan kısa bir ilk-temas mesajı taslağı istetin — "fiyat sayfasını üç kez ziyaret etti" gibi somut bir sinyale değinen bir açılış cümlesi, genel bir şablon cümleden daha yüksek yanıt alıyor. Taslağı göndermeden önce bir insanın okuması şart; model bazen bir şirket adını veya bir detayı yanlış hatırlayabilir, bu ufak hata bir ilk izlenimi zedeleyebilir.

## Puan Eşiklerini Kaç Katmana Bölmelisiniz?

İkiden fazla katman kurmak genellikle gerekli değil — "sıcak" (hemen aransın), "ılık" (bu hafta içinde takip edilsin) ve "soğuk" (otomatik e-posta dizisine girsin) olmak üzere üç katman, bir veya iki kişilik bir satış ekibi için yeterli ayrımı sağlıyor. Eşik sayısını artırmak çoğu zaman netlik kazandırmıyor, çünkü puanlar zaten gürültülü bir tahmin ve beşinci bir ince ayrım genellikle gerçek bir fark yansıtmıyor. Eşikleri ilk ay %70/%40 gibi kaba bir yerden başlatıp, aylık denetimde kapanan anlaşmaların gerçekte hangi puan aralığında yoğunlaştığını görüp eşikleri oraya göre kaydırmak, baştan "doğru" sayıyı bulmaya çalışmaktan daha gerçekçi.

## CRM Verisini Claude'a Vermek Güvenli mi?

Kişisel veriyi minimumda tutarak evet — dışa aktardığınız sütunları skorlama için gerçekten gereken alanlarla sınırlayın (firma büyüklüğü, davranışsal sinyal, niyet sinyali) ve telefon numarası, tam e-posta gibi doğrudan kimlik bilgilerini mümkünse dışarıda bırakın veya anonimleştirin. Anthropic'in [kurumsal veri saklama politikasını değiştirmesi](/tr/posts/anthropic-veri-saklama-politikasini-neden-degistiriyor) gibi gelişmeler, kurumsal müşteri verisinin nasıl saklandığının hızla değiştiğini gösteriyor; bu yüzden hangi planı kullandığınızı ve o planın veri saklama koşullarını her zaman güncel tutmanız gerekiyor. Aynı dikkat, [yapay zeka asistanlarının kullanıcıyı nasıl hatırladığı](/tr/posts/ai-asistanlari-seni-nasil-hatirliyor) konusundaki genel prensiplerle de örtüşüyor — müşteri verisi için de geçerli: modele verdiğiniz her alan, o oturumun ötesinde bir iz bırakabilir.

## Skorlamada Önyargı ve Halüsinasyonu Nasıl Denetlersiniz?

Modelin bir alanı sessizce tahmin edip etmediğini anlamak için ara sıra üç-beş lead'i elle kontrol edin: CRM'deki ham veriyle Claude'un raporladığı "eksik alan" sütununu karşılaştırın — model bir boş hücreyi "veri yok" demek yerine makul bir değer icat etmişse, bu halüsinasyon demektir ve rubriği yeniden yazmanız gerekir. Önyargı için ayrı bir kontrol: puanları şirket büyüklüğüne, sektöre veya coğrafyaya göre gruplandırıp bir grubun sistematik olarak düşük puan alıp almadığına bakın — bu genellikle rubrikteki bir sinyalin (örneğin "kurumsal e-posta alan adı") belirli bir müşteri segmentini haksız yere cezalandırdığını gösterir.

## Skorlamayı Kapanan Satışlara Göre Nasıl Denetlersiniz?

Her ay, önceki ayda yüksek puan alan leadlerin kaçının gerçekten kapandığını, düşük puan alanlardan kaçının sürpriz biçimde kapandığını karşılaştırın; bu karşılaştırma rubriğinizin hangi ağırlığının gerçekte işe yaramadığını gösteriyor. Bir sinyal sürekli yüksek puan veriyor ama o profildeki leadler kapanmıyorsa, sorun modelde değil, rubrikte — ağırlığı düşürün ve bir ay sonra tekrar bakın. Bu, [Claude ile tekrarlanabilir bir SEO yazı sisteminde](/tr/posts/claude-ile-seo-yazi-sistemi) kullandığınız "çıktıyı düzenli olarak gerçek sonuçla karşılaştır" mantığının satışa uygulanmış hâli.

Benim yorumum: bu kurulumun değeri modelin "akıllı" olmasında değil, rubriği her leade aynı şekilde, yorulmadan uygulamasında — bir insan analistin dördüncü saatte tutarlılığını kaybettiği yerde model kaybetmiyor.

Bu sistemi kurmanın gerçek maliyeti bir hafta sonu değil, bir öğleden sonra: rubriği yazmak bir-iki saat, ilk skorlama turunu çalıştırıp sonuçları gözden geçirmek bir saat daha sürüyor. Asıl zaman yatırımı kurulumda değil, ilk ay boyunca rubriği gerçek kapanışlarla karşılaştırıp ince ayar yapmakta — bu adımı atlayan ekipler, modelin "yanlış" skorladığını düşünüp sistemi bırakıyor, oysa sorun genellikle ağırlıkların hiç ayarlanmamış olması. İlk ayı bir deneme süresi olarak görüp rubriği iki kez güncellemeyi baştan planlamak, sistemi bir aylık bir hayal kırıklığından sonra tamamen bırakmaktan daha iyi sonuç veriyor.

## Sıkça Sorulan Sorular

### Küçük bir satış ekibi Claude ile lead skorlamaya nasıl başlar?

Önce son 20-30 kapanan anlaşmadan bir ICP ve sinyal rubriği (firma özellikleri, davranışsal sinyal, niyet sinyali, her biri 1-5 ağırlıklı) çıkarın. Sonra CRM'den dışa aktardığınız lead verisini bu rubrikle birlikte Claude'a verip her satır için puan ve gerekçe istetin.

### Claude'un verdiği lead puanına ne kadar güvenmeli?

Gerekçesiz bir puana güvenmeyin — model her puan için hangi sinyalin öne çıktığını ve hangi alanın eksik olduğunu ayrı sütunlarda belirtmeli. Sıcak olarak işaretlenen her lead, satışa gitmeden önce bir insan tarafından gözden geçirilmeli.

### CRM verisini Claude'a vermek gizlilik açısından güvenli mi?

Dışa aktarılan alanları skorlama için gerçekten gerekli olanlarla sınırlayıp telefon numarası ve tam e-posta gibi doğrudan kimlik bilgilerini mümkünse dışarıda bırakırsanız evet. Kullandığınız planın veri saklama koşullarını güncel tutmak da bu kararın bir parçası.

### Lead skorlama rubriğini ne sıklıkla güncellemeli?

Aylık olarak, yüksek puan alan leadlerin gerçekten kapanıp kapanmadığını karşılaştırarak. Bir sinyal sürekli yüksek puan veriyor ama o profildeki leadler kapanmıyorsa, rubrikteki o sinyalin ağırlığını düşürmek gerekir.
