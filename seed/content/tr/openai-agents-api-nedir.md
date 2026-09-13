---
title: "OpenAI Agents API Nedir? Codex Altyapısı API'de"
slug: "openai-agents-api-nedir"
translationKey: "openai-agents-api-launch-2026"
locale: "tr"
excerpt: "OpenAI, 10 Eylül 2026'da Agents API'yi beta'ya çıkardı: Codex'in ajan döngüsünü oturumlar, sandbox'lar ve MCP desteğiyle tek API çağrısına indiriyor."
category: "ai"
tags: ["openai", "ai-agents", "mcp", "cloud", "ai-infrastructure"]
publishedAt: "2026-09-13"
seoTitle: "OpenAI Agents API Nedir? Codex Altyapısı API'de"
seoDescription: "OpenAI Agents API 10 Eylül 2026'da beta'ya çıktı: Codex'in yönetilen ajan döngüsünü dayanıklı oturumlar, sandbox'lar ve MCP desteğiyle tek çağrıya indiriyor."
---

Kısa cevap: OpenAI Agents API, Codex'i çalıştıran yönetilen ajan döngüsünü — oturum yönetimi, bağlam sıkıştırma, araç çağrıları ve kurtarma dahil — geliştiricilere tek bir API olarak açıyor. 10 Eylül 2026'da genel beta'ya çıktı; kendi ajanınızı sıfırdan orkestre etmek yerine bu döngüyü OpenAI'nin altyapısında çalıştırıp yalnızca kullandığınız token ve araç için ödüyorsunuz.

## OpenAI Agents API nedir?

Agents API, çok adımlı bir ajanı uçtan uca yöneten barındırılmış bir servistir: model çağrılarını sıralar, araç kullanımını koordine eder, bağlamı gerektiğinde sıkıştırır ve oturum kesintiye uğrarsa kaldığı yerden devam ettirir. Geliştirici tarafında kalan iş, araçları tanımlamak, bir sandbox seçmek ve token ile araç kullanımı için standart API ücretini ödemektir — API'nin kendisi için ekstra ücret yok.

Bunu farklı kılan, OpenAI'nin Codex için inşa ettiği aynı "harness"i (ajan çalıştırma çerçevesini) dışarı açması. Daha önce yalnızca Codex CLI ve ChatGPT içinde çalışan orkestrasyon mantığı artık herhangi bir uygulamanın çağırabileceği bir API yüzeyi.

## Dört temel kavram: Agent, Environment, Session, Events

API dört kavram etrafında kurulu:

- **Agent**: model, talimatlar, araçlar ve bağlı MCP sunucuları.
- **Environment**: ajanın dosyalara eriştiği, yetenek (skill) yüklediği ve komut çalıştırdığı isteğe bağlı sandbox.
- **Session**: bir görev üzerinde çalışan ve girdilere yanıt veren dayanıklı ajan örneği.
- **Events ve items**: ajana gönderilen girdiler ile ürettiği çıktılar.

Bir oturum turlar arasında çalışmaya devam eder; ilerleme, uygulamanıza akış (streaming) olarak geri döner. Bu, uzun süren bir görevi başlatıp bağlantıyı kesmenize, sonra kaldığı yerden takip etmenize izin verir — kendi tekrar deneme ve durum saklama mantığınızı yazmanıza gerek kalmadan.

## Sandbox seçimi nasıl çalışır?

Ajan kod çalıştırması ya da dosya işlemesi gerektiğinde bir yürütme ortamına ihtiyaç duyar. OpenAI üç seçenek sunuyor: OpenAI'nin barındırdığı sandbox, kendi altyapınızdaki bir sandbox veya bir ortak entegrasyonu. Blaxel, Cloudflare, Daytona, DigitalOcean, E2B, Modal, Oracle, Runloop ve Vercel; Eylül 2026 itibarıyla birinci sınıf entegrasyonlara sahip ortaklar arasında. Bu, ajanınızı kendi VPC'nizde, uyumluluk sınırlarınız içinde ya da OpenAI'nin varsayılan ortamında çalıştırmayı seçebileceğiniz anlamına geliyor.

## Agents API ile Agents SDK'nın farkı ne?

Agents SDK açık kaynaklı bir çerçeve; ajan mantığını kendi sunucunuzda, kendi orkestrasyon kodunuzla çalıştırırsınız — OpenAI yalnızca model çağrılarını sağlar. Agents API ise tam tersi: orkestrasyonun kendisini OpenAI'nin barındırdığı, dayanıklı oturumlar ve otomatik bağlam yönetimiyle gelen bir servis olarak sunar. SDK'yı ince bir sevk (handoff) zinciri için, Agents API'yi ise uzun süren, durum gerektiren görevler için düşünün.

Bu ayrım önemli çünkü ikisi karıştırılabiliyor: SDK Mart 2025'te tanıtıldı ve Nisan 2026'da model-native bir harness (dosya işlemleri, kod çalıştırma, kabuk erişimi) ve yedi sağlayıcı için sandbox desteğiyle güncellendi. Agents API ise bambaşka bir katman — SDK'nın istemci tarafı orkestrasyonunu, OpenAI'nin kendi sunucularında çalışan yönetilen bir hizmete taşıyor.

## Fiyatlandırma ve kullanılabilirlik nasıl?

API'nin kendisi için ek ücret yok. Model kullanımını seçtiğiniz modelin standart API oranından, araç kullanımını OpenAI'nin sağladığı araçların standart ücretinden, sandbox kullanımını ise konteyner ücretlendirmesinden faturalandırıyorlar. 10 Eylül 2026'da genel beta olarak açıldı; OpenAI beta sürecinde geliştirici geri bildirimiyle hızlı iterasyon yapacağını söylüyor.

| Özellik | Agents SDK | Agents API |
|---|---|---|
| Çalıştığı yer | Kendi sunucunuz | OpenAI'nin altyapısı |
| Orkestrasyon | Sizin kodunuz | Yönetilen (barındırılmış) |
| Oturum dayanıklılığı | Kendiniz kurarsınız | Yerleşik, turlar arası |
| Sandbox | Yok / kendiniz eklersiniz | Barındırılmış, kendi altyapınız veya 9 ortak |
| Ek ücret | Yok | Yok (token + araç + konteyner) |
| İlk sürüm | Mart 2025 | 10 Eylül 2026 (beta) |

## Claude ve Gemini'nin bir karşılığı var mı?

Evet. Anthropic'in Claude Developer Platform'u benzer bir yönde ilerliyor: [Claude Managed Agents](/tr/posts/claude-managed-agents-butce-danisman-veri-konumu) bütçe kontrolleri, danışman desteği ve veri konumu seçenekleriyle karşılaştırılabilir bir yönetilen-ajan modeli sunuyor. Google tarafında Agent Development Kit (ADK) benzer bir orkestrasyon katmanı sağlıyor. Üç sağlayıcının da 2026'da aynı sorunu çözmeye çalışması tesadüf değil: ajan mantığını elle yazmak pahalı ve kırılgan, bu yüzden hepsi bunu yönetilen bir hizmete dönüştürüyor.

## Bu, MCP ile nasıl çalışır?

Agents API, özel araçların yanı sıra [MCP sunucularını](/tr/posts/model-context-protocol-nedir) doğrudan destekliyor. Bir ajana MCP sunucunuzu bağladığınızda, ajan o sunucunun sunduğu araçları kendi araç setinin bir parçası gibi kullanabiliyor — barındırılmış oturum, MCP çağrılarının durumunu da diğer araç çağrıları gibi takip ediyor. [İlk MCP bağlayıcınızı yazmak](/tr/posts/ilk-mcp-baglayicini-yaz-2026) için attığınız adımlar burada da geçerli; tek fark, bağlayıcıyı artık kendi orkestrasyon kodunuz yerine OpenAI'nin barındırılmış oturumuna takıyor olmanız.

## Basit bir örnekle nasıl başlarsın?

Bir oturum başlatmak, tek bir POST isteğiyle mümkün. Aşağıdaki istek, bir araç setine bağlı bir ajan oluşturup ilk görevi veriyor:

```json
{
  "agent": {
    "model": "gpt-5.6",
    "instructions": "Depoyu klonla, testleri çalıştır, başarısız olanları raporla.",
    "tools": ["code_execution", "file_search"]
  },
  "environment": {
    "sandbox": "hosted"
  },
  "input": "src/ dizinindeki testleri çalıştır ve sonucu özetle."
}
```

Yanıt bir oturum kimliği döner; ilerleme, o oturuma bağlı bir olay akışı (event stream) üzerinden size geri gelir. Kendi retry ve durum saklama mantığınızı yazmak yerine, oturumun kendisi görevi kaldığı yerden devam ettiriyor.

## Kimler için mantıklı, kimler için değil?

Tek seferlik, kısa süren bir görev için (örneğin bir metni özetletmek) bu API fazla ağır — düz bir tamamlama (completion) çağrısı yeterli. Agents API'nin değer kattığı yer, birden fazla aracı sırayla çağıran, dakikalar ya da saatler sürebilen ve arada kesintiye uğrayabilen görevler: bir kod tabanını tarayıp çoklu dosyada değişiklik yapmak, uzun bir araştırma görevini arka planda yürütmek veya bir CI/CD adımını ajan üzerinden tetiklemek gibi. Görev tek bir model çağrısıyla bitiyorsa, dayanıklı oturum altyapısının getirdiği ek karmaşıklığa gerek yok.

## Aykırı görüş

Bu duyuru "OpenAI harness'i açık kaynak yaptı" diye okunmamalı — tam tersi bir hamle. Codex'in orkestrasyon mantığını API'ye taşımak, geliştiricileri OpenAI'nin barındırma katmanına daha derin bağlıyor: oturum durumu artık kendi veritabanınızda değil OpenAI'nin sunucularında yaşıyor. Bazı geliştiricilerin ilk tepkisi bu yüzden temkinli oldu — Chat Completions API'den bu yönetilen modele geçişin teknik değil ticari bir motivasyonu olduğunu düşünenler var. Kilitlenme riski gerçek; ama dayanıklı oturum, bağlam sıkıştırma ve sandbox orkestrasyonunu sıfırdan yazmanın mühendislik maliyeti de öyle. Küçük bir ekipseniz ödünleşim muhtemelen lehinize; platformunuzun temel taşı bir ajan çalıştırma zamanıysa, kilitlenmeyi [AI ajanlarını CI/CD'ye bağlarken](/tr/posts/ai-ajanlari-cicd-guvenle-baglamak) olduğu gibi ciddiye almanız gerekiyor.

## Sıkça Sorulan Sorular

### OpenAI Agents API ne zaman yayınlandı?

OpenAI, Agents API'yi 10 Eylül 2026'da genel beta olarak yayınladı. API, Codex'i çalıştıran yönetilen ajan döngüsünü — dayanıklı oturumlar, sandbox'lar ve MCP araç desteği dahil — geliştiricilere açıyor.

### Agents API ile Agents SDK aynı şey mi?

Hayır. Agents SDK açık kaynaklı bir çerçevedir ve ajan mantığını kendi sunucunuzda çalıştırırsınız. Agents API ise orkestrasyonu OpenAI'nin barındırdığı, dayanıklı oturumlar ve otomatik bağlam yönetimiyle gelen tam yönetilen bir hizmettir.

### Agents API'yi kullanmak ne kadar tutuyor?

API'nin kendisi için ek ücret yok. Model kullanımı seçtiğiniz modelin standart API fiyatından, araç kullanımı OpenAI'nin sağladığı araçların standart ücretinden, sandbox kullanımı ise konteyner ücretlendirmesinden faturalandırılıyor.

### Agents API'yi kendi sunucumda mı yoksa OpenAI'nin sunucusunda mı çalıştırabilirim?

İkisi de mümkün. OpenAI'nin barındırdığı sandbox'ı kullanabilir, kendi altyapınızda bir sandbox çalıştırabilir veya Blaxel, Cloudflare, Daytona, DigitalOcean, E2B, Modal, Oracle, Runloop ve Vercel gibi ortak entegrasyonlarından birini seçebilirsiniz.
