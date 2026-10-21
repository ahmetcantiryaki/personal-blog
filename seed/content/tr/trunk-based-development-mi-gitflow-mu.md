---
title: "Trunk-Based Development mi GitFlow mu? (2026)"
slug: "trunk-based-development-mi-gitflow-mu"
translationKey: "trunk-based-development-2026"
locale: "tr"
excerpt: "Kısa cevap: çoğu ekip için trunk-based development, kısa ömürlü dallar ve feature flag'lerle GitFlow'dan daha hızlı ve daha güvenli teslimat sağlar."
category: "software-engineering"
tags: ["git", "ci-cd", "version-control", "best-practices", "devops"]
publishedAt: "2026-10-21"
seoTitle: "Trunk-Based Development mi GitFlow mu? (2026)"
seoDescription: "Kısa cevap: çoğu ekip için trunk-based development, kısa ömürlü dallar ve feature flag'lerle GitFlow'dan daha hızlı ve daha güvenli teslimat sağlar."
---

Kısa cevap: çoğu ekip için trunk-based development, GitFlow'dan daha hızlı ve daha güvenli teslimat sağlar. DORA'nın *Accelerate* araştırması, trunk tabanlı geliştirmeyi sürekli entegrasyon ve otomatik testlerle birlikte yüksek performanslı yazılım teslimatının öngörücülerinden biri olarak işaretliyor. GitFlow ise hâlâ nadiren yayınlanan, versiyonlanan yazılımlarda (kurumsal masaüstü uygulamaları, gömülü sistemler, kütüphaneler) anlamını koruyor.

## Trunk-based development nedir?

Trunk-based development, geliştiricilerin `main` dalına (trunk) doğrudan veya birkaç saat ya da en fazla bir-iki gün içinde kapanan kısa ömürlü dallardan sık sık birleştirme yaptığı bir iş akışıdır. Tamamlanmamış özellikler ayrı bir dalda bekletilmez; bunun yerine feature flag ile kapatılarak trunk'ın içinde kalır. Ekip, haftalarca süren bir "release" dalı yerine her gün dağıtılabilir durumda olan bir trunk tutar.

Bu modelde bütünleştirme sıklığı günlük, çoğu zaman günde birden fazladır. Dallar büyümeden kapandığı için merge çatışmaları da küçük kalır; büyük bir çatışmayı günler sonra çözmek zorunda kalmazsınız.

## GitFlow nedir?

GitFlow, Vincent Driessen'in 2010'da tanımladığı bir modeldir ve `main`, `develop`, `feature/*`, `release/*`, `hotfix/*` olmak üzere beş farklı dal türü kullanır. Özellikler `develop` üzerinde günlerce, bazen haftalarca yaşar, bir `release` dalında stabilize edilir, ardından `main`'e birleştirilir. Sürüm numaralarının ve yayın tarihlerinin net olduğu, birden fazla sürümün paralel desteklenmesi gereken projelerde bu yapı hâlâ anlam taşıyor.

## Trunk-based development mi GitFlow mu, veriler ne diyor?

Kısa cevap: araştırma trunk tarafında duruyor. Google Cloud'un yayımladığı *Accelerate* (Forsgren, Humble, Kim) araştırması, trunk-based development'ı sürekli dağıtım ve proaktif izlemeyle birlikte yüksek performanslı teslimatın öngörücülerinden biri olarak gösteriyor. Google'ın yayımladığı bir Capital One vaka incelemesi, trunk-based development'ı otomatik değişiklik kontrolüyle birleştiren bir ekibin yayın sıklığını 20 kattan fazla artırdığını, bunu artan bir olay (incident) oranı olmadan yaptığını anlatıyor; bu tek bir şirketin vaka incelemesi, genel bir istatistik değil, ama yönü net gösteriyor. DORA'nın yıllık State of DevOps anketlerinde en üst performans grubu günde birden çok kez dağıtım yaparken, en alt grup ayda bir ya da daha seyrek dağıtım yapıyor; trunk-based development bu üst grubun ortak özelliklerinden biri.

| Kriter | Trunk-Based Development | GitFlow |
|---|---|---|
| Dal ömrü | Saatler – 1-2 gün | Günler – haftalar |
| Bütünleştirme sıklığı | Günlük, genelde günde birkaç kez | Release döngüsünde birkaç kez |
| Yarım kalan iş nasıl saklanır | Feature flag ile kapalı kod, trunk içinde | Ayrı `feature` dalında |
| Merge çatışması riski | Düşük (dallar küçük kalır) | Yüksek (dallar büyür, uzun yaşar) |
| En uygun senaryo | SaaS, sürekli dağıtılan servisler | Versiyonlanan yazılım, paralel sürüm desteği |
| CI/CD bağımlılığı | Zorunlu | Opsiyonel |

## GitFlow hâlâ ne zaman doğru seçim?

GitFlow, birden fazla sürümü aynı anda desteklemeniz gerektiğinde hâlâ doğru seçim. Örneğin bir masaüstü uygulamasının 3.x ve 4.x sürümlerine aynı anda güvenlik yaması çıkarmanız gerekiyorsa, `release/3.x` ve `release/4.x` dalları bu ayrımı doğal olarak taşır. Kütüphane ve SDK geliştiren ekipler, API uyumluluğunu dondurdukları sürüm dallarıyla korur; bu da GitFlow'un hotfix mekanizmasına tam olarak uyar. Mobil uygulama mağazası onay süreçleri de benzer bir gerekçe sunar: bir sürüm incelemede beklerken bir sonrakinin geliştirilmesi ayrı bir dalda sürebilir.

## Feature flag'ler olmadan trunk-based development güvenli mi?

Hayır. Feature flag'ler olmadan trunk-based development, yarım kalan özellikleri production'a sızdırma riski taşır. Flag, "kodu birleştirmek" ile "kodu kullanıcıya açmak" eylemlerini birbirinden ayırır: kod trunk'ta birleşir ama flag kapalı kaldığı sürece hiçbir kullanıcı o yolu görmez. [Feature flag rehberimizde](/tr/posts/feature-flag-teknik-borc) ele aldığımız gibi flag'lerin asıl riski unutulup teknik borca dönüşmeleri; her flag'in açılış planı kadar net bir kapanış tarihi de olmalı.

## Trunk-based development'a geçerken en sık yapılan hata nedir?

En sık hata, dal adını değiştirip süreci değiştirmemek. Bir ekip `develop` dalını kaldırıp doğrudan `main`'e birleşmeye başlar ama feature'ları hâlâ haftalarca açık tutar; sonuç, adı trunk-based olan ama davranışı GitFlow'dan farksız bir "gizli GitFlow" olur. Bunun belirtisi ölçülebilir: bir dal üç günden uzun açık kalıyorsa, model adı ne olursa olsun büyük merge çatışması riski aynı kalıyor. İkinci yaygın hata, feature flag'leri sadece açılış için kullanıp kapanış tarihini hiç planlamamak; birkaç ay sonra kod tabanında kimsenin anlamını bilmediği onlarca eski flag birikir.

Üçüncü bir hata, trunk'a hatalı bir şey birleştiğinde geri alma planının olmaması. Flag'in arkasındaki bir değişiklik için flag'i kapatmak saniyeler sürer; flag'siz, doğrudan trunk'a giden bir değişiklik için ise tek güvenli yol `git revert` ile yeni bir commit açmaktır, bu da CI'ın yeniden onayını gerektirir. Bu ikisi arasındaki hız farkı, flag kullanmanın sadece yarım özellik gizlemek değil, aynı zamanda bir hızlı geri alma mekanizması kurmak olduğunu gösteriyor.

## GitFlow'dan trunk-based development'a nasıl geçilir?

Geçiş tek adımda yapılmaz; sırayla üç aşamadan geçer: önce CI'ı her commit'te çalışacak şekilde sıkılaştırmak, sonra dalların yaşam süresini kısaltmak, en son GitFlow'un release/hotfix dallarını kaldırmak.

```bash
# 1. develop dalını trunk'a (main) birleştirip kapatın
git checkout main
git merge develop --no-ff
git branch -d develop

# 2. Her feature dalını 1-2 gün içinde birleştirmeyi zorunlu kılın
git checkout -b feature/kisa-omurlu main
# ... küçük commit'ler, günlük birleştirme ...
git checkout main && git merge feature/kisa-omurlu

# 3. release/* dallarını feature flag + CI gate ile değiştirin
```

Bu geçişin güvenli ilerlemesi dağıtım tarafında da bir adım gerektirir: [blue-green veya canary dağıtım](/tr/posts/blue-green-mi-canary-mi) gibi kademeli bir yayın stratejisi, trunk'tan doğrudan production'a çıkan her birleştirmenin geri alınabilir kalmasını sağlar. [CI/CD pipeline'ınızı sıfırdan kurma rehberimiz](/tr/posts/cicd-pipeline-nasil-kurulur) bu sıkılaştırmanın teknik adımlarını ayrıntılı anlatıyor.

Kişisel görüşüm şu: GitFlow'u "daha düzenli" diye savunmak çoğunlukla disiplinsizliği dallara saklamaktan ibaret. Asıl disiplin, küçük commit atıp sık birleştirmekte; bunu yapmayan bir ekip trunk-based development'a geçince de aynı sorunu, sadece daha büyük bir trunk üzerinde yaşar. Dal modelini değiştirmeden önce commit alışkanlığını değiştirmek gerekiyor; aksi hâlde sadece dal adı değişir, sorun aynı kalır.

Daha geniş dallanma modelleri karşılaştırması için [Git branch stratejileri rehberimize](/tr/posts/git-branch-stratejileri) bakabilirsiniz. DORA'nın tam metodolojisi [Accelerate araştırmasında](https://services.google.com/fh/files/misc/devops_guidebook_chapter1.pdf), Capital One'ın yayın sıklığı artışı [bu vaka incelemesinde](https://services.google.com/fh/files/misc/capital_one_case_study.pdf) ve trunk-based development'ın pratik kuralları [trunkbaseddevelopment.com](https://trunkbaseddevelopment.com/)'da detaylı.

## Hangi dört metrik geçişin işe yaradığını gösterir?

DORA'nın dört teslimat metriği (dağıtım sıklığı, değişiklik için bekleme süresi, değişiklik hata oranı, kurtarma süresi) geçişin gerçek bir etki yaratıp yaratmadığını gösterir; dal modelinin adı değil bu dört sayı geçişin başarısını kanıtlar. Geçiş öncesi ve geçişten 2-3 ay sonra bu dört metriği aynı panoda karşılaştırın: dağıtım sıklığı artarken değişiklik hata oranı da yükseliyorsa, sorun dal modelinde değil test kapsamınızdadır. [CI/CD pipeline rehberimizdeki](/tr/posts/cicd-pipeline-nasil-kurulur) otomatik test gate'leri, bu riski trunk-based development'a geçerken dengelemenin en doğrudan yolu.

## Sıkça Sorulan Sorular

### Trunk-based development küçük ekipler için de uygun mu?

Evet, hatta küçük ekiplerde geçiş daha kolay oluyor. Tek handikap, CI'ın her commit'te hızlı ve güvenilir çalışması; CI 20 dakikadan uzun sürüyorsa önce onu hızlandırmak, dal modelini değiştirmekten daha öncelikli bir iş.

### Trunk-based development ile code review nasıl yapılır?

Küçük pull request'lerle yapılır. Commit trunk'a girmeden önce review'dan geçer ama PR'ın küçük kalması (tipik olarak 400 satırdan az) review'u hızlı tutar; büyük PR'lar trunk-based development'ın hızını GitFlow'daki uzun dallara geri döndürür.

### GitFlow kullanan bir ekip aniden trunk-based development'a geçebilir mi?

Hayır, aniden geçmek riskli. Önce CI/test otomasyonunu sıkılaştırmak, sonra dal ömrünü kademeli kısaltmak, GitFlow'un release/hotfix dallarını en son kaldırmak gerekir; bu makalenin geçiş bölümündeki üç adım bu sırayı izliyor.

### Trunk-based development mobil uygulamalarda da işe yarar mı?

Evet, ama app store onay süreci nedeniyle flag'ler burada daha kritik hâle gelir. Kod trunk'a günlük birleşse de bir özelliğin kullanıcıya açılması, store onayından bağımsız olarak feature flag ile kontrol edilir.
