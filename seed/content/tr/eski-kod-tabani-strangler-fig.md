---
title: "Eski Kod Tabanını Evcilleştirmek: Strangler-Fig"
slug: "eski-kod-tabani-strangler-fig"
translationKey: "legacy-codebase-strangler-fig-2026"
locale: "tr"
excerpt: "Eski kod tabanını, yeni sistemi eskinin etrafında büyüterek ve trafiği kademeli aktararak evcilleştirebilirsiniz; buna strangler-fig deseni denir."
category: "software-engineering"
tags: ["legacy-code", "refactoring", "ai-coding", "testing", "software-architecture"]
publishedAt: "2026-10-15"
seoTitle: "Eski Kod Tabanını Evcilleştirmek: Strangler-Fig"
seoDescription: "Eski kod tabanını, yeni sistemi eskinin etrafında büyüterek ve trafiği kademeli aktararak evcilleştirebilirsiniz; buna strangler-fig deseni denir."
---

Kısa cevap: Eski bir kod tabanını, yeni sistemi eskinin etrafında büyütüp trafiği parça parça yönlendirerek evcilleştirirsiniz; tek bir büyük geçiş anında her şeyi aynı anda değiştirmezsiniz. Bu, Martin Fowler'ın strangler-fig deseni. Çoğu big-bang göçünü daha ortaya çıkmadan öldüren kapsam genişlemesini, özellik eşitliği tuzağını ve takılıp kalan yeniden yazımları bu yöntemle atlarsınız.

## Big-Bang Yeniden Yazımlar Neden Başarısız Olur?

Big-bang yeniden yazımlar başarısız olur çünkü çalışan, bilinen bir sistemi tek bir geçiş gününde kanıtlanmamış bir sistemle takas edersiniz; bu bahis ne kadar uzun sürerse kaybetmenin maliyeti o kadar artar. Dört başarısızlık biçimi sürekli tekrar eder.

**Kapsam genişlemesi.** "Ödeme servisini yeniden kur" diye başlayan bir proje, "veri modelini de düzelt, framework'ü de değiştir, yönetim panelini de yeniden tasarla" haline gelir; çünkü her şeye dokunuyorken orijinal sınırda durmak keyfi gelir.

**Özellik eşitliği tuzağı.** Yeni sistem, kimsenin neden öyle kararlaştırıldığını hatırlamadığı belgelenmemiş uç durumlar dahil, eski sistemin her tuhaflığını birebir taklit etmelidir; aksi halde kimse geçişe onay vermez. Eşitlik işinin doğal bir bitiş çizgisi yoktur.

**İkinci sistem etkisi.** Fred Brooks bunu *The Mythical Man-Month* kitabında adlandırdı: iyi bildikleri bir sistemi yeniden kuran ekipler, yedek sistemi fazla tasarlama eğilimine girer ve ilk sürümde eksik kalan her özelliği eklemeye çalışır. İkinci sistem, ilkinden daha yavaş teslim edilir.

**İkisini birden çalıştırma baskısı.** Yeniden yazım sürerken iş birimi eski sistemde de yeni özellikler ister; böylece bir sistemin gerektirdiği mühendislik saatini iki kod tabanı birden tüketir. Güvenli ve kademeli refactoring teknikleri için [Legacy Kod Güvenli Şekilde Nasıl Refactor Edilir](/tr/posts/legacy-kod-refactoring) yazısına bakabilirsiniz.

## Strangler-Fig Deseni Nedir?

Strangler-fig deseni, Martin Fowler'ın bir ev sahibi ağacın etrafında büyüyüp onu kademeli olarak yerinden eden asma bitkisinden esinlenerek adlandırdığı, yeni bir sistemin eski sistemin etrafında büyüyüp sorumluluklarını tek seferlik bir geçişle değil parça parça devraldığı kademeli bir göç stratejisidir. Fowler bunu [2004 tarihli bir bliki yazısında](https://www.martinfowler.com/bliki/StranglerFigApplication.html) tanımladı; yazı sonradan "Strangler Fig Application" adını aldı.

Pratikte, eski sistemin önünde bir facade veya router durur. Yeni geliştirilen ve zamanla göç ettirilen eski işlevler, bu facade'ın arkasındaki yeni sistemde yaşamaya başlar. Trafik rota rota veya özellik özellik kayar; göçün herhangi bir noktasında uygulama, eski ve yeni kodun çalışan bir karışımıdır. Bu, [monolit bir sistemi servislere ayırmanın](/tr/posts/mikroservis-mi-monolit-mi) arkasındaki aynı kademeli zihniyettir: her şeyi birden değil, sırada neyi ayıracağınızı seçersiniz.

## Characterization Test Nedir, Neden Önce Yazılır?

Characterization test, kodun ne yapması gerektiğini değil şu anda ne yaptığını kayda geçiren bir testtir; böylece davranışı yanlışlıkla değiştirdiğiniz anı yakalarsınız. Terimi Michael Feathers, *Working Effectively with Legacy Code* kitabında ortaya attı ve tarif ettiği akış neredeyse mekaniktir: kodu çağır, başarısız olmasını beklediğin bir assertion yaz, testi çalıştır, gerçek çıktıyı oku, o çıktıyı beklenen değer olarak testine yapıştır. Mekaniğin ayrıntıları için [InfoQ'nun 2007 tarihli characterization testing yazısına](https://www.infoq.com/news/2007/03/characterization-testing) bakabilirsiniz.

Buradaki asıl mesele sıralama. Characterization testlerini eski koda dokunmadan önce yazarsınız, sonra değil; çünkü testsiz eski kod, bir değişikliğin davranışı koruyup korumadığını veya sessizce bozup bozmadığını anlamanızın hiçbir yolunu bırakmaz. Characterization testleri, bundan sonra yazacağınız iyi tasarlanmış unit testlerin yerini almaz; bu pratiğin o tarafı için [İşe Yarayan Unit Testler Nasıl Yazılır](/tr/posts/unit-test-nasil-yazilir) yazısına bakın. Characterization testleri, özellikle sizin yazmadığınız ve henüz tam güvenmediğiniz kod için bir güvenlik ağıdır.

## Seam Nedir, Anti-Corruption Layer Ne İşe Yarar?

Seam, Feathers'ın ikinci önemli terimi, kodda tam o noktayı değiştirmeden davranışı değiştirebileceğiniz bir yerdir; örneğin testten override edebileceğiniz bir fonksiyon çağrısı. Seam'ler, hiç test edilebilir tasarlanmamış kodun etrafına characterization test yazmanızı sağlar: bağımlılığın kendisini yeniden yazmak yerine, seam noktasında sahte bir bağımlılık enjekte edersiniz.

Anti-corruption layer, Eric Evans'ın *Domain-Driven Design* kitabında tanımladığı, farklı veri modellerine sahip iki sistem arasında duran ve istekleri çevirerek hiçbir modelin diğerine sızmasını önleyen bir çeviri katmanıdır. Strangler-fig göçü sırasında anti-corruption layer, yeni sistemin eski sistemin API'lerini (veya tersini) eski sistemin varsayımlarını yeni kod tabanına sızdırmadan çağırmasını sağlayan katmandır. Microsoft'un mimari rehberinde [anti-corruption layer deseninin](https://learn.microsoft.com/tr-tr/azure/architecture/patterns/anti-corruption-layer) ve hangi göçlerin buna ihtiyaç duyduğunun kısa bir anlatımı var.

## Trafik Yeni Sisteme Kademeli Olarak Nasıl Yönlendirilir?

Trafiği kademeli yönlendirmek için, her isteğin eski mi yeni mi sistem tarafından karşılanacağına rota, kullanıcı segmenti veya yayılım yüzdesine göre karar veren bir facade kullanırsınız. Strangler-fig göçünü geri alınabilir kılan mekanizma budur: yüzdeyi sıfıra çekersiniz, yeniden deploy etmeden eski sisteme dönmüş olursunuz.

```javascript
// Eski sipariş servisinin önündeki facade.
// Yeni yola giden trafik yüzdesini kademeli artırır.
function routeOrderRequest(req) {
  const migratedRoutes = new Set(["/orders/create", "/orders/:id/cancel"]);
  const rolloutPercent = 25; // küçük, incelenen adımlarla yükseltilir

  if (migratedRoutes.has(req.routePattern)) {
    const bucket = hashToBucket(req.userId); // kullanıcı başına sabit 0-99 aralığı
    if (bucket < rolloutPercent) {
      return newOrderService.handle(req);
    }
  }
  return legacyOrderService.handle(req);
}
```

Bu, [feature flag'lerin](/tr/posts/feature-flag-teknik-borc) başka yerlerde size verdiği yüzde bazlı kontrolün aynısıdır; burada tek bir toggle'a değil, bütün bir göç yoluna uygulanır. Yayılım yüzdesini konfigürasyonda tutun, kodda değil; böylece kötü bir göç adımı, deploy değil tek bir konfigürasyon değişikliği uzağında kalır.

## AI Kodlama Ajanları Eski Kodda 2026'da Güvenle Çalışabilir mi?

Evet, ama aynı değişikliği yapan bir insandan isteyeceğiniz korkulukların aynısıyla: önce characterization testleri yerinde olmalı, diff ise satır satır incelenebilecek kadar küçük olmalı. 2026 itibarıyla kodlama ajanları kod yazmakta yeterince hızlı; bu yüzden eski kod işindeki asıl darboğaz incelemeye kaydı. Önemli disiplin, her ajan diffini bir kerede tek bir seam veya tek bir rotaya sınırlı tutmak. Yazarın ajan olduğunda inceleme disiplininin nasıl değişmesi gerektiği için [AI ile Kod İncelemesi: Güven Ama Doğrula](/tr/posts/ai-ile-kod-incelemesi-guven-dogrula) yazısına bakın.

Eski bir modülün tamamını bir kerede göç ettirmesi istenen bir ajan, tek bir pull request içinde ikinci sistem etkisini yeniden üretme eğilimindedir; kimsenin dokunmasını istemediği şeyleri yeniden tasarlar. Bir ajanın eski kod üzerinde kendi başına big-bang bir yeniden yazım denemesine asla izin vermeyin. Ajanı karakterize edilmiş tek bir seam'e yönlendirin, küçük bir diff önermesine izin verin, characterization testlerini çalıştırın, sonraki seam'e geçmeden önce merge edin veya reddedin.

## Göç İlerlemesi Nasıl Ölçülür?

Strangler-fig göçünü, geçen takvim zamanıyla değil, yeni yolda olan trafik ve rota payıyla, her iki taraftaki hata oranıyla ve cycle time ile ölçün. Bu üç sayı, göçün gerçekten yakınsayıp yakınsamadığını gösterir.

| Sinyal | Big-bang yeniden yazım | Strangler-fig göçü |
|---|---|---|
| Geçiş riski | Yüksek: tüm trafik bir anda değişir | Düşük: trafik küçük, geri alınabilir adımlarla kayar |
| Geri alınabilirlik | Zor: canlıya çıktıktan sonra çoğu zaman dönüş yolu yok | Kolay: yayılım yüzdesini sıfıra çekmek yeterli |
| Zaman içinde maliyet | Sona doğru sıçrar, genelde ikiye katlanır (iki sistem birden çalışır) | Yayılır, örtüşme penceresi kısa kalır |
| Ekip aksaması | Yüksek: eski sistemde dondurma kararı sapmayı davet eder | Düşük: ekipler boyunca her iki tarafta da özellik çıkarır |
| İlerleme görünürlüğü | İkili: "bitti" veya "bitmedi" | Sürekli: göç eden rota yüzdesi, hata oranı, cycle time |

Trafik payı büyürken yeni yoldaki hata oranının yükselmesi, yayılımı hızlandırma değil yavaşlatma sinyalidir. Göç eden rotalarda küçülen cycle time ise genelde yeni sistemin gerçekten çalışmanın daha kolay olduğunun en güçlü kanıtıdır; zaten bütün bu işi eski sistemle sonsuza dek yaşamak yerine yapmanızın tek sebebi de budur.

## Sıkça Sorulan Sorular

### Strangler-fig deseni sadece mikroservis göçleri için mi?

Hayır. Strangler-fig deseni, bir sistemi hiç servislere bölmeden, monolitin modüllerini yeni bir facade'ın arkasına taşımak dahil, her türlü kademeli sistem değişimine uygular. Fowler'ın orijinal tanımı mikroservis kelimesinin bugünkü kullanımından önceye dayanır ve monolitten monolite yeniden yazımlar için de aynı şekilde geçerlidir.

### Strangler-fig göçü genelde ne kadar sürer?

Kod tabanının büyüklüğüne ve trafiğin karmaşıklığına bağlı değişir, ama çoğu strangler-fig göçü aylarca, bazen birkaç yıl sürer; bu süre boyunca iki sistem de canlıda çalışır. Desen, daha kısa ama riskli bir geçişi, işin her iki tarafta da özellik çıkarmaya devam ettiği daha uzun bir göç penceresiyle takas eder.

### Characterization testleri normal unit testlerin yerini tutar mı?

Hayır. Characterization testleri, mevcut ve bazen dağınık davranışı sabitler, böylece regresyon yaşamadan refactor edebilirsiniz; unit testler ise beklenen davranışı bir spesifikasyona göre doğrular. Ekipler genelde, eski kodun bir bölümü temizlenip anlaşıldıktan sonra characterization testlerini düzgün unit testlerle değiştirir.

### Bir AI kodlama ajanı strangler-fig göçünü tek başına yürütebilir mi?

Baştan sona güvenle hayır. Bir ajan facade mantığını önerebilir, characterization testleri üretebilir ve bir kerede tek bir seam için küçük göç diff'leri yazabilir; ama her diff'i bir insanın incelemesi, yayılım yüzdesi artışlarını onaylaması ve bir rotanın tamamen göç ettiğine karar vermesi gerekir.

Kaynaklar:
- [Martin Fowler, "Strangler Fig Application"](https://www.martinfowler.com/bliki/StranglerFigApplication.html)
- [InfoQ, "Characterization Testing"](https://www.infoq.com/news/2007/03/characterization-testing)
- [Microsoft Azure Architecture Center, "Anti-corruption Layer pattern"](https://learn.microsoft.com/tr-tr/azure/architecture/patterns/anti-corruption-layer)
