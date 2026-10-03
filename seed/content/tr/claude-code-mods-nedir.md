---
title: "Claude Code Mods Nedir? Ajanı Yeniden Yazan Eklentiler"
slug: "claude-code-mods-nedir"
translationKey: "claude-code-mods-explained-2026"
locale: "tr"
excerpt: "Claude Code mod'ları, 1 Ekim 2026'da v2.1.287 ile gelen eklentilerdir; araç çağrısını durdurabilir, prompt'u yeniden yazabilir, arayüzü değiştirebilir."
category: "ai"
tags: ["claude", "ai-coding", "automation", "developer-experience"]
publishedAt: "2026-10-03"
seoTitle: "Claude Code Mods Nedir? Kurulum, API ve Güvenlik"
seoDescription: "Claude Code mod'ları, sürecin içinde çalışan, prompt ve araç çağrılarını değiştirebilen eklentilerdir. v2.1.287'den (Ekim 2026) itibaren nasıl çalışıyorlar?"
---

Kısa cevap: Claude Code mod'u, Claude Code sürecinin içinde çalışan JavaScript veya TypeScript olay işleyicilerinden oluşan bir eklentidir. 1 Ekim 2026'da 2.1.287 sürümüyle gelen bir mod, bir araç çağrısını çalışmadan önce durdurabilir, Claude'un okuduğu prompt'u yeniden yazabilir, arayüzün bir kısmını yeniden çizebilir veya kendi komutlarını ekleyebilir — bunların hepsi, sürecin dışında çalışan bir settings hook, skill veya MCP sunucusunun yapamayacağı şeyler.

## Claude Code mod'u nedir?

Mod, kodu "hook" denen olay işleyicilerini kaydeden bir eklentidir; eşleşen bir olay (bir araç çağrısı, gönderilen bir prompt, arayüzün bir parçasının çizilmesi) tetiklendiğinde Claude Code o işleyiciyi çağırır. İşleyici Claude Code'un kendi süreci içinde çalıştığı için olayı sadece izlemekle kalmaz; değiştirebilir veya olağan davranışın yerine kendi cevabını verebilir.

Minimal bir mod üç dosyadan oluşur: `.claude-plugin/plugin.json` manifestosu, `hooks/hooks.json` yönlendirmesi ve `register(on)` fonksiyonunu dışa veren `hooks/register.js` giriş noktası. Anthropic'in kendi dokümantasyonu, araç çağrılarını sayan ve toplam sayıyı spinner'ın yanında gösteren tam çalışan bir örneği yaklaşık on satırla veriyor.

## Mod'lar, settings hook, skill ve MCP sunucusundan farklı mı?

Evet — dördü de benzer sorunları farklı erişim seviyeleriyle çözüyor. Settings hook, bir ayar dosyasında tanımladığın bir shell komutu veya HTTP isteğini çalıştırır; skill, Claude'un okuduğu bir Markdown talimat dosyasıdır; MCP sunucusu, Claude'a yeni araçlar veren harici bir süreçtir. Mod, bu dördü arasında Claude Code'un sürecinin içinde çalışan ve kendi arayüzünü çizebilen tek seçenektir.

| | Mod | Settings hook | Skill | MCP sunucusu |
|---|---|---|---|---|
| Çalışma yeri | Claude Code sürecinin içinde | Dışarıda, script veya istek olarak | Yok — talimat olarak okunur | Dışarıda, ayrı bir sunucu olarak |
| Arayüz çizebilir mi | Evet (panel, bant, buton) | Hayır | Hayır | Hayır |
| Araç çağrısını değiştirebilir mi | Evet | Sınırlı (izin ver/reddet/kaydet) | Hayır | Hayır |
| Yazıldığı dil | JavaScript/TypeScript | Script için herhangi bir dil | Markdown | Herhangi bir dil |
| En uygun olduğu durum | Özel panel, olay değiştirme, yeni komut | Elindeki script ile engelleme/kayıt | Sürekli yapıştırdığın talimatlar | Claude'a harici sisteme erişim vermek |

Anthropic'in kendi dokümantasyonundaki pratik kural şu: elinde iş gören bir script varsa önce settings hook'u dene; bir şey çizmen veya bir olayın verisini değiştirmen (sadece izin verip reddetmek değil) gerekiyorsa mod'a yönel.

## Bir mod gerçekte ne yapabilir?

Bir mod, bir araç çağrısını durdurup çalışmadan önce kullanıcıya soru sorabilir, araç çağrısını hiç çalıştırmadan kendi cevabını verebilir, bir turun isteğini farklı bir modele yönlendirebilir veya Claude bir görevin ortasındayken bile anında çalışan bir slash komutu ekleyebilir. Bunların hepsini, her hook'un aldığı `$` nesnesi — mod API'si — üzerinden yapar; bu nesne `$.ui`, `$.fs`, `$.http`, `$.model` gibi isim alanlarını içerir.

```javascript
// hooks/register.js — araç çağrılarını sayar ve toplamı spinner'ın yanında gösterir
let calls = 0

export function register(on) {
  on('tool.call', async ($, e, next) => {
    calls += 1
    $.ui.invalidate('ui.render')
    return next(e)
  })

  on('ui.render', { component: 'Spinner' }, async ($, e, next) => {
    return next({ ...e, props: { ...e.props, suffix: ' · tool calls: ' + calls + '…' } })
  })
}
```

Bu, Anthropic'in dokümantasyonundaki örneğin aynısı: ilk hook her araç çağrısında paylaşılan bir sayacı bir artırıyor, ikinci hook ise spinner'ın metnini bu sayıyı gösterecek şekilde yeniden yazıyor — Claude çalışırken "Thinking…" yazısı "Thinking · tool calls: 3…" hâline geliyor.

## Claude Code mod'larını kurmak güvenli mi?

Hayır — doğası itibarıyla değil ve Anthropic bunu açıkça söylüyor: bir mod, kullanıcının tam yetkileriyle çalışır, sandbox'lanmamıştır; dosya okuyup yazabilir, süreç başlatabilir, ağ isteği gönderebilir, ortam değişkenlerini ve API anahtarlarını okuyabilir, kendi araç çağrısını sana sormadan onaylayabilir. [Claude Code'un sandbox'ını](/tr/posts/claude-code-restricted-mode-nedir) açmak Claude'un çalıştırdığı Bash komutlarını izole eder ama bir mod'un başlattığı süreç bu sandbox'ın tamamen dışında çalışır.

Bir mod'u kurmadan önce kaynağı üzerinde `claude plugin validate ./some-mod` komutunu çalıştırmak, mod'u hiç çalıştırmadan hangi olayları ele aldığını ve hangi mod API çağrılarını (okuma, yazma, ağ isteği) yaptığını listeler. Bu denetim adımı, normal bir [Claude Code eklentisinden](/tr/posts/claude-code-eklentileri-kur-paketle-paylas) daha önemli, çünkü bir mod'un erişimi tasarım olarak daha geniş. Anthropic'in [skill ve plugin güvenlik taraması](/tr/posts/claude-skill-plugin-guvenlik-taramasi) ise ilişkili ama ayrı bir riski kapsıyor: bir skill veya plugin manifestosundaki kötü niyetli talimatları yakalıyor, mod'un yüklendikten sonraki çalışma zamanı davranışını değil.

## Claude Code'a hangi mod'lar yerleşik olarak geliyor?

Beş mod yerleşik geliyor ve kaldırılamıyor, sadece `/plugin` üzerinden tek tek devre dışı bırakılabiliyor: `cc-plugin-agents-md` AGENTS.md'yi proje talimatı olarak yüklüyor, `cc-plugin-diff` `/diff` panelini çalıştırıyor, `cc-plugin-sec-default` kullanıcının kurduğu mod'lara karşı kurumun yönettiği ayarları koruyor, `cc-plugin-telemetry` Claude Code'un kendi analitik verilerini gönderiyor; varsayılan olarak kapalı gelen `cc-plugin-you-should-know` uzun bir görev sırasında arka planda çalışan bir yan ajan olarak kaçırabileceğin bir şeyi fark ettiğinde prompt'un üzerine bir not çıkarıyor. Bunların birkaçının kaynak kodu `claude-code` GitHub deposunun `mods` klasöründe açık; kendi mod'unu yazmak isteyenler için çalışan bir referans olarak da kullanılabiliyor.

## Mod'lar hangi sırayla çalışır?

Bir oturumda birden fazla mod yüklüyse, her biri dört seviyeden birinde (`prepend`, `user`, `append`, `builtin`) çalışır ve olaylar bu sıraya göre işlenir. Kurumun yönettiği `prependPlugins` listesindeki mod'lar, kullanıcının kendi kurduğu her mod'dan önce çalışır; `appendPlugins` listesindekiler ise hepsinden sonra. Bu sıralama, bir kurumun kendi güvenlik politikasını (örneğin `cc-plugin-sec-default`) kullanıcının kurduğu bir mod'un ezemeyeceği şekilde en önce çalıştırmasını sağlıyor — aksi halde kullanıcı tarafından kurulan bir mod, kurumun koyduğu bir `deny` kuralını `allowModsToOverrideDenyRules` ayarı açık değilse atlayamaz.

Bu sıralama aynı zamanda hata ayıklamayı da kolaylaştırıyor: bir olayın beklenmedik şekilde değiştiğini fark ettiğinde, hangi mod'un hangi sırada çalıştığını bilmek, sorunu bulmak için ilk bakılacak yer oluyor. `claude plugin validate` çıktısındaki `hooks:` satırı, bir mod'un hangi olaylara abone olduğunu gösterirken, çalışma sırası `/plugin` ekranındaki liste sırasıyla eşleşiyor.

## Şimdi bir mod kurmalı mısın?

Kendi terminalini özelleştiren bağımsız bir geliştirici için risk, güvendiğin kaynağa oranlı: tanıdığın bir marketplace'den kur, önce doğrula, zarar en fazla kendi makinenle sınırlı kalır. Bir ekip için hesap değişiyor: bir mod, [Claude Code'un MCP bağlantılarıyla](/tr/posts/claude-code-mcp-sunucularini-nasil-yonetirsin) aynı erişime sahip ama sandbox sınırı yok — Anthropic'in bu özellikle birlikte `allowManagedModsOnly` ve `prependPlugins` ayarlarını da getirmesinin nedeni tam olarak bu. [Auto mode'un sınıflandırıcı davranışını](/tr/posts/claude-code-auto-mode-siniflandirici-ucreti-kalkti) zaten kilitlemiş bir kurum, mod onayını tek bir makinenin ötesine yaymadan önce aynı ciddiyetle ele almalı.

Özelliğin kendisi gerçek bir boşluğu kapatıyor: sürecin içinden arayüzü yeniden çizmek ve olayları yakalamak, bir eklenti yazarı için daha önce mümkün değildi. Ama artık birçok mühendisin günlük iş akışının merkezinde olan bir araçta "varsayılan olarak sandbox'lanmamış" demek, dokümandaki bir uyarı notundan daha fazlasını — bir politikayı — gerektiren bir ödünleşim.

## Sıkça Sorulan Sorular

### Claude Code mod'ları ne zaman yayınlandı?

Mod'lar, 1 Ekim 2026'da yayınlanan Claude Code 2.1.287 sürümüyle geldi ve bu sürümden itibaren varsayılan olarak açık. Hangi sürümde olduğunu görmek için `claude --version` komutunu çalıştır.

### Claude Code mod'ları sandbox'lı mı?

Hayır. Bir mod, Claude Code'u çalıştıran kullanıcının yetkileriyle çalışır ve sandbox'lanmamıştır — dosya okuyup yazabilir, süreç başlatabilir ve Claude Code'un kendi Bash komutlarının kullandığı sandbox'ın dışında ağ isteği gönderebilir. Mod'ları sadece güvendiğin kaynaklardan kur.

### Oturumumda hangi mod'ların aktif olduğunu nasıl görürüm?

Claude Code prompt'unda `/plugin` komutunu çalıştır. Sekmelerin altındaki satır, yerleşik olmayan aktif mod'ların sayısını ve adlarını gösterir, örneğin "1 mod active · first-mod". Yerleşik mod'lar Installed sekmesi altında ayrıca listelenir.

### Mod ile normal bir Claude Code eklentisi arasındaki fark ne?

Mod, Claude Code'un kendi süreci içinde çalışan JavaScript veya TypeScript olay işleyicileri kaydeden belirli bir eklenti türüdür. Mod içermeyen bir eklenti de skill, komut, ajan veya MCP sunucusu taşıyabilir; ama bunların hiçbiri sürece doğrudan dokunmaz veya bir mod'un yapabildiği şekilde arayüzü yeniden çizemez.
