---
title: "Claude Code'daki Code Mode Nedir?"
slug: "claude-code-code-mode-nedir"
translationKey: "claude-code-code-mode-launch"
locale: "tr"
excerpt: "Code Mode, Claude Code'un araçları tek tek çağırmak yerine JavaScript yazıp çalıştırdığı deneysel bir moddur; 12 Kasım 2026'da v2.1.323 ile opt-in olarak geldi."
category: "ai"
tags: ["claude", "mcp", "ai-agents", "automation"]
publishedAt: "2026-11-13"
seoTitle: "Claude Code Code Mode Nedir? Nasıl Çalışır?"
seoDescription: "Code Mode, Claude Code'un 12 Kasım 2026'da eklediği deneysel özellik: araçları tek tek çağırmak yerine JavaScript yazıp çalıştırıyor. Ne değişti, nasıl açılır?"
---

Kısa cevap: Code Mode, Claude Code'un 12 Kasım 2026'da yayımlanan v2.1.323 sürümüyle gelen deneysel bir ayar. Açıldığında Claude, araçları tek tek çağırmak yerine bir JavaScript betiği yazıp çalıştırıyor; betik birden fazla aracı art arda çağırıp sonuçları filtreliyor, sadece gerekli kısmı modele geri döndürüyor.

Bu, Claude Code'un [resmi değişiklik günlüğünde](https://code.claude.com/docs/en/changelog) "Code Mode, an experimental opt-in where Claude writes JavaScript to call its tools" cümlesiyle duyuruldu. Henüz genel kullanıma açık (GA) değil; bir deneysel ayar olarak sunuluyor.

## Code Mode neden eklendi?

Code Mode, normal araç çağırmanın bir darboğazını çözmek için var: her ara sonucun modelin bağlam penceresinden geçmesi. Anthropic bunu bir yıl önce kendi mühendislik yazısında ayrıntılandırmıştı.

4 Kasım 2025'te yayımlanan ["Code execution with MCP: Building more efficient agents"](https://www.anthropic.com/engineering/code-execution-with-mcp) başlıklı yazıda Anthropic, MCP araçlarını doğrudan çağırmak yerine ajana bu araçları kod API'leri gibi sunmayı ve ajanın bu API'lere karşı kod yazmasını önerdi. Yazıdaki bir örnekte bu yaklaşım, çok adımlı bir görevde token kullanımını yaklaşık 150.000'den 2.000'e indirdi — yüzde 98,7'lik bir düşüş. Sebebi basit: ara veriler modele değil, kodun çalıştığı ortamda kalıyor.

Benzer bir fikri Cloudflare da bağımsız olarak isimlendirmişti. Kenton Varda ve Sunil Pai'nin 26 Eylül 2025 tarihli ["Code Mode: the better way to use MCP"](https://blog.cloudflare.com/code-mode/) yazısı, MCP araçlarını bir TypeScript API'sine dönüştürüp modele bu API'ye karşı kod yazdırmayı öneriyordu. Claude Code'daki özellik aynı ismi taşıyor ve aynı temel mantığı izliyor.

## Code Mode normal araç çağırmadan nasıl farklı?

Normal modda Claude her adımda tek bir aracı çağırır, sonucu bağlamına alır, sonra bir sonraki adıma karar verir. Beş aracı sırayla çağırmak beş ayrı tur ve beş tam sonuç seti demektir. Code Mode'da Claude bunun yerine, beş aracı da çağıran, sonuçları filtreleyen ve süzülmüş veriyi döndüren tek bir JavaScript betiği yazar.

| Özellik | Normal araç çağırma | Code Mode |
|---|---|---|
| Araç çağrısı sayısı (adım başına) | Bir | Betik içinde birden fazla |
| Ara sonuçların konumu | Modelin bağlamından geçer | Çalışma ortamında kalır |
| Token kullanımı (örnek görev) | ~150.000 | ~2.000 |
| Olgunluk (Kasım 2026) | Varsayılan, kararlı | Deneysel, opt-in |

Fark en çok çok adımlı, veri ağırlıklı görevlerde hissediliyor: bir API'den yüzlerce kayıt çekip filtreleyen, birden fazla MCP sunucusunu zincirleyen ya da büyük bir JSON çıktısını işleyen görevler. Tek bir dosyayı okuyup küçük bir düzenleme yapan basit görevlerde fark fark edilmeyecek kadar küçük.

```javascript
// Code Mode mantığının basitleştirilmiş örneği
const sonuclar = await Promise.all(
  araclar.map((arac) => arac.calistir(girdi))
);
const ozet = sonuclar
  .filter((r) => r.basarili)
  .map((r) => r.veri.slice(0, 5)); // sadece gerekli kısmı döndür
return ozet;
```

## Code Mode nasıl açılır?

Code Mode, Claude Code'un değişiklik günlüğünde "deneysel opt-in" olarak tanımlanıyor; yani varsayılan olarak kapalı ve bilerek açmanız gerekiyor. Tam ayar adını ve komut satırı bayrağını değişiklik günlüğü netleştirmiyor, dolayısıyla kesin söz dizimini tahmin etmek yerine [Claude Code değişiklik günlüğünü](https://code.claude.com/docs/en/changelog) ve [resmi sürüm notlarını](https://docs.claude.com/en/release-notes/overview) kontrol etmek en güvenli yol. Deneysel bir ayar olduğu için önce ikincil bir projede denemek, üretim iş akışınıza hemen taşımamak mantıklı.

Claude Code'un araç ekosistemine zaten aşinaysanız, Code Mode'u [MCP sunucularını yönetme](/tr/posts/claude-code-mcp-sunucularini-nasil-yonetirsin) bilginizin bir uzantısı gibi düşünebilirsiniz; aradaki fark artık ajanın bu sunuculara tek tek değil, yazdığı kod üzerinden erişmesi.

## Code Mode hangi görevlerde fark yaratır?

Code Mode'un faydası, görev başına kaç araç çağrısı yapıldığına ve ara verinin ne kadar büyük olduğuna bağlı. Birkaç somut örnek:

- **Çok kaynaklı araştırma:** Beş farklı API'den veri çekip birleştiren bir görevde, normal modda beş tam sonuç seti bağlama girer; Code Mode'da sadece birleştirilmiş özet girer.
- **Toplu dosya işleme:** Yüzlerce dosyayı tarayıp belirli bir deseni arayan bir görevde, her dosyanın tam içeriği değil, eşleşen satırlar modele döner.
- **Zincirleme MCP çağrıları:** Bir MCP sunucusunun çıktısını bir başkasına girdi olarak veren akışlarda, ara dönüşüm adımları betik içinde kalır.

Tek dosya okuma, tek satır düzenleme gibi düşük adımlı görevlerde ise fark pratikte sıfıra yakın; Code Mode'u her görevde zorunlu kılmak gereksiz karmaşıklık ekler.

Bu desenin yaygınlaşması tesadüf değil. 2026'da ajanların tek bir göreve harcadığı adım sayısı arttıkça, bağlam penceresine giren ham veri miktarı da büyüdü; çok adımlı bir araştırma görevi artık kolayca onlarca araç çağrısına çıkabiliyor. Code Mode gibi yaklaşımlar, bu büyümeyi token maliyeti doğrusal artırmadan karşılamanın bir yolu.

## Code Mode'un bilinen riskleri neler?

Araçları koda dönüştürüp modele kod yazdırmanın kendi riskleri var. Benzer uygulamalardaki kamuya açık dokümantasyon, bu deseni değerlendirirken iki noktaya işaret ediyor: yetkilendirme (permission) kontrolünün tek bir kod çalıştırma adımına uygulanması, iç içe geçmiş her araç çağrısına ayrı ayrı uygulanmasından farklı bir güvenlik yüzeyi oluşturuyor; bu nedenle sandbox'lama ve izleme, geleneksel tek-tek araç çağırmaya göre daha fazla dikkat gerektiriyor. Bu, Code Mode'a özgü bir kusur değil, "ajan kod yazıp çalıştırsın" deseninin doğal sonucu — ve deneysel aşamada kalmasının asıl nedeni muhtemelen bu.

Pratik sonuç: Code Mode'u açtığınızda, betiğin hangi araçlara erişebildiğini ve hangi verilere dokunduğunu normal zamandan daha dikkatli izlemek gerekiyor. Dosya sistemine veya ağa erişimi olan araçlarla çalışıyorsanız bu, "deneysel" etiketini ciddiye almanın tam karşılığı. Üretim ortamında kullanmadan önce, betiğin erişebildiği araç listesini daraltmak ve çalıştırma ortamını izole tutmak, bu riski azaltmanın en pratik yolu.

## Code Mode'u şimdi açmalı mısınız?

Deneysel bir özelliği üretim ajanlarına hemen açmak, özellikle yetkilendirme (permission) davranışını henüz tam bilmediğiniz bir özellik için riskli. Bizim görüşümüz: Code Mode, token-ağır, çok adımlı görevleriniz varsa denemeye değer, ama kritik bir CI hattında ya da müşteriye bakan bir ajanda bugünden varsayılan hale getirmek için henüz erken — Anthropic'in kendi notu da "deneysel" diyor.

Code Mode'un arkasındaki fikir yeni değil; [AI agent mı workflow mu](/tr/posts/ai-agent-mi-workflow-mu) sorusuna verdiğiniz cevaba bağlı olarak, bu modun hangi görevlerde gerçekten fayda getireceğini daha net görürsünüz. Ajanınızın araçları nasıl çağırdığını izlemek istiyorsanız, [Claude Code mods](/tr/posts/claude-code-mods-nedir) ile davranışı gözlemlemek de bir seçenek.

## Sıkça Sorulan Sorular

### Code Mode ne zaman çıktı?

Code Mode, Claude Code'un 12 Kasım 2026 tarihli v2.1.323 sürümüyle geldi. Değişiklik günlüğü bunu "deneysel opt-in" bir özellik olarak tanımlıyor; yani varsayılan olarak kapalı geliyor ve kararlı (stable) sürüm değil.

### Code Mode ile normal araç çağırma arasındaki temel fark nedir?

Normal araç çağırmada Claude her aracı tek tek çağırır ve her sonucu kendi bağlamına alır. Code Mode'da Claude bunun yerine birden fazla aracı çağıran bir JavaScript betiği yazar; ara sonuçlar çalışma ortamında kalır, modele sadece gerekli özet döner.

### Code Mode token kullanımını ne kadar azaltıyor?

Anthropic'in Kasım 2025 tarihli mühendislik yazısındaki bir örnekte, kod yazma yaklaşımı çok adımlı bir görevde token kullanımını yaklaşık 150.000'den 2.000'e indirdi; bu yüzde 98,7'lik bir düşüş. Gerçek kazanç görevin veri hacmine ve adım sayısına göre değişir.

### Code Mode'u Claude Code dışında başka araçlar da kullanıyor mu?

Evet. Cloudflare 2025'te benzer bir yaklaşımı aynı isimle tanıttı; Docker Agent, Vercel AI SDK ve bazı açık kaynak ajan çerçeveleri de araçları kod API'si gibi sunan kendi "code mode" deneysel özelliklerini ekledi. Claude Code'daki uygulama aynı temel mantığı izliyor.
