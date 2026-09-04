---
title: "Claude Zamanlanmış Görevlerle Otomasyon Nasıl Kurulur?"
slug: "claude-zamanlanmis-gorevler-otomasyon"
translationKey: "claude-cowork-scheduled-tasks"
locale: "tr"
excerpt: "Kısa cevap: Cowork'te görevi bir kez tarif edersin, sıklığını seçersin; Claude onu bilgisayarın kapalıyken bile kendi oturumunda çalıştırır."
category: "ai"
tags: ["claude", "automation", "workflow", "productivity"]
publishedAt: "2026-09-04"
seoTitle: "Claude Zamanlanmış Görevler: Otomasyon Rehberi 2026"
seoDescription: "Claude Cowork'te zamanlanmış görevler nasıl çalışır? İyi prompt tasarımı, bildirim sınırı, güvenlik önlemleri. Haftalık özet şablonu burada."
---

Kısa cevap: Claude Cowork'te bir zamanlanmış görev, tarif ettiğiniz talimatı Claude'un kaydedip günlük, haftalık, hafta içi veya saatlik bir sıklıkta kendi başına, tekrar tekrar çalıştırdığı bir otomasyon türü; her çalıştırma kendi bağımsız Cowork oturumunu oluşturur ve bilgisayarınız kapalı olsa bile uzaktan çalışmaya devam eder.

Ama dikkat: Cowork şu anda bir görev tamamlandığında veya başarısız olduğunda otomatik bildirim göndermiyor — sonucu görmek için Zamanlanmış (Scheduled) sekmesini kontrol etmeniz gerekiyor.

## Zamanlanmış Görev Nedir ve Nerede Çalışır?

Bir zamanlanmış görev, bir talimatı bir kez yazıp Claude'a kaydettirdiğiniz, ardından seçtiğiniz sıklıkta (günlük, haftalık, hafta içi, saatlik veya talep üzerine) otomatik olarak yeniden çalıştırdığınız bir Cowork özelliği. Her çalıştırma, geçmiş konuşmayı devam ettirmek yerine kendi bağımsız Cowork oturumunu oluşturuyor; bu da her koşunun temiz bir başlangıç noktasından çalışması, önceki hataların bir sonrakine taşınmaması anlamına geliyor.

Görevler uzaktan çalışıyor, yani sıklığına göre bilgisayarınız uykuda veya Claude Desktop uygulaması kapalı olsa bile devam ediyor. Bağlı Slack, dosya sistemi veya diğer eklentileri kullanarak web araştırması yapabiliyor, dosya sorgulayabiliyor ve rapor üretebiliyor — yani görev, elle çalıştırdığınız herhangi bir Cowork oturumunun yapabildiği her şeyi yapabiliyor.

## İyi Bir Tekrarlayan Prompt Nasıl Tasarlanır?

Üç özelliği olan bir talimat yazarak: kendi kendine yeterli (bağlam için önceki bir konuşmaya güvenmiyor), idempotent (aynı görev iki kez çalışsa bile zararlı bir yan etki üretmiyor) ve net bir başarı kriteri var (görev ne zaman "tamamlandı" sayılır, açıkça belirtilmiş). Zamanlanmış bir görev her çalıştığında sıfırdan başladığı için, "yukarıdaki tabloyu güncelle" gibi önceki bir mesaja atıfta bulunan talimatlar işe yaramıyor.

Örneğin "bu haftaki satış rakamlarını özetle" yerine "şu Google E-Tablo bağlantısındaki verinin son 7 güne ait satırlarını al, toplam ve haftalık değişimi hesapla, sonucu şu formatta bir rapor olarak yaz" gibi bağımsız ve ölçülebilir bir talimat daha güvenilir çalışıyor. İdempotentlik özellikle dosya yazan veya e-posta gönderen görevlerde kritik: görev iki kez tetiklenirse aynı dosyanın üzerine yazmalı, yeni bir kopya oluşturmamalı.

## Sonuçlar Uzaktayken Size Nasıl Ulaşır?

Şu anda tam olarak ulaşmıyor — bu, Cowork'ün zamanlanmış görevlerindeki en büyük pratik sınır. Cowork bir görev tamamlandığında veya başarısız olduğunda push bildirimi veya e-posta göndermiyor; sonucu görmek için Zamanlanmış sekmesindeki çalıştırma geçmişini elle kontrol etmeniz gerekiyor. Bu, "haftalık özeti pazartesi sabahı otomatik olarak alacağım" beklentisiyle kuran ekipler için sürpriz olabiliyor.

Claude Code tarafında durum farklı: Routines (rutinler) özelliği, tetiklendiğinde push ve e-posta bildirimi gönderebiliyor, hatta sonucu doğrudan aynı oturuma geri besleyebiliyor. Yani "sonucu bana otomatik bildir" ihtiyacınız varsa ve Claude Code kullanıyorsanız, bugün itibarıyla Cowork'ün zamanlanmış görevlerinden daha güvenilir bir seçenek bu. Cowork'te kalmak istiyorsanız, pratik çözüm görevin kendisine "sonucu Slack'e veya e-postaya gönder" adımını dahil etmek — bildirimi platformun kendisinden değil, görevin çıktısından almak.

## Otonom Çalıştırmalar İçin Hangi Güvenlik Önlemleri Gerekli?

Üç şeyi sınırlayarak: kapsam (görevin hangi dosyalara, bağlantılara ve eklentilere erişebileceği), izinler (görevin hangi eylemleri onay istemeden yapabileceği) ve maliyet (bir çalıştırmanın ne kadar token/süre harcayabileceği). Zamanlanmış bir görev insan gözetimi olmadan çalıştığı için, elle çalıştırılan bir oturumda "bir kerelik" kabul edilebilecek geniş bir izin, otomatik ve tekrarlayan bir görevde çok daha riskli hale geliyor.

Pratik kural: bir zamanlanmış göreve, o görevin gerçekten ihtiyaç duyduğu en dar eklenti ve dosya erişim kümesini verin, "her ihtimale karşı" geniş erişim vermeyin. Veri okuyan ve rapor üreten görevler (haftalık özet gibi) düşük risk taşıyor; dosya silen, ödeme yapan veya dış sistemlere yazan görevler çok daha dikkatli bir onay adımı gerektiriyor.

| Görev türü | Risk seviyesi | Önerilen kontrol |
|---|---|---|
| Rapor/özet üretme | Düşük | Salt okunur erişim yeterli |
| Dosya güncelleme | Orta | Belirli bir klasörle sınırlı erişim |
| E-posta/Slack gönderme | Orta-yüksek | Gönderim öncesi içerik doğrulama adımı |
| Ödeme veya dış sisteme yazma | Yüksek | Otomatik değil, insan onaylı akış |

## Zamanlanmış Bir Ajanı Ne Zaman Zapier/Make Yerine Tercih Etmelisin?

Görev, sabit bir API bağlantısından çok, doğal dilde muhakeme ve karar gerektiriyorsa. Zapier veya Make, "A olayı olduğunda B eylemini yap" gibi deterministik, önceden tanımlı akışlarda daha güvenilir ve daha ucuz çalışıyor. Ama "bu haftaki müşteri geri bildirimlerini oku, ortak temaları çıkar ve önceliklendirilmiş bir liste yaz" gibi yorumlama ve özetleme gerektiren bir görevde, sabit bir akış yerine muhakeme yapabilen bir ajan daha uygun.

Pratik ayrım şu: girdi ve çıktı önceden tam olarak tanımlanabiliyorsa (X formatındaki veri geldiğinde Y formatında e-posta gönder), klasik otomasyon aracı yeterli ve daha ucuz. Girdi değişken, çıktı ise bir özet, karar veya rapor gerektiriyorsa, zamanlanmış bir Claude görevi daha az kırılgan sonuç veriyor.

## Sessiz Başarısızlıklar Nasıl Ayıklanır?

Her çalıştırmadan sonra Zamanlanmış sekmesindeki geçmişi düzenli kontrol ederek — bildirim olmadığı için bu, hataları fark etmenin tek yolu. Bir görev sessizce başarısız oluyorsa genelde üç nedenden biri var: erişimi olmayan bir dosyaya veya bağlantıya atıfta bulunuyor, talimat çok belirsiz olduğu için model farklı her seferinde farklı bir yorum yapıyor, veya bağlı bir eklentinin (Slack, e-posta) kimlik doğrulaması süresi dolmuş.

İlk hata ayıklama adımı her zaman aynı: son birkaç çalıştırmanın çıktısını karşılaştırıp tutarsızlık olup olmadığına bakmak. Tutarsız sonuçlar genelde talimatın yeterince kendi kendine yeterli olmadığının işareti — bu da bizi ilk kurala geri götürüyor.

Bu konuda daha derin bir karşılaştırma istiyorsanız, [ChatGPT Pulse kapandıktan sonra OpenAI'ın Scheduled Tasks'ına geçiş rehberimiz](/tr/posts/chatgpt-pulse-gunluk-ozet) benzer bir otomasyon modelini rakip tarafta nasıl ele aldığımızı gösteriyor; [Claude Code'un subagent ve arka plan ajanları rehberi](/tr/posts/claude-code-subagent-arka-plan-ajanlari) ise zamanlanmış görevleri daha geniş bir ajan iş akışına nasıl bağlayabileceğinizi kapsıyor. AI ajanlarını CI/CD gibi otomatik ortamlara bağlarken izin ve kapsam mantığı büyük ölçüde örtüşüyor; bu yüzden [AI ajanlarını CI/CD'ye güvenle bağlama rehberimiz](/tr/posts/ai-ajanlari-cicd-guvenle-baglamak) de burada anlatılan sınırlama prensiplerinin başka bir bağlamda nasıl uygulandığını gösteriyor.

Benim görüşüm: bildirim eksikliği bu özelliğin en can sıkıcı tarafı, ama aslında iyi bir disiplin zorluyor — görevin kendisine bildirim adımını dahil etmeye zorlanınca, sonuç genelde daha eksiksiz ve kendi kendine yeterli bir görev tanımı çıkıyor.

## Haftalık Özet Görevi İçin Şablon Nasıl Yazılır?

```text
Görev: Her Pazartesi 09:00'da çalış.
1. Bağlı proje yönetim aracından geçen haftaki tamamlanan görevleri çek.
2. Tamamlanan görev sayısını, kategoriye göre dağılımı ve gecikmiş görev sayısını hesapla.
3. Sonucu 5 maddelik bir madde işaretli özet olarak yaz.
4. Özeti bağlı Slack kanalına gönder.
Başarı kriteri: Slack'e mesaj gönderildiğinde görev tamamlanmış sayılır; e-posta veya dosya çıktısı gerekmez.
```

Claude'un ajan ve otomasyon özellikleri hakkında daha fazlası için Woyable'ın [yapay zeka kategorisine](/tr/category/yapay-zeka) göz atabilirsiniz.

## Sıkça Sorulan Sorular

### Claude Cowork'te zamanlanmış görev tamamlandığında bildirim alır mıyım?

Hayır, şu anda almıyorsunuz. Cowork, bir görev tamamlandığında veya başarısız olduğunda push bildirimi veya e-posta göndermiyor; sonucu görmek için Zamanlanmış sekmesindeki çalıştırma geçmişini kontrol etmeniz gerekiyor. Bildirim istiyorsanız, görevin kendisine "sonucu Slack'e veya e-postaya gönder" adımını ekleyebilirsiniz.

### Zamanlanmış görevler bilgisayarım kapalıyken çalışır mı?

Evet. Zamanlanmış görevler uzaktan çalışıyor, yani seçtiğiniz sıklıkta bilgisayarınız uykuda veya Claude Desktop uygulaması kapalı olsa bile otomatik olarak devam ediyor.

### Zamanlanmış görev için Zapier yerine ne zaman Claude kullanmalıyım?

Görev sabit, önceden tanımlanmış bir akıştan çok doğal dilde yorumlama ve özetleme gerektiriyorsa. Girdi ve çıktı tam olarak önceden tanımlanabiliyorsa klasik bir otomasyon aracı daha ucuz ve daha güvenilir; girdi değişkense ve çıktı bir özet veya karar gerektiriyorsa zamanlanmış bir Claude görevi daha uygun.

### Zamanlanmış bir görev neden sessizce başarısız oluyor olabilir?

Genellikle üç nedenden biri: göreve artık erişimi olmayan bir dosyaya veya bağlantıya atıfta bulunuyor, talimat yeterince net değil ve model her seferinde farklı yorumluyor, veya bağlı bir eklentinin kimlik doğrulaması süresi dolmuş. Bildirim olmadığı için bunu fark etmenin tek yolu Zamanlanmış sekmesindeki geçmişi düzenli kontrol etmek.

Kaynaklar: [Anthropic'in Claude Cowork'te zamanlanmış görevler dokümantasyonu](https://support.claude.com/en/articles/13854387-schedule-recurring-tasks-in-claude-cowork), [Anthropic'in Claude Code'da rutinler duyurusu](https://claude.com/blog/introducing-routines-in-claude-code).
