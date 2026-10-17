---
title: "Karpenter mi Cluster Autoscaler mı: K8s Ölçeklendirme"
slug: "karpenter-mi-cluster-autoscaler-mi"
translationKey: "karpenter-vs-cluster-autoscaler-2026"
locale: "tr"
excerpt: "AWS ve Azure'da yeni kümeler için Karpenter önerilir; GKE'de Cluster Autoscaler hâlâ birincil seçenek. İkisi de node ölçekler, pod ölçeklemez."
category: "devops-cloud"
tags: ["kubernetes", "cloud", "cost-optimization", "devops"]
publishedAt: "2026-10-17"
seoTitle: "Karpenter mi Cluster Autoscaler mı: 2026 Karşılaştırması"
seoDescription: "AWS'de Karpenter, GKE'de Cluster Autoscaler önerilir. İkisi de node sayısını ölçekler, pod'u değil; aradaki fark consolidation ve provisioning hızında."
---

Kısa cevap: AWS veya Azure'da yeni bir küme kuruyorsanız Karpenter'ı seçin; GKE'deyseniz Cluster Autoscaler hâlâ birincil desteklenen seçenek. Karpenter, bekleyen pod'lar için doğrudan tekil instance açar; Cluster Autoscaler ise önceden tanımlı node grubunu büyütüp küçültür. İkisi de aynı işi yapmaz, bu yüzden "hangisi daha iyi" sorusu bulutunuza ve küme yaşınıza göre değişir.

Kubernetes'te "autoscaling" denince genelde üç farklı katman karışır: HPA pod replika sayısını değiştirir, VPA pod'un kaynak isteğini ayarlar, Karpenter ve Cluster Autoscaler ise küme düzeyinde kaç node olduğunu değiştirir. Bu yazı sadece son ikisini, node ölçeklemeyi karşılaştırıyor.

Bu üç katmanı birbirine karıştırmak, ekiplerin sıkça yaptığı bir hata: "autoscaling kurduk ama maliyet düşmedi" şikayetinin çoğu, sadece HPA kurup node ölçekleyiciyi hiç değiştirmemiş kümelerden geliyor. Pod sayısı arttıkça yeni node açılmıyorsa veya boşta node fazlasıyla kalıyorsa, sorun pod ölçekleyicide değil, node ölçekleyicinin seçiminde veya ayarında.

## Karpenter nedir?

Karpenter, AWS'in geliştirdiği açık kaynaklı bir Kubernetes node provisioning aracı; bekleyen (unschedulable) pod'ları görür görmez, önceden tanımlı bir node grubu veya Auto Scaling Group'a ihtiyaç duymadan doğrudan bulut sağlayıcısından tekil instance talep eder. Bu, "önce node grubunu büyüt, sonra pod'u yerleştir" modelini atlayıp doğrudan "bu pod için en uygun instance tipini aç" modeline geçmek anlamına geliyor.

## Cluster Autoscaler nedir?

Cluster Autoscaler, Kubernetes'in resmi, bulut-bağımsız node ölçekleme bileşeni; önceden tanımlanmış node grupları (AWS'de Auto Scaling Group, GCP'de Managed Instance Group) üzerinde çalışır ve bekleyen pod olduğunda grubun boyutunu artırır, boş node kaldığında azaltır. Karpenter'dan önce yıllarca tek standart seçenekti ve hâlâ mevcut üretim kümelerinin büyük kısmı bunu kullanıyor.

## Karpenter ile Cluster Autoscaler'ın temel farkı ne?

Temel fark provisioning modelinde: Karpenter bekleyen pod'un CPU, bellek ve GPU ihtiyacına göre en uygun instance tipini anlık seçip açar; Cluster Autoscaler ise sabit bir node grubunun boyutunu değiştirir, instance tipi seçimi yapmaz. Bu, Karpenter'ın farklı workload'lar için farklı instance tiplerini aynı kümede, önceden node grubu tanımlamadan karıştırabilmesi anlamına geliyor.

| Özellik | Karpenter | Cluster Autoscaler |
|---|---|---|
| Provisioning modeli | Pod başına doğrudan instance açar | Önceden tanımlı node grubunu ölçekler |
| Instance tipi seçimi | Dinamik, pod ihtiyacına göre | Node grubu tanımında sabit |
| Consolidation (boşta node toplama) | Sürekli, `WhenEmptyOrUnderutilized` politikasıyla | Sadece node eklerken bin-packing, aktif küçültme sınırlı |
| AWS (EKS) desteği | GA, yeni kümelerde önerilen varsayılan | Desteklenir, ama artık ikincil seçenek |
| Azure (AKS) desteği | Giderek yaygınlaşıyor | Desteklenir |
| GKE desteği | Sağlayıcılar arası tutarlılık hâlâ tartışmalı — kendi bulut dokümantasyonunuzu kontrol edin | Birincil desteklenen, üretimde olgun seçenek |
| Olgunluk | Daha yeni, hızla büyüyen vaka sayısı | Köklü, mevcut kümelerin çoğunluğunda hâlâ çalışıyor |

## Consolidation (node küçültme) neden önemli?

Karpenter'ın `WhenEmptyOrUnderutilized` consolidation politikası, kümeyi sürekli tarayıp az kullanılan node'ları daha az sayıda, daha iyi paketlenmiş node'a taşıyor; bu da boşa harcanan kapasiteyi otomatik olarak azaltıyor. Cluster Autoscaler'ın bin-packing mantığı esas olarak node eklerken çalışıyor; node silme tarafında daha muhafazakâr, bu da zamanla düşük kullanımlı node'ların kümede kalıp maliyeti şişirmesine yol açabiliyor.

```yaml
apiVersion: karpenter.sh/v1
kind: NodePool
metadata:
  name: default
spec:
  disruption:
    consolidationPolicy: WhenEmptyOrUnderutilized
    consolidateAfter: 30s
  template:
    spec:
      requirements:
        - key: karpenter.sh/capacity-type
          operator: In
          values: ["spot", "on-demand"]
```

Bu örnekte `consolidateAfter: 30s`, bir node 30 saniye az kullanılır durumda kalırsa Karpenter'ın onu birleştirmeye (consolidate) başlayacağını belirtiyor; bu süre [Kubernetes maliyet optimizasyonu](/tr/posts/kubernetes-maliyet-optimizasyonu) stratejinizin bir parçası olarak ayarlanabilir.

Pratikte bu fark somut bir maliyete dönüşüyor: gece boyunca trafiği düşen bir kümede Cluster Autoscaler, sabah trafik tekrar artana kadar düşük kullanımlı node'ları sıkça canlı tutar; Karpenter ise aynı boşluğu dakikalar içinde fark edip node sayısını küçültür. Bir ekip için bu, aylık bulut faturasında gözle görülür bir fark yaratabilir, ama kesin yüzdeyi vermek kümenin workload desenine bağlı; kendi kullanım verinizi ölçmeden genel bir rakam vermek yanıltıcı olur.

## Hangi bulutta hangisi önerilir?

AWS'de (EKS) 2026 itibarıyla Karpenter GA durumda ve yeni kümeler için önerilen varsayılan; Azure'da (AKS) desteği giderek yaygınlaşıyor. GKE'de ise Cluster Autoscaler hâlâ birincil, üretimde en olgun desteklenen seçenek olarak kalıyor — Karpenter'ın GKE desteğinin ne kadar ilerlediği konusunda kaynaklar birbiriyle çelişiyor, bu yüzden karar vermeden önce kendi bulut sağlayıcınızın resmi dokümantasyonunu kontrol etmek gerekiyor. [ScaleOps'un](https://scaleops.com/blog/karpenter-vs-cluster-autoscaler/) ve [Qovery'nin](https://qovery.com/blog/kubernetes-cluster-autoscaler-vs-karpenter) karşılaştırmaları da bulut sağlayıcıya göre net bir ayrım çiziyor.

## Mevcut kümeyi Karpenter'a geçirmek değer mi?

Yanıt workload çeşitliliğinize bağlı: çok farklı instance tipi ihtiyacı olan, sık değişen workload'larınız varsa Karpenter'ın dinamik provisioning'i [Kubernetes'i hâlâ gerekli](/tr/posts/hala-kubernetes-gerekli-mi-2026) kılan esnekliği artırır. Tek tip, kararlı workload çalıştıran küçük bir kümeyseniz, mevcut Cluster Autoscaler kurulumunu değiştirmenin getirisi düşük olabilir; geçiş riski, kazanılacak maliyet avantajından daha ağır basabilir.

Açıkçası kişisel görüşüm şu: Karpenter'ın asıl gücü maliyet değil, operasyonel basitlik — düzinelerce node grubu tanımlamak zorunda kalmadan tek bir NodePool ile farklı workload'ları karşılayabilmek, [FinOps](/tr/posts/kubernetes-maliyet-finops) ekiplerinin manuel node grubu bakımıyla geçirdiği zamanı gerçekten azaltıyor.

## Karpenter'a geçerken nelere dikkat etmeli?

Geçiş genellikle tek seferde "hepsini değiştir" şeklinde yapılmıyor; önce yeni bir NodePool tanımlayıp mevcut node grubuyla paralel çalıştırmak, sonra trafiği kademeli kaydırmak daha güvenli. Dikkat edilmesi gereken üç nokta: mevcut PodDisruptionBudget'ların Karpenter'ın consolidation sırasında node tahliyesini (drain) engellemediğinden emin olmak, spot instance kullanıyorsanız `capacity-type` kısıtlamalarını doğru tanımlamak ve izleme panellerinizde node sayısı metriğinin artık NodePool bazında değil instance tipi bazında dalgalanacağını hesaba katmak. Mevcut node grubunu geçiş sırasında silmemeniz önerilir; Karpenter'ın yeni NodePool'u stabil çalıştığını birkaç gün gözlemleyip doğruladıktan sonra eski grubu kademeli olarak sıfıra indirip kaldırmak, tek seferlik bir kesintiyle tüm kümeyi riske atmaktan çok daha güvenli. [Cast AI](https://cast.ai/blog/karpenter-vs-cluster-autoscaler/) ve [DZone](https://dzone.com/articles/karpenter-vs-kubernetes-cluster-autoscaler)'ın 2026 karşılaştırmaları da bu kademeli geçiş yaklaşımını öneriyor.

| Geçiş adımı | Risk | Azaltma |
|---|---|---|
| Paralel NodePool kurulumu | Çift ölçekleme, beklenmedik maliyet artışı | Mevcut node grubunu geçiş süresince sabit tutun |
| PodDisruptionBudget kontrolü | Consolidation sırasında pod kesintisi | Minimum replika sayısını geçiş öncesi doğrulayın |
| Spot instance kısıtlamaları | Kritik workload'un spot'a düşmesi | `capacity-type: on-demand` ile kritik pod'ları ayırın |

## Karpenter ve Cluster Autoscaler birlikte mi çalışır, yoksa biri mi seçilir?

İkisi aynı kümede birlikte çalışmaz; node ölçekleme için ikisinden birini seçmeniz gerekiyor. Ancak her iki araç da [HPA ve VPA](/tr/posts/kubernetes-otomatik-olcekleme-rehberi) ile birlikte çalışabilir, çünkü onlar pod sayısını ve pod kaynak isteğini ölçekliyor; node ölçekleyici ise bu pod'ları barındıracak makine sayısını ayarlıyor. Gerçek üretim kümelerinin çoğu bir node ölçekleyici ile bir pod ölçekleyiciyi birlikte çalıştırıyor.

## Sıkça Sorulan Sorular

### Karpenter, Cluster Autoscaler'ın yerini mi alıyor?

AWS ve Azure'da yeni kümeler için evet, Karpenter önerilen varsayılan hâline geldi. Ama GKE'de Cluster Autoscaler hâlâ birincil desteklenen seçenek, bu yüzden "yerini alıyor" ifadesi bulut sağlayıcınıza göre değişiyor; kendi bulutunuzun resmi dokümantasyonunu kontrol edin.

### Karpenter ve Cluster Autoscaler, HPA'nın yerini tutar mı?

Hayır. HPA (Horizontal Pod Autoscaler) pod replika sayısını değiştirir; Karpenter ve Cluster Autoscaler ise bu pod'ları çalıştıracak node sayısını değiştirir. İkisi farklı katmanlarda çalışır ve genellikle birlikte kullanılır, biri diğerinin yerini tutmaz.

### Karpenter üretimde kullanılabilir mi?

Evet, Karpenter AWS EKS üzerinde GA (genel kullanıma açık) durumda ve 2026 itibarıyla yeni kümeler için önerilen varsayılan seçenek. Azure AKS desteği giderek yaygınlaşıyor; GKE desteği konusunda kaynaklar arasında tutarsızlık var, bulut sağlayıcınızın güncel dokümantasyonunu kontrol etmeniz gerekiyor.

### Mevcut Cluster Autoscaler kurulumunu Karpenter'a geçirmeli miyim?

Workload'larınız çok çeşitli instance tipi gerektiriyorsa ve sık değişiyorsa, geçiş genellikle değer; tek tip, kararlı workload çalıştıran küçük kümelerde ise geçiş riski, kazanılacak maliyet avantajını geçebilir. Karar vermeden önce mevcut node kullanım oranlarınızı ölçün.

