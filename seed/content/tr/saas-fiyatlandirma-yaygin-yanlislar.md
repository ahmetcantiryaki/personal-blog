---
title: "SaaS Fiyatlandırma: Yaygın Yanlışlar"
slug: "saas-fiyatlandirma-yaygin-yanlislar"
translationKey: "pricing-saas-product-2026"
locale: "tr"
excerpt: "Çoğu SaaS kurucusu ürününü ucuza satar ve gereksiz katmanlar ekler. Doğru değer metriği, katman tasarımı ve fiyat çapasıyla gelir hızla katlanır."
category: "business"
tags: ["digital-products", "best-practices", "cost-optimization", "roadmap"]
publishedAt: "2026-08-01"
seoTitle: "SaaS Fiyatlandırma: Yaygın Yanlışlar (2026)"
seoDescription: "Çoğu SaaS kurucusu ürününü ucuza satar ve gereksiz katmanlar ekler. Doğru değer metriği, katman tasarımı ve fiyat çapasıyla gelir hızla katlanır."
---

Çoğu SaaS kurucusu fiyatlandırmayı iki yönden yanlış kurar: fiyatı olması gerekenden düşük belirler, sonra bu düşük fiyatı haklı çıkarmak için ürünü beş altı katmana böler. Doğru sıra tam tersidir: önce ürünün yarattığı değeri ölçen tek bir metrik seçilir, sonra o metrik etrafında en fazla üç net katman kurulur. Ağustos 2026 itibarıyla değer bazlı fiyatlandırma kullanan SaaS şirketleri, maliyet-artı modelde kalanlara kıyasla belirgin şekilde daha hızlı büyüyor.

## Maliyet-Artı mı Değer Bazlı mı?

Maliyet-artı fiyatlandırma sunucu, destek ve geliştirme maliyetini toplar, üzerine bir kâr marjı ekler ve rakamı öyle duyurur. Basittir ama ürünün müşteriye kazandırdığı değerle hiçbir ilişkisi yoktur — bir otomasyon aracı müşteriye ayda 40 saat kazandırıyorsa, o aracı sizin sunucu faturanıza göre fiyatlandırmak parayı masada bırakmaktır. [2026 SaaS fiyatlandırma araştırması](https://zylos.ai/research/2026-02-14-saas-pricing-strategy/), değer bazlı fiyatlandırmayı benimseyen SaaS şirketlerinin maliyet-artı ya da rakip bazlı modelde kalanlara göre belirgin ölçüde daha hızlı büyüdüğünü ve daha yüksek net gelir genişlemesi elde ettiğini gösteriyor. Değer bazlı fiyatlandırma, önce müşterinin sorunu çözülmediğinde kaça mal olduğunu bulmayı, sonra fiyatı o rakamın makul bir yüzdesi olarak kurmayı gerektirir.

## Ölçeklenen Bir Değer Metriği Seçmek

Değer metriği, faturanın hangi değişkene göre büyüyeceğidir: kullanıcı sayısı, API çağrısı, işlenen kayıt, gönderilen mesaj ya da çözülen destek talebi olabilir. İyi bir metrik üç koşulu birden sağlar: müşteri onu kolayca anlar, kullanım arttıkça değer de artar ve düşük hacimli müşteriyi cezalandırmadan yüksek hacimliden daha fazla gelir toplar. Sabit koltuk başı fiyatlandırma bu yüzden çoğu zaman yanlış seçimdir — beş kişilik bir ekip aracı günde bir kez, elli kişilik bir ekip günde yüz kez kullanabilir, ama koltuk başı model ikisine de aynı oranda fatura keser. Kullanım hacmiyle birlikte büyüyen bir metrik seçildiğinde, en çok değer alan müşteri de en çok ödeyen müşteri olur; bu da fiyat artışlarını daha sonra çok daha az tartışmalı hâle getirir.

## İyi/Daha İyi/En İyi: Katman Tasarımı ve Fiyat Çapası

Üç katman, çoğu SaaS fiyatlandırma sayfası için doğru sayıdır. İki katman seçim hissi vermez, dört ve üzeri katman ise karar felcine yol açar ve dönüşümü düşürür. [Fiyatlandırma psikolojisi üzerine 2026 araştırması](https://www.growthhakka.co.uk/2026/07/14/saas-pricing-psychology-killing-the-middle-tier/), üç katmanlı sayfaların iki ya da dört-artı katmanlı sayfalara kıyasla anlamlı ölçüde daha yüksek dönüşüm sağladığını gösteriyor. Orta katmanın "En Popüler" olarak işaretlenip görsel olarak öne çıkarılması, alıcının dikkatini en yüksek marjlı seçeneğe yönlendiren bir çapa görevi görür — insanlar en pahalı ya da en ucuz seçeneği seçmekten kaçınıp ortayı "güvenli" bulur.

| Katman | Hedef Kitle | Aylık Fiyat | Değer Metriği Limiti |
|---|---|---|---|
| Başlangıç | Solo kullanıcı, deneme aşaması | 290 TL | 1.000 işlem/ay |
| Büyüme (En Popüler) | Küçük ekip, aktif kullanım | 990 TL | 10.000 işlem/ay |
| Kurumsal | Ölçeklenen şirket, özel ihtiyaç | Özel fiyat | Sınırsız + SLA |

Katman fiyatlarını bir yapılandırma dosyası gibi düşünmek, tutarlılığı korumaya yardımcı olur:

```json
{
  "tiers": [
    { "name": "baslangic", "monthlyPrice": 290, "includedUnits": 1000, "overagePerUnit": 0.35 },
    { "name": "buyume", "monthlyPrice": 990, "includedUnits": 10000, "overagePerUnit": 0.12, "highlighted": true },
    { "name": "kurumsal", "monthlyPrice": null, "includedUnits": null, "custom": true }
  ]
}
```

## Deneme mi, Freemium mu, Ters Deneme mi?

Klasik ücretsiz deneme, kullanıcıya sınırlı bir süre için tüm özellikleri açar ve süre bitince ödeme ister. Freemium, belirli özellikleri süresiz ücretsiz bırakır ve kullanıcının kendi isteğiyle yükseltme yapmasını bekler. Ters deneme ise ikisinin melezidir: kayıt olan herkes önce en üst katmanın tüm gücünü kısa bir süre yaşar, sonra otomatik olarak sınırlı bir ücretsiz plana düşer. Popüler büyüme tavsiyesinin aksine, freemium'un erken aşama SaaS için genelde yanlış seçim olduğunu düşünüyorum: kullanıcıya ürünü sonsuza dek bedavaya deneyimlemeyi öğretiyor ve destek yükünü artırırken ödeyen müşteri sayısını artırmıyor. Ters deneme, kullanıcıyı önce üst katmanın gerçek değerine maruz bıraktığı için dönüşümde genelde saf freemium'u geride bırakıyor; klasik deneme ise B2B'de hâlâ en öngörülebilir modeldir çünkü satış ekibi süreç boyunca net bir zaman baskısı kullanabilir.

## Churn Yaratmadan Fiyat Artırmak

Fiyat artışı duyurmak kurucuların en çok ertelediği kararlardan biri, oysa gecikme genelde durumu daha da kötüleştirir. En güvenli yol, mevcut müşterileri belirli bir süre (genelde 12-24 ay) eski fiyatta tutup yeni fiyatı yalnızca yeni kayıtlara ve o sürenin sonuna uygulamaktır. [Fiyat artışı ve müşteri elde tutma üzerine araştırma](https://www.getmonetizely.com/articles/grandfathering-vs-forced-migration-the-strategic-approach-to-price-changes-for-existing-customers), koruma olmadan yapılan fiyat artışlarının belirgin bir churn artışı tetiklediğini, eski fiyatı koruyan (grandfathering) yaklaşımın ise bu artışı büyük ölçüde ortadan kaldırdığını gösteriyor. Fiyat artışını her zaman somut bir yeni değerle eşleştirin — yeni bir özellik, daha yüksek limit ya da iyileşen destek seviyesi — böylece müşteri artışı bir kayıp değil bir yükseltme olarak görür. En az 30 gün önceden e-posta ile bildirim ve artışın gerekçesini net biçimde anlatan bir mesaj, memnuniyetsizliği ölçülebilir biçimde azaltır.

## Türkiye Gibi Pazarlar İçin Fiyat Lokalizasyonu

Türkiye gibi döviz kurunun sık dalgalandığı pazarlarda fiyatı doğrudan dolar ya da euro üzerinden göstermek, kullanıcıda sürekli belirsizlik yaratır. Fiyatı TL cinsinden sabitleyip belirli aralıklarla (örneğin çeyreklik) satın alma gücüne göre güncellemek, hem müşteri güvenini korur hem de kur riskini kurucunun üzerinden alır. KDV'yi fiyatın içine dahil ederek göstermek — "aylık 990 TL + KDV" yerine "aylık 990 TL, KDV dahil" — sepet terk oranını düşürür çünkü son ekranda sürpriz bir rakam çıkmaz. Yerel ödeme yöntemlerini (iyzico, taksitli kredi kartı seçenekleri) desteklemek, yalnızca uluslararası kart kabul eden bir ödeme akışına kıyasla dönüşümü ciddi ölçüde artırır. Fiyat bölgeleri arasında büyük fark varsa, bir müşterinin ucuz bölgeden hesap açıp başka bölgede kullanmasını önleyecek basit bir kontrol (fatura adresi, IP doğrulaması) eklemek de gerekir.

## Fiyatlandırma Sayfası Teardown Kontrol Listesi

- Değer metriği sayfanın ilk ekranında net biçimde görünüyor mu?
- Üç katmandan fazlası mı var? Varsa neden?
- Orta katman görsel olarak öne mi çıkarılmış (renk, rozet, kenarlık)?
- Yıllık ödemede indirim yüzdesi açıkça yazıyor mu?
- Fiyat yerel para biriminde ve vergi dahil mi gösteriliyor?
- Her katmanın altında somut bir "kime uygun" cümlesi var mı?
- Sık sorulan sorular, en yaygın itirazları (iptal, iade, taşıma) karşılıyor mu?
- Kurumsal katmanda net bir iletişim yolu (form, e-posta) var mı?

Fiyatlandırma sayfanızı bu kontrol listesiyle birlikte genel dönüşüm hatalarına karşı da test etmek isterseniz [dönüşüm düşüren landing page hataları](/tr/posts/donusum-dusuren-landing-page-hatalari) yazımıza bakabilirsiniz. Henüz fikrinizi doğrulamadıysanız [mikro-SaaS fikri bulma ve doğrulama](/tr/posts/mikro-saas-fikri-bulma-ve-dogrulama) rehberimiz doğru fiyatı belirlemeden önceki adımı kapsıyor; ilk ödeyen müşterilerinizi henüz bulmadıysanız [ilk 10 müşteri](/tr/posts/ai-caginda-ilk-10-musteri-solo-kurucu) yazımız işe yarıyor. Katmanları sadeleştirdikten sonra maliyetlerinizi de sıkılaştırmak için [solo girişim AI yığını](/tr/posts/tek-kisilik-girisim-ai-yigini) ve daha fazla kurucu deneyimi için [AI ile mikro-SaaS](/tr/posts/ai-ile-mikro-saas-hikayeleri) derlememize göz atabilirsiniz. Daha fazlası için [Girişimcilik & İş kategorimize](/tr/category/girisimcilik-is) bakabilirsiniz.

## Sıkça Sorulan Sorular

### SaaS ürünümü değer bazlı mı yoksa maliyet-artı mı fiyatlandırmalıyım?

Mümkün olduğunca değer bazlı fiyatlandırın. Maliyet-artı model basit görünür ama müşterinin elde ettiği faydayla hiçbir bağı olmadığı için erken aşamada gereğinden düşük fiyat belirlemeye yol açar; araştırmalar değer bazlı modele geçen şirketlerin belirgin şekilde daha hızlı büyüdüğünü gösteriyor.

### Kaç fiyatlandırma katmanı olmalı?

Çoğu SaaS ürünü için üç. İki katman gerçek bir seçim hissi vermez, dört ve üzeri katman ise karar felcine yol açıp dönüşümü düşürür. Orta katmanı öne çıkarmak, alıcıyı en yüksek marjlı seçeneğe yönlendiren doğal bir çapa oluşturur.

### Mevcut müşterilerin fiyatını artırırken ne yapmalıyım?

Onları belirli bir süre eski fiyatta tutun (grandfathering), artışı en az 30 gün önceden duyurun ve artışı somut bir yeni değerle eşleştirin. Koruma olmadan yapılan ani artışlar belirgin bir churn dalgasına yol açarken, korumalı geçiş bu etkiyi büyük ölçüde ortadan kaldırıyor.

### Freemium mu ters deneme mi tercih etmeliyim?

Erken aşama bir SaaS ürünüyseniz ters deneme genelde daha iyi sonuç verir çünkü kullanıcı önce üst katmanın tam değerini deneyimler, sonra sınırlı plana düşer. Saf freemium, kullanıcıya ürünü sonsuza dek bedavaya kullanmayı öğretme riski taşır ve genellikle ödeyen müşteri oranını artırmaz.
