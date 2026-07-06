---
title: "Kaçınmanız Gereken Tailwind CSS Hataları"
slug: "tailwind-css-hatalari"
translationKey: "tailwind-css-mistakes"
locale: "tr"
excerpt: "2026'da hâlâ karşımıza çıkan sekiz Tailwind CSS hatası: dinamik class adlarından @apply'ı aşırı kullanmaya kadar, her biri için Tailwind v4 çözümüyle."
category: "web-development"
tags: ["css", "tailwind", "frontend"]
publishedAt: "2026-06-20"
seoTitle: "Kaçınmanız Gereken Tailwind CSS Hataları (2026)"
seoDescription: "En sık yapılan Tailwind CSS hataları ve çözümleri: dinamik class'lar, @apply aşırı kullanımı, arbitrary değerler ve v4 tuzakları. 2026 için gerçek kod örnekleri."
---

En sık yapılan Tailwind CSS hataları; class adlarını string interpolation ile kurmak, CSS'iniz yeniden 2015'e benzeyene kadar `@apply`'a yaslanmak ve tasarım sisteminizi sessizce bozan arbitrary değerleri her yere serpiştirmektir. Aşağıdaki her hatayı gerçek üretim uygulamalarında bizzat düzelttik ve her biri için sorunu çözen tam kodu verdik. Bunları temizlerseniz Tailwind bundle'ınız küçülür, markup'ınız tutarlı kalır ve sürüm yükseltmeleri canınızı yakmayı bırakır.

Bunlar, 2026'nın güncel ana sürümü Tailwind CSS v4 için geçerli; yani CSS öncelikli `@theme` yapılandırması ve otomatik içerik algılamayla. Tavsiyelerin çoğu v3'e de uyar ama birkaç tuzak, alışkanlıklarını değiştirmeden yükseltme yapan ekiplere özeldir.

## En sık yapılan Tailwind CSS hataları nelerdir?

En sık yapılan Tailwind CSS hataları üç başlıkta toplanır: **JIT motoruyla savaşmak** (dinamik class adları, algılama eksiği), **utility modelini terk etmek** (`@apply`'ı aşırı kullanmak, arbitrary değer çorbası) ve **v3 alışkanlıklarını v4'e taşımak** (JS öncelikli yapılandırma, artık hiçbir işe yaramayan manuel `content` dizileri). Aşağıdaki liste, kod incelemesinde ekipleri en sık takılan sıraya göre dizildi.

### 1. Class adlarını string interpolation ile kurmak

Bir numaralı Tailwind CSS hatası budur. Tailwind kaynağınızı **düz metin** olarak tarar; yani tam bir string olarak hiç görmediği bir class'ı asla üretmez. `bg-${color}-500` hiçbir şey üretmez ve öğe üretimde stilsiz görünür; oysa önbelleğe alınmış bir build ile lokalde sorunsuz görünüyordu.

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

`@apply`, tekrarın çözümü gibi hissettirir; ama her bileşeni `@apply flex items-center gap-2 rounded-lg ...` içine sarmak, stillerinizi tekrar bir stil dosyasına taşıyıp Tailwind'i benimseme sebebinizi çöpe atar. Kolokasyonu kaybedersiniz, niyeti markup'tan okuma yeteneğinizi kaybedersiniz ve utility'lerin çözmesi gereken specificity sorunlarını yeniden inşa edersiniz.

```css
/* Kaçının: her şey için elle yazılmış bir bileşen katmanı */
.btn {
  @apply inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white;
}
```

Class'larına kendi sahip olan gerçek bir bileşen tercih edin. React veya Vue'da bir `<Button>` çıkarın ve varyantları prop'lar yönetsin. `@apply`'ı yalnızca markup'ı kontrol edemediğiniz ender durumlar için saklayın; örneğin üçüncü parti HTML veya bir CMS'ten gelen metin.

### 3. Varsayılan olarak arbitrary değerlere sarılmak

`w-[738px]` veya `text-[#3a3a3a]` gibi arbitrary değerler bir kaçış kapısıdır, bir iş akışı değil. Markup'ınızın yarısı köşeli parantez sözdizimi kullanıyorsa, kendi tasarım sisteminizden sessizce çıkmışsınız demektir ve her boşluk ile renk kararı, kimsenin denetleyemeyeceği tek seferlik bir seçime dönüşür.

```html
<!-- Ölçek dışı: birbirine yakın, ilgisiz üç değer -->
<div class="w-[738px] p-[19px] text-[#3a3a3a]">

<!-- Ölçekte: ekibinizin akıl yürütebileceği token'lar -->
<div class="w-[46rem] p-5 text-gray-700">
```

Bir değere tekrar tekrar ihtiyaç duyduğunuzda temanızı genişletin ve arbitrary değerleri gerçekten tek seferlik durumlara saklayın; örneğin bir hero görselinin sihirli-sayı yüksekliği. Aynı parantez değerini iki kez yazdığınızı fark ederseniz, o değer `@theme`'e aittir.

### 4. v4'te hâlâ her şeyi JavaScript'te yapılandırmak

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

Buradaki her token, düz CSS'te, inline stilde veya JS'te okuyabileceğiniz bir `--color-brand` değişkenine dönüşür. JS yapılandırmasını yalnızca hâlâ gerektiren eklentiler için tutun ve paletinizi ile boşluk ölçeğinizi `@theme`'e taşıyın.

### 5. Hiçbir işe yaramayan bir `content` dizisini elle sürdürmek

v3'te tarayıcının nereye bakacağını bilmesi için her şablon yolunu `content: [...]` içinde listeliyordunuz. Tailwind v4 kaynak dosyalarınızı otomatik algılar ve `.gitignore`'daki her şeyi yok sayar. Ekipler eski bir yapılandırmayı olduğu gibi taşır, yeni motorun artık okumadığı bir `content` dizisini düzenlemeye devam eder ve sonra safelist'lerinin neden tuhaf davrandığını merak eder.

Varsayılan algılamanın dışındaki bir dosyayı dahil etmeniz gerekirse (diyelim `node_modules` içindeki derlenmiş bir paket), bunun yerine açık kaynak direktifini kullanın:

```css
@import "tailwindcss";
@source "../node_modules/@acme/ui/dist";
```

Ölü `content` dizisini silin ve yalnızca otomatik taramanın gerçekten kaçırdığı yollar için `@source` satırı ekleyin.

### 6. `outline-none` ile focus çerçevelerini yok etmek

"Çirkin" focus halkasını gizlemek için düğmelere ve inputlara `outline-none` yapıştırmak bir stil tercihi değil, erişilebilirlik gerilemesidir. Klavye kullanıcıları nerede olduklarına dair tüm hissi kaybeder ve siz bir WCAG ihlali yayına almış olursunuz. Bu, yaptığımız her frontend denetiminin en sık çıkan bulgusudur.

```html
<!-- Bozuk: klavye kullanıcıları için görünür focus yok -->
<button class="outline-none">Kaydet</button>

<!-- Düzeltilmiş: halkayı kaldırmayın, değiştirin -->
<button class="outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2">
  Kaydet
</button>
```

Varsayılan outline'ı kaldırıyorsanız, aynı anda görünür bir `focus-visible` durumu sağlamak zorundasınız. Etkileşimli durum gereksinimlerinin tamamı için [web erişilebilirlik kontrol listesi](/blog/web-erisilebilirlik-kontrol-listesi) yazımıza bakın.

### 7. Sıralanmamış, biçimlenmemiş class string'leri yayına almak

Rastgele sırada 30 utility içeren bir class attribute'u okunamaz ve iki geliştirici aynı class'ları iki farklı şekilde sıralayıp gürültülü diff'ler ve sürekli merge çakışmaları üretir. Çözüm disiplin değil, otomasyondur.

Resmi Prettier eklentisini kurun ve her class listesini deterministik biçimde sıralamasına izin verin:

```bash
npm install -D prettier prettier-plugin-tailwindcss
```

```json
// .prettierrc
{ "plugins": ["prettier-plugin-tailwindcss"] }
```

Artık `flex`, layout, boşluk, renk ve durum utility'leri hep aynı sırada gelir, incelemeler sakinleşir ve kimse class sıralamasını tartışmaz.

### 8. Koşullu class'ları elle yeniden icat etmek

Class string'lerini template literal ve ternary ile birleştirmek hataya açıktır: çift boşluk alırsınız, `px-2 px-4` gibi çakışan utility'ler öngörülemez biçimde kazanır ve mantık okunamaz hale gelir. İki küçük kütüphane bunu temiz biçimde çözer.

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

İkisini tek bir `cn()` yardımcı fonksiyonunda birleştirin ve koşullu class kurduğunuz her yerde kullanın.

## Hızlı bir commit öncesi kontrol listesi

Bir Tailwind değişikliğini push etmeden önce bunu gözden geçirin. Yukarıdaki hataların çoğunu bir dakikadan kısa sürede yakalar:

1. Hiçbir class adı string interpolation ile kurulmuyor.
2. `@apply` yalnızca markup'ı kontrol edemediğiniz yerlerde var.
3. Arbitrary `[...]` değerleri nadir ve gerçekten tek seferlik.
4. Paylaşılan token'lar parantezlere serpiştirilmemiş, `@theme`'de.
5. v4 yapılandırmasında ölü bir `content` dizisi kalmamış.
6. Her `outline-none`'ın eşleşen bir `focus-visible` durumu var.
7. `prettier-plugin-tailwindcss` class listelerini otomatik sıralıyor.
8. Koşullu class'lar bir `cn()` yardımcısından geçiyor.

Daha geniş frontend resmi için bunu [CSS container queries kullanımı](/blog/css-container-queries-kullanimi) ve [Core Web Vitals kontrol listesi](/blog/core-web-vitals-kontrol-listesi) yazılarımızla birlikte okuyun ve ilgili derinlemesine içerikler için tüm web geliştirme kategorimize göz atın.

## Sıkça Sorulan Sorular

### Dinamik Tailwind class'larım neden üretimde çalışmıyor?

Çünkü Tailwind kaynağı düz metin olarak tarar ve yalnızca tam string olarak gördüğü class'ları üretir. `text-${size}` gibi interpolasyonlu bir ad asla tam bir literal değildir, bu yüzden hiçbir şey üretilmez. Değerlerinizi tam statik class string'lerine eşleyin ya da çalışma zamanında kurduğunuz class'ları safelist'e ekleyin.

### `@apply` Tailwind'de kötü bir pratik mi?

Doğası gereği değil ama aşırı kullanmak öyle. Her bileşen için `@apply`, stilleri tekrar stil dosyalarına iter ve Tailwind'i değerli kılan kolokasyon ile tutarlılığı çöpe atar. Varyantlar için prop'lu gerçek bileşenler kullanın ve `@apply`'ı CMS metni veya üçüncü parti widget'lar gibi düzenleyemediğiniz markup için saklayın.

### Tailwind v4'te hâlâ tailwind.config.js gerekli mi?

Genellikle hayır. v4, CSS'teki `@theme` direktifiyle yapılandırılır ve içeriğinizi otomatik algılar, bu yüzden JS yapılandırması isteğe bağlıdır. Yalnızca hâlâ gerektiren eklentiler için birini tutun; renk, font ve boşluk token'larınızı `@theme`'e taşıyın ki gerçek CSS değişkenlerine dönüşsünler.

### Koşullu Tailwind class'larını güvenle nasıl birleştiririm?

Listeyi koşullardan kurmak için `clsx`, çakışmaları çözmek için `tailwind-merge` kullanın ve ikisini tek bir `cn()` yardımcısında sarın. Bu, `px-2` ve `px-4` gibi utility'ler çakıştığında çift boşlukları ve öngörülemez kazananları önler, bileşen varyant mantığını okunur tutar.
