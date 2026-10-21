---
title: "Toplantıyı Eyleme Dönüştür: ChatGPT ve Gemini"
slug: "toplantiyi-eyleme-donustur-ai"
translationKey: "ai-meeting-notes-action-items-2026"
locale: "tr"
excerpt: "Kısa cevap: kaydı ChatGPT veya Gemini'ye verip sahip ve tarih isteyen bir prompt kullanın; kararları tartışmadan ayırmak notları eyleme dönüştürür."
category: "career-productivity"
tags: ["chatgpt", "gemini", "productivity", "automation", "workflow"]
publishedAt: "2026-10-21"
seoTitle: "Toplantıyı Eyleme Dönüştür: ChatGPT ve Gemini"
seoDescription: "Kısa cevap: kaydı ChatGPT veya Gemini'ye verip sahip ve tarih isteyen bir prompt kullanın; kararları tartışmadan ayırmak notları eyleme dönüştürür."
---

Kısa cevap: toplantı kaydını veya transkriptini ChatGPT veya Gemini'ye verip her karar için açıkça bir sahip ve bir tarih isteyen bir prompt kullanın. Sorun genelde aracın kendisinde değil; aracın ürettiği özetin "kim ne zamana kadar ne yapacak" sorusunu cevapsız bırakmasında. Bu üç adımı atlamayan bir iş akışı, notları gerçekten eyleme dönüştürüyor.

## "Toplantıyı eyleme dönüştürmek" tam olarak ne demek?

Bu üç adımı net tutmak, hangi aracı seçtiğinizden daha önemli. Bir toplantı özeti ile bir eylem listesi aynı şey değil. Özet, konuşulanları kronolojik sırayla anlatır; eylem listesi ise sadece üç şeyi tutar: alınan karar, bu kararın sahibi ve bitiş tarihi. Çoğu AI özetleme aracı varsayılan olarak birinciyi üretir; ikincisini elde etmek için prompt'ta bunu açıkça istemeniz gerekir. Bu fark küçük görünür ama sonucu büyük: bir özeti kimse tekrar okumaz, ama adı ve tarihi yazan bir eylem listesi bir sonraki toplantıda doğrudan kontrol edilir.

Bu farkın pratikte görüldüğü en yaygın yer, haftalık durum toplantıları. Otuz dakikalık bir toplantıdan çıkan beş sayfalık bir özet, bir hafta sonra kimse tarafından açılmaz; aynı toplantıdan çıkan üç satırlık bir eylem listesi ("API entegrasyonu — Ahmet — 28 Ekim") bir sonraki toplantının ilk dakikasında doğrudan kontrol edilir. Araç seçimi burada ikincil; asıl fark, çıktının formatının kontrol edilebilir olup olmamasında.

## ChatGPT ile toplantı kaydı nasıl notlara dönüştürülür?

ChatGPT'ye bir ses dosyası yükleyip doğrudan transkript ve özet isteyebilirsiniz; ancak OpenAI'nin yardım merkezine göre ses dosyası yükleme özelliği yalnızca ücretli planlarda (Free planda değil) açık ve dosya başına üst sınır 512 MB. Uzun kayıtlar (örneğin bir saati aşan toplantılar) bazen parçalara bölünmeyi veya zaman aşımı riskini taşıyor, bu yüzden uzun toplantılarda kaydı önceden bölmek daha güvenilir sonuç veriyor. [ChatGPT'de ses yüklemeyle not çıkarma rehberimiz](/tr/posts/chatgpt-sesli-yukleme-not-cikarma) bu yükleme akışını adım adım anlatıyor.

## Gemini ile toplantı notları nasıl alınır?

Google Meet'in "Take notes for me" özelliği, Ağustos 2026 itibarıyla artık sadece online değil yüz yüze toplantılarda da çalışıyor; Google Workspace Blog'un 13 Ağustos 2026 tarihli duyurusuna göre özellik telefonun mikrofonunu kullanarak konuşmayı dinliyor, yapılandırılmış notlar, eylem öğeleri ve tam transkript içeren bir Google Doc oluşturup toplantı sonunda katılımcılara otomatik e-posta ile gönderiyor. Özellik Android, web ve iOS'a 11-31 Ağustos 2026 arasında kademeli olarak açıldı; Business Standard/Plus ve Enterprise Standard/Plus planlarında kullanılabiliyor.

| Özellik | ChatGPT | Gemini (Google Meet) |
|---|---|---|
| Girdi | Ses dosyası yükleme (manuel) | Toplantı içinde canlı dinleme (otomatik) |
| Plan gereksinimi | Ücretli planlar (Free hariç) | Business Standard/Plus, Enterprise Standard/Plus |
| Çıktı | Transkript + özet (prompt'a göre özelleştirilebilir) | Yapılandırılmış Google Doc (özet, eylem öğeleri, tam transkript) |
| Dağıtım | Elle kopyalanır | Toplantı sonunda otomatik e-posta |
| Yüz yüze toplantı desteği | Evet, kayıt yükleyerek | Evet, Ağustos 2026'dan beri telefon mikrofonuyla |

## Kararları tartışmadan nasıl ayırırsınız?

Prompt'unuzda üç alanı açıkça isteyin: karar, sahip, tarih. Bunu istemezseniz model, tartışmanın tamamını kronolojik bir özete sıkıştırır ve kimin ne yapacağı satırlar arasında kaybolur.

```text
Aşağıdaki toplantı transkriptini oku. Çıktıyı iki bölüme ayır:

1. KARARLAR — her satırda: [Karar] — Sahip: [isim] — Tarih: [gün/ay]
   Sadece gerçekten alınmış kararları listele; tartışılan ama
   karara bağlanmamış konuları bu bölüme koyma.

2. AÇIK SORULAR — henüz karara bağlanmamış, bir sonraki toplantıya
   bırakılan konular.

Transkript:
[buraya yapıştır]
```

Bu şablonu her toplantıda aynı şekilde kullanmak, eylem listesinin formatını tutarlı tutar; farklı formatta gelen bir liste, görev takip sisteminize aktarırken ekstra elle düzenleme gerektirir. Şablonu bir kez kaydedip her toplantı sonrası aynı metni kopyala-yapıştır yapmak, haftalar içinde format tutarlılığını otomatik hâle getirir; ekip büyüdükçe bu şablonu bir paylaşılan notlar dokümanına veya prompt kütüphanesine eklemek yeni katılan kişilerin de aynı standardı kullanmasını sağlar.

## Hangi toplantı türünde hangi araç daha uygun?

Online bir Google Meet toplantısında Gemini'nin "Take notes for me" özelliği daha az sürtünme yaratır, çünkü ekstra bir yükleme adımı gerektirmez ve toplantı biter bitmez Google Doc'u e-postanıza düşürür. Yüz yüze bir toplantıda veya Meet dışı bir platformda (Zoom, Teams, fiziksel bir oda) yapılan bir görüşmede ise kaydı sonradan ChatGPT'ye yüklemek daha pratik; özellikle ekip içi bir standart platforma bağlı değilseniz bu yöntem araç bağımsızlığı sağlar. İki yöntemi de aynı ekipte paralel kullanmak, hangi toplantı türünün hangi araçla daha iyi sonuç verdiğini birkaç hafta içinde netleştirir.

## Eylem listesini görev takip sistemine nasıl senkronize edersiniz?

AI'ın ürettiği eylem listesini doğrudan kopyalayıp yapıştırmak yerine, listeyi önce gözden geçirip onaylayın, sonra görev yönetim aracınıza aktarın. Bu ara adımı atlamak, modelin yanlış anladığı bir kararı (örneğin "X'i değerlendireceğiz" ifadesini kesin bir karara dönüştürmesi) doğrudan görev listenize sokma riski taşır. Haftalık bir rutin kurmak isteyenler için [ChatGPT ve Gemini ile e-posta triyajı rehberimiz](/tr/posts/chatgpt-gemini-eposta-triyaji) benzer bir "önce AI üretir, sonra insan onaylar" akışını e-posta tarafında nasıl kurduğumuzu gösteriyor.

## Gizlilik ve rıza konusunda nelere dikkat etmeli?

Bir toplantıyı kaydetmeden veya transkribe etmeden önce katılımcılara bunu açıkça söyleyin; birçok ülkede ve şirket politikasında sessiz kayıt hem yasal hem etik bir sorun. İkinci dikkat noktası veri saklama: yüklediğiniz ses dosyası veya oluşturulan transkript, şirket dışı müşteri görüşmeleri gibi hassas içerik taşıyorsa, bu veriyi hangi AI sağlayıcısının ne kadar sakladığını önceden kontrol edin. Üçüncü nokta, katılımcı listesinde dış taraflar (müşteri, aday, iş ortağı) varsa, kayıt ve not alma özelliğini açmadan önce onlardan ayrıca sözlü onay almak; şirket içi bir standart toplantıda bu adım genelde gereksiz ama dış görüşmelerde atlanmaması gereken bir adım.

Kişisel görüşüm şu: bu iş akışının asıl değeri hız değil, hesap verebilirlik. Bir toplantıdan "sanki bir şey kararlaştırıldı" hissiyle çıkmak yaygın bir sorun; adı ve tarihi yazan bir liste, bu belirsizliği ortadan kaldırıyor. AI'nın katkısı burada notu hızlı üretmesinden çok, "sahip ve tarih" alanlarını boş bırakmaya izin vermemesi. Çoğu ekip bu aracı sadece not almayı hızlandırmak için kullanıyor; oysa asıl kazanç, eskiden hiç yazılmayan sahip ve tarih bilgisinin artık her toplantıda zorunlu hâle gelmesi.

Performans değerlendirmesi öncesi kendi katkılarınızı belgelemek istiyorsanız [AI ile öz değerlendirme rehberimiz](/tr/posts/ai-ile-oz-degerlendirme-yaz) toplantılardan çıkan eylem öğelerini bir başarı günlüğüne nasıl dönüştüreceğinizi anlatıyor. ChatGPT'nin planları arasındaki farkları netleştirmek için [ChatGPT tam rehberimize](/tr/posts/chatgpt-tam-rehber-2026) bakabilirsiniz. Resmi kaynaklar: [OpenAI'nin ses yükleme yardım sayfası](https://help.openai.com/en/articles/8555545-uploading-files-and-audio-to-chatgpt) ve [Google Workspace Updates duyurusu](https://workspaceupdates.googleblog.com/2026/08/take-notes-with-me-for-in-person-meetings-is-now-available.html).

## Sıkça Sorulan Sorular

### ChatGPT'nin ücretsiz planında toplantı sesi yüklenebilir mi?

Hayır. OpenAI'nin yardım merkezine göre ses dosyası yükleme özelliği yalnızca ücretli planlarda açık; Free plan kullanıcıları bu özelliğe erişemiyor.

### Gemini'nin toplantı notu özelliği hangi Workspace planlarında var?

Business Standard, Business Plus, Enterprise Standard ve Enterprise Plus planlarında kullanılabiliyor; daha düşük seviyeli kişisel Gemini planları bu özelliği kapsamıyor.

### AI'nın ürettiği eylem listesine her zaman güvenilir mi?

Hayır. Model bazen "değerlendireceğiz" gibi belirsiz bir ifadeyi kesin bir karara dönüştürebilir; bu yüzden listeyi görev takip sistemine aktarmadan önce bir insanın gözden geçirmesi gerekiyor.

### Toplantıyı kaydetmeden transkript çıkarmanın bir yolu var mı?

Evet, canlı altyazı veya not alma özellikleri (Gemini'nin Google Meet entegrasyonu gibi) sesi kalıcı olarak kaydetmeden anlık olarak metne çevirebiliyor; ama katılımcıların bu özelliğin açık olduğundan haberdar olması gerekiyor.
