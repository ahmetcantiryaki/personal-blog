---
title: "Kaçınmanız Gereken Tailwind CSS Hataları"
slug: "tailwind-css-hatalari"
translationKey: "tailwind-css-mistakes"
locale: "tr"
category: "web-development"
tags: ["css", "tailwind", "frontend"]
publishedAt: "2026-07-06"
excerpt: "2026'da hâlâ üretime giden Tailwind CSS hataları: dinamik class adlarından, v4.3'ün artık hazır sunduğu utility'leri elle yazmaya kadar, her biri için tam çözümüyle."
seoTitle: "Kaçınmanız Gereken Tailwind CSS Hataları (v4.3)"
seoDescription: "En sık yapılan Tailwind CSS hataları ve çözümleri: dinamik class'lar, @apply aşırı kullanımı, arbitrary değerler, ölü content dizileri ve v4.3 tuzakları."
---

Haziran 2026'da bir perşembe akşamı bir ekip fiyatlandırma sayfasını üretime aldı ve tüm çağrı butonları düz gri çıktı. Lokalde, staging'de, PR önizlemesinde butonlar marka mavisiydi. Üretimde ölüydü. Suçlu tek bir satırdı: `className={\`bg-${brand}-600\`}`. Önbelleğe alınmış lokal build, class'ı daha eski bir sabit sürümden taşıyordu; temiz üretim build'i o class'ı hiç üretmedi. Bir template literal, bozuk bir lansman ve çok uzun bir akşam.

Tailwind hatalarının olayı budur. Nadiren hata fırlatırlar. Sadece sessizce yanlış bir şeyi yayına alırlar. Aşağıda gerçek kod tabanlarında en sık düzelttiğimiz hatalar var; her biri için sorunu çözen tam kodla, hepsi Temmuz 2026 itibarıyla güncel stabil sürüm olan Tailwind CSS v4.3.2 için geçerli.

## En sık yapılan Tailwind CSS hataları nelerdir?

En sık yapılan Tailwind CSS hataları üç başlıkta toplanır: **tarayıcıyla savaşmak** (dinamik class adları, ölü algılama yapılandırması), **utility modelini terk etmek** (`@apply`'ı aşırı kullanmak, arbitrary değer çorbası, framework'ün zaten sunduğu utility'leri yeniden icat etmek) ve **v3 alışkanlıklarını v4'e taşımak** (JS öncelikli yapılandırma, artık hiçbir işe yaramayan manuel `content` dizileri). Liste, kod incelemesinde ekipleri en sık takılan sıraya göre dizildi.

### 1. Class adlarını string interpolation ile kurmak

Bir numaralı Tailwind CSS hatası budur; yukarıdaki ekibe akşamını kaybettiren de bu. Tailwind kaynağınızı **düz metin** olarak tarar; yani tam bir string olarak hiç görmediği bir class'ı asla üretmez. `bg-${color}-500` hiçbir şey üretmez.

```jsx
// Bozuk: Tailwind "bg-red-500"i asla tam bir literal olarak görmez
<div className={`bg-${color}-500`} />

// Düzeltilmiş: tam, statik class string'lerine eşleyin
const COLORS = {
  red: "bg-red-500",
  green: "bg-green-500",
  blue: "bg-blue-500",
};
<div className={COLORS[color]} />
```

Her class, kaynağınızın bir yerinde eksiksiz bir literal olsun. Gerçekten çalışma zamanı değeri gerektiğinde, oluşturulmuş bir utility adı yerine inline `style` veya bir CSS değişkeni kullanın.

### 2. `@apply`'ı aşırı kullanmak

`@apply`, tekrarın çözümü gibi hissettirir; ama her bileşeni `@apply flex items-center gap-2 rounded-lg ...` içine sarmak, stillerinizi tekrar bir stil dosyasına taşıyıp Tailwind'i benimseme sebebinizi çöpe atar. Dürüst görüşüm: 2026'da bir kod incelemesinde `@apply` dolu bir bileşen katmanı dosyası bir kalıp değil, kod kokusudur.

```css
/* Kaçının: her şey için elle yazılmış bir bileşen katmanı */
.btn {
  @apply inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white;
}
```

Class'larına kendi sahip olan gerçek bir bileşen tercih edin. React veya Vue'da bir `<Button>` çıkarın ve varyantları prop'lar yönetsin. `@apply`'ı yalnızca markup'ı kontrol edemediğiniz ender durumlar için saklayın; üçüncü parti HTML veya bir CMS'ten gelen metin gibi.

### 3. Varsayılan olarak arbitrary değerlere sarılmak

`w-[738px]` veya `text-[#3a3a3a]` gibi arbitrary değerler bir kaçış kapısıdır, bir iş akışı değil. Markup'ınızın yarısı köşeli parantez sözdizimi kullanıyorsa, kendi tasarım sisteminizden sessizce çıkmışsınız demektir ve her boşluk ile renk kararı, kimsenin denetleyemeyeceği tek seferlik bir seçime dönüşür.

```html
<!-- Ölçek dışı: birbirine yakın, ilgisiz üç değer -->
<div class="w-[738px] p-[19px] text-[#3a3a3a]">

<!-- Ölçekte: ekibinizin akıl yürütebileceği token'lar -->
<div class="w-[46rem] p-5 text-gray-700">
```

Bir değere tekrar tekrar ihtiyaç duyduğunuzda temanızı genişletin ve arbitrary değerleri gerçekten tek seferlik durumlara saklayın; bir hero görselinin sihirli-sayı yüksekliği gibi. Aynı parantez değerini iki kez yazdığınızı fark ederseniz, o değer `@theme`'e aittir.

### 4. v4'ün zaten sunduğu utility'leri elle yazmak

Bu hata 2026 için yeni ve her yerde. Tailwind, çoğu ekibin fark ettiğinden hızlı birinci parti utility ekledi; bu yüzden insanlar artık bir class'ı olan şeyler için hâlâ özel CSS yazıyor. [v4.1](https://tailwindcss.com/blog/tailwindcss-v4-1) bu `text-shadow-*` ve `mask-*` utility'leri demekti; 12 Haziran 2026'da çıkan [v4.3](https://tailwindcss.com/blog/tailwindcss-v4-3) ile birinci parti scrollbar stillendirmesi geldi.

```html
<!-- Eski alışkanlık: scrollbar için stil dosyasında özel CSS -->
<div class="custom-scroll">…</div>

<!-- v4.3: doğrudan markup'ta native utility'ler -->
<div class="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">…</div>
```

Bir eklenti veya tek seferlik stil dosyası yazmadan önce dokümanlarda utility'yi arayın. Metin gölgeleri, mask'ler, scrollbar'lar ve `@container-size` yükseklik duyarlı container query'leri artık yerleşik geliyor.

### 5. Hâlâ her şeyi JavaScript'te yapılandırmak

Tailwind v4, yapılandırmayı `@theme` direktifiyle CSS'e taşıdı ve `tailwind.config.js` artık varsayılan giriş noktası değil. Yükseltme yapıp devasa bir JS yapılandırmasını koruyan ekipler, v4'ün en büyük kazanımını kaçırır: Tailwind dışında da kullanılabilen, gerçek CSS değişkeni olan tasarım token'ları.

```css
/* app.css — v4 yolu */
@import "tailwindcss";

@theme {
  --color-brand: oklch(0.62 0.19 255);
  --font-display: "Inter", sans-serif;
  --spacing-gutter: 1.5rem;
}
```

Buradaki her token, düz CSS'te, inline stilde veya JS'te okuyabileceğiniz bir `--color-brand` değişkenine dönüşür. JS yapılandırmasını yalnızca hâlâ gerektiren eklentiler için tutun.

### 6. Hiçbir işe yaramayan bir `content` dizisini sürdürmek

v3'te tarayıcının nereye bakacağını bilmesi için her şablon yolunu `content: [...]` içinde listeliyordunuz. Tailwind v4 kaynağınızı otomatik algılar ve `.gitignore`'daki her şeyi yok sayar. Ekipler eski bir yapılandırmayı olduğu gibi taşır, ölü bir `content` dizisini düzenlemeye devam eder ve sonra safelist'lerinin neden tuhaf davrandığını merak eder.

Varsayılan algılamanın dışındaki bir dosyayı dahil etmeniz gerekirse (diyelim `node_modules` içindeki derlenmiş bir paket), açık kaynak direktifini kullanın:

```css
@import "tailwindcss";
@source "../node_modules/@acme/ui/dist";
```

Ölü diziyi silin ve yalnızca otomatik taramanın gerçekten kaçırdığı yollar için `@source` satırı ekleyin.

### 7. `outline-none` ile focus çerçevelerini yok etmek

"Çirkin" focus halkasını gizlemek için düğmelere ve inputlara `outline-none` yapıştırmak bir stil tercihi değil, erişilebilirlik gerilemesidir. Klavye kullanıcıları nerede olduklarına dair tüm hissi kaybeder ve siz bir WCAG ihlali yayına almış olursunuz. Bu, yaptığımız her frontend denetiminin en sık çıkan bulgusudur.

```html
<!-- Bozuk: klavye kullanıcıları için görünür focus yok -->
<button class="outline-none">Kaydet</button>

<!-- Düzeltilmiş: halkayı kaldırmayın, değiştirin -->
<button class="outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2">
  Kaydet
</button>
```

Varsayılan outline'ı kaldırıyorsanız, aynı anda görünür bir `focus-visible` durumu sağlayın. [Web erişilebilirlik kontrol listesi](/tr/posts/web-erisilebilirlik-kontrol-listesi) yazımız etkileşimli durum gereksinimlerinin tamamını kapsar.

### 8. Koşullu class'ları elle yeniden icat etmek

Class string'lerini template literal ve ternary ile birleştirmek hataya açıktır: çift boşluk alırsınız, `px-2 px-4` gibi çakışan utility'ler öngörülemez biçimde kazanır ve mantık okunamaz hale gelir. İki küçük kütüphane bunu temiz çözer. Temmuz 2026 itibarıyla `tailwind-merge`, Tailwind v4.0'dan v4.3'e kadar destekler (hâlâ v3'teyseniz v2.6.0 kullanın).

| Yaklaşım | Koşulları yönetir | Çakışmayı çözer | Karar |
|----------|-------------------|-----------------|-------|
| Template literal | Kötü | Hayır | Kaçının |
| `clsx` | Evet | Hayır | Basit toggle'lar için iyi |
| `tailwind-merge` | clsx ile | Evet | İkisini eşleyin |
| `clsx` + `tailwind-merge` | Evet | Evet | Bileşenler için en iyi |

```js
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs) => twMerge(clsx(inputs));
// cn("px-2", isWide && "px-4") -> "px-4", çakışma yok
```

İkisini tek bir `cn()` yardımcısında birleştirin ve koşullu class kurduğunuz her yerde kullanın. [shadcn/ui](https://ui.shadcn.com/docs/tailwind-v4) ekosistemi tam olarak bu yardımcıyı standart hâline getirdi.

## Aslında hangi Tailwind sürümündeyim?

Bu hataların yarısı esasında "v4 kod tabanında v3 alışkanlığı"; o yüzden sürümünüzü bilin. 2026'nın güncel tablosu şöyle.

| Sürüm | Çıkış | Öne çıkan özellik |
|-------|-------|-------------------|
| v4.0 | Oca 2026 | CSS öncelikli `@theme`, otomatik içerik algılama, 5x hızlı build |
| v4.1 | Nis 2026 | `text-shadow-*`, `mask-*`, renkli drop-shadow |
| v4.2 | Şub 2026 | Webpack eklentisi, yeni paletler, 3.8x hızlı yeniden derleme |
| v4.3 | Haz 2026 | Birinci parti scrollbar utility'leri, `@container-size`, yeni renkler |

[Resmi yükseltme rehberi](https://tailwindcss.com/docs/upgrade-guide), yapılandırma düzeyindeki tuzakların çoğunu otomatik yakalayan bir codemod çalıştırır.

## Hızlı bir commit öncesi kontrol listesi

Bir Tailwind değişikliğini push etmeden önce bunu gözden geçirin. Yukarıdaki hataların çoğunu bir dakikadan kısa sürede yakalar:

1. Hiçbir class adı string interpolation ile kurulmuyor.
2. `@apply` yalnızca markup'ı kontrol edemediğiniz yerlerde var.
3. Arbitrary `[...]` değerleri nadir ve gerçekten tek seferlik.
4. Özel CSS yazmadan önce native bir utility olup olmadığına baktınız.
5. Paylaşılan token'lar parantezlere serpiştirilmemiş, `@theme`'de.
6. v4 yapılandırmasında ölü bir `content` dizisi kalmamış.
7. Her `outline-none`'ın eşleşen bir `focus-visible` durumu var.
8. `prettier-plugin-tailwindcss` class listelerini otomatik sıralıyor.
9. Koşullu class'lar bir `cn()` yardımcısından geçiyor.

Daha geniş frontend resmi için bunu [CSS container queries kullanımı](/tr/posts/css-container-queries-kullanimi), [Core Web Vitals kontrol listesi](/tr/posts/core-web-vitals-kontrol-listesi) ve [React state yönetimi karşılaştırması](/tr/posts/react-state-yonetimi-karsilastirma) yazılarımızla birlikte okuyun ya da tüm [web geliştirme kategorisine](/tr/category/web-gelistirme) göz atın.

## Sıkça Sorulan Sorular

### Dinamik Tailwind class'larım neden üretimde çalışmıyor?

Çünkü Tailwind kaynağı düz metin olarak tarar ve yalnızca tam string olarak gördüğü class'ları üretir. `text-${size}` gibi interpolasyonlu bir ad asla tam bir literal değildir, bu yüzden hiçbir şey üretilmez. Değerlerinizi tam statik class string'lerine eşleyin ya da çalışma zamanında kurduğunuz class'ları safelist'e ekleyin.

### `@apply` Tailwind'de kötü bir pratik mi?

Doğası gereği değil ama aşırı kullanmak öyle. Her bileşen için `@apply`, stilleri tekrar stil dosyalarına iter ve Tailwind'i değerli kılan kolokasyon ile tutarlılığı çöpe atar. Varyantlar için prop'lu gerçek bileşenler kullanın ve `@apply`'ı CMS metni veya üçüncü parti widget'lar gibi düzenleyemediğiniz markup için saklayın.

### Tailwind v4'te hâlâ tailwind.config.js gerekli mi?

Genellikle hayır. v4, CSS'teki `@theme` direktifiyle yapılandırılır ve içeriğinizi otomatik algılar, bu yüzden JS yapılandırması isteğe bağlıdır. Yalnızca hâlâ gerektiren eklentiler için birini tutun; renk, font ve boşluk token'larınızı `@theme`'e taşıyın ki gerçek CSS değişkenlerine dönüşsünler.

### Tailwind CSS v4.3'te yeni olan ne?

12 Haziran 2026'da çıkan v4.3, birinci parti scrollbar utility'leri (`scrollbar-thin`, `scrollbar-thumb-*`, `scrollbar-track-*`, `scrollbar-gutter-*`), yükseklik duyarlı container query'ler için `@container-size` utility'si ve yeni renk paletleri ekliyor. En son yama olan v4.3.2, 29 Haziran 2026'da çıktı.
