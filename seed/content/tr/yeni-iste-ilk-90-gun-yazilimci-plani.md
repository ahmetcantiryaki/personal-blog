---
title: "Yeni İşte İlk 90 Gün: Yazılımcı Planı"
slug: "yeni-iste-ilk-90-gun-yazilimci-plani"
translationKey: "first-90-days-new-dev-job"
locale: "tr"
excerpt: "Beşinci güne kadar birleştirilmiş bir pull request gönderin, 30. günde %70-80 adapte olun; 30/60/90 hedefleriyle ilk çeyreği ölçülebilir hale getirin."
category: "career-productivity"
tags: ["career", "developer-growth", "best-practices", "job-search"]
publishedAt: "2026-09-09"
seoTitle: "Yeni İşte İlk 90 Gün: Yazılımcı için Plan"
seoDescription: "Beşinci güne kadar birleştirilmiş bir pull request gönderin, 30. günde %70-80 adapte olun; 30/60/90 hedefleriyle ilk çeyreği ölçülebilir hale getirin."
---

Kısa cevap: Beşinci güne kadar birleştirilmiş bir pull request, 30. güne kadar rutin işlerde bağımsızlık, 90. güne kadar tam verimlilik hedefleyin — veriler yapılandırılmış bir işe alışmanın geliştiricileri buraya yapılandırılmamış bir sürece göre yaklaşık iki kat daha hızlı ulaştırdığını gösteriyor. Yeni işe alınanların yaklaşık %28'i ilk 90 günde işten ayrılıyor; en büyük üç neden rol netliği, ilişki eksikliği ve araç sürtünmesi — üçü de şansa değil bir plana bağlı olarak çözülebilir.

## İlk haftada neler kurulmalı, kod tabanı nasıl okunmalı?

Mimariyi anlamaya çalışmadan önce ortamınızı tamamen çalışır hale getirin — çalıştıramadığınız şeyi hata ayıklayamazsınız. Depoyu klonlayın, yerel build'i geçirin, test paketini bir kez başarıyla çalıştırın ve ilk haftanın sonuna kadar staging ya da sandbox ortamına erişim alın.

```bash
# Yeni bir kod tabanı için makul bir birinci gün kontrol listesi
git clone <repo>
cat README.md CONTRIBUTING.md   # kurulum adımları genelde önce burada
npm install && npm test          # ya da deponun eşdeğeri — kodu okumadan önce yeşil olduğunu doğrulayın
git log --oneline -20            # son commit'ler neyin aktif değiştiğini gösterir
```

Ortamınız çalıştıktan sonra kod tabanını baştan sona dosya dosya okumak yerine gerçek bir kullanıcı isteğini sistemin içinden takip ederek okuyun — bir API endpoint'i ya da bir arayüz eylemi seçin ve giriş noktasından veritabanına, oradan geri dönüşe kadar izleyin. Bu, bütün depoya yüzeysel bir bakıştan ilk haftada daha işe yarayan, tek bir dikey dilime dair çalışan bir zihinsel model verir.

## İlk pull request ne zaman gönderilmeli?

Hedeflenmesi gereken ölçüt beşinci gün ve bunun mimari açıdan önemli olması gerekmiyor — bir dokümantasyon düzeltmesi, küçük bir test ya da tek satırlık bir hata düzeltmesi hepsi sayılır. Mesele değişikliğin büyüklüğü değil; ilk hafta bitmeden takımın gerçek review ve deploy sürecinden "fikir" aşamasından "gönderildi ve birleştirildi" aşamasına geçebildiğinizi kanıtlamak.

Yapılandırılmamış norm ile yapılandırılmış bir süreç arasındaki fark burada büyük: sektör ortalaması ilk anlamlı commit'e kadar 2-3 hafta sürerken, bilinçli bir işe alışma süreci olan takımlar yeni çalışanları birinci günde dört saat gibi kısa bir sürede ilk commit'e ulaştırıyor. Takımınız ikinci güne kadar size bir başlangıç görevi vermediyse, kendiliğinden ortaya çıkmasını beklemeyin — yöneticinizden doğrudan küçük, iyi tanımlanmış bir ticket isteyin. "Good first issue" etiketli açık kaynak katkılarından farklı olarak, bir şirket içi ilk görevin asıl amacı review ve deploy sürecini uçtan uca görmeniz; görevin kendisi ikincil.

## Organizasyon ve paydaşlar nasıl haritalanır?

İşinize doğrudan dokunan beş kişiyi belirleyin — reviewer'ınız, değiştirdiğiniz sistemin sahibi, deploy'lardan sorumlu kişi, yöneticiniz ve sizinle aynı seviyede bir meslektaş — ve birinci veya ikinci haftada her biriyle kısa bir birebir yapın. Amaç kendi başına network kurmak değil; takılıp kaldığınızda kime soracağınızı bilmek, çünkü bir sistemin sahibini bilmemek erken ayrılmayı tetikleyen "araç sürtünmesinin" yaygın bir nedeni.

İlerledikçe tanımadığınız kısaltmaların, iç araç isimlerinin ve takım isimlerinin sürekli bir listesini tutun — işe alışma sürtünmesinin çoğu beceri değil kelime dağarcığı meselesi ve kendi kurduğunuz iki haftalık bir sözlük, bunun kendiliğinden belirginleşmesini beklemekten daha hızlı kapatır bu boşluğu.

## 30/60/90 günlük hedefler nasıl belirlenir?

| Kilometre taşı | Hedef | "Yolunda gidiyor" nasıl görünür |
|---|---|---|
| 30. gün | ~%70-80 adapte | Hafif review ile rutin ticket'ları hallediyor; kod tabanında gezinmek normal hissettiriyor |
| 60. gün | %90+ adapte | Az yönlendirmeyle orta karmaşıklıkta işleri üstleniyor |
| 90. gün | Tam verimli | Bir özellik ya da sistem alanının sahipliğini bağımsız yapıyor; başkalarını işe alıştırmaya başlamış |

Bunları çıkarım yapmak yerine ilk haftada yöneticinizle birlikte yazıya dökün — belgelenmiş bir 30/60/90 planı, ikinize de ortak bir "yolunda gidiyor" tanımı verir; bu önemli çünkü belirsiz beklentiler erken ayrılmanın üç büyük nedeninden biri. Yapılandırılmış işe alışma genel olarak yapılandırılmamış bir sürece kıyasla yaklaşık %50 daha yüksek yeni çalışan verimliliği ve %69 daha yüksek üç yıllık elde tutma ile ilişkilendiriliyor — bunu şansa bırakmak yerine bilinçli yapmanın somut karşılığı bu.

## Takım arkadaşlarına aşırı bağımlı olmadan nasıl soru sorulur?

Varsayılan olarak 20 dakika kuralını kullanın: bir takım arkadaşına sormadan önce kendi sorunuza kendiniz cevap bulmaya çalışarak (dokümana bakma, kod tabanında arama, son PR'ları okuma) en fazla 20 dakika harcayın, sonra o sınıra ulaştığınızda yine de sorun. Çok geç sormak çok erken sormaktan daha fazla zaman kaybettirir; bu kural sizi sessizce yarım gün takılı kalmaktan alıkoymak için var, soru sormanın önüne geçmek için değil.

Sorduğunuzda, denediklerinizi de getirin. "README'ye baktım ve bu hatayı aradım, bulduğum şu — tanıdık geliyor mu?" açık uçlu bir sorudan daha hızlı ve daha iyi bir cevap alır ve her şey için aynı bir iki kişiye varsayılan olarak bağımlı olmak yerine bağımsızlık inşa ettiğinizi gösterir.

## AI, bilinmeyen bir kod tabanında güvenle nasıl kullanılır?

Bir AI kod asistanını görevinizin dokunduğu belirli dosyalara yönlendirin ve sizin yerinize değişikliği yazmasını değil, akışı açıklamasını isteyin — ilk haftada hızlı gönderim yapmaktan daha önemli olan, var olan örüntüyü anlamak. Onun açıklamasını kesin doğru olarak değil, gerçek kod ve bir takım arkadaşına karşı doğrulanması gereken bir hipotez olarak ele alın; özellikle bir AI'ın depoyu okuyarak gözlemleyemeyeceği iş mantığı söz konusu olduğunda.

Kaçınılması gereken hata modu, henüz anlamadığınız bir sistem için makul görünen bir pull request üretmek amacıyla AI kullanmak — bu şans eseri review'dan geçebilir ve yine de yanlış düzeltme olabilir, bu da hiçbir şey göndermemiş olmaktan daha hızlı güvenilirliğinize mal olur. AI kod asistanlarının nerede yanlış gittiğine dair daha fazlası için [yaygın AI kod asistanı hatalarına dair rehberimize](/tr/posts/ai-kod-asistani-hatalari) bakın.

Hızlı adapte olmanın tempo tarafı için, ilk 90 günlük sprint bittikten sonra [tükenmişlikten kaçınma tavsiyemiz](/tr/posts/yazilimci-tukenmisligi) tempo sorusunu ele alıyor; yönetici ilişkinizi özellikle yönetmek istiyorsanız [yazılımcılar için yöneticiyle iyi ilişki rehberimiz](/tr/posts/yazilimcilar-icin-yoneticiyle-iliski) daha derine iniyor. Daha fazla kariyer tavsiyesi için [Kariyer & Üretkenlik kategorimize](/tr/category/kariyer-uretkenlik) bakabilirsiniz.

Kaynaklar: [Sourcegraph'ın 2026 geliştirici işe alışma rehberinden](https://sourcegraph.com/blog/developer-onboarding) derlenen işe alışma ölçüt verileri ve [HR Dive'ın raporladığı ilk 90 günde %28 kayıp bulgusu](https://www.hrdive.com/news/why-do-28-of-employees-quit-in-their-first-90-days-poor-onboarding-practi/441139/).

## Sıkça Sorulan Sorular

### Yeni bir yazılımcı ilk pull request'ini ne kadar hızlı göndermeli?

Ne kadar küçük olursa olsun herhangi bir birleştirilmiş değişiklik için makul hedef beşinci gün — bir yazım hatası düzeltmesi, küçük bir test ya da tek satırlık bir hata düzeltmesi hepsi sayılır. Amaç ilk haftada mimari açıdan önemli bir şey göndermek değil, takımın gerçek review ve deploy sürecini tamamlayabildiğinizi kanıtlamak.

### Yeni yazılımcıların yüzde kaçı ilk 90 günde işten ayrılıyor?

Rollerin tamamında yeni işe alınanların yaklaşık %28'i ilk 90 günde ayrılıyor; en büyük üç neden belirsiz rol beklentileri, takımla kurulmamış ilişkiler ve araç ya da kurulum sürtünmesi — üçü de belgelenmiş bir işe alışma planıyla ele alınabilir.

### Yeni bir yazılımcının tam verimliliğe ulaşması ne kadar sürer?

Sektör ortalaması 3-6 ay, ama yapılandırılmış bir işe alışma süreci olan şirketler bunu benzer bir verimlilik seviyesine ulaşmak için 3-4 haftaya indiriyor. Belgelenmiş bir 30/60/90 günlük plan bu farkı kapatmak için tek en büyük kaldıraç.

### İşe alışma sırasında AI kod asistanları kullanmak güvenli mi?

Evet, mevcut kodu açıklamak ve bilinmeyen sistemleri anlamanızı hızlandırmak için — ama açıklamalarına güvenmeden önce gerçek kod ve bir takım arkadaşına karşı doğrulayın ve henüz kendinizin anlamadığı bir mantık için pull request üretmek amacıyla kullanmaktan kaçının.
