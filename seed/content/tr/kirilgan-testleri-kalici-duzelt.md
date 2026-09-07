---
title: "Kırılgan Testleri Kalıcı Olarak Düzelt"
slug: "kirilgan-testleri-kalici-duzelt"
translationKey: "fix-flaky-tests-for-good"
locale: "tr"
excerpt: "Kısa cevap: Kırılgan testi bulduğun anda karantinaya al, kök nedenini (zamanlama, paylaşılan durum, sıra bağımlılığı) tek tek elediğin bir süreçle düzelt."
category: "software-engineering"
tags: ["testing", "ci-cd", "code-quality", "best-practices"]
publishedAt: "2026-09-07"
seoTitle: "Kırılgan Testler Nasıl Kalıcı Olarak Düzeltilir?"
seoDescription: "Kırılgan (flaky) testlerin gerçek nedenleri nedir, nasıl tespit edilir ve kalıcı olarak düzeltilir? Karantina, kök neden analizi ve ölçüm rehberi."
---

Kısa cevap: bir testin kırılgan olduğunu fark ettiğin anda onu CI'ın zorunlu geçiş listesinden karantinaya al, ardından zamanlama, paylaşılan durum, sıra bağımlılığı ve gerçek saat/ağ kullanımı gibi dört yaygın kök nedeni tek tek eleyerek düzelt. Silmek ya da sonsuza kadar yeniden çalıştırmak, sorunu çözmüyor, sadece görünmez kılıyor.

## Kırılgan test tam olarak nedir?

Kırılgan (flaky) test, kod hiç değişmediği hâlde bazen geçen bazen başarısız olan test. Bu, gerçek bir regresyonla karıştırılmamalı: regresyon kodun bozulduğunu gösterir, kırılganlık ise testin kendisinin ya da test ortamının belirsiz (non-deterministic) olduğunu gösterir. 2022'de flakiness bildiren ekiplerin oranı %10 iken 2025'te bu oran **%26**'ya çıktı — yani sorun küçülmüyor, büyüyor.

Etkisi soyut değil, ölçülebilir: Atlassian'ın Jira Frontend deposunda ana dal build başarısızlıklarının **%21**'i, backend'de ise yaklaşık **%15**'i doğrudan flakiness'ten kaynaklanıyor. Google, toplam test hesaplama kapasitesinin **%16**'sının flaky testleri çalıştırıp yeniden çalıştırmaya harcandığını raporladı.

## Bir testi kırılgan yapan dört kök neden ne?

Neredeyse her kırılgan test şu dört kategoriden birine giriyor: asenkron zamanlama (bir `await` eksik ya da sabit bir `sleep` süresi yetersiz), testler arası paylaşılan durum (bir test diğerinin bıraktığı veriyi miras alıyor), sıra bağımlılığı (test yalnızca belirli bir sırada çalıştığında geçiyor) ve gerçek saat ya da ağ kullanımı (sistem saatine ya da dış bir servise bağımlı bir doğrulama).

| Kök neden | Tipik belirti | Kalıcı çözüm |
|---|---|---|
| Asenkron zamanlama | Testler paralel çalıştığında ya da yavaş makinede başarısız | Sabit `sleep` yerine koşulu bekleyen (polling/wait-for) yardımcı kullan |
| Paylaşılan durum | Test tek başına geçiyor, süitin parçası olarak başarısız | Her testte veritabanı/dosya sistemini sıfırdan kur |
| Sıra bağımlılığı | Test sırası değişince farklı sonuç | Testleri rastgele sırayla çalıştırıp bağımlılığı erken yakala |
| Gerçek saat/ağ | Gece yarısı ya da hafta sonu farklı sonuç, dış servis kesintisinde başarısız | Saati sahte (fake clock) yap, dış çağrıyı mock'la |

## Kırılgan bir testi nasıl tespit edersin?

En güvenilir yöntem, şüpheli testi izole bir ortamda art arda 50-100 kez çalıştırmak; gerçek bir regresyon her seferinde başarısız olurken kırılgan bir test bu turların bir kısmında geçer. CI'da yeniden deneme (retry) mekanizması varsa, "kaç denemede geçti" metriğini ayrı bir gösterge paneline loglamak, hangi testlerin sessizce kırılganlaştığını erken yakalamanı sağlıyor — retry'ın kendisi sorunu gizlediği için bu ölçüm olmadan flakiness fark edilmeden birikir.

```bash
# Bir testi izole şekilde 100 kez çalıştır (vitest örneği)
for i in $(seq 1 100); do
  pnpm vitest run tests/unit/checkout.test.ts --reporter=basic || echo "FAILED on run $i"
done
```

Bu tür bir betik, testin gerçekten kırılgan mı yoksa nadiren de olsa tutarlı şekilde mi başarısız olduğunu birkaç dakika içinde netleştiriyor — CI'da günlerce "bazen kırmızı" diye tartışmaktan çok daha ucuz.

## Karantina mı, silme mi: hangisi ne zaman?

Karantina, testi zorunlu geçiş listesinden çıkarıp ayrı, izlenen bir listede tutmak demek — test hâlâ çalışıyor, sonucu hâlâ raporlanıyor, ama ana dalı kilitlemiyor. Kök nedeni bilinen ve düzeltme planı olan her kırılgan test karantinaya girmeli, silinmemeli; çünkü test muhtemelen gerçek bir davranışı doğruluyor, sadece güvenilir şekilde doğrulamıyor. Silme, yalnızca test artık test ettiği özelliği karşılamıyorsa ya da özellik tamamen kaldırıldıysa doğru seçenek.

Karantina disiplinini zamana bağlamak önemli: iki haftadan uzun karantinada kalan bir test ya düzeltilmeli ya da bilinçli olarak silinmeli. Süresiz karantina, "geçici" listenin kalıcı bir çöp yığınına dönüşmesinin en yaygın yolu — ve bu liste büyüdükçe ekip onu tamamen görmezden gelmeye başlıyor.

Bu disiplini genel [temiz kod prensipleri](/tr/posts/temiz-kod-prensipleri) çerçevesine oturtmak istersen, "her zaman geçen ya da açıkça arızalı, ama asla belirsiz olmayan test" ilkesi, kod tabanının geri kalanındaki öngörülebilirlik beklentisiyle birebir örtüşüyor.

## Flake oranını ölçmek neden gerekli?

Flake oranı **%5**'i geçtiğinde ekiplerin yayın döngüleri **%20-40** daha uzun sürüyor — çünkü her başarısız build'de "bu gerçek mi, flaky mi" tartışması zaman yiyor. 20 mühendislik ekibinde, günde 500 dakikalık CI pipeline'ında %12'lik bir flake oranı, CI dakika maliyeti ve mühendis triyaj süresi birlikte modellendiğinde yıllık yaklaşık **120.000 dolar**'a karşılık geliyor; 100 kişilik bir mühendislik organizasyonunda bu rakam yılda **2,6 milyon dolar**'a kadar çıkabiliyor.

Bu maliyeti görünür kılmadan öncelik sırasına koymak zor. En basit gösterge: her test için "toplam çalıştırma / başarısız çalıştırma" oranını haftalık takip et, en yüksek flake oranına sahip 10 testi ayrı bir listede tut ve sprint planlamasına bu listeden en az bir düzeltme koy.

## Flakiness'i kaynağa göre önceliklendirmek nasıl işe yarar?

Her kırılgan test aynı aciliyette değil. Bir ödeme akışını test eden ve haftada bir başarısız olan bir test, kozmetik bir bileşeni test eden ve günde on kez başarısız olan bir testten çok daha yüksek risk taşıyor — ama ikincisi, sık başarısız olduğu için ekibin dikkatini daha çok çekiyor ve genelde önce o düzeltiliyor. Doğru önceliklendirme iki eksende çalışır: testin kapsadığı kod yolunun kritikliği ve testin gerçek başarısızlık sıklığı. Bu ikisini çarpan basit bir puanlama (kritiklik × haftalık başarısızlık sayısı), hangi 10 testin gerçekten önce düzeltilmesi gerektiğini "en son kim şikayet etti" gibi öznel bir sıralamadan çok daha güvenilir belirliyor.

## Flakiness'i test yazarken en baştan nasıl önlersin?

Kırılganlığın büyük kısmı, testin kendisi yazılırken önlenebilir. Üç alışkanlık en çok işe yarıyor: sabit bekleme süresi (`sleep(2000)`) yerine her zaman koşulu bekleyen bir yardımcı fonksiyon kullanmak; her testin kendi test verisini oluşturup kendi temizlemesini sağlamak, önceki testin bıraktığı duruma güvenmemek; ve dış bir servise gerçekten ihtiyaç olmadığı sürece asla gerçek bir ağ çağrısı yapmamak, mock veya sahte (fake) sunucu kullanmak.

```text
Kötü:  await sleep(2000); expect(button).toBeEnabled()
İyi:   await waitFor(() => expect(button).toBeEnabled())
```

Bu tek satırlık fark önemli: `sleep(2000)`, yavaş bir CI makinesinde yetersiz kalabilir ya da hızlı bir makinede gereksiz yere testi yavaşlatabilir; `waitFor` ise koşul gerçekleşene kadar (makul bir zaman aşımıyla) bekler, bu yüzden hem daha hızlı hem daha güvenilir.

Kod incelemesinde bu üç kalıba özellikle dikkat etmek, testin merge edildikten sonra kırılganlaşmasını büyük ölçüde önlüyor: sabit bekleme süreleri, testler arasında paylaşılan (ve temizlenmeyen) global durum ve bir testin çıktısının önceki testin çalışma sırasına bağlı olması. Bu üçü bir PR şablonuna kontrol maddesi olarak eklemek, flakiness'i düzeltmek yerine baştan önlüyor.

## Sıkça Sorulan Sorular

### Kırılgan test ile gerçek regresyon nasıl ayırt edilir?

Şüpheli testi izole bir ortamda art arda birkaç kez çalıştır: gerçek bir regresyon kod değişmediği sürece her seferinde aynı şekilde başarısız olur, kırılgan bir test ise bu turların bir kısmında geçer. Kod değişmeden sonucun değişmesi, kırılganlığın en güvenilir işareti.

### CI'da yeniden deneme (retry) kullanmak flaky testleri çözer mi?

Hayır, sorunu görünmez kılar ama düzeltmez. Retry, build'in kırmızı görünmesini engelleyerek kısa vadede zaman kazandırır ama testin altında yatan zamanlama ya da paylaşılan durum sorunu çözülmeden kalır ve genellikle zamanla kötüleşir; retry oranını ayrı bir metrik olarak izlemeden bu birikim fark edilmez.

### Bir test ne zaman silinmeli, ne zaman karantinaya alınmalı?

Kök nedeni bilinen ve düzeltme planı olan bir test karantinaya alınmalı, çünkü muhtemelen gerçek bir davranışı test ediyor. Silme, yalnızca test artık geçerli bir özelliği karşılamıyorsa ya da o özellik tamamen kaldırıldıysa doğru; belirsizlik "biraz sonra düzeltiriz" ile süresiz karantinaya dönüşmemeli.

### Flakiness gerçekten ne kadara mal oluyor?

20 mühendislik ekipte, günde 500 dakikalık CI pipeline'ında %12 flake oranı CI dakika maliyeti ve triyaj süresiyle birlikte yılda yaklaşık 120.000 dolara karşılık geliyor; 100 kişilik organizasyonlarda bu rakam yılda 2,6 milyon dolara kadar çıkabiliyor. Flake oranı %5'i geçtiğinde yayın döngüleri de %20-40 uzuyor.
