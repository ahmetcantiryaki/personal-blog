---
title: "Speculation Rules API: Tarayıcı Önceden Nasıl Yükler?"
slug: "speculation-rules-api-tarayici-onceden-yukleme"
translationKey: "speculation-rules-api-2026"
locale: "tr"
excerpt: "Speculation Rules, bir sitenin JSON kurallarıyla Chromium'a hangi sayfaları önceden yükleyeceğini söylemesini sağlar; Firefox ve Safari henüz desteklemiyor."
category: "web-development"
tags: ["web-performance", "core-web-vitals", "frontend", "web-standards"]
publishedAt: "2026-10-18"
seoTitle: "Speculation Rules API Nedir? Prefetch, Prerender, Destek"
seoDescription: "Speculation Rules API, siteler için JSON tabanlı prefetch/prerender kuralları tanımlar ve anında gezinme sağlar. Sözdizimi ve gerçek tarayıcı desteği."
---

Speculation Rules API, bir sitenin kullanıcı tıklamadan önce tarayıcının hangi sayfaları prefetch (yanıtı önceden getirme) veya prerender (sayfayı gizli bir arka plan sekmesinde render etme) yapması gerektiğini bir JSON bloğuyla bildirmesini sağlıyor — bu da nihai gezinmeyi anında hissettiriyor. Ekim 2026 itibarıyla Chrome ve Edge'de gönderilmiş ve kararlı durumda; Firefox'ta hiç desteklenmiyor, Safari'de ise uygulanmış ama varsayılan olarak kapalı.

## Bu, neyin yerine geçiyor?

Tarayıcıya ne zaman veya ne kadar agresif davranacağı konusunda neredeyse hiç kontrol vermeyen eski `<link rel="prefetch">` ve `<link rel="prerender">` etiketlerinin yerine geçiyor — kullanıcının tıklama olasılığından bağımsız olarak bağlantılı her sayfa getirilip bant genişliği harcanıyordu ya da tarayıcılar bu harcamadan kaçınmak için ipucunu sessizce görmezden geliyor, bu da etiketi pratikte güvenilmez kılıyordu. Speculation Rules, bir sitenin koşulları ve istekliliği (eagerness) açıkça belirtmesine izin vererek bunu çözüyor; böylece tarayıcının kendi sezgiselleri, tek bir statik etiketten tahmin etmek yerine sayfanın sağladığı verilerle getirme kararını veriyor.

## Bir speculation rule nasıl yazılır?

Kural kümesi, ister satır içi bir `<script type="speculationrules">` etiketinde ister ayrı bir belgeden yüklenen JSON olarak; URL'leri veya bir CSS seçici örüntüsünü, bir eylemi (`prefetch` veya `prerender`) ve tarayıcının ne kadar erken harekete geçeceğini kontrol eden bir istekliliği (eagerness) adlandırıyor. [web.dev'in Speculation Rules rehberi](https://web.dev/articles/speculation-rules), bu örneğin atladığı seçenekler dahil, tüm kural dilbilgisini belgeliyor.

```html
<script type="speculationrules">
{
  "prerender": [
    {
      "where": { "selector_matches": "a[href^='/posts/']" },
      "eagerness": "moderate"
    }
  ],
  "prefetch": [
    {
      "urls": ["/pricing", "/docs"],
      "eagerness": "eager"
    }
  ]
}
</script>
```

Buradaki `prerender` kuralı, bir ziyaretçi gerçek bir niyet gösterdiğinde tarayıcıya herhangi bir yazı sayfasını arka planda tam olarak render etmesini söylüyor — "moderate" istekliliği pratikte geçici bir fare hareketinde değil, `pointerdown` veya sürekli hover'da tetikleniyor. `prefetch` kuralı ise tam render etmeden daha agresif biçimde getirilecek iki belirli URL adlandırıyor.

## İstekli (eagerness) seviyeleri gerçekte neyi kontrol ediyor?

İstekli seviyesi, "anında hissettirme" ile "kimsenin ziyaret etmediği sayfalarda bant genişliği harcama" arasındaki takası belirliyor ve doğru seviye, kullanıcının gerçekten tıklayacağına ne kadar güvendiğinize bağlı.

| İstekli (eagerness) | Tetikleyici | Tipik kullanım |
|---|---|---|
| `immediate` | Kural ayrıştırılır ayrıştırılmaz tetiklenir | Neredeyse kesin bir sonraki sayfa, örn. bilinen bir ödeme akışının 2. adımı |
| `eager` | Çok erken, `immediate`'e yakın tetiklenir | Güvendiğiniz yüksek trafikli sayfalar (fiyatlandırma, dokümantasyon ana sayfası) |
| `moderate` | `pointerdown` veya sürekli hover'da tetiklenir | İçerik içindeki çoğu bağlantı için varsayılan güvenli seçim |
| `conservative` | Yalnızca açık, neredeyse kesin niyet sinyallerinde tetiklenir | Harcanan prerender'ların zarar vereceği, güven düzeyi düşük bağlantılar |

Prerender, prefetch'ten daha maliyetli — JavaScript'ini çalıştırmak dahil tam bir gizli sayfayı render ediyor — bu yüzden ağır istemci tarafı işi olan bir sayfada ucuz bir `eagerness` ayarını `prerender` ile eşlemek, kazandırdığından daha fazlasına mal olabilir. Emin olmadığınızda sadece prefetch kuralları daha güvenli varsayılan.

## Speculation Rules desteği tarayıcılar arasında aynı mı?

Hayır — Ekim 2026 itibarıyla bu, production'da fiilen Chromium'a özgü bir özellik. Chrome ve Edge bunu yaklaşık v109'dan beri destekliyor ve orada kararlı; [Chrome'un prerendering üzerine geliştirici dokümantasyonu](https://developer.chrome.com/docs/web-platform/prerender-pages) etkinleştirme yaşam döngüsünü ayrıntılı olarak ele alıyor. Firefox'ta hiç uygulama yok; API'yi değerlendirmeye alan açık bir Mozilla hatası var ama taahhüt edilmiş bir gönderim tarihi yok, bu yüzden "tartışılıyor" olarak değerlendirin, "yakında geliyor" olarak değil. Safari/WebKit'te deneysel bir uygulama var ve son Safari ile Safari Technology Preview derlemelerinde varsayılan olarak kapalı — motorda mevcut ama kullanıcı deneysel bir bayrağı açmadıkça etkisiz. [Caniuse'nin Speculation Rules sayfası](https://caniuse.com/wf-speculation-rules), göndermeden önce bu tabloyu yeniden kontrol etmenin en hızlı yolu; destek, çoğu dokümandan daha hızlı değişiyor.

| Tarayıcı | Durum |
|---|---|
| Chrome / Edge (Chromium) | ~v109'dan beri destekleniyor, kararlı |
| Firefox | Uygulanmadı; açık hata var, gönderim tarihi yok |
| Safari / WebKit | Uygulandı, varsayılan olarak kapalı |

## Kullanıcılarımın yarısı desteklenmeyen tarayıcılardaysa bunu göndermek güvenli mi?

Evet — bu, nadir görülen "bedava" performans kazançlarından biri; çünkü desteklemeyen tarayıcılar `speculationrules` script etiketini hata vermeden veya hiçbir şeyi bozmadan basitçe görmezden geliyor. Hiçbir özellik algılama dallanması veya yedek kod yazmanız gerekmiyor; etiketi anlamayan bir tarayıcı onu etkisiz bir script türü olarak görüp devam ediyor. Bu asimetri — Chromium'da gerçek kazanç, başka yerde sıfır dezavantaj — Firefox ve Safari'nin yetişmesini beklemek yerine şimdi muhafazakâr bir kural kümesi göndermek için iyi bir argüman.

Dürüst görüşüm: eklemenin hiçbir maliyeti olmadığı ve Chromium'un tek başına çoğu site için gerçek dünya trafiğinin büyük bir kısmını kapsadığı düşünülürse, Firefox ve Safari desteği hâlâ belirsizken bile en çok ziyaret edilen iç bağlantılarınız için en azından `moderate` istekli seviyesinde bir prerender kuralı eklememek için pek bir bahane yok.

## Gerçekten yardımcı olup olmadığını nasıl ölçersiniz?

Kurallarınızın kapsadığı sayfalara tekrarlanan, oturum içi ziyaretlerde gezinme süresini ve Largest Contentful Paint'i izleyin — tıklama geldiğinde içerik zaten render edilmiş olduğundan, en net kazancı prerender edilmiş bir sayfanın gösterdiği yer burası. [Chrome'un Speculation Rules iyileştirmeleri üzerine yazısı](https://developer.chrome.com/blog/speculation-rules-improvements), hangi kuralların gerçekten tetiklendiğini hata ayıklamak için Chrome'un sunduğu `prefetch`/`prerender` durum raporlamasının nasıl okunacağını da ele alıyor. Bu rakamları destek olmayan bir tarayıcıdaki aynı yolculuklarla (veya kuralları geçici olarak kaldırarak) karşılaştırmak, bir varsayım yerine gerçek bir öncesi/sonrası veriyor. Zaten bir [Core Web Vitals kontrol listesi](/tr/posts/core-web-vitals-kontrol-listesi) üzerinde çalışıyorsanız, "yüksek trafikli iç bağlantılarda speculation rules"u ayrı bir proje gibi değil, düşük efor gerektiren, Chromium'a özgü bir madde olarak ekleyin.

[Görsel yüklemeyi performans için ayarlamış](/tr/posts/web-gorsel-optimizasyonu) veya [hız için bir bundler seçmiş](/tr/posts/vite-turbopack-rspack-bundler-2026) ekipler genelde daha kolay kazançları zaten cebe koyduğu için bu tür gezinme seviyesindeki optimizasyona hâlâ alanı olan ekipler oluyor. Uygulamanız akış (streaming) için [React Server Components](/tr/posts/nextjs-react-server-components)'a yaslanıyorsa, bu sunucu tarafı işi, bir sonra gelmesi en olası bağlantılarda istemci tarafı bir prerender kuralıyla eşleştirin — ikisi rekabet etmek yerine birbirini güçlendiriyor.

## Önce hangi bağlantılarda denemelisiniz?

En çok tıklanan, içeriği hızlı render edilen iç bağlantılarda başlayın — bir yazı listesinden yazı detayına, kategori sayfasından en popüler gönderilere ya da bilinen bir ödeme akışının bir adımından sonrakine. Ağır istemci tarafı JavaScript'i olan veya nadiren tıklanan bağlantılarda `prerender` yerine sadece `prefetch` kullanmak, boşa harcanan render maliyetini düşürürken yine de bir kazanç sağlıyor. Kuralları site çapında tek bir büyük listeye yaymak yerine en yüksek trafikli birkaç rotada test edip ölçmek, hangi `eagerness` seviyesinin gerçek kullanıcı davranışınıza uyduğunu daha hızlı gösteriyor.

## Sıkça Sorulan Sorular

### Speculation Rules API Firefox'ta çalışıyor mu?
Hayır. Firefox, Ekim 2026 itibarıyla Speculation Rules API'nin hiçbir uygulamasına sahip değil. Teklifi değerlendirmeye alan açık bir Mozilla hatası var ama göndermek için taahhüt edilmiş bir zaman çizelgesi yok; bu yüzden "henüz desteklenmiyor" olarak değerlendirilmeli, "yakında geliyor" olarak değil.

### Speculation Rules, eski rel=prefetch etiketiyle aynı mı?
Hayır, onun yerine geçiyor. `<link rel="prefetch">`, zamanlama veya güven seviyesi üzerinde kontrol olmayan, tek ve hep-ya-da-hiç bir ipucu veriyordu. Speculation Rules, bir sitenin farklı URL'ler, eylemler (prefetch ya da prerender) ve istekli seviyeleriyle birden fazla kural belirtmesine izin veriyor; böylece tarayıcı davranışını bir tıklamanın gerçekte ne kadar olası olduğuna göre eşleyebiliyor.

### Speculation rules eklemek, desteklenmeyen tarayıcılarda sitemi bozar mı?
Hayır. Firefox ve varsayılan Safari yapılandırmaları dahil, Speculation Rules API'yi desteklemeyen tarayıcılar `<script type="speculationrules">` etiketini basitçe etkisiz bir script türü olarak görmezden geliyor. Hata yok, yedek kod gerekmiyor ve işlevselliğe hiçbir risk yok — faydayı yalnızca desteklendiği yerde kazanıyorsunuz.

### Speculation Rules'ta prefetch ile prerender arasındaki fark nedir?
Prefetch, bir ağ gidiş-dönüşünden tasarruf ederek yalnızca sayfanın yanıtını gezinmeden önce getiriyor. Prerender daha ileri gidip JavaScript'ini çalıştırmak dahil sayfayı gizli bir arka plan sekmesinde tam olarak render ediyor; bu yüzden gezinmenin kendisi anında hissediliyor — ağır istemci tarafı render içeren sayfalarda en çok önemli olan, prefetch'ten daha fazla CPU ve bellek maliyetiyle.
