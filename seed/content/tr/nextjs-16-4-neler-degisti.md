---
title: "Next.js 16.4'te Neler Değişti?"
slug: "nextjs-16-4-neler-degisti"
translationKey: "nextjs-16-4-whats-new-2026"
locale: "tr"
excerpt: "Next.js 16.4, 6 Ekim 2026'da Cache Components'i varsayılan öneri yaptı; 14 Ekim'de ise iki kritik RCE'yi kapatan acil güvenlik güncellemesi (16.4.1) geldi."
category: "web-development"
tags: ["nextjs", "web-security", "performance", "frontend"]
publishedAt: "2026-10-24"
seoTitle: "Next.js 16.4: Yenilikler ve Kritik Güvenlik Güncellemesi"
seoDescription: "Next.js 16.4, Cache Components'i varsayılan yaptı; 16.4.1 güvenlik yaması iki kritik RCE ve bir DoS açığını kapatıyor. Yükseltme öncesi bilmeniz gerekenler."
---

Kısa cevap: Next.js 16.4, 6 Ekim 2026'da kararlı sürüme çıktı ve Cache Components'i artık her uygulama için önerilen varsayılan yaklaşım haline getirdi; sekiz gün sonra, 14 Ekim 2026'da ise Vercel, `use cache` fonksiyonlarındaki ve SVG işlemedeki iki kritik uzaktan kod çalıştırma (RCE) açığını kapatan 16.4.1 güvenlik güncellemesini acil olarak yayımladı. Next.js 16.4 veya daha eski bir sürüm kullanıyorsanız, önceliğiniz yeni özellikleri denemek değil, hemen 16.4.1'e (ya da 15.x hattındaysanız 15.5.28'e) yükseltmek olmalı.

## Next.js 16.4'te hangi özellikler geldi?

Kısa cevap: En büyük değişiklik, Cache Components'in artık "denenecek bir özellik" değil, tüm uygulamalar için önerilen varsayılan mimari olması — `create-next-app` ile oluşturulan yeni projelerde varsayılan olarak etkin geliyor. Buna ek olarak statik route'ları garanti altına alan `ensureStatic`, prefetch davranışını ince ayarlayan yeni navigasyon API'leri ve `next upgrade --agent` ile AI ajanlarının yükseltme sürecini otomatik yönetmesini sağlayan bir araç geldi.

Performans tarafında Turbopack'e paylaşımlı bir çalışma zamanı (shared runtime) eklendi, disk önbelleği küçüldü, sunucu tarafı Hot Module Replacement (HMR) artık tembel (lazy) çalışıyor ve üretim paket boyutları küçüldü. Next.js 16.4 ayrıca React 19.3'ü kullanıyor.

## 14 Ekim'deki güvenlik güncellemesinde ne düzeltildi?

Kısa cevap: Vercel, 14 Ekim 2026'da sıra dışı (out-of-band) bir güvenlik güncellemesi yayımladı ve bunu 16.4.1 (Aktif LTS) ile 15.5.28'de (Bakım LTS) iki kritik, bir yüksek şiddetli açığı kapattı. Açıklardan biri, istismar edilmesi için özel bir koşul gerektirmeyen, doğrudan uzaktan kod çalıştırmaya izin veren ciddiyette.

| Açık | Şiddet | Etkilenen | Çözüm |
|---|---|---|---|
| `use cache` fonksiyonlarında RCE (GHSA-673q-mjm6-r5xr) | Kritik | 16.x < 16.4.1 | 16.4.1'e yükselt (geçici çözüm yok) |
| SVG işlemede RCE (GHSA-2464-fhr4-w9xw / CVE-2026-96889) | Kritik | 10.x–15.x < 15.5.28, 16.x < 16.4.1 | Sharp 0.35.5+ veya ilgili sürüme yükselt |
| Server Actions'ta DoS (GHSA-p3m5-59mp-jv5r) | Yüksek | 13.0.0–15.5.27, 16.0.0–16.4.0 | Yama sürümüne yükselt |

`use cache` fonksiyonlarındaki RCE için Vercel herhangi bir geçici çözüm (workaround) tanımlamıyor — tek güvenli yol doğrudan 16.4.1'e yükseltmek. SVG işleme açığı için geçici çözüm olarak Sharp kütüphanesinin 0.35.5 veya üzeri sürümünü kullanmak gösteriliyor. Server Actions'taki DoS açığından ise sunucu taraflı React render etmeyen (React Server Components kullanmayan) uygulamalar etkilenmiyor.

```bash
# Next.js 16.x kullanıyorsanız
npm install next@16.4.1

# Next.js 15.x (Bakım LTS) kullanıyorsanız
npm install next@15.5.28
```

React Server Components paketlerini doğrudan kendiniz yönetiyorsanız, React'i de 19.0.9, 19.1.10, 19.2.9 veya 19.3.1 sürümlerinden uygulamanıza uyan birine yükseltmeniz gerekiyor.

## Bu açıklardan istismar edilme bildirildi mi?

Kısa cevap: Vercel'in açıklamasına göre, bu üç açığın hiçbirinin gerçek dünyada istismar edildiğine dair bir bildirim yok — ama bu, aciliyeti azaltmıyor. Kritik seviyedeki bir RCE'nin kamuya açık hale gelmesinden sonra istismar girişimlerinin genelde saatler içinde başladığı düşünülürse, yama sürümüne geçişi haftalar değil, günler içinde tamamlamak gerekiyor.

Özellikle `use cache` fonksiyonlarını kullanan ve kullanıcı girdisini önbellekleme katmanına yakın bir yerde işleyen uygulamalar, bu açığa karşı en yüksek risk altındaki grup. Üretimde Next.js çalıştıran her ekip, hangi sürümde olduğunu (`npm ls next` ile) hemen kontrol etmeli.

Burada asıl dikkat edilmesi gereken nokta şu: "istismar bildirilmedi" ifadesi, açığın istismar edilemeyeceği anlamına gelmiyor, yalnızca henüz kamuya açık bir vakanın rapor edilmediği anlamına geliyor. Güvenlik araştırmacıları genelde bir CVE yayımlandıktan sonra zafiyeti tersine mühendislikle (reverse engineering) çözüp kendi istismar kodlarını (exploit) üretiyor; bu süreç günler sürebiliyor, haftalar değil.

## Cache Components'e şimdi mi geçmeli?

Kısa cevap: Yeni başlayan projeler için evet, çünkü `create-next-app` zaten varsayılan olarak etkinleştiriyor; mevcut büyük bir uygulamayı Cache Components'e taşımak isteyen ekipler ise önce staging ortamında cache davranışını test etmeli. Vercel'in bunu "varsayılan öneri" seviyesine çıkarması, özelliğin artık deneysel değil, üretime hazır kabul edildiği anlamına geliyor — ama mevcut bir `fetch`/`revalidate` tabanlı önbellekleme stratejiniz varsa, geçiş sırasında önbellek geçersiz kılma (invalidation) davranışının değişebileceğini unutmayın.

## Next.js 16.3'ten 16.4'e yükseltmek risk taşıyor mu?

Kısa cevap: Asıl risk 16.4'ün kendi özelliklerinden değil, 16.4.0 ve öncesinin güvenlik açıklarından geliyor — yani asıl "yükseltme riski" zaten yükseltmemekte. 16.3'ten gelen Turbopack değişiklikleriyle (paylaşımlı çalışma zamanı, küçülen disk önbelleği) uyumluluk sorunu yaşayan ekipler nadir, ama büyük monorepo'larda derleme önbelleğini bir kez temizlemek (`rm -rf .next`) öneriliyor.

## Dağıtımınızın gerçekten yamalı olup olmadığını nasıl kontrol edersiniz?

Kısa cevap: `npm ls next` komutunu çalıştırıp (ya da lockfile'ınıza bakıp) çözülen sürümün 16.x hattında `16.4.1` ya da üzeri, 15.x hattında ise `15.5.28` ya da üzeri olduğunu doğrulayın — tek bir sürüm numarası, yamanın uygulanıp uygulanmadığını başka hiçbir teste gerek kalmadan size söylüyor. Vercel üzerinde dağıtım yapıyorsanız, platformun kendi derleme (build) logları, canlı dağıtımda kullanılan gerçek `next` sürümünü gösteriyor; bu, yalnızca `package.json` dosyanıza bakmaktan daha güvenilir, çünkü güncel olmayan bir lockfile, bağımlılık yükseltilmiş görünse bile projeyi yamalanmamış sürümde sabitleyebilir.

Next.js'i bir CDN ya da ters proxy arkasında çalıştıran ekiplerin, yamadan önce oluşturulmuş önbelleğe alınmış sayfaların geçersiz kılındığından da emin olması gerekiyor — çünkü güvenlik açığı taşıyan bir sunucu sürecinin ürettiği önbelleklenmiş bir sayfa, sunucu ikili dosyası güncellendikten sonra otomatik olarak güvenli hale gelmiyor. Bu tek seferlik bir kontrol, sürekli izlenmesi gereken bir süreç değil: `npm ls next` yamalı sürümü doğruladıktan ve önbelleğiniz bir kez yenilendikten sonra, bu üç CVE için yapılacak başka bir şey kalmıyor.

Kişisel değerlendirmem: Next.js'in sekiz gün arayla hem büyük bir mimari öneriyi (Cache Components varsayılan) hem de kritik bir güvenlik yamasını peş peşe yayımlaması, framework'ün artık gerçekten "sıkı takip gerektiren" bir hıza ulaştığının göstergesi. Otomatik bağımlılık güncellemesi olmayan ekiplerin bu tür sıra dışı güvenlik sürümlerini kaçırma riski, özellik güncellemelerini kaçırmaktan çok daha pahalıya mal oluyor; bu yüzden Next.js kullanan her ekibin, en azından güvenlik duyuruları için otomatik bir bildirim mekanizması kurması mantıklı bir yatırım.

Next.js'in React Server Components mimarisi hakkında daha fazlası için [RSC rehberimize](/tr/posts/nextjs-react-server-components) bakabilirsiniz; Next.js'i Astro ve SvelteKit ile karşılaştıran bir bakış açısı için [2026 framework karşılaştırmamıza](/tr/posts/astro-nextjs-sveltekit-karsilastirma) göz atın. Daha fazla web geliştirme haberi için [Web Geliştirme kategori sayfamızı](/tr/category/web-gelistirme) ziyaret edebilirsiniz.

## Sıkça Sorulan Sorular

### Next.js 16.4.1'e nasıl yükseltebilirim?

`npm install next@16.4.1` komutunu çalıştırarak güncelleyebilirsiniz; Next.js 15.x hattındaysanız `npm install next@15.5.28` komutunu kullanın. React Server Components paketlerini elle yönetiyorsanız React'i de 19.0.9, 19.1.10, 19.2.9 veya 19.3.1'e yükseltmeniz gerekir.

### Next.js 16.4'teki güvenlik açıkları istismar edildi mi?

Vercel'in 14 Ekim 2026 duyurusuna göre, üç açığın (iki kritik RCE, bir yüksek DoS) hiçbiri için gerçek dünyada istismar edildiğine dair bir bildirim yok. Yine de kritik RCE'ler için geçici bir çözüm bulunmadığından, yükseltmeyi geciktirmemek gerekiyor.

### Cache Components nedir ve neden varsayılan oldu?

Cache Components, Next.js'in sayfa ve veri önbellekleme davranışını bileşen seviyesinde kontrol etmenizi sağlayan mimari; Next.js 16.4 ile Vercel bunu artık deneysel değil, tüm uygulamalar için önerilen varsayılan yaklaşım olarak işaretledi ve `create-next-app` içinde otomatik etkinleştirdi.

### SVG işleme açığından (CVE-2026-96889) nasıl korunurum?

Next.js uygulamanızda görsel işleme için kullanılan Sharp kütüphanesini 0.35.5 veya üzeri bir sürüme yükselterek geçici olarak korunabilirsiniz; kalıcı çözüm için Next.js'i 16.4.1 veya 15.5.28'e yükseltmeniz gerekiyor.

Kaynaklar:
- [Next.js Security Update (October 14, 2026)](https://nextjs.org/blog/nextjs-security-update-october-14-2026)
- [Upcoming Next.js Security Update (October 2026)](https://nextjs.org/blog/upcoming-nextjs-security-update-october-2026)
- [Next.js 16.4.0 GitHub Release](https://github.com/vercel/next.js/releases/tag/v16.4.0)
