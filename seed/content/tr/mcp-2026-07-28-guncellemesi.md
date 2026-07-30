---
title: "MCP 2026-07-28: Stateless Çekirdeğe Geçiş Rehberi"
slug: "mcp-2026-07-28-guncellemesi"
translationKey: "mcp-2026-07-28-stateless-spec"
locale: "tr"
excerpt: "MCP'nin 28 Temmuz 2026 güncellemesi stateful oturumları kaldırıyor, çok adımlı çağrılar ekliyor ve OAuth'u sıkılaştırıyor; eski sunucular 12 ayda kırılıyor."
category: "ai"
tags: ["mcp", "claude", "api-design", "authentication"]
publishedAt: "2026-07-30"
seoTitle: "MCP 2026-07-28: Stateless Çekirdek ve Yeni Auth"
seoDescription: "MCP'nin 2026-07-28 güncellemesi stateless çekirdeğe geçiyor, MRTR ve önbellekleme ekliyor; sunucunuzu nasıl güncelleyeceğinizi baştan sona anlatıyoruz."
---

28 Temmuz 2026'da Model Context Protocol ekibi, protokolün yayımlandığından bu yana gördüğü en büyük spesifikasyon güncellemesini yayınladı: MCP, çift yönlü ve oturum tabanlı çekirdeğini bırakıp stateless (durumsuz) bir istek/yanıt modeline geçiyor, `initialize` el sıkışmasını ve `Mcp-Session-Id` başlığını emekliye ayırıyor, OAuth tarafında ise mevcut sunucuları kırabilecek sertleştirmeler getiriyor.

MCP'ye daha önce hiç dokunmadıysanız, bu yazıdan önce [MCP'nin ne olduğunu anlattığımız rehbere](/tr/posts/model-context-protocol-nedir) bakmanız daha mantıklı olur. Geri kalan herkes için: [resmi duyuru](https://blog.modelcontextprotocol.io/posts/2026-07-28/) ve daha teknik detay içeren [release candidate yazısı](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/) bu güncellemeyi protokolün iki yıllık geçmişindeki en köklü değişiklik olarak tanımlıyor; özellikle yetkilendirme değişiklikleri, üretimde MCP sunucusu çalıştıran hiç kimsenin es geçemeyeceği bir konu.

## "Stateless" başlığının arkasındaki neden

MCP, ilk iki yılında pek çok HTTP-üzerinden-RPC protokolünün yaptığı gibi çalışıyordu: istemci ve sunucu `initialize`/`initialized` ile el sıkışıyor, sunucu bir `Mcp-Session-Id` döndürüyor ve sonraki her istek bu oturuma bağlı kalıyordu. İşe yarıyordu ama sunucunun istekler arasında "sizi hatırlaması" gerekiyordu — yatay ölçeklendirmeyi zorlaştıran tam olarak bu tür bir bağımlılıktı.

2026-07-28 spesifikasyonu bu gerekliliği tamamen kaldırıyor. Artık her istek, protokol sürümünü, istemci kimliğini ve yetenekleri kendi metadata'sında taşıyor; yani sunucunun "hatırlaması" gereken hiçbir şey kalmıyor. Pratikte bu, MCP sunucularının paylaşımlı bir oturum deposu olmadan sıradan bir round-robin yük dengeleyicinin arkasında çalışabilmesi anlamına geliyor; bu da serverless ve edge dağıtımını gerçek anlamda uygulanabilir kılıyor — stateful modelde teknik olarak mümkün ama pratikte can sıkıcıydı. [The Register'ın haberi](https://www.theregister.com/devops/2026/07/23/model-context-protocol-prepares-to-break-with-its-stateful-past/) bunu doğru bir şekilde, MCP'nin orijinal transport tasarımının üretim ölçeğine yetmediğinin itirafı olarak çerçeveliyor.

## Multi Round-Trip Requests, açık akış deseninin yerini alıyor

Eski spesifikasyonda sunucular, istekleri istemciye uzun süre açık kalan bir akış üzerinden geri gönderebiliyordu — "araç çağrısının ortasında kullanıcıya bir takip sorusu sormam gerekiyor" gibi durumlar için kullanışlıydı, ama araya bir proxy, zaman aşımı ya da yük dengeleyici girdiğinde kırılgan hale geliyordu. Multi Round-Trip Requests (MRTR) bunun yerine çok daha basit bir döngü getiriyor: bir araç çağrısı, neye ihtiyacı olduğunu belirten `resultType: "input_required"` döndürebiliyor, istemci de yanıtı `inputResponses` içinde taşıyan yeni bir çağrıyla karşılık veriyor. Ne açık bir bağlantı gerekiyor ne de sunucu tarafında beklerken bakım gerektiren bir durum.

## Header tabanlı yönlendirme ve önbelleklenebilir okumalar

Çekirdek değişikliğin yanında iki küçük ama gerçekten kullanışlı yenilik daha var. Birincisi, istekler artık `Mcp-Method` ve `Mcp-Name` HTTP başlıklarını içermek zorunda; bu sayede bir gateway ya da WAF, her isteğin JSON gövdesini ayrıştırmak yerine sadece başlıklara bakarak trafiği yönlendirip ölçümleyebiliyor. İkincisi, list ve read yanıtları artık `ttlMs` ve `cacheScope` alanlarını taşıyor; böylece istemciler her çağrıda araç listesini yeniden çekmek yerine sonuçları düzgünce önbelleğe alabiliyor — `tools/list`'i ihtiyacından fazla çağıran her sistem için gecikmeyi ve maliyeti gözle görülür biçimde azaltacak küçük ama etkili bir düzeltme.

```http
POST /mcp HTTP/1.1
Host: api.example.com
Mcp-Method: tools/call
Mcp-Name: schedule_meeting
Content-Type: application/json
Authorization: Bearer <token>

{
  "protocolVersion": "2026-07-28",
  "clientInfo": { "name": "acme-agent", "version": "3.1.0" },
  "params": { "name": "schedule_meeting", "arguments": { "attendee": "user@example.com" } }
}
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "resultType": "input_required",
  "requiredInputs": [{ "name": "preferredTime", "type": "string" }]
}
```

İstemci ardından `"inputResponses": { "preferredTime": "2026-08-04T15:00:00Z" }` ekleyerek çağrıyı tekrarlıyor ve işlem, arada açık bir akış olmadan tamamlanıyor.

## Tasks, Apps ve EMA artık gerçek bir eklenti çerçevesine kavuşuyor

"Tasks", tek bir istek/yanıt döngüsüne sığmayan uzun süreli işler için daha önce deneysel bir ek özellikti. Artık `io.modelcontextprotocol/tasks` adıyla resmi, sürümlenmiş bir eklenti; poll tabanlı `tasks/get` ile birlikte yeni bir `tasks/update` işlemi de geliyor. Daha önce çeşitli özel mesaj türlerine dağılmış olan bildirimler ise tek bir `subscriptions/listen` akışında toplanıyor. Daha geniş eklenti çerçevesi ayrıca MCP Apps (etkileşimli arayüz eklentileri) ve Enterprise Managed Authorization (EMA) kavramlarını da resmi olarak içine alıyor — kurumsal kimlik sistemlerine dokunan herhangi bir şey inşa ediyorsanız bu önemli; ayrıntıları aşağıdaki bölümde.

Bu yapı taşlarının üzerine çok araçlı ajan sistemleri kuruyorsanız, [AI ajanları için context engineering](/tr/posts/ai-ajanlari-icin-context-engineering) ve [çok ajanlı orkestrasyon kalıpları](/tr/posts/cok-ajanli-orkestrasyon-kaliplari) yazılarımıza da göz atmanızı öneririz; çünkü Tasks ve MRTR, bu kalıpların dayandığı varsayımların ikisini de değiştiriyor.

## Asıl kırılan yer: yetkilendirme

Gerçekten harekete geçmeniz gereken bölüm burası. Eski MCP yetkilendirme hikâyesi büyük ölçüde Dynamic Client Registration'a (DCR) dayanıyordu; demo ve prototip için sorun değildi ama gerçek bir kurumsal kimlik sağlayıcısına bağlamaya çalıştığınızda hep bir workaround gibi hissettiriyordu. 2026-07-28 spesifikasyonu bu boşluğu kapatıyor ve bunu varsayılan olarak geriye dönük uyumlu olmayan şekillerde yapıyor:

- **RFC 9207 issuer doğrulaması artık zorunlu** — bir authorization code, token ile değiştirilmeden önce uygulanmak zorunda. Bunu atlarsanız, uyumlu bir authorization sunucusuna karşı token exchange basitçe başarısız olur.
- **Client kaydında yeni bir `application_type` parametresi**, masaüstü ve CLI uygulamaları için localhost yönlendirmelerini artık açıkça destekliyor — daha önce ucundan tutulan bir uç durumken şimdi birinci sınıf bir yol haline geliyor.
- **Client credential'ları, kendilerini veren authorization sunucusuna bağlanıyor**, böylece farklı issuer'lar arasında credential'ların yeniden kullanılması engelleniyor.
- **DCR resmi olarak kullanımdan kaldırılıyor**, yerini Client ID Metadata Documents (CIMD) alıyor; DCR desteğinin tamamen kalkmış sayılabilmesi için 12 aylık bir geriye dönük uyumluluk penceresi tanınıyor.

Bir araya getirildiğinde bu, MCP yetkilendirmesinin sonunda Entra ID ya da Okta gibi sağlayıcılara karşı üretimde zaten çalışan OAuth 2.0/OIDC pratiğine yetişmesi anlamına geliyor ve MCP sunucusu geliştiricilerinin sessizce sürdürdüğü bir yığın workaround'u ortadan kaldırıyor. Yön olarak doğru. Açıkçası benim aklımda karışık bir his var: 12 aylık DCR'dan CIMD'ye geçiş penceresi o kadar cömert ki ilk dokuz ay boyunca kimse hareket etme baskısı hissetmeyecek, sonra herkes on birinci ayda son teslim tarihi stresiyle göç edecek — OAuth'a yakın diğer birçok kullanımdan kaldırma sürecinde de aynı senaryoyu gördük zaten. Gerçek bir kimlik sağlayıcısına karşı çalışan bir MCP sunucunuz varsa, CIMD geçişini kullanımdan kaldırma uyarısı sert bir hataya dönüşmeden, şimdiden yol haritanıza yazın.

## Eski ile yeninin karşılaştırması

| Boyut | 2026-07-28 öncesi (stateful) | 2026-07-28 (stateless) |
|---|---|---|
| Oturum modeli | `initialize`/`initialized` el sıkışması, `Mcp-Session-Id` başlığı isteklerde kalıcı | Oturum yok; her istek sürüm, kimlik ve yetenekleri kendi metadata'sında taşıyor |
| Sunucu kaynaklı istekler | Uzun süre açık kalan bir akış üzerinden gönderiliyor | `resultType: "input_required"` + `inputResponses` ile Multi Round-Trip Requests (MRTR) |
| İstek yönlendirme | Gateway'lerin yönlendirme/ölçüm için JSON gövdesini ayrıştırması gerekiyor | `Mcp-Method` ve `Mcp-Name` başlıkları gövdeye bakmadan yönlendirmeyi mümkün kılıyor |
| List/read önbellekleme | TTL metadata'sı yok; istemciler tekrar tekrar veri çekiyor | Yanıtlar, düzgün istemci tarafı önbellekleme için `ttlMs` ve `cacheScope` taşıyor |
| Auth / client kaydı | Dynamic Client Registration (DCR), zorunlu issuer doğrulaması yok | CIMD (DCR kullanımdan kaldırıldı, 12 aylık pencere), zorunlu RFC 9207 issuer doğrulaması, credential'lar veren authorization sunucusuna bağlı |

## Ekosistem ne kadar hazır

Dört Tier-1 SDK'nın tamamı — TypeScript, Python, Go ve C# — 2026-07-28'i ilk günden destekliyor; Rust SDK'sı hâlâ beta aşamasında ve kırılan değişiklikler için göç rehberleri yayınlanmış durumda. Bu önemli çünkü MCP artık niş bir protokol değil: aylık SDK indirmeleri 400 milyonu aştı, bu da son bir yılda 4 kat artış anlamına geliyor; basın da artık MCP'yi [AI ajanlarını uygulamalara ve araçlara bağlamanın endüstri standardı yöntemi](https://mpost.io/anthropic-releases-largest-mcp-update-yet-moving-protocol-to-stateless-core-for-enterprise-scale/) olarak tanımlıyor rutin biçimde. Anthropic'in kendi Claude ekosisteminde connectors dizininde 950'den fazla MCP sunucusu listeleniyor, bunlar her gün milyonlarca kişi tarafından kullanılıyor ve Anthropic, 2026-07-28'i Claude Code, Claude Desktop ve API'ye getirmek için kendi rehberini yayınladı — yani bu, geliştiricilerin gerçekte kullandığı araçlardan kopuk bir spesifikasyon değişikliği değil.

Subagent'lara veya iç içe delegasyona dayanan ajanlar geliştiriyorsanız, bunun [Claude Code subagent ve arka plan ajanları](/tr/posts/claude-code-subagent-arka-plan-ajanlari) ile [derinlik 3'te iç içe alt ajanlar](/tr/posts/claude-code-ic-ice-alt-ajanlar-derinlik-3) yazılarımızda ele aldığımız kalıplarla nasıl etkileştiğine de bakmakta fayda var — özellikle MRTR, bir delegasyon zinciri boyunca görev ortasında kullanıcı girdisini nasıl ele almanız gerektiğini değiştiriyor.

Temmuz 2026 sonu itibarıyla bu gerçekten taze bir gelişme: bu satırları yazarken spesifikasyon henüz iki günlük, SDK'lar yeni yeni geldi ve çoğu üretim sunucusu henüz geçiş yapmadı. Yetkilendirme değişiklikleri aciliyet kazanmadan önce öne geçmek için dar ama gerçek bir pencere bu.

## Sıkça Sorulan Sorular

### MCP sunucumu bugün yeniden yazmam mı gerekiyor?

Bugün değil ama yakında. Stateless çekirdek, MRTR ve header değişiklikleri, sunucunuzun transport katmanına bir dahaki elinizi değdirdiğinizde kod değişikliği gerektiriyor; kullanımdan kaldırılan özellikler (Roots, Sampling, Logging, eski HTTP+SSE) için ise en az 12 aylık bir göç penceresi tanınıyor — yani bir süreniz var ama sonsuz değil.

### Eski spesifikasyonda kalan sunucular ne olacak?

Kullanımdan kaldırılan özellikler bir gecede sökülmediği için, eski protokol sürümünü konuşan istemcilere karşı çalışmaya devam edecekler. Ama 2026-07-28'e göre inşa edilen yeni istemciler ve RFC 9207 issuer doğrulamasını zorunlu kılmaya başlayan authorization sunucuları, zamanla eski tip DCR akışlarını kabul etmeyi bırakacak — yani "hâlâ çalışıyor" durumunun bir son kullanma tarihi var.

### Bu, Claude'un son kullanıcılarını mı yoksa sadece geliştiricileri mi etkiliyor?

Büyük ölçüde geliştiricileri ve sunucu operatörlerini. Claude Code, Claude Desktop ya da API'nin son kullanıcıları işlevsel bir fark hissetmeyecek; ancak Anthropic'in kendi göç rehberi, bu güncellemenin Claude ürünlerine aktif olarak entegre edildiğini gösteriyor.

### En acil çözülmesi gereken tek şey ne?

Yetkilendirme. MCP sunucunuz gerçek bir kimlik sağlayıcısıyla konuşuyorsa, DCR'dan CIMD'ye geçişi planlamaya başlayın ve token exchange'inizin RFC 9207 issuer doğrulamasını doğru şekilde ele aldığından şimdiden emin olun — planlı bir değişiklik yerine üretimde bir kesinti olarak yaşamadan önce.
