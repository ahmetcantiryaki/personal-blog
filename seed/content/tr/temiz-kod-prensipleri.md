---
title: "Temiz Kod Prensipleri: Pratik Kontrol Listesi"
slug: "temiz-kod-prensipleri"
translationKey: "clean-code-principles"
locale: "tr"
excerpt: "Temiz kod prensipleri için pratik bir kontrol listesi: isimlendirme, fonksiyon boyutu, yorumlar ve test edilebilirliği kod incelemesinde adım adım denetleyin."
category: "software-engineering"
tags: ["clean-code", "best-practices", "code-quality"]
publishedAt: "2026-04-25"
seoTitle: "Temiz Kod Prensipleri: Pratik Kontrol Listesi"
seoDescription: "Temiz kod prensipleri için pratik kontrol listesi: isimlendirme, küçük fonksiyonlar, yorumlar ve test edilebilirliği kod incelemesinde adım adım denetleyin."
---

Temiz kod prensipleri özünde tek bir hedefe hizmet eder: kodu, yazan kişi değil sonraki okuyan kişi için optimize etmek. Pratikte bu; niyet belli isimler, küçük ve tek işi olan fonksiyonlar, kendini açıklayan yapı ve sağlam testler demektir. Bu kontrol listesi, her pull request'te 30 saniyede uygulayabileceğiniz somut denetimlere dökülmüş halidir.

Aşağıdaki maddeleri kod incelemesi sırasında sırayla geçerseniz, "iyi hissettiren" belirsiz geri bildirimi bırakıp ölçülebilir kalite kararlarına geçersiniz.

## Temiz kod tam olarak ne demek?

Temiz kod, doğru çalışmanın ötesinde kolay okunan, kolay değiştirilen ve düşük hata riski taşıyan koddur. Robert C. Martin'in tanımıyla temiz kod "her fonksiyonun tek bir şey yaptığı ve onu iyi yaptığı" koddur. Amaç zeki görünmek değil; altı ay sonra o dosyayı açan kişinin (çoğunlukla siz olursunuz) bağlam kaybetmeden ilerleyebilmesidir.

Kısacası temiz kod bir stil tercihi değil, bakım maliyeti kararıdır. Yazılımın ömrü boyunca kod, yazıldığından çok daha fazla okunur; bu yüzden okunabilirliğe yapılan yatırım doğrudan geri döner.

## Temiz kod prensipleri kontrol listesi (adım adım)

Bu sırayı bir pull request incelerken takip edin. Her madde bağımsız denetlenebilir, yani hepsini aynı anda düzeltmeye çalışmayın:

1. **İsimleri niyete göre okuyun.** Değişken, fonksiyon ve sınıf adları ne yaptığını yorum olmadan anlatıyor mu? `d`, `tmp`, `data2` gibi adlar yeniden adlandırılmalı.
2. **Fonksiyon boyutunu ölçün.** Her fonksiyon tek bir sorumluluk taşısın; 20 satırı aşan gövdeleri parçalamayı düşünün, 50 satır üstü neredeyse her zaman bölünmeli.
3. **Yorumları sorgulayın.** Yorum "ne" yaptığını değil "neden" yapıldığını mı açıklıyor? Kodu tekrar eden yorum siliniyor, gizli bir kararı açıklayan yorum kalıyor.
4. **Tekrarı avlayın.** Aynı mantık iki üç yerde kopyalanmış mı? DRY ihlallerini ortak bir fonksiyona çıkarın, ama erken soyutlamadan kaçının.
5. **İç içe geçmeyi düşürün.** 3 seviyeden derin `if`/`for` yuvalanması varsa erken dönüş (guard clause) ile düzleştirin.
6. **Sihirli sayıları temizleyin.** Kod içine gömülü `86400`, `0.15` gibi değerler adlandırılmış sabitlere taşınmalı.
7. **Hata yönetimini denetleyin.** Hatalar sessizce yutuluyor mu? Her hata ya işlenmeli ya da anlamlı bağlamla yukarı taşınmalı.
8. **Testleri kontrol edin.** Değişen mantığın testi var mı ve testler davranışı mı yoksa uygulama detayını mı doğruluyor?

## İyi bir isim ile kötü bir isim arasındaki fark nedir?

İyi bir isim, okuyucunun koda bakmadan niyeti anlamasını sağlar; kötü bir isim ise onu kaynağa geri gitmeye zorlar. En güçlü sinyal: fonksiyon veya değişken adını okuduğunuzda içine bakma ihtiyacı duymuyorsanız isim iyidir. İsimlendirme, temiz kod prensipleri içinde en yüksek getirili tek yatırımdır çünkü her okumada işe yarar.

Aşağıdaki karşılaştırma en sık gördüğümüz kokuları ve düzeltilmiş hallerini gösteriyor:

| Koku | Kötü örnek | Temiz karşılığı | Neden |
|------|-----------|-----------------|-------|
| Anlamsız kısaltma | `usrCnt` | `activeUserCount` | Niyet açık, tahmin gerekmez |
| Boolean belirsizliği | `flag` | `isEmailVerified` | Sorunun cevabını adında taşır |
| Tip ekleme | `userList` | `users` | Tip zaten bellidir, gürültü ekler |
| Belirsiz fiil | `handleData()` | `normalizeInvoiceRows()` | Ne yaptığı ölçülebilir |
| Sihirli sayı | `if (age > 18)` | `if (age > LEGAL_ADULT_AGE)` | Kararın anlamı görünür |

Bir ekip projesinde `process()` adlı 12 farklı fonksiyon bulmuştuk; hiçbiri ne "işlediğini" söylemiyordu. Yeniden adlandırma sonrası kod incelemesi süresi gözle görülür kısaldı çünkü kimse artık gövdeye inmek zorunda kalmıyordu.

## Fonksiyonlar ne kadar küçük olmalı?

Bir fonksiyon tek bir soyutlama seviyesinde tek bir iş yapmalı; pratik hedef genelde 20 satırın altıdır. Boyut kendi başına amaç değil, "tek sorumluluk" ilkesinin ölçülebilir bir vekilidir. Bir fonksiyonu anlatırken "ve" demek zorunda kalıyorsanız (veri çeker **ve** doğrular **ve** kaydeder), muhtemelen üç fonksiyona bölünmeli.

Aşağıdaki örnek, karışık bir fonksiyonun nasıl ayrıştırıldığını gösteriyor:

```js
// Önce: tek fonksiyon üç iş yapıyor
function saveUser(input) {
  if (!input.email.includes('@')) throw new Error('bad email');
  const record = { ...input, createdAt: Date.now() };
  db.insert('users', record);
}

// Sonra: her adım adını taşıyan ayrı bir fonksiyon
function saveUser(input) {
  validateEmail(input.email);
  const record = buildUserRecord(input);
  return persistUser(record);
}
```

İkinci hali daha uzun görünse de her parça bağımsız test edilebilir ve `saveUser` gövdesi artık bir özet gibi okunur. Bu ayrıştırma, tasarım kararlarını da netleştirir; konuyu derinleştirmek için [yazılım tasarım kalıpları rehberimize](/blog/yazilim-tasarim-kaliplari) göz atabilirsiniz.

## Yorum yazmalı mıyım, yoksa kodu mu düzeltmeliyim?

Kural basit: yorum yazma ihtiyacı çoğu zaman kodun yeterince açık olmadığının işaretidir. Önce ismi ve yapıyı düzelterek yorumu gereksiz kılmayı deneyin; ancak "neden" sorusunun cevabı koddan çıkarılamıyorsa yorum yazın. İyi yorum bir kararı, bir ödünleşmeyi veya beklenmedik bir kısıtı belgeler.

- **Silin:** `i++; // i'yi artır` gibi kodu tekrar eden yorumlar.
- **Yazın:** `// Sağlayıcı API'si 30 sn üstü isteklerde 500 dönüyor, o yüzden 25 sn timeout` gibi gizli bilgiyi açan yorumlar.
- **Dönüştürün:** Uzun bir açıklama yorumu genelde iyi adlandırılmış bir yardımcı fonksiyona dönüşebilir.
- **Güncel tutun:** Yanlış yorum, yorum olmamasından kötüdür; kodu değiştirdiğinizde yorumu da değiştirin.

## Testler temiz kodun neresinde durur?

Testler temiz kodun güvenlik ağıdır: iyi testler olmadan yapılan her yeniden düzenleme (refactoring) bir kumar olur. Temiz bir test paketi davranışı doğrular, uygulama detayını değil; böylece kodun içini değiştirdiğinizde testler kırılmadan kalır. İyi bir test aynı zamanda canlı bir dokümandır çünkü fonksiyonun beklenen kullanımını gösterir.

Kod incelemesinde test tarafında şunlara bakın:

- **Kapsam davranışa odaklı mı?** Yüzde 100 satır kapsamı, yanlış şeyleri test ediyorsa değersizdir.
- **Test adları niyeti anlatıyor mu?** `test1` yerine `geçersiz e-postada hata fırlatır` gibi.
- **Testler izole mi?** Bir testin sırası diğerini etkiliyorsa gizli durum sızıntısı vardır.
- **Kenar durumlar var mı?** Boş girdi, null, sınır değerleri ve hata yolları test ediliyor mu?

Test öncelikli çalışmayı ekibe yerleştirmek isterseniz, süreç ayrıntılarını [gelişmiş TypeScript kalıpları yazımızda](/blog/ileri-typescript-kaliplari) ve daha geniş çerçeveyi [yazılım mühendisliği kategori sayfamızda](/blog/software-engineering) bulabilirsiniz.

## En sık yapılan temiz kod hataları

Yüzlerce kod incelemesinde tekrar tekrar gördüğümüz, iyi niyetli ama ters tepen alışkanlıklar:

- **Erken soyutlama.** Henüz iki örneği olmayan bir mantığı "ileride lazım olur" diye genelleştirmek, kodu okunmaz kılar. Önce tekrarı görün, sonra soyutlayın.
- **İsimleri kısaltmak.** Birkaç karakter kazanmak için `calcTot()` yazmak, her okuyanın kafasında bir çeviri adımı yaratır.
- **Yorumla kötü kodu örtmek.** Karmaşık bir bloğu açıklayan uzun yorum yerine bloğu adlandırılmış bir fonksiyona çıkarın.
- **Her şeyi tek seferde temizlemek.** Devasa bir "cleanup" PR'ı incelenemez; küçük ve odaklı değişiklikler her zaman kazanır.

Bu tuzaklardan kaçınmak, temiz kod prensiplerini kurallar listesinden günlük bir alışkanlığa dönüştürür. Amaç mükemmellik değil, her dokunuşta kodu bıraktığınızdan biraz daha temiz bırakmaktır.

## Sıkça Sorulan Sorular

### Temiz kod prensipleri performansı düşürür mü?

Genelde hayır. Fonksiyonları bölmek veya değişkenleri adlandırmak modern derleyiciler ve JIT'ler tarafından zaten optimize edilir; ölçülebilir bir maliyeti nadiren olur. Gerçek bir sıcak yolda (hot path) darboğaz görürseniz orayı ölçüp yerel olarak optimize edin, ama tüm kod tabanını okunmaz kılarak "performans" adına ödün vermeyin.

### Kod incelemesinde bu kontrol listesini nasıl uygularım?

Listeyi PR şablonunuza bir onay kutusu bloğu olarak ekleyin ve her incelemede yukarıdan aşağıya geçin. İlk haftalar biraz yavaşlatır, ancak birkaç sprint içinde maddeler otomatik hale gelir. İpucu: bir PR'da beşten fazla ihlal varsa maddeleri tek tek yorumlamak yerine yazarla kısa bir eşli oturum yapmak daha hızlıdır.

### Temiz kod ile aşırı mühendislik arasındaki sınır nerede?

Sınır basit bir soruyla belirlenir: bu soyutlama bugün var olan somut bir tekrarı mı çözüyor, yoksa varsayımsal bir geleceği mi? Temiz kod mevcut karmaşıklığı azaltır; aşırı mühendislik ise henüz var olmayan bir ihtiyaç için karmaşıklık ekler. Şüphedeyken daha basit ve daha az soyut olanı seçin.

### Eski (legacy) bir kod tabanında nereden başlamalıyım?

Baştan sona büyük bir temizlik yapmayın; bunun yerine "izci kuralını" uygulayın: her dokunduğunuz dosyayı bıraktığınızdan biraz daha temiz bırakın. Yalnızca üzerinde zaten çalıştığınız kodu iyileştirin, testle koruyun ve değişikliği küçük tutun. Böylece risk almadan kod tabanı zamanla düzelir.
