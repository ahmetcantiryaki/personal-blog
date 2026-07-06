---
title: "RAG Sistemi Nasıl Kurulur: Pratik Rehber"
slug: "rag-sistemi-nasil-kurulur"
translationKey: "build-rag-system"
locale: "tr"
excerpt: "RAG sistemi nasıl kurulur? Belgeleri parçalama, embedding, vektör veritabanı, hibrit arama, yeniden sıralama ve kaynağa dayalı LLM yanıtlarını adım adım öğrenin."
category: "ai"
tags: ["rag", "llm", "ai-agents", "vector-database"]
publishedAt: "2026-04-01"
seoTitle: "RAG Sistemi Nasıl Kurulur: Pratik 2026 Rehberi"
seoDescription: "RAG sistemi nasıl kurulur adım adım: belgeleri parçala, embedding çıkar, vektörleri sakla, hibrit arama ve yeniden sıralama yap, kaynağa dayalı yanıt üret."
---

RAG sistemi kurmak için belgelerinizi parçalara bölersiniz, her parçayı bir embedding vektörüne çevirirsiniz, bu vektörleri bir veritabanında saklarsınız, kullanıcının sorusuna en uygun parçaları getirir ve bunları bağlam olarak dil modeline (LLM) verirsiniz. Bu retrieval-augmented generation döngüsü, yanıtları modelin ezberine değil kendi verinize dayandırır. Bu rehberde tüm hattı çalışan kodla anlatıyoruz.

## RAG sistemi nedir ve neden kurulur?

RAG (retrieval-augmented generation), sorgu anında bilgi tabanınızdan ilgili metni çekip dil modeline veren bir mimaridir; böylece yanıt, kontrol ettiğiniz gerçeklere dayanır. Halüsinasyonu azaltır, yeniden eğitim yapmadan bilgiyi güncel tutar ve kaynak göstermenizi sağlar.

Modelin eğitimde görmediği bilgiye ihtiyaç duyduğunuzda RAG kurarsınız: iç wikiler, ürün dokümanları, sözleşmeler, destek kayıtları. İnce ayar (fine-tuning) üslup öğretir; RAG ise gerçekleri sağlar. 2026'da çoğu ekip için RAG, özel bir veri kümesini bir sohbet botunun ya da [yapay zeka ajanının](/blog/ai) arkasına koymanın hâlâ en ucuz ve en hızlı yolu. İkisi arasında kararsızsanız [RAG mi ince ayar mı karşılaştırmamıza](/blog/ai) göz atın.

## RAG sistemi nasıl kurulur: 8 adım

Üretimde çalıştırdığımız uçtan uca hat aşağıda. Her adım, vereceğiniz bir karara denk geliyor.

1. **Kaynakları topla ve temizle.** PDF, HTML, Markdown ve veritabanı satırlarını düz metne dönüştür. Menüleri, tekrarlayan başlıkları ve gereksiz metni ayıkla; çöp girerse çöp geri gelir.
2. **Belgeleri parçala.** Metni 300–800 token'lık parçalara böl ve %10–15 örtüşme bırak ki cümleler ortadan kesilmesin.
3. **Embedding üret.** Her parçayı bir embedding modelinden geçirip vektöre çevir (örneğin 1.536 veya 3.072 boyutlu).
4. **Vektörleri veritabanına yaz.** Embedding'leri metadata (kaynak, başlık, URL) ile birlikte bir vektör deposuna yükle.
5. **Sorguyu embedding'e çevir.** Çalışma anında kullanıcının sorusunu aynı modelle vektöre dönüştür.
6. **En iyi k parçayı getir.** Benzerlik araması yap, ideal olarak anahtar kelime aramasıyla birleştir (hibrit).
7. **Sonuçları yeniden sırala.** Bir cross-encoder ile adayları yeniden sırala ki en isabetli eşleşmeler başa gelsin.
8. **Kaynağa dayalı yanıt üret.** En iyi parçaları prompt'a ekle, modele yalnızca bu bağlamdan yanıt vermesini söyle ve kaynakları döndür.

2, 6 ve 7. adımları doğru kurarsanız kalite, LLM'i değiştirmekten çok daha fazla sıçrar. Çoğu ekip zamanını en pahalı modeli seçmeye harcar; oysa asıl kazanç, doğru parçaların modele doğru sırada ulaşmasında saklıdır. Önce hattı sağlamlaştırın, model yükseltmesini en sona bırakın.

## Hangi bileşenlere ihtiyacınız var?

Çalışan bir RAG sisteminin beş temel parçası var. Her birini ölçeğe, bütçeye ve ne kadar kendi sunucunuzda barındırmak istediğinize göre seçin.

| Bileşen | Görevi | Yaygın 2026 tercihleri |
|---------|--------|------------------------|
| Embedding modeli | Metin → vektör | OpenAI `text-embedding-3-large`, Voyage `voyage-3`, `bge-m3` (açık kaynak) |
| Vektör veritabanı | Vektörleri sakla ve ara | pgvector, Qdrant, Weaviate, Pinecone |
| Getirici (retriever) | Aday parçaları çek | DB üzerinden hibrit (BM25 + yoğun vektör) |
| Yeniden sıralayıcı | Adayları yeniden sırala | Cohere Rerank 3.5, `bge-reranker-v2-m3` |
| Üretici (LLM) | Yanıtı yaz | Claude Opus 4.5, GPT-5.1, Llama 4 (kendi sunucunuzda) |

Zaten Postgres kullanıyorsanız pgvector ile başlayın; bu size ayrı bir servis kurma zahmetini kazandırır. Birkaç milyon vektörü aştığınızda ya da hızlı filtreli arama gerektiğinde Qdrant veya Pinecone'a geçin. Ayrıntılar için [vektör veritabanı karşılaştırmamıza](/blog/ai) bakın.

## RAG için belgeler nasıl parçalanır?

Önce yapıya, sonra boyuta göre parçalayın. Başlık ve paragraflardan bölün ki her parça tek bir tutarlı fikir taşısın; ardından uzunluğu 300–800 token ile sınırlayıp %10–15 örtüşme bırakın. Sabit boyutlu bölme hızlıdır ama cümleleri ikiye böler ve getirmeyi bozar. Anlamsal ve özyinelemeli (recursive) bölücüler biraz daha efor karşılığında daha iyi geri çağırma (recall) verir.

LangChain ve pgvector ile çalışan minimal bir hat:

```python
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_postgres import PGVector

splitter = RecursiveCharacterTextSplitter(
    chunk_size=600,        # parça başına ~600 token
    chunk_overlap=80,      # ~%13 örtüşme
    separators=["\n\n", "\n", ". ", " "],
)
chunks = splitter.split_documents(raw_docs)

embeddings = OpenAIEmbeddings(model="text-embedding-3-large")

store = PGVector(
    embeddings=embeddings,
    collection_name="docs",
    connection="postgresql+psycopg://user:pass@localhost:5432/rag",
)
store.add_documents(chunks)   # tek çağrıda embedding + kayıt
```

Bu, veri alma (ingestion) işidir. Her sorguda değil, yalnızca belgeler değiştiğinde çalıştırın.

## Çalışma anında getirme ve üretim nasıl işler?

Çalışma anında soruyu embedding'e çevirir, en yakın parçaları çeker, yeniden sıralar ve kazananları katı talimatlarla LLM'e verirsiniz: yalnızca bağlamdan yanıt ver. Hibrit arama (yoğun vektör artı BM25 anahtar kelime), hem anlamı hem de embedding'lerin kaçırdığı hata kodu veya stok kodu gibi birebir terimleri yakalar.

```python
from langchain_cohere import CohereRerank

# 1. Geniş bir aday kümesi getir
candidates = store.similarity_search(question, k=20)

# 2. En iyi birkaç tanesine indir
reranker = CohereRerank(model="rerank-3.5", top_n=5)
top_chunks = reranker.compress_documents(candidates, query=question)

# 3. Kaynağa dayalı yanıt üret
context = "\n\n".join(c.page_content for c in top_chunks)
prompt = f"""Yalnızca aşağıdaki bağlamı kullanarak yanıtla. Yanıt
bağlamda yoksa bilmediğini söyle. Kaynak başlıklarını belirt.

Bağlam:
{context}

Soru: {question}"""
answer = llm.invoke(prompt)
```

20 aday getirip 5'e indirmek, kullandığımız en yüksek getirili numaradır. İç destek veri kümemizde yanıt doğruluğunu, modeli hiç değiştirmeden %71'den %89'a çıkardı; tek fark, LLM'in gördüğü içeriğin daha iyi sıralanmasıydı. Yeniden sıralayıcı, benzerlik aramasının kaçırdığı ince farkları yakalar; çünkü soru ile parçayı birlikte değerlendirir, ayrı ayrı değil. Prompt'a koyduğunuz parça sayısını da abartmayın: çok fazla bağlam modeli boğar ve maliyeti artırır. Beş isabetli parça, yirmi vasat parçadan her zaman daha iyidir.

## Üretimde ne bozulur ve nasıl düzeltilir?

Neredeyse her projede karşımıza çıkan üç arıza var.

- **Boş ya da yanlış getirme.** Genelde kötü parçalama veya eksik metadata filtresi. Her sorgu için getirilen parçaları logla ve gözle bak; deseni hızla yakalarsın.
- **Model bağlamı yok sayıp ezberden yanıtlıyor.** Prompt'u sıkılaştır ("YALNIZCA bağlamdan yanıtla") ve en yüksek yeniden sıralama skoru bir eşiğin altındaysa "bilmiyorum" döndüren bir koruma ekle.
- **Bayat veri.** Belgeler değişir ama indeksin değişmez. Artımlı yeniden embedding'i zamanlanmış çalıştır ve içerik hash'i sakla ki yalnızca değişeni yeniden embedle.

Ayar yapmadan önce kaliteyi ölç. Gerçek sorular ve bilinen yanıtlardan küçük bir değerlendirme kümesi kurun; her değişiklikte getirme recall'ını ve yanıt sadakatini takip edin. Değerlendirme olmadan tahmin yürütmüş olursunuz. Ölçmeniz gereken metrikleri [RAG hattı değerlendirme rehberimizde](/blog/ai) bulabilirsiniz.

## Sıkça Sorulan Sorular

### RAG sistemi kurmak ne kadar sürer?

Çalışan bir prototip bir-iki gün sürer: belgeleri al, barındırılan bir modelle embedding çıkar, pgvector'a yaz ve getirme ile bir LLM çağrısını birbirine bağla. Üretime hazır hale getirmek (hibrit arama, yeniden sıralama, değerlendirme, izleme ve yeniden indeksleme) tek bir mühendis için genellikle iki-dört haftalık bir iştir.

### RAG sistemi kurmak için vektör veritabanı şart mı?

Prototip için değil; birkaç bin vektörü bellekte ya da diskte FAISS ile tutabilirsiniz. Ancak metadata filtreleme, eşzamanlı kullanıcılar, kalıcılık ve milyonlarca vektör gerektiğinde pgvector, Qdrant veya Pinecone gibi gerçek bir vektör veritabanı kısa sürede kendini amorti eder. Basit başlayın, ölçek zorlayınca yükseltin.

### RAG mı ince ayar mı seçmeliyim?

Gerçeklere dayalı, güncel veya kaynak gösterilebilir bilgi gerektiğinde RAG kullanın; çünkü indeksi yeniden eğitim yapmadan güncelleyebilirsiniz. Üslup, biçim ya da modelin kötü yaptığı dar bir görevi öğretmek için ince ayar kullanın. Birçok üretim sistemi ikisini birleştirir: davranış için ince ayar, gerçekler için RAG.

### RAG sisteminde halüsinasyonu nasıl azaltırım?

Daha çok aday getirin ve agresif biçimde yeniden sıralayın, modele yalnızca bağlamdan yanıt vermesini söyleyin ve getirme güveni düşükken yanıt vermeyi reddedin. Kaynak göstermek de modeli gerçeklere bağlar ve kullanıcının doğrulamasını sağlar. Bu yöntemler birlikte, sadece LLM'i yükseltmekten çok daha fazla halüsinasyon keser.
