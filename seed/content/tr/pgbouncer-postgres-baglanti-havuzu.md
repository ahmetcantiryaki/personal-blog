---
title: "PgBouncer ile Postgres Bağlantı Havuzu"
slug: "pgbouncer-postgres-baglanti-havuzu"
translationKey: "pgbouncer-connection-pooling"
locale: "tr"
excerpt: "PgBouncer havuzlaması performansı artırır ama transaction modunda current_user'a dayanan RLS politikalarını kırar; SET LOCAL çözümü ve CVE-2026-6664 yaması."
category: "devops-cloud"
tags: ["databases", "sql", "performance", "devops", "postgresql"]
publishedAt: "2026-07-13"
seoTitle: "PgBouncer ile Postgres Bağlantı Havuzu (2026)"
seoDescription: "PgBouncer havuzlaması performansı artırır ama transaction modunda current_user'a dayanan RLS politikalarını kırar; SET LOCAL çözümü ve CVE-2026-6664 yaması."
---

Bağlantı havuzu kurduğunuzda performans sorununu çözersiniz ama fark etmeden kiracı izolasyonunu kırabilirsiniz. PgBouncer transaction modunda tüm uygulama bağlantıları aynı paylaşılan veritabanı rolüyle kimlik doğrular; RLS politikalarınız `current_user`'a dayanıyorsa artık hiçbir kiracıyı diğerinden ayırt edemez ve bunu fark etmeniz aylar sürebilir.

## Neden Postgres bağlantıları bu kadar pahalı?

Her Postgres bağlantısı, işletim sisteminde ayrı bir süreç (process) olarak karşılığını bulur; iş parçacığı (thread) değil, tam teşekküllü bir OS sürecidir. Bu, bellek ayak izi ve bağlam değişimi (context switch) maliyeti açısından ucuz değildir. Uygulamanız istek başına yeni bir bağlantı açıp kapatıyorsa ya da bir orkestratör yüzlerce podu aynı veritabanına doğrudan bağlıyorsa birkaç yüz, hatta birkaç bin saf bağlantı, orta ölçekli bir Postgres örneğini dizlerinin üstüne çökertebilir. Sorun sorgu hızı değildir; sorun, veritabanı sunucusunun kaç eşzamanlı süreci sağlıklı biçimde taşıyabildiğidir.

## PgBouncer bağlantıları nasıl çoğullar?

[PgBouncer](https://www.pgbouncer.org/config.html), uygulamanın gördüğü bağlantı sayısıyla Postgres'in gerçekte açtığı bağlantı sayısını birbirinden ayıran hafif bir ara katmandır (proxy). Yüzlerce uygulama bağlantısını -örneğin 500 tanesini- yalnızca birkaç düzine gerçek arka uç bağlantısına, diyelim 20 tanesine kanalize eder. Uygulama tarafında hâlâ bol miktarda bağlantı açabilirsiniz çünkü bunlar PgBouncer'ın kendi soketleridir ve ucuzdur; pahalı olan taraf, yani gerçek Postgres süreçleri, sabit ve küçük bir havuzda kalır. Bu, çoğu ekibin PgBouncer'ı öncelikle bir ölçekleme aracı olarak görmesinin nedenidir. Ama işin can alıcı kısmı burada başlar: bu çoğullamayı nasıl yaptığı, üstteki güvenlik varsayımlarınızı sessizce geçersiz kılabilir.

## Üç havuz modu ve devre dışı bıraktıkları

PgBouncer üç ayrı havuzlama modu sunar ve her biri farklı bir ödünleşim getirir.

**Session modu**, bir istemci bağlı kaldığı sürece bire bir eşleme kurar; istemci bağlantıyı kapatana dek aynı arka uç bağlantısını kullanır. Tüm oturum düzeyi özellikler (session-level `SET`, geçici tablolar, `LISTEN/NOTIFY`) sorunsuz çalışır çünkü arka uç değişmez. Ancak çoğullama faydası en düşük olan moddur; boşta bekleyen bir istemci, arka uç bağlantısını da boşta tutar.

**Transaction modu**, arka uç bağlantısını her `COMMIT` anında geri havuza döndürür. En yaygın ve en verimli moddur çünkü bir istemci sorgu göndermediği her an, o arka uç bağlantısı başka bir istemciye hizmet edebilir. Bedeli ise oturum düzeyi özelliklerin devre dışı kalmasıdır: oturum seviyesinde bir `SET`'e güvenemezsiniz çünkü bir sonraki deyim tamamen farklı bir arka uca düşebilir; hazırlanmış deyimler (prepared statements) de dikkatli ele alınmalıdır.

**Statement modu** en agresif moddur; birden çok deyimi kapsayan işlemlere (transaction) bile izin vermez, her deyimden sonra bağlantı serbest bırakılır. Pratikte nadiren kullanılır çünkü neredeyse hiçbir gerçek dünya uygulaması bu kısıtla yaşayamaz.

| Havuz Modu | Çoğullama faydası | Oturum düzeyi özellikler | Tipik kullanım |
|---|---|---|---|
| Session | Düşük | Tümü desteklenir | Eski uygulamalar, session durumu gereken servisler |
| Transaction | Yüksek | Devre dışı (SET ve prepared statement dikkat ister) | Web API'leri, yüksek eşzamanlı iş yükleri (en yaygın) |
| Statement | En yüksek | Devre dışı, çok deyimli işlem bile yok | Nadir; yalnızca autocommit iş yükleri |

## RLS tuzağı: current_user artık hiçbir şey ifade etmiyor

İşte asıl mesele. Transaction modunda çalışan bir havuzun arkasında, uygulama bağlantılarının neredeyse tamamı aynı paylaşılan veritabanı rolüyle kimlik doğrular; çünkü PgBouncer arka uç bağlantılarını farklı istemciler arasında yeniden kullanır ve genelde tek bir yapılandırılmış kullanıcı adıyla Postgres'e bağlanır. Bunun sonucu açıktır: `current_user`, her kiracı ve her istek için birebir aynıdır. RLS politikalarınız naif biçimde `current_user`'ı kiracı kimliği olarak kontrol ediyorsa bu kontrol artık tamamen işlevsizdir; herkes aynı role sahip görünür ve izolasyon fiilen ortadan kalkar.

Bu, [RLS'nin bilinen tuzaklarından](https://www.bytebase.com/blog/postgres-row-level-security-footguns/) biridir ve tehlikeli olan yanı gürültülü başarısız olmamasıdır. Uygulama çalışmaya devam eder, sorgular döner, hiçbir hata fırlamaz. Sızıntı yalnızca bir kiracının verisi başka bir kiracının isteğinde göründüğünde fark edilir; genellikle de bu, aylar sonra bir destek talebiyle ya da bir denetimle ortaya çıkar. Ekiplerin çoğu bağlantı havuzlamasını salt bir performans ve ölçekleme ayarı olarak ele alır, kurulumdan sonra RLS politikalarını bir daha hiç gözden geçirmez. Tam da bu yüzden çok kiracılı bir veri sızıntısı, `current_user`'ın anlamını yitirdiği andan itibaren üretimde aylarca sessizce oturur; kimse fark etmeden.

## Çözüm: SET LOCAL ve current_setting ile kiracı izolasyonu

Doğru yaklaşım, kiracı kimliğini bağlantının kendisine değil işleme (transaction) bağlamaktır. Bunun aracı, işlem kapsamlı bir GUC'ye `SET LOCAL app.current_tenant = '...'` (ya da `set_config(..., true)`) ile değer atamak ve RLS politikalarını bu değeri `current_setting('app.current_tenant')` üzerinden okuyacak şekilde yazmaktır.

```sql
-- Her istek/işlem başında, uygulama kodundan:
BEGIN;
SET LOCAL app.current_tenant = 'tenant_8f2a';

-- RLS politikası bu değeri okur, current_user'ı değil:
CREATE POLICY tenant_isolation ON invoices
  USING (tenant_id = current_setting('app.current_tenant')::uuid);

SELECT * FROM invoices; -- yalnızca tenant_8f2a'nın satırlarını görür
COMMIT;
```

Bu desen, PgBouncer'ın transaction havuzlamasıyla özellikle güvenli çalışır çünkü arka uç bağlantısı tam olarak `COMMIT` anında geri havuza döner; bir `SET LOCAL` değeri işlem kapsamlıdır ve işlem sona erdiğinde otomatik sıfırlanır, bir sonraki kiracının işlemine asla sızmaz. Kritik olan nokta şudur: bunun için asla düz `SET` ya da `SET SESSION` kullanmayın. Oturum düzeyinde ayarlanan değerler havuzlanmış bağlantılar arasında sızar; o arka uç bağlantısını sıradaki hangi kiracı yeniden kullanırsa önceki kiracının ayarını devralır. Bu desenin var olma nedeni tam olarak bu güvenlik açığından kaçınmaktır, dolayısıyla `SET` ile `SET LOCAL` arasındaki fark burada kozmetik değil işlevseldir.

## Boyutlandırma ve zamanında yama: 1.25.2'ye geçin

Havuzu boyutlandırırken iki parametre asıl belirleyicidir. `default_pool_size`, her veritabanı-kullanıcı çifti için tutulacak gerçek arka uç bağlantısı sayısını belirler; bunu Postgres sunucunuzun güvenle taşıyabileceği eşzamanlı süreç sayısına göre ayarlayın, uygulamanızın istediği bağlantı sayısına göre değil. `max_client_conn` ise PgBouncer'ın kabul edeceği toplam uygulama bağlantısı sayısının üst sınırıdır ve genellikle `default_pool_size`'dan çok daha yüksek tutulur; çünkü asıl darboğaz zaten arka uç tarafında çözülmüştür. Değişiklik yaptıktan sonra havuz kullanım oranını ve bekleyen istemci sayısını izleyin; sürekli dolu bir havuz, boyutu artırmanız gerektiğinin işaretidir.

Bunun yanına zamana duyarlı bir işletim notu ekleyelim: CVE-2026-6664, PgBouncer'ın SCRAM kimlik doğrulama paketi ayrıştırmasında bir tamsayı taşması (integer overflow) hatasıdır ve bir sınır denetimini atlatır; kimlik doğrulamadan önce erişilebilir olduğu için, PgBouncer'a TCP bağlantısı açabilen herhangi bir kimliksiz uzak saldırgan bozuk bir SCRAM paketiyle servisi çökertebilir (CVSS 7.5, yüksek). Aynı 1.25.2 sürümü ayrıca CVE-2026-6665'i (kötü niyetli bir arka uç tarafından tetiklenebilen bir SCRAM yığın taşması), CVE-2026-6666'yı (bir sunucu SQLSTATE alanı eksik bir hata yanıtı gönderdiğinde oluşan boş işaretçi hatası) ve CVE-2026-6667'yi (KILL_CLIENT yönetici komutunda eksik bir yetkilendirme denetimi) de düzeltti. Temmuz 2026 itibarıyla Postgres önünde 1.25.2'den eski bir PgBouncer çalıştıran herkesin [bunu hemen yamalaması](https://thebuild.com/blog/patch-pgbouncer-today/) gerekiyor; ayrıntılar [NVD'nin CVE-2026-6664 kaydında](https://nvd.nist.gov/vuln/detail/CVE-2026-6664) mevcut.

Bağlantı havuzlaması, [veritabanı indeksleme](/tr/posts/veritabani-indeksleme) ve [N+1 sorgu problemi](/tr/posts/n-plus-one-sorgu-problemi) gibi konularla birlikte performans araç kutunuzun bir parçası olmalı ama tek başına bir performans ayarı değildir. Şemayı değiştirdiğiniz her seferde -örneğin [kesintisiz şema migrasyonları](/tr/posts/kesintisiz-sema-migrasyonlari) yaparken- RLS politikalarınızı da gözden geçirin; havuzlama katmanı orada sessizce durup beklemektedir. Daha fazla DevOps ve altyapı yazısı için [devops ve bulut arşivimize](/tr/category/devops-bulut) göz atabilirsiniz.

## Sıkça Sorulan Sorular

### PgBouncer'da hangi havuz modunu varsayılan olarak kullanmalıyım?

Çoğu web uygulaması için transaction modu doğru başlangıç noktasıdır; en yüksek çoğullama faydasını sunar ve modern ORM'ler artık prepared statement'ları bu moda uyumlu şekilde ele alabiliyor. Session modunu yalnızca `LISTEN/NOTIFY`, geçici tablolar ya da oturum düzeyinde `SET` gerektiren belirli servisler için ayırın.

### Transaction modunda prepared statement kullanabilir miyim?

Dikkatli kullanırsanız evet. PgBouncer'ın güncel sürümleri isim tabanlı hazırlanmış deyimleri (named prepared statements) belirli koşullarda destekler ama istemci kütüphanenizin ve PgBouncer sürümünüzün bunu nasıl ele aldığını doğrulamadan varsaymayın; aksi hâlde "prepared statement bulunamadı" hatalarıyla karşılaşabilirsiniz.

### RLS politikalarımı pooler kurduktan sonra nasıl test ederim?

İki farklı kiracı kimliğiyle art arda işlemler açıp her birinde `SET LOCAL app.current_tenant` değerini değiştirerek, ikinci işlemin birinci kiracının satırlarını hiç görmediğini doğrulayın. Ayrıca yanlışlıkla düz `SET` kullanılmadığından emin olmak için kod tabanınızda `SET SESSION` ve oturum kapsamlı ayar aramaları yapın.

### PgBouncer yerine PgCat ya da Supavisor gibi alternatifler kullanmalı mıyım?

Bu makaledeki temel ilkeler -havuz modu seçimi, işlem kapsamlı kiracı izolasyonu ve zamanında yama uygulama- hangi pooler'ı seçerseniz seçin geçerliliğini korur. PgBouncer, olgunluğu ve geniş dokümantasyonu nedeniyle hâlâ varsayılan tercih ama alternatiflerin de kendi mod ve GUC davranışlarını aynı titizlikle doğrulamanız gerekir.
