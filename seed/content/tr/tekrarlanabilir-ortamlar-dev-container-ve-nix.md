---
title: "Tekrarlanabilir Ortamlar: Dev Container ve Nix"
slug: "tekrarlanabilir-ortamlar-dev-container-ve-nix"
translationKey: "reproducible-dev-environments-nix-devcontainers"
locale: "tr"
excerpt: "Kısa cevap: hızlı başlamak için Dev Container, bit-bit aynı ortam için Nix flakes kullan; ikisini bir dev container içinde birleştirmek de mümkün."
category: "devops-cloud"
tags: ["containers", "devops", "developer-experience", "best-practices"]
publishedAt: "2026-10-28"
seoTitle: "Dev Container mı Nix mi? Tekrarlanabilir Ortam Rehberi"
seoDescription: "Dev Container ve Nix flakes'i öğrenme eğrisi, başlatma hızı ve CI'da tekrar kullanım açısından karşılaştırıyor, ikisini birleştirme yolunu gösteriyoruz."
---

Kısa cevap: ekibin hızlı onboarding ve editör entegrasyonu istiyorsa Dev Container'lar daha az sürtünmeyle başlar; sonuca kadar her bağımlılığın bit-bit aynı olmasını istiyorsan Nix flakes daha güçlü bir garanti verir. İkisini birlikte kullanmak da mümkün — bir dev container'ın içine Nix kurup paket yönetimini ona bırakabilirsin.

## "Benim makinemde çalışıyor" sorunu ne kadar pahalı?

Yeni bir geliştiricinin ilk günü, yanlış Node sürümü, eksik bir sistem kütüphanesi veya farklı bir OpenSSL yüzünden saatler kaybedebiliyor. Bir ekip içinde bu maliyeti ölçmek zor ama belirti açık: "bende çalışıyor, sende neden çalışmıyor" mesajı Slack'te ne kadar sık geçiyorsa, ortam tanımınız o kadar zayıf. İki yaklaşım da aynı kök nedeni çözüyor — makine başına elle kurulan bağımlılıklar yerine, deklaratif ve sürüm kontrolüne alınmış bir ortam tanımı.

## Dev Container nedir ve nasıl çalışır?

Dev Container, `.devcontainer/devcontainer.json` dosyasında (veya `.devcontainer/<klasör>/devcontainer.json` altında) tanımlanan, bir container'ı tam bir geliştirme ortamı olarak standartlaştıran açık bir spesifikasyon. [containers.dev spesifikasyonu](https://containers.dev/implementors/spec), bir temel şema ile araca özgü bir ana şemadan oluşuyor; bir imaj etiketi, container oluşturulduğunda yerel yapılandırmayla birleştirilecek metadata da taşıyabiliyor.

Pratikte bu, VS Code veya Codespaces'in `devcontainer.json`'ı okuyup doğru imajı çekmesi, uzantıları kurması ve editörü container'ın içine bağlaması anlamına geliyor. Bir geliştirici repoyu klonlar, "Reopen in Container"a tıklar ve dakikalar içinde doğru Node, doğru CLI araçları ve doğru ortam değişkenleriyle çalışır hale gelir. Spesifikasyonun [JSON şeması](https://containers.dev/implementors/json_schema/), hangi alanların geçerli olduğunu araçlar arasında tutarlı tutuyor — bu da VS Code'da yazdığın bir `devcontainer.json`'ın farklı bir IDE'de veya CI runner'ında da aynı şekilde yorumlanmasını garantiliyor.

Onboarding tarafındaki gerçek kazanç şu: yeni bir geliştirici, "hangi Node sürümü, hangi sistem paketleri" sorularını sormadan, tek bir "Reopen in Container" tıklamasıyla ilk gününde kod yazmaya başlıyor. Bu, özellikle sık değişen stajyer veya kontrat geliştirici akışı olan ekiplerde, onboarding süresini günlerden saatlere, bazen dakikalara indirebiliyor.

```json
{
  "name": "woyable-dev",
  "image": "mcr.microsoft.com/devcontainers/typescript-node:22",
  "features": {
    "ghcr.io/devcontainers/features/docker-in-docker:2": {}
  },
  "postCreateCommand": "pnpm install",
  "customizations": {
    "vscode": {
      "extensions": ["dbaeumer.vscode-eslint"]
    }
  }
}
```

## Nix flakes nedir ve hangi garantiyi veriyor?

Nix flakes, bir geliştirme kabuğunu (`devShells.<system>.default`) ve onun tüm bağımlılıklarını — nixpkgs sürümü dahil — `flake.lock` dosyasında kilitleyen bir yapılandırma biçimi. `nix develop` komutu bu kabuğa girer; `nix develop github:org/repo#name` ise bir ekip arkadaşının repoyu hiç klonlamadan, doğrudan uzak bir depodan aynı kabuğu çalıştırmasına izin verir.

Flakes hâlâ resmi olarak "deneysel" işaretli ama üretimde yaygın şekilde kullanılıyor. Dev Container'ların aksine Nix, bir container çalışma zamanına bağımlı değil — kabuk doğrudan ana makinede çalışır, bu da başlatmayı container katmanı olmadan hızlandırabilir. [Nix'in 2026 pratiklerini özetleyen bir yazıya göre](https://dev.to/pickuma/nixos-nixpkgs-in-2026-reproducible-dev-environments-without-docker-38o1), bu yaklaşımın en büyük pratik kazancı, bir ekip arkadaşının "clone, kur, bekle" döngüsünü tamamen atlayıp doğrudan `nix develop` ile çalışmaya başlayabilmesi.

Nix'in verdiği garanti, Dev Container'ın veremediği bir şeyi kapsıyor: `flake.lock` dosyası, nixpkgs'in o anki tam sürümünü de içerdiği için, bir paketin alt bağımlılıklarından birinin sessizce güncellenip davranışı değiştirmesi riski ortadan kalkıyor. Bir Dev Container imajı ise, imajın kendisi sabitlense de, imaj içindeki paket yöneticisinin (apt, npm) o an çektiği sürümler üzerinde bu garantiyi vermiyor.

```text
{
  description = "woyable dev shell";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { self, nixpkgs }:
    let pkgs = nixpkgs.legacyPackages.x86_64-linux;
    in {
      devShells.x86_64-linux.default = pkgs.mkShell {
        buildInputs = [ pkgs.nodejs_22 pkgs.pnpm ];
      };
    };
}
```

## Dev Container ve Nix flakes birbirinden nerede ayrılıyor?

İkisi de deklaratif ve sürüm kontrollü ama farklı katmanlarda çalışıyor: Dev Container bir container imajını standartlaştırırken, Nix paket düzeyinde bit-bit aynılığı garanti ediyor.

| | Dev Container | Nix Flakes |
|---|---|---|
| Öğrenme eğrisi | Düşük — JSON dosyası, bilinen imajlar | Yüksek — Nix dili, fonksiyonel paradigma |
| Başlatma hızı | Container indirme/oluşturma süresine bağlı | Kabuk girişi genelde saniyeler sürer (cache'lenmişse) |
| Editör entegrasyonu | VS Code ve Codespaces'te yerleşik destek | Editör-agnostik; entegrasyon ekstra kurulum gerektirir |
| Ekip benimsemesi | Kolay — çoğu geliştirici container kavramını bilir | Zor — Nix dilinin sözdizimi alışılmadık |
| CI'da tekrar kullanım | Aynı imaj CI'da da çekilebilir | Aynı flake CI'da da `nix develop -c` ile çalışır |
| Bit-bit aynılık garantisi | İmaj etiketine bağlı, "latest" kullanılırsa kayar | `flake.lock` ile tam ve kanıtlanabilir |

## İkisini birleştirmek mantıklı mı?

Evet, ve bu kombinasyon her iki dünyanın avantajını alıyor: bir Dev Container imajının içine Nix kurup paket yönetimini tamamen flake'e bırakabilirsin. Böylece editör entegrasyonunu ve Codespaces desteğini Dev Container'dan alırken, bağımlılık kilidini ve bit-bit aynılığı Nix'ten alırsın. Bu düzende `devcontainer.json`'daki `postCreateCommand`, container ayağa kalktıktan sonra `nix develop` çalıştırır; geliştirici için fark edilmez, ama CI ile yerel ortam arasındaki fark ortadan kalkar.

## Bu yaklaşımların ödediği gerçek bedel ne?

Dev Container tarafında bedel, container çalışma zamanına (Docker veya benzeri) bağımlılık ve imaj boyutunun büyümesiyle yavaşlayan başlatma süresi. Nix tarafında bedel ise öğrenme eğrisi: Nix'in fonksiyonel dili, çoğu geliştiricinin günlük iş akışından uzak, ve bir ekibi buna ikna etmek zaman alır. Kendi değerlendirmem: küçük-orta ekipler için Dev Container'la başlamak, acı gerçekten "hangi sürüm" sorularından geliyorsa Nix'e geçmek ya da ikisini birleştirmek daha gerçekçi bir yol.

Bu kararı verirken ekibin bileşimine de bakmak gerekiyor: ekipte zaten Nix deneyimi olan biri varsa öğrenme eğrisi maliyeti düşer ve doğrudan Nix'le başlamak mantıklı olabilir. Ekip tamamen Nix'e yabancıysa, önce Dev Container'la başlayıp belirli bir acı noktası (örneğin CI'da "çalışıyor ama farklı davranıyor" hatalarının tekrar etmesi) ortaya çıktığında Nix'i değerlendirmek, riski daha kontrollü bir şekilde almanı sağlıyor.

Bir üçüncü yol da var: ekibin çoğu Dev Container kullanırken, altyapı veya platform ekibindeki birkaç kişi kendi makinesinde Nix'i deneyimsel olarak kullanabilir. Bu, tüm ekibi aynı anda ikna etmeden, Nix'in gerçek faydasının bu belirli projede ölçülebilmesini sağlıyor — ve sonuçlar olumluysa, geçişi daha az riskli bir şekilde genişletebilirsin. Sonuçlar olumlu çıkmazsa da kaybın sınırlı kalması, bu küçük ölçekli denemenin en büyük avantajı.

Her iki yaklaşım da [CI/CD pipeline'ının](/tr/posts/cicd-pipeline-nasil-kurulur) kendisini etkiler — aynı ortam tanımı CI'da da kullanılabiliyorsa, "CI'da geçiyor ama yerelde geçmiyor" sınıfı hatalar tamamen ortadan kalkar. [AI ajanlarını CI/CD'ye bağlayan](/tr/posts/ai-ajanlari-cicd-guvenle-baglamak) ekipler için bu tutarlılık özellikle değerli, çünkü bir ajanın "benim ortamımda çalıştı" demesi, insan geliştiricininkinden daha az güven verir. Bir [iç geliştirici portalı](/tr/posts/ic-gelistirici-portali-nasil-kurulur) kuran ekipler, ortam tanımını bu portalın bir parçası olarak sunabilir. Araç zincirini sadeleştirme konusunda aynı mantık [Biome ve Oxlint'e geçişte](/tr/posts/eslint-yerine-biome-ve-oxlint) de geçerli: daha az moving part, daha az "bende farklı davranıyor" hatası.

## Sıkça Sorulan Sorular

### Dev Container ve Nix flakes aynı anda kullanılabilir mi?

Evet. Bir Dev Container imajının içine Nix kurup paket yönetimini flake'e bırakmak yaygın bir desen. Böylece editör entegrasyonu Dev Container'dan, bağımlılık kilidi ve bit-bit aynılık garantisi Nix'ten gelir.

### Nix flakes neden hâlâ "deneysel" işaretli?

Nix ekibi flakes özelliğini resmi olarak kararlı sürüme almadı, ama özellik üretimde yıllardır yaygın şekilde kullanılıyor. "Deneysel" etiketi, komut satırı arayüzünün gelecekte küçük değişiklikler görebileceği anlamına geliyor, temel mekanizmanın güvenilmez olduğu anlamına gelmiyor.

### Küçük bir ekip hangisiyle başlamalı?

Çoğu küçük-orta ekip için Dev Container daha düşük sürtünmeyle başlar: JSON dosyası yazman, bilinen bir imaj seçmen yeterli ve VS Code ile Codespaces'te yerleşik destek var. Asıl acı "hangi sürüm" sorularından geliyorsa ya da CI'da tam bit-bit aynılık gerekiyorsa Nix'e geçmek ya da ikisini birleştirmek daha uygun.

### Dev Container imajı "latest" etiketi kullanınca ne bozulur?

"latest" etiketi zamanla farklı bir imaja işaret edebilir, bu da bugün çalışan bir ortamın bir ay sonra farklı paket sürümleriyle ayağa kalkmasına yol açar. Sabit bir imaj etiketi veya dijest kullanmak, Dev Container'ın bit-bit aynılık garantisini Nix'in `flake.lock` seviyesine yaklaştırır.
