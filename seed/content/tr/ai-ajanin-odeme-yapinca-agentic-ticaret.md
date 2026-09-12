---
title: "AI Ajanın Ödeme Yapınca: Agentic Ticaret Nedir?"
slug: "ai-ajanin-odeme-yapinca-agentic-ticaret"
translationKey: "agentic-payments-explained-2026"
locale: "tr"
excerpt: "Kısa cevap: yapay zeka ajanları artık tokenleştirilmiş kartlarla adınıza ödeme yapabiliyor; Visa ve Mastercard işlemleri kapsam ve onayla sınırlıyor."
category: "technology"
tags: ["ai-agents", "automation", "compliance"]
publishedAt: "2026-09-12"
seoTitle: "AI Ajanın Ödeme Yapınca: Agentic Ticaret Nedir?"
seoDescription: "AI ajanlarının adınıza nasıl ödeme yaptığını, hangi protokollerin bu işi yönettiğini ve harcama limitlerini nasıl kontrol edeceğinizi anlatıyoruz."
---

Kısa cevap: bir yapay zeka ajanı sizin adınıza alışveriş yaptığında, kartınızın gerçek numarasını hiç görmüyor — bunun yerine belirli bir ajana, belirli bir satıcıya ve belirli bir harcama kuralına bağlanmış "tokenleştirilmiş" (gerçek kart bilgisinin yerine geçen, sınırlı yetkili bir dijital kimlik) bir kimlik bilgisi kullanıyor. 2026 itibarıyla bu akışı Google'ın Universal Commerce Protocol'ü (UCP), Microsoft Copilot Checkout ve Visa/Mastercard'ın ajan token sistemleri yönetiyor.

## Ne değişti: ChatGPT Instant Checkout neden kapandı?

Kısa cevap: OpenAI, 4 Mart 2026'da Instant Checkout'u sessizce kapattı — özellik 29 Eylül 2025'te "Satın Al" düğmesiyle sohbetten çıkmadan ödeme yapmayı vaat ederek başlamıştı, ama altı ay sonra OpenAI bunun yeterince esnek olmadığını söyleyerek geri çekti. Şirketin açıklaması netti: "Instant Checkout'un ilk sürümü hedeflediğimiz esnekliği sunmadı, bu yüzden satıcıların kendi ödeme deneyimlerini kullanmasına izin verirken çabamızı ürün keşfine yoğunlaştırıyoruz."

Bu boşluğu Google doldurdu. Ocak 2026'da NRF etkinliğinde Sundar Pichai, Shopify ile birlikte geliştirilen açık bir standart olan Universal Commerce Protocol'ü (UCP) tanıttı; keşif, ödeme ve satış sonrası desteği kapsıyor. Lansman ortakları arasında Shopify, Etsy, Walmart ve Target yer alıyor. Protokol savaşı büyük ölçüde UCP lehine sonuçlandı; bağımsız satıcılar için önemli olan artık tek bir ajanla doğrudan entegrasyon değil, mağazanızın yapay zeka tarafından okunabilirliği.

## Bir ajan ödemesi teknik olarak nasıl işliyor?

Kısa cevap: kartınız, belirli bir yapay zeka ajanına, belirli bir satıcı kapsamına ve belirli bir onay politikasına bağlı "Ajan Token"ları (Agentic Tokens) şeklinde tokenleştiriliyor — böylece ChatGPT veya Microsoft Copilot gibi bir model, gerçek kart numarasını hiç tutmadan bir ödemeyi tamamlayabiliyor. Mastercard, bu çerçeveyi Mastercard Dijital Etkinleştirme Servisi'nin (MDES) bir uzantısı olarak sunuyor ve 2026'da makineler arası sürekli ödemeleri hedefleyen "Agent Pay for Machines"i tanıttı.

Visa tarafında ise Visa Intelligent Commerce, kapsamlı tokenleştirilmiş kimlik bilgilerini, makine tarafından başlatılan ödemeler için tasarlanmış davranışsal/kart veren tarafı kimlik doğrulamasını ve büyük dil modeli sağlayıcılarıyla entegrasyonları bir araya getiriyor. 10 Haziran 2026'da San Francisco'daki Visa Payments Forum'da Visa ve OpenAI, güvenli Visa ödemelerini OpenAI'ın ajan tabanlı ticaret deneyimlerine getiren stratejik bir iş birliği duyurdu.

| Bileşen | Google UCP | Mastercard Agent Pay | Visa Intelligent Commerce |
|---|---|---|---|
| Kapsam | Keşif + ödeme + satış sonrası | Tokenleştirilmiş kart yetkilendirme | Tokenleştirilmiş kimlik bilgisi + kimlik doğrulama |
| Lansman ortakları | Shopify, Etsy, Walmart, Target | ChatGPT, Microsoft Copilot | OpenAI (Haziran 2026 itibarıyla) |
| Kilit özellik | Açık standart, çoklu ajan desteği | Ajana özel, satıcıya özel token | Makine tarafından başlatılan işlem kimlik doğrulaması |
| Durum (Eylül 2026) | Fiilen kazanan protokol | Aktif, "Machines" uzantısıyla genişliyor | Aktif, OpenAI ortaklığıyla büyüyor |

## Harcama limitleri ve onaylar gerçekte nasıl çalışıyor?

Kısa cevap: her Ajan Token'ı belirli bir harcama tavanına, satıcı listesine ve zaman aralığına bağlanıyor; ajan bu sınırların dışına çıkan bir işlem yapmaya çalıştığında, işlem kart veren tarafından otomatik olarak reddediliyor. Bu, bir insan çalışanın kurumsal kartına konan harcama limitine benziyor — fark, sınırı ihlal eden tarafın bir insan değil bir yazılım ajanı olması.

Pratikte bu, bir kullanıcının "aylık en fazla 200 dolar, yalnızca belirlenmiş üç satıcıda geçerli" bir token oluşturup ajanına verebileceği anlamına geliyor. Ajan bu sınırlar içinde özerk hareket edebiliyor; sınır dışına çıkan her işlem, insan onayına düşüyor ya da tamamen reddediliyor.

## Dolandırıcılık ve sorumluluk sorusu nasıl çözülüyor?

Kısa cevap: bir ajan token'ı kötüye kullanıldığında sorumluluk zinciri, tokenin hangi taraf (kart veren, platform ya da tüccar) tarafından yetkilendirildiğine bağlı olarak paylaşılıyor — ve bu paylaşım hâlâ standartlaşma sürecinde. Visa ve Mastercard'ın tokenleştirme yaklaşımı, dolandırıcılık riskini azaltmak için tasarlandı: gerçek kart numarası hiçbir yerde saklanmadığı için, bir token'ın sızması durumunda saldırgan yalnızca o token'ın kapsamıyla sınırlı kalıyor.

Ancak asıl belirsizlik, bir ajanın "yanlış" bir satın alma yapması durumunda kimin sorumlu olduğu — kullanıcı mı, ajanı geliştiren şirket mi, yoksa ödeme ağı mı. McKinsey & Company, yapay zeka ajanlarının 2030'a kadar yalnızca ABD'de 1 trilyon dolarlık işlemden sorumlu olabileceğini öngörüyor; bu ölçekte, sorumluluk çerçevesinin netleşmesi kaçınılmaz.

Bugün fiilen uygulanan yaklaşım şu: bir token, kart veren kuruluş tarafından belirli bir kapsamla yetkilendirildiği için, o kapsamın dışına çıkan bir işlem zaten gerçekleşmiyor. Yani sorumluluk tartışması büyük ölçüde "kapsam içi ama beklenmeyen" satın almalarda ortaya çıkıyor — örneğin bir ajanın, kullanıcının "en uygun fiyatlıyı seç" talimatını yanlış yorumlayıp daha pahalı bir ürünü, teknik olarak izin verilen bir satıcıdan satın alması gibi. Bu tür vakalarda kart veren kuruluşlar şu ana kadar genellikle platform tarafını (ajanı geliştiren şirketi) sorumlu tutma eğiliminde, ama bu henüz sektör standardı haline gelmedi.

Tüketici tarafında pratik bir sonuç da var: bir anlaşmazlık durumunda itiraz sürecini kimin yürüttüğü hâlâ net değil. Geleneksel bir kart işleminde itiraz süreci doğrudan kart veren kuruluşla yürütülüyor; bir ajan işleminde ise kullanıcı önce ajanı sağlayan platforma mı, yoksa doğrudan kart verene mi başvuracağını bilmiyor. Bu belirsizlik, ölçek büyüdükçe düzenleyici kurumların erken müdahale edeceği bir alan olarak öne çıkıyor.

Bu noktaya kadar gelen kart veren kuruluşların ortak tavsiyesi şu: bir ajan işlemi anlaşmazlık konusu olduğunda, önce ajanı çalıştıran platformun destek kanalına başvurun; platform, işlemi kendi token yetkilendirme kayıtlarıyla karşılaştırarak kart verene iletebiliyor. Bu süreç henüz standartlaşmadığı için, hangi platformun hangi hızda yanıt verdiği büyük ölçüde değişkenlik gösteriyor.

Kişisel değerlendirmem: agentic ticaretin asıl riski dolandırıcılık değil, aşırı geniş tanımlanmış bir onay kapsamı. Bir kullanıcı "gerekirse otomatik yenile" gibi belirsiz bir kural verirse, ajan bunu hem çok dar hem de çok geniş yorumlayabilir — ve token bazlı sistemler, niyet belirsizliğini teknik olarak çözemiyor.

## Alışveriş yaparken kontrolü elinizde tutmak için ne yapmalısınız?

Kısa cevap: her ajana en dar kapsamlı token'ı verin (belirli satıcı, belirli tutar, belirli süre), ve otomatik yenileme gibi tekrarlayan işlemler için ayrı, düşük limitli bir token oluşturun. Genel amaçlı, geniş kapsamlı bir token yerine, her kullanım durumu için ayrı token oluşturmak, bir sorun çıktığında hasarı sınırlıyor.

Yapay zeka ajanlarının gerçek dünya görevlerini ne kadar güvenilir yaptığına dair daha fazlası için [AI senin yerine rezervasyon yapabilir mi yazımıza](/tr/posts/senin-yerine-is-yapan-ai-ajan-eylemleri) bakabilirsiniz; girişimlerin yapay zeka maliyetlerini nasıl kontrol altında tuttuğuna dair yazımız için [Teknoloji kategori sayfamızı](/tr/category/teknoloji) inceleyebilirsiniz.

## Sıkça Sorulan Sorular

### ChatGPT Instant Checkout hâlâ kullanılabilir mi?

Hayır. OpenAI, Instant Checkout'u 4 Mart 2026'da kapattı ve ürün keşfine odaklanmaya karar verdi; ödeme işlemi artık satıcıların kendi checkout deneyimlerine bırakılıyor.

### Universal Commerce Protocol (UCP) nedir?

UCP, Google'ın Ocak 2026'da Shopify ile birlikte tanıttığı açık bir agentic ticaret standardı; keşif, ödeme ve satış sonrası desteği kapsıyor. Shopify, Etsy, Walmart ve Target gibi büyük satıcılar lansman ortakları arasında yer alıyor.

### Bir AI ajanına ödeme yetkisi verdiğimde kart numaram görünür mü?

Hayır. Visa ve Mastercard'ın ajan ödeme sistemleri, gerçek kart numarasını asla ajana ya da platforma göstermeyen tokenleştirilmiş kimlik bilgileri kullanıyor; her token belirli bir ajana, satıcıya ve harcama kuralına bağlanıyor.

### AI ajanının harcamasını nasıl sınırlarım?

Ajana verdiğiniz token'a belirli bir harcama tavanı, satıcı listesi ve zaman aralığı tanımlayarak sınırlayabilirsiniz; bu sınırların dışına çıkan her işlem kart veren tarafından otomatik olarak reddedilir ya da insan onayına düşer.
