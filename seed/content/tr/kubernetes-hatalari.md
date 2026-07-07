---
title: "Kaçınmanız Gereken 10 Kubernetes Hatası"
slug: "kubernetes-hatalari"
translationKey: "kubernetes-mistakes"
locale: "tr"
excerpt: "2026'da üretim cluster'larını hâlâ çökerten 10 Kubernetes hatası: eksik kaynak isteğinden düz metin secret'lara kadar her biri için sorunu kapatan tam manifest."
category: "devops-cloud"
tags: ["kubernetes", "devops", "containers", "best-practices"]
publishedAt: "2026-07-04"
seoTitle: "Kaçınmanız Gereken 10 Kubernetes Hatası (2026)"
seoDescription: "En sık yapılan Kubernetes hataları ve 1.33+ cluster'larda çözümleri: kaynak istekleri, probe'lar, secret yönetimi, PSA ve HA. 2026 için gerçek manifest'ler."
---

En sık yapılan Kubernetes hataları; pod'ları kaynak isteği olmadan, health probe'suz ve yüksek erişilebilirlik kurulumu olmadan yayına almak, sonra bu eksikleri gece 02.00'deki bir olay sırasında keşfetmektir. Aşağıdaki her hatayı gerçek üretim cluster'larında bizzat çözdük ve her biri için sorunu kapatan tam manifest veya komutu verdik. Bu on hatayı düzeltirseniz kendi elinizle yarattığınız kesintilerin büyük kısmını ortadan kaldırırsınız.

Temmuz 2026 itibarıyla desteklenen Kubernetes sürümleri 1.35, 1.34 ve 1.33 (güncel sürüm v1.36, 1.37 Ağustos sonunda geliyor). Buradaki her şey 1.33+ çalıştıran her dağıtım için geçerli — EKS, GKE, AKS ya da bare-metal k3s. Örnekler sade `kubectl` ve standart YAML kullanır; hiçbiri sağlayıcıya kilitli değil.

## En sık yapılan Kubernetes hataları nelerdir?

En sık yapılan Kubernetes hataları üç başlıkta toplanır: **kaynak yönetiminin olmaması** (eksik requests, limits ve quota), **erişilebilirlik garantisinin olmaması** (probe yok, tek replika, disruption budget yok) ve **zayıf güvenlik varsayılanları** (root container, düz metin secret, sonuna kadar açık RBAC). Aşağıdaki liste, kabaca ekiplerin en sık takıldığı sıraya göre dizildi.

### 1. Pod'ları kaynak isteği ve limiti olmadan çalıştırmak

Bir numaralı Kubernetes hatası budur. `requests` olmadan scheduler pod'ları akıllıca yerleştiremez ve tek bir gürültücü komşu tüm node'u aç bırakır. `limits` olmadan bir bellek sızıntısı, o makinedeki tüm pod'ları çökertir.

```yaml
resources:
  requests:
    cpu: "250m"
    memory: "256Mi"
  limits:
    memory: "512Mi"   # node genelinde OOM'u önlemek için belleği sınırla
```

Bellek `requests` ve `limits` değerlerini eşitlerseniz Guaranteed QoS sınıfını alırsınız. CPU limitini çoğu durumda koymayın; böylece throttling'den kaçınırsınız. Ve gerçekten iyi bir haber: [in-place pod resize Kubernetes 1.35'te GA oldu](https://kubernetes.io/blog/2025/12/19/kubernetes-v1-35-in-place-pod-resize-ga/) (Aralık 2025), yani artık çalışan bir pod'un CPU ve belleğini yeniden başlatmadan değiştirebilirsiniz. Bu, "ne olur ne olmaz" diye yüksek tahmin yapma bahanesini ortadan kaldırıyor. Doğru boyutlandırmayı [Kubernetes maliyet optimizasyonu](/tr/posts/kubernetes-maliyet-optimizasyonu) rehberimizde detaylı ele aldık.

### 2. `latest` imaj etiketini kullanmak

`image: myapp:latest` bir sürüm değil, hareketli bir hedeftir. İki node "latest"in iki farklı build'ini çekebilir ve geri alacak bir şey kalmadığı için rollback imkânsız hale gelir. Bir keresinde tam bu yüzden yalnızca tek bir replikada var olan bir hatayı bir saat kovaladık.

Değişmez bir etiket, hatta bir digest sabitleyin:

```yaml
image: myapp:1.8.3
# veya tamamen değişmez:
image: myapp@sha256:9b2c...e41
imagePullPolicy: IfNotPresent
```

### 3. Eksik veya yanlış yapılandırılmış health probe

`readinessProbe` olmadan Kubernetes trafiği henüz hazır olmayan pod'lara yönlendirir; her deploy'da kullanıcılar 502 alır. `livenessProbe` olmadan takılan bir süreç havuzda sonsuza dek kalır. Klasik hata, ikisini de aynı endpoint'e yöneltmektir.

```yaml
readinessProbe:
  httpGet: { path: /ready, port: 8080 }
  initialDelaySeconds: 5
  periodSeconds: 5
livenessProbe:
  httpGet: { path: /healthz, port: 8080 }
  initialDelaySeconds: 15
  periodSeconds: 10
```

Liveness kontrolünü ucuz ve bağımlılıksız tutun. Veritabanını sorgulayan bir liveness probe, DB her takıldığında pod'unuzu yeniden başlatır. Yavaş açılan uygulamalar için dev bir `initialDelaySeconds` yerine `startupProbe` kullanın.

### 4. Her şeyi `default` namespace'e deploy etmek

`default` namespace'in quota'sı, network policy'si ve net sahipliği yoktur. Her şey üst üste yığılır, RBAC anlaşılmaz olur ve bir ekibin başıboş job'ı bir başkasını etkiler. Daha ilk günden ekip veya ortam başına namespace oluşturun:

```bash
kubectl create namespace payments
kubectl label namespace payments team=billing tier=prod
```

### 5. `ResourceQuota` veya `LimitRange` olmaması

Pod başına limit koysanız bile tek bir Deployment 500 replika isteyip cluster'ı tüketebilir. `ResourceQuota` namespace başına toplam tüketimi sınırlar, `LimitRange` ise makul varsayılanlar verir; böylece açık isteği olmayan pod'lar sıyrılıp geçemez.

```yaml
apiVersion: v1
kind: ResourceQuota
metadata: { name: payments-quota, namespace: payments }
spec:
  hard:
    requests.cpu: "10"
    requests.memory: 20Gi
    limits.memory: 40Gi
```

### 6. Container'ları root olarak çalıştırmak

Varsayılan olarak bir container çoğu zaman UID 0 ile çalışır. Saldırgan container'dan kaçarsa node üzerinde root olarak iner. Bu, yaptığımız her cluster denetiminin en sık çıkan bulgusudur. Yetkileri açıkça düşürün:

```yaml
securityContext:
  runAsNonRoot: true
  runAsUser: 10001
  allowPrivilegeEscalation: false
  readOnlyRootFilesystem: true
  seccompProfile: { type: RuntimeDefault }
  capabilities: { drop: ["ALL"] }
```

Bunu cluster genelinde [Pod Security Admission](https://kubernetes.io/docs/concepts/security/pod-security-admission/)'ı `restricted` moda alarak zorunlu kılın — PSA 1.25'ten beri stabil ve 2026'da hâlâ önerilen temel. `restricted` profili tam da yukarıdaki ayarları ister: root olmayan kullanıcı, tüm capability'lerin düşürülmesi ve bir seccomp profili. Üç yerleşik profilin ötesine geçmek isterseniz Kyverno gibi bir policy motoru kullanın.

### 7. Secret'ları düz ConfigMap veya env değişkeninde tutmak

Bir veritabanı parolasını ConfigMap'e koymak ya da Deployment'ın `env`'inde hardcode etmek, o parolanın Git'e, `kubectl describe` çıktısına ve herkesin terminal geçmişine düşmesi demektir. Kubernetes Secret'ları yalnızca base64 kodlanmıştır, şifreli değildir; bu yüzden en azından etcd'de şifrelemeyi açın ve gerçek secret'ları harici bir depodan çekin.

2026 için iddialı görüşüm: Vault'u dinamik secret'ları için zaten çalıştırmıyorsanız, pragmatik varsayılan External Secrets Operator (ESO)'dur. 45'ten fazla arka uçtan senkronize eder — AWS Secrets Manager, GCP Secret Manager, Azure Key Vault, 1Password — ve Git'te hiç secret materyali bırakmaz.

| Yaklaşım | Şifreli mi? | Rotasyon? | Karar |
|----------|-------------|-----------|-------|
| ConfigMap / env | Hayır | Hayır | Secret için asla |
| Yerel Secret | Yalnızca ayarlanırsa | Manuel | Temel seviye |
| Sealed Secrets | Evet (Git'te) | Manuel | Saf GitOps için iyi |
| External Secrets + bulut/Vault | Evet | Otomatik | Üretim için en iyi |

Bu doğrudan [GitOps](/tr/posts/gitops-nedir) ile örtüşür: `ExternalSecret`'i Git'te tanımlarsınız, operatör gerçek değeri cluster içinde oluşturur.

### 8. Tek replika ve spread kısıtı olmaması

Tek replika, her deploy'un, node drain'in veya spot geri alımın bir kesinti olması demektir. Üç replika bile hepsi aynı node'a düşerse sizi kurtarmaz. En az iki-üç replika çalıştırın ve bunları node ve zone'lara yayın:

```yaml
topologySpreadConstraints:
  - maxSkew: 1
    topologyKey: topology.kubernetes.io/zone
    whenUnsatisfiable: DoNotSchedule
    labelSelector:
      matchLabels: { app: payments-api }
```

### 9. Pod Disruption Budget olmaması

Yükseltme için bir node'u drain ettiğinizde, bir `PodDisruptionBudget` engellemedikçe Kubernetes tüm replikalarınızı seve seve aynı anda tahliye eder. Bu, ekipleri tam da kesinti beklemedikleri rutin cluster yükseltmeleri sırasında vurur.

```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata: { name: payments-pdb }
spec:
  minAvailable: 2
  selector:
    matchLabels: { app: payments-api }
```

### 10. `kubectl logs`'u monitoring sanmak

Kullanıcılar şikâyet ettikten sonra log grep'lemek gözlemlenebilirlik değil, arkeolojidir. Metrik, alarm ve dashboard olmadan sorunları en son siz öğrenirsiniz. Prometheus ve Grafana kurun, altın sinyallere (gecikme, trafik, hata, doygunluk) alarm koyun ve probe'ları alarm sisteminize bağlayın. [Observability 101](/tr/posts/observability-nedir) rehberimizle başlayın ve bunu [üretim için Docker en iyi pratikleri](/tr/posts/docker-en-iyi-pratikleri) ve [CI/CD pipeline nasıl kurulur](/tr/posts/cicd-pipeline-nasil-kurulur) yazılarındaki pratiklerle birleştirin.

## Hızlı bir deploy öncesi kontrol listesi

Herhangi bir iş yükü üretime çıkmadan önce bunu gözden geçirin. Yukarıdaki on hatanın kabaca dokuzunu bir dakikadan kısa sürede yakalar:

1. Her container'da `requests` ve bellek `limits` var.
2. İmajlar `latest` değil, sabitlenmiş etiket veya digest kullanıyor.
3. Readiness ve liveness probe'ları var ve farklı endpoint'lere bakıyor.
4. İş yükü, `ResourceQuota`'lı ayrı bir namespace'te.
5. `securityContext`, `runAsNonRoot` ve bir seccomp profili ayarlıyor, tüm capability'leri düşürüyor.
6. Secret'lar ConfigMap'ten değil, harici bir depodan geliyor.
7. `topologySpreadConstraints` ile en az iki replika var.
8. Bir `PodDisruptionBudget` iş yükünü drain sırasında koruyor.
9. Prometheus pod'u scrape ediyor ve alarmlar tanımlı.

Cluster'ları iyi işletmenin geniş resmi için [platform engineering nedir](/tr/posts/platform-engineering-nedir) yazımıza bakın ve ilgili derinlemesine içerikler için tüm [DevOps & Bulut kategorimize](/tr/category/devops-bulut) göz atın.

## Sıkça Sorulan Sorular

### En yıkıcı tek Kubernetes hatası hangisidir?

Kaynak `requests` ve `limits` değerlerini atlamak. Etki alanı en geniş olandır: kötü scheduling, gürültücü komşu çekişmesi ve alakasız iş yüklerini de çökerten node genelinde OOMKill'ler. Her container'a makul requests ve bellek limiti koymak, kapasiteyle ilgili olayların büyük kısmını tek başına önler — üstelik 1.35'ten beri bunları yeniden başlatmadan canlı olarak değiştirebilirsiniz.

### Kubernetes Secret'ları kullanmak güvenli mi?

Yerel Secret'lar varsayılan olarak yalnızca base64 kodludur, şifreli değildir ve `get secret` RBAC'ı olan herkes okuyabilir. etcd'de encryption at rest'i açın, RBAC'ı kısın ve üretimde değerleri External Secrets Operator ile harici bir yöneticiden çekin ya da Sealed Secrets ile Git'e şifreli yazın. Vault'u gerçekten dinamik, kısa TTL'li kimlik bilgilerine ihtiyacı olan ekiplere saklayın.

### Bir üretim iş yükü kaç replika çalıştırmalı?

En az iki, ideali üç replika; `topologySpreadConstraints` ile node ve availability zone'lara yayılmış ve bir Pod Disruption Budget ile korunmuş şekilde. Tek replika, her node yükseltmesini, spot geri alımını veya çökmeyi kullanıcıya yansıyan bir kesintiye çevirir ki bu, Kubernetes çalıştırmanın çoğu gerekçesini boşa çıkarır.

### Cluster'ımı bu hatalara karşı otomatik nasıl tararım?

Bir policy tarayıcısı çalıştırın. Polaris, Kubescape ve kube-bench gibi araçlar; eksik limitleri, root container'ları ve olmayan probe'ları en iyi pratik temellerine göre işaretler. Bunlardan birini CI'ya bağlayın ki yanlış yapılandırılmış manifest'ler cluster'a ulaşmadan build'i düşürsün; ayrıca çalışma zamanı güvencesi olarak namespace düzeyinde Pod Security Admission'ı zorunlu kılın.
