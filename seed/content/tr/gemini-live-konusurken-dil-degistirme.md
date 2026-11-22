---
title: "Gemini Live Artık Konuşurken Dil Değiştiriyor"
slug: "gemini-live-konusurken-dil-degistirme"
translationKey: "gemini-live-language-switching-2026"
locale: "tr"
excerpt: "Kısa cevap: Gemini'nin Live API'si, konuşma ortasında 97 dil arasında geçiş yapabiliyor; aynı sayı Gemini Enterprise'da da var, tüketici uygulamasında belirsiz."
category: "ai"
tags: ["gemini", "ai-tools", "accessibility", "communication"]
publishedAt: "2026-11-22"
seoTitle: "Gemini Live Konuşurken Dil Değiştirme Nasıl Çalışır?"
seoDescription: "Gemini'nin Live API'si artık 97 dil arasında konuşma ortasında geçiş yapıyor. Geliştiriciler ve Gemini Enterprise kullanıcıları için ne değiştiğini anlatıyoruz."
---

Kısa cevap: Gemini'nin geliştiricilere yönelik Live API'si, bir konuşmanın ortasında elle ayar değiştirmeden 97 dil arasında geçiş yapabiliyor; aynı sayı Gemini Enterprise'ın Live Avatar özelliğinde de doğrulanmış durumda. Ücretsiz tüketici uygulamasında bu tam sayı henüz bağımsız olarak teyit edilmedi.

[Google'ın Eylül 2026'da yayımladığı ses modeli güncellemesi](https://blog.google/products/gemini/gemini-audio-model-updates/), Live API'nin doğal ses modellerinin artık bir konuşma içinde desteklenen diller arasında doğal şekilde geçiş yapabildiğini bildiriyor — kullanıcı dili elle değiştirmeden. Gemini Enterprise'daki Live Avatar katmanı için ayrı bir haber, bu özelliğin 97 dil arasında konuşma sırasında geçiş yapabildiğini, ama şu an sadece Gemini Enterprise içinde çalıştığını aktarıyor.

## Gemini Live tam olarak ne yapıyor?

Gemini Live, sesli bir konuşma sırasında kullanıcının söylediği dili algılayıp o dilde yanıt veren, hatta konuşma ortasında dil değiştirildiğinde bunu takip edebilen bir ses modeli katmanı. Önceki nesillerde bu tür bir geçiş genellikle ayarlar menüsünden dil seçmeyi gerektiriyordu; buradaki fark, geçişin konuşmayı kesmeden, elle müdahale olmadan gerçekleşmesi.

## 97 dil rakamı nereden geliyor ve kime uygulanıyor?

Burada iki farklı ürün katmanını ayırmak önemli. Birincisi, geliştiricilere açık Live API: Google'ın ses modeli güncellemesine göre bu API artık 97 dili destekliyor ve doğal ses modelleri konuşma ortasında elle ayar yapılmadan diller arasında geçebiliyor. İkincisi, Gemini Enterprise'daki Live Avatar: bir haber kaynağı, bu katmanın da 97 dil arasında konuşma sırasında geçiş yapabildiğini, ama yalnızca Gemini Enterprise içinde çalıştığını (başka yerde değil) bildiriyor.

| Katman | Dil sayısı | Konuşma ortası geçiş | Doğrulama durumu |
|---|---|---|---|
| Live API (geliştirici) | 97 | Var | Google'ın kendi duyurusu |
| Gemini Enterprise Live Avatar | 97 | Var | Üçüncü taraf haber, sadece Enterprise'da |
| Gemini 3.5 Live Translate | 70+ | Çeviri odaklı, otomatik dil algılama | Google'ın kendi duyurusu |
| Ücretsiz tüketici uygulaması | Belirsiz (önceki nesilde 45+) | Mid-sentence geçiş bildirildi | Sadece üçüncü taraf, tarihsiz test |

Bu tablonun en önemli satırı son satır: genel tüketici Gemini uygulamasının şu anda tam olarak 97 dili desteklediğine dair birincil bir Google kaynağı bulamadık. Daha önceki bir nesilde (2025 başı), kullanıcılar ayar değiştirmeden 45'in üzerinde dil kombinasyonunda Gemini Live ile sohbet edebiliyordu ve [bir teknoloji sitesinin eli-kolu testi](https://www.androidauthority.com/gemini-live-multilingual-conversations-3531848/), cümle ortasında dil değiştirmenin de çalıştığını bildirmişti — ama bu, tarihi belirsiz, ikincil bir kaynak.

## Bu gerçek kullanım senaryolarında ne değiştiriyor?

Konuşma ortasında dil değiştirme, üç somut senaryoda fark yaratıyor:

- **Müşteri destek**: Bir destek hattı, aynı çağrı içinde müşterinin diline uyum sağlayabiliyor; örneğin müşteri Türkçe başlayıp bir terim için İngilizceye geçtiğinde konuşma kesintiye uğramıyor.
- **Seyahat**: [Gemini'nin canlı çeviri özelliğini](/tr/posts/gemini-canli-ceviri-gezginler-icin-rehber) kullanan bir gezgin, karşısındaki kişinin dilini önceden seçmek zorunda kalmadan sohbeti sürdürebiliyor.
- **Dil pratiği**: Bir öğrenci, pratik yaptığı dilde zorlandığı anda ana diline geçip açıklama isteyebiliyor, sistem bunu bir hata olarak değil doğal bir geçiş olarak işliyor.

## Nerede hâlâ zorlanıyor?

Konuşma ortası geçişin sınırları var. Enterprise Live Avatar şu an sadece Gemini Enterprise içinde çalışıyor, yani bu seviyedeki deneyim her kullanıcıya açık değil. Ayrıca iki kaynak arasında rakamlar tam örtüşmüyor: Live Translate modeli "70'in üzerinde dil" diyor, Live API ve Enterprise Avatar "97 dil" diyor — bu, farklı modellerin farklı dil kapsamına sahip olabileceği, "Gemini Live" adının tek bir ürünü değil bir ürün ailesini kapsadığı anlamına geliyor. Tüketici uygulamasını kullanan sıradan bir kullanıcı için en güvenli varsayım, "en az 45+ dil, konuşma ortası geçiş muhtemelen çalışıyor, ama tam dil listesi uygulama içinden kontrol edilmeli" olmalı.

## Bu özellik erişilebilirlik açısından neden önemli?

Konuşma ortası dil geçişi, çok dilli ailelerde veya karma dilli iş yerlerinde yaşayan kullanıcılar için küçük ama gerçek bir sürtünmeyi ortadan kaldırıyor. İki dilli konuşan biri, günlük hayatında zaten cümle içinde dil değiştiriyor (dilbilimciler buna "kod değiştirme" diyor); bir sesli asistanın bunu doğal karşılaması, kullanıcının asistanın diline uyum sağlamasını değil, asistanın kullanıcının doğal konuşma tarzına uyum sağlamasını sağlıyor. İşitme veya konuşma güçlüğü olan kullanıcılar için de bu önemli: tercüman aramak veya ayarlar menüsünde dil değiştirmek için duraklamak, zaten zor olan bir etkileşime ekstra bir adım katıyor; bu adımın kalkması, özellikle acil durumlarda (bir müşteri destek çağrısı, bir sağlık danışmanlığı) fark yaratabiliyor.

Bununla birlikte, bu faydanın tüketici uygulamasında ne kadar tutarlı çalıştığı hâlâ belirsiz. Bir özelliğin kurumsal katmanda (Gemini Enterprise) veya geliştirici API'sinde doğrulanmış olması, aynı deneyimin ücretsiz uygulamada aynı güvenilirlikte çalıştığı anlamına gelmiyor; bu yüzden erişilebilirlik ihtiyacı için bu özelliğe güvenen bir kullanıcının, kendi dil çiftinde geçişi test etmesi öneriliyor.

## ChatGPT'nin sesli modu bu konuda nerede duruyor?

[GPT Realtime ile sesli ajan kurma](/tr/posts/gpt-realtime-2-1-sesli-ai-ajani-kurmak) yazımızda ele aldığımız gibi, OpenAI'ın sesli altyapısı da dil geçişini destekliyor, ama iki şirket bu özelliği farklı şekilde pazarlıyor: Google dil sayısını (97) öne çıkarırken OpenAI genellikle gecikme ve doğallık metriklerine odaklanıyor. [Büyük üç yapay zekanın sesli asistanlarını karşılaştırdığımız yazıda](/tr/posts/ai-sesli-asistan-kiyaslamasi-gpt-live-gemini-claude) da gördüğümüz gibi, bu alanda "hangisi daha iyi" sorusunun cevabı kullanım senaryosuna göre değişiyor — çok dilli bir destek hattı için dil kapsamı öncelikli, tek dilli ama düşük gecikmeli bir uygulama için ise gecikme metrikleri daha belirleyici.

## Geliştiriciler Live API'yi nasıl deniyor?

Live API'yi deneyen bir geliştirici için pratik adım, modelin dil algılama davranışını gerçek bir konuşma senaryosuyla test etmek:

```text
Kullanıcı (Türkçe): "Merhaba, bu faturadaki hatayı anlamıyorum."
Gemini (Türkçe): "Tabii, hangi satırı kastediyorsunuz?"
Kullanıcı (İngilizce): "The second line item, actually."
Gemini (İngilizce): "Got it — let's look at that line together."
```

Bu örnekte önemli olan, kullanıcının "şimdi İngilizceye geçiyorum" demesine gerek kalmaması; model geçişi konuşmanın doğal akışından çıkarıyor. Bunu kendi uygulamanızda test ederken, geçişin hangi dil çiftlerinde daha güvenilir çalıştığını not etmek, canlıya almadan önce kritik; özellikle gramer yapısı çok farklı diller arasında (örneğin Türkçe ile İngilizce) geçiş kalitesi, aynı dil ailesindeki diller arasındaki geçişten farklı davranabilir.

## Sıkça Sorulan Sorular

### Gemini Live konuşma ortasında kaç dil arasında geçiş yapabiliyor?

Google'ın Live API'si ve Gemini Enterprise'daki Live Avatar özelliği 97 dil arasında konuşma ortasında geçiş yapabiliyor. Bu rakam geliştirici API'si ve Enterprise katmanı için doğrulanmış durumda; ücretsiz tüketici uygulamasında aynı sayı bağımsız olarak teyit edilmedi.

### Bu özellik ücretsiz Gemini uygulamasında da var mı?

Muhtemelen bir ölçüde var, çünkü önceki nesilde bile 45'in üzerinde dilde ayar değiştirmeden sohbet etmek ve cümle ortasında dil değiştirmek mümkündü. Ama 97 dil rakamının tüketici uygulamasına tam olarak uygulandığına dair birincil bir Google kaynağı yok; bu yüzden tam dil listesini uygulama içinden kontrol etmek gerekiyor.

### Live Avatar ile Live API arasındaki fark ne?

Live API, geliştiricilerin kendi uygulamalarına entegre ettiği bir sesli model katmanı; Live Avatar ise Gemini Enterprise içinde çalışan, görsel bir avatar katmanıyla birleşmiş bir deneyim. İkisi de 97 dil arasında konuşma ortası geçişi destekliyor, ama Live Avatar şu an yalnızca Gemini Enterprise müşterilerine açık.

### Gemini Live Translate, Live API'den farklı mı?

Evet. Live Translate, 70'in üzerinde dilde konuşmadan konuşmaya çeviri yapan ayrı bir model; otomatik dil algılama yapıyor ama amacı genel sohbet değil, çeviri. Live API ise genel amaçlı bir konuşma modeli ve dil geçişi onun bir yan özelliği.
