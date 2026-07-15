---
title: "Tailwind CSS v4'e Geçiş Rehberi"
slug: "tailwind-css-v4-gecis-rehberi"
translationKey: "tailwind-v4-migration"
locale: "tr"
excerpt: "Tailwind CSS v4'e geçiş; CSS-first @theme yapılandırması, Rust tabanlı Oxide motoru ve yeniden adlandırılan sınıflar getirir. Sahadan notlar, kontrol listesi."
category: "web-development"
tags: ["tailwind", "css", "frontend", "developer-experience"]
publishedAt: "2026-07-15"
seoTitle: "Tailwind CSS v4'e Geçiş Rehberi: Sahadan Notlar"
seoDescription: "Tailwind CSS v4'e geçince ne değişir? CSS-first @theme, Rust tabanlı Oxide motoru, yeniden adlandırılan sınıflar, OKLCH paleti ve codemod'u sahadan anlatıyoruz."
---

Tailwind CSS v4'e geçince tailwind.config.js dosyasının yerini CSS içindeki @theme bloğu alır, derleme motoru Rust tabanlı Oxide'a döner, sık kullanılan birkaç utility sınıfı yeniden adlandırılır, varsayılan renk paleti OKLCH'ye taşınır ve modern tarayıcı desteği artık zorunlu hale gelir. Bu yazı, orta ölçekli bir üretim projesini Temmuz 2026'da v3'ten v4'e taşırken tuttuğum sahadan notlardır.

## @theme: CSS-first yapılandırma tailwind.config.js'in yerini alıyor

Tailwind v3'te tüm tema tanımı tailwind.config.js içinde bir JS objesiydi: renkler, spacing, font aileleri hepsi theme.extend altında yaşardı. Bu dosya büyüdükçe hem okunması hem de editörde otomatik tamamlama alması zorlaşıyordu. v4'te bu yapı doğrudan CSS'e taşındı: tema artık @theme bloğu içinde, CSS custom property'leri gibi tanımlanıyor. Eski PostCSS-plugin tabanlı JS-config akışı hâlâ çalışıyor olsa da yeni motor lehine kullanımdan kaldırılıyor.

Fark, kod üzerinde şöyle görünüyor:

```js
// tailwind.config.js (v3)
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: '#5b21b6',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
}
```

```css
/* app.css (v4) */
@import "tailwindcss";

@theme {
  --color-brand: #5b21b6;
  --font-sans: "Inter", sans-serif;
}
```

Pratikte en sevdiğim yan etki şu: tema değerleri artık gerçek CSS custom property'leri olduğu için tarayıcı devtools'unda doğrudan görünüyor ve inceleniyor. Ayrıca bu kısım için ayrı bir JS build adımına ihtiyaç kalmıyor; CSS dosyası tek gerçek kaynak oluyor.

## Oxide motoru: Rust ile daha hızlı build'ler

v4'ün altındaki Oxide motoru Rust'la yazıldı ve içerik taraması, class extraction ile CSS üretimini tek bir hatta birleştiriyor. [Tailwind'in resmi v4 duyurusu](https://tailwindcss.com/blog/tailwindcss-v4) bunu sıfırdan bir yeniden yazım olarak tanımlıyor. Paylaşılan sayılar geniş bir aralıkta: temiz cold build'ler yaklaşık 2-5 kat hızlanıyor, bir örnekte 600ms'den 120ms'ye düşüş bildiriliyor; incremental rebuild'lerde bazı senaryolarda 100 katın üzerinde hızlanma rapor ediliyor. Kendi projemde gördüğüm daha muhafazakâr rakam, bu geniş aralığın alt ucuna denk düşen **%60-80 daha hızlı cold build**; tam sayı projenin içerik hacmine ve dosya sayısına göre değişiyor.

Watch modundaki fark daha da çarpıcı: küçük bir sınıf değişikliğinden sonra tarayıcıda yenilenen stil artık neredeyse anlık hissettiriyor. Orta ölçekli bir Next.js projesinde (~40 route, birkaç yüz bileşen) bu, geliştirme döngüsünü fiilen kısaltan az sayıda güncellemeden biriydi.

## Yeniden adlandırılan utility'ler nelerdir?

Migrasyonda en çok kırılan yer, isim değiştiren utility sınıflarıydı. En sık karşılaştığım üçü:

| v3 sınıfı | v4 sınıfı | Not |
|---|---|---|
| `bg-gradient-to-r` | `bg-linear-to-r` | Gradient utility'leri artık "linear" önekiyle |
| `flex-shrink-0` | `shrink-0` | `flex-` öneki kaldırıldı |
| `flex-grow` | `grow` | `flex-` öneki kaldırıldı |

Eski isimler bir süre alias olarak da çalışabiliyor ama kod tabanında ikisinin karışık kullanılması, tam olarak [Tailwind CSS hataları](/tr/posts/tailwind-css-hatalari) yazımızda saydığımız türden tutarsızlık tuzaklarından biri. Migrasyon sırasında eski ve yeni isimleri aynı PR'da bırakmamaya özellikle dikkat edin.

## OKLCH: varsayılan renk paleti neden değişti

v4'te varsayılan renk paleti RGB/sRGB'den OKLCH'ye taşındı ve destekleyen ekranlarda daha geniş P3 renk uzayını kullanıyor. Tailwind ekibi görsel dengeyi v3'e kasıtlı olarak yakın tutmuş; yani bu köklü bir yeniden tasarım değil. blue-500 gibi tanıdık bir sınıf, P3 destekli bir ekranda biraz daha canlı render olabilir ama genel his ve kontrast oranları büyük ölçüde aynı kalıyor. Marka renklerinizi custom @theme değerleriyle tanımlıyorsanız bu değişiklik sizi hiç etkilemeyebilir; yalnızca varsayılan paleti (slate, blue, emerald gibi) kullanan projelerde fark edilir düzeyde.

## Native @layer cascade ne getiriyor

v4 artık base, components ve utilities katmanlarını tarayıcının yerli CSS cascade layers özelliğine dayandırıyor; Tailwind'in kendi post-processing hilesine değil. Bunun somut faydası, üçüncü parti bir component kütüphanesinin (ör. bir tarih seçici veya harita widget'ı) stilini ezmek için artık daha az `!important` gerekmesi: cascade sırası artık tarayıcının kendisi tarafından, öngörülebilir biçimde yönetiliyor. Bu, modern CSS özelliklerine dayanan diğer yeniliklerle aynı yöndeki bir gelişme; ilgileniyorsanız [CSS container queries kullanımı](/tr/posts/css-container-queries-kullanimi) yazımız benzer bir tarayıcı-yerli yaklaşımı ele alıyor.

## @tailwindcss/upgrade codemod'unu çalıştırmak

Migrasyonun büyük kısmını elle yapmıyorsunuz; resmi codemod bağımlılık güncellemesini, JS config'in CSS'e taşınmasını ve HTML/JSX/TSX/Vue/Astro/CSS dosyalarındaki yeniden adlandırılmış sınıfların büyük çoğunluğunu (bildirilen oran %90'ın üzerinde) otomatik hallediyor:

```bash
npx @tailwindcss/upgrade
```

[Resmi geçiş rehberi](https://tailwindcss.com/docs/upgrade-guide) adım adım süreci ve bilinen kenar durumlarını anlatıyor; [botmonster'ın pratik özeti](https://botmonster.com/web-dev/tailwind-css-v4-what-changed-how-to-migrate/) de gerçek projelerde karşılaşılan tuzakları iyi topluyor. Codemod her şeyi çözmüyor: custom plugin'ler, karmaşık safelist tanımları ve dinamik olarak üretilen sınıf isimleri hâlâ manuel gözden geçirme istiyor. Değişiklik seti büyük çıkacağı için PR'ı mantıklı parçalara bölmek işe yarıyor; büyük diff'leri gözden geçirme taktikleri için [etkili kod incelemesi](/tr/posts/etkili-kod-incelemesi) rehberimize bakabilirsiniz.

Açık görüşüm: v4'e geçişi ilk hafta içinde bitirmeye çalışmak çoğu ekip için gereksiz bir risk. Codemod işin %90'ını hallediyor ama geri kalan %10 (custom plugin'ler, gerçekten karmaşık config'ler) ciddi zaman yiyor. Yeni projelerde v4'ü baştan varsayılan yapın; büyük ve aktif geliştirilen mevcut bir üründe ise migrasyonu acil bir yama gibi değil, sakin bir sprintte planlı bir iş kalemi olarak ele alın.

## Migrasyon kontrol listesi

- [ ] Node ve paket yöneticisi sürümünü güncel tutun; `npx @tailwindcss/upgrade` komutunu çalıştırın.
- [ ] tailwind.config.js'teki theme.extend içeriğinin @theme bloğuna doğru taşındığını manuel doğrulayın.
- [ ] Codemod'un değiştirdiği yeniden adlandırılmış sınıfları (`bg-linear-to-*`, `shrink-0`, `grow` vb.) diff üzerinden gözden geçirin.
- [ ] Custom plugin'leri ve karmaşık safelist tanımlarını tek tek test edin; codemod bunları otomatik taşımaz.
- [ ] Marka renklerinizi ve varsayılan OKLCH paletini kritik ekranlarda (checkout, dashboard) görsel olarak karşılaştırın.
- [ ] CI'da görsel regresyon testi veya en azından temel sayfaların ekran görüntüsü karşılaştırmasını çalıştırın.
- [ ] Hedef kitlenizin tarayıcı dağılımını (analytics) kontrol edin; Safari 16.4, Chrome 111, Firefox 128 altı payı ölçün.
- [ ] Migrasyon PR'ını küçük, incelenebilir parçalara bölün ve en az bir kişiye ayrıntılı gözden geçirtin.

## Eski tarayıcı hedefleyen ekipler için rollback notu

v4, `@property` ve `color-mix()` gibi modern CSS özelliklerine dayanıyor; bu yüzden yalnızca güncel tarayıcıları hedefliyor: Safari 16.4+, Chrome 111+, Firefox 128+. Kurumsal bir intranet, eski Android WebView'lar veya büyük bir kamu kurumu müşteri kitleniz varsa ve bu sürümlerin altında ciddi bir trafik payı görüyorsanız, v4'e şimdi geçmeyin. v3.4 hâlâ bakımda ve production için güvenli bir seçenek; migrasyonu, eski tarayıcı payı kabul edilebilir bir eşiğin altına düşene kadar erteleyin. Yarı yolda kalıp iki config'i birden desteklemeye çalışmak, tek başına v3'te kalmaktan daha maliyetli.

## Sıkça Sorulan Sorular

### Tailwind v3 ile v4 aynı projede bir arada kullanılabilir mi?

Kısa vadede, geçiş sürecinde evet, bazı ekipler modülleri sırayla taşır. Ama uzun vadede iki config sistemini (JS-based ve CSS-first) aynı anda tutmak karmaşıklığı artırır. Migrasyonu mümkün olduğunca kısa bir zaman penceresinde tamamlamak, kalıcı bir hibrit yapıdan daha sağlıklı.

### Codemod her şeyi otomatik hallediyor mu?

Hayır. Bağımlılık güncellemesini, config taşımasını ve yeniden adlandırılmış sınıfların büyük çoğunluğunu (raporlanan oran %90'ın üzerinde) otomatik yapıyor, ama custom plugin'ler, karmaşık safelist'ler ve dinamik olarak string birleştirmeyle üretilen sınıf isimleri manuel gözden geçirme gerektiriyor.

### v4'e geçmek SEO veya performansı etkiler mi?

Doğrudan SEO'yu etkilemez ama daha hızlı build'ler geliştirme döngüsünü kısaltır ve daha küçük, daha temiz CSS çıktısı sayfa ağırlığına dolaylı katkı sağlayabilir. Asıl performans kazancı geliştirici deneyiminde; kullanıcıya giden CSS boyutunda büyük bir fark beklemeyin.

### v3.4 ne zaman desteklenmeyi bırakacak?

Şu an için v3.4 bakımda kalan bir sürüm; resmi bir son kullanma tarihi ilan edilmiş değil. Yine de yeni özellikler artık v4 hattına gidiyor, bu yüzden eski tarayıcı kısıtınız ortadan kalktığında geçişi çok uzun süre ertelememek mantıklı.
