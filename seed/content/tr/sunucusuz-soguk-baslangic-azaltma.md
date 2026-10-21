---
title: "Sunucusuz Soğuk Başlangıçları Nasıl Azaltırsınız?"
slug: "sunucusuz-soguk-baslangic-azaltma"
translationKey: "serverless-cold-starts-2026"
locale: "tr"
excerpt: "Kısa cevap: AWS SnapStart, provisioned concurrency veya daha küçük bundle kullanın; hangisi doğru, fonksiyonunuzun diline ve trafik desenine bağlı."
category: "devops-cloud"
tags: ["aws", "cloud", "performance", "cost-optimization", "devops"]
publishedAt: "2026-10-21"
seoTitle: "Sunucusuz Soğuk Başlangıçları Nasıl Azaltırsınız?"
seoDescription: "Kısa cevap: AWS SnapStart, provisioned concurrency veya daha küçük bundle kullanın; hangisi doğru, fonksiyonunuzun diline ve trafik desenine bağlı."
---

Kısa cevap: soğuk başlangıcı üç yoldan biriyle azaltırsınız — AWS SnapStart (desteklenen runtime'larda ücretsiz), provisioned concurrency (sürekli açık tutma, ücretli) veya daha küçük bir deployment paketi. Hangisinin doğru olduğu fonksiyonunuzun diline, trafiğin ne kadar düzensiz olduğuna ve soğuk başlangıcın kullanıcıya gerçekten görünüp görünmediğine bağlı.

## Soğuk başlangıç (cold start) nedir, neden olur?

Soğuk başlangıç, bir sunucusuz fonksiyonun yeni bir çalışma ortamında ilk kez tetiklendiğinde yaşanan ek gecikmedir. AWS Lambda bir isteği karşılamadan önce bir mikro VM başlatır, çalışma zamanını (runtime) yükler, fonksiyon kodunuzu import eder ve varsa global kapsamdaki initialization kodunu çalıştırır; bütün bu adımlar isteğin kendisinden önce gerçekleşir. Fonksiyon belirli bir süre (tipik olarak 5-15 dakika boşta kaldığında) kapatılır; bir sonraki istek yeniden bu başlatma maliyetini öder. Sık ve düzenli trafik alan bir fonksiyon genelde "sıcak" kalır ve soğuk başlangıç nadiren görülür; düzensiz, seyrek veya ani patlamalı trafik alan fonksiyonlar bu maliyeti sürekli öder.

## Hangi diller soğuk başlangıca daha çok maruz kalır?

Çalışma zamanının başlatma maliyeti dile göre değişir: yorumlanan diller (Node.js, Python) genelde derlenmiş veya JVM tabanlı çalışma zamanlarından (Java, .NET öncesi SnapStart) daha hızlı soğuk başlar, çünkü ortam daha az ağır bir runtime yükleme adımından geçer. Go ve Rust gibi derlenmiş, tek binary olarak paketlenen diller de genelde hızlı başlar. JVM'in sınıf yükleme ve just-in-time derleme adımları, Java ve .NET fonksiyonlarını listenin yavaş ucuna koyar — SnapStart'ın önce bu iki dil ailesi için geliştirilmiş olması tesadüf değil.

## AWS SnapStart nedir, hangi runtime'ları destekler?

SnapStart, fonksiyonunuzun başlatılmış hâlinin bir anlık görüntüsünü (snapshot) alıp önbelleğe yazan, her çağrıda bu görüntüyü geri yükleyen bir Lambda özelliğidir; fonksiyon sıfırdan değil, zaten "ısınmış" bir noktadan devam eder. SnapStart ilk olarak 2022'de Java 11 ve üzeri için yayınlandı; Kasım 2024'te Python 3.12+ ve .NET 8+ çalışma zamanlarına genişledi. Eylül 2026'da AWS, AWS'nin resmi base image'larını kullanan container olarak paketlenmiş fonksiyonlara da aynı üç dil ailesi için SnapStart desteği getirdiğini duyurdu; Node.js, Ruby veya özel base image kullanan container'lar için ek yapılandırma gerekiyor. SnapStart'ın en büyük avantajı: desteklenen runtime'larda ek ücret almadan, sadece bir yapılandırma bayrağıyla açılır.

| Yöntem | Maliyet | Kapsadığı runtime'lar | En uygun senaryo |
|---|---|---|---|
| AWS SnapStart | Ek ücret yok | Java 11+, Python 3.12+, .NET 8+ (ve destekleyen container image'lar) | Düzensiz trafikli, desteklenen dildeki fonksiyonlar |
| Provisioned concurrency | Saatlik, ayrılan kapasiteye göre ücretli | Tüm diller | Öngörülebilir, sürekli trafikli kritik yollar |
| Daha küçük bundle | Mühendislik zamanı | Tüm diller | Her senaryo, SnapStart/provisioned concurrency'ye ek olarak |
| Keep-warm ping | Ekstra çağrı maliyeti | Tüm diller, ama güvenilirliği düşük | Düşük trafikli, kritik olmayan fonksiyonlar |

## Provisioned concurrency soğuk başlangıcı nasıl çözer, maliyeti nedir?

Provisioned concurrency, Lambda'ya belirli sayıda ortamı sürekli "sıcak" ve çağrıya hazır tutmasını söyler; bu ortamlar hiçbir zaman kapanmaz, dolayısıyla hiçbir istek soğuk başlangıç ücreti ödemez. Bedeli açık: ayrılan her kapasite birimi, çağrı sayısından bağımsız olarak saatlik ücretlendirilir, yani trafiğiniz sıfıra düşse bile fatura devam eder. Bu yöntem, soğuk başlangıcın kullanıcıya doğrudan görünür olduğu ödeme veya kimlik doğrulama gibi kritik yollarda mantıklı; arka planda çalışan toplu iş fonksiyonlarında parayı sokağa atmak demek.

## Daha küçük bundle soğuk başlangıcı nasıl azaltır?

Lambda, fonksiyonu çalıştırmadan önce deployment paketinizi indirip açar; paket büyüdükçe bu adım da uzar. Kullanılmayan bağımlılıkları ağaçtan temizlemek (tree-shaking), büyük SDK'ları yalnızca ihtiyaç duyulan alt modülleriyle import etmek ve global kapsamdaki ağır initialization kodunu (örneğin kullanılmayan bağlantı havuzları) kaldırmak, hem SnapStart hem provisioned concurrency ile birlikte çalışan, diline bakılmaksızın geçerli bir optimizasyon.

Bellek ayarı da gözden kaçan bir lever: Lambda, ayrılan CPU gücünü bellek miktarıyla orantılı olarak artırır, dolayısıyla belleği 128 MB'tan 512 MB'a çıkarmak sadece çalışma zamanı performansını değil, başlatma adımını da hızlandırabilir. Bu ayarı değiştirmeden önce ve sonra `Init Duration` metriğini karşılaştırmak, ek bellek maliyetinin gerçekten karşılığını verip vermediğini gösterir.

```yaml
# AWS SAM şablonunda SnapStart'ı açmak
Resources:
  MyFunction:
    Type: AWS::Serverless::Function
    Properties:
      Runtime: java21
      SnapStart:
        ApplyOn: PublishedVersions
      AutoPublishAlias: live
```

## Keep-warm ping hâlâ işe yarar mı?

Kısmen. Keep-warm ping, fonksiyonu her birkaç dakikada bir boş bir istekle tetikleyip boşta kapanmasını önleme fikrine dayanır; ama bu yöntem Lambda'nın eşzamanlı çağrı sayısını garanti etmez. Tek bir ping, tek bir ortamı sıcak tutar; aynı anda 10 eşzamanlı istek gelirse 9'u yine soğuk başlar. Bu yüzden keep-warm, düşük ve tahmin edilebilir eşzamanlılığı olan, kritik olmayan fonksiyonlarda ek bir tampon olarak işe yarar; ödeme akışı gibi kritik ve yüksek eşzamanlılıklı yollarda provisioned concurrency'nin yerini tutmaz.

## Soğuk başlangıcı nasıl ölçersiniz?

CloudWatch'taki `Init Duration` metriği, her soğuk başlangıcın ne kadar sürdüğünü doğrudan raporlar; bu metrik olmadan yapılan her optimizasyon tahminden ibaret kalır. AWS X-Ray'i etkinleştirirseniz, soğuk başlangıç segmentini isteğin kalan kısmından ayrı görür, hangi adımın (runtime yükleme mi, global initialization mu) asıl maliyeti oluşturduğunu görürsünüz. Ölçmeden SnapStart, provisioned concurrency ve bundle küçültmeyi aynı anda uygulamak, hangisinin gerçekten fark yarattığını asla bilemeyeceğiniz anlamına gelir.

## Soğuk başlangıç sizin için gerçekten önemli mi?

Hayır, her fonksiyon için değil. Soğuk başlangıcın gerçek maliyeti, kullanıcının bunu fark edip etmediğine bağlı: zaten 2-3 saniye süren bir arka plan işine eklenen 300 ms görünmez, ama bir API gateway'in arkasındaki senkron bir çağrıya eklenen aynı 300 ms kullanıcı deneyimini doğrudan etkiler. Önce fonksiyonun çağrı deseninin düzenli mi düzensiz mi olduğuna, sonra soğuk başlangıcın hangi kullanıcı akışında göründüğüne bakın; ikisi de düşükse optimizasyon mühendislik zamanına değmez.

Kişisel görüşüm şu: çoğu ekip soğuk başlangıcı "sunucusuzun kaçınılmaz bedeli" diye kabullenip hiç ölçmüyor. Oysa [hücre tabanlı mimari rehberimizde](/tr/posts/hucre-tabanli-mimari-patlama-yaricapi) anlattığımız gözlemlenebilirlik mantığının aynısı burada da geçerli: önce ölçün, sonra hangi yöntemi uygulayacağınıza karar verin. Rastgele her yöntemi üst üste eklemek, maliyeti artırırken gecikmeyi fark edilir ölçüde iyileştirmeyebilir; üstüne provisioned concurrency faturası, çözülmemiş bir sorunun üzerine binen gereksiz bir sabit gider olarak kalır.

Ekibinizin soğuk başlangıca verdiği tepki genelde bütçeyle de ilgili: provisioned concurrency'yi "sorunu çöz, parasını düşünme" diye açmak kısa vadede rahatlatır ama [Kubernetes maliyet optimizasyonu rehberimizde](/tr/posts/kubernetes-maliyet-optimizasyonu) anlattığımız genel kural burada da geçerli — ölçülmeyen her kapasite ayrımı, altı ay sonra kimsenin hatırlamadığı bir fatura kalemine dönüşür.

Mimari seçiminizi genel olarak sunucusuz mu Kubernetes mi diye sorguluyorsanız [bu karşılaştırmamız](/tr/posts/hala-kubernetes-gerekli-mi-2026) size yardımcı olabilir; dağıtım sırasında riski azaltmak için [CI/CD pipeline rehberimize](/tr/posts/cicd-pipeline-nasil-kurulur) de göz atabilirsiniz. AWS'nin resmi [SnapStart dokümantasyonu](https://docs.aws.amazon.com/lambda/latest/dg/snapstart.html) ve [container image desteği duyurusu](https://aws.amazon.com/about-aws/whats-new/2026/07/aws-lambda-snapstart-container/) güncel kapsam için en güvenilir kaynak.

## Sıkça Sorulan Sorular

### SnapStart her Lambda fonksiyonunda ücretsiz mi?

Desteklenen runtime'larda (Java 11+, Python 3.12+, .NET 8+) evet, SnapStart'ın kendisi ek ücret almıyor; yalnızca normal Lambda çağrı ve süre ücretlerini ödersiniz. Node.js veya özel container image kullanan fonksiyonlar bu kapsamın dışında kalıyor.

### Provisioned concurrency ile SnapStart birlikte kullanılabilir mi?

Hayır, Lambda bir fonksiyon sürümünde aynı anda ikisini birden etkinleştirmenize izin vermiyor; hangisinin fonksiyonunuzun trafik desenine uyduğuna göre birini seçmeniz gerekiyor.

### Soğuk başlangıç kaç milisaniye sürer?

Standart bir sayı yok; süre dile, bellek boyutuna, bağımlılık sayısına ve VPC kullanıp kullanmadığınıza göre değişir. Kendi fonksiyonunuz için gerçek rakamı öğrenmenin tek güvenilir yolu, CloudWatch'ta `Init Duration` metriğini izlemek.

### Küçük bir yan proje için soğuk başlangıcı optimize etmeye değer mi?

Genelde hayır. Düşük trafikli, kritik olmayan bir projede ek 200-500 ms'lik bir gecikme nadiren fark edilir; mühendislik zamanınızı burada harcamak yerine gerçek kullanıcı etkisi olan bir yere ayırmak daha mantıklı.
