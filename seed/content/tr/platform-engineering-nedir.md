---
title: "Platform Engineering Nedir: Detaylı Bakış"
slug: "platform-engineering-nedir"
translationKey: "what-is-platform-engineering"
locale: "tr"
excerpt: "Platform engineering nedir? Internal developer platform, golden path, platform-as-product yaklaşımı ve DevOps'tan farkına 2026 gözüyle detaylı bir bakış."
category: "devops-cloud"
tags: ["platform-engineering", "devops", "developer-experience"]
publishedAt: "2026-04-26"
seoTitle: "Platform Engineering Nedir: Detaylı Bakış"
seoDescription: "Platform engineering nedir? Internal developer platform, golden path, platform-as-product ve DevOps ile SRE'den farkı; 2026 gözüyle detaylı bir bakış."
---

Platform engineering, geliştiricilerin altyapının her parçasını öğrenmeden veya ticket açmadan yazılım göndermesini sağlayan bir internal developer platform (IDP) kurma ve işletme disiplinidir. Platformu bir ürün, geliştiricileri o ürünün müşterisi, developer experience'ı da asıl önemli metrik olarak ele alırsınız. İyi yapıldığında hem teslim süresini hem de bilişsel yükü aynı anda düşürür.

Bu, DevOps'un yeni bir adı değil. Platform engineering, DevOps'tan *sonra* olan şeye bir yanıt: her ekibe Kubernetes, Terraform ve bir yığın YAML verildi ve "sen yaz, sen çalıştır" sessizce "sen yaz, sen çalıştır, bir de yarı zamanlı altyapı uzmanı ol" haline geldi. Platform ekibinin işi, tüm bunları geliştiricilerin gerçekten kullanmak isteyeceği arayüzlerin ardına soyutlamaktır.

## Platform engineering nedir, gerçekten?

Platform engineering, özel bir ekibin internal developer platform kurduğu ürün odaklı bir pratiktir: uygulama ekiplerinin ortam sağlama, deploy etme ve servis işletmeyi kendi başlarına yapmasını sağlayan, özenle seçilmiş self-service araçlar, iş akışları ve golden path'lerden oluşur. Amaç, bilişsel yükü azaltmak, standart yolu netleştirmek ve güvenli, uyumlu seçeneği en kolay seçenek yapmaktır.

Buradaki asıl kırılma **platform-as-product** yaklaşımı. Bir ticket kuyruğu yerine; kullanıcıları, yol haritası, adoption metrikleri ve geri bildirim döngüsü olan bir ürün çıkarırsınız. Geliştiriciler platformunuzu es geçip etrafından dolaşıyorsa, bu onların değil, sizin bug'ınız.

Disiplini üç fikir tutar:

- **Ticket yerine self-service.** Geliştiriciler ihtiyaçlarını bir API, CLI, portal veya Git commit'i üzerinden alır; başka bir ekibi beklemeden.
- **Golden path, golden cage değil.** Yaygın senaryo için görüşlü ve iyi desteklenen bir yol sunarsınız ama kaçış yollarını yasaklamazsınız.
- **Düşman, bilişsel yük.** Her soyutlama, bir geliştiricinin aklında tutması gereken şeylerin sayısını az tutmak için vardır.

## Platform engineering neden ortaya çıktı?

Platform engineering, "shift left" döneminin operasyonel karmaşıklığı ürün ekiplerine fazlaca yıkması yüzünden ortaya çıktı. Kubernetes, service mesh, CI/CD pipeline'ları, IaC, gözlemlenebilirlik yığınları ve bulut IAM'in her biri gerçek bir öğrenme eğrisi taşır. Her geliştiricinin hepsinde ustalaşmasını beklemek ölçeklenmez; bu yüzden sektör o uzmanlığı tekrar bir platformda merkezileştirdi.

Team Topologies buna bir isim verdi: **platform ekibi**, stream-aligned (ürün) ekiplerinin bilişsel yükünü, iç servisleri bir ürün gibi sunarak azaltmak için vardır. Gartner'ın "2026'ya kadar yazılım mühendisliği organizasyonlarının %80'inin platform ekibi olacak" tahmini de sahada gördüğümüzle örtüşüyor.

Adoption'ı tetikleyen sancı hep aynı:

- Her ürün ekibi aynı pipeline'ları, Terraform modüllerini ve Helm chart'larını yeniden icat eder.
- Yeni bir servisi ayağa kaldırmak günlerce süren kopyala-yapıştır ve Slack arkeolojisi ister.
- Kolay yol güvenli yol olmadığı için güvenlik ve uyumluluk hep sonradan eklenir.
- Kıdemli mühendisler ürün işi yerine altyapı tesisatına saatler harcar.

## Bir internal developer platform nasıl çalışır?

Bir internal developer platform, geliştiricilerle ham altyapının arasına girip, altta otomatik ve politika kontrollü iş akışlarını tetikleyen küçük bir üst düzey arayüz kümesi sunarak çalışır. Geliştirici niyetini bildirir ("Bir Postgres veritabanı ve bir staging deploy'u istiyorum") ve platform bunu gerçeğe dönüştürmek için bulut API'lerini, IaC'yi ve pipeline'ları orkestra eder.

2026'da modern bir IDP genellikle şu katmanlardan kurulur:

| Katman | Ne yapar | Yaygın araçlar |
|--------|----------|----------------|
| Developer control plane | Geliştirici niyetini ifade eder | Backstage, Port, CLI'ler, Git |
| Entegrasyon & orkestrasyon | Niyeti kaynağa çevirir | Crossplane, Terraform, Argo CD |
| Kaynak katmanı | İş yüklerinin gerçekten koştuğu yer | Kubernetes, bulut servisleri, DB'ler |
| Gözlemlenebilirlik katmanı | Sağlık ve maliyet geri bildirimi | Prometheus, Grafana, OpenTelemetry |
| Güvenlik & politika katmanı | Guardrail'ler ve uyumluluk | OPA/Kyverno, Vault, RBAC |

Çoğu ekibin vardığı desen, **bir GitOps motoru üzerine ince bir geliştirici arayüzü**. Geliştirici bir portal açar veya bir CLI komutu çalıştırır; bu Git'e bir manifest commit'ler, Argo CD ya da Flux da bunu cluster'a reconcile eder. Platform ekibinin gönderdiği tipik bir golden-path iskele komutu şöyle görünür:

```bash
# Golden-path şablonundan yeni bir servis oluştur
platform create service \
  --name payments-api \
  --language go \
  --template rest-service

# Çıktı:
# ✓ CI/CD, Dockerfile, Helm chart ile repo oluşturuldu
# ✓ Gözlemlenebilirlik bağlandı (metrik, log, trace)
# ✓ Staging namespace'i Crossplane ile sağlandı
# ✓ On-call + sahiplik katalogda kayıtlı
# 47 saniyede hazır. main'e push'la, staging'e deploy olsun.
```

Bu tek komut, eskiden iki günlük bir kontrol listesi olan işi yerine koyar. Mesele araç değil; güvenli, gözlemlenebilir ve standart kurulumun sonradan eklenen bir şey değil, *varsayılan* olması.

## Platform engineering DevOps ve SRE'den nasıl ayrılır?

Platform engineering, DevOps ve SRE örtüşür ama farklı sorulara yanıt verir. DevOps, dev ve ops arasında paylaşılan sahipliğin kültürüdür. SRE, SLO'lar ve error budget'lar üzerinden güvenilirliğe odaklanan bir mühendislik disiplinidir. Platform engineering ise, DevOps ve SRE ilkelerinin her ekip tarafından yeniden icat edilmeden ölçeklenmesi için iç araçları ürünleştirme pratiğidir.

| Boyut | DevOps | SRE | Platform Engineering |
|-------|--------|-----|----------------------|
| Temel soru | Nasıl işbirliği yaparız? | Nasıl güvenilir kalırız? | Self-service'i nasıl ölçekleriz? |
| Ana çıktı | Kültür + pratikler | SLO, error budget | Internal developer platform |
| Değer birimi | Pipeline, otomasyon | Güvenilirlik | Ürün olarak golden path |
| Müşteri kim | Ekibin kendisi | Son kullanıcı | İç geliştiriciler |
| Başarısızlık biçimi | "DevOps ekibi" silosu | Toil yükü | Kimsenin benimsemediği platform |

Pratikte birbirini tamamlarlar. Platform engineering, 2026'da birçok organizasyonun DevOps'u ölçekte hayata geçirme *biçimidir*: platform ekibi DevOps ve SRE en iyi pratiklerini golden path'lere gömer, ürün ekipleri de bunları bedavaya devralır.

## Platform engineering pratiğini nasıl kurarsınız?

Platformu, herhangi bir ürünü kurar gibi kurun: kullanıcı araştırmasıyla başlayın, ince bir dilim gönderin ve genişletmeden önce adoption'ı ölçün. İki yıllık bir Backstage projesiyle başlamayın. En sancılı ve en çok tekrar eden tek iş akışıyla başlayıp onu uçtan uca paved edin.

1. **Ürün gibi ele alın.** Bir ürün sahibi atayın, geliştirici persona'larınızı tanımlayın ve "iyi" neye benziyor yazın.
2. **En yüksek sürtünmeli yolu bulun.** Geliştiricilerle konuşun; genelde ortam sağlama veya ilk deploy'dur.
3. **İnce bir golden path gönderin.** Tek bir dil için tek bir iş akışını uçtan uca otomatikleştirin (iskele → deploy → gözlem).
4. **Self-service'i gerçek yapın.** CLI, portal veya Git üzerinden sunun. Kritik yolda ticket olmasın.
5. **Guardrail'leri içine gömün.** Policy-as-code, secret yönetimi ve RBAC bir wiki'de değil, paved yolun üstünde olmalı.
6. **Adoption'ı ölçün.** Kaç ekibin yolu kullandığını, kaçının etrafından dolaştığını takip edin.
7. **DORA ve DevEx ile ölçün.** Lead time, deploy sıklığı, change failure rate ve geliştiricinin öz bildirdiği memnuniyeti izleyin.
8. **Geri bildirimle iterasyon yapın.** Platformu bir ürün gibi işletin: backlog, sürümler, changelog.

Başarısız olan ekipler neredeyse her zaman 1. adımı atlar. Geliştiricilerin istediğini *sandıkları* bir platform kurar, zorunlu kılar ve adoption'ın tıkanmasını izlerler. Kuzey yıldızınız adoption'dır; insanlar fırsat bulunca çıkış yapıyorsa, arayüzünüz yanlıştır.

## Hangi metrikler platform engineering'in işe yaradığını kanıtlar?

Kanıt, ne kadar altyapı kurduğunuzda değil, adoption ve akıştadır. Throughput'u artırıp geliştiricileri sessizce tüketmemek için teslim metrikleriyle deneyim metriklerini birlikte izleyin.

- **DORA metrikleri:** değişiklik lead time'ı, deploy sıklığı, change failure rate, restore süresi.
- **Adoption oranı:** golden path üzerindeki servislerin yüzdesi.
- **İlk deploy süresi:** boş repo'dan staging'de çalışır hale gelene kadar geçen süre.
- **Bilişsel yük / DevEx anketleri:** SPACE çerçevesinden ödünç alınan, öz bildirilen sürtünme.
- **Ticket azaltımı:** self-service'e dönüşen altyapı taleplerinin sayısı.

Üzerinde çalıştığımız bir platformda ilk deploy süresi üç günden bir saatin altına indi, altyapı ticket'ları bir çeyrekte yaklaşık %70 düştü. Bu iki sayı, bir arada, işin tüm satış argümanı.

İlişkili detaylı yazılarımıza da göz atın: Kubernetes maliyet optimizasyonu rehberimiz, üretim için Docker en iyi pratikleri yazısı ve AI agent mı workflow mu karşılaştırmamız. DevOps ve bulut kategori sayfası tüm kümeyi birbirine bağlar.

## Sıkça Sorulan Sorular

### Platform engineering, DevOps'un yeni adı mı?

Hayır. DevOps paylaşılan sahipliğin kültürüdür; platform engineering ise o kültürü ölçeklemek için bir internal developer platform kuran somut bir pratiktir. Platform engineering araçları ürünleştirir, böylece ürün ekipleri her biri pipeline, IaC ve guardrail'i yeniden icat etmeden DevOps ile SRE kazanımlarını alır.

### Küçük ekiplerin platform engineering'e ihtiyacı var mı?

Nadiren ayrı bir ekibe, ama ilkeler hemen işe yarar. Beş kişilik bir startup'ın Backstage'e ihtiyacı yoktur; iyi bir golden-path şablonuna ve scriptlenmiş bir deploy'a ihtiyacı vardır. Resmi platform ekipleri, tekrarlanan altyapı işi ve tutarsız kurulumların gerçek bir maliyete dönüştüğü 30-50 mühendis civarında geri dönmeye başlar.

### Platform engineering'de golden path nedir?

Golden path, bir servisi kurup işletmek için desteklenen, görüşlü ve iyi belgelenmiş, güvenli ve standart seçeneği en kolay seçenek yapan bir yoldur. Bir zorunluluk değil, paved bir yoldur: geliştiriciler uç senaryolar için yoldan çıkabilir, ama yaygın yol varsayılan olarak otomatik, gözlemlenebilir ve uyumludur.

### Platform engineering için Backstage şart mı?

Hayır. Backstage popüler bir geliştirici portalıdır, ama platform engineering herhangi bir araçla değil, pratiğin kendisiyle ilgilidir. Etkili platformların çoğu bir CLI ve GitOps ile başlar, portalı sonra ekler. İhtiyacınıza göre Port, Humanitec ya da iyi tasarlanmış bir iç CLI de aynı rolü görebilir.
