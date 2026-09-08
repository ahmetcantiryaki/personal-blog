---
title: "shadcn Registry ile Bileşenlerine Sahip Ol"
slug: "shadcn-registry-bilesenlerine-sahip-ol"
translationKey: "shadcn-registry-own-components-2026"
locale: "tr"
excerpt: "shadcn/ui bileşenleri npm paketi değil, projenize kopyalanan kaynak koddur. Private registry kurarak ekipler arası paylaşır, kontrolü elinizde tutarsınız."
category: "web-development"
tags: ["react", "frontend", "open-source", "developer-experience"]
publishedAt: "2026-09-08"
seoTitle: "shadcn Registry ile Bileşenlerine Sahip Ol"
seoDescription: "shadcn/ui bileşenleri npm paketi değil, kaynak koddur. Private registry kurarak ekipler arası paylaşın, tema ve güncelleme kontrolünü elinizde tutun."
---

Kısa cevap: shadcn/ui bileşenlerini bir npm paketi gibi kurmazsınız, CLI aracılığıyla kaynak kodunu doğrudan projenize kopyalarsınız. Bu "copy-in" modeli sayesinde bileşen sizin kodunuz olur; kendi private registry'nizi kurduğunuzda da bu bileşenleri versiyon kilidi yaşamadan ekipler arasında paylaşabilirsiniz.

Bir ekip, üçüncü parti bir UI kütüphanesinin her major sürümünde kırılan stilleri yamalamaktan bıkmıştı. Çözüm bir kütüphane değiştirmek değildi — kendi bileşen setlerini bir registry'ye taşıyıp, her projede `npx shadcn add` ile çekmeye başladılar. Altı ay sonra beş farklı repo aynı buton, form ve tablo bileşenlerini kullanıyordu; hiçbiri "npm paketini yükselttiğimde her şey bozuldu" sorunu yaşamadı, çünkü yükseltecek bir paket yoktu.

## shadcn Registry nedir, npm paketinden farkı ne?

shadcn/ui bir kütüphane değil, bir dağıtım mekanizmasıdır: `registry.json` ve `registry-item.json` şemalarıyla tanımlanmış bileşen tanımlarını, CLI üzerinden projenize kaynak kod olarak kopyalar. npm paketinde bileşen `node_modules` içinde kilitli kalır ve sürüm yükseltmesi sizi kütüphane yazarının kararlarına bağımlı kılar; shadcn modelinde bileşen `components/ui/button.tsx` gibi kendi dosyanızdır, istediğiniz satırı değiştirebilirsiniz.

| Yaklaşım | Bileşen nerede yaşar | Güncelleme kontrolü | Özelleştirme |
|---|---|---|---|
| npm UI kütüphanesi | `node_modules`, derlenmiş | Kütüphane yazarında | Sınırlı (prop/tema API'si ile) |
| shadcn registry | Kendi reponuzda, kaynak kod | Sizde | Sınırsız (dosyayı düzenlersiniz) |

Bu fark, 2025 Ağustos'unda gelen shadcn CLI 3.0 ile daha da güçlendi: namespaced registry desteği, gelişmiş kimlik doğrulama ve baştan yazılmış bir registry motoru eklendi. Artık `@registry-adi/bilesen-adi` formatıyla, herkese açık veya özel birden fazla registry'den bileşen kurabiliyorsunuz.

Bunun bir bedeli de var: npm paketinde bakım yükü kütüphane yazarında kalırken, copy-in modelinde bileşenin bakımı artık size ait. Bir güvenlik açığı veya erişilebilirlik hatası düzeltildiğinde, bunu kendi kopyanıza siz taşımalısınız. Private registry'nin asıl değeri tam burada ortaya çıkıyor: bakım yükünü her projede tekrarlamak yerine tek bir merkezi kaynakta üstlenip, oradan dağıtıyorsunuz.

## Mevcut bir UI kütüphanesinden nasıl geçilir?

Bir Material UI veya Ant Design projesini bir gecede shadcn'e taşımaya çalışmak riskli. Daha güvenli yol, yeni geliştirilen ekranlarda shadcn bileşenlerini kullanmaya başlamak, mevcut ekranları ise ihtiyaç oldukça (bir tasarım güncellemesi, bir hata düzeltmesi sırasında) kademeli olarak değiştirmek. İki kütüphane bir süre yan yana yaşayabilir; shadcn bileşenleri kendi CSS değişkenlerini kullandığı için, eski kütüphanenin stil sistemiyle çakışma riski düşük.

Bir ekip için pratik sıralama şöyle işliyor: önce en sık kullanılan üç-dört bileşeni (buton, input, modal) registry'ye taşıyın ve yeni ekranlarda kullanın; ardından tasarım sisteminizin geri kalanını, eski bileşenler "dokunulması gereken" hale geldikçe taşıyın. Bu, büyük patlamalı bir migrasyon yerine, doğal geliştirme akışının içine gömülü bir geçiş anlamına geliyor.

## components.json ve CLI nasıl çalışır?

`components.json` dosyası, projenizin hangi registry'lerden bileşen çekeceğini, stil tercihlerini ve dosya yollarını tanımlar. Özel bir registry eklemek için `registries` alanına URL ve kimlik doğrulama başlıklarını yazmanız yeterli:

```json
{
  "registries": {
    "@sirket-ui": {
      "url": "https://registry.sirketiniz.com/ui/{name}.json",
      "headers": {
        "Authorization": "Bearer ${SIRKET_REGISTRY_TOKEN}"
      }
    }
  }
}
```

Bileşen kurmak tek komut:

```bash
npx shadcn add @sirket-ui/data-table
```

CLI, `data-table.json` dosyasını registry'den çeker, bağımlılıklarını (`registry-item.json` içindeki `dependencies` ve `registryDependencies` alanları) çözer ve kaynak dosyaları doğrudan projenize yazar. Hiçbir şey `node_modules` içine gizlenmez; `git diff` ile tam olarak ne eklendiğini görürsünüz.

## Kendi private registry'nizi nasıl kurarsınız?

Bir private registry, aslında `registry.json` şemasına uyan statik JSON dosyaları sunan herhangi bir HTTP endpoint'idir — Vercel'de statik dosya barındırma, bir Next.js API route'u veya S3 bucket'ı yeterli olabilir. `registry.json` dosyasındaki `include` alanı, birden fazla alt registry'yi tek bir kaynaktan birleştirmenizi sağlar; böylece "tasarım sistemi" registry'niz, "form bileşenleri" ve "tablo bileşenleri" gibi ayrı registry'leri içine alabilir.

Kimlik doğrulama için `headers` alanı ortam değişkenlerini destekler, yani her geliştirici kendi token'ıyla kimliğini doğrular ama registry içeriği tüm ekip için aynı kalır. Bu, iç kaynaklı bir npm registry (ör. Verdaccio) kurmaktan daha hafif bir altyapı: yayınlama adımı yok, sadece JSON dosyalarını bir yere koyup URL'i paylaşıyorsunuz.

## CSS değişkenleriyle temalama nasıl çalışır?

shadcn bileşenleri, sabit kodlanmış renkler yerine CSS custom property'lerine (`--primary`, `--radius`, `--background` gibi) referans verir. Marka renklerinizi veya karanlık/aydınlık tema değerlerinizi tek bir `globals.css` dosyasında tanımlarsınız; bileşenlerin kendisine dokunmanıza gerek kalmaz. Birden fazla projede aynı registry'yi kullanan ekipler, bu değişken setini de registry'nin bir parçası olarak dağıtabilir — böylece her yeni proje aynı marka kimliğiyle başlar.

Pratikte bu, `registry-item.json` içinde bir "tema" kaydı tanımlayıp, `npx shadcn add @sirket-ui/tema` komutuyla `globals.css` dosyasına CSS değişkenlerini yazdırmak anlamına geliyor. Yeni bir proje başlatan bir geliştirici, tek komutla hem bileşenleri hem de marka renklerini kurmuş oluyor; tasarım ekibinin renk paletini değiştirdiği bir durumda ise tek bir dosyayı güncelleyip tüm projelere dağıtmak yeterli.

## Bileşenleri kara kutu bir paket olmadan nasıl güncel tutarsınız?

npm paketinde güncelleme `npm update` ile gelir ve neyin değiştiğini changelog'dan öğrenirsiniz; shadcn modelinde güncelleme, `npx shadcn diff` ile registry'deki güncel sürüm ile kendi dosyanız arasındaki farkı görüp, hangi değişikliği alıp almayacağınıza siz karar verirsiniz. Bu, otomatik güncellemenin rahatlığını kaybettirir ama beklenmedik kırılmaları da ortadan kaldırır — çünkü hiçbir güncelleme sizin onayınız olmadan koduna girmez.

Pratikte bu, bir bileşeni özelleştirdiyseniz (örneğin şirketinizin buton varyantını eklediyseniz) registry'deki güncellemenin sizi hiç etkilemeyeceği, ama kritik bir erişilebilirlik düzeltmesi geldiğinde bunu bilinçli olarak alabileceğiniz anlamına geliyor.

Next.js ile Server Components kullanan projelerde bu bileşenleri entegre etmek isteyenler [React Server Components rehberimize](/tr/posts/nextjs-react-server-components) bakabilir. Tailwind ile birlikte kullanırken sık yapılan hatalar için [Tailwind CSS hataları yazımız](/tr/posts/tailwind-css-hatalari) faydalı olabilir; Tailwind v4'e geçiş yapıyorsanız [geçiş rehberimiz](/tr/posts/tailwind-css-v4-gecis-rehberi) adım adım anlatıyor. Web Components'in 2026'da nerede durduğunu merak edenler [bu karşılaştırmaya](/tr/posts/web-components-2026-hazir-mi) göz atabilir. Daha fazla web geliştirme içeriği için [web geliştirme kategorimizi](/tr/category/web-gelistirme) inceleyebilirsiniz.

Resmi şema ve CLI davranışı için [shadcn/ui'nin registry dokümantasyonunu](https://ui.shadcn.com/docs/registry/registry-json) ve [components.json referansını](https://ui.shadcn.com/docs/components-json) kaynak olarak kullanabilirsiniz.

## Sıkça Sorulan Sorular

### shadcn/ui bir component kütüphanesi mi, yoksa bir araç mı?

İkisi de değil tam olarak — bir dağıtım mekanizması. Kod, sizin projenize kopyalanan açık kaynaklı dosyalardır; shadcn CLI sadece bu kopyalama işlemini ve registry'lerle iletişimi yönetir. Kurulumdan sonra shadcn'e bağımlı değilsinizdir, kendi kodunuza bağımlısınızdır.

### Private registry kurmak için ayrı bir sunucuya mı ihtiyacım var?

Hayır. `registry.json` şemasına uyan statik JSON dosyaları sunan herhangi bir HTTP endpoint yeterli — bir CDN, bir S3 bucket'ı veya basit bir API route bile çalışır. Karmaşık bir paket kayıt sunucusu (Verdaccio gibi) kurmanıza gerek yok.

### Bir bileşeni özelleştirdikten sonra güncellemeleri kaçırır mıyım?

Otomatik olarak hayır kaçırmazsınız ama otomatik olarak da almazsınız. `npx shadcn diff` komutu registry'deki güncel sürümle sizinkini karşılaştırır; hangi değişikliği manuel olarak entegre edeceğinize siz karar verirsiniz. Bu, npm paket güncellemesinden daha fazla emek ister ama beklenmedik kırılma riskini ortadan kaldırır. Ekip büyüdükçe bu diff işlemini periyodik bir görev haline getirmek — örneğin ayda bir registry güncellemelerini toplu gözden geçirmek — hem güncel kalmanızı hem de kimsenin fark etmeden eski bir bileşende kalmamasını sağlar. Bu küçük disiplin, npm paketinin otomatik güncelleme rahatlığını kısmen geri kazandırırken kontrolü de elinizde tutmanızı sağlıyor, üstelik ekstra bir araç kurmanıza gerek kalmadan.

### Namespaced registry (@ad/bilesen) ne zaman gerekli?

Birden fazla registry'den bileşen çekiyorsanız (örneğin hem topluluk registry'si hem şirket içi registry) namespace, hangi kaynaktan geldiğini netleştirir ve isim çakışmalarını önler. Tek bir private registry kullanıyorsanız namespace zorunlu değil ama okunabilirlik için önerilir; ileride ikinci bir registry eklemeniz gerektiğinde mevcut kurulumu bozmadan yeni bir namespace tanımlamanız yeterli olur.
