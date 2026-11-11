---
title: "Junior Geliştiricilere İyi Mentorluk Nasıl Yapılır?"
slug: "junior-gelistirici-mentorluk"
translationKey: "how-to-mentor-junior-developers"
locale: "tr"
excerpt: "Kısa cevap: kodu yazmak yerine karar sürecini görünür kılın. Juniorun sizin çözümünüzü kopyalamasını değil, kendi çözümüne ulaşmasını sağlayın."
category: "career-productivity"
tags: ["career", "developer-growth", "learning", "communication"]
publishedAt: "2026-11-11"
seoTitle: "Junior Geliştiricilere İyi Mentorluk Nasıl Yapılır?"
seoDescription: "Junior geliştiricilere mentorluk yaparken yapılan en büyük hata, kodu düzeltmek. İlk 90 gün planı, struggle budget ve öğretici kod incelemesiyle doğru yöntem."
---

Kısa cevap: kodu kendiniz düzeltmek yerine juniorun karar verme sürecini görünür kılın. İyi mentorluk, biri sorun yaşadığında hemen çözümü yazmak değil, "buraya nasıl geldin, şimdi ne deneyeceksin" sorusunu sormak ve cevabı beklemektir — bu, juniorun sizin çözümünüzü ezberlemesi yerine kendi çözme kasını geliştirmesini sağlar.

## Mentorlukta En Büyük Hata Nedir?

En büyük hata, bir junior saplandığında klavyeyi elinden alıp sorunu kendiniz çözmek. Bu, kısa vadede hızlı görünür ama juniorun aynı hatayı bir ay sonra tekrar yapmasına yol açar, çünkü hiçbir zaman hatayı kendi başına bulma deneyimini yaşamamıştır. Daha iyi bir mentor, "şu an ne biliyorsun, şu an ne denedin" diye sorar ve juniorun kendi teşhis sürecini sesli düşünmesini ister; çözümü vermek yerine doğru soruyu sormak, öğrenmeyi gerçekten tetikleyen şey.

## AI Kod Yazarken Juniorlar Ne Öğrenmeli?

Artık boilerplate kodu bir asistan birkaç saniyede üretiyor, bu yüzden juniorların öğrenmesi gereken şey kod yazmak değil, üretilen kodun doğru olup olmadığına karar vermek. Bu üç beceriye indirgenebilir: önerilen bir çözümün neden çalıştığını (ya da çalışmayacağını) okuyarak anlamak, bir hatayı sistematik olarak izole etmek ve bir AI asistanına ya da bir seniora doğru soruyu sormak. [AI ile verimlilik paradoksunu](/tr/posts/yapay-zeka-verimlilik-paradoksu) ele aldığımız yazıda gösterdiğimiz gibi, kod üretme hızı arttıkça asıl darboğaz bu üretilen kodu değerlendirme becerisine kayıyor — ve bu beceri, mentorluk olmadan kendiliğinden gelişmiyor.

[Stanford HAI'nin 2026 AI Index raporuna](https://hai.stanford.edu/ai-index/2026-ai-index-report) dayanan çok sayıda analiz, 22-25 yaş arası yazılım geliştiricilerin istihdamının 2022 zirvesinden bu yana yaklaşık %20 düştüğünü, aynı dönemde 30 yaş üstü geliştiricilerde ise büyüme olduğunu bildiriyor. Bu, junior rollerin kaybolduğu anlamına gelmiyor; şirketlerin artık o rolden farklı bir şey beklediği anlamına geliyor — kod üretmek değil, üretilen kodu denetlemek. [LinkedIn'in Economic Graph ekibinin yazılım mühendisliği iş piyasası raporu](https://economicgraph.linkedin.com/workforce-data/publications) da aynı yönde: AI okuryazarlığı becerilerini (prompt mühendisliği dahil) listeleyen ilan sayısı ABD'de yıldan yıla %70 arttı, bu da işe alımın artık "kod yazabilir mi" sorusundan "üretilen kodu değerlendirebilir mi" sorusuna kaydığını gösteriyor.

## İlk 90 Günü Nasıl Yapılandırırsınız?

İlk 90 günü üç net aşamaya bölün: ilk ay okuma ve küçük, geri alınabilir değişiklikler (bir test düzeltmesi, bir dokümantasyon güncellemesi); ikinci ay tek başına ama gözetimli özellik çalışması; üçüncü ay bir incident'a veya karmaşık bir hataya ilk kez tek başına müdahale. Her aşamanın net bir "bitti" tanımı olmalı — "artık rahat hissediyor" gibi öznel bir ölçüt değil, "bu üç PR'ı inceleme yorumu almadan mergeledi" gibi somut bir eşik.

## Kod İncelemesi Nasıl Öğretim Aracına Dönüşür?

Kod incelemesi, hatayı bulup "bunu düzelt" demek değil, juniorun kendi hatasını bulmasına yardım eden sorular sormaktır. "Bu satır neden burada" ya da "bu edge case'i test ettin mi" gibi bir soru, direkt bir düzeltme talebinden daha yavaş ama kalıcı öğrenme üretir. Kapı bekçiliği (gatekeeping) ile öğretim arasındaki fark şu: bekçi, PR'ı geçirmeden önce kusursuz olmasını ister; öğretici, bu PR'da bir şey öğrenilmiş mi diye sorar ve küçük kusurları bir sonraki PR'a bırakabilir.

## "Struggle Budget" Nedir?

Struggle budget, bir juniorun bir sorunla kaç dakika/saat tek başına boğuşmasına izin vereceğinizi önceden belirlediğiniz bütçedir — ne çok erken müdahale (öğrenmeyi keser) ne çok geç müdahale (motivasyonu tüketir). Pratikte bu, bir görev verirken "burada 45 dakika sıkışırsan bana yaz, daha önce değil" demek kadar basit bir cümle olabilir. Zaman sınırı olmadan "takıldıysan sor" demek, çoğu juniorın ne zaman sorması gerektiğini bilememesine yol açar; net bir bütçe bu belirsizliği ortadan kaldırır.

| Aşama | Süre | Mentor rolü | Başarı ölçütü |
| --- | --- | --- | --- |
| Okuma + küçük düzeltme | 1. ay | Gözlemci, bol bağlam verir | Küçük PR'lar az yorumla geçer |
| Gözetimli özellik | 2. ay | Soru soran, nadiren çözen | Tasarımı önceden anlatabilir |
| Tek başına müdahale | 3. ay | Yedek, sadece struggle budget dolunca devreye girer | İlk incident'ı not tutarak çözer |

## Takılan Bir Juniora Doğru Müdahale Nasıl Görünür?

Bir junior, bir API entegrasyonunda üç gündür aynı 401 hatasına saplanmıştı; token'ı her defasında yeniden oluşturup aynı hatayı alıyordu. Yanlış müdahale, token'ı kendim kontrol edip "burada sorun var, şöyle düzelt" demek olurdu. Doğru müdahale şuydu: "401'i aldığın anda ne loglanıyor, bana ekranı göster" dedim; birlikte logladığımızda sorunun token süresi değil, isteğin yanlış ortam URL'sine gittiği ortaya çıktı. Junior sorunu kendi gözüyle buldu, ben sadece nereye bakacağını gösterdim — ve bir hafta sonra benzer bir hatayı kendi başına çözdü. Eğer o gün token'ı kendim değiştirip "tamam, şimdi çalışıyor" deseydim, bir hafta sonraki o bağımsız çözüm hiç gerçekleşmeyecekti; junior, bir dahaki sefere yine bana gelecekti çünkü hiçbir zaman kendi başına bir 401'i nereden başlayıp çözeceğini öğrenmemiş olacaktı.

## Büyümeyi Nasıl Ölçersiniz?

Büyümeyi "ne kadar kod yazdı" ile değil, "bağımsız çözdüğü sorun karmaşıklığının zaman içindeki eğrisi" ile ölçün. Pratik göstergeler: incident'larda kaç kez ilk müdahaleci oldu, kod incelemesinde kendi PR'larına ne kadar az yorum geldi, ve bir seniora sorduğu soruların zamanla "ne yapmalıyım" tipinden "şu iki yaklaşımdan hangisini önerirsin" tipine kaymış olması. Bu son değişim, juniorun artık çözümü biliyor ama tercih arıyor olduğunu gösteriyor — kalite sıçramasının en net işareti. Bu eğriyi takip etmek için karmaşık bir araç gerekmiyor; her ay tek bir cümlelik not ("bu ay ilk kez bir incident'ı tek başına triyaj etti" gibi) altı ay sonra geriye bakıldığında net bir ilerleme çizgisi gösteriyor.

Açıkçası çoğu şirket mentorluğu "iyi insanlar doğal olarak yapar" diye bir yan iş gibi görüyor ve bunun için ayrı zaman ya da tanınma vermiyor; bu yüzden en iyi mentorlar bile tükeniyor veya sessizce bırakıyor. Mentorluğu bir performans kriteri olarak saymayan bir şirkette, en iyi niyetli senior bile struggle budget'ı uygulayacak zamanı bulamaz. [Junior'dan senior'a giden yol haritasını](/tr/posts/juniordan-senior-gelistiriciye) okuyan biri, burada anlatılan aşamaların kendi gelişiminde nereye denk geldiğini de görebilir; [junior geliştirici iş piyasasının 2026'daki durumuna](/tr/posts/junior-yazilimci-isleri-2026) dair yazımız ise bu mentorluk ihtiyacının neden şimdi daha kritik olduğunu gösteriyor. Kariyer ve üretkenlik kategorisindeki diğer yazılara [buradan](/tr/category/kariyer-uretkenlik) ulaşabilirsiniz.

## Sıkça Sorulan Sorular

### Junior bir geliştiriciye mentorluk yaparken en sık yapılan hata nedir?

En sık hata, junior bir sorunda saplandığında sorunu mentor olarak hemen çözmek; bu kısa vadede hızlı görünse de juniorun kendi teşhis sürecini geliştirmesini engeller ve aynı hatanın tekrarlanma olasılığını artırır.

### "Struggle budget" nasıl uygulanır?

Bir görev verirken ne kadar süre tek başına denemesi gerektiğini önceden söyleyin — örneğin "45 dakika sıkışırsan yaz, daha önce değil." Bu, juniorun ne zaman yardım istemesi gerektiğini bilmemesinden kaynaklanan belirsizliği ortadan kaldırır ve hem erken hem gecikmiş müdahaleyi önler.

### Kod incelemesi mentorluk aracı olarak nasıl kullanılır?

Hatayı bulup düzeltme talebi yazmak yerine, juniorun kendi hatasını bulmasına yardım eden sorular sorun: "bu satır neden burada," "bu edge case'i test ettin mi." Bu yöntem direkt düzeltmeden daha yavaş ama kalıcı öğrenme üretir ve kod incelemesini bekçilikten öğretime çevirir.

### AI araçları junior geliştiricilerin öğrenmesi gereken becerileri değiştirdi mi?

Evet — boilerplate kod artık saniyeler içinde üretildiği için asıl beceri kod yazmak değil, üretilen kodun doğru olup olmadığına karar vermek, bir hatayı sistematik izole etmek ve doğru soruyu sormak oldu; bu üç beceri mentorluk olmadan kendiliğinden gelişmiyor.
