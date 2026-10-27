---
title: "Claude ile A/B Testi İçin Açılış Sayfası Varyantları"
slug: "claude-ile-ab-testi-icin-acilis-sayfasi-varyantlari"
translationKey: "landing-page-variants-claude-ab-test"
locale: "tr"
excerpt: "Kısa cevap: Claude'a rastgele varyant yazdırmayın; önce bir hipotez kurun, sonra Claude'u sadece o hipotezi test edecek metni yazmaya yönlendirin."
category: "digital-marketing"
tags: ["claude", "ab-testing", "conversion-optimization"]
publishedAt: "2026-10-27"
seoTitle: "Claude ile Açılış Sayfası A/B Test Varyantı Yazma"
seoDescription: "Claude'a hipotez bazlı açılış sayfası varyantları yazdırma, bunları bir test aracına bağlama ve doğru örneklem büyüklüğünü hesaplama adım adım rehberi."
---

Kısa cevap: Claude'dan "bana 5 varyant yaz" demek yerine önce test edeceğiniz tek bir hipotezi tanımlayın (örneğin "somut bir sayı içeren başlık, soyut bir vaatten daha çok dönüştürür"), sonra Claude'a sadece bu hipotezi izole edecek şekilde bir kontrol ve bir meydan okuyan (challenger) varyant yazdırın. Rastgele üretilen varyantlar istatistiksel olarak anlamlı bir sonuç verse bile, "neden kazandığını" bilemezsiniz — ve bu bilgi olmadan sonraki testinizi tasarlayamazsınız.

## Bir açılış sayfasında gerçekten neyi değiştirmeli?

Beş öğe test sonuçlarının büyük kısmını belirliyor: başlık (hook), ilk cümledeki vaat, harekete çağrı (CTA) metni, sosyal kanıt (testimonial, logo, sayı) ve teklifin kendisi (fiyat, süre, garanti). Bunların hepsini aynı anda değiştirmek, hangi değişikliğin sonucu etkilediğini anlamanızı imkânsız kılar — bu yüzden her test turunda tek bir öğeyi izole etmek, aynı anda beş öğeyi değiştirip "daha iyi bir sayfa" elde etmekten daha değerlidir.

| Test edilen öğe | Örnek hipotez | Ölçtüğü şey |
|---|---|---|
| Başlık | "Sayı içeren başlık, soyut vaatten daha iyi dönüştürür" | İlk izlenim, dikkat çekme |
| CTA metni | "'Ücretsiz Dene' > 'Kayıt Ol'" | Harekete geçme eşiği |
| Sosyal kanıt | "Müşteri logosu, yıldız puanından daha güvenilir" | Güven oluşturma |
| Teklif çerçevesi | "Aylık fiyat, yıllık toplamdan daha az caydırıcı" | Fiyat algısı |

## Claude'dan rastgele değil, hipotez bazlı varyant nasıl istenir?

Önce hipotezi yazılı olarak tanımlayın, sonra bu hipotezi Claude'a prompt'un ilk cümlesi olarak verin — "bana farklı başlıklar yaz" gibi açık uçlu bir istek, test edilebilir bir karşılaştırma üretmez. Aşağıdaki gibi bir yapı, Claude'un kontrol ve meydan okuyan varyantı aynı çatı altında, sadece test edilen değişkeni değiştirerek üretmesini sağlar:

```text
Hipotez: Başlıkta somut bir sayı (süre, yüzde, miktar) kullanmak,
soyut bir fayda vaadinden daha çok tıklama ve form doldurma getirir.

Kontrol (mevcut): "İşinizi Büyütmenin Akıllı Yolu"
Meydan okuyan: Kontrol ile aynı ton ve uzunlukta, ama başlığa ölçülebilir
bir sayı (süre, yüzde veya miktar) ekleyen tek bir alternatif yaz.
Alt başlığı, CTA'yı ve sayfanın diğer kısımlarını değiştirme.
```

Bu yapı, Claude'un tek değişkeni izole etmesini zorunlu kılıyor; aksi halde model genelde tonu, uzunluğu ve vaadi aynı anda değiştiren "daha iyi" bir metin üretme eğiliminde oluyor — bu da testinizi kirletiyor.

## Varyantları bir test aracına nasıl bağlamalı?

Üretilen varyant metnini doğrudan test aracınızın (örneğin bir deneyim yönetim platformu veya basit bir sunucu taraflı yönlendirme) varyant alanına yapıştırın; Claude'un çıktısını sayfaya elle kopyalarken tipografi, boşluk ve buton stilini değiştirmeyin — görsel farklılıklar, metin hipotezinizi test etme amacınızı bozan ek bir değişken ekler. Testi başlatmadan önce her iki varyantın da aynı trafik kaynağından (örneğin aynı reklam kampanyasından) geldiğini doğrulayın; farklı kaynaklardan gelen trafiği karşılaştırmak, A/B testini değil, iki farklı kitleyi karşılaştırmış olursunuz.

## Örneklem büyüklüğünü nasıl hesaplamalıyım?

Gereken örneklem büyüklüğü üç girdiye bağlı: kontrol varyantının temel dönüşüm oranı, tespit etmek istediğiniz minimum fark (MDE — minimum detectable effect) ve kabul ettiğiniz istatistiksel güç. Standart ayarlar %80 güç ve %95 anlamlılık (alfa=0,05) seviyesidir; bu, gerçek bir etkiyi kaçırma riskini %20'de, yanlış pozitif riskini %5'te tutar. Örnek bir hesaplama: %30 temel dönüşüm oranından %10'luk bir bağıl artışı (yani %33'e) tespit etmek istiyorsanız, bu ayarlarla varyant başına yaklaşık 3.692 ziyaretçiye ihtiyacınız var — bu rakam, Evan Miller'ın örneklem hesaplayıcısı gibi standart araçların ürettiği tipik bir sonuç.

Küçük bir fark aramak, büyük bir örneklem gerektirir: temel dönüşüm oranından sadece %5'lik bir bağıl artış tespit etmeye çalışırsanız, gereken trafik birkaç katına çıkar. Düşük trafikli bir sitede bu pratik bir sorun yaratıyor — [az trafikli sitelerde A/B testi rehberimizde](/tr/posts/kucuk-siteler-icin-ab-testi-cro) bu durumda testi uzun tutmak yerine daha büyük, daha çarpıcı değişiklikleri test etmenin neden daha mantıklı olduğunu ele alıyoruz.

## Sonuçları kendimi kandırmadan nasıl okumalıyım?

Testi, hesapladığınız örneklem büyüklüğüne ulaşana kadar durdurmayın — "şu an anlamlı görünüyor" diye erken durdurmak, yanlış pozitif riskini ciddi şekilde artırır, çünkü anlamlılık eşiği zaman içinde dalgalanır ve rastgele bir anda eşiği aşabilir. Testin önceden belirlenen süresini veya örneklem hedefini tamamlamadan sonuç çıkarmak, "p-hacking" olarak bilinen ve çoğu zaman fark edilmeyen bir hatadır. Sonuçları okurken sadece dönüşüm oranına değil, güven aralığına da bakın: iki varyant arasındaki fark istatistiksel olarak anlamlı olsa bile, güven aralığı çok genişse pratik önemi sınırlı olabilir.

## Bir varyant kaybettiğinde sıradaki testi nasıl tasarlamalı?

Kaybeden varyantı "başarısız" diye bir kenara atmadan önce, hipotezinizin neden doğrulanmadığını sorun — üç olasılık var: hipotez yanlıştı, hipotez doğruydu ama uygulama (metnin kendisi) zayıftı, ya da test yeterli örneklem büyüklüğüne ulaşmadan bitirildi. Bu üçünü ayırt etmek için Claude'a aynı hipotezi farklı bir ton veya yapıyla yeniden yazdırıp ikinci bir tur deneyebilirsiniz; eğer ikinci uygulama da kaybediyorsa, hipotezin kendisinin yanlış olma ihtimali artıyor. Bu döngü — hipotez kur, Claude'a izole varyant yazdır, test et, sonucu hipoteze göre yorumla — her turda bir öncekinden daha fazla şey öğrenmenizi sağlıyor; rastgele varyantlarla çalışan bir süreçte bu öğrenme birikimi oluşmuyor.

Test geçmişini bir tabloda tutmak (hipotez, varyant metni, sonuç, güven aralığı) zamanla bir "ne işe yarıyor" kütüphanesi oluşturuyor. Altı ay sonra yeni bir sayfa yazarken bu kütüphaneye bakmak, sıfırdan hipotez üretmekten çok daha hızlı bir başlangıç noktası veriyor — özellikle aynı ürün kategorisinde tekrar eden kalıplar (örneğin "somut sayı içeren başlıklar bu kitlede tutarlı şekilde kazanıyor") ortaya çıktığında.

## AI yazdığı metin ne zaman insan yazımından daha zayıf kalır?

Markanıza özgü bir ton, bir müşteri hikâyesi veya sektöre özel bir ıstılah gerektiren sayfalarda Claude'un ürettiği metin, genel ve güvenli bir ortalamaya kayma eğiliminde — bu da bazen test sonuçlarında insan yazımına kaybetmesine yol açıyor. Kendi gözlemim: Claude hipotez bazlı, dar kapsamlı varyantlarda (başlık, CTA metni gibi) güçlü bir performans gösteriyor, ama uzun satış metni veya duygusal hikâye anlatımı gerektiren tam sayfa yeniden yazımlarında, deneyimli bir metin yazarının elinden çıkan versiyon genelde kazanıyor. AI'ı dar, test edilebilir varyantlar için kullanın; sayfanın tamamını yeniden yazdırmak için değil.

## Sıkça Sorulan Sorular

### Claude'a A/B test varyantı yazdırırken ne kadar spesifik olmalıyım?

Tek bir hipotezi açıkça tanımlayın ve Claude'a sadece bu değişkeni değiştirip diğer her şeyi (ton, uzunluk, diğer sayfa öğeleri) sabit tutmasını söyleyin. Açık uçlu "bana farklı başlıklar yaz" istekleri, test edilebilir bir karşılaştırma üretmez.

### A/B testi için minimum örneklem büyüklüğü nasıl hesaplanır?

Temel dönüşüm oranı, tespit etmek istediğiniz minimum fark (MDE) ve istatistiksel güç (genelde %80) ile anlamlılık seviyesini (genelde %95) girerek hesaplanır. Evan Miller'ın hesaplayıcısı gibi standart araçlar bu girdilerden varyant başına gereken ziyaretçi sayısını üretir.

### Testi erken durdurup sonucu yorumlayabilir miyim?

Hayır, önceden hesaplanan örneklem büyüklüğüne ulaşmadan testi durdurmak, yanlış pozitif riskini önemli ölçüde artırır. Anlamlılık eşiği zaman içinde dalgalanabilir ve erken bir anlık görüntü yanıltıcı olabilir.

### AI yazdığı metin ne zaman insan yazımından daha kötü performans gösterir?

Markaya özgü ton, duygusal hikâye anlatımı veya uzun satış metni gerektiren tam sayfa yeniden yazımlarında AI metni genelde insan yazımına kaybeder. AI, dar ve hipotez bazlı varyantlarda (başlık, CTA gibi) daha güçlü performans gösterir.
