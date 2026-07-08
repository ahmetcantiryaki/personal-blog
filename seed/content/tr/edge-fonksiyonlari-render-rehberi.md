---
title: "Edge Fonksiyonları ve Render: 2026 Rehberi"
slug: "edge-fonksiyonlari-render-rehberi"
translationKey: "edge-functions-rendering-guide"
locale: "tr"
excerpt: "Edge fonksiyonları ile bölgesel sunucusuz fonksiyonlar arasındaki fark, gerçek gecikme kazancı, veri konumu tuzağı ve streaming SSR için 2026 karar rehberi."
category: "web-development"
tags: ["rendering", "performance", "cloud", "frontend"]
publishedAt: "2026-07-08"
seoTitle: "Edge Fonksiyonları ve Render: 2026 Rehberi"
seoDescription: "Edge fonksiyonları mı bölgesel sunucusuz fonksiyonlar mı? Gerçek gecikme kazancı, veri konumu tuzağı, streaming SSR ve 2026 için render karar tablosu."
---

**Edge fonksiyonları**, kodunuzu tek bir bulut bölgesinde değil, kullanıcıya coğrafi olarak en yakın CDN noktasında (point of presence) çalıştırır; **bölgesel sunucusuz fonksiyonlar** ise (AWS Lambda, Vercel'in Node.js fonksiyonları gibi) tek bir bölgede, tam Node.js ortamıyla çalışır. Render'ı nerede yapacağınıza karar verirken asıl soru şudur: kodunuz veriye mi yakın olmalı, kullanıcıya mı? Temmuz 2026 itibarıyla cevap çoğu zaman ikisinin karışımı.

Bu yazıda edge ile bölgesel sunucusuz fonksiyonlar arasındaki farkı, gecikme kazancının nerede gerçek nerede pazarlama olduğunu, "veri konumu tuzağı" denen klasik hatayı, edge'de streaming SSR'ı ve çalışma zamanı kısıtlarını ele alıyorum; sonunda da nereye ne dağıtacağınıza karar vermenizi sağlayan bir tablo var.

## Edge fonksiyonu nedir, bölgesel sunucusuz fonksiyondan farkı ne?

Edge fonksiyonu, V8 izolatları gibi hafif bir çalışma zamanında çalışır ve dünya genelinde onlarca noktada aynı anda dağıtılır; istek hangi şehirden gelirse o şehre en yakın noktada yürütülür. Bölgesel sunucusuz fonksiyon ise (klasik AWS Lambda ya da Vercel'in Node.js runtime'ı) tek bir bölgede yaşar, tam Node.js API yüzeyine ve npm paketlerine erişebilir, ama her istek o tek bölgeye gitmek zorundadır.

Pratikte fark şuna iner: edge fonksiyonu ağ mesafesini kısaltır, bölgesel fonksiyon ise veritabanına yakınlığı korur. İkisi de "sunucusuz"dur ama optimize ettikleri şey farklıdır. [Vercel'in Edge Runtime dokümantasyonu](https://vercel.com/docs/functions/runtimes/edge) bunu açıkça belirtiyor: Edge Runtime, üretimde Node.js değil V8 kullanır, dolayısıyla Node.js API'lerinin tamamına erişemezsiniz — sadece Web API'lerinin bir alt kümesine (fetch, Request/Response, Web Crypto, ReadableStream) sahipsiniz.

İlginç bir 2026 detayı: Vercel, Haziran 2025'te bağımsız "Edge Functions" ürününü kaldırdı ve edge runtime'ı Fluid compute modeli altında Vercel Functions'a taşıdı. Yani artık seçim ürün bazında değil, fonksiyon bazında: her route için `runtime: 'edge'` ya da `'nodejs'` seçiyorsunuz, ayrı bir ürüne dağıtım yapmıyorsunuz.

```ts
// app/api/greet/route.ts — edge çalışma zamanı, düşük gecikme, dar API yüzeyi
export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name') ?? 'dünya';
  return new Response(`Merhaba, ${name}!`, {
    headers: { 'content-type': 'text/plain' },
  });
}
```

```ts
// app/api/report/route.ts — Node.js çalışma zamanı, native modüller ve dosya sistemi gerekli
export const runtime = 'nodejs'; // varsayılan; fs, sharp, native binding'ler için zorunlu

export async function POST(request: Request) {
  const body = await request.json();
  const pdf = await generatePdfWithNativeLib(body); // native bağımlılık, edge'de çalışmaz
  return new Response(pdf, { headers: { 'content-type': 'application/pdf' } });
}
```

Bu ayrım [Next.js'in Route Segment Config dokümantasyonunda](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config) da birebir aynı: `runtime` varsayılan olarak `'nodejs'`, siz açıkça `'edge'` demediğiniz sürece.

## Gecikme kazancı gerçek mi? Sınırları ne?

Evet, gerçek — ama sadece ağ mesafesi için. Kullanıcı ile sunucu arasındaki tek bölgeli bir kurulumda 100-300 ms'lik ağ gidiş-dönüşü, kullanıcıya en yakın edge noktasında çalışan bir fonksiyonla 10-50 ms'ye iner. Cloudflare Workers'ın V8 izolat modeli de soğuk başlangıcı neredeyse sıfıra indirir; klasik konteyner tabanlı sunucusuz fonksiyonlarda ise soğuk başlangıç 100 ms ile 1 saniye arasında sürebilir.

Ama bu kazanım yalnızca *fonksiyonun kendi çalışma süresi ve ağ mesafesi* için geçerli. Fonksiyon bir veritabanına, bir üçüncü taraf API'ye ya da tek bölgeli bir origin'e istek atıyorsa, o istek hâlâ eskisi kadar uzağa gidip gelmek zorunda. Edge, sizi kullanıcıya yaklaştırır; verinize yaklaştırmaz. Bu ayrımı gözden kaçırmak, bir sonraki bölümün konusu olan tuzağa düşürür.

## Veri konumu tuzağı: veritabanınızı hâlâ tek bölgede tutuyorsanız

**Veri konumu tuzağı** şudur: kodu edge'e taşırsınız ama veritabanınız ya da origin'iniz hâlâ tek bir bölgede oturuyordur; bu durumda gidiş-dönüşü ortadan kaldırmaz, sadece yerini değiştirirsiniz. Singapur'daki bir edge fonksiyonu, ABD doğusundaki tek bölgeli bir PostgreSQL'e her sorgu için ~200 ms bekliyorsa, bu durum veritabanıyla aynı bölgede oturan bölgesel bir sunucusuz fonksiyondan (tek haneli milisaniyeler) çok daha yavaştır. Fonksiyonun kendisi 2 ms'de çalışsa bile toplam yanıt süresini veritabanı gidiş-dönüşü belirler.

İtiraf edeyim: 2026'da "edge'e taşıdık" diye duyurulan projelerin önemli bir kısmı, ölçülmüş bir gecikme kazancından çok pazarlama listesindeki bir kutuyu işaretlemek için yapılmış gibi görünüyor. Veritabanınız tek bölgedeyse ve her istek ona gidip geliyorsa, fonksiyonu edge'e taşımak grafikte iyi görünür ama kullanıcı deneyimini genelde değiştirmez.

Bunu gerçekten çözmenin yolları var: veritabanını bölgelere çoğaltmak (okuma replikaları), edge-uyumlu veri katmanları kullanmak (Cloudflare D1/KV, Vercel Edge Config gibi) ya da sık okunan veriyi edge'de önbelleğe almak. Ama bunlardan hiçbirini yapmadan sadece fonksiyonu taşımak, sorunu çözmek değil, gizlemektir.

## Edge'de streaming SSR

Edge çalışma zamanı, React'in streaming SSR'ıyla iyi anlaşır çünkü ikisi de aynı Web Streams API'sine dayanır. Sunucu, hazır olan HTML parçasını hemen gönderip yavaş veriye bağımlı kısımları `Suspense` sınırıyla sonradan akıtabilir:

```tsx
// app/product/[id]/page.tsx — edge'de streaming SSR
export const runtime = 'edge';

import { Suspense } from 'react';

export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <main>
      <h1>Ürün detayları</h1>
      <Suspense fallback={<p>Fiyat yükleniyor…</p>}>
        {/* @ts-expect-error async server component */}
        <PriceFromDb id={params.id} />
      </Suspense>
    </main>
  );
}
```

Burada da veri konumu tuzağı geçerlidir: `PriceFromDb` uzak, tek bölgeli bir veritabanına bağlıysa, streaming yalnızca kullanıcının *iskeleti daha erken görmesini* sağlar; yavaş sorgunun kendisini hızlandırmaz. Streaming, algılanan performansı iyileştiren bir sunum tekniğidir, veri gidiş-dönüşünü ortadan kaldıran bir mimari çözüm değildir. Render yöntemleri arasındaki genel farkları netleştirmek isterseniz [SSR, SSG ve ISR karşılaştırmamıza](/tr/posts/ssr-ssg-isr-farki) bakabilirsiniz; sunucu bileşenlerinin hangi kısmının gerçekten sunucuda kaldığını anlamak içinse [Next.js'te React Server Components yazımız](/tr/posts/nextjs-react-server-components) iyi bir başlangıç.

## Çalışma zamanı kısıtları: edge'de neyle karşılaşırsınız

Edge çalışma zamanı, Node.js'in küçültülmüş bir alt kümesidir; bu üç kısıt üretimde en çok sorun çıkaran yerler:

- **Native modül yok.** `fs`, `child_process` ya da native binding gerektiren paketler (bazı görüntü işleme veya PDF kütüphaneleri gibi) edge'de çalışmaz; bunlar Node.js runtime'ına ihtiyaç duyar.
- **Daha küçük paket boyutu sınırları.** [Cloudflare Workers dokümantasyonuna göre](https://developers.cloudflare.com/workers/platform/limits/) ücretsiz planda sıkıştırılmış kod 3 MB, ücretli planda 10 MB ile sınırlıdır; global scope'un (üst düzey kod) kısa bir sürede yürütülmesi de gerekir. Vercel'in edge runtime'ında da benzer boyut ve API kısıtları var.
- **Sınırlı API yüzeyi.** Tam Node.js uyumluluğu yerine Web API alt kümesi sunulur; bazı popüler npm paketleri (özellikle Node'a özgü I/O yapanlar) edge'de hiç çalışmaz ya da özel edge uyumlu sürümlerini gerektirir.

Bu yüzden kural basit: kimlik doğrulama, yönlendirme, A/B testi, basit kişiselleştirme gibi hafif ve veri-hafif işler edge'e; native bağımlılık, ağır hesaplama ya da tek bölgeli veritabanına yoğun bağımlılık gerektiren işler Node.js runtime'ına gitmeli.

## Karar tablosu: render nerede yapılmalı?

| Boyut | Edge | Origin (bölgesel sunucusuz) | İstemci |
|---|---|---|---|
| Ağ gecikmesi (kullanıcıya) | En düşük (~10-50 ms) | Orta-yüksek (100-300 ms, bölgeye göre) | Yok (yerelde çalışır) |
| Veri yakınlığı | Düşük — veritabanı genelde uzakta | Yüksek — genelde aynı bölgede | Yok, her veri ağdan gelir |
| Soğuk başlangıç | Neredeyse sıfır (V8 izolat) | Düşük-orta (100 ms-1 sn, konfigürasyona göre) | Yok |
| Çalışma zamanı kısıtları | Native modül yok, dar API, küçük paket sınırı | Tam Node.js, native modüller, büyük paket | Yalnızca tarayıcı API'leri |
| En uygun senaryo | Auth kontrolü, yönlendirme, basit kişiselleştirme, statik/streaming kabuk | Veritabanı ağırlıklı iş, native bağımlılık, karmaşık hesaplama | Anlık etkileşim, form doğrulama, animasyon |

**Uyarı:** Bu tablodan çıkaracağınız en önemli sonuç şu: edge'de çalışan kod, kullanıcıya yakın olsa bile veritabanınız tek bölgedeyse toplam gecikmeyi iyileştirmez — sadece gidiş-dönüşün nerede gerçekleştiğini değiştirir. Önce veri katmanınızın nerede olduğuna bakın, sonra fonksiyonu nereye koyacağınıza karar verin.

Edge-origin farkındalığı artık 2026'da temel bir frontend/full-stack becerisi sayılıyor; "önce sunucuda render et" yaklaşımı da (server component'ler, varsayılan sunucu render'ı) bu yılın ana akım varsayılanı haline geldi. Konunun genel çerçevesi ve performans etkileri için [Core Web Vitals kontrol listemize](/tr/posts/core-web-vitals-kontrol-listesi), içerik ağırlıklı sitelerde render seçimi için [Astro mu Next.js mi karşılaştırmamıza](/tr/posts/astro-mu-nextjs-mi) ve daha fazla yazı için [Web Geliştirme kategorimize](/tr/category/web-gelistirme) göz atabilirsiniz.

## Sıkça Sorulan Sorular

### Edge fonksiyonu her zaman bölgesel sunucusuz fonksiyondan daha hızlıdır, doğru mu?

Hayır. Yalnızca ağ mesafesi ve soğuk başlangıç için daha hızlıdır. Fonksiyon tek bölgeli bir veritabanına ya da API'ye bağımlıysa, o gidiş-dönüş toplam süreyi belirler ve edge'in ağ avantajını gölgede bırakabilir.

### Streaming SSR, veri konumu tuzağını çözer mi?

Hayır, sadece algılanan performansı iyileştirir. Kullanıcı hazır olan HTML iskeletini daha erken görür ama yavaş veriye bağımlı kısım hâlâ aynı gidiş-dönüş süresini bekler; streaming gecikmeyi gizler, ortadan kaldırmaz.

### Hangi kod türleri edge'de çalışmaz?

`fs`, `child_process` gibi Node.js'e özgü modüller, native binding gerektiren paketler ve büyük bağımlılıklar (Cloudflare Workers'ta sıkıştırılmış 3-10 MB sınırının üzerine çıkanlar) edge'de çalışmaz; bunlar Node.js runtime'ına ihtiyaç duyar.

### Küçük bir proje için hangisiyle başlamalıyım?

Çoğu proje için Node.js runtime'ıyla başlayıp yalnızca ölçülmüş bir gecikme sorunu olan spesifik route'ları (auth, yönlendirme, basit kişiselleştirme) edge'e taşımak, baştan her şeyi edge'e dağıtmaktan daha güvenli bir yoldur.
