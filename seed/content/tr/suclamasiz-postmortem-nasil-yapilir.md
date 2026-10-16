---
title: "Suçlamasız Postmortem Nasıl Yapılır?"
slug: "suclamasiz-postmortem-nasil-yapilir"
translationKey: "blameless-postmortems-guide-2026"
locale: "tr"
excerpt: "İncelemeyi olaydan 24-72 saat içinde yap, kişiyi suçlamak yerine yakın nedeni ve katkıda bulunan faktörleri ayrı yaz, aksiyonlara sahip ve tarih ata."
category: "software-engineering"
tags: ["reliability", "sre", "best-practices", "documentation"]
publishedAt: "2026-10-16"
seoTitle: "Suçlamasız Postmortem Nasıl Yapılır?"
seoDescription: "İncelemeyi olaydan 24-72 saat içinde yap, kişiyi suçlamak yerine yakın nedeni ve katkıda bulunan faktörleri ayrı yaz, aksiyonlara sahip ve tarih ata."
---

Kısa cevap: incelemeyi olaydan sonra 24-72 saat içinde yap; yakın nedeni, katkıda bulunan faktörleri ve altta yatan koşulları ayrı ayrı yaz; her düzeltici aksiyona bir sahip ve bir bitiş tarihi ata; sonra bu aksiyonların gerçekten yapılıp yapılmadığını takip et. Bu dört adımdan birini atlarsan postmortem, kimsenin bir kez daha açmadığı bir belgeye dönüşür.

## Suçlamasız postmortem nedir?

Suçlamasız postmortem, "insan hatasını" soruşturmanın bitişi değil başlangıcı olarak gören, yapılandırılmış bir olay incelemesidir. Kesintiye kimin sebep olduğunu sormak yerine, makul ve yetkin bir kişinin bu kesintiye sebep olmasını mümkün kılan sistemik koşulların ne olduğunu sorar. Bu uygulama Google'ın SRE disiplinine ve dönemin Etsy CTO'su John Allspaw'ın bir arızaya en yakın olan kişilerin ne olduğu hakkında en değerli bilgiye sahip olduğunu savunduğu Etsy mühendislik kültürüne kadar uzanıyor — bu bilgi, kişiler suçlanmaktan korkarsa hızla yok oluyor.

Suçlamasız olmak, hesap verilebilirliğin olmaması demek değildir. Kişilerin prosedürleri takip etmesi, açık iletişim kurması ve iyi niyetle hareket etmesi hâlâ beklenir; postmortem sadece bu kadar maliyetli bir hatanın var olmayan veya işe yaramayan bir güvenlik önlemi tarafından yakalanması gerekirken "biri hata yaptı" noktasında durmayı reddeder.

## Tek bir "temel neden" belirleyen postmortem'ler neden gerçek sorunu kaçırıyor?

Tek bir temel neden belirlemek, neredeyse her zaman olanı fazla basitleştirir; çünkü gerçek olaylar tek bir kötü karar değil, küçük hataların zincirleridir. Bir production kesintisi nadiren "mühendis yanlış komutu çalıştırdı" ile açıklanır — buna daha yakın bir tanım "mühendis yanlış komutu çalıştırdı, staging ve production ortamları terminalde birbirine benziyordu, yıkıcı komutlar için onay adımı yoktu ve o hafta nöbetçi mühendis iki rotasyonu birden kapatıyordu" olur. "Temel neden insan hatasıydı" demek bir bulgu değil, bir belirtidir.

Çözüm, üç katmanı açıkça ayırmaktır:

- **Yakın neden**: olayı doğrudan tetikleyen şey (çalıştırılan komut, yayınlanan deploy).
- **Katkıda bulunan faktörler**: tetikleyiciyi daha olası veya daha ciddi yapan koşullar (eksik onay istemleri, belirsiz ortam etiketleme, çift nöbetten gelen yorgunluk).
- **Altta yatan koşullar**: bu olaydan çok önce var olan ve bir sonrakine de sebep olacak yapısal sorunlar (araçlarda hiçbir yerde staging/production görsel ayrımı olmaması, tespiti geciktiren uyarı yorgunluğu).

## İncelemeyi ne kadar hızlı yapmalısın ve odada kimler olmalı?

İncelemeyi, hafıza henüz tazeyken 24-72 saat içinde ve olaya dokunan herkesin — sadece olaya "sebep olan" kişinin değil — katılımıyla yap. Daha fazla beklemek, insanların olayları hafızadan değil loglardan yeniden kurmasına yol açar; bu da o anda neden bir kararın mantıklı göründüğüne dair dokuyu kaybettirir. Bu doku, katkıda bulunan faktörleri açığa çıkaran tam olarak şeydir; tek başına bir Slack kaydı bunu nadiren yapar.

Bir tedarikçi rehberi beklemenin maliyetine bir rakam koyuyor: otomatik kayıt olmadan elle zaman çizelgesi yeniden kurmak, olay başına 60-90 dakikalık "arkeoloji" yutuyor — bu zaman katkıda bulunan faktörleri bulmaya ayrılması gereken zaman.

## Kullanılabilir bir postmortem belgesi gerçekte ne içerir?

İki kez okunan bir postmortem, şu sırayla beş bölüm içerir: şirketteki herkesin anlayabileceği sade dilde bir özet, zaman damgalı bir olay akışı, yukarıdaki gibi yakın/katkıda bulunan/altta yatan şeklinde ayrılmış neden analizi, bir etki değerlendirmesi (etkilenen kullanıcı, gelir, SLA ihlali, veri kaybı) ve her biri bir sahip ve bitiş tarihine bağlı — "izlemeyi geliştirmeliyiz" gibi belirsiz olmayan — düzeltici aksiyonlar listesi.

| Bölüm | Neyi cevaplar | Yaygın hata |
|---|---|---|
| Özet | Ne oldu, bir paragrafta | Mühendis olmayanların anlayamayacağı kadar teknik |
| Zaman çizelgesi | Her olay ne zaman gerçekleşti | Tespit-çözüm arasındaki boşluğun eksik olması |
| Neden analizi | Neden oldu, üç seviyede | Her şeyi tek bir "temel nedene" sıkıştırmak |
| Etki | Kim ve ne, ne kadar etkilendi | Yakın ıskalamaların ve kısmi bozulmanın atlanması |
| Aksiyon maddeleri | Ne değişiyor, kim sahip, ne zamana kadar | Sahibi yok, tarihi yok, aksiyon maddesi bayatlıyor |

## Belge yazıldıktan sonra ne oluyor?

Aksiyon maddeleri sadece bir onay kutusu değil, ikinci bir toplantı gerektirir. Düzeltici aksiyonların gerçekten uygulanıp uygulanmadığını ve işe yarayıp yaramadığını kontrol etmek için haftalar sonra bir takip incelemesi planla — kabul edilip hiç uygulanmamış bir aksiyon maddesi, gerçekleşmeyi bekleyen ikinci bir olaydır ve bu adımı atlayan ekipler aynı hata örüntüsünü bir yıl içinde tekrar görme eğilimindedir.

```text
Postmortem kontrol listesi
[ ] İnceleme, olaydan 24-72 saat içinde planlandı
[ ] Olaya dahil olan herkes katıldı, sadece "kusurlu" kişi değil
[ ] Yakın neden, katkıda bulunan faktörler, altta yatan koşullar ayrı ayrı listelendi
[ ] Etki ölçüldü (kullanıcı, gelir, SLA, veri)
[ ] Her aksiyon maddesinin sahibi ve bitiş tarihi var
[ ] Aksiyon maddelerinin uygulandığını doğrulamak için takip incelemesi planlandı
```

## Suçlamasız bir süreç mühendis davranışını gerçekten değiştiriyor mu?

Neyin raporlandığını değiştiriyor, bu da neyin düzeltildiğini değiştiriyor. Mühendisler suçlanmayı bekliyorsa, yakın ıskalamaları ve küçük olayları az raporlarlar — bu da büyük bir kesintiye dönüşmeden önce altta yatan bir koşulu ortaya çıkaracak tam olarak sinyaldir. Tutarlı şekilde uygulanan (sadece bir kez duyurulan değil) gerçekten suçlamasız bir süreç, dürüst olay raporlarının hacmini artırır — bu, güvenilirliğe önem veren bir ekibin, daha fazla postmortem yapmak anlamına gelse de, isteyeceği bir takastır.

## Sıkça Sorulan Sorular

### Bir postmortem'i "suçlamasız" yapan nedir?

Suçlamasız postmortem, bir kişinin hatasını soruşturmanın sonucu değil başlangıcı olarak görür; incelemeyi "hata yaptılar" noktasında bitirmek yerine, makul bir kişinin olaya sebep olmasına izin veren sistemik koşullara — eksik güvenlik önlemlerine, belirsiz araçlara, süreç boşluklarına — odaklanır.

### Bir olaydan sonra postmortem incelemesini ne kadar çabuk yapmalısın?

İncelemeyi 24-72 saat içinde yap; o sırada olaya dahil olan kişiler sadece loglardaki olay sırasını değil, kendi akıl yürütmelerini ve bağlamı hâlâ hatırlıyor olsun. Daha fazla beklemek, genelde gerçek katkıda bulunan faktörleri ortaya çıkaran "o an neden mantıklı göründü" ayrıntısını kaybettirir.

### Temel neden ile katkıda bulunan faktör arasındaki fark nedir?

Yakın neden, olayın doğrudan tetikleyicisidir (bir komut, bir deploy, bir yapılandırma değişikliği). Katkıda bulunan faktörler, bu tetikleyiciyi daha olası veya daha ciddi yapan koşullardır (yorgunluk, belirsiz ortamlar, eksik onay adımları). Altta yatan koşullar, bu olaydan önce var olan ve düzeltilmezse bir sonrakine de sebep olacak yapısal sorunlardır.

### Suçlamasız postmortem'ler kimsenin hesap vermemesi anlamına mı geliyor?

Hayır. Suçlamasız olmak, hesap verilebilirliğin olmaması demek değildir — kişilerin prosedürleri takip etmesi, dürüst iletişim kurması ve iyi niyetle hareket etmesi hâlâ beklenir. Bu uygulama, bilinen güvenlik önlemlerine uyma sorumluluğunu değil, soruşturmanın hedefi olarak suçlamayı ortadan kaldırır.

### Postmortem'i kim yazmalı, nöbetçi mühendis mi yoksa ekip lideri mi?

Belgeyi genelde olaya en yakın olan kişi — çoğunlukla nöbetçi mühendis — yazar, ama bunu tek başına yapmamalı. Diğer katılımcıların zaman çizelgesini ve neden analizini gözden geçirip düzeltmesi gerekir; aksi hâlde belge, tek bir kişinin olayı nasıl hatırladığını yansıtır, odadaki herkesin ortak anlayışını değil. Ekip lideri genelde aksiyon maddelerinin sahiplendirilmesini ve takibini üstlenir, ama olayın anlatımını yazmak zorunda değildir.

Güvenilirlik konusunda ilgili içerikler: [küçük ekipler için chaos engineering](/tr/posts/kucuk-ekipler-icin-chaos-engineering), [kesintisiz deployment nasıl yapılır](/tr/posts/kesintisiz-deployment) ve [AI ajanları nöbeti devralabilir mi](/tr/posts/ai-ajanlari-nobeti-devralabilir-mi). Daha fazlası için [Yazılım Mühendisliği kategorisine](/tr/category/yazilim-muhendisligi) göz atabilirsin.

Kaynaklar: [incident.io'nun SRE olay postmortem en iyi uygulamaları rehberi](https://incident.io/blog/sre-incident-postmortem-best-practices), [UptimeRobot'un postmortem şablon rehberi](https://uptimerobot.com/knowledge-hub/monitoring/ultimate-post-mortem-templates/) ve [Sentivel'in postmortem nasıl yazılır rehberi](https://www.sentivel.com/guides/how-to-write-a-postmortem).
