---
title: "RAG Değerlendirmesi: Hangi Metrikler Önemli?"
slug: "rag-degerlendirmesi-hangi-metrikler-onemli"
translationKey: "rag-evaluation-metrics-2026"
locale: "tr"
excerpt: "Erişimi recall@k ve nDCG ile, üretimi faithfulness ve answer relevancy ile kontrol edin. Göz kararı inceleme, ikisinin de yakaladığı regresyonları kaçırır."
category: "ai"
tags: ["rag", "evals", "llm", "machine-learning"]
publishedAt: "2026-10-25"
seoTitle: "RAG Değerlendirme Metrikleri: Ne Ölçülmeli, Neden?"
seoDescription: "Recall@k, nDCG, faithfulness ve answer relevancy her biri farklı bir RAG hatasını yakalar. Bunları regresyonu engelleyen bir altın küme ile birleştirin."
---

Kısa cevap: bir RAG hattı iki ayrı metrik setine ihtiyaç duyar — doğru parçaların çekilip çekilmediğini kontrol eden erişim metrikleri (recall@k, precision@k, MRR, nDCG) ve modelin o parçaları doğru kullanıp kullanmadığını kontrol eden üretim metrikleri (faithfulness, answer relevancy, context precision). İkisinden birini atlamak, elle yapılan hızlı bir kontrolde "sorunsuz görünen" regresyonları üretime sızdırmak demektir.

## RAG neden elle incelemeye değil metriklere ihtiyaç duyar?

Kısa cevap: çünkü beş örnek cevabı okuyan bir insan, erişim recall'ındaki %15'lik bir düşüşü fark edemez; kendinden emin görünen bir model de elindeki bağlama sadık kalmayabilir. Her iki hata türü de yaygındır ve sabit, tekrarlanabilir bir test kümesi olmadan ikisi de görünmezdir.

Pratikte en çok zarar veren hata, sessiz erişim kaymasıdır: biri belge kümesini yeniden parçalara ayırır, embedding modelini değiştirir ya da bir reranker ekler ve genel cevap kalitesi hızlı kontrollerde değişmemiş gibi görünür — çünkü model, eksik bağlamın üzerini kendi eğitim bilgisiyle örter. Dondurulmuş bir altın kümede çalışan otomatik metriklerin yakaladığı, beş dakikalık bir göz kararı kontrolün yakalayamadığı tam olarak bu durumdur.

## Recall@k, precision@k, MRR ve nDCG gerçekte neyi ölçer?

Kısa cevap: bu dört metrik, üretim hiç çalışmadan önce, retriever'ınızın döndürdüğü parçaları her sorgu için önceden etiketlenmiş "döndürülmesi gereken" parça kümesiyle karşılaştırarak sadece erişim adımını puanlar.

- **Recall@k** = (ilk k içinde çekilen ilgili parça sayısı) / (sorgu için var olan toplam ilgili parça sayısı). "İlgili olan her şeyi bulduk mu?" sorusunu cevaplar, sıralamayı göz ardı eder.
- **Precision@k** = (ilk k içinde çekilen ilgili parça sayısı) / k. "Döndürdüğümüzün ne kadarı gerçekten işe yaradı?" sorusunu cevaplar.
- **MRR (Mean Reciprocal Rank)** = sorgular arasında ilk ilgili sonucun 1/sıra değerinin ortalaması. İlk ilgili sonuç 1. sırada ise 1.0, 4. sırada ise 0.25 puan alır. Listede bir yerde olmasını değil, en iyi parçayı en üste yakın getirmeyi ödüllendirir.
- **nDCG@k (normalize edilmiş Discounted Cumulative Gain)** = DCG@k / IDCG@k; burada DCG@k her sonucun ilgi puanını sıra konumuna göre indirgeyerek toplar. Diğer üçünden farklı olarak nDCG, derecelendirilmiş ilgiyi (bir parça sadece "ilgili/ilgisiz" değil "kısmen ilgili" de olabilir) destekler ve sadece ilgili bir parçayı değil, en ilgili parçaları önce getirmeyi ödüllendirir.

| Metrik | Neyi ödüllendirir | Neyi göremez |
| --- | --- | --- |
| Recall@k | Tüm ilgili parçaları bulmayı | Sıralama düzenini |
| Precision@k | Çoğunlukla ilgili parça döndürmeyi | İlk k dışındaki kayıp parçaları |
| MRR | Güçlü bir ilk sonucu | İlk sonuçtan sonrakilerin kalitesini |
| nDCG@k | Derecelendirilmiş ilgiyle doğru sıralamayı | Önemli bir şeyi görmez — son kullanıcının algıladığı kaliteye en yakını |

## Faithfulness, answer relevancy ve context precision neyi ölçer?

Kısa cevap: bunlar Ragas çerçevesinden gelen, modelin çıktısını erişimin kusursuz olup olmadığından bağımsız olarak çektiği bağlama karşı puanlayan üretim tarafı metrikleridir. Faithfulness, cevaptaki her iddianın gerçekten çekilen parçalarla desteklenip desteklenmediğini kontrol eder — halüsinasyon dedektörünüzdür. Answer relevancy, cevap tamamen bağlama sadık olsa bile, kullanıcının gerçekte sorduğu şeye hitap edip etmediğini kontrol eder. Context precision ise çekilen ve yüksek sıralanan parçaların doğru bir cevap üretmek için gerçekten işe yarayıp yaramadığını kontrol eder; bu, puanlama için bir referans cevap gerektirir.

Bir model faithfulness'ta iyi puan alırken answer relevancy'de kötü puan alabilir — çekilen belgeleri doğru özetlemiş ama soruyu hiç cevaplamamıştır. Bu fark, tek bir birleşik "kalite" puanı yerine neden her iki metriğe de ihtiyacınız olduğunu gösterir.

```python
from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy, context_precision, context_recall
from datasets import Dataset

altin_kume = Dataset.from_dict({
    "question": sorular,
    "contexts": cekilen_baglamlar,   # her soru için list[list[str]]
    "answer": uretilen_cevaplar,
    "ground_truth": referans_cevaplar,
})

sonuc = evaluate(
    altin_kume,
    metrics=[faithfulness, answer_relevancy, context_precision, context_recall],
)
print(sonuc)
```

## Regresyonu gerçekten yakalayan bir altın soru kümesi nasıl kurulur?

Kısa cevap: üretim loglarından ya da destek taleplerinden 50-200 gerçek soru çekin, her birini cevaplaması gereken parçaları elle etiketleyin ve bu kümeyi dondurun; böylece her pipeline değişikliği tam olarak aynı taban çizgisine karşı puanlanır. Ekibinizin kendi uydurduğu sorulardan oluşan bir altın küme, gerçek kullanıcıların sorduğundan genellikle daha kolay olur ve bu da yakalamaya çalıştığınız hataları tam olarak gizler.

Kümeyi zorluğa göre bölün — tek ve net cevabı olan sorular, birden fazla parçanın birleştirilmesini gerektiren sorular ve doğru cevabın "belgeler bunu söylemiyor" olduğu düşmanca sorular. Son kategori önemli: hiçbir zaman "bilmiyorum" demeyen bir RAG sistemi genellikle faithfulness'ta sessizce başarısız oluyor, bir erişim kaçırmasını kabul etmek yerine boşlukları icat edilmiş gerçeklerle dolduruyordur.

## RAG regresyonları CI'da nasıl kapıya bağlanır?

Kısa cevap: erişimi, parçalamayı ya da sistem prompt'unu etkileyen her pull request'te altın kümeyi tam pipeline üzerinden çalıştırın; recall@k, faithfulness ya da answer relevancy son bilinen iyi taban çizgisinden sabit bir eşiğin altına düşerse derlemeyi başarısız yapın. Bunları ara sıra bakılan bir panoymuş gibi değil, birim test iddiaları gibi ele alın.

Eşik, mutlak bir çizgi değil bir regresyon kontrolü olmalı — sayıları bir blog yazısından değil kendi taban çizgisi koşunuzdan seçin. Kendi derlemlerinde faithfulness taban çizgisi 0,81 olan bir ekip, başka birinin verisinde ölçülmüş evrensel bir "0,9 iyidir" sayısını kovalamak yerine yaklaşık 0,78'in altına düşüşlerde kapıyı kapatmalı.

Açıkça belirtmeye değer bir tuzak: faithfulness ve answer relevancy'yi değerlendirmek için cevapları ürettiğiniz aynı LLM'i kullanmak, hakem yanlılığı getirir — değerlendiren model, kendi ifade tarzını ve akıl yürütme kalıplarını tarafsız bir değerlendiriciden daha olumlu puanlama eğilimindedir. Mümkün olduğunda değerlendirme için farklı bir model ailesi kullanın ve LLM hakeminin puanlarından bir örneği periyodik olarak insan etiketleriyle karşılaştırarak hakemin kendisindeki kaymayı yakalayın.

## RAG değerlendirmelerini hangi hatalar işe yaramaz hale getirir?

Kısa cevap: en yaygın üç hata şunlar — istatistiksel olarak anlamlı olmayacak kadar küçük bir altın küme (30 sorudan az), prompt'ları ayarlamak için kullanılan aynı soruların "doğrulama" için yeniden kullanıldığı test sızıntısı ve cevap kalitesini değerlendirilen modelin kendisiyle puanlamak. Üçü de harika görünen ama neredeyse hiçbir şey ifade etmeyen değerlendirme sayıları üretir.

20 sorudan oluşan bir altın küme, küçük belirsizlikler yüzünden bir koşudan diğerine iki üç doğru/yanlış cevap kayabilir; bu da raporlanan bir "%4 iyileşme"yi gerçek bir sinyal değil istatistiksel gürültü yapar. Pipeline sürümleri arasındaki küçük yüzde değişikliklerine güvenmeden önce 100'den fazla etiketli soruya ulaşmaya çalışın.

Bu problemin ajan tarafı için [sıfırdan RAG sistemi kurma rehberimize](/tr/posts/rag-sistemi-nasil-kurulur), RAG hattınız çok ajanlı bir kurulumu besliyorsa turlar arasında hangi bağlamın hayatta kaldığı sorununu ele alan [AI ajan belleği sistemleri](/tr/posts/ai-ajan-bellegi-sistemleri) yazımıza bakabilirsiniz. Daha geniş bağlam mühendisliği için [Yapay Zeka kategorimize](/tr/category/yapay-zeka) göz atın.

Dürüst değerlendirmem: çoğu ekip erişim metriklerini tamamen atlıyor ve sadece son cevaplara göz kararı bakıyor; bu tersine işleyen bir yaklaşım — bozuk bir retriever'ı yakalamak ve düzeltmek bozuk bir prompttan daha ucuzdur, ama etiketli parçalara karşı recall@k'yı doğrudan ölçmediğiniz sürece görünmezdir.

## Sıkça Sorulan Sorular

### RAG değerlendirmesinde recall@k ve precision@k arasındaki fark nedir?

Recall@k, sırayı göz ardı ederek tüm ilgili parçaların ne kadarının ilk k sonuç içinde çekildiğini ölçer. Precision@k, ilk k sonucunuzun ne kadarının gerçekten ilgili olduğunu ölçer. Bir retriever, çoğu ilgisiz olan birçok parça döndürerek yüksek recall ve düşük precision'a sahip olabilir.

### RAG değerlendirmesinde faithfulness ne anlama gelir?

Faithfulness, üretilen bir cevaptaki her iddianın icat edilmek ya da modelin eğitim verisinden çekilmek yerine gerçekten çekilen bağlamla desteklenip desteklenmediğini ölçer. Bir RAG sisteminde halüsinasyonu tespit etmek için birincil metriktir ve iddia bazında hesaplanıp cevap boyunca ortalanır.

### Bir altın RAG değerlendirme kümesinde kaç soru olmalı?

Pipeline sürümleri arasındaki küçük yüzde değişikliklerine güvenmeden önce en az 100 elle etiketlenmiş soru hedefleyin; 30 sorudan az kümeler, gerçek bir iyileşme ya da regresyon yerine koşudan koşuya gürültüde sallanan değerlendirme puanları üretir.

### RAG cevaplarını üretmek ve puanlamak için aynı LLM kullanılabilir mi?

Kullanılabilir, ama hakem yanlılığı getirir: değerlendiren model kendi ifade tarzını ve akıl yürütme kalıplarını tarafsız bir değerlendiriciden daha olumlu puanlama eğilimindedir. Değerlendirme için farklı bir model ailesi kullanın ve puanlarından bir örneği periyodik olarak insan etiketleriyle karşılaştırın.

Kaynaklar:
- [Ragas dokümantasyonu](https://docs.ragas.io/)
- [RAG Evaluation Explained (Atlan)](https://atlan.com/know/how-to-evaluate-rag-systems-explained/)
- [RAGAS metrikleri sözlüğü (PromptLayer)](https://www.promptlayer.com/glossary/ragas-metrics)
