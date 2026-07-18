---
title: "LLM Gözlemlenebilirliği: Trace ve Eval"
slug: "llm-gozlemlenebilirligi-trace-eval"
translationKey: "llm-observability-tracing"
locale: "tr"
excerpt: "Çok adımlı bir AI ajanını tek log satırıyla debug etmek zaman kaybettirir; gen_ai.* ve Langfuse ile trace, maliyet ve eval verisi görünür hale gelir."
category: "ai"
tags: ["observability", "llm", "monitoring", "evals"]
publishedAt: "2026-07-18"
seoTitle: "LLM Gözlemlenebilirliği: Trace, Eval ve Maliyet"
seoDescription: "gen_ai.* semantik konvansiyonları, OTLP ve Langfuse ile LLM ajanlarında trace, token maliyeti, gecikme ve eval verisini nasıl görünür kılacağınızı öğrenin."
---

Bir agent zincirinin ortasında hangi adımın patladığını anlamaya çalışırken elinizde tek bir "request tamamlandı, 200 OK" log satırı varsa cevap yok demektir. Çözüm, her LLM çağrısını, her tool call'ı ve her retry'ı `gen_ai.*` alanlarıyla etiketlenmiş trace'ler hâlinde izlemek; bunu OpenTelemetry ile standart, Langfuse gibi araçlarla görünür hâle getirebilirsiniz.

## Neden tek satır log yetmiyor

Klasik bir REST endpoint'i debug ederken istek geldi, işlendi, cevap döndü — üç nokta yeter. Bir AI ajanında bu üçlü artık geçerli değil. Tek bir kullanıcı isteği; bir planlama çağrısı, üç tool call, bir RAG sorgusu, bir retry ve nihayet özet üreten bir model çağrısı olarak dallanabilir. Bu adımlardan biri yanlış model versiyonunu kullanmış, biri zaman aşımına uğrayıp sessizce retry olmuş, biri de bağlam penceresini taşırıp kırpılmış olabilir — ve dışarıdan bakan kullanıcı sadece "cevap saçma geldi" der.

Sadece istek/cevap loglamak bu zincirin hangi halkasında sorun çıktığını göstermez. Elinizde tek görünürlük bir istek başına bir log satırıysa, bir trace'in on saniyede göstereceği bugları bulmak için saatlerinizi harcarsınız; ben bunu birkaç kez pahalı bir şekilde öğrendim. Prod'da bozulan bir ajanı incelerken ihtiyacınız olan şey, isteğin girdiğinden cevabın çıktığına kadar geçen her adımı, o adımın hangi modeli hangi parametrelerle çağırdığını ve kaç token harcadığını gösteren hiyerarşik bir trace.

Bunun somut faydası şurada ortaya çıkıyor: bir kullanıcı "cevap yarım kaldı" diye şikayet ettiğinde, elinizde o kullanıcının session id'siyle eşleşen tek bir trace varsa zincirin tamamını açıp hangi adımda `finish_reasons` alanının `length` döndüğünü, hangi tool call'ın zaman aşımına uğradığını saniyeler içinde görürsünüz. Aynı bilgiyi dağınık log satırlarından, farklı servislerin farklı formatlarındaki kayıtlarını elle birleştirerek çıkarmaya çalışmak bambaşka bir iş; genelde de vardiya bitmeden bitmiyor.

## gen_ai.* konvansiyonları: alanın ortak dili

Burada işe OpenTelemetry'nin GenAI Semantik Konvansiyonları giriyor. OpenTelemetry'nin GenAI Özel İlgi Grubu tarafından geliştirilen bu konvansiyonlar, LLM çağrıları, ajan adımları, vektör veritabanı sorguları, token kullanımı, maliyet takibi ve kalite metrikleri için ortak alan adları ve tipleri tanımlıyor. Amaç, hangi sağlayıcıyı (OpenAI, Anthropic, kendi barındırdığınız bir model) kullanırsanız kullanın aynı alan isimlerini görmeniz; böylece bir kez enstrümante edip istediğiniz backend'e gönderebiliyorsunuz.

Temmuz 2026 itibarıyla konvansiyonların büyük bölümü hâlâ deneysel statüde, ama istemci span'leri için tanımlanan kısım 2026'nın başında deneysel statüden çıktı — yani alan, köşelerinin bir kısmı hâlâ oturmasa da bu şemayı ortak taban olarak benimsedi. Pratikte en çok işinize yarayacak alanlar şunlar:

| Alan | Ne yakalar |
| --- | --- |
| `gen_ai.request.model` | Çağrıda kullanılan model adı (örn. `claude-sonnet-5`) |
| `gen_ai.usage.input_tokens` / `gen_ai.usage.output_tokens` | Girdi ve çıktı token sayıları |
| `gen_ai.response.finish_reasons` | Üretimin neden durduğu (`stop`, `tool_calls`, `length`) |
| `gen_ai.request.*` | Gönderilen girdi ve hiperparametreler (temperature, max_tokens) |
| `gen_ai.response.*` | Dönen nihai çıktı ve yanıt payload'ı |
| `gen_ai.operation.name` | Operasyon tipi (`chat`, `embeddings`, `execute_tool`) |
| `gen_ai.system` | Sağlayıcı (`openai`, `anthropic`, `azure.ai.inference`) |

Bu tabloyu bir kere kafanıza yerleştirdiğinizde, herhangi bir OTel-uyumlu izleme aracında aynı sorgulama mantığını kurabilirsiniz: "hangi trace'lerde `finish_reasons` `length` çıkmış", "hangi model çağrıları en çok token yakmış" gibi. Konvansiyonlar sadece span alanlarıyla sınırlı değil; `gen_ai.client.token.usage` ve `gen_ai.client.operation.duration` gibi metrikler de tanımlanıyor, böylece tek tek trace'leri açmadan da model bazında token tüketimi ve gecikme dağılımını histogram olarak görebiliyorsunuz. [OpenTelemetry'nin GenAI gözlemlenebilirlik yazısı](https://opentelemetry.io/blog/2026/genai-observability/) ve [semantic-conventions-genai deposu](https://github.com/open-telemetry/semantic-conventions-genai) alanların güncel listesini ve span/metrik şemasını tutuyor; bu konvansiyonlara [OpenTelemetry'e başlangıç rehberimizde](/tr/posts/opentelemetry-baslangic-rehberi) de değindik.

## Langfuse'u OTel backend'i olarak kullanmak

OTel'in transport katmanı vendor'dan bağımsız: bir kez enstrümante ettiğiniz trace'i istediğiniz OTLP-uyumlu backend'e gönderebilirsiniz. Burada Langfuse öne çıkan seçeneklerden biri, çünkü GenAI semantik konvansiyonlarıyla uyumlu olmayı hedefliyor ve doğrudan bir OpenTelemetry backend'i gibi davranarak `/api/public/otel` endpoint'inde OTLP trace'lerini kabul ediyor. HTTP üzerinden hem JSON hem protobuf formatını destekliyor; gRPC desteği ise henüz yok. Kimlik doğrulama Basic Auth ile yapılıyor, bu yüzden mevcut bir OpenTelemetry Collector kurulumunuz varsa Langfuse'u sadece bir exporter hedefi olarak eklemeniz yeterli.

Langfuse'un açık kaynak ve kendi sunucunuzda barındırılabilir olması, veri residency zorunluluğu olan ekipler için önemli bir ayrım noktası. Prod trace'lerinizin (ve içindeki kullanıcı promptlarının) hangi bölgede durduğunu kontrol etmeniz gerekiyorsa, SaaS bir gözlemlenebilirlik aracına güvenmek yerine Langfuse'u kendi altyapınızda çalıştırıp aynı `gen_ai.*` şemasını korursunuz. [Langfuse'un OpenTelemetry entegrasyon dokümanı](https://langfuse.com/integrations/native/opentelemetry) ve [self-host gözlemlenebilirlik rehberi](https://langfuse.com/self-hosting/configuration/observability) kurulum detaylarını anlatıyor. Bu esneklik OTel'in asıl vaadi: aynı enstrümantasyon kodunu değiştirmeden trace'leri Langfuse'a, Datadog'a ya da Honeycomb'a yönlendirebilirsiniz, vendor kilidine girmezsiniz.

## Eval, maliyet ve gecikme panolarını trace verisi üzerine kurmak

Trace verisi sadece debug için değil; üstüne kurduğunuz panolar için de ham malzeme. `gen_ai.usage.*` alanları toplandığında model başına, kullanıcı başına ya da özellik başına token maliyetini gösteren bir maliyet panosuna dönüşür — bu konuyu [LLM token maliyetini düşürme yazımızda](/tr/posts/llm-token-maliyetini-dusurme) daha detaylı işledik. Span süreleri toplandığında p50/p95 gecikme grafiğine dönüşür; hangi adımın (RAG sorgusu mu, tool call mı, nihai üretim mi) yavaşlığın kaynağı olduğunu gösterir.

Eval tarafı biraz daha incelikli: trace'ler size neyin olduğunu gösterir, evaller neyin *doğru* olduğunu gösterir. Prod'dan örneklenen trace'leri bir eval setine bağlayıp otomatik veya insan puanlamasıyla skorladığınızda, regresyon çıktığı anda hangi trace'in düştüğünü görürsünüz — [LLM çıktılarını değerlendirme rehberimizde](/tr/posts/llm-ciktilari-degerlendirme) bu döngüyü nasıl kurduğumuzu anlattık. Ajan güvenilirliği de bu panoların doğal uzantısı: [üretim için LLM guardrail kontrol listemiz](/tr/posts/uretim-icin-llm-guardrail-kontrol-listesi) ve [LLM halüsinasyonlarını azaltma yazımız](/tr/posts/llm-halusinasyon-azaltma) trace ve eval verisini nasıl bir güvenlik ağına çevirdiğimizi gösteriyor; bağlam şişmesi gibi ince sorunlar da genelde bir trace'te saniyeler içinde fark edilir.

Genel gözlemlenebilirlik kavramlarına (log, metrik, trace üçlüsü) aşina değilseniz önce [Observability 101 yazımıza](/tr/posts/observability-nedir) bakmanızı öneririm; GenAI konvansiyonları bu üçlünün üstüne kurulu, onu değiştirmiyor.

Pratikte panoyu kurarken üç katmanı ayırmakta fayda var: maliyet panosu genelde finans ve ürün ekibinin, gecikme panosu on-call mühendisin, eval panosu da model kalitesinden sorumlu ekibin baktığı yer. Aynı trace verisinden besleniyor olmaları, üçünü de tek bir sorgu katmanında tutmanızı sağlıyor; ayrı ayrı log toplama hatları kurmanıza gerek kalmıyor.

## Minimal bir enstrümantasyon örneği

Aşağıdaki örnek, OpenTelemetry Python SDK ile bir LLM çağrısını `gen_ai.*` alanlarıyla nasıl işaretleyeceğinizi gösteriyor. Gerçek bir OTel Collector'a ya da doğrudan Langfuse'un OTLP endpoint'ine export edebilirsiniz.

```python
from opentelemetry import trace

tracer = trace.get_tracer("agent-service")

def call_llm(prompt: str, model: str = "claude-sonnet-5"):
    with tracer.start_as_current_span("chat") as span:
        span.set_attribute("gen_ai.operation.name", "chat")
        span.set_attribute("gen_ai.system", "anthropic")
        span.set_attribute("gen_ai.request.model", model)

        response = client.messages.create(model=model, messages=[{"role": "user", "content": prompt}])

        span.set_attribute("gen_ai.usage.input_tokens", response.usage.input_tokens)
        span.set_attribute("gen_ai.usage.output_tokens", response.usage.output_tokens)
        span.set_attribute("gen_ai.response.finish_reasons", [response.stop_reason])
        return response
```

Bu kadar küçük bir başlangıç bile, sonradan tool call span'leri ve retry span'leri eklediğinizde tüm zincirin ağaç görünümünü OTel-uyumlu herhangi bir arayüzde izlemenize yeter.

## Sıkça Sorulan Sorular

### gen_ai.* alanlarını manuel mi eklemem gerekiyor?

Çoğu zaman hayır. OpenAI, Anthropic ve LangChain gibi popüler SDK'lar için hazır OTel enstrümantasyon paketleri bu alanları otomatik dolduruyor; manuel `set_attribute` çağrıları genelde özel iş mantığı ya da kendi tool call'larınız için gerekiyor.

### Langfuse yerine Datadog ya da Honeycomb kullanamaz mıyım?

Kullanabilirsiniz, OTel'in bütün amacı bu. Aynı `gen_ai.*` enstrümantasyonunu değiştirmeden export hedefini değiştirebilirsiniz; Langfuse öne çıkıyor çünkü LLM-özelinde hazır pano ve eval akışları sunuyor, ayrıca kendi sunucunuzda barındırılabilir.

### Trace'ler prod'da performans maliyeti yaratır mı?

Doğru yapılandırılmış bir OTel SDK'sı (batch export, sampling) tipik olarak gözle görülür bir gecikme eklemez. Riskli olan şey içerik alanlarını (`gen_ai.input.messages` gibi) her isteğe eksiksiz yazmak; büyük promptlarda bu payload boyutunu şişirebilir, o yüzden içerik kaydını genelde örnekleme ile sınırlarız.

### Sadece maliyet panosu için trace mi kurmalıyım?

Hayır, trace'in asıl değeri debug ve eval tarafında. Maliyet panosu `gen_ai.usage.*` alanlarının bir yan ürünü; tek başına maliyet için kurmak, zincirin neresinde hata çıktığını görme fırsatını kaçırmak olur.
