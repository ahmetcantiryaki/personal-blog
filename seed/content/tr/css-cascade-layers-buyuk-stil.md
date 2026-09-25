---
title: "CSS @layer: Büyük Stil Dosyalarını Evcilleştir"
slug: "css-cascade-layers-buyuk-stil"
translationKey: "css-cascade-layers-2026"
locale: "tr"
excerpt: "@layer, specificity savaşını sırayla değiştirir: bir katmandaki düşük specificity kural, daha sonra tanımlanan katmandaki yüksek specificity kuralı ezer."
category: "web-development"
tags: [css, frontend, tailwind, best-practices]
publishedAt: "2026-09-25"
seoTitle: "CSS @layer Nedir? Cascade Layers ile Specificity Savaşı"
seoDescription: "CSS @layer, kural sırasını specificity'nin önüne koyarak !important birikimini bitirir. Kurulum, üçüncü parti CSS entegrasyonu ve göç adımları burada."
---

Kısa cevap: `@layer`, CSS kurallarını adlandırılmış katmanlara ayırır ve katman sırası, o katman içindeki kuralların specificity'sinden önce gelir — yani sonradan tanımlanan bir katmandaki tek bir class (`.btn`), önceki bir katmandaki ID seçiciyi (`#header .nav .btn`) bile ezebilir. Bu, `!important` yığınının ana nedeni olan specificity savaşlarını sona erdiriyor.

## @layer'ın çözdüğü specificity sorunu tam olarak ne?

Klasik CSS'te kazanan kural, hangisinin daha "spesifik" seçiciye sahip olduğuna göre belirlenir — ID seçicileri class'ları, class'lar element seçicilerini ezer. Bir tasarım sistemi, bir utility kütüphanesi (Tailwind gibi) ve özel bileşen stilleri aynı sayfada bir arada olduğunda, hangisinin kazanacağı seçici karmaşıklığına bağlı hale geliyor — bu da geliştiricileri `!important` eklemeye veya seçiciyi yapay olarak ağırlaştırmaya (`.wrapper .wrapper .btn` gibi) zorluyor.

`@layer` bu mantığı tersine çeviriyor: katmanlar arasında specificity hiç karşılaştırılmıyor, sadece katman sırası bakılıyor. Aynı katman içinde specificity kuralları normal şekilde geçerli kalıyor — değişen şey yalnızca katmanlar arası önceliğin nasıl belirlendiği.

## Cascade layers gerçekte nasıl çalışıyor?

Katman sırası, ilk `@layer` bildirimiyle belirleniyor ve en son listelenen katman en yüksek önceliğe sahip oluyor — tıpkı geç gelen bir `<style>` etiketinin öncekini ezmesi gibi, ama dosya sırasından bağımsız olarak:

```css
@layer reset, framework, components, utilities;

@layer reset {
  * { margin: 0; padding: 0; }
}

@layer components {
  .btn { padding: 8px 16px; background: gray; }
}

@layer utilities {
  .bg-blue { background: blue; }
}
```

Bu örnekte `.bg-blue`, `.btn`'den daha düşük specificity'ye sahip olsa bile (ikisi de tek class), `utilities` katmanı `components`'ten sonra listelendiği için `class="btn bg-blue"` yazan bir elementte arka plan her zaman mavi olur. Katman sırası bir kez `@layer reset, framework, components, utilities;` satırıyla belirlendikten sonra, o katmanlara ait kod dosyanın herhangi bir yerinde, herhangi bir sırada yazılabilir — sonucu değiştirmez.

## Pratik bir katman kurulumu nasıl görünür?

Çoğu 2026 projesi için önerilen sıralama şu: reset, üçüncü parti (framework), bileşenler, utility'ler, override'lar. Bu sıralama, en genel kuraldan en özel geçersiz kılmaya doğru bir hiyerarşi kuruyor:

```css
@layer reset, vendor, components, utilities, overrides;

@import url("normalize.css") layer(reset);
@import url("some-vendor-lib.css") layer(vendor);

@layer components {
  .card { border-radius: 8px; box-shadow: 0 1px 3px rgb(0 0 0 / 0.1); }
}

@layer utilities {
  .rounded-none { border-radius: 0; }
}

@layer overrides {
  .legacy-widget .card { border-radius: 0; }
}
```

`@import` ile bir stil dosyasını doğrudan bir katmana atamak, üçüncü parti CSS'i kendi kodunuzla karışmadan izole etmenin en pratik yolu — vendor kütüphanesinin `!important` kullanan bir kuralı bile, `overrides` katmanındaki basit bir class tarafından ezilebiliyor.

| Katman | Amaç | Tipik içerik |
|---|---|---|
| `reset` | Tarayıcı varsayılanlarını sıfırla | `normalize.css`, `* { box-sizing }` |
| `vendor` | Üçüncü parti kütüphaneler | Bileşen kütüphanesi CSS'i |
| `components` | Uygulamaya özgü bileşenler | `.card`, `.modal`, `.btn` |
| `utilities` | Tek amaçlı yardımcı sınıflar | `.mt-4`, `.text-center` |
| `overrides` | Bilinçli, son söz kuralları | Sayfa/eski widget istisnaları |

## @layer, framework ve tasarım sistemleriyle nasıl entegre oluyor?

Tailwind CSS v4, dahili olarak `@layer` kullanıyor — `base`, `components` ve `utilities` katmanlarını kendi içinde tanımlıyor, bu yüzden Tailwind'in utility sınıfları sizin yazdığınız özel bileşen CSS'inizle specificity çatışmasına girmiyor; yalnızca katman sırasına bakılıyor. Bir tasarım sistemi entegre ederken en güvenli yaklaşım, o sistemin CSS'ini kendi adlandırılmış katmanına (`@layer design-system`) atamak — böylece sisteme ait hiçbir kural, sizin `overrides` katmanınızı asla ezemiyor.

## :where() ve unlayered (katmansız) stiller @layer ile nasıl etkileşiyor?

Herhangi bir `@layer` bloğunun dışında yazılan stil "katmansız" (unlayered) sayılır ve tüm adlandırılmış katmanlardan daha yüksek önceliğe sahiptir — bu, göç sürecinde eski kodun yanlışlıkla ezilmesini önleyen kritik bir detay, ama aynı zamanda sık yapılan bir hatanın da kaynağı: bir geliştirici yeni bir düzeltmeyi katmanların dışına yazarsa, o kural her zaman kazanır ve katman sistemi anlamsızlaşır.

`:where()` seçicisi ise specificity'yi sıfıra indiriyor; bir katman içinde `:where()` ile yazılmış bir kural, aynı katmandaki normal bir class tarafından bile ezilebiliyor. Bu, bir katman içinde "varsayılan ama kolayca geçersiz kılınabilir" kurallar yazmak için kullanışlı — özellikle bir tasarım sistemi kütüphanesi yazıyorsanız.

## Mevcut bir stylesheet'i @layer'a nasıl göç ettirirsiniz?

Bize göre en güvenli yol, tüm mevcut CSS'i tek bir `legacy` katmanına almak ve yeni kodu ayrı katmanlarda yazmaya başlamak — bu, hiçbir şeyi kırmadan kademeli bir geçiş sağlıyor:

```css
@layer legacy, components, utilities;

@layer legacy {
  /* mevcut, henüz refactor edilmemiş tüm CSS buraya */
}
```

`legacy` katmanı en başta listelendiği için en düşük önceliğe sahip oluyor — yeni `components` veya `utilities` kuralları, eski CSS'i specificity'sinden bağımsız olarak ezebiliyor. Zamanla `legacy` katmanındaki kod parça parça uygun katmanlara taşınabiliyor. Modern CSS'in diğer büyük kazanımı olan `:has()` ve native nesting'i [bu konudaki yazımızda](/tr/posts/modern-css-has-ic-ice-yazim) ayrıca ele aldık; ikisi birlikte, eskiden Sass'a ihtiyaç duyulan pek çok kalıbı artık saf CSS'te çözüyor.

## Karışık bir stylesheet'te dağınık kuralları nasıl bulursunuz?

Göç etmeden önce, hangi seçicilerin en yüksek specificity'ye sahip olduğunu ve kaç yerde `!important` kullanıldığını bilmeniz gerekiyor. Modern lint araçları bu taramayı otomatikleştiriyor; Rust tabanlı yeni nesil linter'lar, büyük CSS dosyalarında bu tür taramaları saniyeler içinde tamamlıyor. Bu araçları ESLint'e göre neden tercih edebileceğinizi [Biome ve Oxlint: Rust Tooling ESLint'in Yerini Alıyor yazımızda](/tr/posts/eslint-yerine-biome-ve-oxlint) ele aldık — aynı hız avantajı CSS analiz araçları için de geçerli.

## @layer bir framework projesine (Next.js, Astro) nasıl entegre edilir?

Kısa cevap: Global stylesheet'inizin en üstüne katman sırasını tanımlayıp, framework'ün kendi ürettiği CSS'i (varsa) `vendor` katmanına yönlendirerek. Next.js'in App Router'ı veya Astro'nun bileşen bazlı stil sistemi, üretilen CSS'i otomatik olarak bir `<style>` etiketine enjekte ediyor; bu enjekte edilen CSS'i `@layer` bloğunun dışında bırakırsanız, "unlayered" statüsü kazanır ve her katmandan daha yüksek önceliğe sahip olur — bu da genellikle istenmeyen bir sonuç. Bu yüzden framework seçimi yaparken CSS mimarisinin nasıl entegre olacağını da düşünmek gerekiyor; bu kararı [Astro mu Next.js mi yazımızda](/tr/posts/astro-mu-nextjs-mi) daha geniş bir çerçevede karşılaştırdık.

Pratikte en güvenli yol, framework'ün ürettiği stilleri build adımında bir PostCSS eklentisiyle otomatik olarak ilgili katmana sarmak — böylece geliştirici manuel olarak her bileşen dosyasına `@layer` eklemek zorunda kalmıyor.

Bu mimari, sesli giriş gibi dinamik durum sınıfları eklediğiniz arayüzlerde de işe yarıyor — bir `is-listening` veya `is-recording` class'ının stilini ayrı bir `state` katmanında tutmak, o class'ın sayfanın geri kalanındaki utility kurallarıyla çakışmasını önlüyor. Bu tür bir durum yönetimini [Web Speech API: Web Uygulamasına Sesli Giriş Ekle yazımızda](/tr/posts/web-speech-api-sesli-giris) pratik bir örnekle gösterdik.

Sonuç olarak, `@layer` bir "sihirli değnek" değil — specificity çatışmalarını ortadan kaldırıyor ama katman sırasını yanlış tasarlarsanız aynı karmaşayı katman düzeyinde yeniden yaratabilirsiniz. Katman sayısını az tutmak (beş katmandan fazlasına nadiren ihtiyaç duyulur) ve her katmanın tek bir sorumluluğu olmasını sağlamak, bu yeni aracın da eski specificity savaşına dönüşmesini önlüyor.

## Sıkça Sorulan Sorular

### @layer içindeki specificity kuralları geçersiz mi oluyor?

Kısa cevap: Hayır, yalnızca katmanlar arasında geçersiz. Aynı katman içinde ID, class ve element seçicileri arasındaki klasik specificity hiyerarşisi normal şekilde çalışmaya devam ediyor.

### @layer tüm modern tarayıcılarda destekleniyor mu?

Kısa cevap: Evet, 2026 itibarıyla Chrome 99+, Edge 99+, Firefox 97+, Safari 15.4+ ve Opera 86+ dahil %96'nın üzerinde küresel tarayıcı desteğine sahip; üretim kodunda güvenle kullanılabilir.

### Tailwind ile kendi @layer'ımı karıştırabilir miyim?

Kısa cevap: Evet — Tailwind v4 kendi `base`, `components` ve `utilities` katmanlarını tanımlıyor; kendi katmanlarınızı bu isimlerle çakıştırmadan, örneğin `@layer app-components` gibi ayrı bir isimle eklemeniz önerilir.

### @layer dışında yazılan bir stil ne olur?

Kısa cevap: "Katmansız" sayılır ve tüm adlandırılmış katmanlardan daha yüksek önceliğe sahip olur — bu yüzden göç sırasında yeni kuralları yanlışlıkla katmanların dışına yazmak, katman sisteminin tüm faydasını sıfırlar.

**Kaynaklar:** [MDN — @layer at-rule](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@layer), [Can I Use — CSS Cascade Layers](https://caniuse.com/css-cascade-layers), [CSS-Tricks — Cascade Layers Guide](https://css-tricks.com/css-cascade-layers/).
