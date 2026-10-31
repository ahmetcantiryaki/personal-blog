---
title: "Gerçekten İşe Yarayan Yapılandırılmış Loglama"
slug: "gercekten-ise-yarayan-yapilandirilmis-loglama"
translationKey: "structured-logging-that-helps"
locale: "tr"
excerpt: "Kısa cevap: her log satırını JSON olarak, sabit alan adlarıyla ve trace_id ile yazın; sabah 3'te bir olayı aramak düz metin yerine tek sorguyla biter."
category: "software-engineering"
tags: ["observability", "monitoring", "sre", "best-practices"]
publishedAt: "2026-10-31"
seoTitle: "Yapılandırılmış Loglama Nasıl Yapılır? Pratik Rehber"
seoDescription: "Yapılandırılmış loglama nedir, hangi alanlar zorunlu, korelasyon ID'si nasıl eklenir ve neler asla loglanmamalı? Sabah 3'te işe yarayan loglama rehberi."
---

Kısa cevap: düz metin yerine her log satırını sabit alan adlarına sahip JSON olarak yazın, her isteğe bir korelasyon ID'si (trace_id) ekleyin ve log seviyelerini tutarlı kullanın. Bu üçü olmadan bir olayı sabah 3'te araştırmak, binlerce satır arasında göz gezdirmekten ibaret kalıyor.

## Düz metin loglar neden baskı altında işe yaramıyor?

Düz metin bir log satırı ("Kullanıcı girişi başarısız: john@example.com") insan gözüyle okunaklı ama makine tarafından sorgulanamaz; "başarısız" kelimesini arattığınızda binlerce alakasız satır da geliyor. Bir servis saniyede binlerce istek işlediğinde, düz metin arasında belirli bir isteğin tüm izini bulmak, kelimenin tam anlamıyla samanlıkta iğne aramaya dönüşüyor.

Yapılandırılmış loglama bu sorunu, her log satırını önceden tanımlı alanlara sahip bir veri yapısı (genelde JSON) olarak yazarak çözüyor. "Başarısız" kelimesini aramak yerine `level:error AND endpoint:/login` gibi kesin bir sorgu çalıştırabiliyorsunuz — sonuç saniyeler içinde, yanlış pozitif olmadan geliyor.

## Yapılandırılmış log satırı hangi alanları içermeli?

Minimum bir log satırı şu alanları içermeli: zaman damgası, seviye, mesaj, trace_id ve isteğe özgü bağlam alanları (kullanıcı ID'si, endpoint, süre gibi). Bu alan seti, bir olayı araştırırken "ne zaman, ne kadar ciddi, hangi istek, hangi kullanıcı" sorularının hepsine tek satırdan cevap veriyor.

```json
{
  "timestamp": "2026-10-31T14:22:05Z",
  "level": "error",
  "trace_id": "4f2a1c9e-88b3",
  "message": "Payment gateway timeout",
  "endpoint": "/api/checkout",
  "user_id": "usr_8821",
  "duration_ms": 4012,
  "gateway": "stripe"
}
```

Bu satırda `duration_ms` ve `gateway` gibi bağlama özgü alanlar, hatanın sadece var olduğunu değil, hangi dış servisin ve ne kadar sürede zaman aşımına uğradığını da gösteriyor — düz metinle bu detayı yakalamak için ayrı bir regex yazmanız gerekirdi.

## Korelasyon ID'si ve trace context nasıl çalışır?

Korelasyon ID'si (trace_id), tek bir isteğin sistem içinde geçtiği her servisteki log satırlarını birbirine bağlayan benzersiz bir kimlik. OpenTelemetry'nin [log-trace korelasyon dokümantasyonu](https://opentelemetry.io/docs/languages/dotnet/logs/correlation/), aktif bir trace içinde üretilen bir logun trace_id ve span_id alanlarının otomatik olarak doldurulduğunu belirtiyor — yani doğru enstrümantasyon kurulduğunda bu alanları elle eklemenize gerek kalmıyor.

Bunun pratik faydası şu: bir kullanıcı isteği API Gateway'den başlayıp auth servisine, ardından ödeme servisine geçtiğinde, aynı trace_id her üç serviste de log satırlarında görünüyor. Bu isteğin tüm yolculuğunu, ayrı ayrı üç log sistemine girmeden, tek bir sorguyla yeniden kurabiliyorsunuz. [Hücre tabanlı mimaride](/tr/posts/hucre-tabanli-mimari-patlama-yaricapi) olduğu gibi dağıtık sistemlerde bu korelasyon, hangi hücrenin veya servisin asıl sorumlu olduğunu bulmanın tek pratik yolu haline geliyor.

## Log seviyelerini anlamlı kullanmak ne demek?

Anlamlı kullanım, her seviyenin ne zaman kullanılacağına dair net bir kural koymak ve o kurala sadık kalmak demek; aksi halde herkes her şeyi "info" seviyesinde loglar ve seviye alanı anlamını kaybeder. Pratik kural seti: `debug` geliştirme sırasında işe yarayan ayrıntı, `info` normal iş akışı olayları, `warn` henüz hata olmayan ama izlenmesi gereken durumlar, `error` kullanıcıyı etkileyen başarısızlıklar.

| Seviye | Ne zaman kullanılır | Örnek |
|---|---|---|
| debug | Sadece geliştirme/hata ayıklama sırasında | "Cache anahtarı hesaplandı: user:8821:profile" |
| info | Normal iş akışı olayları | "Sipariş oluşturuldu: #38291" |
| warn | Hata değil ama izlenmesi gereken durum | "Üçüncü deneme sonrası retry başarılı" |
| error | Kullanıcıyı etkileyen başarısızlık | "Ödeme ağ geçidi zaman aşımına uğradı" |

Bir ekip `error` seviyesini sadece gerçek, aksiyon gerektiren olaylar için ayırdığında, alarm sistemine bağlanan `error` sayısı anlamlı bir sinyale dönüşüyor; her şey error ise hiçbir şey error değildir.

## Loglarda asla ne bulunmamalı?

Kişisel verileri (PII), şifreleri, API anahtarlarını, tam kredi kartı numaralarını ve oturum token'larını hiçbir koşulda loglamamalısınız; bu bilgiler log toplama sisteminize sızdığında, log'lara erişimi olan herkes bu verilere de erişmiş oluyor. On İki Faktörlü Uygulama (12-factor app) metodolojisinin log prensibi, uygulamanın logları nereye yazacağına hiç karar vermemesi, bunun yerine olay akışını stdout'a yazıp yönlendirmeyi çalışma ortamına bırakması gerektiğini söylüyor — bu ayrım, hangi verinin loglanacağı kararını da merkezi ve denetlenebilir hale getiriyor.

Pratik bir önlem: log kütüphanenize bir maskeleme katmanı ekleyip `password`, `token`, `ssn` gibi alan adlarını otomatik olarak `***` ile değiştirmek, insan hatasına güvenmekten çok daha güvenilir.

## Gürültülü logları örnekleme nasıl maliyeti düşürür?

Örnekleme (sampling), her olayı değil, olayların belirli bir yüzdesini loglayarak depolama maliyetini düşürme yöntemi; kritik olan, hiçbir `error` seviyesi logun örneklemeye tabi tutulmaması. Örneğin `debug` seviyesindeki gürültülü logları %10 oranında örneklemek, depolama maliyetini önemli ölçüde azaltırken hiçbir hata olayını kaçırmıyor çünkü error seviyesi her zaman %100 tutuluyor.

Bu, [cache stratejileri ve geçersiz kılma](/tr/posts/cache-stratejileri-gecersiz-kilma) yazısında ele alınan maliyet/performans dengesine benzer bir karar: her veriyi aynı önemde tutmak yerine, hangi verinin tam, hangisinin örneklenmiş olacağına bilinçli karar vermek gerekiyor.

## Yapılandırılmış loglamaya geçiş için hangi adımları izlemelisiniz?

Geçiş dört adımda tamamlanıyor: önce zorunlu alan setini (timestamp, level, trace_id, message) tanımlayın, ardından mevcut log kütüphanenizin JSON çıktısı destekleyip desteklemediğini kontrol edin, sonra trace context'in otomatik enjekte edildiği bir enstrümantasyon katmanı (ör. OpenTelemetry SDK) ekleyin, son olarak maskeleme kuralını devreye alın. Bu sırayı tersine çevirip önce maskeleme eklemeye çalışmak, henüz hangi alanların var olacağını bilmediğiniz için gereksiz tekrar işe yol açıyor.

Mevcut bir sistemi geriye dönük olarak dönüştürmek yerine, yeni yazılan her log satırının yeni formatı kullanmasını zorunlu kılmak daha pratik; eski loglar zaten zaman içinde saklama süresi dolup sistemden düşüyor, yani geriye dönük bir göç projesine gerek kalmıyor.

## Logları trace ve metriklerle nasıl birleştirirsiniz?

Loglar, trace'ler ve metrikler gözlemlenebilirliğin üç ayağını oluşturuyor; bunları aynı trace_id üzerinden birbirine bağlamak, bir metrik grafiğindeki ani bir artışı gördüğünüzde doğrudan ilgili log satırlarına atlamanızı sağlıyor. Pratikte bu, bir APM aracında bir trace'e tıkladığınızda o isteğe ait tüm log satırlarının otomatik olarak görünmesi anlamına geliyor.

Kendi değerlendirmem: çoğu ekip loglamayı "sonra düzeltiriz" diye erteliyor, ama yapılandırılmış format ve korelasyon ID'sini ilk günden kurmak, binlerce log satırını geriye dönük olarak yeniden biçimlendirmekten çok daha ucuz. Bir üretim olayında bu fark, dakikalarla saatler arasındaki araştırma süresine dönüşüyor.

Bu yatırımın geri dönüşü en çok, bir olay sırasında doğru soruyu ilk denemede sorabildiğinizde görülüyor: "hangi endpoint, hangi kullanıcı, ne kadar süre" sorularının üçüne de tek bir sorguda cevap bulduğunuzda, araştırma saatler değil dakikalar sürüyor.

## Sıkça Sorulan Sorular

### Yapılandırılmış loglama nedir?

Yapılandırılmış loglama, her log satırını düz metin yerine sabit alan adlarına sahip bir veri yapısı (genelde JSON) olarak yazma yöntemi. Bu format, log satırlarını kesin alan bazlı sorgularla aramayı mümkün kılıyor, düz metinde yapılan anahtar kelime aramasının aksine.

### Korelasyon ID'si neden gerekli?

Bir isteğin sistem içinde geçtiği her servisteki log satırlarını birbirine bağlamak için gerekli; aynı trace_id'yi taşıyan satırlar, tek bir isteğin tüm yolculuğunu yeniden kurmanızı sağlıyor. OpenTelemetry gibi araçlar, doğru enstrümantasyon kurulduğunda bu alanı otomatik dolduruyor.

### Loglarda hangi bilgiler asla bulunmamalı?

Şifreler, API anahtarları, tam kredi kartı numaraları, oturum token'ları ve kişisel veriler (PII) hiçbir koşulda loglanmamalı. Bu bilgiler log sistemine sızdığında, log'lara erişimi olan herkes bu hassas verilere de erişmiş oluyor.

### Log seviyelerini nasıl doğru kullanırsınız?

Her seviyeye net bir kural atayın: debug sadece geliştirme sırasında, info normal iş akışı olayları için, warn henüz hata olmayan ama izlenmesi gereken durumlar için, error ise kullanıcıyı etkileyen gerçek başarısızlıklar için. Bu ayrım yapılmazsa error sayısı anlamsızlaşır ve alarm sistemi güvenilirliğini kaybeder.
