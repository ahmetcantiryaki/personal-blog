---
title: "Şirket Araçlarınız İçin Özel MCP Sunucusu Nasıl Kurulur?"
slug: "sirket-araclariniz-icin-ozel-mcp-sunucusu"
translationKey: "internal-mcp-server-company-tools-2026"
locale: "tr"
excerpt: "Kısa cevap: iç API'lerinizi en az yetkiyle MCP aracı olarak açın, kimliği aktarın, her çağrıyı loglayın — ajanlara denetlenebilir erişim verirsiniz."
category: "devops-cloud"
tags: ["mcp", "ai-agents", "ai-infrastructure", "authentication", "observability"]
publishedAt: "2026-11-04"
seoTitle: "Şirket İçi MCP Sunucusu Nasıl Kurulur?"
seoDescription: "Özel bir MCP sunucusu ad-hoc scriptten ne zaman daha iyidir? Yetkilendirme, kimlik aktarımı, stateless MCP spec'i ve denetim loglamasıyla adım adım rehber."
---

Kısa cevap: AI ajanlarınız üç veya daha fazla iç sisteme erişiyorsa ve o erişimin kim tarafından, ne zaman, hangi veriye yapıldığının kaydını tutmanız gerekiyorsa, ad-hoc script yerine özel bir MCP sunucusu kurun. Sunucu, iç API'lerinizi en az yetki ilkesiyle sınırlı araçlara dönüştürür, kullanıcı kimliğini uçtan uca taşır ve her çağrıyı tek bir yerden loglar.

## Özel MCP sunucusu ad-hoc scriptten ne zaman daha iyidir?

Ad-hoc script yaklaşımı — her ajana ayrı bir Python betiği veya shell komutu bağlamak — tek bir geliştirici tek bir sistemle çalışırken işe yarar. Üç eşik aşıldığında bu model kırılır: birden fazla ekip aynı iç sisteme farklı scriptlerle erişmeye başladığında, ajanın hangi veriye dokunduğunu geriye dönük kanıtlamanız gerektiğinde ve farklı kullanıcıların farklı yetki seviyelerinde erişmesi gerektiğinde.

Bu üç eşikten biri aşıldığında, dağınık scriptler yerine tek bir MCP sunucusu kurmak bakım yükünü merkezileştirir: yetki kuralı bir yerde değişir, tüm ajanlar aynı anda güncellenir. 2026 itibarıyla MCP (Model Context Protocol), Anthropic'in başlattığı ama artık Agentic AI Foundation çatısı altında yürütülen açık bir standart haline geldi; bu da onu tek bir satıcıya bağımlı olmayan, uzun ömürlü bir entegrasyon katmanı yapıyor. Henüz hiç MCP sunucusu yazmadıysanız, önce [ilk MCP bağlayıcınızı nasıl yazacağınızı anlatan rehbere](/tr/posts/ilk-mcp-baglayicini-yaz-2026) bakıp temel protokolü küçük bir örnekle öğrenmek, doğrudan şirket içi, çok sistemli bir sunucuya girişmekten daha az risklidir.

## En az yetkili MCP aracı nasıl tasarlanır?

En az yetkili tasarım, her MCP aracının yalnızca tek bir iş işlevini görmesi ve o işlevin gerektirdiği minimum veri kapsamına sahip olması anlamına gelir. "Veritabanına SQL çalıştır" gibi genel bir araç yerine "müşteri_siparis_durumu_sorgula" gibi dar, parametreleri sınırlı bir araç tanımlayın.

Pratikte bu, her aracın şema düzeyinde hangi tabloya, hangi sütuna ve hangi satır aralığına erişebileceğini sabitlemesi demektir — ajan isterse de aracın kapsamı dışına çıkamaz. Aşağıdaki örnek, bir sipariş durumu aracının JSON şemasını gösteriyor:

```json
{
  "name": "get_order_status",
  "description": "Tek bir siparişin durumunu, sadece talep eden kullanıcının kendi siparişleri için döner.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "orderId": { "type": "string" }
    },
    "required": ["orderId"]
  }
}
```

Bu tasarımda yetki kontrolü araç koduna gömülüdür: `orderId` parametresi tek başına kullanıcıyı değiştirmeye yetmez, çünkü sunucu çağıran kimliğin o siparişin sahibi olup olmadığını ayrıca doğrular.

## Kimlik doğrulama ve kullanıcı kimliği aktarımı nasıl çalışır?

MCP sunucunuzun iç sistemlere kendi servis token'ıyla değil, çağıran kullanıcının kimliğiyle bağlanması gerekir; aksi halde her ajan çağrısı, sunucunun sahip olduğu en yüksek yetkiyle çalışır. OAuth 2.1 tabanlı akışlarda bu, token exchange (RFC 8693) ile çağıranın kimliğini alt sistemlere ilettiğiniz "delegated identity" modeliyle sağlanır.

Servis token'ları (statik API key'ler) yalnızca insan kullanıcısı olmayan, sabit kapsamlı arka plan işleri için uygundur; kullanıcı adına hareket eden her ajan çağrısında kullanıcı kimliğinin ayrı ayrı doğrulanması gerekir. Bu ayrımı atlayıp tüm ajan trafiğini tek bir servis hesabının arkasına gizlemek, denetim logunuzu değersizleştirir — kim neyi yaptı sorusuna artık "ajan" dışında bir cevap veremezsiniz.

| Yaklaşım | Kimlik aktarımı | Denetim kalitesi | Uygun senaryo |
|---|---|---|---|
| Statik servis token'ı | Yok | Düşük (her şey "bot" olarak görünür) | Sabit, insan-dışı toplu işler |
| OAuth token exchange | Kullanıcı bazlı | Yüksek | Kullanıcı adına çalışan ajanlar |
| Per-user service account | Kullanıcı bazlı, önceden provizyonlu | Orta-yüksek | Küçük, sabit kullanıcı kümesi |

## MCP spesifikasyonu neden stateless hale geldi?

MCP'nin 28 Temmuz 2026 tarihli spesifikasyon güncellemesi, protokolü stateless yaptı: `initialize` el sıkışması ve `Mcp-Session-Id` başlığı kaldırıldı, her istek kendi içinde protokol sürümünü (`MCP-Protocol-Version` başlığı veya `_meta` alanında) taşıyor. Bu değişiklik, MCP sunucularını klasik REST API'ler gibi yatay ölçeklendirmeyi mümkün kılıyor — artık bir yük dengeleyicinin aynı isteği hep aynı sunucu örneğine yönlendirmesine gerek yok.

Stateless mimaride uygulama durumu (örneğin bir ajan zincirinin ara sonuçları) artık protokol oturumunda değil, uygulama katmanında açık bir "handle" olarak taşınıyor. Şirket içi dağıtım için pratik sonuç şu: MCP sunucunuzu Kubernetes'te birden fazla replika ile çalıştırabilir, önüne sıradan bir ingress veya API gateway koyabilirsiniz; oturum yapışkanlığı (sticky session) ayarlamanıza gerek kalmaz.

Dağıtım genelde iki şekilde yapılıyor: ya şirket ağının içinde, servis mesh'inin arkasında bir mikroservis olarak, ya da dış erişim gerekiyorsa bir API gateway'in arkasında, mTLS ve kurumsal SSO ile korunmuş şekilde. Her iki durumda da gateway katmanı, SEP-2243 ile zorunlu hale gelen `Mcp-Method` ve `Mcp-Name` başlıklarını okuyarak gövdeyi ayrıştırmadan yönlendirme yapabiliyor.

## Her araç çağrısı nasıl denetlenebilir hale getirilir?

Denetim logu, en az şu beş alanı her çağrı için kayıt altına almalı: çağıran kullanıcı kimliği, çağrılan araç adı, giriş parametreleri (hassas veriler maskelenmiş), dönen sonucun özeti ve zaman damgası. Bu kaydı MCP sunucusunun içinde, yani ajanın kontrol edemeyeceği bir katmanda tutmak kritik — aksi halde ajan "ben bu aracı çağırmadım" diyen bir loga sahip olabilir.

Pratikte bu logu ayrı bir append-only tabloya veya merkezi bir log toplama sistemine (örneğin OpenTelemetry ile) yazmak, hem güvenlik ekibinin hem de maliyet takibinin işini kolaylaştırır. [Yapay zeka token harcamasını takım bazında görünür kılma rehberi](/tr/posts/yapay-zeka-finops-token-harcamasi) bu logların maliyet raporlamasında nasıl kullanılabileceğine dair tamamlayıcı bir bakış sunuyor.

Üç aylık bir inceleme ritmi öneriyoruz: hangi araçların hiç kullanılmadığını (kaldırma adayı), hangilerinin en sık çağrıldığını (performans ve ölçeklendirme önceliği) ve hangi kullanıcıların beklenmedik saatlerde çağrı yaptığını (olası anomali) gösteren bir rapor çıkarın.

## Claude Code'un managed MCP özelliği neden dağıtımı kolaylaştırıyor?

Claude Code 2.1.259 ve sonrasında, kurumlar `managedMcpServers` ayarı veya bir `managed-mcp.json` dosyasıyla, hangi MCP sunucularının kullanılabileceğini merkezi olarak belirleyebiliyor; bu ayar her kullanıcı seviyesindeki yapılandırmanın önüne geçiyor. Yani geliştiricilerin kendi laptoplarında rastgele MCP sunucusu eklemesini engelleyip, sadece BT'nin onayladığı iç sunucuların kullanılmasını zorunlu kılabilirsiniz.

Bu, özel sunucunuzu yazdıktan sonraki dağıtım adımını büyük ölçüde basitleştiriyor: sunucunuzu bir kere `managed-mcp.json`'a ekliyorsunuz, her geliştiricinin `.mcp.json` dosyasını elle düzenlemesine gerek kalmıyor. Ayrıca `allowedMcpServers` ve `deniedMcpServers` listeleriyle, belirli ekiplerin belirli sunuculara erişimini kısıtlayabiliyorsunuz — deny listesi her zaman allow listesine karşı kazanıyor. Sunucuyu [CI/CD içine güvenle bağladığınız ajanlara](/tr/posts/ai-ajanlari-cicd-guvenle-baglamak) da aynı `managed-mcp.json` üzerinden açabilirsiniz; böylece pipeline içindeki ajan da aynı denetim ve yetki kurallarına tabi olur. Reponuzun kendisini ajanlara anlatmak için ayrıca bir [AGENTS.md dosyası](/tr/posts/agents-md-repo-ai-ajanlarina-anlat) tutmak, hangi iç aracın ne için var olduğunu insan geliştiriciler için de belgelemiş olur.

Görüşüm şu: çoğu ekip MCP'yi önce "deneysel bir entegrasyon" gibi ele alıp denetim logunu sona bırakıyor, ama bu sırayı tersine çevirmek çok daha ucuz — önce log şemasını sabitleyin, araçları sonra ekleyin. Logu sonradan eklemek, geriye dönük hiçbir çağrı kaydı olmadığı bir boşluk dönemi yaratıyor. Konuyu daha genel bir [DevOps & Bulut](/tr/category/devops-bulut) perspektifinden takip etmek isteyenler, kategorideki diğer dağıtım ve otomasyon yazılarına da göz atabilir.

## Sıkça Sorulan Sorular

### MCP sunucusu ile API gateway arasındaki fark nedir?

Bir API gateway istekleri yönlendirir ve hız sınırlar; MCP sunucusu ise iç sistemleri, bir ajanın anlayabileceği yapılandırılmış "araç" tanımlarına (isim, şema, açıklama) dönüştürür. İkisi birbirini tamamlar: MCP sunucusu genelde bir gateway'in arkasında çalışır.

### Her iç API için ayrı bir MCP sunucusu mu gerekir?

Hayır, genelde tek bir MCP sunucusu birden fazla iç sistemi farklı araçlar olarak sunabilir; sınır, sunucunun bakımını kimin yaptığı ve hangi ekibin yetki kurallarını kontrol ettiğidir. Çok farklı yetki sahipliği olan sistemler ayrı sunucularda tutulmalı.

### MCP sunucusu kurmak için hangi diziller (SDK) kullanılabilir?

Resmi MCP SDK'ları TypeScript, Python, Java, Kotlin ve C# için mevcut; 28 Temmuz 2026 spec güncellemesiyle uyumlu SDK sürümleri (örneğin .NET SDK v2.0) stateless transport'u destekliyor. Hangi dili seçerseniz seçin, şema doğrulamasını SDK'ya bırakmak elle yazılan doğrulamadan daha güvenilir.

### Denetim loglarını ne kadar süre saklamalıyım?

Bu, şirketinizin uyumluluk gereksinimlerine bağlı değişir, ama finans ve sağlık gibi düzenlenmiş sektörlerde minimum bir yıl, çoğu iç BT politikasında 90-180 gün yaygın bir başlangıç noktası. Saklama süresini belirlerken "bu loga ne zaman geri dönüp bakacağız" sorusunu somut bir senaryoyla (denetim, güvenlik olayı, hata ayıklama) cevaplayın.
