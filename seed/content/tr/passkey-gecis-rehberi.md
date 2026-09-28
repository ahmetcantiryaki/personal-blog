---
title: "Şifreleri Bırak: Passkey'e Geçiş Rehberi"
slug: "passkey-gecis-rehberi"
translationKey: "passkeys-everyday-guide-2026"
locale: "tr"
excerpt: "2026'da dünya genelinde 5 milyar passkey kullanımda, insanların yüzde 75'i en az bir hesapta passkey açmış; Google, Apple ve Microsoft'ta nasıl açılır burada."
category: "technology"
tags: [passkeys, authentication, privacy, web-security]
publishedAt: "2026-09-28"
seoTitle: "2026'da Passkey Nasıl Kullanılır: Pratik Rehber"
seoDescription: "2026'da dünya genelinde 5 milyar passkey aktif kullanımda. Passkey tam olarak ne, Google, Apple ve Microsoft'ta nasıl açılır, telefonu kaybederseniz ne olur?"
---

Kısa cevap: Passkey, şifrenizin yerine cihazınıza bağlı, parmak izinizle, yüzünüzle veya ekran kilidinizle açılan bir kriptografik anahtar çifti koyar — hesap güvenlik ayarlarınızdan bir kez açarsınız, sonrasında giriş yapmak bir şifreyi yazıp hatırlamak yerine tek bir dokunuş olur. 2026 itibarıyla dünya genelinde tahmini 5 milyar passkey zaten aktif kullanımda.

## Şu anda gerçekte kaç kişi passkey kullanıyor?

FIDO Alliance'ın World Passkey Day 2026 raporu, on ülkede 11.000 tüketici ve 1.400 kurumsal karar vericiyle yapılan ankete dayanarak passkey farkındalığını yüzde 90 olarak veriyor ve insanların yüzde 75'inin en az bir hesapta passkey açtığını söylüyor. Düzenli kullanım — yani insanların bir şifreye geri dönmek yerine sunulduğunda gerçekten passkey seçeneğini seçmesi — yüzde 49'da duruyor.

Kurumsal tarafta, kuruluşların yüzde 68'i çalışan girişleri için passkey'i devreye almış veya devreye alıyor, yüzde 82'si tüm iş gücünde tamamen şifresiz hale gelmenin nihai hedefleri olduğunu söylüyor — ama yalnızca yüzde 28'i buna şu an ulaştığını söylüyor. Niyet ile tamamlanma arasındaki bu boşluk, bu büyüklükte bir güvenlik geçişi için normal: yeni girişler için passkey açmak hızlı, ama her eski sistemde şifreleri emekliye ayırmak daha yavaş kısım.

| Ölçüt (World Passkey Day 2026) | Tüketiciler | Kurumlar |
|---|---|---|
| Farkındalık / niyet | %90 passkey'in farkında | %82 tam şifresizliği istiyor |
| En az birini açmış | %75 | %68 devrede veya devreye alıyor |
| Düzenli / tamamlanmış kullanım | %49 düzenli kullanıyor | %28 bugün tamamen şifresiz |

## Passkey sade dille tam olarak nedir?

Passkey iki kriptografik anahtardan oluşur: cihazınızdan hiç ayrılmayan özel bir anahtar ve giriş yaptığınız web sitesi veya uygulama tarafından saklanan genel bir anahtar. Giriş yaptığınızda, cihazınız — genelde önce parmak izinizi, yüzünüzü veya cihaz PIN'inizi kontrol ederek — özel anahtara sahip olduğunu kanıtlar; bir sunucunun saklayacağı, yanlış yöneteceği veya bir ihlalde çaldırabileceği bir şifreyi asla internete göndermez.

Şifrelere karşı temel güvenlik kazancı bu: bir şirketin sunucusunda sızdırılabilecek paylaşılan bir sır oturmuyor. Çalınan bir şifre veritabanı passkey'lere karşı işe yaramaz, çünkü içinde çalınacak bir şifre baştan yok — yalnızca cihazınıza kilitli eşleşen özel anahtar olmadan değersiz kalan genel anahtarlar var.

## Google, Apple ve Microsoft hesaplarında passkey nasıl açılır?

Kurulum üçünde de neredeyse aynı, çünkü hepsi aynı temel WebAuthn/FIDO2 standardını uyguluyor. Google hesabı için Google Hesabı güvenlik ayarlarına gidin, "Passkey'ler ve güvenlik anahtarları"nı bulun ve bir tane oluşturmak için yönergeyi takip edin — telefonunuzun veya bilgisayarınızın mevcut ekran kilidini kullanır. Apple ID için passkey'ler, güncel bir iPhone veya Mac'te varsayılan olarak iCloud Anahtar Zinciri'ne gömülü; genelde ayrı bir kurulum yapmazsınız, bir uygulama veya site ilk kez passkey ile giriş sunduğunda yönergeyi kabul edersiniz. Microsoft hesabı için Microsoft hesap güvenlik sayfanıza gidin, "Gelişmiş güvenlik seçenekleri"ni seçin ve aynı şekilde bir passkey ekleyin — Windows Hello, telefonunuz veya bir güvenlik anahtarı üzerinden.

Üçünde de model aynı: hatırlayacağınız yeni bir şifre seçmiyorsunuz, cihazınıza bir anahtar tutma yetkisi veriyorsunuz ve zaten her gün kullandığınız bir şeyle — parmak iziniz, yüzünüz veya ekran PIN'inizle — kilidini açıyorsunuz.

## Passkey'ler gerçekten cihazlarınız arasında senkronize oluyor mu?

Evet, aynı ekosistem içinde, ve "telefonu kaybetme" korkusu büyük ölçüde burada kendiliğinden çözülüyor. iPhone'unuzda oluşturulan bir passkey, iCloud Anahtar Zinciri üzerinden Mac'inize ve iPad'inize senkronize olur; Google hesabınız üzerinden oluşturulan bir passkey, Google Şifre Yöneticisi üzerinden Android cihazlarınıza ve Chrome'a senkronize olur. Ekosistemler arası senkronizasyon — iPhone'da oluşturulan bir passkey'i bir Windows bilgisayarda giriş için kullanmak — genelde çalışır da, ama farklı bir mekanizma üzerinden: passkey'in kendisi kopyalanmaz, telefonunuz diğer cihazda gösterilen bir QR kodu okutarak Bluetooth üzerinden bir doğrulayıcı gibi davranır.

Passkey'lere her yerde güvenmeden önce anlamaya değer ayrıntı bu: bir sağlayıcının ekosistemi içinde senkronizasyon sorunsuz, ama platformlar arası akış telefonunuzun yakında olmasına ve Bluetooth'unun açık olmasına bağlı — bunu, acele ettiğiniz gerçek bir girişte keşfetmek yerine bir kez, bilerek test etmeye değer.

## Telefonunuzu kaybederseniz ne olur?

Bu, birçok kişiyi passkey'e tam geçiş yapmaktan alıkoyan korku ve doğrudan ele almaya değer: passkey'leriniz iCloud Anahtar Zinciri veya Google Şifre Yöneticisi üzerinden senkronize edildiyse, aynı bulut hesabına yeni bir cihazda tekrar giriş yaparak kurtarılabilirler — passkey'ler kaybolmaz, fotoğraflarınız veya kişileriniz gibi yedeklenir. Gerçek risk telefonu kaybetmek değil; passkey'lerin senkronize edildiği bulut hesabına erişimi kaybetmek — bu yüzden passkey öncelikli bir kullanıma geçtiğinizde o hesabın kendi kurtarma seçenekleri (yedek e-posta, kurtarma telefon numarası veya donanım güvenlik anahtarı) her zamankinden daha önemli hale geliyor.

Bulut senkronizasyonundan daha sağlam bir güvence isteyen herkes için — gazeteciler, güvenlik araştırmacıları veya son derece hassas hesapları yönetenler — aynı hesapta ikinci, bağımsız bir passkey olarak fiziksel bir donanım güvenlik anahtarı standart tavsiye: hiçbir bulut sağlayıcısının erişilebilir kalmasına bağlı olmayan bir yedek. Kimliği yalnızca bireysel hesaplar için değil altyapı düzeyinde de bu şekilde düşünen ekipler için, aynı "ağı değil, cihazı ve kimliği doğrula" mantığını iç sistemlere uygulayan [küçük ekipler için sıfır güven ağı rehberimize](/tr/posts/kucuk-ekip-sifir-guven-ag-tailscale) de bakabilir.

## Ne zaman hâlâ bir şifreyi yedek olarak tutmalısınız?

Passkey destekleyen neredeyse her büyük platform hâlâ bir şifre veya ikincil bir kurtarma yöntemini etkin tutmanıza izin veriyor ve çoğu insan için geçiş döneminde şifreleri tamamen silmek yerine bu doğru tercih. Bir şifre zayıf, tekrar kullanılan veya oltalanabilir olduğunda gerçek bir yük haline gelir — passkey üçünü de aynı anda ortadan kaldırır — ama henüz passkey desteklemeyen az sayıdaki site için veya hesap kurtarma senaryoları için belgelenmiş bir yedek olarak güçlü, benzersiz bir şifreyi tutmak bir güvenlik hatası değil. Hesaplarınız genelinde bunu daha kapsamlı kuruyorsanız, [tamamen şifresiz hale gelme üzerine daha derin rehberimiz](/tr/posts/sifresiz-hayat-passkey-2026) bu daha geniş geçişi ele alıyor; passkey ile girişi yalnızca kullanan değil kendiniz uygulayan bir geliştiriciyseniz, [WebAuthn ve passkey uygulama rehberimiz](/tr/posts/passkey-webauthn-rehberi) teknik tarafı kapsıyor.

Hâlâ izlemeye değer siteler ve uygulamalar, henüz hiç passkey seçeneği olmayanlar — bunlar için güçlü, benzersiz bir şifre üreten ve saklayan bir şifre yöneticisi doğru araç olmaya devam ediyor, tam olarak çünkü passkey'ler 5 milyar aktif kullanıma rağmen henüz evrensel değil.

## Sıkça Sorulan Sorular

### Passkey nedir?

Passkey, şifrenin yerini alan, cihazınıza bağlı kriptografik bir kimlik bilgisidir: özel anahtar cihazınızda kalır, genel anahtar giriş yaptığınız hizmette saklanır ve herhangi bir şey yazmak yerine parmak izinizle, yüzünüzle veya ekran kilidinizle açarsınız.

### Passkey'ler gerçekten şifrelerden daha güvenli mi?

Evet, en çok önem taşıyan belirli risklerde: bir şifrenin oltalanabildiği gibi oltalanamazlar (sizi sahte bir siteye yazmaya kandıracak bir sır yok) ve bir şirketin sunucularındaki veri ihlali yalnızca değersiz genel anahtarları açığa çıkarır, çalınabilir bir şifreyi değil.

### Telefonumu kaybedersem ve passkey'lerim ondaysa ne olur?

Passkey'leriniz iCloud Anahtar Zinciri veya Google Şifre Yöneticisi üzerinden senkronize edildiyse, aynı hesaba yeni bir cihazda giriş yaparak kurtarılabilirler — risk fiziksel telefonu değil, bulut hesabının kendisine erişimi kaybetmek, bu yüzden o hesabın kendi kurtarma seçeneklerini güvence altına almak en önemlisi.

### Akıllı telefonum olmadan passkey kullanabilir miyim?

Evet. Fiziksel bir donanım güvenlik anahtarı (küçük bir USB veya NFC cihazı), herhangi bir telefondan bağımsız olarak bir passkey tutabilir ve bulut senkronizasyonuna veya bir akıllı telefonun hazır bulunmasına hiç bağımlı olmayan bir passkey isteyen herkes için standart tavsiye budur.

**Kaynaklar:** [FIDO Alliance — World Passkey Day 2026 raporu](https://fidoalliance.org/fido-alliance-reports-accelerating-global-passkey-adoption-on-world-passkey-day-2026/), [Descope — 2026 FIDO Raporu: Küresel Ölçekte Passkey'ler](https://www.descope.com/blog/post/2026-fido-report).
