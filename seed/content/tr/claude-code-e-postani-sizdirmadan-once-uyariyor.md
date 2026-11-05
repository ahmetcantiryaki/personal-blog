---
title: "Claude Code E-postanı Sızdırmadan Önce Artık Uyarıyor"
slug: "claude-code-e-postani-sizdirmadan-once-uyariyor"
translationKey: "claude-code-permission-safeguards-nov-2026"
locale: "tr"
excerpt: "Claude Code 2.1.317, bir web veya shell araç çağrısı e-posta adresini ağa göndermeden önce onay istiyor; Ekim 2026 sonundan iki izin değişikliği daha eklendi."
category: "ai"
tags: ["claude", "ai-coding", "ai-agents", "web-security"]
publishedAt: "2026-11-05"
seoTitle: "Claude Code'un Yeni İzin Güncellemeleri (Kasım 2026)"
seoDescription: "Claude Code 2.1.317, hesap e-postanı ağa göndermeden önce onay istiyor; 2.1.314 ise çalışma dizini dışına yazmayı her izin modunda engelliyor."
---

Evet. Claude Code 2.1.317 sürümünden (3 Kasım 2026) itibaren CLI, bir web veya shell araç çağrısı hesap e-posta adresini ağa göndermeden önce onay istiyor. Bu değişiklik, daha sıkı bir yazma yolu koruması ve eskiden düz bir reddetmeyle sonuçlanan işaretlenmiş isteklere getirilen bir düzeltmeyle aynı haftada geldi.

## Claude Code E-postanı Sızdırmadan Önce Uyarıyor mu?

Kısa cevap: evet, 2.1.317 sürümünden beri — [Claude Code'un resmi changelog'unda](https://code.claude.com/docs/en/changelog) belgelendiği gibi. Bu sürümden önce, bir ajanın araç çağrısı isteğin gövdesinde hesap e-postanızı içeriyorsa — bir webhook yükü, bir curl komutu, bir form gönderimi — bu veri ikinci bir kontrolden geçmeden ağa gidiyordu. Değişiklik, tam olarak bu durum için bir onay istemi ekliyor ve e-posta adresini makinenizden çıkmadan önce yakalıyor, çıktıktan sonra değil. Dar kapsamlı bir koruma bu: araç çağrısının dokunabileceği her kişisel veriyi değil, sadece kendi hesap e-postanızı izliyor — yani yaygın bir sızıntı yolunu kapatıyor, hepsini değil.

Aynı sürüm sessizce iki şeyi daha sıkılaştırdı. Agent SDK hook'ları `onFailure: "block"` seçeneğine kavuştu; artık başarısız olan bir hook, varsayılan olarak korumakta olduğu işlemin devam etmesine izin vermek yerine onu durduruyor. Bu, önceki davranışın tam tersi: eskiden bir hook betiği çökerse veya zaman aşımına uğrarsa, perde arkasındaki işlem genelde sessizce devam ediyordu. Claude Code Gateway'e de `GET /v1/organizations/analytics/cost` adında bir maliyet raporlama ucu eklendi — Claude Code'u kendi altyapıları üzerinden proxy'leyen ve logları kazımadan kullanım rakamlarına ulaşmak isteyen ekipler için.

## `permissions.blockWritesOutsideWorkingDirectories` Gerçekte Neyi Engelliyor?

Çalışma dizinlerinizin dışındaki bir yolu hedefleyen Write, Edit ve NotebookEdit araç çağrılarını engelliyor — `bypassPermissions` dahil, her izin modunda. Üzerinde durulmaya değer ayrıntı tam olarak bu: Claude Code 2.1.314'ten (30 Ekim 2026) önce, bypass modunda çalışmak tam olarak bunu ifade ediyordu — diskte hiçbir yerde hiçbir koruma yok. Şimdi bypass modunda hayatta kalan bir koruma var, çünkü bir ajanın davet edildiği projenin dışındaki dosyaları düzenlemesi, bir insanın her adımı onaylayıp onaylamadığından bağımsız, kendi başına bir hata türü.

Ayar, `.claude/settings.json` içinde `permissions` altında yaşıyor:

```json
{
  "permissions": {
    "blockWritesOutsideWorkingDirectories": true
  }
}
```

Bu açıkken, `/etc/hosts` dosyasını veya komşu bir repoyu düzenlemeye yönelik bir araç çağrısı onay istemeden doğrudan reddedilir — onaylanacak hiçbir şey yoktur, çünkü yazma işlemi normalde soracak olan izin kontrolüne hiç ulaşmaz.

| Değişiklik | Yayın | Kapsadığı araçlar | Eski davranış | Yeni davranış |
|---|---|---|---|---|
| E-posta sızıntısı onayı | v2.1.317 (3 Kas) | Web/shell araç çağrıları | Hesap e-postası bir istek içinde sessizce gönderilebiliyordu | Önce onay isteniyor |
| `blockWritesOutsideWorkingDirectories` | v2.1.314 (30 Eki) | Write, Edit, NotebookEdit | `bypassPermissions` altında çalışma dizini dışına izin veriliyordu | Her modda çalışma dizini dışı engelleniyor |
| İşaretlenmiş istek yedeği | v2.1.314 (30 Eki) | İncelemeye alınan istekler | Sadece eski bir Opus modeli erişilebilirse düz reddetmeyle sonuçlanıyordu | Otomatik olarak başka bir modelde yeniden deneniyor |

## İşaretlenmiş Bir İstek Sadece Eski Bir Opus Modeline Ulaşabiliyorsa Ne Olur?

Reddetmek yerine başka bir modelde yeniden deniyor. Claude Code, sunmadan önce bazı istekleri ekstra inceleme için işaretliyor; o anda erişilebilen tek model eski bir Opus sürümüyse, istek eskiden yedeksiz bir reddetmeyle sonuçlanıyordu. 2.1.314'ten beri aynı durum, erişilebilen başka bir modele karşı otomatik bir yeniden deneme tetikliyor; böylece bir yönlendirme tuhaflığı kullanıcıya ajanın basitçe "hayır" demesi gibi görünmüyor.

Bu, bir güvenlik düzeltmesinden çok küçük bir güvenilirlik düzeltmesi, ama diğer ikisiyle aynı nedenden önemli: kafa karıştırıcı bir şekilde başarısız olan bir ajan — sessiz bir sızıntı, kimsenin onaylamadığı bir yazma, açıklamasız bir reddetme — bir ekibin ona herhangi bir özerklik vermesi için gereken güveni yiyor. [Claude Code'un model yedekleme davranışı](/tr/posts/opus-4-8-fast-mode-ne-zaman-kaldiriliyor), Anthropic eski Opus sürümlerini varsayılan erişilebilirlikte yıl boyunca içeri alıp çıkarırken hareketli bir hedef oldu; bu düzeltme de altyapının bu çalkantıya yetişmesinin bir örneği daha.

## Bu Korumalar Nasıl Açılır?

E-posta sızıntısı onayı ve işaretlenmiş istek yedeği varsayılan olarak açık — yapılandıracak bir şey yok. `blockWritesOutsideWorkingDirectories` burada tek opt-in ayar ve diskte birden fazla repoya dokunan, özellikle ilgisiz kişisel ya da müşteri dizinlerinin yanında oturan bir monorepo checkout'u gibi her Claude Code oturumu için açmaya değer. [Gateway üzerinden Bedrock, Vertex veya kendi barındırdıkları bir proxy ile](/tr/posts/claude-code-monitor-araci-bedrock-vertex-foundryda) Claude Code çalıştıran ekipler, bunu her geliştiricinin kendi makinesinde açmasına güvenmek yerine paylaşılan ayar dosyasında organizasyon seviyesinde ayarlamalı.

Ayarı kullanıcı seviyesinde `~/.claude/settings.json`'a mı, yoksa proje seviyesinde `.claude/settings.json`'a mı yazacağınız da sonucu değiştiriyor. Proje dosyası genelde versiyon kontrolüne girer ve ekibin tamamına aynı korumayı dayatır; kullanıcı dosyası ise sadece kendi makinenizde geçerlidir ve farklı projeler arasında taşınmaz. Birden fazla repo üzerinde çalışan bir ekip için en güvenli varsayılan, ayarı her iki seviyede de aynı değerle tutmak — biri unutulsa bile diğeri korumayı canlı tutar.

## Kasım 2026'nın İlk Haftasında Başka Ne Değişti?

Aynı haftadan güvenlikten çok operasyonel olan iki küçük madde: v2.1.318 (4 Kasım), Claude Code Gateway dağıtımlarının çok hesaplı kurulumlarda AWS harcamasını doğru hesaba atfedebilmesi için `assume_role` desteği ekledi; `claude auth status` ise artık `loginExpiresAt` döndürüyor, böylece betikler bir API çağrısının başarısız olmasını beklemeden oturum süresinin dolup dolmadığını kontrol edebiliyor. Anthropic, her patch seviyesindeki changelog girdisini okumak istemeyenler için [release notes özetinde](https://docs.claude.com/en/release-notes/overview) de paralel bir liste tutuyor.

## Hassas Repolara Güvenmek İçin Bu Yeterli mi?

Benim görüşüm: bu üç değişiklik, Anthropic'in Claude Code'un izin sistemini bir kez yayınlanıp bitmiş sayılan bir özellik değil, küçük artışlarla sürekli sıkılaştırılması gereken bir şey olarak ele aldığının kanıtı — ve bu, gerçek dosya sisteminize karşı shell komutları çalıştıran bir araç için doğru duruş. Hiçbiri temel kuralları ortadan kaldırmıyor: birleştirmeden önce diff'leri incele, API anahtarlarını dar kapsamda tut, bir ajanı prompt'ta görmek istemeyeceğin kimlik bilgileri içeren bir ağaca yönlendirme. Kendi [LLM uygulamalarına karşı kırmızı takım testleri](/tr/posts/llm-uygulamaniza-nasil-kirmizi-takim-yaparsiniz) yapan ekipler, "bu ajan bypass modunda `blockWritesOutsideWorkingDirectories`'e hâlâ uyuyor mu" sorusunu da listeye eklemeli; çünkü bypass modunda hayatta kalması gerektiği söylenen bir ayar, tam olarak körü körüne kabul etmek yerine kendin doğrulamaya değer bir iddia türü. Ekibin daha uzun süren ajan oturumlarıyla deneme yapıyorsa, aynı Kasım changelog'u [Claude'un message threads beta özelliğinin](/tr/posts/claude-message-threads-ozelligi-nedir) de bulunduğu yer — ikisini birlikte okumaya değer, çünkü ikisi de denetimsiz çalışan çok adımlı ajan işini daha güvenli ve daha ucuz hale getirmekle ilgili.

## Sıkça Sorulan Sorular

### E-posta sızıntısı onayını hangi Claude Code sürümü ekledi?

3 Kasım 2026'da yayınlanan Claude Code 2.1.317, bir web veya shell araç çağrısı hesap e-posta adresini ağa göndermeden önce tetiklenen bir onay istemi ekledi. Önceki sürümler, araç çağrısının isteği e-postayı içeriyorsa onu sessizce gönderiyordu.

### `blockWritesOutsideWorkingDirectories` bypassPermissions modunda da geçerli mi?

Evet. Claude Code 2.1.314'ten (30 Ekim 2026) beri, `permissions.blockWritesOutsideWorkingDirectories`, `bypassPermissions` dahil her izin modunda Write, Edit ve NotebookEdit çağrılarını çalışma dizinlerinizin dışında engelliyor; bypass modu daha önce tüm korumaları kaldırıyordu.

### İşaretlenmiş bir Claude Code isteği sadece eski bir Opus modeline ulaşabiliyorsa ne olur?

2.1.314 sürümünden itibaren, reddetmeyle sonuçlanmak yerine erişilebilen başka bir modelde otomatik olarak yeniden deneniyor. Bu sürümden önce, eski bir Opus modelinin arkasında sıkışan işaretlenmiş bir istek yedeksiz başarısız oluyordu.

### Kasım 2026'daki bu değişiklikler Claude Code fiyatlandırmasını veya hız sınırlarını etkiliyor mu?

Hayır. E-posta sızıntısı onayı, `blockWritesOutsideWorkingDirectories` ve işaretlenmiş istek yedeği — üçü de token fiyatlandırmasını, hız sınırlarını veya model erişilebilirlik katmanlarını etkilemeyen izin ve güvenilirlik düzeltmeleri.
