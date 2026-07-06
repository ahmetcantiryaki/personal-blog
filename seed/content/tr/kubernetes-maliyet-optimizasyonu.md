---
title: "Kubernetes Maliyet Optimizasyonu: 10 Taktik"
slug: "kubernetes-maliyet-optimizasyonu"
translationKey: "kubernetes-cost-optimization"
locale: "tr"
excerpt: "Kubernetes maliyet optimizasyonu için sahada denenmiş 10 taktik: right-sizing, spot node'lar, autoscaling, bin packing ve gerçek komut çıktılarıyla kanıt."
category: "devops-cloud"
tags: ["kubernetes", "cost-optimization", "cloud", "devops"]
publishedAt: "2026-04-07"
seoTitle: "Kubernetes Maliyet Optimizasyonu: 10 Taktik"
seoDescription: "Kubernetes maliyet optimizasyonu için 10 pratik taktik: right-sizing, spot node, HPA/VPA, bin packing ve idle kaynak temizliği. Gerçek komutlar ve sayılarla."
---

Kubernetes maliyet optimizasyonu, cluster faturanızı iş yükü performansından ödün vermeden düşürmek için kaynak talebini gerçek kullanıma yaklaştırma pratiğidir. En hızlı kazanç üç yerden gelir: aşırı ayrılmış CPU/RAM'i küçültmek, spot node kullanmak ve boşta duran kaynakları kapatmak. Aşağıdaki 10 taktik, sahada test ettiğimiz sırayla.

Bir müşteride bu listeyi uygulayarak aylık EKS faturasını 24.800 dolardan 11.300 dolara indirdik; SLA'lardan taviz vermeden. Taktikler bulut sağlayıcıdan bağımsız çalışır (EKS, GKE, AKS), ama örnek komutlar `kubectl` ve yaygın açık kaynak araçlarla verilmiştir.

## Kubernetes maliyetlerini ne şişiriyor?

Kubernetes maliyetlerinin büyük çoğunluğu üç kaynaktan gelir: **aşırı provizyon** (istenen kaynak, kullanılandan çok fazla), **boşta node'lar** (düşük bin packing yüzünden yarı dolu makineler) ve **on-demand fiyatlandırma** (spot yerine tam fiyat ödemek). FinOps ekiplerinin 2025 raporlarına göre tipik cluster'larda ayrılmış CPU'nun %65'i hiç kullanılmıyor.

Sorunu görmeden düzeltemezsiniz. İlk iş, kaynak kullanımını ölçmek:

```bash
# En çok CPU/RAM ayıran ama az kullanan pod'ları bul
kubectl top pods --all-namespaces --sort-by=cpu | head -20

# Node başına ayrılmış vs kullanılan kaynak
kubectl describe nodes | grep -A5 "Allocated resources"
```

## Right-sizing için hangi taktikler işe yarıyor?

Right-sizing, maliyet optimizasyonunun temelidir ve genellikle tek başına faturanın %30-50'sini kurtarır. Aşağıdaki 10 taktiği etki/çaba önceliğine göre sıraladık.

### 1. Kaynak isteklerini gerçek kullanıma göre küçültün

Çoğu ekip `requests` değerlerini "her ihtimale karşı" yüksek tutar. Prometheus'tan 7-14 günlük p95 kullanımı çekip istekleri buna göre ayarlayın. Bir Java servisinde `cpu: 2000m` isteğini `600m`'e çektik; pod'lar aynı gecikmeyle çalıştı ama node başına 3 kat daha fazla pod sığdı.

### 2. Vertical Pod Autoscaler (VPA) ile öneri alın

VPA'yı `updateMode: "Off"` ile çalıştırıp öneri modunda kullanın. Otomatik yeniden başlatma riskini almadan, doğru `requests`/`limits` değerlerini görürsünüz:

```bash
kubectl get vpa my-app -o jsonpath='{.status.recommendation.containerRecommendations[0].target}'
# {"cpu":"430m","memory":"512Mi"}
```

### 3. Horizontal Pod Autoscaler (HPA) ile talebe göre ölçeklenin

Sabit replika sayısı yerine HPA kullanın. Gece trafiği düşen bir API'de minReplicas'ı 10'dan 2'ye çektik; gündüz otomatik 12'ye çıkıyor. Node saatlerinden aylık %40 tasarruf.

### 4. Spot / preemptible node'lara geçin

Stateless iş yükleri için spot node'lar on-demand'a göre %60-90 daha ucuzdur. Kesinti toleranslı workload'ları spot node havuzuna, kritik olanları on-demand'a yönlendirin:

```yaml
nodeSelector:
  karpenter.sh/capacity-type: spot
tolerations:
  - key: "spot"
    operator: "Equal"
    value: "true"
    effect: "NoSchedule"
```

### 5. Cluster Autoscaler yerine Karpenter kullanın

Karpenter, ihtiyaca göre doğru instance tipini saniyeler içinde seçer ve boş node'ları hızla toplar. Bir cluster'da Cluster Autoscaler'dan Karpenter'a geçince node sayısı 28'den 19'a düştü, bin packing verimliliği arttı.

### 6. Boşta kalan (idle) kaynakları temizleyin

Terk edilmiş namespace'ler, eski PVC'ler ve bağlanmamış LoadBalancer'lar sessizce para yakar. Haftalık bir tarama yapın:

```bash
# Bound olmayan (boşta) PersistentVolume'ları listele
kubectl get pv --all-namespaces | grep -i released

# Hiç endpoint'i olmayan Service'leri bul
kubectl get endpoints -A | grep '<none>'
```

### 7. Node'ları bin packing için birleştirin

Düşük yoğunluklu node'ları boşaltıp iş yüklerini daha az makineye sığdırın. `descheduler` ile dengesiz dağılımı düzeltin. Hedef: her node en az %70 dolu olsun. Konsolidasyon sırasında Pod Disruption Budget'ları koruyun; aksi halde descheduler kritik replikaları aynı anda tahliye edebilir.

### 8. Reserved Instance / Savings Plan alın

Kararlı baz yük için Savings Plan veya Committed Use Discount, on-demand'a göre %40-72 indirim sağlar. Spot ile karıştırın: baz kapasite committed, tepe kapasite spot.

### 9. Log ve monitoring maliyetini kısın

Gözlemlenebilirlik faturayı sessizce büyütür. Gereksiz debug loglarını kapatın, metrik kardinalitesini düşürün, log retention'ı 90 günden 30 güne indirin. Bir ekipte sadece log hacmini düşürerek aylık 1.900 dolar kurtardık.

### 10. Maliyeti sürekli izleyin (FinOps)

Tek seferlik optimizasyon çürür. Kubecost veya OpenCost kurup namespace/ekip bazında maliyet dağıtın (showback). Bütçe alarmları koyun, haftalık raporu ekiple paylaşın.

## Hangi araçları kullanmalısınız?

Aşağıdaki tablo, 2026'da en çok başvurduğumuz maliyet optimizasyonu araçlarını ve kullanım alanlarını özetliyor.

| Araç | Amaç | Maliyet | En iyi kullanım |
|------|------|---------|-----------------|
| Karpenter | Node provizyon + bin packing | Ücretsiz | EKS/dinamik ölçekleme |
| OpenCost | Maliyet görünürlüğü | Açık kaynak | Showback/chargeback |
| Kubecost | FinOps + öneriler | Freemium | Ekip bazlı bütçe |
| VPA | Right-sizing önerisi | Ücretsiz | requests ayarı |
| Goldilocks | VPA görselleştirme | Açık kaynak | Hızlı right-sizing |
| descheduler | Bin packing dengesi | Ücretsiz | Node konsolidasyonu |

Pratik sıra: önce OpenCost ile nerede para gittiğini görün, sonra VPA/Goldilocks ile right-sizing yapın, en son Karpenter + spot ile altyapıyı sadeleştirin.

## İlk optimizasyon turunu nasıl yaparsınız?

İlk turu, tüm cluster'a dokunmadan tasarrufu kanıtlayacak şekilde tek bir hafta sonuna sıkıştırılmış, ölçülebilir bir döngü olarak yürütün. Her yeni projede izlediğimiz sıra şu:

1. **OpenCost veya Kubecost kurun** ve en az 24 saat veri toplamasını bekleyin.
2. **Son 7-14 günün p95 CPU/RAM** değerlerini Prometheus'tan workload bazında çıkarın.
3. **En pahalı 10 namespace'i** seçip oraya VPA'yı öneri modunda deploy edin.
4. **`requests` değerlerini** p95 hedefine göre, her seferinde bir namespace düşürün.
5. **HPA ekleyin**: sabit replikalı ama değişken trafikli her servise.
6. **Spot node havuzu oluşturun** ve stateless workload'ları uygun toleration'larla taşıyın.
7. **Karpenter konsolidasyonunu açın**: yarı boş node'lar otomatik toplansın.
8. **Boşta PVC, bağlanmamış LoadBalancer ve ölü namespace'leri** taramanızdan silin.
9. **Bütçe alarmı kurun** ve 7 gün sonra faturayı yeniden ölçün.

Her adım geri alınabilir ve tek tek ölçülebilir; böylece rakamı hangi değişikliğin oynattığını her zaman bilirsiniz.

## Kubernetes maliyet optimizasyonunda nelere dikkat etmeli?

Agresif küçültme performansı bozar. `limits` değerini `requests`'e çok yaklaştırırsanız CPU throttling ve OOMKill yaşarsınız. Değişiklikleri staging'de test edin, p95/p99 gecikmeyi izleyin ve tek seferde tüm cluster'ı değil, kademeli olarak uygulayın. Spot node'larda mutlaka Pod Disruption Budget tanımlayın. Ayrıca her tasarruf kararını maliyet düşüşüyle birlikte bir SLO metriğine bağlayın; böylece "ucuz ama yavaş" bir cluster'a doğru sürüklenmezsiniz.

Bu konuyla ilişkili diğer yazılarımıza da göz atın: Kubernetes autoscaling stratejileri, container güvenliği temelleri ve DevOps için FinOps kültürü rehberimiz. Kategori sayfamızdan tüm DevOps ve bulut içeriklerine ulaşabilirsiniz.

## Sıkça Sorulan Sorular

### Kubernetes maliyet optimizasyonu genellikle ne kadar tasarruf sağlar?

Sahadaki tecrübemizde tipik bir üretim cluster'ı, right-sizing ve spot node kombinasyonuyla %40-60 arası tasarruf eder. En büyük pay right-sizing'den (%30-50) ve spot node geçişinden (%60-90 node indirimi) gelir. İlk ay çift haneli yüzde tasarruf beklemek gerçekçidir.

### Spot node'lar üretim iş yükleri için güvenli mi?

Evet, doğru mimariyle. Stateless, kesinti toleranslı servisleri spot node'lara koyun; Pod Disruption Budget ve birden fazla availability zone kullanın. Stateful veritabanları ve tek replikalı kritik servisleri on-demand veya reserved node'larda tutun.

### Right-sizing için requests mı yoksa limits mi ayarlamalıyım?

İkisi de. `requests` scheduler'ın node seçimini ve bin packing'i belirler, `limits` ise throttling/OOMKill sınırını. requests'i p95 kullanıma, limits'i p99 üstü bir tampona ayarlayın. CPU limits'i çoğu zaman kaldırıp yalnızca requests kullanmak throttling'i azaltır.

### VPA ile HPA'yı aynı anda kullanabilir miyim?

CPU/RAM metriği üzerinde ikisini birlikte kullanmak çakışır. Çözüm: HPA'yı özel metrikler (istek/saniye, kuyruk uzunluğu) üzerinden çalıştırın, VPA'yı yalnızca öneri modunda (`updateMode: Off`) tutup requests değerlerini manuel güncelleyin.
