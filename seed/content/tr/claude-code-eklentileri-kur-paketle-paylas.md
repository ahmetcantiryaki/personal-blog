---
title: "Claude Code Eklentileri: Kur, Paketle, Paylaş"
slug: "claude-code-eklentileri-kur-paketle-paylas"
translationKey: "claude-code-plugins-marketplace-guide"
locale: "tr"
excerpt: "Kısa cevap: bir Claude Code eklentisi komutları, alt ajanları, skill'leri ve hook'ları tek pakette birleştirip bir marketplace üzerinden başkalarına dağıtır."
category: "ai"
tags: ["claude", "mcp", "open-source", "developer-experience"]
publishedAt: "2026-09-06"
seoTitle: "Claude Code Eklentisi Nasıl Yapılır, Paylaşılır? (2026)"
seoDescription: "Claude Code plugin.json nasıl kurulur, yerel test nasıl yapılır, kendi marketplace'in nasıl yayınlanır? 200'ü aşan resmi eklenti verisiyle adım adım rehber."
---

Kısa cevap: bir Claude Code eklentisi (plugin), komutları, alt ajanları (subagent), skill'leri, hook'ları ve MCP/LSP sunucularını `plugin.json` etrafında tek bir pakette toplar. Tek bir skill'i `~/.claude/skills` altına atmaktan farkı, bunu bir marketplace repo'su üzerinden tek komutla başkalarına dağıtabilmen; skill elle kopyalanır, eklenti ise otomatik kurulur.

## Eklenti, tek bir skill'den nasıl farklı?

`~/.claude/skills` altına attığın tek bir skill, yalnızca senin makinende çalışan ve elle kopyalanması gereken bir metin dosyasıdır. Bir eklenti ise skill'i, komutu, alt ajanı, hook'u ve MCP sunucusunu birlikte paketleyip [`/plugin marketplace add`](https://code.claude.com/docs/en/discover-plugins) ile tek komutla kurulabilir hale getirir. Fark, taşınabilirlikte: bir skill paylaşmak için dosyayı elle göndermen gerekir, bir eklenti paylaşmak için tek yapman gereken marketplace repo'nun linkini vermek. Tek bir skill'i GitHub üzerinden paylaşmanın yolunu [Claude Skill'lerini GitHub'da Barındırmak](/tr/posts/claude-skill-github-barindirma) yazımızda ele almıştık; eklenti bu yaklaşımın bir üst seviyesi.

## Bir eklentinin içinde tam olarak neler olabilir?

Bir Claude Code eklentisi beş farklı bileşen türünü aynı pakette taşıyabilir; hepsini kullanmak zorunda değilsin, ihtiyacın olanı eklersin.

| Bileşen | Ne işe yarar |
|---|---|
| Komutlar (`/komut-adi`) | Tekrarlayan işlemleri tek satırlık kısayola indirger |
| Alt ajanlar (subagent) | Belirli bir görev için ayrı bağlam ve araç setiyle çalışan yardımcı ajan |
| Skill'ler | Belirli bir görev türü için hazır talimat ve örnek seti |
| Hook'lar | Belirli olaylarda (araç çağrısından önce/sonra gibi) otomatik tetiklenen betikler |
| MCP / LSP sunucuları | Harici veri veya dil sunucusu bağlantısı sağlayan araçlar |

[2026'nın Nisan ayında gelen bir güncellemeyle](https://code.claude.com/docs/en/changelog) hook'lara yeni bir tür eklendi: `mcp_tool` tipi, bir hook'un alt süreç veya kimlik doğrulama derdi olmadan doğrudan bağlı bir MCP sunucusunun aracını çağırmasına izin veriyor. Bu, eklenti içindeki hook'ları MCP sunucularıyla doğrudan konuşturmak isteyenler için önemli bir kısayol; öncesinde bu bağlantıyı kurmak için ayrı bir betik yazıp kimlik bilgilerini o betiğe elle taşıman gerekiyordu, şimdi hook tanımının kendisi bu işi üstleniyor.

## plugin.json nasıl oluşturulur?

Bir eklentinin köküne `.claude-plugin/plugin.json` dosyası koyman yeterli; Claude Code bu dosyayı okuyup eklentinin adını, sürümünü ve hangi bileşenleri içerdiğini anlar.

```json
{
  "name": "deploy-yardimcisi",
  "version": "1.0.0",
  "description": "Deploy oncesi kontrol listesini calistiran komut ve hook seti",
  "commands": ["./commands/deploy-check.md"],
  "hooks": ["./hooks/pre-deploy.json"]
}
```

Bu dosya, klasördeki `commands/`, `agents/`, `skills/` ve `hooks/` alt dizinlerini eşleştiren bir haritadır; her bileşen kendi dosyasında yaşar, `plugin.json` sadece bunları birbirine bağlar. Tipik bir klasör yapısı şöyle görünür:

```text
deploy-yardimcisi/
├── .claude-plugin/
│   └── plugin.json
├── commands/
│   └── deploy-check.md
├── hooks/
│   └── pre-deploy.json
└── agents/
    └── deploy-reviewer.md
```

Her komut dosyası (`commands/deploy-check.md`), Markdown formatında yazılmış bir talimat setidir; komutu çağırdığında Claude Code bu dosyanın içeriğini doğrudan bağlama okur. Yani bir komut yazmak, ayrı bir programlama dili öğrenmek değil, iyi yapılandırılmış bir talimat metni yazmak demek.

## Eklentini yayınlamadan önce yerel olarak nasıl test edersin?

Eklenti klasörünü doğrudan yerel bir yoldan yükleyerek marketplace'e hiç dokunmadan test edebilirsin; bu, henüz bir Git deposu bile açmadan ilk taslağı hızlıca doğrulamak isteyenler için en pratik yol. Klasörü `/plugin marketplace add ./yerel-klasorum` ile ekleyip ardından `/plugin install <eklenti-adi>` çalıştırman, gerçek bir repo yayınlamadan komutların, hook'ların ve alt ajanların beklendiği gibi çalıştığını doğrulamana yeter. Bir hata varsa, önce `plugin.json` içindeki dosya yollarının gerçekten var olup olmadığını kontrol et; en sık hata burada çıkıyor, çünkü göreli bir yol yanlışlıkla yanlış klasöre işaret ettiğinde Claude Code bunu sessizce atlıyor, açık bir hata mesajı vermiyor.

Yakın zamanda düzeltilen bir güvenlik açığı da test aşamasında akılda tutulmalı: proje kökü dışına sızabilen sembolik bağlantı (symlink) yolları artık çözülüp istenen yolun izinli depo içinde kalıp kalmadığı doğrulanıyor. Kendi eklentini paylaşmadan önce, içindeki dosya yollarının hiçbirinin `../` ile depo dışına çıkmadığından emin ol.

## Kendi marketplace'ini nasıl yayınlarsın?

Bir marketplace, aslında kök dizininde `.claude-plugin/marketplace.json` bulunan sıradan bir Git deposudur; bu dosya, deponun barındırdığı eklentilerin bir listesini ve her birinin klasör yolunu tutar:

```json
{
  "name": "ekip-marketplace",
  "plugins": [
    {
      "name": "deploy-yardimcisi",
      "source": "./deploy-yardimcisi"
    }
  ]
}
```

Kendi ekibin veya açık kaynak topluluğun için bir marketplace açmak istiyorsan, tek yapman gereken bu listeyi güncel tutmak ve deponu herkese açık (veya kurumsal olarak kısıtlı) bir yerde barındırmak. Yeni bir eklenti eklemek, listeye tek bir satır eklemek kadar basit; deponun geri kalanı zaten var olan klasör yapısını izliyorsa ekstra bir yapılandırma gerekmiyor.

Resmi Anthropic marketplace'i, Temmuz 2026 itibarıyla 200'ü aşan eklenti barındırıyor; bunun yaklaşık yirmisi Anthropic'in kendi geliştirdiği birinci parti eklentiler (dev-workflow araçları, frontend-design, skill-creator gibi), geri kalanı ise incelemeden geçmiş ortak entegrasyonları. Kendi marketplace'ini kurarken bu oranı örnek almak makul: az sayıda, iyi test edilmiş eklenti; büyük ve bakımsız bir liste değil.

## /plugin marketplace add ile kurulum nasıl işler?

Bir kullanıcı olarak bir marketplace'e katılmak tek komut: `/plugin marketplace add <repo-url>`. Bu komut, belirttiğin Git deposundaki `marketplace.json` dosyasını okuyup mevcut eklentileri Claude Code'un `/plugin` menüsüne ekler; ardından `/plugin install <eklenti-adi>` ile istediğin eklentiyi tek tek kurarsın. Kurumsal ortamda bu akışı kısıtlamak istiyorsan, [Claude Code'un MCP sunucu erişimini merkezi yönetmesi](/tr/posts/claude-code-mcp-sunucularini-nasil-yonetirsin) yazımızdaki `managed-mcp.json` mantığına benzer bir yönetilen marketplace kısıtlaması da mevcut; sadece onaylanmış marketplace'lerden kurulum yapılmasını zorunlu kılabilirsin.

Görüşüm: bir eklentiyi tek bir dev script'inden ayıran şey kod kalitesi değil, `plugin.json`'ın ne kadar az varsayımla yazıldığı. Sabit yol varsayan, ortam değişkeni beklemeyen bir eklenti başka bir ekipte anında bozulur. [Claude Code subagent ve arka plan ajanları](/tr/posts/claude-code-subagent-arka-plan-ajanlari) yazımızdaki taşınabilirlik prensipleri burada da geçerli.

Bu yüzden bir eklentiyi paylaşmadan önce, onu kendi makinenden başka bir makinede -tercihen temiz bir kullanıcı hesabıyla- test etmek küçük bir yatırım ama büyük bir güvence. Kendi `~/.claude` dizinindeki özel ayarlara veya önceden kurulu bir MCP sunucusuna sessizce bağımlı bir eklenti, sende sorunsuz çalışıp başka bir geliştiricide anında patlar; bu sınıf hatalar genelde `plugin.json` incelemesiyle değil, gerçek bir kurulum denemesiyle yakalanır.

## Eklentini güncellerken nelere dikkat etmelisin?

`plugin.json` içindeki `version` alanını her değişiklikte artır; kullanıcıların hangi sürümü çalıştırdığını görebilmesi ve bir sorunda hangi değişikliğin neden olduğunu geriye dönük izleyebilmesi için bu şart. Küçük bir düzeltme (bir komutun yazım hatasını gidermek gibi) için son basamağı, yeni bir bileşen eklemek için orta basamağı, mevcut bir komutun davranışını kırıcı şekilde değiştirmek için ilk basamağı artırmak makul bir kural.

Bir eklentiyi marketplace üzerinden güncellemek, deponun ana dalına yeni bir commit atmaktan ibaret; kullanıcı tarafında ekstra bir adım yok, çünkü `/plugin marketplace add` ile bağlanan kullanıcılar sonraki güncellemede otomatik olarak yeni sürümü çeker. Kırıcı bir değişiklik yapıyorsan, bunu eklentinin `README` dosyasında açıkça belirtmek, kullanıcıların sürpriz bir davranış değişikliğiyle karşılaşmasını önler.

## Sıkça Sorulan Sorular

### Claude Code eklentisi ile MCP sunucusu arasındaki fark nedir?

Bir MCP sunucusu tek başına harici bir veri veya araç bağlantısı sağlar; bir eklenti ise MCP sunucusunu, komutları, hook'ları ve alt ajanları tek bir kurulabilir pakette birleştiren üst kattır. Bir eklenti içinde sıfır, bir veya birden fazla MCP sunucusu olabilir.

### Kendi eklentimi resmi marketplace'e nasıl eklerim?

Resmi marketplace'e eklenme süreci Anthropic'in inceleme kriterlerinden geçmeyi gerektirir; bunun yerine kendi Git deponda bir `marketplace.json` yayınlayıp ekibine veya topluluğuna doğrudan `/plugin marketplace add <repo-url>` linkini paylaşmak çok daha hızlı bir yol ve inceleme sürecini beklemeden bugün kullanıma açılabiliyor.

### Eklentimde hook kullanmak güvenli mi?

Evet, ama hook'lar sistem komutları çalıştırabildiği için yalnızca güvendiğin kaynaklardan eklenti kur. `mcp_tool` tipi hook'lar, alt süreç başlatmadığı için doğrudan komut çalıştıran hook'lara göre daha küçük bir saldırı yüzeyine sahip.

### Eklenti kurulumunda "symlink" hatası alırsam ne yapmalıyım?

Bu genelde `plugin.json` içindeki bir dosya yolunun depo kökü dışına çıkmaya çalıştığı anlamına gelir; güvenlik düzeltmesi bu tür yolları artık reddediyor. Eklentindeki tüm yolların depo içinde kalan göreli yollar olduğunu kontrol et.
