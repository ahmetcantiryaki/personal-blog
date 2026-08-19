---
title: "Monorepo İçin CI/CD: Önbellek ve Etkilenen Yapılar"
slug: "monorepo-ci-cd-onbellek-etkilenen-yapilar"
translationKey: "monorepo-cicd-pipelines"
locale: "tr"
excerpt: "Monorepo CI/CD'sini hızlı tutmanın anahtarı: sadece değişen paketleri derlemek (affected builds) ve remote cache ile önceden yapılmış işi tekrar yapmamak."
category: "devops-cloud"
tags: ["ci-cd", "monitoring", "performance", "developer-experience"]
publishedAt: "2026-08-19"
seoTitle: "Monorepo CI/CD: Affected Builds ve Remote Cache Rehberi"
seoDescription: "Monorepo büyüdükçe CI süresi patlıyorsa çözüm affected builds ve remote cache. Turborepo ve Nx ile 2026'da hızlı bir monorepo pipeline'ı nasıl kurulur?"
---

Kısa cevap: monorepo CI'ını hızlı tutan iki şey var — sadece değişen paketleri ve onlara bağımlı olanları derlemek (affected builds) ve önceden yapılmış derleme/test işini bir önbellekten geri almak (remote cache). Bu ikisi olmadan monorepo, tek bir dosya değiştiğinde bile tüm depoyu yeniden derleyen bir CI canavarına dönüşüyor.

## Affected Build Nedir, Neden Şart?

Affected build, sadece değişen dosyalardan etkilenen paketleri derleyip test eden bir yaklaşım; 200 paketlik bir monorepoda bir yardımcı fonksiyonu değiştirdiğinizde, o fonksiyonu içe aktaran 5 paket derlenir, kalan 195 paket dokunulmadan geçilir. Bunun tersi — her push'ta tüm depoyu derlemek — depo büyüdükçe doğrusal değil, çoğu zaman süper-doğrusal bir CI süresi artışına yol açıyor.

Nx, bunu proje grafiği ve dosya seviyesinde bağımlılık takibiyle yapıyor: `nx affected` komutu, değişen bir dosyadan başlayıp doğrudan ya da dolaylı olarak ondan içe aktarma yapan her projeyi izliyor. Turborepo ise aynı sonucu `--filter` bayrağıyla elde ediyor, örneğin `turbo run build --filter=[HEAD^1]` son commit'ten etkilenen paketleri hedefliyor.

```bash
# Nx: son commit'ten etkilenen projeleri derle
nx affected --target=build --base=HEAD~1

# Turborepo: son commit'ten etkilenen paketleri derle
turbo run build --filter=[HEAD^1]
```

## Remote Cache Ne Kazandırıyor?

Remote cache, bir görevin (derleme, test, lint) girdi hash'i daha önce hiç değişmediyse o görevi yeniden çalıştırmak yerine sonucunu paylaşılan bir depodan geri getiriyor. Bir geliştirici yerel makinesinde çalıştırdığı bir testin sonucu, aynı girdilerle CI'da tekrar çalıştırılmak yerine doğrudan önbellekten okunabiliyor — bu, ekip büyüdükçe CI dakikalarında ciddi bir tasarruf demek.

Turborepo'nun remote cache'i Vercel üzerinden (kişisel kullanım için ücretsiz, takımlar için ücretli) ya da açık kaynak self-host çözümleriyle sağlanıyor. Nx tarafında ise Nx Cloud, remote cache'in yanı sıra bir CI pipeline'ını birden fazla makineye bölen "distributed task execution" özelliğini de sunuyor — küçük takımlar için ücretsiz, büyük organizasyonlar için ücretli.

| Özellik | Turborepo | Nx |
| --- | --- | --- |
| Affected/only-changed | `--filter` bayrağı | `nx affected` komutu, proje grafiği tabanlı |
| Remote cache | Vercel veya self-host | Nx Cloud |
| Dağıtık görev yürütme | Sınırlı | Nx Cloud ile yerleşik |
| 2026 öne çıkan özellik | Go'dan Rust'a yeniden yazım, performans farkı kapanıyor | Nx 22: Self-Healing CI, binlerce projeyi yöneten grafik görünümü |
| Varsayılan öneri | Basit, hızlı bir görev çalıştırıcı isteyen takımlar | Koordinasyon darboğaz haline geldiğinde |

## Görev Grafiği Nasıl Kurulur?

Bir görev grafiği, hangi görevin hangi görevden önce çalışması gerektiğini tanımlar — örneğin bir paketin `build` görevi, ona bağımlı olan paketlerin `build`'inden önce bitmeli. Hem Turborepo hem Nx, `package.json` bağımlılıklarından bu grafiği otomatik çıkarıyor; siz sadece görevler arası ek bağımlılıkları (örneğin "test'ten önce build çalışsın") bir konfigürasyon dosyasında tanımlıyorsunuz.

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"]
    }
  }
}
```

Bu grafik doğru kurulduğunda paralelleştirme otomatik geliyor: birbirine bağımlı olmayan paketler aynı anda derlenebiliyor, CI süresi tek bir uzun zincir yerine grafiğin en uzun bağımlılık yoluna (critical path) iniyor.

## Test Sharding ve Paralelleştirme

Test sharding, büyük bir test paketini birden fazla CI çalışanına bölerek paralel çalıştırmak anlamına geliyor; 2000 testlik bir paket 4 shard'a bölündüğünde her çalışan yaklaşık 500 test çalıştırıyor ve toplam süre teorik olarak dörtte bire iniyor. Pratikte kazanım biraz daha düşük çünkü her shard'ın kendi başlatma (setup) maliyeti var, ama büyük test paketlerinde fark hâlâ çarpıcı.

Flaky (kararsız) testleri izole etmek bu noktada kritik hale geliyor — bir shard'daki flaky bir test tüm pipeline'ı kırmışsa, sorun o shard'a mı yoksa gerçek bir regresyona mı ait, ayırt etmek zorlaşıyor. Bunun için flaky testleri ayrı bir "quarantine" iş akışına almak ve ana pipeline'ı bunlardan izole tutmak, [etkili kod incelemesini ele aldığımız yazıda](/tr/posts/etkili-kod-incelemesi) bahsettiğimiz "gürültüyü sinyalden ayırma" prensibinin CI'daki karşılığı.

## Artifact Yeniden Kullanımı ve Deploy Gating

Bir derleme çıktısı (artifact) bir kez üretildikten sonra, sonraki aşamalarda (test, staging deploy, production deploy) yeniden derlenmek yerine doğrudan taşınmalı. Bu, "build once, deploy many" prensibi — aynı ikili veya container image'ının farklı ortamlara tutarlı şekilde ilerlemesini garanti ediyor ve her aşamada yeniden derleme riskini (ve süresini) ortadan kaldırıyor.

Deploy gating ise bir aşamanın sadece önceki aşama başarılıysa tetiklenmesini sağlıyor — affected build mantığıyla birleştiğinde, sadece etkilenen servislerin deploy edilmesini ve etkilenmeyenlerin dokunulmadan kalmasını sağlıyor. Bu, [sıfırdan CI/CD pipeline kurmayı anlattığımız genel rehberden](/tr/posts/cicd-pipeline-nasil-kurulur) farklı olarak, özellikle çok paketli bir depoda "hangi paket nereye gidiyor" sorusuna odaklanıyor.

## Cache Isınma Süresini Nasıl Kısaltırsınız?

Bir CI pipeline'ının ilk çalıştırması, henüz cache'de hiçbir şey olmadığı için her zaman en yavaş çalıştırma olacak — buna "soğuk cache" (cold cache) deniyor. Bunu azaltmanın pratik yolu, ana branch'e her merge'de bir "cache ısıtma" işi çalıştırıp en sık kullanılan görevlerin sonucunu önceden hesaplamak; böylece geliştiricilerin feature branch'lerinde çalıştırdığı görevler, sıfırdan değil ana branch'in cache'i üzerinden ilerliyor.

Bir diğer pratik detay, cache anahtarının neyi içerdiği. Cache anahtarı sadece kaynak kodu değil, kullanılan araç sürümlerini (Node.js, derleyici, paket yöneticisi) ve ortam değişkenlerini de kapsamalı — aksi halde farklı bir Node.js sürümüyle üretilmiş bir cache çıktısı, farklı bir sürümle çalışan bir işe yanlışlıkla servis edilebiliyor ve bu, izlenmesi zor "yerelde çalışıyor ama CI'da çalışmıyor" hatalarına yol açıyor.

## Depo Büyüdükçe Hızı Koruma Kontrol Listesi

```text
Monorepo CI'ı hızlı tutmak için izlenecek metrikler:
- Ortalama pipeline süresi (p50 ve p95, sadece ortalama değil)
- Cache hit oranı (yüzde olarak; %70'in altı araştırılmalı)
- Affected/toplam paket oranı (bu oran sürekli %80+ ise affected
  mantığınız yanlış çalışıyor olabilir)
- Flaky test sayısı ve quarantine'e alınan test yüzdesi
- En uzun kritik yol (critical path) süresi
```

## CI Sağlayıcısı Seçimi Bu Kararı Nasıl Etkiler?

GitHub Actions, GitLab CI ve CircleCI gibi genel amaçlı CI sağlayıcıları, affected build ve remote cache mantığını kendileri sağlamıyor — bu mantığı Turborepo veya Nx gibi bir araç üstlenmek zorunda. Buna karşılık bazı sağlayıcılar (örneğin Nx Cloud'un kendi CI entegrasyonu), affected tespiti ve cache'i doğrudan CI konfigürasyonuna gömüyor, bu da ek bir araç kurulumunu ortadan kaldırıyor ama sizi o sağlayıcıya daha sıkı bağlıyor.

Bu tercih, [Terraform mu Pulumi mi karşılaştırmamızda](/tr/posts/terraform-mu-pulumi-mi) bahsettiğimiz "araç kilidi" (vendor lock-in) değerlendirmesine benzer bir mantık gerektiriyor: entegre bir çözümün kurulum kolaylığı ile bağımsız bir aracın taşınabilirliği arasında bilinçli bir denge kurmak gerekiyor.

## Sıkça Sorulan Sorular

### Turborepo mu Nx mi seçmeliyim?

Basit, hızlı bir görev çalıştırıcı istiyorsanız ve koordinasyon henüz bir sorun değilse Turborepo iyi bir başlangıç. Proje sayısı arttıkça ve ekipler arası koordinasyon, gelişmiş bağımlılık grafiği görselleştirmesi veya yerleşik dağıtık görev yürütme gibi ihtiyaçlar öne çıktıkça Nx'e geçmek mantıklı.

### Remote cache güvenlik riski oluşturur mu?

Doğru yapılandırılmadığında evet — paylaşılan bir önbellek, gizli bilgi (secret) içeren derleme çıktılarını yanlışlıkla ekip dışına sızdırabilir. Cache'e giren çıktıların içeriğini denetlemek ve hassas veri barındırmadığından emin olmak, remote cache kurulumunun bir parçası olmalı.

### Affected build mantığı yanlış paketleri atlarsa ne olur?

Bu genelde bağımlılık grafiğinin eksik ya da yanlış tanımlanmasından kaynaklanıyor — örneğin dinamik import'lar veya konfigürasyon dosyaları üzerinden kurulan örtük bağımlılıklar grafikte görünmeyebilir. Böyle bir durumda periyodik olarak (örneğin haftada bir) tam bir derleme çalıştırmak, sessiz atlamaları yakalamanın pratik bir yolu.

### Küçük bir monorepo için bu araçlara gerek var mı?

10'dan az paketiniz varsa ve CI süreniz zaten birkaç dakikaysa muhtemelen hayır — npm/pnpm workspace'leri ve basit bir script yeterli olabilir. Bu araçların asıl değeri, paket sayısı ve CI süresi arttıkça ortaya çıkıyor.
