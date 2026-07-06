---
title: "Geliştiriciler İçin Prompt Mühendisliği"
slug: "prompt-muhendisligi-teknikleri"
translationKey: "prompt-engineering-patterns"
locale: "tr"
excerpt: "Geliştiriciler için prompt mühendisliği teknikleri: rol verme, few-shot, düşünce zinciri, yapılandırılmış çıktı ve her birinin sahadan çıkmış dersleri."
category: "ai"
tags: ["prompt-engineering", "llm", "ai-tools"]
publishedAt: "2026-04-21"
seoTitle: "Geliştiriciler İçin Prompt Mühendisliği"
seoDescription: "İşe yarayan prompt mühendisliği teknikleri: rol verme, few-shot, düşünce zinciri, yapılandırılmış çıktı ve öz-denetim. 2026 sahasından gerçek notlarla."
---

Geliştiriciler için gerçekten fark yaratan prompt mühendisliği teknikleri aslında küçük bir kümedir: rol verme, few-shot örnekler, düşünce zinciri (chain-of-thought), yapılandırılmış çıktı sözleşmeleri ve öz-denetim. Bu beşine hakim olursanız üretimdeki LLM işinin yaklaşık %90'ını kapsarsınız; gerisi bunların birer varyasyonudur. Aşağıda her tekniği, karşılaştığımız hata biçimleriyle ve bunları nasıl düzelttiğimizle birlikte anlatıyoruz.

Bu bir "prompt taktikleri" listesi değil. Bunlar 2026'da Claude, GPT ve Gemini API'lerine karşı her gün çalıştırdığımız teknikler; bugün kopyalayıp kullanabileceğiniz somut şablonlarla.

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

Genel kural: göreviniz formata ne kadar bağımlıysa yapılandırılmış çıktıya, muhakemeye ne kadar bağımlıysa düşünce zincirine uzanın.

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

### Düşünce zinciri cevapları neden iyileştirir?

Düşünce zinciri, modelden cevaplamadan önce adım adım muhakeme etmesini ister. Matematik, mantık ve çok adımlı görevlerde bu doğruluğu belirgin biçimde artırır; çünkü model doğrudan tahmine atlamak yerine ara adımlara daha fazla hesaplama ayırır. 2022'deki Wei ve arkadaşlarının makalesi bunu ilk kez formüle etti ve 2026'da hâlâ geçerli.

En basit hali tek satırdır: `Adım adım düşün, sonra nihai cevabı ver.` Üretim için muhakemeyi cevaptan ayırın ki temiz ayrıştırabilesiniz:

```text
Problemi bir <muhakeme> bloğunda çöz.
Sonra yalnızca nihai cevabı bir <cevap> bloğunda ver.

Problem: Bir cron 15 dakikada bir çalışıyor. 09:07'de
başladıysa, öğlene kadar kaç kez çalışır?
```

Dikkat: düşünce zinciri token yakar ve gecikme ekler. Basit aramalara yapıştırmayın. Bunu, yanlış cevabın ek token'dan daha pahalıya mal olduğu görevlere saklıyoruz.

### Yapılandırılmış çıktıyı nasıl zorlarsınız?

Yapılandırılmış çıktı, modele katı ve makine tarafından okunabilir bir şemada (genellikle JSON) yanıt vermesini söyler; böylece kodunuz regex cambazlığı yapmadan ayrıştırır. Başka bir sisteme beslenen her şey için en yüksek güvenilirlikli tekniktir. 2026'da prompt içinde yalvarmak yerine sağlayıcının yerel yapılandırılmış çıktı ya da araç çağrısı API'sini kullanın.

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

Bir şemayı API üzerinden bağladığınızda model geçerli çıktıya kısıtlanır ve kırılgan ayrıştırıcılar yazmayı bırakırsınız. SDK'nın yerel desteği olmadığı yerde JSON isteyin, bir şema kütüphanesiyle doğrulayın ve başarısızlıkta yeniden deneyin. Metni asla körü körüne güvenmeyin.

## Üretim prompt'unda teknikleri nasıl birleştirirsiniz?

Gerçek prompt'lar teknikleri üst üste yığar. Tipik bir çıkarım prompt'u çerçeveleme için rol verme, format için bir-iki few-shot örneği ve sonuç için yapılandırılmış çıktı sözleşmesi kullanır. Her katman bir öncekinin üzerine binsin diye şu sırayı izleyin.

1. **Rolü ve katı kısıtları belirleyin.** Persona için bir cümle, ardından pazarlığa kapalı kurallar.
2. **Görevi sade dille ifade edin.** İstediğiniz şeyi, belirsiz kalmayan en az kelimeyle.
3. **Format tutarlılığı önemliyse few-shot örnek ekleyin.** İki-üç adet, çeşitli.
4. **Çıktı şemasını belirtin** ve mümkünse API üzerinden bağlayın.
5. **Yüksek riskli çıktı için öz-denetim talimatı** ekleyin ("her alanın kaynakta göründüğünü doğrula").
6. **Kenar durumlara karşı test edin**, yalnızca mutlu yola değil.
7. **Prompt ve yanıtı loglayın** ki sonraki regresyonları ayıklayabilesiniz.

6. adımı atlamak en sık yapılan hatadır. Üç test girdinizi kusursuz geçen bir prompt, boş string'de, emojide ya da 40 sayfalık belgede yine de çökebilir.

## Sahadan: neyin bozulduğu ve nasıl düzelttiğimiz

En kötü prompt hatamız her demoda gayet iyi görünüyordu. Bir çıkarım prompt'u testte faturalardan toplamları kusursuz çekiyordu; sonra üretimde kaynak `currency` alanını atladığında bu alanı sessizce uyduruyordu. Model boşluğu istatistiksel olarak olası değerle, USD ile dolduruyordu, çünkü hiçbir şey ona bunu yapmamasını söylememişti.

Düzeltme iki katmanlı oldu:

```text
Bir alan kaynak metinde açıkça mevcut değilse o alan için
null döndür. Asla değer çıkarımı yapma ya da tahmin etme.
Çıkarımdan sonra null olmayan her alanın kaynakta birebir
göründüğünü doğrula. Görünmüyorsa o alanı null yap.
```

Bu öz-denetim talimatını `null`'a izin veren bir şemayla eşledik, sonra bir alanın birebir kontrolünü geçemediği her yanıtı reddettik. Halüsinasyonlu alanlar sıfıra yakın düştü. Ders: modeller sessizliği makul tahminlerle doldurur, bu yüzden açık bir "emin değilsen null döndür" her türlü zekice ifadeyi yener.

İlgili okumalar için [RAG sistemi nasıl kurulur](/tr/blog/rag-sistemi-nasil-kurulur) ve [AI agent mı workflow mu](/tr/blog/ai-agent-mi-workflow-mu) yazılarımıza bakın. Kümenin tamamı için [AI](/tr/blog/kategori/ai) sayfamızı ziyaret edin.

## Sıkça Sorulan Sorular

### Yeni başlayanlar için en önemli prompt mühendisliği tekniği hangisi?

Yapılandırılmış çıktı ve rol vermeyle başlayın. Rol verme tek cümleye mal olur ve modelin davranışını anında daraltır; yapılandırılmış çıktı ise yanıtları ayrıştırılabilir kılar, böylece serbest metinle boğuşmayı bırakırsınız. Bunlar doğal geldiğinde muhakeme ağırlıklı görevler için few-shot ve düşünce zincirini ekleyin.

### Prompt mühendisliği teknikleri farklı LLM'lerde çalışır mı?

Evet, temel teknikler Claude, GPT ve Gemini arasında aktarılır; çünkü sağlayıcıya özgü hilelere değil, transformer modellerinin bağlamı nasıl işlediğine dayanır. Sözdizimi değişir: yapılandırılmış çıktı her sağlayıcının araç çağrısı API'sini kullanır ve bazı modeller markdown yerine XML etiketlerini tercih eder. Aynı davranışı varsaymak yerine prompt'larınızı model bazında test edin.

### Kaç tane few-shot örneği eklemeliyim?

İki ila beş; sayıdan çok çeşitliliğe öncelik verin. Üç temiz ve farklı örnek genelde birbirine benzer on örnekten daha iyi çalışır, çünkü model tekrarlayan şekillere aşırı uyum sağlar. Tutarlı çıktı için çok sayıda örnek gerekiyorsa göreviniz muhtemelen ince ayar (fine-tuning) ya da yapılandırılmış çıktı şemasıyla daha iyi çözülür.

### Düşünce zinciri yanıtları yavaşlatır mı?

Evet. Düşünce zinciri token kullanımını ve gecikmeyi artırır, çünkü model cevaptan önce muhakeme üretir. Bunu yanlış cevabın pahalı olduğu görevlere (matematik, mantık, çok adımlı planlama) saklayın. Basit aramalar ve sınıflandırma için anlamlı doğruluk kazancı sağlamadan maliyet ekler.
