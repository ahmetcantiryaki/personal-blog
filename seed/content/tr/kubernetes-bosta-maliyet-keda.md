---
title: "KEDA ile Boşta Kubernetes Maliyeti Nasıl Kesilir?"
slug: "kubernetes-bosta-maliyet-keda"
translationKey: "kubernetes-idle-costs-keda-2026"
locale: "tr"
excerpt: "KEDA, olay tabanlı Kubernetes iş yüklerini boşken sıfıra indirir; standart HPA bunu yapamaz, çünkü her zaman en az bir replikayı çalışır tutar."
category: "devops-cloud"
tags: ["kubernetes", "cost-optimization", "finops", "automation"]
publishedAt: "2026-11-24"
seoTitle: "KEDA ile Boşta Kubernetes Maliyeti Kesme (2026)"
seoDescription: "KEDA ile olay tabanlı Kubernetes iş yüklerini boşken sıfıra indirin, kube-downscaler ve Karpenter ile eşleyin, SLO'ları koruyacak korkulukları kurun."
---

Kısa cevap: KEDA'yı kurun, iş yükünüzü gerçekten tetikleyen kuyruğa, konuya veya cron zamanlamasına bağlayın ve işlenecek bir şey olmadığında replika sayısını sıfıra indirsin — standart Kubernetes HPA bunu yapamaz, çünkü kuyruk boşken sabah 2'de bile en az bir replikayı çalışır tutar.

## Bir Kubernetes iş yükünü "boşta" ve maliyetli yapan ne?

Bir iş yükü, şu anda kullanılmayan CPU, bellek veya GPU kapasitesini ayırdığında boştadır. Cast AI'nin on binlerce production küme üzerinden derlediği 2026 State of Kubernetes Optimization raporu, medyan GPU kullanımını sadece %5 olarak buluyor; aynı örüntü CPU tabanlı kuyruk tüketicilerinde, batch işlerinde ve gereksiz yere 7/24 çalışan staging ortamlarında da görülüyor. Her boşta pod, hâlâ bir node rezervasyonu tutuyor ve faturaya yansıyan şey, iş yapılsın ya da yapılmasın tam olarak bu rezervasyon.

Kök neden genellikle sabit HTTP trafiği için tasarlanmış, patlamalı (bursty) olay kaynakları için değil, bir ölçeklendirme aracı. Kubernetes'in yerleşik Horizontal Pod Autoscaler'ı her zaman en az bir replikayı çalışır tutmayı gerektiriyor; yani saatte on dakika meşgul olan bir Kafka tüketicisi veya SQS worker'ı, kalan elli dakika için de ücret ödüyor.

## KEDA boşta maliyeti nasıl kesiyor?

KEDA (Kubernetes Event-driven Autoscaling), bir iş yükünü CPU yüzdesi yerine gerçek olay kaynağına göre — kuyruk derinliği, Kafka lag'i, bir cron zamanlaması, bir Prometheus metriği — ölçeklendiriyor ve yapılacak bir şey olmadığında replika sayısını tamamen sıfıra indirebiliyor. KEDA, bir CNCF Graduate projesi ve HPA'nın yerini almıyor; kapak altında HPA nesneleri üretip yönetiyor ve onlara HPA'nın tek başına okuyamayacağı olay tabanlı metrikler besliyor. Deployment, Job ve StatefulSet'lerde çalışıyor.

```yaml
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: order-queue-worker
spec:
  scaleTargetRef:
    name: order-queue-worker
  minReplicaCount: 0
  maxReplicaCount: 20
  cooldownPeriod: 120
  triggers:
    - type: aws-sqs-queue
      metadata:
        queueURL: https://sqs.eu-central-1.amazonaws.com/123456789/orders
        queueLength: "5"
```

`minReplicaCount: 0` ile bu worker, kuyruk boşken sıfır node tutuyor ve ancak mesajlar gelmeye başladığında ölçeklenmeye başlıyor. Google Cloud'un kendi GKE kılavuzu kazancı net koyuyor: maliyeti "ihtiyaten" ayrılmış kapasiteye değil, gerçek kullanıma göre hizalıyor, yalnızca tükettiğiniz kaynak için ödüyorsunuz.

## Production dışı iş yüklerini zamanlanmış şekilde nasıl park edersiniz?

KEDA'nın olay tetikleyicileri arasında bir cron kaynağı da var; bu, uygulama koduna hiç dokunmadan bir Deployment'ı mesai saatleri dışında sıfıra indirmenin en basit yolu. Gerçek bir olay tarafından hiç tetiklenmeyen ortamlar için — saat 19:00'dan sonra kimsenin dokunmadığı bir staging kümesi, sadece hafta içi kullanılan bir demo ortamı — kube-downscaler gibi zamanlanmış bir düşürme denetleyicisi, her `ScaledObject`'e sahte bir cron tetikleyici bağlamaktan daha temiz bir uyumla, düz bir zaman penceresinde aynı sıfıra-indirme sonucunu veriyor.

Kombinasyon önemli: gerçek bir olay sinyali olan iş yükleri için KEDA, sadece bir saate ihtiyacı olanlar için bir downscaler. İkisini birlikte çalıştırmak, production dışı bir namespace'de gece boyunca neredeyse hiçbir şeyin node rezervasyonu tutmaması anlamına geliyor.

## KEDA, cluster autoscaler'ın veya Karpenter'ın yerini alıyor mu?

Hayır — KEDA pod'ları ölçeklendiriyor, node'ları değil. KEDA bir Deployment'ı sıfır pod'a indirdiğinde, artık boşalan node'u kaldırması gereken hâlâ bir cluster autoscaler ya da [Karpenter](/tr/posts/karpenter-mi-cluster-autoscaler-mi), KEDA değil. İkisini eşleştirmek, pod seviyesindeki sıfıra-indirmeyi gerçekten daha düşük bir bulut faturasına çeviren şey: KEDA pod'ları kaldırıyor, Karpenter altındaki node'ları doğru boyutlandırıp kaldırıyor ve gerçekten hiçbir şey çalışmadığında her iki katman için de ödeme yapmayı durduruyorsunuz.

| Araç | Ölçeklendirdiği | Sinyal | Sıfıra indirme |
|---|---|---|---|
| Kubernetes HPA | Pod'lar | CPU/bellek % | Hayır — en az 1 replika |
| KEDA | Pod'lar | Kuyruk derinliği, cron, özel metrikler | Evet |
| kube-downscaler | Pod'lar (replika sayısıyla) | Sabit zaman penceresi | Evet |
| Karpenter / Cluster Autoscaler | Node'lar | Zamanlanamayan pod'lar | Evet, node seviyesinde |

## Sıfıra indirme SLO'ları bozmasın diye hangi korkuluklar gerekiyor?

Sıfıra indirme, boşta kalma maliyetini bir cold start ile takas ediyor: sessiz bir dönemden sonraki ilk istek; pod zamanlamasını, image çekmeyi ve hazırlık (readiness) kontrollerini bekliyor — bu, image boyutuna ve başlangıç işine bağlı olarak birkaç yüz milisaniyeden onlarca saniyeye kadar sürebiliyor. Kullanıcıya dönük herhangi bir şeyde `minReplicaCount: 0` ayarlamadan önce, o servisin SLO'sundaki gecikme bütçesini kontrol edin — arka plan kuyruk worker'ı genellikle bir cold start'ı kaldırabilir, senkron bir API uç noktası kaldıramaz.

Pratik bir orta yol, düşük bir `cooldownPeriod` ile `minReplicaCount: 1` kullanmak; bu, o yolu tamamen sıfıra indirmeden, kuyruk boşaldığı anda eşiğin üzerindeki her replikayı düşürmenize izin veriyor. Gerçek sıfıra-indirmeyi, yanıt süresi bütçesinde boşluğu olan iş yükleri için saklayın ve bir dashboard'un veya müşterinin senkron olarak beklediği her şeyden uzak tutun.

`cooldownPeriod` değerini seçerken de aynı mantığı uygulayın: çok kısa bir süre (örneğin 30 saniye), trafiğin kısa aralıklarla gelip gittiği bir worker'da sürekli ölçek yukarı-aşağı gitmesine (flapping) yol açar ve her ölçeklenmede yeniden bir cold start ödersiniz; çok uzun bir süre ise (örneğin 30 dakika) gerçek boşta kalma penceresini yakalamaz ve KEDA'nın asıl kazandırması gereken tasarrufu buharlaştırır. 120 ile 300 saniye arası, kuyruk tabanlı worker'ların çoğu için makul bir başlangıç noktası; gerçek trafiğinizin burst aralığını bir hafta izleyip buna göre ayarlamak, rastgele bir sayı seçmekten çok daha güvenilir sonuç veriyor.

## Boşta harcamayı düzeltmeden önce nasıl bulursunuz?

Sıfıra indirme, yalnızca zamanının anlamlı bir kısmında gerçekten boşta olan iş yükleri üzerinde kazandırıyor; o yüzden tahmin etmek yerine namespace veya pod seviyesinde maliyet dağılımıyla başlayın. [Kubernetes maliyet optimizasyonu](/tr/posts/kubernetes-maliyet-optimizasyonu) çalışmasının çoğu buradan başlıyor: iş yüklerini ekip ve ortama göre etiketleyin, bir haftalık gerçek CPU/bellek talebini kullanımla karşılaştırın ve rezerve edilen ile kullanılan arasındaki farka göre sıralayın. En büyük farka sahip namespace'ler, bir `ScaledObject`'in veya bir downscaler'ın bir ay sonraki faturada görüneceği yerler — gerisinde ayar çabası genellikle değmiyor. Henüz bir node autoscaler'ına karar vermediyseniz, KEDA'nın kendi yapılandırmasına dokunmadan önce doğru bir sonraki okuma [Karpenter mi Cluster Autoscaler mi](/tr/posts/karpenter-mi-cluster-autoscaler-mi) ve daha geniş [Kubernetes otomatik ölçekleme rehberi](/tr/posts/kubernetes-otomatik-olcekleme-rehberi).

Dürüst görüşüm: KEDA bir "maliyet aracı" olarak anılıyor, ama gerçekte bir doğruluk düzeltmesi — çoğu küme, yükü gerçekten tetikleyen şey bir kuyruk veya bir saatken pod'ları CPU yüzdesine göre ölçeklendiriyor ve boşta harcamanın kaynağı tam olarak bu uyumsuzluk.

Birincil kaynaklar: [keda.sh](https://keda.sh/), [Microsoft Learn'ün AKS için KEDA kılavuzu](https://learn.microsoft.com/azure/aks/keda-about) ve [Cast AI'nin Kubernetes GPU optimizasyonu araştırması](https://cast.ai/blog/kubernetes-gpu-optimization/).

## Sıkça Sorulan Sorular

### KEDA, Kubernetes Horizontal Pod Autoscaler'ın yerini mi alıyor?

Hayır. KEDA, HPA'nın yerini almıyor — kapak altında HPA nesneleri üretip yönetiyor ve onlara kuyruk derinliği veya bir cron zamanlaması gibi HPA'nın tek başına okuyamayacağı olay tabanlı metrikler besliyor. Gerçek ölçeklendirmeyi hâlâ HPA yapıyor; KEDA ne zaman ve ne kadar ölçeklendirileceğine karar veriyor.

### KEDA bir iş yükünü tamamen sıfır replikaya indirebilir mi?

Evet, Deployment, Job ve StatefulSet'lerde; standart HPA'nın yapamadığı tek şey bu — Kubernetes'in yerleşik HPA'sı her zaman en az bir replikayı çalışır tutar. İşlenecek bir olay olmadığında tam bir indirmeye izin vermek için bir `ScaledObject` üzerinde `minReplicaCount: 0` ayarlayın.

### KEDA ile kube-downscaler arasındaki fark nedir?

KEDA, iş yükünün kendisine bağlı gerçek bir olay sinyaline göre ölçeklendiriyor — kuyruk derinliği, Kafka lag'i, özel bir metrik veya bir cron ifadesi. kube-downscaler ise replikaları sabit bir zaman penceresinde indiriyor; bu, anlamlı bir olay kaynağı olmayan ama hâlâ 7/24 çalışmaması gereken production dışı ortamlara uyuyor.

### Sıfıra indirme uygulamamın gecikmesine zarar verir mi?

Verebilir. Sıfıra-indirme döneminden sonraki ilk istek; pod zamanlaması, image çekme ve hazırlık kontrollerinden oluşan bir cold start maliyeti ödüyor — bu, bir saniyenin altından onlarca saniyeye kadar değişebiliyor. Gecikmeye hassas, senkron uç noktalarda `minReplicaCount`'u 1 veya üzerinde tutun; gerçek sıfıra-indirmeyi, yanıt süresi bütçesinde boşluğu olan arka plan ve batch iş yükleri için saklayın.
