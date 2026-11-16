---
title: "Gerçekten Okunan Bir README Nasıl Yazılır?"
slug: "iyi-readme-nasil-yazilir"
translationKey: "write-readme-that-gets-used-2026"
locale: "tr"
excerpt: "Okunan bir README, projenin ne işe yaradığını tek cümlede söyler, ardından temiz bir makinede bir dakikadan kısa sürede çalışan bir hızlı başlangıç verir."
category: "software-engineering"
tags: ["documentation", "open-source", "developer-experience", "best-practices"]
publishedAt: "2026-11-16"
seoTitle: "Gerçekten Okunan Bir README Nasıl Yazılır?"
seoDescription: "Okunan bir README, projenin ne işe yaradığını tek cümlede söyler, ardından temiz bir makinede bir dakikadan kısa sürede çalışan bir hızlı başlangıç verir."
---

Kısa cevap: Okunan bir README, önce projenin ne yaptığını ve neden işe yaradığını tek cümleyle anlatır, sonra bir yabancının bir dakikadan kısa sürede bitirebileceği bir hızlı başlangıç sunar; API detayları, katkı kuralları ve sorun giderme gibi her şey bunun altına gelir. Terk edilen depoların çoğu onuncu adımda değil, ilk iki adımda başarısız olur.

Bir keresinde tam ihtiyacım olan entegrasyonu vadeden bir projeyi yıldızladım, README'yi açtım ve kurulum talimatlarının olması gereken yerde dört rozet, bir logo ve "Yakında Geliyor" yazan bir bölüm buldum. Sekmeyi kapattım, kendi versiyonumu sıfırdan yazdım. Başarısızlığın tamamı bu hikâyede: README bana sırada ne yapacağımı söylemedi, ben de hiçbir şey yapmadım.

## README'de kat edilmeden önce ne olmalı?

Bir ziyaretçinin okuduğu ilk şey iki soruyu birden cevaplamalı: bu ne işe yarıyor, neden alternatifler yerine bunu kullanayım. Tek cümle yeterli; "İki Postgres şemasını karşılaştırıp migration SQL'i üreten bir CLI" ifadesi, bir paragraflık pazarlama dilinden daha fazlasını anlatır. Bu cümleyi başlığın hemen altına, rozetlerden, logodan ve içindekiler tablosundan önce koyun.

GitHub, bir README dosyasındaki Markdown başlıklarından otomatik olarak bir içindekiler tablosu oluşturur; bu yüzden elle yazılmış bir tablo gereksiz bir iştir ve bir bölüm adını değiştirdiğiniz anda eskir. Bunu atlayın, platform sizin için oluştursun.

## 30 saniyelik hızlı başlangıç neden eksiksiz bir anlatımdan daha iyidir?

Bir hızlı başlangıcın işi, birini sıfırdan çalışan bir sonuca en hızlı şekilde ulaştırmaktır, her bayrağı belgelemek değildir. GitHub'daki en çok referans verilen README yapılarından biri olan [Standard Readme spesifikasyonu](https://github.com/RichardLitt/standard-readme), "Install" ve "Usage" bölümlerini daha uzun bir "API" bölümünden tam da bu yüzden ayırır: hızlı yol kısa kalsın diye.

Hızlı başlangıçlar genelde üç tekrar eden nedenden başarısız olur: hiçbir yerde yazılmamış bir ön koşul ("Node 20+ gerektirir" ifadesi hiçbir yerde yok), sessizce çürümüş bir sürüm kilidi (geçen yılın sürümüne karşı çalışan ama bu sürüme karşı çalışmayan bir komut) veya README'yi elle düzenledikten sonra hiç yeniden çalıştırılmamış bir kopyala-yapıştır komutu. Üçünün de çözümü mekanik: her yayından önce kendi hızlı başlangıcınızı temiz bir makinede veya taze bir container'da çalıştırın, sadece yazdığınız gün değil.

```markdown
# proje-adi

Tek cümle: ne yapıyor ve kimin için.

## Kurulum

\`\`\`bash
npm install proje-adi
\`\`\`

## Hızlı Başlangıç

\`\`\`bash
npx proje-adi init
npx proje-adi run ./ornek.json
\`\`\`

## Kullanım

Altın yolu kapsayan tek örnek, her bayrak değil.

## Yapılandırma

| Seçenek | Varsayılan | Ne yapar |
|---|---|---|
| `--timeout` | `30s` | Başarısız olmadan önce maksimum bekleme |

## Sorun Giderme

- **"command not found"** → Node 20+ gerekiyor.
- **Boş çıktı** → dosya yolunun proje köküne değil, çalışma dizinine göre olduğunu kontrol edin.

## Katkıda Bulunma

CONTRIBUTING.md dosyasına bakın.

## Lisans

MIT
```

## README bölümleri hangi sırayla gitmeli?

Standard Readme'nin spesifikasyon deposunda referans olarak verdiği kendi uyumlu örneği, bölümleri şöyle sıralıyor: başlık ve tek satırlık açıklama, bir içindekiler tablosu, Background, Install, Usage, bir rozet bölümü, Maintainers, Contributing ve License. Bunu harfiyen takip etmek zorunda değilsiniz, ama altındaki mantık değerli: önce bağlam ve kurulum, ortada derinlemesine referans malzemesi (API, mimari), sonda proje yönetimi (bakımcılar, katkı, lisans).

GitHub'ın kendi rehberliği bunu daha da sıkılaştırıyor: bir README, bir geliştiricinin projeyi kullanmaya ve ona katkıda bulunmaya başlaması için gereken bilgiyi tutmalı, daha uzun dokümantasyon ise bir wiki veya ayrı bir dokümantasyon sitesine ait olmalı. Bu, projeniz bir avuç fonksiyondan fazlasına ulaştığında tam bir API referansını README'nin içine tıkmaya karşı doğrudan bir argüman.

## Hangi README rozetleri gerçekten işe yarar, hangileri sadece dağınıklık yaratır?

Bir rozet, okuyucunun aksi hâlde arayıp bulması gereken bir soruyu cevapladığında işe yarar: build şu anda geçiyor mu, en son yayınlanan sürüm ne, hangi lisansı kabul ediyorum. Bir rozet, tamamen dekoratif olup projeyi kullanıp kullanmama kararından önce okuyucunun ihtiyaç duyduğu hiçbir bilgiyi taşımadığında dağınıklık yaratır.

| Rozet | İşe yarar mı? | Neden |
|---|---|---|
| Build durumu (CI geçti/geçmedi) | Evet | "Şu anda bozuk mu?" sorusunu cevaplar |
| En son sürüm (npm, crates.io) | Evet | "Şimdi kurarsam gerçekte ne alırım?" sorusunu cevaplar |
| Lisans | Evet | Gerçek bir hukuki soruyu tek bakışta cevaplar |
| Bağlantısız genel "powered by X" | Hayır | Hiçbir eyleme dönüştürülebilir bilgi taşımaz |
| Kod kapsama yüzdesi | Değişir | İnsanların bağımlı olacağı bir kütüphane için faydalı, bir CLI aracı için gürültü |
| Sosyal rozetler (yıldız, fork sayısı, salt dekorasyon) | Hayır | Birinin projeyi bugün kullanıp kullanmayacağına karar vermesine yardımcı olmaz |

Standard Readme'nin kendisi bile kendi rozetini isteğe bağlı sayıyor ve rozet üst üste eklemenin README'yi dağıtıp okunabilirliği düşürdüğü konusunda açıkça uyarıyor; en fazla iki üç rozeti, başlığın hemen altında tutun.

Katkı rehberi altta yer alsa da göründüğünden daha önemli: branş ve PR kurallarını başta açıklayan bir proje, [git branch stratejileri karşılaştırmamızda](/tr/posts/git-branch-stratejileri) ele aldığımız trunk-based ile Git Flow arasındaki tercihler gibi, yeni katkıcıları tahmin yürütmeye bırakan bir projeden çok daha temiz ilk pull request'ler alır. Bu değişimin katkıcı tarafını daha çok görmek isterseniz [ilk açık kaynak katkınızı nasıl yapacağınıza](/tr/posts/ilk-acik-kaynak-katkisi) bakabilirsiniz.

## Yapılandırma ve sorun giderme bölümüne ne girer?

Yapılandırma bölümü, kodunuzun açığa çıkardığı her ayarı değil, birinin gerçekten dokunacağı seçenekleri bayrak, varsayılan ve etki şeklinde bir tablo olarak listelemeli. Sorun giderme ise hipotetik uç durumlar değil, gerçek GitHub issue'larınızdan derlenmiş, insanların gerçekten çarptığı hataların kısa, taranabilir bir listesi olmalı. Aynı issue'yu üç kez aynı açıklamayla kapattıysanız, o açıklama issue #214'ün içinde gömülü kalmak yerine README'de olmalı.

## Bugün silinmesi gereken README kokuları neler?

Birkaç kalıp, terk edilmiş veya can sıkıcı bir projeyi güvenilir şekilde tahmin ettiriyor; her biri beş dakikalık bir düzeltme:

- **Rozet duvarı, hızlı başlangıç yok.** İlk çalışan komuttan önce beş rozet görmek, yazarın onboarding'den çok görünüme önem verdiğinin işareti.
- **Artık çalışmayan bir kurulum komutu.** Son büyük sürüm atlamasından sonra README'nin kendi talimatlarını kimse çalıştırmadıysa, bozuk olduğunu varsayın.
- **Lisans dosyası yok.** Lisans olmadan, çoğu yargı alanındaki hukuki varsayılan "tüm haklar saklıdır"dır — açık bir depo için bile — bu da katkı ve yeniden kullanımı hukuken bulanık hâle getirir.
- **Aylarca duran bir "Yakında Geliyor" bölümü.** Özelliği gönderin veya yer tutucuyu kaldırın; eskimiş bir vaat terk edilmişlik gibi okunur.
- **Elle bakımı yapılan bir içindekiler tablosu.** Biri bir bölüm başlığını düzenlediği an gerçek başlıklardan kopacaktır.

Bu koku listesini takip eden GitHub projeleri, hiçbir kod değişikliği olmadan bir gün içinde daha bakımlı görünme eğiliminde; bu da okuyucuların "proje sağlığının" ne kadarını Kasım 2026 itibarıyla sadece README'den yargıladığını gösteriyor. README'nin kendisinin de, bakımsız veya düşük emekli paketlere karşı giderek daha temkinli bir ekosistemde bir güven sinyali olduğunu unutmamak gerek; bu güvenin neden eskisinden daha önemli olduğu için [AI çöpünün açık kaynak güvenliğini nasıl zorladığına](/tr/posts/ai-copu-acik-kaynak-guvenligi) dair yazımıza bakabilirsiniz.

Bu blogda ele alınan daha geniş mühendislik alışkanlıkları için [Yazılım Mühendisliği kategorisine](/tr/category/yazilim-muhendisligi) göz atabilirsiniz.

## Sıkça Sorulan Sorular

### Bir README'deki en önemli cümle hangisi?

Kısa cevap: projenin ne yaptığını ve kimin için olduğunu anlatan, başlığın hemen altına, herhangi bir rozetten önce konan tek cümle. Okuyucular okumaya devam edip etmeyeceklerine saniyeler içinde karar verir, bu karara temel olan da o cümledir.

### README'de içindekiler tablosu gerekli mi?

Hayır, README'niz GitHub üzerindeyse. GitHub, dosya render edildiğinde Markdown başlıklarınızdan otomatik olarak bir içindekiler tablosu oluşturur; bu yüzden elle yazılmış bir tablo, gerçek bölüm başlıklarınızla senkronizasyonu kaçırabilen fazladan bir bakım yüküdür.

### Bir README'nin hızlı başlangıç bölümü ne kadar uzun olmalı?

Kısa cevap: temiz bir makinede bir dakikadan kısa sürede çalışacak kadar kısa — tipik olarak üç ila beş komut. Hızlı başlangıcın işi projenin çalıştığını kanıtlamaktır, her seçeneği belgelemek değil; tam yapılandırma detayını daha aşağıdaki ayrı bir bölüme bırakın.

### Her projenin Standard Readme uyumluluk rozeti olmalı mı?

Hayır. [Standard Readme spesifikasyonu](https://github.com/RichardLitt/standard-readme) kendi uyumluluk rozetini isteğe bağlı sayıyor ve genel olarak rozet üst üste eklemeye karşı öneride bulunuyor; çünkü çok fazla rozet dosyanın üstünü dağıtıp en önemli cümlenin, yani projenin ne yaptığının, okunabilirliğini düşürüyor.

**Kaynaklar:** [Standard Readme spesifikasyonu](https://github.com/RichardLitt/standard-readme), [GitHub Docs: About READMEs](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes).
