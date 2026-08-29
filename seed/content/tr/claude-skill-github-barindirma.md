---
title: "Claude Skill'lerini GitHub'da Barındır"
slug: "claude-skill-github-barindirma"
translationKey: "host-claude-skills-on-github"
locale: "tr"
excerpt: "Claude Skill'lerini GitHub'da barındırmak, marketplace.json ve SKILL.md içeren bir depo kurmak, ekibin /plugin marketplace add ile tek komutla kurmasını sağlar."
category: "ai"
tags: ["claude", "automation", "documentation", "best-practices", "open-source"]
publishedAt: "2026-08-29"
seoTitle: "Claude Skill'lerini GitHub'da Barındırma Rehberi (2026)"
seoDescription: "Claude Skill'lerini GitHub'da barındırmak için marketplace.json ve SKILL.md içeren bir depo kur; ekip /plugin marketplace add ile tek komutla kurabilsin."
---

Kısa cevap: Claude Skill'lerini GitHub'da barındırmak için deponun köküne bir `.claude-plugin/marketplace.json` dosyası, her skill için de bir `plugin.json` ve `SKILL.md` eklersin; ekip arkadaşların depoyu `/plugin marketplace add sahip/depo` komutuyla ekleyip skill'i tek satırla kurar. Bu, skill'leri elle kopyala-yapıştır yerine sürümlenmiş, incelenebilir bir pakete dönüştürür.

Bir skill'i sadece kendi makinende tutmakla bir ekibe dağıtmak arasındaki fark, aslında bir depo yapısı meselesi. Doğru üç dosyayı doğru yere koyduğunda Claude Code o depoyu bir "marketplace" olarak tanır.

## Claude Skill Nedir, GitHub'da Barındırmak Neden İşe Yarar?

Claude Skill, Claude'un ihtiyaç anında yüklediği, ne zaman kullanılacağını ve nasıl davranacağını anlatan yeniden kullanılabilir bir talimat paketidir; genelde bir `SKILL.md` dosyası ve isteğe bağlı destek betiklerinden oluşur. [Claude Skills'in ne olduğunu genel hatlarıyla anlattığımız yazıda](/tr/posts/claude-skills-nedir-herkes-icin) kavramı baştan anlatmıştık; burada odak, o skill'i tek başına kullanmaktan çıkarıp bir ekibin ya da topluluğun yeniden kullanabileceği bir pakete dönüştürmek.

GitHub'da barındırmak üç somut şey kazandırır: sürümleme (bir etikete ya da dala sabitleyebilirsin), inceleme (değişiklikler pull request üzerinden geçer) ve yeniden kullanım (aynı depoyu birden fazla proje ya da ekip arkadaşı ekleyebilir). Yerel bir skill klasörünü Slack'te paylaşmakla aynı depoyu `/plugin marketplace add` ile eklemek arasındaki fark, ikincisinin güncellemeleri otomatik takip etmesi.

## Depo Yapısı Nasıl Olmalı?

Bir marketplace deposu üç seviyeli bir yapı izler: kökte marketplace tanımı, altında bir ya da daha fazla plugin, her plugin'in içinde de bir ya da daha fazla skill.

```text
depo-adi/
├── .claude-plugin/
│   └── marketplace.json
└── plugins/
    └── skill-paketi/
        ├── .claude-plugin/
        │   └── plugin.json
        └── skills/
            └── skill-adi/
                └── SKILL.md
```

`marketplace.json`, deponun adını, sahibini ve içerdiği plugin listesini tanımlar:

```json
{
  "name": "ekip-marketplace",
  "owner": {
    "name": "Ekip Adı",
    "url": "https://github.com/ekip-org"
  },
  "plugins": [
    {
      "name": "skill-paketi",
      "source": "./plugins/skill-paketi",
      "description": "Ekibin ortak kullandığı skill koleksiyonu"
    }
  ]
}
```

`plugin.json`, plugin'in adını, sürümünü ve yazarını taşır; `SKILL.md` ise skill'in asıl gövdesidir — üstte bir `description` alanı, altında ne zaman ve nasıl kullanılacağını anlatan düz metin.

## Depoyu Bir Marketplace Olarak Nasıl Eklersin?

Depoyu bir marketplace olarak eklemek için Claude Code içinde `/plugin marketplace add sahip/depo` komutunu çalıştırırsın; belirli bir dala ya da etikete sabitlemek istiyorsan `sahip/depo@v1.0.0` yazarsın. Marketplace eklendikten sonra tek bir plugin'i kurmak için `/plugin install skill-paketi@ekip-marketplace` yeterli.

| Kaynak türü | Örnek |
| --- | --- |
| Göreli yol | `"./plugins/skill-paketi"` |
| GitHub | `{"source": "github", "repo": "sahip/depo"}` |
| Git URL | `{"source": "url", "url": "https://gitlab.com/ekip/skill.git"}` |
| npm | `{"source": "npm", "package": "@ekip/skill"}` |
| Arşiv (SHA-256 doğrulamalı) | `{"source": "archive", "url": "https://...zip", "sha256": "..."}` |

Paylaşmadan önce depoyu doğrulamak için `claude plugin validate .` komutunu çalıştır; bu komut `marketplace.json` ve `plugin.json` dosyalarındaki şema hatalarını yayımlamadan yakalar.

## Ekip veya Organizasyon Genelinde Nasıl Dağıtılır?

Team veya Enterprise planlarında, marketplace'i organizasyon ayarları üzerinden (Organization settings > Plugins) dağıtabilirsin; bu yol için deponun özel (private) olması ve Claude GitHub App aracılığıyla senkronize edilmesi gerekir. Organizasyon düzeyinde dağıtılan plugin'lerin kaynağı yalnızca göreli yol, GitHub ya da git URL olabilir — npm veya arşiv kaynakları bu yolda desteklenmez.

Bu, bir skill'i tek bir depoda tutup güncellemeleri merkezi olarak yönetmeni sağlar; bir geliştirici yeni bir sürümü etiketlediğinde, o marketplace'i ekleyen herkes güncellemeyi görür.

## Sırlar Depoda Nasıl Dışarıda Tutulur, Güvenlik Taraması Neyi Yakalar?

Sırları depodan uzak tutmanın kuralı basit: `SKILL.md` ya da destek betikleri hiçbir API anahtarı, token ya da kimlik bilgisi içermemeli; bunun yerine ortam değişkeni adına referans ver ve gerçek değeri organizasyonun secret yönetimine bırak. Bir skill'in çalışması için bir anahtar gerekiyorsa, bunu betiğin dokümantasyonunda "şu ortam değişkenini ayarla" şeklinde belirt, asla depoya gömme.

Bunun ötesinde, [Claude'un skill ve plugin güvenlik tarayıcısı](/tr/posts/claude-skill-plugin-guvenlik-taramasi) bir skill'i yayımlamadan önce zararlı komut kalıplarını ve şüpheli dış bağlantıları tarar; GitHub'da barındırdığın bir marketplace'i ekip genelinde dağıtmadan önce bu taramadan geçirmek, resmi doğrulama (`claude plugin validate`) kadar rutin bir adım olmalı. Benim görüşüm şu: bir skill deposunu incelemeden kuran ekip, imzasız bir npm paketini `sudo` ile kuran ekipten farksız risk alıyor.

Bu iki kontrolü (sır taraması ve güvenlik tarayıcısı) bir pull request şablonuna madde olarak eklemek, hatırlamaya güvenmekten daha güvenilir. Bir skill deposu büyüdükçe, "bu değişikliği kim onayladı" sorusunun cevabı da önem kazanıyor; en az bir başka kişinin `SKILL.md` değişikliklerini gözden geçirmesi, tek kişilik bir depoda bile ucuz bir alışkanlık.

Bu disiplinin getirisi, deponun büyüklüğüyle orantılı olarak artıyor: iki kişilik bir ekipte gözden geçirme adımını atlamak nadiren sorun çıkarır, ama yirmi kişinin katkıda bulunduğu bir marketplace'te aynı disiplinsizlik, kimsenin fark etmediği bir güvenlik açığının aylarca yayında kalmasına yol açabilir.

## Bir Skill'i Sürümlemek İçin Hangi Pratikler İşe Yarar?

Bir skill'i sürümlemenin en güvenilir yolu, her önemli değişiklikte `plugin.json`'daki `version` alanını semantik sürümleme kurallarına göre artırıp aynı commit'te bir Git etiketi (`v1.1.0` gibi) oluşturmak. Bu, ekip arkadaşlarının `sahip/depo@v1.1.0` gibi belirli bir sürüme sabitlenmesini, dolayısıyla senin henüz test etmediğin bir değişikliğin herkesin oturumuna sessizce sızmasını engeller.

Pratikte üç adımlık bir döngü işe yarıyor: önce `SKILL.md`'yi değiştir ve kendi oturumunda test et, sonra `claude plugin validate .` ile şema hatalarını yakala, en son değişikliği bir pull request'e taşıyıp gözden geçirilmeden ana dala birleştirme. Küçük ekiplerde bile bu üç adım, "birinin makinesinde çalışıyor ama benimkinde çalışmıyor" tipi hataların çoğunu daha depoya girmeden yakalıyor.

Bir CHANGELOG dosyası tutmak da ucuz ama değerli bir alışkanlık: her sürümde ne değiştiğini tek satırda not etmek, altı ay sonra "bu skill hangi sürümde şu davranışı kazandı" sorusuna dakikalar içinde cevap vermeni sağlıyor. Depoyu büyük bir ekibe ya da topluluğa açıyorsan, bu notlar aynı zamanda bir katkı rehberi yerine de geçiyor.

| Adım | Ne yapılır | Neden önemli |
| --- | --- | --- |
| Test | `SKILL.md`'yi yerel oturumda dene | Yayımlamadan önce davranışı doğrula |
| Doğrula | `claude plugin validate .` çalıştır | Şema hatalarını erken yakala |
| Etiketle | `plugin.json`'da `version`'ı artır, Git etiketi ekle | Ekibin belirli bir sürüme sabitlenmesini sağla |
| Belgele | CHANGELOG'a tek satır ekle | Geçmişi aranabilir tut |

## Sıkça Sorulan Sorular

### Bir Claude Skill'i barındırmak için ayrı bir depo mi gerekir?

Hayır, mevcut bir proje deposunun içine de `.claude-plugin/` ve `plugins/` klasörlerini ekleyebilirsin; ama ekip dışına paylaşacağın, sık güncellenen bir skill koleksiyonu için ayrı, amaca özel bir depo genelde daha temiz bir sürüm geçmişi ve daha az gürültülü bir pull request akışı sağlar.

### /plugin marketplace add ile /plugin install arasındaki fark nedir?

`/plugin marketplace add sahip/depo` bir depoyu marketplace olarak Claude Code'a tanıtır ama hiçbir şey kurmaz; `/plugin install skill-adi@marketplace-adi` ise o marketplace'te tanımlı belirli bir plugin'i asıl kurma adımıdır. Önce marketplace'i eklemen, sonra ondan tek tek plugin kurman gerekir.

### GitHub'da barındırılan bir skill otomatik güncellenir mi?

Hayır, otomatik değil; bir marketplace'i belirli bir sürüme (`@v1.0.0` gibi) sabitlemediysen varsayılan dal üzerinden en güncel içeriği çeker, ama bu çekme işlemi sen `/plugin marketplace add`'i yeniden çalıştırdığında ya da Claude Code marketplace'i yenilediğinde gerçekleşir; sessizce arka planda sürekli senkronize olan bir mekanizma değildir.

### Özel bir GitHub deposundaki skill'leri organizasyon genelinde paylaşabilir miyim?

Evet, Team ya da Enterprise planında organizasyon ayarlarından (Organization settings > Plugins) özel bir depoyu marketplace olarak tanımlayabilirsin; bu senkronizasyon Claude GitHub App üzerinden çalışır ve kaynak türü yalnızca göreli yol, GitHub ya da git URL ile sınırlıdır.
