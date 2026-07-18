---
title: "Claude Code Kaçak Ajanlara Fren Getirdi"
slug: "claude-code-kacak-ajanlara-fren"
translationKey: "claude-code-runaway-agent-guardrails"
locale: "tr"
excerpt: "Claude Code v2.1.212 ve v2.1.214, oturum başına 200 alt ajan ve 200 WebSearch sınırı ile bir PowerShell güvenlik açığını aynı hafta içinde kapattı."
category: "ai"
tags: ["claude", "ai-agents", "ai-reliability", "developer-experience"]
publishedAt: "2026-07-18"
seoTitle: "Claude Code Kaçak Ajan Sınırları: v2.1.212 ve v2.1.214"
seoDescription: "Claude Code artık oturum başına 200 alt ajan ve 200 WebSearch sınırı getiriyor, bir PowerShell güvenlik açığını kapatıyor ve EndConversation aracını ekliyor."
---

Anthropic, 17-18 Temmuz 2026'da art arda çıkardığı iki sürümle Claude Code'a oturum başına 200 alt ajan ve 200 WebSearch çağrısı sınırı getirdi; amaç, kontrolden çıkan çok ajanlı döngülerin token bütçesini tüketmesini varsayılan olarak durdurmak.

## v2.1.212'de Ne Değişti

17 Temmuz'da yayınlanan Claude Code v2.1.212, iki yeni varsayılan tavan getirdi. Birincisi, oturum boyunca yapılabilecek WebSearch çağrısı sayısını 200 ile sınırlıyor; bu değeri `CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION` ortam değişkeniyle değiştirebilirsiniz. Anthropic bunu açıkça "kaçak arama döngülerini durdurmak" için eklediğini belirtti. İkincisi, bir oturumda toplamda kaç [alt ajan (subagent)](/tr/posts/claude-code-subagent-arka-plan-ajanlari) başlatılabileceğine 200'lük bir tavan koydu; bu da `CLAUDE_CODE_MAX_SUBAGENTS_PER_SESSION` ile ayarlanabiliyor ve "kaçak devretme (delegation) döngülerini durdurmak" için eklendiği söyleniyor. `/clear` komutu bu bütçeyi sıfırlıyor.

Aynı sürümde üçüncü bir değişiklik daha var: iki dakikadan uzun süren MCP araç çağrıları artık otomatik olarak arka plana alınıyor, böylece oturum kilitlenmiş gibi görünmüyor. Bu davranış `CLAUDE_CODE_MCP_AUTO_BACKGROUND_MS` ile ayarlanabiliyor.

## v2.1.214'te Ne Değişti

Bir gün sonra, 18 Temmuz'da çıkan v2.1.214 iki cepheden ilerledi. Öncelikle **EndConversation** adında yeni bir araç eklendi: Claude artık son derece istismarcı kullanıcılarla veya jailbreak girişimleriyle karşılaştığında oturumu doğrudan sonlandırabiliyor. Bu yetenek claude.ai'de 2025'ten beri vardı, Claude Code'a yeni geliyor.

İkincisi, Windows PowerShell 5.1 oturumlarında çalıştırılan komutları etkileyen bir izin kontrolü atlatma açığı (permission-check bypass) kapatıldı. Aynı sürümde birkaç ilgili izin kontrolü sorunu daha giderildi: Bash izin kontrolleri artık analizörün daha önce yanlış değerlendirdiği dosya tanımlayıcı (file descriptor) yönlendirme biçimlerinde varsayılan olarak reddediyor; 10.000 karakteri aşan komutlar artık otomatik çalışmak yerine her zaman onay istiyor; zsh'te `[[ ]]` karşılaştırmaları içindeki değişken alt indeksleri ve niteleyicileri artık zararsız metin gibi işlenmiyor, onay istiyor; `--url`, `--connection`, `--identity` gibi daemon yönlendirme bayrakları taşıyan `docker` komutları (ve Podman'ın `docker` kabuğu) artık daha önce sessizce çalıştığı yerde izin istiyor.

## Kaçak Fan-Out Sorunu Neden Önemli

Bu sınırlar boşluğa konmadı. `anthropics/claude-code` deposundaki açık GitHub sorunları, tam olarak bu limitlerin hedeflediği hatayı defalarca belgeliyor. [#68110 numaralı sorun](https://github.com/anthropics/claude-code/issues/68110), genel amaçlı alt ajanların sınırsız çocuk ajan üretip üstel şekilde büyüdüğünü ve devasa token tükettiğini anlatıyor. [#68619 numaralı sorun](https://github.com/anthropics/claude-code/issues/68619) ise alt ajan üretimindeki desen hatalarının sonsuz özyinelemeye, sonsuz token tüketimine ve biriken alt ajan işinin kaybolmasına yol açtığını gösteriyor.

Bu, [çok ajanlı orkestrasyon](/tr/posts/cok-ajanli-orkestrasyon-kaliplari) kuran ekiplerin aşina olduğu bir senaryo: paralel araştırmacı ajanlar, fan-out kod inceleyicileri veya iç içe devretme zincirleri kurduğunuzda, bir ajanın yanlış anladığı tek bir talimat kolayca "her alt görev için üç tane daha alt görev başlat" döngüsüne dönüşebiliyor. Daha önce bunu durduran tek mekanizma, bir ajan dalının en fazla 5 seviye derinliğe inebilmesiydi; bu derinlik sınırı hâlâ geçerli ve ayrı bir mekanizma olarak duruyor. Ama derinlik sınırı, aynı seviyede yatay olarak binlerce ajan üretilmesini engellemiyordu. v2.1.212'deki yeni tavanlar tam da bu boşluğu, derinlikten bağımsız düz bir oturum bütçesiyle kapatıyor.

### Neden Varsayılan, Opt-in Değil

Burada dikkat çeken tasarım kararı şu: bu sınırlar varsayılan olarak açık geliyor, isteğe bağlı bir bayrak değil. Bunun doğru yaklaşım olduğunu düşünüyorum, çünkü Claude Code artık çoğu ekipte gözetimsiz veya yarı gözetimsiz çalışıyor; CI'da, otomasyon script'lerinde, gece boyu çalışan araştırma görevlerinde. Bir güvenlik ağının etkili olması için, birinin hatırlayıp açması gerekmemesi lazım — zaten orada olması ve sadece gerçekten büyük iş yükleri için bilinçli olarak yükseltilmesi gerekir.

Bu yaklaşım, bulut sağlayıcılarının hesap başına varsayılan kota koymasına da benziyor: kimse ilk günden sınırsız kaynak isteği göndermeyi beklemez, çünkü tek bir yanlış yapılandırılmış döngü faturayı saatler içinde katlayabilir. Claude Code için "fatura" doğrudan token tüketimi ve model çağrısı sayısı; bir alt ajan zincirinin kontrolsüz şekilde çoğalması, gece boyu çalışan bir otomasyonun sabaha kadar binlerce gereksiz çağrı biriktirmesi anlamına gelebilir. 200'lük tavan, bu senaryoyu tamamen ortadan kaldırmasa bile, sorunu saatler yerine dakikalar içinde görünür kılıyor.

## Ekipler İçin Pratik Etkisi

Bu değişiklikler, günlük Claude Code kullanımının çoğunda hissedilmeyecek kadar yüksek bir eşikte duruyor: sıradan bir kod inceleme oturumu ya da tekil bir görev, 200 alt ajan sınırının çok altında kalır. Asıl etkiyi, otomasyon script'leri içinde Claude Code'u tetikleyen, uzun süreli araştırma görevleri çalıştıran veya çok sayıda paralel alt görev başlatan ekipler hissedecek. Böyle bir kurulumunuz varsa, güncellemeden hemen sonra yaptığınız ilk şey mevcut ortalama alt ajan ve WebSearch kullanımınızı gözden geçirmek olmalı; tavana yakın çalışıyorsanız, sınırı körü körüne yükseltmek yerine önce neden bu kadar çok çağrı yaptığınızı sorgulamak daha sağlıklı bir başlangıç noktası.

## Yeni Varsayılanlar Özet Tablosu

| Koruma | Eski davranış | Yeni varsayılan (v2.1.212+) | Ayar değişkeni |
|---|---|---|---|
| Oturum başına WebSearch çağrısı | Sınırsız | 200 | `CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION` |
| Oturum başına alt ajan üretimi | Sınırsız (sadece 5 seviyelik derinlik tavanı vardı) | 200 | `CLAUDE_CODE_MAX_SUBAGENTS_PER_SESSION` |
| 2 dakikayı aşan MCP araç çağrıları | Oturumu bloke ediyordu | Otomatik arka plana alınıyor | `CLAUDE_CODE_MCP_AUTO_BACKGROUND_MS` |
| PowerShell 5.1 izin kontrolü | Belirli komutlarda atlatılabiliyordu | Düzeltildi (v2.1.214) | — |

## Limitleri Kendi İş Akışınıza Göre Ayarlamak

Yoğun paralel araştırma veya büyük ölçekli fan-out kod incelemesi çalıştıran ekipler için 200'lük varsayılan bazen dar gelebilir. Değerleri projenizin `.env` dosyasında veya kabuk profilinizde şöyle yükseltebilirsiniz:

```bash
# Ağır fan-out gerektiren oturumlar için varsayılanları yükselt
export CLAUDE_CODE_MAX_SUBAGENTS_PER_SESSION=500
export CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION=400
export CLAUDE_CODE_MCP_AUTO_BACKGROUND_MS=180000
```

Bunu yaparken tavanı sınırsız hale getirmemek daha güvenli; sayıyı beklenen en kötü senaryonun birkaç katına çıkarmak, hem gerçek kaçak döngüleri hâlâ yakalar hem de meşru büyük işleri engellemez. [Auto mode](/tr/posts/claude-code-auto-mode-nasil-calisir) gibi gözetimsiz çalışan kurulumlarda bu değerleri olduğu gibi bırakmak, ilk savunma hattı olarak mantıklı.

## Güvenlik Tarafı: PowerShell ve İzin Kontrolleri

v2.1.214'teki izin kontrolü düzeltmeleri, [Friendly Fire açığı](/tr/posts/friendly-fire-claude-code-guvenlik-acigi) gibi daha önce ortaya çıkan güvenlik sorunlarıyla aynı kategoriye giriyor: Claude Code'un komut analizörünün "bu komut güvenli mi" sorusunu yanlış cevapladığı köşe durumları. PowerShell 5.1 açığı özellikle Windows'ta çalışan geliştiriciler için önemliydi, çünkü analizör belirli komut biçimlerinde izin kontrolünü atlıyordu. Docker/Podman daemon yönlendirme bayrakları ve zsh alt indeks sözdizimi düzeltmeleri de aynı prensibe dayanıyor: şüpheli durumda sessizce çalıştırmak yerine kullanıcıya sor.

## Sonuç

Temmuz 2026 itibarıyla Claude Code, hem maliyet/güvenilirlik tarafında (alt ajan ve WebSearch tavanları) hem de güvenlik tarafında (PowerShell ve izin kontrolü düzeltmeleri) somut adımlar attı. [MCP](/tr/posts/model-context-protocol-nedir) üzerinden dış araçlara bağlanan ve çok sayıda alt ajan devreye sokan kurulumlar için bu güncellemeleri hemen almanız, mevcut ayarlarınızın yeni varsayılanlarla uyumlu olup olmadığını kontrol etmeniz mantıklı.

## Sıkça Sorulan Sorular

### Bu sınırlar her alt ajan için mi yoksa tüm oturum için mi geçerli?
Tüm oturum için geçerli. 200 alt ajan ve 200 WebSearch tavanı, kaç seviye derinlikte veya kaç farklı dalda olursa olsun oturumun tamamında biriken toplam sayıyı sınırlıyor. Bu, tek bir alt ajanın en fazla 5 seviye derinliğe inebilmesini sağlayan ayrı ve daha eski derinlik sınırından farklı.

### Oturum tavana ulaşınca ne oluyor?
Claude Code yeni alt ajan başlatma veya WebSearch çağırma isteklerini reddediyor ve kullanıcıyı bilgilendiriyor. `/clear` çalıştırmak bütçeyi sıfırlıyor ve sıfırdan başlıyorsunuz; alternatif olarak ilgili ortam değişkenini yükseltip oturumu yeniden başlatabilirsiniz.

### 5 seviyelik derinlik sınırı hâlâ geçerli mi?
Evet, tamamen ayrı ve değişmeyen bir mekanizma. Derinlik 5'teki bir alt ajana Agent aracı verilmiyor, dolayısıyla daha fazla alt ajan üretemiyor. Yeni v2.1.212 sınırları buna ek geliyor, yerine geçmiyor.

### PowerShell düzeltmesi beni etkiliyor mu?
Windows'ta PowerShell 5.1 üzerinden Claude Code çalıştırıyorsanız evet; v2.1.214'e güncellemeniz öneriliyor. macOS, Linux veya PowerShell 7+ kullanan kurulumlar bu belirli açıktan etkilenmiyordu ama diğer izin kontrolü düzeltmeleri (Bash yönlendirme, zsh, Docker) platform bağımsız, yani herkes için geçerli.
