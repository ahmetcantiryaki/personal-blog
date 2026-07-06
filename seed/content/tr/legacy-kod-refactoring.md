---
title: "Legacy Kod Güvenli Şekilde Nasıl Refactor Edilir"
slug: "legacy-kod-refactoring"
translationKey: "refactor-legacy-code"
locale: "tr"
excerpt: "Legacy kod refactoring'i güvenli yapmanın yolu: davranışı karakterizasyon testleriyle sabitleyin, küçük geri alınabilir adımlarla değiştirin ve strangler desenini kullanın."
category: "software-engineering"
tags: ["refactoring", "clean-code", "legacy-code", "code-quality"]
publishedAt: "2026-07-02"
seoTitle: "Legacy Kod Güvenli Refactor: Adım Adım Rehber"
seoDescription: "Legacy kod refactoring'i güvenli yapın: davranışı karakterizasyon testiyle sabitleyin, küçük geri alınabilir adımlarla ilerleyin, strangler desenini kullanın."
---

Legacy kod refactoring'i güvenli yapmanın özü şudur: önce mevcut davranışı karakterizasyon testleriyle sarın, sonra kodu testler yeşil kaldıkça küçük ve geri alınabilir adımlarla değiştirin. Bir refactor ile davranış değişikliğini asla aynı commit'te birleştirmeyin. İşin tamamı budur; yapıyı ancak davranış kaydığı an bağıran bir test paketiniz varsa korkusuzca değiştirebilirsiniz.

Legacy kod "eski kod" demek değildir. Güvendiğiniz testi olmayan ve soru soracağınız bir yazarı bulunmayan koddur. Bu rehber, korkutucu ve testsiz modülleri production'da kırmadan değiştirmek için kullandığımız tam sırayı ve ne zaman *hiç* refactor yapmamak gerektiğini anlatıyor.

## "Legacy kodu güvenli refactor etmek" tam olarak ne demek?

Refactoring, kodun dış davranışını değiştirmeden iç yapısını iyileştirmektir. Bunu legacy kodda *güvenli* yapmak ise, her düzenlemeden önce, sırasında ve sonrasında davranışın değişmediğini kanıtlayabilmek demektir. Bu kanıt yoksa refactor yapmıyorsunuz; yeniden yazıp iyi gitmesini umuyorsunuz.

Çoğu ekibin düştüğü tuzak "temizle" ile "yeni bir şey yaptır" işlerini tek göreve karıştırmaktır. Bunları kesin biçimde ayırın. Güvenli bir legacy refactor'ı, her biri tek `git revert` ile geri alınabilecek kadar küçük ve her biri bir testle doğrulanmış, davranış koruyan düzenlemeler dizisidir.

## Legacy kod adım adım nasıl refactor edilir?

Her riskli modülde uyguladığımız tekrarlanabilir süreç aşağıda. Sırayı bozmadan takip edin; güvenlik tek tek adımlardan değil, sıradan gelir:

1. **Kapsamı dondurun.** Değer üreten en küçük birimi seçin: tek bir fonksiyon, tek bir sınıf, tek bir endpoint. "Hazır buradayken" dürtüsüne direnin.
2. **Bir dikiş (seam) bulun.** Mantığı düzenlemeden davranışı gözlemleyebileceğiniz veya araya girebileceğiniz bir nokta belirleyin (public metot, HTTP sınırı, dönüş değeri).
3. **Karakterizasyon testleri yazın.** Kodun *şu an* ne yaptığını, hatalar dahil, gerçek çıktılara assert ederek yakalayın. Doğruyu değil, mevcut gerçeği belgeliyorsunuz.
4. **Testleri çalıştırıp geçtiğini görün.** Hiç kırılmamış yeşil bir paket hiçbir şey kanıtlamaz. Testin yakaladığını doğrulamak için kodu bir kez bilerek bozun.
5. **Tek bir yapısal değişiklik yapın.** Bir metot çıkarın, bir değişkeni yeniden adlandırın, ölü bir dalı silin; tek düzenleme, davranış değişikliği yok.
6. **Testleri tekrar çalıştırın.** Yeşilse devam edin. Kırmızıysa hemen geri alın ve daha küçük parçaya inin.
7. **Tek değişikliği commit'leyin.** Küçük commit'ler kesin geri alma noktaları ve okunabilir bir geçmiş verir.
8. **Tekrarlayın, davranışı ayrıca değiştirin.** Yapı temizlendikten sonra davranışa dokunun; kendi commit'lerinde, yeni testlerle.

## Neden hiçbir şeye dokunmadan önce karakterizasyon testi yazılır?

Karakterizasyon testleri, tam anlamadığınız kodun mevcut davranışını sabitler; böylece refactor sırasında kazara oluşan bir değişiklik production olayı yerine kırılan bir test olarak ortaya çıkar. Normal birim testlerinden niyet olarak ayrılırlar: yanlış görünse bile kodun *şu an* döndürdüğü şeye assert edersiniz.

Birkaç kez yaptıktan sonra akış hızlanır. Fonksiyonu gerçekçi girdiyle çağırın, çıktıyı yazdırın veya loglayın, sonra o çıktıyı doğrudan assert'e yapıştırın:

```python
# calculate_fee'nin ne döndürmesi "gerektiğini" bilmiyorsunuz.
# O yüzden ne DÖNDÜRDÜĞÜNÜ yakalayıp sabitliyorsunuz.

def test_characterize_calculate_fee():
    # Production loglarından alınmış gerçek girdiler
    result = calculate_fee(amount=1000, tier="gold", region="EU")

    # Gözlemlenen gerçek çıktıyı beklenen değer olarak yapıştırın
    assert result == 87.50  # 2026-07-01'de yakalandı; "doğru" değil, sadece mevcut
```

`calculate_fee` içinde bir yuvarlama hatası varsa bu test o hatayı bilerek *korur*. Karakterizasyon testi için doğru davranış budur; refactor sırasında işiniz sonucu değil yapıyı değiştirmektir. Hatayı sonra, kendi commit'inde ve amaçlanan değişikliği belgeleyen kendi testiyle düzeltirsiniz.

## Hangi refactoring tekniği hangi duruma uyar?

Farklı legacy sorunları farklı teknikler ister. Bir dikiş yeterken tam yeniden yazıma başvurmak bu alandaki en pahalı hatadır. Durumu en küçük güvenli hamleyle eşlemek için şu tabloyu kullanın:

| Durum | Teknik | Risk | Neden işe yarar |
|-------|--------|------|-----------------|
| Değiştirmen gereken testsiz fonksiyon | Karakterizasyon testi + metot çıkarma | Düşük | Davranışı sabitler, sonra değişikliği izole eder |
| Test edilemeyen bağımlılık yumağı | Dikiş ekleme (bağımlılık enjeksiyonu) | Düşük | Sınırda sahte nesne koymanı sağlar |
| Tüm bir alt sistemi değiştirmek | Strangler fig deseni | Orta | Trafiği yeni koda aşamalı yönlendirir |
| Dosyalara yayılmış tekrar eden mantık | Ortak modül çıkarma | Düşük | Tek doğru kaynak, bir kez test edilir |
| Emin olmadığın riskli değişiklik | Soyutlamayla dallanma | Orta | Eski ve yeni bir flag arkasında yan yana çalışır |
| Artık kimsenin çağırmadığı kod | Sil | En düşük | En güvenli refactor ölü kodu kaldırmaktır |

Dikkat edin: "sıfırdan yeniden yaz" tabloda yok. Tam yeniden yazımlar mevcut mantığa gömülü, yıllarca kazanılmış hata düzeltmelerini çöpe atar ve nadiren zamanında biter. Martin Fowler'ın popülerleştirdiği strangler fig desenini tercih edin: yeni sistemi eskinin kenarlarında inşa edip trafiği parça parça kaydırın, ta ki legacy kod açlıktan sönene kadar.

## Dikişi olmayan legacy kod nasıl değiştirilir?

Kod test edilemeyecek kadar karışıksa, refactor'dan önce bir dikiş ekleyin: davranışı değiştirmeden gerçek bağımlılığı sahtesiyle değiştirebileceğiniz tek bir nokta. En yaygın dikiş bağımlılık enjeksiyonudur; bir iş birlikçiyi fonksiyon içinde kurmak yerine dışarıdan geçirmek.

Hamle şöyle görünür. Önce fonksiyon saati ve veritabanını doğrudan içeride yakalar, bu yüzden izole test edemezsiniz:

```js
// Önce: dikiş yok. Gerçek DB'ye ve gerçek saate gidiyor.
function expireSessions() {
  const now = Date.now();
  const sessions = database.query('SELECT * FROM sessions');
  return sessions.filter(s => s.expiresAt < now);
}

// Sonra: dikişler eklendi. Artık testlerde sahte nesne enjekte edilebilir.
function expireSessions(db = database, clock = Date) {
  const now = clock.now();
  const sessions = db.query('SELECT * FROM sessions');
  return sessions.filter(s => s.expiresAt < now);
}
```

Varsayılan argümanlar mevcut tüm çağıranları değişmeden çalışır tutar, yani bu düzenlemenin kendisi davranış korur. Ama artık bir test sahte `db` ve donmuş bir `clock` geçirebilir; bu da asıl refactor'dan önce ihtiyacınız olan karakterizasyon testlerini yazmanızı sağlar. "Dikiş ekle, sonra test et, sonra değiştir" sırası en zor legacy kod için temel beceridir.

## Büyük bir refactor'da production nasıl kırılmaz?

Büyük refactor'ları, bir hata servisi çökertmek yerine zarif biçimde bozulacak şekilde korumalarla yayınlayın. Amaç, tek bir deploy'un geri alınamaz bir arızaya yol açamamasıdır. Birkaç pratik alışkanlığı birleştirin:

- **Soyutlamayla dallanın.** Değiştirdiğiniz kodun önüne bir arayüz koyun, eski ve yeni implementasyonu bir feature flag arkasında çalıştırın ve anında geri alınabilir bir config değişikliğiyle geçiş yapın.
- **Küçük commit'lerle yayınlayın.** İncelenebilir on commit, kimsenin gerçekten okuyamadığı 4.000 satırlık bir PR'dan iyidir.
- **Her commit'te testleri yeşil tutun.** Kırmızı build "sonra düzeltirim" değil, tam duraktır.
- **Production'da eski ile yeniyi karşılaştırın.** Kritik yollarda iki implementasyonu birlikte çalıştırıp uyuşmazlıkları loglayın; GitHub'ın Scientist kütüphanesi tam bunun için yapılmıştır.
- **Her deploy sonrası metrikleri izleyin.** Hata oranı ve gecikme, "davranış koruyan" bir değişikliğin gerçekten koruyup korumadığını dakikalar içinde söyler.

Geçen çeyrekte 9 yıllık bir faturalama hesaplayıcısını soyutlamayla dallanarak değiştirdik. İki hafta gölge modda iki motoru birlikte çalıştırmak, karakterizasyon testlerinin kaçırdığı 11 kenar durumu ortaya çıkardı; hepsi tek bir müşteri yanlış fatura görmeden yakalandı. Bunun dayandığı test temeli için [işe yarayan unit testler nasıl yazılır](/blog/unit-test-nasil-yazilir) rehberimize, yapı hedefleri için de [temiz kod prensipleri kontrol listesine](/blog/temiz-kod-prensipleri) bakın.

## Legacy kodu ne zaman refactor etmemeli?

Çalışan, nadiren değişen ve önünüzü tıkamayan kodu refactor etmeyin; kararlılığın değeri vardır ve her düzenleme risk taşır. Refactoring ancak yapmak üzere olduğunuz bir değişikliğin maliyetini düşürüyorsa hak eder. Kararlı bir modülü sırf estetik için yeniden diziyorsanız, karşılığı olmayan bir risk bütçesi harcıyorsunuz.

Basit bir test: bu refactor bir sonraki özelliği veya hata düzeltmesini ucuzlatıyor mu? Evetse, o işin parçası olarak yapın. Mümkün kıldığı değişikliği adlandıramıyorsanız, dokunmayın. En iyi refactor'lar, açtıkları özellik sorunsuz yayınlandığı için kimsenin fark etmediği olanlardır. Refactor sonrası daha temiz yapının ardındaki kalıplar için [geliştiriciler için tasarım kalıpları](/blog/yazilim-tasarim-kaliplari) rehberimiz ve [yazılım mühendisliği kategori](/blog/software-engineering) sayfamız daha derine iner.

## Sıkça Sorulan Sorular

### Refactoring ile legacy kodu yeniden yazmak arasındaki fark nedir?

Refactoring, mevcut testlere karşı küçük ve doğrulanmış adımlarla davranışı korurken yapıyı iyileştirir. Yeniden yazmak ise kodu tamamen değiştirir ve orijinaline gömülü, birikmiş hata düzeltmeleriyle kenar durum işlemeyi çöpe atar. Refactoring düşük riskli ve kademelidir; yeniden yazımlar yüksek riskli olup çoğu kez takvimi aşar. Yeniden yazımı yalnızca kod gerçekten kurtarılamazsa seçin, o zaman bile hepsini birden değiştirmek yerine aşamalı olarak sıkıştırarak (strangle) yapın.

### Hiç testi olmayan legacy kodu nasıl refactor ederim?

Bir şeyi değiştirmeden önce test ekleyin. Bir dikiş bulun (public metot ya da bir I/O sınırı), kodu gerçekçi girdilerle çağırın ve hatalar dahil şu an ne döndürüyorsa ona assert eden karakterizasyon testleri yazın. Dikiş yoksa, önce bağımlılık enjeksiyonuyla bir dikiş ekleyin; bu düzenlemenin kendisi davranış korur. Davranış sabitlendikten sonra yeniden yapılandırmaya başlarsınız.

### Her refactoring adımı ne kadar küçük olmalı?

Tek bir `git revert` ile geri alınabilecek ve tek bir test çalıştırmasıyla doğrulanabilecek kadar küçük. Pratikte bu, commit başına bir metot çıkarma, bir yeniden adlandırma ya da bir ölü dal silme demektir. Bir adım, davranışı değiştirip değiştirmediğinden emin olamayacağınız kadar büyük hissettiriyorsa, çok büyüktür; bölün. Küçük adımlar yavaş hissettirir ama neyi bozduğunu bulamadığınız dev bir değişikliği debug etmekten çok daha hızlıdır.

### Refactoring'de strangler fig deseni nedir?

Strangler fig deseni, legacy bir sistemi kademeli olarak değiştirir: yeni işlevselliği eskinin kenarlarında inşa eder ve trafiği yavaşça eski koddan uzaklaştırır, ta ki eski kod silinebilene kadar. Bir ağacın etrafında büyüyen sarmaşıktan esinlenip Martin Fowler tarafından adlandırılmıştır; bir alt sistemi haftalar veya aylar içinde, tüm süreç boyunca çalışan bir ürünle taşımanızı sağlar ve büyük patlama tarzı yeniden yazımın ya hep ya hiç riskinden kaçınır.
