---
title: "LLM Ağ Geçidi Nedir? Üretimde Model Yönlendirme"
slug: "llm-ag-gecidi-model-yonlendirme"
translationKey: "llm-inference-gateway-2026"
locale: "tr"
excerpt: "LLM ağ geçidi, birden fazla model sağlayıcısı arasında yönlendirme, failover ve maliyet sınırlaması yapan bir katmandır; tek sağlayıcıya bağımlılığı önler."
category: "devops-cloud"
tags: [llm, api-design, cost-optimization, observability]
publishedAt: "2026-09-24"
seoTitle: "LLM Ağ Geçidi Nedir? Model Yönlendirme Rehberi"
seoDescription: "LLM ağ geçidi, birden çok sağlayıcı arasında yönlendirme, failover ve maliyet kontrolü sağlar. LiteLLM, Portkey ve Kong AI Gateway karşılaştırması burada."
---

Kısa cevap: LLM ağ geçidi, uygulamanızla Claude, GPT ve Gemini gibi model sağlayıcıları arasına koyduğunuz bir ara katmandır; tek bir API arayüzü sunar, sağlayıcı çökerse otomatik olarak diğerine geçer, ekip başına bütçe sınırı koyar ve isteği hangi modelin karşılayacağına maliyet, gecikme veya görev tipine göre karar verir. Bu, doğrudan sağlayıcı SDK'sını uygulama koduna gömmek yerine, o kararı tek bir merkezi katmana devretmek anlamına geliyor ve ekibin sağlayıcı değişikliklerini tek bir yerden yönetmesini sağlıyor.

## Bir ekip neden ağ geçidine ihtiyaç duyar?

Tek bir sağlayıcıya doğrudan bağlanan bir uygulama, o sağlayıcının kesintisini doğrudan kullanıcıya taşır. Geçen ay Claude API'de yaşanan kısa süreli bir kesinti sırasında, ağ geçidi arkasında çalışan bir ekip trafiği otomatik olarak GPT'ye kaydırıp kullanıcıların hiçbir şey fark etmemesini sağladı; doğrudan entegre olan komşu ekip ise aynı saatte tam kesinti yaşadı. Aradaki fark, kod satırı değil, aylar önce alınmış bir mimari karardı.

Ağ geçidinin asıl değeri dört yerde toplanıyor: sağlayıcılar arası otomatik failover, sanal anahtar (virtual key) ile kimlik doğrulama ve ekip başına harcama tavanı, isteklerin görev tipine, maliyete veya gecikmeye göre yönlendirilmesi ve tek noktadan gözlemlenebilirlik. Bunların hiçbiri uygulama kodunuza sağlayıcıya özel mantık yazmadan elde edilemez — ağ geçidi bu mantığı tek bir yere topluyor.

Sanal anahtar kavramı özellikle küçük ekipler için pratik bir kazanım: gerçek sağlayıcı API anahtarlarınızı hiçbir uygulama koduna veya geliştiriciye doğrudan vermeden, her ekip veya proje için ayrı bir "sanal" anahtar oluşturup bu anahtara aylık bir dolar tavanı bağlayabiliyorsunuz. Bir proje beklenmedik şekilde çok fazla token tüketmeye başlarsa, ağ geçidi o anahtarı otomatik olarak durduruyor — gerçek anahtar hiçbir zaman sızdırılma riskiyle karşı karşıya kalmıyor çünkü uygulama kodu ona hiç dokunmuyor.

## Açık kaynak mı, yönetilen hizmet mi: hangisini seçmeliyim?

LiteLLM, kendi sunucunuzda barındırdığınız açık kaynak seçenek; OpenAI uyumlu tek bir protokol üzerinden 100'den fazla sağlayıcıyı destekliyor ve sanal anahtar bazlı bütçeleme ile birlikte bir gösterge paneli sunuyor. Bedeli, işletim sorumluluğunun tamamen size kalması.

Portkey ise yönetilen bulut hizmeti: daha cilalı bir arayüz, daha geniş sağlayıcı kapsamı, semantik önbellekleme ve guardrail (koruma kuralı) özellikleri sunuyor ama kendi sunucunuzda barındırma seçeneği sınırlı. Fiyatlandırması log hacmine göre ölçekleniyor; Pro planı aylık 49 dolardan başlıyor.

Kong AI Gateway ise farklı bir başlangıç noktasından geliyor: zaten Kong'u API yönetimi için kullanan kurumlar için mantıklı, çünkü LLM trafiğini mevcut Kong dağıtımına eklemenin marjinal maliyeti düşük. Sıfırdan sadece AI trafiği için bir platform kuruyorsanız Kong'a bağlı kalma yükü olmadan Portkey veya LiteLLM genelde daha iyi bir başlangıç noktası.

| Ağ Geçidi | Model | Barındırma | Öne çıkan özellik |
|---|---|---|---|
| LiteLLM | Açık kaynak | Kendi sunucunuz | 100+ sağlayıcı, OpenAI uyumlu protokol |
| Portkey | Yönetilen SaaS | Portkey bulutu | Semantik önbellekleme, guardrail, Pro $49/ay'dan başlıyor |
| Kong AI Gateway | Mevcut platforma eklenti | Kendi sunucunuz veya bulut | Kong API yönetimiyle tek platform |

## Hangi yönlendirme stratejisini seçmeliyim?

Dört yaygın strateji var ve genelde birlikte kullanılıyorlar; bir ekip tek bir stratejiye bağlı kalmak yerine görev tipine göre önce ucuz modeli deneyip, düşük güven skoru dönerse kaliteye göre yönlendirmeye geçmek gibi katmanlı bir kural seti tanımlıyor. Görev tipine göre yönlendirme, basit sınıflandırma isteklerini ucuz bir modele (örneğin Gemini Flash ailesi), karmaşık akıl yürütme gerektiren işleri daha pahalı bir frontier modele gönderir. Maliyete göre yönlendirme, aynı kalite eşiğini karşılayan sağlayıcılar arasında en ucuzunu seçer. Gecikmeye göre yönlendirme, bölgesel API gecikmesi arttığında trafiği başka bir bölgeye veya sağlayıcıya kaydırır. Kaliteye göre yönlendirme ise bir modelin yanıtı düşük güven skoruyla döndüğünde isteği otomatik olarak daha güçlü bir modele tekrar gönderir.

```yaml
# LiteLLM proxy config örneği
model_list:
  - model_name: gpt-oturum
    litellm_params:
      model: claude-sonnet-5
      api_key: os.environ/ANTHROPIC_API_KEY
  - model_name: gpt-oturum
    litellm_params:
      model: gpt-6-astra
      api_key: os.environ/OPENAI_API_KEY

router_settings:
  routing_strategy: latency-based-routing
  fallbacks: [{"gpt-oturum": ["gpt-6-astra", "claude-sonnet-5"]}]
```

Bu örnekte aynı model adı (`gpt-oturum`) iki farklı sağlayıcıya işaret ediyor; LiteLLM proxy'si gecikmeye göre aralarında yönlendirme yapıyor ve biri başarısız olursa listedeki sıradakine düşüyor. Uygulama kodu tek bir model adına istek gönderiyor; hangi sağlayıcının o isteği gerçekten karşıladığı tamamen proxy yapılandırmasının kontrolünde, yani bir sağlayıcı değişikliği uygulamanın hiçbir satırını değiştirmeden yapılabiliyor.

## Ağ geçidi eklemenin riskleri neler?

Üç risk gerçek ve göz ardı edilmemeli. Birincisi eklenen gecikme: her istek artık bir ara katmandan geçiyor, bu da tipik olarak birkaç milisaniye ek gecikme demek — düşük gecikme gerektiren gerçek zamanlı uygulamalarda bu fark hissedilebilir. İkincisi tek arıza noktası riski: ağ geçidinin kendisi çökerse, arkasındaki tüm sağlayıcılar sağlıklı olsa bile trafiğiniz durur; bu yüzden ağ geçidini yüksek erişilebilirlikli ve kendi başına izlenen bir bileşen olarak kurmak gerekiyor. Üçüncüsü prompt cache geçersizleşmesi: sağlayıcı A'da biriken önbellek, trafiği sağlayıcı B'ye kaydırdığınızda işe yaramaz hale gelir — bu, [inline tools ile prompt cache'i koruma yöntemlerini](/tr/posts/claude-inline-tools-nedir) ele aldığımız yazıda bahsettiğimiz cache mantığından tamamen farklı bir katmanda yaşanan bir maliyet.

Bize göre bir ağ geçidi kurmanın eşiği net: tek bir sağlayıcıya bağımlılığın iş sürekliliği riski taşıdığı anda (üretimde, tek başına deneme aşamasında değil) ağ geçidi yatırımı kendini amorti ediyor. Daha küçük, tek sağlayıcılı bir prototip için bu karmaşıklığı baştan eklemek zamansız bir optimizasyon.

## Semantik önbellekleme ve birleşik gözlemlenebilirlik ne katıyor?

Sıradan bir HTTP önbelleği yalnızca birebir aynı isteği tekrar geldiğinde işe yarar; semantik önbellekleme ise anlamca aynı olan ama farklı kelimelerle sorulmuş iki isteği de eşleştirebiliyor — "İstanbul'da hava nasıl?" ile "İstanbul'un bugünkü hava durumu nedir?" isteklerini aynı önbellek girdisine yönlendirmek gibi. Portkey bu özelliği doğrudan sunuyor; LiteLLM'de ise semantik eşleştirme genelde ayrı bir vektör veritabanı entegrasyonu gerektiriyor, bu da kurulum karmaşıklığını artırıyor ama tam kontrolü elinizde tutuyor.

Ağ geçidinin ikinci büyük kazancı, sağlayıcı başına ayrı ayrı log toplama zorunluluğunu ortadan kaldırması. Doğrudan entegrasyonlarda her sağlayıcının kendi log formatı, kendi maliyet raporu ve kendi hata kodları vardır; ağ geçidi bunların hepsini tek bir şemaya normalize ediyor. Pratikte bu, "geçen hafta hangi model ailesi en çok maliyete yol açtı" gibi bir soruyu üç ayrı fatura yerine tek bir gösterge panelinden cevaplayabilmek anlamına geliyor.

## Sıkça Sorulan Sorular

### LLM ağ geçidi ile API proxy arasındaki fark nedir?

Kısa cevap: Basit bir proxy sadece isteği iletir; LLM ağ geçidi bunun üstüne sağlayıcılar arası failover, sanal anahtar bazlı bütçe kontrolü, yönlendirme mantığı ve birleşik gözlemlenebilirlik ekler. Proxy tek sağlayıcıyı gizlerken, ağ geçidi birden fazla sağlayıcıyı tek arayüz altında yönetir.

### LiteLLM mi Portkey mi tercih etmeliyim?

Kısa cevap: Kendi sunucunuzda barındırmayı ve işletim kontrolünü önemsiyorsanız LiteLLM; daha az operasyonel yük ve hazır semantik önbellekleme/guardrail istiyorsanız Portkey daha uygun. Zaten Kong kullanan kurumlar için Kong AI Gateway üçüncü bir makul seçenek.

### LLM ağ geçidi eklemek ne kadar gecikme ekliyor?

Kısa cevap: Tipik olarak birkaç milisaniye ek gecikme oluşur çünkü istek ek bir ağ atlaması yapıyor. Gerçek zamanlı, düşük gecikme gerektiren uygulamalarda bu farkı ölçüp kabul edilebilir olup olmadığına karar vermek gerekiyor.

**Kaynaklar:** [Deepak Gupta: 2026'nın en iyi 5 AI ağ geçidi](https://guptadeepak.com/tools/top-5-ai-gateways-2026/), [Portkey vs LiteLLM karşılaştırması](https://medium.com/@adnanmasood/portkey-vs-litellm-routing-fallbacks-cost-tracking-and-control-the-llm-gateway-playbook-part-195855dc25c3), [Zuplo: 2026 AI ağ geçidi alıcı rehberi](https://zuplo.com/learning-center/best-ai-gateway-buyers-guide).
