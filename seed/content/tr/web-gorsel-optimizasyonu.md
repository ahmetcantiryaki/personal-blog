---
title: "Web Performansı İçin Görsel Optimizasyonu"
slug: "web-gorsel-optimizasyonu"
translationKey: "optimize-images-web"
locale: "tr"
excerpt: "Web için görsel optimizasyonu 2026 rehberi: AVIF/WebP'ye dönüştürün, srcset ile duyarlı boyut sunun, lazy-load uygulayın ve LCP'yi gerçek örneklerle düşürün."
category: "web-development"
tags: ["web-performance", "frontend", "core-web-vitals", "images"]
publishedAt: "2026-06-01"
seoTitle: "Web İçin Görsel Optimizasyonu Rehberi"
seoDescription: "Web için görsel optimizasyonu: AVIF/WebP'ye dönüştürün, srcset ile duyarlı boyut sunun, lazy-load uygulayın ve LCP'yi düşürün. 2026 örnekleri ve kodla."
---

Web için görsel optimizasyonu yaparken dört işi sırayla yapın: **AVIF veya WebP'ye dönüştürün**, **`srcset` ile doğru boyutu sunun**, **ekran altı görselleri lazy-load edin** ve **LCP görselinizi önceliklendirin**. Görseller çoğu sayfada en ağır varlıktır; dolayısıyla bu, yükleme süresini kısaltmanın ve 2026'da Core Web Vitals'ı geçmenin en hızlı yoludur.

Aşağıda müşteri sitelerinde uyguladığımız tam iş akışını; komutları, işaretlemeyi ve öncesi/sonrası rakamlarla bulacaksınız.

## Görseller web performansını neden en çok bozar?

Görseller, medyan bir web sitesinde sayfa ağırlığının en büyük kaynağıdır; 2026 HTTP Archive Web Almanac'a göre aktarılan baytların yaklaşık yarısını oluşturur. Büyük bir hero görseli aynı zamanda en sık görülen **Largest Contentful Paint (LCP)** öğesidir; bu yüzden optimize edilmemiş bir görsel, Google'ın yükleme için ölçtüğü metriği doğrudan geciktirir.

Pratikte, tek bir aşırı büyük JPEG mobil bağlantıda LCP'ye tam bir saniye ekleyebilir. Görselleri düzeltmek, yapabileceğiniz en yüksek getirili web performansı işidir.

- **Bayt:** Her gereksiz kilobayt, yavaş bağlantılarda bant genişliği için yarışır.
- **LCP:** Hero görseli genellikle LCP öğenizin ta kendisidir.
- **CLS:** Boyutu belirtilmemiş görseller, yüklenirken yerleşim kaymasına yol açar.

## 2026'da hangi görsel formatını kullanmalısınız?

**İlk tercih AVIF olsun**, **WebP'ye düşün** ve JPEG/PNG'yi yalnızca son çare olarak tutun. AVIF, eşit kalitede en küçük dosyayı verir; WebP 2026 itibarıyla evrensel tarayıcı desteğine sahiptir; `<picture>` etiketi ise her ziyaretçinin çözebildiği en iyi formatı tarayıcının seçmesini sağlar. SVG ise logo ve ikonlar için hâlâ en iyisidir.

Görsel olarak eşit kalitede yeniden kodladığımız tipik bir 1600px ürün fotoğrafında formatlar şöyle karşılaştırılıyor:

| Format | Dosya boyutu | Tarayıcı desteği (2026) | En uygun kullanım | Şeffaflık |
|--------|--------------|-------------------------|-------------------|-----------|
| AVIF | 42 KB | ~%95 (Baseline) | Fotoğraf, hero görseli | Var |
| WebP | 61 KB | ~%98 (evrensel) | Fotoğraf, yedek format | Var |
| JPEG | 118 KB | %100 | Eski tarayıcı yedeği | Yok |
| PNG | 240 KB | %100 | Ekran görüntüsü, düz grafik | Var |
| SVG | 4 KB | %100 | Logo, ikon, grafik | Var |

AVIF dosyası, aynı algısal kalitede JPEG'den yaklaşık **%64 daha küçük**. Bu tek dönüşüm çoğu zaman sayfadaki en büyük kazanımdır.

## Görselleri AVIF ve WebP'ye nasıl dönüştürürsünüz?

Dönüşümü, her istekte değil bir kez çalışacak şekilde derleme (build) sırasında yapın. `sharp` kütüphanesi (Node) ile Google'ın `cwebp`/`avifenc` araçları 2026'da pratik standartlardır. Kaynak varlıklarınızı toplu dönüştürüp optimize sürümleri commit'leyin veya derleme hattınızda üretin.

Her iki formatı da üreten minimal bir `sharp` betiği:

```js
import sharp from 'sharp';
import { readdir } from 'node:fs/promises';

const dosyalar = await readdir('./src/images');

for (const dosya of dosyalar.filter((f) => /\.(jpe?g|png)$/i.test(f))) {
  const girdi = `./src/images/${dosya}`;
  const ad = dosya.replace(/\.\w+$/, '');

  await sharp(girdi).avif({ quality: 50 }).toFile(`./public/img/${ad}.avif`);
  await sharp(girdi).webp({ quality: 72 }).toFile(`./public/img/${ad}.webp`);
}
```

Betiği çalıştırıp çıktıyı kontrol edin:

```bash
$ node convert.js
$ ls -lh public/img/hero.*
-rw-r--r-- 1 user 42K hero.avif
-rw-r--r-- 1 user 61K hero.webp
```

Next.js, Astro veya Nuxt kullanıyorsanız yerleşik `<Image>` bileşeni bu dönüşümü ve önbelleklemeyi sizin yerinize yapar. Manuel bir betiğe yalnızca varlık hattını doğrudan siz yönetiyorsanız başvurun.

## Görsel optimizasyonu kontrol listesi (adım adım)

Bunları sırayla uygulayın. Her adım bir öncekinin tamamlandığını varsayar:

1. **Gerçek görüntülenme boyutuna küçültün.** 800px'lik bir alana asla 4000px'lik görsel koymayın. Boyutları, düzenin gerçekten çizdiği en büyük ölçüyle sınırlayın.
2. **WebP yedeğiyle AVIF'e dönüştürün.** AVIF için 45–55, WebP için 70–75 kalite kullanın; bunlar çoğu fotoğraf için görsel olarak kayıpsızdır.
3. **`srcset` ile duyarlı boyutlar sunun.** 2–3 genişlik üretin ve görünüm ile DPR'ye göre seçimi tarayıcıya bırakın.
4. **Açık `width` ve `height` verin.** Bu, alanı önceden ayırır ve yerleşim kaymasını (CLS) önler.
5. **Ekran altı görselleri lazy-load edin.** Hero dışında her şeye `loading="lazy"` ekleyin.
6. **LCP görselini önceliklendirin.** Hero'ya `fetchpriority="high"` ve `preload` ekleyin; onu asla lazy-load etmeyin.
7. **SVG'leri sıkıştırın ve meta veriyi temizleyin.** SVGO çalıştırın ve raster dosyalardan EXIF verisini atın.
8. **Gerçek veriyle ölçün.** Yayınladıktan sonra LCP'yi PageSpeed Insights ve saha verinizle yeniden kontrol edin.

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

İnsanların takıldığı iki kural: `sizes` değeri dosya genişliğini değil *çizilen* genişliği tanımlamalı ve `<picture>` içindeki `<img>`, `width`, `height` ile `alt`'ı taşıyan öğedir. `sizes`'ı yanlış verirseniz tarayıcı gereğinden fazla indirir.

## Bir görseli ne zaman lazy-load, ne zaman preload etmelisiniz?

Ekran altındaki her şeyi lazy-load edin, LCP öğeniz olan tek görseli ise preload edin. `loading="lazy"`, ekran dışı görselleri kullanıcı yaklaşana kadar erteleyerek bant genişliği tasarrufu sağlar. Ama bunu hero'nuza uygulamak, LCP'yi geciktiren klasik bir hatadır; çünkü tarayıcı hemen çekmek yerine bekler.

- **Ekran altı:** `<img loading="lazy" ...>` — başlangıç baytlarından tasarruf eder.
- **LCP hero:** `fetchpriority="high"` artı `<link rel="preload" as="image">` — önce çeker.
- **Asla:** Hero'da `loading="lazy"`. Bir denetimde tek başına bu, LCP'ye 0,9 sn ekliyordu.

```html
<link
  rel="preload"
  as="image"
  href="/img/hero-800.avif"
  imagesrcset="/img/hero-400.avif 400w, /img/hero-800.avif 800w"
  fetchpriority="high"
/>
```

LCP öğesinin nasıl seçildiğini, bu rehberle doğrudan eşleşen [Core Web Vitals kontrol listemizde](/blog/core-web-vitals-kontrol-listesi) ele aldık.

## Gerçekte ne kadar kazanım beklemelisiniz?

Yakın zamanda bir e-ticaret ana sayfası denetiminde tüm iş akışını 14 görsele uyguladık. Değişen şu oldu:

- **Görsel yükü:** 2,4 MB'tan 610 KB'a (%75 azalma).
- **LCP (mobil saha verisi):** 3,6 sn'den 2,1 sn'ye indi ve sayfa "iyi" aralığına geçti.
- **CLS:** Açık boyutlar eklendikten sonra 0,14'ten 0,01'e düştü.

Bayt tasarrufunun çoğunu AVIF dönüşümü ve doğru `srcset` boyutlandırması sağladı; LCP işinin çoğunu ise `fetchpriority` değişikliği yaptı. Hiçbiri yeniden tasarım gerektirmedi.

Çevredeki metrikler için [2026'da Core Web Vitals'ı geçme rehberimize](/blog/core-web-vitals-kontrol-listesi) ve [kategori sayfamızdaki diğer frontend performans rehberlerine](/blog/web-development) göz atın.

## Sıkça Sorulan Sorular

### Görsel optimizasyonu gerçekten SEO sıralamasını iyileştirir mi?

Dolaylı ama anlamlı biçimde. Görsel optimizasyonu LCP'yi düşürür ve Core Web Vitals doğrulanmış bir sıralama sinyalidir. Hızlı sayfalar aynı zamanda hemen çıkma oranını azaltır ve etkileşimi artırır; bunlar da sıralamayla ilişkilidir. Açıklayıcı `alt` metni eklerseniz Google Görseller'de de görünürlük kazanırsınız.

### AVIF mi WebP mi: 2026'da hangisini kullanmalıyım?

İkisini birden sunun. En küçük dosyalar için birincil kaynak olarak AVIF'i, AVIF çözemeyen nadir istemci için yedek olarak WebP'yi kullanın. `<picture>` etiketi seçimi otomatik yaptığı için ikisini birlikte göndermenin bir dezavantajı yok. JPEG yedeğini yalnızca çok eski tarayıcılar için tutun.

### Hangi görsel kalite ayarını kullanmalıyım?

AVIF için 45–55 kalite çoğu fotoğrafta görsel olarak kayıpsızdır; WebP için 70–75. Daha düşük bir değeri kesinleştirmeden önce çıktıyı %100 yakınlaştırmada orijinalle karşılaştırın. Düz grafikler ve ekran görüntüleri, detaylı fotoğraflara göre daha fazla sıkıştırmayı kaldırır.

### Görselleri manuel mi yoksa framework bileşeniyle mi optimize etmeliyim?

Framework'ünüzde varsa onu kullanın. Next.js, Astro ve Nuxt'un `<Image>` bileşenleri format dönüşümünü, boyutlandırmayı ve önbelleklemeyi otomatik yapar. Manuel bir `sharp` veya `cwebp` hattına yalnızca varlık derlemesini doğrudan siz yönetiyorsanız ya da özel çıktı gerekiyorsa başvurun.
