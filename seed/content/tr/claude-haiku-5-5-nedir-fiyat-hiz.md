---
title: "Claude Haiku 5.5 Nedir? Fiyat ve Hız Karşılaştırması"
slug: "claude-haiku-5-5-nedir-fiyat-hiz"
translationKey: "claude-haiku-5-5-launch-2026"
locale: "tr"
excerpt: "Claude Haiku 5.5, Anthropic'in 7 Ekim 2026'da çıkardığı küçük modeli: 1 milyon token bağlam, serinin en hızlısı, girdi tokeninda 0,10 dolardan başlıyor."
category: "ai"
tags: ["claude", "ai-tools", "llm", "pricing", "performance"]
publishedAt: "2026-10-08"
seoTitle: "Claude Haiku 5.5: Fiyat, Hız ve Bağlam Penceresi"
seoDescription: "Claude Haiku 5.5, girdi tokeninda 0,10 dolardan başlıyor, 1 milyon token bağlam penceresi taşıyor ve Anthropic'in en hızlı modeli, Ekim 2026 itibarıyla."
---

Claude Haiku 5.5, Anthropic'in 7 Ekim 2026'da yayınladığı küçük ve hızlı modelidir. Milyon girdi tokenında 0,10 dolardan, çıktı tokenında 0,50 dolardan başlıyor, 1 milyon token bağlam penceresi taşıyor ve sınıflandırma, bilgi çıkarma ve yönlendirme gibi yüksek hacimli işler için Anthropic'in şu anki en hızlı modeli.

## Haiku 5.5, Haiku 4.5'ten ne kadar ucuz?

Haiku 5.5'in başlangıç fiyatı, Haiku 4.5'in liste fiyatının kabaca onda biri. Haiku 4.5, milyon girdi tokenında 1,00 dolar ve çıktı tokenında 5,00 dolardan fiyatlandırılıyordu; Anthropic'in Ekim 2026 itibarıyla kendi model karşılaştırma tablosunda Haiku 5.5, girdi için "0,10 dolardan başlayan", çıktı için "0,50 dolardan başlayan" fiyatlarla listeleniyor.

Buradaki "başlayan" ifadesi önemli: Anthropic bazı modellerde kademeli veya tanıtım amaçlı giriş fiyatlaması kullanıyor, dolayısıyla pazarlama metninde görünen taban fiyat, her iş yükünün ölçekte ödediği fiyatla aynı olmak zorunda değil. Yine de taban fiyattan tabana karşılaştırmada bile bu, hangi iş yüklerinin ucuz bir açık ağırlıklı alternatif yerine öncü bir laboratuvarın modeliyle çalıştırılmaya değer olduğunu değiştiren türden bir fiyat indirimi. Ayda milyonlarca sınıflandırma çağrısı yapan bir ekip için token başına 10 katlık bir fiyat düşüşü, bütçe kalemi ile yuvarlama hatası arasındaki fark anlamına geliyor.

## Serinin en hızlısı olmasının sebebi ne?

Çünkü Haiku 5.5, maksimum muhakeme derinliği için değil, gecikmeye hassas işler için tasarlandı. Anthropic'in kendi karşılaştırma tablosu, dört güncel modelinin "karşılaştırmalı gecikme" sırasını veriyor — Fable 5.1 (daha yavaş), Opus 5.5 (orta), Sonnet 5.5 (hızlı) ve Haiku 5.5 (en hızlı) — ve Haiku 5.5 bu listenin başında.

| Model | API kimliği | Girdi fiyatı (MTok) | Çıktı fiyatı (MTok) | Hız sıralaması |
|---|---|---|---|---|
| Claude Fable 5.1 | `claude-fable-5-1` | 10,00 $ | 50,00 $ | Daha yavaş |
| Claude Opus 5.5 | `claude-opus-5-5` | 4,00 $ | 20,00 $ | Orta |
| Claude Sonnet 5.5 | `claude-sonnet-5-5` | 2,00 $ | 10,00 $ | Hızlı |
| Claude Haiku 5.5 | `claude-haiku-5-5` | 0,10 $'dan başlar | 0,50 $'dan başlar | En hızlı |

Kaynak: Anthropic'in model genel bakış sayfası, Ekim 2026 itibarıyla.

Haiku 5.5, varsayılan olarak "orta" düşünme efor seviyesiyle çalışıyor; bu, Sonnet 5.5 ile aynı varsayılan, oysa Opus 5.5 ve Fable 5.1 her zaman açık uyarlanabilir düşünme moduyla geliyor. Pratikte bu, siz efor seviyesini açıkça yükseltmediğiniz sürece Haiku 5.5'in cevap vermeden önce daha az "düşünme" süresi harcadığı anlamına geliyor — günde binlerce kez çalışan bir yönlendirme veya bilgi çıkarma adımı için tam olarak istediğiniz denge bu.

## 1 milyon tokenlık bağlam penceresi pratikte ne sağlıyor?

Haiku 5.5'in tek bir istekte kabaca 750.000 kelime okuyabilmesini sağlıyor — Anthropic'in amiral gemisi Opus 5.5 ve Fable 5.1 modelleriyle aynı bağlam tavanı. Bir yıl önce 1 milyon tokenlık bir pencere, bir laboratuvarın serisindeki en pahalı modele ayrılmış bir özellikti; şimdi Anthropic bunu en ucuz modelinde de sunuyor.

Öncü seviye bağlam uzunluğunu küçük model fiyatıyla birleştiren bu kombinasyon, Haiku 5.5'i basit sınıflandırmanın ötesinde ilginç kılıyor. Görev bu bağlam üzerinde Opus seviyesinde muhakeme gerektirmediği sürece, modele orta ölçekli bir kod tabanının tamamını, bir müşteri destek görüşmesinin tüm geçmişini veya uzun bir hukuki belgeyi besleyip hâlâ küçük model fiyatı ödeyebilirsiniz.

## Haiku 5.5 hangi görevler için tasarlandı?

Anthropic'in kendi tanımı net: Haiku 5.5, "sınıflandırma, bilgi çıkarma ve yönlendirme gibi yüksek hacimli, gecikmeye hassas görevler için" yapıldı. Bu, Sonnet 5.5'in "hız ve zekânın en iyi kombinasyonu" veya Opus 5.5'in "uzun süreli ajan tabanlı kodlama ve bilgi işi" tanımından daha dar bir iş tanımı.

Somut olarak bu şu anlama geliyor:

- Destek taleplerini insan kuyruğuna ulaşmadan önce kategoriye göre etiketlemek.
- Yapılandırılmamış metinden ölçekte yapılandırılmış alanlar (tarih, tutar, ad) çekmek.
- Bir isteğin hangi uzman modele veya araca yönlendirileceğine karar vermek — daha pahalı bir modelin önünde bir "trafik polisi" adımı.
- İlk aşama içerik moderasyonu veya spam filtreleme; burada yanlış pozitifler pahalı değil ucuz bir ikinci bakış alıyor.

Basit bir sınıflandırma çağrısı şöyle görünüyor:

```python
import anthropic

client = anthropic.Anthropic()
response = client.messages.create(
    model="claude-haiku-5-5",
    max_tokens=50,
    messages=[
        {"role": "user", "content": "Bu destek talebini sınıflandır: fatura, hata veya özellik-talebi: 'Faturamda çift ücretlendirme görünüyor.'"}
    ],
)
print(response.content[0].text)
```

## Claude Haiku 5.5'e nereden erişilir?

Claude API (`claude-haiku-5-5`), Amazon Bedrock (`anthropic.claude-haiku-5-5`), Google Cloud Vertex AI ve Microsoft Foundry üzerinden; hepsi Sonnet 5.5 ve Opus 5.5 ile aynı model kimliği kalıbını kullanıyor. Anthropic, kendi platformlarında — Claude API, AWS üzerindeki Claude Platform ve Microsoft Foundry — en az 7 Ekim 2027'ye kadar erişilebilir tutma taahhüdü veriyor; Bedrock ve Vertex kendi emeklilik takvimlerini belirliyor.

## Sonnet 5.5 veya Opus 5.5 yerine Haiku 5.5'i ne zaman kullanmalısın?

Görev dar kapsamlıysa, sürekli tekrarlıyorsa ve derin, çok adımlı muhakeme gerektirmiyorsa Haiku 5.5'i kullanın — Sonnet 5.5 veya Opus 5.5'e yükseltmeyi gerçekten buna ihtiyacı olan vakaların küçük bir kısmıyla sınırlayın. Burada dürüst görüşüm şu: çoğu ekip gereğinden fazla kaynak ayırıyor. Her şeyi alışkanlıkla amiral gemisi bir modelden geçiriyorlar; oysa bir basamak sistemi — ilk geçişi Haiku 5.5 yapar, sadece belirsiz veya riski yüksek vakalar Sonnet 5.5'e yükselir — trafiğin büyük kısmında fark edilir bir kalite kaybı olmadan maliyeti kat kat düşürür.

Somut bir örnek üzerinden hesaplayalım: ayda 2 milyon destek talebi işleyen, her biri ortalama 500 girdi tokenı ve 50 tokenlık bir sınıflandırma çıktısı üreten bir kuyruk. Tamamen Sonnet 5.5 üzerinden yönlendirildiğinde bu, sadece girdi maliyeti için ayda kabaca 1.100 dolar demek. Aynı hacim Haiku 5.5'in taban fiyatından geçirildiğinde bu rakam kabaca 100 dolara düşüyor — talebin %10'u belirsiz vakalar için Sonnet 5.5'e yükselse bile, harmanlanmış maliyet her şeyi pahalı modelden geçirmenin çok altında kalıyor. Bu fark, tek-model-her-şeye-uyar boru hattı yerine basamaklı bir tasarımın tüm gerekçesi.

Bu mimariye geçmeden önce belirtilmesi gereken bir uyarı var: basamaklı sistem kendi karmaşıklığını getiriyor. Artık net bir yükseltme kuralına (güven eşiği, belirli etiket kategorileri veya düşük kesinlikli çıktılarda yedek plan), Haiku 5.5'in ilk geçişinin alt akışta ne sıklıkla geçersiz kılındığına dair izlemeye ve ucuz modelin görünür biçimde belirsiz değil sessizce yanlış olduğu vakaları yakalayacak periyodik bir denetime ihtiyacınız var. Bunların hiçbiri kurması zor şeyler değil, ama başlık fiyat farkını kovalamak için bunları atlamak, ekiplerin hızlı ve ucuz bir sınıflandırıcının en önemli %5'lik talebi sessizce yanlış yönlendirmesiyle sonuçlanmasının yolu.

Anthropic'in hangi modelinin iş yükünüze uyduğuna hâlâ karar veremediyseniz, [Claude Opus 5.5 fiyat ve benchmark](/tr/posts/claude-opus-5-5-nedir-fiyat-benchmark) yazımız ve [Claude Sonnet 5.5 anlatımı](/tr/posts/claude-sonnet-5-5-nedir) bu serinin diğer iki üyesini kapsıyor; [2026'da hangi AI aboneliği](/tr/posts/hangi-ai-aboneligi-claude-chatgpt-gemini) ise Claude, ChatGPT ve Gemini'yi tüketici tarafında karşılaştırıyor. Tam model kataloğu için [Yapay Zeka kategorimize](/tr/category/yapay-zeka) bakabilirsiniz.

## Sıkça Sorulan Sorular

### Claude Haiku 5.5'in fiyatı nedir?

Claude Haiku 5.5, Ekim 2026 itibarıyla Claude API'de milyon girdi tokenında 0,10 dolardan, çıktı tokenında 0,50 dolardan başlıyor — Haiku 4.5'in milyon token başına 1,00/5,00 dolarlık fiyatının kabaca onda biri.

### Claude Haiku 5.5'in bağlam penceresi ne kadar?

1 milyon token bağlam penceresi ve yanıt başına 128.000 çıktı tokenı (output-300k beta başlığıyla 300.000) destekliyor — Anthropic'in amiral gemisi Opus 5.5 ve Fable 5.1 modelleriyle aynı bağlam tavanı.

### Claude Haiku 5.5, Sonnet 5.5'ten daha hızlı mı?

Evet. Anthropic'in kendi karşılaştırması, Haiku 5.5'i güncel serisindeki en hızlı model olarak sıralıyor; ardından Sonnet 5.5 ("Hızlı"), Opus 5.5 ("Orta") ve Fable 5.1 ("Daha yavaş") geliyor.

### Claude Haiku 5.5 en çok ne için kullanılır?

Anthropic onu yüksek hacimli, gecikmeye hassas işler için tasarladı: sınıflandırma, veri çıkarma ve isteği doğru araca veya modele yönlendirme — Sonnet 5.5 veya Opus 5.5'in hâlâ daha iyi performans gösterdiği uzun, açık uçlu muhakeme görevleri için değil.
