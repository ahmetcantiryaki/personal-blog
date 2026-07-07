---
title: "Observability 101: Log, Metrik ve Trace"
slug: "observability-nedir"
translationKey: "observability-101"
locale: "tr"
category: "devops-cloud"
tags: ["observability", "monitoring", "devops", "sre"]
publishedAt: "2026-07-01"
excerpt: "Observability nedir? Log, metrik ve trace'in üç sütununu, monitoring'den farkını ve OpenTelemetry ile 2026'da nasıl kuracağınızı üretimden çıkmış örneklerle anlatıyoruz."
seoTitle: "Observability Nedir: Log, Metrik ve Trace Rehberi (2026)"
seoDescription: "Observability nedir? Log, metrik ve trace'in üç sütununu, monitoring'den farkını ve OpenTelemetry ile 2026'da nasıl kuracağınızı güncel sürümlerle öğrenin."
---

Saat 03:14'te çağrı geldiğinde elinizde tek şey bir grafiğin kırmızıya dönmesi oluyorsa, "neden" sorusuna cevap verecek altyapıyı kurmamışsınız demektir. Observability tam da bu boşluğu doldurur: bir sistemin dışarıya yaydığı çıktılara (log, metrik ve trace) bakarak içeride ne olduğunu, önceden hiç tahmin etmediğiniz sorulara üretim ortamında yeni kod atmadan cevap verebilme yeteneğidir. Bu yazı observability nedir sorusunu üç sütun üzerinden yanıtlıyor: log, metrik ve trace.

Monitoring "önceden bildiğin bir şeyin bozulduğunu görmek", observability ise "hiç öngörmediğin bir şeyin neden bozulduğunu sormaktır." Bir isteğin on beş servisin arasından geçtiği modern dağıtık sistemlerde ikincisi olmadan olmuyor.

## Observability nedir?

Observability, bir sistemin ürettiği telemetriden yola çıkarak iç durumunu çıkarsayabilme özelliğidir. Kontrol teorisinden ödünç alınan bu kavram, yazılımda üç sinyal türüyle hayata geçer: **loglar** (ne oldu), **metrikler** (ne kadar) ve **trace'ler** (nerede ve ne sürede). Bu üçü birlikte, üretime yeni kod atmadan yeni sorular sormanızı sağlar.

Önemli ayrım şu: observability bir araç değil, sistemin bir **özelliğidir**. Yeterince zengin ve bağlamlı telemetri yayarsanız sisteminiz "gözlemlenebilir" olur; yaymazsanız dünyanın en pahalı Datadog faturası bile sizi kurtarmaz.

Üç sinyali birbirine bağlayan şey **bağlamdır**: aynı `trace_id` bir log satırında, bir metrik etiketinde ve bir span'de göründüğünde, bir sinyalden diğerine sıçrayarak sorunu saatler yerine dakikalar içinde daraltabilirsiniz. 2026'da ortaya yeni bir sinyal daha çıktı, ama sırası gelince ona döneceğiz.

## Observability ile monitoring arasındaki fark nedir?

Monitoring, önceden tanımladığınız metrikleri ve eşikleri izler; "bilinen bilinmeyenleri" yakalar. Observability ise ham telemetriyi keşfetmenizi sağlar; "bilinmeyen bilinmeyenleri" araştırmanıza imkân tanır. Monitoring size bir şeyin bozuk olduğunu söyler; observability neden bozulduğunu sormanızı sağlar. İkisi rakip değil, katmanlıdır.

| Boyut | Monitoring | Observability |
|-------|-----------|---------------|
| Temel soru | Bir şey bozuldu mu? | Neden bozuldu? |
| Kapsadığı | Bilinen bilinmeyenler | Bilinmeyen bilinmeyenler |
| Yaklaşım | Önceden tanımlı dashboard/alarm | Ad-hoc keşif, sorgu |
| Kardinalite | Düşük (birkaç etiket) | Yüksek (user_id, request_id) |
| Çıktı | "CPU %90" | "Şu 3 müşterinin isteği şu span'de takılıyor" |
| Ne zaman | Bildiğin arızalar | İlk kez gördüğün arızalar |

Pratikte monitoring, observability'nin bir alt kümesidir. Sağlam bir telemetri temeli kurarsanız, monitoring gösterge tabloları o verinin üstünde birer görünüm haline gelir.

## Observability'nin üç sütunu nedir?

Observability'nin üç sütunu log, metrik ve trace'tir. Loglar ayrık olayların zaman damgalı kayıtlarıdır; metrikler zaman içinde toplanan sayısal ölçümlerdir; trace'ler ise bir isteğin servisler arasındaki yolculuğunu uçtan uca gösterir. Her biri farklı bir soruya cevap verir ve gerçek güç, üçünü ortak bir `trace_id` ile birbirine bağladığınızda ortaya çıkar.

### Loglar: ne oldu?

Loglar, olan biteni anlatan ayrık kayıtlardır. 2026'da doğru yaklaşım **yapılandırılmış (structured) loglama**: düz metin yerine JSON. Böylece loglarınız üzerinde grep değil, sorgu çalıştırabilirsiniz.

```json
{
  "timestamp": "2026-07-01T09:14:22.418Z",
  "level": "error",
  "service": "checkout-api",
  "trace_id": "4bf92f3577b34da6a3ce929d0e0e4736",
  "user_id": "u_88213",
  "msg": "payment provider timeout",
  "provider": "stripe",
  "latency_ms": 3021
}
```

Buradaki `trace_id` altın değerindedir: aynı isteğin trace'ine ve o andaki metriklerine tek tıkla geçmenizi sağlar. Yapılandırılmamış loglar bu köprüyü kuramaz.

### Metrikler: ne kadar?

Metrikler, zaman içinde toplanan sayısal ölçümlerdir: saniyedeki istek, p99 gecikme, hata oranı, kuyruk derinliği. Ucuzdur, sıkıştırılabilir ve uzun süre saklanabilir; bu yüzden alarm ve trend için idealdir.

Ekiplerin en çok başvurduğu çerçeve **RED** (Rate, Errors, Duration) ve altyapı için **USE** (Utilization, Saturation, Errors). Temmuz 2026'da yayınlanan Prometheus 3.13 LTS ile [native histogram'lar](https://prometheus.io/docs/specs/native_histograms/) artık deneysel olmaktan çıktı; klasik bucket'lara kıyasla çok daha hassas p99 hesabı, çok daha az zaman serisiyle mümkün. Bir histogram sorgusu şöyle görünür:

```promql
# checkout-api p99 gecikmesi (5 dakikalık pencere)
histogram_quantile(0.99,
  sum(rate(http_request_duration_seconds_bucket{service="checkout-api"}[5m]))
  by (le)
)
```

Metriklerin zayıf noktası kardinalitedir. Her metriğe `user_id` gibi yüksek kardinaliteli etiket eklerseniz zaman serisi veritabanınız patlar; o tür soruları trace ve loglara bırakın.

### Trace'ler: nerede ve ne kadar sürdü?

Trace'ler, bir isteğin dağıtık sistemdeki yolculuğunu span'lerden oluşan bir ağaç olarak gösterir. Her span bir işlemi (DB sorgusu, HTTP çağrısı) temsil eder; süresi, üst span'i ve etiketleri vardır. Mikroservislerde "gecikme nerede?" sorusunun tek doğru cevabı trace'lerdedir.

Bir trace, "istek 3 saniye sürdü" bilgisini "çünkü `checkout → inventory → postgres` zincirindeki sorgu 2.7 saniye bekledi" seviyesine indirir. Bu görünürlük olmadan dağıtık gecikme ayıklamak tahmin oyununa döner.

### Dördüncü sinyal: profiller

Klasik "üç sütun" 2026'da dörde çıktı. [OpenTelemetry Profiles](https://opentelemetry.io/blog/2026/profiles-alpha/) Mart 2026'da public alpha'ya geçti ve Q3 2026 için GA hedefliyor. eBPF ile toplanan, ek enstrümantasyon gerektirmeyen sürekli profilleme (continuous profiling), "gecikme hangi fonksiyonda CPU yakıyor" sorusunu flame graph düzeyinde cevaplar. Metrik "ne"yi, trace "nerede"yi, log "bağlam"ı, profil ise "neden"i söyler. Üretimde henüz kritik yola koymayız ama radardan düşürmeyin.

## Observability'yi OpenTelemetry ile nasıl kurarsınız?

Observability yığınını kurmanın 2026'daki standart yolu OpenTelemetry (OTel) ile enstrümantasyon, ardından verinin bir Collector üzerinden backend'lere gönderilmesidir. OTel, log/metrik/trace için satıcıdan bağımsız tek bir API sunar; kodunuzu bir kez enstrümante eder, backend'i istediğiniz zaman değiştirirsiniz. Rakamlar da bunu doğruluyor: OTel, Kubernetes'ten sonra en çok katkı alan ikinci CNCF projesi ve organizasyonların yaklaşık yarısı halihazırda kullanıyor. Pratik bir kurulum sırası:

1. **Sinyalleri seçin.** RED metrikleri, yapılandırılmış loglar ve kritik yolların trace'leriyle başlayın; her şeyi birden değil.
2. **OpenTelemetry SDK'sını ekleyin.** Diliniz için OTel kütüphanesini kurun; web framework'ü ve HTTP/DB istemcileri çoğunlukla otomatik enstrümante edilir.
3. **Bağlam yayılımını (context propagation) açın.** `trace_id`'nin servisler arasında W3C `traceparent` başlığıyla taşındığından emin olun.
4. **OTel Collector kurun.** Uygulamalarınız telemetriyi Collector'a (Temmuz 2026'da v1.49/v0.143 hattı) gönderir; Collector örnekleme, filtreleme ve yönlendirmeyi merkezî yapar.
5. **Backend'lere yönlendirin.** Metrikleri Prometheus'a, trace'leri Tempo/Jaeger'a, logları Loki/Elasticsearch'e; ya da Grafana, Datadog, Honeycomb gibi tek platforma.
6. **Trace'i loglara enjekte edin.** Her log satırına aktif `trace_id`'yi ekleyin; üç sinyali birbirine bağlayan tutkal budur.
7. **Örnekleme (sampling) stratejisi belirleyin.** Yüksek hacimde tail-based sampling ile hatalı ve yavaş trace'leri her zaman saklayın, başarılıların bir kısmını.
8. **SLO ve alarmları bağlayın.** Ham sinyalin üstüne error budget'lı SLO'lar kurun; gürültülü eşik alarmları yerine belirti tabanlı alarmlar tercih edin.

Küçük ama önemli bir güncelleme: Grafana tarafında log toplama işini artık **Alloy** yürütüyor; Promtail "feature complete" ilan edildi ve yeni gelişim Alloy'a taşındı. Yeni kurulumlarda Promtail'e sarılmayın.

Ekosistemin Temmuz 2026 fotoğrafı:

| Bileşen | Rolü | Güncel sürüm (Tem 2026) | Not |
|---------|------|-------------------------|-----|
| OpenTelemetry Collector | Toplama & yönlendirme | v1.49 / v0.143 | Semantik konv. 1.38 |
| Prometheus | Metrik & alarm | 3.13 LTS | Native histogram stabil |
| Grafana Loki | Log toplama | 3.6.x | Toplama artık Alloy ile |
| Grafana Tempo | Trace backend | 2.x | OTLP/Jaeger/Zipkin |
| OTel Profiles | Sürekli profilleme | Alpha (GA hedefi Q3) | eBPF tabanlı |

Kritik nokta 6. adım. Bir üretim olayında logdan trace'e, oradan o zaman aralığının metriklerine tek tıkla geçebiliyorsanız, ortalama çözüm süreniz (MTTR) düşer. Bu köprüleri kurmadan üç ayrı sekmede kör dövüşü yaparsınız.

## Hangi sinyali ne zaman kullanmalısınız?

Basit kural: **alarm için metrik, konum için trace, kök neden için log.** Bir SLO ihlalini metrik yakalar, o dönemin yavaş trace'leri gecikmenin hangi span'de olduğunu gösterir, o span'e bağlı yapılandırılmış loglar da tam olarak neyin patladığını söyler. Üçünü sırayla kullanmak, tek başına herhangi birinden çok daha hızlıdır.

Gerçek bir olaydan örnek: checkout p99'u 400 ms'den 3 sn'ye fırladı (metrik). O aralığın yavaş trace'lerine baktık; gecikme `inventory` servisindeki tek bir Postgres span'indeydi (trace). O span'in `trace_id`'siyle logları filtreledik; eksik bir index yüzünden seq scan yapan bir sorgu vardı (log). Toplam ayıklama süresi: yaklaşık on dakika. Sinyaller bağlı olmasaydı yarım gün sürerdi.

İlişkili yazılarımıza da göz atın: üretim için [Docker en iyi pratikleri](/tr/posts/docker-en-iyi-pratikleri) rehberimiz, [Kubernetes maliyet optimizasyonu](/tr/posts/kubernetes-maliyet-optimizasyonu) yazımız, [kesintisiz deployment](/tr/posts/kesintisiz-deployment) rehberimiz ve [platform engineering nedir](/tr/posts/platform-engineering-nedir) derlememiz. Tüm kümeyi [DevOps & Bulut kategorisi](/tr/category/devops-bulut) altında bulabilirsiniz.

## Sıkça Sorulan Sorular

### Observability ve monitoring aynı şey mi?

Hayır. Monitoring, önceden tanımladığınız metrik ve eşikleri izleyip bilinen arızaları yakalar. Observability ise ham log, metrik ve trace üzerinde keşif yapıp öngörmediğiniz arızaları araştırmanızı sağlar. Monitoring bir şeyin bozulduğunu söyler; observability neden bozulduğunu sormanıza imkân tanır. Monitoring, sağlam bir observability temelinin üstündeki bir katmandır.

### Observability'nin üç sütunu nedir?

Üç sütun log, metrik ve trace'tir. Loglar ayrık olayların zaman damgalı kayıtlarıdır (ne oldu), metrikler zamanla toplanan sayısal ölçümlerdir (ne kadar), trace'ler ise bir isteğin servisler arasındaki yolculuğunu gösterir (nerede ve ne sürede). 2026'da bunlara dördüncü sinyal olarak profiller ekleniyor. Ortak bir `trace_id` ile bağlandıklarında birlikte en güçlü hallerine ulaşırlar.

### OpenTelemetry nedir ve neden önemlidir?

OpenTelemetry (OTel), log, metrik ve trace toplamak için satıcıdan bağımsız açık bir standarttır ve 2026'da fiili endüstri normudur; Kubernetes'ten sonra en çok katkı alan ikinci CNCF projesidir. Kodunuzu bir kez enstrümante edersiniz; veriyi Prometheus, Jaeger, Grafana, Datadog gibi istediğiniz backend'e gönderirsiniz. Bu, satıcıya kilitlenmeyi ortadan kaldırır ve backend değiştirmeyi yeniden enstrümante etmeden yapmanızı sağlar.

### Küçük ekiplerin tam bir observability yığınına ihtiyacı var mı?

Hayır, dev bir yığından çok doğru temellere ihtiyacınız var. Yapılandırılmış (JSON) loglama, birkaç RED metriği ve kritik yollarda trace ile başlayın; hepsi OpenTelemetry ile tek elden akar. Yönetilen bir platform (Grafana Cloud, Honeycomb, Datadog) küçük ekiplerin kendi Prometheus ve Loki kümesini işletmeden başlamasını sağlar.
