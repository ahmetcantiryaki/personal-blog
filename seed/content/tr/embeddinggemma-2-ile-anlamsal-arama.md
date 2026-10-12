---
title: "EmbeddingGemma 2 ile Cihazda Anlamsal Arama"
slug: "embeddinggemma-2-ile-anlamsal-arama"
translationKey: "embeddinggemma-2-semantic-search-2026"
locale: "tr"
excerpt: "Kısa cevap: EmbeddingGemma 2 cihazda çalışıyor, metin, görsel ve sesi tek bir 768 boyutlu uzayda işliyor; veri makinenizden çıkmadığından sorgu maliyeti sıfır."
category: "ai"
tags: ["gemini", "embeddings", "on-device-ai", "rag"]
publishedAt: "2026-10-12"
seoTitle: "EmbeddingGemma 2 ile Cihazda Anlamsal Arama"
seoDescription: "Google'ın EmbeddingGemma 2'si tamamen cihazda çalışıyor ve metin, görsel, sesi tek uzayda işliyor. Kendi notlarınız üzerinde özel anlamsal arama kurma rehberi."
---

Kısa cevap: EmbeddingGemma 2, Google DeepMind'ın 6 Ekim 2026'da Apache 2.0 lisansıyla yayınladığı 740 milyon parametreli bir embedding modeli; metni, kodu, görseli ve sesi paylaşılan 768 boyutlu bir uzaya haritalıyor ve tamamen cihaz üzerinde çalışıyor — API çağrısı yok, sorgu başına maliyet yok ve aradığınız hiçbir şey makinenizden çıkmıyor.

## EmbeddingGemma 2 somut olarak nedir?

Gemma 4 üzerine inşa edilmiş açık bir embedding modeli; 270 milyon parametreli bir metin kodlayıcı, 170 milyon parametreli bir görsel kodlayıcı ve 300 milyon parametreli bir ses kodlayıcıyı birleştiriyor, hepsi tek bir paylaşılan 768 boyutlu uzaya izdüşürülüyor; böylece metin, görsel ve ses, her kip için ayrı bir hat olmadan doğrudan karşılaştırılabiliyor. 8.000 token'lık bir bağlam penceresini ve Matryoshka temsil öğrenmeyi destekliyor; bu da 768 boyutlu çıktısını, daha küçük bir indekse ihtiyaç duyduğunuzda 512, 256 veya hatta 128 boyuta kesebileceğiniz, az bir alma doğruluğunu daha az depolama ve daha hızlı aramayla takas edebileceğiniz anlamına geliyor. Google, Pixel 11 Pro üzerinde ölçülen, sadece metin iş yükleri için yaklaşık 191 MB ve tam multimodal kullanım için yaklaşık 567 MB'lık nicelenmiş bellek kullanımı bildiriyor — bir telefonda, bir dizüstü bilgisayarda hiç bahsetmeye gerek yok, çalışacak kadar küçük.

## Embedding'leri cihaz üzerinde çalıştırmak gerçekte neden önemli?

İki neden var ve birleşiyorlar. Gizlilik: barındırılan bir API'ye yapılan her embedding çağrısı metninizi (veya görselinizi, sesinizi) başka birinin sunucusuna gönderiyor; bu, notlar, sağlık verisi, iç belgeler veya kullanıcılara altyapınızdan çıkmayacağına söz verdiğiniz herhangi bir şey için gerçek bir kısıtlama. Maliyet: barındırılan bir embedding API'si gerçek ölçekte token başına veya çağrı başına ücret alıyor, cihaz üzerinde çalışan bir modelin ise sorgu hacminden bağımsız sabit bir işlem maliyeti var — yüklendikten sonra, kendi 50.000 notluk arşivinizi günde bin kez aramak, onu bir kez aramakla aynı maliyette.

Takas da gerçek: 740M'lik cihaz üzerinde bir model, gerçekten yeni veya belirsiz sorgularda bir öncü barındırılan embedding modelinin alma kalitesine erişemiyor ve sunum altyapısından — ne kadar minimal olsa da — siz sorumlu oluyorsunuz; barındırılan bir API bunların üçünü de sizin yerinize üstleniyor.

## Kendi notlarınız üzerinde gerçekte nasıl yerel anlamsal arama kurarsınız?

Kişisel ölçekli bir indeks için hiçbiri GPU gerektirmeyen dört adım:

1. **Belgelerinizi parçalayın.** Notları veya belgeleri her biri birkaç yüz token'lık pasajlara bölün — tek bir parçanın konu bakımından tutarlı olacağı kadar küçük, kendi başına yararlı bağlam taşıyacağı kadar büyük. Sınırda bir veya iki cümle çakıştırmak, ilgili bir fikri ikiye bölmekten kaçınır.
2. **Her parçayı embedle.** EmbeddingGemma 2'yi indeksleme zamanında her parça üzerinde bir kez çalıştırın, ortaya çıkan vektörü parçanın kaynak metni ve konumuyla birlikte saklayın.
3. **Vektörleri hafif bir indekste saklayın.** Kişisel veya küçük ekip arşivi için düz bir vektör deposu veya basit bir yaklaşık en yakın komşu kütüphanesi yeterli — milyonlarca parçayı indekslemediğiniz sürece dağıtık bir vektör veritabanına gerek yok.
4. **Arama zamanında sorguyu aynı şekilde embedleyin**, sonra vektör benzerliğine göre en yakın parçaları alın ve nihai yanıtı üreten şeye verin — sonuçları okuyan bir insan olsun veya alma destekli üretim yapan bir LLM olsun.

| Adım | EmbeddingGemma 2 ne yapıyor | Hâlâ sizin kurmanız gereken |
|---|---|---|
| Parçalama | Hiçbir şey — bu sizin ön işlemeniz | Parçalama mantığı, çakışma yönetimi |
| Embedleme (indeksleme zamanı) | Her parçayı 768 boyutlu bir vektöre çeviriyor | Külliyatınız üzerinde bir kez çalışan bir döngü |
| Saklama | Hiçbir şey — sadece vektör döndürüyor | Bir vektör deposu (küçük ölçekte düz dosya yeterli) |
| Sorgu embedleme | Arama sorgusunu aynı uzaya çeviriyor | Ek bir şey yok — aynı model, aynı çağrı |
| Sıralama/alma | Hiçbir şey — benzerlik araması sizin tarafınızda | Saklanan vektörler üzerinde en yakın komşu araması |

```python
# Asgari yerel anlamsal arama taslağı
embed = load_embeddinggemma2()  # bir kez yüklenir, cihaz üzerinde çalışır

def index(chunks: list[str]):
    return [(c, embed(c)) for c in chunks]

def search(query: str, indexed, top_k: int = 5):
    q_vec = embed(query)
    scored = [(c, cosine_similarity(q_vec, v)) for c, v in indexed]
    return sorted(scored, key=lambda x: x[1], reverse=True)[:top_k]
```

## Metin ve görselleri gerçekten birlikte arayabiliyor mu?

Evet — metin, görsel ve ses aynı 768 boyutlu uzaya izdüşürüldüğünden, tek bir sorgu embedding'i ayrı indeksler veya kipler arası bir çeviri adımı olmadan üçünde de arama yapabiliyor. Pratikte bu, "planlama toplantısındaki tahta çizimi" gibi bir metin sorgusunun, görsel aynı indekse alım zamanında embedlendiği sürece o tahtanın çektiğiniz bir fotoğrafını getirebileceği anlamına geliyor. [Özel anlamsal arama, karmaşıklık bakımından tam RAG'ın](/tr/posts/rag-sistemi-nasil-kurulur) bir basamak altında duruyor — RAG, almanın üstüne bir üretim adımı ekliyor, bu ise almanın özel şekilde yapılan yarısı.

## Matryoshka kesme neyi inşa ettiğinizi nasıl değiştiriyor?

Matryoshka temsil öğrenme, 768 boyutlu çıktının ilk 128 boyutunun kendisinin de, daha az kesin olsa da kullanılabilir bir embedding olduğu anlamına geliyor — yani büyük bir külliyat üzerinde ilk geçiş filtresi için küçük, hızlı aranabilen 128 boyutlu bir indeks saklayabilir, sonra en iyi adayları kesinlik için tam 768 boyutlu vektörler kullanarak yeniden sıralayabilirsiniz. Bu iki aşamalı örüntü, [bir AI ajanının hafıza sisteminin](/tr/posts/ai-ajan-bellegi-sistemleri) genellikle aldığı şekille aynı: her şey üzerinde ucuz, geniş bir ilk geçiş, sonra kısa bir liste üzerinde daha maliyetli, kesin bir geçiş.

## Cihaz üzerinde arama, barındırılan bir embedding API'sinden nerede geride kalıyor?

Üç yerde: gerçekten yeni veya belirsiz sorgularda ham alma kalitesi, burada daha büyük barındırılan bir modelin eğitim verisi ona avantaj veriyor; çok dillilik kapsamı, burada daha küçük cihaz üzerinde modeller tarihsel olarak en büyük barındırılan modellerin gerisinde kalıyor; ve bakım — model sürümünü, sunum kodunu ve indeks formatını siz sahipleniyorsunuz, barındırılan bir API bunların üçünü de sizin yerinize üstleniyor. Kişisel bir not arşivi veya küçük bir ekibin iç belgeleri için bu takas genellikle cihaz üzerini destekliyor. Birçok dilde milyonlarca sorguya hizmet veren müşteriye yönelik bir arama ürünü için ise henüz genellikle desteklemiyor.

Kişisel yorumum: EmbeddingGemma 2'nin ilginç kısmı kıyaslama rakamları değil, "özel, cihaz üzerinde, multimodal" eskiden üçünden ikisini seçmeyi gerektirirdi. Bir telefonda çalışan 567 MB'lık multimodal bir model, öncü model alma kalitesine ihtiyaç duymayan her şey için — ki bu kişisel ve küçük ekip arama kullanım örneklerinin çoğu demek — varsayılan olarak cihaz üzerini seçmeyi mantıklı kılıyor.

## Sıkça Sorulan Sorular

### EmbeddingGemma 2 nedir ve orijinal EmbeddingGemma'dan farkı ne?

6 Ekim 2026'da yayınlanan EmbeddingGemma 2, metni, görseli ve sesi 8.000 token'lık bağlam penceresiyle paylaşılan tek bir uzayda işleyen 740 milyon parametreli bir multimodal embedding modeli. 2025'te yayınlanan orijinal EmbeddingGemma ise 308 milyon parametreli, sadece metin için bir modeldi.

### EmbeddingGemma 2 gerçekten tamamen bir telefonda veya dizüstü bilgisayarda çalışabiliyor mu?

Evet. Google, Pixel 11 Pro üzerinde ölçülen, sadece metin iş yükleri için yaklaşık 191 MB ve tam multimodal kullanım için yaklaşık 567 MB'lık nicelenmiş bellek kullanımı bildiriyor; bu, modern bir telefonun veya dizüstü bilgisayarın diğer çalışan uygulamalarının yanında mevcut belleğine rahatça sığıyor.

### EmbeddingGemma 2 ile anlamsal arama kurmak için bir vektör veritabanına ihtiyacım var mı?

Küçük ölçekte hayır. Kişisel bir arşiv veya küçük bir ekibin belgeleri için her parçanın metnini ve vektörünü saklayan düz bir dosya yeterli — yalnızca milyonlarca parçayı indekslediğinizde veya yüksek sorgu hacminde milisaniyenin altında arama gecikmesine ihtiyaç duyduğunuzda özel bir vektör veritabanına gerek duyarsınız.

### Cihaz üzerinde anlamsal arama, barındırılan bir embedding API'si kadar doğru mu?

Tam olarak değil, gerçekten yeni veya belirsiz sorgularda; burada daha fazla veriyle eğitilmiş daha büyük barındırılan modeller genellikle avantajlı oluyor. İyi tanımlanmış kişisel veya iç arama için — notlar, belgeler, çektiğiniz fotoğraflar — doğruluk farkı, cihaz üzerinde aramanın gizlilik ve maliyet avantajlarının genellikle kazandığı kadar küçük.
