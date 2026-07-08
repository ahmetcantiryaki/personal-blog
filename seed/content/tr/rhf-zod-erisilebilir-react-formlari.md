---
title: "RHF ve Zod ile Erişilebilir React Formları"
slug: "rhf-zod-erisilebilir-react-formlari"
translationKey: "react-hook-form-zod-forms"
locale: "tr"
excerpt: "Bozuk bir kayıt formunu React Hook Form ve Zod ile kurma hikayesi: şema doğrulama, onBlur modu, aria-invalid, role=alert ve sunucu tarafı tekrar kullanım."
category: "web-development"
tags: ["react", "accessibility", "frontend", "best-practices"]
publishedAt: "2026-07-08"
seoTitle: "RHF ve Zod ile Erişilebilir React Formları (2026)"
seoDescription: "React Hook Form ve Zod ile erişilebilir kayıt formu nasıl kurulur: şema doğrulama, onBlur modu, aria-invalid, role=alert ve sunucu tarafı şema tekrar kullanımı."
---

Erişilebilir bir React formu kurmanın kısa yolu şu: Zod ile veri şemasını tek yerde tanımlayın, `@hookform/resolvers/zod` ile React Hook Form'a (RHF) bağlayın, `mode: 'onBlur'` kullanarak her tuş vuruşunda değil kullanıcı alandan çıktığında doğrulayın, hataları `aria-invalid` ve `role="alert"` ile ekran okuyuculara duyurun ve aynı şemayı sunucuda tekrar çalıştırın. Bu yazı, gerçek bir kayıt formunu bu sırayla onarmanın hikayesi.

## Kayıt formunun bozukluğunu fark etmek

Geçen ay elime geçen kayıt formu, işlevsel açıdan çalışıyordu ama kimse onu ekran okuyucuyla test etmemişti. E-posta alanına yanlış bir değer yazıp Tab'a bastığınızda hiçbir şey olmuyordu; hata mesajı görsel olarak kırmızı bir metinle görünüyordu ama DOM'da inputla hiçbir ilişkisi yoktu. Daha kötüsü, doğrulama her tuş vuruşunda tetikleniyordu, yani kullanıcı daha adını yazarken "bu alan zorunludur" uyarısı ekranda beliriyor, sonra kayboluyor, sonra tekrar beliriyordu. Bir NVDA oturumuyla denediğimde bu gürültü resmen dayanılmazdı: her harfte yeni bir anons.

Sorunun kökü üç yerdeydi: doğrulama mantığı bileşenin içine saçılmıştı, doğrulama zamanlaması yanlıştı ve hata mesajları erişilebilirlik ağacına hiç bağlanmamıştı. Formu sıfırdan, bu üç sorunu aynı anda çözecek şekilde kurmaya karar verdim.

## Zod şemasını tanımlamak

İlk adım, form verisinin şeklini ve kurallarını tek bir yerde, TypeScript tipleriyle uyumlu şekilde tanımlamaktı. [Zod](https://zod.dev), bunu şaşırtıcı derecede az kodla yapıyor:

```ts
// schemas/signup.ts
import { z } from 'zod'

export const signupSchema = z.object({
  fullName: z.string().min(2, 'Ad soyad en az 2 karakter olmalı'),
  email: z.string().email('Geçerli bir e-posta adresi girin'),
  password: z
    .string()
    .min(8, 'Şifre en az 8 karakter olmalı')
    .regex(/[0-9]/, 'Şifre en az bir rakam içermeli'),
})

export type SignupInput = z.infer<typeof signupSchema>
```

Bu şemanın güzelliği, aynı dosyanın hem istemcide hem sunucuda kullanılabilmesi. Tek bir doğruluk kaynağı, tek bir hata mesajı seti.

## @hookform/resolvers/zod'u bağlamak

Şema hazır olunca, onu React Hook Form'a bağlamak tek satır: `zodResolver`. [@hookform/resolvers](https://github.com/react-hook-form/resolvers) paketi Zod dahil onlarca doğrulama kütüphanesi için köprü sağlıyor, biz sadece Zod sürümünü kullanıyoruz:

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema, type SignupInput } from '@/schemas/signup'

const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<SignupInput>({
  resolver: zodResolver(signupSchema),
  mode: 'onBlur',
})
```

Burada dikkat çeken tek satır `mode: 'onBlur'`. [React Hook Form dokümantasyonu](https://react-hook-form.com/docs/useform) `mode` seçeneğinin doğrulamanın ne zaman tetikleneceğini belirlediğini söylüyor; varsayılan `onSubmit` iken, `onChange`, `onBlur`, `onTouched` ve `all` gibi alternatifler de var. Bizim eski formumuz farkında olmadan `onChange` davranışına yakın bir şey yapıyordu ve bu, ekran okuyucu kullanıcıları için tam olarak yukarıda anlattığım gürültüyü üretiyordu.

## Neden onBlur: sakin bir doğrulama modu

Doğrulama zamanlaması sadece geliştirici tercihi değil, doğrudan bir erişilebilirlik kararı. Kullanıcı bir alana daha yazarken hata göstermek, erken ve gereksiz bir uyarı anlamına geliyor; alandan ayrıldıktan sonra göstermek ise kullanıcıya "bitirdiğini düşündüğün an" geri bildirim veriyor.

| Mod | Ne zaman tetiklenir | Erişilebilirlik / UX etkisi |
|---|---|---|
| `onChange` | Her tuş vuruşunda | Erken hata, ekran okuyucuda gürültülü ve yorucu anonslar |
| `onBlur` | Alandan çıkışta | Sakin, kullanıcı alanı "bitirdiğinde" tek anons |
| `onTouched` | İlk blur'dan sonra her değişiklikte | onBlur'a yakın ama düzeltme sırasında anlık geri bildirim verir |
| `onSubmit` | Sadece gönderimde | Uzun formlarda kullanıcıyı tek seferde çok hatayla karşılaştırır |

Biz `onBlur` seçtik çünkü kayıt formu kısa ve kullanıcı bir alanı doldurup diğerine geçtiğinde net bir "bitirdim" sinyali veriyor. Daha uzun, çok adımlı formlarda `onTouched` genelde daha iyi bir denge kurar: kullanıcı bir hatayı düzeltmeye başladığında anında geri bildirim alır ama ilk yazarken rahatsız edilmez.

## Hataları erişilebilir kılmak: aria-invalid ve role="alert"

Doğrulama zamanlaması doğru olsa bile, hata mesajı DOM'da inputla ilişkilendirilmemişse ekran okuyucu kullanıcısı için hâlâ görünmez. [MDN'nin aria-invalid dokümantasyonu](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-invalid), bir kontrolün geçersiz olduğunu ekran okuyuculara bildirmek için `aria-invalid="true"` kullanılması gerektiğini, hatanın kendisininse `aria-describedby` ile inputa bağlanması gerektiğini belirtiyor. Hata metnini içeren öğeye `role="alert"` eklemek ise mesajın odak taşınmadan otomatik olarak anons edilmesini sağlıyor:

```tsx
<label htmlFor="email">E-posta</label>
<input
  id="email"
  type="email"
  aria-invalid={errors.email ? 'true' : 'false'}
  aria-describedby={errors.email ? 'email-error' : undefined}
  {...register('email')}
/>
{errors.email && (
  <p id="email-error" role="alert">
    {errors.email.message}
  </p>
)}
```

Bu üç parça birlikte çalışıyor: `aria-invalid` alanın durumunu bildiriyor, `aria-describedby` hata metnini alanla eşliyor, `role="alert"` da mesaj DOM'a girdiği an duyuruyor. Üçünden biri eksik olsa hata görsel olarak dursa bile ekran okuyucu kullanıcısına ulaşmıyor.

Bu davranışı bir kere elle test edip geçmek yeterli değil; regresyonu yakalamak için Testing Library ile otomatik bir test yazmaya değer. `screen.getByRole('alert')` sorgusu, hata mesajının gerçekten erişilebilirlik ağacında bir "alert" olarak göründüğünü doğruluyor — sadece kırmızı bir `<p>` etiketinin DOM'da durup durmadığını değil. Böyle bir test, biri ileride `role="alert"`'ü yanlışlıkla silerse CI'da hemen kırılır; erişilebilirliği "bir kere kontrol edip unutulan" bir madde olmaktan çıkarıp normal test paketinin parçası hâline getirir.

Burada itiraf etmemiz gereken biraz rahatsız edici bir gerçek var: çoğu ekip erişilebilirliği, doğrulama mantığı bittikten sonra üzerine yapıştırılan bir son rötuş gibi görüyor; oysa erişilebilirlik en baştan, hangi doğrulama modunu seçtiğinizden hata mesajlarını nasıl DOM'a bağladığınıza kadar, doğrulama stratejisinin kendisini şekillendirmeli. Sonradan eklenen `aria-invalid`, genelde eksik `aria-describedby` ile birlikte gelir.

## Aynı şemayı sunucuda tekrar kullanmak

İstemci tarafı doğrulama ne kadar iyi olursa olsun, sunucuya doğrudan istek atan biri onu tamamen atlayabilir. Savunma derinliği için `signupSchema`'yı sunucu tarafında da çalıştırmak gerekiyor; Next.js gibi bir ortamda bu, aynı dosyayı bir API route veya server action içinde `parse` etmek kadar basit:

```ts
// app/api/signup/route.ts
import { signupSchema } from '@/schemas/signup'

export async function POST(req: Request) {
  const body = await req.json()
  const result = signupSchema.safeParse(body)

  if (!result.success) {
    return Response.json(
      { errors: result.error.flatten().fieldErrors },
      { status: 400 },
    )
  }

  // result.data artık tip güvenli ve doğrulanmış
}
```

Bu, aynı kuralları iki kere yazmadığınız anlamına geliyor: istemcide RHF + Zod, sunucuda çıplak Zod. İki tarafta da hata mesajları tutarlı kalıyor çünkü kaynak tek.

## Etiket eşleştirme tuzakları

Şemayı ve ARIA özniteliklerini doğru kursanız bile, temel HTML eşleştirmesi bozuksa hiçbiri işe yaramıyor. En sık gördüğüm üç hata:

- `label`'ın `htmlFor`'u ile input'un `id`'si eşleşmiyor; ekran okuyucu etiketi hiç okumuyor.
- Hata metni sayfada duruyor ama `aria-describedby` ile inputa bağlanmamış; görme engelli olmayan kullanıcı görüyor, ekran okuyucu kullanıcısı görmüyor.
- Placeholder, label yerine kullanılıyor; alan odaklandığında placeholder kayboluyor ve kullanıcı neyi doldurduğunu unutuyor.

Bu tuzaklardan kaçınmak, genel bir [web erişilebilirlik kontrol listesi](/tr/posts/web-erisilebilirlik-kontrol-listesi) üzerinden formu adım adım gözden geçirmeyi gerektiriyor; form doğrulama sadece o listenin bir parçası.

Kayıt formunu düzelttikten sonra fark ettiğim bir şey daha oldu: bazı kullanıcılar için en erişilebilir kayıt deneyimi şifre alanının kendisini kaldırmak. Şifre yerine [passkey ve WebAuthn](/tr/posts/passkey-webauthn-rehberi) tabanlı bir akış sunmak, hem doğrulama yükünü azaltıyor hem de hafıza gerektiren bir adımı ortadan kaldırıyor. Form hâlâ var olan projeler için ise yukarıdaki desen sağlam bir temel.

Bu deseni büyük bir forma taşırken form durumunu nerede tuttuğunuz da önemli hale geliyor; [React durum yönetimi karşılaştırmamız](/tr/posts/react-state-yonetimi-karsilastirma) çok adımlı formlarda RHF'nin kendi state'i ile global state çözümleri arasındaki farkı ele alıyor. Formu bir sunucu bileşeninin içine yerleştirecekseniz [Next.js 15'te React Server Components](/tr/posts/nextjs-react-server-components) yazımız, doğrulamanın istemci ve sunucu arasında nasıl bölüneceğini netleştiriyor.

Temmuz 2026 itibarıyla bu üçlü — Zod şeması, `zodResolver`, `onBlur` modu — React ekosisteminde form doğrulama için fiilen standart hale geldi; ekip içi tartışmalarda artık "neden Zod" değil "hangi doğrulama modu" sorusu soruluyor. Daha fazla desen için [Web Geliştirme kategorisi](/tr/category/web-gelistirme) sayfamıza göz atabilirsiniz.

## Sıkça Sorulan Sorular

### RHF ve Zod yerine Formik ve Yup kullanmalı mıyım?

İkisi de çalışıyor ama Zod'un TypeScript çıkarımı (`z.infer`) ve daha küçük paket boyutu, yeni projelerde RHF + Zod'u varsayılan tercih haline getirdi. Mevcut bir Formik + Yup kod tabanınız sağlıklı çalışıyorsa göçe gerek yok.

### mode: 'onBlur' her form için doğru mu?

Kısa formlarda evet. Çok adımlı veya uzun formlarda `onTouched` genelde daha iyi bir denge kuruyor çünkü kullanıcı bir hatayı düzeltirken anlık geri bildirim almaya devam ediyor.

### aria-invalid'i her zaman false olarak mı başlatmalıyım?

Kullanıcı henüz hiçbir şey yazmadıysa `aria-invalid` özniteliğini hiç eklememek daha güvenli; aksi halde boş, dokunulmamış bir zorunlu alanı erken "geçersiz" olarak işaretlemiş olursunuz.

### Sunucu tarafı doğrulamayı gerçekten atlayabilir miyim?

Hayır. İstemci doğrulaması sadece kullanıcı deneyimi içindir; API'ye doğrudan istek atan herkes onu atlayabilir. Aynı Zod şemasını sunucuda çalıştırmak, savunma derinliğinin olmazsa olmaz parçası.
