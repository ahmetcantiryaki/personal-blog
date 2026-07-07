---
title: "LLM Çıktıları Nasıl Değerlendirilir"
slug: "llm-ciktilari-degerlendirme"
translationKey: "evaluate-llm-outputs"
locale: "tr"
category: "ai"
tags: ["llm", "evals", "ai-reliability", "testing"]
publishedAt: "2026-07-02"
excerpt: "LLM çıktılarını kod test eder gibi değerlendirin: altın set kurun, metrik seçin, kod ve LLM-hakem kontrolleri çalıştırın, her dağıtımı bir sayıyla geçitleyin."
seoTitle: "LLM Çıktıları Nasıl Değerlendirilir (2026)"
seoDescription: "LLM çıktılarını değerlendirin: altın veri seti kurun, metrik seçin, kod ve LLM-hakem kontrolleri çalıştırın, dağıtımı skora göre geçitleyin. Güncel 2026 araçları ve sayılarıyla."
---

Haziran 2026'da bir salı günü ekipten biri destek sınıflandırıcımıza tek kelimelik bir prompt değişikliği gönderdi: dokümanla uyumlu olsun diye "kategorize et" ifadesini "sınıflandır" yaptı. Zararsız görünüyordu. Kimse eval takımını lokalde çalıştırmadığı için yeşil birleşti. Kırk dakika sonra iade talepleri faturalandırma kuyruğuna düşmeye başladı. Model "sınıflandır" ifadesini sessizce daha dar bir talimat gibi okumuş ve iade niyetlerinin yaklaşık %6'sını yere düşürmüştü.

Çözüm daha akıllı bir model değildi. Bir geçitti. LLM çıktılarını güvenilir biçimde değerlendirmek için gerçek girdilerden ve bilinen doğru cevaplardan oluşan sabit bir veri seti kurar, geçti/kaldı metrikleri tanımlar ve her prompt ya da model değişikliğini bu sete karşı otomatik olarak puanlarsınız. Bütün mesele bu: "çıktı iyi görünüyor" cümlesini takip edip karşılaştırabileceğiniz ve bir dağıtımı bloke edebileceğiniz bir sayıya çevirmek. Eval'ler, olasılıksal sistemlerin birim testleridir.

Her hafta LLM özellikleri yayına alıyoruz ve güvenilirlikteki en büyük sıçrama daha iyi bir modelden gelmedi. Düzgün bir eval takımından geldi. Aşağıda tam sürecin kendisi, güvendiğimiz metrikler ve Temmuz 2026 itibarıyla güncel araç manzarası var.

## LLM eval'leri nedir ve neden gereklidir?

Bir LLM eval'i, modelin çıktısını tanımlanmış bir beklentiye karşı puanlayan otomatik bir testtir; böylece kaliteyi örnek gözlemek yerine nesnel olarak ölçersiniz. Bir prompt'u, modeli ya da retrieval adımını her değiştirdiğinizde sabit veri seti üzerinde çalıştırır ve skoru bir önceki çalıştırmayla karşılaştırırsınız.

Eval olmadan körlemesine uçarsınız. Bir cümleyi düzelten değişiklik sessizce üç örneği bozar ve bunu ancak kızgın bir kullanıcı yazınca öğrenirsiniz. Elle örnek kontrolü birkaç örneğin ötesine ölçeklenmez ve tekrarlanabilir değildir.

Eval'ler size üç şey verir:

- **Regresyon güvenliği.** Kalite düşüşünü, tıpkı yukarıdaki yönlendirme hatası gibi, üretime ulaşmadan yakalarsınız.
- **Karşılaştırılabilirlik.** GPT-5.5'in Claude Opus 4.8'i *sizin göreviniz için* geçip geçmediğine, halka açık bir sıralama tablosuna değil, nesnel olarak karar verirsiniz. Temmuz 2026 itibarıyla Opus 4.8, LLM Stats toplam skorunda 67,9 ile GPT-5.5'in 62,9'unun önünde; ama bu sıralama sizin çıkarım şemanız hakkında hiçbir şey söylemez.
- **Ortak bir "iyi" tanımı.** Ekibiniz değerlendirme ölçütünü bir kez tartışır, sonra sayılar anlaşmazlıkları çözer.

## LLM çıktıları adım adım nasıl değerlendirilir?

LLM çıktılarını değerlendirmek tekrarlanabilir bir hattır: gerçek girdileri toplayın, doğru çıktıları etiketleyin, metrik seçin, değerlendiricileri çalıştırın ve dağıtımı skora göre geçitleyin. Sıfırdan çalışan bir eval takımına ulaşmak için şu sekiz adımı izleyin.

1. **Altın veri seti toplayın.** Loglardan veya destek taleplerinden 50-200 gerçek girdi çekin. Yalnız mutlu yolu değil, çirkin uç durumları da dâhil edin. Bu set sizin doğruluk zemininizdir.
2. **Beklenen çıktıları etiketleyin.** Her girdi için doğru cevabı ya da kabul kriterini yazın. Bunu bir insan uzman bir kez yapar; tüm sistemin en değerli varlığıdır.
3. **Göreve göre metrik seçin.** Sınıflandırma için doğruluk ve F1. Çıkarım için alan bazında tam eşleşme. Açık uçlu üretim için LLM hakem ya da bir rubrik. Metriği çıktı biçimine uydurun.
4. **Değerlendiriciler yazın.** Cevabın belirlenimci olduğu her yerde kod tabanlı kontrolleri (regex, JSON şeması, dize eşleşmesi) tercih edin. Hızlı, bedava ve asla titremezler.
5. **Öznel kalite için LLM-hakem ekleyin.** Ton, yardımseverlik ya da veriye sadakat için güçlü bir modele, 1-5 ölçeği ve zorunlu gerekçeyle bir rubriğe göre çıktıyı puanlatın.
6. **Tüm takımı çalıştırın.** Bütün örnekleri koşun, örnek başına geçti/kaldı ile toplam skoru kaydedin ve sonradan karşılaştırabilmek için çalıştırmayı saklayın.
7. **Eşik koyun ve geçitleyin.** Skor barınızın altına düşerse dağıtımı bloke edin; çekirdek sette %90 geçme kullanıyoruz. Kırmızı bir eval'e başarısız bir test gibi davranın.
8. **Seti hatalardan büyütün.** Her üretim hatası yeni bir eval örneğine dönüşür. O iade hatası artık 147 numaralı örnek. Takım tam da canınızın yandığı yerde güçlenir.

## Hangi eval yöntemlerini kullanmalısınız?

Çıktının ne kadar belirlenimci olduğuna uyan değerlendirme yöntemini seçin. Belirlenimci çıktılar ucuz kod kontrolleri alır; öznel çıktılar bir hakeme ihtiyaç duyar. Gerçek takımların çoğu aşağıdaki üçünü de karıştırır.

| Yöntem | En uygun olduğu yer | Maliyet | Güvenilirlik | Örnek |
|--------|---------------------|---------|--------------|-------|
| Tam eşleşme | Sınıflandırma, etiketler | Bedava | Çok yüksek | Niyet == "iade" mi? |
| Şema / regex | Yapılandırılmış çıkarım | Bedava | Çok yüksek | `tutar` alanlı geçerli JSON mu? |
| Anlamsal benzerlik | Başka sözcüklerle cevap | Düşük | Orta | Embedding kosinüs > 0.85 |
| LLM-hakem | Ton, sadakat | Orta | Orta-yüksek | "Yardımseverliği 1-5 puanla" |
| İnsan incelemesi | Nihai onay, kalibrasyon | Yüksek | En yüksek | Haftalık örnek denetimi |

Tablonun tepesinden başlayın ve ucuz satırlar kriterinizi ifade edemediğinde pahalı satırlara uzanın. Örneklerimizin kabaca %70'ini saf kodla puanlarız; bu, tam bir eval çalıştırmasını 30 saniyenin altında ve neredeyse sıfır maliyette tutar. Görüşüm net: takımınızın yarısından fazlası bir hakemden geçiyorsa, göreviniz muhtemelen kabul ettiğinizden daha yapılandırılmıştır ve bir regex'in çözeceği kontroller için gecikme ve para ödüyorsunuzdur.

## Kodda gerçek bir eval neye benzer?

Aşağıda CI'da çalıştırdığımız değerlendirme donanımının kırpılmış bir sürümü var. JSONL altın setini yükler, modeli çağırır ve bir kod değerlendiricisi ile isteğe bağlı bir hakem uygular.

```python
import json
from statistics import mean

def grade_case(case, output):
    # Kod tabanlı değerlendirici: belirlenimci ve bedava
    if case["type"] == "extraction":
        try:
            parsed = json.loads(output)
        except json.JSONDecodeError:
            return 0.0
        return 1.0 if parsed.get("amount") == case["expected"]["amount"] else 0.0
    # Açık uçlu cevaplar için LLM-hakeme geç
    return llm_judge(case["input"], output, case["rubric"])

def run_evals(dataset, model):
    scores = []
    for case in dataset:
        output = model(case["input"])
        score = grade_case(case, output)
        scores.append(score)
        if score < 1.0:
            print(f"KALDI: {case['id']} -> {output[:80]}")
    return mean(scores)

data = [json.loads(l) for l in open("gold_set.jsonl")]
score = run_evals(data, my_model)
assert score >= 0.90, f"Eval geriledi: {score:.2%}"
```

Sondaki `assert` geçidin kendisidir. Bunu CI'a bağlayın; kötü bir prompt asla birleşmesin. Diğer kodu zaten böyle test ediyorsanız, eval'ler [sağlam birim testleri yazma](/tr/posts/unit-test-nasil-yazilir) mantığına doğrudan oturur.

## 2026'da hangi eval araçları kullanmaya değer?

Her şeyi elle yazmak zorunda değilsiniz. Manzara bu yıl tanıdık bir şekle oturdu: CI geçitlemesi için hafif bir çerçeve ile açıklama ve panolar için bir platformun eşleşmesi.

| Araç | Tür | En uygun olduğu yer | CI geçitleme | Temmuz 2026 notu |
|------|-----|---------------------|--------------|------------------|
| OpenAI Evals | Açık kaynak (MIT) | Tekrarlanabilir benchmark tarzı koşular | Manuel | ~18,5k GitHub yıldızı |
| DeepEval | Açık kaynak | Metrik zengini birim testler | Yerel, pytest tarzı | v4.0.3, 50+ metrik, agent izleri |
| Inspect AI | Açık kaynak | Titiz, denetlenebilir eval'ler | Evet | v0.3.225, UK AI Security Institute |
| Braintrust | Ticari | Veri setleri + regresyon panoları | GitHub Action birleştirmeyi bloke eder | Şubat 2026'da 80M$ Seri B |
| Promptfoo | Ticari | Red-team ve güvenlik testi | Bildirimsel CLI | Mart 2026'da OpenAI tarafından satın alındı |
| LangSmith | Ticari | LangChain/LangGraph izleme | Evet | Plus planı ~39$/koltuk/ay |

Mühendislik odaklı takımların çoğu CI geçidi için bir açık kaynak koşucu, insan incelemesi için bir platform seçer. Biz CI'da [DeepEval](https://github.com/confident-ai/deepeval) çalıştırıp haftalık denetim için bir [Braintrust](https://www.braintrust.dev/) panosu tutuyoruz. En denetlenebilir açık kaynak koşucuyu istiyorsanız UK AI Security Institute'un [Inspect AI](https://inspect.aisi.org.uk/) aracını geçmek zor; benchmark tarzı registry koşuları için de [OpenAI Evals](https://github.com/openai/evals) hâlâ referans. Ne seçerseniz seçin, geçit bir satıcının arayüzünde değil, sizin hattınızda yaşar.

## LLM-hakemi nasıl dürüst tutarsınız?

Bir LLM hakem zamanla kayar, bu yüzden güvenmeden önce insan etiketlerine karşı kalibre edersiniz. 20-30 örneği elle puanlayın, hakemi aynı örneklerde çalıştırın ve uyumu ölçün. Aşmanız gereken bar, insanların kendi arasındaki uyumdur: güçlü hakemler yaklaşık %80'e oturur, yani iki insanın anlaşma oranına. Sizin göreviniz için ~%85'in altındaysa rubriği sıkılaştırın ya da hakem modelini değiştirin.

Bizde bozulan şey: ilk hakemimiz neredeyse her şeye 4 ya da 5 verdi, çünkü rubrik "kaliteyi puanla" diyordu. Belirsiz rubrikler belirsiz skor üretir. Bunu açık ikili kriterlere ("Cevap bir kaynak gösteriyor mu? E/H. Konuda kalıyor mu? E/H.") çevirmek, hakem-insan uyumunu %72'den %94'e çıkardı.

Yanlılık literatürüne de göz kulak olun. 2026 tarihli bir RAND çalışması, hiçbir hakemin benchmark'lar arasında tekdüze güvenilir olmadığını; sınır modellerinin en zor yanlılık testlerinde %50'nin üstünde hata verdiğini buldu. Adı konmuş başarısızlık türleri artık bir kanon: pozisyon, konuşkanlık, kendini kayırma, biçim ve kalibrasyon kayması. Yalnızca pozisyon yanlılığı, yakın ikili karşılaştırmalarda 10-15 puanlık kazanma oranı sapması yaratır; bu yüzden iki cevabı A'ya-karşı-B kıyaslıyorsanız her çifti iki yönde de çalıştırıp ortalamasını alın.

Hakemleri güvenilir tutan üç kural:

- **Skordan önce gerekçe zorlayın.** Önce muhakeme yapan puanlama ölçülebilir biçimde daha tutarlıdır.
- **Test edilenden farklı, daha güçlü bir modeli** hakem yapın; bir modelin kendi üslubunu onaylamasını önleyin.
- **Hakem modelini değiştirdiğinizde yeniden kalibre edin.** Hakem yükseltmesi sessiz bir puanlama değişikliğidir; üstelik 30 Haziran 2026'da Claude Sonnet 5 yeni varsayılan olarak gelince pek çok hat farkında olmadan hakem değiştirdi.

İyi hakemlerin arkasındaki prompt yapısı için [prompt mühendisliği teknikleri](/tr/posts/prompt-muhendisligi-teknikleri) yazımız, dayandığımız rubrik ve few-shot püf noktalarını anlatıyor.

## Eval'ler güvenilirlik yığınının neresinde durur?

Eval'ler her diğer güvenilirlik taktiğinin altındaki ölçüm katmanıdır. Veriye dayandırmanın, retrieval'ın ya da bir reddetme eşiğinin gerçekten işe yarayıp yaramadığını, yoksa hatayı yalnız yer değiştirtip değiştirmediğini size söylerler. Bunları [LLM halüsinasyonlarını azaltma](/tr/posts/llm-halusinasyon-azaltma) rehberimizdeki savunmalarla eşleştirin; özelliğiniz retrieval'a bağlıysa onu ayrıca [RAG sistemi nasıl kurulur](/tr/posts/rag-sistemi-nasil-kurulur) fikirleriyle değerlendirin.

Eval'leri üç tetikleyicide çalıştırın: her prompt ya da model değişikliğinde, taze üretim örneklerine karşı gecelik programda ve her dağıtımdan önce. Nerede ne inşa edeceğinize karar veriyorsanız, [AI agent mı workflow mu](/tr/posts/ai-agent-mi-workflow-mu) yazımız bağlamı veriyor. Tüm küme [Yapay Zeka](/tr/category/yapay-zeka) merkezinde toplanıyor.

## Sıkça Sorulan Sorular

### Bir LLM eval seti kaç örnek gerektirir?

Binlerce rastgele örnekle değil, gerçek hata modlarınızı kapsayan iyi seçilmiş 50-100 örnekle başlayın. Uç durumların kapsanması, hacimden çok daha önemlidir. Üretim yeni bir hata gösterdikçe seti büyütün; özenle seçilmiş 150 örneklik bir set, filtrelenmemiş 2.000 örneklik bir yığından iyidir.

### Eval'ler ile benchmark'lar arasındaki fark nedir?

Benchmark'lar, halka açık veri setlerinde modelin genel yeteneğini ölçer. Eval'ler *sizin* modelinizi *sizin* görevinizde *sizin* verinizle ölçer. Bir model her 2026 sıralamasında zirveye çıkıp yine de sizin çıkarım şemanızda kalabilir. Halka açık bir sıralamaya güvenmeden önce LLM çıktılarını daima kendi altın setinize karşı değerlendirin.

### LLM çıktılarını değerlendirmek için LLM kullanabilir miyim?

Evet, LLM-hakem ton ve sadakat gibi öznel nitelikler için standarttır; ancak önce insan etiketlerine karşı kalibre etmeli ve her skoru gerekçelendirmeye zorlamalısınız. Belirlenimci olan her şey için kod tabanlı değerlendiriciler kullanın ve hakemi gerçekten bir kuralla kontrol edemediğiniz çıktılara saklayın.

### Eval'leri ne sıklıkla çalıştırmalıyım?

Tam takımı her prompt ya da model değişikliğinde çalıştırın ve skor gerilerse birleştirmeyi bloke edin. Kaymayı yakalamak için taze üretim örneklerine karşı gecelik bir çalıştırma, hakemlerinizi kalibre tutmak için de küçük bir örnek üzerinde haftalık insan denetimi ekleyin.
