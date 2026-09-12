---
title: "Windows Recall ve Copilot: Gizlilik Bedeli Ne?"
slug: "windows-recall-copilot-gizlilik-bedeli"
translationKey: "windows-recall-copilot-privacy-2026"
locale: "tr"
excerpt: "Kısa cevap: Recall artık varsayılan kapalı, Windows Hello ile şifreli ve yalnızca Copilot+ PC'lerde çalışıyor; asıl risk özelliğin kendisi değil."
category: "technology"
tags: ["privacy", "on-device-ai", "authentication"]
publishedAt: "2026-09-12"
seoTitle: "Windows Recall ve Copilot: Gizlilik Bedeli Nedir?"
seoDescription: "Windows Recall'un 2026'da nasıl çalıştığını, hangi verileri hangi şifrelemeyle sakladığını ve kurumda nasıl güvenle yapılandırılacağını anlatıyoruz."
---

Kısa cevap: Windows Recall, ekranınızın periyodik anlık görüntülerini alıp yerel olarak, Windows Hello Gelişmiş Oturum Açma Güvenliği (ESS) ile şifreleyerek saklıyor; 2026 itibarıyla varsayılan olarak kapalı ve yalnızca Copilot+ PC'lerde çalışıyor. Asıl gizlilik bedeli özelliğin var olması değil, bir kez açtığınızda yaptığınız her şeyin aranabilir bir arşivini oluşturması.

## Windows Recall gerçekte ne kaydediyor ve verileriniz nerede duruyor?

Kısa cevap: Recall, birkaç saniyede bir ekran görüntüsü alıyor, bunları optik karakter tanıma ile indeksliyor ve tamamen cihazınızda, buluta hiç gönderilmeden saklıyor. Bu, "geçmişini ara" dediğinizde Copilot'un aylar önce açtığınız bir belgeyi, ziyaret ettiğiniz bir web sayfasını ya da yazdığınız bir mesajı bulabilmesini sağlıyor.

Veriler Copilot+ PC gereksinimlerini karşılayan bir cihazın Neural Processing Unit'inde (NPU — yapay zeka işlemlerine özel donanım) işleniyor. Bu, ekran görüntülerinin ve OCR indeksinin bir sunucuya değil, doğrudan diskinize yazıldığı anlamına geliyor — ama diskte durmak, otomatik olarak güvenli olmak anlamına gelmiyor.

## 2024'teki tepkiden bu yana Recall'un opt-in durumu nasıl değişti?

Kısa cevap: Recall artık tamamen isteğe bağlı (opt-in) — yeni Copilot+ PC'lerde varsayılan olarak kapalı geliyor ve özelliği açmak için Ayarlar > Gizlilik ve güvenlik menüsünden "Recall ve anlık görüntüler"i etkinleştirmeniz gerekiyor. 2024'teki ilk duyuru, güvenlik araştırmacılarının şifresiz bir SQLite veritabanında düz metin ekran verisi bulmasıyla büyük tepki toplamıştı; Microsoft o noktadan bugüne kadar özelliği üç kez yeniden tasarladı.

Recall, Aralık 2025'te Copilot+ PC'lerde genel kullanıma açıldı — Nisan 2025'teki güvenlik dışı önizleme güncellemesiyle başlayan kademeli dağıtımın ardından. 2026 itibarıyla kurulum ekranı, özelliğin ne yaptığını açıkça anlatıyor ve kullanıcıdan aktif onay istiyor; bu, önceki "varsayılan açık" yaklaşımından tam bir dönüş.

| Dönem | Varsayılan durum | Şifreleme | Gereksinim |
|---|---|---|---|
| 2024 (ilk duyuru) | Açık (opt-out) | Şifresiz yerel veritabanı | Copilot+ PC |
| 2025 (yeniden lansman) | Kapalı (opt-in) | Windows Hello ile temel şifreleme | Copilot+ PC + Windows Hello |
| 2026 (mevcut) | Kapalı (opt-in) | Tam zamanında (just-in-time) çözme, ESS korumalı | Secured-core standardını karşılayan Copilot+ PC |

## Verileriniz hangi şifrelemeyle korunuyor?

Kısa cevap: Microsoft artık "tam zamanında" (just-in-time) şifre çözme ekledi — Recall anlık görüntüleri yalnızca siz Windows Hello Gelişmiş Oturum Açma Güvenliği ile kimliğinizi doğruladığınızda çözülüyor ve erişilebilir hale geliyor. Bu, dizüstü bilgisayarınız çalınsa bile diskteki verilerin, saldırgan biyometrik kimlik doğrulamasını geçemediği sürece okunamaz kalması anlamına geliyor.

Recall'u açmak için Windows Hello kaydı zorunlu; zaman çizelgenizi görüntülemek ve aramak için de her seferinde "varlık kanıtı" (proof of presence) isteniyor — yani başka biri bilgisayarınızın başına geçse bile, oturumunuz açıkken bile geçmişinizi göremiyor.

## Hassas içerik filtrelemesi ne kadar güvenilir?

Kısa cevap: Microsoft, kredi kartı numaraları ve parolalar gibi belirli hassas veri türlerini otomatik olarak tespit edip anlık görüntülerden hariç tutmaya çalışıyor, ancak bu filtreleme mükemmel değil ve şirketler bunu tek güvenlik katmanı olarak görmemeli. Filtreleme örüntü tabanlı çalıştığı için, standart olmayan biçimdeki hassas bilgiler (örneğin özel bir uygulamanın kendi format ettiği finansal veri) gözden kaçabilir.

Bu yüzden Recall'u kurumsal bir ortamda çalıştıracaksanız, filtrelemeye güvenmek yerine hangi uygulamaların ve pencerelerin tamamen hariç tutulacağını (dışlama listeleri aracılığıyla) elle tanımlamak daha güvenilir bir yaklaşım.

Örneğin bir muhasebe uygulaması kendi özel formatında maaş bilgisi gösteriyorsa, Recall'un genel örüntü tanıma sistemi bunu "hassas finansal veri" olarak işaretlemeyebilir — çünkü format, filtrenin eğitildiği standart kredi kartı ya da IBAN örüntülerine uymuyor. Bu boşluk, özellikle özel iç araçlar kullanan şirketler için gerçek bir risk.

## Kurumsal ortamda hangi ek kontroller var?

Kısa cevap: Microsoft, BT yöneticilerine Recall'u cihaz, kullanıcı grubu ya da uygulama bazında kısıtlama imkanı veren Grup İlkesi (Group Policy) ve Intune şablonları sunuyor; bu sayede bir şirket Recall'u yalnızca belirli departmanlarda ya da hiçbir yerde etkinleştirmeme kararı alabilir. Düzenlenmiş sektörlerde (finans, sağlık) çalışan şirketlerin çoğu, uyumluluk gereksinimleri netleşene kadar Recall'u organizasyon genelinde kapalı tutmayı tercih ediyor.

Bunun nedeni basit: Recall'un ürettiği arama dizini, bir e-keşif (e-discovery) talebinde ya da veri ihlali soruşturmasında normalde erişilemeyecek düzeyde ayrıntılı bir kullanıcı aktivite geçmişi ortaya çıkarabilir. Bir şirketin veri saklama politikası "90 gün sonra sil" diyorsa ama Recall verileri cihazda ayrı bir yaşam döngüsünde tutuyorsa, bu iki politika çatışabilir — BT ekiplerinin bunu açıkça senkronize etmesi gerekiyor.

Kurumsal cihaz filosu yöneten ekipler için pratik bir kontrol listesi şöyle: Recall'u varsayılan olarak kapalı bir ilke şablonuyla dağıtın, yalnızca açıkça talep eden ve gerekçesi olan çalışanlar için istisna tanımlayın, ve Recall verisinin cihaz kaybı ya da çalınma senaryosunda uzaktan silinebildiğinden (remote wipe) emin olun. Bu üç adım, özelliğin sunduğu üretkenlik faydasını tamamen feda etmeden riski büyük ölçüde azaltıyor.

## Recall'u kapatmak ya da kapsamını daraltmak nasıl yapılır?

Kısa cevap: Ayarlar > Gizlilik ve güvenlik > Recall ve anlık görüntüler menüsünden özelliği tamamen kapatabilir, ya da belirli uygulamaları ve web sitelerini anlık görüntü almadan hariç tutabilirsiniz; kurumsal ortamda ise BT yöneticileri Grup İlkesi veya Intune üzerinden Recall'u organizasyon genelinde devre dışı bırakabilir. Bireysel kullanıcılar için en pratik yaklaşım, hassas iş akışlarının (bankacılık, sağlık kayıtları, hukuki belgeler) çalıştığı uygulamaları dışlama listesine eklemek.

Kurumsal BT ekipleri için Microsoft, Recall'u varsayılan olarak devre dışı bırakan ve yalnızca açıkça izin verilen cihazlarda etkinleştiren merkezi ilke şablonları sunuyor — bu, çalışanların kurumsal cihazlarda kişisel tercihle özelliği açmasını engelliyor.

Kişisel değerlendirmem: Recall'un 2026 sürümü, 2024'teki ilk haliyle kıyaslanamayacak kadar güvenli — ama "aranabilir bir hayat kaydı" fikri hâlâ temelde bir güven meselesi. Şifreleme ne kadar güçlü olursa olsun, bir özelliğin var olması, birinin er ya da geç ona erişmeye çalışacağı anlamına geliyor; bu yüzden asıl soru "Recall güvenli mi" değil, "bu veriyi hangi tehdit modeline karşı saklamaya değer mi" olmalı.

Bu soruyu kendinize sorarken göz önünde bulundurmanız gereken pratik bir kıstas: cihazınızı düzenli olarak halka açık alanlarda (kafe, havalimanı) kullanıyorsanız ya da paylaşımlı bir bilgisayarsa, Recall'un getirisi risklerine göre daha düşük kalıyor. Kişisel, tek kullanıcılı ve fiziksel olarak güvenli bir cihazda ise denge tam tersine dönebilir.

Yapay zeka destekli işletim sistemi özelliklerinin gizlilik dengesi hakkında daha fazlası için [Teknoloji kategori sayfamıza](/tr/category/teknoloji) göz atabilirsiniz; sohbet asistanlarının geçmiş verilerini nasıl sakladığına dair karşılaştırma için [ChatGPT Computer History gizlilik rehberimize](/tr/posts/chatgpt-computer-history-kullanim-gizlilik) bakabilirsiniz.

## Sıkça Sorulan Sorular

### Windows Recall varsayılan olarak açık mı?

Hayır. 2026 itibarıyla Recall, yeni Copilot+ PC'lerde varsayılan olarak kapalı geliyor; özelliği kullanmak için Ayarlar > Gizlilik ve güvenlik menüsünden bilinçli olarak etkinleştirmeniz gerekiyor.

### Recall'u kullanmak için hangi donanıma ihtiyacım var?

Recall yalnızca Secured-core standardını karşılayan bir Copilot+ PC'de çalışıyor; bu, özel bir Neural Processing Unit (NPU) gerektiren bir donanım gereksinimi. Standart Windows 11 bilgisayarlarda özellik mevcut değil.

### Recall verileri şifreli mi saklanıyor?

Evet. Microsoft, anlık görüntülerin yalnızca Windows Hello Gelişmiş Oturum Açma Güvenliği ile kimlik doğrulaması yapıldığında çözülüp erişilebilir hale geldiği "tam zamanında" şifre çözme sistemi kullanıyor; bu, cihaz çalınsa bile verilerin kimlik doğrulaması olmadan okunamaması anlamına geliyor.

### Recall'u kurumsal ortamda nasıl devre dışı bırakabilirim?

BT yöneticileri Grup İlkesi veya Microsoft Intune üzerinden merkezi ilke şablonlarıyla Recall'u organizasyon genelinde devre dışı bırakabilir ya da yalnızca açıkça onaylanan cihazlarda etkinleştirebilir; bu, çalışanların özelliği kendi tercihleriyle açmasını engeller.
