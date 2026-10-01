---
title: "Platform Mühendisliği DevOps'un Yerini mi Alıyor?"
slug: "platform-muhendisligi-devops"
translationKey: "platform-engineering-idp-guide-2026"
locale: "tr"
excerpt: "Hayır, DevOps ölmedi; platform mühendisliği onu tamamlıyor. Gartner, 2026'da ekiplerin %80'inin platform ekibi kuracağını öngörüyor, 2023'te oran %43'tü."
category: "devops-cloud"
tags: [platform-engineering, devops, automation, developer-experience]
publishedAt: "2026-10-01"
seoTitle: "Platform Mühendisliği Nedir? DevOps'tan Farkı ve IDP Rehberi"
seoDescription: "Platform mühendisliği DevOps'un yerini almıyor, onu otomatikleştiriyor. 2026'da 500+ mühendisli şirketlerin %78'inde platform ekibi var; IDP kurma adımları."
---

Kısa cevap: Hayır, platform mühendisliği DevOps'un yerini almıyor — DevOps'un prensiplerini (otomasyon, kendi kendine servis, paylaşılan sorumluluk) somut bir ürüne, yani İç Geliştirici Platformu'na (IDP) dönüştürüyor. 500'den fazla mühendisi olan şirketlerde özel bir platform ekibi oranı 2023'te %43 iken 2026'da %78'e çıktı; bu, disiplinin pratik bir rol haline geldiğini gösteriyor.

## Platform mühendisliği nedir?

Platform mühendisliği, geliştiricilerin altyapıyı kendi başlarına, güvenli ve standart yollarla kullanabilmesi için bir iç platform tasarlayıp işleten disiplin. Bu platform tipik olarak kendi kendine servis araçları, "golden path" adı verilen önceden onaylanmış şablon iş akışları, otomasyon katmanları ve kullanım metrikleri içerir.

Gartner, 2026 sonunda yazılım mühendisliği organizasyonlarının %80'inin bir platform ekibine sahip olacağını öngörüyor. Bağımsız anketler bu rakamı doğruluyor: organizasyonların %89'u artık bir İç Geliştirici Platformu (IDP) işletiyor, %60'ı bunu ekipler arasında yaygın şekilde kullanıyor ve %55,9'u birden fazla IDP'yi aynı anda çalıştırıyor.

## Platform mühendisliği DevOps ve SRE'den nasıl farklı?

DevOps bir kültür ve pratik kümesi, SRE ise güvenilirliği mühendislik problemine çeviren bir disiplin; platform mühendisliği ise ikisinin çıktısını somut bir ürüne dönüştürüyor. DevOps "geliştirici ile operasyon birlikte çalışsın" der, SRE "güvenilirliği ölçülebilir hedeflerle yönet" der, platform mühendisliği ise "bu ikisini her seferinde yeniden icat etmek yerine, bir kez kur ve bir ürün gibi işlet" der.

| Disiplin | Odak | Çıktı |
|---|---|---|
| DevOps | Kültür, iş birliği, CI/CD otomasyonu | Süreç ve araç zinciri |
| SRE | Güvenilirlik, SLO/SLA, nöbet | Üretim sistemlerinin sağlığı |
| Platform Mühendisliği | Kendi kendine servis, golden path | İç geliştirici platformu (ürün) |

Pratikte üçü birbirini dışlamıyor; çoğu olgun organizasyonda platform ekibi, DevOps otomasyonunu ve SRE pratiklerini bir IDP'nin içine gömüp geliştiricilere tek bir arayüzden sunuyor. Bir geliştirici için fark şurada hissediliyor: DevOps çağında bir geliştirici altyapı ekibiyle bir bilet açıp bekliyordu, platform mühendisliği çağında ise aynı geliştirici bir self-servis portalda birkaç dakikada aynı sonuca ulaşıyor.

## Bir İç Geliştirici Platformu (IDP) neler içerir?

Bir IDP'nin çekirdeği dört parçadan oluşur: self-servis altyapı sağlama (örneğin bir butonla yeni bir ortam açma), golden path şablonları (yeni bir servisi doğru yapılandırmayla başlatan iskeletler), otomatik güvenlik ve uyumluluk kontrolleri, ve kullanım/performans metrikleri panosu. Platform teamlerinin %75'i artık bu bileşenleri bir self-servis geliştirici portalı üzerinden sunuyor — Backstage ve benzeri araçlar bu kategorinin en yaygın örnekleri.

Golden path kavramı özellikle kritik: geliştiricinin "doğru" yolu seçmesini zorlamak yerine, doğru yolu en kolay yol haline getiriyor. Bir geliştirici yeni bir mikroservis başlatmak istediğinde, güvenlik taramaları, loglama, izleme ve CI/CD ayarlarıyla önceden paketlenmiş bir şablon kullanıyor; bunu sıfırdan kurmak zorunda kalmıyor.

## Küçük bir ekip platform mühendisliğine nereden başlamalı?

En düşük maliyetli, en yüksek getirili adım: tek bir golden path şablonu ve bir CI/CD pipeline standardı. Sıfırdan [CI/CD pipeline kurma rehberimiz](/tr/posts/cicd-pipeline-nasil-kurulur) bu ilk adımı somutlaştırmak için iyi bir başlangıç noktası. Ardından, her pull request için [dallanan önizleme veritabanları](/tr/posts/her-pr-icin-onizleme-veritabani) gibi tek bir self-servis özelliği ekleyerek platformu büyütmek, baştan büyük bir "platform projesi" başlatmaktan çok daha az risklidir.

Platform mühendisliğinin [AI ajanlarını CI/CD'ye güvenle bağlama](/tr/posts/ai-ajanlari-cicd-guvenle-baglamak) gibi otomasyon katmanlarıyla birleştirilmesi, 2026'da giderek yaygınlaşan bir model; ajan tabanlı otomasyon, platformun kendi kendine servis prensibini bir adım öteye taşıyor.

```yaml
# golden-path.yaml — örnek servis şablonu metadata'sı
apiVersion: backstage.io/v1alpha1
kind: Template
metadata:
  name: nodejs-service-golden-path
spec:
  parameters:
    - title: Servis adı
      required: [name]
  steps:
    - id: scaffold
      action: fetch:template
      input:
        url: ./skeletons/nodejs-service
    - id: register-ci
      action: cicd:register-pipeline
```

## Platform ekibi ne zaman fildişi kuleye dönüşür?

Platform benimsemesi ile ölçülebilir fayda arasında ciddi bir açık var: organizasyonların %80'i 2026 sonunda platform ekibine sahip olacak olsa da, bunların yalnızca %30'dan azı ölçülebilir geliştirici verimlilik kazanımı raporluyor. En yaygın başarısızlık nedeni, platform ekibinin geliştiricilerden kopuk çalışması — kullanılmayan özellikler üretmesi, zorunlu araçlar dayatması veya platformu bir "ürün" değil bir "politika" gibi yönetmesi.

Bize göre bu açığın asıl nedeni ölçüm eksikliği: platform ekipleri genelde kaç servis sağladıklarını sayıyor, ama geliştiricilerin bu servisleri gerçekten kullanıp kullanmadığını, ne kadar zaman kazandırdığını ölçmüyor. Bir IDP, dahili müşterisi (geliştiriciler) olan bir ürün gibi yönetilmezse, kâğıt üzerinde "platform ekibimiz var" kutusunu işaretlemekten öteye geçmiyor.

Somut bir örnek: platform ekibi "kaç yeni servis şablonu sağladık" yerine "bir geliştiricinin yeni bir servisi production'a almak için harcadığı ortalama süre" gibi bir metrik izlerse, fildişi kuleye dönüşme riski ciddi şekilde azalıyor. Bu metrik, golden path'in gerçekten zaman kazandırıp kazandırmadığını doğrudan gösteriyor — bir şablonun var olması değil, o şablonun kullanıldığında ne kadar sürtünmeyi ortadan kaldırdığı önemli. Benzer şekilde, bir self-servis özelliğinin haftalık aktif kullanıcı sayısını izlemek, hangi araçların gerçekten benimsendiğini, hangilerinin sessizce terk edildiğini gösteriyor.

## Bir platform ekibi kaç kişiyle, hangi rollerle kurulur?

Küçük bir organizasyonda platform ekibi genelde 2-4 mühendisle başlıyor: bir altyapı/bulut ağırlıklı mühendis, bir CI/CD ve otomasyon odaklı mühendis, ve mümkünse geliştirici deneyimine (developer experience, DX) odaklanan bir kişi. Bu üçlü, platformun hem teknik olarak sağlam hem de geliştiricilerin gerçekten kullanmak isteyeceği bir araç olmasını birlikte sağlıyor — sadece altyapı bilgisiyle kurulan bir platform, genelde geliştiricilerin gerçek iş akışına uymuyor.

500'den fazla mühendisi olan organizasyonlarda bu ekip büyüyor ve genelde alt ekiplere ayrılıyor: bir ekip golden path şablonlarını ve self-servis araçlarını, başka bir ekip ise izleme/gözlemlenebilirlik ve güvenlik otomasyonunu yönetiyor. Bu ayrışma, [küçük ekipler için chaos engineering](/tr/posts/kucuk-ekipler-icin-chaos-engineering) gibi güvenilirlik pratiklerinin platformun bir parçası haline gelmesini de kolaylaştırıyor — çünkü güvenilirlik testleri artık her takımın kendi başına icat ettiği bir şey değil, platformun sunduğu standart bir özellik oluyor.

Kariyer açısından platform mühendisliği, hem klasik DevOps/SRE geçmişinden hem de backend/altyapı geliştirme geçmişinden gelen mühendisler için yeni bir yol açtı. Rol, sadece altyapı işletmek değil, geliştiricileri "iç müşteri" olarak gören bir ürün zihniyeti gerektiriyor; bu da platform mühendisliğini klasik sistem yöneticiliğinden ayıran en belirgin fark.

## Deployment stratejileri platformun neresinde duruyor?

Golden path şablonları genelde deployment stratejisini de kapsar — bir ekip yeni bir servis başlattığında, o servis zaten platformun standart deployment modeliyle (örneğin [blue-green ya da canary deployment](/tr/posts/blue-green-mi-canary-mi)) yapılandırılmış geliyor. Bu, her takımın kendi deployment stratejisini sıfırdan tasarlamasını önlüyor ve platform ekibinin bir güvenlik veya performans sorunu bulduğunda, düzeltmeyi tüm servislere tek seferde yayabilmesini sağlıyor — bireysel takımların her birinde ayrı ayrı düzeltme yapmak yerine.

## Sıkça Sorulan Sorular

### Platform mühendisliği DevOps'un ölümü anlamına mı geliyor?

Hayır. Platform mühendisliği, DevOps'un otomasyon ve iş birliği prensiplerini kullanıp bunları somut bir ürüne (İç Geliştirici Platformu) dönüştürüyor. DevOps kültürü ve pratikleri hâlâ geçerli; platform mühendisliği bunları ölçeklendirmenin bir yolu.

### Bir İç Geliştirici Platformu (IDP) kurmak ne kadar sürer?

Tek bir golden path şablonu ve standart bir CI/CD pipeline'ı birkaç haftada kurulabilir. Tam kapsamlı bir self-servis portal, metrik panosu ve çoklu golden path içeren olgun bir IDP ise genelde altı ay ile bir yıl arasında şekilleniyor; organizasyonların %55,9'u bu noktaya gelmeden birden fazla IDP işletmeye başlıyor.

### Backstage gibi araçlar zorunlu mu?

Hayır, ama yaygın. Platform ekiplerinin %75'i self-servis geliştirici portallarını bu tip araçlarla sunuyor çünkü sıfırdan bir portal yazmak yerine hazır bir çatı kullanmak, bakım yükünü azaltıyor. Küçük ekipler için basit bir CI/CD standardı ve dokümantasyonla başlamak da yeterli olabilir.

### Platform ekibi kurmak geliştirici verimliliğini garantiler mi?

Hayır. Organizasyonların %80'i 2026 sonunda platform ekibine sahip olacak, ama bunların %30'dan azı ölçülebilir verimlilik kazanımı bildiriyor. Platformun geliştiricilerin gerçek ihtiyaçlarına göre tasarlanması ve kullanım metrikleriyle sürekli ölçülmesi gerekiyor; aksi halde yatırım, kullanılmayan bir araç setine dönüşebilir.
