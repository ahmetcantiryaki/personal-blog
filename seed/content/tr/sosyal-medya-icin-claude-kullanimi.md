---
title: "Sosyal Medya İçin Claude Kullanımı: Tam Rehber"
slug: "sosyal-medya-icin-claude-kullanimi"
translationKey: "claude-social-media-guide"
locale: "tr"
excerpt: "Sosyal medya için Claude: marka sesini Styles ile ayarlayın, aylık içeriği Projects'te toplu üretin, analitiği geri besleyin. Görsel üretmez ama yazar."
category: "social-media"
tags: ["ai-tools", "prompt-engineering", "productivity", "personal-branding", "automation", "claude"]
publishedAt: "2026-07-13"
seoTitle: "Sosyal Medya İçin Claude: İçerik Üretimi Rehberi"
seoDescription: "Sosyal medya için yapay zeka rehberi: Claude ile içerik üretimi, marka sesi, aylık takvim, görsel gerçeği ve platform etiketleme kurallarını anlatıyoruz."
---

Sosyal medya için Claude kullanımı üç adıma iner: marka sesini bir Style ile bir kez tanımlayın, aylık içeriği bir Project içinde toplu üretin, sonra yayın verilerini geri besleyerek bir sonraki partiyi iyileştirin. Claude thread, gönderi açıklaması, Reels senaryosu ve yorum yanıtlarını sizin tonunuzda yazar; ama raster görselleri kendiliğinden üretmez. Aşağıda Temmuz 2026 itibarıyla uçtan uca iş akışı var.

## Hızlı başlangıç: planlar, fiyatlar ve Türkiye

Claude'a başlamak için kredi kartı gerekmez; ücretsiz plan çoğu bireysel içerik üreticisine yeter. Düzenli üretim için Pro, ekipler için Team uygundur. Fiyatlar Temmuz 2026'da [claude.com/pricing](https://claude.com/pricing) üzerinde şöyle:

| Plan | Fiyat (USD) | Sosyal ekiplere ne sunar |
|---|---|---|
| Free | $0 | Web arama, Styles, dosya yükleme, Artifacts — deneme ve düşük hacim |
| Pro | $17/ay (yıllık) veya $20/ay | Sınırsız Projects, daha yüksek kullanım, tüm modeller |
| Max | $100/ay'dan (5x veya 20x kullanım) | Yüksek hacim, öncelikli erişim — ajans ve yoğun kullanım |
| Team | $20/koltuk/ay (yıllık), $25 aylık | Paylaşılan Projects, varsayılan olarak veriyle eğitim yok |

Türkiye, Claude.ai ve API için desteklenen ülkeler arasında ([anthropic.com/supported-countries](https://www.anthropic.com/supported-countries)); ayrı bir yerel fiyat kademesi yok, ödemeler USD üzerinden. Claude'un rakipler arasındaki yerini görmek isterseniz [2026'nın en popüler yapay zeka araçları](/tr/posts/en-populer-yapay-zeka-araclari-2026) pillar rehberimiz haritayı çıkarıyor.

## Marka sesini kurun: Styles ve Projects

İki mekanizma var ve ikisi de her planda çalışır. Style, artı menüsünden bir yazı örneği yükleyerek ya da sesi tarif ederek oluşturduğunuz bir profildir; Claude cümle uzunluğunuzu, tonunuzu ve kelime tercihlerinizi yakalayıp her sohbete uygular. Project ise kalıcı bir çalışma alanı: marka rehberini, ürün tek sayfalığını ve geçmiş iyi gönderileri özel talimat olarak sabitlersiniz. İkisini birleştirin — Style tonu taşısın, Project bağlamı hatırlasın.

```text
MARKA SESİ REHBERİ
- Kişilik: [3 sıfat]
- Yaparız: [kısa cümle, somut örnek, 2. tekil şahıs]
- Yapmayız: [jargon, abartı, ünlem yığını, "unlock/leverage" klişeleri]
- Yasaklı kelimeler: [liste]
- Emoji politikası: [hiç / minimal / bol]
- CTA kütüphanesi: [3-5 hazır çağrı]
- Örnek "iyi" gönderi: [yapıştır]
- Örnek "kötü" gönderi ve nedeni: [yapıştır]
```

## Platform platform: altı hazır prompt şablonu

Claude ile içerik üretimi, marka sesi hazır olduğunda mekanikleşir. Aşağıdaki altı şablonu kopyalayın, köşeli parantezleri doldurun ve Project'inizde çalıştırın. Hacimli taslaklar için Sonnet 5, strateji ve ince ayar için Opus 4.8 modeline geçin.

**X (Twitter) thread'i**

```text
Rol: [sektör] alanında viral thread yazarı.
Konu: [konu]. Hedef kitle: [kitle]. Amaç: [takipçi/tık/etkileşim].
Bir açılış tweet'i (kanca ilk 2 satırda, hashtag YOK) ve ardından
6-8 tweet'lik bir thread yaz. Her tweet <=270 karakter ve kendi
başına anlamlı olsun. Son tweet net bir CTA içersin.
Ton: [marka Style'ı]. 3 farklı açılış kancası da öner.
```

**LinkedIn gönderisi**

```text
LinkedIn için düşünce liderliği gönderisi yaz. Konu: [konu].
Yapı: 1 satırlık kanca + boş satır + 120-200 kelime gövde +
3 maddelik çıkarım + soru biçiminde CTA.
Emoji minimal, jargon yok, yapay zeka kokusu olmasın.
3 alternatif kanca üret. Hashtag: en fazla 3, sonda.
```

**Instagram açıklaması + hashtag**

```text
Instagram carousel/feed için açıklama yaz. Ürün/konu: [x].
Marka sesi: [Style]. Yapı: feed'de kesilmeden görünen ilk satır +
2-3 kısa paragraf + CTA + ayrı satırda 8-12 hashtag
(5 niş, 4 orta, 3 geniş erişim karışımı).
İki versiyon ver: (a) eğlenceli (b) bilgilendirici.
```

**Reels / TikTok senaryosu**

```text
30 saniyelik Reels senaryosu yaz. Konu: [x].
Sütunlu tablo ver: [Zaman | Görsel/aksiyon | Ekran yazısı | Seslendirme].
İlk 3 saniyede pattern-interrupt kanca kur. Sonda CTA + kaydet/paylaş
çağrısı ekle. Ritmi işaretle; trend ses adı uydurma. Ton: [Style].
```

**YouTube başlığı + açıklaması**

```text
Video konusu: [x].
1) 5 başlık öner (<=60 karakter, tık odaklı ama clickbait değil,
   anahtar kelime başta).
2) SEO açıklaması: ilk 2 satır kancayı ve ana anahtar kelimeyi taşısın,
   sonra 150 kelime özet, zaman damgaları için yer tutucu, 3-5 hashtag.
3) 10 etiket öner.
```

**Topluluk yönetimi yanıtları**

```text
Aşağıdaki yorumlara marka sesiyle yanıt taslakları hazırla.
Kategorilere ayır: [övgü / soru / şikayet / troll].
Şikayette: empati + sahiplen + çözüm, savunmacı olma.
Trollde: kısa ve nazik ya da görmezden gel öner. Her yanıt <=2 cümle.
Yorumlar: [yapıştır].
```

## Tek oturumda 30 günlük içerik takvimi

Gönderileri tek tek yazmak yerine ayın tamamını tek promptla çıkarın. Bir Project açın ("Sosyal Medya — [Marka]"), marka rehberini ve geçmiş iyi gönderileri yükleyin, sonra şunu çalıştırın:

```text
Bu Project'teki marka sesini kullanarak Temmuz için içerik takvimi üret.
Çıktı: Markdown tablo [Gün | Platform | Tür | Kanca | Tam metin | Hashtag | Görsel notu | CTA].
Dağıtım: 12 Instagram, 8 LinkedIn, 6 X thread fikri, 4 Reels senaryosu.
Tema kümeleri: [eğitici / ürün / sosyal kanıt / perde arkası].
Tekrar eden kanca kullanma. Türkçe yaz.
```

Bir Project, bağlamı kalıcı olarak ve 200 bin token'a kadar koruduğu için "on beşinci günü değiştir" ya da "tüm LinkedIn gönderilerini kısalt" gibi düzeltmeler, her şeyi yeniden yapıştırmadan marka sesinde kalır. Tabloyu Markdown olarak dışa aktarıp Notion veya Sheets'e yapıştırın. Bir uyarı: 30 zengin gönderi Pro'nun 5 saatlik penceresini zorlayabilir; iki partiye bölün ya da Max kullanın.

## Analitik döngüsü: veriyi geri besleyin

Claude canlı platform metriklerini kendisi çekmez — yerleşik bir sosyal API yok — ama dışa aktardığınız CSV, XLSX ve ekran görüntülerini okur. Döngü şöyle: analitiği dışa aktarın, Project'e yükleyin ve şunu çalıştırın:

```text
Ekli analitik CSV'sini incele.
1) Etkileşim oranına göre en iyi ve en kötü 5 gönderiyi çıkar.
2) Ortak paydaları bul (format, saat, uzunluk, kanca türü, hashtag).
3) Önümüzdeki 2 hafta için 5 test edilebilir hipotez öner.
4) Bu içgörülerle marka sesinde 10 yeni gönderi fikri üret.
Çıktıyı tablo ve kısa yönetici özeti olarak ver.
```

Öğrenilenleri Project talimatlarına geri yazın; bir sonraki parti kendiliğinden daha isabetli çıkar. GA4 gibi kaynakları [Model Context Protocol (MCP)](/tr/posts/model-context-protocol-nedir) bağlayıcılarıyla bağlarsanız bu döngüyü kısmen otomatikleştirebilirsiniz.

## Claude görsel üretir mi?

Kısa yanıt: hayır. Claude, fotoğraf veya illüstrasyonları görsel üretim araçlarının yaptığı gibi üretmez — bunu Anthropic'in [resmi destek makalesi](https://support.claude.com/en/articles/9002504-can-claude-produce-images) açıkça yazıyor. Yani Midjourney ya da Nano Banana tarzı raster çıktı beklemeyin. Buna karşılık sosyal görsel iş akışında Claude'un yapabildikleri gerçek:

- **SVG carousel ve alıntı kartı şablonları** — Artifacts içinde düzenlenebilir, marka renklerinde, dışa aktarılabilir; metin ağırlıklı LinkedIn ve Instagram carousel'leri için ideal.
- **Alt metin** — erişilebilirlik ve erişim için otomatik alternatif metin.
- **Vision ile görsel eleştirisi** — taslak bir kreatifi yükleyip kompozisyon, okunabilirlik ve marka uyumu üzerine geri bildirim isteyin.
- **Diyagram ve grafik** — infografik tarzı gönderiler için Mermaid ve veri görselleştirme.
- **MCP ile raster üretim** — FLUX ya da Stable Diffusion gibi bir modeli bağlayıcıyla ekleyin; promptu Claude yazsın, görseli dış model bassın.

Bana kalırsa Claude'u bir görsel üreteci gibi zorlamak en sık yapılan hata; onu metin ve konsept motoru olarak konumlandırıp fotogerçekçi görseli ayrı bir araca bırakmak çok daha temiz sonuç veriyor. Fotogerçekçi üretim için Claude'u (kopya, konsept ve prompt yazımı) özel bir üreteçle eşleştirin — seçenekler için [2026'nın en iyi yapay zeka görsel araçları](/tr/posts/en-iyi-yapay-zeka-gorsel-araclari-2026) karşılaştırmamıza bakın.

## Yapay zeka içeriğini etiketlemek zorunda mısınız?

Metin ağırlıklı işte beş platformun hiçbiri yapay zekayla yazılmış gönderi metnini yasaklamıyor ya da etiket zorunlu tutmuyor. Zorunluluk gerçekçi sentetik medyaya (deepfake, fotogerçekçi görsel veya ses) bağlanıyor. Ayrıca AB Yapay Zeka Yasası'nın [50. Maddesi](https://artificialintelligenceact.eu/article/50/) şeffaflık yükümlülüklerini 2 Ağustos 2026'dan itibaren uyguluyor; ceza 15 milyon avroya kadar çıkabiliyor.

| Platform | AI metin/başlık | Gerçekçi sentetik medya |
|---|---|---|
| X (Twitter) | Etiket gerekmez | Gönüllü "Made with AI"; etiketsiz gerçekçi medyada gelir paylaşımı yaptırımı |
| Meta / Instagram | Etiket gerekmez | Mayıs 2026'dan bu yana zorunlu etiket; sponsorlu AI görsel/ses açıklanmalı |
| LinkedIn | Açıklama önerilir | AI üretilen ve AI ile geliştirilen içerik için açıklama şart |
| TikTok | Etiket gerekmez | Gerçekçi AIGC etiketlenmeli; etiketsizde anında yaptırım |
| YouTube | Etiket gerekmez | Sadece gerçekçi "değiştirilmiş içerik" açıklanır; senaryo ve başlık muaf |

Özet: metin, açıklama, senaryo ve strateji için Claude'u serbestçe kullanabilirsiniz; etiket yükümlülüğü yalnızca gerçek sanılabilecek sentetik medyada devreye giriyor.

## Claude mı, ChatGPT mi? Sosyal medya karşılaştırması

İkisi de güçlü ama farklı işlerde. Claude uzun metinde daha az "yapay" duruyor ve marka sesini daha iyi taşıyor; ChatGPT ise yerleşik görsel üretimiyle hepsi bir arada. Ayrıntılı model kıyası için [Gemini mi ChatGPT mi](/tr/posts/gemini-mi-chatgpt-mi) ve [ChatGPT tam rehberi](/tr/posts/chatgpt-tam-rehber-2026) yazılarımıza bakabilirsiniz.

| Ölçüt | Claude | ChatGPT |
|---|---|---|
| Uzun, insansı metin | Daha güçlü, daha az "yapay" | İyi ama uzun metinde daha düz |
| Yerleşik görsel üretimi | Yok (SVG/diyagram + MCP) | Var, güçlü raster üretim |
| Sohbet bağlam penceresi | 1M token (Sonnet 5/Opus 4.8) | Modele bağlı |
| Marka sesi araçları | Styles + Projects, her planda | Özel talimat + GPT'ler |
| Giriş fiyatı | Ücretsiz; Pro $17-20/ay | Ücretsiz; Plus benzeri |
| En iyi olduğu iş | Metin, strateji, analiz | Görsel dahil hepsi bir arada |

## İki mini örnek

**Yerel kafe (Instagram öncelikli):** Sahibi bir "Kafe [X]" Project'i kurar; menüyü, içecek fotoğraflarını (Vision ile açıklama fikri için) ve sıcak, samimi bir Style yükler. Tek oturumda 20 Instagram açıklaması, 8 Reels senaryosu (barista bakışı, yeni sezon içeceği) ve yerel (#istanbulkahve) ile niş hashtag setleri çıkar. Haftalık döngüde Instagram Insights CSV'si yüklenir; Claude, Reels'in statik gönderiyi 3'e 1 geçtiğini bulur ve sonraki parti videoya kayar. Açıklamalar için etiket gerekmez.

**B2B SaaS (LinkedIn + X, iki dilli):** Pazarlama sorumlusu konumlandırma dokümanını, ideal müşteri profilini ve en iyi 5 gönderiyi bir Project'e yükler. Opus 4.8, 30 günlük düşünce liderliği takvimi taslar: LinkedIn carousel'leri (SVG Artifact şablonları), blog yazılarından X thread'leri ve gelen yorumlar için yanıt bankası. LinkedIn dışa aktarımındaki analiz, "karşıt görüş" kancalı gönderilerin 2 kat yorum getirdiğini gösterir ve bu bulgu Style'a işlenir. AI ile geliştirilen ürün görselleri LinkedIn şartlarına göre açıklanır.

## Sıkça Sorulan Sorular

### Claude sosyal medya için ücretsiz kullanılabilir mi?

Evet. Free plan, Styles ve Artifacts dahil temel özellikleri 0 dolara sunar ve düşük hacimli üretime yeter. Düzenli çalışıyorsanız Pro ($17-20/ay) sınırsız Projects ve daha yüksek kullanım ekler.

### Claude görsel veya resim üretir mi?

Hayır, yerleşik olarak raster fotoğraf ya da illüstrasyon üretmez. SVG carousel, diyagram ve grafik üretebilir, yüklediğiniz görselleri Vision ile eleştirebilir; fotogerçekçi görsel için MCP üzerinden harici bir modele bağlanır.

### Claude ile marka sesi nasıl ayarlanır?

İki yolla: bir yazı örneğinden ya da tarifle oluşturduğunuz özel bir Style ile veya marka rehberini kalıcı Project talimatı olarak yükleyerek. En iyi sonuç ikisini birleştirmekten çıkar.

### Yapay zekayla üretilen sosyal medya gönderilerini etiketlemek zorunda mıyım?

Metin, açıklama ve senaryo için genelde hayır. Zorunluluk gerçekçi sentetik medyada (deepfake, fotogerçekçi görsel veya ses) devreye girer; bunu platform kuralları ve 2 Ağustos 2026'dan itibaren AB Yapay Zeka Yasası'nın 50. Maddesi düzenler. Diğer yapay zeka rehberleri için [yapay zeka kategorimize](/tr/category/yapay-zeka) göz atabilirsiniz.
