---
title: "TC39 Signals Teklifi: JavaScript'e Yerleşik Reaktivite"
slug: "tc39-signals-teklifi-javascript-reaktivite"
translationKey: "tc39-signals-proposal-2026"
locale: "tr"
excerpt: "TC39'un Signals teklifi Stage 1'de: JavaScript'in kendisine, çerçeveden bağımsız paylaşılan bir reaktif durum ilkeli eklemek için erken bir girişim."
category: "web-development"
tags: ["frontend", "state-management", "web-standards", "performance"]
publishedAt: "2026-10-18"
seoTitle: "TC39 Signals Teklifi: Aşama, Şampiyonlar, Zaman Çizelgesi"
seoDescription: "TC39'un proposal-signals'ı 2026'da Stage 1'e ulaştı. Signal nedir, teklifin ardında kimler var ve yerleşik reaktivite neden hâlâ yıllar uzakta?"
---

TC39 Signals teklifi, her çerçevenin kendi uyumsuz sürümünü göndermesi yerine, JavaScript diline doğrudan paylaşılan ve çerçeveden bağımsız bir reaktif durum ilkeli eklemeyi hedefleyen erken aşamadaki (Stage 1) bir girişim. Signal, değeri değiştiğinde ona bağımlı olan her şeyi otomatik bildiren bir değer taşıyıcısı — bu mekanizma bugün Preact Signals, SolidJS, Vue'nun reaktivite sistemi, Angular signals, Svelte runes ve MobX'te ayrı ayrı uygulanıyor.

## Signal somut olarak nedir?

Signal, bir değerin iki parçalı küçük bir sarmalayıcısı: okumak bir bağımlılık kaydeder, yazmak ise her bağımlıya yeniden hesaplaması gerektiğini bildirir. Sözde kodla:

```javascript
const count = signal(0);
const doubled = computed(() => count.get() * 2);

effect(() => {
  console.log(`doubled is now ${doubled.get()}`);
});

count.set(5); // yazdırır: "doubled is now 10"
```

Bu parçacığı kavramsal olarak anlamak için hiçbir çerçeveye gerek yok — bunu standartlaştırmanın amacı da bu. Bugün yukarıdaki API, Preact Signals, Solid, Vue, Angular ve diğerlerinde hafifçe farklı biçimlerde var ve hiçbiri doğrudan birbiriyle uyumlu çalışmıyor.

## Çerçeve geliştiricileri neden paylaşılan bir ilkel istiyor?

Çünkü bugünkü parçalanma, bir çerçevenin reaktivite sistemi içinde yaratılan bir signal'in başka birinin tarafından doğal olarak tüketilememesi anlamına geliyor. Bir Preact Signal ile bir Vue `ref`, aynı temel sorunu uyumsuz uygulamalarla çözüyor; bu yüzden ikisiyle de çalışması gereken her kod — paylaşılan bir tasarım sistemi kütüphanesi, çerçeveleri karıştıran bir mikro ön uç mimarisi ya da çerçeveden bağımsız olmaya çalışan bir yardımcı kütüphane — ya adaptör katmanları yazmak zorunda kalıyor ya da bir çerçevenin ilkelini seçip tüketicilerin buna katlanmasını umuyor.

Dil seviyesinde bir signal, her çerçeveye üzerine inşa edebileceği ortak bir reaktif çekirdek verirdi; tam olarak her çerçevenin kendi `Promise`, `Map` ve `Array`'ini tanımlamak yerine zaten bunları paylaşması gibi. [Durum yönetimi tercihleri](/tr/posts/react-state-yonetimi-karsilastirma) tek başına React ekosisteminde bile geniş çeşitlilik gösteriyor; yerleşik bir signals ilkeli bu seçimi ortadan kaldırmaz ama en alt seviyedeki reaktif kablolamanın rakip uygulamalar yerine paylaşılan altyapı olabilmesi anlamına gelirdi.

## Teklif hangi aşamada ve ardında kimler var?

[Teklif](https://github.com/tc39/proposal-signals), [TC39 sürecinde](https://tc39.es/process-document/) Stage 1'de — komitenin bir sorunun çözülmeye değer olduğuna ve genel bir yönün araştırılmaya değer olduğuna karar verdiği, herhangi bir taahhüt edilmiş sözdizimi veya semantikten çok önceki açıklama aşaması. Teklifi ileri taşıyan isimler arasında Daniel Ehrenberg, Yehuda Katz, Jatin Ramanathan, Shay Lewis, Kristen Hewell Garrett, Dominic Gannaway, Preston Sego, Milo M ve Rob Eisenberg sayılıyor.

Geliştirme sürecinde Angular, Ember, MobX, Preact, Qwik, RxJS, Solid, Svelte, Vue ve Wiz'e bağlı kişi ve projeler [tasarım görüşü](https://github.com/tc39/proposal-signals/blob/main/README.md) vererek tartışmada temsil edildi. React, dikkat çekici şekilde ne isim verilen şampiyonlar arasında ne de en görünür tasarım katkısı sağlayanlar arasında yer almıyor — bunun her büyük çerçevenin eşit şekilde imza attığı, ekosistem çapında bir girişim olduğunu düşündüyseniz bilmeye değer bir ayrıntı.

| TC39 aşaması | Ne anlama gelir | Signals teklifinin durumu |
|---|---|---|
| Stage 0 | Taslak fikir — henüz komite onayı yok | Geçildi |
| Stage 1 | Açıklama kabul edildi — sorun çözülmeye değer | **Şu anki aşama** |
| Stage 2 | Taslak spesifikasyon metni var, komite gelmesini bekliyor | Henüz ulaşılmadı |
| Stage 3 | Spesifikasyon tamamlandı, uygulayıcılar inşa etmeye başlıyor | Henüz ulaşılmadı |
| Stage 4 | Motorlarda gönderildi, ECMAScript spesifikasyonu için hazır | Henüz ulaşılmadı |

## Tarayıcılarda yerleşik signal'ler ne zaman gerçekten gelir?

Gerçekçi olarak, yıllar sonra. Teklifin 2026'daki ilerleyişini takip eden yorumlardan bile en iyimser tahmin, tarayıcılarda herhangi bir yerleşik şeyin gelmesinden önce en az 2-3 yıl öngörüyor ve bu, TC39'dan taahhüt edilmiş bir zaman çizelgesi değil, gayri resmi bir tahmin — Stage 1 teklifleri süresiz olarak durabilir, Stage 2'de kayda değer şekilde biçim değiştirebilir veya hiç ilerlemeyebilir de. TC39 süreci kasıtlı olarak yavaş ilerliyor: her aşama komite mutabakatı gerektiriyor ve Stage 3'ün tek başına genelde Stage 4'ten önce paralel olgunlaşan birden fazla motor uygulaması anlamına geliyor.

## Bu gelirse birlikte çalışabilirlik gerçekte neyi açığa çıkarır?

Adaptör kodu olmadan çerçeve sınırları arasında paylaşılan durum — bir sayfada çerçeveleri karıştıran mikro ön uç mimarileri, bir çerçeve bağımlılığı seçmeden reaktif ilkelleri açığa çıkarmak isteyen tasarım sistemi kütüphaneleri ve şu anda sadece aynı kitleye ulaşmak için Vue, React'e yakın signal kütüphaneleri ve Solid için ayrı reaktivite bağlamaları sürdüren her kütüphane geliştiricisi için gerçekten faydalı bir durum. [React Server Components](/tr/posts/nextjs-react-server-components) ve çerçeveden bağımsız render örüntülerine yönelik daha geniş hareket de aynı temel motivasyona işaret ediyor: zaten aynı şeyi yapmaya çalışırken örtüşen ekosistemler arasında daha az tekrarlanan altyapı kodu.

## Bugün bu konuda gerçekten ne yapmalısınız?

Aceleye gerek yok — benimsenecek yeni bir sözdizimi, eklenecek bir polyfill veya planlanacak bir göç yok; çünkü Stage 1, hiçbir tarayıcıdan bir uygulama taahhüdü taşımıyor. Pratik hareket, çerçevenizin mevcut reaktivite ilkellerini tam da şu anki gibi kullanmayı sürdürmek ve teklifi bir yol haritası öğesi yerine not edilmeye değer bir şey olarak görmek. Şu anda birden fazla çerçeve için ayrı reaktif bağlamalar gönderen bir kütüphane sürdürüyorsanız, depoyu özellikle bir Stage 2 ilerlemesi için izlemeye değer; çünkü somut API biçiminin etrafında plan yapmaya yetecek kadar netleşmeye başlayacağı nokta burası.

## Çerçeveler arası birlikte çalışabilirlik ekiplerin gerçekten ihtiyacı olan şey mi?

Dürüst görüşüm: tek bir çerçeve içinde ürün gönderen ortalama bir ekip için muhtemelen değil, pratik değer neredeyse sıfıra yakın — zaten bir reaktivite sisteminiz var ve yıllar sonra gelecek yerleşik bir sistem bugünkü kodu değiştirmiyor. Gerçek yararlanıcılar, kütüphane geliştiricileri ile [HTMX tarzı veya karma çerçeve kurulumları](/tr/posts/htmx-mi-react-mi) çalıştıran ekipler; paylaşılan bir ilkel, JavaScript'in hiçbir zaman yerleşik bir cevabı olmaması nedeniyle bugün var olan bir entegrasyon iş kategorisini ortadan kaldırıyor. Bir kütüphane sürdürmüyorsanız veya çerçeveler arasında köprü kurmuyorsanız, bu izlemeye değer, beklemeye değer değil.

## Sıkça Sorulan Sorular

### Signals teklifi şu anda hangi TC39 aşamasında?
Signals teklifi, TC39'un çerçeveler arasında parçalanmış, uyumsuz reaktivite uygulamalarının çözülmeye değer bir sorun olduğunu kabul ettiği ama henüz taahhüt edilmiş sözdizimi veya semantiğin bulunmadığı açıklama aşaması olan Stage 1'de. Stage 2 (taslak spesifikasyon metni) ve sonrası henüz ulaşılmadı.

### React, TC39 Signals teklifine dahil mi?
React, teklifin ismi geçen şampiyonları veya en görünür çerçeve katkıcıları arasında listelenmiyor; geliştirme sürecinde belgelenen tasarım görüşü ağırlıklı olarak Angular, Ember, MobX, Preact, Qwik, RxJS, Solid, Svelte, Vue ve Wiz'e bağlı kişi ve projelerden geliyor. Bu, bunu ekosistem çapında bir mutabakat yerine geniş ama evrensel olmayan bir çerçeve girişimine daha yakın yapıyor.

### Bir TC39 signal'i, Preact Signals gibi bir çerçevenin kendi signal'inden nasıl farklı?
Yerleşik bir TC39 signal'i kavramsal olarak aynı şekilde çalışırdı — bağımlıları takip eden ve değişiklikte bildiren bir değer taşıyıcısı — ama dilin kendisinde yaşardı, böylece herhangi bir çerçeve veya kütüphane adaptör olmadan onu tüketebilirdi. Bugün Preact Signals, Vue'nun reaktivitesi ve benzer sistemler, aynı temel fikrin ayrı, uyumsuz uygulamaları.

### Yerleşik JavaScript signal'leri ne zaman production'da kullanılabilir olur?
Taahhüt edilmiş bir tarih yok. Teklifi takip eden yorumlardan gelen gayri resmi bir 2026 tahmini, teklif Stage 2, 3 ve 4'te durmadan ilerlemeye devam ettiği varsayımıyla, tarayıcılarda herhangi bir yerleşik şeyin gelmesinden önce en az 2-3 yıl öneriyor — ve Stage 1 teklifleri bu noktaya ulaşmadan önce sıklıkla duruyor veya yön değiştiriyor.
