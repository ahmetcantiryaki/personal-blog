---
title: "Tarayıcının Ötesinde WebAssembly: Sunucuda Wasm"
slug: "sunucuda-webassembly-wasi"
translationKey: "webassembly-server-side-wasm"
locale: "tr"
excerpt: "WASI 0.3, WebAssembly'ye yerel async I/O getirerek sunucuda gerçek bir konteyner alternatifi hâline getirdi. Soğuk başlangıç farkını anlatıyoruz."
category: "devops-cloud"
tags: ["webassembly", "performance", "cloud", "containers"]
publishedAt: "2026-07-20"
seoTitle: "Sunucuda WebAssembly: WASI 0.3 ve 2026 Durumu"
seoDescription: "WASI 0.3'ün async I/O desteği, WebAssembly'yi sunucu ve edge'de gerçek bir çalışma zamanına dönüştürdü. Soğuk başlangıç ve kullanım alanlarını anlatıyoruz."
---

WebAssembly artık sadece tarayıcı teknolojisi değil; 11 Haziran 2026'da yayımlanan WASI 0.3, bileşenlere yerel async I/O getirerek Wasm'ı sunucu ve edge'de konteynerlere gerçek bir alternatif hâline getirdi. Milisaniyenin altında soğuk başlangıç ve güvenli sandbox izolasyonu isteyen iş yükleri için Wasm artık teorik değil, üretimde çalışan bir seçenek; ve bu yazının geri kalanında bu iddianın arkasındaki gerçek sayılara, olgunlaşan runtime ekosistemine ve hâlâ konteynerlerin daha iyi olduğu yerlere bakıyoruz.

Wasm'ın tarayıcıdan sunucuya sıçraması yeni bir hikaye değil, ama 2026'ya kadar eksik kalan bir parça vardı: gerçek eşzamanlılık. Önceki WASI sürümleri, bir bileşen G/Ç beklerken tüm çalışma zamanını bloke ediyordu; bu da Wasm'ı yüksek eşzamanlı sunucu iş yükleri için pratik olmaktan çıkarıyordu. WASI 0.3 bu boşluğu kapattı.

## WASI 0.2'den 0.3'e ne değişti?

WASI 0.2, Component Model ile birlikte arayüz tiplerini (interface types) tanıttı; bu, farklı dillerde yazılmış Wasm bileşenlerinin birbiriyle tip-güvenli şekilde konuşabilmesini sağladı. Ama G/Ç modeli hâlâ `pollable`, `input-stream`, `output-stream` gibi ilkellere dayanıyordu ve gerçek async/await deneyiminden uzaktı.

WASI 0.3.0, bu ilkelleri Component Model'in kanonik ABI'sine gömerek `stream<T>` ve `future<T>` tiplerini birinci sınıf yapı taşları hâline getirdi. Artık host, tüm bileşenler arasında paylaşılan tek bir event loop'u yönetiyor; bu da bir bileşenin G/Ç beklerken diğerlerini bloke etmeden çalışmasını sağlıyor. Pratik sonucu: Wasm bileşenleri artık gerçek async web sunucuları, proxy'ler ve stream işleyicileri yazmak için kullanılabilir.

| WASI sürümü | Ne getirdi |
|---|---|
| WASI 0.1 (Preview 1) | Temel sistem çağrıları, dosya/ağ erişimi |
| WASI 0.2 (Preview 2, Component Model) | Arayüz tipleri, dil-arası tip güvenliği |
| WASI 0.3 (Haziran 2026) | Yerel async: `stream<T>`, `future<T>`, paylaşılan event loop |

## Runtime ekosistemi nerede duruyor?

Wasmtime, referans WASI çalışma zamanı; 45. sürüm WASI 0.3 release candidate'i çalıştırıyor, 46. sürüm ise Component Model async'i varsayılan olarak etkinleştirecek şekilde planlanıyor. Fermyon'un Spin'i, sunucusuz Wasm uygulamaları için geliştirici deneyimini basitleştiren bir framework olarak öne çıkıyor. Cloudflare Workers ve Fastly Compute, Wasm'ı zaten yıllardır edge çalışma zamanı olarak üretimde kullanıyor; WASI 0.3 bu platformlara async native desteği ekliyor.

```bash
# Wasmtime ile bir WASI bileşenini sunucu olarak çalıştırma
wasmtime serve --addr 0.0.0.0:8080 my-async-server.wasm

# Component Model bileşenini derleme (Rust örneği)
cargo component build --release --target wasm32-wasip2
```

## Soğuk başlangıç farkı gerçekten 10-40 kat mı?

Evet, birden fazla ölçüm bu aralığı destekliyor. AWS Lambda üzerinde WebAssembly fonksiyonları, konteyner tabanlı eşdeğerlerine göre soğuk başlangıçta 10-40 kat iyileşme gösteriyor. Wasm'ın konteyner çalıştırma zamanına (runc) karşı avantajı, bir işletim sistemi süreci başlatmak yerine önceden derlenmiş bir bayt kodunu bir sandbox'a yüklemesinden geliyor; bu da Kubernetes üzerinde Wasm çalıştıran kurulumlarda milisaniyenin altına inen başlangıç süreleri anlamına geliyor. CNCF'in son anketine göre geliştiricilerin %70'inden fazlası artık Wasm'ı tarayıcı dışında değerlendiriyor veya kullanıyor; bu, teknolojinin niş meraktan somut değerlendirme aşamasına geçtiğinin göstergesi.

## Wasm nerede konteynerlerin önüne geçiyor?

En net kazanç senaryosu, sık sık soğuk başlayan, kısa ömürlü fonksiyonlar: edge'de kişiselleştirme mantığı, sunucusuz API endpoint'leri, event-driven işleyiciler. İkinci güçlü kullanım alanı plugin/sandboxing: bir ana uygulamaya güvenilmeyen kullanıcı kodunu (örneğin bir SaaS ürününde müşteri yazdığı script'ler) güvenli, kaynak-sınırlı bir sandbox'ta çalıştırmak. Wasm'ın bellek izolasyon modeli, bunu ayrı bir konteyner veya VM başlatmadan, aynı süreç içinde güvenli şekilde yapmanıza izin veriyor. [Edge fonksiyonları ve render mimarileri](/tr/posts/edge-fonksiyonlari-render-rehberi) üzerine yazımızda bu deseni daha geniş bağlamda ele alıyoruz.

Wasm'ın hâlâ zayıf olduğu yerler de var: uzun ömürlü, durum ağırlıklı süreçler (bir veritabanı sunucusu gibi) için konteynerler hâlâ daha olgun bir seçim; GPU erişimi gerektiren iş yükleri için ekosistem henüz Wasm'a hazır değil. Debugging araçları da konteyner ekosistemi kadar olgun değil; bir Wasm bileşeninin çöktüğü anı izlemek, yıllarca geliştirilmiş `docker logs` ve `kubectl describe` deneyimine göre hâlâ daha ham. Bu yüzden 2026'nın gerçekçi tavsiyesi "her şeyi Wasm'a taşı" değil, "kısa ömürlü ve sandbox gerektiren iş yükleri için Wasm'ı değerlendir."

## Kubernetes ile birlikte mi, yerine mi?

Kube-Wasm gibi projeler, Wasm bileşenlerini Kubernetes'in kendi orkestrasyon modeli içinde çalıştırmayı hedefliyor; yani Wasm, Kubernetes'in yerine geçen değil, onun içine giren bir çalışma zamanı seçeneği. Bu, [Kubernetes olmadan deploy](/tr/posts/kubernetessiz-deploy-kamal-coolify) arayan ekiplerin bile faydalanabileceği bir esneklik: Kamal veya Coolify ile deploy ettiğiniz basit bir servisin, gelecekte bir Wasm runtime'ına taşınması, konteyner mimarisini kökten değiştirmeden mümkün.

Açıkçası kişisel görüşüm şu: WASI 0.3'ün async desteği, Wasm'ı "ilginç bir deney" kategorisinden "üretimde gerçekten değerlendirilebilir bir seçenek" kategorisine taşıyan asıl kilit taşıydı. 2025'e kadar konuşulan Wasm hikayelerinin çoğu senkron ve niş kalıyordu; 2026'da artık gerçek bir web sunucusu Wasm üzerinde async çalışabiliyor.

## Hangi diller Wasm bileşeni üretebiliyor?

Component Model'in en pratik faydalarından biri, dil çeşitliliği. Rust, `cargo component` araç zinciriyle en olgun desteğe sahip; Python, JavaScript (jco üzerinden) ve Go da bileşen üretebiliyor, C/C++ ise `wit-bindgen` ile arayüz tanımlarını bağlayabiliyor. Bu, bir ekibin performans kritik bir bileşeni Rust'ta yazıp iş mantığını Python'da yazmasına, ikisini aynı Wasm çalışma zamanında birlikte çalıştırmasına izin veriyor; her bileşen kendi sandbox'ında izole kalırken WIT (Wasm Interface Types) üzerinden tip-güvenli şekilde haberleşiyor. Pratikte bu, mikroservis mimarisinin izolasyon faydalarını, ayrı süreç veya konteyner başlatma maliyeti olmadan almak anlamına geliyor.

## Güvenlik modeli konteynerlerden nasıl farklı?

Konteynerler işletim sistemi seviyesinde izolasyon sağlıyor: cgroup'lar ve namespace'lerle kaynakları ayırıyor ama çekirdek yüzeyi (syscall arayüzü) paylaşılmaya devam ediyor. Wasm ise kapability tabanlı bir güvenlik modeli kullanıyor: bir bileşen, host tarafından açıkça verilmediği sürece hiçbir dosyaya, ağa veya sisteme erişemiyor; varsayılan durum tam izolasyon. Bu, "varsayılan olarak reddet, açıkça izin ver" prensibinin konteynerlere göre çok daha katı bir uygulaması. Pratik sonucu: güvenilmeyen üçüncü taraf kodunu (bir müşteri script'i, bir plugin) çalıştırırken Wasm'ın sandbox'ı, ayrı bir konteyner veya VM başlatmadan, aynı sürecin içinde bile güvenli bir izolasyon sınırı çiziyor. Bu yüzden Wasm'ın en olgun kullanım alanı hâlâ plugin sistemleri ve çok kiracılı sandboxing; konteynerlerin syscall yüzeyinin tamamını devralmadığı için saldırı yüzeyi de doğal olarak daha dar.

## Sıkça Sorulan Sorular

### WASI 0.3 ile 0.2 arasındaki en önemli fark nedir?

WASI 0.3, `stream<T>` ve `future<T>` tiplerini Component Model'in kanonik ABI'sine gömerek yerel async I/O'yu birinci sınıf yaptı. WASI 0.2'de G/Ç, ayrı `pollable` ilkellerine dayanıyordu ve gerçek async/await deneyimi sunmuyordu; 0.3 ile host artık tüm bileşenler arasında paylaşılan tek bir event loop yönetiyor.

### WebAssembly, Docker konteynerlerinin yerini alacak mı?

Kısa vadede hayır. Wasm, kısa ömürlü, sık soğuk başlayan iş yükleri ve sandbox gerektiren plugin senaryolarında güçlü bir alternatif ama uzun ömürlü, durum ağırlıklı süreçler için konteynerler hâlâ daha olgun. İkisi rakip değil, farklı iş yükleri için tamamlayıcı çalışma zamanları olarak konumlanıyor.

### Hangi runtime'lar WASI 0.3'ü destekliyor?

Wasmtime 43 ve sonrası WASI 0.3 desteği sunuyor; 45. sürüm release candidate'i çalıştırıyor, 46. sürüm Component Model async'i varsayılan olarak etkinleştirecek. JavaScript tarafında jco da destek ekledi. Cloudflare Workers ve Fastly Compute gibi edge platformları da bu desteği kendi çalışma zamanlarına taşıyor.

### Soğuk başlangıç avantajı hangi ölçekte gerçekleşiyor?

AWS Lambda üzerinde ölçülen rakamlara göre Wasm fonksiyonları, konteyner tabanlı eşdeğerlerine göre soğuk başlangıçta 10-40 kat daha hızlı. Kube-Wasm gibi Kubernetes entegrasyonlarında ortalama soğuk başlangıç süreleri milisaniyenin altına inerken standart runc konteynerleri saniyeler mertebesinde kalıyor.
