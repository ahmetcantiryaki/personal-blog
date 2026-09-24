---
title: "Claude Inline Tools Nedir? Cache Bozulmadan Araç Ekleme"
slug: "claude-inline-tools-nedir"
translationKey: "claude-inline-tools-prompt-cache-2026"
locale: "tr"
excerpt: "Anthropic'in 22 Eylül 2026'da yayımladığı inline tools betası, sohbet ortasında araç eklemeyi veya değiştirmeyi prompt cache'i bozmadan yapmayı mümkün kılıyor."
category: "ai"
tags: [claude, llm, mcp, prompt-engineering]
publishedAt: "2026-09-24"
seoTitle: "Claude Inline Tools Nedir? Cache Bozulmadan Araç Ekle"
seoDescription: "Claude'un inline-tools-2026-09-15 betası, tool_addition bloklarıyla araç tanımlamayı prompt cache'i bozmadan mümkün kılar. Kod örnekli rehber."
---

Kısa cevap: Anthropic, 22 Eylül 2026'da Claude Opus 5.5 ile birlikte `inline-tools-2026-09-15` beta başlığını yayımladı; bu özellik sayesinde bir araç tanımını sohbetin ortasında, `tools` dizisini hiç değiştirmeden ekleyebilir, güncelleyebilir veya kaldırabilirsiniz — bu da prompt cache'in bozulmasını önler ve uzun ajan oturumlarının maliyetini doğrudan düşürür.

## Inline tools hangi sorunu çözüyor?

Claude API'de istek önbelleği, `tools` dizisi + üst düzey `system` alanı + `messages` sırasına göre hash'lenir. Bu üçlüden herhangi birini değiştirmek, o ana kadar biriken tüm önbelleklenmiş sohbet geçmişinin baştan hesaplanmasına yol açar. Saatlerce süren bir ajan oturumunda yeni bir araç eklemek istediğinizde eskiden tek seçenek `tools` dizisini düzenlemekti — bu da o ana kadarki tüm cache kazancını sıfırlıyordu.

Inline tools, aracı `tools` dizisine değil, `messages` dizisinin içine bir sistem mesajı olarak ekliyor. Cache hash'i hesaplanırken `messages` dizisinin sonuna eklenen içerik önceki hash'i bozmadığı için, sohbetin geri kalanı önbellekten okunmaya devam ediyor.

## Inline tools nasıl kullanılır?

Yeni bir aracı tanımıyla birlikte eklemek için `role: "system"` içeren bir mesaja `tool_addition` bloğu koyuyorsunuz. Blok, aracın tam tanımını (`name`, `description`, `input_schema`) taşıyor:

```json
{
  "role": "system",
  "content": [
    {
      "type": "tool_addition",
      "tool": {
        "type": "tool_definition",
        "definition": {
          "name": "db_query",
          "description": "Salt okunur SQL sorgusu çalıştırır.",
          "input_schema": {
            "type": "object",
            "properties": { "sql": { "type": "string" } },
            "required": ["sql"]
          }
        }
      }
    }
  ]
}
```

Python SDK'da tam akış şöyle görünüyor:

```python
client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-opus-5-5",
    max_tokens=1024,
    betas=["inline-tools-2026-09-15"],
    tools=[{"name": "get_weather", "description": "Hava durumunu getirir.",
            "input_schema": {"type": "object",
                              "properties": {"location": {"type": "string"}},
                              "required": ["location"]}}],
    messages=[
        {"role": "user", "content": "Dun kac siparis kargoya verildi?"},
        {"role": "system", "content": [{
            "type": "tool_addition",
            "tool": {"type": "tool_definition", "definition": {
                "name": "db_query",
                "description": "Salt okunur SQL sorgusu calistirir.",
                "input_schema": {"type": "object",
                                  "properties": {"sql": {"type": "string"}},
                                  "required": ["sql"]}}}}]},
    ],
)
```

`tools` dizisinde en az bir araç tanımının kalması gerekiyor; aksi halde ilk değer bazlı tanım da cache'in başlangıç noktasını değiştiriyor. Bir aracın şemasını güncellemek için aynı isimle yeni bir tanım göndermeniz yeterli — yeni tanım, gönderildiği andan itibaren öncekinin yerini alıyor. Bu, örneğin bir aracın API sürümünü sohbeti sıfırdan başlatmadan, sunucu tarafında sessizce yükseltmenizi mümkün kılıyor.

## Eski mid-conversation-tool-changes betasından farkı ne?

Anthropic, 24 Temmuz 2026'da Opus 5 ile birlikte `mid-conversation-tool-changes-2026-07-01` betasını yayımlamıştı; bu, yalnızca referansla araç ekleyip kaldırmaya izin veriyordu (`tool_removal` bloğuyla bir aracı isim vererek geri çekmek gibi). `inline-tools-2026-09-15` bu betayı kapsıyor ve üstüne aracı tam tanımıyla (by value) ekleme, şemasını değiştirme ve MCP araç setlerini sohbet ortasında bağlama yeteneğini getiriyor.

| Özellik | Beta Başlığı | Ne yapar |
|---|---|---|
| Referansla araç kaldırma | `mid-conversation-tool-changes-2026-07-01` | Var olan bir aracı isimle geri çeker |
| Tanımla araç ekleme/güncelleme | `inline-tools-2026-09-15` | Aracı tam şemasıyla ekler veya değiştirir |
| MCP araç seti ekleme | `inline-tools-2026-09-15` + `mcp-client-2026-09-15` | MCP sunucusunun araç setini sohbet ortasında bağlar |

## MCP araç setleri inline tools ile nasıl çalışıyor?

`mcp-client-2026-09-15` başlığını da eklediğinizde, `tool_addition` bloğunun tanımı bir `mcp_toolset` tipine dönüşüyor ve `mcp_server_name` alanıyla önceden tanımlı bir MCP sunucusuna işaret ediyor — URL veya token bu blokta değil, ayrı `mcp_servers` alanında kalıyor. Claude'un yanıtı, o sunucunun güncel araç listesini gösteren bir `mcp_tool_listing` bloğuyla başlıyor; bu bloğu sonraki isteklerde aynen geri gönderdiğinizde araç listesi sabitleniyor ve tekrar sorgulanmıyor. [İlk MCP bağlayıcınızı yazma rehberimizde](/tr/posts/ilk-mcp-baglayicini-yaz-2026) MCP sunucusu kurulumunun temellerini ayrıca ele alıyoruz.

Bize göre bu, Anthropic'in ajan mimarilerini "statik araç listesi" varsayımından çıkarma çabasının en somut adımı: uzun süren bir ajan artık görev ilerledikçe yeni yetenekler kazanabiliyor, üstelik bunun faturası saatlerce biriken cache'in çöpe gitmesi olmuyor. Bu, özellikle kullanıcı isteğine göre farklı MCP sunucularının devreye girdiği çok adımlı ajan sistemlerinde önemli bir esneklik kazandırıyor.

## Sınırlamalar neler?

Anthropic birkaç sert sınır koymuş: bir mesajdan sonra en fazla 10.000 ertelenmiş (deferred) araç, ilk kullanıcı mesajından sonra tanımla eklenen en fazla 10.000 araç, araç tanımları toplamda en fazla 4 MB ve render edilen araç metni en fazla 4 MB. `cache_control` alanı ya blokta ya da tanımın içinde olabilir, ikisinde birden değil. Bu limitler günlük kullanımda nadiren sorun çıkarır ama yüzlerce dinamik araç üreten bir sistem kuruyorsanız baştan hesaba katmakta fayda var.

Bir diğer pratik nokta: `tool_addition` bloğuyla eklenen bir araç tanımı da tıpkı `tools` dizisindeki bir tanım gibi bağlam penceresinden yer kaplıyor ve token olarak faturalandırılıyor — cache'i korumak, o aracın tanımını "bedava" hale getirmiyor, sadece önceki geçmişin yeniden işlenmesini önlüyor. Yani çok büyük şema tanımlarını sohbetin ortasında tekrar tekrar eklemek, cache kazancını token maliyetiyle telafi etmeyebilir; sık kullanılan büyük araçları baştan `tools` dizisine koyup yalnızca nadiren gereken veya görev ilerledikçe ortaya çıkan araçları inline olarak eklemek daha tutarlı bir strateji. Genel model ve fiyat karşılaştırmaları için [Claude Opus 5.5'in fiyat ve benchmark karşılaştırmasına](/tr/posts/claude-opus-5-5-nedir-fiyat-benchmark) da bakabilirsiniz.

Çok sayıda LLM sağlayıcısı arasında yönlendirme yapan ekipler için önbellek davranışı sağlayıcıya göre değişir; bu farkları [LLM ağ geçitleri hakkındaki rehberimizde](/tr/posts/llm-ag-gecidi-model-yonlendirme) ayrıca inceliyoruz. Cache maliyetlerini ölçmek isteyenler [Claude Code'da harcama limitleri ve prompt cache metrikleri yazımıza](/tr/posts/claude-code-harcama-limitleri-prompt-cache) bakabilir.

## Turn-scoped sistem mesajları ne işe yarar?

Anthropic aynı dokümantasyon setinde ayrı bir beta daha tanımlıyor: `mid-conversation-system-clear-at-2026-08-21`. Bu, sohbet geçmişinde birikmesini istemediğiniz tek seferlik hatırlatmalar için düşünülmüş — örneğin "bu turda bağımsız okuma isteklerini tek seferde grupla" gibi bir talimatı yalnızca bir sonraki kullanıcı mesajına kadar geçerli kılmak istediğinizde. Mesaja `clear_at: "next_user_message"` eklediğinizde, mesaj bir sonraki kullanıcı turu geldiğinde otomatik olarak temizleniyor ve `messages` dizisinden fiilen çıkarılmasına gerek kalmıyor; temizlendikten sonra token sayımına da dahil edilmiyor.

Bu mekanizmanın `tool_addition` ile karıştırılmaması gereken birkaç kısıtı var: yalnızca metin bloğu taşıyabiliyor (araç ekleme veya çıkarma bloğu içeremiyor), `cache_control` alanı taşıyamıyor ve daha önce gönderilmiş bir turn-scoped mesajı düzenlemek veya atlamak cache'i bozup thinking bloklarının bütünlüğünü tehlikeye atıyor — yani mesajı aynen tekrar göndermek zorunlu. Pratikte bu üç özelliği (mid-conversation sistem mesajları, inline tools, turn-scoped mesajlar) birlikte düşünmek gerekiyor: hepsi aynı kısıtı çözüyor — `tools` ve üst düzey `system` alanını sabit tutup değişen her şeyi `messages` dizisinin sonuna eklemek.

## Sıkça Sorulan Sorular

### Inline tools betasını nasıl aktif ederim?

Kısa cevap: API isteğinize `betas: ["inline-tools-2026-09-15"]` parametresini ekleyin. MCP araç seti bağlamak istiyorsanız aynı isteğe `mcp-client-2026-09-15` başlığını da eklemeniz gerekiyor.

### Inline tools hangi modellerde çalışıyor?

Kısa cevap: Özellik Eylül 2026 itibarıyla Claude API üzerinden Claude Opus 5.5 dahil güncel model ailesinde kullanılabilir. Beta başlıkları modelden bağımsız çalıştığı için önceki mid-conversation-tool-changes betasını destekleyen modellerde de geçerlidir.

### tool_addition ile eklenen bir aracı nasıl güncellerim?

Kısa cevap: Aynı isimle yeni bir `tool_definition` gönderin; yeni tanım gönderildiği andan itibaren eskisinin yerini alır ve şema değişikliği, sürüm güncellemesi gibi işlemler için ayrı bir kaldırma adımına gerek kalmaz.

### Inline tools prompt cache maliyetini gerçekten düşürüyor mu?

Kısa cevap: Evet — çünkü `tools` dizisini veya `system` alanını hiç değiştirmediği için, önceden biriken cache'lenmiş prefiks bozulmuyor. Sık sık araç ekleyip çıkaran uzun ajan oturumlarında bu, her araç değişikliğinde tüm geçmişi yeniden işlemek yerine sadece yeni eklenen kısmın işlenmesi anlamına gelir.

**Kaynaklar:** [Claude Platform sürüm notları](https://platform.claude.com/docs/en/release-notes/overview), [Mid-conversation system messages dokümantasyonu](https://platform.claude.com/docs/en/build-with-claude/mid-conversation-system-messages), [Anthropic Haberler](https://www.anthropic.com/news).
