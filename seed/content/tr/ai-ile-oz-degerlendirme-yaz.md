---
title: "AI ile Performans Öz Değerlendirmeni Nasıl Yazarsın?"
slug: "ai-ile-oz-degerlendirme-yaz"
translationKey: "ai-self-review-brag-doc-2026"
locale: "tr"
excerpt: "Kısa cevap: Yıl boyu bir brag doc tut, işleri sonuç + rakamla yaz, sonra AI'a bunu şirketinin yetkinlik matrisine eşleştirtip taslak çıkart."
category: "career-productivity"
tags: ["career", "productivity", "ai-tools", "best-practices"]
publishedAt: "2026-09-14"
seoTitle: "AI ile Öz Değerlendirme Nasıl Yazılır? Brag Doc Rehberi"
seoDescription: "Brag doc tutma alışkanlığı, AI ile etki çıkarma promptları, yetkinlik matrisine eşleme ve boşlukları sahiplenen bir öz değerlendirme yazma rehberi."
---

Kısa cevap: Yıl boyunca haftalık birkaç satırlık bir brag doc tutun, her satırı "ne yaptım + nasıl yaptım + ölçülebilir sonuç" formülüyle yazın, sonra bu ham listeyi AI'a verip şirketinizin yetkinlik matrisine eşletin ve taslağı siz düzenleyin. AI, dağınık notları yapılandırılmış bir öz değerlendirmeye çevirmekte iyi; ama boşlukları sahiplenmek ve tonu ayarlamak hâlâ size düşüyor.

Julia Evans'ın popülerleştirdiği "brag document" fikri basit: performans döneminin sonunda hafızanıza güvenmek yerine, işleri oldukları anda kaydedersiniz. 2026'da bu alışkanlığın değeri arttı, çünkü artık bu notları bir AI aracına verip saatler süren taslak yazma işini dakikalara indirebiliyorsunuz.

## Brag doc nedir, neden tutulur?

Brag doc, yıl boyunca yaptığınız işleri gerçekleştikleri anda kaydettiğiniz sürekli güncellenen bir liste. Amacı, öz değerlendirme dönemi geldiğinde "bu çeyrekte ne yaptım" diye hafızanızı zorlamak yerine hazır bir kayıttan çalışmak. Notion, Google Docs veya düz bir markdown dosyası yeterli; önemli olan format değil, düzenli tutulması.

En işe yarayan brag doc satırları üç parçadan oluşuyor: ne yaptığınız, nasıl yaptığınız ve ölçülebilir sonucu. "Ödeme akışında çalıştım" yerine "Ödeme akışını yeniden tasarladım, sepet terk etme oranını %28 düşürdüm" yazmak, hem AI'a hem gelecekteki size çok daha fazla malzeme veriyor.

## AI'a hangi promptlarla etki çıkartılır?

Etkili öz değerlendirme promptları rolünüzü, dönem özetini, rakamlarla somut başarılarınızı ve hedef uzunluk/tonu içermeli. Ham brag doc'unuzu yapıştırıp şu üç adımı isteyin: benzer maddeleri gruplama, birinci tekil şahısla yazma, edilgen çatı ve kurumsal jargon kullanmama.

| Prompt adımı | Ne istiyorsunuz | Neden işe yarıyor |
|---|---|---|
| Gruplama | Maddeleri tema/yetkinliğe göre kümeleyin | Rastgele liste yerine anlatı yapısı çıkar |
| Rakam çıkarma | Her maddede eksik metrik varsa sorun sorsun | "Hızlandırdım" yerine "%40 hızlandırdım" |
| Ton ayarı | Belirli kelime sayısı ve resmi/samimi ton | Şirket kültürüne uyan taslak |
| Boşluk taraması | Hangi yetkinliklerde madde az, söylesin | Kör noktaları erken görürsünüz |

Şirket kültürünüze göre AI'ın çıktısını mutlaka düzenleyin; bir modelin "önerdiği" cümleler bazen gerçek dışı derecede iddialı çıkabiliyor, bu yüzden her rakamı brag doc'unuzdaki kaynakla çapraz kontrol edin.

## Yetkinlik matrisine (ladder) nasıl eşlenir?

Şirketinizin terfi/yetkinlik kriterlerini (ladder) AI'a verip brag doc'unuzdaki maddeleri hangi kriterin altına düştüğünü sorun; bu, öz değerlendirmenizi değerlendiricinin diliyle konuşturur. Örneğin "teknik liderlik" bir kriterse, AI o başlığın altına hangi maddelerin uyduğunu önerecek, siz de eksik kalan kriterleri görüp o alanda yeni bir örnek arayabilirsiniz.

Bu eşleme aynı zamanda [yöneticinizle ilişkinizi](/tr/posts/yazilimcilar-icin-yoneticiyle-iliski) güçlendiriyor: yöneticinizin zaten kullandığı kriter dilinde konuşan bir öz değerlendirme, "bunu neden yazdın" tartışmasını büyük ölçüde ortadan kaldırıyor.

## Boşlukları sahiplenmek neden önemli?

Zayıf bir öz değerlendirme her şeyi başarı gibi göstermeye çalışır; güçlü bir öz değerlendirme nerede geride kaldığınızı da söyler ve bir sonraki adımı belirtir. AI'a "bu dönemde hangi hedefimi tutturamadım, bunu nasıl dürüstçe ama savunmacı olmadan yazarım" diye sormak, genellikle "planlanandan geç teslim ettim ama X dersini çıkardım, Y'yi değiştirdim" formatında bir cevap üretiyor; bu, "her şey harikaydı" anlatısından çok daha inandırıcı.

```text
Prompt: Brag doc'umdaki şu maddeyi al: "API migrasyonu 3 hafta
gecikti." Bunu öz değerlendirmede savunmacı olmadan, nedeni ve
aldığım dersi içeren 2 cümlede yaz.
```

Açıkçası kişisel görüşüm şu: AI'ın en büyük katkısı yazma hızında değil, sizi rakamları hatırlamaya zorlamasında. Bir modelin "bu maddede sonuç ne oldu?" diye sorması, kendi kendinize sormaktan daha disiplinli bir alışkanlık yaratıyor.

## İş bağlamını AI'a yapıştırmak güvenli mi?

Kurumsal/API katmanlı araçlarda (Claude for Work, ChatGPT Business, Gemini for Workspace) girdileriniz varsayılan olarak model eğitiminde kullanılmıyor; ücretsiz/bireysel katmanlarda ise bu opt-out gerektirebiliyor. Şirket içi proje adı, müşteri adı veya finansal rakam gibi hassas detayları paylaşmadan önce BT/güvenlik ekibinizin hangi aracı onayladığını kontrol edin; brag doc'unuzu genelleştirilmiş metriklerle tutmak (müşteri adı yerine "büyük bir kurumsal müşteri") bu riski baştan azaltıyor.

## Akran geri bildirimi isterken ne sormalı?

İyi bir akran geri bildirim talebi, genel "benim hakkımda ne düşünüyorsun" yerine belirli bir proje veya yetkinliği hedef alır. AI'a brag doc'unuzdaki en güçlü 2-3 maddeyi verip "bu maddelere tanıklık eden kişilere göndereceğim, spesifik bir geri bildirim isteği taslağı yaz" demek, akranınızın da somut bir şeye cevap vermesini kolaylaştırıyor.

| Kötü istek | İyi istek |
|---|---|
| "Benimle ilgili geri bildirim verir misin?" | "Q3'teki ödeme migrasyonunda kod incelemelerimin netliği hakkında ne düşünüyorsun?" |
| Süre belirtilmemiş | "Bu Cuma'ya kadar 2-3 cümle yeterli" |
| Bağlam yok | Brag doc'tan ilgili maddenin linki eklenmiş |

## Hangi araçlar brag doc tutmayı kolaylaştırıyor?

Notion şablonları, düz bir markdown dosyası veya BragBook gibi özel araçlar hepsi işe yarıyor; asıl fark, aracın sizi düzenli güncellemeye ne kadar zorladığında. BragBook gibi araçlar GitHub, Jira, Linear ve Asana'dan tamamlanan işleri otomatik çekip haftalık hatırlatma gönderiyor, bu da "güncellemeyi unuttum" sorununu büyük ölçüde ortadan kaldırıyor. Karmaşık bir araca ihtiyacınız yoksa, takviminize her Cuma 10 dakikalık bir "brag doc güncelle" hatırlatıcısı koymak da aynı disiplini sağlıyor.

| Araç | Güçlü yönü | Kimin için |
|---|---|---|
| Düz markdown/Notion | Sıfır kurulum, tam kontrol | Tek başına çalışan, az araçlı ekipler |
| BragBook gibi özel araçlar | Otomatik entegrasyon, hatırlatma | Çok araçlı, yoğun ekipler |
| Takvim hatırlatıcısı + doküman | Basit, disiplin gerektirir | Herkes |

## AI'ın önerdiği rakamlara neden şüpheyle yaklaşılmalı?

Bir dil modeli, brag doc'unuzda net bir rakam yoksa bazen makul görünen ama uydurma bir sayı önerebiliyor; "yaklaşık %30 iyileşme" gibi bir ifade, siz onaylamadan taslağa sızabiliyor. Her rakamı göndermeden önce şu soruyu sorun: bu sayı brag doc'umdaki hangi ham veriden geliyor? Kaynağını gösteremediğiniz bir rakamı öz değerlendirmenizden çıkarın veya "yaklaşık" yerine gerçek ölçümü bulup yerine koyun; bir performans görüşmesinde doğrulanamayan bir istatistik, tüm belgenin güvenilirliğini zedeliyor.

## Öz değerlendirmeyi ne zaman yazmaya başlamalı?

Değerlendirme döneminin bitmesini bekleyip son gün taslak yazmaya başlamak, hem stresi artırıyor hem de brag doc'unuzu hızlıca tarayıp önemli maddeleri gözden kaçırmanıza yol açıyor. Dönemin son haftasından en az 10 gün önce AI ile ilk taslağı çıkarıp geri kalan süreyi düzenlemeye, rakamları doğrulamaya ve akran geri bildirimi toplamaya ayırmak, çok daha sakin bir süreç yaratıyor.

## Sıkça Sorulan Sorular

### Brag doc ile öz değerlendirme aynı şey mi?

Hayır. Brag doc, yıl boyu tuttuğunuz ham, kronolojik bir kayıt; öz değerlendirme ise bu kaydın değerlendirme dönemi için düzenlenmiş, yetkinlik kriterlerine eşlenmiş ve belirli bir uzunluğa sıkıştırılmış hâli. Brag doc olmadan öz değerlendirme yazmak mümkün ama hafızaya güvenmek gerektiriyor.

### AI'ın yazdığı öz değerlendirmeyi olduğu gibi gönderebilir miyim?

Hayır, önerilmez. AI taslağı hızlandırır ama rakamları brag doc'unuzdaki gerçek kaynakla karşılaştırmadan, kendi sesinizle uyuşmayan cümleleri düzeltmeden ve şirketinize özgü jargonu kontrol etmeden göndermek risklidir; bir değerlendirici, abartılı veya generic hisseden bir metni hemen fark eder.

### Brag doc'u ne sıklıkla güncellemeliyim?

Haftalık, en kötü ihtimalle iki haftada bir. Aylık güncelleme yapanlar genellikle küçük ama toplamda önemli katkıları unutuyor; kısa bir haftalık ritim, "ne yaptım + sonuç ne oldu" sorusunu tazeyken cevaplamanızı sağlıyor.

### Şirketimin yetkinlik matrisi yoksa ne yapmalıyım?

AI'a rolünüzün tipik sorumluluklarını (teknik katkı, iş birliği, sahiplenme, mentorluk gibi genel kategoriler) önerttirip brag doc'unuzu bu kategorilere kendiniz eşleyebilirsiniz; resmi bir matris olmasa da yöneticinizle bu kategoriler üzerinden konuşmak, öz değerlendirmenize yapı kazandırır.
