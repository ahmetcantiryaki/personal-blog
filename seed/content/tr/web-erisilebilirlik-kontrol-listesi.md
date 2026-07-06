---
title: "Web Erişilebilirlik Kontrol Listesi (WCAG 2.2)"
slug: "web-erisilebilirlik-kontrol-listesi"
translationKey: "web-accessibility-checklist"
locale: "tr"
excerpt: "WCAG 2.2 için pratik web erişilebilirlik kontrol listesi: kontrast, klavye erişimi, odak, hedef boyutu ve formları test edip denetimde takılan sorunları düzeltin."
category: "web-development"
tags: ["accessibility", "frontend", "wcag", "web-standards"]
publishedAt: "2026-05-12"
seoTitle: "Web Erişilebilirlik Kontrol Listesi (WCAG 2.2)"
seoDescription: "WCAG 2.2 için pratik web erişilebilirlik kontrol listesi: kontrast, klavye, odak, hedef boyutu ve formları test edin, denetimde takılan sorunları düzeltin."
---

Bu web erişilebilirlik kontrol listesi, denetimlerde gerçekten takılan WCAG 2.2 AA seviyesi kriterlerini adım adım gezdirir: renk kontrastı, klavye erişimi, görünür odak, hedef boyutu ve erişilebilir formlar. Listeyi sırayla uygulayıp gerçek bir ekran okuyucu ve klavyeyle test ederseniz, 2026'da hem yasal uyum hem de gerçek kullanıcılar için en kritik kontrolleri geçersiniz.

Çoğu ekip egzotik kurallarda değil, birkaç temel maddede başarısız olur. Bu liste tam da o temelleri en başa alır.

## WCAG 2.2 nedir ve hangi seviyeyi hedeflemelisiniz?

WCAG 2.2, W3C'nin güncel Web İçeriği Erişilebilirlik Kılavuzu tavsiyesidir ve **5 Ekim 2023**'te yayımlanmıştır. WCAG 2.1'in üzerine dokuz yeni başarı kriteri ekler ve her şeyi dört ilke altında toplar: içerik **Algılanabilir, Kullanılabilir, Anlaşılabilir ve Sağlam** (POUR) olmalıdır. Çoğu yasanın atıf yaptığı standart olan **AA seviyesini** hedefleyin.

A seviyesi mutlak asgari, AA hem yasal hem pratik zemin, AAA ise belirli akışlar için ulaşılması istenen üst düzeydir. **28 Haziran 2025**'ten beri yürürlükte olan Avrupa Erişilebilirlik Yasası, AB'de satılan pek çok dijital ürün için AA'yı fiilen zorunlu kılıyor.

| Seviye | Kapsadığı alan | Kimin hedefi |
|--------|----------------|--------------|
| A | Kritik engeller (klavye, alt metin) | Mutlak asgari |
| AA | Kontrast, odak, hedef boyutu, formlar | Yasal zemin (ADA, EAA, EN 301 549) |
| AAA | İşaret dili, 7:1 kontrast | Yalnızca seçili kritik akışlar |

Bir güncellik notu: WCAG 2.2, modern tarayıcılar bozuk işaretlemeyi zaten sorunsuz işlediği için **4.1.1 (Ayrıştırma) kriterini kaldırdı**. Eski bir denetim şablonu bunu hâlâ listeliyorsa çıkarın.

## WCAG 2.2 erişilebilirlik kontrol listesi (adım adım)

Bu kontrolleri sırayla yapın. İlk adımlar en sık görülen hataları yakalar, böylece en büyük uyum kazancını en hızlı biçimde elde edersiniz:

1. **Renk kontrastını kontrol edin.** Metin en az **4,5:1** oranına ihtiyaç duyar (büyük metin için 3:1; 18px kalın ya da 24px normal). Arayüz bileşenleri ve grafikler **3:1** ister (SC 1.4.11).
2. **Anlamlı alt metin ekleyin.** Bilgi veren her `<img>` etiketine bir `alt` gerekir; dekoratif görseller `alt=""` alır ki ekran okuyucu atlasın (SC 1.1.1).
3. **Tam klavye erişimini test edin.** Sayfayı baştan sona Tab'layın. Her etkileşimli öğe fare olmadan erişilebilir ve kullanılabilir olmalı; klavye tuzağı bulunmamalı (SC 2.1.1, 2.1.2).
4. **Görünür odağı doğrulayın.** Odaklanan öğenin net bir göstergesi olmalı ve yapışkan başlık ya da çerez çubuğu arkasında gizlenmemeli (SC 2.4.7, 2.4.11 — 2.2'de yeni).
5. **Dokunma hedeflerini boyutlandırın.** Etkileşimli hedefler en az **24×24 CSS pikseli** olmalı ya da çevrelerinde yeterli boşluk bırakılmalı (SC 2.5.8 — 2.2'de yeni).
6. **Sürükleme alternatifi sunun.** Sürükleyerek yapılan her işlem tek dokunuş ya da tıklamayla da çalışmalı (SC 2.5.7 — 2.2'de yeni).
7. **Her form alanını etiketleyin.** Her girdiye bir `<label>` bağlayın, hataları metin olarak gösterin ve yalnızca placeholder metnine güvenmeyin (SC 1.3.1, 3.3.1, 3.3.2).
8. **Gerçek başlıklar ve landmark'larla yapılandırın.** `<h1>`–`<h6>` etiketlerini sırayla ve anlamsal landmark'ları (`<nav>`, `<main>`, `<footer>`) kullanın ki ekran okuyucu kullanıcıları gezebilsin (SC 1.3.1, 2.4.1).
9. **Sayfa dilini belirtin.** Yardımcı teknolojinin içeriği doğru seslendirmesi için `<html>` öğesine `lang` ekleyin (SC 3.1.1).
10. **Önce otomatik tarama, sonra manuel test yapın.** Araçlar sorunların yaklaşık üçte birini yakalar; gerisi ekran okuyuculu bir insan gerektirir.

## Renk kontrastını doğru şekilde nasıl test edersiniz?

Renk kontrastı, metin ile arka planı arasındaki parlaklık oranını ölçer. WCAG 2.2, normal metin için en az **4,5:1**, büyük metin ya da simge ve girdi kenarlığı gibi metin dışı arayüz öğeleri için **3:1** ister. En hızlı kontrol, oranı doğrudan renk seçicide gösteren Chrome DevTools'tur.

Otomatik araçların gözden kaçırdığı tuzaklara dikkat edin:

- **Görsel veya degrade üzerine metin.** Tarayıcı tek bir arka plan pikselini okur; oysa fotoğrafta çok sayıda renk vardır. Oranı her yerde garantilemek için düz bir katman ya da metin gölgesi ekleyin.
- **Pasif (disabled) durumlar.** Bunlar muaftır; ancak "pasif görünen" ama aslında tıklanabilir bir buton yine de geçmelidir.
- **Odak ve hover renkleri.** Odak göstergesinin kendisi, komşu renklere karşı 3:1 kontrasta sahip olmalıdır.

```css
/* Yapışkan başlıklara rağmen görünür kalan, yüksek kontrastlı odak halkası */
:focus-visible {
  outline: 3px solid #1a5fff;
  outline-offset: 2px;
}
```

Renk seçimlerinin okunabilirliği nasıl etkilediğine daha derin bakmak için [erişilebilir renk sistemleri rehberimize](/blog/accessible-color-systems) göz atın.

## WCAG 2.2'nin yeni başarı kriterleri neler?

WCAG 2.2 dokuz yeni kriter getirdi ve bunların altısı A veya AA seviyesinde geçerli; yani artık uyum zemininizin parçası. Öne çıkan değişiklikler klavye ve dokunma kullanıcılarını, ayrıca kimlik doğrulama ve tekrarlayan veri girişinde zorlanan kişileri hedefliyor.

Günlük frontend işini yeniden şekillendirenler:

- **Odak Gizlenmemeli (2.4.11, AA):** Odaklanan öğe yapışkan başlık, alt bilgi ya da yüzen bir bileşenle tamamen gizlenemez. Bu, aksi hâlde sorunsuz görünen pek çok siteyi bozar.
- **Sürükleme Hareketleri (2.5.7, AA):** Kaydırıcılar, sırası değiştirilebilen listeler ve harita etkileşimleri için dokun-seç ya da artı/eksi butonu gibi sürüklemesiz bir alternatif gerekir.
- **Asgari Hedef Boyutu (2.5.8, AA):** Küçük simge butonları ve sık dizilmiş bağlantılar 24×24px olmalı ya da aralarında boşluk bırakılmalı. Önce mobil menünüzü ve sayfalamayı denetleyin.
- **Erişilebilir Kimlik Doğrulama (3.3.8, AA):** Karakter kopyalama gibi bilişsel bir test dayatmayın. Parola yöneticisine, yapıştırmaya ve kopyalamaya izin verin; bulmaca tabanlı CAPTCHA'lardan kaçının.
- **Tekrarlı Giriş (3.3.7, A):** Kullanıcının aynı süreçte daha önce verdiği bilgiyi tekrar girmesini istemeyin (teslimat adresini fatura adresine otomatik doldurun).
- **Tutarlı Yardım (3.2.6, A):** Yardım mekanizmalarını (iletişim bağlantısı, sohbet) sayfalar arasında aynı göreli konumda tutun.

Odak ve hedef boyutu kurallarını ayrıntılı olarak [WCAG 2.2 klavye navigasyonu rehberimizde](/blog/keyboard-navigation-wcag) ele alıyoruz.

## Formları nasıl erişilebilir yaparsınız?

Erişilebilir formlar üç şeye dayanır: her alanın programatik bir etiketi vardır, hatalar metin olarak duyurulur ve zorunlu alanlar ekran okuyucunun okuyabileceği biçimde işaretlenir. Placeholder metni bir etiket değildir; girdi yapılınca kaybolur ve çoğu zaman kontrastta takılır. Her kontrole gerçek bir `<label>` bağlayın.

Sağlam, erişilebilir bir alan şöyle görünür:

```html
<label for="email">E-posta adresi</label>
<input
  id="email"
  name="email"
  type="email"
  required
  aria-describedby="email-error"
/>
<p id="email-error" role="alert">Lütfen geçerli bir e-posta adresi girin.</p>
```

Temel form kontrolleri:

- **Hataları alanlara bağlayın** ki odak girdiye geldiğinde mesaj `aria-describedby` ile okunsun.
- **Doğrulamayı duyurun**: yalnızca renkle değil, `role="alert"` ya da bir canlı bölge (live region) ile bildirin.
- **İlişkili kontrolleri gruplayın** (radyo grupları, adresler) bir `<fieldset>` ve `<legend>` içinde.
- **Yakınlaştırmayı asla kapatmayın**; `user-scalable=no` az gören kullanıcıların işine engel olur.

## Erişilebilirlik denetimi için hangi araçları kullanmalısınız?

Kolay yakalanan %30-40'ı temizlemek için otomatik tarayıcılarla başlayın, gerisi için manuel teste geçin. Denetimlerimizde otomasyon; eksik alt metni, kontrast hatalarını ve etiketsiz alanları güvenilir biçimde yakalar, ama odak sırasının mantıklı olup olmadığını ya da alt metnin gerçekten anlamlı olduğunu değerlendiremez. O boşluk bir insan gerektirir.

- **axe DevTools / Lighthouse:** Mekanik kurallar için hızlı tarayıcı içi taramalar.
- **WAVE:** Yapı ve kontrast sorunlarını vurgulayan görsel katman.
- **Ekran okuyucular:** NVDA (Windows, ücretsiz), VoiceOver (macOS/iOS) ve TalkBack (Android) ile test edin. Tek bir bileşeni değil, tam bir akışı okuyun.
- **Yalnızca klavye:** Fareyi çıkarın ve gerçek bir görevi baştan sona tamamlayın.

Erişilebilirliğin derleme sürecinize nasıl oturduğunu görmek için [frontend test stratejisi yazımıza](/blog/frontend-testing-strategy) ve [web geliştirme sayfasındaki diğer rehberlere](/blog/web-development) bakın.

## Denetimlerde takılan yaygın erişilebilirlik hataları

İlk kez yapılan neredeyse her denetimde işaretlediğimiz tekrar eden sorunlar:

- **Buton gibi davranan `div`'ler.** Tıklanabilir bir `<div>` odaklanabilir ya da duyurulabilir değildir. Gerçek bir `<button>` kullanın ya da `role`, `tabindex` ve tuş işleyicileri ekleyin.
- **Yalnızca hover ya da odakta takılan kontrast.** Ekipler varsayılan durumu test eder, diğerlerini unutur.
- **Yapışkan arayüz arkasında gizlenen odak.** Yeni 2.4.11 kuralı, biri Tab'layana kadar sessizce başarısız olur.
- **Hiçbir şey anlatmayan alt metin.** `alt="görsel"` ya da bir dosya adı işe yaramaktan da kötüdür; içeriği ya da amacı tarif edin.
- **Atlanan başlık seviyeleri.** `<h2>`'den `<h4>`'e atlamak ekran okuyucu navigasyonunu bozar.

Bu beşini düzeltirseniz çoğu sayfa, bir WCAG 2.2 AA denetiminin büyük kısmını geçer.

## Sıkça Sorulan Sorular

### WCAG 2.2 2026'da yasal olarak zorunlu mu?

Pratikte çoğu kurum için evet. AB'nin Avrupa Erişilebilirlik Yasası (Haziran 2025'ten beri yürürlükte) ve EN 301 549 gibi standartlar WCAG AA seviyesine atıf yapar; ABD ADA içtihadı da tutarlı biçimde WCAG'ı ölçüt gösterir. 2026'da uyum için güvenli zemin, 2.2 AA'yı hedeflemektir.

### WCAG 2.1 ile 2.2 arasındaki fark nedir?

WCAG 2.2, 2.1'deki her şeyi korur ve dokuz yeni başarı kriteri (klavye, dokunma hedefleri ve kimlik doğrulama odaklı) ekler; ayrıca güncelliğini yitiren 4.1.1 Ayrıştırma kriterini kaldırır. 2.1 AA'yı zaten karşılıyorsanız yakınsınız, ama 2.2'deki altı yeni A/AA kriterini yine de ele almanız gerekir.

### Otomatik araçlar erişilebilirliği tam olarak test edebilir mi?

Hayır. Otomatik araçlar WCAG sorunlarının yalnızca yaklaşık %30-40'ını güvenilir biçimde yakalar; çoğu kontrast ve eksik etiket gibi mekanik olanlardır. Karar gerektiren kontroller (mantıklı odak sırası, anlamlı alt metin, net hata mesajları) klavye ve ekran okuyucuyla manuel test ister.

### WCAG 2.2 hangi kontrast oranını şart koşar?

AA seviyesi normal metin için en az 4,5:1, büyük metin için (18px kalın ya da 24px normal) 3:1 ve simge, girdi kenarlığı, odak göstergesi gibi metin dışı öğeler için 3:1 ister. AAA seviyesi, normal metin şartını 7:1'e yükseltir.
