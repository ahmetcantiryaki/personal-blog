---
title: "AI Senin Yerine Rezervasyon Yapabilir mi?"
slug: "senin-yerine-is-yapan-ai-ajan-eylemleri"
translationKey: "ai-agentic-actions-real-world-tasks"
locale: "tr"
excerpt: "Evet: Ağustos 2026 itibarıyla ChatGPT, sohbetten çıkmadan OpenTable, Resy ya da Yelp üzerinden gerçek bir restoran rezervasyonu tamamlayabiliyor."
category: "technology"
tags: ["chatgpt", "openai", "ai-agents", "automation"]
publishedAt: "2026-08-22"
seoTitle: "2026'da AI Ajan Eylemleri: ChatGPT Neyi Ayarlıyor"
seoDescription: "ChatGPT artık sohbet içinden OpenTable, Resy ve Yelp ile restoran rezervasyonu yapabiliyor. Ajan eylemleri nasıl çalışır, neye güvenilir, neye güvenilmez?"
---

Evet, Ağustos 2026 itibarıyla: ChatGPT, konuşmadan çıkmadan OpenTable, Resy ya da Yelp üzerinden gerçek bir restoran rezervasyonu tamamlayabiliyor. "Ajan eylemi" (agentic action) dediğimiz bu kalıp — bir yapay zeka asistanının sadece soruya cevap vermek yerine gerçek dünyada bir işi tamamlaması — hızla yaygınlaşıyor. Sistem, senin adına ilgili servisin rezervasyon aracını çağırıyor, bilgilerini dolduruyor ve sohbette sana onay veriyor; ama yargı gerektiren ya da yanlış gitmesinin gerçek bir bedeli olan işler için henüz güvenilir değil.

## "Ajan Eylemi" Tam Olarak Ne Demek?

Ajan eylemi, bir yapay zeka asistanının gerçek dünyada bir işi tamamlamasıdır — rezervasyon yapmak, satın almak, form doldurmak, mesaj göndermek — sadece insanın uygulayacağı bir metin üretmek değil. Bu ayrım önemli: sana bir rezervasyon metni yazan bir sohbet botu soruya cevap veriyordur; rezervasyonu gerçekten gönderip onay numarası alan bir ajan ise gerçek dünyada bir yan etkisi olan bir eylem gerçekleştiriyordur. Bu yan etki, ajan eylemlerini hem düz sohbetten daha kullanışlı hem de daha riskli yapan şey.

## ChatGPT Restoran Rezervasyonunu Nasıl Yapıyor?

Yelp, 10 Ağustos 2026'da Reservations ve Waitlist sisteminin doğrudan ChatGPT'ye entegre edildiğini duyurdu; OpenAI ayrıca aynı sohbet içi rezervasyon akışı için OpenTable ve Resy ile ayrı anlaşmalar yaptı. Kişi sayısı, tarih, saat, mutfak türü ya da konum gibi ne istediğini anlatıyorsun; ChatGPT eksik bilgileri (iletişim bilgisi, özel istekler) tamamlıyor, bağlı servisteki uygun saatleri arıyor ve rezervasyonu tamamlıyor. Özellik, bu yazının yazıldığı tarih itibarıyla ABD ve Kanada kullanıcıları için aktif.

Güvenmeden önce bilmen gereken iki sınır var: Yelp rezervasyonları yalnızca zaten Yelp Guest Manager kullanan mekânlarda çalışıyor, yani Yelp'teki her restoran bu şekilde rezerve edilemiyor; herhangi bir değişiklik ya da iptal ise ilgili orijinal platforma (Yelp, OpenTable ya da Resy) geri dönmeyi gerektiriyor — ChatGPT rezervasyonu oluşturabiliyor ama sonrasında yönetemiyor. Kaynak: [Android Authority](https://www.androidauthority.com/chatgpt-restaurant-reservations-and-waitlists-3696712/), [TechWyse](https://www.techwyse.com/news/platform-updates/yelp-reservations-waitlist-chatgpt-integration).

## Bu Motorun Altında Ne Var: Araçlar ve Bağlayıcılar

Ajan eylemleri, "bağlayıcılar" (connector) üzerinden çalışır — belirli bir servisin API'sini, modelin sohbet ortasında çağırabileceği bir araç olarak sunan entegrasyonlar. Bu, geliştirici bağlamında bir modelin dış araçları çağırmasını sağlayan [Model Context Protocol](/tr/posts/model-context-protocol-nedir) mantığına benziyor. ChatGPT'nin rezervasyon akışında bu, gerçek rezervasyon API çağrısını bir Yelp/OpenTable/Resy bağlayıcısının yapması demek; modelin işi ise ağ isteğini kendisinin yapması değil, ne zaman ve hangi parametrelerle çağıracağına karar vermesi. Bu yüzden iptaller de orijinal uygulamaya geri yönlendiriliyor — ChatGPT bu entegrasyonların çoğunda sadece "rezervasyon oluştur" aracına sahip, tam hesap yönetimine değil.

## OpenAI'ın Atlas Tarayıcısına Ne Oldu?

OpenAI, bağımsız Atlas tarayıcısını 21 Ekim 2025'te macOS için yayınladıktan yaklaşık on ay sonra, 9 Ağustos 2026'da kapattı. Belirtilen gerekçe: ajan tabanlı tarama, insanların geçiş yapması gereken ayrı bir ürün olarak değil, zaten kullandıkları uygulama ve tarayıcıların içine gömülü olduğunda daha iyi çalışıyor — aynı mantık, OpenAI'ı Mart 2026'da Sora'yı kapatmaya da götürmüştü. Atlas'ın yetenekleri [ChatGPT Work](/tr/posts/chatgpt-work-nedir-openai-is-ajani) (9 Temmuz 2026'da yayınlandı), ChatGPT masaüstü uygulaması içindeki güncellenmiş bir tarayıcı ve yeni bir ChatGPT Chrome eklentisine dağıtılıyor. Kapanışı [OpenAI'ın Atlas Tarayıcısı Kapanıyor](/tr/posts/openai-atlas-kapaniyor-ai-tarayici) yazımızda ayrıntılı ele almıştık. Kaynak: [TechCrunch](https://techcrunch.com/2026/07/09/openai-is-shutting-down-atlas-but-its-ai-browser-ambitions-are-still-growing/), [OpenAI Yardım Merkezi](https://help.openai.com/en/articles/20001371-evolving-atlas-into-chatgpt-for-browser-based-agentic-work).

## Güven, Onay ve Başarısızlık Durumları Nasıl İşliyor?

Her ajan rezervasyon akışı, eylem tamamlanmadan önce bir onay adımı ekliyor — ChatGPT işlemi göndermeden önce sana rezervasyon detaylarını gösterip onay istiyor. Dikkat edilmesi gereken başarısızlık durumları, yapay zekanın reddetmesinden çok sessiz uyumsuzluklarla ilgili: sohbetin başından taşınan yanlış bir kişi sayısı, bir saat kayan bir zaman dilimi varsayımı ya da yanlış konuma çözümlenen bir mekân adı. Bunların hiçbiri bir hata mesajı tetiklemiyor; sadece teknik olarak başarılı ama yanlış bir rezervasyon üretiyor. Onaylamadan önce her zaman onay ekranını oku — ajan eylemlerinin ortadan kaldırmadığı (ve kaldırmaması gereken) tek manuel adım bu.

## Neyi Devretmek Güvenli, Neyi Değil?

| Devretmek güvenli | Devretmek henüz güvenli değil |
| --- | --- |
| Değiştirme maliyeti düşük restoran rezervasyonları | İade edilemeyen uçak veya otel rezervasyonları |
| Servisler arasında seçenek arama ve karşılaştırma | Kimlik doğrulama ya da yeni bir hesapta ödeme gerektiren her şey |
| Senin gözden geçireceğin bir mesaj veya form taslağı | Geri alınamayan bir mesaj göndermek (hukuki, mali, tıbbi) |
| Düşük riskli randevu (masa, kuaför) | Yüksek riskli randevu (ameliyat, mahkeme tarihi) |

Genel kural: geri almanın ya da yeniden yapmanın ucuz olduğu işleri devret, gerçek mali veya hukuki sonucu olan her şeyde insanı döngüde tut.

## Claude ve Gemini Ajan Eylemlerinde Nerede Duruyor?

Anthropic'in yaklaşımı, tüketiciye yönelik rezervasyon akışları yerine geliştiriciye yönelik araçlara odaklanıyor: Claude'un [computer use aracı](/tr/posts/claude-browser-use-araci-nedir) Ekim 2024'ten beri beta'daydı ve 19 Ağustos 2026'da yeni bir browser use aracıyla birlikte Claude API'de genel kullanıma (GA) açıldı; ama bunlar geliştiricilerin kendi ajanlarına bağlayacağı yapı taşları, "akşam yemeğimi ayarla" diyen bir tüketici özelliği değil. Google'ın Gemini'deki ajan yetenekleri, bu yazının yazıldığı tarih itibarıyla üçü arasında en az belgelenmiş olanı — Google ayrıntıları paylaşana kadar tüketiciye yönelik bir Gemini rezervasyon özelliğiyle ilgili somut iddialara temkinli yaklaş. Daha geniş bir karşılaştırma için [Gemini mi ChatGPT mi karşılaştırmamıza](/tr/posts/gemini-mi-chatgpt-mi) ve [AI tarayıcıları derlememize](/tr/posts/yapay-zeka-tarayicilari-karsilastirma) bakabilirsin.

| | ChatGPT | Claude | Gemini |
| --- | --- | --- | --- |
| Tüketici rezervasyonu (restoran vb.) | Var, Ağustos 2026'dan beri (Yelp, OpenTable, Resy) | Tüketici özelliği yok | Net belgelenmemiş |
| Geliştirici tarayıcı/masaüstü aracı | Operator tarzı ajan araçları | Browser use + computer use, GA 19 Ağustos 2026 | Project Mariner (araştırma aşamasında) |
| Bağımsız ajan tarayıcısı | Atlas, 9 Ağustos 2026'da kapandı | Yok | Yok |

## Bundan Sonra Ne Olacak?

Ajan eylemlerinin rezervasyonlardan daha fazla işlemsel kategoriye — market siparişi tekrarlama, abonelik yönetimi, sabit bütçe altında basit satın almalar — yayılmasını bekle; bağlayıcı ekosistemleri olgunlaştıkça ve onay arayüzleri gönderimden önce uyumsuzlukları yakalamada daha güvenilir hale geldikçe bu genişleyecek. Bu noktada darboğaz model yeteneği değil; güven altyapısı — net onay adımları, mümkün olan yerde kolay geri alma ve modelin kendi hatasını gerçek dünya eylemine dönüşmeden önce fark etmesine yetecek bağlamı sunan bağlayıcılar.

## Sıkça Sorulan Sorular

### ChatGPT gerçekten benim yerime restoran rezervasyonu yapabilir mi?

Evet. Ağustos 2026 itibarıyla ChatGPT, sohbetin içinden OpenTable, Resy ve Yelp üzerinden restoran rezervasyonlarını tamamlayabiliyor; bilgilerini topluyor ve ayrı bir uygulama açmana gerek kalmadan rezervasyonu onaylıyor.

### OpenAI'ın Atlas tarayıcısına ne oldu?

OpenAI, Atlas'ı Ekim 2025'teki lansmanından yaklaşık on ay sonra, 9 Ağustos 2026'da kapattı; ajan tabanlı tarama yeteneklerini bağımsız bir ürün olarak sürdürmek yerine ChatGPT Work'e, ChatGPT masaüstü uygulamasının tarayıcısına ve yeni bir ChatGPT Chrome eklentisine taşıdı.

### Bir yapay zeka ajanının benim adıma rezervasyon yapmasına izin vermek güvenli mi?

Bir restoran masası gibi düşük riskli ve kolayca geri alınabilir eylemler için makul ölçüde güvenli, ama onaylamadan önce her zaman onay ekranını okumalısın; çünkü asıl başarısızlık durumu bariz bir hata değil, sessizce yanlış giden bir detaydır (saat, kişi sayısı, konum).

### Claude ya da Gemini'de ChatGPT ile aynı rezervasyon özellikleri var mı?

Ağustos 2026 itibarıyla tüketiciler için yok. Claude, tüketiciye yönelik bir rezervasyon özelliği yerine geliştiriciye yönelik tarayıcı ve computer use araçları sunuyor; Google ise Gemini'de eşdeğer bir tüketici özelliğini henüz net şekilde belgelemedi.
