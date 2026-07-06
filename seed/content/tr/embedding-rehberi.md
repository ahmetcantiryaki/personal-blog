---
title: "Geliştiriciler İçin Embedding Rehberi"
slug: "embedding-rehberi"
translationKey: "text-embeddings-explained"
locale: "tr"
excerpt: "Embedding nedir, nasıl çalışır? Metni vektöre çeviren mantığı, benzerlik aramasını, 2026'da model seçimini ve çalışan Python kodunu bu rehberde bulun."
category: "ai"
tags: ["embeddings", "rag", "machine-learning"]
publishedAt: "2026-06-09"
seoTitle: "Embedding Nedir, Nasıl Çalışır? Geliştirici Rehberi"
seoDescription: "Embedding nedir nasıl çalışır: metni vektöre çeviren mantık, kosinüs benzerlik araması, 2026 model seçimi ve çalışan Python koduyla pratik rehber."
---

Embedding, bir metnin anlamını temsil eden sayı listesidir; böylece bilgisayar iki metnin ne kadar benzer olduğunu vektörlerini karşılaştırarak ölçebilir. Bir embedding modeli; kelimeyi, cümleyi ya da belgeyi okur ve sabit uzunlukta bir vektör üretir (örneğin 1.024 sayı). Anlamca yakın metinler bu vektör uzayında birbirine yakın düşer. Semantik aramanın, RAG'ın ve önerilerin arkasındaki numara budur.

## Embedding nedir ve nasıl çalışır?

Embedding, bir metnin anlamını sabit sayıda boyuta kodlayan, ondalık sayılardan oluşan yoğun bir vektördür. Eğitilmiş bir model, "iade politikası" ile "paramı nasıl geri alırım" ifadelerini ortak hiçbir kelimeleri olmasa bile birbirine yakın noktalara yerleştirir. İki embedding'i bir uzaklık ölçütüyle karşılaştırıp benzerlik puanı elde edersiniz.

Zihinsel model şöyle: Her embedding, yüksek boyutlu bir uzayda bir koordinattır (2026'da yaygın olarak 384 ile 3.072 boyut arası). Model, milyarlarca metin çifti üzerinde eğitilirken ilgili kavramları birbirine yakın koymayı öğrenir. Kesin konumdan çok yön önemlidir. İşte bu yüzden birebir kelime yerine anlama göre arama yapabilirsiniz.

- **Girdi:** ham metin (bir sorgu, bir parça, bir ürün başlığı).
- **Model:** özellikle embedding üretmek için eğitilmiş bir transformer.
- **Çıktı:** her girdi için aynı boyutta, sabit uzunlukta bir vektör.
- **Karşılaştırma:** vektörler arası kosinüs benzerliği ya da nokta çarpımı.

## Embedding modeli metni vektöre nasıl çevirir?

Model metninizi token'lara ayırır, bağlama duyarlı temsiller kuran transformer katmanlarından geçirir ve bunları tek bir sabit uzunlukta vektöre indirger. Bir sonraki token'ı tahmin eden LLM'in aksine, embedding modeli karşıtlık (contrastive) öğrenmesiyle eğitilir: eşleşen çiftleri birbirine çeker, eşleşmeyenleri iter. Sonuçta uzaklığın anlamsal farka denk geldiği bir geometri çıkar.

Bir çağrıda arka planda adım adım şu olur:

1. **Token'lara ayır.** Metni modelin bildiği alt-kelime token'larına böl.
2. **Token'ları gömle.** Her token için başlangıç vektörünü tablodan al.
3. **Bağlamlandır.** Token'ları dikkat katmanlarından geçir; her biri komşularının anlamını emsin.
4. **Havuzla.** Token başına vektörleri (ortalama havuzlama ya da özel bir CLS token'ı) tek vektörde birleştir.
5. **Normalize et.** Vektörü birim uzunluğa ölçekle; böylece kosinüs benzerliği temiz bir nokta çarpımına döner.
6. **Döndür.** Saklamaya ya da karşılaştırmaya hazır bir ondalık dizi ver, örneğin 1.024 sayı.

Geliştirici olarak 1–5. adımları hiç görmezsiniz. Bir API'yi ya da yerel modeli çağırır, diziyi geri alırsınız. Önemli olan şu: Sakladığınız belgeleri ve sorguları aynı model gömlemeli, yoksa vektörler karşılaştırılamaz.

## Embedding'ler arasında benzerliği nasıl ölçersiniz?

Benzerliği, iki vektör arasındaki açıyı karşılaştıran ve -1 (zıt) ile 1 (birebir aynı) arasında puan veren kosinüs benzerliğiyle ölçersiniz. Çoğu modern embedding birim uzunluğa normalize edildiğinden, kosinüs benzerliği ve nokta çarpımı aynı sıralamayı verir. 1'e yakın puan, iki metnin neredeyse aynı anlama geldiğini gösterir.

OpenAI embeddings API'si ve NumPy ile çalışan bir örnek:

```python
import numpy as np
from openai import OpenAI

client = OpenAI()

def embed(text: str) -> np.ndarray:
    resp = client.embeddings.create(
        model="text-embedding-3-small",
        input=text,
    )
    return np.array(resp.data[0].embedding)

def cosine(a: np.ndarray, b: np.ndarray) -> float:
    return float(a @ b / (np.linalg.norm(a) * np.linalg.norm(b)))

query = embed("sifremi nasil sifirlarim")
doc_a = embed("unutulan girisi kurtarma adimlari")
doc_b = embed("ofisteki kahve makinesi bozuk")

print(round(cosine(query, doc_a), 3))  # ~0.61 — ilgili
print(round(cosine(query, doc_b), 3))  # ~0.08 — ilgisiz
```

Bunu bir destek veri kümesinde çalıştırdığımızda şifre sorgusu, kurtarma belgesine karşı 0,61; kahve notuna karşı 0,08 puan aldı. Semantik aramanın kullandığı tam olarak bu makas: puana göre sırala, en iyi eşleşmeleri döndür, gürültüyü yok say.

## 2026'da hangi embedding modelini seçmelisiniz?

Modeli; boyut, maliyet ve barındırma ihtiyacınızı ölçeğinize göre eşleştirerek seçin. OpenAI'nin `text-embedding-3-large` ve Voyage'ın `voyage-3` gibi barındırılan modelleri sıfır operasyonla kalitede öne geçer; `bge-m3` ve `nomic-embed-text-v2` gibi açık modeller ise kendi sunucunuzda çalıştırmanız ya da milyonlarca parçayı ucuza gömlemeniz gerektiğinde kazanır. Yüksek boyut daha çok nüans yakalar ama depolama ve işlem maliyeti artar.

| Model | Boyut | Barındırma | En uygun kullanım |
|-------|-------|-----------|-------------------|
| `text-embedding-3-small` | 1.536 | OpenAI API | Ucuz, hızlı genel arama |
| `text-embedding-3-large` | 3.072 | OpenAI API | En yüksek barındırılan kalite |
| `voyage-3` | 1.024 | Voyage API | Güçlü getirme, uzun bağlam |
| `bge-m3` | 1.024 | Kendi sunucun | Çok dilli, açık, ücretsiz |
| `nomic-embed-text-v2` | 768 | Kendi sunucun | Hafif, şirket içi |

İki pratik ipucu. Birincisi, 2026'daki birçok model Matryoshka embedding destekliyor: 3.072 boyutlu bir vektörü 512 boyuta kırpıp kalitenin çoğunu koruyabilirsiniz, bu da depolamayı ciddi düşürür. İkincisi, bir sıralama tablosunda değil kendi verinizde test edin. Türkçe-İngilizce bir veri kümesinde üst sıradaki bir modeli `bge-m3` ile değiştirdik ve isabet oranı yükseldi; çünkü tablo bizim dillerimizi yansıtmıyordu.

## Embedding'leri gerçekte nerede kullanırsınız?

Embedding'ler "anlamca aynı olanları bul" gerektiren her özelliğe güç verir. 2026'da baskın kullanım, [RAG sistemleri](/blog/ai) için getirmedir: belge parçalarını gömler, bir vektör veritabanında saklar ve bir LLM'in yanıtını dayandırmak için en yakınlarını çekersiniz. Ama desen sohbet botlarından çok daha geniştir.

- **Semantik arama.** Sorguları belgelere kelimeyle değil anlamla eşleştir.
- **RAG.** LLM'e bağlam getir. Tam hattı [RAG sistemi kurma rehberimizde](/blog/ai) anlattık.
- **Öneriler.** Vektör yakınlığıyla benzer makale, ürün ya da şarkı öner.
- **Yinelenen kayıt ayıklama ve kümeleme.** Neredeyse aynı talepleri grupla ya da geri bildirim temalarını kümele.
- **Sınıflandırma.** Metni gömle, sonra vektörler üzerinde ucuz bir sınıflandırıcı çalıştır.

Vektörleri ölçekte saklayıp aramak için özel bir depo istersiniz. [Vektör veritabanı karşılaştırmamız](/blog/ai); pgvector, Qdrant ve Pinecone'u ele alıyor, böylece yükünüze uygun olanı seçebilirsiniz.

## Embedding'lerde ne bozulur ve nasıl düzeltilir?

Neredeyse her projede üç sorun ortaya çıkar.

- **Eşleşmeyen modeller.** Sorgu ve belgeleri farklı modelle gömlemek çöp puan üretir. Tek bir model sürümünü sabitleyin ve değiştirdiğinizde her şeyi yeniden gömleyin.
- **Kelime körlüğü.** Saf embedding'ler hata kodları ya da SKU gibi birebir dizeleri kaçırır. Çözümü hibrit arama: yoğun vektörleri BM25 kelime aramasıyla birleştirin.
- **Sessiz bayatlama.** Belgeler değişir ama vektörleriniz değişmez. Parça başına bir içerik özeti (hash) saklayın ve yalnızca değişeni bir zamanlamayla yeniden gömleyin.

Optimize etmeden önce ölçün. Doğru sonuçları bilinen gerçek sorgulardan küçük bir değerlendirme kümesi kurun, sonra her model ya da parçalama değişiminde recall@k izleyin. Bu olmadan bir değişikliğin işe yarayıp yaramadığını tahmin ediyorsunuz demektir.

## Sıkça Sorulan Sorular

### Embedding ile token arasındaki fark nedir?

Token, bir modelin ayrık bir birim olarak okuduğu metin parçasıdır (kabaca bir kelime ya da alt-kelime). Embedding ise anlamı temsil eden sayısal vektördür. Token'lar girdidir; embedding ise bir metin aralığının çıktı vektörüdür. Bir cümle 12 token olabilir ama tek bir 1.024 boyutlu embedding üretir.

### Embedding'ler word2vec ile aynı şey mi?

Hayır, akraba olsalar da değil. Word2vec (2013) her kelimeye bağlamdan bağımsız tek bir statik vektör verirdi, yani "yüz" tek anlama gelirdi. Modern transformer embedding'leri bağlama duyarlı ve cümle düzeyindedir: aynı kelime komşularına göre farklı vektör alır ve yalnızca kelimeleri değil tüm pasajları gömlersiniz. Kalite çok daha yüksektir.

### Bir embedding kaç boyutlu olmalı?

Çoğu uygulama için 768 ile 1.536 boyut, kalite ile maliyet arasındaki tatlı noktadır. Daha yükseğe (3.072) yalnızca kendi verinizde getirmeyi iyileştirdiğine dair sağlam kanıtınız varsa çıkın. Matryoshka destekli modellerle yüksek başlayıp sonradan kırpabilirsiniz, yani kilitli kalmazsınız. Hem depolama hem arama gecikmesi boyutla artar, o yüzden fazlasını almayın.

### API olmadan embedding üretebilir miyim?

Evet. `bge-m3` ya da `nomic-embed-text-v2` gibi açık modeller; sentence-transformers ya da Ollama gibi kütüphanelerle yerel olarak, çağrı başına maliyet olmadan ve tam veri gizliliğiyle çalışır. Bir miktar kaliteyi ve operasyon yükünü kontrol karşılığında takas edersiniz. Yüksek hacimli ya da şirket içi iş yükleri için açık bir embedding modelini kendiniz barındırmak çoğu zaman uzun vadede daha ucuzdur.
