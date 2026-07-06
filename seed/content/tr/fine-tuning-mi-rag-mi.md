---
title: "Fine-Tuning mi RAG mi: Hangisine İhtiyacın Var"
slug: "fine-tuning-mi-rag-mi"
translationKey: "fine-tuning-vs-rag"
locale: "tr"
excerpt: "Fine-tuning mi RAG mi sorusu tek soruya iner: eksik olan bilgi mi, davranış mı? RAG çalışma anında bilgi verir, fine-tuning modelin davranışını yeniden şekillendirir."
category: "ai"
tags: ["rag", "fine-tuning", "llm"]
publishedAt: "2026-05-20"
seoTitle: "Fine-Tuning mi RAG mi: Hangisine İhtiyacın Var"
seoDescription: "Fine-tuning mi RAG mi? Eksik olan bilgi mi davranış mı ona bakın. RAG çalışma anında bilgi enjekte eder, fine-tuning modeli değiştirir. Karar tablosu içeride."
---

**Fine-tuning mi RAG mi** sorusu tek soruya iner: eksik olan bilgi mi, yoksa davranış mı? RAG (retrieval-augmented generation), çalışma anında ilgili belgeleri getirip prompt'a ekler; böylece model hiç ezberlemediği bilgilerle cevap verir. Fine-tuning ise modelin ağırlıklarını yeniden eğitir, yani modelin varsayılan cevap verme biçimini değiştirir. Cevap sizin verinize bağlıysa RAG'e, tutarlı bir format, ton veya beceri gerekiyorsa fine-tuning'e uzanın.

Bu yazıda seçimi bir karşılaştırma tablosu, gerçek maliyet rakamları ve ikisini de üretime alırken yaptığımız hatalarla açıyorum. Sonunda bir dakikanın altında hangi kolu çekeceğinizi, ne zaman ikisini birden çekeceğinizi bilmelisiniz.

## Fine-tuning ve RAG arasındaki fark nedir?

Kısa cevap: RAG modeli hiç değiştirmez, çalışma anında ona taze bağlam verir; bilgi tabanından eşleşen parçaları getirip prompt'a yerleştirir. Fine-tuning ise modelin kendisini değiştirir; örnekleriniz üzerinde ek eğitim yaparak yeni davranışı ağırlıklara işler. Biri *modelin ne okuduğunu* günceller, diğeri *modelin ne olduğunu*.

İşe yarayan bir zihinsel model: RAG açık kitap sınavıdır. Model yine aynı şekilde akıl yürütür ama cevap vermeden hemen önce doğru sayfayı önüne koyarsınız. Fine-tuning ise sınava çalışmaktır. Model kalıpları içselleştirir, öyle ki önünde hiç kaynak olmadan bile farklı cevap verir.

Bu ayrım geri kalan her şeyi belirler. RAG ağırlıklara hiç dokunmadığı için bilgi tabanınızı saat 15.00'te güncellersiniz, model yeni bilgiyi 15.01'de "bilir". Fine-tuning kalıpları işlediği için tonu kaydırabilir, bir JSON şemasını zorunlu kılabilir veya hiçbir prompt'un güvenilir üretemediği niş bir sınıflandırma becerisini öğretebilir.

## Karşılaştırma tablosu: fine-tuning vs RAG

Aşağıdaki tablo iki yaklaşımı gerçek projeleri belirleyen boyutlarda karşılaştırıyor. Seçim yaparken en çok bu satırlara bakın.

| Boyut | RAG | Fine-Tuning |
|-------|-----|-------------|
| Neyi değiştirir | Çalışma anındaki bağlamı | Modelin ağırlıklarını |
| En uygun | Taze, olgusal, özel bilgi | Tutarlı format, ton veya beceri |
| Güncelleme hızı | Anında (belgeyi yeniden indeksle) | Yavaş (yeniden eğit ve dağıt) |
| Kaynak gösterimi | Var, parçaları alıntılayabilirsiniz | Yok, bilgi opaktır |
| Başlangıç maliyeti | Düşük, eğitim koşusu yok | Orta-yüksek, etiketli veri ister |
| Sorgu başına maliyet | Yüksek (daha çok prompt token) | Düşük (daha kısa prompt) |
| Halüsinasyon kontrolü | Güçlü, cevabı kaynağa dayar | Zayıf, yine kendinden emin uydurabilir |
| Gereken veri hacmi | Onlarca belge yeter | Genelde 500+ kaliteli örnek |

Pratik kural: Doğru cevap yeni bir çalışana verebileceğiniz bir belgede yaşıyorsa RAG kullanın. Sorun modelin *hangi bilgiyi bildiği* değil de *nasıl yazdığı veya sınıflandırdığı* ise fine-tuning yapın.

## RAG ne zaman kullanılır?

Kısa cevap: Cevaplar değişen, özel veya bir prompt'a sığmayacak kadar büyük bilgiye bağlıysa RAG kullanın. Kendi belgeleriniz üzerinde soru-cevap, destek bilgi tabanları ve kaynak göstermeniz gereken ya da dünkü verinin bugün yanlış olacağı her şey için varsayılan seçimdir.

RAG şu durumlarda doğru koldur:

- **Bilginiz sık değişiyorsa.** Ürün dokümanı, fiyat, politika ve talepler her hafta değişir. Yeniden indekslemek ucuzdur, yeniden eğitmek değildir.
- **Kaynak göstermeniz gerekiyorsa.** Regülasyona tabi ve iç kullanıma dönük araçlar cevabın *nereden* geldiğini göstermelidir. RAG kaynak parçalarını döndürür; fine-tune edilmiş model döndüremez.
- **Halüsinasyonu kesmek istiyorsanız.** Cevabı getirilen metne dayamak en etkili çözümdür. Tüm oyun kitabını [LLM halüsinasyonlarını azaltma rehberimizde](/blog/reduce-llm-hallucinations) anlatıyoruz.
- **Az etiketli veriniz varsa.** RAG bir avuç belgeyle çalışır. Eğitim seti gerekmez.

İşin püf noktası şu: RAG ancak getirimi kadar iyidir. Vektör araması yanlış parçaları döndürürse model çöpten cevap üretir. Burada chunk'lama stratejisi, embedding kalitesi ve vektör deponuz LLM'den daha çok önem taşır. [Vektör veritabanı karşılaştırmamız](/blog/vektor-veritabani-karsilastirma) ödünleşimleri, [RAG sistemi nasıl kurulur](/blog/rag-sistemi-nasil-kurulur) yazımız da tüm hattı anlatır.

```python
# RAG: önce getir, sonra getirilen bağlamdan cevapla
def cevapla(soru: str) -> str:
    parcalar = vektor_depo.ara(embed(soru), top_k=5)     # ilgili belgeleri bul
    baglam = "\n\n".join(p.metin for p in parcalar)
    prompt = f"SADECE bu bağlamı kullanarak cevapla:\n{baglam}\n\nS: {soru}"
    return llm(prompt)                                    # ağırlıklara dokunulmaz
```

Model hiç değiştirilmiyor. Depodaki bir belgeyi değiştirin, bir sonraki cevap bunu yansıtır — ne yeniden eğitim ne yeniden dağıtım.

## Fine-tuning ne zaman kullanılır?

Kısa cevap: Modelin varsayılan olarak farklı davranmasını istiyorsanız fine-tuning kullanın — katı bir çıktı formatı, belirli bir ses tonu veya prompt'un güvenilir üretemediği uzmanlaşmış bir beceri. Sorun eksik bilgi değil de tutarlılık ve üslupsa ve kalıbı öğretecek kadar etiketli örneğiniz varsa parlar.

Fine-tuning maliyetini şu durumlarda geri öder:

- **Katı bir çıktı biçimi gerekiyorsa.** Her çağrıda şemaya uyan geçerli JSON istiyorsanız, birkaç yüz fine-tuning örneği, talimatla şişen bir prompt'u geride bırakır.
- **Ton ve ses tutarlı olmalıysa.** Binlerce çağrı boyunca korunan bir marka sesi veya hukuki üslup, bağlam değil ağırlık meselesidir.
- **Görev dar ve tekrarlı bir beceriyse.** Destek taleplerini 40 iç kategoriye ayırmak ya da bir belge tipinden alan çıkarmak, kalıp işlendikten sonra daha hızlı ve ucuz olur.
- **Daha kısa prompt istiyorsanız.** Fine-tuning talimatları prompt'tan çıkarıp ağırlıklara taşır; sorgu başına token ve gecikmeyi düşürür.

2026'da bu iki yıl öncesine göre çok daha ucuz. **LoRA** ve **QLoRA** gibi parametre-verimli yöntemler tüm modeli değil küçük bir adaptör eğitir; böylece Llama ya da bir Qwen türevi gibi açık bir modeli tek GPU'da birkaç dolara fine-tune edebilirsiniz. OpenAI ve diğerlerinin barındırılan fine-tuning'i işi bir API çağrısı artı JSONL dosyasına indirir. Biz bir talep sınıflandırıcıyı ~1.200 etiketli örnekle fine-tune ettik: doğruluk %88'den (prompt'la) %96'ya (fine-tune) çıktı, prompt uzunluğu %70 düştü ve sorgu başına maliyet yaklaşık yarıya indi çünkü her istekte 900 token'lık talimat bloğu göndermeyi bıraktık.

Fine-tuning'in *çözmediği* şey: eski bilgi. Mart'ta fine-tune edilen bir model, yeniden eğitmedikçe Nisan'daki fiyat değişikliğini bilmez. Gördüğümüz en yaygın hata tam da bu — ekipler bilgi enjekte etmek için fine-tune yapıyor, sonra modelin neden kendinden emin biçimde güncelliğini yitirdiğine şaşırıyor. Bilgi RAG'e aittir; davranış fine-tuning'e.

## Fine-tuning mi RAG mi: nasıl karar veririm?

Kısa cevap: Gerçekte bozuk olanın ne olduğunu sorun. Modelin *bilgisi* eksikse RAG kullanın. Model bilgiye sahip ama *yanlış şekilde* cevap veriyorsa — kötü format, yanlış ton, niş görevde zayıf — fine-tune edin. İkisi de bozuksa ikisini de yapın: bilgi için RAG, davranış için fine-tuning.

Çoğu durumu çözen bir karar yolu:

1. **Cevap bir belgede mi?** Bir olgu getirebileceğiniz metinde yaşıyorsa RAG ile başlayın. Daha ucuz, daha hızlı ve güncellenebilir.
2. **Çıktı katı bir biçim veya ses gerektiriyor mu?** Prompt formatı ya da tonu güvenilir tutamıyorsa tutarlılık için fine-tune edin.
3. **Bilginiz oynak mı?** Olgular her hafta değişiyorsa bunları asla ağırlıklara işlemeyin. Sadece RAG.
4. **500+ temiz etiketli örneğiniz var mı?** Yoksa henüz iyi fine-tune edemezsiniz. Prompt'u iyileştirin ya da önce RAG kurun.
5. **Hâlâ iki cephede de başarısız mısınız?** İkisini birleştirin.

Olgun sistemlerin çoğu tam da bu birleşimde son bulur. Bir modeli şemanızı güvenilir üretsin ve sizin sesinizle konuşsun diye fine-tune edersiniz, sonra her cevap güncel ve alıntılanabilir veriye dayansın diye RAG ile sararsınız. Fine-tune *nasıl*'ı, getirim *ne*'yi halleder. İkisini de kurmadan önce [prompt mühendisliği tekniklerini](/blog/prompt-muhendisligi-teknikleri) tüketmeye değer — daha iyi bir prompt çoğu zaman ikisine de gerek bırakmaz. Büyük resim için [yapay zeka mühendisliği rehberimize](/blog/ai) göz atın.

## Sıkça Sorulan Sorular

### Fine-tuning ve RAG arasındaki fark en basit haliyle nedir?

RAG, modeli değiştirmeden soru anında ona bilgi verir — açık kitap sınavıdır. Fine-tuning ise modeli yeniden eğitir, varsayılan olarak farklı davranmasını sağlar — sınav öncesi çalışmaktır. Bilgi eklemek için RAG, davranışı, formatı veya tonu değiştirmek için fine-tuning kullanın.

### RAG her zaman fine-tuning'den daha mı ucuzdur?

Tam olarak değil. RAG'in başlangıç maliyeti neredeyse sıfırdır çünkü eğitim koşusu yoktur; bu onu başlamak için ucuz kılar. Ama her sorguda prompt token ekler, dolayısıyla çağrı başına maliyeti yüksektir. Fine-tuning başta daha pahalıdır ama daha kısa prompt ve daha düşük sorgu maliyeti üretir; yüksek hacimde öne geçebilir. Seçimi yalnızca etiket fiyatına değil trafiğinize göre yapın.

### Fine-tuning ve RAG'i birlikte kullanabilir miyim?

Evet, üretim için en güçlü desen budur. Modeli çıktı formatınızı ve sesinizi güvenilir üretsin diye fine-tune edin, sonra çalışma anında güncel ve alıntılanabilir olguları beslemek için RAG kullanın. Fine-tune davranışı, getirim bilgiyi düzeltir. 2026'daki olgun sistemlerin çoğu her iki katmanı da çalıştırır.

### Fine-tuning halüsinasyonu durdurur mu?

Hayır — bu yaygın bir yanılgıdır. Fine-tuning davranışı şekillendirir ama model yine kendinden emin biçimde olgu uydurabilir ve kaynak gösteremez. Halüsinasyon için çok daha iyi çözüm RAG'dir, çünkü cevabı atıf yapabileceğiniz getirilen metne dayar. Olgularda doğruluk hedefse RAG'e uzanın.
