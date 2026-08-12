---
title: "Küçük Siteler İçin Programatik SEO"
slug: "kucuk-siteler-programatik-seo"
translationKey: "programmatic-seo-small-sites"
locale: "tr"
excerpt: "Şablonlu sayfalar gerçekten kullanıcıya yarayabilir ya da düpedüz spam olarak okunabilir — farkı belirleyen veridir, sayfa sayısı değil. Çizgi tam olarak orada."
category: "digital-marketing"
tags: ["seo", "best-practices", "technical-writing", "automation"]
publishedAt: "2026-08-12"
seoTitle: "Küçük Ekipler İçin Programatik SEO Rehberi"
seoDescription: "Küçük ekipler için tersine bir programatik SEO rehberi: gerçek veri kaynağı, şablon tasarımı, crawl bütçesi, budama ve 2026 için bir go/no-go listesi."
---

Programatik SEO, üretilen her sayfa gerçek bir veri kümesinin tekil olarak cevaplayabildiği bir sorguya karşılık geldiğinde işe yarıyor; şablon bilgilendirmek için değil sıralamak için varsa cezayı da beraberinde getiriyor. Belirleyici değişken sayfa sayısı değil, sayfa başına gerçek bir verinin var olup olmadığı.

## Çizgi Aslında Nerede

Çoğu yazı programatik SEO'yu "iyi versiyon, kötü versiyon" diye ikiye ayırıyor. Gerçekte tek bir sert sınırı olan bir spektrum bu: sayfa, kullanıcının başka yerde daha hızlı bulamayacağı bir bilgi içeriyor mu? Canlı stok sayısı, gerçek fiyat ya da tek bir şehir veya ürüne özgü toplulaştırılmış veri çeken sayfa bu çizgiyi geçiyor. `{şehir}` değişkenini üç paragraflık aynı kalıp metne yerleştiren sayfa geçmiyor — metin ne kadar akıcı yazılmış olursa olsun.

Google'ın doorway (kapı) sayfa tanımı bu konuda net: dar bir sorguda sıralanmak için özel olarak oluşturulan, sonra kullanıcıyı başka bir yere yönlendiren, kendi başına bağımsız değeri neredeyse hiç olmayan düşük kaliteli sayfa. Klasik örnek "[hizmet] [şehir]" kalıbının yüzlerce şehir adıyla tekrarlanması — arkasında gerçek şehre özgü içerik olmadan, aynı üç paragraf, değişen tek şey isim.

| Sinyal | Gerçekten faydalı şablon | Doorway spam |
|---|---|---|
| Veri kaynağı | Canlı veri kümesi, API veya güncel tutulan dizin | Yok — her şablon için metin üretiliyor |
| Sayfa başına ne değişiyor | Gerçek sayılar, karşılaştırmalar, kullanıcı içeriği | Sadece yerleştirilen değişken |
| Kullanıcı yer imine eklerdi mi | Muhtemel | Hayır |
| Sayfa sayısı vs. sürdürülebilirlik | Ekibin gerçekten güncel tutabildiği kadar | Kimsenin denetleyemeyeceği hızda büyüyor |
| Asıl amaç | Belirli bir arama niyetini karşılamak | Sıralamak, sonra niyeti başka yere yönlendirmek |

## Gerçekten Sahip Olduğunuz Veriyle Başlayın

Bir programatik SEO projesinin ilk çekirdek güncellemeyi atlatıp atlatamayacağını en iyi tahmin eden şey, projenin veriden mi yoksa şablondan mı başladığı. "Hadi 500 sayfa şablonlayalım" diye başlayıp sonra içi doldurulacak içerik arayan projeler neredeyse her zaman ince (thin) kalıyor. "Zaten 500 şey için yapılandırılmış verimiz var" diyip hangilerinin sayfayı hak ettiğini soran projeler ise ayakta kalıyor.

Kullanılabilir kaynaklar: canlı sorguladığınız bir API (fiyat, stok, teknik özellik), gerçekten küratörlüğünü yaptığınız bir dizin, zaman içinde biriktirdiğiniz geçmiş veri ya da siz sayfayı kurmadan önce var olmayan yapılandırılmış kullanıcı içeriği (yorumlar, gönderiler, karşılaştırmalar). Yapay zekânın burada meşru bir rolü var — veri tablosunun etrafındaki bağlayıcı metni yazmak gibi — ama sayfa başına asıl verinin kaynağı asla yapay zekâ olmamalı. Sayfalar arasında değişen tek şey modelin anında uydurduğu metinse, daha iyi gramerli bir spam motoru kurmuşsunuz demektir.

## Her Sayfayı Hak Eden Şablon Tasarımı

Kümedeki her sayfanın er ya da geç, aynı sorguyu hedefleyen bir rakip sayfayla yan yana tek başına değerlendirileceğini varsayın. Bu karşılaştırmadan ne sağ çıkar?

Savunulabilir bir şablon, değişken yerleştirmenin ötesinde bir şey garanti eder: gerçek sayılardan hesaplanan bir grafik ya da istatistik bloğu, girdiye göre şekli değişen bir karşılaştırma tablosu, o varlığa özgü gerçek kullanıcı yorumları veya başka bir sayfaya kopyalanınca yanlış hale gelecek hesaplanmış bir sıralama/öneri. Sade ama dürüst bir yapı şöyle görünür:

```text
[Varlık adı + hesaplanmış temel istatistik]
[1-2 cümle özgün bağlam: bu varlığı farklı kılan ne]
[Veri tablosu veya grafik: gerçek, varlığa özgü sayılar]
[Kullanıcı içeriği bloğu varsa: yorumlar, S&C, gönderiler]
[İlgili varlıklar: dolgu değil, gerçek iç bağlantılar]
```

Veri tablosunu ve grafiği silseniz sayfa yine aynı okunuyorsa, şablon işini yapmıyor demektir — bir doorway'in etrafına sarılmış süsten ibaret. Bu noktada [konu otoritesi ve içerik kümeleri rehberimizi](/tr/posts/konu-otoritesi-icerik-kumeleri-seo) de okumak faydalı: bir sayfa kümesi ancak gerçek derinliği olan bir kümenin içinde durduğunda değer biriktiriyor, tek başına havada asılı kalmıyor.

## Sayfa Kümesi İçin İç Bağlantı ve Crawl Bütçesi

Hub yapısı olmayan bin sayfa bir strateji değil, yetim sayfa çiftliğidir. Küçük sayıda hub sayfası kurun — kategoriye göre, coğrafyaya göre, kullanıcıların gerçekten gezindiği hangi boyuta göreyse — her üretilen sayfayı en az bir hub'a bağlayın, her hub'ı da ana navigasyona bağlayın. Hub'ları tek bir indekslenemez listeye tüm alt sayfaları boca etmek yerine mantıklı biçimde sayfalandırın ve her sayfanın rastgele değil gerçekten ilgili iki üç sayfaya yatay bağlantı vermesini sağlayın.

Crawl bütçesi, küçük bir sitede bile birkaç yüz URL'yi aştıktan sonra gerçek bir kısıt haline geliyor. Site haritanız 5.000 sayfa listeliyor ama Googlebot sitenizin otoritesine göre haftada ancak 400'ünü taramayı gerekli görüyorsa, en çok indekslenmesi gereken sayfalar hub'a en yakın olanlar olmalı, dört tık derinde gömülü değil. Search Console'un tarama ve indeksleme raporlarını sitenin geneli için değil, özellikle bu sayfa kümesi için takip edin — bir ölçeklenme sorununun ilk göründüğü yer genelde burası, sıralamalar kıpırdamadan çok önce.

## Kalite Kapıları ve Budama

Budama, sayfa kümesi kötü performans gösterdikten sonra yapılan bir temizlik değil, ilk günden planlanmış bir süreç parçası. Bir gözden geçirme sıklığı belirleyin (küçük ekipler için üç ayda bir makul) ve her sayfayı üç kovadan birine ayırın: indekste tut, noindex yap ya da sil ve hub'a 301 yönlendir.

Makul bir eşik: tam bir çeyrek boyunca sıfır organik tıklama, şablon değişkeninin ötesinde tekil bir veri noktası yok ve eklemenin bir yolu da yok — bu durumda noindex ya da silme uygulanır. Gösterim var ama tıklama yoksa sorun genelde konu değil şablonun değer önerisi, bu da silmek yerine yeniden yazmaya aday demek. Bu disiplin küme büyüdükçe daha da önem kazanıyor: 50 sayfalık bir kümede üç zayıf giriş yuvarlama hatası, 5.000 sayfalık bir kümede 1.500 zayıf giriş ise tam olarak scaled content abuse incelemesini tetikleyen kalıp.

## 2026'da Yapay Zekâ İçerik Eşiği

Ağustos 2026 itibarıyla Google'ın [Search Essentials & Spam Policies dokümantasyonu](https://developers.google.com/search/docs/essentials/spam-policies) içselleştirilmesi gereken bir noktayı açıkça koyuyor: [scaled content abuse politikası](https://developers.google.com/search/docs/essentials/spam-policies#scaled-content-abuse) yönteme bakmıyor. Politika, kullanıcıya yardımcı olmadan öncelikli olarak sıralamayı manipüle etmek için ölçekte üretilen içeriği hedef alıyor — "nasıl oluşturulduğuna bakılmaksızın." Yani insan eliyle yazılan ince bir sayfayla yapay zekâyla yazılan ince bir sayfa aynı şekilde cezalandırılıyor; doğru, özgün ve faydalı olan yapay zekâ destekli bir sayfa ise tamamen elle yazılmış bir sayfayla aynı muameleyi görüyor. Gerçek bir ihlalde genelde birlikte görünen üç koşul var: sayfa çok sayıda benzer sayfadan biri, asıl amacı gerçek bir ihtiyaca hizmet etmek değil sıralamak ve sayfanın az ya da hiç özgün değeri yok.

Bu, ekiplerin sorması gereken soruyu değiştiriyor. "Bunu yapay zekâ mı yazdı" teşhis edici soru değil — Google da bunu sormuyor. "Bu sayfa gerçek bir sorguya cevap vermek için mi var, yoksa bir tane daha üretebildiğimiz için mi" sonucu belirleyen soru. [Yapay zekâ çöpü ve açık kaynak güvenliği yazımız](/tr/posts/ai-copu-acik-kaynak-guvenligi) aynı kalite eşiği sorununu güvenlik açısından ele alıyor; mantık birebir aynı. Klasik sıralamanın ötesinde görünürlük açısından [GEO rehberimize](/tr/posts/geo-yapay-zeka-aramalarinda-gorunurluk) bakabilirsiniz — Arama'da başarısız olan aynı doorway kalıbı, AI Overviews'ta daha da hızlı eleniyor; [AI özetlerinin tıklamaları nasıl etkilediği yazımız](/tr/posts/ai-ozetleri-tiklama-hayatta-kalma) ise bağımsız değeri olmayan bir sayfanın, üstünde zaten bir cevap kutusu varken tıklamadan kazanacağı şeyin daha da az olduğunu anlatıyor.

Kendi görüşüm: gördüğüm programatik SEO başarısızlıklarının çoğu şablon sorunu değil, veri sorunu. Varlık başına zengin gerçek veriye sahip bir ekip sade görünümlü bir şablonla bile iyi sıralanabiliyor, çünkü içerik incelemeye dayanıyor. İnce veriye sahip bir ekip ise bunu ne kadar akıllıca şablonlasa da kurtaramıyor — sadece bir doorway'i cilalıyor. Önce veri sorununu çözün, SEO'nun büyük kısmı kendiliğinden hallolur; bu aynı kalıp [yerel SEO kontrol listemizde](/tr/posts/yerel-seo-2026-google-business-profil) de geçerli: "yakınımdaki lokasyonlar" sayfa kümesi ancak her lokasyonun arkasında gerçek bir profil varsa işe yarıyor.

## Sayfa Kümesi Üretmeden Önce Go/No-Go Kontrol Listesi

Bunu ilk şablonu yazmadan önce çalıştırın, ilk yüz sayfa yayına girdikten sonra değil.

| Soru | Go | No-Go |
|---|---|---|
| Her sayfanın arkasında gerçek bir veri kümesi, API ya da güncel dizin var mı? | Evet | Sayfa başına dolgu metin yazmayı planlıyoruz |
| Şablon değişkeninden bağımsız olarak değişen bir şey var mı (grafik, istatistik, yorum)? | Evet | Sadece değişken değişiyor |
| Her sayfanın bağlanacağı hub'ı adlandırabiliyor muyuz? | Evet | Sayfalar yetim kalacak ya da gömülü kalacak |
| Yayından önce planlanmış bir budama sıklığı ve sorumlusu var mı? | Evet | "Zayıf sayfalarla sonra ilgileniriz" |
| Kümeden rastgele 20 sayfayı bir incelemeci okusa rahat olur muyduk? | Evet | Sadece en iyilerini gösterirdik |
| Bu sayfa sayısını Search Console'da gerçekten izleyebiliyor muyuz? | Evet | Kaç sayfa ürettiğimizi bilmiyoruz |

Birden fazla cevap No-Go sütununa düşüyorsa çözüm daha küçük bir yayın tarihi değil, daha dar bir veri kapsamı ve daha güçlü bir şablon.

## Sıkça Sorulan Sorular

### Programatik SEO Google'ın kurallarına aykırı mı?

Hayır. Google'ın spam politikaları yöntemi değil sonucu hedef alıyor — az özgün değeri olan, öncelikli olarak sıralamayı manipüle etmek için ölçekte üretilen içerik. Kullanıcıya gerçekten yararlı olan şablonlu, veriye dayalı sayfalar açıkça sorun değil; doorway ve scaled content abuse politikaları tekniğin kendisi için değil, ince versiyonu için var.

### Küçük bir ekip için bir seferde kaç sayfa çok fazla sayılır?

Sabit bir sayı yok. Asıl kısıt inceleme kapasiteniz: kümenin anlamlı bir örneklemini özgün değer açısından denetleyemiyor ve bir budama sıklığına söz veremiyorsanız, 200 sayfa da olsa 20.000 sayfa da olsa çoktan fazla üretmişsiniz demektir.

### Sayfa metnini yapay zekâyla yazmak ceza alma ihtimalini artırır mı?

Tek başına hayır. Google'ın açıklanmış politikası yapay zekâ katılımının tetikleyici olmadığını net biçimde söylüyor — kim yazarsa yazsın, ölçekte üretilen ince ve faydasız içerik tetikleyici. Gerçek, varlığa özgü veriye dayanan yapay zekâ destekli sayfalar tamamen elle yazılmış sayfalarla aynı eşikle değerlendiriliyor.

### Bir sayfa kümesinin doorway spam'e benzemeye başladığının ilk işareti nedir?

Kümedeki indekslenmiş sayfa sayısına oranla düz ya da düşen organik tıklama oranı, buna eşlik eden hiç tıklamaya dönüşmeyen gösterimler. Bu genelde Google'ın sayfaları indekslediği ama kullanıcıların onları ziyarete değer bulmadığı anlamına geliyor — tam olarak manuel ya da algoritmik bir spam incelemesinin yakalayacağı sinyal.
