---
title: "Açık Kaynak AI Kod Ajanları: Hangisi?"
slug: "acik-kaynak-ai-kod-ajanlari"
translationKey: "open-source-ai-coding-agents-2026"
locale: "tr"
excerpt: "Kısa cevap: Model seçimi ve terminal deneyimi önemliyse OpenCode, self-host ve sandbox denetimi önemliyse OpenHands; ikisi de MIT lisanslı ve model bağımsız."
category: "software-engineering"
tags: ["ai-coding", "open-source", "ai-agents", "developer-experience"]
publishedAt: "2026-09-18"
seoTitle: "Açık Kaynak AI Kod Ajanları: 2026 Karşılaştırması"
seoDescription: "Kısa cevap: Model seçimi ve terminal deneyimi önemliyse OpenCode, self-host ve sandbox denetimi önemliyse OpenHands; ikisi de MIT lisanslı ve model bağımsız."
---

Kısa cevap: Terminalde hızlı, model bağımsız bir günlük sürücü istiyorsanız 185.000'den fazla GitHub yıldızıyla en popüler açık kaynak seçenek OpenCode; otonom, sandbox'lanmış görev çözme ve denetlenebilirlik istiyorsanız OpenHands, SWE-bench Verified'da Claude Opus 4.6 ile %68'in üzerinde skor alan bir scaffold sunuyor. İkisi de MIT lisanslı ve kendi altyapınızda barındırılabilir; Claude Code veya Codex CLI gibi barındırılan araçların aksine model sağlayıcısını siz seçiyorsunuz.

## Açık kaynak kod ajanları neden önemli?

Açık kaynak bir kod ajanı size üç şey veriyor: hangi model sağlayıcısını kullanacağınız üzerinde tam kontrol, kodunuzun ve isteklerinizin kendi altyapınızın dışına çıkmaması, ve aracın kendisini denetleyip değiştirebilme özgürlüğü. Barındırılan bir araçta (Claude Code, Codex CLI gibi) bu üçü de sağlayıcının kararına bağlıyken, açık kaynak bir agent'ta hangi LLM'i, hangi sandbox'ı ve hangi MCP sunucularını kullanacağınızı siz belirliyorsunuz.

Bu özellikle düzenlenmiş sektörlerde (finans, sağlık) veya şirket içi model barındıran ekipler için kritik — kodun üçüncü taraf bir API'ye gitmesini istemeyen bir takım, açık kaynak bir agent'ı kendi model uç noktasına bağlayarak aynı iş akışını elde edebiliyor.

## Alan haritası: OpenCode, OpenHands, Crush, Qwen Code

**OpenCode**, Eylül 2026 itibarıyla 185.000'in üzerinde GitHub yıldızıyla açık kaynak kod ajanları arasında açık ara en çok yıldız alanı; MIT lisanslı, TypeScript ile yazılmış, terminal arayüzlü ve sağlayıcı bağımsız — Claude, OpenAI, Google veya yerel modellere karşı çalışabiliyor.

**OpenHands**, kendi kendine barındırılan otonom ajanlar arasında en popüleri; 70.000'in üzerinde GitHub yıldızı ve 490'ın üzerinde katkıcısı var, MIT lisanslı ve sandbox'lanmış bir Docker konteynerinde çalışıyor. OpenHands + CodeAct v3 scaffold'u, Claude Opus 4.6 ile eşleştirildiğinde SWE-bench Verified'da %68,4 skor aldı; bazı kaynaklar otonom issue-çözme senaryosunda %72'ye varan skorlar bildiriyor.

**Crush**, Charm ekibinin Go ile yazdığı terminal-öncelikli bir agent; Anthropic, OpenAI, Google Gemini, OpenRouter, Amazon Bedrock, Azure OpenAI, Vertex AI ve yerel model sunucuları dahil çok sayıda sağlayıcıya bağlanabiliyor, LSP ile kod tabanı bağlamı ve MCP uzantılarını destekliyor. Lisansı MIT değil FSL (Functional Source License) — iki yıl sonra MIT'ye dönüşüyor — ve hâlâ 1.0 öncesi.

**Qwen Code**, Alibaba'nın Gemini CLI kod tabanından uyarlanmış ve Qwen3-Coder 480B MoE modeline optimize edilmiş bir CLI aracı; Apache 2.0 lisanslı. Diğer üçünden farkı, belirli bir model ailesine göre ince ayarlanmış olması — Qwen3-Coder dışındaki modellerle de çalışabiliyor ama en iyi sonucu kendi model ailesiyle veriyor, bu da onu "genel amaçlı" değil "model-özel" bir seçenek yapıyor.

## Model backend, sandbox ve MCP desteğine göre nasıl seçilir?

Model esnekliği en önemli kriterinizse OpenCode veya Crush'ı tercih edin — ikisi de tek bir sağlayıcıya bağlı değil ve oturum ortasında model değiştirmeyi destekliyor. Güvenlik ve izolasyon önceliğiniz, yani ajanın gerçek dosya sisteminize doğrudan erişmesini istemiyorsanız OpenHands'in sandbox'lanmış Docker modeli daha güvenli bir varsayılan.

MCP desteği artık neredeyse tüm alanda standart hâle geldi: OpenCode, Crush ve OpenHands'in güncel sürümleri MCP sunucularına bağlanabiliyor, bu da [kendi MCP bağlayıcınızı yazdıysanız](/tr/posts/ilk-mcp-baglayicini-yaz-2026) onu bu araçların hepsiyle kullanabileceğiniz anlamına geliyor. Maliyet açısından, kendi API anahtarınızla (BYOK) çalışan bu araçlarda gerçek maliyet sağlayıcının token fiyatına bağlı — aracın kendisi ücretsiz ama arkasındaki model çağrıları değil.

Lisans da göz ardı edilmemesi gereken bir kriter: OpenCode ve OpenHands'in MIT lisansı ticari kullanımda tam özgürlük verirken, Crush'ın FSL lisansı iki yıl boyunca bazı ticari kısıtlamalar taşıyor ve bu süre dolduktan sonra MIT'ye dönüşüyor. Bir şirket içi araç zincirine kalıcı olarak entegre etmeden önce bu lisans farkını hukuk ekibinizle netleştirmek gerekiyor.

## Hızlı bir deneme nasıl kurulur?

OpenCode'u denemenin en hızlı yolu, terminalde tek komutla kurup mevcut bir depo içinde çalıştırmak:

```bash
# OpenCode'u kurup mevcut bir proje kökünde başlatın
curl -fsSL https://opencode.ai/install | bash
cd benim-projem
opencode
```

OpenHands için Docker gerekiyor çünkü ajan sandbox içinde çalışıyor:

```bash
# OpenHands'i Docker ile sandbox'lanmış modda başlatın
docker pull docker.all-hands.dev/all-hands-ai/openhands:latest
docker run -it --rm -v $(pwd):/workspace \
  docker.all-hands.dev/all-hands-ai/openhands:latest
```

Her iki kurulumda da ilk adım bir API anahtarı (Anthropic, OpenAI veya seçtiğiniz sağlayıcı) girmek; ardından aracı küçük, tek dosyalık bir görevle test edip güven oluşturmak, doğrudan büyük bir refactor'a sokmaktan daha güvenli bir başlangıç.

## Maliyet ve bakım yükü nasıl karşılaştırılıyor?

Açık kaynak bir agent'ın kendisi ücretsiz olsa da gerçek maliyet, arkasına bağladığınız modelin token fiyatına göre değişiyor — BYOK (bring your own key) modeli, barındırılan bir aracın aylık sabit aboneliğinden daha öngörülemez bir fatura üretebilir çünkü kullanım arttıkça maliyet doğrusal artıyor. Bunun karşılığında, ucuz bir yerel model veya kendi şirketinizin barındırdığı bir uç noktayla çalıştığınızda maliyeti sıfıra yakın tutmak da mümkün; bu esneklik barındırılan araçlarda yok.

Bakım tarafında da fark var: açık kaynak bir agent'ı üretime aldığınızda sürüm yükseltmelerini, güvenlik yamalarını ve MCP sunucu uyumluluğunu kendi ekibiniz takip etmek zorunda kalıyor. Barındırılan bir araçta bu yük sağlayıcıya ait. Küçük bir ekipseniz ve bakım kapasiteniz kısıtlıysa, bu ek yükü göze almadan önce açık kaynak bir agent'ı sadece yan bir araç olarak (üretim iş akışının dışında) denemek makul bir ilk adım.

## Barındırılan araçlarla (Claude Code, Codex CLI) fark ne?

Barındırılan araçlar, model ve altyapı üzerinde daha az kontrol karşılığında daha az kurulum sürtünmesi ve üretici tarafından sürekli güncellenen bir deneyim sunuyor; açık kaynak agent'lar ise kurulum ve bakım yükünü size verirken model seçimi, veri konumu ve özelleştirme üzerinde tam kontrol sağlıyor. Barındırılan araçların güncel bir kıyaslamasını [Claude Code, Cursor ve Antigravity karşılaştırma yazımızda](/tr/posts/claude-code-cursor-antigravity-2026) bulabilirsiniz.

| Araç | GitHub yıldızı | Lisans | Sandbox | Model desteği |
|---|---|---|---|---|
| OpenCode | 185.000+ | MIT | Hayır (yerel) | Çoklu sağlayıcı |
| OpenHands | 70.000+ | MIT | Evet (Docker) | Çoklu sağlayıcı |
| Crush | Hızla büyüyor | FSL (2 yılda MIT) | Hayır (yerel) | Çoklu sağlayıcı |
| Qwen Code | Orta ölçekli | Apache 2.0 | Hayır (yerel) | Qwen3-Coder odaklı |

## Sıkça Sorulan Sorular

### En çok yıldız alan açık kaynak AI kod ajanı hangisi?

Eylül 2026 itibarıyla OpenCode, 185.000'in üzerinde GitHub yıldızıyla açık ara en çok yıldız alan açık kaynak kod ajanı; MIT lisanslı ve model sağlayıcısı bağımsız çalışıyor.

### OpenHands SWE-bench'te ne kadar başarılı?

OpenHands + CodeAct v3 scaffold'u Claude Opus 4.6 ile eşleştirildiğinde SWE-bench Verified'da %68,4 skor aldı; otonom issue-çözme senaryolarında bazı kaynaklar %72'ye varan sonuçlar bildiriyor.

### Açık kaynak kod ajanları hangi LLM sağlayıcılarıyla çalışır?

OpenCode, OpenHands ve Crush; Anthropic, OpenAI, Google ve yerel model sunucuları dahil çoğu büyük sağlayıcıya bağlanabiliyor, Qwen Code ise özellikle Alibaba'nın Qwen3-Coder modeline optimize edilmiş durumda.

### Açık kaynak bir kod ajanını kendi sunucumda barındırmak güvenli mi?

Evet, özellikle OpenHands gibi sandbox'lanmış Docker konteynerinde çalışan araçlar için — ajan gerçek dosya sistemine değil, izole bir ortama erişiyor; kodunuzun üçüncü taraf API'lere gitmemesini istiyorsanız kendi model uç noktanıza bağlamak da mümkün.

Ajan kullanırken yaygın hatalardan kaçınmak için [AI kod asistanı kullanırken yapılan 7 hata yazımıza](/tr/posts/ai-kod-asistani-hatalari), CI/CD'ye bir ajan bağlamadan önce [AI ajanlarını CI/CD'ye güvenle bağlama rehberimize](/tr/posts/ai-ajanlari-cicd-guvenle-baglamak) bakabilirsiniz. Daha fazla yazılım mühendisliği içeriği için [Yazılım Mühendisliği kategorimize](/tr/category/yazilim-muhendisligi) göz atın.

Kaynaklar: [OpenHands'in resmi karşılaştırma yazısı](https://www.openhands.dev/blog/open-source-ai-coding-agents) ve [Charm Crush GitHub deposu](https://github.com/charmbracelet/crush).
