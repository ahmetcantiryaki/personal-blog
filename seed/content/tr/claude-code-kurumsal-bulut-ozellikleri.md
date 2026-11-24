---
title: "Claude Code Bedrock, GCP, Foundry'de Ne Çalışıyor?"
slug: "claude-code-kurumsal-bulut-ozellikleri"
translationKey: "claude-code-enterprise-cloud-parity-2026"
locale: "tr"
excerpt: "23 Kasım 2026 itibarıyla Claude Code'un Code Mode ve auto mode özellikleri Bedrock, Google Cloud ve Microsoft Foundry'de çalışıyor, sadece Anthropic'te değil."
category: "ai"
tags: ["claude", "ai-coding", "cloud", "aws"]
publishedAt: "2026-11-24"
seoTitle: "Claude Code Kurumsal Bulutlarda Ne Çalışıyor?"
seoDescription: "23 Kasım 2026 itibarıyla Claude Code'un Code Mode ve auto mode özellikleri Bedrock, Google Cloud ve Microsoft Foundry'de de çalışıyor, tek platform değil."
---

Kısa cevap: evet, büyük ölçüde. 23 Kasım 2026 sürümüyle (Claude Code 2.1.331) Code Mode artık Amazon Bedrock, Google Cloud'un Agent Platform'u, Microsoft Foundry ve AWS üzerindeki Claude Platform'da terminal oturumlarında çalışıyor; dört gün önce aynı üç kurumsal buluta ulaşan auto mode'a katılıyor. Anthropic'in kendi Claude Platform'u ile aradaki fark hızla kapanıyor ama tamamen kapanmadı.

## 23 Kasım sürümünde ne değişti?

Claude Code 2.1.331, Amazon Bedrock, Google Cloud'un Agent Platform'u, Microsoft Foundry ve AWS üzerindeki Claude Platform'da terminal oturumlarına Code Mode desteği ekledi. Code Mode, Claude'un her adımda tek bir araç çağrısı göndermek yerine MCP araç çağrılarını yönetmek için TypeScript yazıp çalıştırmasına izin veriyor; bu da çok adımlı ajan görevlerinde gidiş-dönüş sayısını düşürüyor.

Aynı sürüm, sıkıştırılmış model yanıtlarını kesen proxy'ler için `CLAUDE_CODE_DISABLE_RESPONSE_COMPRESSION` değişkenini ekledi ve yönetilen `extraKnownMarketplaces` içindeki eklenti pazaryerlerini 30 Kasım 2026'dan itibaren varsayılan olarak otomatik güncellemeye geçirdi. Bunların hiçbiri buluta özgü değil, ama ekibin kurumsal müşterilerin kullandığı aynı sürüm hattına hâlâ aktif şekilde özellik gönderdiğini gösteriyor.

## Code Mode şu anda hangi kurumsal bulutlarda var?

Büyük kurumların gerçekten standartlaştırdığı üç bulutun hepsinde: Amazon Bedrock, Google Cloud'un Agent Platform'u ve Microsoft Foundry; ayrıca dördüncü bir hedef olarak AWS üzerindeki Claude Platform'da. 23 Kasım'dan önce Code Mode sadece Anthropic'in kendi Claude Platform'unda ve Claude uygulamalarında çalışıyordu — yani veri yerleşimi (data residency) nedeniyle Claude Code'u Bedrock üzerinden çalıştıran bir banka bunu hiç kullanamıyordu.

Bu önemli, çünkü Code Mode bu yıl Claude Code'un gönderdiği en büyük verim (throughput) kazançlarından biri. Uyumluluk nedeniyle Bedrock'a bağlı bir ekip, bu haftaya kadar Code Mode'un ortadan kaldırmak için var olduğu çoklu-araç-çağrısı bedelini ödüyordu.

## Auto mode da aynı bulutlarda çalışıyor mu?

Evet — Claude Opus 4.6 ve Sonnet 4.6 için auto mode, Code Mode'dan dört gün önce, 19 Kasım sürümünde (2.1.328) Amazon Bedrock, Google Cloud'un Agent Platform'u, Microsoft Foundry ve Claude uygulamaları gateway'ine geldi. Auto mode, görev karmaşıklığına göre bir turu hızlı bir sınıflandırıcı ile tam model geçişi arasında yönlendiriyor; rutin düzenlemelerde gecikmeyi düşürmenin ana yolu bu.

Örüntü artık belirgin: Anthropic bir Claude Code özelliğini önce kendi platformunda yayınlıyor, sonra bir ile üç haftalık sürüm içinde üç kurumsal buluta taşıyor. [Claude Code'un Monitor aracı](/tr/posts/claude-code-monitor-araci-bedrock-vertex-foundryda) 2026'nın başında aynı yolu izledi, [Vertex AI'daki Fast mode](/tr/posts/claude-code-fast-mode-vertex-ai-destegi) de öyle.

## Anthropic'in kendi platformuna kıyasla hâlâ eksik olan ne?

| Özellik | Claude Platform (doğrudan) | Amazon Bedrock | Google Cloud Agent Platform | Microsoft Foundry |
|---|---|---|---|---|
| Code Mode | Var | Var (23 Kasım 2026) | Var (23 Kasım 2026) | Var (23 Kasım 2026) |
| Auto mode (Opus/Sonnet 4.6) | Var | Var (19 Kasım 2026) | Var (19 Kasım 2026) | Var (19 Kasım 2026) |
| Enterprise Admin Console girişi | Yok | Listelenmedi | Listelenmedi | Listelenmedi |
| Easel yerleşik modu | Pro/Max/Team/Enterprise | Listelenmedi | Listelenmedi | Listelenmedi |

En yeni tüketici ve organizasyon odaklı eklemeler — Enterprise Admin Console tarafından yönetilen organizasyonlara giriş ve grafik çizmek için easel modu — 20 Kasım'da, aynı değişiklik günlüğünde karşılık gelen bir bulut-platform satırı olmadan yayınlandı. Buradaki gerçek sinyal şu: temel ajan-çalıştırma özellikleri (Code Mode, auto mode, Monitor, Fast mode) artık haftalar içinde kurumsal bulutlara ulaşıyor; hesap ve arayüz katmanı özellikleri ise hâlâ geride kalıyor veya sadece doğrudan platformda kalıyor. Belirli bir satıra göre plan yapmadan önce güncel durumu [Claude Code'un kendi değişiklik günlüğünden](https://code.claude.com/docs/en/changelog) doğrulayın; bu tablo 23 Kasım 2026'yı yansıtıyor ve yayın temposu kabaca haftalık.

## Kendi dağıtımınızda neyin mevcut olduğunu nasıl kontrol edersiniz?

Önce yüklü Claude Code sürümünüzü kontrol edin, çünkü özellik erişilebilirliği kendiniz ayarladığınız bir bayrağı değil sürüm numarasını takip ediyor.

```bash
claude --version
claude doctor
```

`claude doctor`, Claude Code sürümünüzün yanında yapılandırılmış sağlayıcınızı (Bedrock, Vertex tabanlı Google Cloud Agent Platform, Foundry veya doğrudan Claude Platform) raporluyor; bu, değişiklik günlüğündeki bir özelliğin kurulumunuza uygulanıp uygulanmadığını doğrulamanın en hızlı yolu. `claude --version` 2.1.331'den daha eski bir şey gösteriyorsa, Code Mode'un bulutunuzda mevcut olmadığını varsaymadan önce güncelleyin — kısıtlama platformdan değil sürümünüzden kaynaklanıyor olabilir.

## Bedrock veya Foundry kullanan bir ekip bugün bir şey değiştirmeli mi?

Claude Code'u zaten Bedrock, Google Cloud veya Foundry üzerinden çalıştırıyor ve ek gidiş-dönüş maliyeti yüzünden çok adımlı ajan iş akışlarından kaçınıyorsanız, bu geçici çözüm artık güncelliğini kaybetti. En ağır ajan görevlerinizi — büyük refactor'ları, çok dosyalı geçişleri, önceden birden fazla ardışık araç çağrısı gerektiren her şeyi — Code Mode açıkken yeniden test edin; çünkü bu tam olarak onun hızlandırmak için tasarlandığı iş yükü.

[Merge'leri Claude Code review ile kapılayan](/tr/posts/cida-claude-code-review-ile-pr-kapisi-kurun) ekipler, pipeline'larının sağlayıcı yapılandırmasını da yeniden kontrol etmeli; eski bir imaja sabitlenmiş bir CI çalıştırıcısı, yerel makineleriniz güncellendikten çok sonra bile sessizce 2.1.331 öncesi bir ikili dosyada kalabilir — bu da en hızlı ajan iş akışı kazançlarınızın en önemli olduğu pipeline'da hiç görünmeyebileceği anlamına gelir. CI'nız Claude Code'u headless çalıştırıyorsa aynı durum geçerli: bir pipeline'ın Code Mode'un daha geniş araç-çağrısı yetkisiyle hareket etmesine izin vermeden önce kurmaya değer korkulukları [CI'da Claude Code ile otomatik düzeltmeler](/tr/posts/ci-claude-code-otomatik-duzeltme) yazısında bulabilirsiniz.

Pratik bir kontrol listesi şöyle: önce `claude doctor` çıktısını yalnızca yerel makinenizde değil, CI ortamınızda da çalıştırın; çünkü yerel makinenizdeki sürüm ile pipeline imajındaki sürüm sık sık birbirinden ayrılıyor ve bu fark fark edilmeden aylarca sürebiliyor. Sonra, Code Mode'u önce düşük riskli bir görevde — örneğin tek bir modülün testlerini güncellemek — deneyin, doğrudan production'a giden büyük bir refactor'da değil; bu, davranış değişikliğini küçük bir alanda gözlemlemenizi sağlar. Son olarak, ekibinizin hangi bulutu kullandığını ve o bulutun hangi Claude Code sürümünde olduğunu bir README'de veya bir runbook'ta not edin; aksi halde altı ay sonra "bizde bu özellik zaten var mı" sorusunu tekrar sormak zorunda kalırsınız — ki bu yazının kendisi tam olarak böyle bir sorudan doğdu.

Dürüst görüşüm: bir Claude Platform lansmanı ile Bedrock/GCP/Foundry karşılığı arasındaki bir-üç haftalık gecikme artık yeterince kısa; kurumların "Anthropic'in doğrudan platformunda değiliz" gerekçesini yeni bir Claude Code özelliğini atlamak için kullanmayı bırakması gerekiyor — önce değişiklik günlüğünü kontrol edin.

Birincil kaynaklar: [Claude Code'un değişiklik günlüğü](https://code.claude.com/docs/en/changelog) ve [Claude'un sürüm notları özeti](https://platform.claude.com/docs/en/release-notes/overview).

## Sıkça Sorulan Sorular

### Claude Code'un Code Mode özelliği Amazon Bedrock'ta çalışıyor mu?

Evet. 23 Kasım 2026 sürümüyle (Claude Code 2.1.331) Code Mode; Amazon Bedrock, Google Cloud'un Agent Platform'u, Microsoft Foundry ve AWS üzerindeki Claude Platform'da terminal oturumlarında çalışıyor.

### Claude Code auto mode Google Cloud ve Microsoft Foundry'de kullanılabiliyor mu?

Evet. Claude Opus 4.6 ve Sonnet 4.6 için auto mode; Amazon Bedrock, Google Cloud'un Agent Platform'u, Microsoft Foundry ve Claude uygulamaları gateway'ine 19 Kasım 2026 sürümüyle (Claude Code 2.1.328) geldi.

### Hangi Claude Code sürümünü çalıştırdığımı nasıl öğrenirim?

Terminalinizde `claude --version` çalıştırın; yapılandırılmış sağlayıcınızı (doğrudan, Bedrock, Google Cloud veya Foundry) da gösteren daha kapsamlı bir rapor için `claude doctor` kullanın. Belirli bir özelliğin kurulumunuza uygulanıp uygulanmadığını doğrulamak için sürümü Claude Code'un değişiklik günlüğündeki tarihli maddelerle karşılaştırın.

### Bir özellik neden Claude Platform'da çıkıp Bedrock'ta henüz çıkmıyor?

Anthropic, ajan-çalıştırma özelliklerini — Code Mode, auto mode, Monitor aracı, Fast mode — önce kendi Claude Platform'unda yayınlıyor, sonra bir ile üç haftalık sürüm içinde Bedrock, Google Cloud'un Agent Platform'u ve Microsoft Foundry'ye taşıyor. Enterprise Admin Console girişine giriş gibi hesap ve arayüz katmanı özellikleri için Kasım 2026 itibarıyla bu bulutlara ne zaman ulaşacaklarına dair sabit bir takvim görünmüyor.
