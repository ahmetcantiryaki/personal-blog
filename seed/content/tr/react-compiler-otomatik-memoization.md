---
title: "React Compiler: useMemo'ya Hâlâ İhtiyacın Var mı?"
slug: "react-compiler-otomatik-memoization"
translationKey: "react-compiler-memoization-2026"
locale: "tr"
excerpt: "Kısa cevap: Çoğu durumda hayır. React Compiler otomatik memoization uyguluyor; Meta üretiminin %95'i onunla çalışıyor, render'ları %40-60 azaltıyor."
category: "web-development"
tags: [react, performance, frontend, web-performance]
publishedAt: "2026-10-01"
seoTitle: "React Compiler Nedir? useMemo ve useCallback'e Elveda"
seoDescription: "React Compiler, 7 Ekim 2025'te 1.0 ile stabil oldu. Meta üretiminin %95'inde çalışıyor, gereksiz render'ları %40-60 azaltıyor; kurulum ve geçiş rehberi."
---

Kısa cevap: Çoğu durumda artık hayır. React Compiler, build sırasında bileşenlerinizi analiz edip gereken yerlere otomatik memoization ekliyor; Meta'nın üretim React yüzeylerinin %95'i şu anda bu derleyiciyle çalışıyor ve gereksiz yeniden render'ları %40-60 oranında azaltıyor. Manuel `useMemo`/`useCallback` hâlâ var olmaya devam ediyor ama artık varsayılan refleks değil, istisnai bir araç.

## React Compiler nedir?

React Compiler, React bileşenlerinizi build zamanında statik olarak analiz eden ve hangi değerlerin yeniden hesaplanması, hangi fonksiyonların yeniden oluşturulması gerektiğini otomatik tespit eden bir derleyici. Siz kod yazmaya devam ediyorsunuz; derleyici, önceden elle `useMemo(() => ..., [deps])` yazarak yaptığınız işi sizin yerinize, derleme aşamasında yapıyor.

React Compiler 1.0, 7 Ekim 2025'te stabil olarak yayınlandı ve üretimde test edilmiş durumda. React 19'dan bağımsız, ayrı bir araç; React 17 ve sonrasıyla çalışıyor. Yani React 19'a geçmeden de React Compiler'ı devreye alabilirsiniz. Bu bağımsızlık özellikle büyük, eski bir React 17 veya 18 kod tabanını yöneten ekipler için önemli — React sürümünü yükseltmeyi beklemeden, bugün performans kazanımı almaya başlayabiliyorsunuz.

## React Compiler'ı nasıl devreye alırsın?

Yeni bir Vite, Next.js veya Expo projesi başlatıyorsanız, React Compiler artık varsayılan olarak açık geliyor — ayrı bir kurulum gerekmiyor. Mevcut bir uygulamanız varsa, React ekibi adım adım bir geçiş rehberi yayınladı: uyumluluk kontrolleri, kademeli açma (örneğin tek bir dizinde test etme) ve gerekli araçları kapsıyor.

```bash
npm install babel-plugin-react-compiler eslint-plugin-react-hooks@latest
```

Kurulumdan sonraki kritik adım, derleyici tabanlı lint kurallarını etkinleştirmek. React Compiler'ın tanı (diagnostic) çıktıları artık `eslint-plugin-react-hooks` paketinin önerilen kural setine entegre edildi — yani normal Hooks lint denetiminiz, derleyicinin fark ettiği ihlalleri de kapsıyor.

## React Compiler'ı açtığınızda ne bozulur?

En sık karşılaşılan sorun, "Rules of React" kurallarına uymayan koddan kaynaklanıyor — örneğin render sırasında yan etki üreten veya koşullu olarak hook çağıran bileşenler. Derleyici bu tür kodu güvenli şekilde optimize edemediği için ya o bileşeni atlıyor ya da lint uyarısı veriyor. Pratik hata ayıklama adımı: derleyiciyi önce tek bir rotada veya dizinde açıp, lint çıktısındaki ihlalleri tek tek düzeltmek, sonra kapsamı genişletmek.

| Senaryo | Derleyici davranışı |
|---|---|
| Hook kuralına uyan bileşen | Otomatik memoize edilir |
| Koşullu hook çağrısı | Derleyici o bileşeni atlar, lint uyarısı verir |
| Render sırasında yan etki | Lint hatası; manuel düzeltme gerekir |
| Zaten manuel `useMemo` içeren kod | Derleyici çakışmaz, gereksiz hale gelen memoization'ı tespit edebilir |

## React Compiler gerçekten ne kadar hız kazandırıyor?

Rakamlar, kullanım senaryosuna göre değişiyor ama tutarlı bir yön gösteriyor. Meta'nın iç testlerinde derleyici, gereksiz yeniden render'ları herhangi bir kod değişikliği olmadan %40-60 azalttı; ilk yükleme ve sayfalar arası geçişlerde %12'ye varan iyileşme, bazı etkileşimlerde ise 2,5 kattan fazla hızlanma görüldü, bellek kullanımı ise nötr kaldı.

Üçüncü taraf örnekler de bu yönü doğruluyor: Next.js ve React ile kurulu bir inceleme sitesinin teknik ekibi, derleyiciyi açtıktan sonra Lighthouse performans skorunda %30 iyileşme bildirdi. Sanity Studio ise karmaşık form editörlerinde render süresinde %20-30 azalma ve belirgin gecikme iyileştirmeleri raporladı.

Bundle boyutu konusunda ise net bir kazanç iddia edilemez: Meta'nın kendi ölçümlerinde bundle boyutu büyük ölçüde nötr kaldı, derleyicinin eklediği küçük runtime kodu nedeniyle hafif bir artış bile gözlendi. Bazı ekipler kendi projelerinde bundle küçülmesi bildirse de, bu React Compiler'ın birincil vaadi değil — asıl kazanım render performansında.

## React Compiler'ın optimizasyonunu nasıl doğrularsın?

React DevTools, bir bileşenin derleyici tarafından memoize edilip edilmediğini gösteren bir rozet ekledi — "Memo ✨" işareti, o bileşenin React Compiler tarafından otomatik olarak optimize edildiğini gösteriyor. Bir bileşen bu rozeti almıyorsa, ya "Rules of React" ihlali var ya da derleyici kapsamı dışında bir dosyada (örneğin derleyicinin henüz taramadığı bir paket) yazılmış demektir.

Pratik bir doğrulama akışı şöyle işliyor: önce lint'i çalıştırıp derleyici tanılarını (diagnostics) kontrol edin, ardından DevTools'ta kritik bileşenlerin "Memo" rozetini aldığını doğrulayın, son olarak Lighthouse veya gerçek kullanıcı metrikleriyle (Core Web Vitals) gerçek bir performans farkı olup olmadığını ölçün. Sadece derleyiciyi açıp "artık hızlı olmalı" varsaymak yerine, bu üç adımlı doğrulama, React Compiler'ın gerçekten beklenen bileşenleri optimize ettiğini garanti ediyor.

## React Compiler, Svelte ve Vue'nun derleme yaklaşımından nasıl farklı?

Svelte ve Vue'nun derleme zamanlı optimizasyonları başlangıçtan beri bu şekilde tasarlanmıştı; React Compiler ise var olan, çalışma zamanı (runtime) odaklı bir kütüphaneye sonradan eklenen bir derleme katmanı. Bu fark önemli: Svelte bileşeni derleme zamanında saf JavaScript'e çevirirken, React Compiler React'ın mevcut render modelini koruyor, sadece hangi değerlerin yeniden hesaplanacağını optimize ediyor — yani React'ın virtual DOM'u hâlâ çalışma zamanında devrede.

Bu, React Compiler'ın Svelte'in sıfır-runtime yaklaşımına ulaşamayacağı, ama mevcut React kod tabanlarını yeniden yazmadan optimize edebildiği anlamına geliyor. [Astro, Next.js ve SvelteKit karşılaştırmamızda](/tr/posts/astro-nextjs-sveltekit-karsilastirma) detaylandırdığımız gibi, SvelteKit'in küçük bundle boyutu büyük ölçüde bu derleme zamanlı, runtime'sız yaklaşımdan geliyor; React Compiler ise React'ın ekosistem avantajını korurken benzer bir performans kazanımına, farklı bir yoldan ulaşmaya çalışıyor.

## Manuel memoization hâlâ ne zaman gerekiyor?

Üç durumda hâlâ elle `useMemo`/`useCallback` yazmak mantıklı: derleyicinin güvenle optimize edemediği, "Rules of React" dışına çıkan özel durumlar; çok pahalı, deterministik olmayan hesaplamalar (örneğin harici bir API çağrısına bağlı bir değer önbellekleme); ve derleyicinin henüz desteklemediği React Native veya üçüncü parti kütüphane entegrasyonları. Bunun dışında, yeni kodda manuel memoization yazmak artık genellikle gereksiz karmaşıklık ekliyor.

Performans optimizasyonunu derleyiciye bırakan ekipler için [gelişmiş TypeScript kalıpları rehberimiz](/tr/posts/ileri-typescript-kaliplari), tip güvenliğini artırırken derleyicinin analiz edebileceği daha net kod yazmanın yollarını anlatıyor. React Compiler'ı Next.js projenize eklerken karşılaşacağınız build araçları tartışması için [ESLint yerine Biome ve Oxlint](/tr/posts/eslint-yerine-biome-ve-oxlint) yazımız da faydalı bir karşılaştırma sunuyor.

Pratikte bu, kod inceleme sürecinde de bir alışkanlık değişikliği gerektiriyor: bir pull request'te elle eklenmiş yeni bir `useMemo` gördüğünüzde, artık ilk soru "bu doğru deps dizisini mi kullanıyor" değil, "bu optimizasyon gerçekten derleyicinin yapamadığı bir şey mi" olmalı. Çoğu ekip bu geçişi, lint kuralını "gereksiz manuel memoization" uyarısı verecek şekilde sıkılaştırarak yapıyor — böylece eski alışkanlıkla yazılan kod, derleyicinin zaten hallettiği bir işi tekrar yapmış olmuyor.

## Sıkça Sorulan Sorular

### React Compiler React 19 gerektiriyor mu?

Hayır. React Compiler, React 19'dan bağımsız ayrı bir araç ve React 17 ile sonraki sürümlerle çalışıyor. React 19'a geçmeden React Compiler'ı devreye alabilirsiniz; ikisi birbirinden bağımsız kararlar.

### React Compiler useMemo ve useCallback'i tamamen gereksiz mi kılıyor?

Çoğu günlük kullanım için evet, ama tam olarak değil. Derleyici, "Rules of React" kurallarına uyan standart bileşenlerde otomatik memoization uyguluyor. Çok pahalı deterministik olmayan hesaplamalar veya derleyicinin güvenle analiz edemediği özel durumlar için manuel memoization hâlâ gerekli olabilir.

### React Compiler'ı mevcut bir projeye eklemek riskli mi?

React ekibinin yayınladığı kademeli geçiş rehberi sayesinde riski düşük tutmak mümkün. Önce tek bir dizinde veya rotada açıp lint uyarılarını düzeltmek, sonra kapsamı genişletmek önerilen yaklaşım. "Rules of React" ihlalleri olan eski kod tabanlarında ilk geçişte bazı lint hataları beklenmeli.

### React Compiler bundle boyutunu küçültüyor mu?

Garanti etmiyor. Meta'nın kendi testlerinde bundle boyutu büyük ölçüde nötr kaldı, hatta derleyicinin eklediği runtime kodu nedeniyle hafif bir artış görüldü. Asıl kazanım bundle boyutunda değil, gereksiz render'ların azalmasında ve bunun getirdiği etkileşim hızındaki iyileşmede. Bundle boyutunu küçültmek asıl hedefiniz ise, derleyiciden bağımsız olarak kod bölme (code splitting) ve gereksiz bağımlılıkları temizleme çalışmalarına devam etmeniz gerekiyor.
