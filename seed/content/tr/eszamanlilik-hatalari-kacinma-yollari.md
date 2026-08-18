---
title: "Eşzamanlılık Hataları ve Kaçınma Yolları"
slug: "eszamanlilik-hatalari-kacinma-yollari"
translationKey: "concurrency-bugs-mistakes"
locale: "tr"
excerpt: "Race condition ile data race farklıdır, atomik yazma bile görünürlüğü garanti etmez; kilit, kanal ve immutability doğru yerde kullanılmazsa hata kaçınılmazdır."
category: "software-engineering"
tags: ["backend", "best-practices", "testing", "code-quality"]
publishedAt: "2026-08-18"
seoTitle: "Eşzamanlılık Hataları ve Kaçınma Yolları"
seoDescription: "Race condition, data race, deadlock ve async/await hatalarının kesin farkları, nedenleri ve kod incelemesinde nasıl yakalanacağı örneklerle anlatılıyor."
---

Kısa cevap: "async" yazdığınız kod thread-safe demek değildir. `await` eklemek sırayı garanti eder ama paylaşılan durumu korumaz; JavaScript'te bile tek thread'de çalışan kod, interleaving yüzünden race condition üretebilir. Aşağıda bu hataların kesin mekanizmalarını ve önleme yollarını görüyorsunuz.

## Race condition ile data race arasındaki fark nedir?

Data race, iki thread'in aynı bellek adresine eşzamanlı erişip en az birinin yazma olduğu ve aralarında sıralama garantisi bulunmadığı durumdur; derleyici veya donanım seviyesinde tanımsız davranışa yol açar. Race condition ise daha geniş bir kavramdır: sonucun, işlemlerin göreli zamanlamasına bağlı olarak değişmesidir ve data race olmadan da oluşabilir.

Örneğin JavaScript'te tek thread çalışır, dolayısıyla klasik anlamda data race yoktur — iki `await` arasında olay döngüsü başka bir görevi çalıştırdığında paylaşılan bir nesne beklenmedik şekilde değişebilir. Bu bir race condition'dır ama data race değildir, çünkü aynı anda iki thread aynı belleğe dokunmuyor. Rust ekosisteminde bu ayrım o kadar netleştirilmiştir ki resmi Rustonomicon dokümanı "Rust data race'leri önler, race condition'ları değil" der; borrow checker aynı veriye eşzamanlı mutable erişimi derleme zamanında engeller ama iki thread'in doğru sırada mesajlaşmasını garanti etmez.

## Deadlock ve livelock nasıl oluşur, aralarındaki fark nedir?

Deadlock, iki veya daha fazla thread'in birbirinin elindeki kilidi beklerken sonsuza kadar durmasıdır; livelock ise thread'lerin durmadan durum değiştirip birbirine yol vermeye çalışması ama hiçbirinin ilerleyememesidir. İkisi de sistemi tıkar, farkı deadlock'ta thread'ler pasif beklerken livelock'ta CPU harcayarak aktif şekilde takılmalarıdır.

Klasik deadlock senaryosu, A thread'inin önce kilit-1'i sonra kilit-2'yi, B thread'inin ise önce kilit-2'yi sonra kilit-1'i almaya çalışmasıdır. Çözüm genellikle kilitleri her yerde aynı sırayla almak veya `tryLock` ile zaman aşımı koymaktır. Livelock'a örnek, iki thread'in çakışmayı fark edip ikisinin de nazikçe geri çekilip tekrar denemesi ve bunun döngüye girmesidir — çözüm rastgele bekleme süresi (jitter) eklemektir.

## Paylaşılan değişebilir durum neden bu kadar çok hataya yol açıyor?

Kök neden şudur: birden fazla yürütme birimi aynı veriye erişip en az biri değiştirdiğinde, sıralama garantisi olmadan sonucu tahmin etmek imkânsız hale gelir. Değişebilir durumu ortadan kaldırırsanız (immutability) ya da erişimi tek bir sahibe verirseniz (message passing), bu hata sınıfının büyük kısmı kaynağında yok olur.

Bu yüzden Rust'ın ownership modeli, Go'nun "do not communicate by sharing memory, share memory by communicating" felsefesi ve fonksiyonel dillerin immutable veri yapıları aynı problemi farklı açılardan çözer: paylaşılan mutable durumu ya imkânsız kılar ya da tek erişim noktasına indirger. [Legacy koddaki paylaşılan durumu refactor ederken](/tr/posts/legacy-kod-refactoring) bu prensip özellikle işe yarar.

## Bir değişkene atomik yazmak neden görünürlüğü garanti etmez?

Atomiklik, bir işlemin bölünmeden tek adımda gerçekleşmesi demektir; görünürlük ise bir thread'in yaptığı değişikliğin diğer thread tarafından ne zaman görüleceğidir — ve bu ikisi farklı garantilerdir. CPU çekirdek önbellekleri ve derleyici optimizasyonları yüzünden, bir thread bir değişkeni atomik olarak güncellese bile, bellek bariyeri (memory barrier) olmadan başka bir thread eski değeri önbelleğinden okumaya devam edebilir.

Go'da bu, `sync/atomic` paketinin `Store` ve `Load` fonksiyonlarının neden `happens-before` ilişkisi tanımladığını açıklar: sadece değeri değil, o değere kadarki tüm yan etkileri de görünür kılar. Java'da `volatile` anahtar kelimesi ve C++'ta `std::memory_order` de aynı problemi çözer. Sıradan bir `int` artırma işlemi (`counter++`) atomik değildir çünkü oku-değiştir-yaz üç ayrı adımdır; ama atomik yapılsa bile, uygun bir bellek bariyeri yoksa diğer thread'in yeni değeri "ne zaman" göreceği garanti değildir.

## Async/await kullanırken en sık yapılan hatalar nelerdir?

En sık üç hata: `await` unutulan (fire-and-forget) promise'lar, iptal (cancellation) mekanizması eksikliği ve döngü içinde `await`i unutmaktır. Bunların üçü de "kod çalışıyor gibi görünüyor ama sırası veya sayısı yanlış" türünde sessiz hatalar üretir.

```javascript
// Yanlış: await unutuldu, hata sessizce yutulur ve sıralama garanti edilmez
async function saveOrder(order) {
  db.save(order) // "await" eksik — promise "fire-and-forget"
  return { status: 'saved' }
}

// Yanlış: döngüde await unutulursa istekler paralel ve kontrolsüz ateşlenir
async function notifyAll(users) {
  users.forEach(async (u) => {
    await sendEmail(u) // forEach callback'inin await'ini kimse beklemiyor
  })
}

// Doğru: hata yakalanıyor, sıralama ve eşzamanlılık kontrol altında
async function notifyAllSafely(users) {
  const results = await Promise.allSettled(users.map(sendEmail))
  return results.filter((r) => r.status === 'rejected')
}
```

Node.js'in olay döngüsü dokümantasyonu, mikro görev kuyruğunun (`Promise` callback'leri) her makro görev arasında tamamen boşaltıldığını anlatır — bu da neden bir `await`in atlanmasının, beklenenden çok daha erken veya geç çalışan kod ürettiğini açıklar. İptal desteği olmayan bir `fetch` çağrısı da benzer bir tuzaktır: kullanıcı sayfadan ayrılsa bile istek arka planda tamamlanmaya çalışır ve state güncellemesi artık var olmayan bir bileşene yazılmaya çalışılabilir.

## Kilit mi, mesaj geçişi mi, yoksa immutability mi kullanmalıyım?

Kısa cevap: paylaşılan durumu az ve kısa süreli koruman gerekiyorsa kilit, iş birimlerini birbirinden izole etmek istiyorsan kanal/actor, veri hiç değişmiyorsa immutability en güvenli seçenektir. Üçü de aynı problemi çözer ama farklı başarısızlık modlarına sahiptir.

| Yaklaşım | Ne zaman kullanılır | Tipik başarısızlık modu |
|---|---|---|
| Kilit (mutex/lock) | Kısa, kritik bölgede paylaşılan durumu korumak | Deadlock, kilit sızıntısı, performans darboğazı |
| Kanal / actor (message passing) | Bağımsız iş birimleri arasında veri/görev aktarımı | Kanal doldu (backpressure), mesaj sırası hataları |
| Immutability | Veri hiç değişmiyorsa veya kopyalamak ucuzsa | Gereksiz bellek/kopyalama maliyeti |
| Atomik işlemler | Tek bir sayaç veya bayrak güncellemesi | Yanlış granülerlik, görünürlük varsayım hatası |

Go'da `sync.Mutex` ile kilit kullanmak yerine kanal tercih etmek genellikle daha az hataya açık kod üretir çünkü kanal, "kimin ne zaman erişebileceği" sorusunu tip sisteminin bir parçası hâline getirir. [Olay güdümlü mimarilerde mesaj geçişinin tuzaklarını](/tr/posts/olay-gudumlu-mimari-desenler-tuzaklar) incelemek bu kararı vermeden önce faydalı olur.

## Eşzamanlı kod nasıl test edilir?

Eşzamanlı kodu doğru test etmenin yolu, deterministik unit testlerden değil, stress testlerden ve otomatik race detector'lardan geçer; çünkü race condition'lar zamanlamaya bağlıdır ve tek çalıştırmada görünmeyebilir. Go'da `go test -race` veya `go run -race` komutu, ThreadSanitizer tabanlı bir dedektörle aynı bellek adresine sıralamasız erişimleri çalışma zamanında yakalar; Ağustos 2026 itibarıyla bu araç Go'nun standart dağıtımına gömülü olarak gelmeye devam ediyor ve Uber gibi şirketler milyonlarca satırlık Go kod tabanında binlerce data race'i bu şekilde bulup düzeltti.

Pratikte işe yarayan yöntemler: testleri `-race` bayrağıyla CI'da zorunlu koşmak, aynı testi yüzlerce kez paralel çalıştırıp (`go test -race -count=100`) ara sıra başarısız olan testleri yakalamak ve gerçek trafiği simüle eden yük testleriyle kilit çekişmesini gözlemlemektir. [Unit testlerin nasıl yazılacağına dair rehberde](/tr/posts/unit-test-nasil-yazilir) anlatılan izolasyon prensipleri, eşzamanlı testler için de geçerlidir — ama tek başına yeterli değildir, çünkü klasik unit testler zamanlamayı kontrol etmez.

Kişisel görüşüm şu: eşzamanlı bir fonksiyonu "elle test ettim, sorun yok" demek, aslında hiçbir şey kanıtlamaz — race condition'lar genelde üretimde, yük altında, ayda bir kez ortaya çıkar. Race detector çalıştırmadan merge edilen eşzamanlı kod, test edilmemiş kod kadar risklidir.

## Kod incelemesinde eşzamanlılık hatalarını nasıl yakalarım?

Aşağıdaki kontrol listesi, bir pull request'te paylaşılan durum veya async kod gördüğünüzde sorulacak somut sorulardır:

- Bu değişkene/nesneye birden fazla goroutine, thread veya async görev erişiyor mu? Erişiyorsa hangi mekanizma (kilit, kanal, atomik) koruyor?
- Her `async`/`await` zincirinde, her promise ya `await` ediliyor ya da bilinçli olarak `.catch`/`allSettled` ile ele alınıyor mu?
- Döngü içinde `await` çağrısı unutulmuş mu, yoksa paralel çalıştırma bilinçli mi (`Promise.all` ile)?
- Birden fazla kilit alınıyorsa, her yerde aynı sırada mı alınıyor?
- İptal edilebilen bir işlem (kullanıcı sayfadan çıkarsa, timeout olursa) doğru şekilde `context.CancelFunc` veya `AbortController` ile durduruluyor mu?
- Bu değişiklik CI'da `-race` bayrağıyla veya eşdeğer bir race detector'la test ediliyor mu?
- Paylaşılan durumu tamamen kaldırıp immutable bir kopya veya mesaj geçişiyle çözmek mümkün mü?

Bu soruları [etkili kod inceleme pratikleriyle](/tr/posts/etkili-kod-incelemesi) birlikte uygulamak, eşzamanlılık hatalarının büyük kısmını üretime çıkmadan yakalar.

## Sıkça Sorulan Sorular

### Race condition her zaman hata mıdır?

Hayır, race condition her zaman hata değildir; sonucun zamanlamaya bağlı olması bazen kabul edilebilir (örneğin hangi worker'ın önce loglayacağı önemsizse). Hata hâline gelmesi, sonucun doğruluğunu veya veri bütünlüğünü etkilediği andır.

### JavaScript tek thread'li olduğu için eşzamanlılık hatası olur mu?

Evet, olur; JavaScript'te thread yok ama olay döngüsü var ve `await` noktalarında kontrol başka bir göreve geçebilir. İki `await` arasında paylaşılan bir değişken başka bir async fonksiyon tarafından değiştirilebilir, bu da klasik bir race condition'dır.

### Kilit kullanmak her zaman en güvenli çözüm müdür?

Hayır; kilit yanlış sırada alınırsa deadlock riski taşır ve performans darboğazı yaratabilir. Veri paylaşımını tamamen ortadan kaldıran immutability veya sahipliği netleştiren mesaj geçişi (kanal/actor), çoğu durumda daha az hataya açık bir tasarımdır.

### Go'nun -race bayrağı tüm eşzamanlılık hatalarını yakalar mı?

Hayır; `-race` yalnızca çalışma sırasında gerçekleşen data race'leri yakalar, kod yolunun test sırasında tetiklenmesi gerekir. Deadlock, livelock veya mantıksal race condition'ları (data race olmayan) tespit etmek için ayrıca stress testi, zaman aşımlı testler ve statik analiz araçları gerekir.
