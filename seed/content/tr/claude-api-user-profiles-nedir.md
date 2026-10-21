---
title: "Claude API User Profiles Nedir?"
slug: "claude-api-user-profiles-nedir"
translationKey: "claude-api-user-profiles-2026"
locale: "tr"
excerpt: "Kısa cevap: User Profiles, Claude API isteklerini son müşterilerinize bağlar; bir güvenlik ihlali artık tüm organizasyonu değil tek müşteriyi etkiler."
category: "ai"
tags: ["claude", "api-design", "ai-infrastructure", "saas", "compliance"]
publishedAt: "2026-10-21"
seoTitle: "Claude API User Profiles Nedir?"
seoDescription: "Kısa cevap: User Profiles, Claude API isteklerini son müşterilerinize bağlar; bir güvenlik ihlali artık tüm organizasyonu değil tek müşteriyi etkiler."
---

Kısa cevap: User Profiles, 20 Ekim 2026'da yayınlanan bir Claude API özelliği; her isteği hangi son müşteriniz adına gönderdiğinizi Anthropic'e bildirmenizi sağlıyor. Bunu yapmadan önce bir güvenlik ihlali tüm organizasyonunuzu etkileyebiliyordu; artık yalnızca ilgili son müşterinin erişimini kısıtlıyor, geri kalan trafiğiniz dokunulmadan devam ediyor.

## Bu özellik hangi sorunu çözüyor?

Claude üzerine bir platform, gateway veya yeniden satış katmanı kurduysanız, tüm son müşterilerinizin trafiği tek bir Anthropic organizasyonu üzerinden geçer. Anthropic, API trafiği üzerinde otomatik güvenlik sınıflandırıcıları çalıştırıyor; profil bilgisi olmadan gönderilen bir istekte, tek bir son müşterinin kötüye kullanımı sizin organizasyonunuzun tamamına uygulanan bir yaptırıma yol açabiliyor. Bu, tek bir kötü niyetli kullanıcının yüzlerce iyi niyetli müşterinizi de etkileyebildiği anlamına geliyor. Bir müşteri destek botu, bir kod asistanı veya bir içerik üretim aracı gibi API'yi kendi ürününüzün arkasında müşterilerinize sunan her ekip bu riski taşıyor; sorun büyüklüğü, müşteri sayınızla birlikte doğrusal olarak büyüyor.

## User Profiles nasıl oluşturulur ve bir isteğe nasıl eklenir?

Her son müşteri için bir kez `POST /v1/user_profiles` çağırır, dönen `uprof_` ID'sini kendi müşteri kaydınızda saklarsınız. Sonrasında o müşteri adına gönderdiğiniz her istekte bu ID'yi `anthropic-user-profile-id` başlığında yollarsınız. Profil oluşturmak ücretsiz; profiller faturalandırmayı veya fiyatlandırmayı etkilemiyor.

```bash
# Her son müşteri için bir kez: profil oluştur
curl https://api.anthropic.com/v1/user_profiles \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{"name": "Acme Analytics, Inc.", "access_type": "passthrough"}'

# Her istekte: profil ID'sini başlıkta gönder
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-user-profile-id: $PROFILE_ID" \
  -d '{"model": "claude-opus-5-5", "max_tokens": 1024, "messages": [...]}'
```

Resmi SDK'lar ve `ant` CLI, bu başlığı sizin için `user_profile_id` parametresiyle otomatik ekliyor; başlığı elle yazmanız gerekmiyor. Python SDK'yı henüz 1.0'a yükseltmediyseniz [SDK geçiş rehberimiz](/tr/posts/anthropic-python-sdk-v1-gecis-rehberi) hangi çağrıların değiştiğini gösteriyor; `user_profile_id` parametresi her iki sürümde de aynı şekilde çalışıyor.

## application ve passthrough access_type arasındaki fark nedir?

`access_type` alanı, profilin kimi temsil ettiğini belirliyor. Varsayılan değer `application`: ürününüze kayıt olan bireysel bir kullanıcıyı temsil eder. `passthrough` ise bir gateway üzerinden API erişimi yeniden sattığınız bir şirketi temsil eder; bu durumda şirket içindeki her kişi için ayrı profil açmazsınız, tek bir şirket profili yeterli.

| access_type | Neyi temsil eder | Varsayılan mı? |
|---|---|---|
| `application` | Ürününüze kayıtlı bireysel bir kullanıcı | Evet |
| `passthrough` | API erişimi yeniden sattığınız bir şirket | Hayır, elle belirtilir |
| Profil yok | Kendi organizasyonunuzun dahili kullanımı | — |

Bir `passthrough` profil altında tek bir kişi isteği gönderiyorsa, o kişiyi ayırt etmek için Anthropic'e ayrıca Messages isteğinin kendi `metadata.user_id` alanında bir tanımlayıcı gönderebilirsiniz; bu, profilin `metadata` alanından farklı, isteğin kendi metadata'sı.

## Bir son müşteri kısıtlanırsa veya yasaklanırsa ne olur?

Yaptırım, yalnızca o profilin ID'sinin gönderildiği isteklere uygulanıyor; profilsiz veya başka bir profille gönderdiğiniz trafik etkilenmiyor. Bu, User Profiles'ın asıl değeri: eskiden "bir müşteri kötüye kullandı, tüm organizasyon kısıtlandı" senaryosu, artık "bir müşteri kötüye kullandı, sadece o müşteri kısıtlandı" senaryosuna dönüşüyor.

## Organization webhooks ne zaman devreye girer?

Aynı 20 Ekim duyurusunda, Admin API'ye beta olarak eklenen organization webhooks, bir profil kısıtlandığında veya yasaklandığında, bu durum sona erdiğinde sizi bildiriyor. `webhooks-2026-10-07` beta başlığını kullanıyor ve erişim için Anthropic hesap ekibinizle iletişime geçmeniz gerekiyor. Bu webhook'lar olmadan bir kısıtlamayı ancak o müşterinin isteklerinin başarısız olmaya başlamasından fark edersiniz; webhook'larla bildirim anında geliyor. Beta erişimi şu an davetle sınırlı olduğundan, erişiminiz onaylanana kadar bu durumu periyodik olarak kendi loglarınızdan `400` hata oranındaki ani sıçramaları izleyerek dolaylı yoldan tespit etmeniz gerekebilir.

## User Profiles, Inference Hooks'tan farklı mı?

Evet, ikisi farklı amaçlara hizmet ediyor. [Inference hooks rehberimizde](/tr/posts/claude-inference-hooks-guvenlik-sunucusu) ele aldığımız gibi inference hooks, her isteği kendi güvenlik sunucunuzdan geçirip gerçek zamanlı olarak onaylama veya reddetme imkanı veriyor; bu da 20 Ekim'de Enterprise organizasyonları için beta'dan çıktı. User Profiles ise isteği değiştirmiyor, sadece kime ait olduğunu etiketliyor; ikisini birlikte kullanmak, hem gerçek zamanlı kontrol hem de ihlal sonrası hedefli yaptırım sağlıyor.

## Amazon Bedrock ve Google Cloud'da nasıl çalışır?

Profilleri yalnızca Claude API veya Claude Platform on AWS üzerinde oluşturabilirsiniz; Bedrock ve Google Cloud'da `/v1/user_profiles` uç noktaları yok. Oluşturduğunuz profilin ID'sini Bedrock'ta isteğin gövdesinde üst seviye bir `user_profile_id` alanı olarak, Google Cloud'da ise aynı `anthropic-user-profile-id` başlığıyla gönderirsiniz. Önemli bir fark: Bedrock ve Google Cloud, ID'nin formatını kontrol eder ama profilin gerçekten var olup olmadığına bakmaz; bu yüzden hatalı bir ID'yle gönderilen istek burada sessizce kabul edilebilir, Claude API'de ise `400` hatasıyla reddedilir.

## Bir müşteri hesabını kapattığında profili silmek yeterli mi?

Hayır, sadece silmek tek başına yeterli değil; önce o müşterinin isteklerinde profil ID'sini göndermeyi durdurmanız gerekiyor. `DELETE /v1/user_profiles/{id}` çağrısı profili ve gönderdiğiniz tüm bilgileri (ad, harici kullanıcı detayları, metadata) kalıcı olarak siler, ama Anthropic'in o ID hakkında tuttuğu güven ve güvenlik kayıtlarını silmez. Silme işleminden sonra yaklaşık 10 dakika boyunca o ID'yle gönderilen istekler hâlâ başarılı olabilir; bu pencere kapandıktan sonra aynı ID'yle gelen istekler `400` hatasıyla reddedilir. Müşteri sizinle çalışmayı sürdürüyor ama verisinin silinmesini istediyse, doğru sıra yeni bir profil açıp ID'yi değiştirmek, ardından eskisini silmek.

## Bu özellik kimin için önemli?

Esas olarak Claude API üzerine bir platform, SaaS ürünü veya gateway kuran ekipler için önemli; kendi iç kullanımınız için API'yi doğrudan çağırıyorsanız bu özelliğin size doğrudan bir faydası yok, çünkü zaten tek bir "müşteri" sizsiniz. Çok kiracılı (multi-tenant) bir ürün işletiyorsanız ve son kullanıcılarınızın trafiği tek bir Anthropic organizasyonundan geçiyorsa, bu özelliği devreye almamak, bir kullanıcının hatası yüzünden tüm müşteri tabanınızın riske girmesi anlamına geliyor.

Kişisel görüşüm şu: bu özellik aslında API sağlayıcılarının uzun süredir platform işletmecilerinden gizlediği bir sorumluluğu ortaya çıkarıyor. "Tek organizasyon, tek yaptırım alanı" modeli, büyük bir gateway işletiyorsanız her zaman gizli bir risk taşıyordu; User Profiles bu riski sizin kontrolünüze bırakıyor ama aynı zamanda onu sizin sorumluluğunuza da yüklüyor — artık her son müşteriyi doğru profille etiketlemek sizin işiniz, Anthropic'in değil. Bu etiketlemeyi atlayan bir ekip, özelliğin var olduğunu bilse de hiçbir koruma görmez; profil ID'sini göndermeyen her istek, eski "tek müşteri hepsini batırır" riskini olduğu gibi taşımaya devam ediyor.

Teknik detaylar için Anthropic'in resmi [User Profiles rehberi](https://platform.claude.com/docs/en/manage-claude/user-profiles) ve [API referansı](https://platform.claude.com/docs/en/api/user_profiles) en güncel kaynak; tüm Ekim 2026 değişiklikleri [resmi release notes sayfasında](https://platform.claude.com/docs/en/release-notes/overview) listeleniyor. Claude API'yi genel olarak değerlendiriyorsanız [hangi AI aboneliği rehberimize](/tr/posts/hangi-ai-aboneligi-claude-chatgpt-gemini) de göz atabilirsiniz.

## Sıkça Sorulan Sorular

### User Profiles oluşturmak ücretli mi?

Hayır. Anthropic'in resmi dokümantasyonuna göre profiller faturalandırılmıyor ve fiyatlandırmayı etkilemiyor; sadece normal API çağrı ücretlerini ödersiniz.

### Her son kullanıcı için ayrı profil mi açmalıyım?

`application` erişim türünde evet, her kayıtlı kullanıcı için bir profil açarsınız. `passthrough` erişim türünde ise şirket başına bir profil yeterli; şirket içindeki kişileri ayırt etmek için isteğin `metadata.user_id` alanını kullanırsınız.

### Profilsiz gönderilen bir istekte ne olur?

İstek normal şekilde işlenir ama hiçbir profile bağlı değildir; bu isteğin tetiklediği bir güvenlik ihlali tüm organizasyonunuza uygulanır, tek bir müşteriye değil.

### User Profiles, Amazon Bedrock'ta da kullanılabilir mi?

Evet ama profilleri önce Claude API veya Claude Platform on AWS'de oluşturmanız gerekiyor; Bedrock'un kendisinde profil oluşturma uç noktası yok, sadece mevcut profilin ID'sini isteğin gövdesinde gönderebilirsiniz.
