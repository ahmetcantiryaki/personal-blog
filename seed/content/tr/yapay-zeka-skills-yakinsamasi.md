---
title: "Neden Her Yapay Zeka Artık 'Skills' Kullanıyor?"
slug: "yapay-zeka-skills-yakinsamasi"
translationKey: "ai-assistants-skills-convergence-2026"
locale: "tr"
excerpt: "Claude, Gemini ve ChatGPT; özel asistan özelliklerini art arda bırakıp aynı yapıya, yani üst üste eklenebilen ve komutla çağrılan 'skill'lere geçiyor."
category: "ai"
tags: ["claude", "chatgpt", "gemini", "ai-tools"]
publishedAt: "2026-10-04"
seoTitle: "Claude, Gemini ve ChatGPT Neden Hepsi Skills Kullanıyor?"
seoDescription: "Claude Skills, Gemini Skills ve kapanan ChatGPT Custom GPT'leri aynı yöne işaret ediyor: özel asistan oluşturuculardan üst üste eklenebilen skill'lere geçiş."
---

Kısa cevap: son bir ay içinde üç büyük yapay zeka asistanı da aynı özelleştirme yapısında birleşti — tek ve ayrık bir özel asistan yerine, komutla çağrılan ve üst üste eklenebilen bir "skill". Google, Kasım 2026'dan başlayarak Gems'i Skills ile değiştiriyor; OpenAI, Custom GPT'leri 11 Aralık 2026'da tamamen kapatıyor; Claude'un Skills'i ise ikisi için de referans tasarım oldu.

## Ne değişti, ne zaman değişti?

Birbirine haftalar arayla üç ayrı duyuru geldi. Google, blog.google üzerinden Gemini Skills'i duyurdu; özellik Gemini sohbetinde küresel olarak yayılıyor, Workspace hesapları önümüzdeki haftalarda takip edecek. OpenAI'ın 11 Eylül 2026 tarihli ChatGPT sürüm notları, Custom GPT'lerin tüm planlarda kapatılacağını duyurdu: kişisel hesaplar (Free, Go, Plus, Pro) zaten yeni GPT oluşturma veya yayınlama yeteneğini kaybetti, Enterprise alan ise kademeli bir kapanış izliyor — 11 Eylül'de yönetici bildirimi, 17 Eylül hedefli geçiş süreci, 25 Eylül'den sonra yeni GPT yok, 11 Aralık 2026'da tam kapanış. Claude'un Skills'i — Claude'un eklenti gibi yüklediği talimat, betik ve referans dosyası klasörleri — ise her iki rakip harekete geçmeden aylar önce bu örüntünün referans uygulaması olarak zaten çalışıyordu.

## "Skill" tam olarak ne ve yerini aldığı şeyden farkı ne?

Skill; genelde bir komutla (slash command) tetiklenen, aynı konuşmada diğer skill'lerle üst üste eklenebilen, tekrar kullanılabilir bir talimat ve kaynak birimi. Yerini aldığı Custom GPT'ler ve Gems ise ayrık, tek seçimlik önayarlardı: birini seçtiğinde, konuşma boyunca o tek yapılandırmaya kilitleniyordun.

Bu üst üste eklenebilirlik, bir yeniden isimlendirme değil, gerçek bir fonksiyonel yükseltme. Google'ın kendi anlatımına göre bir kullanıcı, aynı prompt içinde bir marka sesi skill'ini belirli bir yazım tarzı skill'iyle birleştirebiliyor — bu, tek bir seçili Gem'in yapamadığı bir şey. Claude Skills ise bir adım daha ileri gidiyor: Claude.ai, emlak, sağlık ve hukuk gibi alanlar için meslek bazlı skill'leri, kullanıcı hiçbir şey çağırmadan, konuşmanın bağlamına göre otomatik olarak devreye alıyor.

| | Claude Skills | Gemini Skills (Gems'in yerine) | ChatGPT (Custom GPT sonrası) |
|---|---|---|---|
| Çağırma | Komutla veya otomatik (meslek bazlı) | Komutla (`/`) | Eklenti dizinine geçiyor |
| Üst üste eklenebilir mi | Evet | Evet, özellikle bunun için tasarlandı | Yok — GPT'ler tekil ve ayrıktı |
| Referans materyal | Belgeler, kod şablonları, zincirlenmiş alt skill'ler | Metin, PDF, görsel dosyaları | GPT'ye göre değişiyordu |
| Aktif birim sınırı | Pratik bir talimat sınırı yok | 100 aktif skill | Geçerli değil |
| Taşınabilirlik | Claude, Claude Code, başka yerlere uyarlanabilir | Gemini uygulaması, Workspace'e genişliyor | GPT Store'da 3 milyon+ GPT vardı; kapatılıyor |

## Google, Gems'i neden özellikle şimdi kapatıyor?

Çünkü tek bir kayıtlı önayar birleşmiyor. Gems, bir kullanıcının bir yapılandırmayı — bir ton, bir rol, bir talimat setini — kaydedip ona geçmesine izin veriyordu, ama iki yapılandırmayı birlikte kullanmak, birinden vazgeçmek anlamına geliyordu. Skills ise açıkça birleştirilebilir olacak şekilde tasarlandı: Google'ın lansman notları, bir marka kılavuzu skill'ini bir yazım tarzı skill'iyle birleştirmeyi, yeniden tasarımın hedeflediği temel kullanım senaryosu olarak tanımlıyor.

Ancak geçiş anlık değil. Google, kişisel hesaplar için mevcut Gems'leri 17 Kasım 2026'dan başlayarak otomatik olarak Skills'e taşıyor; yeni bir Gem oluşturma veya düzenleme seçeneği ise 13 Ekim 2026'da kayboluyor. Workspace işletme, kurumsal ve kâr amacı gütmeyen hesaplar Mart 2027'de, Eğitim hesapları ise Haziran 2027'de bu geçişi takip ediyor — FedRAMP tarzı kurumsal değişikliklerin genelde nasıl kademeli olarak yayıldığını yansıtan bir sıralama; uyumluluk riski en yüksek olan yerde en yavaş geçiş. Skills henüz her Gem yeteneğine eşit değil ve Google, hesap başına aktif skill sayısını 100 ile sınırladı.

## OpenAI, Custom GPT'leri yükseltmek yerine neden tamamen kapatıyor?

Çünkü GPT Store modeli — bağımsız olarak oluşturulmuş, ayrık asistanların bir dizini — üç tasarım arasında birleştirilebilirlik açısından zaten en zayıf olandı ve OpenAI, üzerine üst üste eklenebilirlik eklemek yerine onu doğrudan değiştirmeyi seçti. GPT Store, yayınlanmış 3 milyondan fazla GPT'ye büyümüştü, ama her biri hâlâ tek ve birleştirilemeyen bir yapılandırmaydı — Google'ın Skills ile çözmeye çalıştığı aynı kısıtlama.

OpenAI'ın belirttiği geçiş yolu, Custom GPT işlevselliğini Claude'un veya Gemini'nin skill modeline değil, bu yıl geri getirdiği [ChatGPT eklenti dizinine](/tr/posts/chatgpt-eklentileri-2026-rehberi) taşıyor. Bu, izlemeye değer gerçek bir tasarım ayrımı: iki tedarikçi "skill" üzerinde birleşirken biri "eklenti" üzerinde birleşiyor; hangi etiketin önümüzdeki yıl yaygın kullanımda hayatta kalacağı, hangi zihinsel modelin gerçekten kazandığı hakkında bir şey söylüyor.

## Bu bir yakınsama mı, yoksa biri diğerini kopyalıyor mu?

Bu, ortak bir kısıtlama üzerinde yakınsama, tek bir özelliğin kopyası değil. Üç tedarik de aynı duvara çarptı — kullanıcılar özelleştirmeleri birleştirmek istiyordu, tam olarak birini seçmek değil — ve farklı zaman çizelgelerinde, farklı teknik uygulamalarla (komut çağırma, otomatik aktivasyon, eklenti dizini) bağımsız olarak üst üste eklenebilir birimlere ulaştılar. Claude buraya kabaca bir yıl önce ulaştı; bu erken başlangıç bir zamanlama avantajı, diğerlerinin Claude Skills spesifikasyonunu satır satır kopyaladığının kanıtı değil. Rekabetin bir özelliği kopyalamaktan çok, aynı kullanıcı talebine bağımsız olarak boyun eğmesi, bu örüntünün kalıcı olma ihtimalini de artırıyor.

## Bu, bunları nasıl inşa edip kullanman gerektiği konusunda ne anlama geliyor?

Kendi değerlendirmem: "skill"i bir taşınabilirlik sinyali olarak gör, kilitlenme olarak değil. Bir Claude Skill olarak yazılmış bir talimat seti, kavram olarak bir Gemini Skill'e yeterince yakın ki platformlar arasında yeniden uyarlamak gerçekçi — bu, özel bir Custom GPT'yi taşımanın hiçbir zaman olmadığı kadar yakın. Hâlâ bir Gem'e bağımlıysan, pratik hamle, 13 Ekim oluşturma son tarihinden önce elindekini denetlemek; çünkü Kasım'daki otomatik geçiş her yeteneği temiz bir şekilde taşımasa bile, o tarihten sonra hiçbir şeyi düzeltemeyeceksin.

Bugün tek bir asistanda standartlaşan ekipler için, Gemini tarafındaki 100 skill sınırı ile Claude tarafında sabit bir sınırın olmaması, ölçekte skill sayısı iş akışın için gerçekten önemliyse bir [abonelik kararına](/tr/posts/hangi-ai-aboneligi-claude-chatgpt-gemini) dahil etmeye değer küçük sinyaller.

## Sıkça Sorulan Sorular

### Google, Gemini Gems'i ne zaman kapatıyor?

Kişisel Google hesapları 13 Ekim 2026'dan sonra yeni bir Gem oluşturamıyor veya düzenleyemiyor; mevcut Gems, 17 Kasım 2026'dan başlayarak otomatik olarak Skills'e taşınıyor. Workspace işletme ve kurumsal hesaplar Mart 2027'de, Eğitim hesapları Haziran 2027'de bu geçişi takip ediyor.

### OpenAI, Custom GPT'leri ne zaman kapatıyor?

Kişisel ChatGPT hesapları, Eylül 2026 itibarıyla zaten yeni Custom GPT oluşturma veya yayınlama yeteneğini kaybetti. Enterprise alan kademeli bir kapanış izliyor — 25 Eylül 2026'dan sonra yeni GPT yok, mevcut GPT'lerin tamamının kapanması ise 11 Aralık 2026'da.

### Gemini'de kaç skill'i aktif tutabilirim?

Google, Gemini'de hesap başına aktif skill sayısını 100 ile sınırlıyor. Bu sınırın üzerinde oluşturulan skill'ler veya bazı Gems'in desteklediği ama Skills'in henüz eşleşmediği yetenekler, Kasım 2026 geçişinden önce bir inceleme gerektiriyor.

### Claude Skills, Gemini Skills ve ChatGPT'nin Custom GPT yerine koyduğu şey aynı mı?

Hayır — aynı temel fikri (tekrar kullanılabilir, üst üste eklenebilir talimat setleri) paylaşıyorlar ama uygulamada farklılaşıyorlar. Claude Skills mesleğe göre otomatik devreye girebiliyor ve belirtilmiş bir talimat sayısı sınırı yok; Gemini Skills komutla çağrılıyor ve 100 aktif skill ile sınırlı; OpenAI ise Custom GPT işlevselliğini bir skill modeline değil bir eklenti dizinine taşıyor.
