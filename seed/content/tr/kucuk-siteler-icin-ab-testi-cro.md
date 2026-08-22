---
title: "Az Trafikli Sitede A/B Testi Nasıl Yapılır?"
slug: "kucuk-siteler-icin-ab-testi-cro"
translationKey: "ab-testing-cro-small-sites-2026"
locale: "tr"
excerpt: "Kısa cevap: birkaç haftada varyant başına yaklaşık 1.000 dönüşüme ulaşamıyorsan klasik A/B testini bırak; sıralı test veya niteliksel araştırmaya geç."
category: "digital-marketing"
tags: ["ab-testing", "conversion-optimization", "marketing-analytics"]
publishedAt: "2026-08-22"
seoTitle: "Az Trafikli Sitede A/B Testi: Gerçekten İşe Yarayan"
seoDescription: "Klasik A/B testi güvenilir olmak için varyant başına yaklaşık 1.000 dönüşüm ister. Az trafikte test önceliklendirme, yanlış kazanan ve doğru araçlar burada."
---

Kısa cevap: siten birkaç hafta içinde varyant başına yaklaşık 1.000 dönüşüm üretemiyorsa, klasik sabit örneklemli A/B testi sana yardım etmekten çok yanıltır. Önce bir önceliklendirme çerçevesiyle daha az ama daha büyük testler seç, sabit örneklem gerektirmeyen sıralı ya da Bayesyen test yöntemlerine geç, trafik bölmeden önce ısı haritaları, oturum kayıtları ve doğrudan kullanıcı geri bildirimi gibi niteliksel sinyallerle neyi düzelteceğini bul.

## Geçerli Bir A/B Testi İçin Kaç Dönüşüm Gerekir?

CRO pratisyenlerinin ortak görüşüne göre gerçek bir farkı güvenilir şekilde saptamak için varyant başına yaklaşık 1.000 dönüşüm gerekir; varyant başına yaklaşık 350 dönüşüme dayanan sonuçlar sadece "yönlendirici"dir, kesin değildir. [AB Tasty](https://www.abtasty.com/blog/sample-size-calculation/) çalışılabilir bir taban olarak 10.000 ziyaretçi ve varyant başına 300 dönüşüm öneriyor; [GuessTheTest](https://guessthetest.com/calculating-sample-size-in-a-b-testing-everything-you-need-to-know/) ise yüksek güven için 30.000 ziyaretçi ve varyant başına yaklaşık 3.000 dönüşüm gibi daha muhafazakâr bir eşik veriyor.

Bu rakamların arkasındaki standart istatistiksel kural, %95 güven aralığı (p < 0,05) ve %80 istatistiksel güçtür — çoğu A/B test aracının varsayılan eşiği bu. Kendi örneklem büyüklüğünü kural-ı kabul yerine hesaplamak istersen [Invesp'in matematik anlatımı](https://www.invespcro.com/blog/calculating-sample-size-for-an-ab-test/) yardımcı olur. Varyant başına 100 dönüşümün altında asla sonuç çıkarma — bu hacimde "kazananın" tesadüf olma ihtimali yüksektir.

## Trafiğin Yeterli Değilse Ne Yapmalısın?

Çok sayıda küçük test yerine, testten vazgeçmeden daha az ama daha büyük testler çalıştır ve test yöntemini değiştir. [VWO'nun rehberi](https://vwo.com/blog/how-to-calculate-ab-test-sample-size/) ödünleşimi net koyuyor: düşük trafikli siteler varyant başına yaklaşık 1.000+ dönüşümle ancak büyük artışları (%10 ve üzeri) güvenilir şekilde saptayabiliyor; yüksek trafikli siteler ise varyant başına yaklaşık 5.000 dönüşümü aştığında %5-7 gibi küçük artışları bile yakalayabiliyor. Az trafikli bir sitede %3'lük bir artışın peşindeysen, büyük ihtimalle trafiği boşa harcıyorsundur.

Hacim kısıtlıyken işe yarayan iki somut alternatif var:

- **Bayesyen test**, sabit örneklemde ikili geçti/kaldı sonucu yerine sürekli bir olasılık raporlar ("B'nin A'yı geçme ihtimali %87"), böylece daha erken kullanılabilir bir okuma elde edersin. [CXL'in A/B testi alternatifleri incelemesi](https://cxl.com/blog/ab-testing-alternatives/) mekanizmayı anlatıyor.
- **Sıralı test, boyalı kapı (painted-door) testi ve niteliksel araştırma** (kullanılabilirlik oturumları, ağaç testi), trafik gerçekten bölünmüş test kaldıramadığında testin yerini tamamen alır. [Mouseflow'un düşük trafik CRO rehberi](https://mouseflow.com/blog/cro-for-low-website-traffic-7-tactics-for-optimizing-without-a-b-testing/) yedi böyle taktik listeliyor.

Bu yöntemlerin ortak noktası, sonucu "kazandı/kaybetti" ikiliğine sıkıştırmak yerine kanıtı kademeli olarak biriktirmesi; az trafikli bir site için bu, haftalarca bekleyip sonunda anlamsız bir p-değeriyle karşılaşmaktan çok daha az yıpratıcı bir çalışma şekli.

## Önce Hangi Testi Yapmalısın: ICE mi PIE mi?

Bir fikri kodlamadan önce ICE (Impact, Confidence, Ease — Etki, Güven, Kolaylık) veya PIE (Potential, Importance, Ease — Potansiyel, Önem, Kolaylık) ile puanla; her iki çerçeve de fikirleri her boyutta 1-10 arası puanlar ve puanları çarpıp/ortalayarak sıralar. ICE, bir fikrin işe yarayacağına dair güvenini ağırlıklandırır; PIE ise sayfanın zaten aldığı trafik ve dikkati ağırlıklandırır. Yığınında test edilmemiş çok sayıda tahmin varsa ICE'yi, hangi sayfaların dikkati hak ettiğine karar veriyorsan PIE'yi seç.

Az trafikli bir sitede her iki çerçevenin de asıl değeri, sınırlı trafiğini aynı anda beş deneye bölüp hepsini istatistiksel olarak sonuçsuz bırakmak yerine, tek seferde iyi gerekçelendirilmiş bir testi çalıştırmaya seni zorlamasıdır.

## Sitende Önce Neyi Test Etmelisin?

Ziyaretçinin dönüşüm kararını verdiği ana en yakın elemanları şu sırayla test et: başlık ve değer önerisi, birincil harekete geçirici çağrı (metin, renk, konum), form uzunluğu ve alan sayısı, karar noktasındaki sosyal kanıt (yorumlar, logolar, referanslar). Ekiplerin bu aşamayı en sık nasıl baltaladığını [Dönüşüm Düşüren Landing Page Hataları](/tr/posts/donusum-dusuren-landing-page-hatalari) yazımızda ele aldık — ilk testini kurmadan önce okumaya değer, çünkü bariz bir hatayı düzeltmek genelde onun etrafında test yapmaktan daha iyi sonuç verir.

## Sonuçlara Erken Bakmak Neden Yanlış Kazanan Üretir?

Bir testin anlamlılığını her gün kontrol edip %95'i geçer geçmez durdurmak, kabul ettiğini sandığın %5'lik hata oranını fazlasıyla şişirir; çünkü her bakış, rastgele gürültünün anlamlı görünmesi için yeni bir şans yaratır. Buna bazen "opsiyonel durdurma" (optional stopping) denir ve az trafikli ekiplerin kaybeden bir varyantı kazanan sanmasının en yaygın yoludur. Örneklem büyüklüğünü ve test süresini önceden — sezgiyle değil bir hesaplayıcıyla — belirle ve panel 3. günde ne kadar heyecan verici görünürse görünsün, hedefe ulaşmadan sonuca göre hareket etme.

## Isı Haritaları ve Oturum Kayıtları Az Trafikte Neden Daha Önemli?

Niteliksel sinyaller, bölünmüş bir testin tek başına gösteremeyeceği şeyi gösterir: ziyaretçilerin *neden* çıktığını ya da tereddüt ettiğini. Bunun için istatistiksel anlamlılığa da ihtiyaç yoktur. Beş farklı kullanıcının bir formda aynı alanda vazgeçtiğini gösteren tek bir oturum kaydı, aynı form üzerinde teknik olarak sonuçsuz kalmış bir A/B testinden az trafikli bir site için daha güçlü bir sinyaldir. Kayıtları kısa bir sayfa içi anketle ("Bunu tamamlamana neredeyse ne engel oldu?") eşleştirerek *ne*nin arkasındaki *neden*i yakala.

## Küçük Bütçeyle Hangi Araçlar İşe Yarar?

| Araç | Ücretsiz katman | Ücretli | En iyi olduğu iş |
| --- | --- | --- | --- |
| Microsoft Clarity | Sınırsız kayıt ve ısı haritası, trafik sınırı yok | Tamamen ücretsiz | Isı haritası + oturum kaydı, 2026'da eklenen AI oturum özetleri |
| PostHog | Ayda 5.000 oturum kaydı | Ücretsiz katmanın üstünde kayıt başına 0,005 dolar; açık kaynak self-host (MIT lisansı) mevcut | Kayıt + ürün analitiği + feature flag tek araçta |
| VWO | Sadece deneme | Ücretli planlar, fiyat talep üzerine | Yerleşik Bayesyen istatistiklerle tam A/B testi |

Kaynak: [Microsoft Clarity fiyatlandırma](https://clarity.microsoft.com/pricing), [PostHog ve Clarity karşılaştırması](https://productanalytics.tools/compare/microsoft-clarity-vs-posthog/). Aylık 10.000 ziyaretçinin altındaki bir site için, ayrı bir A/B test platformuna para vermeden önce niteliksel sinyaller için Clarity veya PostHog'un ücretsiz katmanıyla başla — genelde bölünmüş bir testin ortaya çıkaracağından daha değerli düzeltmeler bulursun.

Ayrı bir test platformu olmadan çalıştırılabilecek kadar sade, minimal bir deney yapılandırması:

```json
{
  "experiment": "checkout-cta-color",
  "variants": ["control", "green-cta"],
  "trafficSplit": [0.5, 0.5],
  "primaryMetric": "checkout_completed",
  "minConversionsPerVariant": 1000,
  "stopEarlyOnSignificance": false
}
```

Burada önemli alan `stopEarlyOnSignificance: false` — erken bakmaya karşı yapılandırma seviyesindeki güvence bu.

## Test Önceliklendirme Çalışma Sayfası

```text
Her test fikrini 1-10 arası puanla:
- Etki:   Birincil metriği ne kadar hareket ettirebilir?
- Güven:  Bu fikri destekleyen ne kadar kanıt (veri, önceki test, araştırma) var?
- Kolaylık: Ne kadar hızlı yayınlayıp ölçebilirsin?
ICE puanı = Etki x Güven x Kolaylık

Testi kurmadan önce doğrula:
- Bu sayfa/akış, test penceren içinde varyant başına ~1.000 dönüşüme
  gerçekçi şekilde ulaşabilir mi? Hayırsa -> sabit örneklemli bölünmüş
  test yerine Bayesyen/sıralı test ya da niteliksel araştırma kullan.
- Örneklem büyüklüğü ve test süresi önceden, yazılı olarak belirlendi mi?
- Bu hipotezi destekleyen niteliksel bir sinyal (kayıt, anket) var mı,
  yoksa saf bir tahmin mi?
```

Her testten önce bu çalışma sayfasını uygulamak, dönüşüm oranını gerçekten iyileştiren az trafikli siteler ile trafiğini sonuçsuz deneylerde tüketen siteler arasındaki asıl farkı yaratır. CRO çalışmasını gelirle bağlamanın daha geniş resmini görmek için [tek kişilik işletmeler için pazarlama hunisi rehberimize](/tr/posts/tek-kisilik-isletme-pazarlama-hunisi) bakabilirsin. Daha fazlası için [dijital pazarlama kategorimize](/tr/category/dijital-pazarlama) göz at.

## Sıkça Sorulan Sorular

### A/B testi çalıştırmak için kaç ziyaretçiye ihtiyacım var?

Anlamlı bir artışta güvenilir sonuç için varyant başına yaklaşık 1.000 dönüşüm, büyük bir beklenen etki büyüklüğü varsa en az varyant başına 300 dönüşüm gerekir. Varyant başına 100 dönüşümün altında sonuç çıkarma — bu istatistiksel gürültüdür.

### Trafik çok azken A/B testinin alternatifi nedir?

Sabit geçti/kaldı yerine sürekli olasılık veren Bayesyen test, sıralı test, boyalı kapı testi ya da oturum kaydı ve kullanılabilirlik testi gibi niteliksel araştırmaları kullan. Dördü de önceden belirlenmiş bir örneklem büyüklüğü gerektirmeden çalışır.

### ICE ve PIE önceliklendirmesi arasındaki fark nedir?

ICE (Etki, Güven, Kolaylık) fikrin işe yarayacağına dair güveni ağırlıklandırır; PIE (Potansiyel, Önem, Kolaylık) sayfanın zaten aldığı trafik ve dikkati ağırlıklandırır. Test fikri yığınını sıralamak için ICE'yi, hangi sayfaların test edilmeye değer olduğuna karar vermek için PIE'yi kullan.

### A/B testimde çıkan kazanan neden sonra işe yaramaz oldu?

Büyük ihtimalle önceden belirlediğin örneklem büyüklüğünü beklemek yerine testi istatistiksel anlamlılığı geçer geçmez durdurdun — buna "erken bakma" ya da "opsiyonel durdurma" denir ve kabul ettiğini sandığın %5'lik hata oranını fazlasıyla şişirir.
