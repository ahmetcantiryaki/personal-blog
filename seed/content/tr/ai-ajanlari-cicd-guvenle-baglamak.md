---
title: "AI Ajanlarını CI/CD'ye Güvenle Bağlamak"
slug: "ai-ajanlari-cicd-guvenle-baglamak"
translationKey: "ai-agents-in-cicd-safely"
locale: "tr"
excerpt: "AI kodlama ajanlarını CI/CD hattına sokmak cazip ama riskli. Rule of Two, en az ayrıcalık ve denetim izleriyle ajanları güvenle çalıştırma rehberi."
category: "devops-cloud"
tags: ["ai-agents", "ci-cd", "devops", "automation"]
publishedAt: "2026-08-15"
seoTitle: "CI/CD'de AI Ajanları: Güvenli Kurulum Rehberi"
seoDescription: "AI kodlama ajanlarını pipeline'a sokarken en az ayrıcalık, sandboxing, insan onayı ve denetim izleri nasıl kurulur? Pratik bir güvenlik rehberi."
---

"AI ajanını CI/CD'ye bağla, geri kalanını o halletsin" cümlesi kulağa oldukça çekici geliyor ama 2026'nın gerçek olayları bunun ne kadar kırılgan bir vaat olduğunu açıkça gösterdi. Bu yazı, ajanları pipeline'a sokmanın hangi işlerde gerçekten mantıklı olduğunu, hangilerinde kesinlikle olmadığını ve aradaki sınırı somut olarak nasıl teknik bir şekilde çizeceğinizi ele alıyor.

## Ajanlara Verilebilecek İşler, Verilmemesi Gerekenler

Ajanların pipeline içinde gerçekten iyi olduğu işler oldukça belli: issue triyajı, bağımlılık güncellemeleri, test üretimi ve ilk-geçiş düzeltmeleri. Bunların ortak özelliği, hata payının nispeten düşük ve sonucun kolayca geri alınabilir olması — yanlış giden bir test önerisi ya da hatalı bir dependency bump, bir insan reviewer tarafından kolayca yakalanır.

| İş türü | Ajana uygun mu? | Neden |
| --- | --- | --- |
| Issue/PR triyajı, etiketleme | Evet | Düşük risk, kolayca geri alınır |
| Bağımlılık sürüm güncellemeleri | Evet | CI testleri zaten doğrulama katmanı |
| İlk-geçiş test üretimi | Evet | İnsan review'undan geçmeden merge edilmez |
| Basit lint/format düzeltmeleri | Evet | Deterministik, düşük risk |
| Production veritabanı migrasyonu | Hayır | Geri dönüşü zor, veri kaybı riski |
| Secret/kimlik bilgisi yönetimi | Hayır | Sızıntı riski yüksek, tespiti zor |
| Mimari değişiklik kararları | Hayır | Bağlam ve yargı gerektirir |
| Production'a doğrudan deploy | Hayır | İnsan onayı olmadan asla |

Buradaki net çizgi şu: ajan, **önerir**; insan **onaylar**. Bu ayrımı bulanıklaştıran her kurulum, riski katlıyor.

## Rule of Two: Basit ama Güçlü Bir Çerçeve

[Meta'nın güvenlik ekibinin öne sürdüğü](https://ai.meta.com/blog/practical-ai-agent-security/) ve Simon Willison'ın "lethal trifecta" (ölümcül üçleme) kavramı üzerine inşa edilen "Rule of Two" (İkili Kural), agentic sistemler için pratik bir sınır çiziyor: bir ajan şu üç özellikten **en fazla ikisini** aynı anda taşımalı:

1. Güvenilmeyen girdi işlemek (örneğin bir issue veya PR açıklaması okumak),
2. Hassas verilere/sistemlere erişmek,
3. Durum değiştirmek veya dışarıyla iletişim kurmak.

Üçü birden aynı anda ve hafifletilmeden bir arada olduğunda, prompt injection saldırılarına karşı kapı ardına kadar açık kalıyor. CI/CD bağlamında bu şu anlama geliyor: bir ajan hem PR açıklamalarını (güvenilmeyen girdi) okuyup hem de secret'lara erişip hem de dışarıya bir API çağrısı yapabiliyorsa, üçüncü özelliği ya kaldırın ya da ikinciyi.

## Somut Bir Ders: Claude Code GitHub Action Olayı

Bu soyut bir tehdit değil. [Microsoft Threat Intelligence, 5 Haziran 2026'da yayınladığı bir analizde](https://www.microsoft.com/en-us/security/blog/2026/06/05/securing-ci-cd-in-agentic-world-claude-code-github-action-case/) Claude Code'un GitHub Action entegrasyonunda gerçek bir açığı belgeledi: bir saldırgan, bir GitHub issue'sunun içine insan gözüyle zararsız görünen ama modelin komut olarak okuduğu gizli bir talimat yerleştirebiliyordu. Sorun, ajanın dosya okuma aracının `/proc/self/environ` gibi hassas dosyalara sandboxing olmadan erişebilmesinden kaynaklanıyordu — bu da `ANTHROPIC_API_KEY` dahil ortam değişkenlerinin sızdırılabilmesi anlamına geliyordu. Anthropic, sorumlu bildirim sonrası 5 Mayıs 2026'da yayınlanan Claude Code 2.1.128 sürümünde bu hassas dosyalara erişimi engelleyerek açığı kapattı. [Rule of Two çerçevesini pratik uygulama örnekleriyle ele alan bir incelemede](https://www.osohq.com/learn/agents-rule-of-two-a-practical-approach-to-ai-agent-security) de vurgulandığı gibi, bu tür olaylar genelde tek bir aracın kötü niyetli olmasından değil, sandboxing katmanının eksik kalmasından kaynaklanıyor.

Bu olayın öğrettiği şey basit: ajanın "sadece okuma" yaptığını düşündüğünüz bir araç bile, sandboxing yoksa hassas veriye giden bir kapı olabilir. [Agentjacking'i ele aldığımız yazıda](/tr/posts/agentjacking-yeni-ai-ajan-saldirisi) benzer bir örüntüyü, ajan araçlarının beklenmeyen yollarla kötüye kullanılmasını, farklı bir açı üzerinden işlemiştik.

## En Az Ayrıcalık ve Sandboxing

Pratikte üç katmanlı bir savunma öneriliyor:

- **İzin katmanı**: Ajanın hangi komutları/araçları çalıştırabileceğini açık bir allowlist ile sınırlayın; "her şeye izin ver, sonra filtrele" yaklaşımı yerine "hiçbir şeye izin verme, sonra gerekeni aç" yaklaşımını benimseyin.
- **MCP/araç kapsamı**: Bağlanan her araç veya MCP sunucusunun erişim kapsamını daralt; bir ajan sadece test çalıştırması gerekiyorsa, ona deploy yetkisi vermeyin.
- **İşletim sistemi düzeyi sandboxing**: Docker-in-CI yerine, dosya sistemi ve ağ sınırlarını daha sıkı izole eden bulut sandbox'ları (E2B, Vercel Sandbox, Sprites gibi) tercih edin.

GitHub token'ları özelinde: bir ajan sadece PR'a yorum bırakacaksa `contents: write` iznine ihtiyacı yok. Token kapsamını iş tanımına göre daraltmak, bu tür olayların blast radius'unu doğrudan küçültüyor.

```yaml
# En az ayrıcalıklı bir GitHub Actions token kapsamı örneği
permissions:
  contents: read
  pull-requests: write
  issues: write
  # deploy/production'a dokunan hiçbir izin verilmiyor
```

## İnsan Onayı ve İmzalı Commit'ler

Ajanın ürettiği her değişiklik, merge edilmeden önce mutlaka bir insan tarafından onaylanmalı — bu, "ajan hızlı çalışsın" isteğiyle çelişmiyor, tam tersine hızın güvenle bir arada var olmasını sağlıyor. İmzalı commit'ler (signed commits) zorunlu kılınırsa, bir ajanın kimliğine bürünerek doğrudan main branch'e yazma girişimi teknik olarak engellenmiş olur. Bu, [CI/CD pipeline'ı sıfırdan kurmayı ele aldığımız yazıda](/tr/posts/cicd-pipeline-nasil-kurulur) bahsettiğimiz temel güvenlik pratiklerinin agentic bağlamdaki doğal uzantısı.

## Maliyet ve Hız Kontrolleri

Bir ajan, sınırsız retry döngüsüne girip token bütçesini saatler içinde tüketebilir. Pratik önlemler: her ajan görevine bir token/maliyet tavanı koymak, başarısız denemeler için maksimum retry sayısı belirlemek ve anormal harcama artışında otomatik uyarı kurmak. Bu kontroller olmadan, "ajan sabahtan beri çalışıyor" cümlesi hem güvenlik hem bütçe açısından kırmızı bayrak.

## Denetim İzleri ve Geri Alma

Her ajan eylemi — hangi komut çalıştırıldı, hangi dosya değiştirildi, hangi API çağrıldı — loglanmalı ve bu loglar ajan tarafından değiştirilemez olmalı. Bir sorun tespit edildiğinde geri alma (rollback) planı önceden hazır olmalı; "sonra düşünürüz" bir felaket anında işe yaramıyor.

Bu planı kağıt üzerinde bırakmamak için pratik bir alışkanlık öneriyorum: en az üç ayda bir, gerçek bir agentic olay senaryosunu (örneğin bir ajanın yanlışlıkla staging veritabanına yazması) tatbikat olarak çalıştırın. Böyle bir tatbikat, log'ların gerçekten okunabilir olup olmadığını, rollback komutunun gerçekten çalışıp çalışmadığını ve ekibin kimin ne zaman müdahale edeceğini bilip bilmediğini, olay gerçekleşmeden önce ortaya çıkarıyor. Bir güvenlik kontrolünün kağıt üzerinde var olması ile pratikte işe yaraması arasındaki fark, genelde tam da bu tür bir tatbikatta ortaya çıkıyor.

Açıkçası bu konuda temkinli olmakta fayda var: agentic otomasyonun vaadi gerçek ama 2026'nın olayları gösterdi ki, "ajana güven, gerisini o halletsin" yaklaşımı bugünkü olgunluk seviyesinde hâlâ tehlikeli bir kısayol.

## Pipeline Entegrasyon Kontrol Listesi

```text
Ajanı pipeline'a bağlamadan önce:
- Rule of Two'ya göre ajan en fazla iki riskli özelliği taşıyor mu?
- GitHub token kapsamı göreve göre daraltıldı mı?
- Sandboxing (izin + araç kapsamı + OS düzeyi) üç katmanı da kuruldu mu?
- Her değişiklik insan onayından geçmeden merge edilemiyor mu?
- Token/maliyet tavanı ve retry limiti tanımlı mı?
- Her ajan eylemi değiştirilemez şekilde loglanıyor mu?
- Rollback planı önceden yazılı mı?
```

## Kırmızı Çizgiler

```text
Asla yapılmaması gerekenler:
- Ajana production veritabanına doğrudan yazma yetkisi vermek
- İnsan onayı olmadan main/production branch'ine otomatik merge
- Ajanın güvenilmeyen girdi + hassas erişim + dış iletişimi aynı anda taşıması
- Sınırsız token/maliyet bütçesiyle çalıştırma
- Loglanmayan veya değiştirilebilir denetim izleri
```

AI ajanlarını güvenle kullanma konusunda daha fazla içerik için [DevOps ve Bulut kategorimize](/tr/category/devops-bulut) göz atabilirsiniz.

## Sıkça Sorulan Sorular

### AI ajanlarını CI/CD'ye bağlamak genel olarak güvenli mi?

Doğru sınırlarla (en az ayrıcalık, sandboxing, insan onayı, denetim izleri) evet, düşük riskli işler için güvenli hale getirilebilir. Sınırsız yetkiyle bağlamak ise 2026'daki gerçek olayların gösterdiği gibi ciddi risk taşıyor.

### Rule of Two tam olarak neyi yasaklıyor?

Bir ajanın aynı anda hem güvenilmeyen girdi işlemesini, hem hassas veriye erişmesini, hem de durum değiştirip dışarıyla iletişim kurmasını aynı anda ve hafifletilmeden yapmasını yasaklamıyor ama riskli buluyor; bu üç özellikten en fazla ikisinin bir arada olmasını öneriyor.

### Claude Code GitHub Action açığı hâlâ geçerli mi?

Hayır, Anthropic bu spesifik açığı 5 Mayıs 2026'da yayınlanan Claude Code 2.1.128 sürümünde kapattı. Ancak olay, benzer sandboxing eksikliklerinin başka araçlarda da olabileceğini gösteren genel bir uyarı niteliğinde.

### İnsan onayı, ajan hızından ne kaybettiriyor?

Doğru kurulmuş bir onay akışı, hızı öldürmüyor; ajanın önerisini dakikalar içinde inceleyip onaylamak, saatler süren manuel bir geliştirme sürecinden hâlâ çok daha hızlı. Kaybedilen şey hız değil, "hiç kontrol etmeden güven" rahatlığı.
