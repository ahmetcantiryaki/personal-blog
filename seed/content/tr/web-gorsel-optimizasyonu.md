---
title: "Web Performansı İçin Görsel Optimizasyonu"
slug: "web-gorsel-optimizasyonu"
translationKey: "optimize-images-web"
locale: "tr"
excerpt: "2026'da web için görsel optimizasyonu: AVIF/WebP'ye dönüştürün, srcset ile duyarlı boyut sunun, LCP görselini preload edin ve LCP'yi gerçek rakamlarla düşürün."
category: "web-development"
tags: ["web-performance", "frontend", "core-web-vitals", "images"]
publishedAt: "2026-07-02"
seoTitle: "Web İçin Görsel Optimizasyonu Rehberi (2026)"
seoDescription: "AVIF/WebP'ye dönüştürün, srcset ile duyarlı boyut sunun, LCP görselini preload edin ve Core Web Vitals'ı geçin. Kod ve benchmark'larla 2026 iş akışı."
---

Web için görsel optimizasyonu yaparken dört işi sırayla yapın: **AVIF veya WebP'ye dönüştürün**, **`srcset` ile doğru boyutu sunun**, **ekran altı görselleri lazy-load edin** ve **LCP görselinizi preload edin**. Görseller çoğu sayfada hâlâ en ağır varlıktır; dolayısıyla bu, yükleme süresini kısaltmanın ve 2026'da Core Web Vitals'ı geçmenin en hızlı yoludur.

Aşağıda müşteri sitelerinde uyguladığımız tam iş akışını; komutları, işaretlemeyi ve öncesi/sonrası rakamlarıyla bulacaksınız. Rehber, mühendislerin bu konuda gerçekten sorduğu beş soru etrafında kurulu.

## Görseller web performansını neden en çok bozar?

Görseller, medyan bir sitede sayfa ağırlığının en büyük tek kaynağı olmayı sürdürüyor. Büyük bir hero görseli aynı zamanda en sık görülen **Largest Contentful Paint (LCP)** öğesidir; bu yüzden optimize edilmemiş bir görsel, Google'ın yükleme için ölçtüğü metriği doğrudan geciktirir. Temmuz 2026 itibarıyla "iyi" LCP eşiği hâlâ 75. yüzdelik dilimde 2,5 saniye; 2025 Web Almanac'a göre ise mobil sayfaların yalnızca %48'i üç Core Web Vitals metriğini birden geçebiliyor.

Pratikte, tek bir aşırı büyük JPEG mobil bağlantıda LCP'ye tam bir saniye ekleyebilir. Görselleri düzeltmek, yapabileceğiniz en yüksek getirili web performansı işidir.

- **Bayt:** her gereksiz kilobayt, yavaş bağlantılarda bant genişliği için yarışır.
- **LCP:** hero görseli genellikle LCP öğenizin ta kendisidir.
- **CLS:** boyutu belirtilmemiş görseller, yüklenirken yerleşim kaymasına yol açar.

## 2026'da hangi görsel formatını kullanmalısınız?

**İlk tercih AVIF olsun**, **WebP'ye düşün** ve JPEG/PNG'yi yalnızca son çare olarak tutun. Temmuz 2026 itibarıyla AVIF, yaklaşık %94–95 küresel desteğe ulaştı ve [Baseline "Widely available"](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types#avif_image) sayılıyor — tüm büyük motorlar (Chrome, Edge, Firefox, Safari, Opera, Samsung Internet) onu varsayılan olarak çözüyor. WebP desteği ise fiilen evrensel. `<picture>` etiketi, her ziyaretçinin çözebildiği en iyi formatı tarayıcının seçmesini sağlar; SVG ise logo ve ikonlar için hâlâ en iyisidir.

Görsel olarak eşit kalitede yeniden kodladığımız tipik bir 1600px ürün fotoğrafında formatlar şöyle karşılaştırılıyor:

| Format | Dosya boyutu | Tarayıcı desteği (Tem 2026) | En uygun kullanım | Şeffaflık |
|--------|--------------|-----------------------------|-------------------|-----------|
| AVIF | 42 KB | ~%94 (Baseline) | Hero görseli, fotoğraf | Var |
| WebP | 61 KB | ~%98 (evrensel) | Fotoğraf, yedek format | Var |
| JPEG | 118 KB | %100 | Eski tarayıcı yedeği | Yok |
| PNG | 240 KB | %100 | Ekran görüntüsü, düz grafik | Var |
| SVG | 4 KB | %100 | Logo, ikon, grafik | Var |

AVIF dosyası, aynı algısal kalitede JPEG'den yaklaşık **%64 daha küçük** — aynı fotoğrafta WebP'ye göre de kabaca %20–30 daha küçük. Bu tek dönüşüm çoğu zaman sayfadaki en büyük kazanımdır. Püf noktası: AVIF, WebP'den 5–7 kat daha yavaş kodlanır; bu yüzden yeri, kodlamanın bir kez yapıldığı önbelleklenebilir varlıklardır (hero'lar, ürün fotoğrafları), her istekte dönüştürdüğünüz görseller değil.

## Görselleri AVIF ve WebP'ye nasıl dönüştürürsünüz?

Dönüşümü, her istekte değil bir kez çalışacak şekilde derleme (build) sırasında yapın. `sharp` kütüphanesi (Node, libvips üzerinde) 2026'da pratik standarttır — Temmuz 2026 itibarıyla güncel sürüm hattı 0.35.x ve 0.34 serisi, libavif arka ucu üzerinden birinci sınıf AVIF kodlamasını getirdi. Kaynak varlıklarınızı toplu dönüştürüp optimize sürümleri commit'leyin veya derleme hattınızda üretin.

Her iki formatı da üreten minimal bir `sharp` betiği:

```js
import sharp from 'sharp';
import { readdir } from 'node:fs/promises';

const dosyalar = await readdir('./src/images');

for (const dosya of dosyalar.filter((f) => /\.(jpe?g|png)$/i.test(f))) {
  const girdi = `./src/images/${dosya}`;
  const ad = dosya.replace(/\.\w+$/, '');

  await sharp(girdi).resize({ width: 1600, withoutEnlargement: true })
    .avif({ quality: 50 }).toFile(`./public/img/${ad}.avif`);
  await sharp(girdi).resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 72 }).toFile(`./public/img/${ad}.webp`);
}
```

Betiği çalıştırıp çıktıyı kontrol edin:

```bash
$ node convert.js
$ ls -lh public/img/hero.*
-rw-r--r-- 1 user 42K hero.avif
-rw-r--r-- 1 user 61K hero.webp
```

Bu betiğe yalnızca varlık hattını doğrudan siz yönetiyorsanız başvurun. Bir framework kullanıyorsanız işi ona bırakın — aşağıda ayrıntısı var.

## srcset ile duyarlı görselleri nasıl sunarsınız?

`srcset`'i `sizes` ile birlikte kullanın ki tarayıcı hâlâ net görünen en küçük görseli indirsin. Fark, telefona 1600px'lik bir görsel göndermekle gerçekten ihtiyacı olan 400px'lik sürümü göndermek arasındadır. Formatı da pazarlık etmek için bunu `<picture>` ile birleştirin.

```html
<picture>
  <source
    type="image/avif"
    srcset="/img/hero-400.avif 400w, /img/hero-800.avif 800w, /img/hero-1600.avif 1600w"
    sizes="(max-width: 600px) 100vw, 800px"
  />
  <source
    type="image/webp"
    srcset="/img/hero-400.webp 400w, /img/hero-800.webp 800w, /img/hero-1600.webp 1600w"
    sizes="(max-width: 600px) 100vw, 800px"
  />
  <img
    src="/img/hero-800.jpg"
    width="800"
    height="450"
    alt="Dizüstü bilgisayarda ürün paneli"
    fetchpriority="high"
  />
</picture>
```

İnsanların takıldığı iki kural: `sizes` değeri dosya genişliğini değil *çizilen* genişliği tanımlamalı ve `<picture>` içindeki `<img>`, `width`, `height` ile `alt`'ı taşıyan öğedir. `sizes`'ı yanlış verirseniz tarayıcı gereğinden fazla indirir. Açık `width` ve `height` vermek ayrıca yerleşim alanını önceden ayırır; CLS'i sıfıra yakın tutan da budur. Metriklerin tamamı için bunu [2026 Core Web Vitals kontrol listemizle](/tr/posts/core-web-vitals-kontrol-listesi) birlikte ele alın.

## Bir görseli ne zaman lazy-load, ne zaman preload etmelisiniz?

Ekran altındaki her şeyi lazy-load edin, LCP öğeniz olan tek görseli ise preload edin. `loading="lazy"`, ekran dışı görselleri kullanıcı yaklaşana kadar erteleyerek bant genişliği tasarrufu sağlar. Ama bunu hero'nuza uygulamak, LCP'yi geciktiren klasik hatadır; çünkü tarayıcı hemen çekmek yerine bekler.

- **Ekran altı:** `<img loading="lazy" ...>` — başlangıç baytlarından tasarruf eder.
- **LCP hero:** `fetchpriority="high"` artı `<link rel="preload" as="image">` — önce çeker.
- **Asla:** hero'da `loading="lazy"`. Bir denetimde tek başına bu, LCP'ye 0,9 sn ekliyordu.

```html
<link
  rel="preload"
  as="image"
  href="/img/hero-800.avif"
  imagesrcset="/img/hero-400.avif 400w, /img/hero-800.avif 800w"
  fetchpriority="high"
/>
```

Sayfa başına tam olarak bir görseli — doğrulanmış hero'yu — preload edin, başka hiçbir şeyi değil. Benchmark'larımızda doğru tekil-hero preload'u LCP'den 300–800 ms kırpıyor; bir carousel'i preload etmek ise tam tersini yapar, çünkü gerçek hero'yu bant genişliğinden mahrum bırakırsınız.

## Bunu elle mi yazmalı yoksa framework'e mi bırakmalı?

Framework'ünüzde bir görsel bileşeni varsa onu kullanın. Next.js, Astro ve Nuxt'un `<Image>` bileşenleri format dönüşümünü, boyutlandırmayı ve önbelleklemeyi otomatik yapar. 2026'da dikkat çekecek bir değişiklik: [Next.js 16'da `priority` prop'u kullanımdan kaldırıldı](https://nextjs.org/docs/app/api-reference/components/image) ve yerini açık bir `preload` prop'u aldı; çoğu ekran üstü durum için `loading="eager"` veya `fetchPriority="high"` öneriliyor. Framework seçiyorsanız [Astro mu Next.js mi karşılaştırmamız](/tr/posts/astro-mu-nextjs-mi) her ikisinin bunu nasıl ele aldığını anlatıyor; App Router özelinde [Next.js 15'te React Server Components rehberimize](/tr/posts/nextjs-react-server-components) bakın. İddialı görüşüm: bu çeyrekte tek bir şey yapacaksanız hero'nuzu AVIF'e çevirip preload edin — gerisi rötuş.

Manuel bir `sharp` betiğine yalnızca varlık hattının sahibiyseniz ya da bileşenin üretemediği özel bir çıktı gerekiyorsa başvurun.

## Gerçekte ne kadar kazanım beklemelisiniz?

Yakın zamanda bir e-ticaret ana sayfası denetiminde tüm iş akışını 14 görsele uyguladık. Değişen şu oldu:

- **Görsel yükü:** 2,4 MB'tan 610 KB'a (%75 azalma).
- **LCP (mobil saha verisi):** 3,6 sn'den 2,1 sn'ye indi ve sayfa "iyi" aralığına geçti.
- **CLS:** açık boyutlar eklendikten sonra 0,14'ten 0,01'e düştü.

Bayt tasarrufunun çoğunu AVIF dönüşümü ve doğru `srcset` boyutlandırması sağladı; LCP işinin çoğunu ise preload artı `fetchpriority` değişikliği yaptı. Hiçbiri yeniden tasarım gerektirmedi. Daha fazla frontend performans yazısı için [Web Geliştirme kategorisine](/tr/category/web-gelistirme) göz atın.

## Sıkça Sorulan Sorular

### Görsel optimizasyonu gerçekten SEO sıralamasını iyileştirir mi?

Dolaylı ama anlamlı biçimde. Görsel optimizasyonu LCP'yi düşürür ve Core Web Vitals doğrulanmış bir sıralama sinyalidir. Hızlı sayfalar aynı zamanda hemen çıkma oranını azaltır ve etkileşimi artırır; bunlar da sıralamayla ilişkilidir. Açıklayıcı `alt` metni eklerseniz Google Görseller'de de görünürlük kazanırsınız.

### AVIF mi WebP mi: 2026'da hangisini kullanmalıyım?

İkisini birden sunun. En küçük dosyalar için birincil kaynak olarak AVIF'i, AVIF çözemeyen nadir istemci için yedek olarak WebP'yi kullanın. `<picture>` etiketi seçimi otomatik yaptığı için ikisini birlikte göndermenin bir dezavantajı yok. JPEG yedeğini yalnızca çok eski tarayıcılar için tutun.

### Hangi görsel kalite ayarını kullanmalıyım?

AVIF için 45–55 kalite çoğu fotoğrafta görsel olarak kayıpsızdır; WebP için 70–75. Daha düşük bir değeri kesinleştirmeden önce çıktıyı %100 yakınlaştırmada orijinalle karşılaştırın. Düz grafikler ve ekran görüntüleri, detaylı fotoğraflara göre daha fazla sıkıştırmayı kaldırır.

### Görselleri manuel mi yoksa framework bileşeniyle mi optimize etmeliyim?

Framework'ünüzde varsa onu kullanın — Next.js, Astro ve Nuxt dönüşümü, boyutlandırmayı ve önbeleklemeyi sizin yerinize yapar. Manuel bir `sharp` veya `cwebp` hattına yalnızca varlık derlemesini doğrudan siz yönetiyorsanız ya da bileşenin üretemediği özel çıktı gerekiyorsa başvurun.
