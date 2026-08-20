---
title: "Claude Files API GA'ya Geçti: Ne Değişti?"
slug: "claude-files-api-ga-ne-anlama-geliyor"
translationKey: "claude-files-api-ga"
locale: "tr"
excerpt: "Claude Files API, 19 Ağustos 2026'da GA'ya ulaştı: beta başlığı artık gerekmiyor, süre expires_in_seconds ile belirlenip page/next_page ile listeleniyor."
category: "ai"
tags: ["claude", "api-design", "ai-tools", "llm"]
publishedAt: "2026-08-20"
seoTitle: "Claude Files API GA: Beta Başlığı Gerekli mi?"
seoDescription: "Claude Files API, 19 Ağustos 2026'da GA'ya ulaştı: beta başlığı artık gerekmez, süre expires_in_seconds ile belirlenir, listeleme page/next_page kullanır."
---

Anthropic, Claude Files API'yi 19 Ağustos 2026 itibarıyla beta aşamasından çıkarıp genel kullanıma (GA) açtı. Artık `/v1/files` uç noktalarına ve dosya referanslı Messages API isteklerine `anthropic-beta: files-api-2025-04-14` başlığını eklemeden erişebilirsiniz; başlığı hâlâ gönderen mevcut entegrasyonlar da değişiklik yapmadan çalışmaya devam eder.

## Files API GA'ya geçmeden önce beta'da neydi?

Files API, Nisan 2025'te beta olarak yayınlandı ve geliştiricilerin PDF, görsel ile metin dosyalarını önceden Anthropic sunucularına yükleyip sonraki Messages API çağrılarında `file_id` ile yeniden kullanmasını sağladı. Bu sayede aynı dosyayı her istekte yeniden base64 olarak göndermeye gerek kalmıyordu; özellikle RAG (retrieval-augmented generation) sistemlerinde ve kod çalıştırma (code execution) aracıyla çalışırken aynı doküman birçok turda tekrar tekrar okunuyordu, bu da hem bant genişliği hem de gecikme açısından maliyetliydi.

Beta dönemi boyunca bu uç noktalara erişmek için isteklere `anthropic-beta: files-api-2025-04-14` başlığını eklemek zorunluydu; başlık olmadan gönderilen istekler kabul edilmiyordu. Ağustos 2026'daki GA duyurusu bu zorunluluğu kaldırdı ve Files API'yi Claude Developer Platform'un kalıcı, resmi bir parçası hâline getirdi.

## Beta başlığını kaldırmazsam entegrasyonum bozulur mu?

Hayır, mevcut kodunuz hiçbir değişiklik yapmadan çalışmaya devam eder. Anthropic bu geçişi geriye dönük uyumlu tasarladı: isteklerinize hâlâ `anthropic-beta: files-api-2025-04-14` başlığını eklerseniz, API eski beta yanıt formatını döndürmeye devam eder.

Başlığı kaldırdığınızda ise otomatik olarak yeni GA yanıt formatına geçersiniz. Bu, zorunlu bir kırılma (breaking change) değil, kendi zamanlamanızda uygulayabileceğiniz yumuşak bir geçiş anlamına geliyor. Yine de üretim kodunuzda iki farklı yanıt şeklini aynı anda yönetmemek için, testlerinizi tamamladıktan sonra başlığı kaldırıp tek bir formata geçmeniz önerilir.

## GA yanıt formatında tam olarak ne değişti?

En büyük fark, dosya süresinin nasıl belirlendiği ve raporlandığı noktasında. Beta formatında dosya süresi farklı alanlar üzerinden dolaylı yollarla yönetiliyordu; GA formatında ise yükleme sırasında `expires_in_seconds` parametresini gönderiyorsunuz ve API, dosya nesnesinde bu süreye karşılık gelen kesin `expires_at` zaman damgasını döndürüyor.

Ayrıca dosya listeleme uç noktası da değişti: eski beta sayfalama parametreleri yerine artık `page` ve `next_page` alanlarıyla sayfalama yapılıyor, buna ek olarak belirli dosya kimliklerini filtrelemek için `ids[]` parametresi eklendi. Aşağıdaki tablo iki formatı yan yana karşılaştırıyor.

| Alan | Beta format | GA format |
|---|---|---|
| Başlık gereksinimi | `anthropic-beta: files-api-2025-04-14` zorunlu | Başlık opsiyonel |
| Süre belirleme | Dolaylı, farklı alanlar üzerinden | Yüklemede `expires_in_seconds` |
| Süre bilgisi | Eski alan adları | Dosya nesnesinde `expires_at` |
| Listeleme sayfalaması | Eski beta sayfalama parametreleri | `page` ve `next_page` |
| Belirli dosyaları filtreleme | Yok | `ids[]` parametresi |
| Depolama limiti | Belirtilmemiş | 1 TB / organizasyon |
| Hız limiti | Belirtilmemiş | 500 istek/dakika |

Bu tablodaki en pratik değişiklik `expires_in_seconds`: artık dosyanın ne zaman sona ereceğini yükleme anında açıkça kontrol edebiliyorsunuz, örtük bir varsayılana güvenmenize gerek kalmıyor.

## Depolama ve hız limitleri ne kadar?

Ağustos 2026 itibarıyla Files API, organizasyon başına 1 TB depolama ve dakikada 500 istek hız limitiyle çalışıyor. 1 TB'lık limit organizasyonun süresi dolmamış tüm yüklenmiş dosyalarının toplam boyutunu kapsıyor, tek bir API anahtarına değil; yani aynı organizasyondaki birden fazla proje veya ekip bu depolama alanını paylaşıyor.

Dakikada 500 istek limiti ise yükleme, listeleme, alma (retrieve) ve silme dahil tüm `/v1/files` çağrılarını kapsıyor. Yoğun toplu işleme (batch) senaryolarında bu limite yaklaşıyorsanız, dosyaları önceden yükleyip `file_id` değerlerini önbelleğe alarak gereksiz tekrar yüklemeleri azaltmak mantıklı bir strateji.

Bu iki sayı da Ağustos 2026 öncesinde resmi olarak belgelenmemişti; GA duyurusuyla birlikte netleşmiş olmaları, kapasite planlaması yapan ekipler için önemli bir fark. Özellikle çok sayıda küçük dosya yerine az sayıda büyük dosya yükleyen mimarilerde, 1 TB'lık limitin ne kadar hızlı dolacağını önceden hesaplamak artık mümkün.

## Kodumdan beta başlığını nasıl kaldırırım?

Geçiş, çoğu entegrasyon için tek satırlık bir değişiklik: isteğinizden `anthropic-beta` başlığını çıkarıp yükleme çağrınıza `expires_in_seconds` eklemeniz, listeleme çağrınızı da yeni `page`/`next_page` mantığına uyarlamanız yeterli.

```bash
# Dosya yükleme (GA, beta başlığı yok)
curl https://api.anthropic.com/v1/files \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -F "file=@rapor.pdf" \
  -F "expires_in_seconds=86400"

# Dosyaları sayfalayarak listeleme (GA)
curl "https://api.anthropic.com/v1/files?page=1&ids[]=file_abc123" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01"
```

Bu değişikliği yapmadan önce, dosya süresini veya sayfalama sonuçlarını doğrudan ayrıştıran kod satırlarınızı gözden geçirin; alan adları değiştiği için sessizce yanlış değer okuma riski var. Files API'yi RAG boru hatlarınızda kullanıyorsanız, [RAG sistemi nasıl kurulur](/tr/posts/rag-sistemi-nasil-kurulur) yazımızdaki dosya yönetimi bölümünü de gözden geçirmenizi öneririm.

## Aynı hafta Claude platformunda başka neler GA'ya geçti?

19 Ağustos 2026'da Files API'yle aynı gün, Claude Enterprise (claude.ai) organizasyonları için Admin API'nin kullanıcı yönetimi uç noktaları da (üyeler, davetler, gruplar, özel roller) GA'ya ulaştı; `anthropic-beta: ce-user-management-2026-07-13` başlığı artık zorunlu değil ve eski başlıklı istekler de değişmeden çalışıyor.

Bir gün sonra, 20 Ağustos 2026'da yayınlanan Claude Code 2.1.237 sürümü, özel bir ağ geçidi veya taban URL kullanan oturumlarda prompt önbellekleme hatasını düzeltti ve `/config` altında ön açıklamaları atlayan yeni bir "Concise" çıktı stili ekledi. Bir gün önceki 2.1.236 sürümü ise yeni oturumların hangi modelle başlayacağını belirleyen `ANTHROPIC_DEFAULT_MODEL` ortam değişkenini ve oturumlar arası boşta bildirim özelliği `notify_when_idle`'ı tanıttı.

Bu değişikliklerin detayına girmiyoruz çünkü bu yazının odağı Files API, ancak [Claude Code subagent ve arka plan ajanları](/tr/posts/claude-code-subagent-arka-plan-ajanlari) ile [Claude Code auto mode nasıl çalışır](/tr/posts/claude-code-auto-mode-nasil-calisir) yazılarımız bu araçları daha ayrıntılı ele alıyor. Files API'nin Claude Developer Platform'daki yerini daha geniş bağlamda görmek isterseniz [Model Context Protocol nedir](/tr/posts/model-context-protocol-nedir) yazısı da faydalı bir referans.

## Sıkça Sorulan Sorular

### Files API GA'ya geçince yüklediğim dosyalar otomatik siliniyor mu?

Hayır, GA'ya geçiş dosyalarınızı silmez; `expires_in_seconds` sadece yeni yüklemeler için süre belirleme şeklini değiştiriyor. Bir dosya için süre belirtmezseniz ya da beta başlığıyla eski davranışı kullanmaya devam ederseniz, önceki sona erme kurallarınız geçerliliğini korur. Dosyanın kesin sona erme zamanını görmek için GA formatındaki `expires_at` alanını kontrol edebilirsiniz.

### expires_in_seconds parametresini göndermek zorunlu mu?

Hayır, zorunlu değil; parametreyi göndermezseniz dosya varsayılan süre davranışıyla yüklenir. Ancak dosyanın ne zaman geçersiz olacağını kod seviyesinde kontrol etmek istiyorsanız, GA formatında bunu açıkça belirlemenin tek yolu yükleme isteğine `expires_in_seconds` eklemek. Bu, özellikle kısa ömürlü geçici dosyalarla çalışırken depolama limitinizi daha sıkı yönetmenizi sağlar.

### Beta başlığı ne zaman tamamen kaldırılacak, geçişi ertelemek riskli mi?

Anthropic şu an için beta başlıklı isteklere destek vermeye devam ediyor ve resmi olarak bir kaldırma tarihi açıklamadı. Bu geriye dönük uyumluluk penceresi, üretim ortamında test etmeden aceleyle değişiklik yapmak istemeyen ekipler için gerçekten cömert bir yaklaşım. Buna rağmen bunu sonsuz bir erteleme hakkı gibi okumak hataya açık: beta başlıkları genelde kalıcı değil ve ileride bir yayından kaldırma duyurusu gelme ihtimali her zaman var. Geçişi bu ay planlayıp test ortamınızda doğrulamak, son dakikada kırılma riskiyle karşılaşmaktan daha güvenli.

### Files API'yi RAG veya kod çalıştırma dışında hangi senaryolarda kullanmalıyım?

Files API, Messages API isteklerine PDF, görsel ve doküman eklemek istediğiniz her senaryoda kullanışlı; aynı dosyayı birden fazla konuşmada tekrar tekrar yüklemek yerine bir kez yükleyip `file_id` ile referans verirsiniz. Doküman ağırlıklı ajan iş yükleri, sözleşme analizi, çok sayfalı rapor özetleme ve kod çalıştırma aracına girdi dosyası sağlama bunun tipik örnekleri. RAG sistemi kuruyorsanız, dosya yükleme adımını mimarinize nasıl entegre edeceğinizi [RAG sistemi nasıl kurulur](/tr/posts/rag-sistemi-nasil-kurulur) yazımızda bulabilirsiniz.
