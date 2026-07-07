---
title: "İşe Yarayan Unit Testler Nasıl Yazılır"
slug: "unit-test-nasil-yazilir"
translationKey: "how-to-write-unit-tests"
locale: "tr"
excerpt: "Unit test nasıl yazılır: davranışa göre isimlendir, Arrange-Act-Assert kullan, sadece sınırları mock'la ve kırılgan testlerden kaçın. Vitest 4.1, Jest 30 için."
category: "software-engineering"
tags: ["testing", "unit-testing", "code-quality", "best-practices"]
publishedAt: "2026-07-01"
seoTitle: "İşe Yarayan Unit Test Nasıl Yazılır (2026)"
seoDescription: "Gerçek hata yakalayan unit test nasıl yazılır: davranışa göre isimlendir, Arrange-Act-Assert kullan, her testte tek şeyi doğrula ve kırılgan testlerden kaçın."
---

Vitest 2026 başında haftalık 40 milyon indirmeyi aştı — 2023'ten bu yana %400'den fazla artış — ve [State of JavaScript 2025](https://2025.stateofjs.com/en-US/libraries/testing/) anketinde ilk kez hem memnuniyet hem de ilgi metriklerinde Jest'i geçti. İyi araçlara erişim hiç bu kadar kolay olmamıştı. Yine de çoğu test paketi üretime sızan hataları yakalayamıyor; çünkü sorun hiçbir zaman test koşucusu değildi. Sorun, testlerin davranış yerine yapıyı doğrulaması.

İşe yarayan bir unit test nasıl yazılır sorusunun kısa cevabı: uygulama detayını değil gözlemlenebilir davranışı test edin, her testin kırılması için tek bir sebep bırakın ve Arrange-Act-Assert (Hazırla-Çalıştır-Doğrula) yapısını izleyin. Faydalı bir unit test yalnızca davranış bozulduğunda kırılır. Eğer her private metot yeniden adlandırıldığında da kırılıyorsa, elinizde güvenlik ağı değil bir bakım yükü var demektir.

Çoğu ekip test yazıp yazmama konusunda zorlanmaz. Zorlanmalarının sebebi testlerin yavaş, kararsız (flaky) ve iç yapıya bağımlı olması; bu yüzden kimse onlara güvenmez. Bu rehber, gerçekten koruyacağınız unit testleri nasıl yazacağınızı gösteriyor.

## İyi bir unit testi ne "iyi" yapar?

İyi bir unit test tek bir davranışı doğrular, milisaniyeler içinde çalışır ve sıradan veya makineden bağımsız olarak her seferinde aynı sonucu verir. Bir şartname gibi okunur: verilen bir girdi için fonksiyon belirli bir şeyi döndürür ya da yapar. Bunun klasik kısaltması **F.I.R.S.T.**'tür — Fast (hızlı), Isolated (izole), Repeatable (tekrarlanabilir), Self-validating (kendi kendini doğrulayan), Timely (zamanında).

2026'da en çok önem taşıyan ayrım şu: **yapıyı** değil **davranışı** test edin. İç metot çağrılarına bağlanmış bir test, her refactor'ü kırmızı bir pakete çevirir ve bu da ekibinize hataları görmezden gelmeyi öğretir. Bu, testin var oluş amacının tam tersidir.

## Unit test nasıl yazılır, adım adım?

Her yeni fonksiyonda kullandığımız tekrarlanabilir süreç şu. Sırayla izlerseniz testleriniz küçük ve dürüst kalır:

1. **Tek bir davranış seçin.** Sabitlemek istediğiniz tek girdi-çıktı kuralını belirleyin (örn. "boş sepet 0 toplamı döndürür").
2. **Test adını bir cümle olarak yazın.** Davranışı anlatın: `boş sepet için sıfır döndürür`. Ad, gövdeyi açmadan okunabilmeli.
3. **Hazırla (Arrange).** Vakanın ihtiyaç duyduğu asgari girdiyi ve bağımlılıkları kurun, fazlasını değil.
4. **Çalıştır (Act).** Test edilen fonksiyonu tam olarak bir kez çağırın. İki çağrı gerekiyorsa muhtemelen iki testiniz vardır.
5. **Doğrula (Assert).** Gözlemlenebilir sonucu kontrol edin: dönüş değeri, fırlatılan hata veya sorgulayabildiğiniz bir durum değişikliği.
6. **Önce kırmızı çalıştırın.** Uygulamayı bozun ya da assert'i koddan önce yazın ve testin doğru sebeple başarısız olduğunu doğrulayın.
7. **Yeşile getirin.** Geçmesi için asgari kodu yazın.
8. **Kenar durumları ekleyin.** Boş, null, sınır ve hata yolları — her biri için ayrı bir test.

Bu, test odaklı geliştirmenin (TDD) çekirdeğidir; ama testi koddan hemen sonra yazsanız bile her testin bir kez başarısız olduğunu görmeniz koşuluyla aynı faydayı alırsınız.

## Temiz bir unit test neye benzer?

Temiz bir testin üç görünür bloğu ve kuralı belirten bir adı vardır. Küçük bir fiyat fonksiyonunu test ederek Arrange-Act-Assert kalıbını Vitest 4.1'de görelim:

```js
import { describe, it, expect } from 'vitest';
import { cartTotal } from './cart';

describe('cartTotal', () => {
  it('boş sepet için sıfır döndürür', () => {
    // Arrange
    const items = [];

    // Act
    const total = cartTotal(items);

    // Assert
    expect(total).toBe(0);
  });

  it('100 üstünde %10 indirim uygular', () => {
    const items = [{ price: 80 }, { price: 40 }]; // 120

    const total = cartTotal(items);

    expect(total).toBe(108); // 120 - %10
  });
});
```

Her testin `cartTotal`'a bir kez dokunduğuna ve yalnızca dönüş değerini doğruladığına dikkat edin. Toplamın nasıl hesaplandığını hiç incelemez. Fonksiyonu `reduce` ile, bir döngüyle ya da bir arama tablosuyla yeniden yazın; iki test de yeşil kalır. Hedeflediğiniz özellik tam olarak budur. Aynı test gövdesi Jest 30 altında da çalışır — buradaki assert'ler koşucudan bağımsızdır; public davranışa yaslanmanın bütün amacı da budur.

## Vitest 4.1 mi Jest 30 mu — koşucu, test yazımını değiştirir mi?

Temelleri değiştirmez ama ergonomiyi değiştirir. Temmuz 2026 itibarıyla bir JavaScript veya TypeScript kod tabanında varsayılan olarak tercih edilmeye değer iki koşucu şunlar:

| Yetenek | Vitest 4.1 (Mar 2026) | Jest 30 (Haz 2025) |
|---------|-----------------------|--------------------|
| ESM / TypeScript | Vite üzerinden yerel, sıfır yapılandırma | Çalışır ama transform yapılandırması ister |
| Browser Mode | v4'ten beri kararlı (gerçek tarayıcı + Playwright trace) | Yerleşik değil |
| Görsel regresyon | Yerleşik (v4) | Yalnızca üçüncü taraf |
| Watch-mode hızı | Vite grafiğini yeniden kullanır, anında HMR | `unrs-resolver` ile v30, v29'dan ~%20 hızlı |
| Sahte zamanlayıcı | `vi.useFakeTimers()` | `jest.useFakeTimers()` |
| Framework varsayılanı | Angular 21, Nuxt, SvelteKit | Eski Create React App, Next.js dokümanları |

Kişisel görüşüm: 2026'da sıfırdan başlayan bir proje için Vitest'e uzanın — Vite entegrasyonu ve kararlı Browser Mode onu daha az sürtünmeli seçim yapıyor, Angular 21'in 2025 sonunda onu varsayılan olarak göndermesi de momentum tartışmasını bitirdi. Ama geçen ve güvendiğiniz olgun bir Jest paketiniz varsa, sırf göç etmiş olmak için göç etmeye genelde değmez. Jest 30 gerçekten v29'dan hızlı ve güvendiğiniz yeşil bir paket, bir yapılandırma yeniden yazımından iyidir.

## Hangi testleri yazmaktan kaçınmalısınız?

İç yapıyı doğrulayan, her şeyi mock'layan veya framework'ün zaten garanti ettiğini test eden testlerden kaçının. Bunlar CI'da geçer ama size sahte güven verir ve sizi yavaşlatır. Aşağıdaki tablo, kod incelemesinde en sık işaretlediğimiz anti-kalıpları ve yerine ne yazmanız gerektiğini gösteriyor:

| Anti-kalıp | Neden zarar verir | Yerine bunu yazın |
|------------|-------------------|-------------------|
| Private metodun çağrıldığını doğrulamak | Her refactor'de kırılır | Public dönüş değerini veya durumu doğrulayın |
| Test edilen şeyi mock'lamak | Kodu değil mock'u test eder | Yalnızca dış sınırları mock'layın (ağ, saat, DB) |
| Tek testte çok assert | Belirsiz hata mesajı | Test başına tek davranış |
| Getter/setter test etmek | Mantık yok, değer yok | Karar veren fonksiyonları test edin |
| Devasa nesnenin snapshot'ı | Kimse diff'i incelemez | Önemli olan belirli alanları doğrulayın |
| Async için `sleep` beklemek | Yavaş ve kararsız | Promise'i await edin veya sahte zamanlayıcı kullanın |

Bir ödeme servisinde 40 dakikalık bir paketi 6 dakikaya indirdik; bunun çoğu, sonuç yerine çağrı sırasını doğrulayan mock ağırlıklı testleri silmekten geldi. Kapsam %4 düştü ama *daha fazla* gerçek hata yakaladık çünkü kalan testler gerçekten davranışı anlatıyordu. Böyle bir paketi çözmeye çalışıyorsanız, [legacy kodu güvenli şekilde refactor etme](/tr/posts/legacy-kod-refactoring) rehberimiz bunu güvenlik ağını kaybetmeden yapmayı anlatıyor.

## Ne kadar mock'lamalısınız?

Yalnızca kontrol etmediğinizi mock'layın: ağ çağrıları, sistem saati, rastgelelik, dosya sistemi ve üçüncü taraf servisleri. Sahip olduğunuz her şey test içinde gerçekten çalışsın. Aşırı mock'lama, unit testlerin sahte güven vermesinin bir numaralı sebebidir — sonunda kodunuzun çalıştığını değil, mock'larınızı doğru kurduğunuzu doğrulamış olursunuz.

Pratik bir kural: gerçek bir nesneyi mock ile değiştirmek testin *ne kadar hızlı* çalıştığını değil *neyi kanıtladığını* değiştiriyorsa, onu mock'lamayın. Saf mantık için — hesaplamalar, doğrulama, biçimlendirme, durum geçişleri — genelde hiç mock gerekmez; bu yüzden bu mantık unit test edilmeye en değer olandır. Kodu küçük, enjekte edilebilir bağımlılıklar etrafında tasarlamak bunu kolaylaştırır; [ileri TypeScript kalıpları](/tr/posts/ileri-typescript-kaliplari) rehberimiz bunu ağrısız kılan dikişleri anlatıyor.

## Kapsam (coverage) sayıları ne olacak?

Kapsam, testler sırasında hangi kodun *çalıştığını* söyler, hangi davranışı *doğruladığınızı* değil; bu yüzden onu hedef değil, boşluk bulucu olarak görün. %100 peşinde koşmak ekipleri getter'lar ve üretilmiş kod için önemsiz testler yazmaya iterken zor dallar test edilmeden kalır. Karar mantığının — `if`'ler, hata yolları, kenar durumlar — anlamlı kapsamını hedefleyin, basit yapıştırıcı kodu ise ortaya çıkan sayıda bırakın.

Biz iş mantığında zemin olarak yaklaşık %80 hedefliyoruz ve her PR'da *kapsanmamış* satırları okuyoruz. Test edilmemiş bir `catch` bloğu ya da vurulmamış bir sınır koşulu, kapsanmış on getter'dan daha değerlidir. Testin teslimatla buluştuğu yer de burası: kapsam eşiği kimsenin okumadığı bir tabloda değil, [CI/CD pipeline'ınızda](/tr/posts/cicd-pipeline-nasil-kurulur) durmalı. Kalite eşiklerine dair daha geniş çerçeve için [temiz kod prensipleri kontrol listemize](/tr/posts/temiz-kod-prensipleri) ve [yazılım mühendisliği](/tr/category/yazilim-muhendisligi) kategorisine göz atın.

## Testler nasıl yük olmaktan çıkar?

Testler yapıya bağlı, yavaş veya neden kırıldığı belirsiz olduğunda yük olur. Birkaç alışkanlıkla bakım maliyetlerini düşük tutun:

- **Test başına tek kırılma sebebi.** Bir test kırıldığında adı, neyin bozulduğunu söylemeli.
- **Testte mantık olmaz.** Beklenen değeri üreten döngü ya da koşul yok — değerleri elle yazın ki test, kodla aynı hatayı paylaşamasın.
- **Her seferinde taze durum.** Girdileri paylaşılan değişken modül durumunda değil, her testin içinde kurun.
- **Artık davranışı anlatmayan testleri silin.** Kırılgan bir testi silmek kayıp değil, kazançtır.
- **Public API üzerinden test edin.** Bir private fonksiyon doğrudan test gerektirecek kadar karmaşıksa, muhtemelen kendi iyi adlandırılmış modülü olmak ister.

Bunları tutarlı yaparsanız test paketi, korkusuzca refactor yapmanızı sağlayan şeye dönüşür; ki bütün mesele de budur.

## Sıkça Sorulan Sorular

### Bir fonksiyonun kaç unit testi olmalı?

Sabit bir sayı değil, farklı davranışlarını kapsayacak kadar. Saf bir hesaplama üç dört test isteyebilir: mutlu yol, bir sınır, boş/sıfır girdi ve bir hata durumu. Kendinizi tek bir fonksiyon için bir düzine test yazarken bulursanız, bu genelde fonksiyonun çok fazla iş yaptığının ve bölünmek istediğinin işaretidir — testler size bir tasarım sorununu gösteriyordur.

### Testi koddan önce mi sonra mı yazmalıyım?

İkisi de olur, ama testi en az bir kez başarısız görmelisiniz. Test-önce (TDD), daha küçük ve daha test edilebilir fonksiyonlar üretme eğiliminde bir tasarım baskısı verir. Test-sonra da iyidir; yeter ki testin gerçekten regresyonu yakaladığını doğrulamak için uygulamayı bilerek bozun. Hiç başarısız olmamış bir teste güvenemezsiniz.

### Unit test ile entegrasyon testi arasındaki fark nedir?

Unit test tek bir mantık parçasını izole eder ve gerçek I/O olmadan milisaniyeler içinde çalışır; entegrasyon testi ise birkaç parçanın veritabanı ya da HTTP çağrısı gibi gerçek bir sınır boyunca birlikte çalıştığını doğrular. Çoğunlukla hızlı unit testler ve bağlantıları doğrulayan daha ince bir entegrasyon testi katmanı istersiniz. İkisi de önemlidir ama farklı soruları yanıtlar ve birbirine karıştırılmamalıdır.

### Zamana veya rastgeleliğe bağlı kodu nasıl test ederim?

`Date.now()` veya `Math.random()`'ı doğrudan çağırmak yerine bağımlılığı dışarıdan enjekte edin ve testte sabit bir değer verin. Hem [Vitest](https://vitest.dev/api/vi.html#vi-usefaketimers) hem de [Jest](https://jestjs.io/docs/timer-mocks) saati dondurup ilerletmenizi sağlayan sahte zamanlayıcılar sunar. Bu, belirsiz kodu tekrarlanabilir testlere çevirir; ki bu, F.I.R.S.T.'teki "R" için zorunlu bir koşuldur.
