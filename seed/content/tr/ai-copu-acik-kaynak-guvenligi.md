---
title: "AI Çöpü Açık Kaynak Güvenliğini Zorluyor"
slug: "ai-copu-acik-kaynak-guvenligi"
translationKey: "ai-slop-open-source-security"
locale: "tr"
excerpt: "curl'ün gerçek rapor oranı 2025'te %15'in üzerinden %5'in altına düştü; HackerOne'ı AI çöpü bastı. Bakımcıları bekleyen sinyal-gürültü savaşı burada."
category: "software-engineering"
tags: ["open-source", "web-security", "ai-coding", "burnout", "code-quality"]
publishedAt: "2026-07-07"
seoTitle: "AI Çöpü Açık Kaynak: curl'ün Summer of Bliss Kararı"
seoDescription: "curl, AI çöpü bakımcıları boğunca bir ay boyunca rapor almayı durdurdu. Sinyal-gürültü krizinin verisi ve aynı AI'ın gerçek hataları nasıl düzelttiği."
---

2025'te curl'e ulaşan gerçek güvenlik raporlarının oranı %15'in üzerinden %5'in altına düştü. Bu bir yazım hatası değil. İşlerin en kötü olduğu dönemde, internetin en güvenlik-kritik projelerinden birine gelen her yirmi bildirimden yalnızca biri gerçek bir açık anlatıyordu. Gerisi AI çöpüydü: akıcı, özgüvenli, doğru biçimlendirilmiş; ama curl'de olmayan kod yollarından, yıllar önce yamanmış CVE'lerden ya da hiç var olmayan hatalardan bahseden raporlar.

1 Temmuz 2026'da curl'ün baş bakımcısı Daniel Stenberg bir sınır çekti. O günden 3 Ağustos'a kadar curl, HackerOne üzerinde hiçbir güvenlik açığı raporu kabul etmiyor. Buna "Summer of Bliss" (Huzur Yazı) adını verdi ve duyuru [Hacker News'te](https://news.ycombinator.com/item?id=48537165) hızla viral oldu (793 puan, 316 yorum). Milyarlarca cihazda çalışan bir proje için çarpıcı bir hamle. Aynı zamanda, AI kaynaklı gürültünün açık kaynak güvenliğini ayakta tutan ücretsiz çalışan insanları zorladığının bugüne kadarki en net işareti.

## curl'ün "Summer of Bliss" kararı tam olarak nedir?

Summer of Bliss, gelen açık raporlarına bir aylık bilinçli bir aradır; kalıcı bir kapanış değil. Bakımcının dikkatini geri satın almasıdır. Doğru jargona bürünüp curl'ün felakete bir adım uzaklıkta olduğunu iddia eden her çöp rapor, bir insanı kodu okumaya, iddianın yanlış olduğunu teyit etmeye ve bir çürütme yazmaya zorlar. Bu iş, hiçbir şey olmadığı ortaya çıkana kadar gerçek triyajdan ayırt edilemez.

Buraya gelinen yol ani değildi. AI çöpü 2025 boyunca curl'ün bug bounty programını boğdu, ekip Ocak 2026'da programı durdurdu, GitHub tabanlı başarısız bir deneme yaptı, Mart'ta HackerOne'a döndü ve şimdi de nefes almak için bir ay ara verdi. [BleepingComputer'ın aktardığına](https://www.bleepingcomputer.com/news/security/curl-ending-bug-bounty-program-after-flood-of-ai-slop-reports/) göre 2025 ortasında tüm bildirimlerin yaklaşık %20'si sahte, LLM üretimi türdendi. Hikâyeyi anlatan sayı ise gerçek rapor oranı:

| Dönem | Gerçek rapor oranı | Kuyruğun durumu |
|-------|--------------------|-----------------|
| 2025 öncesi | >%15 | Normal sinyal-gürültü |
| 2025 orta–sonu | <%5 | Çöp seli, ~%20 saf AI çöpü |
| Ocak 2026 | — | Bounty durduruldu |
| Mart 2026 | %15–16 | Toparlandı, HackerOne'a dönüş |
| Temmuz 2026 | — | Summer of Bliss (gönüllü ara) |

Manşetlerin atladığı ince nokta şu: Mart 2026'ya gelindiğinde çöp büyük ölçüde geçmişti ve teyit oranları çöp öncesi seviyeye dönmüştü. Ancak raporlar artık 2025'in yaklaşık iki katı hızda geliyor; o hız da önceki yılların zaten iki katıydı. Temmuz 2026'daki sorun artık çöp değil. Minik bir ekibe karşı katıksız hacim.

## Rahatsız edici öteki yarı: AI curl'ün hatalarını da düzeltiyor

Bu yalnızca AI'ın çöp ürettiği bir hikâye olsaydı işler kolay olurdu. Değil. Stenberg [AI'ın açık kaynağı DDoS'ladığını](https://thenewstack.io/curls-daniel-stenberg-ai-is-ddosing-open-source-and-fixing-its-bugs/) söylerken aynı nefeste AI güvenlik araçlarını gerçek, merge edilmiş sonuçlar için övüyor.

AISLE, ZeroPath ve Codex Security gibi AI destekli tarayıcılar curl'e 200-300 civarında merge edilmiş bugfix ve yaklaşık bir düzine gerçek CVE kazandırdı. Eskiden açık uyduran modeller, doğru yönetildiğinde artık gerçek açıkları buluyor. Üzerine düşünmeye değer, kontratıyla çelişen nüans bu: gelen kutusunu gürültüyle dolduran teknolojinin ta kendisi, başka ellerde, insan denetçilerin gözden kaçırdığı meşru kusurları yüzeye çıkarıyor.

Ayrım "AI iyi" ya da "AI kötü" değil. *Aracı kimin tuttuğu ve çıktının arkasında yetkin bir insanın durup durmadığı*. Tarayıcı çalıştıran, bulguyu doğrulayan, yeniden üreten ve net bir rapor yazan bir araştırmacı sinyal ekler. Bir bounty peşinde koşup doğrulanmamış bir LLM dökümünü yapıştıran "hacker" gürültü ekler. Aynı model, zıt değer. Bu, günlük kodlamada faydalı yardımı sorumluluktan ayıran disiplinin aynısı; [AI kod asistanı kullanırken 7 hata](/tr/posts/ai-kod-asistani-hatalari) yazımızda bunu ele alıyoruz.

## Neden asıl baskı noktası ücretsiz çalışan bakımcılar?

Hacker News başlığı hızla curl'ün ötesine, yapısal soruna geçti: kritik internet altyapısı ücretsiz çalışan bireylere bağlı. curl, dünya çapında işletim sistemlerine, arabalara, telefonlara ve bulut platformlarına gömülü, gönüllü liderliğinde bir proje. Bu modelin üzerine asimetrik bir maliyet düştüğünde, sert düşüyor.

Ve buradaki maliyet derinden asimetrik. İnandırıcı bir çöp raporu üretmek saniyeler ve sıfır uzmanlık ister. Bir tanesini çürütmek ise yetkin bir bakımcının odaklı zamanını ve daha kötüsü güvenini alır. Her yanlış alarm, bir sonraki raporun ya biraz daha kolay onaylanmasını ya da biraz daha kolay reddedilmesini olası kılar; güvenlik işinde iki başarısızlık biçimi de tehlikelidir. Bu, ders kitabı tükenmişlik yakıtı: yüksek riskli, teşekkürsüz, sonu gelmez şekilde bölünebilen bir emek. Bakımcı yönetiyor ya da mentorluk yapıyorsanız, [yazılımcı olarak tükenmişlik nasıl önlenir](/tr/posts/yazilimci-tukenmisligi) rehberimiz gönüllü güvenlik triyajına doğrudan uygulanır.

Fikrimi net söyleyeyim: bu sorun bakımcıların değil, bug-bounty platformlarının. Çöp gönderme teşviki var, çünkü ödüller doğrulanmış kaliteyi değil, "şansı olan hacmi" ödüllendiriyor. Platformlar bildirimler için itibari ya da parasal bir teminat almadıkça ve teyitli çöpü cezalandırmadıkça, tek tek projeler kendi üzerlerinde tasarlanmamış bir maliyeti emmeye devam edecek.

## Projeler sinyali gürültüden nasıl ayırır?

İnsanların bir LLM'i repo'nuza doğrultmasını engelleyemezsiniz. Ama zamanınızı boşa harcamanın maliyetini yükseltebilirsiniz. Temmuz 2026 itibarıyla bakımcıların üzerinde uzlaştığı taktikler üç katmana ayrılıyor.

**1. Girişte triyaj kapıları.** Bir rapor insan kuyruğuna girmeden önce yeniden üretim zorunlu olsun. Başarısız bir komut, etkilenen sürüm ve beklenen-gerçekleşen çıktı isteyen yapılandırılmış bir şablon çöpün çoğunu otomatik eler; çünkü çöp nadiren yeniden üretilir.

```yaml
# .github/ISSUE_TEMPLATE/security.yml — nutuk değil, kanıt iste
- type: input
  id: curl-version
  attributes: { label: "Etkilenen sürüm (curl -V çıktısı)" }
  validations: { required: true }
- type: textarea
  id: repro
  attributes:
    label: "Sorunu yeniden üreten tam komut"
    placeholder: "curl --flag https://... → gözlenen vs beklenen"
  validations: { required: true }
- type: checkboxes
  id: attestation
  attributes:
    label: "Beyan"
    options:
      - label: "Bunu desteklenen bir sürümde yeniden ürettim ve doğrulanmamış AI çıktısı yapıştırmadım"
        required: true
```

**2. İtibar ağırlıklandırma.** İlk kez rapor gönderen, geçmişi olmayan hesapları daha yavaş bir hatta yönlendirin; teyitli bulgu geçmişi olan araştırmacıları öne alın. İtibar sahip olduğunuz en ucuz sinyaldir ve inşa etmek gönderene bir bedele mal olur.

**3. AI destekli ön eleme.** Ateşe ateşle karşılık verin. Bir model, iddia edilen açığı gerçek kod tabanıyla çapraz kontrol edip var olmayan fonksiyonlara ya da zaten yamanmış CVE'lere atıf yapan raporları bir insan açmadan işaretleyebilir. Amaç otomatik kapatmak değil, kuyruğu sıralamak; böylece bakımcının ilk saati en olası gerçek rapora gider. Bu eleyiciler de yanılabildiği için nihai kararda bir insanı tutun ve gerekçeyi doğrulayın; tıpkı [üretimde LLM halüsinasyonlarını azaltma](/tr/posts/llm-halusinasyon-azaltma) rehberimizin önerdiği gibi.

Bunların hiçbiri egzotik değil. [İşe yarayan unit testler yazma](/tr/posts/unit-test-nasil-yazilir) ve bir [temiz kod kontrol listesine](/tr/posts/temiz-kod-prensipleri) göre yayınlama disiplininin ardındaki "denetçiye değil, makineye kontrol ettir" içgüdüsünün aynısı: doğrulamayı en erken, en ucuz kapıya itin. Bu alışkanlıkların ardındaki mühendislik kültürü için [yazılım mühendisliği](/tr/category/yazilim-muhendisligi) kategorisine göz atın.

curl hikâyesi güvenlikte AI'a karşı bir argüman değil. Döngüde yetkin ve dinlenmiş bir insanı tutmanın; teşvikleri o insan, sonsuz özgüvenli saçmalık arzına karşı tek savunma hattı olmayacak şekilde yeniden tasarlamanın argümanı.

## Sıkça Sorulan Sorular

### curl'ün "Summer of Bliss" kararı nedir?

1 Temmuz–3 Ağustos 2026 arasında curl'ün HackerOne üzerinde hiçbir güvenlik açığı raporu kabul etmediği, bilinçli ve bir aylık bir aradır. Baş bakımcı Daniel Stenberg, küçük ekibini AI üretimi "çöp" raporların selinden rahatlatmak için başlattı. curl'ün güvenlik sürecinin sonu değil, geçici bir nefes molasıdır; raporlar Ağustos'ta yeniden başlar.

### Güvenlik raporları bağlamında "AI çöpü" nedir?

AI çöpü, meşru görünen ama gerçekte hiçbir şey anlatmayan, LLM üretimi düşük kaliteli bir açık raporudur: projede olmayan kod yolları, yıllar önce yamanmış CVE'ler ya da uydurma hatalar. Tehlikeli olması tam da akıcı ve doğru biçimlendirilmiş olmasından; bir insan bakımcı kodu okuyup çürütmek zorunda kalıyor. 2025 zirvesinde curl'e gelen bildirimlerin yaklaşık %20'si bu türdendi.

### AI açık kaynak güvenliğine tamamen zararlı mı?

Hayır ve asıl nüans bu. Çöpü üreten AI dalgasının aynısı gerçek hataları da buluyor. AISLE, ZeroPath ve Codex Security gibi AI destekli tarayıcılar curl'e yaklaşık 200-300 merge edilmiş düzeltme ve bir düzine kadar gerçek CVE kazandırdı. Belirleyici etken, çıktıyı göndermeden önce yetkin bir insanın doğrulayıp doğrulamadığıdır.

### Bakımcılar çöpü gerçek raporlardan nasıl ayırır?

Üç katman kullanın: bir rapor insan kuyruğuna ulaşmadan çalışan bir yeniden üretim isteyen triyaj kapıları, geçmişsiz hesapları yavaşlatıp kanıtlı araştırmacıları öne alan itibar ağırlıklandırma ve kuyruğu bir raporun gerçek olma olasılığına göre sıralayan AI destekli ön eleme. Nihai kararda bir insanı tutun. Bunlar birlikte, meşru araştırmacıları engellemeden gürültü göndermenin maliyetini yükseltir.
