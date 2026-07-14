---
title: "Claude in Chrome GA: Geliştirici Güvenlik Rehberi"
slug: "claude-in-chrome-ga-gelistirici-guvenlik-rehberi"
translationKey: "claude-in-chrome-ga"
locale: "tr"
excerpt: "Claude in Chrome 1 Temmuz 2026'da GA'ya ulaştı. İzin modelini, prompt injection riskini ve tarayıcı ajanını güvenli kullanma pratiklerini anlatıyoruz."
category: "ai"
tags: ["ai-tools", "ai-agents", "web-security", "best-practices", "claude"]
publishedAt: "2026-07-08"
seoTitle: "Claude in Chrome GA: Geliştirici Güvenlik Rehberi"
seoDescription: "Claude in Chrome 1 Temmuz 2026'da genel kullanıma açıldı. İzin modelini, prompt injection riskini ve güvenli kullanım pratiklerini ele alıyoruz."
---

Anthropic, Claude in Chrome uzantısını 1 Temmuz 2026'da sınırlı pilot aşamasından çıkarıp genel kullanıma (GA) açtı. Artık Pro, Max, Team ve etkinleştirilen Enterprise planlarındaki herkes, Claude'un sayfayı görüp sizin adınıza tıklama, yazma ve gezinme yapmasına izin verebiliyor. Geliştiriciler için asıl soru artık "bu araç ne yapabilir" değil, "hangi izinle çalıştırmalıyım."

## Pilottan GA'ya: ne değişti

Pilot dönemi boyunca Claude in Chrome, davet edilen kullanıcılarla sınırlıydı ve Anthropic ürünü kapalı bir grupta test etti. Temmuz 2026'daki GA duyurusuyla birlikte uzantı artık ücretli plan sahiplerinin tamamına açık; kurumsal müşteriler için etkinleştirme yönetici kontrolünde. Bu, ürünü "soru soran AI"dan "tarayıcınızda işlem yapan AI"ya taşıyan bir eşik: "bu sayfayı özetle" gibi pasif komutların yanında, "okunmamış Gmail'lerime bak", form doldur veya çok adımlı bir kayıt akışını tamamla gibi aktif görevler artık normal kullanım senaryosu. [Claude for Chrome ürün sayfası](https://claude.com/claude-for-chrome) bu geçişi resmî olarak duyuruyor ve GA tarihini teyit ediyor (bkz. Claude Code değişiklik günlüğü, 2.1.198 girdisi).

Bu değişim küçük bir ayrıntı değil. Bir tarayıcı uzantısına "benim adıma tıkla" yetkisi vermek, salt metin üreten bir sohbet botuna güvenmekten farklı bir risk sınıfına giriyor — çünkü artık oturum çerezleriniz, açık sekmeleriniz ve kimlik doğrulamanız devrede.

## İzin modeli: onay isteyen mi, sormadan uygulayan mı

Claude in Chrome iki modda çalışıyor ve aradaki fark, güvenlik açısından her şeyi belirliyor.

| Mod | Nasıl çalışır | Ne zaman kullanılır |
|-----|----------------|----------------------|
| Onay iste (Ask before acting) | Claude bir eylem planı hazırlar, siz onaylamadan hiçbir tıklama veya form gönderimi gerçekleşmez | Ödeme, e-posta gönderme, hesap ayarları, kimlik doğrulama gerektiren her akış |
| Sormadan uygula (Act without asking) | Claude planı kendi başına yürütür, adım adım onay beklemez | Yalnızca güvenilir, statik, düşük riskli ve kapsamı dar tutulan siteler |

Anthropic'in kendi dokümantasyonu da bunu örtük biçimde kabul ediyor: [Claude in Chrome izin rehberi](https://support.claude.com/en/articles/12902446-claude-in-chrome-permissions-guide) "sormadan uygula" modunun prompt injection'a karşı belirgin biçimde daha yüksek risk taşıdığını belirtiyor. Bunun nedeni basit — otonom mod, Claude'un okuduğu her sayfanın içeriğini örtük olarak güvenilir kabul etmesini gerektiriyor; oysa web'deki hiçbir sayfa varsayılan olarak güvenilir değildir.

Site bazlı izin modeli de bu yüzden var: Claude'un erişimini alan adı düzeyinde açıp kapatabiliyorsunuz. Pratikte bu, "her siteye aynı yetkiyi ver" yerine, iş akışınızda gerçekten ihtiyaç duyduğunuz birkaç domaine dar kapsamlı erişim tanımlamak anlamına geliyor.

## Asıl risk: prompt injection, uzantı hatası değil

Claude in Chrome'un güvenlik hikâyesini anlamlı kılan şey, pilot dönemindeki gerçek bulgular. Bağımsız güvenlik araştırmacıları, pilot sürecinde uzantıda iki ayrı zafiyet sınıfı bildirdi:

- **ShadowPrompt**: `*.claude.ai` alt alan adlarına aşırı geniş tanınan bir izin listesinin, bir CAPTCHA bileşenindeki DOM tabanlı bir XSS açığıyla zincirlenmesi. Bu kombinasyon, kötü niyetli bir sitenin Claude'a doğrudan gizli komut enjekte edebilmesine yol açabiliyordu.
- **LevelDB tabanlı izin atlatma**: Uzantının yerel depolama katmanına (LevelDB) doğrudan yazarak, kullanıcı hiçbir etkileşimde bulunmadan rastgele alan adlarını önceden onaylanmış hale getirmenin mümkün olduğu bildirildi.

Bu iki bulgu araştırmacılar tarafından pilot döneminde rapor edildi; burada onları "hâlâ açık" ya da "artık kapatıldı" diye kesin bir dille sınıflandırmıyoruz — önemli olan, bulguların işaret ettiği yapısal risk. [TechRadar'ın konuyla ilgili haberi](https://www.techradar.com/pro/security/no-clicks-no-permission-prompts-just-visit-a-page-and-an-attacker-completely-controls-your-browser-experts-warn-claude-chrome-extension-could-let-hackers-hijack-your-online-browsing) bu araştırmaların bağlamını özetliyor. Sonuç olarak bu, Claude'a özgü bir kusur listesi değil; sayfa içeriğini otonom biçimde okuyup eyleme çeviren her tarayıcı ajanının doğasında olan saldırı yüzeyi. Konuyu daha geniş çerçevede ele alan [agentjacking yazımızda](/tr/posts/agentjacking-yeni-ai-ajan-saldirisi) bu saldırı sınıfının AI ajanlarına özgü nasıl yeni bir kategori oluşturduğunu detaylandırdık.

Anthropic tarafında iki savunma katmanı öne çıkıyor: güvenilmeyen sayfa içeriği Claude'un bağlamına girmeden önce tarayan içerik sınıflandırıcıları (enjekte edilmiş komutları tespit etmek için) ve her eylem yürütülmeden önce çalışan otomatik risk taraması (şüpheli görünen adımları durdurma veya engelleme). [Claude in Chrome'u güvenli kullanma rehberi](https://support.claude.com/en/articles/12902428-use-claude-in-chrome-safely) bu mekanizmaları ve kullanıcı tarafında alınması gereken önlemleri detaylandırıyor.

## Geliştiriciler için güvenli kullanım pratiği

Tarayıcı ajanlarıyla çalışırken benimsediğimiz kural basit: "sormadan uygula" anahtarını, izinleri dar kapsamda tutana kadar bir tuzak (footgun) olarak görün. Kapsamı daraltmadan otonom modu açmak, riski azaltmak değil ertelemektir.

Aşağıdaki örnek, gerçek bir API değil — hangi mantıkla kapsam belirlemeniz gerektiğini gösteren açıklayıcı bir taslak:

```text
# Örnek: site bazlı izin kapsamı planlama (açıklayıcı taslak)

domain: docs.internal-wiki.com
  mode: act-without-asking     # statik, kullanıcı içeriği girmeyen, düşük riskli
  scope: read-and-summarize

domain: mail.google.com
  mode: ask-before-acting      # kimlik doğrulama + gönderim içeriyor
  scope: read-only-by-default

domain: *.reddit.com, herhangi bir forum / UGC sitesi
  mode: disabled                # kullanıcı üretimi içerik = injection riski yüksek
```

Somut kontrol listesi:

- **Site iznini varsayılan olarak kapalı tutun**, yalnızca gerçekten ihtiyaç duyduğunuz alan adlarını açın.
- **Kimlik doğrulama, ödeme veya e-posta gönderimi içeren her akışta "onay iste" modunu zorunlu tutun** — otonom mod burada asla makul bir seçim değil.
- **Kullanıcı üretimi içerik (forum, yorum, sosyal medya) barındıran sitelerde "sormadan uygula" modunu hiç açmayın.** Bu tür sayfalar, gizli komut enjeksiyonu için en verimli zemin.
- **Uzun süreli oturumlarda izinleri periyodik olarak gözden geçirin.** Bir görev bitince geniş kapsamlı erişimi geri daraltmak, ekleme yapmaktan daha ucuzdur.
- **Ekip içinde tarayıcı ajanı kullanımını, diğer LLM entegrasyonlarınızla aynı guardrail disipliniyle ele alın.** [Üretim için LLM guardrail kontrol listemiz](/tr/posts/uretim-icin-llm-guardrail-kontrol-listesi), bu tür girdi/çıktı filtreleme mantığını uçtan uca kurmak isteyenler için iyi bir başlangıç noktası.

Claude Code ekosisteminde subagent'lar ve arka plan ajanlarıyla çalışıyorsanız, aynı izin disiplini orada da geçerli: [Claude Code subagent rehberimizde](/tr/posts/claude-code-subagent-arka-plan-ajanlari) kapsamı dar tutulmuş görev tanımlarının neden daha güvenli olduğunu ayrıca işledik. Kendi sunucunuzda barındırdığınız ajanlarla ilgileniyorsanız [OpenClaw üzerine yazımız](/tr/posts/openclaw-kendi-sunucunda-ai-ajani-riskleri) da benzer bir izin-kapsamı mantığını farklı bir bağlamda ele alıyor.

## Ne zaman kullanmaya değer

Claude in Chrome, tekrarlayan ve iyi tanımlanmış tarayıcı görevlerinde gerçek zaman kazandırıyor: dokümantasyon taraması, rutin form doldurma, birden fazla sekmede bilgi toplama. Riskli olan kısım araç değil, kapsamı belirsiz bırakmak. GA duyurusuyla birlikte artık daha fazla geliştirici bu kararı vermek zorunda kalacak; doğru varsayılan, her yeni site için izni sıfırdan ve dar başlatmak olmalı. Daha geniş yapay zeka gündemini takip etmek isterseniz [Yapay Zeka kategorimize](/tr/category/yapay-zeka) göz atabilirsiniz.

## Sıkça Sorulan Sorular

### Claude in Chrome hangi planlarda kullanılabilir?

Temmuz 2026 itibarıyla Pro, Max ve Team planlarındaki kullanıcılar Claude in Chrome'a erişebiliyor; Enterprise müşterilerinde özellik yönetici tarafından etkinleştirilmeli. Ücretsiz planda uzantı yer almıyor.

### "Sormadan uygula" modunu hiç kullanmamalı mıyım?

Tamamen kullanmayın demiyoruz; kapsamı sıkı tuttuğunuz, statik ve düşük riskli sitelerde makul bir seçim olabilir. Ama kimlik doğrulama, ödeme veya e-posta gibi hassas akışlarda ve kullanıcı üretimi içerik barındıran sitelerde bu modu açmamanızı öneririz.

### ShadowPrompt ve LevelDB açıkları hâlâ geçerli mi?

Bu bulgular pilot dönemi içinde bağımsız araştırmacılar tarafından raporlandı. Bunları güncel, yamalanmamış bir tehdit olarak değil, tarayıcı ajanı ürünlerinin genel saldırı yüzeyine dair somut bir uyarı örneği olarak okumak daha doğru. Güncel durumu teyit etmek için Anthropic'in güvenlik dokümantasyonunu kontrol edin.

### Claude in Chrome ile başka bir tarayıcı otomasyon aracı arasındaki fark ne?

Temel fark, içerik sınıflandırıcıları ve eylem-riski taraması gibi yerleşik savunma katmanları; ancak bu katmanlar riski sıfırlamıyor, azaltıyor. Herhangi bir tarayıcı ajanında olduğu gibi, nihai güvenlik sorumluluğu izin kapsamını doğru belirlemekte kullanıcıda kalıyor.
