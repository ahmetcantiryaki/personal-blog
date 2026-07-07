---
title: "Git Branch Stratejileri Karşılaştırması"
slug: "git-branch-stratejileri"
translationKey: "git-branching-strategies"
locale: "tr"
excerpt: "GitFlow, GitHub Flow, trunk-based mı release branching mi? 2026 karar tablosu, gerçek ödünleşmeler ve DORA verilerinin doğru Git akışı hakkında söyledikleri."
category: "software-engineering"
tags: ["git", "version-control", "workflow", "collaboration"]
publishedAt: "2026-07-06"
seoTitle: "Git Branch Stratejileri Karşılaştırması (2026)"
seoDescription: "2026'da Git branch stratejileri karşılaştırması: GitFlow, GitHub Flow, trunk-based, release branching. Karar tablosu, DORA bulguları ve gerçek ödünleşmeler."
---

Çoğu ekip için 2026'da en iyi **git branch stratejisi**, kısa ömürlü dalları feature flag arkasında günlük olarak birleştiren trunk-based geliştirmedir. GitFlow hâlâ planlı sürümleri olan versiyonlu ürünlere uyar; GitHub Flow ise sürekli deploy eden web uygulamaları için idealdir. Seçiminiz modaya değil; sürüm sıklığına, ekip boyutuna ve otomasyon olgunluğuna bağlıdır.

Araçlar bile sizi bu yöne itiyor. 29 Haziran 2026'da çıkan Git 2.55.0, Rust desteğini varsayılan olarak açık getiriyor ve interaktif rebase'e girmeden staged bir değişikliği eski bir commit'e yerleştiren `git history fixup` komutunu ekliyor. Geçmiş cerrahisi ucuzladıkça küçük ve sık birleştirmeler daha da pratik hale geliyor. Aşağıda mühendislerin gerçekten tartıştığı beş soruyu yanıtlıyor, komutları gösteriyor ve bugün karar vermenizi sağlayacak bir tablo sunuyoruz.

## Git branch stratejisi nedir?

Git branch stratejisi, ekibinizin dalları nasıl oluşturup adlandıracağını, birleştireceğini ve sileceğini belirleyen ortak kurallar bütünüdür; paralel işler böylece temiz biçimde entegre olur. Özelliklerin nerede başladığını, kodun üretime nasıl ulaştığını ve kimin neyi inceleyeceğini tanımlar. İyi bir strateji merge çakışmalarını azaltır, `main`'i yayınlanabilir tutar ve sürümleri öngörülebilir kılar.

Bunu deponuzun trafik kuralları gibi düşünün. Kurallar olmadan aynı depoya push yapan on geliştirici karmaşık bir geçmiş, bozuk build'ler ve sancılı sürümler üretir. Kurallarla entegrasyon rutine döner.

## Başlıca stratejiler nelerdir?

Dört yaklaşım öne çıkar: **GitFlow**, **GitHub Flow**, **trunk-based geliştirme** ve **release branching**. Temel fark, kaç tane uzun ömürlü dalın bulunduğu ve özellik dallarının birleşmeden önce ne kadar yaşadığıdır.

- **GitFlow** — Uzun ömürlü `main` ve `develop` dalları ile `feature/*`, `release/*` ve `hotfix/*`. Yapılı ama ağır.
- **GitHub Flow** — Tek uzun ömürlü dal (`main`) ve pull request ile birleşen kısa ömürlü özellik dalları; ardından deploy.
- **Trunk-based geliştirme** — Herkes küçük dallar üzerinden en az günde bir kez `main`'e (trunk) katkı verir. Yarım işleri feature flag gizler.
- **Release branching** — Gündelik akış trunk-based'tir; ama bir sürümü kararlı hale getirip yayınlamak için `release/x.y` dalı açar, düzeltmeleri oraya cherry-pick edersiniz.

## GitFlow nasıl çalışır, öldü mü?

GitFlow iki kalıcı dal ve üç destekleyici dal türü kullanır. Özellikler `develop`'tan dallanır, sürümler `release/*` dalında kararlı hale gelir ve acil düzeltmeler hem `main`'e hem `develop`'a geri birleşen `hotfix/*` dallarında yapılır. Güçlü bir yapı sunar; bedeli fazladan seremonidir.

```bash
# Bir özellik başlat
git switch develop
git switch -c feature/odeme-yeniden-deneme

# Bitir: develop'a geri birleştir
git switch develop
git merge --no-ff feature/odeme-yeniden-deneme

# Kararlılaştırma için sürüm dalı aç
git switch -c release/1.4.0 develop
# ...sadece hata düzeltmeleri...
git switch main && git merge --no-ff release/1.4.0
git tag -a v1.4.0 -m "Surum 1.4.0"
```

GitFlow öldü mü? Hayır, ama sınırlarını bizzat yazarı daralttı. Vincent Driessen daha 2020'de orijinal 2010 yazısına bir [düşünme notu](https://nvie.com/posts/a-successful-git-branching-model/) ekledi: sürekli teslimat yapan ekipler GitHub Flow gibi daha basit bir modele geçmeli; açıkça versiyonlanan yazılımlar ise git-flow'u sürdürebilir. Bu tavsiye 2026'da hâlâ geçerli. GitFlow gerçek versiyonlarda parlar: masaüstü uygulamalar, mağaza incelemesinden geçen mobil sürümler, firmware ya da aynı anda birden çok versiyonu desteklenen on-prem ürünler. Günde defalarca deploy ettiğinizde ise zorlanır; çünkü `develop`'tan `main`'e geçiş gecikme ve merge yükü ekler.

## GitHub Flow nasıl çalışır?

GitHub Flow tek bir deploy edilebilir dal tutar. `main`'den dallanır, erkenden bir pull request açar, inceleme ve CI kontrollerinden geçirir, sonra birleştirip deploy edersiniz. Ne `develop`, ne release dalı, ne de seremoni vardır. Çoğu SaaS web ekibinin varsayılan tercihidir.

Yaşam döngüsü kısadır:

1. Açıklayıcı bir dal oluşturun: `git switch -c fix/giris-hiz-limiti`.
2. Erkenden commit ve push yapıp taslak pull request açın.
3. CI'ın testleri, linter'ları ve önizleme deploy'larını çalıştırmasına izin verin.
4. İnceleme isteyin; geri bildirimleri sonraki commit'lerle giderin.
5. `main`'e birleştirin (squash geçmişi temiz tutar).
6. `main`'i otomatik ya da tek tıkla deploy edin.
7. Dalı silin.

GitHub Flow güçlü otomatik test ve hızlı geri alma varsayar. `main` bozulursa herkes bloke olur; dolayısıyla [CI/CD hattınız](/tr/posts/cicd-pipeline-nasil-kurulur) bu stratejiyi güvenli kılan emniyet ağıdır. Bunu [işe yarayan unit testler](/tr/posts/unit-test-nasil-yazilir) alışkanlığıyla birleştirin; "herkes bloke" riski dakikalara iner.

## Trunk-based geliştirme nasıl çalışır?

Trunk-based geliştirme, geliştiricilerin haftalarca değil saatlerce yaşayan dallarla `main`'e sürekli entegre olması demektir. Tamamlanmamış özellikler feature flag arkasında gizlenir, böylece `main` her an yayınlanabilir kalır. Google ve yüksek hızlı ekiplerin çoğu bu şekilde çalışır; çünkü merge borcunu en aza indirir.

Bu sadece moda değil. [DORA'nın araştırması](https://dora.dev/capabilities/trunk-based-development/) — Accelerate programında yıllar boyunca 30.000'den fazla profesyonele dayanarak — trunk-based geliştirmeyi elit teslimat performansına tekrar tekrar bağlar: talep üzerine deploy, bir saatin altında toparlanma ve düşük değişiklik-hata oranı. Nedensellik, uzun ömürlü dalların sessizce bozduğu sürekli entegrasyondan geçer.

Temel disiplin küçük partilerdir:

- Değişiklikleri birkaç yüz satırın altında tutun ki inceleme hızlı olsun.
- Yarım işler flag arkasında olsa bile günde en az bir kez `main`'e birleştirin.
- Bir dalın `main`'den bir iki günden fazla uzaklaşmasına izin vermeyin.
- Uzun QA dondurmaları yerine kapsamlı CI ve feature flag'lere güvenin.

```bash
git switch main && git pull --rebase
git switch -c topic/arama-indeksi
# flag ile sarmalanmış küçük değişiklik
git commit -am "Arama indeksini flag arkasinda ekle"
git switch main && git merge --ff-only topic/arama-indeksi
```

Bedeli disiplindir: trunk-based geliştirme olgun bir test paketi, bir feature flag sistemi ve hızlı inceleyip birleştiren bir kültür ister. Bu korumalar olmadan doğrudan `main`'e push yapan ekipler kendini savunmasız hisseder.

## Hangi git branch stratejisini kullanmalısınız?

Stratejiyi ünlü bir şirketin yaptığına değil; kendi sürüm sıklığınıza ve otomasyon olgunluğunuza göre seçin. Karar için şu tabloyu kullanın.

| Strateji | Uzun ömürlü dallar | Özellik dalı ömrü | En uygun | Sürüm sıklığı | Gereken CI/flag olgunluğu |
|----------|-------------------|-------------------|----------|--------------|---------------------------|
| GitFlow | `main` + `develop` | Günler / haftalar | Versiyonlu/masaüstü/mobil/on-prem | Planlı | Düşük–orta |
| GitHub Flow | Sadece `main` | Saatler / günler | SaaS web uygulamaları | Sürekli | Orta |
| Trunk-based | Sadece `main` | Saatler | Yüksek hızlı ürün ekipleri | Günde çok kez | Yüksek |
| Release branching | `main` + `release/*` | Saatler | Kararlı versiyon + hız | Versiyon başına | Yüksek |

Hızlı bir pusula:

- **Sürekli deploy ve güçlü CI mı?** GitHub Flow veya trunk-based.
- **Planlı, adlandırılmış versiyonlar mı?** GitFlow veya release branching.
- **Büyük ekip, az merge sancısı mı?** Feature flag'li trunk-based.
- **Küçük ekip, sadelik mi?** GitHub Flow.

Hangisini seçerseniz seçin, dallanma modeli sistemin yalnızca yarısıdır — onu [GitOps tarzı otomatik teslimata](/tr/posts/gitops-nedir) ve [kesintisiz deployment'a](/tr/posts/kesintisiz-deployment) bağlayın ki `main`'e yapılan bir birleştirme sorunsuzca üretime ulaşsın. Daha fazla desen için [yazılım mühendisliği](/tr/category/yazilim-muhendisligi) bölümüne bakın.

## Bizde ne bozuldu ve nasıl düzelttik

12 mühendislik bir SaaS ekibinde iki yıl boyunca GitFlow kullandık. `develop` dalı yarım birleşmiş özelliklerin mezarlığına döndü ve her sürüm bir tam günlük çakışma çözümü gerektirdi. Bir `release/*` dalı üç günden fazla yaşadığında merge çakışmaları fırlıyordu.

Bir feature flag servisiyle trunk-based geliştirmeye geçtik. İki değişiklik işe yaradı: hiçbir dalın bir günü aşmaması kuralı ve kapsam %80'in altına düştüğünde birleştirmeyi engelleyen bir CI kapısı. Sürüm günündeki çakışma çözümü yaklaşık 6 saatten 30 dakikanın altına indi; deploy sıklığı haftalıktan günde birkaç keze çıktı.

Görüşüm net: strateji, otomasyonunuzun bir sonucudur. Sağlam CI ve flag olmadan trunk-based'e geçmek işleri iyileştirmez, kötüleştirirdi. Önce hattı düzeltin; dallanma modeli neredeyse kendiliğinden yerine oturur.

## Sıkça Sorulan Sorular

### GitFlow 2026'da öldü mü?

Hayır, ama kapsamı daraldı — ve bunu bizzat yazarı söyledi. GitFlow, gerçek versiyonları ve planlı sürümleri olan ürünler (mobil uygulamalar, on-prem yazılım) için hâlâ sağlam bir stratejidir. Sürekli deploy edilen web uygulamalarında ise GitHub Flow veya trunk-based ana akım tercihtir; çünkü entegrasyon gecikmesini azaltır ve CI'ın gerçekte çalışma biçimiyle uyumludur.

### GitHub Flow ile trunk-based geliştirme arasındaki fark nedir?

İkisi de tek bir `main` dalı kullanır; fark dal ömrü ve güvenlik mekanizmasındadır. GitHub Flow özellik dallarını birkaç gün içinde pull request ile birleştirir. Trunk-based ise saatler içinde birleştirir ve yarım işleri feature flag arkasında gizler; bu yüzden daha güçlü CI ve flag altyapısı ister ama merge çakışmalarını daha da azaltır ve DORA'nın elit ekip pratikleriyle doğrudan örtüşür.

### Bir özellik dalı ne kadar yaşamalı?

Mümkün olduğunca kısa. Trunk-based'te bir günden az; GitHub Flow'da en fazla birkaç gün hedefleyin. Uzun ömürlü dallar merge çakışması biriktirir ve `main`'den uzaklaşır. Bir özellik haftalar gerektiriyorsa, dev bir dal yerine feature flag arkasında küçük birleştirmelere bölün.

### Küçük ekiplerin resmi bir dallanma stratejisine ihtiyacı var mı?

Evet — iki kişi bile ortak kurallardan fayda görür. GitHub Flow gibi hafif bir strateji `main`'de bozuk build'leri önler ve incelemeleri rutin kılar. Yük çok azdır: bir korumalı dal, pull request ve otomatik testler. Versiyonlu sürümlere geçtiğinizde release dallarını sonradan her zaman ekleyebilirsiniz.
