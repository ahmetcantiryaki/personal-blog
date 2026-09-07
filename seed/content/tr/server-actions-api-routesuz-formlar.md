---
title: "Server Actions: API Route'suz Formlar"
slug: "server-actions-api-routesuz-formlar"
translationKey: "react-server-actions-forms-2026"
locale: "tr"
excerpt: "Kısa cevap: React 19'un Server Actions'ı, formu doğrudan bir sunucu fonksiyonuna bağlar; ayrı bir API route, client fetch ya da elle state yönetimi gerekmez."
category: "web-development"
tags: ["react", "nextjs", "frontend", "server-components"]
publishedAt: "2026-09-07"
seoTitle: "React Server Actions ile API Route'suz Form Rehberi"
seoDescription: "React 19'da Server Actions ile form nasıl kurulur? useActionState, useFormStatus, Zod doğrulama ve progressive enhancement'ı örneklerle anlatıyoruz."
---

Kısa cevap: React 19'un Server Actions'ı, bir formu `<form action={sunucuFonksiyonu}>` ile doğrudan sunucuda çalışan bir fonksiyona bağlar. Ayrı bir API route yazmana, client tarafında `fetch` çağırmana ya da yükleme/hata durumunu elle `useState` ile yönetmene gerek kalmaz — React bunları `useActionState` ve `useFormStatus` üzerinden senin yerine yönetir.

## Server Actions ne yerine geçiyor?

Önceki kalıpta bir form gönderimi genelde üç parça gerektiriyordu: bir API route handler'ı, client'ta o route'a `fetch` yapan bir fonksiyon ve pending/error durumlarını tutan elle yazılmış state. Server Actions bu üçünü tek bir fonksiyona indiriyor: `'use server'` direktifiyle işaretlenmiş bir fonksiyon, formun `action` prop'una doğrudan verilir ve React submit sırasında onu çağırır. React 19, Aralık 2024'te stabil olarak yayınlandı; 2026 ortası itibarıyla en güncel yama sürümü 19.2.7 ve bir React 20 duyurusu yok — yani bu API artık "yeni" değil, React'ın kendisi.

## useActionState ile bir formu uçtan uca nasıl kurarsın?

`useActionState`, bir Action fonksiyonu alır ve sarmalanmış bir Action ile son durumu döndürür; form gönderildiğinde React bu Action'ı çağırır, pending durumunu, hataları ve iyimser (optimistic) güncellemeleri kendi başına yönetir.

```tsx
'use server'

import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Geçerli bir e-posta girin'),
})

export async function subscribe(prevState: unknown, formData: FormData) {
  const parsed = schema.safeParse({ email: formData.get('email') })
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }
  await saveSubscriber(parsed.data.email)
  return { success: true }
}
```

```tsx
'use client'

import { useActionState } from 'react'
import { subscribe } from './actions'

export function SubscribeForm() {
  const [state, formAction, isPending] = useActionState(subscribe, {})

  return (
    <form action={formAction}>
      <input name="email" type="email" required />
      <button disabled={isPending}>{isPending ? 'Gönderiliyor…' : 'Abone Ol'}</button>
      {state?.error && <p role="alert">{state.error}</p>}
    </form>
  )
}
```

Burada dikkat çeken kısım: hiçbir yerde elle bir `fetch` çağrısı ya da `isLoading` state'i yok. `isPending`, `useActionState`'in üçüncü elemanı olarak doğrudan geliyor.

## useFormStatus ne zaman gerekir, useActionState'ten farkı ne?

`useFormStatus`, en son form gönderiminin durumunu okur ve yalnızca bir formun içindeki bir bileşenden çağrılabilir — formun kendisinden değil. Asıl farkı şu: `useActionState` formu tetikleyen üst bileşende durumu tutarken, `useFormStatus` formun *içine* gömülü, formdan habersiz alt bileşenlerin (örneğin paylaşılan bir `SubmitButton` bileşeni) o durumu okumasını sağlıyor. React 19'da `useFormStatus`'un döndürdüğü nesnede `pending`'in yanında `data`, `method` ve `action` alanları da var; React 19 kullanmıyorsan yalnızca `pending` erişilebilir.

| Hook | Nerede kullanılır | Ne döndürür |
|---|---|---|
| `useActionState` | Formu render eden bileşen | `[state, formAction, isPending]` |
| `useFormStatus` | Form içindeki alt bileşen | `{ pending, data, method, action }` |
| `useOptimistic` | Sunucu cevabını beklemeden UI'ı güncellemek istediğinde | İyimser state ve güncelleme fonksiyonu |

## Progressive enhancement gerçekten çalışıyor mu?

Evet — JavaScript henüz yüklenmemişken bile `<form action={serverAction}>` bir tarayıcı için normal bir form gönderimi gibi davranıyor, çünkü Server Actions altyapı olarak standart bir form POST'una düşüyor. Bu, [React Server Components](/tr/posts/nextjs-react-server-components) mimarisinin doğal bir uzantısı: sunucu tarafı render zaten varsayılan olduğu için form gönderimi de aynı varsayılana uyuyor. Yavaş bir bağlantıda JS henüz interaktif olmadan kullanıcı forma basarsa, form yine de gönderilir — sadece `isPending` ve iyimser güncelleme gibi istemci tarafı iyileştirmeler devreye girmez.

## Bir Server Action'ı test etmek client fetch'e göre nasıl değişiyor?

Server Action'ı test ederken bir HTTP katmanı taklit etmene gerek kalmıyor: fonksiyon düz bir async fonksiyon olduğu için, doğrudan bir `FormData` nesnesiyle çağırıp döndürdüğü state'i doğrulayabilirsin. Bu, mock edilmiş bir `fetch` çağrısı kurup response şeklini elle taklit etmekten daha az kod ve daha az kırılganlık demek — test, gerçek HTTP katmanını değil, doğrudan iş mantığını çalıştırıyor. Aynı fonksiyon hem tarayıcıdan hem test ortamından aynı şekilde çağrıldığı için, iki ayrı test stratejisi kurmana da gerek kalmıyor.

```ts
const formData = new FormData()
formData.set('email', 'gecersiz-eposta')
const result = await subscribe({}, formData)
expect(result.error).toBe('Geçerli bir e-posta girin')
```

## Sunucu tarafı doğrulamayı neden hâlâ yapmalısın?

İstemci tarafı doğrulama yalnızca kullanıcı deneyimi içindir, güvenlik sınırı değildir — form action'a giden herhangi bir istek, tarayıcı arayüzünü tamamen atlayıp doğrudan gönderilebilir. Kural basit: istemciden gelen hiçbir veriye güvenme, her Server Action'ın en üstünde şema doğrulaması (Zod gibi) çalıştır. [RHF + Zod ile erişilebilir React formları](/tr/posts/rhf-zod-erisilebilir-react-formlari) yazımızdaki doğrulama şeması yaklaşımı burada da geçerli — fark, şemanın artık istemci tarafında değil, Server Action'ın ilk satırında çalışması.

## revalidation ve iyimser güncelleme nasıl çalışır?

Bir Server Action veri değiştirdiğinde, React önbelleğe alınmış veriyi otomatik yenilemez — bunun için `revalidatePath` ya da `revalidateTag` çağırman gerekiyor. `useOptimistic`, sunucu cevabı gelmeden UI'ı hemen güncellemek istediğinde devreye giriyor: örneğin bir "beğen" butonuna basıldığında sayaç sunucu cevabını beklemeden anında artar, sunucu hata dönerse React durumu otomatik geri alır. Bu, [React'ta akışkan AI arayüzleri](/tr/posts/reactte-akiskan-ai-arayuzleri-streaming) yazımızda ele aldığımız "kullanıcıya beklemeden geri bildirim ver" prensibinin form mutasyonlarındaki karşılığı.

## Server Actions ile güvenlik konusunda hangi hataya düşülüyor?

En yaygın hata, bir Server Action'ı sadece formdan çağrılacağını varsayıp yetkilendirme kontrolünü atlamak. Gerçekte bir Server Action, altyapı seviyesinde bir HTTP endpoint'idir — doğru parametrelerle doğrudan çağrılabilir, formun render edildiği sayfadan hiç geçmeden. Bu yüzden her Server Action'ın başında oturum kontrolü yapılmalı, tıpkı bir API route'unda yapılacağı gibi:

```tsx
'use server'

export async function deletePost(postId: string) {
  const session = await getSession()
  if (!session?.userId) {
    throw new Error('Yetkisiz')
  }
  const post = await getPost(postId)
  if (post.authorId !== session.userId) {
    throw new Error('Bu gönderiyi silme yetkin yok')
  }
  await deletePostFromDb(postId)
  revalidatePath('/posts')
}
```

Bu üç kontrol — oturum var mı, kaynak var mı, kaynak bu kullanıcıya mı ait — bir API route'ta ne kadar gerekliyse bir Server Action'da da o kadar gerekli. "Zaten formu yalnızca giriş yapmış kullanıcıya gösteriyorum" savunması güvenlik sağlamıyor, çünkü UI'da göstermemek, endpoint'i çağrılamaz yapmıyor.

## Server Actions'ı mevcut bir API route mimarisiyle birlikte nasıl kullanırsın?

Bir uygulamanın çoğu Server Actions'a geçse bile, dışa açık bir API (mobil istemci, webhook, üçüncü taraf entegrasyon) hâlâ ayrı bir route gerektiriyor — Server Actions, React'in kendi form/mutasyon modeline bağlı, genel amaçlı bir HTTP sözleşmesi sunmuyor. Pratik ayrım şu: uygulamanın kendi arayüzünden tetiklenen mutasyonlar (form gönderimi, buton tıklaması) Server Actions'a, dışarıdan çağrılması gereken her şey API route'a gidiyor. İki modeli aynı anda kullanmak yaygın ve beklenen bir kalıp, "ya hep ya hiç" bir seçim değil.

| Senaryo | Doğru araç |
|---|---|
| Uygulama içi form gönderimi | Server Action |
| Mobil uygulamanın çağıracağı endpoint | API route |
| Webhook alıcısı | API route |
| Buton tıklamasıyla tetiklenen mutasyon | Server Action |

Bu ayrımı baştan netleştirmek, bir uygulama büyüdükçe "bu mutasyon nereye yazılmalı" tartışmasını ortadan kaldırıyor. Ekipler genelde ikisini karıştırmaya, örneğin bir Server Action'ı dışarıdan da çağrılabilir hale getirmeye çalıştığında zorlanıyor — Server Actions, React'in kendi form gönderim protokolüne bağlı olduğu için bu kullanım amacının dışına taşındığında beklenmedik davranışlar (örneğin CORS ve content-type uyuşmazlıkları) ortaya çıkabiliyor.

Bu yüzden yeni bir mutasyon eklerken sorulacak ilk soru şu olmalı: bu işlemi yalnızca kendi arayüzüm mü tetikleyecek, yoksa başka bir istemci de mi çağırabilmeli? Cevap "yalnızca kendi arayüzüm" ise Server Action doğru varsayılan; "evet, başka istemciler de" ise baştan bir API route yazmak, sonradan geçiş yapmaktan daha az sürtünme yaratıyor.

## Sıkça Sorulan Sorular

### Server Actions hangi React ve Next.js sürümünde kullanılabilir?

React 19'da stabil, Aralık 2024'ten beri üretimde; Next.js 15 App Router'da doğrudan destekleniyor. 2026 ortası itibarıyla en güncel React yama sürümü 19.2.7 ve API değişmeden kullanılıyor.

### useActionState ile useFormStatus'u aynı formda birlikte kullanabilir miyim?

Evet, ikisi farklı amaçlara hizmet ediyor: `useActionState` formu render eden üst bileşende state ve pending durumunu tutar, `useFormStatus` ise form içine gömülü, paylaşılan bir alt bileşenin (örneğin bir submit butonu) o durumu formdan bağımsız şekilde okumasını sağlar.

### Server Actions API route'ları tamamen gereksiz mi bırakıyor?

Hayır, tamamen değil. Form mutasyonları ve sayfa içi veri değişiklikleri için Server Actions daha az kod gerektiriyor, ama bir mobil uygulamanın ya da üçüncü taraf bir istemcinin çağıracağı genel amaçlı bir API için hâlâ ayrı bir route tanımlamak gerekiyor.

### İstemci tarafı doğrulama varken sunucu tarafı doğrulamaya gerçekten gerek var mı?

Evet, kesinlikle. Bir form action'a giden istek tarayıcı arayüzü tamamen atlanarak doğrudan gönderilebilir, bu yüzden istemci tarafı doğrulama yalnızca deneyimi iyileştirir, güvenliği sağlamaz. Her Server Action, kendi başına, gelen veriyi baştan doğrulamak zorunda.
