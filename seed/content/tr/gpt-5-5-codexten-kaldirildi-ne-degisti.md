---
title: "GPT-5.5 Codex ve ChatGPT'den Kaldırıldı: Ne Değişti?"
slug: "gpt-5-5-codexten-kaldirildi-ne-degisti"
translationKey: "gpt-5-5-retired-codex-chatgpt-2026"
locale: "tr"
excerpt: "OpenAI, GPT-5.5'i 14 Ekim 2026'da ChatGPT ve ChatGPT girişli Codex'ten kaldırdı. API anahtarı erişimi etkilenmedi; yerine ne geçtiğini anlatıyoruz."
category: "ai"
tags: ["openai", "chatgpt", "ai-coding", "llm"]
publishedAt: "2026-10-18"
seoTitle: "GPT-5.5 Codex ve ChatGPT'den Kaldırıldı: Ne Değişti?"
seoDescription: "GPT-5.5, 14 Ekim 2026'da ChatGPT ve ChatGPT girişli Codex'ten kaldırıldı. Kimler etkilendi, plana göre yerine geçen model ve kontrol listesi burada."
---

OpenAI, 14 Ekim 2026'da saat 19:00 UTC'de GPT-5.5'i ChatGPT'den ve ChatGPT hesabıyla giriş yapılan Codex oturumlarından kaldırdı. Model, OpenAI API'sini doğrudan kullandığınızda — API anahtarıyla giriş yapılan Codex oturumları dahil — hâlâ erişilebilir durumda. İş akışınız sadece ChatGPT girişine dayanıyorsa GPT-5.5 artık yok ve istekleriniz otomatik olarak yeni bir varsayılan modele yönleniyor.

## Bu değişiklik gerçekte kimi etkiliyor?

Bu kaldırma yalnızca ChatGPT girişini etkiliyor, API anahtarı erişimini etkilemiyor. Siz veya ekibiniz Codex'e (ya da doğrudan ChatGPT'ye) Free, Go, Plus, Pro, Business, Enterprise veya Edu planında bir ChatGPT hesabıyla giriş yapıyorsanız, eskiden GPT-5.5'e giden her istek artık yeni bir modele gidiyor.

Codex kurulumunuz bir OpenAI API anahtarıyla kimlik doğruluyorsa — CI hatlarında, betiklerde ve kendi barındırdığınız ajan altyapılarında yaygın olan düzen — GPT-5.5 eskisi gibi çalışmaya devam ediyor. Bu durumda model erişilebilirliği, bu kaldırma tarihine değil API organizasyonunuzun ve projenizin ayarlarına bağlı. Bu ayrım önemli, çünkü "Codex" tek bir şey gibi görünse de pratikte giriş yöntemi hangi kuralın size uygulandığını belirliyor.

## GPT-5.5'in yerine ne geçiyor, hangi planda?

Yerine geçen model, Codex mi ChatGPT mi kullandığınıza değil, planınıza bağlı. [OpenAI'nin kendi Codex model dokümantasyonu](https://developers.openai.com/codex/models), Plus, Pro, Business, Enterprise ve Edu planları için GPT-6.1 Sol'u (`gpt-6.1-sol`), Free ve Go planları için ise masaüstü uygulamasında GPT-6 Luna'yı (`gpt-6-luna`) yerine geçen model olarak gösteriyor.

| Plan | Eski model | Yerine geçen | Nerede geçerli |
|---|---|---|---|
| Plus / Pro | GPT-5.5 | GPT-6.1 Sol | ChatGPT sohbet + Codex (ChatGPT girişi) |
| Business / Enterprise / Edu | GPT-5.5 | GPT-6.1 Sol | ChatGPT sohbet + Codex (ChatGPT girişi) |
| Free / Go | GPT-5.5 | GPT-6 Luna | ChatGPT masaüstü uygulaması |
| Herhangi bir plan, API anahtarı | GPT-5.5 | Değişiklik yok | OpenAI API, API anahtarlı Codex |

Bazı üçüncü taraf yazılar yerine geçen modeli "GPT-5.6 Sol" olarak tanımlıyor, bazı geliştirici araçlarının değişiklik günlükleri de (GitHub Copilot dahil) GPT-5.5'i kendi ürüne özgü model adlarına eşliyor. Yapılandırma dosyalarına yazacağınız tam kimlikler için OpenAI'nin Codex model sayfasını referans kabul edin — üçüncü taraf adlandırmaları buradan geride kalabilir veya ayrışabilir.

## Geçişten sonra gerçekte ne bozuluyor?

Hiçbir araç çökecek şekilde bir şey bozulmuyor; ama `gpt-5.5`'i model kimliği olarak sabit kodlayan her şey, artık gerçek bir modelle eşleşmiyor ve çağıranın bilinmeyen model dizesini nasıl işlediğine göre hata veriyor ya da bir varsayılana düşüyor. [OpenAI'nin kendi ChatGPT sürüm notları](https://help.openai.com/en/articles/6825453-chatgpt-release-notes), bunun saklanabileceği beş yeri işaret ediyor:

- Çalışma alanı varsayılanları (kuruluş çapında bir "bu modeli kullan" ayarı)
- Kişisel bir ChatGPT veya Codex profilinde kayıtlı model ayarları
- BT veya platform ekibinin ittiği yönetilen yapılandırmalar
- Tanımında belirli bir modeli sabitleyen özel ajanlar veya GPT'ler
- Model adını parametre olarak geçen zamanlanmış görevler ve betikler

Bunun ortaya çıktığı tipik bir yer, modeli açıkça sabitleyen bir Codex CLI yapılandırması veya CI betiği:

```bash
# Eski yapılandırma — artık ChatGPT girişi için kaldırılmış bir modeli gösteriyor
codex exec --model gpt-5.5 "test paketini çalıştır ve hataları özetle"

# Plus/Pro/Business/Enterprise/Edu ChatGPT girişi için güncellendi
codex exec --model gpt-6.1-sol "test paketini çalıştır ve hataları özetle"
```

Aynı `codex exec` çağrısını ChatGPT girişi yerine `OPENAI_API_KEY` ile kimlik doğruluyorsanız, yukarıdaki `gpt-5.5` satırı hâlâ çalışıyor; çünkü API yolu bu kaldırmanın hiç parçası değil.

## GPT-5.5'in hâlâ referans verildiği her yeri nasıl bulursunuz?

Tahmin etmek yerine aramak daha hızlı. Depolarınızda, CI YAML dosyalarınızda ve iç dokümanlarınızda `gpt-5.5` dizesini arayın, ardından her ChatGPT ve Codex hesabının model ayarları sayfasını elle kontrol edin; çünkü bunlar kod tabanınızın dışında yaşıyor. Görev başına model sabitleyen [spec odaklı kodlama](/tr/posts/claude-code-codex-spec-odakli-kodlama) kurulumları, model adının üst düzey bir yapılandırma yerine bir spec dosyasının içine gömülü olması nedeniyle ekiplerin güncellemeyi unuttuğu yaygın bir yer.

CI'da ajan çalıştıran ekipler için aynı dikkat, modeli merkezi bir sabitten okumak yerine dize olarak referans veren [OpenAI'nin Agents API'si](/tr/posts/openai-agents-api-nedir) üzerine kurulu her şey için geçerli — böyle bir kaldırma, bunu henüz merkezileştirmediyseniz yapmak için iyi bir zorlayıcı sebep.

## OpenAI, ChatGPT'ye bakan bir modeli daha önce de böyle mi kaldırdı?

Hayır değil, bu ilk kez değil. OpenAI, yeni modeller çıktıkça tüketiciye bakan eski modelleri daha önce de kaldırdı; [GPT-5.6'nın Codex masaüstünde genel kullanıma açılması](/tr/posts/gpt-5-6-genel-kullanima-acildi) da kendi döngüsünde benzer bir örüntü izledi: yeni model çıkıyor, bir süre eskiyle birlikte var oluyor, sonra eski model API'de daha uzun yaşarken giriş tabanlı erişimden kesiliyor. Anthropic da kendi modelleri için benzer geçişler yürüttü; [Claude Opus 4.1 emekliliği ve geçiş rehberi](/tr/posts/claude-opus-4-1-emekli-oldu-gecis-rehberi) ile [Claude Sonnet 4.5 emeklilik rehberi](/tr/posts/claude-sonnet-4-5-emekli-sonnet-5-5-gecis) bu örüntüyü doğruluyor: her iki örnekte de API penceresi, tüketici uygulaması penceresinden daha uzun ömürlü oldu.

Dürüst görüşüm: ChatGPT girişi erişimini kesip API'yi açık tutmak OpenAI için doğru bir karar, ama bu sessizce, API anahtarı yönetiminden kaçınmak için özellikle giriş yolunu seçen ekipleri cezalandırıyor — iş akışlarında daha az uyarı varken, API anahtarı kullanıcılarının korunduğu kırıcı değişiklikle yüz yüze geliyorlar.

## Bu hafta ne yapmalısınız?

Model dizesinin sabit kodlandığı her yeri denetleyin, plana uygun yenisine güncelleyin ve bir sonraki kaldırmanın depo çapında bir arama yerine tek satırlık bir düzeltme olması için modeli birden fazla betiğe gömmek yerine tek bir yapılandırma değerinden okumayı düşünün — OpenAI'nin [API değişiklik günlüğü](https://platform.openai.com/docs/changelog), bir sonrakini bir betiği bozmadan yakalamanın en hızlı yolu. [Codex'in 5 saatlik kullanım limitinin geri dönüşüyle](/tr/posts/openai-codex-5-saatlik-limit-geri-dondu) de uğraşıyorsanız, bu hafta tüm Codex yapılandırmanızı iki kez yama yapmak yerine bir kerede gözden geçirmek için iyi bir zaman.

## Bu geçişten çıkarılacak daha geniş ders ne?

Model kimliklerini kod veya yapılandırmaya sabit kodlamak, kısa vadede en hızlı yol gibi görünüyor ama her kaldırma döngüsünde aynı taramayı tekrar tekrar yapmanıza neden oluyor. Model adını tek bir ortam değişkeninde veya merkezi bir yapılandırma dosyasında tutup her yerden ona referans vermek, bir sonraki kaldırmayı depo çapında bir aramadan tek satırlık bir değişikliğe indiriyor. Bu, yalnızca OpenAI için değil; Anthropic, Google ve diğer sağlayıcıların kendi emeklilik döngüleri için de geçerli bir alışkanlık.

## Sıkça Sorulan Sorular

### GPT-5.5'in kaldırılması OpenAI API'sini etkiliyor mu?
Hayır. OpenAI'nin kaldırması yalnızca ChatGPT'yi ve ChatGPT girişiyle kimlik doğrulanan Codex oturumlarını kapsıyor. OpenAI API'si açıkça muaf; bu yüzden bir API anahtarı kullanan her entegrasyon GPT-5.5'e erişmeyi sürdürüyor ve erişilebilirlik bu geçiş tarihine değil API organizasyonunuzun ve projenizin ayarlarına bağlı kalıyor.

### Codex'te GPT-5.5 yerine hangi modeli kullanmalıyım?
Plus, Pro, Business, Enterprise veya Edu planındaysanız GPT-6.1 Sol'u (`gpt-6.1-sol`) kullanın. Free veya Go planındaysanız masaüstü uygulamasında GPT-6 Luna'yı (`gpt-6-luna`) kullanın. İkisi de OpenAI'nin Codex model sayfasında belgelenen yenileri; üçüncü taraf bir değişiklik günlüğünde gördüğünüz başka bir adı, OpenAI'nin değil o aracın kendi eşlemesi olarak değerlendirin.

### Neden bazı kaynaklar yerine geçen modelin GPT-5.6 Sol olduğunu söylüyor, GPT-6.1 Sol değil?
Bir kısım ikincil kaynak ve GitHub Copilot'un değişiklik günlüğü dahil bazı geliştirici araçları, yerine geçen modeli OpenAI'nin kendi dokümantasyonundan farklı tanımlıyor. Bu fark, farklı ürünlerin farklı zamanlarda kendi varsayılanlarını seçmesinden kaynaklanıyor olabilir; Codex için özel olarak OpenAI'nin Codex model sayfasında geçen GPT-6.1 Sol ve GPT-6 Luna adları güvenilecek rakam.

### Codex kurulumumun API anahtarı mı yoksa ChatGPT girişi mi kullandığını nasıl anlarım?
Codex'i ilk kurduğunuzda nasıl kimlik doğruladığınıza bakın: tarayıcı üzerinden bir giriş akışı ve bir ChatGPT hesabı kullandıysanız giriş tabanlı kimlik doğrulamadasınız ve bu kaldırmadan etkilendiniz. Bir `OPENAI_API_KEY` ortam değişkeni ayarladıysanız veya bir anahtarı açıkça geçtiyseniz API anahtarı tabanlı kimlik doğrulamadasınız ve bu tarihten bağımsız olarak GPT-5.5 sizin için çalışmayı sürdürüyor.
