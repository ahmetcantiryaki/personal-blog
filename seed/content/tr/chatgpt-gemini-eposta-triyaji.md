---
title: "ChatGPT ve Gemini ile Kalıcı E-posta Triyajı"
slug: "chatgpt-gemini-eposta-triyaji"
translationKey: "ai-inbox-triage-2026"
locale: "tr"
excerpt: "Kısa cevap: AI'a tek seferlik gelen kutumu temizle deme. Dört kovalı bir triyaj sistemi kur (yanıtla, beklet, devret, sil), her sabah aynı şekilde çalıştır."
category: "career-productivity"
tags: ["chatgpt", "gemini", "productivity", "automation", "workflow"]
publishedAt: "2026-10-08"
seoTitle: "ChatGPT ve Gemini ile Günlük E-posta Triyaj Sistemi"
seoDescription: "ChatGPT ve Gemini ile kalıcı e-posta triyajı: yanıtla/beklet/devret/sil taksonomisi, bağlayıcı kurulumu ve işe yarayan 10 dakikalık günlük rutin."
---

Kısa cevap: AI asistanına tek seferlik "gelen kutumu temizle" demeyi bırakın — ne ChatGPT ne Gemini gelen kutunuzu arka planda izliyor ve etkisi bir gün içinde kaybolur. Bunun yerine sabit bir triyaj taksonomisi kurun (yanıtla, beklet, devret, sil), ChatGPT veya Gemini'yi posta kutunuza bir kez bağlayın ve her sabah aynı kısa promptu çalıştırın. Kalıcı olan sistemdir, prompt değil.

## Tek seferlik "gelen kutumu temizle" promptu neden işe yaramıyor?

Çünkü ne ChatGPT ne de Gemini şu anda posta kutunuzu arka planda sürekli izleyen bir sistem olarak çalışmıyor — ikisi de sohbeti açıp istediğinizde triyaj yapıyor, sürekli arka planda değil. Tek seferlik temizlikler ayrıca araca gerçek karar kurallarınızı öğretmiyor, bu yüzden her oturum sıfırdan başlıyor: neyin acil, neyin bekleyebilir, neyin doğrudan bir ekip arkadaşına gideceğini her sabah yeniden açıklıyorsunuz.

Çözüm, triyajı bir temizlik görevi olarak görmeyi bırakıp sabit bir karar taksonomisine dayanan tekrarlanabilir bir rutin olarak görmek — her gün aynı dört kova, böylece AI'ın sıralama mantığı kaymaz ve her sabah yeniden eğitmeniz gerekmez.

## Gerçekten işe yarayan bir triyaj taksonomisi nasıl olmalı?

Dört kovalı bir sistem: yanıtla, beklet, devret, sil. Her kovanın tek satırlık bir kuralı var, böylece bir e-postayı sıralamak her seferinde yeniden tartışılan bir yargı değil, bir sınıflandırma problemi oluyor.

| Kova | Kural | Örnek |
|---|---|---|
| Yanıtla | Bugün senin kelimelerini gerektiriyor, 2 dakikadan kısa sürede cevaplanır | "Toplantı saatini onaylar mısın?" |
| Beklet | Senin kelimelerini gerektiriyor ama bugün değil — tarihli olarak ertele | Gelecek cuma teslim bir teklif incelemesi |
| Devret | Bu işi başka biri sahiplenmeli | Finans için bir fatura sorusu |
| Sil | Aksiyon gerekmiyor, arşivle veya aboneliği bitir | Bültenler, otomatik makbuzlar |

Bu taksonomiyi, aracın önceliklerinizi kendiliğinden çıkaracağını varsaymak yerine promptunuza açıkça yazın. "Okunmamış postalarımı şu kurallarla Yanıtla, Beklet, Devret veya Sil olarak sırala: [taksonomiyi yapıştır]" şeklindeki bir prompt, belirsiz bir özet yerine tutarlı, denetlenebilir bir çıktı verir.

## ChatGPT veya Gemini'yi gerçek posta kutunuza nasıl bağlarsınız?

ChatGPT'nin Gmail bağlayıcısı ücretli planlara dahil ve sohbet içinden postayı okumasına, aramasına ve — güncel sürümlerde — taslak yazıp göndermesine izin veriyor; gönderim öncesi onayınız gerekiyor. Bu arka planda çalışan bir triyaj botu değil: tetikleyicisi yok ve siz prompt vermediğiniz sürece yeni postaya kendiliğinden aksiyon almıyor. ChatGPT ayrıca posta kutusu bağlamını kullanarak arama, özetleme ve taslak yazma yapan, aynı onay-öncesi-gönderim modeliyle çalışan bağlı bir Outlook deneyimi sunuyor.

Gemini'nin karşılığı Google Workspace üzerinden çalışıyor: Gmail'in kendi "Yazmama yardım et" ve akıllı yanıt özellikleri aynı Gemini modelleriyle çalışıyor ve zaten Gmail arayüzünün içinde yaşıyor, bu yüzden Workspace kullanıcıları için triyaj promptunun kendisi ayrı bir sohbet penceresi değil, Gmail tarafında bir istek olarak çalışabiliyor.

Hangi aracı seçerseniz seçin, buna dayanarak bir iş akışı kurmadan önce bölgenizi kontrol edin: bu sürümde ChatGPT'nin bazı bağlayıcı özellikleri İngiltere, AB, İsviçre ve daha geniş EEA bölgesinde kısıtlı, bu yüzden AB merkezli kullanıcıların kendi hesaplarında erişilebilirliği önce doğrulaması gerekiyor.

## Yeniden kullanılabilir taslak-yanıt şablonları pratikte nasıl görünüyor?

Her seferinde istediğiniz yanıtı yeniden tarif etmek yerine isimle çağırabileceğiniz kısa, adlandırılmış şablonlardır. Örneğin:

```text
ŞABLON: toplanti-reddi
"Davet için teşekkürler — bu sefer katılamayacağım. Asenkron ilerleyebilir
miyiz, yoksa sonra izleyebileceğim bir kayıt olacak mı?"

ŞABLON: fatura-yonlendirme
"Yazdığın için teşekkürler. Fatura soruları finans@sirket.com'a gidiyor
— onları bilgilendirdim, yeniden anlatmana gerek yok."
```

Bunları çalışan bir "prompt kütüphanesi" notuna yapıştırın, sonra sıfırdan bir yanıt yazdırmak yerine asistandan "bu davete göre ayarlanmış toplanti-reddi şablonunu kullan" deyin. Bu, rutin yanıtlardaki düzenleme süresinin büyük kısmını kısaltır; çünkü ton ve yapı zaten sabit — her e-postada sadece iki üç ayrıntıyı değiştiriyorsunuz.

## On dakikalık günlük triyaj turu nasıl olmalı?

Her sabah aynı üç adımı, bu sırayla çalıştırın: okunmamış postayı dört kovaya sırala, "Yanıtla" etiketli her şey için taslak yaz, sonra "Sil" öğelerini tek seferde temizle (arşivle veya aboneliği bitir). Bunu diğer işler başlamadan önce sabit bir saatte yapmak, gelen kutunun önce "gelen kutumu temizle" kurtarma promptu gerektirecek bir yığına dönüşmesini engeller.

Burada araçtan daha önemli olan alışkanlık. Her gün yapılan on dakikalık bir tur, haftada bir yapılan kapsamlı bir saatlik temizlikten daha iyi sonuç verir; çünkü yığının karar yorgunluğuna dönüşecek zamanı olmaz.

Bu turu "fırsat buldukça" bir görev olarak değil, takviminizde tekrarlanan bir blok olarak koyun — triyaj isteğe bağlı hale geldiği an, yoğun bir günde ilk atlanan şey o olur ve iki günlük bir boşluk, sadece Yanıtla kovasının ikiye katlanması için yeterlidir. On dakikayı, bir dağıtım panosunu diğer işe başlamadan önce kontrol etmeyi ele aldığınız gibi, pazarlık edilemez bir sabah altyapısı olarak görün.

## AI'ın sıralamasını haftalar boyunca, sadece ilk günde değil, nasıl tutarlı tutarsınız?

Her sabah kurallarınızı hafızadan yeniden tarif etmek yerine aynı taksonomi promptunu kelimesi kelimesine yeniden kullanarak. Dört kovalı tanımları ve taslak-yanıt şablonlarınızı bir yerde saklayın — sabitlenmiş bir not, ChatGPT'de özel bir talimat veya Gemini'de kaydedilmiş bir prompt — ve bu tam bloğu her oturuma yapıştırın. Oturumlar arasındaki küçük kelime kaymaları (bir gün "acil", ertesi gün "bugün yanıt gerekiyor") bir asistanın sıralamasının zamanla tutarsız hissettirmesine tam olarak bu yol açar; asistan görevde kötüleşmiyor, talimatlarınız onun altında sessizce değişiyor.

Ayda bir, taksonomiyi gözden geçirmeye değer: hangi kategori sürekli yanlış sıralanıyor, hangi şablon artık güncel değil. Posta kutunuz değiştikçe (yeni bir müşteri segmenti, yeni bir dahili süreç) kurallarınız da değişmeli; aksi halde sistem, artık geçerli olmayan varsayımlar üzerine sessizce sıralama yapmaya devam eder.

## AI destekli triyaj nerede gizlilik duvarına çarpıyor?

Bir üçüncü taraf model sağlayıcısının sistemlerinin işlemesini istemeyeceğiniz her şeyde: avukat-müşteri gizliliği kapsamındaki hukuki yazışmalar, sağlık bilgileri, İK şikâyetleri veya bir gizlilik sözleşmesi kapsamındaki müşteri verisi. Hem ChatGPT'nin hem Gemini'nin posta bağlayıcıları işini yapmak için mesaj içeriğini okuyor; bu rutin posta için makul bir takas, hassas görüşmeler için kötü bir takas. Bu kategoriye giren her şey için sadece elle işlediğiniz bir klasör tutun ve varsayılan olarak hiçbir asistanın triyaj turundan geçirmeyin.

Triyaj halledildikten sonra aynı bağlayıcı kurulumu daha uzun iş akışlarına taşınır — tek bir gelen kutusu turunun ötesinde bağlamı düzenli tutmak için [ChatGPT'nin "hafıza doldu" sorununu çözme ve Projeleri kullanma](/tr/posts/chatgpt-hafiza-doldu-projeler-rehberi) rehberimize, triyaj edilmiş e-postayı uzun vadeli notlara dönüştürmek için [AI ile ikinci beyin kurmak](/tr/posts/ai-ile-ikinci-beyin-kurmak) yazımıza bakın. Toplu işleme ve erteleme mekaniğinin ayrıntıları için [AI ile Inbox Zero](/tr/posts/ai-ile-inbox-zero-e-posta-triyaji) yazımızı okuyun. Daha fazla üretkenlik sistemi için [kariyer ve üretkenlik kategorimize](/tr/category/kariyer-uretkenlik) göz atın.

## Sıkça Sorulan Sorular

### ChatGPT gelen kutumu her gün otomatik triyaj edebilir mi?

Hayır. Bu sürüm itibarıyla ChatGPT'nin Gmail ve Outlook bağlayıcıları sohbet içinde istek üzerine çalışıyor — tetikleyicileri yok ve siz prompt vermediğiniz sürece yeni postayı izlemiyor veya aksiyon almıyor. Triyaj turunu, tercihen sabit bir günlük zamanlamada, kendiniz çalıştırıyorsunuz.

### E-posta triyajında "beklet" ile "devret" arasındaki fark ne?

Beklet, yanıtı hâlâ siz yazacaksınız ama bugün değil anlamına gelir — belirli bir tarihle erteleyin. Devret, görevi tamamen başka birinin sahiplenmesi gerektiği anlamına gelir, bu yüzden e-posta zamanlanmak yerine yönlendirilir veya yeniden atanır.

### Gemini veya ChatGPT'yi iş e-posta hesabıma bağlamak güvenli mi?

Rutin yazışmalar için, bağlayıcının belirttiği koşullar dahilinde evet — ama avukat-müşteri gizliliği, sağlıkla ilgili veya gizlilik sözleşmesi kapsamındaki görüşmeleri her AI destekli triyaj turunun dışında tutun; çünkü model sağlayıcısının sistemleri yanıt üretmek için mesaj içeriğini işliyor.

### Bu triyaj sistemi Outlook'ta Gmail'deki gibi mi çalışıyor?

Dört kovalı taksonomi ve günlük tur alışkanlığı araçtan bağımsızdır, her ikisinde de aynı şekilde çalışır. Bağlayıcı mekaniği farklıdır: ChatGPT'nin Outlook bağlayıcısı, Gmail bağlayıcısıyla aynı onay-öncesi-gönderim modelini izleyerek posta kutusu bağlamını kullanarak arama, özetleme ve taslak yazma yapar.
