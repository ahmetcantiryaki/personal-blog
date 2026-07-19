---
title: "ESLint ve Prettier'e Veda: Biome ve Oxlint"
slug: "eslint-yerine-biome-ve-oxlint"
translationKey: "biome-oxc-rust-tooling"
locale: "tr"
excerpt: "Biome mu Oxlint mı? Rust tabanlı bu iki araç ESLint ve Prettier'i hızla değiştiriyor; hız, kural kapsamı ve geçiş yollarını veriyle karşılaştırdık."
category: "web-development"
tags: ["rust", "code-quality", "developer-experience", "frontend"]
publishedAt: "2026-07-19"
seoTitle: "Biome vs Oxlint: ESLint'e Rust Tabanlı Alternatif"
seoDescription: "Biome mu Oxlint mı? Rust tabanlı bu iki araç ESLint ve Prettier'i hızla değiştiriyor; hız, kural kapsamı ve geçiş yollarını veriyle karşılaştırdık."
---

Kısa cevap: Greenfield bir projede ESLint ve Prettier'i doğrudan Biome ile değiştirebilirsiniz. Büyük, özel plugin'lere bağımlı bir codebase'iniz varsa önce Oxlint'i ESLint'in yanına ekleyip zamanla ESLint kapsamını daraltmak çok daha güvenli. Temmuz 2026 itibarıyla ikisi de üretime hazır ama plugin derinliğinde ESLint'i henüz tam yakalamadılar.

## Neden JS araç zinciri Rust'a taşınıyor?

Bu hareket aslında yeni değil. esbuild ve SWC zaten bundling ve transpile işlemlerini saf JavaScript araçlarına göre bir büyüklük mertebesi hızlandırarak kanıtladı: sistem programlama dilinde yeniden yazılan çekirdek araç zinciri bileşenleri ciddi performans kazancı getiriyor. Biome ve OXC/Oxlint ekipleri şimdi aynı bahsi linting ve formatting üzerine oynuyor. [TypeScript 7'nin Go'ya taşınması](/tr/posts/typescript-7-go-derleyici) da benzer bir motivasyondan besleniyor: JavaScript üzerinde çalışan JavaScript araçlarının, büyük codebase'lerde CI süresini ciddi şekilde şişirdiği artık herkesin kabul ettiği bir gerçek.

ESLint ve Prettier, Node.js üzerinde çalışan yorumlanan JavaScript ile yazıldı; bu da her dosya için AST oluşturma, kural değerlendirme ve formatting adımlarının önemli bir overhead taşıdığı anlamına geliyor. Rust'ın çöp toplayıcısız bellek modeli ve gerçek çoklu iş parçacığı desteği, aynı işi çok daha az kaynakla yapmayı mümkün kılıyor.

## Biome: tek binary, sıfır konfigürasyon iddiası

[Biome](https://biomejs.dev/) hem linting hem formatting yapan tek bir Rust binary'si — ayrı bir Prettier kurulumuna gerek yok. Formatter tarafı 2023'ten beri production-ready kabul ediliyor ve JavaScript/TypeScript için Prettier ile yaklaşık %97 uyumlu; geri kalan fark, Biome ekibinin bilinçli olarak farklı davranmayı tercih ettiği, dokümante edilmiş birkaç edge case'den kaynaklanıyor.

Kural sayısı konusunda kaynaklar arasında tutarsızlık var: bazıları Biome'un yaklaşık 200 küratörlü kuralı olduğunu söylerken, farklı sayma yöntemleriyle 400'ün üzerinde rakam veren kaynaklar da mevcut. Gerçekçi yaklaşım şu: Biome, yüzlerce kuralı kapsayan ama her kuralın geliştirici deneyimine etkisini tek tek gözden geçirerek eklendiği, küratörlü ve opinyonlu bir set sunuyor — amaç mümkün olan en fazla kuralı toplamak değil, gürültüsüz bir varsayılan deneyim vermek.

Basit bir Biome konfigürasyonu şöyle görünüyor:

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "formatter": { "enabled": true, "indentStyle": "space" },
  "linter": { "enabled": true, "rules": { "recommended": true } },
  "javascript": { "formatter": { "quoteStyle": "single" } }
}
```

Bu tek dosya, önceden ayrı ayrı yönetilen `.eslintrc` ve `.prettierrc` dosyalarının yerini alıyor.

## Oxlint ve OXC: hız şampiyonu

[Oxlint](https://oxc.rs/), OXC (Oxidation Compiler) projesinin parçası ve rakamlar açık: Biome'a göre linting'de kabaca 2 kat, ESLint'e göre ise 50-100 kat daha hızlı çalıştığı raporlanıyor. Somut bir örnek: Supabase'in control-plane codebase'inde, tip-farkında (type-aware) kurallar devrede olduğunda ESLint 54 saniyede bitirdiği taramayı Oxlint 8,6 saniyede tamamladı.

Oxlint 787 kural içeriyor; bunların arasında react ve typescript-eslint gibi popüler ESLint plugin'lerinden port edilmiş kurallar da var — bu da Biome'un daha küratörlü yaklaşımına kıyasla kutudan çıktığı haliyle daha geniş bir kapsam sunduğu anlamına geliyor. Önemli bir tasarım kararı: Oxlint, mevcut bir ESLint kurulumunu tamamen değiştirmek yerine, onun yanına eklenip kolay ve hızlı kazanımları önce yakalamak üzere tasarlandı.

```bash
# Mevcut ESLint kurulumunu koru, Oxlint'i yanına ekle
npx oxlint@latest --fix
# Karşılaştırma için aynı klasörde eski yöntem
npx eslint . --fix
```

Bu rakamların büyük kısmı [PkgPulse'un 2026 Biome vs OXC karşılaştırmasında](https://www.pkgpulse.com/guides/biome-vs-oxc-2026) ve [jsmanifest'in Biome-Oxlint kıyaslamasında](https://jsmanifest.com/biome-oxlint-comparison-2026) da doğrulanıyor; her iki kaynak da Oxlint'in ham hızda önde olduğu, Biome'un ise tek-araç kolaylığında öne çıktığı sonucuna varıyor.

## Tablo: Biome vs Oxlint vs ESLint

| Özellik | ESLint (+ Prettier) | Biome | Oxlint |
|---|---|---|---|
| Dil | JavaScript | Rust | Rust (OXC) |
| Kapsam | Sadece linting (formatting için Prettier gerekir) | Linting + formatting tek binary'de | Sadece linting (formatting için Oxfmt) |
| Kural sayısı | Plugin'lere bağlı, teorik olarak sınırsız | ~200-400+ küratörlü kural (kaynağa göre değişir) | 787 kural |
| Hız (ESLint'e kıyasla) | Referans | Önemli ölçüde hızlı | 50-100x daha hızlı |
| Supabase örneği (type-aware) | 54 saniye | Ölçülmedi | 8,6 saniye |
| Custom plugin ekosistemi | Olgun, geniş | Sınırlı | Sınırlı |
| Önerilen geçiş yolu | — | Greenfield, tek adımda | Legacy, ESLint'in yanında kademeli |

## Geçiş yolları: greenfield vs legacy

Greenfield projelerde karar nispeten kolay: tek konfigürasyon dosyası, tek binary, ayrı bir Prettier kurulumuna gerek yok — Biome'u standalone kurup ilerleyebilirsiniz. Bu yaklaşım özellikle [Bun ile Node.js arasında seçim yapan](/tr/posts/bun-mu-nodejs-mi-2026-runtime) ekiplerin zaten benimsediği "daha az araç, daha az konfigürasyon" felsefesiyle örtüşüyor.

Legacy ve büyük codebase'lerde tablo değişiyor. Özel import-resolver plugin'leri, framework'e özgü kural setleri veya henüz Rust tarafına port edilmemiş kurallara derin bağımlılığı olan projelerde en pragmatik yol, Oxlint'i mevcut ESLint kurulumunun yanına eklemek. Oxlint hızlı kazanılabilecek kuralların büyük çoğunluğunu üstlenirken, ESLint'i sadece Oxlint ve Biome'un henüz kapsamadığı kurallara indirgeyerek zamanla küçültüyorsunuz. Bu, [legacy kodu güvenli şekilde refactor etme](/tr/posts/legacy-kod-refactoring) prensibiyle aynı mantığı taşıyor: her şeyi bir günde değiştirmek yerine kademeli, ölçülebilir adımlarla ilerlemek.

## Plugin derinliği: dikkat edilmesi gereken nokta

Dürüst olmak gerekirse, ne Biome ne de Oxlint, ESLint'in olgun custom-plugin ekosistemiyle — yani JavaScript ile yazılmış, keyfi AST tabanlı özel kurallarla — tam bir eşdeğerlik sunmuyor. ESLint'te on yıldır biriken monorepo kuralları, tasarım sistemi zorunlulukları veya şirkete özgü lint mantığı varsa, tam geçişe karar vermeden önce plugin listenizi tek tek denetlemeniz gerekiyor. Bu denetim, tıpkı [temiz kod prensiplerini](/tr/posts/temiz-kod-prensipleri) uygularken yapılan kontrol listesi mantığına benziyor: varsayımları test etmeden büyük kararlar almamak.

Kişisel görüşüm şu: hız farkı bu kadar büyükken (50-100x), "tam parite yok" gerekçesiyle Rust tabanlı araçlardan tamamen kaçınmak, banyo suyuyla birlikte bebeği de atmak olur — asıl soru "hepsini mi değiştireyim" değil, "hangi yüzdesini bugün değiştirebilirim" olmalı.

## Migrasyon karar rehberi

- **Yeni proje, küçük-orta ekip:** Biome'u standalone kurun, ESLint ve Prettier'i baştan hiç eklemeyin.
- **Orta ölçekli, az sayıda custom kural:** Biome'a geçin, kapsamadığı birkaç kural için ESLint'i minimal bir konfigürasyonla arka planda tutun.
- **Büyük, çok plugin'li legacy codebase:** Oxlint'i ESLint'in yanına ekleyin, CI süresini hemen düşürün, ardından ESLint kural setini üç-altı aylık bir planla küçültün.
- **Design system veya framework'e özel karmaşık kurallara sahip codebase:** Şimdilik ESLint'i koruyun, Oxlint'i sadece hızlı ön-kontrol katmanı olarak ekleyin; tam geçişi OXC'nin plugin desteği olgunlaştıkça yeniden değerlendirin.

Bu kararı verirken CI pipeline'ınızı da gözden geçirmek mantıklı; ilgileniyorsanız [Tailwind CSS v4'e geçiş rehberimiz](/tr/posts/tailwind-css-v4-gecis-rehberi) benzer bir "kademeli mi tek seferde mi" kararını nasıl yapılandırdığımızı gösteriyor. Daha fazla araç karşılaştırması için [web geliştirme kategorimize](/tr/category/web-gelistirme) göz atabilirsiniz.

## Sıkça Sorulan Sorular

### Biome, Prettier'in tüm formatting kurallarını birebir uyguluyor mu?

Hayır, ama çok yakın: JavaScript/TypeScript için raporlanan uyumluluk yaklaşık %97 seviyesinde. Kalan fark, Biome ekibinin bilinçli olarak farklı davranmayı seçtiği, dokümante edilmiş birkaç durumdan geliyor; kör kopya değil.

### Oxlint tek başına ESLint'in yerini tamamen alabilir mi?

Bugün için genellikle hayır, özellikle ağır özelleştirilmiş ESLint kurulumlarında. Oxlint bilinçli olarak ESLint'in yanında, kademeli benimseme için tasarlandı; 787 kuralı kutudan çıktığı haliyle geniş bir kapsam sunuyor ama arbitrary custom plugin desteği ESLint kadar olgun değil.

### Biome mi Oxlint mi daha hızlı?

Raporlara göre Oxlint, linting'de Biome'a kıyasla kabaca 2 kat daha hızlı. Ancak Biome'un formatting'i de kapsayan tek-binary yaklaşımı, ayrı bir formatter kurmanıza gerek bırakmadığı için toplam araç zinciri karmaşıklığını azaltıyor — karşılaştırmayı sadece ham hız üzerinden yapmamak gerekiyor.

### Bu araçlar Temmuz 2026 itibarıyla üretime hazır mı?

Evet, Biome'un formatter'ı 2023'ten beri, linter'ı da uzun süredir production kullanımında; Oxlint da Supabase gibi gerçek codebase'lerde ölçülmüş performans rakamlarıyla üretimde kullanılıyor. Asıl belirsizlik hız veya kararlılıkta değil, plugin ekosistem derinliğinde.
