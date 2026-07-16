---
title: "ChatGPT Work Nedir? OpenAI'ın Yeni İş Ajanı"
slug: "chatgpt-work-nedir-openai-is-ajani"
translationKey: "chatgpt-work-agent-launch"
locale: "tr"
excerpt: "OpenAI'ın ChatGPT Work'ü bir hedefi plana çevirip Slack, Drive ve e-postada uçtan uca yürütüyor. Ne otomatikleştiriyor, hangi noktada hâlâ size ihtiyaç duyuyor?"
category: "ai"
tags: ["chatgpt", "openai", "ai-agents", "automation", "workflow"]
publishedAt: "2026-07-16"
seoTitle: "ChatGPT Work Nedir: OpenAI'ın Yeni İş Ajanı Rehberi"
seoDescription: "ChatGPT Work bir hedefi plana çevirip Slack, Drive ve e-postada yürütüyor. Neyi otomatikleştiriyor, onay adımı nasıl işliyor, hâlâ nerede size ihtiyaç var?"
---

ChatGPT Work, Assistants'ın daha uzun bir tasmayla yeniden markalanması mı? Tam olarak değil. 9 Temmuz 2026'da yayınlanan ve GPT-5.6 tarafından çalıştırılan ChatGPT Work, bir hedefi görünür bir plana çeviren, ardından bağlı uygulamalarınız ve dosyalarınız üzerinde adım adım ilerleyen — ve her şey gönderilmeden önce sizden onay bekleyen — yeni bir mod. Asıl haber, altındaki model değil, bu "önce plan, sonra onay" döngüsü.

## ChatGPT Work, normal ChatGPT'den ne farklı yapıyor

Normal ChatGPT tek seferde bir promptu yanıtlar. ChatGPT Work ise eskiden bir öğleden sonrayı sekme değiştirerek geçirmek anlamına gelen görevler için tasarlandı: bir Slack konuşmasından, paylaşılan bir Drive klasöründen ve bir CRM kaydından bağlam toplayıp bitmiş bir doküman, tablo, sunum, rapor, hatta küçük bir web sitesi üretiyor. Ajan hedefi görebileceğiniz bir plana bölüyor, onaylanan adımları tek tek işliyor ve siz sadece sonucu değil, süreci de yönlendirebiliyorsunuz.

Asıl dikkat çekmesi gereken kısım bu görünür plan. ChatGPT'nin önceki "ajanlı" özellikleri çoğunlukla beklediğiniz opak bir döngü olarak çalışıyordu; ChatGPT Work ise planı, yürütme başlamadan önce düzenleyebileceğiniz bir kontrol listesi olarak açığa çıkarıyor — ajan yanlış paydaşa e-posta atmaya karar verdiği ilk anda bunun ne kadar önemli olduğunu anlarsınız.

## Bağlı uygulamalar, Sites ve Scheduled Tasks

ChatGPT Work; Slack, Microsoft Teams, Google Drive, SharePoint, e-posta, takvimler, CRM platformları ve proje takip araçlarına eklentiler üzerinden bağlanıyor ve tek bir çalıştırmada hepsi üzerinden akıl yürütüyor. Yanında iki tamamlayıcı özellik daha geldi:

- **Sites (genel beta)**: bitmiş bir Work projesini, ayrı bir deploy adımına gerek kalmadan etkileşimli bir siteye ya da web uygulamasına — bir kurs kaynak merkezine, dahili proje takip aracına ya da lansman takvimine — dönüştürüyor.
- **Scheduled Tasks**: ChatGPT'nin bir işi bir kez, düzenli bir takvimde ya da bir tetikleyici olay gerçekleştiğinde çalıştırmasını sağlıyor; örneğin gece boyu gelen müşteri geri bildirimi e-postalarını her sabah özetleyip doğru kanala yönlendirmek gibi.

OpenAI'ın lansman açıklamasına dayanarak zamanlanmış bir işin kavramsal olarak nasıl görünebileceği şöyle:

```json
{
  "task": "summarize-support-inbox",
  "trigger": { "type": "schedule", "cron": "0 8 * * 1-5" },
  "sources": ["gmail:support@company.com", "slack:#customer-feedback"],
  "output": { "type": "sites-dashboard", "notify": ["slack:#cs-leads"] },
  "approval": "required-before-publish"
}
```

Pazarlama metnine körü körüne güvenmemeniz gereken tek ayrıntı da onay kapısı: OpenAI'ın kendi materyalleri, sonuçların "kullanılmadan veya paylaşılmadan önce" gözden geçirilebilir olduğunu belirtiyor; bu da varsayılan duruşun insan onaylı olduğunu, otomatik yayına açık olmadığını ima ediyor — ama bir işi müşteriyle doğrudan temas eden bir şeye bağlamadan önce bunu kendiniz doğrulamanız gerekir.

Bu üç özellik bir arada, ChatGPT Work'ü Zapier ya da Make gibi klasik otomasyon araçlarından ayıran şeyi ortaya koyuyor: kurallar önceden sabitlenmiş deterministik bir senaryo değil, ajanın hedefi gördükten sonra kendisinin çıkardığı bir plan. Bu esneklik bir bedelle geliyor — sabit bir Zapier senaryosunu debug etmek, bir ajanın neden belirli bir adımı attığını geriye doğru izlemekten çoğu zaman daha kolay; otomasyonu üretime almadan önce bu temel farkı ekibinize baştan, açıkça anlatmakta fayda var.

## Yayılım: kimde ne zaman var

Yayılım plan katmanına göre kademeli ilerliyor; beklemeyi düşünüyorsanız bu tablo işinize yarar:

| Katman | Erişim | Not |
|---|---|---|
| Free | Masaüstünde Chat + Codex | Work modu henüz yok |
| Plus / Business | Work modu, sonraki günlerde yayılıyor | Web + masaüstü |
| Pro / Enterprise / Edu | Lansmanda (9 Temmuz) Work modu | Tam eklenti erişimi |
| Masaüstü uygulaması (Mac/Windows) | Her planda Chat, Work, Codex | Lansmanda küresel erişim |

İlginç istisna masaüstü uygulaması: OpenAI orada Chat, Work ve Codex'i Free dahil her plana açtı; web tarafında Work modu ise hâlâ katmana göre kademeli. Bugün ücret ödemeden Work modunu denemek istiyorsanız en hızlı yol masaüstü uygulaması.

## Claude Cowork ve Gemini'nin çalışma alanı hamlesiyle kıyas

ChatGPT Work bir boşluğa doğmuyor. Anthropic'in [Claude Cowork'ü zaten web ve mobile genişledi](/tr/posts/claude-cowork-web-mobil-genisliyor) ve benzer bir "sadece bir promptu değil, tüm projeyi bitiren ajan" vaadiyle geliyor; Google da benzer bir zaman diliminde Gemini'yi Workspace ve Chrome'un derinliklerine itiyor. Üç sağlayıcı da aynı şekle yakınsıyor: ajanı gerçek araçlarınıza bağla, planını görünür yap, yürütmeyi onay arkasına kilitle. [ChatGPT ile Gemini arasında günlük iş için](/tr/posts/gemini-mi-chatgpt-mi) seçim yapıyorsanız 2026 ortasındaki dürüst cevap şu: kazanan, dosyalarınızı ve gelen kutunuzu zaten elinde tutan ekosistem — ajan katmanının kendisi öyle hızlı yakınsıyor ki tek başına zayıf bir ayırt edici.

Asıl yeni olan şey "plan yapabilen bir yapay zeka" değil — [agent mi workflow mu](/tr/posts/ai-agent-mi-workflow-mu) tartışması zaten bir yıldır sürüyor — OpenAI'ın plan-onay arayüzünü bir geliştirici aracı değil, birinci sınıf bir bileşen olarak sunmuş olması. Model yeteneğinden değil, ajanın ne yapmayı planladığını görmeden önce duyduğu güven açığından tıkanan ekipler için gerçek, ama kademeli bir adım bu.

## Dahili araç otomasyonu kuranlar için bunun anlamı

OpenAI API'si üzerine zaten dahili otomasyon kuran ekipler için pratik soru "ChatGPT Work'ü kullanmalı mıyız" değil — altında hangi sağlayıcının modeli çalışıyor olursa olsun, popülerleştirdiği plan-inceleme kalıbının kendi ajan araçlarınıza kopyalamaya değer olup olmadığı. Kendi özel ajanınızı [Model Context Protocol](/tr/posts/model-context-protocol-nedir) üzerinden Slack, bir CRM ve bir ticket sistemine bağlıyorsanız, alınacak ders spesifik ürün değil, görünür ve düzenlenebilir plan adımı. Yürütme başlamadan önce bir insanın değiştirebileceği bir kontrol listesi eklemesi ucuz, bir ajan zaten yanlış bir e-posta ya da kötü bir takvim daveti gönderdikten sonra sonradan eklemek pahalıdır. Kendi ürünleri için [çok ajanlı orkestrasyon kalıplarını](/tr/posts/cok-ajanli-orkestrasyon-kaliplari) değerlendiren ekipler, ChatGPT Work'ün lansmanına yenilmesi gereken bir kıyas noktasından çok, çalınmaya değer bir UX kalıbı olarak bakmalı: planla, göster, onayla, yürüt — planlamayı hangi model yapıyor olursa olsun, her seferinde bu sırayla.

Açıkçası karışık bir görüşüm var: önce-plan-sonra-onay döngüsü doğru varsayılan ve diğer sağlayıcıların da kopyalaması gerekiyor; ama "beş uygulama boyunca çok adımlı proje" tam olarak tek bir yanlış araç çağrısının en hızlı büyüdüğü alan — 9 Temmuz lansmanını, gerçek müşteri verisine dokunan hiçbir şey için henüz oturmuş bir üretim kalıbı değil, umut vaat eden bir beta olarak görün; önce düşük riskli, dahili bir iş akışında deneyin.

## Sıkça Sorulan Sorular

### ChatGPT Work'ü hangi model çalıştırıyor?

ChatGPT Work, 9 Temmuz 2026'da Work lansmanıyla birlikte genel kullanıma açılan [GPT-5.6](/tr/posts/gpt-5-6-genel-kullanima-acildi) üzerinde çalışıyor.

### Hangi ChatGPT planları Work modunu içeriyor?

Pro, Enterprise ve Edu kullanıcıları lansmanda web ve mobilde Work modunu aldı. Plus ve Business erişimi sonraki günlerde yayılıyor. Mac ve Windows masaüstü uygulamasında Work modu Free dahil her planda mevcut.

### ChatGPT Work sonuçları otomatik olarak mı yayınlıyor?

Hayır — OpenAI'ın lansman açıklaması, sonuçların kullanılmadan veya paylaşılmadan önce gözden geçirilebilir olduğunu belirtiyor; yani tamamlanmış bir plan ile dışarı giden herhangi bir şey arasında bir insan onayı var. Work'ü müşteriyle doğrudan temas eden bir şeye bağlamadan önce bu davranışı kendiniz doğrulayın.

### ChatGPT Work, tek başına Scheduled Tasks'tan nasıl farklı?

Scheduled Tasks, Work modu içindeki tek bir yetenek — bir işi zamanlayıcıda ya da tetikleyicide çalıştırmanızı sağlıyor. Work modunun kendisi bağlı uygulamalar üzerindeki daha geniş önce-plan-sonra-yürüt döngüsü; Scheduled Tasks ise tek seferlik bir Work projesini tekrarlayan bir otomasyona çeviren parça.
