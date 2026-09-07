---
title: "ant apply Nedir? Claude Ajanlarını Koddan Yönet"
slug: "ant-apply-nedir-claude-ajanlarini-koddan-yonet"
translationKey: "ant-apply-cli-claude-agents-as-code"
locale: "tr"
excerpt: "Kısa cevap: ant apply, Claude Managed Agents kaynaklarını (ajan, ortam, skill, bellek) repodaki dosyalardan API'ye senkronlayan Terraform tarzı bir CLI komutu."
category: "ai"
tags: ["claude", "ai-agents", "infrastructure-as-code", "gitops"]
publishedAt: "2026-09-07"
seoTitle: "ant apply Nedir? Claude Ajanlarını Kod Olarak Yönet"
seoDescription: "Anthropic'in ant apply komutu, Claude Managed Agents kaynaklarını dosyadan API'ye senkronluyor. Kurulum, claude-lock.json ve CI kullanımını anlatıyoruz."
---

Kısa cevap: `ant apply`, Anthropic'in 3 Eylül 2026'da CLI sürüm 1.30.0 ile yayınladığı bir komut. Ajan, ortam, skill, bellek deposu ve zamanlanmış dağıtım gibi Claude Managed Agents kaynaklarını repodaki Markdown/YAML dosyalarından okuyup Claude API'siyle senkronluyor — tıpkı Terraform'un altyapı kaynaklarını `.tf` dosyalarından senkronlaması gibi.

## ant apply tam olarak ne yapıyor?

Her kaynağı bir dosyada tanımlarsın, `ant apply` çalıştırırsın, komutun gösterdiği planı onaylarsın. Komut ardından `claude-lock.json` adlı bir kilit dosyası yazar; bu dosyayı commit ettiğinde bir sonraki çalıştırma aynı kaynakları güncellemeye devam eder, yeniden oluşturmaz. Kilit dosyası her kaynağın API kimliğini, versiyonunu ve hem gönderilen hem API'den dönen içeriğin hash'ini tutar — bu ikili hash, bir dosyanın değiştiğini ya da kaynağın API tarafında elle değiştirildiğini fark etmenin yolu.

Kaynak türünü komut üç sırayla belirliyor: dosyadaki üst düzey bir `type` alanı, dosyanın bulunduğu klasör (`agents/`, `environments/`, `memory_stores/`, `deployments/`) veya kaynak adıyla başlayan dosya adı. Bir skill ise her zaman kökünde `SKILL.md` bulunan bir klasör olmak zorunda; diğer tüm kaynaklar YAML, JSON veya Markdown olarak yazılabilir.

## Bir ajanı ant apply ile nasıl uygularsın?

En basit örnek tek bir ajan dosyası. `agents/summarizer.md` adında bir dosya oluşturup üst bilgisine model ve araç tanımını, gövdesine sistem promptunu yazarsın:

```markdown
---
name: Summarizer
model: claude-opus-5
tools:
  - type: agent_toolset_20260401
---

You are a helpful assistant that writes concise summaries.
```

`ant apply agents/summarizer.md` çalıştırdığında komut önce bir plan gösterir (`+ ./agents/summarizer.md create`), onayını ister, onayladıktan sonra ajanı oluşturur ve kimliğini (`agent_011CYm1BLqPXpQRk5khsSXrs` gibi) `claude-lock.json`'a yazar. Dosyayı bir daha düzenleyip komutu tekrar çalıştırdığında plan artık "create" değil "update" gösterir.

## Kaynaklar birbirine nasıl referans verir?

Bir dosya başka bir kaynağa API kimliği yerine göreli dosya yolu ile referans verir. Örneğin bir reviewer ajanı `skills` alanında `../skills/pr-summary` yazar, bir koordinatör ajan `multiagent.agents` altında `./reviewer.md` listeler, bir dağıtım (deployment) da ajanını, ortamını ve bellek deposunu yol üzerinden adlandırır. `ant apply .` çalıştırıldığında komut bu bağımlılıkları sıraya koyup gerçek kimlikleri otomatik doldurur.

| Kaynak türü | Konum | Dosya biçimi |
|---|---|---|
| Ajan | `agents/` | Markdown (frontmatter + sistem promptu) |
| Ortam | `environments/` | YAML/JSON |
| Bellek deposu | `memory_stores/` | YAML/JSON |
| Zamanlanmış dağıtım | `deployments/` | Markdown (frontmatter + ilk mesaj) |
| Skill | `skills/<ad>/SKILL.md` | Klasör + SKILL.md |

Bir skill referansı GitHub URL'si de olabilir (`https://github.com/<owner>/<repo>/tree/<branch>/<dir>` biçiminde); `ant apply` bu durumda dizini indirip yükler ve çözümlenen commit'e sabitler, `--upgrade` bayrağı verilmedikçe güncellemez.

## CI'da ant apply nasıl çalıştırılır?

Terminal olmadan çalıştığında komut planı yazdırıp durur ve `--yes` bayrağı istenmedikçe uygulama yapmaz — bu, bir CI adımının kazara onay beklemeden takılmasını önlüyor. Anthropic'in önerdiği kalıp şu: ana dalda merge sonrası `ant apply --yes .` çalıştır; pull request'lerde ise sadece planı yazdıran, hiçbir değişiklik yapmayan `ant apply --dry-run .` çalıştır ki inceleyenler değişikliği commit'lenmeden önce görsün.

```bash
# Ana dalda, merge sonrası
ant apply --yes .

# Pull request'te, sadece önizleme
ant apply --dry-run .
```

Güncellenen `claude-lock.json` dosyasını, apply adımı yarıda başarısız olsa bile job'ın sonunda commit etmen gerekiyor; çünkü kısmi bir uygulama bile hangi kaynakların gerçekten oluştuğunu kaydeder. Kimlik doğrulama için sabit bir API anahtarı yerine Workload Identity Federation önerilir — `claude-lock.json`'da kayıtlı organizasyon veya workspace'ten farklısına çözümlenen bir kimlik komut tarafından reddediliyor.

Bu disiplin, [AI ajanlarını CI/CD'ye güvenle bağlamak](/tr/posts/ai-ajanlari-cicd-guvenle-baglamak) yazımızdaki kademeli izin mantığıyla aynı yönde ilerliyor: ajan konfigürasyonu artık kod incelemesinden geçen, versiyonlanan bir varlık.

## ant apply'ın sınırları neler?

Komut, Console'da veya `ant beta:agents create` ile elle oluşturulmuş bir kaynağı "sahiplenemez" — sadece kilit dosyasındaki kaynaklar yönetilir, aynı adı tanımlayan bir dosyayı uygulamak ikinci bir kaynak oluşturur. Bir dosyayı silmek, kaynağı API tarafında silmez; sadece uyarı verir. Kaynağı gerçekten kaldırmak için `--prune` bayrağı gerekiyor. Kaynak Console'da elle değiştirilmiş, arşivlenmiş ya da silinmişse plan `refusing to apply` ile biter; üzerine yazmak istiyorsan `--force` vermen gerekir.

Console'dan **Export as code** ile indirilen bir ajan kendi `claude-lock.json`'ıyla gelir; bunu uygulamak orada oluşturduğun kaynakları günceller — bu da elle başlayıp sonradan koda geçişi mümkün kılıyor.

Bu kod-olarak-yönetim yaklaşımı, [Claude Managed Agents'ın Eylül'de aldığı bütçe ve veri konumu güncellemeleriyle](/tr/posts/claude-managed-agents-butce-danisman-veri-konumu) birlikte platformun kurumsal kullanım için olgunlaştığını gösteriyor: artık hem çalışma zamanı kontrolleri hem de dağıtım süreci production standartlarına yaklaşıyor.

## Günlük geliştirmede ant apply nasıl kullanılır?

Tipik döngü şu: bir ajan dosyasını düzenle, `ant apply` çalıştır, terminalde çıkan planı oku, `y` ile onayla ya da `d` ile alanların tam diff'ini gör. `--dry-run` bayrağı bu planı yazdırıp hiçbir şeyi değiştirmeden çıkar — bir değişikliği commit'lemeden önce ne olacağını görmek için idealdir. `--verbose` ise değişmeyen kaynakları da listeler ve tüm alan değerlerini tam olarak gösterir, bu da bir kaynağın neden "unchanged" göründüğünü anlamak istediğinde işe yarar.

Birden fazla organizasyon ya da workspace ile çalışan bir ekip için `--lock-file <yol>` bayrağı, hangi kilit dosyasının kullanılacağını açıkça belirtmeye yarıyor; komut varsayılan olarak bulunduğun dizinden yukarı doğru bir `claude-lock.json` arıyor, ama birden fazla proje aynı repoda yaşıyorsa bu otomatik arama yanlış dosyayı bulabilir. Anthropic ayrıca aynı anda birden fazla `ant apply` çalıştırmamanı öneriyor, çünkü kilit dosyasının kendisi üzerinde bir eşzamanlılık kilidi yok — iki paralel çalıştırma aynı kaynağı farklı sırayla güncellerse kilit dosyası tutarsız kalabilir.

| Yaklaşım | Ne zaman uygun |
|---|---|
| Console'da elle oluşturma | Tek seferlik deneme, hızlı prototip |
| `ant apply` (yerel) | Geliştirme sırasında hızlı yineleme, tek kişilik değişiklik |
| `ant apply --yes` (CI, merge sonrası) | Ekip çapında, review'dan geçmiş değişikliklerin otomatik uygulanması |
| `ant apply --dry-run` (CI, PR) | İncelemeye planı göstermek, hiçbir şeyi değiştirmeden |

Bu tabloyu okurken önemli olan nokta şu: `ant apply` küçük, tek kişilik bir prototip için gerekli bir yük getiriyor olabilir — dosya yapısı kurmak, kilit dosyasını yönetmek tek bir ajanı Console'dan elle oluşturmaktan daha yavaş. Asıl değeri, ajan sayısı arttıkça ve birden fazla kişi aynı kaynaklara dokunduğunda ortaya çıkıyor: o noktada "kim neyi ne zaman değiştirdi" sorusunun cevabı commit geçmişinde duruyor, ayrı bir denetim kaydına ya da kişisel hafızaya güvenmene gerek kalmıyor.

Bu geçiş noktasını önceden belirlemenin bir yolu da şu: bir ekipte üçten fazla ajan Console'da elle yönetiliyorsa ya da bir ajan konfigürasyonu son bir ayda iki kişi tarafından değiştirildiyse, kod-olarak-yönetime geçmenin maliyeti muhtemelen artık kurulum yükünden düşük demektir.

## Sıkça Sorulan Sorular

### ant apply kullanmak için ne gerekiyor?

CLI sürüm 1.30.0 veya üstü gerekiyor; kurulum ve kimlik doğrulama adımları Claude Platform CLI quickstart dokümanında anlatılıyor. Komutu çalıştırmak için ayrıca bir Claude API kimlik bilgisi (API anahtarı veya Workload Identity Federation) şart.

### ant apply, Claude Code'daki CLAUDE.md'nin yerini mi alıyor?

Hayır, ikisi farklı katmanda çalışıyor. CLAUDE.md, Claude Code'a bir repoyu nasıl ele alacağını anlatan bir talimat dosyası; `ant apply` ise Claude Managed Agents platformundaki ajan, ortam ve dağıtım gibi API kaynaklarını yönetiyor. Bir ekip her ikisini birden kullanabilir.

### claude-lock.json'ı commit etmezsem ne olur?

Bir sonraki `ant apply` çalıştırması dosyaları yeniden okur ve kilit dosyasında karşılığını bulamadığı her kaynağı sıfırdan oluşturur — bu da aynı ajanın veya ortamın kopyalarının birikmesine yol açar. Kilit dosyasını commit etmek, komutun mevcut kaynakları güncellemesini garanti eder.

### ant apply mevcut, elle oluşturulmuş bir ajanı yönetime alabilir mi?

Hayır, doğrudan alamaz. Komut sadece kendi oluşturduğu ve kilit dosyasına kaydettiği kaynakları takip ediyor; Console'da veya `ant beta:agents create` ile oluşturulmuş bir ajanı aynı adla tanımlayan bir dosya uygularsan ikinci bir ajan oluşur. Var olan bir ajanı koda geçirmenin yolu, Console'daki **Export as code** seçeneğini kullanmak.
