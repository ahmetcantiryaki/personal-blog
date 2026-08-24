---
title: "AI'da Tedarikçi Bağımlılığı: Tek Modele Güvenmek"
slug: "ai-tedarikci-bagimliligi-tek-model"
translationKey: "ai-vendor-lock-in-startups"
locale: "tr"
excerpt: "Hayır, tek bir AI sağlayıcısına yatırım yapmak riskli değil; asıl risk prompt'ları, tool şemalarını ve fine-tune'ları o sağlayıcıya kilitlemek."
category: "business"
tags: ["ai-tools", "saas", "ai-infrastructure", "cost-optimization"]
publishedAt: "2026-08-24"
seoTitle: "AI Tedarikçi Bağımlılığı: Startup'lar İçin Rehber"
seoDescription: "Hayır, tek bir AI sağlayıcısına yatırım yapmak riskli değil; asıl risk prompt'ları, tool şemalarını ve fine-tune'ları o sağlayıcıya kilitlemek."
---

Hayır. Hangi sağlayıcıyı seçtiğiniz, entegrasyonu nasıl kurduğunuzdan çok daha az önemli. Çoğu startup "Claude'a bağlı kalmak" ya da "GPT'ye bağlı kalmak" konusunda endişeleniyor; oysa gerçek risk sabit kodlanmış prompt'larda, özel tool şemalarında ve tek bir modelin tuhaflıklarına göre ayarlanmış fine-tune'larda yaşıyor. Entegrasyon katmanını doğru kurarsanız sağlayıcı seçimi şirketi riske atan bir karar olmaktan çıkar.

## Tek bir AI sağlayıcısına bağlanmak ne zaman tehlikeli?

Tedarikçi bağımlılığı, geçiş maliyeti geçişin getireceği tasarruftan fazla olduğunda gerçek bir soruna dönüşür — ve bu maliyet neredeyse tamamen dört yerde birikir: bir modelin davranışına göre ince ayarlanmış prompt'lar, özel bir şemaya yazılmış tool/agent API'leri, tek bir sağlayıcının temel modeline eğitilmiş fine-tune'lar ve planlamadığınız fiyat ya da model kaldırma şokları.

Prompt bağımlılığı en görünmez ve en yaygın olanı. Bir modelin biçimlendirme alışkanlıklarına, ret davranışına ya da talimat takip stiline göre iyi çalışan bir prompt, başka bir modelde genelde gerçek bir yeniden yazım gerektirir — sadece model adını değiştirmek yetmez. Aylarca tek bir sağlayıcıya göre prompt ince ayarı yapan ekipler, daha ucuz bir alternatif çıktığında bedelini saatler değil haftalar süren bir geçişle öder.

Fine-tune'lar bağımlılığın en derin biçimi: bir sağlayıcının temel ağırlıklarına eğitilen fine-tune, başka bir sağlayıcıya taşınamaz. Fine-tune'u bir sağlayıcıdan diğerine göç ettiremezsiniz; yalnızca yeni sağlayıcının temel modelinde, kendi veri setinizle sıfırdan yeniden eğitebilirsiniz. Ürününüzün farkı bir fine-tune içinde yaşıyorsa, o sağlayıcının varlığına ve fiyatlandırmasına kalıcı bir bahis oynamışsınız demektir.

Fiyat ve model kaldırma şokları ise en az varsayımsal olanı. Ağustos 2026 itibarıyla üç büyük sağlayıcının da fiyatları haftalar içinde değiştiği ya da modelleri kaldırdığı görülüyor:

| Kategori | Örnek | Zaman ölçeği |
| --- | --- | --- |
| Fiyat geri dönüşü | Anthropic 11 Ağustos 2026'da Claude Sonnet 5'in milyon token başına 2$/10$ giriş fiyatını kalıcı ilan etti; 1 Eylül 2026'da yaklaşık 3$ giriş / 15$ çıkışa çıkarma planını iptal etti | 3 haftalık duyurudan sonra tersine döndü |
| Agresif fiyat kırma | OpenAI, 30 Temmuz 2026'da GPT-5.6 Luna fiyatını milyon token başına yaklaşık 0,20$ giriş / 1,20$ çıkışa indirdi — Claude Haiku 4.5'in yaklaşık 1$/5$'ından 4-5 kat ucuz | Tek bir fiyat güncellemesi |
| Geniş katman aralığı | Gemini fiyatlandırması, Flash-Lite'tan Pro sınıfı modellere kadar milyon çıkış token başına yaklaşık 0,50$ ile 12$ arasında değişiyor | Sürekli, katmana bağlı |
| Model emekliliği | Anthropic, Claude Opus 4.1'i kullanımdan kaldırdı; Opus 4, Sonnet 4 ve Haiku 3.5'i genel kullanımdan emekli etti — hepsi 2026 içinde | Ay bazında, tekrarlayan |

Son satır çoğu kişinin küçümsediği kısım. Ürününüzün bugün bağımlı olduğu bir model, bir yıl içinde genel kullanımdan tamamen kalkabilir — erişilebiliyorsa bile yalnızca belirli bir bulut platformunun eski bir SKU'su üzerinden. Prompt'larınız ve testleriniz tam olarak o modelin davranışına göre ayarlandıysa, yeniden yazma ve yeniden test etme işini kendi takviminizde değil, başkasının takviminde yaparsınız. Sonnet 5 örneği bu riskin iki yönünü birden gösteriyor: önce ilan edilen bir fiyat artışı, Anthropic'in kendi açıklamasıyla [tamamen iptal edildi](https://datafloq.com/anthropic-confirms-claude-sonnet-5-prices-rise-50-on-september-1/) — "kalıcı" bir fiyatın bile bir sonraki duyuruya kadar geçerli olduğunun kanıtı.

## Claude, GPT yoksa Gemini'ye mi yatırım yapmalı?

Üretim trafiğiniz için tek bir modeli varsayılan olarak seçin, ama bunu prompt katmanında değil entegrasyon katmanında yapın — bugünkü iş yükünüze fiyat-performans açısından en uygun sağlayıcıyı seçin, prompt'larınızı ve tool şemalarınızı modelden bağımsız şekilde yazın ve seçimi kalıcı değil geri döndürülebilir bir karar olarak ele alın.

Evrensel olarak "doğru" bir sağlayıcı yok. Anthropic'in Claude modelleri birçok kodlama ve uzun bağlamlı agent görevinde öne çıkıyor; OpenAI, GPT-5.6 Luna fiyat indirimi gibi hamlelerle fiyat savaşının alt ucunda defalarca kazandı; Google'ın Gemini ailesi ise [sağlayıcılar arası fiyat kıyaslamalarına göre](https://www.spheron.network/blog/llm-api-pricing-comparison-gpt-claude-gemini-deepseek-2026/) tek bir ailede en geniş fiyat-yetenek katman aralığını sunuyor, sub-dolar Flash-Lite fiyatlandırmasından Pro katmanında milyon çıkış token başına 12$'a kadar. Hangisini seçerseniz seçin, yukarıdaki Ağustos 2026 fiyat geçmişi "kalıcı" fiyatların bile değişebildiğini, "güncel" modellerin de emekli edilebildiğini gösteriyor. Yetenek karşılaştırması için [Claude Sonnet 5, GPT-5.6 ve Gemini 3.5 kıyaslamamıza](/tr/posts/claude-sonnet-5-gpt-5-6-gemini-3-5-kiyaslamasi) ve [2026'da hangi Claude modelinin hangi göreve uyduğuna dair rehberimize](/tr/posts/hangi-claude-modeli-2026-rehberi) bakabilirsiniz.

Burada üzerinde durulması gereken karşıt görüş şu: tek bir sağlayıcıya standardize olmak hata değil. Hata, o sağlayıcının *tuhaflıklarına* standardize olmak — tam prompt formatına, özel tool çağırma kurallarına, fine-tune'una. Claude'u seçip taşınabilir prompt'lar yazan bir startup, üç sağlayıcı arasında "hedge" yapan ama üç ayrı, kırılgan, sağlayıcıya özel prompt setini yönetmek zorunda kalan bir startup'tan çok daha iyi konumda. Taşınabilirlik olmadan hedge yapmak entegrasyon borcunuzu üçe katlamaktan başka bir şey yapmaz.

## Model router kullanmaya değer mi?

Bazen — bir router, per-request maliyet arbitrajının önemli olduğu kadar yüksek hacimde çalışıyorsanız ya da tek bir sağlayıcının kesintilerine karşı gerçek bir iş riski taşıyorsanız kendini amorti eder; buna karşılık ekstra gecikme, ikinci bir eval sapması kaynağı ve bakımı gereken bir soyutlama katmanı maliyeti getirir, dolayısıyla belirli bir ölçeğin altında kurmaya değmez.

Bir router (ya da Claude, GPT ve Gemini çağrılarını normalize eden bir soyutlama kütüphanesi), uygulamanız ile model arasına bir sekme ekler; bu genelde uygulamaya bağlı olarak istek başına onlarca ile yüz küsur milisaniye arası ek gecikme getirir. Gecikmeye duyarlı ürün yüzeylerinde — sohbet arayüzleri, agent tool döngüleri — bu ek yük her turda birikir.

Daha ince bir maliyet ise eval sapması. Değerlendirme setiniz, çıktıların sizin barınıza ne kadar uyduğunu test ettiğiniz modele göre ölçer. Aynı prompt'u — o an daha ucuz olduğu için ya da birincil sağlayıcı çöktüğü için — otomatik olarak farklı bir modele yönlendirirseniz, eval'leriniz kullanıcılara gerçekte sunulanı yansıtmayabilir. Model başına eval takibi olmadan bir router, gösterge panelleriniz yeşil görünse bile kaliteyi sessizce düşürebilir.

Bir router'ın kendini kanıtladığı yerler: anlamlı ölçekte maliyet optimizasyonu (basit sınıflandırma çağrılarını Haiku 4.5 ya da GPT-5.6 Luna gibi ucuz bir katmana yönlendirip karmaşık akıl yürütmeyi frontier bir modele saklamak) ve dayanıklılık (kesinti sırasında ikinci bir sağlayıcıya geçmek). Kanıtlamadığı yer ise ürün-pazar uyumunu henüz arayan erken aşama ürünler — burada mühendislik zamanı ürünün kendisine harcanmalı. Router olmadan maliyet düşürmenin somut yolları için [LLM token maliyetini düşürme rehberimize](/tr/posts/llm-token-maliyetini-dusurme) bakın.

## Tedarikçi bağımlılığından nasıl kaçınılır?

Çıkış planınızı üç şey üzerine kurun: modelden bağımsız formatta yazılmış, uçlarda sağlayıcıya özel adaptörler barındıran prompt'lar; her aday model için düzenli aralıklarla çalışan bir eval seti; ve sadece yazılmış değil, gerçekten prova edilmiş bir göç runbook'u.

**Modelden bağımsız prompt'lar.** Talimatları, örnekleri ve çıktı formatı gereksinimlerini kodunuzun kontrol ettiği bir yapıda tutun (düz metin ya da hafif bir şablon), tek bir sağlayıcının prompt cache sözdizimine ya da sistem prompt kurallarına yük taşıyan mantık olarak yaslanmayın. Çağrı noktasındaki küçük bir adaptör katmanı şöyle görünebilir:

```typescript
interface LLMProvider {
  complete(prompt: string, opts?: { maxTokens?: number }): Promise<string>;
}

// Sağlayıcıyı değiştirmek prompt'a ya da iş mantığına dokunmaz.
async function classify(provider: LLMProvider, text: string) {
  return provider.complete(`Şu metnin duygu tonunu sınıflandır: ${text}`);
}
```

**Bir eval seti.** Gerçek prompt'larınızı gerçek test senaryolarınızla en az iki sağlayıcı üzerinde, düzenli bir takvimle (prompt değişikliklerinizi ne kadar hızlı yaptığınıza göre haftalık ya da aylık) çalıştırın — sadece lansmandan önce bir kez değil. Bu, "geçebiliriz" demeyi "geçişin kalite ve maliyet açısından tam olarak neye mal olacağını biliyoruz" demeye dönüştürür ve fiyat ya da kalite sapmasını bir emeklilik sizi zorlamadan yakalamanızı sağlar.

**Prova edilmiş bir göç runbook'u.** Hangi prompt'ların, tool'ların ve fine-tune'ların sağlayıcıya özel olduğunu belgeleyin ve üç ayda en az bir kez üretim trafiğinin küçük bir dilimini gerçekten ikinci tercih sağlayıcınızdan geçirin. Hiç uygulanmamış bir göç planı, aslında sahip olmadığınız bir plandır.

Bunların hiçbiri birincil sağlayıcınızdan vazgeçmenizi gerektirmiyor. Gerektirdiği şey, prompt'larınızı ve tool entegrasyonlarınızı — tasarım gereği taşınabilir — ürününüzün fikri mülkiyeti gibi ele alırken altındaki modeli değiştirilebilir bir bağımlılık olarak bırakmak. Bu kararın bütçe tarafını da düşünen ekipler için [kurucular için ilk SaaS metrikleri](/tr/posts/kurucular-icin-ilk-saas-metrikleri) ve [bootstrap mı VC mi](/tr/posts/bootstrap-mi-vc-mi-2026-dogru-secim) rehberlerimize göz atabilirsiniz.

## Tedarikçi Bağımlılığı Risk Kontrol Listesi

- Prompt'larınız sade, taşınabilir bir dille mi yazılmış, yoksa güvenilir çalışmak için tek bir sağlayıcının özel biçimlendirme tuhaflıklarına mı bağımlı?
- Tool/agent şemalarınız normalize edilmiş bir iç format mı kullanıyor, yoksa kod tabanınızın her yerinde ham, sağlayıcıya özel tool çağırma sözdizimi mi var?
- Bir fine-tune'unuz varsa, farklı bir temel model üzerinde sıfırdan yeniden eğitim yapabilecek kadar iyi belgelenmiş eğitim verisi ve süreciniz var mı?
- Eval setiniz düzenli bir takvimle birden fazla sağlayıcı üzerinde mi çalışıyor?
- Son çeyrekte, düşük hacimde bile olsa üretim trafiğini gerçekten ikinci bir sağlayıcıdan geçirdiniz mi?
- Sağlayıcı bazlı fiyat ve emeklilik duyurularını takip ediyor musunuz, yoksa bunu ancak bir fatura ya da hata sıçramasıyla mı öğrenirsiniz?
- Birincil sağlayıcınızın fiyatı yarın iki katına çıksa, gerçekçi geçiş sürenizin gün mü, hafta mı yoksa ay mı olduğunu biliyor musunuz?

## Sıkça Sorulan Sorular

### Bir startup'ı tamamen tek bir AI modeli üzerine kurmak riskli mi?

Kendi başına değil — risk, hangi sağlayıcıyı seçtiğinizden değil onu *nasıl* kullandığınızdan doğar. Taşınabilir prompt'ları, normalize edilmiş tool şemaları ve çalışan bir eval seti olan bir startup, fiyat ya da erişilebilirlik değiştiğinde günler içinde model değiştirebilir; her yere sağlayıcıya özel prompt gömmüş bir startup ise kaç sağlayıcıyı "desteklediğini" iddia ederse etsin bağımlı kalır.

### Startup'lar model router mı kullanmalı, yoksa tek bir AI sağlayıcısı mı seçmeli?

Varsayılan olarak tek bir sağlayıcı seçin ve router'ı yalnızca hacim ya da erişilebilirlik gereksinimleri ek gecikme ve bakım maliyetini haklı çıkardığında ekleyin. Erken aşama ürünlerin per-request maliyet arbitrajını değerli kılacak trafiği nadiren vardır; router'ın kendisi de kalite beklenmedik şekilde değiştiğinde ayrıca hata ayıklanması gereken bir bileşene dönüşür.

### AI sağlayıcıları fiyatlarını ya da modellerini ne sıklıkla değiştiriyor?

Sık — yıllar değil, haftalar ile aylar mertebesinde. 2026 içinde Anthropic, planlanan Claude Sonnet 5 fiyat artışını duyurduktan sadece üç hafta sonra iptal etti; OpenAI, GPT-5.6 Luna fiyatını Claude'un karşılaştırılabilir katmanına göre yaklaşık 4-5 kat düşürdü; Anthropic ise Opus 4, Sonnet 4 ve Haiku 3.5'i genel kullanımdan emekli etti.

### AI tedarikçi bağımlılığından kaçınmak için en önemli tek adım nedir?

Prompt'larınızı ve tool şemalarınızı en baştan modelden bağımsız tutmak ve bunu en az iki sağlayıcı üzerinde çalışan gerçek bir eval setiyle doğrulamak. Bu tek alışkanlık, bir fiyat şokunun ya da model emekliliğinin size bir günlük mühendislik işi mi yoksa haftalar süren bir acil göç mü kazandıracağını belirler.
