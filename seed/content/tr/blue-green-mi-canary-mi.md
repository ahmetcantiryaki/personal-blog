---
title: "Blue-Green mi Canary mi Deployment"
slug: "blue-green-mi-canary-mi"
translationKey: "blue-green-vs-canary"
locale: "tr"
excerpt: "Blue-green mi canary mi? Anlık geri alma, ikiye katlanan maliyet ve metrik kapılarını karşılaştırıp doğru rollout stratejisini seçmenin yolunu gösteriyoruz."
category: "devops-cloud"
tags: ["deployment", "devops", "kubernetes", "ci-cd"]
publishedAt: "2026-07-13"
seoTitle: "Blue-Green mi Canary mi? Rollout Karşılaştırması"
seoDescription: "Blue-green ile canary deployment arasında seçim yaparken rollback hızını, maliyeti ve dağıtım sıklığını nasıl hesaba katacağınızı örnek YAML ile anlatıyoruz."
---

Bir hata üretime sızdığında geri alma saniyeler mi sürmeli, yoksa küçük bir kullanıcı diliminin birkaç dakika etkilenmesini göze alabilir misiniz? Bu soru -araç modasından çok- blue-green ile canary deployment arasındaki seçimi gerçek risk toleransınıza ve dağıtım sıklığınıza bağlar.

## Blue-Green Deployment: Mekanik ve Anlık Geri Alma

Blue-green deployment'ta iki tam üretim ortamı aynı anda ayakta durur: biri ("blue") canlı trafiği karşılarken diğeri ("green") yeni sürümle hazır bekler. Trafik geçişi bir yük dengeleyici ya da Kubernetes selector değişikliğiyle olur ve pratikte anında gerçekleşir. Bir sorun çıkarsa geri alma da aynı hızda işler: tek bir selector çevirme, küme açısından saniyenin altında bir işlem. Blue-green, saniyeler içinde geri almayı garanti eden tek stratejidir. Bunu, genel [kesintisiz deployment](/tr/posts/kesintisiz-deployment) pratiğinin en radikal biçimi olarak düşünebilirsiniz.

Bunun bir bedeli var: rollout penceresi boyunca iki tam ortamı ayakta tutmak, hesaplama ayak izinizi ikiye katlar. Bu maliyeti hafifletmenin iki yolu var: boşta kalan green ortamını dağıtımlar arasında minimum kapasiteye indirmek ya da onu entegrasyon testi veya staging olarak yeniden kullanmak. Ekstra altyapı maliyetini haklı çıkarmanın en kolay yolu günde birden fazla dağıtım yapmaktır; günde bir kez ya da daha seyrek dağıtan ekipler için genelde canary daha maliyet uygun bir seçimdir çünkü iki tam bekleme ortamı gerektirmez.

## Canary Deployment: Kademeli Trafik ve Metrik Kapıları

Canary deployment'ta yeni sürüme trafik kademeli olarak kaydırılır ve bu geçiş hata oranları ile gecikme yüzdelikleri gibi metriklerle kapılanır. Sorun küçük bir trafik dilimiyle sınırlı kalır, yani blast radius (etki alanı) küçüktür. Bir şey ters giderse geri alma tam bir yeniden dağıtım değil, bir trafik ağırlığı ayarlamasıdır; bu da soğuk bir redeploy'a kıyasla ortalama kurtarma süresini (MTTR) düşürür. Ama yine de dakikalar sürebilir; kullanıcı etkisi sınırlı olsa da blue-green'in anlık geçişiyle karşılaştırıldığında daha yavaştır. Metrik kapılarının arkasındaki mantık, [retry, backoff ve circuit breaker](/tr/posts/retry-backoff-circuit-breaker) desenlerindekiyle aynıdır: sistemin kendi sağlığını izleyip insan beklemeden otomatik tepki vermesi.

Canary'nin maliyet avantajı açıktır: iki tam standby ortamı gerektirmez, mevcut kapasiteyi kademeli olarak kullanır. Bu yüzden günde bir kez ya da daha seyrek dağıtan ekipler için genelde daha bütçe dostu varsayılan seçenektir.

## Rolling Update: Kubernetes'in Varsayılan Taban Çizgisi

Kubernetes'te varsayılan olarak gelen basit taban çizgisi rolling update'tir. Ek özel altyapı gerektirmez ama geri alma daha yavaştır ve rollout sırasında eski ile yeni sürüm aynı anda çalışır; bu da karışık bir sürüm penceresi demektir. Çoğu ekip için makul bir başlangıç noktasıdır ama hızlı geri alma ya da hassas metrik kapıları gerektiren yüksek riskli değişiklikler için yetersiz kalır.

## Veritabanı Şeması ve Feature Flag'lerle Eşleşme

Her iki strateji de veritabanı şeması değişiklikleriyle karmaşıklaşır. Bir dağıtım stratejisini geriye dönük uyumlu ("expand/contract") migrasyonlara bağlamak, blue-green ya da canary fark etmeksizin önemlidir; aksi hâlde eski sürüm yeni şemayla ya da yeni sürüm eski şemayla karşılaşıp patlar. Feature flag'lerle eşleştirmek "dağıtımı" "yayından" ayırmanızı sağlar: kodu karanlıkta (dark) gönderip daha sonra açabilirsiniz. Şema göçü tarafını derinlemesine ele alan [kesintisiz şema migrasyonları](/tr/posts/kesintisiz-sema-migrasyonlari) yazımız, expand/contract deseninin adımlarını gösteriyor.

## Argo Rollouts ve Flagger ile Otomatik Kapılar

Argo Rollouts ve Flagger, Kubernetes controller'ları ve CRD'leridir; hem blue-green hem canary'yi -otomatik canary analiziyle birlikte- birinci sınıf kaynaklar olarak uygular. Hata oranına, gecikmeye ya da özel bir metriğe dayanarak bir sürümü insan müdahalesi olmadan otomatik terfi ettirebilir ya da geri alabilirler. Aşağıda, Argo Rollouts'ın canary analiz adımının basitleştirilmiş bir örneği var:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: woyable-api
spec:
  replicas: 5
  strategy:
    canary:
      steps:
        - setWeight: 20
        - pause: { duration: 5m }
        - analysis:
            templates:
              - templateName: success-rate
        - setWeight: 50
        - pause: { duration: 10m }
        - setWeight: 100
  template:
    spec:
      containers:
        - name: woyable-api
          image: woyable/api:v2.3.0
```

Bu tanım, trafiğin %20'sine geçip beş dakika beklemesini, bir başarı oranı analiz şablonunu çalıştırmasını ve yalnızca metrikler eşiği geçerse ilerlemesini söylüyor. [Argo Rollouts belgeleri](https://argo-rollouts.readthedocs.io/en/stable/concepts/) hem bu canary adımlarını hem blue-green'in `activeService`/`previewService` çiftini ayrıntılı anlatıyor; [Red Hat'in Argo Rollouts karşılaştırması](https://www.redhat.com/en/blog/blue-green-canary-argo-rollouts) da iki stratejinin aynı controller altında nasıl birleştiğini gösteriyor. Bu CRD'leri bir Git deposundan senkronlamak istiyorsanız önce [GitOps nedir](/tr/posts/gitops-nedir) yazımıza bakın.

## Ekipler Neden Yanlış Stratejiyi Seçiyor?

Gördüğümüz kadarıyla çoğu ekip rollout stratejisini araç modasına göre seçiyor -"Kubernetes'teyiz, o yüzden Argo Rollouts canary kullanıyoruz" gibi- dağıtım sıklığını ve blast radius toleransını gerçekten hesaplamadan önce. Uyumsuzluk genelde ancak bir olay yanlış seçimi pahalıya mal ettiğinde ortaya çıkıyor: günde on kez dağıtan bir ekip canary'nin dakikalar süren geri almasında sıkışıp kalıyor, ya da günde bir dağıtan bir ekip blue-green'in ikiye katlanmış faturasını neden ödediğini sorguluyor. [devops-daily.com'un karşılaştırma yazısı](https://devops-daily.com/comparisons/blue-green-vs-canary-deployments) ve [Acquaintsoft'un maliyet analizi](https://acquaintsoft.com/blog/blue-green-vs-canary-deployment-strategy-cost) bu hesabı önceden yapmanın önemini vurguluyor; olaydan sonra değil.

Temmuz 2026 itibarıyla, hem Argo Rollouts'ın hem Flagger'ın olgunlaşmış canary analiz motorları bu hesabı yapmayı ucuzlaştırdı: artık iki stratejiyi de aynı YAML iskeletinde deneyip gerçek maliyeti ve geri alma süresini ölçebilirsiniz.

Pratik bir öneri: yeni bir servise strateji seçerken önce mevcut dağıtım sıklığınızı ve son altı ayda yaşadığınız üretim olaylarının kaç tanesinin hızlı geri almayla önlenebileceğini not edin. Bu iki sayı çoğu zaman kararı tek başına verir; araç ekosisteminizin ne olduğu ikinci sırada gelir.

## Hangi Stratejiyi Seçmelisiniz? Karar Tablosu

| Ekip Olgunluğu / İş Yükü | Dağıtım Sıklığı | Önerilen Strateji | Neden |
|---|---|---|---|
| Erken aşama startup, küçük ekip | Haftada birkaç kez | Rolling update | Ek altyapı yok, kurulum basit, risk toleransı zaten düşük hacimle sınırlı |
| Büyüyen ekip, orta trafik | Günde birkaç kez | Canary (Flagger/Argo Rollouts) | Metrik kapıları blast radius'u sınırlar, iki tam ortam gerekmez |
| Olgun ekip, yüksek trafik, düşük hata toleransı | Günde 10+ kez | Blue-green (Argo Rollouts) | Saniyeler içinde geri alma; ekstra maliyet yüksek dağıtım sıklığıyla amorti olur |
| Düzenlenmiş/finansal iş yükü | Günde bir ya da daha az | Canary + feature flag | İki tam standby ortamı savurgan; feature flag ek güvenlik katmanı sağlar |
| Kritik altyapı, sıfır kesinti şartı | Değişken | Blue-green + expand/contract migrasyon | Anlık geri alma garantisi, şema uyumluluğu ayrı yönetilir |

Bu tablo bir başlangıç noktası, kural kitabı değil; kendi dağıtım sıklığınızı ve gerçek blast radius toleransınızı hesaplayın, sonra tabloya bakın. Daha fazla dağıtım ve altyapı yazısı için [DevOps ve Bulut](/tr/category/devops-bulut) kategorimize göz atın.

## Sıkça Sorulan Sorular

### Blue-green mi canary mi daha güvenli?

İkisi de farklı türde güvenlik sağlar. Blue-green anlık geri alma garantisi verir ama geçiş anlık olduğu için bir sorun tüm yeni trafiğe hemen yayılabilir. Canary, sorunu küçük bir dilimle sınırlar ama geri alma dakikalar sürebilir. Hangisinin "daha güvenli" olduğu, sizin için hızın mı yoksa etki alanı sınırlamasının mı daha kritik olduğuna bağlıdır.

### Rolling update yeterli değil mi?

Çoğu düşük riskli değişiklik için yeterlidir ve Kubernetes'te varsayılan olarak gelir. Ama karışık sürüm penceresi ve daha yavaş geri alma, yüksek riskli ya da sık dağıtılan değişiklikler için onu yetersiz kılar.

### Argo Rollouts ile Flagger arasında ne fark var?

İkisi de aynı problemi çözer: Kubernetes üzerinde otomatik canary analizi ve blue-green. Argo Rollouts, Argo ekosistemiyle (Argo CD, Argo Events) daha sıkı entegredir; Flagger ise service mesh'lerle (Istio, Linkerd, App Mesh) daha doğal çalışır. Seçim genelde mevcut altyapınıza bağlıdır.

### Veritabanı migrasyonları neden dağıtım stratejisini karmaşıklaştırıyor?

Çünkü blue-green ya da canary sırasında eski ve yeni sürüm aynı veritabanına aynı anda erişebilir. Şema değişikliği geriye dönük uyumlu değilse -örneğin bir sütun silinirse- eski sürüm patlar. Expand/contract deseni bunu çözer: önce şemayı genişlet, her iki sürüm de çalışsın, sonra eski yolu kaldır.
