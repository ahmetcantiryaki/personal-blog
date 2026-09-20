---
title: "AI Asistanını Doğrulama Kontrol Listesi"
slug: "ai-asistanini-dogrulama-kontrol-listesi"
translationKey: "fact-check-ai-assistant-2026"
locale: "tr"
excerpt: "Kısa cevap: Rakam, alıntı, kaynak linki ve API/kod referansı veren her yanıtı birincil kaynaktan kontrol et; AI bu dört alanda hâlâ en sık hata uyduruyor."
category: "ai"
tags: ["claude", "chatgpt", "gemini", "ai-reliability"]
publishedAt: "2026-09-20"
seoTitle: "AI Asistanını Doğrulama Kontrol Listesi (2026)"
seoDescription: "Kısa cevap: Rakam, alıntı, kaynak linki ve kod/API referansı veren her yanıtı birincil kaynaktan doğrulayın; AI bu dört alanda en sık hata uyduruyor."
---

Kısa cevap: Bir AI asistanı size bir rakam, doğrudan alıntı, kaynak linki veya kod/API referansı verdiğinde bunu birincil kaynaktan açıp kontrol edin; 2026'da en gelişmiş modeller bile bu dört kategoride hâlâ düzenli olarak inandırıcı ama yanlış bilgi üretiyor. Aşağıdaki kontrol listesi, bu hataları cevabı kullanmadan önce yakalamanız için.

## Yapay zeka asistanları en çok nerede hata uyduruyor?

Halüsinasyon rastgele dağılmıyor; belirli kategorilerde yoğunlaşıyor. Akademik atıflar bunlardan biri: Lancet'te yayımlanan bir sistematik incelemeye göre uydurma referans içeren makale oranı 2023'te 2.828'de 1 iken 2025'te 458'de 1'e, 2026'nın ilk yedi haftasında ise 277'de 1'e yükseldi — üç yılda oniki kata yakın bir artış. Bu, "AI bana bir makale önerdi" durumunda o makalenin gerçekten var olduğunu varsaymamanız gerektiği anlamına geliyor.

İkinci risk alanı sayısal veriler ve tarihler: bir model size "%23 artış" ya da "2024'te piyasaya çıktı" dediğinde, bu rakam gerçek bir kaynaktan mı geliyor yoksa istatistiksel olarak "makul görünen" bir tahmin mi, ayırt etmek zor. Üçüncüsü doğrudan alıntılar — bir kişiye ya da belgeye atfedilen cümleler modelin kendi ürettiği, gerçekte hiç söylenmemiş metinler olabiliyor. Dördüncüsü kod ve API referansları: var olmayan bir fonksiyon adı, yanlış parametre sırası ya da kaldırılmış bir kütüphane sürümü öneren yanıtlar, [AI kod asistanı kullanırken yapılan yaygın hatalar](/tr/posts/ai-kod-asistani-hatalari) arasında en sık karşılaşılanlardan. Beşinci ve en riskli alan ise tıbbi ve hukuki tavsiye: burada uydurma bir bilgi soyut bir hata olmaktan çıkıp gerçek zarara dönüşebiliyor.

## Doğrulama kontrol listesi nedir?

Bir AI yanıtını kullanmadan önce şu beş adımı uygulayın:

1. **Kaynak isteyin ve açın.** "Bu bilginin kaynağı ne?" diye sorun, verilen linki gerçekten tıklayıp içeriğin iddiayı destekleyip desteklemediğini kontrol edin — link çalışmıyorsa ya da içerik uyuşmuyorsa, bilgiyi kullanmayın.
2. **Aynı soruyu iki farklı araca sorun.** Claude, ChatGPT ve Gemini'nin üçü de aynı yanlış bilgiyi üretme ihtimali düşük; iki araç farklı cevap veriyorsa bu bir uyarı işaretidir.
3. **Modelden belirsizliğini açıkça belirtmesini isteyin.** "Emin değilsen söyle" veya "kaynağın yoksa bunu belirt" gibi bir talimat eklemek, modelin düşük güvenli bir tahmini kesin bir gerçek gibi sunmasını bir miktar azaltıyor.
4. **Rakam ve alıntıları birincil kaynakta arayın.** Verilen bir istatistiği doğrudan orijinal rapor, makale ya da resmî sayfada arayın; ikinci elden bir özet üzerinden doğrulamayın.
5. **Kod ve API referanslarını çalıştırarak test edin.** Önerilen bir fonksiyonun gerçekten var olduğunu, dokümantasyonda göründüğü şekilde çalıştığını, kodu production'a koymadan önce doğrulayın.

## Kaynak istemek gerçekten işe yarıyor mu?

Kısmen. Bir modele kaynak sormak, bazen gerçek bir link yerine gerçekçi görünen ama var olmayan bir URL üretmesine yol açabiliyor — bu da "kaynak uydurma" olarak adlandırılan ayrı bir halüsinasyon türü. Bu yüzden kaynak istemek tek başına yeterli değil; verilen linki gerçekten açıp içeriğin iddiayla eşleştiğini görmeniz gerekiyor. Canlı web araması yapabilen araçlar (ör. arama entegrasyonu açık ChatGPT veya Claude) bu konuda modelin yalnızca eğitim verisine güvendiği duruma göre daha güvenilir, çünkü en azından link gerçek bir sayfaya gidiyor; ama sayfanın içeriğinin iddiayı gerçekten destekleyip desteklemediğini yine siz kontrol etmelisiniz.

## Hangi promptlar halüsinasyonu azaltıyor?

Modelden "sadece bildiğin şeyleri söyle, emin değilsen belirt" gibi açık bir talimat istemek, modelin düşük olasılıklı bir tahmini kesinmiş gibi sunma eğilimini azaltıyor ama sıfıra indirmiyor. Karmaşık, çok adımlı bir soruda modeli adım adım gerekçelendirmeye zorlamak (örneğin "önce hangi kaynaklara bakman gerektiğini listele, sonra cevapla") de uydurma oranını düşürüyor çünkü model kısa yoldan genelleme yapmak yerine ara adımları açıkça ortaya koyuyor. [Prompt mühendisliği tekniklerimizde](/tr/posts/prompt-muhendisligi-teknikleri) bu tür yapılandırılmış istem tekniklerini daha ayrıntılı ele alıyoruz.

## Modeller arasında halüsinasyon oranı nasıl değişiyor?

2026 verileri, modeller arasında ciddi bir fark olduğunu ve zamanla iyileşme olduğunu gösteriyor — ama sıfıra inen bir model yok.

| Model / Ölçüm | 2023 | 2025 | 2026 |
|---|---|---|---|
| ChatGPT halüsinasyon oranı | %55 | %57,7 | %38 |
| Gemini uydurma (fabrication) oranı | %100 | — | %12 |
| Frontier modeller genel aralık | — | — | %3,1–%19,1 |
| Akademik makalelerde uydurma referans oranı | 2.828'de 1 | 458'de 1 | 277'de 1 (ilk 7 hafta) |

Buradaki kritik nokta, %3,1 ile %19,1 arasındaki aralığın görev tipine ve akıl yürütme (reasoning) ayarına göre değiştiği — yani aynı modelin farklı görevlerdeki güvenilirliği de birbirinden çok farklı olabiliyor.

## Bu kontrol listesini ekip alışkanlığına nasıl dönüştürürsünüz?

Bireysel kullanımda doğrulama adımını hatırlamak nispeten kolay, ama bir ekip AI çıktısını rapor, müşteri iletişimi veya kod tabanına yerleştirmeye başladığında bu adım kolayca atlanabiliyor. Pratik bir çözüm, AI'dan gelen her rakam, alıntı veya kaynak iddiasının yanına kısa bir "doğrulandı" notu ve kaynağın linkini eklemeyi, ekip içi bir inceleme (review) adımı hâline getirmek — tıpkı bir kod değişikliğinin merge edilmeden önce gözden geçirilmesi gibi.

Yüksek riskli alanlarda (finansal raporlama, hukuki metin, sağlık içeriği) bu adımı isteğe bağlı bırakmak yerine süreç dokümantasyonuna yazılı bir kural olarak eklemek, tek bir kişinin dikkatsizliğinin tüm ekibi etkilemesini önlüyor. Düşük riskli alanlarda (iç notlar, taslak metinler) ise aynı sıkılıkta bir süreç kurmak gereksiz sürtünme yaratabiliyor — kontrol listesinin sıkılığını, hatanın maliyetine göre ayarlamak daha sürdürülebilir bir yaklaşım.

Son olarak, hangi AI aracını kullanırsanız kullanın, aracın kendi sürüm notlarını ve bilinen sınırlamalarını takip etmek de doğrulama sürecinin bir parçası olmalı; bir modelin belirli bir konuda (ör. güncel olaylar, hızlı değişen fiyatlandırma) sistematik olarak eski veya yanlış bilgi verdiği biliniyorsa, o konudaki yanıtlarına ekstra şüpheyle yaklaşmak makul.

## Sıkça Sorulan Sorular

### AI'nin uydurduğu bir bilgiyi nasıl anlarım?

Kesin bir işaret yok, ama şüphe uyandıran işaretler var: çok spesifik bir rakam veya tarih verilmiş ama kaynak gösterilmemişse, verilen link açılmıyor ya da içerik iddiayla uyuşmuyorsa, ya da aynı soruyu ikinci bir araca sorduğunuzda farklı bir cevap alıyorsanız, bilgiyi birincil kaynaktan doğrulamadan kullanmayın.

### AI'a kaynak sorduğumda verdiği link gerçek mi?

Her zaman değil. Modeller bazen gerçekçi görünen ama var olmayan URL'ler üretebiliyor; bu yüzden verilen linki mutlaka açıp içeriğin gerçekten iddiayı desteklediğini görmeniz gerekiyor, sadece bir link verilmiş olması yeterli doğrulama değil.

### Hangi AI aracı en az halüsinasyon yapıyor?

2026 verilerine göre Gemini'nin uydurma oranı 2023'teki %100'den %12'ye düşerken ChatGPT %38'de; ancak bu oranlar görev tipine ve akıl yürütme ayarına göre değişiyor, dolayısıyla "en güvenilir araç" tek bir cevapla söylenemez — kritik bilgilerde hangi aracı kullanırsanız kullanın doğrulama adımını atlamamak gerekiyor.

### Tıbbi veya hukuki konularda AI'ya güvenebilir miyim?

Genel bilgi almak için evet, ama nihai karar için hayır: tıbbi ve hukuki alanlar, uydurma bir bilginin gerçek zarara dönüşebileceği en riskli kategoriler arasında, bu yüzden bu alanlardaki her AI yanıtını mutlaka bir uzmana veya resmî kaynağa doğrulatmanız gerekiyor.

Üretim sistemlerinde halüsinasyonu sistematik olarak azaltmak isteyen geliştiriciler için [LLM halüsinasyonlarını azaltma rehberimiz](/tr/posts/llm-halusinasyon-azaltma) daha teknik bir bakış sunuyor. Hangi AI aracının günlük kullanım için size uygun olduğunu görmek için [Hangi AI Aboneliği: Claude, ChatGPT, Gemini?](/tr/posts/hangi-ai-aboneligi-claude-chatgpt-gemini) yazımıza bakabilirsiniz. Daha fazla yapay zeka içeriği için [Yapay Zeka kategorimizi](/tr/category/yapay-zeka) ziyaret edin.

Kaynaklar: [Lancet uydurma atıf çalışması (STAT News)](https://www.statnews.com/2026/05/07/lancet-study-finds-steep-rise-fraudulent-citations-academic-papers/) ve [2026 AI halüsinasyon oranı kıyaslaması](https://truestandard.ai/blog/ai-hallucination-rates-2026).
