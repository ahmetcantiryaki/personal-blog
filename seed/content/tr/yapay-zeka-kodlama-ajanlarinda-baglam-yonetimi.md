---
title: "Yapay Zeka Kodlama Ajanlarında Bağlam Yönetimi"
slug: "yapay-zeka-kodlama-ajanlarinda-baglam-yonetimi"
translationKey: "context-management-ai-coding-agents-2026"
locale: "tr"
excerpt: "Kısa cevap: alt ajanları dar görevlere sınırlayın, bağımsız sıkıştırma yapmalarına izin verin ve kaynak olarak sohbet geçmişi değil, kalıcı bir dosya kullanın."
category: "software-engineering"
tags: ["claude", "ai-coding", "ai-agents", "best-practices"]
publishedAt: "2026-10-12"
seoTitle: "Yapay Zeka Kodlama Ajanlarında Bağlam Yönetimi"
seoDescription: "Uzun yapay zeka ajan oturumları bağlam dolunca bozuluyor. Alt ajan sınırlama, otomatik sıkıştırma ve dosya tabanlı hafıza bir oturumu nasıl keskin tutar?"
---

Kısa cevap: uzun bir ajan oturumu bozulur çünkü araç çıktısı, dosya okumaları ve sohbet geçmişi tek bir paylaşılan bağlam penceresinde birikir, ta ki model büyük ölçüde gürültü üzerinde muhakeme yapana kadar. Çözüm: alt ajanları kendi bağlamına sahip dar görevlere sınırlamak, her birinin bağımsız olarak otomatik sıkıştırma yapmasına izin vermek ve kalıcı durumu ajanın hatırlaması gereken sohbet geçmişinde değil, yeniden okuyabileceği bir dosyada tutmak.

## Uzun bir ajan oturumu zamanla gerçekte neden kötüleşiyor?

Çünkü bir ajanın yaptığı her şey — bir dosya okumak, bir komut çalıştırmak, bir aracı çağırmak, kendi önceki yanıtları dahil — bir şey onu aktif olarak kaldırmadıkça aynı bağlam penceresinde kalıyor; oturumun onuncu sorusunu yanıtlayan bir model, bunu ilk dokuz sorunun dosya içeriği ve komut çıktısı hâlâ ilgi için rekabet ederken yapıyor. Pratik belirti, bir kodlama ajanını bir saat çalıştıran herkese tanıdık: zaten okuduğu dosyaları yeniden okumaya başlıyor, oturumun başındaki bir kararı unutuyor veya hangi yaklaşımı zaten deneyip bıraktığını kaybediyor.

## Bir kodlama oturumu sırasında bağlam penceresini gerçekte ne dolduruyor?

Ne kadar katkıda bulunduğuna göre kabaca sıralanmış dört şey var: büyük dosya okumaları (özellikle bir düzenlemeden sonra aynı dosyayı yeniden okumak), ayrıntılı araç ve komut çıktısı (bir derleme kaydının veya test çalıştırmasının, tek bir ilgili hata için yüzlerce satır dökmesi), tam sohbet geçmişi (mevcut görevle artık ilgisi olmayanlar dahil her önceki tur) ve birikmiş keşif (önemli olan tek dosyayı bulmak için yirmi dosyaya dokunan bir arama, yirmisi de hâlâ bağlamda otururken). Bunların hiçbiri tam olarak hata değil — ajan işini yapıyor — ama hiçbiri kendi başına küçülmüyor.

## Sıkıştırma gerçekte nasıl yardımcı oluyor, ne zaman yetersiz kalıyor?

Sıkıştırma, eski bağlamı daha kısa bir forma özetleyerek pencerede yeni iş için yer açıyor; Claude Code, 9 Ekim 2026'da (sürüm 2.1.296) `autoCompactWindow`'u alt ajan başına bir ayar olarak ekledi, böylece her alt ajan üst oturumdan devralmak yerine kendi sıkıştırma eşiğini yönetebiliyor. Bu önemli, çünkü dar ve sınırlı bir görev yapan bir alt ajan — örneğin bir test paketini çalıştırıp sonuçları bildiren bir ajan — çok dosyalı bir yeniden yapılandırmayı yöneten bir üst oturumla aynı bağlam bütçesine ihtiyaç duymuyor; ona yine de o bütçeyi vermek, sonradan sıkıştırılacak daha fazla şey anlamına geliyor.

Sıkıştırmanın sınırı, tasarım itibarıyla kayıplı olması: "A yaklaşımını denedik, X nedeniyle başarısız oldu, sonra B'yi denedik" özeti kullanışlı ama 400 satırlık bir diff'in özeti, belirli bir satıra yeniden başvurmanız gerektiğinde diff'in yerini tutmuyor. Sıkıştırma size yer satın alıyor; hassasiyeti geri satın almıyor.

## Sorunu başta önlemek için alt ajanları nasıl sınırlamalısınız?

Her alt ajana net bir "tamamlandı" tanımıyla tek bir görev verin, genel hedefin bir dilimini artı "kendi muhakemeni kullan" değil — "`auth/` içindeki başarısız testleri düzelt" denilen bir alt ajan kendi bağlamında çalışabilir, bir sonuç bildirebilir ve o bağlam atılabilir; "auth yeniden yapılandırmasına yardım et" denilen bir alt ajan ise üst oturumun zaten sahip olduğu bağlamı yeniden türetmek zorunda kalır. 6 Ekim 2026 değişiklik kaydındaki `CLAUDE_CODE_WORKFLOW_SUBAGENT_MODEL` eklemesi aynı ilkeye farklı bir açıdan işaret ediyor: dar ve iyi tanımlanmış alt görevler, daha küçük veya farklı bir modele yönlendirilecek kadar ucuz, ama bu sadece görevin kendisi gerçekten sınırlıysa işe yarıyor.

| Örüntü | Bağlam maliyeti | Ne zaman işe yarar |
|---|---|---|
| Dar, sınırlı görev başına bir alt ajan | Düşük — izole bağlam, tamamlanınca atılır | Test çalıştırmaları, tek dosya düzeltmeleri, sorgular |
| Her şeyi yapan tek, uzun ömürlü oturum | Yüksek — tüm oturum boyunca birikir | Kısa görevler, keşif amaçlı iş |
| Belirsiz, geniş hedef verilen alt ajan | Yüksek — devralması gereken bağlamı yeniden türetir | Nadiren — bu örüntüden kaçının |
| Üst oturumun devredip sadece sonucu okuması | Üst oturumda düşük, alt ajanda izole | Net alt görev sınırları olan çok adımlı iş |

## "Context-mode" örüntüsü nedir, benimsemeye değer mi?

Yerleşik bir özellikten çok pratik bir kural: uzun bir oturum boyunca kararları hatırlaması için ajana güvenmek yerine, ihtiyaç duyduğu kararları düz bir dosyaya kalıcı hale getiriyorsunuz — denenenlerin, mevcut yaklaşımın ve açıkça kapsam dışı olanın sürekli güncellenen bir kaydı — ve ajanın her önemli adımın başında sohbet geçmişine güvenmek yerine o dosyayı yeniden okumasını sağlıyorsunuz. Kazanç şu: bir dosyayı tamamen yeniden okumak ucuz ve onu üreten sohbetin token maliyetini taşımıyor; ajan sonuca ulaşıyor, oraya ulaşan ileri-geri yazışmaya değil.

```text
Çok oturumlu bir yeniden yapılandırma için asgari bir context-mode dosyası:
  ## Mevcut yaklaşım
  Auth ara yazılımını yeni oturum deposuna taşıma (PR #412'ye bakın).

  ## Denendi ve reddedildi
  - Oturum sorguları için bellek içi önbellek: eşzamanlı yazmalarda bozuldu.

  ## Açıkça kapsam dışı
  - Hız sınırlayıcıya dokunma; ayrı bir ticket var.

  ## Sonraki adım
  /api/admin rotalarının taşınmasını bitir, sonra tam auth test paketini çalıştır.
```

## Dosya düzeniniz ve AGENTS.md dosyanız gerçekte ne içermeli?

AGENTS.md'yi, taze bir ajan oturumunun koddan gerçekten çıkaramayacağı şeylere odaklayın — derleme komutları, test komutları, hangi dizinlerin üretilmiş olduğu ve elle düzenlenmemesi gerektiği, ve birkaç dosya okumaktan açık olmayan proje kuralları. Burası tam bir mimari anlatımının yeri değil; buna ihtiyaç duyan bir ajan kodu okuyabilir, AGENTS.md'deki eskimiş bir mimari bölümü ise bölüm olmamasından daha kötüdür, çünkü ajan okuduğundan çok ona güvenir. [İlk MCP bağlayıcınızı yazmak](/tr/posts/ilk-mcp-baglayicini-yaz-2026) aynı gerginlikle araç seviyesinde karşılaşıyor — çok uzun bir araç açıklaması her çağrıda bağlamı harcıyor; bu yüzden Claude Code, 8 Ekim 2026'da (sürüm 2.1.295) araç arama limitini, her zaman ana bağlamda tutulanlar yerine özellikle arama üzerinden yüklenen açıklamalar için 16.384 karaktere çıkardı.

## Ajanlar CI/CD'ye veya daha uzun hatlara bağlandığında bu nasıl değişiyor?

Sınırlama disiplini daha az önemli değil, daha önemli hâle geliyor, çünkü bir hat ajanı genellikle gözetimsiz çalışıyor — [AI ajanlarını CI/CD'ye güvenle bağlamak](/tr/posts/ai-ajanlari-cicd-guvenle-baglamak) bunun erişim kontrolü tarafını ele alıyor, ama bağlam tarafı aynı ilke: tüm deponun geçmişi ve her önceki çalıştırmanın kayıtları verilen bir CI ajanı, asıl başarısız teste ulaşmadan önce bütçesini ilgisiz bağlamda yakar. Onu mevcut başarısızlığa, ilgili dosyaya ve başka hiçbir şeye sınırlayın, gerçekten gerekmedikçe daha fazlasını istemesine izin vermeyin.

Kişisel yorumum: "ajanım oturumun ortasında aptallaştı" şikayetlerinin çoğu, bağlam penceresi kılığına girmiş bir sınırlama sorunu. Otomatik sıkıştırma ve daha büyük pencereler yardımcı oluyor ama belirtiyi tedavi ediyor — gerçek çözüm, ajanlara daha sık daha dar işler vermek; bu bir ayar değişikliği değil, bir iş akışı değişikliği.

## Sıkça Sorulan Sorular

### Bir yapay zeka kodlama ajanı oturum uzadıkça neden kötüleşiyor?

Çünkü dosya okumaları, komut çıktısı ve sohbet geçmişi, onları otomatik olarak kaldıran hiçbir şey olmadan tek bir bağlam penceresinde birikiyor. Model giderek büyüyen, büyük ölçüde ilgisiz önceki bağlam üzerinde muhakeme yapmak zorunda kalıyor; bu yüzden uzun oturumlarda dosyaları yeniden okumaya veya önceki kararları unutmaya başlıyor.

### Claude Code'un autoCompactWindow ayarı gerçekte ne yapıyor?

9 Ekim 2026'da (sürüm 2.1.296) eklenen bu ayar, her alt ajanın üst oturumun ayarını devralmak yerine kendi otomatik sıkıştırma eşiğini belirlemesine izin veriyor. Bu önemli, çünkü dar bir şekilde sınırlanmış bir alt ajan, onu yöneten oturumdan çok daha küçük bir bağlam bütçesine ihtiyaç duyuyor.

### Bir ajana daha büyük bir bağlam penceresi vermek bozulma sorununu çözüyor mu?

Kendi başına değil. Daha büyük bir pencere sıkıştırmanın ne zaman devreye gireceğini geciktiriyor ama ajana, asla ihtiyaç duymaması gereken bağlamı yeniden türetmeye zorlayan belirsiz, geniş bir görev verilmesini düzeltmiyor. Alt ajanları dar ve iyi tanımlanmış görevlere sınırlamak, pencere boyutundan daha fazlasını çözüyor.

### Bir projenin AGENTS.md dosyası, ajan bağlam yönetimine yardımcı olmak için ne içermeli?

Derleme ve test komutları, hangi dizinlerin üretilmiş olduğu ve elle düzenlenmemesi gerektiği, koddan açık olmayan proje kuralları — tam bir mimari anlatımı değil. Eskimiş bir mimari bölümü, hiç olmamasından daha kötüdür, çünkü bir ajan AGENTS.md'nin söylediğine, gerçek dosyalarda okuduğundan daha çok güvenir.
