---
title: "AI Ürünü Çıkaran Kurucunun Hukuki Kontrol Listesi"
slug: "ai-urunu-cikaran-kurucu-hukuki-liste"
translationKey: "founder-ai-legal-checklist-2026"
locale: "tr"
excerpt: "AI özelliği çıkarmadan önce kullanıcı bildirimi, güncel sözleşme şartları, tedarikçi veri anlaşması ve AB Yapay Zeka Yasası şeffaflık kontrolü yapılmalı."
category: "business"
tags: ["compliance", "ai-regulation", "privacy", "saas", "best-practices"]
publishedAt: "2026-09-23"
seoTitle: "AI Ürünü Çıkaran Kurucunun Hukuki Kontrol Listesi"
seoDescription: "Kurucular için pratik hukuki kontrol listesi: AI bildirimi, kullanım şartları, tedarikçi veri sözleşmesi, telif hakkı, sorumluluk sınırı ve AB AI Yasası."
---

Kısa cevap: AI özelliğini yayına almadan önce dört şeyi netleştir — kullanıcıya açık bir AI bildirimi, güncellenmiş kullanım şartları ve kabul edilebilir kullanım politikası, model tedarikçinle yazılı bir veri işleme anlayışı ve sözleşmende bir sorumluluk tavanı. AB'de kullanıcıların varsa, 2 Ağustos 2026'da yürürlüğe giren AB Yapay Zeka Yasası şeffaflık kurallarını da kontrol et. Gerçek para veya hassas veri söz konusu olduğunda bu liste bir avukatın yerini tutmaz.

Bu yazı hukuki tavsiye değildir. Hızlı ilerlemesi gereken kurucular için, bir müşteri, yatırımcı veya denetleyici sorduğunda önceden düzeltilmiş olması gereken maddeleri toparlayan bir başlangıç listesidir. Yasalar ülkeden ülkeye değişir; AB Yapay Zeka Yasası yalnızca AB'de kullanıcın veya faaliyetin varsa seni bağlar, ABD, İngiltere ve diğer bölgelerin kendi (genellikle daha hafif) kuralları vardır.

## AI özelliği çıkarmadan önce hangi belgeler gerekir?

En az şunlar gerekir: güncellenmiş Kullanım Şartları, AI tedarikçini ve ona gönderdiğin veriyi açıkça belirten bir Gizlilik Politikası ve kullanıcıların AI özelliğiyle neler yapamayacağını (yasa dışı içerik ürettirmek, büyük ölçekte kazımak, modeli tersine mühendislikle çözmeye çalışmak gibi) tanımlayan bir Kabul Edilebilir Kullanım Politikası. Özellik sağlık, hukuk veya finans konularına dokunuyorsa, "tıbbi/hukuki/finansal tavsiye değildir" uyarısını çıktının hemen yanına koy, alt bilgideki bir bağlantıya gömme.

Çoğu solo kurucu Kabul Edilebilir Kullanım Politikasını, Kullanım Şartlarıyla üst üste biniyor diye atlıyor. Oysa öyle değil: bu politika, tüm sözleşmeyi yeniden müzakere etmeden kötüye kullanan bir hesabı (prompt injection denemeleri, toplu spam üretimi) askıya almanı sağlayan ayrı bir dayanaktır. Onu tam bir kullanım şartları onayı gerektirmeden güncelleyebileceğin kısa, bağımsız bir sayfa olarak yaz.

## Bir özelliğin AI kullandığını kullanıcıya söylemek zorunda mıyım?

Çoğu durumda evet, üstelik zorunlu olmayan yerlerde bile iyi bir uygulamadır. Etkileşim noktasında tek satırlık bir bildirim — "Bu yanıt yapay zeka tarafından üretilmiştir" — sohbet kutucuğu, özetleyici veya içerik üretici gibi düşük riskli çoğu özellik için yeterlidir. İnsan temsilciyle karıştırılabilecek herhangi bir şeyde bildirim, kullanıcı çıktıya güvenmeye başlamadan önce yapılmalı, sonradan değil.

Basit, göze batmayan bir bildirim bandı şöyle görünür:

```text
Bu özellik yanıtları oluşturmak için yapay zeka kullanır.
Çıktılar hatalı olabilir; güvenmeden önce doğrulayın.
Tıbbi, hukuki veya finansal tavsiye değildir.
```

Bunu kimsenin bakmadığı bir ayarlar sayfasına değil, AI çıktısının gerçekten göründüğü yere koy.

## AB Yapay Zeka Yasası beni bağlar mı?

AB'de kullanıcın veya faaliyetin yoksa Yasa seni doğrudan bağlamaz; ama ilk AB müşterini kazandığın an bu kontrolü tekrar yap, çünkü yükümlülükler merkezinin yerine değil, erişimin yerine bağlıdır. Yasanın Madde 50 şeffaflık yükümlülükleri 2 Ağustos 2026'da yürürlüğe girdi: kullanıcıyla doğrudan etkileşen AI sistemlerinin (sohbet botları, sesli asistanlar, AI ajanları) sağlayıcıları, bağlamdan zaten açık olmadıkça, kullanıcının bir yapay zekayla konuştuğunu bildirmek zorunda; üretken yapay zeka çıktıları da makine tarafından okunabilir şekilde yapay zeka üretimi olarak işaretlenmeli. Piyasada zaten bulunan sistemler için teknik işaretleme zorunluluğunda 2 Aralık 2026'ya kadar bir geçiş süresi tanınıyor.

Şeffaflık kurallarına uyumsuzluğun cezası, hangisi daha yüksekse, 15 milyon avroya veya küresel yıllık cironun yüzde 3'üne kadar çıkabiliyor; AB'den trafiğin varsa bunu hafife almamak gerekir. Neyin değiştiğine ve kimi etkilediğine dair daha ayrıntılı bir bakış için [AB Yapay Zeka Yasası'nın yürürlüğe girişini anlattığımız yazıya](/tr/posts/ab-yapay-zeka-yasasi-devrede-ne-degisiyor) bakabilirsin. AB dışında manzara daha dağınık: ABD'de tek bir federal yapay zeka yasası yerine sektöre özgü kurallar ve eyalet yasaları var, İngiltere ise şimdilik mevcut düzenleyicilerin mevcut yasaları yapay zekaya uygulamasına dayanıyor.

## Tedarikçi ve veri paylaşımı şartlarında neler olmalı?

Kendi sözleşmeni yazmadan önce model sağlayıcının API şartlarını oku; kullanıcılarına karşı yükümlülüklerin genelde OpenAI, Anthropic, Google veya kullandığın her kimse ona verdiğin sözlere dayanır. Eylül 2026 itibarıyla büyük API sağlayıcıları (tüketici sohbet uygulamalarının aksine) API üzerinden gönderilen veriyi varsayılan olarak model eğitiminde kullanmıyor ve saklama süreleri kısa: Anthropic'in Ticari Şartları, hiçbir modelde API trafiği üzerinde eğitim yapmadığını belirtiyor ve standart log saklama süresi Eylül 2025 itibarıyla yedi güne indi; OpenAI'nin API şartları da, sıfır veri saklama planında değilsen yaklaşık 30 günlük kötüye kullanım izleme saklaması dışında, müşteri içeriğini eğitimden hariç tutuyor. Bu şartları kendin de güncel haliyle teyit et; tedarikçi politikaları değişir ve tüketici katmanı ürünleri (uygulama olarak ChatGPT, tüketici ürünü olarak Claude.ai) API'den farklı varsayılanlara sahip olabilir.

Kendi sözleşmen açık şekilde şunu söylemeli: hangi tedarikçi kullanıcı verisini işliyor, ona ne gönderiyorsun, çıktıları ve logları ne kadar süre saklıyorsun ve dördüncü bir tarafa (embedding sağlayıcı, vektör veritabanı, analitik aracı) alt işleme yapıyor musun. Tek bir modele mi bağlı kalacağına yoksa çeşitlendirecek misin karar vermeden önce [AI tedarikçi bağımlılığı yazımızı](/tr/posts/ai-tedarikci-bagimliligi-tek-model) okumakta fayda var.

## AI'nın ürettiği çıktının sahibi kim oluyor?

Bugün çoğu ülkede, anlamlı bir insan katkısı olmadan tamamen yapay zeka tarafından üretilen içerik telif hakkı korumasına uygun sayılmıyor; bu da özelliğinin kullanıcılar için ürettiği şeyin münhasır sahipliğini her zaman varsayamayacağın anlamına geliyor. Bu yüzden sözleşme şartların, gerçekte neyi vaat ettiğin konusunda açık olmalı: çıktıyı kullanma lisansı, yasal olarak sahip olmayabileceğin münhasır fikri mülkiyet garantisi değil. Bu, müşterilerin doğrudan soracağı kod üretimi ve içerik üretimi ürünlerinde daha da önem kazanıyor.

Kod özelindeki ayrıntılar için [AI'nın yazdığı kodun sahibi kim yazısına](/tr/posts/ai-kodunun-sahibi-kim-hukuk) bak; ürünün müşterilerin yayınlamayı veya satmayı planladığı kod, görsel ya da uzun metin ürettiriyorsa özellikle işine yarayacaktır.

## AI hata yaptığında sorumluluğumu nasıl sınırlarım?

Sözleşmende sorumluluğa bir tavan koy, AI çıktısının doğruluğuna dair garanti verme ve düzenlemeye tabi bir alanda bir sohbet botunun, çıktının hemen yanında bir uyarı olmadan tavsiye vermesine asla izin verme. Standart bir SaaS sorumluluk sınırlama maddesi (sorumluluk son 12 ayda ödenen ücretlerle sınırlı, dolaylı zararlardan sorumluluk yok) hâlâ geçerli, ama AI özellikleri yeni bir hata türü ekliyor: kullanıcının üzerine hareket ettiği halüsinasyon bir bilgi. Şartlarda ve özelliğin hemen yanında, çıktıların "olduğu gibi" sunulduğunu ve özellikle sağlık, hukuk veya finansal kararlara dokunan her şeyde güvenmeden önce doğrulanması gerektiğini açıkça yaz.

Gizlilik uygulamalarının sorumlulukla kesiştiği nokta da burası: özellik kişisel veri işliyorsa, [AI asistanlarının veriyi nasıl hatırladığına dair yazımız](/tr/posts/ai-asistanlari-seni-nasil-hatirliyor), hem KVKK/GDPR maruziyetini hem de dürüstçe neyi reddedebileceğini şekillendiriyor.

## Tek sayfalık kontrol listesi nedir?

| Madde | Neden önemli | Şimdi mi sonra mı |
|---|---|---|
| Etkileşim noktasında AI bildirimi | AB'li kullanıcılar için Madde 50 gereği; her yerde iyi uygulama | Şimdi |
| Güncellenmiş Kullanım Şartları + Kabul Edilebilir Kullanım Politikası | Kötüye kullanımı askıya almanı ve kuralları belirlemeni sağlar | Şimdi |
| Tedarikçi veri işleme şartlarının incelenmesi | Eğitim/saklama varsayılanlarını ve alt işlemcileri netleştirir | Şimdi |
| "Tıbbi/hukuki/finansal tavsiye değildir" uyarısı | Düzenlemeye tabi konularda sorumluluğu sınırlar | Şimdi |
| Kullanım Şartlarında çıktı sahipliği ifadesi | Sahip olmayabileceğin fikri mülkiyet beklentisini netleştirir | Şimdi |
| Sorumluluk tavanı ve "olduğu gibi" maddesi | AI hatalarından doğacak zararı sınırlar | Şimdi |
| Gizlilik politikasında AI tedarikçisi ve veri akışı belirtilmesi | KVKK/GDPR şeffaflık gereği | Şimdi |
| Tam AB Yapay Zeka Yasası risk sınıflandırması | Yalnızca sistemin "sınırlı risk"ten yüksek olması durumunda gerekir | Sonra, avukatla |
| Sektöre özgü uyum (sağlık, finans, işe alım) | Ek kurallar uygulanır (örneğin sağlık mevzuatı, kredi/işe alım mevzuatı) | Sonra, avukatla |
| Uluslararası veri aktarım mekanizması (standart sözleşme maddeleri) | AB'li kişisel veriyi AB dışında işlediğinde gerekir | Sonra, avukatla |

## Ne zaman gerçekten avukata danışmalıyım?

AI özelliğin sağlık, hukuk, finans veya işe alım kararlarına dokunuyorsa, büyük ölçekte hassas kişisel veri işliyorsa ya da bir tur topluyorsan ve durum tespiti AI altyapını didikleyecekse, kendi başına ilerlemeden önce bir avukata danış. Buradaki gibi kontrol listeleri temel seviyeyi kapsar; düzenlemeye tabi sektörleri, sınır ötesi veri aktarımlarını veya bir term sheet'in tazminat maddelerini kapsamaz. Büyük bir lansmandan önce Kullanım Şartlarını ve tedarikçi anlaşmanı gözden geçirmesi için bir girişim avukatının bir-iki saatlik zamanına bütçe ayır; bu, bir müşteri şikayetinden sonra sözleşmeyi düzeltmekten çok daha ucuza gelir.

Kişisel görüşüm: çoğu solo kurucu ürünü cilalamaya fazla yatırım yapıp, bir tazminat boşluğunu veya eksik bir bildirimi yakalayacak o iki saatlik avukat görüşmesini ihmal ediyor. Önce listeyi kendin uygula, sonra o saati tamamen atlamak yerine satın al.

AB Yapay Zeka Yasası özelinde, avukatınla konuşmadan önce okumaya değer iki belge [Avrupa Komisyonu'nun şeffaflık yükümlülüklerine ilişkin resmi rehberi](https://digital-strategy.ec.europa.eu/en/policies/guidelines-ai-transparency-obligations) ve [Madde 50'yi açıklayan EU AI Act sayfası](https://artificialintelligenceact.eu/article/50/); [Cooley hukuk bürosunun Ağustos 2026 şeffaflık son tarihine dair özeti](https://www.cooley.com/news/insight/2026/2026-08-03-eu-ai-act-transparency-obligations-take-effect-2-august-2026) de girişim odaklı bir hukuk bürosundan sade bir genel bakış sunuyor. Tedarikçi şartları için özete güvenmek yerine [Anthropic'in API ve veri saklama dokümantasyonunu](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention) doğrudan oku; tedarikçi politikaları, onlar hakkında yazılan blog yazılarından daha sık güncelleniyor.

## Sıkça Sorulan Sorular

### Solo kurucu olarak AI özelliği çıkarmak için avukata ihtiyacım var mı?

Genel tüketicilere yönelik özetleyici veya sohbet kutucuğu gibi düşük riskli bir özellik için genelde hayır; bildirim, şartlar ve tedarikçi sözleşmesi üzerinde dikkatli bir kendin-yap turu erken aşama riskinin çoğunu kapatır. Düzenlemeye tabi veriye, işe alım kararlarına, sağlık veya finansal tavsiyeye dokunduğunda ya da bir yatırım turunu kapatmadan önce mutlaka bir avukat tut.

### Girişimim AB'de değilse AB Yapay Zeka Yasası beni bağlar mı?

Evet, AB'de kullanıcıların varsa Yasa genellikle şirketinin merkezine değil kullanıcılarının konumuna göre uygulanır. Madde 50 şeffaflık yükümlülükleri — AI etkileşimini bildirmek ve AI üretimi içeriği işaretlemek — 2 Ağustos 2026'da yürürlüğe girdi ve sistem AB pazarına sunuluyorsa veya AB'deki kişilerce kullanılıyorsa, sağlayıcının nerede kurulu olduğuna bakılmaksızın uygulanır.

### OpenAI veya Anthropic API verimi model eğitiminde kullanıyor mu?

Eylül 2026 itibarıyla, ne OpenAI'nin ne de Anthropic'in standart API şartları, müşteri tarafından gönderilen veriyi varsayılan olarak model eğitiminde kullanmıyor; bu, bazı tüketici sohbet ürünlerinin varsayılanlarından farklı, çünkü onlarda katılım opt-in yerine opt-out olabiliyor. Politikalar değişebildiği için buna güvenmeden önce güncel şartları her zaman tedarikçinin kendi sitesinden teyit et.

### AI bildirimi zorunluluğunu atlarsam ne olur?

AB'de kullanıcıların varsa, Madde 50 bildirimini atlamak, uygulama senin ürününü hedef aldığında, hangisi daha yüksekse, 15 milyon avroya veya küresel yıllık cironun yüzde 3'üne kadar para cezası riski taşır. AB dışında ise anlık risk genelde daha çok itibar ve sözleşme kaynaklı olur; bir müşterinin veya platform ortağının durumu sonradan öğrenmesi, herhangi bir düzenleyiciden daha fazla güven zedeler.
