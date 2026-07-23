---
title: "Claude'a Ekonomi Endeksi'ni Sormak"
slug: "claude-ekonomi-endeksi-baglantisi"
translationKey: "claude-economic-index-connector"
locale: "tr"
excerpt: "Anthropic, 22 Temmuz'da yeni bir claude.ai bağlantısı yayınladı; artık herkes Ekonomi Endeksi'ni doğrudan Claude'a soru sorarak sorgulayabiliyor."
category: "ai"
tags: ["claude", "ai-tools", "llm"]
publishedAt: "2026-07-23"
seoTitle: "Claude'a Ekonomi Endeksi'ni Sormak: Yeni Bağlantı"
seoDescription: "Anthropic, 22 Temmuz'da yeni bir claude.ai bağlantısı yayınladı; artık herkes Ekonomi Endeksi'ni doğrudan Claude'a soru sorarak sorgulayabiliyor."
---

22 Temmuz 2026 itibarıyla claude.ai'de bağlantılar menüsünü açıp Anthropic Ekonomi Endeksi'ni etkinleştirebilir, ardından Claude'a hangi mesleklerin yapay zekayı en çok kullandığını ya da kendi bölgenizde insanların hangi görevleri otomatikleştirdiğini sorabilirsiniz. Kurulum yok, API anahtarı yok — herhangi bir Claude modeliyle, herhangi bir sohbette çalışıyor ve yanıtlarını Claude'un genel eğitim bilgisinden değil, doğrudan Anthropic'in kendi yapay zeka benimseme veri setinden alıyor.

## Ekonomi Endeksi Aslında Nedir?

Anthropic Ekonomi Endeksi (AEI), Anthropic'in yapay zekanın gerçek ekonomide nasıl kullanıldığını ölçen, satıcıların "böyle kullanılıyor" iddialarına değil gerçek verilere dayanan sürekli araştırma projesi. [Şubat 2025](https://www.anthropic.com/news/the-anthropic-economic-index)'teki ilk yayınından bu yana proje beş kamuya açık dalga yayınladı; her dalga bir önceki modelden daha yeni bir Claude sürümü üzerine kuruluyor ve Claude 3.5 Sonnet'in kullanıldığı ilk dalgadan en son rapordaki Claude Opus 4.6'ya kadar uzanıyor. Her dalga aynı soruları yeniden ölçüyor: hangi işler yapay zekayla temas ediyor, insanlar bir görevi tamamen otomatikleştirmek için mi yoksa kendi muhakemesini güçlendirmek için mi kullanıyor ve modeller geliştikçe bu örüntü nasıl değişiyor.

Anthropic'in kendi [araştırma makalesinde](https://arxiv.org/abs/2503.04761) anlatılan yöntem, anonimleştirilmiş konuşma metinlerini ABD Çalışma Bakanlığı'nın O*NET veritabanındaki yaklaşık 20.000 görev tanımıyla eşleştiriyor, ardından bunları altı haneli Standart Meslek Sınıflandırması kodlarına topluyor. Clio adlı bir model, hem konuşma metnini hem de O*NET görev tanımlarını aynı vektör uzayına gömüyor ve her konuşmayı en yakın göreve atıyor — bu işlem, Claude.ai'nin ücretsiz ve Pro plan konuşmalarından örneklenmiş bir küme ile birinci taraf API trafiği üzerinde, gizliliği koruyacak ölçekte yapılıyor.

## Yeni Bağlantı Pratikte Nasıl Çalışıyor?

Bu haftaya kadar bu verilere ulaşmanın tek yolu Anthropic'in yayınladığı raporları okumak ya da ham veri setini kendiniz indirmekti. [Yeni bağlantı](https://www.anthropic.com/news/anthropic-economic-index-connector) bunu sıradan bir sohbete indirgiyor. Ayarlar → Bağlantılar üzerinden açtığınızda Claude şu tür sorulara yanıt verebiliyor:

```text
"Şu anda hangi meslekler yapay zekayı en çok kullanıyor?"
"Bulunduğum bölgede insanlar Claude'u en çok nasıl kullanıyor?"
"Öğretmenler yapay zekayı çoğunlukla not vermeyi otomatikleştirmek için mi, ders planlamayı güçlendirmek için mi kullanıyor?"
"Kodlama görevlerindeki kullanım son iki AEI raporundan bu yana nasıl değişti?"
```

Claude, AEI verisinin ilgili dilimini çekiyor, altındaki rakamlara atıfta bulunuyor ve statik bir grafik değil canlı bir bağlantı olduğu için her seferinde yeni bir arama başlatmak yerine daha dar bir soruyla devam etmenize izin veriyor. Sohbette sormak yerine kendi analizini yapmak isteyenler için tam veri setleri hâlâ [anthropic.com/economic-index](https://www.anthropic.com/economic-index) adresinden ücretsiz indirilebiliyor.

## En Son Veri Aslında Ne Gösteriyor?

En son dalganın manşet rakamı: Anthropic'in örnekleminde işlerin %49'unda görevlerin en az dörtte biri artık Claude ile temas ediyor; bu oran Ocak 2025'te %36'ydı. Bu, yapay zekanın işin dörtte birini yaptığı anlamına gelmiyor — o mesleğin günlük görevlerinin anlamlı bir kısmının Claude konuşmalarında bir şekilde ortaya çıktığı anlamına geliyor.

| AEI dalgası | Temel Claude modeli | Görev kapsamı ≥%25 olan işler |
|---|---|---|
| 1. Dalga (Şub 2025) | Claude 3.5 Sonnet | %36 |
| 3. Dalga | Claude 3.7 / 4 nesli | ~%40 |
| 5. Dalga (son, 2026) | Claude Opus 4.6 | %49 |

Çoğu ekip için asıl ilginç eksen, güçlendirme mi otomasyon mu ayrımı. Erken dalgalar, insanların bir görevi tamamen devretmek yerine kendi işlerini kontrol etmek, genişletmek veya hızlandırmak için Claude'u kullanmayı — yani güçlendirmeyi — daha sık tercih ettiğini tutarlı biçimde buluyor. Kodlama ve yazılım görevleri bu eğilimin tersine dönüyor; diğer kategorilere kıyasla daha yüksek bir doğrudan otomasyon payına sahip, bu da Claude Code gibi ajan tabanlı kodlama araçlarının pratikte nasıl kullanıldığıyla örtüşüyor.

## Bu Merak Gidermenin Ötesinde Neden İşe Yarıyor?

Bir geliştirici ya da ürün ekibi için AEI bağlantısı, bir pazara giriş varsayımını hızlıca doğrulamanın bir yolu. Muhasebeciler için bir araç geliştiriyorsanız, kimsenin henüz yapay zeka üzerinden yürütmediği bir özelliğe bir sprint harcamadan önce Claude'a AEI verisinde hangi muhasebe görevlerinin zaten yoğun biçimde göründüğünü sorabilirsiniz. İçerik ve araştırma ekipleri için bu, normalde üç sekme PDF rapor gerektiren bir kaynak arayışını tek bir güvenilir sohbete indiriyor; üstelik yapay zeka arama motorlarının artık geri dönüştürülmüş blog özetlerinden çok bu tür birincil, doğrulanabilir verilere atıf yapan içerikleri ödüllendirme eğiliminde olduğu bir dönemde bunun ekstra bir faydası var.

Gazeteciler ve politika araştırmacıları belki de daha büyük bir kazanç elde ediyor: düşünce kuruluşu atıflarında ve kongre ifadelerinde kullanılan aynı veri seti, artık SOC kodu bilmenize ya da bir CSV'yi eyalete göre filtrelemenize gerek kalmadan sade bir dille sorgulanabiliyor.

## Akılda Tutulması Gereken Sınırlar

Bunların hiçbiri AEI'yi tüm ekonominin bir sayımı hâline getirmiyor. Örneklem Claude kullanıcıları — yani zaten bir yapay zeka aracını ve belirli bir sağlayıcıyı seçmiş kişiler — bu da belirli sektörlere, coğrafyalara ve kıdem seviyelerine doğru bir yanlılık yaratıyor. Bir meslek için düşük ölçülen "yapay zeka teması", o işin gerçekten yapay zeka desteğine dirençli olduğu anlamına gelebileceği gibi, o mesleğin başka bir yapay zeka ürününü yoğun kullansa bile özellikle Claude'u benimsememiş olduğu anlamına da gelebilir. Anthropic bu sınırlamayı kendi metodoloji notlarında açıkça belirtiyor ve birisi bir AEI yüzdesini bir işgücü piyasası gerçeği gibi değil, bir Claude kullanım gerçeği gibi aktardığında bunu hatırlatmakta fayda var.

Kişisel görüşüm şu: buradaki asıl değerli uzun vadeli sinyal tek bir yüzde değil — Anthropic'in yavaş ilerleyen bir PDF rapor temposunu canlı, sorgulanabilir bir yüzeye dönüştürmüş olması. Bu, "yapay zekanın ekonomik etkisi" tartışmasının tamamını yıllık geriye dönük değerlendirmelerden, insanların gerçek zamanlı olarak sorgulayabileceği bir şeye doğru itiyor. Bu erişim değişimi, mevcut dalgadaki herhangi bir tek veri noktasından daha önemli.

Bu bağlantının içinde durduğu daha geniş model manzarasını takip ediyorsanız [Claude Sonnet 5, GPT-5.6 ve Gemini 3.5 karşılaştırmamız](/tr/posts/claude-sonnet-5-gpt-5-6-gemini-3-5-kiyaslamasi) üç laboratuvarın bugün nerede durduğunu ele alıyor; Anthropic'in kullanıcılara kendi kullanım verilerine doğrudan görünürlük kazandırma yönündeki bir diğer hamlesini görmek isterseniz [Claude Reflect](/tr/posts/claude-reflect-nedir-anthropic-panosu) iyi bir tamamlayıcı okuma. Araştırma iş akışları için özellikle [NotebookLM rehberimiz](/tr/posts/notebooklm-ile-arastirma-ve-ogrenme), Google'ın yapay zeka yanıtlarını tanımlı bir kaynak kümesine dayandırma konusundaki rakip yaklaşımını ele alıyor. Skills sizin için yeni bir kavramsa bugünkü diğer yazımız [herkes için Claude Skills rehberine](/tr/posts/claude-skills-nedir-herkes-icin) göz atın — bağlantı ile Skills ayrı özellikler olsa da ikisi de Claude'u sadece bir sohbet penceresi değil, yapılandırdığınız bir platforma dönüştürme yönündeki aynı değişimin parçası. Daha fazlası için [AI kategorimize](/tr/category/yapay-zeka) bakabilirsiniz.

## Sıkça Sorulan Sorular

### Anthropic Ekonomi Endeksi nedir?

Anthropic'in, anonimleştirilmiş Claude konuşmalarını ABD Çalışma Bakanlığı görev kategorileriyle eşleştirerek gerçek dünyadaki yapay zeka kullanım örüntülerini meslek bazında ölçen sürekli araştırma projesi. Şubat 2025'ten bu yana beş dalga veri yayınladı.

### Claude'da Ekonomi Endeksi bağlantısını nasıl etkinleştiririm?

claude.ai'de Ayarlar → Bağlantılar'ı açın, dizinde Anthropic Ekonomi Endeksi'ni bulun ve etkinleştirin. Ardından ekstra bir kurulum gerekmeden, herhangi bir Claude modeliyle, herhangi bir sohbette çalışır.

### Ekonomi Endeksi bağlantısı API veya Claude Code üzerinden kullanılabiliyor mu?

Bu lansman itibarıyla bağlantı claude.ai üzerinde sunuluyor. Ham veri üzerinde kendi aracını geliştirmek isteyenler için temel veri setleri Anthropic'in web sitesinden ücretsiz indirilebiliyor.

### Mesleğimde yüksek bir AEI yüzdesi, o işlerin yapay zeka tarafından değiştirileceği anlamına mı geliyor?

Hayır. Endeks, Claude'un kendi kullanıcı tabanı içindeki görev düzeyinde kullanım örüntülerini, güçlendirme (bir göreve yardımcı olma) ve otomasyon (bir görevi devralma) olarak ayırarak ölçüyor; tüm işgücü piyasasını temsil eden bir örneklem olduğunu iddia etmiyor.
