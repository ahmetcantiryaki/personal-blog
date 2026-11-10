---
title: "CI'da Anahtarsız Dağıtım: OIDC Nasıl Kurulur?"
slug: "anahtarsiz-ci-oidc"
translationKey: "keyless-ci-oidc-instead-of-secrets"
locale: "tr"
excerpt: "Kısa cevap: GitHub Actions'a id-token: write izni verip bulutta OIDC güven ilişkisi kurun; CI, uzun ömürlü anahtar saklamadan kısa ömürlü kimlik bilgisi alır."
category: "devops-cloud"
tags: ["ci-cd", "aws", "authentication", "devops"]
publishedAt: "2026-11-10"
seoTitle: "CI'da Anahtarsız Dağıtım: OIDC Nasıl Kurulur?"
seoDescription: "GitHub Actions'tan AWS'ye uzun ömürlü anahtar olmadan bağlanmak için OIDC federasyonu nasıl kurulur? Trust policy, sub claim ve en sık hatalar burada."
---

Kısa cevap: CI'ya statik bir `AWS_ACCESS_KEY_ID` koymak yerine iş akışına `permissions: id-token: write` verin, bulut sağlayıcıda GitHub'ın OIDC sağlayıcısına güvenen bir rol tanımlayın ve her çalıştırmada 15-60 dakikalık geçici kimlik bilgisi alın. Depoda hiçbir uzun ömürlü anahtar kalmaz.

## CI'da Uzun Ömürlü Bulut Anahtarları Neden Risklidir?

Çünkü bir `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY` çifti repo secrets'a bir kez girdiğinde, biri onu döndürmeyi hatırlayana kadar aylarca — çoğu zaman yıllarca — geçerli kalır. Secret'i loglayan bozuk bir adım, bir fork PR'ının secrets'a erişmeye çalışması ya da ele geçirilmiş bir bağımlılık, anahtarı elinde tutan herkese hesabınızın yetkilerinin tamamını verir.

OIDC federasyonu bu modeli tersine çevirir: CI, kimliğini kanıtlayan imzalı bir JWT token üretir; bulut sağlayıcı bu token'ı önceden tanımlanmış bir güven ilişkisine göre doğrular ve karşılığında dakikalar içinde süresi dolan geçici kimlik bilgisi verir. Token çalınsa bile saatler içinde işe yaramaz hale gelir.

## GitHub Actions OIDC Federasyonu Nasıl Çalışır?

GitHub Actions, her iş çalıştığında `token.actions.githubusercontent.com`'u veren taraf olarak gösteren bir OIDC token'ı otomatik üretir; bu, [GitHub'ın güvenlik sertleştirme dokümantasyonunda](https://docs.github.com/en/actions/security-for-github-actions/security-hardening-your-deployments/about-security-hardening-with-openid-connect) doğrulanıyor. Token'ın içinde ayrı `repository` ve `ref` alanları, ayrıca varsayılan olarak `repo:ORG/REPO:ref:refs/heads/BRANCH` ya da bir GitHub Environment kullanılıyorsa `repo:ORG/REPO:environment:ENV_NAME` biçiminde birleşik bir `sub` (subject) alanı bulunuyor. Environment claim'i yalnızca iş, `environment:` anahtarıyla bir GitHub Environment'a referans verdiğinde dolduruluyor.

Bulut sağlayıcı tarafında yapılan tek şey: `token.actions.githubusercontent.com`'u bir OIDC identity provider olarak kaydetmek ve bir role/service account'un trust policy'sinde hangi `sub`/`aud` değerlerinin kabul edileceğini yazmak. İş akışı çalıştığında token'ı bu role'e karşı değiştiriyor — statik anahtar hiçbir yerde saklanmıyor.

## GitHub Actions'tan AWS'ye Nasıl Bağlanılır?

Üç adım var: AWS IAM'de GitHub'ı OIDC provider olarak ekleyin, trust policy'si token'ın `sub`/`aud` claim'lerini kontrol eden bir IAM role oluşturun, iş akışında da `aws-actions/configure-aws-credentials` action'ını `permissions: id-token: write` ile çağırın.

```yaml
permissions:
  id-token: write
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/ci-deploy-role
          aws-region: eu-central-1
```

`role-to-assume` dışında statik kimlik bilgisi yok; action, token'ı arka planda `sts:AssumeRoleWithWebIdentity` ile değiştiriyor.

## Trust Policy Belirli Bir Repo ve Branch'e Nasıl Kilitlenir?

Trust policy'de `aud` değerini `sts.amazonaws.com`'a, `sub` değerini de tam olarak hedeflediğiniz repo+branch kombinasyonuna sabitleyerek kilitlenir — [AWS Builder Center'daki örnek konfigürasyon](https://builder.aws.com/content/3KcAhcSWqRFsYQRrL2kiyhfDOmm/github-actions-to-aws-without-long-lived-keys) tam olarak bu `StringEquals` deseniyle çalışıyor.

```json
{
  "Effect": "Allow",
  "Principal": { "Federated": "arn:aws:iam::123456789012:oidc-provider/token.actions.githubusercontent.com" },
  "Action": "sts:AssumeRoleWithWebIdentity",
  "Condition": {
    "StringEquals": {
      "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
      "token.actions.githubusercontent.com:sub": "repo:acme-corp/payments-api:ref:refs/heads/main"
    }
  }
}
```

| Özellik | Uzun ömürlü anahtar | OIDC kısa ömürlü kimlik bilgisi |
| --- | --- | --- |
| Geçerlilik süresi | Döndürülene kadar (genelde aylar/yıllar) | 15-60 dakika |
| Rotasyon ihtiyacı | Manuel, genelde unutulur | Yok — her çalıştırmada yeniden üretilir |
| Sızarsa risk alanı | Anahtar süresi boyunca tam hesap erişimi | Token süresi dolana kadar, tek role ile sınırlı |
| Denetim izi | Tek bir uzun ömürlü kimlik, CloudTrail'de ayırt edilmesi zor | Her çalıştırma ayrı `AssumeRoleWithWebIdentity` olayı |

GCP'de aynı mantık Workload Identity Federation ile, Azure'da ise federated credentials ile çalışıyor; her ikisinde de prensip aynı — sabit sır yok, sadece token/claim doğrulaması var. GCP'de GitHub'ı bir workload identity pool'a provider olarak eklersiniz ve attribute condition'da `assertion.repository`'yi beklediğiniz repoya sabitlersiniz; Azure'da ise bir App Registration üzerinde federated credential tanımlarsınız ve "subject identifier" alanına aynı `repo:ORG/REPO:ref:refs/heads/BRANCH` deseni girilir. Üç bulut sağlayıcısında da trust ilişkisi tek bir yerde — konsol, Terraform ya da Bicep/CloudFormation şablonunda — tanımlı olduğu için, hangi repo ve branch'in hangi role'e güvendiğini tek bakışta görebiliyorsunuz; bu da uzun ömürlü anahtarların dağınık bir şekilde birçok CI/CD aracında saklandığı eski modelden çok daha denetlenebilir.

Geçişi kademeli yapmak da işe yarıyor: önce tek bir düşük riskli pipeline'ı OIDC'ye taşıyın, bir hafta boyunca CloudTrail/audit log'larında beklenmeyen bir reddedilme olup olmadığını izleyin, sonra kalan pipeline'ları tek tek geçirin. Statik anahtarları hemen silmeyin — OIDC akışı bir haftadır sorunsuz çalışıyorsa, anahtarları devre dışı bırakıp birkaç gün bekleyin, hiçbir şey patlamazsa tamamen silin.

## En Sık Yapılan OIDC Hataları Nelerdir?

En sık hata, `sub` koşulunu `repo:acme-corp/*` gibi bir joker karakterle gevşetmek; bu, organizasyondaki herhangi bir deponun — hatta bir fork PR'ının tetiklediği bir çalıştırmanın — aynı role'e güvenmesine izin verir. GitHub'ın 2026'da devreye aldığı değişmez (immutable) subject claim formatı bunu daha da karmaşıklaştırıyor: eski `repo:ORG/REPO:ref:...` desenine ek olarak organizasyon ve repo ID'lerini içeren `repo:ORG@ORG_ID/REPO@REPO_ID:ref:...` biçimi de geçerli hale geliyor, bu yüzden eski joker karakterli koşullar yeni repolarla eşleşmeyi bırakabiliyor — [AWS Builder Center'ın bu değişikliği ele alan yazısı](https://builder.aws.com/content/3Gkby3FG8juxMqEXkwPzk5hsPz3/github-oidc-changes-that-can-break-aws-deployments/) hem klasik hem ID tabanlı formatın koşulda birlikte listelenmesini öneriyor.

İkinci yaygın hata: `aud` kontrolünü atlamak. Sadece `sub`'a bakan bir trust policy, aynı issuer'ı paylaşan başka bir GitHub organizasyonunun token'ının kabul edilmesine karşı savunmasız — `aud: sts.amazonaws.com` kontrolü bunu kapatıyor. Üçüncü hata, tek bir role'ü birden fazla pipeline arasında paylaşmak: bir deploy iş akışı ile bir test iş akışı aynı role'ü kullanıyorsa, test akışındaki bir güvenlik açığı doğrudan production deploy yetkisine sıçrayabilir.

## OIDC Kurulumunu Nasıl Denetlersiniz?

En az yetki kontrol listesi: `sub` koşulunu tam repo+branch veya environment'a sabitleyin; joker karakteri sadece gerçekten birden fazla branch'in deploy etmesi gerektiğinde ve dar bir desenle kullanın; her role'ü tek bir iş akışının ihtiyaç duyduğu izinlerle sınırlayın, geniş bir "ci-admin" role'ü paylaşmayın; `aud` kontrolünü asla atlamayın.

Denetim tarafında, AWS'de CloudTrail'de o role için `AssumeRoleWithWebIdentity` olaylarını filtreleyin — her satır hangi repo/branch/environment'ın token aldığını gösteriyor, çünkü `sub` değeri olayın kendisine düşüyor. Beklenmeyen bir repo ya da branch'ten gelen bir satır, trust policy'nin fazla gevşek olduğunun en net işareti.

[CI/CD pipeline'ınızı sıfırdan kuruyorsanız](/tr/posts/cicd-pipeline-nasil-kurulur) OIDC adımını ilk günden dahil etmek, sonradan eklemekten çok daha kolay. Secrets'ın CI dışındaki kalanı için [buluttaki secret yönetimi rehberimize](/tr/posts/bulutta-secret-yonetimi) bakabilirsiniz. Pipeline'a AI ajanları da bağlıyorsanız, [ai ajanlarını CI/CD'ye güvenle bağlama](/tr/posts/ai-ajanlari-cicd-guvenle-baglamak) yazısı aynı en-az-yetki mantığını ajan kimlikleri için ele alıyor. Tüm DevOps/Bulut içeriği için [kategori sayfasına](/tr/category/devops-bulut) göz atabilirsiniz.

Açıkçası OIDC'nin kendisi nadiren sorun çıkarıyor — sorun, kurulumu hızlandırmak için `sub` koşulunu "sonra sıkılaştırırım" diyerek gevşek bırakmak. O "sonra" çoğu zaman gelmiyor.

## Sıkça Sorulan Sorular

### GitHub Actions OIDC token'ındaki sub claim'i nedir?

`sub` (subject) claim'i, token'ı kimin ürettiğini tanımlayan birleşik bir alan; varsayılan olarak `repo:ORG/REPO:ref:refs/heads/BRANCH` ya da bir environment kullanılıyorsa `repo:ORG/REPO:environment:ENV_NAME` biçiminde geliyor. Bulut sağlayıcıdaki trust policy, bu değeri kontrol ederek sadece belirli bir repo, branch veya environment'tan gelen çalıştırmaların role'e güvenmesine izin veriyor.

### Uzun ömürlü AWS anahtarları yerine OIDC kullanmak neden daha güvenli?

Çünkü OIDC ile üretilen kimlik bilgileri 15-60 dakika içinde kendiliğinden geçersiz oluyor ve her CI çalıştırmasında yeniden üretiliyor, bu yüzden sızan bir token'ın kullanım penceresi çok kısa. Uzun ömürlü bir anahtar ise biri onu fark edip döndürene kadar — genelde aylarca — tam hesap erişimi veriyor.

### GitHub Actions'tan AWS'ye OIDC ile bağlanmak için ne gerekiyor?

Üç şey: AWS IAM'de `token.actions.githubusercontent.com`'u OIDC identity provider olarak kaydetmek, `sub`/`aud` claim'lerini kontrol eden bir trust policy'li IAM role oluşturmak, ve iş akışında `permissions: id-token: write` ile `aws-actions/configure-aws-credentials` action'ını kullanmak. Repo secrets'a hiçbir statik anahtar eklenmiyor.

### Trust policy'de joker karakter (wildcard) kullanmak güvenli mi?

Sadece dar ve kasıtlı bir desenle kullanıldığında — örneğin `repo:acme-corp/payments-api:ref:refs/heads/release-*` gibi belirli bir deponun release branch'lerini kapsayan bir desen. `repo:acme-corp/*` gibi organizasyon genelinde bir joker karakter, o organizasyondaki herhangi bir deponun aynı role'e güvenmesine izin verdiği için en-az-yetki ilkesini tamamen boşaltıyor.
