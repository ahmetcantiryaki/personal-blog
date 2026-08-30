---
title: "Anthropic Model Hardware Standard Nedir?"
slug: "anthropic-model-hardware-standard-nedir"
translationKey: "anthropic-model-hardware-standard"
locale: "tr"
excerpt: "MHS, Claude gibi AI ajanlarının robot kolu, mikroskop ve laboratuvar cihazlarını güvenle kontrol etmesini sağlayan model-agnostik yeni bir Anthropic standardı."
category: "technology"
tags: ["claude", "ai-agents", "hardware", "automation"]
publishedAt: "2026-08-30"
seoTitle: "Anthropic Model Hardware Standard (MHS) Nedir?"
seoDescription: "MHS, Claude gibi AI ajanlarının robot kolu, mikroskop ve laboratuvar cihazlarını güvenle kontrol etmesini sağlayan model-agnostik yeni bir Anthropic standardı."
---

Kısa cevap: Model Hardware Standard (MHS), Anthropic'in 27 Ağustos 2026'da araştırma önizlemesi olarak duyurduğu, AI ajanlarının robot kolu, mikroskop, sıvı işleme cihazı gibi fiziksel donanımları güvenle çalıştırmasını sağlayan model-agnostik bir yazılım standardı. MCP yazılımı AI'a nasıl bağladıysa, MHS de donanımı aynı şekilde bağlıyor; Claude, GPT, Gemini veya yerel bir açık kaynak model fark etmiyor.

## MHS tam olarak ne yapıyor?

MHS, bir donanım parçasının nasıl çalıştığını AI modelleri için tarif eden ortak bir arayüz katmanı. Anthropic'e göre bu standart olmadan bir cihazı AI'a bağlamak haftalar, hatta aylar sürüyor ve genelde sadece birkaç uzmanın bildiği kağıt kılavuzlara veya tecrübeye dayanıyor. MHS ile bu entegrasyon saatler, hatta dakikalar seviyesine iniyor.

Standart, bir robot kol üreticisinin AI'ın kolu hangi hızda ve hangi açı aralığında güvenle hareket ettirebileceğini doğrudan tanımlamasına izin veriyor. Böylece ajan, cihazın fiziksel sınırlarını "bilerek" hareket ediyor — deneme yanılma ya da riskli tahmin yok. Duyuruya göre bir ajan aynı anda birden fazla cihazı (mikroskop, sıvı işleme robotu, robot kol) koordine edebiliyor; örnek kullanım alanları arasında rutin ilaç keşfi deneyleri ve kuantum bilgisayarlar için lazer kalibrasyonu sayılıyor.

## MHS, MCP'den nasıl farklı?

MHS'yi MCP'nin donanım karşılığı olarak düşünebilirsiniz: MCP bir AI modelini veritabanına veya takvime bağlarken, MHS aynı modeli fiziksel bir cihaza bağlıyor. Anthropic'in kendi açıklamasına göre MHS, mevcut ajan çerçeveleriyle (MCP dahil) birlikte çalışacak şekilde tasarlandı — yani bir ajan hem yazılım araçlarına MCP üzerinden hem de donanıma MHS üzerinden erişebiliyor.

Aşağıdaki tablo iki standardı yan yana koyuyor:

| Özellik | MCP | MHS |
|---|---|---|
| Bağladığı şey | Yazılım araçları, veritabanları, API'ler | Fiziksel donanım (robot, mikroskop, lazer) |
| Duyuru | Kasım 2024 | 27 Ağustos 2026 (araştırma önizlemesi) |
| Model bağımlılığı | Model-agnostik | Model-agnostik |
| Durum (Ağustos 2026) | Yaygın, açık kaynak | Erken önizleme, açık kaynak planlanıyor |
| Tipik kullanım | Ajan iş akışları, veri erişimi | Laboratuvar, robotik, üretim hattı |

## Hangi şirketler MHS'yi destekliyor?

Anthropic, güvenlik değerlendirmelerini AWS, Genentech, Universal Robots ve Danaher gibi ortaklarla birlikte yürütüyor; Tecan, QIAGEN, Raspberry Pi ve Hugging Face'in LeRobot projesi de ek donanım ortakları arasında yer alıyor. Bu, standardın hem büyük bulut sağlayıcılarını hem de laboratuvar cihazı üreticilerini hem de açık kaynak robotik ekosistemini kapsadığı anlamına geliyor.

Anthropic, MHS'yi nihayetinde açık kaynak yapmayı planlıyor; bu gerçekleştiğinde herhangi bir donanım üreticisi, Anthropic'ten bağımsız olarak standardı kendi cihazına uygulayabilecek. Ortak listesinin bu kadar geniş olması tesadüf değil: hem büyük bir bulut sağlayıcısı (AWS), hem ilaç ve biyoteknoloji devleri (Genentech, QIAGEN), hem robotik üreticileri (Universal Robots) hem de açık kaynak topluluğu (Hugging Face) aynı önizlemede yer alıyor, yani standart baştan tek bir sektöre kilitlenmemiş durumda. [Anthropic'in Claude Managed Agents için bütçe ve veri konumu kontrollerini genişlettiği duyuru](/tr/posts/claude-managed-agents-butce-danisman-veri-konumu) da aynı hafta geldi; şirketin kurumsal ajan altyapısını hem yazılım hem donanım tarafında aynı anda büyüttüğünü gösteriyor.

## MHS güvenli mi, riskler neler?

Bir AI ajanının ağır bir robot kolunu veya lazer kesiciyi yanlış hareket ettirmesi, yazılım hatasından çok daha pahalı ve tehlikeli sonuçlar doğurabilir — bu yüzden Anthropic standardı doğrudan genel kullanıma açmak yerine kapalı bir önizlemeyle başlattı. Şirket, ortaklarıyla birlikte güvenlik değerlendirmeleri ve en iyi uygulamalar geliştirdiğini, kötüye kullanım riskine karşı bir "fiziksel güvenlik yol haritası" hazırladığını açıkladı.

Pratikte bu, üreticinin MHS tanımında hız ve açı gibi fiziksel limitleri baştan sabitlemesi anlamına geliyor: ajan bu limitlerin dışına çıkamıyor, çünkü sınır cihaz tarafında tanımlanmış durumda. Bu tasarım, güvenliği modelin "iyi karar vermesine" değil, donanımın kendi tanımına dayandırıyor — model ne kadar iddialı bir talimat alırsa alsın, cihaz tanımının dışına çıkan bir hareket komutu zaten sistem seviyesinde reddediliyor. Bu yaklaşım, [Claude Code'un kaçak ajanlara karşı getirdiği frenlerle](/tr/posts/claude-code-kacak-ajanlara-fren) benzer bir mantık taşıyor: ajanın gücünü artırırken, hata payını daraltan bir koruma katmanı eklemek.

## MHS somut olarak neye benziyor?

Bir örnek üzerinden düşünelim: bir ilaç keşfi laboratuvarında bugün bir robot kolu, bir sıvı işleme cihazını ve bir mikroskobu tek bir deneyde koordine etmek istiyorsun. MHS olmadan, her cihaz için ayrı bir entegrasyon yazman, cihazın hız ve güvenlik limitlerini üreticinin PDF kılavuzundan okuyup koda elle çevirmen ve bu bilgiyi güncel tutman gerekiyor. Bu süreç haftalar sürebiliyor ve genelde sadece o cihazı bilen bir-iki mühendise bağımlı kalıyor.

MHS ile üretici, cihazın güvenli çalışma sınırlarını (hız, açı, sıcaklık gibi) standart bir tanımla baştan yayınlıyor. Ajan bu tanımı okuyup cihazı doğrudan kullanmaya başlıyor; entegrasyon süresi haftalardan saatlere iniyor. Anthropic'in verdiği örneklerde bu tarz koordinasyon, rutin ilaç keşfi deneylerinden kuantum bilgisayar bileşenleri için lazer kalibrasyonuna kadar uzanıyor — yani tek bir cihazı değil, birden fazla cihazı aynı anda yöneten bir iş akışını hedefliyor.

Bu noktada asıl değişen şey, hangi bilginin nerede yaşadığı: eskiden bir uzmanın kafasında veya bir PDF'te duran donanım bilgisi, artık AI ajanının doğrudan okuyup hareket edebileceği yapılandırılmış bir tanıma dönüşüyor. Yazılım tarafında MCP'nin yaptığı da tam olarak buydu — API dokümantasyonunu insan okuması gereken bir metinden, ajanın doğrudan kullanabileceği bir arayüze çevirmek.

## MHS ne zaman geniş kullanıma açılacak?

Ağustos 2026 itibarıyla MHS, sadece adı geçen laboratuvar ve üretim ortaklarına açık; genel kullanıma tarih verilmedi. Anthropic'in planı, önce bilim, robotik, elektronik ve üretim alanlarındaki ortaklarla güvenlik protokollerini olgunlaştırmak, ardından standardı açık kaynak yaparak herhangi bir cihaz üreticisinin ve herhangi bir AI modelinin kullanımına açmak.

Bu bekleme süresi, MCP'nin izlediği yoldan farklı değil: MCP de önce sınırlı bir ekosistemle başlamış, sonra hızla endüstri standardına dönüşmüştü. MHS'nin aynı yolu izleyip izlemeyeceği, önümüzdeki aylarda ortaya çıkacak.

Geliştirici tarafında bugünden yapılabilecek tek şey, bekleyip izlemek değil. Robotik veya laboratuvar otomasyonu alanında çalışan bir ekipsen, Anthropic'in yayınladığı önizleme dokümantasyonunu takip etmek ve mevcut MCP entegrasyonlarını gözden geçirmek, standart açık kaynak olduğunda geçiş süresini kısaltacak. [MCP bağlayıcısı yazma rehberimiz](/tr/posts/ilk-mcp-baglayicini-yaz-2026), MHS'nin dayandığı temel protokol mantığını anlamak için iyi bir başlangıç noktası, çünkü iki standart da aynı "ajan bir arayüzü keşfeder, sonra kullanır" prensibine dayanıyor.

Fiziksel dünyaya açılan AI ajanları hakkında daha fazla içerik için [Yapay Zeka kategorisine](/tr/category/yapay-zeka) göz atabilirsiniz.

## Sıkça Sorulan Sorular

### MHS sadece Claude ile mi çalışıyor?

Hayır. MHS model-agnostik tasarlandı; Anthropic'e göre Claude'un yanı sıra GPT, Gemini, Llama veya yerel bir açık kaynak model de aynı standardı kullanarak donanıma bağlanabilir. Bu, MHS'yi Anthropic'e özel değil, sektör geneline açık bir katman yapıyor.

### MHS bugün kullanılabilir mi?

Hayır, Ağustos 2026 itibarıyla MHS sadece AWS, Genentech, Universal Robots, Danaher, Tecan, QIAGEN, Raspberry Pi ve Hugging Face LeRobot gibi seçilmiş ortaklara açık bir araştırma önizlemesi durumunda. Anthropic, güvenlik değerlendirmeleri tamamlandıktan sonra standardı açık kaynak yapmayı planlıyor, ancak kesin tarih paylaşılmadı.

### MHS ile MCP aynı şey mi?

Hayır, ama akraba standartlar. MCP, bir AI modelini yazılım araçlarına ve verilere bağlarken, MHS aynı modeli fiziksel donanıma (robot kol, mikroskop, sıvı işleme cihazı) bağlıyor. Anthropic, ajanların iki standardı birlikte kullanabileceğini, yani hem MCP üzerinden yazılıma hem MHS üzerinden donanıma erişebileceğini belirtiyor.

### MHS hangi sektörleri hedefliyor?

Anthropic'in ilk önizleme ortakları bilimsel araştırma laboratuvarları, robotik ve ileri üretim alanlarından geliyor. Örnek kullanım alanları arasında ilaç keşfi deneylerinin otomasyonu ve kuantum bilgisayar bileşenleri için lazer kalibrasyonu var; standart açık kaynak olduğunda kapsamın daha geniş endüstrilere yayılması bekleniyor.
