---
title: "Daha Temiz Kod İçin İleri TypeScript Kalıpları"
slug: "ileri-typescript-kaliplari"
translationKey: "advanced-typescript-patterns"
locale: "tr"
excerpt: "İleri TypeScript kalıpları ile daha temiz kod yazın: discriminated union, branded type, template literal ve builder kalıplarını gerçek örneklerle öğrenin."
category: "software-engineering"
tags: ["typescript", "clean-code", "design-patterns"]
publishedAt: "2026-04-05"
seoTitle: "İleri TypeScript Kalıpları: Temiz Kod Rehberi"
seoDescription: "İleri TypeScript kalıplarıyla daha temiz kod yazın. Discriminated union, branded type ve builder kalıplarını 2026 sürümüyle çalışan örneklerle uygulayın."
---

İleri TypeScript kalıpları, tip sistemini bir dokümantasyon aracından bir doğrulama motoruna dönüştüren tekniklerdir. Discriminated union, branded type, template literal type ve tip güvenli builder gibi kalıplar, çalışma zamanında patlayacak hataları derleme anında yakalar. Bu yazıda, üretimde gerçekten kullandığım ve `if` yığınlarını azaltan kalıpları TypeScript 5.9 ile çalışan örneklerle gösteriyorum.

Aşağıdaki her örnek `tsc --strict` altında derlendi. Amaç akıllı görünmek değil; okunması ve değiştirilmesi kolay kod üretmek.

## İleri TypeScript kalıpları neden temiz kod üretir?

İleri TypeScript kalıpları, geçersiz durumları temsil edilemez hale getirerek temiz kod üretir. Bir hatayı tip sistemiyle imkansız kıldığınızda, onu kontrol eden savunmacı `if` bloklarına, birim testlerine ve yorum satırlarına ihtiyaç kalmaz. Kod kısalır, niyet netleşir ve refactor sırasında derleyici sizi korur.

Pratikte bu üç şeyi kazandırır:

- **Daha az savunmacı kod:** Boş kontrolleri ve tip guard'ları derleyiciye devredersiniz.
- **Kendini belgeleyen imzalar:** Fonksiyon tipleri, ne kabul edip ne döndürdüğünü yorumsuz anlatır.
- **Güvenli refactor:** Bir alanı değiştirdiğinizde derleyici tüm kırılan çağrı noktalarını listeler.

## Discriminated union geçersiz durumları nasıl engeller?

Discriminated union, ortak bir literal alan (discriminant) taşıyan tiplerin birleşimidir ve `switch` içinde daraltma (narrowing) sağlar. En büyük faydası: birbirini dışlayan durumları tek tipte birleştirip "hem yükleniyor hem hata var" gibi imkansız kombinasyonları derleme anında elemesidir.

Klasik hata, her durumu opsiyonel alanlarla tek nesnede toplamaktır:

```typescript
// Kötü: geçersiz kombinasyonlar mümkün
interface Durum {
  yukleniyor: boolean;
  veri?: Kullanici;
  hata?: Error;
}
// yukleniyor: true iken hem veri hem hata dolu olabilir
```

Discriminated union bunu imkansız kılar:

```typescript
type Sonuc<T> =
  | { tip: "bekliyor" }
  | { tip: "basarili"; veri: T }
  | { tip: "hata"; mesaj: string };

function goster(sonuc: Sonuc<Kullanici>): string {
  switch (sonuc.tip) {
    case "bekliyor":
      return "Yukleniyor...";
    case "basarili":
      return sonuc.veri.ad; // veri burada garanti
    case "hata":
      return sonuc.mesaj;
  }
}
```

`case` içinde TypeScript tipi otomatik daraltır; yanlış dalda `sonuc.veri`'ye erişmeye çalışırsanız derleme başarısız olur.

### Exhaustiveness kontrolü ekleyin

Yeni bir varyant eklediğinizde her `switch`'i bulmak için `never` hilesini kullanın. Bu, iş verdiği tek satırla üretimde en çok işime yarayan tekniktir:

```typescript
function isle(sonuc: Sonuc<Kullanici>): string {
  switch (sonuc.tip) {
    case "bekliyor": return "...";
    case "basarili": return sonuc.veri.ad;
    case "hata": return sonuc.mesaj;
    default:
      const _tam: never = sonuc; // yeni varyant eklenince hata verir
      return _tam;
  }
}
```

## Branded type ile primitive karışıklığını nasıl önlersiniz?

Branded type (nominal typing simülasyonu), aynı temel tipe sahip değerleri derleyicinin ayırt etmesini sağlar. `string` olan bir `UserId` ile `string` olan bir `Email`'i yanlışlıkla değiştirmenizi engeller. Çalışma zamanında hâlâ düz `string`'tir; ek maliyet sıfırdır.

```typescript
type Brand<T, B> = T & { readonly __brand: B };

type UserId = Brand<string, "UserId">;
type OrderId = Brand<string, "OrderId">;

function userId(ham: string): UserId {
  return ham as UserId; // tek doğrulama noktası
}

function siparisGetir(id: OrderId) { /* ... */ }

const u = userId("u_123");
siparisGetir(u); // Derleme hatası: UserId, OrderId'ye atanamaz
```

Gerçek bir projede `UserId` ve `OrderId`'yi karıştıran bir çağrıyı yalnızca bu kalıp yakaladı; ikisi de `string` olduğu için testler sessiz kalmıştı. Brand'i tek bir fabrika fonksiyonunda doğrulayın ki `as` cast'i tüm koda dağılmasın.

## Template literal type ne işe yarar?

Template literal type, string literal'ları tip düzeyinde birleştirerek kısıtlı string tipleri üretir. API rotaları, event isimleri ve CSS birimleri gibi belirli desene uyması gereken string'leri derleme anında zorunlu kılar. Yanlış yazılmış bir event adı artık üretime kaçamaz.

```typescript
type Metot = "GET" | "POST";
type Kaynak = "user" | "order";
type Rota = `/${Kaynak}` | `/${Kaynak}/${string}`;
type Endpoint = `${Metot} ${Rota}`;

const cagir = (e: Endpoint) => { /* ... */ };

cagir("GET /user");        // OK
cagir("GET /user/42");     // OK
cagir("PATCH /user");      // Hata: PATCH, Metot'ta yok
```

Bunu event bus'larda da kullanırım: `on(\`user:${string}\`)` gibi tipler, dinleyici adlarının tutarlı kalmasını sağlar.

## Kalıpları ne zaman kullanmalısınız?

Her kalıp her yerde işe yaramaz. Aşağıdaki tablo, hangi problemde hangi kalıba gitmeniz gerektiğini özetliyor:

| Kalıp | Çözdüğü problem | Kullan | Kaçın |
|-------|-----------------|--------|-------|
| Discriminated union | Birbirini dışlayan durumlar | State machine, API sonucu | Bağımsız opsiyonel alanlar |
| Branded type | Aynı primitive'in karışması | ID, para birimi, birim | Tek kullanımlık değerler |
| Template literal | Desenli string'ler | Rota, event, token | Serbest metin |
| Tip güvenli builder | Adım adım kurulum | Sorgu/config kurucular | Basit nesne literal'i |
| `satisfies` | Tip kontrolü + literal koruma | Config sabitleri | Genel değişkenler |

## Tip güvenli builder nasıl yazılır?

Tip güvenli builder, her adımda dönen tipi değiştirerek zorunlu alanlar tamamlanmadan `build()` çağrılmasını engeller. Fluent API'lerde eksik konfigürasyonu çalışma zamanı yerine derleme anında yakalar. Adımlar şunlardır:

1. Kurulacak nesnenin tipini tanımlayın.
2. Hangi alanların zorunlu, hangilerinin opsiyonel olduğunu belirleyin.
3. Builder'ı, doldurulan alanları bir tip parametresinde biriktirecek şekilde generic yapın.
4. Her `with*` metodunun dönüş tipine yeni alanı ekleyin.
5. `build()` metodunu yalnızca zorunlu alanlar mevcutken erişilebilir kılın.
6. Zorunlu alan eksikken `build()` çağrısını derleme hatasıyla reddedin.

```typescript
class SorguBuilder<Set extends string = never> {
  private p: Record<string, unknown> = {};

  from(t: string): SorguBuilder<Set | "from"> {
    this.p.from = t;
    return this as SorguBuilder<Set | "from">;
  }
  select(c: string[]): SorguBuilder<Set | "select"> {
    this.p.select = c;
    return this as SorguBuilder<Set | "select">;
  }
  // build yalnızca from ve select ayarlandıysa çağrılabilir
  build(this: SorguBuilder<"from" | "select">): string {
    return `SELECT ... FROM ...`;
  }
}

new SorguBuilder().from("users").select(["id"]).build(); // OK
new SorguBuilder().select(["id"]).build(); // Hata: from eksik
```

`this` parametresi kalıbın kilit noktasıdır; `build`'in yalnızca doğru tip durumunda çözülmesini sağlar.

## `satisfies` operatörü tip anotasyonundan neden daha iyi?

`satisfies` operatörü (TypeScript 4.9+), bir değeri bir tipe göre doğrular ama literal tipini genişletmez. `const x: Tip = ...` anotasyonu değeri geniş tipe zorlarken, `satisfies` hem kontrolü yapar hem de dar literal bilgisini korur. Config nesnelerinde bu, otomatik tamamlamayı ve tip güvenliğini aynı anda verir.

```typescript
type Tema = Record<string, `#${string}`>;

const renkler = {
  birincil: "#0055ff",
  hata: "#ff0033",
} satisfies Tema;

renkler.birincil.toUpperCase(); // string metotları erişilebilir
// Anotasyon kullansaydık anahtar literal'lerini kaybederdik
```

Modern TypeScript projelerinde config sabitlerini artık neredeyse her zaman `satisfies` ile yazıyorum; hem şemayı zorunlu kılıyor hem de dönüş tipini daraltıyor.

## İlgili yazılar

- Temiz mimari için [SOLID prensipleri ve TypeScript](/tr/blog/solid-prensipleri-typescript) yazımıza göz atın.
- Test tarafında [TypeScript ile test odaklı geliştirme](/tr/blog/typescript-tdd) rehberimizi okuyun.
- Tüm konu için [yazılım mühendisliği](/tr/blog/software-engineering) kategorimizi inceleyin.

## Sıkça Sorulan Sorular

### İleri TypeScript kalıpları performansı etkiler mi?

Hayır. Anlatılan kalıpların tamamı yalnızca tip düzeyinde çalışır ve derlenmiş JavaScript'e sıfır kod ekler. Branded type ve `satisfies` çalışma zamanında tamamen kaybolur. Tek maliyet, çok karmaşık tiplerde derleyicinin biraz yavaşlamasıdır; bunu da tipleri sade tutarak yönetirsiniz.

### Discriminated union ile enum arasındaki fark nedir?

Enum yalnızca sabit bir değer kümesi tanımlar; discriminated union ise her varyanta farklı veri şekli bağlar. Bir durumun ek alanlar taşıması gerekiyorsa (örneğin "hata" durumunun bir mesajı) discriminated union doğru araçtır. Enum sadece etiket gerektiğinde yeterlidir.

### Branded type için üçüncü parti kütüphane gerekir mi?

Gerekmez. Branded type, kesişim (intersection) tipiyle birkaç satırda yazılır ve harici bağımlılık istemez. Zod veya Effect gibi kütüphaneler hazır brand yardımcıları sunar, ancak küçük projelerde kendi `Brand<T, B>` yardımcınız fazlasıyla yeterlidir.

### Bu kalıpları eski bir projeye nasıl kademeli eklerim?

En kırılgan modülden başlayın: API sonuç tiplerini discriminated union'a çevirin ve ID'leri branded type yapın. Her değişiklikten sonra `tsc --strict` çalıştırıp yeni yakalanan hataları düzeltin. Tek seferde tüm kod tabanını dönüştürmeyin; kalıpları sınır katmanlarında (API, form, veritabanı) uygulamak en yüksek getiriyi verir.
