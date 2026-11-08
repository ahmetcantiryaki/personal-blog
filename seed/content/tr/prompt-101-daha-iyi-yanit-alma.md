---
title: "Prompt 101: Her Yapay Zekâdan Daha İyi Yanıt Alın"
slug: "prompt-101-daha-iyi-yanit-alma"
translationKey: "prompting-101-better-answers-any-ai"
locale: "tr"
excerpt: "Kısa cevap: rol, bağlam, görev ve formatı sırasıyla verin; bir örnek ve bir kısıtlama ekleyin, yanıtı yeniden başlamak yerine düzelterek ilerletin."
category: "ai"
tags: ["prompt-engineering", "ai-tools", "productivity", "learning"]
publishedAt: "2026-11-08"
seoTitle: "Prompt 101: Her Yapay Zekâdan Daha İyi Yanıt Alın"
seoDescription: "Kısa cevap: rol, bağlam, görev ve formatı sırasıyla verin; bir örnek ve bir kısıtlama ekleyin, yanıtı yeniden başlamak yerine düzelterek ilerletin."
---

Kısa cevap: önce yapay zekaya hangi rolde cevap vermesini (rol), hangi arka planla (bağlam), tam olarak ne yapması gerektiğini (görev) ve yanıtın nasıl görünmesi gerektiğini (format) söyleyin; bir örnek ve bir kısıtlama ekleyin, sonra yanıtı tek seferde mükemmel bekleyeceğinize düzelterek ilerletin. Bu dört parça, Claude, ChatGPT ve Gemini'nin hepsinde aynı şekilde işe yarar; çünkü hiçbiri sizin kafanızdakini okuyamaz, sadece yazdığınızı okur.

## Neden belirsiz promptlar işe yaramıyor?

Çünkü yapay zekanın sizinle paylaştığı bir geçmiş yok; her soru, sıfırdan başlayan bir yabancıya sorulmuş gibi değerlendirilir. "Bana bir e-posta yaz" dediğinizde model, kime, hangi tonla, hangi amaçla yazılacağını tahmin etmek zorunda kalır ve genelde en güvenli, en genel geçer seçeneği üretir. Belirsizlik ne kadar büyükse, modelin tahmin payı o kadar büyür; tahmin payı büyüdükçe de yanıtın sizin ihtiyacınıza uyma olasılığı düşer. Çözüm karmaşık bir teknik değil: eksik bıraktığınız bilgiyi modelin tahmin etmesine izin vermeden kendiniz vermek.

## İyi bir prompt nasıl yapılandırılır?

Dört parçayı sırayla verin: rol, bağlam, görev, format. Rol, modelin hangi bakış açısıyla cevap vereceğini belirler ("deneyimli bir muhasebeci gibi davran"); bağlam, kararını etkileyecek gerçekleri verir ("küçük bir e-ticaret şirketiyim, 3 çalışanım var"); görev, tam olarak ne istediğinizi söyler ("Kasım ayı nakit akışı tablosu hazırla"); format ise yanıtın şeklini belirler ("madde madde, 5 kalemi geçmesin").

| Parça | Soru | Örnek |
|---|---|---|
| Rol | Model kim gibi davranmalı? | "Kıdemli bir ürün yöneticisi gibi yanıt ver" |
| Bağlam | Kararı etkileyen hangi gerçekler var? | "Ekibimiz 4 kişi, sprint 2 hafta" |
| Görev | Tam olarak ne isteniyor? | "Bu özelliğin önceliğini gerekçeyle sırala" |
| Format | Yanıt nasıl görünmeli? | "Tablo halinde, en fazla 6 satır" |

Bu dört parçayı tek bir mesajda art arda yazmak, çoğu zaman beş-altı tur süren bir sohbeti tek mesaja indirir.

## Örnek ve kısıtlama vermek neden önemli?

Çünkü bir örnek, bin kelimelik tarif yazmaktan daha az belirsiz kalır. "Bu e-posta gibi yaz" diyip gerçek bir örnek yapıştırmak, modelin tonunuzu, cümle uzunluğunuzu ve resmiyet seviyenizi doğrudan kopyalamasını sağlar; "resmi ama sıcak bir ton kullan" demek ise yine yoruma açık kalır. Kısıtlamalar da aynı işi görür: "150 kelimeyi geçme", "teknik jargon kullanma", "üç madde ile sınırla" gibi somut sınırlar, modelin olası çıktı uzayını daraltır ve ilk denemede işinize yarayan bir sonuç alma şansınızı yükseltir.

## AI'dan gerekçe veya kontrol listesi nasıl istenir?

Doğrudan isteyerek: "cevabı vermeden önce hangi varsayımları yaptığını listele" veya "son yanıtı vermeden önce üç maddelik bir kontrol listesiyle kendi kendini denetle" gibi bir talimat ekleyin. Bu, modelin sonucu üretmeden önce kendi mantığını açık hale getirmesini zorunlu kılar; siz de yanlış bir varsayımı, cevabı kullanmadan önce yakalarsınız. Özellikle sayısal hesap, karşılaştırma veya karar gerektiren işlerde bu tek satırlık ek talimat, hatalı bir yanıtı fark etmeden kullanmanızı önler.

## Yanıt kötüyse yeniden mi başlamalı, düzeltmeli mi?

Düzeltin, yeniden başlamayın. Aynı sohbette "daha kısa yaz", "daha resmi olsun", "her iddiaya bir sayı ekle" gibi net bir düzeltme istediğinizde model, önceki yanıtını ve sizin geri bildiriminizi birlikte değerlendirir; bu da yeni bir sohbette sıfırdan yazdığınız uzun bir promptdan genelde daha hızlı sonuç verir. Yeniden başlamak yalnızca konunun tamamen değiştiği veya önceki bağlamın yanıtı sürekli yanlış yöne çektiği durumlarda mantıklı.

```text
Rol: [kimin bakış açısıyla cevap versin]
Bağlam: [kararı etkileyen 2-3 gerçek]
Görev: [tam olarak ne istiyorsun]
Format: [uzunluk, yapı, ton]
Örnek (varsa): [istediğin tarzda kısa bir örnek]
Kısıtlama: [kaçınılması gereken şey]
```

### Örnek 1: İş e-postası

Önce: "Patronuma bir mail yaz, süre uzatması isteyeceğim."
Sonra: "Rol: profesyonel ama samimi bir çalışan gibi yaz. Bağlam: proje teslim tarihi 15 Kasım, bir tedarikçi gecikmesi yüzünden 1 hafta erteleme istiyorum. Görev: yöneticime bu durumu açıklayan, net bir yeni tarih öneren bir e-posta taslağı hazırla. Format: en fazla 120 kelime, 3 kısa paragraf." İkincisi işe yarar çünkü model artık hangi gecikmeyi, hangi yeni tarihi ve hangi uzunluğu yazacağını tahmin etmek zorunda değil.

### Örnek 2: Uzun bir metni özetleme

Önce: "Bu makaleyi özetle."
Sonra: "Rol: editör gibi oku. Bağlam: bu özeti haftalık bir bültene koyacağım, okuyucular teknik değil. Görev: makalenin ana iddiasını ve en önemli 3 veriyi çıkar. Format: 80 kelimelik bir giriş paragrafı ve altında 3 madde." Format ve hedef okuyucu net olduğu için model, teknik ayrıntılara boğulmadan doğru seviyede bir özet üretir.

### Örnek 3: Hafta sonu planı

Önce: "Hafta sonu için bana bir plan yap."
Sonra: "Rol: yerel bir seyahat danışmanı gibi öner. Bağlam: İstanbul'dayım, 2 kişiyiz, bütçemiz kişi başı 1500 TL, yürüyerek gezmeyi seviyoruz. Görev: cumartesi-pazar için saat saat bir plan çıkar. Format: gün başlıkları altında madde madde, her madde tek satır." Bütçe ve tercih bilgisi verildiği için model, bütçenizi aşan veya tarzınıza uymayan öneriler üretme riskini kaybeder.

## Hangi AI'da hafıza veya proje özelliği var?

Üçünde de var, ama farklı isimlerle. Claude'da Projeler var: bir projeye referans dosyaları ve talimatlar yüklersiniz, o projedeki her sohbet bu ortak bilgiyi kullanır. ChatGPT'de Özel Talimatlar (Custom Instructions) ve ayrı bir Hafıza (Memory) özelliği bulunur; Kasım 2026 itibarıyla OpenAI'nin yardım merkezi, Özel Talimatlar'da Free ve Go planlarında 1.500 karakter, Plus, Pro, Enterprise, Business ve Education planlarında 5.000 karaktere kadar yer olduğunu belirtiyor. Gemini'de ise Gem'ler var: kayıtlı talimatları ve referans dosyaları olan özel asistanlar. Hangisini kullanırsanız kullanın, mantık aynı: sürekli tekrar ettiğiniz bağlamı bir kere yazıp kaydedin, her sohbette yeniden yazmayın.

Kişisel görüşüm şu: insanlar "sihirli prompt" aramaya, iyi bir ilk taslağı düzelterek ilerletmekten çok daha fazla zaman harcıyor. Oysa dört parçayı (rol, bağlam, görev, format) art arda yazıp sonucu iki-üç geri bildirimle düzeltmek, internette dolaşan "mükemmel prompt şablonlarını" ezberlemekten çok daha az zaman alıyor ve çok daha tutarlı sonuç veriyor.

Bu dört parçayı daha teknik bir bakışla ele almak isterseniz [geliştiriciler için prompt mühendisliği rehberimize](/tr/posts/prompt-muhendisligi-teknikleri) bakabilirsiniz; sürekli kullandığınız promptları tekrar yazmaktan kurtulmak için [kişisel prompt kütüphanesi kurma rehberimiz](/tr/posts/kisisel-prompt-kutuphanesi-nasil-kurulur) işinize yarar. Claude, ChatGPT ve Gemini'nin özel talimat özelliklerini yan yana karşılaştırdığımız [ayrı bir yazımız](/tr/posts/chatgpt-claude-gemini-ozel-talimatlar) ve hangi plana ihtiyacınız olduğunu netleştiren [AI abonelik rehberimiz](/tr/posts/hangi-ai-aboneligi-claude-chatgpt-gemini) de bu konuyu tamamlıyor. Anthropic'in resmi [prompt mühendisliği dokümantasyonu](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview) ve OpenAI'nin [Özel Talimatlar yardım sayfası](https://help.openai.com/en/articles/8096356-chatgpt-custom-instructions) da güncel sınırları takip etmek için faydalı kaynaklar. Daha fazla [yapay zeka](/tr/category/yapay-zeka) rehberine kategori sayfamızdan ulaşabilirsiniz.

## Sıkça Sorulan Sorular

### İyi bir prompt nasıl yazılır?

Kısa cevap: rolü, bağlamı, görevi ve formatı sırayla ve açıkça yazın, mümkünse bir örnek ekleyin. Bu dört parça eksikse model boşlukları tahminle doldurur; tahmin arttıkça yanıtın işinize yarama olasılığı düşer, bu yüzden eksik bıraktığınız her bilgi aslında modele devrettiğiniz bir karar demektir.

### Prompt ne kadar uzun olmalı?

Net cevap: gereken bilgi kadar, ne eksik ne fazla. Üç-dört cümlede rol, bağlam, görev ve formatı veren bir prompt, genelde tek kelimelik bir komuttan çok daha iyi sonuç verir; ama gereksiz ayrıntıyla şişirilmiş bir prompt da modelin odağını dağıtabilir, o yüzden her cümlenin kararı etkileyip etkilemediğini kendinize sorun.

### Hangi yapay zekada hafıza veya proje özelliği var?

Üçünde de var: Claude'da Projeler, ChatGPT'de Özel Talimatlar ve Hafıza, Gemini'de Gem'ler. Hepsi aynı amaca hizmet eder: sürekli tekrarladığınız bağlamı bir kere kaydedip her sohbette yeniden yazmaktan kurtulmak; farkları isimlerinde ve karakter sınırlarında.

### Yanıt işe yaramazsa yeni bir sohbete mi başlamalıyım?

Hayır, genelde gerekmez. Aynı sohbette "daha kısa yaz", "daha resmi olsun" gibi net bir düzeltme istemek, modelin önceki yanıtını ve geri bildiriminizi birlikte değerlendirmesini sağlar; bu da sıfırdan yazılan uzun bir promptdan çoğu zaman daha hızlı iyi bir sonuca ulaştırır.
