---
title: "Yapay Zeka Ajanları İçin API Nasıl Tasarlanır?"
slug: "yapay-zeka-ajanlari-icin-api-tasarimi"
translationKey: "api-design-for-ai-agents-2026"
locale: "tr"
excerpt: "Kısa cevap: araç adını ve açıklamasını modelin her çağrıdan önce okuduğu bir sözleşme sayın; sonuçları sade döndürün, yıkıcı işlemlerde açıkça onay isteyin."
category: "software-engineering"
tags: ["api-design", "ai-agents", "mcp", "backend"]
publishedAt: "2026-11-02"
seoTitle: "Yapay Zeka Ajanları İçin API Tasarımı (2026 Rehberi)"
seoDescription: "Ajana yönelik API tasarımı insana yönelikten nasıl farklı: araç açıklamaları, kaba mı ince taneli mi araçlar, idempotency, MCP mi REST mi, değerlendirme."
---

Kısa cevap: bir ajan, API'nizi tamamen aracın adına, açıklamasına ve şemasına bakarak çağırır — dokümantasyon sitenizi asla okumaz — bu yüzden o metadata, üzerine yorum eklenen bir şey değil, arayüzün kendisi olarak işlev görmelidir. Bunu sade ve yapılı sonuçlarla, açık ve eyleme dönüştürülebilir hatalarla ve yıkıcı her şeyde onay kapılarıyla eşleştirin; çoğu ajan araç çağırma hatası ortadan kalkar.

## Ajana yönelik API tasarımı insana yönelikten nasıl farklı?

İnsan bir geliştirici dokümanlarınızı bir kez okur, bir zihinsel model kurar ve sonra aylarca uç noktalarınızı hafızasından doğru biçimde çağırır. Bir ajanın çağrılar arasında kalıcı bir zihinsel modeli yoktur — aracı çağırıp çağırmayacağına ve nasıl çağıracağına her karar verdiğinde aracın adını, açıklamasını ve parametre şemasını (veya onun önbelleklenmiş bir özetini) yeniden okur. Bu tek fark, arayüzü nasıl yazmanız gerektiği konusunda neredeyse her şeyi değiştirir: bir insanın bir doküman sayfasını göz gezdirerek çözeceği belirsizlik, bir ajan için doğru aracı çağırmak, yanlış aracı çağırmak veya hiçbir şey çağırmamak arasında bir yazı-tura hâline gelir.

## Bir araç açıklamasını gerçekten işe yarar yapan nedir?

Açıklamayı, modelin göreceği tek dokümantasyon olarak ele alın, çünkü işlevsel olarak öyledir. Belirsiz bir açıklama ("kullanıcı kayıtlarını yönetir"), modele karar verecek hiçbir şey vermez, bu yüzden model aracı ya atlar ya da tahmini parametrelerle çağırır; her olası girdiyi örnek olarak sabitleyen fazla özelleştirilmiş bir açıklama ise ters yönde geri tepebilir — modeli örneklere o kadar sıkı bağlar ki hafifçe farklı ama geçerli bir duruma genelleyemez. Hedef, belirli ama kapsayıcı olmayan bir açıklama: aracın tam olarak ne zaman kullanılacağını, ne döndürdüğünü ve bir çağırıcıyı en çok takılacak bir veya iki parametre biçimini belirtin — [CodeConductor'ın MCP araçları tasarım rehberi](https://codeconductor.ai/blog/designing-mcp-tools-for-ai-agents/), tipli ve örnek taşıyan şema alanları dahil bu sözleşme çerçevesini daha ayrıntılı ele alıyor.

| Açıklama tarzı | Modelin yaptığı |
|---|---|
| Fazla belirsiz ("siparişleri yönetir") | Aracı atlar veya tahmini/boş parametrelerle çağırır |
| Fazla özelleştirilmiş (her olası girdiyi birebir listeler) | Örneklere aşırı uyar; onların dışındaki geçerli girdilerde başarısız olur |
| Belirli ve açık sınırlı | Doğru aracı, doğru biçimlendirilmiş parametrelerle çağırır |

Yayına almadan önce pratik bir test: aracı tetiklemesi gereken, her biri farklı ifade edilmiş, anlamca eşdeğer ama metinsel olarak farklı argümanlara sahip beş istem yazın ve modelin beşinde de doğru aracı seçip şemayı doğru doldurduğunu doğrulayın. Beşten ikisi başarısız olursa, sıkılaştırılması gereken şey açıklama, model değil.

## Kaba taneli mi ince taneli mi araçlar sunmalısınız?

Varsayılan olarak tam bir göreve karşılık gelen kaba taneli araçları seçin, daha ince taneli araçlara bölmeyi yalnızca ajanların birleşik aracı yanlış kullandığına dair kanıtınız olduğunda yapın. Tek bir yerde iyi tanımlanmış bir işi baştan sona yapan `create_and_send_invoice` aracı, bir ajanın kendisinin sıralaması gereken üç ayrı çağrıdan (`create_invoice`, `attach_line_items`, `send_invoice`) daha az hata yapılarak çağrılır — her ek çağrı, ajanın erken durabileceği, yanlış bir ID'yi ileri taşıyabileceği veya gerekli bir adımı atlayabileceği başka bir nokta demektir. İstisna, bir görevin bağlama göre birden fazla geçerli yolu olduğu durumlardır (bazen göndermeden oluşturmak istersiniz); bu durumda, çok açık "şunu ne zaman kullan..." açıklamalarıyla ayrı araçlar, kafa karıştırıcı isteğe bağlı parametre çatallanması olan tek bir araçtan daha iyidir.

## Bir araç gerçekte ne döndürmeli?

Çağrının amaçladığı soruyu yanıtlayan en küçük yapılı veriyi döndürün, altındaki veritabanı satırının tamamını değil. Bir yanıttaki her ek alan, ajanın her sonraki turda okuması ve belki üzerine akıl yürütmesi gereken token'lardır; büyük yapısız bloklar (ham HTML, tam log dökümleri, filtrelenmemiş API geçişleri) ajan bağlamının tutarlı biçimde boşa harcandığı veya ajanın gömülü bir ayrıntıyı yanlış okuduğu yerlerdir. Sonuçları tutarlı biçimde yapılandırın — başarı için aynı şekil, "sonuç yok" durumu için aynı şekil, hatalar için ayrı ve açıkça etiketlenmiş bir şekil — böylece ajan yanıt türünü düz metni yeniden ayrıştırmadan kalıp eşleştirmesiyle anlayabilir.

```json
{
  "status": "error",
  "error_code": "invoice_already_sent",
  "message": "INV-2041 numaralı fatura 30.10.2026'da zaten gönderildi ve düzenlenemez.",
  "next_step": "Bunun yerine bir iade faturası oluşturun veya iptal için muhasebeyle iletişime geçin."
}
```

Bu `next_step` alanı göründüğünden daha önemli: çıplak bir hata mesajı ajana neyin ters gittiğini söyler ama ne yapması gerektiğini söylemez, bu yüzden ajan genellikle aynı başarısız çağrıyı yeniden dener. Geçerli bir sonraki adımı adlandıran eyleme dönüştürülebilir bir hata, yeniden deneme döngülerini ölçülebilir şekilde azaltır. Aşağıdaki onay-token kalıbı aslında [idempotent API tasarımının](/tr/posts/idempotent-api-tasarimi) özellikle ajan araçlarına uygulanmış hâli — bir ödeme uç noktasını kararsız bir ağ yeniden denemesinden koruyan aynı kural, son çağrısının ulaşıp ulaşmadığından emin olmayan bir ajandan aracı da koruyor.

## Yıkıcı veya geri alınamaz işlemleri nasıl ele alırsınız?

Veri silen, para gönderen veya bir insanın geri alamayacağı bir mesaj gönderen her şey için açık bir onay adımı isteyin ve bunu her seferinde ajanın kendi takdirine güvenmek yerine aracın kendisine zorunlu kılın. Yaygın bir kalıp, iki çağrılı bir tasarımdır: ilk çağrı bir önizleme ve bir onay token'ı döndürür, ikinci çağrı ise yalnızca tam olarak o token geri gönderildiğinde çalışır. Bu, idempotency'yi de bedavaya çözer — ajan, ilk çağrının başarılı olup olmadığını bilmeden bir zaman aşımından sonra yeniden denerse, aynı onay token'ını yeniden göndermek ya bir kez çalışır ya da tekrarda güvenle hiçbir şey yapmaz; bir kartı iki kez tahsil etmek veya bir e-postayı iki kez göndermek yerine.

## Sayfalama ve büyük yanıtlar nasıl çalışmalı?

Varsayılan olarak küçük sayfa boyutları kullanın (10-20 öğe, 500 değil) ve ajanın daha fazlasını açıkça istemesini sağlayın; çünkü bir ajanın bağlam penceresi sadece bu çağrı için değil, tüm konuşma boyunca paylaşılan, sınırlı bir bütçedir — tek bir fazla istekli araç yanıtı, ajanın uzun bir oturumun ilerisinde akıl yürütmesi gereken her şeyi sıkıştırabilir. Ajanın kendisinin ofset hesaplamasını istemek yerine basit bir imleç veya `has_more` bayrağı ekleyin, çünkü değişen bir veri kümesi üzerinde aritmetik, ajanların ustalıkla yanlış yapabileceği tam da o türden ayrıntılı defter tutma işidir.

## MCP mi düz REST mi — hangisi?

Birden fazla istemci genelinde (Claude, diğer ajan çerçeveleri, şirket içi araçlar) özellikle yapay zeka ajanları için araçlar sunduğunuzda Model Context Protocol (MCP) kullanın; çünkü araç keşfini, şema biçimini ve istek/yanıt sözleşmesini standartlaştırır, böylece bu katmanı entegrasyon başına yeniden icat etmezsiniz. API zaten insana yönelik veya servisten servise kullanım için var olduğunda ve ajanlar sadece bir tüketici daha olduğunda, ince bir araç-çağırma katmanına sarılmış düz REST kullanın — olgun bir REST API'yi sıfırdan bir MCP sunucusu olarak yeniden kurmak nadiren kendini amorti eder. Yeni, ajan odaklı şirket içi araçlar için, MCP'nin sınırlı-bağlam kuralını MCP'nin kendisinin dışında da takip etmeye değer: her aracı veya araç grubunu tek bir açık alana sınırlayın ve araçları idempotent ve durumsuz tutun, böylece durumsuz bir REST uç noktası gibi ölçeklenirler — [Nordic APIs'in MCP sunucu uygulamaları listesi](https://nordicapis.com/8-tips-and-best-practices-for-mcp-server-development/) bu sınırlama tavsiyesini taşıyıcı ve kimlik doğrulama seçimleriyle birlikte ele alıyor.

## Ajanların araçlarınızı doğru çağırıp çağırmadığını gerçekte nasıl test edersiniz?

Küçük bir değerlendirme kümesi kurun — beklediğiniz araç çağrısına (veya çağrı dizisine) eşlenmiş 15-30 gerçekçi istem — ve bir açıklamayı, şemayı değiştirdiğinizde veya örtüşen yeni bir araç eklediğinizde bunu araç tanımlarınıza karşı çalıştırın. Bu, göz kararı fark edilmesi zor bir gerilemeyi yakalar: kataloga sonradan eklenen bir aracın, açıklaması tesadüfen örtüştüğü için eskiden mevcut bir araca giden çağrıları sessizce çalması. Araç çağırma doğruluğunu, bir API hata oranını takip ettiğiniz gibi her sürümde takip ettiğiniz bir metrik olarak ele alın, ilk lansmandan önce yaptığınız tek seferlik bir kontrol değil.

Benim yorumum: "model bunda iyi değil" diye bildirilen çoğu ajan araç-çağırma hatası, aslında şemaya ilk kez göz gezdiren yeni bir mühendisi de kafası karıştıracak arayüz hataları — belirsiz açıklamalar, tutarsız yanıt şekilleri ve sonraki adımı olmayan hatalar. Ajanlar için araç yazmak, size hiçbir zaman açıklayıcı bir soru soramayacak bir geliştirici için iyi bir genel API yazmaya yakın; önce arayüzü düzeltin, "yapay zeka araçlarımı güvenilir biçimde çağıramıyor" şikâyeti genellikle kendiliğinden çözülür. Bu aynı açık-sözleşme, yıkıcı-öncesi-onay ilkeleri [yapay zeka özelliklerinin hataları sessizce yutmak yerine nasıl ele alması gerektiğinde](/tr/posts/yapay-zeka-ozelliklerinde-sessiz-hata-tuzaklari) de doğrudan karşınıza çıkıyor; MCP üzerinden bir araç hiç sunmadıysanız, [ilk MCP bağlayıcınızı yazmak](/tr/posts/ilk-mcp-baglayicini-yaz-2026) yukarıdaki şema ve açıklama kurallarının bir istemci tarafından gerçekte nasıl zorlandığını görmenin en hızlı yolu.

## Sıkça Sorulan Sorular

### Yapay zeka ajanları için araç tasarımındaki en büyük hata nedir?

Belirsiz veya fazla örnek yüklü bir araç açıklaması yazmak. Belirsiz bir açıklama modele karar verecek hiçbir şey vermez ve yanlış veya atlanan çağrılara yol açar; fazla belirli bir açıklama ise modeli örneklerine sabitler ve listelenmemiş geçerli girdilerde başarısızlığa yol açar.

### Kaba taneli mi ince taneli mi ajan araçları kurmalıyım?

Varsayılan olarak tam bir işi baştan sona tamamlayan kaba taneli araçları seçin. Daha ince taneli araçlara bölmeyi yalnızca birleşik aracın yanlış kullanıldığına dair kanıtınız olduğunda yapın — bir ajanın kendisinin sıralaması gereken her ek çağrı, bir adımı atlayabileceği veya yanlış bir değeri ileri taşıyabileceği başka bir noktadır.

### Bir ajanın yıkıcı bir işlemi iki kez çalıştırmasını nasıl önlerim?

İki çağrılı bir onay kalıbı kullanın: ilk çağrı bir önizleme ve bir onay token'ı döndürür, ikinci çağrı ise yalnızca tam olarak o token ile çalışır. Bir yeniden denemede aynı token'ı yeniden göndermek ya bir kez çalışır ya da güvenle hiçbir şey yapmaz; bu, idempotency ve onayı aynı anda çözer.

### Ajan araçları için MCP mi düz REST API mi kullanmalıyım?

Birden fazla yapay zeka istemcisi genelinde çalışması amaçlanan ajana özel araçlar kurarken MCP kullanın, çünkü keşfi ve şema biçimini standartlaştırır. Olgun bir API zaten insan veya servis istemcilerine hizmet ediyorsa ve ajanlar sadece bir tüketici daha ise, ince bir araç-çağırma sarmalayıcısıyla düz REST kullanın.
