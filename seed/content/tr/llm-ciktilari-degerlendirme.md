---
title: "LLM Çıktıları Nasıl Değerlendirilir"
slug: "llm-ciktilari-degerlendirme"
translationKey: "evaluate-llm-outputs"
locale: "tr"
excerpt: "LLM değerlendirme eval'leri: altın veri seti kurma, metrik seçme, kod tabanlı ve LLM-hakem kontrolleri çalıştırma ve her dağıtımı skora göre geçitleme rehberi."
category: "ai"
tags: ["llm", "evals", "ai-reliability", "testing"]
publishedAt: "2026-06-28"
seoTitle: "LLM Çıktıları Nasıl Değerlendirilir"
seoDescription: "LLM değerlendirme eval'leri: altın veri seti kurun, metrik seçin, kod ve LLM-hakem kontrolleri çalıştırın ve her dağıtımı skora göre geçitleyin. Gerçek sayılarla."
---

LLM çıktılarını değerlendirmek için gerçek girdilerden ve bilinen doğru cevaplardan oluşan sabit bir veri seti kurun, geçti/kaldı metrikleri tanımlayın ve her model ya da prompt değişikliğini bu sete karşı otomatik eval'lerle puanlayın. LLM değerlendirme eval'lerinin özü budur: "çıktı iyi görünüyor" cümlesini takip edip karşılaştırabileceğiniz ve bir dağıtımı geçitleyebileceğiniz bir sayıya çevirmek. Eval'ler, olasılıksal sistemlerin birim testleridir.

Her hafta LLM özellikleri yayına alıyoruz ve güvenilirlikteki en büyük sıçrama daha iyi bir modelden gelmedi. Düzgün bir eval takımından geldi. Aşağıda tam sürecin kendisi, güvendiğimiz metrikler ve nerede bozulduğu var.

## LLM eval'leri nedir ve neden gereklidir?

Bir LLM eval'i, modelin çıktısını tanımlanmış bir beklentiye karşı puanlayan otomatik bir testtir; böylece kaliteyi örnek gözlemek yerine nesnel olarak ölçersiniz. Bir prompt'u, modeli ya da retrieval adımını her değiştirdiğinizde sabit veri seti üzerinde çalıştırır ve skoru bir önceki çalıştırmayla karşılaştırırsınız.

Eval olmadan körlemesine uçarsınız. Bir cümleyi düzelten prompt değişikliği sessizce üç örneği bozar ve bunu ancak kullanıcı şikâyet edince öğrenirsiniz. Elle örnek kontrolü birkaç örneğin ötesine ölçeklenmez ve tekrarlanabilir değildir.

Eval'ler size üç şey verir:

- **Regresyon güvenliği.** Kalite düşüşünü üretime ulaşmadan yakalarsınız.
- **Karşılaştırılabilirlik.** GPT-5.1'in Claude Opus 4.8'i *sizin göreviniz için* geçip geçmediğine, halka açık bir sıralama tablosuna değil, nesnel olarak karar verirsiniz.
- **Ortak bir "iyi" tanımı.** Ekibiniz değerlendirme ölçütünü bir kez tartışır, sonra sayılar anlaşmazlıkları çözer.

## LLM çıktıları adım adım nasıl değerlendirilir?

LLM çıktılarını değerlendirmek tekrarlanabilir bir hattır: gerçek girdileri toplayın, doğru çıktıları etiketleyin, metrik seçin, değerlendiricileri çalıştırın ve dağıtımı skora göre geçitleyin. Sıfırdan çalışan bir eval takımına ulaşmak için şu sekiz adımı izleyin.

1. **Altın veri seti toplayın.** Loglardan veya destek taleplerinden 50-200 gerçek girdi çekin. Yalnız mutlu yolu değil, çirkin uç durumları da dâhil edin. Bu set sizin doğruluk zemininizdir.
2. **Beklenen çıktıları etiketleyin.** Her girdi için doğru cevabı ya da kabul kriterini yazın. Bunu bir insan uzman bir kez yapar; tüm sistemin en değerli varlığıdır.
3. **Göreve göre metrik seçin.** Sınıflandırma için doğruluk ve F1. Çıkarım için alan bazında tam eşleşme. Açık uçlu üretim için LLM hakem ya da bir rubrik. Metriği çıktı biçimine uydurun.
4. **Değerlendiriciler yazın.** Cevabın belirlenimci olduğu her yerde kod tabanlı kontrolleri (regex, JSON şeması, dize eşleşmesi) tercih edin. Hızlı, bedava ve asla titremezler.
5. **Öznel kalite için LLM-hakem ekleyin.** Ton, yardımseverlik ya da veriye sadakat için güçlü bir modele, 1-5 ölçeği ve zorunlu gerekçeyle bir rubriğe göre çıktıyı puanlatın.
6. **Tüm takımı çalıştırın.** Bütün örnekleri koşun, örnek başına geçti/kaldı ile toplam skoru kaydedin. Sonradan karşılaştırabilmek için çalıştırmayı saklayın.
7. **Eşik koyun ve geçitleyin.** Skor barınızın altına düşerse dağıtımı bloke edin (çekirdek sette %90 geçme kullanıyoruz). Kırmızı bir eval'e başarısız bir test gibi davranın.
8. **Seti hatalardan büyütün.** Her üretim hatası yeni bir eval örneğine dönüşür. Takım tam da canınızın yandığı yerde güçlenir.

## Hangi eval yöntemlerini kullanmalısınız?

Çıktının ne kadar belirlenimci olduğuna uyan değerlendirme yöntemini seçin. Belirlenimci çıktılar ucuz kod kontrolleri alır; öznel çıktılar bir hakeme ihtiyaç duyar. Gerçek takımların çoğu aşağıdaki üçünü de karıştırır.

| Yöntem | En uygun olduğu yer | Maliyet | Güvenilirlik | Örnek |
|--------|---------------------|---------|--------------|-------|
| Tam eşleşme | Sınıflandırma, etiketler | Bedava | Çok yüksek | Niyet == "iade" mi? |
| Şema / regex | Yapılandırılmış çıkarım | Bedava | Çok yüksek | `tutar` alanlı geçerli JSON mu? |
| Anlamsal benzerlik | Başka sözcüklerle cevap | Düşük | Orta | Embedding kosinüs > 0.85 |
| LLM-hakem | Ton, sadakat | Orta | Orta-yüksek | "Yardımseverliği 1-5 puanla" |
| İnsan incelemesi | Nihai onay, kalibrasyon | Yüksek | En yüksek | Haftalık örnek denetimi |

Tablonun tepesinden başlayın ve ucuz satırlar kriterinizi ifade edemediğinde pahalı satırlara uzanın. Örneklerimizin kabaca %70'ini saf kodla puanlarız; bu, tam bir eval çalıştırmasını 30 saniyenin altında ve neredeyse sıfır maliyette tutar.

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

Sondaki `assert` geçidin kendisidir. Bunu CI'a bağlayın; kötü bir prompt asla birleşmesin. Diğer kodu zaten böyle test ediyorsanız, eval'ler [sağlam birim testleri yazma](/blog/how-to-write-unit-tests) mantığına doğrudan oturur.

## LLM-hakemi nasıl dürüst tutarsınız?

Bir LLM hakem zamanla kayar, bu yüzden güvenmeden önce insan etiketlerine karşı kalibre edersiniz. 20-30 örneği elle puanlayın, hakemi aynı örneklerde çalıştırın ve uyumu ölçün. Hakem, insanlarla ~%85'in altında uyuşuyorsa rubriği sıkılaştırın ya da hakem modelini değiştirin.

Bizde bozulan şey: ilk hakemimiz neredeyse her şeye 4 ya da 5 verdi, çünkü rubrik "kaliteyi puanla" diyordu. Belirsiz rubrikler belirsiz skor üretir. Bunu açık ikili kriterlere ("Cevap bir kaynak gösteriyor mu? E/H. Konuda kalıyor mu? E/H.") çevirmek, hakem-insan uyumunu %72'den %94'e çıkardı.

Hakemleri güvenilir tutan üç kural:

- **Skordan önce gerekçe zorlayın.** Önce muhakeme yapan puanlama ölçülebilir biçimde daha tutarlıdır.
- **Test edilenden farklı, daha güçlü bir modeli** hakem yapın; bir modelin kendi üslubunu onaylamasını önleyin.
- **Hakem modelini değiştirdiğinizde yeniden kalibre edin.** Hakem yükseltmesi sessiz bir puanlama değişikliğidir.

İyi hakemlerin arkasındaki prompt yapısı için [prompt mühendisliği teknikleri](/blog/prompt-muhendisligi-teknikleri) yazımız, dayandığımız rubrik ve few-shot püf noktalarını anlatıyor.

## Eval'ler güvenilirlik yığınının neresinde durur?

Eval'ler her diğer güvenilirlik taktiğinin altındaki ölçüm katmanıdır. Veriye dayandırmanın, retrieval'ın ya da bir reddetme eşiğinin gerçekten işe yarayıp yaramadığını, yoksa hatayı yalnız yer değiştirtip değiştirmediğini size söylerler. Bunları [LLM halüsinasyonlarını azaltma](/blog/llm-halusinasyon-azaltma) rehberimizdeki savunmalarla eşleştirin; özelliğiniz retrieval'a bağlıysa onu ayrıca [RAG sistemi nasıl kurulur](/blog/rag-sistemi-nasil-kurulur) fikirleriyle değerlendirin.

Eval'leri üç tetikleyicide çalıştırın: her prompt ya da model değişikliğinde, taze üretim örneklerine karşı gecelik programda ve her dağıtımdan önce. Nerede ne inşa edeceğinize karar veriyorsanız, [AI agent mı workflow mu](/blog/ai-agent-mi-workflow-mu) yazımız bağlamı veriyor. Tüm küme [AI](/blog/ai) merkezinde toplanıyor.

## Sıkça Sorulan Sorular

### Bir LLM eval seti kaç örnek gerektirir?

Binlerce rastgele örnekle değil, gerçek hata modlarınızı kapsayan iyi seçilmiş 50-100 örnekle başlayın. Uç durumların kapsanması, hacimden çok daha önemlidir. Üretim yeni bir hata gösterdikçe seti büyütün; özenle seçilmiş 150 örneklik bir set, filtrelenmemiş 2.000 örneklik bir yığından iyidir.

### Eval'ler ile benchmark'lar arasındaki fark nedir?

MMLU gibi benchmark'lar, halka açık veri setlerinde modelin genel yeteneğini ölçer. Eval'ler *sizin* modelinizi *sizin* görevinizde *sizin* verinizle ölçer. Bir model her benchmark'ta zirveye çıkıp yine de sizin çıkarım şemanızda kalabilir. Bir sıralama tablosuna güvenmeden önce LLM çıktılarını daima kendi altın setinize karşı değerlendirin.

### LLM çıktılarını değerlendirmek için LLM kullanabilir miyim?

Evet, LLM-hakem ton ve sadakat gibi öznel nitelikler için standarttır; ancak önce insan etiketlerine karşı kalibre etmeli ve her skoru gerekçelendirmeye zorlamalısınız. Belirlenimci olan her şey için kod tabanlı değerlendiriciler kullanın ve hakemi gerçekten bir kuralla kontrol edemediğiniz çıktılara saklayın.

### Eval'leri ne sıklıkla çalıştırmalıyım?

Tam takımı her prompt ya da model değişikliğinde çalıştırın ve skor gerilerse birleştirmeyi bloke edin. Kaymayı yakalamak için taze üretim örneklerine karşı gecelik bir çalıştırma, hakemlerinizi kalibre tutmak için de küçük bir örnek üzerinde haftalık insan denetimi ekleyin.
