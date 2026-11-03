---
title: "Kubernetes'te Yeniden Başlatmadan Pod Boyutlandırma"
slug: "kuberneteste-yeniden-baslatmadan-pod-boyutlandirma"
translationKey: "kubernetes-in-place-pod-resize-2026"
locale: "tr"
excerpt: "Kubernetes 1.35 ile in-place pod resize kararlı hale geldi; artık pod'un CPU ve bellek değerlerini konteynerleri yeniden başlatmadan değiştirebilirsiniz."
category: "devops-cloud"
tags: ["kubernetes", "cost-optimization", "performance", "containers"]
publishedAt: "2026-11-03"
seoTitle: "Kubernetes'te Yeniden Başlatmadan Pod Boyutlandırma"
seoDescription: "In-place pod resize, Kubernetes 1.35'te kararlı hale geldi. resizePolicy, resize subresource ve VPA nasıl çalışır, ne zaman hâlâ yeniden başlatma gerekir?"
---

Kısa cevap: Kubernetes v1.35'ten (19 Aralık 2025'te kararlı hale geldi) itibaren, çalışan bir pod'un CPU ve bellek request/limit değerlerini pod'un `resize` subresource'u üzerinden değiştirebilirsiniz; kubelet CPU değişikliklerinin büyük kısmını konteyneri yeniden başlatmadan uygular. Bellek düşürme, swap kullanımı ve statik CPU/Memory Manager politikaları ise hâlâ yeniden başlatma gerektiren veya hiç desteklenmeyen durumlardır.

## Kubernetes 1.35'te ne değişti?

1.35'ten önce bir pod'un CPU ve bellek request/limit değerleri oluşturulduktan sonra değiştirilemezdi; çalışan bir iş yükünü "doğru boyuta" getirmenin tek yolu pod'u silip yeniden oluşturmaktı. Bu da yeniden başlatma, yeniden zamanlama ve hazırlık (readiness) probe'larınıza bağlı olarak saniyeler-dakikalar süren bir kesinti anlamına geliyordu. Resmi KEP adıyla "In-Place Update of Pod Resources" olan bu özellik v1.27'de alfa, v1.33'te beta aşamasına geçti ve bu yazının yazıldığı tarihte yaklaşık 11 ay önce, v1.35'te kararlı (GA) hale geldi. Özellik, `resources.requests` ve `resources.limits` alanlarını değiştirilebilir hâle getiriyor; bunları özel bir `resize` subresource'u üzerinden güncelliyorsunuz, yani pod nesnesinin kendisi sadece kaynak zarfını değiştirmek için hiç yıkılmıyor.

Bu tek değişiklik, doğru boyutlandırmanın asıl maliyetini ortadan kaldırıyor: eskiden gözlenen kullanıma göre yaptığınız her ayarlama bir yeniden başlatma cezası taşıyordu, bu yüzden ekipler ya sürekli fazla kaynak ayırıyor ya da OOMKill ve CPU throttling'e katlanıp sık boyutlandırma yapmaktan kaçınıyordu. In-place resize ile CPU değişikliklerinde bu yeniden başlatma maliyeti büyük ölçüde kayboluyor; dolayısıyla üç ayda bir yerine haftalık, hatta daha sık boyutlandırma yapmayı karşılayabilirsiniz.

## Bir resize işlemini pratikte nasıl tetikliyorsunuz?

Kaynak değişikliğini normal pod spec endpoint'i üzerinden değil, `resize` subresource'u üzerinden gönderiyorsunuz; ana spec büyük ölçüde değiştirilemez kalıyor, Kubernetes bu subresource'u özellikle resize isteklerini taşımak için ekledi. Pratikte:

```bash
kubectl patch pod my-app-7f9c7d6b9-x2kqp \
  --subresource resize \
  --patch '{"spec":{"containers":[{"name":"my-app","resources":{"requests":{"cpu":"500m"},"limits":{"cpu":"1"}}}]}}'
```

API sunucusu yeni istenen değerleri hemen doğrulayıp kaydediyor, ardından node üzerindeki kubelet gerçek konteyner cgroup limitlerini bu değerlere göre senkronize ediyor; konteynerin çalışır kalıp kalmayacağına tam da bu senkronizasyon adımında, `resizePolicy` karar veriyor.

## Bellek küçültmek hâlâ konteyneri yeniden başlatıyor mu?

Kaynağa, yönüne ve konteyner çalışma zamanına bağlı, ama pratik bir kural olarak: her iki yöndeki CPU değişiklikleri ve bellek artışları yeniden başlatma gerektirmeden uygulanma ihtimali en yüksek durumlar, bellek düşürme ise konteyneri yeniden başlatma ihtimali en yüksek durum. Bunu her konteyner ve her kaynak için `resizePolicy` ile açıkça belirliyorsunuz; her girdi `restartPolicy` alanında `NotRequired` veya `RestartContainer` değerini alıyor:

```yaml
containers:
  - name: my-app
    resources:
      requests:
        cpu: "500m"
        memory: "512Mi"
      limits:
        cpu: "1"
        memory: "1Gi"
    resizePolicy:
      - resourceName: cpu
        restartPolicy: NotRequired
      - resourceName: memory
        restartPolicy: RestartContainer
```

| Değişiklik | Tipik sonuç | Neden |
|---|---|---|
| CPU artışı veya azalışı | Yeniden başlatmadan uygulanır | cgroup CPU share/quota değerleri çoğu çalışma zamanında sorunsuz güncellenir |
| Bellek artışı | Genellikle yeniden başlatmadan uygulanır | cgroup bellek tavanını yükseltmek düşük risklidir |
| Bellek azalışı | Sıklıkla konteyneri yeniden başlatır | Mevcut kullanımın altına düşürmek anlık bir OOM riski taşır; birçok çalışma zamanı bunu canlı yapmayı güvensiz kabul eder |
| CPU/bellek dışı kaynaklar (örn. ephemeral-storage) | Boyutlandırılamaz | GA sürümünde pod oluşturulduktan sonra hâlâ değiştirilemez |

Benim görüşüm: "bellek azalışı yeniden başlatır" davranışına her çalışma zamanı ve her `resizePolicy` ayarında körü körüne güvenmeyin; gecikmeye hassas bir servise bağlamadan önce bunu kendi konteyner imajlarınız ve çalışma zamanınıza (containerd, CRI-O) karşı test edin, çünkü bellek tavanının kenarındaki gerçek davranış sürprizlerin yaşandığı yerdir.

## In-place resize hangi durumlarda hiç çalışmıyor?

GA itibarıyla üç durumda in-place resize açıkça devre dışı: swap kullanan pod'lar, statik CPU Manager politikasına sabitlenmiş pod'lar ve statik Memory Manager politikası altındaki pod'lar. Bir iş yükü bu durumlardan birine giriyorsa, o iş yükü için eski sil-ve-yeniden-oluştur boyutlandırma yoluna geri dönersiniz. Windows node havuzları da bu özelliğin dışında. Bunların dışındaki asıl sınırlama kapsam: sadece CPU ve bellek boyutlandırılabilir, diğer kaynak türleri pod'un ömrü boyunca değiştirilemez kalıyor.

## Tek tek konteyner yerine tüm pod'u boyutlandırmak mümkün mü?

30 Nisan 2026'da duyurulan Kubernetes v1.36, pod seviyesinde in-place dikey ölçeklendirmeyi beta özellik olarak ekledi; bu, her konteyneri tek tek yamalamak yerine pod'un kendi kaynak zarfını boyutlandırmanıza izin veriyor. Burada önemli bir ayrıntı var: `resizePolicy` pod seviyesinde desteklenmiyor — kubelet, istek pod seviyesinden gelse bile yeniden başlatma kararını yine her konteynerin kendi `resizePolicy`'sine bakarak veriyor. Yani pod seviyesi resize, isteği kolaylaştırıyor ama yukarıdaki konteyner bazlı yeniden başlatma kurallarını atlamıyor.

## Vertical Pod Autoscaler ile birlikte kullanmalı mısınız?

Hedefiniz manuel boyutlandırmayı tamamen bırakmaksa evet — VPA'nın `InPlaceOrRecreate` güncelleme modu desteği, 1.35 GA duyurusuyla birlikte beta aşamasına geçti; bu, VPA'nın gözlenen kullanıma göre bir insanın uygulaması için öneri vermek veya pod'u tamamen yeniden oluşturmak yerine doğrudan in-place resize isteği gönderebilmesi anlamına geliyor. Pratikte işe yarayan yayına alma deseni şu: VPA'yı birkaç hafta sadece öneri modunda çalıştırıp neyi değiştireceğini gözlemleyin, kritik olmayan bir iş yükünü `InPlaceOrRecreate`'e geçirin ve manuel resize'larda geçerli olan aynı uç durumları (bellek azalışı, statik manager çakışmaları) izleyin.

## Yayına almadan önce neye dikkat etmelisiniz?

GA duyurusunun kendisi bilinen bir sorunlu noktayı işaret ediyor: kubelet ile scheduler arasında, request'leri artıran bir resize'ın node'un kalan kapasitesi konusunda scheduler'ın görüşüyle anlık olarak çakışabildiği yarış durumları. Bu nadir ama sıkışık paketlenmiş bir cluster'da sık resize'lara güvenmeden önce yük altında test etmeye değer; bu konunun etkileşime girdiği bin-packing trade-off'ları için [Kubernetes maliyet optimizasyonu: 10 taktik](/tr/posts/kubernetes-maliyet-optimizasyonu) yazısına bakabilirsiniz.

Bu özelliği benimseyen ekipler için işe yarayan kısa bir yayına alma kontrol listesi:

1. Cluster'ınızın 1.35 veya üstünde olduğunu doğrulayın ve hangi iş yüklerinin swap ya da statik CPU/Memory Manager kullandığını kontrol edin — bunlar eski yeniden başlatma bazlı yolda kalır.
2. Varsayılanlara güvenmek yerine her konteyner için açık bir `resizePolicy` belirleyin; böylece yeniden başlatma davranışı üretimde keşfettiğiniz bir şey değil, sizin verdiğiniz bir karar olur.
3. Önce bir avuç serviste sadece CPU resize'ı deneyin, yeniden başlatma oranını ölçün (sıfıra yakın olmalı), sonra bellek artışlarına genişletin.
4. Bellek azalışlarını, kendi çalışma zamanınız ve imajınızla test edene kadar "yeniden başlatma bekleniyor" kabul edin; öncesi ve sonrasındaki gerçek node CPU/bellek kullanımını takip ederek tasarrufu rakamsallaştırın — bu rakam, yayına almanın neden önemli olduğunu soracak herkese verilecek cevap olacak. Bu rakamın fatura tarafına nasıl yansıdığı için [Kubernetes FinOps: Maliyeti Nasıl Düşürürsünüz?](/tr/posts/kubernetes-maliyet-finops) yazısına bakabilirsiniz.

Sadece pod boyutu değil, otomatik ölçeklendirme politikasını da ayarlıyorsanız, yatay ve dikey parçalar birlikte [Kubernetes Otomatik Ölçekleme Rehberi](/tr/posts/kubernetes-otomatik-olcekleme-rehberi) yazısında açıklanıyor.

## Sıkça Sorulan Sorular

### Kubernetes'te in-place pod resize ne zaman kararlı hale geldi?

In-place pod resize, 19 Aralık 2025'te resmi Kubernetes blogunda duyurulan Kubernetes v1.35 ile kararlı (GA) hale geldi. v1.27'den beri alfa, v1.33'ten beri beta aşamasındaydı; yani GA'ya ulaşması kabaca sekiz sürüm döngüsü sürdü.

### Pod'u yeniden başlatmadan bellek düşürülebilir mi?

Bazen. Bellek artışları genellikle yeniden başlatmadan uygulanır, ancak bellek azalışları sıklıkla konteyneri yine de yeniden başlatır; çünkü bellek tavanını mevcut kullanımın altına düşürmek anlık bir bellek yetersizliği (OOM) riski taşır. Kesin davranış konteynerin `resizePolicy` ayarına ve çalışma zamanına bağlıdır, bu yüzden güvenmeden önce test edin.

### In-place resize, Vertical Pod Autoscaler ile çalışıyor mu?

Evet. VPA'nın `InPlaceOrRecreate` güncelleme modu desteği, Kubernetes 1.35 GA duyurusuyla birlikte beta aşamasına geçti; bu, VPA'nın sadece insan uygulaması için öneri vermek veya pod'u yeniden oluşturmaya zorlamak yerine, gözlenen kullanıma göre doğrudan in-place resize tetikleyebilmesini sağlıyor.

### Hangi iş yükleri in-place pod resize kullanamaz?

GA itibarıyla swap kullanan ya da statik CPU Manager veya statik Memory Manager politikalarına sabitlenmiş pod'lar in-place resize'ın dışında tutuluyor. Windows node havuzları da kapsam dışı. Bu iş yükleri, kaynak request veya limitlerini değiştirmek için hâlâ eski sil-ve-yeniden-oluştur yaklaşımına ihtiyaç duyuyor.
