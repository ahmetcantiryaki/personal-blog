---
title: "Temiz Kod Prensipleri: Pratik Kontrol Listesi"
slug: "temiz-kod-prensipleri"
translationKey: "clean-code-principles"
locale: "tr"
excerpt: "AI kodun yarısını yazarken temiz kod prensipleri daha da kritik. İsimlendirme, fonksiyon boyutu, yorum ve testleri her PR'da 30 saniyede denetleyen güncel kontrol listesi."
category: "software-engineering"
tags: ["clean-code", "best-practices", "code-quality"]
publishedAt: "2026-07-01"
seoTitle: "Temiz Kod Prensipleri: Pratik Kontrol Listesi (2026)"
seoDescription: "AI çağında temiz kod prensipleri kontrol listesi: isimlendirme, küçük fonksiyonlar, yorum ve test edilebilirliği her kod incelemesinde adım adım denetleyin."
---

Yaygın inanç şu: AI kodun yaklaşık %41'ini yazdığına göre temiz kod prensipleri artık bir lüks; model nasılsa "çalışan" bir şey üretir. Veri tam tersini söylüyor. Temmuz 2026 itibarıyla elimizdeki en güçlü sinyaller, disiplinin öldüğünü değil, fiyatının arttığını gösteriyor.

Google'ın [2025 DORA raporuna](https://cloud.google.com/blog/products/ai-machine-learning/announcing-the-2025-dora-report) göre AI, iyi mühendislik pratiklerini büyüten bir çarpan: throughput'u %2-18 artırıyor ama disiplin zayıfsa değişiklik başarısızlık oranını (change failure rate) da yükseltiyor. Yani AI kötü kodu daha hızlı üretir. Bu kontrol listesi tam da o yüzden var: üretilen kodu, kim yazmış olursa olsun, 30 saniyede denetlemek için.

## Temiz kod tam olarak ne demek?

Temiz kod, doğru çalışmanın ötesinde kolay okunan, kolay değiştirilen ve düşük hata riski taşıyan koddur. Robert C. Martin'in tanımıyla temiz kod "her fonksiyonun tek bir şey yaptığı ve onu iyi yaptığı" koddur. Amaç zeki görünmek değil; altı ay sonra o dosyayı açan kişinin (çoğunlukla siz olursunuz) bağlam kaybetmeden ilerleyebilmesidir.

Bu bir stil tercihi değil, bakım maliyeti kararıdır. Ve maliyet gerçek: GitClear'ın 211 milyon satırlık analizinde kod churn'ü 2023'te %4,5'ten 2024'te %5,7'ye çıktı, refactoring %39,9 düştü, kopyala-yapıştır satırlar %17,1 arttı. Yani "hızlı ürettik" hissi, 30-90 gün sonra bakım borcu olarak geri dönüyor.

## Temiz kod prensipleri kontrol listesi (adım adım)

Bir pull request incelerken bu sırayı takip edin. Her madde bağımsız denetlenebilir; hepsini aynı anda düzeltmeye çalışmayın:

1. **İsimleri niyete göre okuyun.** Değişken, fonksiyon ve sınıf adları ne yaptığını yorum olmadan anlatıyor mu? `d`, `tmp`, `data2` gibi adlar yeniden adlandırılmalı.
2. **Fonksiyon boyutunu ölçün.** Her fonksiyon tek bir sorumluluk taşısın; 20 satırı aşan gövdeleri parçalamayı düşünün, 50 satır üstü neredeyse her zaman bölünmeli.
3. **Yorumları sorgulayın.** Yorum "ne" yaptığını değil "neden" yapıldığını mı açıklıyor? Kodu tekrar eden yorum siliniyor, gizli bir kararı açıklayan yorum kalıyor.
4. **Tekrarı avlayın.** AI asistanları en çok burada tökezliyor: aynı mantık iki üç yerde kopyalanmış mı? DRY ihlallerini ortak fonksiyona çıkarın, ama erken soyutlamadan kaçının.
5. **İç içe geçmeyi düşürün.** 3 seviyeden derin `if`/`for` yuvalanması varsa erken dönüş (guard clause) ile düzleştirin.
6. **Sihirli sayıları temizleyin.** Kod içine gömülü `86400`, `0.15` gibi değerler adlandırılmış sabitlere taşınmalı.
7. **Hata yönetimini denetleyin.** Hatalar sessizce yutuluyor mu? Her hata ya işlenmeli ya da anlamlı bağlamla yukarı taşınmalı.
8. **Testleri kontrol edin.** Değişen mantığın testi var mı ve testler davranışı mı yoksa uygulama detayını mı doğruluyor?

## İyi bir isim ile kötü bir isim arasındaki fark nedir?

İyi bir isim, okuyucunun koda bakmadan niyeti anlamasını sağlar; kötü bir isim onu kaynağa geri gitmeye zorlar. En güçlü sinyal: fonksiyon veya değişken adını okuduğunuzda içine bakma ihtiyacı duymuyorsanız isim iyidir. İsimlendirme, temiz kod prensipleri içinde en yüksek getirili tek yatırımdır çünkü her okumada işe yarar.

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

İkinci hali daha uzun görünse de her parça bağımsız test edilebilir ve `saveUser` gövdesi artık bir özet gibi okunur. Bu ayrıştırma tasarım kararlarını da netleştirir; konuyu derinleştirmek için [yazılım tasarım kalıpları rehberimize](/tr/posts/yazilim-tasarim-kaliplari) ve tip düzeyinde temizlik için [ileri TypeScript kalıpları yazımıza](/tr/posts/ileri-typescript-kaliplari) göz atabilirsiniz.

## Linter işi bitirir mi, insan incelemesine hâlâ gerek var mı?

İkisi farklı katmanlar; biri diğerinin yerini tutmaz. Linter mekanik kuralları (biçim, kullanılmayan değişken, sihirli sayı) yakalar; insan ise niyeti ve tasarımı değerlendirir. Ama araç dünyası da hızla ilerliyor, o yüzden sürümlerinizi güncel tutun:

| Araç | Güncel durum (Tem 2026) | Neyi yakalar | Not |
|------|--------------------------|--------------|-----|
| [ESLint](https://eslint.org/blog/2026/02/eslint-v10.0.0-released/) | v10 (Şub 2026); v9 EOL 6 Ağu 2026 | Stil, olası hata, kullanım kalıpları | `.eslintrc` v10'da tamamen kaldırıldı, flat config zorunlu |
| [SonarQube Server](https://docs.sonarsource.com/sonarqube-server/2026.1/quality-standards-administration/ai-code-assurance/overview) | 2026.1 LTA | Karmaşıklık, kod kokusu, güvenlik | "Sonar way for AI Code" quality gate ile AI kodu için sıkı kapı |
| Prettier | v3.x | Salt biçimlendirme | Tartışmayı bitirir, kalite ölçmez |
| İnsan incelemesi | — | Niyet, isimlendirme, tasarım | Otomatikleştirilemeyen tek katman |

Pratik kural: mekanik olan her şeyi CI'a bırakın ki insan incelemesi yalnızca yargı gerektiren yerlere odaklansın. SonarQube'un ayrı bir "AI Code" kapısı sunması boşuna değil; asistan üretimi kodu insan yazımı koddan daha sıkı denetlemek artık ana akım bir pratik.

## Yorum yazmalı mıyım, yoksa kodu mu düzeltmeliyim?

Kural basit: yorum yazma ihtiyacı çoğu zaman kodun yeterince açık olmadığının işaretidir. Önce ismi ve yapıyı düzelterek yorumu gereksiz kılmayı deneyin; ancak "neden" sorusunun cevabı koddan çıkarılamıyorsa yorum yazın.

- **Silin:** `i++; // i'yi artır` gibi kodu tekrar eden yorumlar.
- **Yazın:** `// Sağlayıcı API'si 30 sn üstü isteklerde 500 dönüyor, o yüzden 25 sn timeout` gibi gizli bilgiyi açan yorumlar.
- **Dönüştürün:** Uzun bir açıklama yorumu genelde iyi adlandırılmış bir yardımcı fonksiyona dönüşebilir.
- **Güncel tutun:** Yanlış yorum, yorum olmamasından kötüdür; kodu değiştirdiğinizde yorumu da değiştirin.

## Testler temiz kodun neresinde durur?

Testler temiz kodun güvenlik ağıdır: iyi testler olmadan yapılan her yeniden düzenleme bir kumar olur. Temiz bir test paketi davranışı doğrular, uygulama detayını değil; böylece kodun içini değiştirdiğinizde testler kırılmadan kalır. Kod incelemesinde test tarafında şunlara bakın: kapsam davranışa mı odaklı, test adları niyeti anlatıyor mu, testler izole mi ve kenar durumlar (boş girdi, null, sınır değerleri) test ediliyor mu?

Test öncelikli çalışmayı ekibe yerleştirmek isterseniz [işe yarayan unit testler nasıl yazılır](/tr/posts/unit-test-nasil-yazilir) yazımıza ve daha geniş çerçeve için [yazılım mühendisliği](/tr/category/yazilim-muhendisligi) kategori sayfamıza bakabilirsiniz.

## En sık yapılan temiz kod hataları

Yüzlerce kod incelemesinde tekrar tekrar gördüğümüz, iyi niyetli ama ters tepen alışkanlıklar:

- **Erken soyutlama.** Henüz iki örneği olmayan mantığı "ileride lazım olur" diye genelleştirmek kodu okunmaz kılar. Önce tekrarı görün, sonra soyutlayın.
- **AI çıktısını körlemesine kabul etmek.** Asistan üretimi kodun %17 artan yinelenme oranını unutmayın; [AI kod asistanı kullanırken yapılan hatalar](/tr/posts/ai-kod-asistani-hatalari) çoğu zaman "çalışıyor, demek ki temiz" yanılgısından çıkar.
- **Yorumla kötü kodu örtmek.** Karmaşık bir bloğu açıklayan uzun yorum yerine bloğu adlandırılmış bir fonksiyona çıkarın.
- **Her şeyi tek seferde temizlemek.** Devasa bir "cleanup" PR'ı incelenemez; küçük ve odaklı değişiklikler her zaman kazanır. Eski kodu güvenli iyileştirmek için [legacy kod refactoring](/tr/posts/legacy-kod-refactoring) yaklaşımını izleyin.

Amaç mükemmellik değil, her dokunuşta kodu bıraktığınızdan biraz daha temiz bırakmaktır.

## Sıkça Sorulan Sorular

### AI kod yazarken temiz kod prensipleri hâlâ önemli mi?

Öncekinden daha önemli. 2025 DORA raporunda katılımcıların %59'u AI'ın kod kalitesine olumlu etkisinden söz etse de %30'u ürettiği koda "az ya da hiç" güvenmiyor. AI, mevcut disiplini büyüten bir çarpan; kontrol listesi olmayan ekipte hızlanan tek şey teknik borç oluyor.

### Temiz kod prensipleri performansı düşürür mü?

Genelde hayır. Fonksiyonları bölmek veya değişkenleri adlandırmak modern derleyiciler ve JIT'ler tarafından zaten optimize edilir; ölçülebilir maliyeti nadiren olur. Gerçek bir sıcak yolda darboğaz görürseniz orayı ölçüp yerel olarak optimize edin, ama tüm kod tabanını okunmaz kılmayın.

### Kod incelemesinde bu kontrol listesini nasıl uygularım?

Listeyi PR şablonunuza onay kutusu bloğu olarak ekleyin ve her incelemede yukarıdan aşağıya geçin. İlk haftalar biraz yavaşlatır, birkaç sprint içinde otomatik hale gelir. Bir PR'da beşten fazla ihlal varsa maddeleri tek tek yorumlamak yerine yazarla kısa bir eşli oturum yapmak daha hızlıdır.

### Eski (legacy) bir kod tabanında nereden başlamalıyım?

Baştan sona büyük bir temizlik yapmayın; "izci kuralını" uygulayın: her dokunduğunuz dosyayı bıraktığınızdan biraz daha temiz bırakın. Yalnızca üzerinde zaten çalıştığınız kodu iyileştirin, testle koruyun ve değişikliği küçük tutun. Böylece risk almadan kod tabanı zamanla düzelir.
