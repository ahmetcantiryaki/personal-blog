---
title: "Claude Skill ve Plugin Güvenlik Taraması Nedir?"
slug: "claude-skill-plugin-guvenlik-taramasi"
translationKey: "claude-skill-plugin-security-scanning"
locale: "tr"
excerpt: "Anthropic, Claude Enterprise'da üçüncü taraf skill ve pluginleri izole ortamda tarayan beta özelliği yayınladı; sonuç geçti, uyarı veya başarısız oluyor."
category: "ai"
tags: ["claude", "ai-agents", "web-security", "best-practices"]
publishedAt: "2026-08-10"
seoTitle: "Claude Skill ve Plugin Güvenlik Taraması"
seoDescription: "Claude Enterprise'ın yeni skill ve plugin güvenlik taraması nasıl çalışır? İzole ortam, pass/warn/fail sonuçları, Claude Security farkı ve kontrol listesi."
---

Claude skill ve plugin güvenlik taraması, Anthropic'in Ağustos 2026'da Claude Enterprise planları için beta olarak yayınladığı otomatik bir kötü amaçlı içerik kontrolüdür. Biri Claude, Claude Cowork veya bir Enterprise plugin marketinde üçüncü taraf bir skill ya da plugin yüklediğinde veya düzenlediğinde devreye girer; içerik izole bir ortamda taranır ve sonuç geçti, uyarı veya başarısız olarak raporlanır.

Kısacası: artık indirdiğiniz bir skill'in içindeki talimatları kör kör güvenmek zorunda değilsiniz. Sistem, o skill'i çalıştırmadan önce arka planda kontrol ediyor.

## Tarama nasıl çalışır?

Mekanizma üç adımdan oluşuyor ve her adımı tasarım açısından anlamlı kılan şey izolasyon.

Bir kullanıcı üçüncü taraf bir skill veya plugin yüklediğinde ya da mevcut birini düzenlediğinde tarama otomatik olarak tetiklenir; ayrı bir onay veya buton gerekmez. İçerik, normal Claude oturumlarından tamamen ayrı tutulan güvenli, izole bir ortamda işlenir — yani taranan kopya, kullanıcının gerçek konuşmalarına veya araç erişimine hiçbir şekilde dokunmaz. Tarama tamamlandığında bu kopya silinir; yalnızca sonuç ve temel meta veriler saklanır. Yani Anthropic'in elinde skill'in kalıcı bir arşivi kalmıyor, sadece "bu skill geçti mi, uyardı mı, başarısız mı oldu" bilgisi kalıyor.

Sonuç üç durumdan biri olur:

| Sonuç | Anlamı | Kullanıcı ne yapabilir? |
|---|---|---|
| Geçti (pass) | İçerikte kötü amaçlı bir örüntü tespit edilmedi | Skill veya plugin normal şekilde kullanılabilir |
| Uyarı (warn) | Şüpheli ama kesin olarak zararlı olmayan bir durum bulundu | Kullanıcı bilgilendirilir, kullanım genelde devam edebilir |
| Başarısız (fail) | Kötü amaçlı içerik tespit edildi | Skill/plugin engellenir, nedeni açıklayan bir banner gösterilir |

Çoğu tarama yaklaşık 1-2 dakikada tamamlanıyor. Sonuçlar önbelleğe alındığı için aynı skill tekrar yüklendiğinde tarama neredeyse anında geri dönüyor — her defasında sıfırdan taramaya gerek kalmıyor.

Bir kullanıcının "başarısız" sonucuyla karşılaştığında gördüğü banner, kabaca şuna benzer bir mesaj taşıyor:

```text
⚠ Bu skill kullanılamıyor
Güvenlik taraması bu içerikte potansiyel olarak kötü amaçlı
talimatlar tespit etti: gizli komut çalıştırma girişimi
(prompt injection) içeren bir bölüm bulundu.

Durum: BAŞARISIZ (fail)
Tarama süresi: 47 saniye
Skill bu hesapta kullanıma kapatıldı.
```

Bu banner önemli, çünkü kullanıcıya sadece "engellendi" demiyor; neden engellendiğini de söylüyor. Kurumsal ortamda bu, güvenlik ekibinin "neden bu araç yasak" sorusuna cevap vermek için saatler harcamasını önlüyor. Özelliğin kurulum ve kapsam detaylarını [Anthropic'in destek makalesinde](https://support.claude.com/en/articles/15927065-get-started-with-skill-and-plugin-scanning) bulabilirsiniz.

## Bu özellik neden şimdi geldi?

Skill ve plugin ekosistemi son bir yılda hızla büyüdü. Bir skill, teknik olarak birinin yazıp paylaştığı, Claude'un bağlamına doğrudan çekilen talimat ve kod paketidir. Sorun şu: üçüncü taraf bir skill kurduğunuzda, aslında incelenmemiş bir kod parçasını ajanınızın davranışına dahil ediyorsunuz — tıpkı denetlenmemiş bir npm paketini projenize eklemek gibi, ama bu sefer risk veriye değil ajanın kendi davranışına yönelik.

Bu, [agentjacking](/tr/posts/agentjacking-yeni-ai-ajan-saldirisi) yazımızda ele aldığımız tedarik zinciri riskinin bir başka yüzü. Orada saldırgan, ajanın güvendiği bir telemetri kanalına zehirli talimat yerleştiriyordu; burada risk kaynağı doğrudan yüklenen skill'in kendisi. İkisi de aynı kök soruna dayanıyor: bir dil modeli için metin talimattır ve o metnin nereden geldiği, modelin gözünde onu otomatik olarak güvenilir hâle getirmiyor. [Açık kaynak güvenliği ve AI çöpü](/tr/posts/ai-copu-acik-kaynak-guvenligi) üzerine yazdığımız içerikte de benzer bir örüntü var: hızla büyüyen bir ekosistemde, "popüler" olmak "güvenli" olmak anlamına gelmiyor.

Anthropic'in tarama özelliğini şimdi çıkarması tesadüf değil; marketplace büyüdükçe incelenmemiş içerik hacmi de büyüyor ve kurumsal müşteriler için bu artık göz ardı edilebilir bir risk değil.

## Claude Security ile karıştırmayın

Anthropic'in aynı dönemde duyurduğu ikinci bir güvenlik ürünü daha var: Claude Security. Bu, farklı bir problemi çözüyor ve ikisini birbirine karıştırmamak önemli.

| Özellik | Skill/Plugin Güvenlik Taraması | Claude Security |
|---|---|---|
| Ne tarıyor | Yüklenen/düzenlenen skill ve plugin içeriği | Kod tabanları (codebase) |
| Tetikleyici | Otomatik, yükleme veya düzenleme anında | Manuel veya entegre çalıştırma |
| Yöntem | İzole ortamda kötü amaçlı içerik tespiti | Çok ajanlı analiz; dosyalar arası veri akışını izler |
| Bulduğu şey | Prompt injection, gizli talimat, kötü amaçlı davranış kalıpları | Karmaşık, çok bileşenli güvenlik açıkları |
| Durum | Beta, Claude Enterprise | Genel beta (public beta), Claude Enterprise |

Kısacası: skill/plugin taraması "bu talimat paketi güvenilir mi" sorusuna cevap veriyor, Claude Security ise "bu kod tabanında açık var mı" sorusuna. Biri ajanın kendi davranışını korumaya, diğeri sizin yazdığınız (veya bakımını yaptığınız) kodu korumaya odaklanıyor. [Claude Security'nin ürün sayfasına](https://claude.com/product/claude-security) göre araç, kod tabanınızda çalışıp bağlamı anlayan çok ajanlı bir yaklaşım kullanıyor; [MarkTechPost'un incelemesi](https://www.marktechpost.com/2026/07/22/anthropic-releases-claude-security-plugin-for-claude-code-in-beta-a-multi-agent-vulnerability-scanner-that-runs-in-your-terminal/) ise ayırt edici yanının, geleneksel statik tarayıcıların kaçırdığı, birden fazla dosyayı ilgilendiren veri akışı örüntülerini yakalayabilmesi olduğunu vurguluyor.

## Sınırları ve gerçekçi beklentiler

Burada iyimserliği biraz frenlemek gerekiyor. Özellik şu an yalnızca Claude Enterprise planlarında, hâlâ beta aşamasında. Yani bireysel kullanıcılar veya Pro planındakiler için bu koruma yok — en azından şimdilik.

Daha önemlisi: bu bir gümüş kurşun değil. Otomatik tarama, bilinen kötü amaçlı örüntüleri ve açık prompt injection girişimlerini yakalamakta iyi olabilir, ama incelikle gizlenmiş, bağlama özgü kötü niyetli talimatları her zaman yakalayacağının garantisi yok. "Geçti" sonucu, "bu skill'i asla incelemenize gerek yok" anlamına gelmiyor; sadece bilinen tehlike sinyallerinin görülmediği anlamına geliyor. Kurumsal ekiplerin, kritik iş akışlarında kullanacakları üçüncü taraf skillleri kendi güvenlik süreçlerinden de geçirmesi hâlâ makul bir alışkanlık.

Açıkçası, bu türden otomatik taramaların asıl değeri "her şeyi yakalamak" değil, düşük maliyetli, hızlı bir ilk filtre sağlamak — insan incelemesinin yerini almak yerine onu daha az sıklıkta ve daha odaklı hâle getirmek. Bu çerçeveyle bakıldığında özellik gerçekten faydalı; "artık güvenlik ekibine ihtiyacım yok" çerçevesiyle bakıldığında yanıltıcı.

## Ekipler için pratik kontrol listesi

Üçüncü taraf skill ve plugin kullanan ekipler için birkaç somut adım:

- **Enterprise admin ayarlarını kontrol edin**: Taramanın hesabınızda etkin olduğundan emin olun; beta özellikler bazen kademeli olarak açılıyor.
- **"Uyarı" sonuçlarını görmezden gelmeyin**: Fail kadar dramatik değil ama warn sonucu genelde bir nedenle geliyor; en azından kısa bir manuel gözden geçirme hak ediyor.
- **Kritik iş akışlarına skill eklemeden önce kaynağını doğrulayın**: Tarama sonucu ne olursa olsun, geliştiricinin itibarı ve kod geçmişi hâlâ anlamlı bir sinyal.
- **[Kaçak ajan davranışlarına](/tr/posts/claude-code-kacak-ajanlara-fren) karşı ayrı korumaları da elden bırakmayın**: Skill taraması giriş noktasını korur; çalışma zamanı davranış sınırları ayrı bir katmandır.
- **Codebase'lerinizi Claude Security ile de tarayın**: Skill taraması ile codebase taraması birbirinin yerine geçmiyor, ikisi tamamlayıcı.
- **Geçmiş güvenlik olaylarından ders çıkarın**: [Claude Code'daki friendly-fire açığı](/tr/posts/friendly-fire-claude-code-guvenlik-acigi) gibi vakalar, ajan tabanlı araçlarda "yetkili görünen" her adımın güvenli olmadığını hatırlatıyor.

Daha geniş model ve araç seçimi bağlamında karar veriyorsanız [2026 için Claude model rehberimiz](/tr/posts/hangi-claude-modeli-2026-rehberi) hangi planın hangi güvenlik özelliklerine eriştiğini değerlendirirken faydalı bir referans olabilir. Yapay zeka gündemindeki diğer gelişmeler için [Yapay Zeka](/tr/category/yapay-zeka) kategorimize göz atabilirsiniz.

## Sıkça Sorulan Sorular

### Claude skill ve plugin güvenlik taraması hangi planlarda var?

Şu an yalnızca Claude Enterprise planlarında ve beta aşamasında. Claude, Claude Cowork ve Enterprise plugin marketlerini kapsıyor; Pro veya ücretsiz kullanıcılar için henüz mevcut değil.

### Tarama sonucu "uyarı" (warn) çıkarsa ne olur?

Skill veya plugin genelde kullanılmaya devam edilebilir, ama kullanıcı şüpheli bir durumun tespit edildiği konusunda bilgilendirilir. "Başarısız" (fail) sonucundan farklı olarak warn, kullanımı otomatik olarak engellemez; daha çok dikkatli olun sinyali verir.

### Skill/plugin güvenlik taraması ile Claude Security aynı şey mi?

Hayır. Skill/plugin taraması, yüklenen veya düzenlenen üçüncü taraf skill ve pluginlerin içeriğini kötü amaçlı talimat açısından kontrol ediyor. Claude Security ise ayrı bir ürün; kod tabanlarınızı çok ajanlı bir yaklaşımla tarayıp dosyalar arası veri akışlarını izleyerek karmaşık güvenlik açıklarını buluyor. İkisi farklı riskleri hedefliyor ve birbirinin yerine geçmiyor.

### Bu tarama, kötü amaçlı her skill'i yakalar mı?

Hayır ve bunu böyle varsaymamak önemli. Otomatik tarama bilinen kötü amaçlı örüntüleri ve açık prompt injection girişimlerini yakalamada etkili olabilir, ama her incelikli tehdidi garanti olarak tespit edeceğinin bir taahhüdü yok. Özellikle kritik iş akışlarında kullanılacak skiller için kendi ekip içi gözden geçirmenizi de sürdürmeniz mantıklı.
