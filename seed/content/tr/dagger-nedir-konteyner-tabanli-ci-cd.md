---
title: "Dagger Nedir? Konteynerle Taşınabilir CI/CD"
slug: "dagger-nedir-konteyner-tabanli-ci-cd"
translationKey: "dagger-ci-as-code-2026"
locale: "tr"
excerpt: "Dagger her pipeline adımını konteynerde çalıştırır, pipeline'ı gerçek kodla tanımlar; aynı çalıştırma dizüstünüzde ve CI'da aynı sonucu verir."
category: "devops-cloud"
tags: ["ci-cd", "devops", "containers", "automation"]
publishedAt: "2026-10-18"
seoTitle: "Dagger Nedir? Konteyner Tabanlı CI/CD Açıklaması"
seoDescription: "Dagger, YAML pipeline'ları yerine gerçek kod kullanır ve her adımı bir konteynerde çalıştırır; bu sayede CI, dizüstünüzde aynı davranır. İşte nasıl çalışır."
---

[Dagger](https://dagger.io/), her CI/CD pipeline adımını bir OCI konteyneri içinde çalıştıran ve pipeline'ı YAML yerine gerçek bir programlama dilinde kod olarak tanımlamanızı sağlayan açık kaynaklı bir motor. Her adım sadece bir konteyner çağrısı olduğu için, aynı pipeline dizüstünüzde, GitHub Actions'ta veya başka herhangi bir CI runner'ında tam olarak aynı sonucu üretir.

## Dagger gerçekte ne yapıyor?

Dagger, normalde bir CI sağlayıcısının YAML'ı olarak yazdığınız mantığı — checkout, kurulum, build, test, push — alıp her adımı Docker veya başka bir OCI uyumlu çalışma zamanı üzerinden bir konteyner içinde çalışan bir fonksiyon çağrısına dönüştürüyor. Pipeline'ın kendisi Go, Python, TypeScript veya [desteklenen birkaç SDK dilinden](https://docs.dagger.io/) biriyle yazılmış bir Dagger "modülü"; yani düz metin `run:` satırları yerine gerçek fonksiyonlar, gerçek tipler ve gerçek bir debugger elde ediyorsunuz.

Pratikteki gerçek fark, pipeline'ın nerede yaşadığı: belirli bir CI sağlayıcısının sunucularına yüklendiğinde anlam kazanan bir YAML lehçesi değil, kod tabanınızın bir parçası olarak sürümlenen ve diğer her kod gibi gözden geçirilen bir yapı.

## Her şeyi konteynerde çalıştırmak neden önemli?

Önemli çünkü "benim makinemde çalışıyor" ile "CI'da çalışıyor" arasındaki boşluğu kaldırıyor. Geleneksel bir CI işi, build'inizi CI sağlayıcısının özel runner imajında, o runner'ın taşıdığı araç sürümleri ve ortam değişkenleriyle çalıştırır — bu da nadiren bir geliştiricinin dizüstü bilgisayarıyla birebir aynıdır. Dagger'ın konteynerleri, bir adım için aynı işletim sistemini, aynı araç sürümlerini ve aynı ortamı yerelde veya bir runner'da sabitler; böylece dizüstünüzde geçen bir pipeline, tesadüfen değil aynı nedenle CI'da da geçer.

İçerik adresli (content-addressed) önbellekleme bu faydanın ikinci yarısı. Her konteyner katmanı ve her adımın girdileri hash'lenir; bu sayede bir pipeline'ı yeniden çalıştırmak, girdiler değişmediği sürece önbelleğe alınmış katmanları — yerelde veya CI'da — yeniden kullanır. Bu da başarısız olan bir CI adımını, bir commit push edip CI çalışmasını beklemeden, aynı Dagger çağrısını kendi makinenizde yeniden çalıştırarak ve aynı önbelleğe düşerek yeniden üretebileceğiniz anlamına geliyor.

```bash
# CI'ın çalıştıracağı pipeline fonksiyonunu yerelde çalıştır
dagger call build-and-test --source=.

# GitHub Actions adımı içinden çağır — aynı fonksiyon, aynı konteyner
- name: CI
  run: dagger call build-and-test --source=.
```

## Bir Dagger pipeline'ı nasıl yazılır?

Her biri konteyner işlemlerini zincirleyen fonksiyonlar açığa çıkaran bir modül yazıyorsunuz — bir temel imaj çekmek, kaynağınızı bağlamak, bir komut çalıştırmak, bir çıktıyı dışa aktarmak. Python'da minimal bir pipeline fonksiyonu şöyle görünüyor:

```python
import dagger
from dagger import dag, function, object_type

@object_type
class CiPipeline:
    @function
    async def build_and_test(self, source: dagger.Directory) -> str:
        return await (
            dag.container()
            .from_("python:3.12-slim")
            .with_directory("/app", source)
            .with_workdir("/app")
            .with_exec(["pip", "install", "-r", "requirements.txt"])
            .with_exec(["pytest", "-q"])
            .stdout()
        )
```

Bu fonksiyon, `dagger call build_and_test` ile, Dagger CLI'ına shell çıkışı yapan bir CI YAML adımından veya başka bir Dagger modülünden çağrılabilir — pipeline mantığı, onu kimin çağırdığına bağlı olarak değişmiyor.

## GitHub Actions veya GitLab CI'a hâlâ ihtiyacınız var mı?

Evet, genellikle — Dagger adım mantığını değiştirir, tetikleyiciyi değil. Çoğu ekip, bir push veya pull request'e tepki veren mevcut CI sağlayıcısını (GitHub Actions, GitLab CI, CircleCI, Jenkins) korur ve tek gerçek adım olarak `dagger call <fonksiyon>` çağırmasını sağlar. CI sağlayıcısı ince bir tetikleyiciye dönüşür; gerçek build/test/deploy mantığı, önbellekleme davranışı ve konteyner tanımları Dagger modülünde yaşar ve daha sonra bir yeniden yazım gerekmeden başka bir runner'a taşınabilir.

## Dagger, geleneksel bir YAML pipeline'a karşı nasıl duruyor?

| | Geleneksel CI YAML | Dagger modülü |
|---|---|---|
| Mantık nerede yaşıyor | CI sağlayıcısının YAML lehçesi | Gerçek kod (Go, Python, TypeScript ve diğerleri) |
| Yerel yeniden üretilebilirlik | Ayrı bir "act" tarzı emülatör olmadan genelde imkânsız | Yerel destek — `dagger call` aynı konteyner adımını çalıştırır |
| Önbellekleme | Sağlayıcıya özel cache action'ları, yanlış yapılandırmaya açık | İçerik adresli, yerel ve CI çalışmaları arasında otomatik |
| Bir hatayı ayıklama | Push et, bekle, logu oku | Aynı önbelleğe karşı aynı fonksiyonu yerelde yeniden çalıştır |
| CI sağlayıcıları arasında taşınabilirlik | Düşük — mantık bir sağlayıcının YAML şemasına bağlı | Yüksek — tetikleyiciyi değiştir, modülü koru |

## Gerçek takaslar neler?

Asıl maliyet, ekibinizin öğrenmesi gereken yeni bir soyutlama katmanı: mühendisler bir CI sağlayıcısının YAML referansını okumak yerine Dagger'ın SDK dokümantasyonunu okuyor ve konteyner zincirleri cinsinden düşünüyor. Beş satırlık bir CI dosyasına sahip küçük, tek dilli bir proje için bu muhtemelen değmez. Değer, pipeline'lar sadece CI loglarında hata ayıklamayı sıkıntılı hâle getirecek kadar karmaşıklaştığında veya bir ekip aynı mantığı birden fazla CI sağlayıcısında çalıştırdığında ya da pipeline değişikliklerini production CI'a güvenmeden önce yerelde test etmesi gerektiğinde ortaya çıkıyor.

## Dagger neyi devralmıyor?

Dagger pipeline mantığını devralıyor, CI platformunun kendisini değil. Kuyruk yönetimi, hangi runner'ın işi aldığı, secret'ların nasıl saklandığı ve kullanıcı arayüzünden hangi job'ların geçtiğini görmek gibi konular hâlâ CI sağlayıcınızın sorumluluğunda kalıyor; Dagger bunların yerine geçmiyor, bunların üzerinde çalışan adımı değiştiriyor. Secret'lar tipik olarak CI sağlayıcısının kendi mekanizmasıyla (örneğin GitHub Actions secrets) enjekte ediliyor ve Dagger modülüne ortam değişkeni veya dosya olarak geçiliyor; Dagger kendi secret deposunu icat etmiyor. Bu ayrım önemli, çünkü bazı ekipler Dagger'ı CI sağlayıcısının tam bir ikamesi olarak değerlendirip hayal kırıklığına uğruyor — oysa Dagger'ın kapsadığı kısım, günlük hata ayıklamanızın acı veren kısmı: pipeline mantığının kendisi.

## Benim görüşüm

Dagger'ın gerçek vaadi "daha hızlı CI" değil, "normal kod gibi çalıştırıp hata ayıklayabileceğiniz CI." Bu, YAML pipeline'larıyla çalışmanın en kötü kısmı için gerçek bir çözüm — push et, bekle, logu oku, tahmin et, tekrarla döngüsünün on dakikası. Ekim 2026'da bunu benimsemeye değip değmeyeceği, ekibinizin bu döngüden şu an ne kadar acı çektiğine bağlı; zaten güvenilir çalışan beş adımlık bir build-deploy YAML'ına sahip ekipler kazanacak çok az şeye sahipken, birden fazla dilde veya birden fazla CI sağlayıcısında çok aşamalı build'lerle boğuşan ekipler en çok fayda görüyor.

İlgili okumalar: pipeline otomasyonundaki ilişkili bir trend için [AI ajanlarını CI/CD'ye güvenle bağlama](/tr/posts/ai-ajanlari-cicd-guvenle-baglamak) rehberimize, Dagger'ın yerini aldığı YAML-öncelikli taban için [CI/CD pipeline nasıl kurulur](/tr/posts/cicd-pipeline-nasil-kurulur) yazımıza ve aynı önbellekleme sorununa başka bir açıdan bakan [monorepo CI/CD önbellekleme](/tr/posts/monorepo-ci-cd-onbellek-etkilenen-yapilar) yazımıza bakabilirsiniz. CI'ınızın yanında ne kadar altyapı çalıştıracağınıza karar veriyorsanız, [2026'da hâlâ Kubernetes'e ihtiyacınız var mı?](/tr/posts/hala-kubernetes-gerekli-mi-2026) ve [Kamal veya Coolify ile Kubernetes'siz deploy](/tr/posts/kubernetessiz-deploy-kamal-coolify) yazılarımız dağıtım tarafını ele alıyor. Daha fazlası için [DevOps & Bulut](/tr/category/devops-bulut) bölümümüze bakabilirsiniz.

## Sıkça Sorulan Sorular

### Dagger ne için kullanılır?
Dagger, CI/CD pipeline'larını YAML yerine gerçek kod olarak yazmak için kullanılıyor; her adım bir konteyner içinde çalıştığı için pipeline, bir geliştiricinin dizüstünde veya bir CI sağlayıcısının runner'ında çalışsa da aynı davranıyor.

### Dagger, GitHub Actions veya GitLab CI'ın yerini alır mı?
Hayır, çoğu ekip push ve pull request'lere tepki veren mevcut CI sağlayıcısını tetikleyici olarak korur ve gerçek build, test ve deploy mantığı için bir Dagger modülünü çağırmasını sağlar — Dagger adım mantığının yerini alır, zamanlama ve tetikleyici katmanının değil.

### Dagger pipeline'ları hangi dillerde yazılabilir?
Ekim 2026 itibarıyla Dagger, yaygın olarak Go, Python, TypeScript, PHP, Java, .NET, Elixir ve Rust olarak belirtilen birkaç dil için SDK sunuyor — SDK desteği zamanla genişlediği için kesin güncel listeyi [Dagger'ın kendi dokümantasyonundan](https://docs.dagger.io/) ve [GitHub deposundan](https://github.com/dagger/dagger) kontrol edin.

### Bir Dagger pipeline'ını CI'a push etmeden test edebilir miyim?
Evet — bu, Dagger'ın temel satış noktalarından biri. `dagger call <fonksiyon>` komutunu yerelde çalıştırmak, CI'ın çalıştıracağı tam olarak aynı konteynerli adımı yürütür ve aynı içerik adresli önbelleğe düşer; böylece bir commit push etmeden önce başarısız olan bir adımı kendi makinenizde yeniden üretip hata ayıklayabilirsiniz.
