---
title: "Ollama, vLLM ve llama.cpp: Yerel LLM Çalıştırma"
slug: "ollama-vllm-llamacpp-yerel-llm-calistirma"
translationKey: "local-llm-runtimes"
locale: "tr"
excerpt: "Kendi donanımında LLM çalıştırma karşılaştırması: masaüstü geliştirme için Ollama, yüksek hacimli GPU sunumu için vLLM, taşınabilir kuantize çıkarım için llama.cpp."
category: "devops-cloud"
tags: ["llm", "self-hosting", "ai-infrastructure", "performance", "open-source"]
publishedAt: "2026-07-07"
seoTitle: "Ollama, vLLM ve llama.cpp: Yerel LLM"
seoDescription: "2026'da hangi yerel LLM çalıştırma aracını seçmeli? Masaüstü, GPU sunumu ve taşınabilir kuantize çıkarım için Ollama, vLLM ve llama.cpp karşılaştırması ve karar rehberi."
---

DeepSeek V4 Preview ağırlıklarını yayınladığı hafta, ekibimizin Slack kanalı bir "hangi araçla çalıştıralım" tartışmasına döndü. Bir arkadaşımız akşam yemeğine kadar modeli MacBook'ta çalıştırmıştı. Bir diğeri tüm ekibe sunmak için iki gününü bir Blackwell node'unu ayağa kaldırmaya harcadı. Üçüncüsü ise ofisin köşesindeki mini PC'ye kuantize bir sürüm sığdırdı. Üçü de "DeepSeek'i yerelde çalıştırıyordu" ve üçü de haklıydı, çünkü farklı işler için farklı araçlar kullanıyorlardı.

Açık ağırlıklı modelleri kendi sunucunda çalıştırırken kimsenin söylemediği şey şu: model kararın yalnızca yarısı. Onu sardığın çalıştırma aracı (runtime), 30 saniyelik bir demo mu yoksa yük altında ayakta kalan bir üretim endpoint'i mi elde edeceğini belirliyor. Temmuz 2026 itibarıyla, DeepSeek V4'ün tam açık ağırlık lansmanı ayın ortasında beklenirken, üç araç konuşmaya hâkim: **Ollama**, **vLLM** ve **llama.cpp**. Bunlar birbirinin rakibi olmaktan çok, keskin ve çakışmayan kullanım alanlarına sahip araçlar. İşte hangisini nasıl seçeceğin.

## Üç araç, birer paragrafta

**Ollama**, yerel geliştirme için "kur ve çalıştır" seçeneği. Model indirme, kuantizasyon ve OpenAI uyumlu bir sunucuyu tek komutun arkasına sarar. [13 Mayıs 2026'da v0.30.0 ile açılan](https://ollama.com/blog/mlx) 0.30 serisi, Apple Silicon üzerinde birleşik bellek mimarisinden yararlanan yerel bir MLX motoru getirdi; en güncel v0.30.10 ise 17 Haziran'da çıktı. M5 sınıfı çiplerde artık daha hızlı ilk token süresi için GPU Neural Accelerator birimlerini kullanıyor. Mac'te geliştiriyorsan en az dirençli yol budur.

**vLLM**, GPU sunumu için tasarlanmış hacim canavarı. Tek bir soruyu yanıtlamak için var: kuyruk gecikmesi (tail latency) bozulmadan bir GPU'dan kaç eşzamanlı isteği geçirebilirim? Yanıtı PagedAttention ve sürekli batch'leme; NVIDIA'nın yeni silikonlarda tercih ettiği araç da bu. [vLLM v0.21.0](https://github.com/vllm-project/vllm/releases), DeepSeek V4 desteğini Blackwell üzerinde stabilize etti; GB300 sınıfı donanımda GPU başına yaklaşık 3.500 token/sn'ye yakın ilk rakamlarla. Bu bir masaüstü aracı değil, dahili bir API'nin arkasına koyacağın şey.

**llama.cpp**, neredeyse her yerde çalışan taşınabilir, kuantize iş atı: yalnızca CPU'lu sunucular, eski GPU'lar, bir Raspberry Pi, bir oyuncu dizüstü bilgisayarı. Ekosistemin yarısının (Ollama dahil) üzerine kurulduğu C/C++ motoru. Mayıs 2026'da master'a [Multi-Token Prediction desteğini](https://github.com/ggml-org/llama.cpp/pull/22673) birleştirdi (PR #22673, `--mtp` bayrağının arkasında); bu, Qwen 3.6 27B gibi modellerde tek kullanıcılı hacmi kabaca iki katına çıkaran, modele gömülü bir speculative decoding tekniği. Taşınabilirlik ve kuantizasyon ham eşzamanlılıktan daha önemliyse, aracın bu.

## Yan yana

| Boyut | Ollama | vLLM | llama.cpp |
|-------|--------|------|-----------|
| Ana iş | Yerel geliştirme / masaüstü | Yüksek hacimli GPU sunumu | Taşınabilir kuantize çıkarım |
| En iyi donanım | Apple Silicon, tek GPU | NVIDIA veri merkezi GPU'ları | CPU, tüketici GPU, uç cihaz |
| Kurulum eforu | Tek komut | Orta (CUDA, yapılandırma) | Derle ya da hazır binary al |
| Eşzamanlılık | Hafif (birkaç kullanıcı) | Ağır (sürekli batch'leme) | Hafif-orta |
| Kuantizasyon | Gömülü (GGUF) | FP8/INT, GGUF odaklı değil | GGUF, geniş kuantizasyon seçeneği |
| 2026'nın öne çıkanı | MLX motoru (v0.30) | Blackwell'de DeepSeek V4 (v0.21) | Multi-Token Prediction (`--mtp`) |
| OpenAI uyumlu API | Evet | Evet | Evet (llama-server) |

En önemli satırlar "ana iş" ve "eşzamanlılık". Ollama ve llama.cpp bir ile birkaç kullanıcı için optimize edilmiştir; vLLM ise çok kullanıcı için. Yanlışını seçersen, ya ihtiyacın olmayan bir `pip install` için on dakika beklersin ya da ikinci kullanıcı gelir gelmez bir masaüstü aracının çöktüğünü izlersin.

## Şu iş için şunu seç

**Dizüstünde prototip yapan bir geliştiricisin.** Ollama kullan. Bir prompt'u test etmek, hızlı bir [RAG hattı](/tr/posts/rag-sistemi-nasil-kurulur) kurmak ya da CUDA sürümlerini düşünmeden çevrimdışı bir kod asistanı çalıştırmak istiyorsun. Tek komut ve bir endpoint'in hazır:

```bash
# Bir modeli yerelde indir ve sohbet et
ollama run deepseek-v4-flash

# Ya da OpenAI uyumlu bir endpoint'te sun
ollama serve
# → POST http://localhost:11434/v1/chat/completions
```

**Bir modeli ekibe ya da ürüne sunuyorsun.** vLLM kullan. Gerçek eşzamanlılık olduğu an, hacim ve kuyruk gecikmesi işin tamamı hâline gelir; yük altında p99'u makul tutan şey de sürekli batch'lemedir:

```bash
# OpenAI uyumlu API ile bir model sun
vllm serve deepseek-ai/DeepSeek-V4-Flash \
  --tensor-parallel-size 2 \
  --max-model-len 131072
```

**Her yerde, ucuza çalışması gerekiyor.** llama.cpp kullan. Uç cihazlar, yalnızca CPU'lu VM'ler, izole (air-gapped) ortamlar ya da gece boyu toplu iş yapan 500 dolarlık bir mini PC. Kuantize bir GGUF al; MTP ile desteklenen modellerde bedava bir hız artışı elde edersin:

```bash
# Multi-Token Prediction ile kuantize bir model çalıştır
llama-server -m deepseek-v4-flash-Q4_K_M.gguf \
  --mtp --host 0.0.0.0 --port 8080
```

Ölçülü fikrim şu: çoğu ekip vLLM'e fazla erken uzanıyor. Birkaç eşzamanlı kullanıcıdan azına sahipsen, Ollama ya da bir llama.cpp sunucusu çok daha az operasyonel yükle işini görür; trafiğin gerçekten ayrı bir GPU'yu hak ettiği gün vLLM'e terfi edebilirsin. İhtiyacın olmayan sunum altyapısı, üzerine biraz daha adım eklenmiş [bulut maliyetinden](/tr/posts/kubernetes-maliyet-optimizasyonu) başka bir şey değildir.

## DeepSeek V4 lansmanı hesabı nasıl değiştiriyor

Bu karşılaştırmayı güncel kılan şey DeepSeek'in V4 ailesi. [V4 Preview 24 Nisan 2026'da](https://llm-stats.com) iki biçimde çıktı: **V4 Pro** (1,6T toplam parametre, 49B aktif) ve **V4 Flash** (284B toplam, 13B aktif), ikisi de 1M token bağlam penceresiyle. Flash varyantı, kendi hosting'i için ilginç olanı, çünkü 13B aktifli bir MoE, bellek ayak izinin çok üzerinde performans gösteriyor.

Bu boyut profili üç araca temiz bir şekilde oturuyor. Flash, ciddi bir iş istasyonunun barındırabileceği bir seviyeye iner ki bu llama.cpp ve Ollama arazisidir. 1,6T toplam ağırlığı ve uzun bağlam iştahıyla Pro ise, çok GPU'lu bir vLLM dağıtımının bellek bant genişliğini ve batch'lemesini ister. Aynı model ailesi, tamamen farklı üç dağıtım hikâyesi; "yerelde çalıştır"ın neden artık tek bir yanıt olmaktan çıktığının tam sebebi de bu.

Hangi aracı seçersen seç, çevresindeki disiplin üretimdeki her model için aynıdır: kaliteyi [doğru değerlendirmelerle (eval)](/tr/posts/llm-ciktilari-degerlendirme) ölç, gerçek kullanıcılar gelince [halüsinasyonlara](/tr/posts/llm-halusinasyon-azaltma) dikkat et ve endpoint'i işlettiğin diğer servisler gibi ele al. Daha geniş resim için [DevOps ve bulut kategorimiz](/tr/category/devops-bulut) dağıtım ve maliyet tarafını kapsıyor.

## Sıkça Sorulan Sorular

### Aynı GGUF model dosyasını üç araçta da kullanabilir miyim?

Ollama ve llama.cpp'nin ikisi de GGUF'u yerel olarak konuşur, dolayısıyla kuantize bir dosya çoğu zaman aralarında az sürtünmeyle taşınır; Ollama esasen aynı motorun dost bir sarmalayıcısıdır. vLLM farklıdır, GGUF yerine FP8 ve safetensors gibi GPU'ya özgü formatlar üzerine kuruludur; orada genellikle orijinal ya da FP8-kuantize bir checkpoint sunarsın, bir `Q4_K_M` GGUF değil.

### 2026'da yerel bir LLM çalıştırmak için GPU şart mı?

Hayır. llama.cpp tamamen CPU üzerinde çalışır ve Ollama GPU yoksa CPU'ya düşer, ancak ikisi de hızlandırmayla çok daha hızlıdır. GPU yalnızca eşzamanlı sunum için vLLM'e geçtiğinde vazgeçilmez olur; orada tüm mesele, birçok isteği aynı anda işleyerek GPU bellek bant genişliğini doyurmaktır.

### Hangi araç en hızlı?

İş yüküne bağlı ve dürüst yanıt soruyu geçersiz kılıyor. Tek kullanıcı için MTP'li llama.cpp ya da Ollama'nın MLX motoru mükemmeldir ve çoğu zaman anlık hissettirir. Çok eşzamanlı kullanıcı için vLLM açık ara kazanır, çünkü sürekli batch'leme GPU'yu istekler arasında boşta bırakmak yerine meşgul tutar. Tek akış hızı ile toplam hacim farklı metriklerdir; yanlış olanı optimize etme.

### Modelleri yerelde çalıştırmak gerçekten API'den ucuz mu?

Bazen. İstikrarlı, yüksek hacmin varsa ve donanıma zaten sahipsen, kendi hosting'in token başına API fiyatlandırmasını geçebilir ve hassas veriyi kurum içinde tutar. Ama ani sıçramalı ya da düşük hacim için, GPU amortismanını, elektriği ve işletme için gereken mühendis saatlerini saydığında barındırılan bir API genellikle daha ucuzdur. Herhangi bir [bulut maliyeti kararında](/tr/posts/finops-bulut-maliyeti-dusurme) yapacağın gibi, karar vermeden önce kendi gerçek kullanımına göre rakamları çalıştır.
