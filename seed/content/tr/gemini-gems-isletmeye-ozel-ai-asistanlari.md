---
title: "Gemini Gems ile İşletmene Özel AI Asistanları"
slug: "gemini-gems-isletmeye-ozel-ai-asistanlari"
translationKey: "gemini-gems-custom-ai-assistants-business"
locale: "tr"
excerpt: "Gemini Gems, tekrar eden görevler için talimat ve bağlamı kaydeden özel AI asistanları oluşturmanı sağlar. Kurulumdan hazır tariflere adım adım rehber."
category: "business"
tags: ["gemini", "ai-tools", "automation", "productivity", "workflow"]
publishedAt: "2026-07-22"
seoTitle: "Gemini Gems: İşletmeye Özel AI Asistanı Kurulumu"
seoDescription: "Gemini Gems nedir, nasıl kurulur? Hazır iş Gem'leri, adım adım özel Gem oluşturma, Opal entegrasyonu ve klonlanabilir üç Gem tarifiyle pratik rehber."
---

Gemini Gems, aynı talimatı her seferinde yeniden yazmak yerine bir rolü, bir bağlamı ve isteğe bağlı referans dosyaları tek seferde kaydettiğin özel Gemini sürümleridir. Kurulunca o Gem her açıldığında aynı uzmanlıkla karşına çıkar — tekrar eden iş akışları için tek seferlik prompt yazmaktan çok daha hızlıdır.

## Gem tam olarak nedir

Bir Gem, tek seferlik bir prompttan farklı olarak kalıcı bir yapılandırmadır. Ona bir isim, bir rol tanımı ("sen bir satış e-postası editörüsün" gibi) ve gerektiğinde referans dosyaları verirsin; Gemini bu bilgiyi her konuşmanın başında hatırlar. Google'ın Ağustos 2024'te duyurduğu gibi, amaç "Gemini'yi belirli ihtiyaçların için özelleştirmek" — yani genel amaçlı bir sohbet botunu, senin işine özgü sabit bir asistana dönüştürmek ([Workspace Updates duyurusu](https://workspaceupdates.googleblog.com/2024/08/customize-gemini-with-gems.html)).

Fark küçük görünse de günlük kullanımda büyük fark yaratıyor. Tek seferlik prompt yazarken her seferinde bağlamı, tonu ve formatı yeniden anlatırsın; Gem'de bunu bir kere yazarsın, sonra yalnızca o günkü girdiyi (müşteri e-postası, ilan metni, rakip listesi) yapıştırırsın. Bu farkı [Gemini ile ChatGPT'yi karşılaştırdığımız yazıda](/tr/posts/gemini-mi-chatgpt-mi) da ele almıştık — iki modelin de temel gücü benzer, ama Gemini'nin Gems katmanı iş akışını kalıcı hale getirme konusunda öne çıkıyor.

Gems, Gemini kullanan hesaplarda yer alıyor; Google Workspace planına Gemini zaten dahilse Gems ek ücret gerektirmeden aynı abonelik içinde geliyor.

## Google'ın hazır iş Gem'leri

Google, işletmelerin en sık karşılaştığı görevler için önceden yapılandırılmış Gem'leri Gemini uygulamasına ekledi. Aralık 2024'teki güncellemeyle bu liste genişledi ([Workspace Updates duyurusu](https://workspaceupdates.googleblog.com/2024/12/more-premade-gems-for-the-gemini-app.html)):

| Hazır Gem | Ne işe yarar | Kim kullanmalı |
|---|---|---|
| Marketing insights | Pazar verisini ve kampanya sonuçlarını yorumlayıp içgörü çıkarır | Pazarlama ekipleri, büyüme sorumluları |
| Sales pitch ideator | Ürün/hizmete göre satış konuşması ve argüman fikirleri üretir | Satış temsilcileri, hesap yöneticileri |
| Hiring consultant | İş ilanı, mülakat sorusu ve aday değerlendirme taslakları hazırlar | İK, işe alım sorumluları |
| Outreach specialist | Soğuk e-posta ve iş geliştirme mesajları taslaklar | İş geliştirme, saha satış |
| Copy creator | Reklam, ürün sayfası ve sosyal medya metni yazar | Pazarlama, içerik ekibi |
| Sentiment analyzer | Yorum, anket veya destek talebi metinlerinden duygu durumu çıkarır | Müşteri deneyimi, ürün yöneticileri |

Bu altısı özellikle küçük ekipler için değerli, çünkü ayrı ayrı bir uzman istihdam etmeden belirli bir işlevi Gemini'ye devretmiş oluyorsun. Ama hazır Gem'ler geneldir — senin ürün kataloğun, marka tonun veya sektörün için özelleştirilmemiştir. Asıl kaldıraç, bunları temel alıp kendi Gem'ini kurmakta.

## Kendi Gem'ini adım adım kurmak

Özel bir Gem oluşturmak dört adımdan oluşur ve toplamda on dakikadan az sürer:

1. **İsimlendir.** Gem'e ne yaptığını anında anlatan bir isim ver: "Müşteri e-posta yanıtlayıcısı" gibi. Genel bir isim ("Yardımcı") kullanırsan zamanla hangi Gem'in ne işe yaradığını unutursun.
2. **Rol ve talimat yaz.** Gemini'ye kim olduğunu, hangi tonu kullanacağını ve hangi sınırlar içinde çalışacağını söyle. "Sen [şirket]'in müşteri destek ekibindesin, resmi ama sıcak bir ton kullanırsın, asla fiyat taahhüdü vermezsin" gibi somut cümleler, genel tariflerden çok daha iyi sonuç verir.
3. **Referans dosya ekle.** Fiyat listesi, marka kılavuzu, geçmiş e-posta örnekleri gibi dosyaları Gem'e bağlayabilirsin. Gemini bu dosyaları her yanıtta bağlam olarak kullanır — sen her seferinde tekrar yapıştırmak zorunda kalmazsın.
4. **Test et ve düzelt.** İlk birkaç gerçek girdiyle Gem'i dene, çıktı istediğin tonda değilse talimatı düzelt. Bu döngü genelde iki üç denemede oturur.

Bu süreç aslında bir prompt mühendisliği alıştırması, ama tek seferlik değil — bir kez düzgün kurduğunda ekip arkadaşlarınla paylaşabildiğin kalıcı bir varlığa dönüşüyor. Aynı mantığı [NotebookLM ile araştırma yaparken](/tr/posts/notebooklm-ile-arastirma-ve-ogrenme) de görürsün: kaynakları bir kere yükleyip bağlamı sabitlemek, her defasında yeniden açıklamaktan çok daha verimli.

## Opal ile mini uygulamaya dönüştürme

Aralık 2025'te Google, Opal'ı (kodsuz mini AI uygulama/iş akışı oluşturma aracı) Gems ile entegre etti. Bu entegrasyonla bir Gem'i tek konuşmalık bir asistan olmaktan çıkarıp küçük, tekrar çalıştırılabilir bir iç araca dönüştürebiliyorsun — örneğin bir formdan veri alıp Gem'in analiz etmesini ve sonucu belirli bir formatta döndürmesini sağlayan basit bir akış. Bu geçişlerin altındaki modellerden biri de Gemini 3 Flash oldu; güçlü akıl yürütme yeteneğiyle bu tür akışlara varsayılan motor olarak atandı. Yeni model ailesindeki değişiklikleri [Gemini 3, 6 Flash ve 3,5 Flash Lite yazımızda](/tr/posts/gemini-3-6-flash-3-5-flash-lite-ve-cyber) daha ayrıntılı ele aldık.

Pratikte bu, kod yazmadan "müşteri talebini al, Gem ile sınıflandır, ilgili ekibe yönlendir" gibi küçük bir iç aracı bir öğleden sonrada kurabileceğin anlamına geliyor. Büyük bir otomasyon platformu kurmadan önce, bu tür basit akışları Opal + Gems ile deneyip gerçekten ihtiyacın olup olmadığını görmek mantıklı.

## Gem'ler nerede kazanır, nerede kaybeder

Benim gözlemim şu: Gems, iş **tekrar ediyorsa** ve **ekiple paylaşılacaksa** net kazanıyor. Haftada onlarca kez aynı türde müşteri e-postası yanıtlıyorsan, aynı formatta iş ilanı çıkarıyorsan ya da her hafta aynı yapıda rakip raporu hazırlıyorsan, o iş bir Gem'e dönüştürülmeyi hak ediyor. Kurulum maliyeti bir kez ödenir, kazanç her kullanımda katlanır.

Ama tek seferlik, gerçekten yeni bir problemde Gem kurmak zaman kaybı. Örneğin bir kerelik bir stratejik karar için beyin fırtınası yapıyorsan ya da daha önce hiç karşılaşmadığın türde bir analiz istiyorsan, sabit bir rol ve talimat seti seni sınırlar — o an ihtiyacın olan şey esnek, açık uçlu bir sohbet, kalıplaşmış bir asistan değil. Bu benim en net kanaatim: Gem'i "her zaman aynı şeyi soracağım" hissi doğduğunda kur, "bu sefer farklı bir şey deneyeyim" hissi varken kurma. İkincisinde Gem, esnekliği azaltan bir prangaya dönüşüyor.

Hangi aracın hangi işe uygun olduğuna karar verirken genel araç haritasına da bakmak faydalı; [2026'nın en popüler yapay zekâ araçları](/tr/posts/en-populer-yapay-zeka-araclari-2026) yazımızda Gemini'nin rakiplerine karşı nerede öne çıktığını topladık. Araştırma tarafında farklı bir motor arıyorsan [Perplexity ile Google'ın arama yaklaşımını karşılaştırdığımız yazı](/tr/posts/perplexity-mi-google-mi) da işine yarayabilir.

## Üç klonlanabilir Gem tarifi

Aşağıdaki üç Gem, küçük bir işletmede en sık tekrar eden görevleri kapsıyor. İsim ve talimatı aynen kopyalayıp kendi bağlamınla doldurabilirsin.

### 1. Müşteri e-postası yanıtlayıcısı

```text
İsim: Müşteri E-postası Yanıtlayıcısı

Rol: Sen [şirket adı]'nin müşteri destek ekibindesin.
Görevin gelen müşteri e-postalarına net, sıcak ve çözüm
odaklı yanıt taslakları hazırlamak.

Talimatlar:
- Ton: resmi ama samimi, asla robotik değil.
- Her yanıt üç bölümden oluşsun: sorunu özetle,
  çözümü/adımı açıkla, kapanışta bir sonraki adımı belirt.
- Fiyat, iade ya da yasal taahhüt gerektiren konularda
  taslağı "İnsan onayı gerekli" etiketiyle işaretle.
- Yanıt Türkçe geldiyse Türkçe, İngilizce geldiyse
  İngilizce yanıtla.
- Referans dosyadaki SSS ve politika metnine sadık kal,
  orada olmayan bir taahhütte bulunma.
```

### 2. Rakip analizi Gem'i

```text
İsim: Rakip Analizi Asistanı

Rol: Sen bir pazar araştırma analistisin, [sektör] alanındaki
rakiplerimizi düzenli olarak karşılaştırıyorsun.

Talimatlar:
- Girdi olarak bir rakip ismi veya URL'si verildiğinde
  şu başlıklarla rapor üret: konumlandırma, fiyatlama,
  öne çıkan özellik, zayıf nokta, bizim için fırsat.
- Rapor en fazla 400 kelime olsun, madde işaretli.
- Spekülasyon yapma; emin olmadığın bilgiyi
  "doğrulanmadı" diye işaretle.
- Referans dosyadaki kendi ürün özelliklerimizle
  karşılaştırmalı bir satır ekle.
```

### 3. İş ilanı Gem'i

```text
İsim: İş İlanı Yazarı

Rol: Sen [şirket adı]'nin işe alım ekibindesin, açık ve
kapsayıcı iş ilanları yazıyorsun.

Talimatlar:
- Girdi olarak pozisyon adı ve birkaç madde sorumluluk
  verildiğinde tam bir ilan metni üret: başlık, şirket
  tanıtımı (referans dosyadan), sorumluluklar, aranan
  nitelikler, sunduklarımız.
- Cinsiyet veya yaş ima eden dil kullanma.
- Zorunlu ve tercih edilen nitelikleri ayrı listele.
- İlan en fazla 350 kelime olsun.
```

Temmuz 2026 itibarıyla bu üçü, küçük işletmelerde en çok karşılaşılan senaryoları kapsıyor. Kurduktan sonra ekip arkadaşlarınla paylaşman birkaç dakika sürer, ama zamandan tasarrufu haftalar boyunca hissedilir. En büyük risk, kurup unutmak — talimatı ayda bir gözden geçirip gerçek çıktılarla karşılaştırmak, Gem'in kalitesini korumanın tek yolu.

## Sıkça Sorulan Sorular

### Gem ile normal bir prompt arasındaki fark ne?

Normal prompt tek seferliktir, her konuşmada yeniden yazılır. Gem ise rolü, talimatı ve referans dosyaları kalıcı olarak saklar; her açıldığında aynı bağlamla başlar. Tekrar eden görevlerde zaman kazandırır.

### Gems kullanmak için ayrı ücret ödemem gerekiyor mu?

Hayır. Google Workspace planına Gemini zaten dahilse Gems de aynı abonelik içinde, ek ücret ödemeden geliyor.

### Hazır Gem'ler yeterli mi, yoksa özel Gem mi kurmalıyım?

Hazır Gem'ler (Marketing insights, Sales pitch ideator, Hiring consultant, Outreach specialist, Copy creator, Sentiment analyzer) genel işler için iyi bir başlangıç. Ama şirketine özgü ton, ürün bilgisi veya politika varsa, özel bir Gem kurup referans dosya eklemek çok daha isabetli sonuç verir.

### Opal ile Gem arasındaki fark ne?

Gem, konuşma içinde çalışan bir uzman asistan. Opal ise Aralık 2025'ten itibaren Gems ile entegre çalışan, kod yazmadan küçük iş akışları/mini uygulamalar kurmanı sağlayan bir araç. Basit bir tekrar eden akışı otomatikleştirmek istiyorsan Opal + Gems kombinasyonuna bakabilirsin. Daha fazla iş fikri ve araç için [girişimcilik ve iş kategorimize](/tr/category/girisimcilik-is) göz atabilirsin.
