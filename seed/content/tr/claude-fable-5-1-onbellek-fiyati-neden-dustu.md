---
title: "Claude Fable 5.1 Nedir? Önbellek Fiyatı Neden %75 Düştü?"
slug: "claude-fable-5-1-onbellek-fiyati-neden-dustu"
translationKey: "claude-fable-5-1-cache-pricing-cut"
locale: "tr"
excerpt: "Anthropic, Claude Fable 5.1'de önbellek okuma fiyatını milyon token başına 1 dolardan 0,25 dolara indirdi; ajan iş yüklerinde faturayı %45'e kadar düşürüyor."
category: "ai"
tags: ["claude", "cost-optimization", "ai-agents", "ai-infrastructure", "prompt-engineering"]
publishedAt: "2026-09-03"
seoTitle: "Claude Fable 5.1: Önbellek Fiyatı Neden %75 Düştü?"
seoDescription: "Claude Fable 5.1'de önbellek okuma fiyatı 1 dolardan 0,25 dolara indi, yani %75 düşüş. Fiyatlandırma tablosu, API değişikliği ve maliyet hesabı burada."
---

Kısa cevap: Anthropic, Claude Fable 5.1'de önbellek okuma fiyatını %75 indirerek milyon token başına 1 dolardan 0,25 dolara çekti; temel girdi ve çıktı fiyatları ise milyon token başına 10 ve 50 dolarda sabit kaldı. Ajan tabanlı iş yükleri aynı bağlamı (sistem promptu, araç tanımları, repo dosyaları) neredeyse her turda yeniden okuduğu için bu indirim tipik iş yüklerinde faturayı yaklaşık %25, yoğun ajan iş yüklerinde ise %45'e kadar düşürebiliyor.

Anthropic, 1 Eylül 2026'da Claude Fable 5.1'i ve kısıtlı sürüm Claude Mythos 5.1'i, aynı gün yayınlanan Claude Code 2.1.257 ile birlikte piyasaya sürdü; Claude Code bu sürümle birlikte varsayılan modelini Fable 5.1'e çevirdi. Buradaki asıl haber daha akıllı bir model değil — Anthropic'in daha önce bu kadar ileri götürmediği bir fiyatlandırma kolu.

## Claude Fable 5.1 Nedir?

Claude Fable 5.1, Anthropic'in Fable model ailesine Eylül 2026'da getirdiği güncelleme; yanında Mythos 5.1 adlı kısıtlı bir varyant da geliyor. Model, varsayılan olarak 1.000.000 token bağlam penceresine, en fazla 128.000 token çıktıya ve sürekli açık adaptif düşünme özelliğine sahip — önceki bazı Claude katmanlarının aksine, akıl yürütmeyi tamamen kapatmak mümkün değil.

Fable 5.1, Eylül 2026 itibarıyla Claude API, Amazon Bedrock, Google Cloud Vertex AI ve Microsoft Foundry üzerinden erişilebilir durumda. Aynı gün çıkan Claude Code 2.1.257, varsayılan modelini Fable 5.1'e çevirdi; çoğu geliştirici için fiyat değişikliğini doğrudan API çağrısı yerine kodlama ajanı üzerinden ilk hissedecekleri kanal bu. Claude Code'un işi modeller arasında yönlendiren [Otomatik Modu'nu](/tr/posts/claude-code-auto-mode-nasil-calisir) kullananlar, Fable 5.1 seçildiğinde yeni önbellek fiyatlandırmasını otomatik olarak devralıyor.

## Önbellek Fiyatı Neden %75 Düştü?

Fable 5.1'de önbellek okuma fiyatı milyon token başına 0,25 dolar; Fable 5'te bu rakam 1 dolardı. Bu, 10 dolarlık temel girdi fiyatının 0,025 katına denk geliyor — önceki tüm Claude modellerinin kullandığı standart 0,1 kat çarpanının çok altında. Anthropic bu rakamın gerekçesini ayrıntılı açıklamadı, ama değişiklik doğrudan prompt önbellekleme özelliğini değerli kılan iş yüklerini hedefliyor.

Prompt önbellekleme, modelin daha önce gördüğü bir girdiyi, aynı önek belirli bir süre içinde tekrar kullanıldığında, temel girdi maliyetinin bir kısmı karşılığında yeniden işlemeden atlamasını sağlıyor. Fable 5.1'de temel girdi ve çıktı fiyatları Fable 5'le aynı: milyon token başına 10 dolar girdi, 50 dolar çıktı. Önbellek yazma fiyatları da değişmedi — 5 dakikalık önbellek için milyon token başına 12,50 dolar, 1 saatlik önbellek için 20 dolar. Sadece okuma tarafı değişti, üstelik önceki hiçbir Claude fiyat güncellemesinden daha büyük bir oranda.

Karşılaştırma tablosu şöyle:

| Fiyatlandırma kalemi | Claude Fable 5 | Claude Fable 5.1 | Değişim |
|---|---|---|---|
| Temel girdi | 10 $/MTok | 10 $/MTok | Değişmedi |
| Temel çıktı | 50 $/MTok | 50 $/MTok | Değişmedi |
| Önbellek yazma (5 dk) | 12,50 $/MTok | 12,50 $/MTok | Değişmedi |
| Önbellek yazma (1 saat) | 20 $/MTok | 20 $/MTok | Değişmedi |
| Önbellek okuma | 1,00 $/MTok | 0,25 $/MTok | −%75 |

## Bu Değişiklik Faturada Gerçekte Ne Kadar Fark Yaratıyor?

Anthropic'in kendi açıklamaları ve bağımsız haberler, tipik bir iş yükünde tasarrufun yaklaşık %25, önbellek okumalarının toplam token harcamasının büyük kısmını oluşturduğu yoğun ajan iş yüklerinde ise %45'e kadar çıktığını belirtiyor. Bu iki rakam arasındaki fark aslında her şeyi anlatıyor: iş yükünüz önbellek okumalarına ne kadar az bağımlıysa, bu spesifik indirim size o kadar az fayda sağlıyor.

"Yoğun ajan iş yükü" burada, her turda büyük ve büyük ölçüde değişmeyen bağlamı yeniden gönderen iş yükünü ifade ediyor: sistem promptları, araç tanımları, büyük bir kod deposunun önemli bir kısmı veya devam eden bir konuşma dökümü. Bunlar tam olarak Claude Code'un, MCP tabanlı ajanların ve uzun kodlama oturumlarının ürettiği örüntüler; Anthropic'in bu fiyat değişikliğini Fable 5.1'i varsayılan model yapan aynı günlük Claude Code sürümüyle eşleştirmesinin nedeni de bu.

İş yükünüz kısa, büyük ölçüde benzersiz promptlar gönderiyor ve önbellek tekrarı azsa, bu aralığın alt ucunu ya da neredeyse hiç değişiklik olmadığını bekleyin — çünkü asıl ödediğiniz temel fiyatlar dokunulmadan kaldı. Bu yüzden basit görevler için [Gemini 3.6 Flash](/tr/posts/gemini-3-6-flash-ile-gelistirme) gibi ucuz, düşük bağlamlı modelleri değerlendiren ekipler için önbellek ağırlıklı fiyat indirimleri pek fark yaratmıyor — karşılaştırma ancak kendi bağlam tekrar kullanımınız yüksek olduğunda anlamlı hale geliyor.

## Fable 5.1'deki Kırıcı API Değişikliği Nedir?

Claude Fable 5.1 ve Mythos 5.1'de `tool_choice` parametresinin `any` ve `tool` değerleri artık desteklenmiyor ve HTTP 400 hatası döndürüyor; bunun yerine `auto` veya `none` kullanılmalı. Belirli bir aracı zorunlu kılan veya herhangi bir aracın çağrılmasını zorunlu kılan mevcut entegrasyonlar, sessizce bozulmak yerine yükseltme sonrası doğrudan hata verecek.

Bu değişikliği maliyet haberinden ayrı vurgulamakta fayda var, çünkü maliyet panelinde görünmüyor — üretimde başarısız bir istek olarak karşınıza çıkıyor. Araç zorlama mantığı olan ekiplerin, Fable 5.1'i müşteriye dönük herhangi bir sisteme dahil etmeden önce kod tabanlarında `tool_choice` için arama yapması gerekiyor.

## Fable 5.1'de Prompt Önbellekleme Nasıl Kullanılır?

Yeniden kullanılabilir bir girdi bloğunu API isteğinde `cache_control` alanıyla işaretlersiniz; Claude bunu saklar ve aynı öneke sahip sonraki bir istek, tam girdi fiyatı yerine önbellek okuma fiyatını öder. Aşağıda büyük bir sistem promptunu önbelleğe alınabilir olarak işaretleyen minimal bir örnek var:

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-fable-5-1",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": "Sen bir kod inceleme asistanısın. <buraya büyük repo bağlamı, araç tanımları ve talimatlar gelir>",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        {"role": "user", "content": "482 numaralı pull request'teki diff'i incele."}
    ]
)
```

İlk çağrı önbellek yazma fiyatını öder (varsayılan 5 dakikalık önbellek için 12,50 $/MTok). Önbellek penceresi içinde aynı `system` önekini yeniden kullanan sonraki her çağrı, 10 $/MTok'luk temel girdi fiyatı yerine yeni 0,25 $/MTok'luk okuma fiyatını öder — bu, isteğin o kısmında Fable 5'in önbellek okuma fiyatına göre sadece %75 değil, temel fiyata göre %97,5'lik bir indirim demek.

## Önbellek Fiyatı mı, Temel Fiyat mı Daha Önemli Bir Trend?

Benim görüşüm: önbellek fiyatı indirimleri gerçek ajan iş yükü maliyetleri için daha belirleyici kol, temel fiyat indirimleri ise geri kalan her şey için daha belirleyici kol — çoğu ekip kendi iş yükünün bu iki tarafa ne kadar dengesiz dağıldığını olduğundan az tahmin ediyor. Temel fiyat indirimi her token'a eşit fayda sağlar; önbellek fiyatı indirimi ise sadece zaten tekrar kullandığınız token'lara fayda sağlar, ama sürekli tekrar kullanan ajanlar için bu token'lar faturanın büyük kısmını oluşturur.

Bu, Anthropic'in 2026'daki ikinci büyük önbellek fiyatlandırması hamlesi. Ağustos 2026'da [Claude Sonnet 5'in giriş fiyatlandırması kalıcı hale geldi](/tr/posts/claude-sonnet-5-fiyati-kalici-oldu) ve daha yüksek standart fiyata dönmedi — bu bir temel fiyat kararıydı. Fable 5.1'deki indirim ise bir önbellek fiyatı kararı; bu da Anthropic'in bundan sonra önbellek fiyatlandırmasını, temel fiyata bağlı sabit bir indirim olarak değil, kendi başına ayrı bir kol olarak ele aldığını gösteriyor.

Zaten [Claude Code'un kullanım ve maliyet ekranlarında](/tr/posts/claude-code-harcama-limitleri-prompt-cache) önbellek isabet oranınızı takip ediyorsanız, bu rakamı çıkarıp faturanızla çarpmanın tam zamanı — önbellek okumalarının payı %70 olan bir iş yükü ile %10 olan bir iş yükü, aynı modeli kullansalar bile çok farklı bir sonuç görür.

## Sıkça Sorulan Sorular

### Claude Fable 5.1, Fable 5'ten ne kadar ucuz?

Temel girdi ve çıktı fiyatları aynı — milyon token başına 10 ve 50 dolar. Değişen tek fiyat, %75 indirimle 1 dolardan 0,25 dolara inen önbellek okuma fiyatı. Faturaya toplam etkisi, iş yükünüzün ne kadarının önbelleğe isabet ettiğine bağlı: Anthropic'in ve bağımsız kaynakların tahminlerine göre tipik iş yüklerinde yaklaşık %25, yoğun ajan iş yüklerinde yaklaşık %45 tasarruf sağlanıyor.

### Claude Fable 5.1'de genişletilmiş düşünme kapatılabiliyor mu?

Hayır. Fable 5.1 sürekli açık adaptif düşünme kullanıyor; bazı önceki Claude modellerinde mümkün olan tam kapatma seçeneği burada yok. Entegrasyonunuz düşünmenin kapatılabileceğini varsayıyorsa, bu varsayım Eylül 2026 itibarıyla artık geçerli değil.

### tool_choice: "any" neden Fable 5.1'de 400 hatası veriyor?

Anthropic, Fable 5.1 ve Mythos 5.1'de `tool_choice` parametresinin `any` ve `tool` değerlerinin desteğini kaldırdı; her ikisi de artık HTTP 400 hatası döndürüyor. Bunun yerine `auto` (modelin kendi kararını vermesi) veya `none` (o çağrı için araç kullanımını devre dışı bırakma) kullanılmalı. Eski değerlerle belirli bir aracı zorunlu kılan kod, yükseltmeden önce değiştirilmeli.

### Claude Fable 5.1 nerelerden çalıştırılabiliyor?

Eylül 2026 itibarıyla Fable 5.1, Claude API, Amazon Bedrock, Google Cloud Vertex AI ve Microsoft Foundry üzerinden erişilebiliyor. Aynı gün yayınlanan Claude Code 2.1.257, varsayılan modelini Fable 5.1'e çevirdi; bu yüzden model belirlemeden Claude Code kullanan herkes otomatik olarak bu modele geçmiş oluyor.

Anthropic'in model ailesi ve fiyatlandırma hamleleri hakkında daha fazlası için Woyable'ın [yapay zeka kategorisine](/tr/category/yapay-zeka) göz atabilirsiniz.

Kaynaklar: [Anthropic platform sürüm notları](https://platform.claude.com/docs/en/release-notes/overview), [Anthropic prompt önbellekleme dokümantasyonu](https://platform.claude.com/docs/en/build-with-claude/prompt-caching), [VentureBeat'in Fable 5.1 lansmanı haberi](https://venturebeat.com/technology/anthropics-claude-fable-5-1-and-mythos-5-1-arrive-with-a-75-cost-reduction-for-fable-cache-reads).
