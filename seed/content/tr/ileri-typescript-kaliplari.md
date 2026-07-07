---
title: "Daha Temiz Kod İçin İleri TypeScript Kalıpları"
slug: "ileri-typescript-kaliplari"
translationKey: "advanced-typescript-patterns"
locale: "tr"
category: "software-engineering"
tags: ["typescript", "clean-code", "design-patterns"]
publishedAt: "2026-07-01"
excerpt: "TypeScript 6.0 ve 7.0 Go derleyicisi için ileri kalıplar: discriminated union, branded type, template literal ve tip güvenli builder'ı örneklerle öğrenin."
seoTitle: "İleri TypeScript Kalıpları: Temiz Kod Rehberi (2026)"
seoDescription: "TypeScript 6.0 ve yeni 7.0 native derleyicisiyle daha temiz kod yazın. Discriminated union, branded type ve tip güvenli builder kalıplarını gerçekten derlenen örneklerle uygulayın."
---

Geçen ay bir takım arkadaşım gece 2'de nöbetçi kanalını çaldırdı: bir ödeme uç noktası yanlış siparişleri iade ediyordu. Kök neden tek satıra sığıyordu. Biri, fonksiyonun `orderId` beklediği yere `userId` geçmişti. İkisi de `string`'di. Tip denetleyicisi memnundu, testler yeşildi ve hata dosdoğru üretime süzüldü. Bir branded type, o çağrıyı derleme anında, pull request açılmadan önce reddederdi.

İleri TypeScript kalıplarının tüm vaadi budur: tip sistemini bir dokümantasyon aracından bir doğrulama motoruna dönüştürürler. Discriminated union, branded type, template literal type ve tip güvenli builder gibi kalıplar, çalışma zamanında patlayacak hataları derleme anında yakalar. Bu yazıda, üretimde gerçekten kullandığım ve `if` yığınlarını azaltan kalıpları, [TypeScript 6.0](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/) (Mart 2026'dan beri kararlı) ve 7.0 sürüm adayıyla gelen yeni [Go tabanlı derleyici](https://github.com/microsoft/typescript-go) altında derlenen örneklerle gösteriyorum.

Aşağıdaki her örnek `strict` altında derlendi; TypeScript 6.0 bu ayarı artık varsayılan olarak açıyor. Amaç akıllı görünmek değil; okunması ve değiştirilmesi kolay kod üretmek.

## İleri TypeScript kalıpları neden temiz kod üretir?

İleri TypeScript kalıpları, geçersiz durumları temsil edilemez hale getirerek temiz kod üretir. Bir hatayı tip sistemiyle imkansız kıldığınızda, onu kontrol eden savunmacı `if` bloklarına, birim testlerine ve yorum satırlarına ihtiyaç kalmaz. Kod kısalır, niyet netleşir ve refactor sırasında derleyici sizi korur.

Pratikte bu üç şeyi kazandırır:

- **Daha az savunmacı kod:** Boş kontrolleri ve tip guard'ları derleyiciye devredersiniz.
- **Kendini belgeleyen imzalar:** Fonksiyon tipleri, ne kabul edip ne döndürdüğünü yorumsuz anlatır.
- **Güvenli refactor:** Bir alanı değiştirdiğinizde derleyici tüm kırılan çağrı noktalarını listeler.

Bu eskisinden daha önemli. Temmuz 2026 itibarıyla profesyonel geliştiricilerin yaklaşık %78'i TypeScript kullandığını bildiriyor; bu oran 2024'te %69'du ve artık %40'ı yalnızca TypeScript yazıyor. Dil artık ekosistemin varsayılanı olduğundan, tip sistemine tam yaslanmak artık egzotik bir tercih değil.

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

Branded type (nominal typing simülasyonu), aynı temel tipe sahip değerleri derleyicinin ayırt etmesini sağlar. Yazının başındaki o gece 2 olayını tam olarak durdurur: `UserId` (bir `string`) ile `OrderId`'nin (o da `string`) yer değiştirmesini. Çalışma zamanında hâlâ düz `string`'tir; ek maliyet sıfırdır.

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

Brand'i tek bir fabrika fonksiyonunda doğrulayın ki `as` cast'i tüm koda dağılmasın. Zaten bir şema doğrulayıcı kullanıyorsanız Zod 4 ve Effect gibi kütüphaneler, kontrolü ayrıştırma sırasına katan hazır brand yardımcıları sunar.

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

Her kalıp her yerde işe yaramaz. Aşağıdaki tablo, hangi problemde hangi kalıba gitmeniz gerektiğini ve kalıbı temiz destekleyen asgari TypeScript sürümünü özetliyor:

| Kalıp | Çözdüğü problem | Kullan | Kaçın | Sürüm |
|-------|-----------------|--------|-------|-------|
| Discriminated union | Birbirini dışlayan durumlar | State machine, API sonucu | Bağımsız opsiyonel alanlar | Her zaman |
| Branded type | Aynı primitive'in karışması | ID, para birimi, birim | Tek kullanımlık değerler | Her zaman |
| Template literal | Desenli string'ler | Rota, event, token | Serbest metin | 4.1 |
| Tip güvenli builder | Adım adım kurulum | Sorgu/config kurucular | Basit nesne literal'i | 5.0 (`const` param) |
| `satisfies` | Tip kontrolü + literal koruma | Config sabitleri | Genel değişkenler | 4.9 |

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

`this` parametresi kalıbın kilit noktasıdır; `build`'in yalnızca doğru tip durumunda çözülmesini sağlar. Bu, [legacy kodu güvenli şekilde refactor ederken](/tr/posts/legacy-kod-refactoring) uyguladığınız disiplinin aynısıdır: değişmezi bir kod gözden geçireni değil, derleyici zorunlu kılsın.

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

İddialı görüşüm: modern projelerde config sabitleri için varsayılanınız `satisfies` olmalı, `const x: Tip` ise istisna. Hem şemayı zorunlu kılar hem de dar tipi korur; [temiz kod prensipleri kontrol listemizdeki](/tr/posts/temiz-kod-prensipleri) disiplinle doğal olarak uyuşur.

Bu kalıplar, klasik [her geliştiricinin bilmesi gereken tasarım kalıplarının](/tr/posts/yazilim-tasarim-kaliplari) tip düzeyindeki kuzenleridir ve doğrulanmaları çok daha kolaydır: [iyi yazılmış unit testler](/tr/posts/unit-test-nasil-yazilir) davranışı doğrular, derleyici ise şekli. Bu kümenin devamı için [yazılım mühendisliği](/tr/category/yazilim-muhendisligi) kategorisine göz atın.

## Sıkça Sorulan Sorular

### İleri TypeScript kalıpları performansı etkiler mi?

Çalışma zamanında hayır. Anlatılan kalıpların tamamı yalnızca tip düzeyinde çalışır ve derlenmiş JavaScript'e sıfır kod ekler; branded type ve `satisfies` tümüyle kaybolur. Tek maliyet çok karmaşık tiplerdeki derleme anı denetimidir ve o da ucuzladı. [TypeScript 7.0 beta ile duyurulan](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0-beta/) Go tabanlı derleyici, tip denetiminde 6.0'dan yaklaşık 10 kat hızlı; VS Code kod tabanını yaklaşık 78 saniyeden 7,5 saniyeye indiriyor.

### Discriminated union ile enum arasındaki fark nedir?

Enum yalnızca sabit bir değer kümesi tanımlar; discriminated union ise her varyanta farklı veri şekli bağlar. Bir durumun ek alanlar taşıması gerekiyorsa (örneğin "hata" durumunun bir mesajı) discriminated union doğru araçtır. Enum sadece etiket gerektiğinde yeterlidir; zaten TypeScript 6.0 çoğu durumda sizi enum yerine literal birleşimine yönlendiriyor.

### Branded type için üçüncü parti kütüphane gerekir mi?

Gerekmez. Branded type, kesişim (intersection) tipiyle birkaç satırda yazılır ve harici bağımlılık istemez. Zod 4 veya Effect gibi kütüphaneler brand'i çalışma zamanı doğrulamasıyla birleştiren hazır yardımcılar sunar, ancak küçük projelerde kendi `Brand<T, B>` yardımcınız fazlasıyla yeterlidir.

### Bu kalıpları benimsemek için TypeScript 7.0'ı beklemeli miyim?

Hayır. Buradaki her kalıp bugün TypeScript 6.0'da çalışıyor ve birkaç sürümdür çalışıyor. 18 Haziran 2026'da sürüm adayı olarak yayımlanan ve kısa süre sonra GA'sı beklenen 7.0 (Go portu), tip denetimi semantiğini birebir korur; yani discriminated union'larınız ve branded type'larınız aynen davranır, sadece daha hızlı. Kalıpları şimdi benimseyin; derleyiciyi hazır olduğunuzda yükseltin.
