---
title: "2026'da Kendi Ev Sunucunuzu Kurun"
slug: "2026-ev-sunucusu-kurmak"
translationKey: "build-a-homelab-2026"
locale: "tr"
excerpt: "Kısa cevap: 300 dolarlık düşük güçlü bir mini PC ile başlayın, Docker ve Pi-hole/Jellyfin/Nextcloud gibi birkaç konteynerle devam edin; 15W boşta güç yeterli."
category: "technology"
tags: ["self-hosting", "docker", "privacy"]
publishedAt: "2026-10-24"
seoTitle: "2026'da Ev Sunucusu (Homelab) Nasıl Kurulur?"
seoDescription: "Mini PC mi NAS mı, Docker ile hangi servisler, güvenli uzaktan erişim ve gerçek güç/gürültü maliyeti — 2026'da ilk homelab'ınızı abartmadan kurma rehberi."
---

Kısa cevap: 2026'da bir ev sunucusuna (homelab) başlamanın en ucuz yolu, 300 dolar civarı, 15W boşta güç tüketen bir mini PC (örneğin Ryzen 5 5560U işlemcili, 16GB RAM'li bir model) almak, üzerine Docker kurmak ve ilk haftanızda yalnızca üç servis çalıştırmak: bir reklam engelleyici DNS (Pi-hole), bir medya sunucusu (Jellyfin) ve bir yedekleme hedefi. Büyük bir NAS'a ya da sanallaştırma platformuna (Proxmox) ihtiyacınız yok — bunlar, gerçekten ihtiyaç duyduğunuzda eklenecek ikinci aşama kararlar.

## Homelab nedir ve 2026'da neden kuruluyor?

Kısa cevap: Homelab, evinizde kendi donanımınızda çalıştırdığınız, bulut servislerine bağımlı olmayan küçük bir sunucu/ağ kurulumu; insanların 2026'da kurma nedenleri çoğunlukla üç başlıkta toplanıyor: reklamları ağ seviyesinde engellemek, fotoğraf/video/müzik koleksiyonunu bir aboneliğe bağımlı olmadan saklamak, ve giderek artan oranda, yerel bir büyük dil modelini (LLM) kendi donanımınızda çalıştırmak. Üçüncü neden yeni — 2026'da tüketici sınıfı donanımın yerel AI iş yüklerini kaldırabilmesi, homelab topluluğuna yeni bir kullanıcı dalgası getirdi.

Bulut aboneliklerinden (fotoğraf depolama, müzik, VPN) kaçınmak da güçlü bir motivasyon: tek seferlik donanım maliyeti, birkaç yıl içinde aylık abonelik toplamını geçebiliyor, üstelik verileriniz kendi diskinizde kalıyor.

Topluluğun kendisi de büyüyor: r/selfhosted gibi forumlarda paylaşılan kurulumlar, artık yalnızca teknik meraklıların değil, basitçe "Netflix yerine kendi medya kütüphanemi istiyorum" diyen sıradan kullanıcıların da homelab kurduğunu gösteriyor. Bu, topluluğun önerdiği başlangıç yazılım setinin son birkaç yılda daha az teknik bilgi gerektirecek şekilde olgunlaştığı anlamına geliyor.

## Mini PC mi NAS mı ile başlamalı?

Kısa cevap: İlk kuruluma bir mini PC ile başlayın, depolama ihtiyacınız büyüdüğünde (birkaç TB'ı aştığınızda) ayrı bir NAS ya da harici DAS (doğrudan bağlı depolama) ekleyin. Bu sıralama önemli çünkü çoğu yeni başlayan, henüz ihtiyaç duymadığı depolama kapasitesine baştan yatırım yapıp bütçesinin çoğunu orada harcıyor.

| Bileşen | Başlangıç seçimi | Yaklaşık fiyat | Not |
|---|---|---|---|
| Mini PC (bütçe) | Beelink SER5 (Ryzen 5 5560U, 16GB DDR4, 500GB NVMe) | ~300 dolar | 15W boşta güçle 10+ konteyner çalıştırabiliyor |
| Mini PC (orta seviye) | Minisforum UM790 Pro | ~500-600 dolar | Daha fazla RAM/çekirdek, ağır iş yükleri için |
| NAS (ikinci aşama) | Synology DS224+ | ~300-350 dolar | Depolama öncelikli kurulumlar için |
| Güç koruması | UPS (kesintisiz güç kaynağı) | ~80-150 dolar | Ani kesintilerde veri bozulmasını önler |
| Toplam başlangıç bütçesi | — | ~500-800 dolar | Daha kapsamlı kurulumlar için 1.500 dolara kadar çıkabilir |

## Hangi işletim sistemi/sanallaştırma katmanını seçmeli?

Kısa cevap: Birden fazla sanal makine çalıştırmak istiyorsanız Proxmox, öncelik depolama ve dosya paylaşımıysa TrueNAS SCALE kullanın; her iki durumda da gerçek servisleri Docker konteynerleri olarak çalıştırın, çıplak metal üzerine kurmayın. Docker'ın avantajı, bir servisi bozduğunuzda tüm sistemi değil yalnızca o konteyneri sıfırlayabilmeniz — bu, yeni başlayanların en sık yaptığı "bir şeyi bozup her şeyi yeniden kurma" hatasını ortadan kaldırıyor.

Konteynerleri komut satırından tek tek yönetmek yerine Portainer gibi bir web arayüzü kullanmak, ilk haftalarda büyük bir öğrenme eğrisi kolaylığı sağlıyor.

## İlk hafta hangi servisleri kurmalı?

Kısa cevap: İlk haftada yalnızca üç servisle sınırlı kalın — ağ genelinde reklam engelleme için Pi-hole, kendi medya kütüphaneniz için Jellyfin (ya da Plex), ve dosyalarınız için basit bir Nextcloud örneği. Bundan fazlasını aynı anda kurmaya çalışmak, sorun giderme karmaşıklığını katlayarak artırıyor ve çoğu yeni başlayanın ilk ayda pes etmesinin asıl nedeni bu.

```yaml
# docker-compose.yml — başlangıç için üç servislik minimal kurulum
services:
  pihole:
    image: pihole/pihole:latest
    ports:
      - "53:53/tcp"
      - "53:53/udp"
      - "80:80/tcp"
    restart: unless-stopped

  jellyfin:
    image: jellyfin/jellyfin:latest
    volumes:
      - ./media:/media
    ports:
      - "8096:8096"
    restart: unless-stopped
```

Bu üç servis oturduktan sonra Home Assistant (ev otomasyonu) ya da yerel bir AI modeli gibi daha ileri düzey eklemeler yapabilirsiniz.

## Ev dışından güvenle nasıl erişilir?

Kısa cevap: Router'ınızda port yönlendirme (port forwarding) açmak yerine Tailscale gibi bir sıfır güven ağ aracı kullanın — bu, ev ağınızı doğrudan internete açmadan, yalnızca sizin cihazlarınızın (VPN benzeri bir tünel üzerinden) sunucunuza erişmesini sağlıyor. Port yönlendirme, güvenlik açıklarının sunucunuza doğrudan ulaşabileceği bir giriş noktası açtığı için, yeni başlayanların yapabileceği en riskli hatalardan biri.

Bu konuyu daha derinlemesine ele alan [küçük ekipler için sıfır güven ağ rehberimize](/tr/posts/kucuk-ekip-sifir-guven-ag-tailscale) göz atabilirsiniz; aynı mantık tek kişilik bir homelab için de geçerli.

## Gerçek güç, gürültü ve bakım maliyeti ne kadar?

Kısa cevap: Bütçe sınıfı bir mini PC, 10'dan fazla konteyner çalıştırırken bile yaklaşık 15W boşta güç çekiyor — bu, yıllık elektrik maliyetinde (bölgenize göre) genelde 15-25 dolar aralığında kalıyor ve geleneksel bir rack sunucudan çok daha düşük. Fan gürültüsü bütçe mini PC'lerde neredeyse hissedilmiyor, ama ucuz bir NAS'a 3,5 inçlik dönen diskler eklediğinizde gece sessiz bir odada fark edilebilir bir vınlama oluşuyor.

Bakım tarafında gerçekçi beklenti şu: ayda bir Docker imajlarını güncellemek, diskinizi doldurmaması için log'ları periyodik temizlemek ve yedeklerinizin gerçekten çalıştığını (yalnızca zamanlanmış olduğunu değil) ayda bir test etmek. Bu üçünü ihmal eden çoğu homelab, altı ay içinde "bir şey bozuldu ama neden bilmiyorum" durumuna düşüyor.

Kişisel değerlendirmem: Çoğu yeni başlayan ilk ayda çok fazla servis kurmaya çalışıp yorularak vazgeçiyor — oysa homelab'ın asıl değeri, az sayıda servisi güvenilir şekilde çalıştırmakta, otuz tane deneysel konteyner biriktirmekte değil. Üç servisle başlayıp altı ayda bir yenisini eklemek, ilk haftada on servis kurup ikinci ayda hiçbirini anlamamaktan çok daha sürdürülebilir.

Her ay yaptığınız bakımı bir kontrol listesine dökmek, unutmayı önlüyor: Docker imajlarını güncelle, disk kullanımını kontrol et, yedeklerden birini geri yükleyip gerçekten açıldığını doğrula. Bu üç adımı takvime koymadan homelab'ınızın güvenilir kalmasını beklemeyin — çoğu veri kaybı, bozuk bir yedekten değil, hiç test edilmemiş bir yedekten kaynaklanıyor.

Konteyner kurulumunuzu üretim kalitesine yaklaştırmak isterseniz [Docker en iyi pratikleri rehberimize](/tr/posts/docker-en-iyi-pratikleri) bakabilirsiniz; evde bir Kubernetes kümesi kurmadan servis dağıtmak isteyenler için [Kamal ve Coolify karşılaştırmamız](/tr/posts/kubernetessiz-deploy-kamal-coolify) da faydalı olacaktır. Daha fazla teknoloji içeriği için [Teknoloji kategori sayfamızı](/tr/category/teknoloji) ziyaret edebilirsiniz.

## Sıkça Sorulan Sorular

### Homelab kurmak için ne kadar bütçe ayırmalıyım?

Başlangıç için 500-800 dolar arası bir bütçe yeterli; bu, bir mini PC, isteğe bağlı bir UPS ve temel depolamayı kapsıyor. Daha kapsamlı bir NAS ve sanallaştırma katmanı eklemek isteyenler için bütçe 1.500 dolara kadar çıkabilir.

### Homelab için mini PC mi NAS mı daha iyi bir başlangıç?

Mini PC ile başlayın çünkü daha ucuz ve daha az güç tüketiyor; depolama ihtiyacınız birkaç TB'ı geçtiğinde ayrı bir NAS ya da harici DAS ekleyin. Çoğu yeni başlayan, henüz ihtiyaç duymadığı depolamaya baştan yatırım yaparak bütçesini yanlış yere harcıyor.

### Homelab'ıma ev dışından nasıl güvenle erişebilirim?

Router'ınızda port yönlendirme açmak yerine Tailscale gibi bir sıfır güven ağ aracı kullanın. Bu, ev ağınızı doğrudan internete açık hale getirmeden, yalnızca kendi cihazlarınızın bir tünel üzerinden sunucunuza erişmesini sağlıyor.

### Bir homelab'ın elektrik maliyeti ne kadar?

Bütçe sınıfı bir mini PC, 10'dan fazla konteyner çalıştırırken bile yaklaşık 15W boşta güç çekiyor, bu da yıllık elektrik maliyetini bölgenize göre genelde 15-25 dolar aralığında tutuyor — geleneksel bir rack sunucudan belirgin şekilde daha düşük.

Kaynaklar:
- [Ultimate Home Lab Starter Stack for 2026](https://www.virtualizationhowto.com/2025/12/ultimate-home-lab-starter-stack-for-2026-key-recommendations/)
- [Best Home Lab Servers for Beginners in 2026](https://www.wemustbegeeks.com/best-home-lab-servers-for-beginners-in-2026/)
