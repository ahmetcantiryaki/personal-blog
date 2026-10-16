---
title: "Buluttan Geri Dönüş Ne Zaman Mantıklı?"
slug: "bulut-repatriation-ne-zaman-mantikli"
translationKey: "cloud-repatriation-when-it-pays-off-2026"
locale: "tr"
excerpt: "Bulut repatriation, sabit ve öngörülebilir, yüksek egress veya depolama maliyetli yükler için mantıklı; dalgalı trafikte veya ops kapasitesi yoksa değil."
category: "devops-cloud"
tags: ["cloud", "cost-optimization", "finops", "infrastructure-as-code"]
publishedAt: "2026-10-16"
seoTitle: "Buluttan Geri Dönüş Ne Zaman Mantıklı?"
seoDescription: "Bulut repatriation, sabit ve öngörülebilir, yüksek egress veya depolama maliyetli yükler için mantıklı; dalgalı trafikte veya ops kapasitesi yoksa değil."
---

Kısa cevap: bulut repatriation (buluttan geri dönüş), iş yükü sabit ve öngörülebilirse, veri ağırlıklıysa ve şu an egress veya depolama maliyetinden para kaybediyorsa mantıklı. Trafik dalgalıysa, ekipte boşta ops kapasitesi yoksa veya iş yükü talebe göre küresel ölçeklenmesi gerekiyorsa mantıklı değil. Çoğu şirket için bu, tüm yığını değil, belirli birkaç iş yükünü geri taşımak anlamına gelir.

## Bulut repatriation nedir?

Bulut repatriation, AWS, Azure veya Google Cloud gibi genel bulut sağlayıcılarındaki iş yüklerini kendi sunucularına veya bir colocation tesisine geri taşımaktır. 2010'larda çoğu şirketin yaptığı bulut göçünün tersidir ve neredeyse hiçbir zaman tam çıkış anlamına gelmez — repatriation yapan şirketlerin büyük çoğunluğu varlığının esas kısmını bulutta tutar, sadece matematiği artık tutmayan iş yüklerini geri çeker.

Cloudian'ın Nisan 2026'da 212 BT yöneticisiyle yaptırdığı anket, katılımcıların %75'inin önceki 24 ayda en az bir iş yükünü genel buluttan geri taşıdığını, %89'unun ise önümüzdeki iki yılda kendi altyapı kapasitesini genişletmeyi planladığını ortaya koydu. Bu sayılar bir depolama tedarikçisinin kendi anketinden geldiği için somut yüzdeleri yönlendirici olarak değerlendirmek gerekir; ama tanımladıkları eğilim — tam bulut çıkışı değil, iş yükü bazında seçici repatriation — diğer analistlerin raporlarıyla da örtüşüyor.

## Bulut repatriation gerçekten yaşanıyor mu, yoksa sadece konuşuluyor mu?

Yaşanıyor, ama anket başlıklarının ima ettiğinden çok daha küçük ölçekte. 2024 Barclays anketi, CIO'ların %83-86'sının en az bir iş yükünü kendi altyapısına geri taşımayı beklediğini bulmuştu — bu anketin kayıtlarındaki en yüksek rakamdı — ama Flexera'nın 2025 State of the Cloud raporu, dünya çapında gerçekte geri taşınan iş yükü payını yaklaşık %21 olarak verdi. Tam bulut çıkışları hâlâ nadir; işletmelerin yaklaşık %8-9'uyla sınırlı.

Bu arada genel bulut harcaması büyümeyi sürdürüyor: Gartner, 2025 için dünya çapında genel bulut harcamasının 723,4 milyar dolara, yıllık %21 artışla ulaşacağını tahmin etti. İki durum da aynı anda doğru — repatriation niyeti yaygın, ama toplam bulut harcaması da yükseliyor; çünkü repatriation toptan değil, cerrahi bir operasyon.

## Hangi iş yüklerini geri taşımak gerçekten mantıklı?

Kazandıran iş yükleri, kaynak kullanımı sabit ve öngörülebilir olan, bulutun maliyet yapısının cezalandırdığı türdeki iş yükleridir. Tekrarlayan üç örüntü var:

- **Depolama ağırlıklı, az değişen veri.** Çoğunlukla boşta duran büyük veri setleri (yedekler, arşivler, medya kütüphaneleri, log saklama), bulutun esnekliğinden orantılı değer üretmeden depolama ve egress ücreti biriktirir.
- **Sabit durumlu hesaplama.** Günün 24 saati yaklaşık aynı CPU ve bellek seviyesinde çalışan bir iş yükü — ana veritabanı, iç ERP sistemi, sabit programlı bir toplu işleme hattı — kullandığın kadar öde modelinden fayda görmez; çünkü zaten her zaman aynı kapasite için ödeme yapıyorsundur.
- **Yüksek egress'li hizmetler.** Buluttan tekrar tekrar büyük hacimde veri çıkaran her şey (video dağıtımı, veri dışa aktarma API'leri, dış sistemleri besleyen analitik hatları), sabit ücretli bir colocation veya kendi hattının almadığı egress ücretlerini biriktirir.

## Hangi iş yükleri bulutta kalmalı?

Talebi öngörülemeyen veya dalgalı iş yükleri, sıfıra ölçeklenmesi gereken iş yükleri ve ekibin kendi donanımını işletecek operasyonel kapasitesi olmayan her şey bulutta kalmalı. Mevsimsel bir e-ticaret ödeme hizmeti, kullanım örüntüsünü henüz bulmamış yeni bir ürün ya da birden çok kıtada varlık noktası gerektiren küresel bir API, repatriation'dan kazandığından daha fazlasını kaybeder — esnek, kullandıkça öde altyapıyı, tepe yük için sağlaman gereken ve kalan zamanda az kullanacağın sabit kapasiteyle takas etmiş olursun.

| Sinyal | Bulutu destekler | Repatriation'ı destekler |
|---|---|---|
| Trafik örüntüsü | Dalgalı, mevsimsel, öngörülemez | Düz, sabit, 7/24 |
| Veri egress'i | Düşük, ara sıra | Yüksek, tekrarlayan |
| Ekip ops kapasitesi | Küçük ekip, donanım deneyimi yok | Ops/SRE kadrosu var veya işe alınabilir |
| Ölçekleme ihtiyacı | Sıfıra ölçeklenmeli veya küresel patlama yapmalı | Sabit kapasite yeterli |
| Uyumluluk/veri lokasyonu | Esnek | Katı, kendi donanımını destekler |

## Repatriation'ı uygulamak gerçekte neye mal oluyor?

Donanım daha ucuz diye repatriation bedava olmuyor. Sunucu ve ağ ekipmanı için sermaye harcaması üstleniyorsun; donanımı rack'leme ve yapılandırma süresi (bir bulut API çağrısının aldığı dakikalar değil, genelde haftalar) ve bulut sağlayıcısının üstlendiği yama yönetimi, kapasite planlaması ve felaket kurtarma yükünü sürekli taşıyorsun. Cloudian anketindeki nedenler de bu takasla örtüşüyor: katılımcılar repatriation'ın başlıca nedeni olarak maliyet yönetimini (%84) ve güvenlik/yönetişimi (%77) gösterdi — performans değil; bu da çoğu repatriation kararının teknik değil, finansal ve düzenleyici olduğunu gösteriyor.

Kararı çerçevelemenin kaba bir yolu:

```text
Repatriation yap, eğer:
  (bulut_maliyeti - colo_maliyeti) * is_yuku_omru > gocis_maliyeti + ops_yuku

Bulutta kal, eğer:
  trafik_varyansi yüksekse
  VEYA ekip_ops_kapasitesi sıfıra yakınsa
  VEYA pazara çıkış hızı, birim maliyetten daha önemliyse
```

## Repatriation'ın dürüst dezavantajı nedir?

Önce gerçek bir altyapı yetkinliği kurmadan veya bu yetkinliği işe almadan repatriation yapan ekipler, genelde neden buluta taşındıklarını yeniden hatırlıyor: donanım arızaları gece yarısı senin sorunun hâline geliyor, kapasite planlaması otomatik ölçeklenme yerine aylar öncesinden tahmin gerektiriyor, felaket kurtarma satın alınan bir hizmet olarak değil, kurulup test edilmesi gereken bir sistem olarak karşına çıkıyor. İşe yarayan repatriation genelde mevcut bir ops ekibiyle veya buna bilinçli bir yatırımla birlikte gelir — tek başına yapılan bir maliyet kesme hamlesi olarak değil.

## Sıkça Sorulan Sorular

### Bulut repatriation basitçe nedir?

Bulut repatriation, bir iş yükünü genel bulut sağlayıcısından kendi donanımına veya bir colocation tesisine geri taşımaktır; bunun nedeni genelde sürekli bulut maliyetinin — depolama, hesaplama veya veri egress'i — sabit ve öngörülebilir bir kullanım örüntüsünde kendi işletmenin maliyetini geçmiş olmasıdır.

### Gerçekte kaç şirket iş yüklerini buluttan geri taşıdı?

Cloudian'ın Nisan 2026'da 212 BT yöneticisiyle yaptırdığı anket, %75'inin önceki 24 ayda en az bir iş yükünü geri taşıdığını buldu; ama Flexera'nın 2025 State of the Cloud raporu, dünya çapında gerçekte geri taşınan iş yükü payını yaklaşık %21 olarak verdi ve tam bulut çıkışları işletmelerin yaklaşık %8-9'uyla sınırlı kalıyor.

### Bulut repatriation buluttan tamamen çıkmak mı demek?

Hayır. Repatriation'ların neredeyse tamamı kısmi — şirketler belirli, sabit durumlu veya veri ağırlıklı iş yüklerini kendi altyapısına geri taşırken, dalgalı, müşteriye dönük veya küresel dağıtılmış iş yüklerini bulutta tutuyor. Genel bulut harcaması toplamda büyümeyi sürdürüyor (Gartner 2025 için 723,4 milyar dolar tahmin etti); bu da repatriation'ın seçici kalmasıyla ancak mantıklı olur.

### Repatriation için en iyi iş yükü adayları hangileri?

Erişim sıklığı düşük, depolama ağırlıklı arşivler; 7/24 sabit seviyede çalışan sabit durumlu hesaplama ve tekrarlayan yüksek veri egress maliyeti olan hizmetler en güçlü adaylar. Dalgalı, mevsimsel veya küresel dağıtılmış iş yükleri, repatriation'da bulutta kalmaktan neredeyse her zaman daha fazlaya mal olur.

### Repatriation kararını vermeden önce hangi sayıları toplamalıyım?

Son 12 ayın bulut faturasını iş yükü bazında kır, her iş yükü için egress ve depolama maliyetini ayrı göster, sonra bu iş yükünü kendi donanımında işletmenin amortisman dahil tahmini maliyetini çıkar. Göç projesinin kendisinin maliyetini (donanım, kurulum süresi, geçiş sırasında çift çalıştırma) ve ek ops yükünü de bu hesaba eklemeden karar vermek, en yaygın hatadır — çünkü göç maliyeti genelde ilk yılın beklenen tasarrufunu fazlasıyla yiyip bitirir.

Maliyet odaklı daha fazla altyapı içeriği için [FinOps ile bulut faturanı nasıl düşürürsün](/tr/posts/finops-bulut-maliyeti-dusurme), [yapay zeka token harcamasını ekip bazında nasıl görünür kılarsın](/tr/posts/yapay-zeka-finops-token-harcamasi) ve [örnekleme ile gözlemlenebilirlik faturanı nasıl kesersin](/tr/posts/gozlemlenebilirlik-faturasini-dusur) yazılarımıza bakabilirsin. Daha fazlası için [DevOps & Bulut kategorisine](/tr/category/devops-bulut) göz atabilirsin.

Kaynaklar: [Cloudian'ın bulut veri repatriation anketi](https://cloudian.com/press/cloud-data-repatriation-survey.md), [Flexera'nın State of the Cloud raporuna dayanan sektör analizi](https://hyscaler.com/insights/cloud-repatriation-the-strategic-shift-in-it/) ve [Gartner'ın 2025 genel bulut harcaması tahminini aktaran sektör haberi](https://azati.com/quick-insights/cloud-repatriation-2026-finops/).
