---
title: "OpenAI Atlas'ı Kapatıyor: Yapay Zeka Tarayıcısı Neden Bitti"
slug: "openai-atlas-kapaniyor-ai-tarayici"
translationKey: "openai-atlas-shutdown-ai-browsers"
locale: "tr"
excerpt: "OpenAI, bağımsız Atlas tarayıcısını 9 Ağustos 2026'da kapattı; yeteneği ChatGPT ve Codex'e taşıdı. Bağımsız AI tarayıcıların neden zorlandığını anlatıyoruz."
category: "technology"
tags: [openai, chatgpt, ai-agents, ai-tools]
publishedAt: "2026-08-11"
seoTitle: "OpenAI Atlas'ı Kapattı: AI Tarayıcı Deneyi Neden Bitti"
seoDescription: "OpenAI, Atlas tarayıcısını 9 Ağustos 2026'da kapattı ve yeteneği ChatGPT ile Codex'e taşıdı. Bağımsız AI tarayıcıların neden zorlandığını inceliyoruz."
---

OpenAI, bağımsız ChatGPT Atlas tarayıcısını 9 Ağustos 2026'da — bu yazının yayınlanmasından yalnızca iki gün önce — kullanımdan kaldırdı. Tarayıcı özelliğini ayrı bir uygulama olarak sürdürmek yerine, aynı "web'de ajan gibi çalışma" yeteneğini doğrudan ChatGPT'ye ve Codex'e taşıdı. Bu, [ajan tabanlı tarayıcı kategorisinde](/tr/posts/yapay-zeka-tarayicilari-karsilastirma) şimdiye kadarki en net başarısızlık vakası.

## Kısa Bir Ömrün Kronolojisi

Atlas, Ekim 2025'te büyük bir iddiayla piyasaya sürüldü: ChatGPT'yi merkeze alan, ajanın sekmelere, oturumlara ve çerezlere doğrudan erişebildiği tam teşekküllü bir tarayıcı. Vaat edilen yol haritası da iddialıydı — Windows, iOS ve Android sürümleri gelecekti. Hiçbiri hiç gelmedi. Atlas, doğduğu günden [help.openai.com üzerindeki resmi sürüm notlarında](https://help.openai.com/en/articles/6825453-chatgpt-release-notes) doğrulanan kapanış tarihine kadar geçen yaklaşık on aylık ömrü boyunca yalnızca macOS'ta kaldı.

Bu, hızlı hareket eden bir yapay zeka şirketi için bile kısa bir süre. OpenAI'ın kendi sürüm notları, kapanış gerekçesini teknik bir arıza ya da güvenlik sorunu olarak değil, ürün stratejisi olarak çerçeveliyor: aynı yeteneği zaten milyonlarca kullanıcının her gün açtığı bir uygulamaya — ChatGPT'ye — taşımak. Bunun ötesindeki "neden"e dair OpenAI'dan ek bir açıklama yok; aşağıdaki analiz bizim yorumumuz, doğrulanmış bir OpenAI açıklaması değil.

## Bağımsız AI Tarayıcılar Neden Bu Kadar Zor Bir Kategori?

Atlas'ın kapanışı izole bir olay değil, bir kalıbın en son örneği. Bağımsız bir AI tarayıcı satmak, dört ayrı sürtünme noktasıyla aynı anda savaşmak demek:

**Kurulum sürtünmesi.** Yeni bir tarayıcı indirmek, hesap açmak, izin vermek ve varsayılan tarayıcı olarak ayarlamak — bunların hepsi tek bir özellik için katlanmak zorunda kalınan adımlar. Bir tarayıcı eklentisi ya da mevcut bir uygulamaya eklenen özellik bu adımların neredeyse hiçbirini gerektirmiyor.

**Alışkanlık değiştirme maliyeti.** Tarayıcı, bilgisayar kullanımının en yapışkan alışkanlıklarından biri. Yer imleri, kayıtlı şifreler, uzantılar, sekme düzenleri, otomatik doldurma geçmişi — bunların hepsini yeni bir eve taşımak, kullanıcıdan gerçek bir emek istiyor. Bu emeği vermeye değecek kadar güçlü bir sebep sunmak, tek bir "ajan modu" özelliği için zor.

**Tek özellik için günlük tarayıcı değiştirmek istememe.** Kullanıcılar Chrome'u ya da Safari'yi yalnızca hız ya da tasarım için seçmiyor; yıllar içinde biriktirdikleri bir ekosistem için seçiyorlar. Bir özelliğin ne kadar iyi olduğu önemli değil — bu ekosistemi terk etmeye değecek kadar iyi olması gerekiyor, ki bu çok yüksek bir bar.

**Dağıtım dezavantajı.** Belki de en belirleyicisi bu: Chrome ve Safari, işletim sistemi ya da varsayılan uygulama seçimleri yoluyla milyarlarca cihaza zaten önceden yüklü geliyor. Sıfırdan bir tarayıcı, bu dağıtım avantajı olmadan, kullanıcıyı aktif olarak ikna etmek zorunda. Bir eklenti ya da mevcut bir uygulamaya eklenen özellik ise bu savaşı hiç vermiyor — zaten kurulu olan bir şeyin içine biniyor.

[Bu, yalnızca tarayıcılara özgü bir sorun değil](/tr/posts/ai-cihazlari-neden-tutmuyor): bağımsız donanım ürünü olarak satılan AI cihazlarının da benzer bir kalıpla karşılaştığını, insanların günlük taşıdıkları cihazı değiştirmeye pek de istekli olmadığını görüyoruz.

## Stratejik Hamle: Ayrı Uygulama Yerine ChatGPT ve Codex'e Gömme

OpenAI'ın seçimi öğretici. Ajan tabanlı tarama yeteneğini ayrı bir ürün olarak sürdürmek yerine, zaten var olan iki yüzeye taşıdı:

- **ChatGPT içinde sohbet içi ajan yeteneği olarak.** Kullanıcı yeni bir uygulama açmıyor; zaten günlük kullandığı ChatGPT sohbet arayüzünden bir web görevi tarif ediyor ve ajan bunu arka planda yürütüyor. Bu, [ChatGPT Work'ün](/tr/posts/chatgpt-work-nedir-openai-is-ajani) plan-sonra-onay döngüsüyle aynı felsefeyi paylaşıyor: yeni bir alışkanlık öğretmek yerine, mevcut bir alışkanlığın üzerine yetenek ekliyor.
- **Codex içinde.** Geliştirici tarafında, web'de gezinme ve etkileşim gerektiren görevler artık kod yazma ortamının bir parçası; ayrı bir tarayıcı penceresine geçmeye gerek kalmıyor.

Bu, dağıtım problemini tersine çeviriyor. OpenAI artık kullanıcıyı yeni bir uygulamaya taşımaya çalışmıyor; zaten kullanıcının olduğu yere yeteneği taşıyor. ChatGPT'nin haftalık yüzlerce milyon kullanıcısı, sıfırdan inşa edilmiş bir tarayıcının asla ulaşamayacağı bir dağıtım tabanı sunuyor.

## Mevcut Atlas Kullanıcıları Şimdi Ne Yapmalı?

Atlas kullanıyorsanız, pratik adımlar basit:

1. **Yer imlerinizi dışa aktarın.** OpenAI, kapanış tarihinden önce yer imlerinin HTML formatında dışa aktarılmasını önerdi; bu dosyayı herhangi bir standart tarayıcıya (Chrome, Safari, Edge) içe aktarabilirsiniz.
2. **ChatGPT konuşma geçmişiniz için endişelenmeyin.** Bu veri tarayıcıda değil, hesabınızda saklanıyor; Atlas kapansa da kayboldu.
3. **Ajan yeteneğini nerede arayacağınızı bilin.** Aynı "tarayıcınla sohbet et" işlevi artık ChatGPT masaüstü uygulamasının içinde; ayrı bir kurulum gerekmiyor, mevcut ChatGPT hesabınızla erişilebilir.
4. **Günlük tarayıcınıza geri dönün.** Chrome, Safari ya da Edge'i varsayılan tarayıcınız olarak kullanmaya devam edebilir, ihtiyaç duyduğunuzda ChatGPT'nin ajan modunu ayrı bir görev olarak tetikleyebilirsiniz.

## Kategori İçin Ne Anlama Geliyor: Comet ve Gemini Karşılaştırması

Atlas'ın kapanışı, "AI tarayıcı" kategorisinin tamamının öldüğü anlamına gelmiyor — ama iki farklı stratejinin ne kadar ayrıştığını netleştiriyor. Perplexity'nin Comet'i, bu yazının yayınlandığı Ağustos 2026 itibarıyla hâlâ bağımsız bir tarayıcı olarak yaşıyor ve büyüyor; [Comet'i macOS, Windows ve iOS'a taşıyan](https://www.perplexity.ai/comet) Perplexity, kullanıcı tabanının büyük kısmını zaten arama motoru olarak Perplexity kullanan kişilerden çekiyor — yani tarayıcı geçişi, alışkanlık geçişinin bir parçası olarak geliyor, tek başına satılmıyor. Google ise tam tersi yolu seçti: Gemini'yi yeni bir tarayıcı olarak değil, insanların zaten kullandığı Chrome'un içine gömerek dağıttı — dağıtım savaşını hiç vermeden kazandı.

| Ürün | Yaklaşım | Durum (Ağustos 2026) | Dağıtım stratejisi |
|---|---|---|---|
| Atlas (OpenAI) | Bağımsız tarayıcı | Kapandı (9 Ağustos 2026) | Yeni uygulama — kullanıcıyı ikna etmek gerekiyordu |
| Comet (Perplexity) | Bağımsız tarayıcı | Aktif, büyüyor | Var olan Perplexity kullanıcı tabanı üzerinden |
| Gemini (Chrome içinde) | Var olan tarayıcıya gömülü | Aktif | Chrome'un mevcut kullanıcı tabanına biniyor |
| ChatGPT ajan tabanlı tarama | Sohbet içi ajan yeteneği | Aktif (Atlas'ın yerini aldı) | ChatGPT'nin mevcut kullanıcı tabanına biniyor |

Tabloda dikkat çeken şey şu: hayatta kalan üç yaklaşımdan ikisi, yeni bir uygulama satmıyor — var olan bir alışkanlığın üzerine biniyor. Comet ise istisna, ama o istisna bile kendi kullanıcı tabanının (Perplexity arama kullanıcıları) üzerine kuruluyor; sıfırdan bir kitleye satış yapmıyor.

## Sonraki Adım: Gömülü mü, Bağımsız mı?

Benim görüşüm net: bağımsız AI tarayıcı, çoğu şirket için yanlış kalıp. Tarayıcı alışkanlığını değiştirmek, tüketici davranışında değiştirmesi en zor şeylerden biri ve tek bir özellik — ne kadar etkileyici olursa olsun — bu bariyeri aşmaya yetmiyor. Atlas'ın dokuz-on aylık ömrü, [OpenAI'ın haber sayfasında](https://openai.com/news/) da örtük biçimde kabul edildiği gibi, bunun kanıtı: OpenAI, kendi ajan teknolojisine güvenmiyor değildi, kullanıcıları yeni bir tarayıcıya taşımanın maliyetine güvenmiyordu.

Kategori muhtemelen iki yöne ayrılarak devam edecek: mevcut bir kullanıcı tabanının (arama, sohbet, kod yazma) üzerine ajan yeteneği ekleyen ürünler kazanacak; sıfırdan bağımsız bir tarayıcı satan ürünler ise ancak altındaki ürünün kendisi zaten güçlü bir çekim gücüne sahipse hayatta kalacak. Atlas'ın hikayesi, bu ayrımı en pahalı şekilde öğrenmiş bir vaka çalışması olarak kalacak; kategorinin geri kalanını takip etmek isteyenler için [teknoloji kategorimizdeki](/tr/category/teknoloji) diğer yazılara da göz atabilirsiniz.

## Sıkça Sorulan Sorular

### Atlas'taki yer imlerime ve verilerime ne oluyor?

OpenAI, kapanış tarihinden önce yer imlerinizi HTML formatında dışa aktarmanızı önerdi; bu dosyayı Chrome, Safari veya Edge gibi herhangi bir standart tarayıcıya içe aktarabilirsiniz. ChatGPT konuşma geçmişiniz etkilenmiyor çünkü bu veri tarayıcıda değil, hesabınızda saklanıyor.

### ChatGPT'nin ajan tabanlı tarama yeteneği, Atlas kadar yetenekli mi?

Bu, kullanım şekline göre değişir. Aynı temel "tarayıcıyla sohbet et" mekaniği ChatGPT'ye taşındı, ama Atlas ayrı bir tarayıcı olarak sekmelere ve oturumlara daha doğrudan erişebiliyordu. ChatGPT içindeki ajan modu, sohbet akışına daha entegre ama bağımsız bir tarayıcının sağladığı bazı doğrudan kontrol seçeneklerini barındırmıyor olabilir.

### Atlas yerine Comet'e mi geçmeliyim?

Zaten Perplexity ekosisteminde arama yapıyorsanız ve bağımsız, tam kontrol sahibi bir tarayıcı istiyorsanız, Comet mantıklı bir alternatif — Ağustos 2026 itibarıyla hâlâ aktif ve büyüyor. Günlük tarayıcınızı hiç değiştirmek istemiyorsanız, ChatGPT'nin sohbet içi ajan modu ya da Chrome'daki Gemini entegrasyonu, sıfır geçiş maliyetiyle benzer bir değerin önemli kısmını sağlıyor.

### Codex'teki tarama yeteneği kimler için?

Kod yazarken web'de gezinme, dokümantasyon arama ya da bir API'yi test etme gibi görevler gerektiren geliştiriciler için düşünülmüş. Ayrı bir tarayıcı penceresine geçmek yerine, bu yetenek doğrudan kod yazma ortamının bir parçası.
