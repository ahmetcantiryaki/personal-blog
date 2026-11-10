---
title: "CI'da Yük Testi: Regresyon Nasıl Erken Yakalanır?"
slug: "cida-yuk-testi-regresyon"
translationKey: "load-testing-in-ci-catch-regressions"
locale: "tr"
excerpt: "Kısa cevap: k6 ile smoke boyutlu bir yük testini CI'a bağlayın; eşiği sabit milisaniye yerine servisin kendi p95 taban çizgisine göre tanımlayın."
category: "devops-cloud"
tags: ["ci-cd", "testing", "devops", "performance", "monitoring"]
publishedAt: "2026-11-10"
seoTitle: "CI'da Yük Testi ile Regresyon Yakalama Rehberi"
seoDescription: "k6 ile smoke boyutlu yük testini CI'a bağlayan, threshold tanımlayan ve relative regresyona göre build kıran rehber. Gatling ve Locust karşılaştırması dahil."
---

Kısa cevap: tek seferlik bir yük testi değil, her PR'da çalışan smoke boyutunda bir k6 senaryosu kurun; eşiği (threshold) sabit bir milisaniye değeri yerine servisin kendi trend çizgisine göre tanımlayın. Böylece yavaş yavaş birikmiş bir regresyon, tek bir büyük sıçrama beklemeden ilk PR'da build'i kırar.

## k6 mi Gatling mi Kullanılmalı?

Çoğu HTTP API için k6 daha hızlı kurulur: JavaScript ile yazılır, tek binary olarak dağıtılır ve CI'a bağlanacak `thresholds` özelliği yerleşik gelir. Gatling, Scala/Java/Kotlin tabanlı DSL'i ve JVM bağımlılığıyla daha ağırdır ama karmaşık protokol karışımlarında ve Gatling Enterprise üzerinden SLO tabanlı raporlamada daha güçlüdür.

| Araç | Dil | CI'da exit code ile kapı | Öğrenme eğrisi | En uygun senaryo |
| --- | --- | --- | --- | --- |
| k6 | JavaScript | Yerleşik, `thresholds` ihlalinde çıkış kodu 99 | Düşük | Hafif HTTP API'leri, hızlı PR kontrolleri |
| Gatling | Scala/Java/Kotlin/JS DSL | `assertions` ihlalinde sıfırdan farklı kod (bazı Windows bundle sürümlerinde bilinen istisnalar var) | Orta-yüksek | Karmaşık protokol senaryoları, kurumsal SLO raporlama |
| Locust | Python | Yerleşik sabit eşik yok; `--exit-code-on-error` ya da özel assertion gerekir | Düşük-orta | Python'a yakın takımlar, esnek senaryo scriptleri |

Takımın elinde zaten Python test altyapısı varsa Locust mantıklı, ama CI'ı kırmak için ek bir bayrak ya da özel kontrol eklemeniz gerekir — k6'da bu yerleşik. Üç aracı aynı anda değerlendirmeye çalışmayın; hangi protokolü test ettiğinizi (düz HTTP mi, WebSocket mi, gRPC mi) ve ekibin hangi dile zaten aşina olduğunu netleştirip tek bir aracı seçin, sonra o aracın CI entegrasyonunu derinleştirin.

## CI'da Yük Testi Neden Smoke Boyutunda Olmalı?

Tam kapsamlı bir stres testi dakikalarca sürer ve CI'ı tıkar; smoke boyutundaki bir senaryo ise 1-2 dakikada, düşük eşzamanlı kullanıcı sayısıyla (örneğin 10-20 VU) aynı uç noktaları yoklayıp p95 gecikmesinin ve hata oranının trendden saptığını yakalar. Haftalık ya da gecelik çalışan ayrı bir "gerçek" stres testi, kapasite planlaması için kalır; CI'daki smoke testin tek işi, her PR'ın gecikmeyi kötüleştirip kötüleştirmediğini söylemektir.

Bir ekip altı ay boyunca her PR'da gecikmeyi %2-3 artıran küçük değişiklikler birleştirirse, tek bir yük testi raporu bunu asla yakalamaz — çünkü her ölçüm kendi başına "normal" görünür. Smoke testin CI'da sürekli çalışması, bu birikimi haftalar içinde değil, aynı PR içinde görünür kılar.

## Eşik (Threshold) Nasıl Tanımlanır ve Build'i Nasıl Düşürür?

k6'nın resmi öğrenme materyallerine göre, bir `thresholds` bloğu ihlal edildiğinde `k6 run` süreci sıfırdan farklı bir çıkış koduyla (threshold ihlalinde genellikle 99) sonlanır; tüm eşikler geçerse çıkış kodu 0'dır. CI sistemleri (GitHub Actions, GitLab CI, Jenkins) bu çıkış koduna bakarak job'ı başarısız işaretler — ekstra bir "sonucu parse et" adımına gerek yoktur.

```javascript
import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 20,
  duration: '2m',
  thresholds: {
    http_req_duration: ['p(95)<300'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  http.get(`${__ENV.PREVIEW_URL}/api/orders`);
  sleep(1);
}
```

Bir uyarı: k6'nın `checks` (tekil istek doğrulamaları) başarısız olması, tek başına çıkış kodunu değiştirmez — `checks` metriği üzerinde ayrıca bir `threshold` tanımlamadığınız sürece test "geçti" sayılır. Gatling'de ise `assertions` bloğu simülasyon bittiğinde değerlendirilir ve ihlal sıfırdan farklı bir kod üretir, ama bazı Windows bundle sürümlerinde bu davranışın atlandığı bildirilmiştir — kullandığınız ortamda exit code'u bir kez manuel doğrulamak ucuza mal olur.

## Mutlak mı, Göreli Regresyon mu Ölçülmeli?

Burada çoğu rehberin önerdiğinin tersini yapmak gerekiyor: eşiği tek bir mutlak sayıya ("p95 < 300ms") sabitlemek yerine, servisin kendi son 7-14 günlük p95 taban çizgisine göre bir yüzde olarak tanımlayın (örneğin "p95, taban çizgisinin %15'inden fazla kötüleşemez"). Mutlak bir sayı, trafiği düşük bir mikroservis için anlamsız derecede gevşek, yoğun bir servis için ise kronik olarak kırılgan olur; relative eşik ise her servisin kendi normaline göre ayarlanır ve kapasite büyüdükçe elle yeniden kalibre edilmesi gerekmez.

Pratikte bu, CI job'ının önce son başarılı ana dal çalışmasından p95/p99 trendini okuması (bir zaman serisi veritabanından ya da k6 Cloud/Grafana'dan), sonra `thresholds` bloğunu bu taban çizgisine göre dinamik olarak enjekte etmesi anlamına gelir. Ek bir adım gibi görünür ama bir kez kurulduğunda bakımı, sabit sayıyı her çeyrek yeniden tartışmaktan daha azdır.

## Ephemeral Preview Ortamlarında Nasıl Çalıştırılır?

Her PR için ayağa kalkan preview ortamına karşı smoke testi çalıştırmak, testi o PR'ın ürettiği gerçek koda karşı yapar — staging'e merge olana kadar beklemek, regresyonu bulma anını günler geciktirir. Preview URL'sini `__ENV.PREVIEW_URL` ile k6'ya geçirmek ve CI job'ını preview ortamı "ready" health check'inden sonra tetiklemek yeterlidir; preview ortamı paylaşılan bir staging değilse, eşzamanlı PR'ların birbirinin ölçümünü bozma riski de ortadan kalkar.

Preview ortamı [CI/CD pipeline'ınızın](/tr/posts/cicd-pipeline-nasil-kurulur) bir parçası olarak zaten ayağa kalkıyorsa, yük testi adımı mevcut pipeline'a tek bir job olarak eklenir; ayrı bir orkestrasyona gerek yoktur.

## Testler Nasıl Flaky Olmaktan Çıkarılır?

Smoke testin kendisi gürültülü koşarsa (paylaşılan bir CI runner'da CPU contention, cold-start gecikmesi), eşik ihlalleri gerçek regresyonlardan ayırt edilemez hale gelir. Pratikte işe yarayan üç şey: testi ısınma turu (ilk 10-15 saniyeyi ölçüme katmamak) ile başlatmak, p95/p99 gibi yüzdelik dilim metriklerini ortalama yerine kullanmak (tek bir yavaş istek ortalamayı bozar ama p95'i genellikle bozmaz) ve eşiği tek bir çalışmaya değil, ardışık iki çalışmanın ortalamasına göre değerlendirmek.

Trendi görünür tutmak için p95/p99'u zaman içinde bir panoya (Grafana, Datadog ya da k6 Cloud) işlemek, "bu PR kötüleşti mi" sorusunu commit geçmişiyle yan yana görülebilir hale getirir — bu da [Kubernetes'te otomatik ölçeklemeyi](/tr/posts/kubernetes-otomatik-olcekleme-rehberi) ayarlarken aynı trend verisinin kapasite planlaması için yeniden kullanılmasını kolaylaştırır.

Paylaşılan bir CI runner havuzunda çalışıyorsanız, aynı anda tetiklenen birkaç job'ın CPU ve ağ bant genişliğini paylaşması tek başına yanlış pozitif üretebilir; bu riski azaltmanın en ucuz yolu, yük testi job'ını ayrı bir runner etiketine (örneğin `load-test` etiketli, garantili CPU payına sahip bir runner) sabitlemektir. Bu, testin gürültüsünü CI altyapısının genel yüküne bağımlı olmaktan çıkarır ve eşik ihlallerinin gerçek bir regresyonu işaret ettiğine olan güveni artırır.

Yük testi pipeline'ına erişimi olan servis hesaplarının ve preview ortamı kimlik bilgilerinin nasıl saklanacağı konusunda [bulutta secret yönetimi rehberimiz](/tr/posts/bulutta-secret-yonetimi) pratik bir başlangıç noktası. CI'a bir yapay zeka ajanı ekliyorsanız, aynı güvenlik sınırları [AI ajanlarını CI/CD'ye güvenle bağlama](/tr/posts/ai-ajanlari-cicd-guvenle-baglamak) yazımızda ele alınıyor. Diğer DevOps ve bulut yazılarına [devops-bulut kategorisinden](/tr/category/devops-bulut) ulaşabilirsiniz.

## Sıkça Sorulan Sorular

### CI'da yük testi ne kadar sürmeli?

Smoke boyutundaki bir k6 senaryosu 1-2 dakikada tamamlanmalı; 10-20 sanal kullanıcıyla kritik uç noktaları yoklamak, build süresini anlamlı şekilde uzatmadan p95/p99 sapmasını yakalamaya yeter. Tam kapsamlı stres testleri CI dışında, haftalık ya da gecelik ayrı bir job'da çalışmalı.

### k6'da threshold ihlali CI'ı nasıl kırar?

k6'nın resmi öğrenme materyallerine göre, bir `thresholds` bloğu ihlal edildiğinde `k6 run` süreci sıfırdan farklı bir çıkış koduyla (genellikle 99) sonlanır; CI sistemi bu çıkış kodunu okuyup job'ı başarısız işaretler. Bir shell wrapper script bu kodu yutabilir, bu yüzden k6'yı pipeline'daki son komut yapmak ya da `K6_EXIT=$?` ile kodu manuel yakalamak gerekir.

### Mutlak eşik yerine göreli eşik neden daha iyi?

Mutlak bir sayı (örneğin "p95 < 300ms") her servis için aynı anlama gelmez: düşük trafikli bir servis için gevşek, yoğun bir servis için kronik olarak kırılgan olabilir. Servisin kendi son 7-14 günlük taban çizgisine göre bir yüzde sapma tanımlamak, eşiği her servisin normaline göre otomatik olarak ayarlar.

### Gatling CI'da k6 kadar güvenilir mi?

Gatling'in `assertions` bloğu simülasyon bittiğinde değerlendirilir ve ihlalde sıfırdan farklı bir kod üretir, ama topluluk raporları bazı Windows bundle sürümlerinde bu davranışın atlandığını gösteriyor. Kullandığınız CI runner'ında exit code'u bir kez kasıtlı olarak kırıp doğrulamak, güvenilir bir kapı kurduğunuzu teyit eder.
