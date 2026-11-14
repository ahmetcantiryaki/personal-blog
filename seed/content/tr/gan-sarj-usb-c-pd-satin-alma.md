---
title: "GaN Şarj Cihazı ve USB-C PD: Nasıl Akıllı Alınır?"
slug: "gan-sarj-usb-c-pd-satin-alma"
translationKey: "gan-chargers-usb-c-pd-buy-smarter"
locale: "tr"
excerpt: "Kısa cevap: GaN çipli, PD 100W+ ve PPS destekli, 5A e-marker kablolu bir model alın; telefon, tablet ve laptopu tek şarj cihazıyla sorunsuz şarj eder."
category: "technology"
tags: ["hardware", "connectivity", "smartphones", "best-practices"]
publishedAt: "2026-11-14"
seoTitle: "GaN Şarj ve USB-C PD Rehberi: Doğru Modeli Seçin"
seoDescription: "GaN şarj cihazı, USB-C PD ve PPS nedir? Watt, kablo amper değeri ve USB-IF sertifikasyonuna göre telefon, tablet ve laptop için doğru şarj cihazını seçin."
---

Kısa cevap: GaN (galyum nitrit) çipli, en az 65W PD çıkışı veren, PPS destekleyen ve 5A amper değerli e-marker'lı bir kabloyla satılan bir model alın. Bu kombinasyon tek bir şarj cihazıyla telefonu, tableti ve çoğu ince laptopu güvenli ve hızlı şarj eder; aksi hâlde cihazlarınız sessizce standart hızda şarj olur ve bunu fark etmezsiniz.

## GaN şarj cihazı nedir, neden küçük ve serin kalır?

GaN (galyum nitrit), silikon yerine kullanılan bir yarı iletken malzemedir ve aynı watt değerinde geleneksel silikon şarj cihazlarından daha az ısı kaybeder. Daha az ısı kaybı, daha küçük bir soğutma gövdesi ve daha küçük bir kasa demektir; bu yüzden 65-100W'lık bir GaN adaptör, eski 65W'lık silikon bir laptop şarj cihazından genellikle yarı yarıya daha küçük görünür. Isı kaybındaki bu fark aynı zamanda GaN cihazların uzun süreli yüksek watt'ta çalışırken termal olarak kısılma (throttling) ihtimalini de düşürür.

## USB-C Power Delivery (PD) nedir?

USB-C Power Delivery (PD), bir cihaz ile şarj cihazının hangi voltaj ve amperde anlaşacağını belirleyen USB-IF standardıdır. Standart güç aralığı (SPR) 5V-20V arasında 100W'a kadar çıkar; genişletilmiş güç aralığı (EPR) ise 28V-48V arasında 240W'a kadar güç taşıyabilir, ama bunun için hem şarj cihazının hem kablonun EPR'yi desteklemesi gerekir. Cihazınız ile şarj cihazı bu protokol üzerinden saniyeler içinde "pazarlık" yapar; sonuç, cihazın güvenle kabul edebileceği en yüksek watt değeridir.

## PPS nedir, PD'den farkı ne?

PPS (Programmable Power Supply), PD 3.0 ile gelen ve voltajı 20mV, akımı 50mA gibi çok küçük adımlarla ayarlayabilen bir PD uzantısıdır; standart PD'nin sabit voltaj basamaklarına (5V/9V/15V/20V gibi) karşı PPS 3,3V-21V arasında sürekli ayar yapabilir. Bu ince ayar, telefonun pilini daha az ısıtarak daha hızlı şarj etmesini sağlar; Samsung'un "Süper Hızlı Şarj" ve birçok Android üreticisinin kendi hızlı şarj modları aslında PPS'in üstüne kurulu. PPS, standart güç aralığında 5A ve 100W ile sınırlıdır.

## Telefonunuz, tabletiniz ve laptopınız hangi standardı kullanıyor?

Cihazınızın kutusundaki veya üreticinin teknik sayfasındaki şarj watt değerine bakın; "20W hızlı şarj" yazıyorsa PD'dir, "45W Süper Hızlı Şarj" gibi marka adı geçiyorsa büyük olasılıkla PPS'tir. iPhone'lar PD ve PPS'in bir karışımını kullanır, çoğu Android telefon PPS gerektirir, M-serisi MacBook'lar ise 65-140W arasında standart PD kullanır. Bir şarj cihazı PPS desteklemiyorsa, PPS gerektiren telefonunuz yine şarj olur ama daha düşük, sabit bir PD basamağında.

## Kaç watt yeterli?

Aşağıdaki tablo, yaygın cihaz kategorileri için gerçekçi watt aralıklarını gösterir; bir cihazı bu aralığın altında şarj etmek yalnızca hızı düşürür, üstünde bir watt değeri seçmek ise fazladan bir maliyettir çünkü cihaz kendi üst sınırının üzerini kullanmaz.

| Cihaz | Tipik watt aralığı | Not |
|---|---|---|
| Akıllı telefon | 20-45W | PPS desteksiz şarj cihazı hızı düşürür |
| Tablet | 20-45W | iPad Pro modelleri 45W'a kadar çeker |
| İnce laptop (13-14") | 65-100W | M-serisi MacBook Air/Pro burada |
| Performans laptop (15-16"+) | 100-140W | Bazı oyun laptopları 240W EPR gerektirir |

Kasım 2026 itibarıyla piyasadaki çoğu "evrensel" GaN şarj cihazı 65W veya 100W'ta duruyor; 140W ve üzeri modeller ağırlıklı olarak güçlü laptoplar için pazarlanıyor.

## Hangi kabloyu almalısınız? 3A mi 5A mi?

E-marker çipi olmayan standart bir USB-C kablo akımı 3A ile sınırlar; bu, 20V'ta yaklaşık 60W tavan demektir, şarj cihazınız 100W olsa bile. 5A akım taşıyabilen ve 100W'ın üzerindeki güç seviyelerini açan kablolarda bir e-marker çipi bulunur; bu çip olmadan kablo, USB-IF'e göre 100W (5A) veya EPR uyumlu olarak tanımlanamaz ve sistem akımı otomatik olarak 3A'a düşürür. Kutuda gelen kabloyu değiştirdiyseniz ve şarj aniden yavaşladıysa, neredeyse her zaman sebep budur.

USB-IF sertifikalı bir kablo seçmek bu riski ortadan kaldırır, çünkü sertifika programı e-marker çipinin doğru watt değerini doğru şekilde bildirdiğini test eder. [USB.org'un resmi PD kaynağına](https://www.usb.org/usb-charger-pd) göre sertifikasız kablolar, özellikle ucuz çok portlu setlerde, bildirdiklerinden daha düşük bir amper değerinde çalışabiliyor. Kabloyu değiştirip hız düştüğünde ilk kontrol edilmesi gereken yer kablonun fişine yakın bir noktada basılı watt ve amper bilgisidir; bu bilgi yoksa kabloyu güvenilmez kabul edin.

## Çok portlu şarj cihazı alırken neye dikkat etmeli?

Çok portlu bir GaN şarj cihazındaki watt değeri, genellikle tüm portlar arasında paylaşılan toplam güçtür, port başına değil. 100W'lık 3 portlu bir şarj cihazına üç cihaz taktığınızda, her biri 33W değil, cihazın dahili güç dağıtım mantığına göre değişen bir pay alır; [Tom's Hardware'in şarj cihazı testlerine](https://www.tomshardware.com/peripherals/usb/best-usb-chargers) göre birçok model, ikinci bir cihaz takıldığında ilk porttaki gücü belirgin şekilde düşürüyor. Laptopunuzu ve telefonunuzu aynı anda hızlı şarj etmek istiyorsanız, laptopun ihtiyacından (örneğin 65W) belirgin şekilde yüksek toplam watt'lı bir model seçin.

## Seyahat için hangi şarj cihazı mantıklı?

Seyahat için tek, 65-100W aralığında GaN'lı, en az iki USB-C portlu bir model, ayrı ayrı şarj cihazları taşımaktan daha pratik; ama bu modeli her zaman USB-IF sertifikalı bir 5A kabloyla eşleştirin, aksi hâlde bagajınızdaki en pahalı parça olan şarj cihazı, en ucuz parça olan kablo yüzünden standart hızda çalışır. [Laptop seçerken gereken teknik özellikleri](/tr/posts/yerel-yapay-zeka-icin-laptop-alma-rehberi) incelediyseniz, aynı mantıkla laptopunuzun gerçek şarj watt değerini üreticinin sitesinden doğrulamak, şarj cihazı seçiminin ilk adımı olmalı.

Kişisel görüşüm şu: çoğu kullanıcı ihtiyacından fazla watt için para ödüyor. 240W EPR destekleyen bir şarj cihazı, 65W'lık bir MacBook Air için hiçbir fark yaratmaz; asıl parayı kabloya ve sertifikaya yatırmak, markalı ama düşük kaliteli bir "evrensel" şarj cihazına yatırmaktan daha değerli. [Katlanabilir telefonlar](/tr/posts/katlanabilir-telefonlar-2026-deger-mi) ve [iPhone 18 Pro ile Pixel 11'i](/tr/posts/iphone-18-pro-mu-pixel-11-mi-2026) karşılaştırdığımız yazılarda da gördüğümüz gibi, üreticiler artık kutudan şarj cihazı çıkarmıyor; bu da kablo ve adaptör seçimini ihmal edilemez bir satın alma kararı hâline getiriyor. Aynı dikkatin [akıllı yüzük](/tr/posts/en-iyi-akilli-yuzukler-2026-rehberi) ve [e-mürekkep tablet](/tr/posts/e-murekkep-tablet-ve-telefonlar-odaga-deger-mi) gibi daha küçük pilli cihazlarda da geçerli olduğunu, çünkü onların da genellikle düşük watt'lı ama hâlâ PD üzerinden şarj olan portları var. Daha fazla donanım rehberi için [Teknoloji kategorimize](/tr/category/teknoloji) göz atabilirsiniz.

## Sıkça Sorulan Sorular

### GaN şarj cihazı normal şarj cihazından daha mı hızlı?

Hayır, GaN kendisi hızı belirlemez; PD ve PPS protokolleri hızı belirler. GaN'ın katkısı, aynı watt değerini daha küçük ve daha serin bir kasada sunmasıdır, bu yüzden 100W'lık bir GaN adaptör 100W'lık bir silikon adaptörle aynı hızda şarj eder ama cebe daha kolay sığar.

### 65W şarj cihazı laptop için yeterli mi?

13-14 inçlik ince laptoplar, özellikle M-serisi MacBook Air ve Pro modelleri için 65W genellikle yeterlidir ve kutudan gelen orijinal şarj cihazıyla aynı hızı verir. 15-16 inç ve üzeri performans laptopları için ise 100W veya üzeri gerekir, aksi hâlde laptop kullanımdayken şarj hızı tüketimin altında kalabilir.

### USB-C kablomun 5A desteklediğini nasıl anlarım?

Kablonun kutusunda veya üzerinde "100W", "5A" ya da "E-marker" ifadesi var mı kontrol edin; USB-IF sertifikalı kablolarda ayrıca resmi sertifikasyon logosu bulunur. Bu bilgi yoksa, kablo büyük olasılıkla 3A ile sınırlıdır ve 60W'ın üzerindeki şarj hızlarını açamaz.

### PPS desteklemeyen bir şarj cihazı telefonumu zarar görecek şekilde mi şarj eder?

Hayır, PPS desteği olmadan telefon zarar görmez; sadece standart PD'nin sabit voltaj basamaklarından birinde, PPS'in sunduğu ince ayarlı hızdan daha yavaş şarj olur. Güvenlik, şarj cihazının USB-IF sertifikalı olmasına bağlıdır, PPS desteğine değil.
