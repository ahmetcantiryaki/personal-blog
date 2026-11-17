---
title: "Agent Teams Code Mode ile Nasıl Çalışır?"
slug: "claude-code-agent-takimlari-code-mode"
translationKey: "claude-code-agent-teams-code-mode-2026"
locale: "tr"
excerpt: "Kısa cevap: Claude Code v2.1.326'dan (16 Kasım 2026) beri agent teams'teki takım arkadaşları da Code Mode'da çalışabiliyor, ama sadece in-process görünümde."
category: "ai"
tags: ["claude", "ai-agents", "automation", "best-practices"]
publishedAt: "2026-11-17"
seoTitle: "Claude Code Agent Teams + Code Mode: v2.1.326 Rehberi"
seoDescription: "Claude Code v2.1.326 ile agent teams takım arkadaşları Code Mode'da çalışabiliyor. Nasıl açılır, hangi görünüm modunda çalışır ve sınırları — Kasım 2026."
---

Kısa cevap: Claude Code v2.1.326'dan (16 Kasım 2026'da yayınlandı) beri bir agent teams takımındaki takım arkadaşları da Code Mode'da çalışabiliyor — yani JavaScript yazıp tek adımda birden fazla araç çağrısı yapabiliyor. Bu sadece varsayılan in-process görünüm modunda geçerli; split-pane modunda başlatılan takım arkadaşları Code Mode'suz başlıyor.

İki özellik de hâlâ deneysel ve varsayılan olarak kapalı. Code Mode, Kasım ayının başında (v2.1.323, 12 Kasım) tek oturumlar için geldi; agent teams ise aylardır deneysel özellik listesinde duruyordu. v2.1.326 bu ikisini ilk kez birbirine bağlıyor ve bunu [Claude Code'un resmi Code Mode dokümantasyonu](https://code.claude.com/docs/en/code-mode) açıkça gereksinim olarak listeliyor.

## Agent teams nedir?

Agent teams, birden fazla Claude Code örneğinin aynı görev üzerinde eş zamanlı çalışmasını sağlayan deneysel bir koordinasyon katmanıdır. Bir "takım lideri" oturumu işi parçalara ayırır, görevleri atar ve sonuçları birleştirir; her takım arkadaşı kendi bağlam penceresinde bağımsız çalışır ve diğerleriyle doğrudan mesajlaşabilir.

Bu, [Claude Code'un subagent sisteminden](/tr/posts/claude-code-subagent-arka-plan-ajanlari) farklıdır: subagent'lar sonucu ana oturuma döndürüp kapanır, agent teams'teki takım arkadaşları ise paylaşılan bir görev listesi üzerinden kendi kendine görev seçebilir ve birbirine mesaj atabilir. [Resmi dokümantasyona göre](https://code.claude.com/docs/en/agent-teams), en güçlü kullanım alanları paralel araştırma, rekabetçi hipotezlerle hata ayıklama ve frontend/backend/test gibi katmanlar arası eş güdümdür — ama token maliyeti tek oturuma göre önemli ölçüde yüksektir.

## Code Mode nedir ve neden önemli?

Code Mode, Claude'un araçları tek tek çağırmak yerine bunları JavaScript kodu içinde birleştirip tek adımda çalıştırmasını sağlayan deneysel bir moddur. Normalde Claude her Bash, Read veya Edit çağrısını ayrı ayrı yapar ve sonucu okuyup bir sonraki adıma karar verir; Code Mode'da ise bu adımların hepsini bir kod parçasına yazar, kod oturumun içinde çalışır ve sadece ihtiyaç duyduğu çıkışı okur.

Örneğin bir retry limitini artırmak istediğinde Claude şöyle bir kod yazabilir:

```javascript
const files = await $`rg -l "function retryPolicy" src`.text();
const target = files.trim().split("\n")[0];
await edit(target, "maxAttempts: 3", "maxAttempts: 5");
({ edited: target, tests: $`npm test -- retryPolicy`.nothrow() });
```

Bu, çok dosyada tekrarlanan değişiklikler, filtrelenmesi gereken arama sonuçları veya paralel çalışabilecek birden fazla bağımsız komut gibi görevlerde araç çağrısı sayısını azaltır. Code Mode'un temellerini [Code Mode Claude Code'da nedir?](/tr/posts/claude-code-code-mode-nedir) yazısında ele almıştık; o yazı henüz agent teams entegrasyonundan önce yayınlanmıştı.

## v2.1.326'da tam olarak ne değişti?

v2.1.326 öncesinde Code Mode sadece tek, etkileşimli bir terminal oturumunda çalışıyordu; bir takım arkadaşı spawn edildiğinde Code Mode devre dışı kalıyordu. v2.1.326 ile birlikte resmi gereksinim listesi şu satırı ekledi: "Agent teams: Code Mode'u agent teams açıkken kullanmak için v2.1.326 veya üstü gerekir. Takım arkadaşları varsayılan in-process görünüm modunda Code Mode'da çalışır, split pane'lerde ise Code Mode'suz başlar."

Pratikte bu şu anlama geliyor: bir takım lideri Code Mode açıkken 3 takım arkadaşı spawn ederse ve bu takım arkadaşları in-process panelde çalışıyorsa, her biri kendi görevinde JavaScript yazıp paralel araç çağrıları yapabilir. Aynı takım split-pane modunda (tmux veya iTerm2 ile) başlatılırsa, takım arkadaşları Code Mode olmadan, klasik tek tek araç çağrısıyla çalışır.

| Görünüm modu | Code Mode desteği (v2.1.326+) | Gereksinim |
|---|---|---|
| In-process (varsayılan) | Takım arkadaşları Code Mode'da çalışır | Hiçbir ek kurulum gerekmez |
| Split-pane (tmux / iTerm2) | Takım arkadaşları Code Mode'suz başlar | tmux veya iTerm2 + `it2` CLI |

## Agent teams'i Code Mode ile nasıl açarsın?

İki ortam değişkenini aynı oturumda ayarlaman gerekir: `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` ve `CLAUDE_CODE_EXPERIMENTAL_CODE_MODE`. En kalıcı yol, her ikisini de `~/.claude/settings.json` içine yazmak:

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1",
    "CLAUDE_CODE_EXPERIMENTAL_CODE_MODE": "1"
  }
}
```

Claude Code sürümünün v2.1.326 veya üstü olduğunu `claude --version` ile doğrula; daha eski bir sürümde agent teams açık olsa bile Code Mode takım arkadaşlarına ulaşmaz ve hata mesajı "agent teams ile henüz birlikte kullanılamıyor" der. Code Mode için ayrıca Claude Opus 5.5, Sonnet 5.5, Haiku 5.5 veya Fable 5.2 model ailelerinden birini kullanman, HIPAA yapılandırması veya sıfır veri saklama (zero data retention) dışında olman gerekiyor.

## Bunu ne zaman kullanmalısın?

Bu kombinasyon, birbirinden bağımsız ve her biri çok adımlı olan paralel görevlerde değer katıyor — örneğin üç takım arkadaşının ayrı modüllerde aynı türde çok dosyalı bir refactor yapması gibi. Her takım arkadaşı kendi görevinde Code Mode'un tek adımda çoklu araç çağrısı avantajından faydalanır, bu da toplam tur sayısını (ve bazı durumlarda token kullanımını) azaltabilir.

Sıralı işlerde, aynı dosyada çalışan görevlerde veya çok bağımlı adımlarda ne agent teams ne de Code Mode avantaj sağlar; ikisi birlikte kullanıldığında koordinasyon yükü ve token maliyeti daha da katlanır. [Resmi dokümantasyon](https://code.claude.com/docs/en/agent-teams) bu kombinasyon için çoğu iş akışında 3-5 takım arkadaşıyla başlamayı öneriyor.

Somut bir örnek: bir PR'ı güvenlik, performans ve test kapsamı açısından ayrı ayrı inceleyen üç takım arkadaşı spawn ettiğinde, her biri kendi inceleme alanında arama yapıp dosyaları filtreleyip sonucu özetleyen bir kod parçası yazabilir — bu, üç ayrı araç çağrısı turunu bir turda toplar. Araştırma ve inceleme gibi yazma içermeyen görevlerde bu kazanç daha belirgin; paralel kod yazımında ise dosya çakışması riski hâlâ geçerli ve iki takım arkadaşının aynı dosyayı düzenlemesi üzerine yazmaya yol açabilir.

## Sınırlamalar ve riskler nedir?

Split-pane modunda Code Mode hâlâ çalışmıyor — bu sadece zamanla gelecek bir eksiklik değil, resmi dokümantasyonun bugün itibarıyla kesin sınırı. Ayrıca Code Mode'un kendi sınırları (oturum sadece terminalde devam ettirilebilir, auto modun sınıflandırıcısı her kod çağrısını değil kodun kendisini inceler, kod en fazla 10 dakika çalışabilir, arka planda devam edebilen kod en fazla 2 saat) her takım arkadaşı için ayrı ayrı geçerli.

Benim gözlemim şu: bu entegrasyon hâlâ deneysel-üstüne-deneysel bir birleşim, yani production kritik bir iş akışına bugünden bağlamak riskli. Ama araştırma ve kod incelemesi gibi düşük riskli, paralel keşif gerektiren görevlerde denemeye değer — [takım arkadaşlarını fork alt ajanlarıyla](/tr/posts/claude-code-fork-alt-ajanlari-artik-varsayilan) karşılaştırarak hangi modelin işine daha uygun olduğunu görebilirsin. Takım arkadaşları arası mesajlaşmanın nasıl çalıştığını [oturumlar arası mesajlaşma](/tr/posts/claude-code-oturumlar-arasi-mesajlasma) yazısında daha detaylı bulabilirsin. Daha fazla Claude Code ve yapay zeka içeriği için [Yapay Zeka kategorisine](/tr/category/yapay-zeka) göz atabilirsin.

## Sıkça Sorulan Sorular

### Agent teams ve Code Mode birlikte nasıl açılır?

`~/.claude/settings.json` dosyasında `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` ve `CLAUDE_CODE_EXPERIMENTAL_CODE_MODE` değişkenlerinin her ikisini de `"1"` yapman gerekir. Ayrıca Claude Code sürümünün v2.1.326 veya üstü olması, desteklenen bir modelde (Opus 5.5, Sonnet 5.5, Haiku 5.5, Fable 5.2) çalışman şarttır.

### Split-pane modunda takım arkadaşları Code Mode'da çalışır mı?

Hayır. v2.1.326 itibarıyla Code Mode sadece varsayılan in-process görünüm modunda çalışan takım arkadaşlarına uygulanıyor; tmux veya iTerm2 ile açılan split-pane takım arkadaşları Code Mode olmadan, klasik araç çağrısı akışıyla başlıyor.

### Agent teams ile subagent arasındaki fark ne?

Subagent'lar sonucu ana oturuma döndürüp kapanır ve tüm koordinasyonu ana ajan yönetir; agent teams'teki takım arkadaşları ise kendi bağlam pencerelerinde bağımsız çalışır, paylaşılan bir görev listesinden görev seçer ve birbirlerine doğrudan mesaj atabilir. Agent teams token maliyeti açısından daha yüksektir.

### Code Mode hangi modellerde çalışır?

Code Mode, Claude Opus 5.5, Sonnet 5.5, Haiku 5.5 ve Fable 5.2 model ailelerinde çalışır; Claude Code v2.1.323 veya üstü, etkileşimli bir terminal oturumu ve HIPAA yapılandırması veya sıfır veri saklama dışında olman gerekir.

**Kaynaklar:** [Claude Code — Code Mode](https://code.claude.com/docs/en/code-mode), [Claude Code — Agent Teams](https://code.claude.com/docs/en/agent-teams).
