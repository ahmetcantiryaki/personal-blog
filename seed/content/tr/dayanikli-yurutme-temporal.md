---
title: "Dayanıklı Yürütme ve Temporal'a Ne Zaman Gerek?"
slug: "dayanikli-yurutme-temporal"
translationKey: "durable-execution-temporal-2026"
locale: "tr"
excerpt: "Kısa cevap: Süreciniz saatler-günler sürüyor, çökme sonrası kaldığı yerden devam etmesi şartsa Temporal'a değer; birkaç adımlık işler için cron ve kuyruk yeter."
category: "software-engineering"
tags: ["software-architecture", "reliability", "workflow", "system-design"]
publishedAt: "2026-09-18"
seoTitle: "Dayanıklı Yürütme Nedir? Temporal'a Ne Zaman Gerek"
seoDescription: "Kısa cevap: Süreciniz saatler-günler sürüyor, çökme sonrası kaldığı yerden devam etmesi şartsa Temporal'a değer; birkaç adımlık işler için cron ve kuyruk yeter."
---

Kısa cevap: Sipariş işleme, onay akışı veya çok adımlı bir AI ajanı gibi saatlerce hatta günlerce süren, arada çökebilecek bir süreciniz varsa ve bu süreç kaldığı adımdan devam etmek zorundaysa dayanıklı yürütme (durable execution) modeli ve Temporal gibi bir motor işe yarıyor. İki-üç adımlık basit bir arka plan işiniz varsa cron + kuyruk + outbox kombinasyonu, Temporal'ın operasyonel ağırlığından çok daha ucuza aynı sonucu veriyor.

## Dayanıklı yürütmenin çözdüğü hata modu nedir?

Dayanıklı yürütme, uzun süren, çok adımlı bir iş sürecinin bir sunucu çökmesi, deploy veya yeniden başlatma sonrasında kaldığı adımdan devam edebilmesini garanti eden bir programlama modelidir. Klasik yaklaşımda bir süreç ortasında kesilirse, o sürecin nerede kaldığını veritabanı tablolarından veya durum makinesi bayraklarından yeniden inşa etmek geliştiriciye kalıyor — bu hem hataya açık hem de her yeni iş akışı için tekrar tekrar yazılan bir muhasebe kodu anlamına geliyor.

Durable execution motorları bu muhasebeyi platforma taşıyor: iş akışını normal kod olarak yazarsınız, motor her adımı bir olay günlüğüne (event history) kaydeder ve bir çökme sonrası o günlüğü yeniden oynatarak (replay) süreci kaldığı yerden devam ettirir. Sonuç, geliştiricinin "bu adım daha önce çalıştı mı, tekrar mı çalıştırmalıyım" sorusunu elle çözmesine gerek kalmaması.

## Determinizm kuralı ne anlama geliyor, neden önemli?

Dayanıklı yürütmenin bedeli, iş akışı kodunuzun deterministik olması gerekliliği — yani aynı girdiyle her çalıştırıldığında birebir aynı sırayla aynı kararları vermesi lazım, çünkü motor çökme sonrası kodu gerçekten yeniden çalıştırarak (replay ederek) son duruma ulaşıyor. Bu kısıtlama tip sistemi tarafından zorlanmıyor: iş akışı içinde `Date.now()` veya rastgele bir sayı üretici çağırabilirsiniz, testleriniz geçer, ama haftalar sonra bir replay'de farklı bir değer üretip süreci bozabilir.

Bu yüzden Temporal gibi motorlar, zaman, rastgelelik ve dış sistem çağrıları gibi deterministik olmayan işlemleri "Activity" adı verilen ayrı, yeniden denenebilir birimlere taşımanızı zorunlu kılıyor; iş akışının kendisi sadece hangi Activity'nin ne zaman çağrılacağına karar veren deterministik mantığı içeriyor. Determinizm ihlalini fark etmek genelde kolay değil çünkü hatayı üreten replay, orijinal çalıştırmadan haftalar sonra gerçekleşebiliyor.

Bu, ekibimizin gördüğü en yaygın Temporal hatası: bir geliştirici iş akışı fonksiyonunun içine sıradan bir HTTP çağrısı veya sistem saati okuması ekliyor, kod code review'dan geçiyor, testler yeşil, üç hafta sonra bir worker yeniden başlatıldığında replay farklı bir sonuç üretip iş akışını "stuck" durumuna sokuyor. Determinizm kuralına baştan disiplinli yaklaşmak, bu tür hataları prod'da debug etmekten çok daha ucuz.

## Temporal event history ve replay ile nasıl çalışır?

Her iş akışı çalıştırması, "iş akışı başladı", "Activity zamanlandı", "Activity tamamlandı", "zamanlayıcı tetiklendi" gibi olayların dayanıklı bir günlüğü olarak temsil ediliyor; bir sunucu kümesi, kalıcı bir depolama katmanı ve genellikle bir arama deposuyla birlikte çalışan uzun ömürlü worker'lar bu görev kuyruklarını dinliyor. Bir worker çökerse veya yeniden başlatılırsa, yeni bir worker aynı olay günlüğünü baştan oynatarak iş akışı kodunu son bilinen duruma kadar yeniden çalıştırıyor ve kaldığı yerden devam ediyor. Bu yeniden oynatma saniyeler sürebilir, çünkü motor tamamlanmış Activity'leri gerçekten yeniden çalıştırmıyor; sadece kayıtlı sonuçlarını okuyup iş akışı mantığını o noktaya kadar hızlıca ilerletiyor.

```typescript
// Temporal iş akışı örneği: activity'ler yeniden denenebilir, iş akışının kendisi deterministik
export async function siparisIsleWorkflow(siparisId: string) {
  await odemeyiTahsilEt(siparisId) // activity: dış çağrı, otomatik retry'lı
  await envanteriAyir(siparisId)   // activity
  await bildirimGonder(siparisId)  // activity

  // Deterministik olmayan bu satır iş akışında DOĞRUDAN kullanılmamalı:
  // const simdi = Date.now() -- bunun yerine workflow.now() kullanılır
}
```

## Cron + kuyruk + outbox'a kıyasla ne zaman Temporal'a geçmeye değer?

Süreciniz üç-beş adımdan uzunsa, adımlar arasında dakikalar-saatler geçiyorsa ve her adımın "en az bir kez ama tam olarak bir kez" çalıştığından emin olmanız gerekiyorsa Temporal'ın operasyonel yükü kendini amorti ediyor. Cron + kuyruk + [transactional outbox kalıbı](/tr/posts/outbox-kalibi-guvenilir-olay-yayini) kombinasyonu da benzer garantiler verebilir, ama her yeni iş akışı için tekrar tekrar aynı retry, timeout ve durum takibi kodunu elle yazmanız gerekiyor.

Temporal'ın asıl kazancı, bu muhasebeyi bir kere platformda çözüp her yeni iş akışında sıfırdan yazmamak. Buna karşılık, tek bir mikroservisin içinde kalan, saniyeler-dakikalar süren basit arka plan işleri için Temporal kurmak, çözdüğü problemden daha büyük bir operasyonel yük getiriyor — kendi sunucu kümenizi, worker'larınızı ve determinizm disiplinini yönetmeniz gerekiyor.

Bu operasyonel yükün somut bir örneği: bir Temporal kümesi işletmek, en az bir veritabanı (Cassandra veya PostgreSQL), bir arama deposu (Elasticsearch) ve kümeyi izleyen bir gözlemlenebilirlik katmanı gerektiriyor. Bu bileşenlerin her biri kendi bakım yükünü getiriyor, bu yüzden ekibinizde zaten bu tür dağıtık sistemleri işleten bir platform ekibi yoksa, Temporal Cloud gibi yönetilen bir sürümle başlamak, kendi kümenizi sıfırdan kurmaktan daha az riskli.

## Hafif alternatifler ne zaman yeterli?

Süreciniz tek bir servis içinde kalıyorsa ve birkaç adımı geçmiyorsa, [outbox kalıbıyla](/tr/posts/outbox-kalibi-guvenilir-olay-yayini) güçlendirilmiş bir kuyruk sistemi veya basit bir [retry ve backoff](/tr/posts/retry-backoff-circuit-breaker) stratejisi genelde yeterli. AWS Step Functions gibi bulut sağlayıcı yerleşik çözümleri, Temporal'ın operasyonel yükünü (kendi kümenizi işletme) ortadan kaldırırken benzer bir dayanıklılık garantisi veriyor — küçük ekipler için makul bir orta yol.

Inngest ve Restate gibi daha yeni, sunucusuz durable execution platformları da bu boşluğu dolduruyor; kendi Temporal kümenizi işletmek istemiyorsanız yönetilen bir alternatif olarak değerlendirilebilirler. Cloudflare Workflows de benzer bir niş dolduruyor — zaten Cloudflare üzerinde çalışan bir ekip için ek altyapı kurmadan dayanıklı yürütme sağlıyor. [Olay güdümlü mimari yazımızda](/tr/posts/olay-gudumlu-mimari-desenler-tuzaklar) ele aldığımız gibi, bazı durumlarda basit bir event-driven tasarım, dayanıklı yürütme motoruna hiç ihtiyaç duymadan aynı sonucu veriyor.

| Yaklaşım | En iyi senaryo | Operasyonel yük |
|---|---|---|
| Cron + kuyruk + outbox | Tek servis, birkaç adım, dakikalar içinde biter | Düşük |
| AWS Step Functions | Bulutta yönetilen adım fonksiyonları, orta karmaşıklık | Orta |
| Temporal (self-hosted) | Çok adımlı, saatler-günler süren, kritik iş süreçleri | Yüksek |
| Temporal Cloud | Aynı garanti, kümeyi kendin işletmek istemiyorsan | Orta |

## Sıkça Sorulan Sorular

### Dayanıklı yürütme (durable execution) tam olarak ne anlama geliyor?

Uzun süren, çok adımlı bir sürecin bir çökme, deploy veya yeniden başlatma sonrasında kaldığı adımdan otomatik olarak devam edebilmesini garanti eden bir programlama modeli anlamına geliyor; motor, iş akışının olay günlüğünü yeniden oynatarak son duruma ulaşıyor.

### Temporal'da determinizm kuralını ihlal edersem ne olur?

İş akışı kodunuzda `Date.now()` gibi deterministik olmayan bir çağrı kullanırsanız kod testlerden geçebilir ama bir replay sırasında farklı bir değer üretip iş akışının durumunu bozabilir; bu yüzden zaman ve rastgelelik gibi işlemler Activity'lere taşınmak zorunda.

### Temporal'a alternatif olarak ne kullanılabilir?

AWS Step Functions, Inngest, Restate ve Cloudflare Workflows gibi platformlar benzer dayanıklılık garantileri sunuyor; kendi sunucu kümenizi işletmek istemiyorsanız bunlar veya Temporal Cloud, self-hosted Temporal'a kıyasla daha az operasyonel yük getiriyor.

### Basit bir arka plan işi için Temporal kurmaya değer mi?

Genelde hayır — süreciniz tek bir serviste kalıyor ve birkaç adımı geçmiyorsa, [retry ve backoff](/tr/posts/retry-backoff-circuit-breaker) ile güçlendirilmiş basit bir kuyruk, Temporal'ın kendi kümesini işletme yükünden çok daha ucuza aynı sonucu veriyor.

Mikroservis mimarisi kararlarınızı genişletmek için [mikroservis mi monolit mi yazımıza](/tr/posts/mikroservis-mi-monolit-mi) ve daha fazla yazılım mühendisliği içeriği için [Yazılım Mühendisliği kategorimize](/tr/category/yazilim-muhendisligi) bakabilirsiniz.

Kaynaklar: [Temporal'ın resmi durable execution rehberi](https://temporal.io/blog/what-is-durable-execution) ve [Temporal Workflow Execution dokümantasyonu](https://docs.temporal.io/workflow-execution).
