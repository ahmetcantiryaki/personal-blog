---
title: "TypeScript'te Tip Güvenli Ortam Değişkenleri"
slug: "typescriptte-tip-guvenli-ortam-degiskenleri"
translationKey: "type-safe-env-config-typescript"
locale: "tr"
excerpt: "Kısa cevap: process.env'i Zod şemasıyla açılışta bir kere doğrula; eksik bir değişken, derin bir isteğin ortasında değil, açılış anında hata versin."
category: "web-development"
tags: ["typescript", "nextjs", "best-practices", "web-security"]
publishedAt: "2026-10-29"
seoTitle: "TypeScript'te Ortam Değişkenleri Nasıl Tip Güvenli Yapılır?"
seoDescription: "Zod veya t3-env ile process.env'i bir kere doğrulayıp açılışta hata vererek, eksik bir ortam değişkeninin sunucuyu 3'te uyandırmasını nasıl önlersiniz."
---

Kısa cevap: `process.env`'i Zod (veya t3-env gibi bir sarmalayıcı) ile tanımlanmış bir şemaya göre uygulama açılışında bir kere ayrıştırın; eksik veya hatalı bir değişken varsa uygulama o anda okunabilir bir hatayla çöksün, isteğin ortasında `undefined` olarak sızmasın. Sunucu-özel sırları istemciye sızdırmamak için de şemayı sunucu ve istemci blokları olarak ayırmak gerekiyor.

## String tipli ortam değişkenleri neden 3'te sizi uyandırıyor?

`process.env.DATABASE_URL`, TypeScript'in gözünde her zaman `string | undefined` — tip sistemi bu değişkenin gerçekten var olup olmadığını veya doğru formatta olup olmadığını size hiçbir zaman garanti etmiyor. Bu belirsizlik, bir ortam değişkeni `.env` dosyasında yanlış yazıldığında veya deploy sırasında unutulduğunda sessizce `undefined` olarak kalıyor ve hata, değişkenin kullanıldığı ilk yerde değil, genelde o değerin bir veritabanı bağlantı dizesine geçtiği çok daha derin bir noktada patlıyor.

Bu yüzden klasik senaryo şöyle işliyor: deploy başarılı görünüyor, uygulama açılıyor, ama ilk veritabanı isteği geldiğinde "connection string is undefined" hatasıyla çöküyor — ve bu genelde trafiğin düşük olduğu gece saatlerinde, ilk isteğin geldiği anda ortaya çıkıyor. Açılışta doğrulama yapmak, bu hatayı deploy anına taşıyor; isteğin ortasına değil. Bu fark, nöbetçi mühendisin gece 3'te bir log dosyasında kök nedeni araması ile deploy panosunda anında kırmızı bir hata görmesi arasındaki fark kadar büyük.

## Zod ile bir şema tanımlamak neden undefined kontrolünden daha iyi?

Her kullanım yerinde `if (!process.env.DATABASE_URL) throw new Error(...)` yazmak hem tekrarlı hem de unutmaya açık; bir Zod şeması, tüm değişkenleri tek bir yerde tanımlayıp tipi ve doğrulamayı aynı anda veriyor. `z.string().url()` gibi bir doğrulama, sadece değişkenin var olduğunu değil, geçerli bir URL formatında olduğunu da garanti ediyor — bu, "var ama yanlış formatta" hatalarını da açılışta yakalıyor.

```typescript
import { z } from "zod"

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "production", "test"]),
  API_SECRET_KEY: z.string().min(32),
  NEXT_PUBLIC_APP_URL: z.string().url(),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error("Geçersiz ortam değişkenleri:", parsed.error.flatten().fieldErrors)
  throw new Error("Ortam değişkenleri doğrulanamadı — uygulama başlatılamıyor.")
}

export const env = parsed.data
```

`safeParse` kullanmak, hata mesajını kendi formatında loglayıp ardından kasıtlı olarak fırlatmanıza izin veriyor — bu, Next.js'in build sırasında gösterdiği belirsiz yığın izlerinden çok daha okunabilir bir hata üretiyor.

## t3-env, Zod'un üstüne ne ekliyor?

`@t3-oss/env-nextjs` (ve Nuxt için eşdeğeri), aynı Zod doğrulamasının üstüne iki ek katman ekliyor: sunucu ve istemci değişkenlerini `server` ve `client` blokları altında zorunlu olarak ayırmak ve `runtimeEnv` nesnesiyle Next.js'in Edge ve istemci bundle'ında hangi değişkenlerin gerçekten gömüleceğini açıkça belirtmek. `createEnv` fonksiyonu bu iki bloğu birleştirip tek bir tip güvenli `env` nesnesi döndürüyor; en yeni sürümler Zod'a ek olarak Valibot veya ArkType gibi herhangi bir Standard Schema uyumlu doğrulayıcıyı da kabul ediyor.

```typescript
import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    API_SECRET_KEY: z.string().min(32),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    API_SECRET_KEY: process.env.API_SECRET_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
})
```

## Sunucu sırlarının istemciye sızmasını nasıl önlersiniz?

Next.js'te sadece `NEXT_PUBLIC_` önekiyle başlayan değişkenler tarayıcıya gönderilen JavaScript bundle'ına gömülüyor; önek olmadan bırakılan her değişken sunucuda kalıyor. t3-env bu kuralı derleme zamanında zorunlu kılıyor: `client` bloğuna `NEXT_PUBLIC_` önekiyle başlamayan bir değişken eklemeye çalışırsanız TypeScript hata veriyor ve bir `server` değişkenine istemci bileşeninden erişmeye çalışırsanız açıklayıcı bir çalışma zamanı hatası fırlatıyor.

| Değişken türü | Önek | Nerede yaşıyor | Risk |
|---|---|---|---|
| Sunucu sırrı (API anahtarı) | Önek yok | Sadece sunucu | İstemciye sızarsa anahtar ele geçer |
| İstemci yapılandırması (public URL) | `NEXT_PUBLIC_` | Sunucu + tarayıcı bundle'ı | Zaten herkese açık, risk düşük |
| Build-time sabiti | Framework'e göre değişir | Build çıktısına gömülür | Build sonrası değiştirilemez |

Bu ayrımı atlayıp bir API anahtarını yanlışlıkla `NEXT_PUBLIC_` önekiyle işaretlemek, [buluttaki secret yönetimi yazımızda](/tr/posts/bulutta-secret-yonetimi) ele aldığımız sızıntı senaryolarından biri — ve bu hatayı yakalayacak tek güvenlik ağı, derleme zamanındaki bu tip kontrolü.

## Değerleri dönüştürmek ve varsayılan atamak nasıl çalışır?

Ortam değişkenleri her zaman string olarak geldiği için, bir port numarasını veya bir boolean bayrağı kullanmadan önce dönüştürmeniz gerekiyor; Zod'un `.transform()` metodu bunu şemanın içine taşıyor, böylece dönüştürme mantığı her kullanım yerinde tekrarlanmıyor. `z.string().transform(Number)` bir string'i sayıya çevirirken, `.default("3000")` değişken tanımlı değilse bir varsayılan değer atıyor — ikisini birleştirmek, `PORT` gibi isteğe bağlı sayısal değişkenleri tek satırda güvenli hale getiriyor.

Ortam bazlı farklı yapılandırmalar için (geliştirme ortamında daha gevşek doğrulama, üretimde daha sıkı) `NODE_ENV` değerine göre koşullu bir şema seçmek, aynı kod tabanının farklı ortamlarda farklı kısıtlarla çalışmasını sağlıyor — ama bu koşullu mantığı da tek bir dosyada tutmak, dağınık `if (process.env.NODE_ENV === ...)` kontrollerinin kod tabanına yayılmasını önlüyor.

## Commit edilen .env.example ne işe yarıyor?

Gerçek değerleri içermeyen, ama her değişkenin adını ve beklenen formatını gösteren bir `.env.example` dosyasını repoya commit etmek, yeni bir ekip üyesinin veya CI ortamının hangi değişkenlere ihtiyaç olduğunu şemaya bakmadan görebilmesini sağlıyor. Bu dosyayı şemanızla senkron tutmak için basit bir kural: şemaya yeni bir zorunlu değişken eklediğinizde, aynı PR'da `.env.example`'a da bir satır eklemek — bu disiplin olmadan dosya hızla güncelliğini kaybediyor.

## Yapılandırma yüklemeyi nasıl test edersiniz?

Şemanızın doğru çalıştığını doğrulamanın en ucuz yolu, geçerli bir ortam nesnesiyle `safeParse`'ın başarılı olduğunu, eksik bir zorunlu değişkenle başarısız olduğunu ve geçersiz formatlı bir değerle (örneğin URL olmayan bir `DATABASE_URL`) de başarısız olduğunu doğrulayan birim testleri yazmak. Bu testler, şemayı değiştiren bir sonraki kişinin bir doğrulamayı yanlışlıkla gevşetip gevşetmediğini yakalıyor.

Bu yapılandırma katmanını [ileri TypeScript kalıplarıyla](/tr/posts/ileri-typescript-kaliplari) birleştirip `env` nesnesinin tipini uygulamanın her yerinde tek bir kaynaktan türetmek, farklı dosyalarda farklı tiplerin birbirinden sapmasını önlüyor.

## Monorepo'da birden fazla uygulama aynı şemayı nasıl paylaşır?

Birden fazla uygulamanın (web, API, worker) ortak bir ortam değişkeni seti kullandığı bir monorepoda, şemayı paylaşılan bir pakette (`packages/env`) tanımlayıp her uygulamanın kendi ek değişkenlerini `extends` benzeri bir mekanizmayla üzerine eklemesi, aynı `DATABASE_URL` doğrulamasını üç farklı yerde tekrar yazmaktan kurtarıyor. t3-env'in `extends` seçeneği tam olarak bunu yapıyor: bir temel şemayı import edip üzerine uygulamaya özel alanlar ekleyebiliyorsunuz.

Bu paylaşılan şemayı [ileri TypeScript kalıplarıyla](/tr/posts/ileri-typescript-kaliplari) birleştirip her uygulamanın `env` nesnesini aynı kaynaktan türetmek, bir uygulamada şemayı güncelleyip diğerlerinde unutma riskini ortadan kaldırıyor — TypeScript, paylaşılan paket güncellenip de bir uygulama henüz uyarlanmadığında derleme hatası veriyor.

## Zod şemasını form doğrulamasıyla aynı mantıkla mı yazmalısınız?

Evet — ortam değişkeni doğrulaması ve form doğrulaması aslında aynı problem: dışarıdan gelen, güvenilmeyen string verisini tipli ve güvenli bir yapıya dönüştürmek. [RHF ve Zod ile erişilebilir React formları](/tr/posts/rhf-zod-erisilebilir-react-formlari) yazımızda ele aldığımız şema tanımlama alışkanlıkları (açık hata mesajları, `.refine()` ile özel kurallar) ortam değişkeni şemalarına da birebir uygulanıyor; tek fark, formun kullanıcıdan, ortam şemasının ise deploy sürecinden veri alması.

## Sıkça Sorulan Sorular

### TypeScript'te ortam değişkenlerini tip güvenli yapmak için ne kullanılır?

Zod veya t3-env gibi bir şema doğrulayıcı kullanılır. `process.env`'i uygulama açılışında bir şemaya göre ayrıştırıp sonucu tek bir `env` nesnesi olarak export etmek, hem tip güvenliği hem de açılışta hata verme sağlıyor.

### Bir ortam değişkeni eksikse ne zaman hata vermeli?

Uygulama açılışında, isteğin ortasında değil. Açılışta `safeParse` ile doğrulama yapıp başarısızsa fırlatmak, hatayı deploy anına taşıyor ve "connection string is undefined" gibi gece yarısı hatalarını önlüyor.

### Sunucu sırlarının istemciye sızmasını nasıl önlersiniz?

Next.js gibi framework'lerde sadece `NEXT_PUBLIC_` önekiyle başlayan değişkenler tarayıcıya gönderiliyor. t3-env bu kuralı derleme zamanında zorunlu kılarak önek olmadan bir sırrı istemci bloğuna eklemeyi engelliyor.

### t3-env, düz Zod kullanmaktan farklı ne sağlıyor?

Sunucu ve istemci değişkenlerini ayrı bloklara zorunlu kılıyor ve `runtimeEnv` ile Next.js'in Edge/istemci bundle'ında hangi değişkenlerin gerçekten gömüleceğini açıkça belirtiyor — düz Zod bu ayrımı kendiniz yazmanızı gerektiriyor.
