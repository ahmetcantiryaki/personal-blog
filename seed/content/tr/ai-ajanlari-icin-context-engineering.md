---
title: "AI Ajanları İçin Context Engineering Rehberi"
slug: "ai-ajanlari-icin-context-engineering"
translationKey: "context-engineering-ai-agents"
locale: "tr"
excerpt: "Uzun görevlerde ajan hataları çoğu zaman model değil, context hatasıdır. Yedi kalıp, bir context bütçesi ve mevcut bir ajana uygulanabilecek kontrol listesi."
category: "ai"
tags: ["ai-agents", "prompt-engineering", "best-practices", "reliability"]
publishedAt: "2026-07-07"
seoTitle: "AI Ajanları İçin Context Engineering Rehberi"
seoDescription: "Uzun görevlerde ajan hataları model değil, çoğunlukla context hatasıdır. Yedi kalıp, bir context bütçesi ve bir ajana uygulanabilecek kontrol listesi."
---

Bir görevin ilk üç adımını kusursuz yapan, sonra onikinci adımda sessizce raydan çıkan bir ajanın neredeyse hiçbir zaman model sorunu yoktur. Sorun context'tedir: pencere eskimiş araç çıktısı, birbiriyle çelişen talimatlar ya da alakasız geçmişle dolmuştur ve model artık sinyal üzerinde değil gürültü üzerinde akıl yürütmeye başlamıştır. Bunu düzeltmek model değiştirmekle olmuyor — context engineering ile oluyor ve 2026'nın ortası itibarıyla üretim ajanları için en çok atıfta bulunulan sınırlayıcı etken, ham model kapasitesinin önüne geçmiş durumda.

## Ajan hataları model hatası değil, context hatasıdır

Sınır modeller artık 1M+ token pencereyle geliyor, ama pratikte ekiplerin çarptığı darboğaz kapasite değil. Uzun süre çalışan ajanlar üzerine yapılan araştırmalar, context içindeki *alakalı* bilgi kabaca 50 bin token'ı geçtiğinde çıktı kalitesinin düştüğünü tutarlı biçimde gösteriyor — bu, pencere dolmadan çok önce gerçekleşiyor, çünkü alakasız ya da eskimiş içerik modelin doğru akıl yürütmek için ihtiyaç duyduğu sinyali sulandırıyor. [Anthropic'in konuyla ilgili mühendislik yazısı](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents), context'i azalan marjinal getirisi olan sonlu bir kaynak olarak çerçeveliyor: eklediğiniz her token, modelin dikkatine zaten talip olan diğer token'lara karşı yerini hak etmek zorunda.

Bu, hata ayıklama sorusunu da değiştiriyor. Bir ajan çok adımlı bir görevde yolunu şaşırdığında sorulacak ilk soru "doğru model mi" değil — "bu ajanın onikinci adımdaki context'i gerçekte neye benziyor ve bunun ne kadarı hâlâ alakalı."

## Context bütçesi: hacim değil kalite kazanır

Context'i doldurup durduğunuz bir kova değil, bir bütçe gibi ele alın. Çoğu üretim ekibi modelinin tam penceresinin yakınından bile geçmiyor — sorun, kullandıkları token'lara ne koydukları.

| Metrik | Tipik etki |
|---|---|
| Mevcut bir ajana context engineering uygulamak | Görev başına token maliyetinde %30-50 düşüş |
| Aynı müdahale, çıktı kalitesi | %25-40 iyileşme |
| Kalitenin düşmeye başladığı alakalı-context eşiği | Pencere boyutundan bağımsız olarak ~50 bin token |
| Modelinin tam context penceresini kullanan ekipler | Küçük bir azınlık |

Buradaki ders "daha az context kullan" değil — "context'teki her token'ın yerini hak etmesini sağla." 40 bin token özenle seçilmiş, alakalı durumla dolu 200 bin token'lık bir pencere, aynı pencerenin 150 bin token'lık ham araç çıktısı ve sohbet geçmişiyle tıka basa doldurulmuş haline sürekli üstün geliyor.

## Yedi temel kalıp

Üretimde context engineering yedi tekrar eden kalıba indirgeniyor. Çoğu gerçek ajan bunların hepsini değil, üç ya da dördünü bir arada kullanıyor.

| Kalıp | Ne yapar | Ne zaman kullanılır |
|---|---|---|
| Seçim (selection) | Görevi karşılayan en küçük model/context yapılandırmasını seçer | Basit ve karmaşık alt görevleri yönlendirirken |
| Sıkıştırma (compression) | Ham transkript yerine geçmiş turları özetler | Uzun süren oturumlar, çok adımlı planlar |
| RAG entegrasyonu | Daha büyük bir bilgi tabanından yalnızca alakalı dilimi talep üzerine getirir | Hiçbir pencereye sığmayacak kadar büyük kod tabanları ya da dokümanlar |
| Paylaşılan context katmanları | Birden fazla ajana context'i çoğaltmak yerine ortak bir durum deposu verir | Çok ajanlı ve subagent iş akışları |
| Context yönlendirme (routing) | Farklı ajanlara rollerine göre farklı context gönderir | Uzmanlaşmış subagent'lar (reviewer ve implementer gibi) |
| Context tahliyesi (eviction) | Eskimiş ya da geçersiz kalmış bilgiyi aktif olarak kaldırır | Erken durumun geçersizleştiği uzun oturumlar |
| Context önbellekleme (caching) | Hesaplanmış context'i yeniden göndermek yerine çağrılar arasında yeniden kullanır | Sabit bir önek paylaşan tekrarlanan çağrılar |

Seçim ve yönlendirme context'e neyin gireceğine karar verir; sıkıştırma ve tahliye neyin çıkacağına karar verir; RAG ve paylaşılan katmanlar gerçek referansın nerede yaşadığına karar verir; önbellekleme ise doğruluktan çok tamamen maliyetle ilgili olan tek kalıptır.

## Önbellekleme tuzağı: yalnızca gerçekten sabit olanı önbelleğe alın

Önbellekleme, çoğu ekibin ilk yanlış yaptığı kalıptır, çünkü hiçbir tasarım ödünleşimi olmayan saf bir kazanç gibi görünür — ta ki tek bir kararsız token sessizce onu bozana kadar. Prompt önbellekleri tam bir önek üzerinden eşleşir, dolayısıyla çağrılar arasında değişen her şey — canlı bir tarih damgası kadar küçük bir şey bile — önbelleğe alınan bloğun *içinde* değil, *sonrasında* durmalıdır. En güvenli varsayılan, yalnızca sistem promptunu ve statik araç tanımlarını önbelleğe almak, gerçekten dinamik içeriği — güncel tarih, oturum durumu, alınan belgeler — önbelleğe alınan önekin tamamen dışında tutmaktır. Bu tam hata modunun maliyet tarafını [LLM token maliyetlerini düşürme rehberimizde](/tr/posts/llm-token-maliyetini-dusurme) daha derinlemesine ele alıyoruz.

## Uygulamalı bir önce/sonra örneği

40 dosyalık bir modülde çok dosyalı bir refactor yapan bir kodlama ajanını düşünün. "Önce" durumunda context, her dosya okumasının, her test çalıştırmasının ve her önceki turun akıl yürütmesinin tam çıktısını kelimesi kelimesine biriktirir — 15. dosyaya gelindiğinde pencerenin yarısı zaten halledilmiş dosyalardan kalan ölü ağırlıktır. Ajan, düzeltmesi daha yeni ve alakasız araç çıktısının altında gömülü kaldığı için zaten düzelttiği hataları yeniden ortaya çıkarmaya başlar.

"Sonra" durumu yedi kalıptan üçünü bir arada uygular: tahliye, düzenlemeleri doğrulanan dosyaların tam içeriğini bırakır ve yalnızca neyin değiştiğine dair tek satırlık bir özet tutar; sıkıştırma, tamamlanan alt görevleri tam transkriptler yerine devam eden bir plan-durumu bloğuna sıkıştırır; RAG tarzı erişim ise bir dosyanın güncel içeriğini yalnızca ajan ona yeniden dokunmak üzereyken geri çeker. Net etki: dosya başına token maliyeti belirgin biçimde düşer ve daha önemlisi model, zaten verdiği kararları kaybetmeyi bırakır, çünkü kararlar ham geçmişe gömülmek yerine kompakt bir durum bloğunda tutulur.

## Mevcut ajanınız için kontrol listesi

Bunu üretimde zaten çalıştırdığınız bir ajana bu hafta uygulayın:

1. **Mevcut context bileşimini ölçün.** Tipik bir context penceresinin ne kadarının sistem promptu, araç çıktısı, geçmiş ve alınan veri olduğunu loglayın.
2. **Araç çıktısına üst sınır koyun.** Ayrıntılı araç sonuçlarını (test çalıştırmaları, dosya listeleri, API yanıtları) context'e girmeden önce kırpın ya da özetleyin.
3. **Tamamlanan alt görevler için tahliye ekleyin.** Bir adım doğrulanmış olarak bittiğinde, tam izini tek satırlık bir özetle değiştirin.
4. **Önbelleklenebilir içeriği dinamik içerikten ayırın.** Çağrı başına değişen her şeyi (tarihler, oturum kimlikleri, canlı durum) önbelleğe alınan önekin dışına taşıyın.
5. **Önceden yükleme yerine erişim (retrieval) getirin.** "Ne olur ne olmaz" diye tüm bir belgeyi ya da kod tabanını sistem promptuna tıkıyorsanız, talep üzerine erişime geçin — mekaniği için [RAG sistemi rehberimize](/tr/posts/rag-sistemi-nasil-kurulur) bakın.
6. **50 bin token alaka eşiğinde yeniden test edin.** Kaliteyi yalnızca maksimum pencere boyutunda değil, alakalı context bu eşiği geçtiğinde özellikle değerlendirin.

Bu temel üzerine koordineli ajanlar kuran ekiplerin [AI agent ile workflow karşılaştırmamızı](/tr/posts/ai-agent-mi-workflow-mu) da okuması iyi olur — yukarı akışta seçtiğiniz kalıp, aşağı akışta ne kadar context disiplinine ihtiyaç duyacağınızı belirler; [AI ajan belleği sistemleri](/tr/posts/ai-ajan-bellegi-sistemleri) yazımız ise context engineering'in eninde sonunda devretmek zorunda kaldığı kalıcılık katmanını ele alıyor.

## Sıkça Sorulan Sorular

### Daha büyük bir context penceresi daha basit bir çözüm değil mi?

Kapasiteyi çözer, alakayı değil. Uzun süre çalışan ajanlar üzerine yapılan çalışmalar, pencere ne kadar büyük olursa olsun alakalı context kabaca 50 bin token'ı geçtiğinde kalitenin düştüğünü tutarlı biçimde gösteriyor — daha büyük bir pencere çoğunlukla, sorun kendini göstermeden önce daha uzun süre özensiz olabilmenize alan tanır.

### Önce hangi kalıbı uygulamalıyım?

Tahliye ve sıkıştırma genellikle en hızlı ölçülebilir kazancı verir, çünkü erişim ya da önbellekleme mimarinize hiç dokunmadan en yaygın hatayı (pencereyi dolduran eskimiş araç çıktısını) doğrudan hedefler.

### Context engineering prompt engineering'den nasıl farklı?

Prompt engineering tek, çoğunlukla statik bir talimatı optimize eder. Context engineering ise tüm token bütçesini — sistem promptu, araçlar, alınan veri, geçmiş — çok adımlı, çok turlu bir görev boyunca sürekli yönetilen bir kaynak olarak ele alır.

### Context engineering fine-tuning'in ya da daha iyi bir modelin yerini tutar mı?

Hayır — ikisi farklı sorunları çözer. Daha güçlü bir model aynı context üzerinde daha iyi akıl yürütür; context engineering ise modelin baştan doğru bilgi üzerinde akıl yürütmesini sağlar. 2026'daki üretim kalite kazanımlarının çoğu ikincisinden geldi, çünkü çoğu ekibin gerçek darboğazı context'in kendisiydi.
