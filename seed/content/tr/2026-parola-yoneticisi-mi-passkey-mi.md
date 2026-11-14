---
title: "2026'da Parola Yöneticisi mi, Passkey mi?"
slug: "2026-parola-yoneticisi-mi-passkey-mi"
translationKey: "password-managers-vs-passkeys-2026"
locale: "tr"
excerpt: "Kısa cevap: ikisi de gerekli. Passkey destekleyen her sitede passkey kullanın, parola yöneticinizi kapatmayın; 2026'da hâlâ ikisine ihtiyacınız var."
category: "technology"
tags: ["passkeys", "authentication", "privacy", "best-practices"]
publishedAt: "2026-11-14"
seoTitle: "Parola Yöneticisi mi, Passkey mi? 2026 Rehberi"
seoDescription: "Passkey, kimlik avına karşı parolalardan daha güvenli; ama 2026'da hâlâ bir parola yöneticisine ihtiyacınız var. Hangi hesapta hangisi, göçü nasıl yaparsınız?"
---

Kısa cevap: ikisine de ihtiyacınız var. Passkey destekleyen her sitede passkey kullanın; tasarımı itibarıyla kimlik avına karşı dayanıklı ve çalınacak bir parola yok. Ama parola yöneticiniz hâlâ eski sistemleri, paylaşımlı hesapları, güvenli notları ve iki faktörlü kodları kapsıyor; passkey bunlara dokunmuyor. Kasım 2026 itibarıyla ikisinden birini erken bırakmak ilerleme değil, boşluk yaratıyor.

Bu, "passkey kazandı" ya da "yönetici kazandı" demekten daha az tatmin edici bir cevap, ama veriler bunu doğruluyor. FIDO Alliance'ın kendi [State of Passkeys 2026 raporu](https://fidoalliance.org/the-state-of-passkeys-2026-global-consumer-and-workforce-report/), passkey farkındalığını yaklaşık %90'a, en az bir hesapta passkey açmış kullanıcı oranını da yaklaşık %75'e koyuyor — ama bu kişilerin çoğu, passkey henüz her girişe ulaşmadığı için parola yöneticisini de aynı anda çalıştırıyor.

## Passkey, parolalardan gerçekten daha mı güvenli?

Evet, yapısal olarak. Passkey, bir ortak anahtar çifti: özel yarı hiçbir zaman cihazınızdan veya senkronize anahtarlığınızdan çıkmıyor, kamuya açık yarı ise sitenin sunucusunda duruyor ve çalınacak bir sır içermiyor. Sahte bir site size taklit bir giriş sayfası gösterebilir, ama cihazınızın yanlış alan adına özel anahtarı teslim etmesini sağlayamaz; tarayıcı giriş teklif etmeden önce alan adını kontrol ediyor. Çalınan bir parola ise yazıldığı her yerde işe yarıyor; kimlik bilgisi doldurma (credential stuffing) saldırılarının varlık sebebi tam olarak bu.

## Passkey gerçekte nasıl çalışıyor?

Passkey, parolanızı ve ikinci faktör kodunuzu, cihazınıza ve sitenin tam alan adına bağlı tek bir kriptografik kanıtla değiştiriyor. Bir passkey kaydettiğinizde telefonunuz, bilgisayarınız veya güvenlik anahtarınız WebAuthn/FIDO2 standardını kullanarak bir anahtar çifti üretiyor; sonraki girişte cihazınız özel anahtarı tuttuğunu kanıtlıyor, bunu da zaten cihaz kilidini açmak için kullandığınız parmak izi, yüz taraması veya PIN ile yapıyor.

İki türü var ve bu farkın tüm karar üzerinde etkisi var:

- **Cihaza bağlı passkeyler** sadece tek bir fiziksel cihazda yaşıyor (donanım güvenlik anahtarlarında yaygın). Cihazı kaybederseniz passkey'i de kaybedersiniz, senkronizasyon yok.
- **Senkronize passkeyler** bulut anahtarlığında yaşıyor — iCloud Anahtarlığı, Google Şifre Yöneticisi veya Bitwarden, 1Password gibi bir parola yöneticisi — ve aynı hesaba giriş yaptığınız diğer cihazlarda yeniden beliriyor.

2025'ten sonra oluşturulan tüketici passkeylerinin çoğu varsayılan olarak senkronize; bu da passkey'in neden bir parola yöneticisinin otomatik doldurma özelliğinin yerini alıyormuş gibi hissettirdiğini açıklıyor. Kendi hesaplarınızda adım adım kurulum için [pratik passkey rehberimize](/tr/posts/passkey-gecis-rehberi) bakabilirsiniz; WebAuthn ve FIDO2'nin protokol düzeyindeki ayrıntıları için [geliştirici rehberimiz](/tr/posts/passkey-webauthn-rehberi) daha uygun.

## 2026'da hâlâ bir parola yöneticisine ihtiyacınız var mı?

Evet, passkey güvenliğiyle hiç ilgisi olmayan dört somut nedenden ötürü. Her hafta kullandığınız birçok site hâlâ passkey girişi sunmuyor ve bunların her biri için güçlü, benzersiz bir parola üretip saklamanın tek mantıklı yolu hâlâ bir parola yöneticisi. Özellikle şunlar için hâlâ gerekli:

- **Passkey seçeneği olmayan eski siteler.** Çoğu küçük SaaS aracı, eski bankacılık portalları ve şirket içi sistemler henüz WebAuthn desteği sunmadı.
- **Paylaşımlı ve ekip hesapları.** Paylaşımlı bir yayın platformu hesabı veya bir ekibin sosyal medya girişi, tek bir cihazın passkey'ine temiz şekilde sığmıyor; yöneticinin paylaşımlı kasa özelliği sığıyor.
- **Güvenli notlar ve diğer sırlar.** Wi-Fi parolaları, yazılım lisans anahtarları ve kimlik taramaları hâlâ şifrelenmiş bir yer istiyor.
- **TOTP ve yedek kodlar.** Passkey parolaların yerini alıyor, her iki faktörlü yöntemin değil; henüz passkey'e geçmemiş servislerin doğrulayıcı kodları hâlâ bir yerde saklanmak zorunda.

## Parola yöneticim passkey de saklayabilir mi?

Evet — büyük parola yöneticilerinin çoğu 2024-2026 arasında passkey saklama özelliği ekledi, dolayısıyla çoğu kişi için "parola yöneticisi mi, passkey mi" çerçevesi başından yanlış bir ikilem. 1Password, Bitwarden ve Dashlane, parolalarınızla aynı kasaya bir passkey kaydetmenize izin veriyor; otomatik doldurma, sitenin istediğine göre bir passkey veya bir parola öneriyor. Yani belirli bir site için passkey'e geçmek, yöneticinizi terk etmek anlamına gelmiyor — yöneticinizin o tek giriş için artık farklı bir kimlik bilgisi türü sakladığı anlamına gelebilir.

Taşınabilirlik tablosu 2026'da ciddi şekilde iyileşti. Bitwarden'ın FIDO Alliance'ın Credential Exchange Protocol'ünü uygulamaya alması Android'e ulaştı, böylece [Bitwarden'da saklanan passkeyler artık hem iOS hem Android'de başka passkey yöneticilerine taşınabiliyor](https://bitwarden.com/blog/security-vendors-join-forces-to-make-passkeys-more-portable-for-everyone/); tek bir satıcıya sonsuza kadar kilitlenmek yerine. Bu taşınabilirlik çalışması, "satıcı kilitlenmesi" kaygısının 2024'e göre bugün neden daha küçük bir sorun olduğunu açıklıyor; ama her yerde çözülmüş değil, aşağıda bakacağız.

| | Parola yöneticisi (parola) | Passkey |
|---|---|---|
| Kimlik avına dayanıklılık | Zayıf — ikna edici bir sahte sayfa parolayı yine de yakalayabilir | Güçlü — gerçek alan adına bağlı, sahte sitede girilemiyor |
| Eski/küçük sitelerde çalışır mı | Evet, neredeyse evrensel | Sadece site WebAuthn desteği eklediyse |
| Cihazlar arası kurtarma | Yöneticinin kendi bulut senkronu + ana parola | Senkronize passkey: evet, platform anahtarlığı veya yönetici üzerinden; cihaza bağlı: hayır |
| Paylaşımlı/ekip erişimi | Yerleşik paylaşımlı kasalar | Zor — bir kimlik bilgisini kişiler arasında paylaşmak için tasarlanmadı |
| 2FA kodu ve not saklar mı | Evet | Hayır — passkey sadece giriş adımının yerini alıyor |

## Passkey'imi taktığım cihazı kaybedersem ne olur?

Passkey'iniz bulut anahtarlığına senkronize edildiyse, onu başka herhangi bir senkronize kimlik bilgisini kurtardığınız gibi kurtarırsınız: Apple ID'nize, Google hesabınıza veya parola yöneticinize yeni bir cihazda giriş yapın, passkey yeniden belirir. Eğer cihaza bağlı bir passkey'se — bazı donanım güvenlik anahtarlarının ve eski uygulamaların oluşturduğu türden — cihazı kaybetmek o belirli kimlik bilgisini de kaybetmek anlamına gelir ve sitenin sunduğu hesap kurtarma yöntemine geri dönersiniz; bu da genellikle passkey'in kendisinden daha zayıftır.

Bu, parola yöneticisi hesabınızı kurtarma çapınız olarak tutmanın gerçek gerekçesi: 1Password örneğin kasa kurtarmasını hâlâ Secret Key'inize ve hesap parolanıza bağlıyor (bireysel kullanıcılar için acil durum kiti, işletme hesapları için yönetici kurtarması), bu da tek bir cihazın hayatta kalmasına bağlı olmayan belgelenmiş bir yedek sunuyor.

## Hangi hesaplarımı önce passkey'e geçirmeliyim?

Kimlik avına uğrarsa en çok zarar verecek hesaplardan başlayın: birincil e-postanız, parola yöneticinizin kendi hesap girişi (passkey destekliyorsa), bankanız ve diğer her şeyin hesap kurtarmasına bağlı olan hesap. Bunlar genelde en iyi passkey desteğine sahip hesaplar da, çünkü büyük platformlar WebAuthn'ı en erken gönderdi. Oradan aşağı inin — sosyal medya, alışveriş siteleri, yayın hizmetleri — her biri destek ekledikçe; passkey henüz desteklemeyen her şeyi olduğu yerde bırakın: parola yöneticinizde, güçlü, benzersiz, yönetici tarafından üretilmiş bir parolayla.

Bir passkey eklediğiniz anda eski parolanızı silmeyin, site sizi zorlamıyorsa. İkisini de birkaç hafta aktif tutun; hiçbir maliyeti yok ve passkey senkronu yeni bir cihazda sorun çıkarırsa size bir yedek sağlar. Kimlik doğrulamanın ötesinde cihaz ve hesap güvenliğini genel olarak sıkılaştırmak istiyorsanız [teknoloji kategorimizdeki](/tr/category/teknoloji) diğer rehberlere de göz atabilirsiniz.

Dürüst görüşüm şu: "2026'da parolasız dünya" fazla pazarlandı. FIDO Alliance'ın rakamları — %90 farkındalık, %75'in en az bir passkey denemesi — bitmiş bir göç gibi görünüyor, ama Descope'un aynı rapora dair analizi, bir passkey sunulduğunda insanların yalnızca yaklaşık %49'unun "çoğu zaman" kullandığını buldu; bu bir deneme oranı, bir benimseme oranı değil. 2026'nın gerçek hikâyesi, hakikaten iyi çalışan melez bir yığın, parolasız bir dünya değil.

## Sıkça Sorulan Sorular

### Passkey, parola yöneticisinden daha mı güvenli?

Passkey, giriş adımının kendisi için parolalardan daha güvenli; çünkü sızdırılmış bir parola gibi kimlik avına uğratılamaz veya sitelerde tekrar kullanılamaz. Ama parola yöneticisi rakip bir güvenlik katmanı değil — passkeylerinizin çoğunun, henüz destek sunmayan siteler için parolalarınızla birlikte yaşadığı yer.

### Aynı parola yöneticisini Apple, Google ve Windows cihazlarında kullanabilir miyim?

Evet, parola tarafı için — 1Password, Bitwarden ve benzer yöneticiler iOS, Android, macOS, Windows ve Linux'ta özel uygulamalar ve tarayıcı eklentileriyle çalışıyor. Aynı ekosistemler arasında passkey taşınabilirliği, Credential Exchange Protocol sayesinde 2024'e göre daha iyi; ama bir platformun yerel anahtarlığından başka birine passkey taşımak Kasım 2026 itibarıyla hâlâ kısmi, evrensel değil.

### Passkeylerimin olduğu telefonu kaybedersem ne olur?

Passkeyler senkronize edildiyse (2025'ten sonraki çoğu tüketici kurulumunda varsayılan), aynı bulut hesabına — iCloud Anahtarlığı, Google Şifre Yöneticisi veya parola yöneticiniz — yeni bir cihazda giriş yaparak kurtarılabilir. Cihaza bağlıysa, o belirli passkey gitmiştir ve sitenin ayrı hesap kurtarma sürecini kullanmanız gerekir.

### Passkey kurduktan sonra parolalarımı silmem gerekiyor mu?

Hayır. Geçiş yaptıktan sonra parolayı passkey'inizin arkasında birkaç hafta aktif tutun, özellikle önemli hesaplar için; çünkü bir passkey yeni bir cihaza senkronize olmazsa veya bir uygulama her platformda passkey desteğini henüz tamamlamadıysa işleyen bir yedek görevi görür.
