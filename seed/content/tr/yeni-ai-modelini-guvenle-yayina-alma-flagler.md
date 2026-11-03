---
title: "Yeni Bir AI Modeli Güvenle Nasıl Yayına Alınır?"
slug: "yeni-ai-modelini-guvenle-yayina-alma-flagler"
translationKey: "feature-flags-ai-models-2026"
locale: "tr"
excerpt: "Kısa cevap: önce flag'li shadow modda gerçek trafikte test et, sonra küçük, loglanan bir canary aç; otomatik rollback olmadan asla tüm trafiğe geçme."
category: "software-engineering"
tags: ["feature-flags", "llm", "ai-reliability", "deployment"]
publishedAt: "2026-11-03"
seoTitle: "Yeni AI Modelini Feature Flag ile Güvenle Yayına Al"
seoDescription: "Yeni model veya prompt sürümünü flag'le yayına alma: shadow mode, yüzdelik canary, her istekte loglanacak alanlar ve otomatik rollback eşikleri."
---

Kısa cevap: yeni model veya prompt sürümünü bir kod değişikliği gibi değil, dağıtılabilir bir birim gibi ele al. Önce gerçek trafikte, kullanıcıya görünmeyen ve yan etkisi olmayan bir shadow modda çalıştır; sonra küçük, loglanan ve flag'li bir kullanıcı yüzdesine aç; tüm trafiğe geçmeden önce kalite, gecikme ve maliyet eşiklerine bağlı otomatik bir rollback kur.

## Yeni Bir AI Modelini Yayına Almak Normal Bir Özellikten Ne Farklı?

Normal bir [feature flag](https://martinfowler.com/articles/feature-toggles.html) deterministik bir kod dalını açıp kapatır: aynı girdi her zaman aynı sonucu verir, bu yüzden küçük bir test seti ve kısa bir canary genelde her şeyi gösterir. Yeni bir model veya prompt sürümü ise devasa bir girdi uzayında olasılıksaldır — senin eval setinde kusursuz çalışıp hiç test etmediğin bir girdi sınıfında bozulabilir, çünkü o sınıf zaten sette yoktu. Bu yüzden model yayınları, bir canary gerçek bir kullanıcıyla karşılaşmadan önce kendi aşamasını gerektirir: shadow mode.

## Shadow Mode Nedir, Neyi Yakalar ve Neyi Kaçırır?

Shadow mode, yeni model veya prompt'un gerçek production trafiğinde mevcut sürümle paralel çalışması, ama çıktısının sadece loglanıp puanlanması, hiçbir kullanıcıya gösterilmemesi ve e-posta göndermek ya da veritabanına yazmak gibi bir yan etkiyi asla tetiklememesi demektir. Tek bir soruya cevap verir: bu sürüm kimseye dokunmadan gerçek trafikte güvenli davranıyor mu? Kullanıcıların onu gerçekten tercih edip etmediğine cevap vermez, çünkü döngüde hiç kullanıcı yoktur. Bir sürüm shadow mode'u temiz geçip canary'de başarısız olabilir, çünkü bazı hatalar yalnızca gerçek bir insan çıktıya tepki verdiğinde ortaya çıkar — kafa karıştırıcı bir cevap, ton uyumsuzluğu, shadow koşusunun hiç sürdürmek zorunda kalmadığı çok turlu bir konuşma.

## Shadow Mode'dan Canary'ye Ne Zaman Geçilmeli?

Shadow koşusu; kalite, refüze oranı ve istek başına maliyet konusunda offline eval eşiklerini, sadece ortalama trafikte değil bilinen kuyruk vakalarını da (uzun konuşmalar, nadir diller, kötü niyetli girdiler) yeterince kapsayan bir örneklemde geçtiğinde canary'ye geç. Sadece kısa ve basit isteklerle karşılaşan %1'lik bir canary, yeni sürümün sorunsuz olduğunu söyler — ta ki gerçek trafiğin çok turlu veya uzun bağlamlı olan %5'ine çarpana kadar; modellerin en çok bozulduğu yer de tam burasıdır. Canary'nin boyutunu ve çalışma süresini, panoda temkinli görünen yuvarlak bir yüzdeye göre değil, bu kuyruğu kapsayacak şekilde ayarla.

## Her İstekte Hangi Alanlar Loglanmalı?

Her isteği hangi flag anahtarı ve hangi varyantın (model kimliği ve prompt sürümü) karşıladığını; kalite puanını, gecikmeyi, token maliyetini ve varsa kullanıcı geri bildirim sinyalini loglayarak, her sonucu onu üreten sürüme geri bağlayabilecek şekilde kaydet. Bu bağlantı yoksa rollback kararı bir ölçüm değil, bir tahmin olur.

```json
{
  "request_id": "req_8f2a1c",
  "flag_key": "support-agent-model",
  "variant": "claude-opus-5-5@prompt-v14",
  "baseline_variant": "claude-sonnet-5@prompt-v13",
  "quality_score": 0.91,
  "latency_ms": 840,
  "cost_usd": 0.014,
  "refused": false,
  "side_effects_executed": false
}
```

`side_effects_executed` alanı, puanlar kadar önemli: shadow modun gerçekten e-postayı göndermediğini ya da satırı yazmadığını kanıtlayan kayıt budur — shadow mode'u canlı trafikte güvenle çalıştırılabilir kılan da tam olarak bu. `baseline_variant` alanı da aynı kadar kritik: hangi sürümün "önceki iyi durum" sayıldığını açıkça kaydetmezsen, rollback mantığı hangi varyanta geri döneceğini bilemez.

## Otomatik Rollback'i Hangi Sinyaller Tetiklemeli?

Rollback'i, önceki sürümün baseline'ına göre sürekli kontrol edilen dört sinyale bağla: kalite veya eval puanında düşüş, p50/p99 gecikmede artış, istek başına maliyette sıçrama (yeni bir model aynı görev için fark edilir ölçüde daha fazla token harcayabilir) ve hata veya refüze oranında artış. Otomatik rollback, bu eşiklerden biri aşıldığı anda flag'i son bilinen iyi varyanta geri çeviren bir izleyicidir; kimsenin bir destek talebine bakmasını beklemez. Eşikleri sabit bir sayı değil, baseline'a göre bir sapma yüzdesi olarak tanımlamak daha sağlam sonuç verir, çünkü trafik profili haftadan haftaya değişse de regresyon sinyali aynı kalır. [AI ajanlarını CI/CD'ye güvenle bağlamak](/tr/posts/ai-ajanlari-cicd-guvenle-baglamak) yazısı, sadece model sürümleri için değil ajan eylemleri için de aynı kill-switch kalıbını ele alıyor ve mekanik birebir taşınır.

| Aşama | Gerçek kullanıcı? | Yan etkiye izin var mı? | Neyi yakalar | Neyi kaçırır |
|---|---|---|---|---|
| Offline eval | Hayır | Hayır | Test setindeki bilinen regresyonlar | Test setinin dışındaki her şey |
| Shadow mode | Evet (sessizce) | Hayır | Gerçek trafikte güvenlik ve kararlılık | Kullanıcıya görünen kalite ve tercih |
| Canary | Evet (bir dilim) | Evet, loglanarak | Ölçekte gerçek kalite, gecikme, maliyet | Dilim küçük veya kısa sürerse nadir kuyruk vakaları |
| Tam yayın | Herkes | Evet | Yeni bir şey yakalamaz — bahis budur | Canary'nin kapsamadığı her şey |

Bu, [klasik canary release](https://martinfowler.com/bliki/CanaryRelease.html) ve [blue-green ve canary deployment](/tr/posts/blue-green-mi-canary-mi) yazısındaki yaklaşıma yeterince yakın ki altyapının büyük kısmı doğrudan uygulanır — fark, neyi ölçtüğündür. Bir kod dağıtımının canary'si çoğunlukla hata oranına ve gecikmeye bakar; model canary'si çıktı kalitesine de bakmak zorundadır, kalite de otomatik ölçmesi daha zor bir şeydir — tam da bu noktada [atlanan AI hizalama testleri](/tr/posts/hizalama-testleri-neden-yetersiz) konusu devreye giriyor: bir rollback kapısı, arkasındaki eval kadar iyidir.

Benim görüşüm: çoğu ekip shadow mode'u atlayıp direkt küçük bir canary'ye geçiyor, çünkü shadow mode görünürde fayda sağlamayan bir ekstra altyapı gibi görünüyor. Bu yanlış bir takas. Gerçek kullanıcılı bir canary, gerçek sonuçları olan bir canary'dir de; shadow koşusunun sana maliyeti olan on beş dakika, kötü çıktıyı alan %1'lik kesimin açtığı destek taleplerinden çok daha ucuzdur. Aynı altyapıyı A/B testi için de kullanabilirsin: iki varyantı aynı anda canary'de tutup çıktı kalitesini karşılaştırmak, hangisinin daha iyi olduğunu tahmin etmek yerine ölçmeni sağlar.

Modelin çıktısına, [birleştirmeden önce AI'nın yazdığı kodu incelerken](/tr/posts/ai-ile-kod-incelemesi-guven-dogrula) uyguladığın şüpheciliğin aynısını uygula — panoda bir kalite puanının eşiği geçmesi, modelin düzgün davrandığının garantisi değil, araştırılması gereken bir sinyaldir; rollback yolu, ekim ayındaki offline eval'in ne kadar güven verici göründüğünden bağımsız olarak var olmalıdır.

## Sıkça Sorulan Sorular

### Yeni bir AI modeli production'da nasıl güvenle test edilir?

Önce shadow modda çalıştır: gerçek production trafiğini mevcut sürümle paralel olarak yeni sürüme de gönder, çıktısını logla ve puanla, ama kullanıcıya hiç gösterme ve yan etki tetikletme. Kalite, maliyet ve refüze oranı konusunda offline eval eşiklerini geçtikten sonra gerçek kullanıcılı bir canary'ye geç.

### AI modelleri için canary ile shadow mode arasındaki fark nedir?

Shadow mode gerçek trafikte çalışır ama çıktıyı hiçbir kullanıcı görmez, bu yüzden sadece yeni sürümün güvenli ve kararlı olup olmadığını test eder. Canary, yeni sürümü gerçek kullanıcıların küçük, flag'li bir yüzdesine açar, böylece çıktının gerçekten daha iyi olup olmadığını test eder — shadow mode'un döngüde kullanıcı olmadığı için cevaplayamadığı bir soru.

### Yeni bir model sürümünün otomatik rollback'ini ne tetiklemeli?

Önceki sürümün baseline'ına kıyasla izlenen kalite veya eval puanında düşüş, p50/p99 gecikmede artış, istek başına maliyette sıçrama veya hata/refüze oranında yükseliş. Rollback, bir insanın fark etmesini beklemeden flag'i otomatik olarak son bilinen iyi varyanta geri çevirmelidir.

### Küçük canary'ler AI model regresyonlarını neden bazen kaçırır?

Küçük bir canary (örneğin trafiğin %1'i), uzun konuşmalar, nadir diller veya kötü niyetli girdiler gibi kuyruk vakalarında yoğunlaşan regresyonları kaçırabilir; çünkü bu boyutta canary, sen onu başarılı sayıp yayılımı genişletmeden önce bu vakaların yeterince fazlasını görmeyebilir. Çözüm genelde yüzdeyi büyütmek değil, canary'yi daha uzun süre çalıştırmak veya kuyruk vakalarını ayrı bir segment flag'iyle hedeflemektir, böylece ortalama trafik onları seyreltmez.
