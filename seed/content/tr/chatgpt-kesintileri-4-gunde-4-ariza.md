---
title: "ChatGPT'nin Kesinti Sorunu: 4 Günde 4 Arıza"
slug: "chatgpt-kesintileri-4-gunde-4-ariza"
translationKey: "openai-reliability-outage-streak-2026"
locale: "tr"
excerpt: "25 Temmuz'da ChatGPT, API ve Codex aynı anda çöktü; bu 4 gün içindeki 4. kesintiydi. Neler oldu ve LLM entegrasyonunuzu bu tür arızalara karşı nasıl korursunuz?"
category: "ai"
tags: ["openai", "chatgpt", "reliability", "best-practices"]
publishedAt: "2026-07-26"
seoTitle: "ChatGPT'nin Kesinti Sorunu: 4 Günde 4 Arıza"
seoDescription: "25 Temmuz'da ChatGPT, API ve Codex aynı anda çöktü; bu 4 gün içindeki 4. kesintiydi. Neler oldu ve LLM entegrasyonunuzu bu tür arızalara karşı nasıl korursunuz?"
---

25 Temmuz Cumartesi sabahı ChatGPT, OpenAI API'si ve Codex dünya genelinde aynı anda çöktü. Kullanıcılar sohbet geçmişlerini yükleyemedi, geliştiriciler API'den 503 hatası aldı ve bu olay OpenAI için dört gün içindeki dördüncü kesintiydi. Bu yazıda gerçekte ne olduğunu, neden art arda tekrarladığını ve bir LLM sağlayıcısına bel bağlayan sistemlerin bu tür arızalara karşı nasıl tasarlanması gerektiğini ele alıyoruz.

## 25 Temmuz'da tam olarak ne oldu?

OpenAI'nin durum sayfası, sabah saatlerinde ChatGPT, geliştirici API'si ve Codex kod asistanında yükselen hata oranlarını doğruladı. Kullanıcılar dünya genelinde hesaplarına giriş yapamadı, kayıtlı sohbetlere ulaşamadı ve isteklerini gönderemedi; birçok kişi kenar çubuğunda sonsuz döngüde dönen bir yükleme animasyonu ve arka planda "eşzamanlı istek çok fazla" hatasıyla karşılaştı. Etkilenen sadece ChatGPT arayüzü değildi: binlerce üçüncü taraf uygulamanın bağlandığı API uç noktaları da aynı anda etkilendi, bu da sorunun tek bir müşteri yüzü değil, paylaşılan bir altyapı katmanında olduğuna işaret ediyordu.

Bu tek başına izole bir olay değildi. OpenAI'nin kendi durum geçmişi, aynı haftanın Çarşamba günü ChatGPT ve API görsel üretiminde yükselen hata oranlarını, Perşembe günü ise API'de genel hatalar ve Codex Review'da ayrı bir bozulmayı kaydetmişti. Cumartesi günkü küresel kesinti, aynı dört günlük pencerede dördüncü servis bozulmasıydı; bu da tekil bir kazadan çok, art arda gelen bir örüntüye işaret ediyor.

## "biscuit_baker_service_me_circuit_open" hatası ne anlatıyor?

Kesinti sırasında geliştiricilerin gördüğü 503 hatalarının çoğu, iç sistem etiketi "biscuit_baker_service_me_circuit_open" ile işaretlenmişti. Bu isimlendirme şaka gibi dursa da teknik olarak oldukça açıklayıcı: "circuit open" ifadesi, bir circuit breaker'ın (devre kesici) tetiklendiğini ve isteklerin arka uçtaki bozulmuş bir servise ulaşmadan reddedildiğini gösteriyor. Yani sorunun kendisi bir circuit breaker'ın yanlış çalışması değil, muhtemelen gerçek bir bozulmayı tespit edip devreyi kasıtlı olarak açan bir koruma mekanizmasıydı; sorun, o mekanizmanın altında yatan servisin neden bozulduğuydu ve OpenAI bunun kök nedenini kesinti sonrasında kamuya açık şekilde paylaşmadı.

OpenAI, olay sırasında araştırma durumundan izleme durumuna yaklaşık bir saat içinde geçti ve bir düzeltme uyguladığını, iyileşmeyi izlediğini duyurdu. Servisler nihayetinde geri geldi ama ayrıntılı bir kök neden analizi (postmortem) şu ana kadar yayımlanmadı; bu da geliştiricilerin aynı sınıf arızanın tekrarlanıp tekrarlanmayacağını değerlendirmesini zorlaştırıyor.

## Bu bir örüntünün parçası

Asıl dikkat çekici olan tek bir kesinti değil, sıklığı. OpenAI'nin durum sayfası geçmişi, sonbahar 2025'ten bu yana yaklaşık dokuz ayda 166 olay kaydetmiş durumda; bu da ortalama ayda 18 olay demek. Bunların hepsi ChatGPT'yi tamamen durduran küresel kesintiler değil, çoğu kısmi bozulmalar veya belirli bölgesel etkiler. Ama art arda gelen dört günlük pencere, bu olayların artık nadir istisnalar değil, üretim üzerinde çalışan herkesin hesaba katması gereken düzenli bir arka plan gürültüsü haline geldiğini gösteriyor.

Bu, OpenAI'ye özgü bir zayıflık değil; büyük ölçekte GPU kısıtlı, hızlı büyüyen bir servisin doğal riski. Ama sonuç aynı: ChatGPT veya OpenAI API'si üzerine kurulu bir özelliğiniz varsa, "sağlayıcı her zaman ayakta olacak" varsayımı artık gerçekçi değil.

| Kesinti tarihi | Etkilenen servis | Belirti |
|---|---|---|
| Çarşamba | ChatGPT + API görsel üretimi | Yükselen hata oranı |
| Perşembe | API (genel) + Codex Review | Ayrı, eşzamanlı bozulmalar |
| Cumartesi | ChatGPT + API + Codex | Küresel kesinti, 503 hataları |

## Geliştiriciler için gerçek etki neydi?

Codex'in de etkilenmesi, olayı sıradan bir tüketici ürünü kesintisinin ötesine taşıyor: Codex üzerinden kod üreten veya CI adımlarını otomatikleştiren ekipler, o pencerede tamamen bloke oldu. API tarafında ise "eşzamanlı istek çok fazla" hatası, sorunun basit bir kapasite darboğazından çok, kimlik doğrulama veya istek yönlendirme katmanındaki bir bozulmaya işaret ettiğini gösteriyor; çünkü normal kapasite sınırlamaları genelde kademeli yavaşlama şeklinde görülür, anlık ve toplu hata patlaması şeklinde değil.

Bunun pratik sonucu şu: tek bir sağlayıcının API'sine senkron ve hataya dayanıksız şekilde bağlı bir üretim akışınız varsa, dört günde bir bu tür bir pencereyi bekleyebilirsiniz. [Rate limiting: token bucket ve sliding window](/tr/posts/rate-limiting-algoritmalari) yazımızda ele aldığımız gibi, kendi tarafınızdaki hız sınırlaması bile karşı taraf çökerse sizi kurtarmaz; asıl soru sistemin bozulmuş bir bağımlılıkla nasıl davrandığı.

## LLM entegrasyonunu dirençli tasarlamak

İyi haber şu ki bu sınıf arızalara karşı dayanıklılık kazandırmanın kanıtlanmış kalıpları var ve bunların hiçbiri yeni değil; sadece LLM API'lerine uygulanması gerekiyor.

```typescript
async function callWithResilience(prompt: string) {
  try {
    return await circuitBreaker.fire(() => primaryProvider.complete(prompt))
  } catch (err) {
    if (circuitBreaker.opened) {
      return await fallbackProvider.complete(prompt) // farklı sağlayıcı
    }
    throw err
  }
}
```

[Retry, backoff ve circuit breaker](/tr/posts/retry-backoff-circuit-breaker) yazımızda detaylandırdığımız gibi, bir circuit breaker kendi tarafınızda da olmalı: sağlayıcı bozulduğunda tekrar tekrar denemek yerine, devreyi açıp trafiği bir yedek yola (farklı bir model veya sağlayıcı) yönlendirmek gerekir. Yeniden denemeler ise üstel geri çekilme (exponential backoff) ile sınırlı olmalı, aksi halde zaten zorlanan bir servise istek fırtınası göndermiş olursunuz.

İkinci kritik nokta idempotency: bir isteği güvenle tekrar gönderebilmeniz için, aynı isteğin iki kez işlenmesi yan etkilere yol açmamalı. [İdempotent API tasarımı](/tr/posts/idempotent-api-tasarimi) yazımızın anlattığı prensipler LLM çağrıları için de geçerli; özellikle bir tool-call bir ödeme veya e-posta gönderimi tetikliyorsa, tekrar denemeden önce isteğin daha önce tamamlanıp tamamlanmadığını kontrol eden bir mekanizma şart. Üretimde çalışan agent'lar için [LLM guardrail kontrol listesi](/tr/posts/uretim-icin-llm-guardrail-kontrol-listesi) yazımız, bu tür bozulma senaryolarını da kapsayan bir kontrol listesi sunuyor.

Üçüncü seçenek ise çok sağlayıcılı mimari: kritik bir akışı tek bir modele değil, örneğin ChatGPT birincil, Claude veya Gemini yedek olacak şekilde tasarlamak. [Gemini mi ChatGPT mi?](/tr/posts/gemini-mi-chatgpt-mi) yazımız iki servisin API davranışlarındaki farkları karşılaştırıyor; bu fark, bir yedek sağlayıcı seçerken doğrudan işinize yarar. Sesli asistanlar tarafında benzer bir çeşitlilik ihtiyacını [AI sesli asistan kıyaslaması](/tr/posts/ai-sesli-asistan-kiyaslamasi-gpt-live-gemini-claude) yazımızda ele aldık.

## Bence tek sağlayıcıya bel bağlamak artık bir risk yönetimi hatası

Açıkçası bu olay bana şunu düşündürdü: 2024'te "hangi model daha iyi" tartışması makul bir öncelikti, ama 2026'da üretim sistemleri için asıl soru "sağlayıcı çöktüğünde ne oluyor" olmalı. Ayda 18 olay ortalamasıyla çalışan bir servise, yedek planı olmadan bel bağlamak, bir bulut sağlayıcısının tek bölgesine yedeksiz dağıtım yapmaktan farksız; sektör bu dersi bulut tarafında zaten öğrendi, LLM API'leri tarafında henüz tam öğrenmedi.

## Sıkça Sorulan Sorular

### OpenAI kesintinin kök nedenini açıkladı mı?

Hayır, şu ana kadar ayrıntılı bir kamu kök neden analizi yayımlanmadı. OpenAI, olayı araştırmadan izlemeye geçtiğini ve bir düzeltme uyguladığını duyurdu, ancak "biscuit_baker_service_me_circuit_open" etiketinin arkasındaki asıl bozulmanın teknik detayı paylaşılmadı.

### Bu tür kesintiler ne sıklıkla oluyor?

OpenAI'nin durum sayfası geçmişine göre sonbahar 2025'ten bu yana yaklaşık dokuz ayda 166 olay kaydedilmiş, yani ortalama ayda 18. Çoğu kısmi ve bölgesel ama 25 Temmuz'daki gibi küresel ve tam kesintiler daha az sıklıkla, ancak düzenli olarak tekrarlanıyor.

### Üretimde ChatGPT API'sine bağımlı bir sistemim var, ne yapmalıyım?

En azından kritik akışlar için bir circuit breaker ve üstel geri çekilmeli yeniden deneme mekanizması ekleyin. Mümkünse ikinci bir sağlayıcıya (Claude, Gemini) geçiş yapabilen bir soyutlama katmanı kurun ve tüm tool-call'ların idempotent olduğundan emin olun; böylece bir kesinti sırasında yeniden deneme yan etkilere yol açmaz.

### Bu sadece OpenAI'ye özgü bir sorun mu?

Hayır, büyük ölçekte çalışan her AI sağlayıcısı benzer risklere sahip. Fark, OpenAI'nin durum sayfasının bu olayları görünür kılması ve son dört günde arka arkaya gelen olayların dikkat çekmesi. Aynı disiplin (yedekleme, circuit breaker, izleme) hangi sağlayıcıyı kullanırsanız kullanın geçerli.
