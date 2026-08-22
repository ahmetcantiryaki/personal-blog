---
title: "AI Asistanları Verilerinizle Ne Yapıyor?"
slug: "ai-asistanlari-caginda-gizliligini-koru"
translationKey: "protect-privacy-ai-assistants"
locale: "tr"
excerpt: "Claude, ChatGPT ve Gemini sohbet, bellek ve bağlı uygulama verini saklıyor; üçünde de belleği kapatmak eğitimden çıkmakla aynı anlama gelmiyor."
category: "technology"
tags: ["claude", "chatgpt", "gemini", "privacy"]
publishedAt: "2026-08-22"
seoTitle: "2026'da AI Asistan Gizliliği: Pratik Kontrol Listesi"
seoDescription: "Ağustos 2026 itibarıyla Claude, ChatGPT ve Gemini sohbet, bellek ve eğitim verini nasıl işliyor? Kişisel ve aile hesapları için adım adım gizlilik denetimi."
---

Kısa cevap: Claude, ChatGPT ve Gemini'nin üçü de sohbet geçmişini, senin hakkında zamanla çıkardığı gerçekleri tutan ayrı bir "bellek" katmanını ve bağlı uygulama verini saklıyor; üçünde de belleği kapatmak, sohbetlerinin model eğitiminde kullanılmasından otomatik olarak çıkmak anlamına gelmiyor — bunlar ayrı ayrı yönetmen gereken iki farklı ayar.

## AI Asistanları Senin Hakkında Tam Olarak Neyi Saklıyor?

Düzenli kullandığın herhangi bir AI asistanında dört farklı veri kategorisi birikir: ham sohbet geçmişin, asistanın zamanla senin hakkında çıkardığı gerçekleri tutan ayrı bir bellek katmanı, bağladığın herhangi bir uygulama ya da hesaptan (e-posta, takvim, dosyalar) gelen veri ve — özellikle ChatGPT'de — bir tarama/etkinlik geçmişi özelliği. Her kategorinin genelde kendi saklama ayarı ve kendi eğitim çıkış (opt-out) seçeneği var; "belleği kapattım" cümlesinin "artık hakkımda hiçbir şey saklanmıyor" anlamına gelmemesinin sebebi tam olarak bu.

## Claude Sohbetlerini Eğitimde Kullanıyor mu?

Tüketici hesapları için varsayılan olarak hayır, ama sen aksini seçmedikçe de değil; Claude for Work, Enterprise, API, Amazon Bedrock veya Google Vertex AI kullanımı ise hiçbir zaman eğitimde kullanılmıyor — bunlar sözleşmeyle hariç tutulmuş, ayrıca bir çıkış seçeneği gerekmiyor. Tüketici hesapları için Anthropic 2025'te varsayılanı değiştirdi: tüketici kullanıcıların, sohbetlerinin eğitimde kullanılmasından çıkmak için 28 Eylül 2025'e kadar süresi vardı; bu tarihten sonra çıkış yapmamış tüketici verisi eğitimde kullanılabilir hale geldi. O tarih civarında açıkça çıkış yapmadıysan, hariç tutulduğunu varsaymak yerine mevcut ayarını kontrol et. Claude'un sohbetler arasında senin hakkında gerçek sakladığı bellek özelliği isteğe bağlı ve 2026 boyunca Team ve Enterprise planları için kademeli olarak açılıyor; sakladığı her şeyi görebilir, düzenleyebilir ya da silebilirsin. Belirli bir konuşmayı bellekten ve geçmişten tamamen hariç tutan bir "Incognito" sohbet modu da mevcut.

## ChatGPT'nin Eğitim Ayarını Nasıl Kapatırsın?

Ayarlar → Veri Kontrolleri'ne git ve "Herkes için modeli geliştir" seçeneğini kapat — Free, Plus ve Pro hesaplarında varsayılan olarak açık geliyor. Bu, Memory'den (Bellek) ayrı bir seçenek: Memory'yi kapatmak ChatGPT'nin sohbetler arasında senin hakkında gerçek hatırlamasını durdurur ama tek başına eğitimden çıkmanı sağlamaz, tersi de geçerli. İkisini de istiyorsan iki ayarı da ayrı ayrı değiştirmen gerekiyor.

## ChatGPT'nin Computer History Özelliği Nedir, Açmak Güvenli mi?

Computer History, 13 Ağustos 2026'da yayınlanan, yalnızca macOS masaüstü uygulamasında bulunan bir özellik; varsayılan olarak kapalı ve açabilmen için önce Memory'nin etkin olması gerekiyor. macOS erişilebilirlik API'leri üzerinden uygulama ve web sitesi etkinliğini kaydedip özetlere dönüştürüyor — OpenAI, ekran görüntüsü, ses ya da gizli tarama modundan hiçbir şey yakalamadığını belirtiyor; hangi uygulama ve sitelerin katkıda bulunacağını sen seçiyorsun ve istediğin an duraklatabiliyorsun. Pro kullanıcıları kendileri açabiliyor; Business ve Enterprise kullanıcıları yönetici onayı gerektiriyor, AEA (Avrupa Ekonomik Alanı), İsviçre ve Birleşik Krallık'ta ise hiç mevcut değil. Yayınlanmasının kısa süre sonrasında, [Help Net Security 19 Ağustos 2026'da](https://www.helpnetsecurity.com) özellikle ilgili gizlilik ve bilgi hırsızı (infostealer) risklerini bildirdi — özellik yepyeni ve bağımsız güvenlik incelemesi için henüz fazla zaman geçmediği için açmadan önce okumaya değer. Özelliğin ayarlarını [ChatGPT Computer History: Kullanım ve Gizlilik](/tr/posts/chatgpt-computer-history-kullanim-gizlilik) yazımızda daha ayrıntılı ele aldık.

## Gemini'nin Ne Hatırladığını Nasıl Kontrol Edersin?

myactivity.google.com/product/gemini adresine git ve "Etkinliği Sakla" (Google bunu "Gemini Uygulamaları Etkinliği"nden yeniden adlandırdı) seçeneğini kapat. Kapatmak, gelecekteki konuşmaları insan incelemesinden ve eğitimden hariç tutuyor. Bilinmesi gereken bir uyarı: 2025'e ait bazı haberler, Google'ın inceleme örneklemesinin yalnızca yazılan metinle sınırlı olmadığını — yüklenen dosya ve fotoğrafların da örneklenebildiğini — ve Etkinlik kapalıyken bile bazı teknik meta verilerin (prompt şekli, gecikme) hâlâ kaydedilebildiğini, o haberlere göre hesap kimliğine bağlanmasa da, ortaya koydu. Etkinlik verisi için varsayılan saklama süresi 18 ay, Otomatik Sil ayarlarıyla değiştirilebiliyor. Google Workspace ve Enterprise için Gemini, Claude ve ChatGPT'nin iş katmanlarında izlediği aynı desenle, varsayılan olarak eğitimden sözleşmeyle hariç tutuluyor.

| | Tüketici eğitim çıkışı | Kurumsal/iş varsayılanı |
| --- | --- | --- |
| Claude | Çıkış gerekiyor (son tarih 28 Eylül 2025'ti); mevcut ayarını kontrol et | Sözleşmeyle asla eğitilmiyor, çıkış gerekmiyor |
| ChatGPT | Ayarlar → Veri Kontrolleri → "Herkes için modeli geliştir" (varsayılan açık) | Business/Enterprise anlaşmalarında varsayılan hariç |
| Gemini | myactivity.google.com/product/gemini → "Etkinliği Sakla" (varsayılan açık) | Workspace/Enterprise için varsayılan hariç |

## Bağlı Uygulamalara Ne Kadar Erişim Vermelisin?

Herhangi bir üçüncü taraf OAuth uygulamasına uyguladığın "en az yetki" ilkesini burada da uygula: asistanın sadece bir şeye bakması gerekiyorsa salt okunur erişim ver, asistanın senin adına işlem yapmasına özellikle ihtiyacın olmadıkça üretim sistemlerine ya da finansal hesaplara yazma erişimi olan hiçbir şeyi bağlama, ve bağlı uygulamalar listeni birkaç ayda bir gözden geçirip artık aktif kullanmadığın her şeyi iptal et. Tek seferlik bir iş için bir kez onayladığın bir bağlayıcıyı unutmak kolaydır — ve sen iptal edene kadar çalışmaya devam eder.

## Hangi Bilgiyi Asla Bir AI Asistanına Yapıştırmamalısın?

Tüketici AI sohbetini bir satıcının destek ekibine gönderdiğin bir mesaj gibi düşün: şifre, API anahtarı ya da token, sansürlenmemiş finansal hesap numarası, kimliğine bağlı sağlık kaydı ya da bir NDA veya avukat-müvekkil gizliliği kapsamındaki hiçbir şeyi yapıştırma — asistanın politikası bunu eğitimde kullanmayacağını söylese bile. Politikalar değişir, hesaplar ele geçirilir ve yapıştırılmış bir sır, geçerli eğitim ayarından bağımsız olarak sohbet geçmişinde durmaya devam eder. Hassas veriyle profesyonel olarak çalışması gereken bir asistana ihtiyacın varsa, sözleşmeyle veri hariç tutması ve yönetici kontrollü saklaması olan kurumsal katmanlar tam olarak bunun için var.

## Kurumsal Hesaplar Tüketici Hesaplarından Nasıl Farklı?

Üç sağlayıcının da kurumsal/iş katmanları aynı temel deseni paylaşıyor: varsayılan olarak verinde eğitim yok, yönetici kontrollü saklama politikaları ve (özellikle Claude için) denetlenen kuruluşlar için oturum transkripti erişimi gibi uyumluluk odaklı araçlar. Bu, bir kez ayarlayıp bir daha bakmayı unutabileceğin bir seçeneğe güvendiğin kişisel hesaptan anlamlı ölçüde farklı bir güven modeli. Kuruluşun regüle edilmiş veriyle çalışıyorsa, işle ilgili herhangi bir AI kullanımı için kişisel hesap yerine iş katmanını kullan, nokta.

## Çocuklar ve Aile Hesapları İçin Ne Yapmalısın?

Bir reşit olmayanın gözetimsiz kullanmasına izin vermeden önce asistanda yaşa uygun bir mod olup olmadığını kontrol et — hem OpenAI hem Anthropic 2026'da yaşla ilgili özellikler yayınladı (ChatGPT'de yaş tahmini ve gençlere özel ayarlar, Anthropic'ten eğitim odaklı bir teklif); reşit olmayan bir hesabın varsayılanları her zaman tahmin ettiğin kadar muhafazakâr olmayabiliyor. Aile üyesinin bağlı uygulamalarını ve bellek ayarlarını kendi hesabınmış gibi gözden geçir; çünkü paylaşılan bir ev cihazı, hesaplar ayrı tutulmadıkça genelde paylaşılan bir bellek profili demek.

## Periyodik Gizlilik Denetimi Nasıl Yapılır?

```text
Düzenli kullandığın her AI asistanı için 3 ayda bir:
1. Eğitim çıkış ayarını kontrol et — hâlâ istediğin gibi mi?
2. Bellek/saklanan gerçekler görünümünü aç — eski ya da yanlış olanı sil.
3. Bağlı uygulama/hesapları listele — artık kullanmadığın her şeyi iptal et.
4. Sohbet geçmişinde yapıştırılmış sır ara (şifre, anahtar, hesap numarası)
   ve o konuşmaları sil.
5. Yeni bir özellik yayınlandıysa (tarama geçmişi, computer history, ajan
   eylemleri) — dokunmadan önce varsayılan durumunu kontrol et. Ne kaydettiğini
   okuyana kadar varsayılan olarak kapalı özellikleri kapalı bırakmak daha güvenli.
```

Bunu üç ayda bir çalıştırmak, asistan başına yaklaşık on dakika alır ve sağlayıcıların kendi varsayılanlarıyla yeni özellik yayınladıkça doğal olarak oluşan ayar kaymasını yakalar. Bu asistanların en yeni yeteneklerinin motor kaputunun altında nasıl çalıştığı hakkında daha fazlası için [Claude'un browser use aracı](/tr/posts/claude-browser-use-araci-nedir) yazımıza ya da daha fazla içerik için [teknoloji kategorimize](/tr/category/teknoloji) bakabilirsin.

## Sıkça Sorulan Sorular

### ChatGPT Memory'yi kapatmak sohbetlerimin eğitimde kullanılmasını da durdurur mu?

Hayır. Memory ile eğitim çıkışı (Ayarlar → Veri Kontrolleri → "Herkes için modeli geliştir") ayrı ayarlardır. İkisinin de aktif olmamasını istiyorsan ikisini de bağımsız olarak kapatman gerekir.

### Claude konuşmalarımı eğitimde kullanabiliyor mu?

Tüketici hesapları için evet, sen çıkış yapmadıysan — Anthropic'in 2025'teki politika değişikliği, tüketici kullanıcıların sohbetleri eğitimde kullanılabilir hale gelmeden önce çıkış yapması için 28 Eylül 2025 son tarihini belirledi. Claude for Work, Enterprise, API, Bedrock ve Vertex AI kullanımı hiçbir zaman eğitimde kullanılmıyor, çıkış gerekmiyor.

### ChatGPT'nin Computer History özelliği nedir, açmalı mıyım?

13 Ağustos 2026'da yayınlanan, sadece macOS masaüstünde bulunan, uygulama ve web sitesi etkinliğini ChatGPT'nin referans alması için özetleyen bir özellik — varsayılan olarak kapalı ve önce Memory'nin etkin olmasını gerektiriyor. Yeterince yeni olduğu için bağımsız güvenlik incelemeleri hâlâ sınırlı; özellikle aynı makinede hassas iş yapıyorsan, açmadan önce bildirilen gizlilik endişelerini okumaya değer.

### Gemini'nin sohbetlerimi eğitimde kullanmasını nasıl durdururum?

myactivity.google.com/product/gemini adresine git ve "Etkinliği Sakla"yı kapat. Bu, gelecekteki konuşmaları insan incelemesinden ve eğitimden hariç tutuyor; yine de bazı teknik meta veriler hesap kimliğinden ayrı olarak kaydedilmeye devam edebilir.
