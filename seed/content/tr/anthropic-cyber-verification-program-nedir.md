---
title: "Anthropic'in Cyber Verification Program'ı Nedir?"
slug: "anthropic-cyber-verification-program-nedir"
translationKey: "anthropic-cyber-verification-program-2026"
locale: "tr"
excerpt: "Kısa cevap: Claude'un siber korumalarını doğrulanmış güvenlik ekipleri için gevşeten üç katmanlı Anthropic programı: Defense, Red Team, Specialized."
category: "ai"
tags: ["claude", "web-security", "compliance", "ai-regulation"]
publishedAt: "2026-10-09"
seoTitle: "Anthropic Cyber Verification Program: Katmanlar"
seoDescription: "Anthropic Cyber Verification Program (6 Ekim 2026): Defense, Red Team, Specialized katmanlarıyla doğrulanmış ekiplere Claude siber çalışması izni veriyor."
---

Kısa cevap: Cyber Verification Program (CVP), Claude'un varsayılan siber güvenlik sınırlamalarını doğrulanmış güvenlik profesyonelleri için gevşeten bir doğrulama sistemi. 6 Ekim 2026'da duyurulan program, eski hep-ya-da-hiç erişim modelini üç katmana ayırıyor — Defense, Red Team, Specialized — ve daha önceki Project Glasswing girişimini de bu çatı altına alıyor.

## Cyber Verification Program tam olarak nedir?

Nitelikli güvenlik ekiplerinin, Claude'un normalde reddedeceği saldırı ve savunma odaklı siber çalışmaları yapmasına izin veren bir doğrulama süreci. Claude Opus 5.5, Sonnet 5.5 ve diğer genel kullanıma açık modeller varsayılan olarak çoğu sızma testi ve exploit geliştirme talebini engelleyen temkinli sınıflandırıcılar taşır; bunun nedeni kötüye kullanımı sınırlamak. CVP, bir kuruluş kimliğini ve yetkisini kanıtladığında bu engellemeyi kademeli olarak kaldırır — ama fidye yazılımı dağıtmak gibi yasaklı eylemler, doğrulanmış olsun olmasın her katmanda engellenmeye devam eder.

## Üç erişim katmanı nedir?

Her katman farklı bir çalışma türüne karşılık gelir ve kendi inceleme eşiğini taşır. Defense Access en geniş kapı, Specialized Access en dar olanı.

| Katman | Kimler uygun | Tipik çalışma | İnceleme süresi |
|---|---|---|---|
| Defense Access | Güvenlik ekipleri, üniversiteler, kritik altyapı operatörleri, açık kaynak bakımcıları, geçmişte açık bildirmiş araştırmacılar | SOC izleme, olay müdahalesi, kötü amaçlı yazılım tersine mühendisliği, açık doğrulama | Birkaç gün |
| Red Team Access | Sadece kuruluşlar — kurum içi ve devlet kırmızı takımları, yetkili test firmaları | Test etmeye yetkili oldukları sistemlerde sızma testi ve kırmızı takım çalışması | Birkaç hafta (beklerken Defense Access'te kalınır) |
| Specialized Access | ABD hükümetiyle birlikte incelenen sınırlı sayıda kuruluş | Kritik sistemleri test etme: uçuş operasyonları, elektrik şebekeleri, telekom, bankalar arası transfer altyapısı | Tam devlet destekli inceleme |

Bireysel araştırmacılar Defense Access için başvurabilir ama Red Team ve Specialized Access'ten hariç tutulur — bu iki katman kurumsal bağlantı gerektirir. Üç katman arasındaki fark sadece kağıt üzerinde değil: Red Team Access'e geçen bir kuruluş, fiziksel zarara veya kitlesel kesintiye yol açabilecek eylemler dışında gerçek zamanlı engellemelerin neredeyse tamamından kurtuluyor, Defense Access'teki bir ekip ise hâlâ çoğu saldırı senaryosunda bloklanıyor.

## CVP hangi Claude modellerini kapsıyor?

CVP, Claude Opus 5.5, Claude Sonnet 5.5 ve Claude Mythos 5.1'i kapsıyor; Anthropic'in programa ekleyeceği gelecekteki modeller de dahil. Claude Fable 5.1, CVP dışında standart temkinli siber korumalarla genel kullanıma açık kalıyor. Fable 5.1 veya Mythos 5.1'de sıfır veri saklama erişimine sahip kuruluşlar, bu sonbahar gelecek Enterprise Frontier Safeguards (EFS) devreye girene kadar CVP'yi aynı sıfır saklama koşullarıyla kullanabilir — [EFS'nin tam olarak neyi değiştirdiğine](/tr/posts/anthropic-enterprise-frontier-safeguards-nedir) buradan bakabilirsiniz.

## Project Glasswing'e ne oldu?

Kritik yazılımları koruyan kuruluşlara Claude Mythos'a güvenilir erişim veren Glasswing, [Anthropic'in kendi duyurusuna göre](https://www.anthropic.com/news/cyber-verification-program) bağımsız bir program olarak kapatıldı ve CVP'nin içine alındı. Mevcut Glasswing üyeleri, güncel modeller için yeniden başvurmadan doğrudan Specialized Access'e geçiyor. Anthropic'e göre programın pratikte karşılığı büyük: Glasswing ortakları Nisan-Temmuz 2026 arasında **en az 129.000 doğrulanmış yazılım açığı** ortaya çıkardı, Anthropic'in kendi açık kaynak taraması Nisan-Ekim arasında 5.500 açık daha buldu. Toplamın 33.000'den fazlası kritik veya yüksek önem derecesinde ve Anthropic bunun bir eksik sayım olduğunu söylüyor — ortakların yarısından azı yama sayılarını paylaştı, şirket gerçek rakamın en az beş kat daha yüksek olmasını bekliyor. Birkaç ortak, Mythos erişiminin kendi açık bulma sürecini aylar, hatta bazı durumlarda yıllar hızlandırdığını söyledi; bu da programın sadece bir erişim genişlemesi değil, gerçek bir operasyonel kazanç olduğunu gösteriyor.

## Her katman pratikte ne kadar açıyor?

Anthropic, Claude Opus 5.5'i CyScenarioBench üzerinde test etti; her katman için beş kez tekrarlanan 10 çok aşamalı siber senaryo, katman başına 50 deneme.

| Erişim seviyesi | Engellenen deneme | Tamamlanan deneme |
|---|---|---|
| CVP erişimi yok | 50/50 | 0/50 |
| Defense Access | 46/50 | 4/50 |
| Red Team Access | 0/50 | 34/50 |

Red Team Access, modelin hiç koruma olmadan ulaştığı %68'lik tamamlama oranının aynısını veriyor — bu oran Specialized Access için de temsil edici. Defense ile Red Team arasında 34 puanlık fark kademeli bir eğim değil, keskin bir sıçrama; dolayısıyla isimlerin çağrıştırdığından çok daha önemli olan şey, yaptığınız işe doğru katmanı seçmek.

## CVP'ye nasıl başvurulur?

Başvuru `portal.anthropic.com/programs/cvp` adresindeki CVP portalından yapılıyor. Anthropic başvuru sahibini doğruluyor ve istenen katmana uygun güvenlik kontrollerinin kanıtını istiyor — Defense Access için SOC 2 raporu, Red Team Access için kapsamı belirlenmiş yetki mektupları, Specialized Access için devlet onayı. Onaylandıktan sonra bir workspace yöneticisinin programı ilgili workspace'e açıkça ataması gerekiyor; erişim hesap genelinde otomatik gelmiyor. CVP şu an Claude Platform, Google Cloud Vertex AI ve Microsoft Foundry'de çalışıyor; Amazon Bedrock erişimi sadece EFS'ye de uygun müşterilerle sınırlı. Doğrulanmış bir ekip katmanının izin vermesi gereken bir işte engellenirse, çözüm destek talebi değil Anthropic'in yanlış pozitif bildirim formu. [SiliconANGLE'ın duyuru haberi](https://siliconangle.com/?p=849593) de aynı süreci doğruluyor, ancak bazı ikincil kaynaklar model adlandırmasında farklı ayrıntılar veriyor — spesifik detaylar için güvenilecek kaynak her zaman portalın kendisi.

## Claude'un siber korumalarını gevşetmek gerçekten güvenli mi?

Buradaki gerilim gerçek: bir kırmızı takımın saldırgandan önce açığı bulmasına yardım eden yetenek, tam olarak bir saldırganın da istediği yetenek. Anthropic'in bahsi, her CVP katmanında zorunlu veri saklamanın — kötüye kullanımın sonradan izlenebilmesi için — sıkı uygunluk incelemesiyle birlikte, daha hızlı ve ölçekli açık bulma karşısında makul bir takas olduğu. Sadece Glasswing'den gelen 129.000 açık rakamı bu takasın operasyonel olarak işe yaradığını gösteriyor; izlenmesi gereken şey kavramın kendisi değil, daha fazla ekip başvururken doğrulama sürecinin yeterince sıkı kalıp kalmayacağı.

Bu denge, güvenlik ekiplerinin günlük işine de yansıyor: bir SOC analisti artık şüpheli bir ikili dosyayı tersine mühendislik yaparken Claude'un reddiyle karşılaşmadan ilerleyebiliyor, ama aynı analist kritik bir santral sistemini test etmek isterse Specialized Access'in devlet onaylı incelemesinden geçmek zorunda — katmanlar arasındaki bu sürtünme farkı kazara değil, bilinçli bir tasarım kararı.

CVP, Anthropic'in daha geniş tehdit müdahalesi çalışmalarının yanında duruyor — [Anthropic'in 2026 tehdit raporu](/tr/posts/anthropicin-2026-tehdit-raporunda-neler-var) ve [Claude'un dördüncü yetkisiz erişim vakası](/tr/posts/claude-dorduncu-yetkisiz-erisim-vakasi) üzerine yazdıklarımız aynı örüntüyü gösteriyor: daha yetenekli modeller aynı anda hem daha tehlikeli hem savunma için daha kullanışlı hale geliyor, koruma tartışması da onlarla birlikte ilerliyor. Buradaki açık bulma rakamları, madalyonun diğer yüzündeki ilgili bir soruna da işaret ediyor — bakın [AI çöpünün açık kaynak güvenlik incelemesini nasıl zorladığına](/tr/posts/ai-copu-acik-kaynak-guvenligi).

## Sıkça Sorulan Sorular

### Anthropic'in Cyber Verification Program'ı nedir?

Claude Opus 5.5, Sonnet 5.5 ve Mythos 5.1'de doğrulanmış güvenlik profesyonelleri için varsayılan siber korumaları gevşeten üç katmanlı bir doğrulama sistemi — Defense, Red Team, Specialized Access. 6 Ekim 2026'da başladı ve daha önceki Project Glasswing programını içine aldı.

### Defense Access'e kimler başvurabilir?

Şirketlerdeki, sivil toplum kuruluşlarındaki, üniversitelerdeki ve devlet kurumlarındaki güvenlik ekipleri; kritik altyapı operatörleri; küçük güvenlik firmaları; açık kaynak bakımcıları; ve geçmişte açık bildirmiş bireysel araştırmacılar. Anthropic birkaç gün içinde yanıt vermeyi hedefliyor.

### Bireysel bir araştırmacı Red Team veya Specialized Access alabilir mi?

Hayır. Her iki katman da kurumsal bağlantı gerektiriyor — Red Team Access kurum içi veya devlet kırmızı takımlarıyla yetkili test firmalarıyla sınırlı, Specialized Access ise kritik sistemler için ABD hükümetiyle ortak inceleme gerektiriyor.

### CVP, Claude'un hiçbir sınır olmadan her şeyi yapmasına mı izin veriyor?

Hayır. Fidye yazılımı dağıtmak veya fiziksel zarar vermek gibi yasaklı eylemler, doğrulama durumundan bağımsız olarak her katmanda engellenmeye devam ediyor. CVP meşru güvenlik çalışmasının kapsamını genişletiyor; Anthropic'in sert sınırlarını kaldırmıyor.
