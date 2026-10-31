---
title: "Daha Net Düşünmek İçin Karar Günlüğü Tutun"
slug: "daha-net-dusunmek-icin-karar-gunlugu-tutun"
translationKey: "build-a-decision-log-think-clearly"
locale: "tr"
excerpt: "Kısa cevap: her kararı bağlam, seçenekler, gerekçe ve beklenen sonuçla yazın; haftalar sonra gerçekle karşılaştırmak hafızanızın yalanlarını gösterir."
category: "career-productivity"
tags: ["productivity", "time-management", "documentation", "career"]
publishedAt: "2026-10-31"
seoTitle: "Karar Günlüğü Nasıl Tutulur? Pratik Şablon"
seoDescription: "Karar günlüğü nedir, hangi alanları içerir, ADR formatından nasıl farklıdır ve AI ile nasıl özetlenir? Daha net düşünmek için pratik bir rehber."
---

Kısa cevap: bir karar günlüğü, verdiğiniz her önemli kararı bağlamı, değerlendirdiğiniz seçenekleri, gerekçenizi ve beklediğiniz sonucu yazarak kaydettiğiniz kısa bir not. Haftalar veya aylar sonra bu notu gerçek sonuçla karşılaştırmak, hafızanızın kararı nasıl çarpıttığını gösteriyor — bu çarpıtmaya retrospektif önyargı (hindsight bias) deniyor.

## Karar günlüğü nedir ve hafıza neden yalan söylüyor?

Karar günlüğü, bir kararı verdiğiniz anda düşüncenizi dondurup yazıya döktüğünüz bir kayıt. Buna ihtiyaç duymanızın nedeni basit: insan hafızası bir kararın sonucunu öğrendikten sonra, o kararı "zaten böyle düşünmüştüm" diye yeniden yazıyor. Retrospektif önyargı, bir olayın sonucunu bildikten sonra o sonucun baştan beri kaçınılmaz veya öngörülebilir göründüğü hissi olarak tanımlanıyor.

Bu önyargının pratik sonucu şu: bir proje başarısız olduğunda "zaten riskli olduğunu biliyordum" dersiniz, ama o kararı verdiğiniz andaki gerçek güven seviyeniz yazılı değilse bu iddiayı doğrulayamazsınız. Karar günlüğü tam olarak bu boşluğu kapatıyor — kararı verdiğiniz andaki gerçek düşünceniz, sonradan değiştirilemeyecek şekilde kayıt altına alınıyor.

## Bir karar günlüğü girdisi hangi alanları içermeli?

Etkili bir girdi altı alandan oluşuyor: bağlam, değerlendirilen seçenekler, verilen karar, beklenen sonuç, güven seviyesi ve bir gözden geçirme tarihi. Bu altı alan, kararı hem o anki haliyle anlamanızı hem de ileride gerçekle karşılaştırmanızı mümkün kılıyor.

| Alan | Ne içerir | Örnek |
|---|---|---|
| Bağlam | Kararı gerektiren durum | "API'yi versiyonlamadan mı yayınlayalım, yoksa /v1 ile mi?" |
| Seçenekler | Değerlendirilen alternatifler | "Versiyonsuz yayın, /v1 öneki, header tabanlı versiyonlama" |
| Karar | Seçilen yol ve kısa gerekçe | "/v1 öneki — en basit ve istemci tarafında en az kafa karışıklığı" |
| Beklenen sonuç | Kararın getireceği varsayılan fayda | "6 ay içinde ikinci bir büyük değişiklik gerekirse kolay geçiş" |
| Güven seviyesi | 1-5 arası öznel güven puanı | "4/5" |
| Gözden geçirme tarihi | Sonucu kontrol edeceğiniz tarih | "Mayıs 2027" |

```markdown
## Karar: API versiyonlama stratejisi
- Tarih: 2026-10-31
- Bağlam: İlk genel kullanıma açık API sürümünü yayınlıyoruz.
- Seçenekler: (1) versiyonsuz, (2) /v1 öneki, (3) header tabanlı.
- Karar: /v1 öneki seçildi.
- Gerekçe: İstemci tarafında en az karmaşıklık, log'larda versiyon görünürlüğü.
- Beklenen sonuç: 2027 ortasına kadar ikinci versiyon gerekmeyecek.
- Güven: 4/5
- Gözden geçirme tarihi: 2027-05-01
```

## Karar günlüğünü nerede tutmalısınız?

Kişisel kararlar için bir not uygulaması yeterli; mühendislik kararları için repo içinde Mimari Karar Kayıtları (Architecture Decision Record, ADR) daha uygun. ADR formatı 2011'de Michael Nygard tarafından önerildi ve dört sabit bölümden oluşuyor: Durum, Bağlam, Karar ve Sonuçlar; kayıtlar genelde bir-iki sayfayı geçmiyor ve kodla birlikte versiyon kontrolünde tutuluyor.

Kişisel karar günlüğü ile ekip ADR'si arasındaki fark, okuyucu kitlesinde yatıyor: kişisel günlük sadece sizin gelecekteki kendinize hitap ediyor, ADR ise aynı kod tabanına dokunacak her mühendise. [API versiyonlama stratejileri](/tr/posts/api-versiyonlama-stratejileri) gibi mimari kararlarda ADR formatını kullanmak, kararın gerekçesini altı ay sonra işe başlayan birine tekrar anlatmak zorunda kalmamanızı sağlıyor.

## Tahminleri gerçekle nasıl karşılaştırırsınız?

Gözden geçirme tarihi geldiğinde girdiyi tekrar açın ve beklenen sonuçla gerçekte olanı yan yana yazın; aradaki fark, güven seviyenizin ne kadar kalibre olduğunu gösteriyor. Güveniniz 5/5 olduğu kararların üçte biri yanlış çıkıyorsa, bu sizin aşırı özgüvenli tahmin yapma eğiliminizin somut bir kanıtı.

Bu karşılaştırmayı düzenli yapan biri zamanla iki şeyi öğreniyor: hangi tür kararlarda sistematik olarak fazla iyimser olduğunu, ve hangi bağlamlarda ilk sezgisinin aslında güvenilir olduğunu. Bu, [tükenmişliği önlemek](/tr/posts/yazilimci-tukenmisligi) için de dolaylı bir araç — çünkü "neden bu kadar çok yanlış karar verdim" hissi genelde kayıt eksikliğinden, gerçek bir yetersizlikten değil.

## AI, karar günlüğünü özetlemek için nasıl kullanılır?

Claude, ChatGPT veya Gemini'ye birikmiş girdilerinizi yapıştırıp "hangi karar türlerinde güvenim sistematik olarak yüksek ama sonuç düşük çıkıyor" gibi bir soru sormak, elle tarama yapmaktan çok daha hızlı bir desen analizi sağlıyor. Bu, [öz değerlendirme yazarken AI kullanmakla](/tr/posts/ai-ile-oz-degerlendirme-yaz) aynı prensibi izliyor: ham veriyi siz topluyorsunuz, deseni bulma işini asistana devrediyorsunuz.

Dikkat edilmesi gereken nokta, asistana ham girdileri verirken hassas bilgileri (maaş rakamları, isimler, müşteri verileri) temizlemeniz gerektiği — özetleme için bağlamın çoğu zaman anonimleştirilmiş haliyle yeterli olması işinize yarıyor.

## Karar günlüğü tutarken hangi hatalardan kaçınmalısınız?

En yaygın hata, girdiyi kararı verdikten günler sonra, sonucu az çok tahmin ettiğinizde yazmak; bu, retrospektif önyargıyı günlüğün içine sızdırıyor ve tüm egzersizi anlamsız kılıyor. Girdiyi kararı verdiğiniz anda, en geç o gün içinde yazmak, gerçek güven seviyenizi yakalamanın tek yolu.

İkinci yaygın hata, her küçük kararı kaydetmeye çalışmak. Bu, günlüğü doldurmaktan çok, onu tutmayı bırakma sebebine dönüşüyor — çünkü günlük bir yük haline geliyor. Pratik eşik: kararı geri almak bir günden fazla sürecekse veya sonucu altı aydan uzun bir süre belirsiz kalacaksa, kaydetmeye değer.

Üçüncü hata, gözden geçirme adımını hiç yapmamak. Girdiyi yazıp bir daha açmamak, günlüğü bir günlüğe değil bir arşive çeviriyor; asıl değer, gözden geçirme anında "ben ne düşünmüştüm" ile "gerçekte ne oldu" arasındaki farkı görmekten geliyor.

## Kişisel günlük mü, ekip günlüğü mü tutmalısınız?

İkisi de farklı amaca hizmet ediyor: kişisel günlük kendi karar kalitenizi geliştirmek için, ekip günlüğü ise aynı hataları farklı kişilerin tekrarlamasını önlemek için. Bir ekip, [suçlamasız postmortem](/tr/posts/suclamasiz-postmortem-nasil-yapilir) sürecinde ortaya çıkan dersleri karar günlüğüne eklerse, bir sonraki benzer kararda bu dersler otomatik olarak gündeme geliyor.

Kendi değerlendirmem: çoğu insan karar günlüğünü ilk iki hafta tutup bırakıyor, çünkü anlık faydası görünmüyor. Asıl değer üç-dört ay sonra, geriye dönüp "bu konuda ne düşünmüştüm" sorusuna net bir cevap bulduğunuzda ortaya çıkıyor.

Bu yüzden günlüğü bir disiplin değil bir sözleşme gibi düşünmek daha işe yarıyor: her girdiye koyduğunuz gözden geçirme tarihini takvime de eklerseniz, günlük kendiliğinden hatırlatıcıya dönüşüyor ve tutma alışkanlığı sizin motivasyonunuza değil, takvim bildirimine bağlı kalıyor.

Bu küçük değişiklik, günlüğü "bir gün gözden geçiririm" niyetinden çıkarıp somut bir takvim etkinliğine bağlıyor; motivasyona dayanan hiçbir alışkanlık uzun vadede güvenilir olmuyor, ama bir takvim bildirimi her zaman aynı anda çalıyor.

## Sıkça Sorulan Sorular

### Karar günlüğü ile ADR arasındaki fark nedir?

Karar günlüğü kişisel veya ekip içi herhangi bir kararı kapsayabilir ve esnek bir formatta tutulur; ADR ise özellikle mimari ve mühendislik kararları için Nygard'ın önerdiği sabit dört bölümlü formatı (Durum, Bağlam, Karar, Sonuçlar) kullanır ve kodla birlikte repoda saklanır.

### Her karar için günlük tutmak gerekir mi?

Hayır, sadece geri alınması zor veya sonucu belirsiz kararlar için tutmak yeterli. Günlük öğle yemeği gibi düşük riskli, kolayca geri alınabilir kararları kaydetmek zaman kaybı; asıl değer büyük, belirsiz kararlarda ortaya çıkıyor.

### Karar günlüğünü hangi sıklıkla gözden geçirmelisiniz?

Her girdiye kendi gözden geçirme tarihini koymak en iyi yöntem; bazı kararlar bir ay içinde sonuçlanır, bazıları altı ay sürer. Sabit bir aylık tarama yerine her kararın kendi doğal zaman çizelgesine göre gözden geçirilmesi daha doğru sonuç veriyor.

### AI karar günlüğü tutmamda nasıl yardımcı olabilir?

Birikmiş girdilerinizi özetleyip tekrarlayan desenleri (örneğin hep belirli bir karar türünde aşırı iyimser olmanız gibi) bulmanıza yardımcı olabilir. Ham kararı siz veriyorsunuz, desen analizini asistana bırakıyorsunuz; hassas bilgileri paylaşmadan önce temizlemeniz gerekiyor.
