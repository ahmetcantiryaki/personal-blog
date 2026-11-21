---
title: "Kubernetes 1.35'te Pod Boyutu Nasıl Değişir?"
slug: "kubernetes-pod-yeniden-baslatmadan-boyutlandirma"
translationKey: "k8s-in-place-pod-resize-2026"
locale: "tr"
excerpt: "Kubernetes 1.35 ile pod yeniden başlatılmadan CPU ve bellek limitleri değiştirilebiliyor; özellik Aralık 2025'te GA oldu ve artık production'da kullanılabilir."
category: "devops-cloud"
tags: ["kubernetes", "devops", "cost-optimization", "reliability"]
publishedAt: "2026-11-21"
seoTitle: "Kubernetes 1.35 Pod Yeniden Boyutlandırma Rehberi"
seoDescription: "Kubernetes 1.35 ile pod yeniden başlatılmadan CPU ve bellek limitleri değiştirilebiliyor; özellik Aralık 2025'te GA oldu ve artık production'da kullanılabilir."
---

Kısa cevap: Kubernetes 1.35'ten itibaren bir pod'un CPU ve bellek `requests`/`limits` değerlerini, pod'u yeniden başlatmadan değiştirebilirsiniz. Bu özelliğin adı "in-place pod resize" ve 17 Aralık 2025'te yayınlanan Kubernetes 1.35 ile kararlı (GA) duruma geçti. Eskiden tek yol pod'u silip yeniden oluşturmaktı; artık kaynak tahsisi canlıyken değişiyor.

## In-place pod resize nedir?

In-place pod resize, çalışan bir container'ın CPU ve bellek kaynak ayarlarını pod'u tahliye etmeden (eviction) veya yeniden oluşturmadan değiştirme yeteneğidir. Container içindeki süreç kesintiye uğramaz, local disk durumu ve bellek içi önbellekler (cache) korunur.

Önceden Kubernetes'te bir pod'un kaynak tahsisi değiştirilmek istendiğinde tek seçenek, Vertical Pod Autoscaler'ın (VPA) "Recreate" modunda olduğu gibi pod'u silip yeni bir pod oluşturmaktı. Bu da her boyutlandırma işleminde kısa süreli downtime ve yeniden bağlanma maliyeti anlamına geliyordu. In-place resize bu adımı tamamen ortadan kaldırır.

## Bu özellik ne zaman GA oldu?

In-place pod resize, Kubernetes 1.35 ile 17 Aralık 2025'te kararlı (GA/stable) hâle geldi; bu durum 19 Aralık 2025 tarihli resmi Kubernetes blog yazısında doğrulandı. Özellik, Kubernetes 1.27'de alpha olarak tanıtılmış, Kubernetes 1.33'te beta'ya yükselmiş ve son olarak 1.35'te GA statüsüne ulaşmıştı.

| Aşama | Kubernetes sürümü | Durum |
|---|---|---|
| Alpha | v1.27 | Varsayılan kapalı, feature gate ile açılır |
| Beta | v1.33 | Çoğu cluster'da varsayılan açık |
| GA (kararlı) | v1.35 (17 Aralık 2025) | Production kullanımı için önerilir |

Kasım 2026 itibarıyla özellik artık "yeni çıkan" bir şey değil; yaklaşık 11 aydır kararlı sürümde ve production ortamlarında kullanılabilir durumda.

## In-place resize nasıl kullanılır?

Bir pod'un kaynaklarını değiştirmek için `kubectl patch` komutuyla `resize` subresource'una istek gönderirsiniz. Aşağıdaki örnek, çalışan bir pod'un bellek limitini artırır:

```bash
kubectl patch pod my-stateful-app --subresource resize --patch \
  '{"spec":{"containers":[{"name":"app","resources":{"limits":{"memory":"2Gi"}}}]}}'

# Not: Tam bayrak ve subresource söz dizimini üretime almadan önce
# kubernetes.io dokümantasyonundan doğrulayın; CLI sürümüne göre
# küçük farklar olabilir.
```

Container'ın CPU resize'ı anında, yeniden başlatmadan uygulamasını isterseniz manifestte `resizePolicy` alanını tanımlamanız gerekir:

```yaml
spec:
  containers:
    - name: app
      resizePolicy:
        - resourceName: cpu
          restartPolicy: NotRequired
        - resourceName: memory
          restartPolicy: NotRequired
```

`restartPolicy: NotRequired`, ilgili kaynak değiştirildiğinde container'ın yeniden başlatılmaması gerektiğini belirtir. Bellek limitini düşürmek gibi bazı senaryolarda runtime, güvenlik nedeniyle yine de yeniden başlatma isteyebilir.

Kubelet, resize isteğini aldığında önce node üzerinde yeterli kaynak olup olmadığını kontrol eder. Yeterli kaynak yoksa istek "InProgress" durumunda beklemeye alınır ve node'da yer açıldığında uygulanır; bu da resize işleminin otomatik bir scheduler kararı gibi değil, kaynak uygunluğuna bağlı kademeli bir işlem gibi davrandığını gösterir. Pod'un `status.resize` alanından bu sürecin hangi aşamada olduğunu takip edebilirsiniz.

## Bu özellik en çok hangi workload'lara fayda sağlar?

Yatay ölçeklenmesi zor olan stateful uygulamalar (veritabanları, uzun ısınma süresi olan JVM tabanlı servisler, bellek içi cache katmanları) in-place resize'dan en çok fayda sağlayan gruptur. Bu uygulamalar yeni bir pod'da sıfırdan başlamak yerine mevcut pod üzerinde dikey olarak büyütülüp küçültülebilir.

Örneğin trafik artışı öncesi bir Redis pod'unun bellek limitini manuel olarak veya VPA aracılığıyla yükseltmek, pod'u yeniden oluşturmadan mümkün. Bu, cache'in ısınma süresini sıfırdan yaşamadan ölçeklenmesini sağlar. Kaynak kullanımını daha sıkı tutmak isteyen ekipler için bu, [Kubernetes maliyet optimizasyonu](/tr/posts/kubernetes-maliyet-optimizasyonu) stratejilerine doğrudan katkı sağlayan bir araçtır.

## Hangi önkoşullar gerekiyor?

In-place pod resize, node'un container runtime'ının cgroup v2 desteklemesini gerektirir. Çoğu güncel yönetilen Kubernetes node image'ı varsayılan olarak cgroup v2 kullanıyor, ancak eski node'lar hâlâ cgroup v1 üzerinde çalışıyor olabilir ve bu node'larda özellik kullanılamaz. Cluster'ınızın cgroup sürümünü varsaymak yerine kendiniz doğrulamanız gerekir; node işletim sistemi image'ı ve kernel sürümüne göre değişebilir.

Bunun yanında, container image'ınızın çalıştırdığı uygulamanın da dinamik kaynak değişikliğine tepki verebilmesi gerekir. Örneğin sabit bir heap boyutuyla başlatılan bir JVM uygulaması, container'a tanımlanan bellek limiti arttırılsa bile bu ek alanı otomatik olarak kullanmaz; uygulamanın kendisinin de dinamik boyutlandırmayı desteklemesi ya da yeniden yapılandırılabilir olması gerekir. Bu yüzden in-place resize'ı sadece altyapı tarafında değil, uygulama tarafında da test etmek önemlidir.

## VPA ve Kubernetes 1.36 ile ilişkisi nedir?

In-place pod resize, container seviyesinde manuel veya otomasyon aracılığıyla tetiklenen bir API yeteneğidir; Vertical Pod Autoscaler'ın bunu otomatik olarak kullanması ayrı bir gelişme sürecidir. VPA'nın "InPlaceOrRecreate" güncelleme modu beta statüsüne yükseldi ve nihai hedef, VPA'nın pod'ları tahliye edip yeniden oluşturmak yerine yerinde boyutlandırmasını sağlamak.

Burada önemli bir ayrım var: Kubernetes 1.36 ile gelen "pod-level resources için in-place dikey ölçekleme" beta özelliği, 1.35'te GA olan container seviyesindeki resize'dan farklı, daha yeni ve daha dar kapsamlı bir feature gate. Bu iki özelliği birbirine karıştırmamak gerekir; 1.35'teki GA duyurusu container kaynaklarıyla ilgiliydi, 1.36'daki beta ise pod seviyesindeki kaynaklarla ilgili.

Otomatik ölçeklendirme stratejinizi genel olarak gözden geçirmek istiyorsanız [Kubernetes otomatik ölçekleme rehberi](/tr/posts/kubernetes-otomatik-olcekleme-rehberi) ve node ölçeklendirme tarafında [Karpenter mi Cluster Autoscaler mı](/tr/posts/karpenter-mi-cluster-autoscaler-mi) karşılaştırmasına göz atabilirsiniz.

## Manuel resize, HPA ve VPA modları nasıl karşılaştırılır?

| Yöntem | Downtime | En iyi kullanım alanı |
|---|---|---|
| HPA (Horizontal Pod Autoscaler) | Yok (yeni pod eklenir) | Durumsuz, yatay ölçeklenebilir servisler |
| VPA – Recreate modu | Var (pod silinip yeniden oluşturulur) | Dikey ölçekleme gereken ama kesintiye toleranslı iş yükleri |
| VPA – InPlaceOrRecreate (beta) | Genelde yok | VPA'nın otomatik dikey ölçeklemesini kesintisiz istediğiniz durumlar |
| Manuel in-place resize (GA, v1.35) | Yok | Veritabanları, cache katmanları, kontrollü manuel ayarlama |

Açıkçası bu tablodaki en kullanışlı satır üçüncüsü: VPA'nın "InPlaceOrRecreate" modu henüz beta olsa da, ekiplerin elle `kubectl patch` yazmak yerine otomatik ve kesintisiz dikey ölçeklemeye geçmesinin asıl yolu bu olacak. Manuel resize bugün production-ready, ama gerçek değeri otomasyonla birleştiğinde ortaya çıkacak.

Pod seviyesinde kaynak yönetimini doğru kurgulamak, container image'larınızın da verimli olmasını gerektirir; bu konuda [Docker en iyi pratikleri](/tr/posts/docker-en-iyi-pratikleri) makalesi faydalı olabilir. Kubernetes'in gerçekten gerekip gerekmediğini sorgulayan ekipler için de [2026'da hâlâ Kubernetes'e ihtiyacınız var mı?](/tr/posts/hala-kubernetes-gerekli-mi-2026) yazısı farklı bir perspektif sunuyor.

Daha fazla teknik detay ve API referansı için resmi [Kubernetes 1.35 GA duyurusu](https://kubernetes.io/blog/2025/12/19/kubernetes-v1-35-in-place-pod-resize-ga/), [v1.35 sürüm notları](https://kubernetes.io/blog/2025/12/17/kubernetes-v1-35-release/) ve [resize-pod-resources dokümantasyonu](https://kubernetes.io/docs/tasks/configure-pod-container/resize-pod-resources/) kaynaklarına bakabilirsiniz.

## Sıkça Sorulan Sorular

### Kubernetes'te pod yeniden başlatmadan kaynak nasıl değiştirilir?

`kubectl patch` komutuyla pod'un `resize` subresource'una istek gönderip `resources.limits` veya `resources.requests` alanlarını güncellersiniz. Kubernetes 1.35 ve sonrasında, container'ın `resizePolicy` alanı `NotRequired` olarak ayarlandığında bu değişiklik container'ı yeniden başlatmadan uygulanır.

### In-place pod resize hangi Kubernetes sürümünde GA oldu?

In-place pod resize, 17 Aralık 2025'te yayınlanan Kubernetes 1.35 ile GA (kararlı) statüsüne ulaştı; bu, 19 Aralık 2025 tarihli resmi Kubernetes blog yazısıyla doğrulandı. Özellik öncesinde v1.27'de alpha, v1.33'te beta aşamalarından geçmişti.

### In-place resize her node'da çalışır mı?

Hayır, in-place pod resize node'un container runtime'ının cgroup v2 desteklemesini gerektirir. Çoğu güncel yönetilen node image'ı varsayılan olarak cgroup v2 kullanır, ancak eski veya özel yapılandırılmış node'lar hâlâ cgroup v1'de çalışabilir; bu durumda özellik kullanılamaz ve cluster'ınızda doğrulama yapmanız gerekir.

### VPA pod'ları yeniden başlatmadan ölçekleyebilir mi?

Evet, ama henüz beta aşamasında. VPA'nın "InPlaceOrRecreate" güncelleme modu, pod'ları tahliye edip yeniden oluşturmak yerine in-place resize API'sini kullanarak dikey ölçekleme yapmayı hedefler. Bu mod Kasım 2026 itibarıyla beta statüsünde ve tam otomatik, kesintisiz dikey ölçeklemeye doğru ilerleyen bir adımdır.
