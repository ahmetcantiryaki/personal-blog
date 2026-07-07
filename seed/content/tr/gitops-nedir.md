---
title: "GitOps Nedir: Prensipler ve Araçlar"
slug: "gitops-nedir"
translationKey: "gitops-explained"
locale: "tr"
excerpt: "GitOps nedir? Dört OpenGitOps prensibi, reconciliation döngüsü ve 2026 araçları Argo CD 3.4 ile Flux 2.8; gerçek komutlar ve ödünleşmelerle detaylı bir bakış."
category: "devops-cloud"
tags: ["gitops", "ci-cd", "kubernetes", "devops"]
publishedAt: "2026-07-07"
seoTitle: "GitOps Nedir: Prensipler ve Araçlar (2026)"
seoDescription: "GitOps nedir? Dört prensibi, reconciliation döngüsü ve Argo CD 3.4 ile Flux 2.8 gibi 2026 araçları; gerçek komutlar, sürümler ve ödünleşmelerle detaylı bir bakış."
---

Mart 2026'da bir Salı gecesi saat 02.14. Nöbetçi mühendis üretim cluster'ına SSH ile bağlanıp trafik dalgasını atlatmak için `kubectl scale deployment/checkout --replicas=10` çalıştırdı. İşe yaradı. Doksan saniye sonra replika sayısı 3'e geri döndü, site çöktü ve pager yeniden çığlık attı. Sorun bir bug değildi. GitOps tam da işini yapıyordu: cluster'ın istenen durumu `replicas: 3` diyordu, kimse değişikliği Git'e commit'lememişti, controller da sessizce geri aldı.

Bu hikâye, GitOps'un tüm mantığını tek bir olayda özetliyor. Şimdi GitOps'un ne olduğunu, onu tanımlayan prensipleri, reconciliation döngüsünün nasıl işlediğini ve 2026'da gerçekten elinizin gideceği araçları açalım.

## GitOps tam olarak nedir?

GitOps, Git'in altyapınız ve uygulamalarınız için tek doğruluk kaynağı olduğu ve otomatik bir ajanın çalışan sistemi commit edilene sürekli olarak yaklaştırdığı bir operasyon modelidir. İstenen durumu bildirimsel (declarative) tanımlar, bir repo'ya push'larsınız; bir controller da gerçekliği ona yakınsatır. Laptop'tan `kubectl apply` yok, elle drift yok.

Terim çok gevşek kullanılıyor, o yüzden keskin hali şu: GitOps sadece "Git ile CI/CD" ya da "pipeline'da Terraform" değildir. Git deposu otoriterdir. Her değişiklik bir commit, her deploy bir merge, her geri alma da bir `git revert`'tür. Gözlemlenebilirlik, drift'i işaretleyerek döngüyü kapatır.

Model 2017'de Weaveworks tarafından adlandırıldı, sonra CNCF çatısındaki [**OpenGitOps**](https://opengitops.dev/) projesiyle resmileşti; v1.0.0 spesifikasyonu onu dört prensibe indirgedi. Adlandırmanın amacı, her ekibin öne sürdüğü belirsiz "Git kullanıyoruz" iddiasından gerçek, denetlenebilir bir deseni ayırmaktı.

Aklınızda tutmanız gereken kavram niyet: sisteme asla *nasıl* değişeceğini söylemez, yalnızca son durumun *ne* olması gerektiğini bildirirsiniz. Nasılını ajan çözer.

## GitOps'un dört prensibi nedir?

OpenGitOps, bir sistemin gerçekten GitOps sayılabilmesi için karşılaması gereken dört prensip tanımlar. Bunlardan biri eksikse, komşu bir şeye sahipsinizdir ama gerçeğine değil.

1. **Bildirimsel (declarative).** Tüm sistem bildirimsel tanımlanır. Adımları scriptlemek yerine istenen sonucu belirtirsiniz (üç replika, şu image tag'i, şu config).
2. **Sürümlenmiş ve değişmez.** İstenen durum Git'te saklanır; bu size değişmez, sürümlü bir geçmiş ve eksiksiz bir denetim izi verir. Her durum, inceleyebileceğiniz veya geri dönebileceğiniz bir commit'tir.
3. **Otomatik çekilen.** Yazılım ajanları istenen durumu kaynaktan otomatik çeker. Kimse dışarıdan cluster'a kimlik bilgisi push'lamaz; ajan içeriden dışarı uzanır.
4. **Sürekli uzlaştırılan.** Ajanlar gerçek durumu sürekli gözlemler ve onu istenen duruma yakınsatır. Drift, bir insan komut çalıştırmadan tespit edilip düzeltilir.

İnsanların takıldığı yer o üçüncü prensip. Merge'de `kubectl apply` çalıştıran push tabanlı bir pipeline, 1 ve 2'yi karşılar ama 3 ve 4'ü karşılamaz. Gerçek GitOps kontrolü tersine çevirir: cluster Git'i izler, tersi değil. Saat 02.14'teki olayımız mı? Dördüncü prensip, tasarlandığı gibi çalışıyordu.

## GitOps reconciliation döngüsü nasıl çalışır?

Reconciliation döngüsü, Git'teki istenen durumu cluster'daki canlı durumla sürekli karşılaştırıp aradaki farkı kapatan değişiklikleri uygular. Cluster içindeki bir controller repo'yu poll eder ya da abone olur, bir diff hesaplar ve ikisini yakınsatır. GitOps'u kendi kendini iyileştiren yapan motor budur.

Döngü, somut adımlarla:

1. Bir geliştirici bir manifest'i değiştiren pull request açar (diyelim bir image tag'ini yükseltir).
2. İnceleyenler onaylar ve ortam branch'ine veya path'ine merge eder.
3. GitOps controller'ı (Argo CD ya da Flux) sync aralığı içinde yeni commit'i fark eder.
4. İstenen durumu, çoğu zaman Kustomize veya Helm üzerinden render eder.
5. İstenen durumu Kubernetes API'si üzerinden cluster'ın gerçek durumuyla diff'ler.
6. Farkı uygular; kaynakları oluşturur veya günceller.
7. Sağlık ve sync durumunu geri raporlar; uygulamayı Synced ya da OutOfSync olarak işaretler.
8. Biri cluster'ı elle düzenlerse, sonraki döngü drift'i tespit eder ve Git'e uyacak şekilde geri alır.

Geri alma da işte Git'in geriye sarmasından ibarettir:

```bash
# Prod'da bir şey bozuldu. Sorunlu merge'i geri al...
git revert 9f3c1a2 && git push origin main
# ...controller uzlaştırsın, ya da hemen zorla:
argocd app sync checkout --prune
```

Reconciliation hiç durmadığı için, kanal dışı bir `kubectl edit` otomatik olarak geri alınır. Cluster'ınız incelenmiş ve commit edilmiş olandan sessizce sapamaz.

## 2026'da hangi GitOps araçlarını kullanmalısınız?

CNCF'te mezun olmuş iki araç sahneye hakim: **Argo CD** ve **Flux**. İkisi de dört prensibi iyi uygular; yüzey alanı ve felsefe olarak ayrışırlar. Argo CD zengin bir web arayüzü ve uygulama merkezli bir model sunar; Flux ise Kubernetes'e ve ölçekte otomasyona doğal gelen, birbirine geçen controller'lardan oluşan bir araç setidir.

Temmuz 2026 itibarıyla güncel durum:

| Etmen | Argo CD | Flux |
|-------|---------|------|
| Güncel kararlı sürüm | 3.4.4 (4 Tem 2026) | 2.8.8 (20 May 2026) |
| CNCF durumu | Mezun | Mezun |
| Ana arayüz | Web UI + CLI | CLI + CRD |
| Model | Uygulama merkezli | Controller araç seti |
| Çok kiracılılık | Projeler, ince taneli RBAC, SSO | Namespace + RBAC |
| Helm desteği | Helm 3, birinci sınıf | Helm v4 doğal (2.8 GA) |
| Son sürümde dikkat çeken | Alt kaynak RBAC, mTLS + commit imzalama (3.5 RC) | Doğal Helm v4, daha hızlı reconcile |
| En uygun | Görünürlük isteyen ekipler | Pipeline otomatikleştiren platform ekipleri |

İkisini de üretimde çalıştırmaktan birkaç dürüst not:

- **Argo CD**, insanların durumu *görmesi* gerektiğinde kazanır. Diff'i ve OutOfSync rozetini gösteren arayüz gerçek debug zamanı kazandırır; app-of-apps deseni de çok sayıda ekibe ölçeklenir. 3.0 sıçraması varsayılanları sıkılaştırdı: ince taneli politikalar artık alt kaynaklara sızmıyor, pod-log RBAC de varsayılan açık. [3.5 sürüm adayı](https://github.com/argoproj/argo-cd/releases) (Haziran 2026) tedarik zinciri sertleştirmesi için içsel mTLS ve Git commit imza doğrulaması ekliyor.
- **Flux**, GitOps'u Lego parçaları gibi istediğinizde kazanır: image-automation controller'ı tag'leri sizin yerinize yükseltebilir; source ve kustomize controller'ları daha büyük bir platforma temiz şekilde geçer. [Flux 2.8](https://fluxcd.io/blog/2026/02/flux-v2.8.0/) (GA Şubat 2026) doğal Helm v4 desteği getirdi, böylece Helm 3 hattına takılıp kalmıyorsunuz.
- İkisini aynı namespace'lere karşı çalıştırmayın. Aynı kaynaklar için kapışan iki reconciler, cidden kötü bir öğleden sonra demektir.

Bulut altyapısı sağlamak için (sadece Kubernetes iş yükleri değil) her iki aracı **Crossplane** ile eşleştirin ya da Terraform'u bir controller üzerinden sürün; böylece altyapı da reconciliation döngüsünün ardında yaşar. IaC katmanınızı hâlâ seçiyorsanız [Terraform mu Pulumi mi karşılaştırmamız](/tr/posts/terraform-mu-pulumi-mi) o kararı ele alıyor.

## GitOps'un faydaları ve ödünleşmeleri nedir?

Faydalar denetlenebilirlik, kurtarma ve tutarlılıkta yoğunlaşır. Her değişiklik bir commit olduğu için bedava bir denetim kaydı, tek komutluk geri alma ve taze bir cluster'ı aynı repo'ya yönlendirmeye indirgenen bir felaket kurtarma elde edersiniz. Ama GitOps bedava değildir; aksini iddia etmek ekipleri ondan sekmeye hazırlar.

**Kazandıklarınız:**

- **Denetlenebilirlik.** Git geçmişi *tam da* değişiklik kaydınızdır. Kim neyi ne zaman ve neden değiştirdi, inceleme de dahil.
- **Hızlı geri alma.** `git revert` artı bir sync, sizi saniyeler içinde bilinen iyi bir duruma döndürür.
- **Drift düzeltme.** Cluster kendini Git'e doğru iyileştirir; config drift'i biter.
- **Tutarlı ortamlar.** Aynı repo deseni dev, staging ve prod'u yeniden üretir.

**Bedeli:**

- **Secret'lar zahmetli.** Düz metin secret commit'leyemezsiniz; ilk günden Sealed Secrets, SOPS ya da bir external secrets operatörü bağlamanız gerekir.
- **Öğrenme eğrisi.** Pull modeli ve reconciliation anlamı, imperatif pipeline'lara alışmış ekipler için gerçek bir zihinsel değişimdir.
- **Repo dağınıklığı.** Ortamlar, uygulamalar ve config'in bölündüğü repo'lar bilinçli bir yapı ister; yoksa YAML'da boğulursunuz.

İşte iddialı görüşüm: GitOps, birden fazla ortamınız ve cluster erişimi olan birden fazla kişiniz olduğu an değerini kanıtlar. O eşiğin altında secret yönetimi yükü faydayı gölgeleyebilir. 40 servisli bir platformu bir çeyrekte Argo CD'ye taşıdık. Geri almalar 20 dakikalık gergin bir telaştan revert edilmiş bir commit'e indi; açıklanamayan "prod'u kim değiştirdi?" olayları fiilen durdu. Bedeli, ona güvenmeden önce secret yönetimini SOPS ile doğru kurmak için harcanan iki haftaydı.

Bunu besleyen teslim hattını kuruyorsanız [CI/CD pipeline nasıl kurulur](/tr/posts/cicd-pipeline-nasil-kurulur) rehberimizi okuyun; üretime çıkmadan önce de [kaçınmanız gereken Kubernetes hatalarıyla](/tr/posts/kubernetes-hatalari) eşleştirin. Operasyonel taraf için [log, metrik ve trace üzerine gözlemlenebilirlik yazımız](/tr/posts/observability-nedir) geri bildirim döngüsünü kapatmayı anlatıyor; [platform engineering](/tr/posts/platform-engineering-nedir) yazısı da GitOps'un daha büyük bir iç platformda nereye oturduğunu gösteriyor.

## Sıkça Sorulan Sorular

### GitOps yalnızca Kubernetes için mi?

Hayır, ama en parladığı yer Kubernetes. GitOps, bildirimsel bir sistem ve durumu uzlaştırabilen bir ajan ister; Kubernetes ikisini de doğal sunar. Aynı modeli Terraform ile yönetilen bulut altyapısına veya başka bildirimsel platformlara uygulayabilirsiniz, ama olgun araçlar (Argo CD, Flux) Kubernetes-doğal olduğundan 2026'da yerleşik yol budur.

### GitOps ile DevOps arasındaki fark nedir?

DevOps, geliştirme ile operasyon arasında paylaşılan sahipliğin kültürüdür. GitOps ise Git'i doğruluk kaynağı olarak kullanan, otomatik reconciliation'lı, sürekli teslimatı hayata geçiren belirli bir operasyon desenidir. GitOps, DevOps'u pratiğe dökmenin somut bir yoludur; DevOps ise GitOps'un hizmet ettiği daha geniş felsefedir.

### GitOps secret'ları nasıl yönetir?

Düz metin secret'ı asla commit'lemeyin. Git'te şifreli değer saklamak için Sealed Secrets ya da SOPS gibi bir şifreleme katmanı, veya reconcile anında bir vault'tan (HashiCorp Vault, AWS Secrets Manager) çeken bir External Secrets Operator kullanın. Ajan uygulama anında çözer ya da getirir; böylece Git yalnızca şifreli metin veya referans tutar.

### GitOps, CI/CD ile aynı şey mi?

Tam değil. CI/CD, yazılımı build eden, test eden ve teslim eden daha geniş hattır. GitOps ise bu hattın CD yarısını pull tabanlı bir reconciliation döngüsüyle çalıştırmanın bir yoludur. 2026'da yaygın kurulum: CI image'ı build edip test eder, sonra config repo'suna yeni bir tag commit'ler, GitOps ajanı da asıl deploy'u üstlenir.
