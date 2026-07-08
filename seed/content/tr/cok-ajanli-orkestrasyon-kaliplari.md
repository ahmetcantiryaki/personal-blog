---
title: "Çok Ajanlı Orkestrasyon Kalıpları"
slug: "cok-ajanli-orkestrasyon-kaliplari"
translationKey: "multi-agent-orchestration-patterns"
locale: "tr"
excerpt: "İkinci bir AI ajanı ne zaman gerçekten işe yarar? Supervisor, sıralı devir ve paralel fan-out kalıpları, hata modları ve gerçek token maliyetiyle."
category: "ai"
tags: ["ai-agents", "workflow", "best-practices", "automation"]
publishedAt: "2026-07-08"
seoTitle: "Çok Ajanlı Orkestrasyon Kalıpları Açıklandı"
seoDescription: "İkinci bir AI ajanı ne zaman işe yarar? Supervisor, sıralı devir ve paralel fan-out kalıpları; hata modları ve gerçek token maliyetiyle karşılaştırıldı."
---

İkinci bir ajan ancak görev gerçekten bağımsız alt parçalara bölünebiliyorsa, her adımda farklı bir persona veya araç kapsamı gerekiyorsa ya da tek bir context penceresi taşacaksa işe yarar. Bunun dışındaki her durum, daha iyi araçlara sahip tek bir ajandır; çok ajanlı orkestrasyon istisna olmalı, varsayılan seçim değil.

## İkinci bir ajan eklemek gerçekten ne zaman işe yarar?

Dürüst cevap, pazarlamanın önerdiğinden çok daha az sıklıkta. Anthropic'in kendi mühendislik ekibi, Claude'un arkasındaki çok ajanlı araştırma sistemini anlatırken, lider ajan artı alt ajanlardan oluşan kurulumun tek bir sohbet etkileşimine kıyasla yaklaşık 15 kat daha fazla token tükettiğini ve token kullanımının tek başına, dahili değerlendirmelerindeki çıktı kalitesi farkının yaklaşık %80'ini açıkladığını bulmuş. Kazanç gerçekti — çok ajanlı sürüm, geniş kapsamlı araştırma görevlerinde tek bir Claude Opus 4 ajanını %90'ın üzerinde bir farkla geçti — ama ekip aynı zamanda bu tür bir orkestrasyonun, alt ajanların birbirinin durumuna sürekli müdahale ettiği kodlama gibi sıkı bağımlı işlerde zorlandığını açıkça belirtiyor ([Anthropic Engineering, "How we built our multi-agent research system"](https://www.anthropic.com/engineering/multi-agent-research-system)). Bu tek veri noktası, tasarım sorusunun minyatür hâli: çok ajanlı orkestrasyon, iş paralel ve düşük bağımlılıklı parçalara ayrıldığında kazanır; görev tek bir kesintisiz düşünce akışıysa ve ikinci ajan onu yalnızca bölebiliyorsa kaybeder.

Ajan döngüsüne mi yoksa sabit bir workflow'a mı ihtiyacınız olduğu sorusunu henüz netleştirmediyseniz, önce [AI agent mı workflow mu](/tr/posts/ai-agent-mi-workflow-mu) yazımıza bakın — orkestrasyon kalıpları ancak bu ayrımın ötesinde anlam kazanıyor.

## Supervisor/router kalıbı nedir, ne zaman kazandırır?

Supervisor (yönlendirici) ajan, gelen isteği okuyup hangi uzman ajanın veya aracın işi üstleneceğine karar veren, işi dağıtan ve sonuçları yanıt vermeden önce birleştiren tek bir ajandır. Çoğu ekibin ilk başvurduğu kalıp budur; çünkü bir insan takım liderinin işi nasıl devrettiğine doğrudan benzer: tek temas noktası, arkasında birkaç dar kapsamlı uzman.

Uzmanlar gerçekten birbirinden farklıysa — veritabanına yazma yetkisi olan bir faturalama ajanı, salt okunur arama yapan bir doküman ajanı, sandbox'lı bir kabuğa sahip bir kod ajanı — ve yönlendirme kararı dağıtılan işe kıyasla ucuzsa kazandırır. Supervisor'ın kendisi darboğaz hâline geldiğinde kazandırmayı bırakır: her devir supervisor üzerinden gidip geldiği için context penceresi her alt konuşmanın durumunu biriktirir. Claude Code'un subagent modeli bu kalıbın hafif tutulmuş pratik bir örneği: subagent'lar kendi context'lerinde çalışır ve supervisor'a tüm konuşma dökümü yerine bir özet raporlar — supervisor'ı bir sonraki darboğaz hâline gelmekten alıkoyan tam olarak budur ([Claude Code subagent ve arka plan ajanları](/tr/posts/claude-code-subagent-arka-plan-ajanlari)).

## Sıralı devir ne zaman supervisor'dan daha iyidir?

Sıralı devir (hand-off) bir hat gibi işler: A ajanı kendi aşamasını bitirir ve yapılandırılmış bir çıktıyı B ajanına devreder, B de C'ye devreder; hiçbir ajan tüm resmi aynı anda elinde tutmaz. Araştırma ajanından taslak yapısına, oradan yazım ajanına, oradan doğrulama ajanına giden bir zincir düşünün.

Aşamalar doğal olarak sıralıysa ve her biri farklı bir araç kapsamı veya persona gerektiriyor ama diğerlerinin ham akıl yürütmesini değil yalnızca çıktısını görmesi yeterliyse, bu kalıp supervisor'ı geride bırakır. Context büyümesini de supervisor döngüsünden daha iyi sınırlar; çünkü her ajan yalnızca kendi aşamasını ve devraldığı çıktıyı tutar, tüm koşunun birikmiş geçmişini değil. Bedeli gecikmedir: beş aşamalı bir hat, beş sıralı gidiş-dönüş demektir ve ikinci aşamadaki bir hata, aradaki geçişlere bir doğrulama koymadıysanız sessizce üçüncü, dördüncü ve beşinci aşamaya sızar.

## Paralel fan-out'a ne zaman geçmeli, sonuçları kim birleştirir?

Paralel fan-out, aynı veya ilişkili alt soruları birkaç ajana aynı anda gönderir; ardından bir reducer adımı çıktıları tek bir yanıtta birleştirir. Anthropic'in araştırma sisteminin arkasındaki kalıp da bu: lider ajan bir sorguyu bağımsız araştırma yönlerine ayırır, her biri için eş zamanlı alt ajanlar başlatır ve dönen bulguları sentezler.

Alt görevler birbirleriyle konuşmadan çalışabilecek kadar bağımsızsa tam olarak burada kazandırır — beş şirket arasında rekabet analizi yapmak, beş prompt varyantını test etmek, bir kod tabanını beş farklı sorun sınıfı için taramak gibi. Alt görevler aslında birbirinin bulgularına bağımlıysa başarısız olur; çünkü paralel ajanlar kardeşlerinin o an ne yaptığını göremez, sonuçta aynı aramayı tekrarlayan, birbiriyle çelişen sonuçlar üreten ya da hepsi aynı düşük kaliteli kaynağa yönelen beş ajan ortaya çıkar. Reducer burada opsiyonel değildir; çelişkileri çözen ve tekrar eden bulguları eleyen bilinçli bir birleştirme adımı olmadan fan-out, bir insanın (ya da supervisor'ın) elle eleyeceği daha fazla gürültü üretmekten öteye geçmez.

```text
// Fan-out + reduce adımı içeren bir supervisor/router dağıtım döngüsü taslağı
function handleRequest(request):
    plan = supervisor.decompose(request)       // tek LLM çağrısı, ucuz
    if plan.independent_subtasks:
        results = parallel_map(plan.subtasks, agent.run)   // fan-out
        answer  = reducer.merge(results)                   // reduce
    else:
        answer = pipeline.run_sequential(plan.subtasks)    // sıralı devir
    return supervisor.finalize(answer, request)
```

## Hangi kalıp hangi işe uyar?

| Kalıp | En uygun olduğu iş | Yaygın hata modu | Göreli token maliyeti |
|---|---|---|---|
| Supervisor/router | Farklı uzman araçlar, düşük gecikmeli yönlendirme | Devirler biriktikçe supervisor context'inin şişmesi | Tek ajanın ~2–4 katı |
| Sıralı devir | Sıralı aşamalar, her biri farklı bir persona gerektirir | Hatanın aşamalar arasında sessizce büyümesi | Tek ajanın ~1,5–3 katı |
| Paralel fan-out + reducer | Bağımsız, parçalanabilir araştırma veya analiz | Gerçek bir reducer olmadan tekrar eden iş, çelişen çıktılar | Tek ajanın ~10–15 katı |
| Paylaşımlı context katmanı | Ortak durum gereken uzun ömürlü ajan takımları | Bayat veya şişmiş paylaşımlı bellek, yazma yarışları | Değişken — ajan sayısına değil durum boyutuna bağlı |

## Paylaşımlı context katmanına ihtiyacınız var mı?

Paylaşımlı context katmanı, sistemdeki her ajanın birbirine tam konuşma dökümü aktarmak yerine okuyup yazdığı kalıcı bir depo — bir scratchpad, bir bellek servisi, bir vektör veritabanı. Diğer üç kalıbın altında yatan bir altyapı katmanı gibi düşünülmeli; ajanlar tek bir isteğin ömründen uzun yaşamaya başladığında veya aynı bilgileri tekrar tekrar keşfetmemesi gerektiğinde zorunlu hâle gelir.

En sık gördüğümüz tasarım hatası, ajanların tüm akıl yürütme sürecini kompakt ve yapılandırılmış bir özet yerine olduğu gibi paylaşımlı depoya yazması. Bu, paylaşımlı katmanın çözmesi gereken context şişmesi sorununu bir seviye öteye taşıyarak yeniden üretir. [Context engineering rehberimiz](/tr/posts/ai-ajanlari-icin-context-engineering), paylaşımlı context'e giren bilgiyi küçük ve yüksek sinyalli tutmanın yollarını anlatıyor; [AI ajan belleği](/tr/posts/ai-ajan-bellegi-sistemleri) yazımız ise kısa ve uzun vadeli bellek ayrımının bu katmana neyin girmesi gerektiğini nasıl belirlediğini ele alıyor.

## Çok ajanlı sistemlerde gerçekte ne bozuluyor?

Çok ajanlı olaylarının çoğu üç hata modundan kaynaklanır ve bunlar birbirini büyütür:

- **Context şişmesi.** Özet yerine tam konuşma dökümü içeren her devir, bir sonraki ajanın context penceresini büyütür. Supervisor kalıbında en çok bunu supervisor hisseder; paylaşımlı context katmanında ise depoyu okuyan herkes.
- **Tekrar eden iş.** Kapsamları örtüşen paralel ajanlar aynı aramayı tekrarlar, aynı API'yi çağırır veya birbirinden bağımsız olarak aynı sonuca varır; bilgi eklemeden token tüketir. Reducer adımını atlamanın en yaygın belirtisi budur.
- **Kontrolden çıkan maliyet.** Kendi alt ajanlarını doğurabilen veya başarısız alt görevleri sınırsız yeniden deneyen ajanlar, sınırlı bir workflow'u sınırsız hâle getirir. Bu, herhangi bir kalıbın tasarım kusurundan çok eksik bir güvenlik katmanı meselesidir — [LLM guardrail kontrol listemizde](/tr/posts/uretim-icin-llm-guardrail-kontrol-listesi) ele aldığımız kategori tam olarak bu; bir ajanın ne yazmasına izin verildiği kadar, hangi alt ajanları doğurmasına izin verildiğine de uygulanır.

Orkestrasyona yönelmeden önce, bir araç içinde doğrudan çalışan tek ve iyi kapsamlanmış bir ajanla — bir tarayıcı oturumu, bir kabuk, bir API istemcisi — karşılaştırmakta fayda var; hiçbir koordinasyon katmanı olmadan.

## Peki, çok ajanlı orkestrasyon maliyetine değer mi?

Temmuz 2026 itibarıyla dürüst çerçeve şu: parçalanabilir, yüksek değerli araştırma ve analiz işleri için değer; tek ve iyi araçlanmış bir ajanın tek bir kesintisiz context içinde yapabileceği her şey için nadiren değer. Maliyet varsayımsal değil. Tek ajanlı bir sohbet etkileşimi size token olarak 0,02 dolara mal oluyorsa, yaklaşık 15 kat ek yük getiren bir fan-out kalıbı aynı temel istek için 0,30 dolara yakın bir maliyete çıkar — supervisor başarısız bir alt ajanı yeniden denerse veya paylaşımlı context deposu kontrolsüz büyümeye devam ederse bu rakam bir kez daha katlanır. Bir workflow'a ikinci bir ajan eklemeden önce, token çarpanını yalnızca daha hızlı yanıt almanın değerine değil, görevin gerçek değerine karşı fiyatlandırın. [LLM token maliyetini düşürme rehberimiz](/tr/posts/llm-token-maliyetini-dusurme), kalıbın değdiğine karar verdikten sonra bu çarpanı düşük tutmak için somut taktikler içeriyor. AI ajan araç ekosistemi de bu dengeyi yansıtıyor: 2026 ortası itibarıyla on iki kategoriye yayılan 120'den fazla üretime hazır ajan aracı var ve çok ajanlı orkestrasyon çerçeveleri — LangGraph, CrewAI, Microsoft'un AutoGen/AG2'si, Google'ın ADK'sı ve diğerleri — bu haritadaki en hızlı büyüyen uzun kuyruk segmentlerinden biri; çünkü giderek daha fazla ekip tam olarak bu yazıda anlatılan koordinasyon sorunuyla karşılaşıyor ([AI Agents Landscape & Ecosystem, Temmuz 2026](https://aiagentsdirectory.com/landscape)).

## Sıkça Sorulan Sorular

### Çok ajanlı bir sistem her zaman tek ajandan daha mı doğru?

Hayır. Anthropic'in kendi kıyaslaması geniş kapsamlı araştırma görevlerinde gerçek bir doğruluk kazancı gösterdi, ama aynı ekip kodlama gibi sıkı bağımlı görevlerde birden fazla ajanın işi kötüleştirme eğiliminde olduğunu belirtiyor; çünkü alt ajanlar birbirinin devam eden durumunu göremiyor ve sonunda çelişiyor.

### Sıralı devir mi paralel fan-out mu, nasıl seçilir?

Alt görevlerin birbirinin çıktısına bağımlı olup olmadığını sorun. İkinci aşama birinci aşamanın sonucuna ihtiyaç duyuyorsa sıralı devri kullanın. Alt görevler herhangi bir sırada veya eş zamanlı, birbirinin ara durumuna ihtiyaç duymadan çalışabiliyorsa fan-out'a geçip bir reducer ekleyin.

### Zaten devir veya fan-out kullanıyorsam supervisor'a ihtiyacım var mı?

Genellikle evet, ama ince bir biçimde — bir isteğe hangi kalıbın uygulanacağına karar verecek ve yanıtı sonlandıracak bir şey gerekir. Bu supervisor'ın görevini dar tutun (yönlendirsin, yeniden türetmesin) ki kalıbın önlemeye çalıştığı context darboğazı hâline gelmesin.

### Çok ajanlı orkestrasyonda en büyük maliyet kolu nedir?

Ajanlar arasında kompakt ve yapılandırılmış özetler yerine tam konuşma dökümü aktarmak. Ajan sayısından çok bu tek alışkanlık, üretimdeki fan-out sistemlerinde görülen 10–15 kat token çarpanının asıl sebebi.
