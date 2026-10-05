---
title: "Vercel AI SDK ile Akışlı Yapay Zeka Sohbeti Nasıl Kurulur?"
slug: "vercel-ai-sdk-akisli-sohbet-arayuzu"
translationKey: "vercel-ai-sdk-streaming-chat-2026"
locale: "tr"
excerpt: "Vercel AI SDK'nın useChat kancasıyla Next.js route handler'dan SSE üzerinden token akıtarak tam yanıtı beklemeden ilk kelimeleri saniyenin kesirinde gösterin."
category: "web-development"
tags: ["nextjs", "react", "typescript", "ai-tools"]
publishedAt: "2026-10-05"
seoTitle: "Vercel AI SDK ile Akışlı Yapay Zeka Sohbeti Nasıl Kurulur?"
seoDescription: "Next.js'te Vercel AI SDK'nın useChat kancası, route handler, tool calling ve sağlayıcı değişimiyle akışlı yapay zeka sohbeti nasıl kurulur, 2026 rehberi."
---

Kısa cevap: `ai` paketini kurup modelin akışlı yanıt döndürdüğü bir Next.js route handler yazın, ardından istemci tarafında `useChat` kancasını çağırarak token'ları Server-Sent Events (SSE) protokolü üzerinden ekrana aktarın. 2026 itibarıyla çalışan bir akışlı sohbet arayüzü kurmanın en hızlı yolu tam olarak budur.

## Vercel AI SDK Nedir?

Vercel AI SDK, npm üzerinde [`ai` paketi](https://www.npmjs.com/package/ai) olarak yayınlanan, dil modelleri üzerine uygulama geliştirmek için kullanılan açık kaynaklı bir TypeScript araç setidir. 2026 itibarıyla haftalık 31 milyonun üzerinde indirme sayısına ulaşmış olup JavaScript ekosistemindeki en çok kullanılan yapay zeka kütüphanelerinden biri haline gelmiştir. Sunucu tarafında modele istek atan bir katmanı, React, Next.js, Vue, Svelte ve Nuxt için kanca (hook) sunan bir arayüz katmanıyla (AI SDK UI) ve tool calling desteğiyle birlikte barındırır. Ayrıntılı dokümantasyon [sdk.vercel.ai](https://sdk.vercel.ai) adresinde yer alır.

## AI SDK'da Akış (Streaming) Nasıl Çalışır?

Akış, sunucunun modelin ürettiği metni tek seferde tam yanıt olarak göndermek yerine token token, üretildiği anda göndermesi demektir. AI SDK bu token'ları tarayıcıya Server-Sent Events (SSE) üzerinden akıtır; SSE, sunucunun tek bir uzun ömürlü HTTP bağlantısı üzerinden art arda metin olayları gönderdiği, istemcinin güncelleme için sorgu atmasına ihtiyaç bırakmayan bir protokoldür. Pratikte fark şudur: kullanıcı, yanıtın tamamının üretilmesini saniyelerce beklemek yerine ilk kelimeleri birkaç yüz milisaniye içinde ekranda görür.

## Streaming İçin Route Handler Nasıl Kurulur?

Next.js route handler, model sağlayıcısıyla konuşup sonucu tarayıcıya akıtan sunucu tarafı uç noktadır. `app/api/chat/route.ts` dosyasını oluşturun, `streamText` fonksiyonunu bir sağlayıcı ve gelen mesajlarla çağırın, ardından yanıtın belleğe tamamen alınmadan SSE üzerinden akması için `result.toDataStreamResponse()` döndürün.

```typescript
// app/api/chat/route.ts
import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: anthropic("claude-sonnet-4"),
    system: "Kısa ve yardımsever bir asistansın.",
    messages,
  });

  return result.toDataStreamResponse();
}
```

Bu handler henüz iptal mantığı içermiyor. `streamText`'e geçirilen `req.signal`, istemcinin üretimi yarıda kesmesini sağlayan parçadır ve aşağıda ele alınacaktır.

## İstemci Tarafında useChat Nasıl Kullanılır?

`useChat`, özellikle sohbet arayüzleri için tasarlanmış AI SDK UI kancasıdır: mesaj listesini state içinde tutar, gelen token'ları mesaja ekler, bir `isLoading` bayrağı sunar ve route handler'a otomatik olarak istek atar. İstemci bileşenine ekleyip API rotasını gösterin.

```tsx
"use client";

import { useChat } from "ai/react";

export default function ChatPanel() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } =
    useChat({ api: "/api/chat" });

  return (
    <div>
      {messages.map((m) => (
        <p key={m.id}>
          <strong>{m.role}:</strong> {m.content}
        </p>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} disabled={isLoading} />
        <button type="submit" disabled={isLoading}>Gönder</button>
        {isLoading && <button type="button" onClick={stop}>Durdur</button>}
      </form>
    </div>
  );
}
```

Elle `fetch` çağrısı yok, elle SSE ayrıştırma yok, her parça için elle state güncellemesi yok; `useChat` bunların üçünü de, hata durumunda otomatik yeniden deneme dahil kendisi yönetir. Ekiplerin `fetch` ve bir `ReadableStream` okuyucusunu kendi başına bağlamak yerine bu kancaya yönelmesinin asıl nedeni, elle yazılan bu istemci state kodunun ortadan kalkmasıdır.

## useChat mı, useCompletion mı, useObject mi?

Doğru seçim genelde nettir: ileri geri konuşmanın olduğu her yerde `useChat`, tek bir prompt'tan tek bir metin bloğu üreten işlerde `useCompletion`, modelin bir şemaya karşı doğrulanan yapılandırılmış JSON akıtmasını istediğinizde ise `useObject` kullanılır.

| Kanca | En uygun kullanım | Yönettiği şey |
|---|---|---|
| `useChat` | Çok turlu sohbet arayüzleri | Mesaj geçmişi, akan token'lar, yüklenme durumu, hatada otomatik yeniden deneme |
| `useCompletion` | Tek prompt, tek çıktı metin üretimi | Akan tek bir tamamlama metni, yüklenme durumu |
| `useObject` | Yapılandırılmış JSON akışı | Model akıtırken dolan, bir şemaya göre doğrulanan tipli nesne |

## Sohbete Tool Calling Nasıl Eklenir?

Tool calling, modelin sadece metin üretmek yerine konuşmanın ortasında sizin tanımladığınız bir fonksiyonu -örneğin bir siparişin durumunu sorgulamayı- çağırabilmesidir. Aracı bir şema ve açıklamayla tanımlayıp `streamText`'e verin; SDK, modelin bir aracı çağırmak istediğini fark etmeyi, aracı çalıştırmayı ve sonucu konuşmaya geri beslemeyi kendisi üstlenir.

```typescript
import { streamText, tool } from "ai";
import { z } from "zod";

const result = streamText({
  model: anthropic("claude-sonnet-4"),
  messages,
  tools: {
    getOrderStatus: tool({
      description: "Sipariş ID'sine göre durum sorgular",
      parameters: z.object({ orderId: z.string() }),
      execute: async ({ orderId }) => {
        return { status: "kargoda", orderId };
      },
    }),
  },
});
```

İstemci tarafında `useChat`, her mesajın içinde ilgili araç çağrısını da döndürür; böylece fonksiyon çalışırken "Sipariş durumu kontrol ediliyor..." gibi bir ara durumu, sonuç geldiğinde de nihai yanıtı gösterebilirsiniz. Modelin yapılandırılmış fonksiyonlar yerine standart bir protokol üzerinden dış sistemlere bağlanmasını istiyorsanız [ilk MCP bağlayıcınızı yazma](/tr/posts/ilk-mcp-baglayicini-yaz-2026) rehberimize bakabilirsiniz.

## Model Sağlayıcısı UI'yi Bozmadan Nasıl Değiştirilir?

AI SDK, 25'in üzerinde model sağlayıcısının arkasında tek bir ortak arayüz sunar; bu sayede Anthropic'ten OpenAI'a veya Google'a geçiş yalnızca sunucudaki `streamText` çağrısına verilen `model` parametresini değiştirmek anlamına gelir ([AI SDK 5 duyurusu](https://vercel.com/blog/ai-sdk-5) bu arayüzün nasıl evrildiğini gösterir). İstemci bileşeni, `useChat` çağrısı ve ekrana basılan JSX aynı kalır; çünkü hiçbiri sağlayıcının kendi SDK'sıyla doğrudan konuşmaz, yalnızca sizin route handler'ınızla konuşur.

```typescript
// sunucuda tek satır değişir, istemcide hiçbir şey değişmez
import { openai } from "@ai-sdk/openai";

const result = streamText({
  model: openai("gpt-4o"),
  messages,
});
```

Pratikteki en güçlü yanı da budur: bir sağlayıcı geçişi, UI'nin yeniden yazılması değil sunucuda tek satırlık bir değişiklik haline gelir ve bence bu sınırı, bir sağlayıcının kendi SDK'sı kısa vadede daha cazip görünse de korumaya değer. Sohbet bileşenini bir sağlayıcının kendi SDK'sına doğrudan bağlayan ekipler, fiyatlandırma veya hız sınırı değiştiği anda bu esnekliği kaybeder. Bu sağlayıcıdan bağımsız tasarım, modeli sabit kodlanmış bir bağımlılık değil değiştirilebilir bir arka uç olarak gören [agent odaklı geliştirici araçları](/tr/posts/agent-odakli-gelistirici-araclari) eğiliminin bir parçasıdır.

## Hata ve İptal (Cancellation) Nasıl Yönetilir?

`useChat`, istek başarısız olduğunda bir `error` nesnesi, akan üretimi yarıda kesmek için de bir `stop` fonksiyonu sunar; bunlar farklı gereklidir çünkü bir ağ kopması ile sağlayıcının 500 hatası dönmesi birbirinden ayrı ele alınması gereken hata türleridir. İptal butonundan `stop()` çağırın, `error` doluysa boş ekran yerine yeniden deneme seçeneği gösterin.

```tsx
const { error, reload } = useChat({ api: "/api/chat" });

if (error) {
  return (
    <div>
      <p>Bir şeyler ters gitti.</p>
      <button onClick={() => reload()}>Yeniden Dene</button>
    </div>
  );
}
```

Sunucu tarafında route handler'ın `req.signal`'ını `streamText`'e aktarın; böylece istemci isteği iptal ettiğinde model çağrısı da gerçekten durur, kimsenin görmeyeceği bir yanıt için token harcanmaz. Bu kes-ve-devam-et deseni, Next.js'in [kısmi ön render (Partial Prerendering)](/tr/posts/kismi-on-render-statik-dinamik) yaklaşımındaki statik ve dinamik içerik karışımına benzer; her ikisi de sayfanın veya mesajın tamamını bloklamak yerine hazır olmayan kısmı geriye bırakır.

Sohbet, kendi dokümanlarınızdan değil genel bilgiden yanıt veriyorsa route handler'ın arkasına bir [RAG sistemi](/tr/posts/rag-sistemi-nasil-kurulur) eklemeniz gerekir; `useChat` tarafındaki kod bu durumda hiç değişmez. Route handler'ı hangi sunucu çalışma zamanında barındıracağınızı seçmek de akış performansı için önemlidir; bu konudaki ayrıntılar için [Bun mu Node.js mi](/tr/posts/bun-mu-nodejs-mi-2026-runtime) karşılaştırmamıza bakabilirsiniz.

Üretime çıkmadan önce gözden geçirilmesi gereken birkaç nokta daha var. `edge` çalışma zamanı düşük gecikme için iyi bir varsayılandır, ama uzun süren tool calling zincirlerinde zaman aşımı sınırlarına dikkat etmek gerekir; böyle bir senaryoda `nodejs` çalışma zamanına geçmek daha güvenli olabilir. Ayrıca her route handler'a temel bir hız sınırlama (rate limiting) katmanı eklemek, tek bir kullanıcının modelin tüm bütçesini tüketmesini önler — bu kontrolü `useChat` değil, sunucu tarafı route handler üstlenir. Son olarak, akan mesajları kalıcı bir veritabanına yazmak isterseniz bunu `streamText`'in `onFinish` geri çağrısında yapmak, akışı yavaşlatmadan sohbet geçmişini saklamanın en temiz yoludur.

## Sıkça Sorulan Sorular

### Vercel AI SDK ücretsiz mi?
Evet; `ai` paketi MIT lisansı altında açık kaynaklıdır ve kullanımı ücretsizdir, ödediğiniz tek şey arkadaki model sağlayıcısının API kullanım bedelidir, SDK'nın kendisi için ayrı bir lisans ücreti yoktur.

### Vercel AI SDK sadece Next.js ile mi çalışır?
Hayır; AI SDK UI kancaları React, Next.js, Vue, Svelte ve Nuxt için bağlayıcılar sunar, dolayısıyla aynı akış deseni Next.js dışında da çalışır. Next.js route handler'ları ise ikisi de Vercel'den geldiği için en yaygın sunucu eşleşmesidir.

### OpenAI ile de kullanabilir miyim, yoksa sadece Anthropic mi destekleniyor?
Evet; SDK tek bir arayüzün arkasında 25'ten fazla sağlayıcıyı destekler, bu yüzden `streamText` çağrısındaki `anthropic(...)` ifadesini `openai(...)` veya bir Google modeliyle değiştirmek yeterlidir, istemci tarafında hiçbir kod değişmez.

### Yapay zeka akışı için neden WebSocket değil SSE kullanılıyor?
SSE bu kullanım durumu için daha basittir, çünkü veri yalnızca tek yönde -sunucudan istemciye- düz HTTP üzerinden akar ve tarayıcı tarafında yeniden bağlanma hazır gelir; WebSocket'in getirdiği çift yönlü karmaşıklığa tek yönlü bir sohbet yanıtının ihtiyacı yoktur.
