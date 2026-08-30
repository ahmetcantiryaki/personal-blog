---
title: "ChatGPT Hafıza Doldu Sorunu ve Projeler Rehberi"
slug: "chatgpt-hafiza-doldu-projeler-rehberi"
translationKey: "chatgpt-memory-cleanup-projects"
locale: "tr"
excerpt: "Kısa cevap: ChatGPT'nin kalıcı hafızası yaklaşık 900-1.500 kelimelik küçük bir alan. Doldu uyarısı alınca eskileri sil, kalıcı bilgiyi Projeler'e taşı."
category: "career-productivity"
tags: ["chatgpt", "productivity", "ai-tools", "time-management"]
publishedAt: "2026-08-30"
seoTitle: "ChatGPT Hafıza Doldu Sorunu Nasıl Çözülür?"
seoDescription: "Kısa cevap: ChatGPT'nin kalıcı hafızası yaklaşık 900-1.500 kelimelik küçük bir alan. Doldu uyarısı alınca eskileri sil, kalıcı bilgiyi Projeler'e taşı."
---

Kısa cevap: ChatGPT'nin kalıcı hafızası (persistent memory) yaklaşık 1.200-2.000 token, yani 900-1.500 kelimelik küçük bir alan — Ayarlar > Kişiselleştirme > Hafıza altında genelde 8-12 giriş olarak görünüyor. "Hafıza doldu" uyarısı aldığında, eski ve artık geçerli olmayan girdileri sil, kalıcı olması gereken bilgiyi ise global hafıza yerine bir Proje'nin talimatlarına taşı.

## "Hafıza doldu" uyarısı neden çıkıyor?

ChatGPT'nin hafıza sistemi, konuşma içi bağlam penceresinden (context window) tamamen farklı bir şey. Bağlam penceresi tek bir konuşma içindeki geçici çalışma alanı ve genelde 8.000 ile 200.000 token arasında, yani kabaca 6.000 ile 150.000 kelime arasında değişiyor. Kalıcı hafıza ise konuşmalar arasında taşınan, çok daha küçük bir depo — bu depo dolduğunda ChatGPT yeni bir şeyi hatırlamak için eski bir girdiyi silmeni istiyor.

Bu sınır, özellikle ChatGPT'yi aylardır her gün kullanan, kişisel tercihlerini, proje detaylarını ve iş bağlamını sürekli hatırlamasını isteyen kullanıcılarda hızla doluyor. Sorun kötü kullanımdan değil, hafızanın zaten küçük bir alan olarak tasarlanmasından kaynaklanıyor.

## Hafızayı nasıl temizlerim?

Ayarlar > Kişiselleştirme > Hafıza > Hafızaları Yönet yolundan tüm kayıtlı girdileri liste halinde görebiliyorsun. Temizlik döngüsü basit: listele, hâlâ geçerli olanları özetleyerek tek bir girdide birleştir, artık geçerli olmayanları sil, gerekiyorsa özetlediğin bilgiyi yeniden kaydet. Bu döngüyü ayda bir kez yapmak, hafızanın sürekli dolu kalmasını önlüyor.

Haziran 2026 itibarıyla Plus ve Pro hesapları, geçmiş konuşmalardan otomatik olarak hafıza sentezleyen "dreaming" sistemine varsayılan olarak geçti ve ücretli hesaplar için kapasite iki katına çıktı. Bu, manuel temizlik ihtiyacını azaltsa da ortadan kaldırmıyor — sistem otomatik özetlese bile, artık geçersiz olan bilgiyi elle silmen gerekiyor.

## Hafıza girdilerini etiketlemek işe yarıyor mu?

Evet. Hafıza girdilerini "Hakkımda" ve "İş" gibi kategorilere ayırmak, hangi bilginin hangi bağlamda kullanılacağını netleştiriyor. Örneğin kişisel tercihlerini (yazım tonu, dil tercihi) "Hakkımda" kategorisinde tutup, aktif bir projenin teknik detaylarını "İş" kategorisinde tutmak, ikisinin birbirine karışıp yanlış bağlamda ortaya çıkmasını engelliyor.

Tekrarlanabilir prompt testleri yapıyorsan (ör. aynı prompt'u farklı zamanlarda karşılaştırmak için), hafızayı geçici olarak kapatmak mantıklı — çünkü hafıza açıkken aynı prompt'un cevabı, geçmiş konuşmalardan sızan bağlama göre değişebiliyor. Bu, A/B karşılaştırması yaparken sonuçları güvenilmez hale getiriyor. Hafızayı kapatmak için Ayarlar > Kişiselleştirme > Hafıza altındaki anahtarı geçici olarak kapatman yeterli; test bitince aynı yerden tekrar açabilirsin, kayıtlı girdiler bu sırada silinmiyor.

## Global hafıza ile Projeler arasındaki fark ne?

Global hafıza, tüm konuşmalarında arka planda çalışan ve boyutu sınırlı bir depo. Projeler ise belirli bir işe özel, kendi talimatları ve dosyaları olan ayrı bir çalışma alanı; bir Proje'nin talimat alanı, global hafızadan çok daha büyük bir metni tutabiliyor ve dosya eklemeyi destekliyor.

Pratik kural şu: bir bilgi sadece belirli bir proje için geçerliyse (ör. "bu müşteri için X formatını kullan"), o bilgiyi global hafızaya değil, ilgili Proje'nin talimatlarına yaz. Global hafızayı sadece gerçekten her konuşmada geçerli olan bilgiler için ayır (ör. iletişim dilin, genel yazım tonun). Bu ayrım, hem hafızanın dolmasını yavaşlatıyor hem de yanlış bağlamda bilgi sızmasını önlüyor. Birden fazla aktif projesi olan bir kullanıcı için bu fark küçük görünse de, altı ay sonra hangi tercihin hangi işe ait olduğunu global hafızada aramaktansa, doğru Proje'yi açıp orada bulmak çok daha hızlı.

Aşağıdaki tablo üç seçeneği karşılaştırıyor:

| Özellik | Global Hafıza | Özel Talimatlar (Custom Instructions) | Proje Talimatları |
|---|---|---|---|
| Kapasite | ~900-1.500 kelime (Ağustos 2026) | 1.500 karakter sınırı | Çok daha geniş, dosya eki destekli |
| Kapsam | Tüm konuşmalar | Tüm konuşmalar | Sadece o Proje içindeki konuşmalar |
| Güncelleme şekli | Otomatik (dreaming) veya manuel | Tamamen manuel, sen kontrol edersin | Manuel, proje bazında düzenlenir |
| En uygun kullanım | Kalıcı, evrensel kişisel tercihler | Sabit, öngörülebilir davranış kuralları | Projeye özel bağlam ve dosyalar |

## Bir bilgiyi hafızadan Proje'ye taşımak nasıl görünüyor?

Somut bir örnek üzerinden gidelim: hafızanda "Müşteri X için raporları her zaman madde işaretleriyle ve İngilizce yaz" gibi bir girdi varsa, bu bilgi aslında sadece o müşteriyle ilgili konuşmalarda geçerli — ama global hafızada durduğu için ChatGPT bunu Müşteri Y ile ilgili bir konuşmada da hatırlayıp yanlış formatta bir cevap üretebilir. Doğru çözüm, bu satırı hafızadan silip Müşteri X için oluşturduğun Proje'nin talimatlarına taşımak.

Bu taşıma işlemi üç adımda tamamlanıyor: önce Ayarlar > Kişiselleştirme > Hafıza'dan ilgili girdiyi bul ve kopyala, sonra o müşteriye ait Proje'yi aç ve talimatlar alanına yapıştır, son olarak orijinal girdiyi global hafızadan sil. Bu işlemi yaptıktan sonra aynı talimat sadece o Proje içindeki konuşmalarda devreye giriyor, başka hiçbir yerde sızmıyor.

## Özel talimatlar (custom instructions) ne zaman hafızadan daha iyi?

Özel talimatlar, 1.500 karakterlik bir sınıra sahip ama tamamen senin kontrolünde — otomatik sentezleme yok, sistem kendiliğinden bir şey ekleyip çıkarmıyor. Davranışın öngörülebilir ve sabit kalmasını istediğin durumlarda (ör. "her zaman madde işaretleriyle cevap ver") özel talimatlar, zamanla değişebilen hafıza girdilerinden daha güvenilir.

Hafıza daha çok "ChatGPT'nin seni tanıması" için, özel talimatlar ise "her konuşmada aynı kuralın uygulanması" için var. İkisini karıştırmak, hangi ayarın hangi davranışı tetiklediğini takip etmeyi zorlaştırıyor.

## Hafıza yönetimini bir alışkanlığa nasıl dönüştürürüm?

Aylık bir bakım ritmi kur: ayın başında Ayarlar > Kişiselleştirme > Hafıza'ya gir, listeyi gözden geçir, artık geçerli olmayan girdileri sil, tekrar eden veya birbirini kapsayan girdileri tek bir cümlede birleştir. Bu döngüyü [ChatGPT Pulse'ın yerini alan zamanlanmış görevler rehberimizdeki](/tr/posts/chatgpt-pulse-gunluk-ozet) mantıkla birleştirip, ayın ilk günü sana bir hatırlatma gönderecek bir zamanlanmış görev bile kurabilirsin.

ChatGPT'nin hangi plan ve özelliklerle geldiğini merak ediyorsan [ChatGPT Tam Rehber 2026 yazımıza](/tr/posts/chatgpt-tam-rehber-2026) bakabilirsin. Tablo tabanlı işler için ChatGPT ile Gemini'yi karşılaştırdığımız [Tablolar İçin ChatGPT mi Gemini mi yazımız](/tr/posts/tablolar-icin-chatgpt-mi-gemini-mi) da benzer bir iş akışı yönetimi perspektifi sunuyor. Araştırma odaklı bir kullanım için hafıza yerine kaynak yönetimini merkezi bir yere taşımak istersen, [ChatGPT, Gemini ve Claude'un deep research modlarını karşılaştırdığımız yazı](/tr/posts/deep-research-chatgpt-gemini-claude) da faydalı bir tamamlayıcı.

## Sıkça Sorulan Sorular

### ChatGPT hafızası kaç kelime tutabiliyor?

Ağustos 2026 itibarıyla ChatGPT'nin kalıcı hafızası yaklaşık 1.200-2.000 token, yani 900-1.500 kelime civarında ve genelde 8-12 girdi olarak görünüyor. Bu, konuşma içi bağlam penceresinden (8.000-200.000 token) çok daha küçük bir alan, çünkü hafıza konuşmalar arasında taşınan kalıcı bir depo.

### Hafızayı temizlemek verilerimi kaybetmeme neden olur mu?

Sadece sildiğin belirli girdi kaybolur, konuşma geçmişinin kendisi etkilenmez. Önemli bir bilgiyi silmeden önce özetleyip tek bir girdide yeniden kaydetmek veya kalıcı olması gereken bağlamı bir Proje'nin talimatlarına taşımak, veriyi kaybetmeden hafızayı boşaltmanın en güvenli yolu.

### Özel talimatlar mı hafıza mı kullanmalıyım?

Davranışının her konuşmada aynı ve öngörülebilir kalmasını istiyorsan özel talimatlar (custom instructions) daha güvenilir, çünkü tamamen senin kontrolünde ve 1.500 karakterlik net bir sınırı var. Hafıza ise ChatGPT'nin seni zamanla tanıması ve geçmiş konuşmalardan bağlam taşıması için daha uygun, ama otomatik sentezleme nedeniyle biraz daha öngörülemez.

### Proje talimatlarına ne tür bilgi koymalıyım?

Sadece o projeye özel olan bağlamı Proje talimatlarına koy: müşteri adı, format tercihleri, o iş için geçerli terminoloji, ilgili dosyalar. Her konuşmada geçerli olması gereken genel bilgileri (iletişim dilin, genel yazım tonun) global hafızada veya özel talimatlarda tutmak, projeler arasında bağlamın karışmasını önlüyor.
