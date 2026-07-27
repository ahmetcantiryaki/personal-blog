---
title: "Claude Code'da İç İçe Alt Ajanlar: Yasaktan Derinlik 3'e"
slug: "claude-code-ic-ice-alt-ajanlar-derinlik-3"
translationKey: "claude-code-nested-subagents-depth-3"
locale: "tr"
excerpt: "Claude Code, iç içe alt ajan üretimini 21 Temmuz'da varsayılan kapattı, 24 Temmuz'da derinlik 3 ile yeniden açtı. Dört günlük değişimin ekipler için anlamı."
category: "ai"
tags: ["claude", "ai-agents", "developer-experience", "automation"]
publishedAt: "2026-07-27"
seoTitle: "Claude Code İç İçe Alt Ajanlar: Derinlik 3 Değişimi"
seoDescription: "Claude Code, iç içe alt ajan üretimini 21 Temmuz'da varsayılan kapattı, 24 Temmuz'da derinlik 3 ile yeniden açtı. Dört günlük değişimin ekipler için anlamı."
---

Claude Code'da alt ajanların (subagent) kendi alt ajanlarını üretmesi, 21 Temmuz 2026'da v2.1.217 ile varsayılan olarak tamamen kapatıldı; 24 Temmuz'da v2.1.219 ile derinlik 3 varsayılanıyla yeniden açıldı. Dört gün içinde yasaktan sınırlı serbestliğe geçen bu karar, çok ajanlı orkestrasyon kuran her ekibi doğrudan ilgilendiriyor.

## Dört Günlük Zaman Çizelgesi

Değişim tek bir sürümde değil, art arda gelen küçük ayarlamalarla oldu. Aşağıdaki tablo, 17-25 Temmuz arasındaki ilgili sürümleri özetliyor:

| Sürüm | Tarih | Değişiklik |
| --- | --- | --- |
| v2.1.212 | 17 Temmuz | Oturum başına 200 alt ajan tavanı (`CLAUDE_CODE_MAX_SUBAGENTS_PER_SESSION`), `/clear` ile sıfırlanıyor |
| v2.1.217 | 21 Temmuz | Alt ajanlar varsayılan olarak iç içe alt ajan üretemez hale geldi; eşzamanlı alt ajan tavanı 20'ye çekildi (`CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS`) |
| v2.1.218 | 22 Temmuz | `--max-budget-usd` artık arka plan alt ajanlarını da gerçekten durduruyor: tavana ulaşınca yeni üretim reddediliyor, çalışanlar durduruluyor |
| v2.1.219 | 24 Temmuz | İç içe üretim varsayılan derinlik 3'e çıktı (`CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH=1` ile kapatılabilir); `stream-json`'da derinlik-2+ alt ajan metni iletimi eklendi |
| v2.1.220 | 25 Temmuz | Hata düzeltmeleri ve kararlılık iyileştirmeleri |

Bu, [Claude Code'un kaçak ajan döngülerine karşı Temmuz ortasında getirdiği tavanların](/tr/posts/claude-code-kacak-ajanlara-fren) doğal devamı. O yazıda ele aldığımız 200'lük oturum tavanı ve 200 WebSearch sınırı hâlâ geçerli; buraya eklenen, aynı seviyede yatay büyümeyi değil, dikey olarak kaç kat derine inilebileceğini kontrol eden ayrı bir mekanizma.

## Neden Önce Kapatıldı, Sonra Sınırlı Açıldı

v2.1.217'nin notu açık: alt ajanlar "varsayılan olarak artık iç içe alt ajan üretmiyor." Bu, tek bir mesajın kontrolsüz şekilde katlanarak büyüyen bir ajan ağacına dönüşmesini tamamen engelleyen sert bir çözümdü — ama aynı zamanda [alt ajan ve arka plan ajanları rehberimizde](/tr/posts/claude-code-subagent-arka-plan-ajanlari) anlattığımız meşru devretme (delegation) desenlerini de kırdı: bir araştırmacı ajanın kendi alt-araştırmacılarını başlatması gibi.

Üç gün sonra Anthropic bunu geri gevşetti ama sıfıra değil, üçe. Bu, "hiç iç içe geçme yok" ile "sınırsız iç içe geçme" arasında bilinçli bir orta nokta. Derinlik 3, çoğu gerçek dünya orkestrasyon deseni için yeterli — bir ana ajan, onun başlattığı bir koordinatör ajan, koordinatörün başlattığı uzman ajanlar — ama dördüncü seviyeye inip kendi kendini çoğaltan bir zincire izin vermiyor.

### Neden Bu Tasarım Kararını Doğru Buluyorum

Bana kalırsa asıl ilginç olan üç ayrı sınırın artık aynı anda çalışıyor olması: eşzamanlılık (varsayılan 20), oturum başına toplam (varsayılan 200) ve derinlik (varsayılan 3). Bunlar birbirini tamamlıyor çünkü her biri farklı bir patlama biçimini engelliyor — eşzamanlılık tek seferde kaç ajanın paralel çalıştığını, oturum tavanı toplam token faturasını, derinlik ise zincirin ne kadar uzayabileceğini sınırlıyor. Tek bir gevşek tavan yerine üç dar tavanın birlikte çalışması, [çok ajanlı orkestrasyon kalıplarında](/tr/posts/cok-ajanli-orkestrasyon-kaliplari) bahsettiğimiz "bir ajan yanlış anlar, üç tane daha alt görev başlatır" senaryosunu üç farklı noktada durdurabiliyor.

## Ekipler İçin Pratik Etkisi

`isolation: 'worktree'` ile paralel çalışan araştırma ajanları kuran ya da [otomatik mod](/tr/posts/claude-code-auto-mode-nasil-calisir) altında gözetimsiz görevler çalıştıran ekipler için üç şey değişti:

Birincisi, derinlik-3 devretme zincirleri artık varsayılan yapılandırmada çalışıyor; önceden `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` ayarlamadan çalışmayan orkestrasyon script'leri şimdi ek yapılandırma olmadan çalışabilir. İkincisi, `--max-budget-usd` artık gerçekten işe yarıyor: bütçe tavanına ulaşan bir oturum, sadece yeni ajan üretimini reddetmiyor, o an çalışan arka plan ajanlarını da durduruyor. Üçüncüsü, `stream-json` çıktısını izleyen gözlemlenebilirlik araçları, derinlik-2 ve ötesindeki alt ajanların metnini artık `--forward-subagent-text` bayrağıyla görebiliyor — önceden bu görünürlük sadece birinci seviye alt ajanlarla sınırlıydı.

Dört seviyeden fazla derinlik gerektiren bir iş akışınız varsa (nadiren gerekli olsa da), `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` değerini elle yükseltmeniz gerekiyor; varsayılan 3 sizi durdurur.

```bash
# Derinlik sınırını 5'e çıkar, eşzamanlılığı 10'a düşür
export CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH=5
export CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS=10

# Bütçe tavanıyla çalıştır — tavana ulaşınca yeni üretim reddedilir,
# çalışan arka plan ajanları durdurulur
claude --max-budget-usd 5.00 "Depoyu tara ve güvenlik açıklarını raporla"
```

## Aynı Haftanın Diğer Değişikliği: Opus 5

Aynı 24 Temmuz sürümünde (v2.1.219) Anthropic, [Claude Opus 5'i](/tr/posts/claude-opus-5-geldi) de varsayılan Opus modeli yaptı ve `/fast` modunu artık yalnızca Opus 5 ile Opus 4.8'e uyguluyor — Opus 4.7 hızlı moddan kaldırıldı. Bunun tesadüf olmadığını düşünüyorum: daha büyük bağlam penceresine ve daha ucuz token fiyatına sahip bir model, daha derin ajan zincirlerini ekonomik olarak daha savunulabilir kılıyor. Anthropic muhtemelen bu iki değişikliği bilinçli olarak aynı haftaya denk getirdi.

## Üç Somut Senaryo Üzerinden Etki

Bu değişikliğin soyut kalmaması için üç yaygın kullanım deseni üzerinden düşünmek faydalı.

**Kod inceleme fan-out'u:** Bir ana ajan, değişen her dosya için bir inceleyici alt ajan başlatıyor, o inceleyiciler de kendi bulgularını doğrulamak için birer test-çalıştırıcı alt ajan açıyor. Bu iki seviyelik bir zincir, yani derinlik 2 — hem eski (derinlik 1) hem yeni (derinlik 3) varsayılanla çalışırdı, ama 21-24 Temmuz arasındaki kısa pencerede tamamen kırılırdı.

**Araştırma senteziyle koordinasyon:** Bir koordinatör ajan, konuyu üç alt başlığa bölüp her biri için bir araştırmacı alt ajan başlatıyor; araştırmacılardan biri konuyu daha da daraltıp kendi alt araştırmacısını açıyor. Bu, derinlik 3'e ulaşan bir desen — tam olarak yeni varsayılanın izin verdiği üst sınır. Böyle bir iş akışı kuran bir ekip, 21-24 Temmuz arasında sessizce bozulmuş, sonra sessizce düzelmiş olabilir; hata mesajı almadan.

**Gece boyu çalışan otomasyon:** CI'da ya da zamanlanmış bir görevde çalışan, gözetimsiz bir Claude Code oturumu, dört ya da beş seviyelik bir devretme zinciri kurmaya çalışıyorsa, yeni varsayılan (3) hâlâ yetersiz kalır ve `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` değerinin elle yükseltilmesi gerekir — aksi halde zincir sessizce kesilir, hata fırlatmadan sadece o seviyedeki devretme çalışmaz.

Buradan çıkan pratik ders şu: derinlik varsayılanlarına bağımlı bir orkestrasyon script'iniz varsa, sürüm notlarını takip etmek isteğe bağlı bir alışkanlık değil, üretim kararlılığının bir parçası haline geliyor. Ekip içinde bu tür varsayılanlara bağımlı script'leri kimin izlediğini net bir şekilde belirlemek, dört günlük gibi kısa bir pencerede fark edilmeyen bir kırılmanın haftalarca sürmesini önlüyor. Küçük bir ekipte bu genellikle tek bir kişinin sorumluluğu oluyor; büyüyen bir ekipte ise sürüm notlarını izleyen bu rolün açıkça tanımlanması, aynı sürprizi ikinci kez yaşamamak için ucuz bir yatırım.

## Sıkça Sorulan Sorular

### Mevcut Claude Code kurulumum bu değişiklikten etkilenecek mi?

Sadece iç içe alt ajan devretme desenleri kullanıyorsanız etkilenir. `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` değerini elle ayarlamadıysanız, artık varsayılan olarak derinlik 3'e kadar iç içe üretim çalışıyor; bu değeri 1 yaparak eski (iç içe geçme yok) davranışa dönebilirsiniz.

### Derinlik 3 sınırı, oturum başına 200 alt ajan tavanıyla aynı şey mi?

Hayır, ikisi farklı boyutları sınırlıyor. Oturum tavanı (200), bir oturumda toplam kaç alt ajan başlatılabileceğini; derinlik sınırı (3) ise bir devretme zincirinin dikey olarak kaç kat derine inebileceğini kontrol ediyor. Bir ajan aynı derinlikte 50 kardeş alt ajan başlatabilir ve bu hâlâ derinlik 1'de kalır; oturum tavanı bu durumda devreye giren asıl fren.

### `--max-budget-usd` neden v2.1.218'de değişti?

Önceki davranışta bütçe tavanına ulaşıldığında yalnızca yeni alt ajan üretimi reddediliyordu ama o an arka planda çalışmakta olan ajanlar durmuyordu — bu da tavanın aşılmasına izin veriyordu. v2.1.218, tavana ulaşınca çalışan arka plan ajanlarını da gerçekten durdurarak bu boşluğu kapattı.

### Bu değişiklikler nerede resmi olarak belgeleniyor?

Sürüm notları `code.claude.com/docs/en/changelog` adresinde ve `anthropics/claude-code` deposundaki `CHANGELOG.md` dosyasında yayınlanıyor; her sürüm numarası ve tarih doğrudan oradan alınabilir.
