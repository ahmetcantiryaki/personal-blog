---
title: "Bulutta Secret Yönetimi Nasıl Yapılır"
slug: "bulutta-secret-yonetimi"
translationKey: "secrets-management-cloud"
locale: "tr"
excerpt: "Repodaki .env dosyanız aslında bir ihlal bekliyor. SOPS, HashiCorp Vault ve dinamik kısa ömürlü secret'larla doğru yönetim modelini anlatıyoruz."
category: "devops-cloud"
tags: ["cloud", "devops", "best-practices", "infrastructure-as-code"]
publishedAt: "2026-07-13"
seoTitle: "Bulutta Secret Yönetimi Nasıl Yapılır"
seoDescription: "Repodaki .env dosyanız aslında bir ihlal bekliyor. SOPS, HashiCorp Vault ve dinamik kısa ömürlü secret'larla doğru yönetim modelini anlatıyoruz."
---

Repo kökünüzdeki `.env` dosyası bir ihlal bekliyor, sadece henüz gerçekleşmedi. Düz metin API anahtarları, git geçmişinde kalıcı, bir CI log'unda yanlışlıkla basılmış ya da bir fork'ta unutulmuş halde duruyor. Doğru soru "sızacak mı" değil, "ne zaman ve kim fark edecek" sorusu.

Bu iddia abartı gibi gelebilir ama mekanik basit: `.env` dosyaları diske düz metin yazılır, `.gitignore`'a bir satır eklemeyi unutan tek bir commit tüm geçmişe secret'ı kazır ve `git filter-repo` ile temizlemek bile geçmişi tamamen silmez çünkü fork'lar ve local klonlar zaten kopyayı almıştır. Ekran paylaşımında açık bir terminal, bir CI adımının debug modunda ortam değişkenlerini log'a basması, ya da bir yüklenicinin repo'ya erişip ayrılması; hepsi aynı kök nedene çıkar: secret, kodun yanında, kod gibi versiyonlanan bir dosyada yaşıyor.

## .env dosyaları ve commit'lenmiş secret'lar neden başarısız olur

Sorun sadece "biri hata yapabilir" değil, sistemin kendisi hataya davetiye çıkarıyor. `.env` dosyası bir kez `git add .` ile eklendiğinde artık kod tabanının parçası; branch'lenir, merge edilir, herkese açık bir GitHub reposuna fork'lanabilir. Rotasyon yok, çünkü kimse hangi anahtarın hangi ortamda kullanıldığını merkezi olarak takip etmiyor. Erişim kontrolü yok, çünkü repo'ya erişimi olan herkes prod veritabanı şifresini de görüyor. Audit izi yok, çünkü "bu secret'ı kim ne zaman okudu" sorusuna dosya sisteminin cevabı yok.

Bunun karşılığı, secret'ları kod ve yapılandırmadan ayıran, erişimi merkezi olarak denetleyen ve rotasyonu otomatikleştiren bir "secret'ları yönet" katmanı kurmaktır.

## Yönetilen seçenekler: bulut secret yöneticileri, Vault ve SOPS

Üç ana yaklaşım var ve genelde birbirini dışlamıyor.

Bulut sağlayıcıların kendi secret yöneticileri (AWS Secrets Manager, GCP Secret Manager, Azure Key Vault) IAM ile entegre çalışır, secret'ları şifreli saklar ve versiyonlar; küçük-orta ölçekli, tek buluta bağlı ekipler için en düşük operasyonel sürtünmeye sahip seçenektir.

[HashiCorp Vault](https://www.vaultproject.io/), sektörün merkezi secret yönetimi standardı. Statik secret depolamanın ötesinde, isteğe bağlı veritabanı kimlik bilgileri üretebiliyor ve bunları kullanım sonrası ya da TTL dolduğunda otomatik iptal ediyor; buna ek olarak ince taneli erişim politikaları, detaylı audit log'ları ve otomatik rotasyon sunuyor. Ama burada bir uyarı var: birçok ekip Vault'u güvenlik tiyatrosu olarak benimsiyor. Sunucuyu ayağa kaldırıp mevcut secret'ları içine taşıyorlar, sonra dinamik secret'ları ya da otomatik rotasyonu hiç açmıyorlar. Sonuç, Vault'u işletmenin tüm operasyonel yükünü üstlenip, göçü haklı çıkaran asıl güvenlik kazanımından mahrum kalmak oluyor.

[Mozilla SOPS](https://github.com/getsops/sops) farklı bir modelle çalışıyor: YAML, JSON, ENV, INI ve BINARY formatlarını destekleyen bir editör/araç olarak, dosyadaki sadece değerleri şifreliyor, anahtarları düz metin bırakıyor. Bu sayede diff'ler okunabilir kalıyor ve kod review'ı anlamını koruyor. Zarflama şifreleme (envelope encryption) kullanıyor: rastgele üretilen 256 bit'lik bir veri anahtarı, dosya içeriğini AES256-GCM ile şifreliyor, sonra bu veri anahtarının kendisi bir ana anahtarla (AWS KMS, GCP KMS, Azure Key Vault, age ya da PGP) şifrelenip dosyanın metadata'sında saklanıyor. SOPS, [Flux](https://fluxcd.io/flux/guides/mozilla-sops/) ve Argo CD gibi GitOps araçlarıyla doğal şekilde entegre oluyor; şifreli secret'lar git'te güvenle yaşıyor, sadece deploy anında çözülüyor. GitOps akışınızın nasıl kurulduğundan emin değilseniz [GitOps nedir](/tr/posts/gitops-nedir) yazımız iyi bir başlangıç.

## Kısa ömürlü dinamik kimlik bilgileri ile uzun ömürlü anahtarlar

Buradaki asıl zihniyet değişimi, "anahtarı sakla" düşüncesinden "anahtarı gerektiğinde üret" düşüncesine geçmek. Uzun ömürlü bir statik anahtar, sızdığı andan iptal edildiği ana kadar geçerli kalır; bu pencere genelde günler, hatta aylar sürer çünkü kimse anahtarı düzenli değiştirmiyor. Vault'un dinamik secret modeli bunu tersine çeviriyor: bir servis veritabanına bağlanmak istediğinde Vault'tan geçici bir kimlik bilgisi ister, Vault bu kimlik bilgisini o an üretir ve TTL dolduğunda ya da işlem bittiğinde otomatik olarak iptal eder. Sızıntı hâlâ mümkün ama sızan şey saatler içinde geçersiz oluyor, aylarca geçerli bir anahtar değil.

Kubernetes'te çalışıyorsanız bu model External Secrets Operator (ESO) üzerinden cluster'a taşınabiliyor: merkezi bir secret deposu (Vault, bir bulut KMS'i ya da Infisical gibi bir alternatif) ESO aracılığıyla Kubernetes Secret'larına senkronize ediliyor, SOPS ise özellikle git'te yaşaması gereken şifreli yapılandırma dosyaları için kullanılıyor. Temmuz 2026 itibarıyla birçok ekip artık tek bir aracı seçmek yerine bu kombinasyonu tercih ediyor; ölçeklenen bir cluster'ı yönetiyorsanız [Kubernetes otomatik ölçekleme rehberi](/tr/posts/kubernetes-otomatik-olcekleme-rehberi) yazımız bu tür altyapı kararlarını nasıl planlayacağınıza dair tamamlayıcı bir bakış sunuyor.

## Otomatik rotasyon ve en az yetki

Rotasyon "elle her üç ayda bir anahtar değiştiririz" demek değil; sistemin kendisinin, insan müdahalesi olmadan yeni kimlik bilgisi üretip eskisini geçersiz kılması demek. Vault'ta bu, rotasyon politikaları ve dinamik secret motorlarıyla yerleşik olarak geliyor. Bulut secret yöneticilerinde genelde bir Lambda ya da fonksiyon tetikleyicisiyle kurulur. SOPS'ta rotasyon kavramı biraz farklı işler: şifrelenen değer değiştiğinde dosya yeniden şifrelenir ve GitOps pipeline'ı yeni değeri otomatik deploy eder, ama üretme işlemi hâlâ ayrı bir sistemden gelmeli.

En az yetki tarafında ise soru şu: bu servis, gerçekten ihtiyaç duyduğundan fazlasına erişebiliyor mu? Vault'un politika motoru, hangi kimliğin hangi path'e hangi işlemle (okuma, yazma, listeleme) erişebileceğini token bazında tanımlamanıza izin veriyor. Bulut IAM rolleri benzer bir model sunuyor. Audit log'ları burada kritik: "bu secret'ı kim, ne zaman, hangi amaçla okudu" sorusuna cevap veremiyorsanız, aslında en az yetkiyi uyguladığınızı değil, sadece uyguladığınızı varsaydığınızı biliyorsunuz demektir.

## Karşılaştırma

| Araç | Model | En iyi uyum | Rotasyon desteği | Git-native mi? |
|---|---|---|---|---|
| Mozilla SOPS | Dosya içi değer şifreleme (envelope encryption) | GitOps odaklı küçük-orta ekipler | Dolaylı; yeniden şifreleme + pipeline'a bağlı | Evet, şifreli haliyle git'te yaşar |
| HashiCorp Vault | Merkezi sunucu, dinamik secret üretimi | Karmaşık altyapı, merkezi audit gereken ekipler | Yerleşik, otomatik (TTL tabanlı) | Hayır, ayrı bir servis |
| Bulut secret yöneticisi (AWS/GCP/Azure) | Yönetilen servis, IAM entegrasyonu | Tek buluta bağlı, düşük operasyonel yük isteyen ekipler | Yerleşik, sağlayıcıya göre değişir | Hayır, ayrı bir servis |

## Örnek: SOPS ile şifrelenmiş bir yapılandırma dosyası

Aşağıdaki örnek yalnızca yer tutucu (placeholder) değerler içerir; gerçek bir anahtar ya da kimlik bilgisi değildir.

```yaml
# secrets.enc.yaml (SOPS ile şifrelenmiş, sadece değerler)
database:
    username: ENC[AES256_GCM,data:...,tag:...,type:str]
    password: ENC[AES256_GCM,data:...,tag:...,type:str]
sops:
    kms:
        - arn: arn:aws:kms:eu-west-1:000000000000:key/PLACEHOLDER-KEY-ID
    version: 3.8.1
```

Vault tarafında ise dinamik bir veritabanı kimlik bilgisi talebi şöyle görünür:

```bash
vault read database/creds/PLACEHOLDER-ROLE-NAME
# Lease ID:       database/creds/PLACEHOLDER-ROLE-NAME/PLACEHOLDER-LEASE-ID
# Lease Duration: 1h
# username:       PLACEHOLDER-GENERATED-USER
# password:       PLACEHOLDER-GENERATED-PASSWORD
```

Bu yaklaşımların pratikte production ortamına nasıl taşındığına dair daha geniş bağlam için [production için Docker en iyi pratikleri](/tr/posts/docker-en-iyi-pratikleri) yazımıza ve genel olarak [DevOps & Bulut](/tr/category/devops-bulut) kategorimize göz atabilirsiniz.

## .env'den secrets manager'a göç yolu

1. Repolarınızda ve git geçmişinizde `.env` dosyalarını ve sabit kodlanmış anahtarları tarayın; `trufflehog` ya da benzeri bir araçla geçmişi de dahil edin.
2. Ekip büyüklüğünüze ve altyapı karmaşıklığınıza göre bir hedef seçin: küçük ekip ve GitOps ağırlıklıysa SOPS, dinamik secret ve merkezi audit gerekiyorsa Vault ya da bulut secret yöneticisi.
3. Uygulamaları ortam değişkeni okuma yerine secret yöneticisinden çekecek şekilde güncelleyin; Kubernetes'te bunu ESO ile Secret nesnelerine senkronize edin.
4. Yeni secret'ları üretip uygulamaları geçirin, sonra eski anahtarları iptal edin; asla eski anahtarı çalışır durumda bırakıp "sonra silerim" demeyin.
5. `.env` dosyalarını `.gitignore`'a ekleyin ve pre-commit hook'larıyla secret taramasını CI'a bağlayın.

Rotasyon kontrol listesi: her secret için sahip atayın; TTL ya da rotasyon periyodu tanımlayın; rotasyonu otomatikleştirin, elle takvime bağlamayın; her erişimi loglayın; kullanılmayan secret'ları düzenli olarak temizleyin.

## Sıkça Sorulan Sorular

### .env dosyaları hiç kullanılmamalı mı?

Yerel geliştirme ortamında, gerçek secret içermeyen ve `.gitignore`'da olan bir `.env.example` şablonu makul. Sorun `.env`'in kendisi değil, içine gerçek production secret'ı koyup commit'lemek.

### SOPS mü yoksa Vault mı seçmeliyim?

Küçük bir ekipseniz ve zaten GitOps ile çalışıyorsanız SOPS daha az operasyonel yük getirir. Dinamik, kısa ömürlü kimlik bilgilerine ihtiyacınız varsa ya da altyapınız merkezi audit ve rotasyon gerektirecek kadar büyüdüyse Vault ya da bir bulut secret yöneticisi daha uygun.

### Vault kurmak tek başına yeterli mi?

Hayır. Vault'u kurup secret'ları içine taşımak, dinamik secret'ları ve otomatik rotasyonu açmadığınız sürece sadece işletim yükü ekler, güvenlik kazanımı sağlamaz. Asıl değer, statik anahtarları kısa ömürlü, otomatik üretilen kimlik bilgileriyle değiştirdiğinizde ortaya çıkar.

### Küçük bir ekip için en az yetkiyi nasıl uygularım?

Her servise sadece ihtiyacı olan secret'a erişim tanımlayarak başlayın; tek bir "her şeyi görebilen" servis hesabından kaçının. Bulut IAM rollerinde ya da Vault politikalarında path bazlı kısıtlama kullanın ve erişim log'larını düzenli gözden geçirin.
