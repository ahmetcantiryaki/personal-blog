---
title: "Yapay Zeka Özellikleri Arayüzde Neden Sessizce Bozulur?"
slug: "yapay-zeka-ozelliklerinde-sessiz-hata-tuzaklari"
translationKey: "ai-feature-progressive-enhancement-2026"
locale: "tr"
excerpt: "Kısa cevap: çoğu yapay zeka özelliği, model çağrısını sıradan bir API isteği gibi ele aldığı için sessizce bozulur — akış bildirimi, yedek yol veya iptal yok."
category: "web-development"
tags: ["ai-tools", "frontend", "accessibility", "best-practices"]
publishedAt: "2026-11-02"
seoTitle: "Yapay Zeka Özellikleri Neden Sessizce Bozulur?"
seoDescription: "Sonsuz spinner, yutulan hatalar, yeniden deneme yok, gecikmeli token'lardan bozulan düzen: arayüzü bozuk hissettiren altı yaygın hata ve pratik çözümleri."
---

Kısa cevap: bir yapay zeka özelliği, model çağrısı askıda kaldığında, hata verdiğinde veya düzensiz aktığında arayüz jenerik bir spinner gösterip hiçbir şey belirtmediğinde sessizce bozulur; kullanıcı bir şeyin olup olmadığını anlayamaz. Çözüm, model çağrısını hafifçe yavaş bir REST isteği gibi değil, akışlı, iptal edilebilir ve zarif biçimde düşebilen ayrı bir etkileşim durumu olarak ele almaktır.

## Yapay zeka özellikleri ön yüzde neden sıradan API çağrılarından daha çok bozuluyor?

Normal bir API çağrısı ya hızlıca başarılı olur ya da hızlıca başarısız olur, bu yüzden spinner-sonra-sonuç kalıbı yeterlidir. Model çağrısı bu şekle uymaz: gecikme bir saniyenin altından 30+ saniyeye kadar değişebilir, çıktı hepsi birden değil token token gelir, hata biçimleri arasında kısmi çıktı, hız sınırı ve sıradan bir `try/catch`'in her zaman yakalayamadığı sessiz zaman aşımları bulunur. Gördüğünüz çoğu yapay zeka özelliği hatası, ilk şekil için yazılan arayüz kodunun ikinci şekle uygulanmasıdır — [2026 tarihli bir yapay zeka sohbet arayüzü kalıpları derlemesi](https://thefrontkit.com/blogs/ai-chat-ui-best-practices) bunların çoğunu tasarım tarafından listeliyor.

## En yaygın sessiz hata kalıpları nedir?

Geliştiricilerin sahada gördüğü "bu yapay zeka özelliği bozuk hissettiriyor" şikayetlerinin çoğu altı kalıba bağlanır ve altısı da model sorunu değil, ön yüz durum yönetimi hatasıdır.

| Kalıp | Kullanıcının gördüğü | Gerçekte olan |
|---|---|---|
| Zaman aşımında sonsuz spinner | Spinner hiç durmuyor | İstemci tarafı zaman aşımı yok; sunucu vazgeçtikten sonra da istek "beklemede" kalıyor |
| Akış bildirimi yok | 5-15 saniye boş ekran | Token'lar tamponlanıp yalnızca yanıtın tamamı geldiğinde çiziliyor |
| Yutulan hatalar | Tıklayınca hiçbir şey olmuyor | Arayüz güncellemesi olmadan yakalanan bir istisna, çoğunlukla eksik bir `.catch()` dalından |
| Yeniden deneme yolu yok | Hatadan sonra çıkmaz sokak | Hata durumuna aynı isteği yeniden gönderecek bir düğme bağlanmamış |
| Gecikmeli token'lardan düzen kayması | Yanıt akarken sayfa zıplıyor | Rezerve alan yok; konteyner token token büyüyor, altındaki içeriği itiyor |
| Model çöktüğünde yedek yok | Özellik tamamen kayboluyor veya sayfayı bozuyor | Yapay zeka dışı bir varsayılana (boş durum, önbellekli sonuç, manuel giriş) yedek yok |

## Sonsuz spinner nasıl düzeltilir?

Göreve bağlı olarak tipik 15-30 saniyelik açık bir istemci tarafı zaman aşımı belirleyin ve bu süre dolmadan önce sade bir sessizlikten sonra değil, "bu beklenenden uzun sürüyor" diyen ayrı bir durum gösterin. Dört adlandırılmış durumlu bir durum makinesi (`idle`, `streaming`, `timed-out`, `failed`) hatayı kökünden önler: geçiş yapabileceği bir `timed-out` durumu olmayan bir spinner, tanım olarak hiçbir zaman sonuçlanamaz; bu yüzden sonsuza kadar döner veya bileşen kaldırıldığında animasyon ortasında donup kalır.

```ts
type AiRequestState =
  | { status: 'idle' }
  | { status: 'streaming'; partial: string }
  | { status: 'timed-out' }
  | { status: 'failed'; error: string }
  | { status: 'done'; result: string }
```

## Akan metin gerçekte nasıl çizilmeli?

Token'ları geldikleri anda çizin, ama yarım markdown ve kapanmamış kod bloklarını çizmeden önce tamponlayın; böylece kullanıcı asla yarım çizilmiş bir ``` veya hiç kapanmayan kalın bir kelime görmez. Yanıt konteynerinin minimum yüksekliğini — boş bir iskelet kutusu olsa bile — ilk token gelmeden önce ayırın; böylece içerik büyürken sayfa kaymaz. Ayrılmamış alan, yapay zeka sohbet arayüzlerindeki düzen kayması şikayetlerinin en büyük tek kaynağıdır ve arama motorlarının sıralama sinyali olarak kullandığı Core Web Vitals metriklerinden Cumulative Layout Shift'i doğrudan kötüleştirir.

Ekran okuyucu desteği için `role="status"` canlı bölgesi kullanın, ama her token'ı duyurmayın — bu, ekran okuyucu kullanıcısının takip edemeyeceği bir gürültü duvarı üretir. Akış sırasında konteynere `aria-busy="true"` koyarak yardımcı teknolojinin duyuruları beklemesini sağlayın, sonra akış tamamlandığında bunu temizleyip son cevabı bir kez okutun. Bu kasıtlı bir ödünleşim: token token duyuru teknik olarak "canlı" ama pratikte kullanılamaz, bu yüzden tamamlanma anında yapılan tek ve temiz bir duyuru daha iyi bir varsayılan — [2026 tarihli ayrıntılı bir yapay zeka erişilebilirlik denetimi](https://tianpan.co/blog/2026-05-14-ai-accessibility-audit-nobody-runs) bu noktayı daha derinlemesine işliyor ve yayınlanan yapay zeka ürünlerinin hemen hiçbirinin bunu doğru yapmadığını belirtiyor.

## Doğru bir hata ve yeniden deneme durumu neye benzer?

Her hata arayüzde üç şeye ihtiyaç duyar: belirli bir mesaj ("Bir şeyler ters gitti" değil), aynı isteği yeniden gönderen bir yeniden deneme düğmesi ve — mantıklı olduğunda — yapay zeka özelliğine hiç bağlı olmayan bir yol. Açıklama yazmak için yapay zeka kullanan ama model çağrısı başarısız olduğunda düz boş bir metin alanına düşen bir form hâlâ tam kullanılabilir; yapay zeka çağrısı başarılı olana kadar boş kalan veya devre dışı kalan bir form değil.

Yutulan hatalar genellikle eksik bir `.catch()` veya çevresinde hata sınırı olmayan bir `await`'tir. Çözüm egzotik değil — hata yolunun her seferinde *bir şey* çizmesini sağlamak, onu başarıyla aynı görünen değişmemiş bir arayüze düşmesine izin vermek yerine.

## Hız sınırları ve "model çöktü" durumu nasıl ele alınır?

Gösterdiğiniz mesajda hız sınırını gerçek bir kesintiden ayırın, çünkü doğru kullanıcı eylemi farklıdır: hız sınırı "bir anlığına yeniden deneyin" demektir (ideal olarak bir geri sayım veya geri çekilmeli otomatik yeniden deneme gösterirsiniz), kesinti ise "bu özellik geçici olarak kullanılamıyor" ve yapay zeka dışı bir yedek yol demektir. 429 yanıtını ve 503 yanıtını aynı jenerik "başarısız" kovasına değil, farklı arayüz durumları olarak ele alın — ikisini tek bir mesaja sıkıştırmak, kullanıcılara yarı zamanda yanlış talimat veren yaygın bir kestirme yoldur.

## Buraya kademeli iyileştirme eklemenin en basit yolu nedir?

Önce yapay zeka içermeyen yolu kurun — manuel form alanı, anahtar kelime araması, statik varsayılan — ve yapay zeka özelliğini, kullanıcının her an çıkabileceği bir iyileştirme olarak üzerine katman katın, sıkışıp kaldığı bir kapı olarak değil. Somut olarak: yapay zeka eylemiyle birlikte, sadece başarısız olduktan sonra değil, her zaman görünür bir "ben kendim yazayım" veya "yapay zeka önerisini atla" seçeneği bulundurun. Bu tek kalıp — yapay zekayı zorunlu bir adım değil, isteğe bağlı bir hızlandırıcı olarak kullanmak — "özellik bozuk hissettiriyor" şikayetlerinin çoğunu daha oluşmadan ortadan kaldırır, çünkü yavaş veya başarısız bir model çağrısı her zaman var olan bir özelliğe düşer, çıkmaz sokağa değil.

Benim yorumum: ekipler bu hataları gönderiyor çünkü bir yapay zeka çağrısı kodda bir fetch() gibi görünüyor ve arayüzde de öyle ele alınıyor, oysa davranışı uzun süren bir işe daha yakın. Bunu başından açık durumlara eşlemek özellik başına belki bir saat ek maliyet getirir ve sonradan çok daha fazla zaman yiyen "yapay zeka bu, tuhaf olması normal" hata raporlarının çoğunu önler. Bu konunun erişilebilirlik tarafı için [standart erişilebilirlik kontrol listesi](/tr/posts/web-erisilebilirlik-kontrol-listesi) ve [erişilebilir form kontrol listesi](/tr/posts/erisilebilir-form-olusturma-kontrol-listesi), akış arayüzlerinin üzerine kurulduğu canlı bölge ve odak yönetimi temellerini kapsıyor; yukarıdaki durum makinesi yaklaşımı, "model çağrısı" tek bir tamamlama değil çok adımlı bir ajan çalışması olduğunda [yapay zeka ajanları için API tasarımı](/tr/posts/yapay-zeka-ajanlari-icin-api-tasarimi) ile iyi eşleşiyor.

## Sıkça Sorulan Sorular

### Yapay zeka özelliğimin spinner'ı neden hiç durmuyor?

Neredeyse her zaman istemci tarafında zaman aşımı olmadığı için: sunucu vazgeçtikten veya bağlantı kesildikten sonra bile istek arayüzün durumunda teknik olarak hâlâ "beklemede" kalıyor. Spinner'ı gidecek bir yer bırakmadan bekletmek yerine, arayüzü ayrı bir "zaman aşımına uğradı" durumuna geçiren açık bir zaman aşımı (tipik olarak 15-30 saniye) ekleyin.

### Yapay zeka metni akarken sayfanın zıplamasını nasıl durdururum?

İlk token gelmeden önce, boş bir iskelet kutusu olsa bile, yanıt konteynerinin minimum yüksekliğini ayırın ve yarım markdown veya kod bloklarını ham hâlde çizmek yerine tamponlayın. Ayrılmamış alanın token token büyümesi, akışlı yapay zeka arayüzlerindeki düzen kaymasının en yaygın nedenidir.

### Ekran okuyucu her akan token'ı duyurmalı mı?

Hayır. Akış sırasında canlı bölgeye `aria-busy="true"` koyarak yardımcı teknolojinin token başına duyuruları bastırmasını sağlayın, akış bittiğinde bunu temizleyip tam cevabı bir kez duyurun. Her token'ı duyurmak, çoğu ekran okuyucu kullanıcısının takip edemeyeceği bir gürültü üretir.

### Yapay zeka modeli çöktüğünde veya hız sınırına girdiğinde ne olmalı?

Hız sınırını (kısa süre sonra yeniden deneyin, ideal olarak bir geri sayımla) bir kesintiden (özellik şu an kullanılamıyor) ayıran belirli bir mesaj gösterin ve her zaman yapay zeka dışı bir yedek yol sunun — manuel giriş, önbellekli sonuç veya bir varsayılan — böylece özelliğin kalanı çalışmaya devam eder.
