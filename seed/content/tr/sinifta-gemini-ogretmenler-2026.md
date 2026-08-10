---
title: "Sınıfta Gemini: Öğretmenler İçin 2026 Rehberi"
slug: "sinifta-gemini-ogretmenler-2026"
translationKey: "gemini-classroom-teacher-guide"
locale: "tr"
excerpt: "Gemini artık Google Classroom'da tüm yaş gruplarına açılıyor, rubrik oluşturma da otomatikleşti. Öğretmenler için kurulum, iş akışı ve sınır çizgileri rehberi."
category: "ai"
tags: ["gemini", "education", "automation", "ai-tools"]
publishedAt: "2026-08-10"
seoTitle: "Sınıfta Gemini: Öğretmenler İçin Rehber (2026)"
seoDescription: "Gemini'nin Google Classroom'daki tüm yaş grubu açılımı ve otomatik rubrik oluşturma özelliği: öğretmenler için kurulum adımları, iş akışları ve sınırlar."
---

Bugün, 10 Ağustos 2026, Google Classroom'da Gemini'nin tüm yaş gruplarına açıldığı gün. Aynı hafta içinde, 6 Ağustos'tan beri öğretmenler için başka bir değişiklik de kademeli olarak yayılıyor: rubrik oluşturmanın neredeyse otomatikleşmesi. İkisi ayrı duyuru olsa da, bir öğretmenin masasında aynı soruya çıkıyor: bu iki özellik gerçekte ne değiştiriyor, ve nereye kadar güvenilebilir?

## Tüm Yaş Grupları Açılımı: Kim, Ne Zaman, Kimin İzniyle

Google'ın resmi duyurusuna göre bu bir "herkese otomatik açık" güncellemesi değil. [Google Workspace Updates blog yazısına göre](https://workspaceupdates.googleblog.com/2026/08/gemini-in-google-classroom-is-expanding-to-users-of-all-ages-with-contextualized-Gemini-starter-prompts-for-students.html) genişleme, okul yöneticisinin Gemini in Classroom, Gemini veya Gemini Notebook erişimini **zaten öğrenciye tanımlamış olması** koşuluna bağlı. Yani bu bir admin kapısı: yönetici izin vermediyse öğrenci hiçbir şey görmeyecek, yaşı ne olursa olsun.

Zamanlama şöyle işliyor:

| Tarih | Platform | Ne oluyor |
|---|---|---|
| 10 Ağustos 2026 | Web | Tüm yaş gruplarına açılma başlıyor, tam görünürlük 1-3 gün içinde tamamlanıyor |
| 17 Ağustos 2026 | Mobil | Aynı açılım mobil uygulamalarda başlıyor |
| Devam eden | Her ikisi | Erişim hâlâ admin onayına bağlı kalıyor |

Erişimi olan öğrenciler için iki somut yenilik var. Birincisi, Gemini erişimi olan öğrenciler ders materyallerini seçip o dersin içeriğine özel flashcard veya pratik quiz üretebiliyor. İkincisi, Gemini Notebook erişimi olanlar öğretmenin paylaştığı materyalleri Gemini Notebook'a senkronize ederek interaktif çalışma rehberleri oluşturabiliyor. Bu ikinci özellik, [NotebookLM ile araştırma ve öğrenme yazımızda](/tr/posts/notebooklm-ile-arastirma-ve-ogrenme) anlattığımız kaynağa-çapalama mantığının sınıf materyaline uygulanmış hâli.

Admin kapısının varlığı tesadüf değil; yaşa uygun kullanım ve veli onayı endişeleri bu tasarımın merkezinde. Bir öğretmen olarak sizin için pratik sonuç şu: sınıfınızdaki her öğrencinin Gemini'yi görüp görmeyeceğini siz değil, okul BT yönetimi belirliyor. İlk hafta yapmanız gereken ilk şey, bunu varsaymak yerine BT ekibinizle teyit etmek.

## Bağlamsallaştırılmış Başlangıç Promptları

Önceden Gemini'nin öğrencilere sunduğu başlangıç promptları jenerikti — "bana bir konuyu özetle" gibi genel ifadeler. Şimdi bir öğrenci bu promptlardan birine tıkladığında karşısına bir kutu çıkıyor: hangi ders, hangi ödev üzerinden çalışmak istediğini seçiyor. Prompt, gerçek ders içeriğine bağlanmış oluyor.

Sınıfta bunun günlük etkisi küçük ama gerçek: öğrenci artık "bana biyoloji anlat" gibi belirsiz bir istekle başlamak yerine, doğrudan sizin verdiğiniz ödevin bağlamında bir flashcard seti veya quiz üretiyor. Bu, üretilen materyalin müfredat dışına kayma riskini azaltıyor — ama sıfıra indirmiyor, aşağıda buna geri döneceğiz.

## Öğretmenler İçin Anlık Rubrik Oluşturma

Ayrı bir özellik olarak, 6 Ağustos 2026'dan itibaren kademeli olarak yayılan rubrik oluşturma, [Google'ın ikinci duyurusuna göre](https://workspaceupdates.googleblog.com/2026/08/streamlining-rubric-generation-in-Google-Classroom-with-Gemini.html) Gemini in Classroom etkinse varsayılan olarak açık geliyor. Ödev oluşturma sayfasından üç farklı yol izlenebiliyor.

| Yöntem | Ne zaman kullanılır | Nasıl çalışır |
|---|---|---|
| Sıfırdan üretim | Yeni bir ödev için henüz rubrik yoksa | Gemini ödev bağlamından bir rubrik önerir, siz kriterleri inceleyip düzenler, sonra eklersiniz |
| Mevcut dosyayı dönüştürme | Elinizde eski bir rubrik dosyası veya taranmış görsel varsa | Dosyayı yükler, Gemini onu Classroom'a hazır formata anında çevirir |
| Gemini sekmesinde birlikte taslak | Rubriği konuşarak, adım adım şekillendirmek istiyorsanız | Gemini sekmesinde diyalog kurarsınız, sonuç Sheets veya Docs'a aktarılır, sonra derse eklenir |

Somut bir örnek: 8. sınıf için bir "kısa hikâye analizi" ödevi oluşturuyorsunuz. Sıfırdan üretim yöntemini seçtiğinizde Gemini, ödev açıklamanızdan yola çıkarak dört kriterlik bir taslak öneriyor olabilir — tema tespiti, kanıt kullanımı, yazım mekaniği, özgünlük. Siz bu kriterlerin ağırlıklarını değiştirip "kanıt kullanımı" kriterine sınıfa özgü bir alt madde ekliyorsunuz, sonra onaylayıp ödeve iliştiriyorsunuz. Toplam süre, sıfırdan yazmaya kıyasla dakikalar mertebesinde.

Kopyalayıp deneyebileceğiniz bir prompt örneği, Gemini sekmesinde birlikte taslak yöntemi için:

```text
8. sınıf edebiyat dersi için "kısa hikâye analizi" ödevine
Classroom'a hazır bir rubrik taslağı hazırla.
Kriterler: tema tespiti, kanıt kullanımı, yazım mekaniği, özgünlük.
Her kriter için 4 seviyeli bir puanlama ölçeği kullan
(başlangıç / gelişmekte / yeterli / örnek düzey).
Dili öğrenci seviyesine uygun ve net tut.
```

Burada altını çizmek gerekiyor: üretilen taslak, sizin onayınız olmadan bağlayıcı değil. Gemini'nin önerdiği kriterler bazen çok genel kalabiliyor ya da sınıfınızın özel gereksinimlerini (örneğin bir öğrencinin bireyselleştirilmiş eğitim planı) yansıtmayabiliyor. Kör onay yerine, her taslağı en az bir kez gözden geçirip düzenleme adımından geçirmek, özelliğin kazandırdığı zamandan daha değerli.

## Bu Hafta Uygulayabileceğiniz İş Akışları

Ders planlama tarafında, en pratik kullanım şekli şu: haftalık bir üniteyi planlarken önce ödevi Classroom'a taslak olarak girin, ardından rubrik oluşturma özelliğini kullanarak değerlendirme kriterlerini aynı oturumda hazırlayın. Bu, ödev ile rubriğin birbirinden kopuk yazılmasını önlüyor — genellikle rubrikler ödevden sonra, aceleyle eklendiği için tutarsız çıkıyor.

Geri bildirim tarafında ise, öğrencilerin artık kendi flashcard ve quizlerini üretebilmesi, sizin sınıf içi zamanınızı tekrar-pratikten çok kavram tartışmasına ayırmanıza izin veriyor. Bir öğrenci ödev öncesi kendi kendine pratik quiz çözüp geldiğinde, sizin geri bildiriminiz artık temel eksikleri değil, daha ince noktaları hedefleyebiliyor. Bu yaklaşımı sınıf dışı bireysel çalışmayla nasıl destekleyeceğinizi merak ediyorsanız [Claude for Teachers yazımızda](/tr/posts/claude-for-teachers-nedir) benzer bir mantığı farklı bir araçla ele almıştık.

## Akademik Bütünlük: Neyi AI'a Bırakmamalısınız

Burada dürüst olmak gerekiyor: bir öğrenci Gemini'yi öğrenmek yerine cevap almak için kullanırsa, flashcard ve quiz üretimi bile bir kısayola dönüşebiliyor. Admin onay kapısının varlığı tam olarak bu yüzden — yaşa uygunluk ve aşırı bağımlılık riski, özelliğin tasarımına baştan gömülü.

Öğretmen olarak net bir çizgi çekmenizi öneririz: öğrencinin **kendi** kavrayışını sınayan (özetleme, kendi cümleleriyle açıklama, pratik quiz) kullanımlar teşvik edilmeli; ödevin **doğrudan yanıtını** üretmesi istenen kullanımlar (deneme yazdırma, problem çözümünü kopyalatma) engellenmeli. Bu ayrımı sınıf kurallarınıza yazılı olarak koymak, "AI kullanmayın" gibi belirsiz bir yasaktan çok daha etkili — çünkü öğrenciler neyin serbest neyin değil olduğunu net biliyor.

Rubrik tarafında da aynı disiplin geçerli: Gemini'nin önerdiği kriterleri asla gözden geçirmeden yayınlamayın. Özellikle notlandırma ağırlıkları ve dil erişilebilirliği, sınıfınıza özgü kararlar — bunları modele bırakmak, adaletsiz veya belirsiz bir rubrikle sonuçlanabilir.

Şahsi görüşüm şu: bu iki özellik arasında rubrik oluşturma, günlük iş yükünü gerçekten azaltan taraf; öğrenci tarafındaki genişleme ise dikkatli admin politikası olmadan kolayca ters tepebilir. İkisini aynı coşkuyla karşılamak yerine, birine hızlı geçin, diğerine yavaş.

## İlk Hafta Kurulum Kontrol Listesi

- Okul BT yönetiminizle görüşüp hangi öğrencilerin Gemini/Gemini Notebook erişimine sahip olduğunu teyit edin.
- Web tarafında 10 Ağustos'tan itibaren, mobilde 17 Ağustos'tan itibaren görünürlüğü kontrol edin; hemen görünmezse 1-3 günlük yayılma penceresini bekleyin.
- Bir sonraki ödeviniz için rubrik oluşturmanın üç yöntemini de bir kez deneyin, hangisinin sizin ders tarzınıza uyduğunu görün.
- Her rubrik taslağı için bir "gözden geçir ve düzenle" adımını iş akışınıza sabit bir kural olarak ekleyin.
- Sınıf kurallarınıza, AI kullanımının nerede serbest nerede yasak olduğunu açıkça yazın.
- Öğrencilerin ürettiği flashcard ve quizleri ödev öncesi hazırlık olarak konumlandırın, ödev yerine geçecek bir kısayol olarak değil.

Sınıfta AI araçlarını daha geniş bir çerçevede nasıl organize edeceğinizi merak ediyorsanız [AI sohbetlerini düzenleme yazımıza](/tr/posts/ai-sohbetlerini-duzenle-projects-gems) veya güncel model karşılaştırmaları için [hangi Claude modeli rehberimize](/tr/posts/hangi-claude-modeli-2026-rehberi) göz atabilirsiniz.

## Sıkça Sorulan Sorular

### Gemini in Classroom otomatik olarak tüm öğrencilere mi açılıyor?

Hayır. Genişleme, okul yöneticisinin öğrenciye daha önce Gemini in Classroom, Gemini veya Gemini Notebook erişimi tanımlamış olması şartına bağlı. Admin izni yoksa öğrenci yaşı ne olursa olsun bu özellikleri görmüyor.

### Rubrik oluşturma özelliğini kullanmak için ayrıca bir şey açmam gerekiyor mu?

Hayır, Gemini in Classroom zaten etkinse rubrik oluşturma varsayılan olarak geliyor. 6 Ağustos 2026'dan itibaren kademeli olarak yayılıyor, bu yüzden hesabınızda henüz görünmüyorsa birkaç gün içinde gelmesini bekleyebilirsiniz.

### Gemini'nin önerdiği rubriği olduğu gibi kullanabilir miyim?

Teknik olarak evet ama önerilmez. Öneri, ödev bağlamından otomatik üretiliyor ve sınıfınıza özgü nüansları (notlandırma ağırlıkları, erişilebilirlik ihtiyaçları) yakalamayabiliyor. Her taslağı en az bir kez gözden geçirip düzenlemek, iş akışının olmazsa olmaz bir parçası olmalı.

### Öğrencilerin AI'a aşırı bağımlı hale gelmesini nasıl önlerim?

Net bir sınıf kuralı koyun: kavrayışı test eden kullanımlar (özetleme, pratik quiz) serbest, doğrudan ödev yanıtı üreten kullanımlar yasak. Bu ayrımı yazılı hale getirmek, belirsiz bir "AI yasak" kuralından çok daha etkili çalışıyor.
