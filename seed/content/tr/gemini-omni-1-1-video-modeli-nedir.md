---
title: "Gemini Omni 1.1: Google'ın Yeni Video Modeli Nedir?"
slug: "gemini-omni-1-1-video-modeli-nedir"
translationKey: "gemini-omni-video-model"
locale: "tr"
excerpt: "Kısa cevap: Gemini Omni 1.1 Flash, Google'ın hızlı video modeli. 360p/720p üretiyor, 1080p/4K'ya yükseltiyor, saniyesi 0,03-0,30 dolar arası."
category: "ai"
tags: ["gemini", "ai-tools", "machine-learning", "digital-products"]
publishedAt: "2026-09-04"
seoTitle: "Gemini Omni 1.1 Flash Nedir? Özellikler ve Fiyat"
seoDescription: "Gemini Omni 1.1 Flash, Google'ın yeni video modeli. Çözünürlük, sahne uzatma, fiyatlandırma (saniyesi 0,03-0,30$) ve Sora karşılaştırması burada."
---

Kısa cevap: Gemini Omni 1.1 Flash, Google'ın Ağustos 2026'da yayınladığı, video üretimi ve düzenlemesi için optimize edilmiş hızlı çok-modlu modeli. Native olarak 360p ve 720p çözünürlükte üretim yapıyor, 1080p ve 4K çıktıyı ise upscaling ile sağlıyor; sahneleri 10 saniyelik parçalar halinde toplam 40 saniyeye kadar uzatabiliyor ve fiyatı çözünürlüğe göre saniyede 0,03 ile 0,30 dolar arasında değişiyor.

## Gemini Omni 1.1 Flash Nedir?

Gemini Omni 1.1 Flash, Google'ın video üretimi ve düzenlemesi için ayarladığı en yeni çok-modlu modeli; Google AI Studio, Flow ve Gemini Enterprise Agent Platform üzerinden kullanıma açık. Model, sahte bir "büyük model" değil, hız ve maliyet için optimize edilmiş bir Flash sürümü — bu da onu deneysel iterasyon ve toplu üretim için Google'ın daha ağır video modellerinden daha uygun kılıyor.

Google, halihazırda kullanımda olan `gemini-omni-flash-preview` uç noktasını 30 Eylül 2026'da kullanımdan kaldıracağını duyurdu; bu da 1.1 Flash'ı önizleme sürümünün genel kullanıma açık (GA) devamı yapıyor. Önizleme uç noktasını kullanan ekiplerin Eylül sonuna kadar geçiş yapması gerekiyor.

## Önceki Modellerden (Veo/Imagen) Farkı Nedir?

Fark, kontrol seviyesinde: Omni 1.1 Flash, konuşma diliyle düzenleme, sahne uzatma ve ilk/son kare belirleme gibi geliştirici kontrolleri sunuyor; bu özellikler Google'ın önceki Veo ve Imagen modellerinde bu ayrıntı düzeyinde yoktu. Konuşmalı düzenleme, bir değişikliği düz dille tarif ettiğinizde modelin klibin geri kalanına dokunmadan sadece o değişikliği uygulaması anlamına geliyor.

Sahne uzatma, 10 saniyelik parçalar halinde çalışıyor ve toplamda 40 saniyeye kadar video üretmeyi destekliyor. İlk ve son kareyi belirleyebiliyorsunuz; model bu iki kare arasındaki hareketi kendisi dolduruyor — kamera orbit hareketleri, yakınlaştırmalar ve karmaşık geçişler dahil.

Pratikte bu, önceki nesil modellerde manuel olarak parça parça birleştirilmesi gereken bir işi tek bir istekle halletmek demek. Örneğin bir ürün videosunun açılış ve kapanış karesini elinizdeki iki görselden veriyorsanız, aradaki 8-9 saniyelik geçişi elle animasyonla doldurmak yerine modelin üretmesini istiyorsunuz — bu da özellikle küçük ekiplerde prodüksiyon süresini saatlerden dakikalara indiriyor.

## Çözünürlük Kontrolü ve Düzenleme Özellikleri Nelerdir?

Model native olarak 360p ve 720p çözünürlükte üretim yapıyor; 1080p ve 4K çıktı ise upscaling üzerinden sağlanıyor, doğrudan üretim değil. Pratik iş akışı şu: önce 360p'de hızlı ve ucuz taslaklar üretip beğendiğiniz sonucu 4K'ya yükseltmek — bu, her denemeyi yüksek çözünürlükte üretmekten çok daha ucuz.

| Çözünürlük | Üretim yöntemi | Yaklaşık saniye fiyatı |
|---|---|---|
| 360p | Native (taslak) | ~0,03 $ |
| 720p | Native | ~0,10 $ |
| 1080p | Upscaling | ~0,15 $ |
| 4K | Upscaling | ~0,30 $ |

## Girdi Olarak Neler Kullanılabiliyor?

Model dört tür girdiyi kabul ediyor: metin promptu, referans görsel, referans video ve referans ses — hepsi tek bir sabit fiyattan, milyon token başına 1,50 dolardan faturalandırılıyor. Bu, örneğin markanızın önceki bir ürün videosunu referans olarak verip "aynı stilde ama farklı ürünle" isteyebileceğiniz anlamına geliyor; model yalnızca metin promptundan üretim yapmakla sınırlı değil.

Ses tarafında model, video ile senkronize ses düzenlemeyi de destekliyor — bir sahneye müzik veya ses efekti eklemek, konuşma diliyle tarif edilen bir düzenleme isteği olarak işleniyor, ayrı bir ses düzenleme aracına ihtiyaç duymadan. Bu, kısa sosyal medya klipleri için özellikle pratik: aynı istek içinde hem görsel değişikliği hem ses ekleme talebini birleştirebiliyorsunuz.

## Gemini Omni 1.1 Flash'ın Fiyatlandırması Nasıl?

Video çıktısı milyon token başına 17,50 dolardan faturalandırılıyor; bu, 720p videoda saniye başına sabit 5.792 token üzerinden hesaplandığında yaklaşık saniyede 0,10 dolara denk geliyor. Girdi (metin, görsel, video veya ses referansları) tek bir sabit fiyattan, milyon token başına 1,50 dolardan faturalandırılıyor. Ücretsiz katman veya Batch API indirimi bulunmuyor — bu, deneysel kullanımda maliyetlerin hızla birikebileceği anlamına geliyor.

```bash
curl https://generativelanguage.googleapis.com/v1beta/models/gemini-omni-1-1-flash:generateVideo \
  -H "x-goog-api-key: $GEMINI_API_KEY" \
  -d '{"prompt": "Şehir manzarasında yavaş kamera orbit hareketi", "resolution": "720p", "duration_seconds": 10}'
```

Bu, çözünürlük ve süre parametrelerinin kavramsal olarak nasıl ayarlandığını gösteren örnek bir istek; tam uç nokta ve alan adları için Google'ın güncel API dokümantasyonuna bakmanız gerekiyor. On saniyelik bir 720p klip, yalnızca çıktı maliyeti olarak yaklaşık 1 dolardan biraz fazlaya mal oluyor.

## Gerçekçi Kullanım Alanları ve Sınırları Neler?

En güçlü olduğu alanlar sosyal medya klipleri, ürün tanıtım görselleri ve hızlı konsept doğrulama. 360p taslak modu, bir fikri saniyeler içinde test edip beğenmediğinizde hiçbir şey kaybetmeden vazgeçmenizi sağlıyor — bu, pahalı 4K üretimle deneme yapmaya göre büyük bir maliyet avantajı.

Sınırları da net: 40 saniyelik toplam süre üst sınırı, uzun biçimli video içerik için yetersiz; 1080p ve 4K'nın native değil upscaling olması, ince detay gerektiren profesyonel prodüksiyon için kaliteyi sınırlıyor. Karmaşık, çok karakterli sahnelerde tutarlılık hâlâ tam çözülmüş bir problem değil.

## Sora ve Rakiplerine Karşı Nasıl Duruyor?

Omni 1.1 Flash'ın temel farkı fiyat ve kontrol ekseninde: OpenAI'ın Sora'sı sinematik kaliteye daha yakın dururken, Omni 1.1 Flash hız, düşük maliyetli taslak-sonra-yükselt iş akışı ve geliştirici API kontrolüne odaklanıyor. Video üretim modelleri arasında daha kapsamlı bir kıyaslama için [Sora ve Veo karşılaştırmamıza](/tr/posts/ai-video-uretimi-2026-sora-veo) bakabilirsiniz — Omni 1.1 Flash o karşılaştırmadaki Veo hattının doğrudan devamı, ayrı bir model ailesi değil.

Benim görüşüm: bu modelin asıl değeri "en iyi görüntü kalitesi" yarışında değil, iterasyon hızında. Saniyesi 0,03 dolardan taslak üretebilmek, bir video fikrini pahalı bir üretim öncesinde ucuza test etmenizi sağlıyor — bu, tek başına yüksek kaliteli çıktıdan daha değerli bir yetenek olabilir, özellikle küçük ekipler için.

## Kimler Şimdi Denemeli?

Sosyal medya için hızlı, düşük maliyetli klip üreten küçük pazarlama ekipleri ve konsept doğrulama yapan ürün ekipleri şimdi denemeli. Sinematik kalitede, uzun biçimli içerik üreten stüdyolar için model henüz olgun değil; onlar için Sora veya Veo'nun tam sürümü daha uygun bir seçim olmaya devam ediyor.

Bütçe planlarken şunu hesaba katın: ücretsiz katman veya toplu işlem indirimi olmadığı için, onlarca varyasyon deneyen bir ekip hızla birkaç yüz dolarlık faturaya ulaşabiliyor. Pratik yaklaşım, taslak aşamasını tamamen 360p'de tutup yalnızca son onaylanan sürümü 4K'ya yükseltmek — bu tek karar, toplam maliyeti kolayca 3-4 kat düşürebiliyor.

Google'ın diğer yapay zeka modelleri hakkında daha fazlası için Woyable'ın [yapay zeka kategorisine](/tr/category/yapay-zeka) göz atabilirsiniz.

## Sıkça Sorulan Sorular

### Gemini Omni 1.1 Flash gerçekten 4K video üretiyor mu?

Kısmen. Model native olarak yalnızca 360p ve 720p'de üretim yapıyor; 1080p ve 4K çıktı upscaling ile elde ediliyor, doğrudan üretim değil. Pratikte önce 360p'de taslak üretip beğendiğiniz sonucu yükseltmek en maliyet-etkin yol.

### Gemini Omni 1.1 Flash'ta bir video en fazla ne kadar uzatılabilir?

Sahneler 10 saniyelik parçalar halinde uzatılabiliyor ve toplam süre 40 saniyeye kadar çıkabiliyor. Bu, uzun biçimli video içerik için yeterli değil ama sosyal medya klipleri için yeterli.

### Gemini Omni 1.1 Flash saniyesi kaç dolar?

Fiyat çözünürlüğe göre değişiyor: 360p taslakta yaklaşık 0,03 dolar, 720p native üretimde yaklaşık 0,10 dolar, 1080p'de yaklaşık 0,15 dolar, 4K'da yaklaşık 0,30 dolar. Ücretsiz katman veya Batch API indirimi bulunmuyor.

### Gemini Omni 1.1 Flash, önceki önizleme sürümünün yerini mi alıyor?

Evet. Google, `gemini-omni-flash-preview` uç noktasını 30 Eylül 2026'da kullanımdan kaldıracağını duyurdu; 1.1 Flash bu önizlemenin genel kullanıma açık devamı, bu yüzden önizleme uç noktasını kullanan ekiplerin geçiş yapması gerekiyor.

Kaynaklar: [Google'ın Gemini Omni 1.1 Flash duyurusu](https://blog.google/innovation-and-ai/technology/developers-tools/build-with-gemini-omni-1-1-flash/), [Gemini API sürüm notları](https://ai.google.dev/gemini-api/docs/changelog), [TechRepublic'in Omni 1.1 incelemesi](https://www.techrepublic.com/article/news-google-gemini-omni-1-1-ai-video-control/).
