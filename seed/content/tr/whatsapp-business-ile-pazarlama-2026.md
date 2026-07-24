---
title: "WhatsApp Business ile Pazarlama: 2026 Rehberi"
slug: "whatsapp-business-ile-pazarlama-2026"
translationKey: "whatsapp-business-marketing-2026"
locale: "tr"
excerpt: "WhatsApp'ta banlanmadan pazarlama yapmanın yolu, 24 saatlik ücretsiz pencereyi, onaylı şablon mesajları ve gerçek onay akışını doğru kullanmaktan geçiyor."
category: "digital-marketing"
tags: ["automation", "communication", "integration", "best-practices"]
publishedAt: "2026-07-24"
seoTitle: "WhatsApp Business ile Pazarlama Rehberi 2026"
seoDescription: "WhatsApp'ta banlanmadan pazarlama: 24 saatlik pencere, onaylı şablon mesajlar ve opt-in kuralları. KOBİ'ler için 2026 uygulama vs Platform rehberi."
---

WhatsApp'ta banlanmadan pazarlama yapmanın kısa cevabı şu: müşteri size ilk mesajı attığında açılan 24 saatlik ücretsiz pencerede istediğiniz gibi yazın, pencere kapandıktan sonra sadece Meta'nın onayladığı şablon mesajları gönderin ve her durumda önce açık bir onay (opt-in) alın. Türkiye ve benzer pazarlarda WhatsApp zaten müşterilerin günlük olarak kullandığı kanal; sorun kanalın kendisi değil, kuralları bilmeden gönderilen mesajlar.

## Uygulama mı, Business Platform mı?

WhatsApp'ın işletmeler için iki ayrı yüzü var ve bunları karıştırmak en yaygın hata. WhatsApp Business app telefonunuza kurduğunuz, ücretsiz ve tek kişi tarafından yönetilen bir uygulama. WhatsApp Business Platform (yaygın adıyla Cloud API) ise Twilio, 360dialog gibi bir BSP (Business Solution Provider) üzerinden bağlanılan, programatik ve ölçeklenebilir bir altyapı.

Hangisini seçeceğiniz büyüklüğünüze bağlı. Kayıtlı numarası zaten telefonunuzda olan, günde birkaç düzine mesajı tek kişinin yanıtladığı bir esnaf veya solo girişimci için app fazlasıyla yeterli. Birden fazla temsilcinin aynı gelen kutusunu paylaştığı, CRM veya e-ticaret sistemine bağlanması gereken, binlerce onaylı numaraya şablon mesaj göndermesi gereken bir işletme için Platform şart. Aradaki fark sadece fiyat değil, mimari: app'te her şey manuel, Platform'da her şey entegrasyona açık.

| Özellik | WhatsApp Business App | WhatsApp Business Platform |
| --- | --- | --- |
| Maliyet | Ücretsiz | Kullanım başına ücretli (BSP üzerinden) |
| Kurulum | Telefona uygulama indirme | BSP + API entegrasyonu |
| Yayın listesi limiti | 256 kişi, sadece numarayı kayıtlı olanlara ulaşır | Limitsiz, opt-in veritabanına göre |
| Çoklu temsilci | Hayır, tek cihaz/kişi | Evet, paylaşılan gelen kutusu |
| Şablon mesaj gönderimi | Yok | Var, Meta onayı gerekli |
| CRM/e-ticaret entegrasyonu | Yok | Var |
| En uygun kullanım | Solo esnaf, küçük mağaza | Büyüyen KOBİ, çok kanallı destek ekibi |

## Uygulamanın araçları: katalog, hazır yanıtlar, etiketler, yayın listesi

Ücretsiz app'in sandığınızdan fazla aracı var. Katalog özelliği ürünlerinizi fiyat ve açıklamayla WhatsApp profilinize ekler; müşteri sohbet ekranından çıkmadan ürünlere göz atabilir. Hazır yanıtlar (quick replies) sık sorulan "kargo ne zaman gelir" tarzı soruları saniyeler içinde yanıtlamanızı sağlar. Etiketler (labels) müşterileri "yeni müşteri", "ödeme bekliyor", "sadık müşteri" gibi kategorilere ayırıp takip etmenizi kolaylaştırır. Yayın listeleri ise aynı mesajı birden fazla kişiye tek seferde göndermenizi sağlar — ama burada iki gerçek sınır var: liste başına en fazla 256 kişi ve mesaj sadece sizin numaranızı rehberine kaydetmiş kişilere ulaşır. Rehberinde numaranız olmayan birine yayın listesinden mesaj gitmiyor.

Müşteri katalogdan ürün seçip sepete ekleyebilir ama app içinde ödeme tamamlanmıyor; sipariş bilgisi size mesaj olarak düşüyor ve ödeme için müşteriyi web sitenize veya ödeme linkine yönlendirmeniz gerekiyor. Ürün açıklamalarını katalog için yazarken aynı disiplin geçerli: somut, ölçülebilir bilgi. [Shopify ürün açıklamaları rehberimizdeki](/tr/posts/ai-ile-shopify-urun-aciklamalari) prompt yapısı WhatsApp kataloğu için de doğrudan uygulanabilir.

## Platform tarafında kural değişiyor: 24 saatlik pencere ve şablonlar

Platform'da işler app'ten farklı işliyor. Müşteri size mesaj attığı veya sizi aradığı anda 24 saatlik bir "müşteri hizmeti penceresi" açılıyor; bu pencere içinde istediğiniz kadar serbest metin mesajı gönderebiliyorsunuz, ek bir şablon ücreti ödemiyorsunuz. Müşteri tekrar yazdıkça pencere sıfırdan başlıyor. Click-to-WhatsApp reklamlarından veya Facebook sayfanızdaki CTA'dan başlayan sohbetlerde bu süre 24 değil 72 saate çıkıyor; yani reklam üzerinden gelen bir konuşmada elinizde biraz daha fazla zaman oluyor.

Pencere kapandıktan sonra tek seçenek Meta'ya önceden onaylatılmış şablon mesajlar. Şablonlar dört kategoriye ayrılıyor ve her birinin kullanım kuralı farklı:

- **Utility (fayda):** Sipariş onayı, kargo bildirimi gibi işlem odaklı mesajlar. Onay süresi genelde hızlı.
- **Marketing (pazarlama):** Kampanya, indirim, yeni ürün duyurusu. En sıkı inceleme ve en yüksek maliyet bu kategoride.
- **Authentication (kimlik doğrulama):** Tek kullanımlık kod gönderimi. Kısa ve standart bir format zorunlu.
- **Service (hizmet):** Pencere içi serbest metne yakın, destek amaçlı yanıtlar.

Meta'ya gönderdiğiniz her şablon incelemeden geçiyor; utility ve authentication şablonları genelde yaklaşık 24 saatte onaylanıyor, marketing şablonları biraz daha uzun sürebiliyor. Onaylı bir utility şablonunun BSP üzerinden gönderilen gerçek bir payload'u şöyle görünüyor:

```json
{
  "messaging_product": "whatsapp",
  "to": "905XXXXXXXXX",
  "type": "template",
  "template": {
    "name": "siparis_kargoya_verildi",
    "language": { "code": "tr" },
    "components": [
      {
        "type": "body",
        "parameters": [
          { "type": "text", "text": "Ahmet" },
          { "type": "text", "text": "TR123456789" }
        ]
      }
    ]
  }
}
```

Bu yapı [Meta'nın WhatsApp Business Platform dokümantasyonunda](https://business.whatsapp.com/products/platform) detaylandırılıyor; şablon adı, dil kodu ve değişken parametreler önceden onaylanan formatla birebir eşleşmek zorunda, aksi hâlde gönderim reddediliyor.

## Onay olmadan şablon göndermeyin

[Meta'nın WhatsApp Business Platform dokümantasyonunda](https://business.whatsapp.com/products/platform) tanımlanan kural net: hiçbir pazarlama şablonunu müşteriden açık ve doğrulanabilir bir onay almadan gönderemezsiniz. Onay bir checkbox, bir anahtar kelimeyle gelen yanıt veya web formundaki açık bir metin olabilir — önemli olan, müşterinin "evet, WhatsApp'tan pazarlama mesajı almak istiyorum" dediğini kanıtlayabilmeniz. Bu kuralı çiğnemenin bedeli ağır: numaranızın kalite puanı düşüyor, şablonlarınız reddediliyor, tekrarında hesap askıya alınabiliyor.

Burada gördüğüm en yaygın hata, KOBİ'lerin elindeki her numarayı tek bir yayın listesine atıp toplu mesaj göndermesi. Kısa vadede işe yarıyormuş gibi görünse de bu yaklaşım hem app'in 256 kişilik limitine hem Meta'nın onay kurallarına çarpıyor ve numaranın itibarını hızla tüketiyor. Gerçek kazanç [bülten büyütme yaklaşımımızda](/tr/posts/bulten-buyutme-ve-gelir-2026) anlattığımız mantığın aynısından geçiyor: geniş ama gönülsüz bir listeye blast atmak yerine, gerçekten onay veren, dar ama etkileşimli bir liste kurmak. WhatsApp'ta da kazanan taraf hacim değil, doğru onay akışı.

## Terk edilmiş sepet ve sipariş güncelleme otomasyonları

Platform'un asıl gücü, e-ticaret sisteminize bağlanıp tetikleyici bazlı mesaj göndermesinde ortaya çıkıyor. Müşteri sepete ürün ekleyip ödemeyi tamamlamadan çıkarsa, bir utility şablonuyla birkaç saat sonra hatırlatma gönderebilirsiniz; sipariş durumunda değişiklik olduğunda (kargoya verildi, teslim edildi) yine utility şablonuyla otomatik bildirim atabilirsiniz. Bu akışlar müşteri zaten sizinle etkileşimde bulunduğu, yani onay zincirinin doğal bir parçası olduğu için hem uyumlu hem etkili oluyor. Sosyal medya tarafında benzer bir otomasyon disiplinini [küçük işletmeler için ChatGPT ile Instagram içeriği rehberimizde](/tr/posts/chatgpt-ile-instagram-icerigi-kucuk-isletme) de görebilirsiniz.

## Bilgi tabanına dayanan hafif AI otomatik yanıtlar

24 saatlik pencere içinde serbest metin gönderebildiğiniz için, bu pencerede basit bir AI otomatik yanıt katmanı kurmak mantıklı. Burada anahtar kelime "hafif" ve "bilgi tabanına dayalı": AI'nin uydurma cevap vermesini engellemek için yanıtları ürün kataloğunuz, kargo politikanız ve SSS sayfanızla sınırlı tutmanız gerekiyor. Kod yazmadan böyle bir destek botu kurmanın adımlarını [ilgili rehberimizde](/tr/posts/kod-yazmadan-ai-musteri-destek-botu) ayrıntılı anlattık; WhatsApp tarafında fark, botun yanıtlarının hâlâ 24 saatlik pencere veya onaylı service şablonlarıyla sınırlı kalması.

Bu yaklaşımın sınırını da baştan kabul etmek gerekiyor: AI otomatik yanıt, insan temsilcinin yerini almak için değil, tekrar eden basit soruları (kargo takibi, çalışma saatleri, iade koşulları) hızlıca karşılamak için var. Karmaşık şikayet veya özel durumlarda müşteriyi bir insana devretmeyen bir bot, kısa vadede zaman kazandırsa da uzun vadede müşteri memnuniyetini düşürüyor.

## Sıkça Sorulan Sorular

### WhatsApp pazarlaması için ücretli Platform'a ihtiyacım var mı?

Hayır, şart değil. Küçük bir işletme ve dar bir müşteri tabanıyla çalışıyorsanız ücretsiz app'in katalog, hazır yanıt ve yayın listesi özellikleri yeterli olabilir. 256 kişilik limiti aşıyor, birden fazla temsilciye ihtiyaç duyuyor veya CRM/e-ticaret entegrasyonu istiyorsanız Platform'a geçmek gerekiyor.

### 24 saatlik pencere dışında şablonsuz mesaj atarsam ne olur?

Mesaj gönderilmiyor; Platform bu tür bir isteği API seviyesinde reddediyor. Tekrarlanan denemeler numaranızın kalite puanını düşürebiliyor. Pencere kapandıysa tek yol Meta'nın onayladığı bir şablon mesaj kullanmak.

### Onay (opt-in) gerçekten şart mı?

Evet, Meta'nın kuralları bunu zorunlu tutuyor. Açık ve kanıtlanabilir bir onay olmadan gönderilen pazarlama şablonları hem reddedilme hem de hesap askıya alınma riski taşıyor. Onayı bir checkbox, form veya anahtar kelime yanıtıyla kayıt altına almanız gerekiyor.

### Müşteriler WhatsApp içinde ödeme yapabilir mi?

Hayır, en azından app tarafında değil. Müşteri kataloğunuzdan ürün seçip sepete ekleyebilir ama ödemeyi tamamlamak için web sitenize veya ödeme linkine yönlendirilmesi gerekiyor; WhatsApp içinde yerleşik bir ödeme tamamlama akışı bulunmuyor.
