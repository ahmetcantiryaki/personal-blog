---
title: "Claude ile Ticaret Ajanı Kurmak"
slug: "claude-ile-ticaret-ajani-kurmak"
translationKey: "build-commerce-agent-with-claude"
locale: "tr"
excerpt: "Kısa cevap: Anthropic'in 2 Eylül 2026'da açtığı Claude Commerce Agents blueprint'ini kullan. Ödeme işini modelin dışında, mağazanın kendi checkout'unda tut."
category: "ai"
tags: ["claude", "ai-agents", "automation", "integration"]
publishedAt: "2026-09-06"
seoTitle: "Claude ile Ticaret Ajanı Nasıl Kurulur? (2026)"
seoDescription: "Claude Commerce Agents blueprint'i nedir? Katalog arama, sepet ve sipariş durumu araçlarını, ödeme guardrail'lerini ve prompt injection savunmasını anlatıyoruz."
---

Kısa cevap: Anthropic'in [2 Eylül 2026'da açık kaynak olarak yayınladığı Claude Commerce Agents](https://www.explainx.ai/blog/claude-commerce-agents-open-source-blueprint-september-2026) blueprint'ini temel al. Apache 2.0 lisanslı bu referans mimari, katalog arama, sepet oluşturma ve sipariş sorgulama araçlarını hazır verir; ödeme adımını bilinçli olarak modelin dışında, mağazanın kendi checkout sisteminde tutar.

## Claude Commerce Agents blueprint'i tam olarak ne sağlıyor?

Blueprint, iki çalışan ajanı ve dört sektöre ait demo uygulamayı (perakende, seyahat, telekom, bilet) içeren açık kaynaklı bir referans paketi. Amaç sıfırdan mimari kurmak değil; üretimde denenmiş bir araç seti ve prompt yapısı üzerine kendi kataloğunu bağlamak. Paket bir Claude Code eklentisi olarak da geliyor, yani [Claude Code'un eklenti sistemini](/tr/posts/claude-code-eklentileri-kur-paketle-paylas) zaten biliyorsan kurulum tanıdık gelecek.

Anthropic'in paylaştığı erken veriye göre, Claude tabanlı alışveriş ajanı çalıştıran perakendeciler sepetlerin **%35'e kadar büyüdüğünü** ve alıcıların satın almayı tamamlama olasılığının **%60 arttığını** bildiriyor. Bu rakamlar tek bir vaka çalışmasından geliyor, genel bir garanti değil; ama tasarımın doğru yapıldığında gerçek bir etkisi olduğunu gösteriyor.

## Shopping Agent ile Merchant Agent arasındaki fark nedir?

İkisi farklı kullanıcı için, farklı işi yapar. Shopping Agent müşteriye bakar: kataloğu arar, ürünleri karşılaştırır, sepeti doldurur, politika sorularını (iade, kargo süresi gibi) yanıtlar ve son adımda mağazanın kendi checkout'una devreder. Merchant Agent ise mağaza personeline bakar: satış verisini analiz eder, ürün açıklaması taslağı, fiyat önerisi ve kampanya taslağı hazırlar — ama hepsi insan onayı beklemeden yayına girmez.

Bu ayrım kritik: müşteriye açık bir ajanın kendi kendine fiyat değiştirmesi ya da kampanya başlatması felaket bir hata sınıfı olur. Blueprint bu iki rolü bilinçli olarak ayrı tutuyor; hatta iki ajanın farklı sistem promptları, farklı araç kümeleri ve farklı log kanalları olması öneriliyor ki bir tarafta olan bir hata diğer tarafa asla sızmasın.

## Bir ticaret ajanının araçları nasıl tasarlanmalı?

Üç temel araç yeterli bir Shopping Agent kurmak için: katalog arama, sepet yönetimi ve sipariş durumu sorgulama. Her birinin dar ve öngörülebilir bir kapsamı olmalı; ajanın "her şeyi yapabilen" tek bir araca sahip olması hem hata ayıklamayı zorlaştırır hem de saldırı yüzeyini büyütür.

| Araç | Kapsamı | Neyi yapmamalı |
|---|---|---|
| `search_catalog` | Ürün adı, kategori, fiyat aralığına göre arama | Stok veya fiyat güncellemesi yapmamalı |
| `manage_cart` | Ürün ekleme/çıkarma, miktar değiştirme | Ödeme başlatmamalı, indirim kodu üretmemeli |
| `get_order_status` | Sipariş durumu, kargo takibi sorgulama | Sipariş iptal etmemeli, iade başlatmamalı |

Bu üçü dışında bir işlem gerekiyorsa (iade başlatmak, indirim uygulamak gibi), o adımı ayrı bir onaylı araca veya insan devreye girdiği bir akışa taşı. [AI ajanlarını CI/CD'ye güvenle bağlamak](/tr/posts/ai-ajanlari-cicd-guvenle-baglamak) yazımızdaki kademeli izin mantığı burada da geçerli: önce dar yetkiyle başla, ihtiyaç çıktıkça genişlet.

Blueprint'in dört sektöre ait demo uygulaması, aynı üç aracın farklı kataloglara nasıl uyarlandığını gösteriyor:

| Demo | Katalog türü | Özel senaryo |
|---|---|---|
| Perakende | Fiziksel ürün | Beden/renk varyasyonu, stok kontrolü |
| Seyahat | Uçuş ve otel | Tarih aralığı arama, iptal politikası sorguları |
| Telekom | Tarife ve paket | Mevcut plan karşılaştırma, taahhüt koşulları |
| Bilet | Etkinlik ve koltuk | Zaman baskılı stok, koltuk haritası sorgusu |

Dördü de aynı `search_catalog` / `manage_cart` / `get_order_status` üçlüsünü kullanıyor; değişen tek şey kataloğun veri şeması. Bu, kendi sektörüne uyarlarken mimariyi yeniden tasarlamak yerine yalnızca veri şemasını değiştirmen gerektiği anlamına geliyor.

## Ödemeyi modelin dışında nasıl tutarsın?

Kuralı kesin: model asla kart bilgisi görmemeli, asla ödeme işlemini kendisi tetiklememeli. Shopping Agent, sepeti doldurup müşteriyi mağazanın kendi checkout akışına yönlendirir; ödeme onayı, kart bilgisi ve nihai tahsilat tamamen mağazanın mevcut ödeme altyapısında kalır. Bu, hem PCI-DSS uyumluluğunu basitleştirir hem de bir model halüsinasyonunun gerçek parayı hareket ettirmesini imkânsız kılar.

Bu ayrım, sadece bir uyumluluk kolaylığı değil; sağlam bir mimari sınır aynı zamanda hangi bileşenin denetlenip hangisinin denetlenmeyeceğini de netleştiriyor, çünkü bir denetçi ödeme akışına hiç bakmadan yalnızca ajanın araç çağrılarını inceleyerek risk değerlendirmesi yapabiliyor. Bu prensip, agentic ticaret protokollerinin genel yönü ile de örtüşüyor. OpenAI'ın Instant Checkout'u için geliştirdiği Agentic Commerce Protocol (ACP) Mart 2026'da emekliye ayrılırken, Google'ın Universal Commerce Protocol'ü (UCP) benzer bir "ajan seçer, tüccar tahsil eder" ayrımını koruyor — [detaylar Claude'un ticaret ajanları blueprint'ini inceleyen bir yazıda](https://www.datastudios.org/post/claude-shopping-merchant-agents-anthropic-ai-commerce-blueprints) da geçiyor. Claude'un blueprint'i belirli bir protokole kilitli değil; mağazanın kendi API'siyle konuşan bir araç katmanı öneriyor, bu da seni tek bir ödeme ekosistemine bağımlı bırakmıyor.

## Prompt injection ve aşırı satın almaya karşı hangi guardrail'ler şart?

İki risk sınıfı öncelikli: ürün açıklamalarına gizlenmiş talimatlar (prompt injection) ve ajanın kendi başına bütçe sınırı olmadan sepeti şişirmesi (aşırı satın alma). İlkine karşı, katalogdan gelen her metni "veri" olarak işaretleyip asla "talimat" olarak yorumlamaması gerektiğini sistem promptunda açıkça belirt; ikincisine karşı ise sepet toplamına sabit bir üst sınır ve tekil işlem başına onay eşiği koy.

Somut bir kontrol listesi: sepet toplamı belirli bir tutarı geçtiğinde işlemi durdurup insan onayı iste; ajanın kendi ürettiği hiçbir metni (örneğin "özel indirim kodu") gerçek bir indirim koduymuş gibi uygulamasına izin verme; her araç çağrısını logla ki bir anomalide geriye dönük inceleme yapılabilsin.

`manage_cart` aracının kendisine gömülü basit bir eşik kontrolü, ayrı bir izleme katmanı beklemeden ilk günden devreye girer ve şöyle görünebilir:

```json
{
  "tool": "manage_cart",
  "guardrail": {
    "max_cart_total": 5000,
    "on_exceed": "require_human_approval",
    "trust_catalog_text_as_instruction": false
  }
}
```

Buradaki `trust_catalog_text_as_instruction: false` satırı, katalogdan gelen hiçbir metnin bir komut olarak yorumlanmayacağını açıkça koda döküyor; bu, sistem promptuna güvenmek yerine mimari seviyede bir garanti ve bir sonraki model güncellemesinde promptun davranışı değişse bile bozulmuyor.

## Üretime almadan önce ticaret ajanını nasıl test edersin?

Gerçek parayla test etmeden önce, ajanın araç çağrılarını sahte (mock) bir katalog ve sahte bir sipariş servisiyle uçtan uca test etmen gerekiyor. Blueprint'in demo uygulamaları tam olarak bu amaçla var: gerçek bir mağazaya bağlanmadan önce dört sektörden birine benzeyen bir sahte veri kümesiyle ajanın beklenen sınırlar içinde davrandığını doğrulayabilirsin. Prompt injection senaryolarını da bu aşamada bilerek dene: katalog açıklamasına gizli bir talimat ekleyip ajanın bunu görmezden geldiğini teyit et; bu testi tek seferlik değil, her yeni katalog kaynağı eklediğinde tekrarlanan bir adım haline getir.

Bu test disiplinini genel bir çerçeveye oturtmak istersen, [AI Ajanları Prodüksiyon Öncesi Nasıl Test Edilir](/tr/posts/ai-ajanlari-produksiyon-oncesi-test) yazımızdaki adımlar (sınır durumlarını listelemek, adversarial girdilerle test etmek, insan onay eşiğini simüle etmek) ticaret ajanı için de doğrudan uygulanabilir.

## Sıkça Sorulan Sorular

### Claude Commerce Agents ücretsiz mi, nereden indirilir?

Evet, blueprint Apache 2.0 lisansıyla açık kaynak olarak yayınlandı ve Anthropic'in GitHub deposundan indirilebilir; perakende, seyahat, telekom ve bilet demo uygulamalarıyla birlikte geliyor.

### Ticaret ajanı hangi Claude modeliyle çalışır?

Blueprint belirli bir modele kilitli değil, Claude Developer Platform üzerinden erişilen güncel Claude modelleriyle çalışacak şekilde tasarlandı; karmaşık karşılaştırma ve politika sorularında daha güçlü bir model, basit katalog aramasında daha ucuz bir model tercih edilebilir.

### Bir ticaret ajanı gerçekten ödeme yapabilir mi?

Blueprint'in tasarımında hayır: ajan sepeti doldurur ve müşteriyi mağazanın kendi checkout'una yönlendirir, kart bilgisini asla görmez. Ödemeyi doğrudan bir ajana bağlamak istiyorsan bu, ayrı bir mimari karar ve ayrı bir risk değerlendirmesi gerektirir.

### ACP kapandıysa ticaret ajanları hangi protokolü kullanacak?

Tek bir standart henüz oturmadı: OpenAI'ın ACP'si Mart 2026'da emekliye ayrılırken Google'ın UCP'si ve Microsoft'un Copilot Checkout'u farklı yaklaşımlarla ilerliyor. Claude'un blueprint'i protokolden bağımsız bir araç katmanı önererek bu belirsizliğe karşı esnek kalmayı hedefliyor.
