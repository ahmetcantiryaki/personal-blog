---
title: "Claude Code'da --restricted Modu Nedir?"
slug: "claude-code-restricted-mode-nedir"
translationKey: "claude-code-restricted-mode"
locale: "tr"
excerpt: "Claude Code'un --restricted bayrağı (v2.1.248+) komut ve kod araçlarını kaldırır, dosya erişimini çalışma dizinine kilitler, bypassPermissions'ı reddeder."
category: "ai"
tags: ["claude", "ci-cd", "web-security", "automation", "devops"]
publishedAt: "2026-08-28"
seoTitle: "Claude Code'da --restricted Modu Nedir?"
seoDescription: "Claude Code'un --restricted bayrağı (v2.1.248+) komut çalıştıran araçları kaldırır, dosya erişimini kısıtlar, CI için bypassPermissions'ı reddeder."
---

Kısa cevap: Claude Code'un `--restricted` modu, 27 Ağustos 2026'da yayımlanan v2.1.248 sürümüyle gelen bir CLI bayrağıdır ve oturumu paylaşılan veya otomatik makineler için kilitli başlatır. Komut ya da kod çalıştıran araçları kaldırır, dosya erişimini oturumun çalışma dizinleriyle sınırlar, kullanıcı ve proje seviyesindeki ayar dosyalarını yok sayar, `bypassPermissions` isteğini ise doğrudan reddeder.

## Claude Code'da --restricted Modu Nedir?

`--restricted`, `claude` komut satırı aracına eklenen bir başlatma bayrağıdır; oturum ortasında açılıp kapatılan bir anahtar değildir. Bayrağı Claude Code'u başlatırken verirsiniz ve oturumun tüm yaşam döngüsü boyunca ne yapabileceğini değiştirir. Anthropic bunu belirli bir sorun için tasarladı: `claude`'u paylaşılan bir makinede çalıştıran değerlendirme (eval) altyapıları ve CI hatları, ki bu makinedeki ayarların sahibi ile hattı çalıştıran kişi genellikle aynı değildir.

Buradaki temel fikir şu: bir `--restricted` oturumu keyfi komutlar çalıştıramamalı, kendisine açıkça verilmeyen kişisel ayarları okuyamamalı ve kendisine tanımlanan işin dışındaki dosyalara dokunamamalıdır. Bu, Claude Code'un diğer tüm izin modlarından farklı bir duruştur; çünkü diğer modlar oturumu çalıştıran kişinin, oturumun neye dokunabileceğine karar verecek kişi olduğunu varsayar.

## --restricted Modu Tam Olarak Neyi Kısıtlıyor?

`--restricted`, bayrak verildiği anda dört şeyi değiştirir ve dördü de varsayılan olarak devrededir. Birincisi, `--tools` içinde açıkça isim vermediğiniz sürece komut ya da kod çalıştıran her yerleşik aracı, ayrıca `WebFetch`'i kaldırır; `default` ön ayarını vermek bu araçları geri getirmez. İkincisi, dosya okuma ve yazma araçlarını oturumun çalışma dizinleriyle sınırlar, böylece kısıtlı bir oturum diskin başka bölümlerine geçemez. Üçüncüsü, yalnızca yönetilen (organizasyon seviyesindeki) ayarları ve `--settings` ile verdiğiniz her şeyi yükler; kullanıcı ve proje seviyesindeki ayar dosyalarını tamamen göz ardı eder. Dördüncüsü, `bypassPermissions` modunu ve `--dangerously-skip-permissions` bayrağını reddeder; `--restricted`'ı izin kontrollerini atlama isteğiyle birleştiremezsiniz, CLI bunu geri çevirir.

Bu son madde üzerinde durmaya değer: `--restricted` sadece daha sıkı bir varsayılan değil, bir tavandır. Hiçbir ayar dosyası, hiçbir bayrak kombinasyonu ve `default` ön ayarı kısıtlı bir oturumu tam komut ve kod erişimine geri yükseltemez.

## --restricted, Claude Code'un Diğer İzin Modlarıyla Nasıl Karşılaştırılır?

Claude Code bir süredir `default` (manuel), `plan`, `acceptEdits`, `dontAsk`/`auto` ve `bypassPermissions` gibi birkaç izin modu çalıştırıyor; `--restricted` ise bu yelpazede `bypassPermissions`'ın tam karşı ucunda duruyor.

| Mod | Sormadan Ne Çalışır | En Uygun Kullanım |
| --- | --- | --- |
| `default` (manuel) | Hiçbir riskli işlem; her komut veya yazma önce sorar | Klavye başında bir insanın olduğu etkileşimli oturumlar |
| `plan` | Hiçbir şey; Claude bir plan sunar, siz onaylamadan hiçbir düzenleme veya komut çalışmaz | Kod tabanına dokunmadan önce yaklaşımı gözden geçirmek |
| `acceptEdits` | Yalnızca dosya düzenlemeleri; komutlar hâlâ sorar | Komutları izleyen güvenilir bir insanla hızlı yinelemeli düzenleme |
| `dontAsk` / `auto` | Yapılandırılmış izin/red kurallarına göre çoğu araç çağrısı | Sormanın işi yavaşlatacağı güvenilir yerel iş akışları |
| `bypassPermissions` | Her şey, hiç sormadan | Yalnızca tamamen izole, tek kullanımlık ortamlar |
| `--restricted` | Yalnızca çalışma dizinine kilitli dosya araçları; komut/kod araçları açıkça isimlendirilmedikçe kaldırılır | CI çalıştırıcıları, eval altyapıları ve paylaşılan makinelerdeki denetimsiz oturumlar |

En önemli fark şu: `--restricted`'ın üstündeki her mod, güvenilen bir operatöre ne kadar soracağına karar verir. `--restricted` ise oturumu başlatan sürecin veya çalıştığı makinenin hiç güvenilir olmayabileceği varsayımından başlar; bu yüzden ne kadar sorduğunu ayarlamak yerine yeteneği doğrudan kaldırır.

## --restricted Ne Zaman Tercih Edilmeli?

`claude`'u tam olarak kontrol etmediğiniz bir altyapıda otomatik bir süreç çalıştırıyorsanız — paylaşılan bir CI çalıştırıcısı, üçüncü taraf bir eval altyapısı, bir notlandırma hattı veya başka kiracıların işlerini de çalıştıran bir build ajanı — `--restricted` kullanın. Bu bağlamlarda, ele geçirilmiş ya da kötü niyetli bir prompt'un keyfi shell komutları çalıştırmaya ya da başka bir işin ayarlarını okumaya yükselmemesi gerekir.

Kendi dizüstü bilgisayarınız veya tamamen güvendiğiniz, tek kiracılı, ayrılmış bir CI makinesi için `--restricted` daha az uygundur; orada `acceptEdits` veya `dontAsk` daha az sürtünmeyle daha çok iş yaptırır. `--restricted`, kolaylığı sabit bir yetenek tavanıyla takas eder ve bu takas ancak ortamın kendisinden emin olmadığınızda karşılığını verir.

Bu, Claude Code'un [kaçak ajanlara karşı getirdiği önlemlerin](/tr/posts/claude-code-kacak-ajanlara-fren) ve [kendi altyapınızda çalışan oturumlara](/tr/posts/claude-code-kendi-altyapinizda-calisan-oturumlar) doğru gidişinin arkasındaki aynı mantık: Claude Code kullanımının giderek daha fazlası terminal başındaki bir insandan, bir hattaki denetimsiz bir sürece kaydıkça varsayılan yaklaşım "operatöre güven"den "sanal alanın düşman olabileceğini varsay"a kaymak zorunda. [Auto modun](/tr/posts/claude-code-auto-mode-nasil-calisir) ne zaman uygun olduğunu tartıyorsanız, `--restricted` tam olarak auto modun fazla izin verici kalacağı durumlar için var.

## --restricted Modu Nasıl Etkinleştirilir?

`--restricted`, CLI bayraklarını kabul eden her Claude Code giriş noktasıyla çalışır; bunlara çoğu CI işinin ve eval altyapısının kullandığı etkileşimsiz `-p` (print) çağrıları da dahildir:

```bash
claude --restricted -p "query"
```

Belirli bir işin gerçekten komut çalıştıran bir araca ihtiyacı varsa — örneğin Bash üzerinden çağrılan bir test çalıştırıcısı — bunu açıkça isimlendirmeniz gerekir:

```bash
claude --restricted --tools Bash -p "run the test suite and report failures"
```

Burada `Bash`'i isimlendirmek yalnızca o aracı geri getirir; komut veya kod çalıştıran diğer tüm araçlar, ayrıca `WebFetch`, kaldırılmış kalır. `--tools default` vermek kısıtlamayı geçersiz kılmaz; dokümantasyon `default` ön ayarının `--restricted`'ı aşmak için bir arka kapı olmadığını açıkça belirtiyor.

## Bu Neden Ağustos 2026'da Önemli?

`--restricted` yeni ama hedeflediği risk yeni değil. Anthropic, Şubat 2026'da v2.1.53 öncesi Claude Code sürümlerini etkileyen [CVE-2026-33068'i](https://code.claude.com/docs/en/changelog) yamaladı: "Repo Kontrollü Ayar Dosyası Üzerinden Workspace Güven Diyaloğu Atlatma" olarak adlandırılan bu açıkta, kötü niyetli bir depo `permissions.defaultMode` değeri `bypassPermissions` olarak ayarlanmış bir `.claude/settings.json` dosyası commit edebiliyor, biri o depoyu ilk açtığında güven diyaloğunu sessizce atlatabiliyordu (CVSS 7.7, Yüksek). Bu hata eski bir haber; bu yayından aylar önce düzeltildi ve 27 Ağustos'ta gelen şey bu değil.

`--restricted`'ın eklediği şey, tam olarak o düzeltmenin daha güçlü bir devamı. CVE yaması bir depo ayar dosyasının izinleri sessizce *yükseltmesini* durdururken, `--restricted` bir adım daha ileri gidip bir oturumun proje veya kullanıcı seviyesindeki ayar dosyalarını hiç okumamasını sağlıyor; yalnızca yönetilen organizasyon politikasını ve `--settings` ile açıkça verilen her şeyi yüklüyor. Repo kontrollü bir ayar dosyası, kötü niyetli olsun ya da olmasın, `--restricted` bir oturuma artık hiç ulaşamıyor.

Kendi görüşüm şu: bu, denetimsiz çalışan her ajanik CLI aracı için doğru varsayılan olmalı ve daha fazlasının benzer bir mekanizma sunması gerekiyor. Bir eval altyapısı veya CI çalıştırıcısı, yapısı gereği bir ajana tam olarak kendisinin yazmadığı girdiyi besliyor — güvenilmeyen prompt'lar, güvenilmeyen depolar, hatta bazen [Claude'un eklenti ve skill güvenlik taramasının](/tr/posts/claude-skill-plugin-guvenlik-taramasi) kapsadığı güvenilmeyen eklentiler. [Friendly Fire RCE yazısında](/tr/posts/friendly-fire-claude-code-guvenlik-acigi) anlatılana benzer bir olaydan sonra kısıtlamaları sonradan eklemek yerine çalıştırma ortamını baştan itibaren düşman kabul etmek, ajanik araçların bir insanın kendi dizüstü bilgisayarından uzaklaşıp başkalarının altyapısına daha çok girdiği bu dönemde ihtiyaç duyduğu duruş. Modların tamamı için Anthropic'in [permission modes dokümanına](https://code.claude.com/docs/en/permission-modes) ve [CLI reference'ına](https://code.claude.com/docs/en/cli-reference) bakabilirsiniz; bu yazı diğer Claude Code içeriklerimizle birlikte [Yapay Zeka](/tr/category/yapay-zeka) kategorisinde yer alıyor.

## Sıkça Sorulan Sorular

### --restricted modu için hangi Claude Code sürümü gerekiyor?

27 Ağustos 2026'da yayımlanan Claude Code v2.1.248 veya sonrası gerekiyor. Daha eski sürümler `--restricted` bayrağını hiç tanımıyor, bu yüzden eski sürüme sabitlenmiş CI imajlarının ve eval altyapısı konteynerlerinin bu bayrağı kullanabilmesi için önce güncellenmesi gerekiyor.

### --restricted modunda bash komutu çalıştırabilir miyim?

Varsayılan olarak hayır; `--restricted`, `--tools` ile açıkça isimlendirmediğiniz sürece Bash dahil komut veya kod çalıştıran her yerleşik aracı kaldırır. `claude --restricted --tools Bash -p "..."` çalıştırmak yalnızca Bash'i geri getirir; komut ve kod çalıştıran diğer tüm araçlar, ayrıca `WebFetch`, kaldırılmış kalır.

### --restricted modu projemin .claude/settings.json dosyasını okur mu?

Hayır. `--restricted` yalnızca yönetilen (organizasyon seviyesindeki) ayarları ve komut satırında `--settings` ile verdiğiniz her şeyi yükler; kullanıcı ve proje seviyesindeki ayar dosyalarını tamamen göz ardı eder. Bu bir hata değil, bilinçli bir tasarım tercihi; repo kontrollü bir ayar dosyasının kısıtlı bir oturumu hiç etkileyememesini sağlıyor.

### --restricted, ekstra loglama yapan bypassPermissions ile aynı şey mi?

Hayır, tam tersi. `bypassPermissions` her araç çağrısını hiç sormadan çalıştırır; `--restricted` ise `bypassPermissions` modunda başlamayı doğrudan reddeder ve `--dangerously-skip-permissions` bayrağını geri çevirir, dolayısıyla kısıtlı bir oturuma izin kontrollerini atlaması asla söylenemez.
