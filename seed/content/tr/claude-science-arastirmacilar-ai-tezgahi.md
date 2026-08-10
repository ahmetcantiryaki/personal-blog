---
title: "Claude Science: Araştırmacılar İçin AI Tezgahı"
slug: "claude-science-arastirmacilar-ai-tezgahi"
translationKey: "claude-science-ai-workbench"
locale: "tr"
excerpt: "Anthropic'in Claude Science'ı 60'tan fazla bilimsel veritabanına bağlanıyor, sonuçları denetliyor ve 30 Haziran 2026'dan beri beta aşamasında."
category: "ai"
tags: ["claude", "machine-learning", "ai-tools", "education"]
publishedAt: "2026-08-10"
seoTitle: "Claude Science: Araştırmacılar İçin AI Tezgahı"
seoDescription: "Claude Science, 60'tan fazla veritabanına bağlanan, sonuçları denetleyen ve Haziran 2026'dan beri beta'da olan Anthropic'in araştırma tezgahı incelemesi."
---

30 Haziran 2026'da, bir Salı günü, Anthropic [Claude Science'ı beta olarak yayınladı](https://www.anthropic.com/news/claude-science-ai-workbench): 60'tan fazla önceden yapılandırılmış beceri, 60'tan fazla bilimsel veritabanına doğrudan erişim, tek bir jenerik AI ajanı ve onun üstünde çalışan ayrı bir denetleyici. Ağustos 2026 itibarıyla macOS ve Linux'ta çalışıyor, SSH üzerinden uzak HPC kümelerinde de kullanılabiliyor ve [ürün sayfasına göre](https://claude.com/product/claude-science) mevcut Claude Pro, Max, Team veya Enterprise planlarına dahil — ayrı bir fiyatlandırma yok.

Rakamlar iddialı görünüyor ama arkasındaki fikir aslında sade: araştırmacıların gün içinde tek tek açtığı UniProt sekmesi, PDB indirmesi, Python not defteri ve küme SSH oturumu artık tek bir çalışma alanında toplanıyor, hepsini koordine eden genel amaçlı bir ajan var.

## Dağınık Araç Yığınının Çözümü

Bir hesaplamalı biyoloji araştırmacısının tipik günü şöyle geçer: bir tarayıcı sekmesinde UniProt'ta protein arıyor, başka birinde PDB'den yapı indiriyor, üçüncüsünde ClinVar'daki varyant kayıtlarını tarıyor, sonra terminale geçip bir HPC kümesinde iş kuyruğuna bir analiz gönderiyor. Her araç kendi arayüzüne, kendi API'sine ve kendi öğrenme eğrisine sahip. Bir genomikçi ile bir kemiinformatikçinin kullandığı veritabanları neredeyse hiç örtüşmez, ama ikisi de aynı sürtünmeyi yaşar: sonuç üretmek yerine araçlar arasında gezinmek.

Claude Science bu sürtünmeyi tek bir çalışma alanında eritiyor. Fikir yeni değil — konsept olarak bir orkestrasyon katmanı: veritabanlarını, kodu ve hesaplama kaynağını tek bir arayüzde toplayan, genel amaçlı bir AI ajanının koordine ettiği bir çalışma alanı. Anthropic bunu açıkça bir *tezgah* olarak konumlandırıyor — yeni bir temel model değil, mevcut araçların, verinin ve hesaplama gücünün üzerine kurulmuş bir orkestrasyon katmanı. Bu ayrım önemli: Claude Science yeni bir bilim yapmıyor, var olan bilimsel altyapıyı bir araya getirip erişilebilir kılıyor.

Örneğin bir araştırmacının terminale yazabileceği bir sorgu şöyle görünebilir:

```text
İnsan TP53 geninin UniProt'taki protein girdisini bul, PDB'deki bilinen yapılarıyla eşleştir, ClinVar'daki patojenik varyantları listele ve sonucu bir genom tarayıcı parçası olarak görselleştir.
```

Bu tek istek normalde dört ayrı araç, dört ayrı giriş yöntemi ve muhtemelen bir öğleden sonra gerektirirdi.

## 60'tan Fazla Beceri: Uzman Olmayanlar İçin Uzman Araçları

Claude Science'ın çekirdeğinde genomik, tek hücre biyolojisi, proteomik, yapısal biyoloji ve kemiinformatik alanlarına özel 60'tan fazla önceden yapılandırılmış "beceri" (skill) yer alıyor. Bu beceriler UniProt, PDB, Ensembl, Reactome, ClinVar ve ChEMBL gibi 60'tan fazla bilimsel veritabanını doğrudan sorgulayabiliyor. Yapısal biyoloji tarafında, [Anthropic'in duyurusuna göre](https://www.anthropic.com/news/claude-science-ai-workbench) Claude Science, NVIDIA'nın BioNeMo Agent Toolkit'iyle entegre çalışarak Evo 2, Boltz-2 ve OpenFold3 gibi modellere erişim sağlıyor.

Burada "beceri" kelimesi, her veritabanının veya aracın API'sini, sorgu sözdizimini ve çıktı formatını kapsülleyen bir talimat paketi anlamına geliyor. Pratikte bunun anlamı şu: bir araştırmacının ChEMBL'in REST API'sini veya Ensembl'in sorgu dilini ezbere bilmesine gerek kalmıyor — beceri bu bilgiyi zaten taşıyor. Bu, hem gücün hem de riskin kaynağı aynı anda: uzman olmadığınız bir alanda uzman düzeyinde araçlara erişmek güçlü bir şey, ama aynı zamanda çıktıyı değerlendirecek uzmanlığa sahip olmadığınız anlamına da gelebilir.

| Alan | Örnek veritabanları / araçlar |
|---|---|
| Genomik | Ensembl, ClinVar |
| Tek hücre biyolojisi | GEO |
| Proteomik | UniProt |
| Yapısal biyoloji | PDB, Boltz-2, OpenFold3 (BioNeMo üzerinden) |
| Kemiinformatik | ChEMBL |
| Yol/ağ analizi | Reactome |

Bu tablo kapsamlı değil — 60'tan fazla veritabanı ve beceri bunların çok ötesine uzanıyor — ama beş alanın nasıl farklı uzmanlıklara denk geldiğini gösteriyor. Bir hücre biyoloğunun GEO'dan ihtiyaç duyduğu şey ile bir ilaç kimyacısının ChEMBL'den ihtiyaç duyduğu şey neredeyse hiç kesişmiyor; Claude Science'ın vaadi, ikisine de aynı arayüzden erişim vermesi.

## Denetleyici Ajan ve İzlenebilir Sonuçlar

Genel amaçlı ajanın üstünde ayrı bir denetleyici (reviewer) ajan çalışıyor. Bu ajanın işi atıfları ve hesaplamaları kontrol etmek, hataları işaretlemek ve düzeltmek — yani üretilen içeriğin üstüne bir doğrulama katmanı ekliyor. Bu ikili yapı önemli çünkü tek bir ajanın hem üretip hem denetlemesi, kendi hatasını görmezden gelme riskini taşır; ayrı bağlamda çalışan bir denetleyici bu riski azaltıyor.

Buna ek olarak Claude Science, her çıktının nasıl üretildiğini izlenebilir kılan bir geçmiş tutuyor. Bir araştırmacı bir sonuca nasıl ulaşıldığını — hangi veritabanı sorgulandı, hangi hesaplama yapıldı, hangi ara adımlar atlandı — geriye dönük izleyebiliyor. Bilimsel çalışmada bu, "kara kutu" eleştirisine karşı somut bir cevap: çıktı sadece bir metin değil, arkasında izlenebilir bir işlem zinciri var.

Ürün ayrıca bilimsel çıktıları doğrudan görselleştirebiliyor: 3D protein yapıları, genom tarayıcı parçaları, kimya çizimleri. Bu, sonuçları ayrı bir görselleştirme aracına taşımadan doğrudan çalışma alanında değerlendirmeyi mümkün kılıyor.

## Gerçekçi Sınırlar: Doğrulama Hâlâ Şart

Claude Science hâlâ beta yazılımı ve bunun pratik sonuçları var. Bir makaleye veya düzenleyici başvuruya girecek herhangi bir sonuç, insan doğrulaması gerektiriyor — bu bir öneri değil, gerçek bir gereklilik. Denetleyici ajan hataları yakalamaya çalışsa da, otomatik doğrulama insan uzmanlığının yerini almıyor.

Burada dürüst olmak gerekirse: 60'tan fazla beceri paketinin gücü aynı zamanda kırılganlığı. Bu beceriler, her bir araçta uzman olmayan insanlar için o araçları paketliyor — bu güçlü bir şey, çünkü bir hesaplamalı biyoloji doktora öğrencisinin artık ChEMBL'in API'sini ezberlemesine gerek yok. Ama aynı zamanda çıktıların kör güvenle değil, alan uzmanı incelemesiyle kullanılması gerektiği anlamına geliyor. Bir aracın çıktısını doğru yorumlamak için o aracı zaten bilmeniz gerekiyorsa, becerinin verdiği erişim kolaylığı yanıltıcı bir güven duygusu da üretebilir.

Benim görüşüm şu: bu, Claude Science'ın bir kusuru değil, bilim yapmanın doğasının bir yansıması. Hiçbir araç — AI destekli olsun ya da olmasın — bilimsel titizliğin yerini alamaz; Claude Science'ın izlenebilir geçmiş ve ayrı denetleyici tasarımı, en azından bu titizliği kolaylaştıracak doğru yapıyı kurmuş görünüyor.

## Kimin İşine Yarar?

Islak laboratuvar ve hesaplamalı biyoloji ekipleri, açık ara en net kazananlar — özellikle birden fazla veritabanı arasında sürekli geçiş yapan gruplar. Biyoteknoloji ve ilaç startup'ları için değer önerisi biraz farklı: küçük ekipler genellikle her veritabanı için ayrı bir uzman istihdam edemez, Claude Science bu boşluğu bir dereceye kadar dolduruyor. Lisansüstü öğrenciler için ise fayda daha çok zaman kazanımında — bir veritabanının API'sini öğrenmeye harcanacak bir haftayı gerçek analize dönüştürebiliyor.

## Sizin İçin mi?

Eğer işiniz düzenli olarak birden fazla bilimsel veritabanı arasında geçiş yapmayı, farklı formatlardaki verileri bir araya getirmeyi ve tekrarlayan sorgu-indirme-analiz döngülerini içeriyorsa, Claude Science denemeye değer bir araç. Eğer tek bir veritabanıyla derinlemesine, uzmanlık gerektiren çalışıyorsanız — ve o veritabanının kendi arayüzünü zaten iyi biliyorsanız — kazanç daha sınırlı olabilir. Her iki durumda da unutulmaması gereken şey aynı: bu bir tezgah, bir hakem değil. Son sözü hâlâ alan uzmanı söylüyor.

Claude'un araştırma dışındaki [beceri sistemi](/tr/posts/claude-skills-nedir-herkes-icin) hakkında daha genel bir bakış istiyorsanız ya da hangi Claude modelinin işinize uygun olduğunu merak ediyorsanız [2026 model rehberimize](/tr/posts/hangi-claude-modeli-2026-rehberi) göz atabilirsiniz. Ajanlara güvenilir bağlam sağlama konusuna meraklıysanız [AI ajanları için context engineering](/tr/posts/ai-ajanlari-icin-context-engineering) yazımız, Claude Science'ın denetleyici ajan tasarımını anlamlandırmaya da yardımcı olur. Beceri paketlerinin güvenlik tarafını merak edenler [Claude beceri ve eklenti güvenlik taraması](/tr/posts/claude-skill-plugin-guvenlik-taramasi) yazısına bakabilir. Daha fazla yapay zeka haberi için [yapay zeka kategorimize](/tr/category/yapay-zeka) göz atabilirsiniz.

## Sıkça Sorulan Sorular

### Claude Science'a nasıl erişebilirim?

Ayrı bir ödeme yapmanıza gerek yok — Claude Science, mevcut Claude Pro, Max, Team veya Enterprise planınıza dahil. Şu an macOS ve Linux'ta çalışıyor, ayrıca SSH üzerinden uzak HPC kümelerinde de kullanılabiliyor.

### Claude Science çıktılarına ne kadar güvenebilirim?

Ayrı bir denetleyici ajan atıfları ve hesaplamaları kontrol ediyor ve izlenebilir bir geçmiş tutuluyor, ama bu insan doğrulamasının yerini almıyor. Bir makaleye veya düzenleyici başvuruya girecek her sonuç, alan uzmanı tarafından gözden geçirilmeli.

### Claude Science yeni bir yapay zeka modeli mi?

Hayır. Anthropic bunu açıkça bir tezgah — mevcut veritabanlarının, araçların ve hesaplama kaynaklarının üzerine kurulmuş bir orkestrasyon katmanı — olarak tanımlıyor, yeni bir temel model değil.

### Hangi bilim alanlarını kapsıyor?

Şu an için genomik, tek hücre biyolojisi, proteomik, yapısal biyoloji ve kemiinformatik alanlarına odaklanan 60'tan fazla beceri sunuyor; UniProt, PDB, Ensembl, Reactome, ClinVar ve ChEMBL dahil 60'tan fazla veritabanını doğrudan sorgulayabiliyor.
