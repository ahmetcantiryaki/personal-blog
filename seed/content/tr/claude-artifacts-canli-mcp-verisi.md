---
title: "Claude Artifacts Artık Canlı MCP Verisi Çekiyor"
slug: "claude-artifacts-canli-mcp-verisi"
translationKey: "claude-artifacts-live-mcp-data"
locale: "tr"
excerpt: "Claude Artifacts artık her açılışta MCP bağlayıcıları üzerinden canlı veri çekebiliyor. Ama bu sayfaları herkese açık paylaşamıyorsunuz; nedenini anlatıyoruz."
category: "ai"
tags: ["claude", "mcp", "ai-tools", "ai-agents"]
publishedAt: "2026-07-24"
seoTitle: "Claude Artifacts Artık Canlı MCP Verisi Çekiyor"
seoDescription: "Claude Artifacts artık her açılışta MCP bağlayıcıları üzerinden canlı veri çekebiliyor. Ama bu sayfaları herkese açık paylaşamıyorsunuz; nedenini anlatıyoruz."
---

Claude Artifacts'e, bir sayfayı sadece bir kez oluşturmakla kalmayıp her ziyarette yeniden veri çekme yeteneği eklendi. Anthropic'in [code.claude.com üzerindeki güncel dokümantasyonuna](https://code.claude.com/docs/en/artifacts) göre, bir artifact artık MCP bağlayıcıları üzerinden canlı sorgu atabiliyor; yani bir PR panosu, gerçekten açık olan PR'ları gösteriyor, önbelleğe alınmış bir anlık görüntüyü değil. Bunun için Claude Code v2.1.209 ya da üzeri gerekiyor.

## Değişen şey tam olarak ne

Artifacts özelliği, bir Claude Code veya claude.ai oturumunun çıktısını claude.ai üzerinde canlı, etkileşimli bir web sayfasına dönüştürüyordu. Bugüne kadar bu sayfalar oluşturulduğu anda dondurulmuş içerik sunuyordu: bir grafik, bir hesap makinesi, statik bir rapor. Artık bir artifact, sayfa her açıldığında bir MCP bağlayıcısını çağırabiliyor ve gösterdiği veri, o anki gerçek durumu yansıtıyor.

Örnek istem şöyle çalışıyor:

```text
Build a dashboard artifact of our open pull requests
that pulls the live list through my GitHub connector
when the page loads.
```

Claude bu isteği aldığında, sayfaya statik bir tablo gömmek yerine, sayfa yüklendiğinde GitHub bağlayıcısını çağıran bir mantık kuruyor. Sonuç, tarayıcıda her yenilendiğinde güncellenen bir pano oluyor.

Bu, [Model Context Protocol](/tr/posts/model-context-protocol-nedir) fikrinin doğal bir uzantısı aslında: MCP zaten Claude'un harici araçlarla konuşma standardıydı, şimdi bu konuşma tek seferlik bir kurulum adımı olmaktan çıkıp sayfanın kendi yaşam döngüsünün bir parçası hâline geldi.

## Kimin verisi gösteriliyor: yazar mı, izleyici mi

İşin en ilginç teknik detayı burada. Bir artifact bir bağlayıcıyı çağırdığında, bu çağrı sayfayı yazan kişinin bağlantısı üzerinden değil, sayfayı o anda görüntüleyen kişinin kendi bağlantısı üzerinden çalışıyor. Yani aynı panoyu açan iki kişi, farklı veriler görebiliyor: biri kendi açık GitHub PR'larını, diğeri kendi Jira biletlerini.

Bu mimari kararın pratik sonucu şu: claude.ai, bağlayıcı çağrısını sunucu tarafında yapıyor ve sayfanın kendisi hiçbir zaman kimlik bilgilerine dokunmuyor. Sayfayı görüntüleyen kişi ilk açılışta bağlayıcıya erişim izni onaylamak zorunda. Reddederse ya da o aracı hiç bağlamamışsa, canlı bölüm boş kalıyor; sayfa çökmüyor ya da hata fırlatmıyor. Bu yüzden iyi bir pratik, Claude'a "kullanıcı GitHub bağlayıcısını bağlamamışsa, bunu açıkça belirten bir yedek mesaj göster" gibi bir talimat da eklemek. Aksi hâlde izleyici boş bir kutuyla karşılaşıp neyin eksik olduğunu anlamayabilir.

Bu per-viewer modeli, aynı panoyu paylaşan bir ekip için kimlik karmaşasını da çözüyor: herkes kendi izniyle, kendi verisini görüyor, tek bir paylaşılan hesabın tüm ekibin verisini sızdırma riski yok.

## Herkese açık paylaşım neden engellendi

Burada işin can alıcı kısmına geliyoruz: bağlayıcı çağıran bir artifact, hiçbir plan altında herkese açık bir bağlantıyla paylaşılamıyor. Pro ve Max planlarında herkese açık bağlantı, tek paylaşım mekanizması olduğu için, bağlayıcı kullanan bir artifact bu planlarda sadece oluşturan kişiye özel kalıyor. Team ve Enterprise planlarında ise durum biraz daha esnek: sayfayı organizasyon içinde görüntüleme ya da düzenleme izniyle paylaşabiliyorsunuz, sadece açık internete veremiyorsunuz.

Bunu bir eksiklik olarak okumamak lazım; tam tersi, mantıklı bir güvenlik kararı. Düşünün: herkese açık bir bağlantı, tanımı gereği kimliği doğrulanmamış herhangi bir ziyaretçi tarafından açılabilir. Eğer o sayfa bir bağlayıcıyı "izleyicinin kimliğiyle" çağırıyorsa ve izleyicinin kimliği yoksa, sistem ya rastgele bir yabancının hiçbir yetkisi olmayan bir çağrı denemesine izin vermek zorunda kalır ya da daha kötüsü, geriye düşüp yazarın kimliğini kullanır — ki bu tam olarak önlenmek istenen sızıntı senaryosu. Anthropic bu ihtimali baştan kapatmayı tercih etmiş. Sonuç olarak canlı panonuz gerçekten kişiye özel bir şey hâline geliyor; bu bir hata değil, bilinçli bir tasarım tercihi.

Aşağıdaki tablo, plana göre neyin mümkün olduğunu özetliyor:

| Yetenek | Pro / Max | Team / Enterprise |
|---|---|---|
| Statik artifact'i herkese açık paylaşma | Evet | Evet |
| Bağlayıcı çağıran artifact'i herkese açık paylaşma | Hayır | Hayır |
| Bağlayıcı çağıran artifact'i organizasyon içinde paylaşma | Yok (tek mekanizma herkese açık bağlantı) | Evet, görüntüleme veya düzenleme izniyle |
| Editör rolü atama | Yok | Evet |

## Editör rolleri ve sürümleme

Team ve Enterprise planlarında, izleyiciler varsayılan olarak salt okunur erişime sahip ama bir sahip, birini "editör" olarak yükseltebiliyor. Editör rolündeki kişi kendi Claude oturumunda artifact'in URL'sini vererek sayfayı yeniden yayınlayabiliyor; sayfayı açık tutan herkes güncellemeleri anında görüyor. Bu, çok oyunculu bir düzenleme deneyimine benziyor: tek bir kişi değil, yetkilendirilmiş bir grup sayfayı canlı tutabiliyor.

Her yeniden yayın, yeni bir sürüm oluşturuyor. Paylaşım kontrolünden, izleyicilere hangi sürümün gösterileceğini seçebiliyorsunuz — belirli bir sürümde sabitleyebilir ya da her zaman en güncel sürümü otomatik takip edecek şekilde bırakabilirsiniz. Bu, üretim ortamındaki bir dashboard'u dondurup üzerinde çalışmaya devam etmek isteyenler için kullanışlı bir ayrım.

## Örnek iş akışı: canlı PR ve deploy durumu panosu

Bunu somutlaştıralım. Bir ekip lideri, sabah toplantısından önce açık PR'ların ve son deploy durumlarının tek bakışta görülebileceği bir sayfa istiyor diyelim. Claude Code'da şöyle bir istem yeterli:

1. GitHub bağlayıcısı üzerinden açık PR listesini ve inceleme durumunu çek.
2. CI/CD bağlayıcısı varsa son deploy'ların başarı/başarısızlık durumunu ekle.
3. Sayfa her açıldığında bu verileri yeniden sorgula.

Ortaya çıkan artifact, [Claude Code'un subagent ve arka plan ajanları](/tr/posts/claude-code-subagent-arka-plan-ajanlari) ile üretilen otomasyon akışlarının doğal bir tamamlayıcısı gibi çalışıyor: arka planda çalışan ajanlar işi yaparken, bu pano da o işin görünür yüzü hâline geliyor. Team planındaysanız bu panoyu ekip içinde paylaşabilir, bir editör atayabilir ve herkes kendi GitHub izinleriyle kendi görebileceği PR'ları izleyebilir.

## Sayfanın sert teknik sınırları

Bir artifact'in ne olduğunu unutmamak lazım: arka planı olmayan, tek bir statik HTML ya da Markdown sayfası. Sıkı bir içerik güvenliği politikası (CSP), bağlayıcı çağrı mekanizması dışındaki tüm giden istekleri engelliyor. İşlenmiş sayfa boyutu için 16 MiB'lik bir üst sınır var. Yayınlamak için /login üzerinden oturum açmış olmanız gerekiyor; sadece API anahtarıyla çalışan oturumlar sayfa yayınlayamıyor. Ayrıca bu özellik Bedrock, Vertex ya da Foundry üzerinden değil, yalnızca doğrudan Anthropic API üzerinden claude.ai'da kullanılabiliyor.

Bu sınırlar, [Claude Skills](/tr/posts/claude-skills-nedir-herkes-icin) gibi diğer platform yeteneklerinde de görülen bir örüntüyü tekrarlıyor: Anthropic, esnekliği artırırken saldırı yüzeyini de bilinçli şekilde daraltıyor.

## Bu hafta paylaşılan diğer güncellemeler

Bu özellik, temmuz ayının üçüncü haftasında (20-23 Temmuz 2026) duyurulan birkaç claude.ai platform güncellemesiyle birlikte geldi: herkese açık artifact paylaşım bağlantıları ve Claude Code'a eklenen ekran okuyucu erişilebilirlik modu. İkisi de kendi başına ayrı bir yazıyı hak ediyor ama bu haftanın genel resmi, Anthropic'in artifact'leri hafif demo araçlarından gerçek, paylaşılabilir ürünlere doğru evriltmeye devam ettiğini gösteriyor. Detaylar için [Anthropic'in haber sayfasına](https://www.anthropic.com/news) bakabilirsiniz.

## Sıkça Sorulan Sorular

### Canlı bir GitHub panosunu herkese açık paylaşabilir miyim?

Hayır. Bir artifact herhangi bir MCP bağlayıcısını çağırıyorsa, herhangi bir plan altında herkese açık bir bağlantıyla paylaşılamıyor. Pro ve Max'te bu, sayfanın kişiye özel kalması anlamına geliyor; Team ve Enterprise'da ise organizasyon içinde paylaşabiliyorsunuz.

### İzleyici aynı araçları bağlamamışsa ne olur?

Sayfanın canlı bölümü boş kalıyor, sayfa hata vermiyor ya da çökmüyor. Bu yüzden Claude'a, ilgili bağlayıcının bağlı olmadığı durumlarda ne gösterileceğini açıkça belirten bir yedek mesaj eklemesini söylemek iyi bir pratik.

### Bu özellik Bedrock üzerinden çalışan Claude Code'da kullanılabilir mi?

Hayır. Canlı bağlayıcı verisi çeken artifact'ler yalnızca doğrudan Anthropic API üzerinden claude.ai'da destekleniyor; Bedrock, Vertex ya da Foundry entegrasyonlarında mevcut değil.

### Bir artifact'in boyut sınırı nedir?

İşlenmiş sayfa 16 MiB'i geçemiyor. Bunun ötesinde, artifact backend'i olmayan tek bir statik HTML/Markdown sayfası ve sıkı bir CSP, bağlayıcı çağrı mekanizması dışında giden isteklere izin vermiyor.
