---
title: "Claude Code'un /code-review'u Nasıl Değişti?"
slug: "claude-code-code-review-onem-seviyeleri"
translationKey: "claude-code-code-review-severity-levels-2026"
locale: "tr"
excerpt: "19 Kasım 2026'dan itibaren Claude Code /code-review'u sadece bug ve CLAUDE.md ihlalini bildiriyor; bulguları Important, Pre-existing, Nit etiketliyor."
category: "software-engineering"
tags: ["claude", "code-quality", "ai-coding", "best-practices"]
publishedAt: "2026-11-20"
seoTitle: "Claude Code /code-review: Kasım 2026'da Ne Değişti?"
seoDescription: "Claude Code 2.1.328-2.1.329 (Kasım 2026), /code-review'u bug/CLAUDE.md ihlaline daralttı, Important/Pre-existing/Nit etiketi ve tüm dal incelemesi ekledi."
---

Claude Code'un `/code-review` komutu, 19 Kasım 2026 sürümünde (2.1.328 ve 2.1.329) iki kez değişti: artık çoğu modelde sadece gerçek bug'ları ve projenizin CLAUDE.md kurallarına aykırılıkları bildiriyor, her bulguyu Important, Pre-existing veya Nit olarak etiketliyor ve hedef belirtmeden çalıştırıldığında mevcut dalın tamamını varsayılan dala karşı inceliyor.

## /code-review'da Tam Olarak Ne Değişti?

Bu sürümden önce `/code-review`, stil önerilerini, sadeleştirme fikirlerini ve gerçek bug'ları hangisinin önemli olduğuna dair bir önem sinyali vermeden birlikte sunuyordu. 2.1.328 sürümü itibarıyla komut, çoğu modelde kapsamını iki kategoriye daraltıyor: gerçek bug'lar ve projenizin CLAUDE.md kurallarına aykırılıklar. Daha temiz bir değişken adı veya biraz farklı bir desen gibi her şey, `/code-review`'un artık varsayılan olarak gösterdiği şeyin dışında kalıyor.

| Davranış | 19 Kasım 2026'dan önce | 2.1.328/2.1.329 sonrası |
|---|---|---|
| Ne bildiriliyor | Bug, stil, sadeleştirme birlikte | Sadece bug ve CLAUDE.md ihlalleri (çoğu model) |
| Önem sinyali | Yok | Her bulguda Important, Pre-existing veya Nit |
| Hedefsiz inceleme kapsamı | Kuruluma göre değişiyordu | Mevcut dalın tamamı vs. varsayılan dal (çoğu model) |
| Stil/sadeleştirme geri bildirimi nerede | `/code-review` | Ayrı bir geçiş, örneğin `/simplify` |

## "Important", "Pre-existing" ve "Nit" Gerçekte Ne Anlama Geliyor?

Important, değişikliğinizin eklediği veya kötüleştirdiği bir bug'ı işaretliyor — birleştirmeyi durdurması gereken türden bir bulgu. Pre-existing, değişikliğiniz koda dokunmadan önce zaten var olan bir bug'ı işaretliyor; triyaj için önemli ama diff'inizin onu yarattığı anlamına gelmiyor. Nit, göz atmaya değer ama birleştirmeyi engellemeye değmeyen küçük bir sorunu işaretliyor. Bu üçlü ayrım, tam olarak bir incelemecinin — insan ya da Claude — raporu tarayıp on işaretlenmiş sorundan hangisinin gerçekten önemli olduğunu anlamak için her satırı yeniden okumak zorunda kalmadan önce Important bulgulara odaklanabilmesi için var.

## /code-review Hâlâ Stil ve Sadeleştirme Fikirlerini Yakalıyor mu?

Çoğu modelde varsayılan olarak hayır; değişikliğin amacı tam olarak bu — `/code-review` artık genel kod kalitesine değil, doğruluğa odaklanıyor. Yeniden kullanım, sadeleştirme ve verimlilik geri bildirimi istiyorsanız, bu her incelemeye karıştırılan bir şey değil, projenin araçlarının ayırdığı ayrı bir konu. İki konuyu ayrı tutmak, gerçek bug'larla dolu bir `/code-review` raporunun bir düzine stilistik ince ayrıntının altında kalmaması demek — ekiplerin [AI ile kod incelemesini güven ama doğrula](/tr/posts/ai-ile-kod-incelemesi-guven-dogrula) ile ilk tanıştıklarında karşılaştıkları tam olarak bu sinyal-gürültü sorunu.

## Hedef Seçmeden Tüm Dalı Nasıl İncelersiniz?

`/code-review`'u hedefsiz çalıştırmak, 2.1.329 sürümü (19 Kasım 2026) itibarıyla çoğu modelde mevcut dalınızın tamamını varsayılan dala karşı inceliyor. Bu, anlamlı bir varsayılan değişikliği: daha önce "hedefsiz"in ne anlama geldiği yerel kurulumunuza göre değişiyordu. Şimdi tutarlı davranıyor — bir incelemecinin bir pull request'i onaylamadan önce yaptığına, sadece en son commit'i değil tüm dalınızı diff'lemeye daha yakın.

```bash
# Mevcut dalın tamamını varsayılan dala karşı incele
claude
> /code-review

# Belirli bir PR numarasını, dalı veya yolu incele
> /code-review 482
> /code-review feature/billing-refactor
```

## Kaç Bulgu Göreceğinizi veya İncelemenin Ne Kadar Derin Gideceğini Kontrol Edebilir misiniz?

Evet, her iki eksende de — ve bu kontroller bu sürümde yeni değil, ama bulgular artık bir önem etiketi taşıdığı için daha fazla önem kazandılar. Hedeften önce bir effort seviyesi geçebilirsiniz — low, medium, high, xhigh veya max — böylece `/code-review high src/billing` kodun hassas bir alanında varsayılandan daha derin bir geçiş yapar; seviye verilmezse en son yazdığınız seviyeyi yeniden kullanır. Kaç bulgunun geri döneceğini `--max-findings <n>` ile sınırlayabilir veya `--max-findings all` ile her bulguyu isteyebilirsiniz; bu, önce Important'a göre filtreleyip Nit yığınının tamamını yalnızca ara sıra görmek istediğinizde, her çalıştırmada değil, kullanışlı oluyor. İkisini birleştirin: bir yayın dalında `high` veya `xhigh` seviyesinde bir geçiş ve `--max-findings all`; rutin bir özellik dalında ise varsayılan effort ve küçük bir `--max-findings` sınırı.

## Bu, İnsan Kod İncelemesinin Yerini Alıyor mu?

Hayır; önem etiketlerinin kendisi bunun nedenine işaret ediyor: Pre-existing bulguları, Claude Code'un "değişikliğinizin yarattığı bug'lar" ile "zaten orada olan bug'lar"ı açıkça ayırmaya çalıştığı için var — bu bir triyaj aracı, birleştirme kararı değil. Important/Pre-existing/Nit ayrımına, titiz ama hata yapabilen bir yeni mezun incelemecinin geçişine davrandığınız gibi davranın — hızlı bir ilk filtre, ama gerçekten riskli bir şeyin yayına çıkmadan önce bir insanın bakmasından hâlâ fayda görüyor; özellikle karmaşık bir değişiklikte [Claude Code'un effort parametresiyle](/tr/posts/claude-code-effort-parametresi-nedir) ayarlayacağınız türden effort'a duyarlı bir inceleme için.

## Şimdiden Farklı Ne Yapmalısınız?

Ekibiniz `/code-review`'un eski, etiketsiz çıktısı etrafında iş akışları veya panolar kurduysa, bunları üçlü önem etiketini bekleyecek şekilde güncelleyin; çünkü bir raporu triyaj etmenin en hızlı yolu artık bu etikete göre filtrelemek — önce Important'tan başlayın, Pre-existing bulguları ayrı bir temizlik geçişi için gruplayın ve Nit'i isteğe bağlı okuma olarak değerlendirin. `/code-review`'u stil geri bildirimi için de kullanıyorsanız, bu alışkanlığı komutun varsayılan çıktısında geri bekleyeceğiniz yerde ayrı bir geçişe taşıyın ve [Claude Code'un değişiklik günlüğünü](https://code.claude.com/docs/en/changelog) doğrudan takip edin; bu tür komut kapsamı değişiklikleri çoğu zaman yayın notlarının dışında fazla gürültü koparmadan geliyor.

Benim görüşüm: `/code-review`'u bug ve CLAUDE.md ihlallerine daraltmak doğru bir karar — her şeyi bildiren bir inceleme aracı, sizi gerçekten önemli olan tek bulguyu atlamaya alıştırır; Important/Pre-existing/Nit ayrımı ise gerçek bir triyaj sorununu çözen küçük ama etkili bir ekleme. Bu tür kademeli, gürültüyü azaltan değişiklikler, tek bir büyük özellik duyurusundan daha az dikkat çekiyor ama günlük kullanımda genellikle daha çok fark ediliyor.

## Ekibiniz Bu Değişikliğe Nasıl Uyum Sağlamalı?

Mevcut bir CI adımınız `/code-review` çıktısını ayrıştırıyorsa, artık her bulgunun bir önem alanı taşıdığını ve bazı modellerde kapsamın daraldığını yansıtacak şekilde güncelleyin. Pratik bir öneri: Important bulguları birleştirmeyi engelleyen bir kapı olarak kullanın, Pre-existing bulguları ayrı bir teknik borç listesine aktarın ve Nit'i yalnızca isteyen geliştiricinin okuduğu isteğe bağlı bir çıktı olarak bırakın. Bu, incelemeyi "her şeyi oku" modundan "önce önemli olanı düzelt" moduna taşıyor; büyük bir kod tabanında bu fark, bir geliştiricinin her gün gerçekten kaç bulguyla ilgilenmesi gerektiğini belirgin şekilde azaltıyor. Ekip büyüdükçe bu üçlü ayrımı bir PR şablonuna veya birleştirme kontrol listesine de yansıtmak faydalı olur: "Important bulgu yok" basit bir kontrol kutusuna dönüşebilir, Pre-existing bulgular ise haftalık bir teknik borç toplantısının gündemine otomatik olarak eklenebilir.

## Sıkça Sorulan Sorular

### Claude Code /code-review'un önem seviyelerini ne zaman değiştirdi?

Important/Pre-existing/Nit sınıflandırması ve sadece bug/CLAUDE.md ihlaline daralan kapsam, 19 Kasım 2026'da Claude Code'un 2.1.328 sürümünde geldi; hedefsiz çalıştırmanın varsayılan olarak tüm dalı incelemesi ise aynı gün 2.1.329 sürümünde eklendi.

### Bir /code-review bulgusunda "Pre-existing" ne anlama geliyor?

Bug'ın, mevcut değişikliğiniz koda dokunmadan önce zaten var olduğu anlamına geliyor — bulgu bilinmeye değer ama diff'inizin onu yaratmadığı veya kötüleştirmediği anlamına geliyor, "Important" bir bulgunun aksine.

### /code-review hâlâ stil sorunlarını ve sadeleştirme fırsatlarını işaretliyor mu?

19 Kasım 2026 güncellemesinden sonra çoğu modelde varsayılan olarak hayır — komut artık bug ve CLAUDE.md ihlallerine odaklanıyor, bu yüzden stil ve sadeleştirme geri bildirimi her kod incelemesine karıştırılmak yerine ayrı bir geçişten geliyor.

### Tek bir commit yerine tüm bir dalı nasıl incelersiniz?

`/code-review`'u hedefsiz çalıştırın; 2.1.329 sürümü itibarıyla, çoğu modelde sadece en son değişikliği değil, mevcut dalınızın tamamını varsayılan dala karşı inceliyor.
