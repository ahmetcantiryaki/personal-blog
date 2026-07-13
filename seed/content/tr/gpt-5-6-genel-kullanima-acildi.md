---
title: "GPT-5.6 Genel Kullanıma Açıldı, Codex ChatGPT'ye Taşındı"
slug: "gpt-5-6-genel-kullanima-acildi"
translationKey: "gpt-5-6-general-availability-codex-desktop"
locale: "tr"
excerpt: "GPT-5.6 9 Temmuz'da GA oldu, Codex ChatGPT masaüstüne taşındı. Peki günlük kodlama ajanınızı değiştirmeli misiniz, yoksa bu sadece bir paketleme hamlesi mi?"
category: "ai"
tags: ["llm", "ai-tools", "ai-coding", "developer-experience"]
publishedAt: "2026-07-13"
seoTitle: "GPT-5.6 GA ve Codex ChatGPT Masaüstünde: Rehber"
seoDescription: "GPT-5.6 9 Temmuz'da GA oldu, Codex ChatGPT masaüstüne taşındı. Peki günlük kodlama ajanınızı değiştirmeli misiniz, yoksa bu sadece bir paketleme hamlesi mi?"
---

GPT-5.6, kısa bir önizleme döneminin ardından 9 Temmuz 2026'da genel kullanıma açıldı ve OpenAI aynı gün Codex'i ChatGPT masaüstü uygulamasının içine gömdü. Kısa cevap: Benchmark tarafında değişen çok az şey var, ChatGPT artık ChatGPT, ChatGPT Work ve Codex arasında geçiş yapan tek bir uygulama; asıl soru bunun günlük kodlama ajanınızı değiştirmeye değip değmediği.

## ChatGPT masaüstünde tam olarak ne değişti?

OpenAI'nin duyurusu iki ayrı hamleyi tek pakette birleştiriyor. Birincisi model tarafı: GPT-5.6, Sol, Terra ve Luna adında üç katmanla API'de ve ChatGPT'de yerini aldı. İkincisi ürün tarafı: Codex artık ayrı bir uygulama değil, macOS ve Windows'taki ChatGPT masaüstü uygulamasının bir parçası. Kullanıcı tek bir pencerede sıradan ChatGPT sohbeti, yeni tanıtılan "ChatGPT Work" ajanı ve Codex arasında geçiş yapabiliyor. Eski, bağımsız ChatGPT uygulaması ise "ChatGPT Classic" adını aldı ve varlığını sürdürüyor ama artık ikinci sınıf bir seçenek gibi konumlandırılmış durumda. [9to5Mac'in aktardığına göre](https://9to5mac.com/2026/07/09/openai-announcing-the-next-chapter-for-chatgpt-today-watch-here/) bu, OpenAI'nin ChatGPT'yi bir sohbet kutusundan bir iş yüzeyine dönüştürme planının bir parçası.

Bu, Temmuz 2026'da geliştiricilerin gündemine düşen en somut değişiklik: Codex'i denemek için artık ayrı bir kurulum, ayrı bir hesap akışı ya da CLI bilgisi gerekmiyor. ChatGPT'niz zaten açıksa Codex bir sekme uzağınızda.

## Üç model, tek fiyat listesi: Sol, Terra, Luna

GPT-5.6 ailesi üç katmana ayrılıyor: Sol amiral gemisi model olup biyoloji, kimya ve siber güvenlik gibi uzman görevlere ayarlanmış; Terra günlük kullanım için dengelenmiş; Luna ise hız ve maliyet odaklı en hafif seçenek. Üçü de aynı 1,05 milyon token bağlam penceresini ve 128 bin token maksimum çıktıyı paylaşıyor; bu, katmanlar arasında geçiş yaparken mimariyi yeniden düşünmenize gerek kalmadığı anlamına geliyor.

| Model | Giriş $/Mtoken | Çıkış $/Mtoken | Bağlam | Maks. çıktı |
|-------|----------------|----------------|--------|-------------|
| Sol | $5 | $30 | 1,05M | 128K |
| Terra | $2,50 | $15 | 1,05M | 128K |
| Luna | $1 | $6 | 1,05M | 128K |

Önbelleğe alınmış girişlerde %90 indirim uygulanıyor, önbellek yazma işlemi ise önbelleksiz girişin 1,25 katına mal oluyor. Pratikte bu, aynı sistem promptunu ve repo bağlamını tekrar tekrar gönderen agentic bir iş akışında faturanın Sol'da bile hızla düşebileceği anlamına geliyor. [OpenRouter'ın model sayfasında](https://openrouter.ai/openai/gpt-5.6-sol) bu fiyatlandırma ve token limitleri canlı olarak izlenebiliyor.

## Terminal-Bench 2.1: Sol gerçekten daha mı iyi kodluyor?

İşte asıl merak edilen soru burada başlıyor. OpenAI, Sol için GPQA Diamond'da %94,1, τ²-Bench'te %85,1 ve Coding Index'te %77,4 gibi güçlü sayılar paylaştı. Ama geliştiricilerin en çok önemsediği agentic kodlama testi olan Terminal-Bench 2.1'de tablo şöyle:

| Model | Terminal-Bench 2.1 |
|-------|---------------------|
| Sol Ultra | %91,9 |
| Sol (temel) | %88,8 |
| Claude Mythos 5 | %88,0 |
| GPT-5.5 | %88,0 |

Bu sayılara bakınca ortaya çıkan tablo net: Temel Sol, kendi selefi GPT-5.5 ile neredeyse aynı noktada duruyor ve Claude Mythos 5'ten yalnızca ihmal edilebilir bir farkla ayrılıyor. Sol Ultra üç puanlık bir üstünlük gösteriyor ama bu, "kodlamada devrim" diye pazarlanacak bir sıçrama değil, ölçüm hatası payına yakın bir iyileşme. [Engadget'in haberinde](https://www.engadget.com/2210308/openai-rolls-out-gpt5-6-july-9/) de vurgulandığı gibi GPT-5.6'nın asıl hikâyesi ham yetenekte değil.

## Codex artık ChatGPT'nin içinde: bu bir paketleme hamlesi mi?

Kısacası evet. Terminal-Bench farkının bu kadar küçük olması, OpenAI'nin bu duyuruyu neden bir model lansmanı gibi değil bir dağıtım lansmanı gibi kurguladığını açıklıyor. Codex'i zaten milyonlarca insanın masaüstünde açık duran ChatGPT'ye gömmek, kodlama yeteneğini bir basamak yukarı taşımaktan çok, Codex'in önüne yeni bir kitle çekmek için tasarlanmış bir hamle. [MacObserver'ın haberine göre](https://www.macobserver.com/news/openai-launches-gpt-5-6-chatgpt-work-and-new-desktop-app-with-built-in-codex/) bu birleşme, kullanıcıyı ayrı bir araç indirmeye ikna etme sürtünmesini tamamen ortadan kaldırıyor.

API tarafında değişen pek bir şey yok; yalnızca model adı ve fiyat kalemi güncelleniyor:

```python
# Örnek amaçlıdır, canlı olarak test edilmemiştir.
from openai import OpenAI

client = OpenAI()

response = client.chat.completions.create(
    model="gpt-5.6-sol",
    messages=[
        {"role": "system", "content": "Sen bir kıdemli backend mühendisisin."},
        {"role": "user", "content": "Bu Terraform modülündeki state kilidi hatasını bul."},
    ],
    max_tokens=4096,
)

print(response.choices[0].message.content)
```

Codex'in kendi başına aylık bir fiyatı yok; erişiminiz elinizdeki ChatGPT planına bağlı. Örneğin Plus planı (aylık 20 dolar), beş saatlik dönen bir pencerede kabaca 10-60 bulut görevi ve 20-50 kod incelemesi içeriyor. Bu, Claude Code veya bağımsız Codex CLI'daki kullanım tabanlı faturalandırmadan oldukça farklı bir model; limitleriniz plan seviyenize gömülü.

## Günlük kodlama ajanınızı Codex'e mi taşımalısınız?

Buradaki karar, benchmark tablosundan çok iş akışınızın şekline bağlı. Eğer zaten Claude Code, Cursor veya başka bir özel kodlama ajanı etrafında kurulu bir CI/CD ve subagent mimariniz varsa, sırf ChatGPT'de bir sekme daha açıldı diye o mimariyi sökmenin gerekçesi zayıf. [Arka planda çalışan subagent'lar üzerine yazımızda](/tr/posts/claude-code-subagent-arka-plan-ajanlari) anlattığımız gibi, gerçek üretkenlik kazancı çoğu zaman ajanın modelinden değil, onu çevreleyen orkestrasyon katmanından geliyor; ve o katman bir gecede değiştirilmiyor.

Öte yandan Codex'i hiç denememiş, ChatGPT'yi zaten günlük olarak açık tutan bir ekipseniz, sürtünme neredeyse sıfıra indi. Deneme maliyeti düşük olduğu için hızlı bir pilot çalıştırmak mantıklı; ama kararı "Codex artık ChatGPT'de" cümlesine değil, [ai kod asistanı hatalarına dair yazımızda](/tr/posts/ai-kod-asistani-hatalari) uyardığımız türden gerçek başarısızlık oranlarına dayandırın. Bir ajanın günlük sürücünüz olması için model puanı değil, uzun agentic döngülerde nerede tıkandığı, hangi araç çağrılarında halüsinasyon gördüğü ve gözden geçirme yükünün ne kadar arttığı belirleyici.

Modeller arası genel kıyaslama isterseniz [Claude Sonnet 5, GPT-5.6 ve Gemini 3.5 karşılaştırmamıza](/tr/posts/claude-sonnet-5-gpt-5-6-gemini-3-5-kiyaslamasi) göz atmanızı öneririz; orada fiyat, bağlam ve agentic güvenilirlik aynı çerçevede ele alınıyor. Daha geniş yapay zeka gündemi için de [yapay zeka kategorimizi](/tr/category/yapay-zeka) takip edebilirsiniz.

## ChatGPT Work ve GPT-Live-1: yan taraftaki duyurular

Aynı dalgada iki ek duyuru daha var. "ChatGPT Work" adlı yeni ajan, bir ekibin dağınık notlarını, taslaklarını ve araçlarındaki bağlamı toplayıp bitmiş bir çıktıya dönüştürmeyi vaat ediyor; kodlamadan çok bilgi işçiliğine yönelik bir ürün. Ayrıca GPT-Live-1 ve daha küçük kardeşi GPT-Live-1 mini tanıtıldı: Bunlar sırayla konuşup susmak yerine sürekli dinleyip yanıt verebilen tam çift yönlü (full-duplex) sesli modeller. Her ikisi de bu haftanın odağı değil ama ekosistemin sesli ve iş odaklı ajanlara doğru genişlediğini gösteriyor.

Geliştirici açısından bakıldığında bu yan duyurular, OpenAI'nin ChatGPT'yi tek bir "genel amaçlı iş masası" hâline getirme stratejisinin parçaları. Codex masaüstüne gömülürken ChatGPT Work da aynı pencerede kurumsal bağlamı toplamaya çalışıyor; bu, geliştiricilerin artık kodlama, dokümantasyon ve iletişim araçlarını tek bir uygulamada birleştirmeye zorlanabileceği anlamına geliyor. Ekibiniz zaten farklı araçlar arasında dağılmış bir iş akışı kullanıyorsa, bu konsolidasyonun getirdiği kolaylık ile araç kilitlenmesi riskini birlikte tartmakta fayda var.

## Sıkça Sorulan Sorular

### GPT-5.6 hangi tarihte genel kullanıma açıldı?

GPT-5.6, yaklaşık 26 Haziran 2026'dan beri süren sınırlı bir önizleme döneminin ardından 9 Temmuz 2026'da genel kullanıma açıldı. Aynı gün Codex, ChatGPT masaüstü uygulamasıyla birleştirildi.

### Codex'i kullanmak için ayrı bir ödeme yapmam gerekiyor mu?

Hayır, Codex'in bağımsız bir aylık fiyatı yok. Erişiminiz mevcut ChatGPT planınıza bağlı; örneğin Plus planı beş saatlik dönen bir pencerede sınırlı sayıda bulut görevi ve kod incelemesi içeriyor.

### Sol, Terra ve Luna arasındaki fark nedir?

Sol amiral gemisi model olup biyoloji, kimya ve siber güvenlik gibi uzman görevlerde öne çıkıyor; Terra günlük kullanım için dengelenmiş; Luna ise hız ve düşük maliyet odaklı en hafif seçenek. Üçü de aynı bağlam penceresini ve çıktı limitini paylaşıyor.

### Codex'in ChatGPT'ye taşınması Claude Code veya Cursor kullanıcılarını etkiler mi?

Doğrudan değil. Terminal-Bench 2.1 sayıları Sol'un Claude Mythos 5 ve GPT-5.5 ile neredeyse aynı seviyede olduğunu gösteriyor, dolayısıyla bu bir yetenek sıçraması değil bir dağıtım hamlesi. Kurulu bir agentic iş akışınız varsa değişim gerekçesi zayıf; hiç denememişseniz düşük maliyetli bir pilot mantıklı.
