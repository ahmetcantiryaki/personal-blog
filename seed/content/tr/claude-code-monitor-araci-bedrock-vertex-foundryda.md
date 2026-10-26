---
title: "Claude Code Monitor Bedrock, Vertex, Foundry'de Çalışıyor"
slug: "claude-code-monitor-araci-bedrock-vertex-foundryda"
translationKey: "claude-code-monitor-tool-enterprise-platforms-2026"
locale: "tr"
excerpt: "Claude Code 2.1.310, Monitor aracını Bedrock, Vertex ve Foundry'ye taşıdı; Enterprise özel rollerine Cloud sessions ve Remote Control izni ekledi."
category: "ai"
tags: ["claude", "monitoring", "cloud", "devops"]
publishedAt: "2026-10-26"
seoTitle: "Claude Code Monitor Aracı: Bedrock, Vertex, Foundry Desteği"
seoDescription: "Claude Code 2.1.310, Monitor aracını Bedrock, Vertex, Foundry'ye taşıdı; Enterprise rollerine de Cloud sessions ve Remote Control izni ekledi."
---

Kısa cevap: Claude Code 2.1.310, 23 Ekim 2026'da yayımlandı ve Monitor aracını artık Amazon Bedrock, Google Vertex AI ve Microsoft Foundry üzerinde çalışan dağıtımlarda da kullanılabilir hale getirdi; aynı sürüm, telemetri veya zorunlu olmayan trafiğin kapatıldığı kurulumlarda da aracı etkinleştirdi. Daha önce bu üç kurumsal model platformundan birini kullanan ekipler, Claude Code'un arka plan görevlerini olay tabanlı izleyen bu aracından tamamen mahrumdu.

## Monitor aracı ne işe yarıyor?

Kısa cevap: Monitor, Claude Code'un bir arka plan kabuk (shell) komutu başlatıp, komutun ürettiği her satırı sorgulama (polling) yapmadan gerçek zamanlı bir olay olarak geri almasını sağlayan araç. Araç, Claude Code'a 2.1.98 sürümüyle (Nisan 2026) eklendi ve o zamandan beri uzun süren build, test veya deploy komutlarını izlemenin standart yolu oldu.

Birbirine yakın zamanda gelen çıktı satırları (~200 ms içinde) tek bir bildirimde birleştiriliyor, böylece Claude her satır için ayrı ayrı uyarılmıyor. Monitor, Bash aracının mevcut izin kurallarını kullanıyor; yani bir komutu Bash üzerinden çalıştırmaya yetkiniz varsa, aynı komutu Monitor ile de izleyebiliyorsunuz. Pratikte bu, "her 10 saniyede bir build bitti mi diye sor" yerine, build süreci kendi logunu ürettiği anda Claude'un haberdar olması demek.

## Bedrock, Vertex ve Foundry'de neden çalışmıyordu?

Kısa cevap: Monitor aracı, Nisan 2026'daki tanıtımından 23 Ekim 2026'ya kadar Amazon Bedrock, Google Vertex AI veya Microsoft Foundry üzerinden Claude Code çalıştıran hiçbir kurulumda kullanılamıyordu; aynı kısıtlama telemetri veya zorunlu olmayan ağ trafiğinin kapatıldığı ortamlar için de geçerliydi. Değişiklik notları bu kısıtlamanın teknik gerekçesini açıklamıyor, ama sonuç ortadaydı: büyük bulut sağlayıcılarının kendi model uç noktalarını kurumsal uyum gereksinimleriyle kullanan ekipler, arka plan ajanlarını izlemek için hâlâ polling'e ya da kendi scriptlerine mahkumdu.

Bu, özellikle finans ve sağlık gibi düzenlenmiş sektörlerde Bedrock veya Vertex üzerinden Claude çalıştıran kurumsal ekipler için gerçek bir sürtünme noktasıydı — Claude Code'un diğer kullanıcıları zaten Monitor ile olay tabanlı iş akışları kurarken, uyum gereksinimleri nedeniyle bu platformlara bağlı kalan ekipler altı aydan uzun süre bu yetenekten mahrum kaldı.

## 2.1.310'da tam olarak ne değişti?

Kısa cevap: Claude Code 2.1.310, Monitor aracını ve eklenti (plugin) monitörlerini Bedrock, Vertex ve Foundry'de etkinleştirdi; aynı güncelleme, telemetri veya zorunlu olmayan trafiğin devre dışı olduğu kurulumlarda da aracı açtı ve bu platformlarda "uzun süren ön plan (foreground) uyku" komutlarını da artık engelliyor — yani diğer ortamlarda zaten var olan güvenlik davranışı buraya da taşındı.

| Platform | 2.1.310 öncesi | 2.1.310 ve sonrası |
|---|---|---|
| Amazon Bedrock | Monitor aracı yok | Monitor aracı + eklenti monitörleri var |
| Google Vertex AI | Monitor aracı yok | Monitor aracı + eklenti monitörleri var |
| Microsoft Foundry | Monitor aracı yok | Monitor aracı + eklenti monitörleri var |
| Telemetri kapalı kurulumlar | Monitor aracı yok | Monitor aracı var |
| Uzun ön plan uykusu (tüm platformlarda) | Bazı platformlarda engellenmiyordu | Artık her yerde engelleniyor |

Aynı sürüm notunda eklenti (plugin) monitörlerinden de bahsediliyor; bu, üçüncü taraf eklentilerin kendi arka plan izleme mantıklarını Monitor altyapısı üzerine kurabilmesi anlamına geliyor — değişiklik notları bunun tam API yüzeyini detaylandırmıyor, ama eklenti geliştiricilerinin bulut platformu bağımsız bir izleme katmanına erişebileceğini gösteriyor.

## Enterprise özel rollerinde ne değişti?

Kısa cevap: 2.1.310, Claude Code cloud sessions ve Remote Control'ü Enterprise özel rollerine (custom roles) ayrı ayrı atanabilir izinler olarak ekledi; böylece organizasyon sahipleri (Owners) hangi rolün hangi özelliğe erişebileceğini tek tek belirleyebiliyor. Aynı güncelleme, admin ayarlarında Cloud sessions veya Remote Control'ü açmayı bir onay adımına bağladı ve bu onay ekranı, söz konusu izne zaten sahip olan özel rolleri listeliyor.

Bu, büyük organizasyonlarda yanlışlıkla geniş erişim verme riskini azaltan küçük ama pratik bir değişiklik: önceden Cloud sessions'ı organizasyon genelinde açan bir admin, bunu kaç rolün ve dolayısıyla kaç kişinin etkileyeceğini önceden göremiyordu. Artık o bilgi, özelliği açmadan önce ekranda.

```text
Admin Settings → Enterprise → Custom Roles
  ├─ Claude Code cloud sessions  [izin ver / kısıtla]
  └─ Remote Control              [izin ver / kısıtla]

Cloud sessions veya Remote Control'ü açarken:
  → Onay istenir
  → Bu izne sahip özel roller listelenir
```

## Bedrock, Vertex veya Foundry'de Monitor aracı nasıl etkinleşir?

Kısa cevap: Ek bir kurulum adımı yok — Claude Code'u 2.1.310 veya üzerine yükselttiğinizde, Bedrock, Vertex veya Foundry üzerinden çalışan oturumlarda Monitor aracı otomatik olarak kullanılabilir hale geliyor; yapmanız gereken tek şey mevcut CLI'nizi güncellemek.

```bash
# Mevcut sürümü kontrol edin
claude --version

# 2.1.310 veya üzerine yükseltin
npm install -g @anthropic-ai/claude-code@latest
```

Yükseltmeden sonra, Claude bir arka plan komutu başlattığında (örneğin uzun süren bir test paketi veya build), bu komutu Monitor ile izleyebiliyor — daha önce bu üç platformda bu seçenek hiç sunulmuyordu, Claude yalnızca komutu çalıştırıp sonucunu toplu halde bekleyebiliyordu. Eklenti geliştiricileri için de durum aynı: eklenti monitörleri artık platform ayrımı yapmadan çalışıyor, yani Bedrock üzerinde dağıtılan bir eklenti ile doğrudan API üzerinde çalışan bir eklenti arasında izleme yetenekleri bakımından fark kalmıyor.

Bu arada sürüm notlarının "uzun ön plan uykusu artık engelleniyor" ifadesi, bir komutun terminali bilerek ya da yanlışlıkla uzun süre bloke etmesini önleyen bir güvenlik kontrolüne işaret ediyor; bu kontrol önceden yalnızca Bedrock/Vertex/Foundry dışındaki ortamlarda vardı, şimdi üç platformda da devrede.

## Bu değişiklik kimi ilgilendiriyor?

Kısa cevap: Esas kazananlar, Bedrock, Vertex veya Foundry üzerinden Claude Code çalıştıran kurumsal ekipler ile Enterprise planında özel rol tanımlayan organizasyon sahipleri; bireysel geliştiriciler veya doğrudan Anthropic API'sini kullanan ekipler için pratikte bir şey değişmiyor, çünkü Monitor aracı o platformlarda zaten çalışıyordu.

Kişisel değerlendirmem: Anthropic'in altı aylık bir özellik farkını kapatmak için tek bir sürümde üç bulut platformunu birden kapsaması, kurumsal Claude Code kullanımının artık arka plan ajan iş akışlarına kadar genişlediğinin bir göstergesi — bu da düzenlenmiş sektörlerdeki ekiplerin "ikinci sınıf" bir deneyimle çalışmaya daha fazla tahammül etmediğini gösteriyor.

Claude Code'un arka plan ajan ekosistemi hakkında daha fazlası için [fork alt ajanları yazımıza](/tr/posts/claude-code-fork-alt-ajanlari-artik-varsayilan) ve [subagent iş akışı rehberimize](/tr/posts/claude-code-subagent-arka-plan-ajanlari) bakabilirsiniz; kurumsal dağıtım tarafında [self-hosted environments yazımız](/tr/posts/claude-code-kendi-altyapinizda-calisan-oturumlar), [Projects ile paralel bulut oturumları](/tr/posts/claude-code-projects-paralel-oturumlar) ve [--restricted modu açıklamamız](/tr/posts/claude-code-restricted-mode-nedir) bu değişikliğin bağlamını tamamlıyor. Daha fazla yapay zeka haberi için [Yapay Zeka kategori sayfamızı](/tr/category/yapay-zeka) ziyaret edebilirsiniz.

## Sıkça Sorulan Sorular

### Claude Code Monitor aracı nedir?

Monitor, Claude Code'un bir arka plan kabuk komutunu başlatıp çıktısını satır satır gerçek zamanlı olay olarak almasını sağlayan araçtır; Nisan 2026'da (v2.1.98) tanıtıldı ve sorgulama (polling) yerine olay tabanlı izleme sunar. Birbirine yakın gelen satırlar (~200 ms içinde) tek bildirimde birleştirilir ve araç, Bash aracının izin kurallarını kullanır.

### Monitor aracı Bedrock, Vertex ve Foundry'de ne zaman kullanılabilir oldu?

Monitor aracı, 23 Ekim 2026'da yayımlanan Claude Code 2.1.310 ile Amazon Bedrock, Google Vertex AI ve Microsoft Foundry üzerinde kullanılabilir hale geldi; aynı güncelleme, telemetri veya zorunlu olmayan trafiğin kapalı olduğu kurulumlarda da aracı etkinleştirdi.

### Enterprise özel rollerinde Cloud sessions ve Remote Control izinleri nasıl çalışıyor?

Claude Code 2.1.310'dan itibaren organizasyon sahipleri, Claude Code cloud sessions ve Remote Control'ü Enterprise özel rollerine ayrı ayrı izin olarak atayabiliyor. Bu özelliklerden birini admin ayarlarında açmak artık bir onay adımı gerektiriyor ve ekran, o izne zaten sahip olan rolleri listeliyor.

### Bu güncelleme bireysel Claude Code kullanıcılarını etkiliyor mu?

Hayır, doğrudan Anthropic API'si veya Claude Code'un standart bulut olmayan kurulumlarını kullanan bireysel geliştiriciler için Monitor aracı zaten çalışıyordu; bu güncelleme yalnızca Bedrock, Vertex, Foundry veya telemetrisi kapalı kurumsal dağıtımları ilgilendiriyor.

Kaynaklar:
- [Claude Code Changelog](https://code.claude.com/docs/en/changelog)
- [Claude Code Release Notes](https://docs.claude.com/en/release-notes/overview)
