---
title: "Gemini 3.6 Flash ile Ucuz ve Hızlı AI"
slug: "gemini-3-6-flash-ile-gelistirme"
translationKey: "building-with-gemini-flash-3-6"
locale: "tr"
excerpt: "Gemini 3.6 Flash, 3.5 Flash-Lite ve Pro arasında maliyet-performans dengesini nasıl kurarsınız? Model-routing kalıbı, fiyatlar ve pratik bir Gemini API örneği."
category: "ai"
tags: ["gemini", "ai-tools", "cost-optimization", "ai-agents"]
publishedAt: "2026-08-07"
seoTitle: "Gemini 3.6 Flash ile Geliştirme: Maliyet Rehberi"
seoDescription: "Gemini 3.6 Flash, 3.5 Flash-Lite ve Pro arasında ne zaman hangisini seçmeli? Fiyat tablosu, model-routing kalıbı ve Gemini API kod örneğiyle pratik rehber."
---

Bir ajan hattını üretime alırken en sık yapılan hata, her adımı en pahalı modele göndermek. Oysa Gemini 3.6 Flash'ın GA'ya çıkmasıyla birlikte artık üç net katmanınız var — ve doğru soru "hangi model en iyisi" değil, "bu adım hangi katmanı hak ediyor."

## Gemini 3.6 Flash'ta Ne Değişti

Gemini 3.6 Flash ve Gemini 3.5 Flash-Lite artık genel kullanıma açık (GA). Google'ın kendi ölçümlerine göre 3.6 Flash, uzun soluklu mühendislik görevlerinde ajan token maliyetini %65'e kadar düşürüyor — bunu token verimliliği artışı ve daha iyi kod/ajan planlama yetenekleriyle başarıyor. Bu tam olarak [Gemini 3.6 Flash, 3.5 Flash-Lite ve Cyber lansmanını duyurduğumuz yazıda](/tr/posts/gemini-3-6-flash-3-5-flash-lite-ve-cyber) ele aldığımız modelin şimdi üretime hazır hali.

Flash-Lite ise farklı bir amaca hizmet ediyor: yüksek hacimli, düşük gecikmeli otomasyon için tasarlanmış bir "subagent" modeli — karmaşık akıl yürütme değil, hız ve maliyet öncelikli.

## Üç Katman, Üç Farklı İş

Fiyatlar arasındaki fark, hangi işi hangi modele vermeniz gerektiğini büyük ölçüde belirliyor:

| Model | Girdi ($/1M token) | Çıktı ($/1M token) | En iyi olduğu iş |
|---|---|---|---|
| Gemini 3.5 Flash-Lite | $0,30 | $2,50 | Yüksek hacimli, basit subagent görevleri (sınıflandırma, özetleme, kısa çağrılar) |
| Gemini 3.6 Flash | $1,50 | $7,50 | Orta seviye akıl yürütme, kod üretimi, ajan planlama |
| Gemini 3 Pro (≤200K bağlam) | $2,00 | $12,00 | Derin akıl yürütme, çok adımlı karmaşık görevler |

Flash-Lite ile Pro arasındaki fark girdi tarafında yaklaşık 6-7 kat. Bu, binlerce çağrı yapan bir ajan hattında gün sonunda ciddi bir fatura farkı demek — konuyu daha genel bir çerçevede [LLM token maliyetini düşürme yazımızda](/tr/posts/llm-token-maliyetini-dusurme) işlemiştik.

## Model-Routing Kalıbı

Pratikte işe yarayan yaklaşım, tek bir model seçmek değil, görev türüne göre **yönlendirme** kurmak:

- **Flash-Lite**: Yüksek hacimli, tekrarlayan subagent'lar için varsayılan. Bir müşteri talebini kategorize etmek, bir metni kısaca özetlemek, basit bir doğrulama yapmak gibi işler burada.
- **Flash**: Orta karmaşıklıktaki akıl yürütme ve kod görevleri için varsayılan. Çoğu ajan adımı aslında bu katmanda kalabilir — "derin düşünme" gerektirmeyen ama art arda birkaç adım isteyen işler.
- **Pro'ya yükseltme**: Flash bir görevde düşük güvenle yanıt verdiğinde, ya da görev açıkça çok adımlı planlama gerektirdiğinde devreye giriyor. Bunu genelde ya modelin kendi güven skoruna ya da basit bir yeniden deneme sayacına bağlıyorsunuz.

Basit bir yönlendirici şöyle görünebilir:

```python
def route_model(task_type, complexity_score):
    if task_type == "classification" or complexity_score < 3:
        return "gemini-3.5-flash-lite"
    elif complexity_score < 7:
        return "gemini-3.6-flash"
    else:
        return "gemini-3-pro"

# Örnek kullanım
model = route_model(task_type="code-generation", complexity_score=5)
```

`complexity_score` değerini elle etiketleyebilir ya da görev uzunluğu, geçmiş başarısızlık oranı gibi basit sinyallerden türetebilirsiniz. Amaç mükemmel bir sınıflandırıcı kurmak değil, en pahalı modeli sadece gerçekten gerektiğinde çağırmak.

## Gemini API'ye Bağlamak

Model seçimi dışında değişen bir şey yok — aynı Gemini API uç noktasını, sadece model parametresini değiştirerek çağırıyorsunuz. Bu, hattınızı yeniden yazmadan katmanlar arasında geçiş yapmayı kolaylaştırıyor; tek yapmanız gereken yönlendirme mantığınızı çağrı öncesine koymak.

## Maliyeti Ölçmek

Yönlendirme kurduktan sonra asıl iş, gerçekten para kazandırıp kazandırmadığını doğrulamak. Basit bir yaklaşım: her görev türü için hem "hep Pro kullansaydık" maliyetini hem de gerçek (yönlendirilmiş) maliyeti loglamak, haftalık farkı raporlamak. Flash-Lite'a düşen görevlerin oranı arttıkça toplam maliyetin düşmesi bekleniyor — ama bu oranı **doğruluk kaybı** ile birlikte izlemezseniz, ucuz ama yanlış cevaplar üreten bir sistem kurmuş olabilirsiniz.

## Dürüst Bir Uyarı: Yönlendirme Karmaşıklık Ekliyor

Şunu söylemek gerekiyor: üç modelli bir yönlendirme sistemi, tek model kullanmaktan her zaman daha karmaşık. Küçük bir prototip ya da düşük hacimli bir iç araç için muhtemelen buna gerek yok — sadece Flash kullanıp geçin. Yönlendirmenin gerçek getirisi, günde binlerce çağrı yapan üretim sistemlerinde ortaya çıkıyor; oradaki %60'lık bir maliyet düşüşü, eklenen mühendislik karmaşıklığını fazlasıyla karşılıyor.

Gemini'yi diğer büyük modellerle nasıl kıyaslayacağınızı merak ediyorsanız [Gemini mi ChatGPT mi karşılaştırma yazımıza](/tr/posts/gemini-mi-chatgpt-mi) da bakabilirsiniz; oradaki genel değerlendirme, burada anlattığımız maliyet-odaklı yaklaşımla birlikte okunduğunda daha eksiksiz bir tablo veriyor.

## Gerçek Bir Senaryo: Destek Talebi Hattı

Somutlaştırmak için basit bir örnek düşünelim: günde 10.000 müşteri destek talebi işleyen bir ajan hattınız var. Her talep önce kategorize ediliyor (spam mi, iade talebi mi, teknik sorun mu), sonra kategoriye göre bir yanıt taslağı üretiliyor, karmaşık ya da hassas vakalar ise insana yönlendiriliyor.

Hepsini Pro ile işlerseniz, sadece kategorizasyon adımı için günde yaklaşık 10.000 çağrı × ortalama 500 girdi token'ı × $2,00/1M = ~10 dolar, üstüne yanıt taslağı üretimi eklenince toplam fatura hızla katlanıyor. Aynı hattı yönlendirmeyle kurduğunuzda: kategorizasyon Flash-Lite'a düşüyor (aynı iş için ~$0,30/1M, yani neredeyse 7 kat daha ucuz), yanıt taslağı üretimi orta karmaşıklıkta olduğu için Flash'a gidiyor, sadece "hassas vaka" olarak işaretlenen küçük bir yüzde (genelde toplam hacmin %5-10'u) Pro'ya yükseltiliyor. Toplamda kategorizasyon maliyeti neredeyse yok denecek seviyeye iniyor, Pro'ya giden hacim düştüğü için orada da belirgin bir tasarruf oluşuyor — ve bu, Google'ın iddia ettiği %65'lik maliyet düşüşü rakamının nereden geldiğini somutlaştırıyor.

Bu senaryonun kritik noktası, kategorize etme gibi yüksek hacimli ama düşük karmaşıklıklı adımların toplam maliyetin büyük kısmını oluşturması — ve tam da bu adımların Flash-Lite'a en uygun olan adımlar olması. Aynı mantık, e-ticaret ürün etiketleme, log sınıflandırma ya da içerik moderasyonu gibi yüksek hacimli başka birçok ajan iş akışına da doğrudan uygulanabiliyor; ortak özellikleri, tek bir çağrının basit olması ama toplam hacmin büyük olması.

## Model-Routing Karar Tablosu

| Sinyal | Yönlendirme kararı |
|---|---|
| Basit sınıflandırma, kısa çağrı | Flash-Lite |
| Orta karmaşıklıkta kod/akıl yürütme | Flash |
| Düşük güven skoru veya tekrarlanan başarısızlık | Pro'ya yükselt |
| Çok adımlı, bağlam-ağır planlama | Doğrudan Pro |
| Yüksek hacim, hata toleransı yüksek | Flash-Lite öncelikli |

## Gelecek Ay Ne Değişebilir

Google'ın Flash ailesindeki fiyatlandırma geçmişi, bu tabloların statik olmadığını gösteriyor — son bir yılda birkaç kez ayarlama yapıldı ve yol haritasında Gemini 3.5 Pro'nun da geleceği belirtiliyor. Bu, yönlendirme mantığınızı sabit sayılar yerine bir yapılandırma dosyasında tutmanız gerektiği anlamına geliyor: model adları ve eşik değerleri kod içine gömülü olduğunda, bir fiyat değişikliğinde ya da yeni bir ara katman modeli çıktığında tüm kod tabanınızı taramak zorunda kalırsınız. Yapılandırmayı dışarıda tutmak, yeni bir katman eklemeyi tek satırlık bir değişikliğe indiriyor. Aynı prensip, yönlendirme eşiklerinizi (hangi complexity_score'un hangi modele gideceği) periyodik olarak gözden geçirmeniz için de geçerli — bir modelin fiyatı düştüğünde eşiği o modele doğru kaydırmak, hattınızı elle yeniden yazmadan maliyeti daha da düşürebiliyor.

## Sıkça Sorulan Sorular

### Flash-Lite'ı her yerde kullanmak neden yanlış olur?

Çünkü karmaşık akıl yürütme gerektiren görevlerde doğruluk düşüyor. Maliyet avantajı, yanlış ya da tutarsız çıktılarla telafi edilirse anlamını yitiriyor — özellikle kullanıcıya doğrudan giden çıktılarda.

### Yönlendirmeyi ne zaman kurmaya değer?

Günlük çağrı hacminiz binlere ulaştığında ya da tek bir modelin faturası fark edilir hale geldiğinde. Düşük hacimli projelerde eklenen karmaşıklık, kazanılan tasarruftan daha pahalıya gelebilir.

### Pro'ya ne zaman kesin olarak geçmeliyim?

Görev açıkça çok adımlı planlama, uzun bağlam takibi ya da yüksek doğruluk gerektiriyorsa. Flash'ın düşük güvenle yanıt verdiği durumları otomatik yakalayıp yükseltmek, elle karar vermekten daha güvenilir.

### Fiyatlar ne sıklıkla değişiyor?

Google, Flash ailesinde son bir yılda birkaç kez fiyat ayarlaması yaptı. Üretim sisteminizde fiyatları sabit kodlamak yerine, periyodik olarak Gemini API fiyatlandırma sayfasından doğrulamanız öneriliyor.
