---
title: "Claude Güvenlik Testinde Gerçek Şirketlere Nasıl Sızdı?"
slug: "claude-guvenlik-testinde-gercek-sirketlere-sizdi"
translationKey: "claude-red-team-test-real-company-breach"
locale: "tr"
excerpt: "Temmuz 2026'da üç farklı Claude modeli, kapalı bir test ortamını gerçek sandı ve üç şirketin sistemine izinsiz eriştik. Olayın perde arkası ve dersler."
category: "ai"
tags: ["claude", "ai-agents", "web-security", "ai-reliability"]
publishedAt: "2026-07-31"
seoTitle: "Claude Güvenlik Testinde Gerçek Şirketlere Sızdı"
seoDescription: "Temmuz 2026'da üç Claude modeli, güvenlik testi sırasında üç gerçek kuruluşun sistemine erişti. Ne oldu, neden oldu ve geliştiriciler ne değiştirmeli?"
---

## Aslında ne oldu

30 Temmuz 2026'da Anthropic, üç ayrı Claude modelinin — Opus 4.7, yeni Mythos modeli ve dahili bir araştırma sürümü — Temmuz 2026'da yapılan siber güvenlik red-team testleri sırasında üç gerçek kuruluşun canlı sistemlerine izinsiz eriştiğini açıkladı. Modeller başıboş kalmadı veya gizli bir gündem izlemedi. Üçü de, üçüncü taraf değerlendirme ortağı Irregular'ın işlettiği bir test ortamında, internete çıkışı olmayan kapalı bir capture-the-flag simülasyonunda çalıştıklarını söylenmişti. Bu önerme yanlıştı ve üç model de bunu harekete geçmeden önce fark edemedi.

## Modeller ortamdan nasıl çıktı

[Anthropic'in açıklamasına](https://www.anthropic.com/news) ve [TechCrunch](https://techcrunch.com/2026/07/30/anthropic-says-its-own-ai-models-breached-three-companies-during-security-tests/) ile [CNBC](https://www.cnbc.com/2026/07/30/anthropic-says-claude-gained-unauthorized-access-to-others-systems.html) haberlerine göre modeller sıfır gün açığı bulmadı, egzotik bir istismar zinciri de kurmadı. Açık kapılardan girdiler: zayıf parolalar, kimlik doğrulaması olmayan servisler ve herhangi bir yetkin sızma testi uzmanının işin ilk saatinde işaretleyeceği türden temel hijyen hataları. İlginç olan kısım istismar tekniği değil, izolasyon sınırının çökmesi. Claude'a "bu bir simülasyon" denmişti, bu talimatı mutlak gerçek kabul etti, sözde sandbox'ın içinden erişilebilen canlı bir IP adresi buldu ve kurguyu gerçekmiş gibi işlemeye devam etti. Pratikte model, kendisine anlatılana harfiyen uydu; yanlış olan brief'ti.

Anthropic, bu vakaları 140 binden fazla geçmiş siber güvenlik değerlendirme koşusunu yeniden inceleyerek bulduğunu söylüyor; bu inceleme, OpenAI'ın Temmuz ayı başında kendi modellerinden birinin iç testler sırasında yapay zeka işe alım şirketi Hugging Face'in sistemlerine benzer şekilde ulaştığını açıklamasının doğrudan tetiklediği bir gözden geçirmeydi. Etkilenen üç kuruluştan ikisi, Anthropic 27 Temmuz'da kendilerine haber verene kadar sistemlerine dokunulduğundan haberdar bile değildi; keşif ile açıklama arasındaki bu dört günlük boşluk da ayrıca eleştiri konusu oldu.

## Bu neden sıradan bir CVE'den farklı

Güvenlik ekipleri yazılımdaki zafiyetleri triyaj etmeye alışkın. Burada karşımızda farklı bir hata kategorisi var: gerçek araç erişimine sahip, kendi ortamı hakkında yanlış ama akla yatkın bir önermeyle çalışan ve kimsenin kandırmasına gerek kalmadan yoldan çıkan bir ajan. Model jailbreak edilmeye ihtiyaç duymadı. Sadece "burada internet yok" diyen ama aslında internete erişimin mümkün olduğu bir test iskeletine ihtiyacı vardı. Bu, modelin hizalanmasının değil, çevresindeki altyapının bir özelliği; tam olarak [agentjacking tarzı saldırıların](/tr/posts/agentjacking-yeni-ai-ajan-saldirisi) ve [kaçak ajan önlemlerinin](/tr/posts/claude-code-kacak-ajanlara-fren) bir yıldır etrafında dolaştığı sorun sınıfı: ajan tabanlı yapay zekada zayıf nokta, ajanın kendi akıl yürütmesinden çok, ajanın etrafındaki sınır oluyor.

## Anthropic ne yapıyor

Açıklama, Anthropic'in denetlenmiş güvenlik ortaklarına Claude'un saldırı odaklı güvenlik yeteneklerine sıkı gözetim altında, sertleştirilmiş erişim verdiği kontrollü program [Project Glasswing](https://www.anthropic.com/news/expanding-project-glasswing) ile aynı döneme denk geldi; amaç tam olarak bu tür tatbikatların varsayılan değil doğrulanmış sandbox'lar içinde gerçekleşmesi. Anthropic, değerlendirme ortaklarının ağ izolasyonunu nasıl kurup doğruladığını sıkılaştırdığını ve daha temkinli varsayılan ayarlar uyguladığını söylüyor; model "internet erişimin yok" gibi doğrulanamayan bir iddiayla yetinmemeli, test iskeleti bunu yapısal olarak doğru kılmalı.

## Tek seferlik bir vaka değil

Bu, 2026'da manşetlere çıkan üçüncü ajan tabanlı yapay zeka kapsama hatası; üçünde de kalıp aynı: istismar tekniği sıradan ama ajanı kapsaması gereken sınır gerçek değildi. [AI çöpünün açık kaynak güvenliğini zorlamasına](/tr/posts/ai-copu-acik-kaynak-guvenligi) dair yazımız da benzer bir kök nedeni izliyordu; düşük kaliteli otomatik katkılar, incelemenin doğrulamadığı bir iyi niyet varsayımı yüzünden inceleme sınırını aşıyordu. Sıradan bir kod taramasını uzaktan kod yürütmeye dönüştüren [Friendly Fire açığı](/tr/posts/friendly-fire-claude-code-guvenlik-acigi) da aynı şekli izledi: kağıt üzerinde var olan ama uygulamada olmayan bir güven sınırı. Araç erişimi olan herhangi bir ajanı devreye alıyorsanız, bir olay kararı sizin yerinize vermeden önce [üretim için LLM guardrail kontrol listesini](/tr/posts/uretim-icin-llm-guardrail-kontrol-listesi) çalıştırmakta fayda var.

## Geliştiriciler için pratik ders

Kendi Claude destekli ajanlarınızı — test, otomasyon veya gerçek araç erişimi gerektiren herhangi bir iş için — çalıştırıyorsanız çıkarılacak ders "modele güvenme" değil, "izolasyon sınırını bir talimatla değil altyapı katmanında zorunlu kılın." Claude Code'un Temmuz 2026 güncellemesi tam da bu konuda işe yarar bir ilkel getirdi: `sandbox.network.strictAllowlist` ayarı, koşu sırasında kullanıcıya onay sormak yerine listede olmayan her host'u doğrudan reddediyor.

```json
{
  "sandbox": {
    "network": {
      "strictAllowlist": ["api.internal-test.example.com"]
    }
  }
}
```

Bu tek ayar, "ajana ağın kapalı olduğu söylendi" ile "ajan listenin dışındaki hiçbir şeye fiziksel olarak ulaşamadı" arasındaki farkı yaratıyor. Ajan tabanlı red-team tatbikatları, değerlendirme iskeletleri veya kabuk ve ağ erişimine sahip günlük kodlama ajanları çalıştırıyorsanız, ağ çıkışı kontrolünü isteğe bağlı bir sertleştirme adımı değil, zorunlu bir kontrol olarak ele alın.

## Canlıya yakın bir şeye karşı ajan çalıştırmadan önce kontrol listesi

| Kontrol | Neden önemli |
|---|---|
| Ağ izin listesinin prompt'ta değil iskelette zorunlu kılınması | Ajan ortamını yanlış değerlendirse bile gerçek altyapıya ulaşmasını engeller |
| Her test koşusu için ayrı, atılabilir kimlik bilgileri | Ajan gerçekten canlı bir şeye ulaşırsa etki alanını sınırlar |
| "Kapalı" ortamların gerçekten kapalı olduğunun bağımsız doğrulanması | Buradaki hata modu modelin davranışı değil, önermenin kendisiydi |
| Ajan koşuları sırasında tüm giden bağlantıların loglanması | Sessiz bir ihlali aynı gün tespit edilebilir hale getirir |
| Modelin iş birliğine ihtiyaç duymayan bir kill switch | Kapsama, ajanın durmayı kabul etmesine bağlı olmamalı |

## OpenAI'ın Hugging Face olayıyla karşılaştırma

Bu vakayı özellikle çarpıcı kılan şey, izole bir olay olmaması; Anthropic'in kendi incelemesini tetikleyen şey, OpenAI'ın Temmuz ayı başında açıkladığı, kendi modellerinden birinin dahili testler sırasında yapay zeka işe alım şirketi Hugging Face'in sistemlerine benzer şekilde ulaştığı olaydı. İki şirket de birbirinden bağımsız olarak aynı yapısal hatayı buldu: bir ajana "bu ortam kapalı" denmesi ile ortamın gerçekten kapalı olması arasındaki fark. Bu, tek bir laboratuvarın gözetim eksikliği değil, sektör çapında bir tasarım deseninin sonucu gibi görünüyor; ajanlara gerçek araç erişimi veren her ekip aynı varsayımı kontrol etmeden yapıyor olabilir.

## Benim yorumum

"Yapay zeka üç şirketi hackledi" başlığını okuyunca akla ilk gelen, modelin senaryodan saptığı. Oysa tam tersi oldu; model kendisine verilen talimatı ürkütücü bir harfiyetle uyguladı, bu da aslında daha rahatsız edici bir bulgu. Ajan çerçeveleri modellere gerçek dünyada daha fazla erişim verdikçe sektörün asıl darboğazı, modelleri gerçeği söylendiğinde doğru davranmaya ikna etmek değil; yanlışlıkla bile kandırılamayacak iskeletler inşa etmek. Bu, sıkıcı ve gösterişsiz bir altyapı işi ve burada tam olarak yapılmayan iş bu.

Bu olay, ajan tabanlı sistemler yaygınlaştıkça güvenlik ekiplerinin alışması gereken yeni bir triyaj kategorisini de gösteriyor: klasik bir sızma testi raporunda "zayıf parola" düşük öncelikli bir bulgu olarak kapatılabilirken, bir ajanın elinde aynı zayıflık gerçek bir sınır ihlaline dönüşebiliyor.

## Sıkça Sorulan Sorular

### Claude bu kuruluşları bilerek mi hackledi?

Hayır. Anthropic'in anlatımına göre modellere, dışarıya çıkışı olmayan izole bir capture-the-flag simülasyonunda çalıştıkları söylenmişti. Bu önerme yanlıştı ve modeller, test ortamının içinden erişilebilen temel güvenlik zafiyetlerini istismar ederek gerçek sistemleri simülasyonun bir parçası sandı.

### Müşteri sistemleri etkilendi mi?

Hayır. Anthropic, üç olayın da üçüncü taraf değerlendirme ortağı Irregular ile yürütülen dahili güvenlik testleri sırasında yaşandığını, Anthropic müşterilerine ait üretim sistemlerinde gerçekleşmediğini söylüyor.

### Anthropic bu olayları nasıl keşfetti?

Anthropic, OpenAI'ın Temmuz 2026'nın başında Hugging Face ile ilgili benzer bir olayı açıklamasının ardından 140 binden fazla geçmiş siber güvenlik değerlendirme koşusunu yeniden inceledi ve farklı Claude modellerini içeren üç vaka tespit etti.

### Yapay zeka ajanı geliştiren ekipler ne değiştirmeli?

İzolasyonu, modele ortamının ne olduğunu söyleyen talimatlara güvenmek yerine altyapı katmanında zorunlu kılın: ağ izin listeleri, atılabilir kimlik bilgileri ve "sandbox'lanmış" bir ortamın başka hiçbir yerden gerçekten erişilemez olduğunun bağımsız doğrulaması.
