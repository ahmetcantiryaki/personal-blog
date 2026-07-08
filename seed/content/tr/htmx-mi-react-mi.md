---
title: "HTMX mi React mı: React'e Ne Zaman Gerek Var"
slug: "htmx-mi-react-mi"
translationKey: "htmx-vs-react"
locale: "tr"
excerpt: "Çoğu CRUD uygulaması SPA'ya ihtiyaç duymaz. Bundle boyutu, hypermedia modeli ve HTMX 4.0'ın View Transitions desteğiyle React'i ne zaman seçmelisiniz?"
category: "web-development"
tags: ["htmx", "react", "frontend", "web-performance"]
publishedAt: "2026-07-08"
seoTitle: "HTMX mi React mı: React'e Ne Zaman Gerek Var"
seoDescription: "Çoğu CRUD uygulaması SPA'ya ihtiyaç duymaz. Bundle boyutu, hypermedia modeli ve HTMX 4.0'ın View Transitions desteğiyle React'i ne zaman seçmelisiniz?"
---

Çoğu CRUD uygulamasında React'e ihtiyacınız yok. Bir form gönderip HTML döndüren, liste filtreleyen, esasen sunucudaki veriyi ekrana basan bir uygulama yazıyorsanız cevap nettir: HTMX yeterlidir, üstelik daha az bağımlılık ve daha az bakım yüküyle. React'i ciddi olarak düşünmeniz gereken yer, zengin istemci durumu, çevrimdışı çalışma veya karmaşık etkileşimin işin merkezinde olduğu uygulamalardır. Bu yazıda ikisini Temmuz 2026 itibarıyla elimizdeki verilerle karşılaştırıyorum.

## İki farklı zihniyet: hypermedia mı, bileşen mi

React'in zihin modeli açıktır: durum (state) istemcide yaşar, arayüz bu durumun bir fonksiyonudur, her değişiklikte sanal DOM yeniden hesaplanır ve fark alınarak gerçek DOM'a yazılır. Uygulamanın "beyni" tarayıcıdadır; sunucu genelde JSON döndüren bir API'den ibarettir.

HTMX bambaşka bir sözleşmeye dayanır: hypermedia. Sunucu HTML parçaları (fragment) üretir; istemci bu parçaları `hx-get`, `hx-post` gibi öznitelikler aracılığıyla ister ve `hx-swap` ile DOM'un ilgili bölümüne yerleştirir. Durum büyük ölçüde sunucuda kalır, istemci yalnızca "hangi HTML parçası nereye gidecek" sorusuyla ilgilenir. Bu, uygulama durumunun hypermedia aracılığıyla aktarılması fikrine React ekosisteminin çoğu zaman fiilen terk ettiği ölçüde sadıktır.

Aşağıdaki kod, aynı işi iki modelin nasıl farklı çözdüğünü gösteriyor: bir butona tıklayınca sunucudan güncel bir kullanıcı listesi çekmek.

```html
<!-- HTMX: sunucu HTML döndürür, istemci sadece yerleştirir -->
<button hx-get="/users" hx-target="#user-list" hx-swap="innerHTML">
  Listeyi Yenile
</button>
<div id="user-list"></div>
```

```jsx
// React: istemci JSON çeker, kendi DOM'unu hesaplar
function UserList() {
  const [users, setUsers] = useState([]);
  const refresh = async () => {
    const res = await fetch('/api/users');
    setUsers(await res.json());
  };
  return (
    <>
      <button onClick={refresh}>Listeyi Yenile</button>
      <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>
    </>
  );
}
```

HTMX örneğinde render mantığı sunucuda, tek bir yerde yaşıyor. React örneğinde aynı render mantığının bir kopyası istemcide yeniden yazılmış oluyor — küçük örnekte önemsiz görünse de ekran sayısı arttıkça bu ikilik gerçek bir bakım maliyetine dönüşüyor.

## Bundle boyutu: sayılar yalan söylemez

Performans tartışmasının çoğu soyut kalıyor; sayılara bakmak işi netleştiriyor. [htmx.org](https://htmx.org/) kütüphaneyi yaklaşık 14 KB (min+gzip) olarak duyuruyor; React ile React DOM'un toplamı ise yaklaşık 42 KB'tır — sadece çekirdek kütüphaneler için üç katına yakın bir fark.

| Ölçüt | HTMX | React (+ React DOM) |
|-------|------|----------------------|
| Çekirdek kütüphane boyutu | ~14 KB (min+gzip) | ~42 KB (min+gzip) |
| Tipik üretim paketi | 14–30 KB | 200–500 KB (router, state yönetimi ve bağımlılıklarla) |
| Zihin modeli | Hypermedia / sunucu güdümlü | Bileşen / istemci güdümlü |
| Öğrenme eğrisi | Düşük (HTML öznitelikleri) | Orta-yüksek (JSX, hooks, state yönetimi) |
| En uygun olduğu iş | CRUD, form ağırlıklı, içerik odaklı siteler | Zengin istemci durumu, offline, karmaşık etkileşim |

Bu fark hidrasyon aşamasında daha da büyüyor: React uygulaması ilk boyamadan önce JavaScript'i indirip ayrıştırmak, çalıştırmak ve DOM'u "canlandırmak" zorunda. HTMX'te sunucu zaten kullanıma hazır HTML gönderdiği için bu aşama büyük ölçüde ortadan kalkıyor. [Core Web Vitals kontrol listemizde](/tr/posts/core-web-vitals-kontrol-listesi) anlattığımız gibi, INP ve LCP metrikleri tam olarak bu indirme-ayrıştırma-çalıştırma zincirinden zarar görüyor; bundle boyutu küçüldükçe bu metrikler doğal olarak iyileşiyor.

## HTMX 4.0: View Transitions artık varsayılan

Temmuz 2026'da yayımlanan HTMX 4.0, kütüphanenin mimarisini de güncelledi. [InfoWorld'ün haberine göre](https://www.infoworld.com/article/4150864/htmx-4-0-hypermedia-finds-a-new-gear.html), sürüm eski XHR taşıma katmanını tamamen kaldırıp yerini modern Fetch API'ye bıraktı; bu da HTML parçalarının `ReadableStream` üzerinden gerçek zamanlı akışını mümkün kılıyor. Daha da önemlisi, tarayıcının yerel [View Transitions API'si](https://htmx.org/essays/view-transitions/) artık ekstra CSS veya JavaScript yazmadan, kutudan çıktığı gibi devrede.

Pratikte bu, bir `hx-swap` işleminin artık otomatik olarak yumuşak bir geçiş animasyonuyla gerçekleşebileceği anlamına geliyor. [View Transitions API'yi ayrıntılı işlediğimiz yazıda](/tr/posts/view-transitions-api-kullanimi) gösterdiğimiz manuel `document.startViewTransition()` çağrılarını, en azından HTMX tarafında, artık elle yazmanıza gerek yok. React tarafında aynı deneyimi elde etmek hâlâ ek kütüphane veya elle yazılmış geçiş mantığı gerektiriyor.

## React'in hâlâ doğru seçim olduğu yerler

Bu yazı HTMX'i savunuyor ama dürüst olmak gerekirse React'in üstün olduğu gerçek senaryolar var:

- **Zengin istemci durumu**: Bir tablo editörü, kanban panosu veya çok adımlı sihirbaz gibi, ekranın büyük kısmının sunucuya hiç gitmeden kendi içinde tutarlı kalması gereken uygulamalarda React'in bileşen modeli kazanır. [React state yönetimi karşılaştırmamızda](/tr/posts/react-state-yonetimi-karsilastirma) ele aldığımız Zustand ve Jotai gibi araçlar bu senaryolarda gerçek değer katıyor.
- **Çevrimdışı destek**: Service worker'larla senkronize olan, ağ bağlantısı kesikken de çalışması gereken uygulamalarda durumun istemcide yaşaması zorunlu; HTMX'in sunucu güdümlü modeli bunu doğal olarak desteklemiyor.
- **Karmaşık etkileşim**: Sürükle-bırak, gerçek zamanlı ortak düzenleme, canvas tabanlı editörler gibi yüksek frekanslı ve düşük gecikmeli etkileşimlerde React (veya benzeri bir bileşen kütüphanesi) hâlâ doğru araç.
- **Zaten Next.js'e yatırım yaptıysanız**: [React Server Components rehberimizde](/tr/posts/nextjs-react-server-components) anlattığımız gibi, Next.js 15 sunucu bileşenleriyle React'in bundle dezavantajının bir kısmını zaten kapatıyor; bu ekosistemde derinseniz HTMX'e geçiş maliyeti kazancı aşabilir.

Kısacası React, istemcide gerçekten karmaşık ve kendi kendine yeten bir durum gerektiren yerlerde kazanıyor; sunucudaki veriyi görüntüleyip düzenleme işinde ise kaybediyor.

## Sayılar ne diyor: State of JS 2025

Bu sadece bir görüş değil. [State of JS 2025 anketi](https://2025.stateofjs.com/en-US/libraries/front-end-frameworks/), React'in kullanım oranının %83,6 ile hâlâ zirvede olduğunu ama memnuniyet skorunun tarihinin en düşük seviyelerine gerilediğini gösteriyor; en sık gösterilen gerekçe ekosistemin büyüyen karmaşıklığı. Aynı ankette HTMX, deneyenler arasında "en beğenilen" araçlar arasındaki yerini koruyor. Kullanım sıralamasında yıl içinde yalnızca Alpine.js ile HTMX yer değiştirdi, memnuniyet sıralamasında da büyük bir sarsıntı yok; yani HTMX'in yüksek memnuniyeti geçici bir heves değil, birkaç yıldır süren bir örüntü. Bu, "yüksek kullanım" ile "yüksek memnuniyet"in aynı şey olmadığının açık bir kanıtı.

## Karar kontrol listesi

Projenize başlamadan önce şu soruları sorun:

1. Ekranların çoğu formlar ve listeler aracılığıyla sunucu verisini mi gösteriyor? HTMX'e eğilin.
2. İstemci durumunun büyük bir kısmı ağ isteği olmadan tutarlı kalmalı mı (kanban, editör, sihirbaz)? React'e eğilin.
3. Çevrimdışı çalışma veya PWA senkronizasyonu gerekiyor mu? React (veya benzeri bir istemci çerçevesi) neredeyse zorunlu.
4. Ekip zaten Next.js/React'e derinlemesine yatırım yaptı mı ve React Server Components'ten faydalanıyor mu? Geçiş maliyetini hesaba katıp React'te kalmayı düşünün.
5. Sayfa geçişlerinde animasyon istiyor ama ekstra JS yazmak istemiyor musunuz? HTMX 4.0'ın yerleşik View Transitions desteği burada avantaj sağlıyor.
6. Bundle boyutu ve sayfa yükleme metrikleri (FCP, LCP) kritik önceliğiniz mi? HTMX'in 14 KB'lık ayak izi ciddi bir avantaj.

Bu listenin çoğunluğu "HTMX" diyorsa muhtemelen React'e hiç ihtiyacınız yok. [Astro ile Next.js karşılaştırmamızda](/tr/posts/astro-mu-nextjs-mi) ve [SSR, SSG ve ISR farklarını anlattığımız yazıda](/tr/posts/ssr-ssg-isr-farki) da aynı tema tekrar ediyor: doğru araç, projenin gerçek ihtiyacına göre seçilen ve en az karmaşık olandır.

## Sıkça Sorulan Sorular

### HTMX, React'in yerini tamamen alabilir mi?

Hayır; zaten amacı da bu değildi. HTMX, sunucu güdümlü, form ve liste ağırlıklı uygulamalarda React'ten daha basit ve daha hafif bir çözüm sunuyor. Ancak zengin istemci durumu, çevrimdışı senkronizasyon veya canvas tabanlı editör gibi karmaşık etkileşim gerektiren uygulamalarda React'in bileşen modeli hâlâ daha uygun.

### HTMX ile SEO nasıl etkileniyor?

Genellikle olumlu yönde. HTMX sunucudan tam HTML döndürdüğü için arama motorları içeriği JavaScript çalıştırmadan görebiliyor. React uygulamalarında bu, sunucu tarafı render (SSR) veya statik üretim (SSG) gerektiriyor; aksi hâlde tarayıcı JavaScript'i çalıştırmadan içerik görünmüyor.

### HTMX'i mevcut bir React projesine kademeli olarak ekleyebilir miyim?

Evet. HTMX, bir sayfanın belirli bölümlerine — örneğin bir form veya tablo bileşenine — React'i hiç değiştirmeden entegre edilebilir. Birçok ekip yeni CRUD ekranlarını HTMX ile yazıp mevcut karmaşık React ekranlarını olduğu gibi bırakarak kademeli geçiş yapıyor.

### HTMX 4.0'a geçmek için mevcut HTMX kodumu değiştirmem gerekiyor mu?

Çoğu durumda hayır; `hx-*` öznitelikleri aynı kalıyor. Asıl değişiklik taşıma katmanının XHR'den Fetch API'ye geçmesi ve View Transitions desteğinin varsayılan olarak açılması; bu ikisi de mevcut işaretlemenizi bozmadan çalışıyor. Özel JavaScript uzantıları yazdıysanız Fetch tabanlı olay modelini bir kez gözden geçirmeniz gerekebilir.
