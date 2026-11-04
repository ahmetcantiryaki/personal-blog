---
title: "Altyapı Kayması (Drift) Nasıl Tespit Edilir?"
slug: "altyapi-kaymasi-drift-nasil-tespit-edilir"
translationKey: "infrastructure-drift-detection-2026"
locale: "tr"
excerpt: "Kısa cevap: Terraform/OpenTofu'da zamanlanmış `plan -detailed-exitcode`, Kubernetes'te ArgoCD self-heal'i drift'i yakalar; GitOps'un kendisi tespit değildir."
category: "devops-cloud"
tags: ["terraform", "infrastructure-as-code", "gitops", "kubernetes", "monitoring"]
publishedAt: "2026-11-04"
seoTitle: "Altyapı Drift Tespiti Nasıl Yapılır? Terraform, GitOps"
seoDescription: "Altyapı kayması (drift) nedir, nasıl oluşur, nasıl tespit edilir? Terraform/OpenTofu zamanlanmış plan, ArgoCD self-heal ve Flux reconciliation karşılaştırması."
---

Kısa cevap: Terraform veya OpenTofu'da drift'i yakalamanın standart yolu, zamanlanmış bir `plan -detailed-exitcode` çalıştırmaktır — çıkış kodu 2 geldiğinde konsolda veya otomasyonla yapılmış bir değişiklik var demektir. Kubernetes'te ise bu işi GitOps'un kendisi değil, ArgoCD'nin `selfHeal` ayarı veya Flux'un periyodik reconciliation'ı üstlenir; ikisi de farklı garantiler verir.

## Altyapı kayması (drift) nedir?

Drift, bir altyapı kaynağının gerçek durumunun, kod deposundaki (Terraform, OpenTofu, Kubernetes manifest) tanımından sapmasıdır. En sık üç kaynaktan gelir: birinin AWS konsolundan elle bir güvenlik grubu kuralı değiştirmesi, bir autoscaler'ın instance sayısını kodda yazılı değerin dışına çıkarması veya bir insident sırasında yapılan "hotfix"in koda geri yansıtılmaması.

Drift tehlikeli olan şey değildir; fark edilmeyen drift tehlikelidir. Bir sonraki `terraform apply` çalıştığında, kimsenin beklemediği bir kaynak siliniyor veya yeniden oluşturuluyor çünkü IaC aracı "gerçek" durumu kendi state dosyasındaki değer sanıyor.

## Neden sadece CI'daki plan yetmiyor?

CI'daki `terraform plan`, yalnızca bir pull request açıldığında veya merge olduğunda çalışır — aradaki günlerde, haftalarda oluşan drift'i görmez. Bir güvenlik ekibi salı günü elle bir IAM politikası değiştirip perşembe günkü bir PR'a kadar hiçbir uyarı almayabilir.

Bunun pratik sonucu şu: drift tespiti, kod değişikliği olaylarına bağlı değil, zamana bağlı bir iş olmalı. [Terramate'in GitHub Actions drift-check dokümantasyonu](https://terramate.io/docs/cli/automation/github-actions/drift-check-workflow), stack'ler üzerinde günlük saat 02:00'de çalışan bir cron job örneği veriyor; bu, PR akışından tamamen ayrı bir mekanizma.

## Sürekli drift tespiti nasıl kurulur?

Sürekli drift tespiti, zamanlanmış bir `plan -detailed-exitcode` komutunu CI/CD'ye bağlayıp çıkış koduna göre alarm üretmektir. Terraform ve OpenTofu'da bu komut üç çıkış kodundan birini döner: `0` değişiklik yok, `1` hata, `2` drift tespit edildi — betikler yalnızca `2` koduna göre alarm tetiklemeli, sıfırdan farklı her koda değil.

Pratikte kurulum şöyle görünür:

```bash
set +e
tofu plan -refresh-only -detailed-exitcode -no-color -lock=false
exit_code=$?
set -e

if [ "$exit_code" -eq 2 ]; then
  echo "Drift tespit edildi, alarm gönderiliyor"
  # Slack/PagerDuty webhook çağrısı buraya
elif [ "$exit_code" -eq 1 ]; then
  echo "Plan hatası" && exit 1
fi
```

`-refresh-only` bayrağı önemli: bu, state dosyasını gerçek bulut durumuna göre güncelleyip yalnızca fark raporlar, kod değişikliklerini drift olarak yanlış raporlamaz. [Scalr'ın drift yönetimi rehberi](https://scalr.com/learning-center/drift-management-part-2/), `plan` komutunun zaten her kaynak için sağlayıcıya sorup gerçek durumu çektiğini, `refresh-only` apply'ın ise state'i bu gerçek duruma göre güncellediğini belirtiyor. Çalışma sıklığı için tipik aralık 6 saatten güne kadar değişiyor; çok sık çalıştırmak API rate limit'lerine çarpabiliyor, çok seyrek çalıştırmak ise tespit süresini uzatıyor.

## Drift tespit edildiğinde otomatik apply yapılmalı mı?

Hayır — tespit edilen drift'i otomatik olarak apply etmek, insanın kasıtlı yaptığı bir değişikliği (örneğin bir incident sırasındaki acil müdahaleyi) sessizce geri alabilir. Doğru akış, drift raporunu bir insana veya onay adımına yönlendirip, apply'ı elle tetiklemektir.

Bunun istisnası, drift'in kaynağının bilinen ve güvenilir bir otomasyon olduğu durumlar — örneğin bir autoscaler'ın instance sayısını değiştirmesi. Bu tür "beklenen drift" için IaC tanımında `ignore_changes` gibi bir mekanizmayla o alanı state karşılaştırmasından hariç tutmak, sahte alarmları önler.

## Driftctl benzeri araçlar ve bulut config kuralları ne işe yarar?

Bu araçlar, Terraform state dosyanızda hiç tanımlı olmayan kaynakları ("unmanaged" veya "ghost" kaynaklar) yakalamak için var — `terraform plan` sadece state'teki kaynaklara bakar, state dışında elle açılmış bir S3 bucket'ı veya güvenlik grubunu hiç görmez. driftctl projesi 2022'de resmi olarak arşivlendi, ama aynı boşluğu dolduran ticari araçlar (Env0, Firefly, Spacelift'in drift modülleri) ve bulut sağlayıcı yerel araçları bu işi sürdürüyor.

AWS Config kuralları, benzer bir işi bulut tarafında yapar: belirli bir kaynağın (örneğin bir güvenlik grubunun) uyumluluk durumunu sürekli izler ve beklenen konfigürasyondan saptığında otomatik bir uyumluluk olayı üretir. Bunun Terraform/OpenTofu tabanlı plan kontrolünden farkı şu: AWS Config, kodun ne dediğini bilmez, yalnızca önceden tanımladığınız bir kural kümesine (örneğin "hiçbir güvenlik grubu 0.0.0.0/0'dan SSH'a açık olmasın") karşı kontrol eder. İki yaklaşım birbirini tamamlıyor; biri "koddan sapma" diğeri "politikadan sapma" yakalıyor.

Küçük bir ekip için pratik sıralama şöyle: önce zamanlanmış `plan -detailed-exitcode` ile koddan sapmayı yakalayın, sonra kritik güvenlik kurallarını (açık portlar, public bucket'lar) bulut sağlayıcının yerel politika motoruyla (AWS Config, Azure Policy, GCP Organization Policy) ayrıca izleyin. İkisini aynı anda kurmaya çalışmak, genelde hiçbirini düzgün kurmamakla sonuçlanıyor. Bu disiplini kuran ekipler genelde aynı zamanda [her PR için önizleme veritabanı](/tr/posts/her-pr-icin-onizleme-veritabani) gibi dallanan altyapı pratiklerine de yöneliyor — ikisi de "geçici durumun kalıcı state'i bozmaması" ilkesine dayanıyor.

## Kubernetes'te GitOps drift'i nasıl ele alıyor?

GitOps controller'ları (ArgoCD, Flux) drift'i otomatik düzeltebilir ama bu, ayrı bir "tespit" aşaması değil; reconciliation döngüsünün bir yan etkisidir. ArgoCD varsayılan olarak uygulamayı yalnızca "OutOfSync" olarak işaretler; drift'i gerçekten otomatik düzeltmesi için `syncPolicy.automated.selfHeal: true` ayarının açık olması gerekir.

Aşağıdaki tablo iki aracın varsayılan davranışını karşılaştırıyor:

| Özellik | ArgoCD | Flux |
|---|---|---|
| Tespit mekanizması | Kubernetes API watch + cluster cache | Periyodik reconciliation (varsayılan `interval` alanı) |
| Varsayılan reconciliation aralığı | ~180 sn (jitter ile) | Genellikle 5-10 dk arası yapılandırılır |
| Otomatik düzeltme | `syncPolicy.automated.selfHeal: true` ile opsiyonel | Reconciliation'ın doğal parçası, ayrı bir "yalnızca tespit" modu yok |
| Kontrolör alanlarını hariç tutma | `ignoreDifferences` | Manifestten o alanı çıkarmak veya patch mekanizması |

Pratik sonucu şu: Flux'ta bir mühendis `kubectl edit` ile canlı bir kaynağı değiştirirse, bu değişiklik bir sonraki reconciliation aralığında (örneğin 10 dakika içinde) geri alınır — kalıcı bir "düzeltme" değil, geçici bir pencere. ArgoCD'de ise `selfHeal` kapalıysa değişiklik sadece "OutOfSync" olarak görünür ve kimse bakmazsa süresiz kalır.

## Alarm ve sahiplik modeli nasıl kurulur?

Drift alarmının sahibi olmayan bir sistem, zamanla kimsenin okumadığı bir Slack kanalına dönüşür. Her drift uyarısının net bir sahibi (genelde kaynağı tanımlayan ekip) ve bir SLA'sı (örneğin "kritik ortamda 4 saat içinde triyaj") olmalı; aksi halde "bilinen drift" listesi büyüyüp gerçek sinyali gömer.

Üç katmanlı bir model işe yarıyor: (1) üretim/kritik ortamlarda drift tespit edildiğinde otomatik PagerDuty/Slack alarmı ve zorunlu triyaj, (2) hazırlık/test ortamlarında haftalık özet rapor, (3) sık drift üreten kaynaklar için (örneğin elle müdahale gerektiren bir legacy sistem) `ignore_changes` ile bilinçli olarak kapsam dışı bırakma. Bu üçlü ayrım, [CI/CD'ye bağlı ajan otomasyonlarını güvenle kurmaya](/tr/posts/ai-ajanlari-cicd-guvenle-baglamak) benzer bir mantık izliyor: otomasyonun gücünü, insanın onayladığı sınırlar içinde tutmak.

Görüşüm şu: GitOps'un "self-healing" vaadi genellikle drift tespitiyle karıştırılıyor, ama ikisi aynı şey değil — bir controller'ın drift'i sessizce düzeltmesi, o drift'in neden oluştuğunu hiç sormaz. Bir ekip neden sürekli manuel değişiklik yapıyorsa (yetersiz self-servis, acil durum prosedürü eksikliği), self-heal o kök nedeni gizler, çözmez. Patlama yarıçapını küçültmek isteyen ekipler için [hücre tabanlı mimari](/tr/posts/hucre-tabanli-mimari-patlama-yaricapi) de benzer bir mantıkla, drift'in etkisini tek bir hücreyle sınırlıyor. Konuyu [DevOps & Bulut](/tr/category/devops-bulut) kategorisindeki diğer yazılarla takip edebilirsiniz.

## Sıkça Sorulan Sorular

### Terraform'da drift nasıl tespit edilir?

Zamanlanmış bir `terraform plan -refresh-only -detailed-exitcode` komutu çalıştırıp çıkış kodunu kontrol edin: `2` drift olduğunu, `0` değişiklik olmadığını, `1` hata olduğunu gösterir. Bu komutu günlük veya her 6 saatte bir CI'da çalıştırmak, PR akışının dışında sürekli bir kontrol sağlar.

### ArgoCD drift'i otomatik düzeltir mi?

Hayır, varsayılan olarak değil. ArgoCD drift'i yalnızca "OutOfSync" durumuyla işaretler; otomatik düzeltme için `syncPolicy.automated.selfHeal: true` ayarının açıkça etkinleştirilmesi gerekir, bu da genelde 5 saniyelik bir tespit süresinin ardından devreye girer.

### GitOps drift tespiti yerine geçer mi?

Hayır. GitOps controller'ları (ArgoCD, Flux) reconciliation döngüsü sırasında drift'i düzeltebilir ama bu, Terraform/OpenTofu dünyasındaki zamanlanmış plan kontrolüyle aynı garantiyi vermez; Flux'ta drift, bir sonraki reconciliation aralığına (tipik olarak 5-10 dakika) kadar fark edilmeyebilir.

### Drift tespit edildiğinde otomatik apply yapmak güvenli mi?

Genelde değil. Otomatik apply, bir insanın kasıtlı yaptığı acil bir değişikliği sessizce geri alabilir. Daha güvenli yaklaşım, drift raporunu bir onay adımına yönlendirmek ve apply'ı elle tetiklemek; yalnızca bilinen ve güvenilir otomasyonlar (autoscaler gibi) için `ignore_changes` ile kapsam dışı bırakma yapmaktır.
