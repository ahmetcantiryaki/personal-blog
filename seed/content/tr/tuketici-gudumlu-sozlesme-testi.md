---
title: "Mikroservislerde Tüketici Güdümlü Sözleşme Testi"
slug: "tuketici-gudumlu-sozlesme-testi"
translationKey: "consumer-driven-contract-testing-2026"
locale: "tr"
excerpt: "Kısa cevap: Tüketici beklentisini sözleşmeye yazar, sağlayıcı bağımsız doğrular; can-i-deploy kırık entegrasyonları deploy öncesinde yakalar."
category: "software-engineering"
tags: ["testing", "microservices", "api-design", "ci-cd"]
publishedAt: "2026-09-18"
seoTitle: "Tüketici Güdümlü Sözleşme Testi: Pact ile Rehber"
seoDescription: "Kısa cevap: Tüketici beklentisini sözleşmeye yazar, sağlayıcı bağımsız doğrular; can-i-deploy kırık entegrasyonları deploy öncesinde yakalar."
---

Kısa cevap: Tüketici güdümlü sözleşme testinde (consumer-driven contract testing) tüketici servis, sağlayıcıdan tam olarak ne beklediğini makine okunabilir bir sözleşme (contract) olarak yazar; sağlayıcı servis bu sözleşmeyi kendi CI'ında bağımsız doğrular ve ikisi hiçbir zaman aynı ortamda birlikte test edilmeden production'da uyumlu çalışacağından emin olunur. Pact bu modelin en yaygın uygulanan aracı ve `can-i-deploy` komutu, kırık bir entegrasyonu deploy'dan önce yakalıyor.

## Entegrasyon testleri ve versiyonlama neden yetmiyor?

Uçtan uca entegrasyon testleri, tüm servisleri aynı anda ayağa kaldırmayı gerektirdiği için yavaş, kırılgan ve genelde CI'da güvenilmez hâle geliyor; bir servisin API'sini değiştiren geliştirici de o değişikliğin hangi tüketicileri etkilediğini çoğu zaman bilmiyor. [API versiyonlama stratejileri](/tr/posts/api-versiyonlama-stratejileri) bu sorunu kısmen çözüyor ama versiyon numarası tek başına bir tüketicinin gerçekte hangi alanlara, hangi formatta bağımlı olduğunu söylemiyor.

Sonuç olarak ekipler, bir API değişikliğinin production'da hangi tüketicileri kıracağını genelde olay gerçekleştikten sonra, hata izleme araçlarından öğreniyor. Sözleşme testi bu geri bildirim döngüsünü CI aşamasına, yani değişiklik henüz deploy edilmeden önceye taşıyor — hatayı üretimde bulmak yerine bir pull request'te bulmak, düzeltme maliyetini kat kat azaltıyor.

## Tüketici güdümlü sözleşmeler nasıl çalışıyor?

Tüketici takımı, kendi servisinin sağlayıcıdan tam olarak hangi istekleri yapacağını ve hangi yanıtları beklediğini test kodu olarak yazıyor; bu testler çalıştığında bir JSON sözleşme dosyası üretiyor. Sağlayıcı takımı bu sözleşmeyi kendi CI pipeline'ında okuyup, gerçek servisine karşı çalıştırarak her beklentiyi karşılayıp karşılamadığını bağımsız olarak doğruluyor.

İki taraf da paylaşılan sözleşmeye sadık kalırsa, hiçbir zaman aynı test ortamında birlikte çalıştırılmadan production'da sorunsuz çalışacakları garanti ediliyor. Bu, klasik entegrasyon testinin tersi bir model: sözleşmeyi tüketici tanımlıyor ("consumer-driven"), sağlayıcı ise kendi API'sinin genel şemasını değil, gerçekte kimin neyi kullandığını doğruluyor. Adlandırmadaki "tüketici güdümlü" ifadesi de tam olarak buradan geliyor — sözleşmenin kapsamını sağlayıcının API dokümantasyonu değil, tüketicinin gerçek kullanım deseni belirliyor.

## Pact Broker ve can-i-deploy nasıl çalışıyor?

Bir Pact Broker (kendi barındırdığınız) veya PactFlow (yönetilen SaaS) sözleşmeleri merkezi olarak paylaşıyor, her sözleşmenin hangi tüketici ve sağlayıcı versiyonuna ait olduğunu takip ediyor ve `can-i-deploy` komutunun sorgulayacağı veriyi tutuyor. `can-i-deploy`, deploy etmeden önce, deploy edilecek servisin taraf olduğu her tüketici-sağlayıcı çiftinin hedef ortam etiketine karşı başarıyla doğrulanıp doğrulanmadığını kontrol ederek deploy'u kapı gibi kilitliyor.

```bash
# Deploy'dan önce: bu servisin tüm sözleşmeleri production'a karşı doğrulanmış mı?
pact-broker can-i-deploy \
  --pacticipant siparis-servisi \
  --version $GIT_SHA \
  --to-environment production
```

Bu komut sıfır olmayan bir çıkış koduyla dönerse CI pipeline'ı deploy adımını durduruyor — yani kırık bir sözleşme, kodun production'a ulaşmasından önce fiziksel olarak engelleniyor.

## CI'da tipik bir Pact akışı nasıl kurulur?

Tipik bir kurulum üç aşamadan oluşuyor: tüketici tarafında sözleşme testleri çalışıp broker'a yayınlanıyor, sağlayıcı tarafında bu sözleşmelere karşı doğrulama çalışıyor ve sonuç yine broker'a yazılıyor, son olarak her iki taraf da deploy öncesi `can-i-deploy` ile kapı kontrolü yapıyor.

```yaml
# .github/workflows/contract-test.yml (özet)
jobs:
  consumer-tests:
    steps:
      - run: npm test -- --grep pact
      - run: pact-broker publish ./pacts --consumer-app-version=$GIT_SHA

  provider-verification:
    needs: consumer-tests
    steps:
      - run: npm run pact:verify
      - run: pact-broker can-i-deploy --pacticipant siparis-servisi --version $GIT_SHA --to-environment production
```

Bu akış JavaScript, Java ve Python dahil çoğu büyük dilde aynı mantıkla uygulanabiliyor; Pact'in dil bazlı kütüphaneleri sözleşme formatını ortak tutuyor, böylece farklı dillerde yazılmış tüketici ve sağlayıcılar birbirini doğrulayabiliyor.

Sağlayıcı doğrulaması genelde tüketici testlerinden ayrı bir CI job'ında çalışıyor çünkü sağlayıcı takımının kendi deploy döngüsü tüketiciden bağımsız — bir sağlayıcı, birden fazla tüketicinin sözleşmelerini aynı anda doğrulamak zorunda kalabiliyor. Bu yüzden broker'daki "pacticipant" kavramı önemli: her servis (tüketici ya da sağlayıcı olsun) broker'da ayrı bir pacticipant olarak kayıtlı ve `can-i-deploy` komutu bu pacticipant'ın tüm ilişkili sözleşmelerini tek seferde sorguluyor.

## Sözleşme değişiklikleri takımlar arasında nasıl yönetilir?

Bir tüketici yeni bir alan talep ettiğinde veya mevcut bir beklentisini değiştirdiğinde, güncellenmiş sözleşme broker'a yayınlanıyor ama sağlayıcı bu değişikliği kendi doğrulama testini güncelleyip geçirene kadar `can-i-deploy` sağlayıcının yeni sürümünü production'a göndermesine izin vermiyor. Bu, API değişikliklerini "önce iletişim kur, sonra deploy et" yerine "sözleşmeyi güncelle, CI seni durdurmasın diye sağlayıcıyı da güncelle" akışına dönüştürüyor — iletişim hâlâ gerekiyor ama artık bir Slack mesajına değil, CI'ın kendisine bağlı bir zorunluluk.

## Yaygın tuzaklar neler?

En sık karşılaşılan tuzak aşırı belirleme (over-specification): tüketici, gerçekte kullanmadığı alanları da sözleşmeye eklerse, sağlayıcı o alanları hiç değiştirmese bile ilgisiz bir alan değişikliğinde sözleşme kırılıyor gibi görünüyor. Sözleşmeye yalnızca gerçekten tükettiğiniz alanları koymak, gereksiz kırılganlığı büyük ölçüde azaltıyor.

İkinci yaygın sorun sahiplik belirsizliği: sözleşme kırıldığında kimin düzelteceği net değilse (tüketici mi değişikliği geri almalı, sağlayıcı mı eski davranışı korumalı) takımlar arasında sürtünme çıkıyor. Bunu önlemek için sözleşme kırılmalarını, kod review sürecine benzer şekilde, iki takımın da onayladığı bir değişiklik talebi gibi ele almak gerekiyor. Üçüncü tuzak, sözleşme testlerinin flaky hâle gelmesi — genelde sağlayıcı doğrulama ortamının gerçek veri durumuyla tutarsız kalmasından kaynaklanıyor; sağlayıcı tarafında her sözleşme senaryosu için sabit (deterministic) bir test fixture kullanmak bu sorunu büyük ölçüde çözüyor.

Dördüncü bir tuzak, çok sayıda mikroservisi olan büyük organizasyonlarda ortaya çıkıyor: her tüketici-sağlayıcı çifti ayrı bir sözleşme demekse, yüzlerce servisli bir sistemde binlerce sözleşme birikebiliyor ve bunları kimin güncel tuttuğunu takip etmek ayrı bir yönetişim sorununa dönüşüyor. Böyle ölçeklerde sözleşme sahipliğini takım bazında net bir şekilde dokümante etmek ve broker'ın "pacticipant" etiketlerini takım isimleriyle eşleştirmek, sözleşme yığınının kontrolden çıkmasını önlüyor.

| Yaklaşım | Hız | Kapsam | En iyi senaryo |
|---|---|---|---|
| Uçtan uca entegrasyon testi | Yavaş | Geniş ama kırılgan | Az sayıda kritik akış |
| Şema/OpenAPI doğrulama | Hızlı | Yapıyı kontrol eder, davranışı değil | Genel API sözleşmesi |
| Tüketici güdümlü sözleşme (Pact) | Hızlı | Gerçek kullanım alanlarına odaklı | Çok sayıda mikroservis çifti |

## Sıkça Sorulan Sorular

### Tüketici güdümlü sözleşme testi nedir?

Tüketici servisin sağlayıcıdan tam olarak ne beklediğini makine okunabilir bir sözleşme olarak tanımladığı, sağlayıcının da bu sözleşmeyi kendi CI'ında bağımsız doğruladığı bir test yaklaşımıdır; iki servis hiçbir zaman aynı ortamda birlikte çalıştırılmadan uyumluluğu garanti eder.

### can-i-deploy tam olarak neyi engelliyor?

Deploy edilecek servisin taraf olduğu her tüketici-sağlayıcı sözleşmesinin hedef ortama karşı başarıyla doğrulanıp doğrulanmadığını kontrol ediyor; herhangi bir sözleşme doğrulanmamışsa komut sıfır olmayan bir çıkış koduyla dönüp CI pipeline'ındaki deploy adımını durduruyor.

### Pact hangi programlama dillerini destekliyor?

Pact'in resmi kütüphaneleri JavaScript, Java ve Python dahil çoğu büyük dili destekliyor; sözleşme formatı dilden bağımsız olduğu için farklı dillerde yazılmış tüketici ve sağlayıcı servisler birbirini sorunsuz doğrulayabiliyor.

### Sözleşme testi ile şema (OpenAPI) doğrulaması aynı şey mi?

Hayır. Şema doğrulaması bir API'nin genel yapısını (alan tipleri, zorunlu alanlar) kontrol ederken, tüketici güdümlü sözleşme testi gerçek bir tüketicinin gerçekte hangi alanları nasıl kullandığını doğruluyor — bu yüzden şema geçerli olsa bile gerçek bir tüketicinin beklentisini kıran bir değişiklik sözleşme testinde yakalanabiliyor.

Mikroservis mimarisine geçip geçmeme kararınızı [mikroservis mi monolit mi yazımızla](/tr/posts/mikroservis-mi-monolit-mi), API tasarım tercihlerinizi [REST mi GraphQL mi karşılaştırmamızla](/tr/posts/rest-mi-graphql-mi) netleştirebilirsiniz; sözleşme testlerini pipeline'a eklerken [CI/CD pipeline kurulum rehberimiz](/tr/posts/cicd-pipeline-nasil-kurulur) faydalı bir başlangıç noktası. Daha fazla yazılım mühendisliği içeriği için [Yazılım Mühendisliği kategorimize](/tr/category/yazilim-muhendisligi) bakabilirsiniz.

Kaynaklar: [Pact'in resmi dokümantasyonu](https://docs.pact.io/) ve [PactFlow'un can-i-deploy rehberi](https://pactflow.io/blog/can-i-deploy/).
