---
title: "Özellik Tabanlı Test: Aklına Gelmeyen Hataları Bul"
slug: "ozellik-tabanli-test-hata-bulma"
translationKey: "property-based-testing-2026"
locale: "tr"
excerpt: "Özellik tabanlı test, tek tek örnek yazmak yerine her zaman doğru olması gereken kuralı tanımlar; framework binlerce rastgele girdi üretip bu kuralı sınar."
category: "software-engineering"
tags: [testing, unit-testing, code-quality, python]
publishedAt: "2026-09-24"
seoTitle: "Özellik Tabanlı Test Nedir? Hypothesis, fast-check, jqwik"
seoDescription: "Özellik tabanlı test, örnek yazmak yerine değişmez kuralları tanımlar ve framework binlerce girdi üretip sınar. Shrinking, stateful test ve araç seçimi burada."
---

Kısa cevap: Özellik tabanlı test, "bu girdi için çıktı şu olmalı" diye tek tek örnek yazmak yerine, "her girdi için şu kural her zaman doğru olmalı" şeklinde bir değişmez (invariant) tanımlarsınız; test framework'ü bu kuralı kırmaya çalışan yüzlerce veya binlerce rastgele girdi üretir ve her birini sizin yerinize dener.

## Bunu neden önemsemeli: bir örnek üzerinden

Bir ekip, JSON serileştirme fonksiyonunu birim testlerle kapsamış, hepsi yeşildi. Sonra Hypothesis ile tek bir özellik yazdılar: "her nesne için, serileştir ve geri oku, sonuç orijinaliyle aynı olmalı" (roundtrip özelliği). Framework birkaç saniye içinde nesnenin içinde bir `NaN` float değeri olduğunda roundtrip'in bozulduğunu buldu — çünkü JSON standardı `NaN`'ı desteklemiyor ve kütüphane sessizce `null`'a çeviriyordu. Hiçbir el yazımı test bu durumu kapsamamıştı çünkü kimse "peki ya değer NaN olursa" diye düşünmemişti. Framework düşünmek zorunda kalmadı — sadece üretti. Ekip hatayı bulduktan sonra tek satırlık bir düzeltmeyle çözdü, ama o hatanın production'da bir finansal raporlama hattında sessizce yanlış veri üretmesi aylar sürebilirdi.

## Örnek tabanlı testten farkı ne?

Örnek tabanlı bir test, belirli bir girdi ve beklenen çıktı çiftini elle yazar: `assert encode(decode(x)) == x` gibi bir satırı tek bir `x` değeriyle kontrol eder. Özellik tabanlı test aynı `assert`'i yazar ama `x`'i siz seçmezsiniz — framework bir üreteç (generator) tanımına göre yüzlerce farklı `x` değeri üretir ve her birinde özelliğin doğru kalıp kalmadığını dener. İki yaklaşım birbirinin yerine geçmez: örnek tabanlı testler belirli, bilinen uç durumları belgeler; özellik tabanlı testler bilmediğiniz uç durumları keşfeder.

Üreteç tanımı da tek satırdan fazlasını ifade edebiliyor: `st.integers()` yalnızca tam sayı üretirken, `st.integers(min_value=0, max_value=100)` gibi bir kısıt ekleyerek girdi uzayını daraltabilir, ya da `st.lists(st.integers(), min_size=1)` ile "en az bir elemanlı tam sayı listesi" gibi birleşik yapılar tanımlayabilirsiniz. Bu birleştirilebilirlik, karmaşık girdi türleri (iç içe JSON nesneleri, tarih aralıkları, özel sınıf örnekleri) için bile gerçekçi test verisi üretmeyi mümkün kılıyor.

## Shrinking nedir, neden bu kadar önemli?

Bir özellik binlerce rastgele girdiden biriyle kırıldığında, o girdi genelde karmaşık ve okunması zor bir yapıdadır — iç içe geçmiş 40 elemanlı bir liste gibi. Shrinking, framework'ün bu başarısız girdiyi adım adım basitleştirip özelliği hâlâ kıran en küçük örneği bulma sürecidir. Hypothesis, fast-check ve jqwik'in üçü de bu mekanizmayı içeriyor: jqwik bir özellik başarısız olduğunda sadece hatayı raporlamıyor, girdiyi tekrar tekrar sadeleştirip minimal başarısızlık durumunu buluyor. Shrinking olmadan özellik tabanlı test pratikte kullanışsız kalırdı — 40 elemanlı rastgele bir listeyle hata ayıklamak, tek elemanlı bir listeyle hata ayıklamaktan çok daha zordur.

## Hangi dilde hangi aracı kullanmalıyım?

Özellik tabanlı testin kökeni Haskell'deki QuickCheck framework'üne dayanıyor; bugün hemen hemen her ana akım dilde bir karşılığı var.

| Dil | Framework | Not |
|---|---|---|
| Python | Hypothesis | Gelişmiş stateful (durum tabanlı) test desteğiyle öne çıkıyor |
| JavaScript/TypeScript | fast-check | Shrinking dahil, tip tabanlı üreteçler |
| Java | jqwik | `@Property` anotasyonu, yapılandırılabilir deneme sayısı |
| Rust | proptest, quickcheck | Rust'ın tip sistemiyle sıkı entegre |
| Scala | ScalaCheck | Orijinal QuickCheck'in en yakın portlarından biri |

## Stateful (durum tabanlı) test nedir?

Basit özellik testleri saf fonksiyonlar için iyi çalışır ama gerçek sistemlerin çoğu durum (state) taşır — bir önbellek, bir veritabanı bağlantısı, bir kullanıcı oturumu. Stateful test, rastgele bir komut dizisi üretir (`ekle`, `sil`, `güncelle` gibi), bunları hem gerçek sisteme hem de basit bir "gölge model"e (shadow model) uygular ve ikisinin sonucu her adımda eşleşmezse başarısızlığı minimal bir komut dizisine kadar küçültür. Hypothesis'in Python'a getirdiği bu yaklaşım, örneğin bir LRU cache implementasyonunun tahliye (eviction) sırasını yanlış uyguladığı durumları, elle yazılmış senaryo testlerinin kaçırdığı sıralamalarla ortaya çıkarabiliyor. Elle yazılan senaryo testleri genelde üç-dört adımlık "makul" komut dizileri dener; stateful test ise yüzlerce rastgele sıralama deneyip aralarından en az beklenen ama en çok hata çıkaran sıralamayı bulmaya çalışıyor.

```python
from hypothesis import given, strategies as st

@given(st.lists(st.integers()))
def test_sort_is_idempotent(xs):
    once = sorted(xs)
    twice = sorted(sorted(xs))
    assert once == twice

@given(st.floats(allow_nan=True))
def test_json_roundtrip(x):
    import json
    assert json.loads(json.dumps(x)) == x  # NaN icin bu satir patlar
```

jqwik'te aynı deneme sayısını ve shrinking davranışını `@Property` anotasyonu üzerinde ayarlıyorsunuz — `tries = 5000` ile deneme sayısını artırabilir, `shrinking = ShrinkingMode.OFF` ile shrinking'i kapatabilirsiniz (genelde hata ayıklarken geçici olarak).

## Hangi özellikleri test etmeliyim?

Gerçek hata bulan özellikler genelde dört kalıptan birine giriyor: roundtrip (kodla, sonra çöz, orijinaliyle aynı olmalı), değişmezlik (bir sıralama fonksiyonu girdiyi asla kaybetmemeli veya çoğaltmamalı), idempotans (bir işlemi iki kez uygulamak bir kez uygulamakla aynı sonucu vermeli) ve farklı yollar aynı sonuca (iki farklı algoritma aynı girdide aynı çıktıyı üretmeli). Rastgele "her şeyi test edelim" yaklaşımı zaman kaybettirir; asıl değer, kodunuzun taşıması gereken matematiksel veya mantıksal kuralı bulup onu bir `assert`'e dönüştürmekte. Bir fonksiyon için tek bir iyi özellik bulmak, o fonksiyon için yazılmış on tane özenli örnek testten daha fazla hata yakalayabiliyor; çünkü örnek testler yalnızca yazarının aklına gelen durumları kapsıyor, özellik ise aklınıza gelmeyen her durumu otomatik olarak deniyor.

Bize göre özellik tabanlı test, birim testlerin yerine geçmiyor — onları tamamlıyor. Birim testleri bildiğiniz uç durumları belgelemek için, özellik testlerini bilmediğiniz uç durumları bulmak için kullanmak, ikisinin de en iyi yaptığı işi yapmasına izin veriyor.

## CI'da özellik tabanlı testleri kararlı tutmak nasıl mümkün?

Rastgele girdi üreten bir testin CI'da "kırmızı-yeşil-kırmızı" şeklinde kararsız (flaky) görünmesi yaygın bir endişe ama çözümü basit: framework'ler her başarısız çalışmada kullandığı rastgele tohumu (seed) raporluyor. Hypothesis bir hata bulduğunda o örneği yerel bir veritabanına kaydediyor ve sonraki her çalışmada önce bu bilinen başarısızlıkları tekrar deniyor — yani bir hata bir kez bulunduktan sonra, düzeltilene kadar her CI çalışmasında yeniden ortaya çıkıyor, rastgele kaybolmuyor. fast-check ve jqwik de aynı mantığı izliyor: başarısız tohumu loglara yazıp `seed` parametresiyle yerel olarak birebir tekrar üretmenizi sağlıyorlar.

Pratik bir kural: CI'da deneme sayısını (`max_examples` veya `tries`) yerel geliştirme ortamındakinden daha düşük tutup, gece çalışan ayrı bir "derin tarama" işinde çok daha yüksek bir sayıyla (10.000+) çalıştırmak, hem hızlı geri bildirim hem de derinlemesine tarama arasında iyi bir denge kuruyor.

## Sıkça Sorulan Sorular

### Özellik tabanlı test birim testlerin yerini alır mı?

Kısa cevap: Hayır, ikisi farklı amaçlara hizmet eder. Birim testler bilinen, belirli uç durumları belgeler; özellik tabanlı testler framework'ün rastgele ürettiği, sizin akletmediğiniz uç durumları keşfeder. Çoğu ekip ikisini bir arada kullanır.

### Shrinking nasıl çalışır?

Kısa cevap: Bir özellik test başarısız olduğunda framework, başarısız olan girdiyi adım adım küçültüp basitleştirir ve özelliği hâlâ kıran en küçük örneği bulana kadar bu işlemi tekrarlar. Bu, 40 elemanlı rastgele bir listeyle değil, genelde tek bir elemanla veya birkaç elemanla hata ayıklamanızı sağlar.

### Hangi framework'le başlamalıyım: Hypothesis mi fast-check mi?

Kısa cevap: Python projesindeyseniz Hypothesis, JavaScript veya TypeScript projesindeyseniz fast-check doğru başlangıç noktası. İkisi de shrinking'i destekliyor ve mevcut test çatınıza (pytest, Jest/Vitest) doğrudan entegre oluyor, bu yüzden yeni bir test koşucusu öğrenmenize gerek kalmıyor.

**Kaynaklar:** [jqwik kullanıcı rehberi](https://jqwik.net/docs/current/user-guide.html), [Baeldung: jqwik ile özellik tabanlı test](https://www.baeldung.com/java-jqwik-property-based-testing), [Property-Based Testing in Practice: üreteçler ve stateful özellikler](https://www.trinitylogic.co.uk/blog/testing-property-based-testing-practice/).
