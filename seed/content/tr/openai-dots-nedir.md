---
title: "OpenAI Dots Nedir? ChatGPT'nin Her Zaman Açık Ajanları"
slug: "openai-dots-nedir"
translationKey: "openai-dots-always-on-agents-2026"
locale: "tr"
excerpt: "OpenAI Dots, GPT-6 Astra ile çalışan, 4.000'den fazla uygulamaya bağlanan ve görüşme bittikten sonra da çalışmaya devam eden her zaman açık ChatGPT ajanlarıdır."
category: "ai"
tags: ["openai", "chatgpt", "ai-agents", "automation"]
publishedAt: "2026-10-02"
seoTitle: "OpenAI Dots Nedir? Fiyat, Erişim ve ChatGPT Work Farkı"
seoDescription: "OpenAI Dots: GPT-6 Astra destekli, 4.000+ uygulamaya bağlanan her zaman açık ChatGPT ajanları. Fiyat, erişim koşulları ve ChatGPT Work farkı, Ekim 2026."
---

Kısa cevap: OpenAI Dots, 29 Eylül 2026'da DevDay'de tanıtılan, GPT-6 Astra üzerinde çalışan ve kendi bulut bilgisayarına sahip her zaman açık ChatGPT ajanlarıdır. Bir dot, görevi tek seferlik bir sohbette bitirmek yerine konuşma kapandıktan sonra da arka planda çalışmaya devam eder; 4.000'den fazla uygulamaya bağlanabilir ve karar gerektiren noktalarda kullanıcıya geri döner. İlk dot, Pro planın ($100/ay) ve Business Premium koltuğunun içinde geliyor.

## OpenAI Dots nedir?

Dots, ChatGPT içinde yaşayan, bir sorumluluğu üstlenip o sorumluluğu sürekli takip eden ajanlardır. Klasik bir ChatGPT konuşması bir işi planlamana yardım eder; bir dot ise o işi bağlı uygulamalar üzerinde fiilen yürütür ve koşullar değiştikçe ilerlemeye devam eder.

Her dot kendi bulut bilgisayarını ve kendi tarayıcısını alır, GPT-6 Astra modeliyle çalışır ve ChatGPT'nin eklenti ekosistemi üzerinden 4.000'in üzerinde uygulamaya erişebilir. Bir kullanıcı bir dot'a "rakip fiyatlarını haftalık izle ve değişiklik olursa bana özet çıkar" gibi süregelen bir görev verebilir; dot bu görevi arka planda sürdürür, bağlam biriktirir ve insanın yargısı gerektiğinde devreye girer.

## OpenAI Dots, ChatGPT Work'ten farklı mı?

Evet, ikisi farklı ürünler. [ChatGPT Work](/tr/posts/chatgpt-work-nedir-openai-is-ajani), tek seferlik, çok adımlı bir teslimatı (araştırma, dosya işleme, web görevleri) senin başlattığın bir oturumda tamamlayan bir ajan. Dots ise 7/24 çalışan, birden fazla projeyi aynı anda takip eden ve konuşma bitse bile ilerlemeye devam eden bir sistem.

| Özellik | ChatGPT Work | OpenAI Dots |
|---|---|---|
| Çalışma şekli | Sen başlatırsın, tek oturumda biter | Her zaman açık, konuşma kapansa da sürer |
| Süre | Tek görev, saatler içinde | Süregelen sorumluluk, günler-haftalar |
| Bağlantı | Web tarayıcısı, izinle masaüstü dosyaları | 4.000+ uygulama, e-posta, yerel yazılım |
| Model | GPT-6 Astra | GPT-6 Astra |
| Kullanım örneği | "Bu pazar araştırmasını bitir" | "Rakip fiyatlarını her hafta izle" |

Bu ayrım önemli çünkü ikisini karıştırmak yanlış beklenti yaratıyor: Work'ü süregelen bir izleme görevi için kullanırsan oturum kapandığında iş durur; dot'u tek seferlik bir araştırma için kurarsan gereksiz yere arka planda çalışan bir ajan biriktirirsin.

## OpenAI Dots'un fiyatı ne kadar?

İlk dot, ChatGPT Pro aboneliğinin ($100/ay) içinde geliyor; bu abonelik zaten GPT-6 Astra, derin araştırma, Codex ve ChatGPT Work'ü kapsıyor. Business Premium koltuğu da yıllık faturalandırmada kullanıcı başına 100 dolar (aylık faturada 125 dolar) ile dot erişimi sağlıyor. Ek kapasite isteyen güç kullanıcıları için 500 dolarlık bir üst kademe de tanıtıldı.

Erişim koşulları plana göre değişiyor: Pro 100, Pro 200 ve Pro 500 kademelerinde dot kullanımı, Avrupa Ekonomik Alanı, Birleşik Krallık ve İsviçre dışındaki 18 yaş üstü kullanıcılarla sınırlı. Business Premium'da ise böyle bir bölgesel kısıtlama yok; desteklenen tüm ChatGPT bölgelerindeki kurumsal kullanıcılar erişebiliyor.

## OpenAI Dots nasıl kullanılır?

Bir dot kurarken üç şeyi tanımlarsın: sorumluluğun ne olduğu, hangi uygulamalara erişeceği ve hangi kararları sana bırakacağı. Örneğin bir e-ticaret ekibi, stok seviyelerini izleyip belirli bir eşiğin altına düşen ürünler için tedarikçiye otomatik sipariş taslağı hazırlayan ama siparişi onaylamayı insana bırakan bir dot kurabilir.

```json
{
  "task": "Stok seviyesi 50 adedin altına düşen ürünler için tedarikçiye sipariş taslağı hazırla",
  "connectedApps": ["shopify", "gmail", "google-sheets"],
  "requiresApproval": ["purchase_order_send"],
  "checkInterval": "daily"
}
```

Bu örnek, bir dot'un gerçek API şemasını değil, görev tanımının mantığını gösteriyor; OpenAI henüz geliştiriciler için ayrı bir Dots API'si yayınlamadı, yapılandırma şu an için ChatGPT arayüzü üzerinden yapılıyor.

Bir dot kurarken en sık yapılan hata, görevi çok geniş tanımlamak. "Pazarlamamı yönet" gibi muğlak bir görev, dot'un neyi onaya göndereceğini, neyi kendi başına karar vereceğini belirsiz bırakır ve sonuçta ya çok fazla onay isteği gelir ya da dot beklenmedik bir eylem yapar. Dar kapsamlı, net bir çıktı tanımlayan görevler ("her Pazartesi rakip fiyatlarını kontrol et ve tablo güncelle" gibi) hem daha güvenilir çalışıyor hem de hatada nerede durduğunu bulmak daha kolay.

## OpenAI Dots hangi iş fonksiyonlarında işe yarıyor?

En net kazanç, tekrarlayan ama tam otomasyona uygun olmayan izleme ve raporlama görevlerinde ortaya çıkıyor: rakip fiyat takibi, stok seviyesi izleme, haftalık rapor derleme, müşteri destek taleplerini kategorize edip önceliklendirme. Bunların ortak noktası, insan müdahalesi gerektiren ama sürekli dikkat istemeyen işler olması — tam da bir dot'un "arka planda çalış, gerektiğinde bildir" modeline uyan iş yükü.

Buna karşılık, tek seferlik ve net bir bitiş noktası olan işler (bir sunum hazırlamak, bir kod incelemesi yapmak) için [ChatGPT Work](/tr/posts/chatgpt-work-nedir-openai-is-ajani) hâlâ daha uygun bir araç; bir dot kurmanın ek yapılandırma maliyeti bu tür görevlerde karşılığını vermiyor.

## OpenAI Dots'un güvenlik riski ne, hangi izinler gerekiyor?

Bir dot'a e-posta hesabını, Shopify mağazanı veya ödeme sistemini bağladığında, o dot'un erişimi kadar bir risk yüzeyi de açmış olursun. OpenAI bunu azaltmak için üç katmanlı bir izin modeli kullanıyor: dot hangi uygulamalara bağlanabileceğini kurulumda tanımlar, hangi eylemlerin onay gerektirdiğini sen belirlersin (örneğin "satın alma siparişini gönder" adımı insan onayına kalır) ve dot, kapsamı dışındaki bir eylemi denemeden önce durup senden yetki ister.

Bu model, OpenAI'ın GPT-6 Astra'yı "critical" risk seviyesinde sınıflandırıp temkinli bir şekilde piyasaya sürme stratejisiyle örtüşüyor — Dots'un önce seçili Pro ve Business Premium kullanıcılarına, yaş ve bölge kısıtlamasıyla açılması tesadüf değil. Kurumsal bir ekip bir dot kurarken en az ayrıcalık ilkesini uygulamalı: dot'a yalnızca görevi için gereken uygulamalara erişim ver, geri kalanını kapalı tut. Bir dot'un e-posta hesabına tam erişimi varsa ama sadece fatura takibi yapması gerekiyorsa, erişimi fatura klasörüyle sınırlamak hem güvenlik hem de hata payı açısından daha sağlıklı.

## OpenAI Dots ile birlikte gelen ChatGPT Space nedir?

ChatGPT Space, DevDay'de aynı gün tanıtılan ve ekiplerin hem birbirleriyle hem de dot'larla aynı belge üzerinde çalışabildiği paylaşılan bir çalışma alanı. Önceki "Library" özelliğinin yerini alıyor ve "Pages" adında, yazı, araştırma, grafik ve görsel içerebilen ortak bir belge formatı sunuyor. Space; Pro, Business ve Enterprise kullanıcıları için masaüstünde ve web'de kullanılabiliyor, otomatik toplantı özetleri ve Slack/Microsoft Teams entegrasyonu içeriyor.

OpenAI'ın bu adımı, ChatGPT'yi haftalık 1,2 milyar kullanıcısı olan bir platformdan insanların ve ajanların birlikte çalıştığı bir "paylaşılan yüzeye" dönüştürme hedefinin parçası. Bu, [AI ajanlarını CI/CD'ye güvenle bağlama](/tr/posts/ai-ajanlari-cicd-guvenle-baglamak) yazımızda ele aldığımız iş akışına benzer bir örüntü: ajana geniş erişim verip kritik adımlarda insanı devrede tutmak.

## Bizim yorumumuz: Dots gerçek bir sıçrama mı, yoksa abonelik üst kademesi mi?

Dots'un teknik iddiası gerçek: bir ajanın konuşma kapandıktan sonra da çalışmaya devam etmesi, [ChatGPT Work](/tr/posts/chatgpt-work-nedir-openai-is-ajani) gibi ürünlerin çözemediği bir problemi çözüyor. Ama fiyatlandırma modeline bakınca asıl hedef kitlenin zaten 100 dolarlık Pro planı ödeyen kullanıcılar olduğu açık — bu, kitlesel bir ajan devrimi değil, üst kademe aboneliğe yeni bir gerekçe. Küçük ekipler için bu, ajan araçlarına ayrılan aylık bütçeye eklenmesi gereken yeni bir kalem.

Yakın zamanda ajan tabanlı araçları karşılaştırmak isteyenler [İşi Yapan AI: ChatGPT Work, Cowork, Gemini](/tr/posts/isi-yapan-ai-chatgpt-work-cowork-gemini) yazımıza, hangi görevde agent hangisinde workflow kullanılacağını netleştirmek isteyenler ise [AI Agent mı Workflow mu](/tr/posts/ai-agent-mi-workflow-mu) yazımıza bakabilir.

## Sıkça Sorulan Sorular

### OpenAI Dots ne zaman kullanıma açıldı?

OpenAI, Dots'u 29 Eylül 2026'da DevDay etkinliğinde duyurdu. Özellik, destekli pazarlardaki Pro ve Business Premium hesaplarına kademeli olarak açılıyor; ücretsiz veya Plus planında yer almıyor.

### OpenAI Dots'u kimler kullanabilir?

Pro 100, Pro 200 ve Pro 500 kademelerinde dot kullanımı, Avrupa Ekonomik Alanı, Birleşik Krallık ve İsviçre dışındaki 18 yaş üstü kullanıcılarla sınırlı. Business Premium koltuklarında ise bölgesel bir kısıtlama yok; desteklenen tüm ChatGPT bölgelerinde kullanılabiliyor.

### OpenAI Dots ile ChatGPT Work arasındaki fark ne?

ChatGPT Work, senin başlattığın ve tek oturumda tamamlanan çok adımlı bir görevi yürütür. Dots ise konuşma kapandıktan sonra da çalışmaya devam eden, birden fazla projeyi aynı anda takip edebilen her zaman açık bir ajan sistemidir.

### OpenAI Dots hangi uygulamalara bağlanabilir?

Bir dot, ChatGPT'nin eklenti ekosistemi üzerinden 4.000'den fazla uygulamaya bağlanabilir; e-posta hesaplarını bağlayabilir ve izin verildiğinde yerel yazılımlarla etkileşime girebilir.
