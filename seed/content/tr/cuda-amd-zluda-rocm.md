---
title: "CUDA'yı AMD'de Çalıştırmak: ZLUDA ve ROCm"
slug: "cuda-amd-zluda-rocm"
translationKey: "zluda-cuda-on-amd-2026"
locale: "tr"
excerpt: "Kısa cevap: Evet, tek bir kartta. Bir geliştirici Eylül 2026'da RX 9060 XT'de ZLUDA ile gerçek bir PyTorch işi çalıştırdı, ama cuDNN hâlâ çalışmıyor."
category: "technology"
tags: ["hardware", "machine-learning", "open-source", "performance"]
publishedAt: "2026-09-21"
seoTitle: "ZLUDA 2026'da AMD'de CUDA'yı Gerçekten Çalıştırıyor mu?"
seoDescription: "Kısa cevap: Evet, tek bir kartta. Bir geliştirici Eylül 2026'da RX 9060 XT'de ZLUDA ile gerçek bir PyTorch işi çalıştırdı, ama cuDNN hâlâ çalışmıyor."
---

Kısa cevap: Evet, ama tek bir kartla sınırlı. Eylül 2026'da bağımsız bir geliştirici, ZLUDA'yı AMD'nin HIP/ROCm yığınına bağlayarak bir Radeon RX 9060 XT üzerinde 2,2 milyon parametreli gerçek bir PyTorch pekiştirmeli öğrenme işini, kaynak kodunda hiçbir değişiklik yapmadan ve Linux'a çift önyükleme yapmadan çalıştırdı. Ama bir eksik var: derin öğrenme eğitiminin hız için büyük ölçüde bağımlı olduğu cuDNN kütüphanesi hâlâ çalışmıyor.

## ZLUDA nedir ve neden önemli?

ZLUDA, NVIDIA'nın CUDA sürücü API'sine yapılan çağrıları yakalayıp bunun yerine AMD'nin ROCm/HIP yığınına yönlendiren bir çeviri katmanı; bu sayede değiştirilmemiş CUDA yazılımı AMD donanımında çalışabiliyor. Önemli çünkü CUDA, GPU hesaplamada fiili bir kilitlenme noktası — çoğu makine öğrenmesi çerçevesi, bilimsel hesaplama kütüphanesi ve render aracı önce CUDA'yı destekliyor; AMD donanımına geçmek ise şimdiye kadar ya kod yeniden yazmak ya da tüm kütüphanelere erişimi kaybetmek anlamına geliyordu.

ZLUDA'nın kendisi yeni değil — AMD, projeyi yıllar önce sessizce bırakmadan önce erken geliştirmesini finanse etmişti — ama Eylül 2026'daki bir topluluk çalışması, projeyi daha önce desteklenmeyen belirli bir kombinasyon için yeniden canlandırdı: Linux değil Windows ve güncel nesil bir tüketici Radeon kartı.

## Eylül 2026'da RX 9060 XT'de tam olarak ne oldu?

13 Eylül 2026'da CUDA-for-AMD-Windows adlı proje, bir RX 9060 XT üzerinde (gfx1200 mimarisi) gerçek bir PyTorch pekiştirmeli öğrenme ağını -2,2 milyon parametre, 65.536 zaman adımı- ortanca 13.278 adım/saniye hızla tamamladı. Bu sentetik bir mikro-benchmark değildi; çevrilmiş CUDA çağrıları üzerinden çalışan, sanallaştırma katmanı ya da Linux'a çift önyükleme gerektirmeyen gerçek bir eğitim işiydi.

Proje, ZLUDA'nın CUDA API yakalama mekanizmasını AMD'nin Windows için yerel HIP/ROCm SDK'sıyla köprülüyor; geliştirici, CUDA sürücü API'sinin yanı sıra üç önemli kütüphaneyi -cuBLAS (doğrusal cebir), cuSPARSE (seyrek matris işlemleri) ve cuFFT (Fourier dönüşümleri)- başarıyla AMD karşılıklarına eşledi. Bu, bilimsel hesaplama ve klasik makine öğrenmesi işlerinin anlamlı bir kısmını kapsamaya yetiyor.

## Hâlâ çalışmayan ne var?

Evrişimli ve tekrarlayan sinir ağı işlemlerini hızlandıran cuDNN kütüphanesi henüz bağlanmadı ve bu ciddi bir eksik. Çoğu derin öğrenme eğitim hattı, özellikle bilgisayarla görü ağırlıklı olanlar, en hızlı kod yollarını cuDNN'e dayandırıyor; o olmadan iş yükleri ya daha yavaş, optimize edilmemiş çekirdeklere düşüyor ya da çerçevenin ona ne kadar sıkı bağlı olduğuna göre tamamen başarısız oluyor.

Doğrulama da gerekliliği gereği dar kapsamlı: şimdiye kadar yalnızca RX 9060 XT test edildi. AMD'nin RDNA GPU serisi birden fazla mimari nesli kapsıyor ve ROCm'in kendi destek matrisi bugüne kadar bunlar arasında tutarsız kaldı — tek bir kartın komut kümesine ve sürücü davranışına göre oluşturulup doğrulanmış bir çeviri katmanı, ayrı bir test yapılmadan serinin geri kalanına otomatik olarak taşınmıyor.

| Bileşen | RX 9060 XT'de Durum (Eylül 2026) |
|---|---|
| CUDA sürücü API'si | HIP/ROCm'e eşlendi |
| cuBLAS, cuSPARSE, cuFFT | Çalışıyor, AMD karşılıklarına bağlandı |
| cuDNN | Çalışmıyor |
| Sanallaştırma/çift önyükleme | Gerekli değil |
| Doğrulanan kartlar | Yalnızca RX 9060 XT |

## Bu, gerçekte kimi ilgilendiriyor?

cuDNN'e dayanmayan klasik makine öğrenmesi, bilimsel hesaplama veya yalnızca CUDA ile çalışan araçları kullanan hobi amaçlı kullanıcılar ve maliyete duyarlı ekipler, yakın vadede gerçek fayda görüyor — Linux'a dokunmak istemeden bir oyuncu Radeon kartında doğrusal cebir ağırlıklı simülasyonlar ya da CUDA'ya kilitli bir render aracı çalıştıran biri bugün gerçek bir kazanç elde ediyor. cuDNN desteği olmadan AMD donanımında production seviyesinde derin öğrenme eğitimi henüz ciddi bir seçenek değil; NVIDIA'dan topyekûn geçişi değerlendiren ekipler, bunu genel bir geçiş yolu değil, erken aşamalı, tek kartlık bir kanıt olarak görmeli — bu, [bir AI ajanını CI/CD'ye bağlarken](/tr/posts/ai-agent-mi-workflow-mu) de geçerli olan aynı "gerçekten çalışıyor mu" temkinliliği: tek bir yapılandırmada çalışan bir demo, göründüğünden çok daha az şey söyler.

Kuruluma zaman ayırmadan önce kendi iş yükünüzün gerçekten fayda görüp görmeyeceğini hızlıca kontrol etmenin bir yolu:

```python
import torch

print("CUDA kullanılabilir mi:", torch.cuda.is_available())
print("Cihaz sayısı:", torch.cuda.device_count())
# Eğitim döngünüz herhangi bir yerde torch.backends.cudnn çağırıyorsa,
# bugün bir ZLUDA/ROCm yığınında en olası kırılma noktası burasıdır.
print("cuDNN etkin mi:", torch.backends.cudnn.enabled)
```

Eğitim döngünüzde `torch.backends.cudnn.enabled` gerçekten iş görüyorsa, bu Eylül 2026 dönüm noktası seçeneklerinizi henüz değiştirmiyor.

## Bu, NVIDIA'nın CUDA tekeline bir tehdit mi?

Şimdilik değil, ama gerçek bir çatlak var, sadece hobi amaçlı bir gösteri değil. NVIDIA'nın 2020'lerin ikinci yarısı boyunca koruduğu fiyatlandırma gücü, büyük ölçüde CUDA'dan uzaklaşmanın araç setini kaybetmek anlamına gelmesine dayanıyordu; kütüphane kapsamını genişletmeye devam eden, topluluk tarafından sürdürülen bir çeviri katmanı, bu kilitlenmeyi kütüphane kütüphane aşındırıyor — tıpkı Wine'ın, Windows'un kendisini önemsiz kılmadan Windows'a özel yazılımları Linux'ta kullanılabilir hâle getirmesi gibi. Dürüst değerlendirme: bunu yakından takip etmeye değer, ama production yığınınızı şimdiden değiştirmeye değmez.

Maliyet tarafı da göz ardı edilmemeli: bir RX 9060 XT, yazının yayınlandığı tarihte karşılaştırılabilir bir NVIDIA kartına göre önemli ölçüde daha ucuza satılıyor, bu da hobi projeleri ve küçük araştırma bütçeleri için ZLUDA yolunu cazip kılıyor. Ama şirket içi bir platform kararı verirken tek kartlık bir doğrulamayı tüm ürün hattına genellemek riskli; RDNA mimarisinin farklı nesilleri arasında sürücü davranışı ve talimat kümesi farklılık gösteriyor, dolayısıyla bir sonraki adım muhtemelen topluluğun bu doğrulamayı RX 9070 ve RX 9080 serisi gibi diğer kartlara genişletmesi olacak.

Projenin açık kaynaklı olması da kritik bir ayrıntı: kod tabanı herkese açık olduğu için kütüphane eşlemelerini bağımsız olarak denetlemek, hatalı bir çeviriyi tespit etmek ya da cuDNN desteğini kendi ekibiniz için erkenden denemek mümkün. Bu, kapalı kaynaklı bir sürücü katmanına güvenmekten çok daha şeffaf bir konum; ama aynı şeffaflık, projenin bakımının tek bir gönüllü geliştiriciye bağlı kalması riskini de beraberinde getiriyor. Kurumsal bir ekip bu yolu ciddiye alacaksa, projeye katkı sağlamayı ya da en azından kendi iç doğrulama sürecini kurmayı hesaba katmalı; aksi hâlde tek bir katkıcının bıraktığı yerden devam edemeyen, bakımsız kalmış bir bağımlılığa yatırım yapma riskiyle karşı karşıya kalır.

## Sıkça Sorulan Sorular

### Bugün bir AMD GPU'da CUDA yazılımı çalıştırabilir miyim?

Özellikle bir Radeon RX 9060 XT'de, cuDNN'e bağımlı olmayan iş yükleri için evet — Eylül 2026'daki bir proje, kaynak kodda değişiklik yapmadan ve Linux'a çift önyükleme gerekmeden ZLUDA ve ROCm üzerinden gerçek bir PyTorch eğitim çalıştırması gösterdi.

### ZLUDA, PyTorch gibi derin öğrenme çerçeveleriyle çalışıyor mu?

Kısmen. Temel CUDA sürücü çağrıları ve cuBLAS, cuSPARSE, cuFFT gibi kütüphaneler AMD'nin ROCm/HIP yığınına eşleniyor, ama çoğu derin öğrenme çerçevesinin hızlı evrişim ve tekrarlayan işlemler için dayandığı cuDNN henüz desteklenmiyor.

### AMD donanımında ZLUDA kullanmak için Linux'a çift önyükleme yapmam gerekiyor mu?

Bu spesifik Eylül 2026 projesi için hayır. Windows üzerinde yerel olarak çalışıyor; CUDA API çağrılarını sanallaştırma katmanı ya da Linux çift önyüklemesi olmadan AMD'nin HIP/ROCm SDK'sına çeviriyor.

### Bu ZLUDA ve ROCm kurulumunu hangi AMD GPU'lar destekliyor?

Eylül 2026 itibarıyla projenin geliştiricisi tarafından yalnızca Radeon RX 9060 XT test edilip doğrulandı; AMD'nin daha geniş RDNA serisinin aynı şekilde çalıştığı teyit edilmedi.

Daha geniş bir dağıtımdan önce tek bir çalışan demoyu temkinli değerlendirmek hakkında [AI Agent mı Workflow mu](/tr/posts/ai-agent-mi-workflow-mu) yazımıza bakabilirsiniz. Daha fazla donanım ve altyapı içeriği için [Teknoloji kategorimizi](/tr/category/teknoloji) ziyaret edin.

Kaynaklar: [Bağımsız geliştirici ZLUDA'yı AMD'nin HIP'ine bağladı (Tom's Hardware)](https://www.tomshardware.com/pc-components/gpu-drivers/solo-developer-wires-zluda-to-amds-hip-getting-multiple-cuda-libraries-running-on-a-radeon-rx-9060-xt-in-windows-cuda-exclusive-workloads-on-amd-hardware-in-windows-is-possible-without-virtualization-or-dual-booting) ve [CUDA-for-AMD-Windows doğrulama notları (GitHub)](https://github.com/Speedstu/CUDA-for-AMD-Windows/blob/main/docs/VALIDATION.md).
