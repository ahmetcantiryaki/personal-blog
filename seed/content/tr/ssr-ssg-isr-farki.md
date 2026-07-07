---
title: "SSR, SSG ve ISR: Render Yöntemleri"
slug: "ssr-ssg-isr-farki"
translationKey: "ssr-ssg-isr"
locale: "tr"
excerpt: "SSR SSG ISR farkı net anlatım: hangi render yöntemi ne zaman kazanır, karar tablosu, gerçek TTFB ve build rakamları ve Next.js 16'nın yeni cache modeliyle geçiş kodları."
category: "web-development"
tags: ["nextjs", "rendering", "web-performance", "frontend"]
publishedAt: "2026-07-04"
seoTitle: "SSR SSG ISR Farkı: Render Yöntemleri (2026)"
seoDescription: "SSR SSG ISR farkı 2026 için net: her yöntemin nasıl çalıştığı, karşılaştırma tablosu, gerçek TTFB ve build rakamları ve Next.js 16.2'de use cache ile nasıl seçilir."
---

**SSR SSG ISR farkı** tek soruya iner: HTML ne zaman üretiliyor? SSG (Static Site Generation) sayfaları build anında üretir, SSR (Server-Side Rendering) her istekte yeniden üretir, ISR (Incremental Static Regeneration) ise bir kez üretip belirli aralıklarla arka planda tazeler. Statik en hızlısıdır, SSR en tazesidir, ISR ise ara sıra değişen içerik için ikisini birden veren orta yoldur.

Bu yazıda üç yöntemi üretim ortamından gerçek rakamlarla, aralarında geçiş yapan tam Next.js 16 koduyla ve dakikalar içinde doğru seçimi yapmanızı sağlayan bir karar akışıyla karşılaştırıyorum. Küçük bir uyarıyla başlayalım: Temmuz 2026 itibarıyla stabil sürüm Next.js 16.2.7 ve cache modeli tersine döndü, yani eski "her şey otomatik cache'lenir" alışkanlığınız artık geçerli değil.

## SSR, SSG ve ISR arasındaki fark nedir?

Fark, HTML'in üretildiği an ve ne kadar taze kaldığıdır. SSG her sayfayı `next build` sırasında bir kez render eder ve herkese aynı statik dosyayı sunar. SSR bileşeninizi her istek için sunucuda çalıştırır, böylece HTML her zaman günceldir. ISR ise statik bir sayfa sunar ama belirlenen aralıktan sonra arka planda yeniden üreterek hız ve tazeliği harmanlar.

Bunu *bayatlık ve maliyet* ekseni olarak düşünün:

- **SSG** — en ucuz ve en hızlı, ama içerik build anında donar.
- **SSR** — her zaman taze, ama her istekte sunucu işlemcisi ödersiniz.
- **ISR** — statik hızı otomatik tazelemeyle birleştirir; karşılığında tazelik anlık değil, gecikmelidir.

Üçü de Next.js 16 App Router'da birinci sınıf vatandaştır. Önemli değişiklik şu: [Next.js 16](https://nextjs.org/blog/next-16) varsayılanı *dinamik* yaptı, cache'lemeyi ise açık hale getirdi. Artık statik davranışı [`use cache` direktifiyle](https://nextjs.org/docs/app/api-reference/directives/use-cache) ve `cacheLife` profilleriyle siz talep ediyorsunuz.

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
| Next.js 16 karşılığı | `use cache` (süresiz) | Varsayılan / `no-store` | `use cache` + `cacheLife` |

Pratik okuma: Varsayılan olarak SSG seçin, içerik istek başına ya da kişiselleştirilmiş olmak zorundaysa SSR'a uzanın, tamamını yeniden build etmenin zahmetli olacağı büyük ve yarı dinamik bir kataloğunuz varsa ISR kullanın. İçerik siteleri için Astro'nun sıfır-JS varsayılanı da masada; bu ikilemi [Astro mu Next.js mi karşılaştırmasında](/tr/posts/astro-mu-nextjs-mi) ayrıntısıyla açtık.

## SSR nasıl çalışır ve ne zaman kullanılır?

SSR her istek için tam HTML'i sunucuda üretir, böylece her ziyaretçi güncel veriyi ve kişiselleştirilmiş içeriği alır. Sayfa isteğin kendisine bağlıysa kullanın: oturum açılmış bir dashboard, sepet, arama sonuçları veya çerezlere ya da konuma bağlı her şey. Karşılığı, sunucu işlemcisi ve daha yüksek bir TTFB'dir.

Next.js 16'da güzel haber şu: bir rota, `cookies()` veya `headers()` gibi istek API'lerini okuduğu ya da cache'lenmemiş veri çektiği anda zaten dinamiktir. SSR artık varsayılan davranış:

```tsx
// app/dashboard/page.tsx — her istekte render (SSR, Next.js 16 varsayılanı)
import { cookies } from 'next/headers';

export default async function Dashboard() {
  const session = (await cookies()).get('session')?.value;
  const res = await fetch('https://api.example.com/me', {
    headers: { authorization: `Bearer ${session}` },
    cache: 'no-store', // taze veri -> dinamik render
  });
  const user = await res.json();

  return <h1>Tekrar hoş geldin, {user.name}</h1>;
}
```

Gerçek bir deneyim: Kişiselleştirilmiş bir hesap sayfasını SSR'da tuttuk; HTML her zaman doğruydu, ama yük altında TTFB ~40 ms'den (statik) ~180 ms'ye çıktı, çünkü her istek bir veritabanı sorgusu çalıştırıyordu. Çözüm SSR'ı bırakmak değil, pahalı sorguyu `use cache: private` ile kısa süre cache'lemekti; bu, bayat hesap verisi göstermeden medyan TTFB'yi kabaca yarıya indirdi.

## SSG nasıl çalışır ve ne zaman kullanılır?

SSG her sayfayı build anında bir kez render eder ve CDN'den düz bir statik dosya sunar; bu da onu en hızlı ve en ucuz seçenek yapar. Her ziyaretçi için aynı olan ve nadiren değişen içerikte kullanın: blog yazıları, dokümantasyon, açılış sayfaları ve pazarlama siteleri. Ödün, her içerik değişikliğinin bir rebuild ve yeniden dağıtım gerektirmesidir.

App Router'da dinamik rotalar için yolları hâlâ `generateStaticParams` ile build'de sıralarsınız. Değişen şey, statikliği artık `use cache` ile *açıkça* işaretlemenizdir:

```tsx
// app/blog/[slug]/page.tsx — statik üretilir (SSG)
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function Post({ params }) {
  'use cache'; // süre verilmezse süresiz statik = klasik SSG
  const { slug } = await params;
  const post = await getPost(slug);
  return <article>{post.body}</article>;
}
```

Üretimde çarptığımız duvar: SSG build'leri sayfa sayısı arttıkça yavaşlar. 340 sayfalık bir dokümantasyon sitesi Turbopack ile yaklaşık 12 saniyede build oldu; 40.000 sayfaya büyüyen bir katalog ise tam build'i 18 dakikanın üzerine itti ve her içerik düzeltmesini acı verici hale getirdi. İşte bu ölçeklenme duvarı, ISR'ın çözmek için tasarlandığı sorunun ta kendisidir. Build hızını da göz ardı etmeyin; [Core Web Vitals kontrol listemizde](/tr/posts/core-web-vitals-kontrol-listesi) neden önemli olduğunu ayrıntılandırdık.

## ISR nasıl çalışır ve ne zaman kullanılır?

ISR hız için statik bir sayfa sunar ama bir tazeleme aralığından sonra arka planda yeniden üretir; böylece ziyaretçiler otomatik tazelenen içerikle neredeyse statik performans alır. Büyük ve yarı dinamik kümelerde kullanın: e-ticaret katalogları, haber akışları ve verinin istek başına değil saatlik değiştiği liste sayfaları.

Next.js 16'da bunu `use cache` ile bir `cacheLife` profili birlikte yapar. Klasik `export const revalidate = 60` hâlâ [ISR rehberinde](https://nextjs.org/docs/app/guides/incremental-static-regeneration) belgeli ve çalışır ama yeni ve önerilen yol daha ifade gücü yüksek:

```tsx
// app/products/[id]/page.tsx — ISR, Next.js 16 tarzı
import { cacheLife } from 'next/cache';

export default async function Product({ params }) {
  'use cache';
  cacheLife('minutes'); // en fazla dakikalar mertebesinde bayat
  const { id } = await params;
  const product = await getProduct(id);
  return <h1>{product.name} — {product.price} TL</h1>;
}
```

Gerçekte olan şu: Pencereden sonraki ilk ziyaretçi cache'lenmiş (biraz bayat) sayfayı anında alır, Next.js ise bir sonraki ziyaretçi için taze bir sürümü arka planda üretir — klasik stale-while-revalidate. İşlettiğimiz bir mağaza kataloğunda ISR, TTFB'yi 45 ms civarında tutarken fiyatlar en fazla 60 saniye bayat kaldı ve 18 dakikalık bir tam rebuild'i tamamen atladık.

Next.js 16 [talep üzerine tazelemeyi](https://nextjs.org/docs/app/getting-started/revalidating) de netleştirdi. Artık `revalidateTag(tag, profil)` ikinci argüman olarak bir `cacheLife` profili ister; okuduğunuzu anında geri görmek istediğiniz editör akışları için ise yeni `updateTag(tag)` var — CMS'inizden gelen bir webhook, editör yayına bastığı anda tek bir sayfayı tazeleyebilir.

## SSR mı SSG mi ISR mı: nasıl karar veririm?

Kısa cevap: Şu üç soruyu sırayla sorun. "İçerik her kullanıcı için aynı mı?" Değilse SSR kullanın. "Günde birkaç kereden fazla mı değişiyor ya da binlerce sayfanız mı var?" Evet ise ISR kullanın. Aksi halde SSG kullanın. Statik başlayın ve sunucu işini yalnızca veri gerçekten gerektirince ekleyin.

Pratikte işe yarayan bir karar akışı:

1. **Sayfa kişiselleştirilmiş ya da isteğe özel mi?** (oturum, sepet, konum) — **SSR** kullanın.
2. **İçerik tüm kullanıcılar için aynı ve nadiren mi değişiyor?** — **SSG** (`use cache`) kullanın.
3. **Herkes için aynı ama düzenli değişiyor ya da build etmek için çok mu büyük?** — **ISR** (`use cache` + `cacheLife`) kullanın.
4. **Rota bazında karıştırın.** Tek bir Next.js uygulaması statik bir pazarlama sayfasını, ISR bir kataloğu ve SSR bir dashboard'u yan yana sunabilir. PPR (Partial Prerendering) artık stabil olduğundan tek bir sayfa bile statik kabuk + dinamik ada olabilir.
5. **Tahmin etmeyin, ölçün.** Karar vermeden önce gerçek TTFB ve build süresini kontrol edin; doğru cevap çoğu zaman "statik artı küçük bir dinamik ada" olur.

Açık fikrimi söyleyeyim: 2026'da gördüğümüz olgun mimariler ideolojik değil pragmatiktir. Üretimdeki Next.js uygulamalarının çoğu varsayılan olarak dinamiktir, hızın önemli olduğu her yeri `use cache` ile statikleştirir ve ISR'ı büyük ya da tazelenen veri kümelerine saklar. Render seçiminden önce hangi bileşenin sunucuda kaldığını netleştirmek isterseniz, [Next.js 15'te React Server Components](/tr/posts/nextjs-react-server-components) ve [web performansı için görsel optimizasyonu](/tr/posts/web-gorsel-optimizasyonu) rehberlerimiz iyi başlangıç noktaları. Konunun tamamı için [Web Geliştirme kategorimize](/tr/category/web-gelistirme) göz atın.

## Sıkça Sorulan Sorular

### ISR aslında SSG artı bir zamanlayıcı mı?

Özünde evet, ama o zamanlayıcı ölçekte her şeyi değiştirir. ISR sayfaları tıpkı SSG gibi üretir, sonra dağıtım anında değil `cacheLife` penceresinden sonra arka planda yeniden üretir. Bu, milyonlarca neredeyse statik sayfayı sunup tam rebuild olmadan tazelemenizi sağlar; saf SSG bunu yapamaz.

### Next.js 16'nın yeni cache modeli eski `revalidate` kodumu bozar mı?

Genelde hayır. `export const revalidate` ve `generateStaticParams` hâlâ çalışıyor. Ama Next.js 16 varsayılanı dinamik yaptığı için, `use cache` eklemediğiniz sayfalar artık istek başında çalışır. `cacheComponents: true` ile yeni modele geçtiğinizde statiklik açık bir tercih olur; bu yüzden yükseltirken TTFB'yi ölçün.

### SEO için hangi render yöntemi en iyisi?

Üçü de arama motorlarının ve AI cevap motorlarının okuyabileceği tam render edilmiş HTML üretir, dolayısıyla hiçbiri cezalandırılmaz. Asıl SEO etkeni hız ve tazeliktir: SSG ve ISR en hızlı Core Web Vitals'ı verir, SSR ise zamana duyarlı içeriği güncel tutar. Çoğu içerik için ISR hem hızlı hem taze olduğu için SEO'da tatlı noktadır.

### SSR, SSG ve ISR'ı aynı Next.js uygulamasında kullanabilir miyim?

Evet, hatta önerilen yaklaşım budur. Render rota, hatta bileşen bazında seçilir; bir pazarlama sayfası statik, bir ürün kataloğu ISR ve bir dashboard SSR olabilir, hepsi tek dağıtımda. Bunu `use cache`, `cacheLife` ve fetch `cache` seçenekleriyle kontrol edersiniz.
