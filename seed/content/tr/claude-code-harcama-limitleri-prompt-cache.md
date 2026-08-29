---
title: "Claude Code'da Harcama Limiti ve Prompt Cache Metrikleri"
slug: "claude-code-harcama-limitleri-prompt-cache"
translationKey: "claude-code-spend-limits-cache-metrics"
locale: "tr"
excerpt: "Claude Code v2.1.251, /usage'a harcama limiti çubuğu, /cost'a isabet oranı gösteren bir prompt cache satırı ekledi; model değişimi artık hook'la izlenebiliyor."
category: "ai"
tags: ["claude", "cost-optimization", "observability", "automation"]
publishedAt: "2026-08-29"
seoTitle: "Claude Code Harcama Limiti ve Prompt Cache Metrikleri"
seoDescription: "Claude Code v2.1.251, harcama limiti çubuğunu ve isabet oranını /cost'ta gösteren bir prompt cache satırı ekledi; model değişimi artık hook'la izlenebiliyor."
---

Kısa cevap: Claude Code v2.1.251, 28 Ağustos 2026'da `/usage` komutuna gerçek zamanlı bir harcama limiti çubuğu, `/cost` komutuna da isabet oranı ve yeniden önbelleklenen token sayısını gösteren bir prompt cache satırı ekledi. Aynı sürümde model değişimini engelleyebilen ya da onaya bağlayabilen `PreModelSwitch` ve `PostModelSwitch` hook olayları da geldi. Hedef, ajanlı bir CLI aracının nereye para harcadığını görmeyi tahminden çıkarıp ekrana taşımak.

Bunu önemli kılan şey tek bir özellik değil, üç değişikliğin aynı sürümde birleşmesi: harcama görünürlüğü, cache verimliliği ve model değişimi kontrolü. Üçü de aynı soruyu farklı açılardan cevaplıyor: token'lar nereye gidiyor?

## Claude Code v2.1.251 ile Neler Değişti?

v2.1.251, [resmi değişiklik günlüğüne göre](https://code.claude.com/docs/en/changelog) dört ana alanda güncelleme getirdi: harcama ve kullanım görünürlüğü, hook olayları, arka plan ajanı akışı ve dosya araçlarındaki güvenlik düzeltmeleri. Sürüm 27 Ağustos'taki v2.1.248'in (`--restricted` modunu ekleyen sürüm) hemen ardından geldi; ikisi arasındaki bir gün fark, Anthropic'in Ağustos ayı boyunca sürdürdüğü yoğun sürüm temposunu gösteriyor.

En dikkat çekici üç değişiklik şunlar: `/usage`'a eklenen harcama limiti çubuğu, `/cost`'a eklenen prompt cache satırı ve model değişimini kontrol eden yeni hook çifti. Aşağıdaki bölümlerde üçünü de tek tek ele alıyoruz.

## Harcama Limiti Çubuğu /usage'da Nasıl Görünüyor?

Harcama limiti çubuğu, organizasyon gateway'i üzerinden bir aylık ya da haftalık limit tanımlanmış hesaplarda `/usage` komutunu çalıştırdığında görünür ve kalan bütçeni gerçek zamanlı bir çubukla gösterir. Önceden bu bilgiyi görmek için organizasyon konsoluna geçmek gerekiyordu; artık terminalden ayrılmadan görünüyor.

Durum satırı (statusline) betikleri yazan ekipler için de bir değişiklik var: `rate_limits.spend_limit` alanı artık durum satırına geçiliyor, yani özel bir statusline scripti harcama limitini doğrudan terminal başlığına ya da yan panele basabilir. Bu, [Claude Code auto mode](/tr/posts/claude-code-auto-mode-nasil-calisir) gibi insan onayı gerektirmeyen akışlarda özellikle değerli, çünkü kimse onaylamadan token harcayan bir ajanın ne kadar bütçe tükettiğini anlık görmek istersin.

## Prompt Cache Metrikleri /cost'ta Ne Gösteriyor?

Yeni prompt cache satırı, oturum bazında isabet oranını, kaçırma (miss) sayısını, yeniden önbelleklenen token miktarını ve önbelleğin sıcak mı soğuk mu olduğunu `/cost` çıktısında gösterir. Bu dört veri noktası, önceden yalnızca API faturasına bakarak tahmin edilebilen bir şeyi doğrudan ekrana taşıyor.

Sayılar önemli çünkü prompt caching, Claude API'de girdi token maliyetini önemli ölçüde düşürebilen bir mekanizma; ama önbellek soğuduğunda (tipik olarak beş dakikalık işlemsizlikten sonra) bir sonraki istek tam fiyattan yeniden önbellekleniyor. `/cost`'taki "warm/cold" durumu, bir oturumun ne zaman maliyetli bir yeniden önbellekleme anına yaklaştığını gösteriyor. Aynı sürüm, statusline scriptleri için eşleşen bir `prompt_cache` nesnesi de ekledi, böylece bu veriyi kendi arayüzüne de taşıyabilirsin.

Bu iyileştirme, üç gün önceki v2.1.243'te gelen `promptCacheTtl` ve `subagentPromptCacheTtl` ayarlarının doğal devamı; o sürüm API kullanıcılarının önbellek süresini (TTL) kontrol etmesine izin vermişti, bu sürüm ise o kontrolün sonucunu ölçülebilir hale getiriyor.

| Sürüm | Tarih | Ana ekleme |
| --- | --- | --- |
| v2.1.243 | 25 Ağustos 2026 | `promptCacheTtl`, `subagentPromptCacheTtl`, `/usage`'da Loops dökümü |
| v2.1.248 | 27 Ağustos 2026 | `--restricted` bayrağı, `experimental.cacheTtl` |
| v2.1.251 | 28 Ağustos 2026 | Harcama limiti çubuğu, prompt cache satırı, `PreModelSwitch`/`PostModelSwitch` |

## PreModelSwitch ve PostModelSwitch Hook'ları Ne İşe Yarar?

`PreModelSwitch` ve `PostModelSwitch`, bir oturum modeller arasında geçiş yapmadan önce ve sonra tetiklenen yeni hook olaylarıdır; bir model değişimini engelleyebilir, onaya bağlayabilir ya da sadece not düşebilirsin. Bu, otomatik model geçişlerinin (örneğin bütçe aşımı ya da hız sınırı nedeniyle daha ucuz bir modele düşme) artık sessizce değil, izlenebilir bir olay olarak gerçekleşmesi anlamına geliyor.

Aynı sürümde `SessionStart` devam ettirme (resume) hook'ları da güncellendi: artık oturumun ne kadar "bayat" olduğunu ve yeniden önbellekleme için tahmini maliyeti alıyorlar. İki değişiklik birlikte okunduğunda ortak bir tema var: Anthropic, model ve önbellek durumuyla ilgili kararları hook yazan geliştiricilere açıyor.

```json
{
  "hooks": {
    "PreModelSwitch": [
      {
        "matcher": "*",
        "hooks": [{ "type": "command", "command": "./scripts/log-model-switch.sh" }]
      }
    ]
  }
}
```

## Bu Güncelleme Neden Önemli?

Bence bu, Claude Code'un "ajanlar özerk çalışsın ama maliyeti görünür kalsın" yönündeki en tutarlı adımlarından biri. Bir ajan gece boyunca arka planda çalışırken kaç token harcadığını sabaha kadar bilmemek makul değil; harcama limiti çubuğu ve prompt cache satırı bu boşluğu dolduruyor, [subagent ve arka plan ajanı iş akışlarında](/tr/posts/claude-code-subagent-arka-plan-ajanlari) özellikle işe yarıyor.

Aynı mantık [Claude Reflect kullanım panosunun](/tr/posts/claude-reflect-nedir-anthropic-panosu) organizasyon düzeyinde yaptığını, bu sürüm terminal düzeyinde yapıyor: harcamayı ay sonu faturasında sürpriz olmaktan çıkarıp anlık bir sinyale dönüştürüyor.

## Bu Verileri Günlük İş Akışına Nasıl Katarsın?

Bu verileri günlük iş akışına katmanın en pratik yolu, oturuma başlarken `/usage`'ı, uzun bir görev bitince de `/cost`'u kontrol etmeyi bir alışkanlık haline getirmek; ikisi de tek komut, ikisi de terminali terk etmeni gerektirmiyor. Ekip genelinde bir bütçe kısıtlaması varsa, sabah ilk iş harcama limiti çubuğuna bakmak, gün ortasında sürpriz bir "limit doldu" mesajıyla karşılaşmaktan daha ucuza mal oluyor.

Statusline scripti yazan ekipler için asıl kazanç, bu iki veri noktasını (`rate_limits.spend_limit` ve `prompt_cache`) tek bir görünüme birleştirmek. Aşağıdaki gibi basit bir statusline betiği, hem kalan bütçeyi hem de önbelleğin sıcak mı soğuk mu olduğunu aynı satırda gösterebilir:

```bash
#!/usr/bin/env bash
spend=$(echo "$CLAUDE_STATUSLINE_JSON" | jq -r '.rate_limits.spend_limit.remaining_pct')
cache=$(echo "$CLAUDE_STATUSLINE_JSON" | jq -r '.prompt_cache.status')
echo "Bütçe: %${spend} kaldı | Cache: ${cache}"
```

Bu betik, terminal başlığında sürekli görünür kalan iki sayıyı ekliyor: kalan bütçe yüzdesi ve önbelleğin durumu. Bir ajan uzun bir görevi arka planda çalıştırırken bu iki sayıyı statusline'da tutmak, oturumun sonunda faturayı görüp şaşırmak yerine, oturum devam ederken müdahale etme şansı veriyor — örneğin bütçe %10'un altına düştüğünde görevi durdurup gözden geçirebilirsin.

Bunu haftalık bir ekip alışkanlığına dönüştürmek istiyorsan, pazartesi sabahı `/usage` çıktısını bir ekip kanalına yapıştırmak, ay sonunu beklemekten çok daha erken bir uyarı sistemi kuruyor. Bir organizasyonun spend limit'i haftanın ortasında tükeniyorsa, bunu perşembe günü değil pazartesi görmek, hangi görevin bütçeyi yediğini geriye dönük araştırmak yerine önceden planlamana izin veriyor.

Küçük bir ekipte bile bu alışkanlığı kurmanın maliyeti düşük: haftada tek bir mesaj, tek bir ekran görüntüsü. Karşılığında kazandığın şey, bütçe aşımını bir sürpriz olmaktan çıkarıp tahmin edilebilir bir sinyale çevirmek.

## Sıkça Sorulan Sorular

### Claude Code'da harcama limiti çubuğunu kim görebilir?

Harcama limiti çubuğu, organizasyon gateway'i üzerinden aylık ya da haftalık bir harcama limiti tanımlanmış hesaplarda görünür; bireysel Pro veya Max abonelikleri için değil, ekip/organizasyon düzeyinde bütçe kısıtlaması olan kurulumlar için tasarlanmıştır. Çubuğu görmüyorsan organizasyonun bir spend limit tanımlamamış olması muhtemeldir.

### Prompt cache isabet oranı ne demek, neden önemli?

Prompt cache isabet oranı, bir isteğin önceden önbelleklenmiş bir girdiyle eşleşip eşleşmediğini gösterir; eşleşirse Anthropic o girdi için tam fiyat yerine önbellek fiyatı uygular. `/cost`'taki yeni satır bu oranı, kaçırma sayısını ve yeniden önbelleklenen token miktarını doğrudan gösterdiği için, önbelleğin ne zaman soğuduğunu (genelde beş dakikalık işlemsizlik sonrası) fark edip isteklerini buna göre zamanlayabilirsin.

### PreModelSwitch hook'u bir model değişimini gerçekten engelleyebilir mi?

Evet. `PreModelSwitch` hook'u, oturum modeller arasında geçiş yapmadan hemen önce çalışır ve komut çıkış koduna bağlı olarak geçişi engelleyebilir, onaya bağlayabilir ya da sadece kaydedebilir; bu üç davranış hook betiğinin dönüş değeriyle belirlenir.

### Bu özellikleri kullanmak için hangi Claude Code sürümü gerekiyor?

Harcama limiti çubuğu, prompt cache satırı ve `PreModelSwitch`/`PostModelSwitch` hook'ları için en az v2.1.251 gerekiyor; bu sürüm 28 Ağustos 2026'da yayımlandı. `promptCacheTtl` gibi ilgili ayarlar için v2.1.243 yeterli, ama yeni görünürlük özellikleri yalnızca v2.1.251 ve sonrasında mevcut.
