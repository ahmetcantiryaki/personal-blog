---
title: "Yapay Zeka Kodunu İncelerken Neye Dikkat Edilir?"
slug: "yapay-zeka-kodunu-review-etme"
translationKey: "reviewing-ai-generated-code-2026"
locale: "tr"
excerpt: "Kısa cevap: satır satır okumayı bırakıp niyet, güvenlik ve veri akışına odaklanın. Google'da yeni kodun %75'i, Microsoft'ta %20-30'u yapay zekayla yazılıyor."
category: "software-engineering"
tags: ["ai-coding", "code-quality", "best-practices", "clean-code", "testing"]
publishedAt: "2026-10-06"
seoTitle: "Yapay Zeka Kodu İncelemesi: Neye Odaklanmalı?"
seoDescription: "Yapay zeka kodunu incelerken satır satır okumak yerine niyet, güvenlik ve veri akışına odaklanın. 2026 istatistikleri ve diff hijyeni rehberi."
---

Kısa cevap: PR'ın her satırını okumayı bırakıp üç şeye yoğunlaşın — yazarın niyeti, güvenlik sınırları ve veri akışı. Google'da 2026 itibarıyla yeni kodun %75'i yapay zeka tarafından üretiliyor; bu hacimde satır satır okuma zaten imkânsız hâle geliyor, bu yüzden inceleme stratejisinin tamamen değişmesi gerekiyor.

## Kod gerçekten ne kadar yapay zeka tarafından yazılıyor?

Rakamlar şirketten şirkete değişiyor ama yön net. Google CEO'su Sundar Pichai, 2026'da Google Cloud Next'te yeni kodun %75'inin yapay zeka tarafından üretildiğini, bir önceki sonbaharda bu oranın yaklaşık %50 olduğunu söyledi. Microsoft CEO'su Satya Nadella ise Microsoft'un kendi repolarında bu oranı %20-30 olarak paylaşmıştı. Sektör genelinde üst düzey teknoloji şirketlerinde yeni production kodunun yaklaşık %25-30'u yapay zeka tarafından yazılıyor.

| Kaynak | Oran | Kapsam |
|---|---|---|
| Google (Pichai, 2026) | %75 | Google'daki tüm yeni kod |
| Microsoft (Nadella, 2025) | %20-30 | Microsoft iç repoları |
| Sektör ortalaması (2026) | %25-30 | Üst düzey teknoloji şirketleri, production kodu |
| İş mantığı kodu | %15-30 | Çoğu ekipte |
| İskelet kod ve testler | %50-70 | Çoğu ekipte |

Dağılım da önemli: boilerplate ve testler yapay zeka tarafından ağırlıklı yazılırken, kritik altyapı ve algoritmalar hâlâ çoğunlukla insan elinden çıkıyor. İnceleme stratejinizi de bu dağılıma göre kurmalısınız; her satırı aynı dikkatle okumak, hem zaman kaybı hem de yanlış yerde dikkat harcamak demek.

## "%55,8 daha hızlı" iddiası neden yanıltıcı?

GitHub Copilot'un geliştiricileri %55,8 hızlandırdığı iddiası sık tekrarlanıyor, ama kaynağına bakınca resim değişiyor. Bu rakam 2023 tarihli bir arXiv çalışmasından geliyor ve tek, iyi tanımlanmış bir HTTP sunucusu görevinde ölçülmüş. Görev izole, kod tabanı temiz ve çalışma üretilen kodun sonraki kalitesini hiç takip etmemiş. Yani gerçek bir production ortamına genellenemez.

Daha gerçekçi bir referans, GitHub'ın Accenture ile yürüttüğü kurumsal araştırma: geliştiriciler arasında PR sayısında %8,69 artış, PR merge oranında %15 artış, başarılı build sayısında ise %84 artış görülmüş. Geliştiricilerin %90'ı Copilot'un önerdiği kodu commit'lediğini, %91'i ise ekibinin Copilot önerili PR'lar merge ettiğini bildirmiş. Bu rakamlar da pozitif ama "%55,8 daha hızlı" kadar çarpıcı değil — ve asıl mesele tam olarak bu: tek bir laboratuvar görevinden alınan manşet rakamı, gerçek bir ekibin günlük iş akışına uygulandığında aynı oranda tekrarlanmıyor.

## Yapay zeka kodunda hangi yeni hata türleri ortaya çıkıyor?

Üç örüntü diğerlerinden daha sık tekrar ediyor ve klasik kod incelemesi alışkanlıklarıyla yakalanması zor.

**Makul görünen ama yanlış kod.** Yapay zeka, sözdizimsel olarak doğru ve okunması kolay kod üretir; bu da incelemeyi gevşetir. Oysa "temiz görünen" kod ile "doğru çalışan" kod aynı şey değil. En pahalı hata, bu ikisini birbirine karıştırıp onaylamaktır.

**Sessiz kapsam genişlemesi.** İstenen değişiklikten fazlasını yapan PR'lar — örneğin bir bug fix isteğine karşılık fonksiyon imzasını da değiştiren, ilgisiz bir dosyayı da düzenleyen bir çıktı. Bu genişleme genelde zararsız görünür ama test kapsamı dışında kalan bir yan etki taşıyabilir.

**Hayalet bağımlılıklar.** Model, var olmayan bir paket sürümünü, var olmayan bir API metodunu ya da artık kullanılmayan bir fonksiyonu referans gösterebilir. Derleme zamanında yakalanmazsa, çalışma zamanına kadar fark edilmeyebilir.

## İnsan incelemesi nereye yoğunlaşmalı?

Mekanik kontroller (biçimlendirme, lint, tip kontrolü, temel testler) otomasyona bırakılmalı; insan dikkati dört alanda yoğunlaşmalı:

| Odak alanı | Neden önemli | Örnek soru |
|---|---|---|
| Niyet | Model gereksinimi yanlış yorumlayabilir | Bu PR, issue'da istenen şeyi mi çözüyor? |
| Güvenlik sınırları | Model güvenlik bağlamını bilmez | Kullanıcı girdisi doğrulanıyor mu, yetkilendirme kontrol ediliyor mu? |
| Veri akışı | Yan etkiler satır satır görünmeyebilir | Bu değişiklik hangi tabloları, hangi sırayla etkiliyor? |
| Patlama yarıçapı | Hata büyüklüğü tahmin edilmeli | Bu kod başarısız olursa kaç kullanıcı etkilenir? |

Bu dört alan, [yapay zeka ile kod incelemesi: güven ama doğrula](/tr/posts/ai-ile-kod-incelemesi-guven-dogrula) yazımızda ele aldığımız ilkeyle örtüşüyor: modele güvenin ama kritik kararı insana bırakın. Fark şu ki, hacim arttıkça bu dört alana odaklanmak bir tercih değil, zorunluluk hâline geliyor.

## Agent PR'ları için diff hijyeni nasıl olmalı?

Bir ajan tarafından açılan PR, insan yazdığı bir PR gibi okunmamalı. Üç pratik kural işe yarıyor:

- **Küçük, tek amaçlı PR'lar isteyin.** Ajana "şunu da düzelt" demek yerine, her PR'ı tek bir değişiklikle sınırlayın; kapsam genişlemesini yakalamak küçük diff'lerde çok daha kolay.
- **Değişen dosya listesini önce okuyun.** Diff'e girmeden önce hangi dosyaların dokunulduğuna bakın; beklenmeyen bir dosya kapsam dışı bir değişikliğin ilk işaretidir.
- **Testleri ayrı inceleyin.** Ajan, testi de kodla birlikte yazdıysa, testin gerçekten doğru şeyi mi doğruladığını, yoksa sadece üretilen kodu mu yansıttığını kontrol edin. Üretilen koddan türetilen bir test, o kodun hatasını da birebir kopyalayıp "yeşil" görünebilir; bu yüzden testin beklenen davranışı, üretilen kodu görmeden yazılmış gibi bağımsız olarak doğru olup olmadığını sorgulayın.

Mekanik kontrolleri CI'da otomatikleştirmek — lint, tip kontrolü, güvenlik taraması, bağımlılık doğrulama — insan incelemesinin yalnızca yargı gerektiren kısma harcanmasını sağlıyor. Pratikte bu, ESLint veya Biome gibi bir linter, Semgrep gibi bir statik güvenlik tarayıcısı ve Dependabot veya Renovate gibi bir bağımlılık güncelleme botunu PR açılır açılmaz çalıştırmak anlamına geliyor. Bu üç kontrol, "kod biçimlendirilmiş mi" ve "bilinen bir güvenlik açığı var mı" sorularını insana sormadan önce cevaplıyor; incelemeci PR'ı açtığında zaten temizlenmiş bir diff'le karşılaşıyor. [AI çöpünün açık kaynak güvenliğini zorladığı](/tr/posts/ai-copu-acik-kaynak-guvenligi) yazımızda gösterdiğimiz gibi, bu otomasyon eksikliği özellikle bağımlılık zincirinde ciddi risk oluşturuyor.

Açıkçası bence "yapay zeka kod incelemesini gereksiz kılıyor" görüşü kadar "yapay zeka kodu insan kodundan daha riskli" görüşü de abartılı. Gerçek değişim, incelemenin neye harcandığıdır: biçim ve sözdizimine harcanan zaman otomasyona devredilmeli, insan dikkati niyet ve güvenliğe kaymalı. [Yapay zeka kod asistanı kullanırken yapılan hatalar](/tr/posts/ai-kod-asistani-hatalari) yazımızda da vurguladığımız gibi, asıl beceri aracı kullanmak değil, aracın çıktısını nerede sorgulayacağını bilmek.

Takım sahipliği de netleşmeli: bir ajanın açtığı PR'ı merge eden kişi, o kodun sahibidir — "ajan yazdı" savunması production'da geçerli değil. [Agentjacking: yeni AI ajan saldırısı](/tr/posts/agentjacking-yeni-ai-ajan-saldirisi) yazımızda bu sorumluluk boşluğunun nasıl istismar edilebileceğini ayrıntılı işledik. Claude'un yeni sürümleriyle ilgili gelişmeleri [yapay zeka kategorimizden](/tr/category/yapay-zeka) takip edebilirsiniz.

## Sıkça Sorulan Sorular

### Kodun yüzde kaçı artık yapay zeka tarafından yazılıyor?

Şirkete göre değişiyor: Google 2026'da yeni kodun %75'inin yapay zeka tarafından üretildiğini açıkladı, Microsoft kendi repolarında bu oranı %20-30 olarak paylaştı. Sektör genelinde üst düzey teknoloji şirketlerinde yaklaşık %25-30 civarında.

### "%55,8 daha hızlı" rakamı doğru mu?

Tek bir görev için doğru ama genellenemez. Rakam, 2023 tarihli bir arXiv çalışmasında tek, izole bir HTTP sunucusu görevinde ölçüldü ve üretilen kodun kalitesi takip edilmedi. GitHub'ın Accenture ile yaptığı gerçek kurumsal araştırmada artış %15 PR merge oranı, %84 başarılı build artışı gibi daha mütevazı ama gerçek rakamlarla ölçüldü.

### Yapay zeka kodunda en sık görülen hata türü nedir?

"Makul görünen ama yanlış" kod: sözdizimsel olarak doğru, okunması kolay ama iş mantığı hatalı olan çıktı. Bunu yakalamanın tek yolu, incelemeyi biçimden niyete kaydırmak.

### Agent'ın açtığı bir PR'ı nasıl farklı incelemeliyim?

Küçük, tek amaçlı PR'lar isteyin, değişen dosya listesini diff'e girmeden önce okuyun ve testleri ayrı değerlendirin. Mekanik kontrolleri CI'da otomatikleştirip insan dikkatini niyet, güvenlik ve veri akışına yoğunlaştırın.
