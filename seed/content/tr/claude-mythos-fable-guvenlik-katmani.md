---
title: "Claude Mythos ve Fable: Güvenlik Katmanı Farkı"
slug: "claude-mythos-fable-guvenlik-katmani"
translationKey: "claude-mythos-fable-safeguards-2026"
locale: "tr"
excerpt: "Kısa cevap: Mythos ve Fable 5.1 aynı model ağırlıklarını paylaşıyor; fark, Mythos'un yalnızca doğrulanmış uzmanlara açık daha esnek güvenlik katmanında."
category: "ai"
tags: ["claude", "ai-regulation", "compliance", "ai-reliability"]
publishedAt: "2026-09-20"
seoTitle: "Claude Mythos ve Fable 5.1: Güvenlik Katmanı Farkı"
seoDescription: "Kısa cevap: Mythos ve Fable 5.1 aynı model ağırlıklarını paylaşıyor; fark, Mythos'un yalnızca doğrulanmış uzmanlara açık daha esnek güvenlik katmanında."
---

Kısa cevap: Anthropic'in 1 Eylül 2026'da yayınladığı Claude Fable 5.1 ve Claude Mythos 5.1, birebir aynı model ağırlıklarını (weights) paylaşıyor; aralarındaki tek fark, üzerlerine bindirilmiş güvenlik katmanının sıkılığı. Fable herkese açıkken, Mythos yalnızca ABD'nin Siber Doğrulama Programı (CVP) ve Yaşam Bilimleri Doğrulama Programı (LSVP) üzerinden onaylanmış kurum ve bireylere açılıyor.

## 1 Eylül 2026'da tam olarak ne çıktı?

Anthropic aynı anda iki model duyurdu: genel kullanıma açık Fable 5.1 ve erişimi kısıtlı Mythos 5.1. İkisi de aynı 1 milyon token bağlam penceresine sahip ve yayın günü itibarıyla Claude API, AWS Bedrock, Google Cloud ve Microsoft Foundry üzerinden erişilebilir durumda — Azure tarafında ABD Veri Bölgesi Standard dağıtımları da dahil.

Fiyatlandırma tarafında Fable 5.1, milyon girdi token başına 10 dolar ve milyon çıktı token başına 50 dolar olarak duyuruldu; önbellek okumaları (cache reads) ise Fable 5'teki 1 dolardan 0,25 dolara, yani %75 düşürüldü. Anthropic'in kendi ölçümüne göre tipik iş yükleri Fable 5'e kıyasla yaklaşık %25, yoğun ajan (agentic) iş yükleri ise yaklaşık %45 daha ucuza geliyor.

## Mythos ve Fable arasındaki güvenlik farkı ne?

Fable 5.1'in kendisi de önceki sürüme göre daha az yanlış pozitif üretiyor: Claude Code kullanıcıları oturum başına Fable 5'e kıyasla yaklaşık %60 daha az siber güvenlik müdahalesiyle karşılaşıyor ve zararsız temel biyoloji ile tıp sorularında biyogüvenlik filtreleri yaklaşık %85 daha az devreye giriyor. Yani Fable 5.1 zaten "daha az gereksiz uyarı veren" bir sürüm.

Mythos 5.1 ise bunun bir adım ötesine geçiyor: siber güvenlik ve yaşam bilimleri alanlarındaki kısıtlamalardan etkilenen, doğrulanmış kişi ve kurumlar için daha da esnek güvenlik ayarları sunuyor. Model kendisi aynı olduğu için performans farkı yok — fark tamamen, modelin hangi isteklere ne kadar temkinli yaklaştığında.

## Neden bir AI şirketi aynı modeli iki güvenlik seviyesinde sunuyor?

Sorun şu: savunma amaçlı bir güvenlik araştırmacısının incelediği bir istismar kodu ile kötü niyetli birinin aynı kodu istemesi, modelin gözünden neredeyse ayırt edilemez görünebiliyor. Herkese aynı sıkı filtreyi uygulamak, meşru araştırmacıların işini yavaşlatıyor; herkese aynı gevşek filtreyi uygulamak ise kötüye kullanım riskini artırıyor. Anthropic'in çözümü, bu iki grubu ayırıp filtre sıkılığını kullanıcının doğrulanmış kimliğine göre değiştirmek — yani güvenlik, modelin kendisinde değil, erişim katmanında uygulanıyor.

Bu yaklaşım, [Claude'un gerçek şirketlere sızdığı güvenlik testinde](/tr/posts/claude-guvenlik-testinde-gercek-sirketlere-sizdi) ortaya çıkan riskle aynı gerilimin bir uzantısı: model ne kadar yetenekli olursa, doğru ellerde faydası da yanlış ellerde zararı da o kadar büyüyor.

## Mythos'a kim, nasıl erişebiliyor?

Mythos 5.1'e iki ayrı doğrulama programı üzerinden erişilebiliyor. Siber Doğrulama Programı (Cyber Verification Program, CVP), şu anda belirli Opus ve Sonnet sınıfı modellere savunma amaçlı güvenlik çalışmaları için azaltılmış siber güvenlik filtreleriyle erişim sağlıyor ve yakın gelecekte Mythos sınıfı modelleri de kapsayacak. Yaşam Bilimleri Doğrulama Programı (Life Sciences Verification Program, LSVP) ise yaşam bilimleri profesyonellerinin Mythos 5.1'i profesyonel araştırma ve geliştirme faaliyetleri için kullanabilmesini hedefliyor; Anthropic, ABD hükümetiyle ortaklık içinde bu programın ilk katılımcılarını kaydettiğini açıkladı.

Bu, Mythos'un bir API anahtarı alıp doğrudan kullanabileceğiniz bir model olmadığı anlamına geliyor — erişim, kimlik ve amaç doğrulamasından geçiyor.

| Özellik | Claude Fable 5.1 | Claude Mythos 5.1 |
|---|---|---|
| Model ağırlıkları | Aynı | Aynı |
| Erişim | Herkese açık (API, AWS, GCP, Azure) | Yalnızca CVP / LSVP üzerinden doğrulanmış kullanıcılar |
| Güvenlik filtreleri | Standart (Fable 5'e göre daha az yanlış pozitif) | Doğrulanmış kullanım senaryoları için daha esnek |
| Bağlam penceresi | 1M token | 1M token |
| Cache okuma fiyatı | Milyon token başına 0,25 dolar | Program şartlarına göre değişir |

## Bu, frontier model yönetişimi için ne anlama geliyor?

Aynı modelin iki farklı güvenlik seviyesinde sunulması, frontier AI laboratuvarlarının riskli yetenekleri tamamen kapatmak yerine erişimi katmanlandırma yoluna gittiğini gösteriyor. Bu, düzenleyiciler ve güvenlik araştırmacıları için hem umut verici hem tartışmalı bir emsal: bir yandan meşru araştırmacıların önündeki gereksiz engelleri kaldırıyor, diğer yandan "kimin doğrulanmış sayılacağına" kimin karar vereceği sorusunu gündeme getiriyor.

## Diğer AI laboratuvarları benzer bir model uyguluyor mu?

Katmanlı erişim fikri Anthropic'e özgü değil, ama Mythos/Fable ayrımını farklı kılan, bunun aynı model ağırlıkları üzerinde, sadece filtre sıkılığı değiştirilerek yapılması. Diğer büyük laboratuvarlar genelde riskli yetenekleri ya tamamen kapatıyor ya da sınırlı bir araştırmacı grubuna erken erişim (early access) programlarıyla açıyor — ama bu programlar genelde geçici ve modelin genel sürümünden ayrı bir model varyantı üzerinden yürütülüyor. Anthropic'in yaklaşımı ise kalıcı, ikiye ayrılmış bir ürün kategorisi oluşturuyor: Fable herkese, Mythos doğrulanmışlara, ikisi de üretim ortamında sürekli kullanılabilir.

Bu fark, kurumsal müşteriler için somut bir karar noktası yaratıyor: bir siber güvenlik ekibi ya da yaşam bilimleri şirketi, günlük işlerinde Fable'ın standart filtrelerinin gerçekten engel olup olmadığını değerlendirip Mythos doğrulamasına başvurmaya değip değmeyeceğine karar vermek zorunda. Çoğu şirket için bu bir eşik sorunu: eğer ekip zaten meşru güvenlik araştırması ya da ilaç geliştirme sürecinde düzenli olarak yanlış pozitiflerle karşılaşıyorsa, doğrulama sürecinin idari yükü muhtemelen buna değer; günlük kullanımda nadiren filtreyle karşılaşan bir ekip için ise Fable'ın kendisi zaten yeterli.

Bu ayrımı önceden değerlendirmenin en pratik yolu, ekibinizin son birkaç ayda Fable'ın standart filtreleriyle kaç kez gerçekten meşru bir işi engelleyecek şekilde karşılaştığını kabaca sayması; bu sayı sıfıra yakınsa doğrulama sürecine girmenin getirisi düşük, düzenli bir sürtünme kaynağıysa CVP veya LSVP başvurusu makul bir sonraki adım. Başvuru süreci kimlik ve amaç doğrulaması gerektirdiği için, bu kararı proje takvimine bağımlı bir işten önce, yeterince erken almak da gecikmeleri önlüyor.

## Sıkça Sorulan Sorular

### Claude Mythos nedir?

Claude Mythos 5.1, Claude Fable 5.1 ile aynı model ağırlıklarını paylaşan ama yalnızca ABD'nin Siber Doğrulama Programı veya Yaşam Bilimleri Doğrulama Programı üzerinden doğrulanmış kişi ve kurumlara açık, daha esnek güvenlik filtrelerine sahip bir sürümdür.

### Claude Fable 5.1 ne kadar tutuyor?

Fable 5.1, milyon girdi token başına 10 dolar ve milyon çıktı token başına 50 dolar olarak fiyatlandırılıyor; önbellek okumaları Fable 5'teki 1 dolardan 0,25 dolara düşürüldü, bu da tipik iş yüklerinde yaklaşık %25, yoğun ajan iş yüklerinde ise yaklaşık %45 maliyet azalması sağlıyor.

### Cyber Verification Program'a kim başvurabilir?

Program, savunma amaçlı güvenlik çalışmaları yürüten, kimliği ve amacı Anthropic tarafından doğrulanabilen güvenlik profesyonelleri ve kurumlar için tasarlandı; şu anda belirli Opus ve Sonnet sınıfı modelleri kapsıyor, Mythos sınıfı modellere erişim ise yakın gelecekte genişletilecek.

### Mythos'un normal Fable'a göre güvenlik açığı riski var mı?

Mythos'un daha esnek filtreleri yalnızca doğrulanmış, kimliği bilinen kullanıcılara açık; bu da genel halka açık Fable'a kıyasla kötüye kullanım riskini teorik olarak sınırlıyor, ancak "doğrulanmış kullanıcı" tanımının ne kadar sıkı uygulandığı, bu modelin ne kadar güvenli kaldığını doğrudan belirliyor.

Claude'un genel model ailesi ve fiyatlandırması hakkında daha fazla bilgi için [Claude Opus 5 Geldi](/tr/posts/claude-opus-5-geldi) yazımıza, Claude'un tarayıcı güvenliği konusundaki yaklaşımı için [Claude in Chrome GA: Geliştirici Güvenlik Rehberi](/tr/posts/claude-in-chrome-ga-gelistirici-guvenlik-rehberi) içeriğimize bakabilirsiniz. Daha fazla yapay zeka güvenliği içeriği için [Yapay Zeka kategorimizi](/tr/category/yapay-zeka) ziyaret edin.

Kaynaklar: [Anthropic'in Fable 5.1 ve Mythos 5.1 duyurusu (VentureBeat)](https://venturebeat.com/technology/anthropics-claude-fable-5-1-and-mythos-5-1-arrive-with-a-75-cost-reduction-for-fable-cache-reads) ve [Claude Fable 5.1 fiyatlandırma analizi](https://www.finout.io/blog/claude-fable-5.1-pricing).
