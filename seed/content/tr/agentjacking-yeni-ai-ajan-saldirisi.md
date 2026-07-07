---
title: "Agentjacking: Yeni AI Ajan Saldırısı"
slug: "agentjacking-yeni-ai-ajan-saldirisi"
translationKey: "agentjacking-ai-agent-security"
locale: "tr"
excerpt: "Agentjacking, AI kod ajanlarını MCP üzerinden çekilen zehirli telemetriyle ele geçiriyor. Gerçek tehdit modeli ve kalıcı bir savunma kontrol listesi."
category: "software-engineering"
tags: ["web-security", "ai-agents", "mcp", "ai-coding", "ai-reliability"]
publishedAt: "2026-07-07"
seoTitle: "Agentjacking: Yeni AI Ajan Saldırısı"
seoDescription: "Agentjacking, AI kod ajanlarını MCP üzerinden gelen zehirli Sentry telemetrisiyle kod çalıştırmaya kandırıyor. Tehdit modeli ve savunma kontrol listesi."
---

Başlık kendini yazıyor: "Sahte hata raporu 250 milyar dolarlık şirketin AI ajanını ele geçirdi." Teknik olarak doğru, stratejik olarak faydasız. Bir Sentry sorunu ya da bir Claude Code sorunu olarak çerçevelenince agentjacking, bir yamayla çözülecekmiş gibi görünüyor. Öyle değil. Korkutucu olan istismar zinciri değil — altındaki varsayım. Ve o varsayım bugün kurulan neredeyse her ajan yapılandırmasında yaşıyor: kod ajanınız telemetrinize, sanki onu siz yazmışsınız gibi güveniyor.

Agentjacking, 2026-06-13'te [Tenet Security](https://tenetsecurity.ai/blog/agentjacking-coding-agents-with-fake-sentry-errors/) tarafından açıklandı ve tek seferlik bir hata değil, gerçekten yeni bir saldırı sınıfının adı. Mekanizması sadeliğiyle neredeyse hakaret gibi — ve dersin kalıcı olmasının sebebi de tam olarak bu. Panik yerine nüansı tartışalım.

## Agentjacking gerçekte nedir?

Sentry DSN'i — bir arayüzün hata bildirmesini sağlayan istemci anahtarı — tasarımı gereği herkese açıktır. Üretimdeki sitelerde düz JavaScript içinde durur. Sayfa kaynağınızı okuyan herkes Sentry projenize hata olayları gönderebilir. Bu bir sızıntı değil; SDK'nın çalışma biçimi.

Şimdi bir AI kod ajanını bir [MCP sunucusu](/tr/posts/model-context-protocol-nedir) üzerinden Sentry'ye bağlayın. Ajana "şu yeni hataya bak ve düzelt" dersiniz. Ajan Sentry MCP aracını çağırır, hata raporunu çeker ve onu tıpkı bir derleyici mesajı gibi güvenilir tanı bağlamı olarak okur. Dönüm noktası şu: herkese açık DSN'inizi bulan saldırgan, gövdesinde Sentry'nin kendi "çözüm adımları" gibi giydirilmiş, gizli markdown prompt enjeksiyonu barındıran sahte bir hatayı çoktan yerleştirmiştir. Ajan, gerçek bir çökmeyle sahte olanı ayırt edemez. "Düzeltme"yi izler; o düzeltme sessizce ona kod çalıştırmasını söyler — ortam değişkenlerini, AWS anahtarlarını, GitHub ve GitLab OAuth token'larını, npm ve Docker kimlik bilgilerini, Kubernetes ve CI/CD sırlarını saldırganın sunucusuna sızdırarak.

Her adım yetkilidir. [The New Stack](https://thenewstack.io/agentjacking-sentry-mcp-attack/) tam da bunu söyledi: tek gereken herkese açık bir anahtar. EDR, WAF, IAM ve güvenlik duvarları uyarılacak bir şey görmez, çünkü yetkisiz hiçbir şey olmadı. Ajan kendisine söyleneni yaptı. Sadece söyleyenin kim olduğunu ayırt edemedi.

## Bu neden işe yarıyor: kimsenin çizmediği güven sınırı

Geleneksel güvenlik, *kod* (güvenilir, çalıştırılabilir) ile *veri* (güvenilmez, edilgen) arasında temiz bir çizgi varsayar. Prompt enjeksiyonu bu çizgiyi siler, çünkü bir dil modeli için her şey metindir ve metin talimattır. Ajanın araç çıktısı — telemetri, API yanıtları, dosya içerikleri, issue takipçileri — gerçek prompt'unuzla aynı bağlam penceresine, hiçbir ayrıcalık ayrımı olmadan akar.

Bu, [paket halüsinasyonları ve slopsquatting'in](/tr/posts/ai-kod-asistani-hatalari) ardındaki arıza biçiminin aynısı: model, makul görünen bir dizeyi mutlak gerçek sanır. Agentjacking, bunu bir ajanın gördüğü en yüksek güvenli dizeye — düzeltmesi istenen hata raporuna — yöneltiyor, o kadar. OWASP'ın 2026'daki agentic AI çalışması aynı sonuca ters yönden vardı: prompt enjeksiyonu hâlâ agentic yapay zeka arızalarının çoğunu yönlendiriyor ([Help Net Security'nin Haziran 2026 haberi](https://www.helpnetsecurity.com/2026/06/11/owasp-agentic-ai-security/)). Agentjacking'deki yenilik enjeksiyon değil — *teslimat kanalı*. Kendi gözlemlenebilirlik hattınız yükün taşıyıcısına dönüşüyor.

## Rakamlar — ve onlara ne kadar güvenmeli

Tenet gerçek bir ölçek bildiriyor. Bunları bağımsız doğrulanmış değil, satıcı beyanı olarak okuyun.

| Metrik | Bildirilen değer | Uyarı |
|---|---|---|
| Etkilenen kuruluş | 2.388 | Satıcı taraması; "etkilenmek" ≠ ele geçirilmek |
| İstismar başarı oranı | popüler ajanlarda ~%85 | Kontrollü test, vahşi doğa değil |
| Harekete geçen ajan | testte 100+ | Tenet'in kendi ölçümü |
| Etkilenen ajanlar | Claude Code, Cursor, Codex | İlkesel olarak her MCP-telemetri ajanı |
| PoC'de elde edilen sırlar | AWS, GitHub/GitLab, npm, Docker, K8s, CI/CD | Kavram kanıtı, doğrulanmış hırsızlık değil |

%85'lik başarı oranı ürkütücü, ama aynı zamanda elverişli koşullardaki bir laboratuvar sonucu. Dürüst okumam: kesin yüzdeden çok, bulgunun şekli önemli. Gerçek dünya oranı bunun beşte biri bile olsa, yalnızca herkese açık bir anahtar gerektiren ve telemetrinizi kod çalıştırma kanalına çeviren bir saldırı yapısal olarak tehlikelidir. Rakamı iskonto edin; tehdit modelini saklayın.

## Kalıcı ders: ajanın yuttuğu veriyi güvenilmez girdi say

Sentry ve adı geçen ajanlar önlemler yayınlayacak — Tenet, Cursor ve Claude Code için hazır sertleştirme yapılandırmaları olan `agent-jackstop`'ı çoktan açık kaynak yaptı. Ama tek bir telemetri kaynağını yamamak köstebek vurmaca. Temmuz 2026 itibarıyla aynı saldırı sınıfı, bir ajanın güven sınırı olmadan okuduğu her kanal için geçerlidir: log toplayıcılar, issue takipçileri, CI çıktısı, webhook gövdeleri, kazınmış web sayfaları, hatta diğer ajanların mesajları.

Haber döngüsünden uzun yaşayacak ilke şu: **ajanınızın bir araç üzerinden çektiği her şey, tıpkı ham bir HTTP istek gövdesi gibi, güvenilmez dış girdidir.** Bunları zaten doğruluyorsunuz. Yirmi yıldır yapıyorsunuz. Ajan araçları, yirmi yıl boyunca terk etmeye çalıştığımız hatayı sessizce geri getirdi — girdiye, nereden geldiği için güvenmek.

## Bir sonraki istismardan sağ çıkan savunma kontrol listesi

"Daha az güven" değil. Yapısal kontroller. Modelden önce temizle, çalıştırmadan önce kapıya koy, kaynağı doğrula.

- **Markdown'ı temizle ve normalleştir**: araç çıktısı modele ulaşmadan önce. Enjeksiyon bağlantı sözdiziminde, HTML yorumlarında ve görünmez karakterlerde saklanır — telemetriyi düz metne indirgeyin.
- **Kod çalıştırmadan önce insan onayı iste**: Hiçbir ajan, çektiği telemetriden türetilen bir kabuk komutunu çalıştırmamalı. Tek başına bu kontrol tüm zinciri kırar.
- **Araç çağrılarını sandbox'la**: Ajanları ortam kimlik bilgileri olmadan çalıştırın. AWS anahtarları ve OAuth token'ları ortamda yoksa, sızdırılacak bir şey de yoktur.
- **MCP sunucularını sabitle ve denetle**: Her sunucuyu bir güven sınırı olarak görün — kaynakları sabitleyin, döndürdüklerini inceleyin, denetlemediğiniz bir telemetri sunucusunu bağlamayın.
- **Sırları varsayılan olarak hiçe daralt**: Agentjacking'in etki yarıçapı tam olarak ortam kimlik bilgisi setinizdir. Onu küçültün.

Asgari bir koruma — telemetriden türetilen metnin gözden geçirilmeden çalıştırılabilir komuta dönüşmesine asla izin verme:

```python
# Yanlış: ajan çıktısı doğrudan kabuğa boru hattı
subprocess.run(ajan_onerdigi_komut, shell=True)  # oyun bitti

# Doğru: biçimlendirmeyi temizle, sonra açık insan onayına bağla
temiz = markdown_temizle(arac_ciktisi)       # gizli enjeksiyonu öldür
plan = ajan.duzeltme_oner(temiz)             # eylem değil, öneri
if insan_onayliyor(plan) and plan.sir_erisimi_yok:
    sandboxta_calistir(plan.komut)           # ortam kimlik bilgisi yok
```

Ajan davranışını tekrarlanabilir kontrollere döküyorsanız, [LLM çıktılarını değerlendirme](/tr/posts/llm-ciktilari-degerlendirme) rehberimiz özel güvenlik kurallarını bir değerlendirme setine çevirmeyi anlatıyor; [LLM halüsinasyonlarını azaltma](/tr/posts/llm-halusinasyon-azaltma) el kitabı ise aynı kök disiplini paylaşıyor: akıcı bir dizenin doğrulanmış bir gerçeğin yerine geçmesine asla izin verme.

## Aykırı görüş

Refleks tepki "MCP sunucularınızı denetleyin" ve yanlış değil — ama yanlış katmanı hedefliyor. Tasarım kusuru kötü bir sunucu değil; ajan çerçevelerinin araç çıktısını ve kullanıcı niyetini hiçbir ayrıcalık modeli olmadan tek ve ayrımsız bir bağlamda birleştirmesi. Ajanlar "bana verilen talimatlar" ile "getirdiğim veri"yi ayırana dek, her yeni entegrasyon yeni bir enjeksiyon yüzeyidir. Agentjacking yaygın biçimde bildirilen ilk örnek. Sonuncusu olmayacak ve çözüm bir yapılandırma dosyası değil, mimari. Otonomiyi ajanlara devretmenin geniş ödünleşimleri için [AI agent mı workflow mu](/tr/posts/ai-agent-mi-workflow-mu) karşılaştırmamız, otonom bir ajanın riske değip değmediğini tartmak için iyi bir turnusol. Daha fazla mühendislik derinlemesi için [Yazılım Mühendisliği](/tr/category/yazilim-muhendisligi) merkezine bakın.

## Sıkça Sorulan Sorular

### Agentjacking nedir?

Agentjacking, Tenet Security tarafından Haziran 2026'da açıklanan bir saldırı sınıfıdır; bir saldırgan, AI kod ajanının bir araç üzerinden çektiği verinin — tipik olarak herkese açık bir Sentry DSN'ine gönderilen sahte hata raporlarının — içine prompt enjeksiyonu yerleştirir. Ajan zehirli telemetriyi MCP üzerinden güvenilir tanı rehberi gibi okur ve saldırganın kontrolündeki kodu çalıştırmaya kandırılır; geliştiricinin makinesinden kimlik bilgileri ve sırlar sızar.

### Agentjacking yalnızca bir Sentry sorunu mu?

Hayır; çerçevelemedeki tuzak da bu. Sentry açıklanan teslimat kanalı çünkü DSN'i tasarımı gereği herkese açık; ama asıl kusur, ajanların her araç çıktısına mutlak gerçek gibi güvenmesi. Aynı teknik log hatlarına, issue takipçilerine, CI çıktısına, webhook'lara ve kazınmış sayfalara da uygulanır. Yalnızca Sentry'yi düzeltmek saldırı sınıfını olduğu gibi bırakır.

### AI kod ajanımı agentjacking'den nasıl korurum?

Ajanın yuttuğu tüm dış veriyi güvenilmez sayın. Modele ulaşmadan önce markdown'ı temizleyip normalleştirin, herhangi bir kod çalıştırmadan önce insan onayı isteyin, ajanları ortam kimlik bilgileri olmayan bir sandbox'ta çalıştırın, MCP sunucularınızı sabitleyip denetleyin. Tenet ayrıca başlangıç noktası olarak Cursor ve Claude Code için `agent-jackstop` sertleştirme yapılandırmalarını açık kaynak yaptı.

### Bildirilen 2.388 kuruluş ve %85 başarı oranı güvenilir mi?

Bunları bağımsız doğrulanmış değil, satıcı beyanı olarak okuyun. Her iki rakamı da Tenet Security kendi taraması ve kontrollü testiyle üretti; dolayısıyla kesin sayılar vahşi doğada tutmayabilir. Değeri yönseldir: saldırı yalnızca herkese açık bir anahtar gerektiriyor ve telemetriyi kod çalıştırmaya çeviriyor — bildirilen oranın bir kesrinde bile yapısal olarak tehlikeli.
