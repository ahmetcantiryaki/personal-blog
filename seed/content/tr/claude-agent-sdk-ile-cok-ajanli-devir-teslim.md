---
title: "Claude Agent SDK ile Çok Ajanlı Devir Teslim"
slug: "claude-agent-sdk-ile-cok-ajanli-devir-teslim"
translationKey: "multi-agent-handoffs-claude-agent-sdk"
locale: "tr"
excerpt: "Her Claude Agent SDK alt ajanı sıfırdan, yalıtılmış bir konuşmada çalışır ve sadece son mesajını döndürür. Transkript dökmeyin, görev tanımı verin."
category: "ai"
tags: ["ai-agents", "claude", "mcp", "workflow"]
publishedAt: "2026-10-25"
seoTitle: "Claude Agent SDK ile Çok Ajanlı Devir Teslim"
seoDescription: "Claude Agent SDK alt ajanı sadece son mesajını döndürür, akıl yürütme izini değil. Pipeline'ınız bağlam kaybetmesin diye devir teslimde ne vermeli?"
---

Kısa cevap: bir alt ajana, ham döküm yerine kendi başına yetecek bir görev tanımı verin — hedef, elenen yollar, ham veri yerine dosya işaretçileri. Çünkü alt ajan sıfır hafızayla başlar; üst taraf da sadece son mesajını görür, akıl yürütme izini görmez. Bunu yanlış kurarsanız ya alt ajanı gereksiz geçmişle boğarsınız ya da ihtiyaç duyduğu ayrıntıdan mahrum bırakırsınız.

## Çok ajanlı sistemlerde devir teslim problemi nedir?

Kısa cevap: kontrol bir ajandan diğerine her geçtiğinde ortaya çıkan bilgi kaybıdır — alıcı ajan işini yapmak için ya çok az bağlam alır ya da gönderen, içinden sinyali bulamayacağı kadar çok ham geçmiş döker. Her iki hata da aynı belirtiyi üretir: zaten yapılmış işi tekrarlayan ya da yukarı akışta zaten verilmiş bir kararla çelişen bir ajan.

Bunun daha ince bir versiyonu, ajan zinciri boyunca doğrulama yanlılığıdır. Ajan A "hata önbellek katmanında" sonucuna ulaşır ve bu çerçeveyi ajan B'ye verirse, B — özellikle devir teslim A'nın akıl yürütmesini ya da A'nın elediği alternatifleri değil sadece sonucu taşıyorsa — iddiayı bağımsız doğrulamak yerine onu doğrulayan kanıt aramaya meyillidir.

## Claude Agent SDK'da bağlam yalıtımı gerçekte nasıl çalışır?

Kısa cevap: Claude Agent SDK tarafından başlatılan her alt ajan tamamen yeni bir konuşma başlatır. Üst konuşmanın mesaj geçmişini devralmaz, ara araç çağrıları üst tarafa görünmez ve yalnızca döndürdüğü son mesaj sınırı geri geçer. Bu, etrafından dolaşılması gereken bir sınırlama değil, kasıtlı bir tasarım.

Alt ajanın devraldığı şeyler: kendi sistem prompt'u (`AgentDefinition`'ında ayarlanan), orkestratörün gönderdiği görev mesajı, projenin CLAUDE.md dosyaları ve kendi tanımında açıkça listelenen araç ve skill'ler. Orkestratörün sistem prompt'unu, orkestratörün ham araç çağrısı transkriptini ya da açıkça kendisine verilmemiş skill'leri görmez.

```typescript
import { query, type AgentDefinition } from "@anthropic-ai/claude-agent-sdk";

const arastirmaAjani: AgentDefinition = {
  description: "Dar bir teknik soruyu araştırır ve bir sonuç döndürür",
  prompt: "Odaklı bir araştırma ajanısın. İddiaları sadece birincil kaynaklara karşı doğrula.",
  tools: ["WebSearch", "WebFetch"],
};

for await (const message of query({
  prompt: "X kütüphanesinin 4.x sürümünde bilinen bir CVE var mı araştır",
  options: { agents: { arastirmaci: arastirmaAjani } },
})) {
  // burada sadece arastirmaci'nin son mesajı görünür — arama adımları değil
}
```

## Devir teslimde gerçekte ne geçirilmeli?

Kısa cevap: bir transkript değil görev tanımı geçirin — somut hedef, kısıtlar, zaten elenen yollar ve neden elendikleri, dosya içeriğini yapıştırmak yerine dosya ya da satır numarası işaretçileri. Bir işaretçi birkaç token'a mal olur; ham bir döküm binlerce token'a mal olur ve yine de önemli olan tek satırı kaçırabilir.

| Bunu geçirin | Bunu değil | Neden |
| --- | --- | --- |
| "`queue.ts:142`'deki yarış koşulunu düzelt, bu stack trace ile doğrulandı" | O tespite yol açan tüm sohbet günlüğü | Sonuç ve kanıtı yeniden üretilebilir; sohbet günlüğü değil |
| "A ve B seçenekleri X nedeniyle elendi" | Zaten denenenler hakkında sessizlik | Bu olmadan alt ajan çıkmaz sokakları yeniden keşfeder |
| Bir dosya yolu ve satır aralığı | Satır içine yapıştırılmış tüm dosya | İşaretçiler ucuzdur; dökümler bağlam bütçesini hızla tüketir |
| Alt ajanın döndürmesi gereken yapılandırılmış bir çıktı şeması | "Bulduğunu bana söyle, yeter" | Serbest metin dönüşler orkestratör için güvenilir şekilde ayrıştırmak daha zordur |

## Yaygın çok ajanlı devir teslim kalıpları nelerdir?

Kısa cevap: gerçek sistemlerin çoğunu üç kalıp kapsar — tek bir koordinatörün bağımsız alt görevleri dağıtıp sonuçları birleştirdiği orkestratör-çalışan; her ajanın çıktısının sabit bir sırayla bir sonrakinin girdisi olduğu sıralı pipeline; ve ajanların birbirine doğrudan mesaj geçirmek yerine ortak bir depoyu okuyup yazdığı paylaşılan not defteri.

Orkestratör-çalışan, paralelleştirilebilir araştırma ya da veri toplama görevlerine uyar; çünkü yalıtılmış alt ajanlar birbirinin bağlamına basmadan eşzamanlı çalışabilir. Sıralı pipeline'lar, doğal bir sırası olan görevlere uyar — önce planla, sonra uygula, sonra incele — burada her aşama gerçekten öncekinin tamamlanmış çıktısına bağımlıdır. Paylaşılan not defteri, birden fazla ajanın her birinden her birine doğrudan devir teslime gerek kalmadan değişen duruma (paylaşılan bir görev listesi, biriken bulgular) görünürlük ihtiyacı duyduğu uzun süreli işlere uyar.

## Bir ajan zinciri boyunca bağlam nasıl bütçelenir?

Kısa cevap: her alt ajanın bağlam penceresini bilinçli harcadığınız sabit bir bütçe olarak ele alın ve ham geçmişi ileri taşımak yerine sınırda özetleyin. Her devir teslim bir sıkıştırma fırsatıdır — sonucu ve onu destekleyen kanıtı tutun, işe yaramayan keşfi bırakın.

Her biri önceki transkriptin tamamını ilettiği beş ajanı zincirleyen bir pipeline, görev bitmeden çok önce bağlam sınırlarına ya da zayıflamış dikkate çarpar. Her sınırda sıkıştırılmış bir özet ileten bir pipeline çok daha uzun çalışabilir; çünkü her ajan sadece harekete geçmek için gerçekten ihtiyaç duyduğu bilginin bedelini öder.

## Devir teslim başarısız olunca ne olur, nasıl kurtarılır?

Kısa cevap: en yaygın hata, alt ajanın orkestratörün ayrıştıramadığı ya da üzerinde hareket edemediği bir sonuç döndürmesidir; genellikle görev tanımı bir çıktı formatı belirtmediği için. Çözüm, yapılandırılmış çıktı zorunlu kılmaktır — alt ajanın döndürmesi gereken sabit bir şema — ve bozuk bir yanıtı sessizce kabul etmek yerine netleştirilmiş bir görev tanımıyla yeniden denemektir.

Yeniden deneme yolunu açıkça kurun: alt ajanın çıktısı şema doğrulamasını geçemezse, belirsiz bir "tekrar dene" yerine doğrulama hatasını görev tanımına ekleyerek yeniden gönderin. Giderek daha spesifik hata geri bildirimiyle iki üç yeniden deneme çoğu hatayı çözer; bunun ötesinde, sonsuz döngüye girmek yerine hatayı bir insana bildirin.

Bunun altındaki protokol katmanı için — bir ajanın dış araçları gerçekte nasıl çağırdığı — [ilk MCP bağlayıcınızı yazma rehberimize](/tr/posts/ilk-mcp-baglayicini-yaz-2026) bakabilirsiniz. Görevinizin böyle bir çok ajanlı orkestrasyona gerçekten ihtiyacı olup olmadığına karar veriyorsanız önce [AI Agent mı Workflow mu](/tr/posts/ai-agent-mi-workflow-mu) yazımızı okuyun; ajanik görünen birçok görev sabit bir pipeline ile daha iyi çözülür. Uçtan uca işleyen bir örnek için [Claude ile ticaret ajanı kurma](/tr/posts/claude-ile-ticaret-ajani-kurmak) yazımıza bakın.

Kişisel değerlendirmem: çoğu ekip, iyi araçlara sahip tek, net kapsamlı bir ajanın yapabileceklerini tüketmeden çok ajanlı mimarilere yöneliyor; yukarıdaki devir teslim yükü de tam olarak bölünmesi gerekmeyen bir işi böldüğünüz için ödediğiniz bedeldir. Alt ajanlara, bir görev gerçekten yalıtılmış bağlama ya da gerçek paralelliğe ihtiyaç duyduğunda başvurun — varsayılan mimari olarak değil.

## Sıkça Sorulan Sorular

### Claude Agent SDK alt ajanı üst konuşmanın geçmişini görür mü?

Hayır. Her alt ajan, üst konuşmanın mesaj geçmişine ya da ara araç çağrılarına erişimi olmayan tamamen yeni bir konuşma başlatır. Sadece kendi sistem prompt'unu, kendisine gönderilen görev mesajını ve projenin CLAUDE.md dosyalarını alır.

### Claude Agent SDK'da bir alt ajan orkestratöre ne döndürür?

Sadece son mesajını. Alt ajanın attığı her ara araç çağrısı ve akıl yürütme adımı kendi yalıtılmış bağlamında kalır ve orkestratöre geri geçmez — bu yüzden alt ajanlardan yapılandırılmış çıktı istemek sonuçları güvenilir şekilde ayrıştırmayı kolaylaştırır.

### Orkestratör-çalışan ile sıralı pipeline kalıpları arasındaki fark nedir?

Orkestratör-çalışan, bağımsız alt görevleri paralel çalışabilen birden fazla alt ajana dağıtır, sonra sonuçlarını birleştirir. Sıralı pipeline, ajanları sabit bir sırada çalıştırır; her birinin çıktısı bir sonrakinin girdisi olur — önce-planla-sonra-uygula-sonra-incele gibi gerçek bir bağımlılık zinciri olan görevlere uyar.

### Ajanlar arasında tam konuşma geçmişi geçirmek neden sorun yaratır?

Bağlam bütçesini hızla tüketir ve alıcı ajanın gerçekte ihtiyaç duyduğu sinyali ilgisiz keşif geçmişinin içine gömer. Hedef, elenen yollar ve ham döküm yerine dosya işaretçileri içeren sıkıştırılmış bir görev tanımı, zincirdeki her ajanın bağlam sınırına çarpmadan önce daha uzun çalışmasını sağlar.

Kaynaklar:
- [Claude Agent SDK: Subagents (platform.claude.com)](https://platform.claude.com/docs/en/agent-sdk/subagents)
- [Anthropic'in çok ajanlı araştırma sistemi (anthropic.com/engineering)](https://www.anthropic.com/engineering/multi-agent-research-system)
