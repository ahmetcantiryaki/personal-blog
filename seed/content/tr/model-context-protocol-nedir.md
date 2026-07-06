---
title: "Model Context Protocol (MCP) Nedir"
slug: "model-context-protocol-nedir"
translationKey: "model-context-protocol-explained"
locale: "tr"
excerpt: "Model context protocol nedir? MCP, yapay zeka modellerini araç ve verilere tek bir arayüz üzerinden bağlayan açık bir standarttır. Mimarisi ve kurulumu içeride."
category: "ai"
tags: ["mcp", "ai-agents", "llm", "integration"]
publishedAt: "2026-05-30"
seoTitle: "Model Context Protocol (MCP) Nedir"
seoDescription: "Model context protocol nedir? MCP'nin LLM'leri araç ve verilere tek açık standartla nasıl bağladığını mimari, primitifler, taşıma katmanı ve kurulumla anlatıyoruz."
---

**Model context protocol nedir** sorusunun tek cümlelik cevabı: MCP, yapay zeka modellerini dış araçlara, verilere ve servislere her kombinasyon için ayrı bir entegrasyon yazmadan tek ve tutarlı bir arayüz üzerinden bağlayan açık bir standarttır. Anthropic bunu Kasım 2024'te tanıttı, açık kaynak yaptı ve 2026 itibarıyla OpenAI, Google ve Microsoft da MCP desteği veriyor. Kısacası yapay zeka uygulamaları için USB-C gibi düşünün.

Bu derinlemesine yazıda protokolün gerçekte ne olduğunu, mimarinin nasıl oturduğunu, bir sunucunun sunduğu primitifleri ve üretimde kuracağınız taşıma katmanlarını anlatıyorum. Buradaki her iddia [modelcontextprotocol.io](https://modelcontextprotocol.io) adresindeki resmi spesifikasyona dayanıyor.

## Model context protocol nedir ve ne işe yarar?

Model Context Protocol, yapay zeka uygulamalarının dış yetenekleri nasıl keşfedip çağıracağını tanımlayan, JSON-RPC 2.0 temelli açık bir standarttır. Her model-araç ikilisi için ayrı bağlantı kodlamak yerine bir aracı MCP sunucusu olarak bir kez sunarsınız; MCP uyumlu her istemci onu kullanabilir. Tek arayüz, çok sayıda tüketici.

Çözdüğü asıl sorun **M×N entegrasyon patlamasıdır**. MCP öncesinde `M` yapay zeka uygulamasını `N` araca bağlamak, en fazla `M × N` özel konnektör yazmak demekti. MCP bunu `M + N`e indirir: her uygulama istemci tarafını, her araç sunucu tarafını bir kez yazar ve hepsi birbiriyle konuşur. Bu, USB, ODBC ve Language Server Protocol'ün kendi alanlarında yaptığı hamlenin aynısıdır.

MCP taşıma katmanından ve dilden bağımsızdır. 2026 itibarıyla TypeScript, Python, Java, Kotlin, C#, Go, Ruby ve Swift için resmi SDK'lar var; yani model context protocol ister Next.js uygulamanızda ister Spring servisinizde çalışır.

## Model context protocol nasıl çalışır?

Kısa cevap: MCP, JSON-RPC 2.0 üzerinde bir istemci-sunucu mimarisi kullanır. Bir ana uygulama her sunucu için bir istemci oluşturur, her istemci kendi sunucusuyla durum tutan 1:1 bir oturum yürütür ve sunucu; modelin konuşma sırasında çağırabileceği araçları, kaynakları ve şablonları sunar.

Akılda tutulması gereken üç rol var:

- **Host (ana uygulama):** Kullanıcının etkileşime girdiği yapay zeka uygulaması — Claude Desktop, bir IDE asistanı ya da özel bir agent. LLM'i barındırır ve her şeyi düzenler.
- **Client (istemci):** Ana uygulamanın içinde yaşayan bir konnektör. Her istemci tek bir sunucuyla tam olarak bir oturum tutar.
- **Server (sunucu):** Belirli yetenekleri sunan hafif bir program — GitHub sunucusu, Postgres sunucusu, dosya sistemi sunucusu.

"Açık pull request'lerimi listele" dediğinizde uçtan uca akış şöyle işler:

1. Ana uygulama başlar ve yapılandırılmış her sunucu için bir MCP istemcisi başlatır.
2. İstemci ve sunucu, protokol sürümlerini ve yeteneklerini takas ettikleri bir **initialize** el sıkışması yapar.
3. İstemci `tools/list` çağırır, sunucu her araç için JSON Şeması ile birlikte kullanılabilir araçları döndürür.
4. Ana uygulama bu araç tanımlarını bağlamının parçası olarak LLM'e verir.
5. Model bir araca ihtiyaç olduğuna karar verir ve yapısal bir çağrı üretir, örneğin `list_pull_requests`.
6. İstemci JSON-RPC üzerinden sunucuya bir `tools/call` isteği gönderir.
7. Sunucu gerçek işi yapar — GitHub API'sine gider — ve yapısal bir sonuç döndürür.
8. Ana uygulama sonucu modele geri besler, model de nihai cevabı yazar.

Oturum durum tutar: initialize aşamasında anlaşılan yetenekler bağlantı boyunca geçerlidir ve sunucular ("araç listem değişti" gibi) bildirimleri sorgulanmadan gönderebilir.

## MCP primitifleri nelerdir?

MCP, üç sunucu tarafı ve üç istemci tarafı primitif tanımlar. Hangisinin ne olduğunu bilmek, bir sunucu kurarken saatlerce kafa karışıklığından kurtarır.

| Primitif | Taraf | Kontrol eden | Amaç |
|----------|-------|--------------|------|
| Tools (Araçlar) | Sunucu | Model | LLM'in çağırabildiği fonksiyonlar (DB sorgula, e-posta gönder) |
| Resources (Kaynaklar) | Sunucu | Uygulama | Ana uygulamanın yüklediği salt-okunur bağlam (dosya, kayıt, doküman) |
| Prompts (Şablonlar) | Sunucu | Kullanıcı | Kullanıcının tetiklediği şablonlar (slash komutları, iş akışları) |
| Sampling | İstemci | Sunucu | Sunucunun host'un LLM'inden metin üretmesini istemesi |
| Elicitation | İstemci | Sunucu | Sunucunun görev ortasında kullanıcıdan yapısal girdi istemesi |
| Roots | İstemci | Uygulama | Sunucunun dokunabileceği dosya/URI sınırlarını bildirmek |

En kritik ayrım şu: **araçları model kontrol eder**, yani onları ne zaman çağıracağına LLM karar verir; **kaynakları ise uygulama kontrol eder**, yani bağlama neyin yükleneceğine host kodunuz karar verir. Bu ikisini karıştırmak, yeni MCP sunucularında gördüğüm en yaygın tasarım hatası.

Her ikisi de 2025 spesifikasyon revizyonlarında sağlamlaştırılan sampling ve elicitation, sunucuların ince kalmasını sağlayan şeydir. Bir sunucu kendi API anahtarını taşımak yerine host'tan bir LLM tamamlaması çalıştırmasını isteyebilir (sampling) ve hata vermek yerine kullanıcıdan eksik bir değeri toplamak için duraklayabilir (elicitation).

## MCP hangi taşıma katmanlarını destekler?

MCP iki standart taşıma katmanı destekler ve doğru olanı seçmek bir kodlama değil, bir dağıtım kararıdır. İkisi de aynı JSON-RPC mesajlarını taşır; yalnızca sunucunun nerede çalıştığı ve baytların nasıl aktığı konusunda ayrışırlar.

- **stdio:** Ana uygulama sunucuyu yerel bir alt süreç olarak başlatır ve standart girdi/çıktı üzerinden konuşur. Sıfır ağ, en düşük gecikme; dosya sistemi ya da git erişimi gibi yerel araçlar için ideal. Çoğu masaüstü entegrasyonu bunu kullanır.
- **Streamable HTTP:** Sunucu bağımsız bir HTTP servisi olarak çalışır; uzak ya da çok kullanıcılı dağıtımlar için isteyeceğiniz budur. Akış ve sunucu kaynaklı mesajlar için Server-Sent Events destekler.

İnsanların takıldığı bir sürüm notu: ilk spesifikasyon "HTTP+SSE" adında bir taşıma katmanıyla geldi ama **2025-03-26 revizyonu bunu Streamable HTTP ile değiştirdi** ve OAuth 2.1 temelli bir yetkilendirme çerçevesi ekledi. İki ayrı SSE uç noktası elle kuran eski bir eğitim okuyorsanız o içerik güncelliğini yitirmiştir. Yazının yazıldığı sıradaki güncel spesifikasyon (2025-06-18), ayrıca yapısal araç çıktısı ekledi ve JSON-RPC toplu istek (batching) desteğini kaldırdı.

## Minimal bir MCP sunucusu nasıl kurulur?

Resmi SDK ile 30 satırın altında çalışan bir sunucu ayağa kaldırabilirsiniz. Aşağıda `FastMCP` kullanan, tek bir araç sunan bir Python örneği var — bunu Claude Desktop'a karşı yerelde çalıştırdım ve istemci yeniden başladıktan sonra çağrılabilir bir araç olarak göründü.

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

İlk seferinde bende ters giden şu oldu: `args` içinde göreli bir yol kullandım ve host'un çalışma dizini proje klasörüm olmadığı için sunucu sessizce başlamadı. Mutlak yollar kullanın ve host'un MCP loglarını kontrol edin — el sıkışması ya başarılı olur ya olmaz, loglar hangisi olduğunu söyler. Daha derin desenler için [TypeScript SDK ile MCP sunucusu kurma rehberimiz](#) kaynakları ve yetkilendirmeyi adım adım anlatıyor.

## MCP, yapay zeka agent'ları için neden önemli?

MCP önemlidir çünkü agent yeteneğini agent kodundan ayırır. MCP konuşan bir [yapay zeka agent'ı](#), tek bir sunucu yapılandırma satırı ekleyerek yeni güçler kazanır — yeniden dağıtım yok, SDK güncellemesi yok, tedarikçi kilidi yok. Bu birleştirilebilirlik, araç yüzeyi büyüdükçe üretim agent'larının tam olarak ihtiyaç duyduğu şeydir.

Benimseme eğrisi de bunu doğruluyor. OpenAI, Mart 2025'te Agents SDK genelinde MCP desteğini duyurdu, Google DeepMind bunu Gemini için doğruladı ve Microsoft, Copilot Studio ile Windows'a yerleştirdi. Rakipler aynı iletişim formatında standartlaştığında protokol tek bir tedarikçinin iddiası olmaktan çıkıp altyapıya dönüşür. Bütünsel resim için [yapay zeka mühendisliği ana rehberimize](#) ve MCP'nin modern bir yığında [RAG sistemlerinin](#) yanında nasıl konumlandığına göz atın.

## Sıkça Sorulan Sorular

### Model Context Protocol açık kaynak mı?

Evet. Anthropic, MCP'yi Kasım 2024'te MIT tarzı bir lisansla açık standart olarak yayımladı; spesifikasyon, resmi SDK'lar ve referans sunucular dahil. GitHub üzerinde açık biçimde yönetiliyor ve katkılarla spesifikasyon önerileri yalnızca Anthropic'ten değil, sektörün genelinden geliyor.

### MCP ile normal bir REST API arasındaki fark nedir?

REST API, her servis için ayrı ayrı entegre olduğunuz özel bir sözleşmedir. MCP ise yetenek keşfi için standartlaştırılmış bir üst protokoldür: bir istemci herhangi bir sunucuya "neler yapabilirsin?" diye sorabilir, makinece okunabilir araç şemaları alır ve altta yatan servis ne olursa olsun onları aynı şekilde çağırır. MCP sunucuları çoğu zaman içeride REST API'leri sarmalar.

### LLM ile araç çağırmak için MCP şart mı?

Hayır. Araç çağırma MCP olmadan da gayet çalışır — fonksiyon tanımlarını doğrudan modele geçirebilirsiniz. MCP, bu araçların birden fazla uygulamada yeniden kullanılabilir olmasını ve her uygulamaya gömülmek yerine çalışma zamanında dinamik keşfedilmesini istediğinizde değer katar.

### MCP üretim için güvenli mi?

Dikkatle kullanılırsa olabilir. 2025-03-26 spesifikasyonu HTTP taşıma katmanları için OAuth 2.1 yetkilendirme çerçevesi ekledi ve her sunucuyu bir güven sınırı gibi ele almalısınız: girdileri doğrulayın, roots kapsamını dar tutun ve denetlemediğiniz bir sunucuyu asla açmayın. Araç sonuçları üzerinden prompt injection hâlâ ana risk, bu yüzden sunucuların döndürdüğü içeriği modele ulaşmadan önce temizleyin.
