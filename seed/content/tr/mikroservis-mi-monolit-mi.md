---
title: "Mikroservis mi Monolit mi: Doğru Karar"
slug: "mikroservis-mi-monolit-mi"
translationKey: "microservices-vs-monolith"
locale: "tr"
excerpt: "CNCF 2025 anketine göre mikroservise geçen ekiplerin %42'si servisleri geri birleştiriyor. Mikroservis mi monolit mi? 2026 rakamlarıyla karar tablosu içeride."
category: "software-engineering"
tags: ["microservices", "software-architecture", "system-design"]
publishedAt: "2026-07-06"
seoTitle: "Mikroservis mi Monolit mi: 2026 Karar Rehberi"
seoDescription: "Mikroservis mi monolit mi? CNCF 2025 verileri, Amazon Prime Video'nun %90 maliyet düşüşü ve karar tablosuyla hangisiyle başlayacağınızı dakikalar içinde bilin."
---

**Mikroservis mi monolit mi** tartışmasının yönü 2026'da net biçimde değişti. CNCF'in 2025 Yıllık Anketi—689 katılımcı, ±%3,8 hata payı—mikroservise geçen organizasyonların %42'sinin servisleri yeniden daha büyük dağıtım birimlerinde birleştirdiğini gösteriyor. Soru artık "nasıl bölerim" değil; "gerçekten bölmem gerekiyor mu?"

Cevap tek bir gerçeğe iner: kaç ekibiniz var ve neyi bağımsız ölçeklemeniz gerekiyor? Tek ekip ve tek deploy hattıyla çalışıyorsanız monolit daha hızlı, daha ucuz ve hata ayıklaması daha kolaydır. Farklı ekipler bağımsız yayın yapmak, servisleri ayrı ölçeklemek zorundaysa mikroservis işe yarar. Bu yazıda iki mimariyi 2026 rakamları, gerçek migrasyon maliyetleri ve üretim örnekleriyle karşılaştırıyorum.

## Mikroservis ve monolit farkı nedir?

Kısa cevap: Monolit, tüm iş mantığının tek bir kod tabanı ve tek bir deploy biriminde toplandığı mimaridir. Mikroservis ise uygulamayı, her biri kendi veritabanına ve deploy hattına sahip, ağ üzerinden konuşan küçük bağımsız servislere bölmektir. Fark, sınırların nerede çizildiğidir: kod içinde mi, ağ üzerinde mi?

Monolit tek bir süreç olarak çalışır; modüller birbirini fonksiyon çağrısıyla çağırır. Mikroservis mimarisinde ise aynı çağrı bir HTTP veya gRPC isteğine, yani ağ sınırına dönüşür. Bu terim 2014'te Martin Fowler ve James Lewis'in [Microservices](https://martinfowler.com/articles/microservices.html) makalesiyle yaygınlaştı ve 2026'da hâlâ referans tanım olarak kullanılıyor.

Basit bir sezgi: Bir özelliği değiştirmek için tek bir depoyu derleyip tek seferde deploy ediyorsanız monolit çalıştırıyorsunuz. Aynı özellik üç ayrı servisin ayrı ayrı yayınlanmasını gerektiriyorsa mikroservis dünyasındasınız.

## Karşılaştırma tablosu: mikroservis vs monolit

Aşağıdaki tablo iki mimariyi üretim açısından kritik boyutlarda karşılaştırıyor. Karar verirken önce bu satırlara bakın.

| Boyut | Modüler Monolit | Mikroservis |
|-------|-----------------|-------------|
| Deploy birimi | Tek | Servis başına ayrı |
| İdeal ekip boyutu | 10-50 geliştirici | 50+, net sınırlı ekipler |
| Ölçekleme | Tüm uygulama birlikte | Servis bazında bağımsız |
| Veri | Tek veritabanı, ACID işlemler | Servis başına veritabanı, dağıtık tutarlılık |
| Hata ayıklama | Kolay, tek yığın izi | Zor, dağıtık izleme (OpenTelemetry) şart |
| İlk hız | Yüksek, düşük ek yük | Düşük, altyapı yükü ağır |
| Operasyon maliyeti | Düşük | Yüksek (CI/CD, izleme, ağ) |
| Sınır ihlaline karşı | Spring Modulith / ArchUnit ile derlemede yakalanır | Ağ sınırı doğal engel, ama pahalı |

Pratik kural: Bir özelliği çizdiğinizde sınırlar tek takımın içinde kalıyorsa monolit yazın. Sınırlar farklı ekiplere ve farklı ölçekleme ihtiyaçlarına ayrılıyorsa mikroservis düşünün.

## Monolit ne zaman kullanılır?

Kısa cevap: Tek bir ürün üzerinde çalışan tek ya da az sayıda ekibiniz varsa, ürün-pazar uyumunu hâlâ arıyorsanız ve operasyon olgunluğunuz sınırlıysa monolit kullanın. CNCF verisine göre 10-50 geliştiricilik ekipler için modüler monolit sadece varsayılan değil, çoğu durumda doğru cevap.

Monolitin parladığı yerler:

- **Erken evre ürünler:** Sınırların nerede olacağını henüz bilmezsiniz. Monolit içinde modül sınırını değiştirmek bir refactor'dur; mikroservislerde ise iki ekibin koordinasyonunu gerektiren bir projedir.
- **Küçük ekipler:** 5-10 kişilik bir ekip için 15 servisin CI/CD, izleme ve ağ yükü saf israftır.
- **Güçlü tutarlılık gerektiren işlemler:** Tek veritabanında `BEGIN...COMMIT` ile hallettiğiniz bir işlem, mikroservislerde saga ve telafi mantığına dönüşür.

En çarpıcı örnek Amazon'un kendisinden geldi: Prime Video'nun Video Kalite Analizi ekibi, dağıtık mikroservis ve AWS Step Functions üzerine kurulu sistemini tek süreçli bir monolite geri çekti ve [altyapı maliyetini %90 düşürdü](https://www.primevideotech.com/video-streaming/scaling-up-the-prime-video-audio-video-monitoring-service-and-reducing-costs-by-90). Sorun kodda değil, mimarideydi: her kare S3'e yükleniyor, bir sonraki servis tekrar indiriyordu ve her durum geçişi ayrı ayrı faturalanıyordu.

```python
# Modüler monolit: sınırlar kod içinde, çağrı fonksiyon çağrısı
def siparis_olustur(sepet: Sepet) -> Siparis:
    with veritabani.transaction():          # tek ACID işlem
        stok.dus(sepet.kalemler)            # aynı süreç, aynı DB
        odeme = tahsilat.al(sepet.tutar)    # ağ yok, saga yok
        return siparis_kaydet(sepet, odeme)
```

Bu kodda işlem ya tümüyle olur ya da geri alınır. Dağıtık tutarlılık derdi yoktur; işte monolitin erken evrede en büyük değeri budur.

## Mikroservis ne zaman kullanılır?

Kısa cevap: Farklı ekipler bağımsız yayın yapmak istiyorsa, servisleri birbirinden bağımsız ölçeklemeniz gerekiyorsa ve dağıtık sistemi işletecek operasyon olgunluğunuz varsa mikroservis kullanın. Mikroservis, ekip bağımsızlığı ve seçici ölçeklemenin değerini ancak organizasyon yeterince büyüdüğünde geri öder.

Mikroservisin parladığı yerler:

- **Bağımsız ekip ölçeği:** 8 ekip tek monolite commit atınca yayın hattı tıkanır. Her ekip kendi servisini kendi hızında yayınlayabilirse hız artar. Amazon ve Netflix bu yola tam da bu yüzden girdi.
- **Asimetrik ölçekleme:** Video kodlama servisiniz 40 makine isterken kullanıcı profili servisi 2 makineyle idare ediyorsa, bunları ayrı ölçeklemek ciddi maliyet tasarrufu sağlar.
- **Teknoloji çeşitliliği:** Bir servisi Go'da, ML çıkarımını Python'da, gerçek zamanlı katmanı Rust'ta çalıştırmak istiyorsanız servis sınırları bunu doğal kılar.

Mikroservise geçerken üç şey şarttır. Birincisi, sağlam bir **gözlemlenebilirlik katmanı**: [dağıtık izleme (OpenTelemetry)](https://opentelemetry.io/docs/), merkezi log ve metrik olmadan tek bir isteğin nerede takıldığını bulmak imkânsızdır—bu konuya [observability 101 yazımızda](/tr/posts/observability-nedir) girdik. İkincisi, otomatik [CI/CD ve altyapı](/tr/posts/cicd-pipeline-nasil-kurulur): 20 servisi elle deploy edemezsiniz. Üçüncüsü, ağ hatalarına dayanıklılık: retry, timeout, circuit breaker ve idempotent uçlar olmadan tek bir yavaş servis tüm sistemi çökertir.

```python
# Mikroservis: sınır ağda, çağrı bir ağ isteği — dayanıklılık şart
async def siparis_olustur(sepet: Sepet) -> Siparis:
    async with circuit_breaker, timeout(2.0):      # ağ her an düşebilir
        await stok_servisi.rezerve_et(sepet.kalemler)   # HTTP/gRPC
        odeme = await odeme_servisi.tahsil(sepet.tutar) # ayrı DB, ayrı ekip
    # Hata olursa telafi (saga) mantığı devreye girer
    return await siparis_servisi.kaydet(sepet, odeme)
```

## Mikroservis mi monolit mi: nasıl karar veririm?

Kısa cevap: Şu üç soruyu sırayla sorun. "Tek ürün üzerinde tek ya da az ekip mi çalışıyor?" Evet ise monolit. "Servisleri ayrı ölçeklemem şart mı?" Hayır ise monolit. "Dağıtık sistemi işletecek izleme, CI/CD ve on-call olgunluğum var mı?" Hayır ise monolit. Üçünde de mikroservise kayıyorsanız mikroservis kullanın.

Kararı hızlandıran pratik ölçütler:

1. **En basit çözümden başlayın.** Neredeyse her başarılı sistem monolit olarak başladı. Karmaşıklığı ancak ölçülebilir bir sancı (yayın tıkanması, ekip çakışması) belirdiğinde ekleyin.
2. **Ekip sayısını sınır alın.** Conway yasası gereği mimariniz organizasyonunuzu yansıtır. Tek ekipseniz tek servis mantıklıdır; servis sayısını ekip sayısına yaklaştırın.
3. **Modüler monolitle yola çıkın.** Sınırları önce kod içinde keşfedin. [Spring Modulith 2.0](https://spring.io/projects/spring-modulith) (Kasım 2025 GA, Spring Boot 4 üzerine) gibi araçlar modül sınırlarını ArchUnit ile derleme anında zorunlu kılar—yani gerektiğinde bir modülü servise ayırmak kolaylaşır.
4. **Ölçekleme gerçekten asimetrikse bölün.** Tüm uygulama aynı yükle büyüyorsa bölmenin ölçekleme faydası yoktur; sadece maliyet katar.
5. **Operasyon olgunluğunu dürüstçe değerlendirin.** Dağıtık izleme, otomatik deploy ve on-call kültürünüz yoksa mikroservis borç yığar, çözmez.

Açık fikrim: 2026'da mikroservise "modern olduğu için" geçmek para yakmaktır. Servis mesh benimseme oranı bile Q3 2023'teki %18'den 2025 sonunda %8'e düştü. Olgun ekipler pragmatik davranıyor: iyi modülerleştirilmiş bir monolitle başlayıp, yalnızca gerçekten bağımsız ölçekleme gereken 2-5 "sıcak yolu" servise ayırıyorlar. Bu konu daha geniş bir bağlamın parçası—[yazılım tasarım kalıpları](/tr/posts/yazilim-tasarim-kaliplari) ve [sistem tasarımı mülakatı](/tr/posts/sistem-tasarimi-mulakati) yazılarımız temiz sınır kurmayı derinleştiriyor. Konunun bütününe [Yazılım Mühendisliği kategorimizden](/tr/category/yazilim-muhendisligi) ulaşabilirsiniz.

## Sıkça Sorulan Sorular

### Mikroservis mi monolit mi, hangisiyle başlamalıyım?

Neredeyse her zaman monolitle. Erken evrede sınırların nerede olacağını bilemezsiniz ve mikroservisin altyapı yükü küçük ekipleri yavaşlatır. İyi modülerleştirilmiş bir monolit kurun; gerçek bir sancı (yayın tıkanması, asimetrik ölçekleme) belirdiğinde tek tek servis çıkarın.

### Monolit her zaman kötü müdür?

Hayır, bu yaygın bir yanılgı. Monolit "spagetti kod" demek değildir. İç modül sınırları temiz olan bir modüler monolit, çoğu ürün için mikroservisten daha hızlı, daha ucuz ve daha güvenilirdir. Shopify ve GitHub gibi büyük ürünler hâlâ büyük ölçüde monolit üzerinde çalışır.

### Mikroservise geçmenin en büyük gizli maliyeti nedir?

Operasyon yükü. Ağ hataları, dağıtık izleme, servis başına CI/CD, dağıtık veri tutarlılığı ve on-call karmaşası kodun kendisinden daha pahalıya gelir. DORA verilerine göre mikroservis ekiplerinin çoğu servisleri yine de birlikte deploy ediyor—yani maksimum karmaşıklık, minimum fayda.

### İkisini birlikte kullanabilir miyim?

Evet, en yaygın olgun yaklaşım budur. Çekirdek mantığı bir modüler monolitte tutar, yalnızca gerçekten bağımsız ölçekleme gerektiren parçaları (örneğin medya işleme, bildirim) ayrı servise çıkarırsınız. Böylece monolitin sadeliğini korur, mikroservisin esnekliğini yalnızca ihtiyaç olan yerde alırsınız.
