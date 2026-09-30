---
title: "Context Engineering Nedir? Prompttan Farkı Ne?"
slug: "context-engineering-baglam-muhendisligi"
translationKey: "context-engineering-vs-prompt-2026"
locale: "tr"
excerpt: "Kısa cevap: Artık kritik beceri iyi prompt yazmak değil, ajana doğru anda doğru dosyayı vermek. Context engineering bu seçimi sistematik hale getirir."
category: "software-engineering"
tags: [ai-agents, prompt-engineering, software-architecture, best-practices]
publishedAt: "2026-09-30"
seoTitle: "Context Engineering Nedir? Prompttan Farkı"
seoDescription: "Context engineering ile prompt engineering arasındaki fark, context explosion ve spec-code drift hataları, ve AI kodlama ajanlarını güvenilir tutan teknikler."
---

Kısa cevap: Artık kritik beceri prompt yazmak değil, context engineering — yani ajana her adımda tam olarak hangi dosyayı, hangi spesifikasyonu ve hangi geçmiş kararı göstereceğini tasarlamak. Tek seferlik bir sohbette iyi prompt yeterliydi; çok adımlı, saatlerce süren otonom ajanlarda asıl değişken ajanın gördüğü bilgi kümesi.

Bunu açıkça söylemek gerekirse: 2024'ün "prompt mühendisi" unvanı 2026 sonunda büyük ölçüde anlamını yitirdi. [Sourcegraph'ın context engineering rehberi](https://sourcegraph.com/blog/context-engineering) bu değişimi net biçimde tanımlıyor: prompt engineering modelle *nasıl konuştuğunuzu*, context engineering ise modelin o anda *neyi gördüğünü* belirler. Bir kodlama ajanı Jira biletini okuyup kodu değiştirip testi çalıştırdığında, aradaki her adımda hangi dosyanın, hangi geçmiş kararın ve hangi hata mesajının ajanın önüne konacağı; işte context engineering tam olarak bu.

## Context engineering nedir, prompt engineering'den farkı ne?

Context engineering, bir AI ajanının her çıkarım adımında gördüğü token kümesini — retrieved dosyalar, araç şemaları, önceki adımların çıktıları, hafıza özetleri — kasıtlı olarak tasarlama disiplinidir. Prompt engineering ise tek bir modelin tek bir çağrısını iyileştirmeye odaklanır: talimat cümlesi, few-shot örnek, çıktı formatı.

Fark ölçek meselesi. Tek turlu bir soru-cevapta prompt her şeydir, çünkü context zaten küçük ve sabittir. Ancak bir kodlama ajanı 40 adımlık bir görevi yürütürken context her adımda değişir: yeni dosyalar açılır, eski test çıktıları birikir, ajan kendi ürettiği ara notları taşır. O noktada "mükemmel ilk prompt" yazmak, uçağı sadece kalkışta ayarlayıp sonra pilot koltuğunu terk etmeye benzer.

| Boyut | Prompt Engineering | Context Engineering |
|---|---|---|
| Kapsam | Tek bir model çağrısı | Çok adımlı ajan oturumunun tamamı |
| Optimize ettiği | Talimat cümlesi, format, few-shot örnekler | Hangi dosya, hangi geçmiş, hangi araç sonucu gösterilecek |
| Tipik hata modu | Belirsiz veya eksik talimat | Context explosion, spec-code drift |
| Teknik | İyi ifade etme, örnekleme, rol tanımı | Retrieval scoping, codified context dosyaları, hafıza katmanları |
| Ne zaman çöker | Zaten nadiren tek başına çöker | Oturum 20-30 adımı geçtiğinde, repo büyüdüğünde |

## Tek bir mükemmel prompt neden çok adımlı ajanlarda işe yaramıyor?

Çünkü prompt, oturumun sadece ilk saniyesini kontrol eder; kalan saatler boyunca ajanın kararlarını context'in kendisi şekillendirir. Bir ajan 50 dosyalık bir monorepo'da otonom çalışırken, sizin yazdığınız ilk talimat context penceresinin küçük bir kısmını oluşturur — geri kalanı retrieval sonuçları, araç çıktıları ve ajanın kendi ara akıl yürütmesiyle dolar.

Bu, [prompt mühendisliği tekniklerinin](/tr/posts/prompt-muhendisligi-teknikleri) değersiz olduğu anlamına gelmiyor; tek başlarına yetmedikleri anlamına geliyor. İyi bir sistem promptu hâlâ gerekli, ama artık yeterli koşul değil. Anthropic'in ve Sourcegraph'ın 2026 içinde vurguladığı nokta şu: ajan güvenilirliğindeki üretim hatalarının çoğu "model aptal" değil, "modele yanlış ya da eksik bilgi gösterildi" sorunudur.

## Context explosion nedir, tüm repoyu context'e dökmek neden geri tepiyor?

Context explosion, bir ajana gerekenden çok daha fazla dosya, log veya geçmiş konuşma vermenin akıl yürütmeyi *iyileştirmek* yerine *bozmasıdır*. Chroma'nın Eylül 2025'te yayımlanan ve 18 farklı büyük dil modelini test eden ["Context Rot" araştırması](https://www.trychroma.com/research/context-rot) bunu net biçimde gösteriyor: giriş token sayısı arttıkça, test edilen modellerin tamamının performansı düşüyor — modelin ilan edilen context penceresi ne kadar büyük olursa olsun.

Bunun kök nedeni 2023'te Liu ve arkadaşlarının [Lost in the Middle makalesinde](https://arxiv.org/abs/2307.03172) gösterildi: modeller context'in başında veya sonunda duran bilgiyi, ortasında kalan bilgiye göre çok daha güvenilir kullanıyor. Chroma'nın bulgusu bunu ajan senaryolarına taşıyor: dikkat dağıtıcı (distractor) içerik arttıkça, hatta mantıksal olarak tutarlı ve iyi organize edilmiş dokümanlarda bile, doğruluk düşüyor. Pratik sonuç şu: güvenle kullanılabilir context genellikle modelin reklamı yapılan penceresinin dörtte biri ile onda biri arasında bir yerde kalıyor.

Kodlama ajanları için bu, "tüm repoyu context'e koy, model zaten büyük pencereye sahip" mantığının doğrudan yanlış olduğu anlamına geliyor. 500 dosyalık bir servisin tamamını context'e dökmek, ajanın hangi fonksiyonun neden değiştirilmesi gerektiğine dair sinyalini, alakasız dosyaların ürettiği gürültü içinde boğar. Doğru yaklaşım, [context engineering'in kapsamlı rehberinde](/tr/posts/ai-ajanlari-icin-context-engineering) detaylandırıldığı gibi, retrieval scoping: göreve özel, küçük ve yüksek sinyalli bir dosya kümesi seçmek.

## Spec-code drift nedir, ajanın zihin modeli neden koddan kopuyor?

Spec-code drift, uzun bir ajan oturumu boyunca ajanın "kod tabanı böyle çalışıyor" varsayımının, kodun gerçekte nasıl değiştiğinden sessizce ayrışmasıdır. Bu terim henüz tek bir akademik makalede resmî olarak tanımlanmadı, ama pratikte kodlama ajanı kullanan her ekibin tanıdığı bir hata modu: ajan 15. adımda bir dosyayı okur, 25. adımda başka bir ajan çağrısı (ya da siz) o dosyayı değiştirir, ama ajanın context'inde hâlâ eski hali yaşamaya devam eder.

Sorun sessiz olmasında. Ajan hata vermez; tam tersine kendinden emin bir şekilde artık var olmayan bir fonksiyon imzasına göre kod üretir, ya da iki adım önce sildiği bir yardımcı fonksiyonu tekrar çağırır. [Spec-driven development](/tr/posts/spec-odakli-gelistirme-ai-ajan) yaklaşımı bu riski kısmen azaltır çünkü spesifikasyon tek doğruluk kaynağı hâline gelir, ama spesifikasyonun kendisi de oturum sırasında güncellenmezse aynı drift spec ile kod arasında da oluşur.

Pratikte drift'i yakalamanın en güvenilir yolu, ajana periyodik olarak "şu an bildiğini sandığın şeyi gerçek dosya durumuyla doğrula" adımı attırmaktır — örneğin her 10-15 araç çağrısında bir `git diff` veya dosya hash kontrolü. Bu, insan gözden geçirmesinin yerini almaz ama sessiz sapmayı erken yakalar.

## Güvenilir ajan iş akışları için hangi teknikler işe yarıyor?

En etkili dört teknik şunlar: codified context dosyaları, retrieval scoping, oturumlar arası hafıza katmanları ve "mise en place" tarzı ön hazırlık. Bunların ortak noktası hepsinin ajan başlamadan önce ya da her adımda otomatik olarak çalışması — insanın her seferinde context'i elle seçmesine güvenmemesi.

Codified context dosyaları, bir görevin kapsamını kod olarak tanımlar:

```yaml
# .agent/context.yaml
task: "Odeme servisine idempotency-key ekle"
scope:
  include:
    - services/payments/handlers/*.go
    - services/payments/docs/idempotency-spec.md
  exclude:
    - services/payments/vendor/**
memory:
  decisions_log: .agent/decisions.md
  last_verified_commit: 8f21e4c
constraints:
  - "Var olan public API imzalarini degistirme"
  - "Yeni bagimlilik ekleme"
```

Bu dosya, ajanın her oturumda yeniden keşfetmesi gereken bilgiyi (kapsam, kısıtlar, son doğrulanmış commit) sabitler. 2026'nın ikinci yarısında arXiv'de yayımlanan "Codified Context" çalışması, büyük ve karmaşık kod tabanlarında bu tür yapılandırılmış context dosyalarının, serbest metin talimatlara göre görev başarı oranını belirgin şekilde artırdığını gösteriyor.

Retrieval scoping, tüm repoyu değil, göreve gerçekten ilgili dosya alt kümesini context'e koyar — genellikle embedding tabanlı arama veya bağımlılık grafiği üzerinden. [AI ajan belleği](/tr/posts/ai-ajan-bellegi-sistemleri) katmanları ise oturum bitince bilgiyi kaybetmemeyi sağlar: kısa vadeli hafıza o oturumun kararlarını tutar, uzun vadeli hafıza ise "bu serviste şu desenler kullanılır" gibi kalıcı bilgiyi.

"Mise en place" — aşçılıktan ödünç alınan bir metafor — ajanı başlatmadan önce tam olarak ihtiyaç duyacağı dosyaları, dokümanları ve örnekleri önceden hazırlamak anlamına gelir. 2026'da yayımlanan ["Mise en Place for Agentic Coding" makalesi](https://arxiv.org/abs/2605.05400), bu kasıtlı hazırlık adımının, ajanı çalışırken "keşfetmeye" bırakmaktan daha az context explosion'a ve daha az drift'e yol açtığını öne sürüyor. Pratikte bu, bir görev başlamadan önce ilgili dosyaları, ADR'leri (architecture decision record) ve son üç ilgili PR'ı tek bir context paketi hâline getirmek demek.

Bu dört tekniği birleştiren ekipler, [Claude Code, Cursor ve Antigravity gibi araçları](/tr/posts/claude-code-cursor-antigravity-2026) kıyasladıklarında genellikle aracın kendisinden çok, o aracın etrafına kurdukları context boru hattının kaliteye daha çok etki ettiğini görüyor.

## Sıkça Sorulan Sorular

### Context engineering prompt engineering'in yerini mi alıyor?

Hayır, onu kapsıyor ve genişletiyor. İyi bir prompt hâlâ gerekli ama artık yeterli değil; çok adımlı bir ajan oturumunda başarının çoğu, promptun kendisinden çok ajana hangi dosyaların ve geçmiş kararların gösterildiğine bağlı.

### AI kodlama ajanına tüm repoyu context olarak vermek mantıklı mı?

Genellikle hayır. Chroma'nın 2025 "Context Rot" araştırması, giriş token sayısı arttıkça test edilen 18 modelin tamamının doğruluğunun düştüğünü gösteriyor; güvenle kullanılabilir context genellikle modelin ilan edilen penceresinin dörtte biri ile onda biri arasında kalıyor.

### Context rot nedir, nasıl önlenir?

Context rot, context'e eklenen token sayısı arttıkça model çıktısının kalitesinin düşmesi olgusudur. Önlemi retrieval scoping ile ilgisiz içeriği baştan elemek, düzenli özetleme ile eski context'i sıkıştırmak ve kritik bilgiyi context'in başına veya sonuna yerleştirmektir.

### Uzun bir ajan oturumunda spec ile kod arasındaki uyumsuzluğu nasıl fark ederim?

Ajana periyodik olarak dosya durumunu `git diff` veya hash karşılaştırmasıyla yeniden doğrulatarak. Ajanın 15-20 adım önce okuduğu bir dosyanın hâlâ doğru olduğunu varsaymak yerine, düzenli aralıklarla varsayımlarını gerçek kod tabanıyla karşılaştırmasını iş akışına dahil edin.
