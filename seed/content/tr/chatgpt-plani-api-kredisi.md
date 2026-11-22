---
title: "ChatGPT Planınız Artık API Kredisi Veriyor"
slug: "chatgpt-plani-api-kredisi"
translationKey: "chatgpt-plan-api-credits-2026"
locale: "tr"
excerpt: "Kısa cevap: Pro kullanıcıları plan fiyatına eşit, Business koltuk türüne göre aylık API kredisi alıyor; kredi ChatGPT fatura ayarlarından talep edilir."
category: "ai"
tags: ["openai", "chatgpt", "pricing", "automation"]
publishedAt: "2026-11-22"
seoTitle: "ChatGPT Pro/Business API Kredisi Nasıl Alınır?"
seoDescription: "ChatGPT Pro ve Business abonelikleri artık aylık API kredisi içeriyor. Kredinizi nereden talep edeceğinizi ve nasıl harcayacağınızı gösteriyoruz."
---

Kısa cevap: ChatGPT Pro aboneleri plan fiyatına eşit (100, 200 veya 500 dolar) aylık API kredisi alıyor; Business aboneleri koltuk türüne göre (Standart 20 dolar, Premium 100 dolar) kredi kazanıyor, işyeri genelinde havuzlanıp ayda en fazla 500 dolara ulaşıyor. Kredi, ChatGPT fatura ayarlarından talep ediliyor.

[OpenAI, 28 Ekim 2026'da](https://cryptobriefing.com/openai-api-credits-chatgpt-pro-business/) uygun Pro ve Business aboneleri için aylık 500 dolara kadar API kredisi duyurdu. Bu, abonelik ücretinizin bir kısmının artık API kullanımına dönüştürülebilir hale geldiği anlamına geliyor — önceden ChatGPT aboneliği ve API kullanımı tamamen ayrı faturalandırılıyor, aralarında hiçbir bağlantı kurulmuyordu.

## Kimler uygun ve krediyi nereden buluyorum?

Pro planında her kademe, kendi plan fiyatına eşit bir kredi alıyor: 100 dolarlık Pro planı 100 dolar kredi, 200 dolarlık kademe 200 dolar, 500 dolarlık kademe 500 dolar kredi veriyor. Business planında ise kredi koltuk türüne bağlı: Standart koltuk ayda 20 dolar, Premium koltuk ayda 100 dolar kredi kazanıyor; bu tutarlar işyeri genelinde havuzlanıyor ve toplam ayda 500 doları geçmiyor. Plus planının bu duyuruda anılmadığını, yani Plus'ın şu an kapsam dışında kalma olasılığının yüksek olduğunu belirtmek gerekiyor. Krediyi görmek ve talep etmek için ChatGPT'nin fatura ayarları ekranına girmeniz yeterli.

## API anahtarını nasıl kurarım?

Krediyi kullanmak için ayrı bir API anahtarı oluşturmanız gerekiyor; ChatGPT abonelik girişiniz API anahtarınızla otomatik eşleşmiyor.

```bash
# 1. platform.openai.com/api-keys adresinden yeni bir anahtar oluşturun
# 2. Anahtarı ortam değişkeni olarak saklayın (asla kod içine yazmayın)
export OPENAI_API_KEY="sk-..."

# 3. Krediniz gerçekten bağlı mı, hızlıca test edin
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

Anahtarı oluşturduktan sonra fatura ayarlarında kredinin API kullanımına düştüğünü görmeye başlıyorsunuz; abonelik ücretiniz değişmiyor, sadece daha önce "kullanılmayan" bir hak aktif oluyor.

## Krediyi tüketecek küçük bir hafta sonu projesi nasıl kurarım?

Krediyi değerlendirmenin en pratik yolu, ücretsiz tahsisatın içine sığan küçük bir araç kurmak. İki örnek, ikisi de düşük maliyetli bir model (örneğin GPT-6.2 Sol) ile çalışır:

- **Metin özetleyici**: Bir klasördeki uzun belgeleri veya haftalık rapor e-postalarını okuyup 3-5 cümlelik özet çıkaran bir betik. [GPT-6.2 Sol'un maliyet avantajını](/tr/posts/gpt-6-2-astra-mi-sol-mu) düşünürsek, haftada yüzlerce sayfalık içeriği özetlemek bile kredinin küçük bir kısmını tüketiyor.
- **Slack/Discord botu**: Kanala gelen mesajları izleyip belirli bir anahtar kelimeye (örneğin "özetle") yanıt veren basit bir webhook botu.

```python
import os
from openai import OpenAI

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

def summarize(text: str) -> str:
    response = client.responses.create(
        model="gpt-6.2-sol",
        input=f"Bu metni 3 maddede özetle:\n\n{text}",
    )
    return response.output_text

# Örnek: bir klasördeki her .txt dosyasını özetle
for filename in os.listdir("raporlar"):
    if filename.endswith(".txt"):
        with open(f"raporlar/{filename}", encoding="utf-8") as f:
            print(filename, "->", summarize(f.read()))
```

Bu betik, Sol'un milyon token başına 2 dolarlık girdi fiyatıyla çalıştığında, orta boy bir rapor klasörünü özetlemek genelde kredinin tamamını değil, yüzde birkaçını tüketiyor — yani krediyi "denemek için" kullanmak, bütçenizi riske atmıyor.

## Harcama hızını nasıl takip ederim?

Kredi havuzunuzun ne kadar hızlı tükendiğini görmeden bir otomasyon çalıştırmak riskli; özellikle bir Slack botu gibi tetiklenme sıklığı sizin kontrolünüzde olmayan bir şey kurduysanız.

| Kontrol noktası | Neden önemli |
|---|---|
| Günlük/haftalık harcama grafiği | Beklenmeyen bir sıçramayı erken fark etmenizi sağlar |
| Model seçimi (Sol vs Astra) | Sol'un fiyatı Astra'nın dörtte biri; yanlışlıkla Astra'ya düşmek bütçeyi hızla eritir |
| Kredi sona erme tarihi | İkincil kaynaklar kredinin her fatura döngüsünde sıfırlandığını bildiriyor; bu durumda biriktirmek mantıksız |
| Codex API anahtarı kullanımı | Bir ikincil kaynağa göre kredi, API anahtarıyla yapılan Codex kullanımını kapsamıyor olabilir; bunu OpenAI'ın yardım merkezinden doğrulayın |

Son iki satırdaki bilgiler ikincil kaynaklardan geliyor ve OpenAI'ın birincil duyurusunda doğrulanmadı; krediyi büyük bir otomasyona bağlamadan önce kendi hesabınızın şartlarını [OpenAI'ın yardım merkezi sayfasından](https://help.openai.com/en/articles/11481834-chatgpt-rate-card-business-enterprise-edu-credit-based-pricing) kontrol etmeniz gerekiyor.

Açıkçası bu hamlenin en akıllıca yanı, abonelik ücretini "kullan ya da kaybet" bir hakka çevirmesi. Önceden Pro aboneliğinizin 200 dolarlık kısmı sadece sohbet arayüzünde kalıyordu; şimdi aynı para, kendi yazdığınız bir araca da akabiliyor. Bu, [ChatGPT Business Premium koltuklarını](/tr/posts/chatgpt-business-premium-seat-125-dolar) değerlendiren ekipler için abonelik kararını da değiştirebilir — Premium koltuğun 100 dolarlık kredisi, koltuğun kendisini kısmen "bedavaya" getirebiliyor.

## Bu hamle OpenAI için neden mantıklı?

Önceki model basitti: ChatGPT aboneliği sohbet arayüzüne, API kullanımı ayrı bir faturaya gidiyordu. Bu ayrım, bir geliştiricinin "madem zaten Pro ödüyorum, neden bir de API için ayrı fatura açayım" diye düşünüp rakip bir sağlayıcıya (örneğin Anthropic'in Claude API'si veya Google'ın Gemini API'si) kaymasını kolaylaştırıyordu. Krediyi abonelik fiyatına gömmek, bu kaçağı kapatıyor: zaten ödediğiniz Pro veya Business ücretinin bir kısmı otomatik olarak API tarafına akıyor, böylece "neden ayrıca ödeyeyim" sorusu ortadan kalkıyor. Bu, abonelik ve API ürünlerini aynı fatura altında birleştirme eğiliminin bir parçası; aynı mantığı [ChatGPT Business Premium koltuklarının](/tr/posts/chatgpt-business-premium-seat-125-dolar) fiyatlandırmasında da görüyoruz.

## Krediyi kullanırken hangi tuzaklara dikkat etmeli?

Üç pratik uyarı var. Birincisi, kredi havuzlu olduğu için Business'ta bir ekip üyesinin tek bir betikle havuzun tamamını tüketmesi mümkün; bu yüzden harcama üst sınırı koymak (API tarafında bütçe uyarıları kurmak) tek kişilik denemeler için bile mantıklı. İkincisi, kredi muhtemelen yalnızca belirli modellerde geçerli olabilir — duyuru bunu netleştirmiyor, bu yüzden pahalı bir modeli varsayılan yapmadan önce fatura ekranında hangi modellerin krediden düşüldüğünü kontrol etmek gerekiyor. Üçüncüsü, kredi aylık bir hak olduğu için onu "biriktirip" büyük bir projeye saklamak, sıfırlanma riski nedeniyle mantıklı değil; küçük ve sürekli bir kullanım, tek seferlik büyük bir patlamadan daha güvenli.

## Daha büyük bir proje için nereden başlamalı?

Özetleyici veya bot gibi tek işlevli bir araçla başlayıp krediyi nasıl tükettiğinizi gördükten sonra, [hafta sonu AI proje fikirleri](/tr/posts/hafta-sonu-ai-projeleri) listesindeki daha kapsamlı projelere geçebilirsiniz. Önemli olan, krediyi önce ucuz ve geri döndürülebilir bir denemede harcamak; doğrudan üretim ortamına bağlı bir otomasyona kredi vermek, harcama hızını öğrenmeden risk almak demek.

## Sıkça Sorulan Sorular

### ChatGPT API kredisi için hangi plan gerekiyor?

Pro ve Business planları bu duyuruda açıkça yer alıyor. Pro'da her kademe kendi plan fiyatına eşit kredi alır; Business'ta kredi koltuk türüne göre değişir ve işyeri genelinde ayda en fazla 500 dolarla sınırlıdır. Plus planının kapsamda olup olmadığı duyuruda belirtilmedi.

### Kredimi nasıl talep ederim?

ChatGPT'nin fatura ayarları ekranına girip krediyi görmeniz ve etkinleştirmeniz gerekiyor. Krediyi kullanmak için ayrıca platform.openai.com üzerinden bir API anahtarı oluşturmanız şart; abonelik girişi tek başına yeterli değil.

### API kredisi her ay sıfırlanıyor mu?

Bir ikincil kaynak kredinin her fatura döngüsünde sona erdiğini bildiriyor, ama bu OpenAI'ın birincil duyurusunda doğrulanmadı. Krediyi biriktirmeyi planlamadan önce OpenAI'ın yardım merkezi sayfasından güncel şartları kontrol edin.

### Kredi, Codex API anahtarı kullanımını da kapsıyor mu?

Bir ikincil rapor, kredinin API anahtarı üzerinden yapılan Codex kullanımını kapsamadığını söylüyor. Bu detay OpenAI'ın birincil kaynağında teyit edilmediği için, büyük bir Codex entegrasyonu planlıyorsanız önce yardım merkezinden doğrulamanız gerekiyor.

### Krediyi hangi modelle harcamak en avantajlı?

Deneme ve küçük otomasyonlar için GPT-6.2 Sol gibi ucuz bir model seçmek, aynı kredi tutarıyla çok daha fazla istek yapmanızı sağlıyor. Sol'un milyon token başına girdi fiyatı Astra'nın dörtte biri olduğu için, krediyi hızlıca tüketmeden çok daha fazla deneme yapma şansı veriyor.
