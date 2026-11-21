---
title: "Claude Code'un Easel Modu Nedir?"
slug: "claude-code-easel-grafik-modu"
translationKey: "claude-code-easel-mod-2026"
locale: "tr"
excerpt: "Easel, Claude Code'a 20 Kasım 2026'da eklenen ve terminalde grafik çizen yerleşik bir moddur; Pro, Max, Team ve Enterprise planlarında kullanılabilir."
category: "software-engineering"
tags: ["claude", "developer-experience", "automation", "productivity"]
publishedAt: "2026-11-21"
seoTitle: "Claude Code Easel Modu Nedir? (2026)"
seoDescription: "Easel, Claude Code'a 20 Kasım 2026'da eklenen ve terminalde grafik çizen yerleşik bir moddur; Pro, Max, Team ve Enterprise planlarında kullanılabilir."
---

Kısa cevap: Easel, Claude Code'un 20 Kasım 2026'da yayınlanan 2.1.330 sürümüyle gelen yerleşik bir moddur ve Claude'un terminal içinde doğrudan grafik çizmesini sağlar. macOS ve Linux'ta Pro, Max ile kullanılabildiği yerlerde Team ve Enterprise planlarında çalışır; Windows için changelog'da ayrı bir destek belirtilmemiştir. Easel, Claude Code'un altyapısındaki "mod" sistemi üzerine kuruludur.

## Easel modu tam olarak ne yapar?

Easel açıldığında Claude, kod çalıştırma veya veri analizi sırasında ürettiği sayısal sonuçları terminaldeki bir panelde grafiğe döker. Bu, çıktıyı okumak için ayrı bir tarayıcı sekmesi açmaya veya PNG dosyası üretmeye gerek kalmadan, sohbetin yanında canlı bir görsel takip imkanı verir.

Panel, geniş bir tam ekran terminalde transkriptin yanında bir kenar çubuğu olarak; daha dar pencerelerde ise komut satırının üstünde çerçeveli bir alan olarak belirir. Panelin açılması kendiliğinden bir şey çizmez — Claude Code bir `ui.render` olayı tetikler ve modun içine ne çizileceğini bu olay belirler.

Pratikte bu şu anlama geliyor: bir veri setini analiz ederken Claude'dan sonuçları özetlemesini istediğinizde, önceden sadece metin tablosu veya Markdown çıktısı alırdınız. Easel açıkken aynı istek, terminalin yanında güncellenen bir çubuk veya çizgi grafiğine dönüşebilir. Bu, özellikle log analizi, performans ölçümü veya A/B test sonuçları gibi sayısal ağırlıklı işlerde, çıktıyı başka bir araca kopyalamadan hızlıca göz atmayı kolaylaştırıyor.

## Easel hangi Claude Code modlarıyla aynı altyapıyı kullanıyor?

Easel, Claude Code'un genel "mod" sisteminin bir örneğidir. Mod'lar, Claude Code'un davranışını veya arayüzünü değiştiren küçük TypeScript fonksiyonlarıdır ve eklentiler (plugin) içinde dağıtılır. Mod'lar Claude Code 2.1.287'den itibaren varsayılan olarak etkindir, dolayısıyla Easel'i kullanmak için ek bir ayar açmanıza genelde gerek yoktur.

Mod'lar sadece panel eklemekle sınırlı değildir; bir araç çağrısının satırını, yükleme animasyonunu (spinner) veya izin/soru diyaloğunun görünümünü de yeniden biçimlendirebilirler. Burada önemli bir sınır var: mod'lar izin isteminin kendisini değiştiremez — yani bir mod, Claude'un dosya silme veya komut çalıştırma izni istediği anı atlatamaz veya gizleyemez.

İlgili bir başka yetenek de özel tema desteğidir. `$.theme.set` çağrısı bir arka plan/renk temasını etkinleştirir, `$.theme.clear` ise kaldırır; `theme-examples` eklentisi hazır başlangıç temaları sunar ve Claude, yazılı bir açıklamadan da yeni bir tema üretebilir. Tema özelliği Claude Code 2.1.319 veya sonrası gerektirir — Easel'den biraz önce gelmiş bir yetenektir.

Mod'ların eklentiler içinde dağıtılması önemli bir ayrıntı: Easel'i kullanmak istemeyen bir geliştirici, ilgili eklentiyi devre dışı bırakarak terminalini olabildiğince sade tutabilir. Aynı mekanizma, şirket içi ekiplerin kendi grafik veya tema mod'larını yazıp dağıtmasına da izin veriyor; dolayısıyla Easel, Anthropic'in sunduğu tek örnek olsa da mod sisteminin ne tür özellikler üretebileceğine dair bir referans niteliğinde.

## Easel modu nerede çalışır, nerede çalışmaz?

Easel ve genel olarak mod'ların çizdiği panel/arayüz öğeleri, terminalde ve masaüstü uygulamasının "Code" sekmesinde çalışır. Buna karşılık VS Code içinde, `claude -p` ile çalıştırılan yazdırma (print) modunda ve Agent SDK üzerinden özel arayüz öğeleri hiç render edilmez. Bu, Easel'i deneyecek geliştiricilerin önce doğru ortamda olup olmadıklarını kontrol etmesi gereken pratik bir ayrıntıdır.

Projenizde Claude Code'u VS Code eklentisi üzerinden kullanıyorsanız Easel'in grafik çıktısını göremezsiniz; aynı iş akışını terminalde veya masaüstü uygulamasında tekrarlamanız gerekir. Bu sınırlama, mod sisteminin VS Code'un kendi arayüz katmanına değil, Claude Code'un terminal render motoruna bağlı olmasından kaynaklanıyor; yani kısa vadede VS Code tarafında bir "Easel paneli" beklemek gerçekçi değil.

## 2.1.330 sürümünde başka ne değişti?

Easel, 20 Kasım 2026 tarihli 2.1.330 sürümünün tek yeniliği değil. Aynı sürümde Anthropic'in Enterprise Admin Console üzerinden yönetilen organizasyonlar için oturum açma desteği, tekrarlanan zamanlanmış görevlerin ve `/loop` komutunun artık 7 gün yerine 30 güne kadar çalışabilmesi, VS Code için yeni `/fork` ve `/workflows` komutları ve 98 hata düzeltmesi de yer aldı.

| Değişiklik | Ne işe yarar | Platform/plan notu |
|---|---|---|
| Easel modu | Terminalde canlı grafik çizimi | macOS, Linux; Pro/Max/Team/Enterprise |
| Enterprise Admin Console oturum açma | Kurumsal SSO ile giriş | Enterprise yönetimli organizasyonlar |
| 30 güne kadar `/loop` ve zamanlanmış görevler | Uzun süreli otomasyon döngüleri | Önceki sınır 7 gündü |
| VS Code `/fork`, `/workflows` | Oturum dallama ve iş akışı yönetimi | VS Code eklentisi |
| 98 hata düzeltmesi | Genel kararlılık | Tüm platformlar |

Bu tablo, tek bir sürümün görsel bir özellikten kurumsal kimlik doğrulamaya kadar ne kadar geniş bir yelpazeye dokunabildiğini gösteriyor; Claude Code'u takip eden ekipler için changelog'u haftalık okumak hâlâ en ucuz bilgi kaynağı. Özellikle zamanlanmış görevlerin 30 güne uzaması, uzun süreli izleme veya raporlama görevleri kuran ekipler için Easel'den daha az görünür ama operasyonel açıdan en az onun kadar değerli bir değişiklik.

## Basit bir mod örneği nasıl görünür?

Aşağıdaki kod, bir mod'un panel kaydedip `ui.render` olayına nasıl yanıt verebileceğini gösteren basitleştirilmiş bir örnektir. Gerçek API isimleri değişebileceğinden, üretim koduna geçmeden önce resmi dokümantasyonla karşılaştırmanız gerekir.

```typescript
// Basitleştirilmiş, açıklayıcı amaçlı örnek
export default function myMod($) {
  $.panel.register("chart-panel", {
    onRender: (event) => {
      if (event.type === "ui.render") {
        return { kind: "chart", data: event.payload.series };
      }
    },
  });
}
```

Kendi değerlendirmem: Easel'in haber değeri "grafik çizebilme" özelliğinden çok, Claude Code'un terminal arayüzünü genişletilebilir bir platforma dönüştürme kararında. Bir sohbet aracının eklenti ekosistemi kazanması, tek bir özellikten daha kalıcı bir yön değişikliği.

## Easel modunu nasıl denerim?

Easel'i denemek için Claude Code'u 2.1.330 veya üzeri bir sürüme güncelleyin ve macOS ya da Linux'ta terminal üzerinden çalıştırın; mod sistemi varsayılan olarak açık olduğundan ek bir kurulum adımı genelde gerekmez. Sürümünüzü kontrol etmek için:

```bash
claude --version
```

Sürüm 2.1.330'dan düşükse önce `claude update` (veya kullandığınız paket yöneticisinin güncelleme komutu) ile yükseltme yapmanız, ardından terminali yeniden başlatmanız yeterli; Easel ek bir lisans anahtarı veya ayrı bir kurulum dosyası gerektirmiyor.

Easel'in daha geniş mod ekosistemi içindeki yerini, Claude Code'un [effort parametresi](/tr/posts/claude-code-effort-parametresi-nedir) gibi diğer ayarlarla birlikte değerlendirmek isterseniz, günlük iş akışınızı nasıl şekillendirdiğini daha iyi görebilirsiniz. Benzer şekilde [AGENTS.md desteği](/tr/posts/claude-code-agents-md-destegi) de aynı sürüm çizgisinde ilerleyen bir diğer geliştirici deneyimi iyileştirmesi.

## Sıkça Sorulan Sorular

### Easel modu hangi Claude Code sürümünde geldi?

Easel, 20 Kasım 2026'da yayınlanan Claude Code 2.1.330 sürümüyle geldi. Özelliği kullanmak için Claude Code'unuzu en az bu sürüme güncellemeniz gerekir; `claude --version` komutuyla mevcut sürümünüzü kontrol edebilirsiniz.

### Easel modu hangi planlarda ve platformlarda çalışır?

Easel, Pro ve Max planlarında, ayrıca kullanılabildiği yerlerde Team ve Enterprise planlarında çalışır; desteklenen işletim sistemleri macOS ve Linux'tur. Windows için changelog'da ayrı bir destek ifadesi bulunmuyor.

### Easel modu VS Code'da çalışır mı?

Hayır, Easel'in panel tabanlı grafik çıktısı VS Code içinde görüntülenmez. Mod'ların çizdiği özel arayüz öğeleri sadece terminalde ve masaüstü uygulamasının "Code" sekmesinde render edilir; `claude -p` yazdırma modunda ve Agent SDK'da da görünmez.

### Mod'lar Claude Code'un izin isteklerini değiştirebilir mi?

Hayır, mod'lar bir aracın satır görünümünü, yükleme animasyonunu veya diyalog çerçevesini yeniden biçimlendirebilir ama izin isteminin kendisini değiştiremez. Bu sınır, Claude'un dosya silme veya komut çalıştırma gibi riskli eylemler öncesinde her zaman standart bir onay adımından geçmesini güvence altına alır.

Kaynaklar: [Claude Code changelog](https://code.claude.com/docs/en/changelog), [Mods genel bakış](https://code.claude.com/docs/en/plugins/mods/overview), [Claude Code mods blog yazısı](https://claude.com/blog/claude-code-mods). Claude Code'u diğer araçlarla kıyaslamak isterseniz [Claude Code, Cursor, Antigravity karşılaştırmasına](/tr/posts/claude-code-cursor-antigravity-2026) veya [yazılım mühendisliği kategorisine](/tr/category/yazilim-muhendisligi) göz atabilirsiniz.
