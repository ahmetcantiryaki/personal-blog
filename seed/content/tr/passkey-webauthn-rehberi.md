---
title: "Passkey ve WebAuthn: Geliştirici Rehberi"
slug: "passkey-webauthn-rehberi"
translationKey: "passkeys-webauthn-guide"
locale: "tr"
excerpt: "Uygulamalı passkey WebAuthn rehberi: seremoni nasıl işler, SimpleWebAuthn v13 ile tam kayıt ve giriş akışı ve üretimde patlayan uç durumlar."
category: "web-development"
tags: ["authentication", "web-security", "frontend", "passkeys"]
publishedAt: "2026-07-03"
seoTitle: "Passkey ve WebAuthn: Geliştirici Rehberi (2026)"
seoDescription: "2026 için uygulamalı passkey WebAuthn rehberi: istek-yanıt seremonisi, SimpleWebAuthn v13 ile tam kayıt ve giriş akışı ve üretim tuzakları."
---

Bu Mayıs, Dünya Passkey Günü'nde FIDO Alliance rakamı koydu: [State of Passkeys 2026 raporuna](https://fidoalliance.org/the-state-of-passkeys-2026-global-consumer-and-workforce-report/) göre Temmuz 2026 itibarıyla 5 milyar passkey aktif kullanımda, tüketicilerin %75'i en az bazı hesaplarında passkey'i açmış durumda ve %49'u bir site sunduğunda düzenli olarak passkey'e uzanıyor. Parolalar planlanan takvimde ölmedi ama eğri nihayet dikleşti.

Bu passkey WebAuthn rehberi seni sıfırdan çalışan, oltalamaya dayanıklı bir girişe götürüyor. Passkey, parolanın yerini alan kriptografik kimlik bilgisidir; WebAuthn ise bu kimliği oluşturmak ve kullanmak için çağırdığın tarayıcı API'sidir. Açık anahtarı sen tutarsın, özel anahtarı kullanıcının cihazı tutar ve sunucunda bir saldırganın çalabileceği ya da oltalayabileceği hiçbir şey kalmaz.

Daha önce OAuth veya sihirli bağlantı (magic link) kurduysan bu sana tanıdık gelecek. Zihinsel model iki mesajlık bir istek–yanıt akışı; işin çoğu kriptografi değil, kayıt tutma.

## Passkey nedir ve WebAuthn ile ilişkisi nedir?

Passkey, bir sitenin origin'ine bağlı, açık/özel anahtar çiftiyle desteklenen bir FIDO2 kimlik bilgisidir. WebAuthn (Web Authentication), bu anahtar çiftini `navigator.credentials` üzerinden oluşturan ve kullanan W3C tarayıcı API'sidir. Özel anahtar kullanıcının doğrulayıcısından (authenticator) hiç çıkmaz; sunucun yalnızca açık anahtarı görür ve saklar.

Terimler sık karıştığı için netleştirelim:

- **WebAuthn**, tarayıcıya bakan API'dir (`navigator.credentials.create` ve `.get`).
- **CTAP2**, tarayıcı ile telefon veya YubiKey gibi bir doğrulayıcı arasındaki protokoldür.
- **FIDO2**, ikisini de kapsayan şemsiye terimdir.
- **Passkey**, *keşfedilebilir* (discoverable) bir WebAuthn kimliğidir; genelde iCloud Keychain, Google Password Manager ya da 1Password veya Bitwarden gibi bir yöneticiyle kullanıcının cihazları arasında senkronlanır.

Passkey'i yaygınlaştıran şey tam da bu senkron kısmı oldu. Eski WebAuthn kimlikleri cihaza bağlıydı; cihazı kaybetmek hesabı kaybetmek demekti. Senkron passkey'ler bu uçurumu ortadan kaldırdı ve WebAuthn'ı kurumsal bir ikinci faktörden herkes için birincil giriş yöntemine çevirdi. Standart da hâlâ hareket halinde: W3C, bu rehberin dayandığı yeni yüzeyi resmileştiren [WebAuthn Level 3](https://www.w3.org/TR/webauthn-3/) Candidate Recommendation'ını 13 Ocak 2026'da yayımladı.

## Passkey ile kimlik doğrulama nasıl çalışır?

Passkey doğrulaması bir istek–yanıt seremonisidir. Sunucun rastgele bir challenge üretir, doğrulayıcı kullanıcıyı doğruladıktan sonra (Face ID, parmak izi ya da PIN) bunu özel anahtarla imzalar ve sunucun imzayı saklanan açık anahtara karşı doğrular. Kablodan tekrar kullanılabilir hiçbir şey geçmez; passkey'lerin oltalama ve kimlik bilgisi doldurmaya (credential stuffing) dayanıklı olmasının sebebi budur.

Baştan sona giriş akışı:

1. Kullanıcı **Giriş yap**'a tıklar (ya da otomatik doldurma etkin bir alana odaklanır).
2. Sunucun rastgele bir **challenge** üretir ve relying party ID ile birlikte döner.
3. Tarayıcı bu challenge ile `navigator.credentials.get()` çağırır.
4. Doğrulayıcı kullanıcıdan biyometri veya PIN ile doğrulama ister.
5. Doğrulayıcı challenge'ı özel anahtarla imzalar ve bir **assertion** döner.
6. Tarayıcı assertion'ı JavaScript'ine geri verir.
7. Sunucun credential ID ile saklanan açık anahtarı bulur.
8. Sunucun imzayı, origin'i ve challenge'ı doğrular.
9. Sunucun klonlanmış doğrulayıcıyı yakalamak için **imza sayacını** kontrol eder.
10. Başarılıysa her zamanki gibi oturum açarsın.

Kayıt bunun aynadaki yansımasıdır: sunucu oluşturma seçeneklerini gönderir, `navigator.credentials.create()` anahtar çiftini üretir ve dönen açık anahtar ile credential ID'yi kullanıcıya bağlayıp saklarsın. Bu credential ID her girişte arama anahtarındır; dolayısıyla indeksle — [veritabanı indeksleme rehberimizdeki](/tr/posts/veritabani-indeksleme) disiplinin aynısı.

## Passkey, parola ve OTP: hangisini seçmelisin?

Çoğu tüketici ve SaaS girişinde passkey hem güvenlik hem sürtünme açısından kazanır. Parolalar oltalanabilir ve tekrar kullanılır; SMS OTP oltalanabilir ve SIM takasına açıktır; TOTP uygulamaları oltalamaya daha dayanıklıdır ama kullanıcıya hâlâ manuel iş yükler. Passkey paylaşılan sırrı tamamen kaldırır; dolayısıyla bir ihlalde ele geçirilecek, tekrar oynatılacak ya da sızacak hiçbir şey yoktur.

| Faktör | Parola | SMS OTP | TOTP uygulaması | Passkey |
|--------|--------|---------|-----------------|---------|
| Oltalamaya dayanıklı | Hayır | Hayır | Kısmen | **Evet** |
| Sunucu sır saklar | Evet (hash) | Hayır | Evet (seed) | **Hayır (yalnızca açık anahtar)** |
| Veritabanı ihlalinde dayanır | Hayır | – | Hayır | **Evet** |
| Kullanıcı sürtünmesi | Orta | Orta | Yüksek | **Düşük (biyometri)** |
| Cihazlar arası çalışır | Evet | Evet | Manuel | **Evet (senkron)** |

Tek dürüst ödünleşim: passkey'ler kullanıcının platform ekosistemine ve hesap kurtarmaya bağlıdır. Benimseme yükselene kadar bir yedek giriş yolu bırak ve hesap kurtarmayı sonradan eklenen bir detay değil, birinci sınıf bir akış olarak ele al.

## WebAuthn ile passkey'i nasıl uygularsın?

Kriptografiyi kendin yazma. CBOR ayrıştırma, attestation ve origin kontrollerini üstlenen, bakımı sürdürülen bir kütüphane kullan. Node tarafında [SimpleWebAuthn](https://simplewebauthn.dev/docs/packages/server) kullanıyoruz (`@simplewebauthn/server`, Temmuz 2026 itibarıyla 13.3.2'de); Python karşılığı `py_webauthn`, JVM tarafında ise `webauthn4j` var. Aşağıda her iki seremoninin de çekirdeği SimpleWebAuthn ile.

### Kayıt (passkey oluşturma)

```ts
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
} from '@simplewebauthn/server';

// 1. Sunucu: seçenekleri üret ve challenge'ı oturumda sakla
const options = await generateRegistrationOptions({
  rpName: 'Woyable',
  rpID: 'woyable.com',
  userName: user.email,
  attestationType: 'none',
  authenticatorSelection: {
    residentKey: 'required',      // keşfedilebilir passkey yapar
    userVerification: 'preferred',
  },
});
req.session.challenge = options.challenge;

// 2. Sunucu: tarayıcının döndürdüğünü doğrula
const verification = await verifyRegistrationResponse({
  response: bodyFromClient,
  expectedChallenge: req.session.challenge,
  expectedOrigin: 'https://woyable.com',
  expectedRPID: 'woyable.com',
});

if (verification.verified) {
  const { credential } = verification.registrationInfo;
  await db.saveCredential({
    userId: user.id,
    credentialId: credential.id,
    publicKey: credential.publicKey,   // parola değil, bunu sakla
    counter: credential.counter,
  });
}
```

İstemcide `options`'ı `@simplewebauthn/browser` içindeki `startRegistration()`'a geçir ve sonucu geri POST et.

### Koşullu arayüzle (otomatik doldurma) kimlik doğrulama

En iyi passkey deneyimi **koşullu arayüzdür** (conditional UI): tarayıcı passkey'leri doğrudan kullanıcı adı alanının otomatik doldurma listesinde gösterir, böylece geri dönen kullanıcı hiçbir şey yazmaz. Bunu etkinleştirmek için alana `autocomplete="username webauthn"` ekle ve sayfa yüklenirken `startAuthentication({ ..., useBrowserAutofill: true })` çağır. Bu liste klavye ve ekran okuyucuyla sürüldüğü için, yardımcı teknolojide sessizce kırılmaması adına [web erişilebilirlik kontrol listemize](/tr/posts/web-erisilebilirlik-kontrol-listesi) göre bağla.

```ts
import {
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';

const options = await generateAuthenticationOptions({
  rpID: 'woyable.com',
  userVerification: 'preferred',
  // boş allowCredentials => keşfedilebilir passkey'ler seçiciyi yönetir
});
req.session.challenge = options.challenge;

const verification = await verifyAuthenticationResponse({
  response: bodyFromClient,
  expectedChallenge: req.session.challenge,
  expectedOrigin: 'https://woyable.com',
  expectedRPID: 'woyable.com',
  credential: storedCredential,
  requireUserVerification: true,
});

if (verification.verified) {
  await db.updateCounter(storedCredential.id, verification.authenticationInfo.newCounter);
  createSession(user);
}
```

Oturumun sonrasında nereye oturduğu, sunucu tarafında render ediyorsan önemli; [React Server Components rehberimiz](/tr/posts/nextjs-react-server-components) o çerezi istemci bileşenlerine sızdırmadan okumayı anlatıyor.

## Üretimde bizde ne patladı ve nasıl düzelttik?

Passkey'i yayına alırken üç şey bizi ısırdı ve hiçbiri mutlu-yol eğitimlerinde yoktu.

- **`rpID` / origin uyuşmazlığı.** `rpID`, origin'in kaydedilebilir bir son eki değilse WebAuthn her şeyi sessizce reddeder. Staging kutumuz bir `*.vercel.app` önizleme URL'sinde çalışıyordu; `preview-abc.vercel.app` üzerinde oluşturulan kimlikler `woyable.com`'da işe yaramıyordu. Çözüm: önizleme dışındaki her ortamda `rpID`'yi gerçek apex alan adına sabitle. Tek bir passkey'i kardeş alan adlarında gerçekten kullanman gerekiyorsa Related Origin Requests'i kullan — bir `.well-known/webauthn` izin listesi; Firefox 152 Mayıs 2026'da destek verince artık her büyük motorda çalışıyor.
- **Localhost çalıştı, HTTP staging çalışmadı.** WebAuthn güvenli bağlam (secure context) ister. `localhost` muaf tutulduğu için her şeyin çalıştığı yanılgısına düşürür; ilk HTTP-only staging dağıtımı `NotAllowedError` döndürdü. Çözüm: localhost dışındaki her ortamı istisnasız HTTPS üzerinden sun.
- **Cihaz sıfırlamasından sonra sahipsiz kalan kimlikler.** Telefonunu sıfırlayan kullanıcılarda ölü credential ID'ler kaldı ve giriş açıklamasız biçimde başarısız oldu. Çözüm: platformun tanımadığın kimlikleri budaması için WebAuthn **Signal API**'sini (`signalUnknownCredential` ve `signalAllAcceptedCredentials`) benimse ve her zaman çalışan bir e-posta yedeği tut.

Signal API hâlâ dengesiz inen tek parça. Yeni WebAuthn yüzeyinin Temmuz 2026 itibarıyla durumu şöyle:

| Özellik | Chrome / Edge | Safari | Firefox |
|---------|---------------|--------|---------|
| Çekirdek WebAuthn + senkron passkey | Evet | Evet | Evet |
| Koşullu arayüz (autofill) | Evet | Evet | Evet |
| Related Origin Requests | 128+ | 18+ | 152+ (Mayıs 2026) |
| Signal API | Masaüstü + Android | 26+ | Henüz yok |

Dürüst görüşüm: passkey'i şimdi yayına al ama Signal API'yi bir garanti değil, aşamalı iyileştirme olarak gör. Tarayıcı sustuğunda sunucu tarafı budaman ve e-posta yedeğin hâlâ çalışmak zorunda.

## Sıkça Sorulan Sorular

### Passkey'ler sunucumda mı saklanır?

Hayır. Yalnızca **açık anahtarı** ve bir credential ID'yi saklarsın. Özel anahtar kullanıcının doğrulayıcısının içinde, senkron passkey'lerde de platform keychain'inin içinde kalır. Bir veritabanı ihlali, saldırganın giriş yapabileceği hiçbir şeyi açığa çıkarmaz; passkey WebAuthn kurulumunun bütün amacı da budur.

### Passkey'ler farklı cihaz ve tarayıcılarda çalışır mı?

Evet, iki yolla. Senkron passkey'ler aynı ekosistemdeki (Apple, Google ya da bir parola yöneticisi) cihazlar arasında otomatik dolaşır. Ekosistemler arası girişte ise WebAuthn'ın hibrit taşıması (hybrid transport), kullanıcının bir QR kod okutup yakındaki telefonuyla Bluetooth yakınlığı üzerinden onay vermesini sağlar; hiçbir şey kurmadan.

### Kullanıcı cihazını kaybederse ne olur?

Senkron passkey'ler bulut keychain'inde yaşadığı için, yalnızca kaybolan cihazda değil, dayanıklı kalır; yeni telefon girişte onları geri yükler. Cihaza bağlı passkey'ler (donanım anahtarı gibi) senkronlanmaz; bu yüzden kullanıcıların birden fazla kimlik kaydetmesine izin ver ve e-posta doğrulaması gibi bir kurtarma yolu sun.

### Attestation ile uğraşmam gerekir mi?

Genelde hayır. Tüketici uygulamaları için `attestationType: 'none'` ayarla; attestation gizlilik sürtünmesi ekler ve karşılığında az şey kazandırır. Yalnızca bir uyumluluk rejimi ya da kurumsal politika, doğrulayıcının tam modelinin kanıtını istediğinde attestation talep et ve bunu yaparsan güvenilir kök listesini sürdürmeye hazır ol. Ön yüz konularının daha geniş haritası için [web geliştirme yazılarımıza](/tr/category/web-gelistirme) göz at.
