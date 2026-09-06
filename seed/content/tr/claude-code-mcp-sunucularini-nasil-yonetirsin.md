---
title: "Claude Code MCP Sunucularını Nasıl Yönetirsin?"
slug: "claude-code-mcp-sunucularini-nasil-yonetirsin"
translationKey: "claude-code-managed-mcp-servers"
locale: "tr"
excerpt: "Kısa cevap: managedMcpServers ayarını kullan. Claude Code 2.1.259, MCP sunucularını tüm kullanıcılara merkezi dağıtır; listede olmayan sunucu eklenemez."
category: "ai"
tags: ["claude", "mcp", "compliance", "devops"]
publishedAt: "2026-09-06"
seoTitle: "Claude Code MCP Sunucularını Nasıl Yönetirsin? (2026)"
seoDescription: "Claude Code 2.1.259'daki managedMcpServers ayarı ne yapar? Sabit dağıtım, onaylı katalog ve deny listesi kalıplarını örnek JSON ile anlatıyoruz."
---

Kısa cevap: [`managedMcpServers` yönetilen ayarını](https://code.claude.com/docs/en/managed-mcp) kullan. Claude Code 2.1.259 ile 2 Eylül 2026'da gelen bu ayar, kuruluşunun HTTP veya SSE tipindeki MCP sunucularını tüm kullanıcılara merkezi olarak dağıtmanı sağlar; kullanıcılar `.mcp.json` üzerinden farklı bir sunucu ekleyemez, komut çalıştıran (stdio) girişler ise otomatik atlanır.

## managedMcpServers ayarı ne işe yarar?

Bu ayar, sistem yöneticisinin tanımladığı MCP sunucu setini her kullanıcının oturumuna otomatik olarak enjekte eder; format tam olarak proje düzeyindeki `.mcp.json` ile aynıdır. Amaç, ekipler arasında "hangi MCP sunucusu güvenli, hangisi değil" tartışmasını bireysel tercihten çıkarıp merkezi bir politikaya bağlamaktır. Ayar yalnızca uzak (HTTP/SSE) sunucuları kapsar; yerel komut çalıştıran stdio girişleri güvenlik gerekçesiyle sessizce atlanır.

Aynı sürümle gelen `--permission-prompts none` bayrağı da ilgili bir parça: başsız (headless) ve nöbetsiz makinelerde, normalde bir onay isteyecek her işlem otomatik reddedilir; [aktif izin modu](/tr/posts/claude-code-restricted-mode-nedir) (auto mode dahil) kararı vermeye devam eder. İkisi birlikte, CI runner'ları ve paylaşımlı sunucular gibi insan gözetimi olmayan ortamları güvenli hale getirmek için tasarlandı. Sürümün tam değişiklik listesini [Claude Code changelog'unda](https://code.claude.com/docs/en/changelog) bulabilirsin.

## MCP sunucu erişimini kısıtlamanın kaç yolu var?

Claude Code, sıkılığa göre değişen altı farklı kısıtlama kalıbı sunar; hangisini seçeceğin ihtiyacına bağlı. Aşağıdaki tablo her birinin ne yaptığını ve hangi ayarla kurulduğunu özetliyor.

| Kalıp | Ne yapar | Nasıl kurulur |
|---|---|---|
| MCP'yi tamamen kapat | Süreç-içi sunucular hariç hiçbir sunucu yüklenmez | Boş sunucu haritalı `managed-mcp.json` |
| Sabit dağıtım | Herkes aynı sunucuları alır, başkasını ekleyemez | İçinde sunucular olan `managed-mcp.json` |
| Onaylı katalog | Bir liste yayınlanır, kullanıcı istediğini ekler | `allowedMcpServers` + `allowManagedMcpServersOnly: true` |
| Sadece eklenti sunucuları | `.mcp.json` ile ekleme kapalı, eklenti sunucuları çalışır | `strictPluginOnlyCustomization` listesine `mcp` eklenir |
| Yumuşak izin listesi | Kullanıcı kendi ayarında listeyi genişletebilir | `allowManagedMcpServersOnly` olmadan `allowedMcpServers` |
| Sadece deny listesi | Bilinen kötü sunucular engellenir, gerisi serbest | `deniedMcpServers` |

## managed-mcp.json dosyası nereye konur ve nasıl çalışır?

Dosya, işletim sistemine göre sabit bir sistem yoluna yazılır ve genellikle Jamf, Group Policy veya Intune gibi cihaz yönetimi araçlarıyla dağıtılır. macOS'te `/Library/Application Support/ClaudeCode/managed-mcp.json`, Linux ve WSL'de `/etc/claude-code/managed-mcp.json`, Windows'ta `C:\Program Files\ClaudeCode\managed-mcp.json` yoluna bakılır. Sunucu-yönetimli ayarlar (server-managed settings) üzerinden dağıtılamaz, çünkü tek başına bir sistem dosyasıdır.

Bu dosya devrede olduğunda, kullanıcı `claude mcp add` çalıştırırsa şu hatayı görür: `Cannot add MCP server: enterprise MCP configuration is active and has exclusive control over MCP servers`. Önceden eklenmiş sunucular da bir sonraki oturumda hiçbir uyarı vermeden sessizce kaybolur; bu yüzden politika değişikliğini kullanıcılara önceden duyurmak önemli.

Örnek bir yapılandırma şöyle görünür:

```json
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/"
    },
    "sentry": {
      "type": "http",
      "url": "https://mcp.sentry.dev/mcp"
    }
  }
}
```

Kimlik bilgilerini `env` bloklarında saklama: dosyayı makinedeki her kullanıcı okuyabilir. Bunun yerine `${VAR}` genişletmesiyle her kullanıcının kendi ortam değişkenini okumasını sağla, ya da OAuth/kullanıcı başı başlıklarla her kullanıcının kendi kimliğiyle bağlanmasını kur.

## Onaylı katalog mu, sabit dağıtım mı seçmeli?

Ekip büyüklüğüne ve risk toleransına göre değişir. Sabit dağıtım (`managed-mcp.json`), regülasyona tabi sektörlerde veya tutarlılığın esneklikten daha değerli olduğu büyük ekiplerde doğru seçimdir; kimse listeye eklenmemiş bir sunucuya bağlanamaz. Onaylı katalog (`allowedMcpServers` + `allowManagedMcpServersOnly: true`) ise geliştiricilere seçim özgürlüğü tanırken hâlâ bir güvenlik sınırı çizmek isteyen orta ölçekli ekipler için daha pratik; kullanıcı listedeki sunuculardan istediğini `claude mcp add` ile kendisi bağlar.

`allowedMcpServers` ve `deniedMcpServers`, sunucuları `serverUrl`, `serverCommand` veya `serverName` alanlarıyla eşleştirir. `serverUrl` joker karakter (`*`) destekler ve alan adı eşleşmesinde büyük/küçük harf duyarsızdır; `serverName` ise yalnızca birebir eşleşir ve tek başına güvenlik kontrolü sayılmaz, çünkü bir kullanıcı herhangi bir sunucuya istediği ismi verebilir. Ciddi bir uygulama için `serverUrl` veya `serverCommand` kullan.

Onaylı katalog kalıbının somut hali şöyle görünür; `allowManagedMcpServersOnly` satırı, kullanıcının kendi ayarındaki listeyi genişletmesini engelleyip yalnızca bu listeyi geçerli kılar:

```json
{
  "allowManagedMcpServersOnly": true,
  "allowedMcpServers": [
    { "serverUrl": "https://api.githubcopilot.com/*" },
    { "serverUrl": "https://*.internal.example.com/*" }
  ],
  "deniedMcpServers": [
    { "serverName": "dogrulanmamis-sunucu" }
  ]
}
```

Bu yapılandırma, sunucu değerlendirmesini üç adımda yapar: önce her ayar kapsamındaki liste birleştirilir, sonra deny listesi kontrol edilir (eşleşen her şey engellenir, hiçbir şey bunu geçersiz kılamaz), en son allow listesi kontrol edilir. `allowedMcpServers` hiçbir yerde tanımlı değilse tüm sunucular deny listesini geçtikten sonra yüklenir; tanımlıysa yalnızca eşleşenler yüklenir.

## Kuruluşun hangi MCP sunucularını gerçekten kullandığını nasıl izlersin?

OpenTelemetry ihracatı (export) kurulmuşsa, Claude Code kullanıcıların hangi MCP sunucularını ve araçlarını çağırdığını kaydedebilir. `OTEL_LOG_TOOL_DETAILS=1` ortam değişkenini ayarlamak, araç olaylarına sunucu ve araç adlarını ekler; bu veriyi kendi collector'ında topladığında, hangi sunucuların gerçekten kullanıldığını, hangilerinin hiç dokunulmadan durduğunu görürsün. Bu, onaylı kataloğu zamanla küçültmek veya genişletmek için en güvenilir veri kaynağı; varsayıma göre değil, gerçek kullanıma göre karar vermeni sağlar.

Görüşüm: çoğu şirketin ilk günden sabit dağıtıma atlaması gereksiz sürtünme yaratıyor. Önce deny listesiyle bilinen riskli sunucuları engelle, kullanım verisini `OTEL_LOG_TOOL_DETAILS=1` ile izle, sonra gerçekten yaygın kullanılan üç beş sunucuyu onaylı kataloğa al. [Claude Code'u CI/CD'ye güvenle bağlamak](/tr/posts/ai-ajanlari-cicd-guvenle-baglamak) yazımızdaki aşamalı izin verme yaklaşımı burada da işe yarıyor: önce gözlemle, sonra kısıtla, en son zorunlu kıl.

Bu üç aşamalı yaklaşımın pratikte anlamı şu: ilk hafta hiçbir kısıtlama koymadan yalnızca telemetri topla; ikinci hafta deny listesiyle bilinen sorunlu sunucuları kapat; üçüncü haftada onaylı kataloğu devreye al. Bu sıra, geliştiricilerin alışkın olduğu sunucuları aniden kaybetmesini önlüyor ve politika değişikliğine karşı direnci azaltıyor.

## Kurumun bu ayarı kullanıp kullanmadığını nasıl doğrularsın?

Yönetilen bir makinede iki komutla doğrulama yapılır. Önce `claude mcp list` çalıştır; yalnızca `managed-mcp.json` içindeki sunucular görünmeli. Sonra `claude mcp add --transport http test https://example.com/mcp` dene; bu komutun `Cannot add MCP server: enterprise MCP configuration is active and has exclusive control over MCP servers` hatasıyla başarısız olması gerekir. URL'nin gerçek bir sunucuya işaret etmesi gerekmez, çünkü politika kontrolü komut hiçbir yere bağlanmadan önce reddeder.

Bu doğrulama adımları, [Claude Code'un kendi altyapınızda çalışan oturumları](/tr/posts/claude-code-kendi-altyapinizda-calisan-oturumlar) gibi self-hosted runner senaryolarında özellikle değerli; çünkü bulut oturumlarında hangi sunucuların dışarıda bırakıldığına dair kullanıcıya hiçbir sinyal verilmez, sadece stderr'e bir uyarı yazılır. Bu uyarıyı yakalamak istiyorsan, runner'ının log seviyesini `debug`'a çekmen gerekiyor; aksi halde uyarı sessizce kaybolur.

## Sıkça Sorulan Sorular

### managedMcpServers ile allowedMcpServers arasındaki fark nedir?

`managedMcpServers` (yani `managed-mcp.json`) sabit bir sunucu setini zorunlu kılar ve kullanıcı başka hiçbir sunucu ekleyemez; `allowedMcpServers` ise kullanıcıların kendi ekledikleri sunucuları bir listeyle filtreleyen bir politikadır. İlki dağıtım aracı, ikincisi bir kapı bekçisidir; birlikte de kullanılabilirler.

### MCP sunucusu engellendiğinde kullanıcı ne görür?

Kullanıcı `claude mcp add` çalıştırırsa sunucu adına göre değişen net bir hata mesajı alır; ancak önceden yapılandırılmış bir sunucu politika nedeniyle sonradan engellenirse, hiçbir uyarı olmadan `/mcp` listesinden sessizce kaybolur. Bu yüzden yöneticinin politika değişikliğini kullanıcılara ayrıca duyurması gerekir.

### claude.ai bağlayıcıları managed-mcp.json ile birlikte çalışır mı?

Varsayılan olarak hayır: `managed-mcp.json` dağıtıldığında Claude Code'un kendi çektiği claude.ai bağlayıcıları da bastırılır. Bunları yönetilen setle birlikte yüklemek için yönetilen bir ayar kaynağında `allowAllClaudeAiMcps: true` değerini ayarlaman gerekir; bu bayrak yalnızca sunucu-yönetimli ayarlardan veya MDM dağıtımından okunur.

### Bu ayarlar hangi Claude Code sürümünden itibaren var?

`managedMcpServers` ve `--permission-prompts none` Claude Code 2.1.259 ile 2 Eylül 2026'da geldi. Sunucu eşleştirme kurallarındaki ortam değişkeni genişletme davranışı ise 2.1.219 ve sonrası sürümleri gerektiriyor; daha eski bir sürümdeysen önce güncelle. Kendi geliştirme makinende bu dosyayı hiç oluşturmadan normal `.mcp.json` akışını kullanmaya devam edebilirsin; politikayı test etmek istiyorsan ayrı bir sanal makinede veya konteynerde deneyip gerçek makinenin ayarlarını bozmadan doğrulama yapman en güvenli yol.
