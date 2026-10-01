---
title: "Gözlemlenebilirliği CI/CD'ye Taşı: Shift-Left Rehberi"
slug: "shift-left-gozlemlenebilirlik-cicd"
translationKey: "shift-left-observability-cicd-2026"
locale: "tr"
excerpt: "Shift-left gözlemlenebilirlik, trace ve metrikleri üretimden önce teste ve CI/CD'ye taşımak demek. Sonuç: hatalar canlıya çıkmadan, test aşamasında yakalanıyor."
category: "devops-cloud"
tags: [observability, ci-cd, devops, monitoring]
publishedAt: "2026-10-01"
seoTitle: "Shift-Left Observability Nedir? CI/CD'ye Nasıl Taşınır"
seoDescription: "Shift-left gözlemlenebilirlik, telemetriyi test ve CI/CD'e taşır: OpenTelemetry kurulumu, SLO-as-code, synthetic check'ler ve kardinalite tuzakları."
---

Kısa cevap: Shift-left gözlemlenebilirlik, log/metrik/trace toplama işini üretim ortamından geriye, testlere ve CI/CD pipeline'ına taşımak demek. Amaç, bir sorunu kullanıcı fark etmeden önce, pull request aşamasında yakalamak — üretimde yangın söndürmek yerine.

## Shift-left gözlemlenebilirlik nedir?

Geleneksel gözlemlenebilirlik, bir sistemin üretimde nasıl davrandığını izlemeye odaklanır: log'lar, metrikler ve trace'ler üretim trafiğinden toplanır. Shift-left yaklaşımı aynı telemetriyi — standart kütüphaneler, enstrümantasyon, izleme kancaları — yazılım geliştirme döngüsünün daha erken aşamalarına, build ve test adımlarına taşıyor.

Pratikte bu, bir geliştiricinin test paketini çalıştırdığında sadece "geçti/kaldı" sonucu değil, o testin trace'ini de görmesi anlamına geliyor. Bir regresyon, üretime gitmeden önce CI'da bir trace anomalisi olarak yakalanıyor.

## Telemetriyi erken enstrümante etmek ne demek?

Dört somut pratik var: testlerde trace toplama, kod olarak SLO tanımlama, pipeline'a synthetic check ekleme ve preview ortamlarına telemetri bağlama. Bu dördü birlikte, bir değişikliğin üretim davranışını merge edilmeden önce tahmin etmeyi mümkün kılıyor.

- **Testlerde trace:** Entegrasyon testleri, bir servisin çağrı zincirini gerçek üretim trace formatında üretir; CI bu trace'i "beklenen" bir referansla karşılaştırabilir.
- **SLO-as-code:** Hizmet seviyesi hedefleri (örneğin "p99 gecikme < 200ms") bir YAML dosyasında tanımlanır ve CI, bir PR'ın bu hedefi ihlal edip etmediğini build sırasında kontrol eder.
- **Pipeline'da synthetic check:** Gerçek kullanıcı trafiğini simüle eden sentetik istekler, staging ortamına deploy'dan hemen sonra, prod'a geçmeden önce çalıştırılır.
- **Preview ortamlarında telemetri:** Her PR'ın kendi [önizleme veritabanı](/tr/posts/her-pr-icin-onizleme-veritabani) ve ortamı varsa, bu ortama da üretimdekiyle aynı enstrümantasyon bağlanır — böylece bir performans regresyonu merge'den önce görülür.

Bu dört pratiği pipeline aşamasına göre özetlersek:

| Pipeline Aşaması | Toplanan Telemetri | Amaç |
|---|---|---|
| Birim/entegrasyon testi | Trace (test ortamı) | Regresyonu merge öncesi yakalama |
| CI build | SLO-as-code kontrolü | PR'ın hedefi ihlal edip etmediğini görme |
| Staging deploy | Synthetic check | Prod'a geçmeden davranışı doğrulama |
| Preview ortamı | Tam telemetri (prod-benzeri) | PR bazlı performans regresyonunu yakalama |
| Üretim | Log + metrik + trace | Gerçek kullanıcı davranışı, uzun vadeli SLO takibi |

## Shift-left, üretim izlemesinin (shift-right) yerini mi alıyor?

Hayır — ikisi birbirini besliyor. Shift-left gözlemlenebilirlik, üretimdeki gerçek trafiği izlemenin (shift-right) yerine geçmiyor; ona bir erken uyarı katmanı ekliyor. Pratikte akış şöyle işliyor: üretimde toplanan gerçek trace'ler ve SLO ihlalleri, CI'daki "referans" (baseline) trace'leri güncellemek için kullanılıyor. Yani üretim verisi, bir sonraki PR'ın CI'da neyle karşılaştırılacağını belirliyor — döngü kapanıyor.

Bu kapalı döngü olmadan shift-left'in referans noktası statik ve çabuk eskiyen bir trace dosyasına dönüşür. Örneğin bir e-ticaret ekibi, ödeme akışının üretimdeki p99 gecikmesini haftalık olarak CI'daki SLO kuralına geri besliyorsa, kural zamanla gerçek kullanıcı davranışından kopmuyor. Bu geri besleme otomatikleştirilmezse, SLO kuralı birkaç ay içinde ya çok gevşek ya da çok sıkı hale geliyor ve geliştiriciler kurala güvenmeyi bırakıyor.

Bir platform ekibi bu döngüyü kurduğunda, aslında [gözlemlenebilirlik 101](/tr/posts/observability-nedir) yazımızda anlattığımız log/metrik/trace üçlüsünü, tek yönlü bir izleme aracından, geliştirme döngüsünün her iki ucunu da besleyen bir geri bildirim sistemine dönüştürmüş oluyor.

## Sinyallerin sahibi geliştirici mi, platform ekibi mi olmalı?

İkisi birden, ama farklı katmanlarda. Platform ekibi, enstrümantasyon standardını, toplama altyapısını ve varsayılan panoları sağlar; geliştirici ise kendi servisinin hangi sinyalleri ürettiğine ve bu sinyallerin anlamına sahip çıkar. Bir geliştirici kendi trace'ini okuyamıyorsa, shift-left'in asıl faydası kayboluyor — sinyal var ama kimse ona bakmıyor.

Bu sahiplenme modeli, [platform mühendisliği](/tr/posts/platform-muhendisligi-devops) pratiğindeki "self-servis" ilkesiyle örtüşüyor: platform ekibi altyapıyı kurar, geliştirici ekip onu kendi iş akışında kullanır. Bu ayrımı net tutmayan ekiplerde sık görülen bir sorun var: platform ekibi her servis için trace panosu kuruyor ama hangi panoyu kimin izlediği belirsiz kalıyor, sonuçta hiç kimse gerçek sahibi olmuyor.

## Maliyeti performansla nasıl ilişkilendirirsin?

Telemetriyi erken toplamanın bir yan faydası var: maliyet verisi de erken görünür hale geliyor. Bir PR'ın CI'da ürettiği trace hacmi ile o PR'ın üretimdeki beklenen kardinalitesini karşılaştırmak, [gözlemlenebilirlik faturasını büyümeden önce](/tr/posts/gozlemlenebilirlik-faturasini-dusur) düşürmenin en ucuz yolu. Bir değişiklik CI'da zaten yüksek kardinaliteli bir etiket (örneğin kullanıcı ID'si bazlı bir metrik etiketi) ekliyorsa, bu merge edilmeden önce fark ediliyor — üretimde fatura patladıktan sonra değil.

## OpenTelemetry ile başlangıç kurulumu nasıl yapılır?

En hızlı başlangıç: olgun otomatik enstrümantasyon desteği olan bir dilden (Java, Go, Python, Node.js, .NET) başlamak ve CI pipeline'ına tek bir adım eklemek — testleri OpenTelemetry Collector'a export edip, sonucu bir referans trace ile karşılaştırmak.

```yaml
# .github/workflows/test-with-tracing.yml
steps:
  - name: Run integration tests with tracing
    run: npm test
    env:
      OTEL_EXPORTER_OTLP_ENDPOINT: http://otel-collector:4318
      OTEL_SERVICE_NAME: checkout-service-ci
  - name: Compare trace against baseline
    run: otel-diff --baseline ./baseline-trace.json --current ./ci-trace.json
```

Bu kurulum, [OpenTelemetry'e başlangıç rehberimizde](/tr/posts/opentelemetry-baslangic-rehberi) anlatılan temel enstrümantasyonun üzerine inşa ediliyor; CI'a eklenen tek fark, trace'in üretime değil, test ortamına bağlanması.

Bu adımı pipeline'a eklerken en sık yapılan hata, `otel-diff` gibi bir karşılaştırma adımını build'i başarısız kılacak şekilde sert (hard-fail) ayarlamak. İlk birkaç hafta bu adımı sadece uyarı (soft-fail) olarak çalıştırıp, referans trace'in gerçekten doğru bir temel oluşturduğundan emin olduktan sonra sert kurala geçmek, CI'ın güvenilirliğini koruyor.

## Shift-left gözlemlenebilirliğin tuzakları neler?

En sık karşılaşılan iki tuzak: alarm yorgunluğu ve kardinalite patlaması. Her PR'da yeni bir sentetik check veya SLO kuralı eklemek, kısa sürede CI'ı anlamsız kırmızı çarpılarla dolduruyor; geliştiriciler bu alarmları görmezden gelmeye başlıyor. Benzer şekilde, testlerde yüksek kardinaliteli etiketler (her test çalıştırması için benzersiz bir ID gibi) kullanmak, CI'ın kendi gözlemlenebilirlik altyapısını şişiriyor — asıl önlemeye çalıştığınız sorunu CI içinde yeniden üretiyorsunuz.

Bize göre pratik çözüm şu: shift-left'i bir anda her yere yaymak yerine, önce tek bir kritik servise, tek bir SLO kuralına uygulamak ve o kuralın gerçekten gürültüsüz çalıştığını doğrulamak. Genişletmek, güven kazandıktan sonra gelmeli.

Kardinalite patlamasını önceden fark etmenin basit bir yolu var: CI'da yeni eklenen her metrik etiketinin olası değer sayısını (cardinality) build adımında kontrol etmek. Bir etiketin değer sayısı, test verisinde bile binlerce benzersiz değere ulaşıyorsa, bu üretimde milyonlarca değere çıkacağının erken bir işareti. Bu kontrolü CI'a eklemek, [gözlemlenebilirlik faturasını düşürme](/tr/posts/gozlemlenebilirlik-faturasini-dusur) yazımızda anlattığımız sampling ve kardinalite azaltma tekniklerini, üretime çıkmadan önce uygulamanızı sağlıyor.

## Sıkça Sorulan Sorular

### Shift-left gözlemlenebilirlik, shift-left test etmekten farklı mı?

Evet. Shift-left test etmek, hataları erken yakalamaya odaklanır (birim testi, entegrasyon testi). Shift-left gözlemlenebilirlik ise bir adım öteye gidip, üretimde kullanacağınız aynı trace/metrik enstrümantasyonunu test aşamasında da çalıştırmayı hedefler — böylece bir değişikliğin üretim davranışını merge etmeden önce tahmin edebilirsiniz.

### Shift-left gözlemlenebilirlik için hangi araçlar gerekli?

Temel gereksinim bir OpenTelemetry Collector ve CI pipeline'ınıza ekleyebileceğiniz bir export adımı. SLO-as-code için ek bir araç (örneğin bir YAML tabanlı SLO tanımlayıcı) faydalı olur, ama zorunlu değil; basit bir eşik kontrolüyle de başlanabilir.

### Küçük bir ekip shift-left gözlemlenebilirliğe nereden başlamalı?

En kritik bir servisten başlayın: o servisin testlerine trace enstrümantasyonu ekleyin ve CI'da tek bir SLO kuralı (örneğin gecikme eşiği) tanımlayın. Bu kuralın birkaç hafta gürültüsüz çalıştığını gördükten sonra diğer servislere genişletin.

### Shift-left gözlemlenebilirlik gözlemlenebilirlik maliyetini artırır mı yoksa azaltır mı?

Doğru uygulandığında azaltır. Yüksek kardinaliteli etiketler ve gereksiz metrikler, üretime çıkmadan CI'da fark edilir; bu da üretimdeki gözlemlenebilirlik faturasının büyümeden önlenmesini sağlar. Yanlış uygulandığında ise (her PR'a kontrolsüz check eklemek gibi) hem CI maliyetini hem alarm yorgunluğunu artırabilir. Bu yüzden ölçümü soft-fail modunda başlatıp, gürültüyü azalttıktan sonra sert kurala geçmek güvenli bir ilerleme hızı sağlıyor.
