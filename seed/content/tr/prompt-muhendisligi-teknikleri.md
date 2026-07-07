---
title: "Geliştiriciler İçin Prompt Mühendisliği"
slug: "prompt-muhendisligi-teknikleri"
translationKey: "prompt-engineering-patterns"
locale: "tr"
category: "ai"
tags: ["prompt-engineering", "llm", "ai-tools"]
publishedAt: "2026-07-04"
excerpt: "2026'da üretimdeki LLM işinin çoğunu taşıyan beş prompt mühendisliği tekniği: rol verme, few-shot, düşünce zinciri, yapılandırılmış çıktı ve öz-denetim."
seoTitle: "Geliştiriciler İçin Prompt Mühendisliği (2026)"
seoDescription: "2026'da işe yarayan prompt mühendisliği teknikleri: rol verme, few-shot, düşünce zinciri, yapılandırılmış çıktı ve öz-denetim. GPT-5.5, Claude ve Gemini 3 sahasından notlarla."
---

Temmuz 2026 tarihli bir Wharton Generative AI Labs raporunda, bir prompt'a "adım adım düşün" eklemek yanıt süresini %35 ila %600 uzattı ve sembolik olmayan görevlerde doğruluğu neredeyse hiç değiştirmedi. Tek bir sayı tüm zanaatı yeniden çerçeveliyor: 2026'da prompt mühendisliği zekice büyüler yapmak değil, hangi tekniğin token'ının hakkını verdiğini, hangisinin onları boşa yaktığını bilmektir.

Geliştiriciler için gerçekten fark yaratan prompt mühendisliği teknikleri aslında küçük bir kümedir: rol verme, few-shot örnekler, düşünce zinciri (chain-of-thought), yapılandırılmış çıktı sözleşmeleri ve öz-denetim. Bu beşine hakim olursanız üretimdeki LLM işinin yaklaşık %90'ını kapsarsınız; gerisi bunların birer varyasyonudur. Aşağıda her tekniği, GPT-5.5, Claude Sonnet 5 ve Gemini 3'e karşı karşılaştığımız hata biçimleriyle ve bunları nasıl düzelttiğimizle birlikte anlatıyoruz.

Bu bir "prompt taktikleri" listesi değil. Bunlar her gün üretimde çalıştırdığımız teknikler; bugün kopyalayıp kullanabileceğiniz somut şablonlarla.

## Prompt mühendisliği teknikleri nedir?

Prompt mühendisliği teknikleri, bir dil modelini istediğiniz çıktıya güvenilir biçimde yönlendiren yeniden kullanılabilir istem yapılarıdır. Prompt'u deneme yanılmayla tekrar tekrar yazmak yerine, few-shot ya da düşünce zinciri gibi etkisi bilinen adlandırılmış bir tekniği uygularsınız. Teknikler, prompt yazmayı tahminden tekrarlanabilir bir mühendislik disiplinine dönüştürür.

Bunları yazılım tasarım kalıpları gibi düşünün. Her seferinde bir singleton'ı yeniden icat etmezsiniz; problemin şeklini tanır ve uyan kalıba uzanırsınız. Sözcük dağarcığını edindikten sonra prompt yazmak da aynı şekilde işler.

## 2026'da en çok hangi prompt mühendisliği teknikleri önemli?

Aşağıdaki beş teknik üretim ihtiyaçlarının çoğunu karşılar. Kabaca şu sıklık sırasıyla başvurun.

| Teknik | En iyi kullanım | Efor | Güvenilirlik kazancı |
|---|---|---|---|
| Rol verme | Ton, alan, kısıt belirleme | Düşük | Orta |
| Few-shot örnek | Tutarlı format, kenar durum | Orta | Yüksek |
| Düşünce zinciri | Muhakeme, matematik, çok adımlı mantık | Düşük | Yüksek |
| Yapılandırılmış çıktı | Ayrıştırılabilir JSON, araç çağrısı | Orta | Çok yüksek |
| Öz-denetim | Halüsinasyon yakalama, kalite kontrol | Orta | Yüksek |

Genel kural: göreviniz formata ne kadar bağımlıysa yapılandırılmış çıktıya, muhakemeye ne kadar bağımlıysa düşünce zincirine uzanın. Ama bugünün muhakeme modelleriyle bu ikinci kaldıraç 2023'tekinden daha az önemli; çünkü düşünme artık modelin içinde gerçekleşiyor.

### Rol verme nasıl çalışır?

Rol verme, model görevi görmeden önce onun personasını, alanını ve kısıtlarını belirler. Modele kim olduğunu ve hangi kuralların onu bağladığını söylersiniz; cevapları bu çerçeveyi devralır. En ucuz tekniktir ve çoğu geliştiricinin en az kullandığıdır.

```text
Sen kıdemli bir PostgreSQL DBA'sın. Okuma yoğun OLTP iş
yükleri için optimize edersin. Yazma maliyetini belirtmeden
asla denormalizasyon önerme. 150 kelimenin altında yanıt ver.

Soru: orders.status üzerine kısmi index eklemeli miyim?
```

Kısıtlar (`150 kelimenin altında`, `yazma maliyetini belirt`) persona etiketinden daha önemlidir. Testlerimizde tek bir katı kısıt eklemek, konu dışı gevezeliği "sen bir uzmansın" övgüsünden çok daha fazla kesti.

### Few-shot örnekleri ne zaman kullanmalısınız?

Tutarlı format gerektiğinde ya da modelin sürekli yanlış yaptığı bir kenar durumu öğretmek istediğinizde few-shot kullanın. İki ila beş giriş-çıkış çifti gösterir, sonra gerçek girişi verirsiniz. Model tahmin yürütmek yerine örneklerinize göre desen eşleştirir.

```text
Duyguyu sınıflandır. Yalnızca tek kelimeyle yanıtla.

Girdi: "Deploy sonunda çalıştı." -> pozitif
Girdi: "Sürüm sonrası gecikme yine fırladı." -> negatif
Girdi: "Build üçüncü denemede geçti." -> nötr

Girdi: "Migration'ı geri aldım, hepsi yeşil şimdi." ->
```

Sahadan bir not: örnek kalitesi örnek sayısını yener. Üç temiz ve çeşitli örnek, birbirine benzer on örnekten daha iyi çalışır. Örnekleriniz birbirinin aynıysa model o şekle aşırı uyum sağlar ve ilk aykırı değerde kırılır.

### Düşünce zinciri hâlâ neden önemli?

Düşünce zinciri, modelden cevaplamadan önce adım adım muhakeme etmesini ister. 2022'deki Wei ve arkadaşlarının makalesi bunu ilk kez formüle etti ve matematik ile sembolik mantıkta doğruluğu hâlâ belirgin biçimde artırıyor. Ama 2026 hesabı değiştirdi. Sınır modeller artık dahili düşünme modlarıyla geliyor, dolayısıyla muhakemeyi elle prompt'lamanız çoğu zaman gerekmiyor. Wharton raporu bu konuda net: sembolik olmayan görevlerde açık düşünce zinciri gecikme ve değişkenlik ekliyor ama doğruluğa pek katkı sağlamıyor.

Yani modern hamle şu: zor problemler için modelin yerel muhakemesine güvenin, gerisi için elle düşünce zincirini atlayın. Görünür muhakeme istediğinizde temiz ayrıştırabilmek için onu cevaptan ayırın:

```text
Problemi bir <muhakeme> bloğunda çöz.
Sonra yalnızca nihai cevabı bir <cevap> bloğunda ver.

Problem: Bir cron 15 dakikada bir çalışıyor. 09:07'de
başladıysa, öğlene kadar kaç kez çalışır?
```

Dikkat: muhakeme token yakar ve gecikme ekler. Basit aramalara yapıştırmayın. Bunu, yanlış cevabın ek hesaplamadan daha pahalıya mal olduğu görevlere saklayın.

### Yapılandırılmış çıktıyı nasıl zorlarsınız?

Yapılandırılmış çıktı, modele katı ve makine tarafından okunabilir bir şemada (genellikle JSON) yanıt vermesini söyler; böylece kodunuz regex cambazlığı yapmadan ayrıştırır. Başka bir sisteme beslenen her şey için en yüksek güvenilirlikli tekniktir ve 2026'da prompt hilesi olmaktan çıkıp birinci sınıf bir API özelliğine terfi etti.

Temmuz 2026 itibarıyla yapılandırılmış çıktılar Claude API'sinde (beta başlığı olmadan `output_config.format` üzerinden) Sonnet, Opus ve Haiku için genel kullanıma açık; OpenAI, GPT-5.5'te şemayı prompt'a gömmek yerine yerel Structured Outputs'u öneriyor; Gemini 3 ise `anyOf` ve `$ref` gibi tam JSON Schema anahtar sözcüklerini kabul edip anahtar sırasını koruyor. Desteklenen bir model sizin için çıktıyı kısıtlayabilecekken düz metinde JSON dilenmeyin.

```json
{
  "name": "extract_invoice",
  "schema": {
    "type": "object",
    "properties": {
      "invoice_id": { "type": "string" },
      "total": { "type": "number" },
      "currency": { "type": "string", "enum": ["USD", "EUR", "TRY"] }
    },
    "required": ["invoice_id", "total", "currency"]
  }
}
```

Üç büyük sağlayıcıda yerel destek şu an şöyle sıralanıyor.

| Sağlayıcı / model | Yerel yapılandırılmış çıktı | Not |
|---|---|---|
| Claude Sonnet 5 / Opus 4.8 | GA (`output_config.format`) | Beta başlığı yok; genişletilmiş şema desteği |
| OpenAI GPT-5.5 | GA (Structured Outputs) | Prompt'a gömülü şemaya tercih edilir |
| Gemini 3 | GA (JSON Schema) | `anyOf`, `$ref` destekler; anahtar sırasını korur |

Bir şemayı API üzerinden bağladığınızda model geçerli çıktıya kısıtlanır ve kırılgan ayrıştırıcılar yazmayı bırakırsınız. Bir SDK'nın hâlâ yerel desteği olmadığı yerde JSON isteyin, bir şema kütüphanesiyle doğrulayın ve başarısızlıkta yeniden deneyin. Metne asla körü körüne güvenmeyin.

## Üretim prompt'unda teknikleri nasıl birleştirirsiniz?

Gerçek prompt'lar teknikleri üst üste yığar. Tipik bir çıkarım prompt'u çerçeveleme için rol verme, format için bir-iki few-shot örneği ve sonuç için yapılandırılmış çıktı sözleşmesi kullanır. Her katman bir öncekinin üzerine binsin diye şu sırayı izleyin.

1. **Rolü ve katı kısıtları belirleyin.** Persona için bir cümle, ardından pazarlığa kapalı kurallar.
2. **Görevi sade dille ifade edin.** İstediğiniz şeyi, belirsiz kalmayan en az kelimeyle.
3. **Format tutarlılığı önemliyse few-shot örnek ekleyin.** İki-üç adet, çeşitli.
4. **Çıktı şemasını belirtin** ve mümkünse API üzerinden bağlayın.
5. **Yüksek riskli çıktı için öz-denetim talimatı** ekleyin ("her alanın kaynakta göründüğünü doğrula").
6. **Kenar durumlara karşı test edin**, yalnızca mutlu yola değil.
7. **Prompt ve yanıtı loglayın** ki sonraki regresyonları ayıklayabilesiniz.

6. adımı atlamak en sık yapılan hatadır. Üç test girdinizi kusursuz geçen bir prompt, boş string'de, emojide ya da 40 sayfalık belgede yine de çökebilir. [LLM çıktıları nasıl değerlendirilir](/tr/posts/llm-ciktilari-degerlendirme) rehberimiz tam da bu yüzden var: prompt'ları gözle kontrol etmek hızla ölçeklenmez olur.

## Sahadan: neyin bozulduğu ve nasıl düzelttiğimiz

En kötü prompt hatamız her demoda gayet iyi görünüyordu. Bir çıkarım prompt'u testte faturalardan toplamları kusursuz çekiyordu; sonra üretimde kaynak `currency` alanını atladığında bu alanı sessizce uyduruyordu. Model boşluğu istatistiksel olarak olası değerle, USD ile dolduruyordu, çünkü hiçbir şey ona bunu yapmamasını söylememişti.

Düzeltme iki katmanlı oldu:

```text
Bir alan kaynak metinde açıkça mevcut değilse o alan için
null döndür. Asla değer çıkarımı yapma ya da tahmin etme.
Çıkarımdan sonra null olmayan her alanın kaynakta birebir
göründüğünü doğrula. Görünmüyorsa o alanı null yap.
```

Bu öz-denetim talimatını `null`'a izin veren bir şemayla eşledik, sonra bir alanın birebir kontrolünü geçemediği her yanıtı reddettik. Halüsinasyonlu alanlar sıfıra yakın düştü. Ders: modeller sessizliği makul tahminlerle doldurur, bu yüzden açık bir "emin değilsen null döndür" her türlü zekice ifadeyi yener. Aynı içgüdü, [üretimde LLM halüsinasyonlarını azaltma](/tr/posts/llm-halusinasyon-azaltma) için daha geniş oyun kitabımızın da temelinde yatıyor.

İlgili okumalar için [RAG sistemi nasıl kurulur](/tr/posts/rag-sistemi-nasil-kurulur) ve [AI agent mı workflow mu](/tr/posts/ai-agent-mi-workflow-mu) yazılarımıza bakın. Kümenin tamamı için [Yapay Zeka](/tr/category/yapay-zeka) sayfamızı ziyaret edin. Yer imine değecek birincil kaynaklar: [Claude Sonnet 5 duyurusu](https://www.anthropic.com/news/claude-sonnet-5), [OpenAI GPT-5.5 model dokümanı](https://developers.openai.com/api/docs/models/gpt-5.5), [Gemini yapılandırılmış çıktı dokümanı](https://ai.google.dev/gemini-api/docs/structured-output) ve [Wharton düşünce zinciri raporu](https://gail.wharton.upenn.edu/research-and-insights/tech-report-chain-of-thought/).

## Sıkça Sorulan Sorular

### Yeni başlayanlar için en önemli prompt mühendisliği tekniği hangisi?

Yapılandırılmış çıktı ve rol vermeyle başlayın. Rol verme tek cümleye mal olur ve modelin davranışını anında daraltır; yapılandırılmış çıktı ise yanıtları ayrıştırılabilir kılar, böylece serbest metinle boğuşmayı bırakırsınız. Yerel yapılandırılmış çıktı artık Claude, GPT-5.5 ve Gemini 3'te genel kullanıma açık olduğundan bunu benimsemek her zamankinden kolay. Bunlar doğal geldiğinde kenar durumlar için few-shot örnekleri ekleyin.

### Prompt mühendisliği teknikleri farklı LLM'lerde çalışır mı?

Evet, temel teknikler Claude, GPT ve Gemini arasında aktarılır; çünkü sağlayıcıya özgü hilelere değil, transformer modellerinin bağlamı nasıl işlediğine dayanır. Sözdizimi değişir: yapılandırılmış çıktı her sağlayıcının kendi API'sini kullanır (Claude'da `output_config.format`, OpenAI'da Structured Outputs, Gemini'de JSON Schema) ve bazı modeller markdown yerine XML etiketlerini tercih eder. Aynı davranışı varsaymak yerine prompt'larınızı model bazında test edin.

### 2026'da düşünce zinciri hâlâ değer mi?

Yalnızca bazen. Sınır modeller artık dahili muhakeme modlarına sahip ve Temmuz 2026 Wharton raporu, elle düşünce zincirinin %35 ila %600 gecikme eklerken çoğunlukla matematik ve sembolik görevlerde yardımcı olduğunu buldu. Bunlar için tekniği koruyun ya da modelin yerel düşünme bütçesini kullanın. Aramalar, sınıflandırma ve bilgi soruları içinse atlayın: gerçek bir doğruluk kazancı olmadan token ve gecikme maliyetini ödersiniz.

### Kaç tane few-shot örneği eklemeliyim?

İki ila beş; sayıdan çok çeşitliliğe öncelik verin. Üç temiz ve farklı örnek genelde birbirine benzer on örnekten daha iyi çalışır, çünkü model tekrarlayan şekillere aşırı uyum sağlar. Tutarlı çıktı için çok sayıda örnek gerekiyorsa göreviniz muhtemelen ince ayar (fine-tuning) ya da yapılandırılmış çıktı şemasıyla daha iyi çözülür.
