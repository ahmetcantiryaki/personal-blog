---
title: "OpenTelemetry ile LLM Çağrısı Nasıl İzlenir?"
slug: "opentelemetry-ile-llm-cagrisi-izleme"
translationKey: "opentelemetry-llm-tracing-2026"
locale: "tr"
excerpt: "Kısa cevap: her LLM çağrısını gen_ai.* standardıyla bir span'e sarın, token sayısını ekleyin. Standart 2026 ortası itibarıyla hâlâ 'Development' statüsünde."
category: "devops-cloud"
tags: ["observability", "llm", "monitoring", "devops", "ai-infrastructure"]
publishedAt: "2026-10-06"
seoTitle: "OpenTelemetry ile LLM Çağrısı İzleme Rehberi"
seoDescription: "OpenTelemetry ile LLM çağrısı izlemek için gen_ai.* semantik standardını, token sayımını, çoklu adım trace'lerini ve prompt redaksiyonunu anlatan rehber."
---

Kısa cevap: her LLM isteğini `gen_ai.*` ad alanındaki attribute'larla bir span olarak kaydedin — sağlayıcı adı, model adı, girdi/çıktı token sayısı — ve bir ajanın çok adımlı çalışmasını tek bir trace altında zincirleyin. OpenTelemetry'nin GenAI semantik standardı 2026 ortası itibarıyla hâlâ "Development" statüsünde; yani kararlı değil ama yaygın olarak kullanılıyor.

## LLM çağrıları neden klasik trace'lerde görünmez kalıyor?

Çünkü normal bir HTTP veya veritabanı span'i süre ve durum kodu dışında bir şey yakalamaz; ama bir LLM çağrısında asıl maliyet ve gecikme kaynağı prompt uzunluğu, model seçimi ve kaç araç çağrısı yapıldığıdır. Bu bilgi olmadan, "neden bu istek 8 saniye sürdü" sorusuna cevap veremezsiniz — süre görünür ama nedeni görünmez.

[OpenTelemetry'nin GenAI semantik standardı](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-spans/) tam olarak bu boşluğu dolduruyor: `gen_ai` ad alanı altında istek, yanıt, token kullanımı ve model için standart attribute'lar tanımlıyor. Ama bir uyarı var — standart Haziran 2026'da ana semantic-conventions deposundan çıkarılıp ayrı bir `semantic-conventions-genai` deposuna taşındı ve aynı yıl içinde üç kez attribute adı değişikliği yaşadı. 2026 ortası itibarıyla hiçbir `gen_ai.*` attribute'u "Stable" değil, hepsi "Development" statüsünde — yani üretimde kullanılabilir ama adlandırma gelecekte değişebilir.

## Prompt, completion ve araç çağrısı için span'ler nasıl oluşturulur?

Her LLM isteği için bir span açın ve şu temel attribute'ları ekleyin:

| Attribute | Ne tutar | Durum |
|---|---|---|
| gen_ai.provider.name | Sağlayıcı adı ("anthropic", "openai") | Development |
| gen_ai.request.model | İstenen model adı | Development |
| gen_ai.response.model | Yanıtı asıl üreten model | Development |
| gen_ai.operation.name | İşlem tipi ("chat", "embeddings") | Development |
| gen_ai.usage.input_tokens | Girdi token sayısı | Development (eski adı prompt_tokens, kullanımdan kalktı) |
| gen_ai.usage.output_tokens | Çıktı token sayısı | Development (eski adı completion_tokens, kullanımdan kalktı) |

Bir ajan birden fazla araç çağrısı yapıyorsa, her araç çağrısını ayrı bir child span olarak açıp ana LLM span'inin altına zincirleyin. Bu sayede tek bir trace içinde "model düşündü → arama aracını çağırdı → sonucu aldı → ikinci kez düşündü → yanıt verdi" akışının tamamını görürsünüz. Bu çok adımlı zincirleme olmadan, her adım ayrı bir trace gibi görünür ve aralarındaki nedensellik kaybolur.

```python
from opentelemetry import trace

tracer = trace.get_tracer("llm-service")

with tracer.start_as_current_span("chat claude-sonnet-5-5") as span:
    span.set_attribute("gen_ai.provider.name", "anthropic")
    span.set_attribute("gen_ai.request.model", "claude-sonnet-5-5")
    response = client.messages.create(model="claude-sonnet-5-5", messages=messages)
    span.set_attribute("gen_ai.usage.input_tokens", response.usage.input_tokens)
    span.set_attribute("gen_ai.usage.output_tokens", response.usage.output_tokens)
```

## Bunu elle mi enstrümante etmeniz gerekiyor?

Hayır, çoğu durumda değil. OpenLLMetry ve Traceloop gibi kütüphaneler, OpenAI, Anthropic ve LangChain gibi yaygın SDK'ları otomatik olarak sarmalayıp `gen_ai.*` attribute'larını sizin yerinize dolduruyor; tek yapmanız gereken uygulamanızın başında kütüphaneyi başlatmak. Elle enstrümantasyon, genelde özel bir dahili LLM istemciniz olduğunda ya da standart kütüphanelerin yakalamadığı bir attribute (örneğin özel bir yönlendirme kararı) eklemek istediğinizde gerekiyor. Çoğu ekip için en pratik yol, otomatik enstrümantasyonla başlayıp yalnızca eksik kalan noktaları elle tamamlamak. Bu kütüphaneler ayrıca token kullanımını sadece span attribute'u olarak değil, bir metrik (histogram) olarak da dışa aktarabiliyor; bu sayede "son bir saatte ortalama kaç token harcandı" gibi soruları tek tek trace'leri açmadan, doğrudan bir metrik panosundan cevaplayabilirsiniz.

## Yüksek hacimli trace'leri kaybetmeden nasıl örneklersiniz?

Baş-tabanlı (head-based) örnekleme, isteğin başında "bu trace'i tut ya da at" kararı verir — basittir ama nadir görülen hataları kaçırma riski taşır. Kuyruk-tabanlı (tail-based) örnekleme ise trace tamamlandıktan sonra karar verir; hata içeren, politika reddi olan veya yüksek token harcayan trace'leri önceliklendirebilirsiniz. Pratik bir kurulum, güvenlikle ilgili sonuçlar için (örneğin bir içerik politikası reddi) her zaman örnekleme kuralı tanımlamak, geri kalanı için ise maliyet ve hacme göre bir oran belirlemektir.

Burada [gözlemlenebilirlik faturanızı düşürme](/tr/posts/gozlemlenebilirlik-faturasini-dusur) yazımızda ele aldığımız kardinalite ve örnekleme mantığı doğrudan geçerli: LLM trace'leri, prompt içeriği gibi yüksek kardinaliteli veri taşıdığı için depolama maliyeti hızla şişebilir, bu yüzden örnekleme oranını baştan planlamak gerekiyor. Pratikte bu, trace hacminizi haftalık izleyip depolama maliyetiniz beklenmedik şekilde arttığında örnekleme oranını gözden geçirmek anlamına geliyor; sabit bir oranla başlayıp hiç dokunmamak, altı ay sonra fark edilmeyen bir maliyet artışına dönüşebilir.

## Hassas prompt içeriğini nasıl dışa aktarmadan önce temizlersiniz?

Prompt ve yanıt metnini olduğu gibi span'e yazmak cazip görünür ama kullanıcı girdisi ev adresi, sosyal güvenlik numarası ya da tıbbi bilgi içerebilir. İki yaygın yaklaşım var: uygulama içinde çalışan bir span processor ile e-posta, telefon, kredi kartı gibi kalıpları dışa aktarımdan önce maskelemek, ya da trace'leri kendi kontrolünüzdeki bir OpenTelemetry collector'dan geçirip maskeleme kurallarını orada uygulamak. İkinci yöntem, hassas verinin ağ sınırınızı hiç terk etmemesini garanti eder.

Daha güvenli bir orta yol, tam metin yerine prompt metadata'sı tutmak: şablon kimliği, şablon sürümü, kullanılan değişken anahtarları ve tekilleştirme için bir içerik hash'i. Tam prompt metnine ihtiyaç duyduğunuz hata ayıklama durumlarında bile bunu rol tabanlı erişim, belirli bir saklama süresi ve bir denetim izi arkasına koyun.

## Bu izleme sadece hata ayıklamak için mi gerekli?

Hayır, en az onun kadar maliyet ve kalite sorularına da cevap veriyor. Aynı trace verisi, hangi prompt sürümünün daha fazla token tükettiğini, hangi kullanıcı segmentinin en uzun yanıt sürelerini aldığını ve bir model değişikliğinin (örneğin Sonnet 5'ten Sonnet 5.5'e geçişin) gecikmeyi nasıl etkilediğini de gösteriyor. Hata ayıklama bu verinin yalnızca bir kullanım alanı; asıl değer, zaman içinde biriken trace'leri geriye dönük analiz edebilmekte. Bir model geçişinden önce ve sonra aynı sorgu tipinin ortalama token sayısını ve gecikmesini karşılaştırmak, geçişin gerçek etkisini "hissediyor muyum" yerine ölçülebilir bir karşılaştırmaya dönüştürüyor.

## Bunu nasıl bir backend'e aktarırsınız?

Standart OTLP (OpenTelemetry Protocol) üzerinden, Jaeger, Honeycomb, Datadog veya kendi barındırdığınız bir Grafana Tempo kurulumuna export edebilirsiniz. GenAI attribute'larının henüz "Stable" olmaması, bazı backend'lerin bu attribute'ları özel olarak görselleştirmediği anlamına geliyor — ama ham attribute'lar her zaman trace'te mevcut, backend'iniz onları özel olarak tanımadığında bile genel attribute görünümünde görebilirsiniz.

Burada vurgulamam gereken bir nokta var: standardın "Development" statüsünde kalması, onu kullanmamak için bir sebep değil. Attribute adlarının gelecekte değişebileceğini bilerek, kendi dashboard sorgularınızı attribute adına değil mantıksal bir ara katmana (örneğin bir görünüm veya alias) bağlayın — bu sayede standart bir sonraki rename'de dashboard'larınızı elle güncellemek zorunda kalmazsınız. Token tüketimini trace seviyesinde yakaladıktan sonra, bunu takım ve özellik bazında maliyete dönüştürme konusunu [yapay zeka token harcamasını görünür kılma](/tr/posts/yapay-zeka-finops-token-harcamasi) yazımızda ele aldık — ikisi birbirini doğrudan tamamlıyor. Daha genel bir LLM gözlemlenebilirliği çerçevesi için [LLM gözlemlenebilirliği: trace ve eval](/tr/posts/llm-gozlemlenebilirligi-trace-eval) yazımıza, temel kavramlar için [Observability 101](/tr/posts/observability-nedir) yazımıza bakabilirsiniz. Diğer gözlemlenebilirlik yazıları için [DevOps & Bulut kategorimize](/tr/category/devops-bulut) göz atabilirsiniz.

## Sıkça Sorulan Sorular

### OpenTelemetry'nin GenAI standardı kararlı mı?

Hayır, 2026 ortası itibarıyla tüm `gen_ai.*` attribute'ları, span'leri ve metrikleri "Development" statüsünde, hiçbiri "Stable" değil. Standart Haziran 2026'da ayrı bir depoya taşındı ve aynı yıl içinde üç kez attribute adı değişti; yine de üretimde yaygın olarak kullanılıyor.

### Token sayısını hangi attribute'larla yakalarım?

`gen_ai.usage.input_tokens` ve `gen_ai.usage.output_tokens` güncel adlar. Eski `prompt_tokens` ve `completion_tokens` adları kullanımdan kalktı ama bazı araçlarda hâlâ görülebilir.

### Bir ajanın çok adımlı çalışmasını tek trace'te nasıl toplarım?

Her araç çağrısını ayrı bir child span olarak açıp ana LLM span'inin altına zincirleyin. Bu, "model düşündü → araç çağırdı → sonucu aldı → tekrar düşündü" akışının tamamını tek bir trace içinde görmenizi sağlar.

### Prompt içeriğindeki hassas veriyi nasıl korurum?

Dışa aktarımdan önce çalışan bir span processor ya da kendi kontrolünüzdeki bir collector ile e-posta, telefon, kredi kartı gibi kalıpları maskeleyin. Mümkünse tam metin yerine şablon kimliği, sürüm ve içerik hash'i gibi metadata tutun.
