---
title: "Sıfırdan CI/CD Pipeline Nasıl Kurulur"
slug: "cicd-pipeline-nasil-kurulur"
translationKey: "build-cicd-pipeline"
locale: "tr"
category: "devops-cloud"
tags: ["ci-cd", "devops", "automation", "deployment"]
publishedAt: "2026-07-06"
excerpt: "CI/CD pipeline nasıl kurulur? Aşamalar, Node 24 üzerinde çalışan bir GitHub Actions yapılandırması, test kapıları, dağıtım ve kaçınılması gereken hatalar."
seoTitle: "Sıfırdan CI/CD Pipeline Nasıl Kurulur (2026)"
seoDescription: "CI/CD pipeline nasıl kurulur adım adım: 2026'ya hazır bir GitHub Actions yapılandırmasıyla derleme, test ve dağıtımı gerçek kapılar ve geri alma ile kurun."
---

2 Haziran 2026 sabahı, bir sürü yeşil pipeline sessizce kırmızıya döndü. O gün GitHub tüm JavaScript action'larını varsayılan olarak Node.js 24 üzerinde çalışmaya zorladı ve hâlâ `actions/checkout@v3` sabitleyen ekipler kendilerini bir deprecation duvarının önünde buldu. Çoğu için düzeltme on dakika sürdü: `@v6`'ya yükselt, bitti. Ama panikleyenler, kendi pipeline'ını hiç gerçekten anlamamış olanlardı. İki yıl önce bir YAML dosyası kopyalamış ve dua ediyorlardı.

O ekip olmayın. İşte gerçekten anladığınız bir CI/CD pipeline nasıl kurulur ve bugün çalışan bir yapılandırmayla nasıl başlanır.

## CI/CD pipeline nedir ve neden kurulur?

CI/CD pipeline, kodu commit'ten üretime elle müdahale olmadan taşıyan otomatik bir dizidir. **CI** (sürekli entegrasyon) her değişikliği derleyip test eder; böylece hatalar yayın gününde değil dakikalar içinde ortaya çıkar. **CD** (sürekli teslimat ya da dağıtım) testi geçen sürümleri otomatik olarak staging veya üretime gönderir.

Bunu, yayınlamanın yavaş ve hataya açık kısımlarını ortadan kaldırmak için kurarsınız. Elle yapılan dağıtımlar zamanla sapar, test atlar ve ritüeli bilen tek kişiye bağımlı kalır. Bir pipeline her seferinde aynı adımları çalıştırır, bozuk kodun merge olmasını engeller ve kimin neyi değiştirdiğine dair kayıt tutar. İki kişiyi aşan her ekipte ilk ayında kendini amorti eder. Konteyner kullanıyorsanız bunu [üretim için Docker en iyi pratikleri](/tr/posts/docker-en-iyi-pratikleri) rehberimizle birleştirin.

## CI/CD pipeline aşamaları nelerdir?

Standart bir pipeline altı aşamadan geçer; her biri, kötü kodun kullanıcılara ulaşmasını durduran bir kapıdır.

1. **Kaynak.** Bir push ya da pull request pipeline'ı tetikler. Runner, tam olarak sizin commit'inizi çeker.
2. **Derleme.** Bağımlılıkları kur ve uygulamayı derle veya paketle. Bu başarısız olursa alt adımların hiçbiri çalışmaz.
3. **Test.** Birim, entegrasyon ve zaman zaman uçtan uca testleri çalıştır. Bu, güvenlik ağınızdır.
4. **Tarama.** Lint, tip denetimi, güvenlik ve bağımlılık taramalarını çalıştır; statik analizin yakalayabildiği sorunları burada yakala.
5. **Paketleme.** Dağıtılabilir bir çıktı üret: bir Docker imajı, bir paket ya da sürümlenmiş bir yayın.
6. **Dağıtım.** Çıktıyı staging'e gönder, duman (smoke) testlerini çalıştır, sonra üretime terfi ettir.

Hızlı ve ucuz aşamaları başa koyun. Bir lint hatası, 12 dakikalık test paketinden sonra değil, 20 saniyede başarısız olmalı.

## GitHub Actions ile CI/CD pipeline nasıl kurulur?

Tek bir workflow dosyasıyla başlayın ve aşamaları kademeli ekleyin. Aşağıda, `main` dalına her push'ta derleyip test eden ve dağıtan, bir Node.js uygulaması için gerçek ve minimal bir pipeline var. GitHub'ın barındırdığı runner'larda çalışır, yani yönetecek bir sunucu yok. Güncel action major sürümlerine dikkat edin: runner'lar artık varsayılan olarak Node 24 çalışma zamanını kullandığı için `checkout@v6` ve `setup-node@v6` gerekiyor. Node 24'ün kendisi de Nisan 2028'e dek desteklenen [aktif LTS hattı](https://nodejs.org/en/about/previous-releases).

```yaml
# .github/workflows/ci.yml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:

jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with:
          node-version: "24"
          cache: "npm"
      - run: npm ci
      - run: npm run lint
      - run: npm test -- --coverage
      - run: npm run build

  deploy:
    needs: build-test          # yalnızca build-test geçerse çalışır
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v6
      - run: echo "Dağıtılıyor commit ${{ github.sha }}"
        # kendi dağıtım komutunuzla değiştirin, örn. flyctl deploy
```

İki şey bunu güvenli kılıyor. `needs: build-test` satırı, **her test geçmeden deploy'un asla çalışmayacağı** anlamına gelir. `if: github.ref == 'refs/heads/main'` koşulu ise pull request'lerin test edilmesini ama asla dağıtılmamasını sağlar. Bu dosyayı commit'leyin, push edin ve çalıştığını görmek için Actions sekmesini açın.

## Hangi CI/CD aracını seçmelisiniz?

Kodunuza ve ekibinize en yakın aracı seçin. Kullanım verileri de bunu doğruluyor: 2026 ortası itibarıyla GitHub Actions kurumların yaklaşık %33'üyle önde; Jenkins %28, GitLab CI %19 civarında. Platformun yerleşik seçeneği genelde kazanır; çünkü kurulum neredeyse sıfırdır ve secret'lar, izinler ve loglar zaten entegredir.

| Araç | Kime uygun | Barındırma | 2026 notu |
|------|-----------|------------|-----------|
| GitHub Actions | GitHub'daki depolar | Bulut + kendi sunucu | ~%33 kullanım; runner fiyatları 1 Oca 2026'da ~%40 düştü; Agentic Workflows önizlemede |
| GitLab CI/CD | Tam DevOps paketi | Bulut + kendi sunucu | ~%19 kullanım; yerleşik SAST, DAST, registry, SBOM |
| Jenkins | Tam kontrol, eski sistemler | Kendi sunucu | ~%28 kullanım; 1.800+ eklenti, en çok bakım |
| CircleCI | Hıza odaklı ekipler | Bulut + kendi sunucu | Hızlı önbellek, esnek paralellik |
| Argo CD | Kubernetes GitOps | Kendi sunucu | Bildirimsel CD; K8s için fiili CD katmanı |

2026'nın baskın mimarisi açıkçası sıkıcı ama doğru olan: CI yarısı için GitHub Actions ya da GitLab CI, CD yarısı için Argo CD. Jenkins'e yalnızca başka hiçbir aracın sunmadığı eklentilere ya da yerinde (on-prem) kontrole ihtiyacınız olduğunda başvurun. Kubernetes'e dağıtıyorsanız Argo CD'yi [Kubernetes maliyet optimizasyonu](/tr/posts/kubernetes-maliyet-optimizasyonu) rehberimizle eşleştirin ve senkronu kurmadan önce [GitOps nedir](/tr/posts/gitops-nedir) yazımızı okuyun.

Maliyet tarafı: Free plandaki özel bir depo ayda 2.000 Linux dakikası ve 500 MB artifact depolaması alır. Bunu aşınca her ek Linux 2-çekirdek dakikası 0,006 dolar; 1 Ocak 2026'da 0,008 dolardan indirildi. Açık depolar ücretsiz kalıyor.

## Test ve dağıtım kapılarını nasıl eklersiniz?

Kapılar, kodun ilerlemesi için geçilmesi gereken koşullardır. Bunları, pipeline'ın riskli değişiklikleri bir insanın hatırlamasına gerek kalmadan otomatik engellemesi için ekleyin. Dal koruması artı zorunlu durum denetimleri, kurabileceğiniz en yüksek getirili kapıdır.

- **Zorunlu durum denetimleri.** Depo ayarlarında, bir PR merge olmadan önce `build-test` işinin geçmesini zorunlu kılın. Bozuk kod `main`'e fiziksel olarak ulaşamaz.
- **Kapsam eşiği.** Test kapsamı bir satırın, örneğin %80'in altına düşerse derlemeyi başarısız kılın. Test edilmemiş kodu inceleme anında yakalayın.
- **Üretim için elle onay.** Zorunlu bir denetçi barındıran bir GitHub `environment` kullanın; böylece üretim dağıtımı çalışmadan önce bir insan "onayla" tuşuna basar.
- **Dağıtım sonrası duman testleri.** Dağıtımdan sonra bir sağlık ucunu (health endpoint) yoklayın; 200 dışında bir şey dönerse otomatik geri alın.

Yakın zamanlı bir projede, bir öğleden sonrada kapsam kapısı ve zorunlu denetimler ekledik. Sonraki iki ayda main'e merge kaynaklı olaylar, haftada bir civarından sıfıra düştü; çünkü test edilmemiş yollar artık merge olamıyordu.

## CI/CD pipeline'larında ne bozulur ve nasıl düzeltilir?

Kurduğumuz neredeyse her pipeline'da üç arıza karşımıza çıkar.

- **Kararsız (flaky) testler.** Yerelde geçen bir test CI'da rastgele başarısız olur; genelde bir zamanlama ya da sıralama sorunudur. Kararsız testi karantinaya al, yarış durumunu düzelt ve asla otomatik yeniden denemeyle üstünü örtme; yeniden denemeler gerçek hataları gizler.
- **Yavaş pipeline'lar.** 25 dakikalık bir çalışma geri bildirim döngüsünü öldürür. Bağımlılıkları önbelleğe al, test paketlerini paralel işlerde çalıştır ve hızlı denetimleri (lint, tip denetimi) yavaşlardan (e2e) ayır ki hatalar erken ortaya çıksın.
- **Sızan ya da eksik secret'lar.** Token'ları asla YAML içine gömme. Bunları platformun [şifreli secret deposunda](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions) sakla ve değişken olarak referans ver. Bir commit'e değmiş her şeyi döndür (rotate).

Optimize etmeden önce pipeline'ınızı ölçün. Derleme süresini, başarısızlık oranını ve bir düzeltmenin üretime ulaşma süresini takip edin; teslim sağlığını öngören DORA metrikleri bunlardır. Bu sayılar, size nereye efor harcayacağınızı tahmin yürütmekten çok daha iyi söyler. Dağıtım güvenliği darboğazınızsa bir sonraki durak [kesintisiz deployment](/tr/posts/kesintisiz-deployment) rehberimiz.

## Sıkça Sorulan Sorular

### CI/CD pipeline kurmak ne kadar sürer?

Her push'ta derleyip test eden temel bir pipeline, GitHub Actions gibi barındırılan bir araçla bir-iki saat sürer. Gerçek dağıtım, kapılar, secret'lar ve geri alma eklemek, altyapınızın ve onay sürecinizin karmaşıklığına göre genellikle birkaç günden bir haftaya kadar sürer.

### CI ile CD arasındaki fark nedir?

CI (sürekli entegrasyon) her kod değişikliğini otomatik derleyip test eder; böylece sorunlar hemen ortaya çıkar. CD ise sonrasını kapsar: sürekli teslimat, tek tıkla yayınlanmaya hazır bir derlemeyi el altında tutar; sürekli dağıtım ise testi geçen her değişikliği elle bir adım olmadan otomatik olarak üretime gönderir.

### CI/CD pipeline kurmak için Docker şart mı?

Hayır. Konteyner olmadan da düz uygulama kodunu derleyebilir, test edebilir ve dağıtabilirsiniz. Ama Docker derlemeleri tekrarlanabilir, dağıtımları ortamlar arası tutarlı kılar ve "CI'da çalışıyor, üretimde bozuluyor" hatalarının bütün bir sınıfını ortadan kaldırır. Çoğu ekip, pipeline'ın kendisi kararlı hale gelince Docker'a geçer.

### Kötü bir dağıtımı nasıl geri alırım?

Her derlemeyi sürümlenmiş, değiştirilemez bir çıktı olarak saklayın ki geri alma, kodu elle geri döndürmek değil, son iyi sürümü yeniden dağıtmak olsun. Bunu otomatikleştirin: dağıtım sonrası duman testleri başarısız olursa pipeline önceki çıktıyı yeniden dağıtsın. Kubernetes'te `kubectl rollout undo` ya da Argo CD'nin önceki revizyona senkronu bunu saniyeler içinde yapar.
