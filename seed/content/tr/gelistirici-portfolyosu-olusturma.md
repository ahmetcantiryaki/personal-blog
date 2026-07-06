---
title: "Fark Yaratan Geliştirici Portfolyosu Oluşturma"
slug: "gelistirici-portfolyosu-olusturma"
translationKey: "developer-portfolio-guide"
locale: "tr"
excerpt: "2026 için pratik geliştirici portfolyosu oluşturma rehberi: hangi projeleri seçmelisin, vaka çalışmasını nasıl yazarsın ve sessizce mülakat kaybettiren hatalar."
category: "career-productivity"
tags: ["portfolio", "career", "job-search", "personal-branding"]
publishedAt: "2026-05-18"
seoTitle: "Geliştirici Portfolyosu Oluşturma Rehberi 2026"
seoDescription: "2026 geliştirici portfolyosu oluşturma rehberi: doğru projeleri seç, gerçek vaka çalışmaları yaz ve portfolyonu mülakat davetine çevir."
---

Fark yaratan bir geliştirici portfolyosu, tutorial kopyalarından oluşan uzun bir listeyi değil; gerçek vaka çalışmalarıyla anlatılan üç dört derin projeyi gösterir. Bu geliştirici portfolyosu oluşturma rehberi; proje seçimini, sonuç odaklı proje anlatımını ve işe alım yöneticisinin değerini 60 saniyede kavrayabileceği bir site yapısını adım adım anlatıyor. Mülakatı derinlik ve kanıt kazandırır, proje sayısı değil.

Backend ve full-stack pozisyonları için işe alım yaparken yüzlerce portfolyo inceledim. Geri dönüş alanların ortak yönü belliydi: az sayıda proje, net hikâyeler ve kişinin gerçekten bir şey yayına alıp sürdürdüğünü gösteren kanıtlar. Hadi böyle bir portfolyo kuralım.

## 2026'da bir geliştirici portfolyosunu ne fark ettirir?

Fark yaratan portfolyo; senin yayına alabildiğini, hata ayıklayabildiğini ve iletişim kurabildiğini kanıtlar. 2026'da bu; incelenebilir canlı projeler, problemi ve kararlarını açıklayan kısa vaka çalışmaları ve ödünleşimleri dürüstçe anlatan notlar demektir. Sıradan yapılacaklar listesi uygulamaları ve değiştirilmemiş tutorial projeleri artık gürültü gibi okunuyor, çünkü yapay zekâ bunları saniyeler içinde üretiyor.

Çıta yükseldi. Herkes bir komutla CRUD uygulaması iskeleti kurabiliyorsa, seni ayıran şey muhakemedir: neden belge veritabanı yerine Postgres seçtiğin, p95 gecikmesini nasıl düşürdüğün, üretimde neyin bozulup nasıl düzelttiğin. Sadece çıktıyı değil, düşünme biçimini göster.

İnceleyenler önce göz gezdirir, sonra okur. Senin işin bu ilk taramayı tatmin edici kılmak:

- Sayfanın en üstünde **tek cümlelik bir değer ifadesi** ("Backend geliştirici, Go ve Postgres, ödeme sistemleri kuruyorum").
- Her biri ekran görüntüsü, canlı bağlantı ve repo içeren **üç ila beş öne çıkan proje**.
- Özellik listesi yerine proje başına **kısa bir vaka çalışması**.
- **Hızlı yüklenen ve temiz mobil düzen** — incelemelerin çoğu toplantı aralarında telefondan yapılır.

## Geliştirici portfolyosuna hangi projeleri koymalısın?

Hem çeşitlilik hem derinlik gösteren projeleri koy: uçtan uca kendin yaptığın bir amiral gemisi uygulama, zor bir teknik problemi çözdüğünü gösteren bir proje ve bir açık kaynak veya ekip katkısı. Kalite, nicelikten üstündür. İyi belgelenmiş üç güçlü proje, yarım kalmış on repoyu her seferinde geride bırakır.

İşe alım yöneticisinin gerçek sorusuna cevap veren projeleri seç: "Bu kişi benim sorunlarımı çözebilir mi?" Şu hızlı filtreyi kullan.

| Proje türü | Neyi kanıtlar | Şu durumda ekle |
|---|---|---|
| Amiral gemisi ürün | Uçtan uca sahiplik | Canlıysa ve her katmanını anlatabiliyorsan |
| Zor problem projesi | Teknik derinlik | Kolay olmayan bir kısıtı çözdüyse (ölçek, gecikme, doğruluk) |
| Açık kaynak katkısı | Ekip çalışması | PR'ın gerçek bir projeye birleştirildiyse |
| Alan projesi | Sektöre uygunluk | Hedeflediğin rollerle örtüşüyorsa |
| Tutorial kopyası | Neredeyse hiçbir şey | Asla — ciddi biçimde genişletip yeniden kurgulamadıysan |

Bir proje yalnızca üstüne adını yazdığın bir framework başlangıç şablonuysa çıkar. İnceleyen kişi bu repoyu bu ay elli kez gördü.

### Kaç proje yeterli?

Üç ila beş öne çıkan proje ideal aralıktır. Üçten az olması zayıf görünür; altıdan fazlası dikkati dağıtır ve önceliklendirme yapamadığın izlenimi verir. Acımasızca seç, geri kalanı için "GitHub'da daha fazlası" bölümü ekle.

## Okunan bir proje vaka çalışması nasıl yazılır?

Her vaka çalışmasını dört kısa blokla yaz: problem, yaklaşımın, sayı içeren sonuç ve dürüst bir ödünleşim. 200 kelimenin altında tut. İnceleyenler nasıl düşündüğünü görmek ister; bu yüzden teknoloji listesiyle değil, kararla ve sonuçla başla.

Mentorluk verdiğim kişilere verdiğim şablon aşağıda. Her satırı bir iki cümleyle doldur.

```markdown
## ShipTrack — gerçek zamanlı teslimat panosu

**Problem:** Destek ekibi günlük 1.200 teslimatı takip etmek için
yavaş bir admin sayfasını yeniliyordu; sorgu ortalama 40 saniye sürüyordu.

**Yaklaşım:** Postgres LISTEN/NOTIFY üzerine WebSocket katmanı kurdum,
sık kullanılan rotalar için Redis önbelleği ekledim, geçmiş görünümünü
sayfaladım.

**Sonuç:** Sorgu 2 saniyenin altına düştü (p95). Destek ekibi vardiya
başına %30 daha fazla talep kapattı.

**Ödünleşim:** İki haftada yayına almak için Kafka yerine LISTEN/NOTIFY
seçtim; hacim 10 katına çıktığında geçiş yolunu belgeledim.

**Teknoloji:** Go, Postgres, Redis, React. Canlı demo · Kaynak
```

O son blok işin ağırlığını taşıyor. Kapsamı, ölçülebilir bir kazanımı ve neyi değiştireceğine dair öz farkındalığı gösteriyor. Dürüst ödünleşim satırı, senior sinyalini junior'dan ayıran şeydir.

## Portfolyo ana sayfanda ne olmalı?

Ana sayfanın ilk ekranında net bir başlık, öne çıkan projeler ve sana ulaşma yolu olmalı — başka hiçbir şey değil. Kim olduğunu ve ne inşa ettiğini tek cümleyle söyle, sonra işin konuşsun. Uzun otobiyografileri ve inceleyeni bekleten animasyonlu girişleri atla.

Boş repodan paylaşılabilir bağlantıya gitmek için şu sırayı izle:

1. **Tek cümlelik konumlandırma ifadeni yaz.** Rol, ana teknoloji yığını, çözdüğün problem türü.
2. **Üç ila beş projeni** yukarıdaki filtreyle seç.
3. **Her biri için vaka çalışması yaz**, dört bloklu şablonla.
4. **Kısa bir Hakkımda bölümü ekle** — iki paragraf, bir fotoğraf, konum ve müsaitlik.
5. **İletişimi zahmetsiz yap** — e-posta, LinkedIn, GitHub ve PDF özgeçmiş.
6. **Canlı bir sürüm yayına al** — Vercel, Netlify veya GitHub Pages, özel alan adıyla.
7. **Yükleme hızını ve mobili test et** — Lighthouse ile 90+ performans puanı hedefle.
8. **Temel analitik ekle** ki hangi projelere tıklandığını bilesin.
9. **Yaygın paylaşımdan önce bir kişiden geri bildirim al.**
10. **Üç ayda bir güncelle** ki hiçbir şey terk edilmiş görünmesin.

Süslü bir framework'e ihtiyacın yok. Statik bir site, temiz bir şablon ve gerçek içerik; arkasında iki zayıf proje olan özel yapım bir Three.js ana sayfasını her zaman geçer.

## Sessizce mülakat kaybettiren yaygın hatalar

En büyük hatalar; çok sayıda zayıf proje göstermek, canlı bağlantıları gizlemek ve etki yerine özellik anlatmaktır. Ölü bir demo bağlantısı ya da derlenmeyen bir repo, inceleyene güvenilir biçimde yayına alamadığını söyler. Tasarımı cilalamadan önce temelleri düzelt.

Şunlara dikkat et:

- **Bozuk veya eksik canlı bağlantılar.** İnceleyen tıklayamıyorsa proje neredeyse sayılmaz. Demoları canlı tut ya da kaldır.
- **README yokluğu.** Kurulum adımı ve açıklama içermeyen repo yarım kalmış okunur.
- **Etkisiz açıklamalar.** "React ve Node ile yapıldı" hiçbir şey söylemez. "Ödeme hatalarını %22 azalttım" her şeyi söyler.
- **Duvar gibi Hakkımda sayfası.** Kimse okumaz. İki paragraf, sonra yoldan çekil.
- **Kopyala-yapıştır tutorial projeleri.** Anında tanınır, anında değersizleşir.
- **Yavaş, ağır sayfalar.** 6 saniyelik yükleme ilk taramayı kaybettirir.

İşini sunmak için daha fazlası: [ön elemeyi geçen teknik özgeçmiş yazma](#) ve [geliştirici olarak kişisel marka oluşturma](#) rehberlerimize göz at. [Teknik mülakata hazırlanma](#) yazımızla birlikte bunlar, güçlü bir [kariyer ve üretkenlik](#) araç setinin çekirdeğini oluşturur.

## Sıkça Sorulan Sorular

### Özel kodlanmış bir portfolyo mu gerekli, şablon yeterli mi?

Temiz bir şablon tamamen yeterlidir ve çoğu zaman daha akıllıcadır. İnceleyenler portfolyonun navbar'ını kendin mi yaptın diye değil, öne çıkan projelerini ve vaka çalışmalarını değerlendirir. Çabanı güçlü proje anlatımlarına ve hızlı, okunabilir bir siteye harca. Özel kodu, portfolyonun kendisinin iş örneği olduğu front-end rolleri için sakla.

### Henüz profesyonel deneyimim yoksa proje koymalı mıyım?

Evet — kişisel ve açık kaynak projeler, ilk işinden önce yeteneğini kanıtlamanın tam olarak yoludur. İyi anladığın gerçek bir problemi çözen iki üç proje yap, bunları vaka çalışmalarıyla belgele ve açık kaynak bir repoya birleştirilen bir pull request gönder. Bu kombinasyon inisiyatif ve ekip çalışması gösterir; junior alımının aradığı şey budur.

### Geliştirici portfolyomu ne sıklıkla güncellemeliyim?

Üç ayda bir ve önemli her projeden sonra gözden geçir. Eskimiş görüneni çıkar, bozuk demo bağlantılarını düzelt, en güçlü güncel işini öne al. 2023 telif hakkı ve ölü bağlantılarla terk edilmiş bir portfolyo hareketsizlik sinyali verir; bu geliştirici portfolyosu oluşturma rehberinin önlemeye çalıştığı şeyin tam tersidir.

### Portfolyo bağlantımı özgeçmişime ve LinkedIn'e koymalı mıyım?

Kesinlikle. Portfolyo ancak insanlar ulaşabilirse işe yarar; bu yüzden bağlantıyı özgeçmiş başlığına, LinkedIn biyografine ve GitHub profiline koy. Uzun bir alt alan adı yerine temiz bir özel alan adı kullan ve sitenin mobilde hızlı yüklendiğinden emin ol, çünkü ilk tıklamaların çoğu telefondan gelir.
