---
title: "Geliştiricilerin %96'sı AI Koduna Güvenmiyor: Çözüm"
slug: "ai-koduna-guven-inceleme-akisi"
translationKey: "ai-code-review-workflow-trust-2026"
locale: "tr"
excerpt: "Sonar'ın 2026 anketine göre geliştiricilerin %96'sı AI'nın ürettiği kodun doğruluğuna tam güvenmiyor; dört aşamalı bir inceleme akışı bu açığı kapatıyor."
category: "software-engineering"
tags: ["ai-coding", "code-quality", "best-practices", "testing"]
publishedAt: "2026-11-23"
seoTitle: "AI Kodu İnceleme Akışı: Hangi Sırayla Ne Kontrol Edilir?"
seoDescription: "Sonar'ın 2026 anketine göre geliştiricilerin %96'sı AI'nın ürettiği kodun doğruluğuna tam güvenmiyor; dört aşamalı bir inceleme akışı bu açığı kapatıyor."
---

Kısa cevap: Dört aşamalı bir kapı kurun: otomatik test ve lint, diff'e odaklı insan incelemesi, bilinçli bir "bunu nasıl bozarım" geçişi ve PR'a eklenen tek satırlık bir köken (provenance) notu. Sonar'ın 1.100'den fazla geliştiriciyi kapsayan 2026 State of Code anketine göre geliştiricilerin %96'sı AI'nın ürettiği kodun işlevsel doğruluğuna tam güvenmiyor; ama yalnızca %48'i commit'ten önce her zaman inceleme yaptığını söylüyor. Asıl risk AI'nın kendisi değil, bu açık.

## Geliştiriciler AI kodunu neden güvenmiyor?

Geliştiriciler AI kodundan şüphe duyuyor çünkü kod yanlış olsa bile akıcı ve kendinden emin görünüyor; Sonar'ın katılımcılarının %38'i AI kodunu incelemenin bir meslektaşın kodunu incelemekten daha fazla efor gerektirdiğini söylüyor. Bir model, yanlış parametre sırasıyla bir API çağıran, bir hatayı sessizce yutan veya bir insanın içgüdüyle fark edeceği bir kenar durumu kaçıran ama görünüşte makul bir diff üretebilir.

Bu, junior bir geliştiricinin hatasından farklı bir bozulma türü. Junior'ın hatası genelde bitmemiş görünür — eksik bir null kontrolü, bariz bir yazım hatası. AI'nın hatası çoğu zaman *bitmiş* görünür: tutarlı stil, makul değişken adları, kodun gerçekte yapmadığı bir davranışı kendinden emin bir şekilde anlatan bir docstring. Bu cila, tam olarak incelemede göz ardı etmeyi kolaylaştıran şey.

## Aşamalı bir AI kodu inceleme akışı nasıl görünür?

Aşamalı bir akış, ucuz ve mekanik kontrolleri önce, maliyetli insan muhakemesini en sona koyar; böylece otomatikleştirilebilir sorunlar zaten temizlenmeden hiçbir şey bir insanın dikkatine ulaşmaz.

1. **Otomatik kapı.** Kimse diff'e bakmadan önce test paketini, tip denetleyicisini ve linter'ı çalıştırın. Geçmiyorsa incelenmez — bu adım, AI kaynaklı regresyonların büyük bir kısmını bedavaya yakalar.
2. **Diff'e odaklı insan incelemesi.** İnceleyici, PR açıklamasını değil gerçek diff'i okur ve değişikliğin iddia ettiğini yaptığını, ticket'la eşleştiğini kontrol eder. Bu adımın tek başına Sonar'ın bulgusunu yansıttığını unutmayın: geliştiricilerin yalnızca %48'i bunu her zaman yapıyor — bunu isteğe bağlı değil varsayılan hale getirmek en yüksek etkili tek düzeltme.
3. **"Bunu nasıl bozarım" geçişi.** Onaylamadan önce inceleyici, değişikliği bozmaya çalışmak için beş dakika ayırır: yanlış girdi tipleri, boş diziler, tekrarlanan bir istek, kimsenin beklemediği ikinci bir çağıran. Bu adım özellikle AI'nın yazdığı kodun mutlu yolu (happy path) iyi, kenar durumları kötü idare etme eğiliminde olması yüzünden var.
4. **Köken notu.** PR açıklaması, hangi kısımların AI tarafından üretildiğini, hangilerinin elle yazıldığını belirtir. Bu bir bürokrasi değil — altı ay sonra bu koda dokunacak bir sonraki geliştiriciye tam olarak ekstra dikkatin nereye gideceğini söyler.

| Aşama | Yakaladığı | Maliyet |
|---|---|---|
| Otomatik kapı | Sözdizimi hataları, kırık testler, tip ihlalleri | Her commit'te saniyeler |
| Diff'e odaklı okuma | Niyetle uyuşmayan mantık, kapsam kayması | Her PR'da dakikalar |
| Adversarial geçiş | Kenar durumlar, hata yönetimi boşlukları | Her PR'da 5-10 dakika |
| Köken notu | Doğrudan hiçbir şey — sonraki inceleme önceliğini işaretler | Bir dakikadan az |

## İnsan dikkati gerçekte nereye gitmeli?

İnsan dikkati, AI'nın kendine güveniyle AI'nın doğruluğu arasındaki korelasyonun en zayıf olduğu yerlere gitmeli: mimari kararlar, güvenliğe hassas kod yolları ve para veya kullanıcı verisine dokunan her şey. Yeniden adlandırılmış bir değişkene ve yeni bir kimlik doğrulama kontrolüne aynı beş dakikayı harcayan bir inceleyici, aşamalı incelemenin korumaya çalıştığı tek kaynağı — dikkati — yanlış dağıtıyor.

Pratikte işe yarayan basit bir kural var: AI'nın ürettiği değişiklik sadece bir insanın zaten tasarladığı kodu yeniden düzenliyor veya genişletiyorsa, adversarial geçiş daha hafif olabilir. AI yaklaşımı kendisi tasarladıysa — kütüphaneyi seçtiyse, algoritmayı belirlediyse, hataların nasıl yayılacağına karar verdiyse — adversarial geçiş zorunludur ve teslim tarihi baskısıyla atlanmamalıdır.

```text
# PR şablonu köken satırı
AI tarafından üretildi: auth middleware refaktörü (mantık), hata yönetimi dalı
Elle yazıldı: route bağlantıları, test fixture'ları
İnceleme odağı: hata yönetimi dalı — yeni retry mantığı, önceden test kapsamı yok
```

## Bu akışın gerçekten işe yarayıp yaramadığı nasıl ölçülür?

Kaynağına göre kaçan hata (escaped-defect) oranını takip edin — production'da bulunan ve AI'nın yazdığı koda mı yoksa insanın yazdığı koda mı kadar izlenebildiğini — toplam hata sayısını değil, çünkü ham sayı size inceleme akışınızın hataların az olmasının sebebi olup olmadığını söylemez. Ayrıca hangi PR oranının adversarial geçişi aldığını, hangilerinin doğrudan merge'e gittiğini takip edin; teslim tarihleri sıkıştığında bu oran düşüyorsa, akış süslemeden ibaret, gerçek değil.

İkinci yararlı metrik, AI işaretli bir PR başına inceleme süresinin tamamen insan PR'larıyla kıyaslanması. AI'nın ürettiği PR'lar insan PR'larından *daha az* inceleme süresi alıyorsa, bu AI kodunun daha az dikkat gerektirdiğinin sinyali değil, ikinci adımdaki diff'e odaklı okumanın gerçekten yapılmadığının sinyalidir. Bunu manuel disipline güvenmek yerine CI'a gömmek isteyen ekipler için [CI'da Claude Code Review ile PR kapısı kurmak](/tr/posts/cida-claude-code-review-ile-pr-kapisi-kurun), otomatik-kapı aşamasını bir insanın hatırlamasına gerek kalmadan zorunlu kılmanın bir yolunu gösteriyor.

Dürüst görüşüm: köken notları bir ekibin benimsediği ilk hafta angarya gibi görünür, dördüncü haftada ise birisi bir hata bulup not ona nereye önce bakacağını tam olarak söylediğinde PR şablonunun en çok başvurulan satırı haline gelir.

Bu aşamalı yaklaşım, kasıtlı olarak "AI inceleme araçları ne yakalar, neyi kaçırır" sorusundan daha dar; o daha geniş yetenek sorusu için [AI ile kod incelemesi: güven ama doğrula](/tr/posts/ai-ile-kod-incelemesi-guven-dogrula) yazısına bakabilirsiniz. Ayrıca bu akışın yerini almadığı, varsaydığı temellerle de iyi eşleşiyor: [etkili kod incelemesi nasıl yapılır](/tr/posts/etkili-kod-incelemesi).

## Bu akışı küçük bir ekipte nasıl başlatırsınız?

Dört aşamanın hepsini aynı gün zorunlu kılmaya çalışmayın; en ucuz ve en yüksek etkili adımdan başlayın. İlk hafta sadece otomatik kapıyı CI'a bağlayın ve PR şablonuna köken notu alanını ekleyin — bunların ikisi de insan davranışını değiştirmeyi gerektirmez, sadece araçsal bir değişikliktir. İkinci hafta, diff'e odaklı okumayı PR şablonunda bir onay kutusuna dönüştürün ("Diff'i PR açıklamasını değil satır satır okudum") ki inceleyici bunu atlamanın maliyetini görsün.

Adversarial geçişi zorunlu kılmak en zor adım, çünkü zaman alıyor ve faydası hemen görünmüyor. Bunu kolaylaştırmanın bir yolu, inceleyiciye beş dakikalık bir kontrol listesi vermek: "Bu girdi boş gelirse ne olur? İkinci bir çağıran olursa ne olur? Ağ isteği başarısız olursa ne olur?" Bu üç soruyu her AI kaynaklı PR'da sormak, adversarial geçişin kendiliğinden bir alışkanlığa dönüşmesini sağlar; haftalar içinde inceleyiciler bu soruları ezbere sormaya başlar ve listeye ihtiyaç kalmaz.

Birincil kaynaklar: [Sonar'ın 2026 State of Code Developer Survey'i](https://www.sonarsource.com/resources/developer-survey-report/) ve [Built In'in %96 güven rakamına dair haberi](https://builtin.com/articles/ai-coding-tools-engineer-career-development).

## Sıkça Sorulan Sorular

### Geliştiriciler AI'nın ürettiği koda neden güvenmiyor?

Sonar'ın 1.100'den fazla geliştiriciyi kapsayan 2026 anketi, geliştiricilerin %96'sının AI'nın ürettiği kodun işlevsel doğruluğuna tam güvenmediğini buldu; bunun temel sebebi kodun ince mantık hataları veya kaçırılmış kenar durumlar içerse bile cilalı ve kendinden emin görünmesi, oysa bir insanın daha kaba görünen kodu bunu bu kadar iyi gizleyemiyor olması.

### AI'nın ürettiği PR'lar için bir kod inceleme akışı neler içermeli?

Sırayla dört aşama içermeli: herhangi bir insan bakmadan önce otomatik bir kapı (testler, tipler, lint), niyeti uygulamayla karşılaştıran diff'e odaklı bir insan incelemesi, değişikliği bozmaya çalışan kısa bir adversarial geçiş ve hangi kısımların AI tarafından üretildiğini belirten bir köken notu.

### Geliştiriciler AI'nın ürettiği kodu commit'ten önce gerçekten inceliyor mu?

Tutarlı bir şekilde değil — Sonar'ın 2026 anketi, geliştiricilerin yalnızca %48'inin commit'ten önce AI'nın ürettiği veya AI destekli kodu her zaman incelediğini söylediğini buldu; bu da yarıdan fazlasının incelemeyi bazen tamamen atladığı anlamına geliyor — aşamalı, önce-otomatik bir iş akışının tam olarak kapatmaya çalıştığı açık bu.

### AI'nın ürettiği kodu incelemek insan kodunu incelemekten daha mı zor?

Genellikle evet — Sonar'ın 2026 anketinde geliştiricilerin %38'i AI'nın ürettiği kodu incelemenin bir meslektaşın yazdığı kodu incelemekten daha fazla efor gerektirdiğini söyledi; bunun büyük sebebi AI çıktısının tutarlı stilinin ve kendinden emin tonunun mantık hatalarını gözden kaçırmayı kolaylaştırması.
