---
title: "Küçük Ekipler İçin Chaos Engineering"
slug: "kucuk-ekipler-icin-chaos-engineering"
translationKey: "chaos-engineering-small-teams"
locale: "tr"
excerpt: "Kısa cevap: küçük ekip chaos engineering'e özel araç almadan başlayabilir. Staging'de tek bir container'ı öldürerek veya %1 trafiğe gecikme ekleyerek başla."
category: "devops-cloud"
tags: ["devops", "sre", "reliability", "monitoring"]
publishedAt: "2026-08-30"
seoTitle: "Küçük Ekipler İçin Chaos Engineering Rehberi"
seoDescription: "Kısa cevap: küçük ekip chaos engineering'e özel araç almadan başlayabilir. Staging'de tek bir container'ı öldürerek veya %1 trafiğe gecikme ekleyerek başla."
---

Kısa cevap: 3-5 kişilik bir mühendislik ekibi bile chaos engineering'e Litmus veya AWS FIS gibi araçlar kurmadan başlayabilir. Staging ortamında tek bir container'ı öldürüp sistemin kendini toparlayıp toparlamadığını izlemek, ilk deneyin tamamı olabilir. Amaç kaos yaratmak değil, üretimde bir kullanıcı fark etmeden önce zayıf noktayı bulmak.

## Chaos engineering nedir?

Chaos engineering, bir sistemin beklenmedik arızalar karşısında nasıl davrandığını öğrenmek için kontrollü şekilde hata enjekte etme pratiği. Temel döngü üç adımdan oluşuyor: sistemin normalde nasıl davrandığına dair bir hipotez kur, küçük bir "blast radius" (etki alanı) içinde bu hipotezi test edecek bir hata enjekte et, sonucu gözlemle ve öğren.

Bu, üretimde rastgele şeyleri kırmak değil. Tam tersine, her deneyin net bir hipotezi ve net bir geri dönüş planı olması gerekiyor. "Ödeme servisi çökerse, sepet servisi zarif bir şekilde hata mesajı gösterir" gibi bir hipotezle başlayıp, bunu küçük bir ortamda doğrulamak, üretimde canlı bir kesintiyle öğrenmekten çok daha ucuz.

## Blast radius nedir ve neden en önemli kavram bu?

Blast radius, bir deneyin yanlış gitmesi durumunda oluşabilecek maksimum kullanıcı etkisi. Blast radius'u küçük tutmak sadece bir güvenlik önlemi değil — chaos engineering'i ürün, hukuk ve müşteri ilişkileri ekipleri için kabul edilebilir kılan asıl şey bu.

Küçük bir ekip için pratik kural: sistemin hakkında bir şey öğretecek en küçük blast radius'tan başla. Bu genelde tek bir container'ı kırmak, tek bir instance'ı yavaşlatmak veya tek bir isteğe hata enjekte etmek anlamına geliyor. Servis kapsamında önce kullanıcıya doğrudan etkisi olmayan iç servislerden başla, sonra platform servislerine, en son kullanıcıya bakan servislere geç. Trafik kapsamında ise %1'lik bir dilimle başlamak, tüm trafiği etkilemekten çok daha güvenli.

## Özel araç olmadan nasıl başlanır?

Fanhcy bir platform kurmadan yapılabilecek üç deney türü var: bir pod veya container'ı öldürmek (Kubernetes'te `kubectl delete pod` kadar basit olabilir), ağ trafiğine yapay gecikme eklemek (Linux `tc` komutuyla veya bir sidecar proxy ile), ve bir bağımlılığı geçici olarak devre dışı bırakmak (staging'de bir API anahtarını geçersiz kılmak gibi).

Bu üç deney de mevcut altyapınla, ekstra araç kurmadan yapılabiliyor. Asıl disiplin araçta değil, süreçte: her deney öncesi bir hipotez yaz, "steady-state" metriklerini (hata oranı, gecikme, başarılı istek yüzdesi) deneyden önce ve sonra karşılaştır, ve deneyi durdurmak için önceden tanımlı bir "abort" koşulu belirle.

Aşağıdaki iki komut, hiçbir ek araç kurmadan yapabileceğin ilk deneylere örnek:

```bash
# Deney 1: Kubernetes'te tek bir pod'u öldür, sistemin kendini toparlamasını izle
kubectl delete pod my-service-7d9f8c6b8-x2k4p --namespace=staging

# Deney 2: Bir servise 200ms yapay gecikme ekle (tc + netem)
tc qdisc add dev eth0 root netem delay 200ms
```

Her iki komutu da çalıştırmadan önce steady-state metriklerini (hata oranı, p95 gecikme) kaydet, deneyi çalıştır, aynı metrikleri tekrar ölç ve aradaki farkı yorumla. `tc qdisc del dev eth0 root netem` komutuyla gecikmeyi geri almayı unutma — bu, "abort koşulu" dediğimiz geri dönüş planının en basit hali.

## GameDay nedir, ne zaman düzenlenmeli?

GameDay, planlı ve daha büyük ölçekli bir chaos deneyi — genelde bir öğleden sonra süren, belirli bir senaryoya odaklanan ve tüm ekibin katıldığı bir egzersiz. Küçük ölçekli günlük deneylerin aksine, GameDay'in amacı sadece sistemin değil, ekibin de nasıl tepki verdiğini ölçmek: kim ilk fark ediyor, hangi runbook kullanılıyor, alarm ne kadar sürede tetikleniyor.

Bir ekip için makul bir ritim, ayda bir GameDay ve haftalık olarak küçük, tek deneylik "günlük chaos" seansları. GameDay'i ilk kez düzenliyorsan, senaryoyu önceden ekip dışına açıklama, ama "bu bir tatbikat" bilgisini kesinlikle paylaş — gerçek bir kesinti sanıp gereksiz eskalasyon yapılmasını önlemek için.

## Ne zaman özel araçlara geçilmeli?

Manuel deneyler (kubectl, tc, feature flag ile bağımlılık kapatma) belirli bir noktadan sonra tekrarlanabilirlik ve zamanlama açısından sınırlı kalıyor. Ekibin deney sayısı arttıkça veya deneyi düzenli olarak (ör. her sprint'te otomatik) tekrarlamak istediğinde Litmus, chaos-mesh veya AWS Fault Injection Service (FIS) gibi araçlar devreye giriyor.

Bu araçların ortak faydası, deneyleri kod olarak tanımlamak (deney bir YAML dosyası veya API çağrısı oluyor), zamanlamak ve sonuçları merkezi bir raporda toplamak. Ama küçük bir ekip için bu araçları kurmak, ilk birkaç ay manuel deneylerle harcanan zamandan daha pahalıya gelebilir — önce süreci öğrenip sonra araca yatırım yapmak daha az riskli.

Aşağıdaki tablo, bir küçük ekibin blast radius'u nasıl kademeli büyütebileceğini özetliyor:

| Aşama | Servis kapsamı | Instance kapsamı | Trafik kapsamı | Örnek deney |
|---|---|---|---|---|
| 1 | İç servis (kullanıcıya etkisi yok) | 1/N replika | %0 (sadece staging) | Tek container'ı öldür |
| 2 | Platform servisi | 1/N replika | %1 canlı trafik | Bir bağımlılığa 200ms gecikme ekle |
| 3 | Kullanıcıya bakan servis | Birden fazla replika | %5-10 canlı trafik | Bir downstream API'yi geçici kapat |
| 4 | Kritik yol (ödeme, kimlik doğrulama) | Bölge/AZ seviyesi | Kontrollü, GameDay kapsamında | Bölgesel kesinti simülasyonu |

## Bulgular runbook ve alarmlara nasıl bağlanır?

Bir deneyin en değerli çıktısı, bulduğun boşluğu kalıcı hale getirmek. Alarm geç tetiklendiyse eşik değerini düşür; runbook eksikse veya yanlışsa güncelle; bir servisin zarif düşüş (graceful degradation) davranışı yoksa bunu bir sonraki sprint'e backlog maddesi olarak ekle. Deney yapıp sonucu bir Slack mesajında bırakmak, bir sonraki kesintide aynı şeyi tekrar keşfetmek anlamına geliyor.

Bu bağlantı, [küçük ekipler için olay müdahalesi yazımızda](/tr/posts/kucuk-ekipler-icin-olay-mudahalesi) anlattığımız runbook disiplinini tamamlıyor: chaos engineering runbook'ları test ederken, olay müdahalesi onları gerçek kesintide kullanıyor. Deney sonuçlarını bir tabloya (tarih, hipotez, sonuç, açılan takip işi) kaydetmek, üç ay sonra "bu testi zaten yapmış mıydık?" sorusuna hızlı cevap vermeni sağlıyor. Veritabanı tarafında benzer bir dayanıklılık testi istiyorsan [veritabanı yedekleme ve felaket kurtarma yazımıza](/tr/posts/veritabani-yedekleme-ve-felaket-kurtarma), dağıtım stratejisi tarafında ise [blue-green mi canary mi karşılaştırmamıza](/tr/posts/blue-green-mi-canary-mi) bakabilirsin.

## Sıkça Sorulan Sorular

### Chaos engineering'e başlamak için özel bir araç şart mı?

Hayır. `kubectl delete pod` ile bir container öldürmek, Linux `tc` komutuyla ağa gecikme eklemek veya staging'de bir API anahtarını geçersiz kılmak, hiçbir ek araç gerektirmeden yapılabilecek ilk deneyler. Litmus, chaos-mesh veya AWS FIS gibi araçlar, deney sayısı ve tekrarlanabilirlik ihtiyacı arttığında anlam kazanıyor.

### Blast radius'u nasıl küçük tutarım?

Önce kullanıcıya doğrudan etkisi olmayan iç servislerden başla, tek bir replikayı hedefle ve trafiğin sadece %1'ini etkile. Sistem hakkında bir şey öğrenmen için gereken en küçük kapsamdan başlayıp, güven arttıkça kapsamı kademeli büyütmek, doğrudan kritik yola veya tüm trafiğe deney yapmaktan çok daha güvenli.

### GameDay ile günlük chaos deneyi arasındaki fark nedir?

Günlük chaos deneyi küçük, tek bir hipotezi test eden ve genelde bir mühendisin yürüttüğü bir egzersizken; GameDay bir öğleden sonra süren, önceden planlanmış, belirli bir senaryoya odaklanan ve tüm ekibin katıldığı daha büyük bir tatbikat. GameDay ayrıca sistemin değil, ekibin tepki hızının da ölçüldüğü bir egzersiz.

### Chaos engineering'i üretimde mi yoksa staging'de mi yapmalıyım?

İlk deneylere staging'de başlamak en güvenli yol, çünkü hipotezini doğrularken gerçek kullanıcıya risk taşımıyorsun. Süreç olgunlaştıkça ve abort koşulların netleştikçe, küçük bir trafik yüzdesiyle (%1 gibi) üretimde kontrollü deneylere geçmek, staging'in yakalayamadığı gerçek dünya koşullarını test etmeni sağlıyor.
