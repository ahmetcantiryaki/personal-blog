---
title: "AI Ajanları Nöbeti Devralabilir mi?"
slug: "ai-ajanlari-nobeti-devralabilir-mi"
translationKey: "ai-agents-on-call-incident-2026"
locale: "tr"
excerpt: "AI ajanları tespit, triyaj ve kök neden analizinde iyi, ama auto-remediation'ı insan onayı olmadan bırakmak blast radius'u büyütüyor. Pager son sırada."
category: "devops-cloud"
tags: ["ai-agents", "sre", "observability", "reliability"]
publishedAt: "2026-09-08"
seoTitle: "AI Ajanları Nöbeti Devralabilir mi?"
seoDescription: "AI ajanları tespit, triyaj ve kök neden analizinde iyi, ama insan onayı olmadan auto-remediation'a bırakmak blast radius riskini büyütüyor. Pager son sırada."
---

Kısa cevap: Hayır, tam anlamıyla değil. AI ajanları olay tespiti, triyaj, korelasyon ve runbook taslağı hazırlamada 2026 itibarıyla gerçekten güçlü, ama otomatik düzeltmeyi (auto-remediation) insan onayı olmadan production'a bırakmak blast radius'u (etkilenen sistem/kullanıcı kapsamı) büyütüyor. Pager, bir mühendislik ekibinin insanı tamamen çıkaracağı son yer olmalı.

## AI ajanları nöbet sürecinin hangi kısmını gerçekten iyi yapıyor?

Bir olay müdahale döngüsü kabaca beş adımdan oluşur: gerçek bir sinyali tespit etmek, kod ve telemetri üzerinden araştırmak, bir kök neden hipotezi kurmak, bir düzeltme önermek veya uygulamak, ve gerektiğinde bir insana yükseltmek. 2026 itibarıyla AI ajanları bu döngünün ilk üç adımını — tespit, triyaj, kök neden hipotezi — kayda değer bir doğrulukla yapabiliyor.

PagerDuty'nin SRE Agent'ı, geçmiş olay verisi, gözlemlenebilirlik logları ve metriklerine dayanarak olayları tespit edip triyaj ve teşhis yapıyor; incident.io'nun AI SRE'si ise kök neden tespitinde doğrulanmış performans gösteriyor ve olay müdahalesinin %80'ine kadarını otomatikleştirdiğini raporluyor. Bu rakamlar gerçek — ama "%80 otomatikleştirildi" ifadesinin "%80'inde insan hiç dahil olmadı" anlamına gelmediğine dikkat etmek gerekiyor; çoğu vakada otomasyon, bir insanın onaylayacağı bir öneriyi hazırlamak anlamına geliyor.

Bu üç adımda ajanların güçlü olmasının nedeni, verinin doğasıyla ilgili: tespit, triyaj ve kök neden hipotezi, geçmiş olay kayıtları ve gözlemlenebilirlik verisi üzerinde desen tanıma gerektiren adımlar — ve bu tam olarak büyük dil modellerinin iyi olduğu bir iş. Bir ajan, yüzlerce geçmiş olayda "bu hata mesajı deseni genelde şu kök nedene işaret ediyor" ilişkisini bir insandan çok daha hızlı tarayabiliyor.

## Auto-remediation neden riskli?

Kısa cevap: bir ajan yanlış kök nedene göre "düzeltme" uygularsa, blast radius'u küçültmek yerine büyütebilir — ve bu, bir insanın yapacağı hatadan daha hızlı, daha geniş kapsamlı olur. Bir yük dengeleyiciyi yeniden başlatmak, bir feature flag'i kapatmak veya bir deployment'ı geri almak gibi eylemler doğru bağlamda faydalı, yanlış bağlamda yıkıcı olabilir.

En sık karşılaşılan iki risk şu:

| Risk | Neden oluyor | Sonucu |
|---|---|---|
| Kötü rollback | Ajan, asıl kök neden yerine en son deploy'u suçluyor | Çalışan bir sürüm geri alınır, gerçek sorun devam eder |
| Blast radius genişlemesi | Ajan, tek bir servisi etkileyen bir düzeltmeyi tüm cluster'a uygular | Etkilenmeyen sistemler de kesintiye girer |

Üretim rehberliği, yüksek riskli containment (olayı sınırlama) ve eradication (kök nedeni ortadan kaldırma) adımları çevresine insan kontrol noktaları koymayı öneriyor — özellikle triyaj ile containment arasında, bir de containment ile eradication arasında. Tam otonomi hedef değil; denetim izli (audit trail'li), ölçülü (calibrated) otonomi hedef.

## Human-in-the-loop kapıları nereye konmalı?

Ajanın tespit ve triyaj yapmasına izin verin, ama üretim varlıkları üzerinde geri dönüşü zor eylemler (veritabanı şeması değişikliği, DNS kaydı güncelleme, büyük ölçekli rollback) öncesinde bir insanın onayını zorunlu kılın. Pratik bir kural: eylemin etkisi tek bir servisle sınırlıysa ve kolayca geri alınabiliyorsa (ör. bir pod'u yeniden başlatmak) otomatik uygulama makul; eylem birden fazla servisi etkiliyorsa veya geri alınması zor bir veri değişikliği içeriyorsa insan onayı zorunlu olmalı.

```yaml
# Örnek bir guardrail politikası
remediation_policy:
  auto_apply:
    - action: restart_pod
      scope: single_service
      max_blast_radius: 1
  require_approval:
    - action: rollback_deployment
      scope: multi_service
    - action: modify_database_schema
      scope: any
    - action: update_dns_record
      scope: any
  escalate_to_human:
    - confidence_below: 0.7
    - unknown_root_cause: true
```

Bu tür bir politika, ajanın hangi eylemi kendi başına uygulayabileceğini, hangisi için onay beklemesi gerektiğini ve hangi durumda doğrudan bir insana yükselteceğini önceden tanımlıyor — olay anında karar verilecek bir şey değil.

## Ajanları observability ve paging'e güvenle nasıl bağlarsınız?

Ajanı doğrudan paging sistemine (PagerDuty, Opsgenie) ve gözlemlenebilirlik platformuna (Datadog, Grafana) salt-okunur erişimle bağlayın; yazma erişimini yukarıdaki gibi bir guardrail politikasıyla sınırlayın. Ajanın hangi runbook'lara erişebileceğini de sınırlamak önemli — üretim ortamında hiç test edilmemiş bir runbook'u bir AI ajanının otomatik uygulaması, bir insanın da yapmayacağı bir şey.

CI/CD boru hattına ajan bağlarken kullanılan güvenlik prensiplerinin çoğu burada da geçerli: en az yetki ilkesi, kapsamı daraltılmış erişim token'ları ve her eylemin loglanması.

Ayrıca ajanın hangi ortamlara erişebileceğini de kademeli açmak mantıklı: önce staging ortamında birkaç ay çalıştırıp önerilerinin isabet oranını ölçün, sonra üretimde sadece düşük riskli eylemlere yazma izni verin. Bir ajanı ilk günden production'da tam yetkiyle çalıştırmak, bir insana ilk günden root erişimi vermekle aynı kategoride bir risk.

Bu kademeli açılış, aynı zamanda ekibinizin ajana ne kadar güvenmesi gerektiğini de öğretiyor. Staging'de üç ay boyunca ajanın önerilerinin %90'ı doğru çıkıyorsa, üretimde düşük riskli eylemlere yazma izni vermek makul bir sonraki adım. Ama bu oran %60'larda kalıyorsa, sorun ajanın yeteneğinde değil, muhtemelen ona verdiğiniz bağlamın (loglar, runbook'lar, geçmiş olay verisi) yetersizliğinde aranmalı.

Bu ölçüm disiplini olmadan bir ekibin karşılaşacağı en yaygın hata, ajana "yeterince iyi görünüyor" hissiyle üretimde geniş yetki vermek. Nöbet süreci, hatanın maliyetinin çok yüksek olduğu bir alan; burada "muhtemelen doğrudur" bir eylemi otomatik uygulamak için yeterli bir eşik değil. Ölçülebilir bir doğruluk eşiği belirlemek, bu kararı ekip içi tartışmadan çıkarıp veriye dayalı bir karara dönüştürüyor ve bir sonraki olay incelemesinde geriye dönük olarak doğrulanabilir kılıyor.

## Audit trail neden zorunlu?

Bir ajan bir üretim eylemini otomatik uyguladığında, "neden bu eylemi seçti, hangi veriye dayandı, ne zaman uyguladı" sorularının cevaplanabilir olması gerekiyor — hem olay sonrası incelemede (postmortem) hem de düzenleyici uyum açısından. Ajanın kararını insan tarafından okunabilir bir gerekçeyle birlikte loglaması, "bir kara kutu üretimde bir şey değiştirdi" durumundan çok daha güvenli bir konum.

Küçük ekipler için olay müdahalesi kurmanın temellerini [bu yazımızda](/tr/posts/kucuk-ekipler-icin-olay-mudahalesi) ele almıştık. AI ajanlarını CI/CD'ye güvenle bağlama konusunda [bu rehberimiz](/tr/posts/ai-ajanlari-cicd-guvenle-baglamak) benzer guardrail prensiplerini işliyor. Retry, backoff ve circuit breaker kalıpları hakkında [bu yazımız](/tr/posts/retry-backoff-circuit-breaker) otomatik düzeltme mantığının temelini oluşturuyor. Üretime almadan önce AI ajanlarını test etme konusunda [bu rehberimize](/tr/posts/ai-ajanlari-produksiyon-oncesi-test) bakabilirsiniz. İç geliştirici portalı kurmayı düşünüyorsanız [bu yazımız](/tr/posts/ic-gelistirici-portali-nasil-kurulur) faydalı olabilir. Daha fazla DevOps içeriği için [DevOps ve Bulut kategorimize](/tr/category/devops-bulut) göz atabilirsiniz.

Kaynak olarak [PagerDuty'nin SRE Agent teşhis yaklaşımını anlatan yazısını](https://www.pagerduty.com/eng/pagerduty-for-ai-how-the-sre-agent-triages-ai-incidents/) ve [incident.io'nun 2026 olay yönetimi trendleri raporunu](https://incident.io/blog/incident-management-tools-trends-2026) inceleyebilirsiniz.

## Sıkça Sorulan Sorular

### AI ajanları olayları tamamen kendi başına çözebilir mi?

Bugün için hayır, genel olarak değil. Tespit, triyaj ve kök neden hipotezi kurmada güçlüler, ama üretim ortamında geri dönüşü zor eylemleri insan onayı olmadan uygulamak riskli. En etkili kurulum, ajanın araştırma ve öneri yapıp, riskli eylemleri bir insanın onayladığı "koordineli insan-ajan" modeli.

### Hangi eylemleri ajanın otomatik uygulamasına izin vermeliyim?

Etkisi tek bir servisle sınırlı ve kolayca geri alınabilen eylemler (bir pod'u yeniden başlatmak, bir cache'i temizlemek) otomatik uygulama için makul adaylar. Birden fazla servisi etkileyen, veri şemasını değiştiren veya DNS gibi paylaşılan altyapıyı güncelleyen eylemler her zaman insan onayı gerektirmeli.

### Auto-remediation'ın kötü bir rollback yapması ne sıklıkla oluyor?

Kesin bir oran yayınlanmış değil, ama üretim rehberliği bu riski yeterince ciddi görüyor ki containment ve eradication adımları etrafına özellikle insan kontrol noktası konmasını öneriyor. Kök neden hipotezi düşük güven skoruyla geldiğinde (ör. %70'in altında) ajanın otomatik eylem yerine insana yükseltmesi standart bir guardrail.

### Audit trail olmadan bir AI ajanını üretime bağlamak güvenli mi?

Hayır. Audit trail olmadan bir ajanın neden belirli bir eylemi seçtiğini olay sonrası incelemede yeniden kuramazsınız, bu da hem güven sorunu hem de uyum riski yaratır. Her eylem, gerekçesiyle birlikte loglanmalı ki bir sonraki olayda aynı hatayı tekrarlayıp tekrarlamadığını görebilesiniz ve ekip zamanla ajana ne kadar güvenmesi gerektiğine dair somut, geriye dönük olarak incelenebilir somut bir kayıt biriktirsin.
