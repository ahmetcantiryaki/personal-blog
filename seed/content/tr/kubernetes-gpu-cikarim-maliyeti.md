---
title: "Kubernetes'te AI Çıkarım GPU Maliyeti Nasıl Düşürülür?"
slug: "kubernetes-gpu-cikarim-maliyeti"
translationKey: "gpu-costs-kubernetes-inference-2026"
locale: "tr"
excerpt: "Cast AI'nin 2026 raporu, kümelerde medyan GPU kullanımını %5 buldu; paylaşım, batching ve kuyruk derinliğine göre ölçekleme bu farkın çoğunu kapatıyor."
category: "devops-cloud"
tags: ["kubernetes", "cost-optimization", "ai-infrastructure", "llm"]
publishedAt: "2026-11-24"
seoTitle: "Kubernetes'te AI Çıkarım GPU Maliyeti Düşürme"
seoDescription: "Cast AI'nin 2026 raporu Kubernetes'te medyan GPU kullanımını %5 buldu; GPU paylaşımı, batching ve kuyruk derinliğine göre ölçekleme bu farkın çoğunu kapatıyor."
---

Kısa cevap: Kubernetes'teki GPU faturası neredeyse hiçbir zaman bir donanım sorunu değil, bir kullanım sorunu. Cast AI'nin on binlerce production küme üzerinden derlediği 2026 State of Kubernetes Optimization raporu, medyan GPU kullanımını sadece %5 buluyor — yani ilk hamle daha fazla GPU almak değil, elinizdeki GPU'ları paylaştırmak ve batching yapmak.

## GPU'lar klasik Kubernetes otomatik ölçeklemesini neden bozuyor?

Klasik Kubernetes otomatik ölçeklemesi, bir isteğin milisaniyeler içinde bittiğini ve bir pod'un maliyetsizce öldürülüp yeniden zamanlanabildiğini varsayıyor. Çıkarım (inference) için ikisi de geçerli değil: bir GPU pod'u, birkaç gigabaytlık bir model image'ını çekip CUDA bağlamını başlatması gerektiğinde zamanlanması onlarca saniye sürebiliyor; bir GPU'yu bir web pod'u gibi davranmak — tek istek, tek pod, CPU yüzdesine göre ölçekleme — patlamalar arasında çoğunlukla boşta kalmasına yol açıyor; medyan %5 kullanım rakamının yansıttığı tam olarak bu.

Diğer uyumsuzluk granülerlik. Bir CPU pod'u bir çekirdeğin 100m'sini isteyebilir; bir GPU isteği tarihsel olarak "bütün bir GPU" anlamına geliyordu, model belleğin ve işlem gücünün yalnızca bir kısmını kullansa bile. Bir sonraki iki taktik bu farkı kapatmak için var.

## Kubernetes'te bir GPU'yu paylaşmanın ana yolları nedir?

NVIDIA'nın Multi-Instance GPU'su (MIG) ve time-slicing aynı sorunu — bir fiziksel GPU'da birden fazla iş yükü — farklı takaslarla çözüyor. NVIDIA'nın kendi kılavuzu, kurumsal SLA'ları karşılamak için sıkı donanım seviyesinde hata izolasyonuna ihtiyaç duyan production ortamları için MIG öneriyor; çünkü her MIG partisyonu birbirine karışmayan ayrılmış bellek ve işlem gücü alıyor. Time-slicing ise iş yüklerinin tam GPU üzerinde sırayla çalışmasına izin veriyor; NVIDIA'nın benchmark'ları, patlamalı ve hafif görevlerde biraz daha hızlı olabildiğini gösteriyor (bildirilen ortalama gecikme MIG'in 168,2 ms'sine karşı 144,7 ms) — çünkü etrafından dolaşılması gereken sert bir partisyon sınırı yok.

| Yaklaşım | İzolasyon | En uygun olduğu yer | Ek yük |
|---|---|---|---|
| MIG | Donanım seviyesi, ayrılmış bellek | Çok kiracılı SLA'lar, gürültülü komşu riski | Partisyon sonrası yok |
| Time-slicing | Yazılım, paylaşılan bellek | Patlamalı, gecikmeye toleranslı çıkarım | Yük altında context-switch maliyeti |
| Tam GPU (paylaşımsız) | Yok | Eğitim, tam VRAM gerektiren büyük modeller | Düşük kullanımda boşta kapasite |

Cast AI'nin kendi GPU paylaşım vaka çalışmaları, time-slicing ile tek bir A100'de 10 işe kadar çalıştırdığını ve hafif iş yüklerinde %90'a kadar tasarruf bildiriyor — bunu bir garanti değil, satıcı tarafından bildirilmiş bir tavan olarak görün; çünkü her işin ne kadar patlamalı ve ne kadar küçük olduğuna büyük ölçüde bağlı.

## GPU çıkarımını kapasite harcamadan nasıl otomatik ölçeklersiniz?

GPU kullanım yüzdesine değil, kuyruk derinliğine veya işlenmekte olan istek sayısına göre ölçeklendirin; çünkü kullanım, asıl önemsediğiniz sinyalin gerisinde kalıyor — bir GPU, uzun süren tek bir istekten "meşgul" görünebilirken bir düzine istek daha sırada bekleyebilir. Bu, [KEDA ile boşta Kubernetes maliyetini kesme](/tr/posts/kubernetes-bosta-maliyet-keda) yazısında ele alınan örüntünün aynısı: KEDA'nın özel metrik tetikleyicileri, bir SQS worker'ı için olduğu kadar bir çıkarım kuyruğu için de çalışıyor; istekler kuyruğa girdiğinde GPU replikalarını yukarı, kuyruk boşaldığında — ideal olarak artık boşta kalan GPU node'unu kaldıran [Karpenter](/tr/posts/karpenter-mi-cluster-autoscaler-mi) gibi bir node autoscaler'ı ile birlikte — aşağı ölçeklendiriyor.

İstek batching'i çıkarıma özgü diğer kaldıraç: gelen birden fazla isteği tek bir forward pass'te gruplamak, donanım eklemeden istek başına GPU kullanımını yükseltiyor; karşılığında batch penceresi dolarken küçük, sınırlı bir gecikme artışı oluyor. Çoğu servis çerçevesi (vLLM, TensorRT-LLM, Triton) bunu doğal olarak destekliyor ve otomatik ölçeklemeye dokunmadan önce genellikle en yüksek kaldıraçlı tek değişiklik bu.

## Bunlardan herhangi birinin işe yarayıp yaramadığını nasıl ölçersiniz?

Ham GPU-saat harcaması yerine sunulan her 1.000 token'ın maliyetini takip edin; çünkü düşük kullanımlı bir kümede daha ucuz bir GPU-saati, kapasiteye yakın çalışan daha pahalı bir GPU'dan bile daha kötü bir token-başı maliyet üretebilir. Gerçek token throughput'unuzu aynı pencere için GPU harcamasına bölün — bu tek sayı, MIG, time-slicing veya batching değişikliklerinin gerçekten karşılığını verip vermediğini, ham kullanım yüzdesinin gösteremeyeceği şekilde gösteriyor.

Kapasite fiyatlandırması da hareket ediyor ve bu, kullanımı doğru ayarlamanın bahsini yükseltiyor: Cast AI, H200 AWS Capacity Block fiyatlandırmasının Ocak 2026'da %15 arttığını ve kendi hesaplarına göre bunun yaklaşık yirmi yılda bu türden ilk GPU fiyat artışı olduğunu bildiriyor. Daha pahalı bir saatte %5 kullanımlı bir GPU, bu fiyatlandırma sürdüğü her ay daha kötü bir takas.

## Yönetilen çıkarım, Kubernetes'te kendi barındırmaya ne zaman tercih edilir?

Kendi barındırma; paylaşılan GPU'ları makul ölçüde meşgul tutacak kadar büyük, istikrarlı ve tahmin edilebilir bir hacim çalıştırdığınızda veya veri yerleşimi kuralları iş yükünü maliyetten bağımsız kendi kümenize zorladığında kazanıyor. Yönetilen çıkarım API'leri; trafiğiniz patlamalı, düşük hacimli veya deneysel olduğunda kazanıyor, çünkü talebi çözmeye çalışırken kendi %5 kullanımlı filonuzu taşımak yerine, başka birinin zaten çözdüğü kullanım için ödeme yapıyorsunuz. Yararlı bir kural: gelecek ayın çıkarım hacmini henüz kabaca 2 kat içinde tahmin edemiyorsanız, GPU kullanım sorununu kendiniz sahiplenmeye hazır değilsiniz — tahmin edebilene kadar kiralayın.

Checkpoint'li spot GPU'lar genellikle "ucuz GPU" kategorisine konuyor, ama asıl işlevleri farklı: spot kapasite istenmedik bir anda geri alındığında (reclaim), modelin ara durumunu düzenli aralıklarla diske yazan bir checkpoint mekanizması olmadan, o anda yarıda kalan işin tamamını kaybedersiniz. Bu yüzden spot GPU'ya geçmeden önce sorulması gereken soru "ne kadar tasarruf ederim" değil, "checkpoint sıklığım, olası bir reclaim'in maliyetinden daha ucuz mu" — kısa, sık checkpoint'ler diske yazma yükü getirir; uzun aralıklı checkpoint'ler ise bir reclaim anında kaybedilen işi büyütür.

Dürüst görüşüm: checkpoint'li spot GPU'lar maliyet kontrolü için sürekli öneriliyor ve gerçekten yardımcı oluyorlar, ama yanlış katmanı çözüyorlar — %5 kullanımda çalışan bir spot instance, hâlâ %95 boşa harcanan bir spot instance. Önce kullanımı düzeltin; spot, MIG ve batching bunun üzerine çarpan, onun yerine geçen şeyler değil.

Birincil kaynaklar: [Cast AI'nin Kubernetes GPU optimizasyonu araştırması](https://cast.ai/blog/kubernetes-gpu-optimization/), [Cast AI'nin GPU paylaşımı maliyet dökümü](https://cast.ai/blog/gpu-sharing-kubernetes-cost-optimization/) ve [The New Stack'in Kubernetes'te GPU'lar üzerine haberi](https://thenewstack.io/gpus-on-kubernetes/).

## Sıkça Sorulan Sorular

### Bir Kubernetes kümesinin GPU kapasitesinin ne kadarı gerçekten kullanılmıyor?

Cast AI'nin on binlerce production küme üzerinden derlediği 2026 State of Kubernetes Optimization raporu, medyan GPU kullanımını sadece %5 buldu. Bu, ölçülen kümelerin yarısının, ödedikleri GPU donanımının %5'inde veya daha altında bir kullanımla çalıştığı anlamına geliyor.

### Bir GPU'yu paylaştırmak için MIG mi time-slicing mi kullanmalıyım?

Bir kurumsal SLA'yı karşılamak için iş yükleri arasında sıkı, donanım seviyesinde izolasyona ihtiyacınız olduğunda MIG kullanın; çünkü her partisyon birbirine karışmayan ayrılmış bellek alıyor. İş yüklerinin tam GPU üzerinde sırayla çalışabildiği, patlamalı ve gecikmeye toleranslı çıkarım için time-slicing kullanın; NVIDIA'nın kendi benchmark'ları, hafif ve patlamalı görevlerde MIG'den az da olsa daha hızlı olabildiğini gösteriyor.

### Çıkarım için GPU maliyet verimliliğini hangi metrikle takip etmeliyim?

GPU-saat başına maliyet yerine, sunulan her 1.000 token'ın maliyetini takip edin. Düşük kullanımlı bir GPU'da düşük bir saatlik ücret, kapasiteye yakın çalışan daha pahalı bir GPU'dan bile daha kötü bir token-başı maliyet üretebilir; token-başı maliyet, paylaşım, batching veya otomatik ölçekleme değişikliklerinin gerçekten karşılığını verip vermediğini yansıtan sayı.

### Kubernetes'te çıkarımı kendi barındırmak mı, yönetilen bir API kullanmak mı daha ucuz?

Hacim tahmin edilebilirliğine bağlı. İstikrarlı, yüksek hacimli trafik genellikle kendi barındırmayı destekler; çünkü paylaşılan GPU'ları operasyonel ek yükü haklı çıkaracak kadar meşgul tutabilirsiniz. Patlamalı, düşük hacimli veya deneysel iş yükleri genellikle yönetilen bir çıkarım API'sini destekler; çünkü talep hâlâ belirsizken tek hanelerde kullanımla çalışan kendi barındırılan GPU filonuz için ödeme yapmaktan kaçınırsınız.
