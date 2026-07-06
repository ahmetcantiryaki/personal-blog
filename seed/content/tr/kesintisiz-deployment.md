---
title: "Kesintisiz Deployment Nasıl Yapılır"
slug: "kesintisiz-deployment"
translationKey: "zero-downtime-deployments"
locale: "tr"
excerpt: "Kesintisiz deployment için pratik rehber: blue-green, canary ve rolling stratejileri, health check, bağlantı boşaltma ve güvenli veritabanı migrasyonları."
category: "devops-cloud"
tags: ["deployment", "ci-cd", "devops", "reliability"]
publishedAt: "2026-07-04"
seoTitle: "Kesintisiz Deployment Nasıl Yapılır"
seoDescription: "Kesintisiz deployment adım adım: blue-green, canary ve rolling karşılaştırması, health check, bağlantı boşaltma ve geriye uyumlu veritabanı migrasyonları."
---

Kesintisiz deployment, yeni kodu tek bir canlı isteği bile düşürmeden yayına almaktır. Bunu eski ve yeni sürümü yan yana çalıştırarak, trafiği yalnızca health check'ten geçen instance'lara yönlendirerek, kapatmadan önce devam eden bağlantıları boşaltarak ve veritabanı değişikliklerini geriye uyumlu tutarak yaparsınız. Doğru kurulduğunda kullanıcı ne 502 görür ne de dönen bir spinner.

Buradaki anahtar kelime sihir değil, disiplindir. Yayın sırasındaki kesintilerin çoğu üç öngörülebilir hatadan gelir: bir süreci hâlâ istek işlerken öldürmek, trafiği henüz hazır olmayan bir konteynere yönlendirmek veya eski kodun kaldıramayacağı bir şema migrasyonu çalıştırmak. Bu üçünü çözerseniz güvenilir bir kesintisiz deployment'ın yüzde 90'ını tamamlamış olursunuz. Bu rehberde stratejileri, tam mekanikleri ve prodüksiyonda karşılaştığımız arızaları anlatıyorum.

## Kesintisiz deployment nedir?

Kesintisiz deployment, uygulamanın yayın süreci boyunca kullanıcılara tamamen açık kaldığı; düşen istek, hata veya bakım penceresi olmayan bir yayınlama biçimidir. Eski sürümü durdurup yenisini başlatmak yerine ikisini üst üste bindirirsiniz: yeni sürüm ayağa kalkar, sağlıklı olduğunu kanıtlar, trafiği kademeli olarak devralır ve ancak o zaman eski sürüm devreden çıkar.

Asıl mesele şu: "kesinti" yalnızca uygulamanın kapalı olması değildir. Bir pod yeniden başlarken 500 dönen bir istek de kesintidir. Yani gerçek hedef **sıfır başarısız istek**tir. Bu da sizi yalnızca uptime panolarına değil; hazır olma durumuna, yük dengeleyicinin davranışına ve düzgün kapanmaya bakmaya zorlar.

## Hangi deployment stratejisini seçmelisiniz?

2026'da üç strateji öne çıkıyor. Etki alanı, maliyet ve geri alma hızı arasında denge kurarlar. Değişikliğin ne kadar riskli olduğuna ve ne kadar yedek kapasiteye para ayırabildiğinize göre seçin.

| Strateji | Nasıl çalışır | Geri alma hızı | Ek kapasite ihtiyacı | En uygun senaryo |
|----------|--------------|----------------|---------------------|------------------|
| **Rolling** | Instance'ları birkaçar birkaçar değiştir | Orta (parti parti ileri/geri al) | Düşük (~1 fazla instance) | Stateless servisler, varsayılan seçim |
| **Blue-green** | Tam yeni ortam kur, trafiği tek seferde çevir | Anında (geri çevir) | Yüksek (geçiş sırasında 2x) | Yüksek riskli yayınlar, kolay geri alma |
| **Canary** | Trafiğin %1-5'ini yeni sürüme ver, metrikleri izle, artır | Hızlı (canary'yi düşür) | Düşük-orta | Riskli değişiklikler, büyük kullanıcı tabanları |
| **Recreate** | Eskiyi durdur, yeniyi başlat | Yok (arada boşluk var) | Düşük | Yalnızca kesinti kabul edilebilirse |

**Rolling** mantıklı varsayılandır ve Kubernetes'in kutudan yaptığı şeydir. **Blue-green** size anında ve temiz bir geri alma sağlar; çünkü eski ortam hâlâ sıcaktır. **Canary** gerçekten riskli değişiklikler için en güvenlisidir; çünkü regresyonları herkese ulaşmadan önce gerçek trafikle yakalarsınız.

## Adım adım kesintisiz deployment nasıl yapılır?

Yük dengeleyici arkasındaki standart bir rolling yayın için izlediğimiz sıra aşağıda. Her orkestratöre uyarlanabilir.

1. **Değişmez bir artefakt üretin.** İmajı `latest` ile değil, commit SHA'sıyla etiketleyin. Ne çalıştığını tam olarak bilmek ve yeniden üretebilmek istersiniz.
2. **Önce migrasyonları çalıştırın, yalnızca geriye uyumlu olanları.** *Mevcut* çalışan kodun kaldırabileceği şema değişikliklerini uygulayın (aşağıda ayrıntısı var). Bir migrasyonu, ona ihtiyaç duyan kodla aynı yayına asla bağlamayın.
3. **Yeni instance'ları eskilerin yanında başlatın.** Eski sürüme henüz dokunmayın. Yeni pod/konteynerleri ayağa kaldırın.
4. **Trafiği readiness probe'a bağlayın.** Yük dengeleyici, bağımlılıkların (DB, cache, alt sistem API'leri) erişilebilir olduğunu doğrulayan bir hazır olma kontrolünden geçmeden yeni instance'a istek yönlendirmemeli.
5. **Trafiği kademeli kaydırın.** Rolling: bir partiyi değiştir, sağlıklı olmasını bekle, devam et. Canary: %5 → %25 → %50 → %100, her adımda hata oranını ve gecikmeyi kontrol ederek.
6. **Eski instance'larda bağlantıları boşaltın.** Bir eski instance'ı durdurmadan önce ona yeni istek göndermeyi kesin ve devam eden isteklerin bitmesine izin verin (connection draining / `preStop` hook).
7. **Eski instance'ları düzgünce sonlandırın.** `SIGTERM` gönderin, uygulamanın dinleyicileri kapatıp işini bitirmesine izin verin, `SIGKILL`'i ancak bir bekleme süresinden sonra gönderin.
8. **İzleyin, sonra temizleyin.** Eski sürümün geri alma yolunu birkaç dakika açık tutun. Hata bütçeleri temiz görününce devreden çıkarın.

4, 6 veya 7. adımlardan herhangi birini atlarsanız, deploy "yeşil" görünse bile yük altında istek düşürürsünüz.

## Neden en çok health check ve düzgün kapanma önemli?

Yayın anındaki hataların en yaygın nedeni, trafiğin henüz hazır olmayan veya kapanmakta olan bir sürece çarpmasıdır. İki probe ve bir kapanma hook'u bunu önler.

- **Readiness probe:** "Bu instance *şu anda* trafik işleyebilir mi?" sorusunu yanıtlar. Başarısız olursa yük dengeleyici istek göndermeyi keser. Hem başlangıçta hem kapanışta kullanın.
- **Liveness probe:** "Bu instance takıldı mı, yeniden başlatılmalı mı?" sorusunu yanıtlar. Readiness'tan ayrı tutun; ikisini birleştirmek yeniden başlatma fırtınalarına yol açar.
- **`preStop` hook + connection draining:** Bir pod'a dur denildiğinde, readiness'ı başarısıza çevirin, yük dengeleyicinin fark etmesi için birkaç saniye bekleyin, sonra aktif isteklerin tamamlanmasına izin verin.

Kapanma sıralamasını doğru yapan bir Kubernetes parçası:

```yaml
spec:
  containers:
    - name: api
      readinessProbe:
        httpGet: { path: /healthz/ready, port: 8080 }
        periodSeconds: 3
        failureThreshold: 2
      lifecycle:
        preStop:
          exec:
            command: ["sh", "-c", "sleep 5"]   # SIGTERM'den önce LB kaydı silsin
  terminationGracePeriodSeconds: 30
```

Kendi API'mizde yalnızca bu `preStop: sleep 5` eklemesi, deploy anındaki 502'leri yayın başına birkaç yüzden sıfıra düşürdü. Yük dengeleyicinin, süreç ölmeden önce yönlendirmeyi kesmek için bir ana ihtiyacı var; bu bekleme olmadan istekler zaten kapanmakta olan bir sokete varıyor.

Uygulamanız da `SIGTERM`'i ele almalı: yeni bağlantıları kabul etmeyi bırak, devam eden işi bitir, DB havuzunu kapat, sonra çık. `SIGTERM`'i yok sayıp `SIGKILL`'i beklerse, devam eden her istek koparılır.

## Veritabanı kesintisiz nasıl migrate edilir?

Kırıcı bir şema değişikliğini, ona bağımlı olan kodla aynı yayında asla göndermeyin. **Expand-contract** (paralel değişim) desenini kullanın ki eski ve yeni kod, yayın boyunca aynı veritabanına karşı birlikte çalışabilsin.

1. **Expand (genişlet).** Yeni kolonu/tabloyu/indeksi ekleyin. Nullable veya varsayılan değerli yapın. Eski kod onu yok sayar; yeni kod yazmaya başlayabilir.
2. **Migrate + çift yazma.** Hem eski hem yeni yapıya yazan ve mevcut satırları partiler hâlinde dolduran kodu deploy edin.
3. **Contract (daralt).** Tüm instance'lar yeni kodu çalıştırınca ve backfill bitince, sonraki bir yayın eski kolonu düşürür.

Bir kolonu tek seferde yeniden adlandırmak klasik kesinti tuzağıdır: adı değiştirdiğiniz an, hâlâ çalışan eski kod artık var olmayan bir kolonu sorgular. Bunun yerine ayrı deploy'larda yeni-ekle, doldur, okumaları değiştir, eskiyi düşür. Büyük tablolarda kilitleyen işlemlerden kaçının; Postgres'te `CREATE INDEX CONCURRENTLY` kullanın ve backfill'i partilere bölün ki uzun transaction tutmayasınız.

## 2026'da kesintisiz deployment'ı hangi araçlar destekler?

Bunu genellikle sıfırdan kurmazsınız. Orkestrasyon katmanı çoğu zaman ilkel yapı taşlarını verir:

- **Kubernetes** rolling update'leri, `maxUnavailable: 0` ve readiness probe ile çoğu durumu ücretsiz karşılar.
- **Argo Rollouts** ve **Flagger**, aşamalı teslimat, Prometheus metriklerine karşı otomatik canary analizi ve regresyonda otomatik geri alma ekler.
- **Yük dengeleyiciler / service mesh'ler** (AWS ALB, Envoy, Istio, Linkerd) trafik kaydırma ve bağlantı boşaltmayı üstlenir.
- **Feature flag'ler** (LaunchDarkly, Unleash, OpenFeature) *deploy* ile *release*'i ayırır; kodu karanlıkta gönderip bağımsız olarak açabilirsiniz.

Pipeline'ın kendisini kuruyorsanız [CI/CD pipeline nasıl kurulur](/tr/cicd-pipeline-nasil-kurulur) rehberimiz güvenli bir deploy'u besleyen aşamaları anlatıyor; [GitOps nedir](/tr/gitops-nedir) ise bu yayınlar için Git'i doğruluk kaynağı yapmayı gösteriyor. Çevirdikten sonra regresyonları yakalamak için bunu sağlam bir [log, metrik ve trace observability](/tr/observability-nedir) ile eşleştirin.

## Sıkça Sorulan Sorular

### Kesintisiz deployment ile blue-green deployment arasındaki fark nedir?

Kesintisiz deployment *hedeftir*: yayın sırasında düşen istek olmaması. Blue-green ise bunu başarmanın bir *stratejisidir*: iki tam ortam çalıştırıp trafiği çevirmek. Canary ve rolling update de kesintisizliği sağlayan diğer stratejilerdir. Blue-green en hızlı geri almayı verir ama geçiş sırasında iki kat kapasite maliyeti çıkarır.

### Tek sunucuyla kesintisiz deployment yapılabilir mi?

Gerçek anlamda hayır. Tek instance ile her zaman eski sürecin durup yeninin başladığı bir an vardır. Yük dengeleyici arkasında en az iki instance gerekir ki biri güncellenirken diğeri trafiği işlesin. Tek makinede soket devri yapan bir ters vekil ile *yaklaşabilirsiniz*, ama dürüst yanıt şu: ikinci bir instance ekleyin.

### Health check'ler deploy sırasında kesintiyi nasıl önler?

Readiness probe'lar, bir instance'ın şu anda trafik işleyip işleyemeyeceğini yük dengeleyiciye bildirir. Başlangıçta, uygulama bağımlılıklarının erişilebilir olduğunu doğrulayana kadar trafik tutulur. Kapanışta ise readiness başarısıza döner; böylece dengeleyici instance'ı süreç çıkmadan *önce* kayıttan düşürür ve devam eden istekler koparılmak yerine düzgünce boşaltılır.

### Veritabanı migrasyonları kesintisiz deployment'ı bozar mı?

Kendi elimizle yarattığımız kesintilerin en yaygın nedenidir. Çalışan kodun hâlâ kullandığı bir şeyi kaldıran veya yeniden adlandıran bir migrasyon istekleri anında kırar. Expand-contract desenini kullanın: önce yeni yapıları ekleyin, migrate edip çift yazın, sonraki bir yayında eskileri düşürün; böylece eski ve yeni kod güvenle bir arada var olur.
