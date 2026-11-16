---
title: "Kafka mı Gerek, Yoksa İş Tablosu mu?"
slug: "is-kuyrugu-mu-kafka-mi"
translationKey: "job-queue-vs-kafka-small-teams-2026"
locale: "tr"
excerpt: "Kısa cevap: çoğu ekip Kafka'ya değil, basit bir Postgres iş tablosuna ihtiyaç duyar; Kafka yalnızca fan-out veya replay gerektiğinde devreye girer."
category: "software-engineering"
tags: ["postgresql", "system-design", "backend", "databases"]
publishedAt: "2026-11-16"
seoTitle: "Kafka mı, İş Tablosu mu? Karar Rehberi"
seoDescription: "Postgres'te FOR UPDATE SKIP LOCKED ile kurulan iş tablosu, çoğu ekibe Kafka'dan önce yeter. Ne zaman gerçekten broker gerekir, ne zaman gerekmez."
---

Kısa cevap: Hayır, çoğu ekibin Kafka'ya ihtiyacı yok. Postgres'te `FOR UPDATE SKIP LOCKED` kullanan basit bir "jobs" tablosu, güvenli eşzamanlı kuyruk işleme, yeniden deneme ve sıralama garantisi veriyor; bunu zaten çalıştırdığınız veritabanıyla kuruyorsunuz. Kafka'ya asıl gerek, birden fazla bağımsız tüketiciye yayın yapmanız (fan-out), geçmiş olayları yeniden oynatmanız (replay) veya tek bir Postgres örneğinin kaldıramayacağı sürekli yüksek hacme çıktığınızda başlıyor.

## İş tablosu gerçekte ne veriyor?

Bir "jobs" tablosu, sırada bekleyen işleri satır olarak tutar; her satırın bir durumu (`pending`, `processing`, `done`, `failed`), deneme sayısı ve kilitleme zaman damgası vardır. Worker'lar bu tablodan `SELECT ... FOR UPDATE SKIP LOCKED` ile satır çeker: bir worker bir satırı kilitlediğinde, diğer worker'lar o satırı atlayıp bir sonraki boş satıra geçer, böylece hiçbir worker kilitli satırın arkasında bloke olmaz. Bu, ayrı bir mesaj aracısı kurmadan elde ettiğiniz, gerçek eşzamanlı ve güvenli bir dequeue mekanizması.

```sql
CREATE TABLE jobs (
  id BIGSERIAL PRIMARY KEY,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  attempts INT NOT NULL DEFAULT 0,
  run_after TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_jobs_claimable ON jobs (run_after)
  WHERE status = 'pending';

-- Her worker döngüsünde çalışan dequeue sorgusu
WITH claimed AS (
  SELECT id FROM jobs
  WHERE status = 'pending' AND run_after <= now()
  ORDER BY run_after
  LIMIT 1
  FOR UPDATE SKIP LOCKED
)
UPDATE jobs SET status = 'processing', attempts = attempts + 1
WHERE id IN (SELECT id FROM claimed)
RETURNING id, payload;
```

`pending` durumundaki satırlar için kısmi bir indeks (`WHERE status = 'pending'`) eklemek kritik: tablo büyüdükçe dequeue sorgusunun tüm tabloyu taramasını önlüyor. Bu desenin pratikteki en büyük tuzağı, bu indeksin unutulması ve tablo milyonlarca tamamlanmış satırla büyüdükten sonra dequeue'nun yavaşlaması.

## Yeniden deneme ve dead-letter nasıl kurulur?

Bir iş başarısız olduğunda `attempts` sütununu artırıp `run_after`'ı üstel geri çekilme (exponential backoff) ile ileri atıyorsunuz: ilk tekrar 10 saniye sonra, ikinci 40 saniye sonra, üçüncü birkaç dakika sonra. `attempts` belirli bir eşiği (örneğin 5) geçtiğinde satırı `failed` durumuna çekip ayrı bir `dead_letter_jobs` tablosuna taşıyorsunuz; bu, hatalı işlerin sürekli kuyruğu tıkamasını önlüyor ve hata ayıklamak için ayrı bir yer veriyor. Bu üç sütun — durum, deneme sayısı, bir sonraki çalışma zamanı — [idempotent API tasarımının](/tr/posts/idempotent-api-tasarimi) temel prensibiyle birleştiğinde (her işin benzersiz bir anahtarla tekrar çalıştırılabilir olması), tekrarlı işlemenin veriyi bozmayacağından emin olursunuz.

## Bir iş tablosu saniyede kaç iş işleyebilir?

Kasım 2026 itibarıyla yayınlanan pratisyen ölçümleri birbirinden epey farklı: bir testte Postgres 16 üzerinde 8 worker'la saniyede yaklaşık 12.000 iş, RabbitMQ'da yaklaşık 25.000, Kafka'da 100.000'in üzerinde ölçülmüş; başka bir testte Postgres dakikada sadece 850 iş işlerken Redis tabanlı BullMQ 920'ye çıkmış. Bu fark donanım, batch boyutu ve iş yüküne göre değişiyor, dolayısıyla tek bir "doğru" sayı yok. Küçük ve orta ölçekli ekipler için gerçekçi beklenti, saniyede binlerce işi rahatça kaldırabilmek; bu seviyeye ulaşmadan önce Kafka'nın karmaşıklığını üstlenmek genellikle erken bir optimizasyon.

## Kafka'ya gerçekten ne zaman ihtiyaç duyarsınız?

Kafka'nın asıl değeri üç durumda ortaya çıkıyor: birden fazla bağımsız servisin aynı olayı farklı amaçlarla tüketmesi gerektiğinde (fan-out), geçmiş olayları yeniden oynatmanız gerektiğinde (örneğin yeni bir analitik servisini sıfırdan beslemek için), ya da sürekli olarak saniyede on binlerce mesajı tek bir Postgres örneğinin kaldıramayacağı seviyede işlemeniz gerektiğinde. Bu üçü de gerçek gereksinimler; ama çoğu ekip bu seviyeye hiç ulaşmadan Kafka'yı "ileride gerekecek" diye kuruyor.

## Kafka'yı çalıştırmanın operasyonel maliyeti ne?

Kafka'yı üretimde çalıştırmak, partition sayısını doğru planlamayı, consumer group rebalancing'in sebep olduğu geçici duraklamaları yönetmeyi ve (KRaft moduna geçmiş olsanız da) broker'ların kendisini izlemeyi gerektiriyor. Bu, arka planda sessizce çalışan bir veritabanından çok daha fazla operasyonel yük demek; genellikle bunu düzgün işletmek için en az yarı zamanlı bir platform mühendisi gerekiyor. [Event-driven mimarinin tuzaklarına](/tr/posts/olay-gudumlu-mimari-desenler-tuzaklar) bakıldığında, bu karmaşıklığın çoğu, gerçek bir fan-out ihtiyacı olmadan sadece "ölçeklenebilir görünmek" için üstlenilmiş oluyor.

| Kriter | İş tablosu (Postgres) | RabbitMQ | Kafka |
|---|---|---|---|
| Kurulum maliyeti | Mevcut veritabanı, ek servis yok | Ayrı broker | Broker + partition + rebalancing yönetimi |
| Sıralama garantisi | Satır bazlı, basit | Kuyruk bazlı | Partition bazlı |
| Fan-out (çoklu tüketici) | Zayıf, elle kurulur | Orta | Yerleşik, güçlü |
| Olay replay | Yok (satır silinince biter) | Sınırlı | Retention süresine kadar tam replay |
| Gerçekçi tek-düğüm verimi | Binlerce iş/sn | On binlerce mesaj/sn | Yüz binlerce mesaj/sn |
| Gereken operasyon bilgisi | Mevcut SQL bilgisi yeterli | Orta | Partition/rebalancing uzmanlığı |

## Hangi durumda hangi araç seçilir?

Aşağıdaki kontrol listesi, gereksinimi doğrudan en basit araca eşliyor:

- **Tek bir servis, tek tüketici, orta hacim** → İş tablosu yeterli, ek bağımlılık eklemeyin.
- **Birden fazla bağımsız servis aynı olayı tüketecek** → Kafka ya da RabbitMQ'nun topic/exchange modeli gerçekten gerekli.
- **Geçmiş olayları yeniden oynatmanız gerekiyor** → Kafka'nın retention'ı bunu çözüyor; Postgres'te bunu elle simüle etmek karmaşıklaşır.
- **Saniyede on binlerce mesajı sürekli işliyorsunuz** → Tek Postgres örneği bu noktada zorlanır, broker'a geçiş gerçek bir ihtiyaç.
- **Hiçbiri yoksa ama "büyüyeceğiz" diye kuruyorsanız** → Bu, resume'de iyi görünen ama bakım yükü yaratan bir karardır; önce iş tablosuyla başlayıp ölçüm verisiyle karar değiştirin.

Açıkçası kişisel görüşüm şu: "Kafka'da ölçeklendik" yazılarının çoğu, bunu çalıştıracak mühendislik ekibine sahip şirketler tarafından yazılıyor; siz büyük ihtimalle o şirket değilsiniz, ve [her şey için Postgres kullanma yaklaşımı](/tr/posts/her-sey-icin-postgres) bu farkın tam olarak nerede durduğunu gösteriyor.

## Production'a almadan önce ne test etmelisin?

İş tablosunu production'a almadan önce üç senaryoyu bilerek test etmek gerekiyor: eşzamanlılık, worker çökmesi ve görünürlük. Eşzamanlılık testi için aynı anda 10-20 worker başlatıp aynı satırların iki kez işlenmediğini doğrula; `SKIP LOCKED` doğru kurulduysa her satır tam olarak bir worker'a gider. Worker çökmesi testi için bir worker'ı satırı `processing` durumuna çektikten hemen sonra öldür ve o satırın sonsuza kadar kilitli kalmadığını kontrol et — bunun için `processing` durumundaki satırlara da bir zaman aşımı (örneğin beş dakika) koyup, bu süreyi aşan satırları periyodik bir işle yeniden `pending`'e çekmek gerekiyor; aksi halde çöken bir worker'ın satırı kimse tarafından devralınmaz.

Görünürlük tarafında ise en az şu üç metriği izlemelisin: kuyrukta bekleyen (`pending`) satır sayısı, en eski bekleyen satırın yaşı ve `failed` duruma düşen satır oranı. Bekleyen satır sayısı sürekli artıyorsa worker sayın işin geliş hızına yetişmiyor demektir; bu durumda broker'a geçmek yerine önce worker sayısını artırmak genellikle yeterli oluyor. Bu üç metrik, Kafka'ya geçmeden önce "gerçekten darboğaz nerede" sorusuna Postgres içinden, hiçbir yeni araç eklemeden cevap vermeni sağlıyor.

## Sıkça Sorulan Sorular

### Postgres'i kuyruk olarak kullanmak güvenli mi?

Evet, `FOR UPDATE SKIP LOCKED` ile kurulan bir iş tablosu, eşzamanlı worker'ların aynı satırı iki kez işlemesini engelliyor ve kısmi indeks eklenirse binlerce iş/saniye seviyesinde güvenle çalışıyor. Asıl risk, tamamlanmış satırların silinmemesi ve tablonun büyüyüp autovacuum yükünü artırmasıdır; eski satırları düzenli arşivlemek bu sorunu çözer.

### SKIP LOCKED olmadan FOR UPDATE kullanılırsa ne olur?

`SKIP LOCKED` olmadan bir worker kilitli bir satıra denk geldiğinde, kilit açılana kadar bekler; bu da worker'ların birbirinin arkasında sıraya girmesine (serileşmesine) yol açar. `SKIP LOCKED` eklendiğinde worker kilitli satırı atlayıp bir sonraki boş satırı alır, böylece gerçek eşzamanlılık sağlanır.

### Ne zaman Postgres'ten Kafka'ya geçiş yapmalıyım?

Geçiş noktası net bir metrikle belirlenmeli: birden fazla bağımsız servisin aynı veriyi tüketmesi gerektiğinde, geçmiş olayları yeniden oynatma ihtiyacı doğduğunda veya ölçümleriniz tek Postgres örneğinin dequeue sorgusunda darboğaz oluşturduğunu gösterdiğinde. Bu sinyaller yoksa geçiş, erken bir karmaşıklık maliyetidir.

### RabbitMQ, Postgres ile Kafka arasında iyi bir orta yol mu?

Evet, RabbitMQ'nun exchange/queue modeli fan-out'u Kafka'dan daha az kurulum yüküyle sağlıyor ama kalıcı olay replay'i Kafka seviyesinde değil. Sadece fan-out gerekip replay gerekmiyorsa, RabbitMQ genellikle Kafka'dan daha hafif bir seçim.

**Kaynaklar:** [PostgreSQL SKIP LOCKED iş kuyruğu deseni](https://kindatechnical.com/postgresql/postgresql-as-a-job-queue-skip-locked-pattern.html), [Postgres kuyruklarını mesaj kuyruğuyla değiştirme karşılaştırması](https://dev.to/software_mvp-factory/replacing-your-message-queue-with-postgresql-listennotify-skip-locked-queues-and-when-kafka-is-khb).
