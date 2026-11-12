---
title: "Claude Code Fast Mode Artık Vertex AI'da Çalışıyor"
slug: "claude-code-fast-mode-vertex-ai-destegi"
translationKey: "claude-code-fast-mode-vertex-ai-2026"
locale: "tr"
excerpt: "Claude Code v2.1.322 (10 Kasım 2026) itibarıyla fast mode, Google Cloud Vertex AI'da Claude Fable 5.2 için çalışıyor; sadece global, ABD ve AB bölgelerinde."
category: "ai"
tags: ["claude", "ai-tools", "cloud", "developer-experience"]
publishedAt: "2026-11-12"
seoTitle: "Claude Code Fast Mode Vertex AI'da: Ne Değişti?"
seoDescription: "Claude Code v2.1.322, Google Cloud Vertex AI'da Claude Fable 5.2 için fast mode getiriyor. Bölge şartı, kurulum adımları ve geri düşme davranışı burada."
---

Kısa cevap: evet. 10 Kasım 2026'da yayınlanan Claude Code v2.1.322 itibarıyla fast mode, Google Cloud Vertex AI (Agent Platform) üzerinde Claude Fable 5.2 için çalışıyor; ama sadece Vertex bölgeniz `global`, `us` veya `eu` olarak ayarlıyken. Bu sürümden önce fast mode yalnızca Anthropic API ve Claude abonelik planlarında vardı; Vertex AI, Amazon Bedrock ve Microsoft Foundry tamamen kapsam dışıydı.

Bu, uyumluluk veya faturalama nedeniyle Claude Code'u Google Cloud üzerinden çalıştıran ekipler için gerçek bir boşluğu kapatıyor. Şimdiye kadar bu ekipler hangi modeli seçerse seçsin standart hızda sıkışıp kalıyordu. Tam olarak ne değişti, nasıl açılır ve hâlâ nerede eksik kalıyor, sırasıyla bakalım.

## Fast mode nedir, Vertex AI'da neden önemli?

Fast mode, desteklenen Claude modelleri için daha düşük gecikme karşılığında daha yüksek token başı maliyet sunan yüksek hızlı bir yapılandırma; Anthropic'e göre modeli aynı kalitede 2,5 kata kadar hızlandırıyor, çünkü bu daha küçük veya damıtılmış bir model değil, aynı modelin farklı bir sunum yapılandırması. Vertex AI özelinde bu hız kazancı artık sadece Claude'a hangi bulut üzerinden eriştiklerinden dolayı önceden dışarıda kalan ekiplere de ulaşıyor.

## Bu özellik hangi Claude Code sürümünü ve modelleri gerektiriyor?

Vertex AI'da fast mode, Claude Code v2.1.322 veya sonrasını gerektiriyor ve şu an sadece Claude Fable 5.2'yi destekliyor; Opus 5.5, Opus 5 veya Opus 4.8'i değil. Bu, fast mode'un zaten dört modelin tümünü kapsadığı Anthropic API'ye kıyasla daha dar bir kapsam. Kuruluşunuz Vertex'te daha eski bir Claude Code sürümü çalıştırıyorsa veya farklı bir model sabitlemişse, bu sürüm sizin için şimdilik hiçbir şey değiştirmiyor.

## Hangi Vertex AI bölgeleri fast mode'u destekliyor?

Sadece üç bölge ayarı çalışıyor: `global`, `us` ve `eu`. Fable 5.2 için yapılandırılmış başka herhangi bir Vertex bölgesi, Claude Code'un "Fast mode needs Vertex region global, us or eu" uyarısını vermesine ve `claude -p` komutunu isteği başarısız kılmak yerine sessizce standart hızda çalıştırmasına neden oluyor. Bölgeyi oturumu başlatmadan önce bir ortam değişkeniyle ayarlıyorsunuz:

```bash
export VERTEX_REGION_CLAUDE_FABLE_5_2=global
```

## Vertex AI'da fast mode nasıl açılır?

Etkileşimli bir oturumda, bölgeyi ayarladıktan sonra `/fast` komutunu çalıştırın; farklı bir modeldeyseniz sizi Fable 5.2'ye geçirir, çünkü Vertex AI'da fast mode, Anthropic API'deki gibi kalıcı bir varsayılan olarak kaydedilmiyor. Etkileşimsiz modda ise modeli ve ayarı açıkça belirtmeniz gerekiyor:

```bash
claude -p "Summarize this project" --model claude-fable-5-2 --settings '{"fastMode": true}'
```

## Vertex AI isteği reddederse ne olur?

Claude Code hata vermek yerine otomatik olarak standart hıza geri düşüyor. Agent Platform, fast mode kontrolüne 403 veya 404 döndürürse "Fast mode was refused for this project · trying again in 30m" mesajını görürsünüz ve isteğiniz yine tamamlanır; sadece hız artışı olmadan. 30 dakikalık geri çekilmeyi beklemeden yeniden denemek için `/fast on` komutunu tekrar çalıştırabilirsiniz.

## Vertex AI'daki fast mode, Anthropic API'deki yayılımla nasıl karşılaştırılıyor?

Vertex AI'daki özellik seti, Anthropic API'de çoktan gönderilmiş olanın bir alt kümesi; orada fast mode, lansmanından beri Opus 5.5'i ve araştırma önizlemesi olarak aylardır Opus 5 ile Opus 4.8'i kapsıyor. Vertex AI ise lansmanda sadece tek bir model alıyor.

| Model | Fast mode giriş (MTok başına) | Fast mode çıkış (MTok başına) | Vertex AI'da mevcut mu |
|---|---|---|---|
| Claude Fable 5.2 | 16 $ | 80 $ | Evet, v2.1.322+, sadece global/us/eu |
| Claude Opus 5.5 | 8 $ | 40 $ | Hayır — sadece Anthropic API ve Claude planları |
| Claude Opus 5 | 10 $ | 50 $ | Hayır — araştırma önizlemesi, sadece Anthropic API |
| Claude Opus 4.8 | 10 $ | 50 $ | Hayır — kullanımdan kaldırıldı, 30 Kasım 2026'da tamamen kalkıyor |

Fast mode fiyatlandırması bu modellerin hepsinde tam bağlam penceresi boyunca sabit ve sunulduğu her yerde standart hız kullanımından ayrı faturalanıyor.

## Ekipler Claude Code'u neden Vertex AI üzerinden çalıştırıyor?

Kısa cevap: veri yerleşimi, mevcut Google Cloud faturalama anlaşmaları ve kurumsal uyumluluk gereksinimleri yüzünden. Anthropic ile doğrudan API anlaşması imzalamak yerine, bazı kuruluşlar zaten sahip oldukları Google Cloud sözleşmesi, IAM yapılandırması ve bölgesel veri saklama taahhütleri üzerinden Claude'a erişmeyi tercih ediyor. Bu ekipler için Vertex AI, model kalitesinden ödün vermeden mevcut güvenlik ve satın alma süreçlerini koruma yolu; ama bugüne kadar bu yolu seçmenin bedeli, Anthropic API'deki en yeni özelliklere daha gecikmeli erişim oldu. Fast mode'un Vertex AI'a gelmesi, bu gecikmenin arayı tamamen kapatmasa da kısaldığının bir işareti.

## Bu, Opus 5.5'in fast mode GA duyurusuyla ilgili mi?

Doğrudan değil; bunlar ayrı yayılımlar. [Opus 5.5'in fast mode'da genel kullanıma açılması](/tr/posts/claude-fast-mode-opus-5-5-genel-kullanimda), bu Vertex AI genişlemesinden aylar önce Anthropic API'de gerçekleşti ve Opus 5.5, Vertex AI'da fast mode ile hâlâ hiç mevcut değil. Ekibiniz [Opus 4.8 fast mode kullanımdan kaldırma tarihini](/tr/posts/opus-4-8-fast-mode-ne-zaman-kaldiriliyor) de takip ediyorsa, o tarihin Anthropic API yoluna ait olduğunu, Vertex AI'ya ait olmadığını unutmayın; çünkü Opus 4.8 orada hiçbir zaman fast mode ile sunulmadı.

Kişisel görüşüm şu: önce Opus 5.5 değil, Fable 5.2'yi göndermeleri burada daha ilginç bir sinyal. Bu, Anthropic'in Opus seviyesindeki trafiği taahhüt etmeden önce Vertex AI'ın fast-mode altyapısını daha dar, daha yeni bir modelde test ettiğini gösteriyor; bulutlar arası bir özelliğin riskini azaltmanın mantıklı bir yolu, ama bu Google Cloud'daki kurumsal Opus kullanıcılarının daha uzun beklemesi anlamına geliyor.

## Bölge kısıtlaması neden var?

Anthropic teknik bir açıklama yayınlamadı, ama kalıp Vertex AI'ın Claude'u genel olarak sunma şekliyle uyumlu: bölgesel endpoint'ler farklı altyapılara yönlendiriyor ve `global`, `us`, `eu`, Google Cloud'un Claude modelleri için belgelediği üç endpoint türü. Fast mode, büyük olasılıkla sadece bu üç endpoint'in şu an sunduğu sunum yoluna gerek duyuyor.

## Vertex AI'da Claude Code kullanan ekipler şimdi ne yapmalı?

Claude Code'u v2.1.322 veya sonrasına güncelleyin, `VERTEX_REGION_CLAUDE_FABLE_5_2` değişkenini `global`, `us` veya `eu` olarak ayarlayın ve geniş çapta devreye almadan önce `/fast`'ı atılabilir bir oturumda test edin; reddedilen bir istekteki 30 dakikalık geri çekilme, hatalı yapılandırılmış bir bölgenin, siz hata ayıklarken size sessizce yarım saatlik hız kaybı yaşatacağı anlamına geliyor.

## Sıkça Sorulan Sorular

### Claude Code fast mode Vertex AI'da çalışıyor mu?

Evet, 10 Kasım 2026'da yayınlanan Claude Code v2.1.322 itibarıyla çalışıyor; ama sadece Claude Fable 5.2 için ve sadece Vertex bölgesi `global`, `us` veya `eu` olarak ayarlıyken. Opus 5.5, Opus 5 ve Opus 4.8 hâlâ Vertex AI'da fast mode'u desteklemiyor.

### Fast mode, Amazon Bedrock veya Microsoft Foundry'de çalışıyor mu?

Hayır. Fast mode, Amazon Bedrock, Microsoft Foundry ve AWS üzerindeki Claude Platform'da hâlâ mevcut değil; bu sağlayıcılarda `/fast` kullanmaya çalışmak "Fast mode is not available on this provider" hatasını döndürüyor. Vertex AI şu an fast mode desteği olan tek üçüncü taraf bulut platformu.

### Vertex AI'da fast mode için hangi Claude Code sürümü gerekiyor?

Vertex AI yayılımı için özellikle v2.1.322 veya sonrası gerekiyor. Anthropic API'de fast mode'u zaten destekleyen daha eski bir sürüm, bu desteği Vertex AI'ya otomatik olarak taşımıyor; iki kod yolu ayrı ayrı gönderildi.

### Vertex AI'da fast mode ek ücret getiriyor mu?

Evet. Fable 5.2'nin fast mode oranı milyon giriş token'ı için 16 dolar ve milyon çıkış token'ı için 80 dolar; bu, standart hızdaki ima edilen maliyetinin kabaca iki katı ve gerçekte ne kadarını kullandığınızdan bağımsız olarak tam bağlam penceresi boyunca sabit faturalanıyor.
