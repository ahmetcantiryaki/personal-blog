---
title: "Claude Linked Billing Nedir, Kime Yarar?"
slug: "claude-linked-billing-nedir"
translationKey: "claude-linked-billing-2026"
locale: "tr"
excerpt: "17 Kasım 2026'da beta'ya açılan Linked Billing, müşterinin Claude API kullanımını kendi Anthropic organizasyonuna faturalamasını sağlıyor — size değil."
category: "ai"
tags: ["claude", "pricing", "saas", "monetization"]
publishedAt: "2026-11-20"
seoTitle: "Claude Linked Billing Nedir? Nasıl Çalışır?"
seoDescription: "17 Kasım 2026'da beta'ya çıkan Linked Billing, Claude API platformlarının kullanım maliyetini billing_policy alanıyla müşteriye aktarmasını sağlıyor."
---

Linked Billing, Anthropic'in 17 Kasım 2026'da beta olarak yayınladığı bir özellik: Claude API üzerine kurulu bir platform, müşterisinin kullanım maliyetini kendi organizasyonuna değil, müşterinin kendi Anthropic organizasyonuna faturalayabiliyor. Müşteri bir kez organizasyonunu bağlıyor, sonrasında her istekte `billing_policy` alanı faturanın kime gideceğini belirliyor.

## Linked Billing Hangi Sorunu Çözüyor?

Bu özellikten önce, Claude üzerine kurulan her platform müşterilerinin tüm API maliyetini üstleniyor, bu maliyeti kendi fiyatlandırması ve kullanım limitleriyle geri kazanmaya çalışıyordu. Bir müşteri ağır bir toplu iş çalıştırdığında patlayan fatura platformun kendi Anthropic hesabına gidiyordu, müşterininkine değil. Linked Billing bu riski taşıyor: müşteri kendi ödeme yapan Anthropic organizasyonunu uygulamanıza bağladıktan sonra, kullanımı doğrudan kendisine faturalanabiliyor — AWS Marketplace veya Snowflake'in bir yeniden satıcının müşterisine temel bulut faturasını doğrudan ödetmesine benzer bir model.

## billing_policy Alanı Nasıl Çalışıyor?

Müşteri önce Anthropic'in organizasyon faturalama bağlantıları akışıyla Claude organizasyonunu uygulamanıza bağlıyor. Bundan sonra uygulamanız `anthropic-beta: user-profiles-billing-2026-10-01` beta başlığını gönderiyor ve her `/v1/messages` ya da `/v1/chat/completions` çağrısına `billing_policy` ekleyerek o isteğin faturasının kime gideceğini belirtiyor.

```http
POST /v1/messages HTTP/1.1
Host: api.anthropic.com
anthropic-beta: user-profiles-billing-2026-10-01
content-type: application/json

{
  "model": "claude-sonnet-5-5",
  "billing_policy": "customer_organization",
  "messages": [{"role": "user", "content": "Bu sözleşmeyi özetle."}]
}
```

Anthropic'in duyurusu `billing_policy` alanının kabul ettiği tüm değerlerin tam listesini yayınlamıyor; bu yüzden üretime almadan önce tahmin yürütmek yerine organizasyon faturalama bağlantıları dokümantasyonunu kontrol etmek gerekiyor.

## Bunu Kim Açmalı?

Linked Billing, müşterilerinin zaten kendi Anthropic organizasyonuna sahip olduğu ya da buna istekli olduğu platformlar, ajan geçitleri ve yeniden satıcılar için tasarlanmış. Claude erişimini başka şirketlere yeniden satan bir geliştirici araçları girişimi için en uygun senaryo bu; sıradan, teknik olmayan kullanıcıları olan bir tüketici uygulaması için ise en zayıf senaryo — çünkü bu kullanıcıların büyük çoğunluğunun hiç Anthropic organizasyonu yok ve sadece ürününüzü kullanmak için bir organizasyon açmayacaklar.

| İş modeli | Anthropic'e bugün kim ödüyor? | Linked Billing'e uygun mu? |
|---|---|---|
| Başka şirketlere API yeniden satan ajan geçidi | Sizin organizasyonunuz | Evet — müşteriler zaten kendi organizasyonunu işletiyor olabilir |
| Kullanımı kullanıcıdan gizleyen, koltuk başına faturalanan dikey SaaS | Sizin organizasyonunuz | Nadiren — teknik olmayan alıcı için sürtünme yaratır |
| Büyük bir kurumun iş birimleri arasında paylaşılan iç araç | Tek bir merkezi organizasyon | Evet — kullanımı talep eden birime geri faturalar |
| Tüketici sohbet uygulaması | Sizin organizasyonunuz | Hayır — tüketiciler bir Claude organizasyonu yönetmez |

## Bu, Kâr Marjınızı Nasıl Değiştirir?

Müşterinizin organizasyonu kendi kullanımını ödediğinde, iş modeliniz "token'ı kâr payı ekleyerek satmaktan" "token maliyeti kaybolduktan sonra da değerli kalan ürünü satmaya" doğru kayıyor. Bu, kayda değer ölçüde farklı bir iş; ancak ürününüzün değeri hâlâ orkestrasyon, arayüz, iş akışı mantığı ve destekten geliyorsa işe yarar. Model fiyatları sürekli değişirken birim ekonomisini düşünen ekiplerin [ucuzlayan token fiyatlarının marjı neden otomatik olarak korumadığını](/tr/posts/ucuzlayan-ai-token-fiyatlari-marj) okuması faydalı olur; çünkü faturayı müşteriye aktarmak fiyatlandırma stratejisi sorununu ortadan kaldırmıyor, sadece hangi kalemde göründüğünü değiştiriyor.

## Dikkat Edilmesi Gereken Noktalar Neler?

Linked Billing'e güvenmeden önce kontrol edilecek üç şey var. Birincisi, Kasım 2026 itibarıyla hâlâ beta aşamasında, bu yüzden sözleşmeyi ve `billing_policy`'nin kabul ettiği değerleri değişebilir kabul edin. İkincisi, ilişkiyi müşteri de kontrol ediyor: Anthropic'in duyurusu, bağlı bir müşterinin uygulamanız için bir harcama limiti koyabileceğini ya da Claude Console üzerinden bağlantıyı istediği an, sizden izin almadan tamamen kesebileceğini doğruluyor. Üçüncüsü, bu yalnızca Anthropic'e zaten doğrudan ödeme yapan müşteriler için çalışıyor — hiç Anthropic hesabı olmayan bir müşteriyle faturayı paylaşmanın genel bir yolu değil.

## Geleneksel Yeniden Satış Modeliyle Farkı Ne?

Geleneksel modelde Claude erişimini Anthropic'ten toptan satın alıp müşterilere kâr payı ekleyerek satıyorsunuz — Anthropic'e kestiğiniz fatura ile müşteriye kestiğiniz fatura iki farklı rakam, aradaki fark da altyapı üzerindeki marjınız. Linked Billing, `billing_policy: customer_organization` etiketli her istek için bu farkı ortadan kaldırıyor: Anthropic, müşterinin kullandığı token'lar için doğrudan müşteriyi faturalıyor, siz bu maliyeti defterlerinizde hiç taşımıyorsunuz. Bu, tipik bir API sarmalayıcısından çok bir bulut pazar yeri listelemesine benziyor — kaynağı kâr payı ekleyerek yeniden satmıyorsunuz, bir kaynağın etrafındaki erişimi ve araçları satıyorsunuz. Ham kullanım üzerindeki marjı ince veya negatif olan bir platform için bu, gerçekte neyin karşılığında ücret aldığınızda anlamlı bir kayma.

## Nasıl Açılır?

Müşterinin Claude organizasyonunu uygulamanıza bağlayabilmesi için organizasyon faturalama bağlantıları akışını kuruyorsunuz; müşteri bağlandıktan sonra isteklerde `billing_policy` göndermeye başlıyorsunuz ve bağlı olmayan her müşteri için kendi organizasyonunuzun faturalamasına geri dönüyorsunuz. Anthropic'in maliyete duyarlı üretim trafiği için güncel amiral gemisi [Claude Fable 5.2](/tr/posts/claude-fable-5-2-mythos-5-2-nedir), Kasım 2026 itibarıyla milyon girdi token'ı için 8 dolar, milyon çıktı token'ı için 40 dolar — müşteri kendi faturasını ödese bile bunu bilmek işinize yarar, çünkü faturadaki sayının neden öyle göründüğünü size soracaklar.

Açıkçası kişisel görüşüm şu: Linked Billing, Anthropic'in "Claude üzerine kurulu" ekosistemi sadece bir sohbet API'si değil, bir altyapı olarak gördüğünün iyi bir işareti; ama şimdilik dar bir platform kesimini ilgilendirecek — özellikle başka teknik ekiplere satış yapanları, son tüketiciye satış yapanları değil. Benzer faturalama ayrıştırmalarının bulut dünyasında zaman içinde standartlaştığını düşünürsek, bu özelliğin önümüzdeki yıl içinde daha fazla AI sağlayıcısında benzer bir biçimde ortaya çıkmasını beklemek makul.

## Türkiye'deki Ekipler İçin Ne Anlama Geliyor?

Claude API üzerine kurulu bir Türkiye merkezli SaaS, kurumsal müşterilerinin genellikle kendi Anthropic organizasyonunu açmaya daha istekli olduğunu, ama bireysel kullanıcıların bunu nadiren yaptığını fark edecektir. B2B tarafında satış yapıyorsanız — örneğin başka şirketlere entegrasyon hizmeti veriyorsanız — Linked Billing, müşterinin kendi bütçesini kendi Console'undan yönetmesini istediği durumlarda satış görüşmesini kolaylaştırabilir; çünkü müşteri harcama limitini kendisi belirliyor, sizin onayınıza ihtiyaç duymuyor. Tüketiciye yönelik bir ürün satıyorsanız bu özelliği şimdilik görmezden gelebilirsiniz; hedef kitlesi net bir şekilde kurumsal. Ajans modeliyle çalışan Türkiye merkezli yazılım şirketleri için de ilgi çekici bir senaryo var: bir ajans, birden fazla kurumsal müşteri için Claude tabanlı çözümler geliştiriyorsa, her müşterinin kendi kullanımını kendi organizasyonundan ödemesi, ajansın tek bir ortak Anthropic hesabında tüm müşterilerin faturasını biriktirip sonradan dağıtmaya çalışmasından çok daha az muhasebe karmaşası ve çok daha az anlaşmazlık riski yaratır.

## Sıkça Sorulan Sorular

### Linked Billing bir faturayı şirketim ve müşteri arasında bölebiliyor mu?

Hayır. Belirli bir istek, gönderdiğiniz `billing_policy` değerine göre ya sizin organizasyonunuza ya da müşterinin bağlı organizasyonuna faturalanıyor; Anthropic'in duyurusu tek bir istek içinde bölünmüş ya da paylaşılan maliyet düzenlemesi tanımlamıyor.

### Müşterimin önceden bir Anthropic hesabı olması gerekiyor mu?

Evet. Linked Billing yalnızca müşteri, Anthropic'e zaten doğrudan ödeme yapan kendi Claude organizasyonunu bağladığında çalışıyor; Claude'u hiç kullanmamış bir müşteriyi bu şekilde ilk kez sisteme dahil edemezsiniz.

### Linked Billing beta dışında kullanılabiliyor mu?

20 Kasım 2026 itibarıyla Linked Billing, `anthropic-beta: user-profiles-billing-2026-10-01` başlığının arkasında beta durumunda. Anthropic'in duyuruları genel kullanıma açılma tarihi vermiyor; kritik faturalama mantığınızı bunun üzerine kurmadan önce resmî dokümantasyondan güncel durumu doğrulayın.

### Müşteri bana haber vermeden Linked Billing'i iptal edebilir mi?

Evet. Müşteri, kendi Claude Console'u üzerinden istediği an uygulamanız için harcama limiti koyabilir ya da bağlantıyı tamamen kesebilir; bu yüzden entegrasyonunuzun kendi organizasyonunuzun faturalamasına aniden geri dönebilmesi gerekiyor.
