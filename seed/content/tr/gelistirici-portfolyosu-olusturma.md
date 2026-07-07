---
title: "Fark Yaratan Geliştirici Portfolyosu Oluşturma"
slug: "gelistirici-portfolyosu-olusturma"
translationKey: "developer-portfolio-guide"
locale: "tr"
excerpt: "Kodun yarısını yapay zekânın yazdığı bir dünyada 2026 geliştirici portfolyosu rehberi: nicelik değil muhakeme kanıtla, inceleyenin 60 saniyelik taramasını mülakata çevir."
category: "career-productivity"
tags: ["portfolio", "career", "job-search", "personal-branding"]
publishedAt: "2026-07-06"
seoTitle: "Geliştirici Portfolyosu Oluşturma Rehberi 2026"
seoDescription: "2026 geliştirici portfolyosu rehberi: muhakemeni kanıtlayan projeler seç, gerçek vaka çalışmaları yaz ve portfolyonu mülakat davetine çevir."
---

Çoğu iş arayanın duymak istemediği rahatsız edici gerçek şu: 2026'da portfolyondaki cilalı, özellik dolu bir proje artık yetenek kanıtı değil. Varsayılan durum. İnceleyenler artık büyük kısmını bir yapay zekâ asistanının yazdığını varsayıyor ve genelde de haklılar — 2025 Stack Overflow anketine göre [geliştiricilerin %84'ü yapay zekâ araçları kullanıyor ya da kullanmayı planlıyor](https://survey.stackoverflow.co/2025/ai), %51'i her gün. Cilalı demo artık asgari koşulsa, "daha etkileyici projeler" yanlış hedeftir.

Fark yaratan bir geliştirici portfolyosu, çoğu rehberin söylediğinin tersini yapar: daha az şeyi daha derin gösterir ve yapay zekânın taklit edemediği tek şeyi öne çıkarır — senin muhakemeni. Backend ve full-stack pozisyonları için işe alım yaparken yüzlerce portfolyo inceledim; geri dönüş her zaman aynı profile gitti: üç dört proje, dürüst anlatımlar ve kişinin gerçekten bir şey yayına alıp sürdürdüğüne dair kanıt. Hadi böyle bir portfolyo kuralım.

## 2026'da bir geliştirici portfolyosunu ne fark ettirir?

Fark yaratan portfolyo; gerçek kısıtlar altında yayına alabildiğini, hata ayıklayabildiğini ve iletişim kurabildiğini kanıtlar. Bu değişmedi. Değişen şey ispat yükü. Bir junior tek komutla CRUD uygulaması iskeleti kurabiliyorsa, ilginç sinyal artık "çalışıyor" değil — *neden böyle yaptığın*. Neden belge veritabanı yerine Postgres. p95 gecikmesini nasıl düşürdüğün. Gece 2'de üretimde neyin bozulduğu ve teşhisi nasıl koyduğun.

Çıta yükseldi çünkü zemin yükseldi. Neredeyse evrensel yapay zekâ kullanımını raporlayan aynı anket, [geliştiricilerin bir numaralı sıkıntısının (%66)](https://survey.stackoverflow.co/2025/ai) "neredeyse doğru ama tam değil" yapay zekâ çıktısı olduğunu, %45'inin ise yapay zekâ üretimi kodu ayıklamanın yazmaktan daha fazla vakit aldığını söylediğini buldu. İşte senin fırsatın. "Neredeyse doğru"yu yakaladığını gösteren bir portfolyo — kaçındığın migration, sildiğin soyutlama — hiçbir üretilmiş arayüzün veremeyeceği bir senior sinyali verir.

İnceleyenler önce göz gezdirir, sonra okur. Bu ilk taramayı tatmin edici kıl:

- Sayfanın en üstünde **tek cümlelik bir değer ifadesi** ("Backend geliştirici, Go ve Postgres, ödeme sistemleri kuruyorum").
- Her biri ekran görüntüsü, canlı bağlantı ve repo içeren **üç ila beş öne çıkan proje**.
- Özellik listesi yerine proje başına **kısa bir vaka çalışması**.
- **Hızlı yüklenen ve temiz mobil düzen** — incelemelerin çoğu toplantı aralarında telefondan yapılır.

## Geliştirici portfolyosuna hangi projeleri koymalısın?

Hem çeşitlilik hem derinlik gösteren projeleri koy: uçtan uca kendin yaptığın bir amiral gemisi uygulama, zor bir teknik problemi çözdüğünü gösteren bir proje ve bir açık kaynak veya ekip katkısı. Kalite nicelikten üstündür — iyi belgelenmiş üç güçlü proje, yarım kalmış on repoyu her seferinde geride bırakır.

Bunun arkasında gerçek bir piyasa sinyali var. 2026'da işe alım talebi yapay zekâ, ML, veri ve güvenlik uzmanlarına ciddi biçimde kaydı; bu segment yıllık yaklaşık %163 büyürken yapay zekânın otomatikleştirdiği rutin işlerde alım yavaşladı. Tercümesi: yapay zekânın tek seferde çözemeyeceği bir probleme dokunan en az bir proje seç — retrieval grounding, bir değerlendirme (eval) düzeneği, gecikmeye duyarlı bir servis — ve bu ayrımın doğru tarafında dur.

İşe alım yöneticisinin gerçek sorusuna cevap veren projeleri seç: "Bu kişi benim sorunlarımı çözebilir mi?" Şu filtreyi kullan.

| Proje türü | Neyi kanıtlar | Şu durumda ekle |
|---|---|---|
| Amiral gemisi ürün | Uçtan uca sahiplik | Canlıysa ve her katmanını anlatabiliyorsan |
| Zor problem projesi | Teknik derinlik | Kolay olmayan bir kısıtı çözdüyse (ölçek, gecikme, doğruluk) |
| Yapay zekâ/agent sistemi | 2026 piyasa uyumu | Sadece API sarmalayıcı değil, eval veya retrieval katmanını kurduysan |
| Açık kaynak katkısı | Ekip çalışması | PR'ın gerçek bir projeye birleştirildiyse |
| Tutorial kopyası | Neredeyse hiçbir şey | Asla — ciddi biçimde genişletip yeniden kurgulamadıysan |

Bir proje yalnızca üstüne adını yazdığın bir framework başlangıç şablonuysa çıkar. İnceleyen bu repoyu bu ay elli kez gördü — ve çoğunu bir yapay zekâ üretti.

### Kaç proje yeterli?

Üç ila beş öne çıkan proje ideal aralıktır. Üçten az olması zayıf görünür; altıdan fazlası dikkati dağıtır ve önceliklendirme yapamadığın izlenimi verir. Acımasızca seç, geri kalanı için "GitHub'da daha fazlası" bölümü ekle. Asıl eksiğin proje derinliğiyse, [junior'dan senior'a yol haritamız](/tr/posts/juniordan-senior-gelistiriciye) inceleyenlerin taradığı o muhakemeyi ele alıyor.

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

O son blok işin ağırlığını taşıyor. Kapsamı, ölçülebilir bir kazanımı ve neyi değiştireceğine dair öz farkındalığı gösteriyor. Dürüst ödünleşim satırı, senior sinyalini junior'dan ayıran şeydir — ve senin yerine hiçbir yapay zekânın yazmadığı kısım budur. Bunları yazmak tuhaf geliyorsa, aynı kaslar iyi bir README'ye de geçer; [geliştiricilerin seveceği dokümantasyon](/tr/posts/teknik-dokumantasyon-yazma) yazımız doğrudan işine yarar.

## Portfolyo ana sayfanda ne olmalı?

Ana sayfanın ilk ekranında net bir başlık, öne çıkan projeler ve sana ulaşma yolu olmalı — başka hiçbir şey değil. Kim olduğunu ve ne inşa ettiğini tek cümleyle söyle, sonra işin konuşsun. Uzun otobiyografileri ve inceleyeni bekleten animasyonlu girişleri atla.

Boş repodan paylaşılabilir bağlantıya gitmek için şu sırayı izle:

1. **Tek cümlelik konumlandırma ifadeni yaz.** Rol, ana teknoloji yığını, çözdüğün problem türü.
2. **Üç ila beş projeni** yukarıdaki filtreyle seç.
3. **Her biri için vaka çalışması yaz**, dört bloklu şablonla.
4. **Kısa bir Hakkımda bölümü ekle** — iki paragraf, bir fotoğraf, konum ve müsaitlik.
5. **İletişimi zahmetsiz yap** — e-posta, LinkedIn, GitHub ve PDF özgeçmiş.
6. **Canlı bir sürüm yayına al**, özel alan adıyla bir host üzerinde (aşağıdaki tabloya bak).
7. **Yükleme hızını ve mobili test et.** "İyi" Core Web Vitals eşiklerini hedefle: [LCP 2,5 sn altı, INP 200 ms altı, CLS 0,1 altı](https://web.dev/articles/defining-core-web-vitals-thresholds).
8. **Temel analitik ekle** ki hangi projelere tıklandığını bilesin.
9. **Yaygın paylaşımdan önce bir kişiden geri bildirim al.**
10. **Üç ayda bir güncelle** ki hiçbir şey terk edilmiş görünmesin.

Süslü bir framework'e ya da ücretli bir plana ihtiyacın yok. Ücretsiz bir host üzerindeki statik bir site, arkasında iki zayıf proje olan özel yapım bir Three.js ana sayfasını geçer. Temmuz 2026 itibarıyla üç yaygın host şöyle sıralanıyor:

| Host | Ücretsiz katman | Özel alan adı | Dikkat |
|---|---|---|---|
| GitHub Pages | Ücretsiz, yalnızca statik | Ücretsiz | SSR veya serverless yok — sadece düz statik derlemeler |
| Netlify | Ücretsiz, ticari kullanıma izinli | Ücretsiz | Nisan 2026'da koltuk başına fiyatı kaldırdı; Pro sabit 20 $/ay |
| Vercel | Hobby (ücretsiz) | Ücretsiz | Hobby ticari kullanımı yasaklar; Pro kullanıcı başına 20 $/ay |

Statik bir portfolyo için üçü de fiilen ücretsiz. Deploy akışını zaten bildiğin olanı seç — host tercihi buradaki en önemsiz karar.

## Sessizce mülakat kaybettiren yaygın hatalar

En büyük hatalar; çok sayıda zayıf proje göstermek, canlı bağlantıları gizlemek ve etki yerine özellik anlatmaktır. Ölü bir demo bağlantısı ya da derlenmeyen bir repo, inceleyene güvenilir biçimde yayına alamadığını söyler. Tasarımı cilalamadan önce temelleri düzelt.

Şunlara dikkat et:

- **Bozuk veya eksik canlı bağlantılar.** İnceleyen tıklayamıyorsa proje neredeyse sayılmaz. Demoları canlı tut ya da kaldır.
- **README yokluğu.** Kurulum adımı ve açıklama içermeyen repo yarım kalmış — ya da yapay zekâ dökümü — okunur.
- **Etkisiz açıklamalar.** "React ve Node ile yapıldı" hiçbir şey söylemez. "Ödeme hatalarını %22 azalttım" her şeyi söyler.
- **Duvar gibi Hakkımda sayfası.** Kimse okumaz. İki paragraf, sonra yoldan çekil.
- **Parmak izi olmayan, üretildiği belli projeler.** Her proje üretilmiş görünüyor ve tek bir zor kararı anlatamıyorsan, inceleyen karar veremeyeceğini varsayar.
- **Yavaş, ağır sayfalar.** INP artık en çok başarısız olunan Core Web Vital — 2026'da sitelerin %43'ü 200 ms eşiğini geçemiyor. Takılan bir sayfa ilk taramayı kaybettirir.

İşini sunmak için daha fazlası: [teknik mülakata hazırlanma](/tr/posts/teknik-mulakat-hazirligi) ve [yapay zekâ araçlarını gücünü kaybetmeden kullanma](/tr/posts/ai-gelistirici-verimliligi) rehberlerimize göz at. Bunlar birlikte güçlü bir [kariyer ve üretkenlik](/tr/category/kariyer-uretkenlik) araç setinin çekirdeğini oluşturur.

## Sıkça Sorulan Sorular

### Özel kodlanmış bir portfolyo mu gerekli, şablon yeterli mi?

Temiz bir şablon tamamen yeterlidir ve çoğu zaman daha akıllıcadır. İnceleyenler navbar'ı kendin mi yaptın diye değil, öne çıkan projelerini ve vaka çalışmalarını değerlendirir. Çabanı güçlü anlatımlara ve hızlı, okunabilir bir siteye harca. Özel kodu, portfolyonun kendisinin iş örneği olduğu front-end rolleri için sakla.

### Henüz profesyonel deneyimim yoksa proje koymalı mıyım?

Evet — kişisel ve açık kaynak projeler, ilk işinden önce yeteneğini kanıtlamanın tam olarak yoludur. İyi anladığın gerçek bir problemi çözen iki üç proje yap, bunları vaka çalışmalarıyla belgele ve açık kaynak bir repoya birleştirilen bir pull request gönder. 2026'da junior işleri giderek otomatikleşirken, bu muhakeme ve ekip çalışması kanıtı uzun bir özgeçmişten daha çok değer taşır.

### Yapay zekâ dakikalar içinde portfolyo üretebiliyorken nasıl fark yaratırım?

Yapay zekânın taklit edemediği kısımlara yaslan. Gerçek bir ödünleşimi anlat, teşhis ettiğin bir hatayı göster ve her projeye ölçülebilir bir sonuç koy. 2026'daki inceleyenler binlerce üretilmiş demo gördü; yaklaşımının *neden* işe yaradığını anladığını kanıtlayan tek bir cümle, bir cilalı ekran daha göstermekten üstündür.

### Portfolyo bağlantımı özgeçmişime ve LinkedIn'e koymalı mıyım?

Kesinlikle. Portfolyo ancak insanlar ulaşabilirse işe yarar; bu yüzden bağlantıyı özgeçmiş başlığına, LinkedIn biyografine ve GitHub profiline koy. Uzun bir alt alan adı yerine temiz bir özel alan adı kullan ve sitenin mobilde hızlı yüklendiğinden emin ol, çünkü ilk tıklamaların çoğu telefondan gelir.
