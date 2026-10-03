---
title: "Koltuk Başı Fiyatlama Öldü mü? Kullanıma Dayalı SaaS"
slug: "koltuk-basi-fiyat-kullanima-dayali-saas"
translationKey: "usage-based-outcome-pricing-saas-2026"
locale: "tr"
excerpt: "Koltuk başı SaaS fiyatlaması bir yılda şirketlerin %21'inden %15'ine düştü; çünkü işi artık AI ajanı yapıyor. Kullanıma dayalı fiyat bu boşluğu dolduruyor."
category: "business"
tags: ["saas", "pricing", "monetization", "automation"]
publishedAt: "2026-10-03"
seoTitle: "2026'da Kullanıma Dayalı mı Koltuk Başı mı SaaS Fiyatı"
seoDescription: "Koltuk başı SaaS fiyatlaması bir yılda %21'den %15'e düştü; AI ajanları koltuktaki kullanıcının yerini alıyor. Kullanıma dayalı fiyat boşluğu nasıl dolduruyor?"
---

Kısa cevap: Koltuk başı fiyatlama ölmedi ama hızla küçülüyor — koltuk başı fiyatlama bir yılda SaaS şirketlerinin %21'inden %15'ine düştü, hibrit modeller (sabit ücret + kullanım) ise %27'den %41'e çıktı. Neden yapısal: bir AI ajanı işi bir insan yerine kendi başına bitirdiğinde, "kullanıcı başına" ücretlendirmek işi gerçekte kimin yaptığıyla örtüşmüyor.

## Koltuk başı fiyatlama 2026'da neden zemin kaybediyor?

Koltuk başı fiyatlama, bir insanın masaya oturup yazılımını günün bir bölümünde kullandığını varsayar — fiyat kadroyu takip eder çünkü kadro kullanımı takip ederdi. Bir AI ajanı bu varsayımı kırıyor: durmadan çalışır, on görevi de bir görevi de koltuk eklemeden ölçeklendirir ve bir fatura sisteminin "kullanıcı" beklediği şekilde oturum açmaz.

Gartner, işletmelerin %70'inin koltuk başı modeller yerine kullanıma dayalı fiyatlamayı tercih edeceğini öngörüyor; bu kayma amiral gemisi ürünlerde zaten görülüyor: Salesforce Agentforce konuşma başına 2 dolar, Intercom'un Fin'i çözülen talep başına yaklaşık 0,99 dolar ücretlendiriyor — ikisi de oturum açmayı değil, ajanın ürettiği sonucu faturalandırıyor.

## Koltuk başı fiyatlamanın yerini ne alıyor?

Tek bir yerine üç yönlü bir ayrışma: saf kullanıma dayalı (tüketilen birim başına — API çağrısı, token, çözüm), sonuca dayalı (teslim edilen sonuç başına, örneğin çözülen bir talep veya ayarlanan bir toplantı) ve hibrit (platform ücreti + kullanım kotası, mobil veri paketlerine yakın bir mantık). Hibrit bu geçişi kazanıyor çünkü müşterinin sabit ücretten beklediği tahmin edilebilirliği korurken tedarikçiye yoğun kullanımdan fazladan gelir kazandırıyor.

| Model | Nasıl ücretlendirir | Müşteri için tahmin edilebilirlik | Tedarikçi geliri neyle ölçeklenir |
|---|---|---|---|
| Koltuk başı | Adlandırılmış kullanıcı başına sabit ücret | Yüksek | Kadro (ajanlar insanın yerini alırsa sabit kalır) |
| Saf kullanıma dayalı | Tüketilen birim başına (API çağrısı, token, çözüm) | Düşük — fatura aktiviteyle değişir | Gerçek tüketim |
| Sonuca dayalı | Teslim edilen sonuç başına (çözülen talep, kapanan anlaşma) | Orta | Sağlanan değer |
| Hibrit | Sabit ücret + kullanım kotası, aşım faturalandırılır | Kotaya kadar yüksek | Dahil kotanın üzerindeki kullanım |

## Kullanıma dayalı fiyat tasarlarken kırılmaz kısıt ne?

Müşterinin finans ekibi, imzadan önce gelecek ayın faturasını tahmin edip açıklayabilmeli — "kötü bir ayda bu bize ne kadara gelir" sorusuna cevap veremeyen bir fiyatlama modeli, birim ekonomisi ne kadar adil olursa olsun anlaşmayı kaybeder. Hibrit fiyatlamanın saf ölçümlemeye değil varsayılana dönüşmesinin pratik nedeni bu: sabit ücret finansa bütçeleyebileceği bir taban verir, kullanım katmanı ise sadece bu tabanın üzerindeki farkı açıklamak zorunda kalır, faturanın tamamını değil.

## Kullanıma dayalı modelde kâr marjı matematiği nasıl çıkarılır?

Kullanım birimi maliyetinden (API/işlem maliyeti + hedef marj) başla, ardından sabit ücrete dahil kotayı, çoğu müşterinin normal bir ayda aşım bölgesine düşeceği kadar düşük belirle — asıl marjın geldiği yer burası. 50 dolar/koltuk/ay fiyatlamasından kullanıma dayalıya geçen bir SaaS şirketi, 200 dolar sabit ücrete 1.000 dahil işlem koyup bunun üzerini işlem başına 0,15 dolardan ücretlendirebilir; ayda 3.000 işlem yapan bir müşteri 200$ + 300$ = 500$ öder, hafif kullanıcı ise sabit ücrete yakın kalır.

```text
fiyat = sabit_ucret + max(0, kullanilan_birim - dahil_birim) * birim_fiyat
ornek: sabit_ucret=200$, dahil_birim=1000, birim_fiyat=0,15$
3.000 birim -> 200$ + (3000-1000)*0,15 = 500$
```

Bu formülü ortalama bir müşteri üzerinden değil, gerçek kullanım dağılımın üzerinde çalıştır — ortalamada kârlı görünen bir model, birim fiyat ölçekte marjinal işlem maliyetini karşılamıyorsa en yoğun kullanan onluk dilimde para kaybettirebilir. Dağılımı aylık olarak izlemek, fiyatı yükseltmeden önce hangi müşteri diliminin asıl marjı yediğini gösterir.

## Bu geçiş SaaS'ının değerlemesini nasıl etkiler?

Yatırımcılar ve alıcılar, kullanıma dayalı gelirin koltuk başı gelire göre daha oynak ama genellikle daha yüksek büyüme potansiyeli taşıdığını biliyor; bu yüzden değerleme çarpanları tek bir metriğe değil net gelir tutma oranına (net revenue retention) ve gelirin ne kadarının mevcut müşterilerin kullanımını artırmasından geldiğine bakıyor. Sabit koltuk geliri düşük ama genişleme geliri yüksek bir şirket, toplam ARR'si daha büyük ama durağan bir koltuk-başı şirketten daha yüksek bir çarpanla değerlenebiliyor. [SaaS'ının Ne Ettiğini](/tr/posts/saas-degerleme-arr-carpanlari-2026) hesaplarken bu ayrımı gözden kaçırmamak gerekiyor.

Bu geçişi yaparken ilk bakılacak metrikler de değişiyor: [kurucular için ilk SaaS metrikleri](/tr/posts/kurucular-icin-ilk-saas-metrikleri) yazımızda ele aldığımız MRR ve churn'ün yanına, kullanım bazlı modelde net genişleme oranı (net dollar expansion) ve birim başına marj takibi ekleniyor — çünkü artık gelirin büyümesi sadece yeni müşteri kazanmaktan değil, mevcut müşterinin kullanımının artmasından da geliyor.

## Mevcut müşterileri kayıp yaşatmadan nasıl geçirirsin?

Mevcut koltuk başı sözleşmeleri yenileme tarihlerine kadar eski koşullarda tut, yeni fiyatlamayı önce sadece yeni kayıtlara ve yükseltmelere sun — bir müşterinin fatura yapısını sözleşme ortasında, ortalamada daha ucuz olsa bile değiştirmek, imzaladıkları şeyin ihlali gibi okunur. Geçiş mekaniğinin ayrıntıları için [kullanıma dayalı fiyata sancısız geçiş](/tr/posts/kullanima-dayali-fiyata-sancisiz-gecis) yazımıza bakabilirsin.

## Kullanıma ve sonuca dayalı fiyatlamada ne ters gidiyor?

İki arıza modu tekrar tekrar görülüyor: fatura şoku (müşterinin kullanımı beklenmedik şekilde sıçrıyor ve fatura kimse fark etmeden geliyor) ve metrik oyunu (müşteri, ürünü daha iyi kullanmak için değil, faturalandırılabilir birimi en aza indirmek için iş akışını özel olarak yeniden düzenliyor). İkisinin de çözümü aynı: faturadan önce kullanım uyarısı, faturadan sonra değil; ve kolayca manipüle edilemeyen — gerçek değeri (çözülen bir talep gibi) takip eden, bir müşterinin kolayca etrafından dolaşabileceği bir sayaç (API çağrı sayısı gibi) değil — birimler üzerinden faturalama.

## Bu gerçek bir fiyatlama devrimi mi, yoksa aynı birim ekonomisinin yeniden paketlenmesi mi?

Dürüst okuma şu: Bu, yazılımı gerçekte kimin kullandığındaki gerçek bir değişime verilen bir cevap, daha fazla gelir sızdırmak için bir numara değil — ajan-eylemi başına fiyatlama, koltuk başı fiyatlamanın hiçbir zaman olamadığı kadar birim-değer başına fiyatlamaya yakın, çünkü koltuk her zaman kullanımın bir vekiliydi ve şimdi o vekil bozuldu. Yine de, bir fiyatlama modeli değişikliğini önce marj matematiğini yeniden yapmadan bedava bir gelir kaldıracı gibi gören her kurucu, [SaaS Fiyatlandırma: Yaygın Yanlışlar](/tr/posts/saas-fiyatlandirma-yaygin-yanlislar) yazımızda belgelenen hataların aynısına hazırlanıyor demektir — yeni bir model, birim ekonomisini atlamayı mazur göstermez.

## Sıkça Sorulan Sorular

### Koltuk başı fiyatlama 2026'da gerçekten düştü mü?

Evet — 2026 itibarıyla koltuk başı fiyatlama bir yılda SaaS şirketlerinin %21'inden %15'ine düştü, hibrit fiyatlama modelleri ise aynı dönemde %27'den %41'e çıktı. Tamamen kaybolmadı ama AI ajanlarının işin önemli bir kısmını yaptığı ürünlerde artık varsayılan model değil.

### SaaS'ta sonuca dayalı fiyatlama nedir?

Sonuca dayalı fiyatlama, erişim veya ham kullanım yerine teslim edilen bir sonucu ücretlendirir — Intercom'un Fin'i çözülen destek talebi başına yaklaşık 0,99 dolar, Salesforce Agentforce ise konuşma başına 2 dolar ücretlendiriyor; ikisi de kimin oturum açtığını veya kaç API çağrısı yapıldığını değil, ajanın ne başardığını faturalandırıyor.

### Kullanıma dayalı fiyatlamada fatura şokundan nasıl kaçınılır?

Çoğu ayın tahmin edilebilir olması için dahil kullanım kotalı bir sabit ücret belirle ve müşteri dahil kotasına yaklaşırken proaktif kullanım uyarıları gönder — ideal olarak fatura kesilmeden günler önce, faturada sürpriz bir satır olarak değil.

### Kullanıma dayalı fiyatlama her SaaS ürünü için işe yarar mı?

Hayır — kullanımın sağlanan değerle ilişkili olduğu ürünlere uyar, AI ajan eylemleri veya API çağrıları gibi. Kullanıcı başına sabit ve tahmin edilebilir kullanımı olan bir ürün (örneğin iç araçlar) genellikle koltuk başı fiyatlamaya daha uygun kalır, çünkü ölçümleme faturalama karmaşıklığı ekler ama fiyatı değere daha iyi eşlemez.
