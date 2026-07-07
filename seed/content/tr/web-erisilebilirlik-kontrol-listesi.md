---
title: "Web Erişilebilirlik Kontrol Listesi (WCAG 2.2)"
slug: "web-erisilebilirlik-kontrol-listesi"
translationKey: "web-accessibility-checklist"
locale: "tr"
excerpt: "WCAG 2.2 için pratik web erişilebilirlik kontrol listesi: kontrast, klavye, odak, hedef boyutu ve formları test edin, denetimde takılan sorunları düzeltin."
category: "web-development"
tags: ["accessibility", "frontend", "wcag", "web-standards"]
publishedAt: "2026-07-05"
seoTitle: "Web Erişilebilirlik Kontrol Listesi (WCAG 2.2) — 2026"
seoDescription: "WCAG 2.2 web erişilebilirlik kontrol listesi: kontrast, klavye, odak, hedef boyutu ve formlar. EAA, ADA ve WebAIM Million 2025 verileriyle güncellenmiş rehber."
---

En çok ziyaret edilen bir milyon ana sayfanın **%94,8'i** en az bir otomatik yakalanabilir WCAG hatası içeriyor; bunların **%79,1'inde** sorun basit bir düşük renk kontrastı ([WebAIM Million 2025](https://webaim.org/projects/million/2025)). Yani erişilebilirlik "egzotik" bir konu değil; sıradan sitelerin çoğu, listenin ilk maddesinde takılıyor. Bu web erişilebilirlik kontrol listesi tam da bu yüzden temelleri en başa alır.

Aşağıdaki maddeleri sırayla uygulayıp gerçek bir ekran okuyucu ve klavyeyle test ederseniz, 2026'da hem yasal uyum hem de gerçek kullanıcılar için en kritik WCAG 2.2 AA kontrollerini geçersiniz.

## WCAG 2.2 nedir ve hangi seviyeyi hedeflemelisiniz?

WCAG 2.2, [W3C'nin güncel Web İçeriği Erişilebilirlik Kılavuzu](https://www.w3.org/WAI/standards-guidelines/wcag/) tavsiyesidir ve **5 Ekim 2023**'te yayımlanmıştır. Temmuz 2026 itibarıyla hâlâ yürürlükteki standart odur: WCAG 3.0 yalnızca bir Çalışma Taslağı (son sürüm Mart 2026, 174 çıktı) ve resmî tavsiye olması 2028 öncesi beklenmiyor — geldiğinde de 2.2'nin yerini almayacak, yanında yaşayacak. Yani bugün doğru hedef net: **WCAG 2.2 AA**.

WCAG 2.2, 2.1'in üzerine dokuz yeni başarı kriteri ekler ve her şeyi dört ilke altında toplar: içerik **Algılanabilir, Kullanılabilir, Anlaşılabilir ve Sağlam** (POUR) olmalıdır.

| Seviye | Kapsadığı alan | Kimin hedefi |
|--------|----------------|--------------|
| A | Kritik engeller (klavye, alt metin) | Mutlak asgari |
| AA | Kontrast, odak, hedef boyutu, formlar | Yasal zemin (ADA, EAA, EN 301 549) |
| AAA | İşaret dili, 7:1 kontrast | Yalnızca seçili kritik akışlar |

Bir güncellik notu: WCAG 2.2, modern tarayıcılar bozuk işaretlemeyi zaten sorunsuz işlediği için **4.1.1 (Ayrıştırma) kriterini kaldırdı**. Eski bir denetim şablonu bunu hâlâ listeliyorsa çıkarın.

## 2026'da erişilebilirlik yasal olarak nerede duruyor?

Kısa cevap: baskı artıyor. Avrupa Erişilebilirlik Yasası (EAA) **28 Haziran 2025**'ten beri yürürlükte ve ilk davalar **Kasım 2025**'te Fransa'da açıldı; Hollanda'nın ACM'si e-ticaret için aktif denetim yapıyor. Para cezaları ülkeye göre İrlanda'da ~60.000 €'dan İsveç'te ~900.000 €'ya kadar değişiyor.

- **EAA / EN 301 549:** Harmonize standardın mevcut sürümü (v3.2.1) WCAG 2.1 AA'ya atıf yapar; 2026'da beklenen **v4.1.1 ile WCAG 2.2'ye** geçilecek.
- **ABD ADA Başlık II:** Adalet Bakanlığı, Nisan 2026'da uyum tarihlerini bir yıl uzattı. Nüfusu 50.000+ olan kamu kurumları **26 Nisan 2027**'ye, küçükleri **26 Nisan 2028**'e kadar WCAG 2.1 AA'yı karşılamalı.

Mevzuat 2.1'e atıf yapsa da pratik strateji 2.2 AA'yı hedeflemek: üst kümesi, geriye dönük uyumlu ve denetimlerin gittiği yön bu.

## WCAG 2.2 erişilebilirlik kontrol listesi (adım adım)

Bu kontrolleri sırayla yapın. İlk adımlar en sık görülen hataları yakalar, böylece en büyük uyum kazancını en hızlı elde edersiniz:

1. **Renk kontrastını kontrol edin.** Metin en az **4,5:1** ister (büyük metin için 3:1; 18px kalın ya da 24px normal). Arayüz bileşenleri ve grafikler **3:1** ister (SC 1.4.11). WebAIM'e göre hataların en sık kaynağı burası.
2. **Anlamlı alt metin ekleyin.** Bilgi veren her `<img>` bir `alt` alır; dekoratif görseller `alt=""` alır ki ekran okuyucu atlasın (SC 1.1.1).
3. **Tam klavye erişimini test edin.** Sayfayı baştan sona Tab'layın. Her etkileşimli öğe fare olmadan kullanılabilir olmalı; klavye tuzağı bulunmamalı (SC 2.1.1, 2.1.2).
4. **Görünür odağı doğrulayın.** Odaklanan öğenin net bir göstergesi olmalı ve yapışkan başlık ya da çerez çubuğu arkasında gizlenmemeli (SC 2.4.7, 2.4.11 — 2.2'de yeni).
5. **Dokunma hedeflerini boyutlandırın.** Etkileşimli hedefler en az **24×24 CSS pikseli** olmalı ya da çevrelerinde yeterli boşluk bulunmalı (SC 2.5.8 — 2.2'de yeni).
6. **Sürükleme alternatifi sunun.** Sürükleyerek yapılan her işlem tek dokunuş ya da tıklamayla da çalışmalı (SC 2.5.7 — 2.2'de yeni).
7. **Her form alanını etiketleyin.** Her girdiye `<label>` bağlayın, hataları metin olarak gösterin, yalnızca placeholder'a güvenmeyin (SC 1.3.1, 3.3.1, 3.3.2).
8. **Gerçek başlıklar ve landmark'larla yapılandırın.** `<h1>`–`<h6>` sırayla, anlamsal landmark'lar (`<nav>`, `<main>`, `<footer>`) ile (SC 1.3.1, 2.4.1).
9. **Sayfa dilini belirtin.** `<html>` öğesine `lang` ekleyin ki yardımcı teknoloji doğru seslendirsin (SC 3.1.1).
10. **Önce otomatik tarama, sonra manuel test yapın.** Araçlar sorunların yaklaşık üçte birini yakalar; gerisi ekran okuyuculu bir insan gerektirir.

## Renk kontrastını doğru şekilde nasıl test edersiniz?

Renk kontrastı, metin ile arka planı arasındaki parlaklık oranını ölçer. WCAG 2.2, normal metin için en az **4,5:1**, büyük metin ya da simge ve girdi kenarlığı gibi metin dışı öğeler için **3:1** ister. En hızlı kontrol, oranı doğrudan renk seçicide gösteren Chrome DevTools'tur.

Otomatik araçların gözden kaçırdığı tuzaklara dikkat edin:

- **Görsel veya degrade üzerine metin.** Tarayıcı tek bir arka plan pikselini okur; fotoğrafta ise çok sayıda renk vardır. Oranı garantilemek için düz bir katman ya da metin gölgesi ekleyin. Görsel iş akışınızı [web görsel optimizasyonu rehberimizde](/tr/posts/web-gorsel-optimizasyonu) ele alıyoruz.
- **Pasif (disabled) durumlar.** Muaftır; ama "pasif görünen" ama tıklanabilir bir buton yine de geçmelidir.
- **Odak ve hover renkleri.** Odak göstergesinin kendisi komşu renklere karşı 3:1 kontrasta sahip olmalıdır.

```css
/* Yapışkan başlıklara rağmen görünür kalan, yüksek kontrastlı odak halkası */
:focus-visible {
  outline: 3px solid #1a5fff;
  outline-offset: 2px;
}
```

Utility sınıflarıyla stil verirken odak halkasını yanlışlıkla ezmek kolaydır; sık düşülen tuzakları [Tailwind CSS hataları yazımızda](/tr/posts/tailwind-css-hatalari) topladık.

## WCAG 2.2'nin yeni başarı kriterleri neler?

[WCAG 2.2 dokuz yeni kriter](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/) getirdi; altısı A veya AA seviyesinde, yani artık uyum zemininizin parçası. Öne çıkan değişiklikler klavye ve dokunma kullanıcılarını, ayrıca kimlik doğrulama ve tekrarlayan veri girişinde zorlananları hedefliyor.

- **Odak Gizlenmemeli (2.4.11, AA):** Odaklanan öğe yapışkan başlık, alt bilgi ya da yüzen bir bileşenle tamamen gizlenemez. Aksi hâlde sorunsuz görünen pek çok siteyi bozar.
- **Sürükleme Hareketleri (2.5.7, AA):** Kaydırıcılar, sırası değiştirilebilir listeler ve harita etkileşimleri için sürüklemesiz bir alternatif (dokun-seç ya da +/− buton) gerekir.
- **Asgari Hedef Boyutu (2.5.8, AA):** Küçük simge butonları ve sık dizilmiş bağlantılar 24×24px olmalı ya da aralanmalı. Önce mobil menü ve sayfalamayı denetleyin.
- **Erişilebilir Kimlik Doğrulama (3.3.8, AA):** Karakter kopyalama gibi bilişsel test dayatmayın. Parola yöneticisine, yapıştırmaya ve kopyalamaya izin verin; bulmaca CAPTCHA'lardan kaçının. Passkey'ler bu kriteri doğal olarak karşılar — ayrıntı için [Passkey ve WebAuthn rehberimize](/tr/posts/passkey-webauthn-rehberi) bakın.
- **Tekrarlı Giriş (3.3.7, A):** Aynı süreçte daha önce verilen bilgiyi yeniden istemeyin (teslimat adresini faturaya otomatik doldurun).
- **Tutarlı Yardım (3.2.6, A):** Yardım mekanizmalarını (iletişim, sohbet) sayfalar arasında aynı göreli konumda tutun.

## Formları nasıl erişilebilir yaparsınız?

Erişilebilir formlar üç şeye dayanır: her alanın programatik bir etiketi vardır, hatalar metin olarak duyurulur ve zorunlu alanlar ekran okuyucunun okuyabileceği biçimde işaretlenir. Placeholder metni etiket değildir; girdi yapılınca kaybolur ve çoğu zaman kontrastta takılır. Her kontrole gerçek bir `<label>` bağlayın.

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
- **Doğrulamayı duyurun**: yalnızca renkle değil, `role="alert"` ya da canlı bölge (live region) ile.
- **İlişkili kontrolleri gruplayın** (radyo grupları, adresler) bir `<fieldset>` ve `<legend>` içinde.
- **Yakınlaştırmayı asla kapatmayın**; `user-scalable=no` az gören kullanıcıların işine engel olur.

## Erişilebilirlik denetimi için hangi araçları kullanmalısınız?

Kolay yakalanan %30-40'ı temizlemek için otomatik tarayıcılarla başlayın, gerisi için manuel teste geçin. Otomasyon; eksik alt metni, kontrast hatalarını ve etiketsiz alanları güvenilir yakalar ama odak sırasının mantıklı olup olmadığını ya da alt metnin gerçekten anlamlı olduğunu değerlendiremez. O boşluk bir insan gerektirir.

- **axe DevTools / Lighthouse:** Mekanik kurallar için hızlı tarayıcı içi taramalar.
- **WAVE:** Yapı ve kontrast sorunlarını vurgulayan görsel katman.
- **Ekran okuyucular:** NVDA (Windows, ücretsiz), VoiceOver (macOS/iOS) ve TalkBack (Android). Tek bir bileşeni değil, tam bir akışı okuyun.
- **Yalnızca klavye:** Fareyi çıkarın ve gerçek bir görevi baştan sona tamamlayın.

Erişilebilirliği bir performans bütçesi gibi CI'ya bağlamak en sağlıklısı; benzer bir kontrol listesini [Core Web Vitals yazımızda](/tr/posts/core-web-vitals-kontrol-listesi) kurduk. Konuyla ilgili diğer rehberler [web geliştirme kategorisinde](/tr/category/web-gelistirme).

## Denetimlerde takılan yaygın erişilebilirlik hataları

İlk denetimlerin neredeyse hepsinde işaretlediğimiz tekrar eden sorunlar:

- **Buton gibi davranan `div`'ler.** Tıklanabilir bir `<div>` odaklanabilir ya da duyurulabilir değildir. Gerçek bir `<button>` kullanın ya da `role`, `tabindex` ve tuş işleyicileri ekleyin.
- **Yalnızca hover ya da odakta takılan kontrast.** Ekipler varsayılan durumu test eder, diğerlerini unutur.
- **Yapışkan arayüz arkasında gizlenen odak.** Yeni 2.4.11 kuralı, biri Tab'layana kadar sessizce başarısız olur.
- **Hiçbir şey anlatmayan alt metin.** `alt="görsel"` ya da bir dosya adı işe yaramaktan da kötüdür; içeriği ya da amacı tarif edin.
- **Atlanan başlık seviyeleri.** `<h2>`'den `<h4>`'e atlamak ekran okuyucu navigasyonunu bozar.

WebAIM'in verisi bu konuda acı bir gerçeği söylüyor: en sık altı hata beş yıldır aynı. Yani bu beşini düzeltmek, çoğu sayfayı bir WCAG 2.2 AA denetiminin büyük kısmından geçirir.

## Sıkça Sorulan Sorular

### WCAG 2.2 2026'da yasal olarak zorunlu mu?

Pratikte çoğu kurum için evet. AB'nin Avrupa Erişilebilirlik Yasası (Haziran 2025'ten beri yürürlükte, ilk davalar Kasım 2025) ve EN 301 549 WCAG AA'ya atıf yapar; ABD'de ADA Başlık II kamu kurumlarını 2027-2028 tarihleriyle WCAG 2.1 AA'ya bağlar. Güvenli zemin 2.2 AA'yı hedeflemektir.

### WCAG 2.1 ile 2.2 arasındaki fark nedir?

WCAG 2.2, 2.1'deki her şeyi korur ve dokuz yeni başarı kriteri (klavye, dokunma hedefleri, kimlik doğrulama odaklı) ekler; ayrıca güncelliğini yitiren 4.1.1 Ayrıştırma kriterini kaldırır. 2.1 AA'yı karşılıyorsanız yakınsınız ama 2.2'deki altı yeni A/AA kriterini yine de ele almanız gerekir.

### WCAG 3.0 çıktı mı, beklemeli miyim?

Beklemeyin. WCAG 3.0 Temmuz 2026 itibarıyla hâlâ Çalışma Taslağı (Mart 2026 sürümü) ve resmî tavsiye olması 2028'den önce beklenmiyor. Geldiğinde de 2.2 AA'yı geçersiz kılmayacak; bugün 2.2'ye yatırım yapmak boşa gitmez.

### Otomatik araçlar erişilebilirliği tam test edebilir mi?

Hayır. Otomatik araçlar WCAG sorunlarının yalnızca ~%30-40'ını güvenilir yakalar; çoğu kontrast ve eksik etiket gibi mekanik olanlardır. Karar gerektiren kontroller (mantıklı odak sırası, anlamlı alt metin, net hata mesajları) klavye ve ekran okuyucuyla manuel test ister.
