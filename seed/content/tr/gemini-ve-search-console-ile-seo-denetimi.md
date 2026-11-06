---
title: "Gemini ve Search Console ile SEO Denetimi"
slug: "gemini-ve-search-console-ile-seo-denetimi"
translationKey: "seo-audit-gemini-search-console-2026"
locale: "tr"
excerpt: "Kısa cevap: Search Console verisini Sheets'e aktarın, Gemini'ye çöken sayfaları ve 8-20 pozisyon bandındaki fırsat kelimelerini bulmasını söyleyin."
category: "digital-marketing"
tags: ["gemini", "seo", "marketing-analytics", "automation"]
publishedAt: "2026-11-06"
seoTitle: "Gemini ve Search Console ile SEO Denetimi (2026)"
seoDescription: "Search Console verisini Sheets'e aktarıp Gemini ile çöken sayfaları, sıçrama mesafesi kelimelerini ve düşük TO başlıkları bulma rehberi; aylık rutine çevirme."
---

Kısa cevap: Search Console'un Performans raporunu sorgu, sayfa, tıklama, gösterim ve pozisyon sütunlarıyla Sheets'e aktarın; Gemini'den gösterimi yüksek ama tıklaması düşen sayfaları, pozisyon 8-20 bandındaki "sıçrama mesafesi" kelimelerini ve aynı sorguya rekabet eden sayfaları (cannibalization) işaretlemesini isteyin. Önerilen her başlık değişikliğini yayına almadan önce ham veriyle karşılaştırarak doğrulayın.

## Search Console Verisini Sheets'e Nasıl Aktarırsınız?

Search Console'un Performans görünümünde bir tarih aralığı seçip Dışa Aktar düğmesinden Google Sheets'i seçin; bu, sorguları, sayfaları, ülkeleri, cihazları ve arama görünümünü (zengin sonuçlar) ayrı boyutlar olarak taşır. Manuel dışa aktarım yaklaşık 1.000 satırla sınırlı olduğu için büyük sitelerde BigQuery toplu aktarımı daha doğru bir tablo verir, ama küçük-orta ölçekli bir blog için Sheets dışa aktarımı aylık denetim için yeterli. Sheets'e geçtikten sonra Gemini aynı dosyanın içinde çalışıyor, bu da verinin platform arası kopyalanmasını gerektirmiyor.

## Gemini Çöken Sayfaları Nasıl Buluyor?

Gemini'den "son 90 gün ile önceki 90 günü karşılaştır, tıklaması en çok düşen 15 sayfayı listele" gibi doğal dilde bir istek yeterli; Gemini bunu Sheets formülüne çevirip hesaplıyor, karmaşık sorular için arka planda kendi kodunu yazıp çalıştırıyor. Bu, [içerik çürümesi (content decay)](/tr/posts/icerik-curumesi-nedir-nasil-onarilir) kavramının tam karşılığı — bir sayfa zamanla rekabetten veya güncelliğini kaybetmekten dolayı pozisyon kaybediyor ve bu kaybı elle taramak yerine Gemini'ye bir formül yazdırmak dakikalar alıyor.

## Sıçrama Mesafesindeki (8-20) Anahtar Kelimeler Nedir?

Pozisyon 8 ile 20 arasında oturan sorgular, bir sayfanın bir sayfa içi değişiklikle (başlık, ilk paragraf, iç bağlantı) ilk sayfaya veya üst sıralara sıçrayabileceği bant; bu sorgular zaten bir şekilde sıralanıyor ama tıklama kazanacak kadar yukarıda değil. Gemini'ye "pozisyonu 8-20 arasında olan, gösterimi en az 30 olan sorguları pozisyona göre sırala" dedirtmek bu listeyi saniyeler içinde çıkarıyor; bu liste, sıfırdan içerik üretmek yerine mevcut sayfayı düzenleyerek en hızlı kazanılan trafiği gösteriyor.

| Sinyal | Ne anlatır | Gemini istemi |
|---|---|---|
| Gösterim yüksek, TO düşük | Başlık/meta sorguya zayıf cevap veriyor | "TO'su %1'in altında, gösterimi 50+ olan sorguları listele" |
| Pozisyon 8-20 | Sayfa içi düzenlemeyle sıçrama potansiyeli | "Pozisyonu 8-20 arasında olan sorguları sırala" |
| Aynı sorguya 2+ sayfa | Cannibalization — sayfalar birbirini yiyor | "Aynı sorguda görünen birden fazla URL'yi grupla" |
| Tıklama düşüşü (90 gün) | İçerik çürümesi | "Son 90 günle önceki 90 günü karşılaştır, en çok düşen sayfaları sırala" |

## 1.000 Satır Sınırını Aşarsanız Ne Yaparsınız?

Manuel Sheets dışa aktarımı yaklaşık 1.000 satırda kesiliyor, bu yüzden aylık 5.000'den fazla sorgusu olan bir site için bu sınır gerçek veriyi gizliyor — en çok etkilenen, kuyruktaki (long-tail) düşük hacimli ama toplamda önemli sorgular oluyor. Çözüm, Search Console'un BigQuery toplu dışa aktarımına geçmek; ama burada bir ayrıntı var: bu aktarımda hazır bir "ortalama pozisyon" sütunu yok, kendiniz `SUM(sum_top_position)/SUM(impressions) + 1` formülüyle hesaplamanız gerekiyor, çünkü ham değer sıfır tabanlı. `data_date` alanının Pasifik saatine göre kaydedildiğini ve anonimleştirilmiş düşük hacimli sorguların okunabilir metin olarak gelmediğini de not edin — Gemini'ye bu farkı anlatmazsanız model "eksik veri"yi "sıfır trafik" diye yanlış yorumlayabilir.

## Gemini'nin Önerilerine Ne Kadar Güvenmeli?

Gemini'nin önerdiği her başlık veya meta açıklamayı, önerinin dayandığı ham satırları yan yana göstermeden onaylamayın — bir model, veri setinde gerçekte olmayan bir trend görebilir veya düşük hacimli, istatistiksel olarak anlamsız bir sorguyu "fırsat" diye işaretleyebilir. Pratik kontrol: Gemini bir sayfayı öncelikli olarak işaretlediğinde, o sayfanın son 90 gündeki gösterim ve tıklama rakamlarını kendiniz bir kez daha okuyun; sayı küçükse (örneğin 20 gösterim) o "fırsat" istatistiksel gürültü olabilir.

## Cannibalization Tespit Edildikten Sonra Nasıl Düzeltilir?

Aynı sorguya iki veya daha fazla sayfanızın birden çıktığını Gemini listelediğinde, çözüm genellikle üç seçenekten biri: daha zayıf sayfayı daha güçlü olana 301 ile yönlendirmek, iki sayfayı tek bir daha kapsamlı sayfada birleştirmek, veya sayfaların gerçekten farklı niyetlere hizmet ettiğini netleştirip her birinin başlığını o niyete göre ayrıştırmak. Hangi seçeneği seçeceğinize karar vermeden önce iki sayfanın da son 90 günlük tıklama ve pozisyon verisine bakın — ikisi de düşük performans gösteriyorsa birleştirme genellikle daha iyi sonuç veriyor, biri zaten iyi performans gösteriyorsa o sayfayı korumak ve zayıf olanı yönlendirmek daha güvenli.

## Bunu Aylık Bir Rutine Nasıl Dönüştürürsünüz?

Her ayın aynı günü aynı dışa aktarımı tekrarlayan, aynı Gemini istemlerini çalıştıran ve çıkan listeyi önceki ayla karşılaştıran sabit bir Sheets şablonu kurun — tek seferlik bir denetim yerine ay be ay karşılaştırılabilir bir tablo, hangi düzeltmelerin işe yaradığını görmenizi sağlıyor. Düzeltilen sayfaları ayrı bir sekmede "düzeltildi, tarih X" diye işaretlemek, üç ay sonra "bu değişiklik işe yaradı mı" sorusunu tekrar ham veriden kazmak zorunda kalmadan cevaplamanızı sağlıyor. Bu rutin, [AI özetlerinin tıklamayı yediği](/tr/posts/ai-ozetleri-tiklama-hayatta-kalma) dönemde pozisyon 8-12 bandının neden önemli olduğunu gösteren veriyle doğrudan örtüşüyor; aynı sıçrama-mesafesi mantığı [arama trafiği düşüşünü ölçme](/tr/posts/arama-trafigi-dususu-pazarlama-olcumu) yazısındaki atıf çerçevesiyle birleştiğinde, hangi düşüşün AI özetlerinden hangisinin gerçek bir içerik sorunundan kaynaklandığını ayırmanıza yardımcı oluyor.

Benim yorumum: Gemini'yi burada bir SEO uzmanı gibi değil, hızlı bir veri analisti gibi kullanın — hangi soruyu soracağınızı siz belirleyin, cevabı siz yorumlayın, modelin yaptığı sadece saatler süren bir Sheets formülü işini dakikalara indirmek.

Bu denetimi tek kişilik bir ekip de kurabilir: ayda bir saatlik bir blok ayırmak, dışa aktarımı yapmak, aynı dört Gemini istemini çalıştırmak ve çıkan listeden en fazla üç sayfayı düzeltmeye karar vermek yeterli. Üç sayfadan fazlasını aynı ay düzeltmeye çalışmak genellikle hiçbirini düzgün bitirememekle sonuçlanıyor; dar kapsam, geniş ama yüzeysel bir denetimden daha fazla gerçek iyileşme getiriyor. Bir yıl boyunca her ay üç sayfa düzeltmek, tek seferde otuz altı sayfayı aynı anda "iyileştirmeye çalışmaktan" çok daha fazla ölçülebilir kazanım bırakıyor geride; çünkü her sayfa için gerçekten neyin değiştiğini ve neyin işe yaradığını hâlâ hatırlayabiliyorsunuz; otuz altı sayfayı birden değiştirdiğinizde ise üç ay sonra hangi değişikliğin hangi sonucu getirdiğini kimse çözemiyor, çünkü çok fazla değişken aynı anda hareket etmiş oluyor ve hangisinin asıl etkiyi yarattığı, hangisinin salt tesadüf olduğu kaybolup gidiyor.

## Sıkça Sorulan Sorular

### Search Console verisini Sheets'e nasıl aktarırım?

Performans görünümünde bir tarih aralığı seçip Dışa Aktar düğmesinden Google Sheets'i seçin; bu sorgu, sayfa, tıklama, gösterim, TO ve pozisyon sütunlarını aktarır. Manuel dışa aktarım yaklaşık 1.000 satırla sınırlı; daha büyük siteler için BigQuery toplu aktarımı gerekir.

### Gemini çöken sayfaları nasıl tespit eder?

Doğal dilde "son 90 günle önceki 90 günü karşılaştır, tıklaması en çok düşen sayfaları listele" gibi bir istek yeterli; Gemini bunu Sheets formülüne veya arka planda çalışan koda çevirip hesaplıyor. Bu, içerik çürümesini elle taramaktan çok daha hızlı.

### Sıçrama mesafesindeki anahtar kelimeler ne anlama gelir?

Pozisyon 8 ile 20 arasında sıralanan, zaten bir şekilde görünen ama tıklama kazanacak kadar yukarıda olmayan sorgular. Bu sayfalar sıfırdan içerik üretmek yerine mevcut sayfayı düzenleyerek en hızlı kazanılabilecek trafiği temsil ediyor.

### Gemini'nin SEO önerilerine körü körüne güvenmeli miyim?

Hayır. Her öneriyi, dayandığı ham gösterim ve tıklama rakamlarıyla birlikte kontrol edin; düşük hacimli bir sorgu istatistiksel gürültü olabilir ve model bunu gerçek bir fırsat gibi işaretleyebilir.
