---
title: "Uzun AI Kodlama Oturumunda Bağlamı Koru"
slug: "uzun-ai-kodlama-oturumunda-baglami-koru"
translationKey: "manage-ai-coding-session-context"
locale: "tr"
excerpt: "Kısa cevap: Kalıcı talimatları proje kökündeki CLAUDE.md'ye yaz, iç içe kurallara güvenme; oturum uzadıkça /compact'i odaklı kullan, işi ayrı alt ajanlara böl."
category: "software-engineering"
tags: ["ai-coding", "claude", "developer-experience", "workflow"]
publishedAt: "2026-09-07"
seoTitle: "Uzun AI Kodlama Oturumunda Bağlam Nasıl Korunur?"
seoDescription: "AI kodlama ajanı neden uzun oturumda talimatları unutuyor? CLAUDE.md, /compact, /clear ve alt ajanlarla bağlamı koruma stratejilerini anlatıyoruz."
---

Kısa cevap: kalıcı olması gereken her talimatı proje kökündeki `CLAUDE.md` dosyasına yaz, iç içe (nested) kural dosyalarına güvenme; oturum otomatik sıkıştırma eşiğine yaklaştığında `/compact`'i hedefli bir talimatla çalıştır, işi mümkün olduğunca ayrı alt ajanlara böl ve ilerlemeyi düzenli commit'lerle sabitle.

## Uzun AI kodlama oturumları neden bağlamı kaybediyor?

Sorun modelin "unutması" değil, konuşma geçmişinin sabit bir pencereye sığması. Claude Code'da varsayılan pencere 200.000 token; Opus 4.6 ve sonrası ile Sonnet 4.6'da bu 1 milyon token'a çıkarılabiliyor. Kullanım oranı toplam pencerenin yaklaşık **%83,5**'ine ulaştığında otomatik sıkıştırma (`/compact`) devreye giriyor; 2026 başı itibarıyla ayrılan tampon alan yaklaşık **33.000 token**'a (%16,5) düştü, yani sıkıştırma daha erken ve daha sık tetikleniyor.

Sıkıştırma, konuşma geçmişini özetler ama diskten yüklenen her şeyi dokunmadan bırakır: sistem promptu, proje kökündeki CLAUDE.md, kapsamsız (unscoped) kurallar ve otomatik bellek özetten sonra yeniden enjekte edilir. Asıl kaybolan kısım şu üçü: yol-kapsamlı (path-scoped) kurallar, iç içe CLAUDE.md dosyaları ve oturum sırasında Claude'un okuduğu dosyaların içeriği — bunlar yeniden okunana kadar geri gelmez.

## Talimatların sıkıştırmadan sağ çıkması için nereye yazmalı?

Kalıcı olması gereken her şeyi proje kökündeki tek bir CLAUDE.md dosyasına yaz; alt klasörlere dağıtılmış kurallar ya da modül-özel talimat dosyaları sıkıştırmada kaybolan kategoriye giriyor. Bu tek dosya yaklaşımı can sıkıcı gelebilir ama pratikte tek doğrulanabilir garanti bu: proje kökü her seferinde yeniden enjekte ediliyor, geri kalan her şey "hâlâ bağlamda mı" sorusuna tabi.

CLAUDE.md içine bir "Compact Instructions" bölümü eklemek, sıkıştırma sırasında modelin özeti neyi öncelikli tutacağını yönlendirmenin ikinci yolu. Böylece hangi dosyaların, hangi kararların ve hangi açık TODO'ların özete mutlaka girmesi gerektiğini önceden belirtmiş olursun.

| Sıkıştırmadan sonra ne olur | Kalır mı? |
|---|---|
| Sistem promptu | Evet |
| Proje kökü CLAUDE.md | Evet |
| Kapsamsız kurallar ve otomatik bellek | Evet |
| Yol-kapsamlı kurallar | Hayır — yeniden okunmalı |
| İç içe CLAUDE.md dosyaları | Hayır — yeniden okunmalı |
| Oturumda okunan dosya içerikleri | Hayır — yeniden okunmalı |

## /compact ne zaman ve nasıl kullanılmalı?

Otomatik tetiklemeyi beklemek yerine, bir alt görevi bitirdiğin doğal kesim noktalarında `/compact`'i elle ve odaklı bir talimatla çağırmak daha öngörülebilir sonuç verir. Örneğin "son üç dosyadaki değişiklikleri ve açık TODO'ları özetle, geri kalan tartışmayı at" gibi bir talimat, modelin kendi başına neyin önemli olduğuna karar vermesinden daha güvenilir. Odaksız bir `/compact`, tam da üzerinde çalıştığın kenar durumunu özetten düşürebilir — bu da "Claude birden bire talimatı unuttu" hissinin en yaygın kaynağı.

`/clear` ise farklı bir araç: sıkıştırmaz, sıfırdan başlar. Bir görev tamamen bitip yeni, alakasız bir işe geçtiğinde `/clear` kullanmak, eski görevin kalıntı bağlamının yeni işe sızmasını (ve token bütçesini boşuna tüketmesini) engeller.

## İşi alt ajanlara bölmek bağlamı neden korur?

Bir alt ajan (subagent) kendi ayrı bağlam penceresiyle çalışır ve ana oturuma yalnızca sonucunu rapor eder; bu, keşif amaçlı büyük bir arama ya da uzun bir log analizi gibi "bir kerelik ama hacimli" işleri ana konuşmanın token bütçesinden tamamen çıkarır. [Claude Code'un subagent ve arka plan ajanları](/tr/posts/claude-code-subagent-arka-plan-ajanlari) yazımızda anlattığımız gibi, ana oturumu "orkestratör" olarak tutup ayrıntılı işi alt ajanlara devretmek, tek bir dev bağlam penceresini şişirmek yerine bağlamı işe göre bölümlemek anlamına geliyor.

Bu, [Claude Code'un auto mode'unun](/tr/posts/claude-code-auto-mode-nasil-calisir) varsayılan hale geldiği bir dönemde daha da önemli: ajan kendi başına daha uzun süre çalıştıkça, bağlamı elle yönetmek yerine mimariyle (alt ajanlar, odaklı sıkıştırma) yönetmek gerekiyor.

## Kontrol noktalarını commit etmek neden bir bağlam stratejisi?

Bir özelliği yarı yolda bırakıp bağlamı kaybetmek, o işi sıfırdan anlatmak zorunda kalmak demek. Çalışan her ara adımı ayrı bir commit haline getirmek, hem geri dönüş noktası sağlıyor hem de yeni bir oturuma "şu commit'ten devam ediyoruz, plan şuydu" diye tek cümlelik bir özetle başlayabilmeni sağlıyor — bu, tüm geçmiş tartışmayı yeniden anlatmaktan çok daha ucuz.

Pratik bir kontrol listesi: her alt görev bittiğinde commit at, commit mesajına "neden"i yaz (sıradaki oturumun okuyacağı asıl bilgi bu) ve büyük bir refactor'a başlamadan önce mevcut durumu ayrı bir commit'te sabitle ki geri alma tek komutla mümkün olsun.

## Bir Compact Instructions bölümü nasıl görünür?

CLAUDE.md'ye eklediğin bu bölüm, sıkıştırma anında modele "özete mutlaka şunları al" demenin somut yolu. Örneğin bir backend projesinde şöyle görünebilir:

```markdown
## Compact Instructions

Özetlerken şunları koru:
- Şu an üzerinde çalıştığımız dosya listesi ve her birinin durumu (bitti/devam ediyor)
- Açık TODO'lar ve neden bekletildikleri
- Kullanıcının reddettiği ya da geri aldığı öneriler (tekrar önerme)
- Son çalıştırılan test komutu ve sonucu
```

Bu dört madde, bir sıkıştırmadan sonra "nerede kalmıştık" sorusunu tek okumada cevaplıyor. Bu bölüm olmadan model, özetleme sırasında hangi ayrıntının kritik olduğuna kendi başına karar veriyor — ve genelde en son konuşulan konuyu değil, en çok tekrar eden konuyu öncelikli tutuyor, bu da tam da üzerinde yeni çalışmaya başladığın kenar durumun kaybolmasına yol açabiliyor.

Bu listeyi statik tutma: bir sıkıştırmadan sonra modelin gerçekten neyi kaybettiğini fark ettiğinde, o kalemi Compact Instructions'a ekle. Zamanla bu bölüm, ekibin o repoda tekrar tekrar karşılaştığı bağlam kaybı türlerinin bir kaydına dönüşüyor.

## Bağlam bütçesini nasıl izlersin?

`/cost` komutu, oturumun ne kadar token tükettiğini ve prompt cache isabet oranını gösteriyor; bu sayıyı düzenli kontrol etmek, bir sıkıştırmanın ne zaman geleceğini tahmin etmeni sağlıyor. Pratik bir eşik: kullanım %70'i geçtiğinde bir sonraki doğal durma noktasında elle `/compact` çalıştırmayı düşün — otomatik tetiklemeyi (%83,5) beklemek yerine, hâlâ hangi ayrıntının önemli olduğuna kendin karar verebileceğin bir noktada durmuş olursun.

Düşük prompt cache isabet oranı da ayrı bir uyarı sinyali: oran düşükse, oturum önceki turların büyük kısmını her seferinde yeniden işliyor demektir, bu da hem maliyeti hem gecikmeyi artırıyor. Bu genelde sık sık büyük dosyaları oturuma yeniden okutmanın bir belirtisi; dosyayı bir kez okuyup sonucu CLAUDE.md'ye ya da bir notlar dosyasına özetlemek, tekrar tekrar okutmaktan daha ucuz.

## Ne zaman sıfırdan başlamalısın?

Oturum birkaç kez sıkıştırıldıysa ve model artık erken verdiğin bir kısıtı (örneğin "bu dosyaya dokunma") ihlal etmeye başladıysa, bir sonraki sıkıştırmayı beklemek yerine `/clear` ile sıfırdan başlamak genelde daha hızlı. Kaybedilen bağlamı tek tek hatırlatmaya çalışmak, üzerine yenisini yığdıkça sorunu büyütüyor; oysa net bir görev tanımıyla temiz bir oturum, aynı işi daha az tur içinde bitirir.

## Sıkça Sorulan Sorular

### Claude Code neden uzun oturumda talimatları unutuyor gibi görünüyor?

Sebep "unutma" değil, konuşma geçmişinin sabit bir token penceresine sığması. Kullanım oranı belirli bir eşiğe (yaklaşık %83,5) ulaştığında otomatik sıkıştırma devreye giriyor ve iç içe kural dosyaları ile oturum sırasında okunan dosyalar özetten düşüyor; proje kökündeki CLAUDE.md ise her zaman korunuyor.

### CLAUDE.md dosyasını nereye koymalıyım?

Kalıcı, oturumlar arası geçerli olması gereken her talimatı proje kökündeki tek bir CLAUDE.md'ye yaz. Alt klasörlere dağıtılmış iç içe CLAUDE.md dosyaları da destekleniyor ama bunlar sıkıştırmada kaybolan kategoriye giriyor, yani kritik kısıtları oraya güvenmeden yazma.

### /compact ile /clear arasındaki fark ne?

`/compact` konuşma geçmişini özetler ve proje köküyle sistem promptunu koruyarak devam eder; `/clear` ise özetlemeden tamamen sıfırlar. Aynı görevin devamında `/compact`, tamamen farklı ve alakasız bir işe geçerken `/clear` daha uygun.

### Alt ajanlar (subagent) bağlam sorununu gerçekten çözüyor mu?

Tam çözmüyor ama sorunu bölümlüyor: her alt ajan kendi ayrı bağlam penceresinde çalışıp ana oturuma yalnızca özet sonucunu döndürüyor, böylece hacimli keşif işleri ana konuşmanın token bütçesini tüketmiyor. Ana oturumu orkestratör gibi tutup ayrıntılı işi alt ajanlara devretmek, tek bir dev pencereyi şişirmekten daha sürdürülebilir.
