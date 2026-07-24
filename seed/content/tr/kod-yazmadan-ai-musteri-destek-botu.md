---
title: "Kod Yazmadan AI Müşteri Destek Botu Kurmak"
slug: "kod-yazmadan-ai-musteri-destek-botu"
translationKey: "ai-support-chatbot-without-code"
locale: "tr"
excerpt: "Halüsinasyon görmeyen bir destek botu kurmanın sırrı model seçimi değil, botu yalnızca bilgi tabanınızdan cevap vermeye zorlamak. Kurulum adım adım anlatılıyor."
category: "business"
tags: ["ai-tools", "automation", "rag", "best-practices"]
publishedAt: "2026-07-24"
seoTitle: "Kod Yazmadan AI Müşteri Destek Botu Kurmak"
seoDescription: "Halüsinasyon görmeyen bir destek botu kurmanın sırrı model seçimi değil, botu yalnızca bilgi tabanınızdan cevap vermeye zorlamak. Kurulum adım adım anlatılıyor."
---

Uydurmayan bir AI destek botu kurmanın yolu daha büyük bir modele geçmek değil, botu yalnızca sizin onayladığınız kaynaklardan cevap vermeye zorlamaktır. Buna "grounding" (dayandırma) deniyor: bot serbestçe metin üretmek yerine önce bilgi tabanınızda arama yapıyor, sonra bulduğu parçayı özetliyor. 2026'da küçük bir mağaza için bunu kod yazmadan kurmak artık birkaç saatlik bir iş.

## Sorun Neden Modelin Zekasında Değil

Ürün ekipleri genellikle "daha iyi bir yapay zeka" arar ama asıl fark mimaride yatıyor. Serbest bırakılmış, yani hiçbir kaynağa bağlanmamış üretken bir bot, destek senaryolarında yaklaşık %15-27 oranında halüsinasyon görüyor; kurumsal ortamlarda canlı etkileşimlerde bu oran ortalama %18 civarında ölçülüyor. Aynı bot, yalnızca size ait kaynak metni verilip "sadece bunu kullan" denildiğinde bu oran %0,7-1,5 bandına düşüyor. Yani müşteriye yanlış bir iade tutarı ya da olmayan bir kampanya söyleyip söylemeyeceğini belirleyen şey modelin markası değil, botun neye erişebildiği.

Bu yüzden kurulumun ilk ve en önemli adımı bilgi tabanını doğru inşa etmek.

## Adım 1: Bilgi Tabanını Kaynaklardan Derleyin

Botu beslemeden önce elinizdeki dağınık bilgiyi tek bir yerde toplayın:

- Sık sorulan sorular (kargo süresi, iade koşulları, ödeme seçenekleri)
- Politika metinleri (iade, garanti, gizlilik)
- Ürün açıklamaları ve varyasyon bilgileri (beden, renk, stok durumu)
- Geçmiş destek yazışmalarından çıkarılmış tekrarlayan sorular

Her belgeyi kısa, tek konulu parçalara bölün. "İade ve Değişim" başlığı altında tek bir uzun paragraf yerine "İade süresi kaç gün?", "Kargo kim öder?", "İndirimli üründe iade var mı?" gibi ayrı ayrı cevaplanabilir bloklar oluşturmak, botun doğru parçayı bulmasını kolaylaştırır. Bu, [RAG sisteminin nasıl çalıştığını](/tr/posts/rag-sistemi-nasil-kurulur) anlamanın en pratik yansıması: arama katmanı ne kadar iyi bölünmüş içerik bulursa, cevap o kadar isabetli olur.

## Adım 2: Kanalınıza Uygun No-Code Platformu Seçin

Kod yazmadan kuracağınız için platform seçimi büyük ölçüde müşterilerinizin nerede yazdığına bağlı. [Intercom Fin](https://www.intercom.com/fin) ve [Tidio](https://www.tidio.com/) gibi araçlar, yardım merkezinizdeki içeriğe dayanarak cevap üretme özelliğini uzun süredir sunuyor; siz belgelerinizi yükleyip kanalı seçtikten sonra botun geri kalanını kurması bekleniyor.

| Bot Türü | Tipik Deflection Oranı | Halüsinasyon Oranı |
|---|---|---|
| Kural/anahtar kelime tabanlı bot | %10-20 | Düşük ama esneklik yok |
| Dayanaksız üretken bot | %20-35 (değişken) | %15-27 |
| Bilgi tabanına dayandırılmış üretken bot | %40-60+ | %0,7-1,5 |

Küçük bir mağaza için genelde üç kanal öne çıkıyor: site içi widget, WhatsApp ve Instagram DM. [WhatsApp üzerinden pazarlama yapan](/tr/posts/whatsapp-business-ile-pazarlama-2026) mağazalar için aynı numarayı destek botuna bağlamak, müşteriyi yeni bir uygulamaya yönlendirmemek açısından avantajlı. Instagram DM ise özellikle ürün fotoğrafı üzerinden gelen sorularda ("bu bej renk var mı?") daha doğal duruyor. Hangi kanalı seçerseniz seçin, kurulum akışı genelde aynı üç soruyu soruyor: bilgi kaynağınız nedir, hangi konularda bot kesinlikle cevap vermemeli ve hangi eşikte bir insana devretmelisiniz. Bu üç sorunun cevabını platforma girmeden önce kağıt üzerinde netleştirmek, arayüzde saatler kaybetmenizi önlüyor.

## Adım 3: Cevapları Dayandırın, Serbest Bırakmayın

Platformu kurarken karşınıza çıkan en kritik ayar genelde "yalnızca yüklenen kaynaklardan cevap ver" seçeneğidir. Bunu açık bırakmak, botun bilgi tabanında karşılığı olmayan bir soruya "bilmiyorum, bir temsilciye aktarıyorum" demesini sağlar — model kendi tahminini üretmez. Pratikte bu ayar tek başına, yukarıdaki tablodaki halüsinasyon farkının büyük kısmını açıklıyor.

## Adım 4: İnsana Devir Tetikleyicileri Tanımlayın

Botun her şeyi kendi başına çözmeye çalışması, aslında memnuniyeti düşüren bir tuzak. Net devir kuralları olmadan bot, cevabından emin olmadığı durumlarda bile ısrarla bir şeyler söylemeye devam edebilir. Basit bir kural seti şöyle görünebilir:

```json
{
  "handoffRules": [
    { "trigger": "refund_request_above_amount", "threshold": 500, "action": "human_agent" },
    { "trigger": "negative_sentiment_detected", "action": "human_agent" },
    { "trigger": "unresolved_after_turns", "maxTurns": 3, "action": "human_agent" },
    { "trigger": "price_or_discount_question", "action": "guardrail_response" }
  ],
  "guardrails": {
    "neverStateExactRefundAmount": true,
    "neverInventDiscountCodes": true,
    "fallbackMessage": "Bu konuda size en doğru bilgiyi ekibimiz verebilir, hemen yönlendiriyorum."
  }
}
```

Fiyat ve iade tutarı gibi konularda bota asla serbest rakam üretme yetkisi vermeyin; bunun yerine güncel fiyat listesine bağlanan bir alan sorgulasın ya da doğrudan insana devretsin. Bir botun "muhtemelen 150 TL iade alırsınız" demesi, tek bir yanlış cevapla haftalarca biriktirdiğiniz güveni götürebilir.

## Adım 5: Deflection ve CSAT'i Birlikte Ölçün

Deflection oranı (insana hiç gitmeden çözülen görüşme yüzdesi) genelde ROI'nin temel göstergesi olarak sunulur ve kural tabanlı botlarda %10-20 iken, iyi kurulmuş bir bilgi tabanıyla dayandırılmış botlarda %50-70'e kadar çıkabiliyor; kurumsal programların medyanı yaklaşık %41, üst çeyrek ise %59 civarında. Ama tek başına bakıldığında bu rakam yanıltıcı olabilir — bence deflection oranı, CSAT'i düşürme pahasına yükseliyorsa bir başarı değil, gizlenmiş bir müşteri kaybıdır. Botun "çözüldü" diye işaretlediği ama müşterinin aslında vazgeçtiği görüşmeler, panelde iyi görünen ama işletmeyi yavaşça aşındıran bir metriktir.

Dünya standardındaki AI destek uygulamaları %85 ve üzeri CSAT'e ulaşıyor. Salt AI ile yürütülen görüşmeler genelde insan temsilciye göre biraz daha düşük puan alıyor (yaklaşık 5 üzerinden 4,1'e karşı 4,3), ama iyi tasarlanmış bir devir akışı bu farkı neredeyse kapatıyor. Yani asıl hedef "bot her şeyi çözsün" değil, "bot doğru şeyleri çözsün, gerisini doğru zamanda devretsin" olmalı.

## İlk Ay İçin Basit Bir Kontrol Listesi

Yeni başlayan bir mağaza sahibiyseniz botu tek seferde mükemmelleştirmeye çalışmayın. İlk hafta yalnızca en sık sorulan 15-20 soruyu bilgi tabanına ekleyin, devir kurallarını sıkı tutun ve bir hafta boyunca gerçek görüşme kayıtlarını okuyun. İkinci haftada botun yanlış anladığı soruları bilgi tabanına yeni parçalar olarak ekleyin. Bu döngü, tek seferlik büyük bir kurulumdan çok daha etkili sonuç veriyor. Bu yaklaşım, [tek kişilik girişimlerin AI yığınını](/tr/posts/tek-kisilik-girisim-ai-yigini) kurarken izlediği "küçük başla, gerçek veriyle iterasyon yap" mantığıyla da örtüşüyor — özellikle [ilk müşterilerini arayan solo kurucular](/tr/posts/ai-caginda-ilk-10-musteri-solo-kurucu) için destek yükünü erken kontrol altına almak, büyüme evresinde ciddi zaman kazandırıyor.

Bilgi tabanınız oturduktan sonra aynı içerikten faydalanan başka bir katman daha eklemek isteyebilirsiniz: ekibinizin kendi içinde kullandığı, politikalarınızı ve tonunuzu bilen bir asistan. [İşletmeye özel Gemini Gems](/tr/posts/gemini-gems-isletmeye-ozel-ai-asistanlari) gibi araçlar, dışa dönük destek botundan ayrı olarak, içeride "bu müşteriye nasıl cevap yazsam" sorusuna hızlı taslak üretmek için kullanılabiliyor — ikisi birbirinin yerine geçmiyor, birbirini tamamlıyor.

## Sıkça Sorulan Sorular

### Bunu kurmak için geliştiriciye ihtiyacım var mı?

Hayır. Intercom Fin ve Tidio gibi platformlar, yardım merkezi içeriğinizi veya belgelerinizi yükleyip kanalı (site widget'ı, WhatsApp, Instagram) seçmenizi istiyor; kurulum tamamen arayüz üzerinden yapılıyor. Kod yazmanız gereken tek durum, çok özel bir entegrasyon (örneğin özel bir stok sisteminden canlı veri çekmek) istediğinizde ortaya çıkıyor.

### Botun iade tutarı uydurmasını nasıl engellerim?

Botun ayarlarında "yalnızca yüklenen kaynaklardan cevap ver" seçeneğini açın ve iade/fiyat konularını devir kuralına bağlayın. Yukarıdaki örnek yapılandırmadaki gibi, kesin bir tutar söylemesi gerektiğinde bunun yerine ilgili alanı insan temsilciye ya da güncel bir fiyat kaynağına yönlendirmesini sağlayın.

### Küçük bir mağaza için iyi bir deflection hedefi nedir?

İlk üç ay için %30-40 gerçekçi bir hedef; bilgi tabanınız olgunlaştıkça %50-60'a çıkmak mümkün. Ama bu rakamı CSAT'ten bağımsız takip etmeyin — deflection yükselirken memnuniyet düşüyorsa, bot muhtemelen bazı görüşmeleri gerçekte çözmeden "kapatıyor" demektir.

### Bot ne zaman insana devretmeli?

En azından şu üç durumda: belirlediğiniz tutarın üzerindeki iade talepleri, olumsuz duygu tonu tespit edildiğinde ve aynı sorun üç turdan fazla çözülemediğinde. Bu eşikleri baştan net tanımlamak, botun "denemeye devam etme" eğilimini önler ve müşteriyi gereksiz yere oyalamaz.
