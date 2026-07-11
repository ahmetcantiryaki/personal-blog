---
title: "Gözlemlenebilirlik İçin eBPF Nedir"
slug: "gozlemlenebilirlik-icin-ebpf"
translationKey: "ebpf-observability-explained"
locale: "tr"
excerpt: "Uygulama koduna hiç dokunmadan trace almak mümkün mü? eBPF'in kernel seviyesinde nasıl çalıştığını ve 2026'nın Cilium, Pixie, Tetragon yığınını anlatıyoruz."
category: "devops-cloud"
tags: ["observability", "kubernetes", "devops", "monitoring"]
publishedAt: "2026-07-11"
seoTitle: "eBPF ile Gözlemlenebilirlik: Kernel Seviyesi Rehber"
seoDescription: "Uygulama koduna hiç dokunmadan trace almak mümkün mü? eBPF'in kernel seviyesinde nasıl çalıştığını ve 2026'nın Cilium, Pixie, Tetragon yığınını anlatıyoruz."
---

Elli mikroservisi olan bir platformda her birine OpenTelemetry SDK'sı eklemek haftalar sürüyor — özellikle üçüncü parti servisleri ya da eski kod tabanlarını enstrümante edemediğinizde. Peki uygulama koduna hiç dokunmadan trace, metrik ve güvenlik olayı almanın bir yolu var mı?

Cevap eBPF. Bu yazı soru-cevap formatında, kernel'in size neden bedava görünürlük verdiğini ve 2026'nın olgunlaşmış eBPF yığınını anlatıyor.

## Neden şimdi, neden 2026'da mainstream oldu

eBPF teknolojisi kendisi yeni değil — Linux kernel'inde on yılı aşkın süredir var. Asıl değişen, çevresindeki tooling'in olgunlaşması ve büyük bulut sağlayıcılarının onu varsayılan hale getirmesi. Bir teknoloji "deneysel" etiketinden çıkıp bir hyperscaler'ın varsayılan altyapısına girdiğinde, ekosistem etrafında hızla toplanıyor — daha iyi dokümantasyon, daha stabil API'ler, daha fazla üretime hazır araç. 2026'da eBPF tam olarak bu eşiği geçti.

## eBPF nedir, kernel neden bedava veri veriyor

[eBPF](https://ebpf.io/what-is-ebpf/) (extended Berkeley Packet Filter), Linux kernel'i içinde sandbox'lanmış, güvenli programlar çalıştırmanızı sağlayan bir teknoloji. Bu programlar, kernel kaynak kodunu değiştirmeden ya da bir modül yüklemeden, ağ paketleri, sistem çağrıları ve süreç olayları gibi kernel seviyesindeki her şeye kancalanabiliyor.

Bunun gözlemlenebilirlik için anlamı şu: HTTP isteği bir servise ulaştığında, uygulama kodu çalışmadan önce bile kernel bu isteğin bir soket üzerinden geçtiğini, hangi süreç tarafından işlendiğini ve ne kadar sürdüğünü zaten "biliyor". eBPF bu bilgiyi kernel'den doğrudan çekiyor — uygulamanın kendi kendini enstrümante etmesini beklemeden.

## 2026'nın eBPF yığını neye benziyor

Tek bir eBPF aracı yok; her biri farklı bir katmanı kapsayan olgun bir ekosistem var:

- **Cilium + Hubble**: ağ katmanı — servisler arası trafiği, DNS çözümlemesini, ağ politikası ihlallerini görünür kılar.
- **Pixie**: APM katmanı — kod değişikliği olmadan otomatik olarak HTTP/gRPC/veritabanı trace'leri üretir.
- **Tetragon**: güvenlik katmanı — süreç çalıştırma, dosya erişimi, ağ bağlantısı gibi çalışma zamanı olaylarını gerçek zamanlı izler.
- **Beyla**: OTel katmanı — eBPF ile topladığı verileri doğrudan OpenTelemetry span'lerine dönüştürüp mevcut bir OTel Collector'a besler.

Bu dördü birbirini tamamlıyor: Cilium ağı, Pixie uygulama performansını, Tetragon güvenliği kapsıyor, Beyla ise eBPF dünyasını OTel ekosistemine köprülüyor.

| Araç | Katman | Sağladığı görünürlük |
|---|---|---|
| Cilium + Hubble | Ağ | Servis-servis trafiği, DNS, politika ihlalleri |
| Pixie | APM | HTTP/gRPC/DB trace'leri, sıfır kod değişikliği |
| Tetragon | Güvenlik | Süreç, dosya, ağ olayları — gerçek zamanlı |
| Beyla | Köprü | eBPF verisini OTel span'lerine dönüştürür |

## Neden AWS EKS varsayılanı değiştirdi

Bu soyut bir teknoloji tercihi değil, endüstri çapında bir kayma. AWS, EKS'in varsayılan CNI'sini (Container Network Interface) eBPF tabanlı Cilium'a çevirdi — bu, eBPF'in "deneysel" etiketinden çıkıp ana akım altyapıya girdiğinin en net göstergesi. Performans farkı da somut: [DEV Community'nin 2026 analizine göre](https://dev.to/linou518/ebpf-in-2026-the-kernel-revolution-powering-cloud-native-security-and-observability-22jd), Cilium'un eBPF veri yolu geleneksel iptables tabanlı ağ katmanına göre %30-40 daha yüksek throughput sunuyor; iptables'ın conntrack çekişmesi yüzünden yaşadığı saniyedeki yeni bağlantı darboğazı da ortadan kalkıyor.

Teknik olarak fark şuradan geliyor: Cilium, iptables'ın DNAT kurallarını eBPF map'leriyle (kernel belleğinde hash tabloları) değiştiriyor — servis lookup'ı, cluster büyüklüğünden bağımsız olarak O(n)'den O(1)'e düşüyor.

## Somut bir senaryo: kimse enstrümante etmediği bir servis

Diyelim ki platformunuzda üçüncü parti bir ekibin yazdığı, kaynak koduna erişiminiz olmayan bir gRPC servisi var — belki eski bir satın alma, belki başka bir takımın bakımını yapmadığı bir bileşen. OTel SDK'sını bu servise ekleyemezsiniz çünkü kod tabanına dokunamıyorsunuz. Bu tam olarak Pixie ve Beyla'nın çözdüğü problem: eBPF ağ katmanında gRPC çağrılarını, hangi metodun çağrıldığını, ne kadar sürdüğünü ve hata kodunu yakalar — servisin kendisi bundan tamamen habersizdir.

Aynı senaryo güvenlik tarafında da geçerli: Tetragon, o servisin hangi dosyalara eriştiğini, hangi dış bağlantıları açtığını, beklenmedik bir süreç çalıştırıp çalıştırmadığını gerçek zamanlı izleyebilir — bu da özellikle denetleyemediğiniz üçüncü parti bileşenler için değerli bir güvenlik ağı oluşturur. Kurumsal ortamlarda "bu bağımlılığa güveniyoruz ama doğrulayamıyoruz" sorununa eBPF, kod değişikliği gerektirmeyen bir çözüm sunuyor.

## Sınırlar ve overhead

eBPF sihirli bir değnek değil. Her eBPF programı kernel'e yüklenmeden önce bir doğrulayıcıdan (verifier) geçiyor — bu, programın sonsuz döngüye girmeyeceğini ve kernel belleğine güvensiz erişmeyeceğini garanti ediyor, ama karmaşık programların doğrulanması bazen reddedilmelere yol açabiliyor. Ayrıca eBPF, kernel seviyesinde çalıştığı için kernel sürüm uyumluluğu önemli — çok eski kernel'lerde bazı özellikler eksik olabilir.

Overhead genellikle düşük (tek haneli yüzde aralığında) ama sıfır değil; yoğun trafikli ağ yollarında Hubble gibi araçların ne kadar detaylı veri topladığını ayarlamak (flow sampling gibi) gerekebiliyor. Kritik bir yol üzerinde çalışıyorsanız, production'a almadan önce staging'de gerçekçi bir yük altında bu overhead'i ölçmek iyi bir alışkanlık.

## eBPF ne zaman SDK enstrümantasyonunun yerini alır, ne zaman tamamlar

Kısa cevap: genellikle tamamlar, nadiren tam olarak yerini alır. Pixie ve Beyla gibi araçlar HTTP/gRPC seviyesinde otomatik trace üretebiliyor, ama uygulamanızın iş mantığına özel bir span (örneğin "bu indirim kuralı neden tetiklendi") eBPF'in bilemeyeceği bir bilgi — bunun için hâlâ [OpenTelemetry'e başlangıç rehberimizde](/tr/posts/opentelemetry-baslangic-rehberi) anlattığımız SDK tabanlı manuel enstrümantasyona ihtiyacınız var.

Pratik model: eBPF ile "sıfır enstrümantasyon" temel görünürlüğü (ağ, temel HTTP trace'leri, güvenlik olayları) anında elde edin, sonra kritik iş akışlarına SDK ile özel span'ler ekleyin. İkisi rakip değil, aynı [observability-101](/tr/posts/observability-nedir) yazımızda bahsettiğimiz log/metrik/trace üçlüsünün farklı toplama katmanları.

Kubernetes'te sıkça karşılaşılan hatalardan biri, ağ görünürlüğünü tamamen manuel enstrümantasyona bırakıp eBPF'in bedava sunduğu veriyi hiç kullanmamak — [kaçınmanız gereken 10 Kubernetes hatası](/tr/posts/kubernetes-hatalari) yazımızda bu tarz gözden kaçan optimizasyonlara değiniyoruz.

## Sıkça Sorulan Sorular

### eBPF kurulumu için kernel modülü yüklemem gerekiyor mu?

Hayır, bu eBPF'in en büyük avantajlarından biri — kernel modülü yüklemeden, kernel'i yeniden derlemeden çalışır. Programlar doğrulayıcıdan geçtikten sonra doğrudan kernel içinde sandbox'lanmış olarak çalıştırılır.

### Cilium'a geçmek mevcut ağ politikalarımı bozar mı?

Doğru planlanmış bir geçişte hayır — Cilium, standart Kubernetes NetworkPolicy kaynaklarını destekler ve üzerine kendi genişletilmiş politika modelini ekler. Yine de üretime almadan önce staging'de mevcut politikaları test etmek gerekir.

### Pixie gibi araçlar hassas veriyi (şifreler, token'lar) yakalar mı?

Potansiyel olarak evet, çünkü ağ trafiğini kernel seviyesinde görüyorlar. Bu araçların çoğu yapılandırılabilir veri maskeleme sunuyor; production'a almadan önce hangi alanların redakte edildiğini mutlaka doğrulayın.

### eBPF sadece Kubernetes için mi kullanışlı?

Hayır, herhangi bir Linux sunucusunda çalışır — ama en somut faydası, çok sayıda kısa ömürlü konteynerin dinamik olarak oluşup yok olduğu Kubernetes gibi ortamlarda görülüyor; çünkü her yeni pod'u elle enstrümante etme ihtiyacını ortadan kaldırıyor.

### Mevcut gözlemlenebilirlik yığınımı eBPF ile değiştirmem mi gerekiyor?

Hayır — pratik yol eklemeli. Cilium ya da Pixie'yi mevcut OTel kurulumunuzun yanına konuşlandırın, sundukları bedava ağ ve APM görünürlüğünden yararlanın, eBPF'in göremediği iş mantığına özel span'ler için SDK enstrümantasyonunu koruyun. Çoğu ekip iki katmanı da kalıcı olarak yan yana çalıştırıyor, birini seçmek zorunda kalmıyor; ikisi birbirini dışlamıyor, tamamlıyor.

### Küçük bir ekip için eBPF araçlarını kurmaya değer mi?

Tek bir monolit servisiniz varsa muhtemelen erken — OTel SDK enstrümantasyonu tek başına yeterli olur. Birden fazla dilde yazılmış, birbirine bağımlı çok sayıda servisiniz olduğunda ya da denetleyemediğiniz üçüncü parti bileşenler devreye girdiğinde eBPF'in bedava görünürlüğü kurulum maliyetini hızla karşılıyor.
