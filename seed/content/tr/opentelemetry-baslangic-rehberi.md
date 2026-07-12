---
title: "OpenTelemetry'e Başlangıç Rehberi"
slug: "opentelemetry-baslangic-rehberi"
translationKey: "opentelemetry-getting-started"
locale: "tr"
excerpt: "Bir servisi SDK ile enstrümante edip Collector üzerinden açık kaynak bir backend'e trace, metrik ve log göndermeyi adım adım, baştan sona anlatıyoruz."
category: "devops-cloud"
tags: ["observability", "monitoring", "devops", "open-source", "cloud"]
publishedAt: "2026-07-12"
seoTitle: "OpenTelemetry'e Başlangıç: Trace, Metrik ve Log Rehberi"
seoDescription: "Bir servisi SDK ile enstrümante edip Collector üzerinden açık kaynak bir backend'e trace, metrik ve log göndermeyi adım adım, baştan sona anlatıyoruz."
---

Bir mikroservisin yavaşladığını fark ediyorsunuz ama hangi katmanda takıldığını göremiyorsunuz — loglar bir sistemde, metrikler başka bir dashboard'da, trace ise hiç yok. [OpenTelemetry (OTel)](https://opentelemetry.io/docs/what-is-opentelemetry/) tam olarak bu boşluğu kapatmak için var: trace, metrik ve logu tek bir vendor-nötr standartla topluyor, böylece yarın backend'inizi değiştirseniz bile enstrümantasyon kodunuz aynı kalıyor.

Bu rehberde tek bir servisi baştan sona enstrümante ediyoruz: SDK ile otomatik enstrümantasyon arasındaki farkı, Collector'ın neden bir yönlendirme merkezi olduğunu, açık kaynak bir backend'e export ederek vendor lock-in'den nasıl kaçınacağınızı ve sampling ile cardinality kontrolünü ele alıyoruz.

## SDK enstrümantasyonu mu, otomatik enstrümantasyon mu

OTel iki temel yol sunuyor. **Otomatik enstrümantasyon**, uygulama kodunuza dokunmadan yaygın kütüphaneleri (HTTP istemcileri, ORM'ler, mesaj kuyrukları) sararak trace üretir — Python, Java ve .NET'te bir ajan ya da başlatma betiğiyle dakikalar içinde kurulur. **Manuel SDK enstrümantasyonu** ise iş mantığınıza özel span'ler ve öznitelikler eklemenizi sağlar; "bu ödeme neden 3 saniye sürdü" gibi sorulara otomatik enstrümantasyon nadiren cevap verir. Pratik yaklaşım ikisini birleştirmek: otomatik enstrümantasyonla hızlıca temel görünürlüğü kazanın, sonra kritik iş akışlarına elle span ekleyin.

```python
from opentelemetry import trace

tracer = trace.get_tracer("checkout-service")

with tracer.start_as_current_span("calculate_shipping") as span:
    span.set_attribute("order.item_count", len(items))
    cost = calculate_shipping(items)
    span.set_attribute("shipping.cost_cents", cost)
```

## Collector: neden doğrudan backend'e export etmiyorsunuz

Uygulamanızı doğrudan bir gözlemlenebilirlik vendor'ına bağlamak yerine [OTel Collector'a](https://opentelemetry.io/docs/collector/) export etmeniz öneriliyor. Collector; alma (receive), işleme (batch'leme, örnekleme, hassas veri maskeleme) ve yönlendirme (bir ya da birden fazla backend'e) katmanlarını uygulama kodunuzdan ayırıyor. Pratikte bu, backend'inizi Jaeger'dan Grafana Tempo'ya ya da başka bir açık kaynak yığına taşırken tek bir yapılandırma dosyasını değiştirmeniz, uygulama kodunuza hiç dokunmamanız anlamına geliyor.

```yaml
# collector-config.yaml — minimal örnek
receivers:
  otlp:
    protocols:
      grpc:
      http:
exporters:
  otlp:
    endpoint: "tempo:4317"
    tls:
      insecure: true
processors:
  batch:
service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp]
```

## Açık kaynak backend'e export ederek vendor lock-in'den kaçınmak

OTel'in enstrümantasyon-backend ayrımı sayesinde, bir kez SDK ile enstrümante ettiğiniz kod, hangi backend'i seçtiğinizden bağımsız çalışıyor. Grafana LGTM yığını (Loki, Grafana, Tempo, Mimir) ya da Jaeger gibi açık kaynak seçeneklere export ederek hem maliyeti kontrol altında tutabilir hem de vendor değiştirme özgürlüğünü koruyabilirsiniz. 2026 itibarıyla OTel; Google Cloud, AWS X-Ray, Azure Monitor, Datadog, New Relic, Honeycomb ve Jaeger dahil onlarca platformla doğrudan uyumlu — bu da onu artık fiili endüstri standardı yapıyor.

Trace, metrik ve log'u aynı bağlamda görebildiğinizde, ekiplerin bir dashboard'daki anormallikten ilgili log'a, oradan da tam olarak hangi servisin darboğaz yarattığını gösteren trace'e saniyeler içinde geçtiğini görüyoruz — bazı 2026 vaka çalışmaları MTTR'nin saatlerden dakikalara düştüğünü raporluyor. Kesin bir yüzde vermek yerine dürüst olmak gerekirse: bu iyileşme büyük ölçüde üç sinyali (trace, metrik, log) aynı bağlamda ilişkilendirebilmenize bağlı, salt OTel'e geçmenin kendisine değil.

## Sampling ve cardinality kontrolü

Her isteği trace etmek, yüksek trafikli bir serviste hem depolama maliyetini hem de backend yükünü hızla şişirir. Head-based sampling (isteğin başında rastgele bir oranla örnekleme kararı vermek) basit ve ucuzdur ama nadir hataları kaçırabilir; tail-based sampling ise tüm trace'i toplayıp hata içerenleri ya da yavaş olanları tutmanızı sağlar, ama Collector'da daha fazla bellek ve daha karmaşık yapılandırma gerektirir. Cardinality tarafında ise en yaygın hata, kullanıcı ID'si gibi yüksek kardinaliteli değerleri metrik etiketi (label) olarak kullanmak — bu, metrik backend'inizin zaman serisi sayısını patlatıp maliyeti kontrolden çıkarabilir; bu tür değerler span özniteliği olarak kalmalı, metrik etiketi olarak değil.

| Sampling stratejisi | Maliyet | Nadir hataları yakalar mı | Uygulama karmaşıklığı |
|---|---|---|---|
| Head-based (sabit oran) | Düşük | Hayır (istatistiksel şansa bağlı) | Düşük |
| Head-based (adaptif oran) | Orta | Kısmen | Orta |
| Tail-based | Yüksek | Evet | Yüksek (Collector'da state gerekir) |

## Semantic conventions: neden kendi öznitelik isimlerinizi uydurmayın

OTel'in az bilinen ama kritik bir parçası, semantic conventions — HTTP durum kodu, veritabanı sistemi adı ya da hata mesajı gibi yaygın kavramlar için standart öznitelik isimleri (`http.response.status_code`, `db.system.name` gibi). Kendi öznitelik isimlerinizi uydurmak yerine bu standardı kullanmanın faydası, farklı ekiplerin ya da farklı dillerde yazılmış servislerin ürettiği trace'lerin aynı dashboard'da, aynı sorgu ile filtrelenebilmesi. LLM tabanlı servisleriniz varsa, `gen_ai.*` öznitelik ailesi (model adı, token sayısı, araç çağrıları için) artık alanın vendor-nötr taban çizgisi hâline geldi — kendi ad alanınızı icat etmek yerine bunu kullanmak, ileride bir LLM gözlemlenebilirlik aracına geçtiğinizde enstrümantasyonunuzu yeniden yazmanızı gerektirmiyor.

## İlk trace'inizi doğrulamak

Collector'ı ayağa kaldırıp uygulamanızı enstrümante ettikten sonra ilk kontrol basit olmalı: bir istek gönderin, backend'inizde (Jaeger UI, Grafana Tempo ya da seçtiğiniz araç) o isteğe ait trace'in span'leriyle birlikte göründüğünü doğrulayın. Span sayısı beklediğinizden azsa genelde sorun otomatik enstrümantasyonun bazı kütüphaneleri kapsamamasıdır; span'ler görünüyor ama süre bilgisi mantıksızsa saat senkronizasyonunu (NTP) kontrol edin.

Bu görünürlüğü Kubernetes üzerinde çalıştırıyorsanız, [Kubernetes maliyet optimizasyonu yazımızda](/tr/posts/kubernetes-maliyet-optimizasyonu) bahsettiğimiz kaynak kullanım verileriyle trace'leri ilişkilendirmek, hangi pod'un hangi isteği yavaşlattığını saniyeler içinde bulmanızı sağlıyor. OTel'in tamamladığı boşluğu daha kernel seviyesinde, uygulama koduna hiç dokunmadan doldurmak isterseniz [eBPF ile gözlemlenebilirlik yazımıza](/tr/posts/gozlemlenebilirlik-icin-ebpf) göz atabilirsiniz — ikisi rakip değil, birbirini tamamlayan katmanlar. Observability'nin temel kavramlarına daha giriş seviyesinde bakmak isterseniz [Observability 101 yazımız](/tr/posts/observability-nedir) iyi bir başlangıç noktası, platform ekibi kurmayı düşünüyorsanız [platform engineering nedir yazımız](/tr/posts/platform-engineering-nedir) da faydalı olacaktır.

Son bir pratik not: OTel'e geçişi tek seferde tüm servislere yaymaya çalışmayın. En çok trafik alan ya da en sık hata veren birkaç servisle başlayıp Collector yapılandırmanızı ve dashboard'larınızı orada olgunlaştırmak, ardından kalan servislere yaymak, "her şeyi enstrümante ettik ama hiçbir dashboard kullanışlı değil" durumundan kaçınmanın en güvenilir yolu.

Log'ları da bu geçişe dahil edip etmemek ayrı bir karar: mümkünse OTel Logs API'sine geçmek uzun vadede daha az bakım gerektiriyor, çünkü trace, metrik ve log aynı `resource` bilgisiyle (servis adı, ortam, versiyon) etiketlenince aralarında geçiş yapmak sorgu seviyesinde kalıyor. Ama mevcut log altyapınız (örneğin ELK) zaten stabilse, önce trace ve metriklerle başlayıp log geçişini ayrı bir aşamaya bırakmak da makul bir sıralama.

Daha fazla DevOps ve gözlemlenebilirlik pratiği için [DevOps & Bulut kategorisine](/tr/category/devops-bulut) göz atabilirsiniz.

## Sıkça Sorulan Sorular

### OpenTelemetry hangi backend'lerle çalışıyor?

Neredeyse hepsiyle — Google Cloud, AWS X-Ray, Azure Monitor, Datadog, New Relic, Honeycomb, Jaeger ve daha fazlası OTLP protokolünü destekliyor. Bu, enstrümantasyon kodunuzu değiştirmeden backend değiştirebileceğiniz anlamına geliyor.

### Otomatik enstrümantasyon yeterli mi, yoksa manuel span eklemeli miyim?

Başlangıç için otomatik enstrümantasyon iyi bir temel sağlıyor. Ama "neden yavaş" sorusuna cevap veren iş mantığına özel detaylar için kritik yollara manuel span ve öznitelik eklemeniz gerekiyor.

### Collector olmadan doğrudan backend'e export edebilir miyim?

Teknik olarak evet, ama önerilmiyor. Collector olmadan, backend değiştirmek her uygulamanın yeniden deploy edilmesini gerektirir; Collector ile tek bir yapılandırma dosyasını değiştirmeniz yeterli.

### Tail-based sampling ne zaman gerekli?

Nadir ama kritik hataları (örneğin %0.1 oranında oluşan bir timeout) kaçırmamanız gerektiğinde. Head-based sampling'in sabit oranı bu tür nadir olayları büyük ihtimalle örnekleme dışında bırakır; tail-based sampling ise kararı isteğin sonunda, tüm span'ler toplandıktan sonra verdiği için hatalı ya da yavaş trace'leri kaçırma riski çok daha düşük.
