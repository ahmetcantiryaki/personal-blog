---
title: "Teknik Borç Olmadan Feature Flag"
slug: "feature-flag-teknik-borc"
translationKey: "feature-flags-guide"
locale: "tr"
excerpt: "Çoğu feature flag sistemi kalıcı teknik borca dönüşür. Flag türleri, sahiplik, son kullanma tarihi ve temizlik iş akışıyla bunu nasıl önlersiniz?"
category: "software-engineering"
tags: ["best-practices", "testing", "deployment", "clean-code", "software-architecture"]
publishedAt: "2026-07-12"
seoTitle: "Feature Flag Yönetimi: Teknik Borç Olmadan Nasıl Yapılır"
seoDescription: "Çoğu feature flag sistemi kalıcı teknik borca dönüşür. Flag türleri, sahiplik, son kullanma tarihi ve temizlik iş akışıyla bunu nasıl önlersiniz?"
---

Feature flag'ler ucuz görünür: bir `if` bloğu ekler, deploy edersiniz, riskli özelliği canlıda anında açıp kapatabilirsiniz. Sorun şu ki hiçbir ekip flag'leri kaldırmayı önceliklendirmiyor — altı ay sonra kod tabanınızda kimsenin anlamadığı 40 tane iç içe geçmiş koşul kalıyor. Bu yazı tam da bunun tersini savunuyor: flag'lerin kendisi sorun değil, "kaldırma tarihi olmayan flag" sorun.

[Martin Fowler'ın da vurguladığı gibi](https://martinfowler.com/articles/feature-toggles.html), flag'ler yeni bir soyutlama ve önemli bir test yükü getiriyor; yönetilmezse hızla çoğalıyorlar. Bu yazıda flag türlerini, ne zaman kısa ömürlü ne zaman uzun ömürlü olmaları gerektiğini, isimlendirme ve sahiplik disiplinini, temizlik iş akışını ve her iki dalı da test etmenin pratik yollarını ele alıyoruz.

## Flag türleri: hepsi aynı kutuda durmamalı

Her flag aynı yaşam döngüsüne sahip değil. **Release flag'leri**, yarım kalan bir özelliği üretime deploy edip kullanıcılardan gizlemek için var; özellik tamamlanınca kaldırılmalılar — yaşam süreleri günler ya da haftalarla ölçülür. **Operasyonel/kill switch flag'leri**, bir bağımlılık çöktüğünde ya da yeni kod beklenmedik davranış sergilediğinde deploy yapmadan geri dönmenizi sağlar; bunlar riskli entegrasyonlar sürdüğü sürece kalıcı olabilir. **Deney flag'leri** A/B testleri için kısa bir pencerede yaşar ve karar verilince kapanır. **İzin/yetkilendirme flag'leri** ise hangi kullanıcı segmentinin hangi özelliği gördüğünü belirler ve genelde ürünün kalıcı bir parçasıdır.

Bu dördünü aynı listede, aynı kurala tabi tutmak hatanın kaynağı. Fowler'ın önerdiği gibi, release ve business/izin flag'lerini ayrı yapılandırma dosyalarında, ayrı yaşam döngüsü kurallarıyla yönetmek gerekiyor.

## Neden yönetilmeyen flag'ler kombinatoryal test borcuna dönüşür

İki bağımsız flag'iniz varsa dört durumu test etmeniz gerekir; beş flag'de bu sayı 32'ye çıkar. Gerçekte kimse bunu tam olarak test etmiyor — bunun yerine "genelde açık" durumu test edilip diğer kombinasyonlar üretimde keşfediliyor. Knight Capital'in 2012'deki ünlü olayı da tam olarak buydu: eski bir flag'in beklenmedik biçimde yeniden etkinleşmesi, dakikalar içinde 460 milyon dolarlık kayba yol açtı. Ders açık: her yaşayan flag, test matrisinize kalıcı bir çarpan ekliyor.

## İsimlendirme, sahiplik ve son kullanma tarihi

Pratikte işe yarayan kural şu: her flag oluşturulduğu anda bir sahip, bir amaç açıklaması ve bir son kullanma tarihi taşımalı. Geçici (release) flag'ler için bu birkaç haftayı geçmemeli; Fowler'ın önerisi de bu yönde. İsimlendirme konusunda `enable-new-checkout` gibi belirsiz isimler yerine `checkout-v2-release-2026-07` gibi tarih ve amaç taşıyan isimler kullanmak, altı ay sonra "bu flag ne işe yarıyordu?" sorusunu ortadan kaldırıyor.

| Flag türü | Tipik ömür | Sahiplik | Kaldırma tetikleyicisi |
|---|---|---|---|
| Release | Günler–haftalar | Özelliği geliştiren ekip | Özellik %100 kullanıcıda stabil |
| Kill switch (ops) | Riskli entegrasyon sürdükçe | Platform/SRE ekibi | Bağımlılık güvenilir hâle gelince |
| Deney (A/B) | Test penceresi kadar | Ürün/veri ekibi | Karar verildiğinde |
| İzin/yetkilendirme | Kalıcı | Ürün ekibi | Ürün kararı değişince |

## Temizlik iş akışı: eski flag'leri nasıl yakalarsınız

En pratik disiplin, bir release flag'i eklerken backlog'a otomatik olarak bir "flag'i kaldır" görevi düşürmek. Bazı ekipler flag oluşturma sürecine bir son kullanma tarihi alanı ekleyip, bu tarih geçtiğinde CI'da uyarı üreten basit bir script çalıştırıyor — kod tabanınızda `flags.yaml` gibi tek bir kaynak varsa bu birkaç saatlik bir iş. Statik analiz araçlarıyla artık hiçbir koşulda `false` dönmeyen ya da hep `true` dönen flag kontrollerini bulmak da stale flag'leri yakalamanın ucuz bir yolu.

Açıkçası burada asıl zor kısım araç değil, disiplin: "flag'i temizleyeceğiz" niyeti, sprint baskısı altında en kolay ertelenen iştir. Bu yüzden temizliği ayrı bir "teknik borç sprint'ine" bırakmak yerine, her flag'in doğduğu PR'a kaldırma görevini iliştirmek çok daha güvenilir çalışıyor.

## Her iki dalı da test etmek

Bir release flag'i açıkken ve kapalıyken davranışı farklıysa, her ikisi de CI'da test edilmeli — aksi hâlde flag'i açtığınız an "hiç test edilmemiş kod yolu"na geçersiniz. Pratik yaklaşım, feature flag durumunu test parametrelerinden biri hâline getirip kritik testleri her iki durumda da çalıştırmak, ama bunu her testte değil yalnızca flag'e doğrudan bağlı testlerde yapmak — aksi hâlde test süreniz katlanarak büyür. Bu, [temiz kod prensipleri yazımızda](/tr/posts/temiz-kod-prensipleri) savunduğumuz "test edilmemiş kod yolu üretime çıkmasın" ilkesinin flag'lere özel bir uygulaması.

Flag'ler aynı zamanda [kesintisiz deployment stratejinizin](/tr/posts/kesintisiz-deployment) da bir parçası olabilir: deploy'u release'den ayırmak, riskli bir değişikliği canlıya sürüp trafiği kademeli açmanın en ucuz yollarından biri. Ama bu güç, "trunk-based development" disipliniyle birlikte gelmeli — flag'ler uzun ömürlü branch'lerin yerini almaz, onları gereksiz kılar.

Şema değişiklikleriyle flag'leri birlikte yürütmeniz gerektiğinde, [kesintisiz veritabanı şema migrasyonları yazımızdaki](/tr/posts/kesintisiz-sema-migrasyonlari) expand-contract deseni ile flag tabanlı release'i eşleştirmek, hem kod hem şema tarafında geri dönüşü güvenli tutuyor.

Flag'lerinizi büyük bir SaaS sağlayıcısına bağlamak istemiyorsanız, [açık kaynak SaaS alternatifleri yazımızda](/tr/posts/acik-kaynak-saas-alternatifleri-2026) bahsettiğimiz kendi barındırdığınız araçlardan biri (örneğin Unleash ya da Flagsmith) tam bu ihtiyacı karşılıyor; OpenFeature ile birlikte kullanıldığında, sağlayıcı değiştirmek uygulama kodunuzu değil sadece provider yapılandırmanızı etkiliyor.

## Flag'leri gözlemlenebilirlikle birleştirmek

Bir flag'i açtığınızda hata oranı ya da gecikme artıyorsa, bunu fark etmenin en hızlı yolu flag durumunu trace ve metriklerinize bir öznitelik olarak eklemek. Örneğin her span'e `feature.checkout_v2 = true/false` gibi bir etiket eklerseniz, [OpenTelemetry'e başlangıç rehberimizde](/tr/posts/opentelemetry-baslangic-rehberi) anlattığımız dashboard'larda flag açıkken ve kapalıyken performansı yan yana karşılaştırabilirsiniz. Bu, "flag'i açtık, birkaç gün sonra hata oranı arttı ama nedenini bulamadık" senaryosunun önüne geçen ucuz ama sıkça atlanan bir pratik.

Son bir uyarı: flag temizliğini "birisi zamanı gelince yapar" diye bırakmak, pratikte "kimse yapmaz" anlamına geliyor. En az kırılgan çözüm, flag oluşturma sürecinin kendisine bir zorunlu alan eklemek — sahip ve son kullanma tarihi girilmeden flag oluşturulamasın. Bu, tek satırlık bir doğrulama kuralı ama altı ay sonraki "bu flag'i kim eklemiş, hâlâ gerekli mi?" sorununun büyük kısmını baştan engelliyor.

Daha fazla yazılım mühendisliği pratiği için [Yazılım Mühendisliği kategorisine](/tr/category/yazilim-muhendisligi) göz atabilirsiniz.

## Sıkça Sorulan Sorular

### Feature flag'ler gerçekten teknik borç mu, yoksa iyi bir pratik mi?

İkisi de olabilir. Flag'in kendisi zararsız; zararlı olan son kullanma tarihi ya da sahibi olmadan sonsuza kadar kod tabanında kalması. Disiplinli bir yaşam döngüsüyle yönetilen flag'ler, deploy'u release'den ayırmanın en güvenli yollarından biri.

### Kaç flag "çok fazla" sayılır?

Kesin bir sayı yok, ama pratik bir sinyal şu: yeni bir geliştirici bir dosyayı açtığında iç içe geçmiş flag kontrollerini anlamakta zorlanıyorsa, ya da bir bug raporunun hangi flag kombinasyonunda oluştuğunu bulmak dakikalar alıyorsa, temizlik zamanı gelmiştir.

### Kill switch flag'leri de son kullanma tarihi almalı mı?

Doğrudan bir tarih değil ama bir gözden geçirme tetikleyicisi almalı: bağımlılık artık güvenilir kabul edildiğinde ya da alternatif bir çözüm devreye girdiğinde flag'in gerekliliği yeniden değerlendirilmeli.

### Flag yönetimi için OpenFeature gibi bir standart kullanmalı mıyım?

Birden fazla flag sağlayıcısı arasında geçiş yapma ya da vendor lock-in riskinden kaçınma ihtimaliniz varsa evet — [OpenFeature](https://openfeature.dev/docs/reference/intro/), uygulama kodunuzu belirli bir flag sağlayıcısına bağlamadan ortak bir değerlendirme API'si sunuyor. CNCF'nin incubating projesi olması da uzun vadeli bakım ve topluluk desteği açısından bir güvence sağlıyor; küçük ölçekli bir tek-vendor kurulumda bu soyutlamanın getirisi düşük olsa da, birden fazla ekip ya da birden fazla dil kullanan bir organizasyonda hızla kendini amorti ediyor.
