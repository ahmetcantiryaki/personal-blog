---
title: "Veri Simsarlarından Nasıl Çıkılır?"
slug: "veri-simsarlarindan-cikmak-gizlilik"
translationKey: "delete-data-broker-opt-out-2026"
locale: "tr"
excerpt: "Kısa cevap: Verin zaten satılıyor. Veri simsarlarından çıkmak tek seferlik bir ayar değil, üç ayda bir tekrarlanması gereken sürekli bir temizlik işi."
category: "technology"
tags: ["privacy", "best-practices", "automation", "smart-home"]
publishedAt: "2026-09-03"
seoTitle: "Veri Simsarlarından Çıkma Rehberi (Eylül 2026)"
seoDescription: "Eylül 2026 itibarıyla veri simsarlarından elle çıkma, ücretli silme servisleri, GDPR'nin unutulma hakkı ve Kaliforniya DROP sistemiyle adım adım rehber."
---

Kısa cevap: Tek bir "çıkış düğmesi" yok. Büyük veri simsarlarında tek tek elle opt-out formu doldurman, GDPR'nin unutulma hakkını kullanman veya Kaliforniya'daki DROP gibi eyalet sistemlerinden toplu silme talebi göndermen gerekiyor — ve hiçbiri kalıcı değil. Simsarlar veriyi yeniden satın aldıkça kayıtların birkaç ay içinde geri gelmesi normal, bu yüzden gizliliği bir kere ayarlanıp unutulan bir switch değil, tekrar eden bir bakım işi gibi ele almak gerekiyor.

## Veri Simsarı Nedir, Seni Nasıl Profilliyor?

Veri simsarı, senden doğrudan izin almadan seninle ilgili bilgi toplayıp bunu üçüncü taraflara satan şirket demektir. Kaynakları çeşitli: tapu ve mahkeme kayıtları gibi kamuya açık veriler, sadakat programlarının sattığı alışveriş geçmişi, mobil uygulamalardan çekilen konum ve reklam kimlikleri, sosyal medyadan kazınan (scrape edilen) profil bilgileri.

Bu parçalar tek başına zararsız görünse de birleştirildiğinde adını, adresini, telefon numaranı, yakın akrabanı, tahmini gelirini ve alışkanlıklarını içeren bir dosya ortaya çıkıyor. Spokeo, Whitepages, BeenVerified gibi "people-search" siteleri bu dosyayı doğrudan satıyor; Acxiom ve LexisNexis gibi büyük simsarlar ise veriyi reklamverenlere, sigorta şirketlerine ve arka plan kontrolü yapan firmalara toptan satıyor. ABD'de kayıtlı veri simsarı sayısı 545'i buluyor — bu rakam Kaliforniya'nın Ocak 2026'da yürürlüğe giren simsar kayıt defterinden geliyor ve yalnızca tek bir eyalete kayıtlı olanları kapsıyor.

## Büyük Simsarlarda Elle Opt-Out Nasıl Yapılır?

Her simsarın kendi formu, kendi kimlik doğrulama adımı ve kendi bekleme süresi var; ortalama bir kullanıcı en çok trafik alan 10 kadar siteden çıktığında maruziyetinin büyük kısmını azaltmış oluyor, çünkü arama sonuçlarının üst sıralarını genelde aynı birkaç site paylaşıyor. İşlem sırası şöyle: önce adını tırnak içinde, şehrinle birlikte Google'da ara; kızlık soyadı, eski adres ve eski telefon numarası varyasyonlarını da dene; çıkan her siteyi listele, sonra tek tek "opt out" veya "remove my information" sayfasını bul.

| Simsar | Opt-out yöntemi | Tipik bekleme |
| --- | --- | --- |
| Whitepages | Form + telefonla kod doğrulama | 1-3 gün |
| Spokeo | E-posta ile onay linki | Birkaç gün-2 hafta |
| BeenVerified | Form, bazen kimlik yükleme istenebiliyor | 1-2 hafta |
| MyLife | Form + telefon araması gerekebiliyor | 2-4 hafta |
| Acxiom | Web formu (toplu veri işleyici, bireysel profil sayfası yok) | Belirtilmiyor, genelde birkaç hafta |

Süreler simsara ve talebin hacmine göre değişiyor; tabloya güvenip "kesin şu kadar gün" beklentisiyle takip etmemek daha sağlıklı. Her formu doldururken kullandığın e-postayı ve tarihi bir tabloya not etmek, üç ay sonra "bu siteye zaten yazmış mıydım" sorusuna cevap vermeni kolaylaştırıyor.

## Ücretli Silme Servisleri (Incogni, DeleteMe) Buna Değer mi?

Kısa cevap: Zamanın gerçekten kısıtlıysa evet, ama sihirli bir çözüm değil. Incogni, DeleteMe, Kanary gibi servisler ayda 5-25 dolar arasında bir ücretle yüzlerce simsara otomatik opt-out talebi gönderiyor ve verinin geri gelip gelmediğini periyodik olarak tarıyor — elle yapman gereken tekrarlayan işi devrediyor.

[Sınırları da net](https://innovation.consumerreports.org/new-report-data-defense-evaluating-people-search-site-removal-services/): bu servisler sosyal medya profillerini, kendi paylaştığın içerikleri veya kapsadıkları listede olmayan bölgesel/niş simsarları temizleyemiyor. Yani "hesabımı verdim, artık görünmez oldum" beklentisi gerçekçi değil; servis, kapsadığı ~100-200 simsarlık listeyi düzenli tarayan bir otomasyon katmanı olarak düşünülmeli. Benim değerlendirmem: elle 10 büyük siteden çıkmaya vaktin varsa parayı harcamana gerek yok; ama düzenli takibi unutacağını biliyorsan, aylık ücret otomasyonun karşılığını fazlasıyla veriyor.

## GDPR'nin "Unutulma Hakkı" Veri Simsarları İçin Nasıl İşliyor?

[GDPR'nin 17. maddesi](https://gdpr-info.eu/art-17-gdpr/), AB/EEA'da yaşayan herkese kişisel verisinin silinmesini talep etme hakkı veriyor ve şirketlerin bu talebe en geç bir ay içinde yanıt vermesi gerekiyor. Bu hak veri simsarları için de geçerli; simsar verinin işlenmesini haklı gösteren bir yasal zorunluluk (vergi kaydı gibi) gösteremiyorsa talebi reddedemiyor.

Kritik nokta 19. madde: eğer bir şirket verini bir veri simsarıyla paylaştıysa, senin silme talebin üzerine o simsarı da bilgilendirmekle yükümlü — "orantısız çaba" istisnası dışında. Yani bir e-ticaret sitesinden silme talebinde bulunmak, zincirleme olarak o sitenin veri sattığı simsarlara da ulaşabiliyor. GDPR'ye uymayan şirketlere kesilen üst sınır cezası 20 milyon avro veya yıllık küresel cironun %4'ü — hangisi büyükse. Talebini yazılı yapıp resmi bir kayıt bırakmak, 30 günlük süre dolduğunda ulusal veri koruma otoritesine şikâyet edebilmen için önemli.

## ABD'de Eyalet Gizlilik Yasaları Veri Simsarlarına Ne Sağlıyor?

CCPA/CPRA kapsamında Kaliforniya sakinleri herhangi bir şirketten (sadece simsarlardan değil) verisinin silinmesini ve satışının durdurulmasını talep edebiliyor, ama bunu yüzlerce şirkete tek tek yapmak pratikte imkânsız hale geliyordu. Bu sorunu çözmek için Kaliforniya'nın Delete Act'i kapsamında [DROP (Delete Request and Opt-Out Platform)](https://cppa.ca.gov/regulations/drop.html) 1 Ocak 2026'da devreye girdi: tek bir ücretsiz talep, eyalete kayıtlı tüm veri simsarlarına otomatik olarak iletiliyor.

Simsarların bu talepleri işleme zorunluluğu 1 Ağustos 2026'da başlıyor ve talepleri her 45 günde bir kontrol edip uygulamaları gerekiyor; uymayan simsara talep başına günlük 200 dolar ceza uygulanabiliyor. Vermont'ta da benzer bir simsar kayıt yasası var ve Haziran 2026'da imzalanan değişiklikle kapsamı genişletildi, ancak Vermont'ta Kaliforniya'nın DROP'una denk merkezi bir silme platformu Eylül 2026 itibarıyla bulunmuyor — o eyalette hâlâ simsar simsar elle başvuru gerekiyor. ABD'de yaşıyorsan hangi eyalette olduğun, elindeki gerçek hakları doğrudan belirliyor.

## Veri Kaynağını Nasıl Kapatırsın?

Simsarları temizlemek, musluğu kapatmadan lavaboyu kurulamaya çalışmak gibi; kaynağı da kapatman gerekiyor. Üç nokta öncelikli: people-search sitelerine veri akıtan kamu kayıtlarında (seçmen kaydı, tapu) adresini gizli tutma seçeneğin varsa kullan; sadakat programlarına (market kartları, uçuş mili programları) kayıt olurken üçüncü taraflarla veri paylaşımını reddet; telefonunda reklam kimliğini (iOS'ta "Reklam Takibini Sınırla", Android'de "Reklam Kimliğini Sıfırla/Sil") kapat veya düzenli sıfırla.

Akıllı ev cihazları da bu zincire dahil — üreticiler kullanım verisini genelde üçüncü taraf analitik ve reklam ortaklarıyla paylaşıyor; cihaz uyumluluğu ve gizlilik ayarlarını [Matter standardı ve akıllı ev rehberimizde](/tr/posts/akilli-ev-2026-matter-ve-cihaz-uyumu) daha ayrıntılı ele aldık. Kendi sitene gelen ziyaretçi verisini çerezsiz araçlarla toplamak da aynı mantığın bir parçası; bunu [GA4 alternatifleri yazımızda](/tr/posts/ga4-alternatifleri-gizlilik-odakli-analitik) karşılaştırdık.

## Silinen Kayıtlar Neden Geri Geliyor, Ne Sıklıkla Kontrol Etmelisin?

Simsarlar veriyi bir kez satın alıp saklamıyor; kamu kayıtlarını, kredi başvurularını ve yeni sadakat programı kayıtlarını sürekli yeniden tarıyor. Bu yüzden bugün sildirdiğin bir Whitepages profili, altı ay sonra farklı bir kaynaktan yeniden oluşabiliyor — bu bir hata değil, iş modelinin doğal sonucu.

Pratik çözüm üç ayda bir tekrar eden bir kontrol döngüsü kurmak: adını yeniden Google'da ara, geçen seferki listedeki siteleri tekrar kontrol et, yeni çıkan bir site varsa listeye ekle, ücretli bir servis kullanıyorsan panelindeki "yeniden bulundu" uyarılarını gözden geçir. AI asistanlarının sohbet ve bellek verini nasıl sakladığını da aynı üç aylık ritimde denetlemek mantıklı; bu konuyu [AI asistanları çağında gizliliğini koru](/tr/posts/ai-asistanlari-caginda-gizliligini-koru) yazımızda ayrıca işledik.

## Üç Aylık Gizlilik Temizlik Kontrol Listesi

```text
Her üç ayda bir:
1. Adını tırnak içinde + şehir ile Google'da ara, yeni çıkan siteleri not et.
2. Önceki opt-out taleplerinin tuttuğu 10 siteyi tekrar kontrol et.
3. Sadakat programı ve uygulama izinlerini gözden geçir, gereksiz veri
   paylaşımını kapat.
4. Telefonda reklam kimliğini sıfırla veya takibi sınırlı tut.
5. Kaliforniya'da yaşıyorsan DROP panelinden talep durumunu kontrol et;
   AB/EEA'daysan yanıtsız kalan GDPR taleplerini takip et.
6. Ücretli bir silme servisi kullanıyorsan "yeniden tespit edildi"
   bildirimlerini incele.
```

Bu listeyi çeyrek başına bir kez çalıştırmak simsar başına birkaç dakika alıyor ve verinin sızdığı yeni kaynakları erken yakalamanı sağlıyor. Daha fazla gizlilik ve güvenlik yazısı için [teknoloji kategorimize](/tr/category/teknoloji) göz atabilirsin.

## Sıkça Sorulan Sorular

### Veri simsarlarından çıkmak kalıcı mı?

Hayır. Simsarlar veriyi kamu kayıtları, sadakat programları ve yeni satın almalar üzerinden sürekli yeniden topluyor, bu yüzden sildirdiğin bir profil birkaç ay içinde farklı bir kaynaktan yeniden oluşabiliyor. Kalıcı bir sonuç için üç ayda bir tekrar eden bir kontrol rutini kurman gerekiyor.

### Ücretli veri silme servisi almaya değer mi?

Zamanın kısıtlıysa evet: Incogni ve DeleteMe gibi servisler ayda 5-25 dolara yüzlerce simsara otomatik talep gönderip yeniden görünme durumunu takip ediyor. Ama kapsadıkları listenin dışındaki niş simsarları veya sosyal medya profillerini temizleyemiyorlar, bu yüzden %100 görünmezlik vaat eden hiçbir servis gerçekçi değil.

### GDPR veri simsarlarını da kapsıyor mu?

Evet. GDPR'nin 17. maddesi AB/EEA'da yaşayan herkese kişisel verisinin silinmesini talep etme hakkı veriyor ve bu hak veri simsarları için de geçerli; şirketler talebe en geç bir ay içinde yanıt vermek zorunda. 19. madde ayrıca, verinin paylaşıldığı üçüncü taraf simsarların da bilgilendirilmesini şart koşuyor.

### Kaliforniya'nın DROP sistemi nasıl çalışıyor?

DROP (Delete Request and Opt-Out Platform), 1 Ocak 2026'da devreye giren, tek bir ücretsiz talebi eyalete kayıtlı tüm veri simsarlarına otomatik ileten bir sistem. Simsarların bu talepleri işleme zorunluluğu 1 Ağustos 2026'da başlıyor ve talepleri her 45 günde bir kontrol edip uygulamaları gerekiyor.
