---
title: "Ucuzlayan AI Marjını Nasıl Etkiler?"
slug: "ucuzlayan-ai-token-fiyatlari-marj"
translationKey: "falling-ai-token-prices-margins-2026"
locale: "tr"
excerpt: "Claude Fable 5.2, Kasım 2026'da liste fiyatını %20 düşürdü; ama ucuzlayan token'lar marjınızı kendiliğinden korumaz — tekrar denemeler tasarrufu yer."
category: "business"
tags: ["pricing", "llm", "saas", "finops"]
publishedAt: "2026-11-20"
seoTitle: "Ucuzlayan AI Token Fiyatları: Marjınızı Koruyun"
seoDescription: "Claude Fable 5.2'nin %20 fiyat düşüşü AI ürün marjını kendiliğinden düzeltmiyor. İstek başına maliyeti haritalamanın ve marjı korumanın gerçek yolu."
---

Ucuzlayan token'lar AI ürününüzü kendiliğinden daha kârlı yapmaz, çünkü istek başına maliyetiniz milyon başına fiyata değil, bir görevin gerçekte ne kadar token yaktığına bağlıdır. Claude Fable 5.2, 9 Kasım 2026'da milyon girdi token'ı için 8 dolar, milyon çıktı token'ı için 40 dolarla piyasaya çıktı — Fable 5.1'in 10/50 dolarından %20 düşüş — ama birçok AI ürünü kullanıcı başına hâlâ zarar ediyor; çünkü tekrar denemeler, uzun bağlam pencereleri ve zincirlenmiş araç çağrıları, liste fiyatlarının düşüşünden daha hızlı büyüyor.

## İstek Başına Maliyeti Fiyatlandırmanıza Nasıl Haritalarsınız?

Reklamdaki milyon başına fiyattan değil, temsili bir isteğin gerçek token sayısından başlayın. 2.000 token'lık bir destek talebini okuyup 150 token'lık bir özet yazan bir özetleyici, Fable 5.2'de liste fiyatıyla kabaca 0,022 dolara mal oluyor (2.000 × 8$/1M + 150 × 40$/1M); aynı görev milyon başına yaklaşık 0,75$/3,75$ fiyatlı bir Flash sınıfı modelde yaklaşık 0,002 dolara mal oluyor — neredeyse 11 kat daha ucuz. Gerçek kaldıraç, manşetteki "%20 daha ucuz" duyurusu değil, bu fark; çünkü çoğu ürün birden fazla model katmanını harmanlıyor ve ucuz katman genellikle hacmin büyük kısmını yapıyor.

| Model katmanı | Girdi $/1M token | Çıktı $/1M token | Örnek maliyet: 2K girdi / 150 çıktı |
|---|---|---|---|
| Claude Fable 5.2 (amiral gemisi, Kasım 2026) | 8,00$ | 40,00$ | ~0,022$ |
| Claude Fable 5.2, Batch API | 4,00$ | 20,00$ | ~0,011$ |
| Gemini 3.6-3.8 Flash (31 Aralık 2026'ya kadar giriş fiyatı) | 0,75$ | 3,75$ | ~0,0021$ |
| Gemini 4 Argon, amiral gemisi (30 Kasım 2026'ya kadar) | 2,00$ | 10,00$ | ~0,0055$ |
| Gemini 4 Argon, amiral gemisi (1 Aralık 2026'dan itibaren) | 4,00$ | 20,00$ | ~0,011$ |

## Ucuzlayan Token'lar Neden Marjı Garanti Etmiyor?

Çünkü üç şey, token başına fiyat manşetinden bağımsız olarak büyüyor. Tekrar denemeler maliyeti doğrudan çarpıyor — zincirlenmiş bir ajan iş akışında %5'lik bir tekrar oranı, token başına fiyat ne olursa olsun faturanıza kabaca %5 ekliyor. Bağlam şişmesi daha sinsi: bir konuşma veya belge büyüdükçe, prompt önbellekleme kullanmadığınız sürece her takip turu birikmiş bağlamı yeniden gönderiyor; bu yüzden bir kullanıcıya "aynı hissettiren" bir sohbet botu, uzun bir oturum boyunca token ayak izini sessizce ikiye katlayabiliyor. Araç çağrıları her iki sorunu da birleştiriyor — bir arama aracını çağıran, sonucu okuyan ve yanıt vermeden önce tekrar düşünen bir ajan, tek seferlik bir prompt'un 5-10 katı token yakabilir; temel modeldeki bir fiyat indirimi bu çarpanı hiç etkilemiyor.

## Görev Başına Model Katmanını Nasıl Seçersiniz?

Modeli, görevin etkileyici görünmesine değil gerçek zorluğuna göre eşleştirin. Sınıflandırma, çıkarım ve kısa özetleme nadiren amiral gemisi bir model gerektirir — bunları Flash sınıfı veya Haiku sınıfı bir modele yönlendirin ve pahalı katmanı gerçekten zor akıl yürütme, uzun bağlam sentezi veya yanlış cevabın maliyetli olduğu müşteriye dönük işler için ayırın. Anthropic'in, özetleme ve alt ajanlar gibi yüksek hacimli görevler için tasarladığı [Claude Haiku 5.5](/tr/posts/claude-haiku-5-5-nedir-fiyat-hiz), her isteği amiral gemisi bir modele yönlendirmenin buna gerek olmayan görevlerde para harcamak olduğu için var.

## Önbellekleme ve Yönlendirme Brüt Marjınızı Koruyabilir mi?

Evet; üstelik genellikle bir sonraki fiyat indirimini beklemekten daha büyük bir kaldıraç. Prompt önbellekleme, tekrarlanan bir sistem prompt'unu veya uzun bir belge bağlamını her sonraki çağrıda tam fiyatlı bir maliyetten neredeyse bedavaya dönüştürüyor — [Claude Fable 5.1'in önbellek fiyatı](/tr/posts/claude-fable-5-1-onbellek-fiyati-neden-dustu) önceki bir güncellemede %75 düştü ve Fable 5.2, önbellek okumalarını milyon token başına 0,20 dolarda tutuyor; bu, 8 dolarlık girdi fiyatının küçük bir kesri. Yönlendirme — kolay istekleri ucuz bir modele gönderip amiral gemisi modele yalnızca başarısızlık veya düşük güven durumunda yükseltme — önbellekleme ile birleşince etkisi katlanıyor, çünkü pahalı katman toplam hacmin daha küçük bir kısmını işliyor.

## Hangi Fiyatlandırma Modelleri Bir Sonraki Fiyat Dalgalanmasında Ayakta Kalır?

Şu anki istek başına maliyetinizi içine gömen kullanım bazlı fiyatlandırma, bir tedarikçi fiyatı herhangi bir yönde değiştirdiği anda bozulur — Kasım 2026, fiyatların sadece düşmediğinin açık bir hatırlatıcısı. Gemini 4 Argon'un kendi fiyatı, 1 Aralık 2026'da milyon token başına 2,00$/10,00$'dan 4,00$/20,00$'a sıçrıyor; giriş oranı üzerine bir marj modeli kuran herkes için bir gecede ikiye katlanıyor. Bu tür bir dalgalanmada ayakta kalan bir fiyatlandırma modeli, token başına değil sonuç başına (çözülen bilet başına, üretilen rapor başına) fiyatlandırır ya da bir tampon içerir — en kötü senaryo token maliyetine göre fiyatlandırır, şu anki en ucuz orana göre değil — böylece bir tedarikçinin fiyat değişikliği birim ekonominizi anında negatife çevirmez.

## Fiyat Dalgalanmasına Karşı Ne Kadar Tampon Yeterli?

Kesin bir sayı yok, ama pratik bir kural var: en ucuz katmanınızın fiyatının iki katına çıkması durumunda bile fiyatlandırmanızın kâr etmesi gerektiğini varsayarak planlayın. Gemini 4 Argon'un 1 Aralık 2026'da ikiye katlanan fiyatı, bunun teorik bir senaryo değil, bir vadeden sonra gerçekleşmesi önceden duyurulmuş bir değişiklik olduğunu gösteriyor. Tedarikçinizin fiyat geçmişini takip edin ve bir sonraki değişikliğin ne zaman geleceğini bilmeseniz de, geldiğinde fiyatlandırmanızı aynı gün yeniden hesaplayabilecek bir süreç kurun.

## Basit Bir Birim Ekonomisi Çalışma Tablosu

Gerçek ürününüz için dört rakamı hesaplayın: (1) kullanıcı eylemi başına tüketilen ortalama token, tekrar denemeler ve araç çağrıları dahil, mutlu-yol tahmini değil; (2) model katmanı karışımınızdaki harmanlanmış eylem başına maliyet, her katmanın gerçekte ne kadar sık tetiklendiğine göre ağırlıklandırılmış; (3) eylem veya koltuk başına fiyatınız; (4) (3)'ün (2)'ye oranı — kabaca 3-5 katın altındaki her şey, resme destek, altyapı ve kayıp müşteri eklendiğinde ince kalıyor. Bir tedarikçi fiyat değişikliği duyurduğunda bu çalışma tablosunu tekrar çalıştırın, çünkü manşetteki yüzde nadiren kendi faturanızda hareket edenle örtüşüyor.

Açıkçası kişisel görüşüm şu: düşen model fiyatlarını bedava bir marj hediyesi gibi görenler her iki yöndeki dalgalanmada da şaşırıyor; fiyatlandırmayı aktif olarak yönetilecek bir şey gibi gören ekipler — önbellekleme, yönlendirme, sonuç bazlı fiyatlandırma — tedarikçinin fiyatı hangi yöne giderse gitsin aynı marjda kalıyor.

## Sıkça Sorulan Sorular

### Claude Fable 5.2 gerçekten Fable 5.1'den %20 mi ucuzladı?

Evet. Fable 5.2, 9 Kasım 2026'da milyon girdi token'ı için 8 dolar, milyon çıktı token'ı için 40 dolarla piyasaya çıktı; Fable 5.1'in 10 ve 50 dolarından düşüş — hem girdi hem çıktı fiyatında %20'lik bir kesinti, önbellek okumaları milyon token başına 0,20 dolar.

### Token'lar ucuzladıysa AI ürünüm neden kullanıcı başına hâlâ zarar ediyor?

Genellikle tekrar denemeler, büyüyen bağlam pencereleri ve zincirlenmiş araç çağrıları, kullanıcı başına gerçek token tüketiminizi token başına fiyatın düştüğünden daha hızlı artırdığı için — fiyat indirimi her token'a uygulanıyor, gerçek bir isteğin ne kadar token yaktığına değil.

### AI model fiyatları her zaman düşüyor mu?

Hayır. Gemini 4 Argon'un amiral gemisi fiyatı, giriş döneminin ardından 1 Aralık 2026'da milyon token başına 2,00$/10,00$'dan 4,00$/20,00$'a ikiye katlanacak şekilde planlandı — ürününüzü maliyetlerin sadece düşeceğini varsaymak yerine bir tamponla fiyatlandırmanız için bir hatırlatıcı.

### Fiyatlandırmamı değiştirmeden marjımı korumanın en hızlı yolu ne?

Prompt önbellekleme ve model katmanı yönlendirmesi genellikle fiyatlandırmanızı yeniden müzakere etmekten daha hızlı uygulanır: önbellekleme, tekrarlanan bağlamın maliyetini bedavaya yakın bir orana düşürür; yönlendirme ise hacmin çoğunu daha ucuz bir model katmanına gönderirken amiral gemisi modeli gerçekten gerektiren isteklere ayırır.
