---
title: "Gemini Deferred Katmanı: Yarı Fiyatına Async İşlem"
slug: "gemini-deferred-katmani-async"
translationKey: "gemini-deferred-tier-async-2026"
locale: "tr"
excerpt: "Kısa cevap: Deferred katmanı, acil olmayan ajan işlerinizi yoğun olmayan saatlere kaydırarak maliyeti en fazla %50 düşürür; karşılığında anlık yanıt almazsınız."
category: "ai"
tags: ["gemini", "cost-optimization", "ai-agents", "cloud"]
publishedAt: "2026-11-22"
seoTitle: "Gemini Deferred Katmanı Nedir, Ne Zaman Kullanılır?"
seoDescription: "Gemini Enterprise Agent Platform'un Deferred katmanı, acil olmayan işleri yoğun olmayan saatlere kaydırıp maliyeti düşürüyor. Ne zaman işe yaradığını anlatır."
---

Kısa cevap: Gemini Enterprise Agent Platform'un Deferred katmanı, gecikmeye duyarlı olmayan ajan işlerinizi otomatik olarak yoğun olmayan saatlere kaydırıyor ve bunun karşılığında çıkarım maliyetinizi en fazla %50 düşürebiliyor. Bedel basit: isteğiniz hemen değil, kapasite uygun olduğunda, bazen saatler sonra yanıtlanıyor.

[Google Cloud, bu katmanı](https://cloud.google.com/blog/products/ai-machine-learning/flexible-billing-and-cost-controls-for-agents-on-google-cloud) Gemini Enterprise Agent Platform'un esnek faturalandırma güncellemesiyle duyurdu; özellik şu anda Preview aşamasında. Mantığı şu: işletmeler, acil olmayan ajan işlerini yoğun olmayan saatlerde işlenmek üzere işaretleyebiliyor, bu da çıkarım maliyetini en fazla %50 düşürme potansiyeli taşıyor. Önemli ayrıntı, bu rakamın bir tavan olması — garanti edilen sabit bir indirim değil.

## "Deferred/async" ne anlama geliyor?

Deferred katmanında isteğiniz hemen işlenmiyor; sistem, isteğinizi kapasitenin uygun olduğu bir zamana, genellikle yoğun olmayan saatlere kadar beklemeye alıyor. İstek bu süre boyunca "devam ediyor" durumunda kalıyor; siz onu düzenli aralıklarla sorgulayarak tamamlanıp tamamlanmadığını kontrol ediyorsunuz. Bu, Standard PayGo katmanının "isteği gönder, hemen yanıt al" modelinin tam tersi.

Teknik olarak Deferred katmanını kullanmak için isteğinizde `service_tier="deferred"` parametresini (Python SDK'da) veya REST API isteğinde aynı alanı ayarlamanız gerekiyor; bu özellik şu an Deep Research Agent için destekleniyor. [Google'ın ADK dokümantasyonu](https://adk.dev/agents/models/google-gemini/deferred-schedule/), özelliğin yalnızca `use_interactions_api=True` ayarlı bir Gemini modeliyle çalıştığını ve streaming ile birleştirildiğinde HTTP 422 hatası döndürdüğünü belirtiyor — yani Deferred ve canlı akış aynı istekte bir arada olamaz.

## Hangi iş yükleri bu gecikmeyi tolere eder?

Deferred katmanının mantıklı olduğu iş yükleri, "şimdi mi yarın mı önemli değil, sonuç önemli" diyebileceğiniz işler:

- **Toplu özetleme**: Binlerce belgeyi gece boyunca özetleyip sabah hazır bir rapor almak.
- **Gece zenginleştirmesi (overnight enrichment)**: Bir veri tabanındaki kayıtları ek meta veriyle doldurmak, örneğin ürün açıklamalarını otomatik etiketlemek.
- **Değerlendirmeler (evals)**: Bir modelin yeni sürümünü binlerce test senaryosunda değerlendirmek; sonucun bir dakika içinde değil, sabaha kadar gelmesi yeterli.

Bunların ortak noktası: bir insan ekranda bekleyerek yanıtı beklemiyor. Bir kullanıcının gerçek zamanlı sohbet ettiği bir chatbot veya bir müşteri destek akışı, Deferred için doğru aday değil — oradaki gecikme doğrudan kullanıcı deneyimini bozar.

## Deferred, Standard'a göre ne kadar tasarruf ettiriyor?

| Katman | Yanıt modeli | Maliyet | En uygun iş yükü |
|---|---|---|---|
| Standard PayGo | Anında | Tam fiyat | Canlı sohbet, müşteri destek |
| Deferred (Preview) | Beklemeli, kapasiteye bağlı | En fazla %50 indirim (tavan, garanti değil) | Toplu özetleme, gece zenginleştirmesi, evals |
| 1 yıllık taahhüt | Anında | %10 indirim | Öngörülebilir, sürekli yük |
| 3 yıllık taahhüt | Anında | %20 indirim | Uzun vadeli, sabit kapasite |

Bu tablonun gösterdiği önemli nokta: Deferred'in %50 indirimi, taahhüt indirimlerinden (%10/%20) kavramsal olarak farklı. Taahhüt indirimi "önceden söz ver, indirim al" mantığıyla çalışırken, Deferred "ne zaman işleneceğine karışma, indirim al" mantığıyla çalışıyor. Bir analist bunu net bir şekilde özetliyor: bu çoğunlukla bir kaydırma, otomatik bir maliyet düşüşü değil — esnek fiyatlandırma, maliyeti kendiliğinden kesmiyor, sizin zamanlama esnekliği vermenizi gerektiriyor.

## Deferred bir işi gönderip sonucu nasıl alırım?

Aşağıdaki iskelet, bir işi Deferred katmanına gönderip periyodik olarak durumunu kontrol etmenin genel akışını gösteriyor:

```python
from google import genai

client = genai.Client()

# İşi deferred katmanına gönder
job = client.models.generate_content(
    model="gemini-3-pro",
    contents="Şu 500 belgeyi özetle...",
    config={"service_tier": "deferred"},
)

# Periyodik olarak durumu kontrol et (streaming değil, polling)
import time
while job.status not in ("completed", "failed"):
    time.sleep(60)
    job = client.operations.get(job.name)

print(job.result)
```

Buradaki kritik nokta `config={"service_tier": "deferred"}` satırı ve ardından gelen bekleme döngüsü; Deferred katmanında sonucu anında almayı beklememeniz, bunun yerine periyodik sorgulama yapmanız gerekiyor.

## Bu katmanı kullanırken nelere dikkat etmeli?

Üç pratik uyarı var. Birincisi, özellik henüz Preview aşamasında ve genel kullanıma açık değil; Google'ın bazı kaynakları, dağıtımın seçili iş yükleriyle sınırlı başlayacağını belirtiyor. İkincisi, %50 rakamı bir tavan; gerçek indirim iş yüküne ve zamana göre değişebilir, bütçe planlarken bunu kesin bir sayı gibi kullanmamak gerekiyor. Üçüncüsü, Deferred fiyatlandırmasının esnek tasarruf planıyla (Flexible Savings Plan) birikimli olarak birleştirilip birleştirilemeyeceği, [Gemini Enterprise Agent Platform'un güncel sürüm notlarında](https://docs.cloud.google.com/gemini-enterprise-agent-platform/release-notes) henüz netleşmemiş durumda.

Büyük bağlam penceresi gerektiren toplu işler için ayrıca şunu bilmek faydalı: Gemini'nin kurumsal modelleri zaten 1.048.576 token'a kadar bağlam penceresi destekliyor; bu, Deferred katmanına gönderdiğiniz tek bir işin binlerce sayfalık belgeyi aynı anda işleyebileceği anlamına geliyor. Bu, yeni bir Deferred özelliği değil, modelin mevcut bir özelliği, ama Deferred'in asenkron doğasıyla birleştiğinde gerçekten büyük toplu işleri tek seferde göndermeyi pratik hale getiriyor. Örneğin bin sayfalık bir sözleşme arşivini tek bir Deferred isteğiyle taratıp özetletmek, aynı işi parça parça Standard PayGo ile yapmaktan hem daha ucuz hem daha az karmaşık.

## Deferred'i hangi ajan mimarisine entegre etmeli?

Deferred katmanı en çok, zaten bir kuyruk sistemiyle çalışan ajan mimarilerine uyuyor. Örneğin bir müşteri geri bildirimi işleme hattınız varsa: canlı destek mesajları Standard PayGo üzerinden anında yanıtlanırken, aynı sistemin gece biriken geri bildirimleri toplu analiz etmesi gereken kısmı Deferred'e yönlendirilebilir. Bu, tek bir ajanın iki farklı katmanı aynı anda kullanması anlamına geliyor — kritik yol Standard'da, arka plan işi Deferred'de kalıyor. [İşi yapan AI araçlarını karşılaştırdığımız yazıda](/tr/posts/isi-yapan-ai-chatgpt-work-cowork-gemini) bahsettiğimiz "ajan iş akışı" kavramı burada tam karşılığını buluyor: aynı iş akışı içinde gecikmeye duyarlı ve duyarsız adımları ayrıştırmak, maliyeti düşürmenin en pratik yolu.

Pratikte bunu kurarken dikkat edilmesi gereken nokta, hangi adımın gerçekten gecikmeye duyarlı olduğunu doğru belirlemek. Bir adımı yanlışlıkla Deferred'e göndermek, kullanıcının saatlerce yanıt beklemesine yol açabilir; bu yüzden mimariyi tasarlarken "bu adımın sonucu ne zaman gerekiyor" sorusunu her adım için ayrı ayrı sormak gerekiyor.

## Standard PayGo'dan ne zaman vazgeçmemeli?

Açıkçası burada dikkat edilmesi gereken şey, "indirim var" diye her işi Deferred'e taşımaya çalışmamak. Bir [Gemini 3.6 Flash ile geliştirme](/tr/posts/gemini-3-6-flash-ile-gelistirme) örneğinde olduğu gibi, kullanıcıya doğrudan yanıt veren bir uygulama katmanında gecikme kabul edilemez; Deferred'in indirimi, yalnızca gecikmeyi gerçekten tolere edebilen arka plan işleri için anlamlı. [Gemini 3.8 Flash'in fiyatlandırmasını](/tr/posts/gemini-3-8-flash-nedir-fiyati-neden-artiyor) incelediğimiz yazıda da gördüğümüz gibi, Google'ın fiyatlandırma stratejisi artık tek bir sabit fiyat değil, kullanım örüntünüze göre değişen bir yelpaze sunuyor — Deferred bu yelpazenin en ucuz, en sabırlı ucu.

## Sıkça Sorulan Sorular

### Gemini Deferred katmanı şu anda kullanılabilir mi?

Özellik Preview aşamasında ve Deep Research Agent için destekleniyor. Google, dağıtımı başlangıçta seçili iş yükleriyle sınırlı tutacağını belirtiyor, bu yüzden genel kullanıma açılma tarihini kendi hesabınızdan kontrol etmeniz gerekiyor.

### Deferred katmanı gerçekten %50 indirim mi sağlıyor?

%50, Google'ın belirttiği bir tavan, garanti edilen sabit bir indirim değil. Gerçek indirim, iş yükünüze ve kapasite durumuna göre değişebilir; bütçe planlarken bunu en iyi senaryo olarak değerlendirmek daha güvenli.

### Deferred katmanını streaming ile birlikte kullanabilir miyim?

Hayır. Google'ın ADK dokümantasyonuna göre Deferred katmanını streaming ile birleştirmek HTTP 422 hatası döndürüyor; ikisi aynı istekte bir arada çalışmıyor.

### Hangi iş yükleri Deferred katmanı için uygun değil?

Kullanıcıya gerçek zamanlı yanıt veren her şey — canlı sohbet, müşteri destek akışları, etkileşimli araçlar — Deferred için uygun değil. Deferred, bir insanın ekranda beklemediği toplu özetleme, gece zenginleştirmesi ve değerlendirme gibi işler için tasarlandı; bu işlerde saniyeler değil saatler cinsinden gecikme kabul edilebilir.
