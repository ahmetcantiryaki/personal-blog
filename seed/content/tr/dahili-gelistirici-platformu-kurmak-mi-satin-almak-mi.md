---
title: "Dahili Geliştirici Platformu: Kurmak mı Satın Almak mı?"
slug: "dahili-gelistirici-platformu-kurmak-mi-satin-almak-mi"
translationKey: "idp-build-or-buy-2026"
locale: "tr"
excerpt: "Bilet kuyruğu gerçek bir soruna dönüşmeden IDP kurmayın; sorun gerçekse yönetilen bir platform satın alın veya Backstage artı açık kaynak araçlarla kurun."
category: "devops-cloud"
tags: ["platform-engineering", "devops", "cost-optimization", "best-practices"]
publishedAt: "2026-10-15"
seoTitle: "Dahili Geliştirici Platformu: Kurmak mı Satın Almak mı?"
seoDescription: "Bilet kuyruğu gerçek bir soruna dönüşmeden IDP kurmayın; satın alın veya Backstage ile açık kaynak araçlardan kurun, çünkü kurmak yıllarca sürer."
---

## Dahili Geliştirici Platformu (IDP) Nedir?

Dahili geliştirici platformu (IDP), uygulama geliştiricilerinin başka bir ekibe bilet açmadan altyapı sağlayabildiği, servis dağıtabildiği ve çalışan bir ortam elde edebildiği self-servis araçlar, şablonlar ve otomatik iş akışları bütünüdür. Buradaki temel fikir "paved road" (döşenmiş yol): yaygın işler için önceden onaylanmış, desteklenen az sayıda yöntem sunmak, böylece geliştiricilerin çoğu ham bulut konsollarına veya elle yazılmış Terraform kodlarına düşmek zorunda kalmaz.

Üç temel kavram şunlardır: golden path (bir servisi inşa etmek ve yayına almak için önerilen, desteklenen varsayılan yol), self-servis (geliştiricinin iş akışını bir portal, CLI veya Git tabanlı pull request üzerinden kendi başlatması) ve paved road (platform ekibinin her olası konfigürasyonu değil, dar ve onaylı bir desen kümesini desteklemesi). IDP kurulup çalıştırılan bir araç değildir; dahili bir müşteri tabanı olan dahili bir üründür ve her ürün gibi iyi kurulabilir, kötü kurulabilir ya da henüz kurulmaya hiç gerek olmayabilir.

## Ekibiniz Gerçekten Bir IDP'ye Hazır mı?

Kısa cevap: Platform bilişsel yükü ve bilet kuyruğu operasyon acısı yayını ölçülebilir şekilde yavaşlattığında hazırsınızdır; bir konferans konuşması "her şirkete gerekir" dediği için değil. Burada sinyal operasyoneldir, hevesli değil.

Gerçek hazırlık belirtileri: geliştiriciler merkezi bir operasyon ekibinin bilet kuyruğunda günlerce bekliyor; yeni bir mühendise "bir servisi dağıt" diye öğretmek, asıl kod değişikliğinden daha uzun bir runbook gerektiriyor; aynı Terraform modülü onlarca repoda kopyalanıp ince şekillerde bozulmuş; olay sonrası incelemelerde kök neden hep "hangi konfigürasyonun doğru olduğunu kimse bilmiyordu" oluyor. Ölçülebilir bir birikmiş iş kuyruğu ve dakikalar değil günler süren ortalama karşılama süresi görebiliyorsanız, platform yokluğu artık asıl darboğaz haline gelmiştir.

Erken yatırım belirtileri hevesle neredeyse aynı görünür: bir yönetici Spotify'ın dahili platformunu okumuş ve bir tane istiyor; mühendislik organizasyonu 30-40 mühendisten az ve iki üç serviste kalıyor; en çok tekrar eden üç geliştirici şikâyetini kimse sayamıyor çünkü kimse sormamış. CNCF'in Platform Mühendisliği Durumu Raporu'na (4. cilt, 518 katılımcı) göre platform ekiplerinin %29,6'sı başarıyı hiç ölçmüyor, %40,9'u ise lansmandan sonraki 12 ay içinde ölçülebilir bir değer gösteremiyor — bu da birçok platformun "çalışıyor" ne demek tanımlanmadan kurulduğunu gösteriyor ([sdtimes.com haberi](https://sdtimes.com/cloud-native/the-2026-cloud-native-developer-survey-tracking-adoption-and-maturity-in-platform-engineering/)). Gartner, büyük mühendislik organizasyonlarının %80'inin 2026 sonuna kadar adanmış bir platform ekibine sahip olacağını öngörüyor — bu bir tahmindir, ölçülmüş bir sonuç değildir ve acı gerçek hale gelmeden platform kurmak için bir gerekçe değildir.

## Kurmak mı, Satın Almak mı, Açık Kaynaktan Birleştirmek mi?

Kısa cevap: Çoğu orta ölçekli mühendislik organizasyonu için açık kaynaktan birleştirme (Backstage artı seçilmiş bir araç zinciri) en uygunudur; satın alma, entegrasyon işini atlamak için para ödemek isteyen ekiplere uyar; sıfırdan kurmak ise platformunuz ürününüzün kendisi değilse neredeyse hiçbir zaman karşılığını vermez.

"Kurmak", temel bir çerçeve kullanmadan şirket içinde özel bir portal, özel CI/CD orkestrasyonu ve özel katalog mantığı yazmak demektir. "Satın almak", katalog, karne (scorecard) ve iş akışı motorunun satıcıya ait olduğu, sizin yalnızca yapılandırdığınız yönetilen bir platform-ürün çözümü (Humanitec, Port, Cortex ve benzeri satıcılar) demektir. "Açık kaynaktan birleştirmek" ise Spotify'da geliştirilip 2020'de CNCF'e bağışlanan Backstage'i katalog ve portal arayüzü olarak kurup mevcut CI/CD, Kubernetes ve secret yönetimi araçlarınıza bağlamak demektir.

| Yaklaşım | Baştan maliyet | İlk değere ulaşma süresi | Esneklik | Sürekli bakım yükü |
|---|---|---|---|---|
| Sıfırdan kurmak | Çok yüksek (aylarca kıdemli mühendis zamanı) | 6-12+ ay | Maksimum | Yüksek — her hata, yükseltme ve entegrasyon sonsuza dek sizindir |
| Satın almak (yönetilen platform) | Genelde geliştirici başına lisans ücreti | Haftalar | Satıcının genişletme modeliyle sınırlı | Düşük — çekirdeği satıcı yamalar ve yükseltir |
| OSS'ten birleştirmek (Backstage + eklentiler) | Orta (kurulum için 1-2 mühendis) | 1-3 ay | Yüksek — eklenti ekosistemi var ama entegrasyonu siz yaparsınız | Orta — Backstage sürümlerini ve eklenti bozulmalarını siz takip edersiniz |

Backstage'in kendisi bitmiş bir platform değildir; bir çerçeve ve eklenti ekosistemidir. Ekim 2026 itibarıyla CNCF'in olgunluk düzeyinde "incubating" (kuluçka) aşamasındadır (Mart 2022'de sandbox'tan kuluçkaya terfi etti) ve CNCF'in 2025 Yıllık Proje Hız Sıralaması'nda 230'dan fazla CNCF projesi arasında 6. sırada yer aldı; bu, Spotify'ın onu bağışladığı 2020'deki 8. sıradan bir yükseliş ([CNCF, Mart 2026](https://www.cncf.io/announcements/2026/03/25/cncf-backstage-documentary-highlights-project-evolution-from-development-to-global-open-source-standard-for-platform-engineering/)). Bu hız, ekosistemin aktif olduğunun göstergesidir, "bitmiş" olduğunun değil. Backstage'i kendi bulut hesabınıza, kendi CI sisteminize ve kendi secret yöneticinize bağlayan eklentileri yine siz yazarsınız — entegrasyonunuzun hazır olduğunu düşünmeden önce güncel eklenti kataloğu için [backstage.io](https://backstage.io)'ya bakın.

Backstage kataloğundaki minimal bir servis tanımı şöyle görünür:

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: checkout-service
  description: Sipariş checkout ve ödeme tahsilatını yönetir
  annotations:
    github.com/project-slug: woyable/checkout-service
spec:
  type: service
  lifecycle: production
  owner: team-payments
  system: ecommerce-platform
```

Bu dosyayı yazmak ucuzdur. Pahalı olan, arkasındaki otomasyondur: iskelet (scaffolding) şablonları, kataloğu gerçekle senkron tutan CI kancaları ve kataloğun kimsenin güvenmediği bayat bir dokümana dönüşmesini engelleyen erişim kontrolleri.

IDP'lerin platform mühendisliği disiplini içinde nereye oturduğuna geniş bir bakış için [platform mühendisliğinin ne olduğuna dair derinlemesine incelememize](/tr/posts/platform-engineering-nedir) ve [iç geliştirici portalı kurma rehberimize](/tr/posts/ic-gelistirici-portali-nasil-kurulur) göz atabilirsiniz. Platform mühendisliğinin DevOps'un yerini mi aldığı yoksa onu yeniden organize mi ettiği sorusu ise [DevOps ile platform mühendisliğini karşılaştırdığımız yazıda](/tr/posts/platform-muhendisligi-devops) ayrıca ele alınıyor.

## Bir Platform Ekibi Gerçekte Ne Kadara Mal Olur?

Kısa cevap: Gerçek bir platform ekibi, orta ölçekli bir şirket için en az 3-6 mühendistir; kendi yol haritası ve nöbet rotasyonu olan kalıcı bir maliyet merkezi olarak işletilir, iki altyapı mühendisinin mevcut iş yüküne eklenen yarı zamanlı bir proje değildir.

CNCF bağlantılı bir ankete göre organizasyonların sadece %28'i adanmış bir platform mühendisliği ekibine sahip olduğunu bildiriyor; geri kalan %72'si ya platform mühendisliğini resmi şekilde yapmıyor ya da bunu kadrosuz, yan bir çaba olarak sürdürüyor ki bu da genellikle bir yıl içinde terk edilmiş bir dahili araçla sonuçlanıyor. CNCF'in 4. cilt raporu, şirketlerin %55,9'unun zaten birden fazla dahili geliştirici platformu çalıştırdığını, bunun genellikle frontend, backend ve veri/AI iş yükleri arasında bölündüğünü de ortaya koyuyor; bu da kadro sorununu çözmek yerine çarpıyor çünkü her platformun kendi katalog bakımı ve eklenti takibi gerekir.

Gerçek maliyet kalemleri hafife alınmaya çok müsaittir: maaş en küçük parçadır. Buna kıdemli mühendisleri üründen çekmenin fırsat maliyetini, çerçeveler ve temel imajlar ayda bir değişirken golden path şablonlarını güncel tutmanın sürekli maliyetini, platformun kendisi bozulup her ekibin dağıtım hattını da birlikte çökerttiği nöbet yükünü ve kataloğun tanımladığı servislerle sessizce senkronizasyonunu kaybetmesinin yavaş maliyetini ekleyin. Bunların hiçbiri bir satıcının fiyatlandırma sayfasında ya da bir açık kaynak projesinin README'sinde görünmez.

## Platformunuzun Bilet Kuyruğuna Dönüşmesini Nasıl Önlersiniz?

Kısa cevap: Talep edenin bekleme süresini ve self-servis tamamlanma oranını ilk günden ölçün; bir geliştiricinin insan onayı olmadan bitiremediği her iş akışını platform özelliği değil, platform hatası sayın.

Tuzak yaygın ve belirgindir: bir ekip self-servis provisioning kurar ama "güvenlik için" her talep yine manuel bir onay kuyruğundan geçer. Sonuç, arayüzü olan ama yerine geçtiği bilet sistemiyle aynı verime sahip bir platformdur — üstüne bir de ekstra adımlar eklenmiştir. Geliştiriciler yeni bir ortam için hâlâ iki gün bekliyorsa kurduğunuz şey platform değil, daha güzel görünen bir talep formudur.

Üç somut koruma önlemi:

- Self-servis eylemler için sıkı bir SLA koyun (örneğin yeni bir ortamın insan müdahalesi olmadan 10 dakikanın altında sağlanması) ve ihlal edildiğinde uyarı verin.
- Her talebi tek tek onaylayan bir kişi yerine policy-as-code kapıları (otomatik geçer/kalır kontrolleri) kullanmayı varsayılan yapın.
- Platformunuzun kullanımını haftalık olarak herhangi bir dahili ürün gibi gözden geçirin: benimsenme oranı, bırakılma noktaları ve en çok yapılan üç şikâyet — sadece çalışma süresi değil.

Bizim görüşümüz: kabaca 50 mühendisin altındaki ekiplerin çoğunun henüz bir platform ekibine ihtiyacı yok — iyi dokümante edilmiş bir paved road, birkaç sağlam Terraform modülü ve birinin yarı zamanlı baktığı paylaşımlı bir Backstage örneği, yönetecek orantılı bir işi olmayan kadrolu bir platform organizasyonundan daha iyi sonuç verir. Ekibi, hevesiniz değil bilet kuyruğu gerektirdiğinde kurun.

## Sıkça Sorulan Sorular

### Platform mühendisliği ile dahili geliştirici platformu arasındaki fark nedir?

Platform mühendisliği bir disiplin ve ekip fonksiyonudur; dahili geliştirici platformu (IDP) ise o ekibin kurup işlettiği üründür. Tek bir birleşik portal hiç yayınlamadan golden path'leri döşemek ve paylaşımlı Terraform modülleri yazmak gibi platform mühendisliği işleri yapabilirsiniz; aynı şekilde adanmış bir platform mühendisliği ekibiniz olmadan da hazır bir IDP ürünü satın alabilirsiniz.

### Backstage ücretsiz mi?

Evet, Backstage bir ticari ürün değil CNCF projesi olduğu için Apache 2.0 lisansı altında ücretsiz ve açık kaynaktır. Maliyet yazılımda değildir; kurulum, entegrasyon ve bakım için harcanan mühendislik zamanındadır — genellikle ilk kurulum için bir iki mühendis ve sonrasında sürekli eklenti bakımı gerekir.

### Bir dahili geliştirici platformunu çalıştırmak için kaç mühendis gerekir?

Çoğu orta ölçekli organizasyon bir IDP'yi düzgün işletmek için katalog bakımı, golden path şablonları, platformun kendisi için nöbet ve eklenti entegrasyonunu kapsayan 3-6 adanmış platform mühendisine ihtiyaç duyar. Tek bir yarı zamanlı sahiple çalıştırmaya çalışan daha küçük ekipler, platformun bir yıl içinde bayat bir dokümana dönüştüğünü görür.

### Küçük bir girişim dahili geliştirici platformu kurmalı mı?

Hayır, kabaca 30-40 mühendisten az ve bir avuç servisi olan bir girişimin henüz adanmış bir IDP'ye ihtiyacı neredeyse hiç yoktur. Birkaç bakımlı Terraform modülü, standart bir CI şablonu ve açık sahiplikten oluşan küçük, dokümante edilmiş bir paved road, tam bir platform ekibinin gerektirdiği çok mühendisli maliyet merkezi olmadan faydanın çoğunu verir.

Kaynaklar: [CNCF: Backstage belgeseli proje evrimini vurguluyor, Mart 2026](https://www.cncf.io/announcements/2026/03/25/cncf-backstage-documentary-highlights-project-evolution-from-development-to-global-open-source-standard-for-platform-engineering/) · [backstage.io](https://backstage.io) · [SD Times: 2026 Cloud Native Geliştirici Anketi](https://sdtimes.com/cloud-native/the-2026-cloud-native-developer-survey-tracking-adoption-and-maturity-in-platform-engineering/) · [CNCF Projeleri: Backstage](https://www.cncf.io/projects/backstage/)
