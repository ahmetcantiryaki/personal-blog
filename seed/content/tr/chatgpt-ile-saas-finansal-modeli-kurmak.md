---
title: "ChatGPT İle SaaS Finansal Modeli Nasıl Kurulur?"
slug: "chatgpt-ile-saas-finansal-modeli-kurmak"
translationKey: "ai-saas-financial-model-chatgpt-2026"
locale: "tr"
excerpt: "Kısa cevap: ChatGPT'ye formül iskeletini kurdurun ama her formülü elle doğrulayın. Model beş parçadan oluşur: gelir, COGS, headcount, burn, runway."
category: "business"
tags: ["chatgpt", "saas", "productivity"]
publishedAt: "2026-11-07"
seoTitle: "ChatGPT İle SaaS Finansal Modeli Kurma Rehberi (2026)"
seoDescription: "Kısa cevap: ChatGPT formül iskeletini kurar ama her formülü elle doğrulamak gerekir. Model beş parçadan oluşur: gelir, COGS, headcount, burn ve runway."
---

Kısa cevap: Bir kurucu-seviyesi SaaS finansal modeli beş bileşenden oluşur — gelir (yeni + genişleme - churn), COGS (AI/token maliyetleri dahil), headcount planı, aylık burn ve runway — ve ChatGPT bu yapının formül iskeletini, varsayımlar sekmesini ve senaryoları dakikalar içinde kurabilir; ama üretilen her formülü elle doğrulamadan tabloya güvenmemek gerekir.

## Bir SaaS finansal modelinin temel bileşenleri ne?

Beş sekme yeterli: gelir (yeni müşteri geliri, mevcut müşterilerden genişleme geliri, churn kaybı), COGS (barındırma, destek ve 2026'da artan payıyla AI/token maliyetleri), headcount (işe alım planı ve zamanlaması), burn (aylık nakit çıkışı) ve runway (mevcut nakit, aylık net burn'e bölünerek kaç ay dayanacağını gösterir). Bu beş sekme birbirine bağlı olmalı — headcount artışı burn'ü, burn de runway'i otomatik güncellemeli.

## ChatGPT bir finansal model taslağını nasıl oluşturur?

En verimli yöntem, ChatGPT'ye tek seferde tüm modeli istemek değil, sekme sekme ilerlemek: önce varsayımlar sekmesinin yapısını (fiyat, churn oranı, satış döngüsü uzunluğu gibi değişkenler) tanımlatın, sonra gelir formülünü bu varsayımlara referans verecek şekilde kurdurun, ardından COGS ve headcount'u ekleyin. Her adımda "bu formülü hangi hücrelere referans veriyor, adım adım açıkla" diye sormak, hem hatayı erken yakalamanızı sağlar hem de modelin mantığını siz de anlamış olursunuz — yatırımcı sorularına cevap verirken bu anlayış, tablonun kendisinden daha değerli.

```python
# Basit runway hesaplayıcı — ChatGPT'ye kurdurduğunuz formülü
# tabloya geçirmeden önce bu şekilde elle doğrulayabilirsiniz
def runway_months(cash_on_hand, monthly_net_burn):
    if monthly_net_burn <= 0:
        return float("inf")  # nakit pozitif, runway sorunu yok
    return round(cash_on_hand / monthly_net_burn, 1)

print(runway_months(cash_on_hand=900_000, monthly_net_burn=75_000))  # 12.0 ay
```

## Hangi SaaS metrik formüllerini bilmek gerekir?

Aşağıdaki tablo, bir modelde en sık kullanılan beş formülü ve tipik referans aralıklarını özetliyor:

| Metrik | Formül | Tipik referans aralığı |
|---|---|---|
| CAC | Toplam satış+pazarlama / yeni müşteri sayısı | Sektöre göre değişir |
| LTV | ARPA × Brüt Kâr Marjı / Churn Oranı | — |
| LTV:CAC | LTV / CAC | 3:1 - 5:1 sağlıklı kabul edilir |
| CAC Geri Ödeme Süresi | CAC / Aylık brüt kâr (müşteri başına) | Seed-Series A'da 12-18 ay |
| Runway | Eldeki nakit / Aylık net burn | Hedef: en az 12-18 ay |

Churn de kendi içinde ikiye ayrılıyor: müşteri churn oranı (kaybedilen müşteri sayısı) ve gelir churn oranı (bu müşterilerin kaybettirdiği gerçek gelir) — ikisi farklı hikaye anlatabilir, özellikle büyük müşterilerin kaybı küçük müşterilerden daha fazla gelir çarpanına sahipse. Modelinizde bu iki churn türünü ayrı satırlarda tutmak, hangi müşteri segmentinin asıl riski taşıdığını erken fark etmenizi sağlıyor.

## ChatGPT'nin ürettiği formüller nasıl doğrulanır?

Üç kontrol noktası şart: önce birim kontrolü (bir hücre yüzde mi, oran mı, yoksa mutlak sayı mı döndürüyor — ChatGPT bazen bunları karıştırabiliyor), sonra referans kontrolü (formül, doğru sekmedeki doğru hücreye mi işaret ediyor, yoksa sabit bir sayı mı gömülü), son olarak uç durum kontrolü (churn oranı sıfır veya burn negatifse formül hata mı veriyor). AI/token maliyetlerini COGS'a dahil ederken özellikle dikkatli olun: bir AI özellik sunan SaaS ürününde kullanıcı başına token maliyeti, kullanım arttıkça marjı beklenenden hızlı eritebiliyor — bu kalemi "sabit maliyet" gibi değil, kullanıcı sayısıyla doğrusal ölçeklenen bir değişken gibi modellemek gerekiyor.

## Senaryo (sensitivity) analizi nasıl kurulur?

Üç değişkeni ayrı bir sekmede izole edin: CAC (satış/pazarlama verimliliği değişirse), churn oranı (üründe bir sorun çıkarsa) ve fiyat (bir indirim veya zam denenirse). Her değişken için "iyimser / baz / kötümser" üç senaryo tanımlayın ve runway'in bu üç senaryoda kaç ay değiştiğini gösteren tek bir özet tablo oluşturun. Bu, yatırımcıya "modelimiz tek bir varsayıma bağlı değil, bu üç riski de hesapladık" demenizi sağlıyor — ChatGPT'den bu tabloyu "churn %5'ten %8'e çıkarsa runway'e etkisi ne olur" gibi somut sorularla adım adım kurdurmak, soyut bir "sensitivity analizi yap" isteğinden çok daha güvenilir sonuç veriyor.

## Yatırımcıya gönderilecek tek sayfalık özet nasıl hazırlanır?

Özet beş satırdan fazla olmamalı: güncel MRR ve büyüme hızı, net gelir tutma oranı, mevcut runway ve bir sonraki turun hedef büyüklüğü, CAC geri ödeme süresi ve son olarak en kötümser senaryoda runway'in ne kadar kısaldığı. Bu tek sayfa, [kanıta dayalı yatırım toplamayı ele aldığımız yazıda](/tr/posts/kanita-dayali-yatirim-slaytlarin-sonu-mu) vurguladığımız veri odasının gelir/tutma tablosu bölümüyle doğrudan örtüşüyor — aynı tabloyu iki yerde de kullanmak, tutarsız rakam sunma riskini de ortadan kaldırıyor. Metrik tanımlarını güçlendirmek isteyenler [kurucular için ilk SaaS metrikleri rehberimize](/tr/posts/kurucular-icin-ilk-saas-metrikleri) de bakabilir.

## ChatGPT'yi kullanırken hangi tuzaklara düşülüyor?

En sık görülen üç tuzak şöyle: ChatGPT'ye "bir SaaS modeli oluştur" gibi aşırı genel bir istek vermek ve çıkan tabloyu sorgulamadan kullanmak; farklı sekmelerdeki varsayımları güncellediğinizde modelin otomatik yeniden hesaplamadığını fark etmemek (bazı formüller sabit bir sayıyı referans hücre yerine doğrudan gömebiliyor); ve churn oranını tek bir sabit sayı olarak modelleyip zamanla değişmeyeceğini varsaymak. Bu üçünü önlemenin yolu, modeli tek seferde değil parça parça kurmak ve her yeni formülü eklerken bir önceki ayın gerçek verisiyle karşılaştırmak.

## Model ne sıklıkla güncellenmeli?

Erken aşama bir şirket için ayda bir güncelleme yeterli: gerçekleşen MRR, churn ve burn rakamlarını modele işleyip tahminle gerçekleşen arasındaki farkı not etmek. Bu fark büyükse (örneğin tahmini churn %5 ama gerçekleşen %9 ise), sorunun varsayımda mı yoksa üründe mi olduğunu ayırt etmek gerekiyor — bu ayrım, bir sonraki yatırımcı güncellemesinde "neden sapma oldu" sorusuna hazırlıklı gitmenizi sağlıyor.

## Sıkça Sorulan Sorular

### ChatGPT bir SaaS finansal modelini tamamen doğru kurabilir mi?

Hayır, tam otomatik güvenmemek gerekir. ChatGPT formül iskeletini ve yapıyı hızlı kurar, ama her formülün birim, referans ve uç durum kontrolünü elle yapmak gerekiyor çünkü üretilen formüller bazen hatalı hücreye referans verebiliyor.

### Bir SaaS finansal modelinde hangi beş sekme olmalı?

Gelir (yeni + genişleme - churn), COGS (AI/token maliyetleri dahil), headcount, burn ve runway. Bu beş sekme birbirine bağlı olmalı; örneğin headcount artışı otomatik olarak burn'ü ve runway'i güncellemeli.

### Runway nasıl hesaplanır?

Runway, eldeki nakdin aylık net burn'e bölünmesiyle bulunur ve kaç ay dayanacağınızı gösterir. Bu, bugünün burn hızına göre bir anlık görüntüdür; bir satış yavaşlaması veya churn artışı bu süreyi hızla kısaltabilir.

### Model ne sıklıkla gerçek verilerle karşılaştırılmalı?

Erken aşama bir şirket için ayda bir karşılaştırma yeterli: gerçekleşen MRR, churn ve burn rakamlarını modele işleyip tahminle gerçekleşen arasındaki farkı not etmek gerekiyor. Fark büyükse, sorunun varsayımda mı yoksa üründe mi olduğunu ayırt etmek, bir sonraki yatırımcı güncellemesinde sapmayı açıklayabilmenizi sağlıyor.

### ChatGPT'nin ürettiği formüllerde en sık hangi hata görülür?

En sık görülen hata, bir formülün bir hücreye referans vermesi gerekirken sabit bir sayıyı doğrudan gömmesi — bu, varsayımlar sekmesini güncellediğinizde modelin otomatik yeniden hesaplamamasına yol açıyor. İkinci sık hata, churn oranını zamanla değişmeyen sabit bir sayı olarak modellemek; gerçekte churn, ürün değişiklikleri ve müşteri segmentine göre dalgalanıyor.

### AI/token maliyetlerini SaaS finansal modelime nasıl dahil etmeliyim?

Bu kalemi sabit bir maliyet gibi değil, kullanıcı sayısı ve kullanım yoğunluğuyla doğrusal ölçeklenen bir değişken gibi modellemelisiniz. Aksi halde kullanım arttıkça gerçek brüt kâr marjınız, modelin gösterdiğinden daha hızlı erir.
