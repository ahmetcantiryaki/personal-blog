---
title: "AI Bilgisayarlar: NPU Aslında Ne Yapar?"
slug: "ai-bilgisayarlar-npu-nedir"
translationKey: "ai-pc-npu-explained"
locale: "tr"
excerpt: "40 TOPS'luk bir NPU aslında ne yapıyor, ne yapmıyor? Yerel LLM hızının çoğu zaman NPU'dan değil GPU'nun bellek genişliğinden geldiğini açıklıyoruz."
category: "technology"
tags: ["on-device-ai", "ai-infrastructure", "performance", "hardware"]
publishedAt: "2026-08-03"
seoTitle: "AI Bilgisayar NPU Nedir? Gerçekte Ne İşe Yarar"
seoDescription: "40 TOPS'luk bir NPU aslında ne yapıyor, ne yapmıyor? Yerel LLM hızının çoğu zaman NPU'dan değil GPU'nun bellek genişliğinden geldiğini açıklıyoruz."
---

"AI bilgisayar" etiketi taşıyan bir laptop aldığınızda, içindeki NPU aslında ne yapıyor? Kısa cevap: düşük güçle sürekli çalışan, arka planda transkripsiyon veya gürültü engelleme gibi görevleri yürüten özel bir çip — ama pazarlamanın iddia ettiği "büyük dil modellerini hızlı çalıştıran sihirli parça" değil. Gerçek yerel LLM performansının çoğu, çoğunlukla NPU'dan değil GPU'nun bellek genişliğinden geliyor.

## NPU Nedir, TOPS Ne Anlama Gelir

NPU (Neural Processing Unit), matris çarpımı gibi yapay sinir ağı işlemlerine özel olarak optimize edilmiş bir çip; CPU'dan çok daha düşük güç tüketimiyle bu işlemleri sürekli, arka planda çalıştırabilir. TOPS (Tera Operations Per Second), bir NPU'nun saniyede gerçekleştirebileceği trilyon işlem sayısını ölçer — ama bu sayı tek başına gerçek dünya performansını göstermez, çünkü bellek bant genişliği ve model boyutu en az TOPS kadar belirleyici.

Microsoft'un "Copilot+ PC" kategorisi için belirlediği [donanım eşiği net](https://www.techpowerup.com/320933/microsoft-copilot-to-run-locally-on-ai-pcs-with-at-least-40-tops-of-npu-performance): en az 40 TOPS'luk bir NPU, en az 16 GB RAM, 256 GB SSD ve Windows 11 24H2. Bu eşiğin altında kalan makineler, Copilot+'a özel yerel özelliklere (Recall, Live Captions çevirisi, Cocreator gibi) erişemiyor.

| Gereksinim | Copilot+ PC Eşiği |
| --- | --- |
| NPU performansı | ≥40 TOPS |
| RAM | ≥16 GB |
| Depolama | ≥256 GB SSD |
| İşletim sistemi | Windows 11, sürüm 24H2+ |

## Yerel Model Çalıştırma: NPU mu, GPU mu

[Burada işler pazarlama materyallerinin ima ettiğinden farklı](https://www.digitalapplied.com/blog/ai-pc-npu-copilot-plus-local-ai-2026-buyers-guide). AMD'nin Ryzen AI 300 serisi NPU'ları 50 TOPS'a kadar çıkıyor ve donanım eşiğini geçiyor — ama laptop sınıfındaki gerçek istisna olan Ryzen AI Max+ 395, ağır yerel dil modeli çıkarımını NPU'suyla değil, entegre GPU'suyla (iGPU) yapıyor. Sebep basit: 256-bit LPDDR5X-8000 bellek veri yolundan gelen yaklaşık 256 GB/s bant genişliği, aynı iş yükünde 57 token/saniyeye ulaşmasını sağlıyor — NPU'sunun büyüklüğünden değil, belleğinin genişliğinden.

Bunun pratik anlamı şu: token üretim hızı, ham hesaplama gücünden (TOPS) çok bellek bant genişliğiyle sınırlı. Bir NPU üzerinde 8B parametreli bir model saniyede yaklaşık 5 token üretebiliyor — kullanılabilir ama yavaş. Üstelik Ollama, llama.cpp ve LM Studio gibi popüler yerel çalıştırma araçlarının çoğu, isteği doğrudan NPU'ya değil Vulkan/ROCm/Metal üzerinden iGPU'ya ya da CPU'ya yönlendiriyor — yani "NPU'lu bilgisayar aldım" demek, "yerel LLM'lerim NPU'da çalışıyor" anlamına gelmiyor çoğu zaman.

```text
Token üretim hızı ≈ f(bellek bant genişliği, model boyutu)
Token üretim hızı ≠ f(NPU TOPS derecesi)
```

| Bileşen | Güç Verimliliği | Yerel LLM Performansı | Tipik Kullanım |
| --- | --- | --- | --- |
| NPU | Çok yüksek (düşük watt) | Sınırlı (~5 tok/s, 8B model) | Sürekli arka plan görevleri |
| iGPU (geniş bant, ör. Ryzen AI Max+) | Orta | Güçlü (~57 tok/s) | Talep üzerine yerel çıkarım |
| Ayrık GPU | Düşük (yüksek watt) | En yüksek | Masaüstü, fişe bağlı kullanım |

## Gerçek Kullanım Alanları vs Pazarlama

NPU'nun gerçekten iyi olduğu iş, sürekli çalışan, düşük gecikmeli ve pil dostu görevler: canlı transkripsiyon, arka plan gürültü engelleme, kamera arka planı bulanıklaştırma, basit görüntü düzenleme önerileri. Bunlar, dizüstü bilgisayarınızın pilini tüketmeden sürekli açık kalabilecek işler — ve NPU tam olarak bunun için tasarlandı.

Pazarlamanın abarttığı kısım ise "büyük, karmaşık bir sohbet modelini tamamen çevrimdışı, akıcı şekilde çalıştırma" vaadi. Bu mümkün, ama NPU sayesinde değil; yeterli bellek bant genişliğine sahip bir iGPU veya harici GPU sayesinde — ki bu da fiyat ve güç tüketimi açısından farklı bir cihaz sınıfı demek.

## Apple'ın Neural Engine'i Farklı mı Çalışıyor

Windows/Copilot+ ekosistemi dışında bakıldığında, Apple'ın M serisi çiplerindeki Neural Engine benzer bir felsefeyle çalışıyor: düşük güçle sürekli çalışan görevlerde (Face ID, fotoğraf sınıflandırma, ses tanıma) güçlü, ama tek başına büyük dil modeli çıkarımının ana motoru değil. Apple'ın farkı, birleşik bellek mimarisi (unified memory) sayesinde CPU, GPU ve Neural Engine'in aynı bellek havuzunu paylaşması — bu da Windows tarafındaki NPU/iGPU ayrımına kıyasla daha az sürtünmeli bir geçiş sağlıyor. Ama temel gerçek aynı kalıyor: yerel LLM performansını asıl belirleyen, çipin adı değil bellek mimarisinin genişliği.

## Pil, Gizlilik ve Maliyet Dengeleri

Cihaz üzerinde çalışan bir model, verinizi buluta göndermeden işlediği için gizlilik avantajı sunar — bu, özellikle hassas belgeler veya kişisel notlar üzerinde çalışırken gerçek bir fark yaratır. Bedeli ise iki yönlü: donanım maliyeti (40+ TOPS'luk bir NPU taşıyan laptoplar genelde 200-400 dolar daha pahalı) ve model kalitesi (yerelde çalıştırılabilecek modeller, bulut tabanlı frontier modellerden genelde daha küçük ve daha az yetenekli).

Pil tarafında NPU net bir kazanç sağlıyor: aynı görevi CPU üzerinde sürekli çalıştırmaya kıyasla NPU, önemli ölçüde daha az güç harcıyor — bu da "arka planda sürekli transkript çıkarma" gibi görevlerde pil ömrünü saatlerce uzatabiliyor.

## Kime Gerekli, Kim Beklemeli

AI PC'ye ihtiyacınız varsa şu profillere uyuyorsunuz demektir: sık sık toplantı transkripti çıkaran, seyahat sırasında internetsiz temel AI özelliklerine ihtiyaç duyan veya kurumsal veri politikaları gereği bulut işlemeyi tamamen dışlaması gereken kullanıcılar. Buna karşın, öncelikli ihtiyacınız güçlü, karmaşık akıl yürütme yapabilen bir asistan ise — kod yazma, uzun doküman analizi gibi — bulut tabanlı bir model (Claude, GPT-5.6, Gemini 3.6) hâlâ çok daha yetenekli ve NPU'nun sınırlı yerel kapasitesini beklemeye değmez.

Bu kararı frontier modellerin kapasitesiyle karşılaştırmak isteyenler [Claude Opus 5'in geldiği yazımıza](/tr/posts/claude-opus-5-geldi), farklı yapay zeka asistanlarını yan yana görmek isteyenler [AI sesli asistan kıyaslamamıza](/tr/posts/ai-sesli-asistan-kiyaslamasi-gpt-live-gemini-claude) bakabilir. Kategorideki diğer donanım yazıları için [Teknoloji bölümümüzü](/tr/category/teknoloji) takip edebilirsiniz.

## "AI PC'ye İhtiyacım Var mı?" Kontrol Listesi

- İnternetsiz ortamlarda (uçak, güvenli tesis) düzenli olarak temel AI özelliklerine mi ihtiyaç duyuyorsunuz? → Evet ise AI PC mantıklı.
- Öncelikli kullanım alanınız canlı transkripsiyon, gürültü engelleme veya basit görüntü düzenleme mi? → Evet ise NPU bu işler için zaten yeterli.
- Karmaşık akıl yürütme, uzun kod tabanı analizi veya derin araştırma mı arıyorsunuz? → Evet ise bulut tabanlı bir frontier model hâlâ daha iyi seçim; NPU bu ihtiyacı karşılamaz.
- Bütçeniz kısıtlıysa ve 40+ TOPS'luk NPU primi sizin için anlamsızsa → mevcut laptopunuzu bulut AI araçlarıyla kullanmaya devam edin, bir sonraki yükseltme döngüsünü bekleyin.

## Sıkça Sorulan Sorular

### 40 TOPS'luk bir NPU büyük bir dil modelini akıcı çalıştırabilir mi?

Sınırlı ölçüde. NPU üzerinde 8B parametreli bir model saniyede yaklaşık 5 token üretiyor — kullanılabilir ama yavaş. Daha hızlı yerel çıkarım için genelde geniş bellek bant genişliğine sahip bir iGPU veya ayrık GPU gerekiyor.

### Ryzen AI Max+ 395 yerel modelleri nasıl çalıştırıyor?

NPU'su üzerinden değil, entegre GPU'su (iGPU) ve 256-bit LPDDR5X-8000 bellek yolundan gelen geniş bant genişliği sayesinde. Bu, saniyede 57 token gibi kullanılabilir bir hıza ulaşmasını sağlıyor.

### Ollama veya llama.cpp gibi araçlar NPU'yu kullanıyor mu?

Genellikle hayır. Bu araçların çoğu isteği Vulkan, ROCm veya Metal üzerinden iGPU'ya ya da CPU'ya yönlendiriyor; NPU'yu doğrudan kullanan araç desteği hâlâ sınırlı ve gelişmeye devam ediyor.

### AI PC almalı mıyım yoksa beklemeli miyim?

Sık sık internetsiz ortamda temel AI özelliklerine (transkripsiyon, gürültü engelleme) ihtiyaç duyuyorsanız evet. Öncelikli ihtiyacınız güçlü akıl yürütme veya karmaşık kod analiziyse, bulut tabanlı bir frontier model şu an için daha iyi bir yatırım — NPU bu boşluğu yakın vadede kapatmayacak.
