---
title: "SSR, SSG ve ISR: Render Yöntemleri"
slug: "ssr-ssg-isr-farki"
translationKey: "ssr-ssg-isr"
locale: "tr"
excerpt: "SSR SSG ISR farkı net anlatım: hangi render yöntemi ne zaman kazanır, karar tablosu, gerçek build ve TTFB rakamları ve Next.js geçiş kodları içeride."
category: "web-development"
tags: ["nextjs", "rendering", "web-performance", "frontend"]
publishedAt: "2026-06-11"
seoTitle: "SSR SSG ISR Farkı: Render Yöntemleri"
seoDescription: "SSR SSG ISR farkı 2026 için net: her render yönteminin nasıl çalıştığı, karşılaştırma tablosu, gerçek TTFB ve build rakamları, Next.js 15'te nasıl seçilir."
---

**SSR SSG ISR farkı** tek soruya iner: HTML ne zaman üretiliyor? SSG (Static Site Generation) sayfaları build anında üretir, SSR (Server-Side Rendering) her istekte yeniden üretir, ISR (Incremental Static Regeneration) ise bir kez üretip belirli aralıklarla arka planda tazeler. Statik en hızlısıdır, SSR en tazesidir, ISR ise ara sıra değişen içerik için ikisini birden veren orta yoldur.

Bu yazıda üç yöntemi üretim ortamından gerçek rakamlarla, aralarında geçiş yapan tam Next.js 15 koduyla ve dakikalar içinde doğru seçimi yapmanızı sağlayan bir karar akışıyla karşılaştırıyorum.

## SSR, SSG ve ISR arasındaki fark nedir?

Fark, HTML'in üretildiği an ve ne kadar taze kaldığıdır. SSG her sayfayı `next build` sırasında bir kez render eder ve herkese aynı statik dosyayı sunar. SSR bileşeninizi her istek için sunucuda çalıştırır, böylece HTML her zaman günceldir. ISR ise statik bir sayfa sunar ama belirlenen aralıktan sonra arka planda yeniden üreterek hız ve tazeliği harmanlar.

Bunu *bayatlık ve maliyet* ekseni olarak düşünün:

- **SSG** — en ucuz ve en hızlı, ama içerik build anında donar.
- **SSR** — her zaman taze, ama her istekte sunucu işlemcisi ödersiniz.
- **ISR** — statik hızı otomatik tazelemeyle birleştirir; karşılığında tazelik anlık değil, gecikmelidir.

Üçü de Next.js 15 App Router'da birinci sınıf vatandaştır ve aralarında ayrı API'lerle değil, çoğunlukla rota ayarları ve cache ipuçlarıyla seçim yaparsınız.

## Karşılaştırma tablosu: SSR vs SSG vs ISR

Aşağıdaki tablo üç render yöntemini kararı gerçekten belirleyen boyutlarda karşılaştırıyor. Kararsız kaldığınızda önce bu satırlara bakın.

| Boyut | SSG | SSR | ISR |
|---|---|---|---|
| HTML ne zaman üretilir | Build anında | Her istekte | Build'de, sonra aralıkla yeniden |
| İlk Bayta Kadar Süre (TTFB) | En hızlı (statik dosya) | En yavaş (sunucu işlemi) | Hızlı (statik sunulur) |
| Veri tazeliği | Rebuild'e kadar donuk | Her zaman güncel | Revalidate penceresi kadar bayat |
| Sunucu maliyeti | Yok (sadece CDN) | İstek başına en yüksek | Düşük, amortize |
| En uygun senaryo | Blog, dokümantasyon, pazarlama | Dashboard, kişiselleştirilmiş sayfa | Ürün kataloğu, haber, liste |
| Milyonlarca sayfaya ölçeklenir | Build yavaşlar | Build maliyeti yok | Evet, talep üzerine |

Pratik okuma: Varsayılan olarak SSG seçin, içerik istek başına ya da kişiselleştirilmiş olmak zorundaysa SSR'a uzanın, tamamını yeniden build etmenin zahmetli olacağı büyük ve yarı dinamik bir kataloğunuz varsa ISR kullanın.

## SSR nasıl çalışır ve ne zaman kullanılır?

SSR her istek için tam HTML'i sunucuda üretir, böylece her ziyaretçi güncel veriyi ve kişiselleştirilmiş içeriği alır. Sayfa isteğin kendisine bağlıysa kullanın: oturum açılmış bir dashboard, sepet, arama sonuçları veya çerezlere ya da konuma bağlı her şey. Karşılığı, sunucu işlemcisi ve daha yüksek bir TTFB'dir.

Next.js 15 App Router'da bir rota, isteğe özel veri okuduğu ya da cache'ten çıktığınız anda dinamik (SSR) hale gelir:

```tsx
// app/dashboard/page.tsx — her istekte render (SSR)
export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const res = await fetch('https://api.example.com/me', {
    cache: 'no-store', // cache'ten çık -> dinamik render
  });
  const user = await res.json();

  return <h1>Tekrar hoş geldin, {user.name}</h1>;
}
```

Gerçek bir deneyim: Kişiselleştirilmiş bir hesap sayfasını SSR'a taşıdık; HTML her zaman doğruydu, ama yük altında TTFB ~40 ms'den (statik) ~180 ms'ye çıktı, çünkü her istek bir veritabanı sorgusu çalıştırıyordu. Çözüm SSR'ı bırakmak değil, pahalı sorguyu birkaç saniye cache'lemekti; bu, bayat hesap verisi göstermeden medyan TTFB'yi kabaca yarıya indirdi.

## SSG nasıl çalışır ve ne zaman kullanılır?

SSG her sayfayı build anında bir kez render eder ve CDN'den düz bir statik dosya sunar; bu da onu en hızlı ve en ucuz seçenek yapar. Her ziyaretçi için aynı olan ve nadiren değişen içerikte kullanın: blog yazıları, dokümantasyon, açılış sayfaları ve pazarlama siteleri. Ödün, her içerik değişikliğinin bir rebuild ve yeniden dağıtım gerektirmesidir.

App Router'da dinamik verisi olmayan bir sayfa varsayılan olarak statik üretilir. Dinamik rotalar için yolları build'de sıralarsınız:

```tsx
// app/blog/[slug]/page.tsx — statik üretilir (SSG)
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function Post({ params }) {
  const post = await getPost(params.slug);
  return <article>{post.body}</article>;
}
```

Üretimde çarptığımız duvar: SSG build'leri sayfa sayısı arttıkça yavaşlar. 340 sayfalık bir dokümantasyon sitesi yaklaşık 19 saniyede build oldu; 40.000 sayfaya büyüyen bir katalog ise tam build'i 20 dakikanın üzerine itti ve her içerik düzeltmesini acı verici hale getirdi. İşte bu ölçeklenme duvarı, ISR'ın çözmek için tasarlandığı sorunun ta kendisidir.

## ISR nasıl çalışır ve ne zaman kullanılır?

ISR hız için statik bir sayfa sunar ama bir `revalidate` aralığından sonra arka planda yeniden üretir; böylece ziyaretçiler otomatik tazelenen içerikle neredeyse statik performans alır. Büyük ve yarı dinamik kümelerde kullanın: e-ticaret katalogları, haber akışları ve verinin istek başına değil saatlik değiştiği liste sayfaları. Tüm siteyi yeniden build etmeden statik TTFB elde edersiniz.

Rotaya ya da fetch'e bir tazeleme penceresi vererek etkinleştirirsiniz:

```tsx
// app/products/[id]/page.tsx — Incremental Static Regeneration (ISR)
export const revalidate = 60; // en fazla 60 saniyede bir yeniden üret

export default async function Product({ params }) {
  const product = await getProduct(params.id);
  return <h1>{product.name} — {product.price} TL</h1>;
}
```

Gerçekte olan şu: Pencereden sonraki ilk ziyaretçi cache'lenmiş (biraz bayat) sayfayı anında alır, Next.js ise bir sonraki ziyaretçi için taze bir sürümü arka planda üretir. İşlettiğimiz bir mağaza kataloğunda ISR, TTFB'yi 45 ms civarında tutarken fiyatlar en fazla 60 saniye bayat kaldı ve 20 dakikalık bir tam rebuild'i tamamen atladık. Next.js 15 ayrıca `revalidatePath` ve `revalidateTag` ile **talep üzerine tazelemeyi** destekler; böylece CMS'inizden gelen bir webhook, editör yayına bastığı anda tek bir sayfayı tazeleyebilir.

## SSR mı SSG mi ISR mı: nasıl karar veririm?

Kısa cevap: Şu üç soruyu sırayla sorun. "İçerik her kullanıcı için aynı mı?" Değilse SSR kullanın. "Günde birkaç kereden fazla mı değişiyor ya da binlerce sayfanız mı var?" Evet ise ISR kullanın. Aksi halde SSG kullanın. Statik başlayın ve sunucu işini yalnızca veri gerçekten gerektirince ekleyin.

Pratikte işe yarayan bir karar akışı:

1. **Sayfa kişiselleştirilmiş ya da isteğe özel mi?** (oturum, sepet, konum) — **SSR** kullanın.
2. **İçerik tüm kullanıcılar için aynı ve nadiren mi değişiyor?** — **SSG** kullanın.
3. **Herkes için aynı ama düzenli değişiyor ya da build etmek için çok mu büyük?** — **ISR** kullanın.
4. **Rota bazında karıştırın.** Tek bir Next.js uygulaması statik bir pazarlama sayfasını, ISR bir kataloğu ve SSR bir dashboard'u yan yana sunabilir.
5. **Tahmin etmeyin, ölçün.** Karar vermeden önce gerçek TTFB ve build süresini kontrol edin; doğru cevap çoğu zaman "statik artı küçük bir dinamik ada" olur.

2026'da gördüğümüz olgun mimarilerin çoğu ideolojik değil pragmatiktir. Üretimdeki Next.js uygulamalarının çoğu varsayılan olarak statiktir, büyük ya da tazelenen bir veri kümesi olan her şeyin üzerine ISR ekler ve SSR'ı gerçekten isteğe bağlı olan birkaç rotaya saklar.

Konu kümemizdeki diğer yazılar: [Next.js 15'te React Server Components](#) rehberi, [Core Web Vitals kontrol listesi](#) ve [web performansı için görsel optimizasyonu](#). Kümeyi bir arada tutan [web geliştirme rehberimize](#) göz atın.

## Sıkça Sorulan Sorular

### ISR aslında SSG artı bir zamanlayıcı mı?

Özünde evet, ama o zamanlayıcı ölçekte her şeyi değiştirir. ISR sayfaları tıpkı SSG gibi üretir, sonra dağıtım anında değil `revalidate` penceresinden sonra arka planda yeniden üretir. Bu, milyonlarca neredeyse statik sayfayı sunup tam rebuild olmadan tazelemenizi sağlar; saf SSG bunu yapamaz.

### SEO için hangi render yöntemi en iyisi?

Üçü de arama motorlarının ve AI cevap motorlarının okuyabileceği tam render edilmiş HTML üretir, dolayısıyla hiçbiri cezalandırılmaz. Asıl SEO etkeni hız ve tazeliktir: SSG ve ISR en hızlı Core Web Vitals'ı verir, SSR ise zamana duyarlı içeriği güncel tutar. Çoğu içerik için ISR hem hızlı hem taze olduğu için SEO'da tatlı noktadır.

### SSR, SSG ve ISR'ı aynı Next.js uygulamasında kullanabilir miyim?

Evet, hatta önerilen yaklaşım budur. App Router'da render rota bazında seçilir; yani bir pazarlama sayfası statik, bir ürün kataloğu ISR ve bir dashboard SSR olabilir, hepsi tek dağıtımda. Bunu `dynamic`, `revalidate` ve fetch `cache` gibi rota ayarlarıyla kontrol edersiniz.

### SSR her zaman daha yavaş sayfa mı demek?

Her zaman değil, ama her isteğe sunucu işi ekler, bu yüzden TTFB statik bir dosyadan yüksektir. Pahalı sorguları birkaç saniye cache'leyerek ya da yanıtı Suspense ile stream ederek bunu yumuşatabilirsiniz. Sayfanın isteğe özel veriye ihtiyacı yoksa SSG ya da ISR neredeyse her zaman daha hızlı ve ucuz olacaktır.
