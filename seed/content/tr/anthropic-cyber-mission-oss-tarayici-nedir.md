---
title: "Anthropic Cyber Mission: Ücretsiz OSS Tarayıcı Ne Yapıyor?"
slug: "anthropic-cyber-mission-oss-tarayici-nedir"
translationKey: "anthropic-cyber-mission-oss-scanner-2026"
locale: "tr"
excerpt: "Kısa cevap: Cyber Mission, Claude'u 11 şirketle elektrik şebekelerini korumaya, açık kaynak projelerine ise ücretsiz bir açık bulma servisi sunmaya koşuyor."
category: "software-engineering"
tags: ["claude", "open-source", "web-security", "best-practices"]
publishedAt: "2026-10-12"
seoTitle: "Anthropic Cyber Mission: Ücretsiz OSS Tarayıcı Rehberi"
seoDescription: "Anthropic'in 8 Ekim 2026'da başlattığı Cyber Mission, kritik altyapı programı ve ücretsiz OSS Tarayıcı'dan oluşuyor. İşte ne yaptığı ve kimin kullanabileceği."
---

Kısa cevap: Cyber Mission, Anthropic'in 8 Ekim 2026'da başlattığı iki parçalı güvenlik girişimi. Birinci parça, Kritik Altyapı Savunma Programı (CIDP); 11 güvenlik şirketi üzerinden elektrik şebekesi, su sistemi ve ulaşım operatörlerine en güçlü Claude modellerini ulaştırıyor. İkinci parça ise OSS Tarayıcı: açık kaynak bakımcılarına kanıt niteliğinde bir açıklıkla birlikte önerilen düzeltmeyi ücretsiz gönderen bir tarama servisi.

## Anthropic Cyber Mission nedir?

Yama yapılması zor altyapılara ve gönüllülerin bakımını üstlendiği yazılımlara odaklanan, 8 Ekim 2026'da duyurulan uzun soluklu bir güvenlik programı. Birinci parça olan Kritik Altyapı Savunma Programı, santral veya su şebekesi işletmecisiyle doğrudan değil, onların zaten çalıştığı güvenlik sağlayıcıları üzerinden ilerliyor; Anthropic bu sağlayıcılara en üst düzey Claude erişimi, sahada çalışan mühendisler ve kendi tehdit araştırmasını veriyor. İkinci parça OSS Tarayıcı ise açık kaynak projeleri için ücretsiz bir açıklık tarama servisi.

Buradaki çerçeveleme önemli: Anthropic hiçbir parçanın altyapıyı veya açık kaynak kodunu saldırıya karşı bağışık kılacağını iddia etmiyor. Bahis şu: üretken modeller yabancı bir kod tabanını hızla okuyabildiğinden beri büyüyen saldırgan-savunmacı açığını, savunmacılara da aynı model gücünü vererek kapatmaya çalışıyor.

## Ücretsiz OSS Tarayıcı tam olarak ne yapıyor?

Kayıt olmuş bir açık kaynak deposunu tarıyor ve bakımcıya açıklığı, onu tetikleyen bir kanıt-konsepti ve önerilen bir düzeltmeyi içeren bir rapor gönderiyor; bu rapor Anthropic'in en güçlü modellerinden biri tarafından üretiliyor ve bakımcının gelen kutusuna ulaşmadan önce herhangi bir insan incelemesinden geçmiyor. Anthropic'in kendi tahmini, tarayıcının gerçek-pozitif oranının %90'ın üzerinde olduğunu söylüyor; bu, şirketin yayınladığı ama henüz bağımsız olarak denetlenmemiş bir rakam, dolayısıyla kesin bir ölçüt değil, satıcı iddiası olarak okunmalı.

İnsan incelemesinin olmaması aynı zamanda riskli nokta. Bazı raporlar yanlış önem derecesi taşıyabilir veya sadece bakımcının bildiği bir bağlamı kaçırabilir; bu yüzden Anthropic servis için sorumluluğunu 1.000 dolarla sınırlıyor — tarayıcıyı bir "ikinci görüş" değil de gerçek bir güvenlik süreci olarak kullanmadan önce bilinmesi gereken bir rakam. Uygun projelerin bakımcıları Anthropic'in güvenlik portalından kayıt olabiliyor; servisin kendisi ücretsiz.

## 11 kurucu ortak kim, ne yapıyor?

Kritik Altyapı Savunma Programı; Accenture, Booz Allen, CrowdStrike, Deloitte, Dragos, Hitachi, Insane Cyber, Nozomi Networks, Palo Alto Networks, PwC ve Rockwell Automation'ı kurucu ortak olarak duyurdu. Bunlar, elektrik şebekesi, su sistemi ve ulaşım ağı işletmecilerinin güvenlik hizmeti için zaten çalıştığı şirketler — Anthropic en üst düzey model erişimini, işletmelere doğrudan yeni bir yapay zeka tedarikçisiyle anlaşma yaptırmak yerine bu mevcut ilişki üzerinden yönlendiriyor.

| Cyber Mission parçası | Kime yönelik | Ne alıyorsunuz | Maliyet |
|---|---|---|---|
| Kritik Altyapı Savunma Programı | Elektrik, su, ulaşım, kamu sistemi işletmecileri (bir ortak üzerinden) | En üst düzey Claude erişimi, sahada Anthropic mühendisi, paylaşılan tehdit araştırması | Ortak sözleşmeleri üzerinden, kamuya açık fiyat yok |
| OSS Tarayıcı | Kayıtlı açık kaynak projelerinin bakımcıları | Kanıt ve önerilen düzeltme içeren otomatik açıklık raporu | Ücretsiz |

## Neden şimdi — bu hangi sorunu çözüyor?

Anthropic'in kendi değerlendirmesine göre, önceki güvenlik girişimi Project Glasswing birçok açıklık buldu ama siber riski anlamlı ölçüde düşürmedi; çünkü yetenekli bir modelle açıklık bulmak işin kolay kısmı çıktı. Hangi bulguların gerçekten önemli olduğunu belirlemek, bunları gerçek sömürülebilirliğe göre sıralamak ve düzeltmeleri fiilen yayına almak yavaş ve büyük ölçüde manuel kaldı. Cyber Mission aynı soruna ikinci bir deneme: OSS Tarayıcı her raporla birlikte bir düzeltme önerisi göndererek triyaj açığını küçültmeye çalışıyor, CIDP ise kronik olarak az kadrolu savunmacılara sadece model çıktısı değil, mühendislik kapasitesi de ekliyor.

Bu açık aynı zamanda [AI çöpünün açık kaynak güvenliğini zorlamasının](/tr/posts/ai-copu-acik-kaynak-guvenligi) nedeni: düşük kaliteli, yapay zeka üretimi pull request'ler ve açıklık raporları zaten bakımcıların gelen kutusunu dolduruyor; insan incelemesi olmadan doğrudan ileten bir tarayıcı, yalnızca sinyal-gürültü oranı ölçekte tutarsa işe yarar. Projeler kayıt oldukça izlenmesi gereken rakam, o %90 üzeri gerçek-pozitif iddiası.

```text
Tipik bir OSS Tarayıcı raporunun yapısı:
  - Açıklık sınıfı ve etkilenen dosya/fonksiyon
  - Kanıt-konsepti tetikleyici (açıklığı yeniden üreten girdi veya adım)
  - Önerilen düzeltme (diff veya yama taslağı)
  - Güven/önem tahmini (denetlenmemiş, hatalı olabilir)
  - Teslimden önce insan incelemesi yok
```

## Cyber Verification Program'dan farkı ne?

Farklı: ikisi farklı sorunları çözüyor. 6 Ekim 2026'da genişletilen [Anthropic'in Cyber Verification Program'ı](/tr/posts/anthropic-cyber-verification-program-nedir), yetkilendirilmiş testler sırasında Claude'un daha çok saldırgan bir araç gibi davranmasına ihtiyaç duyan doğrulanmış güvenlik uzmanları için kullanım sınırlarını gevşetiyor. İki gün sonra duyurulan Cyber Mission ise savunma tarafı altyapısı: doğrulanmış bir kullanıcı için Claude'un ne yapacağını değiştirmiyor, bir tarama servisi ve ortak ağı ekliyor. Bir güvenlik araştırmacısı ikisini birden kullanabilir — yetkilendirilmiş bir sızma testi için doğrulama, neyi test edeceğine dair bilgi için ise Cyber Mission'ın tehdit araştırması.

Bu girişim, Anthropic'in Claude seviyesindeki modellerin saldırganlar tarafından nasıl kullanıldığına dair [2026 tehdit istihbaratı raporunun](/tr/posts/anthropicin-2026-tehdit-raporunda-neler-var) yanında duruyor; bu bağlam, Cyber Mission'ın savunma çerçevesini pazarlamadan çok, belgelenmiş kötüye kullanıma doğrudan bir yanıt gibi okutuyor.

## Açık kaynak projeniz OSS Tarayıcı'ya kayıt olmalı mı?

Gerçek kullanıcısı olan ama güvenlik raporlarını kendi başına triyaj edecek zamanı sınırlı bir proje yürütüyorsanız kayıt olun — şu an sıfır güvenlik taraması alan bir proje için, kusurlu da olsa ücretsiz bir otomatik ilk geçiş, hiç taramadan daha iyidir. Bunu [SBOM ve SLSA seviyesinde tedarik zinciri uygulamalarının](/tr/posts/yazilim-tedarik-zinciri-guvenligi) yerine koymayın: OSS Tarayıcı kodunuzdaki açıklıkları buluyor, derleme kökeninizi veya bağımlılık zincirinizi doğrulamıyor. Önerilen bir düzeltmeyi birleştirmeden önce her raporu okuyun — 1.000 dolarlık sorumluluk sınırı, Anthropic'in kendisinin "son inceleme sizsiniz" sinyali.

Kayıt sürecinin kendisi de dikkat edilmeye değer: Anthropic, güvenlik portalı üzerinden "uygun proje" tanımını net bir şekilde yayınlamadı, bu yüzden küçük veya niş bir kütüphane bakımcısıysanız kaydınızın kabul edilip edilmeyeceğini önceden bilemezsiniz. Buna rağmen maliyetsiz olması, denemenin önünde bir engel bırakmıyor — reddedilseniz bile kaybınız sadece bir kayıt formu dolduracak kadar zaman. Bakımcı ekibi küçük olan projeler için bu özellikle değerli, çünkü bu ekiplerde güvenlik taraması genellikle hiç yapılmıyor, yama yönetimi için ayrılmış zaman da yok; ücretsiz bir ilk geçiş, sıfırdan hiçbir şeye göre açıkça ve net bir şekilde daha büyük bir kazanç.

Kişisel yorumum: bu duyurunun en dürüst kısmı 1.000 dolarlık sınır. Anthropic'in incelenmemiş model çıktısının gelen kutunuza ulaşmasına ne kadar güvendiğini tam olarak gösteriyor — sıfır değil, ama "oku bile, düzeltmeyi direkt yayına al" da değil.

## Sıkça Sorulan Sorular

### Anthropic Cyber Mission nedir?

Anthropic'in 8 Ekim 2026'da başlattığı, iki parçalı bir güvenlik girişimi: elektrik, su ve ulaşım güvenlik şirketlerine en üst düzey Claude erişimi ve sahada mühendis sağlayan Kritik Altyapı Savunma Programı, ve açık kaynak bakımcılarına otomatik açıklık raporu gönderen ücretsiz OSS Tarayıcı.

### OSS Tarayıcı gerçekten ücretsiz mi?

Evet. Kayıtlı açık kaynak projeleri ücretsiz taranıyor ve bakımcılar kanıt ve önerilen düzeltme içeren bir açıklık raporu alıyor. Anthropic servis için kendi sorumluluğunu 1.000 dolarla sınırlıyor; bu da raporların kör kör birleştirilmemesi, incelenmesi gerektiğinin işareti.

### OSS Tarayıcı'nın açıklık raporları ne kadar doğru?

Anthropic %90'ın üzerinde bir gerçek-pozitif oranı iddia ediyor ama bu rakam bağımsız denetlenmiş bir ölçüt değil, şirketin kendi tahmini. Raporlar bakımcılara insan incelemesi olmadan ulaşıyor, dolayısıyla bazıları yanlış önem derecesi taşıyabilir veya projeye özgü bağlamı kaçırabilir.

### Kritik Altyapı Savunma Programı'nın ortakları kim?

On bir kurucu ortak: Accenture, Booz Allen, CrowdStrike, Deloitte, Dragos, Hitachi, Insane Cyber, Nozomi Networks, Palo Alto Networks, PwC ve Rockwell Automation — elektrik, su ve ulaşım işletmecilerine zaten hizmet veren güvenlik şirketleri.
