---
title: "Soğuk E-postanız Neden Spam'e Düşüyor?"
slug: "soguk-eposta-neden-spam"
translationKey: "cold-email-deliverability-2026"
locale: "tr"
excerpt: "Kısa cevap: büyük olasılıkla SPF, DKIM, DMARC'tan biri hizalı değil ya da şikayet oranınız %0,3 eşiğinin üstünde. İkisi de teknik kontrol listesiyle çözülüyor."
category: "digital-marketing"
tags: ["email-marketing", "best-practices", "marketing-analytics"]
publishedAt: "2026-10-23"
seoTitle: "Soğuk E-posta Neden Spam'e Düşer? 2026 Çözüm Listesi"
seoDescription: "SPF, DKIM, DMARC hizalaması, tek tıkla abonelikten çıkma ve şikayet oranı eşikleri: soğuk e-postanızın spam'e düşme nedenleri ve düzeltme listesi."
---

Kısa cevap: soğuk e-postanız büyük olasılıkla iki nedenden spam'e düşüyor — ya SPF, DKIM veya DMARC kayıtlarınızdan biri hizalı değil, ya da spam şikayet oranınız Gmail'in kabul ettiği %0,3 eşiğinin üstünde. İkisi de davranışsal bir değişiklik değil, teknik bir kontrol listesiyle düzeltiliyor.

## SPF, DKIM, DMARC nedir ve neden gerekli?

Bu üç kayıt, bir e-postanın gerçekten sizin alan adınızdan gönderildiğini alıcı sunucuya kanıtlıyor. SPF, hangi sunucuların alan adınız adına e-posta gönderebileceğini listeliyor; DKIM, e-postaya sahteciliğe karşı dijital bir imza ekliyor; DMARC ise SPF ve DKIM'in ikisi de uyumlu (aligned) geçtiğinde ne yapılacağını belirliyor. Günde 5.000'den fazla e-posta gönderen hesaplar için [Google'ın bulk-sender kuralları](https://support.google.com/mail/answer/81126) net: SPF ve DKIM'in ikisi de geçmeli ve DMARC kaydınız en az `p=none` seviyesinde yayınlanmış olmalı. Bu üçü eksikse, e-postanız gelen kutusuna değil doğrudan spam klasörüne ya da hiç ulaşmayan bir sunucuya gidiyor. Bu kural sadece büyük pazarlama listeleri için değil; 5.000 eşiğinin altında kalan küçük bir soğuk e-posta kampanyası da aynı kontrollerden geçmezse spam klasörüne düşme riskini taşıyor, çünkü Gmail'in filtreleme algoritması hacimden bağımsız olarak bu üç sinyale bakıyor.

```text
; Örnek DMARC DNS kaydı (p=none, izleme amaçlı minimum seviye)
_dmarc.siteniz.com.  TXT  "v=DMARC1; p=none; rua=mailto:dmarc-raporlari@siteniz.com"
```

## Tek tıkla abonelikten çıkma zorunlu mu?

Evet, pazarlama e-postaları için zorunlu; işlemsel e-postalar (sipariş onayı gibi) muaf. [RFC 8058](https://www.rfc-editor.org/rfc/rfc8058) standardına dayanan tek tıkla abonelikten çıkma, e-postanın başlığına (header) gömülü bir bağlantı gerektiriyor — alıcının e-postanın içeriğini açmasına bile gerek kalmadan çalışan bir mekanizma. Gönderenlerin abonelikten çıkma taleplerini yaklaşık iki gün içinde işleme koyması bekleniyor; bu süreyi uzatmak, şikayet oranınızı dolaylı olarak yükseltiyor çünkü kullanıcı çıkış bağlantısı yerine "spam olarak işaretle" düğmesine basıyor. Soğuk e-postada bu özellikle kritik, çünkü alıcı sizi daha önce hiç duymamış — abonelikten çıkış linki görünür ve kolay değilse, tepkisi genelde çıkış değil doğrudan şikayet oluyor.

## Spam şikayet oranı ne kadar olmalı?

Gmail'in resmi eşiği %0,3; yani gönderdiğiniz her 1.000 e-postadan 3'ten fazlası "spam" olarak işaretlenirse hesabınız bulk-sender kısıtlamalarına giriyor. Ancak deliverability uzmanları bu eşiği güvenli kabul etmiyor — pratik hedef %0,1, bazı kaynaklar %0,08'i "güvenli hat" olarak öneriyor. Bu fark önemli: eşiğin tam sınırında kalmak, Gmail'in algoritması değiştiğinde sizi aniden kısıtlama bölgesine itebiliyor.

| Metrik | Gmail eşiği | Güvenli hedef |
| --- | --- | --- |
| Şikayet oranı | %0,3 (üstü kısıtlanır) | %0,1 (bazı kaynaklara göre %0,08) |
| SPF + DKIM | İkisi de geçmeli | İkisi de geçmeli |
| DMARC kaydı | En az `p=none` | `p=quarantine` veya `p=reject` (daha güçlü) |
| Tek tıkla çıkış | Zorunlu (pazarlama e-postası) | Talep sonrası ~2 gün içinde işlenmeli |

## Domain warmup nasıl yapılır?

Yeni bir alan adından veya yeni bir gönderim IP'sinden e-posta göndermeye başlıyorsanız, ilk günden 5.000 e-posta göndermek şikayet oranınızı neredeyse garanti şekilde yükseltiyor. Warmup'ın pratik yolu: ilk hafta günde 20-50 e-postayla başlamak, yanıt oranı ve şikayet oranı stabil kaldığı sürece hacmi her 3-4 günde kabaca ikiye katlamak, 4-6 hafta içinde hedef hacme ulaşmak. Bu süreci [AI destekli e-posta pazarlama iş akışınızla](/tr/posts/ai-ile-e-posta-pazarlama-is-akisi) birleştirirken dikkat edilmesi gereken nokta, otomasyonun warmup hızını atlamaması — model, hacmi sizin yerinize artırmaz, siz kademeyi elle kontrol etmelisiniz.

## Liste hijyeni neden tek başına yetmiyor?

Doğrulanmış, aktif e-posta adreslerinden oluşan bir liste göndermek şikayet oranını düşürür ama SPF/DKIM/DMARC hizalaması yoksa yine de spam'e düşebilirsiniz — liste kalitesi ve kimlik doğrulama, birbirinin yerine geçmeyen iki ayrı katman. [E-posta pazarlamada teslim edilebilirlik kontrol listemizde](/tr/posts/e-posta-pazarlamada-teslim-edilebilirlik) bu iki katmanı birlikte ele alan daha geniş bir checklist var; soğuk e-posta özelinde ek olarak dikkat edilmesi gereken, alıcının sizi daha önce hiç duymamış olması — bu da açılma oranını metin kalitesine daha bağımlı hâle getiriyor. Metin tarafında yapay zekayla üretilen e-postaların alıcı tarafında nasıl okunduğu da ayrı bir konu; [e-postayı ilk okuyanın artık yapay zeka olabileceğini](/tr/posts/e-postayi-ilk-okuyan-yapay-zeka) ele aldığımız yazıda bahsettiğimiz gibi, bazı kurumsal alıcılarda e-postanızı önce bir AI asistanı tarıyor ve bu, konu satırı ile ilk paragrafın önemini daha da artırıyor.

## Gönderim hacmi nasıl artırılmalı?

Hacmi artırırken takip edilecek tek gösterge şikayet oranı değil; açılma oranındaki ani düşüş de bir uyarı sinyali. Açılma oranı bir haftada 3 puandan fazla düşerse, hacmi artırmayı durdurup önceki haftanın listesini ve metnini gözden geçirmek, kör kör ilerlemekten daha güvenli. Bazı deliverability sağlayıcıları, Kasım 2025'ten sonra Gmail'in kurallara uymayan postayı erteleme (defer) yerine doğrudan reddettiğini (550 hata kodu) bildiriyor; bu iddiayı Google'ın kendi dokümanında doğrulayamadık, ama pratik sonuç aynı: eşiğin altında kalmak artık daha önce olduğundan daha az tolerans kaldırıyor.

## E-posta sağlayıcısı (ESP) seçimi deliverability'yi değiştirir mi?

Evet, ama sınırlı şekilde. Kurumsal bir ESP (örneğin özel IP havuzu sunan bir sağlayıcı), paylaşılan bir IP'de başka bir gönderenin kötü itibarından etkilenme riskinizi azaltıyor; ama ESP seçimi, SPF/DKIM/DMARC hizalamasını veya şikayet oranı disiplinini sizin yerinize yapmıyor. Yanlış kurulmuş bir DNS kaydı, en pahalı ve en köklü ESP'de de aynı şekilde spam klasörüne düşmeye yol açıyor — ESP burada bir güvenlik ağı değil, sadece bir altyapı sağlayıcısı.

## Konu satırı ve gönderen adı ne kadar etkili?

Konu satırındaki "ücretsiz", "garantili" gibi klasik spam tetikleyici kelimeler artık filtrelerin tek başına baktığı bir sinyal değil — modern spam filtreleri bu kelimeleri DNS kimlik doğrulama ve şikayet oranıyla birlikte, bütünsel bir puanlama sisteminde değerlendiriyor. Yani tek bir "tetikleyici kelime" sizi spam'e düşürmüyor; ama hizalanmamış bir DMARC kaydıyla birleştiğinde, o kelime filtrenin genel puanını kötüleştiren ek bir faktöre dönüşüyor. Gönderen adının tutarlı ve tanınabilir olması (her seferinde aynı isim ve aynı alan adı), alıcının şikayet butonuna basma olasılığını da ölçülebilir şekilde düşürüyor.

Doğrusu, bu konudaki en yaygın yanlış inanış, deliverability sorununu bir "metin sorunu" gibi görmek. Metin kalitesi açılma oranını etkiler, evet; ama spam klasörüne düşme kararı büyük ölçüde DNS kayıtlarınızda ve şikayet oranınızda veriliyor — en iyi yazılmış soğuk e-posta da hizalanmamış bir DMARC kaydıyla gelen kutusuna asla ulaşmıyor.

## Sıkça Sorulan Sorular

### Soğuk e-postam neden spam klasörüne düşüyor?

En yaygın iki neden: SPF, DKIM veya DMARC kayıtlarınızdan birinin eksik veya hizalı olmaması, ya da spam şikayet oranınızın Gmail'in %0,3 eşiğinin üstünde kalması. İkisini de DNS kayıtlarınızı ve gönderim hacminizi kontrol ederek düzeltebilirsiniz.

### DMARC kaydı olmadan e-posta gönderebilir miyim?

Teknik olarak evet ama günde 5.000'den fazla e-posta gönderiyorsanız Gmail ve Yahoo bunu artık kabul etmiyor; en az `p=none` seviyesinde bir DMARC kaydı zorunlu hâle geldi. DMARC kaydı olmayan gönderenler bulk-sender kısıtlamalarına giriyor.

### Spam şikayet oranım kaç olmalı?

Gmail'in resmi eşiği %0,3 ama bu sınırda kalmak riskli; deliverability uzmanları %0,1'i, bazıları %0,08'i güvenli hedef olarak öneriyor. Eşiğe yakın seyretmek, küçük bir dalgalanmada bile hesabınızı kısıtlama bölgesine itebilir.

### Yeni bir alan adından soğuk e-posta göndermeye nasıl başlarım?

İlk hafta günde 20-50 e-postayla başlayıp, şikayet oranı ve yanıt oranı stabil kaldığı sürece hacmi her 3-4 günde kabaca ikiye katlayarak 4-6 hafta içinde hedef hacme ulaşmak güvenli bir warmup planı. İlk günden yüksek hacimle başlamak şikayet oranını hızla yükseltiyor.
