---
title: "Yapısal Veri ile AI Aramada Görünürlük"
slug: "yapisal-veri-ai-aramada-gorunurluk"
translationKey: "schema-markup-ai-search-visibility"
locale: "tr"
excerpt: "Yapısal veri, sayfadaki varlıkları JSON-LD ile makinelerin doğru okuyacağı hâle getiren koddur; AI'nın atıf vermesine yardımcı olur, sıralamayı garanti etmez."
category: "digital-marketing"
tags: ["seo", "llm", "ai-tools", "technical-writing", "best-practices"]
publishedAt: "2026-08-21"
seoTitle: "Yapısal Veri ile AI Aramada Görünürlük"
seoDescription: "Yapısal veri, sayfadaki varlıkları JSON-LD ile makinelerin doğru okuyacağı hâle getiren koddur; AI'nın atıf vermesine yardımcı olur, sıralamayı garanti etmez."
---

Kısa cevap: yapısal veri (schema markup), sayfanızdaki yazar, ürün, fiyat, soru-cevap gibi varlıkları genelde JSON-LD formatında etiketleyen koddur; makinelerin tahmin yürütmesine gerek bırakmaz. Sıralamanızı doğrudan yükseltmez ama AI Overview'ların ve sohbet botlarının sizi doğru alıntılamasını engelleyen belirsizliği kaldırır. Ağustos 2026 itibarıyla "makine anlayışına yardımcı olur" ile "atıf garantiler" arasındaki bu fark, teknik SEO'da en çok karıştırılan konu.

## Yapısal veri (schema markup) nedir?

Yapısal veri, [schema.org](https://schema.org/) tarafından tanımlanan standart bir kelime dağarcığıdır ve içeriğin ne *söylediğini* değil ne *olduğunu* tarif eder. Düz metin bir tarayıcıya "bu sayfada 49 dolarlık bir fiyattan bahsediliyor" der; bir `Product` şema bloğu ise "bu ürünün fiyatı 49 USD'dir" diye net bir şekilde belirtir. Büyük dil modelleri (LLM'ler) ve AI Overview'lar cevap üretirken bilgiyi kaynaklara bağlar; makine tarafından okunabilir bilgi, düz yazının içine gömülü bilgiden çok daha ucuz ve güvenilir bir şekilde çıkarılır.

Google, yapısal verinin sıralamayı doğrudan etkilemediğini açıkça belirtiyor: bir yapısal veri ihlali, zengin sonuç uygunluğunu kaldırır ama sıralamayı değiştirmez. Değeri, uygunluk ve anlaşılırlıkta, sıralama ağırlığında değil. AI Overview'lar ve LLM tabanlı cevap motorları da aynı mantıkla çalışır: schema sizi yükseltmez, sizi anlaşılır kılar.

## AI Overview'lar ve LLM'ler yapısal veriyi nasıl kullanır?

Öncelikle kesin çıkarım yapmak için bir kestirme yol olarak kullanırlar; sıralama sinyali olarak değil. Bir model sayfayı özetlerken varlığın, iddianın ve kaynağın net olduğu içeriği tercih eder; çünkü belirsiz içerik, halüsinasyon üretme veya yanlış kaynak gösterme riskini artırır. Temiz `Article`, `FAQPage` ve `Organization` işaretlemesi, modele tam olarak bunu sağlar: dağınık bir metin yığını yerine etiketlenmiş bir varlık grafiği.

Ağustos 2026 itibarıyla AI Overview'lar, izleyen kaynağa göre Google aramalarının yaklaşık yüzde 48 ila 60'ında görünüyor; soru biçimindeki ve uzun kuyruklu aramalarda bu oran yüzde 53-60 civarına çıkarken, bir-iki kelimelik kısa aramalarda yüzde 10'un altında kalıyor. Bu fark önemli: içeriğinizi schema'nın etiketleyebileceği soru-cevap biçiminde yazmak, AI Overview'ların zaten baskın olduğu sorgu türlerine odaklanmak demek.

## Hangi schema türleri AI atıfları için en çok işe yarar?

Bir içerik sitesi için pratik vakaların çoğunu beş tür karşılıyor; her biri modelin sayfanız etrafında kurduğu varlık grafiğinde farklı bir görev üstleniyor.

| Şema türü | Makineye ne anlatır | En çok nerede işe yarar |
|---|---|---|
| `Article` / `BlogPosting` | Başlık, yazar, yayın ve güncelleme tarihi, ana konu | Her blog yazısı veya haber sayfası |
| `FAQPage` | Kendi cümlelerinizle yazılmış açık soru-cevap çiftleri | Nasıl yapılır ve SSS bölümleri, tam olarak bu makale gibi |
| `Product` | Ad, fiyat, stok durumu, yorumlar, marka | E-ticaret ve SaaS fiyatlandırma sayfaları |
| `Organization` | Yasal ad, logo, resmi URL, sosyal profillere `sameAs` bağlantıları | Ana sayfa ve hakkımızda sayfası, marka bilgi paneline besleme |
| `Person` (Yazar) | Ad, unvan, biyografi ve profillere `sameAs` bağlantıları | Yazar sayfaları, yazar E-E-A-T'sini güçlendirir |

Eksik veya hatalı işaretleme çoğu zaman kazandırdığından fazlasına mal olur: Google'ın kendi kılavuzu, tamamlanmamış yapısal veriyi açacağı özellikler için uygunsuz sayıyor; yani yarım kalmış bir `Product` bloğu, mühendislik zamanını harcayıp yok sayılmaktan öteye gitmiyor.

## JSON-LD nasıl eklenir?

Sayfanın HTML'ine tek bir `<script type="application/ld+json">` bloğu eklersiniz; genelde `<head>` içine veya kapanış `</body>` etiketinden hemen önce. Bu blok okuyucuya görünmez, yalnızca makineler tarafından okunur. Google, JSON-LD'yi özellikle önerir çünkü görünür işaretlemenize dokunmaz; sayfayı yeniden tasarlamadan ekleyebilir veya güncelleyebilirsiniz. İşte bir blog yazısı için minimal bir `Article` şeması:

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Yapısal Veri ile AI Aramada Görünürlük",
  "author": {
    "@type": "Person",
    "name": "Ayşe Yılmaz",
    "sameAs": "https://linkedin.com/in/ayseyilmaz"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Woyable",
    "sameAs": "https://twitter.com/woyable"
  },
  "datePublished": "2026-08-21",
  "dateModified": "2026-08-21",
  "mainEntityOfPage": "https://woyable.com/tr/posts/yapisal-veri-ai-aramada-gorunurluk"
}
```

Bir `FAQPage` bloğu, soru-cevap içerikleri için aynı işi görür; ancak gizli metin değil, sayfada görünen soru-cevap metniyle eşleştirin. Google'ın yapısal veri kuralları, okuyucunun göremediği içeriğin işaretlenmesini açıkça yasaklıyor.

## Entity netliği ve sameAs özelliği nedir?

Entity (varlık) netliği, bir makinenin "bu makale", "bu yazar" ve "bu kuruluş" gibi kavramları benzer isimli birçok varlık arasından tahmin etmek yerine tek bir kesin kimliğe bağlayabilmesi demek. `sameAs` özelliği bunu sağlar: Wikipedia sayfanız, LinkedIn profiliniz, Crunchbase kaydınız, X hesabınız gibi şemanızın tarif ettiği gerçek varlığa işaret eden bir URL listesi. `sameAs` olmadan bir model, yazar künyesindeki "Ayşe Yılmaz"ın başka yerde doğrulanabilir bir yayın geçmişi olan aynı kişi olduğundan emin olamaz.

`sameAs` bağlantıları, Google'ın Bilgi Panelleri'ni besleyen bilgi grafiği mantığıyla aynı şekilde çalışır. Sitenizdeki ve `Organization` şemanızdaki ad, logo ve profil bağlantıları ne kadar tutarlıysa, yalnızca Google'ın değil herhangi bir sistemin sizi benzer isimli başka bir varlıktan ayırt etmesi o kadar kolaylaşır.

## Yapısal veri nasıl test edilir?

Her yeni şema bloğunu yayına almadan önce Google'ın [Zengin Sonuç Testi](https://search.google.com/test/rich-results) ve genel amaçlı [Schema.org Validator](https://validator.schema.org/) araçlarından geçirin; ikisi farklı sorunları yakalar. Zengin Sonuç Testi, işaretlemenizin Google Arama'nın şu anda desteklediği zengin sonuç özelliklerine uygunluğunu kontrol eder; Validator ise Google'ın zengin sonuç olarak göstermediği ama başka AI sistemlerinin okuyabileceği türler dâhil, daha geniş bir spesifikasyon uyumluluğunu denetler. Bir sayfa birinden geçip diğerinden kalabilir, o yüzden ikisini de kontrol edin.

Search Console'daki yapısal veri raporları hataları ancak Google sayfayı taradıktan sonra bildirir; bunu yayın öncesi kontrol değil, sürekli izleme aracı olarak kullanın.

## Yapısal veri AI atıflarını garanti eder mi?

Hayır; bunu garanti sanmak ekiplerin en sık yaptığı hata. Yapısal veri makine anlayışına yardımcı olur; sıralama ya da atıf kaldıracı değildir. Bir modelin sizi kaynak göstermesine içerik kalitesi ve gösterilebilir uzmanlık karar verir. Sığ, genel geçer bir yazının üzerine kusursuz bir `Article` şeması eklemek, hiç şeması olmayan ama iyi kaynaklanmış bir rakibi atıf yarışında geçmenize yetmez; sadece o rakibin işini biraz kolaylaştırırsınız.

Kişisel görüşüm şu: çoğu ekip schema'yı bir kere işaretlenip unutulan bir kutucuk gibi görüyor, oysa içerik her güncellendiğinde onunla birlikte güncellenmesi gereken canlı bir meta veri olarak ele alınmalı. İki yıldır güncellenmemiş bir `dateModified` alanı, hiç alan olmamasından daha kötü; çünkü sayfanın çoktan geride kalmış bir algoritma döneminden beri dokunulmadığını açıkça sinyalliyor.

## AI atıflarını nasıl ölçebilirsiniz?

Search Console'un gösterim sayısını izlediği gibi henüz "AI atıfları"nı doğrudan izleyemezsiniz, bu yüzden ölçüm dolaylı kalır. Search Console'da markalı arama hacmini takip edin (bir AI cevabında adınızı görüp sizi doğrudan arayan kişilerin göstergesi), analitiklerinizde chatgpt.com ve perplexity.ai gibi AI cevap alanlarından gelen yönlendirme trafiğini izleyin, içeriğinizin cevapladığı sorularla araçları düzenli olarak kendiniz sorgulayıp kaynak olarak anılıp anılmadığınızı kontrol edin.

Bunların hiçbiri bir tıklama oranı raporu kadar net değil; bu boşluk, atıf takibini günlük bir panel yerine aylık bir manuel denetim olarak ele almanın da gerekçesi.

## Yapısal veri uygulama kontrol listesi

| Adım | Eylem | Ne zaman tamamlandı sayılır |
|---|---|---|
| 1 | Ana sayfaya, tüm resmi profillere `sameAs` ile bağlı `Organization` şeması ekleyin | Zengin Sonuç Testi hata göstermiyor |
| 2 | Yazar sayfalarına, LinkedIn/X/biyografiye `sameAs` bağlantılı `Person` şeması ekleyin | Yazar adı sitede tutarlı biçimde çözümleniyor |
| 3 | Her yazıya doğru `datePublished`/`dateModified` bilgisiyle `Article`/`BlogPosting` şeması ekleyin | Tarihler görünen künyeyle eşleşiyor |
| 4 | `FAQPage` şemasını yalnızca sayfada görünen soru-cevap metni olan yerlere ekleyin | İşaretlemede gizli veya yinelenen metin yok |
| 5 | Fiyatlı her sayfaya `Product` şeması ekleyin, fiyatı ve stok durumunu canlı sayfayla senkron tutun | Schema.org Validator sıfır uyarıyla geçiyor |
| 6 | İçerik her düzenlendiğinde tüm bloklarınızı yeniden test edin | Her iki araç da temiz geçiyor |
| 7 | Search Console'un yapısal veri raporunu aylık izleyin | 30 gündür çözülmemiş hata yok |

Bu teknik çalışmanın dayandığı daha geniş stratejiyi [yapay zeka aramalarında görünme rehberimizde](/tr/posts/geo-yapay-zeka-aramalarinda-gorunurluk) bulabilirsiniz; o yazı, yalnızca işaretlemeyi değil bütün içeriği AI atıfları için nasıl yapılandıracağınızı ele alıyor. AI Overview'lar tıklama oranınızı zaten düşürüyorsa [hayatta kalma planımız](/tr/posts/ai-ozetleri-tiklama-hayatta-kalma) trafik çeşitlendirmeyi anlatıyor, [konu otoritesi rehberimiz](/tr/posts/konu-otoritesi-icerik-kumeleri-seo) ise şemanın yerini tutamayacağı içerik derinliği çalışmasını kapsıyor. Google'ın [yapısal veriye giriş](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data) ve [yapısal veri kuralları](https://developers.google.com/search/docs/appearance/structured-data/sd-policies) sayfalarını da yer imlerinize eklemeye değer, çünkü ikisi de desteklenen özellikler değiştikçe güncelleniyor.

## Sıkça Sorulan Sorular

### Yapısal veri eklemek Google sıralamamı yükseltir mi?

Doğrudan hayır. Google, yapısal verinin sıralama pozisyonunu değil, zengin sonuç uygunluğunu etkilediğini açıkça belirtiyor; asıl değeri hem klasik tarayıcıların hem de AI sistemlerinin içeriğinizi doğru anlamasına yardımcı olmasında, bu da dolaylı olarak ilgili sorgularla daha iyi eşleşmeyi destekliyor.

### JSON-LD, microdata veya RDFa'dan daha mı iyi?

Neredeyse her modern site için evet. Google, JSON-LD'yi özellikle önerir çünkü HTML etiketlerinin içine dokunmak yerine ayrı bir script bloğunda durur; bu da sayfanın görünen tasarımını riske atmadan eklemeyi, güncellemeyi ve doğrulamayı çok kolaylaştırır.

### Sayfada görünmeyen SSS içeriğini işaretleyebilir miyim?

Hayır. Google'ın yapısal veri kuralları, okuyucunun render edilen sayfada gerçekten göremediği metnin işaretlenmesini yasaklıyor; aynı mantık AI sistemleri için de geçerli: görünen içerikle eşleşen işaretlemeye güvenirler, gizli veya uydurma soru-cevap çiftleri fark edildiğinde bu güveni zedeler.

### Article şemamdaki dateModified alanını ne sıklıkla güncellemeliyim?

Sabit bir takvimde değil, içeriği her önemli ölçüde düzenlediğinizde. `dateModified` değeri her zaman gerçeği yansıtmalı; değişmemiş bir içerikte "bugün güncellendi" yazan bir alan, hem Google'a hem de atıf vermeden önce güncelliği kontrol eden herhangi bir AI sistemine yanlış sinyal verir.
