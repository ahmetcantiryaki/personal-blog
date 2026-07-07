---
title: "Claude Code Subagent ve Arka Plan Ajanları: İş Akışı Rehberi"
slug: "claude-code-subagent-arka-plan-ajanlari"
translationKey: "claude-code-subagents"
locale: "tr"
excerpt: "Temmuz 2026 itibarıyla Claude Code subagent'ları varsayılan olarak arka planda çalışıyor ve arka plan ajanları kendiliğinden taslak PR açıyor. İşte pratik akış."
category: "ai"
tags: ["ai-agents", "ai-coding", "ai-tools", "workflow", "automation"]
publishedAt: "2026-07-07"
seoTitle: "Claude Code Subagent ve Arka Plan Ajanları Rehberi"
seoDescription: "Subagent'ları varsayılan arka planda çalıştırma, taslak PR açan arka plan ajanları ve yeni Manual izin moduna pratik bir Claude Code iş akışı rehberi."
---

1 Temmuz 2026'da Claude Code v2.1.198, gün boyunca nasıl çalıştığınızı sessizce değiştiren bir varsayılanı tersine çevirdi: **subagent'lar artık varsayılan olarak arka planda çalışıyor.** Aynı sürüm, arka plan ajanlarının siz döngüyü izlemeden otomatik commit atmasına, push etmesine ve taslak pull request açmasına izin verdi. İki gün sonra v2.1.200, varsayılan izin modunu Default'tan Manual'a çevirdi. Claude Code'u bu hafta güncelleyip zeminin kaydığını hissettiyseniz, sebebi bu.

Bu bir özellik listesi değil. Bu, önemli olan üç değişimin çalışan bir rehberi — **Claude Code subagent'larını** ne zaman dağıtacağınız (fan-out), arka plan ajanlarının bir isteği nasıl taslak PR'a dönüştürdüğü ve Manual izin modunun gününüzde neyi değiştirdiği. Aşağıdaki tüm bilgiler Temmuz 2026 itibarıyla güncel ve kaynağı [Claude Code changelog](https://code.claude.com/docs/en/changelog).

## Bu hafta ne değişti, tek tabloda

1–6 Temmuz haftası beş sürüm çıktı. Her birinin iş akışınıza gerçekte ne yaptığı şöyle.

| Sürüm | Tarih | Önemli değişiklik | Neden önemli |
|-------|-------|-------------------|--------------|
| v2.1.196 | 29 Haz | Kurum varsayılan modelleri; güvenilmeyen repo'nun `.mcp.json`'ı artık kendiliğinden başlamıyor | Daha güvenli klonlar, kurum çapında model politikası |
| v2.1.198 | 1 Tem | Subagent'lar varsayılan arka planda; arka plan ajanları otomatik commit/push ve taslak PR açar; `/dataviz` skill; Chrome'da Claude GA | Büyük değişim — paralellik varsayılan oluyor |
| v2.1.199 | 2 Tem | Yığılmış (stacked) skill çağrıları; rate-limit sonrası subagent kısmi iş kurtarma | Uzun çalışmalar bir 429'u atlatır |
| v2.1.200 | 3 Tem | Varsayılan izin modu Default'tan **Manual'a** geçti | Aksini seçmedikçe her işlem gözden geçirilir |
| v2.1.202 | 6 Tem | Dinamik iş akışı boyutu yapılandırması; iş akışı telemetrisi | Fan-out genişliğini ayarla; turların nereye gittiğini gör |

Hepsinin altında yatan şey: 30 Haziran'da çıkan **Claude Sonnet 5** artık varsayılan model. Bu hız akademik değil — Anthropic'in [2026 Agentic Coding Trends Report](https://resources.anthropic.com) raporuna göre kendi kodunun çoğu artık Claude Code ile yazılıyor; Stripe onu 1.370 mühendise yaydı ve bir ekip 10.000 satırlık bir Scala'dan Java'ya geçişi dört günde bitirdi — elle yaklaşık on mühendis-haftası olarak tahmin edilen bir iş.

## Subagent'ları ne zaman dağıtmalı (fan-out)

Subagent, kendi bağlam penceresine sahip, dar kapsamlı bir göreve yolladığınız bir Claude Code örneğidir. Bu haftadan önce onları arka plana elle almanız gerekiyordu; artık arka plan varsayılan, yani doğru zihinsel model fan-out: bağımsız işi birkaç subagent'a bölüp paralel çalıştırırken siz ana akışı yönlendirmeye devam edersiniz.

Sezgi, [AI agent mı workflow mu](/tr/posts/ai-agent-mi-workflow-mu) kararını yöneten sezginin aynısıdır — yalnızca alt görevler gerçekten bağımsızsa dağıtın. İyi adaylar:

- **Paralel inceleme.** "Auth modülünü güvenlik açıkları için denetle" ve "cache katmanını profille" arasında veri bağımlılığı yok. İki subagent, iki rapor, bekleme yok.
- **Dosya veya paket bazında fan-out.** Her paketin izole olduğu bir monorepo göçü. Paket başına bir subagent, her biri kendi taslak PR'ını açar.
- **Rol bölünmüş inceleme.** Bir subagent doğruluk, biri güvenlik, biri test kapsamı için inceler — çok perspektifli desen, artık eşzamanlı çalıştıkları için ucuz.

Kötü adaylar, ortak ve değişen bir duruma sahip görevlerdir: subagent B başlamak için bile subagent A'nın çıktısına ihtiyaç duyuyorsa elinizde fan-out değil bir zincir vardır ve planı olan tek bir ajan, birbirine çarpan iki ajanı yener. [Agent view](https://code.claude.com/docs/en/changelog) hepsini aynı anda izlemenizi sağlar, ama on kafası karışık subagent'ı izlemek üretkenlik değildir.

```bash
# Ana oturumda üç dar kapsamlı subagent dağıt.
# v2.1.198 itibarıyla her biri varsayılan olarak arka planda çalışır.
> Bir subagent ile src/auth'u injection ve authz açıkları için denetle.
> Paralel olarak bir subagent ile Redis cache sıcak yollarını profille.
> Bir üçüncüsüyle payments paketinin test kapsamını kontrol et.

# v2.1.202 dinamik iş akışı boyutu yapılandırması ekler — fan-out
# genişliğini sınırla ki rate limit'e karşı yirmi ajan başlatmayasın.
```

Gerçekten işe yarayan bir iyileştirme v2.1.199'da geldi: **rate-limit sonrası subagent kısmi iş kurtarma.** Önceden görev ortasında 429 alan bir subagent ilerlemesini kaybedebiliyordu; artık kısmi işi kurtarıp devam ediyor. 20 dakikalık bir göçün bir rate limit'te buharlaştığını izlediyseniz, bu iyileştirmenin neden kuru bir changelog satırından daha önemli olduğunu bilirsiniz.

## Arka plan ajanları nasıl commit atar, push eder ve taslak PR açar

Manşet yetenek bu. Bir arka plan ajanı artık "işte diff" deyip durmuyor. v2.1.198 itibarıyla görevi ta incelenebilir bir pull request'e kadar taşıyabiliyor: değişikliği yap, testleri çalıştır, **commit at, bir branch push et ve taslak PR aç** — sonra size bir link ver.

Ortaya çıkan iş akışı, eşli programlamadan çok delegasyona benziyor. Sonucu tarif edersiniz, siz başka bir şey yaparken ajan çalışır ve inceleme için bir taslak PR belirir. Anahtar kelime taslak: PR taslak olarak açılır, dolayısıyla bir insan onu "hazır" işaretleyip onaylamadan hiçbir şey merge edilmez. Bu, sağlıklı bir branch stratejisiyle temiz örtüşür — bu ajan branch'lerinin nerede yaşaması ve ne kadar kısa ömürlü olması gerektiği için [Git branch stratejileri](/tr/posts/git-branch-stratejileri) yazımıza bakın.

Gerçekçi bir döngü:

1. Siz: "`UserService` testlerini Jest'ten Vitest'e taşı ve bir PR aç."
2. Ajan: dosyaları düzenler, test paketini çalıştırır, yeşile ulaşana kadar tekrarlar.
3. Ajan: açıklayıcı bir mesajla commit atar, `chore/vitest-userservice` push eder, bir **taslak** PR açar.
4. Siz: taslağı incelersiniz, thread içinde değişiklik istersiniz ya da hazır işaretleyip merge edersiniz.

Bunun gerektirdiği disiplin yeni değil — herhangi bir takım arkadaşının PR'ına uygulayacağınız inceleme titizliğinin aynısı ve bir CI kapısıyla doğal olarak eşleşir. [CI/CD pipeline'ınız](/tr/posts/cicd-pipeline-nasil-kurulur) tam paketi çalıştırıp kırmızıda bloke ediyorsa, ajanın açtığı taslak PR tam olarak bir insanınki kadar güvenlidir: sözleşme yazar değil testlerdir. Bir görüşüm: ajanların özgürce PR açmasına izin verin ama onları rahatlatmak için merge kapısını asla gevşetmeyin. Taslak-PR varsayılanı doğru sezgi, çünkü merge düğmesinde bir insanı tutuyor.

## Manual izin modu değişimi

İnsanları şaşırtan değişiklik bu. v2.1.200 (3 Temmuz) itibarıyla varsayılan izin modu **Manual** — her işlemi çalışmadan önce incelemeye sunan mod. Bu, gelen onca otonomiye kasıtlı bir denge: ajanlar kendi başlarına daha fazlasını yapabildiği için varsayılan duruş, insanı döngüde tutmak üzere sıkılaştı.

Yapılandırma dosyalarında insanları tökezleten bir isim tuhaflığı: mod, CLI'da, `claude --help` içinde ve editör eklentilerinde **Manual** etiketiyle görünür ama config değeri hâlâ `default`. CLI, `manual` takma adını kabul eder; yani v2.1.200+ üzerinde `--permission-mode manual` ve `"defaultMode": "manual"` ikisi de çalışır.

| İstediğiniz | Ayar |
|-------------|------|
| Her işlemi incele (yeni varsayılan) | `--permission-mode manual` (config değeri `default`) |
| Çalışma alanı içindeki düzenlemeleri otomatik kabul et | `--permission-mode acceptEdits` |
| Tam otonom, hiç sorma | `--permission-mode bypassPermissions` |

Kritik olan: arka plan subagent'ları artık izin isteklerini sessizce otomatik reddetmiyor. Bir arka plan subagent'ı izin gerektiren bir araç çağrısına ulaştığında, istek **ana oturumunuzda belirir ve hangi subagent'ın sorduğunu isimlendirir** — devam için onaylayın ya da subagent'ı öldürmeden o tek çağrıyı reddetmek için Esc'e basın. Arka-plan-varsayılanını gerçekten kullanılabilir kılan parça bu: paralel ajanlar riskli işlemler isteyebilir ve siz on transkript arasında avlanmak yerine hepsini tek yerden karara bağlarsınız.

İstekleri susturmak için `bypassPermissions` çalıştırma isteği duyuyorsanız, ortak bir repo'ya dokunan hiçbir şeyde buna direnin — Manual varsayılanının kırmaya çalıştığı refleks tam da budur. Otomasyonun nerede değer kattığına karşı nerede ısırdığına dair [AI kod asistanı hataları](/tr/posts/ai-kod-asistani-hatalari) derlememiz, ekiplerin ilk çarptığı başarısızlık kalıplarını ele alıyor.

## Hepsini bir araya koymak

Bu haftanın ortak çizgisi bir iş bölümü: **subagent'lar size genişlik verir** (bağımsız işi paralel dağıt), **arka plan ajanları derinlik verir** (tek görevi ta taslak PR'a kadar taşı) ve **Manual mod sizi kontrolde tutar** (önemli işlemleri incele). Birlikte kullanıldığında, Claude Code'u taslak üreten bir asistandan, işleri devrettiğiniz küçük bir takıma dönüştürürler — merge düğmesi ve muhakeme hâlâ sizde.

Küçük başlayın: bu hafta gerçekten paralel tek bir görev seçin, iki subagent dağıtın ve birinin CI kapısı olan bir branch'e taslak PR açmasına izin verin. Daha geniş üretkenlik resmi için [AI araçlarıyla geliştirici verimliliği](/tr/posts/ai-gelistirici-verimliligi) yazımıza ve geri kalan [yapay zeka yazılarımıza](/tr/category/yapay-zeka) göz atın.

## Sıkça Sorulan Sorular

### Claude Code subagent'ları artık otomatik olarak arka planda mı çalışıyor?

Evet. v2.1.198 (1 Temmuz 2026) itibarıyla subagent'lar varsayılan olarak arka planda çalışır — artık elle dahil etmeniz gerekmez. Dar kapsamlı görevleri ana oturumdan dağıtırsınız ve eşzamanlı yürürler. Biri izne ihtiyaç duyduğunda istek ana oturumunuzda belirir ve hangi subagent'ın sorduğunu isimlendirir; onayı veya reddi tek yerden verirsiniz.

### Arka plan ajanları pull request'i nasıl açar?

v2.1.198'den bu yana bir arka plan ajanı görevi baştan sona taşıyabilir: değişikliği yap, testleri çalıştır, commit at, bir branch push et ve **taslak** bir pull request aç, sonra bir link döndür. Bilerek taslak olarak açılır — bir insan onu hazır işaretleyip onaylamadan hiçbir şey merge edilmez. Bir CI kapısıyla eşleştirin ki sözleşme yazar değil test paketi olsun.

### Claude Code'daki Manual izin modu nedir?

Manual, her işlemi çalışmadan önce inceleyen izin modudur. v2.1.200 (3 Temmuz 2026) itibarıyla varsayılandır. İsimlendirmeye dikkat: etiket CLI ve eklentilerde "Manual"dır ama config değeri `default`; CLI ayrıca `manual` takma adını kabul eder, yani v2.1.200+ üzerinde `--permission-mode manual` çalışır.

### Subagent'ları ne zaman dağıtmalı, ne zaman tek ajan kullanmalıyım?

Alt görevler gerçekten bağımsızsa dağıtın — ortak, değişen bir durumu olmayan ayrı dosyalar, paketler veya inceleme boyutları. Subagent B başlamak için subagent A'nın çıktısına ihtiyaç duyuyorsa bu bir zincirdir ve planı olan tek bir ajan, birbirine çarpan iki ajanı yener. Fan-out genişliğini v2.1.202'de eklenen dinamik iş akışı boyutu yapılandırmasıyla sınırlayın.
