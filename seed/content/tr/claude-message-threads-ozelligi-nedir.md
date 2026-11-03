---
title: "Claude'un Yeni Message Threads Özelliği Nedir?"
slug: "claude-message-threads-ozelligi-nedir"
translationKey: "claude-message-threads-beta-2026"
locale: "tr"
excerpt: "Kısa cevap: konuşmayı bir saate kadar Anthropic sunucusunda tutan beta özellik; her turda sadece yeni mesajlar gönderilir, geçmiş tekrar yüklenmez."
category: "ai"
tags: ["claude", "llm", "ai-agents", "api-design"]
publishedAt: "2026-11-03"
seoTitle: "Claude Message Threads Nedir? (Kasım 2026)"
seoDescription: "Anthropic'in Message Threads beta özelliği, Claude API'de konuşmayı sunucu tarafında tutar; her turda tüm geçmiş yerine sadece yeni mesajlar gider."
---

Kısa cevap: Message Threads, Anthropic'in 2 Kasım 2026'da Claude Messages API'ye eklediği beta özellik. Sunucu konuşmayı kısa bir süre tutuyor, böylece her yeni turda geçmişin tamamı yerine sadece o turun mesajları gönderiliyor. Sonuç: daha küçük istekler ve konuşma uzasa da düşük, dengeli bir ilk token süresi (time-to-first-token).

## Message threads hangi sorunu çözüyor?

Thread kullanmadan her turda konuşmanın tamamı yeniden yüklenir; API bu geçmişi her seferinde yeniden doğrular ve tokenlara ayırır, model cevap vermeden önce bu iş tekrar tekrar yapılır. Kısa bir sohbette bunun maliyeti önemsizdir, ama saatlerce süren bir destek oturumunda veya çok adımlı bir kodlama ajanında istek boyutu her turda büyür, ilk token gecikmesi de onunla birlikte artar. Message Threads bu birikmiş geçmişi Anthropic'in sunucusuna taşıyor; 40. turun isteği, 2. turun isteği kadar küçük kalabiliyor — istemci sadece en yeni mesajı ve önceki cevabın nerede bittiğini gösteren bir işaretçiyi gönderiyor.

## Thread nasıl oluşturulur ve sürdürülür?

Sıradan bir Messages API isteğine `thread` adlı tek bir alan ekleniyor; her çağrıya da `message-threads-2026-08-12` beta header'ı eşlik ediyor. İlk istek her şeyi gönderir — konuşmanın tamamı, `system`, `tools` — ve `"thread": {"type": "create"}` ekler; Anthropic bu alışverişi cevabın `id`'si altında saklar. Sonraki her istek sadece yeni mesajları gönderip o `id`'ye referans verir:

```python
# 1. tur: tüm konuşma, thread'i oluşturur
first = client.beta.messages.create(
    model="claude-opus-5-5",
    max_tokens=1024,
    system="Acme için destek temsilcisisin.",
    messages=[{"role": "user", "content": "Merhaba, siparişimle ilgili sorum var."}],
    thread={"type": "create"},
    betas=["message-threads-2026-08-12"],
)

# 2. tur: sadece yeni mesaj, system/tools yok
second = client.beta.messages.create(
    model="claude-opus-5-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Kargo ne kadar sürer?"}],
    thread={"type": "continue", "previous_message_id": first.id},
    betas=["message-threads-2026-08-12"],
)
```

Bir continue isteğinde `system` veya `tools` göndermek 400 hatası döndürür — bu alanlar zaten create isteğinden thread'e kaydedilmiştir. Python, TypeScript, Go, Java, C#, PHP ve Ruby resmi SDK'ları bu defter tutma işini otomatik yapan bir `thread` yardımcı nesnesi sunuyor; başarısızlık sonrası yeniden oynatmayı da buna dahil ediyor, bu yüzden çoğu ekip yukarıdaki gibi ham continue istekleri yazmak zorunda kalmayacak.

## Bir thread gerçekte ne kadar yaşıyor?

Tasarım gereği uzun değil. Bir thread, son isteğinden 5 dakika sonra süresi doluyor ve Anthropic onu son kullanımından en fazla 1 saat sonra siliyor — her kaydedilen cevap bu 5 dakikalık sayacı sıfırlıyor, ama 1 saatlik tavan hiç değişmiyor. Bu, thread'leri aktif bir oturum için kullanışlı kılıyor; kullanıcının yarın tekrar açabileceği bir konuşmayı park etmek için değil. Kalıcı kopyayı saklamak hâlâ uygulamanızın sorumluluğunda.

Streaming kullanan uygulamalar için bir ayrıntı daha var: cevabın `id`'si stream'in `message_start` olayında gelir, ama continue isteğini ancak `message_stop` olayını aldıktan sonra göndermelisiniz. Stream `message_stop`'tan önce koparsa, aynı continue isteğini tekrar göndermek bazen `thread_already_continued` ya da `thread_continue_in_flight` hatası döndürebilir; bu durumda da çözüm aynı — tam konuşmayı yeni bir create isteğiyle yeniden oynatmak. Bağlantınızın cevap üretilirken mi, yoksa sunucu cevabı kaydettikten sonra mı koptuğunu bilemezsiniz; API bu belirsizlik yüzünden tekrar denemeyi reddedebiliyor, ama yeniden oynatmak her durumda güvenli bir seçenek.

## Continue isteği başarısız olursa ne olur?

Thread süresi dolduğunda, önceki tur kaydedilmediğinde (örneğin `max_tokens` tarafından kesilen bir tool çağrısı) veya istek thread'i oluşturandan farklı bir API key, workspace ya da organizasyondan geldiğinde continue isteği `thread_not_found` koduyla 404 döner. Çözüm her zaman aynı: kendi kaydınızdaki tam konuşmayı yeni bir create isteğiyle tekrar gönderin, sonra o yeni cevabın `id`'sinden devam edin. İkinci bir hata türü, `thread_fingerprint_mismatch`, thread sürerken "sabit" bir alanı değiştirirseniz tetikleniyor — `model`, `tool_choice`, `thinking`, `mcp_servers`, `context_management`, `output_config`, üst seviye `cache_control` veya beta header kümesi; bunlar siz bilerek yeni bir thread başlatana kadar her istekte aynı kalmak zorunda.

## Thread, prompt caching'in veya kendi veritabanımın yerini mi alıyor?

Hayır, ve çoğu ekibin ilk okumada atlayacağı nokta tam olarak burası. Message thread bir cache değildir, daha sonra sorgulayabileceğiniz bir depolama da değildir — Anthropic thread'i açıkça sıfır veri saklama (ZDR) kapsamı dışında tutuyor, sadece sunucu yönetimli bir anahtarla şifrelenmiş hafızada tutuyor, thread'i listelemek, okumak veya silmek için herhangi bir API da sunmuyor. [Prompt caching](/tr/posts/prompt-onbellekleme-llm-maliyet) bir thread'in altında kendi kurallarıyla çalışmaya devam ediyor: `cache_control` kesme noktalarını thread yokken yaptığınız gibi siz belirliyorsunuz, istek başına en fazla dört adet. Kullanıcının gelecek hafta yeniden açabileceği ürün içi konuşma geçmişi hâlâ kendi veritabanınızda yaşamak zorunda — thread sadece Claude'a tur başına gönderdiğiniz veriyi kısaltıyor.

## Henüz hangi özelliklerle birlikte kullanılamıyor?

Beta olduğu için thread'ler sessizce bozulmak yerine gerçek sınırlar koyuyor; bu doğru bir başarısızlık biçimi ama tüm bir kod yolunu thread'e bağlamadan önce yine de planlamaya değer.

| Thread ile desteklenmeyen | Yerine ne yapılır |
|---|---|
| Message Batches | `thread` içeren bir batch öğesi kendi sonucunda hata ile başarısız olur |
| Token Counting API | Tam konuşmayı `thread` olmadan sayın |
| Compaction / compaction-on-demand | Kendi özetinizden yeni bir thread başlatın |
| Context editing (`keep: "all"` ile `clear_thinking` hariç) | Desteklenen alt kümeyi kullanın ya da o çağrıda thread'i atlayın |
| HIPAA readiness veya Inference hooks açık organizasyonlar | Bu organizasyonlar için thread istekleri doğrudan reddedilir |

Fiyatlandırma ve rate limit her iki durumda da değişmiyor — thread'li bir istek, eşdeğer tam geçmişli isteğin maliyetiyle aynı; sadece o geçmişi toplamanın bant genişliği ve istemci tarafı tokenizasyon maliyetini artık siz ödemiyorsunuz. Bir thread'i listeleyecek, okuyacak veya silecek bir API da yok; thread'in var olup olmadığını anlamanın tek yolu, bir sonraki continue isteğinin başarılı olup olmadığına bakmak — bu da neden kendi konuşma kopyanızı hiçbir zaman thread'e güvenerek bırakmamanız gerektiğini bir kez daha gösteriyor.

## Şimdi benimsemeye değer mi?

Benim görüşüm: zaten bir ajan döngüsüne benzeyen her şey için açın — çok adımlı kodlama asistanları, uzun müşteri destek oturumları, onlarca tool çağrısını zincirleyen araştırma ajanları — ama beta'dan çıkana kadar diğer her şeyde kapalı tutun. Gecikme ve istek boyutu kazancı gerçek ve her ek turda birikiyor; bu da Anthropic'in [Claude API](/tr/posts/yapay-zeka-ajanlari-icin-api-tasarimi) üzerinde ajan kullanımı büyürken net bir şekilde optimize ettiği yük tipi, ama 1 saatlik sert tavan ve eksik batch/token-counting desteği, bunun konuşma durumunu yönettiğiniz her yerin yerine şu an doğrudan geçebilecek bir çözüm olmadığını gösteriyor. Kendi [ajan bellek katmanını](/tr/posts/ai-ajan-bellegi-sistemleri) kuran ekipler bunu o katmanın altında oturan bir taşıma optimizasyonu olarak görmeli, onun yerine geçen bir şey olarak değil — ve bir model sürümünü flag arkasında yayına alan herkes, thread olsun olmasın, [her isteğe hangi model ve prompt sürümünün hizmet verdiğini loglamaya](/tr/posts/yeni-ai-modelini-guvenle-yayina-alma-flagler) devam etmeli, çünkü `model` zaten bir thread'in ömrü boyunca kilitlediği alanlardan biri.

## Sıkça Sorulan Sorular

### Claude'un message threads özelliği hangi beta header'ını gerektiriyor?

Thread kullanan her istek — create veya continue — `message-threads-2026-08-12` header'ını içermek zorunda. Dizideki herhangi bir istekte bu header unutulursa, o istek sıradan, thread'siz bir Messages API çağrısı gibi işlenir.

### Message threads prompt caching'in yerini mi alıyor?

Hayır. Thread, konuşmayı sunucu tarafında saklayarak her turda daha az veri göndermenizi sağlıyor ama kendisi hiçbir şeyi cachelemiyor. Thread olmadan yaptığınız gibi, istek başına en fazla dört `cache_control` kesme noktasını hâlâ siz belirliyorsunuz.

### Bir Claude message thread'i süresi dolmadan ne kadar yaşıyor?

Thread, en son isteğinden 5 dakika sonra süresi doluyor; Anthropic onu son kullanımından en fazla 1 saat sonra siliyor. Her yeni kaydedilen cevap 5 dakikalık pencereyi sıfırlıyor, ama 1 saatlik tavan thread oluşturulduğu andan itibaren sabit.

### Bir Claude thread'ine continue isteği başarısız olursa ne yapılmalı?

İstek `thread_not_found` koduyla 404 hatası döner. Çözüm, kendi kaydınızdaki tam konuşmayı yeni bir create isteğiyle tekrar göndermek, ardından o yeni cevabın `id`'sinden itibaren thread'e devam etmektir.
