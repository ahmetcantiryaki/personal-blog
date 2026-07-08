---
title: "Frontend'de Signals: Nedir, Ne Zaman?"
slug: "frontend-signals-nedir"
translationKey: "frontend-signals-explained"
locale: "tr"
excerpt: "Signals, virtual DOM diffing yerine yalnızca değişen değeri güncelleyen ince taneli bir reaktivite modeli; Solid, Angular, Preact ve Svelte 5 nasıl kullanıyor?"
category: "web-development"
tags: ["frontend", "react", "performance", "state-management"]
publishedAt: "2026-07-08"
seoTitle: "Frontend'de Signals Nedir? 2026 Rehberi"
seoDescription: "Signals nedir, virtual DOM diffing'den nasıl farklıdır? Solid.js, Angular, Preact ve Svelte 5 runes karşılaştırmasıyla fine-grained reaktivite rehberi."
---

Frontend'de signals, bir state değiştiğinde bileşenin tamamını yeniden çalıştırıp sonucu eski ağaçla karşılaştırmak yerine, yalnızca o değere gerçekten bağlı olan tekil DOM düğümünü güncelleyen ince taneli (fine-grained) bir reaktivite ilkesidir. Temmuz 2026 itibarıyla React dışındaki neredeyse tüm büyük framework'ler — Solid.js, Angular, Preact ve Svelte 5 — state modelini bu ilke üzerine kurdu, çünkü aynı güncelleme kesinliğini virtual DOM diffing'in maliyeti olmadan sağlıyor.

## Virtual DOM diffing hangi sorunu çözüyordu?

React'in 2013'teki asıl vaadi şuydu: arayüzü elle DOM'a dokunarak değil, state'in bir fonksiyonu olarak tanımlayın; framework aradaki farkı halletsin. Bunun için her state değişiminde bileşen fonksiyonu yeniden çalışır, yeni bir sanal ağaç üretilir, bu ağaç bir önceki sürümle karşılaştırılır (diffing) ve yalnızca fark bulunan yerler gerçek DOM'a yazılır. Bu, elle DOM güncellemenin kırılganlığını çözdü ama yeni bir maliyet getirdi: tek bir sayaç bir birim arttığında bile, o sayacı içeren bileşen — ve genellikle onun tüm alt ağacı — yeniden çalışır. Diffing algoritması hızlıdır ama yine de iş yapar; gerçek maliyet, aslında değişmeyen yüzlerce alt bileşenin gereksiz yere yeniden render edilmesidir. React ekibi bunu `useMemo`, `useCallback` ve `React.memo` ile geçiştirmenizi ister, ki bu da başlı başına bir bilişsel yük hâline gelir.

## Signals vs virtual DOM diffing: iki farklı reaktivite modeli

Virtual DOM diffing "pull" tabanlıdır: state değişir, bileşen yeniden çalışır, framework sonucu eski ağaçla karşılaştırıp farkı çıkarır. Signals ise "push" tabanlıdır: bir signal, kendisini kimin okuduğunu baştan bilir. `count` adlı bir signal'i bir metin düğümünde kullandığınızda, framework bu bağı derleme zamanında ya da ilk çalıştırmada kaydeder. Signal değiştiğinde diffing'e gerek kalmaz, çünkü hangi düğümün güncellenmesi gerektiği zaten bellidir. Solid.js'te bu, [resmi Solid dokümantasyonunun da vurguladığı gibi](https://docs.solidjs.com/concepts/signals), bileşen fonksiyonunun yalnızca bir kez çalışması anlamına gelir; "yeniden render" kavramı neredeyse ortadan kalkar.

## Fine-grained reaktivite neden daha az ve daha küçük re-render demek?

Bileşen yeniden çalışmadığı için `memo`/`useCallback` dansına da gerek kalmaz — güncelleme zaten yalnızca değişen ifadeye taşınır. Solid.js ile React'i karşılaştıran bağımsız kıyaslamalar, liste ağırlıklı senaryolarda DOM mutasyon sayısının kat kat düştüğünü gösteriyor: React'in on binlerce düğüm güncellemesi yaptığı bir tabloda, signal tabanlı bir yaklaşım yalnızca gerçekten değişen hücrelere dokunuyor. Bunun nedeni basit: güncelleme maliyeti artık bileşen ağacının büyüklüğüyle değil, gerçekte değişen şeyin sayısıyla orantılı. Yine de bu kazanç her yerde hissedilmez — birazdan buna döneceğiz.

## Solid.js, Angular, Preact ve Svelte 5 runes nasıl karşılaştırılır?

Dördü de "signal" kelimesini kullanıyor ama API şekli ve mevcut kalıplarla uyumu oldukça farklı:

| Framework | API şekli | Reaktivite düzeyi | Mevcut kalıplarla uyum |
|---|---|---|---|
| Solid.js | `createSignal`, `createMemo`, `createEffect` | Tamamen ince taneli; virtual DOM yok, bileşen bir kez çalışır | JSX'e derinden gömülü; hooks'a benzer ama farklı çalışır |
| Angular | `signal()`, `computed()`, `effect()` | Opt-in ince taneli; zone.js tabanlı değişiklik algılamanın yerini alıyor | Şablon bağlamada otomatik iz sürer; RxJS ile birlikte yaşar |
| Preact Signals | `signal()`, `computed()`, `.value` erişimi | Opt-in; yalnızca `.value` okunan yerler abone olur | Hooks'la yan yana kullanılabilir; `@preact/signals-react` ile React'e de taşınır |
| Svelte 5 (runes) | `$state`, `$derived`, `$effect` | Derleyici tarafından üretilen ince taneli güncellemeler | Svelte 3/4'ün örtük reaktivitesinin yerini aldı; `.svelte.js` dosyalarında da çalışır |

[Angular'ın resmi signals rehberi](https://angular.dev/guide/signals), bunun zone.js tabanlı değişiklik algılamayı kademeli olarak geçersiz kılmayı hedeflediğini açıkça belirtiyor. [Preact'in signals kılavuzu](https://preactjs.com/guide/v10/signals/) ise bir signal'i prop olarak aşağı geçirdiğinizde, bileşenin kendisini değil yalnızca referansı taşıdığınızı vurguluyor — bu da ara bileşenlerin hiç yeniden render olmadan en alttaki tüketiciye kadar güncellemenin akmasını sağlıyor.

## useState alışkanlığından gelenler için zihinsel model değişimi

`useState` ile büyüdüyseniz, bir state değiştiğinde tüm bileşenin yeniden çalıştığı varsayımına göre düşünürsünüz; bu yüzden `useMemo` ve dependency array'lerle bu maliyeti sınırlarsınız. Signals'ta bu varsayım geçersizdir: bileşen fonksiyonu genelde bir kez kurulur, signal'i okuyan ifadeler kendi başlarına abone olur ve güncellenir. Bu, [React'teki state yönetimi yaklaşımlarını karşılaştırdığımız yazıda](/tr/posts/react-state-yonetimi-karsilastirma) ele aldığımız `useState`/`useReducer`/context tartışmasından oldukça farklı bir eksen; oradaki soru "state nerede tutulur", buradaki soru ise "hangi ifade hangi değere abone". Göç ederken en sık düşülen tuzak, bir store veya prop'u destructure etmek: Solid'de `const { count } = props` yaparsanız, izlemeyi bir kerede kaybedersiniz, çünkü artık `count` bir değer, signal değil.

İlk kez küçük bir React bileşenini Solid.js'e taşırken, eski `useState` refleksimle her şeyi bileşen gövdesinde yeniden kurmaya kalktım ve signal'in neden "donmuş" göründüğünü bir süre çözemedim; o günden beri bence buradaki asıl zorluk yeni bir API öğrenmek değil, bileşen gövdesinin "her render'da yeniden çalışan bir fonksiyon" olduğu varsayımından tamamen vazgeçmek.

## Küçük bir örnek: aynı sayaç, iki farklı signal API'si

Aynı basit sayacı Solid.js ve Svelte 5 runes ile yazınca, ikisinin de aynı sonuca — bileşen fonksiyonunun bir daha çalışmadığı, yalnızca metin düğümünün güncellendiği bir dünyaya — nasıl farklı yollarla vardığı görülüyor:

```jsx
// Solid.js — sayaç
import { createSignal } from "solid-js";

function Counter() {
  const [count, setCount] = createSignal(0);

  return (
    <button onClick={() => setCount(count() + 1)}>
      Tıklama sayısı: {count()}
    </button>
  );
}
```

```svelte
<!-- Svelte 5 (runes) — aynı sayaç -->
<script>
  let count = $state(0);
</script>

<button onclick={() => count++}>
  Tıklama sayısı: {count}
</button>
```

Solid'de `Counter` fonksiyonu yalnızca bir kez çalışır; JSX derlenirken `count()` çağrısı doğrudan ilgili DOM metin düğümüne bağlanır. Svelte'de ise `$state`, derleyiciye "bunu izle" der; derleyici `count++` olduğunda yalnızca o metin düğümünü güncelleyen kodu üretir, [Svelte'in resmi runes dokümantasyonunun](https://svelte.dev/docs/svelte/what-are-runes) da anlattığı gibi. İkisinde de `button` öğesi asla yeniden oluşturulmaz; yalnızca değişen tek şey güncellenir.

## Signals ne zaman gereksiz?

Küçük bir form, birkaç alanlı bir admin paneli ya da pahalı bir render ağacı hiç oluşmayan bir uygulama için signals'a geçmek gereksiz bir kavramsal yük ekler: hangi değerin sarmalanacağını düşünmek, destructure tuzaklarından kaçınmak, store API'lerini öğrenmek. Re-render maliyeti hiçbir zaman gerçek bir darboğaz olmadıysa, `useState` artı gerektiğinde birkaç `memo` fazlasıyla yeterlidir. Signals'ın faydası, [HTMX ile React'i karşılaştırdığımız yazıda](/tr/posts/htmx-mi-react-mi) değindiğimiz "en basit aracı seçme" ilkesiyle aynı yönde ilerliyor: büyük listeler, canlı gösterge panelleri ya da sık güncellenen editörler gibi ölçüm yaparak gerçek re-render maliyeti gördüğünüz yerlerde signals'a uzanın; küçük uygulamalarda bu bir çözüm değil, ek karmaşıklıktır.

Pratikte bir uyarı daha var: birden fazla signal aynı anda değiştiğinde her biri ayrı ayrı güncelleme tetiklerse, kısa süreliğine tutarsız bir ara durum görülebilir. Solid ve Preact bu yüzden ilgili güncellemeleri tek bir microtask içinde toparlayıp bir araya getiriyor (batching); Svelte 5'te ise derleyici zaten aynı `$effect` içindeki bağımlı okumaları tek geçişte çözüyor. Bunu bilmeden, iki signal'i birbirine bağımlı iki `createEffect` içine dağıtırsanız, aralarında görsel olarak fark edilmeyen ama devtools'ta izlenebilen kısa bir tutarsızlık penceresi oluşabilir.

Bu, [Web Geliştirme kategorisindeki](/tr/category/web-gelistirme) diğer mimari yazılarımızla aynı sonuca çıkıyor: yeni bir ilkel her zaman doğru araç değildir, doğru problem için doğru araçtır.

## Sıkça Sorulan Sorular

### Signals React'te de var mı?

Hayır, React resmi olarak signals modelini benimsemedi; bunun yerine derleme zamanında otomatik memoization yapan React Compiler yaklaşımını seçti. `@preact/signals-react` gibi topluluk kütüphaneleri React'e signal benzeri davranış ekleyebilir ama bu React'in kendi API'si değil.

### Signals, useState'in yerini tamamen alır mı?

Hayır. İkisi farklı framework'lerde farklı roller üstleniyor: React içinde `useState` yerini koruyor, signals ise esas olarak Solid, Angular, Preact ve Svelte gibi framework'lerin kendi reaktivite modelini oluşturuyor. Bir React uygulamasını signals'a "geçirmek" gibi bir zorunluluk yok.

### Signals her zaman daha hızlı mı?

Hayır. Küçük, sık render olmayan uygulamalarda fark hissedilmez, hatta ince taneli izlemenin ölçülebilir olmayan küçük bir ek yükü bile olabilir. Fayda, büyük listelerde, canlı verilerde ve pahalı yeniden render maliyeti olan ağaçlarda ortaya çıkıyor.

### Mevcut bir uygulamayı signals'a geçirmek şart mı?

Hayır, kademeli benimseme mümkün. Preact signals mevcut hooks kodunun yanında opt-in olarak kullanılabilir; Angular'da signals ve RxJS bir arada yaşayabilir. Tam bir yeniden yazım genellikle gerekmiyor.
