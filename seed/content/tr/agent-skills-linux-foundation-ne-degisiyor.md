---
title: "Agent Skills Artık Linux Foundation'da: Ne Değişiyor?"
slug: "agent-skills-linux-foundation-ne-degisiyor"
translationKey: "agent-skills-aaif-donation-2026"
locale: "tr"
excerpt: "Anthropic, 22 Ekim 2026'da Agent Skills standardını Linux Foundation'ın Agentic AI Foundation'ına bağışladı. 70'ten fazla platform standardı zaten kullanıyor."
category: "ai"
tags: ["claude", "mcp", "ai-agents", "open-source"]
publishedAt: "2026-10-23"
seoTitle: "Agent Skills Linux Foundation'a Bağışlandı: Ne Değişiyor?"
seoDescription: "Anthropic, 22 Ekim 2026'da Agent Skills standardını Agentic AI Foundation'a bağışladı. Kapsamı, yeni bakım modeli ve güvenlik durumunu anlatıyoruz."
---

Kısa cevap: Anthropic, 22 Ekim 2026'da Agent Skills standardının adını, logosunu, GitHub organizasyonunu ve agentskills.io alan adını Linux Foundation çatısındaki Agentic AI Foundation'a (AAIF) bağışladı. Aralık 2025'te açık standart olarak yayımlanan Agent Skills'i şu an 70'ten fazla platform (ChatGPT, Cursor, GitHub Copilot, VS Code dahil) destekliyor; bugüne kadar 1 milyon skill yayımlandı ve yaklaşık 280 milyon kez kuruldu.

## Agent Skills nedir?

Agent Skills, bir AI ajanına belirli bir görevi nasıl yapacağını adım adım öğreten bir klasör standardı: bir `SKILL.md` dosyası, gerekirse yanına eklenen betikler ve referans materyalinden oluşuyor. Anthropic bu formatı Claude Code'u geliştirirken ortaya çıkan bir ihtiyaçtan türetti — genel model yeteneği, gerçek iş görevlerinin gerektirdiği prosedürel ayrıntıyı (hangi dosyaya bakılacağı, hangi sırayla ilerleneceği, hangi komutun çalıştırılacağı) tek başına kapsamıyordu. Tipik bir skill klasörü şöyle görünüyor:

```text
pdf-fatura-isleme/
  SKILL.md
  scripts/
    parse_invoice.py
  reference/
    vergi-kodlari.md
```

Bu yapı kasıtlı olarak basit tutulmuş: `SKILL.md` dosyası ajan için bir talimat kağıdı gibi çalışıyor, betikler o talimatları uygularken çağrılabilecek somut araçları, referans dosyaları ise ajanın ihtiyaç duyduğunda bakabileceği uzun bilgiyi taşıyor. Format hâlâ [agentskills.io](https://agentskills.io) adresinde yayımlı kalıyor; bağıştan sonra değişen domain'in sahibi, içeriği değil.

## Bağış tam olarak ne zaman oldu ve neyi kapsıyor?

Anthropic bağışı [22 Ekim 2026'da kendi haber sayfasında duyurdu](https://www.anthropic.com/news/donating-agent-skills-to-the-agentic-ai-foundation). Bağış üç somut unsuru içeriyor: Agent Skills adı ve logosu, standardın GitHub organizasyonu ve agentskills.io alan adı. AAIF, Anthropic'in Model Context Protokolü'nü (MCP) 2025'te bağışladığı vakfın aynısı; vakıf bir önceki yıl Anthropic, Block ve OpenAI tarafından birlikte kuruldu ve Linux Foundation çatısı altında çalışıyor. Yani bu, AAIF'in ilk büyük bağışı değil — standart tek bir şirketin elinde başlayıp zamanla ortak yönetişime geçen, artık tekrarlanan bir örüntü.

| | Bağıştan önce | Bağıştan sonra |
| --- | --- | --- |
| Standardın sahibi | Anthropic | Agentic AI Foundation (Linux Foundation) |
| Bakımcılar | Anthropic ekibi | Anthropic, Google, OpenAI mühendisleri (bireysel kapasitede) |
| Lead Maintainer | Atanmamış | David Soria Parra, Mahesh Murag |
| Değişiklik süreci | Anthropic'in kararı | Planlanan: resmi teklif (proposal) süreci |
| Üyelik gereksinimi | — | Kullanım ve katkı için AAIF üyeliği gerekmiyor |

## AAIF'e üye olmadan Agent Skills kullanabilir miyim?

Evet. Anthropic açıkça belirtiyor: geliştiriciler ve şirketler Agentic AI Foundation'a üye olmadan standardı kullanmaya ve katkı sağlamaya devam edebilir. Bağışın amacı erişimi kısıtlamak değil, standardın geleceğine kimin karar verdiğini tek bir şirketten çıkarıp paylaşılan bir yönetişim yapısına taşımak.

## Bu bağış MCP ile nasıl ilişkili?

Agent Skills bağışı, Anthropic'in izlediği aynı modelin ikinci uygulaması. Anthropic 2025'te [MCP'nin kendisini AAIF'e bağışlamıştı](/tr/posts/mcp-2026-07-28-guncellemesi) ve [ilk MCP bağlayıcınızı yazmayı](/tr/posts/ilk-mcp-baglayicini-yaz-2026) konu alan rehberimizde bu protokolün nasıl çalıştığını ayrıntılı anlatmıştık. MCP bir ajanın *hangi araçlara* erişebileceğini standartlaştırırken, Agent Skills bir ajanın *bir görevi nasıl* yapacağını standartlaştırıyor — ikisi tamamlayıcı, rakip değil. [Her yapay zeka asistanının artık "skills" kullanmasının nedenlerini](/tr/posts/yapay-zeka-skills-yakinsamasi) ele aldığımız yazıda bu yakınsamanın arkasındaki itici gücü incelemiştik; bu bağış o yakınsamanın kurumsal bir adım sonrası.

## Skill güvenliği ne durumda?

Burada iyimser olmak için acele etmeyin. Güvenlik şirketi Snyk, Şubat 2026'da yayımladığı ["ToxicSkills" araştırmasında](https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/) ClawHub ve skills.sh dizinlerindeki 3.984 skill'i taradı: bunların %13,4'ü (534 skill) kötü amaçlı yazılım dağıtımı, prompt injection saldırısı veya açığa çıkmış kimlik bilgisi (secret) gibi kritik seviyede bir güvenlik açığı içeriyordu. Herhangi bir ciddiyet seviyesinde en az bir açığı olan skill oranı ise %36,82 (1.467 skill). Snyk bu ekosistemi, "erken dönem npm ve PyPI'ye benzer ama kimlik bilgilerine, dosya sistemine ve API'lere eşi görülmemiş erişimle" tanımlıyor; çünkü bir skill çalıştırıldığında genelde kabuk (shell) erişimi, dosya sistemi erişimi ve bazen de kalıcı bellek erişimi alıyor — bu da kötü niyetli bir skill'i tek seferlik bir saldırıdan çok, kalıcı bir içeriden tehdide dönüştürüyor. Anthropic'in duyurusu, güvenlik rehberliğini AAIF'in yol haritasına koyuyor ama bunu henüz yayımlamadı — [skill ve eklenti güvenlik taramasını](/tr/posts/claude-skill-plugin-guvenlik-taramasi) ele aldığımız yazıda önerdiğimiz manuel kontrol adımları, bu rehberlik gelene kadar geçerliliğini koruyor.

## AAIF'in yol haritasında başka ne var?

Anthropic'in duyurduğu plan dört başlıkta toplanıyor: sürümlenmiş (versioned) yayınlar, resmi bir değişiklik teklifi süreci, skill yazan ve kuran herkes için güvenlik rehberliği ve topluluğun geri bildirimini toplamak için standardın Discord sunucusunun kullanılması. Bu yapı, MCP'nin AAIF'e geçişinde izlenen şeffaf karar alma modelinin birebir tekrarı; MCP'de de önce topluluk teklif sürecine geçildi, sonra sürümlenmiş yayın takvimi oturdu. Agent Skills'in versiyon numarası henüz 1.0'ın altında seyrediyor, bu da formal teklif sürecinin devreye girmesiyle birlikte yakın zamanda breaking change riski taşıyan değişikliklerin daha kontrollü ilerleyeceği anlamına geliyor.

## Bu değişiklik Claude Code kullanıcıları için ne anlama geliyor?

Günlük kullanımda hemen hissedilecek bir şey yok: mevcut skill'leriniz, `SKILL.md` formatı veya Claude Code'un skill'leri çalıştırma şekli değişmiyor. Değişen şey, format üzerindeki kararların artık Anthropic'in iç yol haritasına değil, AAIF'in açık teklif sürecine bağlı olması. Pratik sonucu şu: bir sonraki büyük format değişikliği geldiğinde, bunu ilk duyuran taraf yine Anthropic olabilir ama kararı tek başına Anthropic vermiyor — Google ve OpenAI mühendisleri de masada.

Açıkçası bu bağış, Anthropic'in kendi ürün avantajını gevşetme konusunda tutarlı bir tercih ortaya koyuyor: MCP'nin ardından Agent Skills'i de dışarı çıkarmak, standardı "Anthropic'in formatı" olmaktan çıkarıp ekosistemin ortak formatı yapıyor. Ama güvenlik rehberliği hâlâ bir yol haritası satırı, yayımlanmış bir belge değil — bu da bugün bir skill kurarken kaynağını tek tek kontrol etmeyi hâlâ sizin sorumluluğunuzda bırakıyor.

Rakamlar da bu tercihin boşuna olmadığını gösteriyor: Aralık 2025'teki yayımından bu yana geçen on ay içinde 1 milyon skill ve 280 milyon kurulum, format tek bir şirketin elinde kalsa büyümesi zor olacak bir ölçek. Bir standardın bu kadar hızlı büyümesi, genelde onu "kimin kontrol ettiği" sorusunu da aynı hızda büyütüyor; Anthropic'in bu soruyu bağış yoluyla şimdiden yanıtlaması, rekabet eden platformların (özellikle OpenAI ve Google) formatı kendi ekosistemlerine daha rahat entegre etmesini kolaylaştırıyor. Kısa vadede geliştirici için pratik fark küçük, ama orta vadede bu, formatın tek bir şirketin stratejik kararlarına bağlı kalmaktan çıkıp bağımsız, çok taraflı bir endüstri standardına dönüşmesi anlamına geliyor — MCP'nin izlediği yolun aynısı.

## Sıkça Sorulan Sorular

### Agent Skills nedir, kısaca?

Agent Skills, bir AI ajanına belirli bir görevi nasıl yapacağını öğreten `SKILL.md` dosyası ve destekleyici betik/referans dosyalarından oluşan bir klasör standardı. Anthropic tarafından Claude Code için geliştirildi, Aralık 2025'te açık standart olarak yayımlandı ve şu anda 70'ten fazla platform tarafından destekleniyor.

### AAIF'e katılmadan Agent Skills kullanabilir miyim?

Evet. Anthropic'in duyurusu, standardı kullanmak veya ona katkı vermek için Agentic AI Foundation'a üye olmanın gerekmediğini açıkça belirtiyor. Bağış, erişimi kısıtlamak yerine standardın yönetişimini tek bir şirketten paylaşılan bir vakfa taşımak için yapıldı.

### Agent Skills ile MCP arasındaki fark ne?

MCP (Model Context Protocol), bir AI ajanının hangi araçlara ve veri kaynaklarına erişebileceğini standartlaştırıyor; Agent Skills ise ajanın belirli bir görevi hangi adımlarla yapacağını standartlaştırıyor. İkisi birbirini tamamlıyor ve artık aynı vakıf (AAIF) altında yönetiliyor.

### Hangi platformlar Agent Skills'i destekliyor?

Anthropic'in Ekim 2026 duyurusuna göre ChatGPT, Cursor, GitHub Copilot ve VS Code dahil 70'ten fazla platform, Aralık 2025'teki yayımından bu yana Agent Skills'i entegre etti. Bugüne kadar 1 milyon skill yayımlandı ve yaklaşık 280 milyon kez kuruldu.
