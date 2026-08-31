---
title: "Claude Cowork ile Haftalık Pazarlama Raporu"
slug: "claude-cowork-haftalik-pazarlama-raporu"
translationKey: "claude-cowork-weekly-reports"
locale: "tr"
excerpt: "Kısa cevap: Claude Cowork'te bir Skill ile rapor yapısını sabitle, zamanlanmış görevle her hafta otomatik çalıştır; sonuç Cowork'ün bulutunda hazır bekler."
category: "digital-marketing"
tags: ["claude", "automation", "workflow", "marketing-analytics"]
publishedAt: "2026-08-31"
seoTitle: "Claude Cowork ile Haftalık Pazarlama Raporu Otomasyonu"
seoDescription: "Kısa cevap: Claude Cowork'te bir Skill ile rapor yapısını sabitle, zamanlanmış görevle her hafta otomatik çalıştır; sonuç Cowork'ün bulutunda hazır bekler."
---

Kısa cevap: Claude Cowork'te haftalık pazarlama raporunu otomatikleştirmenin yolu üç adımdan geçiyor — veri kaynağını bağlamak, rapor yapısını sabitleyen bir Skill yazmak ve zamanlanmış görevle her hafta aynı saatte otomatik çalıştırmak. Cowork, Ocak 2026'da terminal bilmeyen pazarlamacılar için başlatıldı ve Temmuz 2026'dan itibaren zamanlanmış görevler bulutta çalışıyor — dizüstü bilgisayarın kapalı olsa bile rapor işleniyor.

## Claude Cowork'e veri kaynağı nasıl bağlanır?

Cowork'te bir konektör eklediğinde (Google Sheets, bir analitik panosu veya CRM raporlama görünümü), Cowork o kaynağa salt okunur erişimle bağlanıyor ve verileri konuşma sırasında çekebiliyor. Bağlantı bir kere kuruluyor; sonraki her zamanlanmış çalıştırmada Cowork aynı kaynağa tekrar erişiyor, elle her seferinde dosya yüklemene gerek kalmıyor.

Birden fazla kaynağı (örneğin reklam harcaması panosu ve web analitiği) aynı anda bağlayabiliyorsun; Cowork bir raporda ikisini birleştirebiliyor. Kritik nokta: rapor iddiaları bağlı veriye dayanmalı, Cowork'ün kendi tahminine değil — bir sayıyı raporlarken hangi kaynaktan geldiğini de yazdırmak, sonradan doğrulamayı kolaylaştırıyor.

## Rapor yapısını sabitleyen Skill nasıl yazılır?

Bir Skill, Cowork'e "her rapor bu KPI'ları, bu sırayla, bu üslupla içersin" diye talimat veren yeniden kullanılabilir bir yönerge dosyası. Skill yazmadan her hafta aynı istemi elle tekrar yazman gerekiyor ve format haftadan haftaya kayıyor; Skill yazınca format sabitleniyor, sen sadece veriyi değiştiriyorsun.

İyi bir rapor Skill'i şu üç şeyi tanımlar: hangi KPI'lar zorunlu (trafik, dönüşüm oranı, edinme maliyeti gibi), bölümlerin sırası (özet → KPI tablosu → dikkat çeken noktalar → önerilen aksiyon) ve ton (kısa, sayı odaklı, yorum eklemeden önce veriyi göster). Skill dosyasını bir kez yazıp kaydettikten sonra, her zamanlanmış çalıştırma aynı yapıyı otomatik uyguluyor.

## Günlük ve haftalık zamanlama nasıl kurulur?

Cowork'te bir görevi zamanlarken sıklığı (günlük, haftalık, aylık) ve saati seçiyorsun; görev o saatte bulutta otomatik çalışıyor. Günlük bir "snapshot" görevi küçük, tek sayfalık bir özet üretebilir (dünün trafiği, dönüşüm sayısı); haftalık "overview" görevi ise Skill'in tanımladığı tam rapor yapısını kullanarak daha kapsamlı bir döküman çıkarabilir.

Aşağıdaki tablo iki zamanlama tipini karşılaştırıyor:

| Görev tipi | Sıklık | Tipik içerik | Kullanım amacı |
|---|---|---|---|
| Snapshot | Günlük | Tek sayfa, 3-5 metrik | Hızlı nabız kontrolü |
| Overview | Haftalık | Skill'in tam yapısı, KPI tablosu, aksiyon önerisi | Ekip toplantısına hazır rapor |
| Ad-hoc | Manuel tetikleme | Belirli bir soruya odaklı analiz | Beklenmedik bir düşüşü araştırma |

## Cowork huniden düşüşü nasıl fark edip öneri sunuyor?

Rapor Skill'i, önceki haftaların verisiyle karşılaştırma yapacak şekilde tanımlandığında, Cowork bir metrikte beklenenden büyük bir düşüş gördüğünde bunu raporun "dikkat çeken noktalar" bölümünde işaretleyebiliyor ve olası nedenlere dair bir hipotez önerebiliyor (örneğin bir kampanyanın bittiği tarihle trafik düşüşünün çakışması gibi). Bu, otomatik bir teşhis değil — Cowork elindeki veriden bir örüntü çıkarıp öneriyor, insanın bunu doğrulaması gerekiyor.

Bu noktada [Claudeforce'un satış ekiplerine sunduğu "governed" (denetimli) eylem modeliyle](/tr/posts/claudeforce-nedir-salesforce-anthropic) benzer bir mantık işliyor: Cowork'ün ürettiği öneri, doğrudan bir aksiyon almıyor, insanın onayına sunulan bir taslak olarak kalıyor.

## Rapor çalışırken nasıl gözden geçirilir ve durdurulur?

Zamanlanmış bir görev çalışırken, Cowork'ün arayüzünden ilerlemeyi canlı izleyebiliyor ve gerekirse görevi ortasında kesip yön değiştirebiliyorsun — örneğin görev yanlış bir veri kaynağına bağlandıysa veya raporun odağı kaymışsa. Görev tamamlandığında sonuç Cowork'te bekliyor; hemen bir kanala göndermek yerine önce insan gözden geçirmesinden geçirmek, özellikle finansal ya da müşteriye giden sayılarda önerilir.

Sayıları insan onayından geçirmeden otomatik paylaşmak, [Zapier ve Make ile kurulan pazarlama otomasyonlarında](/tr/posts/ai-ile-pazarlama-otomasyonu-zapier-make) da karşılaşılan aynı riski taşıyor: otomasyon hızlı ama yanlış bir sayı da aynı hızda yayılıyor. Cowork'ün "görevi izle ve kesebil" özelliği bu riski azaltan bir kontrol noktası sağlıyor.

## Sessiz başarısızlıklar nasıl fark edilir?

Zamanlanmış bir görevin en sinsi hatası, çökmesi değil — sessizce yanlış ya da eksik bir rapor üretmesi. Bir veri kaynağı bağlantısı kesildiğinde veya bir Sheet'in yapısı değiştiğinde, Cowork bazen elindeki eksik veriyle "makul görünen" ama yanlış bir özet üretebiliyor; görev "tamamlandı" olarak görünse de içerik hatalı olabiliyor. Bu riski azaltmanın en pratik yolu, Skill'e her raporun sonunda hangi veri kaynaklarına başarıyla eriştiğini ve hangi tarih aralığını kapsadığını açıkça listelemesini eklemek — bu satır eksikse ya da beklenenden kısaysa, bir şeylerin ters gittiğinin ilk işareti oluyor.

İkinci yaygın hata, KPI tanımlarının zamanla kaymasıdır: örneğin "dönüşüm oranı" bir hafta ziyaretçi bazında hesaplanırken başka bir hafta oturum bazında hesaplanabiliyor, çünkü bağlı veri kaynağının kendi tanımı değişmiş olabiliyor. Skill dosyasına her metriğin tam olarak hangi formülle hesaplandığını yazmak, bu tür sessiz kaymaları önlemenin en ucuz yolu.

## Maliyet ve kapsam nasıl kontrol altında tutulur?

Otonom çalışan bir zamanlanmış görev, her çalıştırmada bir maliyete mal oluyor; günlük snapshot'lar haftalık overview'lardan daha sık çalıştığı için toplam maliyeti hızla artırabiliyor. Pratik bir kural: günlük görevleri sadece gerçekten her gün takip edilmesi gereken metriklerle sınırlı tutmak, daha detaylı analizi haftalık overview'a bırakmak.

Kapsam tarafında ise Skill'e hangi eylemleri alabileceğini (sadece okuma ve özetleme mi, yoksa bir kanala otomatik gönderme de mi) açıkça tanımlamak önemli — bir raporlama görevinin veri kaynağına yazma yetkisi olmaması, yanlış bir yorumun canlı bir sisteme geri yazılması riskini baştan ortadan kaldırıyor.

## Yeniden kullanılabilir bir rapor Skill'i nasıl görünür?

Aşağıdaki taslak, haftalık pazarlama raporu için başlangıç noktası olarak kullanılabilir:

```text
Skill: Haftalık Pazarlama Raporu
Zorunlu KPI'lar: trafik, dönüşüm oranı, edinme maliyeti, en iyi 3 kanal
Bölüm sırası: özet (3 cümle) -> KPI tablosu -> dikkat çeken noktalar -> önerilen aksiyon
Ton: kısa, sayı odaklı, yorumdan önce veri
Karşılaştırma: önceki hafta ile yüzde değişim göster
Kaynak: her sayının hangi bağlı veri kaynağından geldiğini belirt
```

Bu şablonu kendi KPI setine göre uyarlayıp Cowork'e Skill olarak kaydettiğinde, haftalık raporun formatı sabitleniyor ve sen sadece istisnaları gözden geçirmeye odaklanabiliyorsun.

## Sıkça Sorulan Sorular

### Claude Cowork'te zamanlanmış görev nedir?

Zamanlanmış görev, bir istemi bir kere yazıp bir sıklık (günlük, haftalık, aylık) seçtiğinde Cowork'ün o istemi otomatik çalıştırdığı özellik. Temmuz 2026'dan itibaren bu görevler bulutta çalışıyor, yani bilgisayarın kapalı olsa bile rapor zamanında hazırlanıyor.

### Cowork ile Zapier/Make otomasyonu arasındaki fark nedir?

Zapier ve Make, önceden tanımlanmış tetikleyici-aksiyon zincirleriyle çalışır; Cowork ise doğal dil talimatıyla veriyi okuyup yorumlayabilir ve beklenmedik bir örüntüyü (bir düşüş gibi) fark edip raporda işaretleyebilir. Sabit, deterministik bir iş akışı için Zapier/Make; veriyi yorumlayıp özetleyen bir rapor için Cowork daha uygun.

### Skill yazmadan da rapor otomasyonu kurulabilir mi?

Kurulabilir ama format haftadan haftaya tutarsız çıkma riski taşır, çünkü her seferinde istemi elle yazman gerekir. Bir Skill yazmak, KPI setini ve bölüm sırasını sabitleyerek bu tutarsızlığı ortadan kaldırır.

### Cowork'ün ürettiği rapor sayıları güvenilir mi?

Rapor iddiaları bağlı veri kaynağına dayanmalı; Cowork'ten her sayının kaynağını da raporlamasını istemek doğrulamayı kolaylaştırır. Yine de finansal veya müşteriye giden raporlarda, otomatik paylaşımdan önce bir insanın sayıları gözden geçirmesi önerilir.

### Bir görev sessizce yanlış veri üretirse nasıl anlaşılır?

En güvenilir yöntem, Skill'e her raporun sonunda hangi veri kaynaklarına başarıyla eriştiğini ve hangi tarih aralığını kapsadığını açıkça yazdırmasını eklemek. Bu satır eksik, kısa veya beklenenden farklıysa, görev muhtemelen bir kaynağa erişememiş ya da eksik veriyle çalışmış demektir; bu durumda raporu paylaşmadan önce elle kontrol etmek gerekir.

### Bir görevi çalışırken durdurabilir miyim?

Evet, zamanlanmış bir görev çalışırken Cowork'ün arayüzünden ilerlemeyi canlı izleyip görevi ortasında kesebiliyorsun. Bu, görevin yanlış bir veri kaynağına bağlandığını veya odağının kaydığını fark ettiğinde, tamamlanmasını beklemeden yön değiştirmeni sağlayan pratik bir kontrol noktası.

### Cowork ile bir e-posta triyaj asistanı arasındaki fark ne?

İkisi de zamanlanmış görev mantığıyla çalışıyor, ama amaçları farklı: bir e-posta triyaj asistanı gelen kutusunu önceliklendirmeye odaklanırken, Cowork'ün raporlama Skill'i harici veri kaynaklarını okuyup analiz eden ve özet üreten bir araç. İkisini aynı hesapta paralel çalıştırmak, birini diğerinin yerine kullanmaktan daha faydalı sonuç veriyor.
