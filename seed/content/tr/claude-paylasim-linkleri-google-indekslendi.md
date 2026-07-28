---
title: "Claude Sohbetleri Google'da Nasıl İndekslendi?"
slug: "claude-paylasim-linkleri-google-indekslendi"
translationKey: "claude-share-links-google-indexed"
locale: "tr"
excerpt: "Anthropic'in paylaşım linkleri, eksik bir noindex etiketi yüzünden Google'da indekslendi; API anahtarları ve finansal veriler ifşa oldu. İşte kök neden."
category: "ai"
tags: ["claude", "web-security", "ai-tools", "llm"]
publishedAt: "2026-07-28"
seoTitle: "Claude Paylaşım Linkleri Google'da İndekslendi: Ne Oldu?"
seoDescription: "Anthropic'in paylaşım linkleri, eksik bir noindex etiketi yüzünden Google'da indekslendi; API anahtarları ve finansal veriler ifşa oldu. İşte kök neden."
---

Bir Claude sohbetini veya Artifact'ı "paylaş" butonuyla linke çevirdiyseniz, o link muhtemelen sizin sandığınızdan çok daha görünürdü: 25 Temmuz 2026'da bir Reddit kullanıcısı, `site:claude.ai/share` aramasıyla yüzlerce özel Claude sohbetinin Google'da indekslendiğini keşfetti. Kök neden tek bir eksik satır kodmuş — ve bu, "gizli link" güvenlik modelinin neden yanıltıcı olduğunu gösteren güzel bir vaka.

## Ne Oldu?

25 Temmuz Cumartesi akşamı, "-void1" adlı bir Reddit kullanıcısı basit bir Google aramasıyla `claude.ai/share` altındaki sayfaların arama sonuçlarında listelendiğini fark etti. Bu sayfalar, kullanıcıların "paylaş" özelliğiyle oluşturduğu genel erişime açık Claude sohbetleri ve Artifact'lardı — ve içlerinde ciddi miktarda hassas veri vardı: kripto cüzdan seed ifadeleri ve özel anahtarlar, avukatların dava stratejisi notları, koda yapıştırılmış düz metin veritabanı kimlik bilgileri, kişisel sağlık sorunları ve şirket içi finansal modeller/ürün yol haritaları.

Haber hızla yayıldı: [TechCrunch](https://techcrunch.com/2026/07/27/psa-your-claude-shared-chats-and-artifacts-may-have-ended-up-on-google/), [Fortune](https://fortune.com/2026/07/27/a-trove-of-users-seemingly-private-conversations-with-anthropics-claude-ai-chatbot-showed-up-in-google-search-results/) ve daha onlarca yayın konuyu işledi. Bir GitHub deposu (`Shared-Claude-Chats`), takedown'dan önce 453 Claude sohbeti ve 519 Grok sohbeti olmak üzere toplam 11.241 düz metin mesajı arşivledi.

## Kök Neden: robots.txt ≠ noindex

Buradaki teknik ayrım, her geliştiricinin bilmesi gereken bir konu. Anthropic'in `robots.txt` dosyası zaten `claude.ai/share` altındaki yolları tarayıcılara kapatıyordu (`Disallow`). Ama `Disallow`, bir arama motorunun o URL'yi **taramasını** engeller — o URL'nin **indekslenmesini** değil. Eğer bir link başka bir yerde (bir forum, bir tweet, bir Slack workspace'i) zaten görünüyorsa, Google o URL'yi hiç ziyaret etmeden bile başlığından ve bağlam bilgisinden indeksleyebilir. Bunu engelleyen şey `Disallow` değil, sayfanın kendisine konan bir `noindex` direktifidir:

```html
<meta name="robots" content="noindex, nofollow">
```

Paylaşım sayfalarında bu etiket eksikti. Sonuç: teknik olarak "taranması engellenmiş" ama fiilen indekslenmiş, halka açık bir URL alanı.

| Mekanizma | Neyi engeller | `claude.ai/share`'de var mıydı? |
|---|---|---|
| `robots.txt` `Disallow` | Arama motorunun sayfayı **taramasını** | Evet |
| `<meta name="robots" content="noindex">` | Sayfanın arama sonuçlarında **listelenmesini** | Hayır — asıl eksik olan buydu |
| `X-Robots-Tag: noindex` (HTTP başlığı) | Aynı şey, HTML olmayan içerikler için | Hayır |

Bu üçü birbirinin yerine geçmez; bir yayının gerçekten "aranamaz" olması için ikincisi ya da üçüncüsü şart. Bu ayrım yalnızca büyük AI sağlayıcıları için değil, kendi ürününde bir "paylaş" veya "genel bağlantı" özelliği barındıran her geliştirici için geçerli: bir sayfayı taramaya kapatmak, o sayfayı arama sonuçlarından gizlemekle aynı şey değil ve bu iki kontrolü karıştırmak sanıldığından çok daha yaygın bir hata.

## Düzeltildi mi?

Kısmen. Anthropic, sayfalara `noindex` etiketini ekledikten sonra Google 26 Temmuz itibarıyla sonuçları kaldırmaya başladı; [Search Engine Journal'ın analizine göre](https://www.searchenginejournal.com/indexed-claude-chats-show-why-disallow-is-not-noindex/583852/) kök neden tam olarak yukarıdaki `Disallow`/`noindex` karışıklığıydı. Ancak [Cybernews'in bildirdiğine göre](https://cybernews.com/ai-news/claude-chats-artifacts-indexed-google/) bu yazının yazıldığı tarihte Bing'in hâlâ bazı paylaşılan Claude linklerini sonuçlarında gösterdiği bildiriliyor — bu da "bir arama motorundan kaldırmak" ile "webden kaldırmak"ın aynı şey olmadığını hatırlatıyor. Anthropic, şirketin "arama motorlarıyla sohbet dizinleri veya site haritası paylaşmadığını" ve linklerin "kullanıcılar kendileri paylaşmadıkça tahmin edilebilir ya da keşfedilebilir olmadığını" açıkladı — ki bu doğru, ama sorunun asıl kaynağı zaten kullanıcıların kendi paylaştığı linklerin başka yerlerde görünür hale gelmesiydi.

## Bu Sizi Nasıl Etkiler?

Eğer daha önce bir Claude sohbetini veya Artifact'ı paylaştıysanız ve o link herhangi bir yerde (bir GitHub issue, bir forum, bir sosyal medya gönderisi) göründüyse, teorik olarak indekslenmiş olabilir. Pratik öneriler:

- **Daha önce paylaştığınız linkleri gözden geçirin.** `claude.ai` hesap ayarlarınızdan hangi sohbetlerin hâlâ genel erişime açık olduğunu kontrol edin ve ihtiyacınız kalmayanları kapatın.
- **Paylaşmadan önce temizleyin.** API anahtarı, şifre, müşteri verisi veya kimliklendirici bilgi içeren bir sohbeti paylaşmadan önce o kısımları silin — link "gizli" olsa bile.
- **"Gizli link" bir erişim kontrolü değildir.** Kimlik doğrulaması olmayan hiçbir paylaşım linki güvenlik sınırı sayılmamalı; bu, [Claude Code'un gizli takip kodu](/tr/posts/claude-code-gizli-takip-kodu) tartışmasında da gördüğümüz gibi, AI araçlarının varsayılan davranışlarını sorgulamadan güvenmemek gerektiğinin bir başka örneği.
- **Takım/kurumsal kullanımda politika belirleyin.** Bir şirket içinde Claude kullanan ekipler varsa, hangi tür içeriğin paylaşılabileceğine dair basit bir yazılı kural (örneğin "müşteri verisi veya kimlik bilgisi içeren hiçbir sohbet paylaşılmaz") tek bir kişinin hatasının kurumsal bir sızıntıya dönüşmesini engelliyor.

## Sadece Claude'a mı Özgü?

Hayır — ve burası önemli. ChatGPT'nin kendi paylaşılan sohbet linkleri de 2025 başında benzer bir şekilde Google'da indekslenmişti (o zaman OpenAI hızla `noindex` ekleyip düzeltmişti); bu olayda arşivlenen veriler arasında Grok sohbetlerinin de bulunması, sorunun tek bir şirkete özgü olmadığını gösteriyor. Genel prensip şu: herhangi bir AI sağlayıcısının "paylaş" özelliği, aksi açıkça belirtilmedikçe arama motorlarından tamamen izole kabul edilmemeli.

## Arşivleme Deposunun Kendisi de Bir Tartışma Konusu

Olayın az konuşulan bir yanı da şu: `Shared-Claude-Chats` deposunu kuran kişi, aslında halka açık ama indekslenmemiş verileri toplayıp kalıcı, aranabilir bir arşive dönüştürdü — yani sorunu çözmek yerine, Google'ın indekslemeyi durdurduğu anda bile bu verileri erişilebilir tuttu. Bu, güvenlik araştırmacıları arasında sık tartışılan bir gerilim: "herkese açık ama pratikte bulunması zor" veri ile "herkese açık ve arşivlenmiş" veri arasındaki fark, etik açıdan hâlâ net bir çizgiye oturmuyor. Responsible disclosure pratiği, bu tür bulguların doğrudan arşivlenip yayılması yerine önce sağlayıcıya bildirilmesini öngörür; bu olayda o adımın atlanmış olması, teknik hatanın kendisi kadar tartışılan bir konu oldu.

## Geliştiriciler İçin Daha Geniş Ders

Bu olay, [agentjacking gibi AI ajan saldırıları](/tr/posts/agentjacking-yeni-ai-ajan-saldirisi) veya [açık kaynakta AI çöpünün yarattığı güvenlik yükü](/tr/posts/ai-copu-acik-kaynak-guvenligi) kadar egzotik değil — aslında can sıkıcı derecede sıradan bir web güvenliği hatası. Ama tam da bu yüzden öğretici: LLM sağlayıcılarının hızla eklediği özellikler (paylaşım, genel Artifact'lar, canlı demo linkleri), klasik web güvenliği kontrol listesinden (robots direktifleri, kimlik doğrulama, erişim denetimi) geçmeden üretime çıkabiliyor. Üretimde LLM tabanlı özellikler inşa ediyorsanız, [guardrail kontrol listemizdeki](/tr/posts/uretim-icin-llm-guardrail-kontrol-listesi) maddeler artık sadece model çıktısını değil, çevresindeki tüm paylaşım/erişim yüzeyini de kapsamalı.

Kişisel kanaatim şu: bu olayın asıl skandalı "Google kötü niyetli davrandı" değil — sorun, hiçbir tarafın "paylaşılan bir link" ile "herkese açık bir web sayfası" arasındaki farkı kullanıcıya net bir şekilde anlatmamış olması. Bir link paylaştığınızda, o an itibarıyla o içeriği herkese açık bir web sayfası olarak düşünmek, "aramada görünmeyecek" varsayımından çok daha güvenli bir zihniyet.

## Sıkça Sorulan Sorular

### Claude paylaşım linki oluşturduğumda ne değişti?

Şu an için Anthropic paylaşım sayfalarına `noindex` etiketi ekledi, bu yeni oluşturulan linklerin Google tarafından indekslenmemesi gerektiği anlamına geliyor. Yine de linkin kendisi hâlâ kimlik doğrulaması gerektirmeyen genel bir URL; onu paylaştığınız her yerde erişilebilir kalıyor.

### Daha önce paylaştığım bir Claude linki hâlâ risk altında mı?

Eğer link herhangi bir yerde görünür hale geldiyse teorik olarak arşivlenmiş veya başka bir arama motoru tarafından indekslenmiş olabilir. En güvenli adım, ihtiyacınız kalmayan paylaşımları hesap ayarlarınızdan kapatmak ve hassas içerik barındıran sohbetleri yeniden paylaşmadan önce temizlemek.

### Sorun tamamen çözüldü mü?

Google tarafı büyük ölçüde temizlendi (26 Temmuz itibarıyla), ancak bildirimlere göre Bing gibi diğer arama motorlarında bazı linkler hâlâ görünebiliyor. Bir arama motorundan kaldırılmak, içeriğin webden tamamen silindiği anlamına gelmez.

### ChatGPT veya Gemini'nin paylaşım özellikleri de aynı riski taşıyor mu?

Prensipte evet — kimlik doğrulaması gerektirmeyen herhangi bir "paylaş" linki, sağlayıcı açıkça `noindex` ve erişim kontrolü uygulamadığı sürece aynı riski taşır. ChatGPT'nin paylaşılan sohbetleri 2025'te benzer bir olay yaşamıştı. Genel kural: hiçbir AI sohbet paylaşım linkini varsayılan olarak "özel" saymayın.
