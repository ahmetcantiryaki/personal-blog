---
title: "Gemini 3.5 Transcribe ile Ses Metne Dönüşür"
slug: "gemini-3-5-transcribe-ses-metin"
translationKey: "gemini-3-5-transcribe-speech-to-text-2026"
locale: "tr"
excerpt: "Gemini 3.5 Transcribe, Google'ın konuşma-metin modeli: 85'ten fazla dil, kayıtlarda 8 konuşmacıya kadar ayrım ve İngilizcede yüzde 2,6 hata oranı."
category: "technology"
tags: [gemini, ai-tools, machine-learning, automation]
publishedAt: "2026-09-28"
seoTitle: "Gemini 3.5 Transcribe: Fiyat, Dil ve Doğruluk Rehberi"
seoDescription: "Gemini 3.5 Transcribe 85'ten fazla dili işliyor, 8 konuşmacıya kadar ayırıyor, yüzde 2,6 hata oranı bildiriyor. Fiyat, API kullanımı ve Whisper kıyası burada."
---

Kısa cevap: Gemini 3.5 Transcribe, Google'ın genel Gemini sohbet modellerinden ayrı, adanmış bir konuşma-metin modeli; 85'ten fazla dilde otomatik dil algılama, kayıtlı seste konuşmacı ayrımı ve kelime bazlı zaman damgası sunuyor — kayıtlı ses için dakika başına yaklaşık 0,005 dolar.

## Gemini 3.5 Transcribe tam olarak nedir?

Bu, sesi yan görev olarak yazıya döken genel amaçlı bir sohbet modeli değil, bu iş için özel olarak inşa edilmiş bir döküm modeli. Bu ayrım gecikme ve maliyet açısından önemli: adanmış bir döküm modeli, aynı zamanda akıl yürüten, kod yazan ve sohbet eden bir modelin yükünü taşımak yerine, sesi hızlıca doğru metne çevirmek için ayarlanmış.

Google, Gemini API üzerinden iki mod sunuyor: kayıtlı ses dosyaları için akış dışı (non-streaming) mod ve ses geldikçe gerçek zamanlı döküm için canlı akış modu. İkisi önemli bir noktada farklı davranıyor — konuşmacı ayrımı (diarization) yalnızca kayıtlı seste mevcut; canlı akış gerçek zamanlı döküm yapıyor ama şu an konuşmacıları ayırmıyor.

## Gerçekte ne kadar doğru?

Google, akış dışı İngilizce dökümde yüzde 2,6, akışlı dökümde ise yüzde 4,0 kelime hata oranı (WER) bildiriyor. Karşılaştırma için, Whisper Large v3, Artificial Analysis lider tablosunun izlediği aynı sınıf akış dışı testte yüzde 4,1 WER alıyor — yani Gemini 3.5 Transcribe, ayrı ayrı izlenen ve doğrudan karşılaştırılmamış rakamlara göre İngilizcede şu an daha düşük bir hata oranı bildiriyor.

Bu karşılaştırmayı kesin değil, yönlendirici olarak görün: Google, Whisper'a karşı doğrudan bir kıyaslama yayımlamadı ve Gemini 3.5 Transcribe yalnızca birkaç hafta önce herkese açıldığı için, aksanlar, gürültü koşulları ve İngilizce dışı diller arasında bağımsız, gerçek dünya kıyasları hâlâ az. Temiz bir kıyaslamadaki WER rakamları, araya konuşma çakışması, arka plan gürültüsü veya güçlü bir bölgesel aksan girince genelde hikayenin tamamını anlatmıyor.

| | Gemini 3.5 Transcribe | Whisper Large v3 |
|---|---|---|
| Akış dışı WER (İngilizce) | %2,6 | %4,1 |
| Akışlı (canlı) destek | Var (%4,0 WER) | Doğal olarak yok |
| Konuşmacı ayrımı | Var, 8 kişiye kadar (yalnızca kayıtlı ses) | Dahili değil |
| Barındırma | Google API, dakika başına ücret | Kendi sunucunuzda, dakika ücreti yok |
| Özel kelime dağarcığı | 1.000 terime kadar | Dahili değil |

## Kullanımı ne kadara mal oluyor?

Kayıtlı (akış dışı) ses, birleşik olarak dakika başına yaklaşık 0,005 dolar — ses girdisi için ~0,003 dolar/dk, yazıya dökülen metin çıktısı için ~0,002 dolar/dk. Canlı akış, gerçek zamanlı işleme için gereken ek altyapıyı yansıtarak daha pahalı: dakika başına yaklaşık 0,009 dolar.

Ara sıra kullanım için mutlak değerde ucuz — bir saatlik kayıtlı ses yaklaşık 0,30 dolara geliyor — ama ölçekte, kendi sunucunuzda çalışan Whisper'ın yapmadığı şekilde birikiyor; çünkü kendi çıkarımınızı çalıştırdığınızda Whisper'ın dakika başına API ücreti yok. Buradaki denge operasyonel: Whisper'ı kendi sunucunuzda barındırmak kendi GPU altyapınızı, model güncellemelerini ve ölçeklendirmeyi yönetmek anlamına gelirken, Gemini API dakika başına ödeme yapıp bunların hepsini atlamak anlamına geliyor.

Binlerce saatlik sesi düzenli işleyen bir ekip için bu fark önemli bir bütçe kalemine dönüşebilir; küçük ölçekli veya düzensiz kullanımda ise yönetilen API'nin operasyonel basitliği, dakika başına ödenen küçük ücreti fazlasıyla karşılıyor.

## Gerçekte hangi dilleri ve konuşmacıları işliyor?

Model, manuel yapılandırma olmadan 85'ten fazla dil ve lehçede konuşmayı otomatik algılıyor ve dil değişimini — bir konuşmacının aynı cümle içinde veya cümleler arasında iki dil arasında geçiş yapmasını — bir sonraki dilin ne olacağını önceden beyan etmenize hiç gerek kalmadan sorunsuzca yönetiyor.

Kayıtlı seste mevcut olan konuşmacı ayrımı, 8 farklı konuşmacıya kadar etiketliyor (`spk_1`, `spk_2` gibi), ama üç veya daha fazla eş zamanlı konuşmacı için atıf doğruluğu Google tarafından deneysel olarak işaretleniyor. İki kişilik bir röportaj veya küçük bir ekip toplantısı için ayrım oldukça sağlam çalışıyor; çok sayıda çakışan sesin olduğu geniş, gürültülü bir yuvarlak masa toplantısı için ise daha fazla manuel düzeltmeye hazır olun.

## API'yi gerçekte nasıl çağırıyorsunuz?

Gemini API üzerinden temel bir döküm isteği, bir ses dosyası alıp isteğe bağlı zaman damgası ve konuşmacı etiketiyle metin döndürüyor:

```python
import google.generativeai as genai

model = genai.GenerativeModel("gemini-3.5-transcribe")
response = model.generate_content(
    [
        {"mime_type": "audio/mp3", "data": audio_bytes},
        "Bu sesi konuşmacı etiketleri ve kelime bazlı zaman damgalarıyla yazıya dök.",
    ]
)
print(response.text)
```

Ürün adları, kısaltmalar veya modelin yanlış duyacağı kişi isimleri gibi alana özgü terimler için, tanımayı beklediğiniz kelimelere yönlendirmek üzere 1.000 terime kadar bir `custom_vocabulary` listesi geçirebilirsiniz; bu, özel kullanım durumlarında doğruluk için temel WER rakamından daha çok önem taşıyor.

## Gerçekte ne için iyi?

Toplantı notları ve röportajlar bariz bir uyum: konuşmacı ayrımı ve kelime bazlı zaman damgası, ham sesi baştan sona taramak yerine belirli bir kişinin belirli bir anda ne söylediğine doğrudan atlamanızı sağlıyor. Podcast ve video altyazısı da aynı zaman damgası kesinliğinden faydalanıyor, çünkü altyazı dosyaları yalnızca doğru kelimeleri değil, kesin zamanlamayı da gerektiriyor.

Canlı kullanım durumları için — bir konuşmayı anlık altyazılamak veya bir telefon görüşmesini gerçek zamanlı yazıya dökmek — akışlı mod doğru araç; bunun karşılığında konuşmacı ayrımından vazgeçip anlık olma karşılığında biraz daha yüksek hata oranı alıyorsunuz. Gerçek ihtiyacınız birebir bir döküm değil de kendi dağınık sesli notlarınızı yapılandırılmış taslaklara çevirmekse, bu tamamen farklı bir iş — bunun için [Gemini'nin Rambler'ı ile sesle taslaklandırma rehberimize](/tr/posts/sesle-calisma-ai-dikte) bakın.

Kayıtlı toplantılar için, ham dökümü kararları ve eylem maddelerini de özetleyen özel bir asistanla eşleştirmek daha faydalı — öne çıkan seçenekleri [AI toplantı asistanları kıyaslamamızda](/tr/posts/ai-toplanti-asistanlari-kiyaslamasi-2026) karşılaştırıyoruz. Sesi baştan kaydetmek için telefon uygulaması, yazılım API'si ve adanmış bir kayıt cihazı arasında karar veremiyorsanız, [AI ses kaydedici cihazlara bakışımız](/tr/posts/ai-ses-kaydediciler-not-cihazlari-2026) bağımsız bir kaydedicinin telefonunuzu ne zaman geçtiğini ele alıyor.

## Sıkça Sorulan Sorular

### Gemini 3.5 Transcribe ücretsiz mi?

Hayır. Gemini API üzerinden dakika başına ücretlendiriliyor — Eylül 2026 itibarıyla kayıtlı ses için birleşik olarak yaklaşık dakika başına 0,005 dolar, canlı akış için yaklaşık dakika başına 0,009 dolar. Açık kaynak Whisper'daki gibi ücretsiz, kendi sunucunuzda barındırma seçeneği yok.

### Gemini 3.5 Transcribe Türkçeyi destekliyor mu?

Evet — 85'ten fazla dil ve lehçede konuşmayı otomatik algılıyor ve Türkçe, Google'ın çok dilli modellerinin hedeflediği yaygın konuşulan diller arasında; ama daha az yaygın ifadeler, belirgin aksanlar veya Türkçe-İngilizce dil değişimli konuşma için doğruluğu, üretime almadan önce kendi kullanım durumunuza göre test etmelisiniz.

### Canlı bir telefon görüşmesinde konuşmacıları ayırabiliyor mu?

Hayır. Konuşmacı ayrımı — farklı konuşmacıları birbirinden ayırıp etiketleme — Eylül 2026 itibarıyla yalnızca kayıtlı ses dosyalarında mevcut. Canlı akış gerçek zamanlı döküm yapıyor ama şu an konuşmacıları ayırmıyor.

### Bu, Gboard'un Rambler'ından nasıl farklı?

İkisi farklı sorunları çözüyor. Rambler, herhangi bir uygulamaya dikte ederken kendi dağınık konuşmanızı yapılandırılmış, düzenlenmiş metne çeviren klavye seviyesinde bir özellik. Gemini 3.5 Transcribe ise toplantı veya röportajlardaki başkalarının sesleri dahil, herhangi bir sesin doğru, çoğunlukla birebir dökümünü zaman damgası ve konuşmacı etiketiyle üreten bir geliştirici API'si — temizlenmiş bir yeniden yazım değil.

**Kaynaklar:** [Google — Gemini 3.5 Transcribe ile akıllı döküm](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-5-transcribe/), [OrcaRouter — Gemini 3.5 Transcribe ve Whisper Large v3 Turbo kıyası](https://www.orcarouter.ai/blog/gemini-3-5-transcribe-vs-whisper-large-v3-turbo), [eesel AI — Gemini 3.5 Transcribe fiyat ve doğruluk](https://www.eesel.ai/blog/gemini-3-5-transcribe).
