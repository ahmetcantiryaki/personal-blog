---
title: "Teknik Borç Olmadan Feature Flag"
slug: "feature-flag-teknik-borc"
translationKey: "feature-flags-guide"
locale: "tr"
excerpt: "Feature flag'ler hızlı ve güvenli teslimat vaat eder ama çoğu ekipte kalıcı borca dönüşür. Flag türleri, sahiplik ve temizlik disiplini olmadan olmaz."
category: "software-engineering"
tags: ["best-practices", "deployment", "testing", "clean-code"]
publishedAt: "2026-07-11"
seoTitle: "Feature Flag Yönetimi: Teknik Borç Yaratmadan"
seoDescription: "Feature flag'ler hızlı ve güvenli teslimat vaat eder ama çoğu ekipte kalıcı borca dönüşür. Flag türleri, sahiplik ve temizlik disiplini olmadan olmaz."
---

Çoğu ekip feature flag sistemini "deploy'u release'den ayırmak için" kurar, sonra altı ay sonra kod tabanında kimsenin ne işe yaradığını hatırlamadığı 40 tane `if (flagEnabled)` bloğuyla baş başa kalır. Bu bir araç sorunu değil, disiplin sorunu: flag'ler doğası gereği geçici olacak şekilde tasarlanmıyor, sonsuza kadar yaşayacak şekilde bırakılıyor.

Bu yazı contrarian bir iddiadan başlıyor: yönetilmeyen flag sistemi, güvenlik ağı gibi görünen ama aslında test matrisinizi katlayan bir borç kaynağı. Doğru kurulduğunda ise deploy'u release'den ayıran, kill switch ve canary rollout'un temelini oluşturan güçlü bir araç.

## Dört flag türü, dört farklı ömür

Pete Hodgson'ın martinfowler.com'daki [feature toggles yazısı](https://martinfowler.com/articles/feature-toggles.html), flag'leri mekanizmalarına göre değil amaçlarına göre sınıflandırır — ve bu ayrım flag borcunun kökeninde yatar:

- **Release toggle**: Yarım kalmış bir özelliği production'a merge etmenizi sağlar, geliştirme bitince kaldırılır. Ömrü günler-haftalar.
- **Ops toggle (kill switch)**: Bir özelliği anında kapatma imkânı verir. Ömrü aylar, bazen kalıcı.
- **Experiment toggle**: A/B testleri için kullanılır, deney bitince kaldırılır. Ömrü haftalar.
- **Permission toggle**: Belirli kullanıcı segmentlerine özellik açar (beta, enterprise plan). Ömrü uzun, bazen kalıcı iş mantığı.

Flag borcunun kök nedeni genellikle bu dördünün birbirine karıştırılması: bir release toggle'ın ops toggle gibi muamele görüp asla temizlenmemesi. Bir flag'i açarken hangi kategoriye girdiğini bilmiyorsanız, zaten borç birikiyor demektir.

## Neden şimdi önemli: AI destekli geliştirmede flag hacmi artıyor

AI kod asistanlarının yaygınlaşmasıyla birlikte flag oluşturma hızı da arttı — bir özelliği hızlıca prototiplemek isteyen bir geliştirici, birkaç dakikada yeni bir flag ekleyip production'a çıkarabiliyor. Bu hız kendi başına iyi, ama temizlik disiplini aynı hızda büyümezse flag borcu çok daha hızlı birikiyor. Bir ekipte flag oluşturma otomatikleştiyse, temizlik sürecinin de en az o kadar otomatik olması gerekiyor — aksi halde iki hız arasındaki fark, birkaç ay içinde yüzlerce ölü flag'e dönüşebilir.

## İsimlendirme, sahiplik, son kullanma tarihi

Her flag'in üç zorunlu alanı olmalı: açıklayıcı bir isim (`checkout-new-payment-flow`, `flag-1` değil), bir sahip (flag'i kim açtı, kim kapatmaktan sorumlu) ve bir son kullanma tarihi. Son kullanma tarihi olmayan flag, temizlenmeyecek flag demektir — bu kadar basit.

Pratikte işe yarayan bir kural: her release ve experiment toggle, oluşturulduğu anda bir "kaldırma tarihi" ile birlikte issue tracker'a düşer. O tarih geldiğinde flag hâlâ kodda duruyorsa, sprint planlamasında otomatik olarak gündeme gelir.

| Flag türü | Tipik ömür | Sahiplik modeli | Temizlik tetikleyicisi |
|---|---|---|---|
| Release | Gün–hafta | Özelliği geliştiren ekip | Özellik %100 rollout'a ulaştığında |
| Experiment | Hafta | Ürün/veri ekibi | Deney istatistiksel anlamlılığa ulaştığında |
| Ops (kill switch) | Ay–kalıcı | Platform/SRE ekibi | Yıllık gözden geçirme |
| Permission | Uzun–kalıcı | Ürün ekibi | Plan/segment yapısı değiştiğinde |

## Kirli flag tespiti ve temizlik iş akışı

Stale flag tespiti çoğu ekipte manuel ve gelişigüzel yapılıyor. İki pratik yaklaşım var: statik analiz araçlarıyla kod tabanını tarayıp X gündür değişmeyen flag'leri işaretlemek, ya da flag yönetim platformunuzun (LaunchDarkly, OpenFeature uyumlu bir sağlayıcı) kullanım telemetrisine bakıp hiç okunmayan ya da her zaman aynı değeri dönen flag'leri raporlamak.

[OpenFeature](https://openfeature.dev/) burada iyi bir referans: vendor-nötr bir SDK standardı olarak, flag değerlendirme mantığınızı belirli bir sağlayıcıya kilitlemeden flag kullanımını tutarlı hale getirir — bu da temizlik araçlarının kod tabanı genelinde çalışmasını kolaylaştırır.

```ts
const client = OpenFeature.getClient()
const useNewCheckout = await client.getBooleanValue('checkout-new-payment-flow', false)

if (useNewCheckout) {
  return renderNewCheckout()
}
return renderLegacyCheckout()
```

Bu soyutlama sayesinde flag sağlayıcınızı değiştirmek istediğinizde (örneğin LaunchDarkly'den kendi barındırdığınız bir çözüme geçerken) iş mantığı kodunuz hiç değişmez.

Temizlik iş akışı üç adımdan oluşur: önce flag'i "her zaman true/false döndür" olarak sabitleyin (bir deploy, davranış değişmiyor), sonra kod yollarını birleştirip ölü dalı silin (ikinci deploy), son olarak flag'i yönetim panelinden kaldırın. Bu üç adımı tek commit'te yapmak riskli — her adım ayrı ayrı geri alınabilir olmalı.

## Kombinatoryal test borcu nasıl büyür

Yönetilmeyen flag sisteminin en somut maliyeti burada ortaya çıkıyor. Tek bir flag iki test senaryosu (açık/kapalı) demek. Ama beş bağımsız flag aynı anda aktifse, teorik olarak 2⁵ = 32 farklı kombinasyon var demektir. Çoğu ekip bunların hepsini test etmiyor — sadece "en yaygın" kombinasyonu doğruluyor ve geri kalanını üretimde keşfediyor. Flag sayısı arttıkça bu kombinasyon patlaması yönetilemez hale geliyor; bu yüzden aktif flag sayısını düşük tutmak, her flag'i mümkün olduğunca izole tutmak (birbirine bağımlı flag'lerden kaçınmak) kritik.

Pratik bir çözüm, flag'ler arası bağımlılık haritası çıkarmak: bir flag başka bir flag'in davranışını değiştiriyorsa (örneğin `checkout-new-payment-flow` açıkken `express-checkout` flag'inin farklı davrandığı), bu bağımlılığı dokümante edin ve test matrisine açıkça ekleyin. Bağımsız flag'ler için ise her birini kendi başına test etmek yeterli — kombinasyon patlaması genellikle birbirine sıkıca bağlı flag'lerden kaynaklanıyor, tamamen bağımsız olanlardan değil.

## İki dalı da test etmek

Bir flag açıkken de kapalıyken de production'a çıkabileceğinden, her ikisi de test kapsamınızda olmalı. En yaygın hata: sadece "yeni" davranışı test edip eski dalın bozulduğunu fark etmemek — özellikle flag uzun süre açık kaldığında eski kod yolu bakımsız kalır ve sessizce kırılır.

Pratik kural: bir flag'in ömrü bir sprint'i aştığında, CI matrisine hem açık hem kapalı durumunu kapsayan ayrı bir test suite eklenmeli. [İşe yarayan unit testler nasıl yazılır](/tr/posts/unit-test-nasil-yazilir) yazımızdaki test izolasyonu prensipleri burada doğrudan uygulanıyor — flag durumu, mock edilebilir bir bağımlılık gibi ele alınmalı.

## Kill switch'ler deploy'u release'den nasıl ayırır

Ops toggle'ların asıl gücü burada ortaya çıkıyor: yeni kod production'a deploy edilir ama flag kapalı olduğu için çalışmaz. Bir sorun çıktığında rollback için yeniden deploy beklemenize gerek kalmaz — flag'i kapatmak saniyeler sürer. Bu, [kesintisiz deployment](/tr/posts/kesintisiz-deployment) yazımızda ele aldığımız blue-green ve canary stratejilerinin tamamlayıcısı: deploy mekanizması riski taşımayı üstlenirken, flag hangi kodun çalışacağını kontrol eder.

Bu ayrım aynı zamanda [sıfırdan CI/CD pipeline kurma](/tr/posts/cicd-pipeline-nasil-kurulur) rehberimizdeki "sık deploy, seyrek release" prensibinin pratikte nasıl çalıştığını gösteriyor — flag'ler olmadan bu ikisini ayırmak neredeyse imkânsız.

## Sıkça Sorulan Sorular

### Kaç tane flag olması "normal"?

Sabit bir sayı yok, ama büyüyen bir kod tabanında aktif flag sayısı yüzü geçtiğinde temizlik sürecinizin geride kaldığının işaretidir. Önemli olan mutlak sayı değil, her flag'in bir son kullanma tarihi ve sahibi olup olmadığı.

### Feature flag ile A/B test aracı aynı şey mi?

Hayır, ama örtüşüyorlar. Experiment toggle'lar A/B test için kullanılabilir ama deney bittiğinde flag'in de kaldırılması gerekir — bir deney aracının kalıcı bir kill switch'e dönüşmesi yaygın bir borç kaynağıdır.

### Flag mantığını nerede tutmalıyım — koda mı, konfigürasyona mı?

Flag'in kendisi (açık/kapalı) uzaktan yönetilebilir bir konfigürasyon olmalı, ama flag'e bağlı iş mantığı kodda kalmalı. OpenFeature gibi bir soyutlama katmanı, bu ikisini net bir sınırla ayırmanıza yardımcı olur.

### Eski flag'leri silmek riskli görünüyor, ertelemek daha güvenli değil mi?

Tam tersi doğru: flag ne kadar uzun süre kodda kalırsa, kimsenin hatırlamadığı bir bağımlılığa dönüşme riski o kadar artar. Erteleme, riski azaltmıyor, gizliyor.

### Flag temizliğini kim sahiplenmeli — geliştirici mi, platform ekibi mi?

İkisi de, ama farklı sorumluluklarla. Flag'i açan geliştirici ya da ekip, temizlik tarihinden sorumlu olmalı; platform ekibi ise sistem genelinde stale flag raporlaması ve otomatik uyarı altyapısını sağlamalı. Sahiplik tek bir kişiye değil, bir sürece bağlı olduğunda temizlik disiplin haline geliyor, tek bir kişinin ayrılmasıyla kaybolmuyor.
