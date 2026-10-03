---
title: "2026'da Tek Kişilik Girişimin AI Ajan Yığınında Ne Var?"
slug: "tek-kisilik-girisim-ai-ajan-yigini"
translationKey: "solo-founder-ai-agent-stack-2026"
locale: "tr"
excerpt: "2026'da işe yarayan tek kişilik girişim AI ajan yığını ayda 300-500 dolara pazarlama, destek, operasyonu yürütür; her ajan tek göreve ve onay kuralına bağlıdır."
category: "business"
tags: ["ai-agents", "automation", "saas", "productivity"]
publishedAt: "2026-10-03"
seoTitle: "Tek Kişilik Girişim İçin AI Ajan Yığını: Araçlar ve Bütçe"
seoDescription: "2026'da tek kişilik girişimler için pratik bir AI ajan yığını: pazarlama, destek ve operasyon otomasyonu ayda 300-500 dolara, her ajan için onay kuralıyla."
---

Kısa cevap: 2026'da işe yarayan bir tek kişilik girişim AI ajan yığını ayda 300-500 dolara dört fonksiyonu kapsar — içerik taslağı hazırlayıp planlayan bir pazarlama ajanı, destek taleplerini triyaj eden bir destek ajanı, kodu inceleyip yayınlayan bir CI/CD ajanı ve işlemleri kategorize eden bir finans ajanı. Her biri tek bir dar göreve kilitlenir ve geri alınamaz her eylemde insan onayı bekler.

## Tek kişilik girişimin şimdi bir ajan yığınına neden ihtiyacı var?

Tek kişi tarafından kurulan şirketler, 2025'in ilk yarısı itibarıyla yeni girişimlerin %36,3'ünü oluşturdu; bu oran 2019'da %23,7'ydi. Stripe Atlas'ta ise bu rakam 2026'nın ikinci çeyreğinde yeni kurulan C corp'ların %63'üne çıktı. Bu kaymanın nedeni net: yazılım çalıştırmanın maliyeti düştü. Tam bir solopreneur teknoloji yığını — kodlama araçları, hosting, API kredisi — artık yılda 3.000-12.000 dolara geliyor; bu, üç yıl öncesine kıyasla eşdeğer bir kadroyu işe almaya göre %95-98 düşüş demek.

Bu yazı özellikle ajan katmanına ve onay kurallarına odaklanıyor; tek kişilik bir işin tamamındaki araçların, fiyatların ve iş akışının geniş resmi için [solopreneur AI yığını](/tr/posts/tek-kisilik-girisim-ai-yigini) yazımıza bakabilirsin.

Tavan da gerçek: AI kodlama ajanları kullanan tek kişilik kurucular, hiç çalışan olmadan aylık 10.000-100.000 dolar yinelenen gelire ulaştıklarını bildiriyor; bazı AI etiketli mikro-SaaS ürünleri %60'ın üzerinde brüt kâr marjıyla çalışıyor. Bir ajan yığını, tek kişilik bir şirket için "olsa iyi olur" düzeyinde bir verimlilik aracı değil — kadro matematiğinin tutmasının tek yolu.

## Yığındaki her fonksiyon gerçekte neye benzemeli?

Her fonksiyona genel amaçlı bir asistan değil, tek bir dar ve net sonuçlu göreve atanmış bir ajan gerekir. "Pazarlamamı yönet" tahmin edilemez sonuçlar üretir; "bu haftanın değişiklik kaydından üç LinkedIn gönderisi taslağı çıkar ve incelemeye kuyruğa al" her seferinde kullanılabilir bir taslak üretir.

| Fonksiyon | Ajanın yaptığı | Tipik aylık maliyet | İnsan hangi adımda devrede |
|---|---|---|---|
| Pazarlama | Gönderi taslağı hazırlar, planlar, etkileşimi raporlar | 50-100 $ | Yayınlama, reklam bütçesi |
| Destek | Talepleri triyaj eder, yanıt taslağı hazırlar, istisnaları yükseltir | 50-150 $ | İade, hesap değişiklikleri |
| CI/CD | PR'ları inceler, testleri çalıştırır, staging'e dağıtır | 50-100 $ | Production dağıtımları |
| Finans/operasyon | İşlemleri kategorize eder, anomalileri işaretler | 30-80 $ | Ödemeler, resmi beyanlar |

Üzerine genel amaçlı bir kodlama ajanı aboneliği eklendiğinde yığının tamamı ayda 300-500 dolara oturuyor — yıllıklandırıldığında 3.000-12.000 dolarlık solopreneur yığını rakamının işaret ettiği aralıkla aynı bantta.

## Her ajan için onay kuralları nasıl tasarlanır?

Bir ajanı serbest bırakmadan önce, hangi eylemlerinin senin onayını gerektirdiğini ve hangilerinin gerektirmediğini yazılı hale getir — kurumsal ajan ürünlerinin geldiği aynı üç katmanlı model: ajanın erişebileceği kapsamı tanımla, onay gerektiren eylemleri tanımla, kapsam dışına çıktığında ajanın durup sorması gerektiğini belirle.

```text
Ajan: destek-triyaj
Kapsam: Zendesk okuma/yazma, yanıt taslağı, talep etiketleme
Otomatik onaylı: kategorizasyon, hazır yanıt taslakları, dahili etiketleme
Onay gerektirir: 20 dolar üstü iadeler, hesap silme, işaretli VIP hesaplara her yanıt
Yükseltme: kapsam dışı her şey durur ve Slack üzerinden kurucuya bildirim gönderir
```

Bu kadar net bir kural iki şeyi birden sağlar: bir şey ters gittiğinde tam olarak nereye bakman gerektiğini gösterir; ayrıca ajanın gerek olmayan şeyler için onay istemesini önler — bu da insanların kendi otomasyonlarına güvenmeyi bırakmasına yol açan asıl arıza modudur. [Ajanları özellikle CI/CD'ye bağlarken](/tr/posts/ai-ajanlari-cicd-guvenle-baglamak) aynı ilke dağıtım kapılarında da, iade limitinde de geçerli.

## Tek kişilik kurucu insanı hangi noktalarda devrede tutmalı?

Bir hatanın geri alınması maliyetli olduğu veya başka birinin parasına/verisine dokunduğu her yerde: ödemeler, belirli bir eşiğin üstündeki iadeler, hukuki/uyumluluk metinleri ve basına veya VIP müşteriye gönderilen her şey. Bir hatanın geri alınması ucuz olduğu her yerde — taslak sosyal medya gönderisi, ilk aşama destek yanıtı, staging dağıtımı — ajan insan onayı beklemeden ilerleyebilir.

Bu, [başka işletmelere AI otomasyon hizmeti satmanın](/tr/posts/isletmelere-ai-otomasyon-hizmeti-satmak) diğer yönden çarptığı aynı duvar: başka birinin operasyonu için ajan kuran bir acente, bu kapsam-ve-onay kararını sadece kodda değil, sözleşmede de açıkça yazmak zorunda.

## Tek kişilik şirketi aşırı otomatikleştirmenin riski ne?

Asıl risk, kapsam kaymasından daha sinsi: kurucular devrettikleri kategorileri kontrol etmeyi bırakıyor, böylece bir ajanın küçük ve tekrarlayan hatası — biraz yanlış destek tonu, bir finans kategorizasyon hatası — fark edilene kadar haftalarca sessizce birikiyor. Çözüm daha az otomasyon değil; her ajanın sadece yükselttiği durumları değil, otomatik onayladığı eylemleri de kapsayan haftalık bir düzenli inceleme.

İkinci risk yoğunlaşma: tüm operasyonu tek bir AI sağlayıcısının API'si üzerine kurmak, o sağlayıcı fiyatını değiştirirse veya bir modeli yıl ortasında emekliye ayırırsa kurucuyu açıkta bırakır. [Tüm yığını tek bir modele bağlamak](/tr/posts/ai-tedarikci-bagimliligi-tek-model), tek bir fonksiyonu aşırı otomatikleştirmekten daha yaygın bir kurucu hatası — yığını ilk günden itibaren her ajan için en az bir değiştirilebilir katmanla tasarlamakta fayda var.

## Yığındaki her yuva için hangi araçlar kullanılır?

Marka değil fonksiyon önemli, ama somut başlangıç noktaları yardımcı olur: genel amaçlı bir kodlama ajanı (Claude Code veya benzeri bir CLI ajanı), PR'ları inceleyip testleri çalıştırarak ve production dağıtımından önce insan onayı bekleyerek CI/CD yuvasını kapsar; bir LLM API'si üzerine kurulu planlama ve taslak katmanı pazarlamayı kapsar; Intercom'un Fin'i tarzında sonuç başına fiyatlanan bir destek aracı triyajı kapsar; bir fiş/fatura çıkarım aracı ise rutin kategorizasyon için sürekli bir muhasebeci tutmaya gerek kalmadan finans yuvasını kapsar.

Bunların hiçbirinin kategorisinde "en iyi" tek araç olması gerekmiyor — yığının ekonomisi, her slotta en güçlü seçeneği seçmekten değil, her parçanın dar kapsamlı ve bir işe alıma kıyasla ucuz olmasından geliyor. Her ajanın kapsamı uzun bir sohbet geçmişine gömülü değil kısa bir spesifikasyon olarak yazıldığında, daha iyi veya daha ucuz bir seçenek çıktığında bir parçayı değiştirmek de kolaylaşıyor.

## Teknik olmayan bir kurucu bu yığını tek başına çalıştırmayı denemeli mi?

Evet, bir şartla: 300-500 dolarlık aralık, ajanları kendin kurduğun veya sadece birkaç saatlik kurulum yardımı aldığın senaryoyu varsayıyor, sürekli çalışan bir otomasyon danışmanı tutmayı değil. [Kurucular için geliştirilen AI muhasebe araçları](/tr/posts/kurucular-icin-ai-muhasebe-neyi-otomatiklestir) ve kodsuz ajan kurucuları, eskiden tam zamanlı bir mühendis gerektiren teknik boşluğun çoğunu kapattı — ama yukarıdaki onay kuralı tasarımı hâlâ işi anlayan bir insan gerektiriyor; bunun yerini hiçbir ajan tutamaz.

Henüz gelir yokken bu yığını kurmaya değip değmeyeceğini tartan bir kurucu, önce [bir AI girişimini bootstrap etmenin](/tr/posts/ai-girisimi-bootstrap-2026) mantıklı olup olmadığına bakmalı — ajan yığını motor, iş modeli değil.

## Sıkça Sorulan Sorular

### Tek kişilik kurucunun AI ajan yığını ayda ne kadara geliyor?

Ekim 2026 itibarıyla pazarlama, destek, CI/CD ve finans/operasyonu kapsayan işleyen bir yığın ayda 300-500 dolara geliyor; bu rakam genel amaçlı bir kodlama ajanı aboneliğini ve fonksiyon başına otomasyon araçlarını içeriyor. Bu, tam solopreneur teknoloji yığınları için bildirilen yıllık 3.000-12.000 dolarlık aralıkla büyük ölçüde uyumlu.

### 2026'da yeni girişimlerin yüzde kaçı tek kişi tarafından kuruluyor?

Startup veri takipçilerine göre tek kişi tarafından kurulan şirketler, 2025'in ilk yarısı itibarıyla yeni girişimlerin %36,3'üne çıktı; 2019'da bu oran %23,7'ydi. Stripe Atlas'ta ise tek kişilik kurucular, 2026'nın ikinci çeyreğinde kurulan yeni C corp'ların %63'ünü oluşturdu — bu platform için tüm zamanların en yüksek rakamı.

### Hangi görevler ajan yerine insanda kalmalı?

Geri alınması maliyetli her şeyde insanı devrede tut: ödemeler, belirli bir eşiğin üstündeki iadeler, hukuki veya uyumluluk metinleri, VIP müşterilere veya basına verilen yanıtlar. Geri alınması ucuz olan görevler — taslak içerik, ilk aşama destek yanıtı, staging dağıtımı — insan onay kapısı olmadan ajan üzerinden ilerleyebilir.

### Tek kişilik kurucuların AI ajan yığınlarında yaptığı en büyük hata ne?

En yaygın iki hata: bir ajanın otomatik onayladığı eylemlerin haftalarca incelenmeden çalışmasına izin vermek (küçük hataların sessizce birikmesine yol açar) ve her fonksiyonu, fiyatlandırma veya model erişilebilirliği değişirse yedek planı olmadan tek bir AI sağlayıcısının API'si üzerine kurmak.
