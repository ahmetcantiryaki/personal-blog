---
title: "Küçük İşletmeler İçin Claude: 43 İş Akışı, 27 Entegrasyon"
slug: "kucuk-isletmeler-icin-claude-workflow"
translationKey: "claude-small-business-workflows-2026"
locale: "tr"
excerpt: "Claude for Small Business eklentisi Eylül 2026 itibarıyla 43 iş akışı ve 27 yeni entegrasyona ulaştı; her adım sizin onayınızı bekleyerek çalışır."
category: "business"
tags: [claude, automation, saas, workflow, integration]
publishedAt: "2026-09-22"
seoTitle: "Küçük İşletmeler İçin Claude: 43 İş Akışı, 27 Entegrasyon"
seoDescription: "Claude for Small Business eklentisi Eylül 2026'da 43 iş akışı ve 27 yeni entegrasyona ulaştı; onay bekleyen adımlarla çalışır, kurulumu 10 dakika sürer."
---

Kısa cevap: Claude for Small Business, Anthropic'in küçük işletme sahiplerine yönelik eklentisidir; Eylül 2026 güncellemesiyle 43 hazır iş akışına ve 27 yeni entegrasyona ulaştı, Claude Cowork masaüstü uygulaması içinde çalışır ve her adımda işletme sahibinin onayını bekler. Kurulum tek komutla başlar, ücretsiz eklenti olarak mevcut Claude aboneliğine dahildir.

Bu yazıda tek bir gerçek kurulumu adım adım anlatıyorum: eklentiyi kurmak, araçları bağlamak, önce hangi üç iş akışının kurulmaya değer olduğunu ve onay mekanizmasının pratikte nasıl işlediğini.

## Eylül 2026 güncellemesi tam olarak ne getirdi?

15 Eylül 2026'da Anthropic, Mayıs 2026'da tanıttığı Claude for Small Business eklentisini genişletti: iş akışı sayısı 43'e, yeni bağlanabilir araç sayısı ise 27'ye çıktı. Bu rakamları [Anthropic'in kendi duyurusu](https://www.anthropic.com/news/claude-for-small-business) ve [Unite.AI'nin bağımsız haberi](https://www.unite.ai/anthropic-adds-43-workflows-27-integrations-to-claude-for-small-business/) doğruluyor. Eklenti Mayıs'tan bu yana 900 binin üzerinde kurulum aldı ([Forbes, Eylül 2026](https://www.forbes.com/sites/boazsobrado/2026/09/15/anthropic-puts-claude-on-small-business-sales-after-900000-installs/)).

Yeni entegrasyonlar arasında Shopify, Salesforce, TikTok, Atlassian, Zoom, Xero, Gusto, Square, Stripe ve Zapier bulunuyor. Bunlar mevcut QuickBooks, PayPal, HubSpot, Canva, DocuSign, Google Workspace ve Microsoft 365 bağlantılarının üzerine ekleniyor. Güncellemeyle birlikte Anthropic, sonbahar boyunca sürecek ücretsiz atölye çalışmaları ve ortak web seminerleri de duyurdu.

## Claude for Small Business gerçekte nasıl çalışıyor?

Eklenti bağımsız bir uygulama değil; Claude Cowork içinde çalışan bir eklenti paketidir. Cowork, Claude'un dosyalarınızla ve bağladığınız araçlarla doğrudan çalıştığı masaüstü uygulamasıdır.

Kurulum üç adımdan oluşuyor. Önce eklentiyi Cowork'ten kuruyorsunuz. Sonra Claude'a "kurulumda yardım et" diyorsunuz veya doğrudan `/smb-onboard` komutunu çalıştırıyorsunuz; bu komut hangi araçları kullandığınızı soruyor ve bağlantı adımlarında yol gösteriyor. Son olarak, önerilen iş akışlarından birini seçip bir çalışma takvimi belirliyorsunuz — örneğin "her pazartesi sabah 08:00'de" gibi.

```bash
# Cowork içinde onboarding komutu
/smb-onboard
```

Eklenti ayrı bir ücret gerektirmiyor; Claude Pro (20 dolar/ay), Max (100-200 dolar/ay) veya Team (koltuk başına 25-30 dolar/ay) planlarından herhangi birine dahil. Ödediğiniz şey Claude aboneliği, eklenti üzerine biniyor.

Bağlantı adımında dikkat edilmesi gereken bir nokta var: her araç için ayrı bir OAuth izni veriyorsunuz, yani Claude'a Stripe hesabınıza tam erişim yerine yalnızca okuma veya belirli işlem türleri için izin tanımlayabiliyorsunuz. Muhasebeci veya ortak hesabınız varsa, izinleri kimin verdiğini ve hangi kapsamda verdiğini kaydetmek işe yarıyor; birkaç hafta sonra "bu bağlantıyı kim açtı" sorusunu sormak istemezsiniz.

## İlk kurulmaya değer üç iş akışı hangileri?

Kısa cevap: haftalık finansal özet, mesai dışı lead nitelendirme ve teklif yazma — çünkü bunlar hem sık tekrar eden hem de doğrudan gelire dokunan işler.

**Haftalık Özet (The Weekly Brief)**, nakit durumunu, satışları, boru hattını ve vadesi geçmiş faturaları tek sayfada toplar. Xero veya QuickBooks'a bağlıysanız Claude bu raporu her pazartesi otomatik hazırlar ve e-posta taslağı olarak sunar.

**Lead Nitelendirme**, mesai dışı gelen soruları yanıtlar, nitelendirir ve CRM'e (Salesforce veya HubSpot) kaydeder. Bir müşteri gece 23:00'te WhatsApp'tan veya web formundan yazdığında, Claude soruları sorar, bütçe ve zaman çizelgesini öğrenir, ertesi sabah size özet sunar.

**Teklif Yazma**, bir sesli notu fiyatlandırılmış, markalı bir teklife dönüştürür. Saha ziyareti sonrası aracınızda kaydettiğiniz bir sesli memo, Claude tarafından yapılandırılmış bir PDF teklife çevrilir ve DocuSign ile imzaya hazır hale getirilir.

Bunların dışında pazarlama takvimi hazırlama ve muhasebe mutabakatı da yüksek değerli seçenekler, ama ilk üçü nakit akışına en hızlı dokunanlar. Benzer bir kurulumu düşünüyorsanız, önce tek bir iş akışını iki hafta boyunca izleyip taslakların kalitesini kontrol etmek, sonra ikinciyi eklemek daha sağlıklı bir yol.

| İş akışı | Ana entegrasyon | Ne üretir |
|---|---|---|
| Haftalık Özet | Xero, QuickBooks, Stripe | Nakit, satış, vadesi geçmiş fatura raporu |
| Lead Nitelendirme | Salesforce, HubSpot, Zapier | Nitelendirilmiş, CRM'e işlenmiş lead |
| Teklif Yazma | DocuSign, Google Workspace | Fiyatlandırılmış, markalı teklif taslağı |
| Pazarlama Takvimi | Canva, TikTok, Zoom | Haftalık gönderi ve yorum yanıt taslakları |
| Muhasebe Mutabakatı | QuickBooks, Xero, Square | Kapanış paketi, muhasebeciye hazır özet |

## Claude işlemi otomatik mi yapıyor, yoksa önce soruyor mu?

Hayır, otomatik yapmıyor. Varsayılan olarak her iş akışı onay modunda başlar: Claude taslağı hazırlar ve bekletir, siz onaylamadan hiçbir şey gönderilmez, paylaşılmaz veya ödenmez. Bu, [Anthropic'in kendi duyurusunda](https://claude.com/blog/claude-for-small-business-launches-new-workflows-integrations-and-training-programs) ve bağımsız incelemelerde tutarlı biçimde vurgulanan bir tasarım kararı.

Pratikte bu şu anlama geliyor: Claude bir teklifi hazırlar ama e-postayı sizin "gönder" demenizden önce yollamaz; bir faturayı Stripe'ta işaretler ama ödeme talebini sizin onayınız olmadan tetiklemez. Görev bazında onay modunu kapatıp tam otomasyona geçmek mümkün, ama Anthropic bunu düşük riskli, tekrarlayan görevler (örneğin haftalık rapor oluşturma) için öneriyor; ödeme veya sözleşme gönderme gibi geri alınamaz adımlarda onay modunu açık bırakmak daha mantıklı.

Benim gözlemim şu: onay adımı ilk hafta biraz yavaşlatıcı geliyor çünkü her taslağı okuyup onaylamanız gerekiyor. Ama tam da bu sürtünme, yanlış giden bir e-postanın veya hatalı bir faturanın müşteriye ulaşmasını engelliyor — küçük bir işletme için bu, hızdan daha değerli.

## Sınırlar ve maliyet nedir?

Eklentinin kendisi ücretsiz ama bağlı olduğunuz Claude planının kullanım limitlerine tabisiniz; yoğun haftalık raporlama ve çok sayıda lead nitelendirme, Pro planın mesaj limitlerini hızlıca zorlayabilir. 27 yeni bağlantı önemli bir genişleme olsa da, sektöre özgü nişe araçlar (örneğin bazı dikey SaaS ürünleri) hâlâ kapsam dışında kalabiliyor; bu durumda Zapier köprüsü üzerinden dolaylı bağlantı gerekebilir.

Eklenti şu an yalnızca Cowork masaüstü uygulamasında çalışıyor; mobil veya tarayıcı üzerinden aynı iş akışlarına erişim yok. Ekibinizde birden fazla kişi aynı iş akışlarını kullanacaksa Team planı, koltuk başına maliyeti nedeniyle daha mantıklı olabilir.

Açıkçası benim asıl çekincem sayılarla ilgili değil, alışkanlıkla ilgili: 43 iş akışının hepsini aynı anda açmak cazip geliyor ama onay kutusunu her gün 15 kez tıklamak, üç ay sonra kimsenin okumadığı bir rutine dönüşüyor. Az sayıda iş akışıyla başlayıp onay adımını gerçekten okuduğunuzdan emin olmak, otomasyonun asıl amacını — hataları yakalamayı — koruyor.

Claude'un ajans tarafındaki geniş otomasyon eğilimini [Claude Zamanlanmış Görevlerle Otomasyon Nasıl Kurulur?](/tr/posts/claude-zamanlanmis-gorevler-otomasyon) yazısında daha ayrıntılı işledik. Pazarlama tarafında benzer bir kurulum için [Claude Cowork ile Haftalık Pazarlama Raporu](/tr/posts/claude-cowork-haftalik-pazarlama-raporu) yazısı da faydalı bir referans. AI ajanı mı yoksa sabit iş akışı mı kullanmanız gerektiğine karar veremiyorsanız [AI Agent mı Workflow mu: Hangisi Ne Zaman](/tr/posts/ai-agent-mi-workflow-mu) yazısına bakabilirsiniz.

## Sıkça Sorulan Sorular

### Claude for Small Business kaç iş akışı ve entegrasyon içeriyor?

Eylül 2026 itibarıyla eklenti 43 hazır iş akışı ve toplamda 27 yeni entegrasyon (Shopify, Salesforce, Xero, Square, Stripe, Zapier dahil) sunuyor; bunlar QuickBooks, HubSpot, Canva gibi mevcut bağlantıların üzerine ekleniyor. Sayılar Anthropic'in 15 Eylül 2026 duyurusuyla doğrulandı.

### Claude for Small Business ücretli mi?

Hayır, eklentinin kendisi ayrı bir ücret gerektirmiyor. Claude Pro (20 dolar/ay), Max (100-200 dolar/ay) veya Team (koltuk başına 25-30 dolar/ay) planlarından birine sahipseniz Cowork içinden ücretsiz etkinleştirebilirsiniz.

### Claude for Small Business hangi uygulamada çalışıyor?

Eklenti Claude Cowork masaüstü uygulaması içinde çalışıyor; Claude'un dosyalarınıza ve bağladığınız araçlara doğrudan erişebildiği ortam bu. Şu an mobil veya tarayıcı sürümünde aynı iş akışlarına erişim bulunmuyor.

### Claude işlemleri onaysız mı gerçekleştiriyor?

Hayır. Varsayılan ayar onay modudur: Claude her görevi taslak olarak hazırlar ve sizin onayınızı bekler, hiçbir e-posta gönderilmez, ödeme yapılmaz veya paylaşım yapılmaz. Onay modunu görev bazında kapatmak mümkün, ama geri alınamaz işlemlerde açık bırakmak öneriliyor.
