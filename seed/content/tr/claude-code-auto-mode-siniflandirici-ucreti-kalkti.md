---
title: "Claude Code Auto Mode Sınıflandırıcı Ücretini Kaldırdı"
slug: "claude-code-auto-mode-siniflandirici-ucreti-kalkti"
translationKey: "claude-code-auto-mode-classifier-pricing-2026"
locale: "tr"
excerpt: "Kısa cevap: Claude Code 2.1.278'de auto mode sınıflandırıcısı sunucu tarafında çalışıyor; API ve Enterprise kullanıcılarından artık ayrıca ücret alınmıyor."
category: "ai"
tags: ["claude", "ai-coding", "cost-optimization", "developer-experience"]
publishedAt: "2026-09-20"
seoTitle: "Claude Code Auto Mode Sınıflandırıcı Ücreti Kalktı"
seoDescription: "Kısa cevap: Claude Code 2.1.278 ile auto mode sınıflandırıcısı sunucu tarafında çalışıyor ve API/Enterprise kullanıcılarından artık ayrıca ücret alınmıyor."
---

Kısa cevap: Anthropic, 19 Eylül 2026'da yayınladığı Claude Code 2.1.278 sürümüyle auto mode'un istekleri hangi modele yönlendireceğine karar veren sınıflandırıcıyı, Claude API ve Enterprise kullanıcıları için varsayılan olarak sunucu tarafında çalıştırmaya başladı. Bu değişiklikle sınıflandırma adımının kendisi artık ayrıca token olarak faturalandırılmıyor; Bedrock, Vertex, Foundry ve gateway üzerinden bağlananlar da aynı varsayılanı alıyor.

## Auto mode sınıflandırıcısı ne işe yarıyor?

Auto mode açıkken Claude Code, gönderdiğiniz her isteğin ne kadar karmaşık olduğunu değerlendirip bunu hangi modelin (örneğin daha ucuz bir Haiku sınıfı model mi yoksa Sonnet ya da Opus mu) karşılayacağına karar veren küçük bir sınıflandırma adımından geçiriyor. Bu karar, siz fark etmeden her mesaj öncesinde arka planda çalışıyor ve kendi başına küçük bir miktar token tüketiyor.

19 Eylül 2026 öncesinde bu sınıflandırma isteği, asıl isteğinizden ayrı bir API çağrısı olarak faturalandırılıyordu. Tek bir istekte fark edilmeyecek kadar küçük olsa da, günde yüzlerce istek gönderen bir geliştirici ya da ekip için bu "sınıflandırıcı ek yükü" zamanla toplamda ölçülebilir bir maliyete dönüşüyordu.

## 19 Eylül 2026'da tam olarak ne değişti?

Claude Code 2.1.278 ile birlikte sınıflandırıcı, Claude API ve Enterprise hesapları için varsayılan olarak sunucu tarafında (server-side) çalışıyor ve bu çalışma artık ayrıca faturalandırılmıyor. Aynı varsayılan Bedrock, Vertex, Foundry ve LLM gateway'leri üzerinden bağlanan kullanıcılar için de geçerli.

Gateway üzerinden bağlanan kurulumlarda eski davranışa dönmek isteyenler `CLAUDE_CODE_AUTO_MODE_SERVER=0` ortam değişkenini ayarlayarak eski, istemci tarafında çalışan ve ayrı ücretlendirilen sınıflandırma yoluna geri dönebiliyor. Claude Code, bu şekilde ücretli bir sınıflandırma yoluna düştüğünde artık sizi ayrıca uyarıyor, böylece bunun neden olduğunu bilmeden fazladan ücret ödemiyorsunuz.

```bash
# Gateway üzerinde eski (ücretli) istemci-taraflı sınıflandırıcıya dönmek için
export CLAUDE_CODE_AUTO_MODE_SERVER=0
```

## Bu değişiklik maliyetinizi nasıl etkiliyor?

Etkinin büyüklüğü kullanım hacmine bağlı; tek bir oturumda fark edilmeyecek kadar küçük bir tasarruf, yüksek hacimli bir ekipte aylık faturada ölçülebilir bir farka dönüşebiliyor. Aşağıdaki tablo, değişiklik öncesi ve sonrası durumu özetliyor.

| Bağlantı yolu | 18 Eylül 2026 öncesi | 19 Eylül 2026 sonrası (varsayılan) |
|---|---|---|
| Claude API / Enterprise (doğrudan) | Sınıflandırıcı ayrı faturalandırılıyor | Sunucu tarafında, ücretsiz |
| Bedrock / Vertex / Foundry | Sınıflandırıcı ayrı faturalandırılıyor | Sunucu tarafında, ücretsiz |
| Gateway (varsayılan) | Sınıflandırıcı ayrı faturalandırılıyor | Sunucu tarafında, ücretsiz |
| Gateway (`CLAUDE_CODE_AUTO_MODE_SERVER=0`) | Sınıflandırıcı ayrı faturalandırılıyor | İstemci tarafında, ücretli (uyarı ile) |

Anthropic bu değişikliğin büyüklüğünü tek bir yüzde olarak paylaşmadı, ancak mekanizma açık: sınıflandırma isteği kendi başına ayrı bir faturalandırılabilir çağrı olmaktan çıktığı için, auto mode'u yoğun kullanan hesaplarda toplam token faturası bir miktar düşüyor.

## Sınıflandırıcının sunucu tarafında çalıştığını nasıl doğrularsınız?

Claude Code'un `/status` komutu artık "Auto mode server" adında yeni bir satır gösteriyor; bu satır, o oturumdaki auto mode sınıflandırıcısının sunucu tarafında mı yoksa istemci tarafında mı çalıştığını doğrudan söylüyor. Gateway arkasında çalışıyorsanız ve bu satır istemci tarafını gösteriyorsa, `CLAUDE_CODE_AUTO_MODE_SERVER` değişkeninin ayarlı olup olmadığını kontrol etmek ilk adım olmalı.

```bash
# Oturumda auto mode sınıflandırıcısının nerede çalıştığını kontrol edin
claude
/status
```

Sunucu tarafında çalışmıyorsa ve bunu siz bilerek ayarlamadıysanız, kullandığınız gateway veya proxy konfigürasyonunun eski davranışı zorladığı anlamına geliyor; bu durumda gateway sağlayıcınızın 2.1.278 ile uyumlu olup olmadığını kontrol etmek gerekiyor.

## Kimler bu değişiklikten etkileniyor?

Değişiklik özellikle Claude API üzerinden fatura ödeyen bireysel geliştiricileri, Enterprise sözleşmesi olan ekipleri ve Bedrock, Vertex, Foundry veya kurumsal bir gateway üzerinden Claude Code kullanan organizasyonları ilgilendiriyor. Claude.ai üzerinden Pro veya Max aboneliğiyle Claude Code kullanan tüketiciler zaten token bazlı ayrı faturalandırma görmüyor, dolayısıyla onlar için gözle görülür bir fark yok.

Kurumsal ekipler açısından asıl fayda, [Claude Code'un harcama limitleri ve prompt cache metrikleri](/tr/posts/claude-code-harcama-limitleri-prompt-cache) gibi maliyet gözlemlenebilirlik araçlarıyla birlikte düşünüldüğünde ortaya çıkıyor: sınıflandırıcı artık ayrı bir kalem olmadığı için, kalan token tüketimi daha doğrudan asıl iş yüküne (kod yazma, dosya okuma, araç çağrıları) atfedilebiliyor.

## Bu değişikliğin arkasındaki trend ne?

2026'nın ikinci yarısında Anthropic, Claude Code'un maliyet gözlemlenebilirliğini artıran birkaç değişikliği art arda yayınladı: harcama limitleri, prompt cache metrikleri ve şimdi de sınıflandırıcı ücretinin kaldırılması. Bu, agentic kodlama araçlarının kurumsal ekiplerde yaygınlaşmasıyla birlikte, "arka planda ne kadar token harcanıyor" sorusunun artık bir özellik talebi değil, satın alma kararı kriteri hâline geldiğini gösteriyor.

Rakip sağlayıcılar açısından bakıldığında, OpenAI'nin API'deki `reasoning_effort` parametresi ve Google'ın Gemini için sunduğu `thinking_config` mekanizması da benzer şekilde bir iç karar adımı içeriyor, ancak ikisi de şu ana kadar bu adımın kendisini ayrı bir ücret kalemi olarak faturalandırıp faturalandırmadığını kamuya açık şekilde netleştirmedi. Bu belirsizlik, Anthropic'in yaptığı gibi net bir "bu adım artık ücretsiz" açıklamasını nadir ve dolayısıyla dikkat çekici kılıyor — özellikle günde binlerce isteğin otomatik olarak sınıflandırıldığı büyük ekipler için.

Pratik sonuç şu: auto mode'u zaten kullanan bir ekip için bu değişiklik hiçbir ek adım gerektirmiyor, faydası otomatik olarak faturaya yansıyor. Auto mode'u henüz açmamış ekipler içinse, sınıflandırıcı maliyetinin artık sıfır olması, auto mode'a geçmenin önündeki maliyet itirazlarından birini ortadan kaldırıyor.

Bu değişikliğin bir başka sonucu da fatura okunabilirliği: sınıflandırıcı ayrı bir satır olmaktan çıktığı için, aylık kullanım raporlarında görülen token tüketimi artık daha büyük oranda gerçek iş yüküne (kod üretimi, dosya okuma, araç çağrıları) karşılık geliyor. FinOps sorumluluğu olan ekipler için bu, "bu ay neden daha çok harcadık" sorusuna daha net bir cevap vermeyi kolaylaştırıyor.

Bu tür küçük ama birikimli faturalandırma değişikliklerini takip etmek, büyük bir mimari kararı beklemek kadar önemli — çünkü Claude Code gibi günlük olarak yüzlerce kez çağrılan bir araçta, tek başına küçük görünen her optimizasyon, ölçek büyüdükçe toplam maliyette gerçek bir fark yaratıyor.

## Sıkça Sorulan Sorular

### Claude Code auto mode nedir?

Auto mode, Claude Code'un her isteğinizi otomatik olarak değerlendirip görevin karmaşıklığına en uygun modele (örneğin basit bir düzenleme için daha ucuz bir model, çok adımlı bir refactor için daha güçlü bir model) yönlendirdiği çalışma biçimidir; hangi modeli kullanacağınıza siz değil, bu sınıflandırma adımı karar verir.

### CLAUDE_CODE_AUTO_MODE_SERVER değişkeni ne işe yarar?

Bu ortam değişkeni yalnızca Bedrock, Vertex, Foundry veya gateway üzerinden bağlanan kurulumlarda geçerlidir; `0` değeri, sunucu tarafındaki ücretsiz sınıflandırıcıdan çıkıp eski, istemci tarafında çalışan ve ayrı faturalandırılan sınıflandırma yoluna geri döner. Claude API'ye doğrudan bağlananlar için bu değişkenin bir etkisi yoktur.

### Sınıflandırıcı ücreti tamamen mi kalktı?

Yalnızca sunucu tarafında çalışan varsayılan yol için evet: Claude API, Enterprise, Bedrock, Vertex ve Foundry kullanıcılarında sınıflandırma artık ayrı ücretlendirilmiyor. `CLAUDE_CODE_AUTO_MODE_SERVER=0` ile eski davranışa dönen gateway kullanıcılarında ücret hâlâ uygulanıyor, ancak Claude Code artık bu durumda açık bir uyarı gösteriyor.

### Bu değişiklik Claude Code'un ücretsiz veya abonelik bazlı sürümünü etkiliyor mu?

Hayır. Değişiklik yalnızca token bazlı faturalandırma yapılan Claude API, Enterprise, Bedrock, Vertex ve Foundry bağlantılarını kapsıyor; Claude.ai üzerinden Pro veya Max aboneliğiyle Claude Code kullananlar zaten ayrı bir sınıflandırıcı ücreti görmüyordu.

Auto mode'un genel çalışma mantığını [Claude Code Auto Mode: Nasıl Çalışır, Ne Zaman Kapatılır](/tr/posts/claude-code-auto-mode-nasil-calisir) yazımızda, varsayılan hâle gelme sürecini ise [Claude Code'da Auto Mode Varsayılan Oluyor](/tr/posts/claude-code-auto-mode-varsayilan-oluyor) yazımızda bulabilirsiniz. Ekibinizin token tüketimini uçtan uca izlemek için [Claude Code'da Harcama Limiti ve Prompt Cache Metrikleri](/tr/posts/claude-code-harcama-limitleri-prompt-cache) rehberine bakabilirsiniz. Daha fazla yapay zeka geliştirici aracı içeriği için [Yapay Zeka kategorimizi](/tr/category/yapay-zeka) inceleyebilirsiniz.

Kaynaklar: [Claude Code değişiklik günlüğü](https://code.claude.com/docs/en/changelog) ve [Claude Platform sürüm notları](https://platform.claude.com/docs/en/release-notes/overview).
