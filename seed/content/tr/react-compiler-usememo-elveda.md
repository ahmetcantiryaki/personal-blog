---
title: "React Compiler: useMemo'ya Elveda mı?"
slug: "react-compiler-usememo-elveda"
translationKey: "react-compiler-explained"
locale: "tr"
excerpt: "Bir kod tabanında 400'ün üzerinde useMemo çağrısı ve hâlâ takılan render'lar bizi React Compiler'a itti. Neyi otomatik memoize ediyor, useMemo nerede kalıyor?"
category: "web-development"
tags: ["react", "frontend", "performance", "developer-experience"]
publishedAt: "2026-07-16"
seoTitle: "React Compiler Rehberi: 2026'da useMemo'nun Yerini Ne Alıyor"
seoDescription: "React Compiler 1.0, çoğu bileşeni build zamanında otomatik memoize ediyor. Neyin yerini aldığını, useMemo'nun nerede kaldığını ve güvenli geçiş listesini görün."
---

Bir dashboard kod tabanında 400'ün üzerinde `useMemo` ve `useCallback` çağrımız vardı ve render'lar hâlâ takılıyordu. Memoizasyonun yarısı bayattı — bir refactor'dan sonra kimsenin güncellemediği dependency array'ler — diğer yarısı ise aslında pahalı olmayan render'lara karşı savunma yapıyordu. React Compiler'ın çözmek için inşa edildiği sorun tam olarak bu: [7 Ekim 2025'te](https://react.dev/blog/2025/10/07/react-compiler-1) 1.0 sürümüyle stabil olarak yayınlandı ve o günden bu yana geçen yaklaşık dokuz ayda yeni React ve React Native kodu için varsayılan öneri haline geldi.

## Compiler build zamanında gerçekte ne yapıyor

React Compiler bir runtime kütüphanesi değil, build zamanı aracı — build sırasında bir Babel ya da SWC eklentisi olarak çalışıyor ve render'lar arasında gerçekte neyin değiştiğinin statik analizine dayanarak bileşenleri, değerleri ve callback'leri otomatik olarak memoize edecek şekilde yeniden yazıyor. Çıktı, elle yazılmış `useMemo`/`useCallback` çağrılarına benziyor; farkı, compiler'ın bunları çoğu geliştiricinin elle yaptığından daha isabetli yerleştirmesi — erken return sonrası hesaplanan değerler gibi elle memoizasyonun hiç ulaşamadığı durumlar dahil.

```jsx
// Sizin yazdığınız
function ProductCard({ product, onAddToCart }) {
  const formattedPrice = formatCurrency(product.price);
  const handleClick = () => onAddToCart(product.id);

  return (
    <div onClick={handleClick}>
      {product.name} — {formattedPrice}
    </div>
  );
}

// Compiler'ın build zamanında etkin olarak ürettiği —
// artık bunu elle yazmıyorsunuz
function ProductCard({ product, onAddToCart }) {
  const formattedPrice = useMemo(() => formatCurrency(product.price), [product.price]);
  const handleClick = useCallback(() => onAddToCart(product.id), [onAddToCart, product.id]);
  // ...
}
```

1.0 sürümünden bu yana biriken geçiş rehberlerine göre compiler, elle memoizasyonun eskiden cevap olduğu durumların kabaca %95'inde otomatik memoize ediyor. Geriye, küçülse de gerçek bir %5 kalıyor; orada hâlâ kendiniz düşünmeniz gerekiyor.

## Elle memoizasyonun hâlâ hayatta kaldığı yerler

Kalan kaçış noktaları göz ardı edebileceğiniz uç durumlar değil — tüm memoizasyonu körü körüne silen bir ekibi ısırma ihtimali en yüksek olanlar:

- **İç mutasyonlu kütüphaneler.** `react-hook-form`'un `watch()` API'si gibi bir şey, React'in normal render döngüsü dışında mutasyona uğrayan bir değer döndürür. Compiler'ın statik analizi bu mutasyonu göremez, o yüzden reaktivite için buna dayanan kod hâlâ açık bir `useMemo` ya da subscription kalıbına ihtiyaç duyar.
- **Referans kararlılığının yük taşıdığı effect bağımlılıkları.** Bir `useEffect`, bir callback'e bağlıysa ve effect'in doğruluğu o callback'in kimliğinin anlamlı bir şey değişmedikçe *değişmemesine* dayanıyorsa, compiler'ın çıkarımının niyetinizle örtüştüğünü varsaymayın — doğrulayın ya da açık `useCallback`'i koruyun.
- **Compiler'ın vazgeçtiği her şey.** Compiler, güvenle optimize edemeyeceği kalıpları tespit edip tahmin yürütmek yerine atlıyor; bu bileşenler sessizce otomatik memoizasyonsuz kalıyor. ESLint eklentisi bu vazgeçmeleri işaretleyerek sessizce saklanmalarını engelliyor.

## Güvenli geçiş: mevcut memoizasyonu toptan silmeyin

1.0 sonrası dolaşan geçiş rehberlerindeki en yaygın hata: compiler'ı açtığınız gün mevcut her `useMemo`/`useCallback` çağrısını sökmek. Yapmayın. Mevcut memoizasyonu kaldırmak, compiler'ın çıktısını ince şekillerde değiştirebilir; bir effect bir callback'in referans kararlılığına bağımlıysa, compiler'ın bu kararlılığı koruduğunu doğrulamadan elle memoizasyonu silmek effect'in gereğinden fazla tetiklenmesine yol açabilir — bu, eksik bir optimizasyondan çok daha zor fark edilen bir regresyon.

Üretimde işe yaradığı kanıtlanmış kademeli geçiş şu şekilde:

1. **Önce compiler'ı yeni kodda etkinleştirin.** Aynı anda taşımaya çalışmadığınız bir kod tabanı dalında gönderin.
2. **`eslint-plugin-react-hooks`'u compiler-farkında sürüme yükseltin** — artık compiler'ın güvenle optimize edemeyeceği kalıpları işaretliyor; bu, üretimde bir vazgeçmenin sizi şaşırtmasından önceki erken uyarı sisteminiz.
3. **Mevcut memoizasyonu başta olduğu gibi bırakın.** Compiler'ın üstüne binmesine izin verin; gerçek testlerle davranışı doğrulamadan hiçbir şeyi silmeyin.
4. **Geçiş sırasında compiler sürümünü sabitleyin** ve sürümü yükseltmeden önce uçtan uca test setinizi tam olarak çalıştırın — herhangi bir build aracı yükseltmesine uygulayacağınız aynı disiplin.
5. **Elle memoizasyonu kademeli olarak kaldırın**, bileşen bileşen, o bileşen için compiler çıktısının kararlı olduğunu doğruladıktan sonra.

```json
// .eslintrc — compiler-farkında lint kuralı vazgeçmeleri yakalar
{
  "plugins": ["react-hooks"],
  "rules": {
    "react-hooks/react-compiler": "error"
  }
}
```

| React Compiler öncesi | React Compiler sonrası |
|---|---|
| Her yerde elle `useMemo`/`useCallback` | Compiler memoizasyonu otomatik çıkarır |
| Bayat dependency array'ler sessiz hatalara yol açar | Bayatlayacak bir dependency array yok |
| Erken return sonrası memoizasyon atlanır | Compiler erken return sonrasını da memoize eder |
| İnceleyenler memoizasyon stili üzerine tartışır | Stil sorusu büyük ölçüde ortadan kalkar |
| `react-hooks/exhaustive-deps` lint uyarıları | `react-hooks/react-compiler` vazgeçmeleri işaretler |

## Bunun stack'inizin geri kalanına oturduğu yer

[Next.js 15'te React Server Components](/tr/posts/nextjs-react-server-components) kullanmayı da değerlendiriyorsanız, compiler'ın client bileşenlerine uygulandığını bilmekte fayda var — Server Components istemcide hiç yeniden render olmuyor, o yüzden compiler'ın orada optimize edecek bir şeyi yok. [State yönetimi yaklaşımları](/tr/posts/react-state-yonetimi-karsilastirma) arasında karar veriyorsanız ya da [Zod ile React Hook Form](/tr/posts/rhf-zod-erisilebilir-react-formlari) kullanıyorsanız, compiler state yönetimi kararınızın yerini almıyor — sadece türetilmiş değerleri doğru memoize etmek için eskiden ödediğiniz vergiyi kaldırıyor.

## Kademeli etkinleştirme: tüm kod tabanını aynı anda taşımak zorunda değilsiniz

Çoğu kurulum, compiler'ı dizin ya da dosya bazında devre dışı bırakmanıza izin veren bir "opt-out" direktifi veya derleme yapılandırması sunuyor. Bu, büyük bir kod tabanını tek seferde değil kademeli olarak taşımak isteyen ekipler için yukarıdaki aşamalı geçiş planının teknik karşılığı; yeni bir dizini compiler'la başlatıp eski dizinleri bir süre devre dışı bırakılmış tutabilirsiniz.

## Ekip içi tartışmalara etkisi

Bunun az konuşulan bir yan etkisi var: code review'larda memoizasyon stili üzerine yapılan tartışmaların büyük kısmı basitçe ortadan kalkıyor. Eskiden "burada useMemo şart mı yoksa gereksiz mi" sorusu tercihe dayalı bir görüş meselesiydi ve ekipler arasında farklı kurallar oluşurdu; artık compiler bu kararı statik analizle veriyor ve inceleyenlerin enerjisi asıl mantığa kalıyor. Bunun bedeli de var: yeni katılan geliştiriciler memoizasyonun neden ve nasıl olduğunu artık kod içinde görmüyor, bu da mental modeli öğrenmeyi biraz daha soyut hale getiriyor — ama bu, günlük üretkenlik kazancına değecek bir bedel.

"Hepsini sil" kampıyla popüler olmayacak görüşüm şu: React Compiler'a çok iyi bir asistan gibi davranın, bir kâhin gibi değil. Memoizasyonu, deadline baskısı altında elle yapan bir ekipten çok daha sık doğru yapıyor; ama "çok daha sık" "her zaman" demek değil ve yanlış yaptığındaki hata modu — bir referansın kodunuzun değişmeyeceğini varsaydığı halde kimlik değiştirmesi yüzünden bir effect'in gereğinden fazla tetiklenmesi — üç sprint sonra bir memoizasyon kaldırmasına kadar geri izlemesi pahalı olan tam da o tür bir hata. ESLint kuralını açık tutun, geçiş sırasında test etmeye devam edin ve o %5'in kaza değil, bilinçli bir karar olarak kalmasına izin verin.

## Sıkça Sorulan Sorular

### React Compiler ne zaman stabil oldu?

React Compiler ilk stabil sürümü olan 1.0'a 7 Ekim 2025'te ulaştı. Artık yeni React ve React Native projeleri için standart öneri.

### useMemo ve useCallback'e hâlâ ihtiyacım var mı?

Yeni kod için nadiren — compiler durumların kabaca %95'ini otomatik hallediyor. İç mutasyonlu kütüphaneler ve referans kararlılığının yük taşıdığı, çıkarım yerine garanti edilmesi gereken effect'ler için hâlâ açık bir kaçış noktası olarak gerekiyorlar.

### Compiler'ı etkinleştirdikten sonra mevcut tüm useMemo çağrılarımı silmek güvenli mi?

Hayır. Mevcut memoizasyonu kaldırmak, özellikle bir callback'in referans kararlılığına bağımlı effect'ler için compiler'ın çıktısını ince şekilde değiştirebilir. Gerçek testlerle davranışı doğruladıktan sonra, bir günde toptan değil, bileşen bileşen kademeli olarak kaldırın.

### React Compiler, Server Components'e yardımcı oluyor mu?

Doğrudan değil. Server Components sunucuda render olur ve istemcide yeniden render olmaz, o yüzden compiler'ın orada optimize edeceği bir client-side memoizasyon yoktur. Compiler'ın kazanımları client bileşenlerine uygulanır.
