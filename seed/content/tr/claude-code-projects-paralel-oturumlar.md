---
title: "Claude Code Projects Nedir? Paralel Bulut Oturumları"
slug: "claude-code-projects-paralel-oturumlar"
translationKey: "claude-code-projects-parallel-sessions-2026"
locale: "tr"
excerpt: "Claude Code Projects artık paylaşılan bir klasör değil; tek konuşmadan paralel bulut oturumları başlatan, laptop kapansa da çalışan bir koordinatör oldu."
category: "ai"
tags: [claude, ai-agents, ai-coding, workflow, developer-experience]
publishedAt: "2026-09-22"
seoTitle: "Claude Code Projects Nedir? Paralel Bulut Oturumları"
seoDescription: "Claude Code Projects artık paylaşılan bir klasör değil; tek konuşmadan paralel bulut oturumları başlatan, laptop kapansa da çalışan bir koordinatör oldu."
---

Kısa cevap: Claude Code Projects, 17 Eylül 2026'da beta olarak açılan yeni bir mod; artık statik bir bağlam klasörü değil, tek bir sürekli konuşma. Siz iş tanımlarsınız, Claude bunu kendi branch'inde çalışan paralel bulut oturumlarına ("thread") bölüp dağıtır ve laptobunuzu kapatsanız da bu oturumlar arka planda çalışmaya devam eder.

## Claude Code Projects tam olarak nedir?

Yeni Projects, Anthropic'in Claude Code için sunduğu bir orkestrasyon katmanı. Tek bir proje konuşması içinde Claude koordinatör rolü üstleniyor: gönderdiğiniz her görevi ya doğrudan cevaplıyor ya da yeni bir thread başlatıyor. Her thread, kendi git branch'i ve reponun kendi kopyası üzerinde çalışan tam bağımsız bir Claude Code bulut oturumu. [Anthropic'in resmi dokümantasyonuna](https://code.claude.com/docs/en/claude-projects) göre koordinatör "thread'lerin attığı her adımı değil, geri bildirdikleri sonucu görüyor" — yani siz de tüm detayla uğraşmak zorunda kalmıyorsunuz, sadece sonuçları değerlendiriyorsunuz.

Bu, önceki Projects deneyiminden köklü bir kopuş. Eskisi claude.ai sohbetinde talimatları ve referans dosyalarını tuttuğunuz paylaşımlı bir bağlam klasörüydü; kod yazmıyor, iş dağıtmıyordu.

## Eski Projects ile yeni Projects arasındaki fark ne?

Fark, "pasif bağlam deposu" ile "aktif iş orkestratörü" arasındaki fark. Aşağıdaki tablo iki modeli karşılaştırıyor:

| Özellik | Eski Projects (claude.ai sohbet) | Yeni Claude Code Projects (Eylül 2026) |
| --- | --- | --- |
| Temel işlev | Paylaşılan bilgi/talimat klasörü | Konuşma + paralel bulut oturumu orkestrasyonu |
| Kod erişimi | Yok veya çok sınırlı | Her thread kendi branch'i ve repo kopyasıyla çalışır |
| Çalışma modeli | Siz her adımı yönlendirirsiniz | Claude koordinatör, işi thread'lere dağıtır |
| Laptop kapatılınca | Sohbet durur | Thread'ler bulutta çalışmaya devam eder |
| Model kontrolü | Tek model, tek bağlam | Koordinatör ve thread'ler için ayrı model/efor ayarı |
| Çıktı | Metin cevap | Pull request, dosya, test sonucu, rapor |

Pratikte bu şu anlama geliyor: eskiden birden çok oturumu paralel çalıştırmak istediğinizde koordinasyonu siz yapıyordunuz — her birine aynı bağlamı tekrar anlatıp hangisinin bittiğini takip ediyordunuz. Yeni modelde bu iş Claude'un üzerinde.

## "Thread" nedir, nasıl oluşturuluyor?

Bir thread, proje konuşmasına yazdığınız bir görevden doğan tam bir Claude Code bulut oturumu. Bir hata raporu, bir stack trace ya da bir görev listesi yapıştırdığınızda Claude bunun için yeni bir thread mi açacağına, yoksa o alanda zaten çalışan bir thread'e mi yönlendireceğine karar veriyor. Her thread; projenin repolarını, talimatlarını, hafızasını, ilgili `CLAUDE.md` dosyalarını ve claude.ai hesabınıza bağlı MCP bağlayıcılarını baştan devralarak işe başlıyor — bu noktada [Claude Code'da MCP sunucularını nasıl yönettiğinizi](/tr/posts/claude-code-mcp-sunucularini-nasil-yonetirsin) zaten biliyorsanız aynı mantık burada da geçerli.

Kod değiştiren bir thread yeni bir branch açar, gerektiğinde pull request oluşturur ve CI başarısız olduğunda ya da bir inceleme yorumu geldiğinde otomatik düzeltmeyle (auto-fix) tekrar devreye girer.

## "Always-on" ne anlama geliyor?

Kısa cevap: laptobunuzu kapatmanız thread'leri durdurmuyor. Her thread Anthropic'in sunucularında, sizin makinenizden bağımsız çalışan bir bulut oturumu olduğu için iş sürüyor; siz bir saat sonra ya da ertesi sabah geri döndüğünüzde Overview panelinde hangi thread'in bittiğini, hangi pull request'in incelemeye hazır olduğunu ve hangi thread'in cevabınızı beklediğini görüyorsunuz. Telefondan da kontrol edip yönlendirebiliyorsunuz.

Bu, eski tek oturumlu Claude Code kullanımından en büyük davranış farkı: artık tek bir oturumu "dadılık" yapmak yerine, birden fazla işin arka planda ilerlemesini izliyorsunuz. Konuyla ilgisi olan bir başka yetenek de [oturumlar arası mesajlaşma](/tr/posts/claude-code-oturumlar-arasi-mesajlasma) — thread'lerin birbirine ve koordinatöre rapor vermesi de benzer bir temel üzerine kurulu.

## Betaya kim erişebilir, ne zaman herkese açılacak?

Beta, 17 Eylül 2026'da bulut oturumlarını daha önce kullanmış ve claude.ai sohbetinde ya da Cowork'te henüz proje açmamış seçili Pro ve Max abonelerine açıldı; [MLQ'nun haberine](https://mlq.ai/news/anthropic-opens-parallel-claude-code-projects-beta-to-select-pro-and-max-users/) göre diğer Pro/Max kullanıcıları bekleme listesine yazılabiliyor. Anthropic'in açıkladığı genişleme planı şöyle:

| Aşama | Kapsam |
| --- | --- |
| 17 Eylül 2026 | Bulut oturumu kullanan seçili Pro/Max abonelerine beta |
| Önümüzdeki haftalar | Daha fazla Pro/Max kullanıcısına genişleme |
| Sonraki adım | Team ve Enterprise planlarına açılma |
| Sonraki adım | Claude.ai sohbet ve Cowork'e entegrasyon |
| Tarihi açıklanmadı | Bulut yanında yerel (local) çalıştırma desteği |

Şu an için Projects yalnızca github.com'daki repolarla çalışıyor; GitHub Enterprise Server, GitLab veya Bitbucket desteklenmiyor ve reponuza Claude GitHub App'in kurulu olması gerekiyor.

## Neden önemli? Geliştiriciye ne kazandırıyor?

Asıl kazanç, daha önce sıralı yapılan işlerin artık paralelleşmesi. [MarkTechPost'un aktardığı örnekte](https://www.marktechpost.com/2026/09/17/anthropic-launches-claude-code-projects-in-beta-parallel-cloud-sessions-that-keep-running-after-you-close-your-laptop/) bir geliştirici, checkout akışının p75 gecikmesini düşürme hedefiyle bir proje açıyor; Claude bunun üzerine uç noktaları profillemek, optimizasyonları test etmek ve pull request açmak için birden fazla thread başlatıyor — hepsi aynı konuşmaya rapor veriyor. Bu, [agent mı workflow mu](/tr/posts/ai-agent-mi-workflow-mu) tartışmasında "agent" ucuna daha net bir örnek: hedefi siz veriyorsunuz, aracı adımları ve önceliklendirmeyi Claude belirliyor.

Benim görüşüm: bu özelliğin gerçek değeri hız değil, bağlamı bir kere yazıp tekrar tekrar anlatmamak. Hangi branch'i hedefleyeceğinizi, hangi test komutunu çalıştıracağınızı bir kez proje talimatına yazdığınızda her yeni thread bunu devralıyor — beş ayrı oturuma beş kez aynı şeyi anlatmak yerine.

## Sınırlar ve riskler neler?

En büyük risk, kullanım limitlerinin hızla tükenmesi. Yeni bir proje her thread'i varsayılan olarak Opus modelinde ve yüksek efor seviyesinde çalıştırıyor; bu da plan limitlerini tek oturumlu kullanıma göre çok daha hızlı tüketiyor. [VentureBeat'in haberinde](https://venturebeat.com/orchestration/anthropic-launches-claude-code-projects-an-always-on-conversation-that-remembers-and-delegates-your-long-running-dev-work) de vurgulandığı gibi Anthropic, günde en fazla 200 yeni thread sınırı koymuş durumda ve bir thread limite takıldığında sırada bekleyip limit yenilendiğinde otomatik devam ediyor — bu da [Eylül 2026'daki haftalık limit değişikliklerini](/tr/posts/claude-code-limit-artisi-eylul-2026-kesinti-mi) takip eden kullanıcılar için özellikle önemli.

İkinci risk, inceleme yükü. Paralel çalışan beş-altı thread aynı anda beş-altı pull request açabiliyor; bunları gerçekten okuyup onaylamak insan tarafında darboğaz oluşturabilir. Üçüncüsü, Projects şu an yalnızca GitHub reposu ve yüklediğiniz dosyalarla çalışıyor — yerel veritabanı, VPN arkasındaki bir API ya da cihaz emülatörü gibi yalnızca kendi makinenizden erişilebilen araçlar için henüz uygun değil; yerel çalıştırma desteği takvimsiz bir gelecek maddesi. Son olarak beta hâlâ dar bir kullanıcı kitlesine açık, dolayısıyla davranışın önümüzdeki haftalarda değişmesi olası.

## Nasıl kullanmaya başlanır?

claude.ai/code adresinde ya da masaüstü uygulamasının Code sekmesinde "Projects" görünüyorsa Pro veya Max planınızla beta erişiminiz var demektir. Sıfırdan bir proje açarken isim, isteğe bağlı bir hedef cümlesi ("checkout p75 gecikmesini 300 ms altında tut" gibi) ve çalışılacak repoları giriyorsunuz. İlk turda Claude reponuzu inceleyip önerilen kurulum adımlarını (eklenecek repolar, oluşturulacak rutinler, başlatılabilecek thread'ler) sunabiliyor. İlk gerçek görev grubunu göndermeden önce proje talimatlarını yazmak — hangi branch'e hedef alınacağı, işin nasıl doğrulanacağı gibi — sonraki thread'lerin doğru başlamasını sağlıyor.

Küçük ölçekli bir kullanım arıyorsanız [küçük işletmeler için Claude iş akışları](/tr/posts/kucuk-isletmeler-icin-claude-workflow) yazısındaki adımlar da benzer bir "bir kere tanımla, tekrar tekrar kullan" mantığına dayanıyor.

## Sıkça Sorulan Sorular

### Claude Code Projects ücretsiz mi?

Hayır, Projects yalnızca Pro ve Max plan sahiplerine açık ve kullanım, aynı plan token limitlerinden düşüyor. Üstelik varsayılan ayarlarla (Opus, yüksek efor, birden fazla paralel thread) tek oturumlu kullanıma göre limitinizi çok daha hızlı tüketiyorsunuz.

### Eski Projects özelliği kayboldu mu?

Hayır, ama davranışı tamamen değişti. Eskiden claude.ai sohbetinde talimat ve referans dosyası tutulan pasif bir klasördü; Eylül 2026'daki yeni sürüm bunun yerine kod yazan, pull request açan ve laptop kapansa da çalışmaya devam eden aktif bir orkestratör.

### Thread sayısında bir sınır var mı?

Evet, Anthropic hesap başına günde en fazla 200 yeni thread sınırı koymuş durumda. Kaç thread'in aynı anda çalışacağına dair sabit bir sayı yok; siz bir tercih belirtebilirsiniz ama Claude işin gerektirdiği kadarını başlatabiliyor.

### Claude Code Projects yerelde (kendi bilgisayarımda) çalışıyor mu?

Hayır, şu an için her thread yalnızca Anthropic'in sunucularında, github.com'daki bir repo kopyası üzerinde çalışıyor. Yerel veritabanı ya da VPN arkasındaki servisler gibi yalnızca kendi makinenizden erişilebilen kaynaklar için uygun değil; yerel çalıştırma desteği ilerleyen bir tarihte planlanıyor ama henüz duyurulmadı.
