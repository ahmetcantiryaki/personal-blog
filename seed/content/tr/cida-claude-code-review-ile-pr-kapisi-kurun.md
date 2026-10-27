---
title: "CI'da Claude Code Review ile PR Kapısı Kurun"
slug: "cida-claude-code-review-ile-pr-kapisi-kurun"
translationKey: "claude-code-review-ci-gating"
locale: "tr"
excerpt: "Kısa cevap: Anthropic'in Code Review özelliği PR'ı onaylamaz veya bloklamaz — bulguları satır içi yorum olarak bırakır, birleştirme kararı ekibinizde kalır."
category: "devops-cloud"
tags: ["ci-cd", "claude", "devops"]
publishedAt: "2026-10-27"
seoTitle: "Claude Code Review ile GitHub Actions'da PR İncelemesi"
seoDescription: "Anthropic'in Code Review özelliğini ve kendi GitHub Actions pipeline'ınızda çalışan claude-code-action alternatifini, inceleme seviyeleriyle karşılaştırıyoruz."
---

Kısa cevap: Anthropic'in Code Review özelliği, her pull request üzerinde otomatik olarak çalışır ve bulgularını satır içi yorum olarak bırakır, ama hiçbir zaman PR'ı onaylamaz veya bloklamaz — birleştirme kararı her zaman ekibinizde kalır. Bunu Team veya Enterprise planında organizasyon sahibi (Owner) açar; kendi GitHub Actions pipeline'ınızda çalışan ve gerçekten bir check'i kırmızıya çevirebilen bir alternatif istiyorsanız, `claude-code-action` ile `code-review` eklentisini kendi workflow dosyanıza yazmanız gerekiyor.

## Anthropic'in Code Review özelliği gerçekte ne yapıyor?

Code Review, Anthropic'in altyapısında çalışan birkaç ajanın pull request'teki değişikliği çevresindeki kodla birlikte okuyup mantık hataları, güvenlik açıkları veya kırılan uç durumlar araması şeklinde çalışıyor. Bulgular önce bir doğrulama adımından geçiyor — bu adım, kod üzerinde gerçekten doğrulanamayan "yanlış pozitif" bulguları eliyor — sonra önem derecesine (severity) göre sıralanıp PR'a satır içi yorum, bir özet ve "Claude Code Review" adlı bir check run olarak gönderiliyor. Kritik nokta şu: bu check run hiçbir zaman "failure" olarak sonuçlanmıyor ve PR'ı onaylama/bloklama yetkisi yok — bu tasarım kararı, otomatik incelemenin insan onayının yerine geçmemesi gerektiğini net bir şekilde gösteriyor.

## Code Review'u kim, hangi planda kullanabilir?

Code Review, Team ve Enterprise planlarındaki organizasyonlara açık ve bir organizasyon sahibinin Claude GitHub App'i kurup bir inceleme seviyesi seçmesini gerektiriyor. GitHub Enterprise Server dahil GitHub üzerinde barındırılan depolarla çalışıyor, ama Zero Data Retention veya HIPAA yapılandırması açık organizasyonlarda kullanılamıyor. Bu plan kısıtlaması, çoğu küçük ekip veya bireysel geliştirici için Code Review'u doğrudan erişilemez kılıyor — bu durumda devreye giren alternatif, aşağıda ele aldığımız kendi CI'ınızda çalıştırdığınız `claude-code-action`.

## İnceleme seviyeleri (Quick/Standard/Deep) arasındaki fark ne?

Üç seviye var ve her biri derinlik, hız ve maliyet arasında farklı bir denge kuruyor: Quick en hafif ve en hızlı geçiş, en düşük maliyetle; Standard varsayılan seviye olup derinlik, hız ve maliyeti dengeliyor; Deep en kapsamlı geçişi yapıyor, en uzun sürüyor ve en yüksek maliyete sahip. Bir organizasyon sahibi tüm organizasyon için bir varsayılan seviye seçebilir, ama her depoya kendi seviyesini de atayabilir — örneğin rutin bir depo için Quick, kritik bir depo için Deep seçmek mümkün.

| Seviye | Hız | Maliyet | Ne zaman kullanılır |
|---|---|---|---|
| Quick | En hızlı | En düşük | Rutin, düşük riskli depolar |
| Standard | Dengeli | Orta (varsayılan) | Çoğu proje için uygun |
| Deep | En yavaş | En yüksek | Kritik, güvenlik hassasiyeti yüksek depolar |

## Kendi GitHub Actions pipeline'ımda Claude'un incelemesini nasıl çalıştırırım?

Anthropic'in resmi `claude-code-action`'ını kullanarak `code-review` eklentisini bir pull request event'inde çalıştırabilirsiniz; bu yol, Team/Enterprise planı gerektirmez, sadece bir Claude API anahtarı veya OAuth token yeterli. Aşağıdaki workflow, bir PR açıldığında, güncellendiğinde veya "ready for review" işaretlendiğinde eklentiyi çalıştırıp bulguları satır içi yorum olarak PR'a gönderiyor:

```yaml
name: Code Review
on:
  pull_request:
    types: [opened, synchronize, ready_for_review, reopened]
jobs:
  review:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: read
      issues: read
      id-token: write
    steps:
      - uses: actions/checkout@v6
        with:
          fetch-depth: 1
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          plugin_marketplaces: "https://github.com/anthropics/claude-code.git"
          plugins: "code-review@claude-code-plugins"
          prompt: "/code-review:code-review --comment ${{ github.repository }}/pull/${{ github.event.pull_request.number }}"
          claude_args: '--allowedTools "mcp__github_inline_comment__create_inline_comment"'
```

Buradaki `--comment` bayrağı kritik: bu olmadan Claude bulgularını yalnızca workflow çalıştırma günlüğüne yazar, PR'a hiçbir şey göndermez. `claude_args` satırındaki `--allowedTools` ise, PR'a satır içi yorum göndermek için gereken MCP sunucusunu başlatıyor — eklentinin kendi `allowed-tools` ön ekinde aynı araç adı geçse de bu satırı çıkarmamak gerekiyor, çünkü GitHub Action o aracı yalnızca `claude_args` içinde açıkça belirtildiğinde başlatıyor.

## "Gating" ile "advisory" yorum arasındaki fark ne?

Her iki yol da (Anthropic'in Code Review özelliği ve kendi `claude-code-action` kurulumunuz) teknik olarak "advisory" — yani bulguları gösteriyor ama PR'ı birleştirmeyi engelleyen bir durum (status check failure) üretmiyor. Gerçek bir "gate" (geçit) kurmak istiyorsanız, GitHub'ın branch protection kurallarında bu check'i zorunlu kılmanız gerekiyor; ama resmi dokümantasyon, "Claude Code Review" check run'ının asla "failure" olarak sonuçlanmadığını açıkça belirtiyor — bu da onu zorunlu bir check olarak eklemenin pratik bir engelleme sağlamayacağı anlamına geliyor. Pratik gating, genelde kendi workflow'unuzda `--json` çıktısını ayrıştırıp kritik bulgu sayısına göre job'u kendiniz başarısız (`exit 1`) yapmakla kuruluyor.

## Taslak (draft) veya fork'tan gelen PR'larda inceleme çalışır mı?

Hayır, varsayılan olarak çalışmıyor. Hem Anthropic'in Code Review özelliği hem de kendi `claude-code-action` kurulumunuz, taslak olarak işaretlenmiş veya kapatılmış PR'ları atlıyor. Fork'tan gelen PR'lar için durum biraz farklı: açık (public) depolarda GitHub, fork'tan tetiklenen workflow çalıştırmalarına secret'ları (API anahtarınız dahil) vermiyor — bu güvenlik önlemi, bir fork sahibinin sizin API anahtarınızı çalıştırmasını engelliyor, ama aynı zamanda inceleme adımının fork PR'larında sessizce hiç çalışmaması anlamına geliyor. Pratik sonuç: açık kaynak bir projede dışarıdan gelen katkıları da kapsamak istiyorsanız, `pull_request_target` event'ini kullanan ve secret'ı daha dikkatli bir izin modeliyle ileten ayrı bir workflow kurmanız gerekiyor; bu, kodu çalıştırmadan sadece diff'i okuyacak şekilde sınırlandırılmalı.

Bir PR'a art arda push yapıldığında da incelemenin her seferinde yeniden çalışmadığını bilmek önemli: bazı push'lardan sonra Code Review önceki sonucu koruyor, böylece küçük, incelemeyi etkilemeyen değişiklikler (örneğin bir yorum satırı düzeltmesi) için gereksiz yeniden inceleme maliyeti oluşmuyor.

## Maliyeti ve yorum gürültüsünü nasıl kontrol ederim?

Her inceleme iki kaynak tüketiyor: GitHub Actions dakikaları ve API token'ları; token maliyeti prompt uzunluğuna, görev karmaşıklığına ve kod tabanı boyutuna göre değişiyor. Gürültüyü azaltmak için depo köküne bir `REVIEW.md` ekleyip neyin işaretlenmesi gerektiğini daraltabilirsiniz — Code Review varsayılan olarak üretimde gerçekten kırılacak hatalara odaklanıyor, biçimlendirme tercihlerine veya eksik test kapsamına değil. [AI ile kod incelemesi: güven ama doğrula](/tr/posts/ai-ile-kod-incelemesi-guven-dogrula) yazımızda ele aldığımız gibi, otomatik bulguların hiçbiri "kod hatasız" anlamına gelmiyor — bir bulgu bulunmaması, güvenlik açığı olmadığının kanıtı değil.

## Her zaman açık bir aboneliği nasıl durdururum?

Anthropic'in Code Review özelliğini kapatmak için organizasyon sahibinin Claude organizasyon ayarlarından özelliği devre dışı bırakması yeterli; kendi `claude-code-action` kurulumunuzda ise ilgili workflow dosyasını `.github/workflows/` dizininden silmeniz ve ilgili secret'ı (varsa paylaşılan bir organizasyon secret'ı) kaldırmanız gerekiyor. Benim tavsiyem: ekip küçükse ve Team/Enterprise planında değilseniz, doğrudan kendi `claude-code-action` kurulumunuzla başlayın — bu, [sıfırdan CI/CD pipeline kurulumu](/tr/posts/cicd-pipeline-nasil-kurulur) sürecinize tek bir YAML dosyası eklemekten daha fazlası değil ve plan kısıtlaması yok.

## Sıkça Sorulan Sorular

### Claude Code Review bir PR'ı birleştirmeyi engelleyebilir mi?

Hayır. Resmi dokümantasyona göre bir inceleme hiçbir zaman PR'ı onaylamaz veya bloklamaz; "Claude Code Review" check run'ı asla "failure" olarak sonuçlanmaz. Birleştirme kararı her zaman ekibinizde kalır.

### Code Review özelliğini hangi planlar kullanabilir?

Code Review, Team ve Enterprise planlarındaki organizasyonlara açık ve bir organizasyon sahibinin açması gerekiyor. Zero Data Retention veya HIPAA yapılandırması açık organizasyonlarda kullanılamıyor.

### Team/Enterprise planım yoksa Claude'un incelemesini kendi CI'ımda nasıl çalıştırırım?

Anthropic'in resmi `claude-code-action`'ını ve `code-review` eklentisini kendi GitHub Actions workflow'unuza ekleyip bir Claude API anahtarıyla çalıştırabilirsiniz; bu yol herhangi bir plan gerektirmez.

### İnceleme seviyeleri arasındaki fark ne?

Quick en hızlı ve en ucuz, en hafif geçişi yapar; Standard (varsayılan) derinlik, hız ve maliyeti dengeler; Deep en kapsamlı ama en yavaş ve en maliyetli incelemeyi yapar. Bir organizasyon sahibi her depoya farklı bir seviye atayabilir.
