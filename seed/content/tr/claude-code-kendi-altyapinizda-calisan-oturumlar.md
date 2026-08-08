---
title: "Claude Code Self-Hosted Environments Nedir?"
slug: "claude-code-kendi-altyapinizda-calisan-oturumlar"
translationKey: "claude-code-self-hosted-environments"
locale: "tr"
excerpt: "Anthropic, Claude Code bulut oturumlarını kendi sunucunuzda çalıştırmayı beta olarak açtı. Runner mimarisi, ağ modeli ve kurulum adımları bu rehberde."
category: "ai"
tags: ["claude", "self-hosting", "devops", "ai-agents"]
publishedAt: "2026-08-08"
seoTitle: "Claude Code Self-Hosted Environments Rehberi"
seoDescription: "Claude Code'un self-hosted environments özelliği kod oturumlarını kendi sunucunuzda çalıştırır. Runner mimarisi, ağ modeli ve kurulum adımları bu rehberde."
---

Claude Code bulut oturumları artık zorunlu olarak Anthropic'in sunucularında çalışmak zorunda değil. Ağustos 2026'nın başında genel kullanıma açılan **self-hosted environments** beta özelliği, aynı bulut deneyimini (claude.ai, mobil/masaüstü uygulama, `claude --cloud` veya zamanlanmış rutinler üzerinden başlatılan oturumlar) kendi ağınız içindeki makinelerde çalıştırmanıza izin veriyor. Bu yazıda özelliğin nasıl çalıştığını, ağ modelini ve gerçekten ne zaman ihtiyacınız olduğunu ele alıyoruz.

## Özellik Aslında Ne Değiştiriyor

Daha önce bir Claude Code bulut oturumu başlattığınızda, iş varsayılan olarak Anthropic'in altyapısında çalışıyordu. Artık organizasyonunuz kendi **environment**'ınızı (ortam) tanımlayabiliyor; bir geliştirici oturum başlatırken ortam seçici listesinde Anthropic'in barındırdığı ortamların yanında sizin oluşturduğunuz ortamı da görüyor. Sizin ortamınızı seçtiğinde, kontrol düzlemi oturumu sizin kuyruğunuza yerleştiriyor, bir **runner** onu alıyor, deponuzu klonluyor ve kendi makinenizde bir Claude Code süreci başlatıyor.

Bu, [Claude Code subagent ve arka plan ajanları yazımızda](/tr/posts/claude-code-subagent-arka-plan-ajanlari) anlattığımız ajan mimarisinin doğal bir uzantısı — fark, artık bu ajan sürecinin nerede çalıştığını siz kontrol edebiliyorsunuz.

## Üç Parçalı Mimari: Environment, Runner, Session

Sistemi üç kavram üzerinden düşünmek en kolayı:

- **Environment**: claude.ai admin ayarlarında oluşturduğunuz, adlandırılmış bir hedef. Oturumlar bir runner'a değil, bir environment'a yönlendiriliyor.
- **Runner**: kendi altyapınızda çalışan, uzun ömürlü bir süreç. Kendi self-hosted CI runner'ınızla aynı fikir — işi kuyruktan alıp yürütüyor.
- **Session**: bir geliştiricinin başlattığı tek bir Claude Code görevi.

Bir runner aynı anda tek bir kullanıcıya hizmet ediyor: aldığı ilk oturum, o kullanıcının hesabına kilitleniyor ve kapasitesi dolana kadar sadece o hesabın işlerini işliyor. Bu kural, farklı kullanıcıların kodlarının aynı diskte karışmasını önlüyor — runner disk durumunu kullanıcılar arasında silmek zorunda kalmadan izolasyon sağlanıyor.

## Ağ Modeli: Hiçbir Şey İçeri Girmiyor

Güvenlik ekiplerinin en çok merak ettiği soru bu: Anthropic sizin ağınıza bağlanabiliyor mu? Cevap hayır. Runner ve oturum süreçleri sadece dışa doğru (outbound) HTTPS bağlantısı kuruyor — `api.anthropic.com`'a kuyruk yoklaması, olay akışı ve model çıkarımı için. Anthropic'ten ağınıza gelen hiçbir bağlantı yok.

Depo (repository) checkout'ları, build çıktıları, secret'lar ve bir oturumun oluşturduğu ya da değiştirdiği tüm dosyalar sizin sağladığınız makinelerde kalıyor. Ancak konuşmanın kendisi — prompt'lar, yanıtlar ve tool sonuçları — model çıkarımı için `api.anthropic.com`'a gidiyor ve Anthropic oturum transkriptini saklıyor (böylece başka bir yüzeyden oturuma devam edebiliyorsunuz).

| Bileşen | Nerede çalışıyor | Dışarıya bağlantı |
|---|---|---|
| Runner | Sizin altyapınız | `api.anthropic.com` (kuyruk, heartbeat) |
| Oturum süreci | Sizin altyapınız | `api.anthropic.com` (event stream, model çıkarımı) |
| Depo checkout, build çıktıları, secret'lar | Sizin altyapınız | Ağınızdan çıkmıyor |
| Konuşma (prompt/yanıt/tool sonucu) | — | Model çıkarımı için Anthropic'e gidiyor |
| Oturum orkestrasyonu, kuyruk, claude.ai arayüzü | Anthropic | — |

## Kurulum: Sabit Filo mu, Otomatik Ölçeklendirme mi

İki çalıştırma modu var. **Sabit modda** belirli sayıda runner'ı sürekli açık tutuyorsunuz ve oturumlar aralarında dağıtılıyor. **Otomatik ölçeklendirme orkestratöründe** ise kendi barındırdığınız ikinci bir süreç, oturumlar kuyruğa girdikçe yeni runner'lar başlatıyor; her runner işi bitince kendiliğinden kapanıyor. Basit bir başlangıç şöyle görünür:

```bash
claude self-hosted-runner start \
  --environment-id env_abc123 \
  --capacity 4
```

`--capacity` bayrağı bir runner'ın aynı anda kaç oturumu paralel işleyebileceğini belirliyor. Runner Kubernetes gibi bir orkestratör altında çalışıyorsa, varsayılan davranış (`--drain-grace-sec 0`) aktif oturumlar bitince runner'ın hemen kapanması ve orkestratörün onu temiz bir diskle yeniden başlatması — böylece bir sonraki runner herhangi bir hesaba hizmet edebiliyor.

Bir kill sinyali (`SIGTERM`) ekstra bir bayrak gerektirmiyor; runner düzgün şekilde tahliye oluyor. Ama altyapınız host'ları sinyal göndermeden, belirli bir saatte yok ediyorsa — spot instance geri alımı ya da sandbox ömür sınırı gibi — `--retire-at <epoch-saniye>` bayrağını o zamandan birkaç dakika önceye ayarlamanız gerekiyor. Bu durumda runner önce yeni iş almayı bırakıyor, aktif oturumları bir sonraki mesajda başka bir runner'da devam edecek şekilde serbest bırakıyor, ardından çıkıyor.

## Runner İmajına Ne Koymalısınız

Runner imajınız, üzerinde çalışacak her oturumun derlemeye hazır başlamasını sağlamalı. Pratikte bu genelde üç katman demek: dilinizin derleyicisi ve paket yöneticisi (Node, Python, Go, ne kullanıyorsanız), şirket içi CLI araçlarınız (dahili deploy script'leri, lint kuralları, kod üretim araçları) ve git kimlik doğrulama yapılandırması. Anthropic git proxy'sini kullanmayı tercih ederseniz, git trafiği de `api.anthropic.com` üzerinden yönlendirilebiliyor — bu, runner'ınıza ayrı bir git kimlik bilgisi yönetimi eklemek istemediğiniz durumlarda işe yarıyor. İmajı bir kere doğru kurduktan sonra her yeni oturum sıfırdan `npm install` ya da bağımlılık indirmesi yapmak zorunda kalmıyor; bu da özellikle büyük monorepo'larda oturum başlangıç süresini ciddi ölçüde kısaltıyor.

## Kimler İçin Anlamlı

Anthropic'in kendi dokümantasyonu bile açık: çoğu ekip için barındırılan (hosted) ortamlar daha az operasyonel yük demek ve varsayılan tercih olmaya devam ediyor. Self-hosting; ağ, araç ya da uyumluluk gereksinimleri oturum yürütmesini kendi kontrolünüzdeki altyapıda tutmanızı zorunlu kılan ekipler için var. Karşılığında üç şey kazanıyorsunuz:

- **Ağ erişimi**: oturumlar ağınız içinde çalıştığı için iç servislere, veritabanlarına ve registry'lere internete açmadan erişebiliyor.
- **Özel araçlar**: runner imajınıza derleyicileri, SDK'ları ve şirket içi CLI araçlarını önceden kurarak her oturumun derlemeye hazır başlamasını sağlıyorsunuz.
- **Uyumluluk**: depo checkout'ları ve build çıktıları sizin kontrolünüzdeki altyapıda kalıyor.

Bunun bir bedeli var: runner imajını siz inşa edip bakımını yapıyorsunuz, filoyu siz işletiyorsunuz, ağını siz kontrol ediyorsunuz. Küçük bir ekip için bu, muhtemelen gereğinden fazla operasyonel yük.

## Sınırlamalar

Beta şu an Team ve Enterprise planlarıyla sınırlı ve varsayılan olarak kapalı — bir Owner ya da admin'in **Cloud environments** sayfasından açması gerekiyor. Zero Data Retention açık olan organizasyonlar için kullanılamıyor. Model çıkarımı doğrudan Anthropic API üzerinden yapıldığı için Amazon Bedrock, Google Cloud Agent Platform, Microsoft Foundry ya da bir LLM gateway üzerinden yönlendirilemiyor. Ayrıca Claude Tag, Claude Security ve Code Review oturumları henüz self-hosted ortamlara yönlendirilmiyor — bu yüzeyler için destek ayrıca geliyor.

## Dürüst Bir Değerlendirme

Bu özellik, [Claude Code'un oturumlar arası mesajlaşma](/tr/posts/claude-code-oturumlar-arasi-mesajlasma) ve [kaçak ajanlara getirilen fren](/tr/posts/claude-code-kacak-ajanlara-fren) gibi son güncellemelerle birlikte okunduğunda net bir örüntü ortaya çıkıyor: Anthropic, Claude Code'u bireysel bir CLI aracından kurumsal bir platforma dönüştürüyor. Self-hosted environments, özellikle finans ve kamu sektöründeki ekiplerin "kodumuz asla bizim ağımızdan çıkmasın" gereksinimini karşılıyor — ama şunu da söylemek gerekiyor: konuşmanın kendisi hâlâ Anthropic'e gidiyor, yani bu "tam offline" bir çözüm değil, "kod ve secret'lar yerinde kalsın" çözümü. Bu ayrımı atlayıp özelliği güvenlik ekibine "artık her şey bizde" diye sunmak, ilk uyumluluk denetiminde geri tepecek bir hata.

## Sıkça Sorulan Sorular

### Self-hosted environments hangi planlarda kullanılabilir?

Şu an Team ve Enterprise planlarında beta olarak sunuluyor. Bir Owner veya admin'in claude.ai admin ayarlarındaki Cloud environments sayfasından açması gerekiyor; varsayılan olarak kapalı geliyor.

### Terminalde veya IDE'de çalışan normal Claude Code oturumları bundan etkileniyor mu?

Hayır. Terminal veya IDE oturumları zaten her zaman geliştiricinin kendi makinesinde çalışıyor. Self-hosted environments yalnızca bulut oturumlarını (claude.ai, mobil/masaüstü, `claude --cloud`, zamanlanmış rutinler) ilgilendiriyor.

### Kod tabanımız hiç Anthropic'e gitmiyor mu?

Depo checkout'ları, build çıktıları ve secret'lar sizin altyapınızda kalıyor. Ancak prompt'lar, model yanıtları ve tool sonuçları model çıkarımı için Anthropic API'sine gidiyor — tamamen izole bir sistem değil.

### Kaç runner çalıştırmam gerekiyor?

Minimum filo büyüklüğü, aynı anda aktif olmasını beklediğiniz kullanıcı sayısı kadar olmalı — çünkü bir runner tek seferde tek bir kullanıcıya kilitleniyor. Otomatik ölçeklendirme orkestratörü, bu sayıyı elle takip etme derdini ortadan kaldırıyor.
