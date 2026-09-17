---
title: "INP Nasıl Düzeltilir? Etkileşim Gecikmesi Çözümü"
slug: "inp-etkilesim-gecikmesi-duzelt"
translationKey: "fix-inp-interaction-next-paint-2026"
locale: "tr"
excerpt: "Kötü INP'yi düzeltmek için 50 ms'yi aşan görevleri scheduler.yield() ile bölün; sitelerin %43'ü 200 ms'lik iyi eşiği geçemiyor, en zorlu metrik bu."
category: "web-development"
tags: ["core-web-vitals", "web-performance", "performance", "frontend"]
publishedAt: "2026-09-17"
seoTitle: "INP Nasıl Düzeltilir? Etkileşim Gecikmesi Çözümü"
seoDescription: "Kötü INP'yi düzeltmek için 50 ms'yi aşan görevleri scheduler.yield() ile bölün; sitelerin %43'ü 200 ms'lik iyi eşiği geçemiyor, en zorlu metrik bu."
---

Kısa cevap: Kötü INP'yi düzeltmenin yolu, 50 milisaniyeyi aşan uzun görevleri `scheduler.yield()` ile bölmek, üçüncü taraf script'leri ana iş parçacığından uzaklaştırmak ve olay işleyicilerindeki gereksiz işi azaltmaktır. Eylül 2026 itibarıyla sitelerin yaklaşık %43'ü 200 ms'lik iyi INP eşiğini geçemiyor; bu da INP'yi en sık başarısız olunan Core Web Vital yapıyor.

## INP tam olarak neyi ölçüyor, FID'in yerini neden aldı?

INP (Interaction to Next Paint), bir ziyaret boyunca yapılan TÜM etkileşimlerin (tıklama, dokunma, tuş basımı) tarayıcının ekrana bir sonraki kareyi çizmesine kadar geçen süresini ölçer ve bunların en kötüsünü rapor eder; FID ise sadece sayfadaki İLK etkileşimin gecikmesine bakıyordu.

Bu fark önemli: bir sayfa ilk tıklamada hızlı tepki verip beşinci tıklamada donabilir, FID bunu hiç yakalamazdı. INP'nin eşiği 200 ms; FID'in eşiği ise 100 ms'ydi, ama iki metrik farklı şeyi ölçtüğü için doğrudan karşılaştırılamaz. [Core Web Vitals kontrol listemizde](/tr/posts/core-web-vitals-kontrol-listesi) üç metriğin tamamını bir arada ele almıştık; bu yazı sadece INP'ye odaklanıyor.

## INP'nin üç bileşeni nedir: giriş gecikmesi, işleme, sunum?

INP üç aşamadan oluşur: giriş gecikmesi (input delay — kullanıcı tıkladığında tarayıcının o olayı işlemeye başlamasına kadar geçen süre), işleme süresi (processing — olay işleyicisinin (event handler) çalışma süresi) ve sunum gecikmesi (presentation delay — işleyici bittikten sonra tarayıcının yeni kareyi boyamasına kadar geçen süre).

Pratikte en büyük gecikme genellikle işleme aşamasında birikir: ağır bir olay işleyicisi, gereksiz state güncellemeleri veya büyük bir liste render'ı ana iş parçacığını bloke eder. Giriş gecikmesi genelde ana iş parçacığında zaten çalışan başka bir uzun görev varsa büyür; bu yüzden tek bir işleyiciyi optimize etmek bazen yetmez, sayfadaki TÜM uzun görevleri gözden geçirmek gerekir.

| INP değeri | Değerlendirme |
|---|---|
| ≤ 200 ms | İyi |
| 200 ms – 500 ms | İyileştirme gerekli |
| > 500 ms | Kötü |

## Kötü INP'nin kaynağını nasıl bulursunuz?

Kötü INP'nin kaynağını bulmak için önce alan verisine (CrUX raporu veya kendi RUM'unuz) bakıp hangi sayfa ve hangi etkileşim türünün en kötü INP'yi ürettiğini belirleyin, sonra Chrome DevTools'un Performance panelinde o etkileşimi tekrarlayıp "Uzun Görevler" (Long Tasks) bölümündeki kırmızı bloklara odaklanın.

Lab verisi (kendi makinenizde ölçtüğünüz) ile alan verisi (gerçek kullanıcılardan gelen) sıklıkla farklı sonuç verir; düşük özellikli bir telefonda 50 ms süren bir görev, geliştirici makinenizde fark edilmeyebilir. Bu yüzden nihai doğrulama her zaman alan verisinden gelmeli, lab verisi sadece hata ayıklama için kullanılmalı.

Chrome DevTools'un Performance panelinde bir kaydı incelerken "Bottom-Up" sekmesi, hangi fonksiyonun toplam süreye en çok katkı yaptığını sıralı şekilde gösterir; genellikle en üstteki birkaç satır, sorunun kaynağını doğrudan işaret eder. Ayrıca `PerformanceObserver` API'sini kullanarak kendi sitenizde hangi etkileşimlerin 200 ms sınırını aştığını doğrudan üretimde loglamak, sorunu laboratuvar ortamında tekrar üretmeye çalışmaktan çok daha hızlı bir teşhis yolu; bu loglar hangi sayfa şablonunun, hangi cihaz sınıfında sorun yaşadığını doğrudan gösterir.

## scheduler.yield() ile uzun görevler nasıl bölünür?

`scheduler.yield()`, JavaScript'in uzun bir görev ortasında tarayıcıya kontrolü açıkça geri vermesini sağlayan yeni bir tarayıcı API'si; bu sayede tarayıcı, bekleyen kullanıcı etkileşimlerini işleyebiliyor ve ardından kaldığı yerden devam ediyor.

```javascript
// Tarayıcı desteği yoksa setTimeout'a düşen bir yardımcı fonksiyon
async function yieldToMain() {
  if ('scheduler' in globalThis && 'yield' in globalThis.scheduler) {
    return globalThis.scheduler.yield();
  }
  return new Promise((resolve) => setTimeout(resolve, 0));
}

async function processLargeList(items) {
  for (let i = 0; i < items.length; i++) {
    processItem(items[i]);
    // Her 50 öğede bir ana iş parçacığına kontrolü bırak
    if (i % 50 === 0) {
      await yieldToMain();
    }
  }
}
```

Buradaki kritik nokta: `scheduler.yield()` görevi tamamen durdurmaz, sadece bekleyen bir kullanıcı etkileşimi varsa önce onu işleme fırsatı tanır. Tarayıcı desteklemiyorsa `setTimeout(resolve, 0)` düşüşü aynı mantığı, biraz daha yavaş ama güvenilir şekilde sağlar.

## Üçüncü taraf script'ler ve debounce ile ne yapılır?

Üçüncü taraf script'leri (analitik, reklam, canlı destek widget'ları) ana iş parçacığından uzaklaştırmanın en etkili yolu, mümkün olduğunda bir Web Worker'a taşımak veya en azından `defer`/`async` ile yüklemeyi geciktirmektir; bu script'ler genellikle sayfanın kendi kodundan daha uzun görevlere sebep olur.

Arama kutusu gibi her tuş vuruşunda tetiklenen olay işleyicilerinde debounce veya throttle uygulamak, gereksiz tekrarlanan işlemeyi engeller. React kullanıyorsanız gereksiz yeniden render'ları azaltmak da işleme süresini kısaltır; bu konuyu [React Compiler: Elveda useMemo?](/tr/posts/react-compiler-usememo-elveda) yazımızda daha detaylı ele almıştık.

## Ana iş parçacığını en sık hangi üç kalıp bozuyor?

Ana iş parçacığını en sık bozan üç kalıp şunlar: her tuş vuruşunda tüm listeyi yeniden render eden arama kutuları, senkron yüklenen ağır üçüncü taraf script'ler ve DOM'u art arda okuyup yazan "layout thrashing" döngüleri; üçü de tek bir olay işleyicisinin 50 ms sınırını kolayca aşmasına neden olur.

Büyük bir listeyi her tuş vuruşunda yeniden render etmek yerine, kullanıcı yazmayı bitirene kadar render'ı erteleyen bir debounce veya React'te `startTransition` kullanmak, ana iş parçacığını her karakterde değil sadece gerçekten gerektiğinde meşgul eder. Layout thrashing'i önlemek için DOM okuma işlemlerini (`offsetHeight`, `getBoundingClientRect`) bir döngünün başında toplayıp yazma işlemlerini (`style` değişiklikleri) sonuna almak, tarayıcının gereksiz yeniden hesaplama yapmasını engeller. Üçüncü taraf script'lerin çoğu ise zaten kendi kontrolünüzde olmadığı için, onları sayfanın ana içeriği yüklendikten sonra tetiklemek genellikle tek pratik çözüm.

## RUM ile nasıl doğrularsınız?

Yaptığınız değişikliğin gerçekten işe yaradığını doğrulamanın tek güvenilir yolu, gerçek kullanıcı izleme (RUM) verisinde INP'nin 75. yüzdelik diliminin düşüp düşmediğini birkaç hafta boyunca takip etmektir; tek bir dağıtımdan sonraki anlık iyileşme yanıltıcı olabilir.

`web-vitals` kütüphanesiyle INP'yi kendi analitiğinize göndermek, Search Console'un CrUX raporunu beklemeden haftalık trend görmenizi sağlar; bu da bir dağıtımın etkisini günler içinde değil saatler içinde görmenize imkan tanır. Görsellerin sayfa yüklenmesini yavaşlatması INP'yi dolaylı olarak etkileyebilir; bu konuda [web performansı için görsel optimizasyonu](/tr/posts/web-gorsel-optimizasyonu) yazımız tamamlayıcı bir kaynak.

Kişisel görüşüm şu: ekiplerin çoğu INP'yi "bir gün düzeltiriz" listesine atıyor çünkü LCP kadar görsel olarak çarpıcı değil; oysa kullanıcı bir düğmeye bastığında donan bir arayüz, yavaş yüklenen bir sayfadan çok daha fazla güven kaybettiriyor.

Daha fazla performans yazısı için [web-gelistirme](/tr/category/web-gelistirme) kategorimize göz atabilirsiniz; orada render stratejileri, bundler seçimleri ve diğer Core Web Vitals konularını da düzenli olarak ele alıyoruz. [web.dev'in INP rehberi](https://web.dev/articles/inp) ve [MDN'in scheduler.yield() dokümantasyonu](https://developer.mozilla.org/en-US/docs/Web/API/Scheduler/yield) bu yazının teknik referans kaynaklarıdır.

## Sıkça Sorulan Sorular

### INP'de iyi sayılan değer nedir?

200 milisaniye veya altı iyi kabul edilir, 200-500 ms iyileştirme gerektirir, 500 ms üzeri kötü sayılır. Bu eşikler Google'ın Core Web Vitals raporunda 75. yüzdelik dilime göre değerlendirilir, yani ziyaretçilerinizin en az %75'i bu değerin altında bir deneyim yaşamalı.

### scheduler.yield() tüm tarayıcılarda çalışıyor mu?

Hayır, Eylül 2026 itibarıyla tüm büyük tarayıcılarda tam destek yok; bu yüzden `globalThis.scheduler?.yield` kontrolü yapıp desteklenmediğinde `setTimeout(resolve, 0)` düşüşüne geçen bir yardımcı fonksiyon kullanmak güvenli bir yaklaşımdır. Düşüş fonksiyonu aynı sonucu verir, sadece biraz daha yavaş çalışır.

### INP'yi düzeltmek LCP'yi de iyileştirir mi?

Doğrudan değil; LCP sayfanın en büyük içeriğinin ne kadar hızlı boyandığını, INP ise etkileşimlere ne kadar hızlı tepki verildiğini ölçer. Ancak ana iş parçacığındaki uzun görevleri azaltmak (örneğin ağır JavaScript paketlerini küçültmek) genellikle her iki metriği de aynı anda iyileştirir, çünkü ikisi de aynı kaynağı, ana iş parçacığının müsaitliğini paylaşır.

### Mobil cihazlarda INP neden daha kötü çıkıyor?

Mobil işlemciler masaüstü işlemcilerden belirgin şekilde daha yavaş çalıştığı için, masaüstünde 30 ms süren bir görev orta seviye bir telefonda 100-150 ms'ye çıkabilir. Bu yüzden INP'yi yalnızca kendi geliştirici makinenizde değil, CPU hızını yapay olarak düşüren bir "throttling" ayarıyla test etmek gerçek kullanıcı deneyimine çok daha yakın sonuç verir.
