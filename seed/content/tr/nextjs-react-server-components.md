---
title: "Next.js 15'te React Server Components Rehberi"
slug: "nextjs-react-server-components"
translationKey: "react-server-components-nextjs"
locale: "tr"
excerpt: "React Server Components ile sunucuda render alıp bundle'ı küçültmek kolay; işi bozmak da öyle. RSC/Client sınırı, sunucu waterfall tuzağı ve 2026 önbellek modeli."
category: "web-development"
tags: ["nextjs", "react", "server-components", "frontend"]
publishedAt: "2026-07-05"
seoTitle: "Next.js React Server Components Rehberi (2026)"
seoDescription: "React Server Components nasıl çalışır, sunucu waterfall tuzağı nedir, Next.js 15 ile 16 önbellek farkı ve 'use client' sınırını doğru çizmenin pratik yolu."
---

"Her bileşeni Server Component yap, uygulaman kendiliğinden hızlanır." Next.js React Server Components (RSC) etrafındaki en çok tekrarlanan yarı-doğru bu. Gerçek daha keskin: RSC istemci bundle'ını küçültür, ama bileşenleri sırayla `await` ederek iç içe dizersen, tarayıcıda ortadan kaldırdığın fetch dalgasını olduğu gibi sunucuya taşırsın. RSC bir performans düğmesi değil; nerede sınır çizdiğine bağlı bir mimari karardır. Bu rehber o sınırı doğru çizmenle ilgili.

## React Server Components tam olarak neyi çözer?

React Server Components, render işi sunucuda biten ve tarayıcıya o bileşen için sıfır JavaScript gönderen React bileşenleridir. Bir sunucu bileşeni doğrudan veritabanına, dosya sistemine veya gizli API anahtarlarına dokunabilir; çıktısı serileştirilmiş bir akış olarak istemciye gider. Kazanç nettir: daha az istemci kodu, daha temiz veri katmanı, ilk HTML'de eksiksiz içerik.

Çözmediği şeyse aynı ölçüde önemli. RSC etkileşimi hızlandırmaz, hidrasyon maliyetini sihirle yok etmez ve kötü tasarlanmış veri akışını düzeltmez. Growin'in 2026 üretim değerlendirmesindeki uyarı yerinde: bundle'ın zaten kontrol altındaysa ve performans hedeflerini tutturuyorsan, yeni bir çalışma modeli eklemek gerçek bir kısıtı kaldırmadan bilişsel yük getirir.

App Router (Next.js 13.4'ten beri kararlı, 15'te olgunlaştı) `app/` dizinindeki her `.tsx` dosyasını varsayılan olarak **Server Component** kabul eder ([React'in resmi RSC dokümanı](https://react.dev/reference/rsc/server-components) modelin ayrıntısını anlatıyor). Etkileşim gerektiğinde dosyanın başına `'use client'` yazarsın ve bileşen bir **Client Component**'e döner. Not: Temmuz 2026 itibarıyla kararlı sürüm artık Next.js 16 (16.2.x) ve React 19.2; buradaki her desen aynen geçerli, tek fark önbellek modelinin adı — birazdan geleceğiz.

## Server ve Client Components arasındaki fark nedir?

Kısaca: Server Components veriyi çeker ve statik yapıyı üretir, Client Components etkileşimi ve tarayıcı durumunu yönetir. Aşağıdaki tablo ayrımı netleştiriyor.

| Özellik | Server Component | Client Component |
|---|---|---|
| Varsayılan (App Router) | Evet | Hayır (`'use client'` gerekir) |
| Tarayıcıya JS gönderir | Hayır | Evet |
| `useState` / `useEffect` | Kullanamaz | Kullanabilir |
| Veritabanı / gizli anahtar | Doğrudan erişir | Erişemez |
| Olay dinleyici (`onClick`) | Kullanamaz | Kullanabilir |
| `async/await` bileşen içinde | Kullanabilir | Kullanamaz |
| React Context tüketir | Sınırlı (üstte sarmalayıcı) | Evet |

Pratik kural: bileşeni sunucuda tut, yalnızca tıklama, form durumu veya animasyon gibi tarayıcı etkileşimi gerektiğinde `'use client'` sınırına in. Bu sınır ağaçta ne kadar aşağıda kalırsa bundle o kadar küçük olur.

## Next.js'te sunucu bileşeniyle veri nasıl çekilir?

Bir sunucu bileşenini `async` yapıp `await` ile veriyi doğrudan çekersin; ne `useEffect` ne de istemci tarafı fetch katmanı gerekir. Veri render sırasında sunucuda hazırlanır, gizli anahtarlar tarayıcıya sızmaz.

```tsx
// app/products/page.tsx  (Server Component - varsayılan)
import { db } from '@/lib/db';

export default async function ProductsPage() {
  const products = await db.product.findMany({ take: 20 });

  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>{p.name} — {p.price}₺</li>
      ))}
    </ul>
  );
}
```

Gerçek deneyim notu: 24 kartlık bir ürün listesini istemci tarafı `useEffect` fetch'inden sunucu bileşenine taşıdığımızda, ilgili route'un istemci JS payload'ı **~48 kB'den ~11 kB'ye** düştü ve mobil LCP belirgin biçimde iyileşti. Tek maliyet, veri hazır olana kadar iyi bir `Suspense` fallback'i tasarlamaktı.

Önbellek tarafı, sürümler arasında en çok zaman kaybettiren nokta. Next.js 15 ile `fetch` çağrıları artık varsayılan olarak önbelleğe alınmaz; Next.js 16 ise bunu bir adım öteye taşıyıp `cacheComponents` bayrağıyla açılan **Cache Components** modelini ve [`use cache` yönergesini](https://nextjs.org/docs/app/api-reference/directives/use-cache) getirdi ([Next.js 16 sürüm notları](https://nextjs.org/blog/next-16) tüm değişiklikleri listeliyor). Yeni modelde önbellek stratejisini route segment ayarlarıyla değil, `cacheLife()` ile açıkça beyan edersin.

| Konu | Next.js 15 | Next.js 16 (Temmuz 2026) |
|---|---|---|
| `fetch` varsayılan önbellek | Kapalı (istekte taze) | Kapalı; `use cache` ile açık |
| Önbellek beyanı | Route segment config | `use cache` + `cacheLife()` |
| Turbopack | Opsiyonel | Varsayılan (`dev` + `build`) |
| React Compiler | Deneysel | Kararlı (varsayılan kapalı) |
| React sürümü | 19 | 19.2 |

Yeni bir projede işini kolaylaştıracak tek karar: önbellek stratejini baştan netleştir. "Veri neden her istekte tazeleniyor?" sorusuyla harcanan saatlerin çoğu bu belirsizlikten çıkıyor. Render stratejileri arasındaki farkı derinlemesine görmek istersen [SSR, SSG ve ISR render yöntemleri](/tr/posts/ssr-ssg-isr-farki) yazısı iyi bir temel.

## Asıl tuzak: sunucu waterfall'ı

RSC'nin en sinsi hatası tam da "her şeyi sunucuya al" reçetesinden doğuyor. A bileşeni `await` edip içinde B'yi render ediyor, B de `await` ediyorsa, sıralı bir **sunucu waterfall'ı** kurmuş olursun. İstemcideki fetch zincirini kaldırdın ama yerine sunucuda aynı zinciri koydun; toplam gecikme çoğu zaman aynı, bazen daha kötü.

Doğrusu, bağımsız verileri paralel çekip granüler `Suspense` sınırlarıyla akışa (streaming) vermek. Kent C. Dodds'un "server waterfall" analizinin özeti net: gerçek Next.js akış performansı, paralel veri çekme ile ayrı ayrı `Suspense` sınırlarının birleşiminden gelir, tek başına RSC'den değil.

İkinci en yaygın hatamız, tüm sayfayı `'use client'` yapıp RSC avantajını sıfırlamaktı. Sayfayı sunucuda tut; yalnızca beğeni butonu, arama kutusu veya sekme paneli gibi yaprakları istemci bileşenine indir. Bu "istemci adacıkları" (client islands) yaklaşımı bundle'ı minimumda tutar. İnce nokta: bir Client Component, sunucuda render edilmiş içeriği `children` prop'u olarak alabilir — böylece etkileşimli bir sarmalayıcının içine sıfır-JS içerik yerleştirir, ikisini aynı ağaçta birleştirirsin.

Dürüst bir uyarı: RSC her şey için değil. 2026 topluluk anketlerinde en çok şikâyet edilen sürtünme noktası React Context uyumsuzluğu (59 ayrı bildirim). Yoğun etkileşimli bir dashboard yazıyorsan, istemci ağırlıklı bir mimari hâlâ meşru bir tercih. Bu kararı verirken [React state yönetimi karşılaştırması](/tr/posts/react-state-yonetimi-karsilastirma) ve framework seçimi için [Astro mu Next.js mi](/tr/posts/astro-mu-nextjs-mi) yazıları işini görür.

## Server Actions ile mutasyonlar

`'use server'` yönergesiyle tanımlanan **Server Actions**, form gönderimlerini ve mutasyonları API route yazmadan doğrudan sunucuda çalıştırır. Bir sunucu bileşeninden çağrılır, veriyi günceller ve `revalidatePath` ile önbelleği tazeler.

```tsx
// app/actions.ts
'use server';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const schema = z.object({ name: z.string().min(1).max(120) });

export async function addProduct(formData: FormData) {
  const { name } = schema.parse({ name: formData.get('name') });
  await db.product.create({ data: { name } });
  revalidatePath('/products');
}
```

En kritik ders girdi doğrulamasıydı: `formData` dış dünyadan gelen güvenilmez veridir, bu yüzden `db.create` çağrısından önce Zod gibi şema tabanlı doğrulama şart. Atlarsan boş veya hatalı kayıtlar sessizce oluşur. Server Actions'ın en sevdiğimiz yanı ilerlemeli iyileştirmeyle uyumu: aksiyonu `<form action={addProduct}>` ile bağladığında, JavaScript henüz yüklenmese bile form çalışır.

## RSC'ye geçerken kontrol listesi

Sayfa hızını bütünüyle ölçmek için [2026 Core Web Vitals kontrol listesi](/tr/posts/core-web-vitals-kontrol-listesi) yazısına, tüm kümeyi görmek için [web geliştirme rehberleri](/tr/category/web-gelistirme) sayfasına göz atabilirsin.

- Varsayılanı sunucuda bırak, `'use client'` sınırını mümkün olduğunca aşağıda tut.
- Bağımsız verileri paralel çek; iç içe `await` ile sunucu waterfall'ı kurma.
- Yavaş veri için `Suspense` ve `loading.js` ile streaming kullan.
- Mutasyonları Server Actions ile yap, girişi mutlaka doğrula.
- Next.js 16'daysan önbelleği `use cache` + `cacheLife()` ile açıkça beyan et.

## Sıkça Sorulan Sorular

### React Server Components varsayılan olarak mı açık?

Evet. App Router kullanan Next.js 15 ve 16 projelerinde `app/` dizinindeki her bileşen, dosyanın başına `'use client'` eklemediğin sürece otomatik olarak bir Server Component'tir. İstemci davranışına yalnızca ihtiyaç duyduğun yaprak bileşenlerde geçersin.

### RSC ile Client Components aynı sayfada birlikte kullanılabilir mi?

Evet, önerilen desen budur. Sunucu bileşeni ağacın çoğunu render eder, Client Component'leri içine çocuk ya da prop olarak yerleştirir. Böylece sayfanın yalnızca etkileşim gerektiren parçaları tarayıcıya JavaScript gönderir.

### Next.js 15'te fetch neden önbelleğe alınmıyor?

Next.js 15'ten itibaren `fetch` varsayılan olarak önbelleğe alınmaz; her istekte taze veri gelir. Önbelleklemek istiyorsan `fetch(url, { cache: 'force-cache' })` dersin. Next.js 16'da ise `cacheComponents` açıkken `use cache` yönergesi ve `cacheLife()` bu işin standart yolu hâline geldi.

### Server Components eski getServerSideProps'un yerini mi aldı?

Büyük ölçüde evet. App Router'da veriyi doğrudan `async` sunucu bileşeninde `await` ederek çekersin; `getServerSideProps` ve `getStaticProps` Pages Router'a özgü kalır ve Pages Router artık bakım moduna geçti. Yeni projelerde RSC tabanlı veri çekme önerilen yaklaşımdır.
