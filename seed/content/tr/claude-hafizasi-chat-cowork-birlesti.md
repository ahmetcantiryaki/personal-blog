---
title: "Claude Hafızası Artık Chat ve Cowork'te Ortak"
slug: "claude-hafizasi-chat-cowork-birlesti"
translationKey: "claude-unified-memory-chat-cowork"
locale: "tr"
excerpt: "Kısa cevap: Evet. Anthropic, 25 Ağustos'ta Claude'un hafızasını Chat ve Cowork'te birleştirdi; bilgi iki yönde akıyor, hassas konular dışarıda kalıyor."
category: "ai"
tags: ["claude", "ai-agents", "privacy", "productivity"]
publishedAt: "2026-08-27"
seoTitle: "Claude Hafızası Artık Chat ve Cowork'te Ortak"
seoDescription: "Kısa cevap: Evet, 25 Ağustos 2026'dan itibaren Claude'un hafızası Chat ve Cowork arasında paylaşılıyor. Ne değişti, hangi veriler dışarıda kalıyor, burada."
---

Kısa cevap: Evet. Anthropic, 25 Ağustos 2026'da (Salı günü) Claude'un hafıza sistemini birleştirdi — Chat'te söylediğiniz bir şey artık Claude Cowork'ün bulutta çalıştırdığı görevlerde de kullanılabiliyor, tersi yönde de aynı şekilde işliyor. Değişiklik Free, Pro ve Max planlarında web, masaüstü ve mobilde varsayılan olarak açık; Claude Code bu birleşmenin dışında.

Bu, iki ayrı ürünün iki ayrı "sizi tanıma" katmanı biriktirdiği eski modeli sonlandırıyor. Aşağıda değişikliğin teknik olarak ne yaptığını, gizlilik kontrollerini ve geliştiriciler için pratik sonuçlarını bulacaksınız.

Bu adım, 2026 boyunca AI şirketlerinin ayrı ürünler yerine tek bir "ajan katmanı" etrafında birleşme eğilimine de uyuyor; kullanıcılar aylardır Chat'te kurduğu bağlamı Cowork'e taşıyamamaktan şikayet ediyordu, bu da özellikle çok adımlı ve bulutta çalışan görevlerde aynı talimatları tekrar tekrar yazmak anlamına geliyordu. [The Register'ın haberine göre](https://www.theregister.com/ai-and-ml/2026/08/25/claude-and-cowork-now-share-what-they-know-about-you/5292412) bu, Anthropic'in iki ürünü "aynı şeyleri bilen" tek bir sistem gibi davranmaya zorladığı ilk büyük adım.

## Claude'un birleşik hafızası tam olarak ne değişiyor?

Değişiklik, Claude Chat ile Claude Cowork'ün artık aynı hafıza havuzunu okuyup yazması. Önceden Cowork'e bir görev verdiğinizde, o oturum haftalar önce Chat'te paylaştığınız tercihlerden veya proje bağlamından habersizdi; şimdi Cowork bir görevi bulutta çalıştırırken Chat'teki geçmiş konuşmalardan gelen bağlamı da kullanabiliyor, böylece aynı bilgiyi iki kez tekrar etmeniz gerekmiyor.

Bellek güncellemesi ayrıca artık gerçek zamanlı: Claude, konuşma bitene kadar beklemek yerine siz hâlâ yazarken yeni bir konuyu hafızaya ekleyebiliyor. [Anthropic'in duyurusuna göre](https://claude.com/blog/claudes-memory-works-everywhere-and-you-decide-whats-in-it) bu, Cowork'ün bulutta çok adımlı bir görevi yürütürken konuşmanın ortasında öğrenilen bir tercihi hemen devreye sokabileceği anlamına geliyor.

## Hangi bilgiler hafızaya giriyor, hangileri varsayılan olarak dışarıda kalıyor?

Sağlık, etnik köken, din, siyasi görüş ve cinsiyet kimliği gibi hassas kategoriler varsayılan olarak hafızaya hiç girmiyor; bu davranışı açıkça açmadığınız sürece Claude bu konularda not tutmuyor. Geri kalan her şey — proje tercihleriniz, kod stiliniz, tekrar eden iş akışlarınız — Ayarlar > Hafıza altında "Konular" (Topics) listesinde tek tek görünüyor.

Bu liste salt okunur bir günlük değil: her konuyu tek tek düzenleyebilir, silebilir ya da hafızayı tamamen duraklatabilirsiniz. Pratik sonuç şu — bir müşteri projesi bittiğinde o projeye özgü konuları manuel olarak temizleyebilirsiniz, tıpkı bir tarayıcı geçmişini temizler gibi.

Örneğin bir serbest çalışan danışman üç farklı müşteri projesini aynı Claude hesabından yönetiyorsa, her proje için ayrı konular birikiyor; proje bittiğinde o kümeyi tek tek silmek, yeni bir müşteri projesine başlarken eski bağlamın karışmasını önlüyor.

| Kontrol | Nerede | Ne yapar |
|---|---|---|
| Konuları görüntüleme | Ayarlar > Hafıza > Konular | Claude'un neyi hatırladığını tek tek listeler |
| Tek konu silme | Konular listesi | Belirli bir hatırlanan öğeyi kalıcı olarak kaldırır |
| Hafızayı duraklatma | Ayarlar > Hafıza | Yeni konu eklemeyi geçici olarak durdurur, geçmişi silmez |
| Hassas kategorileri açma | Ayarlar > Hafıza | Sağlık/siyaset/kimlik gibi konularda not tutmaya izin verir (opt-in) |
| Tam sıfırlama | Ayarlar > Hafıza | Tüm hafıza geçmişini tek seferde temizler |

## Bu, Claude Cowork'ün önceki genişlemesinden nasıl farklı?

[Claude Cowork'ün web ve mobile açılması](/tr/posts/claude-cowork-web-mobil-genisliyor) Cowork'ün hangi cihazlardan erişilebildiğiyle ilgiliydi; bu güncelleme ise Cowork'ün *ne bildiğiyle* ilgili — erişim kanalı değil, hafıza mimarisi değişti. İki değişiklik birbirini tamamlıyor: artık Cowork'e telefonunuzdan da erişebiliyorsunuz ve nereden erişirseniz erişin aynı hafızayı görüyorsunuz.

Bu ayrım geliştiriciler için önemli, çünkü [AI ajan belleği tasarımı](/tr/posts/ai-ajan-bellegi-sistemleri) genellikle kısa vadeli oturum durumu ile uzun vadeli kalıcı tercih arasındaki sınırı nasıl çizdiğinize bağlı; Anthropic burada o sınırı tek bir üründen iki ürüne genişletti, tek bir oturumdan hesap düzeyine çıkardı.

## Bu, ChatGPT ve Gemini'nin hafıza yaklaşımından nasıl farklı?

OpenAI'nin ChatGPT'si ve Google'ın Gemini'si de sohbetler arasında kalıcı hafıza tutuyor, ama ikisi de tek bir ürün yüzeyi içinde çalışıyor — ChatGPT'nin hafızası farklı ChatGPT oturumları arasında paylaşılıyor, Gemini'nin kişiselleştirme özellikleri de Google hesabınızdaki diğer Google ürünleriyle sınırlı kalıyor. Anthropic'in buradaki farkı, hafızayı iki ayrı *ürün* arasında — bir sohbet arayüzüyle bulutta çalışan bir ajan platformu arasında — paylaştırması; rakiplerin henüz aynı ölçekte attığı bir mimari adım değil bu.

Fark küçük görünebilir ama pratik sonucu büyük: ChatGPT'de paylaştığınız bir tercih yalnızca gelecekteki ChatGPT sohbetlerinde işe yarıyor, ayrı bir ajan sistemine otomatik taşınmıyor. Claude'da ise aynı tercih, Cowork'ün bulutta bağımsız olarak çalıştırdığı bir görevi de doğrudan etkileyebiliyor — bu da Anthropic'i "sohbet hafızası" ile "ajan hafızası"nı aynı sistemde birleştiren ilk büyük sağlayıcı yapıyor.

## Geliştiriciler ve ekipler için pratik etkisi ne?

Bir mühendisin Chat'te "bu depoda testleri her zaman `pnpm test` ile çalıştır" gibi bir tercih paylaştığını düşünün — artık bu bilgi, aynı görev Cowork'e bulutta bir arka plan ajanı olarak verildiğinde de kullanılabiliyor, tekrar yazmaya gerek kalmıyor. Bu, [subagent ve arka plan ajanı iş akışlarıyla](/tr/posts/claude-code-subagent-arka-plan-ajanlari) çalışan ekipler için doğrudan zaman kazancı, çünkü bağlamı yeniden kurmak için harcanan prompt'lar azalıyor.

Benzer şekilde, bir ürün ekibi Cowork'e haftalık bir rapor görevi verdiğinde ve rapor formatını daha önce Chat'te tarif ettiyse, format tercihi otomatik olarak uygulanıyor — rapor şablonunu her seferinde yeniden açıklamak gerekmiyor. Bu tür tekrar eden, formatlı görevlerde kazanç en belirgin hâle geliyor, çünkü tercih bir kez kaydedildikten sonra hem Chat hem Cowork tarafında geçerli kalıyor.

Öte yandan paylaşılan bir hesapta birden fazla kişi Claude kullanıyorsa, hafızanın artık iki yüzeyde de görünür olması ekip içi netlik gerektiriyor — kimin hangi tercihi eklediğini takip etmek, tek bir kullanıcı senaryosuna göre daha fazla dikkat istiyor. Anthropic bu senaryo için ayrı bir çoklu-kullanıcı hafıza ayrımı duyurmadı; kontrol hâlâ Konular listesi üzerinden manuel.

Anthropic ayrıca duyurusunda Team ve Enterprise planlarındaki paylaşılan koltuklar için ayrı bir hafıza izolasyon katmanı tanımlamadı — yani bir şirket hesabında beş mühendis aynı Claude koltuğunu paylaşıyorsa, hepsinin eklediği konular şu an aynı Konular listesinde birikiyor. Böyle bir kurulumda çalışan ekiplerin, en azından ilk haftalarda Konular listesini düzenli olarak gözden geçirip proje bazlı temizlik yapması mantıklı, çünkü otomatik bir ayrım mekanizması henüz yok.

## Sıkça Sorulan Sorular

### Claude'un hafızası Claude Code'da da çalışıyor mu?

Hayır. Anthropic'in 25 Ağustos 2026 duyurusuna göre bu birleşik hafıza güncellemesi yalnızca Claude Chat ve Claude Cowork'ü kapsıyor; Claude Code ayrı kalıyor ve bu değişiklikten etkilenmiyor.

### Hangi Claude planlarında hafıza birleşmesi varsayılan olarak açık?

Free, Pro ve Max planlarının tümünde, web, masaüstü ve mobil uygulamalar dahil olmak üzere varsayılan olarak açık. Kapatmak isteyen kullanıcılar Ayarlar > Hafıza bölümünden hafızayı duraklatabilir veya belirli konuları silebilir.

### Claude sağlık ya da siyasi görüşlerimi hafızasına kaydediyor mu?

Hayır, varsayılan olarak değil. Sağlık, etnik köken, din, siyasi görüş ve cinsiyet kimliği gibi kategoriler, kullanıcı bunu Ayarlar > Hafıza üzerinden açıkça etkinleştirmediği sürece hafıza sistemine hiç girmiyor.

### Claude'un hafızasında ne olduğunu nasıl görebilir ve silebilirim?

Ayarlar > Hafıza > Konular yoluna gidin; Claude'un hakkınızda kaydettiği her öğe ayrı bir satır olarak listelenir. Buradan tek tek konuları silebilir, tüm hafızayı duraklatabilir ya da geçmişi tamamen sıfırlayabilirsiniz. Bu kontrol paneli, hem Chat hem Cowork tarafında biriken konuları aynı ekranda gösteriyor; yani iki ürünü ayrı ayrı kontrol etmenize gerek kalmıyor.
