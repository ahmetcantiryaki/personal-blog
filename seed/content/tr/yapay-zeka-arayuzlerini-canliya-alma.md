---
title: "Yapay Zekânın Yazdığı Arayüz Canlıya Çıkar mı?"
slug: "yapay-zeka-arayuzlerini-canliya-alma"
translationKey: "ship-ai-generated-uis-production-2026"
locale: "tr"
excerpt: "Kısa cevap: evet, ama erişilebilirlik, durum yönetimi, tasarım token'ları, hata durumları, test ve güvenlik kontrollerinden geçtikten sonra."
category: "web-development"
tags: ["accessibility", "code-quality", "frontend", "ai-coding"]
publishedAt: "2026-10-05"
seoTitle: "Yapay Zekânın Yazdığı Arayüz Canlıya Çıkar mı?"
seoDescription: "v0.app ve Lovable'ın ürettiği arayüzler canlıya çıkmadan önce hangi kontrollerden geçmeli? Erişilebilirlik, durum yönetimi ve güvenlik kontrol listesi burada."
---

Kısa cevap: evet, yapay zekânın ürettiği arayüz canlıya çıkabilir, ama sadece erişilebilirlik, durum yönetimi, tasarım token tutarlılığı, hata durumları, test ve güvenlik kontrollerinden geçtikten sonra. v0.app ve Lovable gibi araçlar demo anında çalışan bir proje üretir; production'a hazır olmak bambaşka bir eşiktir ve bu eşiği her zaman insan mühendis belirler.

## v0 ve Lovable Gibi Araçlar Arayüzü Nasıl Üretiyor?

Bu araçlar tek bir bileşen değil, çalışır bir meta-framework projesi üretir. Vercel'in [v0](https://v0.app)'ı (Ocak 2026'da v0.dev'den v0.app'e yeniden adlandırıldı) varsayılan olarak Next.js, React ve shadcn/ui ile çıktı verir. [Lovable](https://lovable.dev) ise TypeScript, React, Vite ve Tailwind CSS kullanır ve kendisini "production-ready" teslim vaadiyle pazarlar — yani bir mühendislik ekibinin prototipi doğrudan canlıya taşıyabileceği iddiasıyla.

Bu durum işi hem kolaylaştırır hem karmaşıklaştırır. Kolaylaştırır çünkü ortaya tek bir HTML parçası değil, routing, state, stil ve build zinciri kurulmuş bir proje çıkar. Karmaşıklaştırır çünkü ekip artık "bu kodu nasıl entegre ederim" sorusuyla değil, "bu proje gerçekten bizim production standartlarımızı karşılıyor mu" sorusuyla karşı karşıya kalır.

### Demo çıktısı neden ilk bakışta production gibi görünüyor?

Çünkü üretilen proje gerçek bir framework'ün tüm iskeletini taşır: klasör yapısı, bağımlılıklar, bileşenler. Görsel olarak tamamlanmış bir uygulama izlenimi verir. Ama framework'ün doğru kurulmuş olması, kodun doğru olması anlamına gelmez; routing çalışır ama erişilebilirlik, hata yönetimi ve güvenlik katmanları çoğu zaman eksik kalır.

## Demo ile Production-Ready Kod Arasındaki Fark Nedir?

Fark altı noktada toplanıyor: erişilebilirlik, durum yönetimi, tasarım token tutarlılığı, hata/boş/yükleme durumları, testler ve güvenlik. Bu altı alan demo sırasında göz ardı edilebilir ama canlı ortamda doğrudan kullanıcı deneyimini ve veri güvenliğini etkiler.

Erişilebilirlik tarafında üretilen bileşenlerde ARIA etiketleri eksik kalır, focus yönetimi yapılmaz, klavye ile gezinme çalışmaz. Durum yönetiminde prop'lar bileşen ağacında aşağıya doğru elle taşınır ya da her bileşen kendi state'ini tutar; bu, uygulama büyüdükçe sürdürülemez hale gelir. Tasarım token'ları tarafında renk ve boşluk değerleri doğrudan koda sabitlenir, tasarım sistemine bağlanmaz. Hata, boş ve yükleme durumları genellikle hiç üretilmez — demo her zaman "mutlu yol" üzerinden çalışır. Testler neredeyse hiç gelmez. Güvenlikte ise doğrulanmamış girdiler, üretilen API route'larında eksik auth kontrolleri ve bazı durumlarda koda gömülmüş örnek bir gizli anahtar görülür.

Bu güven sorunu tesadüf değil. Sonar'ın 2026 [State of Code Developer Survey](https://www.sonarsource.com/state-of-code-developer-survey-report.pdf) verilerine göre geliştiricilerin %96'sı yapay zekânın ürettiği koda tam olarak güvenmediğini söylüyor, yalnızca %48'i commit öncesi kodu her zaman doğruladığını belirtiyor. Aynı dönemde JetBrains'in 15.000'den fazla profesyonel geliştiriciyi kapsayan 2026 Developer Ecosystem anketi, kodun yaklaşık %47'sinin tamamen agent tarafından üretildiğini, %38'inin yapay zeka destekli yazıldığını, sadece %27'sinin tamamen manuel olduğunu gösteriyor.

## Merge Öncesi Hangi Kontrol Listesi Uygulanmalı?

Üretilen arayüzü merge etmeden önce altı boyutu tek tek kontrol eden bir liste gerekir; her satırı atlamak farklı bir üretim riski taşır.

| Boyut | Atlanırsa risk | Düzeltme |
|---|---|---|
| Erişilebilirlik | Ekran okuyucu kullanıcıları arayüzü kullanamaz | Semantik HTML, `aria-label` ve klavye testleri ekleyin |
| Durum yönetimi | Prop'lar beş seviye aşağı taşınır, bileşen ağacı büyüdükçe yeniden yazılamaz hale gelir | Paylaşılan durumu context, store veya query cache'e taşıyın |
| Tasarım token'ları | Renk ve boşluk değerleri koda sabitlenir, tema değişikliğinde her yer elle güncellenir | Sabit değerleri tasarım sistemi token'larıyla değiştirin |
| Hata/boş/yükleme durumları | Kullanıcı API hatasında boş, beyaz bir ekranla kalır | Her veri çağrısına loading, error ve empty state ekleyin |
| Testler | Regresyon fark edilmeden production'a gider | Üretilen bileşen için en az bir render, bir etkileşim testi yazın |
| Güvenlik | Doğrulanmamış girdi veya yetkisiz API route canlıya çıkar | Girdi doğrulamasını ve auth kontrolünü elle ekleyin |

Bu listenin tamamı tek bir PR'da bitmek zorunda değil, ama merge öncesi en az erişilebilirlik, güvenlik ve hata durumları satırlarının yeşile dönmüş olması gerekir.

### Klavye ve ekran okuyucu kontrolü nasıl yapılır?

Üretilen her interaktif öğe Tab tuşuyla erişilebilir olmalı, görünür bir focus göstergesi taşımalı ve ekran okuyucuda anlamlı bir isimle duyurulmalı. Aşağıdaki örnek, v0.app veya Lovable'ın tipik olarak ürettiği bir simge buton ile merge öncesi düzeltilmiş hâlini gösteriyor:

```tsx
// Önce: üretici araç tarafından verilen hâli
function IconButton({ onClick, icon }) {
  return (
    <div className="icon-btn" onClick={onClick}>
      {icon}
    </div>
  );
}

// Sonra: merge öncesi sertleştirilmiş hâli
function IconButton({
  onClick,
  icon,
  label,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button type="button" className="icon-btn" onClick={onClick} aria-label={label}>
      {icon}
    </button>
  );
}
```

`div` üzerine `onClick` koymak görsel olarak çalışır ama klavye ile ulaşılamaz ve ekran okuyucu için anlamsızdır. Native `button` elementine geçmek Tab ile erişimi ve varsayılan Enter/Space davranışını otomatik olarak geri verir; `aria-label` ise simgenin ne işe yaradığını duyurur.

## Üretilen Kodu Düzenlemek mi, Sıfırdan Yazmak mı Daha Doğru?

Kural basit: bileşen görsel ve yapısal olarak doğruysa düzenleyin, mimari olarak yanlışsa spesifikasyondan yeniden yazın. Küçük bir form ya da kart bileşeninde erişilebilirlik ve token düzeltmesi genellikle 30-60 dakika sürer ve yerinde düzenlemek yeterlidir.

Ama üretilen proje state'i her sayfada ayrı ayrı tutuyorsa, veri çağrılarını bileşen içine gömmüşse veya routing yapısı ekibin mevcut mimarisiyle çatışıyorsa, düzeltme maliyeti yeniden yazmaktan daha yüksek olur. "Spesifikasyondan yazma" burada şu anlama gelir: üretilen arayüzü görsel referans olarak alıp veri akışını ve state mimarisini ekibin kendi standartlarına göre sıfırdan kurmak, sadece JSX ve stili taşımak. [Claude Code ve Codex ile spec odaklı kodlama](/tr/posts/claude-code-codex-spec-odakli-kodlama) tam olarak bu akışı, önce spesifikasyonu netleştirip sonra agent'a yazdırmayı anlatıyor.

Benim görüşüm şu: ekipler bu kararı "kaç satır değişecek" üzerinden değil, "kaç mimari varsayım değişecek" üzerinden vermeli. Satır sayısı az olsa da mimari varsayım — örneğin state'in nerede tutulduğu — yanlışsa, o kod rewrite kategorisine girer; satır sayısı çok olsa da sadece ARIA etiketi eklemekten ibaretse, o hâlâ bir refactor'dür.

## Mimariyi ve Veri Akışını Kim Kontrol Etmeli?

Mimariyi ve veri akışını her zaman insan mühendis kontrol etmeli; agent'lar bu kararlar belirlendikten sonra, o sınırlar içinde bileşen taslağı üretir. Bu ayrım, generative UI araçlarının güvenle kullanılabilmesinin ön koşulu.

Pratikte bu, şu anlama gelir: state'in nerede yaşayacağı (local, context, server, cache), API sözleşmesinin şekli, auth sınırlarının nerede çizileceği ve hangi verinin client'a hiç gönderilmeyeceği kararını insan verir. Sıra tersine çevrilirse — yani agent önce mimariye karar verip insan sonradan "düzeltirse" — düzeltme maliyeti neredeyse her zaman sıfırdan yazmaya yaklaşır.

TypeScript tarafında bu sınırları net tutmak için güçlü tip tanımları şart; [ileri TypeScript kalıpları](/tr/posts/ileri-typescript-kaliplari) burada agent'ın ürettiği prop ve state tiplerinin mimariyle çakışmasını derleme zamanında yakalamaya yardımcı olur.

## Üretilen Arayüz Borcu Nasıl Birikmeden Önlenir?

Birikmeyi önlemenin yolu, üretilen her bileşeni normal bir kod incelemesi gibi değil, doğrulanmamış üçüncü taraf kodu gibi incelemekten geçiyor. Bu bakış açısı güven düzeyini baştan düşürür ve her PR'da aynı altı kontrolün tekrar sorulmasını sağlar.

Pratik alışkanlıklar üçe iniyor. Birincisi, generative UI çıktısını asla doğrudan main'e merge etmeyin; önce bir inceleme branch'inde erişilebilirlik ve güvenlik taramasından geçirin. [AI ile kod incelemesi: güven ama doğrula](/tr/posts/ai-ile-kod-incelemesi-guven-dogrula) yaklaşımı tam olarak bunu öneriyor: hız için agent'a güven, doğruluk için insan doğrulaması şart. İkincisi, her sprint'te "üretilen UI borcu" için ayrı bir etiket açın ve bu etiketin birikmesine izin vermeyin; biriken üretilen kod, [AI çöplüğünün açık kaynak güvenliğine](/tr/posts/ai-copu-acik-kaynak-guvenligi) yol açan dinamiğin aynısını iç kod tabanında yaratır. Üçüncüsü, agent'ların hangi dosyalara dokunabileceğini [agent odaklı geliştirici araçları](/tr/posts/agent-odakli-gelistirici-araclari) ile sınırlayın; mimari dosyalara (routing config, auth middleware) agent erişimini kısıtlamak sonradan yapılacak düzeltme sayısını azaltır.

Sonar'ın [blog yazısına](https://www.sonarsource.com/blog/state-of-code-developer-survey-report-the-current-reality-of-ai-coding/) göre yapay zekânın yazdığı kod payı 2026'da %42'den 2027'de %65'e çıkması bekleniyor; bu oran arttıkça incelemeyi atlamanın maliyeti doğrusal değil, katlanarak büyüyor. Üretilen UI'ı incelemeden biriktirmek bugün ucuz görünen bir kısayol, altı ay sonra tüm bileşen kütüphanesini yeniden yazmak anlamına gelebilir.

[AI kod asistanı hataları](/tr/posts/ai-kod-asistani-hatalari) listesi, generative UI çıktısında en sık tekrarlanan bu tür hataları tanımak için ayrı bir referans olarak kullanılabilir.

## Sıkça Sorulan Sorular

### v0.app ile üretilen bir Next.js projesi doğrudan canlıya alınabilir mi?

Hayır, doğrudan alınmamalı. v0.app Next.js, React ve shadcn/ui ile çalışan bir proje üretir ama erişilebilirlik, hata durumları ve güvenlik kontrollerinden geçmeden production'a çıkmamalı; bu kontroller genelde kendi başına ayrı bir PR'da yapılır.

### Lovable'ın "production-ready" iddiası gerçek mi?

Kısmen gerçek. Lovable, TypeScript, React, Vite ve Tailwind ile çalışan gerçek bir proje iskeleti üretir ve bunu "production-ready" olarak pazarlar, ama bu iskelet üzerine erişilebilirlik, test ve güvenlik eklemeden canlıya çıkmak risklidir; iskelet hazır, içerik hâlâ ekibin sorumluluğundadır.

### Yapay zekâ üretimi kod ne kadar güvenilir?

2026 verilerine göre geliştiricilerin %96'sı yapay zekâ kodunu tam güvenmiyor ve yalnızca %48'i her commit öncesi doğruluyor. Bu, kodun kalitesiz olduğu anlamına gelmez; insan doğrulamasının hâlâ zorunlu bir adım olduğu anlamına gelir.

### Generative UI araçları hangi framework'leri varsayılan çıktı olarak kullanıyor?

v0.app varsayılan olarak Next.js, React ve shadcn/ui kullanıyor; Lovable ise TypeScript, React, Vite ve Tailwind CSS ile çıktı veriyor. İkisi de izole bir bileşen değil, çalışır bir proje iskeleti üretiyor.
