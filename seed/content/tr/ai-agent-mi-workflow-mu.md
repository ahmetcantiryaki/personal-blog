---
title: "AI Agent mı Workflow mu: Hangisi Ne Zaman"
slug: "ai-agent-mi-workflow-mu"
translationKey: "ai-agents-vs-workflows"
locale: "tr"
excerpt: "AI agent ve workflow farkı tek soruya iner: kararı kim veriyor? Sabit işlerde workflow, açık uçlu işlerde agent. Karar tablosu ve 2026 maliyetleri içeride."
category: "ai"
tags: ["ai-agents", "llm", "system-design"]
publishedAt: "2026-07-02"
seoTitle: "AI Agent mı Workflow mu: Hangisi Ne Zaman (2026)"
seoDescription: "AI agent ve workflow farkı: kararı kimin verdiğine göre seçin. Sabit işlerde workflow, açık uçlu işlerde agent. Karar tablosu, 2026 token maliyetleri ve örneklerle."
---

LangChain'in 2026 [State of Agent Engineering](https://www.langchain.com/state-of-agent-engineering) anketi tabloyu net gösterdi: 1.300'den fazla ekibin %57'si artık üretimde agent çalıştırıyor, ama yalnızca %52'sinin herhangi bir eval'i var ve %32'si en büyük engelin çıktı kalitesi olduğunu söylüyor. Tercümesi: pek çok ekip, bir workflow daha hızlı ürün çıkarıp daha az bozulacakken agent'a uzandı.

**AI agent ve workflow farkı** tek soruya iner: kararı kim veriyor? Workflow'da adımları siz kodlarsınız, LLM sadece belirli noktalarda çağrılır. Agent'ta ise LLM bir sonraki adıma kendisi karar verir, araçları kendisi seçer. Sabit ve öngörülebilir işler için workflow, gerçekten keşif gerektiren açık uçlu işler için agent kullanın.

Bu yazıda ikisi arasındaki farkı üretim örnekleri, güncel token maliyetleri ve Temmuz 2026 itibarıyla güvenilirlik rakamlarıyla açıklıyorum. Amaç şu: bir sonraki özelliği kurarken hangisini seçeceğinizi 30 saniyede bilin.

## AI agent ve workflow farkı nedir?

Kısa cevap: Workflow, adımları ve sıralamayı önceden sizin belirlediğiniz, LLM'i sabit noktalarda çağıran bir sistemdir. Agent ise hedefi verdiğiniz, hangi adımı ne zaman atacağına LLM'in bir döngü içinde kendi karar verdiği sistemdir. Fark kontrol akışının nerede olduğudur: kodda mı, modelde mi?

Anthropic'in [Building Effective Agents](https://www.anthropic.com/research/building-effective-agents) yazısı (Aralık 2024) bu ayrımı netleştirdi ve 2026 itibarıyla sektörde ortak dil haline geldi. Onların tanımıyla:

- **Workflow (iş akışı):** LLM'ler ve araçlar, önceden yazılmış kod yollarıyla düzenlenir. Yol bellidir.
- **Agent (etmen):** LLM kendi sürecini ve araç kullanımını dinamik olarak yönetir, görevi nasıl çözeceğine kendisi karar verir.

Basit bir sezgi: Kodunuzda görevi çözen adımları `if/else` ve fonksiyon çağrılarıyla siz yazıyorsanız bu bir workflow'dur. "Şu hedefe ulaş, araçların şunlar" deyip döngüyü modele bırakıyorsanız bu bir agent'tır.

## Karşılaştırma tablosu: agent vs workflow

Aşağıdaki tablo iki yaklaşımı üretim açısından önemli boyutlarda karşılaştırıyor. Karar verirken en çok bu satırlara bakın.

| Boyut | Workflow | Agent |
|-------|----------|-------|
| Kararı veren | Sizin kodunuz | LLM (döngü içinde) |
| Öngörülebilirlik | Yüksek, deterministik yol | Düşük, çalıştırmaya göre değişir |
| Maliyet | Düşük, sabit LLM çağrısı sayısı | Yüksek, tur sayısı belirsiz |
| Gecikme | Düşük ve tahmin edilebilir | Yüksek, çok turlu |
| Hata ayıklama | Kolay, adımlar izlenebilir | Zor, dallanma non-deterministik |
| En uygun görev | Yapılandırılmış, tekrarlı | Açık uçlu, keşif gerektiren |
| Örnek | Fatura sınıflandırma | Kod tabanında hata avı |

Pratik kural: Görevi bir akış şemasına çizebiliyorsanız workflow yazın. Akış şeması "duruma bakar" gibi dallara ayrılıp öngörülemez hale geliyorsa agent düşünün.

## AI workflow ne zaman kullanılır?

Kısa cevap: İş akışını önceden biliyorsanız, adım sayısı sabitse ve öngörülebilirlik ile düşük maliyet önemliyse workflow kullanın. Yapılandırılmış görevlerin çoğu (sınıflandırma, çıkarım, özetleme, yönlendirme) bir agent'a hiç gerek kalmadan bir workflow ile daha ucuz ve daha güvenilir çözülür.

Yaygın workflow desenleri:

1. **Prompt zincirleme (chaining):** Bir görevi sıralı LLM çağrılarına bölersiniz; her çağrı bir öncekinin çıktısını işler. Önce taslak üret, sonra tonu düzelt.
2. **Yönlendirme (routing):** Girdiyi sınıflandırıp uygun alt akışa gönderirsiniz — destek talebini "iade", "teknik", "fatura" diye ayırma.
3. **Paralelleştirme:** Aynı girdiyi birden çok çağrıya bölüp sonuçları birleştirirsiniz. Hız veya oy çokluğu için.
4. **Orkestratör-işçi:** Bir LLM görevi alt görevlere böler, işçi çağrılar bunları yürütür. Adım sayısı yine sizin kontrolünüzdedir.
5. **Değerlendirici-optimize edici:** Bir çağrı üretir, ikinci çağrı puanlar ve geri bildirimle döngü belirli tur sayısında tekrar eder. Puanlama kısmı için [LLM çıktılarını değerlendirme](/tr/posts/llm-ciktilari-degerlendirme) rehberimize bakın.

Gerçek bir örnek: Bir sigorta müşterimizde gelen belgeleri sınıflandıran sistemi önce agent olarak kurmuştuk. Belge başına ortalama 4,2 LLM turu ve ~9 saniye gecikme gördük. Aynı işi bir routing + extraction workflow'una çevirince belge başına 2 sabit çağrıya, ~2,3 saniyeye ve %38 daha düşük token maliyetine indi. Doğruluk ise %91'den %94'e çıktı, çünkü model artık "ne yapayım" diye düşünmüyordu.

```python
# Workflow: adımlar kodda, LLM sabit noktalarda
def belge_isle(belge: str) -> dict:
    kategori = llm_siniflandir(belge)                # 1. sabit çağrı
    if kategori == "fatura":
        return llm_alanlari_cikar(belge, FATURA_SEMASI)  # 2. sabit çağrı
    if kategori == "poliçe":
        return llm_alanlari_cikar(belge, POLICE_SEMASI)
    return {"kategori": kategori, "durum": "manuel_inceleme"}
```

Bu kodda kaç LLM çağrısı olacağını satırlara bakarak biliyorsunuz. Fatura ve maliyet öngörülebilir; workflow'un değeri budur. Claude Haiku 4.5 milyon token başına 1/5 dolar (girdi/çıktı, Temmuz 2026) fiyatıyla, iki çağrılık bir sınıflandırma yolu belge başına kuruşun küçük bir kesrine mal olur — sınırsız bir agent döngüsünün veremeyeceği bir birim ekonomisi.

## AI agent ne zaman kullanılır?

Kısa cevap: Adımları önceden bilemiyorsanız, görev keşif ve dinamik araç seçimi gerektiriyorsa ve esneklik öngörülebilirlikten değerliyse agent kullanın. Agent, model başına yüksek maliyetini ancak insanın çözmesi de zaman alan açık uçlu problemlerde geri öder.

En net kazanım kodlamada. SWE-bench Verified'de sınır kodlama ajanları artık gerçek GitHub sorunlarını iki yıl önce hayal edilemeyecek oranlarda çözüyor — Temmuz 2026 itibarıyla Claude Opus 4.8 %88,6'da, Claude Mythos 5 ise %95,5 ile listenin başında. Bu gerçekten açık uçlu bir görev — dosya oku, ara, düzenle, testi çalıştır, hataya tepki ver — ve agent döngüsü hakkını veriyor.

Agent'ın parladığı yerler:

- **Kod ajanları:** "Şu testi geçir" dediğinizde ajan dosyaları okur, arar, düzenler, testi çalıştırır, hataya göre yeni adım atar. Kaç adım süreceği baştan belli değildir.
- **Araştırma görevleri:** Birden çok kaynağı gezip bulguları birleştirmek. Bir sonraki sorgu, önceki bulguya bağlıdır.
- **Çok adımlı müşteri işlemleri:** Rezervasyon değiştirme, iade başlatma gibi durumun dallara ayrıldığı akışlar.

Agent kurarken üç şey şarttır. Birincisi, sağlam bir **durdurma koşulu**: maksimum tur sayısı ve bütçe sınırı. Bir üretim ajanımızda `max_turns=15` sınırını koymadan önce, tek bir kenar durumu Opus 4.8'de (milyon token başına 5/25 dolar) 60+ tura girip 4 dolarlık tek istek üretmişti. İkincisi, her aracın **idempotent veya geri alınabilir** olması. Üçüncüsü, ajanın gördüğü her adımı loglayan bir **izlenebilirlik katmanı** — anket de bunu doğruluyor: agent çalıştıran ekiplerin %89'unun gözlemlenebilirliği kurulu, eval'i olan %52'nin epey önünde. Bir ajan yayınlamadan önce [gözlemlenebilirlik 101](/tr/posts/observability-nedir) yazımızı okuyun.

```python
# Agent: döngü modelde, adım sayısı belirsiz — sınır şart!
def agent_calistir(hedef: str, araclar: dict, max_tur: int = 15) -> str:
    mesajlar = [{"role": "user", "content": hedef}]
    for _ in range(max_tur):              # durdurma koşulu kritik
        yanit = llm_arac_secimiyle(mesajlar, araclar)
        if yanit.bitti:
            return yanit.metin
        sonuc = araclari_calistir(yanit.arac_cagrilari, araclar)
        mesajlar += [yanit.mesaj, sonuc]
    return "Tur limiti aşıldı, insana yönlendiriliyor."
```

## Agent mı workflow mu: nasıl karar veririm?

Kısa cevap: Şu üç soruyu sırayla sorun. "Adımları önceden yazabiliyor muyum?" Evet ise workflow. "Görev her çalışmada farklı bir yol izliyor mu?" Hayır ise workflow. "Non-deterministik davranışın maliyetini ve riskini kaldırabilir miyim?" Hayır ise workflow. Üçünde de agent'a doğru kayıyorsanız agent kullanın.

Kararı hızlandıran pratik ölçütler:

1. **En basit çözümden başlayın.** Tek bir LLM çağrısı işi görüyorsa ne workflow ne agent kurun. Karmaşıklığı ancak ölçülebilir bir kazanç varsa ekleyin.
2. **Öngörülebilirlik gerekiyorsa workflow seçin.** Faturalama, uyumluluk, veri işleme gibi denetlenebilir alanlarda agent'ın rastgeleliği risktir.
3. **Gecikme ve maliyet duyarlıysa workflow seçin.** Agent turları çarpım etkisiyle hem yavaşlar hem pahalanır.
4. **Görev gerçekten açık uçluysa agent seçin.** Adımları listeleyemiyorsanız, bu zaten workflow'un sınırıdır.
5. **Hibrit düşünün.** En dayanıklı sistemler, yalnızca gerçekten belirsiz olan tek adıma agent'ı bir workflow iskeleti içine yerleştirir.

2026'da gördüğümüz olgun mimarilerin çoğu hibrit: dıştan bir workflow orkestrasyonu, içeride dar kapsamlı bir agent. Bu, agent esnekliğini alırken maliyet ve hata ayıklamayı kontrol altında tutar.

Bir görüş: tek bir sağlayıcının agent framework'üne fazla yatırım yapmayın. OpenAI, Haziran 2026'da [Agent Builder ve Evals ürünlerini](https://openai.com/index/introducing-agentkit/) 30 Kasım 2026'dan sonra kapatacağını duyurdu — kalıcı varlıklarınızın sarmalayıcı değil, prompt'larınız, araçlarınız ve eval'leriniz olduğunun hatırlatması. Mantığınızı taşınabilir tutun.

Konu kümemizdeki ilgili yazılar: [prompt mühendisliği teknikleri](/tr/posts/prompt-muhendisligi-teknikleri), araçları standartlaştırmak için [Model Context Protocol nedir](/tr/posts/model-context-protocol-nedir) ve token harcamasını dürüst tutmak için [FinOps: bulut faturasını düşürme](/tr/posts/finops-bulut-maliyeti-dusurme). Kategori temeli için [yapay zeka yazılarımıza](/tr/category/yapay-zeka) göz atın.

## Sıkça Sorulan Sorular

### AI agent ve workflow farkı en basit haliyle nedir?

Fark, kararı kimin verdiğidir. Workflow'da bir sonraki adıma sizin kodunuz karar verir; LLM sadece sabit noktalarda çağrılır. Agent'ta bir sonraki adıma LLM bir döngü içinde kendisi karar verir ve araçları kendisi seçer. Sabit işlerde workflow, açık uçlu işlerde agent.

### Agent her zaman workflow'dan daha mı iyidir?

Hayır. Agent daha esnektir ama daha pahalı, daha yavaş ve hata ayıklaması daha zordur. Yapılandırılmış görevlerin çoğunda bir workflow daha ucuz, daha hızlı ve daha güvenilirdir. Anthropic dahil çoğu ekip "en basit çözümden başla, karmaşıklığı ancak gerektiğinde ekle" der.

### İkisini birlikte kullanabilir miyim?

Evet, hibrit yaklaşım 2026'da en yaygın olgun mimaridir. Dış katmanda öngörülebilir bir workflow orkestrasyonu, yalnızca gerçekten belirsiz olan tek adımda dar kapsamlı bir agent kullanırsınız. Böylece agent esnekliğini alır, maliyet ve izlenebilirliği korursunuz.

### Agent maliyetini nasıl kontrol altında tutarım?

Üç sınır koyun: maksimum tur sayısı (`max_turns`), istek başına token/dolar bütçesi ve zaman aşımı. Ayrıca araçları idempotent yapın ve her adımı loglayın. Opus sınıfı modeller milyon token başına 5/25 dolarken, sınırsız bir döngü tek bir kenar durumunda maliyeti onlarca katına çıkarabilir; bunu ölçüp alarm kurun.
