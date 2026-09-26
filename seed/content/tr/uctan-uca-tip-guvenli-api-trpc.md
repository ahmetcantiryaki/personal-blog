---
title: "Uçtan Uca Tip Güvenli API'ler: tRPC ve Ötesi"
slug: "uctan-uca-tip-guvenli-api-trpc"
translationKey: "end-to-end-typesafe-apis-2026"
locale: "tr"
excerpt: "Sunucu ve istemci aynı TypeScript monorepo'sundaysa tRPC kullanın; dış veya çok dilli tüketiciler için tipli OpenAPI ya da oRPC, esnek sorgu için GraphQL seçin."
category: "web-development"
tags: ["typescript", "api-design", "backend", "graphql"]
publishedAt: "2026-09-26"
seoTitle: "Uçtan Uca Tip Güvenli API'ler: tRPC ve Ötesi (2026)"
seoDescription: "tRPC, tipli OpenAPI, GraphQL codegen, Server Actions ve oRPC'yi 2026 için karşılaştırıyoruz: hangi yaklaşım hangi durumda doğru, başlangıç tarifiyle."
---

Kısa cevap: sunucu ve istemci tek bir TypeScript monorepo'sunda ve ikisini de siz kontrol ediyorsanız tRPC kullanın; dış veya çok dilli tüketiciler varsa tipli [OpenAPI](https://trpc.io/docs/openapi) ya da [oRPC](https://infoq.com/news/2025/12/orpc-v1-typesafe/) tercih edin; birden fazla istemcinin farklı veri dilimlerine ihtiyaç duyduğu durumda GraphQL codegen daha uygundur. Dördü de API değiştiğinde çalışma zamanı sürprizi yerine derleme zamanı hatası verir.

## Uçtan uca tip güvenliği ne demek?

Uçtan uca tip güvenliği, sunucudaki bir fonksiyonun girdi veya çıktı şekli değiştiğinde bu değişikliğin istemcide, kod hiç çalıştırılmadan, doğrudan bir TypeScript derleme hatasına dönüşmesi demektir. Bu güvenlik olmadan, yeniden adlandırılan bir alan ya da kaldırılan bir özellik sessiz bir çalışma zamanı hatasına dönüşür ve genelde production'da ya da en iyi ihtimalle manuel bir QA turunda ortaya çıkar. Bu güvenlikle birlikte, biri sunucuda `userId` alanını `id` olarak değiştirdiği anda editörünüz kızarır ve derleme, her çağıran nokta düzeltilene kadar başarısız olur.

Pratikteki kazanç şudur: sunucudaki bir refactor istemciyi sessizce bozmaz. Bir alanı yeniden adlandırıp dosyayı kaydettiğinizde IDE'niz güncellenmesi gereken her çağrı noktasını işaretler; sunucunun gönderdiği veri ile arayüzün beklediği veri arasında sürüklenme (drift) oluşmaz. Bu, aynı iki üç mühendisin hem API'ye hem de onu tüketen ekrana aynı pull request içinde dokunduğu hızlı ürün ekiplerinde en çok fark yaratan durumdur.

## tRPC nedir, codegen olmadan tip güvenliğini nasıl sağlar?

tRPC, tipleri sunucu kodundan doğrudan TypeScript'in kendi dil özellikleriyle çıkarır; bu bir tip çıkarımıdır (inference), kod üretimi (codegen) değildir. Sunucuda bir prosedürü bir kez tanımlar, tipini dışa aktarırsınız; istemci bu tipi derleme zamanında, hiçbir codegen adımı çalıştırmadan içe aktarır ve çalışma zamanında sunucuyla normal (toplu/batched) HTTP üzerinden konuşur. API değiştiğinde bir üretici (generator) çalıştırmanız gerekmez; tipler zaten oradadır, çünkü sunucunun sahip olduğu TypeScript tipleriyle aynıdırlar.

Bu, bir OpenAPI dokümanı üretip o dokümandan ikinci, ayrı bir istemci tip kümesi üreten yaklaşımlardan gerçekten farklı bir mekanizmadır. tRPC ara dokümanı tamamen atlar. Minimal bir router ve tip güvenli bir istemci çağrısı şöyle görünür:

```typescript
// server/router.ts
import { z } from "zod";
import { router, publicProcedure } from "./trpc";

export const appRouter = router({
  getUser: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return db.user.findUnique({ where: { id: input.id } });
    }),
});

export type AppRouter = typeof appRouter;
```

```typescript
// client.ts
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../server/router";

const client = createTRPCClient<AppRouter>({
  links: [httpBatchLink({ url: "http://localhost:3000/api/trpc" })],
});

// input ve dönüş tipi otomatik çıkarılır, üretilecek .d.ts yok
const user = await client.getUser.query({ id: "u_123" });
```

`input` şemasına bir `orgId` zorunluluğu eklerseniz, `client.getUser.query({ id: "u_123" })` çağrısı anında derlenmez hale gelir. Bu tek örnek, tRPC'nin bütün değer önerisini özetliyor.

## tRPC mi OpenAPI mi? Yaklaşımlar gerçekte nasıl kıyaslanıyor?

API'nin bütün tüketicileri sizin sahip olduğunuz TypeScript kodu ise, tipik olarak bir monorepo içindeyse, tRPC seçin; dış ekipler, Swift veya Kotlin ile yazılmış mobil uygulamalar ya da API'nizi TypeScript olmayan bir dilde tüketen ortaklarınız varsa tipli OpenAPI (ya da oRPC) seçin. Ayrım çizgisi proje büyüklüğü değil, istemcinin kimin kontrolünde olduğudur.

Tipli OpenAPI + codegen yaklaşımı şöyle işler: sunucunuz (dekoratörler, NestJS gibi bir framework ya da elle yazılmış bir spesifikasyon aracılığıyla) bir OpenAPI dokümanı üretir; `openapi-typescript` gibi bir araç bu dokümanı okuyup istemci tiplerini içeren bir `.d.ts` dosyası üretir. Tasarım gereği çok dillidir; OpenAPI üreticisi olan her dil aynı sözleşmeyi tüketebilir. Ama gerçek bir senkronizasyon sorunu getirir. Ekipler, "codegen'i çalıştırdın mı?" sorununa denk gelen gerçek bir sürtünmeden şikayet ediyor: bir şema değişikliği, biri hatırlayıp üretilen tipleri yeniden oluşturana ve diff'i commit'leyene kadar üretilen tiplere yansımaz; bayat kalmış üretilmiş bir dosya, API'nin gerçek şekli hakkında yalan söylerken sorunsuzca derlenir.

GraphQL artı codegen (GraphQL Code Generator gibi araçlar) farklı bir sorunu çözer: birçok tüketici arasında esnek, istemci güdümlü sorgu şekilleri, tip güvenliğini de üretilen hook'lar ve tipler aracılığıyla sonradan uygulayarak. Bir şema kayıt defteri (schema registry), resolver katmanı ve çoğu zaman bir gateway gerektiren daha ağır bir operasyonel yüktür; tek bir API'niz ve tek bir istemciniz varken değil, aynı veri grafiğinin farklı dilimlerine ihtiyaç duyan birden fazla ön yüz olduğunda karşılığını verir.

Next.js Server Actions gibi framework'e özgü sunucu eylemleri, istemci/sunucu ayrımını neredeyse tamamen ortadan kaldırır: `"use server"` ile işaretlenmiş bir fonksiyon bir React bileşeninden doğrudan çağrılır ve TypeScript bu sınır boyunca tipleri, sanki yerel bir fonksiyon çağrısıymış gibi çıkarır; hiçbir fetch katmanı yoktur. Bu, tRPC'ye benzer çıkarımı daha da az tantanayla verir; bedeli ise bu deseni destekleyen bir framework'e ve birinci taraf render'a kilitlenmektir, mobil bir uygulamadan ya da bir betikten çağırabileceğiniz genel bir HTTP API'ye değil.

oRPC (2025-2026 döngüsünde v1.0'a ulaştı) en yeni oyuncudur ve özellikle bilinmeye değerdir çünkü iki kampın arasındaki boşluğu kapatmaya çalışır: [InfoQ'nun v1 duyurusu haberine](https://infoq.com/news/2025/12/orpc-v1-typesafe/) göre, girdiler, çıktılar ve hatta tipli hatalar için uçtan uca tip güvenliğiyle birlikte birinci sınıf OpenAPI desteği sunuyor. Özetle, tRPC'nin sıfır codegen deneyimini OpenAPI'nin çok dilli tüketici ve araç desteğiyle aynı kütüphanede birleştirmeyi hedefliyor. Eylül 2026 itibarıyla tRPC'ye ya da yerleşik OpenAPI araçlarına kıyasla daha genç ve ekosistemi daha küçük; kolaylığı olgunlukla tartın.

## Bu yaklaşımlar arasındaki gerçek ödünleşimler neler?

Temel ödünleşim, monorepo bağımlılığı ile açık/kamuya açık API kararlılığı arasındadır. tRPC'nin derleme zamanı çıkarımı yalnızca istemcinin bir TypeScript tipini doğrudan sunucu paketinden içe aktarması sayesinde çalışır; bu da istemci ve sunucunun aynı repo'dan, en azından aynı build grafiğinden çıkması ve ikisinin de TypeScript olması gerektiği anlamına gelir. Bu bağı kırdığınızda (bir genel API, mobil bir istemci, bir ortak entegrasyonu) tRPC'nin çekirdek mekanizması artık uygulanamaz; sürüm sınırı olmadan sunucunun iç tiplerini genel bir yüzeye açmış olursunuz.

İkinci eksen servis sınırları ve versiyonlama. Bir OpenAPI dokümanı ya da bir GraphQL şeması diff'leyebileceğiniz, gözden geçirebileceğiniz ve açıkça sürümleyebileceğiniz bir sözleşme nesnesidir; birleştirmeden önce CI'da bir kırıcı-değişiklik denetleyicisi çalıştırabilirsiniz. tRPC'nin router tipinin buna karşılık gelen bağımsız bir nesnesi yoktur; "sözleşme" herhangi bir commit'te sunucunun canlı TypeScript tiplerinin ne olduğuysa odur — hızla evrilen bir iç API için tam doğru, SLA'larla üçüncü tarafların bağımlı olduğu bir API için ise tam yanlıştır.

| Yaklaşım | Tip güvenliği | Codegen adımı | Dış/çok dilli tüketici desteği | Yönetişim ve versiyonlama |
|---|---|---|---|---|
| tRPC | Tam (çıkarım) | Yok | Zayıf — yalnızca TypeScript, aynı repo | Zayıf — bağımsız sözleşme nesnesi yok |
| Tipli OpenAPI + codegen | Yeniden üretimden sonra tam | Gerekli (`openapi-typescript` vb.) | Güçlü — her dil | Güçlü — diff'lenebilir spesifikasyon, kırıcı-değişiklik denetleyicileri |
| GraphQL + codegen | Yeniden üretimden sonra tam | Gerekli (GraphQL Code Generator) | Güçlü — her dil | Orta — şema sürümlü, resolver'lar operasyonel maliyet ekler |
| Next.js Server Actions | Tam (çıkarım) | Yok | Yok — yalnızca birinci taraf render | Zayıf — genel API değil, uygulamaya bağlı |
| oRPC v1.0 | Girdi/çıktı/hata için tam | İsteğe bağlı | Güçlü — birinci sınıf OpenAPI | Orta-güçlü, ekosistem henüz olgunlaşıyor (Eylül 2026) |

Domain modelinizi dürüst tutmak için zaten markalı tipler ve ayrık union'lar gibi [ileri TypeScript kalıpları](/tr/posts/ileri-typescript-kaliplari) kullanıyorsanız, tRPC aynı disiplini ağ sınırının ötesine bedelsiz taşır. Bunun yerine yönetişime ihtiyacınız varsa, tipli OpenAPI'yi ilk kırıcı değişiklik bir ortağa ulaşmadan önce, [API versiyonlama stratejileri](/tr/posts/api-versiyonlama-stratejileri) yazısında anlatılan türden bir sözleşme disipliniyle daha en baştan eşleyin.

## Küçük bir başlangıç tarifi

Bir TypeScript monorepo'su içindeki yeni bir iç araç için, Eylül 2026 itibarıyla uçtan uca güvenliğe giden en hızlı yol şudur:

1. Girdileri ve çıktıları sunucuda [Zod](https://zod.dev) şemalarıyla tanımlayın; tek bir tanımla hem çalışma zamanı doğrulaması hem de `z.infer` ile statik bir tip elde edersiniz.
2. Her şemayı bir tRPC `procedure`'ına sarın (yukarıdaki router örneğine bakın) ve router'ın yalnızca tipini, hiçbir zaman implementasyonunu, paylaşılan bir paketten dışa aktarın.
3. İstemcide bu tipi `import type { AppRouter } from "@repo/server"` ile içe aktarın; `type` anahtar kelimesi sunucunun çalışma zamanı kodunu istemci paketinizin dışında tutar.
4. `httpBatchLink` ekleyin; aynı tik içinde yapılan birden fazla çağrı tek bir HTTP isteğine sıkışır, böylece "sadece bir fonksiyon çağırıyormuş gibi" hissi production'da çağrı-başına-istek maliyetine dönüşmez.
5. Aynı veri için sonradan bir genel (public) API'ye ihtiyacınız olursa, tRPC router'ını yeniden amaçlandırmayın. O dış yüzey için özel olarak tipli bir OpenAPI katmanı kurun (ya da oRPC'yi değerlendirin) ve bağımsız olarak sürümleyin.

Bu son adım göründüğünden daha önemli: bir tRPC uç noktası dış bir tüketici kazandığı anda, sessizce sürümsüz bir genel sözleşme yaratmış olursunuz ve her iç refactor, build grafiğinizin dışındaki biri için kırıcı bir değişikliğe dönüşür. Tüketicinin her zaman sizin build grafiğinizde bir TypeScript istemcisi olacağından şüpheniz varsa bile yine de tRPC ile başlayın ve sonradan açık bir OpenAPI cephesi ekleyin; sonradan bir cephe eklemek, tRPC etrafa yayıldıktan sonra bütün bir istemci filosunu göç ettirmekten çok daha ucuzdur.

Sabit bir uç nokta kümesi yerine esnek bir sorgu grafiğinin ne zaman daha mantıklı olduğuna dair arka plan için [REST mi GraphQL mi](/tr/posts/rest-mi-graphql-mi) yazısına bakabilirsiniz.

## Sıkça Sorulan Sorular

### tRPC yalnızca monorepo'da mı kullanılabilir?

Katı bir kural değil ama pratikte gereklilik bu. tRPC, istemcinin sunucunun kaynak kodundan bir TypeScript tipini derleme zamanında içe aktarmasını gerektirir; bu da genelde ikisinin tek bir repo'da ya da build'inizin ulaşabildiği tek bir paylaşılan paket kayıt defterinde yaşaması demektir. İkisini birbiriyle ilgisiz repo'lara ve dillere ayırmak mekanizmayı tamamen geçersiz kılar.

### tRPC bir mobil uygulama ya da TypeScript olmayan bir istemciyle çalışır mı?

Hayır, ve bu onun temel sınırlaması. tRPC'nin tip çıkarımı bir TypeScript'ten TypeScript'e özelliğidir; bu yüzden Swift, Kotlin ya da Python ile yazılmış bir istemci derleme zamanı garantilerinin hiçbirini almaz ve alttaki HTTP uç noktalarını elle çağırmak zorunda kalır. Bu tüketiciler için tipli OpenAPI ya da oRPC'nin OpenAPI modu daha uygundur.

### oRPC 2026'da tRPC'nin yerini alıyor mu?

Çoğu ekip için henüz değil. Aralık 2025'teki v1 duyurusu haberine göre oRPC v1.0, tip güvenli çıkarımla birinci sınıf OpenAPI desteğinin ikna edici bir birleşimini sunuyor; ama Eylül 2026 itibarıyla ekosistemi tRPC'ye kıyasla daha küçük, production vaka çalışması sayısı daha az ve araç olgunluğu daha düşük. Bu yüzden onu yeni projeler için değerlendirin, kararlı tRPC kod tabanlarını hemen ona göçürmek yerine.

### Zaten tip güvenli REST uç noktalarım varsa GraphQL'e ihtiyacım var mı?

Genelde hayır. GraphQL, bir şema kayıt defteri, resolver'lar ve çoğunlukla bir gateway gibi operasyonel maliyetini, birden fazla farklı ön yüzün aynı veri grafiğinin farklı dilimlerine tek bir istekte ihtiyaç duyduğu durumda hak eder; tek bir web uygulamasının kendi backend'ini çağırdığı durumda bu esnekliğe nadiren ihtiyaç vardır ve tRPC ya da tipli REST daha basit bir hata ayıklama deneyimi verir.
