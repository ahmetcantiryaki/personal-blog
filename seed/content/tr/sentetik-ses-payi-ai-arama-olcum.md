---
title: "Sentetik Ses Payı: AI Aramada Görünürlüğünü Ölç"
slug: "sentetik-ses-payi-ai-arama-olcum"
translationKey: "synthetic-share-of-voice-2026"
locale: "tr"
excerpt: "Sentetik ses payı, AI asistanlarının markanı rakiplere göre ne sıklıkta ve hangi konumda andığını gösteren, haftalık takip edilebilen bir metriktir."
category: "digital-marketing"
tags: [seo, marketing-analytics, ai-tools, best-practices]
publishedAt: "2026-09-23"
seoTitle: "Sentetik Ses Payı: AI Aramada Görünürlüğünü Ölç"
seoDescription: "ChatGPT, Gemini ve Perplexity'de marka atıflarını haftalık prompt paneliyle ölçüp rakiplere göre sentetik ses payını nasıl takip edeceğini öğren."
---

Kısa cevap: Sentetik ses payı, ChatGPT, Gemini ve Perplexity gibi AI asistanlarının ilgili sorulara verdiği yanıtlarda markanı ne sıklıkta ve hangi pozisyonda andığını ölçen bir orandır; formülü (marka atıf sayısı / kategori toplam atıf sayısı) x 100'dür ve haftalık bir prompt paneliyle takip edilir.

## Sentetik ses payı nedir?

Sentetik ses payı (synthetic share of voice, kısaca SSP), bir markanın AI motorlarının ürettiği yanıtlarda ne kadar yer kapladığını sayısallaştıran bir metriktir. Terim, klasik pazarlamadaki "share of voice" kavramının AI arama dünyasına uyarlanmış hâlidir: reklam gösterimi veya organik sıralama yerine, ChatGPT'nin, Gemini'nin ve Perplexity'nin ürettiği cümlelerde markanın adı geçiyor mu, kaynak olarak gösteriliyor mu sorusuna bakar.

Ölçüm iki katmanda yapılır. Anılma tabanlı ölçüm markanın metin içinde bir varlık (entity) olarak geçip geçmediğine bakar; atıf tabanlı ölçüm ise markanın bağlantılı bir kaynak olarak gösterilip gösterilmediğine bakar. [Search Engine Land'in Eylül 2026 tarihli analizine göre](https://searchengineland.com/measure-brand-visibility-ai-search-464524) en iyi performans gösteren B2B SaaS markaları rakiplerinden 8,4 kat daha fazla AI atfı alıyor; bu da ölçümün artık isteğe bağlı değil, rekabet avantajının doğrudan göstergesi olduğu anlamına geliyor. Bu konuyu düzenli işlediğimiz [Dijital Pazarlama & SEO kategorimizde](/tr/category/dijital-pazarlama) benzer ölçüm yazıları bulabilirsin.

## Klasik arama sıralamaları neden yetersiz kalıyor?

Kısa cevap: Google'da birinci sırada olmak artık kullanıcıya ulaştığın anlamına gelmiyor, çünkü [AI özetleri tıklamaların büyük bölümünü kendi sayfasında tüketiyor](/tr/posts/ai-ozetleri-tiklama-hayatta-kalma) ve kullanıcı hiçbir zaman senin sitene gelmiyor.

2026 itibarıyla alıcıların yüzde 89'u tedarikçi araştırması yaparken ChatGPT veya Perplexity gibi üretken AI araçlarına başvuruyor. Bu kullanıcılar bir sıralama listesi görmüyor; tek bir sentezlenmiş yanıt görüyor ve o yanıtta adı geçen iki üç markadan birini seçiyor. Klasik sıralama araçları tıklama, gösterim ve pozisyon verisi toplarken AI motorları bu veriyi dışarı sızdırmıyor; bir markanın "10. sırada" olması artık anlamlı değil, çünkü sıralama diye bir şey yok, sadece anılma ya da anılmama var.

Bu, SEO'nun bittiği anlamına gelmiyor. AEO ve GEO kavramlarının SEO'dan nasıl ayrıştığını [AEO, SEO ve GEO farkı üzerine yazımızda](/tr/posts/aeo-seo-geo-farki-nedir) daha ayrıntılı ele aldık; kısacası klasik SEO hâlâ temel görünürlüğü sağlıyor, ama AI motorlarının hangi kaynağı seçtiğini ayrı bir metrikle izlemek gerekiyor.

## AI görünürlüğü pratikte nasıl ölçülür?

Kısa cevap: Gerçek kullanıcı sorularını temsil eden 20-50 promptluk sabit bir panel oluşturup bu promptları ChatGPT, Gemini ve Perplexity'de düzenli olarak çalıştırır, her yanıtta markanın ve rakiplerin anılıp anılmadığını, anıldıysa kaçıncı sırada göründüğünü kayıt altına alırsın.

Panel oluştururken üç prompt türü karıştırılır: doğrudan kategori sorguları ("[kategori] için en iyi araçlar"), karşılaştırma sorguları ("X mi Y mi") ve sorun odaklı sorgular ("[sorun] nasıl çözülür"). Her prompt için dört veri noktası loglanır: platform, marka anıldı mı (evet/hayır), pozisyon (yanıtın kaçıncı cümlesinde veya kaçıncı kaynakta geçtiği) ve hangi rakiplerin de anıldığı. Örnek bir izleme tablosu şöyle görünür:

| Prompt | Platform | Marka Anıldı mı | Pozisyon | Anılan Rakipler | Tarih |
|---|---|---|---|---|---|
| "En iyi proje yönetimi yazılımları" | ChatGPT | Evet | 2/5 | Asana, Monday | 2026-09-15 |
| "En iyi proje yönetimi yazılımları" | Perplexity | Hayır | - | Asana, ClickUp, Monday | 2026-09-15 |
| "Uzak ekipler için hangi araç kullanılır" | Gemini | Evet | 1/4 | Monday | 2026-09-15 |

Pozisyon verisi kritiktir, çünkü bir yanıtın ilk cümlesinde geçmek ile son satırda parantez içinde geçmek aynı ağırlığa sahip değildir. AI motorlarının çoğu ilk iki üç cümlede en güçlü önerisini veriyor, geri kalanını alternatif olarak sıralıyor; bu yüzden ham anılma sayısı tek başına yanıltıcı olabilir. [Search Engine Land'in GEO rank tracker rehberi](https://searchengineland.com/geo-rank-tracker-how-to-monitor-your-brands-ai-search-visibility-465683) de aynı nedenle pozisyon verisini anılma sayısından ayrı raporlamayı öneriyor.

## Tekrarlanabilir bir ölçüm ritmi nasıl kurulur?

Kısa cevap: Prompt panelini sabitleyip haftada bir aynı soruları aynı platformlarda çalıştırır, sonuçları tek bir tabloya işler ve ay sonunda trend grafiği çıkarırsın; kelimesi kelimesine aynı prompt setini kullanmazsan hafta hafta karşılaştırma anlamsızlaşır.

Pratikte iki ritim işe yarıyor: haftalık hızlı kontrol (5-10 en kritik prompt, tek kişi 20 dakikada tamamlar) ve aylık derin tarama (tüm panel, tüm platformlar, rakip karşılaştırmalı). Haftalık kontrol ani düşüşleri yakalar; örneğin bir platform güncellemesi sonrası atıf oranı bir haftada yüzde 30 düşerse bunu aylık taramayı beklemeden fark edersin. Basit bir günlükleme mantığı şu şekilde kurulabilir:

```python
# Basit bir atıf günlüğü mantığı (pseudocode)
prompts = load_panel("prompts.csv")
for prompt in prompts:
    for platform in ["chatgpt", "gemini", "perplexity"]:
        response = query_platform(platform, prompt)
        mentioned = brand_name in response.text
        position = find_position(response.text, brand_name)
        competitors = find_mentions(response.text, competitor_list)
        log_row(prompt, platform, mentioned, position, competitors, today())
```

Bu mantığı gerçek API çağrılarıyla doldurmak sonuçları bir tabloya yazmaktan ibarettir; karmaşık bir altyapı gerekmez. Önemli olan promptların ve zamanlamanın sabit kalmasıdır, çünkü değişen tek değişken markanın kendi görünürlüğü olmalıdır.

## Ölçüm verisiyle ne yapılmalı?

Kısa cevap: Panelin sonuçlarını üç kovaya ayır: hiç anılmadığın promptlar (içerik boşluğu), rakiplerin önde anıldığı promptlar (varlık kapsamı sorunu) ve anıldığın ama düşük pozisyonda kaldığın promptlar (netlik sorunu); her kova farklı bir aksiyon gerektirir.

Hiç anılmadığın promptlar genellikle sitende o soruya doğrudan cevap veren bir sayfanın olmadığını gösterir. Rakiplerin önde çıktığı promptlarda sorun içerik eksikliği değil, markanın bir varlık olarak yeterince tanınmamasıdır: Wikipedia, G2, Crunchbase gibi üçüncü taraf kaynaklarda tutarlı marka bilgisi eksik olabilir. Düşük pozisyonda kalan sayfalarda ise genelde net, tek cümlelik bir cevap yerine dolambaçlı bir giriş paragrafı vardır; AI motorları özetlerken en net cümleyi seçer, belirsiz olanı atlar. Bu tür içerik düzeltmelerinin somut yöntemlerini [karar verdiren içerik üzerine yazımızda](/tr/posts/karar-verdiren-icerik-ai-onerisi) ayrıca ele aldık; bu yazının odağı ölçüm, o yazının odağı üretimdir.

Görüşüm şu: çoğu ekip ölçümü atlayıp doğrudan "AI dostu içerik" üretmeye geçiyor, ama hangi promptlarda kaybettiğini bilmeden yazılan içerik çoğunlukla zaten güçlü olan alanları güçlendiriyor, zayıf noktaları değil. [Search Engine Land'in de vurguladığı gibi](https://searchengineland.com/ai-share-of-voice-metrics-that-matter-more-479611), ham ses payı tek başına bir öncelik listesi çıkarmaz; kova bazlı ayrım olmadan sayı büyür ama hangi sayfanın düzeltileceği belirsiz kalır.

## Hangi araçlar ve DIY yöntemler var?

Kısa cevap: 2026'da [Otterly.ai](https://otterly.ai/), Profound, Semrush, Peec ve Scrunch AI gibi özel GEO izleme araçları ChatGPT, Gemini ve Perplexity'deki atıfları otomatik tarıyor; bütçesi olmayan ekipler ise aynı işi manuel prompt panelini elle çalıştırarak ve sonuçları bir tabloya işleyerek yapabilir.

Microsoft, 16 Haziran 2026'da Bing Webmaster Tools'a dört yeni AI görünürlük metriği ekledi; bu metrikler önizleme aşamasında ücretsizdir ve Bing'in AI destekli sonuçlarındaki atıfları kapsar. Ücretli araçların çoğu benzer bir mantıkla çalışır: sabit bir prompt havuzunu birden çok platformda otomatik çalıştırıp sonuçları bir panoda birleştirirler. Adım adım kurulum için [AI aramada marka atıflarını ölçme rehberimize](/tr/posts/ai-aramada-marka-atiflarini-olcme) bakabilirsin. Aşağıdaki tablo iki yaklaşımı karşılaştırıyor:

| Yöntem | Avantaj | Dezavantaj |
|---|---|---|
| Özel GEO aracı (Otterly.ai, Profound vb.) | Otomatik, çoklu platform, rakip karşılaştırması hazır | Aylık ücret, veri metodolojisi genelde kapalı kutu |
| DIY prompt paneli | Ücretsiz, tam kontrol, promptlar markaya özel | Manuel emek, ölçek büyüdükçe zaman maliyeti artar |

Küçük bir ekip için DIY yöntem gerçekçi bir başlangıç noktasıdır: 20 promptluk bir panel, üç platformda haftalık çalıştırma, tek bir Google E-Tablo. Ekip büyüdükçe veya izlenen prompt sayısı 50'yi geçtiğinde özel bir araca geçmek zaman kazandırır.

## Sıkça Sorulan Sorular

### Sentetik ses payı ile klasik share of voice arasındaki fark nedir?

Klasik share of voice reklam gösterimi ve organik sıralama payını ölçer, sentetik ses payı ise AI motorlarının ürettiği yanıtlarda markanın anılma ve atıf oranını ölçer. İkisi farklı kanalları kapsadığı için ayrı ayrı takip edilmeli, biri diğerinin yerine geçmez.

### Haftada kaç prompt takip etmek yeterli?

Çoğu marka için 20-30 promptluk sabit bir panel yeterli başlangıç noktasıdır; bu panel kategori sorgularını, karşılaştırma sorgularını ve sorun odaklı sorguları dengeli biçimde kapsar. Panel büyüdükçe manuel takip zorlaşır, bu noktada özel bir araca geçmek mantıklı olur.

### AI motorları arasında hangi platform öncelikli izlenmeli?

Kısa cevap: Hedef kitlenin en çok kullandığı platformla başla; B2B yazılım markaları genelde ChatGPT'yi ve Perplexity'yi önceliklendirirken, tüketici markaları Google'ın AI Özetleri'ni de eklemelidir. Üç platformu aynı anda izlemek idealdir, ama kaynak kısıtlıysa en yüksek trafikli platformdan başlamak yeterlidir.

### Sentetik ses payı düşükse ilk ne yapılmalı?

Önce hangi prompt kovasında (hiç anılmama, düşük pozisyon, rakip önde) zayıf olduğunu belirle, çünkü her kova farklı bir düzeltme gerektirir. Sonra en yüksek hacimli veya en yüksek niyetli üç ila beş promptu hedefleyen içerik ve varlık düzeltmelerine odaklan.
