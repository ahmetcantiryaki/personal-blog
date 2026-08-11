---
title: "Claude Managed Agents: Bütçe, Danışman, Veri Konumu"
slug: "claude-managed-agents-butce-danisman-veri-konumu"
translationKey: "claude-managed-agents-budgets-advisors-residency"
locale: "tr"
excerpt: "Anthropic, 7 Ağustos'ta Managed Agents'a oturum bütçesi, danışman modeli, çıkarım coğrafyası ve GitHub'dan skill yükleme ekledi — dördü de üretim ajanları için."
category: "ai"
tags: [claude, ai-agents, ai-infrastructure, automation]
publishedAt: "2026-08-11"
seoTitle: "Claude Managed Agents: Bütçe, Danışman, Veri Konumu"
seoDescription: "Anthropic, 7 Ağustos'ta Managed Agents'a oturum bütçesi, danışman modeli, çıkarım coğrafyası ve GitHub'dan skill yükleme ekledi — dördü de üretim ajanları için."
---

Anthropic, [Claude Platform sürüm notlarına](https://platform.claude.com/docs/en/release-notes/overview) göre 7 Ağustos 2026'da Claude Developer Platform'un Managed Agents katmanına dört somut özellik ekledi: oturum başına sert harcama tavanı, mid-turn danışılabilen ikinci bir model, çıkarımın fiziksel olarak nerede çalışacağını belirleyen bölge kontrolü ve GitHub deposundan otomatik skill keşfi. Dördü birlikte, ajan platformunu demo aracından üretim altyapısına taşıyan bir paket oluşturuyor.

Önce bir netlik: burada konuşulan Managed Agents, Claude Code CLI'siyle karıştırılmamalı. Managed Agents, Anthropic'in barındırdığı, otonom ajanlar kurup çalıştırmak için kullanılan API katmanı — agent tanımlıyorsunuz (model, sistem prompt'u, araçlar), sonra o tanıma referans veren oturumlar (session) başlatıyorsunuz; ajan döngüsünü ve araçların çalıştığı sandbox'ı Anthropic işletiyor. Claude Code ise geliştirici masaüstünde/terminalde çalışan ayrı bir üründür. Bu hafta gelen dört özellik yalnızca Managed Agents'ı ilgilendiriyor.

## 7 Ağustos'ta gelen dört özellik

| Özellik | Ne yapıyor | Nerede yapılandırılıyor | Neden önemli |
|---|---|---|---|
| Oturum bütçeleri | Bir oturuma liste fiyatları üzerinden hesaplanan sert bir dolar tavanı koyar; tavan aşıldığında oturum yeni model isteği yapmadan duraklar | `sessions.create()` üzerinde `budget` alanı | Kaçak bir ajan döngüsünün faturayı katlaması ihtimalini ortadan kaldırıyor |
| Danışmanlar | Oturumun ana iş akışı, kendi yeteneği en az kadar (ya da daha) yetenekli ayrı bir modele tur ortasında danışabiliyor, görevi devralmadan | Agent'ın `multiagent.agents` listesinde `{"type": "advisor"}` girdisi | Tam çoklu ajan orkestrasyonuna göre çok daha ucuz bir "ikinci göz" deseni |
| Çıkarım coğrafyası | Modelin çıkarımı fiziksel olarak hangi bölgede çalıştıracağını belirler | Agent oluşturulurken `model.inference_geo`, oturum bazında geçersiz kılınabilir | AB ve diğer regüle müşteriler için veri konumu uyumluluğu |
| GitHub'dan skill yükleme | Bir GitHub deposu bağlanan oturum, deponun kök dizinindeki `.claude/skills` klasöründeki skill'leri otomatik keşfeder | Depo bağlama zaten `github_repository` kaynağı olarak yapılıyor — ekstra adım yok | Skill'leri elle yükleyip senkronize tutma zorunluluğunu kaldırıyor |

### Oturum bütçeleri: harcamayı kod yazmadan sınırlamak

Daha önce bir Managed Agents oturumunun ne kadar harcayacağını sınırlamanın tek yolu, kendi izleme kodunuzu yazıp eşiği aşınca oturumu manuel olarak kesmekti — ki bu, platformun her model isteğinden önce yaptığı denetimle yarışamayan, gecikmeli bir çözümdü. [Bütçe dokümantasyonuna](https://platform.claude.com/docs/en/managed-agents/budgets) göre artık `sessions.create()` çağrısına bir `budget` nesnesi geçebiliyorsunuz; platform, oturumun tükettiği her şeyi (token, web araması, çalışma süresi) liste fiyatları üzerinden sürekli fiyatlandırıyor ve tavana ulaşıldığında yeni model isteklerini durduruyor. Oturum sonlanmıyor — `stop_reason: "budget_reached"` ile `idle` durumuna geçip bekliyor; bütçeyi değiştirmek ya da kaldırmak işi otomatik olarak devam ettiriyor.

Zamanlanmış dağıtımlar (deployment'lar — cron ile tekrarlanan ajan çalıştırmaları) da aynı bütçeyi başlattıkları her oturuma kopyalayabiliyor, yani "her gece çalışan rapor ajanı asla 50 doları geçmesin" gibi bir kural tek bir yerden tanımlanabiliyor. Gerçekçi bir kullanım: bir müşteri destek ajanını haftalık 200 dolarlık bir tavana bağlayıp, tavan aşıldığında insan ekibine devretmek.

### Danışmanlar: pahalı orkestrasyona alternatif bir desen

[Çok ajanlı orkestrasyon dokümantasyonuna](https://platform.claude.com/docs/en/managed-agents/multiagent-orchestration#give-the-session-an-advisor) göre bir oturumun multiagent roster'ına `{"type": "advisor", "model": "..."}` girdisi eklediğinizde, ana iş akışı tur ortasında bu modele danışabiliyor — plan kurarken, tıkandığında ya da bitirmeden önce işini gözden geçirtirken. Danışman görevi devralmıyor; kendi izole thread'inde çalışıp bir mesajla cevap veriyor, ana ajan işine devam ediyor. Danışman modelinin, ana ajanın modelinden en az o kadar yetenekli olması şart — daha zayıf bir modeli danışman yapmaya çalışmak agent kaydedilirken reddediliyor.

Gerçekçi senaryo: ucuz ve hızlı bir Sonnet ajanının, karmaşık bir refactor ya da belirsiz bir müşteri talebinde Opus'a "bu yaklaşım mantıklı mı?" diye sorabilmesi — [çok ajanlı orkestrasyon kalıplarımızda](/tr/posts/cok-ajanli-orkestrasyon-kaliplari) anlattığımız tam roster kurmadan.

### Çıkarım coğrafyası: veri nerede işleniyor

[Veri konumu dokümantasyonuna](https://platform.claude.com/docs/en/manage-claude/data-residency) göre `inference_geo`, agent oluşturulurken `model` nesnesinin içine yerleştiriliyor (isteğe bağlı olarak oturum bazında geçersiz kılınabilir) ve modelin isteklerini hangi bölgenin karşılayacağını sabitliyor. AB müşterileri veya sözleşmesel veri-konumu yükümlülüğü olan diğer regüle sektörler için bu, "verimiz asla belirli bir bölgenin dışına çıkmasın" gerekliliğini karşılayan somut bir kontrol noktası. Ayar oturum ömrü boyunca sabit kalıyor; multiagent roster'daki her ajanın pin'i aynı olmak zorunda, aksi halde doğrulama hatası alıyorsunuz.

### GitHub'dan skill yükleme

[Skill dokümantasyonuna](https://platform.claude.com/docs/en/managed-agents/skills#load-skills-from-a-github-repository) göre bir oturum bir GitHub deposunu `github_repository` kaynağı olarak bağladığında, platform artık deponun kök dizinindeki `.claude/skills` klasörünü oturum başında tarayıp bulduğu skill'leri otomatik olarak ajana sunuyor — elle yükleme, senkron tutma ya da ayrı bir Skills API çağrısı yok. Skill'ler kodla birlikte versiyonlanıyor; ekip bir skill'i günceller, sonraki oturum onu otomatik alıyor. Tarama yalnızca oturum başında, o an checkout edilmiş dal ya da commit üzerinden bir kez yapılıyor — oturum sırasında yapılan push'lar yansımıyor.

## Hepsini bir araya getirmek

Aşağıdaki örnek, regüle bir müşteriye yönelik, AB'de çıkarım yapan, danışmanlı ve bütçe tavanlı bir ajanın nasıl görüneceğini gösteriyor. Model ve danışman roster'ı agent tanımında, bütçe ise oturum oluşturmada yaşıyor — netlik için ikisini birlikte gösteriyoruz:

```json
{
  "agent_config": {
    "model": {
      "id": "claude-opus-5",
      "inference_geo": "eu"
    },
    "system": "AB müşterileri için destek ajanısın. Belirsiz iade taleplerini yanıtlamadan önce danışmanına danış.",
    "multiagent": {
      "type": "coordinator",
      "agents": [
        { "type": "advisor", "model": "claude-opus-5" }
      ]
    }
  },
  "session_config": {
    "environment_id": "env_01H8X2K9QZ",
    "budget": {
      "type": "limit",
      "max_list_cost": { "amount": "5000", "currency": "USD" }
    }
  }
}
```

Bu kompozisyon tesadüfi değil: bütçe maliyet kontrolü sağlıyor, danışman ana modeli ucuz tutarken kalite denetimi ekliyor, `inference_geo` uyumluluk kutusunu işaretliyor. Üçü birlikte, tek bir zamanlanmış dağıtımın hem finans hem güvenlik ekibinin sorularını cevaplayabilmesini sağlıyor.

## Danışman gerçekten yeni bir primitive mi?

Burada dürüst olmakta fayda var: "danışman" deseni, teknik olarak zaten mümkün olan bir şeyin — ikinci bir ajanı çağırıp cevabını okuma — cilalanmış hali. Roster'a `{"type": "self"}` veya ikinci bir agent ID'si ekleyip aynı sonucu elde edebilirdiniz. Asıl kazanım mimari değil, operasyonel: danışman thread'i 25 eşzamanlı thread limitinden muaf, kendi önbelleklemesini otomatik yönetiyor ve platformun kendisi geçerli çift (executor/advisor yetenek eşleşmesi) doğrulamasını üstleniyor — yani "ucuz model pahalı bir danışmana mı, yoksa tersine mi sorulmalı" tartışmasını elle çözmenize gerek kalmıyor. Bu, gerçek bir yeni ilkelden çok, sık karşılaşılan bir deseni birinci sınıf yapan bir kolaylaştırma. Buna karşılık oturum bütçeleri gerçekten gecikmiş bir özellikti — üretimde çalışan herhangi bir ajan altyapısının ilk günden itibaren ihtiyaç duyduğu bir güvenlik ağı; şimdiye kadar herkes kendi versiyonunu yeniden yazmak zorunda kalıyordu.

## Ne zaman hangisini kullanmalı

Pratik bir kural: tüm zamanlanmış dağıtımlara bütçe koyun, maliyeti sıfır varsayım yapmak yerine ölçün. Danışmanı, tam bir çok-ajanlı roster kurmanın gerekmediği ama "bu doğru mu?" sorusunun önemli olduğu görevlerde kullanın — [Claude Code'un arka plan alt-ajanlarından](/tr/posts/claude-code-subagent-arka-plan-ajanlari) farklı olarak burada danışman ana işi asla üstlenmiyor, yalnızca fikir veriyor. `inference_geo`'yu yalnızca gerçek bir uyumluluk gereksiniminiz varsa açın; aksi halde workspace varsayılanına güvenin. GitHub'dan skill yükleme neredeyse hiçbir dezavantajı olmayan bir kazanım, tek uyarı: deponuza kimlerin `.claude/skills` altına yazabildiğini denetleyin, çünkü platform bunları hiçbir inceleme adımı olmadan oturum başında yüklüyor.

Bu dört özellik, [Anthropic'in aynı hafta yayınladığı inference hooks](/tr/posts/claude-inference-hooks-guvenlik-sunucusu) ile birlikte okunduğunda net bir yön çiziyor: kurumsal alıcılar artık "demo çalışıyor mu" değil "üretimde kontrol edebilir miyim" sorusunu soruyor. Managed Agents'a hangi modeli bağlayacağınızı seçerken [model karşılaştırma rehberimize](/tr/posts/hangi-claude-modeli-2026-rehberi), ajanınızın araç setini genişletirken de [ilk MCP bağlayıcınızı yazma yazımıza](/tr/posts/ilk-mcp-baglayicini-yaz-2026) göz atabilirsiniz. Bütçe ve danışman gibi platform kontrolleri, [üretim için LLM guardrail kontrol listemizde](/tr/posts/uretim-icin-llm-guardrail-kontrol-listesi) savunduğumuz katmanlı savunmanın altyapı seviyesindeki karşılığı — uygulama mantığınızdaki guardrail'lerin yerini almıyor, onları tamamlıyor. Claude ekosistemindeki diğer gelişmeler için [Yapay Zeka kategorimize](/tr/category/yapay-zeka) göz atabilirsiniz.

## Sıkça Sorulan Sorular

### Managed Agents ile Claude Code aynı şey mi?

Hayır. Managed Agents, otonom ajanlar kurup Anthropic'in barındırdığı sandbox'ta çalıştırmak için kullanılan hosted API — agent ve oturum kavramlarıyla çalışıyor. Claude Code ise geliştiricinin kendi makinesinde çalışan, dosya sistemine doğrudan erişen ayrı bir CLI ürünü. Bu yazıdaki dört özellik yalnızca Managed Agents'ı kapsıyor.

### Oturum bütçesi tam olarak ne zaman devreye giriyor?

Platform her model isteğinden önce, o ana kadar tüketilen liste maliyetinin tavana ulaşıp ulaşmadığını kontrol ediyor. Tavana ulaşan bir turun tamamlanmasına izin veriliyor, yani nihai maliyet tavanı çalışan thread başına en fazla bir istek kadar aşabilir. Oturum bu noktada sonlanmıyor, `stop_reason: "budget_reached"` ile duraklıyor; bütçeyi yükseltmek veya kaldırmak işi otomatik devam ettiriyor.

### Danışman modeli, ana ajandan daha zayıf olabilir mi?

Hayır. Danışmanın en az ana ajanın modeli kadar yetenekli olması zorunlu; agent kaydedilirken doğrulanıyor. Geçersiz bir eşleşme 400 hatasıyla reddediliyor.

### `inference_geo` her modelde mi çalışıyor?

Coğrafi çıkarım sabitlemesini desteklemeyen bir modelde `inference_geo` ayarlamak hata döndürüyor. Ayrıca multiagent roster'daki tüm ajanların pin değeri aynı olmak (ya da hepsi boş olmak) zorunda; karışık bir roster doğrulama aşamasında reddediliyor.
