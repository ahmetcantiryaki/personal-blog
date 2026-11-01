---
title: "Yapay Zeka Ajanları Neden Sanal Makinede Çalışır?"
slug: "yapay-zeka-ajanlari-neden-sanal-makinede-calisir"
translationKey: "why-ai-agents-run-in-sandboxes-2026"
locale: "tr"
excerpt: "Kısa cevap: ajan bilgisayarınızda değil, her oturum için sıfırdan kurulan izole bir sanal makinede çalışır; bir hata ya da saldırı asıl sisteminize sıçramaz."
category: "ai"
tags: ["ai-agents", "web-security", "privacy", "best-practices"]
publishedAt: "2026-11-01"
seoTitle: "Yapay Zeka Ajanları Neden Sanal Makinede Çalışır?"
seoDescription: "Claude Cowork, ChatGPT Agent ve Gemini neden izole sanal makinede çalışır? Sandbox'ın önlediği ve önleyemediği riskler, güvenlik alışkanlıkları."
---

Kısa cevap: Claude Cowork, ChatGPT Agent ve benzeri ajanlar, dosya silme veya kötü niyetli bir komut gibi geri alınamaz hasarı sınırlamak için her oturumda sıfırdan kurulan, kendi ağ kuralları ve dosya sistemi olan izole bir sanal makinede (VM) çalışır. Bu sanal makine oturum bitince tamamen siliniyor, yani bir ajan orada ne yaparsa yapsın, asıl bilgisayarınız veya sunucunuz etkilenmiyor.

## Yapay zeka ajanları neden doğrudan bilgisayarınızda çalışmıyor?

Bir ajana "bu klasörü düzenle" dediğinizde, o ajan aslında bağımsız kararlar alıp komut çalıştıran bir yazılım; hatalı bir komut, bozuk bir bağımlılık ya da bir web sayfasından gelen gizli bir talimat (prompt injection) onu beklenmedik bir işlem yapmaya yönlendirebilir. Ajan doğrudan asıl işletim sisteminizde çalışsaydı, bu hataların etkisi tüm dosyalarınıza, tarayıcı oturumlarınıza ve ağınıza kadar uzanabilirdi.

Sanal makine bu etkiyi tek bir kutuya hapsediyor. Anthropic'in Cowork mimarisini açıklayan [destek dokümantasyonu](https://support.claude.com/en/articles/14479288-claude-cowork-architecture-overview), masaüstü oturumlarında VM'in kendi ağ çıkış filtrelemesini, syscall kısıtlamalarını ve oturuma özel kullanıcı izolasyonunu uyguladığını belirtiyor. Pratikte bu, ajanın çalıştırdığı her komutun önce bu sınırlı ortamdan geçmesi, asıl sisteme hiçbir zaman doğrudan dokunmaması anlamına geliyor.

## Sandbox tam olarak hangi riskleri önlüyor?

Sandbox üç somut riski önlüyor: istenmeyen dosya silme veya değiştirmenin asıl sisteme sıçraması, ajanın işlediği verilerin izinsiz dışarı sızması (veri sızıntısı) ve bir web sayfasından gelen gizli talimatın (prompt injection) ajanı ele geçirdiğinde yapabileceği hasarın kapsamı. Cloud oturumlarında her oturum kendi sandbox'ını alıyor, oturumlar ve organizasyonlar arasında paylaşılan durum (state) bulunmuyor — bu da bir oturumdaki sızıntının başka bir oturuma veya kullanıcıya geçmesini yapısal olarak engelliyor.

| Risk türü | Sandbox bunu önler mi? |
|---|---|
| Ajanın yanlışlıkla sistem dosyalarını silmesi | Evet — VM dışına çıkamaz |
| Prompt injection ile ele geçirilip zararlı komut çalıştırma | Kısmen — hasar VM içinde kalır, dışarı sızmaz |
| Yetkisiz ağ bağlantısı kurma | Evet — tüm trafik zorunlu bir proxy'den geçer |
| Siz onay verdiğiniz bir eylemin sonucu (ör. yanlış dosyayı silmesini istemeniz) | Hayır — bu sizin yetkilendirdiğiniz bir eylem |
| Bağladığınız bir connector'ın (e-posta, CRM) kötüye kullanılması | Hayır — connector token'ları sandbox dışında, servis tarafında çalışır |

## Sandbox neyi önleyemiyor?

Sandbox, sizin açıkça yetkilendirdiğiniz bir eylemin sonucunu önleyemiyor; ajana "bu dosyayı sil" dediğinizde ve ajan yanlış dosyayı silerse, bu VM'in başarısızlığı değil, talimatın veya yetkilendirmenin başarısızlığı oluyor. Aynı şekilde, bir connector üzerinden gerçek e-posta hesabınıza veya CRM'inize bağladığınız bir ajan, o bağlantı üzerinden gerçek ve geri alınamaz işlemler yapabiliyor — çünkü connector token'ı, sandbox'ın dışında, doğrudan o servisle konuşuyor.

Temmuz 2026'da Cloud Security Alliance'ın yayınladığı bir [araştırma notu](https://labs.cloudsecurityalliance.org/wp-content/uploads/2026/07/CSA_research_note_claude_cowork_sharedroot_sandbox_escape_20260724-csa-styled.pdf), "SharedRoot" adlı bir zincirin, yerel VM içindeki yetkisiz bir oturum kullanıcısının izin istemeden Mac'in ana dosya sistemine erişebildiğini öne sürdü; Anthropic raporun ciddiyetine itiraz etti. Bu örnek, sandbox'ın güçlü ama kusursuz olmayan bir sınır olduğunu, tek güvenlik katmanı olarak görülmemesi gerektiğini gösteriyor.

## Claude Cowork'ün izolasyon modeli nasıl çalışır?

Cowork'te yerel oturumlar macOS'te Apple Virtualization, Windows'ta Hyper-V hipervizörüyle ayrılmış özel bir Linux konuk sisteminde çalışıyor; her oturum rastgele adlı kendi kullanıcı hesabını alıyor ve disk her VM başlangıcında yeniden biçimlendiriliyor. Bulut oturumlarında ise her oturum başlangıçta oluşturulan, bitişte tamamen yok edilen kendi sandbox'ını alıyor; connector token'ları saatler içinde süresi dolan, oturuma özgü yetkilerle sınırlı tutuluyor.

Bilgisayar kullanımı (computer use) ve tarayıcı kontrolü gibi bazı yetenekler VM'in dışında çalışıyor, bu da onları ayrı bir izin ve inceleme katmanına tabi kılıyor. [Claude Cowork'ün web ve mobile genişlemesi](/tr/posts/claude-cowork-web-mobil-genisliyor) ile bu izolasyon modeli, masaüstünün dışındaki oturumlara da taşınmış durumda.

## ChatGPT Agent ve Gemini nasıl izole ediliyor?

ChatGPT Agent, OpenAI'ın kendi sandbox'ında çalışıyor ve sadece konuşmaya açıkça yüklediğiniz dosyaları görebiliyor; ancak Atlas tarayıcısındaki "logged-in" modda, zaten oturum açtığınız sitelere erişebiliyor — bu da standalone ajan ile tarayıcı içi ajan arasında farklı bir izolasyon seviyesi olduğu anlamına geliyor. OpenAI, finansal kurumlar gibi hassas sitelerde duraklama gibi ek güvenlik önlemleri eklediğini belirtiyor; Atlas'taki agent modu tarayıcıda kod çalıştıramıyor, dosya indiremiyor, eklenti kuramıyor ve kayıtlı şifrelere erişemiyor.

| Platform | İzolasyon modeli | Bilgisayarınıza doğrudan erişim |
|---|---|---|
| Claude Cowork (masaüstü) | Hipervizör ile ayrılmış Linux VM | Yok — computer use ayrı katmanda |
| Claude Cowork (bulut) | Oturum başına oluşturulup yok edilen sandbox | Yok |
| ChatGPT Agent (standalone) | OpenAI'ın kendi sandbox'ı, temiz tarayıcı | Yok |
| ChatGPT Agent (Atlas, logged-in mod) | Sandbox + oturum açık sitelere erişim | Sınırlı — dosya/eklenti/şifre erişimi yok |

## Gerçek dosya ve sistem erişimi vermenin bedeli nedir?

Bir ajana gerçek dosyalarınıza veya hesaplarınıza erişim verdiğiniz an, sandbox'ın sağladığı korumanın bir kısmından vazgeçmiş oluyorsunuz; artık riskin sınırı VM'in duvarları değil, o ajana verdiğiniz yetkinin kapsamı. Bu değiş tokuş kaçınılmaz çünkü bir ajanın gerçekten işe yaraması için gerçek verilere dokunması gerekiyor — ama bu, erişimi ne kadar geniş vereceğinizin bilinçli bir karar olması gerektiği anlamına geliyor.

Kendi değerlendirmem: çoğu kullanıcı bu riski "ya tam izin ver ya da hiç kullanma" ikilemi olarak görüyor, oysa pratikte üçüncü bir yol var — erişimi görev bazında daraltmak. [AI ajanlarını production öncesi test etme](/tr/posts/ai-ajanlari-produksiyon-oncesi-test) yazısında ele alınan "önce izole ortamda dene" ilkesi, burada da geçerli: geniş yetkiyi doğrudan vermek yerine, önce dar kapsamlı bir klasörde veya salt-okunur bağlantıda deneyip güven oluşturduktan sonra genişletmek daha güvenli.

## Ajan kullanırken hangi güvenlik alışkanlıklarını edinmelisiniz?

Dört alışkanlık riskin büyük kısmını azaltıyor: ajana sadece ihtiyacı olan klasörü gösterin (tüm diski veya ana dizini değil), ajan bir değişiklik önerdiğinde onu uygulamadan önce diff'i (değişiklik özetini) okuyun, geri alınamaz bir işlemden önce yedek alın ve connector'ları en az yetki ilkesiyle bağlayın — örneğin e-postanıza "oku" yetkisi yeterliyse "gönder" yetkisi vermeyin.

Bu alışkanlıklar özellikle connector'lar için kritik, çünkü connector token'ları sandbox'ın koruma alanının dışında çalışıyor. [Yapay zeka asistanları çağında gizliliğinizi korumak](/tr/posts/ai-asistanlari-caginda-gizliligini-koru) yazısında anlatılan veri paylaşım prensipleri, ajanlara connector bağlarken de birebir geçerli: her yeni bağlantı, sandbox'ın çizdiği sınırın dışında yeni bir risk yüzeyi açıyor.

## Sıkça Sorulan Sorular

### Yapay zeka ajanları neden sanal makinede çalışır?

Ajanın çalıştırdığı komutların veya bir prompt injection saldırısının asıl bilgisayarınıza veya sunucunuza sıçramasını önlemek için. Sanal makine, oturum bitince tamamen siliniyor, bu da olası hasarı tek bir geçici kutuya hapsediyor.

### Sandbox beni her türlü riskten korur mu?

Hayır. Sandbox, sizin açıkça yetkilendirdiğiniz bir eylemin (örneğin yanlış dosyayı silme talimatı) sonucunu ya da bağladığınız bir connector'ın kötüye kullanılmasını önleyemez — çünkü bu ikisi de sandbox'ın koruma alanının dışında gerçekleşiyor.

### Claude Cowork ile ChatGPT Agent'ın izolasyonu arasında ne fark var?

Cowork masaüstünde hipervizörle ayrılmış bir Linux VM, bulutta ise oturum başına oluşturulup yok edilen bir sandbox kullanıyor. ChatGPT Agent standalone modda temiz bir sandbox'ta çalışırken, Atlas tarayıcısındaki "logged-in" modda zaten oturum açtığınız sitelere erişebiliyor — bu da iki platform arasında farklı bir izolasyon seviyesi anlamına geliyor.

### Ajana connector bağlarken nelere dikkat etmeliyim?

Connector'ı en az yetki ilkesiyle bağlayın (sadece gerekli izni verin), geri alınamaz işlemlerden önce yedek alın ve ajanın önerdiği değişikliği uygulamadan önce diff'i okuyun. Connector token'ları sandbox'ın dışında çalıştığı için, buradaki dikkat VM izolasyonunun yerini tutmuyor.
