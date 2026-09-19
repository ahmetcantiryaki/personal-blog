---
title: "AI İş Yükleri için GPU Maliyetini Kontrol Et"
slug: "ai-is-yuku-gpu-maliyet-kontrol"
translationKey: "gpu-cost-control-ai-workloads-2026"
locale: "tr"
excerpt: "Kısa cevap: GPU faturası boşta duran kapasiteden yükseliyor. Spot node, MIG/time-slicing ve scale-to-zero ile faturanın çoğu geri kazanılıyor."
category: "devops-cloud"
tags: ["cost-optimization", "kubernetes", "ai-infrastructure", "finops"]
publishedAt: "2026-09-19"
seoTitle: "AI İş Yüklerinde GPU Maliyeti Nasıl Düşürülür?"
seoDescription: "GPU faturanız neden yüksek? Spot instance, MIG, time-slicing ve scale-to-zero ile 2026'da GPU maliyetini düşürmenin somut ve sıralı adımlarını anlatıyoruz."
---

Kısa cevap: GPU faturasının büyük kısmı, aslında iş yapan compute'tan değil, boşta duran ya da düşük kullanılan kapasiteden geliyor. Cast AI'nin 2026 State of Kubernetes Optimization raporuna göre production Kubernetes kümelerinde ortalama GPU kullanımı sadece %5. Spot node, fractional GPU paylaşımı ve scale-to-zero uygulayarak bu farkın büyük bölümü geri kazanılabiliyor.

## AI iş yüklerinde GPU faturası neden bu kadar yüksek?

Çünkü kapasite plana göre değil, tepe yüke göre alınıyor ve çoğu zaman boşta kalıyor. Cast AI'nin 2026 raporuna göre production kümelerinde ortalama GPU kullanımı %5; inference deployment'larının büyük kısmı ise SM (streaming multiprocessor) kullanımı açısından ortalama sadece %20-40 seviyesinde çalışıyor.

Bunun sebebi basit: ekipler bir modelin en yoğun anındaki ihtiyacına göre GPU node ayırıyor, sonra o kapasiteyi 7/24 açık tutuyor. Eğitim job'ları gece boyu bekleyen ama gündüz atıl duran node'larda çalışıyor. Inference servisleri ise trafiğin %10'unun geldiği saatlerde bile tam GPU'yu kilitliyor. Sonuç: fatura kapasiteye göre kesiliyor, kullanıma göre değil.

Bu da 2026'da GPU maliyet optimizasyonunun neden "daha ucuz GPU bulmak" değil, "var olan GPU'yu daha az boşa harcamak" meselesi olduğunu açıklıyor.

## Spot GPU kullanmak güvenli mi?

Batch ve eğitim job'ları için evet, düzenli checkpoint alındığı sürece. Spot (ya da preemptible) instance'lar, sağlayıcının kapasiteyi geri isteyebileceği, buna karşılık on-demand fiyatın %60-90 altında satılan GPU kapasitesi. Riski, bulut sağlayıcının işlemi birkaç dakikalık uyarıyla durdurabilmesi.

Bu risk, checkpoint alan job'lar için yönetilebilir bir maliyet. Eğitim döngüsü her N adımda bir state kaydediyorsa, bir spot kesintisi kaybedilen birkaç dakikadan fazlasına mal olmaz. Latency'ye duyarlı, sürekli açık kalması gereken canlı inference servisleri için ise spot tek başına riskli — orada spot'u ancak fazladan replica ve hızlı failover ile birlikte kullanmak mantıklı.

2026 itibarıyla önerilen sıralama şöyle:

1. **Eğitim job'larını spot/preemptible node'lara taşı** — %60-70 tasarruf.
2. **GPU node pool'larında scale-to-zero'yu ayarla**, böylece boşta kalan node sadece "idle" değil gerçekten kaldırılıyor — batch/bursty ekipler için %50-65 tasarruf.
3. **Inference node'larında time-slicing veya MIG'i aç**, böylece birden fazla pod/istek aynı GPU'yu paylaşsın — GPU başına %50-75 maliyet düşüşü.

Bu üçü birbirini tamamlıyor: ilk ikisi "gereksiz node'u kapat", üçüncüsü "açık kalan node'u daha verimli kullan" katmanı.

## MIG mi time-slicing mi?

Hangi izolasyon seviyesine ihtiyacınız olduğuna bağlı. MIG (Multi-Instance GPU), NVIDIA'nın donanım seviyesinde bölümleme özelliği; tek bir A100'ü donanımsal bellek ve fault izolasyonuna sahip 7 ayrı instance'a kadar bölebiliyor. Time-slicing ise yazılım seviyesinde, herhangi bir NVIDIA GPU'da çalışan, Kubernetes'te tek bir ConfigMap değişikliğiyle açılabilen bir paylaşım yöntemi.

Fark, izolasyonda. MIG'de her partition kendi belleğine ve hata sınırına sahip — bir partition çökerse diğerleri etkilenmiyor. Time-slicing'de ise kart tek bir havuz gibi paylaşılıyor; donanımsal fault izolasyonu yok, bir workload'un bellek sızıntısı diğerlerini de etkileyebiliyor.

| Yöntem | Donanım gereksinimi | İzolasyon | Tipik maliyet etkisi | En uygun iş yükü |
| --- | --- | --- | --- | --- |
| Paylaşım yok (tam GPU) | Yok | Tam izolasyon | Baz maliyet | Tek büyük model, latency kritik |
| MIG | A100/H100 gibi MIG destekli kart | Donanım seviyesinde | Tam A100'e göre 5-6 kat düşük maliyet/istek | Çoklu servis, güvenlik/izolasyon önemli |
| Time-slicing | Herhangi bir NVIDIA GPU | İzolasyon yok | İstek başına %50-75 düşüş | Homojen, güvenilir workload'lar arası paylaşım |

Pratik kural: farklı takımların ya da güvenlik sınırlarının olduğu ortamlarda MIG, aynı takımın benzer modelleri çalıştırdığı homojen ortamlarda time-slicing daha az operasyonel yük ile benzer kazanç veriyor. Spot instance'larla MIG'i birleştirip tek bir kesintiye açık GPU üzerinde birden fazla model replikası çalıştırmak da mümkün — bu, checkpoint alan batch inference job'ları için uygun, latency'ye duyarlı canlı servis için değil.

Kubernetes'te time-slicing'i açmak, node üzerinde şu tarz bir ConfigMap ile başlıyor:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: nvidia-device-plugin-config
  namespace: kube-system
data:
  time-slicing.yaml: |
    version: v1
    sharing:
      timeSlicing:
        resources:
        - name: nvidia.com/gpu
          replicas: 4
```

Bu tanım, her fiziksel GPU'yu zamanlayıcı seviyesinde 4 replikaya böler; scheduler artık 4 kat daha fazla pod'u aynı karta yerleştirebilir. Değişiklik sadece device plugin config'inde — uygulama kodunda hiçbir değişiklik gerekmiyor.

## GPU maliyeti düşürüldü mü, nasıl ölçülür?

Toplam GPU faturasına değil, $/milyon token (ya da $/inference isteği) ve GPU kullanım yüzdesine bakarak. Kaldırılan kapasiteden gelen daha düşük fatura, geri kalan kapasitenin kullanım oranı gerçekten yükseldiyse bir kazanımdır; aksi halde sadece kapasiteyi başka bir yere taşımış olursunuz.

Altyapı seviyesindeki bu üç adımın (spot, scale-to-zero, MIG/time-slicing) üzerine, request batching ve model quantization ekleniyor. Batching, birden fazla isteği tek bir GPU çağrısında toplayarak GPU-saniyesi başına daha fazla iş yaptırıyor. Quantization ise modeli fp32/fp16 yerine int8/fp8'de çalıştırarak istek başına gereken GPU-saniyesini doğrudan azaltıyor. İkisi de altyapı değişikliklerinin üzerine binen, birbirini dışlamayan katmanlar.

Buradaki açık görüşüm şu: çoğu ekip GPU kullanım oranına hiç bakmadan yeni GPU satın alıyor. Fatura yükseldiğinde ilk refleks "daha fazla kapasite" oluyor, oysa mevcut kartların %5-40 aralığında kullanıldığı bir ortamda yeni kart eklemek sorunu büyütmekten başka bir şey yapmıyor. Önce kullanım oranını ölçmeden GPU satın almak, 2026'da bir mühendislik kararı değil, bir bütçe hatası.

Kubernetes maliyet optimizasyonunun genel prensiplerine [Kubernetes maliyet optimizasyonu](/tr/posts/kubernetes-maliyet-optimizasyonu) yazısında, otomatik ölçeklemenin GPU dışı yük için nasıl kurulduğuna ise [Kubernetes otomatik ölçekleme rehberi](/tr/posts/kubernetes-otomatik-olcekleme-rehberi) yazısında daha detaylı değindik. LLM tarafında token başına maliyeti düşürmek istiyorsanız [LLM token maliyetini düşürme](/tr/posts/llm-token-maliyetini-dusurme) yazısı bu makaleyi tamamlıyor; FinOps sürecini genel olarak kurmak için [FinOps ile bulut maliyeti düşürme](/tr/posts/finops-bulut-maliyeti-dusurme) yazısına bakabilirsiniz. Aynı gün yayınlanan [gözlemlenebilirlik faturasını düşürme](/tr/posts/gozlemlenebilirlik-faturasini-dusur) yazısı da benzer bir "faturayı gerçek kullanıma göre kes" mantığını observability tarafında ele alıyor.

Konuyla ilgili daha fazla veri ve pratik için nOps'un [GPU cost optimization](https://www.nops.io/blog/gpu-cost-optimization/) yazısına, fractional GPU mimarisi için Cast AI'nin [fractional GPU Kubernetes](https://cast.ai/blog/fractional-gpu-kubernetes/) yazısına ve MIG/time-slicing/MPS karşılaştırması için CloudRPS'in [fractional GPUs Kubernetes](https://cloudrps.com/blog/fractional-gpus-kubernetes-mig-time-slicing-mps/) yazısına bakabilirsiniz.

## Batching ve Quantization Neden Ayrı Bir Katman?

Çünkü spot, scale-to-zero ve MIG/time-slicing donanım seviyesinde "hangi kapasiteyi ne kadar açık tutuyoruz" sorusuna cevap verirken, batching ve quantization "her bir istek ne kadar GPU-saniyesi tüketiyor" sorusuna cevap veriyor. Bir ekip donanım tarafında mükemmel bir iş çıkarsa bile, her isteği tek tek işleyip fp16'da tam hassasiyetle çalıştırıyorsa, altyapı kazanımlarının önemli bir kısmını modelin kendisinde harcamış olur.

Pratikte sıralama şöyle işliyor: önce donanım katmanını (spot, scale-to-zero, MIG/time-slicing) devreye alıp faturayı kapasite tarafında düşürün; ardından batching ile birden fazla isteği tek GPU çağrısında toplayarak GPU-saniyesi başına verimi artırın; son olarak, doğruluk kaybını test ederek quantization'ı (int8/fp8) uygulayın. Üç katman birbirini dışlamıyor — aksine, en büyük toplam tasarruf, hepsinin birlikte uygulanmasından geliyor. Tek başına donanım optimizasyonu yapıp modeli olduğu gibi bırakmak, masadaki tasarrufun yarısını bırakmak anlamına gelebilir.

## Sıkça Sorulan Sorular

### Spot GPU instance'lar eğitim job'ları için ne kadar tasarruf sağlıyor?

Spot/preemptible GPU instance'lar on-demand fiyata göre %60-90 daha ucuz. Karşılığında sağlayıcı kapasiteyi kısa bildirimle geri alabiliyor; bu risk, düzenli checkpoint alan batch ve eğitim job'ları için yönetilebilir, sürekli açık kalması gereken canlı servisler için ise ek önlem gerektiriyor.

### MIG ile time-slicing arasındaki temel fark nedir?

MIG, NVIDIA donanımının desteklediği kartlarda (ör. A100) bir GPU'yu donanım seviyesinde izole 7 instance'a kadar bölüyor ve tam A100'e göre istek başına 5-6 kat maliyet düşüşü sağlıyor. Time-slicing ise herhangi bir NVIDIA GPU'da çalışan, donanım izolasyonu olmayan yazılım tabanlı paylaşım; istek başına %50-75 düşüş sağlıyor ama workload'lar arasında fault izolasyonu yok.

### GPU maliyet optimizasyonuna hangi adımla başlamalıyım?

2026 için önerilen sıralama: önce eğitim job'larını spot node'lara taşıyın (%60-70 tasarruf), sonra GPU node pool'larında scale-to-zero'yu açın (%50-65 tasarruf), son olarak inference node'larında time-slicing veya MIG'i etkinleştirin (%50-75 GPU başına maliyet düşüşü). Bu sıralama en düşük efor/en yüksek etki ilişkisine göre kurulmuş.

### GPU faturası düştü ama performans etkilendi mi, nasıl anlarım?

Toplam GPU harcamasına değil, $/milyon token ya da $/inference isteği ile GPU kullanım yüzdesine bakın. Fatura düşmüş ama kalan kapasitenin kullanım oranı yükselmemişse, kapasiteyi azaltmışsınızdır ama verimliliği artırmamışsınızdır; asıl hedef ikisinin birlikte iyileşmesi.
