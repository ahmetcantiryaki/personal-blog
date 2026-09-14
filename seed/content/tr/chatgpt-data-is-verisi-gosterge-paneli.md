---
title: "ChatGPT Data ile İş Verinden Gösterge Paneli Kurma"
slug: "chatgpt-data-is-verisi-gosterge-paneli"
translationKey: "chatgpt-data-plugin-dashboards-2026"
locale: "tr"
excerpt: "Kısa cevap: ChatGPT Work'te @Data'ya sorunuzu sorun, bağlı Snowflake/BigQuery gibi kaynaklardan sonuç üretir, SQL yazmadan düzenlenebilir panel kurar."
category: "business"
tags: ["chatgpt", "openai", "automation", "productivity"]
publishedAt: "2026-09-14"
seoTitle: "ChatGPT Data Eklentisi ile Gösterge Paneli Nasıl Kurulur?"
seoDescription: "ChatGPT Work'teki Data ajanı, iş sorularını nasıl araştırıyor ve SQL bilmeden interaktif panel üretiyor? Kurulum, örnek ve sınırları anlatıyoruz."
---

Kısa cevap: ChatGPT Work içinde @Data'ya sorunuzu doğal dilde sorarsınız, ajan bağlı Snowflake, BigQuery, Redshift gibi kaynaklardan veri çeker, ne değiştiğini araştırır ve şirketinizin markasına uyan, düzenlenebilir bir interaktif panel üretir. OpenAI bu Data ajanını 10 Eylül 2026'da ChatGPT Work ve Codex içine ekledi; SQL yazmadan çalışıyor.

Şimdiye kadar "neden churn arttı" gibi bir soruyu cevaplamak için ya bir veri analistinin sırasını beklemeniz ya da kendi SQL'inizi yazmanız gerekiyordu. Data ajanı, bu aradaki adımı ortadan kaldırmayı vaat ediyor: soruyu doğal dilde sorup, ajanın hangi tabloya bakacağına, hangi karşılaştırmayı yapacağına karar vermesine izin veriyorsunuz.

## ChatGPT Data plugin'i tam olarak ne yapıyor?

Data ajanı, onaylı kurumsal veri kaynaklarına bağlanıp bir iş sorusunu araştırıyor, bulguları açıklıyor ve paylaşılabilir interaktif panolar/raporlar oluşturuyor. Desteklenen kaynaklar arasında Amazon Redshift, Google BigQuery, ClickHouse, Databricks, MongoDB ve Snowflake var; ayrıca Google Drive ve SharePoint'ten iş bağlamı çekebiliyor.

Bu, genel amaçlı bir "verimi analiz et" aracından farklı: ajan, şirketinizin zaten kurduğu erişim kurallarını koruyarak çalışıyor, yani bir çalışan normalde göremediği bir tabloyu Data ajanı üzerinden de göremiyor.

## Hangi veri kaynakları bağlanabiliyor?

| Kaynak | Tip | Not |
|---|---|---|
| Snowflake | Veri ambarı | Doğrudan sorgu |
| Google BigQuery | Veri ambarı | Doğrudan sorgu |
| Amazon Redshift | Veri ambarı | Doğrudan sorgu |
| Databricks | Lakehouse | Doğrudan sorgu |
| ClickHouse | Analitik veritabanı | Lansman ortağı |
| MongoDB | Doküman veritabanı | Doğrudan sorgu |
| Google Drive / SharePoint | Bağlam | Metrik değil, açıklayıcı doküman |

Bağlantı kurulumu BT/veri ekibinizin onayına bağlı; her kaynak için erişim izinleri, kaynağın kendi sistemindeki kurallarla aynı şekilde uygulanmaya devam ediyor.

## Örnek üzerinden nasıl çalışıyor: "Neden churn arttı?"

Sohbete @Data ile başlayıp sorunuzu, mümkünse kaynağı, metriği, zaman aralığını ve karşılaştırmayı belirterek yazıyorsunuz: "Son 3 ayda enterprise segmentinde churn neden arttı, önceki çeyrekle karşılaştır." Ajan, ilgili tabloları tarıyor, hangi kohortun etkilendiğini bulup bir ilk bulgu sunuyor ve bunu destekleyen bir interaktif panel oluşturuyor.

```text
Prompt: @Data Son 3 ayda enterprise segmentinde churn neden
arttı? Önceki çeyrekle karşılaştır, fiyat değişikliği yapılan
plana göre kırılım ekle.
```

Sonuçtan memnun kalmazsanız aynı sohbette takip sorusu sorarak inceliyorsunuz: "sadece Avrupa bölgesine filtrele" veya "aylık yerine haftalık göster" gibi bir istekle panoyu yeniden şekillendirebiliyorsunuz; her iterasyon önceki bağlamı koruyor.

## Panoyu iyileştirmek için hangi takip soruları işe yarıyor?

En verimli takip soruları, tek bir değişkeni değiştirip geri kalanı sabit tutuyor: zaman aralığını daraltma, bir segment ekleme, bir metriği yüzdeye çevirme gibi. Belirsiz bir "daha iyi yap" isteği yerine "bu grafiği plana göre kırıp yüzde değişimi ekle" demek, ajanın doğru revizyonu bulma ihtimalini artırıyor.

| Zayıf takip | Güçlü takip |
|---|---|
| "Daha detaylı yap" | "Bölgeye göre kırıp en çok düşen 3 segmenti göster" |
| "Farklı bir grafik dene" | "Çizgi yerine kümülatif alan grafiği kullan" |
| "Bunu doğrula" | "Bu rakamı geçen çeyreğin ham tablosuyla karşılaştır" |

## Kimin neyi göreceğini nasıl sınırlarsınız?

Data ajanı, bağlı olduğu kaynağın kendi erişim kurallarını devralıyor; yani bir çalışanın Snowflake'te göremediği bir şema, ChatGPT üzerinden de görünmüyor. Yine de yeni bir risk katmanı var: ajanın ürettiği pano paylaşıldığında, o anlık görüntü kaynağın erişim kontrolünden bağımsız bir dosya hâline geliyor. Panoyu paylaşmadan önce, içindeki verinin paylaşacağınız kişinin zaten erişimi olan veriyle sınırlı olduğunu kontrol etmek BT ekibinizin sorumluluğunda.

## Ne zaman gerçek bir BI aracı hâlâ daha iyi?

Data ajanı tek seferlik keşif soruları ve hızlı prototip panolar için güçlü, ama üretim kalitesinde, günlük yenilenen ve çok kişinin izlediği bir gösterge paneli için Looker veya Tableau gibi özel bir BI aracının yerini almıyor. Ajanın ürettiği ilk pano genellikle "bu soruyu araştırmaya değer mi" sorusuna hızlı cevap veriyor; cevap evetse, o analizi kalıcı bir BI aracına taşımak hâlâ doğru adım.

Açıkçası kişisel görüşüm şu: bu araç veri analistlerinin yerini almıyor, onların "hangi soruyu araştırmalıyım" kuyruğunu kısaltıyor. [ChatGPT Work](/tr/posts/chatgpt-work-nedir-openai-is-ajani) zaten çok adımlı iş görevlerini otomatikleştirmeyi hedefliyordu; Data ajanı bunun analitik tarafındaki en somut örneği. Tablo işleri için [ChatGPT ile Gemini'yi karşılaştırdığımız yazıda](/tr/posts/tablolar-icin-chatgpt-mi-gemini-mi) da benzer bir örüntü görülüyor: model, veriyi hazırlamakta hızlı ama son doğrulama hâlâ insanın işi.

## Kurucular için ne anlama geliyor?

Ayrı bir veri ekibi kuramayacak kadar küçük şirketler için Data ajanı, [AI muhasebe otomasyonuna](/tr/posts/kurucular-icin-ai-muhasebe-neyi-otomatiklestir) benzer bir boşluğu dolduruyor: SQL bilmeyen bir kurucu, "bu ayki MRR değişimini segment bazında göster" diye sorup dakikalar içinde bir ilk görüntü alabiliyor. Riski de aynı yerde: rakamları körü körüne yönetim kuruluna sunmadan önce, en azından bir metriği ham veriyle elle çapraz kontrol etmek gerekiyor.

## Kurulumda hangi hatalar en çok yapılıyor?

En sık görülen üç hata: kaynağı belirtmeden soru sormak (ajan hangi tabloya bakacağını tahmin etmek zorunda kalıyor), zaman aralığını atlamak (ajan varsayılan bir aralık seçip yanlış karşılaştırma yapabiliyor) ve ilk sonucu doğrulamadan paylaşmak. Bunların üçü de sorunuzu daha spesifik yazarak önlenebiliyor; "satışlar nasıl gitti" yerine "Ağustos 2026'da Avrupa bölgesinde aylık tekrarlanan gelir nasıl değişti, Temmuz ile karşılaştır" gibi bir soru, ajanın doğru tabloyu bulma ihtimalini büyük ölçüde artırıyor.

| Hata | Sonuç | Düzeltme |
|---|---|---|
| Kaynak belirtilmemiş | Ajan yanlış tabloyu seçebilir | Kaynak/şema adını sorguya ekleyin |
| Zaman aralığı belirsiz | Yanlış dönem karşılaştırması | "Son 3 ay, önceki çeyrekle" gibi net aralık verin |
| Doğrulanmamış paylaşım | Yanlış rakamla karar alınır | En az bir metriği ham veriyle çapraz kontrol edin |

## Ekibinize nasıl tanıtmalısınız?

Data ajanını ilk kez kullanan bir ekip, genellikle önce düşük riskli bir soruyla başlamalı: geçmişte zaten bilinen bir cevabı olan bir soru sorup ajanın sonucunun doğru çıkıp çıkmadığını kontrol etmek, aracın güvenilirliğine dair hızlı bir fikir veriyor. Bu "kalibrasyon turu"ndan sonra ekip, hangi tür sorularda ajana güvenebileceğini ve hangi sorularda hâlâ bir analiste danışması gerektiğini daha net görüyor.

## Fiyatlandırma ve kullanım limiti nasıl işliyor?

Data ajanının kendine özel ayrı bir ücreti yok; ChatGPT Work ve Codex planınıza dahil geliyor, ama arka planda yaptığı her sorgu ve pano üretimi normal kullanım limitlerinize sayılıyor. Yoğun kullanan ekipler için bu, ay sonunda beklenmedik bir limit uyarısı anlamına gelebilir; özellikle birden fazla kişi aynı anda büyük veri kümeleri üzerinde keşif yapıyorsa kullanım paternini ilk hafta yakından izlemek faydalı.

## Sıkça Sorulan Sorular

### ChatGPT Data plugin'i hangi plana dahil?

ChatGPT Work ve Codex kullanıcıları için mevcut; standart ChatGPT Plus/Pro tüketici planlarında yer almıyor. OpenAI'ın Eylül 2026 duyurusuna göre erişim, kurumsal veri kaynaklarını bağlayabilen iş hesaplarıyla sınırlı.

### Data ajanı SQL bilmemi gerektirir mi?

Hayır. Soruyu doğal dilde yazıyorsunuz, ajan arka planda gerekli sorguyu kendisi oluşturuyor. Yine de hangi tabloya, hangi zaman aralığına baktığını sonuç panelinde kontrol etmek, yanlış yorumlanan bir metriği erken yakalamanızı sağlıyor.

### Data ajanının ürettiği panoya güvenebilir miyim?

Tam güvenmeyin, doğrulayın. Ajan doğru kaynağa baktığını iddia etse bile, karmaşık iş mantığı (örneğin "aktif kullanıcı" tanımınızın istisnaları) bazen kayboluyor; en azından bir ana metriği ham veriyle veya bilinen bir raporla karşılaştırmadan yönetim toplantısına taşımayın.

### Hangi veri kaynakları desteklenmiyor?

Duyuru anında Redshift, BigQuery, ClickHouse, Databricks, MongoDB ve Snowflake destekleniyordu; kendi barındırdığınız (self-hosted) veya listede olmayan özel bir veritabanınız varsa önce IT ekibinizle bağlantı seçeneklerini kontrol edin.
