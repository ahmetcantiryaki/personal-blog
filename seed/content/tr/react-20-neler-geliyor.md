---
title: "React 20 Gerçekten Geliyor mu? Kesin Olanlar"
slug: "react-20-neler-geliyor"
translationKey: "react-20-whats-coming-2026"
locale: "tr"
excerpt: "Kasım 2026 itibarıyla resmi bir React 20 duyurusu yok; mevcut kararlı sürüm React 19.2 ve derleyici 1.0'da, sonraki ana sürüm için onaylı bir tarih bulunmuyor."
category: "web-development"
tags: ["react", "frontend", "best-practices", "developer-experience"]
publishedAt: "2026-11-23"
seoTitle: "React 20 Durumu: Kesinleşenler ve Söylentiler"
seoDescription: "Kasım 2026 itibarıyla resmi bir React 20 duyurusu yok; mevcut kararlı sürüm React 19.2 ve derleyici 1.0'da, sonraki ana sürüm için onaylı bir tarih bulunmuyor."
---

Kısa cevap: Hayır, resmi olarak değil — Kasım 2026 itibarıyla React çekirdek ekibi bir React 20 sürümü veya bunun için bir tarih duyurmadı. Mevcut kararlı hat React 19.2 (Haziran 2026'da 19.2.7'ye kadar yama aldı) ve şu anda kendine "React 20" diyen, belirli bir özellik listesiyle gelen her şey bir blog yazısının tahmini, react.dev'in bir duyurusu değil.

## React 20 gerçekten duyuruldu mu?

Hayır. Bu yazı yazılırken react.dev'in kendi blogunda ve React RFC deposunda bir React 20 duyurusu, yol haritası yazısı veya aday sürüm bulunmuyor. Bunun yerine var olan şey, 1 Ekim 2025'te yayınlanan ve Haziran 2026'ya kadar 19.2.7'ye kadar yama alan React 19.2; 19.x hattındaki bu yama temposu, ekibin henüz bir sonraki ana sürüme odaklanmadığının kanıtı niteliğinde.

Birçok makale ve geliştirici blogu, "React 20" özelliklerini sanki zaten yayınlanmış gibi ayrıntılı şekilde anlatıyor — kararlı bir derleyici, yeni asset API'leri. Bunları haber kılığına girmiş spekülasyon olarak görün. React'te gerçekte ne olduğuna dair doğrulanabilir tek kaynak react.dev/blog ve GitHub'daki RFC tartışmaları; kendinden emin bir başlığa sahip üçüncü taraf bir yazı değil.

## Mevcut kararlı sürümde kesinleşen ne var?

Mevcut kararlı sürüm olan React 19.2, `<Activity />`, `useEffectEvent`, DevTools'ta Performance Tracks ve kısmi ön-render (partial pre-rendering) desteğini içeriyor. Bundan sonra gelecek her şeyi muhtemelen belirleyecek proje olan React Compiler (derleyici), Ekim 2025'te 1.0 statüsüne ulaştı; bu, artık deneysel bir araç değil, ekiplerin bugün benimseyebileceği production'a hazır bir toolchain parçası olduğu anlamına geliyor.

| Özellik | Durum | Yayınlandığı sürüm |
|---|---|---|
| `<Activity />` bileşeni | Kararlı | React 19.2 (Ekim 2025) |
| `useEffectEvent` hook'u | Kararlı | React 19.2 (Ekim 2025) |
| Performance Tracks (DevTools) | Kararlı | React 19.2 (Ekim 2025) |
| Kısmi ön-render | Kararlı | React 19.2 (Ekim 2025) |
| React Compiler | 1.0 (production'a hazır) | Ekim 2025 |
| "React 20" | Duyurulmadı | — |

Bu derleyici kilometre taşı, bir sürüm numarasından daha önemli. `useMemo` ve `useCallback`'in elle yapmanızı gerektirdiği memoization'ı otomatikleştiriyor; şu anda derleyiciyi benimseyen ekipler, eventual ana sürüm ne olarak adlandırılırsa adlandırılsın, React'in performans modelinin "sonraki nesline" fiilen zaten yaşıyor. Hâlâ elle memoization'a ihtiyacınız olup olmadığına karar veriyorsanız, [React Compiler: hâlâ useMemo'ya ihtiyacınız var mı?](/tr/posts/react-compiler-otomatik-memoization) yazısı bunu doğrudan ele alıyor.

## Gelecek bir ana sürüm için ne tartışılıyor, ne kadar sağlam?

React çekirdek ekibi, daha derin Suspense iç içe geçmesi gibi daha büyük, çok-sürümlü fikirleri kamuya açık GitHub RFC konularında ve React Conf konuşmalarında tartışıyor — ama bir GitHub tartışma konusu bir teslimat taahhüdü değil ve şu anda bu konulardaki hiçbir şey bir sürüm numarası veya teslim tarihi taşımıyor. Bir react.dev kaynağı göstermeden onaylı bir "React 20 özelliği" olarak sunulan her şeyi, ne kadar belirli ve kendinden emin görünse de doğrulanmamış kabul edin.

Gerçekten takip etmeye değer örüntü aşamalı: React, her şeyi dramatik bir sonraki ana sürüm açıklamasına saklamak yerine 19.x nokta sürümleri içinde anlamlı yetenekler yayınlıyor. Bu, React 16'dan 18'e kadarki iniş şeklinden kasıtlı bir sapma ve "React 20'yi bekle" muhtemelen yanlış çerçeve — sonraki gerçek yetenek büyük olasılıkla yeniden numaralanmış bir ana sürüm değil, 19.3 veya 19.4 olarak gelecek.

## Hazırlanmak için gerçekte ne yapmalısınız?

Henüz var olmayan bir sürümü beklemek yerine, zaten kararlı olanı benimseyerek hazırlanın. Kod tabanınızı, derleyicinin artık değiştirebileceği elle yazılmış `useMemo`/`useCallback` çağrıları için denetleyin, `<Activity />`'nin elle kurduğunuz göster/gizle mantığını sadeleştirip sadeleştirmediğini kontrol edin ve build hattınızın 19.x nokta sürümlerini aldıkları gibi almayı engelleyecek şekilde sabitlenmediğinden emin olun.

```bash
# Kurulu React sürümünüzü ve derleyicinin bağlı olup olmadığını kontrol edin
npm ls react react-dom
npm ls babel-plugin-react-compiler
```

Özellikle kütüphane yazarları için asıl risk varsayımsal bir React 20 kırıcı değişikliği değil — derleyicinin statik analizinin, önceden sade JavaScript'in izin verdiğinden daha sıkı hook kullanım kuralları olması ve elle memoization altında teknik olarak "çalışan" kodun derleyici uyarılarına çarpabilmesi. Uygulamanız zaten server component'lere yaslanıyorsa, bunu [Next.js 15'te React Server Components](/tr/posts/nextjs-react-server-components) yazısıyla birleştirin; derleyicinin bundan sonra yapacağı şeyle etkileşime geçmesi en olası mimari bu.

## "React 20" arama sonuçlarında neden hâlâ çıkıyor, hiç yayınlanmadıysa?

"React 20" için arama ilgisi resmi haberleri geride bırakıyor; çünkü spekülatif yazılar bu sorgu için iyi sıralanıyor ve ana sürüm numaraları, bu arama trafiğini yakalamak için yazılan içerikler için kolay bir çengel — bir yayıncının bir sürümü doğruladığı için değil. Bu yazılardan bazıları react.dev'e değil birbirine kaynak gösteriyor; bu yüzden bir iddia, tek bir doğrulanmamış tahmine dayansa bile iyi kaynaklanmış görünebiliyor.

Pratik filtre şu: React 20 hakkındaki bir makale belirli bir react.dev blog yazısına veya birleştirilmiş bir RFC'ye bağlantı vermiyorsa, özellik listesini makul bir sürüm numarası iliştirilmiş kurgu olarak görün. Bu filtre burada çoğu framework haberinden daha önemli, çünkü React'in gerçek yayınlama davranışı — nokta sürümleri içinde özellik yayınlamak — "React 20"yi güvenle spekülasyon yapılabilecek alışılmadık derecede kolay bir sayı yapıyor; henüz var olmayan bir sürüm hakkındaki bir tahmini kimse çürütemez.

Bir ekip için pratik sonuç şu: sprint planlamanızı veya kütüphane yükseltme takviminizi "React 20 çıkınca" varsayımına dayandırmayın. Bunun yerine 19.x nokta sürümlerinin değişim günlüğünü (changelog) her ay kontrol etmeyi takviminize ekleyin; gerçek yetenek artışı oradan geliyor ve bir sürüm numarası beklemeden şimdi faydalanabilirsiniz. Bu alışkanlık, "React 20 geldiğinde büyük bir geçiş yapacağız" diyerek bugünden ertelenen küçük, kümülatif iyileştirmeleri de önler; o büyük geçiş anı resmi olarak hiç gelmeyebilir. Kısacası: numaralandırılmış bir sürümü beklemek bir strateji değil, bir erteleme biçimi — ve React'in kendi yayınlama geçmişi bunun maliyetli ve gereksiz bir erteleme olduğunu gösteriyor.

Dürüst görüşüm: React ekibinin "React 20" konusundaki sessizliği buradaki en yararlı sinyal — nokta sürümleri içinde anlamlı özellikler yayınlayan bir ekip, açıkça bir ana sürüm manşeti üretmek zorunda değil ve söylenti bloglarının özellik listelerini kovalamak, kazandırdığından daha fazla planlama zamanı harcatıyor. Bu model altında state yönetiminin nereye gittiğine dair ikinci bir görüş istiyorsanız, [React state yönetimi 2026: karşılaştırma](/tr/posts/react-state-yonetimi-karsilastirma) makul bir sonraki okuma.

Birincil kaynaklar: [react.dev'in resmi blogu](https://react.dev/blog) ve [React Compiler Experimental Release Strategy RFC tartışması](https://github.com/reactwg/react-compiler/discussions/1).

## Sıkça Sorulan Sorular

### React 20 yayınlandı mı?

Hayır. Kasım 2026 itibarıyla React çekirdek ekibinden resmi bir React 20 sürümü, aday sürüm veya duyurulmuş bir teslim tarihi yok. Mevcut kararlı hat, Haziran 2026 itibarıyla 19.2.7'ye kadar yama alan React 19.2.

### En yeni onaylı React sürümü hangisi?

En yeni onaylı kararlı sürüm, 1 Ekim 2025'te yayınlanan ve Haziran 2026'ya kadar 19.2.7'ye kadar nokta sürümleri alan React 19.2. `<Activity />`, `useEffectEvent`, Performance Tracks ve kısmi ön-render ekledi; React Compiler aynı ay 1.0'a ulaştı.

### React 19.2'de hâlâ useMemo'ya ihtiyacım var mı?

Çoğunlukla hayır. Ekim 2025'ten beri 1.0'da olan React Compiler, `useMemo` ve `useCallback`'in önceden elle gerektirdiği memoization'ın çoğunu otomatikleştiriyor. Onları hâlâ elle yazabilirsiniz, ama derleyiciyi kullanan bir kod tabanında genellikle gereksiz oluyorlar.

### React'in yol haritası hakkında söylentiler yerine gerçek bilgiyi nereden bulabilirim?

Doğrudan react.dev/blog'u ve React çalışma grubunun GitHub'daki RFC tartışmalarını kontrol edin. Resmi bir react.dev yazısı veya RFC kaynak göstermeden belirli "React 20 özellikleri" anlatan üçüncü taraf yazılar, ne kadar kendinden emin görünse de onaylı bir yol haritası değil, spekülasyon olarak değerlendirilmeli.
