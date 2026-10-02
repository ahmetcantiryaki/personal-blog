---
title: "Frontend'i Edge'e Nasıl Taşırsın? Pratik Rehber"
slug: "frontend-edge-dagitim"
translationKey: "edge-deployment-frontend-2026"
locale: "tr"
excerpt: "Kısa cevap: SSR, middleware ve kişiselleştirmeyi edge'de çalıştır, ağır veritabanı işlemlerini bölgesel sunucuda bırak; TTFB 150-250 ms'den 30-50 ms'ye düşer."
category: "web-development"
tags: ["frontend", "deployment", "performance", "cloud"]
publishedAt: "2026-10-02"
seoTitle: "Frontend'i Edge'e Taşıma Rehberi: Ne Zaman, Nasıl?"
seoDescription: "Frontend'i edge'e taşıma rehberi: SSR ve middleware edge'de hangi koşulda çalışır, cold start ve çalışma zamanı sınırları neler, gerçek TTFB kazancı ne kadar."
---

Kısa cevap: Sunucu tarafı render, middleware, kişiselleştirme ve A/B test mantığını edge'e taşı; ağır veritabanı sorguları ve uzun süren işlemleri bölgesel bir sunucuda bırak. Doğru ayrımı yaptığında TTFB (ilk byte süresi) 150-250 ms'den 30-50 ms'ye düşer, ama edge çalışma zamanının 30-50 ms CPU süresi ve 128 MB bellek gibi sert sınırları var — her iş yükü için uygun değil.

## Edge dağıtım nedir, neden 2026'da standart hale geldi?

Edge dağıtım, kodunu tek bir bölgesel veri merkezinde değil, kullanıcıya coğrafi olarak en yakın noktalarda çalıştırmak demek. Cloudflare Workers, Vercel Edge Functions ve Deno Deploy gibi platformlar artık istek yönlendirme ve A/B testinin ötesinde, tam API mantığı ve AI çıkarım işlerini de dünya genelinde kullanıcının 50 ms menzilinde çalıştırabiliyor.

Bu değişimin itici gücü somut: Cloudflare Workers'ın V8 izolatlarıyla soğuk başlatma süresi çoğu ölçümde 5 ms'nin altında — kullanıcı deneyimi açısından sıfıra yakın. Bu, geleneksel sunucusuz (serverless) fonksiyonlara göre yaklaşık 9 kat iyileşme anlamına geliyor. Vercel'in V8 tabanlı Edge Runtime'ı ise 50-250 ms aralığında soğuk başlıyor; Vercel bu farkı kapatmak için fonksiyonları daha uzun süre "sıcak" tutan Fluid Compute modelini öne çıkarıyor.

## Edge'de ne çalışmalı, ne çalışmamalı?

Edge'de çalıştırman gereken işler: SSR (sunucu tarafı render), middleware, kişiselleştirme, A/B test yönlendirmesi ve kimlik doğrulama kontrolleri. Bunların hepsi düşük gecikme ister ve genelde milisaniyeler içinde biter — edge'in sunduğu tam olarak bu.

Edge'de çalıştırmaman gereken işler: büyük dosya işleme, uzun süren toplu veri işlemleri, tam Node.js API'lerine ihtiyaç duyan kütüphaneler (dosya sistemi erişimi, bazı native modüller) ve tek bir bölgede tutarlılığı garanti etmen gereken veritabanı yazma işlemleri. Edge fonksiyonları genelde 10-30 saniyelik çalışma süresi sınırına ve 128 MB bellek tavanına sahip; geleneksel sunucusuz fonksiyonlar dakikalarca çalışabilir ve gigabaytlarca bellek kullanabilir.

| Kriter | Edge Runtime | Geleneksel Sunucusuz |
|---|---|---|
| Soğuk başlatma | <5 ms (Cloudflare Workers) | 200-1000 ms |
| CPU süresi sınırı | 30-50 ms (bazı platformlarda 10-30 sn) | Dakikalar |
| Bellek sınırı | 128 MB | 1-10 GB |
| Node.js API desteği | Kısıtlı (V8 izolat) | Tam |
| İdeal iş yükü | SSR, middleware, kişiselleştirme | Toplu işleme, ağır hesaplama |

## Edge'de veri yakınlığı neden sorun çıkarır?

Edge fonksiyonun kendisi kullanıcıya yakın çalışsa bile, veritabanın hâlâ tek bir bölgede oturuyorsa kazancın büyük kısmı o veritabanı çağrısında kaybolur. Singapur'daki bir kullanıcı için edge'de 10 ms'de başlayan bir istek, veritabanı Virginia'daysa 150 ms'lik bir ağ gecikmesiyle sonuçlanabilir — toplam süre bölgesel bir sunucudan farksız hale gelir.

Bunun pratik çözümü, okuma ağırlıklı veriyi edge'e yakın bir KV deposu veya çoğaltılmış veritabanında (Cloudflare D1, PlanetScale'in çoklu bölge çoğaltması gibi) tutmak, yazma işlemlerini ise tek bir ana bölgede bırakmak. Workers; KV, R2 (nesne depolama) ve Durable Objects (durumlu edge hesaplama) gibi araçlarla bu modeli destekliyor.

## Edge'e dağıtım nasıl yapılır? Örnek middleware

Aşağıdaki örnek, Next.js'te bir middleware'in edge runtime'da kişiselleştirme için nasıl yazıldığını gösteriyor:

```typescript
export const config = { runtime: 'edge' }

export default async function middleware(request: Request) {
  const country = request.headers.get('x-vercel-ip-country') ?? 'TR'
  const url = new URL(request.url)

  if (country === 'TR' && !url.pathname.startsWith('/tr')) {
    url.pathname = `/tr${url.pathname}`
    return Response.redirect(url)
  }

  return new Response(null, { status: 200 })
}
```

Bu middleware, kullanıcının ülkesine göre yönlendirme yapıyor ve edge'de milisaniyeler içinde çalışıyor — bölgesel bir sunucuda bu kontrol, kullanıcı ile sunucu arasındaki tam gidiş-dönüş gecikmesini eklerdi.

## TTFB kazancı gerçekte ne kadar?

Edge'e taşınan bir SSR sayfası için tipik kazanç, TTFB'nin 150-250 ms'den 30-50 ms'ye düşmesi; bu fark özellikle mobil ve uzak coğrafyalardaki kullanıcılarda daha belirgin. Ama bu sayı iş yüküne göre değişir: fonksiyon veritabanına her istekte gidiyorsa ve veritabanı uzaktaysa kazanç büyük ölçüde buharlaşır.

Ölçüm yaparken tek bir metriğe güvenme — TTFB'yi, Core Web Vitals'taki LCP ve INP ile birlikte izle. Bir sayfanın TTFB'si düşse bile, istemci tarafında ağır JavaScript hidrasyonu varsa kullanıcı deneyimi iyileşmeyebilir.

## Edge'e geçiş yaparken hangi hatalar en sık yapılıyor?

En yaygın hata, "her şeyi edge'e taşı" yaklaşımı. Bir ekip SSR sayfalarını edge'e taşıdıktan sonra, aynı mantıkla veritabanı sorgusu içeren API route'ları da edge runtime'a geçirmeye kalkıyor; sonuç, 30-50 ms'lik CPU süresi sınırını aşan ve zaman aşımına uğrayan fonksiyonlar oluyor. Edge'e taşımadan önce her fonksiyonun gerçek çalışma süresini ve bellek kullanımını ölçmek, bu hatayı baştan önlüyor.

İkinci yaygın hata, edge runtime'ın desteklemediği bir Node.js kütüphanesini (dosya sistemi erişimi gereken bir resim işleme kütüphanesi gibi) fark etmeden bağımlılık ağacına dahil etmek. Bu genelde derleme zamanında değil, çalışma zamanında "Module not supported" hatasıyla ortaya çıkıyor — bu yüzden edge'e dağıtmadan önce bağımlılıkların edge-uyumlu olduğunu doğrulamak gerekiyor.

## Edge dağıtımı maliyeti nasıl etkiliyor?

Edge fonksiyonları genelde istek başına ücretlendiriliyor ve süre sınırlı olduğu için, doğru kullanıldığında geleneksel sunucusuz fonksiyonlara göre daha ucuza gelebiliyor — kısa süren bir fonksiyon, uzun süre çalışan bir sunucudan daha az kaynak tüketiyor. Ama bir ekip edge'i yanlış iş yükü için kullanırsa (örneğin tekrar deneme mantığı gerektiren uzun bir işlem), zaman aşımları ve yeniden denemeler maliyeti geleneksel bir sunucudan daha yükseğe taşıyabiliyor.

Pratik bir karşılaştırma: aylık 10 milyon istek alan, ortalama 20 ms süren bir middleware için edge maliyeti genelde bölgesel bir sunucusuz fonksiyondan %30-50 daha düşük çıkıyor; ama aynı iş yükü 2 saniyeden uzun sürüyorsa (edge'in sınırlarını zorluyorsa), maliyet karşılaştırması tersine dönebiliyor çünkü zaman aşımına uğrayan istekler yeniden tetikleniyor.

## Ne zaman bölgesel sunucu hâlâ daha iyi?

Karmaşık, çok tablolu veritabanı işlemleri yapan, güçlü tutarlılık gerektiren veya tam Node.js ekosistemine (belirli native modüller, dosya sistemi erişimi) bağımlı olan iş yükleri için bölgesel bir sunucu hâlâ daha basit ve daha öngörülebilir. Edge'in asıl gücü, "oku ve karar ver" tipi hafif mantıkta; "yaz ve işle" tipi ağır işlerde değil.

Bizim görüşümüz şu: "edge-first" yaklaşımı son bir yılda biraz dogma hâline geldi — her yeni projede varsayılan olarak edge seçmek, ölçüm yapmadan karar vermek anlamına geliyor. Edge'in gerçek kazancı, veri kaynağın da edge'e yakınsa ortaya çıkıyor; aksi halde sadece ek karmaşıklık eklemiş oluyorsun. Önce TTFB'ni ölç, sonra edge'e taşı — tersi değil.

Edge mimarisine geçmeden önce framework seçimini netleştirmek isteyenler [Astro mu Next.js mi](/tr/posts/astro-mu-nextjs-mi) karşılaştırmamıza, çalışma zamanı performansını merak edenler ise [Bun mu Node.js mi](/tr/posts/bun-mu-nodejs-mi-2026-runtime) yazımıza bakabilir. Edge'de çalışan bir tarayıcı eklentisi geliştirmek isteyenler için [2026'da Tarayıcı Eklentisi Nasıl Yapılır](/tr/posts/2026-tarayici-eklentisi-nasil-yapilir) rehberimiz de ilgili bir dağıtım modelini kapsıyor.

## Sıkça Sorulan Sorular

### Edge runtime ile Node.js runtime arasındaki fark nedir?

Edge runtime, V8 izolatları üzerinde çalışır ve dosya sistemi erişimi gibi tam Node.js API'lerini desteklemez; buna karşılık soğuk başlatma süresi neredeyse sıfırdır. Node.js runtime tam API desteği sunar ama soğuk başlatması 200-1000 ms sürebilir ve daha fazla kaynak tüketir.

### Hangi işler edge'e taşınmamalı?

Büyük dosya işleme, uzun süren toplu veri işlemleri, tam Node.js API'lerine bağımlı kütüphaneler ve tek bölgede güçlü tutarlılık gerektiren veritabanı yazma işlemleri edge'e taşınmamalı. Bu iş yükleri edge'in 30-50 ms CPU süresi ve 128 MB bellek sınırını aşabilir.

### Edge'e geçiş TTFB'yi gerçekten düşürür mü?

Veritabanı veya veri kaynağı da edge'e yakınsa evet, genelde TTFB 150-250 ms'den 30-50 ms'ye düşer. Ama fonksiyon her istekte uzak bir bölgedeki veritabanına gidiyorsa kazancın büyük kısmı o ağ gecikmesinde kaybolur.

### Cloudflare Workers mi Vercel Edge Functions mı daha hızlı?

Cloudflare Workers'ın V8 izolat soğuk başlatması çoğu ölçümde 5 ms'nin altında; Vercel'in Edge Runtime'ı 50-250 ms aralığında başlıyor ama Fluid Compute ile fonksiyonları daha uzun sıcak tutarak bu farkı azaltıyor. Seçim, platformun geri kalan ekosistemine (KV, R2, D1 gibi depolama araçları) olan ihtiyacına göre değişir.
