---
title: "npm 12 Güvenliği: Kurulum Betikleri Artık Varsayılan Kapalı"
slug: "npm-12-guvenlik-kurulum-betikleri"
translationKey: "npm-12-security-defaults-2026"
locale: "tr"
excerpt: "npm 12, 8 Temmuz 2026'da paketlerin preinstall/install/postinstall betiklerini varsayılan olarak kapattı; artık her betiği elle onaylamanız gerekiyor."
category: "devops-cloud"
tags: [nodejs, web-security, ci-cd, open-source]
publishedAt: "2026-09-24"
seoTitle: "npm 12 Güvenlik Varsayılanları: Kurulum Betikleri Kapalı"
seoDescription: "npm 12'de preinstall/install/postinstall betikleri, Git ve uzak URL bağımlılıkları artık varsayılan kapalı. CI/CD geçiş adımları ve ChainDrop dersi burada."
---

Kısa cevap: npm 12, 8 Temmuz 2026'da yayımlandı ve bağımlılıkların `preinstall`, `install`, `postinstall` betiklerini varsayılan olarak çalıştırmayı durdurdu; aynı şekilde Git ve uzak URL üzerinden gelen bağımlılıklar da artık siz izin vermeden çözülmüyor. Bu, npm'in on yıllardır süren "kurulum sırasında her şeye izin ver" varsayımından ilk kez tam anlamıyla vazgeçtiği an.

## npm 12'de tam olarak ne değişti?

Üç varsayılan aynı anda değişti. Birincisi `allowScripts` varsayılanı kapalıya döndü: bağımlılıkların yaşam döngüsü betikleri (`preinstall`, `install`, `postinstall`) ve örtük `node-gyp` derlemeleri artık siz açıkça izin vermeden çalışmıyor. İkincisi `--allow-git` varsayılanı "hiçbiri" oldu; Git üzerinden tanımlanan bağımlılıklar izin verilmeden çözülmüyor. Üçüncüsü `--allow-remote` varsayılanı da "hiçbiri"; uzak URL'den gelen bağımlılıklar aynı şekilde engelleniyor.

Bu üç değişiklik birlikte, `npm install` çalıştırdığınızda hiçbir bağımlılığın sizin bilginiz dışında kod çalıştıramamasını garanti altına almayı hedefliyor. Değişikliklerin duyurulması Haziran 2026'da GitHub'ın kendi değişiklik günlüğünde de yer buldu; bu da GitHub Actions üzerinde çalışan CI pipeline'larının npm 12'ye geçişten doğrudan etkileneceği anlamına geliyordu.

Önemli bir ayrıntı: bu sadece doğrudan bağımlılıklarınızı değil, bağımlılıklarınızın bağımlılıklarını da kapsıyor. Eskiden derin bir bağımlılık ağacının içinde üç seviye aşağıdaki bir paketin postinstall betiği sizin haberiniz olmadan çalışabiliyordu; npm 12'de bu paket de dahil olmak üzere ağaçtaki her paketin betiği tek tek onay bekliyor. Bu, ChainDrop gibi saldırıların en sinsi yanını doğrudan hedef alıyor: solucan kendi paketini değil, sizin zaten güvendiğiniz ve muhtemelen hiç incelemediğiniz bir bağımlılığın içinden çalışıyordu.

## Bu değişikliğe neden ihtiyaç duyuldu?

Doğrudan gerekçe, postinstall betiklerinin son bir yılın en yıkıcı npm tedarik zinciri saldırılarının teslimat mekanizması olması. Ağustos 2026'da ortaya çıkan ChainDrop solucanı bunun en güncel ve en çarpıcı örneği: saldırganlar bir bakımcının GitHub hesabını ele geçirip `keyv` ve `cacheable` isim alanlarına 11 kötü amaçlı paket sızdırdı; solucan `keyv@6.0.0` ile başlayıp çalınan npm ve GitHub kimlik bilgilerini kullanarak kendini yaydı.

Sonuç: 4 saatten kısa sürede 444 paket ve 2.212 sürüm bulaştırıldı, etkilenen paketlerin toplam haftalık indirme sayısı 500 milyonu aştı. Kötü amaçlı yük, ağır şekilde gizlenmiş bir Bun tabanlı JavaScript dosyasıydı ve kurulum tamamlanmadan önce `preinstall` kancası üzerinden otomatik olarak çalışıyordu — yani etkilenen bir paketi `npm install` ile kurmak, hiçbir ek adım gerekmeden kimlik bilgilerinizin çalınması için yeterliydi.

## CI/CD pipeline'ımı nasıl güncellerim?

Önce mevcut bağımlılık ağacınızda hangi paketlerin betik çalıştırmaya çalıştığını görün:

```bash
npm approve-scripts --allow-scripts-pending
```

Bu komut, betiği olan paketleri listeler; güvendiklerinizi onaylarsınız ve npm güncellenmiş `package.json` içine bu onayları yazar. Onayları commit'lemeden CI'da build almaya çalışırsanız, daha önce sorunsuz kurulan bir paket artık betiğini çalıştıramadığı için build kırılabilir — bu yüzden geçişi yerel ortamda tamamlayıp onay listesini commit'lemek, CI'da sürpriz kırılmaların önüne geçmenin tek güvenilir yolu. Ekip büyükse ve birçok geliştirici paralel çalışıyorsa, onay listesindeki her değişikliği code review sürecinden geçirmek de kimin hangi betiğe neden güvendiğini kayıt altına alan ayrı bir kontrol katmanı ekliyor.

| npm sürümü | Kurulum betikleri | Git bağımlılıkları | Uzak URL bağımlılıkları |
|---|---|---|---|
| npm 11 ve öncesi | Varsayılan açık | Varsayılan çözülür | Varsayılan çözülür |
| npm 12 | Varsayılan kapalı, elle onay gerekir | Varsayılan "hiçbiri", elle izin gerekir | Varsayılan "hiçbiri", elle izin gerekir |

## Hangi paketlere güvenip hangilerine güvenmemeliyim?

Betik çalıştırma isteyen her paket otomatik olarak şüpheli değildir — `node-sass` veya `sharp` gibi yerel derleme gerektiren paketler meşru nedenlerle `install` betiği kullanır. Asıl soru bakımcının hesap güvenliği ve paketin güncel sürümünün beklenmedik bir davranış değişikliği taşıyıp taşımadığı — bir paketin bir önceki sürümünde hiç betik yokken yeni sürümde aniden bir betik eklenmesi, tek başına araştırılmayı hak eden bir kırmızı bayrak. Onay verirken şu üç katmanı birlikte uygulamak faydalı: lockfile'ı her zaman commit'lemek, bağımlılıkları tam sürüme sabitlemek (caret aralığı yerine) ve npm'in provenance (paket menşei) doğrulamasını CI'da zorunlu kılmak. Bakımcı hesaplarının 2FA veya passkey ile korunup korunmadığını kontrol etmek de üçüncü parti riskini azaltır — kendi yayın token'larınızı en az yetkiyle (yalnızca yayınlama, okuma değil) sınırlamak gibi.

## pnpm veya Yarn Berry'ye geçmek gerekir mi?

Gerekmiyor, ama düşünmeye değer. pnpm ve Yarn Berry (Plug'n'Play modu) zaten varsayılan olarak kurulum betiklerini kısıtlayan bir yapıya sahipti; npm 12 bu konuda rakiplerine yaklaşmış oldu. Bun ise farklı bir risk profiline sahip — hızlı ama betik izinleri konusunda henüz npm 12 kadar katı değil. Ekibiniz zaten npm kullanıyorsa geçiş yapmanıza gerek yok; npm 12'nin varsayılanları zaten aynı korumayı sağlıyor. Yeni bir proje başlatıyorsanız, üçünün de betik izin modelini karşılaştırıp ekibinizin CI disiplinine uyanı seçmek mantıklı.

Açıkçası bu, npm'in geç kalmış ama doğru bir hamlesi: ekosistemin en büyük tek saldırı yüzeyi olan "kurulum sırasında sessizce çalışan kod" varsayımını nihayet tersine çevirdi. Riski azaltır ama sıfırlamaz — çalınan bir yayın token'ıyla meşru görünen bir sürüm hâlâ yayınlanabilir, bu yüzden 2FA ve provenance kontrolleri betik engelinin yerini almıyor, onu tamamlıyor.

## Betik engelinin dışında hangi katmanları da eklemeliyim?

npm 12'nin varsayılanları tek başına yeterli değil; ChainDrop gibi saldırılar çalıntı kimlik bilgileriyle *meşru* bir sürüm yayınlayabildiği için, betik engeli o senaryoyu durdurmuyor. Gerçek bir savunma dört katmanı birlikte çalıştırıyor: lockfile'ı (`package-lock.json`) her zaman commit'lemek ve CI'da `npm ci` kullanmak (böylece kurulum sırasında sürüm aralığı yeniden çözülmüyor); bağımlılıkları caret (`^`) yerine tam sürüme sabitlemek, özellikle geniş kullanıcı kitlesine sahip yardımcı paketlerde; npm'in provenance doğrulamasını (`npm publish --provenance`) hem kendi paketleriniz hem de mümkünse bağımlılıklarınız için zorunlu kılmak; ve yayın token'larını en az yetkiyle sınırlamak — CI'daki bir token'ın yalnızca yayınlama yapabilmesi, okuma/silme yetkisinin olmaması gibi.

Bu dört katmanın hiçbiri tek başına yeterli değil ama birlikte, "bir bakımcı hesabı ele geçirilirse ne olur" sorusuna verilen cevabı büyük ölçüde değiştiriyor: token çalınsa bile provenance doğrulaması olmayan bir sürüm şüpheli görünür, lockfile sabitse otomatik güncelleme onu hemen çekmez ve minimal yetkili token çalınsa bile saldırganın yapabileceği zarar sınırlı kalır.

Ekip içinde bu geçişi yönetirken pratik bir sıra izlemek işe yarıyor: önce yerel geliştirme ortamında `npm approve-scripts` ile onay listesini oluşturup commit'leyin, sonra CI pipeline'ında `npm ci --ignore-scripts` yerine onaylı listeyle normal kurulumun geçtiğini doğrulayın, en son da provenance ve 2FA zorunluluğunu yayın sürecine ekleyin. Bu sırayı tersine çevirip önce provenance zorlaması yapmak, henüz onay listesi olmayan bir ekipte gereksiz build kırılmalarına yol açabiliyor.

## Sıkça Sorulan Sorular

### npm 12'ye geçince mevcut projem bozulur mu?

Kısa cevap: Betik çalıştıran bağımlılıklarınız varsa evet, `npm install` build adımını atlayabilir veya native modül derlemesi başarısız olabilir. `npm approve-scripts --allow-scripts-pending` ile hangi paketlerin betik istediğini görüp onayladıktan sonra geçiş sorunsuz tamamlanır.

### ChainDrop solucanı hangi paketleri etkiledi?

Kısa cevap: Ağustos 2026'da ortaya çıkan ChainDrop, `keyv` ve `cacheable` isim alanlarındaki paketlerden başlayarak 4 saatten kısa sürede 444 paketi ve 2.212 sürümü bulaştırdı; etkilenen paketlerin toplam haftalık indirmesi 500 milyonu aşıyor.

### npm 12'de betikleri toptan nasıl onaylarım?

Kısa cevap: `npm approve-scripts --allow-scripts-pending` komutu betik isteyen tüm paketleri listeler; onayladıklarınız `package.json` içine yazılır. Bu dosyayı commit'lemeden CI ortamında build almak, betikleri yine engellenmiş bırakır.

**Kaynaklar:** [The Hacker News: npm 12 install betiklerini kapatıyor](https://thehackernews.com/2026/07/npm-12-disables-install-scripts-by.html), [Microsoft Security Blog: ChainDrop solucanı analizi](https://www.microsoft.com/en-us/security/blog/2026/08/04/chaindrop-supply-chain-compromise-anatomy-self-propagating-worm/), [SecurityWeek: 400'den fazla npm paketi ChainDrop ile bulaştı](https://www.securityweek.com/over-400-npm-packages-infected-in-chaindrop-supply-chain-attack/).
