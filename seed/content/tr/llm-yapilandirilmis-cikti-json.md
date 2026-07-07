---
title: "LLM Yapılandırılmış Çıktı: Güvenilir JSON"
slug: "llm-yapilandirilmis-cikti-json"
translationKey: "llm-structured-outputs-json"
locale: "tr"
excerpt: "Bir LLM'den güvenilir JSON almanın saha notları: şema modları ile tool-calling farkı, sınırda Zod/Pydantic doğrulaması ve hâlâ ısıran hata modları."
category: "ai"
tags: ["llm", "api-design", "best-practices", "reliability"]
publishedAt: "2026-07-07"
seoTitle: "LLM Yapılandırılmış Çıktı: Güvenilir JSON"
seoDescription: "Bir LLM'den güvenilir JSON almanın saha notları: şema modları ile tool-calling farkı, sınırda Zod/Pydantic doğrulaması ve enum kayması gibi hatalar."
---

Bir LLM'den güvenilir JSON almanın en hızlı yolu, serbest metni ayrıştırmayı bırakıp üretimi bir şemayla kısıtlamak ve her yanıtı akışın devamına dokunmadan önce sınırda doğrulamaktır. Bu tek değişiklik — şemayla kısıtlanmış çıktı artı sınır doğrulaması — artık bir optimizasyon değil, temel bir üretim güvenlik bileşeni olarak ele alınıyor. İşte bunu gerçekten çalıştırmaktan çıkan saha notları.

## Serbest metin ayrıştırma neden bozulur

Hata modu her zaman aynı şekildedir: bir regex ya da saf bir `JSON.parse` testte sorunsuz çalışır, sonra üretimde %99 doğru olan bir yanıtta bozulur — fazladan bir virgül, araya sızan bir markdown kod bloğu, modelin doldurmak yerine düz yazıyla açıklamayı tercih ettiği bir alan. Serbest metin ayrıştırma güvenilmez, çünkü modeller JSON'da kötü değil; güvenilmez çünkü *modeli yalnızca JSON üretmeye zorlayan hiçbir şey yok*, dolayısıyla çıktı biçimindeki her sapma bir yerde bir şey patlayana kadar sessiz bir hatadır. En sinsi versiyonu, üretimde haftalarca fark edilmeden kalan versiyondur: hata oranı düşüktür ama sıfır değildir ve düşen her istek, kimsenin bakmadığı bir hata loguna gömülür.

## JSON modu, yapılandırılmış çıktı ve tool-calling aynı garanti değil

Bu üçü gündelik konuşmada birbirinin yerine kullanılıyor ve kullanılmamalı — anlamlı ölçüde farklı güvenilirlik garantileri taşıyorlar.

| Yaklaşım | Garanti | Tipik hata oranı | En uygun kullanım |
|---|---|---|---|
| Serbest metin + parser | Yok — model her şeyi üretebilir | Oldukça değişken, sık sık çift haneli | Üretimde asla |
| JSON modu | Yalnızca geçerli JSON sözdizimi | ~%2-5 şema uyuşmazlığı | Şemanın henüz sabitlenmediği keşif çalışması |
| Yapılandırılmış çıktı (katı şema modu) | Kısıtlanmış decoding ile tam JSON Schema uyumu | %0,1'in altı | Bilinen şemalı üretim hatları |
| Araç/fonksiyon çağrısı (tool-calling) | Şema uyumu artı bir eylemi tetikleme niyeti | Yapılandırılmış çıktıyla kıyaslanabilir | Modelin çıktısının aynı zamanda bir şey *yapması* gereken her durum |

Pratik kural: yalnızca tipli veri geri istiyorsanız katı yapılandırılmış çıktıyı, modelin çıktısının bir fonksiyon çağırması, bir API'ye dokunması ya da bir durum değişikliğini tetiklemesi de gerekiyorsa tool-calling'i kullanın. JSON moduna ise yalnızca bir özelliğin erken, şemanın henüz karara bağlanmadığı aşamasında başvurun. Bu ayrımı ekip içinde net biçimde adlandırmak bile başlı başına faydalıdır, çünkü "JSON döndür" talimatının hangi garantiyi ima ettiği konusunda geliştiriciler arasında sık sık örtük bir yanlış anlama olur.

## Yine de sınırda doğrulayın

Yapılandırılmış çıktının hata oranını %0,1'in altına çekmesi sıfır anlamına gelmez ve *değerlerin* doğru olup olmadığına dair hiçbir şey söylemez — şemaya uygun bir yanıt yine de yanlış bir enum, aralık dışı bir sayı ya da tip kontrolünden geçen halüsinasyon bir alan içerebilir. Ne olursa olsun sistem sınırına bir doğrulayıcı koyun:

```ts
import { z } from "zod"

const TicketTriage = z.object({
  severity: z.enum(["low", "medium", "high", "critical"]),
  category: z.string().min(1).max(64),
  summary: z.string().max(280),
  needsHumanReview: z.boolean(),
})

const parsed = TicketTriage.safeParse(modelResponse)
if (!parsed.success) {
  // aşağıdaki onarım döngüsüne yönlendirin, akışın devamına ulaşmasına izin vermeyin
}
```

Bu, [LLM çıktılarını değerlendirme](/tr/posts/llm-ciktilari-degerlendirme) yazımızda genel olarak önerdiğimiz sınır-doğrulama disipliniyle aynı — şema kontrolü bir taban çizgisidir, içeriğin gerçekten doğru olup olmadığını kontrol etmenin yerini tutmaz.

## Geçersizde yeniden deneme ve kısmi akış

Doğrulama başarısız olduğunda sadece hata fırlatmayın — doğrulayıcının somut hatasını modele geri besleyin ve kendi çıktısını onarmasını isteyin. Bu pratikte hızla yakınsar, genelde bir ya da iki denemede, çünkü model ne ters gittiğini tahmin etmek yerine somut, yapılandırılmış bir şikâyete karşı düzeltme yapar:

```ts
async function generateValidated(prompt: string, maxRetries = 2) {
  let lastError: string | undefined
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await callModel(prompt, lastError)
    const parsed = TicketTriage.safeParse(response)
    if (parsed.success) return parsed.data
    lastError = parsed.error.message
  }
  throw new Error("Yapılandırılmış çıktı onarım döngüsü tükendi")
}
```

Gecikmeye duyarlı arayüzler için, yapılandırılmış bir yanıtın kısmi akışı — tam nesneyi beklemek yerine alanları tamamlandıkça göstermek — bu kalıpla iyi eşleşir, çünkü kısmi olarak akan bir nesne, geldikçe alan alan doğrulanabilir.

## Scratchpad kontratı: "adım adım düşün" vergisi olmadan akıl yürütme alanı

Yapılandırılmış çıktı isteğine "adım adım düşün" eklemek yaygın bir hatadır: güncel akıl yürütme modellerinde token yakar ve ölçülebilir bir doğruluk kazancı göstermez, çünkü model zaten şemayı üretmeye başlamadan önce içsel olarak akıl yürütür. Daha sıkı bir kalıp scratchpad kontratıdır — madde sayısına sert bir üst sınır konmuş sınırlı bir `plan` alanı, ardından gerçek yapılandırılmış `answer` alanı. Bu, modele açıkça akıl yürütme alanı tanır, bu akıl yürütmeyi hata ayıklama için incelenebilir tutar ve sınırsız chain-of-thought'un açık uçlu token tüketiminden kaçınır.

## Saha notları: hâlâ sizi yakalayan üç hata modu

- **Aşırı iç içe geçmiş şemalar.** Üç ya da dört seviyeden fazla iç içe nesnede modeller iç alanları daha sık düşürmeye ya da bozmaya başlar — alan izin verdiği her yerde şemanızı düzleştirin, biraz daha az "temiz" bir veri modeli anlamına gelse bile.
- **Enum kayması.** Eğitim dağılımı başka bir yerde o varyantı görmüşse, model zaman zaman enum'unuzun hemen dışında kalan makul görünen bir değer üretir (`"medium"` yerine `"med"` gibi). Katı şema modları bunu doğrulama hatası olarak yakalar, ki bu bir özelliktir — sessizce zorlamak, bunun üretim verisine sızmasının yoludur.
- **Yapılandırılmış halüsinasyon.** En tehlikeli hata modu: şemaya tamamen uygun ama mükemmel tip kontrolünden geçen uydurma bir değer içeren bir alan. Yapı, şekli garanti eder, doğruluğu değil — makul ama yanlış bir `customerId` şema katmanında hiçbir şeyi bozmaz ve yalnızca akışın devamında ortaya çıkar. Alan düzeyinde akıl sağlığı kontrolleri (bu ID gerçekten var mı? bu sayı makul bir aralıkta mı?) tek gerçek savunmadır.

## Katı şemaların token maliyeti ödünleşimi

Katı şemalar bedava değildir. Çok sayıda opsiyonel alan ve derin iç içe geçme içeren karmaşık şemalar, kısıtlanmış decoding'in token yükünü artırır ve şemanın kendisindeki gereğinden ayrıntılı alan adları ya da açıklamaları, her tek çağrıda context bütçenize karşı sayılır. Çözüm, [LLM token maliyetlerini düşürme](/tr/posts/llm-token-maliyetini-dusurme) yazımızda ele aldığımız aynı disiplin: şemaları alan izin verdiği kadar düz ve alan adlarını kısa tutun, gerçekte kullanmayacağınız alanları istemeyin — kullanılmayan her opsiyonel alan, her çağrıda sonsuza kadar ödenen saf token maliyetidir.

## Sıkça Sorulan Sorular

### Her zaman JSON modu yerine katı yapılandırılmış çıktıyı mı kullanmalıyım?

Şemanızı bildiğinizde evet — hata oranı farkı (kabaca %2-5'e karşı %0,1'in altı) JSON modunu, şemanın kendisinin hâlâ haftadan haftaya değiştiği erken prototipleme dışında haklı çıkarmayacak kadar büyük.

### Yapılandırılmış çıktı kullansam bile Zod ya da Pydantic gibi bir doğrulayıcıya ihtiyacım var mı?

Evet. Yapılandırılmış çıktı şekli garanti eder, doğruluğu değil — şemaya uygun bir yanıt yine de yanlış ya da halüsinasyon bir değer içerebilir, dolayısıyla hangi üretim modunu kullanırsanız kullanın sınır doğrulaması zorunlu kalır.

### Ham bir yapılandırılmış-çıktı şeması yerine ne zaman tool-calling kullanmalıyım?

Modelin yapılandırılmış yanıtı aynı zamanda bir eylemi tetiklemesi gerektiğinde — bir API'yi çağırmak, bir veritabanına yazmak, başka bir ajanı devreye sokmak — tool-calling kullanın. Yalnızca ima edilen bir eylem olmadan tipli veri geri istediğinizde düz bir yapılandırılmış-çıktı şeması yeterlidir.

### Bir onarım döngüsü vazgeçmeden önce kaç yeniden denemeye izin vermeli?

Pratikte iki makul bir varsayılan — model somut doğrulama hatasını gördüğünde geçerli onarımların çoğu ilk yeniden denemede gerçekleşir ve iki denemeden sonra hâlâ başarısız olan bir iş yükünde genelde daha fazla denemek yerine doğrudan düzeltilmeyi hak eden bir şema ya da prompt tasarımı sorunu vardır.
