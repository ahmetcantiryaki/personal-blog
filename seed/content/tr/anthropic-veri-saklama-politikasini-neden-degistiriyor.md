---
title: "Anthropic Veri Saklama Politikasını Neden Değiştiriyor?"
slug: "anthropic-veri-saklama-politikasini-neden-degistiriyor"
translationKey: "anthropic-enterprise-data-retention-policy-change"
locale: "tr"
excerpt: "Bloomberg'e göre Anthropic, 30 günlük veri saklama zorunluluğunu koruyup müşterilere veriyi kendi bulut altyapısında tutma seçeneği sunmayı planlıyor."
category: "ai"
tags: ["claude", "compliance", "privacy", "cloud"]
publishedAt: "2026-08-25"
seoTitle: "Anthropic Veri Saklama Politikasını Neden Değiştiriyor?"
seoDescription: "Bloomberg'e göre Anthropic, 30 günlük veri saklama zorunluluğunu koruyup müşterilere veriyi kendi bulut altyapısında tutma seçeneği sunmayı planlıyor."
---

Kısa cevap: Anthropic, Haziran 2026'da getirdiği zorunlu 30 günlük veri saklama politikasına kurumsal müşterilerden gelen tepki üzerine, verinin kendi sunucuları yerine müşterinin kendi bulut hesabında (AWS, Azure veya GCP) tutulabilmesini sağlayacak bir seçenek ekliyor. Bloomberg'in 20 Ağustos 2026 tarihli haberine göre bu değişiklik henüz Anthropic tarafından resmi olarak duyurulmadı; haber, konuya yakın kaynaklara dayanıyor ve sonbahar 2026'da devreye alınması planlanıyor.

## Anthropic hangi veri saklama politikasını değiştiriyor?

Değişen politika, 9 Haziran 2026'da yürürlüğe giren ve Claude Fable 5 ile Mythos model ailesi için müşteri verisinin siber saldırı ve kötüye kullanım tespiti amacıyla Anthropic'in kendi sunucularında 30 gün boyunca saklanmasını zorunlu kılan kuraldı. Bu kural, gelecekteki tüm sınır (frontier) modeller için de geçerli olacak şekilde tasarlanmıştı. Anthropic'in kendi [veri saklama dokümantasyonuna](https://support.claude.com/en/articles/15425996-data-retention-practices-for-covered-models) göre, Opus 4.8, Sonnet 4.6 ve Haiku 4.5 gibi eski modellerde sıfır veri saklama (zero-data-retention, kısaca ZDR — verinin işlendikten hemen sonra hiç saklanmadan silinmesi anlamına gelir) seçeneği mevcuttu. Fable sınıfı modellerde ise bu seçenek hiç sunulmadı; yani kurumsal müşterinin "veri hiç saklanmasın" deme şansı yoktu.

Bu fark, özellikle finans, sağlık ve devlet yüklenicisi gibi düzenlemeye tabi sektörlerdeki müşteriler için kritik bir sorun yarattı. Veri konumu (data residency) ve uyumluluk gereksinimleri olan kurumlar, verilerinin kendi kontrolleri dışında bir üçüncü taraf sunucusunda 30 gün bekletilmesini kabul edilebilir bulmadı.

## Anthropic'in orijinal 30 günlük kuralı neden bu kadar tepki çekti?

Tepkinin temel nedeni, kurumsal müşterilerin veri saklama konusunda seçim hakkının tamamen ortadan kalkmasıydı. Zero-data-retention seçeneğinin Fable ve Mythos modellerinde bulunmaması, daha önce ZDR ile çalışan şirketleri fiilen yeni bir uyumluluk riskiyle karşı karşıya bıraktı.

Bloomberg'in bildirdiğine göre Anthropic, bu politikanın şirket için bir iş riski oluşturduğunu iç yazışmalarında kabul etti. Bu, sıradan bir kullanıcı şikayeti değil; kurumsal satış hattını doğrudan etkileyen bir sorundu. Claude'un kurumsal araçlarındaki denetim ve uyumluluk katmanlarını daha önce [Claude Compliance API, Cowork ve Claude Code denetimi üzerine yazımızda](/tr/posts/claude-compliance-api-cowork-claude-code-denetimi) ele almıştık; veri saklama meselesi de aynı güven sorununun bir uzantısı.

Sonuç olarak birçok müşteri, sözleşme yenilemelerini beklemeye aldı ya da alternatif sağlayıcıları değerlendirmeye başladı. Bir sınır laboratuvarının varsayılan veri işleme kurallarını "kalıcı" sanmanın ne kadar yanlış olabileceğini gösteren iyi bir örnekti bu — Anthropic'in bunu ilk seferde yanlış yapmış olması, bir sınır laboratuvarının veri politikalarına körü körüne güvenen herkes için endişe verici olmalı.

## Anthropic'in yeni planı ne öneriyor?

Bloomberg'in 20 Ağustos 2026 tarihli haberine göre yeni yaklaşım, 30 günlük saklama süresini kaldırmıyor ama saklama yerini değiştiriyor. Zorunlu 30 günlük saklama, güvenlik ve kötüye kullanım tespiti gerekçesiyle korunuyor; ancak kurumsal müşteriler artık bu veriyi Anthropic'in sunucuları yerine kendi bulut kiracılarında (AWS, Azure veya GCP hesaplarında) tutabilecek.

Habere göre Anthropic, bu yeni sistemi aylar süren bir çalışmayla ve 100'den fazla kurumsal müşteriyle iş birliği içinde geliştirdi; bu müşterilerin çoğu düzenlemeye tabi sektörlerden geliyor. Planlanan devreye alma tarihi sonbahar 2026. Bu ayrım, veri konumu ve bütçe kontrolü gerektiren ekipler için önemli; konuyu [Claude Managed Agents'ın bütçe ve veri konumu seçenekleri üzerine yazımızda](/tr/posts/claude-managed-agents-butce-danisman-veri-konumu) daha geniş ele almıştık.

Aşağıdaki tablo, önceki ve planlanan politikayı karşılaştırıyor:

| Özellik | Haziran 2026 (mevcut) | Sonbahar 2026 (planlanan) |
|---|---|---|
| Saklama süresi | 30 gün (zorunlu) | 30 gün (zorunlu, değişmiyor) |
| Saklama konumu | Yalnızca Anthropic sunucuları | Müşterinin kendi bulut hesabı (AWS/Azure/GCP) seçilebilir |
| ZDR seçeneği (Fable/Mythos) | Yok | Belirtilmedi; konum seçeneği ana değişiklik |
| Geliştirme süreci | — | 100'den fazla kurumsal müşteriyle aylar süren iş birliği |
| Durum (Ağustos 2026 itibarıyla) | Yürürlükte | Resmi olarak duyurulmadı, Bloomberg kaynaklı haber |

## Bu haber resmi bir Anthropic duyurusu mu?

Hayır. Ağustos 2026 itibarıyla Anthropic, bu değişikliği anthropic.com/news üzerinde resmi olarak yayımlamadı. Bilgi, Bloomberg'in konuya yakın kaynaklara dayanan 20 Ağustos 2026 tarihli haberinden geliyor ve [Quartz](https://qz.com/anthropic-enterprise-data-storage-policy-cloud-082126) ile [PYMNTS](https://www.pymnts.com/news/artificial-intelligence/2026/anthropic-plans-to-tweak-data-retention-rules-after-enterprise-concerns/) dahil yaklaşık sekiz bağımsız yayın organı tarafından ayrı ayrı doğrulandı. Yani bu, teyit edilmiş ama henüz Anthropic tarafından resmiyete kavuşturulmamış bir plan olarak okunmalı; nihai uygulama detayları sonbahar 2026'daki devreye alımda değişebilir.

## Bu değişiklik OpenAI'nin yaklaşımından nasıl farklı?

Anthropic'in "veriyi müşterinin bulutunda tut" yaklaşımı, OpenAI'nin izlediği yoldan belirgin şekilde farklı. Axios'un 19 Ağustos 2026 tarihli haberine göre OpenAI, [sıfır saklama güvenlik sistemi](https://www.axios.com/2026/08/19/openai-previews-zero-retention-safety-system-as-anthropic-requires-data-logs) adını verdiği bir yaklaşımı test aşamasında tanıtıyor; bu sistem veriyi hiç saklamadan güvenlik taramasını başka bir yöntemle yapmayı hedefliyor.

İki laboratuvarın da çözmeye çalıştığı sorun aynı: kötüye kullanım tespiti ile kurumsal veri güveni arasındaki gerilim. Ama çözüm mimarileri farklı — Anthropic veriyi saklıyor ama saklama yerini müşteriye bırakıyor, OpenAI ise saklamayı önlemeye çalışıyor. Hangi yaklaşımın düzenleyiciler ve denetim ekipleri tarafından daha güvenilir bulunacağı, önümüzdeki aylarda netleşecek.

## Bu değişiklik Claude kullanan ekipleri nasıl etkiler?

Düzenlemeye tabi sektörlerde çalışan ekipler için pratik etki, veri konumu kontrolünün geri gelmesi olacak. Sonbahar 2026'daki devreye alım sonrası, kendi bulut altyapısını kullanmak isteyen kurumsal müşteriler muhtemelen ek bir yapılandırma adımı ve muhtemelen ek maliyetle karşılaşacak; bunun tam ticari koşulları henüz açıklanmadı.

Bu arada değişikliğin şirket içi sözleşme yönetimi açısından da bir etkisi olacak: hukuk ve tedarik ekiplerinin, mevcut Anthropic sözleşmelerindeki veri işleme eklerini (data processing addendum) sonbahar 2026'daki devreye alımdan önce gözden geçirmesi gerekecek. Kendi bulut hesabında veri tutmak isteyen bir şirket için bu, muhtemelen AWS, Azure veya GCP tarafında yeni bir depolama kovası (bucket) ayırma ve erişim izinlerini Anthropic'in servisleriyle uyumlu şekilde yapılandırma anlamına gelecek — yani bu bir "aç-kapa" anahtarı değil, üzerinde çalışılması gereken bir entegrasyon projesi olacak.

Bu arada Claude'un kararlılığı ve fiyatlandırması gibi başka operasyonel konular da kurumsal karar vericiler için gündemde kalmaya devam ediyor; örneğin yakın zamanda [Claude'un 24 saatte iki kez çökmesini](/tr/posts/claude-24-saatte-iki-kez-coktu) ve [Sonnet 5 fiyatlandırmasının kalıcı hale gelmesini](/tr/posts/claude-sonnet-5-fiyati-kalici-oldu) ayrı yazılarımızda incelemiştik. Veri saklama, kurumsal güven denklemindeki tek değişken değil ama şu anda en çok tartışılanı.

Daha fazla yapay zeka haberi için [yapay zeka kategorimize](/tr/category/yapay-zeka) göz atabilirsiniz.

## Sıkça Sorulan Sorular

### Anthropic'in 30 günlük veri saklama zorunluluğu tamamen kalkıyor mu?

Hayır, kalkmıyor. Bloomberg'in Ağustos 2026 raporuna göre 30 günlük saklama süresi güvenlik ve kötüye kullanım tespiti amacıyla korunuyor; değişen şey verinin nerede saklanacağı. Müşteriler artık bu veriyi Anthropic'in sunucuları yerine kendi bulut hesaplarında tutma seçeneğine sahip olacak.

### Zero-data-retention (ZDR) nedir ve Fable modellerinde neden yoktu?

ZDR, bir modelin işlediği veriyi hiçbir şekilde saklamadan işlem bitince silmesi anlamına gelir. Haziran 2026'da tanıtılan Claude Fable 5 ve Mythos modelleri için Anthropic bu seçeneği sunmadı; tüm müşteri verisi güvenlik amacıyla 30 gün boyunca zorunlu olarak saklandı, oysa Opus 4.8 gibi eski modellerde bu seçenek mevcuttu.

### Yeni veri saklama politikası ne zaman devreye girecek?

Bloomberg'in kaynaklarına göre hedeflenen devreye alma tarihi sonbahar 2026. Ağustos 2026 itibarıyla Anthropic bu değişikliği resmi olarak duyurmadığı için kesin tarih ve uygulama detayları değişebilir.

### Bu haberi neden Anthropic'in kendisi değil de Bloomberg duyurdu?

Ağustos 2026 itibarıyla Anthropic, bu politika değişikliğini resmi kanallarında yayımlamadı. Bilgi, konuya yakın kaynaklara dayanan Bloomberg muhabirliğinden geliyor ve Quartz ile PYMNTS dahil yaklaşık sekiz bağımsız yayın organı tarafından teyit edildi; bu da haberi güvenilir ama henüz resmiyet kazanmamış bir gelişme olarak konumlandırıyor.
