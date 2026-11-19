---
title: "C2PA: Bir Fotoğrafın Gerçek Olduğunu Kanıtlamak"
slug: "c2pa-icerik-kimlik-bilgileri"
translationKey: "c2pa-content-credentials-2026"
locale: "tr"
excerpt: "Kısa cevap: C2PA, bir görsele kim ya da hangi araçla oluşturulduğunu imzalayan bir defter ekler; ekran görüntüsü bu defteri tamamen silebilir."
category: "technology"
tags: ["privacy", "scam-prevention", "images", "ai-tools"]
publishedAt: "2026-11-19"
seoTitle: "C2PA İçerik Kimlik Bilgileri 2026: Nasıl Çalışır?"
seoDescription: "C2PA içerik kimlik bilgisi dosyanın kaynağını imzalar, ama ekran görüntüsü alınca veya dosya yeniden kaydedilince bu kayıt tamamen kaybolur."
---

Kısa cevap: C2PA (Content Credentials), bir fotoğrafa veya videoya kimin ya da hangi aracın onu oluşturduğunu kaydeden, kriptografik olarak imzalanmış bir "defter" ekler. Bu defter dosyanın içine gömülür ve her düzenlemeyle büyür. Ama bir ekran görüntüsü almak veya dosyayı sade bir şekilde yeniden kaydetmek bu defteri tamamen silebilir — bu yüzden imzanın varlığı güven artırır, yokluğu hiçbir şey kanıtlamaz.

2026 itibarıyla C2PA, yapay zeka üretimi görsellerin yaygınlaşmasıyla "bu gerçek mi" sorusuna cevap aranan en somut teknik çerçeve. Ama kapsamı, kamera ve uygulama desteğine bağlı ve zincirin kendisi de kırılabiliyor.

## C2PA İçerik Kimlik Bilgisi Nedir?

C2PA (Coalition for Content Provenance and Authenticity), bir medya dosyasına "manifest" adı verilen imzalı bir kayıt ekleyen açık bir standarttır. Bu manifest; dosyayı oluşturan aracı veya cihazı, üzerinde yapılan düzenlemelerin zaman damgalı geçmişini ve yapay zekânın üretimde veya düzenlemede rol oynayıp oynamadığını kaydeder. Güncel spesifikasyon sürümü, Ocak 2026'da yayımlanan 2.3'tür.

Mekanizma şöyle işler: bir kamera donanımı veya bir yapay zeka üretim aracı, dosyayı oluşturduğu anda manifesti imzalar. C2PA uyumlu bir düzenleme aracında yapılan her sonraki değişiklik, mevcut geçmişin üzerine yazmak yerine zincire yeni imzalı bir giriş ekler. Böylece bir görüntüleyici, sadece son hâli değil, dosyanın geçirdiği tüm adımları görebilir.

## Hangi Kameralar ve Uygulamalar C2PA'yı Destekliyor?

Destek hâlâ parça parça: bazı üreticiler yerleşik imzalama sunuyor, bazıları hiç desteklemiyor. Leica M11-P, 2023'te C2PA'yı gömülü olarak sunan ilk tüketici kamerasıydı. Nikon, Ağustos 2025'te Z6 III'e C2PA ekledi, ama uygulamasında kritik bir güvenlik açığı bulunduktan sonra özelliği askıya aldı ve daha önce verdiği tüm sertifikaları iptal etti — bu, sistemin en zayıf uygulamasına bağlı olduğunun somut bir örneği.

| Araç / Cihaz | C2PA Desteği | Not |
|---|---|---|
| Leica M11-P | Var | İlk gömülü C2PA'lı tüketici kamerası (2023) |
| Nikon Z6 III | Askıda | Ağustos 2025'te eklendi, açık bulununca sertifikalar iptal edildi |
| Sony profesyonel video (PXW-Z300 serisi) | Var | Metadata üretimi destekleniyor |
| Canon Rebel/R serisi | Yok | Tüketici gövdelerinde destek bulunmuyor |
| Samsung Galaxy S25 | Var | Yapay zeka destekli düzenleme/üretimde (2025 başı) |
| Google Pixel 10 | Var | Kamera çekimlerinde sağlama verisini imzalıyor |
| ChatGPT görselleri | Var | Üretilen her görsel yapay zeka etiketi taşıyor |
| Gemini uygulaması | Var | Üretirken imzalıyor, yüklenen dosyada doğrulayabiliyor |
| Adobe Firefly / Photoshop | Var | Generative Fill gibi düzenlemeler manifeste işleniyor |
| Midjourney | Yok | 2026 ortası itibarıyla hâlâ C2PA gömmüyor |

Platform tarafı daha tutarsız: TikTok, Facebook, Instagram ve LinkedIn'in bir ölçüde Content Credentials gösterdiği bildiriliyor, ama platform desteği ekosistemin en zayıf, en değişken halkası olarak tanımlanıyor. AB Yapay Zeka Yasası'nın 50. maddesi, 2 Ağustos 2026'dan itibaren yapay zeka üretimi içeriğin işaretlenmesini zorunlu kıldı; bu da platformları etiketleme teknolojilerini -C2PA dahil- benimsemeye itiyor.

## C2PA Nerede Bozuluyor?

Dört somut kırılma noktası var. Birincisi silinme: bir dosyayı yeniden kaydetmek, ekran görüntüsü almak veya birçok sosyal platformun kendi yeniden kodlama/sıkıştırma hattından geçirmek, gömülü manifesti tamamen temizleyebilir. Silindiğinde görsel, hiç imzalanmamış gibi görünür — yani kimlik bilgisinin yokluğu, hiçbir şeyi kanıtlamaz.

İkincisi güven zincirinin kırılganlığı: Nikon Z6 III sertifika iptali, bir imzalama uygulamasının kendisinin tehlikeye girebileceğinin kamuya açık en net örneği. İptal edilen sertifikalarla imzalanmış her şey için garanti geriye dönük olarak çöküyor.

Üçüncüsü kapsam boşlukları: internetteki mevcut medyanın büyük kısmı C2PA'dan önce üretildi ve asla kimlik bilgisi taşımayacak; en popüler üretim araçlarından biri olan Midjourney ise tamamen dışarıda duruyor. Bu yüzden hem gerçek hem sahte içeriğin büyük bir kısmı manifestsiz dolaşıyor.

Dördüncüsü de filigranla karşılaştırma gerektiriyor.

## Filigran mı C2PA mı, Hangisi Daha Güvenilir?

İkisi de tek başına yetmez; birbirini tamamlayan, rakip olmayan iki yaklaşımdır. Google DeepMind'ın SynthID'si gibi görünmez istatistiksel filigranlar, piksellere/sinyale gömüldüğü için yeniden kodlama ve ekran görüntüsüne genelde C2PA manifestinden daha dayanıklıdır. Ama tipik olarak sadece "yapay zeka üretimi mi, değil mi" sinyalini verir; C2PA'nın taşıdığı zengin düzenleme geçmişini sunmaz.

Ağır düzenlemelere dayanıklı, aynı zamanda kötü niyetli aktörler tarafından tespit edilemeyen veya kaldırılamayan, gerçekten sağlam bir görünmez filigran hâlâ açık bir araştırma problemi. Filigranlar bazı araçlar tarafından kasıtlı olarak eklenmiyor; C2PA manifestleri ise silinebiliyor. Doğru çerçeveleme şu: her iki teknoloji de sahteciliği imkânsız kılmak için değil, maliyetini ve tespit edilme riskini yükseltmek için var.

## Bir Görselin Gerçek Olduğunu Nasıl Kontrol Edersin?

Önce bir doğrulama aracı kullan: [Content Authenticity Initiative'in Verify aracı](https://contentcredentials.org/verify) bir dosyada manifest olup olmadığını ve kırılmamış olup olmadığını gösterir. Kesintisiz bir manifest zincirinin varlığı olumlu bir sinyaldir, ama yokluğu sahtelik kanıtı değildir — çok fazla meşru içerik hiçbir zaman imzalanmadı.

Kimlik bilgisi eklemediği bilinen araçlardan (Midjourney gibi) gelen görsellere, gerçeklik önemliyse daha şüpheci yaklaş. Ve şunu akılda tut: sağlama teknolojisi, sahteciliği ortadan kaldırmıyor; sadece maliyetini artırıyor. Bu konunun [yapay zeka destekli dolandırıcılık ve deepfake](/tr/posts/ai-dolandiriciligi-deepfake-nasil-anlasilir) tarafına, [Claude'un metin filigranlama](/tr/posts/claude-metinleri-damgaliyor) yaklaşımına ve [ses klonu dolandırıcılığından korunma](/tr/posts/yapay-zeka-ses-klonu-dolandiriciligindan-korunma) rehberine bakarak daha geniş bir resim görebilirsin. Daha fazla teknoloji haberi için [teknoloji kategorisine](/tr/category/teknoloji) göz atabilirsin.

Basit bir örnek manifest kavramsal olarak şöyle görünür (bu, gerçek spesifikasyon sözdizimi değil, sadeleştirilmiş bir gösterimdir):

```json
{
  "claim_generator": "ornek-kamera-firmware/2.3",
  "assertions": [
    { "action": "created", "timestamp": "2026-11-18T09:12:00Z" },
    { "action": "color_adjustment", "timestamp": "2026-11-18T09:40:00Z" }
  ],
  "signature": "sha256:ornek-imza-referansi"
}
```

Dürüst çerçeveleme şu: C2PA, "bu gerçek" veya "bu sahte" diyen sihirli bir düğme değil; sadece zincirin kırılmadığı durumlarda kaynağı izlenebilir kılan bir kayıt mekanizması. Zincir çok kolay kırılıyor, bu yüzden tek kanıt olarak kullanılmamalı. Gazetecilik, hukuki süreç veya sigorta başvurusu gibi sonucu önemli olan durumlarda, C2PA'yı tek kanıt değil, diğer doğrulama yöntemlerinden biri olarak kullanmak daha güvenli bir yaklaşımdır — tanık ifadesi, orijinal dosyanın cihaz üzerinde saklanması veya bağımsız kaynaklarla çapraz doğrulama gibi yöntemlerle birlikte değerlendirilmelidir.

## Sıkça Sorulan Sorular

### C2PA içerik kimlik bilgisi tam olarak nedir?

C2PA, bir medya dosyasına kriptografik olarak imzalanmış bir manifest ekleyen açık bir standarttır; bu manifest dosyayı oluşturan aracı, düzenleme geçmişini ve yapay zekânın rolünü kaydeder. Güncel sürüm (2.3), Ocak 2026'da yayımlandı ve giderek daha fazla kamera, telefon ve yapay zeka aracı tarafından destekleniyor.

### Bir görselde C2PA kimlik bilgisi yoksa bu sahte olduğu anlamına gelir mi?

Hayır. İnternetteki mevcut görsellerin büyük kısmı C2PA'dan önce üretildi ve hiçbir zaman imzalanmadı; Midjourney gibi yaygın araçlar da hâlâ kimlik bilgisi eklemiyor. Kimlik bilgisinin yokluğu hiçbir şeyi kanıtlamaz; sadece dosyanın doğrulanabilir bir kaynak kaydı olmadığı anlamına gelir.

### C2PA manifesti nasıl silinir veya bozulur?

Bir dosyayı yeniden kaydetmek, ekran görüntüsü almak veya birçok sosyal platformun kendi sıkıştırma/yeniden kodlama işlemi, gömülü manifesti tamamen kaldırabilir. Nikon'un Z6 III'teki sertifika iptali de, imzalama sisteminin kendisinin bir güvenlik açığıyla çökebildiğini gösteren gerçek bir örnek.

### Filigranlama C2PA'nın yerini tutar mı?

Hayır, ikisi birbirini tamamlar ama birbirinin yerini almaz. Görünmez filigranlar yeniden kodlamaya genelde daha dayanıklıdır ama sadece "yapay zeka üretimi mi" sinyalini verir; C2PA ise zengin bir düzenleme geçmişi taşır ama daha kolay silinir. İkisi de sahteciliği imkânsız kılmaz, sadece maliyetini yükseltir.

**Kaynaklar:** [C2PA — Teknik Spesifikasyon](https://c2pa.org/specification/), [Content Authenticity Initiative](https://contentauthenticity.org/), [Digital Camera World — C2PA Kameraları](https://www.digitalcameraworld.com/cameras/these-are-the-best-c2pa-cameras-that-add-content-credentials-to-your-images-for-every-photographer-tired-of-the-question-is-this-ai).
