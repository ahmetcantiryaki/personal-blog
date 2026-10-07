---
title: "Hücre Tabanlı Mimari: Patlama Yarıçapını Nasıl Küçültür?"
slug: "hucre-tabanli-mimari-patlama-yaricapi"
translationKey: "cell-based-architecture-2026"
locale: "tr"
excerpt: "Kısa cevap: Hücre tabanlı mimari, müşterileri izole, bağımsız kopyalara (hücrelere) bölerek bir arızanın etkisini tüm sisteme değil tek bir hücreye hapseder."
category: "devops-cloud"
tags: ["system-design", "reliability", "cloud", "aws"]
publishedAt: "2026-10-07"
seoTitle: "Hücre Tabanlı Mimari Nedir? Patlama Yarıçapı Rehberi"
seoDescription: "Hücre tabanlı mimari, müşterileri izole hücrelere bölerek arıza etkisini sınırlar. Ne zaman gerekir, maliyeti ve shuffle sharding ile ilişkisi nedir?"
---

Kısa cevap: Hücre tabanlı mimari, tüm müşteri kitlesini tek bir sistemde çalıştırmak yerine, her biri müşterilerin bir dilimine hizmet veren izole, bağımsız kopyalara (hücrelere) bölüyor. Bir hücre çökerse, sadece o hücredeki müşteriler etkileniyor; diğer hücreler fark etmeden çalışmaya devam ediyor.

## Hücre Tabanlı Mimaride "Hücre" Tam Olarak Nedir?

Bir hücreyi hücre yapan iki şey var: izolasyon ve bölünmüş durum (partitioned state). Her hücre, diğer hücrelere hiçbir çalışma zamanı bağımlılığı olmadan bağımsız çalışıyor ve sahip olduğu veri başka hiçbir hücrede tekrarlanmıyor. İnce bir yönlendirme katmanı (routing layer), tüm hücrelerin varlığını bilen tek bileşen; müşteriler (veya trafikleri) tam olarak bir hücreye atanıyor ve orada kalıyor.

Bu, mikroservis mimarisinden farklı bir bölünme ekseni. Mikroservisler işlevi (ödeme servisi, bildirim servisi) böler; hücreler ise aynı işlevin tam kopyasını müşteri diliminde böler. Bir hücre, tipik olarak uygulamanın tüm katmanlarını (API, işçi süreçleri, veritabanı) kendi içinde barındırıyor.

## Hücreler Patlama Yarıçapını Nasıl Sınırlıyor?

Patlama yarıçapı, bir sistem arızası sırasında maruz kalınabilecek maksimum etki olarak tanımlanıyor. AWS Well-Architected Framework'ün REL10-BP03 pratiği, bu etkiyi sınırlamak için "bulkhead" (gemi bölmesi) mimarilerinin kullanılmasını öneriyor — hücre tabanlı mimari de bu pratiğin somut bir uygulaması. Küçük hücreler, her biri daha az müşteri taşıdığı için patlama yarıçapını küçültüyor: 100 hücreye bölünmüş bir sistemde bir hücrenin çökmesi, kullanıcı tabanının yalnızca yaklaşık %1'ini etkiliyor; tek, bölünmemiş bir sistemde aynı arıza herkesi etkiliyor.

Bunun arkasındaki mantık basit: korelasyonlu arızayı önlemek. Tek bir paylaşımlı veritabanı bağlantı havuzu tükendiğinde ya da bir deployment hatalı çıktığında, bölünmemiş bir sistemde bu hemen tüm kullanıcılara yayılıyor. Hücre tabanlı bir sistemde aynı hata, önce tek bir hücrede ortaya çıkıyor ve diğer hücrelere sıçramadan sınırlı kalıyor.

## Müşterileri Hücrelere Yönlendirme ve Shuffle Sharding Nasıl Çalışır?

Basit hücre bölünmesi bile blast radius'u küçültüyor, ama shuffle sharding bunu bir adım öteye taşıyor: her müşteriye (veya isteğe) hücrelerin yaklaşık benzersiz bir kombinasyonunu atayarak, iki müşterinin tamamen aynı hücre setini paylaşma olasılığını, hücre havuzu büyüdükçe hızla düşürüyor. Pratikte bu, bir hücrenin arızasının etkilediği müşteri kümesinin, basit modulo yönlendirmeye göre çok daha küçük ve çok daha az tahmin edilebilir olması demek.

| Yaklaşım | Bir hücre çöktüğünde etkilenen müşteri payı | Uygulama karmaşıklığı |
| --- | --- | --- |
| Bölünmemiş tek sistem | %100 | Düşük |
| Basit hücre bölünmesi (10 hücre) | ~%10 | Orta |
| Hücre + shuffle sharding | Hücre sayısıyla ters orantılı, çok daha düşük | Yüksek |

```text
Basit yönlendirme kararı:
- Müşteri ID'si → hash fonksiyonu → hücre numarası
- Hücre numarası sabit kalmalı (bir müşteri hücre değiştirmemeli)
- Yönlendirme katmanı, hücrelerin kendisinden tamamen ayrı ve stateless olmalı
```

## Hücre Tabanlı Mimarinin Maliyeti ve Ödünleşimleri Ne?

Her hücre kendi veritabanını, kendi işçi havuzunu ve kendi izleme altyapısını taşıdığından, hücre sayısı arttıkça sabit maliyetler de çoğalıyor — tek paylaşımlı bir sistemde bu kaynaklar bir kez provision edilirken, hücre tabanlı sistemde her hücre için ayrı ayrı provision ediliyor. Deployment da karmaşıklaşıyor: yeni bir sürümü tüm hücrelere aynı anda mı, yoksa kademeli olarak mı (canary benzeri) yayacağınıza karar vermeniz gerekiyor. [Blue-green ile canary deployment karşılaştırmamızda](/tr/posts/blue-green-mi-canary-mi) ele aldığımız kademeli yayma mantığı, hücre tabanlı sistemlerde hücre-hücre bazında tekrar uygulanıyor.

Veri bölümleme de ayrı bir zorluk: bir müşterinin verisi bir hücreye bağlandığında, o müşteriyi başka bir hücreye taşımak (yeniden dengeleme için) basit bir işlem değil. Bu yüzden hücre tabanlı mimariye geçmeden önce, hücreler arası veri taşıma senaryosunu baştan tasarlamanız gerekiyor.

## Küçük Bir Ekip Hücre Tabanlı Mimariyi Ne Zaman Benimsemeli?

Küçük bir ekip için cevap genelde "henüz değil." Hücre tabanlı mimari, tek bir arızanın tüm kullanıcı tabanını vurduğu, gerçek bir olay geçmişiniz olduğunda ve bu olayların maliyeti (itibar, SLA cezası, gelir kaybı) hücre işletme maliyetini haklı çıkardığında mantıklı hale geliyor. Birkaç bin kullanıcılık bir SaaS ürünü için muhtemelen [chaos engineering rehberimizde](/tr/posts/kucuk-ekipler-icin-chaos-engineering) önerdiğimiz gibi, önce mevcut tek sistemde arıza senaryolarını test etmek ve gerçek zayıf noktaları bulmak, doğrudan hücrelere bölünmeye gitmekten daha ucuz bir başlangıç.

Hücreler, genellikle on binlerce-yüz binlerce aktif kullanıcıya ulaşan, çoklu kiracılı (multi-tenant) ve tek bir büyük olayın marka güvenini kalıcı olarak zedeleyebileceği sistemlerde anlamlı hale geliyor. O noktaya gelmeden hücrelere bölünmek, çözülmemiş bir sorun için gereksiz operasyonel yük almak anlamına geliyor.

Bence buradaki en büyük yanılgı, hücre tabanlı mimariyi "daha iyi mimari" olarak görmek. Değil — sadece belirli bir risk profiline karşı bilinçli bir ödünleşim. Riskiniz o profile uymuyorsa, karmaşıklığı almanıza değmiyor.

## Hücre Sayısını Nasıl Belirlersiniz?

Hücre sayısı için tek bir "doğru" rakam yok, ama iki uç arasında bir denge aranıyor. Çok az hücre (örneğin 2-3), patlama yarıçapını yeterince küçültmüyor — bir hücrenin çökmesi hâlâ kullanıcı tabanının büyük bir payını etkiliyor. Çok fazla hücre ise her birinin sabit işletme maliyetini (veritabanı, izleme, operasyonel yük) orantısız şekilde çoğaltıyor ve yönetim karmaşıklığını artırıyor. Pratikte çoğu ekip, 8-20 hücre aralığında başlıyor ve büyüme ile gerçek olay verisine göre bu sayıyı kademeli artırıyor.

Hücre başına kapasite planlaması da ayrı bir karar. Her hücrenin, beklenen en yoğun trafik anında bile rahat çalışacak kapasitede provision edilmesi gerekiyor; aksi halde bir hücrenin aşırı yüklenmesi, izole olması gereken arızayı o hücre içinde yine de tetikleyebiliyor. [Kaos mühendisliği rehberimizde](/tr/posts/kucuk-ekipler-icin-chaos-engineering) önerdiğimiz yük testi pratiği, burada hücre başına kapasiteyi doğrulamak için birebir uygulanabiliyor.

## Hücreler Arası Trafik Sızıntısını Nasıl Önlersiniz?

Hücre tabanlı mimarinin en kırılgan noktası, "paylaşılan" bileşenler. Kimlik doğrulama servisi, merkezi bir mesaj kuyruğu ya da ortak bir DNS kaydı gibi bileşenler tüm hücreler arasında paylaşılıyorsa, bu bileşenlerin kendisi gizli bir tek hata noktası (single point of failure) haline geliyor — ve hücrelere bölünmenin tüm amacını baltalıyor. Gerçek bir hücre tabanlı tasarımda, kimlik doğrulama dahil mümkün olan her bileşenin kendi hücre içinde kopyalanması gerekiyor; yalnızca yönlendirme katmanı ve DNS gibi gerçekten paylaşılması gereken, minimal ve son derece sağlam bileşenler merkezi kalmalı.

Bu ayrımı net tutmanın pratik testi şu: "bu bileşen çökerse kaç hücre etkilenir" sorusunu her bileşen için sorun. Cevap "tek hücre" değilse, o bileşen hücre tabanlı tasarımın izolasyon vaadini zayıflatıyor demektir.

## Sıkça Sorulan Sorular

### Hücre tabanlı mimari mikroservislerden farkı nedir?

Mikroservisler sistemi işlevine göre böler (ödeme, bildirim gibi ayrı servisler); hücre tabanlı mimari ise aynı işlevin tam kopyasını müşteri diliminde böler. İkisi birbirinin alternatifi değil, çoğu zaman birlikte kullanılıyor — her hücre kendi içinde mikroservislerden oluşabiliyor.

### Shuffle sharding hücre tabanlı mimariye ne ekliyor?

Shuffle sharding, her müşteriye hücrelerin yaklaşık benzersiz bir kombinasyonunu atayarak iki müşterinin tamamen aynı hücre setini paylaşma olasılığını düşürüyor. Bu, basit hücre bölünmesine göre bir hücrenin arızasından etkilenen müşteri sayısını daha da azaltıyor.

### Hücre tabanlı mimari her sistem için gerekli mi?

Hayır. Küçük ölçekli, tek bir arızanın kabul edilebilir maliyetle sınırlı kaldığı sistemlerde hücrelere bölünmenin operasyonel maliyeti (çoğaltılmış altyapı, karmaşık deployment) genellikle getirdiği faydayı aşıyor. Hücreler, geniş kullanıcı tabanlı ve yüksek kesinti maliyetli sistemlerde anlamlı.

### Hücre tabanlı mimariye geçerken en büyük risk ne?

Veri bölümleme kararı. Bir müşterinin verisi bir hücreye bağlandıktan sonra o müşteriyi başka bir hücreye taşımak karmaşık bir işlem; bu yüzden hücreler arası veri taşıma senaryosunu mimariyi kurmadan önce tasarlamak gerekiyor.
