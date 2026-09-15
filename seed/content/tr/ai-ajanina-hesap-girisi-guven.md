---
title: "AI Ajanına Hesap Girişini Emanet Eder misin?"
slug: "ai-ajanina-hesap-girisi-guven"
translationKey: "trusting-ai-agents-account-logins-2026"
locale: "tr"
excerpt: "Kısa cevap: Düşük riskli, salt okunur işler için ayrı profilde makul; ama OpenAI'ın güvenlik yöneticisi prompt injection'ı çözülmemiş risk olarak tanımlıyor."
category: "technology"
tags: ["ai-agents", "authentication", "privacy", "web-security"]
publishedAt: "2026-09-15"
seoTitle: "AI Ajanına Hesaplarına Girişi Emanet Etmeli misin?"
seoDescription: "ChatGPT Atlas ya da Gemini'ye hesap girişi vermenin 2026'daki gerçek riskleri ve beş güvenli desen: ayrı profil, passkey, kısıtlı token, onay istemi."
---

Kısa cevap: Uçuş durumu kontrolü ya da gelen kutusu özetlemesi gibi düşük riskli, salt okunur işler için, kısıtlı erişimli ayrı bir tarayıcı profilinde bu makul bir risk; ama OpenAI'ın kendi bilgi güvenliği yöneticisi, tarayıcı ajanlarına karşı prompt injection'ın "tamamen çözülmesinin pek olası olmadığını" söylüyor. Ajanın senin adına satın alma, paylaşım ya da para transferi yapmasına izin veren her şeyde gerçek bir tereddüt hak ediyorsun.

## AI ajanları neden şimdi hesaplarına giriş yapıyor?

Kısa cevap: ChatGPT Atlas ve Gemini'nin ajan modu gibi tarayıcı ajanları, giriş duvarının arkasında işe yarar bir şey yapabilmek için senin gerçek oturumunu kullanmaya ihtiyaç duyuyor — banka bakiyeni kontrol etmek, masraf raporu doldurmak ya da uçuş rezervasyonu yapmak, ajanın anonim bir ziyaretçi değil, sen olarak hareket etmesini gerektiriyor. Bu kasıtlı bir ürün kararı, kaza değil: giriş yapamayan bir ajan, insanların gerçekten otomatikleştirmek istediği işlerin çoğunu yapamaz.

Buradaki takas, "sen olarak hareket etmek"in, ajanın hesabının tüm izinlerini devralması, ama normalde bir şeye tıklamadan önce uyguladığın muhakemenin hiçbirine sahip olmaması anlamına gelmesi. Kapasite ile muhakeme arasındaki bu boşluk, riskin tam olarak yaşadığı yer.

## Gerçek saldırı nedir — prompt injection nasıl çalışır?

Kısa cevap: Prompt injection, ajanın tararken okuduğu içeriğin içine kötü niyetli talimatlar saklıyor — görünmez metin, HTML yorumları ya da sıradan görünen bir sosyal medya gönderisi — böylece ajanın o sayfayı özetlemesi ya da üzerinde işlem yapması, senin talimatın yerine (ya da onunla birlikte) saldırganın gizli talimatını takip etmesine yol açıyor. Ajan, "kullanıcımdan gelen talimat" ile "bir talimat olduğunu söyleyen sayfa metni"ni güvenilir bir şekilde ayırt edemiyor.

OpenAI, iç kırmızı takım testlerinin bu saldırıların yeni bir sınıfını bulmasının ardından ChatGPT Atlas için bir güvenlik güncellemesi çıkardı; güvenlik yönetimi sınırı açıkça ortaya koydu: "prompt injection, sınırda ve çözülmemiş bir güvenlik sorunu olarak kalıyor ve rakiplerimiz ChatGPT ajanlarını bu saldırılara düşürmenin yollarını bulmak için önemli zaman ve kaynak harcayacak." Bu geçici bir hata değil — bir düzeltmeden çok, oltalama ve sosyal mühendisliğin çalışma şekline daha yakın: bir silahlanma yarışı.

| Saldırı yüzeyi | Nasıl saklanıyor | Neyi tetikleyebilir |
|---|---|---|
| Sayfada görünmez/beyaz metin | CSS renk hileleri, ekran dışı konumlandırma | Ajan bunu içerik değil, talimat olarak okur |
| HTML yorumları | Görsel olarak hiç render edilmez | Aynı — ajanın ayrıştırıcısı ham işaretlemeyi hâlâ görür |
| Sosyal medya gönderileri | İnsana sıradan içerik gibi görünür | Ajan "özetlerken" gönderi metnini bir komut olarak ele alır |

## Bu, ajanının oturumunda gerçekleşirse ne ters gidebilir?

Kısa cevap: Yeterli önlem olmadan, başarılı bir prompt injection, tarayıcı ajanının e-postalarını ya da giriş bilgilerini açığa çıkarmasına ya da hiç istemediğin işlemler yapmasına yol açabilir — istenmeyen bir satın alma, hiç istenmeyen bir sosyal medya gönderisi ya da hesabından gönderilen bir mesaj. Ajan geleneksel anlamda "hacklenmiyor"; zaten sana verdiğin erişimi kötüye kullanması için kandırılıyor.

Rahatsız edici kısım şu: hesap ele geçirme, bir parola sızıntısı ya da bozuk bir kimlik doğrulama sistemi gerektirmiyor. Sadece ajanın, senin olarak giriş yapmışken, gerçekten istediğin bir işi yaparken, gizli talimatlar içeren bir sayfayı ziyaret etmesi yeterli.

## Ajanına hesaplarını kullandırmak için daha güvenli desenler ne?

Kısa cevap: Ajan işleri için ana hesabın yerine ayrı bir tarayıcı profili ya da hesap kullan, ajanın kimlik doğrulaması gerektiği her yerde parola yerine passkey'i tercih et, ona verdiğin API token'larını işi yapacak en dar izinle sınırla ve para harcayan, herkese açık paylaşım yapan ya da veri silen her şey için onay istemlerini açık tut.

- **Önce ayrı profil.** Ayrı bir tarayıcı profili (ya da servis izin veriyorsa daha düşük yetkili ikincil bir hesap), bir şeyler ters giderse etki alanını sınırlar — ajan asla ana gelen kutuna ya da banka girişine dokunmaz.
- **Paroladan çok passkey.** Bir passkey, yazılan bir parolanın ya da saklanan bir oturum çerezinin aksine oltalanamaz; bu yüzden ajana yönelik girişleri WebAuthn'a doğru itmek tüm bir saldırı yolunu kapatır.
- **Token'ları dar kapsamlı tut.** Bir servis salt okunur ya da sınırlı kapsamlı token seçenekleri sunuyorsa, kurulumu biraz daha az pratik olsa da tam erişimli bir kimlik bilgisi yerine bunları kullan.
- **Onay istemlerini açık tut.** Büyük ajan ürünlerinin hepsi bir tür "satın almadan/paylaşmadan/göndermeden önce onayla" özelliğini destekliyor — bunu kolaylık için kapatmak, enjekte edilmiş bir talimatı çalışmadan önce yakalayan tek güvenlik önlemini devre dışı bırakıyor.
- **Önce salt okunur.** Ajanı, yazma ya da harcama yapan işlere güvenmeden önce sadece veri okuyan işlerde (kontrol, özetleme) çalıştır ve gerçekte nasıl davrandığını gördükten sonra yeniden değerlendir.

## Ne zaman kesinlikle hayır demeli?

Kısa cevap: Ana banka hesabına, hassas müşteri ya da şirket verisine erişimi olan bir iş hesabına ya da yanlış bir işlemin maliyetli veya geri döndürülmesi zor olduğu herhangi bir servise dokunan her şey için ajan üzerinden girişi tamamen atla — kolaylık, en önemli hesaplarında tasarım itibarıyla çözülmemiş bir risk kategorisine değmez.

Bir işi, internetteki her şeyi olduğu gibi kabul eden, yetenekli ama bazen kolay kanan bir stajyere emanet etmek seni geriyorsa, bu iş bir tarayıcı ajanına emanet edilmeye de hazır değil.

Kişisel değerlendirmem: Sektörün "prompt injection çözülmedi" sorusuna şu anki cevabı büyük ölçüde "onu tespit etmede daha iyi hale geliyoruz" — bu makul bir mühendislik cevabı ama bugün ana hesaplarını devretmek için kötü bir gerekçe. Ajan girişlerine, tam erişim isteyen yeni bir tarayıcı eklentisine davranacağın gibi davran — doğru, dar bir iş için kullanışlı, varsayılan olarak vereceğin bir şey değil.

Bunun kimlik doğrulama tarafı için [passkey ile şifresiz hayat](/tr/posts/sifresiz-hayat-passkey-2026) ve [passkey ve WebAuthn rehberimize](/tr/posts/passkey-webauthn-rehberi) bakabilirsin. Bunun mümkün kıldığı saldırı sınıfı için [Agentjacking: yeni AI ajan saldırısı](/tr/posts/agentjacking-yeni-ai-ajan-saldirisi) yazımızı okuyabilirsin. İş için belirli bir ajan ürünü değerlendiriyorsan [ChatGPT Work: OpenAI'ın çok adımlı proje ajanı](/tr/posts/chatgpt-work-nedir-openai-is-ajani) yazımıza, bunun arkasındaki daha büyük trafik eğilimi için [internetin yarısı artık bot](/tr/posts/internetin-yarisi-bot-ne-anlama-geliyor) yazımıza bakabilirsin.

## Sıkça Sorulan Sorular

### ChatGPT ya da Gemini'ye hesaplarıma giriş yapmasına izin vermek güvenli mi?

Kısıtlı erişimli ayrı bir profilde, düşük riskli ve salt okunur işler için bu makul bir risk; ama OpenAI'ın kendi güvenlik ekibi, tarayıcı ajanlarına karşı prompt injection'ın çözülmemiş bir risk olduğunu söylüyor — yanlış bir işlemin maliyetli ya da geri döndürülemez olacağı hesaplarda bundan kaçın.

### Prompt injection basitçe nedir?

Bir web sayfasındaki gizli metin — görünmez biçimlendirme, HTML yorumları ya da sıradan görünen bir gönderi — bir talimat gibi görünecek şekilde yazılıyor; böylece o sayfayı okuyan bir AI ajanı, senin talimatın yerine (ya da onunla birlikte) saldırganın komutunu takip ediyor.

### Sıradan görünen bir web sayfası üzerinden tarayıcı bir AI ajanı hacklenebilir mi?

Evet, dolaylı olarak. Ajan geleneksel anlamda hacklenmiyor — zaten ona verdiğin erişimi kötüye kullanması için kandırılıyor, çünkü sayfa içeriğine gömülü gizli talimatları senden gelen gerçek bir talimattan her zaman ayırt edemiyor.

### AI ajanıma hesaplarımı kullandırmadan önce alınacak en önemli önlem ne?

Ajan işleri için ayrı, daha düşük yetkili bir profil ya da hesap kullan ve para harcayan, herkese açık paylaşım yapan ya da veri silen her şey için onay istemlerini açık tut — bu ikili, ajanın erişebildiği yeri de yapabildiği şeyi de senin açık onayın olmadan sınırlar.
