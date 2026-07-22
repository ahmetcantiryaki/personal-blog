---
title: "Gemini 3.6 Flash, 3.5 Flash-Lite ve Cyber Geldi"
slug: "gemini-3-6-flash-3-5-flash-lite-ve-cyber"
translationKey: "gemini-flash-trio-launch"
locale: "tr"
excerpt: "Google 21 Temmuz'da üç yeni Gemini modeli çıkardı: 3.6 Flash, 3.5 Flash-Lite ve güvenlik odaklı Cyber. Gemini 3.5 Pro yine listede yok, üçüncü kez erteleniyor."
category: "ai"
tags: ["gemini", "llm", "ai-tools", "cost-optimization"]
publishedAt: "2026-07-22"
seoTitle: "Gemini 3.6 Flash, 3.5 Flash-Lite, Cyber: Ne Değişti?"
seoDescription: "Google 21 Temmuz'da üç yeni Gemini modeli çıkardı: 3.6 Flash, 3.5 Flash-Lite ve güvenlik odaklı Cyber. Gemini 3.5 Pro yine listede yok, üçüncü kez erteleniyor."
---

Google dün, 21 Temmuz 2026'da üç yeni Gemini modeli yayınladı: Gemini 3.6 Flash, Gemini 3.5 Flash-Lite ve güvenlik açığı avcılığına özel Gemini 3.5 Flash Cyber. Uzun süredir beklenen Gemini 3.5 Pro yine listede yok — 17 Temmuz için söylenen tarih de kaçtı, şimdi Ağustos konuşuluyor. Yani hikaye şu: hız/maliyet katmanı hızla ilerliyor, amiral gemisi akıl yürütme modeli ise ertelenmeye devam ediyor.

## Dün Ne Çıktı, Ne Çıkmadı?

Bu üçü, Google'ın "ucuz ve hızlı" katmanına odaklandığını gösteriyor. [officechai'nin haberine göre](https://officechai.com/ai/google-releases-gemini-flash-3-6-and-gemini-flash-3-5-lite/) her iki genel amaçlı model de aynı 1 milyon token bağlam penceresini koruyor, 64K maksimum çıktı, yerel çoklu-modal girdi ve Computer Use dahil yerleşik araçlarla geliyor. Değişen şey ham "zeka" puanı değil; verimlilik ve görev tamamlama hızı.

[TechCrunch'ın başlığının da vurguladığı gibi](https://techcrunch.com/2026/07/21/google-releases-three-new-gemini-models-but-no-3-5-pro/), asıl haber aslında çıkmayan model: Gemini 3.5 Pro. Bu konuyu [Gemini 3.5 Pro'nun art arda üç tarih kaçırdığını](/tr/posts/gemini-3-5-pro-yine-gecikti) anlattığımız yazıda detaylı işlemiştik; dünkü lansman o hikayenin doğrudan devamı. Google, amiral gemisini beklerken pazarda "elde var" bir seçenek sunmaya devam ediyor.

## Gemini 3.6 Flash: Aynı Kalite, Daha Ucuz ve Daha Hızlı

Gemini 3.6 Flash, milyon token başına 1,50 dolar girdi / 7,50 dolar çıktı fiyatıyla geliyor — bu, Gemini 3.5 Flash'ın 1,50 dolar / 9,00 dolar fiyatlandırmasına göre çıktı tarafında belirgin bir indirim. Artificial Analysis Index'te (bağımsız bir model kıyaslama endeksi) 3.5 Flash'a kıyasla yaklaşık yüzde 17 daha az çıktı token'ı kullanıyor. Google'ın kendi ölçümlerinde kodlama, bilgisayar kullanımı, bilgi işi ve makine öğrenmesi araştırma görevlerinde 3.5 Flash'a göre iyileşme var, ama bunu bir "zeka sıçraması" olarak okumak yanlış olur — kazanım büyük ölçüde verimlilik ve görev başına süreyi kabaca yarıya indiren hız artışından geliyor.

Pratikte bu, üretimde zaten 3.5 Flash kullanan bir ekip için düşük riskli bir yükseltme demek: aynı davranış profili, daha ucuz çıktı, daha az token israfı.

## Gemini 3.5 Flash-Lite: Asıl Sıçrama Burada

Asıl dikkat çekici fark küçük modelde. Gemini 3.5 Flash-Lite, milyon token başına 0,30 dolar girdi / 2,50 dolar çıktı fiyatıyla geliyor, saniyede yaklaşık 350 çıktı token'ı üretiyor ve Artificial Analysis Intelligence Index'te öncekine (3.1 Flash-Lite) göre yaklaşık 11 puanlık gerçek bir sıçrama gösteriyor.

Google'ın yayınladığı kıyaslamalar bu sıçramayı sayısal olarak da destekliyor:

| Benchmark | 3.1 Flash-Lite | 3.5 Flash-Lite |
|---|---|---|
| Terminal-Bench 2.1 (ajan bazlı terminal görevleri) | %31 | %54 |
| GDM-MRCR v2 (uzun bağlam) | %60,1 | %72,2 |
| GDPval-AA v2 | 642 | 1140 |

Terminal-Bench'te başarı oranının neredeyse iki katına çıkması özellikle dikkat çekici; bu, ajan iş akışlarında (terminal komutları çalıştırma, çok adımlı görevleri tamamlama gibi) küçük ve ucuz bir modelin artık ciddi işler görebileceği anlamına geliyor. Yüksek hacimli, gecikmeye duyarlı uygulamalar (öneri sistemleri, sınıflandırma, ön işleme) için Flash-Lite artık gerçek bir seçenek, "idare eder" bir yedek değil.

## Gemini 3.5 Flash Cyber: Sınırlı Erişimli Güvenlik Modeli

Üçüncü model farklı bir kategori. Gemini 3.5 Flash Cyber, 3.5 Flash üzerine inşa edilmiş ve yazılımdaki güvenlik açıklarını ucuza, ölçekte keşfetmek, doğrulamak ve yamalamak için ince ayarlanmış özel bir model. Büyük amiral gemisi modeller milyonlarca satır kod üzerinde tekrar tekrar çalıştırılmak için genelde çok yavaş ve pahalı; Flash Cyber bilinçli olarak hafif tutulmuş ki sürekli arka planda çalışabilsin.

[TheHackerNews'in aktardığına göre](https://thehackernews.com/2026/07/google-launches-gemini-35-flash-cyber.html), V8 JavaScript motorunun kod tabanına karşı yapılan testte Flash Cyber 55 benzersiz doğrulanmış sorun buldu; standart Gemini 3.5 Flash 47, Claude Opus 4.6 ise 36 sorun buldu. Bu, aynı kod tabanına karşı üç farklı modelin doğrudan karşılaştırıldığı nadir bir vaka ve sonuç, göreve özel ince ayarın genel amaçlı bir amiral gemisi modelden daha iyi performans verebileceğini gösteriyor.

Şunu da belirtmek gerek: Flash Cyber'ın herkese açık bir API fiyatlandırması yok. Model, Google DeepMind'ın Ekim 2025'te tanıttığı yapay zeka destekli güvenlik açığı keşif ve yama ajanı CodeMender üzerinden, yalnızca devletlere ve güvenilir ortaklara sınırlı bir pilot programla sunuluyor. Yani bu hafta kendi projenize ekleyebileceğiniz bir şey değil — ama yönü gösteriyor: Google, güvenlik taramasını amiral gemisi model maliyetinden bağımsızlaştırmaya çalışıyor.

## Üç Model, Tek Bakışta

| Model | Fiyat (girdi/çıktı, milyon token) | Bağlam penceresi | Erişim | En iyi kullanım |
|---|---|---|---|---|
| Gemini 3.6 Flash | $1,50 / $7,50 | 1M token | Genel API | Genel üretim iş yükleri, maliyet düşürme |
| Gemini 3.5 Flash-Lite | $0,30 / $2,50 | 1M token | Genel API | Yüksek hacimli, gecikmeye duyarlı ajan görevleri |
| Gemini 3.5 Flash Cyber | Yayınlanmadı | — | CodeMender üzerinden sınırlı pilot | Sürekli güvenlik açığı taraması (devlet/ortak) |

## API'de Model Seçimi

İki genel amaçlı model de aynı SDK üzerinden, sadece model kimliğini değiştirerek çağrılabilir. Aşağıdaki örnek gösterge niteliğinde:

```json
{
  "model": "gemini-3.6-flash",
  "contents": [{ "role": "user", "parts": [{ "text": "Kod incelemesi yap" }] }],
  "generationConfig": { "maxOutputTokens": 65536 }
}
```

Maliyete daha duyarlı, yüksek hacimli bir iş yükünde model kimliğini `gemini-3.5-flash-lite` olarak değiştirmek genelde tek gereken değişiklik; API sözleşmesi ve parametre şeması aynı kalıyor.

## Geliştiriciler İçin Ne Değişti?

Bugün elinizdeki karar basit: gecikmeye veya maliyete duyarlı bir şey inşa ediyorsanız, 3.6 Flash veya 3.5 Flash-Lite güvenli ve daha ucuz bir yükseltme. Özellikle Flash-Lite'ın Terminal-Bench ve uzun bağlam skorlarındaki sıçrama, küçük modelleri artık "basit görevlerle sınırlı" olarak görmemek gerektiğini gösteriyor. Ama özellikle 3.5 Pro sınıfı bir akıl yürütme sıçraması bekliyorsanız, bu bekleyiş sürüyor — ve art arda üçüncü kaçırılan tarihten sonra, bir sonraki tarihe de temkinli yaklaşmakta fayda var. Bu ikili tabloyu [Claude Sonnet 5, GPT-5.6 ve Gemini 3.5 karşılaştırmamızda](/tr/posts/claude-sonnet-5-gpt-5-6-gemini-3-5-kiyaslamasi) daha geniş bağlamda ele almıştık.

Kişisel görüşüm şu: Flash katmanındaki bu iterasyon hızı, çoğu gerçek dünya kullanım senaryosu için Pro'nun gecikmesinden daha önemli. Pratikte üretim iş yüklerinin büyük kısmı zaten en güçlü modeli değil, yeterince iyi ve ucuz bir modeli kullanıyor — Flash-Lite'ın bir önceki sürüme göre neredeyse iki katına çıkan Terminal-Bench skoru, bu segmentte gerçek bir kalite iyileşmesi olduğunu gösteriyor. Pro gecikmesi manşetleri kapıyor, ama günlük mühendislik kararlarının çoğunu Flash katmanındaki bu sessiz ama sürekli iyileşme şekillendiriyor.

Genel amaçlı araç ve model karşılaştırmaları için [Gemini mi ChatGPT mi?](/tr/posts/gemini-mi-chatgpt-mi) yazısına, iş kollarına özel Gemini kullanımı için ise bugünkü diğer yazımız [Gemini Gems ile işletmeye özel AI asistanları](/tr/posts/gemini-gems-isletmeye-ozel-ai-asistanlari) rehberine göz atabilirsiniz. Araştırma ve öğrenme iş akışlarınızı Gemini ekosistemiyle güçlendirmek isterseniz [NotebookLM ile araştırma ve öğrenme](/tr/posts/notebooklm-ile-arastirma-ve-ogrenme) rehberi de faydalı olacaktır. Daha geniş bağlam için [AI kategorimize](/tr/category/yapay-zeka) bakabilirsiniz.

## Sıkça Sorulan Sorular

### Gemini 3.5 Pro ne zaman çıkacak?

Google resmi bir tarih vermedi. 17 Temmuz 2026 hedefi kaçırıldı ve şu anda Ağustos içinde bir pencere konuşuluyor, ancak model art arda kaçırılan tarihlerden sonra bu tahmine de temkinli yaklaşmak gerekir.

### Gemini 3.6 Flash ile 3.5 Flash-Lite arasındaki temel fark ne?

3.6 Flash, orta ölçekli genel amaçlı iş yükleri için tasarlanmış ve fiyat/performans dengesini iyileştiriyor. 3.5 Flash-Lite ise çok daha ucuz ve hızlı, yüksek hacimli veya gecikmeye duyarlı görevler için optimize edilmiş; bir önceki sürüme göre ajan görevlerinde belirgin bir kalite sıçraması gösteriyor.

### Gemini 3.5 Flash Cyber'ı kendi projemde kullanabilir miyim?

Şu an için hayır. Model herkese açık API fiyatlandırmasıyla sunulmuyor; CodeMender üzerinden yalnızca devletlere ve güvenilir ortaklara sınırlı bir pilot programla erişim veriliyor.

### Şimdi hangi Gemini modelini seçmeliyim?

Genel üretim iş yükleri için 3.6 Flash düşük riskli bir yükseltme. Yüksek hacimli, maliyete duyarlı veya ajan tabanlı görevler için 3.5 Flash-Lite'ı değerlendirin. Frontier düzeyinde bir akıl yürütme sıçraması bekliyorsanız, 3.5 Pro'nun çıkışını beklemek yerine bugün mevcut en iyi alternatifi (Gemini 3.5 Flash, GPT-5.6 veya Claude Sonnet 5) kullanmanızı öneririz.
