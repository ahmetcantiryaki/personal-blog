---
title: "FinOps: Bulut Faturasını Nasıl Düşürürsün"
slug: "finops-bulut-maliyeti-dusurme"
translationKey: "finops-cloud-costs"
locale: "tr"
excerpt: "Bulut maliyeti düşürme için FinOps kontrol listesi: her şeyi etiketle, boştaki kaynakları kapat, right-sizing yap, taahhüt planı al ve bütçe alarmı kur. Gerçek sayılarla."
category: "devops-cloud"
tags: ["finops", "cost-optimization", "cloud", "devops"]
publishedAt: "2026-06-24"
seoTitle: "FinOps: Bulut Faturasını Nasıl Düşürürsün"
seoDescription: "Bulut maliyeti düşürme FinOps kontrol listesi: etiketleme, boş kaynak temizliği, right-sizing, taahhüt planları ve bütçe alarmları. 2026'dan gerçek sayılarla."
---

Bulut maliyeti düşürme için doğru model FinOps'tur: her kaynağa bir sahip ver, harcamayı neredeyse gerçek zamanlı görünür kıl, sonra sırasıyla boştaki kapasiteye, aşırı provizyona ve on-demand fiyatlandırmaya saldır. Aşağıdaki kontrol listesi, şişmiş bir AWS veya GCP hesabında uyguladığımız tam sıradır ve ilk iki haftada genellikle %20-40 tasarruf ortaya çıkarır.

FinOps satın aldığınız bir araç değil. Mühendislik, finans ve ürün ekiplerini tek bir döngüde birleştiren bir pratiktir; böylece maliyet çeyreklik bir sürpriz olmaktan çıkıp birinci sınıf bir metriğe dönüşür. 2026'daki bir projede bu liste, müşterinin aylık AWS faturasını 61.000 dolardan 38.500 dolara indirdi; tek bir özelliği bile yavaşlatmadan.

## FinOps tam olarak nedir?

FinOps (Cloud Financial Operations), değişken bulut harcamasını yönetmek için mühendislik, finans ve iş ekiplerinin maliyet sorumluluğunu paylaştığı kültürel ve operasyonel bir pratiktir. Gerçek zamanlı görünürlük, kaynak sahipliği ve sürekli optimizasyonu birleştirir; böylece ekipler hız, maliyet ve kalite arasında tahminle değil veriyle karar verir.

FinOps Foundation bunu sonsuza dek tekrarlayan üç aşamayla tanımlar: **Inform** (görünürlük ve dağıtım), **Optimize** (fiyat ve kullanım) ve **Operate** (sürekli yönetişim). FinOps ile bulut maliyeti düşürme tek seferlik bir temizlik değil, bir döngüdür; çünkü hem kullanım hem fiyatlar sürekli kayar.

## Bulut faturaları neden kontrolden çıkar?

Bulut faturaları üç tahmin edilebilir nedenle şişer: **harcamanın sahibi yoktur**, **kaynaklar amacından fazla yaşar** ve **ekipler sabit iş yükleri için on-demand ücret öder**. Self-servis provizyon, bir test için `db.r6g.4xlarge` açıp unutmayı çok kolaylaştırır. Etiket ve alarm olmadan bu maliyet beş haneli bir kalemin içinde saklanır.

Diğer sessiz katil aşırı provizyondur. Mühendisler "ne olur ne olmaz" diye instance'ları zirvenin zirvesine göre boyutlandırır; günün iki saati dokunduğunuz kapasiteye 7/24 para ödersiniz. FinOps, her doları bir ekibe izlenebilir kılarak bu teşviki düzeltir.

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

Sabit taban yük için bir Savings Plan veya Committed Use Discount, on-demand'e göre %40-72 tasarruf sağlar. Yalnızca emin olduğunuz tabana taahhüt verin; zirveyi on-demand veya spot ile karşılayın. Taahhüt kapsamını aylık gözden geçirin ki daralan bir tabana fazla taahhüt vermeyin.

### 6. Kesintiye dayanıklı iş yüklerini spot'a taşı

Spot / preemptible instance'lar on-demand'den %60-90 daha ucuza çalışır. Durumsuz, hataya dayanıklı iş yüklerini (batch job'lar, CI runner'lar, kuyruk arkasındaki durumsuz API'ler) spot'a yönlendirin; veritabanlarını ve tek replikalı kritik servisleri taahhütlü kapasitede tutun.

### 7. Depolama katmanlarını optimize et

Depolama sessizce birikir. Lifecycle politikalarıyla soğuk veriyi seyrek erişim veya arşiv katmanlarına taşıyın ve yarım kalan multipart upload'ları silin. 90 günlük log saklamasını 30 güne düşürmek çoğu zaman tek başına aylık dört haneli tasarruf getirir.

### 8. Veri transferi ve egress'i kıs

Egress, spike atana kadar kimsenin okumadığı faturadır. Konuşkan servisleri aynı bölge ve AZ içinde tutun, statik varlıkların önüne bir CDN koyun ve NAT gateway üzerinden geçmek yerine VPC endpoint kullanın. AZ'ler arası trafik yaygın bir gizli kalemdir.

### 9. Bütçe ve anomali alarmları kur

Optimizasyon, koruma bariyeri olmadan çürür. Ekip başına bütçe belirleyin ve anomali tespitini açın ki kaçak bir job, ay sonunda değil aynı gün birini uyarsın. Yalnızca mutlak toplama değil, değişim hızına da alarm kurun.

### 10. Maliyeti haftalık ritüele dönüştür (showback)

Harcamayı her ekibe geri dağıtın (showback) ve kısa bir haftalık rapor paylaşın. Mühendisler kendi sayısını görünce kendini düzeltir. Bu, "Operate" aşamasıdır ve tasarrufların geri sızmasını önleyen şey budur.

## 2026'da hangi FinOps araçlarını kullanmalısın?

Aşağıdaki tablo en çok başvurduğumuz araçları ve her birinin nereye uygun olduğunu gösterir. Görünürlükle başlayın, sonra optimizasyonu üstüne katın.

| Araç | Amaç | Maliyet | En uygun |
|------|------|---------|----------|
| AWS Cost Explorer | Yerel görünürlük + tahmin | Ücretsiz | Sadece AWS hesapları |
| Cloudability / Apptio | Çoklu bulut FinOps platformu | Ücretli | Kurumsal showback |
| Kubecost / OpenCost | Kubernetes maliyet dağıtımı | Freemium / açık kaynak | Container harcaması |
| Infracost | Pull request'te maliyet tahmini | Freemium | CI'da shift-left |
| AWS Compute Optimizer | Right-sizing önerileri | Ücretsiz | Instance ayarı |
| CloudZero | Birim ekonomi (müşteri başına maliyet) | Ücretli | SaaS marjları |

Pratik sıra: paranın nereye gittiğini görmek için yerel araçları veya OpenCost'u kullanın, maliyetin code review'de görünmesi için Infracost ekleyin ve ancak çoklu bulut harcaması yönetmeye başlayınca ücretli bir platform ekleyin.

## İlk FinOps taramanı nasıl yaparsın?

İlk taramanızı tek bir hesapta sıkı bir iki haftalık döngü olarak yapın ki pratiği ölçeklemeden önce tasarrufu kanıtlayabilesiniz. Her yeni projede izlediğimiz sıra:

1. **Cost Explorer veya OpenCost'u etkinleştir** ve birkaç günlük dağıtım verisi toplamasını bekle.
2. **Etiketleme politikasını zorunlu kıl** ve her etiketsiz kaynağı işaretle.
3. **Boştaki kaynakları tara** — bağlanmamış volume'lar, boştaki LB'ler, eski snapshot'lar, durdurulmuş instance'lar.
4. **14 günlük p95 kullanımını çek** ve en pahalı 10 iş yükünü right-size et.
5. **Production dışı ortamları** gece ve hafta sonu için kapanacak şekilde zamanla.
6. **Kesintiye dayanıklı job'ları spot'a taşı**, on-demand'e düzgün fallback ile.
7. **Sadece emin olduğun tabanı kapsayan bir Savings Plan al.**
8. **Ekip başına bütçe ve anomali alarmları kur.**
9. **Haftalık maliyet raporu gönder** ve 14 gün sonra yeniden ölç.

Her adım geri alınabilir ve bağımsız ölçülebilir, yani faturayı hangi kolun hareket ettirdiğini her zaman tam olarak bilirsiniz.

## Nelere dikkat etmelisin?

En büyük FinOps hatası, güvenilirlikten ödün verecek kadar agresif optimize etmektir. Çok sıkı right-size ederseniz throttling ve OOMKill'e çarparsınız; bir Savings Plan'e fazla taahhüt verirseniz artık ihtiyacınız olmayan kapasiteye kilitlenirsiniz. Değişiklikleri kademeli yayın, p95/p99 gecikmeyi ve hata oranlarını izleyin ve her spot iş yükünde bir Pod Disruption Budget tutun.

Diğer başarısızlık biçimi kültürdür. Araçlar sayıyı gösterir, ama sayıyı aşağıda tutan tek şey paylaşılan sahipliktir. Daha derin okuma için [Kubernetes maliyet optimizasyonu](/tr/kubernetes-maliyet-optimizasyonu), [platform engineering nedir](/tr/platform-engineering-nedir) ve [log, metrik ve trace ile observability](/tr/observability-nedir) rehberlerimize bakın. [DevOps ve bulut kategorimiz](/tr/category/devops-cloud) tüm kümeyi birbirine bağlar.

## Sıkça Sorulan Sorular

### FinOps bir bulut faturasında gerçekçi olarak ne kadar tasarruf sağlar?

Saha deneyimimize göre ihmal edilmiş bir hesap, ilk ayda sadece boş kaynak temizliği ve right-sizing ile %20-40 kazandırır; sonraki çeyrekte taahhüt ve spot ile bir %20-30 daha gelir. Olgun hesaplar bile yılda %10-15 bulur, çünkü kullanım ve fiyatlandırma sürekli kayar.

### FinOps sadece büyük kurumlar için mi?

Hayır. Pratik aşağı doğru temiz ölçeklenir. Aylık 5.000 dolar harcayan bir startup aynı listeyi bir öğleden sonrada uygulayabilir: kaynakları etiketle, boş kapasiteyi kapat, production dışını zamanla ve bir bütçe alarmı kur. Bulut maliyeti düşürmeye başlamak için özel bir ekip veya ücretli platform gerekmez.

### FinOps ile maliyet kesmenin farkı nedir?

Maliyet kesme tek seferlik bir olaydır; FinOps sürekli bir operasyon modelidir. Maliyet kesme "bu çeyrek neyi silebiliriz?" diye sorar. FinOps "maliyeti her ekibin sahiplendiği bir metriğe nasıl dönüştürürüz?" diye sorar. Amaç mümkün olan en düşük fatura değil, dolar başına en iyi değerdir; yani bazen FinOps daha hızlı ürün çıkarmak için daha fazla harcamak demektir.

### Bir organizasyonda FinOps'un sahibi kimdir?

FinOps paylaşılan bir sorumluluktur; genellikle standartları belirleyen ve araçları kuran küçük bir merkezi ekip veya uygulayıcı tarafından koordine edilir. Mühendisler iş yüklerinin verimliliğine, finans tahmin ve taahhütlere, ürün ise değer dengelerine sahip çıkar. Merkezi ekip yol açar; her kararı denetlemez.
