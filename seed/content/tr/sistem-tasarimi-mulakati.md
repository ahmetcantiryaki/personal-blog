---
title: "Sistem Tasarımı Mülakatı: Başlangıç Rehberi"
slug: "sistem-tasarimi-mulakati"
translationKey: "system-design-interview"
locale: "tr"
excerpt: "2026 için sistem tasarımı mülakatı rehberi: tekrarlanabilir bir çerçeve, kapasite hesabı, temel yapı taşları, yeni AI-altyapı turu ve adayları eleyen hatalar."
category: "software-engineering"
tags: ["system-design", "interview", "software-architecture", "career"]
publishedAt: "2026-07-05"
seoTitle: "Sistem Tasarımı Mülakatı: Başlangıç Rehberi (2026)"
seoDescription: "2026 için sistem tasarımı mülakatı rehberi: tekrarlanabilir bir çerçeve, kapasite hesabı, temel yapı taşları, AI/RAG turları ve adayları eleyen hatalar."
---

Sistem tasarımı mülakatı, 45 dakikalık her tasarım turuna bir planla girmenizi sağlayan tekrarlanabilir bir çerçeve ister: gereksinimleri netleştir, yükü kaba hesapla boyutlandır, üst düzey mimariyi çiz, sonra tek bir bileşende derinleş ve trade-off'ları tartış. Mimarileri ezberlemenize gerek yok. Prompt belirsizken ve tahta boşken sizi hareket halinde tutan bir sürece ihtiyacınız var.

Çoğu yeni başlayan bu turu bilgi eksikliğinden değil, yapı eksikliğinden kaybeder. "Bir URL kısaltıcı tasarla" der demez kutu çizmeye başlarlar. Bu rehber güçlü adayların izlediği net sırayı verir; 2026'da değişen tek şey de şu: görüşmeciler artık yalnızca ölçek değil, AI altyapısı ve maliyet üzerine akıl yürütmenizi bekliyor.

## Sistem tasarımı mülakatı nedir?

Sistem tasarımı mülakatı, "Twitter'ın zaman akışını tasarla" gibi gevşek bir promptan büyük ölçekli bir sistemi kurguladığınız açık uçlu bir turdur. Tek bir doğru cevap yoktur. Görüşmeci; gereksinimleri nasıl topladığınızı, trade-off'ları nasıl değerlendirdiğinizi, ölçeği nasıl tahmin ettiğinizi ve seçimlerinizi yüksek sesle nasıl savunduğunuzu puanlar. Ezber bilgiden çok muhakeme ve iletişimi ölçer.

Kodlama turundan farklı olarak geçilecek bir test paketi yoktur. İki aday tamamen farklı mimariler önerip ikisi de yüksek puan alabilir. Önemli olan, tasarımınızın belirlediğiniz gereksinimlere uyup uymadığı ve doğrudan çağrı yerine neden kuyruk, Postgres yerine neden NoSQL seçtiğinizi açıklayabilmenizdir.

2026'ya özgü bir ayrıntı: AI destekli kopya çekmedeki belgelenmiş artış sonrası [Google ve diğerleri turları yeniden yüz yüzeye taşıdı](https://www.cnbc.com/2025/03/09/google-ai-interview-coder-cheat.html). Formatın kendisi değişmedi — hâlâ 45 dakikalık işbirlikçi bir sohbet — ama artık daha sık, fiziksel bir tahtada ve size itiraz eden bir "junior mühendis" rolüyle yapıyorsunuz.

## Sistem tasarımı mülakatına nasıl yaklaşılır?

Her sistem tasarımı mülakatının en büyük hatası, problemi anlamadan çizime dalmaktır. Güçlü adaylar ilk 5 dakikayı çizerek değil soru sorarak geçirir. Şu sırayı izleyin, boş bir tahta karşısında asla donmazsınız.

1. **Fonksiyonel gereksinimleri netleştirin.** Sistemin ne *yapması* gerektiğini sorun. URL kısaltıcı için: linki kısalt, yönlendir, tıklamayı say. 3-4 temel özelliği tahtaya yazın ve başka bir şeye geçmeden kapsamı teyit edin.
2. **Fonksiyonel olmayan gereksinimleri belirleyin.** Ölçek, gecikme, erişilebilirlik ve tutarlılığı netleştirin. Sistem okuma ağırlıklı mı yazma ağırlıklı mı? Ne kadar kesinti kabul edilebilir? Bu yanıtlar sonraki her kararı yönlendirir.
3. **Kaba hesap yapın.** Günlük aktif kullanıcı, saniyedeki istek ve depolama büyümesini tahmin edin. Yaklaşık sayılar yeterli; amaç bileşenleri hisle değil veriyle gerekçelendirmek.
4. **API'yi tanımlayın.** Ana uç noktaları veya metot imzalarını taslak olarak çıkarın. Bu, arayüzü somutlaştırır ve gereksinimlerdeki boşlukları erkenden açığa çıkarır.
5. **Üst düzey mimariyi çizin.** İstemci, yük dengeleyici, uygulama sunucuları, veritabanı, önbellek. Önce sade tutun; derinliği talep geldikçe ekleyeceksiniz.
6. **Veri modelini tasarlayın.** Temel tablo veya dokümanları, anahtarları ve nasıl bölümleyeceğinizi belirleyin. Okuma/yazma ağırlığı burada işe yarar.
7. **Tek bir bileşende derinleşin.** Görüşmeci bir parça seçer veya seçimi size bırakır. O alan için veri modelini, algoritmaları ve trade-off'ları ayrıntılı tartışın.
8. **Darboğazları bulun ve giderin.** Tek nokta hatalarını, sıcak bölümleri (hot partition) ve önbellek geçersizleştirmeyi dile getirin. Yük arttığında nasıl ölçekleyeceğinizi, çoğaltacağınızı veya shard'layacağınızı gösterin.

5. adıma acele etmeyin. Zamanınızın gerçek anlamda üçte birini 1-3 adımlarına ayırın. Görüşmeciler tutarlı biçimde şunu söyler: önce netleştiren adaylar geçirdikleri adaylardır. Veri modeliniz sallantıdaysa [veritabanı indeksleme yazımız](/tr/posts/veritabani-indeksleme) ve [mikroservis mi monolit mi karşılaştırması](/tr/posts/mikroservis-mi-monolit-mi) bu adımın size dayattığı kararları ele alır.

## Hangi çerçeveyi kullanmalısınız?

Baskı altında ipi asla kaybetmemek için hafif bir çerçeve kullanın. Aşağıdaki çerçeve her aşamayı 45 dakikalık bir tur için bir zaman bütçesine bağlar. Kısaltmanın kendisi, otomatiğe bağlayabileceğiniz *bir* sıraya sahip olmaktan daha az önemlidir.

| Aşama | Ne yaparsınız | Zaman bütçesi | Çıktı |
|-------|---------------|---------------|-------|
| Gereksinim | Fonksiyonel + fonksiyonel olmayan kapsam | ~7 dk | Anlaşılmış özellik listesi + SLA'lar |
| Tahmin | Trafik, depolama, maliyet hesabı | ~5 dk | QPS ve depolama sayıları |
| Üst düzey tasarım | Kutular, oklar, ana veri akışı | ~10 dk | Mimari diyagram |
| Veri + API | Şema, anahtarlar, uç noktalar | ~8 dk | Somut arayüz |
| Derin dalış | Bir bileşen ayrıntılı olarak | ~10 dk | Trade-off tartışması |
| Kapanış | Darboğazlar, ölçekleme, hatalar | ~5 dk | Dayanıklılık anlatısı |

Çerçeveyi başta yüksek sesle duyurun ("Önce gereksinimleri netleştireceğim, ölçeği tahmin edeceğim, tasarımı çizeceğim, sonra derinleşeceğim"). Bu, hemen bir yapı sinyali verir ve tek bir kutu çizmeden size iyi niyet kazandırır.

## Kapasite hesabı nasıl yapılır?

Kapasite hesabı, havada kalan varsayımları mühendisliğe dönüştürür. Kesinliğe değil, seçimlerinizi gerekçelendiren büyüklük mertebesi sayılarına ihtiyacınız var. Kullanıcıdan başlayın, saniyedeki isteği türetin, sonra depolamayı hesaplayın. Cömertçe yuvarlayın ve varsayımlarınızı yüksek sesle söyleyin ki görüşmeci düzeltebilsin. Klasik [gecikme sayıları kopya kâğıdını](https://gist.github.com/jboner/2841832) kafanızda tutun; gerçek bir tahmini tahminden ayıran şey budur.

İşte ayda 100M yeni link üreten bir URL kısaltıcı için işlenmiş zihinsel model:

```text
Yazma:     100M / ay
           100M / (30 * 86400sn) ≈ 40 yazma/sn
Okuma:     100:1 okuma/yazma oranı varsay
           40 * 100 = 4.000 okuma/sn  → önbellek dostu, okuma ağırlıklı
Depolama:  100M link/ay * 500 bayt ≈ 50 GB/ay
           5 yıl ≈ 3 TB  → tek düğüm mümkün, ama shard planla
```

O 100:1 okuma/yazma oranı, tasarımın okuma ağırlıklı olduğunu anında söyler; bu da bir önbellek katmanını ve okuma replikalarını gerekçelendirir. Hesabın getirisi budur: mimarinizi tahmin etmek yerine *türetir*. 2026 dokunuşuna dikkat: aynı URL kısaltıcı promptu artık sık sık 1 milyar link, kötüye kullanım tespiti ve bir maliyet hedefiyle geliyor; yani sayıları ezberlemek değil, uzatmaya hazır olmak gerekir.

## Temel yapı taşları nelerdir?

Her tasarım aynı avuç dolusu bileşeni yeniden kullanır. Her birinin size ne kazandırdığını ve maliyetini öğrenirseniz neredeyse her sistemi kurabilirsiniz. Aşağıdaki tablo, hemen her sistem tasarımı mülakatında dayanacağınız sözlüktür.

| Bileşen | Çözdüğü sorun | Maliyet / trade-off |
|---------|----------------|---------------------|
| Yük dengeleyici | Trafiği dağıtır, tek sunucuyu önler | Ek atlama; kendisi de yedeklilik ister |
| Önbellek (Redis) | Okuma gecikmesini ve DB yükünü düşürür | Bayat veri; geçersizleştirme zor |
| CDN | Statik varlıkları kullanıcıya yakın sunar | Maliyet; dinamik içerik için değil |
| Mesaj kuyruğu | Üretici/tüketiciyi ayırır, ani yükü emer | Nihai tutarlılık; daha fazla hareketli parça |
| Çoğaltma (replication) | Okuma ölçekleme ve yük devri | Çoğaltma gecikmesi; yazma yine darboğaz |
| Sharding | Yatay yazma ölçekleme | Shard'lar arası sorgu ve yeniden dengeleme zahmetli |

Birine başvurduğunuzda trade-off'u yüksek sesle söyleyin. "Saniyedeki 4.000 okumayı emmek için önbellek ekleyeceğim, tıklama sayılarının birkaç saniye geride kalabileceğini kabul ederek." Bu tek cümle senior seviye muhakeme gösterir. Doğru API biçimini ve depolama motorunu seçmek için [REST mi GraphQL mi](/tr/posts/rest-mi-graphql-mi) ve [tasarım kalıpları rehberimiz](/tr/posts/yazilim-tasarim-kaliplari) burada karşılaşacağınız komşu kararları ele alır.

## AI sistem tasarımı soruları artık geliyor mu?

Evet — ve bu en büyük değişim. Temmuz 2026 itibarıyla büyük şirketlerdeki sistem tasarımı turlarının yaklaşık yarısı bir ML veya LLM temalı soru içeriyor; 2024'te bu oran onda birdi. Klasik promptlar AI dokunuşu aldı: "bir öneri motoru tasarla" artık işbirlikçi filtreleme *artı* semantik embedding *artı* bir LLM yeniden sıralayıcı demek. Bütün bir prompt sınıfı da yeni: "bilgi tabanımız üzerinde konuşan bir ajan tasarla" aslında bir RAG hattı kurgulamanızı istiyor.

Araştırma laboratuvarı derinliği gerekmez. Bir avuç parça hakkında akıcı konuşmanız yeter: embedding modeli, vektör deposu, bir getirme adımı, prompt şablonu, LLM çağrısı ve çevresindeki önbellek + güvenlik katmanı. Görüşmeciler artık üç ek boyut puanlıyor — AI-farkında tasarım, **maliyet muhakemesi** ve operasyonel olgunluk. Kişisel görüşüm: 2026'da kaybeden adaylar Kafka çizemeyenler değil, bin token'ın kabaca ne tuttuğunu ya da temellendirilmemiş bir cevabın neden bir prod olayı olduğunu söyleyemeyenler. Bu size yabancıysa [RAG sistemi kurma yazımız](/tr/posts/rag-sistemi-nasil-kurulur) bu sözlüğü en hızlı edinme yolu.

## Hangi hatalar adayları eler?

Yeni başlayanlar bu turu tahmin edilebilir şekillerde kaybeder. Şu beşini yaparsanız çoğu şirkette barajı geçersiniz:

- **Netleştirmeden çizmek.** Kapsam belirlemeden kutulara atlamak bir numaralı hatadır. Önce sorun.
- **Sessiz düşünmek.** Görüşmeci diyagramınızı değil muhakemenizi puanlar. Her kararı anlatın.
- **Aşırı mühendislik.** Saniyede 40 yazma yapan bir sistem için Kafka, Kubernetes ve beş mikroservis getirmeyin. Karmaşıklığı ölçekle eşleştirin.
- **Trade-off'ları ve maliyeti yok saymak.** Her seçimin bir bedeli var. Kendi kararınızın olumsuz yanını — ve dolar maliyetini — söylemek, "kusursuz" bir cevaptan daha çok puan getirir.
- **Tahmin yapmamak.** Hesabı atlamak, her bileşeni bir tahmine dönüştürür. Kaba hesabı yapın.

Genel hazırlık yapıyorsanız bunu [30 günlük teknik mülakat hazırlığı planı](/tr/posts/teknik-mulakat-hazirligi) ve [yazılım mühendisliği kütüphanemizin](/tr/category/yazilim-muhendisligi) geri kalanıyla birleştirin. İkisi de bu turun ölçtüğü mimari sezgilerini güçlendirir.

## Sıkça Sorulan Sorular

### Sistem tasarımı mülakatına hazırlanmak ne kadar sürer?

Mid seviye bir rol için, zaten her gün yazılım geliştiriyorsanız 2-4 haftalık odaklı pratik genellikle yeterlidir. Bu süreyi sadece okuyarak değil, tam 45 dakikalık deneme tasarımları yaparak geçirin. Bu rehberdeki çerçeveyi içselleştirmek birkaç seans alır; beş altı prompttan sonra sıra otomatikleşir ve yeni problemlerde donmayı bırakırsınız.

### Junior geliştiriciler sistem tasarımı sorusu alır mı?

Giderek daha çok, evet. Birçok şirket artık junior ve yeni mezun roller için bile önbellek, veritabanı seçimi ve basit ölçekleme gibi temellere odaklı hafif bir sistem tasarımı turu ekliyor. Küresel dağıtık bir sistem tasarlamanız beklenmez, ama tek bir servisi, veri modelini ve bariz bir darboğazı rahatça anlatabilmelisiniz.

### Yeni başlayan olarak AI sistem tasarımı bilmem gerekir mi?

Çoğu backend rolü için çalışan bir zihinsel model yeter: RAG'ın ne olduğunu, neden bir vektör deposu ekleyeceğinizi ve bir LLM çağrısında maliyet ile gecikmenin nereden geldiğini bilin. OpenAI, Anthropic veya Meta AI gibi AI-öncelikli şirketler için ajanik iş akışları ve orkestrasyon üzerine özel bir tur bekleyin. Her iki durumda da 2026'da öne çıkaran şey, maliyeti yüksek sesle akıl yürütmektir.

### Sistem tasarımı mülakatı nasıl puanlanır?

Bir cevap anahtarı yoktur. Görüşmeciler tasarımınızın belirlediğiniz gereksinimleri karşılayıp karşılamadığını, ne kadar net iletişim kurduğunuzu ve trade-off'ları, maliyeti ile darboğazları kendiliğinizden ortaya koyup koymadığınızı değerlendirir. Tam anladığınız ve savunduğunuz basit bir tasarım, açıklayamadığınız karmaşık bir tasarımı yener. Yapı ve muhakeme, saydığınız bileşenlerden ağır basar.
