---
title: "Küçük Ekipler İçin Olay Müdahalesi"
slug: "kucuk-ekipler-icin-olay-mudahalesi"
translationKey: "incident-response-small-teams"
locale: "tr"
excerpt: "Ayrı bir SRE ekibiniz olmadan da güvenilir nöbet kurabilirsiniz. İlk 15 dakika, tek olay komutanı, alarm hijyeni ve suçlamasız postmortem üzerine pratik rehber."
category: "devops-cloud"
tags: ["sre", "observability", "reliability", "monitoring"]
publishedAt: "2026-08-09"
seoTitle: "Küçük Ekipler İçin Olay Müdahalesi Rehberi"
seoDescription: "Ayrı bir SRE ekibi olmadan güvenilir nöbet ve olay müdahalesi kurmanın yolu: tek olay komutanı, ilk 15 dakika kuralı, alarm hijyeni ve suçlamasız postmortem."
---

Yaygın kanı şu: "gerçek" olay müdahalesi için ayrı bir SRE ekibine, PagerDuty lisansına ve kalın bir runbook kütüphanesine ihtiyacınız var. Bu yanlış. On kişilik bir ekip, üç kişilik bir ekipten daha az disiplinle değil, daha az süreçle olay müdahalesi yapmalı — ve bu, tesadüfen değil, kasıtlı bir tasarım tercihi olmalı.

## Yorucu Olmayan Bir Nöbet Sistemi

Küçük ekiplerin en büyük hatası, büyük şirketlerin nöbet sistemini birebir kopyalamaya çalışmak: 7/24, tek kişilik, haftalık rotasyon. Üç-beş mühendislik ekibinde bu, aynı kişinin ayda bir hafta sürekli tetikte kalması demek — bu da birkaç ay içinde tükenmişliğe yol açıyor. Daha sürdürülebilir bir model, nöbet penceresini mesai saatleriyle sınırlamak ve mesai dışı sadece "gerçekten kritik" alarmları (ödeme akışı, veri kaybı riski) tetiklemek üzere ayarlamak. Gece 3'te "disk kullanımı %85'i geçti" uyarısı almanın hiçbir mühendise faydası yok; bu tarz uyarılar sabah ilk iş olarak bakılacak bir kuyruğa düşmeli, telefonu titretmemeli.

## Ciddiyet Seviyeleri ve Tek Olay Komutanı

Küçük bir ekipte bile üç seviyeli basit bir ciddiyet skalası işe yarıyor: Sev1 (tam kesinti veya veri kaybı riski, anında müdahale), Sev2 (kısmi bozulma, kullanıcıların bir kısmı etkileniyor) ve Sev3 (düşük etkili, mesai saatinde çözülebilir). Kritik olan, her Sev1/Sev2 olayında tek bir kişinin "olay komutanı" rolünü üstlenmesi — bu kişi kodu düzeltmiyor, koordinasyonu yönetiyor: kim ne yapıyor, ne zaman güncelleme paylaşılacak, ne zaman eskale edilecek. İki kişi aynı anda "ben yönetiyorum" moduna girdiğinde, koordinasyon kaybolur ve olay daha da uzar.

## İlk 15 Dakika: Sakinleştir, İletişim Kur, Kör Debug Yapma

Bir olay bildirildiğinde ilk 15 dakikada yapılması gereken şey debug etmek değil, durumu stabilize etmek ve iletişim kurmak. Pratik sıralama şöyle:

1. Etkiyi doğrula (gerçekten kullanıcı etkileniyor mu, yoksa yanlış alarm mı?)
2. Ciddiyet seviyesini ata ve olay komutanını belirle
3. Statü kanalını aç (Slack kanalı, statüs sayfası) ve "araştırıyoruz" mesajını paylaş
4. Mümkünse geri al (son deploy'u geri al, feature flag'i kapat) — kök nedeni bulmadan önce
5. Kök neden analizine ancak stabilizasyondan sonra geç

Bu sıralamanın en sık ihlal edilen adımı dördüncüsü. Mühendisler genelde "önce neden olduğunu anlayayım" refleksiyle debug'a dalıyor, oysa son deploy'u geri almak genelde kök neden analizinden çok daha hızlı bir stabilizasyon yolu. [Retry, backoff ve circuit breaker yazımızda](/tr/posts/retry-backoff-circuit-breaker) anlattığımız gibi, sistemin kendi kendini koruyan mekanizmaları varsa bu ilk 15 dakika çok daha az stresli geçiyor.

[Google'ın olay yönetimi rehberi](https://sre.google/resources/practices-and-processes/incident-management-guide/) da benzer bir sıralamayı öneriyor: önce etkiyi sınırlamak, sonra anlamak. Küçük ekiplerde bu ilkeyi uygulamanın en pratik yolu, "geri al" seçeneğini her zaman elinizin altında tutmak — bunun için her deploy'un tek komutla geri alınabilir olması gerekiyor. Geri alma mekanizması karmaşık ya da manuel adımlar gerektiriyorsa, kriz anında tam da en çok ihtiyaç duyduğunuz anda devre dışı kalıyor.

## Suçlamasız Postmortem: Gerçekten İşe Yarayan Kısım

[Google'ın SRE kitabındaki postmortem kültürü bölümü](https://sre.google/sre-book/postmortem-culture/), bir postmortemin gerçekten "suçlamasız" sayılması için hiçbir kişiyi ya da ekibi kötü niyetli davranışla itham etmemesi gerektiğini vurguluyor — herkesin, elindeki bilgiyle o an doğru olduğunu düşündüğü şeyi yaptığı varsayılıyor. Bu sadece bir "kibarlık" meselesi değil; suçlama kültürü hâkim olduğunda insanlar hataları saklamaya başlıyor ve saklanan hatalar tekrar ediyor. Suçlamayı ortadan kaldırmak, sistemik sorunları düzeltmenin tek gerçek yolu çünkü insanların dürüstçe "şu adımı atlamıştım" diyebilmesini sağlıyor.

Postmortemin işe yaraması için üç şart var: zaman çizelgesi olayın gerçek akışını (varsayımları değil) yansıtmalı, en az bir eylem maddesi gerçekten bir sprint'e girmeli (postmortem'de yazılıp asla yapılmayan eylem maddeleri, postmortem kültürünü boşa çıkarıyor) ve postmortem olaydan en geç 48 saat sonra yazılmalı — hafıza taze kalırken. [incident.io'nun postmortem en iyi pratikleri yazısında](https://incident.io/blog/sre-incident-postmortem-best-practices) da vurgulandığı gibi, bir postmortem şablonu ne kadar iyi olursa olsun, eylem maddelerinin gerçek bir sahibi ve gerçek bir tarihi yoksa belge bir arşiv dosyasına dönüşüyor — takip mekanizması olmayan postmortem, hiç yazılmamış postmortemden biraz daha iyi.

Küçük ekiplerde postmortem toplantısını atlamak cazip geliyor çünkü "zaten hepimiz ne olduğunu biliyoruz" hissi oluşuyor. Ama tam da bu grup küçüklüğü, toplantıyı değerli kılan şey: üç-dört kişilik bir ekipte herkesin aynı odada 30 dakika geçirmesi, büyük bir şirkette haftalarca sürecek bir süreci tek oturumda bitirebiliyor. Bu toplantıyı tamamen atlamak, kısa vadede zaman kazandırsa da, aynı hatanın üç ay sonra tekrar etmesi ihtimalini artırıyor.

## Alarm Hijyeni: Az Ama Doğru Alarm

Alarm yorgunluğu (alert fatigue), gerçek olayların gürültü içinde kaybolmasının en yaygın nedeni. Bir mühendis günde 20 düşük öncelikli uyarı alıyorsa, 21. uyarının gerçekten kritik olup olmadığını ayırt etme becerisi köreliyor. Pratik kural: her alarm, ya "şimdi bir insan bir şey yapmalı" ya da "bu alarmı silmeli/eşiğini değiştirmeliyiz" sorusuna net bir cevap vermeli. Aradaki gri bölge — "bilgilendirici ama aksiyon gerektirmeyen" alarmlar — bir dashboard'a taşınmalı, telefonu titretmemeli.

| Alarm türü | Nereye gitmeli |
|---|---|
| Kullanıcı etkisi var, hemen aksiyon gerekiyor | Telefon/nöbet bildirimi |
| Trend kötüleşiyor ama henüz etki yok | Slack kanalı, sabah gözden geçirilir |
| Bilgilendirici, aksiyon gerektirmiyor | Dashboard, hiçbir bildirim yok |

[Observability 101 yazımızda](/tr/posts/observability-nedir) log, metrik ve trace ayrımını detaylı işledik; iyi bir alarm hijyeni, bu üç veri türünün hangisinin gerçek zamanlı bildirim, hangisinin sabah incelemesi gerektirdiğini netleştirmekle başlıyor.

Alarm listesini düzenli gözden geçirmemenin bedeli birikimli. Her yeni özellik genelde birkaç yeni alarmla birlikte geliyor, ama eski alarmlar nadiren kaldırılıyor — çünkü "belki bir gün işe yarar" düşüncesi siliyor değil, biriktiriyor. Altı ay sonra kimsenin tam olarak neden var olduğunu hatırlamadığı, kimsenin tepki vermediği düzinelerce alarm birikiyor ve bu, gerçek bir Sev1 alarmının da aynı gürültü kategorisine düşme riskini artırıyor.

## Küçük Ekip, Hafif Ama Var Olan Süreç

Bu yazının çıkarımı "küçük ekipler süreç kurmasın" değil — tam tersi, süreç kurmalı ama büyük şirketlerin ağırlığını taşımadan. [Kesintisiz deployment yazımıza](/tr/posts/kesintisiz-deployment) göz atarsanız, olay sayısını en baştan azaltan deployment pratiklerini de görebilirsiniz; en iyi olay müdahalesi, hiç gerçekleşmeyen olaydır. [Veritabanı yedekleme ve felaket kurtarma rehberimiz](/tr/posts/veritabani-yedekleme-ve-felaket-kurtarma) de Sev1 senaryolarının en ağırı olan veri kaybı durumunda ilk 15 dakikanızı belirleyecek hazırlığı kapsıyor.

## Olay Runbook Şablonu

```text
# Olay: <kısa başlık>
Ciddiyet: Sev1 / Sev2 / Sev3
Olay komutanı: <isim>
Başlangıç: <zaman>

## Durum
- Etki: <kim/ne etkileniyor>
- Mevcut hipotez: <varsa>

## Zaman çizelgesi
- HH:MM - <ne oldu>

## Aksiyonlar
- [ ] Statü kanalı açıldı
- [ ] Etki doğrulandı
- [ ] Stabilizasyon denendi (rollback/flag kapatma)
- [ ] Kök neden bulundu
- [ ] Kalıcı çözüm uygulandı
- [ ] Postmortem planlandı (48 saat içinde)
```

## Sıkça Sorulan Sorular

### Üç kişilik bir ekip 7/24 nöbet kurmalı mı?

Genelde hayır. Mesai saatleriyle sınırlı bir nöbet ve mesai dışı sadece gerçekten kritik alarmların tetiklenmesi, hem ekibi korur hem de gerçek acil durumlara odaklanmayı sağlar.

### Olay komutanı ile olayı çözen kişi aynı olabilir mi?

Küçük ekiplerde bazen kaçınılmaz, ama ideali ayırmak. Aynı kişi hem koordinasyonu yönetip hem debug yaparsa, ikisinden biri (genelde iletişim) aksıyor.

### Postmortem her olaydan sonra mı yazılmalı?

Sev1 ve Sev2 olaylarında evet. Sev3 için kısa bir not yeterli olabilir; her küçük olay için tam postmortem yazmak, süreci gereksiz ağırlaştırıp ekibi yorabilir.

### Alarm eşiklerini ne sıklıkla gözden geçirmeliyiz?

Her postmortem sonrasında ilgili alarmları gözden geçirmek iyi bir alışkanlık; ayrıca üç ayda bir tüm alarm listesini "hâlâ gerekli mi" sorusuyla taramak, alarm yorgunluğunun birikmesini önlüyor. Çoğu küçük ekip için ayrı bir olay yönetim platformu şart değil — zaten kullandığınız bir Slack kanalı, basit bir statü sayfası ve deploy geçmişini gösteren bir dashboard yeterli başlangıç noktası; özel bir platforma geçmek, nöbet rotasyonu ekip büyüdükçe gerçekten karmaşıklaştığında değerlendirilecek bir sonraki adım.
