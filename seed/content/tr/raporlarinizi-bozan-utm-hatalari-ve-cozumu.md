---
title: "Raporlarınızı Bozan UTM Hataları ve Çözümü"
slug: "raporlarinizi-bozan-utm-hatalari-ve-cozumu"
translationKey: "utm-campaign-naming-system"
locale: "tr"
excerpt: "Kısa cevap: GA4'te utm_source=Email ile utm_source=email iki farklı değerdir; tutarsız büyük-küçük harf kullanımı bir kanalı üçe bölüp raporunuzu yanıltır."
category: "digital-marketing"
tags: ["marketing-analytics", "best-practices", "paid-advertising"]
publishedAt: "2026-10-27"
seoTitle: "Raporları Bozan UTM Hataları ve Adlandırma Sistemi"
seoDescription: "GA4'te büyük-küçük harf hassasiyetinin, parametre karışıklığının ve UTM yönetişimi eksikliğinin raporları nasıl böldüğünü ve bunu düzelten sistemi inceliyoruz."
---

Kısa cevap: Google Analytics 4, UTM parametre değerlerini büyük-küçük harf duyarlı okuyor — yani `utm_source=email`, `utm_source=Email` ve `utm_source=EMAIL` üç farklı kaynak olarak kaydediliyor ve tek bir kanalın performansı raporda üçe bölünmüş hâlde görünüyor. Bunun çözümü, her zaman küçük harf kullanan ve kontrollü bir kelime listesine dayanan, belgelenmiş bir UTM standardı.

## UTM parametreleri neden raporu sessizce bozuyor?

Google'ın kendi yardım sayfası, `utm_source=google` ile `utm_source=Google`'ı örnek olarak iki ayrı değer gösteriyor; bu, bir yazım hatası değil, GA4'ün tasarımı. Bir pazarlama ekibinde üç kişi aynı e-posta kampanyasına link eklerken biri `Email`, biri `email`, biri de `E-Mail` yazarsa, GA4 bunları üç farklı kaynak olarak kaydeder ve kanal gruplandırması bu üç parçayı birleştirmeyi reddeder. Sonuç: raporda "Email" kanalının performansı gerçekte olduğundan çok daha düşük görünür, çünkü trafiğin üçte biri başka bir satırda gizlenmiştir.

Parametre adının kendisi de büyük-küçük harf ve yazım hassasiyetine tabi: `utm-source` (tire ile) veya `UTM_Source` (büyük harfle) GA4 tarafından tanınmaz, parametre tamamen görmezden gelinir ve o trafik "(not set)" olarak işaretlenir. Bu, bir yazım hatasının tek bir satırı değil, o linke tıklayan herkesin kaynağını kaybetmesine yol açar.

## Beş UTM parametresi ne zaman önemli?

GA4 dokümantasyonu `utm_source`, `utm_medium` ve `utm_campaign`'i her zaman kullanılması gereken üç parametre olarak tanımlıyor; diğer altısı (`utm_term`, `utm_content` gibi) isteğe bağlı ve daha ayrıntılı segmentasyon için kullanılıyor. `utm_medium` özellikle kritik, çünkü GA4'ün varsayılan kanal gruplandırması büyük ölçüde bu alana dayanıyor: `utm_medium=email` her zaman "Email" kanalına, `utm_medium=cpc` her zaman "Paid Search" kanalına eşleniyor. Bu alanda bir büyük-küçük harf tutarsızlığı, sadece kampanya raporunu değil, en üst seviye kanal raporunu da bozuyor.

| Parametre | Zorunlu mu | Ne için kullanılır |
|---|---|---|
| `utm_source` | Evet | Trafiğin geldiği platform (örn. `google`, `newsletter`) |
| `utm_medium` | Evet | Pazarlama ortamı (örn. `email`, `cpc`, `social`) — kanal gruplandırmasını belirler |
| `utm_campaign` | Evet | Belirli kampanya adı (örn. `kasim-indirim-2026`) |
| `utm_term` | Hayır | Ücretli arama anahtar kelimesi |
| `utm_content` | Hayır | Aynı linkteki farklı reklam öğesi veya CTA ayrımı |

## Kontrollü kelime listesi (controlled vocabulary) nedir ve nasıl kurulur?

Kontrollü kelime listesi, her parametre için kullanılabilecek değerlerin sabit, önceden onaylanmış bir listesidir — örneğin `utm_medium` için sadece `email`, `cpc`, `social`, `display`, `referral`, `organic` değerlerine izin verip başka hiçbir varyasyona (ör. `e-mail`, `paid-social`) izin vermemek. Bu listeyi bir paylaşılan tabloda tutun ve her yeni kampanya linki oluşturulmadan önce bu tablodan değer seçilmesini zorunlu kılın; serbest metin girişi, er ya da geç tutarsızlık üretir.

```text
utm_source kontrollü liste: google, newsletter, linkedin, twitter, partner-x
utm_medium kontrollü liste: cpc, email, social, display, referral, affiliate
utm_campaign formatı: {yil}-{ay}-{kampanya-adi} (örn. 2026-11-blackfriday)
```

## Paylaşılan bir link oluşturucu ve kayıt tablosu neden gerekli?

Her pazarlamacının kendi linkini elle yazması, er ya da geç bir yazım hatası veya büyük harf tutarsızlığı üretir. Bunun yerine, kontrollü kelime listesini açılır menü olarak sunan basit bir UTM oluşturucu aracı (bir form veya basit bir tablo şablonu) kullanın ve her oluşturulan linki, kim oluşturduğu ve hangi kampanyaya ait olduğu bilgisiyle birlikte merkezi bir kayıt tablosuna ekleyin. Bu kayıt, altı ay sonra "bu linki kim oluşturmuştu" sorusuna cevap bulmanızı sağlayan tek kaynak hâline gelir.

## UTM kurallarının sahibi kim olmalı, yeni değerler nasıl eklenir?

Bir kişi veya küçük bir ekip (genelde pazarlama operasyonları veya analitik sorumlusu) kontrollü kelime listesinin tek sahibi olmalı; yeni bir kaynak veya kampanya türü eklenmesi gerektiğinde bu talep o kişiye gider, o kişi listeyi günceller ve ekibe bildirir. Herkesin kendi değerini eklemesine izin vermek, kontrollü listenin amacını tamamen ortadan kaldırır — bu tam olarak önlemeye çalıştığınız dağınıklığı yeniden üretir.

## Google Ads'in otomatik etiketlemesi kendi UTM'lerimle çakışır mı?

Çakışabilir ve bu, en sık görülen UTM hatalarından biri: Google Ads, bağlı bir GA4 hesabında varsayılan olarak kendi otomatik etiketlemesini (`gclid` parametresi üzerinden) kullanıyor, bu da trafiği otomatik olarak "Paid Search" / "google / cpc" olarak sınıflandırıyor. Bir reklamcı bu linke elle `utm_source` ve `utm_medium` ekleyirse, GA4 hangi sinyali önceliklendireceği konusunda tutarsız davranabiliyor ve bazı kampanyalar yanlış kanala düşebiliyor. Pratik kural: Google Ads bağlantısı aktifse otomatik etiketlemeye güvenin ve `utm_campaign` gibi ek bir bağlam gerekmediği sürece Google Ads linklerine elle UTM eklemeyin; elle eklemeniz gereken tek durum, otomatik etiketlemenin yakalayamadığı bir ayrımı (örneğin aynı reklam grubundaki iki farklı reklam öğesini `utm_content` ile ayırmak) izlemeniz gerektiğinde ortaya çıkıyor.

Bu çakışma, sosyal medya reklamlarında da benzer şekilde yaşanıyor: platformun kendi link izleme parametreleri (örneğin bir reklam platformunun otomatik eklediği kendi tıklama kimliği) ile elle eklenen UTM'ler aynı linkte bulunduğunda, hangi parametrenin GA4'te önceliklendirildiğini test etmeden varsaymamak gerekiyor. Yeni bir reklam kanalına UTM eklemeden önce, küçük bir test bütçesiyle linkleri gönderip GA4'te gerçek kaynak/ortam değerinin beklediğiniz gibi göründüğünü doğrulamak, kampanyanın tamamını yanlış etiketlemekten çok daha ucuz.

## Kayıt sırasında otomatik küçük harfe çevirme neden işe yarıyor?

Link oluşturma sürecine, UTM parametre değerlerini otomatik olarak küçük harfe çeviren bir adım eklemek, insan hatasını sistemden tamamen çıkarır. Bu, bir form doğrulama kuralı, bir Google Apps Script veya bir link kısaltma aracının ön işleme adımı olarak uygulanabilir; önemli olan, değerin GA4'e ulaşmadan önce standart hâle gelmesi. [UTM'leri Claude ile oluşturduğunuz açılış sayfası varyantlarına](/tr/posts/claude-ile-ab-testi-icin-acilis-sayfasi-varyantlari) eklerken de aynı otomatik küçük harfe çevirme adımını uygulamak, test raporlarının da bölünmesini önler.

## Geçmişteki dağınık veriyi kaybetmeden nasıl temizlerim?

GA4'te geçmiş ham veriyi geriye dönük olarak düzeltemezsiniz, ama BigQuery'ye aktarılmış ham veri üzerinde bir eşleme tablosu (`Email` → `email`, `E-Mail` → `email`) kullanarak raporlama katmanında (Looker Studio veya özel bir dashboard'da) bu değerleri birleştirebilirsiniz. Ham GA4 arayüzünde bu birleştirme mümkün değil çünkü değerler zaten ayrı boyutlar olarak kaydedilmiş durumda — bu yüzden BigQuery dışa aktarımı olmayan hesaplar için geçmiş veri kalıcı olarak parçalı kalır ve asıl kazanç bugünden sonraki veriyi temiz tutmaktan gelir.

Benim gözlemim: ekiplerin çoğu UTM yönetişimini "sonra hallederiz" diye erteliyor, ama veri bir kez üç parçaya bölündüğünde geriye dönük düzeltme, ileriye dönük standardı uygulamaktan çok daha maliyetli. En ucuz an, ilk linki oluşturmadan önceki an.

## Sıkça Sorulan Sorular

### GA4'te UTM parametre değerleri büyük-küçük harfe duyarlı mı?

Evet. Google'ın kendi dokümantasyonu `utm_source=google` ile `utm_source=Google`'ı iki farklı değer olarak örnekliyor. Bu, bir hata değil GA4'ün tasarım kararı; tutarsız kullanım tek bir kanalı birden fazla satıra böler.

### Hangi UTM parametrelerini her zaman kullanmalıyım?

Google, `utm_source`, `utm_medium` ve `utm_campaign`'i her zaman kullanılması gereken üç parametre olarak tanımlıyor. `utm_term` ve `utm_content` gibi diğer altısı isteğe bağlı ve daha ayrıntılı segmentasyon içindir.

### utm_medium alanı neden özellikle kritik?

Çünkü GA4'ün varsayılan kanal gruplandırması büyük ölçüde bu alana dayanıyor — `utm_medium=email` her zaman Email kanalına, `cpc` her zaman Paid Search kanalına eşleniyor. Bu alandaki bir büyük-küçük harf hatası en üst seviye kanal raporunu da bozar.

### Geçmiş UTM verisindeki tutarsızlığı nasıl düzeltebilirim?

GA4 arayüzünde geçmiş ham veriyi geriye dönük birleştiremezsiniz. BigQuery'ye aktarılmış veri üzerinde bir eşleme tablosuyla raporlama katmanında birleştirme yapabilirsiniz; BigQuery aktarımı yoksa geçmiş veri kalıcı olarak parçalı kalır.
