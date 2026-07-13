---
title: "Vibe Coding Bitti mi? Spec-Driven Development Rehberi"
slug: "spec-driven-development-rehberi"
translationKey: "spec-driven-development-vibe-coding"
locale: "tr"
excerpt: "Spec-driven development nedir? Vibe coding üretimde neyi kırdı, SDD döngüsü nasıl işler, Spec Kit ve Kiro nerede durur? Temmuz 2026 saha notları."
category: "ai"
tags: ["ai-coding", "ai-tools", "ai-agents", "best-practices", "workflow"]
publishedAt: "2026-07-13"
seoTitle: "Spec-Driven Development Nedir? Pratik Rehber"
seoDescription: "Spec-driven development nedir, SDD döngüsü nasıl çalışır, GitHub Spec Kit, AWS Kiro ve OpenSpec ne sunar? Vibe coding sonrası saha notları, Temmuz 2026."
---

Spec-driven development (SDD), spesifikasyonu tek doğruluk kaynağı yapan, kodu ise o spesifikasyondan üretilen bir çıktı olarak gören bir yaklaşımdır. Ne istediğinizi ve nedenini siz yazarsınız; ajan "nasıl"ını yazar; siz de sonda dev bir kod yığınını değil, her adımı ayrı ayrı doğrularsınız. Kısaca: önce niyet, sonra kod.

Bu, son bir yılın moda deyimi olan "vibe coding"in tam tersi bir refleks. Vibe coding'de modele belirsiz bir istek verip çıkan kodu kabaca gözden geçiriyordunuz. Sahada bunun neyi kırdığını gördükten sonra sektör hızla ters yöne döndü - ve Temmuz 2026 itibarıyla SDD, ticari basında açıkça ["vibe coding'in panzehiri"](https://visualstudiomagazine.com/articles/2026/05/12/github-spec-kit-takes-off-as-antidote-to-piecemeal-vibe-coding.aspx) olarak çerçeveleniyor.

## Vibe coding üretimde tam olarak neyi kırdı?

Belirsiz bir prompt, modeli söylenmemiş binlerce gereksinimi tahmin etmeye zorlar. Bir demo veya hafta sonu prototipi için bu sorun değil; kimse yıkılırsa umursamaz. Ama aynı akış prod'a dokununca üç şey birden çatlıyor.

Birincisi, gözden geçirme kalitesi çöküyor. Bin satırlık bir kod yığınını dikkatle inceleyecek disiplin çoğu ekipte yok; insanlar "iyi görünüyor" deyip geçiyor. İkincisi, niyet hiçbir yerde kayıtlı değil. Kod neden böyle yazıldı, hangi kenar durumları bilinçli olarak dışarıda bırakıldı - bunların cevabı yalnızca üretim anındaki sohbet geçmişinde kalıyor ve o geçmiş buharlaşıyor. Üçüncüsü, değişiklik maliyeti patlıyor: gereksinim döndüğünde elinizde referans alacak bir spesifikasyon olmadığı için ajan her seferinde sıfırdan tahmin ediyor.

Bu üç kırılmanın ortak paydası, [AI kod asistanı kullanırken yapılan hataların](/tr/posts/ai-kod-asistani-hatalari) çoğuyla aynı: modele bağlam yerine iyimserlik veriyoruz. SDD tam da bu boşluğu, niyeti yazılı ve yürütülebilir hale getirerek kapatmayı vaat ediyor.

Sahada gördüğüm en sık senaryo şu: bir özellik vibe coding'le hızla çıkıyor, iki hafta sonra bir kenar durumu prod'da patlıyor ve kimse "bu neden böyleydi" sorusunu cevaplayamıyor. Çünkü kararın gerekçesi hiçbir dosyada yok. SDD'de aynı gerekçe spesifikasyonun içinde, sürüm kontrolünde ve gözden geçirme geçmişinde yaşıyor - yani kod kadar kalıcı. Fark, hızda değil; kararların izlenebilirliğinde.

## SDD döngüsü: constitution'dan implement'e

GitHub'ın açık kaynak araç seti [Spec Kit](https://github.com/github/spec-kit), döngüyü beş komuta indirger. İsimler araca göre değişse de mantık aynı kalıyor:

- **constitution** - Projenin değişmez ilkeleri. Test zorunluluğu, mimari sınırlar, kütüphane tercihleri. Sonraki her adım bu anayasaya uymak zorunda.
- **specify** - Ne inşa edileceği ve nedeni. Teknoloji değil, kullanıcı hikâyeleri ve kabul kriterleri. "Nasıl"a burada girilmez.
- **plan** - Teknik plan. Seçilen yığın, veri modeli, dış bağımlılıklar. Spesifikasyonu somut bir mimariye bağlar.
- **tasks** - Planın sıralı, küçük ve tek tek doğrulanabilir görevlere bölünmesi.
- **implement** - Ajan görevleri sırayla yürütür; siz bin satırlık dökümü değil, odaklı ve yönetilebilir değişiklikleri gözden geçirirsiniz.

Kritik nokta şu: her adım bir öncekinin çıktısını girdi olarak alır. Spesifikasyon değişirse plan, plan değişirse görevler yeniden türetilir. Bu, [AI ajanları için context engineering](/tr/posts/ai-ajanlari-icin-context-engineering) disiplinini araç seviyesine taşımaktan başka bir şey değil - modele her turda doğru bağlamı, doğru sırayla vermek.

Bu döngünün asıl kazandırdığı şey gözden geçirme yükünün dağıtılması. Bin satırlık tek bir yığını incelemek yerine, spesifikasyonu ayrı, planı ayrı ve her görevi ayrı ayrı doğruluyorsunuz. Her aşamada geri dönüş maliyeti düşük: spesifikasyondaki bir hatayı yakalamak, o hatanın ürettiği yüz satırı sökmekten çok daha ucuz. Vibe coding'in dağıttığı disiplini geri getiren şey de tam olarak bu kademeli doğrulama; ajan hızlı yazsa bile karar noktaları insanda kalıyor.

## Araç dünyası: Temmuz 2026 durumu

SDD tek bir üründe kilitli değil; farklı felsefelerle gelen bir araç ailesine dönüştü.

| Araç | Ne | Öne çıkan | Temmuz 2026 durumu |
|---|---|---|---|
| GitHub Spec Kit | Ajan-bağımsız CLI + şablonlar | 30'dan fazla ajanla çalışır (Copilot, Claude Code, Gemini CLI) | Açık kaynak, GitHub'da 120.000 yıldız |
| AWS Kiro | Spec-öncelikli IDE | EARS notasyonuyla kabul kriterleri | Uluslararası GA, 7 Mayıs 2026 |
| OpenSpec | Hafif, spec-önce iş akışı | Mevcut ajanların üzerine ince katman | Açık kaynak topluluk projesi |
| Claude Code | Genel amaçlı kod ajanı | Alt ajanlar ve plan modu ile SDD'yi taklit eder | Spec Kit ile entegre çalışır |

Spec Kit'in 120.000 yıldızı bugün [deponun kendisinde](https://github.com/github/spec-kit) görülüyor; araç Eylül 2025'te açık kaynaklandı ve bildirilen büyümesiyle yıldız sayısı yaklaşık altı ayda ikiye katlandı. AWS Kiro ise Amazon Q Developer'ın bir güncellemesi değil, onun yerini alan sıfırdan bir ürün: kullanıcı hikâyelerini EARS (Easy Approach to Requirements Syntax) notasyonuyla belirsizlikten arındırılmış kabul kriterlerine çeviriyor.

Claude Code'u bu tabloya koymamın nedeni şu: ayrı bir SDD ürünü olmasa da, [alt ajanlar ve arka plan ajanlarıyla](/tr/posts/claude-code-subagent-arka-plan-ajanlari) planla-böl-uygula döngüsünü fiilen kuruyor. Spec Kit'i doğrudan Claude Code'un üzerinde çalıştırabiliyorsunuz.

## Küçük bir spec örneği neye benzer?

SDD'yi soyut bırakmamak için minik bir örnek. Aşağıdaki, bir "e-posta ile giriş" özelliği için sadeleştirilmiş bir spesifikasyon taslağı - resmi bir şablon değil, mantığı göstermek için:

```text
# Özellik: E-posta ile parolasız giriş

## Amaç (neden)
Kullanıcılar parola hatırlamadan giriş yapabilsin; destek
taleplerinin en büyük kalemi olan "parola sıfırlama" azalsın.

## Kullanıcı hikâyesi
Kayıtlı bir kullanıcı olarak, e-posta adresimi girip gelen
tek kullanımlık bağlantıya tıklayarak oturum açmak istiyorum.

## Kabul kriterleri (EARS)
- KOŞUL geçerli bir e-posta girildiğinde, sistem 60 sn içinde
  tek kullanımlık bir bağlantı GÖNDERMELİDİR.
- KOŞUL bağlantı 15 dk içinde kullanılırsa, sistem oturumu
  AÇMALIDIR; aksi halde bağlantı geçersiz OLMALIDIR.
- KOŞUL aynı e-posta için 5 dk içinde 3'ten fazla istek gelirse,
  sistem yeni bağlantı üretmeyi REDDETMELİDİR.

## Kapsam dışı
- Sosyal medya ile giriş (ayrı spec)
- Çok faktörlü doğrulama (sonraki iterasyon)
```

Fark ettiyseniz burada tek satır kod yok. `plan` adımı bu spesifikasyonu bir veri modeline ve token servisine bağlayacak; `tasks` adımı onu on-on beş küçük göreve bölecek. Ajan koda ancak bu iki adımdan sonra dokunuyor - ve her görev tek başına gözden geçirilebilir boyutta kalıyor.

## SDD'yi ne zaman KULLANMAMALI?

Dürüst olayım: SDD her işe uygun değil ve her prompt'u spesifikasyona çevirmek bir noktadan sonra ritüele dönüşüp sizi yavaşlatır. Kişisel görüşüm net - keşif aşamasındaki bir prototipte, tek seferlik bir scriptte veya "acaba bu API ne döndürüyor" tarzı bir denemede SDD'nin ağırlığı getirisinden fazla.

Ayrımı şöyle koyuyorum: sonucu kolayca atılabilen, tek kişilik ve kısa ömürlü işlerde vibe coding hâlâ en hızlı yol. Buna karşılık paylaşılan bir repoda, prod'a dokunan bir akışta veya gereksinimin aylar sonra geri döneceği bir üründe niyeti yazılı bırakmamak pahalıya patlıyor. SDD'nin sizi gerçekten hızlandırıp hızlandırmadığı sorusu, [yapay zekânın geliştiricileri gerçekten hızlandırıp hızlandırmadığı](/tr/posts/yapay-zeka-verimlilik-paradoksu) tartışmasının bir alt kümesi: ölçmeden varsaymayın.

Bir de izin katmanını unutmayın. SDD döngüsünde ajan `implement` adımında gerçek dosyalara yazıp komut çalıştırır; burada [Claude Code Auto Mode gibi otomatik onay katmanlarının](/tr/posts/claude-code-auto-mode-nasil-calisir) davranışını bilinçli ayarlamak, spesifikasyonu yazmak kadar önemli. İyi bir spec, kötü bir korkuluk politikasını telafi etmez.

## Sıkça Sorulan Sorular

### Spec-driven development, vibe coding'in tam zıttı mı?

Pratikte evet. Vibe coding'de belirsiz bir istek verip çıkan kodu gözden geçirirsiniz; SDD'de önce spesifikasyonu yazar, kodu ondan türetirsiniz. İkisi rakip değil, farklı risk seviyeleri için araçlar: atılabilir denemelerde vibe coding, prod'a giden işlerde SDD.

### Spec Kit'i kullanmak için hangi ajan gerekiyor?

Spec Kit ajan-bağımsız bir CLI. GitHub Copilot, Claude Code ve Gemini CLI dâhil 30'dan fazla kod ajanıyla çalışır; kendi tercih ettiğiniz ajanı seçebilirsiniz. AWS Kiro ise SDD'yi doğrudan IDE'ye gömen ayrı bir üründür.

### EARS notasyonu nedir?

EARS (Easy Approach to Requirements Syntax), gereksinimleri belirsizlikten arındıran standart bir yazım biçimidir. "KOŞUL ... sistem ... MELİDİR" kalıbıyla kabul kriterlerini test edilebilir cümlelere çevirir. AWS Kiro, kullanıcı hikâyelerini bu notasyona dönüştürerek üretir.

### Küçük ekipler için SDD fazla ağır mı?

Duruma bağlı. Keşif ve tek seferlik işlerde ağırlığı getirisinden fazla olabilir. Ama paylaşılan bir repoda çalışan iki kişilik bir ekip bile, niyeti yazılı bırakmanın getirisini ilk gereksinim değişikliğinde görür. Diğer yapay zeka konuları için [yapay zeka kategorimize](/tr/category/yapay-zeka) göz atabilirsiniz.
