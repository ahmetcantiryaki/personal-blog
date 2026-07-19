---
title: "Helm mi Kustomize mi: K8s Yapılandırma"
slug: "helm-mi-kustomize-mi-k8s"
translationKey: "helm-vs-kustomize"
locale: "tr"
excerpt: "Helm paketler, sürümler ve geri alır; Kustomize şablonsuz overlay ile fark üretir. Helm 4'ün Server-Side Apply geçişiyle 2026'da doğru seçim netleşiyor."
category: "devops-cloud"
tags: ["kubernetes", "devops", "containers", "gitops"]
publishedAt: "2026-07-19"
seoTitle: "Helm mi Kustomize mi: K8s Yapılandırma Rehberi"
seoDescription: "Helm paketler, sürümler ve geri alır; Kustomize şablonsuz overlay üretir. Helm 4'ün Server-Side Apply geçişiyle 2026'da doğru seçimi veriyle karşılaştırıyoruz."
---

Kısa cevap: Kendi uygulama manifestolarınız için Kustomize, üçüncü taraf chart'lar (veritabanı, ingress, observability) için Helm kullanın. Çoğu olgun platform ekibi ikisini birlikte çalıştırıyor; birini diğerinin yerine koymak yerine, hangi katmanın neye ihtiyaç duyduğuna bakıyor.

Bu ikisini birbirine rakip gibi sunmak, sorunun yanlış tarafından bakmak. Helm bir paket yöneticisi: sürümlenmiş chart'lar, Go şablonlama, release geçmişi ve tek komutla geri alma sunuyor. Kustomize ise bir fark üretici: şablon yok, sadece bir base manifest ve üzerine bindirilen overlay'ler. Temmuz 2026 itibarıyla Helm 4'ün mimari değişikliği ve Kustomize'ın kubectl'e gömülü olması, bu ayrımı daha da netleştirdi. Aşağıda ikisinin nerede güçlü olduğunu, Helm 4'ün ne değiştirdiğini ve gerçek fleet'lerin nasıl bir hibrit kurduğunu veriyle anlatıyoruz.

## Helm nedir ve ne zaman kullanılır?

Helm, Kubernetes için bir paket yöneticisidir. Bir uygulamanın tüm manifestolarını (deployment, service, configmap, secret şablonları) tek bir "chart" içinde toplar, `values.yaml` ile parametrize eder ve `helm install` / `helm upgrade` ile cluster'a uygular. Her kurulum bir "release" olarak izlenir; bu sayede `helm rollback redis-cache 3` gibi tek komutla önceki bir sürüme dönebilirsiniz.

Helm'in asıl gücü ekosisteminde yatıyor. PostgreSQL, Redis, NGINX Ingress, Prometheus, cert-manager gibi neredeyse her popüler bileşenin resmi veya toplulukça bakılan bir chart'ı var. Bu chart'ları kendiniz yazmak yerine `helm repo add` ile ekleyip `values.yaml` üzerinden özelleştirmek, haftalarca sürecek bir işi dakikalara indiriyor. Bu yüzden Kustomize ile karşılaştırıldığında Helm'in en net kazanma sebebi, kendi yazmadığınız yazılımı dağıtmak.

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install redis-cache bitnami/redis -f values.prod.yaml
helm upgrade redis-cache bitnami/redis -f values.prod.yaml
helm rollback redis-cache 1
```

Şablonlama tarafında Helm, Go'nun `text/template` motorunu kullanır: koşullar, döngüler, fonksiyonlar mümkündür. Bu esneklik aynı zamanda en çok eleştirilen yanı; karmaşık chart'larda `{{- if .Values.foo }}` bloklarının iç içe geçmesi, YAML'ı okunması zor bir metin şablonuna dönüştürebiliyor.

## Helm 4 mimari olarak ne değiştirdi?

Helm 4.0.0, [projenin 10. yıl dönümüne denk gelerek](https://www.cncf.io/announcements/2025/11/12/helm-marks-10-years-with-release-of-version-4/) 12 Kasım 2025'te, KubeCon North America 2025 sırasında (10-13 Kasım) stabil sürüme ulaştı. Tam olarak onuncu yaşına denk gelmesi tesadüf değildi; ekip bu sürümü büyük bir mimari temizlik fırsatı olarak kullandı.

En önemli değişiklik, Helm'in artık varsayılan uygulama stratejisi olarak tamamen Kubernetes'in **Server-Side Apply (SSA)**'ına geçmiş olması. Helm 3'te kullanılan istemci taraflı üç yönlü merge (three-way merge), Helm'in kendi state'iyle cluster'daki gerçek durumu karşılaştırıp bir fark hesaplıyordu; bu yaklaşım, aynı kaynağa başka bir controller (örneğin bir operator veya `kubectl edit`) dokunduğunda sık sık alan sahipliği çakışmalarına yol açıyordu. SSA'da bu hesaplamayı API server'ın kendisi yapıyor ve her alanın sahibini (`fieldManager`) API server takip ediyor. [Enix'in Helm 4 analizinde](https://enix.io/en/blog/helm-4/) detaylandırıldığı gibi, bu değişiklik uzun süredir GitOps ekiplerini rahatsız eden bir sınıf merge hatasını kökten kapatıyor.

İkinci büyük yenilik, isteğe bağlı bir **WebAssembly (WASM) tabanlı plugin runtime'ı**. [Jimmy Song'un Helm 4 plugin mimarisi yazısında](https://jimmysong.io/blog/helm-4-delivery-and-plugin-rebuild/) anlatıldığı gibi üç resmi plugin tipi var: CLI, getter ve post-renderer. WASM plugin'lerin avantajı taşınabilirlik; her işletim sistemi ve mimari için ayrı derlenmiş binary dağıtmanıza gerek kalmıyor, tek bir `.wasm` dosyası her yerde çalışıyor. Geleneksel (WASM olmayan) plugin'ler de çalışmaya devam ediyor, dolayısıyla mevcut plugin ekosistemi kırılmıyor.

Pratikte bu, Helm 4'e geçişin çoğu ekip için "büyük patlama" değil, kademeli bir yükseltme olacağı anlamına geliyor; ama SSA'ya geçiş, özellikle operator'larla birlikte çalışan chart'larda test edilmeden production'a alınmamalı.

## Kustomize nedir ve neden şablonsuz?

Kustomize, tasarım felsefesi olarak şablonlamayı reddediyor. Bunun yerine bir "base" (temel manifest seti) tanımlar, sonra her ortam için bir "overlay" ile üzerine patch uygularsınız. Tüm yapılandırma tek bir `kustomization.yaml` dosyasında toplanır:

```yaml
# overlays/production/kustomization.yaml
resources:
  - ../../base
patches:
  - path: replica-patch.yaml
    target:
      kind: Deployment
      name: checkout-api
images:
  - name: checkout-api
    newTag: v2.4.1
```

Kustomize'ın en büyük pratik avantajı Kubernetes 1.14'ten beri kubectl'e gömülü olması; `kubectl apply -k overlays/production` çalıştırmak için ayrı bir binary kurmanıza gerek yok. Şablon olmadığı için de çıktı her zaman gerçek YAML'dır; `git diff` ile overlay'ler arasındaki farkı okumak, bir Go şablonunun render sonucunu tahmin etmekten çok daha kolaydır. GitOps akışlarında (Argo CD, Flux) bu denetlenebilirlik büyük bir artı; PR incelemesinde reviewer, chart mantığını değil, doğrudan sonucu görür.

Dezavantajı ise paketleme ve sürümleme kavramlarının olmaması. Kustomize'ın kendi başına bir "release geçmişi" veya "rollback" komutu yok; bunu Git geçmişine ve GitOps controller'ınıza bırakıyorsunuz. Üçüncü taraf bir yazılımı Kustomize ile dağıtmak istediğinizde de resmi bir "chart deposu" kavramı olmadığı için, manifestoları elle indirip base'e koymanız gerekir.

## Helm vs Kustomize: özellik karşılaştırması

| Kriter | Helm 4 | Kustomize |
|---|---|---|
| Yapılandırma modeli | Go şablonlama + values | Base + overlay/patch, şablonsuz |
| Paketleme | Sürümlü chart'lar (`.tgz`) | Yok, ham YAML dizini |
| Release yönetimi | `helm rollback` ile yerleşik geçmiş | Yok, Git/GitOps'a bağımlı |
| Kurulum | Ayrı binary gerekir | kubectl'e gömülü (`-k`) |
| Apply stratejisi | Server-Side Apply (v4'te varsayılan) | kubectl apply (client veya server-side) |
| Ekosistem | Çok geniş (Bitnami, resmi chart'lar) | Yok, base'i kendiniz yazarsınız |
| Diff okunabilirliği | Render edilene kadar belirsiz | Doğrudan YAML, `git diff` dostu |
| Genişletme | CLI/getter/post-renderer plugin (v4'te WASM da var) | Plugin sistemi yok, generator/transformer var |

## Gerçek fleet'ler nasıl bir hibrit kuruyor?

100'den fazla cluster işleten platform ekiplerinin raporladığı yakınsama deseni net: birinci taraf, yani şirket içi yazılan uygulama manifestolarını Kustomize ile yönetin; üçüncü taraf yazılımı (veritabanları, ingress controller'lar, observability stack'leri) Helm ile tüketin. [Sanj'ın 2026 Kustomize vs Helm karşılaştırmasında](https://sanj.dev/post/kustomize-vs-helm-2026/) da vurgulandığı gibi bu ayrım rastgele değil; her aracın güçlü olduğu yerde çalışıyor.

Bazı ekipler bir adım daha ileri gidip Helm'in render çıktısını Kustomize'a post-processing overlay olarak veriyor:

```bash
helm template redis-cache bitnami/redis -f values.prod.yaml > base/redis-rendered.yaml
kubectl kustomize overlays/production | kubectl apply -f -
```

Bu desen, upstream chart'ın esnekliğinden faydalanırken, organizasyonun kendi etiketleme, network policy veya kaynak limiti standartlarını tek bir overlay katmanında zorunlu kılmanıza izin veriyor. Bu bence en dengeli yaklaşım: Helm'i "üçüncü taraf paket yöneticisi", Kustomize'ı "son mil özelleştirici" olarak görürseniz, iki aracın da zayıf yanları büyük ölçüde ortadan kalkıyor.

## Karar tablosu

| Senaryo | Önerilen araç |
|---|---|
| Şirket içi mikroservis manifestoları, çok ortamlı (dev/staging/prod) | Kustomize |
| PostgreSQL, Redis, ingress controller gibi üçüncü taraf yazılım | Helm |
| Küçük ekip, tek cluster, hızlı başlangıç | Kustomize (kubectl'e gömülü, ekstra araç yok) |
| Rollback/release geçmişi kritik gereksinim | Helm |
| GitOps ile katı diff denetlenebilirliği isteniyor | Kustomize (veya `helm template` + Kustomize overlay) |
| Çok sayıda operator/controller aynı kaynağa dokunuyor | Helm 4 (SSA ile alan çakışması riski düşük) |

Bu tabloyu mutlak kural olarak değil, başlangıç noktası olarak okuyun; birçok olgun ekip tek satırda değil, aynı anda birden fazla satırda yaşıyor. Karar sürecinizi netleştirmek istiyorsanız [Kubernetes maliyet optimizasyonu rehberimiz](/tr/posts/kubernetes-maliyet-optimizasyonu) ve [Kubernetes otomatik ölçekleme rehberi](/tr/posts/kubernetes-otomatik-olcekleme-rehberi) benzer araç seçimi tartışmalarını ele alıyor.

## Sıkça Sorulan Sorular

### Helm 4'e geçmeden önce nelere dikkat etmeliyim?

Server-Side Apply'a geçiş, mevcut release'lerde alan sahipliği (field ownership) davranışını değiştirebilir; özellikle bir operator'ın (örneğin bir autoscaler veya service mesh controller) sizin chart'ınızın da yönettiği alanlara dokunduğu senaryolarda önce staging'de test edin. [CNCF'in duyurusunda](https://www.cncf.io/announcements/2025/11/12/helm-marks-10-years-with-release-of-version-4/) geçiş rehberine dair bağlantılar da paylaşıldı.

### Kustomize ile secret yönetimi nasıl yapılır?

Kustomize'ın yerleşik `secretGenerator` mekanizması var, ama bu ham secret'ları Git'te tutmanızı gerektirmiyor; genelde Sealed Secrets veya External Secrets Operator gibi araçlarla birleştirilir. Bu konuyu [bulutta secret yönetimi yazımızda](/tr/posts/bulutta-secret-yonetimi) daha detaylı işledik.

### Küçük bir ekip ikisini birden öğrenmeye değer mi?

Tek cluster ve az sayıda üçüncü taraf bağımlılığınız varsa hayır; Kustomize tek başına yeterli olabilir. Ama ürününüz büyüdükçe ve bir veritabanı ya da ingress controller kurmanız gerektiğinde, o chart'ı sıfırdan Kustomize base'i olarak yazmak yerine Helm ile tüketmek zaman kazandırır.

### Bu karar GitOps akışını (Argo CD/Flux) nasıl etkiler?

Her iki araç da Argo CD ve Flux tarafından native destekleniyor; Argo CD hem Helm chart'ları hem Kustomize overlay'lerini aynı uygulamada bile birleştirebilir. GitOps prensipleri ve reconciliation döngüsü hakkında daha fazla bilgi için [GitOps nedir yazımıza](/tr/posts/gitops-nedir) bakabilirsiniz.
