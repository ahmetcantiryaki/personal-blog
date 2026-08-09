---
title: "ChatGPT Eklentileri Geri Döndü: 2026 Rehberi"
slug: "chatgpt-eklentileri-2026-rehberi"
translationKey: "chatgpt-plugin-directory-2026"
locale: "tr"
excerpt: "OpenAI, Uygulama Dizini'ni Eklenti Dizini'yle değiştirdi, eklentileri masaüstüne taşıdı. Kurulum, @ ile çağırma, izin modeli ve denenecek eklentiler rehberi."
category: "ai"
tags: ["chatgpt", "openai", "integration", "automation"]
publishedAt: "2026-08-09"
seoTitle: "ChatGPT Eklenti Dizini: 2026 Kullanım Rehberi"
seoDescription: "OpenAI'ın Uygulama Dizini'nin yerini alan yeni Eklenti Dizini nasıl çalışır? Kurulum, @ ile çağırma, izin modeli ve web/masaüstünde ilk denenecek eklentiler."
---

OpenAI, 9 Temmuz 2026'da ChatGPT'nin Uygulama Dizini'ni (App Directory) yeni bir Eklenti Dizini'yle (Plugin Directory) değiştirdi ve eklenti desteğini masaüstü uygulamasına da taşıdı. Değişiklik, sadece bir isim değişikliği değil — eklentiler artık uygulamaları, becerileri (skill) ve şablonları tek bir çatı altında topluyor, ChatGPT'yi harici veri ve aksiyonlara bağlayan entegrasyon katmanını yeniden düzenliyor.

## Ne Değişti ve Neden

Eskiden "uygulama" (app) tek entegrasyon birimiydi: bir uygulamayı bağlar, kimlik doğrularsınız, ChatGPT o uygulamayla konuşurdu. Yeni modelde "eklenti" (plugin) daha geniş bir kavram — bir eklenti bir uygulamayı, bir beceriyi ya da bir uygulama şablonunu içerebiliyor. Mevcut uygulama bağlantılarınız etkilenmiyor; sadece yeni eklentileri artık dizinden ekleyip, aynı kimlik doğrulama akışıyla bağlıyorsunuz. [OpenAI'ın resmi yardım makalesine göre](https://help.openai.com/en/articles/20001256-plugins-in-chatgpt-and-codex), mevcut uygulama bağlantıları etkilenmeden korunuyor ve kullanıcılar dizinden yeni eklentiler ekleyip, ilgili uygulamayı önceki akışla aynı şekilde bağlayıp yetkilendirebiliyor.

Bu değişikliğin arkasındaki motivasyon, OpenAI'ın Codex tarafında da benzer bir eklenti mantığını devreye almış olması. Yani artık bir eklenti sadece ChatGPT sohbetinde değil, Codex'in kod yazma ortamında da aynı kimlik ve yetkilendirme modeliyle çalışabiliyor — bu da geliştirici araçları için tek bir entegrasyon yatırımının iki farklı üründe geçerli olması anlamına geliyor.

Bunun pratik faydası, eklenti geliştiricilerinin artık tek bir "uygulama" kalıbına sıkışmak yerine, bir iş akışını (workflow) doğrudan paketleyebilmesi. Örneğin bir eklenti hem Notion'a not yazan bir aksiyonu hem de o notu biçimlendiren bir "beceri"yi tek pakette sunabiliyor.

## Kurulum ve @ ile Çağırma

Bir eklentiyi kurmak, dizinden seçip yetkilendirme adımını tamamlamaktan ibaret — kimlik doğrulama akışı önceki uygulama bağlantılarıyla aynı. Kurulduktan sonra bir sohbette `@eklenti-adı` yazarak o eklentiyi doğrudan çağırabiliyorsunuz; ChatGPT bağlamdan hangi eklentinin gerekli olduğunu genelde kendisi de anlıyor, ama `@` ile açıkça belirtmek, özellikle birden fazla benzer eklenti kurulu olduğunda daha öngörülebilir sonuç veriyor.

```text
@GitLab bu reponun son 3 gündeki açık PR'larını özetle
```

## Resmi Lansman Ortakları

Eklenti Dizini'nin lansmanında altı geliştirici ekosistemi ortağı öne çıktı: Airtable, GitLab, HubSpot, Notion, Supabase ve Vercel. Bu altılı, dizinin geliştirici tarafında ne kadar ciddiye alındığının bir göstergesi — hepsi zaten API-first ürünler ve ChatGPT üzerinden doğal bir "konuşarak işlem yap" arayüzüne çok uygun.

| Ortak | Tipik kullanım senaryosu |
|---|---|
| GitLab | PR özeti, issue takibi, CI durumu sorgulama |
| Notion | Not/doküman oluşturma ve arama |
| Airtable | Tablo güncelleme, kayıt sorgulama |
| Supabase | Veritabanı şeması sorgulama, proje durumu |
| Vercel | Deploy tetikleme, build log inceleme |
| HubSpot | CRM kaydı güncelleme, lead sorgulama |

## Güvenlik ve İzin Modeli

Bir eklenti sizin verinize eriştiğinde ya da bir aksiyon (bir kaydı silmek, bir deploy tetiklemek gibi) gerçekleştirdiğinde, her adım için ayrı onay istiyor — kimlik doğrulamayı bir kere yapmanız, o eklentiye sınırsız yetki verdiğiniz anlamına gelmiyor. Riskli aksiyonlarda (veri silme, ödeme tetikleme) bu onay adımını atlamamak kritik; özellikle takım hesaplarında kimin hangi eklentiyi hangi yetkiyle kullandığını düzenli gözden geçirmek gerekiyor.

Pratik bir kural: salt-okunur eklentileri (arama, sorgulama) rahatça deneyebilirsiniz, ama yazma/silme yetkisi olan eklentileri önce test ortamında ya da düşük riskli bir veri setiyle deneyin.

Takım hesaplarında bir yönetici, hangi üyenin hangi eklentiyi kurduğunu ve hangi kapsamda (scope) yetki verdiğini merkezi bir panelden görebiliyor. Bu görünürlük, özellikle 10'dan fazla kişilik ekiplerde önemli — aksi halde bir mühendisin "sadece test için" kurduğu, yazma yetkili bir eklenti fark edilmeden aylarca aktif kalabiliyor.

## Önce Kurmaya Değer İş Akışları

Eklenti Dizini'ne yeni giriyorsanız, en çok zaman kazandıran ilk üç kurulum genelde şunlar: geliştirme ekipleri için GitLab (PR ve issue özetleme), doküman-ağırlıklı ekipler için Notion (toplantı notlarını otomatik yapılandırma) ve satış/pazarlama ekipleri için HubSpot (lead özetleme, takip hatırlatması). Bunları kurup bir haftalık gerçek kullanım sonrası hangi eklentilerin gerçekten iş akışınıza oturduğunu görmek, dizindeki onlarca seçenek arasında boğulmaktan daha verimli. Aynı haftada dördüncü bir aday olarak Vercel'i de eklemek mantıklı, özellikle deploy durumunu sohbet içinden takip etmek isteyen ekipler için — ama bunu ilk üçe dahil etmemenin nedeni, deploy tetikleme gibi yazma yetkisi gerektiren aksiyonların, ekip eklenti kullanım alışkanlığına henüz oturmadan verilmemesi gereken bir yetki olması.

[ChatGPT tam rehberimizde](/tr/posts/chatgpt-tam-rehber-2026) hangi planın hangi kullanıcıya uygun olduğunu detaylandırmıştık; eklenti erişimi şu an tüm ücretli planlarda mevcut, ücretsiz planda ise sınırlı sayıda salt-okunur eklentiyle sınırlı. Bu sınırlama, OpenAI'ın yazma/aksiyon yetkisi gerektiren entegrasyonları bilinçli olarak ücretli katmana ayırma stratejisiyle örtüşüyor — aynı hafta duyurulan sınırsız ücretsiz sohbetin aksine, eklenti tarafında cömertlik göstermiyor. Aynı hafta içinde OpenAI, kimlik doğrulama tarafında da hareket etti — [ChatGPT ile Giriş yazımızda](/tr/posts/chatgpt-ile-giris-ne-demek) bu iki güncellemenin nasıl birbirini tamamladığını anlattık: eklentiler veriye erişimi, "ChatGPT ile Giriş" ise kimliği taşıyor.

## MCP ile Karışıklık: Aynı Şey Değiller

Eklenti Dizini'ni [Model Context Protocol (MCP) yazımızla](/tr/posts/model-context-protocol-nedir) karıştırmamak gerekiyor. MCP, bir modelin harici araçlara ve verilere bağlanması için açık, sağlayıcıdan bağımsız bir protokol; ChatGPT'nin Eklenti Dizini ise OpenAI'ın kendi ürününe özgü, kürasyonlu bir dizin deneyimi. Pratikte birçok eklenti arka planda MCP benzeri bir araç çağırma mekanizması kullanıyor olabilir, ama kullanıcı deneyimi ve dağıtım modeli tamamen farklı — biri açık bir standart, diğeri OpenAI'ın kapalı kapısı. [AgentDiscoverability'nin eklenti tanımına göre](https://www.agentdiscoverability.com/blog/what-is-a-chatgpt-plugin/) de bir ChatGPT eklentisi, modelin harici bir API'yi ne zaman ve nasıl çağıracağını tarif eden bir manifest dosyasına dayanıyor — bu da MCP sunucularının tanım biçimine kavramsal olarak yakın, ama dağıtım kanalı tamamen OpenAI'ın kontrolünde.

## Eklenti Geliştirenler İçin Not

Bir eklenti geliştiriyorsanız, dizine kabul edilme kriterleri App Directory dönemine göre daha sıkı. OpenAI, özellikle yazma/silme yetkisi isteyen eklentiler için daha ayrıntılı bir güvenlik incelemesi yapıyor; bu da dizine girme süresini uzatabiliyor ama kullanıcı güvenini artıran bir tercih. Eğer eklentiniz sadece salt-okunur bir arama/sorgulama işlevi sunuyorsa, inceleme süreci belirgin şekilde daha hızlı işliyor — bu da MVP aşamasında önce salt-okunur bir sürümle başlayıp, yazma yetkilerini sonradan eklemenin makul bir strateji olduğunu gösteriyor.

## Kişisel Görüşüm

Uygulama Dizini'nden Eklenti Dizini'ne geçiş, isim değişikliğinden fazlası; OpenAI'ın "tek tık entegrasyon" vaadini "iş akışı paketleme" vaadine dönüştürme çabası gibi okunuyor. Ama bu genişlemenin izin yorgunluğuna (her eklenti için ayrı onay ekranı) yol açma riski de var — kullanıcıların altı ay içinde onay isteklerini otomatik olarak kabul etme alışkanlığı edinmesi, tam da güvenlik modelinin önlemeye çalıştığı şey.

Bu riske rağmen, dizinin altı büyük geliştirici aracıyla lansmanı doğru bir sinyal. Rastgele onlarca küçük entegrasyon yerine, zaten API-first ve kurumsal güven kazanmış ürünlerle başlamak, dizinin kalitesini baştan yüksek tutuyor — bu da OpenAI'ın "dizin şişmesin" konusunda bilinçli bir tercih yaptığını gösteriyor.

## Sıkça Sorulan Sorular

### Mevcut uygulama bağlantılarım Eklenti Dizini'ne geçince bozulur mu?

Hayır, mevcut bağlantılar etkilenmiyor. Sadece yeni entegrasyonları artık "eklenti" olarak dizinden ekliyorsunuz.

### Eklenti Dizini hangi platformlarda mevcut?

Web ve masaüstü ChatGPT uygulamasında. Mobil tarafta destek kademeli olarak genişliyor.

### Ücretsiz plan kullanıcıları eklenti kullanabiliyor mu?

Sınırlı sayıda salt-okunur eklentiye erişim var; yazma/aksiyon yetkisi gerektiren eklentilerin çoğu ücretli planlara ayrılmış durumda.

### Eklenti Dizini ile MCP bağlayıcıları aynı şey mi?

Hayır. MCP açık bir protokol, Eklenti Dizini ise OpenAI'ın kürasyonlu kendi dizini. Bir geliştirici hem MCP uyumlu bir sunucu hem de ChatGPT'ye özel bir eklenti yazmayı tercih edebilir; ikisi birbirini dışlamıyor.
