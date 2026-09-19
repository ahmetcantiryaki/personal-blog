---
title: "Claude Code Artık AGENTS.md Destekliyor mu?"
slug: "claude-code-agents-md-destegi"
translationKey: "claude-code-agents-md-fallback-2026"
locale: "tr"
excerpt: "Evet. Claude Code 2.1.277'den itibaren CLAUDE.md yoksa AGENTS.md'yi otomatik okuyor; ancak Bedrock, Vertex AI ve Foundry dağıtımlarında bu özellik henüz yok."
category: "ai"
tags: ["claude", "ai-coding", "developer-experience", "open-source"]
publishedAt: "2026-09-19"
seoTitle: "Claude Code AGENTS.md Desteği: 2.1.277 Ne Değiştirdi?"
seoDescription: "Evet. Claude Code 2.1.277'den itibaren CLAUDE.md yoksa AGENTS.md'yi otomatik okuyor; ancak Bedrock, Vertex AI ve Foundry dağıtımlarında bu özellik henüz yok."
---

Kısa cevap: evet. Anthropic, 18 Eylül 2026'da yayınladığı Claude Code 2.1.277 sürümüyle, proje klasöründe `CLAUDE.md` yoksa aracın artık `AGENTS.md` dosyasını yedek olarak okumasını sağladı. Bu davranış `/config` menüsündeki "Project instructions" bölümünden açılıp kapatılabiliyor. Değişiklik küçük görünse de, birden fazla AI kodlama aracı kullanan ekipler için talimat dosyalarını çoğaltma zorunluluğunu ortadan kaldırıyor.

## AGENTS.md Nedir?

AGENTS.md, bir projenin build komutlarını, test kurallarını ve kod stili tercihlerini AI kodlama asistanlarına anlatmak için kullanılan, araçtan bağımsız açık bir standart. Dosya, Linux Foundation çatısı altındaki Agentic AI Foundation tarafından yönetiliyor ve spesifikasyonu [agents.md](https://agents.md) adresinde yayımlanıyor.

Eylül 2026 itibarıyla AGENTS.md'yi OpenAI Codex, Google Jules, Cursor, GitHub Copilot ve Amp dahil 30'dan fazla AI kodlama aracı destekliyor. Fikir basit: her araç kendi özel dosyasını (`CLAUDE.md`, `.cursorrules`, `.github/copilot-instructions.md` gibi) icat etmek yerine, tek bir ortak dosyayı okusun. Projenizde henüz bir AGENTS.md yoksa, [AGENTS.md'yi repo'ya nasıl yazacağınızı anlattığımız rehbere](/tr/posts/agents-md-repo-ai-ajanlarina-anlat) bakabilirsiniz.

## Claude Code AGENTS.md'yi Nasıl Okuyor?

Claude Code, bir klasörde çalışırken önce `CLAUDE.md` dosyasını arıyor; bulamazsa 2.1.277'den itibaren `AGENTS.md` dosyasına bakıyor ve varsa onu proje bağlamı olarak kullanıyor. Bu, önceki davranıştan net bir kopuş: 18 Eylül 2026'dan önce Claude Code yalnızca `CLAUDE.md`'yi tanıyordu, AGENTS.md dosyası olan projelerde bu dosya tamamen görmezden geliniyordu.

Pratikte bu şu anlama geliyor: Codex veya Cursor için zaten bir AGENTS.md yazmış bir ekip, aynı dosyayı kopyalamadan veya sembolik bağlantı (symlink) numarası yapmadan Claude Code'u da kullanabiliyor. Fallback davranışı `/config > Project instructions` altından istenirse kapatılabiliyor — yani bir ekip bilinçli olarak yalnızca `CLAUDE.md`'ye bağlı kalmayı da tercih edebilir.

## CLAUDE.md mı, AGENTS.md mi Önce Okunuyor?

Bir klasörde her iki dosya da varsa `CLAUDE.md` kazanıyor. AGENTS.md yalnızca bir yedek (fallback) mekanizması; öncelik sırasını değiştiren bir "override" değil. Bu, Anthropic'in Claude'a özgü talimatları (örneğin subagent yapılandırmaları veya Claude'a özel araç kısıtlamaları) korumak istediği projelerde eski davranışı bozmadan yeni standarda kapı aralamasını sağlıyor.

Aşağıdaki tablo davranışı özetliyor:

| Klasörde bulunan dosyalar | Claude Code 2.1.277+ ne okur |
| --- | --- |
| Yalnızca `CLAUDE.md` | `CLAUDE.md` |
| Yalnızca `AGENTS.md` | `AGENTS.md` (yeni davranış) |
| Her ikisi de var | `CLAUDE.md` (öncelikli) |
| Hiçbiri yok | Proje bağlamı yok |

Minimal bir AGENTS.md dosyası şöyle görünebilir:

```markdown
# AGENTS.md

## Build
npm install && npm run build

## Test
npm test -- --watch=false

## Code style
- TypeScript strict mode zorunlu
- Fonksiyon bileşenlerinde varsayılan export kullanma
```

## Fallback Davranışı Nasıl Açılır veya Kapatılır?

Claude Code'da `/config` komutunu çalıştırıp "Project instructions" bölümüne girerek AGENTS.md fallback'ini açıp kapatabilirsiniz. Varsayılan olarak 2.1.277 ve sonrasında bu özellik açık geliyor; yani ek bir işlem yapmadan, projenizde `CLAUDE.md` yoksa Claude Code otomatik olarak `AGENTS.md`'yi devreye sokuyor.

```bash
/config
# > Project instructions > "Read AGENTS.md as fallback" toggle
```

Terminalde çalışan `claude` CLI'ı güncel tutmak yeterli; ayrı bir kurulum adımı gerekmiyor. Değişiklik [resmi değişiklik günlüğünde](https://code.claude.com/docs/en/changelog) 2.1.277 (18 Eylül 2026) girdisi altında listelendi; bir gün sonra çıkan 2.1.278 (19 Eylül 2026) ise AGENTS.md ile ilgili yapılandırma arayüzünde küçük iyileştirmeler getirdi.

## Bu Özellik Her Yerde Çalışıyor mu?

Hayır, Eylül 2026 itibarıyla AGENTS.md fallback'i yalnızca doğrudan Claude Code CLI/API üzerinden kullanılabiliyor. AWS Bedrock, Google Vertex AI ve Anthropic Foundry üzerinden çalıştırılan Claude Code dağıtımlarında bu davranış henüz mevcut değil — bu ortamlardaki kullanıcılar hâlâ yalnızca `CLAUDE.md` ile sınırlı.

| Platform | AGENTS.md fallback (Eylül 2026) |
| --- | --- |
| Claude Code CLI (doğrudan API) | Var |
| AWS Bedrock | Yok |
| Google Vertex AI | Yok |
| Anthropic Foundry | Yok |

Kurumsal ekipler için bu önemli bir ayrıntı: Bedrock veya Vertex üzerinden Claude Code çalıştıran şirketler, geçiş tamamlanana kadar `CLAUDE.md` dosyalarını elde tutmaya devam etmeli. Duyuru Anthropic mühendisleri Thariq ve Addy Osmani tarafından X üzerinden paylaşıldı, ancak platform kapsamı ayrıntısı resmi değişiklik günlüğünde netleşiyor.

## Neden Önemli?

Çünkü çoklu AI araç kullanımı artık istisna değil, norm. Bir ekip Claude Code'u günlük geliştirme için, Cursor'u IDE içi tamamlama için, GitHub Copilot'u da hızlı düzeltmeler için kullanıyorsa, üç ayrı talimat dosyasını senkron tutmak gerçek bir bakım yükü yaratıyordu. AGENTS.md standardı ve şimdi Claude Code'un da buna katılması, bu yükü tek dosyaya indiriyor.

Değişiklikten önce ekiplerin başvurduğu yollar genelde iki taneydi: ya `CLAUDE.md`'yi `AGENTS.md`'ye sembolik bağlantı (symlink) yapmak, ya da her build/test komutu değiştiğinde iki dosyayı elle güncellemek. İkinci yöntem, dosyalardan biri unutulduğunda araçların birbirinden farklı komutlarla çalışmasına yol açabiliyordu — mesela Cursor doğru test komutunu biliyor ama Claude Code eski, kaldırılmış bir script'i çalıştırmaya çalışıyor gibi. Fallback davranışı, en azından `CLAUDE.md` yazılmamış projelerde bu senaryoyu tamamen ortadan kaldırıyor.

Bu değişikliğin açık kaynak ekosistemine etkisi de var. AGENTS.md'nin Linux Foundation çatısı altında, tek bir şirkete bağlı olmayan bir standart olarak yönetilmesi, Claude Code gibi büyük bir aracın buna uyum sağlamasını daha olası kılıyor. Aksi durumda her büyük sağlayıcı kendi formatını dayatmaya devam eder ve ekipler yine dosya çoğaltmaya geri dönerdi.

Açıkçası, konfigürasyon dosyası çoğalması (`.cursorrules`, `.github/copilot-instructions.md`, `CLAUDE.md`, `.aiderrules` ve benzerleri) AI kodlama ekosisteminin en gereksiz sürtünme noktalarından biriydi. Her araç kendi dosyasında ısrar ettikçe ekipler ya kopyala-yapıştır yapıyor ya da senkronizasyon scriptleri yazıyordu. Claude Code'un AGENTS.md'yi yedek olarak kabul etmesi, standardizasyon yönünde atılmış makul bir adım — tam bir birleşme değil, çünkü `CLAUDE.md` hâlâ öncelikli, ama doğru yönde bir adım.

Bu tür araç-ekosistemi karşılaştırmalarına meraklıysanız [Claude Code, Cursor ve Antigravity'yi karşılaştırdığımız yazıya](/tr/posts/claude-code-cursor-antigravity-2026) veya [Claude Code'un otomasyon modunu anlattığımız rehbere](/tr/posts/claude-code-auto-mode-nasil-calisir) göz atabilirsiniz. Arka planda çalışan ajanlarla ilgileniyorsanız [subagent ve arka plan ajanları yazımız](/tr/posts/claude-code-subagent-arka-plan-ajanlari) da faydalı olabilir.

## Mevcut CLAUDE.md'nizi AGENTS.md'ye Nasıl Taşırsınız?

Kısa cevap: dosyayı olduğu gibi kopyalayıp adını değiştirmeniz yeterli, çünkü ikisi de aynı düz metin/Markdown formatını kullanıyor — build komutu, test komutu ve kod stili bölümlerini aynı yapıda tutabilirsiniz. Gerçek iş, Claude'a özgü talimatları (subagent tanımları, `/permissions` kısıtlamaları gibi) ayıklamakta: bunlar AGENTS.md standardının kapsamına girmiyor, çünkü diğer araçlar bu kavramları tanımıyor.

Önerilen yol şu: önce mevcut `CLAUDE.md` içeriğini `AGENTS.md` olarak kopyalayın, ardından yalnızca Claude Code'a özel bölümleri (varsa) `CLAUDE.md` içinde bırakıp geri kalanını `AGENTS.md`'den silin. Bu şekilde iki dosya da var olur; Claude Code hâlâ `CLAUDE.md`'yi öncelikli okur ama Codex veya Cursor gibi diğer araçlar `AGENTS.md`'deki paylaşılan talimatları kullanır. Ekip tamamen tek dosyaya geçmek isterse `CLAUDE.md`'yi silip yalnızca `AGENTS.md` bırakabilir; bu durumda Claude Code da otomatik olarak ona geçer.

Bir uyarı: monorepo yapılarında her alt paketin kendi `AGENTS.md`'si olabilir ve Claude Code, çalıştığı dizinden yukarı doğru en yakın dosyayı arar. Kök dizindeki genel kurallarla bir alt paketin özel build komutlarını karıştırmamak için, alt paket düzeyinde ayrı dosyalar tutmak hâlâ en güvenli yaklaşım.

## Sıkça Sorulan Sorular

### Claude Code AGENTS.md'yi otomatik mi okuyor?

Evet, 18 Eylül 2026'da çıkan 2.1.277 sürümünden itibaren, proje klasöründe `CLAUDE.md` yoksa Claude Code otomatik olarak `AGENTS.md` dosyasını okuyor. Bu davranış varsayılan olarak açık geliyor ama `/config > Project instructions` menüsünden kapatılabiliyor.

### CLAUDE.md ve AGENTS.md aynı anda varsa hangisi kullanılır?

`CLAUDE.md` her zaman önceliklidir. AGENTS.md yalnızca `CLAUDE.md` bulunmadığında devreye giren bir yedek mekanizma; iki dosya birlikte varsa Claude Code AGENTS.md'yi tamamen görmezden gelir.

### AGENTS.md fallback'i Bedrock veya Vertex AI'da çalışıyor mu?

Hayır, Eylül 2026 itibarıyla bu özellik yalnızca doğrudan Claude Code CLI/API üzerinde mevcut. AWS Bedrock, Google Vertex AI ve Anthropic Foundry üzerinden çalıştırılan dağıtımlarda henüz desteklenmiyor, bu ortamlardaki kullanıcılar hâlâ `CLAUDE.md`'ye ihtiyaç duyuyor.

### AGENTS.md standardını kimler destekliyor?

Eylül 2026 itibarıyla OpenAI Codex, Google Jules, Cursor, GitHub Copilot, Amp ve Claude Code dahil 30'dan fazla AI kodlama aracı AGENTS.md'yi destekliyor. Standart, Linux Foundation çatısındaki Agentic AI Foundation tarafından yönetiliyor ve spesifikasyonu agents.md adresinde yayımlanıyor.
