---
title: "Claude Code'un Gizli Takip Kodu Ne Anlama Geliyor"
slug: "claude-code-gizli-takip-kodu"
translationKey: "claude-code-hidden-tracking-code"
locale: "tr"
excerpt: "Claude Code, Nisan'dan beri saat dilimi ve proxy'ye göre kullanıcıları gizlice etiketliyordu; sinyal bir Unicode karakterinde saklıydı, 1 Temmuz'da kaldırıldı."
category: "ai"
tags: ["ai-coding", "ai-tools", "ai-reliability", "web-security", "claude"]
publishedAt: "2026-07-07"
seoTitle: "Claude Code'un Gizli Takip Kodu Ne Anlama Geliyor"
seoDescription: "Claude Code, Nisan'dan beri saat dilimi ve proxy'ye göre kullanıcıları gizlice işaretliyordu; sinyal bir Unicode karakterinde saklıydı, 1 Temmuz'da kaldırıldı."
---

Üç ay boyunca Claude Code, sistem saat diliminizi ve proxy'nizin IP aralığını kontrol eden, sonucu da kendi sistem promptundaki tek bir karakteri değiştirerek işaretleyen gizlenmiş bir mantıkla dağıtıldı. Bir Reddit kullanıcısı bunu 30 Haziran 2026'da ortaya çıkardı; kodu kaldıran pull request 1 Temmuz'da birleştirildi. Bu yazıda kodun gerçekte ne yaptığını, Anthropic'in neden inşa ettiğini söylediğini ve makinenizde çalışan kapalı kaynaklı bir ajana güvenmenin ne anlama geldiğini ele alıyoruz.

## Reddit'te bir geliştirici gerçekte ne buldu

LegitMichel777 rumuzlu kullanıcı, Claude Code'un gizlenmiş paketini tersine mühendislikle inceliyordu ve "Today's date is" ifadesindeki kesme işaretinin standart bir apostrof olmadığını fark etti. Derinleşince karakterin, görsel olarak birbirinin aynısı ama teknik olarak farklı üç Unicode kod noktasından biri arasından küçük bir karar ağacıyla seçildiğini gördü: sistem saat dilimi `Asia/Shanghai` ya da `Asia/Urumqi` mi? Giden istekler, Çin alan adları ve AI-lab IP aralıklarından oluşan sabit kodlanmış bir listedeki bir proxy üzerinden mi geçiyor? Yanıta göre tarih biçimi de tireden eğik çizgiye dönüşüyordu. [Orijinal bulgu birkaç saat içinde Hacker News'in ön sayfasına çıktı](https://news.ycombinator.com/item?id=48734373) ve [The Register](https://www.theregister.com/ai-and-ml/2026/07/01/anthropic-is-removing-its-covert-code-for-catching-chinese-competitors/5265366) aynı gün bağımsız doğrulama yayımladı.

Bunların hiçbiri terminalde görünmüyordu. Değiştirilen kesme işareti insan gözüne birebir aynı görünüyor; bu, kullanıcıya yönelik değil makineye okunur bir sinyal — sıradan görünen içeriğin içine bir bayrak kodlamak anlamına gelen klasik bir steganografi örneği.

## Parmak izi nasıl kuruldu

Tespit mantığının kendisi basit bir XOR şifrelemesiyle (anahtar `91`) gizlenmişti; bu, ikili dosyada düz metin `strings` taramasını atlatmaya yeter ama biri bilinçli olarak aradığında tersine çevirmek kolaydı. Aşağıdaki tablo, tersine mühendislik yazılarına ve Anthropic'in özelliğe dair kendi açıklamasına dayanarak hangi durumun hangi sinyali tetiklediğini özetliyor.

| Sinyal | Tetikleyen koşul | Nasıl kodlandı |
|---|---|---|
| Bölge bayrağı | Sistem saat dilimi `Asia/Shanghai` ya da `Asia/Urumqi` | Tarih biçimi: tire → eğik çizgi |
| Reseller bayrağı | Giden trafik, sabit kodlanmış proxy/AI-lab alan adı listesiyle eşleşiyor | Üç benzer Unicode apostrofundan biri |
| Birleşik bayrak | İki koşul da doğru | Üçüncü, farklı bir apostrof varyantı |
| Gizleme katmanı | Yukarıdakilerin tümüne uygulandı | Derlenmiş paket içinde `91` anahtarıyla XOR |

Kod, 2 Nisan 2026'da yayımlanan 2.1.91 sürümünden beri, sürüm notlarında tek satır bile geçmeden çalışıyordu.

## Anthropic bunu neden inşa ettiğini söylüyor

Claude Code ekibinde mühendis olan Thariq Shihipar, [X'te paylaştığı gönderide](https://x.com/AnthropicAI) özelliğin "yetkisiz resellerlardan hesap kötüye kullanımını önlemeyi ve distilasyona karşı korumayı amaçlayan, Mart'ta başlattığımız bir deney" olduğunu söyledi. Her iki kaygı da gerçek: ABD ihracat kontrolleri, Çin'deki alıcıların sınır modellere doğrudan API erişimini kısıtlıyor ve bu da Claude erişimini doğrudan satın alamayan müşterilere proxy üzerinden aktaran bir reseller pazarı doğurdu; Çinli laboratuvarların, sınır model çıktılarını sıfırdan eğitmekten çok daha ucuz ve hızlı biçimde rakip modeller eğitmek için kullandığı da iyi belgelenmiş bir örüntü. Bir oturumu bölge ve proxy yoluna göre işaretlemek, bu iki örüntüyü büyümeden önce yakalamanın kaba ama akla yatkın bir yolu.

Shihipar, ekibin "bunu bir süredir kaldırmayı düşündüğünü" de ekledi — kaldırma tamamen Reddit paylaşımına tepki değildi, ama zamanlama kesinlikle hızlandı.

Burada dikkat çeken teknik seçim, tespitin bir engelleme değil bir işaretleme olarak tasarlanması. Kod, şüpheli bir isteği reddetmiyor ya da hız sınırlamıyor; sadece sonucu görünmez bir sinyale kodlayıp Anthropic'in arka ucuna taşıyor. Bu, statik string taramasıyla ya da ağ trafiği incelemesiyle fark edilmesi zor, buna karşılık üretim ortamında geniş ölçekte örüntü analizine imkân tanıyan bir yaklaşım. Aynı zamanda bunun neden aylarca kimsenin fark etmediğini de açıklıyor: davranış hiçbir zaman gözle görülür biçimde değişmedi, yalnızca telemetri katmanında bir bit çevrildi.

## Sonuçları: bir yasak ve bir güven sorunu

Alibaba'nın, gizli parmak izi tespiti gerekçesiyle bulgudan günler sonra Claude Code'un kurum içi kullanımını kısıtlamaya gittiği bildirildi. Bu, görünen maliyet. Görünmeyen maliyet ise daha geniş: Claude Code, geliştiricilerin dosya sistemi ve kabuk erişimi verdiği, satıcının ikili dosyasının yalnızca belgelerde anlatılanı yaptığı varsayımına dayanan araçlarla aynı güven kategorisinde — [Claude Code subagent ve arka plan ajanları](/tr/posts/claude-code-subagent-arka-plan-ajanlari) yazımızda ele aldığımız araç sınıfıyla birebir aynı. Sıradan çıktı metnine gömülü, belgelenmemiş gizli bir sinyal, niyet dar anlamda savunma amaçlı olsa bile bu varsayımı zedeliyor.

Bence Çin açısı buradaki asıl derse dikkat dağıtıyor. "Çinli reseller tespiti"ni "kullanım kademesi zorlaması" ya da "rakip model tespiti" ile değiştirin, aynı mekanizma birebir aynı şekilde çalışır — ve kapalı kaynaklı bir kodlama ajanının mimarisinde, satıcının bunu başka bir nedenle, daha dikkatli gizlenmiş biçimde yeniden göndermesini engelleyen hiçbir şey yok. İlginç olan arıza jeopolitik değil; yapısal. Kaynağından kendiniz derlemediğiniz herhangi bir ajan, hiç incelemeyi düşünmeyeceğiniz içeriğe keyfi sinyaller kodlayabilir.

## Claude Code — ya da herhangi bir kapalı kaynaklı ajan — çalıştıranlar için anlamı

Pratikte günlük kullanımın çoğu için hiçbir şey değişmiyor: bayrak yalnızca bir tarih dizesini etkiledi, kodunuzu, dosyalarınızı ya da belgelenmiş herhangi bir şekilde hesap durumunuzu değil. Ama olay, AI kodlama araçlarına ne kadar örtük güven verdiğinizi gözden geçirmek için işe yarar bir vesile. Birkaç somut alışkanlık yardımcı olur:

- CLI sürümünüzü sabitleyin ve bir şey tuhaf hissettirdiğinde sürüm notlarının diff'ini gerçek davranış değişiklikleriyle karşılaştırarak okuyun — tıpkı bu Reddit kullanıcısının yaptığı gibi.
- Satıcının sistem prompt içeriğini, kontrol ettiğiniz bir yapılandırma değil, güvenilmeyen bir çıktı olarak ele alın — [agentjacking tarzı saldırılara karşı önerdiğimiz](/tr/posts/agentjacking-yeni-ai-ajan-saldirisi) tutumun aynısı.
- Birden fazla kaynak tarafından bağımsız doğrulanan AI-araç bulgularını takip edin; [açık kaynak güvenliği ve AI çöpü](/tr/posts/ai-copu-acik-kaynak-guvenligi) yazımızda işaret ettiğimiz örüntü tam da bu — tek başına doğrulanmamış bir iddia kanıt değildir, ama Hacker News, The Register ve Anthropic'in kendi mühendisinin aynı gerçeklerde buluşması öyledir.
- Birden fazla sınır kodlama asistanını değerlendiriyorsanız, [Claude Sonnet 5, GPT-5.6 ve Gemini 3.5 kıyaslamamız](/tr/posts/claude-sonnet-5-gpt-5-6-gemini-3-5-kiyaslamasi), ham benchmarkların yanında satıcı geçmişini de tartmak için makul bir başlangıç noktası.

Bunların hiçbiri Claude Code kullanmayı bırakmanızı gerektirmiyor. Gerektirdiği şey, "satıcının ikili dosyası tam olarak belgelerde yazdığını yapar" varsayımını verili değil, düzenli aralıklarla test edilmesi gereken bir varsayım olarak ele almak. Kurumsal ekipler için pratik bir adım, sürüm yükseltmelerini otomatik değil gözden geçirmeli hale getirmek ve büyük satıcı güncellemelerinden sonra davranış farklarını izleyen basit bir kontrol listesi tutmaktır.

## Sıkça Sorulan Sorular

### Gizli kod kodumu ya da dosyalarımı bir yere gönderdi mi?

Hiçbir bağımsız rapor buna dair kanıt bulmadı. Mekanizma yalnızca Claude Code'un kendi sistem prompt çıktısına gömülü bir tarih dizesini ve bir noktalama karakterini, saat dilimi ve proxy tespitine dayanarak değiştirdi — kaynak kodu, kimlik bilgilerini ya da dosya içeriklerini dışarı sızdırmadı.

### Takip kodu bugün hâlâ Claude Code'da mı?

Anthropic, kodu kaldıran pull request'i 1 Temmuz 2026'da birleştirdi. Bu tarihten sonra yayımlanan bir sürümü çalıştırıyorsanız burada anlatılan mekanizma artık bulunmuyor olmalı; sabitlenmiş eski sürümlerde hâlâ mevcut olabilir.

### Anthropic bunu Nisan'da neden sürüm notlarında açıklamadı?

Anthropic, bunu bir iç deney olarak nitelendirmenin ötesinde eksikliğe dair ayrıntılı bir açıklama yapmadı. Geliştirici topluluğundan gelen eleştirinin özü, özelliğin belirtilen amacından çok bu açıklama eksikliği.

### Bu yalnızca Çin'deki kullanıcıları mı etkiliyor?

Tespit koşulları Çin saat dilimlerine ve sabit kodlanmış bir proxy listesine özgüydü, dolayısıyla bu örüntünün dışındaki kullanıcıların büyük çoğunluğu hiç işaretlenmedi. Geliştiricilerin dile getirdiği daha geniş nokta, bu sefer kimin işaretlendiği değil — aynı, açıklanmamış sinyal mekanizmasının bir satıcının bir dahaki sefer seçeceği herhangi bir kriteri hedefleyebilecek olması.
