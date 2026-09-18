---
title: "Next.js Partial Prerendering'i Ne Zaman Kullan"
slug: "nextjs-partial-prerendering-kullanim"
translationKey: "nextjs-partial-prerendering-2026"
locale: "tr"
excerpt: "Kısa cevap: Sayfanın statik kısmı anında yüklensin, kişiye özel kısmı sonradan aksın istiyorsan PPR kullan; Next.js 16'dan beri Cache Components ile stabil."
category: "web-development"
tags: ["nextjs", "rendering", "performance", "web-performance"]
publishedAt: "2026-09-18"
seoTitle: "Next.js Partial Prerendering: Ne Zaman Kullanılır?"
seoDescription: "Kısa cevap: Sayfanın statik kısmı anında yüklensin, kişiye özel kısmı sonradan aksın istiyorsan PPR kullan; Next.js 16'dan beri Cache Components ile stabil."
---

Kısa cevap: Bir sayfanın büyük kısmı herkes için aynıysa ama küçük bir bölümü kullanıcıya özel veri gerektiriyorsa Partial Prerendering (PPR) kullanın — statik kabuk anında sunucudan gelir, dinamik bölüm Suspense ile arkadan akar. Next.js 16'dan (Ekim 2025) beri PPR, deneysel `experimental.ppr` bayrağından çıkıp Cache Components adlı opt-in modelin varsayılan davranışı hâline geldi.

## Next.js Partial Prerendering nedir, hangi sorunu çözer?

PPR, tek bir route içinde statik ve dinamik render'ı aynı anda kullanmanızı sağlayan bir tekniktir: build sırasında Next.js, route için bir statik HTML kabuğu ve bir "postponedState" verisi üretir; istek anında bu kabuk anında sunulur, dinamik parçalar ise sunucuda render edilip akış (streaming) hâlinde kabuğa eklenir. Çözdüğü problem şu: bir e-ticaret ürün sayfasında ürün açıklaması ve görseller statikken, stok durumu veya kullanıcıya özel fiyat teklifi dinamikse, tüm sayfayı SSR'a çevirmeden ikisini bir arada sunabilirsiniz.

Bunu PPR olmadan yapmanın klasik yolu ya tüm sayfayı dinamik render etmek (statik kısmın hızından vazgeçmek) ya da istemci tarafında ayrı bir fetch ile dinamik kısmı sonradan doldurmaktı (ekstra round-trip ve layout kayması riski). PPR bu ödünleşimi ortadan kaldırıyor.

## PPR 2026'da stabil mi, hâlâ deneysel mi?

Stabil. Next.js 16 ile PPR, Cache Components adlı opt-in modelin bir parçası olarak App Router'ın varsayılan davranışına dönüştü ve `experimental.ppr` config bayrağı ile route segmentindeki `experimental_ppr` ayarı artık gerekli değil, ikisi de kaldırıldı. Bunun pratik anlamı: Next.js 16 veya sonrasını kullanan bir projede PPR'ı etkinleştirmek için deneysel bir bayrak açmanıza gerek yok; `cacheComponents` modelini benimseyip Suspense sınırlarını doğru yerleştirmeniz yeterli.

Next.js 15 ve öncesinde PPR hâlâ deneyseldi ve `next.config.js` içinde `experimental: { ppr: 'incremental' }` gibi bir bayrak gerektiriyordu — o sürümlerde üretime almadan önce sınırlı bir route setinde test etmek öneriliyordu.

## Statik kabuk + Suspense akışı nasıl çalışır?

Bir route segmentinde PPR'ı kullanmak için dinamik veri okuyan bileşeni bir `Suspense` sınırıyla sarmanız yeterli; Next.js, geri kalan her şeyi build zamanında statik kabuğa gömer ve Suspense içindeki kısmı istek anında akıtır.

```tsx
// app/urun/[id]/page.tsx
import { Suspense } from 'react'

export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <div>
      {/* Statik kabuk: build zamanında önceden render edilir */}
      <ProductHeader id={params.id} />
      <ProductDescription id={params.id} />

      {/* Dinamik delik: istek anında akar */}
      <Suspense fallback={<StockSkeleton />}>
        <LiveStockAndPrice id={params.id} />
      </Suspense>
    </div>
  )
}
```

`LiveStockAndPrice` içinde `cookies()`, `headers()` gibi istek zamanına özgü API'ler çağrıldığında Next.js o bileşeni otomatik olarak dinamik kabul eder ve statik kabuğun dışına alır; siz ayrıca bir bayrak işaretlemek zorunda değilsiniz.

## PPR mı, Cache Components mi? Fark ne?

PPR, route segmenti seviyesinde çalışan bir render stratejisiyken, Cache Components bunu Dynamic IO ve `use cache` direktifiyle birleştirip bileşen sınırında (route'un altında) çalışan daha ince taneli bir model sunuyor. Next.js 16'da `dynamicIO` bayrağının adı `cacheComponents` olarak değiştirildi ve PPR artık bu birleşik modelin bir parçası olarak çalışıyor.

Pratik fark şu: PPR "bu route'un şu segmenti dinamik" derken, Cache Components "bu tekil fonksiyon çağrısı önbelleğe alınabilir" diyor — `use cache` ile işaretlenen bir fonksiyon veya bileşen, route segmentinden bağımsız olarak önbelleklenebiliyor. Yeni bir proje başlatıyorsanız doğrudan Cache Components modeliyle düşünmek, ileride geriye dönük taşıma yapmaktan daha az sürtünmeli.

## Önbellekleme ve yeniden doğrulama nasıl etkileniyor?

Statik kabuk, normal statik sayfalar gibi CDN'de önbelleklenir ve `revalidate` ayarlarınıza göre yeniden doğrulanır; dinamik delik ise her istekte taze veri getirir, bu yüzden onun için ayrı bir cache stratejisi (ör. `use cache` ile kısa TTL) düşünmeniz gerekir. Statik kabuğu güncellemek istediğinizde ISR'daki gibi bir revalidate tetikleyicisine ihtiyacınız var; dinamik delik zaten her istekte yeniden hesaplandığı için onun "bayatlaması" söz konusu değil.

Burada sık yapılan bir hata, dinamik deliğin içine gereğinden fazla bileşen koymak. Suspense sınırını olabildiğince dar tutup sadece gerçekten kişiye özel veriyi (stok, fiyat, oturum durumu) içine almak, statik kabuğun kapsadığı alanı maksimize eder — sınırı sayfanın yarısını kapsayacak şekilde genişletirseniz PPR'ın build-zamanı avantajının çoğunu kaybedersiniz, çünkü Next.js o genişletilmiş alanı da istek anında render etmek zorunda kalır.

## Deploy platformu PPR'ı destekliyor mu?

Kısa cevap: Vercel'de sorunsuz çalışıyor çünkü platform statik kabuk ile akan dinamik içeriği aynı yanıtta birleştirecek şekilde tasarlanmış; kendi Node.js sunucunuzda veya farklı bir host'ta self-host ederken streaming ve `postponedState` desteğinin doğru yapılandırıldığından emin olmanız gerekiyor. Next.js'in resmi PPR platform rehberi, Vercel dışı ortamlar için hangi ek yapılandırmanın gerektiğini ayrı ayrı listeliyor.

## Ne zaman ISR veya tam SSR hâlâ daha iyi bir seçim?

Sayfanın tamamı kullanıcıya özelse (ör. bir dashboard'un tamamı oturuma bağlıysa) PPR'ın statik kabuk avantajından zaten faydalanamazsınız — böyle durumlarda tam SSR daha basit bir mimari verir. Sayfa tamamen herkese aynıysa ve nadiren değişiyorsa (ör. bir blog yazısı) PPR'ın karmaşıklığına gerek yok, düz ISR yeterli ve daha az taşınacak parça anlamına geliyor.

PPR'ın asıl değeri, sayfanın büyük kısmı statik kalırken küçük, gerçekten kullanıcıya özel bir dilim olduğu ara durumda ortaya çıkıyor — tipik örnekler ürün sayfaları, kişiselleştirilmiş öneri şeritleri ve oturuma bağlı bildirim rozetleri.

| Strateji | Kabuk hızı | Kişiselleştirme | Karmaşıklık |
|---|---|---|---|
| Tam SSR | Yavaş (her istek sunucuda render) | Tam destekli | Düşük |
| SSG/ISR | Çok hızlı (statik + periyodik yenileme) | Yok/sınırlı | Düşük |
| PPR | Anında (statik kabuk) + akan dinamik delik | Delikte tam destekli | Orta |

## Sıkça Sorulan Sorular

### Next.js Partial Prerendering ne zaman stabil hâle geldi?

Next.js 16 ile, Ekim 2025'te; PPR bu sürümden itibaren Cache Components adlı opt-in modelin varsayılan davranışı oldu ve deneysel `experimental.ppr` bayrağı kaldırıldı.

### PPR ile ISR aynı şey mi?

Hayır. ISR tüm sayfayı belirli aralıklarla yeniden statikleştirirken PPR aynı sayfa içinde statik bir kabukla gerçek zamanlı akan bir dinamik bölümü birleştiriyor; PPR'da dinamik kısım her istekte taze, ISR'da tüm sayfa periyodik olarak yenileniyor. İkisini aynı projede birlikte de kullanabilirsiniz: statik kabuğu ISR ile belirli aralıklarla yenilerken, kabuğun içindeki dinamik deliği PPR'ın Suspense akışına bırakmak yaygın bir örüntü. Render stratejilerinin tam karşılaştırması için [SSR, SSG ve ISR farkını anlatan yazımıza](/tr/posts/ssr-ssg-isr-farki) bakabilirsiniz.

### PPR kullanmak için hangi Next.js sürümü gerekiyor?

Next.js 16 veya üzeri önerilir çünkü PPR bu sürümde stabil ve `experimental.ppr` bayrağı gerektirmiyor; Next.js 15 ve öncesinde hâlâ deneysel bir bayrakla çalışıyor ve üretime almadan önce sınırlı test öneriliyor. Eski bir Next.js 14 projesini yükseltiyorsanız önce Next.js 15'e geçip PPR'ı incremental modda birkaç route'ta deneyip, sonra Next.js 16'ya atlayarak Cache Components modeline geçmek daha az riskli bir yol.

### PPR'ı Edge Functions ile birlikte kullanabilir miyim?

Evet, statik kabuk CDN'den sunulurken dinamik delik Edge veya Node.js runtime'ında çalışabilir; edge render seçenekleri hakkında daha fazlası için [Edge Fonksiyonları ve Render rehberimize](/tr/posts/edge-fonksiyonlari-render-rehberi) göz atabilirsiniz.

Next.js ekosistemindeki diğer render kararları için [React Server Components rehberimizi](/tr/posts/nextjs-react-server-components) ve daha geniş bir çerçeve karşılaştırması için [Astro mu Next.js mi yazımızı](/tr/posts/astro-mu-nextjs-mi) inceleyebilirsiniz. Daha fazla web geliştirme içeriği için [Web Geliştirme kategorimize](/tr/category/web-gelistirme) bakın.

Kaynaklar: [Next.js resmi PPR dokümantasyonu](https://nextjs.org/docs/app/guides/ppr-platform-guide) ve [Next.js Cache Components dokümantasyonu](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents).
