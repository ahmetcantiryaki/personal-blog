---
title: "Daha İyi Mühendislik Tahminleri Yapma"
slug: "daha-iyi-muhendislik-tahminleri"
translationKey: "engineering-estimates"
locale: "tr"
excerpt: "Üç günlük iş neden üç haftaya çıkar? Tahminlerin nerede yanıldığını, aralık vermeyi ve geçmiş verilerle kalibrasyonu örneklerle anlatıyoruz."
category: "career-productivity"
tags: ["career", "productivity", "best-practices", "communication"]
publishedAt: "2026-07-18"
seoTitle: "Daha İyi Mühendislik Tahminleri Nasıl Yapılır"
seoDescription: "Üç günlük iş neden üç haftaya çıkar? Tahminlerin nerede yanıldığını, aralık vermeyi ve geçmiş verilerle kalibrasyonu örneklerle anlatıyoruz."
---

Tek sayılık bir mühendislik tahmini daha isabetli değildir; sadece birinin panikle yuvarlayıp aralık kısmını söylemeyi unuttuğu bir aralıktır. Daha iyi tahmin için tek numaradan vazgeçip aralık vermeyi, işi küçük ve "sıkıcı" parçalara bölmeyi ve geçmiş tahmin-gerçekleşen verinizi düzenli takip etmeyi öğrenmeniz gerekiyor.

Bunu bir hikâyeyle açayım çünkü soyut anlatıldığında herkes zaten "biliyorum" diyor ama takvime yansımıyor. Bir sprint planlamasında "entegrasyon endpoint'i ekle, üç gün" dedim. Sıkıcı bir iş gibi görünüyordu: mevcut bir pattern'i kopyala, alanları eşle, testleri yaz. Üç hafta sonra hâlâ bitmemişti. Aradaki fark tek bir cümlede saklıydı: "üçüncü taraf API'nin rate limit'i ne kadar," diye kimse sormamıştı. Sormadığımız sorular, tahminin içine hiç girmemiş varsayımlar olarak kaldı ve iş büyüdükçe hepsi birer birer patladı.

## Tahminler Neden Yanılır

Kötü tahminlerin çoğu kötü niyetten değil, dört tekrarlayan alışkanlıktan geliyor. Birincisi, söylenmemiş varsayımlar: "test verisi hazır olacak," "tasarım onaylanmış olacak" gibi cümleler kimsenin ağzından çıkmadan tahmine dahil ediliyor. İkincisi, göz ardı edilen bilinmeyenler — "muhtemelen sorun çıkmaz" dediğimiz o entegrasyon, o legacy modül, o üçüncü taraf servis. Üçüncüsü optimizm yanlılığı: insan beyni, işi yaparken karşılaşacağı engelleri değil, işi bitirdiği anı hayal ediyor. Dördüncüsü ise sadece mutlu senaryonun boyutlandırılması — hata yönetimi, geriye dönük uyumluluk, code review turları, deploy sonrası izleme hiç hesaba katılmıyor.

Steve McConnell, *Software Estimation: Demystifying the Black Art* kitabında bunun rastgele bir hata olmadığını, sistematik bir önyargı olduğunu yazar; yani "daha dikkatli ol" demekle düzelmez, yöntem değiştirmek gerekir ([Microsoft Press'teki özet](https://www.microsoftpressstore.com/articles/article.aspx?p=2191414&seqNum=3)). Bu satırları Temmuz 2026'da yazarken bile ekiplerin büyük kısmı hâlâ "gut feeling" ile tarih söylüyor ve sonra o tarihi bir söz haline getiriyor — oysa ilk günden itibaren bir aralık vermiş olsalardı, aynı bilgiyle çok daha savunulabilir bir konumda olurlardı.

## Göreli Boyutlandırma, Ham Saat Değil

"Bu iş 14 saat sürer" cümlesi kulağa kesin geliyor ama aslında hiçbir olasılık bilgisi taşımıyor. Göreli boyutlandırma — bu işi daha önce yaptığımız şu işle kıyaslıyoruz, o kadar sürdüyse bu da benzer sürer mantığı — ham saat tahmininden daha güvenilir çünkü insan beyni mutlak süreleri değil, kıyaslamaları daha iyi değerlendiriyor. "Geçen sprint'teki kullanıcı profili endpoint'i kadar" demek, "6 saat" demekten daha az yanıltıcı çünkü referans noktası somut ve tartışılabilir.

Bunun pratik faydası şurada: göreli boyutlandırma yaptığınızda ekip otomatik olarak "bu iş gerçekten o işe benziyor mu, yoksa görünüşte benziyor da altında farklı bir karmaşıklık mı var" tartışmasına giriyor. O tartışma, tahmin toplantısının en değerli beş dakikası oluyor.

## Aralık Ver, Tek Sayı Verme

Tek sayı, kesinlik değil sadece kesinlik illüzyonu üretir. McConnell'ın önerisi net: düşük-yüksek aralığıyla tahmin verin, çünkü bu hem doğruluğu artırır hem de tahminin bir söze dönüşmesini engelleyen bir siyasi tampon görevi görür ([kitabın O'Reilly sayfası](https://www.oreilly.com/library/view/software-estimation-demystifying/0735605351/)). "3-5 gün" demek "4 gün" demekten daha az kesin görünüyor olabilir ama gerçeği daha doğru yansıtıyor — ve biri sizden "peki net gün hangisi" diye sorduğunda, aralığın üst ucunu ciddiye almasını istemek sizin elinizde.

| Yaklaşım | Doğruluk | Verme Maliyeti | Siyasi Risk |
|---|---|---|---|
| Tek sayı ("4 gün") | Düşük — belirsizliği gizler | Çok düşük, hızlı söylenir | Yüksek — anında söze dönüşür |
| Aralık ("3-6 gün") | Orta — belirsizliği gösterir | Düşük, biraz düşünme gerekir | Orta — hâlâ pazarlık konusu olabilir |
| Ayrıştırılmış aralık (alt görevler + toplam aralık) | Yüksek — her parça ayrı doğrulanabilir | Yüksek, gerçek analiz gerekir | Düşük — aralığın gerekçesi elinizde |

Bu tablonun asıl mesajı şu: doğruluk ile efor ters orantılı değil, sadece daha fazla efor daha savunulabilir bir sayı üretiyor. Kritik bir teslim tarihi söz konusuysa üçüncü satıra yatırım yapmaya değer.

## İşi Sıkıcı Hale Gelene Kadar Böl

"Sıkıcı" derken kastım şu: bir alt görev o kadar küçük ve somut olmalı ki, içinde yanlış gidebilecek fazla bir şey kalmasın. "Ödeme entegrasyonu" sıkıcı değil, içinde on tane sürpriz barındırıyor olabilir. Ama "webhook imza doğrulamasını ekle," "başarısız ödeme için retry mantığını yaz," "sandbox ortamında üç test senaryosunu geç" — bunlar sıkıcı, çünkü her biri tek başına net ve tahmin edilebilir.

Construx'ın "belirsizlik konisi" (cone of uncertainty) kavramı da tam bunu anlatıyor: bir işi tanımladıkça, yani ayrıştırdıkça, belirsizlik daralıyor; koni ancak siz kararlar aldıkça ve iş küçüldükçe daralıyor, sadece zaman geçtikçe değil ([Construx'ın konu anlatımı](https://www.construx.com/resources/software-developments-cone-of-uncertainty/)). Bu da şu anlama geliyor: kickoff toplantısında verdiğiniz tahmin, iki hafta sonra elinizdeki bilgiyle güncellenmeli — sabit bir taş tablet değil. RFC yazarken kapsamı netleştirmek bu ayrıştırmanın ilk adımı oluyor; konuyu genişçe ele alan bir yazımız var: [mühendislik RFC'si nasıl yazılır](/tr/posts/muhendislik-rfc-nasil-yazilir).

## Geçmiş Veriyle Kalibrasyon

Bir ekip lideri arkadaşım bana şunu söylemişti: "Biz her seferinde iyimserlik payını hesaba kattığımızı sanıyorduk, ama hiç ölçmemiştik ne kadar iyimser olduğumuzu." Tahmin-gerçekleşen farkını sprint sprint kaydetmeye başladıklarında ortaya çıkan şey şuydu: backend işlerini ortalama %20 az, entegrasyon işlerini ise neredeyse iki kat az tahmin ediyorlarmış. Bu veri, "daha dikkatli tahmin edin" demekten çok daha etkili oldu çünkü artık somut bir düzeltme katsayıları vardı.

Bu, McConnell'ın "kalibrasyon" dediği tekniğin özü: kendi ekibinizin geçmiş verisiyle tahmin yapmak, sektör ortalamasıyla ya da "bana öyle geliyor" hissiyle yapmaktan çok daha az öznel. Takip etmeyen ekipler aynı iyimserlik hatasını sprint sprint tekrarlıyor; takip edenler zamanla gerçekten kalibre oluyor. Bu disiplin, kod incelemesi disipliniyle aynı aileden — ikisi de "bir kerelik iyi niyetle" değil, tekrarlanan geri bildirim döngüsüyle iyileşiyor; bkz. [etkili kod incelemesi nasıl yapılır](/tr/posts/etkili-kod-incelemesi).

Kalibrasyonun bir yan faydası da var: sürekli yanlış tahmin eden, sonra o tahminin arkasında durmaya çalışan ekipler tükenmişliğe daha hızlı sürükleniyor. Takvime her seferinde yetişmeye çalışmak, kronik bir stres kaynağı; bu konuyu ayrıca ele aldığımız bir yazımız var: [yazılımcı olarak tükenmişlik nasıl önlenir](/tr/posts/yazilimci-tukenmisligi).

## Tahmin Kontrol Listesi

Bir sonraki tahmin toplantısına girmeden önce şunları sorun: İş, üzerinde konuşmadan varsayılan bir şey içeriyor mu? Mutlu senaryo dışında hata yönetimi, test, review, deploy hesaba katıldı mı? Tek sayı yerine aralık verebilir miyim? Aralığı daraltmak için işi daha mı bölmem lazım? Bu işe benzer bir şeyi daha önce yaptık mı, o ne kadar sürmüştü? Bu tahmini üç hafta sonra güncellemek için bir hatırlatıcı koydum mu?

Biri sizden baskı altında "hadi tek bir sayı söyle" isterse, işte birkaç cümle: "Tek sayı verebilirim ama o zaman aralığı ben değil siz seçmiş olursunuz — ben 3 ila 6 diyeyim, siz hangi ucun sizin için kritik olduğunu söyleyin." Ya da: "Şu an elimizdeki bilgiyle en dürüst cevap bu aralık; iki gün içinde şu belirsizlikleri kapatırsam daha dar bir sayı verebilirim." Bu, teknik liderlik pozisyonlarında giderek daha çok işinize yarayan bir beceri; staff mühendislik rolüne geçişte tahmin ve kapsam tartışmalarını yönetmek büyük yer kaplıyor, detayları [staff engineer yolu](/tr/posts/staff-engineer-yolu) yazımızda bulabilirsiniz.

## Sıkça Sorulan Sorular

### Aralık vermek, "ben bilmiyorum" demek gibi görünmez mi?

Tam tersi — aralık, elinizdeki bilgiyi dürüstçe yansıtan bir sayı. "Bilmiyorum" demek farklıdır; aralık vermek "şu kadar biliyorum, şu kadarını bilmiyorum, ikisini birlikte söylüyorum" demektir. Yöneticiler genelde net aralığı, sahte kesinlikten daha güvenilir buluyor.

### Ekibimizin geçmiş tahmin verisi yoksa ne yapmalıyım?

Bugün başlayın. Her tamamlanan işin tahmini ile gerçek süresini yan yana bir tabloya yazın; iki-üç sprint sonra ilk kalibrasyon katsayılarınız ortaya çıkar. Mükemmel bir sistem beklemek, hiç başlamamaktan daha kötü.

### Agile'da story point kullanıyoruz, buradaki tavsiyeler geçerli mi?

Evet, story point zaten göreli boyutlandırmanın bir biçimi. Buradaki fark, point'leri saate çevirirken tek bir katsayı yerine aralık kullanmak ve velocity verinizi gerçek kalibrasyon amacıyla izlemek.

### Yönetim her zaman tek tarih istiyor, aralık kabul etmiyor ne yapmalıyım?

Aralığın üst ucunu taahhüt tarihi olarak sunun, alt ucunu "iyi giderse" notuyla belirtin. Bu, tek sayı vermiş gibi görünür ama gerçekte riski doğru tarafa yüklemiş olursunuz.
