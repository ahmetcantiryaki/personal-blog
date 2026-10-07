---
title: "Claude Code'un effort Parametresi Ne İşe Yarar?"
slug: "claude-code-effort-parametresi-nedir"
translationKey: "claude-code-agent-effort-parameter"
locale: "tr"
excerpt: "Kısa cevap: effort, her alt göreve akıl yürütme derinliğini low ile max arasında seçmenizi sağlar; basit işi ucuza, zoru kaliteli yaptırırsınız."
category: "ai"
tags: ["claude", "ai-agents", "ai-coding", "automation"]
publishedAt: "2026-10-07"
seoTitle: "Claude Code effort Parametresi Nedir? Kullanım Rehberi"
seoDescription: "Claude Code'un effort parametresi, Agent aracına verdiğiniz her alt görevin ne kadar derin akıl yürüteceğini low'dan max'a kadar seçmenizi sağlıyor."
---

Kısa cevap: `effort`, Claude Code'un Agent aracına gönderdiğiniz her alt görev için ayrı bir akıl yürütme seviyesi seçmenizi sağlayan yeni bir parametre. 6 Ekim 2026'da yayınlanan Claude Code 2.1.292 ile geldi ve beş değer alıyor: `low`, `medium`, `high`, `xhigh`, `max`. Basit bir dosya araması `low` ile hızlı ve ucuz biterken, karmaşık bir mimari kararı `high` veya `max` ile daha derin düşünülerek çözülüyor.

## Claude Code'un effort Parametresi Tam Olarak Ne Yapar?

`effort` parametresi, bir alt ajana (subagent) ne kadar "düşünme bütçesi" ayrılacağını belirliyor. Daha önce her alt ajan, görevin zorluğundan bağımsız olarak benzer bir akıl yürütme derinliğiyle çalışıyordu; bu da basit işlerde gereksiz token tüketimine, zor işlerde de bazen yetersiz derinliğe yol açabiliyordu. Yeni parametre, görevi başlatan ajana (orkestratöre) bu kararı elle verme imkânı tanıyor.

Resmi değişiklik kaydında bu özellik şöyle tanımlanıyor: "effort parametresi Agent aracına eklendi, böylece Claude bir alt ajanı istediğiniz çalışma seviyesinde çalıştırıyor." Pratikte bu, bir orkestrasyon akışında "bu npm paketinin son sürümünü kontrol et" gibi bir görevi `low` effort ile, "bu modülü yeniden tasarla ve geriye dönük uyumluluğu koru" gibi bir görevi `max` effort ile tetikleyebileceğiniz anlamına geliyor.

## effort Parametresi Nerede ve Nasıl Kullanılır?

effort parametresi, Agent aracını çağıran herhangi bir yerde — ister doğrudan bir Claude Code oturumunda, ister bir mod (plugin) içinde `agent.spawn` hook'u üzerinden — input alanlarına eklenen isteğe bağlı bir anahtar. Belirtilmezse alt ajan varsayılan seviyede çalışıyor; siz sadece zorluk farkı yarattığını düşündüğünüz görevlerde elle seçiyorsunuz.

Aşağıdaki örnek, bir orkestratörün iki farklı zorluktaki görevi nasıl ayırabileceğini gösteriyor:

```json
{
  "tool": "Agent",
  "input": {
    "description": "npm paketinin son sürümünü kontrol et",
    "prompt": "lodash paketinin npm'deki son sürümünü bul ve sadece sürüm numarasını döndür.",
    "effort": "low"
  }
}
```

Aynı orkestratör, zor bir refactoring görevini şu şekilde tetikleyebilir:

```json
{
  "tool": "Agent",
  "input": {
    "description": "Ödeme modülünü yeniden tasarla",
    "prompt": "Ödeme modülünü event-driven mimariye taşı, mevcut API sözleşmesini bozma.",
    "effort": "max"
  }
}
```

## low, medium, high, xhigh, max Arasındaki Fark Ne?

Beş seviye, artan sırayla daha fazla akıl yürütme adımı ve daha fazla token bütçesi anlamına geliyor. `low`, tek adımlık arama veya basit dosya okuma gibi işler için uygun; `medium`, birkaç dosyayı birlikte değerlendiren orta karmaşıklıktaki görevlerde makul bir denge sunuyor. `high` ve üzeri, çok adımlı planlama, çapraz dosya etkisi olan değişiklikler veya belirsizliği yüksek görevlerde devreye giriyor; `max` ise en zor, en çok adım gerektiren görevler için ayrılmış en yüksek seviye.

| Seviye | Ne zaman kullanılır | Tipik görev örneği |
| --- | --- | --- |
| low | Tek adımlık, net sonuçlu işler | Sürüm numarası arama, basit dosya okuma |
| medium | Birkaç dosyayı birlikte değerlendirme | Küçük bir bug'ın kök nedenini bulma |
| high | Çok adımlı planlama gerektiren işler | Yeni bir özelliği baştan sona tasarlama |
| xhigh | Yüksek belirsizlikli, geniş etkili değişiklikler | Çok modüllü bir refactoring |
| max | En zor, en çok adım gerektiren görevler | Mimari göçü uçtan uca yürütme |

## effort Parametresi Maliyeti Nasıl Değiştirir?

Daha yüksek effort seviyesi, daha fazla akıl yürütme adımı çalıştırır ve bu da daha fazla token tüketimi — dolayısıyla daha yüksek maliyet ve daha uzun yanıt süresi — anlamına gelir. Bunun pratik sonucu şu: büyük bir orkestrasyon akışında onlarca alt görevin tamamını `max` effort ile çalıştırmak, bütçenizi gereksiz yere eritir. [AI ajanlarının token harcamasını görünür kılma rehberimizde](/tr/posts/yapay-zeka-finops-token-harcamasi) ele aldığımız gibi, maliyet kontrolü artık sadece model seçimiyle değil, görev başına akıl yürütme derinliğiyle de yapılıyor — effort parametresi bu kontrolü ajan seviyesine indiriyor.

Burada asıl beceri, hangi görevin hangi seviyeyi gerektirdiğini doğru tahmin etmek. Her şeyi `low` ile çalıştırmak ucuz ama riskli; her şeyi `max` ile çalıştırmak güvenli ama pahalı. İkisi arasındaki doğru dengeyi bulmak, [agent mi workflow mu](/tr/posts/ai-agent-mi-workflow-mu) sorusuna benzer bir mühendislik kararı — görevi önceden sınıflandırıp ona göre effort atamak, deneme-hata ile seviye aramaktan daha verimli.

## --marketplace Bayrağıyla Birlikte Gelen Diğer Değişiklikler Ne?

Aynı 2.1.292 sürümü, `claude plugin install` komutuna `--marketplace <source>` bayrağını da ekledi. Bu bayrak, belirtilen marketplace'i gerekirse önce ekliyor (tıpkı `claude plugin marketplace add` komutunun yaptığı güvenlik kontrolleriyle), sonra eklentiyi oradan kuruyor — iki adımı tek komuta indiriyor. [Claude Code eklentilerini kurma ve paylaşma rehberimizde](/tr/posts/claude-code-eklentileri-kur-paketle-paylas) anlattığımız akışa göre bu, birden fazla marketplace kullanan ekipler için kurulum sürtünmesini azaltıyor.

Sürümde ayrıca mod geliştiricileri için birkaç hook eklendi: `prompt.autocomplete` olayı, `$.model.complete` için prompt caching desteği ve `agent.spawn` hook'una workflow agent desteği. Bunların hepsi aynı yönde ilerliyor: Claude Code'u hem bireysel kullanıcı hem de otomasyon inşa eden ekipler için daha programlanabilir hale getirmek.

Bana göre bu küçük görünen parametre, aslında multi-agent orkestrasyonun olgunlaşma işareti. Bir yıl önce "ajanları birbirine bağla" demek yeterliydi; şimdi "hangi ajana ne kadar düşünme bütçesi ayıracağım" sorusu, mühendislik kararının kendisi haline geldi.

## effort Parametresini Yanlış Kullanmanın Yaygın Hataları Ne?

En sık görülen hata, tek bir effort seviyesini tüm orkestrasyon akışına sabitlemek. Bir ekip "güvenli olsun" diyerek her alt görevi `high` ya da `max` ile çalıştırdığında, basit bir dosya okuma işlemi bile gereksiz yere uzun akıl yürütme adımlarından geçiyor ve token faturası hızla şişiyor. Tersi de yaygın: maliyeti düşürmek için her şeyi `low` ile çalıştırmak, çok adımlı planlama gerektiren görevlerde yüzeysel sonuçlara yol açıyor — alt ajan, görevin asıl karmaşıklığını görmeden hızlı bir cevap üretiyor.

İkinci yaygın hata, effort seviyesini görev tanımından önce değil, sonra seçmek. Orkestratör önce görevi tanımlayıp sonra "bu ne kadar zor olabilir" diye tahmin ettiğinde, tahmin genelde düşük çıkıyor — çünkü bir görevin gerçek karmaşıklığı, çoğu zaman alt ajan içine girip dosyaları incelemeden görünmüyor. Daha güvenilir bir yaklaşım, görevi küçük parçalara bölüp her parçaya ayrı effort ataması yapmak: "bu dosyayı bul" kısmı `low`, "bulunan bulgulara dayanarak mimariyi değiştir" kısmı `high` ya da `max` alıyor.

Üçüncü nokta, effort'u tek başına bir kalite garantisi gibi görmek. Yüksek effort, daha fazla akıl yürütme adımı sağlıyor ama alt ajana verilen promptun kendisi belirsizse, yüksek effort da belirsiz bir sonucu netleştirmiyor — sadece daha pahalı bir belirsiz sonuç üretiyor. [AI ajanları için context engineering rehberimizde](/tr/posts/ai-ajanlari-icin-context-engineering) anlattığımız gibi, promptun netliği ile effort seviyesi birbirini tamamlayan iki ayrı karar; biri diğerinin yerini tutmuyor.

## Sıkça Sorulan Sorular

### Claude Code'da effort parametresi nasıl kullanılır?

Agent aracını çağırırken input alanına `effort` anahtarını ekleyip `low`, `medium`, `high`, `xhigh` veya `max` değerlerinden birini veriyorsunuz. Belirtilmezse alt ajan varsayılan seviyede çalışıyor; parametre, görevin zorluğuna göre akıl yürütme derinliğini elle ayarlamanızı sağlıyor.

### effort seviyesi yükseldikçe maliyet ne kadar artıyor?

Kesin oran göreve göre değişiyor, ama genel kural şu: daha yüksek effort, daha fazla akıl yürütme adımı ve dolayısıyla daha fazla token tüketimi demek. Basit görevleri `low`'da, zor görevleri yalnızca gerektiğinde `high` veya üzerinde çalıştırmak toplam maliyeti düşürüyor.

### --marketplace bayrağı ne işe yarıyor?

`claude plugin install` komutuna eklenen `--marketplace <source>` bayrağı, belirtilen marketplace'i gerekirse önce ekleyip ardından eklentiyi oradan kuruyor; `claude plugin marketplace add` ile aynı güvenlik kontrollerinden geçiyor ama iki ayrı komutu tek adıma indiriyor.

### effort parametresi hangi Claude Code sürümünden itibaren var?

6 Ekim 2026'da yayınlanan Claude Code 2.1.292 sürümüyle geldi. Daha eski sürümlerde Agent aracı bu parametreyi kabul etmiyor; güncel sürüme geçmek gerekiyor.
