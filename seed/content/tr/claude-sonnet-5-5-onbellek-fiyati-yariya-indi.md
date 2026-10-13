---
title: "Claude Sonnet 5.5 Önbellek Fiyatı Neden Yarıya İndi?"
slug: "claude-sonnet-5-5-onbellek-fiyati-yariya-indi"
translationKey: "claude-sonnet-5-5-cache-price-cut-2026"
locale: "tr"
excerpt: "Kısa cevap: Anthropic 7 Ekim 2026'da Sonnet 5.5'in cache okuma fiyatını milyon token başına 0,20 dolardan 0,10 dolara indirdi; taban fiyatın yüzde 5'i oldu."
category: "ai"
tags: ["claude", "pricing", "cost-optimization", "ai-tools"]
publishedAt: "2026-10-13"
seoTitle: "Claude Sonnet 5.5 Önbellek Fiyatı Yarıya İndi"
seoDescription: "Anthropic, 7 Ekim 2026'da Claude Sonnet 5.5'in cache okuma fiyatını yarıya indirdi. Yeni fiyatlar, kimin kazandığı ve gerçek tasarruf hesabı burada."
---

Kısa cevap: Evet, düştü. Anthropic 7 Ekim 2026'da Claude Sonnet 5.5'in prompt cache okuma fiyatını milyon token başına 0,20 dolardan 0,10 dolara indirdi — taban girdi fiyatının yüzde 10'u yerine yüzde 5'i. Cache yazma ve diğer tüm fiyatlar değişmedi; indirim yalnızca önceden önbelleğe alınmış içeriği okumayı etkiliyor.

## Anthropic tam olarak neyi değiştirdi?

Değişiklik tek bir sayı: Sonnet 5.5'te cache okuma (hit) fiyatı 0,20 dolardan 0,10 dolara indi. Anthropic'in resmi fiyatlandırma sayfası bu indirimi "taban girdi fiyatının 0,1 katı yerine 0,05 katı" olarak tanımlıyor — yani Opus 5.5 ile birlikte Sonnet 5.5, standart yüzde 10 cache okuma oranından ayrılan tek modeller.

| Kalem | Sonnet 5.5 (7 Ekim öncesi) | Sonnet 5.5 (7 Ekim sonrası) | Sonnet 5 (değişmedi) |
|---|---|---|---|
| Taban girdi | 2,00 $ / MTok | 2,00 $ / MTok | 2,00 $ / MTok |
| Çıktı | 10,00 $ / MTok | 10,00 $ / MTok | 10,00 $ / MTok |
| 5 dk cache yazma | 2,50 $ / MTok | 2,50 $ / MTok | 2,50 $ / MTok |
| 1 sa cache yazma | 4,00 $ / MTok | 4,00 $ / MTok | 4,00 $ / MTok |
| **Cache okuma** | **0,20 $ / MTok** | **0,10 $ / MTok** | 0,20 $ / MTok |

Sonnet 5, 30 Kasım 2026'da emekliye ayrılacağı için bu karşılaştırma kısa ömürlü olsa da, şu an aynı taban fiyata sahip iki model arasında yalnızca cache okuma oranının ayrıştığını gösteriyor.

## Bu indirim neden taban fiyatı değil, cache okumayı hedefliyor?

Çünkü asıl maliyet yükü, tekrar eden bağlamda birikiyor. Bir kodlama ajanı veya uzun sohbet arayüzü her turda sistem promptunu, araç tanımlarını ve önceki mesaj geçmişini yeniden gönderiyor; bu içerik önbelleğe alınmışsa model onu yeniden işlemiyor, sadece okuyor. Taban girdi fiyatını düşürmek tüm kullanıcılara eşit fayda sağlardı, ama cache okuma fiyatını düşürmek özellikle yüksek cache-hit oranına sahip iş yüklerini — yani tam olarak ajan ve uzun bağlamlı uygulamaları — hedefliyor.

Bu aynı zamanda bir fiyatlandırma stratejisi tercihi: taban fiyatı düşürmek her isteğin maliyetini aynı oranda azaltıyor, oysa cache okuma fiyatını düşürmek yalnızca zaten tekrar eden, önceden yazılmış içeriği okuyan isteklerde fark yaratıyor. Pratikte bu, Anthropic'in hacimli ve sadık kullanım üzerinde rekabet ettiği, tek seferlik düşük hacimli kullanım üzerinde değil, anlamına geliyor.

## Bundan en çok kim kazanıyor?

Cache-hit oranı yüksek üç iş yükü en büyük payı alıyor: çok turlu kodlama ajanları (Claude Code dahil), aynı sistem promptunu binlerce kez yeniden kullanan müşteri destek botları ve aynı belge kümesini tekrar tekrar sorgulayan RAG sistemleri. Bir sohbeti tek seferde başlatıp bitiren düşük turlu uygulamalar için etkisi sınırlı kalıyor, çünkü cache yazma maliyetini amorti edecek kadar okuma turu olmuyor.

## Gerçek tasarruf ne kadar?

Günde 10 milyon cache-okunan token işleyen orta ölçekli bir ajan için hesap şöyle:

```text
Önce (0,20 $/MTok): 10 MTok x 0,20 $ = 2,00 $/gün  -> ~60 $/ay (30 gün)
Sonra (0,10 $/MTok): 10 MTok x 0,10 $ = 1,00 $/gün -> ~30 $/ay (30 gün)
Aylık tasarruf: ~30 $

Günde 500 milyon token okuyan büyük bir ekip için:
Önce: 500 MTok x 0,20 $ = 100 $/gün -> 3.000 $/ay
Sonra: 500 MTok x 0,10 $ = 50 $/gün -> 1.500 $/ay
Aylık tasarruf: 1.500 $
```

Tasarruf doğrusal olarak cache-okunan hacimle ölçekleniyor; token başı maliyeti yarıya indiği için toplam fatura da aynı oranda düşüyor — ek bir yapılandırma veya ücretli bir yükseltme gerekmiyor, çünkü indirim otomatik olarak uygulanıyor. Bu hesaplar yalnızca cache okuma maliyetini kapsıyor; taban girdi, çıktı ve cache yazma maliyetleri aynı kaldığı için toplam faturanızdaki gerçek düşüş oranı, cache okumanın toplam faturanızın ne kadarını oluşturduğuna bağlı olarak değişiyor.

## Kendi cache-hit oranınızı nasıl ölçersiniz?

Claude API'ye yapılan her istek, yanıtın `usage` nesnesinde `cache_read_input_tokens` ve `cache_creation_input_tokens` alanlarını döndürüyor — bu iki sayıyı toplam `input_tokens` ile karşılaştırmak, isteklerinizin ne kadarının cache'ten okuduğunu gösteriyor. Cache-hit oranınız düşükse (örneğin sistem promptunuz her istekte değişiyorsa), bu fiyat indirimi faturanıza neredeyse hiç yansımaz; oran yüksekse (sabit bir sistem promptu ve araç tanımı seti kullanan bir ajan gibi) indirim doğrudan kâr marjınıza dönüşüyor.

```json
{
  "usage": {
    "input_tokens": 120,
    "cache_creation_input_tokens": 0,
    "cache_read_input_tokens": 8400,
    "output_tokens": 340
  }
}
```

Yukarıdaki örnekte isteğin büyük kısmı (8.400 token) cache'ten okunmuş, yalnızca 120 token yeni girdi olarak işlenmiş — bu, yüksek cache-hit oranına sahip tipik bir ajan isteğinin görünümü. Aylık faturanızı incelerken bu iki alanı toplayıp toplam girdi token sayısına bölmek, kabaca cache-hit oranınızı veriyor; oran %70'in üzerindeyse bu indirim sizin için önemli bir fark yaratıyor demektir.

## Aynı haftaki diğer değişikliklerle bağlantısı ne?

Bu fiyat değişikliği izole değil. Aynı 7 Ekim gününde Anthropic, 1 milyon token bağlam penceresine sahip [Claude Haiku 5.5'i](/tr/posts/claude-haiku-5-5-nedir-fiyat-hiz) piyasaya sürdü; bir gün önce, 6 Ekim'de, Agent aracına bir [effort parametresi](/tr/posts/claude-code-effort-parametresi-nedir) eklendi ve Claude Code 2.1.296 sürümü (9 Ekim) bu fiyatlandırmayı doğrudan yansıttı. Aynı 2.1.296 sürümü, Read aracına büyük metin dosyalarını tek seferde okumak için bir `allow_large` seçeneği ve MCP araç açıklamalarının başlangıçta gönderilen varsayılan karakter sınırını 2.048'den 4.096'ya çıkaran bir değişiklik de getirdi — her biri küçük görünse de hepsi aynı yöne işaret ediyor: Claude Code'un ajan iş akışlarında daha fazla bağlamı daha ucuza taşıması. Üç değişiklik birlikte okunduğunda hikaye netleşiyor: Anthropic, ucuz modelleri (Haiku), ince ayarlı kontrolü (effort) ve ucuz tekrar kullanımı (cache okuma) aynı hafta içinde paketleyerek ajan iş yüklerinin birim maliyetini düşürüyor.

Kişisel yorumum: bu indirim cömertlikten değil doğrudan rekabetten geliyor. Cache okuma fiyatı, bir sağlayıcının ajan iş yüklerini elde tutmak için en kolay çevirebileceği kol — taban fiyatı düşürmek marjı her istekte eritirken, cache okumayı düşürmek yalnızca zaten yüksek hacimli, sadık kullanım üzerinde maliyeti düşürüyor. Eğer [AI abonelik maliyetinizi](/tr/posts/yapay-zeka-abonelik-dagilimi-maliyet) takip eden bir ekipseniz, bu tür mimariye özgü indirimlerin genel plan fiyatından daha büyük bir etkisi olabiliyor — çünkü bir koltuk fiyatını düşürmek herkese eşit fayda sağlarken, bir mimari parametresini (cache okuma gibi) düşürmek yalnızca o parametreyi zaten yoğun kullanan ekiplere fayda sağlıyor.

## Sıkça Sorulan Sorular

### Claude Sonnet 5.5 cache fiyatı ne zaman düştü?

Anthropic, Sonnet 5.5'in prompt cache okuma fiyatını 7 Ekim 2026'da milyon token başına 0,20 dolardan 0,10 dolara indirdi. Değişiklik otomatik olarak uygulandı; mevcut API anahtarlarının veya entegrasyonların güncellenmesi gerekmiyor.

### Cache yazma fiyatı da düştü mü?

Hayır. 5 dakikalık cache yazma (taban fiyatın 1,25 katı, 2,50 $/MTok) ve 1 saatlik cache yazma (2 katı, 4,00 $/MTok) değişmeden kaldı. İndirim yalnızca daha önce yazılmış içeriği okumayı kapsıyor.

### Bu indirim diğer Claude modellerini de kapsıyor mu?

Hayır, yalnızca Claude Opus 5.5 ve Claude Sonnet 5.5, taban fiyatın yüzde 5'i oranında cache okuma fiyatına sahip. Diğer tüm modeller (Sonnet 5, Sonnet 4.6, Fable serisi dahil) standart yüzde 10 oranında kalmaya devam ediyor.

### Bu indirimden en çok hangi uygulamalar faydalanıyor?

Yüksek cache-hit oranına sahip çok turlu iş yükleri en büyük faydayı görüyor: kodlama ajanları, aynı sistem promptunu tekrar tekrar yeniden kullanan destek botları ve sabit bir belge kümesini sorgulayan RAG sistemleri. Tek seferlik, düşük turlu sohbetlerde etkisi sınırlı kalıyor.
