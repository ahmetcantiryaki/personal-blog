---
title: "API Versiyonlama Stratejileri"
slug: "api-versiyonlama-stratejileri"
translationKey: "api-versioning-strategies-2026"
locale: "tr"
excerpt: "URI, header ve media-type versiyonlama arasındaki farklar, additive değişiklik disiplini, Sunset header'ları ve v2'ye ne zaman geçileceği: sahadan notlar."
category: "software-engineering"
tags: ["api-design", "rest", "backend", "best-practices"]
publishedAt: "2026-08-03"
seoTitle: "API Versiyonlama Stratejileri: Sahadan Rehber (2026)"
seoDescription: "URI, header ve media-type versiyonlama arasındaki farklar, additive değişiklik disiplini, Sunset header'ları ve v2'ye ne zaman geçileceği: sahadan notlar."
---

Bir API'yi müşterileri kırmadan evrimleştirmenin tek doğru yolu yok — ama yanlış yapmanın onlarca yolu var. Kısa cevap: mümkün olduğunca additive (geriye dönük uyumlu) değişiklik yapın, versiyonlamayı son çare olarak kullanın ve gerçekten versiyonlamanız gerektiğinde tercihi URI yerine header tabanlı yaklaşıma verin. Aşağıda bu kararı sahada nasıl verdiğimizi, hangi tuzaklara düştüğümüzü ve bir deprecation'ı nasıl yönettiğimizi anlatıyorum.

## URI, Header ve Media-Type Versiyonlama: Üçünün de Bedeli Var

`/v2/users` gibi URI tabanlı versiyonlama en yaygın seçim çünkü basit, curl ile test edilebilir ve önbelleklenmesi kolay. Bedeli şu: her yeni versiyon, aynı kaynağın paralel bir kopyasını taşımak zorunda kalır ve `/v1` ile `/v2` arasında route düzeyinde çatallanma büyür.

Header tabanlı versiyonlama (`Api-Version: 2026-08-03` gibi bir custom header ya da `Accept: application/vnd.acme.v2+json` media-type) URI'yi temiz tutar ve istemcinin hangi kaynağı istediğini değil, o kaynağı nasıl yorumlamak istediğini bildirir — bu, [Stripe'ın tarih tabanlı versiyonlama modeline](https://docs.stripe.com/api/versioning) yakın bir yaklaşım. Bedeli: keşfedilebilirlik düşer, dokümantasyon ve test araçları header'ları göstermek için ekstra iş ister.

| Yaklaşım | Avantaj | Dezavantaj | Nerede İyi Çalışır |
| --- | --- | --- | --- |
| URI (`/v2/...`) | Basit, önbelleklenebilir, curl-dostu | Route çatallanması, kaynak kopyaları | Küçük-orta ekip, herkese açık API |
| Header / media-type | Kaynak URI'si temiz kalır, ince taneli kontrol | Keşfedilebilirlik düşük, tooling yükü | Yüksek trafikli, enterprise API |
| Tarih tabanlı header (Stripe modeli) | Her müşteri kendi "donduğu" tarihte kalır | Sunucu tarafında çok sayıda davranış dalı yönetmek gerekir | Ödeme/finans gibi kritik alanlar |

## Additive Değişiklik Disiplini: Versiyonlamadan Önceki Son Savunma Hattı

Pratikte versiyon numarasını artırmadan önce sorulması gereken soru şu: bu değişiklik gerçekten yıkıcı mı? Yeni bir alan eklemek, opsiyonel bir parametre tanımlamak veya yeni bir endpoint açmak neredeyse hiçbir zaman yıkıcı değildir — mevcut istemciler bilinmeyen alanları yok sayar. Yıkıcı olan; bir alanı kaldırmak, tipini değiştirmek, zorunlu hale getirmek ya da hata kodlarının anlamını değiştirmektir.

Additive disiplinin pratikte işe yaraması için üç kural yeterli:
1. Yeni alanlar her zaman opsiyonel başlar, varsayılan değer taşır.
2. Enum'lara yeni değer eklemek, istemcinin bilinmeyen değerleri güvenle yok saydığı bir sözleşmeye bağlıdır — bu sözleşmeyi dokümante edin.
3. Response şeklini değiştirmek yerine yeni bir alan ekleyip eskisini deprecate edin; kaldırmayı ayrı bir adımda, ayrı bir duyuruyla yapın.

## Deprecation Politikası: Sunset Header'ları ve İletişim

Bir alanı veya endpoint'i gerçekten kaldırmanız gerektiğinde, [RFC 8594](https://www.rfc-editor.org/info/rfc8594/) tam da bunun için var: `Sunset` header'ı, bir kaynağın hangi tarihte yanıt vermeyi bırakacağını taşır. Pratikte bu, `Deprecation` header'ı (deprecation'ın başladığı an) ile birlikte kullanılır — `Deprecation` "artık önerilmiyor" der, `Sunset` "şu tarihte tamamen kapanacak" der.

```http
HTTP/1.1 200 OK
Deprecation: Tue, 01 Sep 2026 00:00:00 GMT
Sunset: Mon, 01 Mar 2027 00:00:00 GMT
Link: <https://api.example.com/docs/migration-v2>; rel="sunset"
```

GitHub ve Stripe'ın da uyguladığı pratik şu: sunset tarihinden önce istemcilere e-posta, dashboard uyarısı ve response header'ı olmak üzere en az üç kanaldan bildirim yapılır. Tek bir changelog satırına güvenmek, üretimde sessizce kırılan entegrasyonlar demek.

## Tüketici Odaklı Kontrat Testleri: Kırılmayı Merge Öncesinde Yakalamak

En sinsi kırılmalar, "additive" sandığınız bir değişikliğin aslında bir istemcinin gizli bir varsayımını bozmasıdır — örneğin bir alanın sırasına veya null olup olmamasına güvenen bir istemci. [Consumer-driven contract testler](https://docs.pact.io/) (Pact gibi araçlarla), her tüketici ekibin "benim ihtiyacım olan sözleşme bu" diye tanımladığı bir beklenti dosyasını sağlayıcı tarafında CI'da çalıştırarak bu sınıf hataları merge öncesinde yakalar. Bu, entegrasyon testlerinin yerini almaz; onun bir katman öncesinde çalışan, çok daha ucuz bir erken uyarı sistemidir.

## v2'ye Çatallanma mı, v1'i Evrimleştirme mi

Gerçek bir v2 açmak — yeni bir kaynak modeli, yeni bir kimlik doğrulama şeması, yeni bir hata formatı gerektiren köklü bir değişiklik — pahalıdır: iki kod yolunu paralel işletmek, iki dokümantasyon setini güncel tutmak ve müşterileri geçişe ikna etmek zorundasınızdır. Bu yüzden pratik kural şu: eğer değişikliğiniz additive kurallarla çözülebiliyorsa v1'de kalın; yalnızca kaynak modelinin temel varsayımı değiştiğinde (örneğin tekil kaynaktan çoklu-tenant modele geçiş) gerçek bir v2 açın.

## GraphQL ve gRPC'de Evrim Farklı Çalışır

REST'in aksine GraphQL, şema evrimini `@deprecated` direktifiyle alan bazında yönetir — istemci hâlâ eski alanı sorgulayabilir, sunucu deprecation uyarısını response meta verisinde taşır; ayrı bir v2 endpoint'ine neredeyse hiç gerek kalmaz. gRPC ise Protocol Buffers'ın alan numaralandırma disiplinine dayanır: alan numaraları asla yeniden kullanılmaz, yeni alanlar her zaman opsiyoneldir ve `reserved` anahtar sözcüğüyle kaldırılan alan numaraları gelecekte kazara yeniden kullanılmaktan korunur.

| Protokol | Evrim Mekanizması | Versiyonlama İhtiyacı |
| --- | --- | --- |
| REST | URI/header versiyonlama + additive değişiklik | Yıkıcı değişiklikte gerekli |
| GraphQL | Alan bazlı `@deprecated`, tek şema | Nadiren, genelde gereksiz |
| gRPC | `.proto` alan numaralandırma + `reserved` | Paket adı bazlı (`v1`, `v2`) opsiyonel |

## OpenAPI Şema Diff'i: Otomatik Kırılma Tespiti

Yukarıdaki disiplinin insan gözünden kaçtığı yerler oluyor — özellikle büyük bir takımda, herkes "additive" kuralını aynı titizlikle uygulamıyor. Burada devreye CI'da çalışan OpenAPI şema diff araçları giriyor (örneğin `oasdiff` veya `openapi-diff`): her PR'da mevcut şema ile önerilen şema karşılaştırılır, bir alan kaldırılıyorsa, tipi değişiyorsa veya zorunlu hale geliyorsa build kırmızı olur. Bu, additive disiplini "iyi niyet kuralı" olmaktan çıkarıp otomatik bir kapı haline getirir — ve code review'da gözden kaçan yıkıcı değişikliklerin production'a sızmasını önler.

```bash
oasdiff breaking openapi-v1.yaml openapi-v2-candidate.yaml --fail-on ERR
```

Bu tür bir kontrolü CI/CD pipeline'ınıza eklemek isteyenler, pipeline'ın genel kurulumu için [sıfırdan CI/CD pipeline rehberimize](/tr/posts/cicd-pipeline-nasil-kurulur) bakabilir; şema diff adımı, test adımından önce, deploy'dan çok daha ucuz bir noktada çalışacak şekilde konumlandırılmalı.

## Deprecation Runbook: Adım Adım

1. Kaldırılacak alanı/endpoint'i belirleyin, additive bir alternatif zaten var mı kontrol edin.
2. `Deprecation` header'ını ekleyin, dashboard ve e-posta duyurusunu aynı gün yapın.
3. Kullanım metriklerini izleyin — deprecate edilen alanı hâlâ çağıran istemcileri isimlendirerek doğrudan iletişime geçin.
4. `Sunset` tarihini en az 90 gün ileriye koyun (kritik finans/ödeme API'lerinde 180 gün daha güvenli).
5. Sunset tarihinden bir hafta önce son bir hatırlatma gönderin.
6. Sunset tarihinde endpoint'i 410 Gone ile yanıtlayın, migration linkini response body'de tutun.

Bu disiplini idempotent endpoint tasarımıyla birleştirmek isteyenler [idempotent API tasarımı rehberimize](/tr/posts/idempotent-api-tasarimi), REST ile GraphQL arasında seçim yapmakta kararsız olanlar [REST mi GraphQL mi karşılaştırmamıza](/tr/posts/rest-mi-graphql-mi) bakabilir. Kategorideki diğer yazılar için [Yazılım Mühendisliği bölümümüzü](/tr/category/yazilim-muhendisligi) takip edebilirsiniz.

## Sıkça Sorulan Sorular

### URI mi header tabanlı versiyonlama mı daha iyi?

İkisi de geçerli; seçim ekip büyüklüğüne ve API'nin kullanım şekline bağlı. URI versiyonlama basit ve keşfedilebilir olduğu için küçük-orta ölçekli herkese açık API'lerde iyi çalışır; header/media-type versiyonlama, kaynak URI'sini temiz tutmak isteyen yüksek trafikli enterprise API'lerde tercih edilir.

### Sunset header'ı zorunlu mu?

Hayır, RFC 8594 bir standart öneridir, zorunluluk değildir. Ancak istemcilere somut bir kapanış tarihi vermenin en net, makine tarafından da okunabilen yolu olduğu için deprecation iletişiminde güçlü bir en iyi pratiktir.

### Consumer-driven contract test, entegrasyon testinin yerini tutar mı?

Hayır. Contract testler, sağlayıcı ile tüketici arasındaki sözleşmeyi CI'da hızlıca doğrular; gerçek ortam entegrasyon testlerinin yerine değil, onlardan önceki ucuz bir erken uyarı katmanı olarak çalışır.

### v1'i sonsuza kadar desteklemek zorunda mıyım?

Hayır, ama kaldırma her zaman açık bir Sunset tarihi, çok kanallı iletişim ve makul bir geçiş süresiyle (genellikle en az 90 gün) yapılmalı. Sessizce kaldırmak, güveni kalıcı olarak zedeler.
