---
title: "DDD'de Bounded Context Nedir, Nasıl Çizilir?"
slug: "ddd-bounded-context-pratik"
translationKey: "ddd-bounded-contexts-in-practice"
locale: "tr"
excerpt: "Kısa cevap: bounded context, bir terimin tek bir anlamı taşıdığı modelleme sınırıdır; mikroservis veya dağıtım birimi değildir, aynı kod tabanında da olabilir."
category: "software-engineering"
tags: ["software-architecture", "design-patterns", "microservices", "best-practices"]
publishedAt: "2026-11-09"
seoTitle: "DDD'de Bounded Context Nedir, Nasıl Çizilir?"
seoDescription: "Kısa cevap: bounded context, bir terimin tek bir anlamı taşıdığı modelleme sınırıdır; mikroservis veya dağıtım birimi değildir, aynı kod tabanında da olabilir."
---

Kısa cevap: bounded context, DDD'de bir modelin ve ortak dilinin geçerli olduğu kavramsal sınırdır — aynı terim ("sipariş", "müşteri") farklı bölümlerde farklı anlamlar taşıyabilir, çünkü her bölüm kendi sınırı içinde tutarlıdır. Eric Evans'ın 2003 kitabından beri tanımlı, 2026'da hâlâ standart bir desen; önemli bir nüans, bounded context'in mikroservis olmak zorunda olmaması — aynı kod tabanında bir modül olarak da yaşayabilir.

## DDD neden gerekli, hangi problemi çözüyor?

Büyüyen bir kod tabanında tek bir "Sipariş" modeli, hem satış ekibinin hem muhasebe ekibinin hem de kargo ekibinin farklı ihtiyaçlarını tek bir sınıfta karşılamaya çalışır; sonuç, her değişiklikte başka bir ekibi bozan, aşırı şişmiş bir model olur. DDD bunu, her ekibin kendi terminolojisiyle çalıştığı ayrı modeller tanımlayarak çözer — muhasebenin "sipariş"ı sadece tutar ve vergiyle ilgilenir, kargonun "sipariş"ı sadece adres ve paket boyutuyla ilgilenir.

## Ubiquitous language nedir, neden önemli?

Ubiquitous language, bir bounded context içinde geliştiricilerin ve domain uzmanlarının (iş tarafının) aynı terimleri aynı anlamda kullanmasıdır. Kod, değişken adları ve API'ler bu dili yansıtmalı; "müşteri" kelimesi hem iş tarafının toplantısında hem kodda `Customer` sınıfında aynı şeyi ifade etmeli. Bu hizalama bozulduğunda, geliştiriciler iş tarafıyla konuşurken sürekli çeviri yapmak zorunda kalır ve hatalar bu çeviri boşluğunda birikir.

## Bounded context'leri gerçek subdomain'lerden nasıl tanımlarsınız?

Bir subdomain, işin doğal olarak ayrıldığı bir alan (satış, envanter, faturalama) iken bounded context, o subdomain'i modellemek için seçtiğiniz yazılım sınırıdır — ikisi genellikle örtüşür ama zorunlu değildir. Pratik yöntem: bir terimin (örneğin "ürün") farklı ekiplerde farklı öznitelikler taşıdığı yerleri bulmak. Envanter ekibi için ürün, stok miktarı ve depo konumuyla ilgilidir; pazarlama ekibi için aynı ürün, açıklama ve görsellerle ilgilidir. Bu farklılık bir bounded context sınırına işaret eder.

## Context map ilişki türleri nelerdir?

Vance Vernon'un *Implementing Domain-Driven Design* kitabında tanımlanan context map kalıpları, bağlı iki context arasındaki ilişkiyi tanımlar:

| İlişki türü | Ne anlama gelir |
|---|---|
| Partnership | İki ekip birbirine bağımlı, birlikte planlama yapar |
| Shared Kernel | İki context, ortak bir kod/model parçasını paylaşır |
| Customer/Supplier | Downstream context, upstream'in önceliklerini etkileyebilir |
| Conformist | Downstream, upstream'in modelini değişiklik yapmadan kabul eder |
| Anti-Corruption Layer | Downstream, upstream'in modelini kendi diline çeviren bir katman kurar |
| Open Host Service | Upstream, entegrasyon için genel bir arayüz sunar |
| Published Language | İki context, ortak belgelenmiş bir format (örn. JSON şema) üzerinden anlaşır |
| Separate Ways | İki context arasında entegrasyon yok, bağımsız geliştirilir |

## Anti-corruption layer ne zaman gerekir?

Bir ödeme sağlayıcısının (örneğin Stripe) API modeli, kendi faturalama domain'inizin modeliyle birebir örtüşmediğinde, bu dış modeli doğrudan kullanmak yerine bir çeviri katmanı kurarsınız — Stripe'ın `PaymentIntent` nesnesini kendi `Odeme` kavramınıza çeviren bir katman. Bu, Conformist yaklaşımına (dış modeli olduğu gibi kabul etmek) göre daha fazla iş gerektirir ama kendi domain modelinizi dış sistemin değişikliklerinden korur.

```typescript
// Anti-corruption layer örneği: Stripe modelini kendi domain modelimize çeviriyoruz
function stripePaymentIntentToOdeme(intent: StripePaymentIntent): Odeme {
  return {
    odemeId: intent.id,
    tutarKurus: intent.amount,
    durum: intent.status === 'succeeded' ? 'tamamlandi' : 'beklemede',
  }
}
```

## Stratejik DDD ile taktiksel DDD arasındaki fark nedir?

Stratejik DDD, subdomain'leri, bounded context'leri ve context map'leri belirleyen üst seviye kararlardır — "sınırları nereye çizeceğiz" sorusuna cevap verir. Taktiksel DDD ise entity, value object, aggregate ve repository gibi kod seviyesindeki yapı taşlarıdır — "sınır içinde nasıl modelleyeceğiz" sorusuna cevap verir. Bu ayrım tartışmasız ve köklü bir ayrım; stratejik kararları yanlış verirseniz, taktiksel desenler ne kadar iyi uygulanırsa uygulansın modelin dağınıklığı devam eder.

## Bounded context'leri servislere nasıl eşlersiniz, erken mikroservisleşmeden kaçınarak?

Her bounded context'i otomatik olarak bir mikroservis yapmak yaygın bir hata; bounded context bir modelleme sınırıdır, dağıtım birimi değil. Pratik yol, bounded context'leri önce aynı kod tabanında ayrı modüller olarak tutmak — her modülün kendi klasörü, kendi dili ve açık bir arayüzü olur ama hepsi tek bir uygulamada çalışır. Ekip büyüdüğünde veya ölçekleme ihtiyacı gerçek veriyle kanıtlandığında, modül sınırı zaten net olduğu için ayrı bir servise çıkarmak nispeten düşük riskli hale gelir. [Mikroservis mi monolit mi karşılaştırmamızda](/tr/posts/mikroservis-mi-monolit-mi) bu kararın ne zaman gerçekten gerekli olduğunu ayrıca ele alıyoruz.

## Bounded context sınırları zamanla değişir mi?

Evet, bu normaldir. Bir startup'ın ilk aylarında "Kullanıcı Yönetimi" tek bir bounded context olabilir; şirket büyüdüğünde kimlik doğrulama, fatura bilgileri ve bildirim tercihleri birbirinden bağımsız değişen, farklı ekiplerin sahiplendiği ayrı alanlara dönüşebilir. Bu noktada tek context'i ikiye veya üçe bölmek gerekir. Tersi de olur: başta ayrı tasarlanan iki context, pratikte her zaman birlikte değiştiği ve aralarındaki entegrasyon maliyeti modelleme kazancından fazla olduğu için birleştirilebilir. Context sınırlarını "bir kere çizilir, bir daha değişmez" olarak görmek, DDD'de yaygın bir yanlış anlamadır; sınırlar, iş büyüdükçe veya ekip yapısı değiştikçe yeniden çizilmesi gereken canlı kararlardır.

## Bounded context'ler ile takım yapısı arasındaki ilişki nedir?

Conway Yasası'nın pratik sonucu: bir context'e birden fazla ekip aynı anda sahip olduğunda, o context'in sınırları bulanıklaşmaya başlar çünkü her ekip kendi önceliğine göre modeli çekiştirir. İdeal durumda her bounded context'in net bir sahibi (bir ekip) vardır; bir ekip birden fazla context'e sahip olabilir ama bir context'i iki ekip paylaşmamalıdır. Bu eşleşme bozulduğunda — örneğin organizasyon yeniden yapılandığında ama context sınırları eski ekip yapısını yansıtmaya devam ettiğinde — kod tabanında "kimin bu modeli değiştirmeye yetkisi var" sorusu belirsizleşir ve değişiklikler yavaşlar.

## Siparişi, faturalamayı ve kargoyu ayrı context'ler olarak nasıl modellersiniz?

E-ticaret örneğinde üç context: Satış context'inde sipariş, sepet ve fiyatlandırmayı içerir; Faturalama context'inde aynı sipariş artık fatura kalemi ve vergi hesabıdır; Kargo context'inde ise paket, adres ve teslimat durumudur. Satış context'i bir sipariş oluşturduğunda, Faturalama ve Kargo context'lerine olayla (event) bildirim gönderir — her context kendi modelini bu olaydan türetir, paylaşılan bir "Sipariş" tablosuna birlikte yazmazlar.

## DDD'ye küçük bir ekip veya tek kişilik bir projede gerek var mı?

Genellikle hayır, en azından stratejik DDD'nin tam ağırlığıyla değil. Tek bir ekip tüm sistemi anlıyorsa ve terim çatışması (aynı kelimenin farklı anlamlara gelmesi) henüz yaşanmıyorsa, resmi context map'ler ve anti-corruption layer'lar gereksiz bir ek karmaşıklık katar. DDD'nin asıl değeri, birden fazla ekip veya birden fazla alt sistem birbirinin terminolojisini bozmaya başladığında ortaya çıkıyor; o noktaya gelene kadar basit bir modül yapısı yeterli oluyor ve DDD'nin tam kelime dağarcığını (context map, anti-corruption layer gibi) erken tanıtmak, ekibi gerçek problemden çok terminoloji öğrenmeye odaklıyor. Bunun pratik bir göstergesi var: aynı toplantıda iki kişi "müşteri" dediğinde farklı şeyler kastediyorsa ve bu karışıklık somut hatalara yol açıyorsa, DDD'nin zamanı gelmiş demektir; aksi halde erken.

Kişisel görüşüm: ekiplerin DDD'yi uygulamaya çalışırken yaptığı en büyük hata, taktiksel desenlerle (aggregate, repository) başlamak ve stratejik soruyu (context sınırları nerede) hiç sormamak. Doğru sınırları olmayan bir sistemde ne kadar temiz aggregate yazarsanız yazın, ekipler birbirinin ayağına basmaya devam eder.

## Sıkça Sorulan Sorular

### Bounded context ile mikroservis aynı şey mi?

Hayır. Bounded context, bir modelin ve ortak dilin geçerli olduğu kavramsal/modelleme sınırıdır; bir mikroservis ise ayrı dağıtılan bir çalışma zamanı birimidir. Bir bounded context aynı kod tabanında bir modül olarak da yaşayabilir, ayrı bir servis olmak zorunda değildir.

### Ubiquitous language kimle konuşulan dil?

Ubiquitous language, bir bounded context içinde çalışan geliştiricilerin ve o alandaki iş uzmanlarının (domain expert) ortak kullandığı terminolojidir. Kod, toplantı ve dokümantasyonda aynı terimlerin aynı anlama gelmesini sağlar.

### Anti-corruption layer kurmak ne zaman gerekli değildir?

Dış bir sistemin modeli kendi domain modelinizle zaten uyumluysa veya o dış sistemle ilişkiniz uzun vadede değişmeyecek kadar stabilse, Conformist yaklaşımını (dış modeli doğrudan kabul etmek) tercih edebilirsiniz; anti-corruption layer'ın ek karmaşıklığı her entegrasyonda gerekli değildir.

### Stratejik DDD'ye taktiksel DDD'den önce mi başlamalıyım?

Evet, genel kabul gören sıra bu şekildedir: önce subdomain'leri ve bounded context sınırlarını belirlersiniz (stratejik), sonra her context'in içinde entity ve aggregate'leri tasarlarsınız (taktiksel). Sınırları yanlış çizip taktiksel desenlere geçmek, iyi kod yazılmış ama yanlış yerde duran bir modelle sonuçlanır.
