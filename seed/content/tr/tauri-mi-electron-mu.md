---
title: "Tauri mi Electron mu? 2026 Masaüstü Kararı"
slug: "tauri-mi-electron-mu"
translationKey: "tauri-vs-electron-2026"
locale: "tr"
excerpt: "Tauri v2 3-15 MB'lık uygulamalar üretirken Electron 50-150 MB'a çıkıyor. Rust çekirdeği, izin modeli ve mobil desteğiyle 2026'da hangisi doğru seçim?"
category: "web-development"
tags: ["rust", "frontend", "performance", "developer-experience"]
publishedAt: "2026-07-19"
seoTitle: "Tauri mi Electron mu 2026: Boyut, RAM, Güvenlik Kıyası"
seoDescription: "Tauri mi Electron mu 2026'da? 3-15 MB'a karşı 50-150 MB kurulum boyutu, izin tabanlı güvenlik modeli ve Tauri v2'nin mobil desteğiyle karar tablosu."
---

Kısa cevap şu: yeni bir masaüstü uygulamasına sıfırdan başlıyorsanız ve ekipte Rust'a en azından biraz alışkınlık varsa, 2026'da varsayılan seçim Tauri olmalı — boyut, RAM ve güvenlik modeli üçü birden lehine. Ekip tamamen JavaScript'te kalmak istiyorsa ya da olgun bir auto-update/code-signing hattına ihtiyaç varsa, Electron hâlâ daha güvenli liman.

## Mimari fark: gömülü Chromium'a karşı işletim sisteminin WebView'ı

Electron, her uygulamanın içine kendi tam Chromium derlemesini ve bir Node.js çalışma zamanını gömer. Bunun getirisi net: Windows, macOS ve Linux'ta piksel piksel aynı render, aynı DevTools, aynı JavaScript motoru davranışı garanti edilir. Bedeli ise her uygulamanın kendi tarayıcısını taşıması — onlarca megabaytlık bir Chromium kopyası, kullanıcının makinesinde zaten yüklü olan bir tarayıcı olsa bile.

Tauri farklı bir yol seçiyor: işletim sisteminin zaten sağladığı native WebView'ı kullanıyor — Windows'ta WebView2, macOS'ta WebKit, Linux'ta WebKitGTK — ve bunun üzerine Rust tabanlı bir çekirdek/backend inşa ediyor. Gömülü bir tarayıcı motoru yok; uygulama, işletim sisteminin zaten bakımını yaptığı render motorunu ödünç alıyor ([Tauri v2 dokümantasyonu](https://v2.tauri.app/)). Bunun bedeli de var: WebView2, WebKit ve WebKitGTK arasında küçük render farkları çıkabilir, Electron'un garanti ettiği "her yerde birebir aynı" deneyimi Tauri vermez.

## Boyut: 600 KB'a karşı 150 MB'a kadar çıkan kurulumlar

Rakamlar burada gerçekten çarpıcı. Minimal bir Tauri v2 uygulaması, çekirdek düzeyinde **600 KB'ın altında** kalabiliyor; tipik, gerçek dünya basit uygulamalar genelde **3-15 MB** aralığına oturuyor. Electron kurulum dosyaları ise gömülü tam bir Chromium derlemesi taşıdığı için **50-150 MB** ve üzerinde seyrediyor ([PkgPulse'un 2026 Electron-Tauri karşılaştırması](https://www.pkgpulse.com/guides/electron-vs-tauri-2026)).

Somut bir örnek daha ikna edici: bir geliştirici aynı authenticator uygulamasını hem Electron hem Tauri ile yazdı ve neredeyse birebir aynı işlevsellik için Electron tarafında **~85 MB**'lık, Tauri tarafında ise **~2,5 MB**'lık bir kurulum dosyası elde etti. Bu, senaryoya göre değişse de yönü net gösteren bir veri noktası.

Aşağıdaki tablo mimari ve boyut farkını yan yana koyuyor:

| Kriter | Tauri v2 | Electron |
|---|---|---|
| Render motoru | OS native WebView (WebView2 / WebKit / WebKitGTK) | Gömülü Chromium |
| Backend dili | Rust | Node.js |
| Minimal uygulama boyutu | <600 KB (çekirdek) | ~50-150 MB+ |
| Tipik gerçek uygulama boyutu | ~3-15 MB | ~80-150 MB |
| Authenticator örneği (aynı işlev) | ~2,5 MB | ~85 MB |
| Mobil (iOS/Android) desteği | Var (v2) | Yok |
| npm haftalık indirme (yaklaşık) | ~85.000 (@tauri-apps/cli) | ~1,66 milyon |
| Varsayılan güvenlik modeli | İzin/capability allowlist | Node entegrasyonu, manuel sertleştirme gerekir |

## Ekosistem olgunluğu ve npm indirme rakamları: dikkatli okumak lazım

Ham npm haftalık indirme sayılarına bakarsanız fark büyük: Electron'ın çekirdek paketi haftada kabaca **1,66 milyon** indirme alırken, Tauri'nin CLI paketi (`@tauri-apps/cli`) bu rakamın çok altında, kabaca **85.000** civarında kalıyor. Ama bu karşılaştırmayı olduğu gibi bir "popülerlik yarışı" olarak okumak yanıltıcı.

Sebebi şu: Electron'ın kullanımı büyük ölçüde tek bir pakette (`electron`) toplanıyor. Tauri'nin kullanımı ise `@tauri-apps/api`, `@tauri-apps/cli`, çeşitli Rust crate'leri, eklentiler (plugin) ve proje şablonları arasında dağılıyor — bu da tek bir npm paketinin indirme sayısını, gerçek benimseme oranının altında gösteriyor. Yine de mutlak rakamların işaret ettiği şey doğru: Electron'ın ekosistemi — hazır kütüphaneler, StackOverflow cevapları, üretim örnekleri — 2026'da hâlâ çok daha derin ve olgun. [Bun ile Node.js runtime kararında](/tr/posts/bun-mu-nodejs-mi-2026-runtime) gördüğümüze benzer bir "olgunluk primi" burada da geçerli: yeni teknoloji hızlı ilerliyor ama sorun giderme süresi hâlâ olgun ekosistem lehine.

## Güvenlik modeli: varsayılan izin listesi mi, manuel sertleştirme mi

Tauri'nin Rust çekirdeği, varsayılan olarak bir **capability/izin allowlist** sistemi uyguluyor: dosya sistemi, shell, HTTP gibi her API yüzeyi, her pencere için ayrı ayrı ve açıkça etkinleştirilmesi gerekiyor. Aşağıdaki `tauri.conf.json` parçası, bir pencerenin yalnızca belirli bir dosya sistemi kapsamına erişebildiği tipik bir capability tanımını gösteriyor:

```json
{
  "identifier": "main-capability",
  "windows": ["main"],
  "permissions": [
    "core:default",
    {
      "identifier": "fs:allow-read-text-file",
      "allow": [{ "path": "$APPDATA/config.json" }]
    }
  ]
}
```

Bu model, varsayılan saldırı yüzeyini küçültüyor: bir eklenti ya da bağımlılık, siz açıkça izin vermediğiniz sürece dosya sistemine ya da shell'e erişemiyor. Electron tarafında tarih farklı işledi: Node.js entegrasyonu ve geniş API erişimi tarihsel olarak varsayılan açık geliyordu, `contextIsolation`, sandboxing ve renderer'larda `nodeIntegration`'ı kapatmak gibi adımları geliştiricinin manuel olarak uygulaması gerekiyordu ([Electron'ın resmi dokümantasyonu](https://www.electronjs.org/)). Electron'ın güvenlik duruşu yıllar içinde ciddi biçimde olgunlaştı ve bugün önerilen varsayılanlar çok daha güvenli; ama "varsayılan olarak kapalı, açıkça izin ver" felsefesi hâlâ Tauri'nin ayırt edici tarafı.

## Tauri v2: masaüstünden mobile aynı frontend'le

Tauri v2, 2024 sonunda stabil hale geldi ve 2025-2026 boyunca aktif olgunlaşmaya devam ediyor. En büyük fark: artık yalnızca masaüstü değil, **iOS ve Android**'i de büyük ölçüde aynı frontend kod tabanından hedefliyor. Bir React ya da Svelte arayüzü yazıp, aynı iş mantığını Rust tarafında tutarak hem masaüstü hem mobil paket çıkarabilmek, tek bir kod tabanından çoklu platform isteyen ekipler için gerçek bir farklılaştırıcı. [Web bileşenlerinin 2026'da ne kadar hazır olduğuna dair yazımızda](/tr/posts/web-components-2026-hazir-mi) tartıştığımız "tek kod tabanı, çoklu hedef" eğilimi burada da kendini gösteriyor. Electron ise tamamen masaüstüne özel kalmaya devam ediyor; mobil hedeflemek isterseniz ayrı bir stack kurmanız gerekiyor ([rustify.rs'nin 2026 Tauri-Electron karşılaştırması](https://rustify.rs/articles/rust-tauri-vs-electron-2026)).

## Electron'un hâlâ kazandığı yerler

Açık görüşüm şu: Tauri'nin boyut ve güvenlik avantajı gerçek, ama "her zaman Tauri" demek yanlış olur. Electron şu durumlarda hâlâ daha mantıklı seçim:

- **Ekip tamamen JavaScript/TypeScript'te kalmak istiyor** ve backend'de Rust öğrenmeye zaman ayıramıyor.
- **En olgun auto-update ve code-signing araçlarına** ihtiyaç var — `electron-builder`, Squirrel gibi araçlar yıllardır üretimde test edildi, Tauri'nin eşdeğerleri hâlâ daha genç.
- **Her işletim sisteminde birebir aynı Chromium render ve DevTools paritesi** garanti edilmesi gerekiyor — WebView2/WebKit/WebKitGTK farklılıkları kabul edilemez bir risk taşıyorsa.
- **Mevcut, olgun bir Electron kod tabanınız var** ve göç maliyeti, elde edilecek boyut/güvenlik kazancından büyük.

Bu son madde, [Astro ile Next.js kararında](/tr/posts/astro-mu-nextjs-mi) da geçerli olan bir prensibin tekrarı: mevcut, iyi çalışan bir sistemi sırf daha "modern" görünen bir alternatif için değiştirmek, çoğu zaman riski ödülden büyük yapıyor.

## Karar tablosu

| Senaryo | Önerilen |
|---|---|
| Sıfırdan yeni masaüstü uygulaması, boyut/RAM kritik | Tauri |
| Masaüstü + mobil aynı kod tabanından hedefleniyor | Tauri v2 |
| Ekipte Rust bilgisi yok, süre kısıtlı | Electron |
| Mevcut olgun Electron uygulaması, göç maliyeti yüksek | Electron'da kal |
| En olgun auto-update/code-signing hattı şart | Electron |
| Varsayılan olarak minimum saldırı yüzeyi isteniyor | Tauri |
| Her OS'ta birebir aynı Chromium render/DevTools şart | Electron |

Temmuz 2026 itibarıyla iki proje de aktif geliştiriliyor; Tauri hızla olgunlaşırken Electron'un ekosistem derinliği kısa vadede kapanacak bir fark değil. Karar, boyut ve güvenlik mi yoksa ekosistem olgunluğu ve ekip yetkinliği mi önceliğiniz, ona bağlı.

## Sıkça Sorulan Sorular

### Tauri, Electron'dan gerçekten bu kadar mı küçük?

Evet, yönü net: minimal bir Tauri uygulaması 600 KB'ın altında kalabilirken Electron kurulumları gömülü Chromium nedeniyle genelde 50-150 MB aralığında. Gerçek dünya örneklerinde (aynı authenticator uygulaması) fark ~2,5 MB'a karşı ~85 MB gibi somut bir orana ulaşabiliyor.

### Tauri'ye geçmek için Rust bilmem şart mı?

Frontend'i JavaScript/TypeScript'te yazabilirsiniz ama dosya sistemi erişimi, native pencere kontrolü gibi backend komutlarını genelde Rust'ta yazarsınız. Basit uygulamalar için temel Rust yeterli olsa da, ekipte hiç Rust deneyimi yoksa öğrenme eğrisini hesaba katmanız gerekir.

### Electron'un güvenlik açıkları hâlâ endişe verici mi?

Electron'un güvenlik duruşu yıllar içinde ciddi biçimde olgunlaştı; `contextIsolation` ve sandboxing artık önerilen varsayılanlar arasında. Fark, Tauri'nin bunu varsayılan olarak zorunlu kılan bir izin modeliyle sunması, Electron'da ise doğru yapılandırmanın hâlâ geliştiricinin sorumluluğunda olması.

### Tauri v2 ile mobil uygulama üretime hazır mı?

Tauri v2, iOS ve Android hedeflemesini 2024 sonundan beri stabil olarak sunuyor ve 2025-2026 boyunca aktif olgunlaşıyor. Basit ila orta karmaşıklıktaki uygulamalar için üretime uygun, ama mobil-native API kapsamı hâlâ Electron'un masaüstü ekosistemi kadar geniş değil; kritik projeler için önce bir kanıt-konsept yapmak mantıklı.
