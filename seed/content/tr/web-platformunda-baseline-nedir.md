---
title: "Web Platformunda 'Baseline' Nedir?"
slug: "web-platformunda-baseline-nedir"
translationKey: "baseline-web-platform-2026"
locale: "tr"
excerpt: "Baseline, bir web özelliğinin Chrome, Firefox, Safari ve Edge'de polyfill gerekmeden kullanılabilir olduğunu gösteren ortak bir sınıflandırmadır."
category: "web-development"
tags: ["web-standards", "css", "frontend", "best-practices"]
publishedAt: "2026-11-21"
seoTitle: "Web Platformunda Baseline Nedir?"
seoDescription: "Baseline, bir CSS veya JS özelliğinin tüm büyük tarayıcılarda güvenle kullanılabilir olduğunu gösteren ortak etikettir. Üç aşamasını örnekle anlatıyoruz."
---

Kısa cevap: Baseline, bir web platformu özelliğinin (CSS, JavaScript API'si veya HTML) üretimde polyfill veya alternatif kod yazmadan kullanılabileceğini gösteren ortak bir etikettir. Web Features / WebDX topluluk grubu tarafından yürütülür; Chrome, Firefox, Safari ve Edge gibi büyük tarayıcı üreticilerinin ve Interop projesinin desteğini alır. Bir özellik Baseline etiketini taşıyorsa, o özelliği doğrudan kullanabilirsiniz.

## Baseline nedir ve kim belirliyor?

Baseline, tek bir şirketin değil, tarayıcı üreticilerinin birlikte yürüttüğü bir sınıflandırma sistemidir. MDN, web.dev ve makine tarafından okunabilen "web-features" veri kümesi bu sınıflandırmayı aynı kaynaktan besler, yani farklı sitelerde farklı cevaplar almazsınız.

Sistemin amacı basit: geliştiricilerin "bu CSS özelliğini şimdi kullanabilir miyim, yoksa fallback mi yazmalıyım?" sorusuna hızlı ve güvenilir bir cevap bulmasını sağlamak. Önceden bu bilgi caniuse.com gibi sitelerdeki yüzdelik kullanım verilerinden çıkarılmaya çalışılıyordu; Baseline bunun yerine net eşikler koyar.

Baseline'ın arkasındaki mantık, tarayıcı uyumluluğunu artık bireysel geliştiricinin tahmin etmesi gereken bir risk olarak değil, platformun kendisinin yayınladığı bir gerçek olarak ele almaktır. Bir ekip yeni bir CSS özelliği kullanmaya karar verirken artık dört farklı tarayıcının değişim günlüklerini (changelog) tek tek taramak zorunda değil; tek bir etikete bakması yeterli. Bu, özellikle büyük ekiplerde kod inceleme sürecini de hızlandırıyor, çünkü "bu özellik güvenli mi?" sorusu artık tartışmaya açık bir konu değil, doğrulanabilir bir veri noktası.

## Baseline'ın üç aşaması nedir?

Baseline üç seviyeli bir zaman çizelgesi kullanır ve her özellik bu çizelgede belirli bir noktada durur. Bir özellik önce "sınırlı", sonra "yeni" ve en sonunda "geniş" kullanılabilirlik seviyesine ulaşır.

| Aşama | Anlamı |
|---|---|
| Sınırlı kullanılabilirlik (Limited availability) | Özellik, çekirdek tarayıcı motorlarının (Chromium, Gecko, WebKit) tümünün en güncel kararlı sürümünde henüz yayınlanmadı. |
| Yeni kullanılabilirlik (Newly available) | Özellik artık Chrome, Edge, Firefox ve Safari'nin (masaüstü ve mobil) en güncel kararlı sürümlerinde çalışıyor, ancak eski tarayıcı ve cihazlarda çalışmayabilir. |
| Geniş kullanılabilirlik (Widely available) | "Yeni" statüsünden 30 ay (2,5 yıl) sonra kazanılır; özellik artık uzun süreli, istikrarlı bir destek geçmişine sahiptir. |

Bu tanım zamanla değişti: eski sürümde bir özellik, her büyük tarayıcının güncel sürümü ve bir önceki sürümünde çalışıyorsa Baseline sayılıyordu. Yönetim grubu bunu daha sonra, yukarıdaki "yeni" ve "geniş" iki aşamalı zaman çizelgesine dönüştürdü; bu değişiklik, "Baseline" kelimesinin tek bir anlık fotoğraf değil, bir özelliğin olgunlaşma sürecini anlatan bir zaman çizelgesi haline gelmesini sağladı.

Bu ayrımın pratikte önemi büyük. Bir e-ticaret sitesi veya kurumsal bir yazılım ekibi, "yeni kullanılabilirlik" ile "geniş kullanılabilirlik" arasındaki farkı bilerek risk toleransına uygun kararlar verebilir. Örneğin, kullanıcı tabanının büyük kısmı güncel tarayıcı kullanan bir iç yönetim paneli, "yeni kullanılabilir" bir özelliği hemen devreye alabilir. Buna karşılık, geniş ve çeşitli bir kitleye hizmet veren halka açık bir web sitesi, aynı özellik için "geniş kullanılabilirlik" eşiğini beklemeyi tercih edebilir.

## :has() örneği Baseline'ı nasıl gösterir?

CSS'teki `:has()` ilişkisel sözde sınıfı, Baseline'ın üç aşamasını gerçek bir vakada görmek için iyi bir örnektir. MDN'e göre `:has()`, Aralık 2023'ten itibaren tüm güncel cihaz ve tarayıcı sürümlerinde çalışıyor, yani o tarihte "yeni kullanılabilirlik" eşiğini geçti.

Bir Baseline takip aracına göre `:has()`, "yeni" statüsünden tam 30 ay sonra, 19 Haziran 2026 tarihinde "geniş kullanılabilirlik" statüsüne geçmesi bekleniyordu. Bugün, 21 Kasım 2026 itibarıyla bu eşik çoktan geride kaldı; dolayısıyla `:has()` artık hem resmi Baseline ölçütüne göre hem de pratikte "geniş" kabul edilen bir özellik. Takip sitelerine göre `:has()`, 2026 itibarıyla küresel tarayıcı kullanımının yüzde 94'ünden fazlasında zaten destekleniyor; bu ikincil kaynaklı bir rakam olsa da, özelliğin ne kadar yaygınlaştığını gösteriyor. `:has()`'in pratik kullanımına dair ayrıntılı bir örnek için [Modern CSS: :has() ve Yerel İç İçe Yazım](/tr/posts/modern-css-has-ic-ice-yazim) yazımıza göz atabilirsiniz.

## Bir özellik Baseline'a girmeden önce nasıl güvenle kullanılır?

Bir özellik henüz "geniş kullanılabilirlik" seviyesine ulaşmadıysa, kodunuzda `@supports` ile özellik tespiti (feature detection) yapmak en güvenli yoldur. Bu, tarayıcının o özelliği destekleyip desteklemediğini çalışma zamanında kontrol etmenizi sağlar ve desteklemeyen tarayıcılar için bir yedek (fallback) stil tanımlamanıza izin verir.

```css
/* :has() destekleniyorsa gelişmiş seçiciyi kullan */
@supports selector(:has(*)) {
  .card:has(img) {
    grid-template-columns: 1fr 2fr;
  }
}

/* Desteklenmiyorsa sade bir yedek düzen uygula */
.card {
  display: grid;
  grid-template-columns: 1fr;
}
```

Ekipler bu mantığı tek tek dosyalarda tekrar etmek yerine, açık "web-features" veri kümesine karşı lint kuralları yazarak kod incelemesinde henüz Baseline olmayan özelliklerin kullanımını otomatik olarak yakalayabilir. Bu tür bir kural, bir geliştirici henüz "sınırlı kullanılabilirlik" aşamasındaki bir özelliği commit ettiğinde build sürecini uyarabilir veya tamamen durdurabilir; böylece karar tek bir kişinin hafızasına değil, otomatikleştirilmiş bir kontrole bağlı kalır. Benzer bir yaklaşımı `@layer` ile stil önceliklerini yönetirken de uygulayabilirsiniz; bu konuyu [CSS @layer: Büyük Stil Dosyalarını Evcilleştir](/tr/posts/css-cascade-layers-buyuk-stil) yazımızda ele aldık.

## Baseline mı, ham caniuse yüzdeleri mi daha güvenilir?

Açıkçası Baseline, ham kullanım yüzdelerinden daha güvenilir bir karar aracı; çünkü yüzdeler "şu an ne kadar insan destekliyor" sorusuna cevap verirken Baseline "bu özellik mühendislik açısından olgunlaştı mı" sorusuna cevap veriyor. Yüzde 90 destek bile, geri kalan yüzde 10'un hangi tarayıcılarda yoğunlaştığını söylemez; Baseline ise doğrudan "tüm çekirdek tarayıcılarda çalışıyor mu" sorusunu yanıtlar.

| Yaklaşım | Neyi ölçer | Risk |
|---|---|---|
| Baseline | Özelliğin tüm çekirdek tarayıcılarda desteklenip desteklenmediği | Düşük; net eşiklere dayanır |
| Ham caniuse yüzdesi | Küresel kullanıcı tabanının ne kadarının destekleyen bir tarayıcı kullandığı | Orta-yüksek; eski tarayıcı dağılımı pazara göre değişir |

Bu da Baseline'ı container query'ler gibi daha yeni CSS özelliklerini değerlendirirken ilk başvurulacak kaynak yapıyor; ayrıntılı kullanım için [CSS Container Queries Nasıl Kullanılır](/tr/posts/css-container-queries-kullanimi) yazımızı inceleyebilirsiniz.

## Baseline bilgisi nerede yayınlanıyor?

Baseline durumunu üç ana yerde takip edebilirsiniz: MDN'deki API referans sayfalarındaki rozetler, [web.dev/baseline](https://web.dev/baseline) sayfası ve makine tarafından okunabilen "web-features" veri kümesinin tarayıcısı olan web-platform-dx.github.io/web-features-explorer. web.dev ayrıca düzenli olarak yeni Baseline statüsü kazanan özellikleri özetleyen bir "Baseline digest" yayınlıyor; örneğin Haziran 2026'da yayınlanan bir digest bu türden bir derlemeydi.

Performans ve kullanıcı deneyimi açısından hangi özelliklerin üretime hazır olduğunu takip etmek, Core Web Vitals metriklerinizi de doğrudan etkiler; bu ilişkiyi [2026 İçin Core Web Vitals Kontrol Listesi](/tr/posts/core-web-vitals-kontrol-listesi) yazımızda daha geniş ele aldık. Popover ve anchor positioning gibi henüz olgunlaşmakta olan özellikler için de aynı Baseline mantığını [CSS Anchor Positioning: JS'siz Popover ve İpucu](/tr/posts/css-anchor-positioning-jssiz-popover) yazımızda uyguladık. Daha fazla pratik CSS içeriği için [web geliştirme kategorimize](/tr/category/web-gelistirme) de bakabilirsiniz.

Resmi tanımın kaynağına ulaşmak için MDN'in [Baseline/Compatibility sözlük sayfasını](https://developer.mozilla.org/en-US/docs/Glossary/Baseline/Compatibility) ve [Baseline proje sayfasını](https://web-platform-dx.github.io/baseline/) okumanızı öneririz.

## Sıkça Sorulan Sorular

### Baseline'ı kim yönetiyor?

Baseline, Web Features / WebDX topluluk grubu tarafından yönetiliyor ve Chrome, Firefox, Safari/WebKit, Edge gibi büyük tarayıcı üreticilerinin yanı sıra Interop projesinin desteğini alıyor. Bu, kararın tek bir şirkete değil, tarayıcı ekosisteminin ortak mutabakatına dayandığı anlamına gelir.

### Bir özellik "yeni kullanılabilir" olduğunda hemen kullanabilir miyim?

Evet, kullanabilirsiniz; ancak eski tarayıcı ve cihazlarda çalışmayacağını bilerek ilerlemeniz gerekir. "Yeni kullanılabilirlik" sadece güncel sürümlerin tamamında çalıştığını garanti eder, bu yüzden kritik akışlarda `@supports` ile özellik tespiti yapmak güvenli bir ek adımdır.

### :has() şu anda Baseline'da hangi seviyede?

`:has()`, Aralık 2023'te "yeni kullanılabilirlik" seviyesine ulaştı ve bir Baseline takip aracına göre 19 Haziran 2026'da "geniş kullanılabilirlik" seviyesine geçti. Bugün, Kasım 2026 itibarıyla bu özellik hem resmi ölçütlere hem de yaklaşık yüzde 94'lük gerçek kullanım oranına göre üretimde güvenle kullanılabilir durumda.

### Baseline ile caniuse yüzdeleri arasındaki fark nedir?

Baseline, bir özelliğin tüm çekirdek tarayıcı motorlarında desteklenip desteklenmediğine dayanan net bir eşik sistemidir; caniuse yüzdeleri ise küresel kullanıcı tabanının ne kadarının destekleyen bir tarayıcı kullandığını gösteren değişken bir istatistiktir. Üretim kararları için Baseline daha öngörülebilir bir temel sunar.
