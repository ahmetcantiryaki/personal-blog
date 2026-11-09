---
title: "CSS Subgrid ile İç İçe Gridler Nasıl Hizalanır?"
slug: "css-subgrid-ic-ice-grid-hizalama"
translationKey: "css-subgrid-align-nested-grids"
locale: "tr"
excerpt: "Kısa cevap: subgrid, iç grid'in satır ve sütunlarını üst grid'in izgarasına bağlar; böylece kart başlıkları, gövdeleri ve CTA'ları satır boyunca hizalanır."
category: "web-development"
tags: ["css", "frontend", "responsive-design", "web-standards"]
publishedAt: "2026-11-09"
seoTitle: "CSS Subgrid ile İç İçe Gridler Nasıl Hizalanır?"
seoDescription: "Kısa cevap: subgrid, iç grid'in satır ve sütunlarını üst grid'in izgarasına bağlar; böylece kart başlıkları, gövdeleri ve CTA'ları satır boyunca hizalanır."
---

Kısa cevap: `grid-template-columns: subgrid` veya `grid-template-rows: subgrid` yazdığınızda, alt grid kendi izgarasını kurmaz; üst grid'in satır ve sütun izgarasını miras alır. Sonuç: farklı kartların başlığı, gövdesi ve butonu aynı hizada durur. Subgrid, Ağustos 2023'ten beri Chrome ve Edge'de, 2019'dan beri Firefox'ta, 15.4'ten beri Safari'de destekleniyor — Kasım 2026 itibarıyla üç yıldan uzun bir geçmişi var.

## CSS subgrid nedir?

Subgrid, bir grid konteynerinin satır veya sütun izgarasını, içindeki bir grid öğesine devretmesini sağlayan bir CSS Grid değeri. Normalde iç içe bir `display: grid` öğesi kendi bağımsız izgarasını kurar ve dış gridle hiçbir hizalama ilişkisi taşımaz. `subgrid` değeri bu bağımsızlığı kaldırır: iç grid'in track'leri (satır/sütun genişlikleri), dış grid'in aynı track'leriyle birebir eşleşir.

## Subgrid hangi problemi çözüyor?

Problem şu: bir kart grid'inde her kart kendi içinde başlık, açıklama ve buton barındırıyorsa, kartlardan birinin başlığı iki satıra taşabilir ve o kartın altındaki içerik aşağı kayar — diğer kartlarla hizası bozulur. Subgrid'den önce bu, JavaScript ile yükseklik ölçmek veya `grid-template-rows` değerlerini elle senkronize etmek anlamına geliyordu. Subgrid ile dış grid üç satır tanımlar (başlık, gövde, CTA), her kart bu üç satırı `subgrid` ile devralır ve tarayıcı hizalamayı otomatik yapar.

## Subgrid söz dizimi nasıl çalışır?

Önce dış konteynerde normal bir grid tanımlarsınız, sonra iç öğede `subgrid` değerini kullanırsınız. Boşluk (`gap`) devralınmaz, her seviyede ayrıca tanımlanması gerekir — bu, geliştiricilerin en çok şaşırdığı nokta.

```css
.kart-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto auto auto;
  gap: 24px;
}

.kart {
  display: grid;
  grid-row: span 3;
  grid-template-rows: subgrid;
  gap: 12px; /* subgrid gap'i devralmaz, ayrıca tanımlanır */
}

.kart-baslik {
  grid-row: 1;
}
.kart-govde {
  grid-row: 2;
}
.kart-cta {
  grid-row: 3;
}
```

## Subgrid'i hangi durumlarda kullanmalısınız?

Aşağıdaki tablo subgrid'in gerçekten gerekli olduğu senaryoları, alternatiflerle karşılaştırır:

| Senaryo | Subgrid gerekli mi? | Alternatif |
|---|---|---|
| Kart grid'inde başlık/gövde/CTA hizası | Evet | JS ile yükseklik ölçmek (kırılgan) |
| Form etiketleri ve girişlerin dikey hizası | Evet | Sabit genişlik (duyarlı değil) |
| Tek bir bağımsız bileşen içi düzen | Hayır | Normal `display: grid` yeterli |
| Masonry tarzı, kasıtlı kayan düzen | Hayır | `grid-template-rows: masonry` (Firefox deneysel) |

## Subgrid'i container query'lerle birleştirmek işe yarar mı?

Evet, bu ikisi birbirini tamamlar: container query bir kartın genişliğine göre düzenini değiştirirken, subgrid o kartın içindeki satırları üst grid'le hizalı tutar. Örneğin dar bir konteynerde kart tek sütuna düşse de, aynı sayfadaki diğer kartlarla satır hizası subgrid sayesinde korunur. [Container query kullanımını ele aldığımız yazıda](/tr/posts/css-container-queries-kullanimi) bu iki özelliğin birlikte nasıl bir duyarlı tasarım deseni oluşturduğunu daha detaylı anlatıyoruz.

## Nesting derinliği bir sorun mu?

Subgrid tek seviyeyle sınırlı değil; bir subgrid öğesinin içine başka bir subgrid koyabilirsiniz ve her seviye bir üstündeki izgarayı miras alır. Pratikte iki seviyeden fazla iç içe geçme nadiren gerekir ve hata ayıklamayı zorlaştırır — tarayıcının geliştirici araçlarındaki grid denetleyicisi derin iç içe geçmelerde hangi track'in nereden geldiğini takip etmeyi zorlaştırıyor.

## Eski tarayıcılar için ne yapmalı?

Chrome 117 öncesi (Ağustos 2023 öncesi) sürümler subgrid'i desteklemez; bu sürümler kullanıcı tarafında Kasım 2026 itibarıyla neredeyse hiç kalmadı ama kurumsal ortamlarda eski Edge sürümleri hâlâ görülebiliyor. `@supports (grid-template-columns: subgrid)` ile özelliği algılayıp desteklenmeyen tarayıcıda her kartın kendi `grid-template-rows: auto auto auto` tanımına geri dönebilirsiniz; bu durumda hizalama bozulur ama düzen kırılmaz.

## Subgrid'de hizalama özellikleri (align-items, justify-items) nasıl çalışır?

Subgrid, track boyutlarını miras alır ama `align-items`, `justify-items` ve `align-self` gibi hizalama özellikleri her seviyede ayrı ayrı tanımlanır — bunlar da `gap` gibi devralınmaz. Bir kart grid'inde üst grid'e `align-items: stretch` yazmak, alt grid'in öğelerini otomatik olarak uzatmaz; subgrid öğesinin kendisine de aynı kuralı yazmanız gerekir. Baseline hizalama (`align-items: baseline`) özellikle metin ağırlıklı kartlarda işe yarar: farklı font boyutlarına sahip başlıklar, metin taban çizgisine göre hizalanır, kutunun üst-alt kenarına göre değil. Pratikte bu, bir fiyat etiketiyle bir başlığın yan yana durduğu kartlarda, ikisinin rakam ve harflerinin görsel olarak aynı çizgide görünmesini sağlar. Tek bir hücrenin hizalamasını değiştirmek isterseniz, o hücreye `align-self` veya `justify-self` yazmak, subgrid'in genel kuralını bozmadan istisna tanımlamanıza izin verir.

## Form düzenlerinde subgrid gerçekte nasıl kullanılır?

Kart grid'i dışında subgrid'in en pratik kullanım alanlarından biri, etiket ve giriş alanlarının dikey hizasını korumak zorunda olan formlar. Normal bir `display: grid` ile her form satırını ayrı ayrı tanımlarsanız, bir etiketin iki satıra taşması, o satırdan sonraki tüm giriş alanlarının hizasını kaydırır. Subgrid ile tüm form satırları üst grid'in izgarasını paylaştığı için, bir etiketin taşması sadece kendi satırını etkiler, diğerlerini bozmaz.

```css
.form-grid {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 16px 12px;
}

.form-satiri {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: subgrid;
}

.form-etiket {
  grid-column: 1;
}
.form-girdi {
  grid-column: 2;
}
```

Bu yapı, özellikle dinamik olarak oluşturulan formlarda (bir API şemasından üretilen alanlar gibi) işe yarıyor: her satırın kendi iç grid'i olsa da hepsi aynı sütun genişliklerini paylaştığı için, hangi alanın ne kadar uzun etiketi olursa olsun giriş kutuları hep aynı dikey çizgide başlıyor.

## Subgrid, flexbox'ın yerini mi alıyor?

Hayır, ikisi farklı problemleri çözüyor ve birbirinin yerini almıyor. Flexbox, tek boyutlu (satır veya sütun) dizilimler ve içerik boyutuna göre esneyen bileşenler için hâlâ doğru araç; subgrid ise iki boyutlu bir izgarada, birbirinden bağımsız öğelerin hizasını üst sınırla senkronize etmek için var. Pratikte bir sayfanın üst seviye düzeni grid ile kurulurken, o grid'in içindeki tek bir kartın iç dizilimi (ikon ve metnin yan yana durması gibi) hâlâ flexbox ile yapılabilir; subgrid, sadece kartlar arası hizalama gerektiğinde devreye giriyor.

## Subgrid, grid-template-areas ile birlikte kullanılabilir mi?

Hayır, doğrudan değil. `grid-template-areas`, isimlendirilmiş alanlar tanımlamak için kendi `grid-template-columns`/`grid-template-rows` değerlerini gerektirir ve bu değerler `subgrid` olarak ayarlandığında alan isimleri üst grid'den miras alınmaz — üst grid'de tanımlanan `grid-template-areas` varsa, alt grid bunu otomatik olarak görmez. Bunun yerine track'leri `subgrid` ile hizalayıp, öğeleri `grid-row`/`grid-column` numaraik değerleriyle (örneğin `grid-row: 1` veya `grid-row: span 2`) konumlandırmanız gerekir. Bu, `grid-template-areas`'ın okunabilirlik avantajından biraz ödün vermek demek, ama hizalama kazancı bunu genellikle karşılıyor; büyük bir layout'ta önce üst grid'de alanları adlandırıp, kart içlerinde numaraik satır/sütun referanslarıyla devam etmek yaygın bir pratik çözüm. Takımınız `grid-template-areas`'ı isim okunabilirliği için seviyorsa, en azından dış grid seviyesinde bu ismi korumak, kodun tamamen numaraik referanslara boğulmasını önlüyor.

Kişisel görüşüm: subgrid, CSS Grid'in en az bilinen ama en çok zaman kazandıran özelliklerinden biri. Çoğu ekip hâlâ kart hizalama problemini JavaScript'le çözüyor çünkü subgrid'in var olduğunu bilmiyor; oysa üç satırlık bir CSS bloğu, yüzlerce satırlık bir yükseklik-eşitleme script'inin yerini alabiliyor. Bir sonraki tasarım sistemi gözden geçirmesinde, kart bileşenlerinizin hizalama mantığını kontrol etmeye değer.

## Sıkça Sorulan Sorular

### CSS subgrid hangi tarayıcılarda çalışır?

Subgrid, Firefox'ta 2019'dan beri, Safari'de 15.4'ten beri, Chrome ve Edge'de Ağustos 2023'te çıkan 117. sürümden beri destekleniyor; Kasım 2026 itibarıyla her büyük tarayıcı motorunda üç yıldan fazla süredir çalışıyor durumda.

### Subgrid ile masonry düzeni aynı şey mi?

Hayır. Subgrid, bir iç grid'in track'lerini üst grid'le hizalamaya yarar ve düzen tamamen öngörülebilir kalır; masonry ise öğelerin kasıtlı olarak kaymasına izin veren, Firefox'ta deneysel durumda olan ayrı bir düzen modudur.

### Subgrid'de gap neden miras alınmıyor?

CSS Grid spesifikasyonu `gap` değerini her grid seviyesinde bağımsız bir özellik olarak tanımlar; subgrid sadece track boyutlarını devralır, boşluk değerini devralmaz. Bu yüzden iç grid'de istediğiniz boşluğu ayrıca `gap` ile tanımlamanız gerekir.

### Subgrid performansı etkiler mi, JavaScript ile taklit edilebilir mi?

Ölçülebilir bir performans maliyeti yok; subgrid, tarayıcının zaten çalıştırdığı grid düzeni hesaplamasının bir uzantısı ve ek bir render geçişi gerektirmiyor. Teknik olarak her kartın yüksekliğini ölçüp en büyüğe göre eşitleyen bir script de yazılabilir, ama bu yaklaşım pencere yeniden boyutlandığında yeniden hesaplama gerektirir ve genelde bir "flash" (önce yanlış hizalı, sonra düzelen) görüntüsüne yol açar; subgrid bu hesaplamayı tarayıcının layout motoruna bıraktığı için hem daha az kod hem de görsel sıçrama olmadan çalışıyor.
