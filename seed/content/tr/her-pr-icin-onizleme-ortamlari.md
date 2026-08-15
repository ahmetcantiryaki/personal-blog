---
title: "Her Pull Request İçin Önizleme Ortamı Kurmak"
slug: "her-pr-icin-onizleme-ortamlari"
translationKey: "preview-environments-every-pull-request"
locale: "tr"
excerpt: "Her PR için canlıya benzer bir önizleme ortamı, review sürtünmesini azaltıp hataları erken yakalıyor. Kurulum, veritabanı branching ve teardown rehberi."
category: "devops-cloud"
tags: ["devops", "ci-cd", "deployment", "databases"]
publishedAt: "2026-08-15"
seoTitle: "Her PR İçin Önizleme Ortamı: Kurulum Rehberi"
seoDescription: "Ephemeral önizleme ortamları review sürecini nasıl hızlandırır? Platform-native, Kubernetes ve veritabanı branching yaklaşımları bu rehberde anlatılıyor."
---

Bir PR'ı review ederken elinizde sadece bir diff varsa, "bu değişiklik gerçekten çalışıyor mu" sorusunun cevabını genelde tahmin ederek veriyorsunuz. Her pull request için otomatik olarak ayağa kalkan, canlıya oldukça benzer bir önizleme (preview) ortamı ise bu tahmin ihtiyacını tamamen gereksiz kılıyor — reviewer diff'i okumak yerine değişikliği gerçekten tıklayıp deneyebiliyor.

## Neden Sürtünmeyi Azaltıyor

Önizleme ortamlarının kazandırdığı şey basit ama etkisi büyük: "benim makinemde çalışıyordu" sorununu neredeyse tamamen ortadan kaldırıyor. Reviewer, kodu local makinesine çekip bağımlılıkları tek tek kurmak yerine tek bir URL'e tıklayıp gerçek, çalışan bir ortamda değişikliği doğrudan test edebiliyor. Bu, özellikle UI değişikliklerinde, çeşitli edge-case senaryolarında ve tasarımcı/ürün yöneticisi gibi kod okumayan paydaşların review sürecine kolayca dahil olmasında ciddi bir fark yaratıyor. Sonuç: hatalar merge'den önce, production'a hiç değmeden yakalanıyor.

## Üç Temel Yaklaşım

| Yaklaşım | Ne zaman uygun | Sınırlama |
| --- | --- | --- |
| Platform-native (Vercel, Netlify) | Frontend-ağırlıklı projeler | Backend/DB provisioning yerleşik değil |
| Kubernetes namespace-per-PR | Mikroservis mimarisi, karmaşık backend | Kurulum ve bakım maliyeti yüksek |
| Docker-compose on demand | Orta ölçekli, self-hosted altyapı | Ölçeklenme ve izolasyon k8s kadar güçlü değil |

**Platform-native**: Vercel ve Netlify, her push'ta otomatik olarak ücretsiz bir önizleme URL'i üretiyor — frontend deploy'ları için bu yerleşik ve neredeyse sıfır konfigürasyon gerektiriyor. Ama ikisi de backend veya veritabanı provisioning'i yerleşik olarak sunmuyor; bu katman için ayrı bir araç gerekiyor.

**Kubernetes namespace-per-PR**: Her PR için ayrı bir namespace (veya daha güçlü izolasyon isteyen ekipler için vcluster) oluşturup, o namespace'i Argo CD'nin ApplicationSet'i ve pull-request generator'ı ile otomatik yönetmek, mikroservis mimarisine sahip ekipler için doğal bir seçim. Maliyeti, kurulum karmaşıklığında yatıyor.

**Docker-compose on demand**: Daha küçük, self-hosted altyapıya sahip ekipler için, her PR'da bir docker-compose stack'i tek bir sunucu üzerinde ayağa kaldırmak daha hafif ve düşük maliyetli bir seçenek; ama namespace izolasyonu veya otomatik ölçeklenme gibi Kubernetes'in sunduğu garantileri vermiyor, tek sunucunun kaynak sınırlarına takılıyor.

## Veri Tohumlama ve Dış Servis Stub'lama

Bir önizleme ortamının gerçekten işe yaraması için boş bir veritabanıyla açılmaması gerekiyor — reviewer'ın test edeceği veri orada olmalı. İki yaygın yol var: production'ın anonimleştirilmiş bir kopyasını her ortama tohumlamak, ya da veritabanı branching kullanan bir sağlayıcıyla prod şemasını ve verisini saniyeler içinde klonlamak.

Dış servisler (ödeme sağlayıcıları, e-posta gönderimi, üçüncü parti API'ler) için gerçek servislere bağlanmak yerine stub/mock kullanmak hem maliyeti hem riski düşürüyor — bir önizleme ortamının yanlışlıkla gerçek bir müşteriye e-posta göndermesi ya da test kartıyla gerçek bir ödeme denemesi tetiklemesi, önlenmesi gereken bir senaryo.

## Veritabanı Branching: Şema İzolasyonunun Anahtarı

Şema değişikliği içeren bir PR'ı test etmenin en güvenilir yolu, o PR'a özel, izole bir veritabanı kopyası üzerinde çalışmak. [Neon gibi sağlayıcılar](https://neon.com/blog/branching-with-preview-environments), veritabanı boyutundan bağımsız olarak yaklaşık bir saniyede tam bir Postgres branch'i oluşturabiliyor; bu branch, production'ın şema ve verisiyle önceden tohumlanmış geliyor. [Resmi GitHub Action entegrasyonu](https://github.com/neondatabase/create-branch-action), PR açıldığında branch'i otomatik oluşturup PR kapandığında siliyor — genelde `preview/pr-<numara>-<dal-adı>` gibi bir adlandırma konvansiyonuyla.

```yaml
# Neon GitHub Action ile PR başına veritabanı branch'i (konsept)
name: Preview DB Branch
on:
  pull_request:
    types: [opened, synchronize, closed]
jobs:
  neon-branch:
    uses: neondatabase/create-branch-action@v5
    with:
      project_id: ${{ secrets.NEON_PROJECT_ID }}
      branch_name: preview/pr-${{ github.event.number }}
      api_key: ${{ secrets.NEON_API_KEY }}
```

Bu yaklaşım, [kesintisiz şema migrasyonlarını ele aldığımız yazıda](/tr/posts/kesintisiz-sema-migrasyonlari) bahsettiğimiz riskin doğrudan pratik çözümü: bir şema değişikliğinin production'a hiç çarpmadan önce, tamamen izole bir kopyada uçtan uca test edilmesini sağlıyor. Fiyatlandırma sağlayıcıdan sağlayıcıya ve zamanla değişiyor, bu yüzden bütçe planlarken güncel fiyat sayfasına bakmakta fayda var.

## Reviewer Deneyimi: URL'den Öteye

İyi kurulmuş bir önizleme ortamı, sadece bir URL vermekle kalmıyor; PR'ın kendisine (GitHub/GitLab yorumu olarak) o ortamın linkini, build durumunu ve varsa otomatik test sonuçlarını da otomatik olarak yazıyor. Bu küçük detay, reviewer'ın "ortam hazır mı, hangi URL" diye sormasını gereksiz kılıyor — CI pipeline'ı zaten deploy tamamlandığında PR'a bir yorum bırakıyor. Bazı ekipler bir adım daha ileri gidip, önizleme ortamının ekran görüntüsünü (özellikle görsel regresyon testleri için) otomatik olarak PR yorumuna ekliyor; bu, özellikle tasarım değişikliklerinde review hızını gözle görülür şekilde artırıyor.

## Secret ve Maliyet Kontrolleri

Önizleme ortamları, production secret'larına asla doğrudan erişmemeli — her ortam için ayrı, kapsamı daraltılmış test kimlik bilgileri kullanılmalı. Maliyet tarafında ise en büyük risk, kapanmayan ortamların birikmesi (sprawl): her açık PR bir ortam demekse, yüzlerce PR'lık bir repo'da bu hızla anlamlı bir bulut faturasına dönüşebiliyor.

## Ölçek Büyüdükçe Ortaya Çıkan Sorunlar

Bir avuç açık PR'lık bir repo'da önizleme ortamları sorunsuz çalışır. Ancak repo büyüyüp aynı anda 50-100 açık PR'a ulaştığında, birkaç yeni sorun devreye giriyor. Birincisi, ortam ayağa kalkma süresi: her PR için sıfırdan bir container/namespace kurmak, PR sayısı arttıkça CI kuyruğunda bir darboğaz yaratabiliyor — bu yüzden çoğu olgun kurulum, sık kullanılan imajları önceden ısıtılmış (warm) bir havuzda tutuyor. İkincisi, isimlendirme ve keşfedilebilirlik: "hangi ortam hangi PR'a ait" sorusunun cevabı, ortam sayısı arttıkça manuel takip edilemez hale geliyor; bu yüzden tutarlı bir adlandırma konvansiyonu (örneğin `preview-pr-<numara>`) ve merkezi bir dashboard, ölçek büyüdükçe isteğe bağlı değil zorunlu hale geliyor. Üçüncüsü, paylaşılan kaynaklara bağımlılık: bir önizleme ortamı hâlâ paylaşılan bir mesaj kuyruğuna veya üçüncü parti bir sandbox hesabına bağlıysa, çok sayıda eşzamanlı ortam bu paylaşılan kaynağı doyurabiliyor — bu senaryoda da her ortamın kendi izole kaynak setine sahip olması gerekiyor.

## Otomatik Teardown: Sprawl'ı Önlemek

Bir PR merge edildiğinde veya kapatıldığında, ona bağlı önizleme ortamı otomatik olarak silinmeli — manuel temizliğe güvenmek er ya da geç unutulan, faturalanmaya devam eden "hayalet" ortamlara yol açıyor. Bunun ötesinde, belirli bir süre (örneğin 14 gün) hareketsiz kalan ortamlar için de otomatik bir temizlik politikası kurmak mantıklı; bu, [her PR için AI ajanlarını CI/CD'ye bağlamayı ele aldığımız yazıdaki](/tr/posts/ai-ajanlari-cicd-guvenle-baglamak) maliyet kontrolü mantığıyla aynı aileden: otomasyonun getirdiği kolaylık, gözetimsiz bırakıldığında maliyete dönüşüyor.

2026'da bu alanda Vercel/Netlify'ın ötesinde Release.com, Coherence, Uffizzi, Qovery ve Kubernetes-native Bunnyshell gibi platformlar da öne çıkıyor; [bir platform karşılaştırmasının da işaret ettiği gibi](https://northflank.com/blog/preview-environment-platforms), kurumların önemli bir kısmı 2026'da ephemeral/önizleme ortamlarına yatırım planlıyor — kesin oran kaynağa göre değişse de yön net.

## Build vs. Buy Kararı

```text
Kendin kur mu, hazır platform mu:
- Ekip zaten Kubernetes'e yatırım yapmış mı? -> Argo CD ApplicationSet ile kendin kurmak mantıklı.
- Öncelik frontend deploy hızı mı? -> Vercel/Netlify yerleşik önizleme yeterli.
- Şema izolasyonu kritik mi? -> Veritabanı branching sağlayan bir sağlayıcı (Neon vb.) ekle.
- Mühendislik kapasitesi kısıtlı mı? -> Hazır platform (Uffizzi, Qovery) bakım yükünü azaltır.
```

## Teardown Kontrol Listesi

```text
Önizleme ortamı temizlik politikası:
- PR kapandığında/merge edildiğinde ortam otomatik siliniyor mu?
- Hareketsiz ortamlar için bir zaman aşımı politikası var mı?
- Veritabanı branch'leri de aynı otomasyonla temizleniyor mu?
- Aylık bulut faturasında "unutulmuş" ortam maliyeti izleniyor mu?
```

DevOps otomasyonu üzerine daha fazla içerik için [DevOps ve Bulut kategorimize](/tr/category/devops-bulut) göz atabilirsiniz.

## Sıkça Sorulan Sorular

### Her PR için önizleme ortamı kurmak küçük ekipler için de mantıklı mı?

Evet, özellikle platform-native seçenekler (Vercel, Netlify) küçük ekipler için neredeyse sıfır ek maliyetle geliyor. Kubernetes tabanlı kurulumlar ise genelde daha büyük, mikroservis mimarisine sahip ekipler için anlamlı.

### Veritabanı branching olmadan şema değişikliklerini test etmek mümkün mü?

Mümkün ama daha riskli; paylaşılan bir staging veritabanı kullanmak, aynı anda çalışan birden çok PR arasında veri çakışmalarına ve "staging'de çalıştı ama production'da bozuldu" senaryolarına yol açabiliyor. Branching, bu riski her PR'ı kendi izole veri kopyasına kavuşturarak baştan ortadan kaldırıyor.

### Önizleme ortamları production trafiğini mi kullanıyor?

Hayır, izole bir ortamda çalışıyor ve genelde production verisinin anonimleştirilmiş bir kopyası veya branch'lenmiş bir sürümüyle tohumlanıyor; gerçek kullanıcı trafiğine dokunmuyor.

### Teardown otomasyonu kurulmazsa ne olur?

Kapanmayan ortamlar birikir, bulut faturası sessizce artar ve zamanla hangi ortamın hâlâ gerekli olduğunu takip etmek zorlaşır. Bu yüzden teardown, opsiyonel bir iyileştirme değil, kurulumun zorunlu bir parçası olmalı.
