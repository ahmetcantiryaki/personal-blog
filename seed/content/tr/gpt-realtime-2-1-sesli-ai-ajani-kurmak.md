---
title: "gpt-realtime-2.1 ile Üretim Sesli AI Ajanı Kurmak"
slug: "gpt-realtime-2-1-sesli-ai-ajani-kurmak"
translationKey: "gpt-realtime-voice-agents"
locale: "tr"
excerpt: "OpenAI'nin gpt-realtime-2.1 ve mini modelleriyle üretim sesli ajanı kurma rehberi: WebRTC, WebSocket, SIP seçimi, reasoning-gecikme dengesi ve fiyatlandırma."
category: "ai"
tags: ["ai-agents", "llm", "ai-infrastructure", "ai-tools"]
publishedAt: "2026-07-10"
seoTitle: "gpt-realtime-2.1 ile Sesli AI Ajanı Kurma Rehberi"
seoDescription: "gpt-realtime-2.1 ve mini modeliyle üretim sesli ajanı kurma rehberi: taşıma katmanı seçimi, reasoning-gecikme dengesi, fiyatlandırma ve kesinti yönetimi."
---

gpt-realtime-2.1 ile sesli ajan kurmak için üç kararı baştan vermeniz gerekir: taşıma katmanı (WebRTC, WebSocket veya SIP), model seçimi (flagship mi mini mi) ve reasoning effort seviyesi. Bu üçü birlikte gecikmeyi, maliyeti ve konuşma kalitesini belirler; aşağıda her birini üretim örnekleriyle ele alıyoruz.

OpenAI, 6 Temmuz 2026'da Realtime API için gpt-realtime-2.1 ve gpt-realtime-2.1-mini modellerini yayınladı. Bu sürüm iki şeyi aynı anda çözüyor: önbellekleme iyileştirmeleriyle p95 gecikmesini önceki nesle göre en az %25 düşürüyor ve daha önce yalnızca flagship modelde bulunan reasoning ile araç kullanımı yeteneğini artık mini modelde de sunuyor. Pratikte bu, telefon hattı gecikmesine yakın, gerçek muhakeme yapabilen ve mini fiyatına çalışan bir sesli ajanın artık mümkün olduğu anlamına geliyor.

Bu yazı [OpenAI'nin resmi model sayfasına](https://developers.openai.com/api/docs/models/gpt-realtime-2.1) ve [duyuru yazısına](https://openai.com/index/introducing-gpt-realtime/) dayanıyor; sayılar orada doğrulanabilir.

## Full-duplex sesli ajan ne anlama gelir?

Full-duplex, modelin siz konuşurken de dinleyebilmesi ve gerektiğinde araya girebilmesi demektir. Klasik ses hatları konuşma turlarını sırayla işler: kullanıcı konuşur, susar, model işler, cevap verir. gpt-realtime-2.1 gibi Realtime modeller ses akışını sürekli dinler, kullanıcı "dur, yanlış anladım" dediğinde modelin kendi cevabını kesip yeni girdiye geçmesine izin verir. Bu, telefonla konuşan bir insan gibi davranan ajanlar için ön koşuldur.

Ayrı bir gelişmeyi burada karıştırmamak önemli: OpenAI 8 Temmuz 2026'da GPT-Live-1 ve GPT-Live-1 mini modellerini tüketici ChatGPT uygulaması için ayrı bir full-duplex ses motoru olarak duyurdu. Bu modellerin API erişimi henüz açıklanmadı. Geliştiriciler için bugün üretime hazır ve API üzerinden erişilebilir olan aile gpt-realtime-2.1'dir; ikisini karıştırmayın.

## WebRTC, WebSocket ve SIP: hangisini seçmelisiniz?

gpt-realtime-2.1 üç taşıma protokolü sunar ve seçim büyük ölçüde ajanınızın nerede yaşadığına bağlıdır.

| Taşıma | En iyi kullanım | Avantaj | Dezavantaj |
|---|---|---|---|
| WebRTC | Tarayıcı içi sesli widget, mobil uygulama | En düşük ses gecikmesi, tarayıcıda yerleşik jitter/echo yönetimi | Sunucu tarafı entegrasyonu daha karmaşık |
| WebSocket | Sunucu tarafı orkestrasyon, ajan-ajan köprüleme | Tam kontrol, mevcut backend'e kolay entegrasyon | Ses paketleme ve jitter yönetimini siz üstlenirsiniz |
| SIP | Telefon hattı tabanlı ajanlar, çağrı merkezi | Mevcut PSTN/PBX altyapısıyla doğrudan çalışır | Sinyal katmanı (SIP trunk, DTMF) ek karmaşıklık getirir |

Kural olarak: kullanıcı bir web sayfasında mikrofon düğmesine tıklıyorsa WebRTC'ye gidin, çünkü ses işleme yükünü tarayıcıya bırakır ve gecikmeyi minimumda tutar. Ajanınız mevcut bir backend orkestrasyon katmanının parçasıysa ve ses akışını kendi altyapınızdan geçirmeniz gerekiyorsa WebSocket daha esnektir. Ajan gerçek bir telefon numarasını cevaplıyorsa SIP tek mantıklı seçenektir; SIP trunk'ınızı doğrudan Realtime API'ye bağlarsınız ve OpenAI, çağrı sinyalleşmesini sizin yerinize yönetir.

Aynı ajanın hem web widget'ı hem de telefon hattı olması nadir değildir; bu durumda iş mantığını (fonksiyon çağrıları, oturum durumu) taşıma katmanından ayırarak iki uçtan da aynı orkestrasyon koduna bağlanmanız gerekir. Bu, [çok ajanlı orkestrasyon kalıpları](/tr/posts/cok-ajanli-orkestrasyon-kaliplari) yazımızda anlattığımız katman ayrımıyla aynı prensibe dayanır.

## Reasoning effort ve gecikme dengesi nasıl kurulur?

gpt-realtime-2.1, yapılandırılabilir bir reasoning effort parametresi sunar. Effort'u yükseltmek modelin daha karmaşık talimatları, çok adımlı araç zincirlerini ve belirsiz kullanıcı isteklerini daha iyi çözmesini sağlar; ama her ek muhakeme adımı hem token tüketimini hem de ilk yanıt gecikmesini artırır. Sesli bir arayüzde bu, kullanıcının sessizlikte beklediği süre demektir; metin sohbetinde görmezden gelinebilecek bir gecikme, telefonda hemen fark edilir.

Pratikte etkili yaklaşım, sabit bir global effort seviyesi seçmek yerine görev tipine göre ayarlamaktır: basit bilgi sorguları ve rezervasyon onayları için düşük effort, çok adımlı karar gerektiren destek akışları (iade politikası yorumlama, çelişkili talimatları çözme) için yüksek effort. Oturum başlatma isteğinde bu tercih basit bir alan olarak geçer:

```json
{
  "type": "session.update",
  "session": {
    "model": "gpt-realtime-2.1",
    "voice": "alloy",
    "reasoning": { "effort": "medium" },
    "turn_detection": {
      "type": "server_vad",
      "interrupt_response": true
    },
    "tools": [
      {
        "type": "function",
        "name": "check_order_status",
        "description": "Sipariş numarasına göre kargo durumunu getirir.",
        "parameters": {
          "type": "object",
          "properties": {
            "order_id": { "type": "string" }
          },
          "required": ["order_id"]
        }
      }
    ]
  }
}
```

`interrupt_response: true` alanı, kullanıcı konuşurken modelin kendi sesini kesmesine izin verir; barge-in (kesinti) davranışının temelini bu bayrak oluşturur. Yüksek reasoning effort ile birleştiğinde, model bir araç çağrısının ortasındayken kullanıcı araya girerse akışı yeniden planlamak zorunda kalır; bu durumu üretime almadan önce mutlaka test edin, çünkü yarım kalan araç çağrıları en sık karşılaşılan üretim hatasıdır.

## mini mi, flagship mi? Fiyat ve performans karşılaştırması

Karar çoğunlukla fiyat farkında netleşir. Metin token fiyatlandırması şöyle:

| Model | Girdi (1M token) | Çıktı (1M token) | Reasoning + araç desteği |
|---|---|---|---|
| gpt-realtime-2 (önceki flagship) | Karşılaştırma referansı | Karşılaştırma referansı | Yalnızca flagship'te vardı |
| gpt-realtime-2.1 (flagship) | $4.00 | $24.00 | Var, yapılandırılabilir effort |
| gpt-realtime-2.1-mini | $0.60 | $2.40 | Artık mini'de de var |

[OpenAI'nin gpt-realtime-2.1-mini model sayfasında](https://developers.openai.com/api/docs/models/gpt-realtime-2.1-mini) da detaylandırıldığı gibi, bu tablodaki en önemli satır mini'nin reasoning desteğidir. Önceki nesilde reasoning ve araç kullanımı yalnızca flagship modelde vardı; mini modeller basit, tek turlu yanıtlarla sınırlıydı. gpt-realtime-2.1-mini'nin damıtılmış bir reasoning modeli olması, artık çok adımlı araç çağrısı gerektiren akışları da mini fiyatına çalıştırabileceğiniz anlamına gelir; flagship'e yalnızca gerçekten karmaşık, yüksek riskli görüşmeler (örneğin sözleşme müzakeresi, tıbbi triaj benzeri hassas akışlar) için ihtiyacınız olur.

Bizim varsayılan tavsiyemiz: yeni bir sesli ajan projesine mini ile başlayın, effort seviyesini `medium`'a çekin, üretim trafiğinde hangi konuşma sınıflarının hata verdiğini ölçün ve yalnızca o alt kümeyi flagship'e yönlendirin. Baştan flagship'e gitmek, çoğu B2B destek ve rezervasyon akışı için gereksiz bir maliyet katmanıdır.

## Sesli ajanlarda araç çağırma nasıl işler?

Ses üzerinden araç (function/tool) çağırma, metin tabanlı LLM ajanlarıyla aynı sözleşmeyi kullanır: modele bir şema tanımlarsınız, model konuşma sırasında uygun gördüğünde bu şemaya uyan bir JSON argüman kümesiyle çağrı üretir, siz gerçek fonksiyonu çalıştırıp sonucu modele geri beslersiniz. Fark, bunun konuşma akışını kesmeden, kullanıcı beklerken gerçekleşmesi gerektiğidir. Uzun süren bir API çağrısı varsa modele "kontrol ediyorum" gibi bir ara cevap vermesini talimatlandırmak, sessiz boşlukların kullanıcıya bağlantının koptuğunu düşündürmesini engeller.

Şema tasarımı burada da aynı disiplini gerektirir: alan adları net olmalı, zorunlu alanlar açık belirtilmeli ve modelin uydurma değerle boşluk doldurmasını önlemek için belirsiz durumlarda `null` dönmesine izin vermelisiniz. Bu ilkeleri metin tabanlı ajanlar için [LLM'den yapılandırılmış JSON çıktı alma](/tr/posts/llm-yapilandirilmis-cikti-json) yazımızda daha ayrıntılı işledik; sesli ajanlarda aynı kurallar geçerli, sadece hata toleransı daha düşük çünkü kullanıcı geri bildirimi anlık.

Üretime çıkmadan önce, ajanın hangi araçları hangi koşullarda çağırabileceğine dair sınırları netleştirin. Bu konudaki daha geniş kontrol listesini [üretim için LLM guardrail kontrol listesi](/tr/posts/uretim-icin-llm-guardrail-kontrol-listesi) yazımızda bulabilirsiniz; sesli akışlarda ekstra olarak, model bir ödeme veya iptal aracını çağırmadan önce sözlü onay istemesini zorunlu kılmanızı öneririz.

## Kesinti (barge-in) yönetimini doğru kurmak

Barge-in, kullanıcının model konuşurken araya girip konuyu değiştirebilmesidir ve gerçekçi bir sesli ajan için müzakereye açık değildir. `turn_detection` yapılandırmasında sunucu tarafı ses aktivitesi tespiti (VAD) kullanmak, istemci tarafı tespitten daha güvenilirdir çünkü ağ gecikmesinden bağımsız çalışır. Ama VAD hassasiyetini çok agresif ayarlarsanız arka plan gürültüsü ya da kullanıcının "hı hı" gibi onay sesleri modelin cevabını gereksiz yere kesebilir; çok gevşek ayarlarsanız gerçek kesintiler gecikmeli algılanır ve kullanıcı üst üste konuşmaya başlar.

Doğru eşiği bulmanın pratik yolu, gerçek kullanıcı kayıtları üzerinde eşik değerlerini kademeli test etmektir; varsayılan ayarla üretime çıkıp geri bildirime göre ayarlamak, baştan mükemmel değeri tahmin etmeye çalışmaktan daha hızlı sonuç verir. Ajanınız çok adımlı bir görev akışı yürütüyorsa (örneğin sırayla birkaç bilgi toplayan bir form doldurma senaryosu), kesinti anında hangi adımda kalındığını takip eden bir durum makinesi kurmanız gerekir; bu konudaki genel kalıpları [AI agent mı workflow mu](/tr/posts/ai-agent-mi-workflow-mu) yazımızda tartıştık.

## Sık Yapılan Hatalar

En sık gördüğümüz üç hata: reasoning effort'u tüm konuşma tipleri için tek bir sabit değere kilitlemek, barge-in'i test ortamında hiç denemeden üretime almak ve mini modelin reasoning yeteneğini flagship'in tekelinde sanıp gereksiz yere flagship'e geçmek. Temmuz 2026 itibarıyla mini modelin reasoning desteği bu son varsayımı geçersiz kılıyor; maliyet-performans hesabınızı yeniden yapmanın tam zamanı.

Açık görüşüm şu: çoğu B2B sesli ajan projesi için sesli arayüz gerçek bir ihtiyaçtan değil "havalı görünsün" kaygısından doğuyor — kullanıcının çoğu senaryoda bir form veya chat arayüzüyle çok daha hızlı ve hatasız sonuca ulaşacağı işleri sese taşımak, mühendislik karmaşıklığını gecikme ve barge-in ayarları yüzünden gereksiz yere şişiriyor; ses, gerçekten eller-serbest ya da telefon hattı zorunluluğu olan az sayıda kullanım durumunda mantıklı, geri kalanında bir moda.

## Sıkça Sorulan Sorular

### gpt-realtime-2.1 ile mevcut bir gpt-realtime-2 entegrasyonunu değiştirmek zor mu?

Hayır, API sözleşmesi büyük ölçüde aynı kalıyor; model adını değiştirip yeni reasoning effort alanını yapılandırmanız yeterli. Asıl iş, yeni effort parametresini görev tipine göre ayarlamak ve mini modelin artık araç çağırabildiği akışları flagship'ten mini'ye taşıyıp maliyet tasarrufunu ölçmektir. Geçiş sürecine dair geliştirici tartışmalarını [OpenAI'nin topluluk forumunda](https://community.openai.com/t/new-realtime-models-on-the-api-gpt-realtime-2-1-and-gpt-realtime-2-1-mini/1385896) takip edebilirsiniz.

### SIP desteğiyle mevcut bir çağrı merkezi santraline bağlanabilir miyim?

Evet, gpt-realtime-2.1 SIP trunk üzerinden mevcut PBX veya çağrı merkezi altyapınıza bağlanacak şekilde tasarlandı. Sinyalleşme (arama başlatma, DTMF, transfer) SIP katmanında kalır, ses akışı ve model muhakemesi Realtime API üzerinden yürür.

### Yüksek reasoning effort her zaman daha iyi sonuç mu verir?

Hayır. Yüksek effort, karmaşık ve çok adımlı görevlerde doğruluğu artırır ama basit sorularda hem gecikmeyi hem de token maliyetini gereksiz yere yükseltir. Görev karmaşıklığına göre effort seviyesini dinamik ayarlamak, sabit bir seviyede kalmaktan neredeyse her zaman daha iyi sonuç verir.

### gpt-realtime-2.1 ile GPT-Live-1 aynı şey mi?

Hayır. gpt-realtime-2.1, geliştiricilerin Realtime API üzerinden bugün kullanabileceği bir modeldir. GPT-Live-1, OpenAI'nin tüketici ChatGPT uygulaması için 8 Temmuz 2026'da duyurduğu ayrı bir full-duplex ses motorudur ve şu an için API erişimi açıklanmamıştır.
