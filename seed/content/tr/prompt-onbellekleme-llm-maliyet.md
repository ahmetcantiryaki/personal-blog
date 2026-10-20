---
title: "Prompt Önbellekleme LLM Faturanı Nasıl Düşürür?"
slug: "prompt-onbellekleme-llm-maliyet"
translationKey: "prompt-caching-llm-cost-2026"
locale: "tr"
excerpt: "Kısa cevap: Prompt önbellekleme, isteğin değişmeyen başlangıcını saklar. Claude'da okuma maliyeti standardın %10'una, bazı modellerde %5'ine düşer."
category: "software-engineering"
tags: ["claude", "openai", "gemini", "llm", "cost-optimization"]
publishedAt: "2026-10-20"
seoTitle: "Prompt Önbellekleme: Claude, OpenAI, Gemini Karşılaştırması"
seoDescription: "Prompt cache nasıl çalışır, Claude/OpenAI/Gemini arasında fiyat ve TTL farkları ne, isabet oranını nasıl ölçersiniz ve hangi tuzaklara dikkat etmelisiniz?"
---

Kısa cevap: Prompt önbellekleme, bir isteğin baştaki değişmeyen kısmını (sistem promptu, araç tanımları, uzun bağlam) sağlayıcı tarafında saklar; aynı prefix'i tekrar gönderdiğinizde o kısmı yeniden işlemek yerine önbellekten okunur. Claude'da bu okuma, standart girdi fiyatının %10'una, Opus 5.5 ve Sonnet 5.5'te ise %5'ine kadar düşüyor.

## Prompt Önbellekleme Nasıl Çalışır?

Mekanik üç sağlayıcıda da benzer bir fikre dayanıyor: isteğinizin başındaki sabit kısmı (sistem promptu, uzun doküman, araç şemaları) bir kez işleyip sağlayıcının tarafında saklıyorsunuz, sonraki isteklerde bu kısmı yeniden hesaplamak yerine önbellekten okunuyor. Fark, bu önbelleğin nasıl tetiklendiğinde ve ne kadar sürdüğünde ortaya çıkıyor.

Anthropic'te önbellekleme açık bir işaretle (`cache_control`) tetikleniyor — siz isteğinizde hangi bloğun önbelleğe alınacağını belirtiyorsunuz. OpenAI'de mekanik tamamen otomatik: 1024 token'ı geçen her istek için en uzun eşleşen prefix otomatik olarak önbellekten okunuyor, herhangi bir ayar yapmanıza gerek yok. Gemini ise ikisinin ortası bir yapı sunuyor: 2.5 ve sonrası modellerde varsayılan olarak açık **implicit** (örtük) önbellekleme var, isteğe bağlı olarak manuel kontrol veren **explicit** (açık) önbellekleme de mevcut.

## Sağlayıcıya Göre Fiyat ve TTL Ne?

Aşağıdaki tablo, her sağlayıcının resmi dokümantasyonunda yer alan mekaniği özetliyor; kesin rakamlar model ve bölgeye göre değişebileceğinden üretim kararı vermeden önce ilgili sağlayıcının kendi fiyatlandırma sayfasını kontrol edin.

| Sağlayıcı | Yazma Maliyeti | Okuma Maliyeti | TTL |
|---|---|---|---|
| Claude (Anthropic) | 5 dk: standart girdinin 1,25 katı; 1 sa: 2 katı | Standardın %10'u (Opus 5.5 / Sonnet 5.5'te %5'i) | 5 dakika (varsayılan) veya 1 saat |
| OpenAI | Ek ücret yok, otomatik | Standart girdiden önemli ölçüde indirimli (resmi oran için güncel dokümana bakın) | Resmi olarak garanti edilmiyor, kısa süreli |
| Gemini (explicit) | Yazma standart girdi fiyatından, + saatlik depolama ücreti | Standarttan büyük ölçüde indirimli | Varsayılan olarak genelde 1 saat, siz ayarlarsınız |
| Gemini (implicit) | Ek ücret yok, otomatik | İsabet varsa indirimli, garanti yok | Sabit değil, bellek basıncına göre değişir |

Claude'daki yazma/okuma ayrımı burada kritik: önbelleği her **yazdığınızda** standart girdiden daha fazla ödüyorsunuz (1,25x ya da 2x), ama her **okuduğunuzda** çok daha az ödüyorsunuz (0,1x, bazı modellerde 0,05x). Yani kazanç, aynı prefix'i kaç kez yeniden kullandığınıza bağlı — bir kez yazıp bir kez okursanız kazanç yok, bir kez yazıp yirmi kez okursanız fatura büyük ölçüde düşüyor.

## Claude'un 2026 Okuma Fiyatı İndirimi Neydi?

Anthropic'in güncel fiyatlandırmasına göre önbellek okuma maliyeti çoğu modelde standart girdinin %10'u; ama Opus 5.5 ve Sonnet 5.5 modellerinde bu oran %5'e, Fable 5.1 ve Mythos 5.1'de ise %2,5'e kadar iniyor. Bu, aynı önbellek okuma hacmini daha ucuza sunan bir model-bazlı indirim — yoğun prompt cache kullanan bir uygulamayı bu modellere taşımak, yazma tarafında hiçbir değişiklik yapmadan okuma faturasını yarıya veya daha fazla indirebiliyor.

## Önbelleğe Dost Prompt Nasıl Yapılandırılır?

Kuralı tek cümlede özetlemek mümkün: **değişmeyen kısmı en başa, değişen kısmı en sona koyun.** Üç sağlayıcı da prefix eşleşmesine göre çalıştığı için, isteğinizin başında bir karakter bile değişirse o noktadan sonrası önbellek dışı kalır.

```text
[SABİT] Sistem promptu + araç tanımları + uzun doküman bağlamı
[SABİT] Önceki konuşma geçmişi (değişmiyorsa)
[DEĞİŞKEN] Kullanıcının bu turdaki son mesajı
```

Yaygın bir hata, zaman damgası veya oturum kimliği gibi küçük bir değişkeni sistem promptunun içine, en başa gömmek — bu, her istekte prefix'in tamamını geçersiz kılıp önbelleğin hiç tetiklenmemesine yol açıyor. Değişken veriyi her zaman isteğin en sonuna taşıyın.

## İsabet Oranını ve Tasarrufu Nasıl Ölçersiniz?

Her üç sağlayıcı da yanıtın kullanım (usage) alanında önbellek isabetini raporluyor: OpenAI `cached_tokens` alanını, Claude ve Gemini ise benzer bir ayrım sunan kendi usage alanlarını döndürüyor. Pratik ölçüm adımı şu: bir günlük üretim trafiğinde toplam girdi token'ının ne kadarının önbellekten okunduğunu toplayıp, bu miktarı standart fiyat ile önbellek okuma fiyatı arasındaki farkla çarpın — çıkan sayı, o gün önbellekleme sayesinde ödemediğiniz tutar. [Yapay zeka token harcamasını ekip bazında görünür kılma yazımızda](/tr/posts/yapay-zeka-finops-token-harcamasi) önerdiğimiz disiplin burada da geçerli: önbellek tasarrufu, tek bir toplam rakamın içinde kaybolmamalı, ekip veya endpoint bazında kendi satırında görünmeli.

## Hangi Tuzaklara Dikkat Etmelisiniz?

İki hata en sık tekrarlanıyor. Birincisi, **sıralama hatası**: önbelleğe alınacak bloğu isteğin ortasına ya da sonuna koymak, prefix eşleşmesini tamamen bozuyor — önbellek sadece baştan başlayan, kesintisiz bir eşleşmeyi tanıyor. İkincisi, **geçersiz kılma farkındalığı eksikliği**: bir dokümanı güncellediğinizde eski önbellek girdisi hâlâ TTL süresi dolmadıysa kullanılmaya devam edebilir; sistem promptunuzu veya araç tanımlarınızı değiştirdiğinizde bunun otomatik olarak yeni bir önbellek girdisi yaratacağını (ve kısa süre için yazma maliyetine katlanacağınızı) hesaba katmanız gerekiyor.

Claude'da birden fazla TTL'yi aynı istekte karıştırıyorsanız sıralama da önemli: 1 saatlik önbellek blokları, 5 dakikalık bloklardan önce gelmeli; aksi halde sağlayıcı isteği doğru şekilde parçalayamıyor.

Üçüncü bir tuzak, önbellek kapsamını yanlış varsaymak. OpenAI'de önbellek organizasyon seviyesinde paylaşılıyor — aynı organizasyondaki farklı uygulamalar aynı prefix'i kullanıyorsa birbirinin önbelleğinden yararlanabiliyor, ki bu çoklu takımlı bir şirkette beklenmedik bir tasarruf (veya beklenmedik bir fatura dağılımı) yaratabiliyor. Gemini'nin explicit önbelleğinde ise kapsam sizin oluşturduğunuz cache nesnesiyle sınırlı; başka bir istek aynı içeriği gönderse de siz o cache nesnesinin kimliğini (handle) açıkça referans vermediyseniz önbellek tetiklenmiyor.

## Önbelleklemeyi Ne Zaman Kurmaya Değer?

Önbellekleme her iş yüküne değmiyor. Tek seferlik, benzersiz isteklerde (her çağrının prefix'i farklıysa) yazma maliyetini karşılayacak kadar okuma olmaz ve toplam maliyet aslında artar. Değdiği durumlar: uzun bir sistem promptu veya doküman bağlamıyla çalışan, aynı prefix'i dakikalar içinde onlarca kez tekrar kullanan ajan döngüleri, çok turlu sohbet arayüzleri ve aynı araç şemasını her istekte gönderen fonksiyon çağırma sistemleri.

## Prompt Cache ile Claude Inline Tools Nasıl İlişkili?

Claude'un [inline tools özelliğini ele aldığımız yazıda](/tr/posts/claude-inline-tools-nedir) değindiğimiz gibi, bir konuşmaya yeni bir araç eklemek geleneksel olarak sistem promptunun başını değiştirip tüm önbelleği geçersiz kılıyordu. Inline tools, araç tanımlarını önbelleğe alınan prefix'in dışına taşıyarak bu sorunu çözüyor — prompt cache stratejinizi kurarken araç tanımlarının nerede durduğu, tek başına önbellek isabet oranınızı belirleyen bir faktör haline geliyor.

## Anlamsal Önbellekle Karıştırmayın

Prompt cache, [anlamsal önbellek yazımızda](/tr/posts/anlamsal-onbellek-ai-maliyet) ele aldığımız embedding tabanlı önbellekle sık karıştırılıyor ama ikisi farklı sorunları çözüyor: prompt cache **aynı isteğin tekrarlanan prefix'ini** ucuzlatıyor, model yine çalışıyor; anlamsal önbellek ise **farklı kullanıcıların benzer anlamlı sorularını** eşleştirip model çağrısını tamamen atlıyor. Üretim sisteminde ikisini birlikte kullanmak yaygın bir pratik — biri girdi maliyetini düşürürken diğeri çağrının kendisini ortadan kaldırıyor. Bu tür maliyet ve altyapı konularının geneli için [yazılım mühendisliği kategorimize](/tr/category/yazilim-muhendisligi) bakabilirsiniz.

## Sıkça Sorulan Sorular

### Prompt cache otomatik mi çalışır, yoksa kod değişikliği mi gerekir?

OpenAI'de tamamen otomatik, hiçbir ayar gerekmez. Claude'da `cache_control` parametresiyle hangi bloğun önbelleğe alınacağını açıkça belirtmeniz gerekiyor. Gemini'de implicit önbellekleme otomatik çalışırken, explicit önbellekleme manuel kurulum istiyor.

### Claude'da 5 dakikalık mı 1 saatlik TTL mi seçmeliyim?

Prefix'inizi beş dakikadan daha sık yeniden kullanıyorsanız varsayılan 5 dakikalık TTL yeterli ve daha ucuz. Prefix'i beş dakikadan az sıklıkta ama bir saatten daha sık yeniden kullanıyorsanız, daha yüksek yazma maliyetine rağmen 1 saatlik TTL toplamda daha ucuza gelir.

### Önbellek isabet oranımı nereden görürüm?

Her üç sağlayıcı da API yanıtının kullanım (usage) bölümünde önbellekten okunan token sayısını raporluyor — OpenAI'de `cached_tokens` alanı, Claude ve Gemini'de karşılık gelen usage alanları. Bu veriyi günlük toplayıp standart ve önbellek fiyat farkıyla çarparak gerçek tasarrufu hesaplayabilirsiniz.

### Sistem promptuma küçük bir değişiklik yapmak önbelleği bozar mı?

Evet. Önbellek, isteğin başındaki kesintisiz bir prefix eşleşmesine dayanıyor; sistem promptunun herhangi bir yerinde, hatta en küçük bir karakterde yapılan değişiklik o noktadan sonraki tüm önbelleği geçersiz kılıyor ve bir sonraki istek yeniden standart yazma maliyetiyle işleniyor.
