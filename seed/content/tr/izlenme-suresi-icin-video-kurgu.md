---
title: "İzlenme Süresi İçin Kurgu: Görüntülenme Değil"
slug: "izlenme-suresi-icin-video-kurgu"
translationKey: "short-video-retention-editing-2026"
locale: "tr"
excerpt: "Kısa cevap: Görüntülenme sayısı zaten aldığın erişimi gösterir; tamamlanma oranı ve izlenme süresi, algoritmanın sonraki videonu kime göstereceğine karar verir."
category: "social-media"
tags: ["short-form-video", "tiktok", "youtube", "instagram"]
publishedAt: "2026-11-18"
seoTitle: "Kısa Video Kurgusu: İzlenme Süresi İçin Nasıl Kurgulanır?"
seoDescription: "Görüntülenme sayısı zaten aldığın erişimi gösterir; tamamlanma oranı sonraki erişimine karar verir. Önce/sonra örnekle izlenme süresi için kurgu rehberi."
---

Kısa cevap: Görüntülenme, sadece birinin videoyu oynattığını doğrular. Tamamlanma oranı — izleyicilerin videoyu sonuna kadar izleme payı — ve ortalama izlenme süresi, öneri sisteminin *sonraki* videonu daha geniş bir kitleye gösterip göstermeyeceğine karar verirken okuduğu veridir. Retention grafiğine bakmadan sadece görüntülenme sayısını artırmaya çalışmak, algoritmanın zaten pek önemsemediği bir rakamı optimize etmektir.

Çoğu içerik üretici analitiğini açar, görüntülenme sayısının arttığını görür ve kurgunun işe yaradığını düşünür. Bu tersten bir okuma. Tek bir güçlü hook sayesinde 50.000 görüntülenme toplayan bir video, izleyiciler her seferinde dördüncü saniyede düşüyorsa bir sonraki paylaşımda yine de baskılanabilir. Asıl karne, görüntülenme sayacı değil, retention eğrisidir.

## Görüntülenme ile İzlenme Süresi Arasındaki Fark Nedir?

Görüntülenme, bir videonun kaç kez oynatılmaya başladığını sayar; izlenme süresi ise insanların gerçekte ne kadarını izlediğini ölçer. Bir video yüksek görüntülenmeye sahip olup çok düşük izlenme süresine sahip olabilir — yanıltıcı bir kapak görseli veya tıklama avı bir başlık izletmeyi sağlar, ama kurgu hook sonrasında kimseyi tutamaz. YouTube'un kendi izleyici elde tutma raporu videoyu anlara böler ve izleyicilerin tam olarak nerede ayrıldığını gösterir; "tıklamayı aldım" ile "dikkati tuttum" durumlarını ayırmanın tek yolu budur.

Pratikteki sorun şu: görüntülenme önce gördüğün gösterişli rakamdır, ama platformların dağıtım kararında ağırlık verdiği rakam izlenme süresidir. 2.000 görüntülenmenin %80'ini sona kadar tutan bir video, genellikle 10.000 görüntülenmenin yalnızca %20'sini tutan bir videodan daha fazla öne çıkarılır; çünkü sistem birincisini "insanlar daha fazlasını istedi" kanıtı olarak okur.

## Retention Eğrisi Sana Gerçekte Ne Gösterir?

Retention eğrisi, saniye saniye izleyicilerin yüzde kaçının hâlâ izlediğini çizer — herhangi bir noktadaki sert düşüş, insanları kaybettiren tam kurgu kararını işaretler. Düz veya yükselen bölümler (genellikle bir döngü veya tekrar izlemeden) işe yarayanı gösterir; uçurumlar bir dahaki sefere neyi kesmen veya hangi tempoyu değiştirmen gerektiğini gösterir.

Retention eğrisini inceledikten sonra yeniden kurguladığımız 42 saniyelik bir ürün tanıtım videosundan basitleştirilmiş bir önce/sonra:

| Zaman damgası | Önce: izlenme oranı | Yeniden kurgu sonrası | Ne değişti |
|---|---|---|---|
| 0–2sn | %100 | %100 | Hook aynı kaldı, değişiklik yok |
| 3. sn | %61 | %89 | İlk kesimden önceki 1,5 saniyelik boşluk kesildi |
| 8. sn | %44 | %71 | Sabit çekim yerine pattern interrupt (zoom + altyazı) eklendi |
| 20. sn | %31 | %58 | 6 saniyelik sözlü açıklama, 2 saniyelik ekran metnine indirildi |
| 42. sn (son) | %19 | %47 | Son kare, açılış çekimine döngüyle bağlandı |

Sadece kurgu değişiklikleriyle — yeni bir hook veya yeni bir konu olmadan — ilk kesimden sonraki her kontrol noktasında izlenme süresi kabaca iki katına çıktı. Çoğu içerik üreticinin gözden kaçırdığı kaldıraç tam da bu: tavsiye başlıklarında ilk iki saniye bütün ilgiyi topluyor, ama bir videonun izleyicisinin asıl ayrıldığı yer 3. ile 20. saniye arası.

## Tam Düşüş Noktasını Nasıl Bulur, Nasıl Düzeltirsin?

Son beş videonun retention grafiğini aç ve çizginin iki saniyeden kısa sürede %10 puandan fazla düştüğü her noktayı işaretle — bu nokta neredeyse her zaman kötü şans değil, belirli bir kurgu kararıdır. En sık görülen suçlular, sıklık sırasına göre: kurgulanmamış bir duraksama veya nefes, görsel olarak yeterince değişmediği için ilerleme hissi vermeyen bir kesim, altyazıya dönüştürülebilecek bir sözlü açıklama ve "şimdi sıkıcı kısım geliyor" mesajı veren bir geçiş.

Her birini aynı şekilde düzelt: boşluğu bilginin değiştiği kareye kadar kes veya sözlü açıklamayı, söylenmesinden daha hızlı okunan ekran metnine sıkıştır. Bir izleyici "2024'ten beri %40 düştü" yazısını bir saniyeden kısa sürede okuyabilir; bunu sesli söylemek üç saniye sürer.

## Pattern Interrupt Nedir, Ne Zaman Kullanılır?

Pattern interrupt, izleyicinin dikkati doğal olarak kaymaya başlamadan önce araya giren görsel veya sesli bir ritim kırılmasıdır — bir zoom, farklı bir açıya kesim, bir ses efekti, bir altyazı çarpması. Kısa video kurgu rehberlerinin çoğunda tutarlı bir kural var: tek bir çekim kesim, zoom veya ekran değişikliği olmadan üç-dört saniyeden uzun sürüyorsa, pattern interrupt için adaydır; çünkü sabit çerçeveleme, video ortasındaki düşüşlerin en büyük tek nedenidir.

Fazla kullanmak da ters tepiyor — yarım saniyede bir kesim telaşlı okunur ve bazı izleyiciler sıkıntıdan değil, tam da bu tempodan kaçar. Hedef bir kesim kotası değil, bilgi yoğunluğuna uyan bir ritimdir.

## Altyazı İzlenme Süresini Nasıl Değiştirir, Neden İsteğe Bağlı Değildir?

Altyazılar, sessiz izleyen kişiyi hook sonrasında da izlemeye tutar; çünkü kısa videonun büyük bir kısmı toplu taşımada, iş yerinde veya yanında uyuyan biri varken sessiz izleniyor — sesi takip edemeyen sessiz bir izleyici birkaç saniye içinde ayrılır. Konuşulan kelimeyle eş zamanlı beliren gömülü altyazılar, aynı zamanda ikincil bir pattern interrupt gibi çalışır: her yeni kelime kendi başına küçük bir görsel değişimdir.

Ama her şeyi düz bir tempoda birebir altyazılamak gerekmiyor — yoğun diyalog sahneleri tam altyazıdan yararlanır, fakat görsel bir demo genellikle altında akan bir transkript yerine sadece anahtar ifadeyi ("3 dakikada hazır," "ücretsiz plan var") gösterse yeter.

## İnsanları Yeniden İzlemeye Yönelten Bir Final Nasıl Kurgulanır?

Son iki saniyeyi görsel, sözlü veya her ikisiyle açılışa bağla; böylece sona ulaşan izleyici kaydırmak yerine açılışı yeniden izlemek için bir sebep bulur. Tekrar izlemeyi ek izlenme süresi olarak sayan platformlarda, biri tarafından iki kez izlenen 10 saniyelik bir video, bir kez izlenen 20 saniyelik bir videoyla kabaca aynı ortalama izlenme süresini bildirir — bu yüzden döngü, çok kısa içerikte orantısız biçimde etkilidir.

Open loop, sert bir görsel döngü olmadan da işe yarar: açılışın sorduğu bir soruyla bitir veya hook'u yeniden çerçeveleyen bir açılımla sonlandır; böylece başa dönmek yeni bir şeye cevap verir. [Zayıf hookları düzeltmek](/tr/posts/kisa-videoda-ilk-3-saniye-hook-hatalari) ilk izlenmeyi sağlar; döngüye uygun bir final ise o tek izlenmeyi iki veya üç izlenmeye çevirir.

Düzgün görüşüm şu: onlarca videoyu kendi retention grafiğine bakarak yeniden kurguladıktan sonra, "algoritma beni sevmiyor" şikâyetlerinin neredeyse tamamı gizli bir ceza mekanizmasına değil, kurgulanmamış tek bir duraksamaya veya iki saniye fazla tutulan sabit bir çekime çıkıyor. Çözüm genelde can sıkıcı kadar basit — boşluğu kes — büyük olasılıkla içerik üreticilerin bunun yerine yeni bir hook formatı aramayı tercih etmesinin nedeni de bu. Retention'ın neden bu şekilde ağırlıklandırıldığının platform bazlı mekaniği için [izlenme süresi, tamamlama oranı: seni sıralayan sinyaller](/tr/posts/izlenme-suresi-tamamlama-orani-siralama) yazısına, bir kurgu için nereye paylaşılacağı konusunda [Shorts mu, Reels mi, TikTok mu](/tr/posts/shorts-mu-reels-mi-tiktok-mu-2026) yazısına bakabilirsin. Kapak görseli veya kapak karesi tıklamayı almıyorsa bunların hiçbiri önemli değil — hunininin tıklama tarafı için [tıklama oranını düşüren kapak görseli hataları](/tr/posts/kapak-gorseli-hatalari-ctr) yazısına göz at. Daha fazla retention odaklı inceleme için [sosyal medya kategorisine](/tr/category/sosyal-medya) bakabilirsin.

## Sıkça Sorulan Sorular

### YouTube, TikTok ve Instagram'da retention grafiğimi nasıl kontrol ederim?

YouTube Studio'da bir videonun Analiz sekmesini aç, Etkileşim bölümündeki izleyici elde tutma raporuna bak — Google'ın elde tutma anlarını ölçme konulu yardım sayfası nasıl okunacağını anlatıyor, ama verinin işlenmesi genellikle bir-iki gün sürüyor. TikTok'ta videonun Analitik panelinden ortalama izlenme süresine ve retention eğrisine bak; Instagram'da Reels içgörüleri panelinden ortalama izlenme süresini oynatma sayısına göre kontrol et.

### Kısa video için iyi bir tamamlanma oranı nedir?

Hiçbir platformun yayımladığı tek bir resmi eşik yok; içerik üreticilerin verdiği rakamlar (genellikle %50-70) pratisyen tahminleri, doğrulanmış algoritma sınırları değil. Kendi retention eğrindeki uçurumları eyleme dönüştürülebilir veri olarak ele al — üçüncü saniyedeki bir uçurum, başka birinin yüzde hedefine ulaşmaktan daha önemlidir.

### Pattern interrupt'lar izlenme süresine gerçekten yardımcı oluyor mu, yoksa bir trend mi?

Pattern interrupt'lar yardımcı olur; çünkü retention grafiklerinde izleyicilerin düştüğü yer tutarlı biçimde sabit çerçevelemedir, doğrudan ödüllendiren bir platform kuralı olduğu için değil. Bir zoom, altyazı çarpması veya açı değişimi, izleyicinin dikkati doğal olarak kaymadan önce sıfırlar — etki, tek bir yeniden kurgulanmış videonun kendi retention verisinde görülebilir.

### Her kısa videoyu altyazılamalı mıyım?

Sesin temel bilgi taşıdığı her videoyu altyazıla; çünkü izleyicilerin büyük bir kısmı sessiz izliyor. Yoğun diyalog tam altyazı gerektirir, ama ağırlıklı görsel bir demo genellikle ekranda sadece anahtar ifadeye ihtiyaç duyar — birebir bir transkript, retention'a katkı sağlamadan kareyi kalabalıklaştırabilir.

**Kaynaklar:** [YouTube Yardım — Elde tutma anlarını ölçme](https://support.google.com/youtube/answer/9314415), [TikTok Creative Center — Return On Influence raporu](https://ads.tiktok.com/business/creativecenter/quicktok/online/return-on-influence-tiktok-creative-impact/pc/en).
