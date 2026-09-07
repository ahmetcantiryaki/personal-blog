---
title: "AGENTS.md: Repo'nu AI Ajanlarına Anlat"
slug: "agents-md-repo-ai-ajanlarina-anlat"
translationKey: "agents-md-repo-setup-2026"
locale: "tr"
excerpt: "Kısa cevap: AGENTS.md, repo köküne koyduğun tek dosyayla build/test komutlarını, kod stilini ve dokunulmaması gereken yolları 30'dan fazla AI ajanına anlatır."
category: "software-engineering"
tags: ["ai-coding", "documentation", "best-practices", "open-source"]
publishedAt: "2026-09-07"
seoTitle: "AGENTS.md Nedir? Repo Kurulum Rehberi 2026"
seoDescription: "AGENTS.md dosyasına ne yazmalısın? Claude Code, Cursor, Copilot ve Codex'in okuduğu bu dosyanın bölümlerini ve yaygın hataları anlatan pratik rehber."
---

Kısa cevap: `AGENTS.md`, repo köküne koyduğun ve build/test komutlarını, kod stilini, dokunulmaması gereken yolları ve inceleme kurallarını anlattığın tek bir Markdown dosyası. 2026 ortası itibarıyla OpenAI Codex, GitHub Copilot, Cursor, Gemini CLI, Google Jules, Factory, Aider, Zed, VS Code, Windsurf ve Devin dahil 30'dan fazla ajan bu dosyayı doğrudan okuyor; Claude Code ise kendi CLAUDE.md'sinin yanında AGENTS.md'yi içe aktarabiliyor.

## AGENTS.md nereden çıktı, kim yönetiyor?

Dosya, OpenAI Codex, Amp, Google Jules, Cursor ve Factory ekiplerinin ortak çalışmasından, tek bir satıcıya ait olmayan bir kural olarak doğdu. Artık Linux Foundation'a bağlı bir proje olan Agentic AI Foundation tarafından yürütülüyor — yani spesifikasyon tek bir şirketin insafına bağlı değil. 2026 ortası itibarıyla 60.000'den fazla açık kaynak repoda bir AGENTS.md dosyası bulunuyor.

Buradaki gerçek sorun, her aracın kendi talimat dosyasını istemesiydi: `.cursorrules`, `CLAUDE.md`, `.github/copilot-instructions.md` gibi. AGENTS.md, bu çoğalmayı tek bir dosyaya indirgemeyi hedefliyor — araçlar arasında taşınabilir, tek bir "onboarding rehberi".

## Bir aracı sürekli aynı hatayı yapan bir repo düşün

Bir ekip, AI ajanının her yeni özellik isteğinde `npm test` yerine yanlış bir test komutu çalıştırdığını, kaldırılmış bir eski API'yi hâlâ kullandığını ve `legacy/` klasörüne dokunmaması gerektiğini her seferinde tekrar tekrar anlatmak zorunda kaldığını fark etti. Repo köküne üç paragraflık bir AGENTS.md eklediler: doğru test komutu, "legacy/ klasörüne yazma" kısıtı ve tercih edilen HTTP istemci kütüphanesi. Sonraki oturumlarda aynı hata bir daha çıkmadı — çünkü artık her ajan, her oturumun başında aynı bağlamı otomatik okuyordu.

## AGENTS.md'ye hangi bölümler gerçekten karşılığını veriyor?

Beş bölüm en yüksek getiriyi sağlıyor: build ve test komutları (tam komut satırı, kısaltma değil), kod stili kuralları (linter zaten yakalıyorsa tekrar etme, yalnızca linter'ın yakalamadığı tercihleri yaz), dokunulmaması gereken yollar (`legacy/`, `generated/` gibi), PR/inceleme kuralları (commit mesajı formatı, hangi testlerin zorunlu olduğu) ve ortam kurulumu (gerekli environment değişkenleri, hangi paket yöneticisi).

| Bölüm | Neden karşılığını veriyor |
|---|---|
| Build/test komutları | Ajan doğru komutu tahmin etmek yerine doğrudan çalıştırır |
| Kod stili | Linter'ın yakalamadığı proje-özel tercihler netleşir |
| Dokunulmaz yollar | Ajanın yanlışlıkla üretilmiş/eski kodu değiştirmesini engeller |
| İnceleme kuralları | PR'ların insan beklentisine daha yakın gelmesini sağlar |
| Ortam kurulumu | Ajan sıfırdan başladığında ortamı doğru kurar |

## AGENTS.md ile CLAUDE.md nasıl bir arada çalışır?

Claude Code kendi CLAUDE.md dosyasını okumaya devam ediyor ama AGENTS.md'yi içe aktarabiliyor — yani bir repo her iki dosyayı da tutabilir, CLAUDE.md Claude'a özgü davranış ayarları (izin modları, alt ajan tanımları gibi) için, AGENTS.md ise tüm araçların ortak okuduğu temel talimatlar için. [Claude Code'un auto mode'u](/tr/posts/claude-code-auto-mode-nasil-calisir) gibi bir ajan uzun süre kendi başına çalıştığında, bu temel talimatların doğru yerde ve güncel olması daha da kritik hale geliyor.

Pratik kural: proje genelinde geçerli, araçtan bağımsız kısıtları AGENTS.md'ye, Claude'a özgü davranış ince ayarlarını CLAUDE.md'ye yaz. İkisini aynı bilgiyle doldurup senkron tutmaya çalışmak, tam da önlemeye çalıştığın bakım yükünü yeniden yaratır.

## AGENTS.md'yi kısa ve güncel tutmanın yolu ne?

En büyük tuzak, dosyanın zamanla eskimiş talimatlarla şişmesi — kaldırılmış bir komutu hâlâ öneren ya da artık geçerli olmayan bir kısıtı hâlâ listeleyen bir AGENTS.md, hiç dosya olmamasından daha kötü çünkü ajan onu doğru sanıp yanlış yönde ilerliyor. Pratik disiplin: `package.json` scriptlerini değiştiren her PR, AGENTS.md'yi de gözden geçirmeli; dosyayı üç ayda bir gerçek repo durumuna karşı elle doğrula; ve dosyayı 100 satırın altında tutmaya çalış — uzunluk arttıkça ajanın önceliklendirmesi zorlaşıyor.

Şu satırlardan biri AGENTS.md'de duruyorsa muhtemelen eskimiştir: kaldırılmış bir paket adı, artık var olmayan bir dizin yolu ya da "şu an X yapıyoruz ama Y'ye geçiyoruz" gibi geçici bir not. Geçici notlar AGENTS.md'ye değil, ilgili PR açıklamasına ya da issue'ya ait.

```markdown
# AGENTS.md — kısa örnek

## Build & Test
- `pnpm install` sonra `pnpm test` (vitest, DB gerektirmez)
- `pnpm lint` — hataları otomatik düzeltmeye çalışma, yalnızca raporla

## Dokunma
- `legacy/` — kaldırılma sürecinde, yeni kod eklenmeyecek
- `generated/` — otomatik üretiliyor, elle düzenleme

## Kod Stili
- HTTP istemcisi olarak `fetch` kullan, axios ekleme
- Yeni dosyalarda varsayılan export yerine adlandırılmış export tercih et
```

Bu kısa örnek bile, aynı üç kısıtı her oturumda yeniden anlatmaktan çok daha ucuz — ve linter'ın zaten yakaladığı kurallara (noktalı virgül, girinti gibi) hiç yer vermiyor, çünkü onlar zaten otomatik uygulanıyor.

[İleri TypeScript kalıpları](/tr/posts/ileri-typescript-kaliplari) gibi proje-özel konvansiyonları anlatan yazılar bile, AGENTS.md'nin "bu repoda nasıl yapılır" sorusuna verdiği kısa, doğrudan cevabın yerini tutmuyor — o yazılar genel prensibi anlatır, AGENTS.md senin reponun özel kararını.

## AGENTS.md hangi araçlarda gerçekten hangi davranışı tetikliyor?

Her araç dosyayı okuyor ama davranışı aynı değil. Codex, Cursor, Copilot ve Windsurf dosyayı yerel olarak destekliyor ve her oturumun başında otomatik yüklüyor; Claude Code ise CLAUDE.md'sini birincil kaynak olarak tutuyor ve AGENTS.md'yi yalnızca açıkça içe aktarıldığında (ya da CLAUDE.md yoksa) okuyor. Bu fark, iki dosyayı da tutan bir repoda hangi bilginin hangi dosyaya gideceğini belirlerken önemli: bir araca özgü davranış ayarı (örneğin belirli bir alt ajanın hangi modelde çalışacağı) AGENTS.md'de durursa, o bilgiyi okumayan araçlar için hiç var olmamış gibi davranıyor.

| Araç | AGENTS.md'yi okur mu | Nasıl |
|---|---|---|
| OpenAI Codex | Evet | Otomatik, oturum başında |
| GitHub Copilot | Evet | Otomatik, oturum başında |
| Cursor | Evet | Otomatik, oturum başında |
| Claude Code | Kısmen | Yalnızca içe aktarıldığında; CLAUDE.md birincil |
| Gemini CLI | Evet | Otomatik, oturum başında |

## Monorepo'da AGENTS.md nasıl ölçeklenir?

Tek bir paket değil, birden fazla servis barındıran bir monorepo'da kök AGENTS.md'yi genel kurallara (ortak lint komutu, commit formatı) ayırıp, her paketin kendi AGENTS.md'sinde o pakete özgü build/test komutlarını tutmak işe yarıyor. Ajanların çoğu, çalıştığı dizinden yukarı doğru en yakın AGENTS.md'yi arıyor, bu da kök dosyanın "genel", alt dizin dosyalarının "özel" olmasını doğal bir hiyerarşiye dönüştürüyor. Riski şu: alt dizin dosyaları kök dosyayla çelişirse (örneğin kökte "pnpm kullan" derken bir paket hâlâ npm script'i öneriyorsa) ajan hangisine uyacağını tahmin etmek zorunda kalıyor — bu yüzden alt dizin dosyalarını yalnızca gerçekten o pakete özgü bilgiyle sınırlı tutmak gerekiyor.

Büyük bir monorepo'da her paketin kendi AGENTS.md'sini tutması, tek bir dev dosyayı elle senkron tutmaktan daha sürdürülebilir; her paket sahibi kendi dosyasını güncelliyor, kök dosya ise yalnızca gerçekten tüm pakette geçerli olan az sayıda kuralı taşıyor. Bu yapı büyüdükçe, kök dosyaya "her yeni paket kendi AGENTS.md'sini eklemeli" gibi tek bir üst kural koymak, alt dizinlerin zamanla dosyayı hiç eklememesini önlüyor.

## Sıkça Sorulan Sorular

### AGENTS.md dosyasını hangi araçlar okuyor?

2026 ortası itibarıyla OpenAI Codex, GitHub Copilot, Cursor, Gemini CLI, Google Jules, Factory, Aider, Zed, VS Code ve Windsurf dahil 30'dan fazla ajan dosyayı doğrudan okuyor; Claude Code ise kendi CLAUDE.md'sinin yanında bu dosyayı içe aktarabiliyor.

### AGENTS.md ile CLAUDE.md aynı şey mi?

Hayır. CLAUDE.md, Claude Code'a özgü davranış ayarlarını (izin modları, alt ajan tanımları gibi) taşır; AGENTS.md ise araçtan bağımsız, tüm ajanların ortak okuduğu temel talimatları (build komutları, dokunulmaz yollar) taşır. Bir repo ikisini de barındırabilir.

### AGENTS.md dosyasına ne kadar yazmalıyım?

Mümkün olduğunca az. Linter'ın zaten yakaladığı kuralları tekrar etme; yalnızca ajanın tahmin edemeyeceği bilgiyi yaz (tam komutlar, dokunulmaz yollar, proje-özel tercihler). 100 satırın altında tutmak, dosyanın hem güncel kalmasını hem de ajanın doğru önceliklendirmesini kolaylaştırıyor.

### Eski bir AGENTS.md dosyası zararlı mı?

Evet, hiç dosya olmamasından daha kötü olabilir. Kaldırılmış bir komutu öneren ya da artık geçerli olmayan bir kısıtı listeleyen bir dosya, ajanın onu doğru bilgi sanıp yanlış yönde ilerlemesine yol açar. `package.json` scriptlerini değiştiren her PR'da dosyayı da gözden geçirmek bu riski büyük ölçüde azaltıyor.
