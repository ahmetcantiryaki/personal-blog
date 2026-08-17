---
title: "Next.js Uygulamana AI Özelliği Nasıl Eklenir?"
slug: "nextjs-uygulamana-ai-ozelligi-ekle"
translationKey: "nextjs-ai-features-ai-sdk"
locale: "tr"
excerpt: "Kısa cevap: SDK seçin, server action ile akıtın, yapılandırılmış çıktı için Zod kullanın, harcama tavanı olmadan üretime çıkmayın. Beş somut adım."
category: "web-development"
tags: ["nextjs", "react", "ai-tools", "typescript"]
publishedAt: "2026-08-17"
seoTitle: "Next.js'e AI Özelliği Ekleme: Uçtan Uca Rehber"
seoDescription: "Kısa cevap: SDK seçin, server action ile akıtın, yapılandırılmış çıktı için Zod kullanın, harcama tavanı olmadan üretime çıkmayın. Beş somut adım."
---

Kısa cevap: bir Next.js uygulamasına AI özelliği eklemek beş somut karardan oluşuyor: bir AI SDK seçmek, akışı server action ya da route handler üzerinden kurmak, yapılandırılmış çıktı için şema doğrulaması eklemek, maliyet artışını önleyecek bir harcama tavanı koymak ve üretime çıkmadan önce en azından temel bir eval seti yazmak. Bu beşi atlanınca, "hafta sonu prototipi" fatura şoku olarak üretime çıkıyor.

Bu yazı, o beş kararı sırayla ve somut kod örnekleriyle geçiyor.

## Hangi SDK'yı ve modeli seçmeliyim?

Kısa cevap: sağlayıcıdan bağımsız çalışmak istiyorsanız Vercel AI SDK gibi bir soyutlama katmanı; tek bir sağlayıcının en yeni özelliklerine (örneğin Claude'un Managed Agents'ı) doğrudan erişmek istiyorsanız o sağlayıcının kendi SDK'sı mantıklı. AI SDK'nın 6. sürümündeki en büyük mimari değişiklik, API route'lardan React Server Actions'a geçiş: `useChat` hook'u artık `/api/chat` gibi bir uç nokta yerine doğrudan bir server action'a bağlanabiliyor.

SDK iki katmana ayrılıyor: sunucuda çalışan AI SDK Core (`generateText`, `streamText`, `generateObject`) model çağrılarını yönetiyor; istemcide çalışan AI SDK UI (`useChat`, `useCompletion`, `useObject`) akış durumunu, mesaj geçmişini ve arayüz güncellemelerini yönetiyor. Model seçimi için sabit bir tavsiye yok — görevin karmaşıklığına göre karar verin ve maliyeti erken ölçün.

## Server action üzerinden akışı nasıl kurarım?

Kısa cevap: `streamText`'i bir server action içinde çağırıp sonucu `useChat`'e bağlayın; route handler'a ihtiyacınız yok. Aşağıdaki örnek, minimal bir uçtan uca kurulumu gösteriyor:

```typescript
// app/actions.ts
'use server'
import { streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'

export async function chat(messages: { role: string; content: string }[]) {
  const result = streamText({
    model: anthropic('claude-sonnet-5'),
    messages,
  })
  return result.toUIMessageStreamResponse()
}
```

```tsx
// app/chat/page.tsx
'use client'
import { useChat } from '@ai-sdk/react'

export default function ChatPage() {
  const { messages, sendMessage, status } = useChat()

  return (
    <div>
      {messages.map((m) => (
        <div key={m.id}>{m.role}: {m.content}</div>
      ))}
      <button
        disabled={status === 'streaming'}
        onClick={() => sendMessage({ text: 'Merhaba' })}
      >
        Gönder
      </button>
    </div>
  )
}
```

`useChat`, mesaj durumunu, giriş durumunu, gönderimi, akış güncellemelerini ve iptali istemci tarafında otomatik yönetiyor — siz yalnızca arayüzü yazıyorsunuz. Token akışının React tarafında düzen sıçraması yaşamadan render edilmesi ayrı bir konu; bunu [React'te akışkan AI arayüzleri yazımızda](/tr/posts/reactte-akiskan-ai-arayuzleri-streaming) ayrıntılı işledik.

## Araç çağrısı ve yapılandırılmış çıktıyı nasıl güvenilir hale getiririm?

Kısa cevap: modelin JSON döndüreceğini ummak yerine bir Zod şeması tanımlayın ve SDK'nın çıktıyı o şemaya zorlamasını sağlayın. AI SDK 6, `generateObject` ve `streamObject` fonksiyonları üzerinden Zod şema doğrulamasını doğrudan model çağrısına entegre ediyor:

```typescript
import { generateObject } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { z } from 'zod'

const { object } = await generateObject({
  model: anthropic('claude-sonnet-5'),
  schema: z.object({
    baslik: z.string(),
    oncelik: z.enum(['dusuk', 'orta', 'yuksek']),
    etiketler: z.array(z.string()),
  }),
  prompt: 'Bu destek talebini sınıflandır: "Ödeme sayfası 500 hatası veriyor."',
})
```

Bu, LLM çıktısını doğrudan bir formda ya da veritabanı yazmasında kullanmak istediğiniz her senaryoda, elle JSON ayrıştırma ve hata düzeltme kodunu ortadan kaldırıyor.

## Maliyet artışını nasıl önlerim?

Kısa cevap: kullanıcı başına ve organizasyon başına sert bir harcama tavanı koyun, sadece rate limiting'e güvenmeyin — rate limiting istek sıklığını sınırlar ama tek bir uzun bağlamlı isteğin maliyetini sınırlamaz. Pratikte üç katman gerekiyor:

| Katman | Ne yapıyor | Nerede uygulanır |
|---|---|---|
| Rate limiting | Dakika/saat başına istek sayısını sınırlar | Middleware ya da edge fonksiyon |
| Token bütçesi | İstek başına maksimum girdi/çıktı token'ı | `maxOutputTokens` parametresi |
| Kullanıcı bazlı harcama tavanı | Kullanıcı/organizasyon başına aylık toplam maliyeti sınırlar | Uygulama veritabanında sayaç |

Prompt önbellekleme de burada gözden kaçan bir maliyet kolu: sabit sistem promptlarını önbellekleyerek tekrarlayan isteklerde girdi maliyetini önemli ölçüde düşürebiliyorsunuz. Maliyet zaten kontrolden çıkmışsa, [LLM token maliyetini düşürme yazımız](/tr/posts/llm-token-maliyetini-dusurme) somut taktikler sunuyor.

## Üretime çıkmadan önce ne test etmeliyim?

Kısa cevap: en azından modelin yanıtlarının beklenen formatta ve kalitede olduğunu doğrulayan küçük bir eval seti yazın — birim testlerin LLM çıktısı için yaptığı işin karşılığı bu. Basit bir eval, temsili 10-20 promptu çalıştırıp çıktıyı bir kural setine (uzunluk, ton, yasaklı kelimeler, şema uyumu) karşı kontrol etmekten ibaret olabilir; karmaşık projelerde bu bir LLM-hakem'e de genişleyebiliyor. [LLM çıktılarını değerlendirme yazımız](/tr/posts/llm-ciktilari-degerlendirme) bu sürecin ayrıntısına giriyor.

Geri dönüş (fallback) planı da eval kadar önemli: model API'si zaman aşımına uğradığında ya da hız sınırına takıldığında kullanıcı ne görecek? "Şu anda bu özellik kullanılamıyor, tekrar deneyin" gibi net bir hata mesajı, sessizce takılıp kalan bir yükleme göstergesinden çok daha iyi.

## 2026'da yeni olan ne?

Dürüst görüşüm şu: bu alandaki en pratik 2026 eklentisi Vercel Workflows — sunucusuz AI ajanlarının en büyük kısıtını, fonksiyon zaman aşımını çözüyor. Workflows, ajan görevlerini adlandırılmış adımlara bölüyor; bu adımlar askıya alınabiliyor, harici bir olayı bekleyebiliyor ve bağlamı kaybetmeden birden fazla fonksiyon çağrısı boyunca kaldığı yerden devam edebiliyor. Uzun süren bir RAG hattı ya da çok adımlı bir ajan kuruyorsanız, tek bir serverless fonksiyonun zaman aşımı sınırına çarpmadan önce Workflows'u değerlendirmek mantıklı — bu tür daha ağır altyapılar kuracaksanız [RAG sistemi kurma rehberimiz](/tr/posts/rag-sistemi-nasil-kurulur) doğal bir sonraki adım.

## Prompt'ları kod deposunda mı, ayrı bir yerde mi tutmalıyım?

Kısa cevap: sistem promptlarını uygulama koduyla birlikte, versiyon kontrolünde tutun; kullanıcıya özel ya da sık değişen promptları ayrı bir yapılandırma katmanında. Sistem promptunu koddan ayırıp bir yönetim panelinden düzenlenebilir hale getirmek başta esnek görünüyor, ama pratikte iki sorun çıkarıyor: prompt değişikliği artık kod incelemesinden geçmiyor ve hangi prompt sürümünün hangi üretim davranışına yol açtığını geriye dönük izlemek zorlaşıyor.

Orta yol, sistem promptlarını uygulama deposunda ayrı `.md` ya da `.txt` dosyaları olarak tutup, her değişikliği normal bir pull request akışından geçirmek. Bu, prompt değişikliğini kod değişikliği kadar ciddiye almanızı sağlıyor — çünkü genellikle öyle de davranıyor: bir prompt değişikliği, modelin davranışını bir kod değişikliği kadar (bazen daha fazla) etkileyebiliyor.

Bunun bir sonucu da geriye dönük izlenebilirlik: bir kullanıcı "geçen hafta bu özellik farklı davranıyordu" dediğinde, prompt deposundaki commit geçmişi, hangi değişikliğin ne zaman yapıldığını saniyeler içinde gösteriyor. Prompt bir yönetim panelinde tutulduğunda bu iz genelde kayboluyor ya da ayrı bir denetim sistemine ihtiyaç duyuyor.

Gerçekten sık değişen ve teknik olmayan ekiplerin düzenlemesi gereken promptlar (örneğin bir pazarlama ekibinin yazdığı ton talimatları) için ayrı bir yapılandırma katmanı hâlâ mantıklı — ama bu katmanın da kendi versiyon geçmişini tutması, "kim ne zaman değiştirdi" sorusunu koddan ayrı da olsa cevaplayabilmesi gerekiyor.

## Yayına almadan önce neyi kontrol etmeliyim?

1. SDK ve model seçimini görev karmaşıklığına göre yapın, varsayılan olarak en pahalı modeli seçmeyin.
2. Akışı server action ya da route handler üzerinden kurup istemci tarafında `useChat`/`useObject` ile tüketin.
3. Yapılandırılmış çıktı gereken her yerde Zod şeması kullanın, elle JSON ayrıştırmayın.
4. Rate limiting + token bütçesi + kullanıcı bazlı harcama tavanını üç ayrı katman olarak kurun.
5. En azından temel bir eval seti ve net bir hata/geri dönüş mesajı olmadan üretime çıkmayın.

## Sıkça Sorulan Sorular

### Next.js'te AI özelliği eklemek için API route mu server action mı kullanmalıyım?

Server action, özellikle AI SDK 6 ile — `useChat` artık doğrudan bir server action'a bağlanabiliyor ve ayrı bir `/api/chat` uç noktası kurmanıza gerek kalmıyor. Route handler hâlâ geçerli bir seçenek, ama server action daha az kod ve daha az katman gerektiriyor.

### LLM'den güvenilir JSON çıktısı nasıl alırım?

Modelin doğru JSON döndüreceğini ummak yerine bir Zod şeması tanımlayın ve `generateObject` ya da `streamObject` fonksiyonlarını kullanın; SDK çıktıyı şemaya zorluyor, böylece elle ayrıştırma ve hata düzeltme koduna ihtiyacınız kalmıyor.

### AI özelliğinin maliyetini nasıl kontrol altında tutarım?

Üç katman kurun: istek sıklığını sınırlayan rate limiting, istek başına maksimum token belirleyen bir token bütçesi ve kullanıcı/organizasyon başına aylık toplam maliyeti sınırlayan bir harcama tavanı. Yalnızca rate limiting'e güvenmek, tek bir uzun bağlamlı isteğin maliyetini sınırlamıyor.

### Üretime çıkmadan önce AI özelliğimi nasıl test etmeliyim?

En azından temsili 10-20 promptu çalıştırıp çıktıyı bir kural setine (uzunluk, ton, şema uyumu) karşı kontrol eden küçük bir eval seti yazın. Bu, birim testlerin geleneksel kod için yaptığı işi LLM çıktısı için karşılıyor.
