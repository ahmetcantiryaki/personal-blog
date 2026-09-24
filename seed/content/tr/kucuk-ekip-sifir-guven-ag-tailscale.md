---
title: "Küçük Ekipler İçin Sıfır Güven Ağ: Tailscale ve Ötesi"
slug: "kucuk-ekip-sifir-guven-ag-tailscale"
translationKey: "zero-trust-small-teams-tailscale-2026"
locale: "tr"
excerpt: "Sıfır güven ağ, her cihaza ve kullanıcıya ayrı kimlik tanıyıp en az yetki ilkesiyle erişim verir; küçük bir ekip bunu Tailscale veya Headscale ile kurabilir."
category: "devops-cloud"
tags: [web-security, devops, self-hosting, authentication]
publishedAt: "2026-09-24"
seoTitle: "Küçük Ekipler İçin Sıfır Güven Ağ Kurulumu"
seoDescription: "Sıfır güven ağ, düz VPN'in aksine her cihaza ayrı kimlik ve en az yetki verir. Tailscale ve Headscale ile küçük ekip geçişi, ACL örneği burada."
---

Kısa cevap: Sıfır güven ağ, ağa bir kez girince her şeye erişebildiğiniz düz VPN modelinin tersine, her cihaza ve kullanıcıya ayrı bir kimlik tanıyıp yalnızca ihtiyacı olduğu servise erişim veren bir modeldir; küçük bir ekip bunu WireGuard tabanlı Tailscale veya kendi barındırdığı Headscale ile birkaç saatte kurabilir. Ayrı bir donanım güvenlik duvarı veya karmaşık bir VPN sunucusu kurmaya gerek kalmıyor.

## Düz VPN modeli neden risklidir?

Klasik bir kurumsal VPN, bağlanan cihazı şirket ağının içine "teleport" eder — bir kez içeri girdiğinizde, VPN sunucusunun kendisi dışında neredeyse hiçbir erişim kontrolü kalmaz. Bu, yanal hareket riskini doğurur: çalınan bir dizüstü bilgisayar veya ele geçirilmiş bir VPN kimlik bilgisi, saldırgana veritabanından iç yönetim panellerine kadar aşırı geniş bir erişim alanı açar. Küçük ekiplerde bu risk daha da büyür çünkü ayrı segmentlere bölünmüş bir ağ mimarisi kurmaya genelde ne zaman ne de bütçe ayrılır; sonuç olarak tek bir VPN kimlik bilgisi, üretim veritabanından iç dokümantasyona kadar her şeyin anahtarı haline geliyor.

## Sıfır güven modelinin temel ilkeleri neler?

Üç ilke birbirini tamamlıyor: cihaz veya kullanıcı bazında kimlik (ağ konumu değil, kimlik erişim kararını belirler), en az yetki (her servis yalnızca ihtiyacı olan kaynağa erişir) ve servis bazlı erişim (VPN'in aksine tüm ağa değil, tek bir servise bağlanma). Bu model NIST SP 800-207'de tanımlanan çerçeveyle örtüşüyor ve artık büyük kurumlara özgü değil — WireGuard tabanlı araçlar sayesinde küçük ekipler için de erişilebilir hale geldi.

Bu üç ilkenin pratikte anlamı şu: bir geliştiricinin dizüstü bilgisayarı ele geçirilirse, saldırgan yalnızca o geliştiricinin ACL kurallarında açıkça izin verilen servislere erişebilir — tüm iç ağa değil. Düz VPN modelinde aynı senaryoda saldırgan, VPN sunucusunun arkasındaki her şeye (başka ekiplerin veritabanlarına, iç yönetim panellerine, CI sistemine) erişebilirdi. Küçük bir ekipte bu fark hayati olabilir çünkü genelde tek bir kişinin hesabı, orantısız derecede geniş bir erişime sahiptir.

## Tailscale nasıl çalışır?

Tailscale, WireGuard üzerine kurulu bir mesh VPN ve erişim kontrol düzlemi. Kurduğunuz her cihaz bir "tailnet" — kimlik destekli özel ağ — içine katılıyor ve mümkün olduğunda cihazlar arasında doğrudan WireGuard tüneli kuruluyor; doğrudan bağlantı mümkün olmadığında (örneğin iki taraf da NAT arkasındaysa) trafik DERP röle sunucuları üzerinden geçiyor.

Ücretsiz katmanda bile erişim kontrol listeleri (ACL), etiketleme, subnet router'lar, exit node'lar, MagicDNS ve Taildrop (dosya paylaşımı) ile kontrol düzlemi üzerinden SSH dahil. Ücretli katmanlar buna SSO zorunluluğu, denetim (audit) günlükleri, oturum kaydı ve SCIM provisioning ekliyor — bunlar daha büyük veya regüle ekipler için önemli, küçük bir ekibin temel sıfır güven kurulumu için şart değil.

## Tailscale mi Headscale mi seçmeliyim?

Tailscale, cömert bir ücretsiz katmana sahip ticari, bulutta barındırılan bir hizmet. Headscale ise Tailscale'in kontrol protokolünü uygulayan açık kaynaklı, kendi sunucunuzda barındırdığınız bir alternatif; ACL politikalarını kendiniz yapılandırabiliyor, OIDC ile kimlik doğrulama entegre edebiliyor ve üçüncü parti bir kontrol düzlemine bağımlı kalmadan binlerce cihazı yönetebiliyorsunuz.

Veri egemenliği önemliyse veya zaten bir kimlik sağlayıcınız (OIDC uyumlu) varsa Headscale mantıklı bir seçim. Kurulum ve bakım için ayıracak zamanınız yoksa, Tailscale'in ücretsiz katmanı çoğu küçük ekip için zaten yeterli. İkisi arasında karar veremiyorsanız, önce Tailscale'in ücretsiz katmanıyla başlayıp gerçek kullanım verisine göre daha sonra Headscale'e geçmek de düşük riskli bir yol; kontrol düzlemini değiştirmek, cihazların kendi kurulumunu baştan yapmaktan çok daha kolay.

| | Tailscale (ücretsiz) | Tailscale (ücretli) | Headscale |
|---|---|---|---|
| Barındırma | Tailscale bulutu | Tailscale bulutu | Kendi sunucunuz |
| ACL, etiketleme, exit node | Var | Var | Var |
| SSO zorunluluğu, SCIM | Yok | Var | OIDC ile elle |
| Denetim günlüğü, oturum kaydı | Yok | Var | Elle kurulum gerekir |
| Veri kontrolü | Tailscale'de | Tailscale'de | Tamamen sizde |

## Küçük bir ekip geçişi kesintisiz nasıl yapılır?

Önce Tailscale'i (veya Headscale'i) mevcut VPN'in yanında, onu hemen kapatmadan kurun; her iki ağ da bir süre paralel çalışabilir. Cihazları teker teker tailnet'e katın ve önce en az kritik servisten başlayarak ACL kurallarını test edin:

```json
{
  "acls": [
    {
      "action": "accept",
      "src": ["tag:gelistirici"],
      "dst": ["tag:staging-db:5432"]
    },
    {
      "action": "accept",
      "src": ["tag:devops"],
      "dst": ["tag:prod-db:5432", "tag:staging-db:5432"]
    }
  ]
}
```

Bu örnekte `gelistirici` etiketli cihazlar yalnızca staging veritabanına erişebiliyor, `devops` etiketli cihazlar hem staging hem prod'a erişebiliyor — düz VPN'de bu ayrım için ayrı bir ağ segmenti ve güvenlik duvarı kuralı gerekirdi. Tüm ekip tailnet üzerinden çalışmaya alıştıktan ve ACL'ler bir hafta sorunsuz çalıştıktan sonra eski VPN'i kapatın.

En sık karşılaşılan tuzak, ACL'leri en baştan "herkese her şey" şeklinde bırakıp asla daraltmamak — bu, sıfır güven modelinin bütün amacını boşa çıkarıyor ve geçişi yalnızca kağıt üzerinde bir isim değişikliğine indirger. İkinci yaygın hata, subnet router'ları kurup unutmak: bir subnet router çöktüğünde arkasındaki tüm servisler tailnet'ten görünmez oluyor ve bunu fark etmek günler alabiliyor, bu yüzden subnet router'ları da izlemeye almak gerekiyor. Üçüncü hata, geçiş sürecinde eski VPN'i "her ihtimale karşı" aylarca açık bırakmak — bu, iki paralel erişim yolu anlamına geliyor ve sıfır güven modelinin sağladığı denetimi fiilen yarıya indiriyor.

## Cihaz durumu (device posture) kontrolü neden önemli?

Kimlik tabanlı erişim, cihazın kendisi hakkında hiçbir şey söylemez — çalınan bir dizüstü bilgisayarda geçerli bir kullanıcı oturumu açıksa, o cihaz hâlâ tailnet'e erişebilir. Cihaz durumu kontrolü bu boşluğu kapatıyor: işletim sistemi güncel mi, disk şifrelemesi açık mı, cihaz yönetilen bir MDM profiline bağlı mı gibi sinyalleri ACL kararına dahil ediyor. Tailscale'in ücretli katmanlarında bu, "device posture" kuralları olarak ACL politikasına eklenebiliyor; Headscale'de aynı sonucu almak için genelde ayrı bir MDM entegrasyonu ve harici bir kontrol betiği gerekiyor.

Küçük bir ekip için bu katmanı en baştan kurmak şart değil — önce temel kimlik tabanlı erişimi oturtup ACL'leri daraltmak daha yüksek getirili bir ilk adım. Ekip büyüdükçe veya düzenli denetim gerektiren bir sektörde çalışıyorsanız (finans, sağlık gibi) cihaz durumu kontrolünü ikinci aşamada eklemek, ilk günden karmaşık bir politika seti kurmaya çalışmaktan daha sürdürülebilir bir sıralama.

## Sıkça Sorulan Sorular

### Sıfır güven ağ ile geleneksel VPN arasındaki fark nedir?

Kısa cevap: Geleneksel VPN bağlanan cihaza tüm ağa erişim verirken, sıfır güven ağ her cihaza ayrı kimlik tanıyıp yalnızca izin verilen servise erişim sağlar. Bu, çalınan bir kimlik bilgisinin yol açabileceği zararı tek bir servisle sınırlar; saldırgan o kimlik bilgisiyle yalnızca ACL'nin izin verdiği kadarını görebilir, ağın geri kalanı ona görünmez kalır.

### Küçük bir ekip için Tailscale mi Headscale mi daha uygun?

Kısa cevap: Kurulum ve bakıma zaman ayırmak istemeyen ekipler için Tailscale'in ücretsiz katmanı yeterli. Veri kontrolünü tamamen elinde tutmak isteyen veya zaten bir OIDC sağlayıcısına sahip ekipler için Headscale daha uygun.

### Tailscale ACL kuralları nasıl yazılır?

Kısa cevap: ACL kuralları JSON formatında `src` (kaynak etiket veya kullanıcı) ve `dst` (hedef etiket ve port) alanlarıyla tanımlanır; her kural hangi cihaz grubunun hangi servise erişebileceğini belirtir. Yeni bir kuralı önce dar kapsamda test edip sonra genişletmek, "herkese her şey" hatasından kaçınmanın en güvenli yolu.

**Kaynaklar:** [Tailscale güvenlik ekipleri için](https://tailscale.com/solutions/security), [Headscale: tam self-hosted Tailscale rehberi](https://wgall.com/blog/2026-03-18-headscale-self-hosted-tailscale.html), [Tailscale vs Headscale karşılaştırması](https://simeononsecurity.com/articles/tailscale-vs-headscale-comparison-guide/).
