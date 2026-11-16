---
title: "Kubernetes Pod Security Nasıl Sıkılaştırılır?"
slug: "kubernetes-pod-security-temelleri"
translationKey: "kubernetes-pod-security-admission-2026"
locale: "tr"
excerpt: "Kısa cevap: Pod Security Admission'ı restricted modda namespace etiketiyle açarsın; root'u, yazılabilir dosya sistemini ve fazla capability'leri reddeder."
category: "devops-cloud"
tags: ["kubernetes", "container-security", "devops", "best-practices"]
publishedAt: "2026-11-16"
seoTitle: "Kubernetes Pod Security Admission Rehberi 2026"
seoDescription: "Pod Security Admission'ı namespace etiketiyle nasıl açarsın, restricted profili neyi engeller ve ne zaman Kyverno gerekir — Kasım 2026 kılavuzu."
---

Kısa cevap: Kubernetes'in kendi yerleşik denetleyicisi Pod Security Admission (PSA), bir namespace'e tek bir etiket ekleyerek açılır ve `restricted` modda root olarak çalışan, yazılabilir root dosya sistemi kullanan veya gereksiz Linux capability'leri taşıyan pod'ları admission aşamasında doğrudan reddeder — ayrı bir policy motoru kurmadan.

Çoğu ekip bu adımı atlayıp doğrudan bir service mesh'e veya OPA/Kyverno gibi ağır bir policy motoruna yöneliyor. Oysa Kubernetes 1.25'ten beri cluster'ın içinde zaten duran, hiçbir ek bileşen gerektirmeyen bir temel var; sorun araç eksikliği değil, bu aracın kullanılmaması.

## Pod Security Admission nedir?

Pod Security Admission, Kubernetes'in içine gömülü (in-tree) bir admission controller'dır ve Pod Security Standards'ın üç sabit profilini — `privileged`, `baseline`, `restricted` — namespace düzeyinde zorunlu kılar. 2022'de deprecate edilip Kubernetes 1.25'te tamamen kaldırılan PodSecurityPolicy'nin (PSP) doğrudan yerine geçer; [Kubernetes'in resmi dokümantasyonuna göre](https://kubernetes.io/docs/concepts/security/pod-security-admission/) PSA, Kasım 2026 itibarıyla hâlâ stabil ve varsayılan önerilen temel durumda.

PSP'den farkı, pod'u admission sırasında değiştirememesi (mutating/defaulting yapamaması) ve sadece namespace granülaritesinde çalışmasıdır — tek bir pod veya deployment için özel bir kural yazamazsın, o namespace'teki her şey aynı profile tabi olur.

## Baseline mi restricted mi, aradaki fark ne?

`baseline` profili yalnızca bilinen ayrıcalık yükseltme yollarını engeller (privileged container, host namespace paylaşımı, tehlikeli capability'ler); `restricted` profili ise bunun üstüne çıkıp pod'un güvenlik context'ini pozitif olarak zorlar: root olmayan kullanıcı, tüm capability'lerin düşürülmesi, ayrıcalık yükseltmenin kapatılması ve bir seccomp profili şart koşar. `privileged` profili ise hiçbir kısıtlama uygulamaz; sadece "bu namespace'i tamamen açık bırak" demek içindir.

Pratikte çoğu ekip ikisini birden kullanıyor: sistem namespace'lerinde (`kube-system`, CNI/CSI driver'larının çalıştığı yerler) `privileged`, geçiş dönemindeki eski uygulamalarda `baseline`, yeni yazılan her iş yükünde ise doğrudan `restricted`. Üç profili de aynı namespace'e karıştırmak mümkün değil — bir namespace'in `enforce` modu tek bir profile bağlıdır; farklı hassasiyet seviyeleri gerekiyorsa, iş yüklerini ayrı namespace'lere bölmek gerekir.

| Profil | Ne engeller | Tipik kullanım |
|---|---|---|
| `privileged` | Hiçbir şey | Sistem/ağ bileşenleri (CNI, CSI driver'ları) |
| `baseline` | Privileged container, host namespace, bilinen tehlikeli capability'ler | Geçiş dönemi, eski uygulamalar |
| `restricted` | Root çalıştırma, yazılabilir root FS, fazladan capability, privilege escalation, seccomp eksikliği | Üretimdeki yeni iş yükleri |

## Bir namespace'e nasıl profil uygularsın?

Üç etiket eklersin: `enforce` (reddeder), `audit` (audit log'a yazar, engellemez) ve `warn` (kullanıcıya uyarı gösterir, engellemez). Her biri bağımsız çalışır ve aynı namespace'te farklı seviyelerde kombinlenebilir.

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: payments
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/enforce-version: v1.34
    pod-security.kubernetes.io/warn: restricted
    pod-security.kubernetes.io/audit: restricted
```

Mevcut bir namespace'e tek komutla da uygulayabilirsin:

```bash
kubectl label --overwrite ns payments pod-security.kubernetes.io/enforce=restricted
```

`-version` eki opsiyoneldir ama hangi Kubernetes sürümünün profil tanımına sabitlendiğini belirtir; sabitlemezsen cluster yükseltildiğinde profilin kapsamı sessizce değişebilir.

## Restricted profili tam olarak neyi engeller?

`restricted`, container'ın `runAsNonRoot: true` olmasını, `allowPrivilegeEscalation: false` ayarını, tüm Linux capability'lerinin düşürülüp (`drop: ["ALL"]`) sadece gerekenin eklenmesini, root dosya sisteminin salt okunur (`readOnlyRootFilesystem: true`) olmasını ve `RuntimeDefault` veya özel bir seccomp profilinin tanımlanmasını şart koşar. Bu beş koşuldan biri eksikse pod admission aşamasında reddedilir, çalışmaya başlamadan önce.

Bu, [Kubernetes'te sık yapılan hatalar](/tr/posts/kubernetes-hatalari) yazısında da değindiğimiz "root olarak çalışan container" hatasının kök çözümü; orada tek bir paragrafla geçiyordu, burada namespace etiketinin kendisine odaklanıyoruz. Bu beş kontrolü gerçekten geçen minimal bir pod tanımı şöyle görünür:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: web
  namespace: payments
spec:
  containers:
    - name: web
      image: example/web:1.4.0
      securityContext:
        runAsNonRoot: true
        allowPrivilegeEscalation: false
        readOnlyRootFilesystem: true
        capabilities:
          drop: ["ALL"]
        seccompProfile:
          type: RuntimeDefault
```

Bu beş alandan biri eksik kalırsa `payments` namespace'indeki `restricted` zorlaması pod'u doğrudan reddeder; admission hatası da hangi alanın eksik olduğunu adıyla belirtir.

## PodSecurityPolicy'den PSA'ya nasıl geçiş yaparsın?

1.25 öncesi PodSecurityPolicy üzerine kurulu manifestler taşıyan bir cluster'da, PSP'yi kapatıp aynı gün PSA'yı açmak düz bir takas değildir — PSA, PSP'nin her özelliğini karşılamadığı için bu, ekipleri ya kırık iş yükleriyle ya da sessizce zayıflamış bir güvenlik duruşuyla baş başa bırakır. Kubernetes projesinin kendi geçiş kılavuzu, önce mevcut her PSP'nin kurallarını en yakın PSS profiline eşlemeyi, bu profili tüm namespace'lerde `audit`/`warn` modunda uygulamayı ve audit log'ları temiz göründükten sonra PSP nesnelerini kaldırmayı öneriyor. Bazı PSP'lerin izin verdiği ince taneli host path listeleri veya pod başına mutation gibi özelliklerin PSA'da hiç karşılığı yok; tam da bu noktalarda her şeyi üç sabit PSA profiline sıkıştırmaya çalışmak yerine Kyverno gibi bir policy motoruna yönelmek gerekiyor.

## Enforce etmeden önce nasıl denetlersin?

Doğrudan `enforce` ile başlamak üretimde iş yükünü anında kırabilir; önce `audit` ve `warn` modlarıyla hangi pod'ların uyumsuz olduğunu görmek gerekir. `kubectl` ile hangi pod'ların mevcut haliyle `restricted` profiline uymadığını simüle edebilirsin:

```bash
kubectl label --dry-run=server --overwrite ns payments \
  pod-security.kubernetes.io/enforce=restricted
```

Sunucu tarafı dry-run, etiketi gerçekten uygulamadan önce hangi pod'ların admission hatası alacağını döndürür. Bu çıktıyı görmeden doğrudan `enforce`'a geçmek, bir Cuma akşamı production'da kendi ayağına sıkmanın en garanti yoludur.

## PSA nerede yetersiz kalır, OPA/Kyverno ne zaman gerekir?

PSA'nın üç sabit profili dışında özel bir kural yazamazsın — mesela "sadece belirli bir registry'den image çekilebilir" veya "her pod'da belirli bir label zorunlu olsun" gibi iş kuralları PSA'nın kapsamı dışında. PSA ayrıca pod'u değiştiremez (mutating webhook değildir), sadece kabul eder veya reddeder. Bu noktada [OPA mı Kyverno mu](/tr/posts/kod-olarak-politika-opa-kyverno) yazısında ele aldığımız gerçek bir policy motoruna geçmek gerekiyor; ama çoğu ekip bu noktaya PSA'yı hiç açmadan atlıyor.

Benim gözlemim şu: PSA'yı namespace etiketiyle açmak beş dakika sürer ve sıfır ek bileşen gerektirir; buna karşın bir service mesh kurup Kyverno policy'leri yazmaya başlamadan önce "restricted zaten şunu engelliyor mu?" diye sormayan ekip sayısı hâlâ fazla. `restricted` varsayılan olsaydı, bugün yazılan Kyverno policy'lerinin yarısına ihtiyaç kalmazdı.

PSA'yı RBAC'la birlikte düşünmek de faydalı — [Kubernetes RBAC'ta en az yetki](/tr/posts/kubernetes-rbac-en-az-yetki) ilkesi kimin neyi yapabileceğini sınırlarken, PSA pod'ların ne yapabileceğini sınırlar; ikisi birbirinin yerini tutmaz, ikisi de aynı anda açık olmalı. Bir denetim (audit) sırasında "neden bu pod root'suz çalışıyor?" sorusuna "çünkü namespace etiketi onu zorunlu kılıyor" cevabını verebilmek, aynı kuralı on farklı deployment manifestine tek tek yazmaktan hem daha az hataya açık hem de kanıtlaması çok daha kolay. Daha fazla DevOps & Bulut içeriği için [kategori sayfasına](/tr/category/devops-bulut) göz atabilirsin.

## Sıkça Sorulan Sorular

### Pod Security Admission ile PodSecurityPolicy arasındaki fark nedir?

PodSecurityPolicy (PSP), 2021'de deprecate edilip Kubernetes 1.25'te tamamen kaldırıldı; artık hiçbir cluster'da çalışmaz. Pod Security Admission onun yerleşik yerine geçti, ama PSP'nin aksine pod'u değiştiremez ve kuralları sadece üç sabit profille (privileged, baseline, restricted) namespace düzeyinde uygular.

### Restricted profilini doğrudan production'a uygulamak güvenli mi?

Hayır, önce `audit` ve `warn` modlarıyla hangi pod'ların uyumsuz olduğunu görmeden `enforce` uygulamak mevcut iş yüklerini anında kırabilir. Server-side dry-run veya önce audit/warn ile test edip uyumsuzlukları düzelttikten sonra enforce'a geçmek doğru sıralama.

### PSA'nın restricted profili hangi beş kuralı zorunlu kılar?

Root olmayan kullanıcı (`runAsNonRoot: true`), ayrıcalık yükseltmenin kapalı olması (`allowPrivilegeEscalation: false`), tüm Linux capability'lerinin düşürülmesi, salt okunur root dosya sistemi ve bir seccomp profilinin tanımlı olması. Bu beşinden biri eksikse pod admission aşamasında reddedilir.

### Ne zaman PSA yeterli değil, OPA veya Kyverno gerekir?

PSA'nın üç sabit profilinin dışına çıkan özel iş kuralları (belirli bir registry zorunluluğu, zorunlu label'lar, pod'u değiştiren mutating webhook'lar) gerektiğinde PSA yetersiz kalır. Bu durumda OPA Gatekeeper veya Kyverno gibi genel amaçlı bir policy motoruna geçmek gerekir.

**Kaynaklar:** [Kubernetes — Pod Security Admission](https://kubernetes.io/docs/concepts/security/pod-security-admission/), [Kubernetes — Namespace Etiketleriyle Pod Security Standards Uygulama](https://kubernetes.io/docs/tasks/configure-pod-container/enforce-standards-namespace-labels/).
