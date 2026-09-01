---
title: "GA4 Alternatifleri: Gizlilik Odaklı Analitik"
slug: "ga4-alternatifleri-gizlilik-odakli-analitik"
translationKey: "privacy-first-analytics-ga4-alternatives"
locale: "tr"
excerpt: "Kısa cevap: Çoğu küçük-orta trafikli site için hayır. GA4'ün örnekleme ve çerez uyarısı yükü, Plausible ve Fathom gibi çerezsiz araçların basitliğine değmiyor."
category: "digital-marketing"
tags: ["privacy", "marketing-analytics", "self-hosting", "cost-optimization"]
publishedAt: "2026-09-01"
seoTitle: "GA4 Alternatifleri 2026: Gizlilik Odaklı Analitik Araçları"
seoDescription: "Kısa cevap: Çoğu küçük-orta trafikli site için hayır. GA4'ün örnekleme ve çerez uyarısı yükü, Plausible ve Fathom gibi çerezsiz araçların basitliğine değmiyor."
---

Kısa cevap: Küçük ve orta trafikli çoğu site için GA4'e gerek yok. Google Analytics 4, kurumsal ölçekte veri örnekleme sorunlarını çözecek bir mimariyle geldi, ama günde birkaç bin ziyaretçisi olan bir blog ya da SaaS ürünü için bu karmaşıklık fazladan bir maliyet: çerez uyarısı yönetimi, GDPR onay akışı ve haftalar süren öğrenme eğrisi. Plausible, Fathom, Umami gibi çerezsiz araçlar aynı temel soruları — kim geliyor, nereden geliyor, ne yapıyor — çok daha az sürtünmeyle cevaplıyor.

## GA4'ün gerçek maliyeti nedir?

GA4'ün asıl maliyeti lisans ücreti değil, kurulum ve bakım yükü. Yüksek trafikli hesaplarda veri örneklemesi (sampling) devreye giriyor ve raporlardaki sayılar tahminî hale geliyor; bu, küçük bir sitede bile 30 günden uzun tarih aralıklarında görülebiliyor. Buna ek olarak GA4 çerez tabanlı olduğu için AB ziyaretçilerine bir onay (consent) banner'ı göstermeniz gerekiyor — bu da hem geliştirme yükü hem de reddeden ziyaretçiler için veri kaybı demek.

Öğrenme eğrisi de gerçek bir maliyet: GA4'ün olay tabanlı (event-based) veri modeli, eski Universal Analytics'in sayfa görüntüleme mantığından köklü biçimde farklı ve çoğu pazarlamacı temel bir "hangi sayfa ne kadar trafik aldı" sorusuna cevap bulmak için bile birkaç tıklama derinliğine inmek zorunda kalıyor.

## GA4'e alternatif olarak hangi araçlar var?

Beş araç, farklı ihtiyaçlara göre öne çıkıyor: Plausible ve Fathom basit, çerezsiz web analitiği sunuyor; Umami ve Matomo kendi sunucunuzda barındırılabiliyor; PostHog ise pageview ölçümünün ötesinde ürün analitiği (funnel, oturum kaydı, A/B testi) istiyorsanız devreye giriyor.

| Araç | Model | Çerez | Self-hosting | Öne çıkan yön |
|---|---|---|---|---|
| Plausible | Barındırılan / açık kaynak | Yok | Var | Basit, aylık ~9 dolardan başlıyor |
| Fathom | Barındırılan | Yok | Yok | AB'de veri izolasyonu, aylık ~15 dolardan başlıyor |
| Umami | Açık kaynak | Yok | Var (ücretsiz) | Bulut sürümünde 100 bin olaya kadar ücretsiz kota |
| Matomo | Açık kaynak / barındırılan | Opsiyonel | Var | GA4'e en yakın özellik seti, self-hosted GDPR uyumu |
| PostHog | Barındırılan (AB seçenekli) / açık kaynak | Opsiyonel | Var | Aylık 1 milyon olay + 5.000 oturum kaydı ücretsiz |

Fiyatlar Ağustos 2026 itibarıyla; tüm sağlayıcılar hacme göre kademeli fiyatlandırma kullanıyor, bu yüzden trafiğiniz büyüdükçe kendi sitelerinden güncel fiyatı doğrulamanız gerekiyor. Küçük bir blog için aradaki fark birkaç dolar mertebesinde kalabiliyor, ama aylık milyonlarca sayfa görüntülemesi olan bir siteyse tercih ettiğiniz araç, yıllık bazda yüzlerce dolarlık bir farka yol açabiliyor.

## Çerezsiz ölçüm nasıl çalışır?

Çerezsiz araçlar, ziyaretçiyi kişisel veri saklamadan (IP adresi, çerez kimliği gibi) o günkü oturum boyunca takip etmek için günlük olarak değişen, geri döndürülemez bir hash (site alan adı + IP + user-agent kombinasyonundan üretilen tek yönlü bir özet) kullanıyor. Bu yöntem GDPR'ın "kişisel veri" tanımına genellikle girmediği için çoğu yargı alanında onay banner'ı gerektirmiyor — ama bu, hukuki tavsiye değil; kendi bölgenizdeki güncel mevzuatı kontrol etmeniz gerekiyor.

Sunucu tarafı (server-side) ölçüm ise farklı bir katman: veri, tarayıcıdan değil doğrudan sunucudan toplandığı için reklam engelleyicilerden etkilenmiyor ve genelde daha doğru trafik sayıları veriyor. Matomo ve PostHog'un self-hosted sürümleri bu modele en kolay geçiş yapan araçlar arasında.

## Sayfa hızı açısından fark var mı?

Evet, gözle görülür bir fark var: Plausible kendi verilerine göre 1 kilobaytın altında bir script yüklerken, GA4'ün gtag.js kütüphanesi tarayıcıya onlarca kilobayt JavaScript indiriyor ve bu da Core Web Vitals ölçümlerinden biri olan Interaction to Next Paint (INP) üzerinde ölçülebilir bir gecikme yaratabiliyor. Zaten yavaş bir mobil bağlantıda çalışan bir e-ticaret sitesi için bu fark, dönüşüm oranını doğrudan etkileyebiliyor.

Bu, sadece teorik bir avantaj değil: Google'ın kendi arama sıralama sinyallerinden biri sayfa deneyimi metrikleri, dolayısıyla analitik script'inizin ağırlığı dolaylı yoldan SEO performansınıza da yansıyor. Çerezsiz araçların çoğu, çerez rızası yönetimi için ayrı bir consent management platformu (CMP) script'i de gerektirmediğinden, toplam sayfa ağırlığındaki tasarruf GA4'e kıyasla katlanarak büyüyor.

## AB'de GDPR ve veri barındırma ne gerektiriyor?

GDPR, kişisel veri toplayan her araç için açık onay ve veri işleme sözleşmesi (DPA) istiyor; çerezsiz araçların çoğu kişisel veri toplamadığı için bu yükümlülüğün büyük kısmından muaf kalıyor, ama "muaf" demek "sıfır yükümlülük" demek değil — gizlilik politikanızda hangi aracı kullandığınızı ve neyi ölçtüğünüzü belirtmeniz hâlâ gerekiyor.

Veri barındırma konusunda Fathom AB içinde veri izolasyonu sunuyor, PostHog AB bölgesi seçeneği veriyor, Matomo ve Umami'yi kendi AB sunucunuzda barındırırsanız veri hiç ülke dışına çıkmıyor. Bu, özellikle kamu sektörü veya sağlık gibi düzenlemeye tabi sektörlerdeki müşteriler için tercih sebebi olabiliyor. B2B satan bir SaaS şirketi için bu ayrım somut bir satış argümanına dönüşebiliyor: bir kurumsal müşteri güvenlik anketinde "analitik verileriniz nerede saklanıyor" sorusunu sorduğunda, "kendi AB sunucumuzda, hiçbir üçüncü tarafa çıkmadan" cevabı, GA4'ün ABD merkezli veri işleme modeline göre daha az sürtünmeli bir görüşme sağlıyor.

## Hangi durumda GA4'ü tutmalısınız?

GA4'ü tutmak mantıklı olan üç durum var: Google Ads ile derin entegrasyon gerektiren, dönüşüm verisini doğrudan kampanya optimizasyonuna besleyen bir reklam operasyonunuz varsa; BigQuery'ye ham veri aktarımı gibi kurumsal veri ambarı ihtiyaçlarınız varsa; ya da zaten yıllarca birikmiş GA4 geçmiş verinizi kaybetmek istemiyorsanız. Bu üç senaryo dışında, ek karmaşıklığın karşılığını genelde alamıyorsunuz.

Bu, [AI özetlerinin tıklamaları yediği bir dönemde](/tr/posts/ai-ozetleri-tiklama-hayatta-kalma) trafiğinizi doğru ölçmenin önemiyle de örtüşüyor: karmaşık bir araçla yanlış yorumlanan veri, basit bir araçla doğru okunan veriden daha az değerli.

## Küçük bir ekip için pratik geçiş nasıl görünür?

Geçiş genelde tek bir script etiketini değiştirmek kadar basit; asıl iş, hangi olayları (event) izlemeye devam edeceğinize karar vermek. Aşağıdaki örnek, Plausible'ın temel entegrasyon script'ini gösteriyor:

```html
<script defer data-domain="siteniz.com" src="https://plausible.io/js/script.js"></script>
```

Bu tek satır, sayfa görüntülemeleri ve temel yönlendirme (referrer) verisini toplamaya başlıyor; özel olay takibi (buton tıklaması, form gönderimi gibi) için ek bir fonksiyon çağrısı gerekiyor, ama GA4'teki gtag yapılandırmasına kıyasla kurulum süresi dakikalar mertebesinde.

Geçişten sonra ilk hafta en çok karşılaşılan sorun, GA4'te alışılmış özel raporların (custom report) yeni araçta bire bir karşılığının olmaması. Bunun pratik çözümü, geçiş öncesi hangi 3-5 raporun gerçekten haftalık olarak kullanıldığını listelemek ve yeni araçta sadece onları yeniden kurmak — GA4'teki rapor şablonlarının büyük kısmı zaten çoğu ekip tarafından hiç açılmıyor.

## Sıkça Sorulan Sorular

### GA4'ten Plausible'a geçiş veri kaybına yol açar mı?

Evet, geçmiş GA4 verisi otomatik aktarılmıyor; GA4 hesabınız istatistiksel arşiv olarak erişilebilir kalırken yeni araç sıfırdan veri toplamaya başlıyor. Kritik geçmiş raporları geçiş öncesi dışa aktarmak önerilir.

### Ücretsiz bir GA4 alternatifi var mı?

Umami'yi kendi sunucunuzda barındırırsanız tamamen ücretsiz; Umami Cloud ve PostHog ise aylık 100 bin olay / 1 milyon olay gibi cömert ücretsiz kotalar sunuyor. Trafiğiniz bu sınırları aşana kadar hiç ödeme yapmadan çalışabilirsiniz.

### Çerezsiz analitik araçları GDPR onayı gerektirmiyor mu?

Çoğu durumda hayır, çünkü kişisel veriyi kalıcı bir kimlikle saklamıyorlar; ama bu genel bir kural değil, kendi verisetiniz ve bölgeniz için güncel mevzuatı kontrol etmeniz gerekiyor. Gizlilik politikanızda hangi aracı kullandığınızı belirtmek her durumda gerekli.

### PostHog bir GA4 alternatifi mi yoksa farklı bir kategori mi?

Farklı bir kategori: PostHog temelde bir ürün analitiği platformu — funnel, oturum kaydı, özellik bayrağı (feature flag) ve A/B testi sunuyor, web analitiği bunun küçük bir parçası. Sadece pageview ve trafik kaynağı istiyorsanız Plausible veya Fathom daha az kurulum gerektirir.
