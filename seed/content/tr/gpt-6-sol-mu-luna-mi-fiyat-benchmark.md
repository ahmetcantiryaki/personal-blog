---
title: "GPT-6 Sol mu Luna mı? Fiyat ve Benchmark Karşılaştırması"
slug: "gpt-6-sol-mu-luna-mi-fiyat-benchmark"
translationKey: "gpt-6-sol-luna-launch-2026"
locale: "tr"
excerpt: "Kısa cevap: Kodlama ve ajan görevlerinde Sol'u, yüksek hacimli basit işlerde Luna'yı seçin. İkisi de 22 Eylül 2026'da çıktı, fiyat farkı 20 kat."
category: "ai"
tags: ["openai", "chatgpt", "ai-coding", "llm"]
publishedAt: "2026-09-26"
seoTitle: "GPT-6 Sol vs Luna: Fiyat ve Benchmark Karşılaştırması"
seoDescription: "OpenAI'ın 22 Eylül 2026'da çıkardığı GPT-6 Sol ve Luna'yı fiyat, bağlam penceresi ve AutomationBench/DeepSWE benchmark skorlarıyla ayrıntılı karşılaştırıyoruz."
---

Kısa cevap: Karmaşık kodlama ve çok adımlı ajan görevlerinde GPT-6 Sol'u kullanın; özetleme, veri çıkarma ve soru-cevap gibi yüksek hacimli basit işlerde GPT-6 Luna çok daha ucuz ve yeterli. Sol milyon token başına 2-10 dolar, Luna ise 0,10-0,50 dolar; aradaki fark 20 kat.

## GPT-6 Sol ve Luna nedir?

OpenAI, 22 Eylül 2026'da GPT-6 Astra'nın lansmanından yaklaşık bir hafta sonra iki yeni model duyurdu: GPT-6 Sol ve GPT-6 Luna. Sol karmaşık, çok adımlı işler için tasarlandı — kodlama ve ajan tabanlı akıl yürütme gibi. Luna ise yüksek hacimli ama daha az karmaşık işler için: özetleme, bilgi çıkarma, soru-cevap ve büro işi niteliğindeki görevler.

Her iki model de ChatGPT Work, Codex ve API üzerinden kullanıma açıldı. Plus, Pro, Business, Enterprise ve Edu kullanıcıları her iki modele de erişebiliyor; Free ve Go kullanıcıları ise masaüstü uygulamasında yalnızca GPT-6 Luna'yı görüyor. OpenAI'ın kendi duyurusuna göre ([openai.com](https://openai.com/index/introducing-gpt-6-sol-and-luna/)) iki model de GPT-5.6 nesline kıyasla yaklaşık yarı yarıya daha az hata yapıyor ve fiyatlandırma da GPT-5.6 muadillerine göre yaklaşık %50 daha düşük.

Bu, [GPT-6 Astra'nın](/tr/posts/gpt-6-astra-nedir) amiral gemisi konumunu değiştirmiyor; Sol ve Luna, Astra'nın gücünü daha hızlı ve daha ucuz katmanlara taşıyan modeller olarak konumlandırılıyor.

## GPT-6 Sol'un fiyatı ne kadar?

Sol, milyon girdi tokeni başına 2 dolar, milyon çıktı tokeni başına 10 dolar. Önbelleğe alınmış (cached) girdi tokenleri ise milyon başına yalnızca 0,20 dolar — bu, standart girdi fiyatına göre %90 indirim anlamına geliyor. Sistem promptunu ve bağlamı tekrar tekrar kullanan ajan iş akışlarında bu indirim efektif maliyeti belirgin şekilde aşağı çekiyor.

Sol'un hedefi, GPT-6 Astra'nın güvenilirlik seviyesine çok daha düşük maliyetle yaklaşmak. OpenAI'ın topluluk duyurusunda ([community.openai.com](https://community.openai.com/t/announcing-gpt-6-sol-and-gpt-6-luna-in-the-api-codex-and-chatgpt/1399925)) bu konumlandırma açıkça belirtiliyor: Sol, Astra'nın çok altında bir fiyatla benzer iş türlerini karşılamayı hedefliyor.

## GPT-6 Luna'nın fiyatı ne kadar?

Luna, milyon girdi tokeni başına 0,10 dolar, milyon çıktı tokeni başına 0,50 dolar; önbellekli girdi ise milyon başına yalnızca 0,01 dolar. Bu, aynı işi Sol'a göre yaklaşık 20 kat daha ucuza yaptırma imkânı veriyor — tabii iş, Luna'nın karmaşıklık sınırları içinde kalıyorsa.

OpenAI'ın iddiası dikkat çekici: yüksek efor (effort) seviyesinde çalıştırıldığında Luna, GPT-5.6 Sol'un performansına yaklaşık 1/100 maliyetle ulaşabiliyor. Bu, özetleme, sınıflandırma, veri çıkarma gibi milyonlarca satırlık işleri işleyen ekipler için bütçe açısından ciddi bir fark yaratıyor.

## Sol mu Luna mı, hangi görevde hangisi?

Kural basit: Görev birden fazla adım gerektiriyorsa, kod yazıp çalıştırmayı, araç çağırmayı veya uzun bir plana sadık kalmayı içeriyorsa Sol'u seçin. Görev tekilse, kısa sürede bitiyorsa ve büyük hacimde tekrarlanıyorsa (örneğin 10 bin destek talebini özetlemek) Luna çok daha mantıklı bir seçim.

Bu ayrım pratikte şuna karşılık geliyor: bir Codex ajanına bir özelliği baştan sona uygulatmak Sol işi; bir e-posta kutusundaki mesajları etiketlemek veya bir PDF'ten tablo çıkarmak Luna işi. Pek çok ekip aslında ikisini birlikte kullanıyor — ön işleme ve triage'ı Luna'ya, karar gerektiren asıl işi Sol'a bırakan bir boru hattı kurmak yaygınlaşan bir desen.

| Model | Girdi (1M token) | Çıktı (1M token) | Önbellekli girdi | Bağlam |
|---|---|---|---|---|
| GPT-6 Luna | $0,10 | $0,50 | $0,01 | 1,05M |
| GPT-6 Sol | $2 | $10 | $0,20 | 1,05M |
| GPT-6 Astra | $10 | $50 | $1 | 1,05M |
| Claude Opus 5 | $9 | $45 | — | 500K |

İki model de aynı bağlam penceresini paylaşıyor: 1.050.000 token toplam, bunun 922.000 tokeni girdi olarak kullanılabiliyor, çıktı ise en fazla 128.000 token. Yani bağlam kapasitesinde Sol ile Luna arasında hiçbir fark yok — fark tamamen akıl yürütme derinliğinde ve fiyatta.

## Sol, AutomationBench'te Claude Opus 5'i geçebiliyor mu?

Evet, belirli bir koşulda geçiyor. AutomationBench testinde Sol, "xhigh" efor seviyesinde %33,2 skor alıp görev başına 0,27 dolara mal oluyor. Bu skor, Claude Opus 5'in "max" efor seviyesinde aldığı %26,9'u geçiyor — üstelik Opus 5'in maliyeti Sol'un 11,1 katı. Sol ayrıca GPT-6 Astra'nın "low" efor seviyesindeki %30,3'lük skorunu da geçiyor; Astra'nın bu skordaki maliyeti Sol'un 3,9 katı ([TechCrunch](https://techcrunch.com/2026/09/22/openai-launches-gpt-6-sol-and-luna/)).

Ancak bu tabloyu tek bir metrikle okumak yanıltıcı olur. DeepSWE testinde Sol'un en iyi skoru %68,8 — bu, GPT-5.6 Sol'un %72,7'sinin ve Claude Opus 5'in %73,7'sinin altında. OSWorld 2.0'da da benzer bir tablo var: Sol'un en iyi skoru %64,4, GPT-5.6 Sol %66,2 ve Opus 5 %70,2 ile önde. Yani Sol, maliyet-başına-performans metriğinde güçlü ama ham yetenekte hâlâ üst segment modellerin gerisinde.

Editör notu: OpenAI'ın "maliyet-etkin" çerçevesi gerçek ama tek taraflı bir hikâye anlatıyor. AutomationBench'teki zafer gerçek, fakat DeepSWE ve OSWorld 2.0'daki kayıp da gerçek — bir ekip zor bir yazılım mühendisliği görevinde en yüksek başarı oranını istiyorsa Sol yerine GPT-5.6 Sol veya Opus 5'i tercih etmesi hâlâ mantıklı olabilir. Sol'un asıl kazandığı yer, "yeterince iyi" sonucun büyük hacimde ve düşük maliyetle tekrarlanması gereken senaryolar.

## API'de Sol ve Luna nasıl çağrılır?

İki model de standart Chat Completions veya Responses API şemasını kullanıyor; tek fark model kimliği ve gerekirse `effort` (efor) parametresi.

```json
{
  "model": "gpt-6-sol",
  "input": "Bu repodaki başarısız testleri bul ve düzelt",
  "effort": "xhigh"
}
```

Luna ile toplu özetleme gibi bir iş için model kimliğini değiştirmek yeterli:

```json
{
  "model": "gpt-6-luna",
  "input": "Bu 500 destek talebini kategorilere ayır",
  "effort": "high"
}
```

Codex kullanan ekipler için bu, [Codex'in 5 saatlik limitleriyle](/tr/posts/openai-codex-5-saatlik-limit-geri-dondu) birlikte düşünülmesi gereken bir seçim: Sol daha pahalı olduğu için limitleri daha hızlı tüketebilir, Luna ile ön işleme yaparak Sol'a giden istek sayısını azaltmak bütçeyi de koruyabilir.

## Ajan iş akışlarında hangi model daha mantıklı?

Çok adımlı, araç çağıran ajan zincirlerinde Sol tercih edilmeli çünkü uzun planlara sadık kalma ve hata oranı düşürme konusunda Luna'dan daha güçlü. OpenAI'ın kendi verilerine göre Sol, [Agents API](/tr/posts/openai-agents-api-nedir) ile kurulan çok adımlı iş akışlarında GPT-5.6 nesline göre yarı yarıya daha az hata yapıyor.

Luna'yı ajan zincirine tamamen dahil etmek yerine, zincirin ucuz ve tekrarlayan basamaklarında (örneğin bir web sayfasından veri çekip normalize etme) kullanmak, maliyeti optimize etmenin daha güvenli yolu. 9to5Mac'in haberine göre ([9to5mac.com](https://9to5mac.com/2026/09/22/openai-upgrading-chatgpt-and-codex-with-two-more-gpt-6-models/)) OpenAI bu iki modeli özellikle Codex ve ChatGPT Work'teki günlük kullanım senaryolarını hedefleyerek konumlandırdı — yani "her işi en pahalı modelle yap" yaklaşımından uzaklaşma sinyali bu.

## Sıkça Sorulan Sorular

### GPT-6 Sol ile GPT-6 Luna arasındaki temel fark nedir?

Sol, karmaşık kodlama ve çok adımlı ajan görevleri için tasarlandı ve milyon token başına 2-10 dolara mal oluyor; Luna, özetleme ve veri çıkarma gibi yüksek hacimli basit işler için tasarlandı ve milyon token başına 0,10-0,50 dolara mal oluyor. Aralarındaki fiyat farkı yaklaşık 20 kat, ikisi de aynı 1,05 milyon token bağlam penceresini paylaşıyor.

### GPT-6 Sol, GPT-6 Astra'nın yerini mi alıyor?

Hayır, Astra hâlâ OpenAI'ın amiral gemisi modeli ve "Kritik" siber güvenlik sınıflandırmasına giren tek model. Sol, Astra'nın gücüne daha düşük maliyetle yaklaşmayı hedefleyen orta katman bir model; AutomationBench'te Astra'nın "low" efor skorunu geçse de DeepSWE ve OSWorld 2.0'da Astra'nın gerisinde kalıyor.

### GPT-6 Luna ücretsiz ChatGPT kullanıcılarına açık mı?

Evet, Free ve Go planındaki kullanıcılar GPT-6 Luna'yı ChatGPT masaüstü uygulamasında kullanabiliyor. GPT-6 Sol ise yalnızca Plus, Pro, Business, Enterprise ve Edu planlarında, ayrıca API ve Codex üzerinden erişilebiliyor.

### Sol'un maliyet-etkinliği DeepSWE ve OSWorld 2.0 skorlarıyla nasıl uyuşuyor?

Uyuşmuyor gibi görünse de aslında farklı bir metrik ölçüyor. Sol, AutomationBench'te maliyet başına en iyi sonucu verirken DeepSWE'de %68,8 ve OSWorld 2.0'da %64,4 skorla GPT-5.6 Sol ve Claude Opus 5'in gerisinde kalıyor; yani en yüksek ham başarı oranı gerektiren zor mühendislik görevlerinde hâlâ üst segment modeller tercih edilmeli.
