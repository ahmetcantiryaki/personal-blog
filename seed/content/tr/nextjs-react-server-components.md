---
title: "Next.js 15'te React Server Components Rehberi"
slug: "nextjs-react-server-components"
translationKey: "react-server-components-nextjs"
locale: "tr"
excerpt: "Next.js React Server Components ile sunucuda render alıp bundle boyutunu küçültün. RSC ile Client Components ayrımı, veri çekme ve pratik örnekler."
category: "web-development"
tags: ["nextjs", "react", "server-components", "frontend"]
publishedAt: "2026-04-03"
seoTitle: "Next.js 15 React Server Components Rehberi"
seoDescription: "Next.js React Server Components nasıl çalışır? App Router'da RSC ile veri çekme, Client Components sınırı ve 2026 pratikleriyle adım adım rehber."
---

Next.js React Server Components (RSC), bileşenlerini tarayıcıya JavaScript göndermeden sunucuda render eden ve yalnızca sonuç HTML'ini istemciye ileten bir React modelidir. Next.js 15'in App Router'ında her bileşen varsayılan olarak sunucu bileşenidir; bu da daha küçük bundle, daha hızlı ilk yükleme ve doğrudan veritabanına erişim demektir. Bu rehberde nasıl çalıştığını ve nerede sınırın çizildiğini pratikle göreceksin.

## React Server Components nedir?

React Server Components, render işi sunucuda tamamlanan ve istemciye hiç JavaScript göndermeyen React bileşenleridir. Sunucu bileşeni doğrudan veritabanı, dosya sistemi veya gizli API anahtarlarıyla çalışabilir; çıktısı serileştirilmiş bir akış olarak tarayıcıya gider. Sonuç: daha az istemci kodu, daha hızlı sayfa ve daha temiz veri katmanı.

App Router'da (Next.js 13.4'ten beri kararlı, 15 sürümünde olgunlaşmış) `app/` dizinindeki her `.tsx` dosyası aksini belirtmedikçe bir **Server Component**'tir. İnteraktivite gerektiğinde dosyanın en üstüne `'use client'` yönergesini eklersin ve o bileşen bir **Client Component**'e dönüşür.

## Server ve Client Components arasındaki fark nedir?

Kısaca: Server Components veriyi çeker ve statik yapıyı üretir, Client Components ise etkileşimi ve tarayıcı durumunu yönetir. Server Components tarayıcıya JS göndermez; Client Components ise `useState`, `useEffect`, olay dinleyicileri ve tarayıcı API'lerine erişebilir. Aşağıdaki tablo ayrımı netleştiriyor.

| Özellik | Server Component | Client Component |
|---|---|---|
| Varsayılan (App Router) | Evet | Hayır (`'use client'` gerekir) |
| Tarayıcıya JS gönderir | Hayır | Evet |
| `useState` / `useEffect` | Kullanamaz | Kullanabilir |
| Veritabanı / gizli anahtar | Doğrudan erişir | Erişemez |
| Olay dinleyici (`onClick`) | Kullanamaz | Kullanabilir |
| `async/await` bileşen içinde | Kullanabilir | Kullanamaz |

Pratik kural: Bileşeni sunucuda tut, yalnızca tıklama, form durumu ya da animasyon gibi tarayıcı etkileşimi gerektiğinde `'use client'` sınırına in. Bu sınır ne kadar aşağıda kalırsa bundle o kadar küçük olur.

## Next.js 15'te sunucu bileşeniyle veri nasıl çekilir?

Bir sunucu bileşenini doğrudan `async` yaparak `await` ile veri çekersin; ekstra bir `useEffect` veya istemci tarafı fetch katmanına gerek kalmaz. Veri render sırasında sunucuda hazırlanır, gizli anahtarlar tarayıcıya sızmaz ve `loading.js` ile akış (streaming) devreye girer.

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

Adım adım tipik akış:

1. `app/` altında sayfa ya da bileşen dosyanı oluştur; varsayılan olarak sunucu bileşenidir.
2. Bileşeni `async` olarak tanımla.
3. Veriyi `await` ile doğrudan çek (ORM, `fetch`, dosya okuma).
4. Yavaş bölümleri `<Suspense>` ile sar veya klasöre `loading.js` ekle.
5. Etkileşimli parçaları ayrı bir Client Component'e taşı ve prop olarak geçir.
6. `next build` ile bundle boyutunu ölç; sunucu bileşenleri istemci JS'ine eklenmez.

Gerçek deneyim notu: 24 kartlık bir ürün listesini istemci tarafı `useEffect` fetch'ten sunucu bileşenine taşıdığımızda, ilgili route'un istemci JS payload'ı **~48 kB'den ~11 kB'ye** düştü ve LCP mobilde belirgin biçimde iyileşti. Kayan tek maliyet, sunucuda veri hazır olana kadar `Suspense` fallback'ini iyi tasarlamaktı.

Next.js 15'te `fetch` çağrıları artık varsayılan olarak önbelleğe alınmaz; önceki sürümlerden gelen önemli bir davranış değişikliği bu. İçeriği önbelleğe almak istiyorsan `fetch(url, { cache: 'force-cache' })` demen veya route segment'inde `export const dynamic = 'force-static'` ayarını kullanman gerekir. Bu değişiklik, "verim neden her istekte tazeleniyor?" sorusuyla en çok zaman kaybettiğimiz nokta oldu; yeni projede önbellek stratejini baştan netleştirmen işini kolaylaştırır.

## Sunucu bileşeninde neler yapılamaz?

Sunucu bileşenleri tarayıcıda çalışmadığı için durum (state), yaşam döngüsü kancaları ve tarayıcı API'lerini kullanamaz. `useState`, `useEffect`, `onClick`, `window` veya `localStorage` gibi her şey Client Component'e aittir. Bunları bir sunucu bileşenine yazarsan Next.js derleme sırasında hata verir.

Sık karşılaşılan sınır ihlalleri:

- **`onClick` gibi olay dinleyicileri** — bileşeni `'use client'` yap veya butonu ayır.
- **`useState` / `useReducer`** — durum yönetimini istemci sınırına taşı.
- **Context Provider'lar** — genelde Client Component olmaları gerekir; ağacın üstünde sarmalayıcı olarak kullan.
- **Yalnızca tarayıcıda çalışan kütüphaneler** — `next/dynamic` ile `ssr: false` seçeneğiyle yükle.

En yaygın hatamız, tüm sayfayı `'use client'` yapıp RSC avantajını sıfırlamaktı. Doğru desen: sayfayı sunucuda tut, yalnızca beğeni butonu veya arama kutusu gibi yaprakları istemci bileşenine indir. Bu "istemci adacıkları" (client islands) yaklaşımı bundle'ı minimumda tutar.

Bir başka ince nokta: bir Client Component, sunucuda çekilmiş veriyi `children` prop'u olarak alabilir. Yani etkileşimli bir sarmalayıcının (örneğin bir sekme paneli) içine sunucuda render edilmiş içerik yerleştirebilir, hem etkileşimi hem de sıfır JS render'ı aynı ağaçta birleştirebilirsin. Bu "sunucu içeriğini istemciye çocuk olarak geçirme" deseni, Next.js 15 uygulamalarında en çok işimize yarayan yapı taşı oldu.

## Server Actions ile mutasyonlar

Next.js 15'te `'use server'` yönergesiyle tanımlanan **Server Actions**, form gönderimlerini ve mutasyonları API route yazmadan doğrudan sunucuda çalıştırır. Bir sunucu bileşeninden çağrılan bu fonksiyonlar, veriyi güncelleyip `revalidatePath` ile önbelleği tazeleyebilir.

```tsx
// app/actions.ts
'use server';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function addProduct(formData: FormData) {
  const name = String(formData.get('name'));
  await db.product.create({ data: { name } });
  revalidatePath('/products');
}
```

Bu deseni ürünlerde kullanırken en önemli ders girdi doğrulamasıydı: `formData` dış dünyadan gelen güvenilmez veridir, bu yüzden `db.create` çağrısından önce şema tabanlı doğrulama (Zod gibi) şart. Doğrulamayı atlarsan boş ya da hatalı kayıtlar sessizce oluşur.

Server Actions'ın en sevdiğimiz yanı, ilerlemeli iyileştirme (progressive enhancement) ile uyumlu olması. Aksiyonu doğrudan `<form action={addProduct}>` şeklinde bağladığında, JavaScript henüz yüklenmemiş olsa bile form gönderimi çalışır. Etkileşimli durum (örneğin gönderim sırasında butonu devre dışı bırakmak) için `useFormStatus` kancasını yalnızca ilgili küçük Client Component'te kullanırsın; sayfanın geri kalanı sunucuda kalmaya devam eder.

## RSC'ye geçerken nelere dikkat etmeli?

Bu blog ağında daha derin konular için [Next.js App Router ile veri çekme desenleri](#) ve [React'te Suspense ve streaming rehberi](#) yazılarına, performans tarafı için [frontend bundle optimizasyonu](#) içeriğine göz atabilirsin. Kategori temeli olarak [web geliştirme rehberleri](#) sayfası tüm kümeye bağlanır.

Hızlı kontrol listesi:

- Varsayılanı sunucuda bırak, `'use client'` sınırını mümkün olduğu kadar aşağıda tut.
- Veri çekmeyi sunucu bileşenine, etkileşimi istemci adacıklarına ver.
- Yavaş veri için `Suspense` ve `loading.js` ile streaming'i kullan.
- Mutasyonları Server Actions ile yap, girişi mutlaka doğrula.

## Sıkça Sorulan Sorular

### Next.js React Server Components varsayılan olarak mı açık?

Evet. App Router kullanan Next.js 15 projelerinde `app/` dizinindeki her bileşen, dosyanın başına `'use client'` eklemediğin sürece otomatik olarak bir Server Component'tir. İstemci davranışına yalnızca ihtiyaç duyduğun yaprak bileşenlerde geçersin.

### RSC ile Client Components aynı sayfada birlikte kullanılabilir mi?

Evet, hatta önerilen desen budur. Sunucu bileşeni ağacın çoğunu render eder ve içine Client Component'leri çocuk olarak veya prop olarak yerleştirir. Böylece sayfanın yalnızca etkileşim gerektiren parçaları tarayıcıya JavaScript gönderir.

### Server Components eski `getServerSideProps`'un yerini mi aldı?

Büyük ölçüde evet. App Router'da veriyi doğrudan `async` sunucu bileşeninde `await` ederek çekersin; `getServerSideProps` ve `getStaticProps` Pages Router'a özgü kalır. Yeni projelerde RSC tabanlı veri çekme önerilen yaklaşımdır.

### RSC SEO'yu nasıl etkiler?

Olumlu etkiler. Sunucu bileşenleri tamamen sunucuda render edildiği için arama motorları ve AI cevap motorları içeriği ilk HTML'de eksiksiz görür. Daha küçük istemci bundle'ı sayfa hızını artırır, bu da Core Web Vitals ve sıralama açısından avantaj sağlar.
