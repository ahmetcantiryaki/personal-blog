---
title: "TanStack Start: Full-Stack React'a Yeni Bir Bakış"
slug: "tanstack-start-fullstack-react"
translationKey: "tanstack-start-fullstack-react-alternative"
locale: "tr"
excerpt: "TanStack Start, TanStack Router ve Vite üzerine kurulu full-stack bir React framework'ü. Next.js'e alternatif olarak ne zaman mantıklı, bu yazıda."
category: "web-development"
tags: ["react", "nextjs", "frontend", "server-components"]
publishedAt: "2026-08-15"
seoTitle: "TanStack Start Nedir? Next.js Alternatifi İncelemesi"
seoDescription: "TanStack Start, TanStack Router ve Vite temelli full-stack React framework'ü. Type-safe routing, SSR ve Next.js karşılaştırması bu rehberde."
---

[TanStack Start](https://tanstack.com/start/latest), TanStack Router'ı temel alıp üzerine SSR, streaming, server fonksiyonları ve middleware ekleyen full-stack bir React framework'ü. 2026'nın ortasında geldiğimiz noktada, ekipler artık onu ciddi ciddi Next.js'in yerine koyup koyamayacaklarını soruyor — bu yazı tam da o sorunun cevabını arıyor.

## Next.js ve Remix Karşısında Konumu

TanStack Start'ı diğerlerinden ayıran temel fark, routing katmanının bağımsız bir kütüphane (TanStack Router) olarak doğması ve full-stack yeteneklerin bunun üzerine sonradan eklenmesi. Next.js'te App Router çerçevenin merkezinde, ondan ayrıştırılamaz; Remix de benzer şekilde kendi router'ıyla sıkı sıkıya bağlı. TanStack Start ise "önce router, sonra framework" sırasını izliyor — bu da onu Vite ekosistemindeki diğer araçlarla birleştirmeyi kolaylaştırıyor.

Pratikte bu, zaten TanStack Router veya TanStack Query kullanan bir ekip için düşük sürtünmeli bir geçiş anlamına geliyor. Next.js'ten gelen bir ekip içinse öğrenme eğrisi biraz daha dik; App Router'ın dosya tabanlı konvansiyonlarına alışmış gözler, TanStack'in daha kod-merkezli route tanımlarına adapte olmak zorunda.

## Type-Safe Routing ve Veri Yükleme

[TanStack Start'ın dokümantasyonuna göre](https://tanstack.com/start/latest/docs/framework/react/overview) framework'ün en güçlü satış noktası uçtan uca tip güvenliği. Route parametreleri, arama parametreleri (search params) ve loader dönüş tipleri derleme zamanında birbirine bağlı; bir route'un beklediği parametre değişirse, o route'a link veren her yer TypeScript hatası veriyor. Next.js'te bu düzeyde bir tip güvenliği elde etmek için genelde üçüncü parti araçlara (örneğin `next-typesafe-url`) ihtiyaç duyulurken, TanStack Start'ta bu yerleşik.

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/posts/$postId')({
  loader: async ({ params }) => {
    return fetchPost(params.postId)
  },
  component: PostPage,
})

function PostPage() {
  const post = Route.useLoaderData()
  return <article>{post.title}</article>
}
```

Loader'lar sunucu tarafında çalışıyor, sonuç otomatik olarak serileştirilip client'a akıyor; ekstra bir veri getirme kütüphanesi kurmadan React Server Components'e benzer bir deneyim elde ediliyor.

## Server Fonksiyonları: RPC Gibi Ama Tip Güvenli

TanStack Start'ın bir diğer önemli parçası server fonksiyonları — istemciden doğrudan çağrılabilen, ama sunucuda çalışan fonksiyonlar. Bir form gönderiminde veritabanına yazma işlemi yapmak istediğinizde, ayrı bir API route tanımlamak yerine `createServerFn` ile bir fonksiyon yazıp doğrudan bileşeninizden çağırabiliyorsunuz; girdi ve çıktı tipleri otomatik olarak uçtan uca doğrulanıyor. Bu, geleneksel REST veya tRPC benzeri bir katman kurmadan, tek bir dosyada hem istemci hem sunucu mantığını bir arada tutmayı mümkün kılıyor. Middleware desteği de aynı sisteme entegre: kimlik doğrulama veya logging gibi çapraz kesen ihtiyaçlar, her route için ayrı ayrı değil, merkezi bir middleware zincirinde tanımlanabiliyor.

## SSR ve Streaming

TanStack Start, sunucu tarafı render'ı ve streaming'i varsayılan olarak destekliyor. Bir sayfanın kritik olmayan bir bölümü (örneğin yorumlar veya öneriler) yavaş bir API'ye bağlıysa, o bölüm `Suspense` sınırı içine alınıp geri kalan sayfa bekletilmeden gönderilebiliyor. Bu, [Next.js 15'te React Server Components'i ele aldığımız yazıda](/tr/posts/nextjs-react-server-components) anlattığımız streaming modeline kavramsal olarak çok yakın; temel farkı, RSC'nin sunucu/client bileşen ayrımı yerine geleneksel client component modeliyle çalışması ve bu yüzden mevcut React bilginizin neredeyse tamamının doğrudan geçerli kalması.

## Vite Temelinin Getirdiği DX

TanStack Start'ın Vite üzerine kurulu olması geliştirici deneyiminde somut bir fark yaratıyor: HMR (hot module replacement) neredeyse anlık, build süreleri Webpack tabanlı araçlara göre belirgin şekilde kısa ve Vite'ın zengin eklenti ekosistemine (Tailwind, Vitest, vs.) doğrudan erişim var. Next.js'in Turbopack'e geçişiyle bu fark kapanıyor olsa da, TanStack Start bugün itibarıyla olgun bir Vite entegrasyonuna sahip. Test tarafında da benzer bir kazanım var: Vitest, aynı Vite yapılandırmasını paylaştığı için ayrı bir test runner konfigürasyonu kurmaya gerek kalmıyor — geliştirme sunucusunda çalışan modül çözümleme mantığı, test ortamında da birebir aynı şekilde işliyor. Bu, Jest gibi Vite'tan bağımsız bir test aracıyla uğraşırken sık karşılaşılan "geliştirmede çalışıyor ama testte patlıyor" tipi konfigürasyon sürtünmesini büyük ölçüde ortadan kaldırıyor.

| Özellik | TanStack Start | Next.js (App Router) |
| --- | --- | --- |
| Routing temeli | TanStack Router (bağımsız kütüphane) | Dosya tabanlı, framework'e gömülü |
| Tip güvenliği | Uçtan uca, yerleşik | Kısmi, ek araç gerekebilir |
| Build aracı | Vite | Turbopack / Webpack |
| Sunucu bileşen modeli | Client component + server fonksiyonları | React Server Components |
| Ekosistem olgunluğu | Aktif gelişiyor, hızla büyüyor | Geniş, oturmuş |
| Barındırma esnekliği | Nitro üzerinden çoklu adapter | Vercel'e optimize, diğerleri destekli |

## Olgunluk ve Geçiş Notları (2026)

TanStack Start'ın olgunluk durumu kaynağa göre değişkenlik gösteriyor: bazı kaynaklar 1.0 sürümüne 2025'in başında ulaşıldığını belirtirken, bazı 2026 başı kaynakları hâlâ release candidate aşamasından bahsediyor. Gerçekçi özet şu: framework aktif olarak üretimde kullanılıyor ve TanStack Router/Query ekosistemi haftada milyonlarca npm indirmesi alıyor, ama API yüzeyi Next.js kadar donmuş değil — minor sürümler arasında breaking change riski hâlâ Next.js'e göre daha yüksek.

Mevcut bir Next.js projesini TanStack Start'a taşımayı düşünen bir ekip için gerçekçi bir zaman çizelgesi kurmak önemli. Küçük bir uygulamada (10-20 route) geçiş birkaç haftaya sığabilirken, App Router'ın sunucu bileşen modeline derinlemesine bağımlı büyük bir kod tabanında bu süre kolayca aylara yayılabiliyor — çünkü RSC'nin sunucu/client bileşen ayrımı ile TanStack Start'ın client-component + server-fonksiyon modeli arasında bire bir eşleme yok, çoğu veri yükleme mantığının yeniden yazılması gerekiyor.

Bu, ekibin risk toleransına göre değerlendirilmesi gereken bir maliyet. Hızlı hareket eden, TypeScript'e zaten yatırım yapmış küçük-orta ölçekli bir ekip için bu risk kabul edilebilir; büyük bir kurumsal üründe, ekosistem olgunluğunun daha kritik olduğu yerlerde daha temkinli olmakta fayda var.

## Next.js Hâlâ Daha Güvenli Seçim Olduğunda

Şu durumlarda Next.js'i tercih etmek mantıklı: Vercel'in edge/ISR özelliklerinden yoğun şekilde faydalanan bir proje varsa; ekip zaten App Router konvansiyonlarına derinlemesine yatırım yapmışsa; ya da üçüncü parti entegrasyon (CMS eklentileri, e-ticaret şablonları) ihtiyacı Next.js ekosisteminin genişliğine bağımlıysa. [İki framework'ü yan yana karşılaştıran bağımsız bir incelemede](https://makerkit.dev/blog/tutorials/tanstack-start-vs-nextjs) de vurgulandığı gibi, karar çoğunlukla ekosistem olgunluğu ile geliştirici deneyimi arasındaki bir denge sorunu. [Astro ile Next.js'i karşılaştırdığımız yazıda](/tr/posts/astro-mu-nextjs-mi) da vurguladığımız gibi, "en iyi framework" diye bir şey yok — proje gereksinimlerine en az sürtünmeyle uyan framework var.

Açıkçası TanStack Start'ı bugün büyük bir kurumsal üretim sistemine taşımak biraz erken olabilir; ama yeni başlayan, TypeScript'e önem veren bir proje için ciddi bir aday olduğunu düşünüyorum.

## Minimal Başlangıç İskeleti

```bash
npm create @tanstack/start@latest my-app
cd my-app
npm run dev
```

Bu komut, `app/routes/` altında dosya tabanlı route'lar, `app/router.tsx` içinde merkezi router yapılandırması ve hazır Vite tabanlı bir geliştirme sunucusuyla minimal, çalışır durumda bir iskelet oluşturuyor.

## Karar Kontrol Listesi

```text
TanStack Start mı Next.js mi:
- Ekip zaten TanStack Router/Query kullanıyor mu? -> Start avantajlı.
- Vercel'in edge/ISR özellikleri kritik mi? -> Next.js avantajlı.
- Uçtan uca tip güvenliği önceliğiniz mi? -> Start avantajlı.
- Geniş üçüncü parti eklenti ekosistemine mi ihtiyacınız var? -> Next.js avantajlı.
- Breaking change riskine toleransınız var mı? -> Evetse Start, hayırsa Next.js.
```

Full-stack React seçimleri hakkında daha fazla karşılaştırma için [web geliştirme kategorimize](/tr/category/web-gelistirme) göz atabilirsiniz.

## Sıkça Sorulan Sorular

### TanStack Start, Remix'in yerini mi alıyor?

Doğrudan değil, ama benzer bir alanda rekabet ediyor. Remix, React Router üzerine kurulu; TanStack Start ise TanStack Router üzerine kurulu. İkisi de full-stack SSR framework'leri ama routing temelleri farklı kütüphanelerden geliyor.

### TanStack Start üretimde kullanılabilir mi?

Evet, aktif olarak üretimde SaaS ürünleri ve dashboard'lar için kullanılıyor. Ancak API yüzeyi Next.js kadar oturmuş değil; minor sürüm güncellemelerinde değişiklik riskini hesaba katmak gerekiyor.

### TanStack Start için hangi barındırma seçenekleri var?

Nitro tabanlı adapter sistemi sayesinde Node.js sunucuları, serverless platformlar (Vercel, Netlify, Cloudflare Workers) ve geleneksel VPS'ler dahil birçok ortama deploy edilebiliyor.

### TanStack Start React Server Components kullanıyor mu?

Hayır, geleneksel client component modeliyle çalışıyor; sunucu tarafı veri yükleme loader fonksiyonları ve server fonksiyonları üzerinden yapılıyor, RSC'nin sunucu/client bileşen ayrımı yok.
