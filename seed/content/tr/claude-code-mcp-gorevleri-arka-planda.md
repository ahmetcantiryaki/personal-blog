---
title: "Claude Code'da MCP Görevleri Artık Arka Planda mı Çalışıyor?"
slug: "claude-code-mcp-gorevleri-arka-planda"
translationKey: "claude-code-mcp-tasks-background-2026"
locale: "tr"
excerpt: "Kısa cevap: evet. Claude Code 2.1.319, bir MCP sunucusunun görev olarak çalıştırdığı çağrıyı arka plana alıyor ve bitince sonucu bildiriyor."
category: "ai"
tags: ["claude", "mcp", "ai-tools", "automation"]
publishedAt: "2026-11-11"
seoTitle: "Claude Code MCP Görevleri Arka Planda Çalışıyor mu?"
seoDescription: "6 Kasım 2026'daki 2.1.319 güncellemesiyle Claude Code, MCP sunucusu görevlerini terminali kilitlemeden arka planda çalıştırıyor. Değişen tam olarak bu."
---

Kısa cevap: evet. Claude Code'un 6 Kasım 2026'da yayınlanan 2.1.319 sürümü, bir MCP sunucusunun "görev" (task) olarak işaretlediği araç çağrısını anında arka plana alıyor; Claude, çağrı bitince sonucu konuşmaya geri alıyor ve bu sırada terminal kilitlenmiyor.

Bu değişiklik, MCP sunucusu kullanan herkesi etkiliyor: uzun süren bir arama, bir dağıtım tetikleme çağrısı veya bir harici API isteği artık oturumu dondurmuyor. [MCP sunucularını Claude Code'da nasıl yönettiğinize](/tr/posts/claude-code-mcp-sunucularini-nasil-yonetirsin) dair rehberimizde ele aldığımız kurulum adımları aynı kalıyor; değişen, bir araç çağrısı çalışırken oturumunuzun davranışı.

## MCP "Görevi" Tam Olarak Nedir?

MCP görevi, bir MCP (Model Context Protocol) sunucusunun bir araç çağrısını anlık yanıt beklemeden, ayrı bir iş birimi olarak çalıştırmasıdır. Sunucu bu çağrıyı "task" olarak işaretlediğinde Claude Code onu normal bir senkron araç çağrısı gibi değil, sonucu sonra gelecek bir iş olarak ele alır. Bu, özellikle dakikalar sürebilen işlemlerde (büyük bir kod tabanını tarama, bir CI pipeline'ını tetikleme, harici bir servisten rapor üretme) fark yaratıyor.

## Bu Değişiklik Öncesinde Ne Oluyordu?

2.1.319'dan önce Claude Code, bir MCP araç çağrısı tamamlanana kadar o çağrıyı ön planda bekletiyordu; siz de sonuç gelene kadar terminalde oturumun "düşünüyor" durumunda kilitli kalmasını izliyordunuz. Bu modelin bir ara adımı zaten 2.1.212 sürümünde geldi: ana konuşmadaki bir MCP çağrısı iki dakikayı geçtiğinde otomatik olarak arka plana alınmaya başlandı, eşik değeri `CLAUDE_CODE_MCP_AUTO_BACKGROUND_MS` ile ayarlanabiliyordu. 2.1.319, bu davranışı sunucunun kendi "task" işaretlemesiyle tetiklenen, süre eşiğine bağlı olmayan bir mekanizmaya genişletti.

## 2.1.319 Tam Olarak Neyi Değiştirdi?

Bir MCP sunucusu bir araç çağrısını görev olarak çalıştırdığında Claude Code artık onu hemen arka plana taşıyor ve işlem bitince Claude'a sonucu bildiriyor; siz bu sırada aynı oturumda başka bir şey yazabiliyorsunuz. Sunucu tarafında ek bir yapılandırmaya gerek yok — davranış, sunucunun MCP protokolü üzerinden görevi nasıl işaretlediğine bağlı. Aynı sürüm, `permissions.denyInsteadOfPrompting` ayarını da getirdi: bu ayar açıkken, normalde izin istemi bekleyecek bir araç çağrısı beklemeden reddediliyor ve tur devam ediyor — otomasyon hatlarında donmayı önlemek için düşünülmüş bir güvenlik valfi.

## Eski Davranışa Nasıl Geri Dönülür?

Arka plana almayı tamamen kapatmak veya eski bekleme davranışına dönmek isteyenler için iki ortam değişkeni var:

```bash
# Görevi arka plana almak yerine araç çağrısı içinde bekle
export CLAUDE_CODE_DISABLE_MCP_TASK_BACKGROUND=1

# MCP görev desteğini tamamen kapat
export CLAUDE_CODE_DISABLE_MCP_TASKS=1
```

İlk değişken sadece bu sürümle gelen anında arka plana alma davranışını devre dışı bırakıyor; ikincisi özelliğin tümünü kapatıyor. İki dakikalık otomatik arka plana alma eşiğini (2.1.212'den gelen) değiştirmek isterseniz `CLAUDE_CODE_MCP_AUTO_BACKGROUND_MS` değişkeni hâlâ geçerli.

## MCP Sunucusu Geliştirenler İçin Ne Değişiyor?

Bir MCP sunucusu yazıyorsanız, uzun süren işlemleri görev olarak işaretlemek artık kullanıcı deneyimini doğrudan iyileştiriyor: kullanıcı oturumu kilitlenmeden beklemeye devam edebiliyor. Daha önce bu tür işlemler ya istemci tarafında manuel bir zaman aşımı mantığı gerektiriyordu ya da kullanıcıyı dakikalarca terminalin önünde tutuyordu. Şimdi sunucu tarafı işaretleme tek başına yeterli; istemci (Claude Code) tarafı davranışı otomatik yönetiyor.

| Davranış | 2.1.212 öncesi | 2.1.212 (süre eşiği) | 2.1.319 (görev işaretli) |
| --- | --- | --- | --- |
| Tetikleyici | Yok, her çağrı senkron | 2 dakikayı geçen çağrı | Sunucunun "task" işareti |
| Ayarlanabilir mi | - | `CLAUDE_CODE_MCP_AUTO_BACKGROUND_MS` | `CLAUDE_CODE_DISABLE_MCP_TASK_BACKGROUND` |
| Oturum kilitleniyor mu | Evet | Sadece ilk 2 dakika | Hayır, anında arka plana alınır |
| Tamamen kapatılabilir mi | - | Kısmen | `CLAUDE_CODE_DISABLE_MCP_TASKS=1` |

## Pratikte Bu Nasıl Bir Fark Yaratıyor?

Diyelim ki bir MCP sunucusu üzerinden bir CI pipeline'ını tetikliyorsunuz ve pipeline'ın bitmesi üç dakika sürüyor. 2.1.212 öncesinde Claude Code bu üç dakika boyunca terminalde kilitli kalırdı; siz de başka bir komut yazamazdınız. 2.1.212 ile birlikte iki dakikayı geçen bu çağrı otomatik olarak arka plana alınmaya başladı, ama tetikleyici hâlâ bir süre eşiğiydi — sunucunun kendisi işlemi "uzun sürecek" diye işaretlemiyordu, Claude Code sadece saati tutuyordu. 2.1.319 ile bu mantık tersine döndü: sunucu, pipeline çağrısını baştan bir görev olarak işaretlerse, çağrı bir saniye bile sürse arka plana alınır ve siz aynı anda başka bir dosyayı düzenlemeye devam edebilirsiniz. Süre eşiği hâlâ devrede, ama artık sunucunun niyeti öncelikli sinyal.

Bu, özellikle paralel iş akışlarında fark yaratıyor: bir ajan hem bir dağıtım betiğini tetikleyip hem de aynı anda kod tabanında bir refactor üzerinde çalışabiliyor, çünkü dağıtım çağrısı arka planda beklerken ön plan bloke olmuyor.

## MCP Sunucusu Geliştirenler İçin Ne Değişiyor?

Bir MCP sunucusu yazıyorsanız, uzun süren işlemleri görev olarak işaretlemek artık kullanıcı deneyimini doğrudan iyileştiriyor: kullanıcı oturumu kilitlenmeden beklemeye devam edebiliyor. Daha önce bu tür işlemler ya istemci tarafında manuel bir zaman aşımı mantığı gerektiriyordu ya da kullanıcıyı dakikalarca terminalin önünde tutuyordu. Şimdi sunucu tarafı işaretleme tek başına yeterli; istemci (Claude Code) tarafı davranışı otomatik yönetiyor. Bunun pratik sonucu şu: bir arama indeksleme aracı, bir rapor üretme servisi veya bir veri işleme hattı yazan geliştiriciler, kendi protokol katmanlarında "bu iş uzun sürecek" bilgisini taşımaya başladıkları anda, istemci tarafında ekstra kod yazmadan arka plana alma davranışını bedavaya alıyor. Sunucunun wall-clock zaman aşımı sınırı değişmiyor; değişen sadece istemcinin bu süre boyunca oturumu nasıl ele aldığı.

## Aynı Sürümle Gelen Diğer Değişiklikler Neler?

2.1.319, MCP görevleri dışında üç değişiklik daha getirdi: `permissions.denyInsteadOfPrompting` ayarı yukarıda anlattığımız gibi izin beklemeden reddetme imkânı veriyor; LLM ağ geçitleri (gateway) arkasında çalışan oturumlarda auto mode'un davranışı sıkılaştırıldı — sunucunun kontrol edemediği çağrılar artık sorulmadan onaylanmıyor; ve `/claude-api latency-optimize` komutu, Claude API kodunuzda kullanıcıyı bekleten noktaları buluyor. [Auto mode'un nasıl çalıştığını anlattığımız yazı](/tr/posts/claude-code-auto-mode-nasil-calisir), bu izin-reddetme davranışının genel çerçevesini anlamak için iyi bir tamamlayıcı.

Açıkçası bu, Claude Code'un son aylardaki en "sessiz" ama en pratik güncellemelerinden biri — manşetlik bir model lansmanı değil, ama her gün bir MCP sunucusuyla çalışan birinin terminalde geçirdiği süreyi doğrudan kısaltan bir değişiklik. Büyük model duyurularının gölgesinde kalan bu tür altyapı iyileştirmeleri, günlük iş akışında çoğu zaman daha fazla fark ediliyor.

## Sıkça Sorulan Sorular

### Claude Code'da MCP görevi ne zaman arka plana alınır?

Bir MCP sunucusu bir araç çağrısını protokol üzerinden "task" olarak işaretlediğinde, Claude Code 2.1.319 ve sonrasında bu çağrı anında arka plana alınır; ayrıca 2.1.212'den beri iki dakikayı geçen her MCP çağrısı da otomatik olarak arka plana taşınır.

### MCP görevlerini arka plana almayı nasıl kapatırım?

`CLAUDE_CODE_DISABLE_MCP_TASK_BACKGROUND=1` ortam değişkenini ayarlarsanız Claude Code, görev olarak işaretlenmiş çağrıları da doğrudan araç çağrısı içinde bekler; MCP görev desteğinin tamamını kapatmak için `CLAUDE_CODE_DISABLE_MCP_TASKS=1` kullanılır.

### Bu değişiklik mevcut MCP sunucularımı bozar mı?

Hayır, davranış istemci (Claude Code) tarafında yönetiliyor ve sunucu tarafında ek bir kod değişikliği gerektirmiyor; bir sunucu zaten görev işaretlemesi kullanıyorsa yeni sürümle otomatik olarak arka plana alınma avantajını kazanır, kullanmıyorsa eski senkron davranış sürer. Mevcut bir entegrasyonu kırmayan, sadece davranışı iyileştiren bir güncelleme olarak düşünebilirsiniz.

### `permissions.denyInsteadOfPrompting` ne işe yarar?

Bu ayar açıkken, normalde kullanıcıdan izin isteyecek bir araç çağrısı, izin istemi beklenmeden otomatik olarak reddedilir ve Claude turu bu reddi göz önünde bulundurarak sürdürür; özellikle gözetimsiz çalışan otomasyon hatlarında oturumun donmasını önlemek için eklendi.
