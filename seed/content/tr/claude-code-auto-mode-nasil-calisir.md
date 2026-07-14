---
title: "Claude Code Auto Mode: Nasıl Çalışır, Ne Zaman Kapatılır"
slug: "claude-code-auto-mode-nasil-calisir"
translationKey: "claude-code-auto-mode-explained"
locale: "tr"
excerpt: "Temmuz 2026: Claude Code Auto Mode, ikinci bir Claude örneğinin araç çağrılarını onayladığı sınıflandırıcı katman. v2.1.207 kapsamı genişletti, işte ayrıntılar."
category: "ai"
tags: ["ai-agents", "ai-tools", "ai-reliability", "best-practices", "claude"]
publishedAt: "2026-07-12"
seoTitle: "Claude Code Auto Mode: Nasıl Çalışır?"
seoDescription: "Claude Code Auto Mode nedir, v2.1.200 neden Manual'ı varsayılan yaptı ve v2.1.207 Bedrock, Vertex, Foundry için neyi değiştirdi? Ayrıntılı rehber."
---

Claude Code'un Auto Mode özelliği, her araç çağrısını sizin tek tek onaylamanız yerine ikinci bir Claude örneğinin canlı konuşma metnini okuyup her komutu gerçek zamanlı onayladığı ya da reddettiği bir izin katmanıdır. Temmuz 2026'da iki kritik güncelleme geçirdi: v2.1.200 varsayılan izin modunu Manual'a çevirdi, v2.1.207 ise Auto Mode'u üç kurumsal platformda opt-in adımı olmadan kullanılabilir hale getirdi.

## Auto Mode tam olarak ne yapıyor?

Geleneksel akışta Claude Code, her dosya yazımı, her kabuk komutu veya her ağ çağrısı öncesinde durur ve izninizi bekler. Auto Mode bunun yerine ikinci bir Claude örneğini devreye sokar: bu örnek canlı konuşma transkriptini okur, önerilen aracın bağlamını değerlendirir ve komutu insan beklemeden onaylar ya da reddeder. Kısaca "her zaman sor" ile hiçbir korkuluğun olmadığı serbest mod arasında duran bir politika katmanı - klasik "izin ver" tuşuna basma işini model tabanlı bir sınıflandırıcıya devreder.

Bu mimarinin ayrıntıları Anthropic'in ["Claude Code auto mode nasıl inşa edildi: izinleri atlamanın daha güvenli yolu"](https://www.anthropic.com/engineering/claude-code-auto-mode) başlıklı mühendislik yazısında anlatılıyor. Sınıflandırıcı bir onay makinesi gibi değil, bir gözden geçirici gibi çalışıyor: şüpheli görünen her şeyi reddediyor, geri kalanı akışı kesmeden geçiriyor. Bu, [subagent'ların ve arka plan ajanlarının](/tr/posts/claude-code-subagent-arka-plan-ajanlari) günün büyük kısmını gözetimsiz çalıştığı bir dünyada özellikle önemli - paralel çalışan ajan sayısı arttıkça tek tek "allow" tuşuna basmak pratik olmaktan çıkıyor.

Bu ayrım önemli çünkü Auto Mode bir "izin ver, unut" düğmesi değil. Sınıflandırıcı her öneriyi tazeden değerlendiriyor; önceki turda onaylanmış bir komut kalıbı, sonraki turda bağlam değiştiyse yine de reddedilebiliyor. Bu davranış, ajanların kendi başına git commit atıp branch push ettiği ve taslak PR açtığı akışlarda özellikle işe yarıyor - tam otonomi ile hiç otonomi olmaması arasında bir orta yol sunuyor.

## Neden önce kapatıldı, şimdi neden geri geldi?

Temmuz 2026'nın ilk haftasında, Claude Code v2.1.200 ile varsayılan izin modu Manual'a çevrildi - yani her dosya yazımı, her kabuk komutu ve her ağ çağrısı varsayılan olarak açık insan onayı gerektiriyor. Bu geri adımın nedeni netti: Anthropic'in evalleri, Auto Mode'un sınıflandırıcısının aşırı istekli veya riskli eylemlerin kabaca %17'sini kaçırdığını gösterdi. Yirmi riskli eylemden üçe yakını gözden kaçıyordu; paylaşılan bir repo veya prod ortamı için kabul edilebilir bir oran değildi. Bu türden kaçırılan onaylar, [agentjacking gibi saldırı sınıflarının](/tr/posts/agentjacking-yeni-ai-ajan-saldirisi) tam olarak istismar etmeye çalıştığı boşluklardır - bir ajanın kendi araç çağrısı üzerinden yetkisini aşması.

Bir hafta sonra, 11 Temmuz'da çıkan v2.1.207 dengeyi tamamen tersine çevirmedi ama kapsamı genişletti. Auto Mode ortadan kalkmadı; artık üç kurumsal platform entegrasyonunda - AWS Bedrock, Google Vertex AI ve Microsoft Foundry - önceden zorunlu olan `CLAUDE_CODE_ENABLE_AUTO_MODE` opt-in adımı olmadan kullanılabiliyor. Yani genel varsayılan hâlâ Manual, ama bu üç platformda Auto Mode artık bir bayrak açmadan erişilebilir durumda.

## v2.1.207'de tam olarak ne değişti?

11 Temmuz 2026'da yayımlanan v2.1.207, [değişim günlüğüne](https://code.claude.com/docs/en/changelog) göre üç ayrı değişiklik taşıyor:

- **Opt-in adımı kalktı.** Auto Mode, Bedrock, Vertex AI ve Foundry üzerinde artık `CLAUDE_CODE_ENABLE_AUTO_MODE` ortam değişkeni ayarlanmadan kullanılabiliyor. Kapatmak isteyen ekipler hâlâ `disableAutoMode` ayarına başvurabilir; ayrıntılar [Auto Mode yapılandırma dokümanında](https://code.claude.com/docs/en/auto-mode-config).
- **Sessiz onay hatası düzeltildi.** Non-interactive çalıştırmalarda (`claude -p` veya SDK üzerinden) remote managed settings, kullanıcıya güvenlik onay diyaloğu hiç gösterilmeden kalıcı olarak "onaylandı" kaydediliyordu. Bu artık düzeltildi; onay kaydedilmeden önce diyalog gösterilmesi zorunlu hale geldi.
- **Varsayılan model değişti.** Bedrock, Vertex AI ve Claude-on-AWS üzerinde varsayılan model artık Claude Opus 4.8.

İkinci madde küçük bir changelog satırı gibi görünse de aslında ciddiydi: kullanıcı hiçbir diyalog görmeden bir yönetici ayarının kalıcı rızaya dönüşmesi, Auto Mode'un çözmeye çalıştığı sorunun aynısıydı - görünür olmayan otomatik onay. Şeffaflık eksikliğinin nereye kadar sızabildiğine dair benzer bir örnek, [Claude Code'un gizli takip kodu](/tr/posts/claude-code-gizli-takip-kodu) yazımızda ele aldığımız olaydı.

## Permission mode'ları karşılaştırma

| Mod | Kim onaylar | Risk | En uygun kullanım |
|---|---|---|---|
| Manual (varsayılan) | İnsan, işlem başına | En düşük | Prod repoları, paylaşılan ortamlar, ilk kurulum |
| Auto Mode | İkinci bir Claude sınıflandırıcı örneği | Orta - evallerde kabaca %17 kaçırma oranı görüldü | Hız gereken düşük riskli iç görevler, kurumsal platform entegrasyonları |
| permissions.deny | Kimse - sınıflandırıcıya sorulmadan sabit engel devreye girer | Organizasyon tarafından belirlenir, geçersiz kılınamaz | Kesin yasaklar: `rm -rf`, force-push, credential dosyası erişimi |

## Kurumlar Auto Mode'u nasıl sabitler?

`permissions.deny`, managed settings içinde tanımlanan sabit bir engeldir ve bir eylemi sınıflandırıcıya sorulmadan önce bloke eder. Bu kritik bir ayrım: Auto Mode sınıflandırıcısı da, kullanıcı da bu kuralı geçersiz kılamaz. Anthropic bunu, Auto Mode durumundan bağımsız olarak tehlikeli eylemleri (örneğin `rm -rf`, force-push veya credential dosyası erişimi) sertleştirmenin önerilen yolu olarak konumlandırıyor.

Basit bir managed settings örneği şöyle görünebilir - bu resmi şemanın birebir kopyası değil, mantığı göstermek için sadeleştirilmiş bir örnek:

```json
{
  "disableAutoMode": "disable",
  "permissions": {
    "deny": [
      "Bash(rm -rf *)",
      "Bash(git push --force*)",
      "Read(**/.env)",
      "Read(**/*credentials*)"
    ]
  }
}
```

`disableAutoMode` ayarı, bir organizasyonun Auto Mode'u filo genelinde tamamen kapatmasını sağlar - `CLAUDE_CODE_ENABLE_AUTO_MODE` her kurulumda tek tek elle kapatılmak zorunda değildir. `permissions.deny` ise daha ince taneli bir katman: Auto Mode açık kalsa bile, listedeki eylemler asla geçmez.

## Açık mı bırakmalısın, kapalı mı?

İtiraf edeyim, %17'lik kaçırma oranını gördükten sonra Auto Mode'u paylaşılan bir repoda varsayılan açık bırakmıyorum. Sınıflandırıcı hızlı ve çoğu zaman isabetli olsa da yirmide üçe yakın bir kör nokta, prod'a dokunan hiçbir akış için kabul edilebilir değil.

Pratik ayrım şöyle: tek başınıza çalıştığınız, sonuçları kolayca geri alınabilen bir sandbox veya keşif ortamında Auto Mode zamandan gerçek bir tasarruf sağlar. Paylaşılan bir repoda, prod'a dokunan bir pipeline'da veya birden fazla kişinin aynı ortama eriştiği kurumsal bir kurulumda Manual'ı varsayılan bırakıp riskli eylemleri `permissions.deny` ile sertleştirmek daha güvenli. Bedrock, Vertex AI veya Foundry kullanan ekipler için asıl mesele şu: v2.1.207 sonrasında Auto Mode artık bir bayrak açmadan erişilebilir, yani bilinçli olarak `disableAutoMode` ile kapatmadıysanız kapıyı açık bırakmış olabilirsiniz. Tarayıcı üzerinden çalışan ajanlarda benzer bir dikkatli yaklaşım için [Claude in Chrome güvenlik rehberimize](/tr/posts/claude-in-chrome-ga-gelistirici-guvenlik-rehberi) göz atabilirsiniz.

## Sıkça Sorulan Sorular

### Auto Mode ile Manual mod arasındaki temel fark nedir?

Manual modda her işlem çalışmadan önce sizin onayınızı bekler. Auto Mode'da ise ikinci bir Claude örneği canlı transkripti okuyarak işlemi sizin yerinize gerçek zamanlı onaylar veya reddeder. v2.1.200'den bu yana Manual varsayılan mod; Auto Mode isteğe bağlı bir hızlandırma katmanı.

### Auto Mode'u nasıl kapatırım?

`disableAutoMode` ayarını kullanabilirsiniz. Bireysel kurulumlarda bu ayar Auto Mode'u devre dışı bırakır; organizasyonlar managed settings içinde `"disableAutoMode": "disable"` değerini vererek Auto Mode'u tüm filoda sabit olarak kapatabilir.

### permissions.deny, Auto Mode'un sınıflandırıcısından farklı mı çalışır?

Evet. `permissions.deny` sınıflandırıcıdan tamamen bağımsız çalışır ve eylemi sınıflandırıcıya hiç sorulmadan önce bloke eder. Ne Auto Mode sınıflandırıcısı ne de kullanıcı bu kuralı geçersiz kılabilir; bu yüzden gerçekten kesin yasaklar için önerilen yöntem budur.

### Auto Mode'u denemek güvenli mi?

Düşük riskli, geri alınabilir işler için evet - sandbox bir depo veya kişisel proje makul bir başlangıç noktası. Ancak sınıflandırıcının evallerde riskli eylemlerin kabaca %17'sini kaçırdığı biliniyor, bu yüzden prod'a dokunan veya birden fazla kişinin paylaştığı ortamlarda Auto Mode'u tek başına güvenlik katmanı olarak görmeyin; kesin yasakları her zaman `permissions.deny` ile sabitleyin. Diğer yapay zeka gündemleri için [yapay zeka kategorimize](/tr/category/yapay-zeka) göz atabilirsiniz.
