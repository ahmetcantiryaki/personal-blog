---
title: "Kaçınmanız Gereken 10 Kubernetes Hatası"
slug: "kubernetes-hatalari"
translationKey: "kubernetes-mistakes"
locale: "tr"
excerpt: "Üretimde en sık gördüğümüz 10 Kubernetes hatası: eksik kaynak limitlerinden düz metin secret'lara kadar her biri için kesin çözüm ve manifest örneğiyle."
category: "devops-cloud"
tags: ["kubernetes", "devops", "containers", "best-practices"]
publishedAt: "2026-06-05"
seoTitle: "Kaçınmanız Gereken 10 Kubernetes Hatası (2026)"
seoDescription: "En sık yapılan Kubernetes hataları ve çözümleri: kaynak limitleri, probe'lar, secret yönetimi, HA ve RBAC. 2026 cluster'ları için gerçek manifest ve komutlar."
---

En sık yapılan Kubernetes hataları; pod'ları kaynak isteği olmadan, health probe'suz ve yüksek erişilebilirlik kurulumu olmadan yayına almak, sonra bu eksikleri gece 02.00'deki bir olay sırasında keşfetmektir. Aşağıdaki her hatayı gerçek üretim cluster'larında bizzat çözdük ve her biri için sorunu kapatan tam manifest veya komutu verdik. Bu on hatayı düzeltirseniz kendi elinizle yarattığınız Kubernetes kesintilerinin büyük kısmını ortadan kaldırırsınız.

Bunlar 2026'da Kubernetes 1.29+ çalıştıran her dağıtım için geçerli (EKS, GKE, AKS ya da bare-metal k3s). Örnekler sade `kubectl` ve standart YAML kullanır; hiçbiri sağlayıcıya kilitli değil.

## En sık yapılan Kubernetes hataları nelerdir?

En sık yapılan Kubernetes hataları üç başlıkta toplanır: **kaynak yönetiminin olmaması** (eksik requests, limits ve quota), **sağlık ve erişilebilirlik garantisinin olmaması** (probe yok, tek replika, disruption budget yok) ve **zayıf güvenlik varsayılanları** (root container, düz metin secret, sonuna kadar açık RBAC). Aşağıdaki liste, kabaca ekiplerin en sık takıldığı sıraya göre dizildi.

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

Bellek `requests` ve `limits` değerlerini eşitlerseniz Guaranteed QoS sınıfını alırsınız. CPU limitini çoğu durumda koymayın; böylece throttling'den kaçınırsınız. Boyutlandırmayı detaylı olarak [Kubernetes maliyet optimizasyonu](/blog/kubernetes-maliyet-optimizasyonu) rehberimizde ele aldık.

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

Liveness kontrolünü ucuz ve bağımlılıksız tutun. Veritabanını sorgulayan bir liveness probe, DB her takıldığında pod'unuzu yeniden başlatır.

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
  capabilities: { drop: ["ALL"] }
```

Bunu cluster genelinde Pod Security Admission'ı `restricted` moda alarak veya Kyverno gibi bir policy motoruyla zorunlu kılın.

### 7. Secret'ları düz ConfigMap veya env değişkeninde tutmak

Bir veritabanı parolasını ConfigMap'e koymak ya da Deployment'ın `env`'inde hardcode etmek, o parolanın Git'e, `kubectl describe` çıktısına ve herkesin terminal geçmişine düşmesi demektir. Kubernetes Secret'ları yalnızca base64 kodlanmıştır, şifreli değildir; bu yüzden en azından etcd'de şifrelemeyi açın ve gerçek secret'ları harici bir depodan çekin.

| Yaklaşım | Şifreli mi? | Rotasyon? | Karar |
|----------|-------------|-----------|-------|
| ConfigMap / env | Hayır | Hayır | Secret için asla |
| Yerel Secret | Yalnızca ayarlanırsa | Manuel | Temel seviye |
| Sealed Secrets | Evet (Git'te) | Manuel | GitOps için iyi |
| External Secrets + Vault | Evet | Otomatik | Üretim için en iyi |

### 8. Tek replika ve anti-affinity olmaması

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

Kullanıcılar şikâyet ettikten sonra log grep'lemek gözlemlenebilirlik değil, arkeolojidir. Metrik, alarm ve dashboard olmadan sorunları en son siz öğrenirsiniz. Prometheus ve Grafana kurun, altın sinyallere (gecikme, trafik, hata, doygunluk) alarm koyun ve probe'ları alarm sisteminize bağlayın. Bu, [üretim için Docker en iyi pratikleri](/blog/docker-en-iyi-pratikleri) ve [CI/CD pipeline nasıl kurulur](/blog/cicd-pipeline-nasil-kurulur) rehberlerimizdeki pratiklerle doğrudan örtüşür.

## Hızlı bir deploy öncesi kontrol listesi

Herhangi bir iş yükü üretime çıkmadan önce bunu gözden geçirin. Yukarıdaki on hatanın kabaca dokuzunu bir dakikadan kısa sürede yakalar:

1. Her container'da `requests` ve bellek `limits` var.
2. İmajlar `latest` değil, sabitlenmiş etiket veya digest kullanıyor.
3. Readiness ve liveness probe'ları var ve farklı endpoint'lere bakıyor.
4. İş yükü, `ResourceQuota`'lı ayrı bir namespace'te.
5. `securityContext`, `runAsNonRoot` ayarlıyor ve tüm capability'leri düşürüyor.
6. Secret'lar ConfigMap'ten değil, harici bir depodan geliyor.
7. `topologySpreadConstraints` ile en az iki replika var.
8. Bir `PodDisruptionBudget` iş yükünü drain sırasında koruyor.
9. Prometheus pod'u scrape ediyor ve alarmlar tanımlı.

Cluster'ları iyi işletmenin geniş resmi için [platform engineering nedir](/blog/platform-engineering-nedir) yazımıza bakın ve ilgili derinlemesine içerikler için tüm DevOps ve bulut kategorimize göz atın.

## Sıkça Sorulan Sorular

### En yıkıcı tek Kubernetes hatası hangisidir?

Kaynak `requests` ve `limits` değerlerini atlamak. Etki alanı en geniş olandır: kötü scheduling, gürültücü komşu çekişmesi ve alakasız iş yüklerini de çökerten node genelinde OOMKill'ler. Her container'a makul requests ve bellek limiti koymak, kapasiteyle ilgili olayların büyük kısmını tek başına önler.

### Kubernetes Secret'ları kullanmak güvenli mi?

Yerel Secret'lar varsayılan olarak yalnızca base64 kodludur, şifreli değildir ve `get secret` RBAC'ı olan herkes okuyabilir. etcd'de encryption at rest'i açın, RBAC'ı kısın ve üretimde değerleri External Secrets Operator ile Vault veya bulut sağlayıcınızın secret deposu gibi harici bir yöneticiden çekin.

### Bir üretim iş yükü kaç replika çalıştırmalı?

En az iki, ideali üç replika; `topologySpreadConstraints` ile node ve availability zone'lara yayılmış ve bir Pod Disruption Budget ile korunmuş şekilde. Tek replika, her node yükseltmesini, spot geri alımını veya çökmeyi kullanıcıya yansıyan bir kesintiye çevirir ki bu, Kubernetes çalıştırmanın çoğu gerekçesini boşa çıkarır.

### Cluster'ımı bu hatalara karşı otomatik nasıl tararım?

Bir policy tarayıcısı çalıştırın. Polaris, Kubescape ve kube-bench gibi araçlar; eksik limitleri, root container'ları ve olmayan probe'ları en iyi pratik temellerine göre işaretler. Bunlardan birini CI'ya bağlayın ki yanlış yapılandırılmış manifest'ler cluster'a ulaşmadan build'i düşürsün; ayrıca namespace düzeyinde Pod Security Admission'ı zorunlu kılın.
