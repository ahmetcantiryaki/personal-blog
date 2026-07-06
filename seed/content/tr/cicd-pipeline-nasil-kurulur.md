---
title: "Sıfırdan CI/CD Pipeline Nasıl Kurulur"
slug: "cicd-pipeline-nasil-kurulur"
translationKey: "build-cicd-pipeline"
locale: "tr"
excerpt: "CI/CD pipeline nasıl kurulur? Aşamalar, çalışan bir GitHub Actions yapılandırması, test kapıları, dağıtım ve kaçınılması gereken hatalar adım adım."
category: "devops-cloud"
tags: ["ci-cd", "devops", "automation", "deployment"]
publishedAt: "2026-05-06"
seoTitle: "Sıfırdan CI/CD Pipeline Nasıl Kurulur (2026)"
seoDescription: "CI/CD pipeline nasıl kurulur adım adım: GitHub Actions ile derleme, test ve dağıtım aşamalarını gerçek yapılandırma, kapılar ve geri alma ile kurun."
---

CI/CD pipeline kurmak için Git deponuzu, her push'ta aynı adımları çalıştıran bir otomasyon aracına bağlarsınız: bağımlılıkları kur, derle, testleri çalıştır ve her şey geçerse dağıt. Bu döngü, "benim makinemde çalışıyordu" derdini tekrarlanabilir ve denetlenebilir bir sürece dönüştürür. Bu rehberde tüm hattı, bugün kopyalayıp çalıştırabileceğiniz bir GitHub Actions yapılandırmasıyla anlatıyoruz.

## CI/CD pipeline nedir ve neden kurulur?

CI/CD pipeline, kodu commit'ten üretime elle müdahale olmadan taşıyan otomatik bir dizidir. **CI** (sürekli entegrasyon) her değişikliği derleyip test eder; böylece hatalar yayın gününde değil dakikalar içinde ortaya çıkar. **CD** (sürekli teslimat ya da dağıtım) testi geçen sürümleri otomatik olarak staging veya üretime gönderir.

Bunu, yayınlamanın yavaş ve hataya açık kısımlarını ortadan kaldırmak için kurarsınız. Elle yapılan dağıtımlar zamanla sapar, test atlar ve ritüeli bilen tek kişiye bağımlı kalır. Bir pipeline her seferinde aynı adımları çalıştırır, bozuk kodun merge olmasını engeller ve kimin neyi değiştirdiğine dair kayıt tutar. İki kişiyi aşan her ekipte ilk ayında kendini amorti eder. Konteyner kullanıyorsanız bunu [üretim için Docker en iyi pratikleri](/blog/devops-cloud) rehberimizle birleştirin.

## CI/CD pipeline aşamaları nelerdir?

Standart bir pipeline altı aşamadan geçer; her biri, kötü kodun kullanıcılara ulaşmasını durduran bir kapıdır. CI/CD pipeline nasıl kurulur sorusunun başlangıcı, her aşamanın ne yaptığını ve nerede tıkandığını bilmektir.

1. **Kaynak.** Bir push ya da pull request pipeline'ı tetikler. Runner, tam olarak sizin commit'inizi çeker.
2. **Derleme.** Bağımlılıkları kur ve uygulamayı derle veya paketle. Bu başarısız olursa alt adımların hiçbiri çalışmaz.
3. **Test.** Birim, entegrasyon ve zaman zaman uçtan uca testleri çalıştır. Bu, güvenlik ağınızdır.
4. **Tarama.** Lint, tip denetimi, güvenlik ve bağımlılık taramalarını çalıştır; statik analizin yakalayabildiği sorunları burada yakala.
5. **Paketleme.** Dağıtılabilir bir çıktı üret: bir Docker imajı, bir paket ya da sürümlenmiş bir yayın.
6. **Dağıtım.** Çıktıyı staging'e gönder, duman (smoke) testlerini çalıştır, sonra üretime terfi ettir.

Hızlı ve ucuz aşamaları başa koyun. Bir lint hatası, 12 dakikalık test paketinden sonra değil, 20 saniyede başarısız olmalı.

## GitHub Actions ile CI/CD pipeline nasıl kurulur?

Tek bir workflow dosyasıyla başlayın ve aşamaları kademeli ekleyin. Aşağıda, `main` dalına her push'ta derleyip test eden ve dağıtan, bir Node.js uygulaması için gerçek ve minimal bir pipeline var. GitHub'ın barındırdığı runner'larda çalışır, yani yönetecek bir sunucu yok.

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
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "22"
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
      - uses: actions/checkout@v4
      - run: echo "Dağıtılıyor commit ${{ github.sha }}"
        # kendi dağıtım komutunuzla değiştirin, örn. flyctl deploy
```

İki şey bunu güvenli kılıyor. `needs: build-test` satırı, **her test geçmeden deploy'un asla çalışmayacağı** anlamına gelir. `if: github.ref == 'refs/heads/main'` koşulu ise pull request'lerin test edilmesini ama asla dağıtılmamasını sağlar. Bu dosyayı commit'leyin, push edin ve çalıştığını görmek için Actions sekmesini açın.

## Hangi CI/CD aracını seçmelisiniz?

Kodunuza ve ekibinize en yakın aracı seçin. 2026'da çoğu ekip için platformun yerleşik seçeneği kazanır; çünkü kurulum neredeyse sıfırdır ve secret'lar, izinler ve loglar zaten entegredir.

| Araç | Kime uygun | Barındırma | Notlar |
|------|-----------|------------|--------|
| GitHub Actions | GitHub'daki depolar | Bulut + kendi sunucu | Devasa marketplace, açık depolara ücretsiz kota |
| GitLab CI/CD | GitLab kullanıcıları, tam DevOps paketi | Bulut + kendi sunucu | Yerleşik registry, monorepo için güçlü |
| CircleCI | Hıza odaklı ekipler | Bulut + kendi sunucu | Hızlı önbellek, esnek paralellik |
| Jenkins | Tam kontrol, eski sistemler | Kendi sunucu | En esnek, en çok bakım isteyen |
| Argo CD | Kubernetes GitOps | Kendi sunucu | Bildirimsel CD, Git'ten kümeye senkron |

Zaten bu platformlardaysanız varsayılan olarak GitHub Actions veya GitLab CI/CD seçin. Jenkins'e yalnızca başka hiçbir aracın sunmadığı eklentilere ya da yerinde (on-prem) kontrole ihtiyacınız olduğunda başvurun. Kubernetes'e dağıtıyorsanız Argo CD artı bir GitOps akışı, [Kubernetes maliyet optimizasyonu](/blog/devops-cloud) rehberimizle iyi uyum sağlar.

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
- **Sızan ya da eksik secret'lar.** Token'ları asla YAML içine gömme. Bunları platformun şifreli secret deposunda sakla ve değişken olarak referans ver. Bir commit'e değmiş her şeyi döndür (rotate).

Optimize etmeden önce pipeline'ınızı ölçün. Derleme süresini, başarısızlık oranını ve bir düzeltmenin üretime ulaşma süresini takip edin. Bu sayılar, size nereye efor harcayacağınızı tahmin yürütmekten çok daha iyi söyler.

## Sıkça Sorulan Sorular

### CI/CD pipeline kurmak ne kadar sürer?

Her push'ta derleyip test eden temel bir pipeline, GitHub Actions gibi barındırılan bir araçla bir-iki saat sürer. Gerçek dağıtım, kapılar, secret'lar ve geri alma eklemek, altyapınızın ve onay sürecinizin karmaşıklığına göre genellikle birkaç günden bir haftaya kadar sürer.

### CI ile CD arasındaki fark nedir?

CI (sürekli entegrasyon) her kod değişikliğini otomatik derleyip test eder; böylece sorunlar hemen ortaya çıkar. CD ise sonrasını kapsar: sürekli teslimat, tek tıkla yayınlanmaya hazır bir derlemeyi el altında tutar; sürekli dağıtım ise testi geçen her değişikliği elle bir adım olmadan otomatik olarak üretime gönderir.

### CI/CD pipeline kurmak için Docker şart mı?

Hayır. Konteyner olmadan da düz uygulama kodunu derleyebilir, test edebilir ve dağıtabilirsiniz. Ama Docker derlemeleri tekrarlanabilir, dağıtımları ortamlar arası tutarlı kılar ve "CI'da çalışıyor, üretimde bozuluyor" hatalarının bütün bir sınıfını ortadan kaldırır. Çoğu ekip, pipeline'ın kendisi kararlı hale gelince Docker'a geçer.

### Kötü bir dağıtımı nasıl geri alırım?

Her derlemeyi sürümlenmiş, değiştirilemez bir çıktı olarak saklayın ki geri alma, kodu elle geri döndürmek değil, son iyi sürümü yeniden dağıtmak olsun. Bunu otomatikleştirin: dağıtım sonrası duman testleri başarısız olursa pipeline önceki çıktıyı yeniden dağıtsın. Kubernetes'te `kubectl rollout undo` ya da Argo CD'nin önceki revizyona senkronu bunu saniyeler içinde yapar.
