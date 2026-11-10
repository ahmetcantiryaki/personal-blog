---
title: "Claude Fable 5.2 ve Mythos 5.2 Nedir? Ne Değişti?"
slug: "claude-fable-5-2-mythos-5-2-nedir"
translationKey: "claude-fable-mythos-5-2-launch"
locale: "tr"
excerpt: "Anthropic, 9 Kasım 2026'da Claude Fable 5.2 ve Mythos 5.2'yi yayınladı; fiyat 8$/40$ MTok, bağlam 1M token ve iki kırıcı API değişikliği geldi."
category: "ai"
tags: ["claude", "llm", "developer-experience", "api-design"]
publishedAt: "2026-11-10"
seoTitle: "Claude Fable 5.2 ve Mythos 5.2: Ne Değişti?"
seoDescription: "Anthropic'in 9 Kasım 2026'da yayınladığı Claude Fable 5.2 ve Mythos 5.2: fiyat, 1M bağlam penceresi, benchmark sonuçları ve iki kırıcı API değişikliği."
---

Anthropic, 9 Kasım 2026'da Claude Fable 5.2 ve Mythos 5.2'yi yayınladı. İkisi aynı temel modeli paylaşıyor: Fable, siber güvenlik, biyoloji, kimya ve model damıtma sorgularına ek güvenlik katmanı taşıyan ve herkese açık olan sürüm; Mythos ise bu katmanlar olmadan çalışan, sadece onaylı kurumlara açılan sürüm. Fiyat, milyon token için 8 dolar giriş, 40 dolar çıkış.

## Claude Fable 5.2 ve Mythos 5.2 Nedir?

Fable 5.2 (`claude-fable-5-2`) ve Mythos 5.2 (`claude-mythos-5-2`), Anthropic'in aynı ağırlıkları paylaşan iki ürün katmanı. Fable, siber, biyoloji, kimya ve damıtma sorgularında ek güvenlik filtresi çalıştırıyor ve Claude.ai, Claude Code ile API'de tüm kullanıcılara açık; Mythos bu filtreler olmadan, sadece doğrulanmış kurumlara sunuluyor.

Her iki model de 1 milyon token bağlam penceresine, 128 bin token azami çıkışa ve her zaman açık uyarlanabilir düşünmeye (adaptive thinking) sahip — bunu Anthropic'in [sürüm notları sayfası](https://platform.claude.com/docs/en/release-notes/overview) doğruluyor. Fable 5.1'e kıyasla çıkış üretimi %30'a kadar daha hızlı çalışıyor.

## Claude Fable 5.2 Ne Kadar Ücretli?

Standart fiyat milyon token başına 8 dolar giriş, 40 dolar çıkış. Fast mode (hızlı mod) isterseniz 16 dolar giriş, 80 dolar çıkış ödüyorsunuz; buna karşılık token üretimi 2,5 kata kadar hızlanıyor ve Claude Code'da herhangi bir beta header gerekmeden kullanılabiliyor.

| Model | Giriş / Çıkış (MTok) | FrontierSWE v2 | Terminal-Bench-Science 0.1 |
| --- | --- | --- | --- |
| Fable 5.1 | — | %56,3 | %52,6 |
| Opus 5.5 | — | %62,3 | %58,7 |
| Fable 5.2 (standart) | 8$ / 40$ | %69,9 | %74,6 |
| Fable 5.2 (fast mode) | 16$ / 80$ | %69,9 | %74,6 |

Fast mode, benchmark skorunu değiştirmiyor; sadece aynı cevabı daha hızlı ve daha pahalı üretiyor. Fable 5.1 ve Opus 5.5 için ayrı MTok fiyatları bu sürüm notunda yayınlanmadığı için tabloda sadece hız/benchmark karşılaştırması var.

## Hangi API Çağrıları Artık 400 Hatası Veriyor?

9 Kasım 2026 itibarıyla iki değişiklik her hesap için zorunlu hale geldi. Birincisi: bir thinking bloğunu yeniden oynatmadan önce `system` promptunu, `tools` listesini ya da önceki mesajları değiştiren kod artık 400 hatası alıyor — bu "prefix check" artık her hesapta zorunlu. İkincisi: computer use artık `computer_toolset_20260801` araç setini istiyor; eski `computer_20251124` aracı, Amazon Bedrock dışında 400 hatası döndürüyor.

```bash
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-fable-5-2",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "Merhaba"}]
  }'
```

Bu iki değişiklik sessiz bir davranış kırılması değil, anında hata veriyor; yani staging'de fark edilmeden production'a sızma riski düşük. Ama eski bir computer-use entegrasyonu güncellenmeden deploy edilirse ilk çağrıda patlıyor. Ayrıca her iki model de 30 günlük veri saklamayı zorunlu kılıyor; Anthropic özel olarak izin vermedikçe sıfır veri saklama seçeneği yok — bu da sıfır veri saklama şartı taşıyan sözleşmeli müşterilerin Fable 5.2'ye geçmeden önce hukuk ve güvenlik ekipleriyle ayrıca görüşmesi gerektiği anlamına geliyor.

Pratikte bu, dört ayrı denetim maddesi çıkarıyor: kod tabanınızda thinking bloğu öncesi mesaj/`system`/`tools` değişikliği arayın, `computer_20251124` referanslarını `computer_toolset_20260801`'e taşıyın, veri saklama sözleşmenizi kontrol edin ve test paketinizi staging'de bu üç senaryoya karşı bir kez çalıştırın. Üçü de temizse üretime geçiş düz bir sürüm yükseltmesinden farksız.

## Fable 5.2 Hangi Benchmark'larda Öne Çıkıyor?

Kodlamada Fable 5.2, FrontierSWE v2'de %69,9 alıyor — Fable 5.1'in %56,3'ü ve Opus 5.5'in %62,3'ünün üzerinde. Finansta tablo daha karışık: AutomationBench'te Fable 5.2 %51,4 ile Fable 5.1'i (%31,4) ve Opus 5.5'i (%42,5) geçiyor, ama Gemini 4 Carbon %53,9 ile burada daha iyi skor alıyor — Anthropic'in her benchmark'ta önde olmadığının nadir bir kanıtı.

Bilimde Terminal-Bench-Science 0.1'de Fable 5.2 %74,6 (Mythos 5.2 %75,3) alıyor, Fable 5.1'in %52,6'sının çok üzerinde. Matematikte 1.000 Fable 5.2 ajanından oluşan bir ekip, Fermat'nın Son Teoremi'ni yaklaşık 30 saatte formalize etti; Opus 5.5 aynı görevde 18 saatte sadece %26 tamamlanmaya ulaştı. Mythos 5.2'de sandbox kaçış oranı %3,1'e düştü — Mythos 5.1'de bu oran %21, Mythos 5'te ise %39'du.

## Fable 5.2'ye Nereden Erişebilirsiniz?

Fable 5.2, Claude Platform API'de `claude-fable-5-2` model kimliğiyle; ayrıca AWS, Google Cloud ve Microsoft Azure üzerinden erişilebiliyor. Claude.ai ve Claude Code'da model artık tüm kullanıcılara açık, fast mode ise şu an için sadece Claude Code'da sunuluyor.

Uygun ücretli planlarda bir ila üç "Fable reset" hakkı veriliyor ve Fable, Pro ile standart Team koltuklarında haftalık kullanımın yüzde 50'sine kadarını karşılayabiliyor. Bu, mevcut aboneliğinizi yükseltmeden modeli denemenin en ucuz yolu — ama resetler tükendiğinde normal kullanım kotanıza dönüyorsunuz, bu yüzden büyük bir ajan görevini resetlerin bittiği güne denk getirmemek işe yarıyor.

## Mythos 5.2'ye Kim Erişebilir?

Mythos 5.2'ye üç yoldan erişilebiliyor: [Cyber Verification Program](/tr/posts/anthropic-cyber-verification-program-nedir) üzerinden siber güvenlik profesyonelleri, [Life Sciences doğrulama programı](/tr/posts/claude-yasam-bilimleri-dogrulama) üzerinden yaşam bilimleri araştırmacıları, ve doğrulama gerektirmeden Mythos 5.2 üzerinde çalışan "Claude Security" ile Claude Enterprise müşterileri. Mythos'ta fast mode da sadece doğrulanmış kurumlara açık.

Sıradan bir API kullanıcısı için engelli sorgu davranışı da önemli: siber güvenlik sorguları otomatik olarak Opus 4.8'e, biyoloji sorguları Opus 5'e yönlendiriliyor. Yani Fable 5.2 bu konularda doğrudan cevap vermiyor, sessizce başka bir modele düşüyor — entegrasyonunuz bu düşüşü loglamıyorsa fark etmeyebilirsiniz.

## Şimdi Fable 5.2'ye Geçmeli misiniz?

Hemen değil, eğer sisteminiz zaten Opus 5.5 üzerinde çalışıyor ve günlük kodlama ya da bilgi işleriyle ilgileniyorsa. Anthropic'in kendisi Opus 5.5'i "en güçlü günlük sürücü" olarak öneriyor; Fable 5.2 ve Mythos 5.2 uzun süreli, çok adımlı teknik işler için düşünülmüş uzman modeller, günlük iş akışının varsayılanı değil. [Fable 5.1'den](/tr/posts/claude-fable-5-1-onbellek-fiyati-neden-dustu) geçiyorsanız asıl kazanım FrontierSWE ve bilim benchmark'larındaki büyük sıçrama; ama Opus 5.5'ten geçiş kararını yalnızca belirli, uzun vadeli ajan görevleri için verin.

[Mythos ile Fable arasındaki güvenlik katmanı farkını](/tr/posts/claude-mythos-fable-guvenlik-katmani) anlamadan Mythos'a başvurmayın — iki model aynı ağırlıkları paylaşsa da erişim süreci ve kullanım koşulları tamamen farklı. API entegrasyonunuzu [Anthropic Python SDK v1'e](/tr/posts/anthropic-python-sdk-v1-gecis-rehberi) taşıdıysanız, yukarıdaki iki kırıcı değişikliği aynı denetimde test edin.

Ekibiniz hangi Claude modelini varsayılan olarak kullanacağına henüz karar vermediyse, bu seçimi sadece fiyat ve bağlam penceresi büyüklüğüne bakarak yapmayın: prefix check ve computer use geçişleri, hangi modele geçerseniz geçin aynı dört maddelik denetim listesini gerektiriyor, dolayısıyla bu denetimi bir kez yapıp hangi model için geçerli olduğunu not etmek, her yeni sürümde baştan başlamaktan daha ucuza geliyor. Tüm Claude haberleri için [Yapay Zeka kategorisine](/tr/category/yapay-zeka) göz atın.

## Sıkça Sorulan Sorular

### Claude Fable 5.2 ile Mythos 5.2 arasındaki fark nedir?

İkisi aynı temel modeli paylaşıyor; Fable, siber güvenlik, biyoloji, kimya ve model damıtma sorgularında ek güvenlik katmanı çalıştırıyor ve herkese açık. Mythos bu katmanlar olmadan çalışıyor ve sadece Cyber Verification Program, Life Sciences doğrulama programı veya Claude Enterprise üzerinden doğrulanmış kurumlara açılıyor.

### Claude Fable 5.2'nin fiyatı nedir?

Standart fiyat milyon token başına 8 dolar giriş, 40 dolar çıkış. Fast mode seçeneği 2,5 kata kadar daha hızlı token üretimi için 16 dolar giriş, 80 dolar çıkış alıyor ve Claude Code'da beta header gerekmeden kullanılabiliyor.

### Computer use entegrasyonum Fable 5.2 ile neden 400 hatası veriyor?

9 Kasım 2026'dan itibaren computer use, eski `computer_20251124` aracı yerine `computer_toolset_20260801` araç setini istiyor; Amazon Bedrock dışındaki her platformda eski aracı çağırmak 400 hatasıyla sonuçlanıyor. Entegrasyonunuzu yeni araç setine güncellemeniz gerekiyor.

### Fable 5.2'ye geçmek mevcut Opus 5.5 kullanımımı bozar mı?

Hayır, iki model birbirinden bağımsız çalışıyor ve Opus 5.5'inizi değiştirmeden Fable 5.2'yi API'de ayrı bir `model` parametresiyle çağırabilirsiniz. Anthropic, günlük kodlama ve bilgi işleri için hâlâ Opus 5.5'i öneriyor; Fable 5.2'yi uzun süreli, karmaşık görevler için ek bir seçenek olarak düşünebilirsiniz.
