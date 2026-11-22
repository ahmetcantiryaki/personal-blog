---
title: "Claude Code Easel Nedir? Terminalde Grafik Çizme"
slug: "claude-code-easel-grafik"
translationKey: "claude-code-easel-charts-2026"
locale: "tr"
excerpt: "Easel, Claude Code 2.1.330'la gelen yerleşik moddur: isteyince veya MCP metrik sonuçlarında grafik çizer; Pro, Max, Team ve Enterprise'da çalışır."
category: "software-engineering"
tags: ["claude", "ai-tools", "developer-experience", "automation"]
publishedAt: "2026-11-22"
seoTitle: "Claude Code Easel: Terminalde Otomatik Grafik Çizimi"
seoDescription: "Claude Code 2.1.330'daki Easel modu, isteğiniz üzerine veya MCP metrik sonuçlarında grafik çiziyor. Hangi planlarda çalıştığını, kapatmayı anlatıyoruz."
---

Easel, Claude Code'un 20 Kasım 2026'da çıkan 2.1.330 sürümüyle gelen yerleşik bir moddur: "bunu grafikle" dediğinizde veya bir MCP sunucusundan metrik sonucu geldiğinde terminalde otomatik olarak çizer. Pro, Max ve (varsa) Team ile Enterprise planlarında, macOS ve Linux'ta çalışır; otomatik çizimi `/config` üzerinden kapatabilirsiniz.

Özellik, [resmi değişiklik günlüğünde](https://code.claude.com/docs/en/changelog) şöyle tanımlanıyor: "Easel eklendi; istendiğinde ve MCP metrik sonuçları altında grafik çizen yerleşik bir mod, Pro, Max ve uygunsa Team ve Enterprise'da, macOS ve Linux'ta; otomatik grafikleri `/config`'den kapatın." Aynı sürümde iki ilgili düzeltme de geldi: MCP izin listesi Easel'i engellediğinde her başlangıçta gösterilen gereksiz uyarı giderildi, ve Easel'in Code Mode içinde çağrıldığında başarısız olma hatası onarıldı.

## Easel tam olarak ne yapıyor?

Easel, terminal içinde çalışan bir grafik çizim aracıdır: ona doğal dille "şunu çizdir" dediğinizde ya da bir MCP sunucusu metrik verisi döndürdüğünde, Claude Code bu veriyi otomatik olarak bir grafiğe dönüştürür. Önceden ayrı bir görselleştirme kütüphanesi kurmanıza, veriyi bir dosyaya yazıp başka bir araca aktarmanıza gerek kalmıyor; grafik doğrudan oturumda beliriyor.

## Easel ne zaman otomatik devreye giriyor?

İki tetikleyici var: siz açıkça isteğinizde ("bu sonucu grafikle göster" gibi) ya da bir MCP sunucusunun döndürdüğü metrik sonucu grafiğe uygun bir yapıdaysa. İkinci durumda Claude Code sizden onay beklemeden otomatik çizim yapar; bu davranışı istemiyorsanız kapatmanız gerekir.

## Easel hangi planlarda ve işletim sistemlerinde çalışıyor?

Easel, Pro ve Max planlarında doğrudan çalışıyor; Team ve Enterprise'da ise "uygunsa" kaydıyla sunuluyor, yani kurumsal politika Easel'i engelleyebiliyor. Platform tarafında şu an için sadece macOS ve Linux destekleniyor; Windows değişiklik günlüğünde anılmıyor. Kurumsal bir MCP izin/engel listesi Easel'i dışarıda bırakırsa, 2.1.330 öncesinde her oturum başında gereksiz bir "enterprise policy" uyarısı çıkıyordu; bu artık düzeltildi, araç sessizce engelli kalıyor.

## Otomatik grafikleri nasıl kapatırım?

Otomatik çizimi `/config` komutuyla kapatabilirsiniz. Değişiklik günlüğü kesin bayrak adını vermiyor, ama davranış açık: `/config` ekranında Easel'in otomatik tetiklenmesini kontrol eden bir seçenek var ve bunu kapattığınızda Easel yalnızca siz açıkça istediğinizde çalışıyor, MCP sonuçlarında kendiliğinden devreye girmiyor.

```text
# /config ekranında Easel ile ilgili seçeneği bulup kapatın;
# ardından grafik yalnızca açıkça istediğinizde çizilir:
> bu test süresi verisini grafikle göster
```

## MCP metrikleriyle Easel'i ne için kullanırım?

Easel'in en pratik kullanım alanı, zaten MCP üzerinden akan sayısal veriyi anlamlandırmak. Üç örnek:

- **Token harcaması**: Bir faturalama veya kullanım MCP sunucusu günlük/haftalık token tüketimini döndürdüğünde, Easel bunu otomatik bir çizgi grafiğe çeviriyor; ayrı bir panoya bakmadan harcama eğilimini görebiliyorsunuz.
- **Test süreleri**: CI/test MCP entegrasyonu test sürelerini döndürdüğünde, hangi test paketinin yavaşladığını bir bar grafikle anında fark edebiliyorsunuz.
- **Log sayıları**: Gözlemlenebilirlik MCP sunucusundan gelen hata/log sayıları, zaman içindeki artışı görsel olarak ortaya koyuyor.

| Senaryo | Easel öncesi | Easel ile |
|---|---|---|
| Token harcaması takibi | Ayrı panoya geçiş veya CSV dışa aktarma | Terminalde otomatik çizgi grafik |
| Test süresi analizi | Log'u gözle tarama | MCP sonucundan otomatik bar grafik |
| Log/hata sayımı | Harici izleme aracı | Terminalde anında görsel |
| Devre dışı bırakma | Mevcut değildi | `/config`'den tek adımda |

Bu tablonun gösterdiği şey basit: Easel yeni bir veri kaynağı eklemiyor, zaten elinizde olan MCP verisini bir ekstra adım harcamadan görünür kılıyor. Bu, Anthropic'in son aylarda [Claude.ai sohbet arayüzüne eklediği etkileşimli grafik çizme özelliğiyle](https://claude.com/blog/claude-builds-visuals) aynı yöne işaret ediyor — farklı bir ürün, farklı bir uygulama, ama aynı strateji: veriyi görselleştirmeyi ekstra bir araç gerektirmeyen, isteğe bağlı bir özellik haline getirmek.

Açıkçası bu, [MCP görevlerini arka planda çalıştırma](/tr/posts/claude-code-mcp-gorevleri-arka-planda) ve [zamanlanmış görevler](/tr/posts/claude-zamanlanmis-gorevler-otomasyon) gibi son aylardaki eklemelerle aynı çizgide: Claude Code, terminalin "sadece komut çalıştıran" bir araç olmaktan çıkıp iş akışının merkezi haline geldiği bir evreye giriyor. Easel'in kendisi devrim niteliğinde değil ama "bu sayıyı görmek için başka bir sekme açma" sürtünmesini ortadan kaldırması, günlük kullanımda hissedilir bir fark yaratıyor.

## Easel'i ayrı bir grafik kütüphanesinden ayıran ne?

Easel bir grafik kütüphanesi değil, bir veri yönlendirme kısayolu. Normalde bir metrik sonucunu görselleştirmek isterseniz üç adım gerekir: veriyi bir dosyaya ya da panoya aktarmak, bir çizim aracı (matplotlib, bir pano sistemi, bir tablolama aracı) açmak ve veriyi o araca uygun biçime sokmak. Easel bu üç adımı tek adıma indiriyor: veri zaten terminaldeki bir MCP yanıtında ya da sizin isteğinizde duruyor, Easel onu olduğu yerde çiziyor. Bu, kalıcı bir rapor üretmek için yeterli değil — Easel'in çıktısı terminal oturumuna bağlı, dışa aktarılabilir bir dosya değil — ama "şu anda bu sayıları anlamak istiyorum" sorusuna anında cevap veriyor.

Bu ayrım önemli çünkü Easel'i yanlış işe koşmak kolay. Bir yönetim kuruluna sunulacak kalıcı bir pano istiyorsanız Easel yanlış araç; bir CI çalıştırmasının test sürelerini şu anda anlamak istiyorsanız doğru araç. İkisini karıştırmamak, aracın değerini doğru yerde kullanmanızı sağlıyor.

## Easel kurumsal ortamlarda nasıl kısıtlanıyor?

Enterprise ve Team planlarında Easel "uygunsa" sunuluyor; bu, kurum yöneticisinin MCP sunucu izin/engel listesi üzerinden Easel'i tamamen kapatabileceği anlamına geliyor. [Claude Code'da MCP sunucularını yönetme](/tr/posts/claude-code-mcp-sunucularini-nasil-yonetirsin) rehberinde anlattığımız izin listesi mantığı burada da geçerli: Easel yerleşik bir araç olduğu için ayrı bir sunucu gibi eklenmez, ama aynı izin/engel mekanizmasından geçer. 2.1.330 öncesinde bu engelleme her oturum başında gereksiz bir uyarıyla kendini gösteriyordu; artık sessizce devre dışı kalıyor.

## Aynı sürümde gelen diğer değişiklikler neden önemli?

2.1.330, sadece Easel'den ibaret değil; aynı sürüm zamanlanmış görevler ve `/loop` için önemli bir sınırı da kaldırıyor. Değişiklik günlüğü şöyle diyor: "tekrarlayan zamanlanmış görevleri ve `/loop`'u, oturumları çalışır kaldığı sürece 7 gün yerine 30 gün çalışacak şekilde değiştirdi ve ne zaman sona ereceklerini belirtti; bu sürümden önce oluşturulan görevler hâlâ 7 günde sona eriyor." Bu, [Claude ile zamanlanmış görevler](/tr/posts/claude-zamanlanmis-gorevler-otomasyon) kuran ekipler için doğrudan bir kapasite artışı: haftalık bir rapor görevi artık bir ay boyunca kesintisiz çalışabiliyor.

Sürümün üçüncü büyük eklentisi, Anthropic'in Enterprise Admin Console'unda yönetilen organizasyonlara oturum açma desteği: `claude auth login` sonrasında Claude Code artık organizasyonun ayarlarını uyguluyor ve onun bulut sağlayıcısını veya ağ geçidini kullanıyor. Bu üç değişiklik birlikte okunduğunda ortaya çıkan tablo şu: Anthropic, Claude Code'u bireysel bir "sohbet + kod" aracından, kurumsal otomasyonun arka planda sürekli çalıştığı bir platforma doğru genişletiyor. Easel bu genişlemenin görünür, günlük kullanıcıya en çok hissettiren parçası; zamanlanmış görev süresinin uzaması ve Enterprise Admin Console desteği ise arka planda çalışan, ama uzun vadede daha büyük etkisi olacak parçalar.

Pratik sonucu şu: Easel'i bugün deneyen bir geliştirici için en büyük fayda, zaten topladığı MCP verisini bir araç değiştirmeden okuyabilmesi. Ama bu üç değişikliğin birlikte geldiğini bilmek, Claude Code'un hangi yöne evrildiğini — bireysel üretkenlik aracından sürekli çalışan otomasyon katmanına — görmek isteyen ekipler için daha değerli bir sinyal.

## Sıkça Sorulan Sorular

### Claude Code Easel hangi sürümle geldi?

Easel, 20 Kasım 2026'da yayımlanan Claude Code 2.1.330 sürümüyle geldi. Aynı sürümde Enterprise Admin Console'a oturum açma desteği ve zamanlanmış görevlerin/`/loop`'un süresinin 7 günden 30 güne çıkarılması da yer aldı.

### Easel hangi planlarda kullanılabilir?

Easel, Pro ve Max planlarında doğrudan sunuluyor; Team ve Enterprise'da "uygunsa" kaydıyla, yani kurumsal MCP izin/engel listesi politikasına bağlı olarak. Platform tarafında şu an macOS ve Linux destekleniyor.

### Easel'in otomatik grafik çizmesini nasıl durdururum?

`/config` ekranına girip Easel'in otomatik tetiklenmesini kontrol eden seçeneği kapatmanız yeterli. Bunu yaptığınızda Easel yalnızca siz doğrudan "grafikle" dediğinizde çalışır, MCP metrik sonuçlarında kendiliğinden devreye girmez.

### Easel, Code Mode içinde çalışır mı?

Evet; 2.1.330'dan önce Easel'in Code Mode içinden çağrıldığında başarısız olduğu bir hata vardı, bu sürümle düzeltildi. Artık Code Mode içindeki bir komut dizisi Easel'i çağırdığında da normal şekilde grafik üretiyor.

### Easel'in çizdiği grafikleri dışa aktarabilir miyim?

Değişiklik günlüğü bunu açıkça belirtmiyor; Easel'in tanımı "terminalde çizen" bir mod olarak geçiyor, kalıcı dosya üretimi değil. Pratikte bu, Easel'i anlık analiz için kullanmanız, paylaşılacak bir rapor için ise ekran görüntüsü almanız veya veriyi ayrı bir araca aktarmanız gerektiği anlamına geliyor.
