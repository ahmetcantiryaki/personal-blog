---
title: "Kullanıma Dayalı Fiyata Sancısız Geçiş"
slug: "kullanima-dayali-fiyata-sancisiz-gecis"
translationKey: "usage-based-pricing-migration-2026"
locale: "tr"
excerpt: "Kısa cevap: koltuk ücretini kaldırıp platform ücreti + ölçülen kullanım hibrit modeline geçin, mevcut müşterileri en az 2 fatura dönemi kademeli olarak taşıyın."
category: "business"
tags: ["saas", "fundraising", "ai-infrastructure", "finops"]
publishedAt: "2026-09-13"
seoTitle: "Kullanıma Dayalı Fiyata Sancısız Geçiş"
seoDescription: "Koltuk bazlı SaaS fiyatından hibrit kullanıma dayalı modele geçerken müşteri kaybetmeden ilerlemenin yolu: değer metriği, üst limitler ve kademeli iletişim."
---

Kısa cevap: koltuk başına ücretten hibrit modele geçin — sabit bir platform ücreti artı ölçülen kullanım — ve mevcut müşterileri tek faturada değil, en az iki fatura döneminde kademeli olarak taşıyın. 2026'da SaaS şirketlerinin %38'i saf kullanıma dayalı fiyatlandırma kullanıyor (2023'te %27'ydi) ve hibrit modeller %59-61 benimsenme oranına doğru ilerliyor; saf koltuk anlaşmaları pazarın yalnızca %8'ine düştü.

## AI ürünleri koltuk fiyatını neden kırıyor?

Koltuk başına fiyat, maliyetin kullanıcı sayısıyla orantılı olduğu varsayımına dayanır. AI ürününde maliyet, kullanıcı değil token ve çıkarım (inference) çağrısı sayısıyla orantılıdır. Bir kullanıcı ayda 50 sorgu, bir başkası 5.000 sorgu gönderdiğinde ikisine de aynı koltuk ücretini kesmek ya ağır kullanıcıda zarar ettirir ya da hafif kullanıcıyı fazla ücretlendirip kaybettirir. Inference maliyeti önemsiz olmaktan çıktığı anda hibrit yöne kaymak kaçınılmaz hale geliyor.

## Hangi hibrit model işe yarıyor?

En yaygın kalıp, sabit bir platform ücreti (özellik erişimi, koltuk sayısı üst sınırı, destek seviyesi için) artı ölçülen bir kullanım katmanı (kredi, token veya işlem başına). 2026'da SaaS şirketlerinin %43'ü bu tarz hibrit fiyatlandırma kullanıyor ve yıl sonuna kadar %61'e çıkması bekleniyor. Saf tüketim modelleri ortalama %8 puan daha hızlı gelir büyümesi gösteriyor, ama saf tüketim faturayı öngörülemez kılar — kurumsal alıcı bunu satın almadan önce bütçe onayı istiyor. Hibrit, öngörülebilirlik ile değer hizalamasını aynı anda veriyor.

## Doğru değer metriğini nasıl seçersin?

Değer metriği, müşterinin ürününüzden aldığı faydayla orantılı artan sayıdır: işlenen token, tamamlanan görev, indekslenen belge, gönderilen mesaj. Kötü bir değer metriği koltuk sayısıdır çünkü AI ürününde ekip büyüklüğü kullanım yoğunluğuyla ilgisizdir. İyi bir test: metrik yükseldiğinde müşteri daha fazla değer mi alıyor, yoksa yalnızca daha çok mu ödüyor? Cevap "daha fazla değer" değilse, o metriği seçmeyin.

## Mevcut müşterileri nasıl kademeli taşırsın?

Tek faturada geçiş yapmayın. Sağlam bir sıra şöyle işler:

1. **Duyuru + gerekçe** (geçişten en az 30 gün önce): Neden değiştiğinizi ve müşterinin faturasının nasıl etkileneceğini açık sayılarla gösterin.
2. **Geçiş dönemi kilitleme (grandfathering)**: Mevcut müşterileri eski fiyattan en az 2 fatura döngüsü boyunca koruyun; ani şoku önler.
3. **Tahmini fatura simülasyonu**: Müşteriye geçmiş kullanım verisiyle "yeni modelde faturanız şu olurdu" gösterin — sürpriz, kaybedilen müşterinin bir numaralı nedeni.
4. **Kademeli devreye alma**: Yeni müşterilere yeni modeli hemen uygulayın, mevcutları kohort kohort taşıyın.

## Alıcılar hangi güvenceleri istiyor?

Kullanıma dayalı modele geçen şirketlerin karşılaştığı en büyük direnç, faturanın kontrolden çıkması korkusu. Buyer'ın 2026'da standart saydığı üç güvence var:

- **Harcama üst limiti (cap)**: Fatura, önceden belirlenen bir tavanı asla aşmaz; aşarsa hizmet durur ya da onay ister.
- **Uyarı eşikleri**: Kullanım %50, %80, %100'e ulaştığında otomatik bildirim.
- **Ön ödemeli kredi paketleri**: Kurumsal alıcı, öngörülemeyen faturaya karşı önceden satın aldığı kredi havuzunu tercih ediyor.

Bu üç güvenceyi sunmadan hibrit modele geçmek, kurumsal satışı büyük ölçüde yavaşlatıyor — bütçe onayı alan taraf, tavansız bir maliyeti imzalayamaz.

| Model | Öngörülebilirlik | Değer hizalaması | 2026 benimsenme |
|---|---|---|---|
| Saf koltuk | Yüksek | Düşük | %8 |
| Saf kullanım | Düşük | Yüksek | %38 |
| Hibrit (platform + ölçülü) | Orta-yüksek | Yüksek | %43 (yıl sonu ~%61 bekleniyor) |

## Faturalama altyapısını nasıl kurarsın?

Ölçüm (metering) altyapısı, gelir tanıma mantığından ayrı bir sistemdir ve genelde en az hafife alınan parça. Her API çağrısı, token veya işlem gerçek zamanlı sayılmalı; bu sayaç faturalama motoruna (Stripe Billing, Metronome, Orb gibi) akmalı; faturalama motoru da üst limitleri ve uyarı eşiklerini uygulamalı. Bu üç katmanı elle senkronize etmeye çalışmak, geçişin en sık kırılan yeri — sayım gecikirse müşteri kendi limitini aştığını geç öğrenir ve güven kaybı yaşarsınız.

## En sık yapılan hata ne?

En sık görülen hata, iletişimi teknik ekibe bırakmak. Fiyatlandırma değişikliği bir ürün duyurusu değil, bir sözleşme değişikliğidir; müşterinin satın alma ya da hukuk ekibi devreye girer. Değişikliği yalnızca bir e-postayla, geçmiş kullanım verisi olmadan duyurmak, müşterinin "bu bana ne kadara mal olacak" sorusunu kendi başına hesaplamasını gerektirir — ve çoğu müşteri bunu hesaplamak yerine iptal tuşuna basar. İkinci sık hata, üst limit (cap) olmadan lansmana çıkmak: bir müşterinin beklenmedik şekilde 10 kat fatura alması, tek bir olayla yıllarca süren güveni sıfırlayabilir.

## Geçişi nasıl iletişimle desteklersin?

Ürün ekibi fiyatı tasarlar ama geçişi satış ve müşteri başarı ekipleri taşır. En büyük hesaplarınıza (gelirinizin büyük kısmını oluşturan %10-20'lik dilime) bireysel görüşme ayırın; toplu e-posta yalnızca uzun kuyruk için yeterli. Büyük hesaplarla yapılan görüşmede, onların geçmiş 3-6 aylık kullanım verisini elinizde bulundurup "yeni modelde faturanız şöyle olurdu" diyebilmeniz, itirazların çoğunu daha konuşma başlamadan bitiriyor.

## Ne zaman geçiş yapmamalısın?

Kullanım verisi henüz güvenilir değilse (ölçüm altyapınız yeni kurulduysa ya da sık sık hatalı sayıyorsa) geçişi erteleyin. Yanlış ölçülen bir kullanım metriği üzerine fiyat kurmak, hem sizin gelir tahmininizi hem müşterinin bütçesini bozar. Ayrıca ürününüz hâlâ erken aşamadaysa ve değer metriğiniz (hangi eylemin gerçekten değer yarattığı) net değilse, önce metriği netleştirin, sonra fiyatlandırın — yanlış metrik üzerine kurulu bir fiyat modelini sonradan değiştirmek, ilk geçişten daha sancılı oluyor.

## Geçiş sonrası ilk 90 günde neyi izlemelisin?

Geçişten hemen sonraki ilk üç ay, sorunları büyümeden yakalama penceresi. En az üç metriği haftalık takip edin: iptal talebi sayısı (özellikle "fiyat" gerekçesiyle gelenler), destek talebi hacmindeki artış (fatura anlaşılmazlığının erken belirtisi) ve gerçekleşen faturanın tahmini faturadan sapma oranı. Sapma büyükse ölçüm altyapınızda bir hata olabilir; iptaller "fiyat" gerekçesinde yoğunlaşıyorsa değer metriğiniz müşterinin algıladığı değerle örtüşmüyor demektir — ikisi de fiyatı değil, altındaki varsayımı gözden geçirmenizi gerektirir.

## Aykırı görüş

"Fiyatı sık güncelleyen şirketler %25 daha hızlı büyüyor" verisi doğru ama yanlış anlaşılıyor. Bunun anlamı "her ay fiyat değiştirin" değil; büyüyen şirketlerin fiyatlandırmayı canlı bir ürün kararı olarak ele aldığı, donuk bir belge olarak değil. [AI'da tedarikçi bağımlılığı](/tr/posts/ai-tedarikci-bagimliligi-tek-model) yazımızda anlattığımız gibi, alt katmandaki model maliyetiniz zaten değişken — fiyatınızı sabit tutup marjınızı esnek bırakmak, marjınızı sabit tutup fiyatı esnek bırakmaktan daha risklidir. [SaaS'ı bootstrap ederken](/tr/posts/bootstrap-mi-vc-mi-2026-dogru-secim) nakit akışı hassasiyeti olan kurucular için bu, geçişi ertelememenin ekstra bir nedeni.

## Sıkça Sorulan Sorular

### Koltuk bazlı fiyattan kullanıma dayalıya nasıl geçilir?

Doğrudan geçiş yerine hibrit bir ara model kullanın: sabit platform ücreti artı ölçülen kullanım katmanı. Mevcut müşterileri en az 30 gün önceden bilgilendirin, eski fiyattan 2 fatura dönemi boyunca koruyun (grandfathering) ve geçmiş kullanım verisiyle tahmini yeni fatura gösterin.

### Hibrit fiyatlandırma modeli neden saf kullanıma dayalıdan daha popüler?

Saf tüketim modelleri ortalama %8 puan daha hızlı büyüse de faturayı öngörülemez kılıyor; kurumsal alıcılar bunu bütçelemekte zorlanıyor. Hibrit model (sabit ücret + ölçülü katman), öngörülebilirlik ile değer hizalamasını birlikte sağladığı için 2026'da SaaS şirketlerinin %43'ü tarafından kullanılıyor ve yıl sonunda %61'e çıkması bekleniyor.

### Kullanıma dayalı fiyatlandırmada alıcılar hangi güvenceleri talep ediyor?

Üç güvence artık standart: harcama üst limiti (cap), kullanım %50/%80/%100 eşiklerinde otomatik uyarı ve ön ödemeli kredi paketleri. Bu üçünü sunmadan geçiş yapan şirketler, bütçe onayı gereken kurumsal satışlarda ciddi yavaşlama yaşıyor.

### Doğru değer metriğini nasıl seçerim?

Değer metriği, müşterinin üründen aldığı faydayla birlikte artan bir sayı olmalı: işlenen token, tamamlanan görev, indekslenen belge gibi. Koltuk sayısı kötü bir metriktir çünkü AI ürününde ekip büyüklüğü kullanım yoğunluğuyla orantılı değildir.
