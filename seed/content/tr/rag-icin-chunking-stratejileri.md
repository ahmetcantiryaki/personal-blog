---
title: "RAG için Chunking Stratejileri"
slug: "rag-icin-chunking-stratejileri"
translationKey: "rag-chunking-strategies"
locale: "tr"
excerpt: "RAG doğruluğunuzun çoğu chunk boyutunuzda saklı. Sabit, recursive, semantic ve agentic chunking'i 2026 verileriyle karşılaştırıp varsayılanı gösteriyoruz."
category: "ai"
tags: ["rag", "embeddings", "llm", "best-practices"]
publishedAt: "2026-07-17"
seoTitle: "RAG Chunking Stratejileri: Doğru Boyutu Seçmek"
seoDescription: "Sabit, recursive, semantic ve agentic chunking yöntemlerini 2026 verileriyle karşılaştırıyor, doğru varsayılan boyutu ve ne zaman değişeceğini anlatıyoruz."
---

RAG sisteminizin cevapları hayal görüyorsa (halüsinasyon) ya da alakasız pasajlar döndürüyorsa, suçlu genelde embedding modeli değil chunking stratejinizdir. Şubat 2026'da yayımlanan bir kıyaslama, 50 akademik makale üzerinde yedi farklı chunking yöntemini test etti; kazanan basit bir recursive 512 token bölme oldu — karmaşık semantik yöntemleri bile geride bıraktı. Bu yazı dört yaklaşımı, doğru varsayılan boyutu ve ne zaman daha pahalı bir yönteme geçmeye değeceğini anlatıyor.

## Dört Chunking Yaklaşımı

**Sabit boyutlu (fixed-size) chunking**, metni cümle veya paragraf sınırlarını hiç gözetmeden belirli bir token sayısında böler. En hızlı ve en basit yöntem ama bir cümleyi ortadan ikiye bölme riski taşır — bu da o parçanın anlamsal bütünlüğünü bozar.

**Recursive chunking**, önce paragraf, sonra cümle, sonra kelime sınırlarında bölmeyi dener; hedef token sayısına ulaşana kadar bu hiyerarşiyi sırayla uygular. Sabit boyutlunun hızını korurken doğal metin sınırlarına saygı gösterir.

**Semantic chunking**, cümleler arası embedding benzerliğini ölçüp anlamsal olarak "konu değişen" noktalardan böler. Teoride en tutarlı parçaları üretmesi beklenir çünkü her chunk gerçekten tek bir fikre odaklanır.

**Agentic chunking**, bir LLM'e metni okutup nerede bölüneceğine kendisinin karar vermesini sağlar — en yüksek kalite potansiyeline sahip ama her chunk için bir model çağrısı gerektirdiğinden en yavaş ve en pahalı yöntem.

## Şubat 2026 Kıyaslaması Ne Gösterdi

Vecta'nın Şubat 2026'da yayımladığı kıyaslama, 50 akademik makale üzerinde yedi chunking stratejisini test etti ve sonuç çoğu ekibin varsayımını tersine çevirdi: **recursive 512 token bölme %69 doğrulukla birinci sırada** çıktı. Semantic chunking ise %54'te kaldı — sebep, üretilen parçaların ortalama sadece 43 token uzunluğunda olması; bu kadar küçük parçalar bağlamı yeterince taşımıyor ve arama modeli doğru parçayı bulmakta zorlanıyor. Daha önceki bir LlamaIndex çalışması ise 1024 token'ın "faithfulness" (üretilen cevabın kaynağa sadakati) açısından tepe noktaya yakın olduğunu bulmuştu — yani "büyük chunk her zaman kötü" de değil, doğru boyut göreve bağlı.

| Strateji | Şubat 2026 kıyaslamasında doğruluk | Hız | Ne zaman tercih edilir |
|---|---|---|---|
| Sabit boyutlu | Recursive'in gerisinde | En hızlı | Hızlı prototip, yapılandırılmış/tekdüze metin |
| Recursive (512 token) | %69 — birinci | Hızlı | 2026 için varsayılan başlangıç noktası |
| Semantic | %54 — parçalar çok küçük kaldı | ~14 kat daha yavaş | Doğal dil ağırlıklı, yapısız düzyazı; ince ayar gerektirir |
| Agentic | Kıyaslamada test edilmedi, kalite en yüksek kabul edilir | En yavaş, en pahalı | Yüksek değerli, düşük hacimli belgeler |

Chonkie'nin ayrı bir hız kıyaslaması, token-tabanlı chunking'in yaklaşık 4,82 MB/sn işlerken semantic chunking'in yaklaşık 0,33 MB/sn'de kaldığını gösteriyor — kabaca 14 kat fark. Büyük bir korpus için bu, dakikalar ile saatler arasındaki farka denk geliyor.

## Varsayılan: Recursive 512 Token, %10-20 Örtüşme

Kıyaslama verisiyle doğrulanan varsayılan nokta net: **512 token, %10-20 (50-100 token) örtüşmeyle recursive bölme**. Örtüşme, bir chunk'ın sınırında kesilen bir cümlenin bağlamının komşu chunk'ta da bulunmasını sağlıyor — aksi halde arama, bir cümlenin yarısını bulup diğer yarısını kaçırabilir.

```python
from langchain_text_splitters import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=512,          # token yaklaşık karşılığı (token-aware sayaç önerilir)
    chunk_overlap=80,        # ~%15 örtüşme
    separators=["\n\n", "\n", ". ", " ", ""],
)

chunks = splitter.split_text(document_text)
```

Token sayısını karakter sayısıyla karıştırmamak önemli — `chunk_size`'ı gerçek bir tokenizer (örneğin `tiktoken`) ile ölçmek, embedding modelinizin token limitine daha yakın bir tahmin verir.

## Semantic Chunking Ne Zaman Gerçekten Kazanıyor

Kıyaslamadaki düşük skor semantic chunking'i tamamen çöpe atmak anlamına gelmiyor — sorun yöntemin kendisinden çok varsayılan parametrelerinden kaynaklanıyordu. Minimum chunk boyutuna bir alt sınır koyup (örneğin en az 150-200 token) sadece bunun üzerindeki bölme noktalarını kabul ederseniz, semantic chunking'in ürettiği aşırı küçük parçalar sorunu büyük ölçüde azalır. Yapısı zayıf, uzun ve konudan konuya sık geçiş yapan düzyazı (mülakat transkriptleri, forum başlıkları) için semantic chunking hâlâ recursive'den daha tutarlı sonuç verebilir — ama bunu üretime almadan önce kendi veri setinizde ayarlayıp ölçmeniz şart.

**Late chunking**, son dönemde öne çıkan bir alternatif: belgeyi tam haliyle uzun bağlamlı bir embedding modelinden geçirip *sonra* token seviyesindeki embedding'leri chunk'lara ayırıyor. Böylece her chunk'ın embedding'i, belgenin tamamının bağlamını taşıyor — küçük bir chunk bile komşu paragraflardan kopmuyor. Uzun bağlam destekleyen embedding modelleri (8K+ token) yaygınlaştıkça bu yöntem agentic chunking'in kalitesine, sabit boyutlunun maliyetine yakın bir noktada duruyor.

## Strateji Seçim Akışı

Karar basit bir sırayla ilerliyor: önce recursive 512 token + %15 örtüşmeyle başlayın ve bunu ölçün. Retrieval metrikleriniz (precision@k, recall@k) hedefin altında kalıyorsa ve belgeleriniz yapısız, uzun düzyazıysa semantic chunking'i minimum boyut sınırıyla deneyin. Chunk boyutu ne olursa olsun bağlam kaybı yaşıyorsanız late chunking'e geçin. Belge hacmi düşük ama her belgenin doğru bölünmesi kritikse (örneğin hukuki sözleşmeler) agentic chunking'in maliyetini göze alın. Hiçbir zaman "varsayılanı kullan, hiç ölçme" demeyin — chunking, RAG pipeline'ının sessizce en çok hata biriktiren katmanı.

## Chunk Metadata'sını Atlamayın

Chunk boyutu kadar önemli ama sıkça göz ardı edilen bir konu: her chunk'ın yanına hangi metadata'yı ekleyeceğiniz. Kaynak belge başlığı, bölüm başlığı, sayfa numarası ve oluşturulma tarihi gibi alanları chunk'ın kendisiyle birlikte saklamak, hem arama kalitesini artırıyor (bazı arama motorları metadata'yı filtreleme için kullanabiliyor) hem de LLM'e chunk'ı beslerken kaynağı doğru şekilde göstermenizi sağlıyor.

```python
chunk_record = {
    "text": chunk_text,
    "metadata": {
        "source_title": "Şirket İzin Politikası",
        "section": "Yıllık İzin",
        "page": 4,
        "updated_at": "2026-06-01",
    },
}
```

Bu metadata'yı embedding'in kendisine değil, vektör veritabanınızın ayrı bir alanına yazmanız önemli — aksi halde metadata metni embedding'i kirletip anlamsal aramayı bozabilir. Kaynak belge güncellendiğinde eski chunk'ları silip yenilerini eklemek için de bu metadata'ya ihtiyacınız var; `source_title` ve `updated_at` gibi alanlar olmadan hangi chunk'ların hangi belgeye ait olduğunu yeniden hesaplamak, yeniden indekslemeyi gereksiz yere pahalı hale getirir.

## Değerlendirme Notu

Chunking stratejisini değiştirdiğinizde retrieval kalitesini gözle değil bir eval harness'iyle ölçün: sabit bir soru-cevap seti üzerinde precision@k ve recall@k'yı her strateji için ayrı ayrı hesaplayın, üretim değişikliğini bu sayılar iyileşmeden yapmayın. [LLM çıktılarını değerlendirme rehberimiz](/tr/posts/llm-ciktilari-degerlendirme) bu eval harness'ini nasıl kuracağınızı adım adım anlatıyor.

Chunking doğru olsa bile embedding modeliniz ve vektör veritabanınız uyumsuzsa retrieval yine zayıf kalır; [vektör veritabanları karşılaştırmamız](/tr/posts/vektor-veritabani-karsilastirma) ve [embedding rehberimiz](/tr/posts/embedding-rehberi) bu iki katmanı derinlemesine ele alıyor. RAG'i sıfırdan kuruyorsanız [RAG sistemi nasıl kurulur](/tr/posts/rag-sistemi-nasil-kurulur) rehberimiz chunking'i uçtan uca pipeline'a nasıl oturtacağınızı gösteriyor.

## Sıkça Sorulan Sorular

### RAG için en iyi chunk boyutu nedir?

Şubat 2026 kıyaslama verisine göre 512 token, %10-20 örtüşmeyle recursive bölme en yüksek genel doğruluğu veriyor. Ama bu bir başlangıç noktası — kendi veri setinizde ölçüp ayarlamanız gerekiyor.

### Semantic chunking neden kıyaslamada düşük performans gösterdi?

Varsayılan parametrelerle ürettiği parçalar ortalama 43 token gibi çok küçük kaldı; bu da yeterli bağlam taşımadıkları için arama modelinin doğru parçayı bulmasını zorlaştırdı. Minimum chunk boyutu sınırı koyarak bu sorun büyük ölçüde azaltılabilir.

### Agentic chunking ne zaman değer katıyor?

Belge hacmi düşük ama her belgenin doğru şekilde bölünmesi iş açısından kritik olduğunda (sözleşmeler, tıbbi kayıtlar gibi) — model çağrısı maliyetini haklı çıkaracak kadar yüksek değerli, düşük hacimli koleksiyonlarda.

### Late chunking diğer yöntemlerden nasıl farklı?

Diğer yöntemler önce metni böler sonra her parçayı ayrı ayrı embed eder; late chunking belgenin tamamını önce embed edip token seviyesindeki temsilleri sonra chunk'lara ayırıyor. Böylece küçük bir chunk bile belgenin genel bağlamını embedding'inde taşımış oluyor.
