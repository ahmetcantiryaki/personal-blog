---
title: "Yapay Zeka Token Harcamasını Nasıl Görünür Kılarsınız?"
slug: "yapay-zeka-finops-token-harcamasi"
translationKey: "ai-finops-token-spend-2026"
locale: "tr"
excerpt: "Kısa cevap: her LLM çağrısını bir ağ geçidinden geçirip takım ve özellik etiketiyle ölçün. FinOps ekiplerinin %98'i AI harcamasını izliyor, %73'ü bütçe aşıyor."
category: "devops-cloud"
tags: ["finops", "cost-optimization", "llm", "observability", "devops"]
publishedAt: "2026-10-06"
seoTitle: "Yapay Zeka FinOps: Token Harcamasını Görünür Kılma"
seoDescription: "Yapay zeka token harcamasını takım ve özellik bazında görünür kılmak için LLM gateway üzerinden etiketleme ve ölçümleme nasıl kurulur, rehberde anlatıyoruz."
---

Kısa cevap: her LLM çağrısını merkezi bir gateway üzerinden geçirin ve çağrıyı başlatan takımı, özelliği ve kullanıcıyı etiketleyin. 2026 itibarıyla FinOps ekiplerinin %98'i AI harcamasını takip ediyor — 2024'teki %31'den büyük bir sıçrama — ama bu görünürlüğe rağmen AI projelerinin %73'ü hâlâ bütçeyi aşıyor.

## Yapay zeka harcaması neden klasik FinOps'tan kaçıyor?

Çünkü bulut faturası satır satır gelirken, LLM faturası genelde tek bir toplam rakam olarak geliyor. Yönetilen bir API'ye (OpenAI, Anthropic, Google) istek attığınızda, hangi takımın, hangi özelliğin, hangi kullanıcı segmentinin o çağrıyı tetiklediğine dair hiçbir satır öğesi yok — sadece aylık toplam fatura var. Klasik cloud FinOps, kaynak etiketleme (tagging) üzerine kurulu; sanal makineyi, veritabanını, depolama kovasını etiketleyip maliyeti geri dağıtırsınız. Token tüketiminde bu etiketleme altyapısı genelde hiç kurulmamış oluyor.

Rakamlar bu görünmezliğin bedelini gösteriyor. Goldman Sachs, küresel token kullanımının 2026'dan 2030'a kadar 24 kat artarak ayda 120 katrilyon tokene ulaşacağını öngörüyor; bu artışın asıl itici gücü agentic AI benimsenmesi. Ramp'in verilerine göre kurumsal ortalama aylık AI token harcaması, Ocak 2025'ten bu yana 13 kat arttı. Hacim bu kadar hızlı büyürken, hangi takımın ne kadar harcadığını bilmemek artık lüks değil, doğrudan bütçe riski.

| Metrik | Değer | Kaynak |
|---|---|---|
| AI harcamasını takip eden FinOps ekibi | %98 (2024'te %31) | FinOps Foundation |
| Bütçeyi aşan AI projesi oranı | %73 | Sektör raporları, 2026 |
| Küresel token kullanımı artışı (2026-2030) | 24 kat, aylık 120 katrilyon tokene | Goldman Sachs |
| Kurumsal aylık AI token harcaması artışı (Oca 2025'ten beri) | 13 kat | Ramp |

Bu büyüme oranları, sorunu "bir gün çözeriz" diyerek ertelenebilecek bir konu olmaktan çıkarıyor. Bir ekip altı ay önce 2.000 dolarlık aylık bir LLM faturasını göz ardı edebiliyordu; aynı ekip bugün aynı büyüme eğrisiyle 26.000 dolara ulaşmış bir faturayla karşılaşabilir, çünkü token tüketimi doğrusal değil katlanarak büyüyor. Görünürlük altyapısını kurmanın maliyeti, bir ay boyunca nereye harcandığını bilmeden ödenen faturanın maliyetinden çok daha düşük.

## Çağrıları takım ve özelliğe göre nasıl etiketlersiniz?

Pratik çözüm, her LLM çağrısını doğrudan sağlayıcıya değil, önce bir LLM gateway'e (LiteLLM, Portkey, kendi yazdığınız bir proxy) göndermek. Gateway her isteğe üç şeyi ekliyor: çağrıyı başlatan takımın kimliği, hangi özellik/endpoint olduğu ve varsa son kullanıcı kimliği. Bu üç etiket, sağlayıcının döndürdüğü token sayısıyla birleştiğinde, maliyeti geri dağıtabileceğiniz bir veri seti oluşturuyor.

```python
response = gateway.chat.completions.create(
    model="claude-sonnet-5-5",
    messages=messages,
    metadata={
        "team": "search-ranking",
        "feature": "query-rewrite",
        "user_id": user.id,
    },
)
```

Bu metadata, gateway'in loglarında saklanıyor ve günlük bir toplulaştırma işiyle (örneğin bir cron job) takım/özellik bazında maliyet tablosuna dönüşüyor. [LLM token maliyetini düşürme](/tr/posts/llm-token-maliyetini-dusurme) yazımızda ele aldığımız önbellekleme ve prompt kısaltma teknikleri, bu görünürlük kurulduktan sonra çok daha anlamlı hâle geliyor — çünkü artık hangi takımın optimizasyona en çok ihtiyacı olduğunu biliyorsunuz.

## Birim ekonomisi nasıl ölçülür?

Toplam harcama tek başına anlamsız; onu bir iş birimine bölmeniz gerekiyor. İki metrik çoğu ekibe yetiyor: istek başına maliyet ve aktif kullanıcı başına maliyet. İlki bir özelliğin ne kadar pahalı olduğunu, ikincisi ürünün ölçeklendiğinde maliyetin nasıl büyüyeceğini gösteriyor.

| Metrik | Nasıl hesaplanır | Ne zaman uyarı verir |
|---|---|---|
| İstek başına maliyet | Toplam token maliyeti / istek sayısı | Yeni bir prompt sürümünden sonra aniden yükselirse |
| Aktif kullanıcı başına maliyet | Toplam token maliyeti / aylık aktif kullanıcı | Kullanıcı başına maliyet, gelir başına maliyetin üstüne çıkarsa |
| Özellik başına marj etkisi | (Özellik geliri - özellik AI maliyeti) / özellik geliri | Marj, ürünün genel hedef marjının altına düşerse |

Bu metrikleri haftalık bir pano üzerinden takip edin ve ani sıçramaları (örneğin bir prompt değişikliğinin token sayısını ikiye katlaması) hemen görün. Pratikte bu panoyu kurmak genelde gateway loglarını bir veri ambarına (BigQuery, Snowflake) günlük olarak aktarıp, üzerine basit bir SQL sorgusuyla takım/gün kırılımlı bir görünüm oluşturmak kadar basit; ayrı bir analitik platformuna ihtiyacınız yok, zaten sahip olduğunuz BI aracı yeterli. [GPU maliyetlerini AI iş yüklerinde kontrol etme](/tr/posts/ai-is-yuku-gpu-maliyet-kontrol) yazımızda ele aldığımız altyapı tarafı maliyet kontrolü ile bu uygulama tarafı token ölçümü birbirini tamamlıyor — biri çıkarım altyapısının maliyetini, diğeri her bir özelliğin o altyapıyı ne kadar tükettiğini gösteriyor.

## Harcamayı üretkenliğe nasıl bağlarsınız?

Buradaki asıl zorluk, maliyeti çıktıyla değil sonuçla eşleştirmek. "Destek ekibi ayda 40.000 dolar token harcıyor" tek başına bir anlam ifade etmiyor; "destek ekibi, 40.000 dolar harcayarak ortalama çözüm süresini 12 dakikadan 7 dakikaya indirdi" anlamlı. Bunu ölçmek için AI harcamasını, o özelliğin zaten takip ettiğiniz iş metriğiyle (çözüm süresi, dönüşüm oranı, churn) aynı panoda yan yana koyun. Ayrı panolarda tutulan iki rakam asla karşılaştırılmaz.

Bütçe ve koruma mekanizmaları da bu noktada devreye giriyor. Gateway seviyesinde takım başına aylık bir token bütçesi tanımlayın; bütçenin %80'ine ulaşıldığında bir uyarı, %100'üne ulaşıldığında ise (kritik olmayan özellikler için) isteklerin reddedilmesi ya da daha ucuz bir modele düşürülmesi mantıklı bir koruma. [Girişimde AI maliyetini kontrol etme](/tr/posts/girisimde-ai-maliyetini-kontrol-et) yazımızda küçük ekipler için bu bütçeleme mantığını daha ayrıntılı işledik.

Burada bir seçim yapmanız gerekiyor: showback mı, chargeback mı? Showback, her takıma kendi harcamasını gösterir ama fatura o takıma gerçekten kesilmez — amaç farkındalık yaratmaktır. Chargeback ise harcamayı takımın kendi bütçesinden gerçekten düşer; bu da takımları maliyeti optimize etmeye çok daha güçlü şekilde teşvik eder ama finans süreçlerini de karmaşıklaştırır. Çoğu ekip showback ile başlayıp, veri güvenilir hâle geldikten sonra en çok harcayan birkaç takım için chargeback'e geçiyor.

Uyarı mekanizmasını kurarken tek bir eşik yeterli değil: ani bir sıçramayı (bir önceki haftaya göre %50 artış) bütçe aşımından ayrı bir kural olarak izleyin. Bütçe aşımı yavaş yavaş birikir ve ay sonuna doğru fark edilir; ani sıçrama ise genelde bir kod değişikliğinin (örneğin bir prompt'un artık her istekte tüm konuşma geçmişini gönderdiği bir regresyon) belirtisidir ve saatler içinde yakalanmazsa aynı günde binlerce dolara mal olabilir.

Açıkçası bence AI FinOps'un en büyük hatası, onu bir maliyet kesme projesi gibi ele almak. Asıl amaç harcamayı sıfıra indirmek değil, hangi harcamanın karşılığını aldığını görünür kılmak; bazen doğru cevap daha fazla harcamaktır, yeter ki hangi özelliğin buna değdiğini biliyorsanız. Bu görünürlüğü LLM çağrılarının her adımında izlemek istiyorsanız, [OpenTelemetry ile LLM çağrısı izleme](/tr/posts/opentelemetry-ile-llm-cagrisi-izleme) yazımız token sayımını trace seviyesinde nasıl yakalayacağınızı anlatıyor. Diğer maliyet optimizasyonu yazıları için [DevOps & Bulut kategorimize](/tr/category/devops-bulut) göz atabilirsiniz.

## Sıkça Sorulan Sorular

### AI token harcamasını takip eden şirket oranı nedir?

FinOps Foundation'a göre 2026 itibarıyla FinOps ekiplerinin %98'i AI harcamasını yönetiyor; bu oran 2024'te %31'di. Buna rağmen AI projelerinin %73'ü hâlâ bütçeyi aşıyor çünkü takip etmek, harcamayı takım ve özellik düzeyinde görünür kılmaktan farklı bir şey.

### LLM çağrılarını takım bazında nasıl etiketlerim?

Çağrıları doğrudan sağlayıcıya değil bir LLM gateway'e (LiteLLM, Portkey veya kendi proxy'niz) gönderin ve her isteğe takım, özellik ve kullanıcı kimliğini metadata olarak ekleyin. Gateway logları, günlük bir toplulaştırma işiyle takım bazında maliyet tablosuna dönüşür.

### Birim ekonomisi için hangi iki metrik yeterli?

İstek başına maliyet ve aylık aktif kullanıcı başına maliyet. İlki bir özelliğin pahalılığını, ikincisi ürün büyüdükçe maliyetin nasıl ölçekleneceğini gösterir.

### Token bütçesi aşıldığında ne yapılmalı?

Gateway seviyesinde takım başına aylık bütçe tanımlayın; %80'de uyarı, %100'de kritik olmayan özellikler için isteği reddetme ya da daha ucuz bir modele düşürme mantıklı bir koruma mekanizmasıdır.
