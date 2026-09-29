---
title: "Akıllı Ev Kurulumunda Gizlilik Kontrol Listesi"
slug: "akilli-ev-gizlilik-kontrol-listesi"
translationKey: "secure-smart-home-privacy-2026"
locale: "tr"
excerpt: "Kısa cevap: IoT cihazlarını ayrı ağa al, kullanmadığın mikrofon ve kamerayı kapat, Matter 2.0'ın yerel kontrolünü tercih et, passkey kullan, satıcıyı araştır."
category: "technology"
tags: [smart-home, privacy, passkeys, hardware]
publishedAt: "2026-09-29"
seoTitle: "Akıllı Ev Gizlilik Kontrol Listesi 2026"
seoDescription: "Kısa cevap: IoT cihazlarını ayrı ağa al, kullanmadığın sensörü kapat, Matter 2.0 yerel kontrolünü tercih et, passkey kullan. 2026 için tam kontrol listesi."
---

Kısa cevap: Her akıllı cihazı kendi ağ segmentine al, aktif kullanmadığın mikrofon ve kameraları kapat, Matter 2.0 altında veriyi yerelde işleyen cihazları tercih et, satıcı hesaplarını şifre yerine passkey ile koru ve bir satıcının gizlilik geçmişini satın almadan önce kontrol et — sonra değil.

## Akıllı ev gizliliği için neden şimdi kontrol listesi gerekiyor?

Çoğu akıllı ev cihazının varsayılan ayarları sizi değil satıcıyı kolluyor: sesli asistanlar sesi varsayılan olarak buluta gönderiyor, kameralar çoğu kullanıcının fark ettiğinden daha uzun süre görüntü saklıyor ve kurulum sırasında yardımcı uygulamalar geniş veri paylaşım izinleri istiyor. Bu teorik bir risk değil — FTC, Ocak 2025'te bir kamera üreticisine, kendi belirttiği silme süresinden daha uzun görüntü sakladığı için işlem yaptı; İrlanda Veri Koruma Komisyonu ise Temmuz 2025'te başka bir akıllı ev üreticisine veri işleme uygulamaları yüzünden 47 milyon avro ceza kesti.

2026'da bahis daha yüksek çünkü daha fazla cihaz artık ajan gibi davranıyor: sesli komut beklemek yerine bazı akıllı ev sistemleri artık proaktif hareket ediyor — malzeme yeniden sipariş ediyor, program ayarlıyor veya gözlemlediği örüntülere göre anormallik bildiriyor. Kendi kararını veren bir cihaz, iyi karar vermek için daha fazla veriye ihtiyaç duyuyor; bu da evinizin rutininin daha büyük bir kısmının bir yerde veri noktasına dönüşmesi demek.

## Matter 2.0 ile gerçekte ne değişti?

2026 başında onaylanan Matter 2.0, farklı markaların cihazlarının her satıcının kendi bulutundan geçmek yerine paylaşılan bir yerel protokol üzerinden birbiriyle konuşmasını sağlayan birlikte çalışabilirlik standardı. Eylül 2026 itibarıyla Connectivity Standards Alliance, 794 üye şirketten 10.400'den fazla sertifikalı Matter ürünü olduğunu bildiriyor.

Gizlilikle ilgili kısım mimari: Matter cihazları, yerel şifreli bir mesh ağı olan Thread üzerinden haberleşiyor ve rutin komutların — bir ışığı açmak, bir kilidin durumunu kontrol etmek gibi — giderek artan bir kısmı ev ağınızdan hiç çıkmıyor. Bu, önceki nesil akıllı ev cihazlarına göre gerçek bir iyileşme; o cihazlarda neredeyse her eylem, ne kadar önemsiz olursa olsun, satıcının bulut sunucusuna bir gidiş-dönüş tetikliyordu. Bu, tam yerel işlemenin garantisi değil — sesli asistanlar ve AI destekli özellikler genellikle hâlâ bulut hesaplamaya ihtiyaç duyuyor — ama bulut gerektiren etkileşim sayısını azaltıyor.

## 10 maddelik akıllı ev gizlilik kontrol listesi

| # | Eylem | Neden önemli |
|---|---|---|
| 1 | IoT cihazlarını ayrı bir VLAN veya misafir ağına al | Ele geçirilmiş bir cihazın ana ağınızda ulaşabileceklerini sınırlar |
| 2 | Günlük kullanmadığın mikrofon/kamerayı fiziksel olarak kapat | Varsayılan olarak sürekli dinleyen yüzeyleri ortadan kaldırır |
| 3 | Yerel (Thread) kontrol destekleyen Matter 2.0 cihazları tercih et | Rutin komutları satıcının bulut sunucusundan uzak tutar |
| 4 | Kurulum sırasında ve sonrasında veri paylaşım anahtarlarını gözden geçir | Çoğu uygulama en geniş paylaşım seçeneğini varsayılan yapar |
| 5 | Satıcı hesaplarını şifre yerine passkey ile koru | Kimlik avı ve şifre tekrar kullanımı riskini tamamen ortadan kaldırır |
| 6 | Otomatik ürün yazılımı güncellemelerini aç | Bilinen zafiyetleri manuel takip gerektirmeden kapatır |
| 7 | Satıcının beyan ettiği veri saklama süresini kontrol et | Bazı satıcılar görüntü veya sesi gerekenden çok daha uzun saklıyor |
| 8 | Gizlilik politikasındaki üçüncü taraf veri paylaşımı maddesini oku | Verinizin reklamverenlere veya veri komisyoncularına ulaşıp ulaşmadığını gösterir |
| 9 | Zorunlu olmayan "ürünü geliştir" veya telemetri seçeneklerini kapat | İşlevsel olarak gerekli olmayan veri toplamayı keser |
| 10 | Satın almadan önce satıcının regülasyon ve ihlal geçmişini araştır | Geçmiş FTC işlemleri veya cezalar, verinizin gelecekte nasıl işleneceğinin göstergesidir |

## Ne almalı, nelerden kaçınmalı?

Matter sertifikalı ve temel işlevi için yerel (Thread veya Zigbee) kontrolü destekleyen cihazlar alın; böylece satıcının bulut hizmeti çökse veya politikasını değiştirse bile cihaz çalışmaya — ve gizli kalmaya — devam eder. [Matter'ın birlikte çalışabilirlik modeli](/tr/posts/akilli-ev-2026-matter-ve-cihaz-uyumu), tek bir şirketin ekosistemine kilitlenmediğiniz anlamına da geliyor; bu, donanımı satın aldıktan sonra bir satıcının gizlilik uygulamaları değişirse önem kazanıyor.

Temel işlevi yerel yedeği olmayan bir bulut hesabı gerektiren cihazlardan, özellikle de kamu önünde bir veri saklama politikası olmayan satıcıların kamera ve mikrofonlarından kaçının. Ürün sayfası görüntü veya sesin ne kadar süre saklandığını belirtmiyorsa, bunu bir gözden kaçırma değil bir uyarı işareti olarak değerlendirin.

## Passkeyler akıllı ev güvenliği için gerçekten önemli mi?

Evet — sadece şifreyle korunan bir akıllı ev hesabı, o hesaba bağlı her cihaz için tek bir başarısızlık noktası demek. Passkeyler şifreyi, cihazınıza bağlı kriptografik bir anahtar çiftiyle değiştiriyor; bu, bir şifre gibi kimlik avına uğratılamıyor veya bir veri ihlalinde tekrar kullanılamıyor. [Şifresiz hayata geçiş rehberimiz](/tr/posts/sifresiz-hayat-passkey-2026) ve [günlük passkey kullanım rehberimiz](/tr/posts/passkey-gecis-rehberi), çoğu insanın zaten kullandığı hesap ve uygulamalarda kurulumu anlatıyor — aynı adımlar bir akıllı ev satıcısının uygulaması veya web panosu için de geçerli.

## Kolaylık mı gizlilik mi: gerçek bir ödünleşim mi?

Gerçek bir ödünleşim, ama satıcıların ima ettiğinden daha dar bir ödünleşim. "Herkes çıkınca ışıkları kapat" komutunu anlayan bir sesli asistan, çalışmak için gerçekten bir miktar bulunma verisine ihtiyaç duyuyor. Ama bu verinin süresiz saklanmasına, reklamverenlerle paylaşılmasına veya izniniz olmadan bir modeli eğitmek için kullanılmasına ihtiyacı yok — bunlar teknik zorunluluk değil, iş kararları. Yukarıdaki kontrol listesi tam olarak bu farkı hedefliyor: cihazın çalışması için gereken veriyi tut, sadece yapabildiği için topladığı fazlalığı kes.

Bize göre akıllı ev sektörünün varsayılan duruşu hâlâ "geniş topla, sonra af dile" — Matter 2.0'ın yerel öncelikli mimarisi doğru yönde bir itiş olsa bile. Her varsayılan ayarı sizin değil satıcının tercihi olarak görün ve kurulum sırasında değiştirin; on cihazı denetlemek için sonradan geri dönmek kimsenin gerçekten yapmadığı bir angarya.

## Sıkça Sorulan Sorular

### Akıllı ev cihazları için ayrı bir ağ nasıl kurulur?

Kısa cevap: çoğu modern router, yönetici ayarlarında misafir ağı veya VLAN özelliği sunuyor — bunu etkinleştirin, yalnızca IoT cihazlarını o ağa bağlayın, bilgisayar ve telefonlarınızı ana ağda tutun. Bu, ele geçirilmiş bir akıllı priz veya kameranın diğer cihazlarınıza ulaşmasını engeller.

### Matter 2.0, verimin tamamen yerelde kaldığı anlamına mı geliyor?

Kısa cevap: hayır. Matter 2.0, birçok rutin cihazdan cihaza komutu Thread üzerinden yerel ağınızda tutuyor, ama sesli asistanlar ve AI destekli özellikler genellikle hâlâ bulut sunucusuna veri gönderiyor. "Matter sertifikalı" ifadesini "tamamen yerel" ile eş tutmak yerine her cihazın kendi işleme iddiasını kontrol edin.

### Akıllı ev uygulamaları için passkey kurmak zor mu?

Kısa cevap: hayır — çoğu passkey kurulumu uygulama başına bir dakikadan az sürüyor ve telefonunuzun mevcut parmak izi veya yüz tanıma özelliğini kullanıyor. Etkinleştirdikten sonra şifre yazmak yerine onaylamak için dokunuyorsunuz; saldırganın çalabileceği veya tahmin edebileceği bir şifre kalmıyor.

### Hangi akıllı ev üreticilerinin gizlilik geçmişi en iyi?

Kısa cevap: tek bir "güvenli" liste yok, çünkü uygulamalar değişiyor — satın almadan önce her satıcının güncel gizlilik politikasını, veri saklama süresini ve regülasyon geçmişini (FTC anlaşmaları, GDPR cezaları) kontrol edin; büyük ürün yazılımı güncellemelerinden sonra da tekrar kontrol edin, çünkü varsayılanlar sessizce değişebiliyor.

**Kaynaklar:** [Connectivity Standards Alliance (Matter)](https://csa-iot.org/), [Smart Home Compared: gizlilik ve yerel kontrol](https://smarthomecompared.com/use-cases/privacy-local-control), [FIDO Alliance passkey sayfası](https://fidoalliance.org/passkeys/).
