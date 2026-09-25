---
title: "Web Speech API: Web Uygulamasına Sesli Giriş Ekle"
slug: "web-speech-api-sesli-giris"
translationKey: "web-speech-api-voice-input-2026"
locale: "tr"
excerpt: "Web Speech API, tarayıcıya yerleşik SpeechRecognition ve SpeechSynthesis arayüzleriyle sesli giriş ekler; ama Firefox'ta varsayılan kapalı, tam tutarlılık yok."
category: "web-development"
tags: [accessibility, frontend, web-standards, best-practices]
publishedAt: "2026-09-25"
seoTitle: "Web Speech API ile Sesli Giriş: Kurulum ve Fallback"
seoDescription: "Web Speech API, SpeechRecognition ve SpeechSynthesis ile tarayıcıda sesli giriş sağlar. Tarayıcı desteği, izin modeli ve fallback stratejisi burada."
---

Kısa cevap: Web Speech API, tarayıcıya ekstra kütüphane yüklemeden konuşmayı metne (`SpeechRecognition`) ve metni sese (`SpeechSynthesis`) çeviren yerleşik bir tarayıcı arayüzüdür. Chrome, Edge ve Opera'da tam destekleniyor, Safari'de önekli (`webkitSpeechRecognition`) çalışıyor, Firefox'ta ise varsayılan olarak kapalı — bu yüzden üretim kodunda mutlaka bir fallback stratejisi gerekiyor.

## Web Speech API tam olarak neyi kapsıyor?

İki ayrı arayüzü kapsıyor: `SpeechSynthesis` (metni sese çevirme) ve `SpeechRecognition` (konuşmayı metne çevirme). Bu ikisi birbirinden bağımsız çalışıyor — bir uygulama yalnızca metni seslendirebilir, yalnızca sesli komut alabilir veya ikisini birlikte kullanabilir.

`SpeechSynthesis`, işletim sisteminin yerleşik ses motorlarını kullandığı için ek bir ağ isteği gerektirmiyor ve çevrimdışı çalışıyor. `SpeechRecognition` ise tarayıcıya göre değişiyor: Chrome'da ses kaydı bir sunucuya gönderilip orada işleniyor, bu yüzden internet bağlantısı gerektiriyor; Safari ise kullanıcı izin verip dil paketini indirdikten sonra cihaz üzerinde (on-device) tanıma yapabiliyor.

## 2026'da sesli arayüzler neden yükselişte?

Çünkü mobil kullanımda klavyeyle metin girmek hâlâ en yavaş etkileşim yöntemi, oysa konuşma tanıma artık günlük kullanılan asistan uygulamalarıyla (Gemini, ChatGPT sesli mod) kullanıcı beklentisini yükseltti. Kullanıcılar bir web formunda da benzer bir sesli kısayol beklemeye başladı — özellikle arama kutuları, not alma araçları ve erişilebilirlik gerektiren akışlarda.

## Tarayıcı desteği ve API davranışı nasıl değişiyor?

| Tarayıcı | SpeechRecognition | Notlar |
|---|---|---|
| Chrome / Edge / Opera | Tam destek | Ses, sunucu tabanlı tanıma motoruna gönderilir (çevrimiçi gerektirir) |
| Safari (macOS 14.1+, iOS 14.5+) | `webkitSpeechRecognition` önekiyle | İzin + dil paketi sonrası cihaz üzerinde çalışabilir |
| Firefox | Bayrak arkasında | `dom.webspeech.recognition.enable` varsayılan kapalı |

`SpeechSynthesis` tarafında destek çok daha tutarlı; neredeyse tüm modern tarayıcılar sesli okumayı destekliyor. Asıl kırılganlık `SpeechRecognition` tarafında — bu yüzden sesli giriş özelliğini "opsiyonel geliştirme" (progressive enhancement) olarak tasarlamak, tek zorunlu giriş yöntemi olarak sunmaktan çok daha güvenli.

## Ara sonuçlarla (interim results) çalışan bir örnek nasıl kurulur?

Aşağıdaki kod, kullanıcı konuşurken ekranda anlık olarak beliren, konuşma bittiğinde kesinleşen bir dikte alanı kuruyor:

```javascript
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

function startVoiceInput(onInterim, onFinal, onError) {
  if (!SpeechRecognition) {
    onError(new Error("SpeechRecognition desteklenmiyor"))
    return null
  }

  const recognition = new SpeechRecognition()
  recognition.lang = "tr-TR"
  recognition.interimResults = true
  recognition.continuous = false

  recognition.onresult = (event) => {
    let interim = ""
    let final = ""
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript
      if (event.results[i].isFinal) {
        final += transcript
      } else {
        interim += transcript
      }
    }
    if (interim) onInterim(interim)
    if (final) onFinal(final)
  }

  recognition.onerror = (event) => onError(new Error(event.error))
  recognition.start()
  return recognition
}
```

`interimResults: true` ayarı, kullanıcı konuşmayı bitirmeden önce geçici sonuçları göstermenizi sağlıyor — bu, kullanıcıya sistemin dinlediğine dair anlık geri bildirim veriyor ve sesli aramanın en önemli UX ayrıntılarından biri.

## İzinler ve diller nasıl yönetiliyor?

Mikrofon izni, `getUserMedia` ile aynı tarayıcı izin modelini paylaşıyor — kullanıcı bir kez izin verdikten sonra tarayıcı bunu site bazında hatırlıyor, ama izin reddedilirse `recognition.onerror` üzerinden `not-allowed` hatası dönüyor ve bunu yakalayıp kullanıcıya net bir mesaj göstermek gerekiyor. Dil seçimi `recognition.lang` alanıyla BCP 47 formatında yapılıyor (`tr-TR`, `en-US` gibi); tarayıcı, o dil için tanıma desteği sunmuyorsa sessizce boş sonuç dönebiliyor, bu yüzden desteklenen dil listesini önceden test etmek önemli.

## Erişilebilirlik açısından kazanç ve tuzaklar neler?

Kazanç net: motor becerisi kısıtlı kullanıcılar için sesli giriş, klavye veya dokunmatik etkileşime alternatif bir kanal sağlıyor. Ama tuzak da var — sesli girişi tek giriş yöntemi olarak sunmak, sessiz ortam gerektiren kullanıcıları (kütüphane, açık ofis) veya konuşma bozukluğu olan kullanıcıları dışlıyor. WCAG uyumlu bir form, sesli girişi her zaman klavye ve dokunmatik alternatifiyle birlikte sunmalı; genel erişilebilirlik kontrol listesini [Web Erişilebilirlik Kontrol Listesi (WCAG 2.2) yazımızda](/tr/posts/web-erisilebilirlik-kontrol-listesi) topladık.

## Ne zaman sunucu tarafı bir STT API'sine geçmelisiniz?

Kısa cevap: Doğruluk kritikse, birden çok dil aynı anda destekleniyorsa veya offline garanti gerekiyorsa. Web Speech API ücretsiz ve kurulumu basit ama doğruluk garantisi vermiyor — arka planda hangi motoru kullandığı tarayıcıya göre değişiyor ve geliştirici bunu kontrol edemiyor. Yüksek doğruluk gereken tıbbi, hukuki veya çoklu dil destekli senaryolarda özel bir STT API'si (Whisper tabanlı servisler gibi) daha öngörülebilir sonuç veriyor; bunun karşılığında maliyet ve gecikme (round-trip) artıyor.

Bize göre çoğu ürün için doğru strateji, önce Web Speech API ile hızlı bir prototip çıkarmak, kullanım verisiyle gerçek talebi ölçmek, ardından doğruluk sorun oluşturduğunda sunucu tarafı bir çözüme geçmek. Modern CSS özellikleriyle bu tür progressive enhancement kalıplarını [Modern CSS: :has() ve Yerel İç İçe Yazım yazımızda](/tr/posts/modern-css-has-ic-ice-yazim) da ele aldık — aynı "önce temel deneyimi garanti et, sonra geliştir" mantığı burada da geçerli.

## Metni sese çevirme (SpeechSynthesis) tarafında nelere dikkat etmeli?

`SpeechSynthesis` arayüzü, `speechSynthesis.getVoices()` ile mevcut sesleri listeliyor ve `SpeechSynthesisUtterance` nesnesiyle metni seslendiriyor. Buradaki en yaygın hata, sayfa yüklenir yüklenmez `getVoices()` çağırmak — bazı tarayıcılarda ses listesi asenkron yükleniyor ve ilk çağrıda boş dizi dönebiliyor. Doğru yaklaşım, `voiceschanged` olayını dinlemek:

```javascript
function loadVoices() {
  return new Promise((resolve) => {
    let voices = speechSynthesis.getVoices()
    if (voices.length) {
      resolve(voices)
      return
    }
    speechSynthesis.onvoiceschanged = () => {
      voices = speechSynthesis.getVoices()
      resolve(voices)
    }
  })
}
```

Bu, özellikle çok dilli bir uygulamada önemli — kullanıcının tarayıcısında o dile ait bir ses paketi yoksa `speak()` çağrısı sessizce hiçbir şey yapmayabilir; bu durumda kullanıcıya görsel bir metin alternatifi sunmak gerekiyor.

## Hangi gerçek kullanım senaryolarında sesli giriş kazandırıyor?

Üç senaryo net biçimde öne çıkıyor: arama kutuları (kullanıcı yazmak yerine konuşarak arama yapıyor), form doldurma (uzun metin alanlarına, özellikle mobilde, konuşarak dikte etme) ve erişilebilirlik odaklı kontrol arayüzleri (ellerin meşgul olduğu senaryolarda sesli komutla gezinme). Bunun dışında, tarayıcı uzantıları da sesli komutları sayfa içi eylemlere bağlamak için Web Speech API'yi kullanıyor; bu tür bir eklentiyi sıfırdan kurmayı [2026'da Tarayıcı Eklentisi Nasıl Yapılır yazımızda](/tr/posts/2026-tarayici-eklentisi-nasil-yapilir) anlattık.

Buna karşılık, sesli giriş her senaryoda kazandırmıyor: kısa, tek kelimelik girdiler (arama filtreleri, sayısal değerler) için konuşmak yazmaktan daha yavaş kalabiliyor — çünkü tanıma gecikmesi ve olası hata düzeltme adımı, birkaç tuşa basmaktan daha uzun sürüyor. Özelliği nereye ekleyeceğinize karar verirken bu eşiği göz önünde bulundurmak gerekiyor.

## Sesli girişi CSS ile nasıl görsel olarak besleriz?

Dinleme durumunu kullanıcıya göstermek, sesli arayüzün en kolay atlanan parçası. Mikrofon aktifken bir animasyon veya renk değişikliği göstermek için genellikle bir `is-listening` class'ı eklenir; bu class'ın stilini, sayfanın geri kalanındaki utility sınıflarıyla çakışmadan yönetmek isterseniz katmanlı bir CSS mimarisi işe yarıyor. Büyük stil dosyalarında bu tür durum sınıflarını nasıl çakışmasız yönettiğinizi [CSS @layer: Büyük Stil Dosyalarını Evcilleştir yazımızda](/tr/posts/css-cascade-layers-buyuk-stil) ayrıca ele aldık.

Görsel geri bildirim eksikliği, kullanıcı testlerinde en sık karşılaşılan şikayet: kullanıcılar mikrofonun çalışıp çalışmadığından emin olamadıkları için ya çok erken konuşmayı bırakıyor ya da aynı cümleyi birden fazla kez tekrarlıyor. Basit bir nabız animasyonu veya "dinliyorum..." metni bile bu belirsizliği büyük ölçüde ortadan kaldırıyor.

## Sıkça Sorulan Sorular

### Web Speech API tüm tarayıcılarda çalışıyor mu?

Kısa cevap: Hayır. Chrome, Edge ve Opera'da tam çalışıyor, Safari önekli sürümle destekliyor, Firefox'ta ise varsayılan olarak kapalı bir bayrağın arkasında duruyor — bu yüzden özelliği algılayıp (feature detection) fallback göstermek zorunlu.

### SpeechRecognition çevrimdışı çalışır mı?

Kısa cevap: Tarayıcıya bağlı. Chrome ses verisini işlenmek üzere bir sunucuya gönderdiği için internet gerektiriyor; Safari, kullanıcı izin verip dil paketini indirdikten sonra cihaz üzerinde çevrimdışı tanıma yapabiliyor.

### Mikrofon izni reddedilirse ne olur?

Kısa cevap: `recognition.onerror` üzerinden `not-allowed` hata koduyla bir olay tetiklenir; bu hatayı yakalayıp kullanıcıya izin ayarlarını nasıl değiştireceğini gösteren net bir mesaj sunmak gerekir.

### Sesli girişi hangi durumda kullanmamalıyım?

Kısa cevap: Doğruluğun kritik olduğu (tıbbi kayıt, hukuki belge) veya gürültülü ortamda kullanılacağı senaryolarda tek giriş yöntemi olarak sunmayın; bu durumlarda sunucu tarafı bir STT servisi ve her zaman bir klavye alternatifi gerekir.

**Kaynaklar:** [MDN — Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API), [MDN — Using the Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API), [MDN — SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition).
