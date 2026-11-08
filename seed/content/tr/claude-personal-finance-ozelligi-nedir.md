---
title: "Claude Personal Finance Özelliği Nedir, Nasıl Çalışır?"
slug: "claude-personal-finance-ozelligi-nedir"
translationKey: "claude-personal-finance-feature-2026"
locale: "tr"
excerpt: "Claude Personal Finance, banka hesabınızı Plaid ile salt okunur bağlar, harcamanızı özetler; para transferi yapamaz, şu an sadece ABD'de Pro, Max, Ultra'da."
category: "ai"
tags: ["claude", "ai-tools", "privacy", "productivity"]
publishedAt: "2026-11-08"
seoTitle: "Claude Personal Finance Özelliği Nedir?"
seoDescription: "Claude Personal Finance, banka hesabınızı Plaid ile salt okunur bağlar, harcamanızı özetler; para transferi yapamaz, şu an sadece ABD'de Pro, Max, Ultra'da."
---

Kısa cevap: Claude Personal Finance, Anthropic'in Kasım 2026'da ABD'de beta olarak sunduğu bir özellik; Plaid üzerinden bağladığınız banka ve kart hesaplarınızı salt okunur okuyup harcamalarınızı kategorilere ayırıyor, bakiyenizi ve yaklaşan ödemelerinizi özetliyor. Para gönderemiyor, yatırım yapamıyor; sadece ABD'de Pro, Max ve Ultra aboneliklerinde açık.

## Claude Personal Finance nedir?

Claude Personal Finance, Claude'un sohbet arayüzüne eklenen ve bağladığınız banka hesaplarından okuduğu verilerle harcama sorularını doğal dilde yanıtlayan bir araç. [TechCrunch](https://techcrunch.com/2026/11/05/claude-can-now-analyze-your-spending-with-its-new-personal-finance-tool) ve [9to5Mac](https://9to5mac.com/2026/11/05/anthropic-upgrades-claude-with-new-personal-finance-feature/) gibi kaynaklara göre özellik 4-5 Kasım 2026'da ABD'de Pro, Max ve Ultra aboneleri için beta olarak açıldı; Free planında henüz yok. Anthropic'in kendi [haber sayfasında](https://www.anthropic.com/news) ayrı bir duyuru bulunmasa da, lansman çok sayıda basın kuruluşu tarafından aynı ayrıntılarla doğrulandı.

## Hesabımı nasıl bağlarım, hangi bankalar destekleniyor?

Hesap bağlama [Plaid](https://plaid.com) altyapısıyla yapılıyor: binlerce banka ve kart kuruluşunun kendi giriş ekranından kimlik doğrulaması yaparsınız, Claude'a parolanızı hiç vermezsiniz. Plaid, bankanızın onayladığı erişim kapsamını Claude'a aktarır; bağlantıyı istediğiniz an web ve masaüstünde Connectors menüsünden kaldırabilir, mobilde her okuma isteği için onay zorunlu kılabilirsiniz.

## Claude param hareket ettirebilir mi?

Hayır, kesinlikle hayır. Claude Personal Finance tamamen salt okunur çalışır; para transferi yapamaz, hesap açamaz, yatırım emri veremez, kredi kartı ya da kredi ürünü satmaz. Yaptığı tek şey bağladığınız hesaplardaki işlemleri okuyup özetlemek. Raporlara göre yaklaşık iki yıllık işlem geçmişini tarayabiliyor ve harcamalarınızı kira-fatura, yeme-içme, alışveriş gibi başlıklara ayırıyor.

## Verilerim ne kadar güvende, reklam var mı?

Anthropic, Personal Finance hub'ındaki konuşmaların model eğitiminde kullanılmadığını belirtiyor; ayrıca reklam veya sponsorlu öneri bulunmuyor ve şirket kendi kredi kartı, kredi ya da tasarruf ürününü satmıyor. Bu yaklaşım, [AI asistanlarının kullanıcı verisiyle genel olarak ne yaptığını](/tr/posts/ai-asistanlari-caginda-gizliligini-koru) incelediğimiz yazıdaki tabloyla örtüşüyor: okuma izni vermek, veri paylaşımıyla aynı şey değil.

## Kimler kullanabilir, hangi planda?

Kasım 2026 itibarıyla özellik sadece ABD'deki Pro, Max ve Ultra abonelerine açık; Free kullanıcılarına veya ABD dışındaki hesaplara henüz gelmedi. Hangi planın size uygun olduğunu karşılaştırmak isterseniz [AI abonelik rehberimize](/tr/posts/hangi-ai-aboneligi-claude-chatgpt-gemini) bakabilirsiniz.

| Plan | Personal Finance erişimi | Bölge |
|---|---|---|
| Free | Yok | - |
| Pro | Var (beta) | Sadece ABD |
| Max | Var (beta) | Sadece ABD |
| Ultra | Var (beta) | Sadece ABD |

## Hangi soruları sorabilirsiniz?

Özellik, muhasebe yazılımı gibi menüler yerine sıradan konuşma diliyle çalışıyor. Örnek sorular şöyle: "Bu ay yeme-içmeye ne kadar harcadım?", "Geçen üç ayın ortalama market faturası kaç lira?", "Önümüzdeki hafta hangi otomatik ödemeler düşecek?", "Abonelik harcamalarım toplamda ne kadar?" Claude, bağlı hesaplardaki işlemleri tarayıp bu soruları doğal dilde yanıtlıyor, ayrıca kategoriler arasında karşılaştırma da yapabiliyor; örneğin bu ayı geçen ayla kıyaslayıp hangi kategoride artış olduğunu söyleyebiliyor.

Burada kritik nokta, Claude'un hesap verisini yalnızca o sohbet oturumunda kullanıyor olması; aşağıdaki gizlilik bölümünde değindiğimiz gibi bu veriler model eğitimine dahil edilmiyor ve Personal Finance hub'ı dışındaki normal sohbetlerinizle karışmıyor.

## Kurulum nasıl işliyor, adım adım?

Süreç üç adımdan oluşuyor: önce Claude uygulamasında Personal Finance bölümünü açıyorsunuz, ardından "hesap bağla" diyerek Plaid'in sunduğu banka listesinden kendi kuruluşunuzu seçiyorsunuz, son olarak bankanızın kendi giriş ekranında kimlik doğrulaması yapıp hangi hesapların görülebileceğini onaylıyorsunuz. Bu üçüncü adımda Claude hiçbir ekranı görmüyor; tüm kimlik doğrulama Plaid'in ve bankanızın kendi arayüzünde gerçekleşiyor. Onay verdikten sonra ilk senkronizasyon birkaç dakika sürebiliyor, çünkü geçmiş işlem verisi (raporlara göre yaklaşık iki yıllık dönem) çekiliyor.

Birden fazla hesabı aynı anda bağlayabilirsiniz; Claude bunları tek bir görünümde birleştirip toplam harcamayı hesaplıyor. Her hesabı ayrı ayrı da sorgulayabiliyorsunuz, yani "sadece kredi kartımdaki harcamaları göster" demek yeterli. Birden fazla banka kullanan biri için bu, aylık harcama tablosunu tek tek uygulama açıp toplamak zorunda kalmadan, tek bir sohbet penceresinde görebilmek anlamına geliyor; özellikle farklı bankalarda kredi kartı, maaş hesabı ve tasarruf hesabı olan kullanıcılar için zaman kazandıran bir detay.

## Sınırlamaları neler?

Üç önemli sınırlama var. Birincisi coğrafi: özellik şimdilik yalnızca ABD'de ve yalnızca Plaid'in desteklediği kurumlarla çalışıyor, yani Türkiye'deki bankalar veya ABD dışındaki hesaplar kapsam dışı. İkincisi plan sınırı: Free kullanıcıları özelliği hiç göremiyor. Üçüncüsü de kapsam: Claude yatırım tavsiyesi, vergi danışmanlığı ya da kredi başvurusu gibi düzenlenmiş finansal hizmetler sunmuyor; sadece mevcut verinizi okuyup özetliyor. Anthropic bunu bilinçli bir sınır olarak çiziyor, çünkü düzenlenmiş finansal tavsiye vermek ayrı bir lisanslama ve sorumluluk yükü getiriyor.

## ChatGPT ve Gemini'de benzer bir özellik var mı?

Kasım 2026 itibarıyla ChatGPT ve Gemini'nin ana sohbet uygulamalarında, banka hesabını doğrudan bu şekilde salt okunur bağlayan yerleşik bir eşdeğeri bulunmuyor; her ikisi de harcama analizini genelde yüklediğiniz ekstre dosyaları veya üçüncü taraf eklentiler üzerinden yapıyor. Bu, Claude'u konuşarak kişisel finans sorgulamada şimdilik öne çıkaran bir fark, ama tek başına "en iyi AI asistanı" kararını belirleyecek bir ölçüt değil; hangi asistanın size uygun olduğuna dair daha geniş kıyaslamayı [AI abonelik rehberimizde](/tr/posts/hangi-ai-aboneligi-claude-chatgpt-gemini) bulabilirsiniz.

Burada dikkat edilmesi gereken şey, bankacılık verisine erişimin tek başına bir "özellik yarışı" konusu olmaması. Plaid gibi bir aracı kuruluşla entegrasyon kurmak, uyum (compliance) ve güvenlik denetimi gerektiren uzun bir süreç; bu yüzden rakiplerin aynı özelliği birebir kopyalaması muhtemelen aylar alacak bir mühendislik ve hukuki iş demek, bir haftalık bir "takip et" meselesi değil.

## Bu "ilk adım" mı, yoksa sınırlı bir demo mu?

Anthropic özelliği kendi ifadesiyle "ilk adım" olarak tanımlıyor ve servet yöneticilerini, bankaları, finans şirketlerini üzerine araç inşa etmeye çağırıyor. Kişisel görüşüm şu: salt okunur ve tek ülkeye kilitli bir özelliği "ilk adım" diye lanse etmek biraz iddialı; [Claude Managed Agents'ın kurumsal tarafta sunduğu bütçe ve danışman özellikleriyle](/tr/posts/claude-managed-agents-butce-danisman-veri-konumu) karşılaştırıldığında bu, zaten var olan bir yeteneğin tüketiciye küçültülmüş hali gibi duruyor. Yine de salt okunur başlamak, para taşıyan bir özellik için doğru temkinli adım; hata payının yüksek olduğu bir alanda önce "göster", sonra "yapmasına izin ver" sırasını izlemek mantıklı bir mühendislik tercihi.

Claude'un bu tür kişisel verileri nasıl hatırladığını ve sakladığını daha geniş çerçevede [AI asistanlarının sizi nasıl hatırladığını anlattığımız yazıda](/tr/posts/ai-asistanlari-seni-nasil-hatirliyor) ele alıyoruz; Personal Finance de aynı hatırlama/gizlilik dengesinin bir uzantısı.

## Sıkça Sorulan Sorular

### Claude Personal Finance ücretsiz mi?

Hayır. Kasım 2026 itibarıyla özellik yalnızca ABD'deki Pro, Max ve Ultra abonelerine açık; Free planında bulunmuyor ve ABD dışındaki hesaplara henüz gelmedi.

### Claude bankamdaki parayı hareket ettirebilir mi?

Hayır. Özellik tamamen salt okunur; Claude para transferi yapamaz, yatırım emri veremez, hesap açamaz. Sadece bağladığınız hesapların işlem geçmişini okuyup özetler.

### Banka şifremi Claude'a mı veriyorum?

Hayır. Bağlantı Plaid üzerinden kurulur ve siz doğrudan bankanızın kendi giriş ekranında kimlik doğrulaması yaparsınız; Claude ya da Anthropic banka şifrenizi hiç görmez.

### Bağlantıyı daha sonra kaldırabilir miyim?

Evet. Web ve masaüstünde Connectors menüsünden bağlantıyı istediğiniz an kaldırabilirsiniz; bu işlem Claude'un o hesaba erişimini tamamen sonlandırır. Mobilde ayrıca her okuma isteği için ayrı onay isteyebilirsiniz, bu da paylaşılan cihazlarda ek bir güvenlik katmanı sağlıyor. Bağlantıyı kaldırmak, Claude'un o hesaba dair daha önce okuduğu geçmiş verileri de sohbet dışında tutmaya devam ediyor; yeniden bağlanmadan önceki özetlere erişim olmuyor, yani bağlantıyı kesmek gerçek bir "sıfırlama" anlamına geliyor, sadece görünümü gizlemek değil.
