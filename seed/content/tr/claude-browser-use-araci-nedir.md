---
title: "Claude Browser Use Aracı Nedir?"
slug: "claude-browser-use-araci-nedir"
translationKey: "claude-browser-use-tool-ga"
locale: "tr"
excerpt: "Claude'un browser use aracı 19 Ağustos 2026'da GA oldu: sayfayı ekran görüntüsü yerine erişilebilirlik ağacından okuyarak tarayıcıyı yönetiyor."
category: "ai"
tags: ["claude", "ai-agents", "automation"]
publishedAt: "2026-08-22"
seoTitle: "Claude Browser Use Aracı: GA Detayları (Ağu 2026)"
seoDescription: "Anthropic'in browser use aracı 19 Ağustos 2026'da GA oldu. browser_toolset_20260801 ne yapar, computer use'dan farkı nedir ve nasıl çağrılır, hepsi burada."
---

Claude'un browser use aracı, `browser_toolset_20260801` adlı bir API araç setidir; Claude'un kendi uygulamanızın çalıştırdığı bir tarayıcıda gezinmesini ve işlem yapmasını sağlar — sayfayı sadece ekran görüntüsünden değil, erişilebilirlik ağacı, form alanları ve sekmeler üzerinden okuyarak. Anthropic bu aracı 19 Ağustos 2026'da computer use aracı ve Agent Skills API ile birlikte beta'dan çıkardı.

## Browser Use Aracı Tam Olarak Ne Yapıyor?

Claude'a `navigate`, `read_page`, `left_click`, `type`, `screenshot`, `scroll`, `find` gibi alt araçlar veriyor; bunlar Anthropic'in sunucularında değil, sizin uygulamanızın kontrol ettiği bir tarayıcıda çalışıyor. Varsayılan olarak 27 alt araç açık geliyor; `javascript_exec`, `file_upload`, `read_console`, `read_network` ise isteğe bağlı olarak eklenebiliyor. Claude ayrıca doğrudan işlem yapabileceği etiketli eleman referansları (`[ref_2]` gibi), yerleşik çoklu sekme yönetimi (`new_tab`, `switch_tab`, `close_tab`) ve simüle yazma yapmadan form alanlarını dolduran bir `form_input` eylemi alıyor.

Araç bir döngü olarak çalışıyor: Claude bir alt araç çağrısı döndürüyor, sizin kodunuz bunu gerçek tarayıcıda çalıştırıyor ve sonucu Claude'a geri gönderiyor — Claude düz metinle yanıt verene kadar bu döngü sürüyor. Sayfa içeriği ve ağ trafiği Anthropic'in sunucularından geçmiyor; tarayıcıyı barındıran ve neye erişebileceğini belirleyen sizin altyapınız.

## Computer Use Aracından Farkı Ne?

Computer use, ekran görüntüleri ve piksel koordinatları üzerinden tüm masaüstünü kontrol ediyor; browser use ise tek bir tarayıcı görünümüyle sınırlı ve sayfanın kendi yapısını okuyor. Bu tek fark, modelin "işlem yapması"nın ne anlama geldiğini kökten değiştiriyor.

| | Browser use | Computer use |
| --- | --- | --- |
| Araç seti sürümü | `browser_toolset_20260801` | `computer_toolset_20260801` |
| Kapsam | Tek bir tarayıcı görünümü | Tüm masaüstü/işletim sistemi |
| Ne görür | Erişilebilirlik ağacı + DOM elemanları + ekran görüntüsü | Sadece ekran görüntüsü |
| Nasıl işlem yapar | Eleman referansı, `form_input`, koordinat | Sadece koordinat |
| Sekmeler | Yerleşik (`new_tab`, `switch_tab`, `close_tab`) | Yok |
| Barındırma | Uygulamanızın tarayıcısı | Uygulamanızın masaüstü |

Piksellerden tahmin etmek yerine DOM'u okumak, dinamik sayfa düzenlerinde daha az yanlış tıklama demek; küçük metni okumak için yakınlaştırmaya da gerek kalmıyor çünkü bir form alanı, pencere yeniden boyutlandığında kayan bir ekran koordinatıyla değil, kendi referansıyla adreslenir.

## Hangi Claude Modellerinde Çalışıyor?

`browser_toolset_20260801` ve `computer_toolset_20260801`, 19 Ağustos 2026 itibarıyla Claude API üzerinden Claude Fable 5, Claude Mythos 5, Claude Opus 5, Claude Sonnet 5 ve Claude Opus 4.8'de kullanılabiliyor. Destek şimdilik yalnızca API ile sınırlı — Amazon Bedrock, Google Vertex AI veya Microsoft Foundry'de henüz yok. Bu iş yükü için hangi modeli seçeceğinize karar veremiyorsanız [Claude model rehberimiz](/tr/posts/hangi-claude-modeli-2026-rehberi) güncel model ailesini karşılaştırıyor.

## Browser Use Aracı Nasıl Çağrılır?

Araç setini, herhangi bir aracı eklediğiniz gibi Messages API isteğine ekliyorsunuz; dönen araç çağrılarını da kontrolünüzdeki bir tarayıcıda çalıştırıyorsunuz (Playwright ve Puppeteer ikisi de çalışıyor — Anthropic'in SDK örnekleri Playwright kullanıyor):

```json
{
  "model": "claude-sonnet-5",
  "max_tokens": 1024,
  "tools": [
    {
      "type": "browser_toolset_20260801",
      "name": "browser"
    }
  ],
  "messages": [
    {
      "role": "user",
      "content": "Staging ödeme sayfamıza git ve indirim kodu alanının BLACKFRIDAY25'i kabul ettiğini doğrula."
    }
  ]
}
```

Claude, `navigate` ve `find` gibi alt araç çağrılarıyla yanıt veriyor; kodunuz her birini gerçek tarayıcı oturumunda çalıştırıp sonucu (ekran görüntüsü, eşleşen eleman referansı ya da durum) bir sonraki istekte geri gönderiyor. Beta başlığı gerekmiyor — daha önce entegre ettiyseniz eski beta sürümleri de çalışmaya devam ediyor.

## Aynı Gün GA Olan Başka Ne Var?

19 Ağustos 2026, Anthropic'in agent yığını için tek bir özellik değil, koordineli bir sürüm günüydü:

- **Computer use** (`computer_toolset_20260801`) toplu eylem desteği (tek turda birden fazla eylem), varsayılan olarak açık `zoom` ve araç bazlı `configs` ile beta'dan çıktı.
- **Agent Skills ve Skills API** (`/v1/skills`) beta'dan çıktı — artık `skills-2025-10-02` beta başlığı gerekmiyor. Skills'in geliştirici olmayanlar için ne anlama geldiğini [Claude Skills, Herkes İçin Anlatıldı](/tr/posts/claude-skills-nedir-herkes-icin) yazımızda ele aldık.
- **Files API** de aynı gün GA oldu; bunu ayrı bir yazıda ele almıştık: [Claude'un Files API'si GA Oldu, Ne Anlama Geliyor](/tr/posts/claude-files-api-ga-ne-anlama-geliyor).

Dördünün aynı gün çıkması, Anthropic'in "tarayıcı + masaüstü + skill + dosya"yı kendi takvimlerinde olgunlaşan dört ayrı beta değil, tek bir tutarlı agent araç seti olarak gördüğünü gösteriyor.

Aynı 19 Ağustos güncellemesinde iki küçük ama üretimdeki agent'lar için önemli değişiklik daha vardı: Claude Managed Agents'ta artık bir agent'ın `web_search` ve `web_fetch` araçlarının hangi sitelere erişebileceğini `allowed_domains` ve `blocked_domains` ile sınırlayabiliyorsun, ve Claude Console'daki oturum görüntüleyici; zaman çizelgesi mini haritası, model isteğine göre gruplanmış transkript ve maliyet/ham olay/araç istatistiklerini gösteren bir Inspector paneliyle yeniden tasarlandı. İkisi de tek başına manşet olacak büyüklükte değil, ama bir agent'ı üretime alırken günlük olarak dokunacağın türden pratik iyileştirmeler.

## Playwright veya Puppeteer ile Kurulum Nasıl Görünür?

Anthropic'in SDK örnekleri Playwright kullanıyor, ama araç seti belirli bir kütüphaneye bağımlı değil — Claude'un döndürdüğü her alt araç çağrısını (bir `navigate`, bir `left_click`, bir `screenshot`) kendi tarayıcı otomasyon katmanına çeviren bir "executor" yazman yeterli. Pratikte bu, mevcut bir Playwright test paketin ya da tarayıcı otomasyon script'in varsa, Claude'u bunun üzerine ince bir çeviri katmanıyla bağlayabileceğin, sıfırdan bir tarayıcı entegrasyonu yazmana gerek kalmadığı anlamına geliyor.

## OpenAI ve Google'ın Yaklaşımından Farkı Ne?

Anthropic'in bahsi şu: Claude'un yönettiği tarayıcıyı sizin uygulamanız barındırmalı, böylece sayfa içeriği ve ağ kimliği kendi altyapınızda kalır. Bu, OpenAI ve Google'ın agentic tarayıcı çalışmalarında ağırlık verdiği tamamen sağlayıcı sunucularında barındırılan agent tarayıcı modelinden farklı bir mimari tercih (bkz. [yapay zeka tarayıcıları karşılaştırmamız](/tr/posts/yapay-zeka-tarayicilari-karsilastirma) ve [OpenAI'ın Atlas tarayıcısının kapanışı](/tr/posts/openai-atlas-kapaniyor-ai-tarayici) sonrası agentic tarama özelliklerinin ChatGPT'ye geri taşınması). İki yaklaşım da kesin olarak birbirinden üstün değil — istemci tarafında barındırılan tarayıcı, hassas oturum çerezlerini ve iç URL'leri üçüncü bir tarafın altyapısı dışında tutarken, sağlayıcı tarafında barındırılan tarayıcı sizin tarafınızda sıfır kurulum gerektiriyor.

## Geliştiriciler İçin Ne Anlama Geliyor?

Zaten üretimde computer use çalıştırıyorsanız yeni `computer_toolset_20260801`'e geçmek size toplu eylem ve varsayılan zoom kazandırıyor ama istek yapısını değiştiriyor — araç seti dizesini değiştirmeden önce Anthropic'in geçiş notlarını okuyun. Yeni bir tarayıcı otomasyonu agent'ı kuruyorsanız, `browser_toolset_20260801` neredeyse kesinlikle computer use'a göre daha iyi bir başlangıç noktası: piksel düzeni sabit olmayan herhangi bir sayfada — ki bu pratikte neredeyse her modern web uygulaması demek — DOM farkında işlemler koordinat tıklamalarından daha güvenilir.

Belirtilmesi gereken ödünleşim şu: Claude yalnızca sizin çalıştırıcınızın tarayıcısının gördüğünü gördüğü için, kimlik doğrulama, proxy ve hız sınırları hâlâ sizin sorumluluğunuzda — araç etkileşimi otomatikleştiriyor, çevresindeki altyapıyı değil.

## Sıkça Sorulan Sorular

### Claude API'sindeki browser use aracı nedir?

`browser_toolset_20260801` adlı, 27 varsayılan ve 4 isteğe bağlı alt araçtan oluşan bir settir; Claude'un kendi uygulamanızın barındırdığı bir tarayıcıda sayfayı yalnızca ekran görüntüsünden değil, erişilebilirlik ağacı ve DOM elemanlarından okuyarak gezinmesini ve işlem yapmasını sağlar.

### Claude'un browser use aracı ne zaman GA oldu?

Anthropic, 19 Ağustos 2026'da bu aracı, computer use aracı ve Agent Skills API ile aynı gün beta'dan çıkardı.

### Browser use, computer use'un yerini alıyor mu?

Hayır. Browser use tek bir tarayıcı görünümüyle sınırlı ve sayfa yapısını okuyor; computer use ise ekran görüntüleri ve koordinatlar üzerinden tüm masaüstünü kontrol ediyor. Sadece web'de kalan işler için browser use'u, iş akışı tarayıcı dışındaki masaüstü uygulamalarına da uzanıyorsa computer use'u seçin.

### Browser use aracını hangi modeller destekliyor?

Ağustos 2026 itibarıyla Claude API üzerinden Claude Fable 5, Claude Mythos 5, Claude Opus 5, Claude Sonnet 5 ve Claude Opus 4.8 destekliyor. Amazon Bedrock, Google Vertex AI veya Microsoft Foundry'de henüz mevcut değil.
