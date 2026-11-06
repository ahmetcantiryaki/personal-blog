---
title: "Claude API'de IP İzin Listesi Nasıl Kurulur?"
slug: "claude-api-ip-izin-listesi-kurulumu"
translationKey: "claude-api-ip-allowlisting-2026"
locale: "tr"
excerpt: "Kısa cevap: Claude Console'daki Identity and Access sayfasından IP aralıklarını ekleyip kaydedin. Liste dışından gelen istekler 403 permission_error alır."
category: "ai"
tags: ["claude", "api-design", "web-security", "backend"]
publishedAt: "2026-11-06"
seoTitle: "Claude API IP İzin Listesi (Allowlist) Kurulumu"
seoDescription: "Anthropic'in 5 Kasım 2026'da duyurduğu beta özellik: Claude API'yi belirli IP aralıklarına kilitleme. Kurulum adımları, limitler ve kilitlenmeme yolları."
---

Kısa cevap: Claude Console'da **Identity and Access** sayfasına girip IP İzin Listesi (IP allowlist) anahtarını açın, sunucularınızın, CI'ınızın ve ofisinizin çıkış IP'lerini veya CIDR aralıklarını ekleyin, kaydedin. Bu andan sonra Messages, Files, Admin API gibi kapsanan uç noktalara listenin dışından gelen her istek 403 `permission_error` ile reddedilir — bu, sızan bir API anahtarının saldırgan için işe yaramaz hâle gelmesi demektir.

## Claude API IP İzin Listesi (Allowlist) Nedir?

IP allowlisting, Anthropic'in 5 Kasım 2026'da genel kullanıma açtığı beta özelliği: organizasyon düzeyinde bir IP aralıkları listesi tanımlıyorsunuz, Anthropic her kapsanan isteğin kaynak IP'sini bu listeyle karşılaştırıyor ve eşleşmeyeni reddediyor. Mantık basit — bir API anahtarı tek başına "bu isteği kim gönderdi" sorusunu değil, "bu isteği gönderen kişi anahtarı biliyor mu" sorusunu cevaplar. Anahtar sızdığında bu ayrım çöker. IP allowlist, üçüncü bir koşul ekliyor: anahtar doğru olsa bile istek beklenen ağdan gelmiyorsa reddedilsin.

## Neden Buna İhtiyacınız Var?

Bir API anahtarı GitHub'a push edilen bir `.env` dosyasında, bir log satırında veya bir CI çıktısında sızdığında, saldırganın elinde dünyanın herhangi bir yerinden çalışan geçerli bir kimlik bilgisi olur. IP allowlist bu senaryoda saldırganı durdurur, çünkü saldırganın trafiği sizin listelediğiniz ağlardan birinden geçmiyorsa anahtar işe yaramaz. Anthropic'in kendi belgelerinde söylediği gibi, bu önlem veri sızıntılarını önleyebilir ve kötüye kullanım nedeniyle fatura şişmesi riskini azaltır — ama anahtarın ne kadar süre geçerli kalacağını değiştirmez, bu yüzden kısa anahtar süresi veya statik anahtarlardan tamamen kurtulan Workload Identity Federation ile birlikte kullanılması öneriliyor.

## Hangi Uç Noktalar Kapsanıyor?

Allowlist her şeyi kapsamıyor; kapsadığı yüzeyi bilmek yanlış bir güvenlik hissine kapılmamak için önemli.

| Kapsam | Örnekler |
|---|---|
| Claude Console UI | Panel girişi |
| Claude API (API key veya WIF token ile) | Messages, Message Batches, Token Counting, Models, Files, Skills |
| Claude Managed Agents uç noktaları | Agents, Sessions, Environments, Vaults, Memory stores |
| Organizasyon API'leri | Admin API, Compliance API |
| **Kapsanmayan** | Amazon Bedrock, Google Cloud, Microsoft Foundry üzerinden Claude; Managed Agents'ın kendi çalışma zamanı ağı |

Yani aynı organizasyon Bedrock üzerinden de Claude çağırıyorsa, allowlist o trafiği hiç görmez — bunu ayrı bir bulut sağlayıcı güvenlik grubuyla kontrol etmeniz gerekir.

## IP İzin Listesini Nasıl Kurarsınız?

Üç adımlık bir kurulum: anahtarı açın, aralıkları ekleyin, trafiği izleyin.

```bash
# Allowlist devreye girdikten sonra kapsam dışı bir IP'den gelen istek şöyle döner:
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01"
# -> 403 Forbidden
# {"type":"error","error":{"type":"permission_error",
#   "message":"Your IP address isn't in this organization's allowed range."}}
```

Giriş formatı tek bir IPv4/IPv6 adresi (`203.0.113.5`) veya CIDR aralığı (`203.0.113.0/24`, en geniş `/8`; IPv6'da en geniş `/32`) olabilir ve liste en fazla 1.000 girdi tutar. Değişiklikler yayılmaya kadar 15 dakikaya varan bir gecikme alabilir, bu yüzden kaydettikten sonra günlük veya haftalık çalışan arka plan işlerini de dahil ederek trafiğinizi izleyin.

Kurulumdan sonraki ilk hafta için pratik bir tavsiye: 403 `permission_error` oranını izleyen basit bir uyarı kurun (log tarayıcınızda bir sayaç yeterli). Bu oran aniden yükselirse ya meşru bir sunucunuz listede unutuldu ya da gerçekten kapsam dışından bir deneme oluyor — her iki durumda da bunu bir hafta sonra fark etmek yerine aynı gün fark etmek istersiniz. Küçük bir ekipte bu uyarıyı kurmak genellikle mevcut log altyapınıza tek bir sorgu eklemekten ibaret, ayrı bir araç gerektirmiyor.

## Kendinizi Nasıl Dışarıda Bırakmazsınız?

Kaydet ekranı sadece sizin o anki IP'nizi kontrol eder — sunucularınızı, ekip arkadaşlarınızı veya yarın bağlanacağınız ağı kontrol etmez. Veri merkezlerini, CI sistemlerini, ofisleri, VPN'leri ve proxy'leri listeye eklemeden önce **"Allow admins to access this settings page from any IP address"** kutusunu işaretli tutmak Anthropic'in önerdiği güvenlik ağı; bu sayede bir yönetici her zaman ayar sayfasına geri dönüp listeyi düzeltebilir. Bunun riski, bir saldırganın yönetici oturumunu ele geçirmesi hâlinde listeyi uzaktan değiştirebilmesidir — Compliance API'yi kurduysanız Activity Feed bu değişiklikleri denetlenebilir hâle getirir.

## IP İzin Listesi Tek Başına Yeterli mi?

Hayır — allowlist bir anahtarın *nereden* çalışacağını sınırlar, *ne kadar süre* çalışacağını sınırlamaz, bu yüzden tek katman olarak kullanmak yanlış bir güven duygusu yaratır. Çalınan bir anahtar, saldırganın da sizin listelediğiniz bir ağdan (örneğin paylaşılan bir kurumsal proxy) geçmesi hâlinde yine işe yarar; bu yüzden Anthropic paylaşılan proxy adreslerini listelemeyi özellikle uyarıyor. Gerçek savunma, allowlist'i kısa ömürlü anahtarlarla veya statik anahtarları tamamen ortadan kaldıran Workload Identity Federation ile katmanlamaktan geçiyor — [bulutta secret yönetimi](/tr/posts/bulutta-secret-yonetimi) yazısındaki rotasyon ve en az ayrıcalık ilkeleri burada da aynen geçerli, [sıfır güven ağ modeli](/tr/posts/kucuk-ekip-sifir-guven-ag-tailscale) ise ağ düzeyinde erişimi zaten "listede mi" sorusuna indirgeyen daha geniş bir yaklaşım sunuyor.

Benim yorumum: bu özelliği "sızıntı olmaz" güvencesi olarak değil, sızıntının *maliyetini* düşüren bir katman olarak görün — kurulumu 10 dakika sürüyor ve geri dönüşü, bir anahtar yanlışlıkla herkese açık bir repoya gittiğinde fatura şokunu önlemek. Anthropic'in aynı hafta duyurduğu [Claude Files API'nin](/tr/posts/claude-files-api-ga-ne-anlama-geliyor) ve organizasyon verilerini kapsayan [kurumsal veri saklama politikasındaki değişikliğin](/tr/posts/anthropic-veri-saklama-politikasini-neden-degistiriyor) de gösterdiği gibi, Anthropic 2026'nın son çeyreğinde kurumsal güvenlik yüzeyini hızla genişletiyor; allowlist bu listedeki en ucuz ve en hızlı uygulanabilir adım.

## Sign Members Out Everywhere Özelliğiyle Birlikte Nasıl Kullanılır?

Aynı hafta (5 Kasım 2026), Anthropic IP allowlist'in yanına ikinci bir beta özellik daha ekledi: Admin API üzerinden bir Claude Enterprise üyesini tüm cihazlardan tek seferde oturumdan çıkarma. İki özellik farklı sorunları çözüyor ama birlikte daha güçlü bir hikâye kuruyor — allowlist bir isteğin *nereden* geldiğini, sign-out-everywhere ise çalışan ayrıldığında veya bir oturum çalındığında erişimin *ne kadar hızlı* kesilebildiğini kontrol ediyor. Bir çalışan şirketten ayrıldığında önce bu uç noktayla oturumunu kapatıp sonra IP listesinden şirket ağını kaldırmak, tek bir adımdan daha sağlam bir kapanış prosedürü oluyor; üye organizasyonda kalıyor ve dilerse tekrar giriş yapabiliyor, ama o anki tüm açık oturumlar anında geçersiz oluyor.

Pratikte bu iki özelliği birlikte düşünmek, "sızıntı anında ne yaparım" sorusunu bir kerelik panik yerine önceden yazılmış bir kontrol listesine çeviriyor: anahtarı iptal et, kullanıcıyı her yerden çıkar, allowlist'i güncelle, Compliance API'nin Activity Feed'inden değişikliği doğrula. Bu dört adımı bir kez yazıp ekip wiki'sine koymak, olay anında dakikalar kazandırıyor.

## Sıkça Sorulan Sorular

### Claude API IP allowlist nedir?

Organizasyon düzeyinde tanımlanan bir IP aralıkları listesi; Messages, Files, Admin API gibi kapsanan uç noktalara bu listenin dışından gelen her istek 403 `permission_error` ile reddedilir. Bir API anahtarı sızsa bile, saldırganın trafiği listelenen ağlardan geçmiyorsa anahtar işe yaramaz.

### IP allowlist kurduktan sonra kendimi dışarıda bırakırsam ne olur?

Önce kayıtlı bir ağdan (ofis veya VPN) bağlanıp tekrar deneyin. Mümkün değilse listelenen bir ağdaki başka bir yönetici sizi ekleyebilir; "herhangi bir IP'den ayar sayfasına erişim" kutusu işaretliyse kendi IP'nizi uzaktan da ekleyebilirsiniz. Hiçbiri işe yaramazsa Anthropic desteğinden listeyi kapatmasını istemeniz gerekir.

### IP allowlist tek başına API anahtarı güvenliği için yeterli mi?

Hayır. Allowlist anahtarın nereden kullanılabileceğini sınırlar ama süresini sınırlamaz. Kısa anahtar sürelerinin veya statik anahtarları tamamen kaldıran Workload Identity Federation'ın yanında, ek bir katman olarak kullanılması öneriliyor.

### IP allowlist Claude'un Amazon Bedrock veya Google Cloud üzerindeki sürümlerini de kapsıyor mu?

Hayır. Allowlist yalnızca doğrudan Anthropic'in Claude API'sini, Claude Console'u ve Managed Agents uç noktalarını kapsar; Amazon Bedrock, Claude Models on Google Cloud veya Microsoft Foundry üzerinden yapılan çağrılara uygulanmaz.
