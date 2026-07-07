---
title: "AI Ajan Belleği: Kısa ve Uzun Vadeli"
slug: "ai-ajan-bellegi-sistemleri"
translationKey: "ai-agent-memory-systems"
locale: "tr"
excerpt: "Bir kodlama ajanının scratchpad'i dolar, context tahliye edilir ve önemli tek karar kaybolur. Bunu önleyen bellek taksonomisi ve kalıcılık için bir karar ağacı."
category: "ai"
tags: ["ai-agents", "vector-database", "software-architecture", "reliability"]
publishedAt: "2026-07-07"
seoTitle: "AI Ajan Belleği: Kısa ve Uzun Vadeli"
seoDescription: "Context tahliye edildiğinde bir kodlama ajanı bir saat önce verdiği kararı unutur. Bunu önleyen bellek taksonomisi ve kalıcılık için bir karar ağacı."
---

Çok dosyalı bir migrasyonun birinci saatinde ajan bir adlandırma çakışmasıyla karşılaştı ve bir karar verdi: eski alan adını veritabanı katmanında koru, yalnızca API sınırında yeniden adlandır. Çalışmaya devam etti, dosyaları düzenlemeye devam etti, testleri geçmeye devam etti. Doksan dakika sonra aynı çakışmayı tam tersi yönde "düzeltti" ve kendi önceki kararını sessizce geri aldı. Hiçbir şey çökmedi. Hiçbir hata fırlatılmadı. Karar basitçe artık hiçbir yerde değildi.

## Gerçekte ne oldu

Ajanın çalışma context'i — scratchpad'i — dosya diff'leriyle, test çıktısıyla ve araç çağrılarıyla dolmuştu ve bir tahliye geçişinde, adlandırma kararına dair düz metin not, "eski, artık gerekmeyen bilgi" gibi görünen her şeyle birlikte dışarı itildi. Bu yazının konusu tam olarak bu hata modu: kötü akıl yürüten bir model değil, unutulması güvenli context ile hayatta kalması gereken bir kararı hiç ayırt etmemiş bir bellek sistemi. [Anthropic'in context yönetimi çerçevesi](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) tahliye ve önbellekleme'yi tam da bu tür sessiz veri kaybının yaşandığı yerler oldukları için temel kalıplar olarak adlandırıyor — yanlış yaparsanız ajan yüksek sesle değil, sessizce ve kendinden emin biçimde başarısız olur.

## Bunu yakalayacak bellek taksonomisi

2026'da üretim ajan belleği kabaca dört katmanda birleşti; her birinin farklı bir saklama politikası ve farklı bir arka uç deposu var.

| Katman | Ne tutar | Tipik saklama süresi | Yaygın arka uç deposu |
|---|---|---|---|
| Çalışma / kısa vadeli | Güncel görev durumu, aktif plan, devam eden araç sonuçları | Oturum kapsamlı, tamamlanınca temizlenir | Bellek içi ya da hızlı önbellek (Redis benzeri) |
| Epizodik | Belirli bir geçmiş oturumda ne olduğu — verilen kararlar, gözlenen sonuçlar | Günlerden aylara, genelde zamanla özetlenir | Benzerlik aramasına ayarlanmış vektör deposu |
| Semantik / uzun vadeli | Birçok oturumdan damıtılmış, doğrulanmış, genelleştirilmiş bilgi | Açıkça geçersiz kılınana kadar süresiz | Vektör ya da graf deposu, küratörlü |
| Araç belleği | Hangi araçların var olduğu, şemaları ve öğrenilmiş kullanım örüntüleri | Araçlar değiştikçe güncellenir | Yapılandırılmış depo, sürümlenmiş |

Örneğimizdeki adlandırma-çakışması kararı, verildiği an epizodik belleğe ait olmalıydı — doğduğu çalışma context'inden daha uzun yaşaması gereken küçük, kalıcı bir gerçek ("eski ad DB katmanında korundu, API sınırında yeniden adlandırıldı"). Bunun yerine yalnızca scratchpad'de yaşadı; ki bu tam olarak atılabilir olacak şekilde tasarlanmış katmandır.

## Vektör depoları, özetler ve anahtar-değer durumu birbirinin yerine geçmez

Her şey için bir vektör veritabanına yönelme içgüdüsü anlaşılır — semantik arama genel amaçlı bir çözüm gibi hissettirir — ama bizim örneğimizdeki gibi bir karar için yanlış varsayılandır. Bir vektör deposu *benzerlik* erişimi için inşa edilmiştir: bir sorgu verildiğinde en ilgili geçmiş içeriği bulmak. "Eski alan adını koru" gibi ayrık bir karar, benzerliğe göre olasılıksal biçimde geri getirilmesini istediğiniz bir şey değildir; ilgili dosyaya her dokunulduğunda deterministik biçimde geri getirilmesini istersiniz. Bu bir vektör-arama sorunu değil, anahtar-değer ya da yapılandırılmış-durum sorunudur.

2026 itibarıyla üretim sistemlerinde birleşilen kalıp tek bir depo değil, hibrittir: güncel görev için hızlı bir bellek-içi katman, epizodik ve semantik hatırlama için bir vektör ya da graf deposu, benzerlikle değil deterministik biçimde geri getirilmesi gereken gerçekler için küçük miktarda yapılandırılmış anahtar-değer durumu. Özetler ikisinin arasında durur — uzun bir epizodik geçmişi bir miktar ayrıntıyı çok daha küçük bir ayak izi karşılığında feda ederek daha kısa bir anlatıya dönüştüren periyodik bir sıkıştırma geçişi. Çoğu ekibin mühendislik zamanını gerçekte harcadığı yer bir vektör veritabanı seçmek değil; tahliye politikasını ve yeniden sıralamayı öyle ayarlamaktır ki erişim yanlış anda eskimiş ya da alakasız anıları öne çıkarmasın.

## Tahliye ve sıkıştırma: aynı sorunun iki ucu

Yönetilmediğinde bellek sınırsız büyür ve eski, geçersiz kalmış içerik sonuçları kirlettikçe erişim kalitesi düşer — bu, hikâyemizdekinin tersi bir hata ama aynı eksik disiplinden kaynaklanıyor. İki mekanizma bunu farklı uçlardan ele alır:

- **Tahliye**, artık alakalı görülmeyen belleği aktif olarak kaldırır — genelde bir zaman aşımı, açık bir "görev tamamlandı" sinyali ya da yerini alan bir yazma üzerine.
- **Sıkıştırma** silmez; damıtır. Uzun bir epizodik iz, kalıcı gerçekleri koruyan ve adım adım ayrıntıyı bırakan kısa bir özete dönüşür.

Adlandırma-çakışması hatası, tahliyenin önce bir sıkıştırma adımı *olmadan* çalışmasının sonucudur — karar, önemli olan tek cümleye damıtılmak yerine toptan atılmıştır.

## Context'i zehirlemeyen erişim

Açıkça adlandırılmayı hak eden ikinci bir hata modu var: *çalışan* ama yanlış şeyi geri getiren erişim. Beş semantik olarak benzer ama güncelliğini yitirmiş geçmiş kararı, tek güncel ve doğru gerçekle birlikte döndüren bir bellek sistemi yalnızca token israf etmez — modeli aktif olarak kafası karışık bırakır, çünkü model artık hangisinin güncel olduğuna dair net bir sinyal olmadan çelişen anılar arasında hakemlik yapmak zorundadır. Zaman damgasıyla ağırlıklandırılmış yeniden sıralama (son anıları öne çıkarma), açık yerine geçme (yeni bir karar eskisini geçersiz kılar, onunla birlikte var olmaz) ve erişim adımında epizodik hatırlamayı semantik hatırlamadan ayrı tutmak, erişimi kendi gürültü kaynağı olmaktan alıkoyan üç korkuluktur. Bu, [context engineering rehberimizde](/tr/posts/ai-ajanlari-icin-context-engineering) token-bütçesi tarafından ele aldığımız aynı disiplin.

## Neyin kalıcı tutulacağına dair bir karar ağacı

Bir dahaki sefere bir ajan görev ortasında bir karar verdiğinde bunu şu adımlardan geçirin:

1. **Bu, mevcut oturumun ötesinde önemli olacak mı?** Hayır → çalışma belleğinde bırakın, doğal olarak tahliye olsun.
2. **Bu, benzerlikle mi yoksa deterministik olarak mı geri getirilecek bir şey?** Benzerlik → vektör destekli epizodik bellek. Deterministik → ilgili dosyaya, göreve ya da varlığa anahtarlanmış anahtar-değer durumu.
3. **Gelecekteki bir karar bununla çelişebilir mi?** Evet → yerini almayı açık hale getirin (yeni yazma eskisini geçersiz kılar), ikisinin depoda birlikte var olmasına izin vermeyin.
4. **Ham ayrıntıya sonra ihtiyaç var mı, yoksa yalnızca sonuca mı?** Yalnızca sonuç → kalıcı hale getirmeden önce sıkıştırın, tam izi ileri taşımayın.

Bunu daha geniş bir ajan mimarisi üzerine kuran ekiplerin [AI agent ile workflow karşılaştırmamızı](/tr/posts/ai-agent-mi-workflow-mu) da okuması iyi olur, çünkü ne kadar bellek altyapısına ihtiyaç duyacağınız büyük ölçüde yukarı akışta seçtiğiniz kalıba bağlıdır; [LLM token maliyetlerini düşürme rehberimiz](/tr/posts/llm-token-maliyetini-dusurme) ise atlamak istemeyeceğiniz erişim bütçesi tarafını ele alıyor.

## Sıkça Sorulan Sorular

### Her ajan için bir vektör veritabanına ihtiyacım var mı?

Hayır. Geçmiş oturumları hatırlamaya ihtiyacı olmayan tek-oturumluk bir ajan tamamen çalışma belleği üzerinde çalışabilir. Oturumlar *arası* hatırlamaya — epizodik ya da semantik belleğe — ihtiyaç duyduğunuzda bir vektör ya da graf deposuna yönelin, öncesinde değil.

### Bu neden ajan araç ekosisteminin en hızlı büyüyen parçası olarak tanımlanıyor?

Büyüme, çekirdek işlem hattında değil entegrasyon yüzeyinde yoğunlaşıyor — bellek çerçeveleri artık 20'den fazla vektör deposunu ve 20'den fazla çerçeve entegrasyonunu kapsıyor, çünkü tek bir ajan çerçevesi kazanmadı ve ekiplerin standartlaştıkları çerçeveden bağımsız çalışan bellek katmanlarına ihtiyacı var.

### Tahliye ile sıkıştırma arasındaki fark nedir?

Tahliye, bir zaman aşımına ya da açık bir sinyale dayanarak belleği doğrudan kaldırır. Sıkıştırma ise silmek yerine damıtılmış bir versiyon korur — daha sonra önemli olabilecek her şey için daha güvenli varsayılandır, çünkü tahliye geri döndürülemezken sıkıştırma değildir.

### Bir ajanın eskimiş anıları geri getirmesini nasıl engellerim?

Erişim sıralamanızı zaman damgasıyla ağırlıklandırın, böylece son anılar varsayılan olarak eskilerin önüne geçsin ve yerini almayı açık hale getirin — yeni bir karar eskisinin yerini aldığında, ikisini de erişimin hakemlik yapmasına bırakmak yerine eskisini geçersiz olarak işaretleyin.
