---
title: "Kişisel Prompt Kütüphanesi Nasıl Kurulur?"
slug: "kisisel-prompt-kutuphanesi-nasil-kurulur"
translationKey: "personal-prompt-library-system"
locale: "tr"
excerpt: "Kısa cevap: prompt'ları değişken alanlı şablonlar hâlinde, araçtan bağımsız bir depoda (not uygulaması ya da Git deposu) saklayıp platforma göre adapte edin."
category: "career-productivity"
tags: ["prompt-engineering", "productivity", "workflow", "ai-tools"]
publishedAt: "2026-08-20"
seoTitle: "Kişisel Prompt Kütüphanesi Nasıl Kurulur?"
seoDescription: "Kısa cevap: prompt'ları görev tipine göre değişken alanlı şablonlar hâlinde, araçtan bağımsız bir depoda saklayıp her platform için ayrı adapte edin."
---

Kısa cevap: iyi bir prompt kütüphanesi, sık kullandığınız görevleri değişken alanlı şablonlara dönüştürüp bunları tek bir araca kilitlenmeden saklayan bir sistemdir — Claude'un Projects'i, ChatGPT'nin Projects'i veya Gemini'nin Gems'i gibi yerleşik özellikler bu sistemin bir katmanı olabilir, ama tek başına yeterli değildir çünkü hiçbiri diğerine taşınmaz.

## Neden aynı prompt'u tekrar tekrar yazmak yerine kütüphane kurmalıyım?

Her seferinde sıfırdan yazdığınız prompt, önceki denemede bulduğunuz iyi ifadeyi, doğru kısıtları ve işe yarayan örnek formatını kaybeder. Bir hafta önce mükemmelleştirdiğiniz "müşteri e-postasına yanıt taslağı" prompt'unu bugün yeniden icat etmek zaman kaybıdır ve genelde daha kötü bir sonuç verir.

Kaydedilmiş bir prompt üç şeyi korur: modelin en iyi yanıt verdiği tam ifadeyi, hangi kısıtların gerekli olduğunu ve çıktının hangi formatta beklendiğini. Bunları her seferinde hafızanızdan yeniden kurmaya çalışmak, aynı Excel formülünü her ay elle yeniden yazmaya benzer — teknik olarak mümkün, pratik olarak anlamsız. Prompt mühendisliği tekniklerinin kendisini öğrenmek istiyorsanız [prompt mühendisliği teknikleri](/tr/posts/prompt-muhendisligi-teknikleri) yazısına bakabilirsiniz; bu yazı ise o teknikleri bir kez yazıp tekrar tekrar kullanılabilir hâle getiren depolama sistemiyle ilgileniyor.

## Kişisel prompt kütüphanesi nasıl yapılandırılır?

Kütüphaneyi görev tipine göre klasörleyin ve her prompt'u değişken alanlı bir şablona dönüştürün; böylece aynı prompt'u farklı içerikler için yeniden yazmak yerine sadece değişkenleri doldurursunuz. Pratikte üç seviye işe yarıyor: görev kategorisi (ör. "e-posta", "kod incelemesi", "sosyal medya"), şablon adı ve içindeki `{degisken}` alanları.

Değişken alanları köşeli parantez ya da süslü parantez ile işaretlemek — `{ton}`, `{hedef_kitle}`, `{kelime_sayisi}` gibi — kütüphaneyi bir kez yazıp sonsuz kez özelleştirilebilir hâle getirir. Bir şablonun altına, hangi bağlamda işe yaradığına dair bir veya iki cümlelik not eklemek, altı ay sonra o prompt'u neden yazdığınızı hatırlamanızı sağlar. Sosyal medya içerikleri için tekrar eden prompt yapıları kurmak istiyorsanız [Claude ile sosyal medya kullanımı](/tr/posts/sosyal-medya-icin-claude-kullanimi) rehberi somut örnekler veriyor.

## Prompt'ları nerede saklamalıyım: Projects, Gems, Skills mi, not uygulaması mı?

Ağustos 2026 itibarıyla hiçbir sağlayıcı tam anlamıyla taşınabilir bir prompt kütüphanesi formatı sunmuyor, bu yüzden birden fazla araçla çalışıyorsanız asıl kütüphane araçtan bağımsız bir yerde (not uygulaması, Git deposu, tablo veya snippet yöneticisi) yaşamalı ve her platforma özel adaptasyon oradan türetilmeli. Vendor içi özellikler ise günlük kullanım için hızlı erişim katmanı sağlar.

Claude'da iki farklı katman var: [Projects](https://support.claude.com), bir çalışma alanına bağlı kalıcı talimatlar ve dosyalardır; Skills ise şablonlar ve karar kuralları içeren, göreve uyduğunda Claude'un otomatik uyguladığı paketlenmiş talimat modülleridir ve kısa bir sistem promptu alanından çok daha fazla ayrıntı taşıyabilir. ChatGPT tarafında Projects benzer bir kalıcı bağlam görevi görürken, Custom GPT'ler yaklaşık 8.000 karakterlik bir sistem promptu, isteğe bağlı dosya bilgisi ve isteğe bağlı Actions/API entegrasyonu sunuyor. Temmuz 2026'da OpenAI, [ChatGPT özel talimatlar](https://help.openai.com) karakter sınırını Plus, Pro, Business, Enterprise ve Education planlarında 1.500'den 5.000 karaktere çıkardı — bu, kütüphanenizin ne kadarını hep-açık talimat olarak gömebileceğinizi doğrudan etkiliyor. Gemini'de bu katmana [Gems](https://gemini.google.com/) deniyor: yaklaşık 4.000 karakterlik bir sistem promptu artı isteğe bağlı bilgi dosyaları, Gemini uygulaması ve Google Workspace içinde yaşıyor.

| Depolama yeri | Taşınabilirlik | Versiyonlama | Ekiple paylaşım |
|---|---|---|---|
| Claude Projects / Skills | Düşük — Claude'a özel | Manuel (dosya geçmişi) | Çalışma alanı içinde kolay |
| ChatGPT Projects / Custom GPT | Düşük — ChatGPT'ye özel | Manuel | Organizasyon içinde kolay |
| Gemini Gems | Düşük — Gemini'ye özel | Manuel | Workspace içinde kolay |
| Not uygulaması (Notion, Obsidian) | Yüksek — kopyala-yapıştır her yere gider | Sınırlı, sürüm geçmişi eklentiye bağlı | Bağlantı paylaşımıyla orta |
| Git deposu (.md dosyaları) | Yüksek — düz metin, her yere taşınır | Native — commit geçmişi tam versiyon kontrolü | Pull request ile yüksek, teknik ekip gerektirir |
| Snippet yöneticisi (Raycast, Alfred, TextExpander) | Orta — dışa aktarım formatları değişken | Araca bağlı, genelde zayıf | Genelde tekil kullanıcıya özel |

Pratik yaklaşım şu: en sık kullandığınız üç ila beş prompt'u ilgili vendor özelliğine gömün, tüm kütüphanenin asıl kopyasını ise Git deposu veya not uygulamasında tutun. Bu, hem hız hem taşınabilirlik kazandırır.

## Prompt'ları ekiple nasıl versiyonlar ve paylaşırım?

Bir prompt'u ekiple paylaşmak, onu bir kere Slack'te göndermek değil, üzerinde değişiklik yapıldığında herkesin haberdar olduğu bir kaynağa dönüştürmektir. Git deposunda `.md` dosyaları kullanmak buna en doğal çözümü verir: her prompt değişikliği bir commit, her büyük revizyon bir pull request olur ve kim neyi neden değiştirdiği diff üzerinden görülür.

Versiyon başlıklarına tarih ve kısa bir değişiklik notu eklemek (`# musteri-eposta-yaniti v3 — 2026-08-15, ton netlestirildi`) altı ay sonra hangi sürümün neden tercih edildiğini hatırlatır. Ekip küçükse paylaşımlı bir Notion sayfası da yeterli olabilir, ama versiyon geçmişi ve çakışma çözümü istiyorsanız Git'in sunduğu native takip mekanizmasının alternatifi yok.

## Hangi prompt'ların işe yaradığını nasıl ölçerim?

Bir prompt'un "iyi" olduğunu söylemek yetmez; kaç kez düzenlemeden kullanıldığını, kaç kez yeniden yazmanız gerektiğini ve çıktının hedef formata kaç denemede ulaştığını takip etmek gerekir. Basit bir yöntem, her prompt şablonunun yanına kullanım sayacı ve son kullanım tarihi eklemektir — üç ay boyunca hiç kullanılmayan bir şablon muhtemelen kütüphaneden çıkarılmalıdır.

Daha ayrıntılı ölçüm isteyenler için her kullanımdan sonra bir ile beş arası hızlı bir kalite notu düşmek (çıktı doğrudan kullanılabilir mi, orta düzeyde düzenleme mi gerekti, sıfırdan mı yazıldı) zamanla hangi şablonların gerçekten zaman kazandırdığını netleştirir. Bu, tekrar eden bir SEO içerik sürecinde özellikle işe yarar; [Claude ile SEO yazı sistemi](/tr/posts/claude-ile-seo-yazi-sistemi) yazısı, ölçülebilir bir prompt sürecinin nasıl kurulacağına dair somut bir örnek sunuyor.

## Prompt'ları Claude, ChatGPT ve Gemini arasında nasıl taşınabilir tutarım?

Prompt'un mantığını (görev tanımı, kısıtlar, değişkenler) araçtan bağımsız düz metin olarak yazın, ardından her platform için birkaç satırlık bir "adapter" ekleyin — çünkü format ve karakter sınırları üç sağlayıcıda da farklı. Örneğin Claude Skills'te ayrıntılı karar kuralları ve örnek dosyalar barındırabileceğiniz bir prompt, ChatGPT'nin 5.000 karakterlik özel talimat alanına veya Gemini Gems'in yaklaşık 4.000 karakterlik sistem promptuna sığdırılmak için kısaltılmalı.

Claude tarafında bu ayrıntı seviyesini [Skills dokümantasyonu](https://docs.claude.com) tanımlıyor. Ağustos 2026 itibarıyla üç sağlayıcının hiçbiri diğerinin formatını doğrudan içe aktarmıyor, bu yüzden "bir kere yaz, her yere yapıştır" hâlâ gerçekçi değil — gerçekçi olan, tek bir kaynak metni tutup her araç için kısa bir dönüştürme kuralı uygulamak. İçerik üretim araçları arasında seçim yaparken hangi platformun hangi güçlü yanı olduğunu görmek isterseniz [içerik üreticiler için Claude, ChatGPT, Gemini karşılaştırması](/tr/posts/icerik-ureticiler-claude-chatgpt-gemini) yazısına bakabilirsiniz.

Kişisel görüşüm şu: çoğu insan henüz beş tane bile kaydedilmeye değer prompt'u yokken kütüphane sistemini aşırı mühendislik hâline getiriyor — etiketleme şemaları, klasör hiyerarşileri ve otomasyon script'leri kurmadan önce, gerçekten haftada birkaç kez yazdığınız üç prompt'u bulup onları değişken alanlı hâle getirmek yeterli bir başlangıçtır.

## Taşınabilir bir prompt şablonu nasıl görünür?

Aşağıdaki gibi düz metin bir şablon, hem Git deposunda hem de kopyala-yapıştır ile herhangi bir sohbet aracında çalışır:

```text
# Şablon: musteri-eposta-yaniti
# Kullanım: {kanal} üzerinden gelen {konu_turu} taleplerine yanıt taslağı
# Son güncelleme: 2026-08-15

Sen {sirket_adi} adına müşteri destek yanıtı yazan bir asistansın.

Görev: Aşağıdaki müşteri mesajına {ton} bir tonda, en fazla
{kelime_sayisi} kelimelik bir yanıt taslağı yaz.

Kısıtlar:
- İade politikasından bahsetme, sadece {konu_turu} ile ilgili bilgi ver.
- Yanıtın sonuna tek bir net eylem adımı ekle.

Müşteri mesajı:
{musteri_mesaji}
```

## Başlangıç şablon seti: hemen kullanabileceğiniz dört prompt

Kütüphaneyi sıfırdan kurmak yerine şu dört şablonla başlayın, sonra kendi ihtiyaçlarınıza göre çoğaltın:

1. **E-posta/mesaj yanıtı** — `{alici_tonu}`, `{konu}`, `{kelime_siniri}` değişkenleriyle, iş yazışmaları için hızlı taslak üretir.
2. **Toplantı özeti** — `{katilimcilar}`, `{ana_kararlar}`, `{aksiyon_sahipleri}` alanlarıyla, transkript veya notları eylem maddelerine çevirir.
3. **İçerik taslağı iskeleti** — `{konu}`, `{hedef_kitle}`, `{ton}`, `{uzunluk}` değişkenleriyle, blog veya sosyal medya gönderisi için ilk taslak çıkarır.
4. **Kod inceleme kontrol listesi** — `{dil}`, `{odak_alani}` (güvenlik, performans, okunabilirlik) değişkenleriyle, bir diff'i belirli bir açıdan gözden geçirir.

## Sıkça Sorulan Sorular

### Prompt kütüphanesi ile prompt mühendisliği arasındaki fark nedir?

Prompt mühendisliği, tek bir prompt'un içeriğini iyileştirme tekniğidir (rol verme, örnek ekleme, adım adım düşündürme); prompt kütüphanesi ise bu iyileştirilmiş prompt'ları saklayıp tekrar kullanılabilir hâle getiren depolama ve organizasyon sistemidir. Biri tek seferlik yazım kalitesiyle, diğeri uzun vadeli tekrar kullanılabilirlikle ilgilenir.

### Kaç prompt biriktirince kütüphane kurmaya değer?

Belirli bir eşik yok, ama pratik işaret şudur: aynı prompt'u üçüncü kez elle yeniden yazdığınızda kaydetmeye değer demektir. Beşten az prompt için karmaşık bir klasör yapısı veya etiketleme sistemi kurmak, o zamanı gerçek şablon yazmaya harcamaktan daha az verimlidir.

### Prompt kütüphanemi ekip içinde nasıl paylaşırım?

En basit yol, prompt'ları `.md` dosyaları olarak bir Git deposunda tutup değişiklikleri pull request ile gözden geçirmektir; küçük ekipler için paylaşımlı bir Notion sayfası da yeterli olabilir. Claude Projects, ChatGPT Projects veya Gemini Gems gibi vendor içi özellikler ise çalışma alanı içinde hızlı paylaşım sağlar ama dışa aktarımı sınırlıdır.

### Aynı prompt'u Claude, ChatGPT ve Gemini'de kullanabilir miyim?

Prompt'un mantığını taşıyabilirsiniz ama format farklı olacaktır: Claude Skills daha ayrıntılı talimat modülleri kabul ederken, ChatGPT'nin özel talimat alanı 5.000 karakterle, Gemini Gems'in sistem promptu ise yaklaşık 4.000 karakterle sınırlıdır. Ağustos 2026 itibarıyla hiçbir sağlayıcı diğerinin formatını otomatik içe aktarmadığı için her platform için kısa bir uyarlama gerekir.
