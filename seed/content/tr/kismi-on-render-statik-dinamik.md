---
title: "Kısmi Ön Render: Statik ve Dinamik Tek Sayfada Nasıl Olur?"
slug: "kismi-on-render-statik-dinamik"
translationKey: "partial-prerendering-nextjs-2026"
locale: "tr"
excerpt: "Kısa cevap: Next.js 16'da varsayılan olan Partial Prerendering, statik kabuğu CDN'den anında sunar, dinamik kısımları aynı yanıtta Suspense ile akışla tamamlar."
category: "web-development"
tags: ["nextjs", "rendering", "web-performance", "server-components"]
publishedAt: "2026-10-05"
seoTitle: "Kısmi Ön Render: Statik ve Dinamik Nasıl Birleşir?"
seoDescription: "Kısa cevap: Next.js 16'da varsayılan olan Partial Prerendering, statik kabuğu CDN'den anında sunar, kişiselleştirilmiş kısımları Suspense ile akışla tamamlar."
---

Kısa cevap: Bir sayfanın baştan sona ya tamamen statik ya da tamamen dinamik olması gerekmiyor. Next.js 16 ile varsayılan render modeli haline gelen Partial Prerendering (PPR), sayfanın değişmeyen kabuğunu CDN'den anında gönderir; kişiye özel kısımları ise aynı HTTP yanıtı içinde, Suspense sınırlarının arkasından akışla (streaming) tamamlar. Sonuç, hem hızlı hem de kişiselleştirilmiş bir sayfa.

"Statik mi, dinamik mi?" sorusu yıllardır render stratejisi tartışmalarının merkezinde. Oysa 2026 itibarıyla gerçek sayfaların çoğu bu ikiliğe hiç uymuyor: büyük kısmı sabit, sadece sepet ikonu veya karşılama mesajı gibi küçük bir dilimi kişiye özel. PPR tam olarak bu sayfalar için tasarlandı.

## Partial Prerendering nedir?

Partial Prerendering, Next.js'in aynı sayfa içinde statik ve dinamik içeriği tek bir HTTP yanıtında birleştiren render modelidir. Next.js 16 (Ekim 2025'te yayınlandı) ile bu özellik deneysel etiketinden kurtuldu ve framework'ün varsayılan davranışı oldu.

Eskiden bu özelliği açmak için `next.config.js` içine `experimental.ppr` bayrağı eklemek gerekiyordu. Next.js 16'da bu bayrak tamamen kaldırıldı; yerine "Cache Components" adı verilen daha kapsamlı bir özelliğin parçası olarak `cacheComponents: true` ayarı geldi. Bu, PPR'nin artık deneysel bir oyuncak değil, üretim ortamlarında güvenle kullanılabilecek bir render modeli olduğu anlamına geliyor.

Mekanizma şöyle işliyor: sayfa isteği geldiğinde sunucu önce build zamanında üretilmiş statik kabuğu (header, navigasyon, ürün açıklaması gibi herkes için aynı olan kısımlar) CDN'in edge katmanından anında gönderir. Kullanıcıya veya oturuma bağlı parçalar — sepet ikonu, "Merhaba Ahmet" gibi bir karşılama, önerilen ürünler şeridi — ise Suspense sınırı içine alınır ve aynı yanıt tamamlanmadan origin sunucudan akışla gelir.

## Statik mi dinamik mi, yoksa ikisi birden mi?

Gerçek cevap: Çoğu üretim sayfası için bu soru zaten yanlış kurulmuş bir ikilik. Bir e-ticaret ürün sayfasının yüzde 90'ı (görseller, açıklama, fiyat, yorumlar) her kullanıcı için aynıdır; yalnızca sepet sayısı veya "senin için önerilenler" şeridi gibi küçük bir dilim kişiye özeldir.

Eski render modelleri bu sayfayı iki uçtan birine zorlardı. Statik site üretimi (SSG) seçilirse kişiselleştirme ya tamamen istemci tarafında JavaScript ile sonradan eklenir ya da hiç yapılamaz. Sunucu tarafı render (SSR) seçilirse sayfanın tamamı, sadece küçük bir dinamik parça yüzünden her istekte yeniden hesaplanır ve statik kısımların sağladığı hız avantajı kaybolur.

PPR bu zorlamayı ortadan kaldırıyor. Sayfa düzeyinde "statik mi dinamik mi" kararı vermek yerine, geliştirici hangi bileşenlerin gerçekten dinamik olduğunu işaretler; framework'ün kendisi kabuğu önceden üretir ve delikleri akışla doldurur. Benim görüşüm şu: bu ayrımın sayfa seviyesinde değil bileşen seviyesinde yapılması, son beş yılın en pratik render yeniliği — çünkü gerçek ürün sayfaları zaten bu şekilde parçalı.

## PPR nasıl çalışır? Suspense ve statik kabuk

Suspense sınırı, bir React bileşenini, verisi yüklenene kadar yerine geçici bir içerik (fallback) gösterecek şekilde sarmalayan bir mekanizmadır. PPR bu mekanizmayı render zamanında şu şekilde kullanır: derleme (build) sırasında, Suspense ile sarmalanmamış her şey statik kabuk olarak önceden üretilir. Suspense ile sarmalanan bileşenler ise "delik" olarak işaretlenir ve gerçek içerikleri yalnızca istek anında, origin sunucuda hesaplanır.

Kullanıcı sayfayı açtığında tarayıcı tek bir HTTP yanıtı alır: bu yanıt statik kabukla başlar ve dinamik deliklerin içeriği hazır olur olmaz aynı bağlantı üzerinden akışla eklenir. Kullanıcı kabuğu anında görür ve sayfayla etkileşime geçebilir; kişiselleştirilmiş parçalar arka planda doluyor olsa bile.

Minimal bir örnek şöyle görünür:

```tsx
import { Suspense } from "react";
import { CartBadge } from "./cart-badge";
import { ProductInfo } from "./product-info";

export default function ProductPage() {
  return (
    <main>
      {/* Statik kabuk: build zamanında üretilir */}
      <ProductInfo />

      {/* Dinamik delik: istek anında origin'den akışla gelir */}
      <Suspense fallback={<CartBadgeSkeleton />}>
        <CartBadge />
      </Suspense>
    </main>
  );
}
```

Bu davranışı açmak için `next.config.ts` içinde tek satır yeterli:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
};

export default nextConfig;
```

## PPR ne zaman işe yarar, ne zaman yaramaz?

Kısa cevap: PPR, sayfanın büyük kısmı statik ve dinamik yüzey sınırlıysa güçlü bir kazanç sağlar; sayfanın çoğu zaten kişiselleştirilmişse statik kabuktan alınacak fayda da sınırlı kalır. Bir haber sitesinin makale sayfası, bir ürün detay sayfası veya bir dokümantasyon sitesi — hepsi bu profile uyar: sabit içerik büyük, dinamik slot küçük.

Buna karşın tamamen kişiye özel bir akış sayfası (örneğin bir sosyal medya ana akışı veya kullanıcıya özgü bir analiz panosu) PPR'den az fayda görür, çünkü statik olarak önceden üretilebilecek kısım zaten çok azdır. Bu durumlarda ekiplerin PPR'ye geçmeden önce sayfanın hangi bölümlerinin gerçekten statik olduğunu profillemesi gerekir; aksi halde kurulum karmaşıklığı eklenir ama ölçülebilir bir kazanç gelmez.

Üç render modelini karşılaştırmak faydalı:

| Ölçüt | Tamamen Statik | Tamamen Dinamik | PPR |
|---|---|---|---|
| TTFB (ilk bayta kadar geçen süre) | Çok düşük | Yüksek (her istekte yeniden hesaplama) | Düşük (kabuk anında, delikler akışla) |
| Kişiselleştirme | Yok veya yalnızca istemci tarafında | Tam destek | Sınırlı yüzeyde tam destek |
| Cache hit rate | Çok yüksek | Düşük veya sıfır | Kabuk için yüksek, delikler için düşük |
| Altyapı maliyeti | Düşük | Yüksek (origin her isteği işler) | Orta (origin yalnızca delikleri işler) |

## Next.js 16'da PPR'nin durumu nedir?

Kısa cevap: PPR, Next.js 16 ile (Ekim 2025) deneysel durumdan çıktı ve "Cache Components" özelliğinin bir parçası olarak varsayılan render davranışı oldu. `experimental.ppr` bayrağı kod tabanından tamamen kaldırıldı; artık tek gereken `next.config.ts` içinde `cacheComponents: true` ayarını yapmak.

Bu geçiş, 2026 itibarıyla PPR'nin "ilginç bir deney" statüsünden "varsayılan tercih" statüsüne taşındığını gösteriyor — tabii dinamik yüzeyin sınırlı olduğu sitelerde. Sayfanın tamamı kişiye özelse PPR hâlâ devreye girebilir ama kazanç küçülür; framework bunu zorlamıyor, yalnızca mümkün kılıyor.

## Cache ve TTFB üzerindeki etkisi nedir?

Kısa cevap: TTFB, yani tarayıcının sunucudan ilk baytı aldığı süre, PPR'de statik kabuk sayesinde CDN cache'inden gelir ve neredeyse sıfıra yakın kalır; yalnızca dinamik delikler origin gecikmesine tabidir ve bu gecikme artık sayfanın tamamını bloklamadan akışla sunulur.

Bu, cache stratejisini de değiştiriyor: statik kabuk klasik CDN cache kurallarıyla (edge'de uzun süre saklama, build'de geçersiz kılma) yönetilirken, dinamik delikler kendi cache veya revalidate kurallarına sahip olabilir. Kabuğun ne zaman ve nasıl geçersiz kılınacağı konusunda [cache stratejileri ve geçersiz kılma](/tr/posts/cache-stratejileri-gecersiz-kilma) yazımızda daha ayrıntılı bir çerçeve var.

Statik site üreticileriyle PPR'nin nerede ayrıştığını görmek isteyenler [Astro mu Next.js mi?](/tr/posts/astro-mu-nextjs-mi) karşılaştırmasına bakabilir; Astro'nun ada mimarisi de benzer bir "gerekeni dinamik bırak, gerisini statik üret" mantığına dayanıyor. Suspense sınırlarının akış arayüzlerinde pratikte nasıl kullanıldığını görmek için [Vercel AI SDK ile akışlı sohbet arayüzü](/tr/posts/vercel-ai-sdk-akisli-sohbet-arayuzu) yazısı iyi bir referans. Origin sunucudaki runtime seçiminin genel performans tablosunu etkilediğini düşünenler [Bun mu Node.js mi?](/tr/posts/bun-mu-nodejs-mi-2026-runtime) karşılaştırmasını da okuyabilir.

Teknik detaylar için [Next.js'in PPR dokümantasyonu](https://nextjs.org/docs/app/building-your-application/rendering/partial-prerendering) ve [Next.js 16 duyuru notları](https://nextjs.org/blog) birincil kaynaklar.

## Sıkça Sorulan Sorular

### Partial Prerendering hangi Next.js sürümünde stabil oldu?

Partial Prerendering, Next.js 16 ile stabil hale geldi ve bu sürüm Ekim 2025'te yayınlandı. Artık `experimental.ppr` bayrağına ihtiyaç yok; "Cache Components" özelliğinin parçası olarak `next.config.ts` içinde `cacheComponents: true` ayarıyla açılıyor ve framework'ün varsayılan render modelini oluşturuyor.

### PPR ile SSR arasındaki fark nedir?

Fark şu: SSR'de sayfanın tamamı her istekte sunucuda yeniden hesaplanır, dinamik içerik sayfanın küçük bir parçası olsa bile. PPR'de ise sadece Suspense ile işaretlenmiş dinamik parçalar istek anında hesaplanır; statik kabuk build zamanında üretilip CDN'den anında sunulur.

### Her sayfa için PPR kullanmak gerekir mi?

Hayır. PPR, sayfanın büyük kısmı statik ve dinamik yüzey birkaç slotla sınırlıysa anlamlı bir kazanç sağlar. Sayfanın tamamı zaten kişiye özelse (örneğin bir kullanıcı paneli) statik kabuktan elde edilecek fayda azalır; bu durumda sayfayı profillemeden PPR'ye geçmek gereksiz karmaşıklık ekler.

### Suspense sınırı olmadan PPR çalışır mı?

Hayır, çalışmaz. PPR'nin statik kabuk ile dinamik delikleri ayırabilmesi için hangi bileşenlerin dinamik olduğunu bilmesi gerekir; bu işaretleme React'in Suspense sınırı ile yapılır. Suspense ile sarmalanmayan her şey otomatik olarak statik kabuğun parçası sayılır.
