---
title: "Kubernetes'siz Deploy: Kamal ve Coolify Rehberi"
slug: "kubernetessiz-deploy-kamal-coolify"
translationKey: "self-hosted-paas-kamal-coolify"
locale: "tr"
excerpt: "Kubernetes'in operasyonel yükünü istemeyen küçük ekipler Kamal ve Coolify'a yöneliyor. SSH tabanlı proxy'den panel tabanlı PaaS'a, hangisi ne zaman doğru?"
category: "devops-cloud"
tags: ["self-hosting", "deployment", "devops", "docker"]
publishedAt: "2026-07-20"
seoTitle: "Kubernetes Olmadan Deploy: Kamal vs Coolify Karşılaştırması"
seoDescription: "Küçük ekipler Kubernetes ve Heroku faturalarından kaçıyor. Kamal'ın SSH+proxy modeli ile Coolify'ın panel tabanlı PaaS'ını karşılaştırıyoruz."
---

Kendi VPS'inize Kubernetes kurmadan, dakikalar içinde production'a çıkmak istiyorsanız iki gerçekçi seçeneğiniz var: Kamal, tek bir YAML dosyası ve SSH üzerinden Docker konteynerlerinizi yöneten minimal bir CLI; Coolify, panel üzerinden veritabanı, SSL ve deploy yönetimi sunan tam teşekküllü bir self-hosted PaaS. İkisi de Kubernetes'in kümesini, kontrol düzlemini ve YAML yığınını devreden çıkarıyor.

2026'da küçük ekipler ve solo geliştiriciler arasında belirgin bir eğilim var: Kubernetes'in operasyonel karmaşıklığından ve yönetilen bulut PaaS'larının (Heroku, Render gibi) büyüyen faturalarından kaçış. Cevap genellikle "kendi sunucunuza, Docker ile, ama Kubernetes olmadan" deploy etmek oluyor. Bu yazıda bu akımın iki öne çıkan aracını, Kamal ve Coolify'ı, gerçek kullanım senaryolarıyla karşılaştırıyoruz.

## Neden ekipler Kubernetes'ten uzaklaşıyor?

Kubernetes güçlü ama bedeli var: kontrol düzlemini işletmek, RBAC'i yönetmek, Helm chart'ları anlamak, ölçeklendirme politikalarını ayarlamak. Beş kişilik bir ekip için bu, ürün geliştirmeye ayrılması gereken zamanı yutan bir operasyonel yük hâline geliyor. Aynı zamanda yönetilen PaaS'ların (Heroku tarzı) kolaylığı, ölçek büyüdükçe fatura şokuna dönüşüyor. Kamal ve Coolify, bu ikisinin ortasında bir üçüncü yol sunuyor: birkaç vanilla Ubuntu sunucusuna, Docker üzerinden, minimum operasyonel yükle deploy etmek.

## Kamal nasıl çalışıyor?

Kamal, 37signals (Basecamp ve Ruby on Rails'in yaratıcıları) tarafından geliştirilen açık kaynak bir CLI. Sunucularınıza SSH ile bağlanır, Docker konteynerlerinizi başlatır ve kendi ters proxy'si olan `kamal-proxy` ile trafiği eski konteynerden yeni konteynere kesintisiz aktarır. Kubernetes'in düzinelerce YAML manifestosunun aksine, Kamal'ın tüm yapılandırması tek bir `config/deploy.yml` dosyasında yaşar.

```yaml
# config/deploy.yml
service: myapp
image: myorg/myapp

servers:
  web:
    - 192.0.2.10
    - 192.0.2.11

proxy:
  ssl: true
  host: myapp.example.com

registry:
  username: myorg
  password:
    - KAMAL_REGISTRY_PASSWORD
```

Bu dosyayla `kamal deploy` komutu, hiçbir ön hazırlık yapılmamış birkaç Ubuntu sunucusuna Docker'ı kurar, image'ı çeker, konteyneri başlatır ve `kamal-proxy` üzerinden SSL sertifikasını otomatik ayarlar. Rolling restart, asset bridging ve accessory servisleri (Postgres, Redis gibi yardımcı konteynerler) yönetmek de yerleşik özellikler arasında. [Kesintisiz deployment](/tr/posts/kesintisiz-deployment) prensiplerini uygulamanın en düşük operasyonel maliyetli yollarından biri diyebiliriz.

## Coolify nasıl farklılaşıyor?

Coolify, Kamal'ın CLI-öncelikli yaklaşımının aksine panel öncelikli bir self-hosted PaaS. Kendi sunucunuza kurulan bir web uygulaması olarak çalışır ve GitHub reposu bağlama, container deploy etme, veritabanı yönetme gibi işlemleri bir dashboard üzerinden yapmanızı sağlar. 18 Mayıs 2026'da yayımlanan v4.0 sürümü, 280'den fazla tek tıkla kurulabilen servis sunuyor.

| Özellik | Kamal | Coolify |
|---|---|---|
| Arayüz | CLI, tek YAML dosyası | Web dashboard |
| Kurulum modeli | Sunuculara SSH, ajan yok | Sunucuya kurulan yönetim uygulaması |
| SSL | `kamal-proxy` üzerinden otomatik | Otomatik Let's Encrypt |
| Veritabanı yönetimi | Accessory servis olarak manuel | Panelden tek tık provizyon |
| PR önizleme deploy'ları | Yok (yerleşik değil) | Var (v4.0 itibarıyla) |
| Çoklu sunucu | Config dosyasında listeleme | Panelden merkezi yönetim |
| En iyi uyduğu ekip | CLI'a rahat, Rails/Docker odaklı ekipler | Panel tercih eden, karma stack ekipleri |

Coolify'ın panel üzerinden veritabanı provizyonu (PostgreSQL, MySQL, MariaDB, MongoDB, Redis dahil), canlı deploy logları ve tek tıkla önceki sürüme dönüş özellikleri, Kamal'ın minimalist felsefesinin bilinçli olarak dışarıda bıraktığı rahatlıklar. Buna karşılık Coolify'ın kurulu bir yönetim katmanı olması, Kamal'ın "sunucularda ajan yok" sadeliğinden bir miktar ödün veriyor.

## Dokku nerede duruyor?

Üçüncü bir isim olarak Dokku, Heroku'nun `git push` deneyimini kendi sunucunuzda taklit eden daha eski ve daha minimal bir araç. Coolify'dan daha az özellikli ama daha az kaynak tüketiyor; küçük tek sunuculu kurulumlar için hâlâ makul bir seçenek. Kamal ile Coolify arasındaki tercih genellikle ekibin CLI'a mı yoksa panele mi daha rahat olduğuna bağlıyken, Dokku bütçesi en kısıtlı, tek sunuculu projeler için düşünülmeye değer.

## Hangi ekip hangisini seçmeli?

Karar matrisi şöyle özetlenebilir: Rails veya benzer bir monolit çalıştıran, CLI'a ve config-as-code'a rahat, ekstra bir yönetim arayüzü istemeyen ekipler için Kamal daha az sürtünme yaratıyor. Karma teknoloji yığını çalıştıran, ekip içinde CLI'a herkesin aynı derecede rahat olmadığı, veritabanı ve PR önizlemesi gibi rahatlıkları panelden istenen ekipler için Coolify daha uygun. İkisi de [Docker'ı üretimde](/tr/posts/docker-en-iyi-pratikleri) doğru kullanmayı gerektiriyor; konteyner disiplini olmadan hiçbiri sihirli bir çözüm değil.

Açıkçası kişisel görüşüm şu: çoğu beş-on kişilik ekip Kubernetes'e hiç ihtiyaç duymuyor, sadece endüstri söylemi öyle hissettiriyor. Kamal veya Coolify ile bir yıl production'da kalmak, Kubernetes'i öğrenip yönetmekle geçen aylardan çok daha fazla ürün özelliği anlamına geliyor. [Açık kaynak SaaS alternatifleri](/tr/posts/acik-kaynak-saas-alternatifleri-2026) yazımızda bu kendi-sunucunda-barındırma trendinin diğer örneklerini de bulabilirsiniz.

## Güvenlik ve secret yönetimi nasıl ele alınıyor?

İki aracın da secret yönetimi felsefesi farklı. Kamal, secret'ları ortam değişkenleri veya harici bir secret store'dan (1Password entegrasyonu dahil) okuyup deploy anında konteynere enjekte ediyor; secret'lar `deploy.yml` dosyasında düz metin olarak durmuyor, sadece hangi ortam değişkeninin okunacağı belirtiliyor. Coolify ise panel üzerinden şifrelenmiş bir secret deposu sunuyor, bu da CLI'a rahat olmayan ekipler için daha az sürtünme yaratıyor ama secret'ların yönetim uygulamasının kendi veritabanında tutulması anlamına geliyor. Her iki durumda da sunucuya SSH erişimini kısıtlamak, firewall kurallarını sıkı tutmak ve kamal-proxy veya Coolify panelini asla doğrudan internete varsayılan kimlik bilgileriyle açmamak temel hijyen kuralları. Daha kapsamlı bir secret yönetimi stratejisi için [bulutta secret yönetimi](/tr/posts/bulutta-secret-yonetimi) yazımıza bakabilirsiniz; oradaki OIDC tabanlı yaklaşımların bir kısmı, özellikle CI/CD'den deploy tetikleyen kurulumlarda, hem Kamal hem Coolify ile uyumlu şekilde uygulanabilir.

## Maliyet karşılaştırması nasıl görünüyor?

İkisinin de yazılım lisans maliyeti yok, ikisi de açık kaynak; asıl maliyet, kiraladığınız sunuculardan geliyor. Birkaç orta ölçekli VPS'e (aylık 20-40 dolar bandında) Kamal veya Coolify ile deploy etmek, aynı iş yükünü yönetilen bir Kubernetes servisinde (EKS, GKE gibi) çalıştırmaktan genellikle bariz ucuz çıkıyor; çünkü kontrol düzlemi ücreti, node otomatik ölçeklendirme fazlalığı ve yönetilen servis prim'i devreden çıkıyor. Coolify'ın panel uygulamasını çalıştırmak için ayrı bir küçük sunucu ayırmak makul bir pratik, Kamal ise ek bir yönetim sunucusu gerektirmiyor. Trafiğiniz gerçekten çok büyüdüğünde ve otomatik ölçeklendirme, çok bölgeli dağıtım gibi ihtiyaçlar ortaya çıktığında hesap değişebilir; ama çoğu erken ve orta aşama proje için bu eşiğe hiç ulaşmıyor.

## Sıkça Sorulan Sorular

### Kamal veya Coolify, Kubernetes'in tüm özelliklerini karşılıyor mu?

Hayır ve bu bilinçli bir tercih. İkisi de otomatik yatay ölçeklendirme, karmaşık servis mesh'i veya çok bölgeli orkestrasyon gibi Kubernetes'e özgü yetenekleri hedeflemiyor. Amaçları, birkaç sunucuda çalışan tipik bir web uygulamasını Kubernetes'in operasyonel yükü olmadan güvenilir şekilde deploy etmek.

### Kamal'ın minimum gereksinimleri neler?

Sunucularda SSH erişimi ve Docker kurulu olması yeterli; Kamal ayrıca bir ajan kurmaz, komutları SSH üzerinden çalıştırır. Vanilla bir Ubuntu sunucusuna, önceden hiçbir hazırlık yapmadan, dakikalar içinde deploy edebilirsiniz.

### Coolify'ın v4.0 sürümünde neler değişti?

18 Mayıs 2026'da yayımlanan v4.0, 280'den fazla tek tıkla kurulabilen servis, Git otomatik deploy, otomatik Let's Encrypt TLS ve PostgreSQL/MySQL/MongoDB/Redis için yerleşik veritabanı provizyonu getirdi. PR açtığınızda otomatik önizleme URL'si üretme özelliği de bu sürümle geldi.

### Küçük bir ekip için hangisi daha az bakım gerektirir?

Genel olarak Kamal, sunucuda ek bir yönetim uygulaması çalıştırmadığı için daha az bakım yüzeyi sunar; güncellemesi gereken tek şey Docker ve deploy.yml dosyanız. Coolify ise kendi güncellemelerini yönetmeniz gereken bir uygulama olduğu için biraz daha fazla bakım ister, karşılığında panel üzerinden çok daha fazla otomasyon sağlar.
