---
title: "İlk MCP Bağlayıcını Yaz (2026 Spec)"
slug: "ilk-mcp-baglayicini-yaz-2026"
translationKey: "build-your-first-mcp-connector"
locale: "tr"
excerpt: "MCP'nin 2026-07-28 spesifikasyonu stateless bir çekirdek ve daha sıkı OAuth getirdi. Tek bir tool ve resource sunan minimal bir sunucuyu sıfırdan yazıyoruz."
category: "ai"
tags: ["mcp", "claude", "authentication", "ai-agents"]
publishedAt: "2026-08-08"
seoTitle: "İlk MCP Bağlayıcını Yazma Rehberi (2026)"
seoDescription: "MCP 2026-07-28 spesifikasyonuna göre çalışan minimal bir MCP sunucusu nasıl yazılır? Tool, resource, kimlik doğrulama ve Claude'a bağlama adım adım bu rehberde."
---

MCP'nin [2026-07-28 spesifikasyonunu ele aldığımız yazıda](/tr/posts/mcp-2026-07-28-guncellemesi) protokolün stateless bir çekirdeğe geçtiğini anlatmıştık. Bu yazıda teoriyi bırakıp gerçek bir şey inşa ediyoruz: tek bir tool ve tek bir resource sunan minimal bir MCP sunucusu, güncel spesifikasyona göre yazılmış, kimlik doğrulamalı ve test edilmiş.

## Bu Yazı Kimin İçin

MCP'nin ne olduğunu biliyorsunuz — client, server, tool, resource kavramlarına aşinasınız. Değilseniz önce [Model Context Protocol (MCP) Nedir yazımıza](/tr/posts/model-context-protocol-nedir) bakmanızı öneririz; bu yazı oradan devam ediyor ve doğrudan koda geçiyor.

## 2026-07-28 Spesifikasyonunda Ne Değişti

Üç değişiklik, bir bağlayıcı yazarken doğrudan işinize yarıyor:

- **Stateless çekirdek**: `initialize`/`initialized` el sıkışması ve `Mcp-Session-Id` başlığı kaldırıldı. Her istek kendi protokol sürümünü, client kimliğini ve yeteneklerini taşıyor — bu da sunucunuzun herhangi bir örneğinin, sabit oturum (sticky session) gerektirmeden, düz bir round-robin load balancer'ın arkasında herhangi bir isteği karşılayabileceği anlamına geliyor.
- **Daha sıkı yetkilendirme**: MCP sunucuları artık resmi olarak OAuth 2.1 kaynak sunucuları (resource server) olarak konumlandırılıyor; altı ayrı SEP (Specification Enhancement Proposal) bunu OpenID Connect ile hizalıyor.
- **Önbelleklenebilir liste sonuçları**: `tools/list` gibi yanıtlar artık önbelleklenebilir — client'lar her turda aynı tool listesini yeniden istemek zorunda değil.

Pratik sonucu şu: daha önce sticky session'lar, paylaşılan bir oturum deposu ve gateway'de derin paket incelemesi gerektiren bir uzak MCP sunucusu, artık düz bir round-robin load balancer'ın arkasında çalışabiliyor. Değişikliklerin tam listesi [resmi MCP spesifikasyon duyurusunda](https://blog.modelcontextprotocol.io/posts/2026-07-28/) yer alıyor.

## Minimal Bir Sunucu İskeleti

Python SDK ile tek bir tool (`get_weather`) ve tek bir resource (`config://settings`) sunan minimal bir sunucu şöyle görünüyor:

```python
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("weather-connector")

@mcp.tool()
def get_weather(city: str) -> str:
    """Verilen şehir için güncel hava durumunu döndürür."""
    # Gerçek bir API çağrısı burada yapılır
    return f"{city}: 22C, parcali bulutlu"

@mcp.resource("config://settings")
def get_settings() -> str:
    """Bağlayıcının varsayılan yapılandırmasını döndürür."""
    return '{"units": "metric", "cache_ttl_seconds": 300}'

if __name__ == "__main__":
    mcp.run(transport="streamable-http")
```

Burada dikkat edilmesi gereken nokta `transport="streamable-http"` — 2026-07-28 spesifikasyonunun stateless HTTP taşıması için doğru seçim. STDIO taşıması yerel geliştirme için hâlâ geçerli ama üretim bağlayıcıları HTTP tabanlı çalışıyor.

## Kimlik Doğrulama: OAuth 2.1 Kaynak Sunucusu Olarak

Yeni spesifikasyonda sunucunuz kendi kimlik doğrulamasını icat etmiyor — bir OAuth 2.1 kaynak sunucusu gibi davranıyor ve token doğrulamasını bir yetkilendirme sunucusuna (authorization server) devrediyor. Minimal akış:

1. Client, sunucunuzun `/.well-known/oauth-protected-resource` uç noktasını sorgulayarak hangi yetkilendirme sunucusunu kullanması gerektiğini öğreniyor.
2. Client, o yetkilendirme sunucusundan bir access token alıyor.
3. Her MCP isteğinde bu token `Authorization: Bearer <token>` başlığıyla gönderiliyor; sunucunuz token'ı doğruluyor ama kendisi token basmıyor.

Bu ayrım önemli: bağlayıcınız kimlik doğrulama mantığını kendi kod tabanınıza gömmek yerine, mevcut bir OIDC sağlayıcısına (Auth0, Okta, kendi IdP'niz) devrediyor. [WorkOS'un yetkilendirme değişikliklerini incelediği yazı](https://workos.com/blog/mcp-2026-spec-agent-authentication) bu akışı uçtan uca ayrıntılı anlatıyor.

## Test Etme

Sunucunuzu ayağa kaldırdıktan sonra `tools/list` ve `resources/list` uç noktalarının doğru yanıt verdiğini doğrulamak için basit bir HTTP isteği yeterli:

```http
POST /mcp HTTP/1.1
Host: localhost:8000
Content-Type: application/json
MCP-Protocol-Version: 2026-07-28

{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}
```

Yanıtta `get_weather` tool'unun adı, açıklaması ve parametre şeması dönüyor olmalı. Bu noktada henüz bir client'a bağlanmadan protokol düzeyinde doğrulama yapmış oluyorsunuz. Aynı testi `resources/list` için tekrarlayıp `config://settings` kaynağının doğru URI şemasıyla döndüğünü de doğrulamanız, entegrasyon aşamasında sürpriz hatalarla karşılaşma riskinizi azaltıyor — özellikle client'ınız kaynak URI'lerini önbelleğe alıyorsa.

## Claude'a ve Diğer Client'lara Bağlamak

Aynı sunucu, spesifikasyona uyduğu sürece herhangi bir MCP-uyumlu client ile çalışıyor — bu, stateless çekirdeğin asıl kazanımı. Claude Desktop'a bağlamak için yapılandırma dosyanıza sunucunun URL'sini eklemeniz yeterli:

| Client | Bağlantı yöntemi |
|---|---|
| Claude Desktop / Claude Code | Ayarlardan MCP sunucu URL'si eklenir |
| Claude Cowork | Bağlayıcı olarak eklenir, OAuth akışı arayüzden tamamlanır |
| Diğer MCP client'ları | Aynı `streamable-http` uç noktası, ek yapılandırma gerekmez |

Aynı sunucu kodunu değiştirmeden birden fazla client'a bağlayabilmek, spesifikasyonun asıl vaadi — client tarafında özel entegrasyon kodu yazmanıza gerek kalmıyor.

## Apps ve Tasks: Versiyonlanmış Uzantılar

2026-07-28 spesifikasyonu, çekirdek protokolü değiştirmeden yeni yetenek ekleyebilmek için resmi bir uzantı çerçevesi getirdi — ve bu çerçeveden ilk çıkan iki uzantı MCP Apps ve Tasks. Uzantılar ters-DNS kimlikleriyle tanımlanıyor, `extensions` haritası üzerinden yetenek pazarlığı yapıyor ve çekirdek spesifikasyondan bağımsız olarak kendi sürümlerini taşıyor — yani bir uzantı güncellenirken sunucunuzun geri kalanını güncellemeniz gerekmiyor.

**MCP Apps**, sandbox'lanmış iframe'ler içinde çalışan, sunucu tarafından render edilen etkileşimli HTML arayüzleri sunuyor. Tool'lar UI şablonlarını önceden bildiriyor, bu da client'ların bir şey render edilmeden önce şablonu önden çekip güvenlik incelemesinden geçirebilmesini sağlıyor. UI'dan gelen aksiyonlar, normal tool çağrılarıyla aynı JSON-RPC kanalından geri akıyor.

**Tasks uzantısı** ise deneysel bir özellikten resmi bir uzantıya terfi etti; gerçek üretim kullanımı, yaşam döngüsünün yeniden tasarlanmasına yol açtı. Yeni model de stateless: `tools/call` artık bir görev tanıtıcısı (task handle) döndürüyor, client ilerlemeyi `tasks/get`, `tasks/update` ve `tasks/cancel` çağrılarıyla kendisi sürüyor. Bağlayıcınız uzun süren bir işlem (büyük bir dosya işleme, çok adımlı bir arama) içeriyorsa, bu uzantı tek bir isteği açık tutmak yerine görevi arka planda takip etmenizi sağlıyor. Uzantı çerçevesinin tam mimarisi [Anthropic'in konuyu ele aldığı yazıda](https://claude.com/blog/bringing-mcp-2026-07-28-to-claude) daha ayrıntılı anlatılıyor.

## Gözlemlenebilirlik ve Özel Ağ Tünelleri

Üretime çıkarken iki şeyi ihmal etmeyin: her tool çağrısını loglamak (hangi client, hangi parametre, ne kadar sürdü) ve sunucunuzu genel internete açmadan test edebileceğiniz bir tünel aracı (ngrok, Cloudflare Tunnel gibi) kullanmak. Loglarınıza tool adının yanında yanıt süresini ve hata kodunu da eklemek, üretimde hangi tool'un yavaşladığını ya da hangi client'ın beklenmedik parametreler gönderdiğini fark etmenizi kolaylaştırıyor — bu detay, bağlayıcınız büyüdükçe hata ayıklama sürenizi ciddi şekilde kısaltıyor. Bağlayıcınız iç sistemlere erişiyorsa, bu tünel yaklaşımı sunucuyu kalıcı olarak dışa açmadan geliştirme döngüsünü hızlandırıyor. Ajan mimarinizin geri kalanını nasıl tasarlayacağınızı merak ediyorsanız [AI ajanları için context engineering rehberimiz](/tr/posts/ai-ajanlari-icin-context-engineering) bu bağlayıcıyı nereye oturtacağınız konusunda faydalı bir tamamlayıcı.

## Deploy-and-Verify Kontrol Listesi

- [ ] Sunucu `streamable-http` taşımasıyla çalışıyor, `MCP-Protocol-Version: 2026-07-28` başlığını doğru işliyor
- [ ] `/.well-known/oauth-protected-resource` uç noktası doğru yetkilendirme sunucusunu işaret ediyor
- [ ] `tools/list` ve `resources/list` beklenen şemayı dönüyor
- [ ] En az bir client (Claude Desktop veya Claude Code) ile uçtan uca test edildi
- [ ] Tool çağrıları loglanıyor, hata durumları düzgün JSON-RPC hata koduyla dönüyor

## Sıkça Sorulan Sorular

### Stateless çekirdeğe geçmek eski sunucularımı bozar mı?

Eski `initialize` el sıkışmasına dayanan sunucular geriye dönük uyumluluk modunda çalışmaya devam edebilir, ama yeni ölçeklenebilirlik avantajlarından (sticky session gerektirmemesi gibi) faydalanmak için sunucunuzu 2026-07-28 taşımasına güncellemeniz gerekiyor.

### STDIO taşımasını hâlâ kullanabilir miyim?

Evet, yerel geliştirme ve tek kullanıcılı araçlar için STDIO hâlâ geçerli bir taşıma. Ancak birden fazla client'ın aynı sunucuya bağlanacağı üretim senaryolarında `streamable-http` doğru seçim.

### Kendi OAuth sunucumu yazmam mı gerekiyor?

Hayır ve önerilmiyor. Sunucunuz bir kaynak sunucusu olarak davranıp mevcut bir OIDC sağlayıcısına (Auth0, Okta, kurumsal IdP) yönlendirme yapmalı; kendi token altyapınızı yazmak hem gereksiz hem de risk taşıyor.

### Aynı sunucu gerçekten hem Claude hem başka client'larla çalışıyor mu?

Evet, sunucunuz spesifikasyona uyduğu sürece istemciden bağımsız (client-agnostic) çalışıyor. Bu, stateless çekirdeğin ve standartlaştırılmış yetkilendirmenin doğrudan sonucu — client tarafında özel kod yazmanıza gerek kalmıyor.
