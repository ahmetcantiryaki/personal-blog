---
title: "Erişilebilir Form Oluşturma: Geliştirici Kontrol Listesi"
slug: "erisilebilir-form-olusturma-kontrol-listesi"
translationKey: "accessible-forms-checklist-2026"
locale: "tr"
excerpt: "Forma özel kontrol listesi: etiket-input eşlemesi, fieldset/legend, aria-live hata bildirimi, odak yönetimi ve doğru autocomplete değerleri."
category: "web-development"
tags: ["accessibility", "wcag", "frontend", "best-practices"]
publishedAt: "2026-10-14"
seoTitle: "Erişilebilir Form Kontrol Listesi (2026)"
seoDescription: "Geliştiriciler için erişilebilir form kontrol listesi: etiketler, fieldset/legend, aria-live hatalar, odak yönetimi ve doğru autocomplete değerleri."
---

Kısa cevap: erişilebilir bir form için her input'ta programatik olarak bağlı bir etiket, ilişkili alanların etrafında `fieldset`/`legend`, `aria-live` veya `role="alert"` ile duyurulup `aria-describedby` ile input'a bağlanan hata metinleri, gönderimde ilk hataya taşınan odak, metin ve kodla işaretlenmiş zorunlu alanlar, her alan için doğru `input type` ve `autocomplete` değeri gerekir.

Klavyeyle gezinen bir kullanıcının kredi başvuru formunu doldurduğunu düşünün. E-posta alanına Tab ile geliyor, adresi yanlış yazıyor, gönder'e basıyor ve sayfa sessizce yeniden çiziliyor; sayfanın bir yerinde kırmızı bir yıldız beliriyor. Odak hiçbir yere taşınmıyor, hiçbir şey duyurulmuyor, alanın kendisi DOM'da hâlâ "geçersiz" demiyor — ekran okuyucu kullanan biri de bir süre sonra aynı duvara çarpıyor. Aşağıdaki kontrol listesi, bu sessiz başarısızlığı gerçekten ne olduğunu söyleyen bir forma çeviriyor.

## Bir etiket, input'a nasıl doğru bağlanır?

Bir etiket, `for` özniteliği input'un `id`'siyle eşleştiğinde veya `<label>` elemanı input'u doğrudan sarmaladığında doğru bağlanmış olur — her ikisi de yardımcı teknolojiye sadece görsel değil, programatik bir bağlantı verir; [WebAIM'in form rehberi](https://webaim.org/techniques/forms/) bunu ayrıntılı olarak anlatır. Placeholder bir etiket değildir: kullanıcı yazmaya başladığı anda kaybolur ve çoğu ekran okuyucu onu tamamen atlar; WCAG 2.2'nin **3.3.2 Etiketler veya Talimatlar** ve **1.3.1 Bilgi ve İlişkiler** maddeleri tam olarak bunu önlemek için yazılmıştır.

Sık karşılaşılan iki özel durum var: görünür metni olmayan bir ikon buton için kontrolün kendisine `aria-label="Ara"` eklenir; birden fazla elemana bölünmüş bir etiket (ayrı bir para birimi simgesi olan fiyat gibi) için `aria-labelledby` ile her elemanın `id`'si gösterilir. Görünen metinle eşleşen çalışan bir `<label for>` üzerine asla `aria-label` eklemeyin — `aria-label` kazanır ve erişilebilir adı sessizce geçersiz kılar; ekran okuyucu ekrandaki metinden farklı bir şey okuyorsa kontrol edilecek ilk yer burasıdır.

## fieldset ve legend ne zaman gerçekten önemli?

`fieldset`/`legend`, bir grup input — radyo grubu, checkbox kümesi veya bölünmüş bir adres bloğu — tek bir mantıksal soruyu oluşturduğunda gereklidir. `legend` metni her seçeneğin duyurulan adının bir parçası olur; böylece "Tercih edilen iletişim yöntemi" o gruptaki her radyo butonundan önce okunur, "Teslimat adresi" ise çok alanlı bir adresin her satırından önce okunur. Bunu atlarsanız ekran okuyucu kullanıcısı beş etiketsiz radyo butonu duyar ve aralarında ne seçtiğine dair hiçbir fikri olmaz.

Bütün çok bölümlü formu tek bir büyük `fieldset` içine sarmalayarak aşırıya kaçmayın — bu her alandan önce gereksiz gürültü ekler. Her `fieldset`'i tek bir mantıksal gruba kapsayın, daha genişine değil.

## Doğrulama hatası ekran okuyucuya nasıl duyurulur?

Bir hata üç şeye aynı anda ihtiyaç duyar: input'ta `aria-invalid="true"`, hata metninin `id`'sine işaret eden `aria-describedby` ve bu hata metninin `role="alert"` veya `aria-live="assertive"` içeren bir eleman içinde yer alması — göründüğü an duyurulsun diye. Bu, **3.3.1 Hata Tanımlama** ve **3.3.3 Hata Önerisi** maddelerini karşılar ve [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)'daki hata desenine uyar. NVDA ve VoiceOver'ın ikisinde de çalışan bir örnek:

```html
<form novalidate>
  <div class="field">
    <label for="email">
      E-posta adresi <span aria-hidden="true">*</span>
      <span class="visually-hidden">(zorunlu)</span>
    </label>
    <input
      type="email"
      id="email"
      name="email"
      autocomplete="email"
      required
      aria-required="true"
      aria-invalid="true"
      aria-describedby="email-hint email-error"
    >
    <p id="email-hint" class="hint">Fişinizi bu adrese göndereceğiz.</p>
    <p id="email-error" class="error" role="alert">
      ornek@site.com biçiminde bir e-posta adresi girin
    </p>
  </div>

  <fieldset>
    <legend>Teslimat adresi</legend>
    <div class="field">
      <label for="street">Sokak adresi</label>
      <input type="text" id="street" name="street" autocomplete="address-line1" required aria-required="true">
    </div>
    <div class="field">
      <label for="postal">Posta kodu</label>
      <input type="text" id="postal" name="postal" autocomplete="postal-code" inputmode="numeric" required aria-required="true">
    </div>
  </fieldset>

  <div aria-live="polite" id="form-status" class="visually-hidden"></div>
  <button type="submit">Siparişi tamamla</button>
</form>
```

İki tuzağa dikkat: `aria-describedby` boşlukla ayrılmış birden fazla `id` alabilir, bu yüzden önce ipucu sonra hata sırasıyla yazın ki hata en son okunsun ve akılda kalsın. Ayrıca `role="alert"` zaten assertive bir canlı bölge davranışı içerir — aynı elemanı ayrıca bir `aria-live="assertive"` kapsayıcısına da sarmalamayın; her eleman için tek bir mekanizma seçin.

## Hatadan veya dinamik güncellemeden sonra odak nasıl yönetilir?

Başarısız bir gönderimde, JavaScript ile (`element.focus()`) odağı formun üstündeki kapatılabilir bir hata özetine veya ilk geçersiz alana taşıyın — tarayıcılar bunu otomatik yapmaz ve odağın gönder butonunun olduğu yerde kalması, klavye kullanıcılarının neler olduğunu kaybetmesinin en yaygın nedenidir. Özet kapsayıcısı doğal olarak odaklanabilir değilse `tabindex="-1"` verin; böylece normal Tab sırasına eklemeden script ile odaklanma çalışır.

Hâlâ odakta olan bir alanda görünen satır içi hatalarda — yukarıdaki e-posta örneği gibi — odağı ayrıca taşımayın; `aria-live` bölgesi duyuruyu zaten yapar ve kullanıcının o anda yazdığı alandan odağı çekmek kafa karıştırıcıdır. Odak taşımayı form düzeyindeki başarısızlıklara ayırın; bu, WCAG'nin **2.4.3 Odak Sırası** maddesine karşılık gelir.

## Zorunlu alanlar sadece renge dayanmadan nasıl işaretlenir?

Yerel `required` özniteliğini `aria-required="true"` ile birlikte kullanın — çoğu modern tarayıcı/ekran okuyucu kombinasyonunda gereksiz olsa da yalnızca ARIA durumunu okuyan eski yardımcı teknolojiler için değerlidir — ve etiketin yanına yıldız veya kırmızı renk yerine "(zorunlu)" gibi görünür bir metin ipucu ekleyin. **1.4.1 Renk Kullanımı** rengin tek sinyal olmasını yasaklar; sadece bir yıldız işareti, kuralı bilmeyen biri için hiçbir anlam taşımaz.

Alanların çoğu zorunluysa deseni tersine çevirin: sadece istisnai olan opsiyonel alanları "(opsiyonel)" diye işaretleyin, diğer yerlerde işaret kullanmayın. Görsel yoğunluğu azaltır ve yine tamamen uyumludur.

## Hangi autocomplete değerleri ve input tipleri kullanılmalı?

Veriye uyan HTML5 `input type`'ını kullanın — `email`, `tel`, `url`, `number`, `date` — böylece mobil klavyeler ve tarayıcının yerel doğrulaması otomatik uyum sağlar; eşleşen [WHATWG `autocomplete` değerini](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete) de ayarlayın ki tarayıcılar ve şifre yöneticileri alanı doğru doldursun. WCAG 2.2'nin **1.3.5 Girdi Amacının Belirlenmesi** maddesi AA seviyesinde tam olarak bu eşleşmeyi gerektirir:

| Alan | `input type` | `autocomplete` değeri |
|------|---------------|------------------------|
| Ad soyad | text | `name` |
| Ad / soyad | text | `given-name` / `family-name` |
| E-posta adresi | email | `email` |
| Telefon numarası | tel | `tel` |
| Yeni şifre | password | `new-password` |
| Mevcut şifre (giriş) | password | `current-password` |
| Tek kullanımlık kod (2FA) | text | `one-time-code` |
| Sokak adresi | text | `address-line1` |
| Posta kodu | text | `postal-code` |
| Doğum tarihi | date | `bday` |
| Kart numarası | text, `inputmode="numeric"` | `cc-number` |

`autocomplete="new-password"` ile işaretlenmiş bir yeni-şifre alanı, tarayıcının ürettiği güçlü şifrelerin ve şifre yöneticisi otomatik doldurmasının çalışmasını da sağlar — bunu yanlış ayarlamak, ekran okuyucuyla ilgisi olmayan ama gerçek kullanıcıları yine de kilitleyen yaygın bir hatadır.

## Otomatik bir tarayıcı, formu test etmek için neden yetmiyor?

axe veya Lighthouse gibi otomatik araçlar eksik bir `<label>`'ı veya hatalı bir ARIA özniteliğini güvenilir şekilde yakalar, ama bir hatanın sesli olarak duyurulup duyurulmadığını veya odağın birinin bir şey yapabileceği bir yere inip inmediğini söyleyemez — bunların hiçbiri taranan DOM ağacında görünmez. Bunları ancak VoiceOver (macOS ve iOS'a yerleşik, Cmd+F5 ile açılır) veya NVDA (ücretsiz, Windows) ile yapılan gerçek bir test yakalar; her form için yaklaşık on dakika sürer.

Baştan kurulması, sonradan eklenmesinden daha kolay olan iki WCAG 2.2 maddesi var: **3.3.7 Tekrarlanan Girdi**, aynı süreçte zaten verilmiş bir bilgiyi kullanıcıya tekrar yazdırmamayı söyler — "fatura adresi teslimat adresiyle aynı" onay kutusu standart çözümdür — ve [**3.3.8 Erişilebilir Kimlik Doğrulama (Minimum)**](https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html), bir giriş adımının kod ezberlemek veya elle yazmak gibi bilişsel bir teste zorlamamasını söyler; bu yüzden şifre alanlarında yapıştırma çalışmalı ve nesne tanıma CAPTCHA'ları tek başına bir ihlaldir.

Hafif tartışmalı bir not: ARIA, bir form görsel olarak çalıştıktan sonra üzerine eklenen bir süsleme değildir. Yerel bir `<label>`, `<fieldset>` ve `<button>` işin büyük kısmını bedavaya halleder; denetlediğim formların çoğu ARIA eksikliğinden değil, bir markup sorununu düzeltmek yerine `aria-*` öznitelikleriyle yamalamaya çalışıldığı için denetimden geçemiyor.

Bu kontrol listesi kasıtlı olarak sadece formlara odaklanıyor. Kontrast, dokunma hedefleri, başlıklar ve sayfanın gerisi için genel [WCAG 2.2 erişilebilirlik kontrol listesi](/tr/posts/web-erisilebilirlik-kontrol-listesi) o alanı kapsıyor; [web geliştirme](/tr/category/web-gelistirme) kategorimizdeki diğer yazılar da benzer konuları ele alıyor. Bunu özellikle React'e kurmak isteyenler için [RHF ve Zod ile erişilebilir React formları](/tr/posts/rhf-zod-erisilebilir-react-formlari) aynı deseni React Hook Form ve Zod'a nasıl bağlayacağınızı gösteriyor.

## Sıkça Sorulan Sorular

### Görünür bir etiketim varsa aria-label'a da ihtiyacım var mı?

Hayır — ekrandaki metinle zaten eşleşen, çalışan bir `<label for>`'un üzerine `aria-label` eklemek en iyi ihtimalle gereksizdir, çünkü `aria-label` erişilebilir adı tamamen geçersiz kılar. `aria-label`'ı, hiç görünür etiketi olmayan kontroller için saklayın; ikon buton gibi.

### Placeholder metni, bir etiketin yerini tutar mı?

Hayır. Placeholder metni kullanıcı yazmaya başladığı an kaybolur, çoğunlukla renk kontrastı kurallarını karşılamaz ve birçok ekran okuyucu onu varsayılan olarak atlar; bu yüzden tek başına WCAG'nin **3.3.2 Etiketler veya Talimatlar** maddesini karşılamaz. Placeholder'ı her zaman gerçek bir `<label>` ile birlikte kullanın — placeholder bir biçim ipucu olarak destek verebilir, etiketin yerini asla alamaz.

### Hatalar için role="alert" mi, aria-live="assertive" mi kullanılmalı?

İkisi de anında duyurur, bu yüzden bunları birleştirmek yerine her eleman için birini seçin: `role="alert"`, metni sonradan doldurulan ve DOM'da zaten var olan bir hata kapsayıcısına uyar; sürekli var olan, boş bir elemana `aria-live="assertive"` vermek ise aynı alanda eleman yeniden oluşturulmadan tekrar edebilen hatalar için genelde daha güvenilirdir.

### Kapsamlı bir denetim yapmadan bir formun erişilebilirliğini hızlıca nasıl kontrol ederim?

Mouse'u çekin, formun tamamında sırayla Tab ile gezinin ve VoiceOver veya NVDA çalışırken her doğrulama hatasını tetikleyip dinleyin — gözleriniz kapalıyken ne ters gittiğini anlayamıyorsanız, ekran okuyucu kullanan biri de anlayamaz. Yayınlamadan önce her formda yapılan bu on dakikalık tek geçiş, herhangi bir otomatik tarayıcıdan daha fazla gerçek sorunu ortaya çıkarır.
