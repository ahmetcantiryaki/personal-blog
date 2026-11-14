---
title: "Müşteri Görüşmelerini Yapay Zekayla Nasıl Sentezlersiniz?"
slug: "musteri-gorusmelerini-yapay-zeka-ile-sentezleme"
translationKey: "synthesize-customer-interviews-with-ai"
locale: "tr"
excerpt: "Transkriptleri modele verip tema iste yeterli değil; güvenilir sentez, ham alıntı etiketleme, çelişen kanıt isteme ve söylenen-yapılan ayrımını gerektirir."
category: "business"
tags: ["ai-tools", "productivity", "privacy", "communication"]
publishedAt: "2026-11-14"
seoTitle: "Müşteri Görüşmelerini Yapay Zekayla Sentezleme Rehberi"
seoDescription: "Transkriptleri yapay zekaya verip tema istemek yanıltıcı sonuç üretir. Önyargıya karşı korumalı bir AI destekli görüşme sentezi iş akışı adım adım burada."
---

Kısa cevap: transkriptleri bir modele verip "temaları çıkar" demek yeterli değil, çünkü model az kanıtla bile kendinden emin bir örüntü üretir. Güvenilir bir sentez; ham alıntıları etiketlemeyi, modelden çelişen kanıtı ayrıca istemeyi ve söylenenle yapılanı ayırmayı gerektirir. Aksi hâlde yapay zeka, zaten inandığınız hikâyeyi size geri okur.

Bu, Rob Fitzpatrick'in [The Mom Test](https://www.sachinrekhi.com/the-mom-test-rob-fitzpatrick) kitabında anlattığı klasik tuzağın yapay zeka sürümü. Kitaptaki temel uyarı neydi: bir kurucu fikrinden bahsetmeye başladığı anda görüşülen kişi sorunlarından bahsetmeyi kesiyor ve nezaketen övgüye geçiyor. Aynı dinamik, model fikrinizi veya hipotezinizi bilen bir sentez asistanına da sızıyor; sadece görüşülen kişi değil, model de size hoşunuza gidecek bir örüntü sunma eğiliminde.

## Mülakat notlarını yapay zekaya vermek neden tek başına yeterli değil?

Çünkü model, belirsizlik karşısında "bilmiyorum" demek yerine kendinden emin bir cevap üretmeye programlı; kanıt zayıfsa bile örüntü bulduğunu iddia eder. [CleverX'in araştırma sentezinde AI önyargısı üzerine yazısı](https://cleverx.com/blog/ai-bias-in-research-synthesis-how-to-catch-and-correct-it/) bunu açıkça belirtiyor: AI sentez araçları, eğitim verisinden ve prompt hassasiyetinden kaynaklanan kendi önyargı setini taşıyor ve örneklem zaten çarpıksa bu çarpıklığı büyütüyor.

Lumivero'nun 2026 raporuna göre araştırmacıların %57'si yapay zekayı düzenli veya ara sıra kullanıyor, ama %87'si doğruluk ve halüsinasyon riskinden endişeli ([Lumivero, 2026](https://lumivero.com/resources/blog/state-of-ai-in-qualitative-research/)). Bu endişe yersiz değil: on görüşmeden ikisinde geçen bir şikâyeti model "katılımcıların çoğu" diye özetleyebilir, çünkü dil modeli örnekleme büyüklüğünü değil örüntü gücünü önemser.

## Yapay zeka mülakat sentezinde en büyük tehlike nedir?

En büyük tehlike, halüsinasyon değil doğrulama yanlılığının modele devredilmesi. Siz zaten bir hipoteze sahipken modelden "temaları bul" istediğinizde, model o hipotezi destekleyen alıntıları öne çıkarıp çelişen alıntıları es geçme eğiliminde — tam da insan araştırmacının yaptığı hatayı, daha hızlı ve daha özgüvenli bir şekilde tekrarlıyor.

Bunun çözümü tek bir promptla olmuyor. Her sentez isteğine şu üç talebi eklemek gerekiyor: (1) bu temayı destekleyen tam alıntıları sayfa/zaman damgasıyla göster, (2) bu temayla çelişen veya onu zayıflatan her alıntıyı ayrıca listele, (3) bu temanın kaç görüşmede ve kaç kişide geçtiğini say. Üçüncü talep özellikle kritik, çünkü "birkaç kişi böyle dedi" ifadesi iki kişiyle on kişi arasındaki farkı gizliyor.

## Önyargıdan korunan bir AI destekli sentez iş akışı nasıl kurulur?

Dört adımlı bir iş akışı: transkripsiyon, etiketleme, kümeleme ve çelişki denetimi. Her adımda modelden ham veriye geri dönmesini ve paraphrase değil tam alıntı üretmesini istemek, sentezin kurucunun hafızasından değil kayıttan beslenmesini sağlıyor.

1. **Transkripsiyon:** Ses kaydını kelimesi kelimesine metne çevirin; modelin kendi özetini değil, orijinal transkripti saklayın.
2. **Etiketleme:** Modelden her cümleyi tek bir kod etiketiyle işaretlemesini isteyin (örnek: "fiyat-itirazı", "mevcut-araç-yetersiz"), özet değil etiket.
3. **Kümeleme:** Aynı etiketi taşıyan cümleleri bir arada gösterin ve modelden kümenin gücünü (kaç görüşme, kaç kişi) raporlamasını isteyin.
4. **Çelişki denetimi:** Her kümeye karşı "bu kümeyi çürüten alıntı var mı" sorusunu ayrıca sorun; model bulamıyorsa bunu açıkça yazdırın, sessizce atlamasına izin vermeyin.

Bu dört adımın hiçbiri karmaşık yazılım gerektirmiyor; mevcut bir sohbet arayüzünde art arda dört farklı promptla da yapılabilir. Önemli olan, her adımda ham veriye dönmek ve modelin "sanırım" diyebileceği yerde sayı istemek.

## Söylediği ile yaptığı nasıl ayrılır?

Görüşülen kişinin söylediğiyle geçmişte gerçekten yaptığı arasındaki fark, sentezin en sık gözden kaçan parçası. Fitzpatrick'in ikinci kuralı tam burada devreye giriyor: geleceğe dair görüş yerine geçmişte gerçekten yapılan somut davranışı sorun, çünkü insanlar niyetlerini aşırı iyimser anlatır ama geçmiş eylem yalan söylemez.

Sentez aşamasında bu ayrımı korumak için her temaya bir "kanıt türü" etiketi ekleyin: "ifade edilen tercih" (gelecekte ne yapacağını söylüyor) ya da "gözlenen davranış" (geçmişte gerçekten ne yaptığını anlatıyor). Aşağıdaki tablo, bu ikisinin sentezde nasıl farklı ağırlık taşıması gerektiğini özetliyor.

| Kanıt türü | Örnek ifade | Sentezdeki ağırlığı |
|---|---|---|
| İfade edilen tercih | "Böyle bir araç olsa kesinlikle kullanırım" | Düşük — niyet beyanı, ödeme veya kullanım garantisi değil |
| Gözlenen davranış | "Şu anda bu işi Excel'de üç saatte yapıyorum" | Yüksek — gerçek zaman/maliyet kanıtı |
| Övgü | "Fikir çok güzel, bayıldım" | Çok düşük — Fitzpatrick'e göre nezaket sinyali, ürün sinyali değil |
| Taahhüt | "Beta'ya kaydolurum, ekibime de söylerim" | Yüksek — somut bir sonraki adım içeriyor |

## Ham temalar nasıl önceliklendirilmiş bir sorun listesine dönüşür?

Her temayı, kaç görüşmede geçtiği ve hangi kanıt türüyle desteklendiğiyle birlikte bir tabloya dökün, sonra sadece "gözlenen davranış" ve "taahhüt" kanıtıyla desteklenen temaları bir sonraki deney listesine alın. Sadece ifade edilen tercihle desteklenen temalar, doğrudan özelliğe dönüşmeden önce bir doğrulama deneyi gerektiriyor.

Pratikte bu, her temaya üç sütun eklemek demek: görülme sıklığı, kanıt türü, önerilen sonraki adım. "Önerilen sonraki adım" sütunu bilerek dar tutulmalı — yeni bir özellik inşa etmek değil, önce ucuz bir doğrulama (bir ödeme sayfası, bir manuel prototip, bir takip görüşmesi) olmalı.

## Görüşme kayıtlarında gizlilik ve kişisel veri nasıl yönetilir?

Kaydı yapay zeka aracına yüklemeden önce katılımcıdan açık rıza almak ve ham ses dosyasını mümkünse işlemden sonra silmek şart. Transkripti üçüncü taraf bir modele gönderiyorsanız, katılımcının adı, şirketi ve iletişim bilgisi gibi doğrudan tanımlayıcıları (PII) etiketleme aşamasından önce maskelemek, hem katılımcıyı korur hem de modelin kişi kimliğine değil söylediğine odaklanmasını sağlar.

Kasım 2026 itibarıyla çoğu kurumsal AI aracı, girdileri varsayılan olarak model eğitiminde kullanmıyor; ama bu varsayımı sözleşme veya ayarlar sayfasında doğrulamadan kabul etmeyin, çünkü sağlayıcılar arasında bu davranış hâlâ farklılık gösteriyor. Küçük ekipler için daha fazla pratik yapay zeka rehberi [girişimcilik & iş kategorimizde](/tr/category/girisimcilik-is) bulunabilir.

Küçük ekiplerde AI araçlarını sorumlu kullanmanın daha geniş çerçevesi için [işe alım sürecinde yapay zekayı nerede güvenle kullanabileceğinize](/tr/posts/yapay-zeka-ile-ise-alim-ilandan-elemeye) dair yazımıza bakabilirsiniz; orada da aynı ilke geçerli: AI hızlandırır, ama nihai yargı ve rıza insanda kalmalı.

## Bu, Mom Test'in yerini mi alıyor?

Hayır, Mom Test'in yerini almıyor; onu ölçekliyor. [Anne Testi: Yanıltmayan Müşteri Görüşmeleri](/tr/posts/anne-testi-musteri-gorusmeleri) yazımızda anlattığımız üç kural (hayatlarından bahset, geçmişi sor, az konuş) hâlâ görüşmeyi yapan kişi için geçerli; yapay zeka sadece elli görüşmeyi elle okumanın mümkün olmadığı noktada devreye giriyor. Doğru soruları sormayan bir görüşmeciye yapay zeka hiçbir şey kazandırmıyor, çünkü sentezleyecek iyi veri zaten yok.

Kişisel görüşüm şu: en büyük risk modelin yanlış cevap vermesi değil, ekibin "AI söylediyse doğrudur" rahatlığına kapılıp ham transkripte bir daha hiç dönmemesi. Sentez aracı ne kadar iyi olursa olsun, en az bir kişinin orijinal kayıtları dinlemesi gerekiyor.

## Sıkça Sorulan Sorular

### Yapay zeka müşteri görüşmelerinde yalan söylüyor mu?

Hayır, yalan söylemiyor ama kanıt zayıf olduğunda bile kendinden emin bir örüntü üretme eğiliminde; buna halüsinasyon deniyor. Çözüm, her temadan tam alıntı, çelişen kanıt ve kaç görüşmede geçtiğinin sayısını ayrıca istemek.

### AI ile görüşme sentezinde en sık yapılan hata nedir?

En sık hata, transkriptleri modele verip doğrudan "ana temaları çıkar" demek ve çıkan özeti sorgulamadan kabul etmektir. Bu, modelin zaten var olan hipotezinizi destekleyen alıntıları öne çıkarmasına ve çelişen verileri gözden kaçırmasına yol açar.

### Görüşme kayıtlarını yapay zeka aracına yüklemek güvenli mi?

Katılımcıdan açık rıza aldıysanız ve sağlayıcının verileri model eğitiminde kullanmadığını doğruladıysanız genellikle güvenlidir. Yine de isim, şirket ve iletişim bilgisi gibi doğrudan tanımlayıcıları etiketleme öncesinde maskelemek ek bir koruma katmanı sağlar.

### Kaç görüşmeden sonra bir tema güvenilir sayılır?

Sabit bir sayı yok, ama bir temayı sadece bir veya iki görüşmeye dayandırıp genellemek riskli; sentez tablosunda her temanın kaç farklı görüşmede ve hangi kanıt türüyle (ifade edilen tercih mi, gözlenen davranış mı) geçtiğini ayrıca göstermek, erken genellemeyi engelliyor.
