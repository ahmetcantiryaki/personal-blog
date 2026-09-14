---
title: "AI'nın Yazdığı Kodun Sahibi Kim? Kurucu Rehberi"
slug: "ai-kodunun-sahibi-kim-hukuk"
translationKey: "ai-code-ownership-licensing-startups-2026"
locale: "tr"
excerpt: "Kısa cevap: Salt AI çıktısı telif hakkıyla korunmaz; insan katkısı olan kısımlar korunur. Sağlayıcı 'çıktı sizindir' der ama telif hakkı ayrı bir konu."
category: "business"
tags: ["ai-regulation", "open-source", "compliance", "best-practices"]
publishedAt: "2026-09-14"
seoTitle: "AI Kodunun Sahibi Kim? Kurucular İçin Hukuki Rehber 2026"
seoDescription: "AI'nın yazdığı kod telif hakkıyla korunuyor mu, sağlayıcı şartları ne diyor, lisans kirlenmesi riski nedir ve satın alma öncesi neye bakılır?"
---

Kısa cevap: ABD Telif Hakları Ofisi'ne göre salt AI tarafından üretilen çıktı telif hakkıyla korunmuyor; korunma, insanın yaratıcı katkı sağladığı kısımlarla sınırlı. Claude, ChatGPT veya Gemini'nin kullanım şartlarında "çıktı sizindir" yazması, bu telif hakkı sorusuna cevap vermiyor; iki ayrı konu.

Çoğu kurucu "AI kodu yazdı, sözleşmede çıktı bana ait diyor, o zaman kod benim" diye düşünüyor. Bu varsayım, 2026'da hâlâ sandığınız kadar sağlam değil; hem telif hakkı hukuku hem lisans kirlenmesi riski hem de M&A durum tespiti (due diligence) süreçleri bu konuda farklı sorular soruyor.

## AI çıktısı telif hakkıyla korunabilir mi?

Hayır, salt AI üretimi korunmuyor; ABD hukuku telif hakkı için insan yazarlığı şartı koşuyor. *Thaler v. Perlmutter* davası ve ABD Telif Hakları Ofisi'nin 2025 rehberi bunu netleştirdi: bir insanın hiç müdahale etmediği, uçtan uca AI'nın ürettiği bir kod bloğu, telif hakkı korumasından yoksun kalabilir. Buna karşılık, bir geliştiricinin mimari kararlar aldığı, AI çıktısını düzenlediği ve bütünü şekillendirdiği "AI destekli" bir kod tabanının insan katkısı olan kısımları korunuyor.

Pratikte 2026 başı itibarıyla kurumsal kod tabanlarının yaklaşık yarısı AI destekli öğeler içeriyor; bu da "hangi kısım kimin" sorusunu soyut bir hukuk tartışması olmaktan çıkarıp gündelik bir risk yönetimi meselesine dönüştürüyor.

## Sağlayıcı şartları ne diyor?

Google, Gemini çıktısında yeni fikri mülkiyet üzerinde hak iddia etmediğini, kullanıcının/müşterinin çıktının sahibi olduğunu söylüyor; OpenAI da girdi ve çıktılarınızın sahibi olduğunuzu belirtiyor. Anthropic, OpenAI, Google ve Microsoft, iş/API katmanı verisinin varsayılan olarak model eğitiminde kullanılmadığı pozisyonunda birleşiyor; tüketici sohbet katmanı ise opt-out gerektirebiliyor.

| Sağlayıcı | Çıktı sahipliği | Eğitimde kullanım (varsayılan) |
|---|---|---|
| Anthropic (Claude) | Kullanıcıya ait | İş/API: hayır; tüketici (Free/Pro/Max): evet, opt-out var |
| OpenAI (ChatGPT) | Kullanıcıya ait | Opt-out mevcut, katmana göre değişir |
| Google (Gemini) | Kullanıcıya/müşteriye ait | Ücretsiz: evet (opt-out var); API/Workspace: hayır |

Bu tablo "sözleşmesel sahiplik" sorusuna cevap veriyor, "telif hakkı korumalı mı" sorusuna değil. Bir sağlayıcı size çıktıyı devretse bile, o çıktı hukuken korunmuyorsa üçüncü bir taraf onu kopyalayıp kullanabilir ve sizin dava açacak bir telif hakkınız olmayabilir.

## Lisans kirlenmesi riski gerçek mi?

Evet, ve bu risk GitHub Copilot'a açılan toplu davada somutlaştı: 2022'de başlayan dava, halka açık kod depoları üzerinde lisanssız eğitim yapıldığını ve modelin lisanslı kodu birebir üreterek telif ihlaline yol açtığını iddia ediyordu. Dava 2026 itibarıyla tam çözülmedi ama süreç boyunca ortaya çıkan uzlaşmalar ve politika değişiklikleri, riskin soyut olmadığını gösteriyor.

Pratik risk şu: bir AI aracı, eğitim verisinde gördüğü GPL veya başka kopyleft lisanslı bir kod bloğunu neredeyse birebir önerebilir. Siz bunu fark etmeden ürününüze eklerseniz, ürününüzün tamamı o lisansın koşullarına (kaynak kodu açma zorunluluğu gibi) tabi olma riskiyle karşılaşabilir.

## Alıcılar ve yatırımcılar durum tespitinde neye bakıyor?

Bir M&A veya yatırım turunda, hukuk ekipleri artık kod tabanınızın ne kadarının AI tarafından üretildiğini, hangi araçların kullanıldığını ve lisans taramasının yapılıp yapılmadığını soruyor. Bu sorulara "bilmiyoruz" cevabı vermek, değerlemeyi düşürebilecek bir kırmızı bayrak; [tedarikçi bağımlılığı riskini](/tr/posts/ai-tedarikci-bagimliligi-tek-model) değerlendiren yatırımcılar, aynı özenle AI kod kökenini de soruyor.

| Durum tespiti sorusu | Neden soruluyor |
|---|---|
| Kod tabanının yüzde kaçı AI destekli? | Telif hakkı ve lisans riskini ölçmek için |
| Hangi AI araçları kullanıldı, hangi katmanda? | Eğitim/veri sızıntısı riskini ölçmek için |
| SBOM ve lisans taraması var mı? | Kopyleft kirlenmesini erken yakalamak için |
| AI katkısı kayıt altında mı? | Telif hakkı iddiasını güçlendirmek için |

## Pratikte hangi politika işe yarıyor?

Üç adım, çoğu erken aşama şirket için yeterli: her önemli AI-üretimi kod bloğunu insan gözden geçirmesinden geçirip bunu commit mesajında veya PR'da belirtmek, bir SBOM (yazılım bileşen listesi) aracıyla düzenli lisans taraması yapmak ve katkıcı sözleşmelerinize (varsa) AI kullanımını açıkça yazmak. Bu üçü de tek başına telif hakkı belirsizliğini ortadan kaldırmıyor ama durum tespitinde "bu riski biliyoruz ve yönetiyoruz" diyebilmenizi sağlıyor.

```text
Commit mesajı örneği:
feat: ödeme yeniden deneme mantığı eklendi

AI-destekli taslak (Claude Code), insan incelemesi ve
düzenlemesiyle birleştirildi. Lisans taraması: temiz.
```

[AI ile kod incelemesi](/tr/posts/ai-ile-kod-incelemesi-guven-dogrula) yazımızda savunduğumuz "güven ama doğrula" disiplini burada da geçerli; hatta [Claude Code'un plugin eval komutu](/tr/posts/claude-code-plugin-eval-nasil-kullanilir) gibi araçlar, bir eklentinin davranışını test edip kayıt altına almanızı sağlayarak bu belgelendirme alışkanlığını kod ötesine taşıyor.

Açıkçası kontrarian görüşüm şu: "çıktı benimdir" cümlesini sözleşmede görüp rahatlayan kurucular, aslında yanlış soruyu cevaplıyor. Asıl soru "bu çıktı telif hakkıyla korunuyor mu ve içinde başkasının lisanslı kodu var mı" — ve bu sorunun cevabı sağlayıcı şartlarında değil, sizin tarama ve gözden geçirme sürecinizde yatıyor.

## Açık kaynak katkılarında durum farklı mı?

Evet, açık kaynak projelere AI-üretimi kod göndermek ek bir katman ekliyor: [açık kaynak güvenliğini zorlayan AI çöpü](/tr/posts/ai-copu-acik-kaynak-guvenligi) sorununa benzer şekilde, birçok proje artık PR şablonlarında "bu katkı AI tarafından üretildi mi" diye soruyor. Bakımcılar, telif hakkı sahipliği belirsiz bir katkıyı kabul ederse projenin lisans bütünlüğü riske girebiliyor; bu yüzden büyük projeler katkıcı sözleşmelerini (CLA) AI kullanımını kapsayacak şekilde güncelliyor.

## AI katkısını nasıl kayıt altına alırsınız?

Kayıt tutmanın en pratik yolu, hangi commit veya PR'ın AI yardımıyla üretildiğini, hangi aracın kullanıldığını ve insan gözden geçirmesinin ne kapsamda olduğunu not etmek. Karmaşık bir sisteme gerek yok; PR şablonunuza tek bir zorunlu alan eklemek ("AI aracı kullanıldı mı, hangisi, ne ölçüde düzenlendi") yıl sonunda "kod tabanımızın yüzde kaçı AI destekli" sorusuna dakikalar içinde cevap vermenizi sağlıyor. Bu kaydı tutmayan şirketler, bir durum tespiti sürecinde bu soruyu cevaplamak için geriye dönük commit geçmişini taramak zorunda kalıyor; bu hem zaman kaybı hem de eksik/yanlış bir cevap riski taşıyor.

| Kayıt yöntemi | Efor | Durum tespitinde değeri |
|---|---|---|
| PR şablonunda zorunlu alan | Düşük | Yüksek, anlık raporlanabilir |
| Commit mesajı etiketi | Düşük | Orta, arama gerektirir |
| Kayıt tutmama | Sıfır | Düşük, geriye dönük tarama gerekir |

## Sıkça Sorulan Sorular

### AI'nın yazdığı kodu satabilir miyim?

Kod üzerinde insan katkısı (düzenleme, mimari karar, hata ayıklama) varsa evet, o katkı telif hakkıyla korunuyor ve satılabilir. Ama koddaki salt AI-üretimi kısımlar üçüncü bir tarafın da kullanabileceği, telif hakkı korumasız bir alan olarak kalabilir; bu yüzden büyük bir satış öncesi hangi kısmın nasıl üretildiğini bilmek önemli.

### Sağlayıcının "çıktı sizindir" demesi telif hakkı sorununu çözer mi?

Hayır. Bu cümle sözleşmesel bir devir; sağlayıcı size karşı hak iddia etmeyeceğini söylüyor. Ama çıktının hukuken telif hakkıyla korunup korunmadığı ayrı bir sorudur ve bu, ABD'de insan yazarlığı şartına bağlı; sağlayıcı sözleşmesi bu şartı değiştiremez.

### GPL gibi kopyleft lisanslı kod AI'dan nasıl "sızabilir"?

Model, eğitim verisinde gördüğü lisanslı bir kod bloğunu neredeyse birebir üretebilir; siz bunu fark etmeden kullanırsanız, o kod parçası taşıdığı lisansın koşullarını (örneğin kaynağı açma zorunluluğunu) ürününüze bulaştırabilir. Düzenli SBOM/lisans taraması bu riski erken yakalamanın en pratik yolu.

### Küçük bir startup SBOM taramasına gerçekten ihtiyaç duyar mı?

Erken aşamada zorunlu değil ama ucuz bir sigorta: açık kaynak araçlarla kurulan bir SBOM taraması, bir yatırım turu veya satın alma öncesi sürpriz bir lisans sorunuyla karşılaşma riskini büyük ölçüde azaltıyor. Riski "büyüdüğümüzde hallederiz" diye ertelemek, tam da durum tespitinde sorulan ilk soruların cevabını bilmemenize yol açıyor.
