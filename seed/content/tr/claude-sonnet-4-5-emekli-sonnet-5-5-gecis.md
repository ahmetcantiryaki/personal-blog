---
title: "Claude Sonnet 4.5 Emekli Oluyor: Sonnet 5.5'e Geçiş Rehberi"
slug: "claude-sonnet-4-5-emekli-sonnet-5-5-gecis"
translationKey: "claude-sonnet-4-5-retirement-migration"
locale: "tr"
excerpt: "Claude Sonnet 4.5, 30 Kasım 2026'da tamamen devre dışı kalıyor. Sonnet 5.5'e geçişte kırılan beş API ayarı, fiyat farkı ve otomatik geçiş komutu burada."
category: "ai"
tags: ["claude", "ai-coding", "api-design", "llm", "best-practices"]
publishedAt: "2026-10-06"
seoTitle: "Claude Sonnet 4.5 Emekli: Sonnet 5.5 Geçiş Rehberi"
seoDescription: "Claude Sonnet 4.5, 30 Kasım 2026'da emekliye ayrılıyor. Sonnet 5.5'e geçişte kırılan API ayarları, fiyat karşılaştırması ve otomatik geçiş komutu."
---

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929) 30 Eylül 2026'da "deprecated" durumuna geçti ve 30 Kasım 2026'dan itibaren o model ID'sine yapılan tüm istekler hata dönecek. Anthropic'in önerdiği hedef Claude Sonnet 5.5; geçiş beş API ayarını kırıyor ama aynı zamanda fiyatı üçte bir düşürüyor ve bağlam penceresini 200 bin tokendan 1 milyona çıkarıyor.

## Claude Sonnet 4.5 gerçekten kullanılamaz hale mi gelecek?

Evet, ama kademeli. 30 Eylül 2026'da model "deprecated" (önerilmeyen) statüsüne girdi; bu aşamada istekler hâlâ çalışır ama Anthropic artık onu önermiyor. 30 Kasım 2026'da ise "retired" (emekli) statüsüne geçiyor ve `claude-sonnet-4-5-20250929` ID'sine giden her istek doğrudan hata döner. Aradaki iki aylık pencere, kod tabanınızı test etmek ve geçişi doğrulamak için tanınan süre.

Anthropic'in [model emeklilik sayfası](https://platform.claude.com/docs/en/about-claude/model-deprecations) üç durumu böyle tanımlıyor: Active tam destekli, Deprecated hâlâ çalışıyor ama emeklilik tarihi belli, Retired ise istekler başarısız oluyor. Sonnet 4.5 şu anda tam da o orta aşamada; geçişin hâlâ bedava olduğu aşamada.

## Sonnet 5.5 ile Sonnet 4.5 arasındaki temel farklar neler?

Kısa cevap: Sonnet 5.5 hem daha ucuz hem daha geniş bağlamlı, ama beş ayarı değiştirmeden çalışmıyor. [Anthropic'in resmi model sayfasına](https://platform.claude.com/docs/en/models/sonnet-5-5/overview) göre fiyat girdi başına 3 dolardan 2 dolara, çıktı başına 15 dolardan 10 dolara iniyor — yüzde 33'lük bir düşüş. Bağlam penceresi, beta başlığı gerekmeden 200 bin tokendan 1 milyon tokene çıkıyor.

| Özellik | Claude Sonnet 4.5 | Claude Sonnet 5.5 |
|---|---|---|
| Model ID | claude-sonnet-4-5-20250929 | claude-sonnet-5-5 |
| Girdi fiyatı | 3 $ / MTok | 2 $ / MTok |
| Çıktı fiyatı | 15 $ / MTok | 10 $ / MTok |
| Önbellek okuma | 0,30 $ / MTok | 0,20 $ / MTok |
| Bağlam penceresi | 200K (standart) | 1M (standart) |
| Maksimum çıktı | 64K token | 128K token |
| Minimum önbelleklenebilir prompt | 1.024 token | 512 token |
| Varsayılan thinking | Kapalı | Açık (adaptif) |

Sayılar tek başına hikâyenin yarısı. Sonnet 5.5, Sonnet 5'in tokenizer'ını kullanıyor; bu da aynı metnin Sonnet 4.5'e göre yaklaşık yüzde 30 daha fazla token üretmesi anlamına geliyor. Yani `max_tokens` ve maliyet bütçenizi yeniden hesaplamanız gerekiyor — birim fiyat düşse de token sayısı artıyor.

## Hangi API çağrıları doğrudan hata dönecek?

Dört ayar Sonnet 4.5'te sorunsuz çalışırken Sonnet 5.5'te 400 hatasıyla reddediliyor:

- **Assistant prefill.** Sonnet 5.5, önceden doldurulmuş bir asistan mesajıyla biten konuşmaları kabul etmiyor; konuşma bir kullanıcı mesajıyla bitmeli. Çıktı formatı için prefill kullanıyorsanız yerine [structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs) veya enum alanlı bir tool geçin.
- **Zorlanmış tool seçimi.** `tool_choice: {"type": "tool"}` veya `{"type": "any"}` artık 400 hatası veriyor. Yerine `{"type": "auto"}` gönderip tool'u `strict: true` olarak işaretleyin.
- **Thinking budget_tokens.** `thinking: {"type": "enabled", "budget_tokens": N}` artık geçersiz. Bunun yerine `output_config.effort` ile beş seviyeden birini (`low`, `medium`, `high`, `xhigh`, `max`) seçiyorsunuz; budget'tan effort'a sabit bir dönüşüm yok, iki üç seviyeyi test etmeniz gerekiyor.
- **Computer use araç sürümü.** Claude API ve Google Cloud'da `computer_20250124` artık kabul edilmiyor; yerine `computer_toolset_20260801` gerekiyor.

Bunlara ek olarak, varsayılan davranış da değişiyor: `thinking` alanı boş bırakılan bir istek Sonnet 4.5'te düşünmeden yanıt verirken, Sonnet 5.5'te otomatik olarak adaptif thinking çalıştırıyor. Eski davranışı korumak için en düşük thinking ayarı olan `between_tools`'u `high` efor seviyesinde ya da altında göndermeniz gerekiyor.

## Güvenlik sınıflandırıcıları da mı değişiyor?

Evet, bu değişiklik de kolayca gözden kaçıyor. Sonnet 5.5, Sonnet 4.5'e göre daha fazla kategoride isteği reddediyor; bir ret durumunda `stop_reason` alanı `"refusal"` döner ve beş kategoriden biriyle etiketlenir: `cyber` (siber saldırı geliştirmeye yardımcı olabilecek istekler), `bio` (biyolojik zarar potansiyeli taşıyan istekler), `frontier_llm` (rakip model geliştirmeye yardımcı olabilecek istekler), `reasoning_extraction` (modelin iç akıl yürütmesini metne döktürmeye zorlayan istekler) ve `general_harms` (diğer kullanım politikası ihlalleri). Meşru güvenlik araştırması yapan ekipler için Anthropic'in Cyber Verification Program'a başvurma seçeneği var. Ayrıca advisor tool kullanıyorsanız, Sonnet 5.5 artık Claude Opus 4.8, Opus 4.7 ve Sonnet 5'i advisor olarak kabul etmiyor; desteklenen bir model (Opus 5, Opus 5.5, Sonnet 5.5, Fable 5.1 gibi) seçmeniz gerekiyor.

## Geçişi nasıl otomatikleştirebilirsiniz?

Claude Code içinden tek komutla kod tabanınızı tarayabilirsiniz:

```bash
/claude-api migrate this project to claude-sonnet-5-5
```

Bu komut model ID'sini değiştiriyor, kırılan parametreleri (prefill, zorlanmış tool seçimi, thinking budget) güncelliyor, efor seviyesini kalibre ediyor ve elle kontrol etmeniz gereken maddelerin listesini çıkarıyor. Hangi dizinde çalışacağını sormadan hiçbir dosyayı değiştirmiyor; Amazon Bedrock veya AWS üzerindeki Claude Platform istemcilerini de otomatik tespit edip model ID formatını ona göre ayarlıyor.

Elle geçiş yapıyorsanız sıralama şu: önce model ID'sini değiştirin, sonra yanıtları `type` alanına göre okuyun (çünkü artık `content[0]` bir `thinking` bloğu olabilir), ardından thinking bloklarını tool-use döngülerinde değiştirmeden geri gönderin. Son olarak efor seviyenizi yeniden test edin; Sonnet 5.5'in beş efor seviyesi Sonnet 4.5'teki budget_tokens değerleriyle birebir eşleşmiyor.

## Beklemenin maliyeti ne?

Buradaki asıl risk teknik değil, takvimle ilgili. Deprecated aşaması "hâlâ çalışıyor" dediği için ekipler genelde geçişi erteliyor — ta ki 30 Kasım'a bir hafta kala production'da 400 hataları patlayana kadar. Oysa `/claude-api migrate` komutu çoğu projede dakikalar içinde taslak bir geçiş çıkarıyor; kalan iş genelde efor seviyesini yeniden kalibre etmek ve prefill kullanan birkaç özel akışı yeniden yazmak. Bunu ilk haftadan yapmak, retirement tarihine bir gece kala yapmaktan çok daha ucuz. [Claude Opus 4.1'in emekliliğinde](/tr/posts/claude-opus-4-1-emekli-oldu-gecis-rehberi) de aynı örüntüyü görmüştük: erken geçiş yapanlar sadece model ID'sini değiştirip ilerlerken, geç kalanlar prod ortamında hata ayıklamak zorunda kaldı.

Thinking'in varsayılan olarak açık gelmesi de gözden kaçırılan bir nokta. Ajan tabanlı, çok adımlı iş akışlarınız varsa bu muhtemelen kaliteyi artırır; ama gecikmeye duyarlı bir chat arayüzü işletiyorsanız her istekte fazladan thinking token'ı ödemiş olursunuz. Bu yüzden geçişi sadece "model ID'sini değiştir" olarak değil, efor seviyesini iş yüküne göre yeniden ayarlama fırsatı olarak ele almakta fayda var. [Anthropic Python SDK v1.0'a geçerken](/tr/posts/anthropic-python-sdk-v1-gecis-rehberi) yaşanan kırılmalarda olduğu gibi, büyük sürüm değişiklikleri genelde tek bir ayarı değil, birkaç varsayımı aynı anda değiştiriyor.

Yapay zeka destekli kod üretiminin günlük iş akışınıza girdiği bu dönemde, hangi kodun gözden geçirmeye değer olduğunu belirlemek de ayrı bir disiplin gerektiriyor; bu konuyu [yapay zeka kodunu nasıl inceleyeceğinizi](/tr/posts/yapay-zeka-kodunu-review-etme) ele aldığımız yazıda ayrıca işledik. Diğer model geçişleri ve Claude güncellemeleri için [yapay zeka kategorimize](/tr/category/yapay-zeka) göz atabilirsiniz.

## Sıkça Sorulan Sorular

### Claude Sonnet 4.5 ne zaman tamamen kullanılamaz hale gelecek?

30 Kasım 2026'da. Model 30 Eylül 2026'dan beri "deprecated" durumda ve hâlâ çalışıyor, ama 30 Kasım'dan sonra `claude-sonnet-4-5-20250929` ID'sine giden istekler doğrudan hata dönecek.

### Sonnet 5.5'e geçişte hangi dört ayar hata veriyor?

Assistant prefill (konuşma artık bir kullanıcı mesajıyla bitmeli), zorlanmış tool seçimi (`tool_choice` tipi `tool` veya `any`), thinking budget_tokens (yerine `output_config.effort` kullanılıyor) ve eski `computer_20250124` aracı (yerine `computer_toolset_20260801` geliyor). Dördü de 400 hatasıyla reddediliyor.

### Sonnet 5.5, Sonnet 4.5'ten daha mı pahalı?

Hayır, daha ucuz: girdi 3 dolardan 2 dolara, çıktı 15 dolardan 10 dolara iniyor. Ama aynı metin Sonnet 5'in tokenizer'ı nedeniyle yaklaşık yüzde 30 daha fazla token ürettiği için toplam maliyeti yeniden ölçmeden "daha ucuz" sonucuna varmayın.

### Geçişi otomatik yapan bir araç var mı?

Evet. Claude Code içinde `/claude-api migrate this project to claude-sonnet-5-5` komutu model ID'sini, kırılan parametreleri ve efor kalibrasyonunu otomatik günceller, ardından elle kontrol etmeniz gereken maddelerin bir listesini çıkarır.
