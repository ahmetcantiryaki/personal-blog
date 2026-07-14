---
title: "pgrust: Postgres AI Ajanlarıyla Rust'a Nasıl Yazıldı"
slug: "pgrust-postgres-rust-yeniden-yazimi"
translationKey: "pgrust-postgres-rust-rewrite"
locale: "tr"
excerpt: "pgrust, sekiz yapay zeka ajanının 12 haftada yazdığı 450 bin satır Rust koduyla Postgres'in 46 bin testinin tamamını geçti. Peki bu üretime hazır mı?"
category: "software-engineering"
tags: ["databases", "sql", "open-source", "ai-coding", "software-architecture"]
publishedAt: "2026-07-14"
seoTitle: "pgrust Nedir? Postgres'in Rust'a Yeniden Yazımı"
seoDescription: "pgrust, Postgres'in 46.000+ regresyon testinin tamamını geçen bir Rust yeniden yazımı. Sekiz AI ajanı, 12 hafta, 450K satır kod — detaylar ve sınırlar."
---

Postgres Rust'a yeniden yazıldı mı? Evet — ama henüz üretime hazır değil. pgrust adlı proje, Temmuz 2026'da Postgres 18.3'ün 46.000'den fazla regresyon testinin tamamını geçerek Hacker News'te haftanın en çok konuşulan başlığı oldu. İşin asıl çarpıcı yanı ise kod tabanının nasıl yazıldığı: sekiz paralel yapay zeka ajanı, 12 haftada 450 bin satır Rust kodu üretti.

## pgrust nedir?

pgrust, eski Freshpaint CEO'su ve Heap'te petabayt ölçekli Postgres kümeleri işletmiş bir veritabanı veterani olan Michael Malis'in başlattığı bir proje. Amaç Postgres'i taklit eden yeni bir veritabanı yazmak değil; mevcut Postgres'in disk formatını ve tel protokolünü birebir konuşan, C yerine Rust'la yazılmış bir çekirdek üretmek. Proje [GitHub'da malisper/pgrust](https://github.com/malisper/pgrust) adıyla açık kaynak olarak yayında ve kod tabanı yaklaşık 98 MB Rust artı vendored Postgres test dosyalarından oluşuyor.

Buradaki kritik ayrım şu: pgrust, Postgres'in davranışını taklit eden bir "benzer" ürün değil, aynı disk dizininden doğrudan açılabilen ve aynı wire protokolünü konuşan bir ikame iddiasında. [Hacker News tartışmasında](https://news.ycombinator.com/item?id=48841676) 740 puan ve 620 yorum toplaması, topluluğun bu iddiayı ciddiye aldığını gösteriyor.

## 12 haftada 450 bin satır: sekiz yapay zeka ajanı nasıl çalıştı

pgrust'ı diğer "X'i Y dilinde yeniden yaz" projelerinden ayıran şey geliştirme hızı. Malis, sekiz paralel çalışan yapay zeka kodlama ajanını aynı anda kod tabanı üzerinde çalıştırarak 450 bin satırlık Rust kodunu yaklaşık 12 haftada üretti. Bu, geleneksel bir ekip için yıllar sürebilecek bir işin, agresif bir AI destekli geliştirme hattıyla çeyrek yıla sıkıştırılması anlamına geliyor.

Bu yaklaşımın sonucu, ajanların ürettiği kodun Postgres'in kendi regresyon test paketiyle sürekli doğrulanması oldu: 46.000'den fazla sorgu, beklenen çıktıyla birebir eşleşti. Bu ölçekte bir doğrulama seti olmasaydı, sekiz ajanın paralel ürettiği kodun tutarlılığını insan gözüyle denetlemek pratik olarak imkânsız olurdu. [AI kod asistanı kullanırken yapılan hatalar üzerine yazımızda](/tr/posts/ai-kod-asistani-hatalari) da vurguladığımız gibi, AI'ın hızını güvenilir kılan şey her zaman altındaki test disiplinidir.

## Postgres'in "dört atlısı" ve pgrust'ın çözüm iddiası

Malis, projeye başlama motivasyonunu Postgres'in kronik dört sorunu olarak tanımlıyor: VACUUM kaynaklı kesintiler, transaction ID taşması (wraparound), bağlantı limitleri ve JSONB'nin performans sınırları. Bunların hepsi, Postgres'in otuz yıllık C mimarisinin miras aldığı tasarım kararlarından kaynaklanıyor.

pgrust'ın mimari iddiaları şunlar:

- **Thread-per-connection modeli**: Postgres'in process-per-connection mimarisinin yerine, bağlantı başına ayrı işletim sistemi süreci açmak yerine hafif thread'ler kullanarak bağlantı ölçeklenebilirliğini artırmayı hedefliyor.
- **Native disk uyumluluğu**: Mevcut bir Postgres veri dizininden doğrudan başlatılabiliyor; yani veri göçü gerekmiyor.
- **OrioleDB entegrasyonu planı**: Depolama katmanındaki sınırları aşmak için beta aşamasındaki OrioleDB'nin gelecekte pgrust'a entegre edilmesi planlanıyor.

## Performans iddiaları ve gerçekçi sınırlar

Erken kıyaslamalarda analitik sorgularda ClickHouse'a yaklaşan iddialar dolaşıyor olsa da, Malis kendisi v0.1 sürümünün ne üretime hazır ne de performans için optimize edilmiş olduğunu açıkça belirtiyor. PL/Python, PL/Perl ve PL/Tcl gibi prosedürel diller henüz desteklenmiyor; contrib modüllerinin bir kısmı taşınmış durumda ama hepsi değil.

| Boyut | Postgres (C) | pgrust v0.1 |
|---|---|---|
| Regresyon testi geçme oranı | Referans (%100) | %100 (46.000+ sorgu) |
| Bağlantı modeli | Process-per-connection | Thread-per-connection |
| Disk formatı uyumluluğu | — | Mevcut Postgres dizininden açılabilir |
| Prosedürel dil desteği | Tam (PL/pgSQL, PL/Python, PL/Perl, PL/Tcl) | Sınırlı, bazı contrib modülleri eksik |
| Üretime hazırlık | Olgun, 30 yıllık | Hayır — yazarın kendi ifadesiyle deneysel |
| Geliştirme süresi | Onlarca yıl | ~12 hafta |

Bu tablo aslında bir uyarı niyeti taşıyor: %100 test geçme oranı, "işlevsel olarak eşdeğer" anlamına gelir, "üretimde güvenilir" anlamına gelmez. Uzun süreli yük altında kilitlenme davranışı, bellek güvenliği avantajlarının gerçek dünya kazanımlara dönüşüp dönüşmediği ve topluluk desteğinin oluşup oluşmayacağı hâlâ açık sorular.

## Bu neden AI destekli yazılım geliştirme için önemli

Benim görüşüm şu: pgrust'ın asıl haber değeri veritabanı performansında değil, ne tür yazılım projelerinin artık AI ajan filolarıyla makul bir sürede denenebilir hale geldiğinde yatıyor. Otuz yıllık, 46.000 test senaryosuna sahip bir sistemi 12 haftada yeniden yazmak birkaç yıl önce akıl almazdı; bugün bir kanıt-kavram (proof of concept) olarak masada. Bu, [TypeScript 7'nin Go ile yeniden yazılmasıyla](/tr/posts/typescript-7-go-derleyici) başlayan "kritik altyapıyı hızlı bir dilde yeniden yaz" trendinin bir sonraki, daha radikal adımı: artık insan mühendislik ekibi darboğaz olmaktan çıkıyor, darboğaz test kapsamı ve doğrulama hızı oluyor.

Bu da geliştirme ekipleri için pratik bir sonuç doğuruyor: eğer sisteminizin kapsamlı bir regresyon test paketi yoksa, AI ajanlarının hızından faydalanamazsınız — çünkü doğrulayacak bir zemin olmaz. pgrust'ın hikâyesi aslında testin, AI çağında eskisinden daha kritik hale geldiğinin kanıtı.

## Diğer Rust-Postgres projeleriyle karışmasın

pgrust'ı değerlendirirken karıştırılmaması gereken iki komşu proje var. Birincisi `pgrx`: bu, Postgres'i yeniden yazmıyor, Postgres eklentilerini Rust'la yazmayı sağlayan olgun bir çerçeve ve aktif olarak bakımı sürüyor. İkincisi OrioleDB: Postgres'in depolama motorunu değiştirmeyi hedefleyen, hâlâ beta aşamasındaki ayrı bir proje. pgrust'ın gelecek planlarında OrioleDB'yi depolama katmanı olarak entegre etmek var, ama bu henüz gerçekleşmedi. Yani bugün üç farklı olgunluk seviyesinde üç farklı proje konuşuyoruz — hepsini aynı sepete koymak yanıltıcı olur.

## Ekibiniz için pratik bir karar çerçevesi

pgrust'ı bugün nasıl değerlendirmeniz gerektiğine dair üç soru:

1. **Sisteminizin kapsamlı bir regresyon test paketi var mı?** Yoksa, pgrust'ın hikâyesinden çıkaracağınız ders AI hızından çok test disiplini kurmak olmalı.
2. **PL/Python, PL/Perl veya PL/Tcl kullanıyor musunuz?** Kullanıyorsanız pgrust şu an sizin için bir seçenek değil.
3. **Deneysel bir projeyi izole bir ortamda denemeye değer mi?** pgrust'ı bir geliştirme veya test ortamında çalıştırıp disk uyumluluğunu gözlemlemek, üretime taşımadan önce makul bir ilk adım.

Bu üç soruya verdiğiniz cevaplar, pgrust'ı izlemeye mi yoksa şimdilik göz ardı etmeye mi karar vereceğinizi netleştirir.

## Dürüst sınırlar

pgrust'ı bugün prodüksiyonda çalıştırmak sorumsuzluk olur. Eksik prosedürel dil desteği, optimize edilmemiş performans profili ve henüz oluşmamış bir operasyon deneyimi (yedekleme, replikasyon, izleme araçlarıyla uyumluluk) göz önüne alındığında, proje şu an için bir araştırma ve kavram kanıtlama çalışması. Postgres'in kendisini farklı iş yüklerine nasıl uyarladığını [her şey için Postgres yazımızda](/tr/posts/her-sey-icin-postgres) ve indeksleme kararlarının performansa etkisini [veritabanı indeksleme rehberimizde](/tr/posts/veritabani-indeksleme) daha ayrıntılı ele aldık.

## Sıkça Sorulan Sorular

### pgrust üretimde kullanılabilir mi?

Hayır. Yazarın kendisi v0.1 sürümünün ne üretime hazır ne de performans için optimize edilmiş olduğunu belirtiyor. PL/Python, PL/Perl ve PL/Tcl gibi prosedürel diller desteklenmiyor ve bazı contrib modülleri eksik.

### pgrust gerçekten mevcut bir Postgres veritabanını açabiliyor mu?

Evet, proje disk formatı ve wire protokolü düzeyinde uyumluluk iddia ediyor; yani mevcut bir Postgres veri dizininden doğrudan başlatılabiliyor ve aynı istemcilerle (psql dahil) konuşabiliyor. Bu, veri göçü olmadan denenebilmesini sağlıyor.

### Sekiz AI ajanının paralel kod yazması güvenilir mi?

Bu senaryoda güvenilirliği sağlayan şey ajanların kendisi değil, Postgres'in 46.000'den fazla sorgudan oluşan regresyon test paketi. Ajanlar hızla kod üretti, ama her değişiklik bu kapsamlı test setiyle sürekli doğrulandı. Kapsamlı test olmadan bu ölçekte bir paralel AI geliştirme süreci pratik olarak denetlenemezdi.

### pgrust, Postgres'in yerini alacak mı?

Kısa vadede hayır. Proje henüz deneysel ve eksiksiz prosedürel dil desteğinden yoksun. Ama disk ve protokol uyumluluğu sayesinde, gelecekte belirli iş yükleri için (örneğin yüksek bağlantı sayısı gerektiren senaryolarda) bir alternatif olma potansiyeli taşıyor.
