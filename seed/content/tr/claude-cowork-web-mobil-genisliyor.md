---
title: "Claude Cowork Artık Web ve Mobilde"
slug: "claude-cowork-web-mobil-genisliyor"
translationKey: "claude-cowork-web-mobile-expansion"
locale: "tr"
excerpt: "Anthropic, 7 Temmuz 2026'da Claude Cowork'ü web ve mobile taşıdı. Oturumlar artık bulutta çalışıyor; kodlama dışı işler kullanımın çoğunu oluşturuyor."
category: "ai"
tags: ["ai-agents", "ai-tools", "automation", "ai-infrastructure", "claude"]
publishedAt: "2026-07-08"
seoTitle: "Claude Cowork Web ve Mobilde: Neler Değişti"
seoDescription: "Anthropic, Claude Cowork'ü 7 Temmuz 2026'da web ve mobile genişletti. İzin modelini, Microsoft 365 yazma araçlarını ve kullanım verilerini inceliyoruz."
---

Anthropic, 7 Temmuz 2026'da Claude Cowork'ü masaüstünden web ve mobile (iOS/Android) taşıdı. Oturumlar artık bulutta çalışıyor: bir görevi masanızda başlatıp telefonunuzdan takip edebiliyor, dizüstünüzü kapatsanız bile iş devam ediyor. Beta, Max plan aboneleriyle başlıyor; diğer planlar önümüzdeki haftalarda ekleniyor.

## Ne değişti, tam olarak

Claude Cowork, Ocak 2026'da masaüstü araştırma önizlemesi olarak duyurulmuştu: sandbox'lanmış bir kabuk ve kullanıcının seçtiği dosya/klasörlere erişimle, Claude'un dosya okuyup yazmasına, kod çalıştırmasına ve çok adımlı görevleri zincirlemesine izin veren bir ajan. Hedef kitle geliştiriciler değil, ofis çalışanlarıydı — rapor derleyen, e-tablo düzenleyen, sunum hazırlayan insanlar.

7 Temmuz'daki genişlemeyle birlikte üç şey değişti. Birincisi, platform: Cowork artık claude.ai üzerinden web'de ve Claude uygulamasının kenar çubuğundan iOS/Android'de erişilebilir. İkincisi, çalışma modeli: oturumlar artık uzaktan, bulutta yürütülüyor; dosyalar ve oturum durumu Claude hesabınıza kaydediliyor, böylece iş cihazdan cihaza taşınabiliyor. Zamanlanmış görevler hiçbir cihaz açık olmadan da çalışabiliyor. Üçüncüsü, teşvik: Anthropic, beta süresince kullanım limitlerini 5 Ağustos 2026'ya kadar iki katına çıkardı.

Bu, [TechCrunch'ın manşetinde](https://techcrunch.com/2026/07/07/the-coding-agent-wars-are-spilling-into-the-rest-of-the-office-claude-cowork/) "kodlama ajanı savaşlarının ofisin geri kalanına sıçraması" olarak tanımlandı — isabetli bir çerçeveleme, çünkü Cowork'ün mimarisi doğrudan [Claude Code subagent ve arka plan ajanları](/tr/posts/claude-code-subagent-arka-plan-ajanlari) deneyiminden ödünç alınmış durumda.

Anthropic'in kendi [duyuru yazısı](https://claude.com/blog/cowork-web-mobile), web ve masaüstünde sohbet ile Cowork'ün tek bir arayüzde birleştirileceğini, proje ve artifact'lerin iki mod arasında ortak yaşayacağını belirtiyor. Yani Cowork artık ayrı bir "mod" değil, claude.ai'nin normal akışının bir parçası haline geliyor — bu da benimseme sürtünmesini önemli ölçüde azaltan bir tasarım tercihi.

## Geliştiriciler için neden önemli

Cowork'ü bir "ChatGPT rakibi" gibi okumak yanlış olur. Asıl önemli olan, Claude Code'da normalleşen otonom ajan tasarım desenlerinin — sandbox'lı yürütme, dosya kapsamı belirleme, arka planda çalışma, onay noktaları — artık kod tabanının dışına taşınmış olması. Bir yıl önce "ajan" dendiğinde akla gelen şey bir terminal ve bir repo idi; şimdi aynı desen bir e-tablo, bir gelen kutusu ya da bir SharePoint klasörü için de geçerli.

Bu, [ajan mı workflow mu](/tr/posts/ai-agent-mi-workflow-mu) tartışmasına da yeni bir veri noktası ekliyor: Cowork, kapsamı önceden tanımlı bir workflow değil, kullanıcının anlık olarak dosya/klasör seçip görev tanımladığı gerçek bir ajan. Otonomi arttıkça izin modelinin sağlamlığı da doğru orantılı önem kazanıyor — bu yazının asıl konusu da bu.

Ayrıca pratik bir sonucu var: bir ekip Claude Code'u zaten üretimde kullanıyorsa, Cowork'ün izin ve onay mimarisi tanıdık gelecek. Sandbox kapsamını daraltma, hassas eylemler için onay isteme, oturum durumunu kalıcı hale getirme — bunların hepsi geliştiricilerin repo bağlamında zaten alışık olduğu desenler. Fark, bu desenlerin artık bir gelen kutusuna veya bir SharePoint sitesine de uygulanıyor olması. Bu da platform ekiplerine yeni bir görev yüklüyor: yalnızca kod tabanı için değil, kurumun tüm dosya ve iletişim yüzeyi için ajan izin politikası tanımlamak.

## İzin modeli: en az yetki, insan onayı

Cowork'ün güvenlik tasarımı iki ilkeye dayanıyor. Birincisi, en az yetki mirasıdır: Claude, kullanıcının Microsoft 365'te zaten sahip olduğu izinlerin ötesine geçemiyor. Yazma araçları açıkken Claude e-posta gönderebiliyor, taslak ve takvim etkinliklerini yönetebiliyor, posta kutusu ayarlarını güncelleyebiliyor, OneDrive ve SharePoint'te dosya oluşturup düzenleyebiliyor — ama yalnızca kullanıcının kendi hesabıyla zaten görebileceği ve değiştirebileceği kapsamda. Bu bağlantı, bir Microsoft Business planına bağlı Microsoft Entra kiracısı gerektiriyor; kişisel @outlook.com veya @hotmail.com hesapları kapsam dışı kalıyor. [Microsoft 365 konektör güvenlik rehberi](https://support.claude.com/en/articles/12684923-microsoft-365-connector-security-guide), yazma izinlerinin bir Microsoft Entra genel yöneticisi tarafından ayrıca onaylanması gerektiğini de belirtiyor.

İkinci ilke, riskli veya geri dönüşü zor kararlarda insan onayı. Cowork, gönderim, silme veya harici paylaşım gibi eylemlerde durup açık onay istiyor; bu onaylar artık telefondan da verilebiliyor. Pratikte bu, [Claude in Chrome GA güvenlik rehberi](/tr/posts/claude-in-chrome-ga-gelistirici-guvenlik-rehberi)'nde ele aldığımız "onay iste / sormadan uygula" ayrımının aynısı — Anthropic, farklı ürünlerinde tutarlı bir onay-kapısı deseni kuruyor.

Aşağıdaki tablo, Cowork'ün üç platformdaki kapsamını ve Claude Code ile karşılaştırmasını özetliyor:

| Boyut | Claude Cowork (masaüstü) | Claude Cowork (web/mobil) | Claude Code |
|---|---|---|---|
| Hedef kullanıcı | Bilgi işçisi, teknik olmayan | Bilgi işçisi, her yerden | Yazılım geliştirici |
| Oturum yürütme | Yerel sandbox | Bulutta, uzaktan | Yerel veya bulut (arka plan ajanları) |
| Erişim kapsamı | Seçilen dosya/klasör | Seçilen dosya/klasör + M365 | Repo ve terminal |
| Cihazlar arası devamlılık | Yok | Var (durum hesaba kaydediliyor) | Kısmi (arka plan ajanlarıyla) |
| Onay noktası | Masaüstünde | Web veya mobilden | CLI/PR onayı |

## Kullanım verileri: kod yazmak azınlıkta kalıyor

Anthropic, aynı duyuruyla birlikte 600.000'den fazla organizasyondan toplanan, 1,2 milyon anonimleştirilmiş Cowork oturumundan oluşan bir kullanım analizi de yayımladı (Mayıs 2026'nın son iki haftasından örneklenmiş). Sonuç, "ajan araçları geliştiricilerin oyuncağı" varsayımını çürütüyor: oturumların yüzde 90'ından fazlası yazılım geliştirmeyle ilgisiz. Yazılım geliştirme, tüm oturumların yalnızca yüzde 8,7'sini oluşturuyor. En büyük kategori, yüzde 33,4 ile iş süreçleri ve operasyonlar (raporları tek bir belgede toplama, işe alım kontrol listeleri hazırlama, e-tabloları mutabakat etme gibi işler); onu yüzde 16,4 ile içerik üretimi ve metin yazarlığı izliyor. Bu iki kategori tek başına kullanımın yarısını oluşturuyor. [VentureBeat'in haberi](https://venturebeat.com/technology/anthropic-brings-claude-cowork-to-mobile-and-web-as-usage-data-shows-most-users-arent-coding) bu verinin Anthropic'in kendi açıklamasına dayandığını doğruluyor.

Bu, geliştiriciler için ilginç bir sinyal: aynı ajan mimarisi (sandbox, dosya kapsamı, onay noktaları) kodlama dışı alanlarda bile işe yarıyorsa, kendi ekibinizde "yalnızca mühendisler için" tasarladığınız iç araçların kapsamını yeniden düşünmeye değer olabilir.

## Microsoft 365 yazma araçları: örnek kapsam

Yazma araçlarının etkinleştirildiği bir bağlantı, kavramsal olarak aşağıdaki gibi bir izin kapsamına benziyor (bu, Anthropic'in resmî bir API şeması değil, yalnızca izin modelini somutlaştırmak için hazırlanmış bir örnek):

```json
{
  "connector": "microsoft-365",
  "tenant": "contoso.onmicrosoft.com",
  "writeTools": {
    "mail": ["draft", "send"],
    "calendar": ["create", "update"],
    "mailboxSettings": ["update"],
    "oneDrive": ["create", "update"],
    "sharePoint": ["create", "update"]
  },
  "permissionMirror": "user-existing-m365-scope",
  "requiresApprovalFor": ["send", "externalShare", "delete"],
  "adminConsent": "entra-global-admin-required"
}
```

Buradaki kritik alan `permissionMirror`: Claude'un yetki kapsamı, konektörün kendi tanımından değil, o anda oturum açmış kullanıcının Microsoft 365'teki mevcut rolünden geliyor.

## Cowork'ün onay mekanizması aslında doğru tasarım

Açıkçası, bir ajanın e-postanızı sizin onayınız olmadan gönderememesi bir kısıtlama değil, Cowork'ün bugüne kadarki en isabetli tasarım kararı. Otonomiyi artırırken onay noktalarını azaltan ürünler er ya da geç bir güven krizi yaşıyor; Anthropic bunun tersini yaparak hem hız hem güvenlik iddiasında bulunuyor.

Bu yaklaşım, [çok ajanlı orkestrasyon kalıpları](/tr/posts/cok-ajanli-orkestrasyon-kaliplari) yazısında ele aldığımız "kimin neye yetkisi var" sorusunun ofis yazılımlarına taşınmış hali. Kendi ajan sistemlerinizi tasarlarken de aynı soruyu sormaya değer: hangi eylemler geri alınabilir, hangileri değil, ve o farkı kod düzeyinde nasıl işaretliyorsunuz?

Konuyla ilgili daha fazla bağlam için [yapay zeka kategorimize](/tr/category/yapay-zeka) göz atabilirsiniz.

## Sıkça Sorulan Sorular

### Claude Cowork şu anda kimler için kullanılabilir?

Temmuz 2026 itibarıyla beta, Max plan abonelerine açık. Anthropic, önümüzdeki haftalarda diğer planları da eklemeyi planlıyor; 5 Ağustos 2026'ya kadar kullanım limitleri iki katına çıkarılmış durumda.

### Cowork oturumları kapalı bir dizüstü bilgisayarla devam edebiliyor mu?

Evet. Web ve mobil genişlemeyle birlikte oturumlar bulutta uzaktan yürütülüyor; dosyalar ve oturum durumu Claude hesabınıza kaydediliyor. Zamanlanmış görevler, hiçbir cihaz çevrimiçi olmadan da tamamlanabiliyor.

### Microsoft 365 yazma araçları hangi hesaplarla çalışıyor?

Yalnızca bir Microsoft Business planına bağlı Microsoft Entra kiracısı olan kurumsal hesaplarla. Kişisel @outlook.com veya @hotmail.com hesapları desteklenmiyor; yazma izinlerinin ayrıca bir Entra genel yöneticisi tarafından onaylanması gerekiyor.

### Cowork, Claude Code'un yerini mi alıyor?

Hayır. Claude Code repo ve terminal odaklı kalırken, Cowork daha geniş bir dosya/klasör ve ofis uygulaması kapsamında çalışıyor. İkisi aynı ajan tasarım ilkelerini (sandbox, onay noktaları, kapsamlı erişim) paylaşıyor ama farklı kullanıcı kitlelerine hitap ediyor.
