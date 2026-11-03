---
title: "eBPF ile Çalışma Zamanı Güvenliği"
slug: "ebpf-ile-calisma-zamani-guvenligi"
translationKey: "ebpf-runtime-security-2026"
locale: "tr"
excerpt: "Kısa cevap: eBPF, syscall ve ağ olaylarını çekirdek içinde izler; Falco bu veriyle uyarı verir, Tetragon ise doğrudan çekirdek içinde engelleyebilir."
category: "devops-cloud"
tags: ["container-security", "containers", "observability", "kubernetes"]
publishedAt: "2026-11-03"
seoTitle: "eBPF Çalışma Zamanı Güvenliği: Falco mu Tetragon mu?"
seoDescription: "eBPF 2026'da çalışma zamanı güvenliğini nasıl değiştirdi: çekirdek seviyesi görünürlük, Falco'nun tespit modeli ve Tetragon'un çekirdek içi engellemesi."
---

Kısa cevap: eBPF, bir güvenlik aracının syscall'ları, ağ olaylarını ve süreç çalıştırmalarını doğrudan Linux çekirdeğinin içinde izlemesini sağlar; olaylar önce yavaş bir kullanıcı alanı (userspace) ajanına kopyalanmaz. Bu sayede eBPF tabanlı araçlar hem daha düşük yükle tespit yapabiliyor hem de Tetragon örneğinde olduğu gibi, bir kullanıcı alanı süreci tepki vermeden önce çekirdek içinde doğrudan engelleme yapabiliyor.

## eBPF bir güvenlik aracına tam olarak neyi gösterir?

eBPF (extended Berkeley Packet Filter), çekirdek içinde doğrulanmış küçük programlar çalıştırır; bunlar syscall giriş noktaları, ağ soketleri ve süreç çalıştırma (exec) olayları gibi çekirdek kancalarına bağlanır. eBPF tabanlı bir güvenlik aracı bu olayları kaynağında okur; her syscall'ı kullanıcı alanına kopyalayıp inceleyen bir yan konteyner (sidecar) veya çekirdek modülüne gerek kalmaz. 2026 itibarıyla eBPF tabanlı araçların eski ajan tabanlı yaklaşımın yerini büyük ölçüde almasının tek nedeni de bu mimari fark: bakımı gereken özel bir çekirdek modülü yok, her syscall için serileştirme yükü yok.

Bir eBPF programının görebildiği olaylar, bir iş yükünün başladıktan sonra yaptığı neredeyse her şeyi kapsar: hangi ikili dosyaları çalıştırdığını, hangi dosyaları açtığını, hangi süreçleri başlattığını ve hangi giden bağlantıları kurduğunu. Bu, bir konteynerin üretimde gerçekten kötü davrandığını yakalayan katmandır; ne deploy öncesi bir tarama ne de bir politika kontrolü bunu görebilir, çünkü ikisi de çalışan iş yükünü izlemez.

## Falco mu Tetragon mu: tespit mi, engelleme mi?

Falco tespit eder; Tetragon ise hem tespit edebilir hem de çekirdek içinde engelleyebilir. [Falco](https://falco.org/) (CNCF'in mezun ettiği bir proje), aldığı çekirdek olaylarına karşı kuralları değerlendirir ve uyarı üretir; varsayılan olarak otomatik bir eylem gerçekleştirmez — bir uyarıyı bir eyleme (pod'u öldürmek, bir insanı çağırmak) bağlamak için Falcosidekick gibi bir entegrasyon kullanmanız gerekir. Çekirdek içi engelleme için tasarlanmış [Cilium Tetragon](https://tetragon.io/) ise doğrudan eBPF'ten eylem alabilir: bir sürece SIGKILL göndermek veya bir syscall'ın dönüş değerini geçersiz kılmak gibi; engelleme gerçekleşmeden önce kullanıcı alanına gidip gelmeye gerek yoktur.

| | Falco | Tetragon |
|---|---|---|
| Temel model | Tespit — kuralları değerlendirir, uyarı üretir | Tespit + engelleme — eBPF'ten doğrudan eylem alabilir |
| Değerlendirme nerede olur | Olaylar kural eşleştirme için kullanıcı alanına gönderilir | Büyük ölçüde çekirdek içinde, engelleme için zorunlu bir kullanıcı alanı gidiş-dönüşü yok |
| Otomatik engelleme | Yerleşik değil; eylem almak için harici entegrasyon gerekir | Yerleşik — SIGKILL, syscall geçersiz kılma, politika tabanlı engelleme |
| Tipik kullanım | Çok sayıda sinyal türünde geniş tespit kapsamı | Bilinen-kötü davranışlar için dar kapsamlı, yüksek güvenli engelleme |
| Ekosistem | CNCF mezunu; ikisi arasında en büyük topluluk ve kural kütüphanesi | Cilium ekosistemindeki bir CNCF projesi; Cilium'un ağ politikalarıyla birleştiğinde en güçlü |

Çoğu ekip ikisinden birini seçmek zorunda kalmıyor — Falco'yu geniş tespit ve uyarı için her yerde çalıştırıyor, Tetragon tarzı engellemeyi ise bir konteyner kaçışı girişimi gibi açıkça "bilinen kötü" davranışların kısa bir listesiyle sınırlı tutuyor; burada her kenar durumu yakalamaktan daha önemli olan, anında engellemek.

## Bu, admission control ve SBOM taramasıyla nasıl bir araya geliyor?

eBPF tabanlı çalışma zamanı güvenliği, bir iş yükünün çalışmaya başladıktan sonra gerçekte ne yaptığını izleyen katmandır; admission control ve SBOM taraması bunu göremez çünkü ikisi de deploy öncesinde veya deploy anında çalışır. [OPA ve Kyverno gibi Policy as Code araçları](/tr/posts/kod-olarak-politika-opa-kyverno), politikayı ihlal eden bir pod tanımını hiç zamanlanmadan önce admission anında reddeder. [SBOM ve tedarik zinciri taraması](/tr/posts/yazilim-tedarik-zinciri-guvenligi), bilinen güvenlik açığı olan bağımlılıkları konteyner imajı gönderilmeden önce yakalar. Hiçbiri, iki kontrolden de temiz geçip çalışmaya başladıktan sonra beklenmedik bir shell başlatan veya node'larınızda kripto para madenciliği yapmaya başlayan bir iş yükü hakkında görünürlüğe sahip değildir.

eBPF tabanlı bir çalışma zamanı aracının tipik tespit hedefleri arasında konteyner kaçışı girişimleri, hiç shell başlatmaması gereken bir konteynerin içinde beklenmedik süreç çalıştırma, kripto madenciliği süreçleri ve bir iş yükünün hiç konuşmaması gereken bir hedefe şüpheli giden bağlantıları var. [eBPF'in gözlemlenebilirlikteki daha geniş rolü](/tr/posts/gozlemlenebilirlik-icin-ebpf) burada kesişiyor — güvenlik tespitini besleyen çekirdek seviyesi olay akışının aynısı, izleme (tracing) ve metrikleri de besliyor; eBPF'in 2026 itibarıyla "bu iş yükü gerçekte ne yapıyor" sorusunun her iki disiplinde de varsayılan merceği haline gelmesinin nedenlerinden biri de bu.

## Otomatik engellemeyi açmak güvenli mi?

Hemen değil — yeni bir tespit kuralını otomatik olarak herhangi bir şeyi engellemesine izin vermeden önce, gerçek üretim trafiğine karşı sadece-uyarı modunda doğrulayın. Bir uyarıdaki yanlış pozitif yalnızca gürültülü bir bildirim demektir; süreçleri öldüren veya syscall'ları engelleyen bir kuraldaki yanlış pozitif ise bir üretim iş yükünü hiç uyarı vermeden çökertebilir. [Yeni bir AI modelini flag'ler arkasında güvenle yayına almaya](/tr/posts/yeni-ai-modelini-guvenle-yayina-alma-flagler) uygulanan "önce shadow, sonra canary" disiplini burada da geçerli: önce kuralın canlı trafikte doğru çalıştığını kanıtlayın, sonra uyarıdan engellemeye geçirin.

Bir konteyner içindeki beklenmedik süreç çalıştırmayı izlemek için basitleştirilmiş, Tetragon tarzı bir izleme politikası şöyle görünür (örnek amaçlıdır, üretime hazır bir politika değildir):

```yaml
apiVersion: cilium.io/v1alpha1
kind: TracingPolicy
metadata:
  name: detect-unexpected-shell-exec
spec:
  kprobes:
    - call: "sched_process_exec"
      syscall: false
      args:
        - index: 0
          type: "file"
      selectors:
        - matchBinaries:
            - operator: "In"
              values:
                - "/bin/sh"
                - "/bin/bash"
          matchActions:
            - action: Sigkill
```

Bu `action: Sigkill` satırı engelleme adımıdır — yeni bir kuralda, önce hiç `matchActions` bloğu olmadan (sadece gözlem) başlayın.

## eBPF tabanlı güvenlik ne kadar yük getiriyor?

Satıcılar ve uygulayıcılar, eBPF tabanlı araçları genellikle tek hanede, düşük yüzdelik CPU aralığında olduğu belirtilen, eski kullanıcı alanı ajanı yaklaşımlarından daha düşük yükle tanımlıyor; çünkü olaylar her syscall için toptan kullanıcı alanına kopyalanmak yerine çekirdek içinde filtreleniyor. Gördüğünüz belirli bir rakamı, o satıcının kendi iş yükünden gelen yönelimsel bir iddia olarak değerlendirin, doğrulanmış bir araçlar-arası karşılaştırma olarak değil — node kapasitesini buna göre belirlemeden önce kendi trafiğinize karşı kendi ölçümünüzü yapın.

Benim görüşüm: çoğu ekip, kuralları bunu henüz kazanmadan engelleme moduna geçiyor. eBPF tabanlı çalışma zamanı güvenliğinin ilginç yanı bir şeyleri engelleyebilmesi değil; ilk kez hangi kurallara bir kill switch'le güvenebileceğinizi anlayana kadar üretim davranışını yeterince uzun ve ucuza izleyebilmenizi sağlaması.

## Sıkça Sorulan Sorular

### eBPF çalışma zamanı güvenliğinde ne için kullanılır?

eBPF, Linux çekirdeği içinde syscall'ları, süreç çalıştırmalarını ve ağ olaylarını izleyen sanal alanlı (sandboxed) programlar çalıştırır; böylece bir güvenlik aracı her olayı ayrı bir kullanıcı alanı ajanına kopyalamanın yükü olmadan çekirdek seviyesinde görünürlük kazanır.

### Kubernetes güvenliği için Falco mu Tetragon mu daha iyi?

İkisi de kesin olarak daha iyi değil; farklı sorunları çözüyorlar. Falco, en büyük kural kütüphanesine ve topluluğa sahip, olgun ve geniş kapsamlı bir tespit aracı. Tetragon ise çekirdek içi engelleme ekler; bir konteyner kaçışı girişimi gibi bilinen kötü bir eylemi harici bir entegrasyona gerek kalmadan doğrudan engelleyebilirsiniz.

### eBPF çalışma zamanı güvenliği SBOM taramasının veya admission control'ün yerini tutar mı?

Hayır. SBOM taraması ve admission control (OPA, Kyverno) deploy öncesinde veya deploy anında çalışır ve bir iş yükü çalışmaya başladıktan sonra ne yaptığını göremez. eBPF tabanlı çalışma zamanı güvenliği, deploy sonrası canlı davranışı izleyen katmandır ve üçü birbirinin yerine değil, birlikte çalışır.

### Bir eBPF aracının süreçleri otomatik olarak öldürmesine izin vermek güvenli mi?

Yalnızca kural gerçek üretim trafiğine karşı sadece-uyarı modunda doğrulandıktan sonra. Bir engelleme kuralındaki yanlış pozitif, hiç uyarı vermeden bir süreci öldürür veya bir syscall'ı engeller; bu yüzden ekipler otomatik engellemeyi açmadan önce yeni kuralın doğruluğunu kanıtlamalı.
