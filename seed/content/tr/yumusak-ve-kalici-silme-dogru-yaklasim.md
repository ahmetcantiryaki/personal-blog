---
title: "Yumuşak ve Kalıcı Silme: Doğru Yaklaşım"
slug: "yumusak-ve-kalici-silme-dogru-yaklasim"
translationKey: "soft-vs-hard-deletes-done-right"
locale: "tr"
excerpt: "Kısa cevap: varsayılan olarak soft delete seçmeyin. Geri alma gereken tablolarda kısmi unique index ile kullanın; GDPR silme talepleri gerçek hard delete ister."
category: "software-engineering"
tags: ["databases", "postgresql", "sql", "compliance", "best-practices"]
publishedAt: "2026-10-31"
seoTitle: "Soft Delete mi Hard Delete mi? Doğru Yaklaşım"
seoDescription: "Soft delete ne zaman kullanılır, gizli maliyetleri neler, kısmi unique index nasıl kurulur ve GDPR Madde 17 neden hard delete gerektirir? Pratik rehber."
---

Kısa cevap: her tabloya varsayılan olarak `deleted_at` sütunu eklemeyin. Soft delete'i yalnızca kullanıcıya geri alma (undo) sunmanız gereken tablolarda, kısmi unique index ve katı sorgu disipliniyle kullanın; GDPR'nin silme hakkı talepleri için gerçek bir hard delete işlemi gerekiyor, soft delete tek başına yeterli değil.

## Soft delete neden bu kadar cazip görünüyor?

Soft delete, bir satırı veritabanından fiziksel olarak silmek yerine `deleted_at` gibi bir sütunu doldurarak "silinmiş" işaretlemek demek; bu yaklaşım yanlışlıkla silinen verinin geri alınabilmesi ve bir denetim izi (audit trail) tutulması gibi gerçek faydalar sunuyor. Bir kullanıcı yanlışlıkla bir kaydı sildiğinde, satır hâlâ veritabanında durduğu için "geri al" butonu tek bir UPDATE sorgusu kadar basit oluyor.

Bu kolaylık, çoğu ekibin soft delete'i düşünmeden her tabloya varsayılan olarak eklemesine yol açıyor. Sorun tam olarak burada başlıyor: soft delete'in getirdiği gizli maliyetler, ilk bakışta görünmüyor ve genelde üretimde bir hata olarak ortaya çıkıyor.

## Soft delete'in gizli maliyeti nedir?

Üç gizli maliyet var: bozulan unique kısıtlamalar, her sorguya sızan gürültü ve "silinmiş" verinin hâlâ görünür kalması. Bir `email` sütununda normal bir unique kısıtlama varsa, bir kullanıcı hesabını sildiğinde o e-posta adresi veritabanında "kullanılmış" olarak kalıyor — aynı kişi yeniden kayıt olmak istediğinde "bu e-posta zaten kayıtlı" hatası alıyor, oysa hesap zaten silinmiş durumda.

İkinci maliyet, her sorgunun `WHERE deleted_at IS NULL` filtresini içermesi gerektiği; bu filtreyi bir yerde unutursanız, silinmiş veri raporlara, API yanıtlarına veya dışa aktarılan dosyalara sızıyor. Üçüncü maliyet, join'ler üzerinden gelen sızıntı: bir sipariş tablosu silinmiş bir müşteriye referans veriyorsa, sipariş listesi sorgusu "müşteri" alanını boş değil, silinmiş müşterinin adıyla gösterebiliyor.

| Boyut | Soft delete | Hard delete |
|---|---|---|
| Geri alma | Kolay, tek UPDATE | İmkansız, yedekten geri yükleme gerekir |
| Sorgu karmaşıklığı | Her sorguda filtre gerekir | Ek filtreye gerek yok |
| Uyumluluk riski (GDPR) | Tek başına yetersiz | Gerçek silme hakkını karşılar |
| Depolama maliyeti | Zamanla büyür | Sabit kalır |
| Unique kısıtlama riski | Kısmi index olmadan bozulur | Risk yok |

## Kısmi unique index sorunu nasıl çözüyor?

[PostgreSQL'in CREATE INDEX dokümantasyonuna](https://www.postgresql.org/docs/current/sql-createindex.html) göre bir kısmi unique index, kısıtlamayı sadece belirli bir koşulu sağlayan satırlara uygulayarak soft-deleted satırları kısıtlamanın dışında tutuyor. Aşağıdaki index, sadece `deleted_at IS NULL` olan (yani aktif) satırlar arasında e-posta benzersizliğini zorunlu kılıyor; silinmiş kullanıcılar aynı e-postayı paylaşabiliyor ama aktif kullanıcılar paylaşamıyor.

```sql
CREATE UNIQUE INDEX users_email_unique
ON users (email)
WHERE deleted_at IS NULL;
```

Bu, MySQL'in aynı sorunu çözmek için kullandığı, silinen satırlarda NULL'a dönen bir üretilmiş (generated) sütuna dayanan dolaylı yönteme göre çok daha temiz bir çözüm. Ama bir uyarı var: bu index sadece `deleted_at IS NULL` filtresi olan sorgularda devreye giriyor; filtre olmayan bir sorgu bu indeksten faydalanmıyor, yani sorgu disiplini index kurmaktan sonra da gerekli olmaya devam ediyor.

## GDPR'nin silme hakkı soft delete ile karşılanır mı?

Hayır, [GDPR Madde 17'nin](https://gdpr-info.eu/art-17-gdpr/) tanımladığı "silme hakkı" (right to erasure), verinin gerçekten ve geri döndürülemez şekilde kaldırılmasını gerektiriyor; bir `deleted_at` sütunu doldurup veriyi veritabanında tutmak bu gereksinimi karşılamıyor. Bir kullanıcı silme talebinde bulunduğunda, o kullanıcıya ait kişisel verilerin yedeklerden ve arşiv tablolarından da fiilen kaldırılması gerekiyor — sadece ana tablodan "gizlenmesi" yeterli değil.

Bu, [sıfırdan şema migrasyonu](/tr/posts/kesintisiz-sema-migrasyonlari) yapan ekiplerin de dikkat etmesi gereken bir nokta: bir tabloyu soft-delete'ten hard-delete'e geçirirken, eski yedeklerde kalan kişisel verinin de saklama politikasına dahil edilmesi gerekiyor.

## Arşiv tablosu ve zamanlanmış silme nasıl çalışır?

Pratik çözüm, soft delete'i geçici bir ara durum olarak kullanıp belirli bir süre sonra (örneğin 30 gün) satırı ayrı bir arşiv tablosuna taşıyıp ana tablodan gerçekten silmek. Bu yaklaşım, kullanıcıya kısa vadeli bir geri alma penceresi sunarken, verinin süresiz olarak ana tabloda ve tüm sorgu yollarında kalmasını engelliyor.

```sql
-- 30 günden eski soft-deleted satırları arşive taşı, sonra sil
INSERT INTO users_archive
SELECT * FROM users WHERE deleted_at < now() - interval '30 days';

DELETE FROM users WHERE deleted_at < now() - interval '30 days';
```

Bu zamanlanmış iş, [API versiyonlama stratejilerinde](/tr/posts/api-versiyonlama-stratejileri) olduğu gibi, bir defalık bir karar değil sürekli çalışan bir bakım sürecine dönüşüyor — ekibin bu işi bir cron job veya zamanlanmış görevle otomatikleştirmesi, elle silme işleminin unutulma riskini ortadan kaldırıyor.

## Denetim izi tutarken kişisel veriyi nasıl saklamazsınız?

Denetim izi için "ne oldu" bilgisini saklamak yeterli; "kime oldu" bilgisini saklamak çoğu zaman gerekli değil. Pratik yöntem, arşiv tablosunda kullanıcı adı ve e-posta gibi alanları saklamak yerine, sadece bir hash'lenmiş referans ID'si ve olayın türünü tutmak — bu, denetim kaydının bütünlüğünü korurken kişisel veri riskini ortadan kaldırıyor.

Bu ayrım, [geri basınç ve yük atma](/tr/posts/geri-basinc-yuk-atma-servis) yazısında ele alınan "her şeyi aynı önemde tutma" tuzağına benzer bir mantık izliyor: her veriyi aynı saklama politikasıyla tutmak yerine, hangi verinin ne kadar süreyle ve hangi biçimde saklanacağına bilinçli karar vermek gerekiyor.

## Mevcut bir tabloyu soft delete'ten hard delete'e nasıl geçirirsiniz?

Geçiş üç adımda yapılıyor: önce arşiv tablosunu ve zamanlanmış işi kurun, ardından mevcut soft-deleted satırları tek seferlik bir toplu işlemle arşive taşıyın, son olarak uygulamanın yeni silme isteklerini doğrudan arşivleme akışına yönlendirmesini sağlayın. Bu sırayı tersine çevirip önce uygulama kodunu değiştirmek, arşiv tablosu henüz yokken silme isteklerinin başarısız olmasına yol açabiliyor.

Geçiş sırasında en kritik adım, mevcut unique kısıtlamaları kısmi index'e çevirmeden önce test ortamında denemek; üretimde doğrudan `CREATE UNIQUE INDEX` çalıştırmak, tablo büyükse kilitlenmeye neden olabiliyor, bu yüzden PostgreSQL'in `CONCURRENTLY` seçeneğiyle index'i kilitsiz oluşturmak daha güvenli.

## Soft delete hangi durumda hâlâ doğru seçim?

Kullanıcıya doğrudan bir "geri al" özelliği sunduğunuz, kısa ömürlü ve düşük hacimli tablolarda (bir not uygulamasındaki tek bir not gibi) soft delete hâlâ en basit çözüm. Ama büyük hacimli, kişisel veri içeren veya uyumluluk gereksinimi olan tablolarda (kullanıcı hesapları, ödeme kayıtları) varsayılan olarak hard delete'e yönelmek, ileride çıkacak unique kısıtlama hatalarından ve uyumluluk risklerinden kaçınmanın en güvenli yolu.

Kendi değerlendirmem: çoğu ekip soft delete'i "ihtiyatlı" olduğu için seçiyor, ama bu ihtiyat genelde altı ay sonra bozulan bir unique kısıtlama veya bir uyumluluk denetiminde ortaya çıkan bir pişmanlığa dönüşüyor. Varsayılan seçim hard delete olmalı; soft delete sadece gerçekten geri alma ihtiyacı olan yerlerde, bilinçli bir istisna olarak eklenmeli.

Yeni bir şema tasarlarken kendinize sorulması gereken pratik soru şu: "bu satırı kim, ne sıklıkla ve hangi süre içinde geri almak isteyecek?" Cevap "kullanıcı, nadiren, birkaç dakika içinde" ise soft delete mantıklı. Cevap "muhtemelen kimse, ama bir denetçi altı ay sonra sorabilir" ise ihtiyacınız olan şey soft delete değil, ayrı bir denetim tablosu.

## Sıkça Sorulan Sorular

### Soft delete ne zaman kullanılmalı?

Kullanıcıya doğrudan bir geri alma özelliği sunmanız gereken, düşük hacimli ve kişisel veri riski taşımayan tablolarda kullanılmalı. Büyük hacimli veya uyumluluk gereksinimi olan tablolarda varsayılan olarak hard delete tercih edilmeli.

### Soft delete GDPR'nin silme hakkını karşılar mı?

Hayır. GDPR Madde 17, kişisel verinin gerçekten ve geri döndürülemez şekilde kaldırılmasını gerektiriyor; bir `deleted_at` sütunu doldurmak veriyi veritabanında tutmaya devam ettiği için bu gereksinimi karşılamıyor.

### Kısmi unique index soft delete sorununu nasıl çözer?

PostgreSQL'de `WHERE deleted_at IS NULL` koşuluyla kurulan bir kısmi unique index, benzersizlik kısıtlamasını sadece aktif satırlara uyguluyor; böylece silinmiş bir kullanıcının e-postası, yeni bir kullanıcı tarafından tekrar kullanılabiliyor.

### Soft delete ile hard delete'i birlikte kullanabilir miyim?

Evet, en pratik yaklaşım bu: soft delete'i kısa bir geri alma penceresi (örneğin 30 gün) için kullanıp, süre dolduğunda satırı bir arşiv tablosuna taşıyarak ana tablodan gerçekten silmek. Bu, hem kullanıcı deneyimini hem de uyumluluk gereksinimlerini karşılıyor.
