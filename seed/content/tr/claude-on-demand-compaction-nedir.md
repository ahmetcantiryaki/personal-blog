---
title: "Claude'un On-Demand Compaction Özelliği Nedir?"
slug: "claude-on-demand-compaction-nedir"
translationKey: "claude-on-demand-compaction-2026"
locale: "tr"
excerpt: "Kısa cevap: Yeni compaction parametresi, konuşmayı istediğiniz anda özetleyip imzalı bir blokla değiştiriyor; beta, sadece Claude API üzerinde çalışıyor."
category: "ai"
tags: ["claude", "llm", "api-design", "ai-infrastructure"]
publishedAt: "2026-09-18"
seoTitle: "Claude On-Demand Compaction Nedir? Geliştirici Rehberi"
seoDescription: "Kısa cevap: Yeni compaction parametresi, konuşmayı istediğiniz anda özetleyip imzalı bir blokla değiştiriyor; beta, sadece Claude API üzerinde çalışıyor."
---

Kısa cevap: 14 Eylül 2026'da Anthropic, Messages API'ye `compact-2026-09-04` beta başlığıyla çalışan yeni bir uç ekledi — isteğinize `compaction` parametresi koyduğunuzda API, o ana kadarki konuşmayı özetleyip imzalı (signed) tek bir blok döndürüyor; siz bu bloğu sonraki isteklerde eski mesajların yerine gönderiyorsunuz. Otomatik eşik tabanlı özetlemeden farkı şu: ne zaman özetleneceğine artık siz karar veriyorsunuz, otomatik sistem değil.

## On-demand compaction nedir, otomatik olandan farkı ne?

On-demand compaction, geliştiricinin `compaction` parametresini gönderdiği anda tetiklenen manuel bir özetleme isteğidir; API o tek istekte özetten başka bir şey döndürmez ve bu özet sonraki turlarda eski geçmişin yerini alır. Buna karşılık Anthropic'in ocak 2026'dan beri sunduğu `context_management` tabanlı `compact_20260112` özelliği otomatiktir: girdi token sayısı `trigger.value` ile belirlediğiniz eşiğe (varsayılan 150.000, minimum 50.000) ulaştığında API kendiliğinden devreye girer.

İki mekanizma da aynı problemi çözüyor — uzun ajan döngüleri ve çok turlu sohbetlerin bağlam penceresini taşırması — ama kontrol noktası farklı. Otomatik tetikleme "unut ve bırak" tarzı arka plan ajanları için uygundur; on-demand ise belirli bir iş adımından sonra (örneğin bir görev tamamlandığında) geçmişi bilinçli olarak sıkıştırmak isteyen uygulamalar için tasarlandı.

## İmzalı compaction bloğu nasıl çalışır?

API, özetlediği her `compaction` bloğuna sunucu tarafında bir imza ekliyor ve bu imza sonraki isteklerde blokla birlikte olduğu gibi (verbatim) geri gönderilmek zorunda — imza değiştirilirse veya eksik gönderilirse istek reddediliyor. Bu, geliştiricinin özet metnini elle düzenleyip API'ye "sanki konuşmanın gerçek özeti buymuş" gibi yutturamamasını garantiye alan kurcalamaya karşı dayanıklı (tamper-evident) bir tasarım. Aynı güvence, birden fazla mikroservisin aynı konuşma geçmişini paylaştığı dağıtık ajan mimarilerinde de işe yarıyor: bir servis özeti üretip diğerine ilettiğinde, alıcı servis imzayı doğrulayarak bloğun gerçekten Claude tarafından üretildiğinden emin olabiliyor.

Pratikte akış şöyle işliyor: `compaction` parametresini içeren bir istek gönderiyorsunuz, yanıt tek bir imzalı özet bloğu içeriyor ve normal bir asistan cevabı içermiyor; siz bu bloğu mesaj listesine ekleyip bir sonraki gerçek isteği attığınızda API, bloktan önceki tüm içeriği otomatik olarak düşürüyor ve sohbete özetten devam ediyor.

## Ne zaman on-demand, ne zaman otomatik tetikleme kullanmalısınız?

Kısa cevap: arka planda saatlerce çalışan otonom ajanlar için otomatik eşik tetiklemesini, kullanıcı etkileşimli ürünlerde belirli bir aşamada özetlemek istediğinizde on-demand'i seçin. Otomatik mod, geliştiricinin hiç müdahale etmediği uzun kod ajanı oturumlarında bağlam penceresi dolmadan sistemin kendi kendini yönetmesini sağlar.

On-demand mod ise özetin ne zaman alınacağını isteğe bağlı bıraktığı için, örneğin bir müşteri destek botunun her konuşma bölümü kapandığında geçmişi sıkıştırıp bir sonraki bölüme daha hafif bir bağlamla başlamasını mümkün kılıyor. Ayrıca özetleme isteğini arka planda çalıştırıp, kullanıcıya cevap vermeye devam ederken bloğu hazır olduğunda devreye sokabilirsiniz.

İkisini birbirini dışlayan seçenekler olarak değil, tamamlayıcı katmanlar olarak düşünmek daha doğru: otomatik eşiği bir güvenlik ağı olarak açık bırakıp normalde on-demand tetiklemeyi kullanan ekipler, hem beklenmedik uzun oturumlarda bağlam penceresi taşmasına karşı korunuyor hem de öngörülebilir noktalarda kendi zamanlamalarını uyguluyor. Anthropic'in dokümantasyonu iki mekanizmayı aynı istekte birleştirmeyi açıkça belgelemiyor, bu yüzden ikisini birlikte deniyorsanız önce staging ortamında token kullanımını izlemek gerekiyor.

## Gerçek bir senaryoda fark nasıl görülür?

Diyelim ki bir kod ajanı, büyük bir depoda çok adımlı bir refactor görevini yürütüyor: dosya okuma, test çalıştırma, düzeltme ve tekrar test etme döngüsü 40-50 tur sürüyor ve her tur önceki tüm araç çıktısını konuşma geçmişine ekliyor. Otomatik eşik tetiklemesi bu senaryoda işe yarar ama eşiğe ulaşana kadar beklemek zorundadır; oysa geliştirici her görev tamamlandığında (örneğin bir test paketi yeşile döndüğünde) geçmişi kendi iradesiyle sıkıştırmak isterse on-demand daha öngörülebilir bir maliyet ve gecikme profili sunar.

Aynı mantık müşteri destek ajanlarında da geçerli: bir konuşma bir bilet kapandığında bittiği için, o anı özetleme tetikleyicisi olarak kullanmak, sıradaki kullanıcı için gereksiz eski bağlamı taşımadan temiz bir başlangıç sağlıyor. Bizim değerlendirmemize göre bu, özelliğin en somut kazanımı — token eşiği beklemek yerine iş mantığının doğal kapanış noktalarını kullanmak.

## Kod örneğiyle nasıl kurulur?

Aşağıdaki örnek, bir konuşmayı on-demand olarak sıkıştırıp özeti bir sonraki istekte kullanmanın minimal akışını gösteriyor:

```python
import anthropic

client = anthropic.Anthropic()

# 1) Konuşmayı istediğiniz anda sıkıştırın
compact_response = client.beta.messages.create(
    model="claude-sonnet-5",
    max_tokens=1024,
    messages=long_running_messages,
    compaction={},
    betas=["compact-2026-09-04"],
)

compaction_block = compact_response.content[0]  # imzalı özet

# 2) Sonraki isteklerde özeti eski geçmişin yerine gönderin
next_response = client.beta.messages.create(
    model="claude-sonnet-5",
    max_tokens=1024,
    messages=[compaction_block, {"role": "user", "content": "Devam edelim"}],
    betas=["compact-2026-09-04"],
)
```

Anthropic'in dokümantasyonuna göre, imza doğrulaması sunucu tarafında yapıldığı için bloğu kendi kodunuzda ayrıştırıp değiştirmemeniz, olduğu gibi taşımanız gerekiyor. Python SDK'nın son sürümüne geçerken beta parametrelerinin adı değişmiş olabilir; büyük bir sürüm atlıyorsanız [Anthropic Python SDK v1.0 geçiş rehberimize](/tr/posts/anthropic-python-sdk-v1-gecis-rehberi) göz atmakta fayda var.

## Sınırlamalar ve dikkat edilmesi gerekenler

On-demand compaction, Eylül 2026 itibarıyla yalnızca doğrudan Claude API üzerinde beta durumda; Amazon Bedrock ve Google Cloud üzerinden sunulan Claude uç noktalarında henüz yok. Bu, çoklu bulut stratejisi olan ekiplerin özelliği tüm dağıtımlarında aynı anda kullanamayacağı anlamına geliyor.

Beta olduğu için API sözleşmesi değişebilir; üretim koduna entegre ederken beta başlığının sürüm numarasını (`compact-2026-09-04`) sabitleyip Anthropic'in sürüm notlarını takip etmek gerekiyor. Ayrıca özetleme kalitesi, `instructions` parametresiyle özelleştirilmediği sürece Anthropic'in varsayılan özet şablonuna bağlı — kod snippet'leri veya değişken adları gibi ayrıntıların korunmasını istiyorsanız özel talimat yazmak, varsayılana güvenmekten daha güvenilir sonuç veriyor.

| Özellik | On-demand compaction (yeni) | Otomatik compaction (`compact_20260112`) |
|---|---|---|
| Tetikleme | Geliştirici `compaction` parametresiyle manuel çağırır | API, token eşiğine ulaşınca kendiliğinden tetikler |
| Beta başlığı | `compact-2026-09-04` | `compact-2026-01-12` |
| Platform desteği | Sadece Claude API | Claude API, Bedrock, Google Cloud, Microsoft Foundry |
| Kontrol noktası | Uygulama mantığı belirler (ör. görev bitince) | Eşik değeri (minimum 50.000 token) belirler |
| Blok formatı | İmzalı, tek özet bloğu döner | Yanıt akışına gömülü `compaction` bloğu |

## Sıkça Sorulan Sorular

### Claude'un on-demand compaction özelliği neden çıktı?

Uzun ajan oturumları ve çok turlu sohbetler bağlam penceresini doldurduğunda geliştiricilerin özetleme zamanlamasını kendi uygulama mantığına göre belirleyebilmesi için çıktı; Eylül 2026'dan önce sadece otomatik eşik tabanlı sıkıştırma vardı ve zamanlama geliştiricinin kontrolünde değildi.

### On-demand compaction hangi Claude modellerinde çalışır?

Beta özellik, Claude Sonnet 5, Claude Opus 5 dahil güncel Claude API modellerinde çalışıyor; Anthropic'in fable/mythos serisi gibi düşünme bloğu (thinking) taşıyan modellerde saklanan turların düşünme içeriği de geçerliliğini koruyor.

### On-demand compaction ekstra ücretlendiriliyor mu?

Evet, özetleme isteği ayrı bir örnekleme (sampling) turu sayıldığı için normal istek/yanıt token'larına ek olarak faturalandırılıyor; ancak zaten oluşturulmuş bir özet bloğunu tekrar göndermek ek maliyete yol açmıyor.

### On-demand compaction Amazon Bedrock'ta kullanılabilir mi?

Hayır, Eylül 2026 itibarıyla on-demand compaction yalnızca doğrudan Claude API üzerinden erişilebiliyor; Bedrock ve Google Cloud dağıtımları şimdilik yalnızca eski otomatik eşik tabanlı sıkıştırmayı destekliyor.

On-demand compaction'ı token maliyeti açısından değerlendirirken [Claude Code'un harcama limitleri ve prompt cache metrikleri rehberimiz](/tr/posts/claude-code-harcama-limitleri-prompt-cache) faydalı bir tamamlayıcı; büyük dosyaları konuşma geçmişinden ayırıp Files API üzerinden yönetmek istiyorsanız [Claude Files API GA yazımıza](/tr/posts/claude-files-api-ga-ne-anlama-geliyor), API üzerine kendi aracınızı bağlamak istiyorsanız [ilk MCP bağlayıcınızı yazma rehberimize](/tr/posts/ilk-mcp-baglayicini-yaz-2026) bakabilirsiniz. Daha fazla Claude ve API haberi için [Yapay Zeka kategorimizi](/tr/category/yapay-zeka) takip edebilirsiniz.

Kaynaklar: [Anthropic'in resmi compaction dokümantasyonu](https://platform.claude.com/docs/en/build-with-claude/compaction) ve [Claude Platform sürüm notları](https://platform.claude.com/docs/en/release-notes/overview).
