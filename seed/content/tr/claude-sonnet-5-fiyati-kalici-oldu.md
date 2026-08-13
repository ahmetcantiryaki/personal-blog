---
title: "Claude Sonnet 5'te Zam İptal: Fiyat Kalıcı Oldu"
slug: "claude-sonnet-5-fiyati-kalici-oldu"
translationKey: "claude-sonnet-5-permanent-pricing"
locale: "tr"
excerpt: "Anthropic, Claude Sonnet 5'in $2/$10 fiyatını kalıcı yaptı; 1 Eylül'deki %50 zam iptal edildi. Ama yeni tokenizer faturanızı sessizce şişirebilir."
category: "ai"
tags: ["claude", "llm", "cost-optimization", "finops"]
publishedAt: "2026-08-13"
seoTitle: "Claude Sonnet 5'te Zam İptal: Fiyat Kalıcı Oldu"
seoDescription: "Anthropic, Claude Sonnet 5'in $2/$10 fiyatını kalıcı yaptı; 1 Eylül'deki %50 zam iptal edildi. Ama yeni tokenizer faturanızı sessizce şişirebilir."
---

Anthropic, 10-11 Ağustos 2026'da Claude Sonnet 5'in giriş fiyatlandırmasını —milyon girdi token'ı (MTok) başına 2 dolar, çıktı için 10 dolar— kalıcı hale getirdi. Bu, 1 Eylül 2026'da yürürlüğe girecek olan ve fiyatı 3$/15$'a çıkaracak %50'lik zammı iptal ediyor. Faturanızda kısa vadede değişecek hiçbir şey yok; asıl mesele token sayımınızda.

## Ne değişti, neden önemli

Sonnet 5 piyasaya çıktığında 2$/10$ fiyat "31 Ağustos 2026'ya kadar geçerli giriş fiyatı" olarak duyurulmuştu. Ekim'e giren ekipler bütçelerini 1 Eylül'den itibaren 3$/15$ üzerinden planlıyordu; bazıları için bu, aylık LLM faturasında ciddi bir sıçrama anlamına geliyordu. Anthropic'in resmi fiyatlandırma dokümanına eklenen not durumu net biçimde özetliyor:

> "The $2/$10 per million input/output token pricing for Claude Sonnet 5, announced at launch as introductory pricing through August 31, 2026, is now the standard price. The previously scheduled increase to $3/$15 per million input/output tokens on September 1, 2026 will not occur."

Yani zam iptal ve mevcut entegrasyonlarda hiçbir aksiyon gerekmiyor. Ekiplerin yapması gereken tek şey, Eylül bütçe tablosundaki "3$/15$" satırını silmek.

Bu arada Sonnet 5, önceki nesil Sonnet 4.6'dan (3$ girdi, 15$ çıktı) zaten daha ucuzdu; iptal edilen zam gerçekleşseydi bile iki model neredeyse eşit fiyatlanacaktı. Şimdi Sonnet 5, hem daha yetenekli hem de belirgin biçimde daha ucuz kalıyor — en azından başlık rakamlarına bakınca.

## "Başlık rakamlarına bakınca" dememin sebebi: tokenizer tuzağı

Burada işin biraz daha az cömert bir tarafı var. Claude 4.7 ve sonrası modeller —Sonnet 5 dahil— aynı metin için Sonnet 4.6 ve öncesine kıyasla yaklaşık %30 daha fazla token üretiyor. Yani token başına fiyat düşse de, aynı işi yapmak için harcadığınız token sayısı artıyor; kelime başına gerçek maliyet iyileşmesi, ilk bakışta göründüğünden daha küçük.

Bunu saf bir cömertlik hamlesi olarak okumak yanıltıcı olur. Ağustos 2026 itibarıyla frontier model pazarında fiyat rekabeti kızışmış durumda: OpenAI'nin GPT-5.6 ailesi Temmuz'da genel kullanıma açıldı, Google Gemini 3 Pro benzer bir fiyat bandında konumlandı ve Anthropic'in raporlanan halka arz planları var. Sonnet 5'in fiyatını kalıcılaştırmak, bu ortamda rakiplere karşı savunmacı bir hamle gibi duruyor — tokenizer değişikliğinin getirdiği gizli maliyet artışını hesaba katınca, Anthropic'in gerçekte verdiği indirim, ilan edilen kadar büyük olmayabilir.

Anthropic bu kararın gerekçesini kamuya açık biçimde paylaşmadı; sadece fiyatlandırma dokümanına sessizce bir not eklendi. Ama zamanlama tesadüf gibi durmuyor. Kurumsal müşteriler AI altyapı harcamalarını artık çok daha sıkı denetliyor, FinOps ekipleri model başına birim ekonomiyi çeyreklik bazda raporluyor ve bir rakip her hafta yeni bir fiyat kırma duyurusu yapıyor. Böyle bir ortamda planlanmış bir zammı iptal etmek, hem PR açısından ucuz hem de müşteri kaybını önleyici bir hamle; Anthropic'in cömertliğinden çok, pazarın baskısından söz ediyoruz.

## Fiyat karşılaştırması

| Model | Girdi ($/MTok) | Çıktı ($/MTok) |
|---|---|---|
| Claude Sonnet 5 | $2 | $10 |
| Claude Sonnet 4.6 | $3 | $15 |
| GPT-5.6 Sol | $5 | $30 |
| GPT-5.6 Terra | $2.50 | $15 |
| GPT-5.6 Luna | $1 | $6 |
| Gemini 3 Pro | ~$2 | ~$12 |
| Gemini 3.6 Flash | daha düşük (yüksek hacim) | daha düşük (yüksek hacim) |

Sonnet 5, Batch API üzerinden %50 indirimle 1$/5$ MTok'a de kullanılabiliyor. Prompt caching de ayrı bir çarpan getiriyor: 5 dakikalık cache yazma taban girdi fiyatının 1,25 katı, 1 saatlik cache yazma 2 katı, cache okuma (hit) ise yalnızca 0,1 katı. Yoğun ajan iş yükü çalıştıran ekipler için caching stratejisi, ham token fiyatından çok daha büyük bir etki yaratabilir.

## Faturanızı gerçek token sayımıyla yeniden hesaplayın

Aşağıdaki gibi basit bir hesap, tokenizer farkının etkisini görmek için yeterli:

```python
# Eski varsayım: Sonnet 4.6 token sayımıyla Sonnet 5 fiyatı
words_per_month = 50_000_000
tokens_per_word_old = 1.3       # Sonnet 4.6 tokenizer'ı
tokens_per_word_new = 1.3 * 1.30  # Sonnet 5: ~%30 daha fazla token

old_price_in, old_price_out = 3.0, 15.0   # Sonnet 4.6, $/MTok
new_price_in, new_price_out = 2.0, 10.0   # Sonnet 5, $/MTok

def monthly_cost(tokens_per_word, price_in, price_out, input_ratio=0.6):
    tokens = words_per_month * tokens_per_word
    in_tokens, out_tokens = tokens * input_ratio, tokens * (1 - input_ratio)
    return (in_tokens / 1e6) * price_in + (out_tokens / 1e6) * price_out

old_cost = monthly_cost(tokens_per_word_old, old_price_in, old_price_out)
new_cost = monthly_cost(tokens_per_word_new, new_price_in, new_price_out)

print(f"Sonnet 4.6 tahmini: ${old_cost:,.0f}")
print(f"Sonnet 5 gerçek token sayımıyla: ${new_cost:,.0f}")
print(f"Gerçek tasarruf: %{(1 - new_cost/old_cost) * 100:.1f}")
```

Fiyat etiketine bakarak hesapladığınız tasarruf oranı ile gerçek token sayımıyla hesapladığınız oran arasındaki fark, tam olarak bu %30'luk tokenizer farkından geliyor. Uzun sistem promptu ve büyük bağlam pencereleriyle çalışan ekiplerde bu fark, aylık faturada gözle görülür bir sapmaya dönüşebilir.

## Şimdi ne yapmalı

Kısa cevap: Hiçbir şey — geçiş gerektirmiyor, API anahtarınız veya entegrasyon kodunuz değişmiyor. Ama yapmanız gereken bir şey var: maliyet modelinizi gerçek token loglarınızla yeniden çalıştırın, sadece ilan edilen $/MTok rakamına güvenmeyin. Batch API'ye taşınabilecek asenkron işler varsa %50 indirimi değerlendirin ve tekrarlanan sistem promptlarında prompt caching'i açık biçimde test edin; cache hit oranınız yüksekse toplam faturanız başlıktaki fiyattan çok daha düşük çıkabilir.

Model seçimi konusunda hâlâ kararsızsanız [hangi Claude modelini seçmeniz gerektiğine dair rehberimize](/tr/posts/hangi-claude-modeli-2026-rehberi) göz atabilirsiniz; üst segment iş yükleri için [Claude Opus 5'in geldiğini duyurduğumuz yazı](/tr/posts/claude-opus-5-geldi) da faydalı olabilir. Token maliyetini daha genel olarak düşürmek isteyenler için [LLM token maliyetini düşürme rehberimiz](/tr/posts/llm-token-maliyetini-dusurme) somut teknikler içeriyor. Ajan tabanlı geliştirme akışlarını takip edenler [Claude Code'da auto mode'un varsayılan hale gelmesi](/tr/posts/claude-code-auto-mode-varsayilan-oluyor) yazısına da bakabilir; bir hafta sonunda uçtan uca bir SaaS MVP'nin nasıl kurulduğunu görmek isteyenler için de [Claude Code ile hafta sonu SaaS MVP](/tr/posts/claude-code-ile-hafta-sonu-saas-mvp) yazımız var. Daha fazla yapay zeka haberi için [yapay zeka kategorimize](/tr/category/yapay-zeka) göz atabilirsiniz.

Kaynak olarak Anthropic'in [resmi fiyatlandırma dokümanını](https://platform.claude.com/docs/en/about-claude/pricing) ve haberin [Techmeme derlemesini](https://www.techmeme.com/260810/p42) inceleyebilirsiniz; daha geniş rekabet analizi için [The Stack'in yazısı](https://www.thestack.technology/anthropic-follows-openai-with-frontier-model-price-cuts/) da faydalı bir arka plan sunuyor.

## Sıkça Sorulan Sorular

### Bu fiyat gerçekten kalıcı mı, yoksa yeni bir "geçici" indirim mi?

Anthropic'in resmi dokümanında "artık standart fiyat" ifadesi açıkça kullanılıyor ve 1 Eylül'deki planlanan zammın gerçekleşmeyeceği net biçimde belirtiliyor. Teorik olarak Anthropic ileride fiyatı yine değiştirebilir, ama şu an için 2$/10$ resmi ve süresiz standart fiyat statüsünde.

### Tokenizer değişikliği faturamı tam olarak nasıl etkiliyor?

Sonnet 5, aynı metni Sonnet 4.6'ya göre yaklaşık %30 daha fazla token'a bölüyor. Token başına fiyat düştüğü için toplam maliyet genelde yine de daha düşük çıkıyor, ama beklediğiniz kadar düşük olmayabilir. Doğru karşılaştırma için eski ve yeni token sayımlarını gerçek loglarınızdan alıp hesaplamanız gerekiyor.

### Bu fiyat GPT-5.6 ve Gemini 3 Pro ile nasıl kıyaslanıyor?

Sonnet 5, GPT-5.6 Sol ve Terra'dan ucuz, ama Luna'dan pahalı; Gemini 3 Pro'ya (~2$/~12$) yakın konumlanıyor. Yüksek hacimli, gecikmeye daha az duyarlı işler için Gemini 3.6 Flash veya GPT-5.6 Luna gibi daha ucuz katmanları da değerlendirmek mantıklı olabilir.

### Entegrasyonumda bir şey değiştirmem gerekiyor mu?

Hayır. API endpoint'i, model adı ve fiyatlandırma yapısı aynı kalıyor; bu sadece daha önce geçici olarak duyurulan fiyatın kalıcı hale gelmesi. Yapmanız gereken tek şey, bütçe planlamanızda artık gerçekleşmeyecek olan zam senaryosunu kaldırmak.
