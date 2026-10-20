---
title: "Claude Code'da Fork Alt Ajanları Artık Varsayılan"
slug: "claude-code-fork-alt-ajanlari-artik-varsayilan"
translationKey: "claude-code-fork-subagents-default-everywhere-2026"
locale: "tr"
excerpt: "Claude Code 2.1.302 (16 Ekim 2026) ile ebeveyn bağlamını devralan fork alt ajanları; claude -p, Agent SDK, masaüstü ve VS Code'da varsayılan oldu."
category: "ai"
tags: ["claude", "ai-agents", "ai-coding", "developer-experience"]
publishedAt: "2026-10-20"
seoTitle: "Claude Code Fork Alt Ajanları Artık Varsayılan"
seoDescription: "Claude Code 2.1.302, fork alt ajanlarını claude -p, Agent SDK, masaüstü ve VS Code'da varsayılan yaptı. Değişen ne, nasıl kapatılır, burada."
---

Kısa cevap: 16 Ekim 2026'da yayınlanan Claude Code 2.1.302 ile birlikte fork alt ajanları — ebeveyn konuşmanın tüm bağlamını devralan alt ajanlar — artık dört yüzeyde birden varsayılan: `claude -p`, Agent SDK, masaüstü uygulaması ve VS Code eklentisi. Eski davranışı geri istiyorsanız `CLAUDE_CODE_FORK_SUBAGENT=0` değişkenini ayarlamanız yeterli.

## Fork Alt Ajan Tam Olarak Nedir?

Fork alt ajan, boş bir bağlam penceresiyle değil, ebeveyn konuşmanın tam kopyasıyla başlayan bir alt ajandır. `subagent_type` alanına `"fork"` dışında bir değer verdiğinizde ortaya çıkan taze (fresh) bir alt ajan ise daha önce konuşulan hiçbir şeyi bilmez; her şeyi sıfırdan anlatmanız gerekir. Fork ise ebeveynin bildiği her şeyi zaten bildiği için ona tek satırlık bir talimat verebilirsiniz ("az önce bulduğumuz auth hatasını özetle") ve referansı anında kavrar.

Mekanizmanın kendisi yeni değil. Üçüncü taraf takip kaynakları, bu davranışın etkileşimli oturumlarda 13 Ağustos 2026'da yayınlanan Claude Code v2.1.232 ile opsiyonel bir bayraktan varsayılana geçtiğini aktarıyor. 2.1.302'de yeni olan şu: varsayılan artık kalan etkileşimli-olmayan yüzeylere de — `claude -p` ile çalıştırılan betikler, Agent SDK, masaüstü uygulaması ve VS Code — uzanıyor ve terminal oturumuyla diğer her yer arasındaki farkı kapatıyor. Alt ajanları hiç kullanmadıysanız önce [Claude Code Subagent ve Arka Plan Ajanları: İş Akışı Rehberi](/tr/posts/claude-code-subagent-arka-plan-ajanlari) yazımıza bakabilirsiniz.

## 2.1.302'de Ne Değişti?

Resmi değişiklik günlüğündeki 2.1.302 maddesi açık: "Fork alt ajanları artık `claude -p`, Agent SDK, masaüstü ve VS Code'da varsayılan olarak açık." Bu sürümden önce, betik tabanlı ve SDK üzerinden tetiklenen iş akışları varsayılan olarak taze alt ajan üretiyordu; yani Agent aracını fork talep etmeden çağıran otomasyon hatları, bağlamsız, izole çocuk ajanlar alıyordu. 2.1.302'den sonra aynı çağrılar, çağıran taraf açıkça vazgeçmediği sürece ebeveynin bağlamını otomatik olarak devralıyor.

Bu, Claude Code'u etkileşimsiz çalıştıran herkes için önemli — CI içinde, özel bir SDK entegrasyonunda ya da arka planda çalışan bir servis olarak. "Başarısız testi düzelt" diye bir ajan başlatan bir betik, artık o ajana yalnızca çıplak talimat metnini değil, isteğe giden tüm konuşmayı da aktarıyor.

Ekip olarak birden fazla ortamda (terminal, CI betiği, VS Code) aynı ajan mimarisini çalıştırıyorsanız bu değişiklik davranış tutarlılığını artırıyor: artık hangi yüzeyde çalıştığınıza bağlı olarak "bağlamı devralır mı, devralmaz mı" sorusunu ayrı ayrı sormanıza gerek yok — varsayılan her yerde aynı.

## Fork Ne Zaman Yardımcı Olur, Ne Zaman Bağlamı Şişirir?

Fork, çocuğun ebeveynin durumsal farkındalığına ihtiyacı varken kendi araç gürültüsünün — dosya okumaları, arama sonuçları, ara komut çıktıları — ana akışı kirletmesini istemediğinizde değerini kanıtlıyor. Bir commit mesajı taslaklayan, dar kapsamlı bir araştırma sorusunu yanıtlayan ya da yan bir incelemeyi üstlenen bir fork, kendi transkriptini yolunuzdan uzak tutarken size kısa bir özet döndürebilir.

Çocuğun bu geçmişe hiç ihtiyacı olmadığında ise maliyete dönüşüyor. Bir fork, devraldığı bağlamı kendi penceresine yüklemek için zaten bedel ödüyor; üstüne özyineleme (recursion) kasıtlı olarak sınırlandırılmış durumda — fork'lanmış bir çocuk, belirli bir sığ derinlikten sonra kendi fork'unu üretemiyor. Sınırsız iç içe geçme varsayan iş akışları bu duvara çarpıyor; bu, [Claude Code'da İç İçe Alt Ajanlar: Yasaktan Derinlik 3'e](/tr/posts/claude-code-ic-ice-alt-ajanlar-derinlik-3) yazımızda ele aldığımız derinlik sınırlama içgüdüsüyle aynı mantık. Konuşmanın şu ana kadarki akışından gerçekten bağımsız bir görev, taze bir ajan olarak daha ucuz ve daha güvenli.

## Gerçek Bir Örnek: Derinlik Sınırına Çarpmak

20 Ekim 2026'da Claude Code çalıştıran bir oturumdan somut bir örnek: bir fork alt ajan başarıyla başlatıldıktan sonra, aynı tur içinde dört ajan daha paralel olarak başlatılmaya çalışıldı — üç fork ve bir taze araştırma ajanı. Dördü de aynı hatayla anında başarısız oldu: `Subagent nesting limit reached (depth 1 of 1)`. İlk fork arka planda hâlâ çalışıyordu ve mevcut tek alt ajan slotunu çoktan kapmıştı; sınır gerçekte soy ağacı anlamında bir "derinlik" değil, bir oturumdan aynı anda kaç alt ajan başlatma işleminin devam edebileceğine dair bir eşzamanlılık tavanıydı.

Pratik ders şu: beş paralel fork'u, beş bağımsız API çağrısı gibi aynı anda dağıtabileceğinizi varsaymayın. Birini başlatın, bitmesini bekleyin veya ortamın eşzamanlılık sınırını doğrulayın, sonra sıradakini kuyruğa alın — ya da görev gerçekten izole bir alt ajandan fayda görmüyorsa işi doğrudan kendiniz yapın.

## Nasıl Kapatılır?

Bir iş akışı alt ajanların temiz bir sayfayla başlamasına bağımlıysa — örneğin bir ajanın sıfır önceki bağlamla nasıl davrandığını kasıtlı olarak ölçmek isteyen bir test düzeneği — fork'lamayı tek bir ortam değişkeniyle kapatabilirsiniz:

```bash
export CLAUDE_CODE_FORK_SUBAGENT=0
```

Değeri `0` yapmak, 2.1.232 öncesi davranışı geri getiriyor: çağıran taraf açıkça `subagent_type: "fork"` göndermediği sürece her alt ajan çağrısı taze başlıyor. Bu değişken, beklenmedik bağlam sızıntısını hata ayıklarken de başvurulacak değişken — bir alt ajanın daha önceki ilgisiz bir konuşmadan bir şeye atıfta bulunması, fork'un istediğinizden fazla geçmiş aldığının işareti.

Devralınan bağlamın token maliyeti, [Prompt Önbellekleme LLM Faturanı Nasıl Düşürür?](/tr/posts/prompt-onbellekleme-llm-maliyet) yazımızda ele aldığımız maliyet dengesiyle aynı türden — tekrar tekrar fork'lanan uzun bir ebeveyn konuşma, yüksek hacimli herhangi bir LLM iş yükü gibi, kararlı önek odaklı önbellek düşüncesinden fayda görüyor. Konunun geneli için [Yapay Zeka kategorimize](/tr/category/yapay-zeka) de göz atabilirsiniz.

## Fork mu Taze Alt Ajan mı?

| | Fork alt ajan | Taze alt ajan |
|---|---|---|
| Başlangıç bağlamı | Ebeveynin tüm konuşma geçmişi | Boş — sadece yazdığınız promptla bilgilendirilir |
| Varsayılan olma tarihi | v2.1.232 (etkileşimli), v2.1.302 (`-p`, SDK, masaüstü, VS Code) | — (açık `subagent_type` ile opsiyonel) |
| En uygun kullanım | Durumsal farkındalık gerektiren yan görevler; gürültülü araç çıktısını ana akıştan ayırmak | Bağımsız, net kapsamlı görevler; paylaşılan geçmiş gerektirmeyen paralel araştırma |
| Özyineleme | Sığ bir derinlikte sınırlı — sonsuza kadar yeni fork üretemez | Aynı derinlik sınırına tabi olarak kendi fork'unu üretebilir |
| Kapatma | `CLAUDE_CODE_FORK_SUBAGENT=0` | Geçerli değil |

## Sıkça Sorulan Sorular

### Alt ajanı fork'lamak daha fazla token mı tüketir?

Genellikle evet. Bir fork, herhangi bir şey yapmadan önce ebeveynin tüm konuşma geçmişini kendi bağlam penceresine yükler; bu yüzden sadece promptunuzu alan taze bir alt ajana kıyasla daha fazla token tüketilmiş halde başlar. Kısa yan görevler için bu ek yük genelde kazanılan brifing süresine değer; uzun konuşmalarda, elle yazılmış dar bir brifle taze bir ajanın daha ucuz olup olmayacağını kontrol edin.

### 2.1.302 güncellemesinden sonra taze alt ajanı yine seçebilir miyim?

Evet. Varsayılan fork'lama yalnızca `subagent_type` alanını boş bıraktığınızda veya belirli bir taze ajan türü talep etmediğinizde geçerli. Fork olmayan bir `subagent_type`'ı açıkça belirtmek, o ajanı öncekiyle aynı şekilde hiçbir devralınan bağlam olmadan başlatıyor.

### Paralel alt ajan başlatmalarım neden "nesting limit" hatasıyla başarısız oldu?

"Subagent nesting limit reached" hatası genellikle soy ağacı derinliği sorunu değil, bir eşzamanlılık tavanı anlamına gelir: bir oturumdan aynı anda sadece sınırlı sayıda (bazen tek bir) alt ajan başlatması aktif olabilir. Aynı turda birkaç ajan başlattıktan sonra bu hatayı görüyorsanız, çalışan ajanın bitmesini bekleyin veya ortamınız izin veriyorsa sınırı `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` ile yükseltin.

### Bu, Claude Code'un `/fork` komutuyla aynı şey mi?

İlişkili ama aynı değil. `/fork`, bir oturumun geçmişini dallandırmak için kullanılan etkileşimli komut; burada ele aldığımız fork alt ajan varsayılanı ise Agent aracı üzerinden başlatılan bir ajanın hangi bağlamı aldığını belirliyor — bu başlatma bir terminal oturumu içinde, `claude -p` ile çalışan bir betikte, bir Agent SDK çağrısında, masaüstü uygulamasında ya da VS Code'da gerçekleşsin fark etmez.
