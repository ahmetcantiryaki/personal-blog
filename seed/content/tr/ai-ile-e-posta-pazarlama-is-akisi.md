---
title: "ChatGPT ve Gemini ile E-posta Pazarlaması Nasıl Yapılır?"
slug: "ai-ile-e-posta-pazarlama-is-akisi"
translationKey: "ai-email-marketing-workflow-2026"
locale: "tr"
excerpt: "ChatGPT ve Gemini ile kampanya taslağı, A/B konu satırı, segmentasyon ve analiz özeti üretin; teslim edilebilirliği kimlik doğrulama ve etkileşim belirler."
category: "digital-marketing"
tags: ["email-marketing", "chatgpt", "gemini", "automation", "ai-tools"]
publishedAt: "2026-09-11"
seoTitle: "ChatGPT ve Gemini ile E-posta Pazarlaması: 2026 Rehberi"
seoDescription: "2026'da ChatGPT ve Gemini ile e-posta pazarlaması: kampanya taslağı, A/B konu satırı testleri, segmentasyon promptları, analiz özeti ve teslim edilebilirlik."
---

Kısa cevap: ChatGPT veya Gemini'yi kampanya metni taslağı, konu satırı varyantı ve segmentasyon promptu üretmek, analiz verisini özetlemek için kullanın; marka sesini bir insan editör kontrol etsin, gönderim kimlik doğrulamasını (SPF, DKIM, DMARC) ise otomasyona bırakın — çünkü gönderici itibarınızı doğrudan etkileyen AI değil, gönderim davranışınızdır.

Bu yazı haftalık pratikte gerçekten neyin işe yaradığını, AI'nin nerede jenerik ve etkisiz metin ürettiğini, ekiplerin AI ile yazılmış gönderimleri hızla ölçeklendirdiğinde teslim edilebilirliğin nerede kırıldığını anlatan sahadan notlar.

## AI ile kampanya ve hoş geldin/besleme (nurture) akışları nasıl yazılır?

Modele hedef kitle, teklif, tek bir kanıt noktası ve net bir CTA (harekete geçirici mesaj) içeren dar bir brief verirsiniz; çıktıyı final metin değil, ilk taslak olarak ele alırsınız. Bu yapı olmadan alınan ham bir ChatGPT veya Gemini taslağı, tıpkı diğer AI metinleri gibi okunur: üç ünlem işareti, bir "oyun değiştirici" ifadesi ve okuyucunun gözünde canlanacak hiçbir somut detay yok.

Hoş geldin ve besleme serilerinde işe yarayan yöntem önce serinin iskeletini kurmak, sonra her e-postayı ayrı ayrı doldurmaktır:

1. Herhangi bir metin yazmadan önce modelden 5 e-postalık bir hoş geldin serisi iskeleti isteyin: her e-postanın amacı, tek CTA'sı ve ele aldığı tek itiraz.
2. Her e-postayı bu iskelete karşı yazdırırken gerçek ürün detaylarını, fiyatlandırmayı ve en az bir müşteri alıntısı veya rakamı prompta ekleyin — jenerik prompt jenerik metin üretir.
3. AI taslağının ilk cümlesini ve CTA'sını kendi marka sesinizle yeniden yazın; okuyucunun gerçekten fark ettiği iki nokta burası.

İşe yarayan bir kural: hiçbir AI taslağı, bir insan en az bir cümleyi sadece markanızın söyleyebileceği bir şeyle değiştirmeden gönderilmesin. Genellikle dönüşüm getiren bir besleme e-postasıyla şablon gibi okunan bir e-posta arasındaki fark tam olarak bu tek düzeltmedir.

## A/B testi için konu satırı ve önizleme metni varyantları nasıl üretilir?

Modelden farklı mekanizmalar üzerine kurulu 8-10 konu satırı istersiniz — merak, rakam, soru, aciliyet, kişiselleştirme — sonra birbirine benzeyen iki varyantı değil, en çok birbirinden farklı olan iki veya üç varyantı test edersiniz. "Q4 raporunuz hazır" ile "Q4 raporunuz burada"yı test etmek size hiçbir şey söylemez; fayda odaklı bir satırı merak odaklı bir satıra karşı test etmek ise kitlenizin gerçekte neye tepki verdiğini gösterir.

| Konu satırı unsuru | Neyi test ediyorsunuz | Tipik etki (2026 verileri) |
|---|---|---|
| Kişiselleştirme etiketi | Konu satırında ad veya şirket adı | Campaign Monitor verisine göre açılma oranında %26'ya kadar artış |
| Uzunluk | 50 karakter altı ile 61-70 karakter arası | GetResponse, 7 milyar gönderimde 61-70 karakterlik konu satırlarının ortalama %32,1 açılma oranına ulaştığını buldu |
| Soru mu, ifade mi | "Q4'e hazır mısınız?" ile "Q4 planlama rehberiniz" | Listeye göre değişir — tek seferde değil, her segmentte ayrı test edin |
| AI üretimi çoklu varyant seti | Aynı anda test edilen 5-10 varyant | 2026'nın ilk çeyreği ESP verilerine göre test edilmemiş bir temele kıyasla %35-95 açılma oranı artışı |

Mailchimp'in konu satırı testi rehberi burada iyi bir kontrol noktası: listenizin bir alt kümesini gruplara böler, her gruba farklı bir varyant gönderir ve istatistiksel olarak anlamlı bir fark ortaya çıktığında kazananı geri kalan kitleye dağıtır — birkaç yüz gönderimden sonra kazananı ilan etmeyin. Aynı disiplin önizleme metni için de geçerli: modelden konu satırını tekrar eden değil, yeni bilgi ekleyen bir önizleme metni yazmasını isteyin, çünkü tekrarlanan metin çoğu gelen kutusunun gösterdiği tek ekstra satırı boşa harcar.

## AI ile segmentasyon ve kişiselleştirme promptları nasıl yazılır?

Modele gerçek segment tanımlarınızı verirsiniz — plan seviyesi, son aktif olduğu tarih, ürün kullanımı, geçmiş tıklama davranışı — ve aynı temel teklife karşı beş alakasız fikir değil, her segment için bir e-posta varyantı yazmasını istersiniz. Segment verisi olmadan "bu e-postayı kişiselleştir" gibi bir prompt, sahte bir ad birleştirme etiketiyle süslenmiş standart bir mektup üretir.

Pratikte işe yarayan bir segmentasyon promptu şöyle görünür:

```text
Segment: deneme sürümü kullanıcıları, 10. gün, son 5 gündür hiç giriş yok
Temel teklif: birebir onboarding görüşmesi
Ton: doğrudan, hareketsizlik konusunda suçlayıcı değil
120 kelimelik bir e-posta yaz. Aktivite verisine değil, kayıt olurken
belirttikleri [kullanım senaryosu]'na atıfta bulun — hareketsizliklerinden
asla doğrudan bahsetme.
```

Ham davranışsal veriyi (okuyucuya doğrudan göstermeden) prompta beslemek, çıktının jenerik değil kişiselleştirilmiş hissettirmesini sağlayan şey. Dikkat edilmesi gereken hata modu, gözetleme gibi hissettiren aşırı kişiselleştirme — "giriş yapmadığınızı fark ettik" ifadesi yardımsever değil ürkütücü okunur ve genellikle yanıt almak yerine yanıtı bastırır.

## Kampanya analitiğini AI ile nasıl özetlersiniz?

Ham gönderim verinizi — açılma, tıklama, abonelikten çıkma ve segment başına gelir — modele yapıştırıp son üç kampanyanıza kıyasla gerçekten değişen bir veya iki rakamı bulmasını istersiniz; her metriği düzyazıyla tekrarlamasını değil. AI, birçok kampanya arasında örüntü bulmakta gerçekten iyi: "deneme segmentine Salı günü yaptığınız gönderimler Perşembe gönderimlerine göre 9 puan daha yüksek açılıyor" türünden bir içgörü, elle bulmak sıkıcı ama veri düzgün yapılandırıldığında model için sıradan bir iş.

İşler, ekipler kıyaslama temeli olmadan bir "özet" istediğinde ve panele bir bakışın zaten gösterdiğini doğrulayan bir paragraf aldığında bozulur. Daha iyi prompt yapısı: bu kampanyanın rakamlarını yapıştırın, son üç kampanyanın ortalamasını yapıştırın ve tam olarak neyin ne kadar değiştiğini sorun. Bu, bir açıklama yerine bir kıyaslamaya zorlar.

## AI ile ölçeklenirken teslim edilebilirlik ve marka sesi nasıl korunur?

Kimlik doğrulama ve gönderim disiplinini AI iş akışından tamamen ayrı tutarsınız, çünkü iyi yazılmış bir AI e-postası bile kötü doğrulanmış bir alan adından gönderildiğinde spam'e düşer. Eylül 2026 itibarıyla Gmail ve Yahoo, günde 5.000'den fazla mesaj gönderen gönderenlerden SPF, DKIM ve DMARC'ı geçmelerini, spam şikayet oranını %0,3'ün altında tutmalarını ve tek tıkla abonelikten çıkma desteklemelerini şart koşuyor — ve bunların hiçbiri AI'nin dokunduğu bir şey değil.

Etkileşim tarafı, AI destekli ölçeklenmenin gerçek zarar verdiği yer: AI ile daha hızlı daha fazla e-posta yazan ekipler, hacmi doldurmak için bazen etkileşimsiz veya doğrulanmamış adreslere göndermeye başlıyor. Kutu sağlayıcıları artık etkileşim sinyallerine — açılma, tıklama, yanıt, okuma süresi — kimlik doğrulama kadar ağırlık veriyor, bu yüzden tam olarak doğrulanmış bir alan adı bile etkileşim zayıfsa %30'un üzerinde spam yerleşimi görebiliyor. Bu, AI iş akışına bir bastırma kuralı gömülmesi gerektiği anlamına geliyor: 90 günden uzun süredir açmamış veya tıklamamış bir segmente, önce bir yeniden etkileşim adımı olmadan üretilmiş bir kampanya asla gönderilmesin.

Marka sesi de hacim gibi sessizce, bir e-posta bir e-posta bozulur — meğer ki biri modelin her taslakta beslendiği yaşayan bir stil rehberi sahiplenmiş olsun (yasaklı ifadeler, onaylı CTA'lar, ton örnekleri). Bizim görüşümüz şu: bir abone bir e-postanın AI tarafından yazıldığını fark ettiği an, e-posta kanalının diğer pazarlama formatlarından daha fazla dayandığı güveni zaten kaybetmişsinizdir — çünkü bu e-posta gerçek insanlardan gelen mesajların hemen yanında, kişisel bir gelen kutusuna düşüyor.

Kimlik doğrulama ve liste hijyeni için tam kontrol listesine [e-posta teslim edilebilirlik rehberimizden](/tr/posts/e-posta-pazarlamada-teslim-edilebilirlik) bakabilirsiniz. ESP'niz ile diğer araçlar arasındaki devri de otomatikleştiriyorsanız, [Zapier ve Make ile pazarlama otomasyonu](/tr/posts/ai-ile-pazarlama-otomasyonu-zapier-make) yazımız e-posta içeriğinin kendisinden ziyade çevresindeki iş akışı katmanını ele alıyor. E-posta dışında AI içerik çalışması için [küçük ekipler için AI içerik pazarlaması](/tr/posts/kucuk-ekipler-icin-ai-icerik-pazarlamasi) yazısına, daha geniş dijital pazarlama araç setine göz atmak için [dijital pazarlama kategorimize](/tr/category/dijital-pazarlama) bakabilirsiniz.

## Sıkça Sorulan Sorular

### ChatGPT tek bir promptla eksiksiz bir kampanya yazabilir mi?

Evet, ama çıktı gönderilmeden önce bir insan denetiminden geçmeli — tek promptla alınan taslak jenerik kalır ve somut ürün detaylarını veya kanıt noktalarını kaçırır. Onu ilk taslak olarak ele alın: açılış cümlesini ve CTA'yı kendi sesinizle yeniden yazın, modelin bilemeyeceği en az bir rakam veya müşteri detayı ekleyin.

### Aynı anda kaç konu satırı varyantı test edilmeli?

Gönderim başına gerçekten farklı 2-3 varyant test edin, birbirine çok benzeyenleri değil — uzunluk, kişiselleştirme veya duygusal açıdaki farklar, "burada" ile "hazır"ı test etmekten çok daha net sinyal üretir. 5-10 varyantlık çoklu (multivariate) testler yüksek hacimli gönderenler için işe yarar ama istatistiksel anlamlılığa ulaşmak için yeterince büyük bir liste gerektirir.

### E-postaları AI ile yazmak teslim edilebilirliğe zarar verir mi?

Doğrudan hayır — teslim edilebilirlik kimlik doğrulamasına (SPF, DKIM, DMARC) ve alıcı etkileşimine bağlıdır, metni kimin veya neyin yazdığına değil. Gerçek risk dolaylı: AI, daha fazla kişiye daha hızlı daha fazla e-posta göndermeyi kolaylaştırıyor ve etkileşimsiz veya doğrulanmamış segmentlere gönderim yapmak gönderici itibarına zarar veriyor.

### AI promptlarında segmentasyon ile kişiselleştirme arasındaki fark nedir?

Segmentasyon, metni yazmadan önce alıcıları ortak özelliklere göre gruplamaktır (plan seviyesi, aktivite, satın alma geçmişi); kişiselleştirme ise bir segment içinde mesajı spesifik veri noktalarıyla uyarlamaktır. İyi bir AI iş akışı ikisini birden yapar — önce segmentlere ayırır, sonra bir birleştirme etiketiyle tek bir jenerik prompt yerine, her segment için gerçek veriyle ayrı bir prompt üretir.

Kaynaklar: [Mailchimp — Konu Satırı Testi](https://mailchimp.com/resources/subject-line-testing/), [Google Workspace — Toplu Gönderici Kuralları](https://support.google.com/a/answer/81126), [DMARC Report — Gönderici İtibarı 2026](https://dmarcreport.com/blog/how-to-maintain-a-good-email-sender-reputation-in-2026/), [Digital Applied — AI Konu Satırı Testi](https://www.digitalapplied.com/blog/ai-email-subject-line-testing-open-rates).
