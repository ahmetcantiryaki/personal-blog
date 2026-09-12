---
title: "Girişimde AI Maliyetini Kontrol Etme Rehberi"
slug: "girisimde-ai-maliyetini-kontrol-et"
translationKey: "manage-ai-costs-startup-2026"
locale: "tr"
excerpt: "Kısa cevap: prompt önbellekleme maliyeti %90'a kadar düşürür, doğru model katmanına yönlendirme kalan farkı kapatır — ikisini atlayan marjını yakar."
category: "business"
tags: ["finops", "cost-optimization", "ai-infrastructure"]
publishedAt: "2026-09-12"
seoTitle: "Girişimde AI Maliyetini Kontrol Etme Rehberi"
seoDescription: "Token maliyetlerinin nereden geldiğini, önbellekleme ile model katmanı yönlendirmenin marjı nasıl koruduğunu ve bütçe uyarılarının kurulmasını anlatıyoruz."
---

Kısa cevap: bir girişimin yapay zeka maliyetini kontrol altında tutmasının en hızlı yolu, tekrarlayan bağlamı prompt önbellekleme ile ucuzlatmak (token başına maliyeti %90'a kadar düşürür) ve her görevi gerçekten ihtiyaç duyduğu model katmanına yönlendirmektir. Eylül 2026 itibarıyla bu ikisini birlikte yapmayan ekipler, aynı işi yapan rakiplerine göre üç ila on kat daha fazla ödüyor.

## AI maliyetinizin nereye gittiğini nasıl haritalarsınız?

Kısa cevap: maliyet dört ana kaynaktan geliyor — model katmanı seçimi, bağlam şişmesi (her istekte tekrar gönderilen gereksiz metin), başarısız denemelerin tekrar tekrar çalıştırılması ve çok adımlı ajan zincirlerinin her adımda ayrı bir çağrı yapması. Bu dördünü ayrı ayrı ölçmeden "AI faturamız yüksek" demek, hangi musluğu kapatacağınızı bilmeden su faturasını düşürmeye çalışmak gibi.

Pratikte en büyük tek kalem genelde bağlam şişmesi: bir müşteri destek botu her mesajda geçmiş konuşmanın tamamını, sistem talimatlarını ve belge parçalarını yeniden gönderiyorsa, bu sabit maliyet her istekte tekrarlanıyor. İkinci büyük kalem model seçimi — birçok ekip basit sınıflandırma görevlerini bile en pahalı model katmanında çalıştırıyor.

## Prompt önbellekleme gerçekte ne kadar tasarruf sağlıyor?

Kısa cevap: büyük sağlayıcıların tamamında önbelleklenmiş token'lar, standart girdi fiyatının yaklaşık %10'una mal oluyor — bu, tekrarlayan bağlam için %90'lık bir indirim demek. Örneğin Claude Sonnet 4.6'nın standart girdi fiyatı milyon token başına 3 dolarken, tekrarlanan bağlam önbellekleme olmadan milyon mesaj başına 24 dolara mal oluyor; önbellekleme açıldığında bu, aynı çıktı ve aynı ya da daha iyi gecikmeyle milyon token başına 0,30 dolara düşüyor.

Google tarafında da örüntü aynı: Gemini 2.5 ve sonrası modellerde yayımlanan her önbellek token fiyatı, girdi fiyatının tam olarak %10'u — 3.1 Pro'dan 2.5 Flash-Lite'a kadar tüm hat boyunca %90'lık bir indirim. Bir müşteri destek botu ya da kod asistanı gibi aynı sistem talimatını ve belge bağlamını binlerce kez tekrar kullanan her uygulama için bu, açık ara en yüksek getirili tek optimizasyon.

| Optimizasyon | Tipik tasarruf | Uygulama zorluğu |
|---|---|---|
| Prompt önbellekleme | Tekrarlanan bağlamda ~%90 | Düşük — çoğu SDK'da yerleşik |
| Doğru model katmanına yönlendirme | Görev başına %70-97 | Orta — sınıflandırma mantığı gerekir |
| Bağlam kırpma (trimming) | %20-50 | Düşük-orta |
| Yeniden deneme sınırlama | Değişken, kaçak maliyetleri önler | Düşük |

## Hangi görevi hangi model katmanına yönlendirmelisiniz?

Kısa cevap: basit sınıflandırma, özetleme ve biçimlendirme gibi görevleri en ucuz katmana (ör. Gemini Flash-Lite), çok adımlı akıl yürütme ve kod üretimini orta katmana, yalnızca gerçekten karmaşık ajan görevlerini en üst katmana (ör. Opus sınıfı modeller) yönlendirin. Gemini 2.5 Flash-Lite, milyon token başına 0,10 / 0,40 dolar (girdi/çıktı) ile en ucuz seçeneklerden biri; bu, girdi tarafında Claude Sonnet'ten yaklaşık 30 kat daha ucuz.

Fiyat farkının bu kadar büyük olması, yönlendirme mantığını basit bir if-else kuralına indirger: bir görev "bu metni özetle" ya da "bu e-postayı sınıflandır" gibi düşük karmaşıklıktaysa, en pahalı modele göndermenin hiçbir gerekçesi yok. Aşağıdaki gibi basit bir yönlendirme katmanı, ayda binlerce dolar fark yaratabilir:

```typescript
function pickModel(task: TaskComplexity): string {
  if (task.tokensOut < 200 && task.type === 'classification') {
    return 'gemini-2.5-flash-lite'
  }
  if (task.requiresMultiStepReasoning) {
    return 'claude-sonnet-4-6'
  }
  return 'claude-opus-5'
}
```

## Müşteri başına maliyeti nasıl takip edersiniz?

Kısa cevap: her API çağrısına müşteri kimliğini bir etiket olarak ekleyin ve token kullanımını fatura döneminde toplayın — bu, hangi müşterinin gerçekte kâr, hangisinin zarar getirdiğini gösterir. Kullanıma dayalı bir fiyatlandırma modeliniz yoksa bile, bu veri fiyatlandırma stratejinizi düzeltmek için gerekli.

Bazı ekipler, ağır kullanıcıları fark etmeden aylar boyunca sabit fiyatla hizmet veriyor; bu, marjı sessizce eritiyor. Müşteri başına maliyet takibi olmadan, hangi hesabın gerçekte zarar ettiğini ancak çeyrek sonu mali tablolara bakınca anlıyorsunuz — o zaman da düzeltmek için çok geç kalmış oluyorsunuz.

Bu takibi kurmanın en pratik yolu, API çağrısı yapan her fonksiyona bir `customerId` parametresi zorunlu kılmak ve bunu loglama altyapınıza (ör. Datadog, ClickHouse ya da basit bir Postgres tablosu) otomatik olarak akıtmaktır. Ay sonunda "bu müşteri bize kaç dolara mal oldu, bize kaç dolar ödedi" sorusuna saniyeler içinde cevap veremiyorsanız, fiyatlandırma stratejinizi veri değil tahminle belirliyorsunuz demektir.

## Yeniden deneme (retry) döngüleri maliyeti nasıl gizlice şişiriyor?

Kısa cevap: bir API çağrısı zaman aşımına uğradığında ya da hatalı bir yanıt döndürdüğünde, sınırsız yeniden deneme mantığı aynı isteği art arda tekrar tekrar gönderebilir — her deneme tam fiyatına mal olur ve kullanıcı hiçbir fayda görmez. Bu, özellikle çok adımlı ajan zincirlerinde tehlikeli: bir adım başarısız olduğunda tüm zincirin baştan çalıştırılması, önceki adımların token maliyetini de tekrar ödemeniz anlamına gelir.

Pratik çözüm, her görev için maksimum deneme sayısı ve üstel geri çekilme (exponential backoff) tanımlamak, üçüncü başarısız denemeden sonra insan gözden geçirmesine düşürmek. Bu basit kural, kaçak bir döngünün bir gecede binlerce dolarlık faturaya dönüşmesini engelliyor.

Bir diğer sık görülen hata, hata ayıklama (debug) ya da geliştirme ortamında bırakılan test scriptlerinin üretim API anahtarını kullanmaya devam etmesi. Ayrı geliştirme ve üretim anahtarları tanımlamak, hem maliyet ayrıştırmasını kolaylaştırıyor hem de bir geliştirme ortamı hatasının üretim bütçenizi tüketmesini engelliyor.

## Bütçe uyarıları ve harcama tavanları nasıl kurulur?

Kısa cevap: her ortam (geliştirme, hazırlık, üretim) için ayrı günlük ve aylık harcama tavanı tanımlayın, tavanın %70'ine ulaşıldığında uyarı, %100'üne ulaşıldığında ise otomatik durdurma tetikleyin. Kaçak bir döngü (retry loop) ya da yanlış yapılandırılmış bir ajan, birkaç saat içinde aylık bütçenizin tamamını tüketebilir — bu, teorik bir risk değil, düzenli olarak gerçekleşen bir olay.

Kişisel değerlendirmem: çoğu girişim maliyet optimizasyonunu "sonra hallederiz" diye erteliyor, ama bunu ürün-pazar uyumu bulunduktan sonra yapmak çok daha zor — çünkü o noktada trafiğiniz zaten büyümüş oluyor ve her düzeltme, üretimde çalışan bir sistemi değiştirmek anlamına geliyor. Önbellekleme ve model yönlendirmeyi gün birden kurmak, sonradan geriye dönük bir maliyet krizini çözmekten çok daha ucuz.

Yapay zeka özelliklerini zarar etmeden fiyatlandırma tarafına dair daha fazlası için [AI özelliklerini fiyatlandırma yazımıza](/tr/posts/ai-ozelliklerini-fiyatlandirma) bakabilirsiniz; girişimcilik kategorisindeki diğer yazılar için [Girişimcilik & İş kategori sayfamızı](/tr/category/girisimcilik-is) inceleyebilirsiniz.

## Sıkça Sorulan Sorular

### Prompt önbellekleme AI maliyetini gerçekten ne kadar düşürüyor?

Büyük sağlayıcıların (Anthropic, Google) tamamında önbelleklenmiş token'lar standart girdi fiyatının yaklaşık %10'una mal oluyor — bu, sistem talimatları ve belge bağlamı gibi tekrarlayan içerik için yaklaşık %90'lık bir maliyet indirimi anlamına geliyor.

### Hangi görevleri en ucuz AI model katmanına yönlendirmeliyim?

Sınıflandırma, özetleme ve biçimlendirme gibi düşük karmaşıklıktaki görevleri en ucuz katmana (örneğin Gemini Flash-Lite) yönlendirin; çok adımlı akıl yürütme gerektiren görevleri orta katmana, yalnızca gerçekten karmaşık ajan görevlerini en üst katmana ayırın.

### Müşteri başına AI maliyetini nasıl takip ederim?

Her API çağrısına müşteri kimliğini etiket olarak ekleyip token kullanımını fatura döneminde toplayarak takip edebilirsiniz; bu, hangi müşterinin kârlı hangisinin zarar ettirici olduğunu gösterir ve fiyatlandırma kararlarınızı verilerle destekler.

### AI harcamamın kontrolden çıkmasını nasıl önlerim?

Her ortam için günlük ve aylık harcama tavanı tanımlayıp, tavanın %70'inde uyarı ve %100'ünde otomatik durdurma kuralı kurun; bu, kaçak bir yeniden deneme döngüsünün ya da yanlış yapılandırılmış bir ajanın bütçenizi saatler içinde tüketmesini engeller.
