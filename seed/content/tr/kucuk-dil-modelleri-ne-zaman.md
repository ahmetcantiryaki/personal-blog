---
title: "Küçük Dil Modelleri Ne Zaman Yeter?"
slug: "kucuk-dil-modelleri-ne-zaman"
translationKey: "small-language-models-when"
locale: "tr"
excerpt: "Her isteği frontier modele göndermek pahalı bir alışkanlık. Dar, tekrar eden görevlerde küçük, ince ayarlı bir model çoğu zaman daha iyi sonuç verir."
category: "ai"
tags: ["llm", "machine-learning", "ai-infrastructure", "cost-optimization"]
publishedAt: "2026-07-18"
seoTitle: "Küçük Dil Modelleri (SLM) Ne Zaman Yeterli?"
seoDescription: "SLM mi frontier LLM mi? Maliyet, gecikme ve doğruluk verileriyle küçük dil modellerinin kazandığı yerler ve 2026'nın standart routing deseni."
---

Küçük dil modelleri (SLM'ler) -birkaç milyon parametreden yaklaşık 7 milyar parametreye kadar olan modeller- sınırları net çizilmiş, yüksek hacimli ve tekrar eden görevlerde frontier modelleri geride bırakıyor: sınıflandırma, yönlendirme, veri çıkarma, form doldurma ve sık sorulan soru yanıtlama gibi işlerde daha ucuz, daha hızlı ve o dar görevde genellikle daha isabetli sonuç üretiyorlar. Frontier modelin gerçekten şart olduğu yer ise geniş dünya bilgisi ve öngörülemeyen, açık uçlu akıl yürütme gerektiren işler.

## Herkes Frontier Modele Koşuyor, Gerçekten Gerekli mi?

Son iki yıldır varsayılan refleks şu oldu: hangi görev olursa olsun en güçlü modele git, tokenı fazladan ödemeyi düşünme. Bu, prototip aşamasında makul bir kısayoldu. Ama üretime geçen ve trafiği artan birçok ekip aynı refleksi hâlâ sürdürüyor ve fatura buna göre şişiyor. Gerçek şu: müşteri destek talebini "iade" mi "değişim" mi diye etiketlemek, bir formdan tarih ve tutar çekmek ya da bir SSS sorusuna yanıt vermek için frontier bir modelin genel dünya bilgisine ihtiyacınız yok. Bu tür görevlerde küçük, ince ayarlı bir model çoğu zaman aynı doğruluğu -bazen daha fazlasını- çok daha düşük maliyetle ve çok daha kısa gecikmeyle veriyor. Temmuz 2026 itibarıyla sektör bu farkı artık göz ardı edilemeyecek büyüklükte ölçüyor.

## Küçük Modelin Kazandığı Yer: Dar, Tekrarlı, Yüksek Hacimli İşler

SLM'lerin öne çıktığı görevler ortak bir örüntü paylaşır: girdi şekli tahmin edilebilir, çıktı formatı sabit ve görev sayıca çok tekrar ediyor. Sınıflandırma, niyet tespiti, yönlendirme, form doldurma, alan çıkarma (extraction), duygu analizi ve sık sorulan soru yanıtlama bu kategoride klasikleşmiş örnekler. Bu görevlerin ortak noktası, modelin genel dünya bilgisine değil, dar bir problem uzayında tutarlı davranmasına ihtiyaç duyulması.

NVIDIA araştırma ekibinin ["Small Language Models are the Future of Agentic AI"](https://research.nvidia.com/labs/lpr/slm-agents/) başlıklı çalışması da benzer bir tezi savunuyor: ajan tabanlı sistemlerdeki çağrıların büyük kısmı, aslında küçük bir modelin rahatça yapabileceği dar ve tekrar eden "işler". Bunun ekonomik tarafı da değişti. 2023-2024'te 7B parametrelik bir modeli ince ayarlamak ayrı bir ML ekibi ve ciddi bir GPU bütçesi gerektiriyordu; bugün aynı iş çoğu kurulumda bir günden kısa sürede ve tek haneli dolar mertebesinde compute maliyetiyle bitiyor. [Spheron'un 2026 fine-tuning maliyet raporu](https://www.spheron.network/blog/how-to-fine-tune-llm-2026/) bu değişimi somut rakamlarla gösteriyor. Bu, [fine-tuning ile RAG](/tr/posts/fine-tuning-mi-rag-mi) arasında seçim yaparken artık maliyetin belirleyici engel olmadığı, kararın çok daha çok görev uygunluğuna dayandığı anlamına geliyor.

### Gerçek Sayılar: Maliyet, Gecikme, Doğruluk

Aşağıdaki tablo, dar kapsamlı bir görevde ince ayarlı bir SLM ile genel amaçlı bir frontier modelin tipik karşılaştırmasını özetliyor:

| Kriter | İnce Ayarlı SLM (~7B) | Frontier LLM |
|---|---|---|
| Token/istek maliyeti | 10-30 kat daha düşük | Referans (1x) |
| İlk token gecikmesi | ~10-50 ms (edge/on-device) | ~300-2000 ms |
| Dar görevde doğruluk | Genellikle eşit veya üstün | Yeterli ama gereğinden fazla kapasite |
| Açık uçlu/genel görevde doğruluk | Zayıf, veri dışı kalır | Güçlü |
| Gizlilik / veri sınırı kontrolü | Yüksek (on-prem/edge mümkün) | Sağlayıcıya bağlı |
| Dağıtım karmaşıklığı | Fine-tuning + sürüm yönetimi gerekir | Tek API çağrısı |

Bu tablodaki maliyet ve gecikme farkları [LLM token maliyetini düşürme](/tr/posts/llm-token-maliyetini-dusurme) yazısında ele aldığımız optimizasyon tekniklerinden bağımsız, sadece model seçiminden kaynaklanıyor -yani promptu kısaltmadan, önbellekleme yapmadan önce bile bu kazanç cepte.

Canlı sohbet, sesli asistan, otomatik tamamlama ya da yerel/edge asistanlar gibi gerçek zamanlı ve sınırlı etkileşimlerde gecikme tek başına belirleyici olabiliyor: kullanıcı 1-2 saniyelik ilk token beklemesini fark ediyor, 20 milisaniyeyi fark etmiyor. Bu senaryolarda modeli kendi altyapınızda çalıştırmak isterseniz [Ollama, vLLM ve llama.cpp karşılaştırmamız](/tr/posts/ollama-vllm-llamacpp-yerel-llm-calistirma) pratik bir başlangıç noktası.

## Frontier Modelin Hâlâ Şart Olduğu Yer

Bunun tersini söylemek yanıltıcı olur: SLM'ler her yerde frontier modelin yerini almıyor. Geniş dünya bilgisi gerektiren, girdi şekli önceden kestirilemeyen ve gerçekten açık uçlu akıl yürütme isteyen işlerde -karmaşık bir hukuki metni yorumlamak, yeni bir mimari kararı tartışmak, çok adımlı ve önceden planlanamayan bir araştırma görevi yürütmek- frontier model hâlâ gerekli. Küçük bir model, eğitim verisinin dışına çıkan bir soruyla karşılaştığında sessizce yanlış cevap üretme eğilimindedir; frontier model bu belirsizlikte daha sağlam kalır. [AI agent mı workflow mu](/tr/posts/ai-agent-mi-workflow-mu) yazısında değindiğimiz gibi, görevin öngörülebilirliği burada da doğru aracı seçmenin merkezinde.

## 2026'nın Standart Deseni: Yönlendirme (Routing)

Tek bir dev modelle her şeyi karşılamak yerine, 2026'da olgunlaşan ve Capgemini ile Wavestone gibi danışmanlık firmalarının trend raporlarında artık ana akım olarak işaretlediği desen şu: gelen isteklerin kabaca yüzde 80'ini -öngörülebilir, dar kapsamlı olanları- küçük bir modele yönlendirin; gerçekten karmaşık ve açık uçlu olan yüzde 20'lik kuyruğu frontier modele eskale edin. [Routing üzerine yayımlanmış 2026 mühendislik rehberleri](https://www.digitalapplied.com/blog/llm-model-routing-2026-cost-quality-optimization-engineering-guide) bu yaklaşımla faturanın yüzde 40-85 aralığında düştüğünü, gözle görülür bir kalite kaybı olmadan raporluyor.

Basitleştirilmiş bir routing katmanı şöyle görünebilir:

```python
def route_request(request):
    difficulty = estimate_difficulty(request)  # ince ayarlı sınıflandırıcı

    if difficulty == "narrow" and confidence(request) > 0.85:
        response = small_model.generate(request)
        if passes_quality_check(response):
            return response

    # düşük güven, belirsiz kapsam veya kalite kontrolünden geçemeyen
    # her şey frontier modele eskale edilir
    return frontier_model.generate(request)
```

Buradaki kritik ayrıntı, eskale kararının tek seferlik bir sınıflandırma değil, sürekli izlenen bir kalite kontrolü olması. Yönlendirme katmanının kendisini de ölçmeden bu deseni kurmak riskli; hangi isteklerin küçük modelde başarısız olduğunu görmek için [LLM çıktılarını değerlendirme](/tr/posts/llm-ciktilari-degerlendirme) pratiklerini ve [LLM gözlemlenebilirliği ile trace/eval altyapısını](/tr/posts/llm-gozlemlenebilirligi-trace-eval) routing katmanınıza baştan entegre etmeniz gerekiyor.

## Build vs Route: Karar Kontrol Listesi

Bir görevi küçük modele mi taşımalısınız, yoksa frontier model + routing mi kurmalısınız? Karar verirken şu soruları sırayla sorun:

- **Hacim yeterince yüksek mi?** Ayda birkaç yüz istekte fine-tuning yatırımı genelde kendini amortize etmez; on binlerce istekte hemen eder.
- **Girdi/çıktı şekli sabit mi?** Format öngörülebilirse (etiket kümesi, form alanları, sabit JSON şeması) SLM güçlü bir aday.
- **Etiketli veya sentetik eğitim verisi üretebiliyor musunuz?** Fine-tuning için birkaç bin kaliteli örnek genelde yeterli; veri yoksa önce onu üretmek gerekir.
- **Gecikme veya gizlilik sert bir kısıt mı?** Cevap evetse SLM/on-device seçenek neredeyse zorunlu hale gelir.
- **Kuyrukta gerçekten açık uçlu senaryolar var mı?** Varsa, o kuyruk için ayrı bir eskale yolu (frontier model) kurmadan SLM'e tam geçiş yapmayın.
- **İzleme ve eval altyapınız var mı?** Yoksa önce onu kurun; routing'in kalitesi, kalite kontrolünüzün kalitesinden iyi olamaz.

Bu listeden üç veya daha fazlasına "evet" diyorsanız, muhtemelen bir sonraki adımınız frontier model faturanızı büyütmek değil, dar kapsamlı bir SLM'i fine-tune edip routing katmanının arkasına koymak olmalı.

## Sıkça Sorulan Sorular

### SLM tam olarak nedir, kaç parametreli modelleri kapsar?

Genel kabul gören tanım, birkaç milyon parametreden yaklaşık 7 milyar parametreye kadar olan, tek bir tüketici cihazında veya mütevazı bir sunucuda makul gecikmeyle çalışabilen modelleri kapsıyor. Üst sınır kesin değil; bazı kaynaklar 10 milyar parametreye kadar olan modelleri de SLM sayıyor.

### Küçük model kaç istekte kendini amorti eder?

Kesin eşik iş yüküne göre değişir, ama pratikte aylık on binlerce isteğe ulaşan dar kapsamlı görevlerde fine-tuning ve dağıtım maliyeti genellikle birkaç hafta içinde frontier model faturasının üzerinde tasarrufa dönüşüyor.

### Routing katmanını kurmak karmaşık mı?

Temel hâliyle değil: bir zorluk sınıflandırıcısı, bir güven eşiği ve bir kalite kontrolü yeterli başlangıç noktası. Zor kısım kurulum değil, hangi isteklerin küçük modelde başarısız olduğunu sürekli izlemek ve eşikleri buna göre ayarlamak.

### SLM'e geçmek RAG'i gereksiz kılar mı?

Hayır, ikisi farklı problemleri çözüyor. RAG modele güncel veya özel bilgi sağlar, fine-tuning ise modelin davranışını ve format tutarlılığını değiştirir. Birçok üretim sisteminde ikisi birlikte, hatta aynı routing katmanının farklı dallarında kullanılıyor.
