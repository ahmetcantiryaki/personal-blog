---
title: "Veritabanı Yedekleme ve Felaket Kurtarma"
slug: "veritabani-yedekleme-ve-felaket-kurtarma"
translationKey: "database-backup-disaster-recovery"
locale: "tr"
excerpt: "RPO/RTO hedefleri, WAL ile point-in-time recovery, 3-2-1 kuralı ve hiç kimsenin yapmadığı restore tatbikatları: test edilmemiş bir yedek, yedek değildir."
category: "devops-cloud"
tags: ["databases", "postgresql", "cloud", "reliability"]
publishedAt: "2026-08-03"
seoTitle: "Veritabanı Yedekleme ve Felaket Kurtarma Kontrol Listesi"
seoDescription: "RPO/RTO hedefleri, WAL ile point-in-time recovery, 3-2-1 kuralı ve hiç kimsenin yapmadığı restore tatbikatları: test edilmemiş bir yedek, yedek değildir."
---

Test edilmemiş bir yedek, yedek değildir — sadece disk üzerinde iyimserliktir. Bu yazı, bir olay anında gerçekten işe yarayan bir yedekleme ve felaket kurtarma stratejisini kurmak için gereken dört parçayı ele alıyor: RPO/RTO hedefleri, doğru yedek türü, 3-2-1 kuralı ve — çoğu ekibin atladığı kısım — restore tatbikatları.

## RPO ve RTO: Önce Hedefi Sayıyla Tanımlayın

Herhangi bir yedekleme mimarisi kurmadan önce iki sayıya ihtiyacınız var. RPO (Recovery Point Objective), bir olayda kaybetmeyi göze aldığınız maksimum veri miktarını zaman cinsinden tanımlar — "son 5 dakikayı kaybedebiliriz" gibi. RTO (Recovery Time Objective) ise sistemi tekrar ayağa kaldırmak için kabul edilebilir maksimum süredir — "2 saat içinde tekrar çevrimiçi olmalıyız" gibi.

| Hedef | Soru | Tipik Değer (SaaS) | Mimari Etkisi |
| --- | --- | --- | --- |
| RPO | Ne kadar veri kaybını göze alırız? | 5-15 dakika | Sürekli WAL arşivleme gerektirir |
| RTO | Ayağa kalkmak ne kadar sürebilir? | 1-4 saat | Otomatik restore ve hazır standby gerektirir |

Bu iki sayı belirlenmeden "günlük yedek alıyoruz" demek anlamsız bir cümledir — günlük yedek, 24 saatlik bir RPO'ya karşılık gelir ve çoğu üretim iş yükü için bu kabul edilemez.

## Mantıksal mı Fiziksel mi: PITR Nasıl Çalışır

Mantıksal yedekler (`pg_dump` gibi) veriyi SQL komutları veya taşınabilir bir formatta dışa aktarır; okunması kolaydır ama büyük veritabanlarında yavaştır ve tek başına yalnızca alındığı ana geri dönüşü sağlar. Fiziksel yedekler ise disk üzerindeki dosyaların ham kopyasıdır — daha hızlı alınır ve geri yüklenir, ama veritabanı motoruna özgüdür.

Asıl güç, fiziksel bir temel yedeği (base backup) sürekli WAL (Write-Ahead Log) arşivlemesiyle birleştiren point-in-time recovery'de (PITR) yatıyor. [PostgreSQL'in resmi dokümantasyonuna göre](https://www.postgresql.org/docs/current/continuous-archiving.html) bu kombinasyon, veritabanını saniye hassasiyetinde herhangi bir ana geri döndürmenizi sağlar — WAL segmentlerini temel yedeğin üzerine yeniden oynatarak. Kritik nokta şu: WAL arşivleme prosedürünü test etmeden önce ilk temel yedeğinizi almayın; arşivleme izlenmezse yedek eksik kalır ve restore anında bunu fark edersiniz — en kötü zamanda.

```bash
# Sürekli arşivleme için postgresql.conf
archive_mode = on
archive_command = 'pgbackrest --stanza=main archive-push %p'
wal_level = replica
```

## 3-2-1 Kuralı: Offsite ve Değiştirilemez Kopyalar

3-2-1 kuralı basit ve hâlâ geçerli: verinin **3** kopyası, **2** farklı ortamda, **1**'i site dışında (offsite) tutulur. 2026'da buna bir dördüncü katman eklemek şart: [CISA'nın fidye yazılımı rehberine göre](https://www.cisa.gov/stopransomware) ransomware saldırılarının yedekleri de hedef aldığı bir dünyada, en az bir kopyanın **immutable** (değiştirilemez/silinemez) olması gerekiyor — [object lock](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html) veya WORM (write-once-read-many) depolama ile.

| Katman | Örnek | Amaç |
| --- | --- | --- |
| Kopya 1 | Üretim veritabanı | Canlı sistem |
| Kopya 2 | Aynı bölgede farklı disk/volume | Hızlı geri yükleme |
| Kopya 3 (offsite) | Farklı bölge/bulut sağlayıcı | Bölgesel felaket koruması |
| Immutable ek katman | Object lock'lı bucket (ör. S3 Object Lock) | Ransomware'e karşı son savunma |

Şifreleme, bu katmanların hepsinde zorunlu — hem aktarım sırasında (TLS) hem bekleme sırasında (at-rest encryption). Erişim kontrolü de aynı derecede kritik: yedekleme sistemine erişimi olan bir kimlik bilgisi sızarsa, saldırgan hem üretim verinizi hem kurtarma yolunuzu aynı anda ele geçirebilir — bu yüzden yedekleme kimlik bilgileri, üretim veritabanı kimlik bilgilerinden ayrı, en az ayrıcalık prensibiyle yönetilmeli.

Pratikte bu, yedekleme servisine yazma izni olan kimliğin okuma veya silme izni taşımaması, silme işleminin ise ayrı, çok faktörlü onay gerektiren bir role bağlanması anlamına gelir. Bu ayrım, bir CI/CD kimlik bilgisi sızsa bile saldırganın mevcut yedekleri silememesini garanti eder.

## Bulut Sağlayıcı Araçları: Yönetilen mi, Kendin mi Kur

Çoğu ekip için gerçek soru "3-2-1 kuralını nasıl uygularım" değil, "bunu yönetilen bir servisle mi yoksa kendi script'lerimle mi kurarım" sorusu. AWS Backup, Google Cloud'un otomatik yedekleme politikaları veya Azure Backup gibi yönetilen servisler, WAL arşivleme ve retention politikasını sizin adınıza yönetir — bedeli, ince taneli kontrolün bir kısmını kaybetmeniz. Kendi pgBackRest veya WAL-G kurulumunuz, tam kontrol sağlar ama izleme ve alarm sorumluluğunu size yükler. Pratik kural şu: ekibinizde adanmış bir platform/DevOps kapasitesi yoksa yönetilen servisle başlayın; ölçek büyüdükçe ve maliyet optimizasyonu öncelik haline geldikçe kendi kurulumunuza geçmeyi değerlendirin.

## Herkesin Atladığı Kısım: Restore Tatbikatları

Bir yedekleme stratejisinin gerçek testi, yedeği almak değil geri yüklemektir. Sahada gördüğümüz en yaygın hata: aylarca "yedekler başarıyla alındı" bildirimi gören bir ekibin, gerçek bir olayda WAL arşivinde bir boşluk olduğunu ya da restore script'inin altı ay önce kırıldığını fark etmesi. Düzenli restore tatbikatı (game day) olmadan bir yedekleme stratejisi, test edilmemiş bir varsayımdır.

Pratik bir tatbikat rutini şöyle görünür: ayda bir, üretim yedeğini izole bir ortama geri yükleyin, uygulamayı o ortamda ayağa kaldırın ve temel bir smoke test çalıştırın. Bu, hem restore süresinin gerçek RTO'nuzla uyuşup uyuşmadığını hem de yedeğin gerçekten bütün olduğunu doğrular. Bu tatbikatları izlenebilir hale getirmek için [observability 101 rehberimizdeki](/tr/posts/observability-nedir) log, metrik ve trace ayrımından faydalanabilirsiniz.

## Ağustos 2026'da Neyi Değiştirmeli

Bu ayın başında birçok ekibin gündeminde olan bir konu var: bulut sağlayıcılarının çoğu artık object lock'lı immutable depolamayı standart katmanlarında sunuyor, ek maliyet çoğu zaman aylık birkaç dolar seviyesinde kalıyor. Eğer immutable katmanınız hâlâ yoksa, bunu bu ayki en ucuz ve en yüksek etkili güvenlik yatırımı olarak değerlendirebilirsiniz.

Şema tasarımı ve migrasyon disiplinini de bu resme eklemek isteyenler [kesintisiz şema migrasyonları rehberimize](/tr/posts/kesintisiz-sema-migrasyonlari), bağlantı havuzlama tarafını merak edenler [PgBouncer ile bağlantı havuzu yazımıza](/tr/posts/pgbouncer-postgres-baglanti-havuzu) bakabilir. Kategorideki diğer içerikler için [DevOps & Bulut bölümümüzü](/tr/category/devops-bulut) takip edebilirsiniz.

## Üç Aylık Restore Tatbikat Kontrol Listesi

1. Üretim yedeğinin (temel yedek + WAL arşivi) izole bir ortama geri yüklenmesini otomatikleştirin.
2. Restore süresini ölçün ve tanımlı RTO ile karşılaştırın.
3. Geri yüklenen veritabanında satır sayımı veya checksum ile bütünlük doğrulaması yapın.
4. Uygulamayı geri yüklenen veritabanına bağlayıp temel bir smoke test çalıştırın.
5. Sonuçları belgeleyin; RTO/RPO hedeflerinin altında kalan her adımı bir sonraki tatbikattan önce düzeltin.
6. Immutable kopyanın gerçekten değiştirilemez olduğunu (object lock politikasını) çeyrekte bir kez manuel doğrulayın.

## Sıkça Sorulan Sorular

### RPO ve RTO arasındaki fark nedir?

RPO, bir olayda kabul edilebilir maksimum veri kaybını zaman cinsinden tanımlar (örneğin son 5 dakika); RTO ise sistemi tekrar çalışır hale getirmek için kabul edilebilir maksimum süredir (örneğin 2 saat). İkisi birlikte yedekleme sıklığınızı ve mimarinizi belirler.

### Point-in-time recovery için WAL arşivleme neden şart?

Yalnızca periyodik temel yedeklere güvenmek, iki yedek arasındaki tüm değişiklikleri riske atar. Sürekli WAL arşivleme, temel yedeğin üzerine değişiklikleri yeniden oynatarak veritabanını saniye hassasiyetinde herhangi bir ana geri döndürmenizi sağlar.

### 3-2-1 kuralına immutable kopya neden eklenmeli?

Modern ransomware saldırıları, saldırganın erişebildiği yedekleri de şifreleyip siliyor. Object lock veya WORM depolamayla değiştirilemez hale getirilmiş en az bir kopya, saldırgan yedekleme sisteminize erişim sağlasa bile son bir kurtarma yolu bırakır.

### Restore tatbikatı ne sıklıkla yapılmalı?

Kritik üretim sistemleri için ayda bir, daha az kritik sistemler için üç ayda bir makul bir sıklık. Önemli olan, tatbikatın gerçek RTO'nuzu ölçmesi ve sonuçlarının belgelenip bir sonraki tatbikata kadar düzeltilmesi; belgelenmeyen bir tatbikat, tekrarlanabilir bir süreç değil tek seferlik bir şans eseridir.
