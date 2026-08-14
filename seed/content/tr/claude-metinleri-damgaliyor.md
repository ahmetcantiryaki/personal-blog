---
title: "Claude Artık Her Metni Damgalıyor: Kapatma Yok"
slug: "claude-metinleri-damgaliyor"
translationKey: "claude-invisible-text-watermark"
locale: "tr"
excerpt: "Anthropic, Claude çıktılarına görünmez istatistiksel damga eklemeye başladı; AB uyumu için gelen bu uygulamanın dünya genelinde kapatma seçeneği yok."
category: "ai"
tags: ["claude", "ai-regulation", "llm", "ai-tools"]
publishedAt: "2026-08-14"
seoTitle: "Claude Artık Her Metni Damgalıyor: Kapatma Yok"
seoDescription: "Anthropic, 11 Ağustos 2026'da Claude'un tüm metin çıktılarına görünmez damga eklemeye başladı. Kapatma seçeneği yok, tespit aracı henüz yayınlanmadı."
---

Anthropic, 11 Ağustos 2026'da Claude'un ürettiği her metne görünmez bir istatistiksel damga eklemeye başladığını duyurdu. Uygulama, AB Yapay Zeka Yasası'nın 50(2). maddesindeki şeffaflık kurallarını karşılamak için geldi ama yalnızca AB kullanıcılarını değil, dünya genelindeki tüm Claude çıktılarını kapsıyor. Kapatma seçeneği yok, hiçbir API parametresi ya da ayar bu damgayı devre dışı bırakmıyor.

Bu, [AB Yapay Zeka Yasası'nın genel uygulanmasını ele aldığımız yazıdan](/tr/posts/ab-yapay-zeka-yasasi-devrede-ne-degisiyor) farklı bir konu; burada tek bir şirketin tek bir ürün davranışını, Claude'un çıktı damgalama mekanizmasını inceliyoruz.

## Damga Aslında Ne, Ne Değil

Öncelikle yanlış anlaşılan bir noktayı netleştirmek gerekiyor: bu damga, metnin içine gizlenmiş görünmez Unicode karakterleri veya dosyaya eklenen bir meta veri değil. Anthropic'in kullandığı yöntem istatistiksel bir su işareti. Model, bir sonraki kelimeyi seçerken gizli bir anahtara göre ince bir şekilde yönlendiriliyor; tek bir cümlede bu fark neredeyse görünmez ama yeterince uzun bir metinde, kelime seçimlerinin toplamı tespit edilebilir bir istatistiksel imza oluşturuyor.

Bu yaklaşım, Google DeepMind'ın Nature'da 2024'te yayınlanan SynthID-Text çalışmasına kavramsal olarak benziyor; SynthID-Text, "turnuva örneklemesi" (tournament sampling) adı verilen daha gelişmiş bir yöntem kullanıyor. Anthropic'in mekanizması birebir aynı değil ama temel mantık ortak: metnin kendisi değişmiyor, sadece kelime seçimlerinin istatistiksel dağılımı değişiyor.

## Nerede Geçerli, Nereden İtibaren

Damga, 2 Ağustos 2026 veya sonrasında piyasaya çıkan her Claude modelinde ilk günden itibaren aktif. Anthropic, daha eski modelleri de sonradan bu sisteme dahil etmek için çalıştığını belirtiyor. Kapsam sadece claude.ai ile sınırlı değil; Claude Platform API'si, Claude Code, Claude Cowork, Claude Tag ve Claude'un AWS Bedrock, Google Cloud Vertex ile Microsoft Foundry üzerinden erişilen sürümleri de dahil.

| Yüzey | Damga Durumu |
| --- | --- |
| claude.ai | Aktif (2 Ağustos 2026 sonrası modeller) |
| Claude Platform API | Aktif |
| Claude Code | Aktif |
| Claude Cowork | Aktif |
| Claude Tag | Aktif |
| AWS Bedrock, Google Cloud Vertex, Microsoft Foundry üzerinden Claude | Aktif |
| Ağustos 2026 öncesi eski modeller | Anthropic tarafından geriye dönük ekleniyor |
| Görsel gibi dosya çıktıları | Desteklenen yerlerde imzalı C2PA köken manifestiyle ek doğrulama |

## Kapatma Düğmesi Yok

Hiçbir yüzeyde, hiçbir bölgede, damgasız çıktı isteme seçeneği bulunmuyor. Ne API tarafında bir parametre ne de claude.ai veya Claude Code ayarlarında bir anahtar var. Bu, Anthropic'in konuyu bir "kullanıcı tercihi" değil, ürünün varsayılan ve zorunlu bir parçası olarak ele aldığını gösteriyor.

## Damga Neyi Kanıtlıyor, Neyi Kanıtlamıyor

Burada işin can alıcı noktasına geliyoruz. Damga, "bu metin Claude tarafından işlendi" iddiasını desteklemek için tasarlandı; "bu metni baştan sona yapay zeka yazdı" iddiasını kanıtlamak için değil. Sistem, Claude'un sıfırdan ürettiği bir metinle Claude'un hafifçe düzenlediği insan yazısı arasında güvenilir bir ayrım yapamıyor.

| Damga Ne Kanıtlar | Damga Ne Kanıtlamaz |
| --- | --- |
| Metin, damgalı bir Claude modelinden geçmiş | Metnin tamamen yapay zeka tarafından yazıldığı |
| Değiştirilmeden kopyalanan çıktıda sinyal büyük ölçüde korunur | Ağır parafraz, çeviri veya yeniden biçimlendirme sonrası sinyalin hâlâ okunabilir olduğu |
| Ham, düzenlenmemiş metinlerde tespit nispeten güvenilir | Kodun küçültülmesi (minification) veya başka bir modelden geçirilmesi sonrası sinyalin ayakta kaldığı |
| Kurumsal içerik politikası için bir referans noktası | Adli (forensic) düzeyde, mahkemede geçerli bir kanıt |

İstatistiksel sinyal kelime seçimine yayıldığı için, metin üzerinde ağır parafraz, çeviri, kod yeniden biçimlendirme/küçültme ya da başka bir dil modelinden geçirme gibi gerçek geliştirici ve editoryal iş akışları sinyali zayıflatıyor veya tamamen yok ediyor. Yani damga, değiştirilmemiş bir kopyala-yapıştırda büyük ölçüde hayatta kalıyor ama pratikte kırılgan; adli anlamda bir garanti değil.

## "Dört Sent" Sorunu: Uyumluluk mu, Gösteri mi

Ağustos 2026 ortası itibarıyla Anthropic, AB'nin Code of Practice belgesinin imzacılardan beklediği şeyi, üçüncü taraflara açık bir tespit desteğini henüz sunmuş değil: ortada ne kamuya açık bir tespit API'si ne de bir web aracı var. Şirket, teknik detayları ileride paylaşacağını söyledi.

Asıl dikkat çekici gelişme ise başka bir yerden geldi. "Four Cents" (Dört Sent) olarak anılan bir vaka, damganın kamuya açık bir doğrulama/tespit mekanizması kullanılarak geçiş başına yaklaşık 0,04 dolara kaldırılabildiğini gösterdi. Buradaki sorun şu: metnin damgalı olup olmadığını kontrol etmeni sağlayan aynı mekanizma, damgayı yinelemeli olarak ucuza silmek için de kötüye kullanılabiliyor, yani bir "kaçış oracle'ı" gibi işliyor.

Burada net bir görüş belirtmek gerekirse: kamuya açık bir tespit aracı olmadan, ama tespit mekanizmasının kendisi damgayı silmek için istismar edilebilir haldeyken, bugünkü hâliyle bu sistem güçlü bir kötüye kullanım engelinden çok bir uyumluluk kutucuğu gibi duruyor. AB'nin şeffaflık hedefi haklı bir gerekçeye dayanıyor ama uygulamanın bu ilk hâli, hedeflenen güvenceyi henüz sağlamıyor.

## Claude Code ve Geliştiriciler İçin Ne Anlama Geliyor

Claude Code, Claude Cowork veya API üzerinden üretim koduna, dokümantasyona ya da içerik hattına Claude çıktısı sokan ekipler için pratik sonuç şu: bu damgayı, "bu kodu/metni kim yazdı" sorusunun kesin cevabı olarak kullanmamak gerekiyor. Damga, ham ve değiştirilmemiş çıktıyı yakalamakta işe yarayabilir ama kod biçimlendirme, refactor veya ikinci bir model geçişi sonrası güvenilirliği düşüyor.

Bu, [Claude Skill ve eklenti güvenlik taramasını](/tr/posts/claude-skill-plugin-guvenlik-taramasi) ele aldığımız yazıda değindiğimiz sorunla aynı aileden: otomatik güvence mekanizmalarının sınırlarını bilmeden onlara güvenmek, yanlış bir güven duygusu yaratıyor. Benzer şekilde, [AI çöpü ve açık kaynak güvenliği yazımızda](/tr/posts/ai-copu-acik-kaynak-guvenligi) tartıştığımız gibi, üretim içeriğinin kaynağını doğrulamak için tek bir otomatik sinyale güvenmek yerine katmanlı kontrol süreçleri kurmak daha sağlıklı.

Ekiplerin bugün yapabileceği, damgayı tek başına bir kanıt değil, elindeki birçok sinyalden biri olarak görmek:

```text
Claude çıktısını değerlendirirken kontrol listesi:
- Metin/kod değiştirilmeden mi kullanılıyor, yoksa ağır düzenlemeden mi geçti?
- Kurumsal politika "AI kullanıldı" bilgisini damgadan bağımsız olarak da kayıt altına alıyor mu?
- Damga tespiti, tek karar mekanizması olarak değil, ek bir sinyal olarak mı kullanılıyor?
- Anthropic'in ileride yayınlayacağı resmi tespit aracı takip ediliyor mu?
```

Claude'un model ailesindeki gelişmeleri yakından takip eden ekipler için [Claude Opus 5'in çıkışını](/tr/posts/claude-opus-5-geldi) ve [Claude Sonnet 5 fiyatlandırmasının kalıcı hale gelişini](/tr/posts/claude-sonnet-5-fiyati-kalici-oldu) ele aldığımız yazılar da bu damgalama değişikliğinin hangi model ailesini kapsadığını anlamak için faydalı bir arka plan sunuyor. Yapay zeka regülasyonu ve ürün değişiklikleri üzerine daha fazla içerik için [yapay zeka kategorimize](/tr/category/yapay-zeka) göz atabilirsin.

## Sıkça Sorulan Sorular

### Claude'un yeni damgası görünmez Unicode karakter mi kullanıyor?

Hayır. Bu, metne eklenen gizli karakterler veya meta veri değil; modelin kelime seçimlerini gizli bir anahtara göre ince şekilde yönlendirdiği istatistiksel bir su işareti. Sinyal, yeterince uzun metinlerde kelime dağılımından tespit ediliyor.

### Damgayı kapatmanın bir yolu var mı?

Hayır. Ne API'de bir parametre ne de claude.ai veya Claude Code ayarlarında bir seçenek var. Ağustos 2026 itibarıyla hiçbir yüzeyde, hiçbir bölgede opt-out imkanı bulunmuyor.

### Damga, bir metnin baştan sona yapay zeka tarafından yazıldığını kanıtlar mı?

Hayır, kanıtlamaz. Damga sadece metnin Claude'dan geçtiğini gösterir; Claude'un sıfırdan yazdığı bir metinle hafifçe düzenlediği insan yazısı arasında güvenilir bir ayrım yapamaz. Ayrıca ağır parafraz, çeviri veya yeniden biçimlendirme sinyali zayıflatabilir ya da yok edebilir.

### Anthropic'in kamuya açık bir tespit aracı var mı?

Ağustos 2026 ortası itibarıyla hayır. AB'nin Code of Practice belgesi imzacılardan üçüncü taraf tespit desteği bekliyor ama Anthropic bu aracı henüz yayınlamadı; teknik detayları ileride paylaşacağını duyurdu.
