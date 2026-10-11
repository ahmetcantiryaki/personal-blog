---
title: "Gemini'de Ürün Fotoğrafı Nasıl Düzenlenir?"
slug: "gemini-ile-urun-fotografi-duzenleme"
translationKey: "gemini-nano-banana-photo-editing-2026"
locale: "tr"
excerpt: "Kısa cevap: değişikliği Gemini'nin Nano Banana 2.1 modeline sade bir dille anlatın, model mevcut görseli doğrudan düzenler; maske veya katman aracı gerekmez."
category: "social-media"
tags: ["gemini", "images", "ai-tools", "conversion-optimization"]
publishedAt: "2026-10-11"
seoTitle: "Gemini Nano Banana 2.1 ile Ürün Fotoğrafı Düzenleme"
seoDescription: "6 Ekim 2026'dan beri GA olan Gemini Nano Banana 2.1 modeliyle ürün fotoğraflarını sohbet ederek düzenleme: arka plan değiştirme, temizleme ve varyasyonlar."
---

Kısa cevap: Gemini'yi açın, ürün fotoğrafınızı ekleyin ve düzenlemeyi sıradan bir cümleyle anlatın — "arka planı düz beyazla değiştir" veya "köşedeki kabloyu kaldır" gibi. 6 Ekim 2026'da genel kullanıma açılan Google'ın görsel modeli Nano Banana 2.1, bu talimattan fotoğrafı doğrudan düzenliyor; seçim aracı veya katman paneli gerekmiyor.

## Nano Banana 2.1 ile gerçekte ne değişti?

Google'ın 6 Ekim 2026 tarihli changelog kaydı, Nano Banana 2.1'i (`gemini-nano-banana-2.1`) görsel üretim ve sohbet tabanlı düzenleme için yeni kararlı (stable) sürüm olarak işaretliyor — önizleme değil, üretim modeli. Aynı changelog kaydı, öncülü `gemini-3.1-flash-image`'ı (insanların "Nano Banana 2" dediği modelin arkasındaki model) 29 Ekim 2026 kapanış tarihiyle kullanımdan kaldırıyor. Üretimde eski model adını çağıran bir şeyiniz varsa bu, 23 günlük bir geçiş penceresi demek.

| Özellik | Nano Banana 2.1 (mevcut) | Öncül (gemini-3.1-flash-image, 29 Ekim 2026'da kapanıyor) |
|---|---|---|
| Durum | Yeni Kararlı (New Stable) | Kullanımdan kaldırıldı |
| Çıktı çözünürlükleri | 1K (varsayılan), 2K, 4K | 512px katmanı dahildi |
| Çoklu görsel birleştirme | 14 referans görsele kadar | Daha düşük referans görsel sınırı |
| Karakter tutarlılığı | 4 karaktere kadar | Bu seviyede belirtilmemiş |
| Nesne sadakati | 10 nesneye kadar | Bu seviyede belirtilmemiş |
| Fiyatlandırma | 1K görsel 0,0336 $, 2K 0,0504 $, 4K 0,0756 $ | Farklı fiyat katmanı |
| Ücretsiz API katmanı | Yok | — |

Gerçek tek gerileme: 512px çıktı katmanı kaldırıldı. İş akışınız API'den doğrudan küçük küçük resimler üretiyorsa, 1K üretip kendiniz küçültmeniz gerekecek.

## "Sohbet tabanlı düzenleme" bir ürün fotoğrafıyla gerçekte ne yapmanızı sağlıyor?

Model, mevcut fotoğrafınızı yeni bir şey üretmek için bir referans olarak değil, düzenlenecek girdi olarak ele alıyor. Ürün listelemeleri için sürekli çıkan üç düzenleme var:

- **Arka plan değiştirme.** "Bu ürünü düz beyaz bir arka plana koy" veya "mermer bir tezgahın üzerine yerleştir" — model ürünün kendisine dokunmadan sadece etrafındaki ortamı değiştiriyor.
- **Temizleme.** "Fiyat etiketini kaldır" veya "camdaki yansımayı kaldır" — eskiden katman tabanlı bir düzenleyici gerektiren küçük, hedefli kaldırmalar artık tek bir cümleyle oluyor.
- **Tutarlı varyasyonlar.** "Bu ürünü üç farklı arka plan renginde, ürünü aynı tutarak üret" — yeniden çekim yapmadan bir listelemeyi A/B test etmek için yararlı.

## Baştan sona bir ürün listelemesi için gerçek bir iş akışı nedir?

1. Ürünün temiz bir fotoğrafını çekin veya edinin — ışıklandırma, arka plandan daha önemli, çünkü zaten değiştirmek üzere olduğunuz şey arka plan.
2. Gemini'ye yükleyin ve mağazanız için önemliyse çıktı çözünürlüğünü belirterek spesifik düzenlemeyi isteyin (çoğu pazar yeri yakınlaştırma özellikleri için en az 2K istiyor).
3. Gerçekten yaşanan iki başarısızlık türünü kontrol edin: metin veya logolar bazen ince şekilde değişebiliyor, yansıtıcı yüzeyler bazen prompt'ta tanımlanan arka plandan artefakt alabiliyor. Yayınlamadan önce ikisini de kontrol edin.
4. Her seferinde yeni bir konuşma başlatmak yerine aynı iş parçacığında 2-3 varyasyon isteyin — iş parçacığını sürdürmek, modelin ürünün tam görünümünü varyasyonlar arasında koruması demek.
5. Mağazanızın gerçekte gösterdiği çözünürlükte dışa aktarın; listelemeniz 1200px bir görsel gösteriyorsa 4K üretmek görünür bir fayda olmadan maliyeti artırır.

## Hangi prompt kalıbı marka görünümünüzü ürünler arasında tutarlı tutuyor?

```text
Katalogdaki her ürün için yeniden kullanılacak temel talimat:
"Bu ürün fotoğrafını düzenle: arka planı [belirli arka plan] ile
değiştir, ürünün altında doğal yumuşak bir gölge bırak, ürünün
şeklini, rengini veya herhangi bir basılı metni/logosunu değiştirme.
Işık yönünü [sol üst / eşit stüdyo ışığı] ile eşleştir."
```

Aynı temel talimatı yeniden kullanmak — sadece ürün fotoğrafını ve arka plan tanımını değiştirmek — bir kataloğu elli tutarsız düzenleme yerine tek bir uyumlu çekim gibi gösteren şey. Bu, [AI ile sosyal medya görselleri üret](/tr/posts/ai-ile-sosyal-medya-gorselleri-uret) yazımızda ele aldığımız aynı disiplin: tekrar edilebilir bir prompt şablonu, akıllıca tek seferlik bir denemeyi her zaman geçer.

## Maliyet ve kalite, kullanımdan kaldırılan 3.5/3.1 Flash Image modeliyle nasıl kıyaslanıyor?

Nano Banana 2.1, en yüksek çözünürlükte (4K için 0,0756 $) görsel başına çoğu ekibin eski modelde hızlı küçük resim kalitesindeki çıktı için ödediğinden daha fazlasına mal oluyor, ama çağrı başına da daha fazlasını yapıyor — 14 referansa kadar çoklu görsel birleştirme ve 4 figüre kadar karakter tutarlılığı, bunlar önceden manuel olarak birleştirilen birden fazla ayrı üretim gerektiriyordu. Tek bir ürün kesimi için maliyet farkı önemsiz. Aynı modelin aynı ürünü on farklı çekimde giydiği bir kampanya için yeni modelin tutarlılık özellikleri, eskiden çok adımlı manuel bir kompozisyon işi olan şeyin yerini alıyor; fiyatlandırmanın kendini gerçekten ödediği yer de burası.

## Çok ürünlü bir katalogda hangi hatalardan kaçınmalısınız?

En sık yaşanan hata, her ürün için sıfırdan farklı bir prompt yazmak. Bu, bir kataloğun yarısı tek bir stüdyo çekimi gibi görünürken diğer yarısının gözle görülür şekilde farklı ışık ve gölge açısına sahip olmasına yol açıyor — alıcılar bunu bilinçli olarak fark etmese de, tutarsızlık bir markanın "amatör" hissettirmesinin yaygın nedenlerinden biri. Çözüm, yukarıdaki temel talimat şablonunu bir belgeye kaydetmek ve her ürün için yalnızca ürün fotoğrafını ve arka plan tanımını değiştirmek; ışık yönü ve gölge talimatı sabit kalıyor.

İkinci yaygın hata, aynı iş parçacığında çok fazla farklı ürünü art arda düzenlemeye çalışmak. Model önceki ürünün görsel özelliklerini bir sonraki düzenlemeye sızdırabiliyor — özellikle renk paleti benzer ürünlerde. Her ürün ailesi için ayrı bir konuşma başlatmak, bu çapraz sızıntıyı büyük ölçüde ortadan kaldırıyor; maliyeti tek bir uzun iş parçacığından biraz daha yüksek ama sonuç daha güvenilir.

## Ticari kullanım için dışa aktarma ve lisans uyarıları nedir?

AI ile düzenlenmiş bir ürün fotoğrafını, stok kaynaklı herhangi bir varlığa davrandığınız gibi ele alın: planınızın ticari kullanım koşullarının bu spesifik çıktıyı kapsadığını doğrulayın, bir pazar yeri veya reklam platformu kaynak sorduğunda kullanmak için orijinal düzenlenmemiş fotoğrafı dosyada tutun ve bir AI düzenlemesinin bir ürünün gerçek durumunu, boyutunu veya içeriğini yanlış temsil etmesine güvenmeyin — platformlar bunu artık giderek daha fazla yaratıcı bir seçim değil, bir listeleme doğruluğu ihlali olarak değerlendiriyor. Ürünün kendisi tescilli bir logo veya üçüncü bir tarafın tasarımını içeriyorsa, düzenleme bunu ticari olarak kullanmak için kimin iznine gerek olduğunu değiştirmiyor.

Açıkçası bence buradaki asıl haber görsel kalitesi değil — zaten bol model temiz ürün çekimleri üretiyor. Asıl şey, mevcut bir fotoğrafı sade bir dille düzenlemenin, küçük işletmelerin temel fotoğraf temizliğini dışarıya vermesine sebep olan tek adımı — katman tabanlı bir düzenleyiciyi kullanabilecek birini bulmak veya bunu kendiniz öğrenmek — ortadan kaldırması. Bu gerçek bir maliyet ve zaman tasarrufu, sadece bir yenilik değil. AI ile üretilen görsellerin satışı gerçekten hareket ettirip ettirmediğini ölçme hakkında daha fazlası için [AI UGC reklamları gerçekten dönüştürüyor mu](/tr/posts/ai-ugc-reklamlari-creator-video) yazımıza bakabilirsiniz.

## Sıkça Sorulan Sorular

### Gemini'nin Nano Banana 2.1'i ne zaman genel kullanıma açıldı?

Google'ın changelog'u, Nano Banana 2.1'i (`gemini-nano-banana-2.1`) 6 Ekim 2026'da genel kullanıma açılmış ve önizleme değil "Yeni Kararlı" olarak işaretlenmiş şekilde listeliyor. Aynı kayıt, öncül modeli 29 Ekim 2026 kapanış tarihiyle kullanımdan kaldırdı.

### Nano Banana 2.1 mevcut bir fotoğrafı düzenleyebiliyor mu, yoksa sadece yeni görsel mi üretiyor?

İkisini de yapıyor, ama sohbet tabanlı düzenleme yeteneği ürün fotoğrafçılığı için pratik yükseltme: mevcut bir fotoğraf yüklüyorsunuz ve değişikliği sade bir dille tanımlıyorsunuz — arka plan değiştirme, nesne kaldırma, ışık ayarı — model de alakasız yeni bir görsel üretmek yerine o spesifik görseli düzenliyor.

### E-ticaret ürün fotoğrafları için hangi çözünürlüğü kullanmalıyım?

Üzerine gelince yakınlaştırmayı destekleyen çoğu pazar yeri en az 2K kaynak görsel istiyor. Nano Banana 2.1, 1K (varsayılan), 2K ve 4K'yı destekliyor; önceki modelin 512px katmanı artık mevcut değil, bu yüzden çok küçük küçük resim üretimi artık 1K bir çıktıyı kendi kendinize küçültmenizi gerektiriyor.

### Nano Banana 2.1'in geliştiriciler için ücretsiz bir katmanı var mı?

Hayır. 6 Ekim 2026 sürüm notları üzerine yapılan haberler ücretsiz bir API katmanı olmadığını belirtiyor; görsel başı fiyatlandırma 1K çıktı için 0,0336 $'dan başlayıp 4K için 0,0756 $'a çıkıyor.
