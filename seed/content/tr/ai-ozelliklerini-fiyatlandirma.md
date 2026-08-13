---
title: "AI Özelliklerini Zarar Etmeden Fiyatlandır"
slug: "ai-ozelliklerini-fiyatlandirma"
translationKey: "pricing-ai-features-without-losing-money"
locale: "tr"
excerpt: "AI özellikleri kâr marjını sessizce eritiyor. Token maliyetini hesaplayın, doğru fiyatlandırma modelini seçin, kullanım sınırını korkutmadan anlatın."
category: "business"
tags: ["cost-optimization", "finops", "ai-tools", "best-practices"]
publishedAt: "2026-08-13"
seoTitle: "AI Özelliklerini Zarar Etmeden Fiyatlandır"
seoDescription: "AI özelliklerinde token maliyetini hesaplayıp doğru fiyatlandırma modelini seçerek kâr marjını korumanın veriye dayalı, pratik yol haritası burada."
---

Bir AI özelliğini zarar etmeden fiyatlandırmanın yolu, önce her kullanıcı eyleminin gerçek token maliyetini çıkarmak, sonra bu maliyete göre üç fiyatlandırma kalıbından (sabit, kredi tabanlı, tam ölçülü) birini seçmek, en sonunda da kullanım sınırını kullanıcıyı ürkütmeden anlatmaktır. Bunu atlayan ekipler, Ağustos 2026 itibarıyla [GetMonetizely'nin 2026 SaaS ve AI fiyatlandırma rehberinde](https://www.getmonetizely.com/blogs/the-2026-guide-to-saas-ai-and-agentic-pricing-models) aktarılan ICONIQ'in yıllık SaaS anketinde görüldüğü gibi, geleneksel SaaS'ın 80-90 puanlık brüt marjından çok uzakta, ortalama yüzde 52'lik bir AI brüt marjıyla yaşamayı öğreniyor.

## Önce Maliyeti Ölçün, Sonra Fiyatı Yazın

Çoğu ekip fiyatı sezgiyle belirliyor, sonra faturayı görünce şaşırıyor. Doğru sıra tersi: her kritik eylemin (bir özet çıkarma, bir taslak üretme, bir arama sorgusu) girdi ve çıktı token sayısını, kullandığınız modelin fiyat listesiyle çarpıp gerçek bir birim maliyet çıkarın. Model seçimi burada belirleyici; aynı sağlayıcının ürün ailesi içinde bile fark büyük olabiliyor. Örneğin Claude Haiku 4.5 girdi başına yaklaşık 1 milyon token için 1 dolar, çıktı için 5 dolar isterken, Claude Opus 4.8 girdi için 5 dolar, çıktı için 25 dolar seviyesinde — yani aynı aile içinde kabaca 5 kat fark var, üstelik çok farklı yetenek seviyeleri için. 2022'den bu yana frontier'a yakın modellerin maliyeti yılda kabaca 10 kat düştü ve bazı modellerde GPT-4 seviyesi yetenek artık milyon token başına 0,40 dolara alınabiliyor; ama bu düşüş, tek bir eylemin maliyetini hesaplamadan fiyat belirleme lüksünü vermiyor.

Pratikte eylem başına maliyeti şöyle katmanlandırabilirsiniz:

| Eylem tipi | Tipik model tercihi | Yaklaşık maliyet/eylem |
| --- | --- | --- |
| Basit sınıflandırma, kısa özet | Ucuz katman (ör. Haiku sınıfı) | $0,001-$0,01 |
| Orta uzunlukta içerik üretimi | Orta katman | $0,01-$0,10 |
| Karmaşık akıl yürütme, uzun bağlam | Üst katman (ör. Opus sınıfı) | $0,10-$1,00+ |

Bu tablo çıkmadan fiyat sayfası yazmak, gözü kapalı araba fiyatlandırmaya benziyor.

## Üç Fiyatlandırma Kalıbı ve Ne Zaman Hangisi

AI özelliği fiyatlandırmasında üç temel kalıp var: aboneliğe gömülü sabit özellik, dahil kotanın üzerine eklenen kredi/kullanım tabanlı fiyatlandırma ve tamamen ölçülü (metered) fiyatlandırma. 2026'da sektörün baskın tercihi hibrit model — sabit bir koltuk/abonelik tabanı artı dahil kotanın üzerinde ölçülü kullanım — ve sektör anketlerine göre benimseme oranı yüzde 60'ın üzerinde.

| Kalıp | Alıcı için öngörülebilirlik | Marj güvenliği | Uygulama karmaşıklığı | En uygun senaryo |
| --- | --- | --- | --- | --- |
| Sabit/pakete gömülü | Yüksek | Düşük | Düşük | Düşük varyanslı, ucuz eylemler; erken aşama ürün |
| Kullanım kredisi (dahil kota + üstü) | Orta | Orta-yüksek | Orta | Karma kullanım dağılımı olan çoğu SaaS ürünü |
| Tam ölçülü | Düşük | Yüksek | Yüksek | Kurumsal, yüksek varyanslı veya ajan tabanlı kullanım |

Sabit fiyatlandırma basit satılır ama maliyet dağılımı çarpık olduğunda (birkaç ağır kullanıcı toplam maliyetin çoğunu üretir) marjı hızla eritir. Tam ölçülü fiyatlandırma marjı en iyi korur ama faturayı öngörülemez kılar, bu da özellikle küçük işletme alıcılarını ürkütür. Hibrit model çoğu ürün için tatlı nokta: kullanıcı tahmin edilebilir bir taban öder, ekip de kuyruktaki ağır kullanımdan marjını korur.

## Marjı Koruyan Üç Teknik Önlem

Fiyatlandırma modeli doğru olsa bile, üç teknik önlem olmadan marj yine erir. Birincisi sert kullanım tavanları: dahil kotanın üstüne çıkan kullanıcıyı otomatik olarak durdurmak ya da ek ücrete geçirmek, faturayı sessizce şirketin üstünde bırakmaktan iyidir. İkincisi model yönlendirme: ucuz, düşük riskli eylemleri (basit sınıflandırma, kısa özet) ucuz model katmanına, karmaşık akıl yürütmeyi pahalı katmana yönlendiren bir router katmanı kurmak, ortalama maliyeti önemli ölçüde düşürür. Üçüncüsü prompt önbellekleme: tekrar eden sistem talimatlarını ve bağlam parçalarını önbelleğe alarak her istekte yeniden işlenmesini önlemek, özellikle uzun bağlamlı özelliklerde maliyeti gözle görülür şekilde azaltır. [LLM token maliyetini düşürme rehberimizde](/tr/posts/llm-token-maliyetini-dusurme) bu üç tekniği daha derinlemesine ele alıyoruz.

## Ücretsiz Katman İstismarı ve Sessiz Marj Erimesi

Ücretsiz veya sabit fiyatlı bir katmanın en büyük tehlikesi, kullanıcı kitlesinin küçük bir yüzdesinin toplam maliyetin büyük kısmını üretmesidir. [The SaaS CFO'nun işaret ettiği gibi](https://www.thesaascfo.com/your-ai-feature-is-quietly-destroying-your-gross-margin/), bu durum genelde fark edilmeden birikir: ortalama kullanım makul görünürken, dağılımın kuyruğundaki birkaç hesap günde binlerce istek atıyor olabilir. Eski usul katı koltuk başına fiyatlandırmada ısrar eden şirketlerin AI özellikleri için brüt marjı, kullanım tabanlı veya sonuç tabanlı fiyatlandırmaya geçen şirketlere kıyasla ortalama yüzde 40 daha düşük çıkıyor. Bunun tek çözümü kullanım telemetrisini gün 1'den itibaren tutmak ve dağılımın kuyruğunu düzenli izlemektir; aksi hâlde sorunu ancak fatura patladığında fark edersiniz.

## Kullanım Sınırını Korkutmadan Anlatmak

Çoğu kurucu, açgözlü görünme korkusuyla AI özelliklerini eksik fiyatlandırıyor ya da kullanım sınırını hiç koymuyor. Oysa iyi açıklanmış bir kullanım tavanı ya da aşım ücreti, hem işletme hem kullanıcı için, maliyeti sessizce üstlenip sonra panikle fiyat zammına ya da özellik kısıtlamasına gitmekten çok daha nazik bir yaklaşım. Sınırı anlatırken üç şey işe yarıyor: cömert bir varsayılan kota koymak (kullanıcıların yüzde 90'ının asla dokunmayacağı bir eşik), sınırı somut birimlerle ifade etmek ("ayda 500 AI eylemi" token yerine daha anlaşılır) ve yükseltme yolunu tek tıkla erişilebilir kılmak. Sınıra ulaşan kullanıcıya "kotanız doldu, hizmet kesildi" demek yerine "bu ay 500 eylemin tamamını kullandınız, ek kullanım için şu seçenekler var" demek, aynı gerçeği çok daha az düşmanca aktarıyor.

## Basit Bir Marj Hesap Makinesi

Eylem başına marjı hızlıca kontrol etmek için aşağıdaki gibi küçük bir hesaplama yeterli:

```python
def marj_hesapla(maliyet_per_eylem, fiyat_per_eylem):
    kar = fiyat_per_eylem - maliyet_per_eylem
    marj_yuzde = (kar / fiyat_per_eylem) * 100
    return round(marj_yuzde, 1)

# Örnek: Haiku sınıfı bir özetleme eylemi
maliyet = 0.008  # dolar, eylem başına
fiyat = 0.025     # dolar, eylem başına
print(marj_hesapla(maliyet, fiyat))  # 68.0
```

Bu hesabı ürün seviyesinde yapmak için gereken girdiler şunlar: eylem başına maliyet (model + token sayısı), hedef brüt marj, beklenen kullanım dağılımı (ortalama ve kuyruk), dahil kota büyüklüğü ve aşım fiyatı. Bu beş girdiyi bir tabloya dökmeden fiyat sayfasını yayınlamak, [SaaS fiyatlandırmasında en yaygın hatalar yazımızda](/tr/posts/saas-fiyatlandirma-yaygin-yanlislar) anlattığımız tuzaklardan birine düpedüz davetiye çıkarmaktır.

Fiyatlandırma modelinizi netleştirdikten sonra sırada bulut maliyetlerinin geri kalanı var — [FinOps ile bulut maliyeti düşürme rehberimiz](/tr/posts/finops-bulut-maliyeti-dusurme) altyapı tarafındaki tasarrufları kapsıyor, [ilk SaaS metrikleri yazımız](/tr/posts/kurucular-icin-ilk-saas-metrikleri) ise marjı hangi metriklerle takip etmeniz gerektiğini anlatıyor. Bugün yayınladığımız [AI girişimini bootstrap etme rehberi](/tr/posts/ai-girisimi-bootstrap-2026) de aynı sorunun farklı bir yüzüne değiniyor. Daha fazla girişimcilik ve iş yazısı için [girişimcilik & iş kategorimize](/tr/category/girisimcilik-is) göz atabilirsiniz.

## Sıkça Sorulan Sorular

### AI özelliğimi ücretsiz katmana koymalı mıyım?

Koyabilirsiniz ama mutlaka sert bir kullanım tavanıyla. Ücretsiz katmanda tavan olmadan sunulan bir AI özelliği, kuyruktaki birkaç ağır kullanıcı yüzünden kısa sürede maliyet kalemine dönüşür. Cömert ama sonlu bir kota (örneğin ayda 20-50 eylem) hem deneyimi göstermeye yeter hem marjı korur.

### Hangi eylemleri ucuz model katmanına yönlendirmeliyim?

Doğruluk toleransı yüksek, çıktısı kısa ve tekrarlanabilir eylemler (sınıflandırma, kısa özet, basit biçimlendirme) ucuz katmana uygundur. Çok adımlı akıl yürütme, uzun bağlam sentezi veya yüksek doğruluk gerektiren eylemler üst katmanda kalmalı.

### Hibrit fiyatlandırmaya geçmek mevcut aboneleri kızdırır mı?

Doğru iletişimle genelde hayır. Mevcut kullanıcıların büyük kısmını mevcut fiyatta tutup yalnızca yeni dahil kotanın üzerine çıkanlara aşım ücreti uygulamak, ani bir zam hissi yaratmadan geçişi yumuşatır.

### Marjı ne sıklıkla yeniden hesaplamalıyım?

Model fiyatları ve kullanım dağılımı hızlı değiştiği için eylem başına maliyeti en az çeyreklik olarak, yeni bir model sürümüne geçtiğinizde ise anında yeniden hesaplamak gerekir.
