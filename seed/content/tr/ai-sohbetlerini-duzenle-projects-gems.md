---
title: "AI Sohbetlerini Düzenle: Projects ve Gems"
slug: "ai-sohbetlerini-duzenle-projects-gems"
translationKey: "organize-ai-chats-projects-gems"
locale: "tr"
excerpt: "Claude/ChatGPT Projects ile Gemini Gems arasındaki fark nedir, hangisi ne zaman kurulmalı? Dağınık AI sohbet geçmişini toparlayan pratik bir klasör şablonu."
category: "career-productivity"
tags: ["claude", "chatgpt", "gemini", "productivity"]
publishedAt: "2026-07-27"
seoTitle: "AI Sohbetlerini Düzenle: Projects vs Gems Rehberi"
seoDescription: "Claude/ChatGPT Projects ile Gemini Gems arasındaki fark nedir, hangisi ne zaman kurulmalı? Dağınık AI sohbet geçmişini toparlayan pratik bir klasör şablonu."
---

Bir haftadır kullandığınız üç farklı AI aracında toplam kaç sohbet açtığınızı say deseler çoğu kişi tahmin bile edemez. Sorun araç eksikliği değil: Claude ve ChatGPT'nin Projects'i, Gemini'nin Gems'i zaten var. Sorun, ikisinin farklı bir organizasyon mantığı üzerine kurulu olduğunu bilmeden ikisini de aynı şekilde kullanmaya çalışmak.

## İki Farklı Organizasyon Mantığı

Claude Projects ve ChatGPT Projects, bir **angajmanı** (engagement) çevreliyor: paylaşılan dosyalar ve talimatlarla donatılmış bir konteyner, içinde birden fazla sohbet barındırıyor. "Bu müşteri" ya da "bu kampanya" gibi sınırları olan işler için doğal bir kalıp — hepsi aynı bağlamı, aynı dosyaları paylaşıyor ve proje kapandığında arşivlenebiliyor.

Gemini Gems (ve ChatGPT'nin Custom GPT'leri) ise bir **kişiliği** (persona) çevreliyor: bir kez talimat ve isteğe bağlı bilgi dosyasıyla yapılandırılan, sonra o rol her gerektiğinde yeniden kullanılan bir asistan. Gemini'nin gerçek bir Projects karşılığı yok — Gems tamamen kişilik etrafında kurulu.

Bu ayrımı somutlaştırmak için: "Aralık ayı vergi beyannamesi" bir proje gibi davranıyor — belirli bir bitiş tarihi, belirli dosyalar var. "Sözleşme dilini sadeleştiren editör" ise bir kişilik gibi davranıyor — hiç bitmiyor, her sözleşmede yeniden çağrılıyor.

## Ne Zaman Proje, Ne Zaman Gem/Custom GPT Kurulmalı

| Durum | Doğru araç | Neden |
| --- | --- | --- |
| Belirli bir müşteri/kampanya, birden fazla dosya | Proje (Claude/ChatGPT) | Dosyalar ve bağlam paylaşılmalı, sohbet sayısı önemsiz |
| Tekrarlanan bir rol (editör, kod inceleyici, marka sesi) | Gem/Custom GPT | Talimat sabit kalıyor, girdi her seferinde değişiyor |
| Kısa ömürlü, tek seferlik araştırma | İkisi de gerekmez | Sıradan bir sohbet yeterli |
| Ekip genelinde paylaşılacak bir asistan | Custom GPT (GPT Store'a yayınlanabilir) | Claude Projects ve Gemini Gems'te genel paylaşım altyapısı yok |

Gemini'nin öne çıkan özelliği canlı Google Drive entegrasyonu: bir Custom GPT'ye yüklediğiniz dosya statik kalırken, bir Gem'e bağladığınız bir Google Doc güncellendiğinde Gem bu değişikliği anında görüyor. Sabit bir referans belgesi yerine sürekli güncellenen bir kaynak kullanıyorsanız bu fark önemli.

## Dosya ve Bilgi Sınırları

Her üç sistem de dosya yükleme destekliyor ama sınırlar ve davranışlar farklı. Claude Projects'teki dosyalar proje içindeki tüm sohbetlerde paylaşılıyor; ChatGPT Projects benzer şekilde çalışıyor. Custom GPT'ler paylaşılan dosya ve talimat desteğiyle geliyor, üstelik yayınlanabiliyor da — Plus ya da Team aboneleri kendi Custom GPT'lerini GPT Store'a yayınlayabiliyor. Gems'in farkı, statik dosya yerine canlı Drive bağlantısına izin vermesi.

Pratik sonuç: sürekli değişen bir kaynak belgeniz varsa (örneğin haftalık güncellenen bir fiyat listesi) Gem daha az sürtünmeli; sabit bir referans setiniz varsa (bir sözleşme şablonu, bir marka kılavuzu) üçü de eşit derecede iyi çalışıyor.

## Tek Model Kilidi Uyarısı

Burada dikkat edilmesi gereken önemli bir kısıt var: her üç sistem de tek bir model ailesine kilitleniyor. Bir Claude Projesi yalnızca Claude çalıştırıyor, bir Gem yalnızca Gemini, bir Custom GPT yalnızca ChatGPT'nin altındaki model. Farklı görevler için farklı modelleri tercih ediyorsanız (örneğin uzun bağlam gerektiren işler için [1 milyon token bağlam penceresine sahip bir modeli](/tr/posts/1-milyon-token-baglam-ne-degisiyor) seçmek gibi), bu, aynı projeyi birden fazla araçta yeniden kurmanız gerektiği anlamına geliyor — hiçbiri modeller arası taşınabilir değil.

Bu kilitlenme, [ChatGPT, Claude ve Gemini'de özel talimatlar rehberimizde](/tr/posts/chatgpt-claude-gemini-ozel-talimatlar) ele aldığımız üslup/talimat tutarlılığı sorununu da büyütüyor: aynı marka sesini üç farklı araçta üç kez ayrı ayrı kurmanız gerekiyor, çünkü hiçbiri diğerinin talimat setini içe aktarmıyor.

## Bir Klasör Yapısı Şablonu

Dağınıklığı önlemenin en pratik yolu, proje ve kişilik ayrımını isimlendirme kuralına yansıtmak:

```text
📁 Projeler (angajman bazlı, bitiş tarihi olan)
  ├── 2026-07-muşteri-x-onboarding
  ├── 2026-q3-urun-lansmani
  └── vergi-beyannamesi-2026

🔧 Kişilikler / Gems / Custom GPT'ler (kalıcı roller)
  ├── sözleşme-editörü
  ├── kod-inceleyici
  ├── marka-ses-asistanı
  └── haftalık-rapor-özetleyici

🗑️ Arşiv (kapanan projeler, 90 gün sonra silinecek)
```

Bir proje kapandığında arşive taşıyın, silmeyin — [NotebookLM ile araştırma rehberimizde](/tr/posts/notebooklm-ile-arastirma-ve-ogrenme) anlattığımız gibi, geçmiş bir projenin dosyaları bazen aylar sonra bambaşka bir bağlamda tekrar işe yarıyor. Kişilikler ise hiç kapanmıyor; sadece kullanılmadıkları dönemlerde sessiz kalıyor.

Bana kalırsa asıl disiplin, yeni bir sohbet açmadan önce kendinize "bu bir angajman mı, bir rol mü?" diye sormak. Bu tek soru, aylar sonra "hangi sohbette neydi" diye aramaktan kurtarıyor.

## Dağınıklıktan Düzene: Geçiş Adımları

Zaten aylarca birikmiş dağınık bir sohbet geçmişiniz varsa, sıfırdan başlamak yerine kademeli bir geçiş daha az sürtünmeli. Önce hâlâ aktif olan angajmanları ve tekrar eden rolleri ayrı ayrı listeleyin — bu liste genellikle beklediğinizden daha kısa çıkıyor, çünkü çoğu eski sohbet zaten kapanmış bir işe ait. Sonra aktif angajmanları birer projeye, tekrar eden rolleri birer Gem ya da Custom GPT'ye dönüştürün; geçmiş sohbetleri taşımaya çalışmayın, sadece ileriye dönük yeni işleri doğru kutuya yönlendirin.

Bu geçişte en sık yapılan hata, her şeyi tek bir "genel amaçlı" projeye ya da Gem'e sıkıştırmak. Bir proje ne kadar geniş tanımlanırsa, paylaşılan dosyalar o kadar ilgisiz hale geliyor ve model, hangi dosyanın hangi soruyla ilgili olduğunu ayırt etmekte zorlanıyor. Dar ve net tanımlanmış birkaç proje, geniş ve bulanık tek bir projeden her zaman daha iyi çalışıyor.

## Gizlilik ve Erişim Farkları

Üç sistem arasında bir de gözden kaçan bir fark var: dosyalarınızın nerede ve nasıl saklandığı. Claude Projects ve ChatGPT Projects'e yüklenen dosyalar o platformun kendi altyapısında statik olarak duruyor; Gemini'nin Drive entegrasyonu ise dosyayı kopyalamak yerine canlı bağlantı kuruyor, yani Drive'daki erişim izinleri değiştiğinde Gem'in görebildiği içerik de otomatik olarak değişiyor. Hassas belgelerle çalışıyorsanız, bu canlı bağlantının kimlerle paylaşıldığını ayrıca kontrol etmek gerekiyor — statik bir yüklemede bu risk yok, çünkü dosya bir kez yüklendiğinde kaynağındaki izin değişikliklerinden etkilenmiyor. Bu fark küçük görünse de, bir kurumsal ortamda kimin hangi belgeye erişebildiğini denetlerken pratik bir sonuç doğuruyor: canlı bağlantılı bir Gem, kaynağındaki izin değişikliğini otomatik yansıttığı için ayrı bir erişim denetimi gerektirmiyor, statik bir yükleme ise yükleyen kişinin o anki erişim kapsamını kalıcı olarak dondurmuş oluyor. Ekip genelinde bir politika belirlerken bu ikisini birbirinin yerine geçen seçenekler değil, farklı risk profillerine sahip iki ayrı araç olarak ele almak daha sağlıklı bir yaklaşım.

## Sıkça Sorulan Sorular

### Claude Projects ile ChatGPT Projects arasında pratik bir fark var mı?

İkisi de aynı temel mantıkla çalışıyor: paylaşılan dosyalar ve talimatlarla donatılmış, birden fazla sohbeti barındıran bir konteyner. Asıl fark hangi model ailesine kilitlendiğiniz ve dosya/entegrasyon detayları; organizasyon mantığı aynı.

### Bir Gem'i proje gibi kullanabilir miyim?

Teknik olarak evet ama doğal kalıbına aykırı. Gem'ler kalıcı bir kişilik etrafında kurulu; belirli bir bitiş tarihi olan, dosya ağırlıklı bir işi bir Gem'e sıkıştırmak, o Gem'in talimatlarını her yeni iş için yeniden yazmanızı gerektirir — bu da projenin sağladığı kolaylığı ortadan kaldırır.

### GPT Store'da yayınlanan bir Custom GPT'yi kim kullanabilir?

Plus ya da Team aboneliği olan herkes kendi Custom GPT'sini yayınlayabiliyor ve Store'daki milyonlarca Custom GPT'den herhangi biri diğer kullanıcılar tarafından bulunup kullanılabiliyor. Claude Projects ve Gemini Gems'te bu genel paylaşım altyapısı yok.

### Farklı görevler için farklı AI modelleri kullanıyorsam ne yapmalıyım?

Model kilidi gerçek bir kısıt, bu yüzden aynı işi birden fazla araçta paralel kurmanız gerekebilir. En azından talimat metnini tek bir kaynak belgede tutup her araca kopyalamak, en azından üslup tutarlılığını korumanıza yardımcı olur.
