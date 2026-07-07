---
title: "Model Context Protocol (MCP) Nedir"
slug: "model-context-protocol-nedir"
translationKey: "model-context-protocol-explained"
locale: "tr"
excerpt: "Model context protocol nedir? MCP artık bir Linux Foundation standardı ve 2026 aday sürümü herkesin öğrendiği durumlu oturumu siliyor. Kalıcı olan ne, içeride."
category: "ai"
tags: ["mcp", "ai-agents", "llm", "integration"]
publishedAt: "2026-07-07"
seoTitle: "Model Context Protocol (MCP) Nedir"
seoDescription: "Model context protocol nedir? Güncel 2026 gerçekleriyle: primitifler, taşıma katmanları, 2025-11-25 spesifikasyonu, durumsuz 2026-07-28 aday sürümü ve çalışan bir sunucu."
---

Neredeyse her MCP anlatımı aynı köken hikâyesini öğretir: Model Context Protocol, JSON-RPC üzerinde bir `initialize` el sıkışmasıyla açılan *durumlu* bir istemci-sunucu oturumudur. El sıkışmasını ezberle, oturum kimliğini ezberle, MCP'yi anladın. Rahatsız edici kısım şu — 2026-07-28 aday sürümüyle birlikte o el sıkışması siliniyor.

O halde **model context protocol nedir** sorusuna dürüst cevap: zihinsel model hayatta kalıyor, ama altındaki tel mekaniği baştan inşa ediliyor. MCP, yapay zeka modellerini dış araçlara, verilere ve servislere her model-araç ikilisi için ayrı entegrasyon yazmadan tek ve tutarlı bir arayüz üzerinden bağlayan açık bir standarttır. Anthropic bunu Kasım 2024'te tanıttı. Aralık 2025'te ise [Linux Foundation'ın yeni Agentic AI Foundation'ına bağışladı](https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation); OpenAI, Google ve Microsoft ortak sponsor oldu. En büyük rakipleri spesifikasyonu birlikte sürdürmeye başladığı anda "Anthropic'in protokolü" olmaktan çıktı.

## Model context protocol nedir ve gerçekte ne yapar?

Cilayı kazıyın, geriye bir keşif-ve-çağırma protokolü kalır. Her uygulamanın her araçla nasıl konuşacağını sabit kodlamak yerine bir aracı bir kez MCP sunucusu olarak sunarsınız; MCP uyumlu her istemci onu bulur, şemasını okur ve çağırır. Tek arayüz, çok sayıda tüketici.

Çözdüğü asıl sorun **M×N entegrasyon patlamasıdır**. MCP öncesinde `M` uygulamayı `N` araca bağlamak en fazla `M × N` özel konnektör demekti. MCP bunu `M + N`e indirir: her uygulama istemci tarafını, her araç sunucu tarafını bir kez yazar ve hepsi birbiriyle konuşur. USB, ODBC ve Language Server Protocol'ün kendi alanlarında yaptığı hamlenin aynısı.

Bu tez, benimsemenin neden dikey gittiğini açıklıyor. Anthropic'in Aralık 2025 ekosistem güncellemesine göre MCP, **10.000'den fazla aktif kamu sunucusunu** ve Python ile TypeScript genelinde **aylık 97M'den fazla SDK indirmesini** aştı. Resmi MCP Registry, Mayıs 2026 sonunda yaklaşık 9.650 sunucu kaydı listeliyordu. Bu artık bir deney değil.

## Model context protocol nasıl çalışır (ve ne değişiyor)?

Bugünkü [güncel spesifikasyon (2025-11-25)](https://modelcontextprotocol.io/specification/2025-11-25/changelog) hâlâ JSON-RPC 2.0 üzerinde durumlu bir istemci-sunucu mimarisi kullanıyor. Üç rol var:

- **Host (ana uygulama):** Kullanıcının konuştuğu yapay zeka uygulaması — Claude Desktop, bir IDE asistanı, özel bir agent. LLM'i barındırır ve her şeyi düzenler.
- **Client (istemci):** Host içinde yaşayan, her sunucuyla tek bir oturum tutan konnektör.
- **Server (sunucu):** Yetenekleri sunan hafif bir program — GitHub sunucusu, Postgres sunucusu, dosya sistemi sunucusu.

Bir asistandan "açık pull request'lerimi listele" istediğinizde akış şöyle işler:

1. Host, yapılandırılmış her sunucu için bir MCP istemcisi başlatır.
2. İstemci ve sunucu, protokol sürümlerini ve yeteneklerini takas ettikleri bir **initialize** el sıkışması yapar.
3. İstemci `tools/list` çağırır; sunucu her araç için JSON Şeması ile araçları döndürür.
4. Host bu araç tanımlarını bağlam olarak LLM'e verir.
5. Model yapısal bir çağrı üretir, örneğin `list_pull_requests`.
6. İstemci JSON-RPC üzerinden bir `tools/call` gönderir.
7. Sunucu GitHub API'sine gider ve yapısal bir sonuç döndürür.
8. Host sonucu modele geri besler, model cevabı yazar.

Şimdi çelişkili kısım. [**2026-07-28 aday sürümü**](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/) (21 Mayıs 2026'da kilitlendi, nihai spesifikasyon 28 Temmuz'da çıkıyor) MCP'yi *durumsuz* hale getiriyor. `initialize` el sıkışmasını ve `Mcp-Session-Id` başlığını tamamen kaldırıyor. İstemci bilgisi ve yetenekler her istekte bir `_meta` alanında taşınıyor, önden yetenek takasının yerine yeni bir `server/discover` metodu geçiyor ve her istek herhangi bir sunucu örneğine düşebiliyor — yapışkan yönlendirme yok, paylaşılan oturum deposu yok, sadece round-robin bir yük dengeleyici. Dürüst görüşüm: üretim için doğru karar ve orijinal durumlu tasarımın tek bir masaüstü süreci için optimize edildiğini, yatay filolar için değil, sessizce itiraf ediyor. MCP'yi "durumlu bir oturum" olarak öğrendiyseniz, gidici olan sürümü öğrendiniz.

## MCP primitifleri, 2026 itibarıyla güncel

MCP, üç sunucu tarafı ve üç istemci tarafı primitif tanımlar. Hangisinin ne olduğunu bilmek, bir sunucu kurarken saatlerce kafa karışıklığından kurtarır.

| Primitif | Taraf | Kontrol eden | Amaç |
|----------|-------|--------------|------|
| Tools (Araçlar) | Sunucu | Model | LLM'in çağırdığı fonksiyonlar (DB sorgula, e-posta gönder) |
| Resources (Kaynaklar) | Sunucu | Uygulama | Host'un yüklediği salt-okunur bağlam (dosya, kayıt, doküman) |
| Prompts (Şablonlar) | Sunucu | Kullanıcı | Kullanıcının tetiklediği şablonlar (slash komutları, iş akışları) |
| Sampling | İstemci | Sunucu | Sunucunun host'un LLM'inden metin üretmesini istemesi — artık araç çağırma destekli |
| Elicitation | İstemci | Sunucu | Sunucunun görev ortasında kullanıcıdan yapısal girdi istemesi |
| Roots | İstemci | Uygulama | Sunucunun dokunabileceği dosya/URI sınırlarını bildirmek |

En kritik ayrım şu: **araçları model kontrol eder** (LLM ne zaman çağıracağına karar verir), **kaynakları ise uygulama kontrol eder** (bağlama neyin yükleneceğine host kodunuz karar verir). Bu ikisini karıştırmak, yeni sunucularda gördüğüm en yaygın tasarım hatası.

2025-11-25 revizyonu bilmeye değer birkaç şey daha ekledi. Sampling artık `tools` ve `toolChoice` parametreleri aldı; yani sunucu tetikli bir tamamlama kendisi araç çağırabiliyor. Araçlar, kaynaklar ve şablonlar artık metadata olarak **ikon** sunabiliyor. Elicitation, URL modu ve standart tabanlı enum'lar kazandı. Ve bir de deneysel **asenkron Tasks** desteği var — sonucunu daha sonra çektiğiniz, uzun süren dayanıklı istekler; 2026-07-28 aday sürümü bunu durumsuz modele göre yeniden şekillendirip tam bir uzantıya terfi ettiriyor.

## stdio mu Streamable HTTP mu: hangi taşıma katmanı

Taşıma katmanı seçmek bir kodlama değil, bir dağıtım kararıdır. İkisi de birebir aynı JSON-RPC mesajlarını taşır.

| Taşıma | Nerede çalışır | En uygun | Yetkilendirme |
|--------|----------------|----------|---------------|
| stdio | Host'un yerel alt süreci | Dosya sistemi, git, masaüstü araçları; en düşük gecikme | Yerel süreç güvenini devralır |
| Streamable HTTP | Bağımsız HTTP servisi | Uzak, çok kullanıcılı, bulut dağıtımları | OAuth 2.1, artık OpenID Connect Discovery ile |

İnsanların takıldığı sürüm notu: ilk spesifikasyon "HTTP+SSE" adında bir taşıma katmanıyla geldi ama 2025-03-26 revizyonu bunu Streamable HTTP ile değiştirdi ve OAuth 2.1 ekledi. 2025-11-25 spesifikasyonu daha da ileri gitti — keşfi RFC 9728 ile hizaladı, önerilen kayıt mekanizması olarak OAuth Client ID Metadata Documents ekledi ve JSON Schema 2020-12'yi varsayılan lehçe yaptı. İki ayrı SSE uç noktası elle kuran bir eğitim okuyorsanız o içerik iki yıl bayat.

## 30 satırda minimal bir MCP sunucusu kurun

Resmi SDK ile 30 satırın altında çalışan bir sunucu ayağa kaldırabilirsiniz. Aşağıda `FastMCP` kullanan, tek bir araç sunan bir Python örneği var — Claude Desktop'a karşı çalıştırın, istemci yeniden başladıktan sonra çağrılabilir bir araç olarak görünür.

```python
# server.py — minimal MCP sunucusu, stdio taşıma katmanı
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("hava-demo")

@mcp.tool()
def get_forecast(city: str) -> str:
    """Bir şehir için kısa hava durumu tahmini döndür."""
    # Üretimde burada gerçek bir hava durumu API'si çağrılır.
    return f"{city}: 22C, açık gökyüzü, hafif rüzgar."

if __name__ == "__main__":
    mcp.run(transport="stdio")
```

Sonra host'unuzun yapılandırmasına kaydedin (Claude Desktop için `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "hava-demo": {
      "command": "python",
      "args": ["/mutlak/yol/server.py"]
    }
  }
}
```

İlk seferinde bende ters giden şu oldu: `args` içinde göreli bir yol kullandım ve host'un çalışma dizini proje klasörüm olmadığı için sunucu sessizce başlamadı. Mutlak yollar kullanın ve host'un MCP loglarını kontrol edin — el sıkışması ya başarılı olur ya olmaz, loglar hangisi olduğunu söyler. [Resmi SDK'lar](https://modelcontextprotocol.io/docs/sdk) artık TypeScript, Python, Go, Java, Kotlin, C#, Rust, Swift ve Ruby'yi kapsıyor; Rust SDK'sı (`rmcp`) Mart 2026'da v1.0.0'a ulaştı ve Go, Google ile birlikte sürdürülüyor. Yığınınızın dilini seçin, API neredeyse birebir aynı.

## MCP neden önemli — ve artık gerçekte kime ait?

MCP önemlidir çünkü agent yeteneğini agent kodundan ayırır. MCP konuşan bir [yapay zeka agent'ı](/tr/posts/ai-agent-mi-workflow-mu), tek bir yapılandırma satırıyla yeni güçler kazanır — yeniden dağıtım yok, SDK güncellemesi yok, tedarikçi kilidi yok. Bu birleştirilebilirlik, araç yüzeyi büyüdükçe üretim agent'larının tam olarak ihtiyaç duyduğu şeydir ve MCP'nin artık bir yenilik değil, [RAG sistemleri](/tr/posts/rag-sistemi-nasil-kurulur) ve [prompt mühendisliği teknikleri](/tr/posts/prompt-muhendisligi-teknikleri) ile aynı seviyede temel altyapı olarak konumlanmasının sebebi budur.

Asıl manşet ise sahiplik hikâyesi. Anthropic MCP'yi Linux Foundation'a devredip OpenAI, Google ve Microsoft ortak sponsor olunca, protokol tek bir tedarikçinin iddiası olmaktan çıkıp paylaşılan altyapıya dönüştü. Bu yönetişim değişimi herhangi bir özellikten daha önemli: temkinli benimsediğiniz bir format ile üzerine şirket kurduğunuz bir format arasındaki fark bu. Diğer [yapay zeka içeriklerimiz](/tr/category/yapay-zeka) arasında, aynı agent yığınında [LLM halüsinasyonlarını nasıl azaltacağınıza](/tr/posts/llm-halusinasyon-azaltma) da bakın.

## Sıkça Sorulan Sorular

### Model Context Protocol açık kaynak mı?

Evet ve Aralık 2025 itibarıyla tedarikçiden bağımsız. Anthropic, MCP'yi Kasım 2024'te MIT tarzı bir lisansla yayımladı — spesifikasyon, resmi SDK'lar ve referans sunucular — sonra Linux Foundation'ın Agentic AI Foundation'ına bağışladı; OpenAI, Google ve Microsoft ortak sponsor oldu. GitHub üzerinde açık biçimde, resmi çalışma gruplarıyla yönetiliyor.

### MCP ile normal bir REST API arasındaki fark nedir?

REST API, her servis için ayrı entegre olduğunuz özel bir sözleşmedir. MCP ise yetenek keşfi için standartlaştırılmış bir üst protokoldür: bir istemci herhangi bir sunucuya "neler yapabilirsin?" diye sorar, makinece okunabilir araç şemaları alır ve altta yatan servis ne olursa olsun onları aynı şekilde çağırır. MCP sunucuları çoğu zaman içeride REST API'leri sarmalar.

### LLM ile araç çağırmak için MCP şart mı?

Hayır. Araç çağırma MCP olmadan da çalışır — fonksiyon tanımlarını doğrudan modele geçirebilirsiniz. MCP, bu araçların birden fazla uygulamada yeniden kullanılabilir olmasını ve her uygulamaya gömülmek yerine çalışma zamanında dinamik keşfedilmesini istediğinizde değer katar.

### MCP üretim için güvenli mi?

Dikkatle kullanılırsa evet. Streamable HTTP, OAuth 2.1 kullanır ve 2025-11-25 spesifikasyonu keşfi ve istemci kaydını sıkılaştırdı. Her sunucuyu bir güven sınırı gibi ele alın: girdileri doğrulayın, roots kapsamını dar tutun ve denetlemediğiniz bir sunucuyu asla açmayın. Araç sonuçları üzerinden prompt injection hâlâ ana risk; sunucuların döndürdüğü içeriği modele ulaşmadan önce temizleyin.
