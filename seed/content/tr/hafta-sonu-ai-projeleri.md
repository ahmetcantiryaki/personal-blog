---
title: "Bu Hafta Sonu Yapılacak 5 AI Projesi"
slug: "hafta-sonu-ai-projeleri"
translationKey: "weekend-ai-project-ideas"
locale: "tr"
excerpt: "Bir hafta sonuna sığan beş AI proje fikri — PDF için RAG soru-cevap, çok modelli oyun alanı, PR inceleme ajanı, CSV analizcisi — ve neden tek derin projenin yeğ olduğu."
category: "ai"
tags: ["ai-tools", "rag", "llm", "portfolio", "learning"]
publishedAt: "2026-07-07"
seoTitle: "Bu Hafta Sonu Yapılacak 5 AI Projesi (2026)"
seoDescription: "2026 için hafta sonuna sığan beş AI proje fikri: PDF için RAG soru-cevap, çok modelli oyun alanı, PR inceleme ajanı ve doğal dille CSV analizcisi — yığın ve kapsamla."
---

Şimdiye kadar yayımladığım en iyi portfolyo projesi, bir cumartesi öğleden sonrası başlayan ve tek bir sayının — erişim doğruluğunun — peşinde iki haftalık takıntıya dönüşen bir hack'ti. En kötüleri ise her biri tek bir zekice şeyi yapan ama mülakatta anlatabileceğim hiçbir şey öğretmeyen on parlak demoydu. Bu yazının bütün mevzusu tam da o fark. Temmuz 2026 itibarıyla araçlar öyle bir noktada ki aşağıdaki beş projeden herhangi biri bir hafta sonuna sığıyor — ama sizi işe aldıran projeler, nerede kırıldığını anlayana dek kurcalamaya devam ettikleriniz.

## Neden tek derin proje, on sığ demoyu döver

İşe alım yöneticileri "LLM'i bir sohbet kutusuna bağladım" demosunu binlerce kez gördü. Bu, bir hızlı başlangıç kılavuzunu takip edebildiğinizden başka hiçbir şey söylemez. Ekran paylaşımında ayakta kalan şey, *neden* sorusuna cevap verebildiğiniz projedir: neden 800 değil de 400 token'lık parçalar, neden yeniden sıralama yaptın, model 14. soruda neden kendinden emin bir şekilde yalan söyledi ve buna ne yaptın.

O yüzden listeden tek bir fikir seçin, uçtan uca kurun, sonra hafta sonunun ikinci yarısını onu dürüst kılmaya harcayın — gerçek bir README, küçük bir değerlendirme (eval) seti ve yazılı bir "sınırlamalar" bölümü. Değerlendirmeleri olan belgelenmiş bir vaka çalışması "senior" gibi okunur. Bir demo klasörü ise bootcamp ödevi gibi. Sıfırdan portfolyo kuruyorsanız, [geliştirici portfolyosu rehberimiz](/tr/posts/gelistirici-portfolyosu-olusturma) bunları gerçekten okunacak şekilde nasıl çerçeveleyeceğinizi anlatıyor.

## Beş proje

Her biri 2026 araçlarıyla bir hafta sonuna sığacak kapsamda. En zayıf olduğunuz beceriyi öğreten hangisiyse ondan başlayın.

### 1. Kendi PDF'lerin üzerine bir RAG asistanı

Gerçekten önemsediğiniz belgelere yöneltin — vergi formları, bir kira sözleşmesi, bir yığın makale — ve düz Türkçeyle soru sorun. Parçalama (chunking), embedding ve erişimdeki en hafife alınan düğmeyi öğreneceksiniz: sistemin halüsinasyon yerine ne zaman "bilmiyorum" demesi gerektiğine karar veren benzerlik eşiği.

Bu, klasik ilk AI projesidir çünkü her hata gözle görülür. Parça çok büyükse cevaplar bulanıklaşır; çok küçükse bağlamı kaybedersiniz; eşik çok düşükse çöp içeri sızar. Tam bir anlatımı [RAG sistemi nasıl kurulur](/tr/posts/rag-sistemi-nasil-kurulur) yazısında yazdık; "vektörleri nereye koyacağım" sorusuna geldiğinizde de [vektör veritabanı karşılaştırması](/tr/posts/vektor-veritabani-karsilastirma) size bir öğleden sonralık araştırma kazandırır.

**Vaka çalışmasına dönüştür:** her sorguyu logla, hangi cevapların yanlış olduğunu işaretle ve README'de önce/sonra doğruluk oranını raporla.

### 2. Çok modelli bir oyun alanı

Aynı prompt'u birkaç modele yan yana akıtın; gecikmeyi, maliyeti ve kaliteyi tek ekranda karşılaştırın. Bu, size modellerin birbirinin yerine geçemeyeceğini öğreten proje — ucuz olan bazı prompt'ları kazanır, sınır modeli başkalarını ve onları yarışırken izlemeden bunu hissedemezsiniz.

Dağıtım (fan-out) bir düzine satır: bir kez gönder, üç sütun çiz.

```ts
const models = [
  { id: "claude-sonnet-5", label: "Claude Sonnet 5" },
  { id: "gpt-5.5", label: "GPT-5.5" },
  { id: "gemini-3.1-pro", label: "Gemini 3.1 Pro" },
];

const results = await Promise.all(
  models.map(async (m) => {
    const start = performance.now();
    const text = await callModel(m.id, prompt);
    return { label: m.label, text, ms: Math.round(performance.now() - start) };
  })
);
```

Oyun alanınızın öne çıkarması gereken tablo şuna benzer. Yayımlamadan önce canlı model ID'lerini ve fiyatları doğrulayın — bunlar her ay değişiyor.

| Model | Bağlam penceresi | Fiyat / 1M token (giriş / çıkış) | Not (Temmuz 2026) |
| --- | --- | --- | --- |
| Claude Sonnet 5 | 1M | $2 / $10 (tanıtım, 31 Ağustos'a dek) | Anthropic'te varsayılan; güçlü fiyat/kalite |
| GPT-5.5 Instant | 400K | $5 / $30 | Güvenilir genel varsayılan |
| Gemini 3.1 Pro | 2M | $2 / $12 | Devasa bağlam, uzun belgeler için iyi |

Ders, bir maliyet sayacı ekleyip "en iyi" modelin küresel değil prompt-başına bir karar olduğunu fark ettiğinizde oturur. Yan yana izlenimleri gerçek bir hükme çevirmek için [LLM çıktıları nasıl değerlendirilir](/tr/posts/llm-ciktilari-degerlendirme) yazısındaki puanlama yaklaşımını ekleyin.

### 3. Bir AI kod inceleme ajanı

Pull request'leri inceleyen bir bot kurun: diff'i GitHub API üzerinden çeker, bir inceleme rubriğiyle LLM'den geçirir ve satır içi yorumlar bırakır. Bir Next.js route'u artı LangGraph.js gibi bir orkestrasyon katmanı, hafta sonu v1'i için yeterli.

Bu proje, bir iş akışı (workflow) ile bir ajan arasındaki farkı öğretir — sabit bir "diff → prompt → yorum" hattı ile hangi dosyaların daha yakından bakılmayı hak ettiğine karar veren bir döngü. Bu ayrım muğlaksa, başlamadan önce [AI agent mı workflow mu](/tr/posts/ai-agent-mi-workflow-mu) yazısını okuyun; döngüyü fazla mühendisleştirmenizi engeller.

Tuzak: LLM'ler bir linter'ın zaten yakaladığı stil ayrıntılarını didiklemeye bayılır. İlginç mühendislik *susturma*da — statik bir aracın söyleyemeyeceği bir şeyi olmadıkça sessiz kalmayı öğretmekte.

### 4. Doğal dille CSV analizcisi

Bir CSV yükleyin, düz Türkçeyle soru sorun; geri dönüşte bir grafik, sade dilde bir özet ve — asıl önemli kısım — bir **uyarılar** bölümü alın. "Bu eğilim 43 satıra dayanıyor; son çeyrek eksik; iki aykırı değer korelasyonun çoğunu sürüklüyor." İşte o uyarılar bloğu, bir oyuncağı araçtan ayıran beceriyi — AI güvenilirlik muhakemesini — öğrendiğiniz yer.

Naif sürüm bütün dosyayı prompt'a boca eder ve umut eder. İyi sürüm ise modele veri üzerinde çalışacak sorgu kodu yazdırır, onu deterministik biçimde çalıştırır ve LLM'i yalnızca anlatı için kullanır. Sayıları izlenime değil gerçek hesaba dayandırmak, [LLM halüsinasyonlarını azaltma](/tr/posts/llm-halusinasyon-azaltma) yazısının ardındaki disiplinle aynı şey.

### 5. Bunlardan biri için bir eval harness

Sinsi "senior" hamlesi: beşinci bir uygulama kurmayın — zaten yaptığınız birinin test takımını kurun. Yirmi ila elli soru/cevap çifti, otomatik bir puanlayıcı ve prompt'ları ya da modelleri değiştirdikçe doğruluğu izleyen bir tablo. Yarım günlük iş ama junior bir portfolyodaki en etkileyici tek şey, çünkü neredeyse kimse yapmıyor.

## Başlamadan kapsam kontrolü

Logoya değil, istediğiniz beceriye göre seçebilmeniz için kaba bir harita.

| Proje | Öğrettiği temel beceri | Asgari yığın | En zor kısmı |
| --- | --- | --- | --- |
| PDF RAG soru-cevap | Parçalama, erişim eşikleri | Embedding + bir vektör deposu | "Bilmiyorum" demeyi bilmek |
| Çok modelli oyun alanı | Maliyet/gecikme/kalite dengesi | Streaming + 3 model API'si | Adil, elmayla elma puanlama |
| PR inceleme ajanı | Ajan mı workflow mu | Next.js + GitHub API + LangGraph.js | Gürültüyü bastırmak |
| CSV analizcisi | AI güvenilirlik muhakemesi | Pandas/DuckDB + grafik kütüphanesi | Sayıları dayandırma, dürüst uyarılar |
| Eval harness | Ölçüm disiplini | Bir test seti + puanlayıcı script | Adil test vakaları yazmak |

## Hafta sonu hack'inden vaka çalışmasına

Yapım kısmı kolay olan %60. Sizi işe aldıran %40:

- **Bir tez savunan README.** "Nasıl çalıştırılır" değil — *ne öğrendiğiniz*. Oynattığınız sayı ve seçtiğiniz denge ile açın.
- **Küçük bir eval seti.** Geç/kal sütunu olan yirmi vaka bile tahmin değil ölçüm yaptığınızı kanıtlar. 5 numaralı projeden itibaren baştan içine koyun.
- **Dürüst bir sınırlamalar bölümü.** "Taranmış PDF'lerde başarısız, 50 sayfadan sonra bozulur, kimlik doğrulama yok." Projenizin zayıf noktalarını adıyla söylemek, olabilecek en güçlü kıdem sinyalidir — ve aynı zamanda iyi bir dokümantasyon pratiğidir.

Ölçülü bir çıkışım: gerçek bir eval tablosu olan bakımsız görünüşlü bir RAG uygulaması, hiçbiri olmayan güzel bir sohbet arayüzünü her seferinde döver. Cila artık ucuz; muhakeme değil. Birini yayımladıktan sonra daha fazla fikir için bütün [yapay zeka kategorisi](/tr/category/yapay-zeka) elinizin altında.

## Sıkça Sorulan Sorular

### Bunlar gerçekte ne kadar sürüyor?

Tek bir projenin çalışan v1'i bir hafta sonuna sığar — 2026 araçları ve bir başlangıç şablonuyla 8 ila 12 odaklı saat deyin. Vaka çalışması katmanı (README, eval'ler, sınırlamalar) bir yarım gün daha ve en çok önemli olan da o yarım gün.

### Yeni başlayan biri hangisiyle başlamalı?

PDF RAG soru-cevap. Her hata biçimi görünür ve düzeltilebilir, kavramlar (parçalama, embedding, erişim) neredeyse her AI projesine aktarılır ve takıldığınızda en çok öğrenme kaynağı bunda mevcut.

### GPU'ya ya da ücretli API anahtarlarına ihtiyacım var mı?

GPU yok. Ücretli bir API anahtarı işinize yarar ama güncel modellerde bir hafta sonluk deney birkaç dolara mal olur, üstelik çok modelli oyun alanı size o faturayı küçük tutmayı bizzat öğretir.

### İşe alım yöneticileri hafta sonu projelerini önemsiz bulmaz mı?

Yalnızca onları demo olarak sunarsanız. Bir mühendislik vaka çalışması gibi belgelenmiş — ölçülmüş bir sonuç ve adı konmuş sınırlamalarla — bir hafta sonu projesi, neden çalıştığını anladığınıza dair kanıtı olmayan büyük bir projeden çok daha ciddi okunur.

**Kaynaklar:** [Dataquest: AI Projects](https://www.dataquest.io/blog/ai-projects/), [KDnuggets: 7 Real-World AI Projects to Build in 2026](https://www.kdnuggets.com/7-real-world-ai-projects-to-build-in-2026-with-guides), [Careery: AI Engineer Project Ideas](https://careery.pro/blog/ai-careers/ai-engineer-project-ideas), [LLM-Stats: Model Updates](https://llm-stats.com/llm-updates)
