---
title: "Terraform'dan OpenTofu'ya Geçmeli mi?"
slug: "terraformdan-opentofuya-gecmeli-mi"
translationKey: "terraform-to-opentofu-migration-2026"
locale: "tr"
excerpt: "Yerleşik state şifreleme veya CNCF yönetimli, MPL lisanslı bir araç istiyorsanız geçin; HCP Terraform'a özel özelliklere bağımlıysanız Terraform'da kalın."
category: "devops-cloud"
tags: ["terraform", "infrastructure-as-code", "devops", "open-source"]
publishedAt: "2026-09-09"
seoTitle: "Terraform'dan OpenTofu'ya Geçmeli mi? 2026 Rehberi"
seoDescription: "Yerleşik state şifreleme veya CNCF yönetimli, MPL lisanslı bir araç istiyorsanız geçin; HCP Terraform'a özel özelliklere bağımlıysanız Terraform'da kalın."
---

Kısa cevap: Yerleşik state şifreleme, izin verici bir MPL 2.0 lisansı veya tek bir şirketin dışında bir yönetişim istiyorsanız OpenTofu'ya geçin — çoğu kod tabanı için geçiş aynı gün biten basit bir isim değişikliğine yakın. Ekibiniz HCP Terraform'un yönetilen özelliklerine ya da henüz OpenTofu uyumlu sürüm yayınlamamış bir provider'a bağımlıysa Terraform'da kalın.

## OpenTofu neden Terraform'dan ayrıldı?

OpenTofu'nun varlık nedeni, HashiCorp'un Ağustos 2023'te Terraform'u açık MPL 2.0 lisansından Business Source License'a (BSL) taşıması. BSL, Terraform'u kullanarak rakip bir ticari ürün kurmayı kısıtlıyor — örneğin onu yönetilen bir SaaS olarak yeniden satmayı — ama danışmanlık firmaları ve bulut sağlayıcıları dahil normal iç kullanımı tamamen serbest bırakıyor.

Terraform ekosistemine bağımlı bir grup sağlayıcı ve maintainer — Gruntwork, Spacelift, env0, Harness ve Scalr dahil — son MPL lisanslı commit'i fork'layıp kalıcı olarak açık bir alternatif garanti etmek için OpenTofu'yu kurdu. Proje artık Linux Foundation çatısı altında barınıyor ve Nisan 2025'te CNCF'e kabul edildi; bu da yönetişimi tek bir şirketin ürün yol haritası yerine bir Technical Steering Committee'ye bağladı.

## OpenTofu'da olup Terraform'da olmayan özellikler neler?

OpenTofu, açık kaynak Terraform'a hiç gelmeyen birkaç özellik çıkardı; en önemlisi client-side state şifreleme.

| Özellik | OpenTofu | Terraform (açık kaynak) |
|---|---|---|
| State şifreleme (client-side, makineden çıkmadan önce) | Var, v1.7'den beri | Yok |
| Erken değişken değerlendirme (`count`, `for_each`, backend config içinde) | Var, v1.8'den beri | Yok |
| Provider bloklarında `for_each` | Var, v1.9'dan beri | Yok |
| Hedefli planlar için `-exclude` bayrağı | Var, v1.9'dan beri | Yok |
| Provider/modüller için OCI registry desteği | Var, v1.10'dan beri | Yok |
| Lisans | MPL 2.0 | Business Source License |
| Yönetişim | Linux Foundation / CNCF, topluluk TSC'si | HashiCorp (IBM) |

State şifrelemesinin önemi şu: bir `.tfstate` dosyası genellikle veritabanı şifrelerini, API anahtarlarını ve özel IP'leri düz metin olarak tutar; bu dosya bir Git deposuna yanlışlıkla eklendiğinde ya da paylaşılan bir S3 bucket'ında yanlış izinlerle otururken sızıntı riski taşır. OpenTofu bunu diske veya uzak backend'e yazılmadan önce şifreler:

```hcl
terraform {
  encryption {
    key_provider "pbkdf2" "mykey" {
      passphrase = var.state_encryption_passphrase
    }
    method "aes_gcm" "example" {
      keys = key_provider.pbkdf2.mykey
    }
    state {
      method = method.aes_gcm.example
    }
  }
}
```

## Terraform ile OpenTofu arasında tam feature parity var mı?

Günlük kullanılan HCL'in büyük kısmı için — kaynaklar, modüller, provider'lar, state yönetimi, workspace'ler — evet, parity çoğu konfigürasyonun değişiklik yapılmadan çalışacağı kadar yakın. Ağustos 2026 itibarıyla OpenTofu'nun kararlı sürümü v1.12.6 ve iki araç artık gerçekten ayrıştı, aynı binary'nin farklı isimle sunulan hali değiller: OpenTofu registry'sinde şu anda 3.900'den fazla provider ve 23.600'den fazla modül bulunuyor.

Boşlukla karşılaşacağınız yer temel dil değil, HashiCorp'un ticari katmanı. HCP Terraform'un yönetilen çalışma ortamının, Sentinel policy-as-code'unun ve bazı yeni HCP'ye özel entegrasyonların OpenTofu karşılığı yok; çünkü bunlar iki aracın da başladığı açık kaynak çekirdekte değil, HashiCorp'un ücretli ürününde yaşıyor.

Provider uyumluluğu, parity'nin kayabileceği bir başka nokta. AWS, Google Cloud, Azure, Kubernetes gibi büyük provider'ların çoğu her iki CLI altında da birebir aynı çalışan build'ler yayınlıyor; çünkü provider protokolünün kendisi değişmedi. Daha küçük veya daha yeni provider'lar, özellikle tek bir sağlayıcının kendi SaaS ürünü için bakımını yaptığı olanlar, bazen geride kalıyor: önce Terraform'a karşı test edip sertifikalıyorlar, OpenTofu uyumluluğu haftalar ya da aylar sonra geliyor — maintainer zaten test etmeyi düşünürse.

## OpenTofu'ya nasıl geçilir?

Çoğu depo için geçiş bir yeniden yazım değil, bir isim değişikliği; çünkü `tofu`, mevcut `.tf` ve `.tfstate` dosyalarını dönüştürme yapmadan okuyor.

```bash
# 1. tofu CLI'ı terraform'un yanına kurun
brew install opentofu

# 2. Mevcut state'inize karşı tofu çalıştırın — migrate bayrağı gerekmiyor
tofu init
tofu plan

# 3. Plan, terraform plan ile birebir eşleşiyorsa işiniz bitti
tofu apply
```

Geçişe karar vermeden önce kontrol etmeniz gereken tuzaklar şunlar: şirket içinde bakımını yaptığınız özel bir provider varsa, OpenTofu registry'siyle uyumlu bir build yayınlaması (ya da zaten yayınlamış olması) gerekiyor; CI pipeline'ınızda `terraform` binary yolunu sabit yazan yerler `tofu` olarak güncellenmeli; ve uzak backend olarak HCP Terraform kullanıyorsanız, önce state'i Spacelift, Scalr veya native locking'li S3 gibi OpenTofu uyumlu bir backend'e taşımanız gerekiyor.

Geçişi tek seferde yapmak yerine yan yana bir karşılaştırma olarak yürütün: her iki binary'yi de kurulu tutun, bir iki hafta boyunca normal değişiklikler üzerinde aynı state'e karşı `tofu plan`'ı mevcut `terraform plan`'ınızın yanında çalıştırın ve `terraform` binary'sini CI'dan ancak planlar tutarlı şekilde eşleştikten sonra kaldırın. Bu size, bir provider ya da modülün OpenTofu'nun değerlendirme sırasında beklenmedik davranması ihtimaline karşı bir geri dönüş yolu verir — iki araç 2023'ten beri ayrıştığı için nadir ama imkânsız değil.

## Terraform'da kalmak ne zaman mantıklı?

Kuruluşunuz zaten HCP Terraform için ödeme yapıyor ve Sentinel politikalarına, özel modül registry arayüzüne veya başka yerde yeniden kurmanız gerekecek run-task entegrasyonlarına bağımlıysa Terraform'da kalın. Ayrıca yığınınızdaki kritik bir provider — genellikle daha yeni veya niş bulut servislerinde geçerli — henüz OpenTofu-doğrulanmış bir sürüm yayınlamadıysa da kalın; topluluk tarafından bakılan provider ayna sürümleri HashiCorp'un resmi sürümlerinin haftalarca gerisinde kalabiliyor.

Küçük bir ekip için pratik bir orta yol da var: yeni projelere OpenTofu ile başlayıp mevcut Terraform depolarına dokunmadan bırakmak, tüm portföyü tek seferde göç ettirmeden riski dağıtır ve OpenTofu deneyimini gerçek üretim baskısı altında biriktirmenizi sağlar. Bunların hiçbiri geçerli değilse ve bugün düz açık kaynak Terraform çalıştırıyorsanız, buradaki dürüst görüş şu: geçmemek için artık pek az neden kaldı — bir öğleden sonralık test karşılığında MPL lisansı, topluluk yönetişimi ve state şifreleme gibi özellikler elde ediyorsunuz.

Bu fork'a özgü kararın ötesinde daha geniş bir infrastructure-as-code karşılaştırması için [Terraform mu Pulumi mi yazımıza](/tr/posts/terraform-mu-pulumi-mi) bakabilirsiniz. Dağıtım pipeline'ınızı bu araçlardan biri etrafında yeniden kuruyorsanız [CI/CD pipeline rehberimiz](/tr/posts/cicd-pipeline-nasil-kurulur) ve [blue-green ile canary deployment yazımız](/tr/posts/blue-green-mi-canary-mi) yayın stratejisi tarafını kapsıyor. Daha fazla altyapı içeriği için [DevOps & Bulut kategorimize](/tr/category/devops-bulut) bakabilirsiniz.

Kaynaklar: [OpenTofu'nun resmi blogu](https://opentofu.org/blog/), [HashiCorp'un lisans SSS'i](https://www.hashicorp.com/en/license-faq) ve [OpenTofu GitHub sürümleri sayfası](https://github.com/opentofu/opentofu/releases).

## Sıkça Sorulan Sorular

### OpenTofu, Terraform'un birebir yerine geçebilir mi?

`.tf` konfigürasyonlarının büyük çoğunluğu için evet — `tofu init` ve `tofu plan`, mevcut Terraform state dosyalarına karşı hiçbir dönüştürme adımı gerekmeden doğrudan çalışır. İstisnalar HCP Terraform'un yönetilen özellikleri (Sentinel, run task'lar, hosted state) ve henüz OpenTofu uyumlu build yayınlamamış provider'lar.

### OpenTofu kullanmak ücretli mi?

Hayır. OpenTofu ücretsiz ve MPL 2.0 lisanslı; aracın kendisinin ücretli bir katmanı yok. Spacelift, Scalr ve env0 gibi şirketler onun etrafında kurulu ticari platformlar satıyor, ama CLI ve registry ücretsiz.

### Mevcut Terraform state dosyamı OpenTofu ile kullanabilir miyim?

Evet. OpenTofu, standart `.tfstate` dosyalarını herhangi bir geçiş komutu olmadan okur — ekibinizi geçirmeden önce uyumluluğu doğrulamak için genellikle mevcut backend'inize karşı `tofu init` ve ardından `tofu plan` çalıştırmak yeterli.

### Gruntwork ve Spacelift gibi şirketler neden Terraform'u yeni lisans altında kullanmak yerine fork'ladı?

Business Source License, Terraform üzerine rakip bir ticari ürün kurmayı kısıtlıyor; bu da Terraform'a bağımlı ürünler satan sağlayıcıları doğrudan etkiledi. Son MPL lisanslı sürümü Linux Foundation yönetişimi altında fork'lamak, bu şirketlere ve daha geniş topluluğa ileriye dönük kalıcı olarak açık bir lisans garanti etti.
