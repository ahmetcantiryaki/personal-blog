---
title: "GPT-6.1 Terra Nedir? Daha Ucuz, Daha Hızlı Model"
slug: "gpt-6-1-terra-nedir"
translationKey: "gpt-6-1-terra-launch-2026"
locale: "tr"
excerpt: "Kısa cevap: GPT-6.1 Terra, OpenAI'ın 26 Ekim 2026'da duyurduğu, GPT-5.6 Terra'nın yarısı fiyata çalışan, hata oranı düşük orta seviye modeldir."
category: "ai"
tags: ["openai", "chatgpt", "llm", "pricing"]
publishedAt: "2026-11-01"
seoTitle: "GPT-6.1 Terra Nedir? Fiyat ve Performans"
seoDescription: "GPT-6.1 Terra ne zaman çıktı, API fiyatı nedir, GPT-6.1 Sol'dan farkı ne ve hangi planlarda kullanılabiliyor? Tüm detaylar ve karşılaştırma tablosu burada."
---

Kısa cevap: GPT-6.1 Terra, OpenAI'ın 26 Ekim 2026'da ChatGPT Work ve Codex'e getirdiği orta seviye modeldir. API'de girdi başına milyon token için 1 dolar, çıktı başına 5 dolar ücretlendiriliyor — bu, GPT-5.6 Terra ve GPT-6.1 Sol'a kıyasla yaklaşık yarı fiyat. OpenAI'ın kendi ölçümüne göre düşük akıl yürütme eforunda hata oranı %53,6'dan %16,7'ye düştü.

## GPT-6.1 Terra nedir?

GPT-6.1 Terra, OpenAI'ın GPT-5.6 Terra'nın yerini alan orta seviye modeli; bilgisayar kullanımı (computer use), görsel akıl yürütme, kodlama ve gündelik iş görevlerine odaklanıyor. "Terra" OpenAI'ın model ailesinde fiyat-performans dengesini temsil eden katman olarak konumlanıyor; üstünde daha güçlü ve daha pahalı GPT-6 Astra, benzer fiyat bandında ise GPT-6.1 Sol bulunuyor.

Model, API üzerinden `gpt-6.1-terra` kimliğiyle çağrılıyor. Yayın, plan, bölge ve çalışma alanına göre kademeli olarak açılıyor; yani aynı plana sahip iki kullanıcı bile farklı tarihlerde erişim kazanabiliyor.

## GPT-6.1 Terra'ya nereden erişilebiliyor?

GPT-6.1 Terra şu an yalnızca ChatGPT Work ve Codex üzerinden, Plus, Pro, Business, Enterprise ve Edu planlarında kullanılabiliyor; standart ChatGPT sohbet arayüzünde veya ücretsiz pakette bulunmuyor. Geliştiriciler modele doğrudan API üzerinden de erişebiliyor.

Lansman anında plan kullanım limitleri değişmedi — yani Terra'ya geçiş, mevcut mesaj veya token kotanızı etkilemiyor. Dikkat edilmesi gereken bir istisna var: model şu an BAE (UAE) çıkarım bölgesini (inference residency) desteklemiyor, bu bölgedeki kurumsal müşteriler için önemli bir kısıtlama.

## GPT-6.1 Terra ne kadara mal oluyor?

Fiyatlandırma, modelin en dikkat çeken tarafı. Aşağıdaki tablo, OpenAI'ın kendi karşılaştırmasına dayanan standart API fiyatlarını (272 bin token'a kadar girdi için) gösteriyor:

| Model | Girdi ($/1M token) | Önbellekli girdi ($/1M) | Çıktı ($/1M token) |
|---|---|---|---|
| GPT-6.1 Terra | 1,00 $ | 0,05 $ | 5,00 $ |
| GPT-6.1 Sol | 2,00 $ | 0,10 $ | 10,00 $ |
| GPT-5.6 Terra (önceki sürüm) | ~2,00 $ | — | ~10,00 $ |

272 bin token'ı aşan uzun istemlerde girdi fiyatı 2 dolara, çıktı fiyatı 7,5 dolara çıkıyor. Batch ve Flex modları bu oranları yaklaşık yarıya indirirken, Fast modu iki katına çıkarıyor — bu üç mod için kesin oranları kullanmadan önce OpenAI'ın güncel fiyatlandırma sayfasından teyit etmekte fayda var, çünkü ikincil kaynaklar arasında küçük farklar bulunuyor.

Bu fiyat kesintisi, [GPT-5.6 fiyat indirimleriyle](/tr/posts/gpt-5-6-fiyatlari-dustu-luna-ucuzladi) başlayan ve OpenAI'ın orta seviye modellerini agresif biçimde ucuzlattığı eğilimin devamı niteliğinde.

## GPT-6.1 Terra ne kadar hızlı ve doğru?

OpenAI'ın iç karşılaştırmasına göre, düşük akıl yürütme eforu (low reasoning effort) ayarında hata oranı GPT-5.6 Terra'da %53,6 iken GPT-6.1 Terra'da %16,7'ye düştü — bu, aynı maliyet bandında üç katından fazla bir doğruluk artışı anlamına geliyor. Bazı kaynaklar modelin ajan (agent) görevlerinde öncekine göre yaklaşık 3 kat daha hızlı çalıştığını aktarıyor; bu rakam OpenAI'ın kendi açıklamasına dayanıyor ve bağımsız bir ölçümle henüz doğrulanmadı, dolayısıyla üretim kararlarında tek başına referans alınmamalı.

Bu hata oranı düşüşü özellikle bilgisayar kullanımı (computer use) görevlerinde önemli: model bir ekran görüntüsü yorumlayıp tıklama veya form doldurma gibi eylemler önerdiğinde, her yanlış adım bir sonraki adımı da bozabiliyor. Hata oranının üçte bire inmesi, uzun ajan zincirlerinin sonunda başarılı tamamlanma olasılığını da önemli ölçüde yükseltiyor.

Pratikte bu, on adımlık bir ajan zincirinde her adımın başarı olasılığının çarpımsal olarak büküldüğü anlamına geliyor: hata oranı %53,6'dan %16,7'ye düştüğünde, zincirin tamamının hatasız tamamlanma olasılığı da katlanarak artıyor. Bu yüzden tek adımlık görevlerde fark küçük görünse de, uzun ajan iş akışlarında çok daha belirgin hale geliyor.

## GPT-6.1 Terra'ya nasıl geçersiniz?

API üzerinden geçiş tek bir satırlık değişiklik: istek gövdesindeki `model` alanını `gpt-6.1-terra` olarak güncellemeniz yeterli, çünkü girdi/çıktı şeması GPT-5.6 Terra ile aynı kalıyor. Asıl iş, geçiş sonrası maliyet ve hata oranını izlemek:

```json
{
  "model": "gpt-6.1-terra",
  "messages": [{ "role": "user", "content": "..." }],
  "reasoning_effort": "low"
}
```

Üç adımlı bir geçiş planı öneriyoruz: önce trafiğin küçük bir yüzdesini (örneğin %10) Terra'ya yönlendirip hata oranını ve gecikmeyi mevcut modelle karşılaştırın; ardından maliyet raporunuzda yeni token fiyatını yansıtacak şekilde güncelleyin; son olarak, sonuçlar beklenen aralıktaysa trafiğin tamamını kaydırın. Bu sırayı atlayıp doğrudan %100 geçiş yapmak, modelin sizin özel veri setinizdeki davranışını hiç test etmeden üretime almak anlamına geliyor — OpenAI'ın kendi karşılaştırması sizin kullanım senaryonuzu garanti etmiyor.

ChatGPT Work veya Codex üzerinden kullanan ekipler için geçiş otomatik olarak kademeli şekilde geliyor; bu kullanıcıların elle bir ayar değiştirmesine gerek yok, ama hangi model varyantının o an aktif olduğunu kontrol panelinden teyit etmek yine de faydalı, çünkü bazı Plus ve Pro kullanıcıları varsayılan ayarlarda GPT-6.1 Sol Light yerine GPT-6.1 Terra Medium görebiliyor.

## GPT-6.1 Terra mı GPT-6.1 Sol mu?

Terra, Sol'un yaklaşık yarı fiyatına çalışıyor ama Sol daha yüksek akıl yürütme kapasitesi sunuyor; pratik kural şu: yüksek hacimli, tekrarlayan görevlerde (kod tamamlama, toplu veri işleme, rutin ajan adımları) Terra'yı seçin, tek seferlik karmaşık analiz veya çok adımlı planlama gerektiren görevlerde Sol'a geçin. [GPT-6.1 Sol'un ayrıntılı incelemesi](/tr/posts/gpt-6-1-sol-nedir) bu modelin güçlü yanlarını ve fiyatını karşılaştırmalı olarak ele alıyor.

Rakip model karşılaştırması isteyenler için [Claude Sonnet 5.5 ile GPT-6.1 Sol karşılaştırması](/tr/posts/claude-sonnet-5-5-vs-gpt-6-1-sol-karsilastirma) farklı bir açıdan fiyat-performans dengesine bakıyor; Terra'nın konumu bu tartışmaya "daha ucuz bir üçüncü seçenek" olarak giriyor.

## Bu değişiklik kimi ilgilendiriyor?

Asıl kazananlar, Codex veya ChatGPT Work üzerinden yüksek hacimli ajan iş akışları çalıştıran ekipler; token maliyeti yarıya indiğinde, aynı bütçeyle iki kat daha fazla ajan çağrısı yapılabiliyor. Kendi ajanlarınızı veya araçlarınızı bu modele bağlarken hangi entegrasyon biçimini seçeceğiniz sorusu da gündeme geliyor — [Skills, MCP ve Connector arasındaki farkları ele alan rehber](/tr/posts/skills-mi-mcp-mi-connector-mi-karar-rehberi-2026) bu kararı netleştirmeye yardımcı oluyor.

Görüşüm şu: OpenAI'ın art arda gelen Terra/Sol/Astra güncellemeleri, modelleri artık yıllık değil aylık döngüde fiyatlandırdığını gösteriyor; bir modelin API fiyatını koda sabit yazmak yerine, fiyatlandırma sayfasını kontrol eden bir yapılandırma katmanı kurmak gelecekte size zaman kazandıracak.

Bu durum küçük ekipler için de bir fırsat yaratıyor: önceden maliyet kaygısıyla ajan tabanlı özellikleri raftan indiren bir ekip, aynı bütçeyle şimdi iki kat daha fazla çağrı yapabildiği için bu özellikleri yeniden değerlendirebilir. Ancak fiyat düşüşünün tek başına bir karar gerekçesi olmadığını da unutmamak gerekiyor; asıl soru hâlâ "bu görev için doğru hata toleransı ve gecikme bu model ile sağlanıyor mu" sorusu, fiyat sadece bu denklemin bir değişkeni.

## Sıkça Sorulan Sorular

### GPT-6.1 Terra ne zaman çıktı?

GPT-6.1 Terra, 26 Ekim 2026'da OpenAI tarafından duyuruldu ve ChatGPT Work, Codex ile API üzerinden kademeli olarak kullanıma açıldı. Yayın plan, bölge ve çalışma alanına göre değişiyor.

### GPT-6.1 Terra'nın API fiyatı nedir?

Standart fiyatlandırma milyon girdi token'ı için 1 dolar, önbellekli girdi için 0,05 dolar ve milyon çıktı token'ı için 5 dolar; bu, GPT-5.6 Terra ve GPT-6.1 Sol'un yaklaşık yarısı. 272 bin token'ı aşan istemlerde fiyat artıyor.

### GPT-6.1 Terra hangi planlarda kullanılabiliyor?

Şu an yalnızca ChatGPT Work ve Codex'te; Plus, Pro, Business, Enterprise ve Edu planlarında erişilebiliyor. Standart ChatGPT sohbet arayüzünde veya ücretsiz pakette henüz sunulmuyor.

### GPT-6.1 Terra ile GPT-6.1 Sol arasında nasıl seçim yapılır?

Yüksek hacimli, tekrarlayan görevler için Terra'nın düşük fiyatı avantaj sağlıyor; karmaşık, tek seferlik akıl yürütme gerektiren görevlerde Sol'un daha yüksek kapasitesi tercih edilmeli. İkisi arasındaki fiyat farkı yaklaşık iki katına ulaşıyor.
