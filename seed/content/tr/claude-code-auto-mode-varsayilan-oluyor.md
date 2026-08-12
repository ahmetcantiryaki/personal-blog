---
title: "Claude Code'da Auto Mode Varsayılan Oluyor"
slug: "claude-code-auto-mode-varsayilan-oluyor"
translationKey: "claude-code-auto-mode-default-rollout"
locale: "tr"
excerpt: "Claude Code'un otomatik onay katmanı auto mode, 14 Ağustos 2026'dan itibaren Pro, Max ve Team planlarında yeni oturumlar için varsayılan izin modu oluyor."
category: "ai"
tags: ["claude", "ai-coding", "ai-agents", "automation"]
publishedAt: "2026-08-12"
seoTitle: "Claude Code Auto Mode Varsayılan Oluyor"
seoDescription: "14 Ağustos 2026: Claude Code auto mode Pro, Max ve Team planlarında varsayılan izin modu oluyor. Değişen, değişmeyen ve güvenlik verileri burada."
---

Claude Code'da auto mode, 14 Ağustos 2026 itibarıyla Pro, Max ve Team planlarında açılan yeni oturumlar için varsayılan izin modu oluyor. Anthropic bunu 3-7 Ağustos haftasına ait ["Week 32" güncelleme notlarında](https://code.claude.com/docs/en/whats-new/2026-w32) duyurdu. Değişiklik somut: artık her araç çağrısında onay istemek yerine, riskli olmayan işlemleri arka planda otomatik onaylayan sınıflandırıcı öntanımlı davranış haline geliyor.

## Auto Mode Kısaca Ne Yapıyor

Auto mode, her dosya yazımı veya kabuk komutu öncesinde sizi bekleten klasik onay akışının yerine bir sınıflandırıcı koyuyor: bu katman komutun bağlamını değerlendiriyor, yıkıcı veya dışa dönük (repo dışına veri gönderen, sistem ayarlarını değiştiren) eylemleri engelliyor ve geri kalanını insan beklemeden geçiriyor. Mekanizmanın işleyişini ayrıntılı ele aldığımız [Auto Mode nasıl çalışır yazımızda](/tr/posts/claude-code-auto-mode-nasil-calisir) bu konuyu derinlemesine işledik; bu yazının konusu farklı — mekanizma değil, 14 Ağustos'ta varsayılan hale gelmesinin ne anlama geldiği ve bunun etrafındaki güvenlik tartışması.

## 14 Ağustos'ta Ne Değişiyor, Ne Değişmiyor

Değişiklik herkesi aynı anda kapsamıyor. Kişisel bir varsayılan izin modu belirlemiş kullanıcılar bu ayardan etkilenmiyor — tek seferlik bir geçiş isteminde "evet" demedikçe eski davranış korunuyor. Organizasyon yöneticisinin belirlediği kurumsal varsayılan da bu değişiklikle ezilmiyor.

| Kapsam | 14 Ağustos'tan Sonra |
|---|---|
| Pro / Max / Team, yeni oturum, hiç ayar yapılmamış | Varsayılan auto mode |
| Pro / Max / Team, kişisel varsayılan zaten ayarlı | Değişmiyor (geçiş istemi opsiyonel) |
| Organizasyon yönetimli varsayılan mod | Değişmiyor |
| Enterprise, API, Bedrock, Vertex/Google Cloud Agent Platform, Microsoft Foundry | Hâlâ opt-in, varsayılan değişmiyor |

Enterprise ve API tarafında hâlâ isteğe bağlı olması dikkat çekici; Anthropic'in daha geniş varsayılan yayılımını ileriki bir tarihe erteliyor olması, kurumsal ortamlarda daha yüksek bir temkin çıtası uyguladığını gösteriyor. Bunun mantıklı bir nedeni var: Enterprise ve API müşterileri genelde tek bir geliştiricinin değil, birden fazla ekibin paylaştığı ortak bir yapılandırmayı yönetiyor — bir varsayılanı yanlış değiştirmenin bedeli orada çok daha yüksek. Pro, Max ve Team ise büyük ölçüde bireysel geliştiricilerin ya da küçük ekiplerin kullandığı planlar; buradaki hata payı, bir kurumsal dağıtımdakine kıyasla çok daha sınırlı.

## Bu Ani Bir Karar Değil

14 Ağustos duyurusu tek başına bakıldığında büyük bir sıçrama gibi görünebilir, ama geriye dönüp bakınca kademeli bir yol haritasının son adımı. Auto mode, Mart 2026'da araştırma önizlemesi olarak çıktı, Mayıs 2026'da Pro planına ulaştı ve yaz boyunca sertleştirildi: yıkıcı git komutlarını engelleme ve çözülmemiş değişkenler üzerinde `rm -rf` öncesi soru sorma davranışı bu dönemde eklendi. Temmuz 2026 itibarıyla da Bedrock, Google Cloud Agent Platform ve Microsoft Foundry'de opt-in adımına gerek kalmadı. Yani 14 Ağustos, aylardır süren bir olgunlaşma sürecinin doğal sonucu — bir gecede alınmış bir karar değil.

Ayrıca sınıflandırıcı çağrılarının artık kullanım limitlerine sayılmaması da bu yayılmayla birlikte gündeme gelen bir başka pratik detay; auto mode'un arka planda çalıştırdığı değerlendirme adımları, kotanızdan düşmüyor. Bu, otomasyonu tercih eden ekipler için ek bir sürtünme kaynağını da ortadan kaldırıyor — eskiden "sınıflandırıcı da kotamı mı tüketiyor" diye sorgulayan kullanıcılar artık bu hesabı yapmak zorunda değil.

Kademeli ilerleyişin bir başka boyutu, her adımda gerçek kullanım verisiyle sertleştirme yapılmış olması. Yaz boyunca eklenen "yıkıcı git komutlarını engelleme" ve "çözülmemiş değişkenler üzerinde `rm -rf` öncesi soru sorma" gibi davranışlar, laboratuvar testinden değil gerçek prod olaylarından çıkarılan derslerle şekillendi. Bu da 14 Ağustos'taki varsayılan değişimini, ilk research preview'dan çok daha olgun bir sınıflandırıcı üzerine kuruyor.

## Güvenlik Tartışması: Sayılar Ne Diyor

Bu haberin en tartışmalı kısmı, otomatik onayın insan onayından daha güvenli olup olmadığı sorusu. Anthropic'in kendi red-team tarzı stres testinde, sınıflandırıcı 1.053 kasıtlı olarak yerleştirilmiş tehlikeli komuttan 937'sini yakaladı — yaklaşık %89 yakalama oranı, yani yaklaşık %11 kaçırma oranı. Aynı istemleri gözden geçiren ücretli insan test görevlileri ise 1.053 komuttan sadece 143'ünü yakalayabildi, yani yaklaşık %13,6'lık bir yakalama oranı.

Bu tablo tek başına okununca rahatsız edici: sınıflandırıcı tehlikeli komutların onda birinden fazlasını kaçırıyor — [Techi'nin bu %11'lik kaçırma oranına odaklanan haberinde](https://www.techi.com/claude-code-auto-mode-default-11-percent-miss-rate/) de bu sayı öne çıkarılıyor. Ama karşılaştırmalı okunduğunda resim değişiyor — aynı testte insan gözden geçirenler işin büyük çoğunluğunu (%86'dan fazlasını) kaçırdı. Sertleştirme çalışmalarının ardından sentetik/düşmanca test setlerindeki kaçırma oranı yaklaşık %7'ye indi. Gerçek prod trafiğinde ise Anthropic yaklaşık %0,4 yanlış pozitif (gereksiz yere engellenen güvenli komut) ve %17 yanlış negatif (kaçırılan riskli komut) oranı bildiriyor.

| Test Ortamı | Kaçırma Oranı |
|---|---|
| İlk stres testi (sentetik) | ~%11 |
| Sertleştirme sonrası (sentetik/düşmanca) | ~%7 |
| Gerçek prod trafiği | ~%17 |

Prod ortamındaki yanlış negatif oranının sentetik testten daha yüksek çıkması, gerçek kullanım kalıplarının laboratuvar koşullarından daha çeşitli ve öngörülemez olduğunu gösteriyor — bu da Anthropic'in kendi de vurguladığı bir noktayı doğruluyor: auto mode "riski ortadan kaldırmıyor." Sınıflandırıcı, geri döndürülemez, yıkıcı veya dışa dönük eylemleri yakalamaya ayarlanmış bir filtre; doğruluk garantisi ya da yüksek riskli değişikliklerde insan muhakemesinin yerine geçen bir mekanizma değil.

Kişisel görüşüm şu: sınıflandırıcının insan gözden geçirenlerden defalarca daha iyi performans gösterdiği bir testte "varsayılanı otomasyon lehine değiştirmek" makul bir bahis — çoğu bireysel geliştirici ve küçük ekip için net kazanç bu yönde. Ama uyumluluk (compliance) yükümlülüğü olan, düzenlenmiş bir sektörde çalışan ya da paylaşılan prod ortamlarına dokunan ekipler için "makul ortalama" yeterli değil; onlar için manuel onayı bilinçli ve açıkça sabitlemek hâlâ doğru varsayılan. [Kaçak ajanlara fren yazımızda](/tr/posts/claude-code-kacak-ajanlara-fren) bu tür korkulukların neden tek başına bir sınıflandırıcıya bırakılmaması gerektiğini ayrıca işledik.

## Manuel Onayı Sabitlemek İsteyenler İçin

14 Ağustos'tan önce auto mode'u kendi isteğinizle varsayılan yapmak ya da tam tersi, manuel onayı kalıcı olarak sabitlemek isterseniz, tercih `~/.claude/settings.json` dosyasında yapılıyor:

```json
{
  "permissions": {
    "defaultMode": "auto"
  }
}
```

Aynı `defaultMode` alanına `"manual"` yazarak tam tersini de sabitleyebilirsiniz. Organizasyon yöneticileri için bu ayar, tek tek kullanıcı tercihine bakılmaksızın merkezi bir politika olarak da uygulanabiliyor — [izin modları dokümantasyonu](https://code.claude.com/docs/en/permission-modes) gereksinimleri ve kontrolleri ayrıntılı listeliyor. [Subagent'lar ve arka plan ajanları](/tr/posts/claude-code-subagent-arka-plan-ajanlari) gibi gözetimsiz çalışan akışlarda bu ayarın hangi tarafta durduğunu bilmek özellikle önemli, çünkü paralel çalışan ajan sayısı arttıkça tek tek onay vermek zaten pratik olmaktan çıkıyor.

Karar basit bir denklem: otomasyonun getirdiği hız kazancını kabul ediyorsanız 14 Ağustos'ta hiçbir şey yapmanıza gerek yok, değişiklik kendiliğinden gelecek. Manuel onayı korumak istiyorsanız bu tarihten önce ayarı açıkça sabitlemeniz gerekiyor — varsayılan davranışın değişmesini beklemek risk.

## Sıkça Sorulan Sorular

### Auto mode'u nasıl devre dışı bırakırım?

`~/.claude/settings.json` dosyasında `permissions.defaultMode` alanını `"manual"` olarak ayarlamanız yeterli. Organizasyon yönetimli bir varsayılan varsa bu değişikliği yönetici seviyesinde yapmanız gerekiyor.

### Bu değişiklik Enterprise ve API kullanıcılarını etkiliyor mu?

Hayır, en azından şimdilik. Enterprise, API ve Bedrock/Vertex/Foundry gibi büyük bulut entegrasyonları hâlâ opt-in kapsamında; Anthropic daha geniş varsayılan yayılımını ileriki bir tarihe bırakıyor.

### Auto mode gerçekten güvenli mi?

Kesin bir garanti değil ama insan gözden geçirmesinden ölçülebilir şekilde daha güvenilir çıkıyor. Sentetik testlerde sertleştirme sonrası kaçırma oranı ~%7'ye, prod trafiğinde yanlış negatif oranı ~%17'ye iniyor; Anthropic bunun riski sıfırlamadığını, sadece azalttığını açıkça belirtiyor.

### Daha önce ayarladığım varsayılan izin modum kayboluyor mu?

Hayır. Kişisel olarak ayarladığınız bir varsayılan varsa, tek seferlik bir geçiş istemini kabul etmediğiniz sürece o ayar korunuyor. Organizasyon yönetimli varsayılanlar da bu rollout'tan etkilenmiyor.
