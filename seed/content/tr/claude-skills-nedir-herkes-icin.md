---
title: "Claude Skills Nedir? Herkes İçin Pratik Rehber"
slug: "claude-skills-nedir-herkes-icin"
translationKey: "claude-skills-explained-for-everyone"
locale: "tr"
excerpt: "Claude Skills, tekrarlayan bir iş akışını bir kez paketler, her oturumda yeniden anlatmayı gereksiz kılar. İşte ne olduğu ve geliştirici olmayanların kullanımı."
category: "ai"
tags: ["claude", "workflow", "productivity"]
publishedAt: "2026-07-23"
seoTitle: "Claude Skills Nedir? Herkes İçin Pratik Rehber"
seoDescription: "Claude Skills, tekrarlayan bir iş akışını bir kez paketler, her oturumda yeniden anlatmayı gereksiz kılar. İşte ne olduğu ve geliştirici olmayanların kullanımı."
---

Her yeni sohbet açtığınızda aynı marka sesi rehberini, biçimlendirme şablonunu ya da adım adım süreci Claude'a baştan yapıştırdıysanız Skills tam olarak bunu çözmek için var. Skill, bir görev kendisiyle eşleştiğinde Claude'un otomatik olarak yüklediği paketlenmiş bir talimatlar bütünü; yani iş akışını bir kez yazıyorsunuz, her yeni sohbette yeniden anlatmak zorunda kalmıyorsunuz.

## Skill Aslında Nedir?

Anthropic, Skills'i Ekim 2025'te her oturuma aynı istemi kopyala-yapıştır yapmanın taşınabilir bir alternatifi olarak tanıttı. Yapısal olarak bir Skill, en az talimatlar ve meta veri içeren bir dosyaya sahip bir klasördür; isteğe bağlı olarak gerektiğinde çekebileceği betikler ya da referans belgeleri de içerebilir. Ancak bunu kullanmak için o klasör yapısını anlamanıza gerek yok — çoğu geliştirici olmayan kullanıcı için bir Skill, isimle çağırabileceğiniz kayıtlı bir uzman gibi davranır.

Bir Skill için yazdığınız açıklama, Claude'un onu ne zaman devreye sokacağına karar veriyor. Claude, isteğinizi o açıklamayla eşleştirerek belirli bir Skill'in uygulanıp uygulanmayacağına karar veriyor; bu yüzden görevi doğal olarak nasıl isteyeceğinizi yansıtan bir açıklamayla yazılmış bir Skill, resmi bir dokümantasyon gibi okunan birinden daha güvenilir biçimde devreye giriyor.

## Skills, Ham İstemlerden ve Projects'ten Nasıl Farklı?

Ham bir istem tek seferliktir — talimatları yazarsınız, bir cevap alırsınız ve sohbet bittiğinde yeniden yapıştırmadığınız sürece talimatlar kaybolur. Claude'daki bir Project, dosyaları ve bağlamı devam eden tek bir iş parçasının etrafında gruplar; belirli bir müşteri ya da kampanya için bir klasör gibi. Skill ise farklı bir katmanda durur: birçok farklı sohbette, hatta farklı Project'lerde, eşleşen görev nerede ortaya çıkarsa çıksın uygulanabilen yeniden kullanılabilir bir yetenektir.

Basitçe söylemek gerekirse — Project'ler *üzerinde çalıştığınız şeyi* organize eder; Skills ise hangi projede olursa olsun belirli bir türdeki görevi *nasıl yaptığınızı*, tekrarlanabilir biçimde yakalar.

| | Ham istem | Project | Skill |
|---|---|---|---|
| Sohbetler arası yeniden kullanılabilirlik | Yeniden yapıştırılmadıkça yok | Sadece o Project içinde | Eşleştiği her yerde evet |
| En uygun kullanım | Tek seferlik sorular | Tek bir bağlama bağlı süregelen iş | Tekrarlanabilir bir süreç ya da format |
| Kurulum çabası | Yok | Düşük | Bir kez yaz, orta düzey |

## Bir Skill'i Etkinleştirmek ve Çağırmak

Ücretli bir claude.ai planında Skills, Ayarlar altında özel bir Skills bölümünde bulunur; buradan bir tane yükler ya da oluşturursunuz. Etkinleştirildikten sonra bir sohbette açıkça çağırabilir ya da sadece açıklamasıyla eşleşen bir görevi tarif edip Claude'un onu otomatik olarak seçmesine izin verebilirsiniz — zaten iyi bir açıklama yazmanın tüm amacı bu otomatik eşleştirme. Skills, Claude Code içinde ve geliştiriciler için API üzerinden de aynı şekilde çalışır ama alttaki kavram — paketlenmiş, yeniden kullanılabilir bir talimat kümesi — yüzeyler arasında değişmiyor. Plan gereksinimi bir Skill'i nerede çalıştırdığınızla ilgili, Skill'in kendisiyle değil; oluşturduğunuz Skills, desteklendiği her yerde sizin yeniden kullanabileceğiniz şeylerdir.

## Yazarlar, Pazarlamacılar ve Analistler İçin Pratik Skills

Yararlı bir Skill oluşturmak için kod yazmanıza gerek yok. Geliştirici olmayan biri bunu düz talimatlarla taslak hâline getirebilir — örneğin en iyi performans gösteren birkaç içeriğinizi yapıştırıp Claude'dan tonu, cümle yapısını ve biçimlendirme örüntülerini analiz etmesini isteyebilir, ardından bu analizi ekibinizdeki herhangi bir yazarın aynı sesi tutturmak için çağırabileceği bir Skill'e dönüştürebilirsiniz.

```markdown
---
name: marka-sesi-editoru
description: Metni marka sesimizle eşleştirmek için düzenle - pazarlama
  metinlerini, e-postaları ya da sosyal medya gönderilerini yayınlamadan
  önce incelerken kullan
---

Verilen metni yerleşik sesimizle eşleşecek şekilde yeniden yaz:
- Kısa cümleler, etken çatı, kurumsal jargon yok
- Her parçada tek ve net bir harekete geçirici mesaj
- Bu Skill'in klasöründeki referans örneklerin tonunu yakala
```

Bir pazarlamacı, rakip içerik profilleme, bir SEO denetim kontrol listesi ya da bir ücretli reklam metni inceleme süreci etrafında Skills oluşturabilir. Bir analist, belirli bir paydaşın beklediği şekilde bir veri özetini her zaman aynı biçimde formatlayan bir tane oluşturabilir. Bu durumların hepsinde örüntü aynı: görevi doğal olarak nasıl isteyeceğinizi tarif edin, standardı bir kez kodlayın ve yeniden kullanın.

## Skills Nerede İşe Yarar, Nerede Gürültü Katar?

Skills, aynı standartla bir avuçtan fazla kez yaptığınız her şey için kurulum maliyetini hak eder — tekrarlayan bir rapor formatı, tutarlı bir editoryal ses, tekrarlanan bir araştırma ya da kalite kontrol listesi. Görev gerçekten tek seferlikse ya da birbiriyle örtüşen o kadar çok Skill'iniz varsa Claude'un eşleştirmesi aralarında belirsizleşiyorsa gürültü katarlar. Sadece bir kez yapacağınız bir şey için Skill oluşturduğunuzu fark ederseniz sıradan bir istem daha basit ve aynı derecede etkilidir.

Çıktısı doğrudan bir müşteriye ulaşan herhangi bir Skill için — pazarlama metni, destek yanıtları, müşteriyle yüz yüze olan her şey — önemli bir uyarı: döngüde bir insan inceleme adımı tutun. Bir Skill standardınızı kodlar ama belirli bir durumun o standardın istisnası olduğunu bilmez.

## Kişisel Görüşüm

Skills, yapay zeka araçlarının bir ekip içinde gerçekten nasıl benimsendiği üzerinde orantısız bir etkisi olan küçük bir fikir. Geliştirici olmayanların Claude'dan gerçek değer elde etmesinin önündeki engel hiçbir zaman yetenek değildi — sorun, faydalı iş akışlarının tek bir kişinin kafasında ya da tek bir kişinin özenle yazdığı bir istemde yaşaması ve başka kimsenin sormadan onu yeniden kullanamamasıydı. Skills, bu örtük bilgiyi tam anlamıyla paylaşılabilir bir şeye dönüştürüyor ve bu, herhangi bir tek model yükseltmesinden ekip çapında benimseme için daha fazla önem taşıyor.

## Denemeye Hazır Üç Geliştirici Olmayan Skill

1. **Toplantı notu biçimlendirici** — açıklama: "Ham toplantı notlarını kararlar, sorumlular ve son tarihlerle yapılandırılmış bir özete dönüştür." Ham notlarınızı yapıştırın, her seferinde tutarlı bir yapı alın.
2. **Müşteri e-postası ton eşleştirici** — açıklama: "Müşteri e-postalarını firmamızın profesyonel ama sıcak tonuyla eşleşecek şekilde yaz ya da yeniden yaz." Beğendiğiniz üç e-posta örneği verin, sonraki her taslak için yeniden kullanın.
3. **Haftalık rapor iskeleti** — açıklama: "Madde işaretli güncellemeleri standart haftalık durum raporu formatımıza dönüştür." Belirli bir sıklıkta aynı türde rapor dolduran herkes için kullanışlı.

Skills'i, Anthropic'in Claude'u sadece sohbet edilen değil yapılandırılabilir bir şeye dönüştürme yönündeki diğer son hamleleriyle birlikte görmek isterseniz [Claude'a Anthropic Ekonomi Endeksi'ni sormak](/tr/posts/claude-ekonomi-endeksi-baglantisi) yazımız bugünkü diğer özellik lansmanını ele alıyor. Claude'u genişletmenin daha teknik tarafı için [Model Context Protocol rehberimize](/tr/posts/model-context-protocol-nedir) bakabilirsiniz; Claude'u özellikle pazarlama ve sosyal medya işlerine uyguluyorsanız [sosyal medya için Claude kullanım rehberimiz](/tr/posts/sosyal-medya-icin-claude-kullanimi) ve [Claude Cowork'ün web ve mobile genişlemesi](/tr/posts/claude-cowork-web-mobil-genisliyor) yazımız faydalı bir sonraki okuma. Daha fazlası için [AI kategorimize](/tr/category/yapay-zeka) göz atabilirsiniz.

## Sıkça Sorulan Sorular

### Bir Claude Skill oluşturmak için kod bilmem gerekiyor mu?

Hayır. Çoğu içerik odaklı Skill, düz talimatlarla taslak hâline getirilebilir — görevi tarif ederek, örnekler vererek ve Claude'un Skill dosyasının kendisini yapılandırmasına yardım etmesine izin vererek. Kodlama sadece bir Skill'in betik çalıştırması gerektiğinde önem kazanır.

### Bir Skill, bir Claude Project'ten nasıl farklı?

Bir Project, dosyaları ve bağlamı devam eden tek bir iş parçasının etrafında gruplar; belirli bir müşteri ya da kampanya gibi. Bir Skill ise eşleşen bir görev nerede ortaya çıkarsa çıksın, birçok farklı sohbette ve Project'te uygulanabilen yeniden kullanılabilir bir yetenektir.

### Claude Skills, MCP bağlantılarıyla aynı şey mi?

Hayır. MCP (Model Context Protocol), Claude'u dış araçlara ve canlı veri kaynaklarına bağlar. Skills ise Claude'un belirli bir tür göreve nasıl yaklaşması gerektiğine dair talimatları ve referans materyalini paketler. Birbirini tamamlarlar — bir Skill bir MCP bağlantısına atıfta bulunabilir ama farklı sorunları çözerler.

### Oluşturduğum Skills'i nerede kullanabilirim?

Skills, ücretli planlarda claude.ai'de, Claude Code içinde ve API üzerinden çalışır. Plan gereksinimi bir Skill'i nerede çalıştırabileceğinizi belirler ama oluşturduğunuz bir Skill, desteklendiği bu yüzeylerin herhangi birinde yeniden kullanılabilir.
