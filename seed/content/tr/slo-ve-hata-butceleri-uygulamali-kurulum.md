---
title: "SLO ve Hata Bütçeleri: Uygulamalı Kurulum"
slug: "slo-ve-hata-butceleri-uygulamali-kurulum"
translationKey: "slos-error-budgets-practical-setup"
locale: "tr"
excerpt: "Kısa cevap: SLI'yi gerçek trafikten seç, SLO'yu buna göre belirle, hata bütçesini (1-SLO)×pencere ile hesapla ve çok pencereli yanma hızıyla koru."
category: "devops-cloud"
tags: ["sre", "monitoring", "reliability", "observability"]
publishedAt: "2026-10-28"
seoTitle: "SLO ve Hata Bütçesi Nasıl Kurulur? Uygulamalı Rehber"
seoDescription: "SLI seçimi, gerçekçi SLO belirleme, hata bütçesi matematiği ve çok pencereli yanma hızı uyarılarıyla SLO kurulumunu adım adım anlatıyoruz, örneklerle."
---

Kısa cevap: önce kullanıcının gerçekten hissettiği bir ölçümü (SLI) seç, sonra gerçek trafik verisine dayanan bir hedef (SLO) belirle, hata bütçesini `(1 - SLO hedefi) × pencere` formülüyle hesapla ve bütçeyi çok pencereli yanma hızı (burn rate) uyarılarıyla koru. Tek pencereli bir uyarı hem gürültülü hem yavaş olur; çok pencereli kural ikisini birden çözer.

## SLI, SLO ve SLA arasındaki fark ne?

SLI (Service Level Indicator), ölçtüğün şey — örneğin "200 döndüren istek yüzdesi" veya "p99 gecikme". SLO (Service Level Objective), o SLI için koyduğun hedef — örneğin "30 günlük pencerede %99,9 kullanılabilirlik". SLA (Service Level Agreement) ise bu hedefi tutmazsan ne olacağını tanımlayan, genelde müşteriyle yapılan ticari bir sözleşme — para geri ödemesi gibi bir sonucu var. SLO'yu SLA'dan daha sıkı tutmak standart pratik: SLA'yı ihlal etmeden önce fark etmek için pay bırakırsın.

## Hangi SLI'lar kullanıcının gerçekten hissettiğini yansıtır?

Kullanıcı deneyimine en yakın dört SLI türü var: kullanılabilirlik (başarılı isteklerin oranı), gecikme (p50 değil, p95/p99 yüzdelikleri — ortalama tek bir yavaş kuyruğu gizler), tazelik (veri ne kadar güncel) ve doğruluk (dönen sonuç doğru mu). Ortalama gecikmeyi SLI olarak kullanmak yaygın bir hata: ortalama, bir kullanıcının 8 saniye beklediği bir kuyruğu kolayca gizleyebilir; p99 bu kuyruğu doğrudan gösterir.

## SLO hedefini nasıl gerçekçi belirlersin?

Her şeye %99,99 hedefi koymak klasik bir hata — bu hedef, altyapının gerçekte sağladığından daha sıkı olabilir ve ekibi imkansız bir çubuğa karşı sorumlu tutar. Gerçekçi bir SLO, geçmiş 30-90 günlük gerçek trafik verisinden türetilir: servisin fiilen ne kadar güvenilir çalıştığına bak, sonra o rakamın biraz altında (örneğin fiili %99,95 performansa karşı %99,9 hedef) bir hedef koy. Bu fark, hedefi her ay yakın yakın ihlal etmeden gerçek bir hata bütçesi bırakır.

## Hata bütçesi matematiği nasıl işliyor?

Hata bütçesi = `(1 - SLO hedefi) × pencere toplamı`. %99,9 hedefli 30 günlük bir pencerede bütçe, toplam isteklerin %0,1'i kadar hata (veya kesinti) hakkı demek — 30 günde yaklaşık 43 dakikaya denk gelir. Yanma hızı (burn rate), gözlenen hata oranının izin verilen hata oranına bölümü: `gözlenen hata oranı / (1 - SLO hedefi)`. Yanma hızı 1 olduğunda bütçe tam olarak pencere sonunda tükenir; yanma hızı 14,4 olduğunda bütçe 30 günlük pencerede sadece ~1 saatte tükenir.

| Yanma Hızı | Pencerede Tükenme Süresi (30 gün) | Tipik Aksiyon |
|---|---|---|
| 1 | Pencere sonunda tam tükenir | İzle, aksiyon gerekmez |
| 3 | ~10 gün | Bilet aç, release'i gözden geçir |
| 6 | ~5 gün | Düşük öncelikli sayfa (ticket) |
| 14,4 | ~1 saat | Acil sayfa (page) |

Google SRE Workbook'un yaygın alıntılanan çok pencereli yanma hızı çerçevesi, %99,9'luk bir SLO için 14,4 yanma hızını 1 saatlik uzun pencerede (5 dakikalık kısa pencereyle doğrulanmış) acil sayfa eşiği olarak, 6 yanma hızını 6 saatlik pencerede (30 dakikalık kısa pencereyle) daha düşük öncelikli sayfa eşiği olarak öneriyor. Kısa pencere kuralı: kısa pencere, uzun pencerenin kabaca 1/12'si olmalı — bu oran, [burn rate uyarılarını açıklayan kaynaklarda](https://last9.io/blog/error-budget/) tutarlı şekilde tekrarlanıyor.

Ticket seviyesindeki eşikler kaynaklar arasında biraz farklılaşıyor — bazı kaynaklar 3 günlük pencerede 1 yanma hızı önerirken, bazıları 2 saatlik pencerede 3 yanma hızı öneriyor. Bu farkın nedeni, ticket eşiğinin acil sayfa eşiğinden daha fazla ekip tercihine bağlı olması: burada amaç "şimdi uyan" değil, "bu hafta bak" sinyali vermek. Kendi SLO'nu kurarken bu eşiği sabit bir formülden almak yerine, geçmiş gerçek kesintilerinin hangi hızda büyüdüğünü gözlemleyip ona göre ayarlamak daha güvenilir.

## Çok pencereli uyarı neden tek pencereliden daha iyi?

Çünkü tek pencereli bir uyarı ya çok gürültülü ya da çok yavaş olur: kısa bir pencere kullanırsan geçici bir trafik sıçramasında yanlış alarm verir; uzun bir pencere kullanırsan gerçek bir kesintiyi fark etmen saatler sürer. Çözüm, iki pencereyi birlikte kontrol etmek — alarm, hem uzun pencere hem kısa pencere eşiği aynı anda aşıldığında tetiklenir. Bu, [yanma hızı uyarılarını uygulayan ekiplerin](https://oneuptime.com/blog/post/2026-01-30-sre-burn-rate-alerts/markdown) standart olarak benimsediği yapı.

```promql
(
  sum(rate(http_requests_total{status=~"5.."}[1h]))
  /
  sum(rate(http_requests_total[1h]))
) > (14.4 * 0.001)
and
(
  sum(rate(http_requests_total{status=~"5.."}[5m]))
  /
  sum(rate(http_requests_total[5m]))
) > (14.4 * 0.001)
```

## Politikayı nasıl yazıp yönetime onaylatırsın?

Yazılı bir hata bütçesi politikası üç şeyi önceden netleştirmeli: bütçe tükendiğinde ne olur (yeni özellik release'leri durur, sadece güvenilirlik düzeltmeleri geçer), bütçeyi kim yeniden açar (genelde bir sonraki pencereye geçince otomatik) ve politikayı kim esnetebilir (nadiren, ve sadece üst yönetim onayıyla). Bu politikanın en zor kısmı yazmak değil, liderliğin release dondurmasını gerçekten onurlandırmasını sağlamak — bir SLO, uygulanmazsa sadece bir dashboard süsü olur.

## En sık yapılan hatalar hangileri?

Üç hata tekrar ediyor: her şeye %99,99 hedefi koymak (gerçekçi değilse SLO'yu değersizleştirir), ortalama gecikmeyi SLI olarak kullanmak (p99'u gizler) ve aksiyona dönüşemeyen semptomlara alarm kurmak (örneğin CPU kullanımına alarm kurmak, ama CPU yüksekken kullanıcı deneyimi bozulmuyorsa bu alarm gürültüden ibaret). Kendi değerlendirmem: bir SLO'nun ilk 90 günü, hedefi tutturmaktan çok hedefin doğru şeyi ölçtüğünü doğrulamaya harcanmalı.

Dördüncü, daha az konuşulan bir hata da şu: bir SLO'yu kurup sonra bir daha hiç gözden geçirmemek. Trafik deseni değiştiğinde (yeni bir müşteri segmenti, yeni bir bölge, mevsimsel yük artışı) altı ay önce gerçekçi olan bir hedef artık gerçekçi olmayabilir. SLO'yu çeyreklik bir ritimle gözden geçirmek, hedefi aspirasyonel bir sayıya dönüşmekten korur.

Bu gözden geçirmenin somut bir çıktısı olmalı: hedefi değiştiriyor musun, değiştirmiyor musun, ve değiştiriyorsan neden. Bu kararı bir toplantı notuna yazmak, altı ay sonra "bu rakamı kim, neden böyle belirlemişti" sorusuna cevap vermeni kolaylaştırıyor — SLO'nun kendisi kadar, SLO'nun tarihçesi de değerli, çünkü yeni katılan bir mühendis bu geçmişi bilmeden aynı hatayı tekrar edebilir. Bu notları SLO dokümanının kendisine ekleyip bir "değişiklik günlüğü" gibi tutmak, ekip büyüdükçe bu bilgiyi kaybetmemenin en ucuz ve en sürdürülebilir yolu.

İyi kurulmuş bir hata bütçesi, [suçlamasız bir postmortem sürecini](/tr/posts/suclamasiz-postmortem-nasil-yapilir) de besler — bütçe tükenmesi, "kimin hatası" sorusundan önce "bütçe neden tükendi" sorusunu objektif olarak gündeme getirir. Küçük ekipler için [chaos engineering](/tr/posts/kucuk-ekipler-icin-chaos-engineering) ile birleştirildiğinde, hata bütçesi gerçek kesintilerden önce hangi bağımlılığın bütçeyi en çok yakacağını test etmeni sağlar. [Geri basınç ve yük atma](/tr/posts/geri-basinc-yuk-atma-servis) stratejileri de doğrudan bütçeyi korumanın bir yolu — sistem aşırı yüklenmeden önce düşük öncelikli isteği atmak, bütçeyi tüketen bir kesintiden daha ucuz.

## Sıkça Sorulan Sorular

### SLI, SLO ve SLA arasındaki fark nedir?

SLI ölçtüğün metriktir (örneğin başarılı istek yüzdesi), SLO o metrik için koyduğun hedeftir (örneğin %99,9), SLA ise hedefi tutmazsan ne olacağını tanımlayan ticari sözleşmedir. SLO'yu SLA'dan daha sıkı tutmak, ihlali fark etmek için pay bırakır.

### Hata bütçesi nasıl hesaplanır?

Hata bütçesi `(1 - SLO hedefi) × pencere toplamı` ile hesaplanır. %99,9 hedefli 30 günlük bir pencerede bu, toplam sürenin %0,1'i kadar — yaklaşık 43 dakikalık izin verilen kesinti anlamına gelir.

### Çok pencereli yanma hızı uyarısı neden gerekli?

Tek pencereli bir uyarı ya kısa pencerede gürültülü alarm verir ya da uzun pencerede gerçek kesintiyi fark etmekte yavaş kalır. Çok pencereli kural, hem uzun pencere hem kısa pencere eşiği aynı anda aşıldığında tetiklenir, bu da yanlış alarmı azaltırken gerçek kesintiyi hızlı yakalar.

### Her servise %99,99 hedefi koymak neden yanlış?

Çünkü bu hedef genelde altyapının gerçekte sağladığından daha sıkı ve ekibi imkansız bir çubuğa karşı sorumlu tutar. Gerçekçi bir SLO, geçmiş 30-90 günlük trafik verisinden türetilmeli, aspirasyonel bir sayıdan değil.
