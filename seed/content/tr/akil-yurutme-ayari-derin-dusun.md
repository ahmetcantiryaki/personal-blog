---
title: "Akıl Yürütme Ayarı: Ne Zaman Derin Düşün?"
slug: "akil-yurutme-ayari-derin-dusun"
translationKey: "reasoning-effort-controls-2026"
locale: "tr"
excerpt: "Kısa cevap: Basit sorularda düşük, çok adımlı analiz ve kodlamada yüksek akıl yürütme seviyesi seç; aradaki fark hem yanıt süresini hem faturayı katlıyor."
category: "ai"
tags: ["claude", "chatgpt", "gemini", "prompt-engineering"]
publishedAt: "2026-09-20"
seoTitle: "Akıl Yürütme Ayarı: Claude, ChatGPT, Gemini Rehberi"
seoDescription: "Kısa cevap: Basit sorularda düşük, çok adımlı analiz ve kodlamada yüksek akıl yürütme seviyesi seçin; aradaki fark hem süreyi hem faturayı katlıyor."
---

Kısa cevap: Basit bir sorguda düşük (low) akıl yürütme seviyesi yeterli ve hızlıdır; çok adımlı analiz, matematik ispatı veya karmaşık kodlama görevlerinde yüksek (high/xhigh) seviyeye geçmek doğruluğu artırır ama hem yanıt süresini hem token faturasını kat kat büyütür. 2026 itibarıyla Claude, ChatGPT ve Gemini'nin üçü de bu seviyeyi elle ayarlamanıza izin veriyor; doğru seçim görev tipine göre değişiyor.

## "Daha çok düşün" neden bedava değil?

Bir modelin "extended thinking" ya da "reasoning" moduna geçmesi, yanıtı üretmeden önce ek ara adımlar (bir tür iç monolog) çalıştırması anlamına geliyor; bu ara adımların her biri gerçek token tüketiyor ve gerçek zaman alıyor. Bir modelin xhigh seviyesinde ürettiği bir yanıt, aynı soruya low seviyede verdiği yanıttan onlarca kat daha fazla token harcayabiliyor — çünkü fatura yalnızca görünen cevaba değil, görünmeyen düşünme sürecine de kesiliyor.

Bu yüzden "her zaman en yüksek seviyeyi seç" stratejisi hem yavaş hem pahalı. Basit bir "bu fonksiyonun adı ne olmalı" sorusuna xhigh seviyesinde düşündürmek, saniyelerce ekstra bekleme ve gereksiz token maliyeti dışında bir şey getirmiyor.

## ChatGPT'de akıl yürütme kontrolü nasıl çalışıyor?

OpenAI, 6 Ağustos 2026'da tüketici ChatGPT arayüzündeki ayrı Instant / Thinking / Pro model seçicisini kaldırdı ve bunun yerine tek bir modeli (GPT-5.6 Sol) hem hızlı yanıtları hem uzun akıl yürütmeyi tek bir "thinking effort" kaydırağıyla yönetecek şekilde birleştirdi. Kaydırağı düşük tarafa çekmek Instant moduna yakın bir hız verirken, yüksek tarafa çekmek eski Pro modunun derinliğine yaklaşıyor.

API tarafında ise geliştiriciler `reasoning_effort` parametresini `"low"`, `"medium"` veya `"high"` olarak ayarlıyor; bu üç seviye, modelin bir isteğe yanıt vermeden önce ne kadar dahili adım çalıştıracağını doğrudan belirliyor.

```json
{
  "model": "gpt-5.5",
  "reasoning_effort": "high",
  "messages": [{"role": "user", "content": "Bu algoritmadaki race condition'ı bul"}]
}
```

## Claude'da extended thinking seviyeleri neler?

Anthropic, 28 Mayıs 2026'da yayınladığı Opus 4.8 ile birlikte beş seviyeli bir yapıya geçti: low, medium, high, xhigh ve max. Eskiden varsayılan seviye medium iken, Opus 4.8'den itibaren varsayılan high oldu; Anthropic kodlama ve ajan (agentic) görevleri için xhigh'ı, çoğu zeka gerektiren iş için ise high'ı öneriyor. Eski `budget_tokens` parametresi tamamen kaldırıldı — artık model, seçtiğiniz seviye içinde bir isteğin ne kadar düşünme gerektirdiğine kendisi karar veriyor, siz token bütçesi belirlemiyorsunuz.

```bash
# Claude API'de akıl yürütme seviyesini xhigh olarak ayarlamak
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -d '{"model": "claude-opus-5", "thinking": {"level": "xhigh"}, ...}'
```

## Gemini'de Deep Think ne zaman devreye giriyor?

Google, Gemini'nin en zor akıl yürütme problemleri için ayrı bir Deep Think modu sunuyor; bu mod, standart yanıt hızını feda ederek modelin bir soruyu birden fazla açıdan değerlendirip kendi ürettiği ara adımları karşılaştırmasına izin veriyor. API tarafında bu davranış `thinking_config` parametresiyle kontrol ediliyor ve Deep Think, dört seviyelik bir merdivenin en üstünde, ayrıca bir otomatik mod seçeneğiyle birlikte duruyor.

Pratikte Deep Think, kısa bir soru-cevap için değil; matematiksel ispat, çok adımlı planlama ya da birbiriyle çelişebilecek gereksinimleri uzlaştırma gibi görevler için tasarlanmış durumda.

## Hangi görevde hangi seviyeyi seçmelisiniz?

Üç sağlayıcının da isimlendirmesi farklı olsa da mantık aynı: görevin belirsizliği ve adım sayısı arttıkça seviyeyi yükseltin, aksi hâlde düşük tutun.

| Görev tipi | Önerilen seviye | Neden |
|---|---|---|
| Basit soru-cevap, format dönüştürme | Low / Instant | Doğruluk riski düşük, hız öncelikli |
| Genel kod yazımı, kısa refactor | Medium | Çoğu görevde yeterli doğruluk |
| Çok adımlı kodlama, ajan görevleri | High / xhigh | Anthropic bunu doğrudan öneriyor |
| Matematik ispatı, çelişkili gereksinim analizi | Max / Deep Think | Ara adımların karşılaştırılması gerekiyor |

## Maliyet ve gecikme dengesini nasıl kurarsınız?

Üretim ortamında sabit bir seviye seçmek yerine, isteğin kaynağına göre dinamik seçim yapmak daha verimli: kullanıcıdan gelen basit bir arama sorgusuna düşük seviye, bir CI pipeline'ındaki otomatik kod inceleme adımına yüksek seviye atamak gibi. [Prompt mühendisliği tekniklerimizde](/tr/posts/prompt-muhendisligi-teknikleri) anlattığımız gibi, prompt'un kendisini netleştirmek bazen yüksek seviyeye geçmeden önce denenmesi gereken daha ucuz bir adım.

Varsayılanları da unutmayın: Claude Opus 5, high seviyesini varsayılan olarak kullanıyor, yani hiçbir şey ayarlamazsanız zaten orta-yüksek bir maliyet-doğruluk dengesindesiniz. [Claude Opus 5'in fiyatlandırmasını](/tr/posts/claude-opus-5-geldi) incelerken bu varsayılanı da hesaba katmak gerekiyor.

## Seviye değiştirirken nelere dikkat etmelisiniz?

Bir üretim sisteminde effort seviyesini değiştirmeden önce, önce mevcut seviyede tipik bir isteğin ne kadar süre ve token tükettiğini ölçün; aksi hâlde "high'a geçince daha iyi oldu" izlenimi, gerçek bir ölçüme değil öznel bir gözleme dayanır. Claude'da `budget_tokens` parametresinin kaldırılmasıyla artık siz bir üst sınır belirlemiyorsunuz — model, seçtiğiniz seviye içinde ne kadar düşüneceğine kendisi karar veriyor, bu da aynı seviyede bile istekten isteğe süredeki değişkenliği artırabiliyor.

Kullanıcıya gerçek zamanlı yanıt veren bir arayüzde (ör. bir sohbet widget'ı) yüksek seviyeye geçmeden önce, kullanıcının kaç saniyelik bir bekleme süresini kabul edeceğini net bir eşik olarak belirleyin ve bu eşiği aşan istekleri düşük seviyeye düşürecek bir geri düşme (fallback) mantığı kurun. Toplu (batch) işlenen arka plan görevlerinde ise gecikme daha az kritik olduğu için yüksek seviyeyi varsayılan yapmak genelde daha güvenli bir tercih.

Üç sağlayıcı arasında geçiş yapan ekipler için bir başka pratik nokta: aynı görev tipi için "high" ismi her sağlayıcıda aynı davranışı garanti etmiyor — bir sağlayıcının high'ı, diğerinin xhigh'ına yakın bir derinlikte çalışabiliyor. Bu yüzden sağlayıcı değiştirirken seviye isimlerini birebir eşlemek yerine, gerçek görevinizle küçük bir test seti üzerinden yeniden kalibre etmek daha güvenilir.

Sonuç olarak sabit bir kural yerine ölçülebilir bir süreç kurmak daha sürdürülebilir: seviyeyi değiştirmeden önce ve sonra aynı test setinde doğruluk, süre ve token maliyetini kaydedin, sonra kararı bu üç metriğin dengesine göre verin. Bu ölçümü bir kez yapıp bir kenara koymayın; model sürümleri güncellendikçe aynı seviyenin davranışı da değişebiliyor, dolayısıyla büyük bir sürüm geçişinde ölçümü tekrarlamak makul bir alışkanlık. Bu küçük disiplin, uzun vadede hem faturanızı hem kullanıcı deneyiminizi tahmin edilebilir tutmanın en ucuz yolu.

## Sıkça Sorulan Sorular

### Reasoning effort (akıl yürütme seviyesi) ayarı nedir?

Bir dil modelinin yanıt üretmeden önce ne kadar ek ara adım (iç düşünme) çalıştıracağını belirleyen ayardır; seviye yükseldikçe doğruluk genelde artar ama yanıt süresi ve token maliyeti de artıyor.

### ChatGPT'de thinking effort kaydırağı nasıl çalışıyor?

6 Ağustos 2026'dan itibaren ChatGPT'nin tüketici arayüzü, ayrı Instant/Thinking/Pro modelleri yerine tek bir modeli (GPT-5.6 Sol) tek bir kaydırakla yönetiyor; kaydırağı düşük tarafa çekmek hızlı yanıt, yüksek tarafa çekmek derin akıl yürütme demek. API'de bu, `reasoning_effort` parametresiyle "low", "medium" veya "high" olarak ayarlanıyor.

### Claude'da hangi effort seviyesini seçmeliyim?

Genel kullanım için varsayılan high seviyesi yeterli; kodlama ve çok adımlı ajan görevlerinde Anthropic'in önerisi doğrultusunda xhigh'a geçmek, basit soru-cevaplarda ise low veya medium'a düşmek maliyeti belirgin şekilde azaltıyor.

### Gemini Deep Think her soruda mı kullanılmalı?

Hayır. Deep Think, matematiksel ispat veya çok adımlı planlama gibi ara adımların karşılaştırılmasını gerektiren zor problemler için tasarlandı; günlük soru-cevap veya kısa metin düzenleme gibi görevlerde standart mod hem daha hızlı hem daha ucuz.

Gemini'nin Deep Think modunu daha yakından incelemek için [Gemini 3 Deep Think Nedir?](/tr/posts/gemini-3-deep-think-nedir) yazımıza, hangi AI aboneliğinin bütçenize uygun olduğunu görmek için [Hangi AI Aboneliği: Claude, ChatGPT, Gemini?](/tr/posts/hangi-ai-aboneligi-claude-chatgpt-gemini) rehberimize bakabilirsiniz. ChatGPT'nin güncel plan yapısı için [ChatGPT Tam Rehber 2026](/tr/posts/chatgpt-tam-rehber-2026) yazımız faydalı olacaktır. Daha fazla yapay zeka içeriği için [Yapay Zeka kategorimizi](/tr/category/yapay-zeka) ziyaret edebilirsiniz.

Kaynaklar: [OpenAI model sürüm notları](https://help.openai.com/en/articles/9624314-model-release-notes) ve [Anthropic extended thinking dokümantasyonu](https://platform.claude.com/docs/en/release-notes/overview).
