---
title: "Terraform mu Pulumi mi: IaC Karşılaştırması"
slug: "terraform-mu-pulumi-mi"
translationKey: "terraform-vs-pulumi"
locale: "tr"
excerpt: "Terraform mu Pulumi mi? 2026'da HCL ile gerçek programlama dilleri; state, test, ekosistem ve maliyet farkları gerçek kod ve komutlarla, net bir karar rehberiyle."
category: "devops-cloud"
tags: ["infrastructure-as-code", "terraform", "devops", "cloud"]
publishedAt: "2026-05-16"
seoTitle: "Terraform mu Pulumi mi: IaC Karşılaştırması"
seoDescription: "Terraform mu Pulumi mi? 2026'da state, dil seçenekleri, test ve maliyet gerçek kod ve komutlarla karşılaştırıldı; ekibiniz için pratik bir karar rehberi."
---

**Terraform mu Pulumi mi** sorusu tek bir noktada düğümleniyor: özel bir yapılandırma dili (HCL) mi istiyorsunuz, yoksa ekibinizin gerçek programlama dilini (TypeScript, Python, Go, C#) mi? Terraform en büyük ekosisteme sahip bildirimsel standart. Pulumi ise aynı sağlayıcıları gerçek kodla sarıp döngü, fonksiyon ve birim testlerini doğrudan sunuyor.

2026'da her ikisi de üretim seviyesinde. Doğru seçim ekibinizin becerilerine, test ihtiyaçlarına ve ekosistem büyüklüğü ile programlama esnekliği arasında nereye ağırlık verdiğinize bağlı. İkisini de üretime çıkardık; aşağıda günlük kullanımda gerçekten neyin farklılaştığını anlatıyoruz.

## Terraform ile Pulumi arasındaki fark nedir?

Terraform ve Pulumi, bulut kaynaklarını bildirimsel biçimde sağlayan ve state içinde takip eden iki altyapı-as-code aracıdır. Temel fark şu: Terraform kendi alana özgü dili HCL'yi kullanır, Pulumi ise altyapıyı TypeScript, Python, Go, C#, Java veya YAML ile tanımlamanıza izin verir. İkisi de aynı bulut sağlayıcı API'lerini çağırır.

Kaputun altında göründüklerinden daha yakınlar. Pulumi, Terraform sağlayıcılarını köprü üzerinden doğrudan kullanabilir; yani sağladığınız AWS, Azure ve GCP kaynakları büyük ölçüde aynıdır. Değişen şey yazım deneyimi ve etrafındaki araç setidir.

Pratikte bu şu anlama gelir: bir sağlayıcıda bir kaynak yeni çıktığında ikisinde de kısa sürede kullanılabilir olur. Karar verirken "hangisi daha çok bulut destekliyor" sorusuna takılmayın; ikisi de aynı sağlayıcı katmanına dayanır. Asıl ayrışma, o kaynakları nasıl tanımladığınızda ve ekibinizin bu tanımları nasıl test edip yeniden kullandığında ortaya çıkar.

## Terraform mu Pulumi mi: yan yana karşılaştırma

İkisinin gerçek bir ekip için karar verirken önemli olan faktörlerde nasıl durduğu şöyle:

| Faktör | Terraform | Pulumi |
|--------|-----------|--------|
| Dil | HCL (bildirimsel DSL) | TypeScript, Python, Go, C#, Java, YAML |
| Lisans | BUSL 1.1 (OpenTofu, MPL forku) | Apache 2.0 |
| State arka ucu | S3, Terraform Cloud, HCP, self-hosted | Pulumi Cloud, S3/Azure/GCS, self-hosted |
| Test | `terraform validate`, Terratest (Go) | Kendi dilinizde birim test + mock |
| Döngü ve mantık | `for_each`, `count`, ifadeler | Tam dil: `for`, `if`, fonksiyon, sınıf |
| Ekosistem | En büyük; Registry'de binlerce modül | Büyüyor; köprüyle Terraform sağlayıcıları |
| Öğrenme eğrisi | Ops için düşük; yeni sözdizimi | Dili biliyorsanız düşük; kavramlar farklı |
| Sırlar | Sensitive işaretlenir; şifreleme için harici araç | State içinde yerleşik şifreli sırlar |

## Terraform'u ne zaman seçmelisiniz?

Terraform'u, en güvenli ve en yaygın desteklenen seçeneği istediğinizde ve ekibiniz bildirimsel yapılandırmayla rahatken seçin. En geniş yetenek havuzuna, en derin modül registry'sine ve CI/CD platformları, politika araçları ve bulut sağlayıcıları genelinde neredeyse evrensel desteğe sahip. 2026'da çoğu altyapı ekibi için hâlâ varsayılan.

Terraform şu durumlarda öne çıkar:

- **Yazılım mühendisi değil, ops ekibi işe alıyorsunuz.** HCL hızlı okunur ve aşırı mühendisliğe zor kaçar.
- **Devasa bir modül ekosistemine ihtiyacınız var.** Herkese açık Registry neredeyse her sağlayıcıyı ve deseni kapsar.
- **Sağlayıcıdan bağımsız araç istiyorsunuz.** Sentinel, OPA, Terragrunt, Atlantis ve Spacelift önce Terraform'u hedefler.
- **Uyumluluk lisansı önemsiyor.** BUSL sizin için sorunsa OpenTofu, aktif topluluğa sahip yerine geçebilir MPL-2.0 forku sunar.

Minimal bir Terraform kaynağı şöyle görünür:

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

Pulumi'yi, ekibiniz zaten uygulama kodu yazıyorsa ve altyapıyı aynı dilde, aynı IDE, test ve soyutlamalarla istiyorsa seçin. Gerçek döngüler, koşullar ve fonksiyonlar HCL'nin teşvik ettiği kopyala-yapıştırı ortadan kaldırır; altyapı mantığınızı zaten kullandığınız çerçeveyle birim test edebilirsiniz.

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
- **Yerleşik sırlar.** Sırlar varsayılan olarak state içinde şifrelenir, ek araç gerekmez.

Bedeli şu: daha fazla güç, altyapıyı incelemesi zor biçimde yazmanın daha fazla yolu demek. 200 satır TypeScript üzerindeki bir `plan` farkı, ancak onu üreten kod kadar nettir.

## 2026'da ekibiniz için hangisi daha iyi?

Evrensel bir kazanan yok — uyum var. Yürüttüğümüz projelere dayanan hızlı karar rehberi:

1. **Saf ops ekibi, karışık bulutlar, istikrar mı istiyorsunuz?** Terraform (lisans önemliyse OpenTofu).
2. **Kendi altyapısına sahip ürün mühendisleri mi?** Pulumi — aynı dil, aynı testler.
3. **Yoğun dinamik mantık veya karmaşık soyutlamalar mı?** Pulumi'nin gerçek kodu kazanır.
4. **Mümkün olan en büyük ekosistem ve işe alım havuzu mu?** Açık ara Terraform.
5. **Zaten Terraform modüllerinde derinleştiniz mi?** Kalın; Pulumi bunları içe aktarabilir ama geçiş maliyeti tek başına nadiren karşılığını verir.
6. **IBM satın alması sonrası HashiCorp'un BUSL lisansından endişeli misiniz?** OpenTofu, toplulukça yönetilen MPL yolu.

Bizi şaşırtan bir şey: araç değiştirmek bir state yönetimi sorununu nadiren çözer. Her iki araç da disiplinli state arka uçları, kilitleme ve küçük etki alanıyla ayakta kalır ya da devrilir. Önce bunları doğru kurun.

Deneyimimizden bir uyarı daha: aracın seçimi ekibin ortak dilinden daha az önemli. Yarısı HCL, yarısı TypeScript yazan bir ekip, hangi aracı seçerse seçsin bakım yükünü ikiye katlar. Bir standart belirleyin, modül veya paket sınırlarını netleştirin ve incelemeyi zorunlu kılın. Araç değil, bu disiplin uzun vadede altyapınızı ayakta tutar.

Daha geniş bir pratik oluşturuyorsanız bunu [yeniden kullanılabilir Terraform modülleri tasarlama](#), [uzak state'i güvenle yönetme](#) ve [altyapı için CI/CD hatları](#) rehberlerimizle birleştirin. Büyük resim için [DevOps ve bulut ana sayfamıza](#) göz atın.

## Sıkça Sorulan Sorular

### Pulumi Terraform'dan daha mı hızlı?

Sağlama hızı kabaca eşittir çünkü ikisi de aynı bulut API'lerini çağırır. Döngü veya soyutlama gerektiğinde Pulumi geliştirme açısından daha hızlı hissettirebilir, çünkü HCL geçici çözümlerinden kaçınırsınız. Ham `apply`/`up` süreleri araca değil, bulut sağlayıcısına ve kaynak sayısına bağlıdır.

### Terraform'dan Pulumi'ye geçiş yapabilir miyim?

Evet. Pulumi bir `pulumi convert` yolu sunar, mevcut Terraform state'ini içe aktarabilir ve hatta HCL'yi tüketebilir. Pratikte kademeli geçin: tek bir stack'i taşıyın, planın no-op olduğunu doğrulayın, sonra genişletin. Sırf yenilik için geçmeyin — ekibiniz gerçek koddan somut fayda gördüğünde yapın.

### Terraform 2026'da hâlâ ücretsiz mi?

Terraform, BUSL 1.1 lisansı altında kaynağı-açık; çoğu üretim kullanımı için ücretsiz ancak rakip ticari ürünler için kısıtlı. Bu lisans engel oluşturuyorsa OpenTofu, Terraform iş akışı ve sağlayıcılarıyla uyumlu kalan tamamen açık kaynak (MPL-2.0) bir fork sunar.

### Pulumi, Pulumi Cloud gerektirir mi?

Hayır. Pulumi Cloud varsayılan state arka ucudur ama tıpkı Terraform gibi state'i S3, Azure Blob, GCS veya yerel dosyada kendiniz yönetebilirsiniz. Pulumi'nin SaaS özellikleri için (RBAC, denetim günlükleri, politika) yalnızca istediğinizde ödersiniz.
