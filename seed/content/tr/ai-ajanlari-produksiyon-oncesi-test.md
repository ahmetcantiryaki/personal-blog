---
title: "AI Ajanları Prodüksiyon Öncesi Nasıl Test Edilir"
slug: "ai-ajanlari-produksiyon-oncesi-test"
translationKey: "testing-ai-agents-before-production"
locale: "tr"
excerpt: "Kısa cevap: Bileşen testi, adım izleme (trajectory), LLM-hakem değerlendirmesi ve düşmanca (adversarial) testten oluşan dört katmanla test edin."
category: "software-engineering"
tags: ["ai-agents", "testing", "evals", "best-practices"]
publishedAt: "2026-09-05"
seoTitle: "AI Ajanları Prodüksiyona Almadan Önce Nasıl Test Edilir?"
seoDescription: "Kısa cevap: Bileşen testi, adım izleme (trajectory), LLM-hakem değerlendirmesi ve düşmanca (adversarial) testten oluşan dört katmanla test edin."
---

Kısa cevap: Bir AI ajanını güvenle prodüksiyona almak için dört katmanlı bir test yapısı gerekiyor — bileşen (tool) testi, adım-izleme (trajectory) değerlendirmesi, LLM-hakem (LLM-as-judge) puanlaması ve düşmanca (adversarial) senaryo testi. Bu katmanlardan biri atlanırsa, o katmanın yakalayacağı hata türü test ortamında değil, doğrudan üretimde ortaya çıkıyor.

## Neden sıradan birim testleri ajan testinde yetmiyor?

Kısa cevap: Çünkü bir ajan aynı girdiye her seferinde aynı cevabı vermiyor (non-determinism), araç (tool) çağırıyor ve çok adımlı bir yol izliyor — birim testleri ise tek bir girdi-çıktı çiftini doğrulamak için tasarlandı. LangChain'in 2026 Ajan Durumu raporuna göre kuruluşların %57'sinin artık üretimde ajanı var ve kalite, dağıtımın önündeki en büyük engel olarak gösteriliyor.

Bir ajan "doğru cevabı" birden çok yoldan bulabilir; sorun şu ki bu yollardan bazıları gereksiz araç çağrısı, güvensiz bir ara adım veya maliyeti şişiren bir döngü içerebilir. Son cevap doğru olsa bile, bu ara adımlar üretimde bir güvenlik veya maliyet sorununa dönüşebilir.

## Fixture ve simüle edilmiş araçlar nasıl kurulur?

Kısa cevap: Ajanın gerçek API'lere veya veritabanına dokunmadan çalışabileceği sahte (mock) araçlar ve sabit senaryo dosyaları (fixture) hazırlayın; böylece her test çalıştırması aynı başlangıç durumundan başlar ve dış servislerdeki değişkenlik test sonucunu bozmaz. Simüle edilmiş bir ortam, gerçek bir ödeme API'sini veya üretim veritabanını her test koşusunda tetiklemenizi engeller.

Bu fixture'lar aynı zamanda regresyon testinin temelini oluşturuyor: bir hata düzeltildiğinde, o hatayı tetikleyen senaryo kalıcı bir "golden transcript" (referans işlem kaydı) olarak saklanıyor ve her yeni sürümde otomatik olarak yeniden çalıştırılıyor.

## Trajectory (adım izleme) değerlendirmesi ne işe yarıyor?

Kısa cevap: Trajectory değerlendirmesi, ajanın yalnızca son cevabına değil, oraya varana kadar attığı her adıma bakıyor — hangi aracı hangi sırayla çağırdığı, argümanları doğru mu geçirdiği, gereksiz veya tekrarlı bir çağrı yapıp yapmadığı. Bu, çıktı-odaklı değerlendirmenin tamamen kaçırdığı bir hata sınıfını yakalıyor.

Örneğin bir müşteri destek ajanı doğru cevaba ulaşsa bile, bu sırada üç kez aynı veritabanı sorgusunu tekrarlamışsa, bu hem maliyet hem de gecikme sorunu demektir — ama son cevaba bakan bir test bunu asla göremez. Trajectory metrikleri tam olarak burada devreye giriyor: araç seçimi, akıl yürütme kalitesi, argüman doğruluğu ve karar sırası.

## LLM-hakem değerlendirmesi ne kadar güvenilir?

Kısa cevap: LLM-hakem (bir modelin başka bir modelin çıktısını puanlaması) güvenilir olabilir, ama puanlama ölçeği seçimi kritik — Ocak 2026'daki "Grading Scale" araştırması, 0-5 arası bir ölçeğin insan değerlendirmesiyle en güçlü uyumu (Pearson korelasyonu 0,89) verdiğini gösterdi; ikili (0/1) veya 10 puanlık ölçekler bu uyumu düşürüyor.

Bununla birlikte LLM-hakem tek başına yeterli değil; periyodik insan spot-check'leri (örneklem denetimi) olmadan, hakem modelin kendi sistematik yanlılıklarını fark etmeniz mümkün olmuyor. Pratikte önerilen oran, üretilen değerlendirmelerin en az %5-10'unun insan tarafından da gözden geçirilmesi.

## Kaç test senaryosu yeterli?

Kısa cevap: Toplu (aggregate) metriklere güvenmeden önce en az 500 senaryo hedefleyin — ama sayı tek başına yeterli değil, kalite sayıdan daha belirleyici. Kesin beklenen trajectory'leri olan 100 özenle seçilmiş senaryo, belirsiz beklenen çıktılı 1000 otomatik üretilmiş senaryodan daha değerli.

| Test katmanı | Neyi yakalıyor | Örnek araç/yöntem |
|---|---|---|
| Bileşen testi | Tekil araç çağrısı hataları | Mock API, sabit fixture |
| Trajectory izleme | Gereksiz/tekrarlı/güvensiz adımlar | Adım-adım assertion |
| LLM-hakem | Nihai cevap kalitesi, ton, doğruluk | 0-5 ölçekli puanlama + insan spot-check |
| Adversarial test | Prompt injection, jailbreak, yetki aşımı | Kırmızı takım senaryoları |

## Adversarial testler neden atlanmamalı?

Kısa cevap: Bir ajan araçlara ve dış verilere erişebildiği için, kötü niyetli bir kullanıcı girdisi veya zehirlenmiş bir doküman ajanı beklenmedik bir eyleme yönlendirebilir — bu yüzden prompt injection ve yetki aşımı senaryolarını test paketine baştan dahil etmek gerekiyor. Bir ajanın "normal" senaryolarda mükemmel çalışması, düşmanca bir girdi karşısında güvenli kalacağı anlamına gelmiyor.

Pratikte en sık kaçırılan senaryo, ajanın araç çıktısı içine gömülü talimatları (indirect prompt injection) fark etmeden yürütmesi — örneğin bir web sayfasını özetlerken, sayfanın içine gizlenmiş bir komutu gerçek bir kullanıcı isteğiymiş gibi işlemesi. Bu senaryoyu test setine eklemek, [CI/CD'ye AI ajanlarını güvenle bağlama](/tr/posts/ai-ajanlari-cicd-guvenle-baglamak) sürecinin ayrılmaz bir parçası olmalı.

## Golden transcript'ler zamanla nasıl bozuluyor?

Kısa cevap: Model sağlayıcı yeni bir sürüm çıkardığında veya araç şeması (tool schema) değiştiğinde, önceden kaydedilmiş golden transcript'ler artık gerçekçi olmayan bir davranışı referans alıyor olabilir — bu yüzden golden transcript setini statik bir dosya değil, düzenli olarak gözden geçirilen canlı bir varlık olarak yönetmek gerekiyor. Üç ay önce kaydedilmiş bir referans işlem kaydı, model sağlayıcı araç çağırma davranışını değiştirdiğinde sessizce yanlış pozitif üretmeye başlayabilir.

Pratik bir çözüm, her model sürüm güncellemesinde golden transcript setinin bir alt kümesini yeniden çalıştırıp insan tarafından tekrar onaylatmak. Bu, setin büyümesini kontrollü tutarken, modelin davranış değişikliklerini fark etmeden geçirmenizi de engelliyor.

## CI'da ajan testleri nasıl kapılanır (gate)?

Kısa cevap: Trajectory ve LLM-hakem skorlarına eşik (threshold) koyup, bu eşiğin altına düşen bir sürümün deploy edilmesini otomatik olarak engelleyin; ayrıca her test koşusuna bir maliyet bütçesi (token/istek sınırı) tanımlayın çünkü 500+ senaryoluk bir set gerçek model çağrılarıyla hızla pahalılaşabilir. Maliyeti düşürmek için küçük, ucuz bir modeli hakem olarak kullanıp yalnızca sınırda kalan sonuçları daha güçlü bir modele veya insana yönlendirmek yaygın bir pratik.

Benim gözlemim şu: ekipler genelde önce LLM-hakem kurup "yeterli" sanıyor, ama trajectory katmanını atladıkları için üretimdeki asıl maliyet patlamasını (gereksiz araç çağrıları) aylar sonra fark ediyor. Dört katmanı baştan kurmak, bu gecikmiş keşfi önlüyor.

Bütçe planlaması yaparken, test paketinin kendisinin de büyüyen bir maliyet kalemi olduğunu unutmayın: 500 senaryoluk bir set, her sürüm değişikliğinde tam olarak çalıştırıldığında gerçek model çağrıları üzerinden ciddi bir fatura oluşturabiliyor. Bu yüzden çoğu ekip, her commit'te küçük bir "duman testi" (smoke test) alt kümesini, günlük veya haftalık olarak da tam seti çalıştıran iki katmanlı bir CI yapısı kuruyor.

Ajan mimarisini workflow'dan ne zaman ayırmanız gerektiğini bilmiyorsanız [AI agent mi workflow mu](/tr/posts/ai-agent-mi-workflow-mu) karşılaştırmasına bakabilirsiniz; ilk MCP bağlayıcınızı yazarken de aynı dört katmanlı test yapısını [MCP bağlayıcı rehberindeki](/tr/posts/ilk-mcp-baglayicini-yaz-2026) araç tanımlarına uygulamak mantıklı.

## Sıkça Sorulan Sorular

### AI ajanı testinde en sık atlanan katman hangisi?

Trajectory (adım izleme) katmanı en sık atlanıyor çünkü kurulumu LLM-hakemden daha fazla mühendislik gerektiriyor. Ama bu katman olmadan, ajanın doğru cevaba ulaşırken yaptığı gereksiz veya güvensiz ara adımları hiçbir zaman göremezsiniz.

### LLM-hakem için hangi puanlama ölçeği daha güvenilir?

Ocak 2026'daki Grading Scale araştırmasına göre 0-5 arası bir ölçek, insan değerlendirmesiyle en güçlü uyumu (Pearson korelasyonu 0,89) veriyor. İkili (0/1) veya 10 puanlık ölçekler bu uyumu düşürüyor.

### Kaç test senaryosuna ihtiyacım var?

Toplu metriklere güvenmeden önce en az 500 senaryo hedefleyin, ama kalite sayıdan daha önemli. Kesin beklenen trajectory'leri olan 100 özenli senaryo, belirsiz 1000 otomatik senaryodan daha değerli.

### Adversarial test neden ajan testinde birim testten daha kritik?

Çünkü bir ajan dış araçlara ve verilere erişebildiği için, zehirlenmiş bir doküman veya kötü niyetli bir girdi onu beklenmedik bir eyleme yönlendirebilir. Bu risk, klasik yazılımdaki birim test kapsamının hiç karşılaşmadığı bir saldırı yüzeyi oluşturuyor.
