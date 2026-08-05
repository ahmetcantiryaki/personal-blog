---
title: "Kurucular İçin Claude ile Sözleşme Okuma"
slug: "claude-ile-sozlesme-okuma-kurucular"
translationKey: "reading-contracts-with-claude-founder"
locale: "tr"
excerpt: "Avukatınız yok ama önünüzde 40 sayfalık bir tedarikçi sözleşmesi var. Claude'u sözleşme okumak için güvenle nasıl kullanırsınız, ne zaman avukata gidersiniz?"
category: "business"
tags: ["claude", "best-practices", "career", "ai-tools"]
publishedAt: "2026-08-05"
seoTitle: "Kurucular İçin Claude ile Sözleşme Okuma Rehberi"
seoDescription: "Avukatınız yok ama önünüzde 40 sayfalık bir tedarikçi sözleşmesi var. Claude'u sözleşme okumak için güvenle nasıl kullanırsınız, ne zaman avukata gidersiniz?"
---

Bir tedarikçi 40 sayfalık bir MSA (Master Service Agreement) gönderiyor, cevap için 48 saatiniz var ve şirket içi bir hukuk ekibiniz yok. Bu, ilk on çalışanı işe alana kadar her kurucunun defalarca yaşadığı bir sahne. Claude gibi bir LLM burada gerçek bir zaman kazandırabilir — ama doğru kullanıldığında. Bu yazı, güvenli kullanımlarla riskli kullanımlar arasındaki çizgiyi net şekilde çiziyor.

## Güvenli Kullanımlar: Ne İçin Kullanabilirsiniz

Claude'u bir sözleşmeyi *anlamak* için kullanmak güvenli; sözleşme *yerine* kullanmak değil. Pratikte güvenli üç kullanım alanı var:

- **Özetleme**: Uzun bir sözleşmenin ana yükümlülüklerini, sürelerini ve fesih koşullarını sade dille özetletmek.
- **Anormal madde tespiti**: "Bu sözleşmede standart dışı görünen, sektör normlarından sapan maddeler var mı?" diye sormak.
- **Jargon çözme**: "Indemnification", "limitation of liability" gibi hukuki terimlerin bu sözleşme bağlamında ne anlama geldiğini açıklatmak.
- **Standartla karşılaştırma**: Kendi şablon sözleşmenizle karşılaştırıp farkları listelemesini istemek.

## Riskli Kullanım: Avukat Yerine Geçirmek

Buradaki çizgi net: Claude bir hukuk danışmanı değil, bir okuma asistanı. "Bu sözleşmeyi imzalamalı mıyım?" sorusu bir hukuki tavsiye talebidir ve model bu soruyu yanıtlarken bile — doğru bir yanıt gibi görünse bile — yargı yetkiniz, eyaletiniz veya ülkenizdeki spesifik emsal kararlar hakkında bilgi sahibi olmayabilir. Model, sözleşmenin sizin lehinize mi yoksa aleyhinize mi olduğunu genel prensiplerle değerlendirebilir, ama bu bir hukuki görüş değil, bir okuma yardımıdır.

## NDA, MSA ve Tedarikçi Sözleşmeleri İçin Pratik Promptlar

Farklı sözleşme türleri farklı sorular gerektirir. Aşağıdaki tablo, üç yaygın sözleşme türü için başlangıç promptları veriyor:

| Sözleşme Türü | Başlangıç Promptu |
| --- | --- |
| NDA | "Bu NDA'daki gizlilik süresi ve kapsamı standart mı? Karşı tarafa aşırı geniş haklar tanıyan bir madde var mı?" |
| MSA | "Fesih koşullarını, ödeme yükümlülüklerini ve sorumluluk sınırlamasını (limitation of liability) madde numaralarıyla listele." |
| Tedarikçi Sözleşmesi | "Bu sözleşmede otomatik yenileme (auto-renewal) maddesi var mı? Varsa fesih bildirimi için kaç gün önceden haber vermem gerekiyor?" |

Bu promptların ortak noktası: her biri modeli belirli, doğrulanabilir bir göreve yönlendiriyor — genel bir "bu sözleşmeyi değerlendir" isteğinden çok daha kullanışlı sonuçlar veriyor. Cevabı aldıktan sonra bir adım daha atmakta fayda var: "bu maddelerden hangisi bizim standart şablonumuzdan sapıyor?" diye sormak, modelin ilk taramada gözden kaçırdığı ince farkları da yüzeye çıkarıyor — özellikle sorumluluk sınırlaması ve ödeme vadesi gibi rakamsal alanlarda.

## Uzun Bağlam Avantajı: Tüm Sözleşmeyi Tek Seferde Okutmak

[TechCrunch'ın haberine göre](https://techcrunch.com/2026/06/30/anthropic-launches-claude-sonnet-5-as-a-cheaper-way-to-run-agents/), Claude Sonnet 5, 1 milyon token'a kadar bağlam penceresiyle geliyor — bu, birkaç yüz sayfalık bir sözleşmeyi, eklerini ve önceki e-posta yazışmalarını tek bir konuşmaya sığdırabileceğiniz anlamına geliyor. Pratikte bu şu demek: sözleşmeyi parça parça yapıştırıp modelin bağlamı kaybetmesinden endişe etmenize gerek yok; tüm belgeyi tek seferde verip "3. bölümdeki fesih maddesiyle 7. ekteki SLA taahhüdü çelişiyor mu?" gibi belge-çapında sorular sorabilirsiniz. Bu, özellikle uzun MSA'larda ekler arası tutarsızlıkları yakalamak için değerli.

## Gizlilik ve Ticari Sır Yönetimi

Bir sözleşmeyi bir AI aracına yapıştırmadan önce sorulması gereken soru şu: bu belge bir NDA'ya tabi mi ve karşı tarafın veri işleme politikanız hakkında bir beklentisi var mı? Kurumsal Claude planları (API üzerinden erişim ile) varsayılan olarak müşteri verisini model eğitiminde kullanmıyor, ama bu, sözleşmenin kendi gizlilik maddelerinin sizi bir üçüncü taraf araca veri yüklemekten alıkoymadığı anlamına gelmiyor. Hassas ticari koşullar (fiyatlandırma, müşteri isimleri) içeren bölümleri redakte ettikten sonra yapıştırmak, çoğu durumda makul bir orta yol.

## İngilizce Sözleşmeleri Türkçe Özetletmek

Türkiye merkezli bir kurucuysanız, yabancı bir tedarikçi ya da yatırımcıdan gelen sözleşme çoğunlukla İngilizce oluyor — ve şirket ortaklarınızın ya da yönetim kurulunuzun hepsi İngilizceyi aynı rahatlıkla okumuyor olabilir. Claude'u burada bir çeviri aracı olarak değil, bir *özet köprüsü* olarak kullanmak daha isabetli: "Bu MSA'nın ana yükümlülüklerini Türkçe, madde numaralarıyla özetle" gibi bir prompt, tüm belgeyi kelime kelime çevirmekten daha hızlı ve daha az hataya açık bir sonuç veriyor — çünkü model, hukuki terimleri birebir çevirmek yerine anlamını Türkçede en yakın karşılığıyla ifade ediyor. Yönetim kuruluna sunacağınız bir özet için bu özetin altına orijinal İngilizce madde numaralarını referans olarak eklemeyi unutmayın; böylece biri orijinal metne dönüp doğrulama yapabilir.

## Ne Zaman Gerçek Bir Avukata Gitmelisiniz

Üç durum kesinlikle bir avukat gerektirir ve hiçbirinde AI aracının kararı yerine geçmesine izin vermemek gerekir: (1) sözleşme altı haneli veya üzeri bir yıllık değere sahipse, (2) fikri mülkiyet devri veya münhasırlık (exclusivity) maddeleri içeriyorsa, (3) sözleşme yabancı bir yargı yetkisine tabiyse. Bu üç durumun dışında kalan, düşük riskli ve standart görünen sözleşmeler için Claude ile ön okuma yapıp sonra hızlı bir avukat onayı istemek, hem zaman hem maliyet açısından makul bir sıralama.

## Ağustos 2026'da Nasıl Kurulmalı

Claude'u sözleşme okuma iş akışınıza eklerken en pratik yol, tekrar eden bir Proje (Project) oluşturup şirketinizin standart şablon maddelerini oraya yüklemek — böylece her yeni sözleşme otomatik olarak sizin standardınızla karşılaştırılıyor. [Claude sohbetlerini Projects ve Gems ile düzenleme rehberimizde](/tr/posts/ai-sohbetlerini-duzenle-projects-gems) bu kurulumu adım adım anlattık. Kurucu ortak vesting anlaşmanızı hazırlarken de aynı yaklaşımı kullanabilirsiniz — [kurucu ortak hisse ve vesting rehberimiz](/tr/posts/kurucu-ortak-hisse-ve-vesting-rehberi) bu konudaki temel maddeleri kapsıyor.

Açıkçası, bu araçların en büyük riski yanlış kullanım değil, aşırı güvendir — ve bu ayrım göründüğünden daha önemli. Model size akıcı ve kendinden emin bir cevap verdiğinde, o cevabın bir hukuki görüş olmadığını hatırlamak kolay değil — bu yüzden her önemli maddeyi, özellikle parayla ilgili olanları, iki kez okumanızı öneririm.

Sözleşme dışında AI araçlarıyla iş süreçlerinizi hızlandırmak isteyenler [tek kişilik girişim AI yığını rehberimize](/tr/posts/tek-kisilik-girisim-ai-yigini) bakabilir. Kategorideki diğer içerikler için [Girişimcilik & İş bölümümüzü](/tr/category/girisimcilik-is) takip edebilirsiniz.

## Sözleşmede Kırmızı Bayrak Kontrol Listesi

1. Otomatik yenileme (auto-renewal) maddesi var mı, fesih bildirim süresi ne kadar?
2. Sorumluluk sınırlaması (limitation of liability) tek taraflı mı, yoksa her iki taraf için de simetrik mi?
3. Fikri mülkiyet devri maddeleri, sizin geliştirdiğiniz kodu veya ürünü kapsıyor mu?
4. Münhasırlık (exclusivity) veya rekabet yasağı (non-compete) maddesi var mı, süresi makul mü?
5. Uyuşmazlık çözüm yeri (jurisdiction) sizin için pratik ve erişilebilir mi?

## Sıkça Sorulan Sorular

### Claude'a yüklediğim bir sözleşme model eğitiminde kullanılır mı?

Kurumsal ve API planlarında müşteri verisi varsayılan olarak model eğitiminde kullanılmıyor. Ama bu, sözleşmenin kendi gizlilik yükümlülüklerinizi ortadan kaldırdığı anlamına gelmiyor — hassas verileri redakte etmek yine de sorumluluğunuzda.

### Claude'un sözleşme değerlendirmesine ne kadar güvenebilirim?

Madde çıkarma, özetleme ve standart karşılaştırması gibi görevlerde güçlü bir asistan, ama hukuki tavsiye değil. Altı haneli değer, fikri mülkiyet devri veya yabancı yargı yetkisi içeren her sözleşme için gerçek bir avukat onayı şart.

### Uzun bir sözleşmeyi tek seferde mi, parça parça mı yapıştırmalıyım?

1 milyon token'lık bağlam penceresiyle tüm sözleşmeyi eklentileriyle birlikte tek seferde yapıştırmak, belge çapında tutarsızlıkları yakalamak için parça parça yapıştırmaktan daha etkili.

### NDA olmayan bir sözleşmeyi Claude'a yapıştırmak güvenli mi?

Genel olarak evet, ama hassas ticari koşulları (fiyatlandırma, müşteri isimleri, özel şartlar) redakte etmek yine de makul bir önlem — özellikle karşı tarafın kendi gizlilik beklentisi varsa.
