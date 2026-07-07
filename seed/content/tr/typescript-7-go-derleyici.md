---
title: "TypeScript 7: Go ile 10 Kat Hızlı Derleyici"
slug: "typescript-7-go-derleyici"
translationKey: "typescript-7-go-native-compiler"
locale: "tr"
excerpt: "TypeScript 7, derleyicisi tümüyle Go'ya yazılmış sürüm: aynı tip sistemi, ~10 kat hız. Corsa projesi, RC durumu ve riske atmadan nasıl denenir."
category: "software-engineering"
tags: ["typescript", "performance", "developer-experience", "best-practices"]
publishedAt: "2026-07-07"
seoTitle: "TypeScript 7: Go ile 10 Kat Hızlı Derleyici"
seoDescription: "TypeScript 7 derleyicisi tümüyle Go'ya yazıldı; tip denetimi ~10 kat hızlandı. Corsa projesi, RC durumu ve bugün nasıl deneneceği pratik notlarla."
---

TypeScript 7, derleyicinin tamamı Go diline yeniden yazılmış sürümdür ve tip denetimiyle derlemeyi yaklaşık 10 kat hızlandırır. Aynı tip sistemi, aynı davranış — sadece çok daha hızlı. Microsoft'un "Corsa" kod adlı bu portu 18 Haziran 2026'da Release Candidate aşamasına ulaştı; kararlı sürümün Temmuz 2026 içinde çıkması bekleniyor. Bu yazıda ölçülen kazanımları, neyin hazır neyin beklemede olduğunu ve dev bir kod tabanını riske atmadan bugün nasıl deneyebileceğinizi anlatıyorum.

## Go'ya taşınan derleyici: neden ve ne kadar hızlı

TypeScript, on yıldan uzun süredir kendi diliyle — yani TypeScript/JavaScript ile — yazılmış bir derleyiciye sahipti. Bu, kendini barındıran şık bir tasarımdı ama tek iş parçacıklı bir JavaScript çalışma zamanının tavanına dayanıyordu. Anders Hejlsberg'in yönettiği ekip, derleyiciyi satır satır Go'ya taşıdı; birden fazla dil değerlendirdiklerini ve mevcut yapıyı korumak için en kolayının Go olduğunu söylediler. Amaç dili değiştirmek değil, aynı semantiği çok daha hızlı çalıştırmaktı.

Rakamlar iddialı ama tutarlı ölçülmüş. En sık gösterilen kıyas, VS Code'un yaklaşık 1,5 milyon satırlık kendi kod tabanı: eski derleyicide ~77,8 saniye süren denetim, Go tabanlı derleyicide ~7,5 saniyeye iniyor.

| Ölçüt | TypeScript 6 (JS) | TypeScript 7 (Go) | Kazanç |
|-------|-------------------|-------------------|--------|
| VS Code derlemesi (~1,5M satır) | ~77,8 sn | ~7,5 sn | ~10x |
| Editör / proje yükleme süresi | referans | belirgin düşüş | ~8x |
| Bellek kullanımı | referans | kabaca yarısı | ~2x az |
| Genel tip denetimi | referans | çok daha hızlı | ~10x |

Bu tek seferlik bir numara değil, ekosistemdeki daha büyük bir dalganın parçası. [Microsoft'un resmî duyurusu](https://devblogs.microsoft.com/typescript/typescript-native-port/) bu kazanımı "10 kat daha hızlı TypeScript" olarak çerçeveliyor; TypeScript böylece esbuild, SWC, Bun ve Oxc gibi araçların başlattığı "native yeniden yazım" akımına katılıyor. Ortak ders şu: JavaScript araç zincirini yerel bir dile taşımak çoğu zaman 10–100 kat aralığında hız açıyor.

## Neyin hazır, neyin beklemede

RC etiketi cezbedici olsa da "her şey bitti" demek değil. Native derleyici, kararlı sürümde bugün var olan bazı işlevleri hâlâ tamamlıyor. Nesnel resim şöyle:

| Yetenek | Durum (Temmuz 2026, RC) |
|---------|--------------------------|
| Tip denetimi (`tsc --noEmit`) | Hazır |
| JS/JSX çıktısı (emit) | Büyük ölçüde hazır |
| `--declaration` (`.d.ts`) emisyonu | Kısmi / geliştiriliyor |
| `--build` (proje referansları) | Beklemede |
| Editör: auto-import, rename, find-all-references | Beklemede |
| Programatik API (typescript-eslint, ts-morph) | 7.1'e ertelendi |

Buradaki en kritik satır sonuncusu. [Native önizleme duyurusu](https://devblogs.microsoft.com/typescript/announcing-typescript-native-previews/), typescript-eslint, ts-morph ve özel transformer yazan herkesin programatik API için 7.1'i beklemesi gerektiğini açıkça söylüyor. Yani lint kuralları veya kod dönüştürücüleri derleyicinin iç API'sine dayanan bir projede geçişi bugün tamamen yapamazsınız — ama tip denetimini hızlandırmanızın önünde hiçbir engel yok.

## `tsc` mi `tsgo` mu: derleme ile tip denetimini ayırın

2026'da olgun ekiplerin çoğu zaten `tsc`'yi "derle" için değil, "denetle" için kullanıyor. Modern kurulum işi ikiye bölüyor: transpilasyonu esbuild, SWC veya Vite üstleniyor (bunlar tipleri kontrol *etmeden* sıyırıp attığı için hızlılar), tip güvenliğini ise CI'da ayrı çalışan `tsc --noEmit` sağlıyor. İşte TypeScript 7'nin en büyük pratik etkisi tam burada: pipeline'ınızdaki en yavaş, en çok beklenen adımı — tip denetimini — bir gecede ~10 kat hızlandırıyor.

İsimlendirme kafa karıştırabiliyor, netleştirelim:

- **`tsc`** — `typescript@rc` paketinden gelen `tsc` ikilisi artık doğrudan Go-native derleyicidir; ayrı bir komut öğrenmeniz gerekmez.
- **`tsgo`** — Bu isim yalnızca `@typescript/native-preview` nightly paketinde yaşamaya devam ediyor; en yeni değişiklikleri denemek isteyenler için.

Denetimle çıktı üretmeyi ayrı tutan disiplinli bir yapı, [temiz kod prensiplerimizin](/tr/posts/temiz-kod-prensipleri) araç katmanına yansımasıdır: her araç tek bir işi iyi yapsın. Tip sistemini agresif kullanan projeler için [ileri TypeScript kalıpları rehberimiz](/tr/posts/ileri-typescript-kaliplari), yeni hızın en çok fark yarattığı yerdir — çünkü koşullu tipler ve büyük birleşimler eski derleyicide en pahalı işti.

## Bugün nasıl denenir

En güvenli yol küçük ve tersine çevrilebilir: derleyiciyi sadece tip denetimi için kurun, çıktı üretimini olduğu gibi bırakın.

```bash
# 1) Kararlı RC'yi geliştirme bağımlılığı olarak kur
npm install -D typescript@rc

# 2) Go-native derleyici artık doğrudan tsc; emit yapmadan sadece denetle
npx tsc --noEmit

# 3) En son değişiklikleri denemek isterseniz nightly kanalı ayrı paket + tsgo
npm install -D @typescript/native-preview
npx tsgo --noEmit
```

CI'da fark, ilk denemede bile hissedilir. Emit'i mevcut build aracınıza bırakıp denetimi native derleyiciye verin:

```yaml
# Örnek CI adımı: hızlı tip kapısı
- name: Type check
  run: npx tsc --noEmit   # TS7 ile tipik olarak ~10x daha hızlı
```

Tip denetimini bir dağıtım kapısı olarak kullanan ekipler için bu, doğrudan daha kısa geri bildirim döngüsü demek. [CI/CD pipeline kurulum rehberimiz](/tr/posts/cicd-pipeline-nasil-kurulur), bu adımın nereye oturduğunu ve neden en çok darboğaz yaratan yer olduğunu anlatıyor. Tip denetimi 78 saniyeden 8 saniyeye inince, "denetimi PR'da çalıştırmak çok yavaş" bahanesi ortadan kalkıyor.

## Geçişte gerçekçi olmak

Şunu net söyleyeyim: kararlı GA çıkana ve programatik API 7.1 ile yerleşene kadar `tsc`'yi üretim JavaScript çıktısı için tek başına değiştirmeye acele etmeyin. Mantıklı köprü strateji, native derleyiciyi *bugün* CI tip denetimi için kullanıp (~10x hız, ~2x az bellek), gerçek JS çıktısı ve `.d.ts` üretimi için emit pipeline'ı olgunlaşana dek mevcut kurulumu korumak. Kütüphane yazıyorsanız `--declaration` ve `--build` durumunu yakından izleyin; uygulama yazıyorsanız muhtemelen bugün bile kazançlısınız. Pratikte bu, iki satırlık bir bağımlılık değişikliğiyle test edilebilecek kadar ucuz bir deney: bir dalda `typescript@rc` kurun, CI tip denetimini çalıştırın, süreyi ölçün ve beğenmezseniz geri alın. Riski düşük tutan da tam olarak bu geri alınabilirlik.

İlginç bir yan etki de araç ekosisteminde. Oxc ekibi, typescript-eslint'in izniyle tip farkında lint için `tsgolint`'i çatalladı ve hedeflenen 61 kuraldan 59'unu kapsayarak 20–40 kat daha hızlı lint bildiren erken kullanıcılarla ilerliyor. Native derleyici dalgası yalnızca `tsc`'yi değil, etrafındaki tüm zinciri hızlandırıyor. Bu tür "model-first", makineye ve insana birlikte hitap eden araçların yükselişini [agent odaklı geliştirici araçları](/tr/posts/agent-odakli-gelistirici-araclari) yazımızda da ele almıştık.

Daha geniş yazılım mühendisliği konularının merkez üssü için [Yazılım Mühendisliği](/tr/category/yazilim-muhendisligi) bölümüne göz atabilirsiniz. TypeScript 7, on yılın en büyük araç yükseltmelerinden biri — ve güzel yanı, dil olarak hiçbir şeyi yeniden öğrenmenizi gerektirmemesi.

## Sıkça Sorulan Sorular

### TypeScript 7 kodumu bozar mı?

Genellikle hayır. Corsa'nın açık hedefi, mevcut kod tabanını satır satır taşırken tip denetimi davranışını ve semantiğini korumaktı; yani aynı kod aynı hataları verir. Tek dikkat, `--declaration` emisyonunun kasıtlı olarak biraz farklı, TS'e daha yakın çıktı üretebilmesi. Uygulama kodu için risk düşük; kütüphane yayınlıyorsanız `.d.ts` çıktınızı bir kez gözden geçirin.

### `tsc` ile `tsgo` arasındaki fark nedir?

RC'de `typescript@rc` paketinin `tsc` ikilisi zaten Go-native derleyicidir; ayrı komut gerekmez. `tsgo` ismi yalnızca `@typescript/native-preview` nightly paketinde, en son değişiklikleri denemek isteyenler için yaşıyor. Kararlı iş için `typescript@rc` ve `tsc` yeterli.

### esbuild veya SWC kullanıyorum, TypeScript 7'ye hâlâ ihtiyacım var mı?

Evet. esbuild ve SWC tipleri denetlemeden sıyırıp atar — hızlarının sırrı budur. Tip güvenliğini yalnızca `tsc --noEmit` sağlar ve onun yerini tutan başka araç yoktur. TypeScript 7'nin değeri tam da bu denetim adımını ~10 kat hızlandırmasıdır; transpilasyonu yine hızlı aracınıza bırakabilirsiniz.

### Ne zaman üretime geçmeliyim?

Tip denetimi ve CI için Temmuz 2026 itibarıyla hemen deneyebilirsiniz — kazanç anında ve risk düşük. Programatik API'ye dayanan lint kuralları, ts-morph veya özel transformer kullanıyorsanız 7.1'i bekleyin. Kütüphane emisyonu (`--declaration`, `--build`) için de kararlı GA ve olgunlaşan emit pipeline'ı beklemek en güvenlisi.
