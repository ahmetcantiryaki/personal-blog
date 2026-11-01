---
title: "Hatasız Saat Dilimi ve Zaman Damgası Yönetimi"
slug: "hatasiz-saat-dilimi-ve-zaman-damgasi-yonetimi"
translationKey: "time-zones-timestamps-without-bugs"
locale: "tr"
excerpt: "Kısa cevap: zaman damgasını UTC olarak saklayın, timestamptz kullanın, telde ofsetli ISO 8601 gönderin, görüntülemeyi en son adımda kullanıcı saatine bırakın."
category: "software-engineering"
tags: ["postgresql", "backend", "best-practices", "testing"]
publishedAt: "2026-11-01"
seoTitle: "Saat Dilimi ve Zaman Damgası Hataları Nasıl Önlenir?"
seoDescription: "UTC mi yerel saat mi, timestamptz mi timestamp mi, ISO 8601 nasıl gönderilir? Saat dilimi hatalarını önleyen pratik kontrol listesi ve test yöntemleri."
---

Kısa cevap: her zaman damgasını veritabanında UTC olarak ve `timestamptz` tipiyle saklayın, servisler arası iletişimde ofsetli ISO 8601 formatı kullanın, görüntülemeyi ise en son adımda kullanıcının tarayıcı saat dilimine bırakın. Bu üç kural uygulanmadığında, DST (yaz saati) geçişlerinde randevular bir saat kayar, tekrarlayan etkinlikler yanlış günde tetiklenir.

## UTC ile yerel saat arasındaki fark nedir?

UTC, dünya üzerindeki tek bir referans anı ("instant") temsil eder; yerel saat ise o anın belirli bir saat diliminde nasıl göründüğünü gösteren "duvar saati" (wall-clock) gösterimidir. Bir sunucu olayı "2026-11-01 14:00 UTC" olarak kaydedildiğinde bu an tüm dünyada aynıdır, ama aynı anın İstanbul'daki duvar saati karşılığı yaz/kış saati uygulamasına göre değişebilir.

Bu ayrımı karıştırmanın en yaygın sonucu, bir etkinliği "yerel saatle" saklayıp sunucunun saat dilimi ayarı değiştiğinde ya da kullanıcı farklı bir bölgeden geldiğinde o kaydın anlamını kaybetmesidir. Instant (an) her zaman sabittir; wall-clock (duvar saati) gösterimi ise bakış açınıza bağlıdır — veritabanı tasarımınızın hangisini sakladığını bilmeniz gerekir.

## Postgres'te timestamptz mi, timestamp mi kullanılmalı?

Çoğu durumda `timestamptz` kullanılmalı, çünkü bu tip bir anı (instant) saklar ve girişteki ofseti hesaba katarak UTC'ye çevirir; `timestamp` ise ofseti tamamen göz ardı eder ve sadece tarih-saat alanlarını saklar. İkisi de diskte aynı 8 byte'ı kaplar — `timestamptz` ekstra yer kullanmaz, sadece girdiyi farklı yorumlar.

Fark pratikte şöyle ortaya çıkıyor: `+05:00` ofsetiyle gelen bir değeri `timestamp` sütununa yazdığınızda ofset sessizce atılır ve değer olduğu gibi saklanır; aynı değeri `timestamptz` sütununa yazdığınızda Postgres bunu UTC karşılığına çevirip saklar, okurken de oturumun `timezone` ayarına göre görüntüler.

```sql
-- timestamp: ofset dikkate alınmaz, değer olduğu gibi saklanır
SELECT '2026-11-01 14:00:00+05:00'::timestamp;
-- 2026-11-01 14:00:00

-- timestamptz: ofset hesaba katılır, UTC'ye çevrilir
SELECT '2026-11-01 14:00:00+05:00'::timestamptz;
-- session timezone UTC ise: 2026-11-01 09:00:00+00
```

`timestamp` tipini sadece gerçekten saat dilimi bilgisi taşımayan değerler için ayırın — örneğin bir tarifteki "fırını 180 derecede 20 dakika önceden ısıtın" gibi, hiçbir coğrafi konumla ilişkili olmayan süre ifadeleri.

## ISO 8601'i telde nasıl göndermelisiniz?

API'ler arası iletişimde zaman damgalarını her zaman ofsetli ISO 8601 formatında gönderin — örneğin `2026-11-01T09:00:00Z` veya `2026-11-01T14:00:00+05:00` — çünkü bu format hem makine tarafından ayrıştırılabilir hem de belirsizlik bırakmaz. "01/11/2026 2:00 PM" gibi yerel formatlar hangi takvim düzenine (gün/ay mı, ay/gün mü) ait olduğunu belirtmediği için servisler arası entegrasyonlarda hataya açıktır.

| Format | Örnek | Belirsizlik |
|---|---|---|
| ISO 8601 (Z) | `2026-11-01T09:00:00Z` | Yok — UTC anı net |
| ISO 8601 (ofset) | `2026-11-01T14:00:00+05:00` | Yok — ofset belirtilmiş |
| Unix epoch (saniye) | `1762000800` | Yok ama insan tarafından okunamaz |
| Yerel format | `01/11/2026 14:00` | Yüksek — gün/ay sırası belirsiz |

Bir API sözleşmesi tasarlarken "zaman damgası" alanını hiçbir zaman çıplak `"14:00"` gibi bir dize olarak bırakmayın; her zaman tarih, saat ve ofset birlikte gitmeli.

## Kullanıcının saat dilimine dönüşüm nerede yapılmalı?

Dönüşümü veritabanında veya iş mantığında değil, en son adımda — render katmanında — yapmalısınız; böylece aynı UTC değeri, isteği yapan kullanıcının tarayıcı saat dilimine göre doğru görüntülenir. Postgres'te bunu `SELECT created_at AT TIME ZONE 'Europe/Istanbul'` gibi bir sorguyla yapabilirsiniz, ama günlük işlerde bu dönüşümü istemci tarafında `Intl.DateTimeFormat` ile yapmak daha güvenlidir çünkü kullanıcının gerçek saat dilimini sunucu değil tarayıcı bilir.

Sunucu tarafında saat dilimi dönüşümü yapmanız gereken tek durum, e-posta veya PDF gibi statik bir çıktı üretirken kullanıcının kayıtlı tercih saat dilimini kullanmanızdır; bu durumda dönüşümü render anında yapıp sonucu asla veritabanına geri yazmamalısınız.

## DST geçişleri hangi tuzakları barındırır?

DST (yaz saati) tuzaklarının çoğu, bir ülkenin saat uygulamasını değiştirdiği ya da bir tarihte saatin bir ileri/bir geri alındığı an etrafında oluşur; bu geçiş sırasında bazı yerel saatler ya hiç var olmaz ya da iki kez var olur. Örneğin saatlerin ileri alındığı gecede 02:30 gibi bir yerel saat o gün hiç yaşanmaz; saatlerin geri alındığı gecede ise 02:30 o gece iki kez yaşanır ve hangi tekrara ait olduğunuz belirsizleşir.

IANA zaman dilimi veritabanının [2026e sürümü](https://www.iana.org/time-zones/releases/2026e), Manitoba'nın 2026-10-31 itibarıyla kalıcı olarak -05 ofsetine geçtiğini, [2026c sürümü](https://www.iana.org/time-zones/releases/2026c) ise Fas'ın 2026-09-20'de kalıcı +00'a geçtiğini kaydediyor — yani DST kuralları sadece takvimsel değil, siyasi kararlarla da sık sık değişiyor.

Tekrarlayan bir etkinliği ("her pazartesi 09:00'da toplantı") kaydederken bunu UTC'ye sabit bir ofsetle değil, "yerel saat dilimi + wall-clock saat" olarak saklamalısınız; aksi halde DST geçtiğinde toplantı saati bir saat kayar. Takvim uygulamaları bu yüzden tekrarlayan etkinlikleri `America/New_York` gibi bir bölge adı ve `09:00` wall-clock değeriyle birlikte saklar, sabit bir UTC ofsetiyle değil.

## IANA zaman dilimi veritabanı neden sürekli güncelleniyor?

IANA tz veritabanı, hükümetlerin DST kurallarını, saat dilimi sınırlarını veya kalıcı ofset kararlarını değiştirmesi her gerçekleştiğinde güncellenir; bu değişiklikler yılda birkaç kez gelir ve önceden tahmin edilemez çünkü siyasi kararlara bağlıdır. 2026 yılı içinde yayınlanan [2026a'dan 2026e'ye kadar beş sürüm](https://www.iana.org/time-zones/releases), Alberta, Kanada'nın Kuzeybatı Toprakları, Britanya Kolumbiyası, Fas ve Manitoba'nın kalıcı saat uygulamasına geçiş kararlarını içeriyor.

Bunun pratik sonucu şu: sunucunuzdaki `tzdata` paketini (veya dilinizin zaman dilimi kütüphanesini) güncel tutmazsanız, bir ülke saat uygulamasını değiştirdiğinde uygulamanız o bölge için yanlış ofset hesaplamaya başlar — kod değişmese bile veri güncel olmadığı için hata oluşur.

## Zaman dilimi mantığını nasıl test etmelisiniz?

Zaman dilimi mantığını test ederken sistem saatini dondurup (freeze) belirli, bilinçli seçilmiş anlarda çalıştırmalı ve en az bir "alışılmadık" saat dilimini test setine dahil etmelisiniz — örneğin yarım saatlik ofsete sahip Kathmandu (UTC+5:45) veya DST uygulamayan bir bölge. Testlerinizin tamamı UTC-0 geliştirme makinenizde geçiyor diye üretimde de sorunsuz çalışacağı anlamına gelmez; saat dilimi hataları genelde sadece belirli ofsetlerde ortaya çıkar.

```text
Test matrisi önerisi:
1. UTC (temel durum)
2. America/New_York (DST uygulayan, negatif ofset)
3. Asia/Kathmandu (UTC+5:45, standart olmayan ofset)
4. Pacific/Kiritimati (UTC+14, en uç pozitif ofset)
5. DST geçiş gecesi (örn. 02:30 yerel saatin var olmadığı/iki kez var olduğu an)
```

Kendi değerlendirmem: ekipler genelde zaman dilimi testini "sonra ekleriz" diye erteliyor çünkü geliştirme ortamında UTC kullanmak her şeyi basitleştiriyor gibi görünüyor. Ama bu, [yapılandırılmış loglama](/tr/posts/gercekten-ise-yarayan-yapilandirilmis-loglama) yazısında bahsedilen "sonra düzeltiriz" tuzağının aynısı — DST geçişinde üretimde patlayan bir randevu hatası, test matrisine Kathmandu eklemekten çok daha maliyetli.

Çok kiracılı bir sistemde bu sorun katlanıyor: her kiracının kendi saat dilimi tercihi olabiliyor ve [API versiyonlama](/tr/posts/api-versiyonlama-stratejileri) yazısında ele alınan geriye uyumluluk kararları gibi, zaman damgası formatını sonradan değiştirmek mevcut entegrasyonları kırma riski taşıyor — bu yüzden sözleşmeyi ilk günden ISO 8601 ve UTC üzerine kurmak gerekiyor.

Bir üretim olayında zaman dilimi hatasının kök nedenini bulmak, genelde [suçlamasız bir postmortem](/tr/posts/suclamasiz-postmortem-nasil-yapilir) sürecinde ortaya çıkıyor: "neden bu randevu bir saat kaymış" sorusunun cevabı çoğu zaman tek bir satırda saklı — sabit bir UTC ofseti, bölge adı olmadan kodlanmış. Postmortem raporuna "bir dahaki sefere dikkat edelim" yazmak yerine, o satırı bulup aynı hatanın tekrar oluşmasını engelleyecek bir test eklemek, kalıcı çözüm arasındaki farkı oluşturuyor.

## Sıkça Sorulan Sorular

### Postgres'te timestamptz mi timestamp mi kullanmalıyım?

Çoğu durumda `timestamptz` kullanmalısınız; bu tip bir anı (instant) saklar ve girişteki ofseti hesaba katarak UTC'ye çevirir. `timestamp` tipini sadece saat dilimiyle hiç ilişkisi olmayan, salt wall-clock değerler için ayırın.

### Zaman damgalarını API'ler arasında hangi formatta göndermeliyim?

Ofsetli ISO 8601 formatında gönderin — örneğin `2026-11-01T09:00:00Z`. Bu format makine tarafından kesin ayrıştırılabilir ve "gün/ay mı ay/gün mü" gibi belirsizlik taşımaz.

### DST geçişinde tekrarlayan etkinlikler neden kayıyor?

Etkinlik sabit bir UTC ofsetiyle değil, bölge adı ve wall-clock saatiyle saklanmadığında kayıyor. Saat uygulaması değiştiğinde (DST geçişi veya kalıcı ofset kararı) sabit ofsetle saklanan etkinlik artık istenen yerel saate denk gelmiyor.

### IANA zaman dilimi veritabanını ne sıklıkla güncellemeliyim?

Her yeni sürüm çıktığında güncellemelisiniz; 2026 yılında beş sürüm (2026a-2026e) yayınlandı çünkü hükümetler saat uygulamalarını yıl içinde birkaç kez değiştirdi. Güncel olmayan `tzdata`, bir bölge saat uygulamasını değiştirdiğinde yanlış ofset hesaplamasına yol açar.
