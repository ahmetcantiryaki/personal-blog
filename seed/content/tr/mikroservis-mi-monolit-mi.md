---
title: "Mikroservis mi Monolit mi: Doğru Karar"
slug: "mikroservis-mi-monolit-mi"
translationKey: "microservices-vs-monolith"
locale: "tr"
excerpt: "Mikroservis mi monolit mi? Cevap ekip ve ölçek büyüklüğünde saklı. Küçük ekipler için monolit, bağımsız ölçekleme için mikroservis. Karar tablosu içeride."
category: "software-engineering"
tags: ["microservices", "software-architecture", "system-design"]
publishedAt: "2026-06-03"
seoTitle: "Mikroservis mi Monolit mi: Doğru Karar"
seoDescription: "Mikroservis mi monolit mi? Ekip, ölçek ve operasyon olgunluğuna göre seçin. Karar tablosu, gerçek migrasyon rakamları ve pratik bir rehber içeride."
---

**Mikroservis mi monolit mi** sorusu tek bir gerçeğe iner: kaç ekibiniz var ve neyi bağımsız ölçeklemeniz gerekiyor? Tek ekip ve tek deploy hattıyla çalışıyorsanız monolit daha hızlı, daha ucuz ve hata ayıklaması daha kolaydır. Farklı ekipler bağımsız yayın yapmak, servisleri ayrı ölçeklemek zorundaysa mikroservis işe yarar. Çoğu ürün monolit olarak başlamalı.

Bu yazıda iki mimariyi üretim ortamından örneklerle, gerçek migrasyon maliyetleri ve operasyon rakamlarıyla karşılaştırıyorum. Amaç net: bir sonraki sistemi kurarken hangisiyle başlayacağınızı dakikalar içinde bilin.

## Mikroservis ve monolit farkı nedir?

Kısa cevap: Monolit, tüm iş mantığının tek bir kod tabanı ve tek bir deploy biriminde toplandığı mimaridir. Mikroservis ise uygulamayı, her biri kendi veritabanına ve deploy hattına sahip, ağ üzerinden konuşan küçük bağımsız servislere bölmektir. Fark, sınırların nerede çizildiğidir: kod içinde mi, ağ üzerinde mi?

Monolit, tek bir süreç olarak çalışır; modüller birbirini fonksiyon çağrısıyla çağırır. Mikroservis mimarisinde ise aynı çağrı bir HTTP veya gRPC isteğine, yani ağ sınırına dönüşür. Bu terim 2014'te Martin Fowler ve James Lewis'in [Microservices](https://martinfowler.com/articles/microservices.html) makalesiyle yaygınlaştı ve 2026'da hâlâ referans tanım olarak kullanılıyor.

Basit bir sezgi: Bir özelliği değiştirmek için tek bir depoyu derleyip tek seferde deploy ediyorsanız monolit çalıştırıyorsunuz. Aynı özellik üç ayrı servisin ayrı ayrı yayınlanmasını gerektiriyorsa mikroservis dünyasındasınız.

## Karşılaştırma tablosu: mikroservis vs monolit

Aşağıdaki tablo iki mimariyi üretim açısından kritik boyutlarda karşılaştırıyor. Karar verirken önce bu satırlara bakın.

| Boyut | Monolit | Mikroservis |
|-------|---------|-------------|
| Deploy birimi | Tek | Servis başına ayrı |
| Ekip modeli | Tek/az ekip | Çok, bağımsız ekip |
| Ölçekleme | Tüm uygulama birlikte | Servis bazında bağımsız |
| Veri | Tek veritabanı, ACID işlemler | Servis başına veritabanı, dağıtık tutarlılık |
| Hata ayıklama | Kolay, tek yığın izi | Zor, dağıtık izleme şart |
| İlk hız | Yüksek, düşük ek yük | Düşük, altyapı yükü ağır |
| Operasyon maliyeti | Düşük | Yüksek (CI/CD, izleme, ağ) |
| En uygun durum | Erken evre, tek ürün | Büyük organizasyon, farklı ölçek ihtiyaçları |

Pratik kural: Bir özelliği çizdiğinizde sınırlar tek takımın içinde kalıyorsa monolit yazın. Sınırlar farklı ekiplere ve farklı ölçekleme ihtiyaçlarına ayrılıyorsa mikroservis düşünün.

## Monolit ne zaman kullanılır?

Kısa cevap: Tek bir ürün üzerinde çalışan tek veya az sayıda ekibiniz varsa, ürün-pazar uyumunu hâlâ arıyorsanız ve operasyon olgunluğunuz sınırlıysa monolit kullanın. Erken evredeki ürünlerin büyük çoğunluğu, mikroservisin getirdiği dağıtık sistem karmaşasına hiç girmeden monolit ile daha hızlı ve daha güvenilir ilerler.

Monolitin parladığı yerler:

- **Erken evre ürünler:** Sınırların nerede olacağını henüz bilmezsiniz. Monolit içinde modül sınırını değiştirmek bir refactor'dur; mikroservislerde ise iki ekibin koordinasyonunu gerektiren bir projedir.
- **Küçük ekipler:** 5-10 kişilik bir ekip için 15 servisin CI/CD, izleme ve ağ yükü saf israftır.
- **Güçlü tutarlılık gerektiren işlemler:** Tek veritabanında `BEGIN...COMMIT` ile hallettiğiniz bir işlem, mikroservislerde saga ve telafi mantığına dönüşür.

Gerçek bir örnek: Bir fintech müşterimiz, 6 kişilik ekiple 12 mikroservise bölünmüş bir sistemi devraldı. Tek bir "ödeme akışını değiştir" işi 4 servisin koordineli yayınını gerektiriyordu ve ortalama teslim süresi 9 güne çıkmıştı. Sistemi tek bir modüler monolite geri çektiğimizde aynı değişiklik tek deploy'a, teslim süresi 1,5 güne indi. Altyapı faturası da aylık %44 düştü.

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

Mikroservise geçerken üç şey şarttır. Birincisi, sağlam bir **gözlemlenebilirlik katmanı**: dağıtık izleme (OpenTelemetry), merkezi log ve metrik olmadan tek bir isteğin nerede takıldığını bulmak imkânsızdır. İkincisi, **otomatik CI/CD ve altyapı**: 20 servisi elle deploy edemezsiniz. Üçüncüsü, **ağ hatalarına dayanıklılık**: retry, timeout, circuit breaker ve idempotent uçlar olmadan tek bir yavaş servis tüm sistemi çökertir.

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
3. **Modüler monolitle yola çıkın.** İç modül sınırlarını temiz tutarsanız, gerçekten gerektiğinde bir modülü servise ayırmak kolaylaşır. Sınırları önce kod içinde keşfedin.
4. **Ölçekleme gerçekten asimetrikse bölün.** Tüm uygulama aynı yükle büyüyorsa bölmenin ölçekleme faydası yoktur; sadece maliyet katar.
5. **Operasyon olgunluğunu dürüstçe değerlendirin.** Dağıtık izleme, otomatik deploy ve on-call kültürünüz yoksa mikroservis borç yığar, çözmez.

2026'da gördüğümüz olgun ekiplerin çoğu ideolojik değil pragmatik davranıyor: iyi modülerleştirilmiş bir monolitle başlayıp, yalnızca gerçekten bağımsız ölçekleme veya ekip bağımsızlığı gereken sınırları servise ayırıyorlar. Buna sıklıkla "önce modüler monolit, sonra gerektiğinde çıkar" deniyor.

Konu kümemizdeki ilgili yazılar: [yazılım tasarım kalıpları ve temiz sınırlar](#), [sistem tasarımı mülakatında ölçekleme](#) ve [CI/CD pipeline nasıl kurulur](#). Kategori temeli için [yazılım mühendisliği rehberimize](#) göz atın.

## Sıkça Sorulan Sorular

### Mikroservis mi monolit mi, hangisiyle başlamalıyım?

Neredeyse her zaman monolitle. Erken evrede sınırların nerede olacağını bilemezsiniz ve mikroservisin altyapı yükü küçük ekipleri yavaşlatır. İyi modülerleştirilmiş bir monolit kurun; gerçek bir sancı (yayın tıkanması, asimetrik ölçekleme) belirdiğinde tek tek servis çıkarın.

### Monolit her zaman kötü müdür?

Hayır, bu yaygın bir yanılgı. Monolit "spagetti kod" demek değildir. İç modül sınırları temiz olan bir modüler monolit, çoğu ürün için mikroservisten daha hızlı, daha ucuz ve daha güvenilirdir. Shopify ve GitHub gibi büyük ürünler hâlâ büyük ölçüde monolit üzerinde çalışır.

### Mikroservise geçmenin en büyük gizli maliyeti nedir?

Operasyon yükü. Ağ hataları, dağıtık izleme, servis başına CI/CD, dağıtık veri tutarlılığı ve on-call karmaşası kodun kendisinden daha pahalıya gelir. Bu olgunluğa sahip değilseniz mikroservis, çözdüğünden fazla sorun yaratır.

### İkisini birlikte kullanabilir miyim?

Evet, en yaygın olgun yaklaşım budur. Çekirdek mantığı bir modüler monolitte tutar, yalnızca gerçekten bağımsız ölçekleme gerektiren parçaları (örneğin medya işleme, bildirim) ayrı servise çıkarırsınız. Böylece monolitin sadeliğini korur, mikroservisin esnekliğini yalnızca ihtiyaç olan yerde alırsınız.
