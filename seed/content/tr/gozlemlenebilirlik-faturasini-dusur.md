---
title: "Gözlemlenebilirlik Faturanı Nasıl Düşürürsün?"
slug: "gozlemlenebilirlik-faturasini-dusur"
translationKey: "cut-observability-bill-sampling-2026"
locale: "tr"
excerpt: "Kısa cevap: verinin tamamını toplamayı bırak. Tail-based sampling, kardinalite kontrolü ve katmanlı saklama ile faturayı kırıp incident'ları hâlâ çözebilirsin."
category: "devops-cloud"
tags: ["observability", "cost-optimization", "finops", "monitoring"]
publishedAt: "2026-09-19"
seoTitle: "Gözlemlenebilirlik Faturanı Nasıl Düşürürsün?"
seoDescription: "2026'da gözlemlenebilirlik maliyeti nasıl düşürülür: tail-based sampling ve kardinalite kontrolüyle fatura düşer, incident çözümü bozulmadan kalır."
---

Kısa cevap: daha ucuz bir vendor'a geçmek değil, toplama katmanında sampling ve kardinalite disiplini uygulamak faturayı düşürür. Çoğu ekip logların, trace'lerin ve metric label'larının neredeyse tamamını sonsuza kadar saklıyor; oysa bunların büyük kısmı hiç sorgulanmıyor. Tail-based sampling tek başına toplam tasarrufun %70-80'ini getirir.

Gözlemlenebilirlik faturası büyüdükçe ilk refleks "Datadog yerine daha ucuz bir araç bulalım" olur. Bu, [observability nedir](/tr/posts/observability-nedir) sorusuna yanlış açıdan bakmaktır: sorun vendor değil, hacimdir. 2026 itibarıyla [OpenTelemetry Collector](https://opentelemetry.io/docs/collector/)'ın `tail_sampling` processor'ı ve ona eklenen yeni yetenekler, %100 verbose log ve unsampled trace alışkanlığını kırmak için yeterli olgunlukta.

## Gözlemlenebilirlik faturası neden patlar?

Fatura patlar çünkü üç şey sınırsız büyür: log satırı sayısı, trace span'i sayısı ve metric label kombinasyonu sayısı. Hiçbiri kötü niyetle değil, "ne olur ne olmaz görürüz" refleksiyle biriktirilir ve sonunda sorgulanmayan verinin depolama ve indeksleme maliyeti fatura kalemine dönüşür.

En büyük üç kaynak şunlardır:

- **%100 DEBUG/TRACE seviyesinde log basmak** production'da, çoğu satır hiç okunmadan indekslenir.
- **Unsampled trace'ler**: her HTTP isteği, hatasız da olsa, tam bir trace olarak saklanır.
- **Kardinalite patlaması**: `user_id`, ham URL ya da `request_id` gibi alanların metric label'ı yapılması; her benzersiz kombinasyon ayrı bir time series demektir ve depolanan seri sayısını katlar.

Bu üçü birlikte, altyapı büyümeden faturayı ayda %20-40 şişirebilir. Çözüm daha fazla depolama satın almak değil, veriyi kaynağında azaltmaktır.

## Tail-based sampling nedir?

Tail-based sampling, bir trace tamamlanana kadar bekleyip sonra hangi trace'in saklanacağına karar veren bir yöntemdir. Head-based sampling'in aksine (istek başlarken rastgele karar verir), tail-based sampling trace bittikten sonra "hata var mı, yavaş mı, önemli mi" sorusuna bakar ve ona göre tutar ya da atar.

OpenTelemetry Collector'ın `tail_sampling` processor'ı bunu politika tabanlı yapar: hata içeren trace'lerin %100'ünü tut, sağlıklı/başarılı trace'lerin sadece %5-10'unu tut. [Datadog'un tail-based sampling üzerine mühendislik yazısına](https://www.datadoghq.com/blog/control-trace-volume-with-opentelemetry-tail-based-sampling/) göre gerçek dağıtımlarda bu yaklaşım span hacmini %89'a kadar azaltırken her hata senaryosunda tam fidelity korur. Yani incident'ı çözmek için ihtiyacın olan trace hiçbir zaman örneklenip atılmıyor; atılan, zaten sorunsuz geçen trafik.

Basit bir Collector konfigürasyonu şöyle görünür:

```yaml
processors:
  tail_sampling:
    decision_wait: 10s
    num_traces: 100000
    policies:
      - name: keep-all-errors
        type: status_code
        status_code:
          status_codes: [ERROR]
      - name: sample-healthy-traffic
        type: probabilistic
        probabilistic:
          sampling_percentage: 7
```

Bu konfigürasyon, hata içeren trace'lerin tamamını tutarken sağlıklı trafiğin sadece %7'sini saklar. `decision_wait` süresi, processor'ın karar vermeden önce trace'in tamamlanmasını beklediği süredir; bu süre boyunca trace bellekte tutulur, bu da bir sonraki bölümdeki bellek sorununu doğurur.

## Elastic'in 2026 katkıları neyi değiştirdi?

Elastic, 2026'da OTel Collector'ın tail sampling processor'ına iki upstream iyileştirme kattı: `span-ingest` sampling stratejisi ve Pebble LSM tabanlı disk depolama extension'ı (`pebbletailstorageextension`). İkisi birlikte, tail-based sampling'in en büyük iki operasyonel sorununu, gecikme ve bellek tüketimini, doğrudan hedefliyor.

`span-ingest` stratejisi, karar verme işleminin ingest anında başlamasına izin verir; yani trace'ler `decision_wait` süresinin tamamı geçmeden serbest bırakılabilir. Bu, düşük gecikmeli pipeline'larda trace'lerin backend'e ulaşma süresini kısaltır. [Elastic'in observability labs blogunda anlattığı](https://www.elastic.co/observability-labs/blog/tail-sampling-memory-opentelemetry) `pebbletailstorageextension` ise trace'leri işlenene kadar bellekte değil, Pebble LSM tabanlı disk depoda tutar; bu değişiklik processor'ın bellek kullanımını %65'e kadar düşürüyor.

Pratik sonuç: daha önce yüksek trafikli servislerde tail sampling'i "bellek çok yer" diye devre dışı bırakan ekipler, artık disk tabanlı depolama sayesinde bunu production'da çalıştırabiliyor. [eBPF ile gözlemlenebilirlik](/tr/posts/gozlemlenebilirlik-icin-ebpf) yazısında değindiğimiz gibi, toplama katmanındaki her verimlilik kazanımı, uygulama koduna dokunmadan geliyor.

## Kardinalite kontrolü nasıl yapılır?

Kardinalite, bir metriğin label kombinasyonlarının toplam sayısıdır; her yeni kombinasyon ayrı bir time series açar ve depolama maliyetini doğrudan çarpar. Kontrolü, yüksek kardiniteli alanları (user ID, ham URL, request ID) metric label'ı yapmadan önce Collector seviyesinde düşürmek ya da hash'lemektir.

Pratikte üç kural işe yarar:

1. Kimlik alanlarını (user_id, session_id) asla metric label'ı yapma; bunlar log ve trace'te correlation ID olarak kalsın.
2. Ham URL yerine route pattern kullan (`/users/{id}` yerine `/users/8421` değil).
3. Collector'da bir `attributes` veya `transform` processor ile yüksek kardiniteli alanları hash'le veya at, backend'e ulaşmadan önce.

Bu, tail-based sampling'in üstüne binen ikinci savunma katmanıdır ve tek başına ek %5-15 tasarruf getirir.

## Log seviyesi ve saklama süresi nasıl ayarlanır?

Log seviyesi disiplini, production'da DEBUG/TRACE seviyesini kapatmak, INFO'yu örneklemek ve WARN/ERROR'ın %100'ünü tutmaktır. Katmanlı saklama ise sıcak veriyi 7-14 gün tutup ötesini soğuk/ucuz depoya veya agregatlara taşımaktır. İkisi birlikte, sampling'in üstüne ek ve öngörülebilir tasarruf ekler.

Aşağıdaki tablo, veri türüne göre önerilen sampling oranı ve saklama süresini özetliyor:

| Veri türü | Önerilen sampling/oran | Saklama süresi | Neden |
|---|---|---|---|
| Hata içeren trace/log | %100 | 30-90 gün | Incident çözümü için tam fidelity şart |
| Sağlıklı trace | %5-10 | 7-14 gün sıcak | Trend ve latency dağılımı için yeterli |
| DEBUG/TRACE log | %0 (production'da kapalı) | - | Neredeyse hiç sorgulanmıyor |
| INFO log | %10-30 örneklenmiş | 7-14 gün sıcak | Bağlam için yeterli, hacim düşük |
| WARN/ERROR log | %100 | 30-90 gün | Erken uyarı ve postmortem için kritik |
| Yüksek kardiniteli metric label | Hash'le veya at | - | Her kombinasyon ayrı time series açar |

## Ne zaman kesmemelisin?

Hata yoluna giren trace ve logları, ayrıca incident'ı yeniden kurmak için gereken trace ID ve correlation ID'leri asla örnekleme. Sağlıklı trafiği örneklemek güvenlidir; başarısız trafiği örneklemek değildir, çünkü tam da ihtiyaç duyacağın anda elinde veri kalmaz.

Bu, contrarian ama basit bir kural: agresif sampling incident yanıtını zayıflatmaz, aksine onu güçlendirir, çünkü gürültüyü azaltıp sinyali (hatalar, yavaş istekler) tam fidelity ile tutar. Faturayı düşürmek isteyen bir ekip önce "hangi veriyi hiç sorgulamıyoruz" sorusunu sormalı, sonra "hangi veriyi hiç kaybedemeyiz" sorusunu; ikisi arasındaki fark, kesilecek %70-80'lik dilimdir.

Bu disiplin [LLM gözlemlenebilirliği](/tr/posts/llm-gozlemlenebilirligi-trace-eval) gibi yeni, hacmi hızla büyüyen alanlarda daha da kritik: LLM trace'leri büyük payload'lar taşır, sampling olmadan fatura hızla kontrolden çıkar. Bulut maliyetini genel olarak düşürmek istiyorsan [FinOps ile bulut maliyeti düşürme](/tr/posts/finops-bulut-maliyeti-dusurme) yazısı da aynı "önce ölç, sonra kes" mantığını izliyor.

Uygulama sırası netse iş kolaylaşır: önce tail-based sampling'i devreye al (en büyük kazanç, %70-80), sonra kardinalite kontrolünü ekle, en son log seviyesi ve saklama politikasını sıkılaştır. Her adımdan sonra faturayı ve incident çözüm süresini ayrı ayrı ölç; ikisi birden iyileşmiyorsa bir sonraki adıma geçme.

## Sıkça Sorulan Sorular

### Tail-based sampling head-based sampling'den farkı nedir?

Head-based sampling, isteğin başında rastgele bir örnekleme kararı verir ve trace'in nasıl biteceğini bilmez. Tail-based sampling trace tamamlanana kadar bekler, sonra hata veya gecikme durumuna bakarak karar verir; bu yüzden hataları kaçırma riski çok daha düşüktür.

### Tail-based sampling'in en büyük dezavantajı nedir?

En büyük dezavantajı bellek ve gecikmedir: processor, trace tamamlanana kadar tüm span'leri bellekte tutmak zorundadır. 2026'da Elastic'in katkıda bulunduğu Pebble LSM tabanlı disk depolama extension'ı bu bellek kullanımını %65'e kadar azaltarak bu sorunu büyük ölçüde çözdü.

### Kardinalite kontrolü sampling'in yerini tutar mı?

Hayır, ikisi farklı problemleri çözer ve birbirini tamamlar. Sampling trace ve log hacmini azaltır, kardinalite kontrolü ise metric time series sayısını sınırlar; ikisini birlikte uygulamak, sadece birini uygulamaktan daha yüksek toplam tasarruf sağlar.

### Sampling oranını çok agresif ayarlarsam incident'ları kaçırır mıyım?

Sadece hata trace'lerini %100 tutup sağlıklı trafiği %5-10'a düşürürsen hayır, çünkü incident çözümü için gereken veri zaten hata yolunda tam fidelity ile saklanıyor. Riski yaratan, hata trace'lerini de örneklemeye başlamaktır; bu asla yapılmamalı.
