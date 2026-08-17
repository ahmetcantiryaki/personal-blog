---
title: "ChatGPT Computer History: Kullanım ve Gizlilik Rehberi"
slug: "chatgpt-computer-history-kullanim-gizlilik"
translationKey: "chatgpt-computer-history-privacy"
locale: "tr"
excerpt: "Computer History, Mac'te onayladığınız uygulama ve web etkinliğinden bağlam toplayan, varsayılan kapalı bir ChatGPT özelliği. Nasıl açılır, ne kaydeder?"
category: "ai"
tags: ["chatgpt", "openai", "ai-tools"]
publishedAt: "2026-08-17"
seoTitle: "ChatGPT Computer History Nedir? Kullanım ve Gizlilik"
seoDescription: "Computer History, Mac'te onayladığınız uygulama ve web etkinliğinden bağlam toplayan, varsayılan kapalı bir ChatGPT özelliği. Nasıl açılır, ne kaydeder?"
---

Kısa cevap: Computer History, OpenAI'nin 13 Ağustos 2026'da yayımladığı, macOS'ta ChatGPT masaüstü uygulamasının onayladığınız uygulama ve web sitesi etkinliğinden aranabilir bir zaman çizelgesi oluşturan, varsayılan olarak kapalı bir özellik. Açtığınızda ChatGPT ve Codex, önceki işinizi yeniden anlatmanıza gerek kalmadan "neyle uğraştığınızı" hatırlıyor.

Özellik, önceki Chronicle sisteminin yerini alıyor ama aynı şey değil: sürekli ekran görüntüsü almak yerine, macOS'un erişilebilirlik API'leri üzerinden tıklama, yazma, klavye kısayolu ve uygulamalar arası geçiş gibi etkileşim olaylarını kaydediyor.

## Computer History tam olarak nedir?

Kısa cevap: Mac'inizde onay verdiğiniz kaynaklardan gelen etkinliği toplayıp bunu ChatGPT ve Codex'in bağlam olarak kullanabileceği bir zaman çizelgesine ve hafıza kaydına dönüştüren bir sistem. Ekran görüntüsü, ekran kaydı, mikrofon girişi veya sistem sesi kaydetmiyor; gizli tarama etkinliği de kapsam dışı. [OpenAI'nin ChatGPT Learn dokümantasyonuna](https://learn.chatgpt.com/docs/customization/computer-history) göre özellik, Memories'in açık olmasını gerektiriyor çünkü topladığı bağlamı sohbetler ve görevler arasında hafıza sistemi üzerinden kullanıyor.

Önceki Chronicle sisteminden farkı önemli: Chronicle görsel yakalamaya dayanıyordu, Computer History ise yeniden inşa edilmiş bir sistem ve etkileşim olaylarını temel alıyor. Bu, hem depolama boyutunu hem de "ChatGPT ekranımın görüntüsünü mü tutuyor" endişesini pratikte azaltıyor — ama sıfıra indirmiyor, aşağıda bunu açıyoruz.

## Nasıl açılır ve kapsamı nasıl daraltılır?

Kısa cevap: Ayarlar menüsünden özelliği açık uygulamalar/web siteleri bazında etkinleştiriyorsunuz; her kaynağı ayrı ayrı onaylamanız gerekiyor. Özellik varsayılan olarak kapalı geliyor — kullanıcı kendisi açmadıkça hiçbir şey kaydedilmiyor.

Kapsam daraltma pratikte şöyle işliyor: bir kod editörünü ve tarayıcınızı onaylayıp, örneğin bankacılık uygulamanızı ya da parola yöneticinizi listeye hiç eklemeyebilirsiniz. Onay verilmeyen her uygulama, ChatGPT'nin görüş alanının tamamen dışında kalıyor.

## Gerçek iş akışlarında nasıl kullanılır?

Kısa cevap: en büyük fayda, önceki bağlamı yeniden anlatmadan işe devam edebilmek. Birkaç somut örnek:

- Sabah bir Codex görevini yarım bırakıp öğleden sonra devam ederken, "az önce nerede kalmıştık" diye sormanıza gerek kalmıyor — Computer History bunu zaten biliyor.
- Bir tarayıcı sekmesinde araştırma yapıp sonra ChatGPT'ye dönüp "az önce okuduğum makaleye göre" diyebiliyorsunuz; kopyala-yapıştır yapmanıza gerek yok.
- Birden fazla uygulama arasında geçiş yaparak yürüttüğünüz bir görevde (örneğin bir tasarım aracından kod editörüne geçiş), ChatGPT'nin her adımı yeniden açıklamanıza ihtiyacı kalmıyor.

Bu, [ChatGPT Work gibi çok adımlı görevleri kendi başına yürüten ajan özellikleri](/tr/posts/chatgpt-work-nedir-openai-is-ajani) yönündeki genel hareketle aynı çizgide: sohbet penceresinin dışındaki bağlamı toplayıp geri besleyerek, tekrar tekrar aynı şeyi anlatma yükünü azaltıyor.

## Gizlilik kontrolleri neler sunuyor?

| Kontrol | Ne yapıyor |
|---|---|
| Kaynak bazlı onay | Yalnızca açıkça eklediğiniz uygulama/web sitesi izleniyor |
| Zaman çizelgesi inceleme | Ayarlar'dan kayıtlı girdileri görebiliyorsunuz |
| Finder'da dosya gösterme | Bireysel hafıza dosyalarını Finder'da açıp inceleyebiliyorsunuz |
| Seçici silme | Tek tek girdi silinebiliyor |
| Zaman aralığı temizleme | Son 10 dakika, saat, gün ya da tüm zamanı temizleyebiliyorsunuz |

Buradaki en önemli uyarı yerel şifreleme ile ilgili: [Notebookcheck'in haberine](https://www.notebookcheck.net/ChatGPT-logs-your-Mac-activity-and-the-files-are-not-encrypted.1369344.0.html) göre OpenAI, yerelde saklanan hafıza dosyalarının şifrelenmediğini açıkladı. Bu, aynı macOS hesabı altında çalışan diğer programların teorik olarak bu dosyalara erişebileceği anlamına geliyor — disk şifrelemesi (FileVault) açık olsa bile, hesap içi izolasyon garanti edilmiyor.

## Chronicle'dan farkı pratikte ne değiştiriyor?

Kısa cevap: Chronicle'ın görsel yakalamaya dayanması, kullanıcıların en çok şikayet ettiği nokta olan "ekranımın sürekli fotoğrafı çekiliyor" endişesini besliyordu; Computer History'nin etkileşim olaylarına dayanması bu endişeyi büyük ölçüde azaltıyor ama tamamen ortadan kaldırmıyor. Yazdığınız her karakter, tıkladığınız her yer teknik olarak hâlâ kaydediliyor — sadece bunun görsel bir kopyası tutulmuyor.

Bu fark, depolama boyutu açısından da somut bir avantaj sağlıyor: metin tabanlı etkileşim olayları, ekran görüntülerinden çok daha az yer kaplıyor, bu da daha uzun bir geçmişin pratik olarak saklanabilmesini mümkün kılıyor. Ama "daha az veri" ile "hassas olmayan veri" aynı şey değil — yazdığınız bir parola, ekran görüntüsünde görünmese bile tuş vuruşu kaydında görünebilir; bu yüzden onay listesini oluştururken bu ayrımı net tutmak önemli.

## Hangi verilerle ASLA kullanılmamalı?

Dürüst görüşüm şu: Computer History faydalı bir özellik, ama "her şeyi aç, unut git" yaklaşımı burada yanlış. Şifrelenmemiş yerel depolama göz önüne alındığında, aşağıdaki kaynakları listeye hiç eklememek makul bir varsayılan:

- Parola yöneticileri ve kimlik doğrulama uygulamaları
- Bankacılık ve ödeme uygulamaları
- Sağlık kayıtları içeren portallar
- Müşteri PII'si (kişisel tanımlayıcı bilgi) içeren dahili şirket araçları

Kurumsal bir hesapta çalışıyorsanız, şirketinizin veri işleme politikasının Computer History'yi kapsayıp kapsamadığını BT ekibinize sormadan açmayın; hangi verinin AI asistanlarıyla paylaşılabilir olduğuna dair genel çerçeveyi, [ChatGPT, Claude ve Gemini'nin özel talimat ayarlarını karşılaştırdığımız yazımızda](/tr/posts/chatgpt-claude-gemini-ozel-talimatlar) da ele almıştık — oradaki "hangi bilgiyi paylaşmam gerekir" mantığı burada da geçerli.

## Kurumsal ve aile hesaplarında ekstra dikkat

Kısa cevap: paylaşılan ya da yönetilen hesaplarda Computer History'yi açmadan önce hesabın kim tarafından yönetildiğini ve kayıtların kim tarafından görülebileceğini netleştirin. Bir aile planında ebeveyn denetimi açıksa, çocuğunuzun hesabında Computer History'yi açmak, o hesabın etkinlik geçmişini ebeveyn tarafından görülebilir hale getirebilir — bu, bazı aileler için istenen bir şey, bazıları için değil, ama varsayılan olarak bilinmesi gereken bir davranış.

Kurumsal (Business/Enterprise) hesaplarda ise resim daha karmaşık: workspace yöneticisinin, kullanıcı düzeyinde Computer History verisine ne ölçüde erişebildiği OpenAI'nin dokümantasyonunda ayrıntılı açıklanmıyor. Şirket cihazında çalışan bir geliştiriciyseniz ve Computer History'yi kod editörünüze bağlamayı düşünüyorsanız, önce şirketinizin AI araçları politikasının bunu kapsayıp kapsamadığını netleştirmek, sonradan bir uyumluluk sorunu yaşamaktan daha ucuza geliyor.

Somut bir örnek: bir yazılım şirketinde çalışan ve müşteri destek taleplerini içeren dahili bir panele erişen bir geliştirici düşünün. Computer History'yi hem kod editörüne hem de bu panele bağlarsa, panelde görünen müşteri e-postaları ve isimleri de zaman çizelgesine kaydedilebilir. Şirketin veri işleme sözleşmesi bu tür bir kaydı kapsamıyorsa, iyi niyetle açılmış bir özellik, istemeden bir sözleşme ihlaline dönüşebilir.

## Açmadan önce kontrol listesi

1. Hangi uygulama ve web sitelerini eklemek istediğinizi önceden belirleyin — varsayılan olarak hiçbir şey seçili değil.
2. Hassas veri içeren araçları (parola yöneticisi, bankacılık, sağlık) listeye hiç eklemeyin.
3. Memories'in açık olması gerektiğini unutmayın; Computer History'yi Memories'den bağımsız düşünmeyin.
4. Şirket cihazındaysanız BT/güvenlik politikasını kontrol edin.
5. Ayarlar'dan zaman çizelgesini periyodik olarak gözden geçirip gereksiz girdileri silin.

## Sıkça Sorulan Sorular

### ChatGPT Computer History nedir?

Computer History, macOS'ta ChatGPT masaüstü uygulamasının, onay verdiğiniz uygulama ve web sitesi etkinliğinden aranabilir bir zaman çizelgesi ve hafıza kaydı oluşturan, 13 Ağustos 2026'da yayımlanmış bir özellik. Ekran görüntüsü almadan, macOS erişilebilirlik olaylarını (tıklama, yazma, uygulama geçişi) kaydediyor.

### Computer History varsayılan olarak açık mı?

Hayır, varsayılan olarak kapalı. Her kullanıcının özelliği kendisi açması ve hangi uygulama/web sitelerinin izleneceğini tek tek onaylaması gerekiyor.

### Computer History ekran görüntüsü alıyor mu?

Hayır. OpenAI'ye göre özellik ekran görüntüsü, ekran kaydı, mikrofon girişi veya sistem sesi kaydetmiyor; gizli tarama etkinliği de kapsam dışında tutuluyor. Sadece etkileşim olaylarını (tıklama, yazma, klavye kısayolu, uygulama geçişi) kaydediyor.

### Computer History verileri şifreli mi saklanıyor?

Hayır, OpenAI yerelde saklanan hafıza dosyalarının şifrelenmediğini açıkladı. Bu, aynı macOS hesabı altındaki diğer programların bu dosyalara teorik olarak erişebileceği anlamına geliyor, bu yüzden hassas verilerin bulunduğu uygulamaları izleme kapsamına eklememek öneriliyor.
