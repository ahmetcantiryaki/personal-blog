---
title: "Claude Code Sandbox Bash İzinleri Neden Değişti?"
slug: "claude-code-sandbox-bash-izinleri"
translationKey: "claude-code-sandboxed-bash-permissions-2026"
locale: "tr"
excerpt: "Claude Code 2.1.325'te sandbox içi Bash komutları izin istiyor; sessizliği korumak için autoAllowBashIfSandboxed ayarını settings.json'a eklemelisin."
category: "ai"
tags: ["claude", "ai-agents", "automation", "best-practices"]
publishedAt: "2026-11-16"
seoTitle: "Claude Code Sandbox Bash İzinleri Neden Değişti?"
seoDescription: "Claude Code 2.1.325, sandbox içi Bash komutlarını normal izin akışına taşıdı. Değişen davranışı, ayar düzeltmesini ve CI etkisini anlatıyoruz."
---

Kısa cevap: Claude Code 13 Kasım 2026'da yayınlanan 2.1.325 sürümüyle, sandbox (korumalı alan) içinde çalışan Bash komutlarını artık normal izin akışına soktu. Daha önce sandbox'taki bir komut hiç soru sormadan çalışıyordu; şimdi aynı komut, sandbox dışındaki bir komut gibi onay istiyor. Eski sessiz davranışı geri getirmek için `sandbox.autoAllowBashIfSandboxed: true` ayarını açmanız gerekiyor.

## Tam olarak ne değişti?

2.1.325'ten önce, Claude Code'un işletim sistemi seviyesindeki sandbox'ı içinde çalışan bir Bash komutu zaten izole kabul ediliyordu ve kullanıcıya hiç izin sorusu sorulmuyordu; sandbox'a girmiş olmak kendi başına "güvenli" sayılıyordu. 13 Kasım 2026'dan itibaren bu varsayım kaldırıldı: sandbox içindeki komutlar da artık diğer Bash komutları gibi normal izin akışından geçiyor. Yani `rm`, `git push` veya bir kurulum betiği gibi komutlar, sandbox'ta çalışsa bile kullanıcıdan onay isteyebilir.

Bu, kasıtlı bir güvenlik sıkılaştırması; sandbox'ın kendisi değişmedi, sadece "sandbox'tayım, o yüzden otomatik izinliyim" varsayımı kaldırıldı.

## Bu değişiklik neden yapıldı?

Anthropic'in gerekçesi net ifade edilmemiş olsa da, değişikliğin sandbox'ı "izin sorma gerekliliğini tamamen ortadan kaldıran bir kaçış yolu" olarak görmekten, "izole ama hâlâ denetlenen bir çalışma alanı" olarak görmeye geçişi yansıttığı söylenebilir. Sandbox dosya sistemini ve ağı izole eder, ama komutun kendisinin zararsız olduğunu garanti etmez; bir sandbox içinde de yanlışlıkla önemli bir dosyayı silebilir veya beklenmedik bir ağ isteği gönderebilirsiniz. Aynı 2.1.325 sürümünde, sandbox'ın `.claude` ayarlarına, skill'lere, ajanlara ve hook'lara yazmayı zaten engellediği belirtiliyor; bu değişiklik de aynı "sandbox = sınırsız güven değil" çizgisinde.

## autoAllowBashIfSandboxed ayarı nasıl açılır?

Eski sessiz davranışı korumak istiyorsanız, `settings.json` dosyanıza şu ayarı eklemeniz gerekiyor:

```json
{
  "sandbox": {
    "autoAllowBashIfSandboxed": true
  }
}
```

Bu ayar kullanıcı, proje veya organizasyon (managed) ayar dosyalarının herhangi birine eklenebilir. Organizasyon düzeyinde yönetilen bir sandbox söz konusuysa, ayarı en yüksek öncelikli managed ayar kaynağınıza eklemeniz gerekiyor; aksi hâlde kullanıcı düzeyindeki ayar, organizasyon politikasını geçersiz kılamaz.

## Aynı sürümde başka hangi otomasyon değişiklikleri geldi?

2.1.325, sandbox değişikliğiyle aynı anda, otomasyonu etkileyen iki değişiklik daha getirdi. İlki: zamanlanmış görevler (scheduled tasks) ve `/loop` komutu, `allowed-tools` veya hook tanımlayan bir skill'i çalıştırmadan önce artık izin soruyor; bunu gözetimsiz çalıştırmak için `permissions.allow` listesine `Skill(skill-adi)` eklemeniz gerekiyor. İkincisi: salt okunur git komutları (örneğin `git log` veya `git diff`), projenin kendisine ait olmayan veya güvenilir olarak işaretlenmemiş bir repoda artık ilk seferinde soru soruyor; bunu `additionalDirectories` ayarıyla değil, `--add-dir` bayrağıyla aşabilirsiniz.

| Davranış | 2.1.325 öncesi | 2.1.325 ve sonrası |
|---|---|---|
| Sandbox içindeki Bash komutu | Soru sormadan çalışır | Normal izin akışından geçer |
| Sessiz çalışmayı geri getirme | Gerek yok (varsayılan zaten sessiz) | `sandbox.autoAllowBashIfSandboxed: true` gerekir |
| Hook/`allowed-tools` içeren skill (zamanlanmış görev, `/loop`) | Soru sormadan çalışır | `permissions.allow`'a `Skill(ad)` eklenmeli |
| Güvenilmeyen repoda salt okunur git komutu | Soru sormadan çalışır | `--add-dir` ile dizini tanımlamak gerekir |

## Bu değişiklik CI ve otomasyon hatlarını nasıl etkiler?

Eğer Claude Code'u auto mode'da, bir CI pipeline'ında veya zamanlanmış bir görevde gözetimsiz çalıştırıyorsanız, 2.1.325'e güncelledikten sonra pipeline'ınız aniden izin sorusunda tıkanabilir; kimse soruyu yanıtlayamayacağı için görev zaman aşımına uğrar veya askıda kalır. Bunun pratik anlamı şu: güncellemeden önce `sandbox.autoAllowBashIfSandboxed: true` ayarını ve kullandığınız skill'ler için gereken `Skill(ad)` izinlerini önceden eklemeniz gerekiyor; aksi hâlde sorunu production'da, görevin ortasında fark edersiniz.

Kişisel görüşüm şu: değişikliğin kendisi savunulabilir, ama Anthropic bu tür davranış değişikliklerini genelde tek bir sürüm notu satırına sıkıştırıyor; gözetimsiz otomasyon kuran ekipler için bir sürümlük uyarı penceresi ya da ayrı bir geçiş rehberi, bu kadar sessiz bir kırılmadan daha nazik bir yol olurdu. [Auto mode'un varsayılan hâline gelmesi](/tr/posts/claude-code-auto-mode-varsayilan-oluyor) sürecinde de benzer bir sertleştirme eğilimi görülüyor; Anthropic gözetimsiz çalışmayı mümkün kılarken aynı anda onu daha sık durdurma yönünde adımlar atıyor.

## Yükseltme öncesi neyi kontrol etmelisin?

Önce hangi otomasyonlarınızın sandbox içinde Bash çalıştırdığını listeleyin: CI adımları, zamanlanmış görevler, `/loop` ile çalışan tekrarlayan komutlar. Sonra her biri için üç şeyi netleştirin: sandbox ayarının gözetimsiz çalışması gerekip gerekmediği, kullandığı skill'lerin `allowed-tools` veya hook tanımlayıp tanımlamadığı, ve eriştiği repoların proje dizini içinde mi yoksa dışında mı olduğu. Bu üç soruya cevabınız varsa, `settings.json`'a gereken `sandbox.autoAllowBashIfSandboxed` ve `permissions.allow` girdilerini eklemek birkaç dakika sürer. Bu konu, genel olarak [ajanların neden sandbox/VM içinde çalıştırıldığı](/tr/posts/yapay-zeka-ajanlari-neden-sanal-makinede-calisir) sorusuyla da bağlantılı; sandbox'ın amacı izolasyon olsa da izolasyon, denetimin yerini almıyor.

## Bu, auto mode kullanan ekipleri nasıl etkiler?

Auto mode, bir sınıflandırıcının riskli görünen komutları otomatik engellediği, güvenli görünenleri ise sormadan geçirdiği bir çalışma biçimi; sandbox genelde auto mode'un güvenlik katmanlarından biri olarak kullanılıyor. 2.1.325'ten önce, auto mode + sandbox kombinasyonu birçok Bash komutunu zaten soru sormadan geçiriyordu, çünkü sandbox'ta olmak başlı başına bir onay sayılıyordu. Artık sandbox bu rolü oynamıyor; auto mode'un sınıflandırıcısı hâlâ riskli komutları engelliyor ama "sandbox'tayım" argümanı tek başına bir komutu otomatik onaylı hâle getirmiyor. Pratikte bu, [auto mode'un varsayılan hâle geldiği](/tr/posts/claude-code-auto-mode-varsayilan-oluyor) ekiplerin, sandbox içinde çalışan ama `autoAllowBashIfSandboxed` ayarı olmayan görevlerde beklenmedik duraklamalar görmesi anlamına geliyor.

Bir diğer örnek: [Claude Code'un e-posta sızıntısı öncesi uyarı vermesi](/tr/posts/claude-code-e-postani-sizdirmadan-once-uyariyor) gibi önceki güvenlik önlemleri de aynı eğilimin parçası — Anthropic, ajanın "görünüşte zararsız" bir eylemi sorgusuzca yapabildiği noktaları tek tek kapatıyor. Sandbox değişikliği de bu listenin en yenisi; farkı, bu kez etkisinin tek bir eylem değil, sandbox kullanan her otomasyon olması.

## Bu değişiklik yerel geliştirme ortamını da etkiler mi?

Günlük geliştirme akışında, yani Claude Code'u terminalde kendiniz izlerken, bu değişikliğin etkisi küçük: zaten her izin isteğine siz yanıt veriyorsunuz, sandbox'ın sessizce geçirdiği komutların bir kısmı artık size de soruluyor ama akışı bozacak kadar sık değil. Asıl fark, kimsenin ekranda olmadığı senaryolarda ortaya çıkıyor: gece çalışan bir zamanlanmış görev, bir CI adımı veya uzun süren bir `/loop` oturumu, yanıtlanmayan bir izin isteğinde askıda kalabilir. Bu yüzden değişikliği öncelikle "gözetimsiz çalışan her şeyi listele" perspektifinden okumak gerekiyor; interaktif kullanımda pratik bir fark yaratmıyor.

Sürüm notlarını takip etmiyorsanız bu tür değişiklikleri kaçırmak kolay; Claude Code'un [sürüm notları sayfasını](https://platform.claude.com/docs/en/release-notes/overview) veya doğrudan [changelog sayfasını](https://code.claude.com/docs/en/changelog) düzenli kontrol etmek, özellikle gözetimsiz otomasyon kuran ekipler için artık rutin bir bakım adımı sayılmalı.

## Sıkça Sorulan Sorular

### Claude Code'u güncelledikten sonra Bash komutları neden birden izin sormaya başladı?

Kısa cevap: 13 Kasım 2026'da yayınlanan 2.1.325 sürümü, sandbox içindeki Bash komutlarını normal izin akışına taşıdı. Önceden sandbox içinde olmak otomatik izin anlamına geliyordu; artık değil. Eski davranışı geri getirmek için `settings.json`'da `sandbox.autoAllowBashIfSandboxed: true` ayarını açmanız gerekiyor.

### autoAllowBashIfSandboxed ayarını nereye eklemeliyim?

Kısa cevap: Kullanıcı, proje veya organizasyon ayar dosyalarından size uygun olana ekleyin. Organizasyon düzeyinde yönetilen bir sandbox politikası varsa, ayarı en yüksek öncelikli managed ayar kaynağına eklemek gerekir; aksi hâlde yerel ayarınız organizasyon politikasını geçersiz kılamaz.

### Bu değişiklik zamanlanmış görevleri ve `/loop`'u da etkiliyor mu?

Evet. Aynı sürümde zamanlanmış görevler ve `/loop`, `allowed-tools` veya hook tanımlayan bir skill'i çalıştırmadan önce artık izin soruyor. Gözetimsiz çalışmasını istediğiniz her skill için `permissions.allow` listesine `Skill(skill-adi)` eklemeniz gerekiyor.

### Güncellemeden sonra CI pipeline'ım neden duruyor?

Kısa cevap: Pipeline'ınız sandbox içinde Bash çalıştırıyor ve artık bir izin sorusu bekliyor olabilir, ama bunu yanıtlayacak kimse yok. Çözüm, güncellemeden önce `sandbox.autoAllowBashIfSandboxed: true` ayarını ve kullandığınız skill'ler için gereken `Skill(ad)` izinlerini `settings.json`'a eklemektir.
