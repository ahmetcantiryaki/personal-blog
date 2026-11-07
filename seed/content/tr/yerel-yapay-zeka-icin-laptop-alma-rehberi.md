---
title: "Yerel Yapay Zeka İçin Laptop Alırken Ne Önemli?"
slug: "yerel-yapay-zeka-icin-laptop-alma-rehberi"
translationKey: "laptop-for-local-ai-buying-guide-2026"
locale: "tr"
excerpt: "Kısa cevap: Önce bellek kapasitesine bakılır, NPU'nun TOPS rakamı çoğu kullanıcı için önemsizdir. Çoğu kişi için en iyi seçim hâlâ bulut API'leridir."
category: "technology"
tags: ["on-device-ai", "hardware", "ai-tools", "llm"]
publishedAt: "2026-11-07"
seoTitle: "Yerel Yapay Zeka İçin Laptop Alma Rehberi (2026)"
seoDescription: "Kısa cevap: Önce bellek kapasitesine bakılır, sonra CPU ve SSD. NPU TOPS rakamı çoğu kullanıcı için önemsiz; çoğu kişi için bulut API hâlâ daha mantıklı."
---

Kısa cevap: Yerel yapay zeka çalıştıracak bir laptopta ilk bakılacak şey bellek kapasitesi — Apple Silicon'da unified memory, ayrı ekran kartlı laptoplarda VRAM; NPU'nun TOPS rakamı ya da CPU çekirdek sayısı ikinci plandadır. Ama dürüst olmak gerekirse: çoğu insan için en mantıklı seçim hâlâ yerel değil, bulut tabanlı bir API kullanmak.

## Yerel yapay zeka için laptop alırken ilk bakılacak şey ne?

Bir dil modelini çalıştırmanın asıl darboğazı bellek — modelin parametreleri VRAM'e veya unified memory'ye sığmazsa model hiç çalışmaz, ne kadar hızlı bir CPU'nuz olursa olsun. 4-bit niceleme (quantization) kullanıldığında kabaca bir kural geçerli: gereken bellek (GB), modelin parametre sayısının (milyar) yarısı kadar, üzerine bağlam penceresi ve sistem yükü için ek pay. Bu yüzden "kaç TOPS" sorusundan önce "kaç GB bellek" sorusunu sormak gerekiyor.

```text
Kaba kural (Q4 niceleme): Gereken bellek (GB) ≈ Parametre sayısı (milyar) × 0,5 + ek yük
Örnek: 7 milyar parametreli bir model ≈ 6-8 GB
Örnek: 30 milyar parametreli bir model ≈ 16-20 GB (+ bağlam penceresi için ek pay)
```

## 7B ve 30B modeller için ne kadar bellek gerekiyor?

Aşağıdaki tablo, yaygın model büyüklükleri için 4-bit nicelemeyle gereken yaklaşık bellek miktarını gösteriyor:

| Model büyüklüğü | Yaklaşık bellek (Q4) | Tipik laptop uyumu |
|---|---|---|
| 7B | 6-8 GB | Çoğu modern laptop (16 GB RAM/VRAM) |
| 13B | 10-12 GB | 16 GB unified memory, sınırda |
| 30-34B | 16-20 GB | 32 GB unified memory önerilir |
| 70B | 40+ GB | Laptopta pratik değil, masaüstü/sunucu gerekir |

Ayrı ekran kartlı laptopların çoğu 8-16 GB VRAM'e sahip; üst segmentte bile 24 GB'ı geçen model sayısı az, bu da pratikte 32B'nin üzerini laptopta çalıştırmayı zorlaştırıyor. Apple Silicon'un unified memory mimarisi burada avantajlı çünkü sistem RAM'i doğrudan GPU tarafından da kullanılabiliyor — ama bunun karşılığı, dedicated VRAM'e göre daha yavaş çıkarım hızı.

## NPU'nun TOPS rakamı gerçekten önemli mi?

Çoğu kullanıcı için hayır — en azından büyük dil modelleri için. NPU'lar (Windows Copilot+ PC'lerdeki gibi) küçük, özel görevler için optimize edilmiş: arka plan bulanıklaştırma, ses iyileştirme, küçük sınıflandırma modelleri gibi düşük güçle çalışan sürekli görevler. 30-40 TOPS gibi rakamlar pazarlamada öne çıkıyor ama 7B'nin üzerindeki bir dil modelini NPU üzerinde tam hız çalıştırmak için ekosistem (yazılım desteği, model formatı uyumu) hâlâ GPU/unified memory yoluna göre daha az olgun. [AI PC'lerde NPU'nun gerçekte ne yaptığını](/tr/posts/ai-bilgisayarlar-npu-nedir) burada daha ayrıntılı açıklıyoruz.

## Apple Silicon mı, Windows Copilot+ mı, ayrı GPU'lu laptop mu?

Üç yaklaşımın güçlü ve zayıf yanları farklı:

| Yaklaşım | Güçlü yanı | Zayıf yanı |
|---|---|---|
| Apple Silicon (unified memory) | 30B'ye kadar modeli tek makinede çalıştırabilir, sessiz, düşük güç | Dedicated VRAM'e göre daha yavaş çıkarım |
| Windows Copilot+ (NPU) | Küçük görevler için enerji verimli, sürekli arka plan işleri | Büyük LLM'ler için ekosistem/yazılım desteği sınırlı |
| Ayrı GPU'lu laptop (dGPU) | VRAM'e sığan modelde en hızlı çıkarım | VRAM 8-16 GB ile sınırlı, pil ömrü ve ısınma dezavantajı |

## Bütçeye göre alım listesi nedir?

Satın almadan önce kendi öncelikli kullanım senaryonuzu yazılı olarak tanımlamak, mağazada "daha fazla bellek her zaman iyidir" mantığıyla aşırı harcama yapmanızı önlüyor. Giriş seviyesi (7B-13B modeller için): 16 GB unified memory veya 16 GB VRAM'li bir dGPU yeterli. Orta seviye (30B'ye kadar): 32 GB unified memory (Apple Silicon) veya 24 GB VRAM'li bir dGPU laptop arayın. Üst seviye: 64-128 GB unified memory'li bir Mac, 30-34B modelleri rahatça, hatta bazı 70B nicelenmiş varyantları sıkışık şekilde çalıştırabilir — ama bu segmentte fiyat/performans oranı hızla bozuluyor. SSD tarafında model dosyaları 4-40 GB arasında değişebildiği için en az 512 GB, tercihen 1 TB depolama önerilir.

## Niceleme (quantization) seçimi belleği nasıl değiştirir?

Niceleme, bir modelin ağırlıklarını daha az bit ile temsil ederek bellek ihtiyacını küçültüyor; Q4 (4-bit) 2026'da en yaygın kullanılan denge noktası çünkü kalite kaybı küçük, bellek tasarrufu büyük. Q8 (8-bit) daha az kalite kaybı verir ama Q4'e göre yaklaşık iki kat bellek gerektirir; Q2 gibi daha agresif nicelemeler belleği daha da düşürür ama çıkarım kalitesinde fark edilir bozulmaya yol açabiliyor. Bağlam penceresi (context window) de unutulmaması gereken bir kalem: uzun bir sohbet geçmişi veya büyük bir belge yüklediğinizde, bu bağlamın kendisi de ayrı bir bellek payı tutuyor — bu yüzden "model sığıyor" ile "model + uzun bağlam sığıyor" farklı hesaplar.

| Niceleme | Bellek (7B model için) | Kalite etkisi |
|---|---|---|
| Q8 (8-bit) | ~12-14 GB | Neredeyse kalite kaybı yok |
| Q4 (4-bit) | ~6-8 GB | Küçük kalite kaybı, en yaygın denge |
| Q2 (2-bit) | ~3-4 GB | Fark edilir kalite kaybı riski |

## Gerçekten yerel çalıştırmalı mısın?

Açıkçası görüşüm şu: Çoğu insan için yerel AI, bir hobi projesi gibi tatmin edici ama maliyet/performans açısından mantıksız bir seçim. 2.000-3.000 dolarlık bir laptop farkını ödemek yerine, bulut API'leri aynı veya daha iyi kaliteyi dakikalar içinde, donanım yatırımı yapmadan sunuyor — ve model güncellemelerini de otomatik alıyorsunuz. Yerel çalıştırmanın asıl mantıklı olduğu üç senaryo var: veri gizliliği zorunluluğu (internet bağlantısı olmayan ortamlar, düzenleyici kısıtlamalar), offline çalışma ihtiyacı ve deneysel/öğrenme amaçlı kullanım. Bu üçü dışında, [cihazda mı bulutta mı çalıştırmalı sorusunu](/tr/posts/cihazda-mi-bulutta-mi-yapay-zeka) karşılaştırdığımız yazıda da vurguladığımız gibi, bulut hâlâ varsayılan doğru seçim.

## Sıkça Sorulan Sorular

### Yerel yapay zeka çalıştırmak için laptopta ne kadar RAM gerekir?

7B-13B modeller için en az 16 GB unified memory veya VRAM yeterli; 30B sınıfı modeller için 32 GB önerilir. Kaba kural: 4-bit nicelemeyle gereken bellek (GB), parametre sayısının (milyar) yaklaşık yarısı kadardır, üzerine bağlam penceresi için ek pay eklenir.

### NPU'lu bir laptop almak büyük dil modelleri için yeterli mi?

Genellikle hayır. NPU'lar küçük, sürekli çalışan görevler için optimize edilmiş; 7B'nin üzerindeki modelleri tam hız çalıştırmak için GPU/unified memory ekosistemi hâlâ daha olgun. NPU'nun TOPS rakamı, büyük dil modeli performansının doğrudan göstergesi değil.

### Apple Silicon mı yoksa ayrı ekran kartlı bir laptop mı daha iyi?

Daha büyük model çalıştırmak istiyorsan (30B'ye kadar) Apple Silicon'un unified memory mimarisi avantajlı; ama VRAM'e sığan bir model için ayrı GPU'lu bir laptop genelde daha hızlı çıkarım verir. Seçim, hedeflediğin model büyüklüğüne ve hız önceliğine bağlı.

### Bir laptop alırken SSD boyutu neden önemli?

Nicelenmiş model dosyaları 4 GB'tan (küçük 7B modeller) 40 GB'ın üzerine (30B+ modeller) kadar çıkabiliyor ve birden fazla model denemek istediğinizde bu dosyalar hızla birikiyor. En az 512 GB, tercihen 1 TB depolama alanı önerilir; ayrıca modellerin yüklenme hızı da SSD'nin okuma hızına bağlı, bu yüzden bütçe izin veriyorsa NVMe SSD tercih edilmeli.

### Yerel yapay zeka yerine bulut API kullanmak her zaman daha mantıklı mı?

Çoğu kullanıcı için evet — donanım maliyeti, bakım ve model güncelleme yükü olmadan aynı veya daha iyi kaliteyi sunuyor. Yerel çalıştırma asıl veri gizliliği zorunluluğu, offline çalışma ihtiyacı veya deneysel/öğrenme amaçlı kullanımda mantıklı hale geliyor.
