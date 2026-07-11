---
title: "OpenTelemetry'e Başlangıç Rehberi"
slug: "opentelemetry-baslangic-rehberi"
translationKey: "opentelemetry-getting-started"
locale: "tr"
excerpt: "Bir servisi baştan sona OpenTelemetry ile enstrümante etmek nasıl görünür? SDK'dan Collector'a, sampling'den vendor bağımsız export'a adım adım rehber."
category: "devops-cloud"
tags: ["observability", "monitoring", "devops", "cloud"]
publishedAt: "2026-07-11"
seoTitle: "OpenTelemetry'e Başlangıç: Adım Adım Rehber"
seoDescription: "Bir servisi baştan sona OpenTelemetry ile enstrümante etmek nasıl görünür? SDK'dan Collector'a, sampling'den vendor bağımsız export'a adım adım rehber."
---

Bir ödeme servisinde p99 gecikme aniden üç katına çıktı ama hiçbir dashboard nedenini göstermiyordu. Loglar bir araçtaydı, metrikler başka bir araçta, dağıtık trace hiç yoktu. Sorunu bulmak dört saat sürdü — ve büyük kısmı, hangi servisin hangi isteği ne zaman işlediğini elle birleştirmekle geçti. Bu, merkezi bir izleme katmanı olmayan her ekibin er geç yaşadığı hikâye.

[OpenTelemetry](https://opentelemetry.io/docs/) (OTel) bu sorunu, log/metrik/trace'i tek bir vendor-nötr standart altında toplayarak çözer. Bu yazı bir servisi baştan sona enstrümante etme sürecini adım adım anlatıyor.

## Neden şimdi bir standarda ihtiyaç var

On yıl önce her observability vendor'ının kendi SDK'sı vardı — New Relic agent, Datadog agent, kendi proprietary formatınız. Bu, vendor değiştirmek istediğinizde tüm enstrümantasyon kodunu yeniden yazmanız gerektiği anlamına geliyordu. OpenTelemetry, CNCF şemsiyesi altında bu parçalanmayı birleştiren bir çaba: tek bir enstrümantasyon API'si, birden fazla backend'e export edilebilen tek bir veri formatı. Bugün büyük gözlemlenebilirlik vendor'larının neredeyse tamamı OTLP (OpenTelemetry Protocol) formatını doğrudan destekliyor — bu da OTel'i "bir seçenek" olmaktan çıkarıp fiili standart haline getiriyor.

## SDK mı, otomatik enstrümantasyon mu

OTel iki enstrümantasyon yolu sunar. **Otomatik enstrümantasyon**, popüler framework ve kütüphaneler (Express, FastAPI, Spring) için kod değişikliği gerektirmeden trace ve metrik üretir — bir agent ya da başlatma script'i ekleyip çalıştırmanız yeterli. **SDK ile manuel enstrümantasyon** ise kendi iş mantığınıza özel span'ler ve metrikler eklemenizi sağlar; hangi fonksiyonun ne kadar sürdüğünü ya da hangi iş kuralının kaç kez tetiklendiğini görmek istediğinizde gerekli.

Pratik yaklaşım: otomatik enstrümantasyonla başlayın (framework seviyesinde HTTP, veritabanı, dış servis çağrıları anında görünür hale gelir), sonra kritik iş akışlarına manuel span'ler ekleyin. İkisini karıştırmak sorun değil — otomatik enstrümantasyon oluşturduğu context'i manuel span'lerinize otomatik olarak miras bırakır.

```js
const tracer = trace.getTracer('payment-service')

async function processPayment(order) {
  return tracer.startActiveSpan('processPayment', async (span) => {
    span.setAttribute('order.id', order.id)
    try {
      const result = await chargeCard(order)
      return result
    } finally {
      span.end()
    }
  })
}
```

## Collector: yönlendirme merkezi

OTel Collector, uygulamalarınızın telemetri gönderdiği tek nokta. Görevi üç kelimeyle özetlenir: al, işle, gönder. Servisleriniz doğrudan bir observability backend'ine değil, Collector'a veri gönderir; Collector bu veriyi örnekleme, filtreleme, PII temizleme gibi işlemlerden geçirip istediğiniz sayıda backend'e dağıtır.

Bu dolaylılık kritik bir esneklik sağlıyor: backend'inizi değiştirmek istediğinizde (Datadog'dan kendi barındırdığınız bir Grafana LGTM yığınına geçmek gibi) tek değişiklik gereken yer Collector konfigürasyonu — uygulama kodunuz hiç dokunulmadan kalır.

```yaml
receivers:
  otlp:
    protocols:
      grpc:
      http:
exporters:
  otlphttp:
    endpoint: "https://your-backend:4318"
processors:
  batch:
service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlphttp]
```

## Neden vendor bağımsız export önemli

OpenTelemetry + kendi barındırılan backend kombinasyonu, 2026'da vendor kilitlenmesini kırmanın standart yolu haline geldi. Bunun somut bir etkisi de var: [HAMS Tech'in analizine göre](https://www.hams.tech/blog/opentelemetry-migration-2026-grafana-lgtm-cost-optimization.html), OTel + Grafana LGTM mimarisine geçen ekipler MTTR'ı saatlerden dakikalara indiriyor — metrik, log ve trace'in tek bir araçta korele olması, bir kesinti sırasında araçlar arasında geçiş yapma ihtiyacını ortadan kaldırıyor.

Bu aynı zamanda bir pazarlık gücü de sağlıyor: enstrümantasyonunuz OTel standardına bağlıysa, backend değiştirmek uygulama kodunu yeniden yazmak anlamına gelmiyor — sadece Collector'ın export hedefini değiştirmek yeterli.

| Yaklaşım | Vendor bağımlılığı | Değişim maliyeti | MTTR etkisi |
|---|---|---|---|
| Vendor SDK'sı (doğrudan) | Yüksek | Kod yeniden yazımı gerekir | Araca bağlı |
| OTel + tek backend | Düşük | Sadece Collector config | Orta |
| OTel + Collector + çoklu export | Yok | Sıfır kod değişikliği | Düşük (korele veri) |

## Sampling ve cardinality kontrolü

Her isteği %100 trace etmek, yüksek trafikli servislerde depolama maliyetini hızla şişirir. Collector'daki processor'lar burada devreye giriyor: tail-based sampling, hata veren ya da yavaş olan trace'leri her zaman tutarken normal trafiği belirli bir oranda örnekler. Bu, "her şeyi %5 örnekle" gibi kaba bir kuraldan çok daha değerli — asıl önemli olan anomalileri hiç kaçırmıyorsunuz.

Cardinality kontrolü ayrı bir disiplin: her metrik etiketine kullanıcı ID'si ya da istek ID'si eklemek, backend'inizin zaman serisi sayısını patlatır. Genel kural, yüksek kardinaliteli değerleri (ID'ler, timestamp'ler) metrik etiketi değil, trace attribute'u olarak tutmak. Bu ayrımı gözden kaçırmak, faturanın ay sonunda beklenmedik şekilde katlanmasının en yaygın nedenlerinden biri.

## Log'ları trace'e bağlamak

OTel'in en çok göz ardı edilen faydalarından biri, log ve trace'in aynı context'i paylaşması. Doğru kurulduğunda, uygulamanızın ürettiği her log satırı otomatik olarak o anki trace ID ve span ID'yi taşır. Bu, bir hatayı incelerken "önce trace'i bul, sonra o isteğin loglarını elle ara" adımını ortadan kaldırır — backend'inizde trace'e tıkladığınızda ilgili loglar zaten yanında görünür.

Bunu elde etmek için log kütüphanenizin OTel context'ini okuyacak şekilde yapılandırılması gerekiyor; çoğu modern log kütüphanesi (pino, winston, structlog) bunun için resmi ya da topluluk eklentisine sahip. Kurulum bir kere yapıldıktan sonra, ekibinizin "hangi log satırı hangi isteğe ait" sorusuna harcadığı zaman büyük ölçüde ortadan kalkıyor — dağıtık bir sistemde bu, incident sırasında dakikalar kazandırıyor.

```js
logger.info('payment charged', {
  trace_id: trace.getActiveSpan()?.spanContext().traceId,
  span_id: trace.getActiveSpan()?.spanContext().spanId,
})
```

## İlk trace'inizi doğrulamak

Kurulumun çalıştığını doğrulamak için minimum adım: Collector'ı ayağa kaldırın, bir servisi otomatik enstrümantasyonla başlatın, ona bir istek gönderin ve backend'inizde o isteğin trace ID'sini arayın. Trace görünüyor ve span'ler beklediğiniz servis sınırlarını (HTTP çağrısı, veritabanı sorgusu) gösteriyorsa kurulum doğru çalışıyor demektir.

Bu doğrulama adımını [Kubernetes maliyet optimizasyonu](/tr/posts/kubernetes-maliyet-optimizasyonu) yazımızda bahsettiğimiz kaynak izleme pratikleriyle birleştirmek, hem performans hem maliyet görünürlüğünü aynı telemetri katmanından almanızı sağlıyor. Sıfır-instrümantasyon yaklaşımını merak ediyorsanız, [gözlemlenebilirlik için eBPF](/tr/posts/gozlemlenebilirlik-icin-ebpf) yazımız OTel'i tamamlayan bir alternatifi ele alıyor.

## Sıkça Sorulan Sorular

### Collector'ı hiç kullanmadan doğrudan backend'e export edebilir miyim?

Teknik olarak evet, birçok SDK doğrudan export destekler, ama bu Collector'ın sağladığı örnekleme, filtreleme ve çoklu backend esnekliğinden vazgeçmek demek. Küçük bir prototipte doğrudan export makul bir başlangıç olabilir, ama production'a geçerken Collector'ı araya koymak neredeyse her zaman doğru tercih.

### OpenTelemetry ile [observability-101](/tr/posts/observability-nedir) yazımızdaki log/metrik/trace üçlüsü nasıl ilişkili?

OTel, o üçlüyü toplamak ve taşımak için kullanılan standart protokol ve SDK setidir. Üçlünün kavramsal çerçevesini biliyorsanız, OTel onu production'da nasıl uygulayacağınızın cevabı.

### Collector'ı Kubernetes'te nasıl konuşlandırmalıyım?

En yaygın desen, her node'da bir DaemonSet Collector (yerel toplama) ve merkezi bir Deployment Collector (işleme ve export) kombinasyonu. Bu, [GitOps nedir](/tr/posts/gitops-nedir) yazımızdaki deklaratif konfigürasyon prensipleriyle doğal olarak örtüşüyor — Collector config'i de bir Git deposunda versiyonlanabilir.

### Otomatik enstrümantasyon performansı nasıl etkiler?

Genellikle tek haneli yüzde aralığında bir overhead getirir; tail-based sampling ve batch processor'lar bu maliyeti daha da azaltır. Kritik yol üzerindeki servislerde önce staging'de yük testiyle doğrulamak iyi bir alışkanlık.

### Küçük bir ekip için OTel gerekli mi, yoksa aşırı mühendislik mi?

Tek bir servisiniz ve tek bir log aracınız varsa muhtemelen erken. Birden fazla servis, birden fazla dil ya da "hangi backend'i kullanacağız" tartışması başladığı anda OTel'in standardizasyon değeri maliyetini fazlasıyla karşılıyor.

### Mevcut vendor SDK'sından (örneğin Datadog agent) OTel'e geçiş ne kadar sürer?

Tek bir servis için genellikle bir-iki gün — çoğu vendor SDK'sı zaten OTLP export'unu destekliyor ya da yakın bir eşdeğeri var. Asıl zaman alan kısım, mevcut dashboard ve alert kurallarınızı yeni backend'e taşımak; bu yüzden geçişi tek seferde değil, servis servis yapmak çok daha güvenli, her adımda geri dönüş imkânı bırakır.
