---
title: "Kubernetes Maliyet Optimizasyonu: 10 Taktik"
slug: "kubernetes-maliyet-optimizasyonu"
translationKey: "kubernetes-cost-optimization"
locale: "tr"
excerpt: "Sahada denenmiş 10 Kubernetes maliyet optimizasyonu taktiği: yerinde VPA resize, spot node, Karpenter 1.13, HPA, bin packing ve gerçek komut çıktılarıyla kanıt."
category: "devops-cloud"
tags: ["kubernetes", "cost-optimization", "cloud", "devops"]
publishedAt: "2026-07-03"
seoTitle: "Kubernetes Maliyet Optimizasyonu: 10 Taktik"
seoDescription: "2026 için Kubernetes maliyet optimizasyonu: yerinde pod resize, spot node, Karpenter, HPA/VPA, bin packing ve idle temizliği. Gerçek komutlar ve güncel sayılar."
---

Kubernetes maliyet optimizasyonu, cluster faturanızı iş yükü performansından ödün vermeden düşürmek için kaynak talebini gerçek kullanıma yaklaştırma pratiğidir. En hızlı kazanç üç yerden gelir: aşırı ayrılmış CPU/RAM'i küçültmek, spot node kullanmak ve boşta duran kaynakları kapatmak. Aşağıdaki 10 taktik sahada uyguladığımız sırayla; bu yıl içlerinden biri esaslı biçimde değişti.

Bir müşteride bu listeyi uygulayarak aylık EKS faturasını 24.800 dolardan 11.300 dolara indirdik; SLA'lardan taviz vermeden. Taktikler bulut sağlayıcıdan bağımsız çalışır (EKS, GKE, AKS); örnek komutlar `kubectl` ve yaygın açık kaynak araçlarıyla verilmiştir.

## Kubernetes maliyetlerini ne şişiriyor?

Fatura neredeyse her zaman üç kaynağa dayanır: **aşırı provizyon** (istenen kaynak, kullanılandan çok fazla), **boşta node'lar** (düşük bin packing yüzünden yarı dolu makineler) ve **on-demand fiyatlandırma** (spot yerine tam fiyat ödemek). CNCF'in 2026'da yayımladığı cloud native FinOps mikro-anketi bu konuda açık sözlü: uygulamacıların %70'i bir numaralı savurganlık kaynağı olarak aşırı provizyonu gösteriyor ve cluster'larda ortalama CPU kullanımı %10, bellek kullanımı %23 civarında. Bu bir ince ayar sorunu değil, doğrudan yanan para.

Sorunu görmeden düzeltemezsiniz. İlk iş, kaynak kullanımını ölçmek:

```bash
# En çok CPU/RAM ayıran ama az kullanan pod'ları bul
kubectl top pods --all-namespaces --sort-by=cpu | head -20

# Node başına ayrılmış vs kullanılan kaynak
kubectl describe nodes | grep -A5 "Allocated resources"
```

## Right-sizing için hangi taktikler işe yarıyor?

Right-sizing, Kubernetes maliyet optimizasyonunun temelidir ve genellikle tek başına faturanın %30-50'sini kurtarır. Aşağıdaki 10 taktiği etki/çaba önceliğine göre sıraladık.

### 1. Kaynak isteklerini gerçek kullanıma göre küçültün

Çoğu ekip `requests` değerlerini "her ihtimale karşı" yüksek tutar. Prometheus'tan 7-14 günlük p95 kullanımı çekip istekleri buna göre ayarlayın. Bir Java servisinde `cpu: 2000m` isteğini `600m`'e çektik; pod'lar aynı gecikmeyle çalıştı ama node başına 3 kat daha fazla pod sığdı.

### 2. VPA'yı sadece öneri değil, yerinde resize için kullanın

2026'nın büyük değişikliği bu. In-Place Pod Resize [Kubernetes v1.35'te stable seviyeye ulaştı](https://kubernetes.io/blog/2025/12/19/kubernetes-v1-35-in-place-pod-resize-ga/) (Aralık 2025) ve Vertical Pod Autoscaler artık `InPlaceOrRecreate` güncelleme modunu getiriyor: çalışan bir pod'un CPU ve bellek değerini, CPU tarafında hiçbir yeniden başlatma veya kopan bağlantı olmadan ayarlıyor. Eskiden bir Postgres pod'unu right-size etmek düşük trafikli bir pencere seçip pod'un yeniden başlamasını izlemek demekti. Artık sürekli oluyor.

Yine de sayıları doğrulamak için temkinli başlıyoruz, öneri modu:

```bash
kubectl get vpa my-app -o jsonpath='{.status.recommendation.containerRecommendations[0].target}'
# {"cpu":"430m","memory":"512Mi"}
```

Hedefler makul görününce stateless workload'ları `InPlaceOrRecreate` moduna geçirip VPA'nın boşta CPU'yu bakım penceresi olmadan kırpmasına izin veriyoruz.

### 3. Horizontal Pod Autoscaler (HPA) ile talebe göre ölçeklenin

Sabit replika sayısı yerine HPA kullanın. Gece trafiği düşen bir API'de minReplicas'ı 10'dan 2'ye çektik; gündüz otomatik 12'ye çıkıyor. Node saatlerinden aylık %40 tasarruf. Bu olması gerekenden daha düşük asılı bir meyve: Rackspace State of Spot 2026 raporuna göre bulut ortamlarının %86'sında hâlâ hiç HPA çalışmıyor.

### 4. Spot / preemptible node'lara geçin

Stateless iş yükleri için spot node'lar, Temmuz 2026 itibarıyla on-demand'a göre %70-90 daha ucuz. Kesinti toleranslı workload'ları spot node havuzuna, kritik olanları on-demand'a yönlendirin:

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

Karpenter, ihtiyaca göre doğru instance tipini saniyeler içinde seçer ve boş node'ları hızla toplar. Haziran 2026 itibarıyla güncel stable hat olan v1.13'te konsolidasyon o kadar agresif ki bir cluster'ı Cluster Autoscaler'dan geçirince node sayısı 28'den 19'a düştü ve bin packing verimliliği arttı. Hâlâ Cluster Autoscaler'daysanız ve node group'ları elle yönetiyorsanız, bu listedeki en yüksek kaldıraçlı değişiklik budur.

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

Tek seferlik optimizasyon çürür. Artık CNCF Incubating statüsündeki ve AI ajanlarının maliyet verisini doğrudan sorgulaması için yerleşik bir MCP sunucusu bile barındıran [OpenCost](https://opencost.io/)'u kurun, namespace/ekip bazında maliyet dağıtın (showback). Bütçe alarmları koyun, haftalık raporu ekiple paylaşın. FinOps Foundation'ın 2026 rakamları argümanı net kılıyor: FinOps pratiği olmayan ekipler bulut harcamasının %32-40'ını çöpe atarken olgun ekipler bunu %15-20'de tutuyor.

## Hangi araçları kullanmalısınız?

2026'da en çok başvurduğumuz araç seti aşağıda; terk edilmiş bir şey benimsemeyin diye güncel durumlarıyla birlikte.

| Araç | Amaç | Sürüm / durum (Tem 2026) | En iyi kullanım |
|------|------|--------------------------|-----------------|
| Karpenter | Node provizyon + bin packing | v1.13, stable | EKS/dinamik ölçekleme |
| OpenCost | Maliyet görünürlüğü | CNCF Incubating, MCP destekli | Showback/chargeback |
| Kubecost | FinOps + öneriler | Ticari (IBM), freemium | Ekip bazlı bütçe |
| VPA | Yerinde right-sizing | `InPlaceOrRecreate` (k8s 1.35+) | Sürekli requests ayarı |
| Goldilocks | VPA görselleştirme | Açık kaynak | Hızlı right-sizing |
| descheduler | Bin packing dengesi | Açık kaynak | Node konsolidasyonu |

Pratik sıra: önce OpenCost ile nerede para gittiğini görün, sonra VPA/Goldilocks ile right-sizing yapın, en son Karpenter + spot ile altyapıyı sadeleştirin. Not: Kubecost, 2024 satın almasının ardından artık bir IBM ürünü — hâlâ sağlam, ama lisanslamayı buna göre planlayın.

## İlk optimizasyon turunu nasıl yaparsınız?

İlk turu, tüm cluster'a dokunmadan tasarrufu kanıtlayacak şekilde tek bir hafta sonuna sıkıştırılmış, ölçülebilir bir döngü olarak yürütün. Her yeni projede izlediğimiz sıra şu:

1. **OpenCost veya Kubecost kurun** ve en az 24 saat veri toplamasını bekleyin.
2. **Son 7-14 günün p95 CPU/RAM** değerlerini Prometheus'tan workload bazında çıkarın.
3. **En pahalı 10 namespace'i** seçip oraya VPA'yı öneri modunda deploy edin.
4. **`requests` değerlerini** p95 hedefine göre, her seferinde bir namespace düşürün — yerinde resize ile bunu yeniden başlatmadan yaparsınız.
5. **HPA ekleyin**: sabit replikalı ama değişken trafikli her servise.
6. **Spot node havuzu oluşturun** ve stateless workload'ları uygun toleration'larla taşıyın.
7. **Karpenter konsolidasyonunu açın**: yarı boş node'lar otomatik toplansın.
8. **Boşta PVC, bağlanmamış LoadBalancer ve ölü namespace'leri** taramanızdan silin.
9. **Bütçe alarmı kurun** ve 7 gün sonra faturayı yeniden ölçün.

Her adım geri alınabilir ve tek tek ölçülebilir; böylece rakamı hangi değişikliğin oynattığını her zaman bilirsiniz.

## Kubernetes maliyet optimizasyonunda nelere dikkat etmeli?

Agresif küçültme performansı bozar. `limits` değerini `requests`'e çok yaklaştırırsanız CPU throttling ve OOMKill yaşarsınız. Değişiklikleri staging'de test edin, p95/p99 gecikmeyi izleyin ve tek seferde tüm cluster'ı değil, kademeli uygulayın. Spot node'larda mutlaka Pod Disruption Budget tanımlayın. Ayrıca her tasarruf kararını maliyet düşüşüyle birlikte bir SLO metriğine bağlayın; aksi halde "ucuz ama yavaş" bir cluster'a sürüklenirsiniz, ki bu da kendi başına bir başarısızlıktır.

İlişkili okumalar: [FinOps ile bulut faturasını düşürme](/tr/posts/finops-bulut-maliyeti-dusurme) rehberimiz bu yazıyla doğrudan eşleşir; [kaçınmanız gereken 10 Kubernetes hatası](/tr/posts/kubernetes-hatalari) ise fazla sıkı ayar yapınca ortaya çıkan güvenilirlik tuzaklarını anlatır. Gözlemlenebilirlik harcamasını kontrol altında tutmak için [Observability 101](/tr/posts/observability-nedir)'e, spot node'ların gerektirdiği PDB disiplini için [kesintisiz deployment](/tr/posts/kesintisiz-deployment) yazısına bakın. Her şey [DevOps & Bulut kategorisi](/tr/category/devops-bulut) sayfamızda indekslidir.

## Sıkça Sorulan Sorular

### Kubernetes maliyet optimizasyonu genellikle ne kadar tasarruf sağlar?

Sahadaki tecrübemizde tipik bir üretim cluster'ı, right-sizing ve spot node kombinasyonuyla %40-60 arası tasarruf eder. En büyük pay right-sizing'den (%30-50) ve spot node geçişinden (%70-90 node indirimi) gelir. İlk ay çift haneli yüzde tasarruf beklemek gerçekçidir.

### Spot node'lar üretim iş yükleri için güvenli mi?

Evet, doğru mimariyle. Stateless, kesinti toleranslı servisleri spot node'lara koyun; Pod Disruption Budget ve birden fazla availability zone kullanın. Stateful veritabanları ve tek replikalı kritik servisleri on-demand veya reserved node'larda tutun.

### Yerinde VPA resize, eski sadece-öneri akışının yerine mi geçiyor?

Kubernetes 1.35+ üzerindeki çoğu stateless workload için evet — `InPlaceOrRecreate`, VPA'nın CPU'yu yeniden başlatmadan ayarlamasına izin verir, böylece bakım penceresi olmadan auto modunda çalıştırabilirsiniz. Yine de hedefleri doğrulamak için öneri modunda başlayıp sayılar oturunca yerinde resize'a geçiyoruz.

### VPA ile HPA'yı aynı anda kullanabilir miyim?

CPU/RAM metriği üzerinde ikisini birlikte kullanmak çakışır. Çözüm: HPA'yı özel metrikler (istek/saniye, kuyruk uzunluğu) üzerinden çalıştırın, CPU/bellek requests'ini VPA'ya bırakın. Bu ayrım, HPA replikaları yatay ölçeklerken VPA'nın her pod'u dikey right-size etmesini sağlar.
