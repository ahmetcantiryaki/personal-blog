---
title: "Claude Opus 4.1 Emekli Oldu: Opus 4.8'e Geçiş Rehberi"
slug: "claude-opus-4-1-emekli-oldu-gecis-rehberi"
translationKey: "claude-opus-4-1-retirement-migration"
locale: "tr"
excerpt: "Claude Opus 4.1, 5 Ağustos 2026'da API'den kaldırıldı. Model ID'nizi hâlâ sabitlediyseniz isteğiniz hata döndürüyor — işte Opus 4.8'e geçiş rehberi."
category: "ai"
tags: ["claude", "llm", "ai-infrastructure", "best-practices"]
publishedAt: "2026-08-05"
seoTitle: "Claude Opus 4.1 Emekli Oldu: Opus 4.8 Geçiş Rehberi"
seoDescription: "Claude Opus 4.1, 5 Ağustos 2026'da API'den kaldırıldı. Model ID'nizi hâlâ sabitlediyseniz isteğiniz hata döndürüyor — işte Opus 4.8'e geçiş rehberi."
---

Claude Opus 4.1 (`claude-opus-4-1-20250805`), bugün — 5 Ağustos 2026 itibarıyla — Anthropic'in Claude API'sinden kalıcı olarak kaldırıldı. Backend'inizde, bir ajanınızda ya da Bedrock/Vertex yapılandırmanızda bu model ID'sini hâlâ sabitlediyseniz, o isteğe artık hata dönüyor demektir. Anthropic'in [resmi model emeklilik sayfasına göre](https://platform.claude.com/docs/en/about-claude/model-deprecations), önerilen geçiş hedefi `claude-opus-4-8`.

## Emeklilik Takvimi: 60 Günlük Bildirim Kuralı

Anthropic, kamuya açık modeller için emeklilik tarihinden en az 60 gün önce bildirim yapmayı taahhüt ediyor. Opus 4.1 için bu bildirim 5 Haziran 2026'da geldi; tam 60 gün sonra, bugün, model kalıcı olarak devre dışı kaldı. Bu, tek seferlik bir olay değil — Anthropic'in düzenli olarak işlettiği bir döngü:

| Model | Bildirim Tarihi | Emeklilik Tarihi | Önerilen Değişim |
| --- | --- | --- | --- |
| `claude-opus-4-1-20250805` | 5 Haziran 2026 | **5 Ağustos 2026** | `claude-opus-4-8` |
| `claude-opus-4-20250514` | 14 Nisan 2026 | 15 Haziran 2026 | `claude-opus-4-8` |
| `claude-sonnet-4-20250514` | 14 Nisan 2026 | 15 Haziran 2026 | `claude-sonnet-4-6` |
| `claude-3-7-sonnet-20250219` | 28 Ekim 2025 | 19 Şubat 2026 | `claude-sonnet-4-6` |
| `claude-3-5-haiku-20241022` | 19 Aralık 2025 | 19 Şubat 2026 | `claude-haiku-4-5-20251001` |

Buradaki pratik ders şu: model ID'nizi kodda sabit tutmak, altı ayda bir bu tabloyu kontrol etmeyi gerektiren bir teknik borç yaratır. Üretimde sabit model ID kullanan her ekip, bu tabloyu takvimine eklemeli — aksi halde bu tür geçişler her seferinde sürpriz bir üretim kesintisi olarak ortaya çıkıyor.

## Kodunuzda Nelere Dikkat Etmeli: Sampling Parametreleri Kırıldı

Opus 4.1'den Opus 4.7 ya da sonrasına geçerken tek değişiklik model adı değil. Anthropic'in dokümantasyonuna göre `temperature`, `top_p` ve `top_k` parametreleri Claude Opus 4.7 ve sonrası modellerde **varsayılan olmayan bir değerle gönderildiğinde HTTP 400 hatası döndürüyor**. Bu, sessizce yok sayılan bir davranış değil — isteğiniz doğrudan başarısız oluyor.

```python
# Önce (Opus 4.1) — artık hata veriyor
response = client.messages.create(
    model="claude-opus-4-1-20250805",
    temperature=0.7,
    top_p=0.9,
    max_tokens=1024,
    messages=[{"role": "user", "content": prompt}],
)

# Sonra (Opus 4.8) — sampling parametrelerini kaldırın
response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    messages=[{"role": "user", "content": prompt}],
)
```

Model davranışını yönlendirmek için sampling parametreleri yerine [prompt mühendisliği tekniklerine](/tr/posts/prompt-muhendisligi-teknikleri) yaslanmanız öneriliyor — örneğin "kısa ve net cevap ver" gibi doğrudan talimatlar, `temperature=0.2` ayarlamaktan daha öngörülebilir sonuç veriyor.

## Opus 4.8 mi, Opus 5 mi?

Geçişi yaparken tek seçenek Opus 4.8 değil, ve bu kararı verirken sadece fiyata değil, ekibinizin ne kadar hızlı test edebileceğine de bakmak gerekiyor. Anthropic 24 Temmuz 2026'da [Claude Opus 5'i](/tr/posts/claude-opus-5-geldi) piyasaya sürdü: 1 milyon token bağlam penceresi, 128 bin çıktı token'ı ve varsayılan olarak açık "thinking" modu — üstelik Opus 4.8 ile aynı fiyatlandırmada ($5/$25 per MTok). Basit kural şöyle: yeni bir entegrasyon yazıyorsanız doğrudan Opus 5'ten başlayın; mevcut bir Opus 4.1 entegrasyonunuz varsa ve minimum değişiklikle üretimi ayakta tutmak istiyorsanız Opus 4.8'e geçiş daha az risk taşıyor, ardından Opus 5'i ayrı, sakin bir değerlendirme döngüsünde test edebilirsiniz.

## Kullanım Denetimini Nasıl Yaparsınız

Hangi servislerin hâlâ emekli olmuş bir model ID'sine istek attığını bilmiyorsanız, Claude Console'daki Usage sayfasından bir CSV dışa aktarımı alın; bu rapor, API anahtarı ve model bazında kullanım kırılımı veriyor. Emekli model ID'lerine giden her satırı işaretleyip önceliklendirin — özellikle arka planda çalışan, insan gözetimi olmayan ajan iş akışlarını.

Önceliklendirme sırası genelde şöyle olmalı: önce müşteri karşısındaki, gerçek zamanlı yanıt veren servisler (bir hata kullanıcının doğrudan gözüne çarpar); ardından zamanlanmış (cron ile çalışan) toplu işler; en son da düşük hacimli, iç kullanım araçları. Bu sıralama, en görünür ve en maliyetli hatayı önce ortadan kaldırmanızı sağlıyor. Birden fazla API anahtarı kullanan ekiplerde, hangi anahtarın hangi servise ait olduğunu gösteren bir eşleme tablosu tutmak, denetim sürecini saatler yerine dakikalar sürecek şekilde kısaltıyor.

## Adım Adım Geçiş Süreci

Pratikte bu geçişi dört adıma indirgeyebilirsiniz:

1. **Envanter çıkarın.** Repo'nuzda, ajan tanımlarınızda ve altyapı-kod (infra-as-code) dosyalarınızda `claude-opus-4-1` geçen her satırı bulun — basit bir `grep -r "claude-opus-4-1"` çoğu zaman yeterli.
2. **Sampling parametrelerini temizleyin.** `temperature`, `top_p` ve `top_k` geçen her istek gövdesini işaretleyin; Opus 4.7 ve sonrasına geçtiğinizde bu parametreler kaldırılmalı, aksi halde istek 400 hatasıyla geri döner.
3. **Staging'de test edin.** Model adını değiştirdikten sonra, üretime almadan önce en az bir günlük gerçek trafik örneğiyle (ya da kayıtlı isteklerin bir alt kümesiyle) yanıt kalitesini karşılaştırın — özellikle uzun, çok adımlı ajan görevlerinde davranış farkı daha belirgin olabiliyor.
4. **Kademeli açın.** Mümkünse trafiğin küçük bir yüzdesini yeni modele yönlendirip hata oranlarını izleyin, sonra tam geçişi yapın. Bu, özellikle insan gözetimi olmayan arka plan ajanları için riski büyük ölçüde azaltıyor.

Bu dört adımın toplam maliyeti genelde birkaç saat — emekli olmuş bir model ID'sine giden trafiği fark etmeden üretimde günlerce hata almaktan çok daha ucuz.

## Ağustos 2026'da Neyi Değiştirmeli

Bu geçişi bu ay yaparken gözden kaçırmayın: Claude Sonnet 5'in $2/$10 per MTok'luk tanıtım fiyatlandırması da 31 Ağustos 2026'da sona eriyor ve 1 Eylül'den itibaren standart fiyat olan $3/$15'e geçiyor — yani bu ay hem model ID'lerinizi hem de maliyet projeksiyonlarınızı aynı anda gözden geçirmek için makul, tek seferlik bir zaman penceresi sunuyor. Sabit model ID'lerle çalışan ajan mimarileri kuruyorsanız [Claude Code subagent rehberimize](/tr/posts/claude-code-subagent-arka-plan-ajanlari) ve model seçimini otomatikleştirme fikrine göz atabilirsiniz.

Kişisel görüşüm şu: Anthropic'in 60 günlük sabit bildirim penceresi cömert, ama çoğu ekip bu bildirimleri e-posta gürültüsünde kaybediyor. Emekli model tablosunu CI pipeline'ınıza bir statik kontrol olarak eklemek — kodda geçen model ID'lerini bu tabloyla karşılaştırıp uyaran basit bir script — bu tür sürprizleri tamamen ortadan kaldırıyor ve kurulumu bir öğleden sonradan az sürüyor. Bu yatırımı bir kez yapan bir ekip, bir daha hiçbir model emekliliğinde üretim kesintisi yaşamıyor; tek gereken, script'in CI'da her pull request'te çalışmasını sağlamak.

Model karşılaştırmalarını daha geniş bağlamda görmek isteyenler [Claude Sonnet 5, GPT-5.6 ve Gemini 3.5 kıyaslamamıza](/tr/posts/claude-sonnet-5-gpt-5-6-gemini-3-5-kiyaslamasi) bakabilir; MCP tarafında neyin değiştiğini merak edenler [Model Context Protocol rehberimizi](/tr/posts/model-context-protocol-nedir) inceleyebilir. Her iki yazı da bu geçiş kararını daha geniş bir mimari bağlama oturtmanıza yardımcı oluyor. Kategorideki diğer yazılar için [Yapay Zeka bölümümüzü](/tr/category/yapay-zeka) takip edebilirsiniz.

## Sıkça Sorulan Sorular

### Claude Opus 4.1'e istek atmaya devam edersem ne olur?

`claude-opus-4-1-20250805` model ID'sine gönderilen her istek artık hata döndürüyor. Anthropic'in Claude API, AWS'deki Claude Platform ve Microsoft Foundry'de bu tarih kesin; Amazon Bedrock ve Google Cloud gibi partner platformlar kendi emeklilik takvimlerini belirleyebiliyor, bu yüzden o platformlardaki durumu ayrıca kontrol edin.

### Opus 4.8'e geçince kodumda başka ne kırılabilir?

En yaygın kırılma noktası `temperature`, `top_p` ve `top_k` parametreleri — bunlar varsayılan olmayan bir değerle gönderildiğinde Opus 4.7 ve sonrasında HTTP 400 hatası veriyor. Bu parametreleri isteklerinizden kaldırıp davranışı prompt üzerinden yönlendirmeniz gerekiyor.

### Opus 4.8 yerine doğrudan Opus 5'e mi geçmeliyim?

Fiyatlandırma aynı olduğu için ($5/$25 per MTok) maliyet açısından fark etmiyor. Opus 5, 1 milyon token bağlam ve varsayılan açık thinking gibi ek yetenekler sunuyor; ama mevcut bir entegrasyonu acilen ayakta tutmanız gerekiyorsa Opus 4.8'e geçiş daha az davranış değişikliği getiriyor.

### Hangi modellerin ne zaman emekli olacağını nereden takip edebilirim?

Anthropic'in [model emeklilik sayfası](https://platform.claude.com/docs/en/about-claude/model-deprecations) güncel durumu (aktif, kullanımdan kaldırılmış, emekli) ve tüm gelecek tarihleri tek bir tabloda listeliyor. Üretimde sabit model ID kullanıyorsanız bu sayfayı düzenli aralıklarla kontrol etmek ya da takviminize bir hatırlatıcı kurmak, altı ay sonra sürpriz bir üretim kesintisiyle karşılaşmaktan çok daha ucuza geliyor.
