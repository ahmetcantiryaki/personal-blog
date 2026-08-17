---
title: "React'te Akışkan AI Arayüzleri (Streaming UI)"
slug: "reactte-akiskan-ai-arayuzleri-streaming"
translationKey: "streaming-ai-ui-react"
locale: "tr"
excerpt: "Kısa cevap: LLM token akışında SSE kullanın, WebSocket değil. React'te takılmadan render etmek, optimistic UI ve iptal yönetimini doğru kurmaya bağlı."
category: "web-development"
tags: ["react", "nextjs", "ai-tools", "frontend"]
publishedAt: "2026-08-17"
seoTitle: "React'te Streaming AI Arayüzü: Pratik Rehber"
seoDescription: "Kısa cevap: LLM token akışında SSE kullanın, WebSocket değil. React'te takılmadan render etmek, optimistic UI ve iptal yönetimini doğru kurmaya bağlı."
---

Kısa cevap: LLM token akışı için Server-Sent Events (SSE) kullanın, WebSocket değil. Kullanıcı tek bir mesaj gönderiyor, sunucu geri token akıtıyor — bu tek yönlü model tam olarak SSE'nin çözdüğü problem. OpenAI, Anthropic ve Google'ın API'lerinin hepsi SSE üzerinden akıyor, bu yüzden React tarafında da aynı modeli takip etmek en az sürtünmeli yol.

Asıl zorluk protokol seçimi değil — token'ları düzen sıçraması (layout jank) yaşamadan, iptal edilebilir ve hataya dayanıklı şekilde render etmek. Bu yazı, o kısmı nasıl doğru kurduğunuzu anlatıyor.

## SSE mi WebSocket mi kullanmalıyım?

Kısa cevap: sohbet tarafında kullanıcı yalnızca dinliyorsa SSE, kullanıcı da sık sık veri gönderiyorsa (çok oyunculu düzenleme, gerçek zamanlı işbirliği) WebSocket. LLM token akışı neredeyse her zaman birinci kategoriye giriyor: bir REST çağrısıyla mesaj gönderiyorsunuz, sonra sunucudan istemciye tek yönlü bir token akışı alıyorsunuz.

HTTP/2 altında SSE bağlantıları tek bir TCP bağlantısı üzerinden çoğullanıyor, bu da tarayıcının eş zamanlı bağlantı sınırını (HTTP/1.1'de altıya kadar düşen) ortadan kaldırıyor. Sunucunuz ve CDN'iniz HTTP/2 destekliyorsa (2026'da çoğu destekliyor), SSE büyük ölçekli fan-out'ta genellikle WebSocket'ten daha ucuza ölçekleniyor — ekstra protokol yükseltmesi yok, standart HTTP üzerinden çalışıyor, çoğu proxy ve CDN'den özel yapılandırma gerektirmeden geçiyor.

## Kısmi token'ları düzen sıçraması olmadan nasıl render ederim?

Kısa cevap: mesaj metnini React state'inde biriktirip, gelen her chunk'ta ekleyin — ama konteynerin yüksekliğini token geldikçe zıplatmayacak şekilde CSS ile sabitleyin. En sık yapılan hata, her token geldiğinde tüm mesaj listesini yeniden ölçmek; bu, kullanıcının okuduğu satırın altında kayan bir arayüze yol açıyor.

Pratik kural: akan mesajın konteynerine `min-height` verin ve mesaj listesini ters flex düzeninde (`flex-direction: column-reverse`) tutarak yeni içerik geldikçe kaydırma pozisyonunu koruyun. Kullanıcı yukarı kaydırmışsa otomatik kaydırmayı durdurun — hiçbir kullanıcı, okurken ekranın aniden aşağı kaymasını istemiyor.

## Minimal bir React streaming bileşeni nasıl görünür?

Aşağıdaki örnek, `fetch` ile bir SSE benzeri akışı (`ReadableStream`) tüketen, iptal edilebilir minimal bir hook gösteriyor:

```tsx
function useStreamingChat() {
  const [text, setText] = useState('')
  const [status, setStatus] = useState<'idle' | 'streaming' | 'error'>('idle')
  const controllerRef = useRef<AbortController | null>(null)

  async function send(prompt: string) {
    setText('')
    setStatus('streaming')
    controllerRef.current = new AbortController()

    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
      signal: controllerRef.current.signal,
    })
    const reader = response.body!.getReader()
    const decoder = new TextDecoder()

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        setText((prev) => prev + decoder.decode(value, { stream: true }))
      }
      setStatus('idle')
    } catch (err) {
      if ((err as Error).name !== 'AbortError') setStatus('error')
    }
  }

  function stop() {
    controllerRef.current?.abort()
    setStatus('idle')
  }

  return { text, status, send, stop }
}
```

Buradaki kritik detay `AbortController`: kullanıcı "durdur" düğmesine bastığında sunucu bağlantısını gerçekten kesiyor, sadece istemci tarafında render'ı durdurmuyor — bu, gereksiz token üretimi için ödeme yapmaya devam etmenizi engelliyor.

## Optimistic UI, durdur ve yeniden üret nasıl kurulur?

Kısa cevap: kullanıcı mesajını sunucudan onay beklemeden hemen listeye ekleyin (optimistic), asistan mesajını akış başladığı anda boş bir balonla gösterin, "durdur" düğmesini yalnızca `status === 'streaming'` iken aktif tutun. "Yeniden üret" ise genellikle son asistan mesajını silip aynı promptu tekrar göndermekten ibaret — ama bunu ayrı bir eylem olarak modelleyin, "gönder" eylemiyle karıştırmayın, çünkü hata mesajları ve yeniden deneme sayaçları farklı davranmalı.

| Durum | Kullanıcı ne görüyor | Ne yapmalı |
|---|---|---|
| `idle` | Boş giriş kutusu | Gönder düğmesi aktif |
| `streaming` | Akan metin + durdur düğmesi | Giriş kutusu devre dışı, durdur aktif |
| `error` | Hata mesajı + yeniden dene düğmesi | Son promptu sakla, tek tıkla yeniden gönder |

## Araç çağrısı ve durum bilgisini nasıl gösteririm?

Kısa cevap: bir ajan bir araç çağırırken (dosya arama, web sorgusu gibi) bunu metin akışından ayrı bir durum göstergesi olarak render edin, düz metin gibi değil. Çoğu üretim sohbet arayüzü, "Web'de aranıyor…" gibi bir ara durumu ayrı bir bileşende gösteriyor, sonra bu bileşen tamamlandığında normal metin akışına geri dönüyor. Bunu tek bir metin dizisine karıştırmak, kullanıcının hangi kısmın "düşünme" hangi kısmın "cevap" olduğunu ayırt etmesini zorlaştırıyor.

## Erişilebilirlik ve geri basınç (backpressure) nasıl ele alınır?

Kısa cevap: akan mesaj konteynerine `aria-live="polite"` koyun ki ekran okuyucular her token'da değil, doğal duraklamalarda güncellemeyi anons etsin; `aria-live="assertive"` kullanmayın, çünkü her token için kesintiye neden olur. Geri basınç tarafında, istemci render hızı sunucunun token üretme hızının gerisinde kalırsa (yavaş bir cihazda oluyor), chunk'ları bir kuyruğa alıp `requestAnimationFrame` ile boşaltmak, ana thread'i tıkamadan render etmenin en güvenilir yolu.

Bu kalıpların çoğu, akışı sunan tarafta (sunucu rotası ya da server action) doğru kurulmasına bağlı; sunucu tarafını Next.js'te uçtan uca kurmak istiyorsanız [Next.js uygulamana AI özelliği ekleme rehberimiz](/tr/posts/nextjs-uygulamana-ai-ozelligi-ekle) bu yazının doğal devamı. React state yönetimi tarafında akan mesaj durumunu global store'a mı yoksa yerel state'e mi koyacağınızı seçerken [React state yönetimi karşılaştırmamıza](/tr/posts/react-state-yonetimi-karsilastirma) bakmakta fayda var — çoğu sohbet arayüzü için yerel state yeterli, global store'a taşımak nadiren gerekiyor.

## Sohbet geçmişini akış bitmeden nasıl kaydederim?

Kısa cevap: her chunk geldiğinde veritabanına yazmayın, akış tamamlandığında (ya da düzenli aralıklarla, örneğin her birkaç saniyede bir) tek bir "checkpoint" yazın. Her token'da bir veritabanı yazma işlemi tetiklemek, hem gereksiz yük hem de yarış durumu riski yaratıyor — kullanıcı sayfayı yenilerse ya da bağlantı koparsa, en son checkpoint'ten devam edebilmeniz yeterli, her token'ın ayrı ayrı kalıcı olması gerekmiyor.

Bağlantı koptuğunda akışı nereden devam ettireceğinizi bilmek için, sunucu tarafında akışı bir kimlikle (`streamId`) ilişkilendirip son gönderilen chunk'ın indeksini saklamak işe yarıyor. İstemci yeniden bağlandığında bu `streamId`'yi göndererek kaldığı yerden devam edebiliyor — bu, uzun yanıtlar üreten ajan tabanlı akışlarda özellikle önemli, çünkü kullanıcı sekmesini kapatıp geri döndüğünde baştan başlamak istemiyor.

Pratikte bu, sunucu tarafında akan yanıtı bir bellek içi (ya da Redis gibi kısa ömürlü bir depoda) tampon içinde tutup, istemcinin son aldığı chunk indeksini sorgulayabilmesini gerektiriyor. Bu ek karmaşıklığı her sohbet arayüzüne eklemeye değmez — kısa yanıtlar üreten basit bir sohbet botu için muhtemelen gereksiz, ama dakikalarca süren araştırma ya da kod üretimi yapan bir ajan arayüzü için neredeyse zorunlu.

Basit bir kural: akışın tipik süresi birkaç saniyeyi geçmiyorsa, bağlantı koptuğunda kullanıcının isteği baştan göndermesi genelde kabul edilebilir bir maliyet. Akış dakikalar sürüyorsa (uzun bir araştırma raporu, çok adımlı bir kod üretimi), yeniden başlatma maliyeti kullanıcı deneyimini gerçekten bozuyor ve checkpoint/resume mekanizması kurmaya değiyor.

## En sık yapılan hatalar neler?

- Her token'da tüm mesaj listesini yeniden render etmek (yalnızca akan mesajı memoize edin).
- `AbortController` olmadan "durdur" düğmesi kurmak — bu sadece render'ı durdurur, sunucudaki üretimi değil.
- Araç çağrısı durumunu düz metinle karıştırmak.
- `aria-live="assertive"` kullanarak ekran okuyucuyu her token'da kesintiye uğratmak.
- Kullanıcı yukarı kaydırdığında otomatik kaydırmaya devam etmek.

## Sıkça Sorulan Sorular

### LLM sohbet arayüzü için SSE mi WebSocket mi kullanmalıyım?

SSE kullanın. Kullanıcı tek bir REST çağrısıyla mesaj gönderiyor ve sunucudan tek yönlü bir token akışı alıyor — bu, WebSocket'in çözdüğü çift yönlü senaryodan farklı. OpenAI, Anthropic ve Google'ın API'leri de SSE üzerinden akıyor.

### Token akışında düzen sıçramasını nasıl önlerim?

Akan mesaj konteynerine `min-height` verin, mesaj listesini ters flex düzeninde tutun ve kullanıcı yukarı kaydırdığında otomatik kaydırmayı durdurun. Her token'da tüm listeyi yeniden ölçmek yerine yalnızca akan mesajı güncelleyin.

### "Durdur" düğmesi tam olarak neyi durdurmalı?

Hem istemci tarafındaki render'ı hem de sunucu bağlantısını. `AbortController` ile `fetch` isteğini iptal etmek sunucu tarafındaki üretimi de kesiyor; yalnızca state güncellemesini durdurmak, sunucunun gereksiz token üretmeye devam etmesine (ve bunun için ödeme yapmanıza) neden oluyor.

### Araç çağrısı durumunu (örneğin "aranıyor…") nasıl göstermeliyim?

Metin akışından ayrı bir durum bileşeni olarak. Ara durumu düz metne karıştırmak, kullanıcının "düşünme" ile "cevap" arasındaki farkı ayırt etmesini zorlaştırıyor; çoğu üretim arayüzü bunun için ayrı bir gösterge kullanıyor.
