---
title: "1 Milyon Token Bağlam: Gerçekte Ne Değişiyor?"
slug: "1-milyon-token-baglam-ne-degisiyor"
translationKey: "long-context-1m-tokens-explained"
locale: "tr"
excerpt: "1 milyon token bağlam penceresi kaç sayfa eder, ne işe yarar, nerede hâlâ başarısız olur? Claude Opus 5'in 1M bağlamı üzerinden gerçekçi bir rehber."
category: "ai"
tags: ["claude", "llm", "ai-tools", "rag"]
publishedAt: "2026-07-27"
seoTitle: "1 Milyon Token Bağlam Penceresi Ne Anlama Geliyor?"
seoDescription: "1 milyon token bağlam penceresi kaç sayfa eder, ne işe yarar, nerede hâlâ başarısız olur? Claude Opus 5'in 1M bağlamı üzerinden gerçekçi bir rehber."
---

Bir milyon token, kabaca 750.000 kelime ya da ortalama uzunlukta 6-8 romana denk geliyor. 24 Temmuz 2026'da piyasaya çıkan [Claude Opus 5](/tr/posts/claude-opus-5-geldi), bunu hem varsayılan hem de azami bağlam penceresi olarak sunan ilk Opus modeli oldu. Ama "1 milyon token" rakamı, sohbetin sonsuza kadar hatırlanacağı anlamına gelmiyor — ve bu, insanların en çok yanlış anladığı nokta.

## Bağlam Penceresi Aslında Nedir

Bağlam penceresi, bir modelin tek bir istek içinde "görebileceği" toplam metin miktarı. Bu, gönderdiğiniz talimatları, yüklediğiniz dosyaları, önceki sohbet geçmişini ve modelin ürettiği yanıtı kapsıyor — hepsi aynı bütçeden düşülüyor. Pencere doldu mu, ya en eski kısımlar düşer ya da model o eski bilgiyi artık "görmez." Kalıcı bir hafıza değil, her istekle birlikte sıfırdan doldurulan bir çalışma masası.

Token, kelimeyle bire bir eşleşmiyor. İngilizcede kabaca 1 token ≈ 0,75 kelime; Türkçe gibi eklemeli dillerde ekler ayrı token'lara bölündüğü için oran biraz daha yüksek çıkabiliyor. Pratikte 1 milyon token'ı şöyle düşünebilirsiniz:

| Ne | Yaklaşık token | 1M token'a sığar mı |
| --- | --- | --- |
| Ortalama uzunlukta bir roman | ~120.000 | Evet, 8 tanesi birden |
| 300 sayfalık bir PDF rapor | ~150.000 | Evet |
| Orta ölçekli bir kod deposu (50-80 dosya) | ~400.000-600.000 | Genelde evet |
| 3 saatlik bir toplantı transkripti | ~40.000-60.000 | Kolayca, birçok tanesi |
| Bir yıllık e-posta geçmişi | 2-5 milyon+ | Hayır, tek istekte sığmaz |

## Gerçek Kazanımlar

Bir raporun tamamını, ek dosyaları ve geçmiş yorumları tek seferde yükleyip "bu üç belgedeki tutarsızlıkları bul" diyebilmek, önceden parça parça özetleyip birleştirmeniz gereken bir işi tek adıma indiriyor. Bu, özellikle hukuki inceleme, kod tabanı denetimi ya da uzun araştırma sentezlerinde gerçek bir zaman kazancı.

Uzun bir projeyi "canlı" tutmak da bir diğer somut kazanım: bir günlük pair-programming oturumunun tüm geçmişini, kararları ve gerekçeleriyle birlikte bağlamda tutabilmek, modelin üç saat önce neden belirli bir yaklaşımı reddettiğinizi hatırlamasını sağlıyor — küçük pencereli modellerde bu bilgi çoktan düşmüş olurdu.

## Efsaneler: "Sonsuza Kadar Hatırlar" Yanılgısı

En yaygın yanlış anlama, bağlam penceresinin kalıcı bir hafıza olduğu sanısı. Değil. Her yeni istekte (ya da her yeni sohbet başlattığınızda) pencere sıfırlanıyor; bir önceki oturumdaki hiçbir şey otomatik olarak taşınmıyor. [AI sohbetlerinizi Projects ve Gems ile düzenleme rehberimizde](/tr/posts/ai-sohbetlerini-duzenle-projects-gems) anlattığımız gibi, kalıcılık isteniyorsa bunu ayrı bir mekanizma (proje dosyaları, harici bir bellek katmanı) sağlamak gerekiyor — büyük bağlam penceresi bunun yerine geçmiyor.

İkinci yanılgı: "1 milyon token = 1 milyon token'lık kaliteli akıl yürütme." Değil. Modelin bir bilgiyi bulup kullanabilme başarısı, pencerenin neresinde durduğuna bağlı olarak değişiyor.

## Ortada Kaybolma Sorunu

Uzun bağlam değerlendirmelerinde tekrar eden bir bulgu var: modeller, bağlamın en başındaki ve en sonundaki bilgiyi, tam ortasındaki bilgiye göre daha güvenilir şekilde geri çağırıyor. Buna literatürde "lost in the middle" (ortada kaybolma) deniyor. Pratik sonucu şu: 800.000 token'lık bir dosyanın 400.000'inci token'ında gömülü tek bir kritik cümleyi sormak, aynı cümle dosyanın başında ya da sonunda olsaydı olduğundan daha yüksek hata riski taşıyor.

Bunun anlamı, "büyük pencereyi doldur, gerisini modele bırak" yaklaşımının her zaman en iyi strateji olmadığı. Kritik bilgiyi bağlamın başına ya da sonuna taşımak, ya da promptu net bölümlere ayırmak, aynı pencere boyutuyla bile geri çağırma doğruluğunu belirgin şekilde iyileştirebiliyor.

## Maliyet ve Gecikme Ödünleşimi

Daha büyük bağlam, daha fazla token işlemek demek — bu da hem maliyeti hem yanıt süresini büyütüyor. 900.000 token'lık bir isteğin işlenmesi, 9.000 token'lık bir istekten gözle görülür şekilde daha yavaş ve daha pahalı; çoğu sağlayıcı da fiyatlandırmayı buna göre kademeli olarak artırıyor. [LLM token maliyetini düşürme rehberimizde](/tr/posts/llm-token-maliyetini-dusurme) ele aldığımız teknikler — gereksiz bağlamı budama, önbellekleme, yalnızca ilgili parçaları gönderme — büyük pencere çağında daha da kritik hale geliyor, çünkü "sığıyor" ile "sığdırmalı mıyım" farklı sorular.

```text
Basit karar kuralı:
- Belge tek seferlik ve <200K token → doğrudan bağlama yükle
- Belge tekrar tekrar sorgulanacak ve büyük → RAG'e yatırım yap
- Kritik bilgi belgenin ortasında gömülüyse → önce o bölümü çıkar, öne al
```

## RAG Hâlâ Ne Zaman Kazanıyor

Büyük bağlam penceresi, [RAG sistemi kurma rehberimizde](/tr/posts/rag-sistemi-nasil-kurulur) anlattığımız yaklaşımı gereksiz kılmıyor; tamamlıyor. Milyonlarca belgeden oluşan, sürekli güncellenen bir bilgi tabanınız varsa, her sorguda her şeyi bağlama yüklemek ne ekonomik ne pratik. RAG, önce ilgili parçaları seçip sonra o parçaları bağlama koyarak hem maliyeti hem doğruluğu iyileştiriyor; büyük bağlam penceresi ise RAG'in getirdiği parçaların daha geniş ve daha az agresif kırpılmış olmasına izin veriyor. İkisi rakip değil, birbirini besleyen iki katman.

Bana kalırsa asıl pratik soru "kaç token sığar" değil, "modelin bu token'ların hangisine ne kadar güvenip kullanacağı" — ve bu ikinci soru, pencere büyüdükçe daha da önem kazanıyor.

## Kendi Kullanım Durumunuz Gerçekten 1M Token Gerektiriyor mu

Büyük bağlam penceresine erişiminiz olması, onu her işte kullanmanız gerektiği anlamına gelmiyor. İşe başlamadan önce sorulacak üç soru var: Belge tek seferlik mi, yoksa günde onlarca kez sorgulanacak mı? Kritik bilgi belgenin belirli bir yerinde mi yoğunlaşıyor, yoksa dağınık mı? Yanıtın gecikmesi (birkaç saniye fark) sizin iş akışınızda önemli mi?

Tek seferlik, kritik bilgisi dağınık ve gecikmeye toleranslı bir iş için büyük pencereyi doğrudan kullanmak mantıklı. Tekrarlı, kritik bilgisi yoğunlaşmış ve gecikmeye hassas bir iş için ise önce belgeyi bölümlere ayırıp ilgili bölümü bulup öne çıkarmak, aynı büyük pencereyi ham haliyle doldurmaktan daha güvenilir sonuç veriyor.

Basit bir test de işe yarıyor: belgenin ortasına, sonucu değiştirecek tek bir kritik cümle yerleştirip modele bunu bulmasını isteyin. Model bunu güvenilir şekilde buluyorsa, o belge türü için büyük pencereyi ham haliyle kullanmak muhtemelen güvenli. Bulamıyorsa, bölümlere ayırma ya da RAG'e geçmenin zamanı gelmiş demektir.

## Sağlayıcılar Arası Fark

Bağlam penceresi büyüklüğü tek başına karşılaştırma kriteri değil; her sağlayıcının aynı milyon token'ı nasıl fiyatlandırdığı ve ne kadar hızlı işlediği de değişiyor. Bazı sağlayıcılar bağlam büyüdükçe token başına fiyatı kademeli artırıyor, bazıları önbellekleme (caching) ile tekrarlanan büyük bağlamların maliyetini düşürüyor. Aynı 1 milyon token'lık istek, önbellekli ve önbelleksiz çalıştırıldığında maliyet açısından kat kat farklı sonuç verebiliyor — bu yüzden "büyük pencere var" ile "büyük pencereyi ekonomik kullanabiliyorum" farklı iki iddia.

## Sıkça Sorulan Sorular

### 1 milyon token gerçekten kaç sayfaya denk geliyor?

Kabaca 750.000 İngilizce kelimeye, yani ortalama 300 sayfalık bir kitabın yaklaşık 2.500 sayfası kadarına denk geliyor. Türkçe metinlerde ekler ayrı token'lara bölündüğü için gerçek sayfa karşılığı biraz daha düşük olabilir.

### Bağlam penceresi büyüdükçe model daha mı akıllı oluyor?

Hayır, kapasitesi artıyor ama akıl yürütme kalitesi otomatik olarak yükselmiyor. Özellikle bağlamın ortasına gömülü bilgiyi geri çağırmada, modeller pencerenin başı ve sonuna göre daha fazla hata yapabiliyor — buna "ortada kaybolma" deniyor.

### Büyük bağlam penceresi RAG'in yerini alır mı?

Genellikle hayır. RAG, milyonlarca belgelik büyüyen bir bilgi tabanından ilgili parçaları seçmek için hâlâ gerekli; büyük bağlam penceresi bu seçilen parçaların daha cömert şekilde bağlama alınmasına izin veriyor, ama seçim adımının kendisini ortadan kaldırmıyor.

### 1M token bağlam kullanmak neden her zaman doğru seçim değil?

Çünkü maliyet ve gecikme, işlenen token sayısıyla birlikte artıyor ve ortadaki bilgiyi bulma doğruluğu düşebiliyor. Belge küçük ve tek seferlikse doğrudan yüklemek mantıklı; belge büyük ve tekrar sorgulanacaksa RAG genelde hem daha ucuz hem daha doğru sonuç veriyor.
