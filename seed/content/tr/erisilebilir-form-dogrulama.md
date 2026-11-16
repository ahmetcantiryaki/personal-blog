---
title: "Kütüphanesiz Erişilebilir Form Doğrulama Nasıl Yapılır?"
slug: "erisilebilir-form-dogrulama"
translationKey: "accessible-form-validation-2026"
locale: "tr"
excerpt: "Kısa cevap: tarayıcının Constraint Validation API'sini aria-describedby, aria-invalid ve bir aria-live bölgesiyle birleştir; hiçbir kütüphane gerekmez."
category: "web-development"
tags: ["accessibility", "wcag", "frontend", "best-practices"]
publishedAt: "2026-11-16"
seoTitle: "Kütüphanesiz Erişilebilir Form Doğrulama Rehberi"
seoDescription: "Tarayıcının Constraint Validation API'si, aria-describedby ve aria-live ile hiçbir kütüphane kullanmadan erişilebilir form doğrulama nasıl kurulur?"
---

Kısa cevap: `required`, `pattern` gibi HTML kısıtlarını tarayıcının Constraint Validation API'siyle (`setCustomValidity`, `reportValidity`) birleştirip hata metnini `aria-describedby` ile girdiye bağlarsan, hiçbir kütüphaneye ihtiyacın olmaz. Ekran okuyucular hatayı doğru anons eder, görsel stil tamamen senin kontrolünde kalır.

Çoğu "güzel" form doğrulaması, görsel olarak iyi görünüp ekran okuyucu kullanan birine hiçbir şey anlatmıyor. Kırmızı bir kenarlık görme engelli bir kullanıcıya hiçbir şey söylemez; hata mesajı DOM'da varsa ama girdiyle ilişkilendirilmemişse, o mesaj da anons edilmez. Aşağıdaki yapı, hem görsel hem de programatik olarak doğru çalışan bir form doğrulama deseni veriyor; formun genel yapısı için [web erişilebilirlik kontrol listesi](/tr/posts/web-erisilebilirlik-kontrol-listesi) iyi bir tamamlayıcı kaynak.

## Constraint Validation API nedir?

Constraint Validation API, tarayıcının `<input>`, `<select>` ve `<textarea>` elemanlarına yerleşik olarak sunduğu doğrulama mekanizmasıdır; `required`, `pattern`, `minlength`, `maxlength` ve `type` gibi HTML özniteliklerini okur, `checkValidity()` ile sessizce kontrol eder, `reportValidity()` ile tarayıcının kendi doğrulama arayüzünü gösterir. `setCustomValidity(mesaj)` çağrısı, bir girdiyi manuel olarak geçersiz işaretler; boş string vermek hatayı temizler. Kasım 2026 itibarıyla bu API'nin tamamı Chrome, Firefox ve Safari'de yıllardır destekleniyor; sorun API eksikliği değil, kimsenin hata mesajını erişilebilir biçimde göstermemesi.

Bir ayrıntı gözden kaçırılıyor: `minlength` ve `maxlength` kısıtları sadece kullanıcının klavyeden girdiği değerler için kontrol edilir; JavaScript ile `input.value = "..."` atanan bir değer bu kısıtları tetiklemez, `checkValidity()` çağırsan bile. Programatik olarak doldurulan alanları ayrıca kendin doğrulaman gerekir.

## `:user-invalid` ne işe yarar?

`:user-invalid` CSS sözde sınıfı, kullanıcı alanla etkileşime girip ayrıldıktan sonra geçersizse eşleşir; `:invalid`'in aksine, henüz dokunulmamış boş bir zorunlu alanı kırmızıya boyamaz. Bu, formun açılır açılmaz tüm alanları hata rengiyle doldurmasını önleyen tek satırlık bir CSS çözümü. Kasım 2026'da tarayıcı desteği güçlü (Chrome, Firefox, Safari'nin güncel sürümleri), ama destek matrisini her zaman caniuse.com üzerinden doğrulamak gerekiyor; eski bir Safari sürümünü desteklemen gerekiyorsa `:invalid` ve bir `touched` class'ını birlikte kullanan bir yedek plan kur.

```html
<style>
  input:user-invalid {
    border-color: #dc2626;
  }
  input:user-invalid + .error-message {
    display: block;
  }
</style>
```

## Hata mesajını girdiye nasıl bağlarsın?

Hata metnini `aria-describedby` ile girdinin `id`'sine referans ver, girdiye de `aria-invalid="true"` ekle; ekran okuyucu kullanıcısı alana geldiğinde hem açıklamayı hem de geçersiz durumunu anons eder. `aria-invalid`'i her zaman true bırakmak yaygın bir hata — alan geçerli olduğunda `aria-invalid="false"` ya da özniteliği tamamen kaldırmak gerekir, yoksa ekran okuyucu düzeltilmiş bir alanı hâlâ hatalı okur.

```html
<label for="email">E-posta</label>
<input
  type="email"
  id="email"
  required
  aria-describedby="email-error"
  aria-invalid="false"
/>
<span id="email-error" class="error-message" role="alert"></span>
```

```javascript
const email = document.getElementById('email')
const emailError = document.getElementById('email-error')

email.addEventListener('blur', () => {
  if (email.validity.valueMissing) {
    email.setCustomValidity('E-posta adresi zorunludur.')
  } else if (email.validity.typeMismatch) {
    email.setCustomValidity('Geçerli bir e-posta adresi girin, örn. ad@alan.com.')
  } else {
    email.setCustomValidity('')
  }
  const invalid = !email.checkValidity()
  email.setAttribute('aria-invalid', String(invalid))
  emailError.textContent = invalid ? email.validationMessage : ''
})
```

## Async doğrulama (kullanıcı adı kontrolü gibi) nasıl anons edilir?

Async kontroller için statik `role="alert"` yerine ayrı bir `aria-live="polite"` bölgesi kullan; aksi halde her tuş vuruşunda anons tetiklenip kullanıcıyı boğar. Bölge, sayfa ilk yüklendiğinde DOM'da boş olarak bulunmalı — sonradan eklenen bir container'a metin yazmak, bazı ekran okuyucularda anons edilmiyor, çünkü live region kaydı DOM'a eklenme anında yapılıyor.

```html
<div id="username-status" aria-live="polite" class="sr-only"></div>
```

```javascript
let debounceTimer
username.addEventListener('input', () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(async () => {
    const taken = await checkUsernameTaken(username.value)
    document.getElementById('username-status').textContent = taken
      ? `"${username.value}" kullanımda, başka bir ad dene.`
      : `"${username.value}" uygun.`
  }, 500)
})
```

Debounce süresi kritik: her tuş vuruşunda anons tetiklemek, `aria-live` bölgesini pratikte kullanılamaz hale getirir. 500 ms'lik bir bekleme, hem ağ isteğini hem de anons sıklığını makul seviyede tutuyor.

## Submit sırasında focus nereye gitmeli?

Form gönderildiğinde ve doğrulama başarısız olduğunda focus'u ilk geçersiz alana taşı; aksi halde klavye kullanıcısı hangi alanın hatalı olduğunu bulmak için formu baştan taramak zorunda kalır. [Erişilebilir form kontrol listesi](/tr/posts/erisilebilir-form-olusturma-kontrol-listesi) bu adımı sık atlanan bir madde olarak işaretliyor; benim deneyimimde de en çok unutulan kısım bu.

```javascript
form.addEventListener('submit', (e) => {
  const firstInvalid = form.querySelector(':invalid')
  if (firstInvalid) {
    e.preventDefault()
    firstInvalid.focus()
  }
})
```

## Bu deseni nasıl test edersin?

Önce axe-core veya Lighthouse'un erişilebilirlik denetimiyle otomatik bir tarama yap; bu araçlar eksik `label`, eksik `aria-describedby` referansı gibi yapısal hataları saniyeler içinde bulur ama anons sırasını veya zamanlamasını test edemez. Otomatik tarama en fazla hataların yaklaşık üçte birini yakalar; geri kalanı gerçek bir ekran okuyucuyla elle dinlemek gerekiyor.

Elle test için NVDA (Windows, ücretsiz) veya VoiceOver (macOS/iOS, yerleşik) ile formu klavyeyle baştan sona doldurup hangi anonsun ne zaman geldiğini dinle. İki ekran okuyucu arasında `aria-live` anonslarının zamanlaması ve sırası konusunda küçük farklar olabiliyor; Kasım 2026 itibarıyla ikisi de güncel sürümlerinde `aria-describedby`, `aria-invalid` ve `aria-live="polite"` desenini güvenilir biçimde destekliyor, ama kesin bir uyum yüzdesi vermek yanıltıcı olur — kendi formunu her iki araçla da bir kez dinlemeden "erişilebilir" damgası vurma.

Benim gözlemim şu: ekip içi tek bir kişinin NVDA'yı beş dakikalığına açıp formu denemesi, bir sprint boyunca yazılan tüm otomatik testten daha fazla gerçek hata yakalıyor. Bunu her PR'da zorunlu kılmak gerekmiyor ama yeni bir form deseni eklerken bir kez yapmak, canlıya çıktıktan sonra bir kullanıcı şikayetiyle öğrenmekten çok daha ucuz.

Checkbox grupları ve radio butonları ayrı bir dikkat gerektiriyor: `fieldset` ve `legend` kullanmadan tek bir `aria-describedby` hatasını tüm gruba bağlamaya çalışmak, ekran okuyucunun hangi seçeneğin hatalı olduğunu söylememesine yol açıyor. Grup seviyesinde bir hata varsa, hatayı `fieldset`'in kendisine bağla; tek bir seçeneğe özgü bir kısıt varsa (örneğin "en az bir seçenek işaretli olmalı"), hata mesajını grup seviyesinde tutup `aria-live` ile anons etmek, tek tek her radio'ya mesaj eklemekten daha az kafa karıştırıcı.

## Bu desen hangi WCAG kriterlerini karşılar?

Aşağıdaki tablo, yukarıdaki deseni WCAG 2.1/2.2'nin ilgili maddeleriyle eşleştiriyor; `aria-describedby` + `aria-invalid` + `aria-live` üçlüsü üç farklı kriteri birden karşılıyor.

| WCAG Kriteri | Seviye | Bu desende karşılanma yolu |
|---|---|---|
| 3.3.1 Hata Tanımlama | A | Hatalı alan `aria-invalid` ile işaretlenir, hata metni `aria-describedby` ile bağlanır |
| 3.3.3 Hata Önerisi | AA | Hata mesajı sadece "geçersiz" demek yerine ne yapılması gerektiğini söyler (örn. "ad@alan.com formatında girin") |
| 4.1.3 Durum Mesajları | AA | Async sonuçlar `aria-live="polite"` bölgesiyle focus almadan anons edilir |

## `select` ve `textarea` için de aynı desen geçerli mi?

Evet, Constraint Validation API `<select>` ve `<textarea>` elemanlarında da birebir aynı şekilde çalışır; `required` özniteliği her ikisinde de desteklenir, `textarea` ayrıca `minlength`/`maxlength` kısıtlarını da aynı kurallarla uygular. Tek fark `pattern` özniteliğinin `<select>` üzerinde bir anlamı olmaması — seçim zaten sabit bir seçenek listesinden yapıldığı için biçim doğrulamasına gerek kalmıyor. `aria-describedby` ve `aria-invalid` bağlama deseni, `<select>` için de değişmeden kullanılabilir; tek ek nokta, native `<select>` yerine özel bir açılır menü bileşeni kullanıyorsan bu özniteliklerin görünür elemente değil, gerçek erişilebilirlik ağacında rol oynayan elemente eklenmesi gerektiğidir.

## Sıkça Sorulan Sorular

### Erişilebilir form doğrulama için bir kütüphane gerekir mi?

Hayır, basit formlar için gerekmez. Constraint Validation API, `aria-describedby` ve bir `aria-live` bölgesi, React Hook Form veya benzeri bir kütüphanenin yaptığı erişilebilirlik işinin büyük kısmını sıfır bağımlılıkla karşılıyor; karmaşık, çok adımlı formlarda [RHF ve Zod ile erişilebilir React formları](/tr/posts/rhf-zod-erisilebilir-react-formlari) kurmak zaman kazandırabilir.

### `:invalid` ile `:user-invalid` arasındaki fark ne?

Kısa cevap: `:invalid`, alan boşsa ve zorunluysa sayfa yüklendiği anda bile eşleşir; `:user-invalid` ise kullanıcı alanla etkileşime girip ayrıldıktan sonra eşleşir. Bu fark, formun açılır açılmaz tüm zorunlu alanları kırmızıya boyamasını önlüyor.

### `aria-live` bölgesi neden bazen anons edilmiyor?

En yaygın sebep, `aria-live` özniteliği taşıyan elemanın sayfa ilk yüklendiğinde DOM'da bulunmaması; bölge sonradan JavaScript ile eklenirse bazı ekran okuyucular onu canlı bölge olarak kaydetmiyor. Çözüm, boş `aria-live` container'ını başlangıç HTML'ine koymak, içeriğini sonra doldurmak.

### `setCustomValidity` çağrısını ne zaman temizlemek gerekir?

Alan artık geçerli olduğu anda, boş string ile çağırmak gerekir: `input.setCustomValidity('')`. Bunu atlamak, kullanıcı hatayı düzeltse bile formun hâlâ geçersiz görünmesine ve submit edilememesine yol açan yaygın bir hata.

Daha fazla [web geliştirme](/tr/category/web-gelistirme) yazısı için kategori sayfasına bakabilirsin.

**Kaynaklar:** [MDN — Constraint Validation kullanımı](https://developer.mozilla.org/docs/Web/HTML/Constraint_validation), [W3C WAI — ARIA ile hata anonsu](https://www.w3.org/WAI/GL/wiki/Using_ARIA_Live_Regions_or_role=alert_to_Identify_Errors), [WCAG 2.2 — Hata Tanımlama ve Hata Önerisi](https://www.w3.org/WAI/WCAG22/Understanding/error-identification).
