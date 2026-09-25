---
title: "AI'nin Yazdığı PR'ları İncelemek: İnsan Kontrol Listesi"
slug: "ai-yazdigi-pr-inceleme-listesi"
translationKey: "reviewing-ai-generated-prs-2026"
locale: "tr"
excerpt: "AI'nin yazdığı bir PR'ı insan yazdığı gibi incelemek yeterli değil: aynı diff'te 1,7 kat daha fazla hata, 2,74 kat daha fazla güvenlik açığı çıkıyor."
category: "software-engineering"
tags: [ai-coding, code-quality, testing, best-practices]
publishedAt: "2026-09-25"
seoTitle: "AI'nin Yazdığı PR'ları İnceleme Kontrol Listesi (2026)"
seoDescription: "AI ajanlarının yazdığı PR'lar insan yazdığından 1,7 kat daha hatalı, 2,74 kat daha güvenlik açıklı. İşte doğrulanmış bir inceleme kontrol listesi."
---

Kısa cevap: Hayır, AI'nin yazdığı bir PR'ı insan yazdığı gibi incelemek yeterli değil. LinearB'nin 8,1 milyon PR üzerindeki analizine göre AI'nin yazdığı PR'ların kabul oranı %32,7 iken insan yazdığı PR'larda bu oran %84,4; Veracode'un 2026 kıyaslamasına göre ise AI kod üretim görevlerinin %45'i bilinen bir güvenlik açığı içeriyor. Bu, farklı bir inceleme merceği gerektiriyor.

## AI'nin yazdığı PR'lar neden daha fazla dikkat istiyor?

Çünkü aynı diff boyutunda daha fazla hata ve daha az insan denetimi içeriyorlar. Faros AI'nin 2026 raporuna göre yüksek AI benimsemesi olan ekiplerde ortalama PR boyutu %51, PR başına hata sayısı %54 arttı; incelemede geçen medyan süre ise %441 uzadı — yani ekipler daha fazla kod üretiyor ama onu daha yavaş ve daha az etkili inceliyor.

CodeRabbit'in "AI vs İnsan Kod Üretimi" raporu bu farkı daha da netleştiriyor: AI'nin yazdığı PR'lar ortalama 10,83 inceleme sorunu taşırken insan yazdığı PR'larda bu sayı 6,45; okunabilirlik sorunları ise 3 kat artıyor. Temmuz 2026'da yayımlanan CMU, Stanford ve bağımsız bir açık kaynak analizinin üçü de aynı sonuca varıyor: AI'nin yazdığı PR'lar daha az tartışılıyor, daha hızlı birleştiriliyor — oysa objektif olarak daha fazla incelemeye ihtiyaçları var.

| Metrik | AI Yazımı PR | İnsan Yazımı PR |
|---|---|---|
| Kabul oranı | %32,7 | %84,4 |
| Ortalama inceleme sorunu | 10,83 | 6,45 |
| Güvenlik açığı oranı | 2,74 kat fazla | referans |
| Hata oranı | 1,7 kat fazla | referans |
| Üretimde manuel debug gerektirme | %43 | daha düşük |

## AI'nin yazdığı kodda hangi hata türleri tekrar ediyor?

Dört kalıp öne çıkıyor: makul görünen ama yanlış kod, sessiz kapsam genişlemesi, gizli bağımlılıklar ve uydurma (fabricated) testler. "Makul görünen ama yanlış" kod, sözdizimsel olarak %95'in üzerinde doğru olsa da mantıksal olarak hatalı olabiliyor — Veracode'un bulgusuna göre güvenlik geçme oranı iki yıldır %55'te sabit kalıyor, sözdizimi doğruluğu yükselse bile.

METR'in bulgusu daha da çarpıcı: otomatik test paketlerinden geçen AI yamalarının kabaca yarısı, gerçek repo bakımcıları tarafından reddediliyor. Yani "testler yeşil" ile "bu kod merge edilmeye hazır" aynı şey değil. Lightrun'ın 2026 raporuna göre AI'nin yazdığı kod değişikliklerinin %43'ü QA'dan geçtikten sonra üretimde manuel debug gerektiriyor.

## Somut bir inceleme kontrol listesi nasıl görünür?

Aşağıdaki liste, "AI yazdı, o yüzden hızlı geçelim" refleksine karşı tasarlandı — her madde, yukarıdaki veri setinde tekrar eden bir hata kalıbına karşılık geliyor:

1. **Diff, açıklamayla eşleşiyor mu?** PR açıklaması "X'i düzelt" diyorsa, diff sadece X'i mi değiştiriyor, yoksa ilgisiz dosyalara da mı dokunuyor?
2. **Testler gerçekten davranışı mı doğruluyor?** Yeni eklenen testler assertion içermeyen ya da her zaman geçen (`assert True`, boş `expect`) sahte testler mi?
3. **Hata yolları (error paths) ele alınmış mı?** AI modelleri mutlu yol (happy path) için güçlü, ama exception, timeout ve boş girdi senaryolarını sık atlıyor.
4. **Yeni bağımlılıklar taranmış mı?** Her yeni `import` veya paket eklemesi, lisans ve güvenlik açığı taraması gerektirir — AI bir paketi "en kolay çözüm" diye ekleyebilir.
5. **Silinen güvenlik kontrolü var mı?** Diff'te kaldırılan satırlara özellikle bakın; bir input validasyonu veya yetki kontrolü "gereksiz karmaşıklık" gerekçesiyle sessizce silinmiş olabilir.
6. **Kapsam PR açıklamasından büyük mü?** Sessiz kapsam genişlemesi, review'i zorlaştıran ve gizli riskleri artıran en yaygın kalıplardan biri.

## CI'da bu kontrolleri nasıl otomatikleştirirsiniz?

Kontrol listesinin bir kısmı otomatikleştirilebilir. Aşağıdaki basitleştirilmiş GitHub Actions adımı, yeni bağımlılık eklenip eklenmediğini ve test dosyası değişip değişmediğini PR'a etiket olarak işaretliyor:

```yaml
name: ai-pr-guardrails
on: pull_request

jobs:
  flag-risky-changes:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - name: Check for new dependencies
        run: |
          git diff origin/main...HEAD --name-only | grep -E "package.json|requirements.txt" && \
            echo "::warning::Yeni bağımlılık dosyası değişti — lisans/güvenlik taraması gerekli"
      - name: Check test-to-code ratio
        run: |
          CHANGED=$(git diff origin/main...HEAD --name-only | grep -v test | wc -l)
          TESTS=$(git diff origin/main...HEAD --name-only | grep test | wc -l)
          if [ "$TESTS" -eq 0 ] && [ "$CHANGED" -gt 0 ]; then
            echo "::warning::Kod değişti ama test dosyası eklenmedi"
          fi
```

Bu tür bir CI kapısı, insan incelemesinin yerini almaz — sadece incelemecinin dikkatini doğru yere yönlendirir. Property-based test yaklaşımı, AI'nin atladığı edge case'leri yakalamada özellikle etkili; bu yöntemi [Özellik Tabanlı Test yazımızda](/tr/posts/ozellik-tabanli-test-hata-bulma) ayrıntılı anlatıyoruz.

## Ekip normları nasıl değişmeli?

Bize göre "AI yazdı" ifadesi bir güven gerekçesi değil, tam tersine bir uyarı etiketi olmalı. Pratik norm önerisi: her AI'nin yazdığı PR, insan yazdığı PR'dan daha kısa değil daha odaklı olmalı (tek sorumluluk, küçük diff) ve yazarın (insan ya da ajan fark etmeksizin) PR açıklamasında "bunu nasıl test ettim" bölümünü doldurması zorunlu tutulmalı. AI kod incelemesinde "güven ama doğrula" ilkesini [bu konudaki yazımızda](/tr/posts/ai-ile-kod-incelemesi-guven-dogrula) daha geniş bir çerçevede ele alıyoruz.

Açık kaynak projelerinde bu risk daha da büyük, çünkü bakımcı sayısı sınırlı ve inceleme kapasitesi zaten dar; bu dinamiği [AI çöpünün açık kaynak güvenliğini nasıl zorladığına dair yazımızda](/tr/posts/ai-copu-acik-kaynak-guvenligi) inceledik. Sonuç olarak, hesap verebilirlik hâlâ insanda: bir PR'ı onaylayan kişi, onu kimin (ya da neyin) yazdığından bağımsız olarak sonuçlarından sorumlu.

## Ajan tabanlı geliştirme ekipleri için hangi ek riskler var?

Bir AI ajanı yalnızca kod yazmıyor, bazen doğrudan repo'ya erişip PR açıyor, hatta CI/CD adımlarını tetikleyebiliyor. Bu, "agentjacking" olarak adlandırılan yeni bir saldırı sınıfının önünü açıyor: bir saldırgan, ajanın erişebildiği bir bağımlılık veya talimat dosyası üzerinden ajanı manipüle ederek kötü amaçlı kodu meşru bir PR gibi göstertebiliyor. Bu saldırı sınıfını [Agentjacking yazımızda](/tr/posts/agentjacking-yeni-ai-ajan-saldirisi) ayrıntılı inceledik; buradaki temel çıkarım, AI'nin yazdığı PR'ları yalnızca kod kalitesi açısından değil, ajanın hangi yetkilerle çalıştığı açısından da denetlemek gerektiği.

Ajanların CI/CD boru hattına doğrudan erişimi olduğunda, kontrol listesine bir madde daha eklenmeli: ajanın PR açma dışında hangi eylemleri gerçekleştirebildiği (secrets'lara erişim, deploy tetikleme, başka repo'lara yazma) net biçimde sınırlandırılmış mı? Bu sınırları CI/CD'ye güvenle bağlama konusunu [AI Ajanlarını CI/CD'ye Güvenle Bağlamak yazımızda](/tr/posts/ai-ajanlari-cicd-guvenle-baglamak) ele aldık.

## Küçük bir ekip bu kontrol listesini nasıl hafif tutar?

Her maddeyi manuel uygulamak, özellikle küçük ekiplerde inceleme sürecini yavaşlatabilir. Pratik bir orta yol: kontrol listesinin ilk üç maddesini (diff-açıklama eşleşmesi, test kalitesi, hata yolları) her PR'da zorunlu tutup, bağımlılık taraması ve silinen güvenlik kontrolü gibi daha maliyetli kontrolleri yalnızca "büyük" PR'lara (belirli bir satır sayısının üzerindeki değişikliklere) uygulamak. Bu, inceleme yorgunluğunu azaltırken riskin en yüksek olduğu yere odaklanmayı sağlıyor.

Bir diğer pratik ayrım: kontrol listesini araca değil role bağlamak. Yani "bu PR'ı Claude Code mu yazdı, Cursor mu" sorusu önemli değil — önemli olan, ajanın hangi yetkiyle çalıştığı ve diff'in gerçek etki alanı. Farklı AI kodlama araçlarının yetenek ve risk profillerini [Claude Code, Cursor, Antigravity: 2026 Kıyaslaması yazımızda](/tr/posts/claude-code-cursor-antigravity-2026) karşılaştırdık; hangi aracı kullanırsanız kullanın, yukarıdaki kontrol listesi aynı şekilde uygulanmalı.

## Sıkça Sorulan Sorular

### AI'nin yazdığı PR'lar gerçekten daha mı hatalı?

Kısa cevap: Evet. CodeRabbit'in analizine göre AI'nin yazdığı PR'lar insan yazdığından 1,7 kat daha fazla hata ve 2,74 kat daha fazla güvenlik açığı taşıyor; ortalama inceleme sorunu sayısı 10,83'e karşı 6,45.

### AI'nin yazdığı bir PR'ı ne kadar sürede incelemeliyim?

Kısa cevap: İnsan yazdığı bir PR'dan daha kısa değil, daha yapılandırılmış bir sürede. Faros AI'nin verisine göre AI benimsemesi yüksek ekiplerde PR başına inceleme süresi zaten %441 arttı; hız değil, doğru kontrol listesini uygulamak öncelik olmalı.

### Testler geçtiyse PR güvenli midir?

Kısa cevap: Hayır. METR'in bulgusuna göre otomatik testlerden geçen AI yamalarının yaklaşık yarısı, gerçek repo bakımcıları tarafından reddediliyor; test geçişi, mantıksal doğruluğun garantisi değil.

### AI'nin yazdığı PR'larda en sık atlanan kontrol nedir?

Kısa cevap: Hata yolları ve edge case'ler. AI modelleri mutlu yol senaryosunda güçlü performans gösterirken exception yönetimi, timeout ve boş/sınır değer girdileri sık sık test kapsamı dışında kalıyor.

**Kaynaklar:** [CodeRabbit — AI vs Human Code Generation Report](https://www.coderabbit.ai/blog/state-of-ai-vs-human-code-generation-report), [Veracode 2026 güvenlik kıyaslaması](https://valueaddvc.com/blog/ai-generated-code-quality-security-risks-testing-overhead-and-what-ctos-are-doing), [Lightrun 2026 State of AI-Powered Engineering Report](https://www.secondtalent.com/resources/ai-generated-code-quality-metrics-and-statistics-for-2026/).
