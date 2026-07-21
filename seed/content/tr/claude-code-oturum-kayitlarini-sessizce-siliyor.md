---
title: "Claude Code Oturum Kayıtlarını Sessizce Siliyor"
slug: "claude-code-oturum-kayitlarini-sessizce-siliyor"
translationKey: "claude-code-transcript-deletion-bug"
locale: "tr"
excerpt: "Claude Code, 30 günden eski yerel oturum kayıtlarını varsayılan olarak, hiçbir uyarı ve geri alma seçeneği olmadan siliyor. Nedeni, riski ve çözümü burada."
category: "ai"
tags: ["claude", "reliability", "ai-tools", "best-practices"]
publishedAt: "2026-07-21"
seoTitle: "Claude Code'un 30 Günlük Sessiz Silme Sorunu"
seoDescription: "Claude Code, yerel sohbet kayıtlarını 30 gün sonra varsayılan olarak sessizce siliyor. Açık GitHub sorunlarını, Anthropic'in gerekçesini ve çözümü anlatıyoruz."
---

Claude Code, her başlatıldığında 30 günden eski yerel oturum kayıtlarını varsayılan olarak siler; bunu hiçbir uyarı penceresi göstermeden, ilk kullanımda bildirmeden ve geri alma komutu sunmadan yapar. Ayar gerçek, `~/.claude/settings.json` içinde belgeli ve Temmuz 2026 itibarıyla Anthropic bu politikayı değiştirmeyeceğini, sadece iletişiminin kötü olduğunu kabul ediyor.

## Temizlik mekanizması aslında nasıl çalışıyor?

Claude Code, her sohbeti `~/.claude/projects/<encoded-cwd>/` altında düz metin JSONL dosyası olarak saklar; her oturum için bir dosya, düz metin olarak okunabilir. `cleanupPeriodDays` adlı ayar bu dosyaların ne kadar süre yaşayacağını belirler ve varsayılan değeri 30 gündür. Yumuşak silme yok, çöp kutusu yok, `claude history restore` gibi bir komut yok; dosya basitçe kayboluyor. Temizlik belirli bir zamanlamayla değil, her başlatmada çalışıyor; yani saklama süresi dolduktan sonra terminali bir sonraki açışınızda bir kayıt anında yok olabilir. Bunların hiçbiri `/config` komutunda görünmüyor, CLI'nin ilk kullanım akışında da bu konudan bahsedilmiyor; çoğu geliştirici bu ayarın varlığını ancak bir şey kaybettikten sonra öğreniyor.

## Açık GitHub sorunları

Topluluk hata raporları aylar öncesine dayanıyor ve üç sorun bu deseni özetliyor. En rahatsız edici olanı, [#62272 numaralı sorun](https://github.com/anthropics/claude-code/issues/62272), `cleanupPeriodDays` değerini yaklaşık 100 yıllık bir saklama süresine denk gelen 36500 olarak ayarlamış bir kullanıcının yine de 490 oturumunu kaybettiğini gösteriyor. Bu rapor, silme işleminin bazen yapılandırılmış ayarı tamamen görmezden gelen ayrı bir kod yolundan çalıştığına işaret ediyor; Anthropic tetikleyiciyi tam olarak izole etmiş değil ama topluluk raporları en çok VS Code veya eklenti yeniden başlatmalarını ve CLI güncellemelerini işaret ediyor.

| Sorun | Temel belirti | Durum (Temmuz 2026) |
|---|---|---|
| #62272 | `cleanupPeriodDays` 36500 gün olarak ayarlanmış, yine de 490 oturum silinmiş | Açık |
| #62476 | Kayıtlar varsayılan olarak 30 gün sonra sessizce siliniyor, uyarı yok | Açık |
| #59248 | Temizlik için opt-in seçeneği, uyarı veya geri alma mekanizması yok | Açık |

Güven sorununu büyüten ayrı bir sıkıntı daha var: Claude Code'un yan menüsü, diskten çoktan silinmiş oturumları listelemeye devam ediyor. Bu "hayalet" kayıtlardan birine tıkladığınızda geçmişiniz yerine "session not found on disk" hatası alıyorsunuz; arayüz, temizlik işinin çoktan yok ettiği şeye henüz yetişememiş.

## Anthropic'in gerekçesi ve eksik bıraktığı kısım

The Register bu konuda sorduğunda Anthropic, 30 günlük silmenin Claude Code'un lansmanından beri kasıtlı bir güvenlik önlemi olarak var olduğunu söyledi: kodlama oturumu kayıtları düz metin halinde kaynak kod, API anahtarları ve başka kimlik bilgileri içerebiliyor, bunları diskte süresiz bırakmak kendi başına bir risk. Bu, tek başına savunulabilir bir duruş; saklama sınırları makul bir güvenlik yaklaşımının olağan bir parçası ve pek çok mühendislik aracı günlükleri varsayılan olarak zamanla siler. Hassas veriyi belirli bir takvimle güvenlik amacıyla silmek makul bir varsayılan davranış; bunu sıfır uyarıyla, onay adımı olmadan ve bazı kullanıcıların bildirdiğine göre tutmayan bir yapılandırma seçeneğiyle sunmak değil, ve bu GitHub sorunlarını asıl tetikleyen şikayet de saklama politikasının varlığı değil tam olarak bu. [The Register'ın 30 Haziran raporu](https://www.theregister.com/ai-and-ml/2026/06/30/claude-code-users-complain-their-chat-records-are-being-mysteriously-wiped-out/5264673) ve geniş katılım gören bir Hacker News tartışması da aynı sonuca varıyor: kavram sorunlu değil, uygulama sorunlu.

## 14 Temmuz söylentisi: gerçek neydi?

14 Temmuz 2026'da ayrı bir söylenti yayıldı; "yeni bir Claude güncellemesinin sohbetleri sildiği" iddia edildi ve bu, aslında büyük ölçüde alakasız olan 30 günlük temizlik hikâyesiyle karıştırıldı. Anthropic'in kendi [Claude Code değişiklik günlüğüne](https://code.claude.com/docs/en/changelog) bakıldığında, o gün yayınlanan tek şeyler Claude Enterprise ve API müşterileri için kendi kendine yapılandırılabilen bir HIPAA seçeneği (kayıt saklamayla ilgisi yok) ve rutin hata düzeltmeleri içeren iki küçük CLI yaması, 2.1.208 ve 2.1.209 oldu. 14 Temmuz'da kimsenin geçmişini toplu olarak silen büyük bir güncelleme yaşanmadı. Ayrıca bazı masaüstü uygulaması kullanıcıları, uygulamanın hata penceresi göstermeden sessizce çöküp yeniden başladığını ve devam eden, senkronize edilmemiş bir sohbeti kaybettiklerini bildirdi; bu gerçek ama daha dar kapsamlı, planlı 30 günlük temizlikten ayrı bir sorun. 20 Temmuz 2026'da yayınlanan Claude Code 2.1.216 itibarıyla değişiklik günlüğünde `cleanupPeriodDays` davranışına yönelik herhangi bir düzeltmeden söz edilmiyor; son sürümler başka kararlılık ve izin sorunlarına odaklanmış durumda.

## Şimdi ne yapmalısınız?

Topluluğun çözümü, ayar dosyanızdaki saklama süresini yükseltmek:

```json
{
  "cleanupPeriodDays": 3650
}
```

Bunu `~/.claude/settings.json` içine (veya proje bazlı bir geçersiz kılma için `.claude/settings.json` içine) yazın; Claude Code çoğu durumda kayıtları 30 gün yerine yaklaşık on yıl saklayacaktır. Bunu bir garanti değil, bir önlem olarak görün; #62272 numaralı sorun, bundan çok daha büyük bir değerin bile silmeyi durduramadığı tam bir örnek, yani geçersiz kılma her durumda su geçirmez değil. Oturum geçmişinize denetim, faturalama veya bir karar zincirini yeniden kurma amacıyla gerçekten bağımlıysanız, JSONL dosyalarını harici olarak yedekleyin: `~/.claude/projects/` klasörünü bulut depolamaya veya ayrı bir diske kopyalayan basit bir cron işi, herhangi bir yapılandırma değerinden daha güvenilirdir. Claude Code'u ekip iş akışlarında zaten kullanıyorsanız, [subagent ve arka plan ajanları modelini](/tr/posts/claude-code-subagent-arka-plan-ajanlari) ve CLI'nin [kaçak ajanlara karşı yakın zamanda eklediği frenleri](/tr/posts/claude-code-kacak-ajanlara-fren) incelemekte fayda var; ikisi de bu yıl tekrar eden bir tema olan "varsayılan olarak sessiz davranış" ile ilgili, tıpkı daha önceki bir raporda ele alınan [Claude Code'un gizli takip kodu](/tr/posts/claude-code-gizli-takip-kodu) gibi.

## Zaten kayıp verdiyseniz

Time Machine çalıştıran macOS kullanıcıları için, GitHub'da yer alan [`restore-claude-history`](https://github.com/garrettmoss/restore-claude-history) adlı üçüncü taraf bir araç, silinen JSONL kayıtlarını Time Machine anlık görüntülerinden kurtarabiliyor. Anthropic tarafından desteklenen bir araç değil, dolayısıyla dosya sisteminize dokunan her şey için geçerli olağan dikkati göstererek kullanın; ama bugün için zaten kaybolmuş veriler açısından elde mevcut en somut kurtarma yolu bu. Şu an Windows veya Linux için bir eşdeğeri yok, Anthropic'ten talep edebileceğiniz sunucu tarafı bir yedek de yok; yerel kayıtlar tam olarak dedikleri gibi, yerel.

## Claude Code üzerine araç yazanlar için genel ders

Claude Code üzerine bir şeyler inşa ediyorsanız; kayıtları iç bir panoya aktarıyor, uyumluluk için oturumları loglıyor veya eski sohbetleri geri getirmek için sadece `/resume` komutuna güveniyorsanız, `~/.claude/projects/` klasörünü tasarım gereği geçici bir depo olarak görün, arşiv olarak değil. Bu, Anthropic'in ileride bir onay penceresi veya açık bir opt-out ekleyip eklemeyeceğinden bağımsız olarak geçerli; şu anki bozuk davranış (geçersiz kılmanın bazen görmezden gelinmesi, geri alma olmaması, ilk kullanımda bildirim yapılmaması) bu yazının yazıldığı tarih itibarıyla hâlâ çözülmedi, ve [AI kod asistanı kullanırken yapılan yaygın hatalardan](/tr/posts/ai-kod-asistani-hatalari) kaçınmaya uygulanan aynı disiplin -kaybetmeyi göze alamayacağınız hiçbir şey için bir aracın varsayılanlarına güvenmeyin- burada da doğrudan geçerli.

## Sıkça Sorulan Sorular

### Claude Code sohbet geçmişimi gerçekten otomatik olarak siliyor mu?

Evet. Varsayılan olarak, 30 günden eski yerel oturum kayıtları Claude Code bir sonraki başlatıldığında silinir; bu davranış `~/.claude/settings.json` içindeki `cleanupPeriodDays` ayarıyla kontrol edilir. Onay istemi yoktur ve silinen bir dosyayı geri getirecek yerleşik bir yöntem yoktur.

### `cleanupPeriodDays` değerini yükseltmek silmeleri gerçekten durduruyor mu?

Çoğu kullanıcı için evet; değeri 3650 gibi çok daha büyük bir sayıya ayarlamak saklama süresini buna göre uzatır. Ama #62272 numaralı GitHub sorunu, `cleanupPeriodDays` değeri 36500 olarak ayarlanmışken bile 490 oturumun silindiği bir durumu belgeliyor; yani geçersiz kılmanın her senaryoda tutacağı garanti değil. Anthropic bu tutarsızlığın kök nedenini henüz yayınlamadı.

### Bu, yakın zamanda çıkan bir Claude Code güncellemesinden mi kaynaklandı?

Hayır. 30 günlük temizlik, belirtilen bir güvenlik önlemi olarak lansman gününden beri var. 14 Temmuz 2026'daki ayrı bir söylenti, toplu silmeleri yanlışlıkla yeni bir güncellemeye bağladı; o gün gerçekleşen tek değişiklikler alakasız bir HIPAA yapılandırma seçeneği ve rutin düzeltmeler içeren iki küçük yamaydı.

### Claude Code oturum kayıtlarımı nasıl yedekleyebilirim?

`~/.claude/projects/` klasörünü belirli aralıklarla harici bir depolamaya kopyalayın; bir cron işi veya basit bir yedekleme betiği, yalnızca `cleanupPeriodDays` geçersiz kılmasına güvenmekten daha güvenilirdir. Time Machine etkin macOS kullanıcıları, zaten silinmiş kayıtlar için topluluk tarafından geliştirilen `restore-claude-history` aracını da kullanabilir.
