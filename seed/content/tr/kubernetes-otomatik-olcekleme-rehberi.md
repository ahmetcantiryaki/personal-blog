---
title: "Kubernetes Otomatik Ölçekleme Rehberi"
slug: "kubernetes-otomatik-olcekleme-rehberi"
translationKey: "kubernetes-autoscaling-guide"
locale: "tr"
excerpt: "HPA, VPA ve Cluster Autoscaler'ı doğru kombinasyonla kullanma rehberi: hangisi neyi ölçekler, ikisi ne zaman çatışır ve maliyet etkisi nedir."
category: "devops-cloud"
tags: ["kubernetes", "cost-optimization", "devops", "automation"]
publishedAt: "2026-07-13"
seoTitle: "Kubernetes Otomatik Ölçekleme: HPA, VPA, CA Rehberi"
seoDescription: "HPA, VPA ve Cluster Autoscaler'ı doğru kombinasyonla kullanma rehberi: hangisi neyi ölçekler, ikisi ne zaman çatışır, maliyet etkisi nedir ve nasıl önlenir."
---

Kubernetes'te HPA pod sayısını, VPA pod başına kaynak isteğini, Cluster Autoscaler ise node sayısını ölçekler. Üçünü doğru kombine etmezseniz, özellikle HPA ile VPA'yı aynı metrikte çalıştırırsanız, birbirini boşa çıkaran bir salınım oluşur. Bu rehber hangi aracın ne zaman kullanılacağını ve çatışmanın nasıl önleneceğini veriye dayalı olarak anlatıyor.

## HPA nedir ve neyi ölçekler?

Horizontal Pod Autoscaler (HPA), bir deployment veya statefulset'in pod replika sayısını seçilen bir metriğe göre artırıp azaltır. Varsayılan olarak CPU veya bellek kullanım oranını izler; ancak Prometheus adaptörü gibi bir mekanizma üzerinden saniyedeki istek sayısı (requests-per-second) gibi özel veya harici metriklere de bağlanabilir. Mantık basittir: kullanım hedefin üzerine çıkarsa yeni pod eklenir, altına düşerse pod sayısı azaltılır.

HPA'nın benimsenme oranı dikkat çekici: Kubernetes çalıştıran organizasyonların yaklaşık %64'ü HPA'yı üretimde kullanıyor. Daha da önemlisi, HPA'yı bir kez benimseyen ekiplerin %86'sı bunu kümelerinin çoğunda uyguluyor ve neredeyse yarısı her kümede kullanıyor. Yani HPA, dar bir niş özellik değil; benimsendiği anda temel bir altyapı parçasına dönüşüyor. Buna karşılık, ölçeklenmeyen iş yüklerinin %46'sı günde birden fazla belirgin CPU sıçraması yaşıyor; bu da HPA'yı henüz devreye almamış birçok ekibin aslında ideal aday olduğunu gösteriyor. [Cast.ai'nin HPA analizine göre](https://cast.ai/blog/what-is-kubernetes-hpa-and-how-can-it-help-you-save-on-the-cloud/) bu tür yükler için yatay ölçekleme hem performans hem maliyet açısından en düşük riskli ilk adım.

Basit bir HPA manifestosu şöyle görünür:

```yaml
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

## VPA nedir ve neyi ölçekler?

Vertical Pod Autoscaler (VPA), pod sayısına dokunmaz; bunun yerine geçmiş kullanım verisine bakarak her container'ın CPU ve bellek isteklerini (request) ve limitlerini yeniden boyutlandırmayı önerir veya otomatik uygular. Bir ekip genelde container'lara "tahmini" değerler atar: 500m CPU, 1Gi bellek gibi. VPA bu tahminleri gerçek kullanım verisiyle değiştirir; genellikle fazla ayrılmış (over-provisioned) kaynakları ortaya çıkarır.

VPA'nın en az riskli kullanım şekli "Off" ya da yalnızca öneri modudur: hiçbir şeyi otomatik değiştirmez, sadece "bu container'a 250m CPU yeter, 500m değil" gibi öneriler sunar. Burada iddialı bir görüşümüz var: çoğu ekip HPA eşiklerini ince ayarlamaya orantısız zaman harcarken, VPA'yı sadece öneri modunda çalıştırmanın tek başına, tam bir HPA+VPA kombinasyonundan çok daha az operasyonel riskle çok daha fazla israfı gün yüzüne çıkaracağını gözden kaçırıyor. Öneri modu üretim trafiğine dokunmaz; sadece bir rapor üretir. Buna karşın canlı bir HPA+VPA kombinasyonunu doğru yapılandırmak saatler süren gözlem ve test gerektirir.

## Cluster Autoscaler node'ları nasıl ölçekler?

Cluster Autoscaler (CA), pod sayısını veya boyutunu değil, node sayısını ölçekler. Tetikleyici sinyali basittir: zamanlanamayan (unschedulable) pod. Kümedeki mevcut node'lar yeni pod'ları barındıramayacak kadar doluysa CA yeni node ekler; node'lar uzun süre az kullanılıyorsa ve pod'lar başka yere taşınabiliyorsa node siler. HPA ve VPA pod seviyesinde çalışırken CA, bu pod'ların koşacağı fiziksel (ya da sanal) kapasiteyi sağlayan katmandır. Üçü birlikte çalışır: HPA veya VPA bir pod'un daha fazla kaynağa ihtiyacı olduğuna karar verir, bu pod zamanlanamaz hâle gelirse CA devreye girip node ekler.

## HPA ile VPA aynı metrikte neden çatışır?

Kubernetes topluluğunun net uyarısı şu: HPA ve VPA'yı aynı kaynak metriğinde (örneğin ikisi de CPU üzerinde) asla birlikte çalıştırmayın. Mekanizma şöyle işler: VPA bir container'ın CPU isteğini yükseltir. Bu, kullanım oranının paydasını büyütür, dolayısıyla yüzdesel kullanım düşer. HPA bu düşük kullanımı görür ve replika sayısını azaltır. Replika sayısı düşünce kalan pod'lar üzerindeki gerçek yük artar, kullanım oranı tekrar yükselir. VPA bunu görüp CPU isteğini yeniden yükseltir. Döngü baştan başlar.

Bunu en net şekilde ifade etmenin yolu şu: HPA, kullanım oranının payı (numerator) üzerinde çalışır; VPA ise paydası (denominator) üzerinde. İkisi aynı anda, aynı metrik üzerinde çalıştığında birbirinin ölçüm zeminini kayganlaştırır. Bu salınımlı geri besleme döngüsü topluluk içinde "Kubernetes ölüm sarmalı" (death spiral) olarak anılıyor ve [kubernetes/autoscaler deposundaki 6247 numaralı issue](https://github.com/kubernetes/autoscaler/issues/6247) bu davranışı gerçek kümelerden gelen örneklerle belgeliyor. [ScaleOps'un HPA mimarisi analizi](https://scaleops.com/blog/hpas-three-architectural-flaws-and-why-your-autoscaling-keeps-failing/) de bu tür etkileşimlerin HPA'nın izole çalıştığı varsayımıyla tasarlanmış olmasından kaynaklandığını vurguluyor.

İki güvenli kombinasyon var. Birincisi: HPA'yı özel veya harici bir metrikte (örneğin saniyedeki istek sayısı) çalıştırırken VPA'nın bağımsız olarak CPU ve bellek isteklerini ayarlamasına izin vermek; bu durumda ikisi farklı sinyaller üzerinde çalıştığı için çatışmazlar. İkincisi: VPA'yı "Off" ya da yalnızca öneri modunda tutup gerçek otomatik ölçeklemeyi tamamen HPA'ya bırakmak. [OneUptime'ın VPA-HPA birlikte kullanım rehberi](https://oneuptime.com/blog/post/2026-02-09-vpa-hpa-together-cpu-memory-autoscaling/view) bu iki deseni pratik örneklerle karşılaştırıyor.

## Özel metrikler ve maliyet etkisi

CPU tabanlı ölçekleme her zaman doğru sinyali vermez; bir API çağrısı I/O beklerken CPU'yu düşük tutup yine de gecikme yaşatabilir. Bu yüzden saniyedeki istek sayısı, kuyruk uzunluğu ya da gecikme yüzdelik dilimleri gibi harici metrikler, gerçek kullanıcı deneyimine daha yakın bir ölçekleme sinyali sağlar. [Kubernetes maliyet optimizasyonu](/tr/posts/kubernetes-maliyet-optimizasyonu) yazımızda detaylandırdığımız gibi, doğru ölçüm olmadan hem fazla ölçekleme (gereksiz maliyet) hem az ölçekleme (performans kaybı) riski birlikte artar. VPA önerileri tek başına genellikle %20-40 arası fazla ayrılmış kaynağı ortaya çıkarır; bunun için tam bir HPA kurulumu gerekmez, sadece öneri modunu açmak yeterlidir. [FinOps ile bulut maliyetini düşürme](/tr/posts/finops-bulut-maliyeti-dusurme) rehberimiz bu tür düşük riskli kazanımları önceliklendirmeyi öneriyor.

## Çok takımlı kümelerde adalet: ResourceQuota

Birden fazla takım aynı kümeyi paylaştığında, bir takımın agresif HPA veya VPA yapılandırması diğerlerinin kaynak açlığı çekmesine yol açabilir. Namespace seviyesinde ResourceQuota tanımlamak, her takımın toplam CPU ve bellek talebine bir tavan koyarak otomatik ölçeklemenin adil kalmasını sağlar. Bu, [yaygın Kubernetes hataları](/tr/posts/kubernetes-hatalari) yazımızda da değindiğimiz, sıkça atlanan bir kurulum adımıdır. Sırdaş yapılandırmaları merkezi tutmak isteyenler için [bulutta secret yönetimi](/tr/posts/bulutta-secret-yonetimi) rehberimiz de ilgili bir tamamlayıcı.

Temmuz 2026 itibarıyla ekosistemdeki eğilim net: takımlar artık HPA'yı varsayılan kabul edip enerjilerini VPA'nın öneri çıktısını okumaya ve gereksiz kaynak israfını ortadan kaldırmaya yönlendiriyor. Daha fazla detay için [DevOps & Bulut kategorimize](/tr/category/devops-bulut) göz atabilirsiniz.

## Karar matrisi

| Araç | Neyi ölçekler | Tetikleyici sinyal | Güvenli kombinasyon notu |
|---|---|---|---|
| HPA | Pod replika sayısı | CPU/bellek kullanımı veya özel/harici metrik (RPS vb.) | VPA ile aynı metrikte çalıştırmayın; farklı metrik veya öneri modu şart |
| VPA | Container CPU/bellek isteği ve limiti | Geçmiş kullanım geçmişi | HPA ile aynı metrikte çatışır; "Off" modu en güvenli, ya da HPA farklı metrikte olmalı |
| Cluster Autoscaler | Node sayısı | Zamanlanamayan (unschedulable) pod'lar | HPA/VPA ile doğrudan çatışmaz; kapasite katmanı olarak çalışır |

## Sıkça Sorulan Sorular

### HPA ve VPA'yı aynı anda hiç kullanamaz mıyım?

Kullanabilirsiniz, ancak aynı metrik üzerinde değil. HPA'yı özel bir metrikte (örneğin RPS) çalıştırıp VPA'nın CPU/bellek isteklerini bağımsız ayarlamasına izin vermek, ya da VPA'yı sadece öneri modunda tutmak güvenli iki yoldur.

### Cluster Autoscaler, HPA veya VPA olmadan tek başına anlamlı mı?

Evet. CA yalnızca zamanlanamayan pod'lara tepki verir; HPA veya VPA olmasa da manuel replika artışları ya da farklı bir ölçekleyici node ihtiyacını tetikleyebilir. Ancak pratikte genelde HPA ile birlikte kullanılır çünkü pod sayısındaki artış node ihtiyacını doğurur.

### VPA'yı öneri modunda çalıştırmak neden daha güvenli?

Çünkü hiçbir canlı pod'u yeniden başlatmaz veya kaynak isteğini değiştirmez; sadece geçmiş kullanıma dayalı bir rapor üretir. Ekip bu raporu inceleyip manuel veya kademeli olarak uygulayabilir, bu da üretim riskini pratik olarak sıfıra indirir.

### ResourceQuota olmadan otomatik ölçekleme neden riskli?

Çünkü namespace'ler arası bir üst sınır olmadan, bir takımın HPA'sı maksimum replikaya çıktığında küme genelindeki kaynak havuzunu tüketebilir ve diğer takımların pod'ları zamanlanamaz hâle gelebilir. ResourceQuota bu adaleti namespace seviyesinde garanti eder.
