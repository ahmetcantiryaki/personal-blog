---
title: "OpenAI Codex'te 5 Saatlik Limiti Geri Getirdi"
slug: "openai-codex-5-saatlik-limit-geri-dondu"
translationKey: "openai-codex-5-hour-limit-returns"
locale: "tr"
excerpt: "OpenAI, 25 Ağustos 2026'da Plus aboneleri için Codex ve ChatGPT Work'e 5 saatlik kullanım sınırını geri getirdi; sınır haftalarca uygulanmamıştı."
category: "ai"
tags: ["openai", "chatgpt", "ai-coding", "developer-experience"]
publishedAt: "2026-08-26"
seoTitle: "OpenAI Codex'te 5 Saatlik Limiti Geri Getirdi"
seoDescription: "OpenAI, 25 Ağustos 2026'dan itibaren aylık 20 dolarlık Plus aboneleri için Codex ve ChatGPT Work'e 5 saatlik kullanım sınırını yeniden getirdi."
---

Kısa cevap: Evet, aylık 20 dolarlık ChatGPT Plus aboneliğiniz varsa Codex ve ChatGPT Work'te yeniden kısıtlamaya girdiniz. OpenAI, 25 Ağustos 2026'dan itibaren Plus aboneleri için her iki ürüne de 5 saatlik dönen (rolling) kullanım sınırını geri getirdi; bu sınır haftalarca uygulanmamıştı. Aylık 100 ve 200 dolarlık Pro abonelerini bu değişiklik etkilemiyor.

OpenAI'da Codex ve ChatGPT Work'ün teknik liderliğini yürüten Thibault Sottiaux, [değişikliği 24 Ağustos 2026'da X'te duyurdu](https://9to5mac.com/2026/08/24/openai-restores-5-hour-codex-and-work-limits-for-chatgpt-plus-users/). Zamanlama önemli: bu, OpenAI'ın 2026'da daha önce gevşettiği bir kullanım kısıtlamasını geri çektiği ikinci olay ve doğrudan Codex'i günlük kodlama işi için kullanan herkesi etkiliyor.

## 25 Ağustos 2026'da ne değişti?

Plus aboneleri, geri dönüşten önceki haftalarca yalnızca haftalık kotaya karşı çalışıyordu; 5 saatlik bir tavan yoktu. 25 Ağustos itibarıyla, hem Codex hem ChatGPT Work'te bu haftalık kotanın üzerine 5 saatlik dönen pencere yeniden eklendi.

Bu, uzun ajan tabanlı (agentic) kodlama oturumları çalıştıranlar için ciddi bir fark yaratıyor. Yalnızca haftalık kota, bir günde yoğun şekilde kullanımın büyük kısmını tüketip haftanın geri kalanında rahat çalışmanıza izin veriyordu. 5 saatlik pencere ise her oturum boyunca tüketimi dengeli tutmaya zorluyor; çünkü görev ortasında tavana çarpmak, sıfırlanmayı beklemek ya da ek kredi satın almak anlamına geliyor.

## OpenAI limiti neden geri getirdi?

OpenAI'ın açıkladığı gerekçe, gizli maliyet kısma değil sunucu yükü yönetimi — ama pratikte ikisini tamamen ayırmak nadiren mümkün. Şirketin kamuya açık çerçevelemesi, 5 saatlik limiti kullanıcıları daha pahalı katmanlara itmek için değil, yoğun eşzamanlı talep altında ürün deneyimini korumak için sunuyor; hatta bazı açıklamalarda limit, kullanıcıları "kendi kullanımlarından korumak" için gerekli bir önlem olarak tarif ediliyor.

Asıl neden ne olursa olsun, pratik sonuç aynı: Codex ve ChatGPT Work, çoğu bireysel geliştiricinin ve serbest çalışanın kullandığı katmanda bir gecede ölçülebilir şekilde daha cimri hale geldi. Haftalarca sınırsız çalışan bir iş akışı kurup buna göre planlama yapmış ekipler için bu, üzerine hiç uyarı yapılmamış bir kapasite kesintisi gibi hissettiriyor.

## 5 saatlik Codex limiti tam olarak nasıl işliyor?

Limit, haftalık kotanın üzerine eklenen, dönen (sliding) 5 saatlik bir pencere üzerinden ölçülen tüketim eşiği; iki sınır da aynı anda geçerli ve herhangi birine çarpmak kullanımı durduruyor. Plus kullanıcısı 5 saatlik hakkını tükettiğinde, Codex ve ChatGPT Work pencere sıfırlanana ya da kullanıcı ek kredi satın alana kadar yeni isteklere yanıt vermiyor.

Bu, sabit bir günlük kesinti değil. Pencere sürekli kaydığı için, beş saat önceki kullanım gerçek zamanlı olarak düşüyor ve alan açıyor; sabit bir saatte tek seferde sıfırlanmıyor. Pratikte bu, kısa ve aralıklı kodlama oturumlarının, tek bir uzun kesintisiz koşuya göre limit altında çok daha iyi performans gösterdiği anlamına geliyor.

## Pro aboneleri etkileniyor mu?

Hayır. OpenAI, 5 saatlik limitin aylık 100 ve 200 dolarlık Pro planlarında "önümüzdeki aylarda" yeniden etkinleştirilmeyeceğini belirtti. Pro kullanıcıları, Plus kullanıcılarının 25 Ağustos'a kadar sahip olduğu düzenlemeyle aynı şekilde, yalnızca haftalık kotaya karşı çalışmaya devam ediyor.

Asıl önemli fark burada: oturum bazlı kısıtlamadan kaçınmak için aylık 20 dolarlık Plus tabanının üzerine 80-180 dolarlık bir prim ödüyorsunuz.

## Planlar şimdi nasıl karşılaştırılıyor?

| Plan | Aylık Fiyat | 5 Saatlik Limit (Codex/Work) | Haftalık Kota |
|---|---|---|---|
| ChatGPT Free | 0 $ | Uygulanıyor (daha dar) | Uygulanıyor |
| ChatGPT Plus | 20 $ | 25 Ağustos 2026'da geri geldi | Uygulanıyor |
| ChatGPT Pro | 100-200 $ | Yeniden etkinleştirilmedi | Uygulanıyor |
| ChatGPT Team | Koltuk başına, kurumsal | Yöneticinin ayarına göre değişir | Uygulanıyor |
| API (kullanım başına) | Kullanıma göre, abonelik yok | Oturum limiti yok | Katmana göre hız sınırı |

## Codex'e bağımlı geliştiriciler şimdi ne yapmalı?

Codex günlük iş akışınızın parçasıysa, 5 saatlik limit hangi aracı kullanacağınızı değil, işi nasıl zamanlayacağınızı değiştiriyor. Üç pratik ayar hemen uygulanabilir.

Birincisi, uzun ajan tabanlı oturumları tek bir maraton koşu yerine kısa ve aralıklı bloklara bölün; dönen pencere temposu ödüllendiriyor. İkincisi, yarıda bırakamayacağınız bir göreve başlamadan önce tavana ne kadar yaklaştığınızı takip edin; çünkü limite bir refactor'un ortasında çarpmak, görevler arasında çarpmaktan çok daha kötü. Üçüncüsü, Pro'ya yükseltmenin gerçek maliyetini doğrudan API kullanımı ödemekle karşılaştırın: haftada onlarca saat ajan tabanlı kodlama yapan yoğun kullanıcılar için aylık 100 dolarlık Pro katmanı, eşdeğer bir API iş yükünün token maliyetinden daha ucuz olabilirken, hafif kullanıcılar genellikle oturum limiti olmayan kullanım başına API fiyatlandırmasıyla daha iyi durumda.

Zaten elinizdeki diğer kodlama ajanlarına karşı Codex'i kıyaslamak için de makul bir an: Claude Code ve Cursor farklı kullanım modelleri kullanıyor ve ikisi de Ağustos 2026 itibarıyla standart katmanlarında benzer bir 5 saatlik oturum limiti getirmedi. AI kodlama yığınınızı zaten gözden geçiriyorsanız, [yaygın AI kod asistanı hataları](/tr/posts/ai-kod-asistani-hatalari) yazımız hangi araca karar verirseniz verin göz atmaya değer.

## Bu, OpenAI'daki daha büyük bir örüntünün parçası mı?

Evet. Bu, OpenAI'ın 2026'daki ikinci dikkat çekici kullanım-limiti geri dönüşü; öncesinde yılın başlarında yüksek görünürlüklü güvenilirlik olayları yaşanmıştı (bkz. [ChatGPT'nin kesinti serisi üzerine yazımız](/tr/posts/chatgpt-kesintileri-4-gunde-4-ariza)). Bu örüntü, OpenAI'ın sabit bir politikayı kilitlemek yerine cömertlik ile altyapı yükünü neredeyse gerçek zamanlı dengelediğini gösteriyor — yani özellikle Plus katmanındaki limitler sabit varsayılmamalı, periyodik olarak kontrol edilmeli.

Codex etrafında araç standardizasyonu yapan ekipler için bu oynaklığın kendisi bir planlama girdisi: "sınırsız Plus kullanımı" varsayımı üzerine kurulu bir iş akışı, tek bir X gönderisi ve 24 saatlik bir bildirimle bu varsayımı kaybedebilir. Bu da tek bir araca aşırı bağımlı olmanın somut bir riskini gösteriyor; yedek bir plan olarak en azından bir alternatif ajanı elde tutmak, bir sonraki sürpriz politika değişikliğinde iş akışınızı durdurmamanızı sağlar.

Hangi planı seçerseniz seçin karar vermeden önce [ChatGPT tam rehberimize](/tr/posts/chatgpt-tam-rehber-2026) göz atın ve güncel durumu OpenAI'ın kendi [ChatGPT sürüm notlarından](https://help.openai.com/en/articles/6825453-chatgpt-release-notes) takip edin.

## Sıkça Sorulan Sorular

### 5 saatlik Codex limiti ChatGPT Team veya Enterprise planlarını etkiliyor mu?

OpenAI'ın 25 Ağustos 2026 duyurusu özellikle Plus abonelerini adlandırdı; Team ve Enterprise kullanım limitleri genellikle bir yönetici tarafından kurum bazında yapılandırılıyor ve tüketici Plus limitiyle otomatik olarak aynı olmuyor. Kurumunuzun ayarladığı spesifik limitler için çalışma alanınızın yönetici ayarlarını veya kullanım panosunu kontrol edin.

### Codex'teki 5 saatlik limit Pro planlara da gelecek mi?

OpenAI, limitin aylık 100 ve 200 dolarlık Pro planlarında "önümüzdeki aylarda" yeniden etkinleştirilmeyeceğini belirtti; bu, ileride bir değişikliğe kapıyı açık bırakıyor ama Ağustos 2026 itibarıyla yakın vadeyi dışlıyor. Pro kullanıcıları yine de resmi duyuruları izlemeli, çünkü Plus kullanıcıları da limit geri gelmeden önce aynı güvenceye sahipti.

### 5 saatlik Codex limitine görev ortasında çarparsam ne olur?

Codex ve ChatGPT Work, dönen 5 saatlik pencere kapasite açana ya da ek kredi satın alana kadar yeni istekleri kabul etmeyi durduruyor; prompt mühendisliğiyle limiti aşmanın bir yolu yok. Pencere sabit bir saatte değil sürekli kaydığı için, oturumunuzun başındaki eski kullanım kademeli olarak düşüyor; bu yüzden 20-30 dakika beklemek bile kısmi alan açabiliyor.

### Codex tarzı kodlama için ChatGPT Plus yerine OpenAI API'sini kullanmak daha mı ucuz?

Bu, hacme bağlı: kullanım başına API fiyatlandırmasında 5 saatlik oturum limiti yok, yalnızca kullanım katmanına göre hız sınırı var; bu da hafif veya düzensiz kodlama işine uyuyor. Haftada birçok saat ajan tabanlı oturum çalıştıran yoğun kullanıcılar ise API token'larına aylık 100 dolarlık Pro aboneliğinden daha fazla harcayabilir. Geçiş yapmadan önce bir hafta boyunca gerçek token tüketiminizi takip edin, çünkü başabaş noktası kodlama tarzına ve model seçimine göre önemli ölçüde değişiyor.
