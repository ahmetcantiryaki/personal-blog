---
title: "Kubernetes Maliyeti Nasıl Düşürülür? FinOps Rehberi"
slug: "kubernetes-maliyet-finops"
translationKey: "kubernetes-finops-cost-optimization-2026"
locale: "tr"
excerpt: "Kubernetes maliyetini düşürmek için rightsizing, HPA/VPA, spot instance ve bin-packing'i gözlemlenebilirlik verisiyle yöneten aylık bir FinOps döngüsü kurun."
category: "devops-cloud"
tags: [kubernetes, finops, cost-optimization, cloud]
publishedAt: "2026-09-30"
seoTitle: "Kubernetes Maliyeti Nasıl Düşürülür? FinOps Rehberi"
seoDescription: "Rightsizing, HPA/VPA, spot instance ve bin-packing ile Kubernetes maliyetini güvenilirliği bozmadan düşürmenin aylık FinOps döngüsünü ve risklerini anlatıyoruz."
---

## Kubernetes maliyetleri neden şu anda bu kadar önemli?

Kısa cevap: Bulut altyapısı artık pek çok yazılım şirketinde maaş bordrosundan sonraki en büyük ikinci gider kalemi ve bunu kanıtlayan bir pazar da var. Kubernetes maliyet yönetimi araçları pazarı 2025'te 1,75 milyar dolar büyüklüğe ulaştı; yıllık yaklaşık %27 büyüyerek 2030'a kadar 5,78 milyar dolara çıkması öngörülüyor ([The Business Research Company'nin Eylül 2026 itibarıyla güncel raporu](https://www.openpr.com/news/4642785/kubernetes-cost-management-market-research-reveals-path)).

Bu rakamların arkasında somut bir israf sorunu var. [CAST AI'ın 2026 üretim verilerine göre](https://cast.ai/blog/guide-to-kubernetes-autoscaling-for-cloud-cost-optimization/) kümelerdeki pod'ların ortalama CPU over-provisioning oranı %69, bellek (memory) over-provisioning oranı ise %79. Yani takımların çoğu gerçekte kullandığı kaynağın neredeyse iki katını "request" olarak ayırıyor ve bunun faturasını her ay ödüyor. Konuyu bulut faturası tarafından ele almak isterseniz [FinOps: Bulut Faturasını Nasıl Düşürürsün](/tr/posts/finops-bulut-maliyeti-dusurme) yazımıza bakabilirsiniz; bu yazı ise doğrudan Kubernetes katmanındaki teknik levera'lara odaklanıyor.

## Kubernetes maliyetini düşürmek için hangi teknikler gerçekten işe yarıyor?

Kısa cevap: Yedi ana lever var ve hepsi aynı anda uygulanmaz; en yüksek getiriyi rightsizing ve node bin-packing verir, en yüksek riski ise spot instance'lar taşır. Aşağıdaki tablo her tekniğin tipik tasarruf aralığını, güvenilirlik riskini ve uygulama zorluğunu karşılaştırıyor.

| Teknik | Tipik tasarruf aralığı | Güvenilirlik riski | Uygulama efor |
|---|---|---|---|
| Rightsizing (request/limit ayarı) | %20–50 | Yüksek — agresif kesim throttling ve OOMKill'e yol açar | Orta |
| HPA (yatay ölçekleme) | %10–30 | Düşük-orta — yanlış metrik seçimi gecikmeli tepkiye yol açar | Düşük-orta |
| VPA (dikey ölçekleme) | %20–45 | Orta — auto modu pod'ları yeniden başlatır | Orta |
| Spot / preemptible instance | %60–90 | Yüksek — eviction ve churn availability'yi düşürür | Yüksek |
| Committed-use / Savings Plan | %30–60 | Düşük — ama kapasite esnekliğini azaltır | Düşük |
| Node bin-packing / consolidation | %15–30 | Orta — disruption budget olmadan pod tahliyesi riskli | Orta |
| Idle/orphaned kaynak temizliği | %5–15 | Düşük | Düşük |

Daha fazla taktik ve saha örneği için [Kubernetes Maliyet Optimizasyonu: 10 Taktik](/tr/posts/kubernetes-maliyet-optimizasyonu) yazımıza da göz atabilirsiniz.

### CPU ve memory request/limit'lerini nasıl doğru rightsize edersiniz?

Kısa cevap: Request'i son iki-dört haftalık p90-p95 kullanım verisine göre ayarlayın, limit'i ise OOMKill riskini önleyecek kadar üstünde tutun; asla tahminle büyük bir sayı yazmayın. [Kubernetes'in VPA belgeleri](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler), önce recommendation-only modunda üretimde izlemeden auto moda geçmemeyi öneriyor, çünkü auto mod pod'u yeniden başlatarak anlık kesintiye yol açabilir.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: checkout-api
spec:
  template:
    spec:
      containers:
        - name: checkout-api
          resources:
            requests:
              cpu: "250m"
              memory: "384Mi"
            limits:
              cpu: "500m"
              memory: "512Mi"
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: checkout-api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: checkout-api
  minReplicas: 3
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 65
```

### HPA ve VPA'yı aynı workload'da birlikte kullanabilir misiniz?

Kısa cevap: Evet ama aynı metrik üzerinden değil. HPA'yı CPU veya bellek yerine QPS ya da kuyruk derinliği gibi özel bir metrikle çalıştırın, VPA'yı ise yalnızca dikey boyutlandırma için kullanın; ikisini aynı anda CPU üzerinden çalıştırırsanız "scaling death spiral" denen salınım (oscillation) oluşur. Sektör verilerine göre VPA ve rightsizing araçları israfın yaklaşık %45'ini, Karpenter gibi node otomatik ölçekleyiciler %26'sını, HPA ise sadece %9'unu yakalıyor; üçü birlikte kullanıldığında toplam tasarruf %50-70 aralığına çıkabiliyor. Otomatik ölçeklemenin tüm katmanlarını (HPA, VPA, cluster autoscaler) karşılaştırmalı gören [Kubernetes Otomatik Ölçekleme Rehberi](/tr/posts/kubernetes-otomatik-olcekleme-rehberi) yazımız bu kısmı daha derinlemesine anlatıyor.

### Spot instance'lar ve committed-use indirimleri ne kadar tasarruf sağlar?

Kısa cevap: Spot/preemptible instance'lar liste fiyatına göre %60-90 daha ucuz olabilir ama herhangi bir anda geri alınabilir; committed-use indirimleri (bir-üç yıllık taahhüt) ise %30-60 tasarruf sağlar ve kesinti riski taşımaz. Stateless ve yeniden başlatılabilir workload'ları (batch job, CI runner, HPA ile ölçeklenen web katmanı) spot'a, veritabanı ve stateful set'leri committed-use'a yönlendirmek en yaygın pratik.

Multi-cloud kullanan ekipler için trade-off farklı işliyor: tek buluta committed-use ile kilitlenmek fiyat avantajı verir ama esnekliği azaltır; iki bulutta workload dağıtmak esneklik verir ama her ikisinde de ayrı ayrı indirim eşiğini yakalamak zorlaştığından toplam maliyet genelde %10-20 daha yüksek çıkar.

### Node bin-packing ve idle kaynak temizliği neden gözden kaçar?

Kısa cevap: Çünkü ikisi de görünür bir performans kazancı vermez, sadece faturayı düşürür ve bu yüzden roadmap'te öncelik kaybeder. Sıkı bin-packing (Karpenter veya cluster-autoscaler ile node'ları konsolide etmek) boş kapasiteyi azaltarak %15-30 tasarruf sağlar; kullanılmayan PVC'ler, eski load balancer'lar ve sıfır replikalı namespace'ler gibi orphaned kaynakların temizliği ise küçük ama kolay bir %5-15'lik kazanç sunar.

## Maliyet verisini performans ve observability verisiyle nasıl ilişkilendirirsiniz?

Kısa cevap: Maliyet panosunu asla tek başına okumayın; her rightsizing veya autoscaling değişikliğini p99 gecikme, hata oranı ve throttling metrikleriyle aynı zaman aralığında karşılaştırın. Bir request kesintisi maliyeti düşürürken CPU throttling'i artırıyorsa bu net kazanç değil, gizli bir risk transferidir.

Pratikte bu, Kubecost veya OpenCost gibi bir maliyet aracını Prometheus/Grafana ile aynı dashboard'da göstermek anlamına gelir: sol tarafta namespace başına maliyet, sağ tarafta aynı namespace'in `container_cpu_cfs_throttled_periods_total` ve OOMKill sayısı. Bu ikisini yan yana görmeden alınan hiçbir rightsizing kararı güvenilir değildir. Log, metrik ve trace'in birbirini nasıl tamamladığını hatırlamak isterseniz [Observability 101: Log, Metrik ve Trace](/tr/posts/observability-nedir) yazımız temel kavramları özetliyor.

## Küçük bir platform ekibi aylık FinOps review döngüsünü nasıl kurar?

Kısa cevap: Dört adımlı, bir saatlik aylık bir toplantı yeterli: (1) namespace başına maliyet ve trend raporu çıkar, (2) VPA önerileriyle gerçek kullanım verisini karşılaştır, (3) throttling/OOMKill/eviction sayılarını aynı dönemle kesiştir, (4) en yüksek israf-en düşük risk kesişimindeki üç workload'ı o ay rightsize et.

[FinOps Foundation'ın crawl-walk-run olgunluk modeli](https://www.finops.org/introduction/what-is-finops/) küçük ekipler için de geçerli: ilk ayda sadece görünürlük kurun (maliyet etiketleme, namespace ayrımı), ikinci ve üçüncü ayda rightsizing ve HPA ayarlarını devreye alın, dördüncü aydan itibaren spot ve committed-use kararlarını finans ekibiyle birlikte verin. Bu süreci bir platform ekibinin genel sorumluluklarıyla birlikte kurmak isteyenler [Platform Engineering Nedir?](/tr/posts/platform-engineering-nedir) yazımıza bakabilir. Her döngüyü bir önceki ayın throttling/eviction verisiyle kapatmak, ekibin "çok mu kestik" sorusuna veriyle cevap vermesini sağlar.

## Maliyeti aşırı optimize etmenin riskleri nelerdir?

Kısa cevap: En büyük risk, request'leri gerçek kullanımın altına çekerek throttling ve OOMKill'i artırmak; ikinci risk ise kritik workload'ların büyük bir kısmını spot instance'a taşıyarak eviction fırtınalarında availability'yi düşürmek. CPU limiti gevşek ama request'i düşük bırakılan bir pod, node yoğunlaştığında saniyeler içinde throttle edilip p99 gecikmesini katlayabilir. Bu ve benzeri tuzakları daha geniş listede görmek için [Kaçınmanız Gereken 10 Kubernetes Hatası](/tr/posts/kubernetes-hatalari) yazımız işe yarar.

Rahatsız edici gerçek şu ki çoğu ekip rightsizing'i bir kere yapılıp bitirilen bir proje gibi görüyor. Oysa trafik deseni değiştikçe eski request değerleri hızla yanlış hale geliyor ve altı ay önce doğru olan bir ayar bugün OOMKill'e sebep olabiliyor. Sürekli izleme olmadan yapılan tek seferlik rightsizing, kısa vadede maliyet panosunda iyi görünür ama uzun vadede güvenilirlik borcu biriktirir.

## Sıkça Sorulan Sorular

### HPA mı VPA mı kullanmalıyım?

Kısa cevap: İkisi rakip değil, tamamlayıcı; HPA replika sayısını (yatay), VPA ise tek pod'un CPU/bellek boyutunu (dikey) ayarlar. Aynı workload'da ikisini aynı metrik üzerinden aynı anda çalıştırmayın, aksi hâlde salınım (oscillation) oluşur ve pod'lar sürekli yeniden boyutlanıp ölçeklenir.

### Rightsizing ne sıklıkla yapılmalı?

Kısa cevap: Trafiği değişken workload'lar için ayda bir, stabil batch işler için üç ayda bir yeterli; VPA'yı recommendation modunda sürekli açık bırakıp önerileri bu döngüde gözden geçirmek en pratik yöntem. Büyük bir trafik değişikliğinden (kampanya, yeni özellik lansmanı) sonra döngü dışında da ayrıca bir kontrol yapılmalı.

### Spot instance'lar production'da güvenli mi?

Kısa cevap: Evet, ama yalnızca stateless ve yeniden başlatılabilir workload'lar için; PodDisruptionBudget tanımlamadan ve birden fazla instance tipine dağıtmadan spot'a geçmek availability'yi doğrudan düşürür. Kritik, tek replikalı veya stateful servisleri spot'a taşımayın.

### Kubernetes maliyetini izlemek için hangi araçlar kullanılır?

Kısa cevap: OpenCost (CNCF'in açık kaynak projesi) ve Kubecost en yaygın kullanılan namespace/pod bazlı maliyet görünürlüğü araçları; bulut sağlayıcıların kendi cost explorer'ları ise yalnızca hesap veya etiket bazlı görünürlük verir, pod bazlı değil. Küçük ekipler genelde OpenCost ile başlayıp ihtiyaç büyüdükçe ticari bir platforma geçiyor.
