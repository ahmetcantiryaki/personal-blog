---
title: "Terraform mu Pulumi mi: IaC Karşılaştırması"
slug: "terraform-mu-pulumi-mi"
translationKey: "terraform-vs-pulumi"
locale: "tr"
excerpt: "Terraform mu Pulumi mi? 2026 ortasında HCL ile gerçek diller state, test, lisans ve ekip uyumunda nasıl ayrışıyor — güncel sürümler, gerçek kod ve net bir karar rehberiyle."
category: "devops-cloud"
tags: ["infrastructure-as-code", "terraform", "devops", "cloud"]
publishedAt: "2026-07-01"
seoTitle: "Terraform mu Pulumi mi: IaC Karşılaştırması"
seoDescription: "Terraform mu Pulumi mi? 2026'da state, diller, test, lisans ve maliyet güncel sürümler ve gerçek kodla karşılaştırıldı; ekibiniz için pratik bir karar rehberi."
---

Çoğu ekibin kaçırdığı rahatsız edici gerçek şu: **Terraform mu Pulumi mi** sorusu, altyapınızın üretimde ayakta kalıp kalmayacağını belirleyen karar nadiren budur. Herkes bunu bir dil savaşı olarak kurguluyor — HCL'ye karşı TypeScript, Python, Go, C#. Oysa yazdığınız dil, ikinci haftadan sonra önemini yitiren kısım. Sizi asıl ısıran şey state, etki alanı (blast radius), test disiplini ve 2026'nın yeni gündemi: hukuk ekibinizin hangi lisansı imzalayacağı.

Her iki araç da üretim seviyesinde. İkisini de canlıya çıkardık. Aşağıda, günlük kullanımda gerçekten neyin farklılaştığını Temmuz 2026 itibarıyla güncel sürümlerle anlatıyoruz.

## Terraform ile Pulumi arasındaki fark nedir?

Terraform ve Pulumi, bulut kaynaklarını bildirimsel olarak sağlar ve state içinde takip eder. Başlıktaki fark şu: Terraform kendi alana özgü dili HCL'yi kullanır, Pulumi ise altyapıyı TypeScript, Python, Go, C#, Java veya YAML ile tanımlamanıza izin verir. İkisi de aynı bulut sağlayıcı API'lerini çağırır.

Kaputun altında pazarlamanın söylediğinden daha yakınlar. Pulumi, köprüsü üzerinden Terraform sağlayıcılarını doğrudan tüketir; yani sağladığınız AWS, Azure ve GCP kaynakları büyük ölçüde aynıdır. Bir sağlayıcı yeni bir kaynak çıkardığında ikisi de birkaç gün içinde alır. "Hangisi daha çok bulut destekliyor" derdini bırakın — ikisi de aynı sağlayıcı katmanına dayanır. Değişen şey yazım deneyimi ve etrafındaki her şey.

## Terraform mu Pulumi mi: güncel sürüm karşılaştırması

Temmuz 2026 itibarıyla Terraform'un son kararlı sürümü **1.15.7** (1.16.0 alfa aşamasında), Pulumi CLI ise 2 Temmuz 2026'da çıkan **v3.250.0** sürümünde. Gerçek projelere karar verdiren faktörlerde durumları şöyle:

| Faktör | Terraform | Pulumi |
|--------|-----------|--------|
| Son kararlı sürüm (Tem 2026) | 1.15.7 | v3.250.0 |
| Dil | HCL (bildirimsel DSL) | TypeScript, Python, Go, C#, Java, YAML |
| Lisans | BUSL 1.1 (sahibi IBM) | Apache 2.0 |
| State arka ucu | S3, Terraform Cloud, HCP, self-hosted | Pulumi Cloud, S3/Azure/GCS, self-hosted |
| Test | `terraform validate`, Terratest (Go) | Kendi dilinizde birim test + mock |
| Döngü ve mantık | `for_each`, `count`, ifadeler | Tam dil: `for`, `if`, fonksiyon, sınıf |
| Sır yönetimi | `sensitive` işareti; harici KMS/Vault | Yerleşik şifreli sır; ESC + döndürülen sırlar |
| Ekosistem | Açık ara en büyük modül Registry'si | Köprüyle Terraform sağlayıcıları |
| AI araçları | Üçüncü taraf | Pulumi Copilot + Pulumi MCP Server |

O lisans satırı 2026'nın sürpriz gelişmesi, o yüzden doğrudan onunla başlayalım.

## Artık görmezden gelemeyeceğiniz lisans sorusu

Terraform 2023'te Business Source License'a (BUSL 1.1) geçmişti ve **IBM, HashiCorp'u satın alma işlemini 27 Şubat 2025'te 6,4 milyar dolara tamamladı**. Kaynağı-açık, çoğu üretim kullanımı için ücretsiz ama rakip ticari ürünler geliştirmeye karşı kısıtlı.

Topluluğun yanıtı OpenTofu oldu — Linux Foundation yönetimindeki MPL-2.0 forku. Artık bir dipnot değil. OpenTofu'nun son kararlı sürümü **1.12.2** (Haziran 2026), yaklaşık 10 milyon indirmeyi geçti ve anketler Terraform kullanıcılarının yaklaşık %38'inin alternatifleri aktif olarak değerlendirdiğini gösteriyor. En önemlisi, OpenTofu artık açık Terraform ikilisinde olmayan özellikler sunuyor — yerleşik **durağan state şifreleme** (parola, AWS/GCP KMS veya OpenBao ile AES-GCM) ve sırları state'ten tamamen uzak tutan ephemeral değerler.

Yani 2026'nın dürüst çerçevesi iki değil, üç yönlü: Terraform, Pulumi ya da OpenTofu.

## Terraform'u ne zaman seçmelisiniz?

Terraform'u (veya OpenTofu'yu), en güvenli ve en yaygın desteklenen yolu istediğinizde ve ekibiniz bildirimsel yapılandırmayla rahatken seçin. En geniş yetenek havuzuna, en derin modül registry'sine ve CI/CD platformları ile politika araçlarında neredeyse evrensel desteğe sahip.

Terraform şu durumlarda öne çıkar:

- **Yazılım mühendisi değil, ops ekibi işe alıyorsunuz.** HCL hızlı okunur ve aşırı mühendisliğe zor kaçar.
- **Devasa bir modül ekosistemine ihtiyacınız var.** Herkese açık Registry neredeyse her sağlayıcıyı kapsar.
- **Sağlayıcıdan bağımsız araç istiyorsunuz.** Sentinel, OPA, Terragrunt, Atlantis ve Spacelift önce Terraform'u hedefler.
- **Uyumluluk lisansı önemsiyor.** BUSL engelse OpenTofu, Terraform'un açık ikilisinin hâlâ sunmadığı state şifrelemesiyle gelen yerine geçebilir bir MPL-2.0 forku.

Minimal bir kaynak:

```hcl
resource "aws_s3_bucket" "logs" {
  bucket = "woyable-app-logs"
  tags = {
    Environment = "production"
  }
}

resource "aws_s3_bucket_versioning" "logs" {
  bucket = aws_s3_bucket.logs.id
  versioning_configuration {
    status = "Enabled"
  }
}
```

Standart döngüyle çalıştırın: `terraform init`, `terraform plan`, `terraform apply`. Plan çıktısının okunabilirliği meşhurdur ve inceleme sırasında gerçek bir avantajdır.

## Pulumi'yi ne zaman seçmelisiniz?

Pulumi'yi, ekibiniz zaten uygulama kodu yazıyorsa ve altyapıyı aynı dilde, aynı IDE, test ve soyutlamalarla istiyorsa seçin. Gerçek döngüler, koşullar ve fonksiyonlar HCL'nin teşvik ettiği kopyala-yapıştırı ortadan kaldırır; altyapı mantığınızı zaten kullandığınız çerçeveyle birim test edersiniz.

Aynı S3 kovası Pulumi ile TypeScript'te:

```typescript
import * as aws from "@pulumi/aws";

const logs = new aws.s3.BucketV2("logs", {
  bucket: "woyable-app-logs",
  tags: { Environment: "production" },
});

new aws.s3.BucketVersioningV2("logs-versioning", {
  bucket: logs.id,
  versioningConfiguration: { status: "Enabled" },
});
```

`pulumi up` ile çalıştırın. Pulumi'nin öne geçtiği yerler:

- **Soyutlama.** Tüm bir ortamı bir sınıfa sarıp her bölge için tek satırla örnekleyin.
- **Test.** Bulut sağlayıcısını mock'layıp kaynak özelliklerini Jest, pytest veya Go test paketiyle doğrulayın — canlı buluta gerek yok.
- **Dinamik mantık.** Kaynakları bir API yanıtından, veritabanından veya yapılandırma dosyasından deploy anında üretin.
- **Büyümüş sır yönetimi.** Sırlar varsayılan olarak state içinde şifreli; ayrıca uzun ömürlü statik kimlik bilgilerini bitiren, döndürülen sırlarla Pulumi ESC — denetimler için önemli bir 2026 eklentisi.

Bedeli gerçek: daha fazla güç, kimsenin inceleyemeyeceği altyapıyı yazmanın daha fazla yolu demek. 200 satır TypeScript üzerindeki bir `plan` farkı, ancak onu üreten kod kadar nettir.

## 2026'da ekibiniz için hangisi daha iyi?

Evrensel bir kazanan yok — uyum var. Yürüttüğümüz projelere dayanan hızlı karar rehberi:

1. **Saf ops ekibi, karışık bulutlar, istikrar mı istiyorsunuz?** Terraform ya da lisans önemliyse OpenTofu.
2. **Kendi altyapısına sahip ürün mühendisleri mi?** Pulumi — aynı dil, aynı testler.
3. **Yoğun dinamik mantık veya karmaşık soyutlamalar mı?** Pulumi'nin gerçek kodu kazanır.
4. **En büyük ekosistem ve işe alım havuzu mu?** Açık ara Terraform.
5. **Terraform modüllerinde derinsiniz ama IBM/BUSL sizi geriyor mu?** OpenTofu — mevcut modül ve state'inizi içe aktarır.
6. **Vault eklemeden durağan state şifrelemesi mi lazım?** OpenTofu bunu yerleşik sunar.

İşte ölçülü görüşüm: zaten Terraform içinde yaşayan çoğu ekip için 2026 hamlesi "her şeyi Pulumi'ye yeniden yazmak" değil. "Mevcut state'inize `tofu init` çalıştırıp yola devam etmek." Araç değiştirmek bir state yönetimi sorununu nadiren çözer — her iki araç da disiplinli state arka uçları, kilitleme ve küçük etki alanıyla ayakta kalır ya da devrilir. Önce bunları doğru kurun.

Zorlukla öğrenilmiş bir ders daha: araç, ekibin ortak dilinden daha az önemli. Yarısı HCL, yarısı TypeScript yazan bir ekip, hangi araç kazanırsa kazansın bakım yükünü ikiye katlar. Bir standart belirleyin, temiz modül veya paket sınırları çizin ve incelemeyi zorunlu kılın.

Daha geniş bir pratik oluşturuyorsanız bunu [altyapı için CI/CD hatları](/tr/posts/cicd-pipeline-nasil-kurulur), [GitOps prensipleri ve araçları](/tr/posts/gitops-nedir) ve [platform engineering](/tr/posts/platform-engineering-nedir) rehberlerimizle birleştirin. Baskı maliyetse [FinOps rehberimiz](/tr/posts/finops-bulut-maliyeti-dusurme) iyi eşlik eder; gerisi için [DevOps & Bulut kategorisine](/tr/category/devops-bulut) bakın.

## Sıkça Sorulan Sorular

### Pulumi Terraform'dan daha mı hızlı?

Sağlama hızı kabaca eşittir çünkü ikisi de aynı bulut API'lerini çağırır. Döngü veya soyutlama gerektiğinde Pulumi geliştirme açısından daha hızlı hissettirebilir, çünkü HCL geçici çözümlerini atlarsınız. Ham `apply`/`up` süreleri araca değil, bulut sağlayıcısına ve kaynak sayısına bağlıdır.

### Terraform'dan Pulumi'ye geçiş yapabilir miyim?

Evet. Pulumi bir `pulumi convert` yolu sunar, mevcut Terraform state'ini içe aktarabilir ve hatta HCL'yi tüketebilir. Kademeli geçin: tek bir stack'i taşıyın, planın no-op olduğunu doğrulayın, sonra genişletin. Yenilik için geçmeyin — ekibiniz gerçek koddan somut fayda gördüğünde yapın.

### 2026'da Terraform'dan OpenTofu'ya geçmeli miyim?

BUSL veya IBM satın alması hukuk ekibinizi endişelendiriyorsa OpenTofu (Haziran 2026 itibarıyla v1.12.2), state ve modüllerinizi içe aktaran, üstüne yerleşik state şifrelemesi ekleyen yerine geçebilir bir MPL-2.0 forku. Birçok ekip için tam bir Pulumi geçişinden daha düşük riskli bir hamle.

### Pulumi, Pulumi Cloud gerektirir mi?

Hayır. Pulumi Cloud varsayılan state arka ucudur ama tıpkı Terraform gibi state'i S3, Azure Blob, GCS veya yerel dosyada kendiniz yönetebilirsiniz. Pulumi'nin SaaS özellikleri için (RBAC, denetim günlükleri, politika, ESC) yalnızca istediğinizde ödersiniz.

---

Kaynaklar: [Terraform sürümleri](https://github.com/hashicorp/terraform/releases), [Pulumi sürümleri](https://www.pulumi.com/releases/), [OpenTofu state şifreleme dokümanı](https://opentofu.org/docs/language/state/encryption/), [IBM HashiCorp satın almasını tamamladı](https://newsroom.ibm.com/2025-02-27-ibm-completes-acquisition-of-hashicorp,-creates-comprehensive,-end-to-end-hybrid-cloud-platform).
