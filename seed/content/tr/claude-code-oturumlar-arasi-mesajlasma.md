---
title: "Claude Code'da Oturumlar Birbirine Mesaj Atabiliyor"
slug: "claude-code-oturumlar-arasi-mesajlasma"
translationKey: "claude-code-cross-session-messaging"
locale: "tr"
excerpt: "Claude Code 2.1.224 ile SendMessage ve ListAgents geldi: aynı makinedeki hatta farklı makinelerdeki oturumlar artık birbirini bulup mesajlaşabiliyor."
category: "ai"
tags: ["claude", "ai-agents", "automation", "workflow"]
publishedAt: "2026-08-07"
seoTitle: "Claude Code Cross-Session Messaging: SendMessage Rehberi"
seoDescription: "Claude Code 2.1.224'te gelen SendMessage ve ListAgents araçları oturumlar arası mesajlaşmayı nasıl açıyor? Agent Teams'ten farkı, kurulumu ve güvenlik modeli."
---

Claude Code, 7 Ağustos'ta yayınlanan 2.1.224 sürümüyle bambaşka bir koordinasyon katmanı açtı: artık aynı makinede çalışan iki ayrı Claude Code oturumu — hatta farklı makinelerdeki oturumlar — birbirini bulup doğrudan mesaj gönderebiliyor. Yeni `ListAgents` aracı erişebileceğiniz oturumları listeliyor, `SendMessage` ise seçtiğiniz oturuma mesaj iletiyor. Şu an için sadece macOS ve Linux'ta çalışıyor.

## Ne Değişti: SendMessage ve ListAgents

Resmi değişiklik notu net: "Cross-session `SendMessage`: Claude Code oturumları artık herhangi bir makinenizde birbirine mesaj gönderebiliyor, `ListAgents` ile onları keşfedebilirsiniz (macOS ve Linux)." Aynı sürümde bir güvenilirlik düzeltmesi de var — daha önce bir teammate'in gelen kutusuna yazma işlemi sessizce başarısız olduğunda araç yine de "Mesaj gönderildi" diyordu; artık başarısız teslimatlar hata olarak raporlanıyor.

Bu, Claude Code'un Temmuz'da deneysel olarak eklediği Agent Teams özelliğinden farklı bir şey. Agent Teams'te `SendMessage` zaten vardı ama sadece **tek bir oturumun kendi spawn ettiği teammate'leri** arasında geçerliydi. 2.1.224'teki değişiklik bu sınırı kaldırıyor: artık birbirinden habersiz açılmış, tamamen bağımsız iki terminal penceresi bile konuşabiliyor.

## Agent Teams'ten Farkı Ne

Üç farklı koordinasyon modelini yan yana koyunca fark netleşiyor:

| Model | Kim başlatır | İletişim | Kapsam |
|---|---|---|---|
| Subagent | Ana oturum, `Agent` aracıyla | Sadece ana oturuma sonuç döner | Tek oturum içinde |
| Agent Teams | Lead, teammate spawn ederek | Teammate'ler birbirine ve lead'e mesaj atar | Tek oturumun ekibi |
| Cross-session `SendMessage` | Kullanıcı, bağımsız oturumlar açarak | Herhangi bir oturum herhangi birine mesaj atar | Makine (ileride hesap) genelinde |

Pratikte bunun anlamı şu: bir terminalde backend'i düzenleyen bir Claude Code oturumunuz, başka bir terminalde frontend'i düzenleyen ikinci bir oturumunuz varsa, artık bu iki oturumu manuel olarak `Agent` aracıyla birbirine bağlamak zorunda değilsiniz — `ListAgents` ile birbirlerini görüp doğrudan konuşabiliyorlar. Bunu daha önce ele aldığımız [Claude Code subagent ve arka plan ajanları rehberimizde](/tr/posts/claude-code-subagent-arka-plan-ajanlari) anlattığımız modelin bir üst katmanı olarak düşünebilirsiniz.

## Nasıl Çalışır: Mailbox ve Keşif

Mekanizmanın altında yatan yapı Agent Teams'teki mailbox sistemiyle aynı prensibi kullanıyor: her ajanın gelen kutusu, `~/.claude/teams/{team-adi}/inboxes/{ajan-adi}.json` altında bir JSON dosyası. `ListAgents` bu dosyaları tarayıp erişilebilir oturumları listeliyor; `SendMessage` ise hedef oturumun mailbox'ına yazıyor. Mesaj gönderilen oturum bunu otomatik olarak alıyor — karşı tarafın sürekli yoklama (polling) yapmasına gerek yok.

Şu an için özellik macOS ve Linux'a özel; Windows desteği (WSL2 dışında) henüz yok. Ayrıca bu, aynı Anthropic hesabına bağlı oturumları bulmakla sınırlı — internet üzerinden rastgele bir Claude Code kullanıcısına mesaj atamıyorsunuz.

## Güvenlik Tarafı: Onaysız Değil

Çoklu ajan sistemlerinde en büyük risk, ele geçirilmiş bir oturumun diğerlerini sessizce yönlendirmesi. Anthropic bunu bir "prompt injection güvenlik duvarı" ile ele alıyor: bir ajandan gelen mesaj, alıcı ajana açıkça "bu mesaj sizin değil, başka bir Claude oturumundan geldi" şeklinde işaretleniyor. Bir teammate sizin adınıza izin onayı veremiyor, reddedilen bir eylemi başka bir oturuma aktararak izin kontrolünü atlatamıyor. Auto modda ise sınıflandırıcı, başka bir ajandan gelen "onaylandı" iddiasını sizin onayınız yerine geçen bir şey değil, güvenilmeyen bir girdi olarak değerlendiriyor.

Bu detay önemli çünkü çok ajanlı orkestrasyon büyüdükçe saldırı yüzeyi de büyüyor; konuyu daha geniş bir çerçevede [çok ajanlı orkestrasyon kalıpları yazımızda](/tr/posts/cok-ajanli-orkestrasyon-kaliplari) işlemiştik.

## Neden Şimdi Geldi: Uzun Süredir Beklenen Bir Talep

Bu özellik boşluktan çıkmadı. Claude Code'un GitHub deposunda aylardır açık duran birden fazla istek vardı: bağımsız oturumlar arasında mesajlaşma isteyen bir özellik talebi, çoklu proje koordinasyonu için cross-session messaging isteyen ayrı bir talep ve onay gerektirmeyen "güvenilir eş oturumlar" isteyen bir üçüncüsü. Topluluk bu boşluğu resmi çözüm gelene kadar kendi araçlarıyla doldurmaya çalıştı — yerel bir WebSocket veya SQLite tabanlı mesaj köprüsü kuran birkaç bağımsız proje ortaya çıktı, bazıları yalnızca macOS ve Linux'ta (WSL2 dahil) çalışacak şekilde tasarlandı. 2.1.224'ün getirdiği resmi çözüm, aslında bu community çözümlerinin çözmeye çalıştığı sorunu doğrudan ele alıyor: aynı makinede çalışan bağımsız Claude Code oturumlarını üçüncü parti bir araca ihtiyaç duymadan birbirine bağlamak.

Bunun pratikte en çok işine yarayacağı grup, birden fazla bağımsız terminal penceresinde çalışan ve bunları elle koordine etmekten yorulan geliştiriciler. Örneğin bir monorepo'da aynı anda üç farklı paket üzerinde çalışan üç oturumunuz varsa, artık her birinin diğerlerinde ne olup bittiğini bilmesi için sizin köprü olmanız gerekmiyor. Daha önce bu tarz bir koordinasyonu Git worktree'leri açıp elle takip ederek yapıyorsanız, cross-session mesajlaşma bu iş akışının doğal bir devamı — worktree'ler oturumları izole ediyordu, `SendMessage` ise izole oturumlar arasındaki iletişim boşluğunu dolduruyor.

## Aynı Sürümde Bir Diğer Büyük Değişiklik: Self-Hosted Runner

2.1.224'ün gölgede kalan ama Enterprise ve Team planları için önemli bir diğer eklentisi `claude self-hosted-runner` komutu. Bu, kendi makinenizi veya container'ınızı, Claude Code web, mobil ve masaüstü oturumlarının çalışabileceği bir yere dönüştürüyor — mantığı GitHub Actions'ın self-hosted runner'larına oldukça benziyor. Kurulumu tek satır:

```bash
claude self-hosted-runner --help
```

Bu komutu çalıştırdığınızda kayıt, kimlik doğrulama ve runner yaşam döngüsü seçenekleri listeleniyor. Kurumsal ekipler için pratik faydası açık: hassas kod tabanları için bulut çalışma alanlarını kendi VPC'nizin içinde tutabiliyorsunuz.

## Bunu Ne Zaman Kullanmalısınız

Açıkçası çoğu geliştirici için bu özelliğin ilk faydası "wow" anından çok, günlük sürtünmeyi azaltması olacak. Birden fazla terminal açıp aynı projenin farklı katmanlarında paralel çalışıyorsanız, artık bu oturumları elle koordine etmek yerine birbirlerine "backend endpoint'i bitti, şimdi entegrasyonu test edebilirsin" gibi mesajlar attırabilirsiniz. Ama deneysel bir özellik olduğunu unutmayın: oturum sonlandırma ve mailbox temizliği gibi köşe durumlarında hâlâ pürüzler bildiriliyor, üretim kritik iş akışlarına şimdiden tam bağımlı olmak riskli.

## Agent Teams Dokümantasyonunun Gösterdiği Olgunluk Seviyesi

Cross-session `SendMessage`'ın üzerine kurulduğu Agent Teams altyapısı da hâlâ hızla değişiyor. Resmi dokümantasyon "deneysel" etiketini taşımaya devam ediyor ve bilinen sınırlamaları açıkça listeliyor: oturum devam ettirme (`/resume`, `/rewind`) in-process teammate'leri geri getirmiyor, görev durumu bazen gecikebiliyor, kapanış süreci teammate'in mevcut isteğini bitirmesini beklediği için yavaş olabiliyor. Bir session'ın sadece tek bir takımı olabiliyor, teammate'ler kendi teammate'lerini spawn edemiyor (iç içe takım yok) ve lead rolü oturum boyunca sabit — bir teammate'i lead'e terfi ettiremiyorsunuz.

Bu sınırlamaları bilmek önemli çünkü cross-session mesajlaşmayı üretim iş akışınıza bağlamadan önce, hangi köşe durumlarının hâlâ kırılgan olduğunu görmüş oluyorsunuz. Anthropic'in bu hızda özellik eklemesi, çok ajanlı Claude Code kullanımının şirket için stratejik bir öncelik olduğunu da gösteriyor.

## Sıkça Sorulan Sorular

### SendMessage ve ListAgents nasıl etkinleştirilir?

Ayrı bir bayrak gerekmiyor — 2.1.224'e güncellendiğinizde `ListAgents` ve `SendMessage` doğrudan kullanılabilir hale geliyor. Ancak Agent Teams'in kendisi hâlâ deneysel bir özellik olduğundan, teammate spawn etme kısmı için `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` ayarını settings.json'a eklemeniz gerekiyor.

### Windows'ta çalışıyor mu?

Şu an için hayır. Değişiklik notu özellikle macOS ve Linux'u belirtiyor; WSL2 üzerinden Linux ortamı kullananlar muhtemelen faydalanabilir ama native Windows terminalinde destek yok.

### Farklı bilgisayarlardaki oturumlar da mesajlaşabiliyor mu?

Değişiklik notu "herhangi bir makinenizde" diyor, yani aynı Anthropic hesabına bağlı birden fazla makine arasında da çalışması hedefleniyor. Ama pratikte en olgun kullanım senaryosu hâlâ tek makinede birden fazla terminal açık tutmak.

### Bu, Agent Teams'in yerini mi alıyor?

Hayır, ikisi birlikte var oluyor. Agent Teams hâlâ bir lead'in kendi teammate'lerini spawn ettiği, göreve özel bir model; cross-session `SendMessage` ise bağımsız açılmış oturumlar arasında daha genel bir iletişim katmanı sunuyor.
