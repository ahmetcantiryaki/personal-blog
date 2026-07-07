---
title: "Vektör Veritabanları Karşılaştırması 2026"
slug: "vektor-veritabani-karsilastirma"
translationKey: "vector-database-comparison"
locale: "tr"
category: "ai"
tags: ["vector-database", "rag", "ai-infrastructure"]
publishedAt: "2026-07-04"
seoTitle: "Vektör Veritabanı Karşılaştırma 2026: Pinecone ve pgvector"
seoDescription: "Temmuz 2026 için güncel sürüm ve fiyatlarla vektör veritabanı karşılaştırma: Pinecone, pgvector, Qdrant, Weaviate ve Milvus'u maliyet, ölçek ve filtrelemeyle kıyasla."
excerpt: "Temmuz 2026 için uygulamalı vektör veritabanı karşılaştırma — Pinecone serverless v2, pgvector 0.8.4, Qdrant GPU indeksleme, Weaviate ve Milvus 2.6 maliyet ve ölçek üzerinden."
---

Mayıs 2026'da danışmanlığını yaptığımız bir ekip Pinecone faturasını açtı ve fiyat hesaplayıcısında hiç görmediği bir kalemle karşılaştı: kapasite ücreti (capacity fee). Agent ürünleri bir hafta boyunca viral olmuş, sürekli eşzamanlılık zirve yapmış ve rezervasyon ücreti sessizce devreye girmişti. Fatura üçe katlandı. Bozulan bir şey yoktu; sadece serverless'ın ince yazısını okumamışlardı. Bu vektör veritabanı karşılaştırma yazısının var olma sebebi tam da o fatura: doğru seçim nadiren çıplak benchmark sayılarıyla, neredeyse her zaman katlanabileceğiniz hata modeliyle ilgilidir.

## 2026'da hangi vektör veritabanını seçmelisiniz?

Çoğu ekip için dürüst cevap şu: Canınızı yakana kadar pgvector, sonra adanmış bir motor. Vektör veritabanı, yüksek boyutlu embedding'leri saklar ve bir sorgu vektörüne en yakın komşuları bulur; bu da her [RAG sisteminin](/tr/posts/rag-sistemi-nasil-kurulur) getirme yarısıdır. Doğru seçim; ölçeğe, filtreleme ihtiyacına ve ne kadar operasyon eforuna katlanacağınıza bağlıdır.

Beşini de üretimde çalıştırdık ve desen hep aynı: Ekipler erkenden gereğinden fazla kaynak ayırıyor. Tek bir Postgres tablosu ve bir HNSW indeksi onları rahatça birkaç milyon vektöre taşıyacakken Pinecone ya da Milvus'a uzanıyorlar. Hayal ettiğiniz yere göre değil, bulunduğunuz yere göre seçin.

## Vektör veritabanı karşılaştırma tablosu

Bu tablo, Temmuz 2026 itibarıyla başlıca seçeneklerin güncel sürümleriyle nasıl ayrıştığını özetliyor. Ölçek tavanları pazarlama rakamları değil, kendi yük testlerimizden gelen kaba ölçütlerdir.

| Veritabanı | Güncel sürüm | Barındırma | İndeks | En uygun | Pratik ölçek | Fiyat sinyali |
|------------|--------------|------------|--------|----------|--------------|---------------|
| pgvector | 0.8.4 (Haz 2026) | Herhangi Postgres | HNSW, IVFFlat | Zaten Postgres kullananlar | ~5M vektör | Ücretsiz eklenti |
| Pinecone | Serverless v2 (Ç1 2026) | Yalnızca yönetilen | Özel (proprietary) | Sıfır operasyon, dev ölçek | Milyarlar | ~$3,60/GB/ay + okuma/yazma/kapasite birimi |
| Qdrant | 1.15.x | Kendi sunucu / bulut | HNSW (GPU derleme) | Zengin filtreleme, hibrit | 100M+ | Ücretsiz açık kaynak + bulut |
| Weaviate | 1.38 | Kendi sunucu / bulut | HNSW | Gömülü vektörleştirici | 100M+ | Ücretsiz açık kaynak + bulut |
| Milvus | 2.6 | Kendi sunucu / Zilliz | HNSW, IVF, DiskANN | Milyar ölçek, GPU | Milyarlar | Ücretsiz açık kaynak + bulut |

"Pratik ölçek" sütununu her seçeneğin rahat kaldığı yer olarak okuyun, kesin sınırı olarak değil. pgvector teknik olarak 5M satırdan çok fazlasını tutar; sadece dikkatli bir ayar olmadan sorgu gecikmesi keyifli olmaktan çıkar.

## pgvector ne zaman doğru tercihtir?

pgvector; zaten Postgres kullanıyorsanız ve vektör sayınız birkaç milyonun altındaysa kazanır. Tek bir eklentidir (`CREATE EXTENSION vector`), embedding'leriniz ilişkisel verinizin yanında yaşar ve işlemler (transaction), join'ler ve yedekler bedavaya gelir; ek servis yok, yeni sorgu dili yok, iki depoyu tutarlı tutacak senkronizasyon işi yok. İndeksin arkasındaki mekaniği merak ediyorsanız, [veritabanı indeksleme rehberimiz](/tr/posts/veritabani-indeksleme) HNSW'nin neden böyle davrandığını anlatıyor.

pgvector 0.8.4 (30 Haziran 2026'da yayımlandı) ile paralel HNSW derlemeleri geliyor; çok çekirdekli makinelerde %30–50 daha hızlı. Buna 0.8.0'da gelen ve eski "filtre top-k'nin çoğunu çöpe atıyor" aşırı-filtreleme sorununu çözen artımlı indeks taramaları ekleniyor. Altını çizmeye değer bir uyarı: Eski bir sürüme sabitliyseniz, paralel HNSW derlemesindeki bir buffer overflow'u (CVE-2026-3172) yamalayan [0.8.2](https://www.postgresql.org/about/news/pgvector-082-released-3245/) sürümünün üstüne yükseltin. Kullandığımız kurulum şöyle:

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE docs (
  id        bigserial PRIMARY KEY,
  content   text,
  source    text,
  embedding vector(1536)
);

-- Hızlı yaklaşık en yakın komşu araması için HNSW indeksi
CREATE INDEX ON docs
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- Sorgu: kaynağa göre filtrelenmiş en yakın 5 komşu
SELECT id, content, embedding <=> $1 AS distance
FROM docs
WHERE source = 'handbook'
ORDER BY embedding <=> $1
LIMIT 5;
```

2M vektörlük bir tabloda (1536 boyut) bu yapılandırmayla, orta seviye yönetilen bir Postgres örneğinde p95 gecikmesini yaklaşık 15–25 ms görüyoruz. Bir destek sohbet botu ya da iç arama için fazlasıyla yeterli. ~5M vektörü aştığınız ya da düşük gecikmede yoğun metadata filtreleme gerektiği an, indeks oluşturma süreleri ve bellek baskısı ısırmaya başlar; işte mezun olma vaktiniz budur.

## Pinecone fiyatını ne zaman hak eder?

Pinecone; altyapıyı hiç düşünmek istemediğinizde ve yüz milyonlarca vektöre doğru gittiğinizde bunu hak eder. Ç1 2026'da daha düşük gecikmeyle çıkan Serverless v2, depolamayı işlem gücünden ayırır; böylece sürekli açık bir küme yerine sorguladığınız kadar ödersiniz.

Ama dürüstçe fiyatlandırın. Temmuz 2026 itibarıyla [Pinecone dört eksende faturalandırır](https://docs.pinecone.io/guides/manage-cost/understanding-cost): yazma birimleri, okuma birimleri, GB başına ayda yaklaşık $3,60 depolama ve insanları şaşırtan o kalem — sürekli yüksek eşzamanlılıkta devreye giren kapasite ücretleri. Danışanımızın faturasını üçe katlayan tam da bu son bileşendi. Özeldir ve yalnızca buluttadır: Kendi sunucunuzda barındırma yok, indeksi dışa aktarma yok. Kişisel görüşüm: Pinecone tam olarak ekibinizin zamanı faturadan pahalıysa değer, o an geçtiğinde ise bir yük. (Geçiş yapıyorsanız 31 Temmuz 2026'ya kadar geçerli 250 dolarlık toplu içe aktarma kredisi var.)

## Qdrant, Weaviate ve Milvus ne durumda?

Bu üçlü, "sadece Postgres kullan" ile "sadece Pinecone'a öde" arasındaki boşluğu doldurur. Her biri açık kaynaktır, kendi sunucunuzda barındırılabilir ve yönetilen bir bulut sunar.

- **Qdrant** — Rust tabanlı, hızlı ve gruptaki en iyi payload filtrelemeye sahip. Nisan 2026 itibarıyla [Qdrant Cloud, GPU hızlandırmalı indeksleme](https://qdrant.tech/blog/qdrant-cloud-enterprise-launch/) (v1.13'ten beri açık kaynakta olan, 4 kata kadar hızlı HNSW derlemeleri), Multi-AZ kümeler ve denetim kaydı (audit logging) ekledi. pgvector'u aştığımızda ama kendi sunucumuzda barındırmak istediğimizde varsayılan tercihimiz.
- **Weaviate** — 1.38 sürümü, toplu işlemler için bir hız sınırlayıcı ve otomatik etkinleşen asenkron replikasyonla üretim yollarını sağlamlaştırdı. Gömülü vektörleştirici modülleri (OpenAI, Cohere, Hugging Face) veri alımı sırasında metni sizin için embedding'e çevirebilir; ayrı bir hat istemiyorsanız kullanışlı, gerçi biz o adımı genelde kendimiz sahiplenmeyi tercih ederiz.
- **Milvus** — Ağır siklet. [2.6 sürümü](https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md) milyar ölçekte maliyete iyice yükleniyor: Nullable vektör alanları (embedding'i henüz oluşmadan kayıt ekleyin, sıfır ek depolama) ve struct alanlarında eleman düzeyinde arama ekliyor. ~50M vektörün altında fazla kaçar; birkaç yüz milyonun üstünde ise rakipsiz.

Hibrit arama için (yoğun vektör artı BM25 anahtar kelime) Qdrant ve Weaviate ikisi de bunu doğal olarak yapar; bu da embedding'lerin kaçırdığı hata kodu gibi birebir terimleri yakalamak için önemlidir. Vektör deposuna mı ihtiyacınız var yoksa modeli mi ayarlamalısınız, hâlâ kararsız mısınız? [Fine-tuning mi RAG mi](/tr/posts/fine-tuning-mi-rag-mi) yazımız bu kararı çerçeveler, [embedding rehberi](/tr/posts/embedding-rehberi) ise bu indekslere aslında neyin girdiğini anlatır.

## Bunları kendi iş yükünüz için nasıl kıyaslarsınız?

Kimsenin kıyaslamasına güvenmeyin, bu yazınınkine de. Kendi embedding'lerinizde, kendi filtrelerinizde ve kendi gecikme hedefinizde kendi testinizi çalıştırın. Her seferinde izlediğimiz adımlar:

1. **Gerçek bir örnek çıkar.** Korpusunuzdan 100B–1M gerçek embedding çekin, rastgele vektör değil; dağılım recall için önemlidir.
2. **Recall hedefini sabitle.** Gecikmeye dokunmadan önce kabul edilebilir asgari recall@10 değerini belirleyin (biz 0.95 kullanıyoruz).
3. **İndeks parametrelerini motora göre ayarla.** HNSW için `m` ve `ef_search` değerlerini tara; yüksek değerler hız ve bellek karşılığında recall satın alır.
4. **Ortalamayı değil p95'i ölç.** Ortalamalar, kullanıcının asıl hissettiği kuyruk gecikmesini gizler.
5. **Filtreler açıkken test et.** Filtreli sorgular filtresizlerden çok farklı davranır; üretimde sorgulayacağınız gibi kıyaslayın.
6. **Yazmaları da yük testine sok.** Veri alım hızı ve indeks yeniden oluşturma süresi sizi demo boyutunda değil, ölçekte ısırır.

Bir keresinde yayımlanmış kıyaslamalara bakıp bir motor seçtik, sonra gerçek metadata filtreleri uygulanınca recall'ın 0.78'e çakıldığını izledik. Kendi verimizde kıyaslama yapmak bunu lansmandan önce yakaladı. Bu adımı atlarsanız, onu üretimde yeniden öğrenirsiniz. Bu motorların daha geniş bir yapay zeka yığınına nasıl oturduğunu görmek için [Yapay Zeka kategorisine](/tr/category/yapay-zeka) göz atın.

## Sıkça Sorulan Sorular

### pgvector üretim RAG için yeterli mi?

Evet, kullanım senaryolarının büyük bir kısmı için. HNSW indeksleme ve pgvector 0.8.4'teki paralel derlemelerle milyonlarca vektöre onlu milisaniye seviyesinde gecikmeyle rahatça hizmet verir. İç arama, destek botları ve çoğu SaaS özelliği için üretim seviyesindedir. Onlarca milyon vektöre ulaştığınızda ya da milyar ölçekli verim gerektiğinde onu aşarsınız; o noktada adanmış bir motor kendini amorti eder.

### Pinecone mı pgvector mı daha ucuz?

Küçük-orta ölçekte pgvector daha ucuzdur; çünkü zaten ödediğiniz Postgres'in üstünde çalışır ve işlem gücünün ötesinde neredeyse bedavadır. Pinecone'un serverless fiyatlandırması operasyon maliyetinde kazanır ama kapasite ücretleri sürekli yük altında sizi şaşırtabilir. Birkaç milyon vektörün altında pgvector neredeyse her zaman daha az tutar; üstünde ise okuma, yazma, depolama ve kapasite birimlerini gerçek trafiğe göre modelleyin.

### Adanmış bir vektör veritabanı şart mı, yoksa Postgres yeter mi?

Onlarca milyon vektöre ulaşacağınızı ya da yüksek eşzamanlılıkta 10 ms altı filtreli arama gerektiğini baştan bilmiyorsanız Postgres ve pgvector ile başlayın. Qdrant, Pinecone veya Milvus gibi adanmış bir motor ölçekte hakkını verir ama çalıştırılacak bir servis ve senkronda tutulacak bir depo ekler. Önleyici olarak değil, gerçek bir sınır zorladığında mezun olun.

### Hibrit arama için en iyi vektör veritabanı hangisi?

Qdrant ve Weaviate, yoğun vektör benzerliğini seyrek anahtar kelime (BM25) skorlamasıyla tek sorguda birleştiren en akıcı doğal hibrit aramayı sunar. Milvus 2.6 da bunu daha büyük ölçekte destekler. pgvector, vektör aramasını Postgres tam metin aramasıyla eşleştirerek hibrit yapabilir ve bu birkaç milyon satıra kadar iyi çalışır. Ölçeğinize ve ne kadarının sizin için yönetilmesini istediğinize göre seçin.
