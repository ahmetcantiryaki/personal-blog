---
title: "Anthropic Enterprise Frontier Safeguards (EFS) Nedir?"
slug: "anthropic-enterprise-frontier-safeguards-nedir"
translationKey: "anthropic-enterprise-frontier-safeguards-efs"
locale: "tr"
excerpt: "Kısa cevap: EFS, Claude trafiğinizi kendi bulut hesabınızda tutup kötüye kullanımı insan incelemesi olmadan otomatik tespit eden yeni Anthropic modeli."
category: "ai"
tags: ["claude", "compliance", "privacy", "cloud"]
publishedAt: "2026-09-05"
seoTitle: "Anthropic Enterprise Frontier Safeguards (EFS) Nedir?"
seoDescription: "Kısa cevap: EFS, Claude trafiğinizi kendi bulut hesabınızda tutup kötüye kullanımı insan incelemesi olmadan otomatik tespit eden yeni Anthropic modeli."
---

Kısa cevap: Enterprise Frontier Safeguards (EFS), Anthropic'in 1 Eylül 2026'da duyurduğu ve Claude etkileşim verisini kendi sunucularında değil, müşterinin AWS, Azure veya Google Cloud hesabında tutan bir güvenlik modeli. Kötüye kullanım tespiti bu veri üzerinde tamamen otomatik çalışıyor; hiçbir Anthropic çalışanı veriyi insan olarak incelemiyor. Sistem sonbahar 2026'da aşamalı devreye giriyor, ücretsiz.

## EFS hangi soruna çözüm getiriyor?

Kısa cevap: Haziran 2026'da yürürlüğe giren zorunlu 30 günlük veri saklama kuralı, Claude Fable ve Mythos model ailesi için müşterilere "veri hiç saklanmasın" seçeneğini kapatmıştı. Bankacılık, sağlık ve kamu sektöründeki müşteriler için bu, verinin üç hafta boyunca üçüncü bir tarafın sunucusunda beklemesi anlamına geliyordu ve uyumluluk ekiplerini rahatsız etti.

Anthropic bu konuda daha önce yalnızca söylenti düzeyinde bir değişiklik sinyali vermişti; Bloomberg'in Ağustos 2026'daki haberi henüz resmi olmayan bir plana dayanıyordu. EFS, o planın somutlaşmış, isimlendirilmiş ve teknik detaylarıyla açıklanmış hali. Aradaki fark önemli: artık veri Anthropic'in sunucusunda hiç saklanmıyor, bunun yerine doğrudan müşterinin kendi bulut deposuna yazılıyor.

## EFS teknik olarak nasıl çalışıyor?

Kısa cevap: Claude trafiği müşterinin kendi Amazon S3, Azure Blob Storage veya Google Cloud Storage hesabındaki bir bucket'a, müşterinin yönettiği şifreleme anahtarlarıyla yazılıyor; Anthropic'in otomatik analiz sistemi bu veriyi okuyup oturumlar ve hesaplar arasındaki örüntülere bakıyor, ancak veriyi kendi tarafında hiç tutmuyor.

Anthropic'in gerekçesi şu: tek bir isteği anlık olarak inceleyip hemen silmek, saldırgan siber yetenek geliştirme veya çalınmış API anahtarı kullanımı gibi karmaşık kötüye kullanım biçimlerini yakalamaya yetmiyor. Çalınmış bir anahtar tek başına sıradan görünen istekler üretir; sorun ancak zaman içindeki davranış örüntüsüne bakıldığında ortaya çıkıyor. Bu yüzden sistem, verinin bir "rolling window" (kayan pencere) üzerinde saklanmasını gerektiriyor — ama bu pencere Anthropic'in değil, müşterinin kendi bulut hesabının içinde duruyor.

Ciddi bir kötüye kullanım sinyali bulunduğunda, uyarı doğrudan müşterinin kendi güvenlik ekibine gidiyor; Anthropic'in bir inceleme kuyruğuna düşmüyor. Şirket bunu "tamamen otomatik, insan incelemesi sıfır" olarak tanımlıyor.

## EFS hangi ürünleri kapsıyor?

Kısa cevap: Claude Code, Claude Enterprise, Claude Platform, Amazon Bedrock üzerindeki Claude, Google'ın Agent Platform'u ve Microsoft Foundry — yani Claude'a nereden erişirseniz erişin aynı model geçerli oluyor. Bu, geliştiricilerin doğrudan API üzerinden mi yoksa bir bulut sağlayıcısı üzerinden mi bağlandığına bakılmaksızın aynı veri kontrolüne sahip olacağı anlamına geliyor.

Anthropic'e göre EFS, 100'den fazla müşteriyle birlikte geliştirildi; bunlar arasında finans, sağlık, üretim, telekom, hukuk, perakende ve kamu sektörü yer alıyor. Analysis and Resilience Center for Systemic Risk (ARC) çatısı altındaki büyük ABD bankalarının (Goldman Sachs, Morgan Stanley, Citi, Bank of America, Wells Fargo) güvenlik yöneticileri de sürece dahil oldu.

| Özellik | Eski model (Haziran 2026) | EFS (Eylül 2026) |
|---|---|---|
| Veri nerede duruyor | Anthropic sunucusu | Müşterinin kendi bulut hesabı |
| Saklama süresi | Zorunlu 30 gün | Müşteri belirliyor |
| İnceleme | Anthropic insan incelemesi mümkün | Tamamen otomatik, insan incelemesi yok |
| Kapsam | Yalnızca Fable/Mythos modelleri | Claude Code, Enterprise, Platform, Bedrock, Foundry |
| Ücret | — | Ücretsiz (bulut depolama maliyeti müşteride) |

## Geliştiriciler ve şirketler için pratik etkisi ne?

Kısa cevap: Claude Code veya Claude API kullanan bir ekip için EFS, veri konumu (data residency) sorununu ortadan kaldırıyor çünkü loglar hiçbir zaman şirket sınırlarının dışına çıkmıyor; buna karşılık ekip artık kendi bulut hesabında bu veriyi saklamanın depolama maliyetini üstleniyor. Anthropic hizmetin kendisi için ücret almasa da, S3 veya Blob Storage faturası müşteriye kesiliyor.

Bu değişiklik, [Claude'un Cowork ve Claude Code arasında paylaştığı yeni hafıza modeliyle](/tr/posts/claude-hafizasi-chat-cowork-birlesti) aynı yöne işaret ediyor: Anthropic, kurumsal müşterilere veri üzerinde daha fazla doğrudan kontrol vermeye çalışıyor. Aynı şekilde [Claude Compliance API'nin Cowork ve Claude Code'u kapsayacak şekilde genişlemesi](/tr/posts/claude-compliance-api-cowork-claude-code-denetimi) de bu kurumsal güven inşası stratejisinin bir parçası.

Benim değerlendirmem şu: EFS, Anthropic'in Haziran 2026'daki zorunlu saklama kararının kurumsal müşterilerde yarattığı güven kaybını onarma girişimi. Teknik çözüm zarif, ama "sonbahar 2026'da aşamalı devreye alım" ifadesi belirsiz — hangi müşterilerin ne zaman erişeceği netleşmeden, düzenlemeye tabi sektörlerdeki ekiplerin planlama yapması zor.

## EFS'nin sınırları ve eleştirilen yönleri neler?

Kısa cevap: EFS, veriyi Anthropic'in sunucusundan çıkarıyor ama saklama zorunluluğunu tamamen ortadan kaldırmıyor — kayan pencere analizi çalışabilmesi için veri hâlâ bir süre (Anthropic bunu net bir gün sayısıyla açıklamadı) bir yerde durmak zorunda; fark, bu "bir yer"in artık müşterinin kendi hesabı olması. Sıfır veri saklama (zero-data-retention) isteyen bir müşteri için EFS, eskisinden daha iyi ama hâlâ tam bir ZDR çözümü değil.

İkinci eleştiri noktası, otomatik tespitin şeffaflığıyla ilgili: Anthropic'in analiz algoritması müşteriye açık kaynak olarak sunulmuyor, yani hangi örüntülerin "ciddi kötüye kullanım sinyali" sayılacağına dair karar hâlâ Anthropic'in elinde. Bir güvenlik ekibi, kendi verisi üzerinde çalışan ama iç mantığını göremediği bir sistemi denetlemek durumunda kalıyor. Bu, "insan incelemesi yok" vaadinin güven inşa eden yönüyle, algoritmik şeffaflık eksikliğinin yarattığı tedirginlik arasında bir gerilim yaratıyor.

## EFS'ye nasıl hazırlanılır?

Kısa cevap: Şimdiden hangi bulut sağlayıcısında (AWS, Azure veya GCP) bucket açacağınızı ve hangi ekibin erişim ve şifreleme anahtarı yöneticisi olacağını belirleyin; EFS aşamalı olarak açıldığında bu karar sizi beklemesin. Uyumluluk ekibinizle mevcut 30 günlük saklama sürecinizin EFS'ye geçişte nasıl etkileneceğini şimdiden netleştirmek, aşamalı rollout başladığında zaman kazandırıyor.

Mevcut Claude Enterprise veya Bedrock sözleşmeniz varsa, hesap yöneticinizden EFS'nin sizin bölgenize ne zaman geleceğini sorun — Anthropic şu ana kadar kesin bir sektör veya coğrafya sıralaması açıklamadı.

Güvenlik ekibiniz için de bir hazırlık maddesi var: EFS'nin ürettiği uyarıları hangi araçla (SIEM, ticket sistemi, doğrudan Slack) karşılayacağınızı şimdiden planlayın. Anthropic uyarıyı doğrudan müşterinin güvenlik ekibine gönderiyor, yani bu uyarıları alacak ve önceliklendirecek bir sürecin EFS açılmadan önce hazır olması gerekiyor — aksi halde otomatik tespitin hızı, insan tarafındaki yavaş tepkiyle boşa gidiyor.

Son bir pratik not: EFS'nin bulut sağlayıcı desteği şimdilik AWS, Azure ve GCP ile sınırlı; farklı bir bulut altyapısı kullanan veya tamamen on-premise çalışan bir ekipseniz, Anthropic'in bu üç büyük sağlayıcının dışına ne zaman genişleyeceği henüz belirsiz ve bu konuda resmi bir taahhüt yok. Küçük ekipler için pratik sonuç şu: EFS'yi beklerken bugün elinizdeki sözleşme koşullarını ve mevcut veri saklama sürenizi bir kez daha gözden geçirmek, aşamalı geçiş başladığında sürpriz yaşamamanızı sağlıyor.

## Sıkça Sorulan Sorular

### Enterprise Frontier Safeguards ne zaman kullanıma açılıyor?

Anthropic, EFS'yi 1 Eylül 2026'da duyurdu ve sistemin sonbahar 2026'dan itibaren müşterilere aşamalı olarak açılacağını belirtti. Kesin bir tarih veya sektör sıralaması henüz paylaşılmadı.

### EFS ücretli mi?

Hayır, Anthropic Enterprise Frontier Safeguards için ayrı bir ücret almıyor. Ancak veriyi kendi bulut hesabınızda (S3, Blob Storage veya Cloud Storage) sakladığınız için, bu depolamanın maliyetini kendi bulut sağlayıcınıza ödüyorsunuz.

### EFS hangi Claude ürünlerini kapsıyor?

Claude Code, Claude Enterprise, Claude Platform, Amazon Bedrock üzerindeki Claude, Google'ın Agent Platform'u ve Microsoft Foundry — Claude'a nereden bağlandığınıza bakılmaksızın aynı veri modeli geçerli oluyor.

### EFS eski 30 günlük zorunlu saklama kuralından farkı ne?

Eski kuralda veri Anthropic'in kendi sunucusunda 30 gün zorunlu olarak duruyordu ve Fable/Mythos modellerinde bu süreyi kısaltma seçeneği yoktu. EFS'de veri hiçbir zaman Anthropic sunucusuna gitmiyor; doğrudan müşterinin kendi bulut hesabında kalıyor ve inceleme tamamen otomatik yapılıyor.
