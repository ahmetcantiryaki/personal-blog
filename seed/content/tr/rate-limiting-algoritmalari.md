---
title: "Rate Limiting: Token Bucket ve Sliding Window"
slug: "rate-limiting-algoritmalari"
translationKey: "rate-limiting-algorithms"
locale: "tr"
excerpt: "Rate limiting bir algoritma seçimi değil; nerede, hangi anahtarla ve hangi algoritmayla sınırlayacağınız üç ayrı karardır. Beş algoritmayı karşılaştırıyoruz."
category: "software-engineering"
tags: ["api-design", "performance", "reliability", "system-design"]
publishedAt: "2026-07-09"
seoTitle: "Rate Limiting Algoritmaları: Token Bucket vs Sliding Window"
seoDescription: "Rate limiting bir algoritma seçimi değil; nerede, hangi anahtarla ve hangi algoritmayla sınırlayacağınız üç ayrı karardır. Beş algoritmayı karşılaştırıyoruz."
---

Rate limiting kurarken çoğu ekip doğrudan "hangi algoritma" sorusuna atlıyor, ama bundan önce cevaplanması gereken üç ayrı karar var: **nerede** sınırlayacaksınız (edge mi, servis mi), **hangi anahtarla** sınırlayacaksınız (kullanıcı, IP, route) ve ancak ondan sonra **hangi algoritma**. Bu üçü karıştırıldığında ortaya "çalışıyor ama neden bu kadar tutarsız davranıyor" diye sorduğunuz bir sistem çıkıyor. Bu yazı üç kararı da ayrı ayrı ele alıyor ve beş algoritmayı bellek/doğruluk dengesine göre karşılaştırıyor.

## Üç karar: nerede, hangi anahtarla, hangi algoritma

**Nerede**: Edge'de (CDN/API gateway seviyesinde) limitlemek, kötü niyetli trafiği origin sunucularınıza ulaşmadan durdurur ve genellikle daha ucuzdur; servis seviyesinde limitlemek ise iş mantığına özgü kotalar (örneğin "ücretsiz plan ayda 1000 API çağrısı") için gereklidir. Çoğu olgun sistem ikisini birden kullanır: edge'de kaba bir DDoS/abuse filtresi, servis seviyesinde ince taneli bir kota.

**Hangi anahtarla**: IP başına limitleme, NAT arkasındaki paylaşılan IP'lerde (ofis ağları, mobil operatör CGNAT) meşru kullanıcıları birbirine karıştırır. Kullanıcı/API-key başına limitleme daha adil ama kimlik doğrulaması gerektirir. Route başına limitleme (`/search` farklı, `/checkout` farklı) pahalı endpoint'leri ayrı korumanızı sağlar. Gerçek sistemler genelde bu üçünü katmanlar: kimliksiz istekler IP'ye, kimlikli istekler API key'e göre sınırlanır.

**Hangi algoritma**: Bu, aşağıdaki beş seçenek arasında bir bellek/doğruluk/karmaşıklık dengesi. Bu üç kararı ayrı ayrı netleştirmeden algoritma seçimine geçmek, çoğu zaman yanlış problemi optimize etmekle sonuçlanıyor — mükemmel bir sliding window counter, yanlış anahtarla (örneğin paylaşılan bir kurumsal IP) uygulanmışsa hâlâ meşru kullanıcıları engelliyor.

## Beş algoritma, sayılarla

- **Fixed window**: Bir zaman dilimini (örneğin her dakika) sabit bir sayaçla sınırlar. Uygulaması en basit olanı ama pencere sınırında bir "patlama" sorunu var: dakika 0:59'da 100 istek, dakika 1:01'de 100 istek daha atılırsa, 2 saniyelik bir aralıkta 200 istek geçer.
- **Sliding window log**: Her isteğin zaman damgasını saklar, pencereyi kaydırarak sayar. Tamamen doğru ama bellek kullanımı istek sayısıyla orantılı büyür — yüksek trafikli bir anahtar için pahalı.
- **Sliding window counter**: Küçük alt pencerelere (örneğin 1 dakikalık limit için 10 saniyelik dilimler) sayaç tutar ve mevcut pencereye ne kadar girildiğine göre önceki+şimdiki pencerenin ağırlıklı toplamını hesaplar. [Cloudflare'in 2015 tarihli "Counting Things" yazısına göre](https://blog.cloudflare.com/counting-things-a-lot-of-different-things/) bu yaklaşım, 400 milyon istek ve 270 bin kaynak üzerinde ölçüldüğünde yalnızca %0.003 yanlış-karar oranı üretiyor.
- **Token bucket**: Bir "kova" sabit bir hızla token'la dolar; her istek bir token tüketir, kova boşsa istek reddedilir. Ani patlamalara (burst) izin verirken uzun vadeli ortalamayı koruduğu için API'lerde en yaygın kullanılan algoritmadır.
- **Leaky bucket**: Token bucket'ın tersine, istekler sabit bir hızda "sızdırılarak" işlenir; kova dolarsa yeni istekler reddedilir. Trafiği pürüzsüzleştirmek istediğiniz (örneğin arka plan işleme kuyruğu) senaryolarda tercih edilir.

```python
# Token bucket - basitleştirilmiş
class TokenBucket:
    def __init__(self, capacity, refill_rate):
        self.capacity = capacity
        self.tokens = capacity
        self.refill_rate = refill_rate  # token/saniye
        self.last_check = time.monotonic()

    def allow(self):
        now = time.monotonic()
        elapsed = now - self.last_check
        self.tokens = min(self.capacity, self.tokens + elapsed * self.refill_rate)
        self.last_check = now
        if self.tokens >= 1:
            self.tokens -= 1
            return True
        return False
```

```python
# Sliding window counter - basitleştirilmiş
def allow(current_count, previous_count, elapsed_in_window, window_size, limit):
    weight = (window_size - elapsed_in_window) / window_size
    estimated = previous_count * weight + current_count
    return estimated < limit
```

## Bellek ve doğruluk tablosu

| Algoritma | Bellek | Doğruluk | Burst toleransı | Tipik kullanım |
|---|---|---|---|---|
| Fixed window | O(1) | Düşük, sınır patlaması var | Yüksek (istenmeyen) | Basit, düşük riskli endpoint'ler |
| Sliding window log | O(n) istek sayısı kadar | Tam doğru | Yok | Düşük trafikli, kesin denetim gereken uçlar |
| Sliding window counter | O(1) | ~%1 hata payı | Düşük-orta | Cloudflare'in varsayılanı, çoğu API |
| Token bucket | O(1) | Yüksek | Kontrollü burst'e izin verir | Genel amaçlı API rate limiting |
| Leaky bucket | O(1) | Yüksek | Yok, trafiği düzleştirir | Kuyruk/arka plan işleme |

[DigitalApplied'ın 2026 API rate limiting referansına göre](https://www.digitalapplied.com/blog/api-rate-limiting-strategies-2026-engineering-reference) sliding window counter, sabit bellek kullanımı ve neredeyse tam doğruluğu birleştirdiği için büyük ölçekli dağıtık sistemlerde en dengeli seçim olarak öne çıkıyor — bu da onu Cloudflare'in varsayılanı yapan gerekçe. Küçük ölçekli bir iç API'de bu fark pratikte hissedilmeyebilir; asıl fark, saniyede on binlerce isteğin işlendiği, her byte'lık bellek kullanımının çarpım etkisi yarattığı sistemlerde ortaya çıkıyor.

## Nerede uygulama yeri gerçekten fark yaratıyor

Aynı algoritmayı edge'de mi servis seviyesinde mi çalıştırdığınız davranışı değiştirir. Edge'de dağıtık bir sliding window counter, her edge node'un kendi lokal sayacını tutup periyodik olarak merkezi bir sayaçla senkronize etmesini gerektirir; bu senkronizasyon gecikmesi kısa süreli "aşırı izin verme" pencereleri yaratabilir. Servis seviyesinde tek bir Redis instance'ı üzerinden çalışan aynı algoritma çok daha kesin ama tek hata noktası riski taşır. [Retry, backoff ve circuit breaker yazımızda](/tr/posts/retry-backoff-circuit-breaker) ele aldığımız gibi, bir rate limiter'ın kendisi de bir bağımlılıktır ve düşerse ya "hepsine izin ver" ya da "hepsini reddet" arasında bir failover stratejisine ihtiyaç duyar.

Açık söylemek gerekirse: çoğu ekip için "hangi algoritma" sorusu gereğinden fazla zaman harcanan bir tartışma. Token bucket ya da sliding window counter, doğru anahtarla (kullanıcı + route kombinasyonu) uygulandığında ikisi de pratikte yeterli. Asıl fark yaratan, limitin nerede uygulandığı ve limit aşıldığında istemciye ne kadar net bir sinyal (429 + `Retry-After` header) döndüğünüz.

Bir de sıkça atlanan bir detay var: limit başlıklarını (`X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`) yalnızca 429 döndüğünde değil, her yanıtta göndermek. Bu, istemci geliştiricilerinin limite yaklaştıklarını önceden görüp kendi trafiklerini ayarlayabilmelerini sağlıyor — limit aşılana kadar sessiz kalıp sonra sert bir 429 fırlatmak, entegrasyon yapan geliştiriciler için gereksiz bir sürpriz yaratıyor.

Idempotency ile rate limiting'in nasıl birlikte çalıştığını [idempotent API tasarımı yazımızda](/tr/posts/idempotent-api-tasarimi), API sözleşmesi tercihlerini [REST mi GraphQL mi karşılaştırmamızda](/tr/posts/rest-mi-graphql-mi), sistem tasarımı mülakatlarında bu konunun nasıl sorulduğunu [sistem tasarımı mülakatı rehberimizde](/tr/posts/sistem-tasarimi-mulakati) bulabilirsiniz. Daha fazla mühendislik içeriği için [Yazılım Mühendisliği kategorisine](/tr/category/yazilim-muhendisligi) göz atın.

## Sıkça Sorulan Sorular

### Token bucket ile sliding window counter arasında hangisini seçmeliyim?

Kısa burst'lere (kullanıcının birkaç isteği art arda atması) izin vermek istiyorsanız token bucket daha doğal davranır. Uzun vadede kesin bir orana yakınsamak, burst'e daha az tolerans göstermek istiyorsanız sliding window counter tercih edilir. Çoğu genel amaçlı API için token bucket varsayılan iyi bir seçimdir.

### Fixed window neden hâlâ kullanılıyor, madem sınır patlaması sorunu var?

Basitliği ve düşük bellek kullanımı yüzünden; düşük riskli, kritik olmayan endpoint'lerde (örneğin bir haber sitesinin genel API'si) sınır patlaması sorunu pratikte önemli değil. Ödeme ya da kimlik doğrulama gibi hassas uçlarda ise fixed window kullanmak riskli.

### Rate limit aşıldığında hangi HTTP durum kodu dönmeli?

`429 Too Many Requests` ve mümkünse bir `Retry-After` header'ı ile istemciye ne zaman tekrar deneyebileceğini söylemelisiniz. Bu, istemci tarafındaki backoff mantığının kör tahmin yerine sunucunun verdiği net bir sinyale göre çalışmasını sağlar.

### Dağıtık sistemde rate limiter'ı tek bir Redis instance'ına mı bağlamalıyım?

Küçük-orta ölçekte evet, çünkü doğruluk basitlik getirir. Çok yüksek trafikte tek Redis instance'ı darboğaz olabilir; bu noktada ya Redis Cluster'a geçilir ya da yaklaşık (eventually consistent) dağıtık sayaçlar kabul edilir — doğruluktan biraz ödün verip ölçeklenebilirlik kazanılır.
