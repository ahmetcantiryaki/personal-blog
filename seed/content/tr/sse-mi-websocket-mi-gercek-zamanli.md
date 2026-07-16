---
title: "SSE mi WebSocket mi: Gerçek Zamanlı Veri"
slug: "sse-mi-websocket-mi-gercek-zamanli"
translationKey: "sse-vs-websockets"
locale: "tr"
excerpt: "WebSocket'e gerçekten ihtiyacınız var mı? SSE çoğu dashboard ve canlı akışı düz HTTP'de otomatik yeniden bağlanmayla hallediyor. Çift yönlülük ne zaman gerekli?"
category: "web-development"
tags: ["backend", "api-design", "performance", "llm"]
publishedAt: "2026-07-16"
seoTitle: "SSE mi WebSocket mi: Doğru Gerçek Zamanlı Aktarımı Seçin"
seoDescription: "SSE mi WebSocket mi 2026'da? SSE çoğu dashboard ve bildirim akışını düz HTTP ve otomatik yeniden bağlanmayla karşılıyor. Karar tablosu ve örnek endpoint burada."
---

Gerçekten WebSocket'e mi ihtiyacınız var? Çoğu gerçek zamanlı özellik için — canlı dashboard'lar, bildirim rozetleri, AI yanıtlarının akıtılması — dürüst cevap hayır. Server-Sent Events (SSE), sunucudan istemciye güncellemeleri düz HTTP üzerinden teslim eder, bağlantı koptuğunda kendiliğinden yeniden bağlanır ve çift yönlü bir soketin gerektirdiği altyapının hiçbirine ihtiyaç duymaz. WebSocket'e ancak istemcinin akış ortasında gerçekten veri geri göndermesi gerektiğinde başvurun.

## SSE gerçekte ne

SSE, açık kalan ve hazır oldukça `data:` önekli metin olaylarını akıtan tek bir uzun ömürlü HTTP yanıtıdır; [WHATWG/MDN Server-Sent Events spesifikasyonunda](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events) tanımlanmıştır. Sıradan HTTP üzerinde çalıştığı için normal API trafiğinizin zaten geçtiği aynı proxy'lerden, load balancer'lardan ve CDN'lerden sorunsuzca geçer; HTTP/2 üzerinde de temiz şekilde multiplexlenir — birden fazla SSE akışı, HTTP/1.1 soketlerinin yapabileceği gibi ayrı ayrı TCP bağlantısı tüketmez. Tarayıcının yerleşik `EventSource` nesnesi yeniden bağlanmayı sizin için halleder: ağ kesintiye uğrarsa son event ID'siyle yeniden dener, özel bir mantık yazmanız gerekmez.

WebSocket ise bunun tersine, HTTP bağlantısını her iki tarafın da istediği anda ikili ya da metin çerçeveleri gönderebildiği kalıcı, tam çift yönlü bir TCP benzeri kanala yükseltir. Bu kesinlikle daha yetenekli — ve kesinlikle sizin kendinizin inşa etmesi gereken daha fazla şey demek: yeniden bağlanma, kopma sonrası mesaj sıralaması ve backpressure hepsi sizin sorununuz, tarayıcının değil.

## LLM token akışı neden neredeyse hep SSE kullanıyor

Bu, geliştiricilerin artık en sık karşılaştığı kalıp: hem [OpenAI'ın](/tr/posts/gpt-5-6-genel-kullanima-acildi) hem Anthropic'in API'leri chat completion'ları WebSocket değil SSE olarak akıtıyor ve bu tesadüf değil. Token üretimi doğası gereği tek yönlüdür — sunucu, model ürettikçe token'ları itiyor, istemcinin akış ortasında geri bir şey göndermesine gerek yok — ki bu tam olarak SSE'nin şekli. [LLM token maliyetini düşürme rehberimiz](/tr/posts/llm-token-maliyetini-dusurme) ve [LLM çıktılarını değerlendirme rehberimiz](/tr/posts/llm-ciktilari-degerlendirme) de bu akış kalıbını temel aktarım olarak varsayıyor. Bir chat arayüzü kuruyorsanız, aksini gerektiren özel bir sebebiniz olmadıkça büyük ihtimalle `EventSource`'un zaten bedavaya verdiği şeyi yeniden yazıyorsunuzdur.

Dönüş yolunun ikinci bir soket yerine sıradan bir HTTP POST ile yönetildiği minimal bir SSE endpoint'i şöyle:

```javascript
// Sunucu: olayları düz HTTP üzerinden akıt
app.get('/stream', (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  const send = (data) => res.write(`data: ${JSON.stringify(data)}\n\n`);
  const interval = setInterval(() => send({ tick: Date.now() }), 1000);

  req.on('close', () => clearInterval(interval));
});

// İstemci: manuel yeniden bağlanma mantığı gerekmiyor
const source = new EventSource('/stream');
source.onmessage = (event) => console.log(JSON.parse(event.data));

// Dönüş yolu: ikinci bir akış değil, sıradan bir POST
async function sendCommand(payload) {
  await fetch('/command', { method: 'POST', body: JSON.stringify(payload) });
}
```

Bu kalıp — aşağı SSE, yukarı POST — insanların WebSocket'e başvurarak kurmaya çalıştığı işlerin şaşırtıcı bir kısmını karşılıyor; "gönder" eyleminin sürekli bir akış değil ayrık bir olay olduğu chat arayüzleri de dahil.

## Ably'nin kendi verisinin işaret ettiği firewall ve proxy gerçeği

SSE'nin "sadece HTTP" vaadinin, taahhüt vermeden önce bilmeye değer gerçek bir tuzağı var: [Ably'nin 2026 WebSocket-SSE karşılaştırması](https://ably.com/blog/websockets-vs-sse), geliştirme ortamında sorunsuz çalışan SSE bağlantılarının üretimde öngörülemez şekilde arabelleğe alındığını fark eden müşterilerin WebSocket'e geçtiğini bildiriyor — bazı kurumsal proxy'ler ve kısıtlayıcı ağlar, akan HTTP yanıtlarını parça parça göndermek yerine arabelleğe alıyor, bu da düşük gecikmeli teslimatın bütün amacını boşa çıkarıyor. Bu bir spesifikasyon sorunu değil, bir üretim ağı sorunu; ama "SSE daha basit" ifadesinin otomatik olarak "SSE her ağda daha güvenilir" anlamına gelmediğini gösteriyor. Sadece localhost'ta değil, gerçek hedef ağlarınızda test edin.

## Çoğu SSE arabelleğe alma sorununu çözen tek bir config satırı

Yukarıdaki arabelleğe alma sorununu aşmak için WebSocket'e başvurmadan önce reverse proxy config'inizi kontrol edin — asıl suçlu genelde SSE'nin kendisi değil, budur. Nginx, proxy'lenen yanıtları varsayılan olarak arabelleğe alır; bu da akışı sessizce bozar:

```nginx
location /stream {
    proxy_pass http://backend;
    proxy_buffering off;       # yanıt arabelleğe almayı kapat
    proxy_cache off;
    proxy_set_header Connection '';
    proxy_http_version 1.1;
    chunked_transfer_encoding off;
}
```

Tek bir `proxy_buffering off` satırı, "SSE yerelde çalışıyor ama üretimde gecikiyor" raporlarının büyük bir kısmını çözer. WebSocket'in getirdiği ek karmaşıklığa gerçekten ihtiyacınız olduğu sonucuna varmadan önce kontrol etmeye değer.

## Çift yönlülük gerçekten ne zaman gerekli

WebSocket, istemci ve sunucunun ikisinin de oturum ortasında, birbirinden bağımsız olarak veri itmesi gerektiğinde karmaşıklığını hak eder: çok oyunculu oyun durumu, işbirlikli düzenleme (birden fazla imleç ve eşzamanlı operasyonel dönüşümler) ve yazma göstergeleri, çevrimiçi durumu ve okundu bilgisinin minimal gecikmeyle iki yönde de akması gereken chat uygulamaları. Özellik listenizde "istemci, bir istek-yanıt turunun izin verdiğinden daha hızlı, sunucunun istemediği bir şeyi gönderir" varsa, gerçek bir sokete ihtiyacınız olduğunun işareti budur.

| İhtiyaç | SSE | WebSocket |
|---|---|---|
| Yalnızca sunucu → istemci güncellemesi | Uygun | Gereğinden fazla |
| Otomatik yeniden bağlanma | `EventSource`'a yerleşik | Kendiniz uygularsınız |
| Standart HTTP altyapısından geçer | Evet | Bazen yapılandırma gerekir |
| İkili veri | Hayır (yalnızca metin) | Evet |
| Akış ortasında istemci → sunucu | Hayır (ayrı istek kullanın) | Evet, doğal olarak |
| Tipik kullanım | Dashboard, bildirim, LLM akışı | Chat, çok oyunculu, işbirlikli düzenleme |

Bu noktada sık sorulan bir soru Socket.IO'nun nereye oturduğu: Socket.IO, altta WebSocket kullanan ama long-polling'e otomatik geri düşen ve oda/namespace gibi ek soyutlamalar sunan bir kütüphane — teknik olarak SSE'nin alternatifi değil, WebSocket'in üstüne inşa edilmiş bir katman. Gerçekten çift yönlü iletişime ihtiyacınız varsa ve elle bağlantı yönetimi yazmak istemiyorsanız mantıklı bir seçim; ama sadece sunucudan istemciye akış yapıyorsanız SSE'nin sadeliğini fazladan bir bağımlılıkla değiştirmiş olursunuz.

## Karar kuralı

Her ikisini de birden fazla kez üretime çıkarmış biri olarak görüşüm şu: varsayılan olarak SSE'ye yönelin ve ancak ihtiyaç duyduğu spesifik çift yönlü özelliği isimlendirebildiğinizde WebSocket'e yükseltin — "ileride gerekebilir" bir sebep değil, çünkü SSE tabanlı bir uygulamaya sonradan bir WebSocket katmanı eklemek sınırlı, iyi bilinen bir migrasyon, bir yeniden yazım değil. "Gerçek zamanlı" etiketi altında ekiplerin kurduğu işlerin kabaca %90'ı — dashboard'lar, bildirim akışları, AI çıktısı akışı, canlı sayaçlar — istemcinin akış ortasında gerçekten veri geri göndermesini hiç gerektirmiyor ve bu özelliklerin her biri SSE olarak hem daha basit hem mevcut HTTP altyapısına daha yakın şekilde gönderiliyor.

## Sıkça Sorulan Sorular

### SSE, istemciden sunucuya veri gönderebilir mi?

Aynı bağlantı üzerinden hayır. SSE tek yönlüdür (sunucudan istemciye). İstemcinin veri göndermesi gerekiyorsa, bunu event stream'in içinden zorlamak yerine yukarıda gösterildiği gibi sıradan bir HTTP isteği — bir POST — ile eşleştirin.

### SSE, HTTP/2 ile çalışır mı?

Evet ve iyi çalışır — HTTP/2, birden fazla SSE akışını tek bir TCP bağlantısı üzerinde multiplexler; bu da aynı tarayıcıda HTTP/1.1 `EventSource` kullanımını sekteye uğratabilen sekme başına bağlantı sınırlarını önler.

### OpenAI ve Anthropic akış için neden WebSocket yerine SSE kullanıyor?

Çünkü token üretimi tek yönlüdür: sunucu token üretir ve hazır oldukça iter, istemcinin bir sonraki tam istekten önce geri bir şey göndermesine gerek yoktur. SSE'nin otomatik yeniden bağlanması ve düz HTTP uyumluluğu, bu trafik şekli için bir WebSocket'ten operasyonel olarak daha uygun.

### SSE üretimde güvenilir mi?

Çoğunlukla evet, ama gerçek hedef ağlarınızda test edin. Bazı kurumsal proxy'ler ve kısıtlayıcı ağlar, akan HTTP yanıtlarını hemen göndermek yerine arabelleğe alıyor; bu da yerel geliştirmede sorunsuz çalışsa bile bir SSE akışının gecikmeli ya da toplu hissettirmesine yol açabiliyor.
