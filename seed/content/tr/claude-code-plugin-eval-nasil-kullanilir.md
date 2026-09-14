---
title: "Claude Code'da plugin eval Nasıl Kullanılır?"
slug: "claude-code-plugin-eval-nasil-kullanilir"
translationKey: "claude-code-plugin-eval-explained"
locale: "tr"
excerpt: "claude plugin eval, Claude Code eklentinizi gerçek kullanıcı promptlarıyla üç kez çalıştırır, eklentisiz temel çizgiyle karşılaştırır ve CI'da skor eşiği koyar."
category: "ai"
tags: ["claude", "ai-coding", "testing", "developer-experience"]
publishedAt: "2026-09-14"
seoTitle: "claude plugin eval Nasıl Kullanılır? Claude Code Rehberi"
seoDescription: "Claude Code v2.1.269'daki plugin eval komutunu, altı grader tipini ve eklentisiz temel çizgiyi (baseline) örneklerle, CI kurulumuyla birlikte anlatıyoruz."
---

Kısa cevap: `claude plugin eval`, Claude Code eklentinizi gerçek kullanıcı promptlarıyla üç kez çalıştırır, sonucu eklentisiz aynı promptla karşılaştırır ve aradaki farkı (Δ) skorlar. 11 Eylül 2026'da Claude Code 2.1.269 ile genel kullanıma açıldı ve artık `claude plugin eval init` ile birkaç dakikada bir test paketi yazabiliyorsunuz.

Bu komuma kadar bir eklenti veya skill'in gerçekten işe yaradığını kanıtlamanın yolu yoktu; sadece "bende çalıştı" diyebiliyordunuz. `claude plugin eval`, üç soruya somut cevap veriyor: skill doğru ifadede tetikleniyor mu, bir düzenlemeden veya yeni bir modelden sonra hâlâ çalışıyor mu ve eklentisiz çıplak modelden gerçekten daha iyi mi?

## claude plugin eval ne yapar?

Komut, eklentinizin `evals/` klasöründeki test senaryolarını (case) çalıştırır ve her birini bir veya daha fazla grader ile puanlar. Her senaryo, kullanıcının yazabileceği gerçekçi bir prompt artı en az bir doğrulama kuralından oluşuyor; grader bir regex, bir tool çağrısı kontrolü veya ikinci bir modelin verdiği rubrik puanı olabilir.

Senaryoları elle yazmanıza gerek yok: `claude plugin eval init` eklentinizi okuyor, hangi promptların skill'i tetiklemesi gerektiğini soruyor, graderleri tasarlıyor, bir kez deniyor ve `evals/` altına dosyaları yazıyor.

## Eklentisiz temel çizgi (no-plugin baseline) neden önemli?

Bir senaryo yüksek puan alsa bile bu, eklentinin işe yaradığı anlamına gelmez; Claude eklenti olmadan da aynı sonucu üretebilir. Bunu ayırt etmek için her senaryo varsayılan olarak iki kez çalışıyor: eklenti yüklüyken (`WITH`) ve eklenti yokken (`W/OUT`). Aralarındaki fark `Δ` (delta), eklentinin gerçek katkısını gösteriyor.

```text
CASE        WITH  W/OUT Δ      RUNS COST    NOTES
first-case  1.00  0.33  +0.67  6    $0.41

1 case(s) · mean Δ +0.67 · 74s · $0.41
Report: /Users/you/my-plugin/evals/results/2026-09-10T17-02-11-482Z/report.html
```

Bir senaryo hem eklentiyle hem eklentisiz 1.00 alıyorsa, eklenti o senaryoyu geçirmemiş demektir; yani `Δ` sıfıra yakınsa, önce grader'ı değil skill'in `description` alanını şüpheli görün.

## Altı grader tipi ne işe yarar?

Dört grader (`regex`, `tool_used`, `tool_order`, `file_exists`) transkript ve dosyalardan hesaplanıyor ve ücretsiz; `llm` ve `baseline` ise bir yargıç modeli çağırıyor ve maliyete ekleniyor. `tool_used` grader'ı, belirli bir aracın (ör. `Skill`) kaç kez ve hangi girdiyle çağrıldığını regex ile doğruluyor; `llm` grader'ı ise serbest metin bir rubrik üzerinden üç oydan en az ikisiyle PASS/FAIL veriyor.

| Grader | Ne kontrol eder | Maliyet |
|---|---|---|
| `regex` | Transkript veya dosyada desen arar | Ücretsiz |
| `tool_used` | Bir aracın çağrılıp çağrılmadığını, girdisini | Ücretsiz |
| `tool_order` | İki aracın çağrılma sırasını | Ücretsiz |
| `file_exists` | Belirli bir yolda dosya oluşup oluşmadığını | Ücretsiz |
| `llm` | Serbest rubrik üzerinden yargıç modeli oyu | Model çağrısı |
| `baseline` | Referans bir transkriple karşılaştırma | Model çağrısı |

Uzun çıktılar için (üretilen bir dosya gibi) `regex` kullanmak, `llm` grader'ına göre çok daha kararlı bir sinyal veriyor; çünkü yargıç modeli aynı metni her seferinde biraz farklı değerlendirebiliyor.

## CI'da nasıl kapı (gate) kurulur?

`--threshold` bayrağı, bir senaryonun geçmesi için gereken minimum skoru belirliyor (varsayılan 1.0); eşiğin altında kalan herhangi bir senaryo, komutu çıkış kodu 1 ile bitiriyor. `--trust-plugin` bayrağı CI'da ilk çalıştırmadaki onay isteğini atlıyor, `--max-cost-usd` ise liste fiyatı üzerinden bir maliyet tavanı koyuyor.

```bash
claude plugin eval . \
  --trust-plugin \
  --json results.json \
  --threshold 0.8 \
  --model claude-sonnet-5 \
  --judge-model claude-haiku-4-5 \
  --no-publish \
  --max-cost-usd 20
```

Bu komut, `results.json` dosyasını arşivlemek için yazıyor, skorları zaman içinde karşılaştırılabilir tutmak için hem test edilen modeli hem yargıç modelini sabitliyor ve raporu yerel tutuyor. Çıkış kodu 0 her şeyin eşiği geçtiğini, 2 ise maliyet tavanının veya kimlik doğrulama hatasının çalıştırmayı yarıda kestiğini gösteriyor.

## Bu neden [Claude Code Subagent](/tr/posts/claude-code-subagent-arka-plan-ajanlari) ve [Claude Skills](/tr/posts/claude-skills-nedir-herkes-icin) için önemli?

Skill'lerin ve subagent'ların güvenilirliği, tetiklenme doğruluğuna bağlı: bir skill'in `description`'ı yanlış ifade edilirse Claude onu hiç çağırmayabilir. Şimdiye kadar bunu test etmenin tek yolu manuel denemeydi; artık `tool_used: Skill` grader'ı ile "bu skill doğru promptta tetiklendi mi" sorusunu otomatik hâle getirebiliyorsunuz. [MCP bağlayıcısı](/tr/posts/ilk-mcp-baglayicini-yaz-2026) yazan ekipler için de MCP araçlarını mock'layıp gerçek sunucu olmadan senaryo çalıştırmak mümkün; `evals/mocks/<server>/<tool>.md` altına bir dosya koymak yeterli.

Kişisel görüşüm şu: bu komutun asıl değeri skor tablosundan çok, ekiplerin eklenti değişikliklerini artık [AI ile kod incelemesi](/tr/posts/ai-ile-kod-incelemesi-guven-dogrula) yaparken uyguladığımız "güven ama doğrula" disiplinine zorlaması. Bir skill'i CI'da gate etmeden production'a sürmek, testsiz bir fonksiyonu deploy etmekle aynı risk sınıfına giriyor.

## Kurulum ve gereksinimler neler?

`claude plugin eval` için Claude Code 2.1.269 veya üstü, bir `plugin.json` manifestosu içeren eklenti klasörü ve normal Claude Code oturumlarınızda kullandığınız aynı kimlik doğrulama gerekiyor. Her çalıştırma modeli gerçekten çağırdığı için plan kullanım limitinize veya API faturanıza sayılıyor; komut bir maliyet raporladığında bu, [maliyet dokümantasyonundaki](https://code.claude.com/docs/en/costs) liste fiyatı üzerinden bir tahmin.

| Adım | Komut |
|---|---|
| Sürüm kontrolü | `claude --version` |
| Güncelleme | `claude update` |
| Senaryo oluşturma | `claude plugin eval init` |
| Paketi çalıştırma | `claude plugin eval .` |
| Tek senaryo, tek çalıştırma | `claude plugin eval . --case <ad> --runs 1 --ablation none` |

## Rapor dosyasında neye bakmalısınız?

Her çalıştırma, `results/<zaman-damgası>/` altına bir `report.html` ve bir `aggregate-result.json` yazıyor; `report.html` dışarıya hiçbir istek atmayan, tek dosyalık bir rapor olduğu için CI job'ınıza dosya olarak ekleyebilir veya diskten açabilirsiniz. Raporun üst kısmı, senaryonun genel skorunu, temel çizgiye göre farkı ve eşiği geçen senaryo sayısını özetliyor; her senaryo kartı kendi `Δ` değerini ve eşik çizgisini gösteren bir skor çubuğu taşıyor, negatif `Δ` alan bir senaryo kırmızı kenarlıkla öne çıkıyor. claude.ai aboneliğiniz varsa rapor otomatik olarak özel bir artifact olarak yayınlanıyor ve komut çıktısında `Published:` satırıyla bir bağlantı veriyor; `--no-publish` bayrağıyla bunu yerelde tutabilirsiniz.

## Eklenti pazarında evals nasıl bir güven sinyali oluyor?

Bir eklenti veya skill'i paylaşırken artık sadece "işe yarıyor" demek yerine, `Δ` değerini ve eşiği geçen senaryo sayısını gösterebiliyorsunuz; bu, [Claude Skills](/tr/posts/claude-skills-nedir-herkes-icin) ekosisteminde büyüyen bir beklenti hâline geliyor. Bir marketplace'e eklenti gönderirken `aggregate-result.json` dosyasını ekleyip "bu eklenti çıplak modelden ortalama 0.4 puan daha iyi" gibi somut bir iddia yapmak, kullanıcıya "bende çalıştı" demekten çok daha güçlü bir kanıt sunuyor. Aynı disiplin, ekip içi eklentiler için de geçerli: bir skill'i başka bir ekibe devrederken evals paketini birlikte teslim etmek, o ekibin skill'i neyin bozacağını tahmin etmesini kolaylaştırıyor.

Bunun bir maliyeti de var: her çalıştırma gerçek model çağrıları yaptığı için, sık commit atan bir ekip CI faturasının büyüdüğünü fark edebilir. `--ablation none` ile temel çizgi karşılaştırmasını her commit'te değil, örneğin sadece ana dala (main) birleşme öncesi çalıştırmak, maliyeti kontrol altında tutan pratik bir orta yol.

## Sıkça Sorulan Sorular

### claude plugin eval ücretsiz mi?

Hayır, kısmen değil. `regex`, `tool_used`, `tool_order` ve `file_exists` graderleri hesaplama tabanlı olduğu için ücretsiz; ama her senaryo çalıştırması gerçek bir model çağrısı olduğundan plan kullanım limitinize veya API faturanıza sayılıyor, `llm` ve `baseline` graderleri ise ayrıca yargıç modeli çağrısı ekliyor.

### Eklentisiz temel çizgiyi (baseline) kapatabilir miyim?

Evet. `--ablation none` bayrağı yalnızca eklentiyle çalışan kolu (with-arm) çalıştırıyor ve maliyeti yarıya indiriyor; karşılaştırma farkına (Δ) ihtiyacınız olmadığında, örneğin grader'ları hızlıca iyileştirirken kullanışlı.

### claude plugin eval'i CI'da nasıl zorunlu kılarım?

`--threshold` ile minimum skoru, `--trust-plugin` ile onay isteğini atlamayı, `--max-cost-usd` ile maliyet tavanını ayarlayıp `--json results.json` ile sonucu dosyaya yazarsınız; eşiğin altında kalan herhangi bir senaryo komutu çıkış kodu 1 ile bitirdiği için CI job'ı otomatik olarak kırmızı olur.

### Bu komut hangi Claude Code sürümünden itibaren mevcut?

Claude Code 2.1.269 ve sonrası, 11 Eylül 2026'dan beri. Daha eski bir sürümde `claude plugin eval` "early access" hatası veriyor; `claude update` çalıştırıp yeni bir oturumda tekrar denemeniz yeterli.
