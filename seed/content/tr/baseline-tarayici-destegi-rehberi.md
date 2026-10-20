---
title: "Tarayıcı Desteğini Tahmin Etmeyi Bırakın: Baseline"
slug: "baseline-tarayici-destegi-rehberi"
translationKey: "web-platform-baseline-guide-2026"
locale: "tr"
excerpt: "Kısa cevap: Web Platform Baseline, bir özelliğin tüm büyük tarayıcılarda çalıştığını tek bir etiketle söyler. 'Widely available' = en az 30 ay önce yaygınlaştı."
category: "web-development"
tags: ["web-standards", "css", "best-practices", "developer-experience"]
publishedAt: "2026-10-20"
seoTitle: "Web Platform Baseline Nedir? 2026 Rehberi"
seoDescription: "caniuse tablolarını tek tek kontrol etmek yerine Baseline nasıl kullanılır? Newly vs Widely farkı, 30 aylık kural, MDN rozetleri ve ESLint entegrasyonu."
---

Kısa cevap: Web Platform Baseline, bir web özelliğinin Chrome, Edge, Firefox ve Safari'nin masaüstü ve mobil sürümlerinde çalışıp çalışmadığını tek bir etiketle ("newly available" ya da "widely available") özetleyen bir sistem. "Widely available" etiketi, o özelliğin en az 30 ay önce tüm bu tarayıcılarda desteklendiği anlamına geliyor — yani polyfill'siz kullanmak genelde güvenli.

## Web Platform Baseline Nedir?

Baseline, caniuse tablosunu satır satır okuyup "bu özellik hangi tarayıcı sürümünden itibaren var" sorusunu kendiniz cevaplamanız gereken eski yöntemin yerine geçiyor. Web.dev'in tanımına göre bir özellik, çekirdek tarayıcı kümesinin tamamında (masaüstü Safari, macOS ve iOS Safari, masaüstü ve Android Firefox, masaüstü ve Android Chrome, masaüstü Edge) desteklenmeye başladığı anda "newly available" (yeni yaygınlaşan) statüsüne geçiyor. Mobil tarayıcıların bu kümeye dahil edilmesi, Baseline'ın güncel tanımının önemli bir parçası — artık sadece masaüstü desteği yeterli değil.

## Newly ve Widely Available Arasındaki Fark Ne?

Bir özellik çekirdek tarayıcı kümesinde desteklenmeye başladığı anda "newly available" olur ama bu, herkesin tarayıcısının güncel olduğu anlamına gelmiyor — kullanıcıların bir kısmı hâlâ eski sürümlerde. Web.dev'in Baseline tanım güncellemesine göre bir özellik, bu "newly" anından **30 ay sonra** "widely available" statüsüne geçiyor. 30 aylık eşik keyfi değil: web.dev, çoğu özelliğin bu süre içinde küresel kullanıcıların yaklaşık %95'ine ulaştığını gösteren kullanım verisine dayandığını belirtiyor.

| Statü | Anlamı | Pratik Sonucu |
|---|---|---|
| Newly available | Çekirdek tarayıcıların tamamında yeni desteklendi | Çoğu kullanıcıda çalışır, polyfill önerilir |
| Widely available | Newly'den 30+ ay geçti | ~%95 küresel erişim, polyfill'siz güvenli |
| Limited availability | Henüz tüm çekirdek tarayıcılarda yok | Feature detection veya polyfill zorunlu |

## Baseline Rozetlerini Nerede Görürsünüz?

MDN Web Docs, her web API ve CSS özelliğinin sayfasında bir Baseline rozeti gösteriyor; rozet doğrudan "newly available" ya da "widely available" etiketini taşıyor, böylece ayrı bir caniuse sayfasına gitmenize gerek kalmıyor. web.dev'in kendi Baseline sayfası da aynı veriyi görsel bir panoda sunuyor ve hangi yılın "Baseline" setine hangi özelliklerin girdiğini (örneğin "Baseline 2026") listeliyor.

Pratikte bu, bir özelliği kullanmadan önce atacağınız adımı değiştiriyor. Eskiden "bu CSS özelliği hangi tarayıcılarda var" diye arama yapıp caniuse'daki sürüm sütunlarını tek tek okumanız gerekiyordu; şimdi MDN sayfasının en üstündeki rozete bakmanız yetiyor. Rozet yeşilse ve "widely available" diyorsa karar bitmiş demektir; "newly available" diyorsa bir sonraki bölümdeki soruyu sormanız gerekiyor.

## Baseline Yıllık Setleri Ne İşe Yarar?

web.dev her yıl bir "Baseline <yıl>" seti yayınlıyor — o takvim yılı itibarıyla "widely available" statüsüne ulaşmış özelliklerin bir listesi. "Baseline 2026" setini hedef almak, projenizin hangi özellikleri güvenle kullanabileceğine dair ekip içinde ortak bir referans noktası oluşturuyor; "biz Baseline 2024'ü hedefliyoruz" demek, "IE11'i desteklemiyoruz" demekten çok daha kesin ve ölçülebilir bir ifade. Bu yıllık setler, bir ürünün minimum tarayıcı desteği politikasını yazılı hale getirmenin de en kolay yolu.

## Baseline'ı Linting'e Nasıl Bağlarsınız?

Rozete bakıp karar vermek yeterli değilse, Baseline verisini doğrudan derleme sürecinize sokabilirsiniz. 2025 Baseline Tooling Hackathon'ının birincisi **eslint-plugin-baseline-js** (3ru/eslint-plugin-baseline-js deposu), kaynak kodunuzdaki JavaScript özelliklerini tespit edip hedeflediğiniz Baseline seviyesinden (newly, widely ya da belirli bir Baseline yılı) daha yeni olanları işaretliyor. Araç, web-features veri setini referans alıyor ve ESLint'in kendisiyle, ayrıca eslint-plugin-es-x ile entegre çalışıyor. web.dev ayrıca ESLint'in artık CSS kodunu da kontrol edip Baseline CSS özelliklerinin kullanımını zorunlu kılabildiğini belirtiyor.

```json
{
  "rules": {
    "baseline-js/compat": ["error", { "target": "widely" }]
  }
}
```

Bu yapılandırma, ekibinizin yalnızca "widely available" özellikleri kullanmasını zorunlu kılar; bir geliştirici henüz "newly available" aşamasında olan bir API'yi kullanmaya çalıştığında derleme zamanında uyarı alır.

## Bir Özelliği Polyfill'siz Göndermek Ne Zaman Güvenli?

Kuralı basitleştirirsek: hedef kullanıcı tabanınız genel internet kullanıcı profiline yakınsa, "widely available" statüsündeki bir özelliği polyfill'siz göndermek güvenli kabul edilir çünkü o özellik zaten ~%95 küresel erişime ulaşmış durumda. "Newly available" statüsündeki bir özellik için karar daha incelikli: kullanıcı tabanınızın tarayıcı/sürüm dağılımını biliyorsanız ve çoğunluk güncel tarayıcı kullanıyorsa risk alabilirsiniz; bilmiyorsanız ya feature detection ekleyin ya da "widely" eşiğini bekleyin.

Kurumsal iç araçlar gibi tarayıcı dağılımı dar ve bilinen ortamlarda bu eşik daha erken geçilebilir — şirket içi bir Chrome politikası varsa "newly available" bir özelliği hemen kullanmak sorun yaratmaz. Ama geniş, bilinmeyen bir genel kitleye açık bir ürün için "widely" eşiğini beklemek, destek taleplerini önceden önlemenin en ucuz yolu.

Burada sık yapılan bir hata, "newly available" ile "deneysel" statüyü karıştırmak. Bir özellik "newly available" olduğunda zaten tüm çekirdek tarayıcılarda gerçek, kararlı bir uygulaması var — deneysel bir bayrak arkasında değil. [`:has()` ve yerel iç içe yazım](/tr/posts/modern-css-has-ic-ice-yazim) gibi CSS özellikleri tam olarak bu döngüden geçti: önce deneysel, sonra newly available, birkaç yıl içinde de widely available. Risk, tarayıcı sürümünün kendisinde değil, kullanıcılarınızın o sürüme henüz geçip geçmediğinde. Bu ayrımı netleştirmek, ekip içindeki "yeni özellik = riskli" refleksini gereksiz yere frenlemekten kurtarıyor.

## caniuse'u Tamamen Bırakmalı mısınız?

Hayır, ama rolü değişiyor. caniuse, belirli bir tarayıcının belirli bir sürümünde bir özelliğin tam olarak ne zaman eklendiğini bilmeniz gerektiğinde (örneğin eski bir kurumsal tarayıcı sürümünü desteklemek zorundaysanız) hâlâ en ayrıntılı kaynak. Baseline ise günlük "bunu kullanabilir miyim" kararları için daha hızlı bir özet katmanı sunuyor; ikisi birbirini dışlamıyor, Baseline çoğu zaman caniuse'a gitme ihtiyacını ortadan kaldırıyor.

Bu, [Biome ve Oxlint'in ESLint'in yerini almasını ele aldığımız yazıda](/tr/posts/eslint-yerine-biome-ve-oxlint) değindiğimiz bir eğilimle örtüşüyor — [web geliştirme kategorimizdeki](/tr/category/web-gelistirme) birçok başlıkta da bu kalıbı görüyoruz: araç zinciri, geliştiricinin elle kontrol etmesi gereken kararları giderek derleme zamanına, otomatik kontrollere taşıyor. Baseline'ın linting entegrasyonu da aynı mantığın bir parçası — "bu özelliği kullanabilir miyim" sorusunu insan hafızasından çıkarıp araçlara devrediyor. Sonuç, code review'da artık tartışılmayan bir kategori daha: bir PR'da Baseline kuralı kırmızı yanıyorsa, tartışma başlamadan önce karar zaten verilmiş oluyor.

## webstatus.dev Ne İşe Yarar?

webstatus.dev, Baseline verisini sorgulanabilir bir panoya dönüştürüyor: belirli bir özelliğin güncel statüsünü, hangi tarayıcı sürümlerinde desteklendiğini ve "widely available" olana kadar ne kadar süre kaldığını filtreleyerek görebiliyorsunuz. Bu, [Astro ve Next.js karşılaştırmamızda](/tr/posts/astro-mu-nextjs-mi) değindiğimiz gibi, hangi framework özelliğinin hangi web platformu desteğine dayandığını anlamak için de kullanışlı — bir framework'ün sunduğu "modern" bir özellik, altında yatan web platformu API'si henüz "limited availability" durumundaysa aslında kırılgan olabilir.

## Sıkça Sorulan Sorular

### Bir özellik ne zaman "widely available" sayılır?

Bir özellik, tüm çekirdek tarayıcılarda (Chrome, Edge, Firefox, Safari — masaüstü ve mobil) desteklenmeye başladığı "newly available" anından 30 ay sonra "widely available" statüsüne geçer. Bu 30 aylık eşik, özelliklerin bu süre içinde küresel kullanıcıların yaklaşık %95'ine ulaştığını gösteren kullanım verisine dayanıyor.

### Baseline, caniuse'un tamamen yerini mi alıyor?

Hayır. Baseline, günlük "kullanabilir miyim" kararları için hızlı bir özet sunuyor ama caniuse, belirli bir tarayıcı sürümünün tam destek tarihini bilmeniz gerektiğinde (örneğin eski kurumsal tarayıcıları desteklerken) hâlâ daha ayrıntılı bir kaynak olarak kalıyor.

### Baseline verisini build sürecime nasıl bağlarım?

eslint-plugin-baseline-js gibi bir ESLint eklentisi, kaynak kodunuzdaki özellikleri web-features veri setine karşı kontrol edip hedeflediğiniz Baseline seviyesinden (newly, widely veya belirli bir yıl) daha yeni özellikleri derleme zamanında işaretler.

### "Newly available" bir özelliği production'da kullanmak güvenli mi?

Kullanıcı tabanınızın tarayıcı dağılımını biliyorsanız ve çoğunluk güncel tarayıcı kullanıyorsa evet, risk kabul edilebilir düzeyde kalır. Bilinmeyen, geniş bir kitleye açık bir üründe ise feature detection eklemek veya özelliğin "widely available" statüsüne geçmesini beklemek daha güvenli bir seçim.
