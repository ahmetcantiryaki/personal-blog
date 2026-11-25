---
title: "Claude Code'da MCP Sunucu Skill'leri Nedir?"
slug: "claude-code-mcp-sunucu-skilleri"
translationKey: "claude-code-mcp-server-skills-2026"
locale: "tr"
excerpt: "Claude Code 2.1.332'de MCP sunucuları Skill sunabiliyor; / menüsünde server:skill olarak görünüyor, tek bağlantı tool ve Skill'i birlikte veriyor."
category: "ai"
tags: ["claude", "mcp", "ai-tools", "automation"]
publishedAt: "2026-11-25"
seoTitle: "Claude Code MCP Sunucu Skill'leri (Beta)"
seoDescription: "Claude Code 2.1.332, MCP sunuculardan Skill özelliğini (beta) ekliyor: tek bağlantı tool ve Skill'i birlikte sunuyor, / menüsünde server:skill olarak görünüyor."
---

Kısa cevap: 25 Kasım 2026'da çıkan Claude Code 2.1.332 ile bir MCP (Model Context Protocol) sunucusu artık sadece tool değil, kendi Skill'ini de sunabiliyor. Bunlar `/` menüsünde `server:skill` biçiminde görünüyor — örneğin `jira:triage-ticket` — yani tek bir MCP bağlantısı artık hem çağrılabilir tool'ları hem hazır, tekrar kullanılabilir iş akışlarını birlikte veriyor.

## Claude Code 2.1.332'de tam olarak ne değişti?

Bu sürümden önce Skill'ler yalnızca iki yerden geliyordu: makinenizdeki bir klasörden (`~/.claude/skills/`) veya bir marketplace'ten kurduğunuz bir plugin'den. Tool'lar ise ayrı bir şeydi; bir MCP sunucusundan, açık [Model Context Protocol](https://modelcontextprotocol.io) üzerine kurulu bir bağlantıdan geliyordu. 2.1.332, bu iki yolu ilk kez birleştiriyor: bir MCP sunucusu artık tool'larının yanında bir Skill de sunabiliyor ve Claude Code bunu yerel bir Skill gibi yüklüyor, sadece sunucunun adıyla bir isim alanına ayrılmış olarak. Jira MCP bağlantısının sunduğu `triage-ticket` adlı bir Skill, `/` menüsünde `jira:triage-ticket` olarak görünürken, kendi kurduğunuz bir Skill düz adını koruyor — hangi Skill'in nereden geldiği konusunda hiçbir karışıklık yok.

## Sunucudan gelen bir Skill, kendi kurduğunuzdan nasıl farklı?

Yerel bir Skill, sizin veya bir plugin geliştiricisinin yazdığı bir dosyadır ve sadece siz düzenlediğinizde veya bir plugin güncellemesi çektiğinizde değişir. Sunucudan gelen bir Skill ise Claude Code o sunucuyla her konuştuğunda MCP bağlantısı üzerinden çekiliyor; yani sunucunun geliştiricisi Skill'in talimatlarını kendi tarafında güncelleyebiliyor ve bağlı her istemci bir sonraki oturumda bu değişikliği otomatik alıyor — ayrı bir kurulum adımı yok, elle takip edilecek bir sürüm yok.

| | Yerel skill | MCP sunucu skill'i (beta) |
|---|---|---|
| Nerede yaşıyor | `~/.claude/skills/` veya bir plugin | Bağlı olduğunuz MCP sunucusu |
| `/` menüsündeki adı | Kendi adı | `server:skill` |
| Güncelleme yolu | Siz düzenlersiniz veya plugin güncellenir | Sunucu tarafında; sonraki bağlantıda alınır |
| İçeriği kim kontrol ediyor | Siz veya plugin geliştiricisi | MCP sunucusunun geliştiricisi |
| Yüklenirken shell komutu kontrolü | `PreSkillShellCommand` ile | Aynı hook ile |

## Bu değişiklik ekiplerin AI araç dağıtımını nasıl değiştiriyor?

Şimdiye kadar geliştiricilere hem bir tool (örneğin "dahili ticket API'mizi sorgula") hem de onu doğru kullanmanın yolunu (örneğin "bir ticket'ı nöbetçi ekibimizin beklediği gibi triyaj et") vermek isteyen bir ekip, iki ayrı şey göndermek zorundaydı: tool için bir MCP sunucusu, iş akışı için ise genelde kendi başına bir plugin olarak kurulan bir Skill. Artık tek bir MCP bağlantısı ikisini birden kapsıyor; bu en çok dahili araç ekipleri için önemli: bir sunucu yayınlıyorsunuz ve ona bağlanan herkes aynı adımda hem tool'u hem şirket içi iş akışını alıyor, zaten birlikte sürümlenmiş olarak — birbirinden ayrı sürüklenip gidebilecek iki şey yerine.

## Yeni `PreSkillShellCommand` hook'u nedir ve neden bununla eşleşiyor?

`PreSkillShellCommand`, yine 2.1.332'de eklenen bir hook event'i; bir Skill'in veya komutun satır içi shell komutlarını, Skill yüklenirken — hiçbiri çalışmadan önce — reddedebiliyor. 2.1.331 ve öncesinde bu hook'u adlandıran bir settings dosyası, gerçekten bir şeyi kısıtlamak yerine sadece başlangıçta bir onay diyaloğu açıyordu. Bu eşleşme önemli, çünkü MCP sunucu skill'leri gerçekten yeni bir güven sınırı getiriyor: yüklediğiniz bir Skill eskiden kendi dosya sisteminizden veya denetlenmiş bir plugin marketplace'inden geliyordu, şimdi ise bağlandığınız herhangi bir MCP sunucusundan gelebiliyor. `PreSkillShellCommand`, bir güvenlik ekibine, üçüncü taraf bir sunucunun Skill'inin yüklenirken çalıştırmaya çalıştığı bir shell komutunu — önceden Skill'in kaynağını okumuş olmaya güvenmek yerine — denetleyip engelleyebileceği tek bir kontrol noktası veriyor.

## MCP sunucu skill'lerini bugün nasıl denersiniz?

Özellik beta — Anthropic'in kendi changelog'u bunu açıkça belirtiyor — bu yüzden sunan taraf henüz tutarsız: sadece geliştiricisi skill-sunma kısmını uygulamış bir MCP sunucusu bunu gösteriyor ve Kasım 2026 sonu itibarıyla çoğu sunucu bunu henüz yapmıyor. Elinizde ne olduğunu görmek için bir sunucuya bağlanın ve `/` menüsüne bakın — sunucudan gelen bir Skill, `server:skill` isimlendirmesiyle hemen fark ediliyor. Eğer [şirket araçlarınız için dahili bir MCP sunucusu](/tr/posts/sirket-araclariniz-icin-ozel-mcp-sunucusu) işletiyorsanız, şimdi ekibinizin iç iş akışlarını mevcut tool'larınızın yanına Skill olarak paketlemenin değip değmeyeceğine bakmanın zamanı — bunu yaparsanız, sunucuya bağlanan yeni bir ekip arkadaşına ayrıca "bir de şunu X için kur" demek zorunda kalmıyorsunuz.

Settings içinde başlangıç için minimal bir `PreSkillShellCommand` kontrolü:

```json
{
  "hooks": {
    "PreSkillShellCommand": [
      {
        "matcher": "server:*",
        "hooks": [{ "type": "command", "command": "./scripts/vet-skill-shell.sh" }]
      }
    ]
  }
}
```

## Bunu somut bir örnekle düşünürsek nasıl görünür?

Şirket içi bir DevOps ekibinin Kubernetes dağıtımları için bir MCP sunucusu işlettiğini düşünün. 2.1.332'den önce bu ekip iki şey yayınlamak zorundaydı: dağıtım durumunu sorgulayan ve rollback tetikleyen tool'ları sunan bir MCP sunucusu ile "bir rollback'i ne zaman tetikleyeceğinizi" anlatan, ayrı bir plugin olarak paketlenmiş bir Skill. Yeni bir geliştirici işe başladığında, sunucuya bağlanmak yetmiyordu; birinin ona "bir de şu plugin'i kur" demesi gerekiyordu ve bu adım sıklıkla unutuluyordu. Şimdi aynı ekip tek bir MCP sunucusu yayınlayabiliyor; `k8s:rollback-runbook` gibi bir Skill, sunucunun tool'larıyla aynı bağlantıdan geliyor ve kimse ayrıca hatırlatmak zorunda kalmıyor. Ekip runbook'u güncellediğinde, değişiklik sunucu tarafında bir kez yapılıyor ve bağlı her istemci bir sonraki oturumda otomatik olarak güncel sürümü görüyor — yirmi farklı geliştiricinin yirmi farklı plugin sürümünde kalmasını önleyen tam olarak bu mekanizma.

## Hâlâ beta olduğu için neye dikkat etmelisiniz?

Sunucudan gelen bir Skill'e, kontrol etmediğiniz bir registry'den gelen bir bağımlılık gibi davranın: shell erişimiyle bir şey çalıştırmasına izin vermeden önce gerçekte ne yaptığını okuyun ve `server:skill` isim alanının tek başına sizi koruduğunu düşünmeyin — bu size Skill'in nereden geldiğini söyler, güvenli olup olmadığını söylemez. Bu özelliği yayınlayan Kasım ayı sürümleri, başka yerlerde de ilgisiz korkulukları sıkılaştırdı — [Claude Code'un sandbox bash izinleri](/tr/posts/claude-code-sandbox-bash-izinleri) ve [restricted modu](/tr/posts/claude-code-restricted-mode-nedir) aynı geniş yönün parçası: bir Skill'in veya tool'un shell'inize veya dosya sisteminize dokunan her şeyinden önce daha fazla onay.

Dürüst görüşüm: 2.1.332'nin içine gömülü Skill'le ilgili iki değişiklikten ilginç olanı bu — "sunucudan skill" kendi başına heyecan verici olduğu için değil, sessizce ekiplerin Skill'lerle yaşadığı asıl dağıtım sorununu çözdüğü için: bu sorun hiçbir zaman Skill yazmak değildi, yirmi kişinin kurulumunu tek doğru sürümle senkron tutmaktı.

Birincil kaynak: [Claude Code'un değişiklik günlüğü](https://code.claude.com/docs/en/changelog).

## Sıkça Sorulan Sorular

### Claude Code'a MCP sunuculardan Skill özelliğini hangi sürüm ekledi?

25 Kasım 2026'da çıkan Claude Code 2.1.332, MCP sunuculardan Skill'leri beta özellik olarak ekledi. Bunlar `/` menüsünde `server:skill` biçiminde görünüyor, düz adlarını koruyan yerel olarak kurulmuş Skill'lerden ayrı.

### MCP sunucu skill'leri Claude Code plugin'lerinden nasıl farklı?

Bir plugin bir kez kurduğunuz ve elle veya bir marketplace üzerinden güncellediğiniz bir şeydir; MCP sunucusunun sunduğu bir Skill ise o bağlantı üzerinden çekilir ve sunucunun geliştiricisi değiştirdiğinde, sizin tarafınızda ayrı bir kurulum adımı olmadan güncellenir.

### PreSkillShellCommand tüm MCP sunucu skill'lerini varsayılan olarak engelliyor mu?

Hayır. `PreSkillShellCommand`, kendiniz yapılandırdığınız bir hook event'idir; bir Skill'in satır içi shell komutlarını, Skill yüklenirken inceleyen veya reddeden bir kural yazmanızı sağlar. Bir hook yapılandırılmadığında, bir Skill'in shell komutları 2.1.332'den önceki gibi çalışır.

### MCP sunuculardan Skill özelliği beta dışında mı kullanılabilir?

Henüz değil, 25 Kasım 2026 sürümü itibarıyla. Anthropic'in changelog'u bunu açıkça beta olarak işaretliyor ve bağlandığınız belirli MCP sunucusunun skill-sunma kısmını uygulamış olmasına bağlı — bu yazı itibarıyla çoğu sunucu bunu henüz uygulamadı.
