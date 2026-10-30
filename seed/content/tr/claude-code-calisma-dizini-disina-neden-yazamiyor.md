---
title: "Claude Code Artık Çalışma Dizini Dışına Neden Yazamıyor?"
slug: "claude-code-calisma-dizini-disina-neden-yazamiyor"
translationKey: "claude-code-blocks-writes-outside-working-dir-2026"
locale: "tr"
excerpt: "Kısa cevap: 30 Ekim 2026 2.1.314 sürümü, blockWritesOutsideWorkingDirectories ile Write/Edit/NotebookEdit'in dizin dışına yazmasını her izin modunda engelliyor."
category: "software-engineering"
tags: ["claude", "ai-coding", "ai-agents"]
publishedAt: "2026-10-30"
seoTitle: "Claude Code 2.1.314: Çalışma Dizini Dışı Yazma Engeli"
seoDescription: "Claude Code'un yeni blockWritesOutsideWorkingDirectories ayarı ne yapıyor, bypassPermissions ve auto modu nasıl etkiliyor, CI'da neden önemli?"
---

Kısa cevap: Claude Code'un 30 Ekim 2026'da yayınlanan 2.1.314 sürümü, `permissions.blockWritesOutsideWorkingDirectories` ayarını ekledi. Bu ayar açıkken Write, Edit ve NotebookEdit araçları çalışma dizinleri dışındaki hiçbir yola yazamıyor — `bypassPermissions` ve otomatik mod dahil, **her** izin modunda geçerli bir engel bu.

## blockWritesOutsideWorkingDirectories gerçekte ne yapıyor?

Bu ayar, Claude Code'un üç dosya-değiştirme aracını — Write, Edit, NotebookEdit — çalışma dizini dışındaki bir yola yazma denemesinden önce durduruyor. Resmi [değişiklik günlüğündeki](https://code.claude.com/docs/en/changelog) ifade net: "Write, Edit and NotebookEdit refuse paths outside the working directories in every permission mode." Yani bu bir izin istemi değil, sabit bir kural; ajan "izin modunu" ne kadar gevşetirse gevşetsin bu sınırı aşamıyor.

Ayarı açık hale getirmek, `.claude/settings.json` dosyasına şu satırı eklemek kadar basit:

```json
{
  "permissions": {
    "blockWritesOutsideWorkingDirectories": true
  }
}
```

## Bu ayar hangi izin modlarını kapsıyor?

Hepsini kapsıyor — `default`, `acceptEdits`, `bypassPermissions` ve `auto` dahil. Bu, önceki davranıştan temel bir fark: `bypassPermissions` modu adından da anlaşılacağı gibi onay istemlerini atlıyordu, ama bu ayar açık olduğunda dizin sınırı izin modundan bağımsız bir sabit haline geliyor. Nöbetsiz (unattended) çalışan bir CI ajanı ya da otomasyon betiği, yanlışlıkla ya da kötü niyetli bir promptla yönlendirilse bile çalışma dizini dışına dosya yazamıyor.

2.1.309 sürümünde (22 Ekim 2026) yapılan ayrı bir değişiklik de aynı yöne işaret ediyor: bypass modunda tehlikeli `rm`/`rmdir` komutları artık anında reddediliyor, bir yeniden yazma önerisiyle birlikte — nöbetsiz oturumların durup kalmasını önlerken yıkıcı komutları da süzüyor.

Bu, pratikte şu anlama geliyor: bir ekip bir ajanı tamamen insan gözetimi olmadan — örneğin gece boyunca çalışan bir bağımlılık güncelleme görevinde — çalıştırmak istediğinde, önceden "ajan hangi izin modunda, ona ne kadar güvenebilirim" sorusuna her seferinde yeniden cevap vermesi gerekiyordu. Bu ayar o soruyu kısmen gereksiz kılıyor: izin modundan bağımsız bir taban çizgi garantisi olduğu için, ekip hangi modu seçerse seçsin dizin sınırı sabit kalıyor.

## Bu ayar, okuma tarafındaki eşdeğerinden nasıl farklı?

`permissions.blockReadsOutsideWorkingDirectories` adlı okuma tarafı eşdeğeri, haftalar önceden beri mevcuttu ve Read, Grep, Glob gibi araçların çalışma dizini dışını okumasını kısıtlıyordu. 26 Ekim 2026'daki 2.1.311 sürümü bu ayarla ilgili bir Linux sandbox hatasını (`bwrap: Can't create file`) düzeltti — yani ayar aylardır üretimde kullanılıyordu. Yazma tarafının aynı sertlikte bir engele kavuşması için neredeyse bir ay geçti.

Bu gecikme tesadüf değil: okuma riski (gizli bir dosyayı yanlışlıkla görmek) ile yazma riski (üretim dışı bir yola, hatta sistem dosyalarına dosya basmak) farklı ağırlıkta. Anthropic önce daha düşük riskli tarafı kilitleyip davranışı gözlemlemiş, sonra yazma tarafına geçmiş görünüyor.

| | Okuma engeli (blockReadsOutsideWorkingDirectories) | Yazma engeli (blockWritesOutsideWorkingDirectories) |
|---|---|---|
| Etkilediği araçlar | Read, Grep, Glob, LSP | Write, Edit, NotebookEdit |
| Yayın | ~2.1.257 civarı (üretimde haftalardır) | 2.1.314, 30 Ekim 2026 |
| Risk türü | Veri sızıntısı / gizlilik | Veri bozulması / yıkıcı yazma |
| İzin modundan bağımsız mı | Evet | Evet |

## Bu neden CI/CD'de otomatik çalışan ajanlar için önemli?

Çünkü CI ortamında bir ajan genelde insan onayı beklemeden çalışıyor ve tam da bu yüzden "çalışma dizini dışına yazamama" garantisi bir nezaket değil, bir güvenlik sınırı haline geliyor. [CI/CD'ye ajan bağlarken](/tr/posts/ai-ajanlari-cicd-guvenle-baglamak) en büyük risk, ajanın beklenmedik bir promptla (ör. bir bağımlılığın içine gömülü talimatlarla) repo dışına ya da paylaşılan bir yapı makinesine yazması; bu ayar o senaryoyu kapatıyor, tamamen değil ama önemli ölçüde.

Bu, [agentjacking](/tr/posts/agentjacking-yeni-ai-ajan-saldirisi) olarak adlandırılan saldırı sınıfıyla doğrudan ilişkili: bir ajanı ele geçiren ya da yanıltan bir saldırganın asıl hedefi genelde dosya sistemine erişim kazanmak. Çalışma dizini dışına yazmayı izin modundan bağımsız olarak kapatmak, bu saldırı yüzeyinin bir parçasını daraltıyor.

## Bu ayarı pratikte nasıl açarsın?

Tek satır ekliyorsun, ama o satırı nereye koyduğun kapsamı belirliyor. Claude Code izin ayarlarını üç yerden okuyor: `.claude/settings.json` (proje genelinde, genelde repoya commit edilir), `.claude/settings.local.json` (yerel üzerine yazmalar, genelde .gitignore'da) ve makine genelindeki tüm projeler için geçerli bir kullanıcı ayarı dosyası. `permissions` anahtarının altına `blockWritesOutsideWorkingDirectories: true` eklemeyi proje dosyasına yaparsan, repoyu klonlayan her katkıcı ve repoyu her çeken CI işi aynı sınırı otomatik olarak devralıyor — kimsenin elle açmayı hatırlamasına gerek kalmıyor.

Bu, operasyonel olarak önemli bir fark: her geliştiricinin kendi makinesinde elle açması gereken bir ayar er ya da geç kayar, çünkü biri her zaman unutur. `.claude/settings.json` içine commit edilen bir ayar ise repoyla birlikte geliyor — taze bir `git clone` sonrası başlatılan bir Claude Code oturumu, her job için repoyu sıfırdan çeken bir CI runner'ı da dahil, bu kısıtlamayı otomatik olarak devralıyor.

## Bu ayar her riski ortadan kaldırıyor mu?

Hayır — ayar sadece Write, Edit ve NotebookEdit araçlarını kapsıyor; Bash üzerinden çalıştırılan bir komut hâlâ çalışma dizini dışına yazabilir, çünkü kabuk komutları bu üç aracın kapsamında değil. [Claude Code vs Cursor vs Antigravity](/tr/posts/claude-code-cursor-antigravity-2026) karşılaştırmasında da görüldüğü gibi, farklı ajan araçları dosya erişimini farklı katmanlarda kısıtlıyor — bazıları işletim sistemi seviyesinde kum havuzuna (Linux'ta `bwrap`, yukarıdaki 2.1.311 düzeltmesinde geçen katman) güveniyor, bazıları da bu ayar gibi araç-bazlı kontrollere. Bu yeni ayar Claude Code'un araç katmanındaki bir sınır, kabuk ya da işletim sistemi katmanındaki değil; dolayısıyla ajanları nöbetsiz çalıştıran ekiplerin bunu kum havuzlu komut çalıştırmayla eşleştirmesi, tek başına yeterli bir çözüm olarak görmemesi gerekiyor.

Bu sürüm ve diğer her sürümdeki değişikliklerin tam listesi projenin kendi [GitHub'daki CHANGELOG.md dosyasında](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md) tutuluyor; barındırılan değişiklik günlüğü sayfası güncellemede geciktiğinde belirli bir sürümün davranışını doğrulamak için en hızlı yer burası.

Kendi değerlendirmem: bu, "ajan ne yapabilir" sorusuna net bir cevap eklemekten çok, "ajan ne yapamaz"ı garantiye bağlayan türden bir değişiklik — ve bu tür negatif garantiler, özellikle nöbetsiz otomasyonlarda, pozitif özelliklerden daha değerli. Bash komutlarını da aynı sertlikte kısıtlayan bir takip ayarı gelirse bu hikaye tamamlanmış olur.

Ekip olarak ajanları [açık kaynak güvenliği](/tr/posts/ai-copu-acik-kaynak-guvenligi) bağlamında değerlendiren herkes için bu, "varsayılan olarak güvenli" ilkesinin araç seviyesinde nasıl uygulanabileceğine dair somut bir örnek. Bu tür bir sınırın değerini anlamak için büyük ve manşetlere çıkan bir olayı beklemeye gerek yok; küçük, sıradan bir yanlış yapılandırmanın ya da beklenmedik bir promptun sessizce neye yol açabileceğini düşünmek bile yeterli.

## Sıkça Sorulan Sorular

### blockWritesOutsideWorkingDirectories ayarı ne yapar?

Claude Code'un Write, Edit ve NotebookEdit araçlarının çalışma dizinleri dışındaki hiçbir yola yazmasını, hangi izin modunda olunursa olunsun (bypassPermissions ve auto mod dahil) engeller. Ayar `.claude/settings.json` içinde `permissions.blockWritesOutsideWorkingDirectories: true` olarak açılır.

### Bu ayar bypassPermissions modunu da kapsıyor mu?

Evet. Değişiklik günlüğündeki ifade "her izin modunda" diyor; bypassPermissions modunun onay istemlerini atlaması, bu dizin sınırını atlamasına izin vermiyor — sınır izin modundan tamamen bağımsız çalışıyor.

### Okuma engeli ile yazma engeli arasındaki fark nedir?

blockReadsOutsideWorkingDirectories, Read/Grep/Glob gibi araçların çalışma dizini dışını okumasını haftalar önce kısıtlamaya başlamıştı; blockWritesOutsideWorkingDirectories ise 30 Ekim 2026'da (2.1.314) yazma araçları için aynı sınırı getirdi. Yazma riski genelde okuma riskinden daha yıkıcı olduğu için bu ayrım önemli.

### Bu ayar Bash komutlarının dizin dışına yazmasını da engeller mi?

Hayır. Ayar sadece Write, Edit ve NotebookEdit araçlarını kapsıyor; bir Bash komutu (örneğin bir betik veya CLI aracı) hâlâ çalışma dizini dışına dosya yazabilir, çünkü kabuk komutları bu üç aracın denetim kapsamında değil.
