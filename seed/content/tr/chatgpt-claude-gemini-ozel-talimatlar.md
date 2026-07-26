---
title: "ChatGPT, Claude ve Gemini'de Özel Talimatlar"
slug: "chatgpt-claude-gemini-ozel-talimatlar"
translationKey: "custom-instructions-big-three-ai"
locale: "tr"
excerpt: "Çoğu kullanıcı özel talimatlar ayarını hiç açmıyor. ChatGPT, Claude ve Gemini de bu ayarın ne yaptığını ve üç kopyala-yapıştır şablonunu anlatıyoruz."
category: "ai"
tags: ["chatgpt", "claude", "gemini", "prompt-engineering"]
publishedAt: "2026-07-26"
seoTitle: "ChatGPT, Claude ve Gemini'de Özel Talimatlar"
seoDescription: "Çoğu kullanıcı özel talimatlar ayarını hiç açmıyor. ChatGPT, Claude ve Gemini de bu ayarın ne yaptığını ve üç kopyala-yapıştır şablonunu anlatıyoruz."
---

Her üç büyük AI asistanı da aynı sorunu farklı bir ayar arkasına saklıyor: her yeni sohbette aynı tonu, aynı formatı, aynı kısıtlamaları tekrar tekrar yazmak zorunda kalmak. Özel talimatlar (custom instructions) tam olarak bunu çözüyor ama çoğu kullanıcı ayarın var olduğunu bile bilmiyor. Bu yazı, üç asistanda bu ayarın nerede yaşadığını, gerçekte neyi kontrol edip neyi kontrol etmediğini ve kopyala-yapıştır kullanabileceğiniz üç şablonu ele alıyor.

## Özel talimatlar gerçekte ne kontrol ediyor?

Özel talimatlar bir kişilik yaratmıyor; varsayılan davranışı ayarlıyor. Ton (resmi mi samimi mi), format (madde işaretli mi paragraf mı, kod örnekleri var mı), varsayımlar (hangi programlama dilini kullandığınız, hangi zaman diliminde olduğunuz) ve kısıtlamalar (belirli bir üslubu asla kullanma, her zaman kaynak belirt) gibi kalıcı tercihleri kaydediyor. Bunun ötesine geçip "bu asistan bir emlak danışmanı gibi davransın" gibi tam bir persona oluşturmak istiyorsanız, bu iş özel talimatların değil, Claude Projeleri, ChatGPT Projeleri veya Gemini Gems gibi ayrı bir katmanın işi.

Fark önemli çünkü çoğu kullanıcı özel talimatlara bir persona gibi davranıp aşırı yükleme yapıyor; sonuç, hiçbir görevde tam oturmayan, çelişkili bir talimat yığını oluyor.

## Her biri nerede yaşıyor?

ChatGPT'de özel talimatlar Ayarlar > Kişiselleştirme altında; iki ayrı kutu var: "Bilmemi ister misiniz" (sizinle ilgili bağlam) ve "Nasıl yanıt vermemi istersiniz" (ton ve format tercihleri). Bu ayar tüm yeni sohbetlere otomatik uygulanıyor.

Claude'da bu ayar Ayarlar > Profil altında "Kişisel tercihler" olarak yaşıyor ve tüm sohbetlere uygulanıyor; ayrıca Claude Projeleri kullanıyorsanız her projenin kendi ek talimat katmanı var, bu da genel tercihlerinizin üzerine belirli bir proje veya müşteri için özel kurallar eklemenizi sağlıyor.

Gemini'de karşılığı "Kayıtlı Bilgi" (Saved Info); Ayarlar > Kişiselleştirme altında "her zaman basit anlat" veya "hem İngilizce hem Türkçe yanıtla" gibi kalıcı kurallar ekleyebiliyorsunuz. Gemini ayrıca Gems özelliğiyle bir adım öteye gidiyor: bir Gem oluştururken hedefinizi bir iki cümlede yazıp cadı değneği (wand) simgesine tıklayarak Gemini'nin talimatı sizin için yeniden yazmasını isteyebiliyorsunuz; bu, sıfırdan bir sistem promptu yazma sürtünmesini büyük ölçüde azaltıyor.

| Asistan | Ayarın adı | Nerede bulunur |
|---|---|---|
| ChatGPT | Özel Talimatlar | Ayarlar > Kişiselleştirme |
| Claude | Kişisel Tercihler | Ayarlar > Profil |
| Gemini | Kayıtlı Bilgi (+ Gems) | Ayarlar > Kişiselleştirme |

## Kopyala-yapıştır şablon

Üç asistanda da işe yarayan basit bir yapı: rol, kısıtlamalar ve çıktı formatı.

```text
Rol: Kıdemli bir [alan] uzmanısın.
Kısıtlamalar: Asla [kaçınılacak şey] yapma. Her zaman [gerekli davranış].
Çıktı formatı: [madde işaretli / kısa paragraf / kod bloklu], varsayılan olarak [dil] kullan.
Bağlam: [sizinle veya işinizle ilgili sabit bilgi, ör. teknoloji yığını, hedef kitle].
```

Bu şablonu doldurup üçüne de aynen yapıştırabilirsiniz; ChatGPT ve Claude'da genel tercih kutusuna, Gemini'de ise Kayıtlı Bilgi'ye veya bir Gem'in talimat alanına.

## Yaygın hatalar

En sık görülen hata aşırı yükleme: on beş farklı kural eklemek, modelin hangisine öncelik vereceğini şaşırmasına yol açıyor. İkinci hata çelişki: "kısa yanıt ver" ile "her zaman detaylı açıklama ekle" gibi birbirini geçersiz kılan iki talimatı aynı anda eklemek. Üçüncü hata bayatlamış bağlam: altı ay önce yazdığınız "şu anki projem X" gibi bir cümleyi güncellemeden bırakmak, model artık ilgisiz bir bağlamla çalışmaya devam ediyor. Talimatları üç ayda bir gözden geçirip artık geçerli olmayanları temizlemek, bu sorunun büyük kısmını çözüyor.

## Takım halinde çalışırken talimatları paylaşmak

Bir ekipte birden fazla kişi aynı asistanları kullanıyorsa, herkesin kendi özel talimatını sıfırdan yazması tutarsızlığa yol açıyor; bir ekip üyesinin aldığı yanıt formatı diğerininkinden farklı oluyor. Bunun basit bir çözümü var: şablonu ekip için ortak bir dokümana (bir wiki sayfası veya paylaşılan bir not) yazıp her üyenin kendi kişisel tercih kutusuna aynen yapıştırmasını istemek. Claude ve ChatGPT'de Projeler kullanıyorsanız bu daha da kolaylaşıyor; proje talimatı tek bir yerde tanımlanıyor ve projeye erişimi olan herkes aynı bağlamı otomatik alıyor, bu da kişisel tercih kutusundaki tutarsızlık riskini ortadan kaldırıyor. Gemini'de ise bir Gem'i ekip içinde paylaşmak benzer bir standartlaştırma sağlıyor; herkes aynı Gem'i kullandığı sürece talimat tutarlılığı korunuyor.

## Persona mı, engagement mı?

Burada asıl karar noktası şu: özel talimatlar tüm sohbetlerinize sirayet eden genel tercihleriniz içindir; Claude/ChatGPT Projeleri veya Gemini Gems ise belirli bir angajman (bir müşteri, bir kampanya) veya belirli bir persona (bir kod inceleme asistanı, bir metin editörü) için ayrı, izole bir bağlam katmanı sağlar. Genel yazım tonunuzu her yerde aynı tutmak istiyorsanız özel talimatlar yeterli; ama farklı müşteriler veya projeler için farklı bağlamlar tutmanız gerekiyorsa, tek bir genel talimat kutusu yetersiz kalır ve Proje/Gem katmanına geçmeniz gerekir.

Bence en büyük kaçırılan fırsat, insanların bu ayarı hiç açmaması; beş dakikalık bir kurulum, sonraki yüzlerce sohbette aynı bağlamı tekrar yazmaktan kurtarıyor. Prompt yazma pratiğinizi daha derinlemesine geliştirmek isterseniz [geliştiriciler için prompt mühendisliği](/tr/posts/prompt-muhendisligi-teknikleri) yazımıza, ChatGPT'nin plan seçeneklerine dair genel bir bakış için [ChatGPT tam rehber 2026](/tr/posts/chatgpt-tam-rehber-2026) yazımıza bakabilirsiniz. Bu talimatları sesli modda da tutarlı kullanmak istiyorsanız [AI sesli asistan kıyaslaması](/tr/posts/ai-sesli-asistan-kiyaslamasi-gpt-live-gemini-claude) yazımız üç asistanın sesli tarafını nasıl farklı ele aldığını gösteriyor.

## Talimatları test etmenin hızlı bir yolu

Bir talimat kümesini kaydettikten sonra işe yarayıp yaramadığını anlamanın en hızlı yolu, aynı soruyu talimat açıkken ve kapalıyken sormak ve iki yanıtı yan yana koymaktır. Fark yoksa talimat muhtemelen çok genel yazılmış demektir; net bir fark varsa ama yanıt beklediğinizden farklıysa, muhtemelen bir çelişki veya belirsiz bir ifade var demektir. Bu hızlı testi her büyük değişiklikten sonra tekrarlamak, talimatların zamanla birikip birbirini geçersiz kılan bir yığına dönüşmesini engelliyor.

## Üç hazır şablon

**Geliştirici asistanı:** "Rol: kıdemli bir backend geliştiricisin. Kısıtlamalar: kod örneklerini her zaman TypeScript ile ver, gereksiz açıklama ekleme. Çıktı formatı: önce kısa özet, sonra kod bloğu."

**İçerik editörü:** "Rol: bir teknik blog editörüsün. Kısıtlamalar: pasif çatıdan kaçın, jargonu açıkla. Çıktı formatı: kısa paragraflar, gerektiğinde madde işareti."

**Müşteri desteği taslakçısı:** "Rol: bir müşteri destek temsilcisisin. Kısıtlamalar: asla kesin teslim tarihi verme, her zaman empatik bir cümleyle başla. Çıktı formatı: 3-4 cümlelik kısa yanıt."

## Mobil ve masaüstü arasında tutarlılık

Bir başka gözden kaçan nokta, bu ayarların hesap bazında değil bazen cihaz veya uygulama bazında farklı davranabilmesi. Örneğin bir tarayıcı üzerinden girdiğiniz özel talimatların mobil uygulamada da aktif olduğunu varsaymak yerine, yeni bir cihazda ilk kullanımda ayarı kontrol etmek iyi bir alışkanlık. Üç asistan da hesabınıza bağlı olduğu için genelde senkronize oluyor, ama özellikle kurumsal hesaplarda (iş için ayrı bir Google Workspace veya Microsoft hesabı) kişisel ve iş hesabı ayarlarının birbirine karışmadığından emin olmakta fayda var.

## Sıkça Sorulan Sorular

### Özel talimatlar ile bir Proje/Gem arasındaki fark nedir?

Özel talimatlar tüm sohbetlerinize uygulanan genel, kalıcı tercihlerdir. Proje veya Gem ise belirli bir görev, müşteri veya persona için izole, ek bir bağlam katmanıdır; genel talimatlarınızın üzerine eklenir.

### Gemini'nin talimatları otomatik yeniden yazma özelliği nasıl çalışır?

Bir Gem oluştururken hedefinizi kısaca yazıp cadı değneği simgesine tıklıyorsunuz; Gemini bu kısa açıklamayı daha yapılandırılmış bir sistem talimatına dönüştürüyor. Bu, sıfırdan yazma sürtünmesini azaltıyor ama çıktıyı gözden geçirip kendi ihtiyacınıza göre düzeltmeniz önerilir.

### Kaç talimat eklemek çok fazla sayılır?

Kesin bir sayı yok ama beşten fazla farklı kural genelde modelin önceliklendirmede zorlanmasına yol açıyor. Az sayıda, net ve çelişkisiz kural, uzun bir liste yerine daha tutarlı sonuç veriyor.

### Bu ayarları düzenli olarak güncellemem gerekiyor mu?

Evet, özellikle projeleriniz veya rolünüz değiştiğinde. Üç ayda bir gözden geçirip artık geçerli olmayan bağlamı (eski bir proje adı, değişen bir teknoloji tercihi) temizlemek, modelin güncel olmayan varsayımlarla çalışmasını önlüyor.
