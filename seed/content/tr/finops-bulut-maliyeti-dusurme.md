---
title: "FinOps: Bulut Faturasını Nasıl Düşürürsün"
slug: "finops-bulut-maliyeti-dusurme"
translationKey: "finops-cloud-costs"
locale: "tr"
excerpt: "2026 için FinOps oyun kitabı: her şeyi etiketle, boş kaynakları kapat, right-sizing yap, taahhüt planı al ve en hızlı büyüyen kalem AI ile GPU'yu yönet."
category: "devops-cloud"
tags: ["finops", "cost-optimization", "cloud", "devops"]
publishedAt: "2026-07-04"
seoTitle: "FinOps: Bulut Faturasını Nasıl Düşürürsün"
seoDescription: "2026'da FinOps ile bulut maliyeti düşürme: etiketleme, boş kaynak temizliği, right-sizing, taahhüt planları ve yeni bir numaralı kalem olan AI ve GPU harcaması. Gerçek sayılarla."
---

Çoğu mühendis bulut faturasını düşürmeyi daha ucuz instance bulmak sanır: EC2 filosunu right-size et, bir Reserved Instance al, dev cluster'ı gece kapat. Bunlar hâlâ işe yarar ve yapmalısınız. Ama Temmuz 2026 itibarıyla bu, çoğu zaman gemi başka bir yerden su alırken pirinçleri parlatmaktır. Çoğu faturada en hızlı büyüyen kalem artık compute değil, yapay zeka. FinOps Foundation'ın [State of FinOps 2026](https://data.finops.org/) raporunda ekiplerin %98'i artık AI harcamasını yönetiyor; iki yıl önce bu oran %31'di. Ve GPU maliyeti, ilk kez genel bulut maliyetini geçerek bir numaralı endişe oldu.

Yani bugün bulut maliyeti düşürmeyi gerçekten öğrenmek istiyorsanız, FinOps sizi oraya götüren operasyon modeli olmaya devam ediyor; sadece hedef kaydı. Her kaynağa bir sahip verin, harcamayı neredeyse gerçek zamanlı görünür kılın, sonra sırasıyla boştaki kapasiteye, aşırı provizyona, on-demand fiyatlandırmaya ve artık kontrolden çıkan token faturalarına saldırın. Aşağıdaki kontrol listesi, şişmiş bir AWS veya GCP hesabında uyguladığımız tam sıradır ve ilk iki haftada genellikle %20-40 tasarruf ortaya çıkarır.

FinOps satın aldığınız bir araç değil. Mühendislik, finans ve ürün ekiplerini tek bir döngüde birleştiren bir pratiktir; böylece maliyet çeyreklik bir sürpriz olmaktan çıkıp birinci sınıf bir metriğe dönüşür. 2026'daki bir projede bu liste, müşterinin aylık AWS faturasını 61.000 dolardan 38.500 dolara indirdi; tek bir özelliği bile yavaşlatmadan.

## FinOps tam olarak nedir?

FinOps (Cloud Financial Operations), değişken bulut harcamasını yönetmek için mühendislik, finans ve iş ekiplerinin maliyet sorumluluğunu paylaştığı kültürel ve operasyonel bir pratiktir. Gerçek zamanlı görünürlük, kaynak sahipliği ve sürekli optimizasyonu birleştirir; böylece ekipler hız, maliyet ve kalite arasında tahminle değil veriyle karar verir.

FinOps Foundation bunu sonsuza dek tekrarlayan üç aşamayla tanımlar: **Inform** (görünürlük ve dağıtım), **Optimize** (fiyat ve kullanım) ve **Operate** (sürekli yönetişim). FinOps ile bulut maliyeti düşürme tek seferlik bir temizlik değil, bir döngüdür; çünkü hem kullanım hem fiyatlar sürekli kayar. 2026'nın farkı: kapsam patladı. Uygulayıcıların artık %90'ı SaaS harcamasını, %64'ü yazılım lisanslarını yönetiyor; yani EC2'ye uyguladığınız disiplin bugün OpenAI faturanızı ve Datadog sözleşmenizi de kapsıyor.

## Bulut faturaları neden kontrolden çıkar?

Bulut faturaları üç tahmin edilebilir nedenle şişer: **harcamanın sahibi yoktur**, **kaynaklar amacından fazla yaşar** ve **ekipler sabit iş yükleri için on-demand ücret öder**. Self-servis provizyon, bir test için `db.r6g.4xlarge` açıp unutmayı çok kolaylaştırır. Etiket ve alarm olmadan bu maliyet beş haneli bir kalemin içinde saklanır.

Diğer sessiz katil aşırı provizyondur. Mühendisler "ne olur ne olmaz" diye instance'ları zirvenin zirvesine göre boyutlandırır; günün iki saati dokunduğunuz kapasiteye 7/24 para ödersiniz. 2026'da bir dördüncüsü de var: training job bittikten sonra açık kalan bir A100 ya da H100, veya küçük bir modelin yüzde bir fiyatına yapabileceği bir işi sessizce frontier modele yaptıran bir sohbet özelliği. FinOps, her doları bir ekibe izlenebilir kılarak bu teşviki düzeltir.

## FinOps kontrol listesi: faturayı nasıl kesersin?

FinOps ile bulut maliyeti düşürme, en ucuz ve en güvenli kazançlar başta olacak şekilde sıralı bir kontrol listesi olarak en iyi sonucu verir. Aşağıdaki her adım bağımsız olarak ölçülebilir, yani sayıyı hangi değişikliğin hareket ettirdiğini her zaman bilirsiniz. Kabaca bu sırayla ilerleyin.

### 1. Her şeyi etiketle ve dağıt

İzleyemediğinizi optimize edemezsiniz. Bir etiketleme politikasını (`team`, `env`, `service`, `cost-center`) zorunlu kılın ve etiketsiz kaynakları CI'da bloklayın. Sonra Cost Allocation Tags'i açın ki her dolar bir sahibe eşlensin.

```bash
# Etiketsiz EC2 instance'larını bul (klasik bütçe kaçağı)
aws ec2 describe-instances \
  --query "Reservations[].Instances[?!not_null(Tags[?Key=='team'].Value)].InstanceId" \
  --output text
```

### 2. Boştaki ve sahipsiz kaynakları kapat

Boştaki kaynaklar yapacağınız en hızlı ve en güvenli kesintidir. Haftalık olarak bağlanmamış EBS volume'ları, boştaki load balancer'ları, eski snapshot'ları ve elastic IP tutan durdurulmuş instance'ları tarayın. Bir hesapta sadece sahipsiz volume ve snapshot'ları silmek aylık 4.200 dolar tasarruf sağladı.

```bash
# Para yakan bağlanmamış EBS volume'ları
aws ec2 describe-volumes \
  --filters Name=status,Values=available \
  --query "Volumes[].[VolumeId,Size]" --output table
```

### 3. Aşırı provizyonlu compute'u right-size et

Right-sizing tek başına compute'ta genellikle %30-50 tasarruf sağlar. CloudWatch'tan veya monitoring stack'inizden 14 günlük p95 CPU ve bellek verisini çekin ve iş yüklerini bir seviye aşağı taşıyın. Ortalama %8 CPU'da duran bir filoya `m5.2xlarge` node gerekmez.

### 4. Production dışı ortamları zamanla kapat

Dev, staging ve CI ortamlarının geceleri ve hafta sonları çalışmasına nadiren gerek vardır. Bunları mesai dışında otomatik durdurun; çalışma sürelerini yaklaşık %65 azaltırsınız (haftada 168 saatten 50 saate). Bu tek script son bir müşteride projenin tüm maliyetini çıkardı.

### 5. Savings Plan veya Reserved Instance taahhüdü ver

Sabit taban yük için bir [AWS Savings Plan](https://aws.amazon.com/savingsplans/compute-pricing/) veya Committed Use Discount, on-demand'e göre ciddi tasarruf sağlar. Temmuz 2026 itibarıyla EC2 Instance Savings Plans %72'ye, daha esnek olan Compute Savings Plans ise %66'ya kadar indirim veriyor. Yalnızca emin olduğunuz tabana taahhüt verin, zirveyi on-demand veya spot ile karşılayın ve kapsamı aylık gözden geçirin ki daralan bir tabana fazla taahhüt vermeyin.

### 6. Kesintiye dayanıklı iş yüklerini spot'a taşı

Spot / preemptible instance'lar on-demand'den %60-90 daha ucuza çalışır. Durumsuz, hataya dayanıklı iş yüklerini (batch job'lar, CI runner'lar, kuyruk arkasındaki durumsuz API'ler) spot'a yönlendirin; veritabanlarını ve tek replikalı kritik servisleri taahhütlü kapasitede tutun.

### 7. AI ve GPU harcamasını yönet

Bu, iki yıl önce var olmayan ve şimdi baskın hale gelen adım. Token tüketimini yalnızca hesap başına değil, özellik ve API anahtarı başına izleyin. Her isteği eval'inizi geçen en küçük modele yönlendirin; çünkü çoğu iş yükü frontier modele hiç ihtiyaç duymadı. FinOps Foundation, model yönlendirmeyi en yüksek etkili AI optimizasyonu olarak tanımlıyor. GPU node'larını autoscaling'de tutun, kalite izin verdiğinde quantize edin ve sabit inference için kapasite ayırın. Sonra ham token sayısı yerine **sonuç başına maliyet** (sorgu başına, kullanıcı başına, çözülen kayıt başına) raporlayın.

### 8. Depolamayı optimize et ve egress'i kıs

Depolama sessizce birikir. Lifecycle politikalarıyla soğuk veriyi seyrek erişim veya arşiv katmanlarına taşıyın, yarım kalan multipart upload'ları silin ve uyumluluk izin verdiğinde 90 günlük log saklamasını 30 güne düşürün; bu tek başına çoğu zaman aylık dört haneli tasarruf getirir. Egress, spike atana kadar kimsenin okumadığı faturadır: konuşkan servisleri aynı bölge ve AZ içinde tutun, statik varlıkların önüne bir CDN koyun ve NAT gateway yerine VPC endpoint kullanın.

### 9. Bütçe ve anomali alarmları kur

Optimizasyon, koruma bariyeri olmadan çürür. Ekip başına bütçe belirleyin ve anomali tespitini açın ki kaçak bir training job, ay sonunda değil aynı gün birini uyarsın. Yalnızca mutlak toplama değil, değişim hızına da alarm kurun.

### 10. Maliyeti haftalık ritüele dönüştür (showback)

Harcamayı her ekibe geri dağıtın (showback) ve kısa bir haftalık rapor paylaşın. Mühendisler kendi sayısını görünce kendini düzeltir. Bu, "Operate" aşamasıdır ve tasarrufların geri sızmasını önleyen şey budur.

## 2026'da hangi FinOps araçlarını kullanmalısın?

Aşağıdaki tablo en çok başvurduğumuz araçları ve her birinin nereye uygun olduğunu gösterir. Bu yıl yapısal olarak bir şey değişti: açık faturalama şeması olan [FOCUS](https://focus.finops.org/focus-specification/v1-2/), v1.4'e ulaştı (Haziran 2026'da onaylandı) ve artık SaaS, PaaS ve token harcamasını ham bulutla aynı sütunlara normalize ediyor; böylece çoklu tedarikçi raporlaması nihayet akla yatkın hale geldi. Görünürlükle başlayın, sonra optimizasyonu üstüne katın.

| Araç | Amaç | Maliyet | En uygun |
|------|------|---------|----------|
| AWS Cost Explorer | Yerel görünürlük + tahmin | Ücretsiz | Sadece AWS hesapları |
| Cloudability / Apptio | Çoklu bulut FinOps platformu | Ücretli | Kurumsal showback |
| Kubecost / OpenCost | Kubernetes maliyet dağıtımı | Freemium / açık kaynak | Container harcaması |
| Infracost | Pull request'te maliyet tahmini | Freemium | CI'da shift-left |
| AWS Compute Optimizer | Right-sizing önerileri | Ücretsiz | Instance ayarı |
| Vantage / Finout | FOCUS-native maliyet + LLM ingest | Ücretli | AI ve çoklu bulut harcaması |

Pratik sıra: paranın nereye gittiğini görmek için yerel araçları veya OpenCost'u kullanın, maliyetin code review'de görünmesi için Infracost ekleyin (shift-left, 2026 anketinde en çok istenen yetenekti) ve ancak çoklu bulut artı AI harcaması yönetmeye başlayınca FOCUS-native ücretli bir platform ekleyin.

## Nelere dikkat etmelisin?

En büyük FinOps hatası, güvenilirlikten ödün verecek kadar agresif optimize etmektir. Çok sıkı right-size ederseniz throttling ve OOMKill'e çarparsınız; bir Savings Plan'e fazla taahhüt verirseniz artık ihtiyacınız olmayan kapasiteye kilitlenirsiniz. Değişiklikleri kademeli yayın, p95/p99 gecikmeyi ve hata oranlarını izleyin ve her spot iş yükünde bir Pod Disruption Budget tutun.

Diğer başarısızlık biçimi kültürdür. Araçlar sayıyı gösterir, ama sayıyı aşağıda tutan tek şey paylaşılan sahipliktir. Daha derin okuma için [Kubernetes maliyet optimizasyonu](/tr/posts/kubernetes-maliyet-optimizasyonu), [platform engineering nedir](/tr/posts/platform-engineering-nedir), [log, metrik ve trace ile observability](/tr/posts/observability-nedir) ve harcamayı kod olarak etiketlemek için [Terraform mu Pulumi mi](/tr/posts/terraform-mu-pulumi-mi) rehberlerimize bakın. [DevOps ve bulut kategorimiz](/tr/category/devops-bulut) tüm kümeyi birbirine bağlar.

## Sıkça Sorulan Sorular

### FinOps bir bulut faturasında gerçekçi olarak ne kadar tasarruf sağlar?

Saha deneyimimize göre ihmal edilmiş bir hesap, ilk ayda sadece boş kaynak temizliği ve right-sizing ile %20-40 kazandırır; sonraki çeyrekte taahhüt ve spot ile bir %20-30 daha gelir. Olgun hesaplar bile yılda %10-15 bulur, çünkü kullanım ve fiyatlandırma sürekli kayar ve AI harcaması artık en şişkin yeni hedeftir.

### FinOps sadece büyük kurumlar için mi?

Hayır. Pratik aşağı doğru temiz ölçeklenir. Aylık 5.000 dolar harcayan bir startup aynı listeyi bir öğleden sonrada uygulayabilir: kaynakları etiketle, boş kapasiteyi kapat, production dışını zamanla, uygulamanın çağırabileceği modeli sınırla ve bir bütçe alarmı kur. Bulut maliyeti düşürmeye başlamak için özel bir ekip veya ücretli platform gerekmez.

### FinOps ile maliyet kesmenin farkı nedir?

Maliyet kesme tek seferlik bir olaydır; FinOps sürekli bir operasyon modelidir. Maliyet kesme "bu çeyrek neyi silebiliriz?" diye sorar. FinOps "maliyeti her ekibin sahiplendiği bir metriğe nasıl dönüştürürüz?" diye sorar. Amaç mümkün olan en düşük fatura değil, dolar başına en iyi değerdir; yani bazen FinOps daha hızlı ürün çıkarmak için daha fazla harcamak demektir.

### AI için FinOps normal bulut FinOps'undan nasıl farklı?

Mekanik aynıdır (önce görünürlük, sonra dağıtım, sonra optimizasyon) ama birimler değişir. Instance-saat yerine token ve GPU-saat ölçersiniz ve sağlayıcılar harcamayı sizin için nadiren etiketler, bu yüzden metadata'yı bir proxy veya gateway üzerinden enjekte edersiniz. En yüksek kaldıraçlı hamle, her isteği eval'inizi hâlâ geçen en ucuz modele yönlendirmek ve ham token hacmi yerine sonuç başına maliyet raporlamaktır.
