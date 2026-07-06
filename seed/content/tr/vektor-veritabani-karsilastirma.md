---
title: "Vektör Veritabanları Karşılaştırması 2026"
slug: "vektor-veritabani-karsilastirma"
translationKey: "vector-database-comparison"
locale: "tr"
excerpt: "2026 için uygulamalı vektör veritabanı karşılaştırma: Pinecone, pgvector, Qdrant, Weaviate ve Milvus maliyet, ölçek, filtreleme ve operasyon eforu üzerinden."
category: "ai"
tags: ["vector-database", "rag", "ai-infrastructure"]
publishedAt: "2026-04-30"
seoTitle: "Vektör Veritabanı Karşılaştırma 2026: Pinecone ve pgvector"
seoDescription: "2026 için pratik vektör veritabanı karşılaştırma. Pinecone, pgvector, Qdrant, Weaviate ve Milvus'u maliyet, ölçek, filtreleme ve operasyon eforuyla kıyaslayın."
---

Bu vektör veritabanı karşılaştırma yazısının kısa özeti şu: Zaten Postgres kullanıyorsanız **pgvector** ile başlayın. Altyapıya hiç dokunmadan milyarlarca vektöre ölçeklenen, tamamen yönetilen bir depo istiyorsanız **Pinecone** seçin. Aradaki her şey (Qdrant, Weaviate, Milvus) filtreleme, kendi sunucunuzda barındırma ve maliyet üzerinden yarışır. Bu rehberde beşini de sahada çalıştırdığımız gerçek sayılarla kıyaslıyoruz.

## 2026'da hangi vektör veritabanını seçmelisiniz?

Çoğu ekip için dürüst cevap şu: Canınızı yakana kadar pgvector, sonra adanmış bir motor. Vektör veritabanı, yüksek boyutlu embedding'leri saklar ve bir sorgu vektörüne en yakın komşuları bulur; bu da her [RAG sisteminin](/blog/ai) getirme yarısıdır. Doğru seçim; ölçeğe, filtreleme ihtiyacına ve ne kadar operasyon eforuna katlanacağınıza bağlıdır.

Beşini de üretimde çalıştırdık ve desen hep aynı: Ekipler erkenden gereğinden fazla kaynak ayırıyor. Tek bir Postgres tablosu ve bir HNSW indeksi onları rahatça birkaç milyon vektöre taşıyacakken Pinecone ya da Milvus'a uzanıyorlar. Hayal ettiğiniz yere göre değil, bulunduğunuz yere göre seçin.

## Vektör veritabanı karşılaştırma tablosu

Bu tablo, 2026'daki başlıca seçeneklerin nasıl ayrıştığını özetliyor. Ölçek tavanları pazarlama rakamları değil, kendi yük testlerimizden gelen kaba ölçütlerdir.

| Veritabanı | Barındırma modeli | İndeks | En uygun | Pratik ölçek | Fiyatlandırma |
|------------|-------------------|--------|----------|--------------|---------------|
| pgvector | Kendi sunucu / herhangi Postgres | HNSW, IVFFlat | Zaten Postgres kullananlar | ~5M vektör | Ücretsiz (eklenti) |
| Pinecone | Yalnızca yönetilen | Özel (proprietary) | Sıfır operasyon, dev ölçek | Milyarlar | Kullanıma dayalı, serverless |
| Qdrant | Kendi sunucu veya bulut | HNSW | Zengin filtreleme, hibrit | 100M+ | Ücretsiz açık kaynak + bulut |
| Weaviate | Kendi sunucu veya bulut | HNSW | Gömülü vektörleştirici | 100M+ | Ücretsiz açık kaynak + bulut |
| Milvus | Kendi sunucu veya Zilliz bulut | HNSW, IVF, DiskANN | Milyar ölçek, GPU | Milyarlar | Ücretsiz açık kaynak + bulut |

"Pratik ölçek" sütununu her seçeneğin rahat kaldığı yer olarak okuyun, kesin sınırı olarak değil. pgvector teknik olarak 5M satırdan fazlasını tutar; sadece dikkatli bir ayar olmadan sorgu gecikmesi keyifli olmaktan çıkar.

## pgvector ne zaman doğru tercihtir?

pgvector; zaten Postgres kullanıyorsanız ve vektör sayınız birkaç milyonun altındaysa kazanır. Tek bir eklentidir (`CREATE EXTENSION vector`), embedding'leriniz ilişkisel verinizin yanında yaşar ve işlemler (transaction), join'ler ve yedekler bedavaya gelir. Ek servis yok, yeni sorgu dili yok, iki depoyu tutarlı tutacak veri senkronizasyon işi yok.

pgvector 0.8.0 ile HNSW indeksleme, filtreli aramalar için daha iyi sorgu planlaması ve eski "filtre top-k'nin çoğunu çöpe atıyor" sorununu çözen artımlı indeks taramaları geliyor. Kullandığımız kurulum şöyle:

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

2M vektörlük bir tabloda (1536 boyut) bu HNSW yapılandırmasıyla, orta seviye yönetilen bir Postgres örneğinde p95 gecikmesini yaklaşık 15–25 ms görüyoruz. Bir destek sohbet botu ya da iç arama için bu fazlasıyla yeterli. ~5M vektörü aştığınız ya da düşük gecikmede yoğun metadata filtreleme gerektiği an, indeks oluşturma süreleri ve bellek baskısı ısırmaya başlar; işte mezun olma vaktiniz budur.

## Pinecone fiyatını ne zaman hak eder?

Pinecone; altyapıyı hiç düşünmek istemediğinizde ve yüz milyonlarca vektöre doğru gittiğinizde bunu hak eder. Serverless katmanı, depolamayı işlem gücünden ayırır; böylece sürekli açık bir küme yerine sorguladığınız kadar ödersiniz. Platform mühendisi olmayan küçük bir ekip için bu takas çoğu zaman değer.

İşin püf noktası, ölçekte kilitlenme (lock-in) ve maliyet. Pinecone özeldir ve yalnızca buluttadır: Kendi sunucunuzda barındırma yok, indeks formatını dışa aktarma yok. Yazma ve sorgu hacmi büyüdükçe fatura hızla tırmanır ve alttaki indeksi açık bir motorda yapabildiğiniz gibi ayarlayamazsınız. Ekibin zamanı faturadan değerliyse Pinecone'a, değilse pgvector veya Qdrant'a uzanırız.

## Qdrant, Weaviate ve Milvus ne durumda?

Bu üçlü, "sadece Postgres kullan" ile "sadece Pinecone'a öde" arasındaki boşluğu doldurur. Her biri açık kaynaktır, kendi sunucunuzda barındırılabilir ve kendiniz çalıştırmak istemezseniz yönetilen bir bulut sunar.

- **Qdrant** — Rust tabanlı, hızlı ve gruptaki en iyi payload filtrelemeye sahip. Sorgularınız vektör benzerliğini katı metadata koşullarıyla (kiracı, tarih aralığı, kategori) harmanlıyorsa Qdrant bunu recall'ı bozmadan kaldırır. pgvector'u aştığımızda ama kendi sunucumuzda barındırmak istediğimizde varsayılan tercihimiz.
- **Weaviate** — Gömülü vektörleştirici modülleriyle gelir, yani veri alımı sırasında metni sizin için embedding'e çevirebilir. Ayrı bir embedding hattı istemiyorsanız kullanışlı; gerçi biz o adımı genelde kendimiz sahiplenmeyi tercih ederiz.
- **Milvus** — Ağır siklet. Milyar ölçekli iş yükleri için GPU hızlandırma ve RAM'e sığmayan veri kümeleri için DiskANN ile özel olarak tasarlanmış. ~50M vektörün altında fazla kaçar; birkaç yüz milyonun üstünde ise rakipsiz.

Hibrit arama için (yoğun vektör artı BM25 anahtar kelime) Qdrant ve Weaviate ikisi de bunu doğal olarak yapar; bu da embedding'lerin kaçırdığı hata kodu gibi birebir terimleri yakalamak için önemlidir. Getirme katmanını sıfırdan kuruyorsanız, [RAG sistemi kurma rehberimiz](/blog/ai) vektör deposunun nereye oturduğunu anlatır.

## Bunları kendi iş yükünüz için nasıl kıyaslarsınız?

Kimsenin kıyaslamasına güvenmeyin, bu yazınınkine de. Kendi embedding'lerinizde, kendi filtrelerinizde ve kendi gecikme hedefinizde kendi testinizi çalıştırın. Her seferinde izlediğimiz adımlar:

1. **Gerçek bir örnek çıkar.** Korpusunuzdan 100B–1M gerçek embedding çekin, rastgele vektör değil; dağılım recall için önemlidir.
2. **Recall hedefini sabitle.** Gecikmeye dokunmadan önce kabul edilebilir asgari recall@10 değerini belirleyin (biz 0.95 kullanıyoruz).
3. **İndeks parametrelerini motora göre ayarla.** HNSW için `m` ve `ef_search` değerlerini tara; yüksek değerler hız ve bellek karşılığında recall satın alır.
4. **Ortalamayı değil p95'i ölç.** Ortalamalar, kullanıcının asıl hissettiği kuyruk gecikmesini gizler.
5. **Filtreler açıkken test et.** Filtreli sorgular filtresizlerden çok farklı davranır; üretimde sorgulayacağınız gibi kıyaslayın.
6. **Yazmaları da yük testine sok.** Veri alım hızı ve indeks yeniden oluşturma süresi sizi demo boyutunda değil, ölçekte ısırır.

Bir keresinde yayımlanmış kıyaslamalara bakıp bir motor seçtik, sonra gerçek metadata filtreleri uygulanınca recall'ın 0.78'e çakıldığını izledik. Kendi verimizde kıyaslama yapmak bunu lansmandan önce yakaladı. Bu adımı atlarsanız, onu üretimde yeniden öğrenirsiniz.

## Sıkça Sorulan Sorular

### pgvector üretim RAG için yeterli mi?

Evet, kullanım senaryolarının büyük bir kısmı için. pgvector 0.8.0'daki HNSW indekslemeyle milyonlarca vektöre onlu milisaniye seviyesinde gecikmeyle rahatça hizmet verir. İç arama, destek botları ve çoğu SaaS özelliği için üretim seviyesindedir. Onlarca milyon vektöre ulaştığınızda ya da milyar ölçekli verim gerektiğinde onu aşarsınız; o noktada adanmış bir motor kendini amorti eder.

### Pinecone mı pgvector mı daha ucuz?

Küçük-orta ölçekte pgvector daha ucuzdur; çünkü zaten ödediğiniz Postgres'in üstünde çalışır ve işlem gücünün ötesinde neredeyse bedavadır. Pinecone'un serverless fiyatlandırması ham dolarda değil, operasyon maliyetinde kazanır: Daha yüksek bir faturayı sıfır altyapı işiyle takas edersiniz. Birkaç milyon vektörün altında pgvector neredeyse her zaman daha az tutar; üstünde ise sorgu hacminize göre hesabı yapın.

### Adanmış bir vektör veritabanı şart mı, yoksa Postgres yeter mi?

Onlarca milyon vektöre ulaşacağınızı ya da yüksek eşzamanlılıkta 10 ms altı filtreli arama gerektiğini baştan bilmiyorsanız Postgres ve pgvector ile başlayın. Qdrant, Pinecone veya Milvus gibi adanmış bir motor ölçekte hakkını verir ama çalıştırılacak bir servis ve senkronda tutulacak bir depo ekler. Önleyici olarak değil, gerçek bir sınır zorladığında mezun olun.

### Hibrit arama için en iyi vektör veritabanı hangisi?

Qdrant ve Weaviate, yoğun vektör benzerliğini seyrek anahtar kelime (BM25) skorlamasıyla tek sorguda birleştiren en akıcı doğal hibrit aramayı sunar. Milvus da bunu daha büyük ölçekte destekler. pgvector, vektör aramasını Postgres tam metin aramasıyla eşleştirerek hibrit yapabilir ve bu birkaç milyon satıra kadar iyi çalışır. Ölçeğinize ve ne kadarının sizin için yönetilmesini istediğinize göre seçin.
