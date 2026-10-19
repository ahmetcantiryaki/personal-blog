---
title: "Claude Fast Mode Nedir? Opus 5.5'te Artık Herkese Açık"
slug: "claude-fast-mode-opus-5-5-genel-kullanimda"
translationKey: "claude-fast-mode-ga-opus-5-5-2026"
locale: "tr"
excerpt: "Claude Fast Mode, Opus 5.5'te 15 Ekim 2026'dan beri bekleme listesi istemiyor; çıkış hızı 2,5 kata kadar artıyor, milyon token başına girdi/çıktı 8/40 dolar."
category: "ai"
tags: ["claude", "llm", "pricing", "ai-tools"]
publishedAt: "2026-10-19"
seoTitle: "Claude Fast Mode GA: Fiyat ve Limitler"
seoDescription: "Opus 5.5 için Fast Mode artık herkese açık: beta başlığı yok, bekleme listesi yok, çıkış hızı 2,5 kata kadar artıyor, milyon token başına 8/40 dolar."
---

Kısa cevap: 15 Ekim 2026'dan beri Claude Opus 5.5'te Fast Mode için bekleme listesine girmeye ya da `fast-mode-2026-02-01` beta başlığı göndermeye gerek yok; Messages API isteğine `speed: "fast"` eklemek yetiyor. Fiyat yine de standarda göre daha yüksek — milyon token başına girdi 8 dolar, çıktı 40 dolar — ve hızlanma yalnızca çıkış token hızında, yanıtın ilk token'a çıkma süresinde değil.

## 15 Ekim 2026'da ne değişti?

Anthropic'in o tarihli [sürüm notları](https://platform.claude.com/docs/en/release-notes/overview), Fast Mode'un Claude Opus 5.5 için "araştırma önizlemesinden çıktığını" ve artık "`fast-mode-2026-02-01` beta başlığına gerek kalmadığını" söylüyor. O tarihten önce Fast Mode'a erişen her modelde bir hesap yöneticisinden erişim istemek veya bekleme listesine girmek gerekiyordu. Şimdi Claude Opus 5.5, Start, Build ve Scale kullanım katmanlarında varsayılan bir Fast Mode hız limitiyle geliyor; bu üç katmandaki her kuruluş bugün aradaki onay adımı olmadan `speed: "fast"` gönderip yanıt alabiliyor. Evaluation katmanındaki kuruluşların önce bir üst katmana geçmesi, hatta tamamen kullanabilmek için geçmesi gerekiyor; Claude Opus 5 ve Claude Opus 4.8 için Fast Mode hâlâ bekleme listesi ve beta başlığı arkasında — yani bu GA muamelesi şimdilik tüm Opus serisine değil, özellikle 5.5 modeline özgü.

## Fast Mode tam olarak ne yapıyor?

Fast Mode, aynı model ağırlıklarını daha hızlı bir çıkarım (inference) yapılandırmasıyla çalıştırıyor — daha küçük veya damıtılmış bir model değil. Anthropic'in dokümantasyonu "zekada veya yeteneklerde değişiklik yok" diyor net bir şekilde. Belgelenen kazanç, standart hıza kıyasla saniyede çıkış token sayısında (OTPS) 2,5 kata kadar artış. Bu kazanç üretimin başında değil, üretim sürecinde ortaya çıkıyor: Fast Mode, ilk token'a çıkma süresini (TTFT) değil OTPS'yi iyileştiriyor; yani tek satırlık bir cevap pek farklı hissettirmez, ama uzun, akan bir yanıt — bir refactor, bir rapor, çok dosyalı bir diff — fark edilir ölçüde daha erken biter.

## Fast Mode ne kadar pahalı?

Fast Mode, desteklenen her model için standart fiyatın tam olarak 2 katı sabit bir çarpan uyguluyor; bu çarpan, 200K girdi token'ını aşan istekler dahil, tüm bağlam penceresi boyunca geçerli.

| Model | Standart girdi / çıktı (milyon token) | Fast Mode girdi / çıktı (milyon token) |
|---|---|---|
| Claude Opus 5.5 | 4$ / 20$ | 8$ / 40$ |
| Claude Opus 5 | 5$ / 25$ | 10$ / 50$ |
| Claude Opus 4.8 | 5$ / 25$ | 10$ / 50$ |

Prompt önbellekleme ve veri yerleşimi (data residency) çarpanları, seçtiğiniz hızın üzerine ekleniyor — ayrıca hız değiştirmek önbelleği geçersiz kılıyor, çünkü farklı hızlardaki istekler önbellekteki önekleri paylaşmıyor. Burada gerçek bir maliyet tuzağı var: Fast Mode'u bir istekte açıp sonrakinde kapatmak, tasarruf etmek yerine önbellek yazma faturanızı ikiye katlıyor.

```bash
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-opus-5-5",
    "max_tokens": 4096,
    "speed": "fast",
    "messages": [{"role": "user", "content": "Bu modülü dependency injection kullanacak şekilde yeniden düzenle"}]
  }'
```

Yanıttaki `usage.speed` alanı, isteğin gerçekten `"fast"` mi çalıştığını yoksa `"standard"`a mı düştüğünü gösteriyor — ödediğiniz prim karşılığında gerçekten hız alıp almadığınızı denetlemek için kullanışlı.

## Fast Mode'u nerede kullanabilirsiniz?

Claude Opus 5.5 için Fast Mode, birinci taraf Claude API'de (Claude Managed Agents oturumları dahil) ve Azure üzerinde barındırılan dağıtımlar için Claude in Microsoft Foundry'de çalışıyor. [Anthropic'in Fast Mode dokümantasyonuna](https://platform.claude.com/docs/en/build-with-claude/fast-mode) göre, Claude Platform on AWS'de, Microsoft Foundry'nin Anthropic altyapısında barındırılan dağıtımlarında, Batch API ile veya bir Priority Tier taahhüdüyle birlikte açıkça desteklenmiyor. İş yükünüz bugün bu yollardan biri üzerinden çalışıyorsa, `speed: "fast"` sessizce standarda düşmek yerine hata döndürür; bu yüzden üretim koduna bağlamadan önce dağıtım yolunuzu kontrol etmeye değer.

## Gerçek bir istekte maliyet farkı nasıl görünüyor?

Claude Opus 5.5'te 3.000 token'lık bir yanıt üreten bir kodlama asistanı çağrısını ele alalım. Standart hızda bu çıktı 0,06 dolara mal oluyor (3.000 token × milyon token başına 20 dolar). Fast Mode fiyatında aynı çıktı 0,12 dolara mal oluyor (3.000 token × milyon token başına 40 dolar) — aynı cevap için iki katı fiyat, ama tam 2,5 katlık OTPS kazancına ulaşırsanız sürenin yalnızca %40'ında tamamlanıyor. Günde binlerce böyle çağrı yapan bir ekip için bu fark hızla gerçek bir bütçe kalemine dönüşüyor; Anthropic'in Fast Mode harcamasını standart hız harcamasından ayrı izlemenize izin veren ayrı hız limiti başlıkları (`anthropic-fast-output-tokens-remaining` gibi) sunmasının nedeni de tam olarak bu — bunu ay sonunda faturada fark etmek yerine.

## Fast Mode'un ek maliyetine değer mi?

Bu, gecikme bütçenizin hangi yarısının darboğaz olduğuna bağlı. Darboğazınız ilk token'a çıkma süresiyse — sohbet arayüzünde ilk kelimenin ekrana gelmesini beklemek gibi — Fast Mode yardımcı olmaz, çünkü Anthropic'in kendi dokümantasyonu kazancı saniyedeki çıkış token sayısıyla sınırlıyor. Darboğazınız uzun çıktılarda toplam üretim süresiyse — 3.000 token'lık bir plan yazan bir ajan, transkriptleri özetleyen bir toplu iş, tam bir dosya üreten bir kodlama asistanı — token başına maliyeti ikiye katlamak karşılığında 2,5 kata kadar hız almak, kendi rakamlarınıza göre modellenebilecek basit bir takas: ortalama çıktı uzunluğunuzu ve süresini tahmin edin, sonra 2,5 katlık bir hızlanmanın kullanıcıya görünen bekleme süresini 2 katlık harcamayı haklı çıkaracak kadar değiştirip değiştirmediğine bakın. Mantıklı bir varsayılan: Fast Mode'u kullanıcıların gerçekten uzun bir yanıtı beklediği belirli uç noktalara ayırın, toplu veya arka plan işlerini standart hızda bırakın — zira o işler için kimse bir ilerleme çubuğunu izlemiyor.

## Benim yorumum

Opus 5.5 için bekleme listesinin kalkması, hız rakamının kendisinden daha önemli bir detay — bir hesap yöneticisinin açması gereken kısıtlı bir beta, tasarım ortakları dışında kimse tarafından kullanılmaz; varsayılan olarak açık bir hız limiti ise üretimde gecikme şikâyeti alan her ekip tarafından gerçek yük altında test edilir. Önümüzdeki aylarda Fast Mode'un token başına maliyet tartışmalarında çok daha sık geçmesini bekleyin — tam olarak denemenin önündeki engel kalktığı için.

İlgili okuma: Opus dışı katmanın fiyat ve hızda nasıl karşılaştırıldığını görmek için [Claude Sonnet 5.5 mi GPT-6.1 Sol mu?](/tr/posts/claude-sonnet-5-5-vs-gpt-6-1-sol-karsilastirma) yazımıza, dizinin daha ucuz ucu için [Claude Haiku 5.5 Nedir?](/tr/posts/claude-haiku-5-5-nedir-fiyat-hiz) yazımıza, tam da bu tür prim harcamasını takip etmek için [Yapay Zeka Token Harcamasını Nasıl Görünür Kılarsınız?](/tr/posts/yapay-zeka-finops-token-harcamasi) yazımıza ve `speed: "fast"`ı mevcut bir entegrasyona bağlıyorsanız [Anthropic Python SDK v1.0'da Neler Bozuluyor?](/tr/posts/anthropic-python-sdk-v1-gecis-rehberi) yazımıza bakabilirsiniz. Daha fazlası için [Yapay Zeka](/tr/category/yapay-zeka) kategorimize göz atın.

## Sıkça Sorulan Sorular

### Claude Opus 5.5'te Fast Mode için beta başlığı gerekiyor mu?
Hayır. 15 Ekim 2026'dan beri Claude Opus 5.5, `fast-mode-2026-02-01` beta başlığına veya bekleme listesine ihtiyaç duymuyor; Messages API isteğine doğrudan `speed: "fast"` eklemek yeterli. Eski başlığı göndermeye devam eden istekler değişiklik yapılmadan çalışmaya devam ediyor.

### Claude Fast Mode ne kadara mal oluyor?
Fast Mode, standart fiyatın sabit 2 katı: Claude Opus 5.5'te milyon token başına girdi/çıktı 4$/20$'dan 8$/40$'a çıkıyor, Claude Opus 5 ve Opus 4.8'de 5$/25$'tan 10$/50$'ye çıkıyor; bu çarpan tüm bağlam penceresi boyunca geçerli.

### Fast Mode kısa sorulara daha mı hızlı cevap veriyor?
Belirgin bir şekilde değil. Fast Mode'un belgelenen kazancı saniyede çıkış token sayısında 2,5 kata kadar artış, ilk token'a çıkma süresinde değil; dolayısıyla hızlanma kısa cevaplarda değil, uzun ve akan yanıtlarda en görünür.

### Fast Mode'u AWS'de veya Batch API ile kullanabilir miyim?
Hayır. Fast Mode, Claude Platform on AWS'de, Batch API isteklerinde veya bir Priority Tier taahhüdüyle birlikte desteklenmiyor. Şu an yalnızca birinci taraf Claude API'de ve Opus 5.5 için Azure üzerinde barındırılan dağıtımlarda Claude in Microsoft Foundry'de çalışıyor.
