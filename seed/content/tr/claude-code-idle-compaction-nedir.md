---
title: "Claude Code Idle Compaction Nedir?"
slug: "claude-code-idle-compaction-nedir"
translationKey: "claude-code-idle-compaction-2026"
locale: "tr"
excerpt: "Kısa cevap: Idle compaction, 200.000 token'ı aşan bir Claude Code oturumunu 54 dakika boşta kalınca, cache süresi dolmadan otomatik sıkıştırıyor."
category: "ai"
tags: ["claude", "ai-coding", "developer-experience", "automation"]
publishedAt: "2026-10-17"
seoTitle: "Claude Code Idle Compaction Nedir? Nasıl Çalışır"
seoDescription: "Kısa cevap: Idle compaction, 200.000 token'ı aşan bir Claude Code oturumunu 54 dakika boşta kalınca, cache süresi dolmadan otomatik sıkıştırıyor."
---

Kısa cevap: Idle compaction, 200.000 token'ı aşan bir Claude Code konuşmasını siz klavyeye dokunmadan yaklaşık 54 dakika geçirdiğinde, konuşmanın 1 saatlik prompt cache süresi dolmadan önce otomatik olarak özetleyip sıkıştıran bir özellik. Anthropic bunu 14 Ekim 2026'da v2.1.299 ile terminale ekledi, 16 Ekim 2026'da v2.1.302 ile de [resmi değişiklik günlüğünde](https://code.claude.com/docs/en/changelog) görüldüğü gibi `/config` ekranına bir açma/kapama satırı olarak taşıdı. Amaç tek: cache süresi dolduğunda bir sonraki mesajınızın tüm geçmişi sıfırdan işlemesini önlemek.

Bu, Claude Code'un aynı hafta içinde sessizce değiştirdiği tek davranış da değil. 16 Ekim'de çıkan aynı sürümde, alt ajanları "fork" ederek çalıştırma da `claude -p`, Agent SDK, masaüstü uygulaması ve VS Code'da varsayılan hâle geldi. İkisi de aynı eğilimi gösteriyor: Claude Code, oturum ve ajan yönetiminde kullanıcı müdahalesine daha az ihtiyaç duyan bir modele kayıyor.

## Idle Compaction Nasıl Çalışır?

Idle compaction, konuşmanız 200.000 token eşiğini geçtiğinde ve siz yaklaşık 54 dakika boyunca hiçbir mesaj göndermediğinde devreye giriyor; Claude Code bu süre içinde konuşmayı arka planda özetliyor ve prompt cache'in 1 saatlik ömrü dolmadan yeni bir sıkıştırılmış hâl hazırlıyor. Böylece boşta geçen bir toplantı veya öğle arasından sonra geri döndüğünüzde, sistem cache'i kaybetmiş ve her şeyi yeniden işlemek zorunda kalmış olmuyor; sıkıştırılmış özet zaten hazır bekliyor.

Eşik varsayılan olarak 200.000 token, ama bu rakam her oturum için sabit bir duvar değil. `CLAUDE_CODE_IDLE_COMPACT_MIN_TOKENS` ortam değişkeniyle bu eşiği yükseltip düşürebiliyorsunuz; özellik v2.1.290 ve sonrasını gerektiriyor. 16 Ekim'deki v2.1.302 güncellemesiyle birlikte, bir sıkıştırma gerçekleştiğinde Claude Code artık size bunu nasıl kapatacağınızı anlatan bir bildirim de gösteriyor — önceki sürümlerde bu bilgi `/config` dışında görünmüyordu.

## Idle Compaction mı, On-Demand Compaction mı?

Bu ikisi aynı şey değil: idle compaction otomatik ve zaman tabanlı, [on-demand compaction](/tr/posts/claude-on-demand-compaction-nedir) ise geliştiricinin Messages API isteğine `compaction` parametresi koyarak manuel olarak tetiklediği bir Claude API özelliği. Biri terminalde arka planda çalışan bir CLI davranışı, diğeri API seviyesinde bilinçli bir çağrı.

| Özellik | Idle Compaction | On-Demand Compaction |
|---|---|---|
| Nerede çalışır | Claude Code CLI / SDK / IDE eklentileri | Claude Messages API |
| Tetikleyici | ~54 dakika boşta kalma + 200K+ token | Geliştiricinin `compaction` parametresi göndermesi |
| Kontrol | Otomatik, arka planda | Manuel, tek seferlik istek |
| Kapatma | `"idleCompaction": false` veya `/config` | Parametreyi göndermemek |
| Minimum sürüm | v2.1.290+ | Messages API beta başlığı gerektirir |
| Amaç | Prompt cache'i boşta geçen sürede korumak | İş adımı bittiğinde geçmişi bilinçli sıkıştırmak |

İki mekanizma da aynı temel sorunu çözüyor — uzun oturumların bağlam penceresini ve cache'i şişirmesi — ama devreye girdiği an farklı. Idle compaction'ı siz tetiklemiyorsunuz; o sizi bekliyor. Pratikte ikisini birlikte de kullanabilirsiniz: bir ajan iş akışında belirli bir adım bittiğinde on-demand compaction ile bilinçli bir kesim yapıp, kalan boşta geçen sürelerde idle compaction'ın arka planda devreye girmesine izin verebilirsiniz. Bu, tek bir oturumun hem planlı hem de plansız boşluklarını kapsayan bir güvenlik ağı oluşturuyor.

## Idle Compaction'ı Nasıl Kapatır veya Eşiğini Değiştirirsin?

Özelliği tamamen kapatmak istiyorsanız `settings.json` dosyanıza tek bir satır eklemeniz yeterli:

```json
{
  "idleCompaction": false
}
```

Kapatmak istemiyor ama eşiği değiştirmek istiyorsanız, varsayılan 200.000 token sınırını ortam değişkeniyle ayarlayabilirsiniz:

```bash
export CLAUDE_CODE_IDLE_COMPACT_MIN_TOKENS=150000
```

16 Ekim'deki güncelleme sonrası en pratik yol ise `/config` komutunu çalıştırıp "Idle compaction" satırını bulmak; orada hem açma/kapama hem de son sıkıştırmanın ne zaman olduğuna dair bilgi görünüyor. Güncel sürüm numaraları ve tam değişiklik metni her zaman [code.claude.com/docs/en/changelog](https://code.claude.com/docs/en/changelog) adresinde.

## Prompt Cache Süresi Dolunca Ne Kaybedersin?

Prompt cache süresi dolduğunda kaybettiğin şey, o konuşmanın tamamını baştan işleme maliyeti. [Anthropic'in resmi haber sayfasında](https://www.anthropic.com/news) duyurulan fiyatlandırmaya göre cache'den okuma, taze girdi işlemekten çok daha ucuz; Sonnet 5.5 için cache okuma ücreti milyon token başına 0,10 dolara kadar düşüyor, taze girdi işleme ise bunun kat kat üzerinde. 200.000 token'lık bir konuşma cache'i kaybedip sıfırdan işlendiğinde, hem bu fiyat farkı hem de ilk token'a kadar geçen gecikme geri döner — özellikle uzun bir araştırma veya refactoring oturumunda öğle arası sonrası dönen bir geliştirici için bu, fark edilir bir bekleme süresi demek.

Idle compaction tam bu boşluğu dolduruyor: siz boştayken Claude Code, cache'in 1 saatlik ömrü dolmadan konuşmayı özetleyip küçültüyor, böylece döndüğünüzde ya hiç cache kaybı yaşamıyorsunuz ya da kaybın maliyeti çok daha küçük bir özet üzerinden karşılanıyor. Bu, özellikle arka planda saatlerce çalışan ajan iş akışlarında — örneğin bir CI pipeline'ını izleyen veya uzun bir migration'ı adım adım yürüten oturumlarda — doğrudan fatura farkına dönüşüyor.

## Bu Hafta Değişen Başka Ne Var?

Aynı v2.1.302 sürümünde Claude Code, [alt ajanları fork ederek çalıştırmayı](/tr/posts/claude-code-subagent-arka-plan-ajanlari) `claude -p`, Agent SDK, masaüstü uygulaması ve VS Code'da varsayılan yaptı; bu davranış terminalde zaten varsayılandı. `CLAUDE_CODE_FORK_SUBAGENT=0` değişkeniyle eski davranışa dönebiliyorsunuz, ama `claude mcp serve` üzerinden çalışan oturumlar bu seçeneği hiç görmüyor. Aynı sürümde masaüstü uygulaması ve VS Code, ana konuşmanın alt ajanlarını artık her zaman arka planda çalıştırıyor — terminalin zaten yaptığı gibi — ama bir alt ajanın kendi başlattığı iç içe ajan çağrıları `claude -p`, SDK, masaüstü ve VS Code'da varsayılan olarak ön planda kalıyor.

Açıkçası bu iki değişikliği yan yana görmek, Anthropic'in Claude Code'u "her ayarı siz yapın" modelinden "mantıklı bir varsayılanla gelsin, isteyen kapatsın" modeline taşıdığını gösteriyor. [Auto mode'un varsayılan hâle gelmesinde](/tr/posts/claude-code-auto-mode-nasil-calisir) de aynı eğilimi görmüştük; idle compaction bunun oturum yönetimi tarafındaki en son örneği.

## Idle Compaction Neden Önemli?

Uzun bir ajan oturumunda — özellikle [harcama limitlerini ve cache metriklerini](/tr/posts/claude-code-harcama-limitleri-prompt-cache) takip eden ekiplerde — prompt cache'in süresi dolması gerçek bir maliyet demek: 1 saatlik cache penceresi kaçırıldığında, 200.000+ token'lık bir konuşmanın tamamı yeniden işleniyor ve bu hem gecikme hem de token maliyeti olarak geri dönüyor. Idle compaction, bu kaybı sıfıra indirmiyor ama boşta geçen süreyi riske çevirmek yerine fırsata çeviriyor; siz geri geldiğinizde sistem zaten hazır.

## Sıkça Sorulan Sorular

### Idle compaction otomatik olarak açık mı gelir?

Evet, idle compaction v2.1.290 ve sonraki sürümlerde varsayılan olarak açık geliyor; kapatmak için `settings.json` dosyanıza `"idleCompaction": false` eklemeniz veya `/config` ekranından ilgili satırı kapatmanız gerekiyor.

### Idle compaction hangi token eşiğinde devreye girer?

Varsayılan eşik 200.000 token ve bu eşiğe ulaşmış bir konuşma yaklaşık 54 dakika boşta kaldığında tetikleniyor. Eşiği `CLAUDE_CODE_IDLE_COMPACT_MIN_TOKENS` ortam değişkeniyle değiştirebilirsiniz; örneğin 150.000 token'a düşürmek isterseniz bu değişkeni 150000 olarak ayarlamanız yeterli.

### Idle compaction, on-demand compaction'ın yerini mi alıyor?

Hayır, ikisi farklı katmanlarda çalışan ayrı özellikler. Idle compaction Claude Code CLI'nin otomatik, zaman tabanlı bir davranışı; on-demand compaction ise Claude Messages API'de geliştiricinin `compaction` parametresiyle manuel olarak tetiklediği ayrı bir mekanizma.

### Fork subagent varsayılanı idle compaction'ı etkiler mi?

Doğrudan değil; ikisi aynı v2.1.302 sürümünde çıkan ama birbirinden bağımsız iki değişiklik. Fork subagent varsayılanı alt ajanların nasıl başlatıldığını belirliyor, idle compaction ise ana konuşmanın ne zaman özetleneceğini belirliyor.

### Idle compaction'ı kapatmak performansı etkiler mi?

Kapattığınızda Claude Code hiçbir şeyi otomatik özetlemez, bu da uzun boşta kalma sürelerinden sonra cache'in süresinin dolma riskini geri getirir. Performans kaybı yaşamazsınız ama boşta geçen sürenin maliyet avantajından da vazgeçmiş olursunuz; `"idleCompaction": false` ayarı sadece bu otomatik davranışı devre dışı bırakıyor, konuşmanın kendisini veya manuel sıkıştırma seçeneklerinizi değiştirmiyor.
