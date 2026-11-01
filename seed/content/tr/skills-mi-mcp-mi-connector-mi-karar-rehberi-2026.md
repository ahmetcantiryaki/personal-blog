---
title: "Skills mi, MCP mi, Connector mı? Karar Rehberi 2026"
slug: "skills-mi-mcp-mi-connector-mi-karar-rehberi-2026"
translationKey: "skills-mcp-connectors-decision-2026"
locale: "tr"
excerpt: "Kısa cevap: paketli bilgi için Skill, canlı araç/veri erişimi için MCP, hazır üçüncü taraf uygulama için Connector kullanın — üçü birbirinin yerine geçmez."
category: "ai"
tags: ["mcp", "ai-tools", "claude", "chatgpt", "gemini"]
publishedAt: "2026-11-01"
seoTitle: "Skills vs MCP vs Connector: Hangisini Ne Zaman Kullan?"
seoDescription: "Claude, ChatGPT ve Gemini'de Skills, MCP ve Connector (App) arasındaki fark nedir? Karar ağacı, destek matrisi ve güvenlik/maliyet karşılaştırması."
---

Kısa cevap: tekrarlayan bir görevi adım adım anlatan paketlenmiş bilgi için Skill, canlı bir sisteme veya veritabanına araç çağrısıyla erişmek için MCP (Model Context Protocol), hazır üçüncü taraf bir uygulamayı tek tıkla bağlamak için Connector (ChatGPT'de artık "App") kullanın. Üçü farklı sorunu çözüyor; biri diğerinin yerini tutmuyor.

## Skill, MCP ve Connector arasındaki temel fark nedir?

Skill, modelin bir görevi nasıl yapacağını anlatan talimat ve örnek dosyalarından oluşan bir pakettir ve modelin kendi bağlamında çalışır — dışarıya ağ çağrısı yapmaz. MCP ise bir istemcinin (Claude, bir IDE, bir ajan) dış bir sunucudaki araçları ve verileri canlı olarak çağırmasını sağlayan bir protokoldür; sunucu tarafında gerçek bir veritabanı, API ya da dosya sistemi vardır. Connector (App), bu ikisinin üstüne inşa edilmiş, kullanıcının kurulum yapmadan açıp kullandığı hazır bir entegrasyondur — çoğu zaman arka planda MCP çalışır.

Somut bir örnekle: "PR açıklaması nasıl yazılır" bilgisi bir Skill'dir; GitHub'daki gerçek bir PR'ı okuyup yorum eklemek bir MCP aracıdır; Slack'e bağlanıp o PR'ı bir kanala otomatik paylaşan hazır entegrasyon da bir Connector'dür.

## Claude, ChatGPT ve Gemini bu üçünü nasıl destekliyor?

Üç platform da aynı üç kavramı destekliyor ama farklı adlarla ve farklı olgunluk seviyelerinde. Claude, Skills ve MCP'yi doğrudan ilk sınıf vatandaş olarak sunuyor; ChatGPT, eski "connector" adını Aralık 2025'te "App" olarak değiştirdi ve Apps SDK üzerinden MCP destekli uygulamalar yayınlamayı öneriyor; Gemini ise Ekim 2026'da eski "Gems" özelliğini kademeli olarak "Skills" ile değiştirmeye başladı.

| Platform | Paketlenmiş bilgi (Skill) | Canlı araç/veri (MCP) | Hazır 3. parti entegrasyon |
|---|---|---|---|
| Claude | Agent Skills (yerel destek) | Yerel MCP istemcisi + sunucu desteği | Claude Code'da yönetilen MCP sunucuları |
| ChatGPT | — (Gems'e benzer özel GPT'ler) | Developer mode'da özel MCP sunucusu ekleme | "App" (eski adıyla Connector), Apps SDK |
| Gemini | Skills (Ekim 2026'dan itibaren Gems'in yerine) | Gemini Enterprise'da araç çağrısı | Workspace entegrasyonları |

[Model Context Protocol (MCP)](/tr/posts/model-context-protocol-nedir) yazımızda protokolün teknik detaylarını, [ilk MCP bağlayıcınızı yazma rehberinde](/tr/posts/ilk-mcp-baglayicini-yaz-2026) ise adım adım kurulumu bulabilirsiniz.

## Agent Skills neden artık açık bir standart?

22 Ekim 2026'da Anthropic, Agent Skills standardını Linux Foundation çatısı altındaki Agentic AI Foundation'a (AAIF) bağışladı; isim, logo, GitHub organizasyonu ve agentskills.io alan adının tamamı vakfa geçti. Anthropic'in kendi verilerine göre bu noktada standart, 1 milyona yakın yayınlanmış Skill ve 280 milyona yakın kurulumla, 70'ten fazla ajan platformu tarafından destekleniyordu — bağış, bu uyarlanmayı donduracak bir adım değil, tersine platformlar arası taşınabilirliği (portability) garanti altına almak için atıldı. Bu, Anthropic'in daha önce MCP'yi aynı vakfa bağışlamasıyla aynı deseni izliyor: önce standardı yayınla, benimsenmesini izle, sonra tarafsız bir kuruma devret.

Bu taşınabilirlik pratikte şu anlama geliyor: bugün Claude için yazdığınız bir Skill dosyası, standardı destekleyen başka bir platformda da (teoride) çalışabiliyor — çünkü format artık tek bir şirketin değil, bağımsız bir vakfın elinde.

## Hangi durumda Skill kullanmalısınız?

Görev tekrarlayan, adımları önceden bilinen ve dış bir sisteme canlı erişim gerektirmeyen bir işse Skill doğru seçimdir — örneğin "bu formatta haftalık rapor yaz" veya "bu stil kılavuzuna göre düzenle" gibi görevler. Skill dosyası tipik olarak şöyle görünür:

```yaml
name: weekly-report
description: Haftalık durum raporunu şirket şablonuna göre oluşturur
instructions: |
  1. Son 7 günün commit ve PR özetini al
  2. Şablondaki beş başlığa göre grupla
  3. Riskleri ayrı bir bölümde listele
```

Bu dosya modelin bağlamına yüklenir ve her çalıştırmada aynı adımları tekrar tekrar anlatmanıza gerek kalmaz; ama dosyadaki talimatların ötesinde hiçbir dış veriye kendi başına erişemez.

## Hangi durumda MCP kullanmalısınız?

Görev, modelin gerçek zamanlı bir veritabanını sorgulamasını, bir API'ye yazma yapmasını veya dosya sisteminde değişiklik yapmasını gerektiriyorsa MCP doğru araçtır. MCP sunucusu; araç adını, parametrelerini ve dönüş biçimini açık bir şema ile tanımlar, model bu şemayı okuyup doğru çağrıyı yapar. [Model Context Protocol (MCP) Nedir](/tr/posts/model-context-protocol-nedir) yazımızda bu şemanın nasıl çalıştığını ve araçların modele nasıl tanıtıldığını daha ayrıntılı ele alıyoruz.

MCP'nin 2026-07-28 güncellemesiyle çekirdek protokol durumsuz (stateless) hale geldi — bu, bir MCP sunucusunu yük dengeleyici arkasında birden fazla kopya halinde çalıştırmayı, oturum durumu senkronize etmeye gerek kalmadan mümkün kılıyor.

## Hangi durumda Connector (App) kullanmalısınız?

Hedef, kurulum veya kod yazmadan hazır bir üçüncü taraf hizmete (Slack, Google Drive, bir CRM) bağlanmaksa Connector/App doğru seçimdir. Bu, bir geliştiricinin MCP sunucusu kurup bakımını yapmasını gerektirmez; platformun kendi yönettiği, kullanıcının sadece yetki verdiği bir entegrasyondur. [Agent mı workflow mu](/tr/posts/ai-agent-mi-workflow-mu) kararında olduğu gibi, burada da soru "ne kadar kontrol istiyorum" sorusuna indirgeniyor: Connector hız ve kolaylık, özel bir MCP sunucusu ise tam kontrol sağlıyor.

## Üçünü aynı ajanda birlikte kullanmak mantıklı mı?

Evet, çoğu üretim ajanı aslında üçünü aynı anda kullanıyor: Skill, ajana "bu şirkette rapor nasıl yazılır" gibi sabit kuralları öğretirken; MCP, o raporun verisini canlı bir veritabanından çeker; Connector ise bitmiş raporu Slack'e gönderir. Örneğin bir destek ajanı, müşteri yanıtlama tonunu bir Skill dosyasından okuyabilir, açık bilet listesini MCP üzerinden Zendesk'ten çekebilir ve çözülen bileti bir Connector aracılığıyla otomatik olarak CRM'e işleyebilir — üç mekanizma da burada farklı bir katmanı karşılıyor, biri diğerinin eksiğini kapatmıyor.

Bu üçünü birbirinin alternatifi gibi görmek, ekiplerin en çok yaptığı hata. "MCP sunucusu kuralım, Skill'e gerek yok" diyen bir ekip, modelin her çalıştırmada aynı iş kurallarını yeniden tahmin etmesine izin veriyor; tam tersine "her şeyi Skill'e yazalım" diyen bir ekip de modelin asla gerçek zamanlı veriye dokunamadığı, sürekli eski bilgiyle çalıştığı bir sistem kurmuş oluyor.

## Güvenlik ve maliyet farkları nedir?

Skill'ler en düşük risk taşır çünkü dış ağ çağrısı yapmazlar; riskleri talimatların kalitesiyle sınırlıdır. MCP sunucuları en yüksek kontrolü ama en yüksek sorumluluğu getirir — hangi aracın hangi veriye erişebildiğini, en az yetki ilkesiyle siz tanımlarsınız ve her çağrının loglanması sizin işinizdir. Connector/App'ler bu yükü platforma devreder ama kontrolünüz de o kadar azalır; hangi verinin paylaşıldığını platformun gizlilik politikasına güvenerek kabul edersiniz.

Maliyet tarafında Skill'ler ek token maliyeti dışında neredeyse ücretsizdir, MCP sunucusu barındırma ve bakım maliyeti taşır, Connector ise genelde platformun kendi abonelik planına dahildir.

Kendi değerlendirmem: çoğu ekip bu üçünü birbirinin rakibi gibi görüp "hangisi daha iyi" diye soruyor, ama doğru soru "hangi görev için hangisi" olmalı — üçünü birlikte kullanan bir ajan mimarisi, tek bir mekanizmaya sıkışmış bir mimariden her zaman daha dayanıklı çıkıyor.

## Sıkça Sorulan Sorular

### Skill, MCP ve Connector arasındaki fark nedir?

Skill, modelin bağlamında çalışan paketlenmiş talimat ve örnek dosyasıdır; MCP, dış bir sunucudaki canlı araç ve veriye protokol üzerinden erişim sağlar; Connector (App) ise bu ikisinin üstüne inşa edilmiş, kullanıcının kurulum yapmadan açtığı hazır bir entegrasyondur.

### Agent Skills artık kime ait?

22 Ekim 2026'dan itibaren Agent Skills standardı, Linux Foundation çatısındaki Agentic AI Foundation'a (AAIF) ait; Anthropic ismi, logoyu, GitHub organizasyonunu ve agentskills.io alan adını vakfa devretti. Standart hâlâ ücretsiz ve açık.

### ChatGPT'de Connector'lara ne oldu?

OpenAI, "Connector" adını Aralık 2025'te "App" olarak değiştirdi; geliştiriciler bugün Apps SDK üzerinden MCP destekli uygulamalar yayınlıyor, kullanıcılar ise developer mode üzerinden özel bir MCP sunucu adresi ekleyebiliyor.

### Gemini'de Skills, Gems'in yerini mi alıyor?

Evet. Google, Ekim 2026'da Workspace'te (5 Ekim) ve Gemini uygulamasında (13 Ekim) Skills'i kademeli olarak devreye aldı; Gems özelliği Kasım 2026'dan itibaren ayarlar paneline taşınıyor ve kurumsal hesaplarda en erken Mart 2027'de tamamen kapatılacak.
