---
title: "Cache Stratejileri ve Geçersiz Kılma"
slug: "cache-stratejileri-gecersiz-kilma"
translationKey: "caching-strategies-invalidation"
locale: "tr"
excerpt: "Yalan söyleyen cache'ler üzerine notlar: dört cache kalıbı, veri tipine göre TTL rehberi ve tek sıcak anahtarın veritabanınızı nasıl alaşağı edebildiği."
category: "software-engineering"
tags: ["performance", "databases", "system-design", "best-practices"]
publishedAt: "2026-07-16"
seoTitle: "Cache Stratejileri ve Geçersiz Kılma: Pratik Rehber"
seoDescription: "Cache-aside, read-through, write-through ve write-behind karşılaştırması, veri tipine göre TTL rehberi ve bir cache stampede'in veritabanınızı vurmasını önleme."
---

Bize yalan söyleyen cache, 60 saniyelik TTL'i olan ve jitter'ı bulunmayan bir ürün fiyatlama cache'iydi. Fiyatlama servisine dokunan her deploy, her replika üzerinde aynı saniyede senkronize bir bitişi tetikliyordu ve her saat yaklaşık 400ms boyunca, normal yükte gayet iyi durumda olan veritabanı tamponsuz trafiğin tamamını üstleniyor ve çöküyordu. Çözüm daha büyük bir cache değildi — gerçekte hangi dört cache kalıbından hangisini çalıştırdığımızı anlamak ve tek satırlık bir jitter eklemekti. İşte öğrendiklerimizin saha notu hali.

## Dört kalıp ve her birinin gerçekte vaat ettiği şey

**Cache-aside (tembel yükleme)**, çoğu ekibin adını koymadan varsayılan olarak uyguladığı kalıp: uygulama önce cache'e bakar, kaçırırsa veritabanından okur ve sonucu kendisi cache'e geri yazar. En yaygın varsayılan çünkü akıl yürütmesi en kolay olanı — cache yalnızca fiilen istenmiş olanı tutar ve bir cache kesintisi "bozuk" değil "yavaş"a düşer, çünkü her okumanın hâlâ veritabanına giden bir yolu vardır.

**Read-through**, uygulama açısından benzer görünür ama miss işleme mantığının sahibi uygulama kodu değil cache katmanının kendisidir — uygulama sadece cache'e sorar, cache gerekirse veritabanına sorar. Okuma mantığını merkezileştirir ama sizi bunu uygulayan cache kütüphanesine ya da proxy'ye daha sıkı bağlar.

**Write-through**, aynı işlemde hem cache'e hem veritabanına senkron yazar; bu yüzden cache bir yazmadan hemen sonra asla bayat değildir — bedeli, her yazmanın artık her iki sistemi de beklemesidir.

**Write-behind (write-back)**, cache'e anında yazar ve veritabanı yazmasını sonrasında asenkron olarak kuyruğa alır; bu, düşük yazma gecikmesi karşılığında küçük bir dayanıklılık riski penceresi (iki yazma arasında bir çökme veri kaybına yol açar) satın alır.

| Kalıp | Okuma yolu | Yazma yolu | Tutarlılık riski |
|---|---|---|---|
| Cache-aside | Uygulama cache'e bakar, miss'te DB'ye düşer | Uygulama DB'ye yazar, ardından cache'i geçersiz kılar/günceller | Geçersiz kılmaya kadar bayat okuma penceresi |
| Read-through | Miss işleme mantığının sahibi cache | Cache-aside ile aynı, ya da write-through ile eşleştirilir | Cache-aside ile aynı risk sınıfı |
| Write-through | Cache her zaman sıcak | Hem cache'e hem DB'ye senkron yazma | En düşük bayatlık riski, en yüksek yazma gecikmesi |
| Write-behind | Cache her zaman sıcak | Cache yazmasından sonra DB'ye asenkron yazma | DB yazması tamamlanmadan çökmede veri kaybı riski |

## Geçersiz kılma: tek başına değil, delete-on-write artı TTL

Bilgisayar biliminin en eski şakası — cache geçersiz kılma, iki zor problemden biridir — bu ünü, standart yaklaşımın iki yarısının da tek başına işe yaramamasından alıyor. Delete-on-write (ya da update-on-write), kendi servisinizin veriyi değiştirdiği anda cache'i doğru tutar ama kontrolünüz dışında bir yerde değişen veri için hiçbir şey yapmaz — kaçırdığınız bir webhook, doğrudan bir veritabanı düzenlemesi ya da downstream bir servisin kendi cache'inin size bayat veri servis etmesi gibi. TTL, delete-on-write'ın kaçırdığı her şeyi yakalar; bedeli, TTL'in kendisine eşit sınırlı bir bayatlık penceresidir.

İkisini birleştirmek bir uzlaşma değil, standart yaklaşımdır: hızlı yol için delete-on-write, geçersiz kılma mantığında bir hata olsa ya da bağlamayı unuttuğunuz bir kod yolu olsa bile bayatlığın hiçbir zaman bilinen bir sınırı aşmamasını garanti eden yedek olarak da TTL.

## Veri tipine göre TTL rehberi

Evrensel bir TTL yok — doğru değer tamamen o spesifik veri için bayatlığın maliyetinin cache miss'in maliyetine kıyasla ne olduğuna bağlı:

| Veri tipi | Tipik TTL | Gerekçe |
|---|---|---|
| Kullanıcı oturum verisi | 15-30 dk | Bayatlık ucuz; miss'ler kullanıcıların fark ettiği auth akışlarını vurur |
| Ürün kataloğu / fiyatlama | 1-5 dk | Tazelik ile okuma yükü arasında denge |
| Arama/agregasyon sonuçları | 5-15 dk | Yeniden hesaplama pahalı; hafif bayatlık kabul edilebilir |
| Referans/config verisi | 1-24 saat | Nadiren değişir; agresif cache'lemek güvenli |
| Gerçek zamanlı stok sayıları | Saniyeler, ya da yalnızca event-driven geçersiz kılma | Bayatlık doğrudan fazla satışa yol açar |

## Stampede: veritabanımızı bir haftada bir kez öldüren şey

Bir cache stampede (thundering herd), popüler bir anahtar süresi dolduğunda ve ona eşzamanlı gelen her isteğin aynı anda kaçırıp bağımsız olarak aynı değeri yeniden hesaplayarak backend'e aynı anda gereksiz yük göndermesiyle olur. Tam olarak cache'in korumasına en çok güvendiğiniz sıcak anahtarları vuran hata modudur — nadiren istenen bir anahtarda sessiz bir cache miss görünmezdir; en çok istenen anahtarınızdaki senkronize bir miss ise bir kesintidir.

Genelde birlikte kullanılan iki çözüm:

**Single-flight (istek birleştirme).** Kaçıran ilk istek bir kilit koyar; aynı anahtar için gelen diğer her eşzamanlı istek kendi yeniden hesaplamasını tetiklemek yerine o tek uçuştaki yeniden hesaplamayı bekler, sonra hepsi sonucu paylaşır.

```javascript
const inflight = new Map();

async function getCached(key, loader, ttlSeconds) {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  if (inflight.has(key)) return inflight.get(key); // bekle, tekrarlama

  const promise = (async () => {
    const value = await loader();
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    inflight.delete(key);
    return value;
  })();

  inflight.set(key, promise);
  return promise;
}
```

**Olasılıksal erken bitiş.** Sert bir TTL sınırını beklemek yerine, bitişe yaklaştıkça artan bir olasılıkla bir anahtarı erken yenileyin — bu, kümedeki yenilemelerin senkronizasyonunu bozarak hepsinin tam olarak aynı saniyede kaçırmasını önler; fiyatlama cache'imizi ilk baştan öldüren de tam olarak buydu. TTL'in kendisine jitter eklemek (`ttl + random(0, ttl * 0.1)`) aynı fikrin en ucuz versiyonudur.

## Bize kötü bir salıyı kurtaracak kural

O olaydan çıkardığım net ders şu: jitter'sız sabit bir TTL, önemli olacak kadar trafik bekleyen bir senkronize-arıza üreticisidir ve düzeltmesi tek satır kod tutar — "TTL'lerinize jitter ekleyin"i sonraya bırakacağınız bir optimizasyon değil, varsayılan bir davranış olarak görün. Bunun ötesinde, alışkanlıktan cache-aside'a varsaymak yerine kalıbı gerçekten ihtiyacınız olan tutarlılık garantisiyle eşleştirin: bayat bir okuma gerçekten olamıyorsa (stok, ödeme durumu), o değeri hiç cache'lemeyin ya da her yazma yolunda senkron bir kontrolle geçersiz kılın, çünkü bayatlığın dolar cinsinden bir maliyeti olan veri için hiçbir TTL gerçekten güvenli değildir.

Cache'iniz özellikle Postgres'in önünde duruyorsa, [veritabanı indeksleme](/tr/posts/veritabani-indeksleme) ve [N+1 sorgu problemini çözme](/tr/posts/n-plus-one-sorgu-problemi) notlarımızla birlikte okumaya değer — zaten cache'lediğiniz iyi indekslenmiş bir sorgu, cache nihayet kaçırdığında daha küçük bir stampede demektir. [Stack'inizin çoğu için Postgres'e](/tr/posts/her-sey-icin-postgres) yaslanıyorsanız, `UNLOGGED` tablolar ya da `pg_cache` kalıpları küçük iş yüklerinde ayrı bir cache katmanının tamamen yerini alabilir.

## Sıkça Sorulan Sorular

### Cache-aside ile write-through cache'leme arasındaki fark nedir?

Cache-aside cache'i yalnızca bir okuma miss'inde doldurur, bu yüzden cache yalnızca fiilen istenmiş olanı yansıtır. Write-through her yazmada cache'i senkron olarak doldurur, bu yüzden zaten yazdığınız veri için asla soğuk değildir — bedeli her yazmanın hem cache'i hem veritabanını beklemesidir.

### Belirli bir veri parçası için TTL'i nasıl seçerim?

Bayat veri servis etmenin maliyetini o veri için bir cache miss'in maliyetine karşı tartın. Yüksek değişim, yüksek bayatlık maliyeti olan veri (stok, fiyat) kısa bir TTL ya da event-driven geçersiz kılma gerektirir; az değişen, yeniden hesaplaması pahalı veri (agregasyonlar, referans tabloları) saatlere tolerans gösterebilir.

### Bir cache stampede'e ne sebep olur?

Popüler bir cache anahtarının, ona eşzamanlı birçok istek uçuştayken süresinin dolması — hepsi tam olarak aynı anda kaçırır ve bağımsız olarak aynı değeri yeniden hesaplayarak backend'e aynı anda gereksiz bir yük patlaması gönderir.

### TTL tek başına cache geçersiz kılmayı çözer mi?

Hayır. TTL bayatlığı sınırlar ama veri değiştiği anda cache'i doğru yapmaz — bir yazma, bir cache yazmasından saniyeler sonra gerçekleşebilir ve bayat değer TTL süresi dolana kadar görünür kalır. Doğrudan kontrol ettiğiniz veri yolları için TTL'i delete-on-write (ya da update-on-write) geçersiz kılmayla eşleştirin.
