---
title: "Claude Inference Hooks: AI Güvenlik Sunucusu Kurmak"
slug: "claude-inference-hooks-guvenlik-sunucusu"
translationKey: "claude-inference-hooks-explained"
locale: "tr"
excerpt: "Anthropic'in yeni beta özelliği, Claude Enterprise kurumlarının her prompt'u kendi sunucularından geçirip inference öncesi onay/red kararı almasını sağlıyor."
category: "ai"
tags: ["claude", "web-security", "ai-infrastructure", "best-practices"]
publishedAt: "2026-08-06"
seoTitle: "Claude Inference Hooks: AI Güvenlik Sunucusu Kurmak"
seoDescription: "Anthropic'in yeni beta özelliği, Claude Enterprise kurumlarının her prompt'u kendi sunucularından geçirip inference öncesi onay/red kararı almasını sağlıyor."
---

[Inference hooks](https://platform.claude.com/docs/en/manage-claude/inference-hooks), Anthropic'in 5 Ağustos 2026'da Claude Enterprise için yayınladığı beta özellik. Kurumların kontrolündeki bir HTTPS uç noktasını — kendi "AI güvenlik sunucusunu" — devreye sokup her yönetilen prompt'u model çalışmadan önce onaylatmasını veya reddettirmesini sağlıyor.

Tek cümlelik özet mekanizmayı anlatıyor ama etkisi bir özellik bayrağından çok daha büyük. Kurumsal müşteriler ilk kez kendi politika mantıklarını Anthropic'in inference akışına, senkron biçimde ve claude.ai, Claude Cowork ile Claude Code'un tamamından gelen her istekte devreye sokabiliyor.

## İstek akışı nasıl işliyor

Sıralama kasıtlı olarak sade tutulmuş:

1. Kullanıcı yönetilen bir yüzeyde — claude.ai, Cowork veya Claude Code (web, masaüstü ya da CLI) — bir prompt gönderiyor.
2. Anthropic, konuşma dökümünü taşıyan imzalı bir HTTPS POST isteğini kurumun yapılandırdığı sunucuya iletiyor.
3. Sunucu isteği değerlendirip yapılandırılabilir bir zaman aşımı süresi içinde — varsayılan 5000ms, 1 ile 10.000ms arasında ayarlanabilir — karar döndürüyor.
4. Karar "allow" ise inference normal şekilde devam ediyor. "Deny" ise kullanıcı, sunucunun döndürdüğü `deny_reason` alanıyla (en fazla 500 karakter) yöneticinin tanımladığı sabit mesajın birleşimini görüyor; her red kararı kurumun Activity Feed'ine kaydediliyor.
5. Sunucuya erişilemezse, hata dönerse veya zaman aşımına uğrarsa bu "webhook failure" sayılıyor — reddetme değil. Kurumun hata yönetimi ayarı, isteğin bloklanacağını mı yoksa incelenmeden geçeceğini mi belirliyor.

Şu an tek bir hook olayı var: `prompt`. Bu olay, inference başlamadan önce yönetilen her istekte bir kez tetikleniyor. Yanıt tarafında (Claude'un ürettiği içeriği denetleyen) uygulama Anthropic'in yol haritasında ama henüz hazır değil.

### Sunucu neyi görüyor, neyi görmüyor

Yük, döküm metnini, araç çağrılarını ve sonuçlarını, ek dosyalardan çıkarılan metni içeriyor. Buna karşılık ham dosya veya görsel baytları, sistem prompt'ları ve Anthropic'e özgü hiçbir bağlam — Claude'un gizli akıl yürütmesi dahil — gönderilmiyor. Bu ayrıntı, bu altyapı üzerine DLP tarayıcısı kuracaklar için kritik: hassas bir tablonun ekran görüntüsü işaretlenmiyor, çünkü sunucuya piksel değil, yalnızca metin çıkarımının ürettiği veri ulaşıyor. Sesli mod da kapsam dışı; konuşma başlığı üretimi gibi yardımcı istekler ise hook'a hiç gönderilmiyor.

## İmza doğrulamasını doğru yapmak

Her istek, Anthropic'in kendi yöntemini icat etmek yerine benimsediği [Standard Webhooks](https://www.standardwebhooks.com/) spesifikasyonunu izliyor. Üç başlık önemli:

- `webhook-id` — gövdedeki `request_id` alanına eşit, benzersiz bir teslimat kimliği. Idempotency anahtarı olarak kullanın.
- `webhook-timestamp` — Unix saniye cinsinden zaman damgası. Saatinizden beş dakikadan fazla sapan istekleri reddedin.
- `webhook-signature` — boşlukla ayrılmış bir veya daha fazla `v1,<base64>` değeri; her biri `{webhook-id}.{webhook-timestamp}.{ham gövde baytları}` üzerinden hesaplanmış HMAC-SHA256.

İmzalama sırrının başında `whsec_` ön eki var; bunu kırpıp kalan kısmı **standart** base64 ile çözün, URL-safe base64 ile değil. Bu tek ayrıntı, doğrulama hatalarının en sık görülen kaynağı — çünkü birçok kütüphane varsayılan olarak URL-safe çözme kullanıyor ve siz fark etmeden tüm imzalar sessizce eşleşmemeye başlıyor. HMAC'i JSON ayrıştırması gövdeye dokunmadan önce, ham istek baytları üzerinden hesaplayın; ayrıştırılmış bir nesneyi yeniden serileştirip hash'lemek neredeyse hiçbir zaman orijinal bayt dizisini üretmiyor.

```python
import hashlib
import hmac
import base64

def verify_signature(secret: str, webhook_id: str, timestamp: str, raw_body: bytes, signature_header: str) -> bool:
    key = base64.b64decode(secret.removeprefix("whsec_"))
    signed_content = f"{webhook_id}.{timestamp}.{raw_body.decode()}".encode()
    expected = base64.b64encode(hmac.new(key, signed_content, hashlib.sha256).digest()).decode()

    for candidate in signature_header.split():
        version, _, sig = candidate.partition(",")
        if version == "v1" and hmac.compare_digest(sig, expected):
            return True
    return False
```

### İstek gövdesi ve "10MB tuzağı"

[İstek gövdesi](https://platform.claude.com/docs/en/manage-claude/inference-hooks-endpoint) — Anthropic buna "prompt frame" diyor — şu alanları içeren bir JSON: `type` (her zaman `"prompt"`), `request_id`, `tenant_id`, `actor` (kullanıcı kimliği ve e-posta), `source.application` (örneğin `"claude-ai"` veya `"claude-code"`), döküm dizisi olan `messages` (text, tool_use, tool_result ve attachment blokları), `session_id`, `model` ve şu an boş, ileride kullanılmak üzere ayrılmış `metadata`.

Gövdeler 10MB'a kadar çıkabiliyor; uç noktayı hızlıca ayağa kaldırırken bu kolayca unutulan bir detay. Nginx'in varsayılan `client_max_body_size` değeri 1MB, Express'in `express.json()` varsayılanı ise 100kB — ikisi de siz açıkça yükseltmedikçe büyük dökümleri 413 hatasıyla sessizce reddediyor. Bunu ilk üretim krizinden önce kontrol etmekte fayda var.

Karar yanıtı kasıtlı olarak minimal tutulmuş:

| Alan | Tür | Not |
|---|---|---|
| `action` | `"allow"` veya `"deny"` | Her yanıtta zorunlu |
| `deny_reason` | metin, en fazla 500 karakter | Deny durumunda zorunlu; yönetici mesajıyla birlikte kullanıcıya gösterilir |
| `reference_id` | metin, en fazla 50 karakter, `[A-Za-z0-9._:/-]` | İsteğe bağlı; Activity Feed'e kaydedilir, kullanıcıya asla gösterilmez |

200 dışındaki her HTTP durumu her zaman webhook failure sayılıyor, örtük bir deny değil — bu ayrım üzerine test yazmakta fayda var, çünkü 500 hatasını "güvenli" davranış sanmak cazip gelebilir ama varsayılan davranış tam tersi.

## Planlanması gereken operasyonel detaylar

Anthropic, bağlantı hatasında 100ms gecikmeyle tam olarak bir kez yeniden deniyor — ama yalnızca bağlantı başarısız olursa; zaman aşımına uğrayan yavaş bir yanıt yeniden denenmiyor. Sürekli hatalar, bir yönetici manuel olarak yeniden etkinleştirene kadar kurum genelinde uygulamayı durduran bir circuit breaker'ı devreye sokuyor — makul bir güvenlik ağı ama aynı zamanda kararsız bir güvenlik sunucusunun kimseyi koruyamadan sessizce devre dışı kalabileceği anlamına da geliyor.

İstekler Anthropic'in yayınladığı `160.79.106.0/24` aralığından geliyor. Bu aralığı allowlist'e almak makul bir savunma katmanı ama imza doğrulamasının yerini tutmuyor — o aralığı taklit edebilen (ya da içindeki bir altyapıyı ele geçiren) biri, sizin sırrınız olmadan geçerli bir `webhook-signature` üretemez.

Devreye alma hepsi-ya da-hiçbiri şeklinde olmak zorunda değil. [Yönetici tarafı yapılandırma](https://platform.claude.com/docs/en/manage-claude/inference-hooks-configuration) shadow mode'u (yalnızca gözlemler, hiçbir zaman engellemez), yüzdeye dayalı kademeli açılışı veya role dayalı istisnaları destekliyor — böylece henüz ince ayar yapılırken kimse ilk günden kilit dışında kalmıyor.

## Inference Hooks ile Compliance API karşılaştırması

Bu iki Anthropic özelliği birbirine komşu ama farklı sorunları çözüyor; hangisine gerçekten ihtiyacınız olduğu konusunda net olmakta fayda var.

| | Inference Hooks | Compliance API |
|---|---|---|
| Zamanlama | Inference öncesi, senkron | Olay sonrası |
| Yön | Anthropic sizin sunucunuzu çağırır | Siz Anthropic'i çağırırsınız |
| Prompt'u engelleyebilir mi | Evet | Hayır — yalnızca veri çekme |
| Tipik kullanım | DLP, politika uygulama | Denetim, sohbet/dosya erişimi |
| Gecikme maliyeti | İstek başına yapılandırılan zaman aşımına kadar ekler | Yok (asenkron, kendi takviminizde) |

Regüle edilen bir verinin sızmasını gerçekleşmeden önce durdurmanız gerekiyorsa Inference Hooks gereken araç. Bir olay sonrasında ne yaşandığını yeniden kurmanız gerekiyorsa doğru araç Compliance API; ikisi birbirinin rakibi değil, tamamlayıcısı.

## Nerede işe yarıyor

Belgelenen kullanım senaryoları, kurumsal güvenlik ekiplerinin vendorlardan uzun süredir istediği şeylerle örtüşüyor: regüle edilen ya da gizli içerik barındıran prompt'ları reddeden DLP taraması (şimdiye kadarki en yaygın kalıp), her zaman izin veren ama saklama amacıyla veriyi kopyalayan gerçek zamanlı döküm arşivleme, prompt telemetri hatları ve model allowlist'i, proje kısıtlamaları ya da çalışma saati kontrolleri uygulayan politika motorları.

Sınırlamalar da gerçek. Bu yalnızca onay/red mekanizması — yeniden yazma veya redaksiyon yolu yok, yani bir kredi kartı numarasını çıkarıp geri kalan prompt'u geçirebilme imkanınız yok; politika reddediyorsa tamamı bloklanıyor. Yalnızca görselden oluşan içerik — bir belgenin ekran görüntüsü gibi — hiç incelenmiyor, çünkü ham baytlar Anthropic'in altyapısından hiç çıkmıyor. Ve en önemlisi, bu bir Claude Enterprise özelliği: Amazon Bedrock veya Google Cloud Vertex'te kullanılamıyor, yalnızca API'ye (Platform) sahip müşteriler tamamen kapsam dışı. Buna karşılık tek bir hook yapılandırması claude.ai, Cowork ve Claude Code'un tamamını tek biçimde kapsıyor; bu da daha önce her yüzey için ayrı kontroller birbirine ekleyen ekipler için politika yönetimini ciddi biçimde sadeleştiriyor.

Asıl tartışılması gereken nokta şu: her tek prompt'u model yanıt vermeden önce dışarıdaki bir sunucudan geçirmek ciddi bir gecikme ve kullanılabilirlik bedeli getiriyor; ayrıca DLP uç noktanızı şirketteki her yönetilen Claude etkileşimi için sert bir bağımlılık haline getiriyor. 5 saniyelik varsayılan zaman aşımı çoğu tarayıcı için cömert ama o sunucuyu veri sınıflandırma sağlayıcınıza yapılan bir çağrının ya da her istekte bir veritabanı sorgusunun arkasına zincirlerseniz, şirket genelindeki üretkenliği nöbetçi ekibinizin performansına karşı riske atmış olursunuz. Bu, inference hooks'u atlamak için bir neden değil — inference öncesi DLP, inference sonrası DLP'den gerçekten daha değerli — ama güvenlik sunucusunun kendisini bir öğleden sonrada kotarılmış yan proje değil, model API'sinin kendisi kadar yük testinden geçirilmiş, izlenen, tier-0 altyapı olarak ele almak için bir neden. Bu aynı zamanda sektörün geri kalanının nereye gittiğine dair oldukça net bir işaret: kurumsal alıcılar önüne politika katmanı koyamadıkları bir LLM'i benimsemeye giderek daha isteksiz olduğu için, önümüzdeki yıl içinde diğer öncü laboratuvarlardan da benzer inline yönetişim hook'ları beklenebilir.

Bu yaklaşım, [üretim için LLM guardrail kontrol listemizde](/tr/posts/uretim-icin-llm-guardrail-kontrol-listesi) ele aldığımız katmanlı yaklaşımı tamamlıyor — inference hooks "bu prompt hiç çalışmalı mı" sorusunu çözerken, uygulama mantığınızdaki guardrail'ler sonraki her adım için hâlâ önemli. Sunucunuz sınıflandırma için MCP üzerinden başka araçları çağıracaksa [MCP açıklama yazımıza](/tr/posts/model-context-protocol-nedir) ve [2026-07-28 spec güncellemesine](/tr/posts/mcp-2026-07-28-guncellemesi) göz atmakta fayda var, çünkü aynı imzalama disiplini orada da geçerli. `whsec_` sırrı bir yapılandırma dosyasında durmaması gereken bir kimlik bilgisi olduğundan, doğru saklama için [bulutta secret yönetimi yazımıza](/tr/posts/bulutta-secret-yonetimi) bakabilirsiniz. [Lansman yazımızda](/tr/posts/claude-opus-5-geldi) ele aldığımız Claude Opus 5'i üretimde zaten kullanan ekipler, bunu pilot olarak denemek için doğal bir ilk grup.

## Sıkça Sorulan Sorular

### Inference hooks, Claude API'siyle doğrudan çalışıyor mu?

Hayır. Kapsam Claude Enterprise'ın yönetilen yüzeyleriyle sınırlı: claude.ai, Claude Cowork ve Claude Code. Ağustos 2026 beta'sı itibarıyla yalnızca API'ye sahip (Platform) müşteriler ile Amazon Bedrock veya Google Cloud Vertex üzerindeki dağıtımlar kapsam dışı.

### Güvenlik sunucum çökerse ne olur?

Anthropic, erişilemeyen, hata döndüren veya zaman aşımına uğrayan bir sunucuyu webhook failure sayıyor — bu, deny'den farklı. Kurumunuzun hata yönetimi ayarı, isteklerin varsayılan olarak bloklanacağını mı yoksa incelenmeden geçeceğini mi belirliyor; iki seçeneğin risk profili çok farklı olduğundan bu ayarı bilinçli seçin.

### Sunucu bir prompt'u tamamen engellemek yerine sadece bir kısmını sansürleyebilir mi?

Şu an için hayır. Karar şeması yalnızca `allow` veya `deny` destekliyor; kısmi redaksiyon ya da yeniden yazma imkanı yok. Bir satırı hassas, dokuz satırı zararsız olan bir prompt, politikanız reddediyorsa tamamen bloklanıyor.

### Sırrım doğru göründüğü halde doğrulama neden sürekli başarısız oluyor?

Bildirilen sorunların büyük çoğunluğu base64 çözmeye dayanıyor: `whsec_` önekli sır, URL-safe base64 ile değil standart base64 ile çözülmeli; HMAC de yeniden serileştirilmiş bir JSON nesnesi üzerinden değil, ham ve ayrıştırılmamış istek gövdesi üzerinden hesaplanmalı.
