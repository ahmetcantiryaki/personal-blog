---
title: "Claude 24 Saatte İki Kez Çöktü: Ne Oldu?"
slug: "claude-24-saatte-iki-kez-coktu"
translationKey: "claude-network-outage-july-2026"
locale: "tr"
excerpt: "29-30 Temmuz 2026'da Claude, 24 saat içinde iki ayrı ağ arızası yaşadı ve dünya genelinde kesintiye uğradı; 529 hatalarının nedeni ve çıkarımlar."
category: "ai"
tags: ["claude", "reliability", "llm", "ai-infrastructure"]
publishedAt: "2026-08-02"
seoTitle: "Claude Kesintisi: 24 Saatte İki Arıza, Ne Oldu?"
seoDescription: "29-30 Temmuz 2026'da Claude, 24 saat içinde iki ayrı ağ arızası yaşadı ve dünya genelinde kesintiye uğradı; 529 hatalarının nedeni ve çıkarımlar."
---

29 Temmuz 2026 akşamı, claude.ai, Claude API'si, Claude Code ve Claude Cowork aynı anda "Request Failed With 529 Overloaded" hatası vermeye başladı. Anthropic 24 saat içinde art arda iki ayrı ağ arızası yaşadı; kapasitenin bir kısmı devre dışı kaldı, trafik yeniden yönlendirildi ve binlerce istek başarısız oldu. Hizmetler 30 Temmuz'un geç saatlerinde tamamen normale döndü, ama olay Claude üzerine üretim sistemi kuran her ekip için ciddi bir uyarı niteliğinde.

## Zaman Çizelgesi: 24 Saatte İki Arıza

[Anthropic'in durum sayfasındaki güncellemelere](https://status.anthropic.com) göre olay tek bir uzun kesinti değil, birbirinden bağımsız iki ağ arızasıydı — bu yüzden bazı kullanıcılar sorunu sürekli değil, aralıklı bir kesinti olarak yaşadı. [BleepingComputer'ın haberine](https://www.bleepingcomputer.com/news/artificial-intelligence/anthropic-confirms-claude-is-down-worldwide/) göre de Anthropic, kesintinin dünya genelinde hissedildiğini resmi olarak doğruladı.

| Saat (UTC) | Olay |
| --- | --- |
| 29 Temmuz, 19:49 | İlk arıza başladı; Anthropic soruşturmaya başladığını duyurdu |
| 29 Temmuz, 20:33 | Sorunun kaynağı tespit edildi, çözüm üzerinde çalışıldığı bildirildi (kesin neden veya süre paylaşılmadı) |
| 29-30 Temmuz gecesi | İkinci, ayrı bir ağ arızası kapasiteyi tekrar düşürdü |
| 30 Temmuz, gece geç saatler | Tüm servisler tam kapasiteyle normale döndü |

## Ne Bozuldu, Neden Bozuldu

Kök neden, Anthropic'in altyapısındaki ağ seviyesi arızalarıydı: kapasiteyi kesen ve trafiği yeniden yönlendiren iki ayrı olay, isteklerin başarısız olmasına yol açtı. Etkilenen yüzeyler arasında claude.ai üzerindeki sohbet arayüzü, geliştiricilerin doğrudan çağırdığı Claude API, terminal tabanlı Claude Code ve arka plan ajanlarını çalıştıran Claude Cowork vardı. Kullanıcılar başarısız promptlar, yavaşlayan yanıtlar, yarıda kesilen konuşmalar ve tekrarlayan 529 hataları bildirdi.

Dikkat çeken bir ayrıntı: Claude for Government boyunca kesintisiz çalışmaya devam etti. Bunun nedeni, bu ürünün tüketici ve geliştirici trafiğinin çalıştığı altyapıdan tamamen izole, ayrı bir sistemde barındırılması. Bu, Anthropic'in kritik iş yükleri için altyapı izolasyonunu ciddiye aldığının bir göstergesi, ama aynı zamanda tüketici/geliştirici katmanının neden bu kadar geniş etkilendiğini de açıklıyor: paylaşılan kapasite havuzu.

## Bu Neden Sadece Bir "Şirket Haberi" Değil

Claude Code, Claude Cowork ve doğrudan API entegrasyonlarıyla üretim iş akışları kuran ekipler için bu tarz bir kesinti soyut bir duyuru değil, doğrudan iş kesintisi demek. CI/CD pipeline'ında kod incelemesi yapan bir ajan, müşteri destek botunun arka ucunda çalışan bir API çağrısı ya da otomatik içerik üretim hattı — hepsi aynı anda "Overloaded" duvarına çarpabilir. Benim görüşüm şu ki tek bir sağlayıcıya %100 bağımlı mimariler artık 2026'da savunulabilir bir mühendislik kararı değil; büyük LLM sağlayıcılarının hiçbiri "asla düşmez" garantisi vermiyor ve geçmiş yıllarda hem OpenAI hem Anthropic tarafında benzer olaylar yaşandı.

Bu olay, [ChatGPT'nin yakın zamanda yaşadığı art arda kesinti serisiyle](/tr/posts/chatgpt-kesintileri-4-gunde-4-ariza) birlikte okunduğunda daha net bir örüntü ortaya çıkıyor: frontier model sağlayıcıları, artan talep ve karmaşıklaşan altyapı nedeniyle güvenilirlik konusunda zaman zaman zorlanıyor. Bu bir sağlayıcıyı kötülemek değil, gerçekçi bir mimari varsayım.

## 2026'da AI Sağlayıcı Kesintileri Neden Artıyor

Bu, Claude'un bu yıl yaşadığı tek kesinti değil; Ocak 2026'da da benzer bir dünya çapında erişim sorunu yaşanmıştı. Örüntü tesadüfi değil: frontier modellerin çıkarım (inference) maliyeti ve trafiği 2025'ten bu yana katlanarak arttı, sağlayıcılar hem yeni model sürümlerini hem de agent tabanlı ürünleri (Claude Cowork, ChatGPT Work gibi) aynı anda ölçeklendirmeye çalışıyor. Bu, kapasiteyi sınırda çalıştıran, dolayısıyla küçük bir ağ arızasının bile geniş yüzeyde hissedilmesine yol açan bir altyapı tablosu ortaya çıkarıyor.

| Sağlayıcı | Dönem | Olay |
| --- | --- | --- |
| Anthropic (Claude) | Ocak 2026 | Dünya genelinde erişim sorunu |
| OpenAI (ChatGPT) | Temmuz 2026 | 4 günde 4 ayrı arıza |
| Anthropic (Claude) | 29-30 Temmuz 2026 | 24 saatte iki ağ arızası, 529 hataları |

Tablodan çıkan sonuç açık: hiçbir sağlayıcı bağışık değil. Bu yüzden mimari kararlarınızı "hangi sağlayıcı hiç düşmez" sorusuna göre değil, "sağlayıcı düştüğünde sistemim ne yapar" sorusuna göre kurmak çok daha sağlam bir yaklaşım. Bu, sağlayıcıları suçlamak için değil, gerçekçi bir kapasite planlaması yapmak için gerekli bir zihniyet değişimi.

## Geliştiriciler İçin 3 Somut Çıkarım

Aşağıdaki üç adım, bu tür kesintilerin üretim sistemlerinize verdiği zararı büyük ölçüde azaltabilir:

1. **Üstel geri çekilmeli (exponential backoff) yeniden deneme mantığı kurun.** 529 gibi geçici aşırı yük hataları genelde birkaç saniye içinde çözülür; sabit aralıklı değil, artan gecikmeli yeniden deneme, hem sağlayıcı üzerindeki baskıyı azaltır hem başarı oranını yükseltir.
2. **Kritik yollarda çoklu sağlayıcı (multi-provider) fallback'i değerlendirin.** Tek model ailesine kilitlenmek yerine, en azından en kritik uç noktalarda ikinci bir sağlayıcıya (örneğin Gemini veya GPT-5.6) geçiş yapabilecek bir routing katmanı, kesinti anında hizmeti tamamen durdurmaktan sizi kurtarabilir.
3. **Circuit breaker deseniyle kademeli bozulma (graceful degradation) tasarlayın.** Sağlayıcı düşük performans gösterdiğinde sistemin tamamen çökmesi yerine, daha ucuz/daha hızlı bir modele veya önbelleklenmiş bir yanıta düşmesini sağlayan bir devre kesici, kullanıcı deneyimini korur.
4. **Uzun süren ajan görevlerinde ara durum kaydı (checkpointing) kullanın.** Arka planda saatlerce çalışan bir Claude Code oturumu gibi görevlerde, ilerlemeyi düzenli aralıklarla diske veya bir veritabanına yazan bir ajan, kesinti sonrası kaldığı yerden devam edebilir; bu, sıfırdan başlamaktan çok daha ucuz bir kurtarma stratejisi.

Bu desenlerin pratik uygulaması için [retry, backoff ve circuit breaker rehberimize](/tr/posts/retry-backoff-circuit-breaker) göz atabilirsiniz; orada aynı mantığı genel API entegrasyonları için adım adım işliyoruz.

Basit bir üstel backoff uygulaması şöyle görünebilir:

```python
import time
import random

def call_with_backoff(fn, max_retries=5, base_delay=1.0):
    for attempt in range(max_retries):
        try:
            return fn()
        except OverloadedError:
            if attempt == max_retries - 1:
                raise
            delay = base_delay * (2 ** attempt) + random.uniform(0, 0.5)
            time.sleep(delay)
```

## Sonraki Adım: Anthropic Ne Söyledi

Anthropic, olay sonrası kök neden analizini paylaşacağını duyurdu ancak bu yazının yayınlandığı Ağustos 2026 başı itibarıyla ayrıntılı bir post-mortem henüz kamuya açık değil. Şirketin geçmiş uygulamalarına bakıldığında, benzer olaylarda genelde etkilenen altyapı bileşenini ve alınan önlemleri özetleyen bir durum sayfası güncellemesi bekleniyor. Üretimde Claude'a bağımlı ekiplerin, bu tür açıklamaları takip etmek için Anthropic'in durum sayfasını izleme listesine eklemesi mantıklı bir önlem. Frontier model sağlayıcılarını yan yana değerlendirmek isteyenler [Claude Sonnet 5, GPT-5.6 ve Gemini 3.5 kıyaslamamıza](/tr/posts/claude-sonnet-5-gpt-5-6-gemini-3-5-kiyaslamasi) bakabilir; kategorideki diğer gelişmeler için [Yapay Zeka bölümümüzü](/tr/category/yapay-zeka) takip edebilirsiniz.

## Sıkça Sorulan Sorular

### Claude'un 29-30 Temmuz 2026 kesintisine ne sebep oldu?

Anthropic'in açıklamasına göre kök neden, şirketin altyapısındaki iki ayrı ağ seviyesi arızasıydı; bu arızalar kapasiteyi kesti ve trafiği yeniden yönlendirerek isteklerin başarısız olmasına yol açtı. Anthropic ayrıntılı teknik kök nedeni bu yazının yayınlandığı tarihte henüz kamuya açıklamadı.

### Hangi Claude ürünleri etkilendi?

claude.ai sohbet arayüzü, Claude API, Claude Code ve Claude Cowork etkilendi. Claude for Government, izole altyapısı sayesinde kesinti boyunca sorunsuz çalışmaya devam etti.

### Kesinti ne kadar sürdü?

İlk arıza 29 Temmuz akşamı (19:49 UTC civarı) başladı; ikinci, ayrı bir arıza aynı 24 saatlik pencere içinde yaşandı. Tüm servisler 30 Temmuz'un geç saatlerinde tam kapasiteyle normale döndü.

### Üretim sistemimi bu tür kesintilere karşı nasıl koruyabilirim?

Üstel geri çekilmeli yeniden deneme mantığı, kritik yollar için çoklu sağlayıcı fallback'i ve circuit breaker deseniyle kademeli bozulma, en etkili üç savunma katmanı. Detaylı uygulama için retry/backoff/circuit breaker rehberimize bakabilirsiniz.

