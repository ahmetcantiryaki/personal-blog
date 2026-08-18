---
title: "Claude Code Artık GitLab'ı Destekliyor mu?"
slug: "claude-code-artik-gitlab-destekliyor"
translationKey: "claude-code-gitlab-integration"
locale: "tr"
excerpt: "Evet: Claude Code, 12-17 Ağustos 2026 arasında yayınlanan v2.1.232-234 sürümleriyle GitLab depo klonlama, merge request akışı ve token gizleme desteği kazandı."
category: "ai"
tags: ["claude", "ai-coding", "git", "developer-experience", "automation"]
publishedAt: "2026-08-18"
seoTitle: "Claude Code Artık GitLab'ı Destekliyor mu?"
seoDescription: "Claude Code'un GitLab desteği Ağustos 2026'da hangi sürümlerle geldi, GitHub'dan farkı ne ve bir GitLab ekibi bunu nasıl kurar? Kısa cevap ve kurulum adımları."
---

Kısa cevap: Evet. Anthropic, 12-17 Ağustos 2026 arasında art arda yayınladığı üç sürümle (v2.1.232, v2.1.233, v2.1.234) Claude Code'a GitLab depo klonlama, merge request entegrasyonu, token gizleme ve durum çubuğunda MR rozeti ekledi. GitLab artık GitHub'la aynı sınıfta, ikinci sınıf bir entegrasyon değil.

## Claude Code'un GitLab desteği tam olarak neyi kapsıyor?

Destek tek bir sürümde değil, bir hafta içinde birbirini tamamlayan üç ayrı sürümde geldi. Her sürüm belirli bir iş akışını hedef aldı: önce depo erişimi, sonra merge request'lerle çalışma, en son da görünürlük (durum çubuğu rozeti).

| Sürüm | Tarih | Ne eklendi |
| --- | --- | --- |
| v2.1.232 | 13 Ağustos 2026 | Plugin marketplace'lerinde çıplak `gitlab.com` depo URL'leri (iç içe subgroup'lar dahil) artık `github.com` URL'leri gibi klonlanıyor; `glrt-`, `gloas-`, `glptt-`, `glagent-`, `glimt-`, `glsoat-`, `glcbt-`, `glft-`, `glffct-` token aileleri ve `glpat-`/`gldt-` için tam gizleme eklendi |
| v2.1.233 | 14 Ağustos 2026 | `--worktree` bayrağı ve `claude agents` görünümü GitLab merge request URL'lerini kabul ediyor; MR'lar GitLab'ın doğal numaralandırmasıyla `!N` olarak gösteriliyor |
| v2.1.234 | 17 Ağustos 2026 | Kimliği doğrulanmış `glab` CLI'a sahip GitLab uzak depolarında durum çubuğuna taslak/bekliyor/geçti durumlarını gösteren MR rozeti eklendi; proje bazlı transcript dizinleri için `CLAUDE_CODE_PROJECT_DIR_NAME` ortam değişkeni eklendi |

Dikkat edilmesi gereken nokta şu: GitHub'da pull request `#N` formatıyla numaralanırken GitLab'da merge request `!N` formatıyla gösteriliyor. Claude Code artık bu ayrımı biliyor ve doğru sembolü kullanıyor; bu küçük bir detay gibi görünse de, `claude agents` çıktısını okurken hangi platformda olduğunuzu anında anlamanızı sağlıyor.

## GitLab desteği GitHub desteğiyle nasıl karşılaştırılıyor?

Ağustos 2026 itibarıyla iki platform arasındaki fark, özellik sayısından çok "GitHub'ın kaç yıllık avantajı var" sorusuna indirgeniyor. GitLab desteği yeni ama temel iş akışlarının hepsini kapsıyor.

| Özellik | GitHub | GitLab (Ağustos 2026 itibarıyla) |
| --- | --- | --- |
| Depo klonlama (çıplak URL) | Destekleniyor | v2.1.232'den beri destekleniyor |
| `--worktree` ile PR/MR URL'i | Destekleniyor (`#N`) | v2.1.233'ten beri destekleniyor (`!N`) |
| Durum çubuğunda PR/MR rozeti | Destekleniyor | v2.1.234'ten beri destekleniyor (`glab` gerektirir) |
| Token/secret gizleme | Destekleniyor | v2.1.232'den beri destekleniyor (9+ token öneki) |
| CLI bağımlılığı | `gh` CLI | `glab` CLI |
| PR/MR numaralandırma gösterimi | `#N` | `!N` |

Pratikte fark artık günlük kullanımda hissedilmiyor. Asıl fark geçmişte: GitHub entegrasyonu Claude Code'un ilk sürümlerinden beri olgunlaşırken, GitLab desteği beş günlük yoğun bir yayın dizisinde toparlandı. Bu, GitLab tarafının daha az savaş testinden geçmiş olabileceği anlamına geliyor — hata raporu görürseniz şaşırmayın.

Bu tabloyu okurken şunu da not edin: GitLab'ın kendi merge request kavramı, GitHub'ın pull request'inden davranış olarak farklılık gösterebiliyor (örneğin draft MR durumu ya da onay kuralları GitLab tarafında daha esnek). Claude Code bu davranış farklarını değiştirmiyor, sadece platformun kendi API'sini kullanarak durumu doğru şekilde okuyup gösteriyor.

## Bir GitLab ekibi Claude Code'u nasıl kurar?

Kurulum GitHub'dakiyle neredeyse birebir aynı mantıkla ilerliyor: önce platformun resmi CLI aracını kimlik doğrulamasıyla kurun, sonra Claude Code'u bir depo veya MR URL'iyle çalıştırın. Tek fark `gh` yerine `glab` kullanmanız.

```bash
# 1. GitLab CLI'ı kur ve kimlik doğrula
brew install glab
glab auth login

# 2. Depoyu çıplak GitLab URL'iyle klonla (subgroup'lar dahil)
claude "gitlab.com/takim-adi/alt-grup/proje reposunu incele"

# 3. Belirli bir merge request üzerinde worktree ile çalış
claude --worktree https://gitlab.com/takim-adi/proje/-/merge_requests/42

# 4. Durum çubuğunda MR rozetini görmek için glab kimlik doğrulamasının
# aktif olduğundan emin ol
glab auth status
```

`glab auth status` çıktısı doğrulanmış görünmüyorsa durum çubuğu rozeti hiç görünmez; bu en sık karşılaşılan kurulum hatası. Kimlik doğrulama tamamlandıktan sonra Claude Code, depo uzak adresinden GitLab olduğunu otomatik algılıyor — ayrı bir yapılandırma bayrağı gerekmiyor.

## Hâlâ sadece GitHub'da çalışan özellikler var mı?

Ağustos 2026 değişiklik günlüğüne göre temel iş akışlarının (klonlama, worktree, MR/PR rozeti, secret gizleme) hepsi artık her iki platformda da mevcut. Ancak GitHub entegrasyonunun yaşı GitLab'dan kat kat fazla olduğu için, GitHub Actions'a özgü bazı ileri düzey entegrasyonların (CI iş akışı tetikleme, Actions log okuma gibi) GitLab CI/CD tarafında henüz birebir karşılığı olmayabilir. Bu noktada en güvenilir kaynak, her sürümde güncellenen resmi değişiklik günlüğü.

Bu belirsizlik, halihazırda tamamen GitLab üzerinde çalışan ve GitHub'a hiç dokunmamış bir ekip için pratikte büyük bir risk oluşturmuyor: temel geliştirici döngüsü (kod inceleme, worktree ile MR üzerinde çalışma, secret sızıntısını önleme) zaten eksiksiz. Riskin doğduğu yer, GitHub Actions'a özgü otomasyonları GitLab CI/CD'ye birebir taşımayı bekleyen ekipler. Böyle bir senaryonuz varsa, geçiş öncesi mevcut CI/CD pipeline'ınızın hangi adımlarının Claude Code'a bağımlı olacağını netleştirmek işe yarar.

Açıkçası bu yayın sırası bana bir şey söylüyor: Anthropic bunu tek bir büyük "GitLab lansmanı" olarak duyurmak yerine dört-beş gün içinde art arda gelen küçük sürümlere yaydı. Bu, GitLab desteğinin bir pazarlama numarasından çok, birikmiş bir mühendislik backlog'unun düzenli şekilde eritilmesi olduğunu düşündürüyor — ki kurumsal bir araç için bu aslında iyi bir işaret.

GitLab tarafında [merge request iş akışlarını]( /tr/posts/git-branch-stratejileri) zaten branch stratejinize göre kurguluyorsanız, Claude Code'un `--worktree` desteğini mevcut [GitOps](/tr/posts/gitops-nedir) süreçlerinize eklemek büyük bir değişiklik gerektirmiyor. Ekibiniz zaten [Claude Code subagent'larını](/tr/posts/claude-code-subagent-arka-plan-ajanlari) kullanıyorsa, bu ajanların artık GitLab MR'ları üzerinde de çalışabildiğini bilmekte fayda var. Kendi altyapınızda çalıştırıyorsanız [self-hosted environments](/tr/posts/claude-code-kendi-altyapinizda-calisan-oturumlar) rehberi `glab` kimlik doğrulamasını konteynerinize nasıl taşıyacağınızı planlarken işinize yarayabilir.

## Bu gelişme kimin için en çok önem taşıyor?

Kısa cevap: kod tabanı GitLab'da barınan, ama Claude Code'u daha önce "sadece GitHub'da çalışıyor" varsayımıyla değerlendirme dışı bırakmış ekipler için. Finans, sağlık ve kamu gibi düzenlemeye tabi sektörlerde self-hosted GitLab kurulumları yaygın; bu ekipler genelde SaaS tabanlı GitHub yerine kendi sunucularında barındırılan bir Git platformu tercih ediyor. Bu tür ekipler için GitLab desteğinin gelmesi, Claude Code'u yeniden değerlendirme listesine alma sebebi.

İkinci grup, hem GitHub hem GitLab kullanan çok depolu organizasyonlar. Böyle bir organizasyonda geliştiriciler bazı projelerde GitHub, bazılarında GitLab kullanıyor olabiliyor; Ağustos 2026'dan önce bu, Claude Code deneyiminin depoya göre tutarsız olması anlamına geliyordu — bir depoda MR rozetini görürken diğerinde göremiyordunuz. Artık iki platformda da aynı temel iş akışı çalışıyor, dolayısıyla ekip içi araç standardizasyonu için ayrı bir GitLab'a özel süreç kurmaya gerek kalmıyor.

Bunun tersi de doğru: tek bir depoda, tek bir platformda çalışan küçük bir ekip için bu haber pratikte günlük iş akışında hiçbir şeyi değiştirmiyor — zaten kullandığınız süreç aynı kalıyor.

## Sıkça Sorulan Sorular

### Claude Code'da GitLab merge request'leri GitHub pull request'leri gibi mi görünüyor?

Hayır, tam olarak değil. GitLab merge request'leri `!N` formatıyla (örneğin `!42`), GitHub pull request'leri ise `#N` formatıyla (`#42`) gösteriliyor — bu, v2.1.233'ten beri `--worktree` bayrağı ve `claude agents` görünümünde geçerli. Format farkı GitLab'ın kendi arayüzüyle birebir örtüşüyor.

### Durum çubuğundaki GitLab MR rozetini görmek için ne gerekiyor?

Kimliği doğrulanmış bir `glab` CLI kurulumu ve deponun bir GitLab uzak adresine sahip olması gerekiyor. Bu özellik v2.1.234 ile 17 Ağustos 2026'da eklendi ve taslak, bekliyor, geçti gibi MR durumlarını doğrudan durum çubuğunda gösteriyor.

### GitLab self-hosted (kendi sunucunuzda barındırılan) örnekler destekleniyor mu?

Değişiklik günlüğünde bu konuda açık bir sınırlama belirtilmiyor; `glab` CLI zaten self-hosted GitLab örneklerine kimlik doğrulamayı destekliyor, dolayısıyla `glab auth login` ile doğru sunucuya bağlandığınız sürece Claude Code aynı akışı izliyor. Kurumsal bir GitLab örneğiniz varsa önce `glab auth status` ile bağlantıyı doğrulamanız önerilir.

### Token gizleme hangi GitLab token türlerini kapsıyor?

v2.1.232 ile `glrt-`, `gloas-`, `glptt-`, `glagent-`, `glimt-`, `glsoat-`, `glcbt-`, `glft-`, `glffct-` önekli token aileleri ve `glpat-` (personal access token) ile `gldt-` (deploy token) için tam gizleme eklendi. Bu, Claude Code çıktılarında veya loglarında bu token'ların yanlışlıkla görünmesini engelliyor.
