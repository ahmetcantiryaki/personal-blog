---
title: "Claude Code ve Codex ile Spesifikasyon Odaklı Kodlama"
slug: "claude-code-codex-spec-odakli-kodlama"
translationKey: "spec-driven-coding-agents-2026"
locale: "tr"
excerpt: "Claude Code veya Codex'e kod yazdırmadan önce kabul kriterleri ve dosya sınırları içeren bir spec yazın; vibe-prompting ajanlar koda hakim olunca çöker."
category: "software-engineering"
tags: ["claude", "openai", "ai-coding", "best-practices"]
publishedAt: "2026-10-05"
seoTitle: "Spec Odaklı Kodlama: Claude Code ve Codex Rehberi"
seoDescription: "Claude Code ve Codex için spec odaklı iş akışı: kabul kriterleri, dosya sınırları, veri kontratları, test planı ve ajanı yolda tutan inceleme döngüsü."
---

Kısa cevap: kabul kriterleri, dosya sınırları, veri kontratları, test planı ve yapılmayacaklar listesi içeren kısa bir spec yazın; sonra bunu Claude Code veya Codex'e verin ve ajan dosyalara dokunmadan önce planını inceleyin. Gevşek, sohbet tarzı komutlar ("vibe-prompting") yirmi satırlık bir scriptte işe yarar; ajan gerçek bir özelliğin büyük kısmını üretmeye başladığında dağılır.

## Yazılı spec'ler vibe-prompting'den neden daha iyi?

Çünkü AI'nin yazdığı kod hacmi, belirsizliğin sönümlenmek yerine katlanarak büyüdüğü noktayı çoktan geçti. Sonar'ın 2026 State of Code Developer Survey'ine göre AI, bugün commit edilen kodun %42'sini oluşturuyor ve bu oranın 2027'ye kadar %65'e çıkması bekleniyor. JetBrains'in 15.000'den fazla profesyonel yazılımcıyı kapsayan 2026 Developer Ecosystem Survey'i, kodun yaklaşık %47'sinin tamamen ajanlar tarafından üretildiğini, %38'inin AI destekli yazıldığını ve sadece %27'sinin tamamen manuel olduğunu buldu. GitHub ise platformunda commit edilen kodun %46'sının AI tarafından üretildiğini raporluyor.

Bu ölçekte, gevşek tanımlanmış bir prompt sessizce başarısız olmuyor. Kod incelemesinde hızlı bir bakışta yakalanamayacak şekilde yanlış ama inandırıcı görünen bir implementasyon üretiyor; ya da kimsenin istemediği bir kapsama sessizce yayılıyor; ya da uzun bir ajan oturumunda her turda orijinal niyetten biraz daha uzaklaşıyor. Tek satırlık bir talimatla başlayıp dört saat sonra kimsenin dokunulmasını istemediği dosyaları değiştiren bir diff'le biten oturumlar gördük. Güven verileri de bunu doğruluyor: geliştiricilerin %96'sı AI tarafından üretilen koda tam olarak güvenmediğini söylüyor, sadece %48'i commit etmeden önce her zaman doğruladığını belirtiyor. Vibe-prompting ile "her zaman doğrularım" arasında bir gerilim var; spec, sizi ne sormak istediğinize dair hafızanıza değil, somut bir belgeye karşı doğrulamanızı sağlayan şey.

| Vibe-prompting başarısızlık modu | Spec odaklı çözüm |
|---|---|
| Hızlı bakışta geçen, ama yanlış implementasyon | Ajanın (ve incelemecinin) satır satır kontrol edebileceği kabul kriterleri |
| Diff devasa boyuta ulaşana kadar fark edilmeyen kapsam kayması | Önceden belirlenmiş dosya/modül sınırları ve açık yapılmayacaklar listesi |
| Ajanın uzun oturumda niyetten uzaklaşması | Ad hoc talimatlar eklemek yerine ajanı yazılı spec'e geri döndürmek |
| İncelemecinin niyeti diff'ten tersine mühendislik yapması | Spec'in kodla birlikte commit edilip yaşayan dokümana dönüşmesi |

## Uygulanabilir bir spec'te ne olmalı?

En az beş şey: kabul kriterleri, dosya ve modül sınırları, veri kontratları, test planı ve açık yapılmayacaklar listesi. Bunlardan birini atlarsanız ajan o boşluğu kendi tahminiyle doldurur; spec'in var olma amacı tam olarak bu tahmini ortadan kaldırmak.

Kabul kriterleri, "bunun bittiğini nasıl anlarım?" sorusunu, ajanın kendi anlatımına değil çalışan koda karşı kontrol edilebilir terimlerle cevaplar. Dosya ve modül sınırları, "bu ajan hangi dosyalara dokunabilir?" sorusunu cevaplar; bu olmadan "rate limiting ekle" denilen bir ajan, kimse ona söylemediği için auth middleware'inizi de seve seve yeniden düzenler. Veri kontratları, girdi ve çıktıların şekillerini sabitler: istek/yanıt şemaları, alan tipleri, hata kodları — ajan bir şekil söylenmek yerine tahmin ettiğinde sessizce bozulan şeyler. Test planı, iş bitmiş sayılmadan önce hangi senaryoların geçmesi gerektiğini söyler; yapılmayacaklar listesi ise ajanın açıkça *inşa etmemesi* gerekenleri belirtir ve kapsam kaymasına karşı bulduğumuz en etkili kaldıraç bu.

Orta ölçekli bir özellik için bu ne kadar kısa kalabilir, aşağıda görülüyor:

```yaml
feature: login-endpointine-rate-limit
acceptance_criteria:
  - IP+kullanıcı adı çifti başına 60 saniye içinde 5 başarısız denemeden sonra 429 döner
  - başarılı giriş sayacı anında sıfırlar
  - limit durumu süreç yeniden başlatıldığında kalıcı olmalı (bellek içi değil, Redis destekli)
file_boundaries:
  allowed:
    - src/auth/rate_limiter.ts
    - src/auth/login_handler.ts
    - test/auth/rate_limiter.test.ts
  forbidden:
    - src/auth/session.ts
    - src/db/migrations altındaki hiçbir dosya
data_contract:
  rate_limit_response:
    status: 429
    body: { error: string, retry_after_seconds: number }
test_plan:
  - unit: sayaç doğru artıyor ve sıfırlanıyor
  - integration: pencere içindeki 6. deneme 429 döndürüyor
  - integration: pencere bittikten sonraki deneme başarılı oluyor
non_goals:
  - CAPTCHA ekleme
  - şifre hashleme yöntemini değiştirme
  - signup endpoint'ine dokunma
```

Bu spec iki dakikada okunabilecek kadar kısa, ama ajanın makul bir şekilde dışına çıkamayacağı kadar spesifik.

## Spec'i Claude Code veya Codex'e nasıl verirsin?

Spec'i yapıştırır veya referans verirsiniz, sonra ajandan tek bir dosyayı düzenlemeden önce bir plan çıkarmasını istersiniz; bitmiş bir diff'i incelemek, bir planı incelemekten çok daha maliyetli. Claude Code, tam olarak bunun için tasarlanmış açık bir plan modu sunuyor: ajan önce spec'i okur, bir yaklaşım önerir ve kod yazmaya başlamadan önce onay bekler. OpenAI'nin Codex'i, bir kodlama ajanı ürünü olarak aynı mantığı izliyor; üstelik Codex şu anda OpenAI'nin en yeni, maliyet açısından verimli kodlama modeli GPT-6.1 Sol'u da çalıştırıyor. Bu model 29 Eylül 2026'da DevDay'de duyuruldu, giriş token'ı başına 2 dolar ve çıkış token'ı başına 10 dolar fiyatlandırmasıyla sunuldu ve flagship'e yakın kodlama performansını çok daha düşük bir fiyata vaat ediyor olarak tanıtıldı.

Bu fiyatlandırma hamlesi, spec'lerin tek kullanımlık promptlara karşı neden tercih edilmesi gerektiğinin kendi başına bir kanıtı. Talimatlarınız sadece bir sohbet geçmişinde yaşıyorsa, ajan çalıştırmaları arasında bir modelden başka bir modele geçmek her şeyi sıfırdan açıklamak anlamına gelir. Talimatlar bir spec dosyasında yaşıyorsa, farklı bir ajanı veya farklı bir modeli aynı belgeye yönlendirirsiniz ve niyet değişmeden taşınır. 2026'nın son çeyreğinde kodlama ajanı ekonomisi bu kadar hızlı değiştiğine göre bu taşınabilirlik lüks değil; bir öğleden sonrada yeni bir modeli değerlendirmekle bir haftalık prompt geçmişini yeniden tartışmak arasındaki fark bu.

## Ajan oturum ortasında niyetten saparsa ne yaparsın?

Durup ajanı yazılı spec'e geri döndürürsünüz; sapmayı daha fazla ad hoc talimatla yamamaya çalışmazsınız. Oturumun üçüncü veya dördüncü turunda gelen cazibe, ajanı küçük bir düzeltmeyle yola döndürmektir: "hayır, o dosyaya dokunma," "aslında bu uç durumu da ele al." Her dürtme tek tek bakıldığında ucuz görünür. Uzun bir oturum boyunca üst üste bindiğinde, sadece sohbette yaşayan ve ilk spec'in bazı kısımlarıyla çelişen, yazılı olmayan ikinci bir spec'e dönüşürler.

Sürekli geri döndüğümüz çözüm şu: durun, orijinal spec'i yeniden yapıştırın (veya ajanı yeniden dosyaya yönlendirin) ve mevcut diff'ini spec'e karşı yeniden kontrol etmesini isteyin. Bu, ajanın bağlamını birikmiş düzeltmeler yığını yerine gerçek kaynak doğruya sıfırlar ve genellikle görünenden daha hızlı sonuç verir; çoğu sapma, bir düzine ayrı yanlış anlamadan değil, orijinal promptdaki tek bir belirsiz satırdan kaynaklanır.

## PR birleştikten sonra spec'i nasıl faydalı tutarsın?

Spec'i kodla birlikte commit edersiniz; ilgili klasörde bir `SPEC.md` olarak veya PR açıklamasının kendisi olarak. Böylece sonraki ajan oturumu veya sonraki insan, niyeti diff'ten tersine mühendislikle çıkarmak yerine aynı kaynak doğruyu okur. Sadece bir sohbet penceresinde yaşayan bir spec, o pencere kapandığı anda kaybolur; repoya commit edilmiş bir spec, dosyayı açan sonraki kişi tarafından okunabilir ve bu, bir reponun bir sonraki geçişte AI ajanları için daha çalışılabilir hale gelmesini sağlayan türden yapılandırılmış, açık dokümantasyonun tam örneği. Reponuz zaten ajanları genel olarak yönlendirmek için bir `AGENTS.md` tarzı dosya kullanıyorsa, özellik bazlı bir spec aynı fikrin daha ince taneli hali.

Küçük PR disiplini de buradan neredeyse otomatik olarak çıkıyor. Bir spec büyük, çok konulu bir diff üretiyorsa, bu spec'in kendisinin çok geniş olduğunun işareti; ayrı ayrı incelenmesi gereken iki üç kararı bir arada paketlemiş demektir. Spec'i, her birinin kendi kabul kriterleri ve kendi yapılmayacaklar listesi olan daha küçük birimlere bölmek, ortaya çıkan her PR'ı bir insan incelemecinin kafasında tutabileceği kadar küçük tutar. Bu bölmeye direnen ekiplerin, ajanın ürettiği PR'ları 2.000 satırlık bir refactor gibi -okumak yerine hızlıca göz gezdirerek- incelediğini gördük; bu da spec yazmanın bütün amacını baştan geçersiz kılıyor.

## Sıkça Sorulan Sorular

### "Vibe-prompting" nedir ve ölçek büyüyünce neden işe yaramaz hale gelir?

Vibe-prompting, bir kodlama ajanına yazılı bir spec olmadan gevşek, sohbet tarzı talimatlar verip ajanı sohbet üzerinden yönlendirmeye çalışmak demektir. Küçük, tek kullanımlık scriptlerde işe yarar; ama ajan gerçek bir özelliğin kodunun çoğunu üretmeye başladığında, gevşek bir promptun belirsizliği inandırıcı ama yanlış implementasyonlara ve fark edilmeyen kapsam kaymasına dönüşür.

### Claude Code'un plan modu nedir?

Plan modu, Claude Code'un bir spec veya talimatı okuyup bir uygulama planı önerdiği ve dosyalara dokunmadan önce insan onayı için beklediği bir kalıptır. Kısa bir planı incelemek, bitmiş çok dosyalı bir diff'i incelemekten daha ucuzdur; bu yüzden ajana önce spec verip plan istemek önerilen ilk adımdır.

### Her küçük değişiklik için spec yazmam gerekir mi?

Hayır; tek satırlık bir hata düzeltmesi veya basit bir metin değişikliği kabul kriterlerine ve test planına gerek duymaz. Eşik yaklaşık şu: değişiklik birden fazla dosyaya dokunuyorsa, bir veri kontratını içeriyorsa veya diff'ten tek başına incelenmesi birkaç dakikadan fazla sürecekse, önce spec yazın.

### GPT-6.1 Sol'un spec odaklı kodlamayla ne ilgisi var?

29 Eylül 2026'da DevDay'de duyurulan, giriş token'ı başına 2 dolar ve çıkış token'ı başına 10 dolar fiyatlandırmasına sahip OpenAI'nin kodlama modeli GPT-6.1 Sol, kodlama ajanı fiyatlandırmasının ve yeteneklerinin ne kadar hızlı değiştiğini gösteriyor. Sohbet geçmişi yerine dosya olarak saklanan bir spec, yeni bir modeli görevi sıfırdan yeniden açıklamak yerine aynı talimatlara yönlendirmenizi sağlar.

İlgili okumalar: iki modelin kodlama görevlerinde nasıl karşılaştığını görmek için [Claude Sonnet 5.5 vs GPT-6.1 Sol karşılaştırması](/tr/posts/claude-sonnet-5-5-vs-gpt-6-1-sol-karsilastirma), ajanın diff'i geldikten sonra ne kontrol edeceğiniz için [AI ile kod incelemesi: güven ama doğrula](/tr/posts/ai-ile-kod-incelemesi-guven-dogrula), bu ajanların günlük kullanımda nasıl karşılaştırıldığı için [Claude Code vs Cursor vs Antigravity](/tr/posts/claude-code-cursor-antigravity-2026) ve özellik bazlı spec'lerle iyi eşleşen repo seviyesindeki bağlam için [AGENTS.md: repoyu AI ajanlarına anlat](/tr/posts/agents-md-repo-ai-ajanlarina-anlat) yazılarımıza bakabilirsiniz. Altta yatan veriler için [Sonar 2026 State of Code Developer Survey](https://www.sonarsource.com/state-of-code-developer-survey-report.pdf), [Claude Code dokümantasyonu](https://code.claude.com/docs) ve [OpenAI DevDay 2026 özeti](https://openai.com/index/devday-2026-recap/) kaynaklarına göz atabilirsiniz.
