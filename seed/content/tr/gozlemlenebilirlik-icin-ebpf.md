---
title: "Gözlemlenebilirlik İçin eBPF Nedir"
slug: "gozlemlenebilirlik-icin-ebpf"
translationKey: "ebpf-observability-explained"
locale: "tr"
excerpt: "Uygulama koduna hiç dokunmadan trace almak mümkün mü? eBPF'in kernel'den gelen görünürlüğünü, 2026 yığınını ve gerçek sınırlarını inceliyoruz."
category: "devops-cloud"
tags: ["observability", "kubernetes", "performance", "devops", "monitoring"]
publishedAt: "2026-07-12"
seoTitle: "eBPF ile Gözlemlenebilirlik: Sıfır Enstrümantasyon Rehberi"
seoDescription: "Uygulama koduna hiç dokunmadan trace almak mümkün mü? eBPF'in kernel'den gelen görünürlüğünü, 2026 yığınını ve gerçek sınırlarını inceliyoruz."
---

Elinizde 200 mikroservis var, hiçbirinde OTel SDK'sı kurulu değil ve yönetim üç hafta içinde tam görünürlük istiyor. Her servise tek tek dokunmadan trace almak mümkün mü? Cevap eBPF: kernel'e programlanabilir hook'lar ekleyerek, uygulama kodunu hiç değiştirmeden ağ trafiğini, sistem çağrılarını ve süreç davranışını gözlemleyen bir teknoloji.

Bu yazıda eBPF'in ne olduğunu ve kernel'in neden "bedava" görünürlük sağladığını, 2026'nın eBPF yığınını (ağ için Cilium+Hubble, APM için Pixie, güvenlik için Tetragon, OTel span'leri için Beyla), sınırlarını ve overhead'ini, eBPF'in ne zaman SDK enstrümantasyonunu tamamladığını ve ne zaman onun yerini aldığını ele alıyoruz.

## eBPF nedir ve kernel neden bedava görünürlük sağlıyor

[eBPF (extended Berkeley Packet Filter)](https://ebpf.io/what-is-ebpf/), küçük, sandbox'lanmış programları doğrudan Linux kernel'i içinde, kernel'i yeniden derlemeden ya da kernel modülü yüklemeden çalıştırmanızı sağlıyor. Bu programlar ağ paketi geldiğinde, bir sistem çağrısı yapıldığında ya da bir süreç başladığında tetikleniyor — yani veri, uygulamanızın kodundan geçmeden, doğrudan kernel seviyesinde yakalanıyor. Bunun "bedava" olmasının sebebi şu: her dilde, her framework'te ayrı ayrı kütüphane kurmanıza gerek kalmıyor; TCP bağlantısı açan her süreç, hangi dilde yazılmış olursa olsun, aynı kernel hook'undan geçiyor.

## 2026'nın eBPF gözlemlenebilirlik yığını

eBPF artık tek bir araç değil, birbirini tamamlayan bir katman seti hâline geldi. [**Cilium + Hubble**](https://docs.cilium.io/en/stable/), Kubernetes ağ politikalarını ve servisler arası trafik akışını eBPF ile uyguluyor ve görselleştiriyor — kube-proxy'nin iptables tabanlı yönlendirmesinin yerini alıyor. **Pixie**, sıfır enstrümantasyonla otomatik APM sağlıyor: HTTP, gRPC ve veritabanı sorgularını kernel seviyesinde yakalayıp uygulama koduna dokunmadan trace üretiyor. **Tetragon**, güvenlik odaklı: dosya erişimi, süreç çalıştırma ve ağ bağlantılarını gerçek zamanlı izleyip politika ihlallerini anında engelliyor. **Beyla** ise yakaladığı verileri doğrudan OTel formatına (OTLP) çeviriyor, böylece [OpenTelemetry'e başlangıç rehberimizde](/tr/posts/opentelemetry-baslangic-rehberi) anlattığımız Collector'a hiç SDK kurmadan span gönderebiliyorsunuz.

| Araç | Odak | Ne sağlıyor |
|---|---|---|
| Cilium + Hubble | Ağ | Kubernetes network policy + trafik görselleştirme |
| Pixie | APM | Sıfır enstrümantasyonlu otomatik trace ve metrik |
| Tetragon | Güvenlik | Gerçek zamanlı süreç/dosya/ağ izleme ve engelleme |
| Beyla | Entegrasyon | Kernel verisini OTLP'ye çevirip Collector'a gönderme |

## AWS EKS ve Cilium: iddiayı doğru orana oturtmak

Burada net olmak gerekiyor: standart EKS kümeleri hâlâ varsayılan olarak AWS VPC CNI kullanıyor, Cilium değil. Cilium'un varsayılan olduğu yer EKS Hybrid Nodes ve EKS Anywhere — [AWS'nin resmi EKS dokümantasyonuna göre](https://docs.aws.amazon.com/eks/latest/userguide/alternate-cni-plugins.html), standart EC2 tabanlı EKS kümelerinde Cilium hâlâ "alternatif CNI" kategorisinde, VPC CNI ile zincirlenerek ya da onun yerine kurulabilen bir seçenek. Yani "AWS artık her yerde Cilium kullanıyor" demek yanlış olur; doğrusu, AWS'nin Cilium'u resmi olarak desteklediği ve hibrit/on-prem senaryolarda varsayılan hâle getirdiği, ama bulut-native standart kümelerde hâlâ opsiyonel bir yükseltme olduğu.

## Sınırlar ve overhead

eBPF'in "bedava" görünürlüğü tamamen bedava değil: her hook, kernel'de ek CPU döngüsü tüketiyor. JIT derlenmiş eBPF programları verimli olsa da, yoğun paket işleme senaryolarında (örneğin saniyede milyonlarca paket) ölçülebilir bir overhead ekliyor — bu yüzden production'a almadan önce kendi trafik profilinizle benchmark yapmanız gerekiyor. Ayrıca eBPF, kernel sürümüne bağımlı: bazı özellikler yalnızca yeni kernel sürümlerinde (5.x ve sonrası) mevcut, eski işletim sistemi imajları çalıştıran filolarda kısıtlı kalabilirsiniz. Bir diğer sınır da uygulama-içi mantık: eBPF ağ ve sistem çağrısı seviyesinde ne olduğunu görebilir ama "bu fonksiyon neden 200ms sürdü" gibi iş mantığına özel soruları SDK tabanlı manuel span'ler kadar iyi cevaplayamaz.

Bir de yetki konusu var: çoğu eBPF programı kernel'e yüklenmek için yükseltilmiş yetki (genellikle `CAP_BPF` ve ilgili capability'ler, eski kernel'lerde tam root) gerektiriyor. Kubernetes'te bu genelde bir DaemonSet üzerinden, privileged bir container olarak çalıştırılıyor — bu da güvenlik ekiplerinin eBPF araçlarını kendi tedarik zinciri güvenliği politikalarına dahil etmesini gerektiriyor; imzasız ya da doğrulanmamış bir eBPF aracını kümenize privileged olarak dağıtmak, tam da önlemeye çalıştığınız riski taşıyabilir. Bu yüzden yalnızca resmi, imzalı imajları ve bilinen sürüm etiketlerini kullanmak, eBPF yatırımınızın kendisinin yeni bir saldırı yüzeyine dönüşmesini engelliyor.

## Nereden başlamalı: pratik bir ilk adım

Sıfırdan başlıyorsanız tüm yığını aynı anda kurmaya çalışmayın. Kubernetes ağınızı zaten kube-proxy ile yönetiyorsanız, önce Cilium'u sadece network policy katmanında deneyin — Hubble'ın sağladığı akış görselleştirmesi, hangi servisin hangisiyle konuştuğunu ilk günden görmenizi sağlıyor ve mevcut CNI'nizi değiştirmeden paralel çalıştırabileceğiniz bir pilot. APM tarafında sıfır enstrümantasyonlu görünürlük istiyorsanız Pixie'yi tek bir namespace'e kurup bir hafta gözlemleyin; ürettiği trace'lerin kapsamı beklentinizi karşılıyorsa genişletin. Tetragon'u ise doğrudan production'a değil, önce bir staging kümesinde politika ihlallerini "sadece logla, engelleme" modunda çalıştırarak başlatmak, yanlış pozitiflerin gerçek trafiği kesmesini önlüyor.

## eBPF ne zaman SDK enstrümantasyonunu tamamlar, ne zaman yerini alır

Yeni bir servis yazıyorsanız ve iş mantığına özel detaylı trace istiyorsanız, [OTel SDK enstrümantasyonu](/tr/posts/opentelemetry-baslangic-rehberi) hâlâ en doğru araç — eBPF "bu istek hangi servislerden geçti" sorusuna cevap verirken, SDK "bu servis içinde hangi adım yavaş" sorusuna cevap veriyor. Ama elinizde SDK kurulmamış, dokunmaya cesaret edemediğiniz onlarca legacy servis varsa, eBPF tabanlı bir araç (Pixie gibi) sıfır kod değişikliğiyle temel görünürlüğü günler içinde sağlıyor. Pratikte en olgun ekipler ikisini birlikte kullanıyor: kritik, aktif geliştirilen servislerde SDK ile derin enstrümantasyon, geri kalan filoda eBPF ile temel kapsama.

Bu ikili yaklaşım, [Kubernetes otomatik ölçekleme kararlarınızı](/tr/posts/kubernetes-hatalari) da besliyor — hangi servisin gerçekten CPU'ya aç olduğunu, hangi servisin sadece bekleme (I/O wait) yüzünden yavaş göründüğünü ayırt etmek, ölçeklendirme kararlarının isabetini doğrudan etkiliyor. GitOps akışlarınıza eBPF tabanlı politika kontrollerini eklemek isterseniz [GitOps nedir yazımız](/tr/posts/gitops-nedir) iyi bir başlangıç noktası olabilir.

Ekibinizin eBPF'e ayıracağı zaman kısıtlıysa, önceliği "en çok kör olduğunuz alan" belirlemeli: ağ trafiğini zaten iyi görüyorsanız Cilium'a yatırım yapmanın getirisi düşük olur; ama legacy servislerinizin içinde ne olup bittiğine dair hiçbir fikriniz yoksa Pixie muhtemelen en hızlı geri dönüşü sağlayan araç. Araçları "hepsini kuralım" mantığıyla değil, hangi görünürlük boşluğunu kapattığına göre seçmek, eBPF yatırımının gerçek bir kazanca dönüşmesini ve zaman içinde bakım yükü olarak değil somut bir görünürlük kazanımı olarak görülmesini sağlıyor.

Daha fazla gözlemlenebilirlik ve Kubernetes yazısı için [DevOps & Bulut kategorisine](/tr/category/devops-bulut) göz atabilirsiniz.

## Sıkça Sorulan Sorular

### eBPF, OpenTelemetry SDK'sının yerini alıyor mu?

Tam olarak değil, tamamlıyor. eBPF ağ ve sistem çağrısı seviyesinde sıfır kod değişikliğiyle temel görünürlük sağlıyor; iş mantığına özel derin trace için hâlâ SDK tabanlı manuel enstrümantasyon gerekiyor. Beyla gibi araçlar ikisini aynı OTel formatında birleştiriyor.

### AWS EKS varsayılan olarak Cilium mu kullanıyor?

Hayır, standart EC2 tabanlı EKS kümeleri hâlâ AWS VPC CNI'yi varsayılan olarak kullanıyor. Cilium, EKS Hybrid Nodes ve EKS Anywhere için varsayılan/resmi desteklenen CNI; standart kümelerde ise opsiyonel bir alternatif.

### eBPF her Linux kernel sürümünde çalışır mı?

Hayır. Temel eBPF özellikleri eski kernel sürümlerinde de mevcut ama gelişmiş özellikler (örneğin bazı Cilium veya Tetragon yetenekleri) yeni kernel sürümlerini (genelde 5.x ve sonrası) gerektiriyor. Filo genelinde kernel sürümünüzü kontrol etmeden büyük ölçekli bir eBPF geçişine başlamayın.

### eBPF production'da performansı gözle görülür şekilde etkiler mi?

Düşük-orta trafikte overhead genelde ihmal edilebilir düzeyde. Ama saniyede milyonlarca paket işleyen yüksek trafikli sistemlerde ölçülebilir bir CPU maliyeti ekliyor, bu yüzden production'a almadan önce kendi trafik profilinizle benchmark yapmanız öneriliyor.
