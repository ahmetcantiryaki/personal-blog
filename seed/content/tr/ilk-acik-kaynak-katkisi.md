---
title: "İlk Açık Kaynak Katkınızı Nasıl Yaparsınız?"
slug: "ilk-acik-kaynak-katkisi"
translationKey: "make-your-first-open-source-contribution"
locale: "tr"
excerpt: "Kısa cevap: küçük başlayın. 'good first issue' bulup CONTRIBUTING okuyarak hazırladığınız 10 satırlık düzeltme, bitmemiş bir yan projeden daha değerli."
category: "career-productivity"
tags: ["open-source", "career", "git", "community"]
publishedAt: "2026-11-11"
seoTitle: "İlk Açık Kaynak Katkınızı Nasıl Yaparsınız?"
seoDescription: "İlk PR'ınızı korku duymadan merge ettirmek için good-first-issue bulma, CONTRIBUTING okuma, küçük bir düzeltme açma ve reddedilmeyle baş etme rehberi."
---

Kısa cevap: küçük başlayın. "good first issue" etiketli bir sorunu bulup projenin CONTRIBUTING dosyasını okuyarak hazırladığınız 10 satırlık bir düzeltme, yarım kalmış bir yan projeden daha fazla şey kanıtlar — çünkü biri tarafından gerçekten incelenmiş ve kabul edilmiştir.

## Açık Kaynağa Katkı, Bir Yan Projeden Neden Daha Değerli?

Bir yan proje sadece kod yazabildiğinizi gösterir; bir merge edilmiş PR, başka birinin kod tabanını okuyabildiğinizi, bir ekibin kurallarına uyabildiğinizi ve eleştiriyi kabul edip düzeltme yapabildiğinizi kanıtlar. İşe alım sürecinde bu ikincisi çok daha nadir ve çok daha aranan bir sinyal; bir mülakatta "bu PR'ı neden böyle yazdın" sorusuna gerçek bir cevabınız oluyor, hayali bir proje anlatmak zorunda kalmıyorsunuz. [Junior'dan senior'a giden yol haritasında](/tr/posts/juniordan-senior-gelistiriciye) da belirttiğimiz gibi, işe alımda asıl ayırt edici şey artık "kod yazabiliyor mu" değil, "başka birinin kod tabanında güvenle hareket edebiliyor mu" sorusu — ve açık kaynak katkısı bunu kanıtlamanın en ucuz yolu.

## İlk Katkı İçin Hangi Sorunu Seçmelisiniz?

En güvenli başlangıç, "good first issue" etiketli, maintainer'ın "bunu yeni başlayanlar için ideal görüyoruz" dediği sorunlar. [GitHub'ın resmi belgelerine göre](https://docs.github.com/en/get-started/exploring-projects-on-github/contributing-to-open-source) bu etiket, GitHub'ın bir projedeki en yaklaşılabilir sorunları belirleyip öne çıkarmasına da yardımcı oluyor; bir depoda `github.com/<sahip>/<depo>/contribute` adresine giderek bu etiketli açık sorunları doğrudan listeleyebilirsiniz. Kod dışı katkılar da sayılıyor: dokümantasyon düzeltmesi, eksik bir testin eklenmesi, çeviri veya issue triyajı — bunların hepsi [Open Source Guides'ın belirttiği gibi](https://opensource.guide/how-to-contribute/) gerçek katkı, sadece kod değil.

## Projeyi Yerel Olarak Nasıl Kurarsınız?

Önce CONTRIBUTING dosyasını baştan sona okuyun — çoğu proje, hangi dal stratejisini kullandığını, testlerin nasıl çalıştırıldığını ve commit mesajı formatını orada yazar; bunu atlayıp doğrudan koda dalmak, geri bildirimde en çok zaman kaybettiren hata. Sonra standart akışı izleyin:

```bash
git clone https://github.com/<kullanici-adiniz>/<depo>.git
cd <depo>
git checkout -b fix/kisa-aciklama
# değişikliği yapın, testleri çalıştırın
git commit -m "fix: kısa ve net açıklama"
git push origin fix/kisa-aciklama
```

Bazı projeler katkı için DCO (Developer Certificate of Origin) istiyor, bazıları CLA (Contributor License Agreement) istiyor. DCO, her commit'e eklediğiniz bir "Signed-off-by" satırıyla "bu kodu ben yazdım" demenizdir (`git commit -s` bunu otomatik ekler); CLA ise bir kere imzalanan, gelecekteki tüm katkılarınızı kapsayan ayrı bir hukuki belge. Linux çekirdeği, GitLab (2017'de) ve Chef (2016'da) CLA'dan DCO'ya geçti çünkü ikincisi katkı sağlayan için çok daha az sürtünmeli.

## Kapsamı Nasıl Küçük Tutarsınız?

İlk PR'ınızda tek bir şeyi düzeltin — bir hata, bir eksik test veya bir dokümantasyon hatası — ve o PR'a ilgisiz bir yeniden düzenleme eklemeyin. Bir maintainer için 300 satırlık, üç farklı konuyu birden çözen bir PR'ı incelemek saatler alır ve genelde rafa kalkar; 15 satırlık, tek amaçlı bir PR aynı gün bile incelenebilir. Kapsamı küçük tutmak, hem incelemeyi hızlandırır hem de reddedilme riskini düşürür. Elinizdeki değişiklik birden fazla dosyayı veya birden fazla mantıksal konuyu kapsıyorsa, onu ayrı PR'lara bölmek neredeyse her zaman doğru karardır.

## PR Açıklamasını Nasıl Yazmalısınız?

Açıklamada üç şeyi net yazın: hangi sorunu çözdüğünüz, nasıl test ettiğiniz ve varsa ilgili issue numarası. "Fixes #482: boş dizi geçildiğinde oluşan çökmeyi, giriş doğrulaması ekleyerek düzelttim; `npm test` ile mevcut testler ve yeni eklediğim edge-case testi geçti" gibi bir açıklama, maintainer'ın incelemeye başlamak için ihtiyaç duyduğu her şeyi verir. Belirsiz bir "küçük düzeltme" başlığı, maintainer'ın PR'ı açıp bağlamı sıfırdan çıkarmasını gerektirir ve bu genelde incelemenin sıraya girmesi anlamına gelir.

| Katkı türü | Zorluk | Örnek |
| --- | --- | --- |
| Dokümantasyon düzeltmesi | Çok düşük | Yanlış bir komut örneğini düzeltme |
| Eksik test ekleme | Düşük | Kapsanmamış bir edge case için test yazma |
| good-first-issue | Düşük-orta | Maintainer'ın işaretlediği küçük bir hata |
| Yeni özellik | Orta-yüksek | Önce bir issue açıp onay almadan başlamayın |

## AI Asistanını Yabancı Bir Kod Tabanında Nasıl Kullanmalısınız?

Yabancı bir kod tabanını anlamak için bir AI asistanına "bu fonksiyon ne yapıyor, nereden çağrılıyor" sormak güvenli bir kullanım; sırrınız veya özel bir token'ı yapıştırmak değil. Açık kaynak kod zaten herkese açık olduğu için bu kullanım gizlilik riski taşımaz, ama yerel `.env` dosyanızdaki bir anahtarı ya da bir özel depodaki kodu asistana yapıştırmamaya özen gösterin — bu ayrımı net tutmak, hem sizin hem projenin güvenliği için önemli. [AI destekli açık kaynak kod ajanlarını karşılaştırdığımız yazımız](/tr/posts/acik-kaynak-ai-kod-ajanlari), bu asistanlardan hangisinin bir depoyu hızlı taramak için daha uygun olduğunu gösteriyor; ama hiçbiri CONTRIBUTING dosyasını sizin yerinize okumuyor, o adımı atlamamak size kalıyor.

## Bir PR Reddedilirse Ne Yaparsınız?

Bir maintainer "bu yaklaşımı istemiyoruz" dediğinde bunu kişisel bir eleştiri değil, proje yönü hakkında bir bilgi olarak okuyun; "neden bu yönü tercih ediyorsunuz, alternatif bir PR denemek ister misiniz" diye sorup geri çekilmek, sert bir şekilde savunmaya geçmekten çok daha iyi bir ikinci izlenim bırakır. Reddedilen bir PR bile, o projenin kod tabanını okuma deneyimi olarak kalır; bir dahaki issue'ya bu deneyimle gidersiniz.

Açıkçası "ilk PR'ım mükemmel olmalı" baskısı, çoğu insanın hiç başlamamasının asıl sebebi — gerçekte maintainer'lar küçük, net kapsamlı bir PR'ı mükemmel bir PR'dan daha çok takdir ediyor, çünkü incelemesi az zaman alıyor. Bir hafta boyunca her gün tek bir good-first-issue'ya göz atmak, bir "streak" oluşturur ve bu streak, ilk haftanın sonunda gerçek bir katkı geçmişine dönüşür — ilk PR'ın kusursuz olmasından çok daha değerli bir sonuç.

Bir haftalık somut plan şöyle görünebilir: 1. gün üç farklı projede good-first-issue listesine göz atıp CONTRIBUTING dosyalarını okuma; 2. gün bir projeyi yerel kurup testleri çalıştırma (henüz kod yazmadan); 3-4. gün seçtiğiniz issue'yu çözme; 5. gün PR'ı açıp açıklamayı yazma; 6-7. gün gelen yorumlara yanıt verme. Bu, bir junior'ın ilk mentorluk deneyimini de taklit ediyor — [junior geliştiricilere mentorluk yaparken struggle budget kavramını anlattığımız yazıda](/tr/posts/junior-gelistirici-mentorluk) belirttiğimiz gibi, kendi kendinize tanımladığınız bir süre sınırı, saplanıp kalmaktan daha iyi bir rehber. Kariyer ve üretkenlik kategorisindeki diğer yazılara [buradan](/tr/category/kariyer-uretkenlik) göz atabilirsiniz.

## Sıkça Sorulan Sorular

### Açık kaynağa ilk katkı için hangi issue'yı seçmeliyim?

"good-first-issue" etiketli, maintainer tarafından yeni başlayanlar için işaretlenmiş bir issue seçin; GitHub'da `github.com/<sahip>/<depo>/contribute` adresinden bu etiketli açık sorunları doğrudan görebilirsiniz. Kod dışı katkılar (dokümantasyon, test, çeviri) de aynı derecede geçerli bir başlangıç noktası.

### DCO ile CLA arasındaki fark ne?

DCO, her commit'e eklenen bir "Signed-off-by" satırıyla kodu kendinizin yazdığını onayladığınız, tek seferlik bir belge imzalamayı gerektirmeyen hafif bir sistemdir; CLA ise bir kere imzalanan ve gelecekteki tüm katkılarınızı kapsayan ayrı bir hukuki anlaşmadır.

### İlk PR'ımı ne kadar küçük tutmalıyım?

Tek bir sorunu çözecek kadar küçük tutun — bir hata düzeltmesi, bir eksik test veya bir dokümantasyon hatası. 15-30 satırlık, tek amaçlı bir PR genelde aynı gün incelenirken, birden fazla konuyu birleştiren büyük bir PR çoğu zaman rafa kalkıyor.

### PR'ım reddedilirse bu kötü bir şey mi?

Hayır — bir maintainer'ın "bu yaklaşımı istemiyoruz" demesi, projenin yönü hakkında bir bilgidir, yeteneğinizin bir değerlendirmesi değil. Reddedilen bir PR bile o kod tabanını okuma pratiği olarak kalır ve bir sonraki katkınızda bu deneyim işe yarar.
