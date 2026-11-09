---
title: "Özellikleri Durdurmadan Teknik Borç Nasıl Ödenir?"
slug: "ozellik-durdurmadan-teknik-borc-odeme"
translationKey: "pay-down-tech-debt-without-freezing"
locale: "tr"
excerpt: "Kısa cevap: teknik borcu her sprint'te sabit bir kapasite dilimiyle feature işine gömerek ödeyin; büyük yeniden yazımlar genelde başarısız olur."
category: "software-engineering"
tags: ["legacy-code", "refactoring", "best-practices", "developer-experience"]
publishedAt: "2026-11-09"
seoTitle: "Özellikleri Durdurmadan Teknik Borç Nasıl Ödenir?"
seoDescription: "Kısa cevap: teknik borcu her sprint'te sabit bir kapasite dilimiyle feature işine gömerek ödeyin; büyük yeniden yazımlar genelde başarısız olur."
---

Kısa cevap: teknik borcu ayrı bir "debt sprint" veya büyük yeniden yazım projesiyle değil, her sprint'te sabit bir kapasite dilimini (örneğin %15-20) borç ödemeye ayırarak ve feature işinin içine gömerek ödersiniz. Ward Cunningham'ın 1992'de ortaya attığı orijinal metafor, borcun kötü olduğunu değil, erken teslim etmenin bir bedeli olduğunu ve bu bedelin düzenli ödenmesi gerektiğini anlatıyordu — 2026'da da bu çerçeve geçerliliğini koruyor.

## Büyük yeniden yazım neden genelde başarısız olur?

Bir sistemi sıfırdan yazmak, o sistemin yıllar içinde biriken örtük iş kurallarını yeniden keşfetmeyi gerektirir; bu kurallar genelde hiçbir dokümanda yazılı değildir, sadece eski kodun davranışında gizlidir. Yeniden yazım süresince özellik geliştirme durur veya iki kod tabanını paralel bakımla sürdürmeniz gerekir — ikisi de iş tarafını hoşnutsuz eder ve proje uzadıkça pes etme riski artar.

## "Debt sprint"ler neden işe yaramıyor?

Haftalarca süren özel bir "borç ödeme sprinti" ayırmak cazip görünür ama iki sorunu var: iş tarafı bu süreyi "görünür özellik yok" olarak görür ve bir dahaki sefer onaylamakta zorlanır, ayrıca borç tek seferde değil sürekli birikir — bir sprint'te temizlenen kod, altı ay sonra yine kirlenir çünkü üretim süreci değişmedi. Sürekli, küçük ve feature işine gömülü ödeme, bu iki sorunu da ortadan kaldırır.

## Teknik borcu nasıl sınıflandırmalısınız?

Martin Fowler'ın 2009 tarihli Technical Debt Quadrant'ı, borcu iki eksende sınıflandırır: kasıtlı mı yoksa fark edilmeden mi alındı ve mantıklı mı yoksa gereksiz riskli miydi.

| Tür | Açıklama | Örnek |
|---|---|---|
| Kasıtlı + mantıklı | Ekip bedeli bilerek kabul eder | "Release'e kadar düzgün tasarıma vaktimiz yok, biliyoruz" |
| Kasıtlı + riskli | İyi pratik bilerek atlanır, geri dönüş planı yok | "Nasılsa birileri sonra düzeltir" |
| Fark edilmeden + mantıklı | İyi mühendisler bir sorunu kaçırır, öğrenip düzeltir | Yeni bir kısıt ortaya çıkınca kod güncellenir |
| Fark edilmeden + riskli | Ekip riskin farkında değil, beceri veya disiplin eksikliğinden doğar | Hiç test yazılmamış kritik bir modül |

Fowler'ın kendisi dördüncü hücreyi (fark edilmeden + mantıklı) finansal borçla tam paralel kuramadığını yazmıştı; bu sınıflandırmayı kesin bir ölçüm aracı değil, tartışma çerçevesi olarak kullanmak daha doğru.

## Yerel borç ile sistemik borç arasındaki fark nedir?

Yerel borç, tek bir fonksiyon veya modülle sınırlıdır ve o parçayı değiştiren kişi tarafından fark edilip düzeltilebilir. Sistemik borç ise mimari bir karardan kaynaklanır (örneğin yanlış seçilmiş bir veri modeli) ve kod tabanının her yerine yayılır; düzeltmek tek bir PR'la olmaz, kademeli bir plan gerektirir. İkisini aynı listede aynı önem seviyesinde tutmak, sistemik borcu küçümsemeye yol açar.

## Borcu görünür kılmak için ne gerekir?

Bir "borç defteri" — basit bir spreadsheet veya issue tracker etiketi — her borç kalemi için üç şeyi kayıt altına almalı: ne biriktirdi, hangi dosya/modülde ve tahmini "faiz" (bu borç ödenmezse her sprint ne kadar ekstra zaman kaybediliyor). Faiz tahmini olmayan bir borç listesi, önceliklendirme sırasında gürültüye dönüşür çünkü her kalem aynı aciliyette görünür.

## Boy-scout ve strangler-fig taktikleri feature işine nasıl gömülür?

Boy-scout kuralı basit: bir dosyaya her dokunduğunuzda, o dosyayı biraz daha iyi bırakın — isim düzeltme, ölü kod silme, bir testi ekleme. Bu, ayrı bir PR gerektirmez, feature PR'ının içine doğal olarak oturur. Strangler-fig taktiği ise daha büyük sistemik borç için işler: eski bir modülü tek seferde değiştirmek yerine, yeni trafiği kademeli olarak yeni implementasyona yönlendirip eski kodu adım adım "boğarsınız." [Legacy kod tabanını strangler-fig ile ele aldığımız yazıda](/tr/posts/eski-kod-tabani-strangler-fig) bu taktiği adım adım gösteriyoruz; [legacy kod refactoring rehberimizde](/tr/posts/legacy-kod-refactoring) ise küçük, güvenli adımlarla refactoring yapmanın pratik yollarını ele alıyoruz.

```text
Sprint planlaması örneği (2 haftalık sprint, 10 kişi-gün kapasite):
- %80 (8 gün): feature işi
- %15 (1,5 gün): borç ödeme (önceden seçilmiş, faizi yüksek kalemler)
- %5 (0,5 gün): boy-scout düzeltmeleri (dokunulan dosyalarda küçük iyileştirmeler)
```

## Her teknik borç kalemi mutlaka ödenmeli mi?

Hayır. Nadiren değişen, kararlı ve düşük riskli bir kod parçasındaki "mantıklı" (prudent) borç, ödenmeden bırakılabilir — buna harcanacak zaman, başka bir yerdeki daha yüksek faizli bir kalemden çalınır. Kararı, borcun faizine göre vermek gerekiyor: faiz düşükse (kod nadiren değişiyor, hata üretmiyor) borcu bırakmak rasyonel bir tercih, faiz yüksekse (her değişiklik yavaşlıyor, hata riski artıyor) ödeme önceliklendirilmeli.

## Bir borç kaydı gerçekte nasıl görünür?

Soyut bir "kod kalitesi düşük" notu yerine, her kayıt üç alanı doldurmalı: konum, tahmini faiz ve önerilen çözüm. Aşağıdaki gibi bir satır, bir sprint planlama toplantısında dakikalar içinde önceliklendirilebilir; soyut bir not ise genelde listede kalır çünkü kimse onu diğerleriyle kıyaslayamaz.

| Konum | Tahmini faiz | Önerilen çözüm |
|---|---|---|
| `OdemeServisi.java` | Her değişiklikte 3 gün manuel test | Birim testi ekle, mock'ları ayır |
| `legacy/rapor-motoru` | Her yeni rapor türü 2x daha uzun sürüyor | Şablon motorunu yeni API'ye taşı |
| `kullanici-tablosu` şema | Yeni alan eklemek migration'ı riskli yapıyor | Normalizasyon, ayrı tercih tablosu |

## Borç ödemenin etkisini nasıl ölçersiniz?

Borç ödemenin işe yaradığını kanıtlamak için üç metriği takip etmek yeterli: aynı tür değişiklik için geçen süre (örneğin "yeni bir API endpoint eklemek" kaç gün sürüyor), bir modüldeki hata oranı (son 3 ayda açılan bug sayısı) ve code review'da geçen süre. Bu metrikler borç ödeme çalışmasından önce ve sonra karşılaştırıldığında, "kod kalitesi arttı" gibi öznel bir iddia yerine "bu endpoint türü eklemek 4 günden 1,5 güne düştü" gibi somut bir sonuç ortaya çıkar. Bu sayı, bir dahaki borç ödeme talebinizi onaylatmak için en güçlü argümanınız olur.

## İş tarafından onay almak için borcu nasıl çevirmelisiniz?

"Kod kalitesini artıralım" cümlesi iş tarafı için anlamsızdır; "bu modülde test olmadığı için her değişiklik üç günlük manuel QA gerektiriyor, bu da release hızımızı yarıya düşürüyor" cümlesi somut bir teslimat riskidir. Borcu her zaman bir teslimat riskine (gecikme, hata oranı, geliştirme hızı) bağlayarak anlatmak, "düzenlilik" argümanından çok daha fazla bütçe kazandırır.

## Borç ödeme kapasitesini kim savunmalı, teknik lider mi yoksa her mühendis mi?

İkisi de, ama farklı seviyelerde. Teknik lider veya mühendislik yöneticisi, sprint kapasitesindeki sabit dilimi (örneğin %15) iş tarafına karşı savunmakla sorumludur — bu, tekrarlayan bir bütçe pazarlığıdır ve genelde product manager'la yapılan bir anlaşmadır. Her mühendis ise günlük işte boy-scout kuralını uygulamakla sorumludur: dokunduğu dosyayı biraz daha iyi bırakmak, bunun için onay istemesi gerekmez. İkisi birbirini tamamlar; sadece üstten gelen bir "%15 borç ödeme" politikası, mühendisler günlük işte küçük iyileştirmeleri yapmazsa yeterince etkili olmaz, çünkü sistemik borcun büyük kısmı binlerce küçük yerel kararın birikmesinden oluşur. Bu yüzden iyi işleyen ekiplerde ikisi birlikte görülür: üstten gelen bir kapasite garantisi ve alttan gelen, günlük işe gömülü küçük iyileştirme refleksi.

Kişisel görüşüm: "teknik borç" terimi bugün çok gevşek kullanılıyor — her beğenilmeyen kod parçası "borç" olarak etiketleniyor. Cunningham'ın orijinal fikri daha dardı: bilinçli bir takas, geri ödeneceği bilinerek yapılan bir yatırımdı. Bu netliği geri getirmek, borç listesini ciddiye almayı kolaylaştırıyor ve ekibin enerjisini gerçekten faiz üreten kalemlere yönlendiriyor.

## Sıkça Sorulan Sorular

### Teknik borç terimi ilk ne zaman ve kim tarafından ortaya atıldı?

Ward Cunningham, terimi 1992'de WyCash portföy yönetim sistemiyle ilgili bir OOPSLA deneyim raporunda ortaya attı. Orijinal anlamı, erken teslim etmenin bir kredi gibi olduğu ve bu kredinin refactoring ile zamanında geri ödenmesi gerektiğiydi; Cunningham'a göre terim bugün söylendiğinden daha dar ve daha bilinçli bir takası ifade ediyordu.

### Strangler-fig taktiği her türlü teknik borç için uygun mu?

Hayır, en çok büyük, sistemik borç için işe yarar — örneğin eski bir modülü tek seferde değiştirmenin riskli olduğu durumlarda. Küçük, yerel borç kalemleri için boy-scout kuralı (dokunduğun dosyayı biraz iyileştir) genellikle daha hızlı ve yeterli bir çözümdür.

### Debt sprint'leri tamamen yanlış mı?

Her zaman değil; bir kerelik, net sınırları olan bir temizlik (örneğin büyük bir kütüphane yükseltmesi) için ayrı bir sprint mantıklı olabilir. Ama düzenli, tekrarlayan "borç ödeme haftası" modeli genelde başarısız olur çünkü borç sürekli ve küçük parçalar halinde birikir, tek seferlik büyük temizliklerle kalıcı çözülmez.

### Faiz tahmini olmayan bir borç listesi neden işe yaramıyor, borç her zaman kod kalitesiyle mi ilgili?

Faiz tahmini (bu borç ödenmezse her sprint ne kadar zaman kaybediliyor) olmadan, listede yüzlerce kalem aynı önem seviyesinde görünür ve ekip hangisine önce bakacağını bilemez; faiz tahmini, önceliklendirmeyi öznel bir tartışmadan somut bir sıralamaya dönüştürür. Teknik borç ayrıca her zaman kod kalitesiyle de ilgili değildir — eski bir kütüphane sürümü, güncel olmayan dokümantasyon veya manuel bir deploy süreci de aynı borç defterine, aynı faiz mantığıyla girmelidir.
