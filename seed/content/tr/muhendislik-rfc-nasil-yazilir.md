---
title: "Mühendislik RFC'si Nasıl Yazılır"
slug: "muhendislik-rfc-nasil-yazilir"
translationKey: "how-to-write-rfc"
locale: "tr"
excerpt: "Şirket içinde onlarca RFC'nin akıbetini izledikten sonra çıkan ders: iyi RFC'yi kötüsünden ayıran şey fikrin kalitesi değil, seçeneklerin dürüstlüğü."
category: "career-productivity"
tags: ["technical-writing", "documentation", "communication", "best-practices", "career"]
publishedAt: "2026-07-14"
seoTitle: "RFC Nasıl Yazılır? Mühendislik Şablonu ve Rehber"
seoDescription: "İşe yarayan ve tıkanan RFC'lerin farkı: bağlam, non-goals, seçenek karşılaştırması, karar ve rollout. Kopyala-yapıştır şablon ve kaçınılması gereken hatalar."
---

Mühendislik RFC'si nasıl yazılır sorusunun kısa cevabı: bağlamı, hedefleri, seçenekleri ve riskleri tek bir dokümanda, skim edilebilir biçimde topla. Ama bu cevap, onlarca RFC'nin şirket içinde nasıl öldüğünü görmeden anlamlı gelmiyor. Bu yazı, ilerleyen ve tıkanan RFC'ler arasındaki farkı saha notları şeklinde topluyor.

## RFC ne zaman gerçekten değerine değer?

Her karar bir RFC gerektirmez. Tek bir ekibin sınırları içinde kalan, geri alınması kolay ve düşük riskli değişiklikler için RFC yazmak zaman kaybı — bir Slack mesajı veya kısa bir toplantı yeterlidir. RFC'nin karşılığını verdiği yer, kararın şu üç özellikten en az ikisini taşıdığı durumlar: geri alınması pahalı, birden fazla ekibi etkiliyor, veya organizasyonda uzun süre yaşayacak bir hassasiyet öngörülüyor. Kısacası: kararı yanlış verirseniz bedeli ağır olacaksa, RFC yazın.

## Şablon: bağlamdan rollout'a

İşe yarayan RFC'lerin neredeyse hepsi aynı iskeleti paylaşıyor. Sıra önemli — her bölüm bir sonrakinin zeminini hazırlıyor:

1. **Bağlam (Context)**: Problem ne, neden şimdi önemli, kim etkileniyor. Okuyucunun ön bilgisi olmadığını varsayın.
2. **Hedefler ve hedef olmayanlar (Goals / Non-Goals)**: Bu RFC'nin çözmeye çalıştığı şey ile bilerek dışarıda bıraktığı şey. Non-goals bölümü en çok atlanan ama en kritik kısım.
3. **Seçenekler ve trade-off'lar**: En az iki, tercihen üç seçenek — "yapmamak" da bir seçenek olarak dahil edilmeli. Her biri için maliyet, risk ve fayda.
4. **Karar**: Hangi seçenek seçildi ve neden. Bu bölüm RFC'nin taslak halinden karar kaydına dönüştüğü an.
5. **Riskler**: Seçilen yaklaşımın bilinen zayıf noktaları, başarısızlık senaryoları.
6. **Rollout**: Uygulamaya nasıl geçileceği — aşamalı mı, feature flag'li mi, geri alma planı ne.

## Neden yazı, Staff yolunun en kritik becerisi

Bu iddia havada değil: [jobsbyculture'ın 2026 Staff Engineer rehberine göre](https://jobsbyculture.com/blog/staff-engineer-career-path-2026), karmaşık teknik fikirleri açık yazıyla iletebilme yeteneği Staff terfisinin en hafife alınan becerisi. Bunun nedeni basit — kod bir ekibi ikna etmez, karar gerekçesini açıklamaz, alternatifleri karşılaştırmaz. Bir RFC, tam olarak bu üç şeyi yapan tek doküman türü.

Rust dilinin kendi [RFC sürecinde](https://github.com/rust-lang/rfcs) de aynı disiplin görülüyor: her büyük dil değişikliği önce bir RFC olarak yazılıyor, topluluk tartışıyor ve bir çekirdek ekip nihai kararı veriyor. Bu süreç yavaş görünse de, kararların sonradan sorgulanmasını büyük ölçüde önlüyor — çünkü tartışma zaten kayıt altında.

## Skim edenler için yazmak

Bir RFC'yi baştan sona okuyan insan sayısı, yorum yapan insan sayısından her zaman azdır. Çoğu paydaş dokümanı taramak (skim) için açar: başlığa, özet paragrafına ve tablo/madde işaretlerine bakar, sonra ya derinleşir ya da geçer. Bu davranışı yenmeye çalışmak yerine ona yazın: her bölümün başına tek cümlelik bir özet koyun, uzun paragraflar yerine tablo kullanın ve dokümanın en üstüne "TL;DR" niteliğinde üç-dört cümlelik bir özet ekleyin. Teknik dokümantasyonun genel okunabilirlik ilkeleri için [dokümantasyon yazma rehberimize](/tr/posts/teknik-dokumantasyon-yazma) bakabilirsiniz.

## Async inceleme yürütmek ve tartışmayı kapatmak

RFC'lerin çoğu, toplantıda değil yorum thread'lerinde ölür. Tipik başarısızlık deseni şu: RFC paylaşılır, birkaç yorum gelir, tartışma dallanır, hiç kimse kararı kapatmaz ve doküman sessizce terk edilir. Bunu önlemenin üç pratik yolu var:

- **Net bir inceleme penceresi koyun**: "Bu RFC şu tarihe kadar açık; sonrasında mevcut geri bildirimlerle karar verilecek." Sonsuz inceleme süresi, sonsuz erteleme demektir.
- **Yorumları sınıflandırın**: Engelleyici (blocking) ve engelleyici olmayan (non-blocking) yorumu ayırın. Herkes her ayrıntıya itiraz hakkı istiyorsa hiçbir karar kapanmaz.
- **Yazar kararı sahiplenir**: Konsensüs beklemek yerine, RFC yazarı tüm görüşleri dinledikten sonra nihai kararı verir ve gerekçesini yazar. RFC bir oylama değil, bir karar kaydıdır.

## Kararı kayıt altına almak

RFC onaylandıktan sonra en sık yapılan hata, dokümanı öylece bırakmaktır. Kabul edilen RFC, kararın kalıcı kaydı olarak kalmalı — statüsü "Draft"tan "Accepted"a veya "Superseded"a güncellenmeli ve karar linki ilgili kod tabanına, wiki'ye veya proje takip aracına eklenmeli. Altı ay sonra "bu kararı neden aldık" sorusunu soran biri, Slack geçmişini kazmak yerine tek bir dokümana bakabilmeli.

## Şirket içi RFC vakalarının karşılaştırması

| Özellik | İlerleyen RFC | Tıkanan RFC |
|---|---|---|
| Non-goals bölümü | Var, net sınırlar çiziyor | Yok veya belirsiz |
| Seçenek sayısı | 2-3, "yapmama" dahil | Tek çözüm, alternatif yok |
| İnceleme penceresi | Belirli tarih | Süresiz açık |
| Yorum sınıflandırması | Blocking/non-blocking ayrımı var | Her yorum eşit ağırlıkta |
| Karar sahipliği | Yazar netleştirir | Konsensüs beklenir, hiç gelmez |
| Kapanış | Statü güncellenir, karar linklenir | Doküman sessizce terk edilir |

## Kaçınılması gereken anti-desenler

- **Çözüm-önce yazma**: RFC'yi zaten verilmiş bir kararı meşrulaştırmak için yazmak. Bu, tartışmayı sahte kılar ve gerçek geri bildirimi bastırır.
- **Non-goals'u atlamak**: Kapsam sınırı çizilmezse, herkes kendi endişesini RFC'ye ekler ve doküman asla bitmiyor.
- **Sınırsız kapsam**: Tek bir RFC'de hem mimariyi hem yol haritasını hem organizasyon yapısını çözmeye çalışmak. Kapsamı daraltın; ikinci bir RFC yazmak, birinciyi şişirmekten her zaman ucuzdur.
- **Jargon yığını**: Okuyucunun sizinle aynı bağlama sahip olduğunu varsaymak. Kısaltmaları ilk kullanımda açın, dahili sistem isimlerini bir cümleyle tanımlayın — aksi halde skim eden okuyucu ikinci paragrafta kopar.

Benim gözlemim şu: teknik olarak en doğru RFC'ler bile non-goals bölümü eksikse tıkanıyor, çünkü herkes kendi gündemini dokümana yüklemeye başlıyor. Sınır çizmek, fikrin kendisinden daha çok emek istiyor — ama karşılığı, gerçekten kapanan bir karar.

## RFC yazarken sık düşülen tuzak: kararı tek kişi verirken şeffaflığı kaybetmek

Yazarın kararı sahiplenmesi gerektiğini söylemek, kapalı kapılar ardında karar vermek anlamına gelmiyor. Sağlıklı bir süreçte, RFC yazarı gelen tüm itirazları dokümanın "Karar" bölümüne kısa notlar olarak ekler: "X önerisi değerlendirildi, şu nedenle reddedildi." Bu tek satırlık şeffaflık, aynı itirazın altı ay sonra tekrar gündeme gelmesini önlüyor — çünkü cevap zaten yazılı.

Bu alışkanlığın ikinci bir faydası daha var: yeni katılan bir ekip üyesi, altı ay önce neden belirli bir yaklaşımın reddedildiğini öğrenmek için kimseyi rahatsız etmek zorunda kalmıyor. Karar geçmişi dokümanın kendisinde duruyor, bu da onboarding sürecini de hızlandırıyor. Ekipler büyüdükçe bu fayda katlanarak artıyor; on kişilik bir ekipte sözlü hafıza yeterli olabilir, ama elli kişilik bir organizasyonda yazılı karar kaydı tek güvenilir kaynak haline gelir.

## Doldur-kullan şablon

```
# RFC: [Başlık]
Durum: Draft | Review | Accepted | Superseded
Yazar(lar):
Tarih:

## Bağlam
[Problem ne, neden şimdi]

## Hedefler
- ...
## Hedef Olmayanlar
- ...

## Seçenekler
### Seçenek A: [isim]
Maliyet / Risk / Fayda

### Seçenek B: [isim]
Maliyet / Risk / Fayda

## Karar
[Seçilen seçenek ve gerekçe]

## Riskler
- ...

## Rollout
[Aşamalar, geri alma planı]
```

RFC yazma alışkanlığı, Staff seviyesine giden yolda en yüksek kaldıraçlı sinyallerden biri olarak öne çıkıyor; bu bağlantıyı [Staff engineer yolu yazımızda](/tr/posts/staff-engineer-yolu) daha geniş ele aldık.

## Sıkça Sorulan Sorular

### Her teknik karar için RFC yazmalı mıyım?

Hayır. RFC'yi, kararın geri alınması pahalıysa, birden fazla ekibi etkiliyorsa veya uzun vadeli sonuçları varsa yazın. Düşük riskli, tek ekip kararları için bir Slack mesajı yeterli.

### RFC'de kaç seçenek sunmalıyım?

En az iki, tercihen üç — "yapmamak" seçeneğini de dahil edin. Tek seçenek sunan bir RFC genelde zaten verilmiş bir kararı meşrulaştırma girişimidir ve gerçek tartışmayı engeller.

### İnceleme süresi ne kadar olmalı?

Kararın etkisiyle orantılı, ama genelde bir-iki hafta yeterli. Sonsuz açık kalan bir inceleme penceresi, sonsuz erteleme anlamına gelir; net bir bitiş tarihi koyun.

### Kararı kim verir, konsensüs mü gerekir?

Konsensüs beklemek nadiren işe yarar. En sağlıklı model, RFC yazarının tüm geri bildirimi dinledikten sonra nihai kararı vermesi ve gerekçesini yazılı olarak kayıt altına almasıdır. RFC yazma alışkanlığını terfi sürecinize nasıl bağlayacağınızı [kariyer ve üretkenlik kategorimizde](/tr/category/kariyer-uretkenlik) bulabilirsiniz.
