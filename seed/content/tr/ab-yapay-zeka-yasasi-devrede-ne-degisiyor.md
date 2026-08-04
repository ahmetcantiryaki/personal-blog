---
title: "AB Yapay Zeka Yasası Devrede: Ne Değişiyor?"
slug: "ab-yapay-zeka-yasasi-devrede-ne-degisiyor"
translationKey: "eu-ai-act-enforcement-live-2026"
locale: "tr"
excerpt: "AB AI Office'in GPAI modellerini denetleme ve cezalandırma yetkisi 2 Ağustos 2026'da başladı. Claude, GPT, Gemini kullanan girişimler için pratik rehber."
category: "ai"
tags: ["claude", "openai", "gemini", "ai-regulation"]
publishedAt: "2026-08-04"
seoTitle: "AB Yapay Zeka Yasası Devrede: Ne Değişiyor? (2026)"
seoDescription: "AB AI Office'in GPAI modellerini denetleme ve cezalandırma yetkisi 2 Ağustos 2026'da başladı. Claude, GPT, Gemini kullanan girişimler için pratik rehber."
---

2 Ağustos 2026'da değişen şey yükümlülükler değil, yaptırım gücüydü: Avrupa Komisyonu'nun AI Office'i, [AB Yapay Zeka Yasası'nın 101. maddesi](https://artificialintelligenceact.eu/article/101/) uyarınca genel amaçlı yapay zeka (GPAI) sağlayıcılarını resmen soruşturabilir ve cezalandırabilir hale geldi. Claude, GPT ve Gemini API'si üzerine ürün kuran, özellikle AB'de kullanıcısı olan geliştiriciler ve girişimler için bu haberin ne anlama geldiğini aşağıda açıyoruz.

## Aslında Ne Değişti: Yükümlülük mü, Yetki mi

Burada karıştırılan iki farklı tarih var. GPAI sağlayıcılarının temel yükümlülükleri (teknik dokümantasyon, eğitim verisi özeti, telif hakkı uyumu) zaten 2 Ağustos 2025'ten beri yürürlükteydi. 2 Ağustos 2026'da değişen, Komisyon'un bu yükümlülükleri fiilen denetleyebilmesi. AI Office artık şunları yapabiliyor:

- Bir modelin teknik dokümantasyonunu talep etmek
- Değerlendirme amacıyla modele erişim istemek
- Risk azaltıcı önlemler zorunlu kılmak
- Uç durumlarda modelin AB pazarına erişimini kısıtlamak veya sağlayıcıyı modeli geri çekmeye zorlamak

Cezalar ciddi: toplam küresel yıllık cironun %3'üne veya 15 milyon avroya kadar, hangisi daha yüksekse. Küçük ve orta ölçekli işletmeler ile startuplar için bu formül tersine dönüyor — hangisi daha düşükse o uygulanıyor. Bu, düzenleyicinin bilinçli bir tercihi: büyük sağlayıcılara caydırıcı, küçük oyunculara orantılı olmak.

Yine de panik gerekmiyor. [Avrupa Komisyonu'nun resmi duyurusuna göre](https://digital-strategy.ec.europa.eu/en/news/commission-starts-enforcing-ai-act-rules-and-new-transparency-requirements-2-august) tercih edilen ilk adım resmi ceza değil, "teknik uyum diyalogları" — yani sağlayıcıyla önce informal netleştirme süreci işletiliyor. Yasal dişler artık gerçek, ama bu bir anlık ceza dalgası anlamına gelmiyor.

## "Sistemik Risk" Katmanı: Kimler Bu Kategoride

Yasa, hesaplama gücü 10^25 FLOP'un üzerindeki modelleri "sistemik risk" taşıyan GPAI modelleri olarak ayrı bir kategoriye koyuyor. Bu eşiği aşan modeller için ek yükümlülükler var: model değerlendirmeleri, düşmanca (adversarial) testler, ciddi olay raporlama ve siber güvenlik korumaları.

Bugün itibarıyla bu kategoriye dünya genelinde kabaca 5-15 şirket giriyor — tam olarak sınır ötesi (frontier) laboratuvar seviyesi. Anthropic, OpenAI ve Google DeepMind'ın üçü de bu eşiği aşıyor, yani Claude, GPT ve Gemini'nin frontier sürümleri sistemik risk yükümlülüklerine tabi. [Claude Sonnet 5, GPT-5.6 ve Gemini 3.5 kıyaslamamızda](/tr/posts/claude-sonnet-5-gpt-5-6-gemini-3-5-kiyaslamasi) bu üç modelin güncel durumunu karşılaştırmıştık; şimdi aynı üçlü aynı zamanda AB'nin en ağır denetim katmanında.

Sağlayıcılar bu yükümlülükleri kanıtlamanın bir yolu olarak, 10 Temmuz 2025'te tamamlanan [gönüllü GPAI Uygulama Kuralları'na (Code of Practice)](https://artificialintelligenceact.eu/code-of-practice-overview/) katılabiliyor. Anthropic, OpenAI ve Google'ın üçü de bu çerçeveyle bir şekilde ilişkilendi. GPAI yükümlülüklerinin tam listesini [Avrupa Komisyonu'nun resmi özet sayfasından](https://digital-strategy.ec.europa.eu/en/factpages/general-purpose-ai-obligations-under-ai-act) da inceleyebilirsiniz.

## Asıl Ayrım: Sağlayıcı mı, Dağıtıcı mı

Bu yazının pratik kalbi burası. Yukarıda sayılan ağır GPAI "sağlayıcı" yükümlülükleri — teknik dokümantasyon, eğitim verisi özeti, sistemik risk testleri — Anthropic, OpenAI ve Google'ın kendisine ait. Sadece Claude API'sini çağıran bir startup bu yükümlülüklerin muhatabı değil.

Ama AB'de kullanıcılara yapay zeka destekli bir ürün sunuyorsanız, kendi başınıza taşıdığınız daha hafif ama gerçek bir "dağıtıcı" (deployer) yükümlülüğünüz var. Yasa'nın 50. maddesi, örneğin bir kullanıcının bir chatbotla konuştuğunu açıkça belirtmenizi ve yapay zeka tarafından üretilen içeriği (metin, görsel, ses) buna göre işaretlemenizi zorunlu kılıyor.

| Yükümlülük | Sağlayıcı (Anthropic, OpenAI, Google) | Dağıtıcı (senin ürünün) |
| --- | --- | --- |
| Teknik dokümantasyon (Model Documentation Form) | Zorunlu | Yok |
| Eğitim verisi özeti, telif uyumu | Zorunlu | Yok |
| Sistemik risk testleri (>10^25 FLOP modeller) | Zorunlu (sadece frontier modeller) | Yok |
| Kullanıcıya "bu bir yapay zeka" bildirimi (Madde 50) | Dolaylı (kullanım talimatı sağlar) | Zorunlu |
| Yapay zeka üretimi içeriği işaretleme | Dolaylı | Zorunlu |
| Ceza tavanı | Ciro'nun %3'ü veya 15M€ (yüksek olan) | Ciro'nun %3'ü veya 15M€ (düşük olan, SME için) |

Yani başlık "Claude kullanan startuplar AB Yasası'yla cezalandırılacak" değil; gerçek hikaye şu: model sağlayıcı ağır bir uyum yükü taşıyor, sen ise küçük ama göz ardı edilemeyecek bir bildirim yükümlülüğü taşıyorsun.

## Claude, GPT veya Gemini Üzerine Ürün Kuran Girişimler İçin Kontrol Listesi

AB'de kullanıcısı olan bir ürün işletiyorsanız, kontrol etmeniz gerekenler:

1. Kullanıcı arayüzünüzde bir chatbot veya yapay zeka asistanıyla etkileşimde olduklarını açıkça belirtiyor musunuz?
2. Yapay zeka tarafından üretilen metin, görsel veya sesi (deepfake dahil) makine tarafından okunabilir şekilde işaretliyor musunuz?
3. Model sağlayıcınızın (Anthropic, OpenAI, Google) kullanım talimatlarını ve model kartını gözden geçirdiniz mi — bu, kendi dağıtıcı yükümlülüklerinizi anlamanızın en hızlı yolu.
4. Üretim ortamında model çıktılarını denetleyen bir guardrail katmanınız var mı? [Üretim için LLM guardrail kontrol listemiz](/tr/posts/uretim-icin-llm-guardrail-kontrol-listesi) bu konuda pratik bir başlangıç noktası.
5. Kullanıcı verisi ve model seçimi hakkında gizlilik politikanız güncel mi?

Basit bir bildirim örneği şöyle görünebilir:

```text
Bu sohbeti bir yapay zeka asistanı yönetmektedir.
Yanıtlar Claude (Anthropic) tarafından üretilmektedir ve hata içerebilir.
İnsan bir temsilciyle görüşmek için "temsilci" yazabilirsiniz.
```

Bu tür bir bildirim, Madde 50'nin ruhuna uygun asgari bir adım; hukuki tavsiye yerine geçmez, ama geliştirici perspektifinden nereden başlayacağınızı gösteriyor.

## ABD ile AB: İki Farklı Yaklaşım

İlginç bir zamanlama var: AB'nin bağlayıcı yaptırım gücü devreye girdiği hafta, 3 Ağustos 2026'da Beyaz Saray'da OpenAI, Anthropic ve Google'ın davet edildiği bir toplantı yapıldı — konu gönüllü bir ABD yapay zeka güvenlik test çerçevesi. Kontrast net: AB tarafında bağlayıcı yasa ve gerçek para cezaları var, ABD tarafında ise henüz gönüllü bir çerçeve öneriliyor.

Bu, aynı şirketlerin (Anthropic, OpenAI, Google) iki farklı kıtada iki farklı uyum rejimiyle uğraştığı anlamına geliyor — biri zorunlu ve cezalı, diğeri gönüllü ve itibar temelli. Yapay zeka güvenliği konusunda oluşan diğer sektörel girişimler için [Open Secure AI Alliance yazımıza](/tr/posts/open-secure-ai-alliance-nedir) da göz atabilirsiniz.

## Değerlendirmemiz

AB'nin sağlayıcı-dağıtıcı ayrımı, aslında düzenleyici tasarım açısından makul bir denge: ağır yükü modeli eğiten ve barındıran şirkete yükleyip, o modeli çağıran binlerce küçük uygulamayı orantısız bir uyum maliyetiyle boğmuyor. Buna rağmen çoğu geliştiricinin "AB AI Yasası beni ilgilendirmiyor, ben sadece API çağırıyorum" diye düşünmesi tehlikeli bir basitleştirme. Madde 50 bildirim yükümlülüğü küçük görünse de, denetim mekanizması artık gerçek ve AB pazarındaki büyüme planlarınız varsa bunu bugünden ürün yol haritanıza yazmanız gerekiyor.

Model seçimini AB uyumluluğu üzerinden değil performans ve maliyet üzerinden yapmaya devam edebilirsiniz — sağlayıcı tarafındaki ağır yük zaten Anthropic, OpenAI ve Google'ın omzunda. Ama kendi ürününüzdeki şeffaflık katmanını atlamak, küçük bir mühendislik işini ilerideki bir uyum krizine çevirmenin en kolay yolu.

Yapay zeka kategorisindeki diğer güncel gelişmeler için [Yapay Zeka bölümümüzü](/tr/category/yapay-zeka) takip edebilirsiniz. AB'de küçük işletmeler için Gemini ve Workspace entegrasyonuna dair pratik bir bakış içinse [küçük işletmeler için Workspace ve Gemini yazımıza](/tr/posts/kucuk-isletme-icin-workspace-gemini) bakabilirsiniz.

## Sıkça Sorulan Sorular

### Claude, GPT veya Gemini API'si kullanan bir startup doğrudan cezalandırılabilir mi?

Ağır GPAI sağlayıcı yükümlülükleri (teknik dokümantasyon, eğitim verisi özeti, sistemik risk testleri) Anthropic, OpenAI ve Google'a ait. Ancak AB'de kullanıcılara ürün sunan her şirket, Madde 50 kapsamında kendi dağıtıcı yükümlülüklerine tabi ve bunları ihlal etmek de yaptırıma yol açabilir.

### 2 Ağustos 2026'dan önce piyasaya sürülen modeller için ne değişiyor?

2 Ağustos 2025'ten önce AB pazarına sürülen GPAI modelleri için 2 Ağustos 2027'ye kadar uyum süresi tanınıyor. Bu tarihten sonra piyasaya sürülen modeller içinse hiçbir geçiş süresi yok, yükümlülükler şu an itibarıyla geçerli.

### "Sistemik risk" eşiği ne anlama geliyor?

10^25 FLOP'un üzerinde toplam hesaplama gücüyle eğitilmiş modeller bu kategoriye giriyor ve ek değerlendirme, düşmanca test ve olay raporlama yükümlülükleri taşıyor. Bugün bu grup dünya genelinde kabaca 5-15 şirketle sınırlı; Claude, GPT ve Gemini'nin frontier sürümleri bu gruba dahil.

### AB AI Office ilk olarak ne yapıyor: doğrudan ceza mı kesiyor?

Hayır. AI Office'in belirttiği tercih edilen ilk adım "teknik uyum diyalogları" — yani resmi yaptırıma gitmeden önce sağlayıcıyla informal netleştirme süreci. Formal soruşturma ve ceza, bu diyalog sonuç vermediğinde devreye giriyor.
