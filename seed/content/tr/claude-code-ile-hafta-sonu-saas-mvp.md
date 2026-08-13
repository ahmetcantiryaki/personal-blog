---
title: "Hafta Sonunda Claude Code ile SaaS MVP"
slug: "claude-code-ile-hafta-sonu-saas-mvp"
translationKey: "saas-mvp-claude-code-weekend"
locale: "tr"
excerpt: "Claude Code ile bir hafta sonunda gerçek bir SaaS MVP çıkarmak mümkün. Kapsamı nasıl daraltacağınızı, ne inşa edeceğinizi ve sınırları anlatıyoruz."
category: "business"
tags: ["claude", "ai-coding", "ai-tools", "productivity"]
publishedAt: "2026-08-13"
seoTitle: "Claude Code ile Hafta Sonunda SaaS MVP Çıkarmak"
seoDescription: "Bir kurucunun hafta sonu günlüğü: Claude Code ile auth, veritabanı ve fatura kurulumu, dürüst sınırlar ve kopyalayabileceğiniz Cuma-Pazar takvimi."
---

Claude Code ile bir hafta sonunda gerçekten çalışan bir SaaS MVP çıkarmak mümkün mü? Evet, ajanı açmadan önce kapsamı tek bir iş akışına indirirseniz, ajanı bir kurucu ortak gibi değil hızlı çalışan bir yazılımcı gibi görürseniz ve pazar gününü yeni özellik yerine gözden geçirmeye ayırırsanız. İşte o hafta sonunun gerçekte nasıl geçtiği ve tek başınıza güvenle ilerleyebileceğiniz noktanın nerede bittiği.

## Ajana dokunmadan önce kapsamı tek iş akışına indirin

Bu işte başarısız olan kurucular hatayı son saatte değil ilk saatte yapar. Claude Code'u belirsiz bir fikirle açarlar: "bana bir proje yönetim aracı yap." Üç saat sonra elde ettikleri, hiçbiri gerçekten çalışmayan yarım kanban tahtası, yarım takvim ve yarım fatura sayfasıdır. Çözüm sıkıcı ama tartışmasızdır: terminali açmadan önce, kullanıcının baştan sona tamamladığı tek iş akışını kağıda yazın. Özellik listesi değil, tek cümle. "Bir serbest çalışan sözleşme yükler, AI'nin işaretlediği üç riskli maddeyi görür ve özet PDF'i indirir." Landing page dahil geri kalan her şey beklesin.

Bu, bir AI kodlama ajanıyla çalışırken eskisinden daha da önemli hale geliyor. Claude Code isterseniz aynı anda beş özelliği birden iskelet olarak kurabilir ve cumartesi öğleden sonra elinizde hiçbirinin tam çalışmadığı beş yarım özellik kalır. Hafta sonu MVP'si daha küçük bir ürün değil, tek ve bitmiş bir üründür.

## Auth, veritabanı ve faturalandırmayı Claude Code ile iskelet haline getirmek

Ajanın gerçekten işe yaradığı yer burasıdır. Claude Code, iyi belgelenmiş ve kalıp ağırlıklı SaaS iskeletinde çok başarılıdır: Auth.js veya Clerk bağlantısı kurmak, düz metinle anlatılan veri modelinden Prisma veya Drizzle şeması üretmek, Stripe Checkout ve webhook işleyicilerini ayağa kaldırmak, Next.js uygulamasını ortam değişkenleriyle birlikte Vercel'e deploy etmek. Şemayı ve ilk API rotasını birlikte kurmasını istediğinizde çoğunlukla ilk veya ikinci denemede doğru şekli bulur.

```bash
claude "Auth.js (e-posta + Google) içeren bir Next.js uygulaması,
Drizzle ile users, workspaces ve documents tablolarını içeren
bir Postgres şeması, workspace'in abonelik durumunu güncelleyen
webhook'lu bir Stripe Checkout akışı iskelet olarak kur.
Her dosyayı yazmadan önce ne yaptığını açıkla."
```

Son satıra dikkat edin. Claude Code'dan yazacağını sadece yazmasını değil, önce anlatmasını istemek, bu hafta sonu boyunca teknik olmayan bir kurucu için en yüksek getirili alışkanlıktır. Amacınız pazar gününe kadar kıdemli bir yazılımcı olmak değil, kendi ürününüzü, bir destek talebine ya da bir durum tespiti sorusuna kendi AI'nizi tekrar açmadan yanıt verebilecek kadar iyi anlamaktır.

## Güvenmeden önce inceleyin: rakamlar bunu zorunlu kılıyor

Ağustos 2026 itibarıyla AI'nin yazdığı kod artık bir merak değil, ciddi mühendislik ekiplerinde baskın örüntü. Büyük teknoloji şirketlerinde üretim koduna giren yeni kodun yaklaşık yüzde 25-30'u AI tarafından yazılıyor; Microsoft kendi depolarındaki oranı yüzde 20-30, Google ise yaklaşık yüzde 30 olarak belirtti ve bugüne kadarki en titiz büyük ölçekli ölçüm, üretim kodunda AI yazarlığını yüzde 26,9 olarak buluyor. Geliştiricilerin yaklaşık yüzde 92'si artık iş akışının bir yerinde bir AI aracı kullanıyor. Ama bunların hiçbiri kodun olduğu gibi kullanıldığı anlamına gelmiyor. GitHub Copilot'ta önerilen değişikliklerin yalnızca yaklaşık yüzde 30'u hiç düzenlenmeden kabul ediliyor; geri kalan yüzde 70 bir insan tarafından yeniden ele alınıyor ([kaynak](https://uvik.net/blog/ai-code-generation-statistics/), [kaynak](https://www.index.dev/blog/developer-productivity-statistics-with-ai-tools)).

Solo bir kurucu için asıl mesele bu yüzde 30'luk kabul oranı. Bu, hayatını kod yazarak kazanan mühendisler arasında bile sektör varsayılanının "önce oku, sonra karar ver" olduğunu, "kabul et ve devam et" olmadığını gösteriyor. Claude Code'un auth akışınız ve Stripe webhook'unuz için ürettiği her diff'i birleştirmeden önce satır satır okuyun. Ödeme akışını test kartlarıyla çalıştırın. Aynı e-postayla iki kez kayıt olmayı deneyin ve ne olduğuna bakın. Gizli sekmeden giriş yapıp bir URL tahmin ederek başka bir workspace'in verisini göremediğinizi doğrulayın. Bu paranoya değil, üretim kalitesindeki yüzde 26,9'luk AI kodunu, bir insanın okuyup yeniden yazdığı veya testle sardığı diğer yüzde 73'ten ayıran incelemenin ta kendisi.

## Dramasız deploy

Deploy, hafta sonunun en kolay parçasıdır çünkü en standart olanıdır: uygulama için Vercel veya Railway, yönetilen bir Postgres örneği (Neon veya Supabase), son adıma kadar test modunda Stripe. Deploy kontrol listesini Claude Code'a yazdırın, sonra bunu tek tek elle geçin. Ajanın production dalına gözetimsiz push yapmasına izin vermeyin ve gerçek bir insan kayıt-ödeme akışını en az iki kez baştan sona denemeden Stripe'ı canlı moda almayın.

## Claude Code neyi iyi yapıyor, neyi insan gözden geçirmeli

| MVP bileşeni | Claude Code'un iyi yaptığı | Dikkatli insan incelemesi gereken |
|---|---|---|
| Auth | Sağlayıcı bağlantısı, oturum yönetimi, temel RBAC iskeleti | Şifre sıfırlama uç durumları, session fixation, workspace'ler arası erişim kontrolleri |
| Veritabanı şeması | İlk model tasarımı, migration'lar, belirgin sorgular için index | Veri saklama politikası, PII sınıflandırması, yedekleme ve geri yükleme tatbikatı |
| Faturalandırma | Stripe Checkout, webhook iskeleti, abonelik durumu senkronu | Başarısız ödeme yönetimi, orantısal fatura hataları, iade ve itiraz akışları |
| Ana iş akışı | Arayüz iskeleti, API rotaları, mutlu yol mantığı | Uç durumlar, boş durumlar, gerçek kullanıcının göreceği hata mesajları |
| Deploy | Ortam değişkeni kurulumu, CI yapılandırması, tek tık deploy scripti | Sır rotasyonu, rate limiting, izleme ve alarm sistemi |

## Dürüst sınırlar ve gerçek bir geliştiriciyi ne zaman devreye sokmalısınız

Claude Code ile çıkarılan bir hafta sonu MVP'si gerçek. İnsanlar bu şekilde para kazanan ürünler çıkardı ve bu örüntü kaybolmuyor; başka solo kurucuların bunu nasıl yaptığını [AI ile mikro SaaS hikayeleri](/tr/posts/ai-ile-mikro-saas-hikayeleri) yazımızda görebilirsiniz. Ama "AI, geliştiriciye olan ihtiyacı ortadan kaldırıyor" cümlesinin abartılı yarısı bu. İlk denemede doğru görünen kod yazan bir ajanın ne sorumluluğu, ne sizin tehdit modelinizi anlayan bir yargısı, ne de geçen ay sizinkine benzer bir kütüphaneyi vuran güvenlik açığının hafızası vardır. Rate limiting eksikliğini biri istismar edene kadar size söylemez.

Hafta sonu bitmeden, gerçek bir mühendisi devreye sokacağınız tetikleyicileri yazılı olarak belirleyin: ilk ücretli kurumsal müşteriden önce, gerçek ödeme verisini Stripe'a devretmek yerine uçtan uca kendiniz saklamaya başlamadan önce, ciddi ölçekte PII tutmadan önce ve güvenlik incelemesi atlanabilir değil rutin bir şey haline gelmeden önce. Bunların hiçbiri bu hafta sonu olmak zorunda değil, ama itibarınızı yalnızca bir AI'nin dikkatle okuduğu koda emanet etmeden önce hepsi gerçekleşmiş olmalı.

## Hafta sonu takvimi

**Cuma gecesi (2-3 saat):** Tek cümlelik iş akışını yazın. Veri modelini kağıda çizin. Repo'yu, ortam değişkenlerini ve Claude Code oturumunu kurun. Henüz özellik kodu yazmayın.

**Cumartesi (tam gün):** Sabah — Claude Code ile auth, veritabanı şeması ve ana iş akışının mutlu yolunu iskelet haline getirin, her diff'i inceleyin. Öğleden sonra — Stripe'ı test modunda bağlayın, kullanıcının gerçekten ihtiyaç duyduğu iki üç ekranı kurun ve manuel testi sona bırakmayıp yol boyunca yapın.

**Pazar (yarım gün, sonra durun):** Sabah — güvenlik ve inceleme turu: yukarıdaki tabloyu kontrol edin, auth uç durumlarını deneyin, sırların repo'da olmadığını doğrulayın. Öğleden sonra — deploy edin, Stripe'ı yalnızca temiz bir test çalıştırmasından sonra canlıya alın ve ürünü kimseye duyurmadan önce bu yazıdaki "geliştirici devreye girsin" tetikleyicilerini yazın.

## Asla atlanmayacak güvenlik kontrol listesi

- Sırlar ortam değişkenlerinde veya bir secrets manager'da tutulur, asla repo'da veya ajanla sohbet geçmişinde değil
- Auth akışları, şifre sıfırlama ve oturum süresi dahil satır satır incelenir
- Veritabanı yedekleri kurulur ve geri yükleme en az bir kez gerçekten denenir
- Sadece giriş formunda değil, her açık API rotasında rate limiting bulunur
- Stripe webhook'ları imzalama sırrıyla doğrulanır, herhangi bir istekten geldiği gibi kabul edilmez
- Kod tabanında anlamadığınız kısımların yazılı bir listesi tutulur, böylece önce neyi devredeceğinizi bilirsiniz

Bu hafta sonunun arkasındaki daha derin mekanikler için [Claude Code subagent ve arka plan ajanları](/tr/posts/claude-code-subagent-arka-plan-ajanlari), [AI kod asistanı hataları](/tr/posts/ai-kod-asistani-hatalari), [spec-driven development rehberi](/tr/posts/spec-driven-development-rehberi) ve [unit test nasıl yazılır](/tr/posts/unit-test-nasil-yazilir) yazılarımız yukarıdaki inceleme turuna doğrudan uygulanabilir. Daha fazla kurucu odaklı hikaye için [girişimcilik ve iş kategorimize](/tr/category/girisimcilik-is) göz atabilirsiniz.

## Sıkça Sorulan Sorular

### Teknik olmayan bir kurucu Claude Code ile gerçekten bir SaaS MVP çıkarabilir mi?

Evet, sıkı şekilde daraltılmış tek bir iş akışı için. Buradaki risk ajanın kod yazıp yazamayacağı değil, teknik olmayan kurucunun auth, faturalandırma uç durumları ve veri erişimindeki hataları yakalayacak kadar iyi inceleme yapıp yapamayacağıdır. İnşayı yukarıdaki güvenlik kontrol listesiyle birlikte yürütün, doğrudan yayına atlamayın.

### Kodun ne kadarı gerçekten AI tarafından yazılmış olacak?

Ham kod hacminin büyük çoğunluğunun Claude Code'dan gelmesini bekleyin; bu, günümüz üst düzey mühendislik ekiplerinde yaygın olan yüzde 26,9 ile yüzde 30 arasındaki AI yazarlığı rakamlarıyla örtüşüyor. Ama sektör genelinde görülen yaklaşık yüzde 30'luk olduğu gibi kabul oranına paralel olarak, bunun önemli bir kısmını yeniden yazmayı veya reddetmeyi bekleyin.

### Bu hafta sonu kurucuların yaptığı en büyük hata nedir?

Başlamadan önce kapsamı daraltmamak. İkinci büyük hata, demo zaten çalışıyormuş gibi göründüğü için pazar günkü inceleme turunu atlamaktır. Çalışıyormuş gibi görünmek ile gerçek kullanıcıların verisini içine koyacak kadar güvenli olmak farklı iki eşiktir.

### Tek başıma inşa etmeyi bırakıp ne zaman geliştirici işe almalıyım?

İlk ücretli kurumsal müşteriden önce, Stripe'ın soyutladığından daha fazla gerçek ödeme verisini kendiniz işlemeye başlamadan önce, ciddi ölçekte PII tutmadan önce ve düzgün bir güvenlik incelemesi isteğe bağlı değil rutin hissettirmeye başlamadan önce.
