---
title: "Kod Olarak Politika: Kubernetes'te OPA mı Kyverno mu?"
slug: "kod-olarak-politika-opa-kyverno"
translationKey: "policy-as-code-opa-kyverno-2026"
locale: "tr"
excerpt: "Kısa cevap: Çoğu ekip için Kyverno kazanıyor; YAML ile yazılır, mutation ve generation'ı yapar. Karmaşık mantıkta OPA/Gatekeeper'ın Rego'su tercih edilir."
category: "devops-cloud"
tags: ["kubernetes", "devops", "gitops", "infrastructure-as-code"]
publishedAt: "2026-10-07"
seoTitle: "OPA Gatekeeper mı Kyverno mu? 2026 Karşılaştırması"
seoDescription: "Kubernetes admission control için OPA Gatekeeper ile Kyverno'yu karşılaştırıyoruz: öğrenme eğrisi, yetenekler, 2026 CNCF durumu ve karar matrisi."
---

Kısa cevap: Küçük ve orta ölçekli ekiplerin çoğu için Kyverno kazanıyor — policy'leri sade YAML ile yazılıyor ve doğrulamanın yanında mutation ile resource generation'ı da yapıyor. OPA/Gatekeeper'ı seçmek için haklı bir sebep var: Rego gerektirecek kadar karmaşık mantığınız varsa, ya da Kubernetes dışında başka sistemlerde de aynı policy diliyle çalışmak istiyorsanız.

## Kod Olarak Politika (Policy as Code) Neyi Çözüyor?

Policy as code, altyapı değişikliklerinin manuel incelemeden geçmek yerine makine tarafından otomatik denetlendiği bir yaklaşım. Bir Kubernetes kümesine giden her `kubectl apply` ya da CI/CD pipeline'ı, cluster'a ulaşmadan önce önceden tanımlanmış kurallara (örneğin "her container bir resource limit tanımlamalı" ya da "latest tag kullanılamaz") karşı kontrol ediliyor. AI ajanlarının artık kendi başına PR açıp altyapı dosyalarını değiştirdiği bir dönemde bu kontrol katmanı daha da kritik hale geliyor: insan incelemesi devreden çıktığında, güvenlik ağının makine tarafında olması gerekiyor.

## OPA/Gatekeeper ile Kyverno Arasındaki Temel Fark Ne?

Temel fark, policy'leri hangi dille yazdığınız. Kyverno, policy'leri sıradan Kubernetes kaynakları olarak YAML ile tanımlıyor — bir Kubernetes mühendisinin zaten bildiği söz dizimi. OPA/Gatekeeper ise genel amaçlı bir policy dili olan Rego'yu kullanıyor; Rego, Kubernetes'e özgü değil, bu yüzden aynı policy mantığını Kubernetes dışındaki sistemlerde (API gateway, CI pipeline, Terraform planı) de çalıştırabiliyorsunuz.

Bu fark doğrudan öğrenme eğrisine yansıyor: bir YAML bilen mühendis Kyverno policy'sini genelde ilk denemede okuyup anlayabiliyor; Rego ise ayrı bir dil olduğu için ekip içinde ayrı bir öğrenme yatırımı gerektiriyor.

## Hangi Araç Hangi Yetenekleri Sunuyor?

Kyverno üç şeyi yapıyor: validation (reddet/kabul et), mutation (gelen kaynağı değiştir) ve generation (yeni kaynak otomatik oluştur). Örneğin her yeni namespace açıldığında otomatik bir NetworkPolicy oluşturmak, Kyverno'da yerleşik bir yetenek. OPA/Gatekeeper ise esas olarak validation'a odaklanıyor; mutation desteği var ama Kyverno'nunki kadar merkezi değil.

| Kriter | Kyverno | OPA/Gatekeeper |
| --- | --- | --- |
| Policy dili | YAML (Kubernetes-native) | Rego |
| Öğrenme eğrisi | Düşük, Kubernetes mühendisi için tanıdık | Yüksek, ayrı dil öğrenimi gerekir |
| Validation | Var | Var |
| Mutation | Yerleşik, merkezi özellik | Destekleniyor, daha sınırlı |
| Generation (otomatik kaynak oluşturma) | Yerleşik | Yok / dolaylı |
| Kapsam | Kubernetes-özel | Genel amaçlı (K8s + diğer sistemler) |
| CNCF durumu (2026) | Top-level proje (Mart 2026'da terfi etti) | CNCF graduated proje |

## Policy'leri Nasıl Yazıp Test Edersiniz?

Her iki araçta da policy'ler normal kod gibi versiyon kontrolüne girip birim testlerden geçebiliyor. Kyverno'da bir policy, `kubectl` ile uygulanabilen sıradan bir YAML manifesti olduğu için, test süreci genelde mevcut Kubernetes CI pipeline'ınıza doğal olarak oturuyor. OPA/Gatekeeper'da ise Rego policy'leri için ayrı bir test çerçevesi (`opa test`) kullanmanız gerekiyor — bu, ekstra bir araç zinciri anlamına geliyor ama aynı zamanda daha güçlü, birim test odaklı bir doğrulama sağlıyor.

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: require-resource-limits
spec:
  validationFailureAction: Enforce
  rules:
    - name: check-resource-limits
      match:
        resources:
          kinds:
            - Pod
      validate:
        message: "Her container bir resource limit tanımlamalı."
        pattern:
          spec:
            containers:
              - resources:
                  limits:
                    memory: "?*"
                    cpu: "?*"
```

## CI Zamanında mı, Admission Zamanında mı Zorlanmalı?

İkisi birbirinin yerine geçmiyor, birbirini tamamlıyor. CI zamanında zorlama, kod review aşamasında geliştiriciye anında geri bildirim veriyor ve hatalı manifestin merge olmasını önlüyor; admission zamanında zorlama ise cluster'a giden her isteği — CI'dan geçmeyen manuel `kubectl apply` dahil — kontrol ediyor. [CI/CD pipeline'ınızı sıfırdan kurma rehberimizde](/tr/posts/cicd-pipeline-nasil-kurulur) anlattığımız gibi, güçlü bir pipeline bile admission controller olmadan son kullanıcının elle yaptığı bir değişikliği yakalayamıyor; bu yüzden ciddi bir güvenlik duruşu ikisini birlikte istiyor.

## Küçük Bir Ekip İçin Hangisi Mantıklı?

Küçük bir ekip için karar basit bir soruya indiriliyor: policy mantığınız YAML pattern eşleştirmeyle ifade edilebiliyor mu, yoksa gerçek bir programlama dili mi gerekiyor? Kyverno, mevcut Kubernetes YAML bilginizi doğrudan kullandığından ve mutation/generation'ı yerleşik sunduğundan, çoğu küçük-orta ölçekli ekip için daha düşük operasyonel maliyetle aynı güvenliği veriyor. OPA/Gatekeeper'a geçmek, ya zaten organizasyonda Kubernetes dışında da Rego kullanıyorsanız ya da policy'leriniz koşullu mantık, döngü ve karmaşık veri dönüşümü gerektirecek kadar büyüdüyse mantıklı.

Benim gözlemim şu: ekiplerin çoğu OPA'yı "daha güçlü" olduğu için seçiyor, ama gerçekte ihtiyaç duydukları şey birkaç basit validation kuralı — ki bu, Kyverno'nun YAML'ıyla çok daha az sürtünmeyle çözülüyor. Gerçek karmaşıklık ortaya çıktığında Rego'ya geçmek, her zaman en baştan Rego öğrenmekten daha ucuz.

## Bir Araçtan Diğerine Geçişin Maliyeti Ne?

Kyverno'dan OPA/Gatekeeper'a (veya tersine) geçiş, var olan policy sayısıyla doğrusal büyüyen bir maliyet. Her Kyverno YAML kuralı, karşılık gelen bir Rego kuralına elle çevrilmesi gerekiyor; otomatik bir dönüştürücü iki dil arasında güvenilir şekilde çalışmıyor çünkü Rego'nun ifade gücü YAML pattern eşleştirmesinden temelde farklı. Pratikte bu, 20-30 policy'lik bir kümeyi geçirmenin bile birkaç günlük mühendislik zamanı gerektirdiği anlamına geliyor — bu yüzden "önce doğru aracı seçmek," sonradan geçiş yapmaktan çok daha ucuz.

Her iki tarafın da birleştiği bir nokta var: CEL (Common Expression Language). Kubernetes'in kendi yerleşik ValidatingAdmissionPolicy'si CEL kullanıyor ve hem Kyverno hem de OPA ekosistemi, basit doğrulama senaryolarında CEL'i doğrudan destekleyecek şekilde evrilmeye başladı. Bu, gelecekte "hangi dili öğreneceğim" sorusunun, en azından basit kurallar için, giderek daha az önemli hale geleceği anlamına geliyor — ama karmaşık mutation ve generation senaryolarında Kyverno'nun YAML yaklaşımı ile OPA'nın Rego'su arasındaki fark hâlâ geçerliliğini koruyor.

## Operasyonel Maliyet Gerçekte Nereye Gidiyor?

İki aracın da çalışma zamanı maliyeti (CPU, bellek) benzer büyüklükte; asıl operasyonel maliyet fark, policy yazma ve bakım sürecinde ortaya çıkıyor. Kyverno'da yeni bir mühendis, mevcut bir policy'yi okuyup bir hafta içinde kendi kuralını yazabiliyor çünkü sözdizimi zaten bildiği Kubernetes YAML'ı. OPA/Gatekeeper'da aynı mühendisin Rego'yu öğrenmesi, policy yazmaya başlamadan önce ayrı bir eğitim yatırımı gerektiriyor — bu yatırım bir kez yapıldığında geri ödeniyor, ama küçük bir ekip için bu başlangıç maliyeti göz ardı edilecek kadar küçük değil.

| Maliyet kalemi | Kyverno | OPA/Gatekeeper |
| --- | --- | --- |
| İlk öğrenme yatırımı | Düşük (mevcut YAML bilgisi yeterli) | Yüksek (Rego öğrenimi gerekir) |
| Policy yazma hızı (deneyimli ekip) | Hızlı | Orta-hızlı |
| Çalışma zamanı kaynak tüketimi | Benzer | Benzer |
| Araçlar arası geçiş maliyeti | Policy sayısıyla doğrusal | Policy sayısıyla doğrusal |

## Sıkça Sorulan Sorular

### OPA Gatekeeper ile Kyverno arasında hangisini seçmeliyim?

Policy mantığınız basit YAML pattern eşleştirmeyle ifade edilebiliyorsa Kyverno'yu seçin; düşük öğrenme eğrisi ve yerleşik mutation/generation sunuyor. Karmaşık koşullu mantık gerekiyorsa ya da Kubernetes dışındaki sistemlerde aynı policy dilini kullanmak istiyorsanız OPA/Gatekeeper daha uygun.

### Kyverno'nun 2026'daki CNCF durumu ne?

Kyverno, Mart 2026'da CNCF'in top-level (graduated) proje statüsüne terfi etti. Bu, projenin olgunluk, topluluk ve güvenlik süreçleri açısından CNCF'in en üst seviye kriterlerini karşıladığı anlamına geliyor.

### Policy as code neden AI ajanları çağında daha önemli hale geldi?

AI ajanları artık kendi başlarına PR açıp altyapı dosyalarını değiştirebiliyor; bu, insan incelemesinin devreden çıktığı anlamına geliyor. Policy as code, bu değişikliklerin cluster'a ulaşmadan önce makine tarafında otomatik denetlendiği bir güvenlik ağı sağlıyor.

### Kyverno hem CI zamanında hem admission zamanında mı kullanılabilir?

Evet. Kyverno policy'leri hem CI pipeline'ında statik kontrol olarak çalıştırılabiliyor hem de cluster'a admission controller olarak kurulup her isteği gerçek zamanlı denetleyebiliyor; ikisini birlikte kullanmak en kapsamlı korumayı sağlıyor.
