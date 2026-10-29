---
title: "React useOptimistic ile İyimser Arayüz"
slug: "react-useoptimistic-ile-iyimser-arayuz"
translationKey: "optimistic-ui-react-useoptimistic"
locale: "tr"
excerpt: "Kısa cevap: useOptimistic, sunucu yanıtı gelmeden arayüzü güncelleyip bekleme hissini gizler; sunucu reddederse state otomatik olarak gerçek değere döner."
category: "web-development"
tags: ["react", "nextjs", "frontend", "performance"]
publishedAt: "2026-10-29"
seoTitle: "React useOptimistic Hook'u Nasıl Kullanılır?"
seoDescription: "useOptimistic'i Server Actions ile kullanarak anında güncellenen, hata durumunda doğru geri dönen bir iyimser arayüz nasıl kurulur, burada gösteriyoruz."
---

Kısa cevap: `useOptimistic(state, updateFn)`, bir Action içinde çağrıldığında arayüzü sunucu yanıtı gelmeden hemen güncelliyor ve gerçek sonuç geldiğinde (veya işlem başarısız olduğunda) state'i otomatik olarak doğru değere geri döndürüyor. React 19 gerektiriyor ve çağrısı mutlaka bir `startTransition` veya Server Action gibi bir Action içinde olmalı, yoksa hook geçtiğiniz değeri olduğu gibi döndürür.

## İyimser arayüz tam olarak neyi gizliyor?

Bir kullanıcı bir butona bastığında, sunucudan yanıt gelene kadar geçen 200-800 milisaniyelik gecikme, arayüzde hiçbir şey değişmezse "tıkladım mı, çalıştı mı" belirsizliği yaratıyor. İyimser arayüz, bu gecikmeyi sunucuya hiç sormadan "muhtemelen başarılı olacak" varsayımıyla anında göstererek gizliyor — beğeni butonları, yapılacaklar listesi öğeleri ve yorum gönderimi gibi geri dönüşü kolay ve başarı olasılığı yüksek eylemlerde bu varsayım neredeyse her zaman doğru çıkıyor.

Bunun "sahte bir hız" olmadığını vurgulamak gerekiyor: arayüz sunucudan gelecek gerçek sonucu tahmin ediyor, onu icat etmiyor. Sunucu isteği reddederse, `useOptimistic` o tahmini geri alıp kullanıcıya gerçek durumu gösteriyor — bu yüzden hook'un adı "optimistic" (iyimser), "sahte" değil.

## useOptimistic bir Server Action ile birlikte nasıl çalışır?

`useOptimistic(value, reducer?)` imzası, geçerli state'i ve isteğe bağlı bir reducer fonksiyonunu alıp `[optimisticState, setOptimistic]` çiftini döndürüyor. Reducer verilmezse, `setOptimistic`'e geçirdiğiniz değer doğrudan iyimser state olarak kullanılıyor; reducer veriliyorsa, mevcut state ile eylemi alıp yeni iyimser state'i hesaplayan saf bir fonksiyon olması gerekiyor.

```tsx
"use client"
import { useOptimistic } from "react"
import { likePost } from "./actions"

type Post = { id: string; likes: number; likedByMe: boolean }

export function LikeButton({ post }: { post: Post }) {
  const [optimisticPost, setOptimisticPost] = useOptimistic(
    post,
    (state, newLiked: boolean) => ({
      ...state,
      likedByMe: newLiked,
      likes: newLiked ? state.likes + 1 : state.likes - 1,
    })
  )

  return (
    <form
      action={async () => {
        setOptimisticPost(!optimisticPost.likedByMe)
        await likePost(post.id, !optimisticPost.likedByMe)
      }}
    >
      <button type="submit">
        {optimisticPost.likedByMe ? "Beğenildi" : "Beğen"} ({optimisticPost.likes})
      </button>
    </form>
  )
}
```

Burada kritik nokta, `setOptimisticPost`'un bir Server Action'ı çağıran `form action`'ın içinde çalışması — React, bunu bir Action olarak tanıyıp gerçek sonuç gelene kadar iyimser state'i gösteriyor. Action dışında çağrılan `setOptimistic`, hook'un normal davranışını tetiklemiyor.

## Geçici iyimser state, sunucu sonucuyla nasıl uzlaşıyor?

Sunucudan gelen gerçek değer (bu örnekte `post` prop'u güncellenince), React iyimser state'i gerçek state ile otomatik olarak değiştiriyor — siz manuel bir "temizleme" adımı yazmıyorsunuz. Bu uzlaşma, Action tamamlandığında ve bileşen gerçek veriyle yeniden render edildiğinde kendiliğinden gerçekleşiyor; `revalidatePath` veya benzeri bir yeniden doğrulama çağrısı, bu gerçek veriyi sunucudan tazeleyip React'in iyimser tahmini bırakmasını sağlıyor.

## Başarısız bir istekte geri alma nasıl yapılır, hata nasıl gösterilir?

Server Action bir hata fırlatırsa veya reddedilen bir sonuç döndürürse, iyimser state otomatik olarak eski (gerçek) değerine geri dönüyor — ama bu geri dönüş sessiz olmamalı. `try/catch` içinde Action'ı sarıp hatayı bir state değişkenine yazmak ve bu değişkeni butonun yanında kısa bir hata mesajı olarak göstermek, kullanıcının "neden beğenim geri gitti" sorusuna cevap veriyor.

| Durum | Arayüzde ne görünür | Kod tarafı |
|---|---|---|
| İstek başarılı | İyimser state, gerçek state ile aynı kalır | Ekstra işlem gerekmez |
| İstek başarısız | State eski değerine döner | `catch` bloğunda hata mesajı state'i ayarla |
| İstek yavaş ama başarılı | İyimser state, gerçek sonuç gelene kadar gösterilir | Varsayılan davranış |

## Hızlı art arda tıklamalarda ne yanlış gidebilir?

Bir kullanıcı beğeni butonuna art arda üç kez tıklarsa, üç ayrı Action tetiklenir ve bunların sunucu yanıtları her zaman gönderildikleri sırayla geri gelmeyebilir — ikinci istek üçüncüden önce gönderilse bile, ağ gecikmesi yüzünden sonra dönebilir. `useOptimistic`'in her çağrısı en güncel iyimser state üzerine kurulduğu için ardışık tıklamalar genelde doğru birikiyor, ama sunucu tarafında da bu isteklerin sırasını değil son durumu esas alan bir mantık (örneğin "beğenildi: evet/hayır" yerine artımlı sayaç kullanmamak) kurmak, yarış durumunu önlüyor.

Bu riski azaltmanın en güvenli yolu, butonu istek tamamlanana kadar devre dışı bırakmak değil — bu iyimser arayüzün amacını baltalar — sunucu tarafındaki mutasyonu idempotent hale getirmek, yani aynı isteğin iki kez gelmesi veya sırası bozulması durumunda da doğru son duruma ulaşmak. Benzer bir asenkron state yönetimi sorununu, bir [React komut paletinde asenkron komut yüklerken](/tr/posts/reactte-komut-paleti-cmd-k-nasil-yapilir) de ele almıştık.

## İyimserliğin tehlikeli olduğu yerler nerede?

Bir ödeme işlemi, bir bakiye güncellemesi veya geri alınamaz bir silme işlemi gibi eylemlerde iyimser arayüz kullanmak, kullanıcıya gerçekleşmemiş bir işlemi gerçekleşmiş gibi göstermek riski taşıyor — "ödemeniz alındı" yazıp sonra "aslında alınamadı" demek, "beğeniniz geri alındı" demekten çok daha pahalı bir güven kaybı. Bu tür eylemlerde doğru yaklaşım, sunucu onayını beklemek ve bu beklemeyi net bir yükleme göstergesiyle iletmek.

Pratik kural şu: eylem kolayca geri alınabiliyorsa ve başarısızlık olasılığı düşükse (`%95+`) iyimser arayüz kullanın; eylem geri alınamıyorsa veya parayla, erişimle ilgiliyse bekleyin. Bu ayrımı [Server Actions ile API Route'suz formlar](/tr/posts/server-actions-api-routesuz-formlar) yazımızdaki form gönderim desenleriyle birlikte düşünmek, hangi formun iyimser olabileceğine karar vermeyi kolaylaştırıyor.

## Başarı yolunu test etmek yeterli mi?

Hayır — çoğu ekip yalnızca "buton tıklanınca sayı anında artıyor mu" testini yazıp geçiyor, ama asıl kritik test sunucunun isteği reddettiği senaryo: state gerçekten eski değerine dönüyor mu, hata mesajı görünüyor mu, buton tekrar denenebilir durumda mı? Bu başarısızlık yolunu test etmeden üretime çıkmak, `useOptimistic`'in en önemli davranışını (geri alma) doğrulamadan bırakıyor.

Bu hook'u [ileri TypeScript kalıplarıyla](/tr/posts/ileri-typescript-kaliplari) birleştirip reducer'ın action tipini bir discriminated union olarak tanımlamak, büyüyen bir uygulamada yanlış bir eylem tipi geçirmeyi derleme zamanında yakalıyor.

## Birden fazla iyimser güncellemeyi aynı listede yönetmek nasıl çalışır?

Bir yapılacaklar listesine art arda üç öğe eklerken her `setOptimistic` çağrısı önceki iyimser state üzerine kurulduğu için, reducer'ın mevcut state'i (önceki öğeleri) alıp üzerine yeni öğeyi eklemesi gerekiyor — `state` parametresini yok sayıp sıfırdan bir dizi oluşturmak, önceki iyimser eklemelerin kaybolmasına yol açıyor. Reducer'ı her zaman gelen `state`'i temel alacak şekilde yazmak (`[...state, newItem]` gibi), bu tür bir listede sıralı eklemelerin doğru birikmesini garanti ediyor.

Silme işlemlerinde de aynı mantık geçerli: bir öğeyi iyimser olarak listeden çıkarırken, reducer'ın mevcut iyimser state'teki diğer öğeleri koruyup sadece hedef öğeyi filtrelemesi gerekiyor. Bu, kullanıcı aynı anda birden fazla öğeyi hızlıca silerken listenin tutarlı kalmasını sağlıyor.

## React Testing Library ile iyimser state nasıl test edilir?

Bir buton tıklamasının hemen ardından (sunucu yanıtı gelmeden) ekranda iyimser değerin göründüğünü doğrulamak için, test ortamında sunucu çağrısını bilerek geciktiren (örneğin `setTimeout` ile sarılmış) bir sahte Server Action kullanmak gerekiyor — gerçek zamanlı bir ağ isteği olmadan iyimser ile gerçek state arasındaki farkı test etmenin tek yolu bu. `fireEvent.click` sonrası senkron bir `expect` ile iyimser değeri, ardından `await waitFor` ile gerçek değeri doğrulamak, iki aşamayı da ayrı ayrı yakalıyor.

Başarısızlık yolunu test etmek için sahte Action'ın bir hata fırlatmasını sağlamak ve ardından ekranda hem hata mesajının göründüğünü hem de state'in eski değerine döndüğünü doğrulamak gerekiyor. Bu testi atlayan ekipler, genelde geri alma mantığının üretimde çalışmadığını ilk kullanıcı şikayetinde öğreniyor.

## Sıkça Sorulan Sorular

### useOptimistic ne zaman kullanılmalı?

Beğeni, yapılacaklar listesi öğesi ekleme veya yorum gönderme gibi, geri dönüşü kolay ve başarı olasılığı yüksek eylemlerde kullanılmalı. Ödeme veya bakiye güncelleme gibi geri alınamaz eylemlerde sunucu onayını beklemek daha güvenli.

### useOptimistic hangi React sürümünü gerektiriyor?

React 19 veya Canary sürümünü gerektiriyor. Hook'un kendisi framework'ten bağımsız çalışıyor, ama örneklerdeki Server Actions ve `revalidatePath` kullanımı Next.js'e özgü.

### Sunucu isteği başarısız olursa iyimser state ne olur?

React, iyimser state'i otomatik olarak gerçek (eski) değere geri döndürüyor. Ama bu geri dönüşü sessiz bırakmamak, hatayı `catch` bloğunda yakalayıp kullanıcıya kısa bir mesaj göstermek gerekiyor.

### Hızlı art arda tıklamalarda state karışır mı?

Genelde karışmaz çünkü her çağrı en güncel iyimser state üzerine kurulur, ama sunucu tarafında isteklerin sırası yerine son durumu esas alan idempotent bir mutasyon yazmak, olası bir yarış durumunu önlüyor.
