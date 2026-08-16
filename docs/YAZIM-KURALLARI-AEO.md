# Yazım kuralları — AI aramada alıntılanmak için

> Bu dosyanın "Routine'e yapıştırılacak blok" bölümü, günlük yazı routine'inin
> promptuna eklenecek. Amaç: yazıların ChatGPT/Perplexity/AI Overviews tarafından
> **alıntılanması**. Hedef ilk sıra değil, **alıntılanmaya değer olmak**.

## Neden bu değişiklik (veriye dayalı)

Search Console, son 16 ay:

| Metrik | Değer |
|---|---|
| Gösterim | 19.277 |
| Tıklama | 202 |
| TO | %1,05 |
| Ortalama pozisyon | ~12 |

Yani içerik **görünüyor ama tıklanmıyor**. Pozisyon 8-12 bandı, AI Overviews'ın
tıklamayı yediği bant. Tıklama alamadığımız sorgular tam olarak AI'ın cevapladığı
tipte:

| Sorgu | Gösterim | Tıklama | Pozisyon |
|---|---|---|---|
| claude paketler | 73 | 0 | 9,6 |
| pgrust | 57 | 0 | 10,1 |
| react state management 2026 | 49 | 0 | 8,0 |
| embedding nedir | 35 | 0 | 10,7 |
| most popular ai | 36 | 0 | 13,4 |

Buna karşılık GA4'te **AI Assistant kanalı 33 oturum, +%1.550** — en hızlı büyüyen
kanal. Strateji: bu bandı tıklama için değil, **alıntı için** optimize et.

Ülke verisi de yön veriyor: Türkiye 66 tıklama / %2,85 TO (pozisyon 9,1), ABD 12
tıklama / %0,25 TO (pozisyon 13,7). Türkçe içerik kat kat verimli — TR'yi ikinci
sınıf görme.

---

## Routine'e yapıştırılacak blok

```
YAZIM TARZI — ZORUNLU

Bir insana cevap veriyorsun. Konu hakkında yorum yapmıyorsun, denemesini
yazmıyorsun. Biri sana soruyu sormuş, sen cevaplıyorsun.

1. AÇILIŞ = DOĞRUDAN CEVAP
   İlk paragraf, başlıktaki sorunun cevabını 40-60 kelimede verir. Tek başına
   alıntılanabilir olmalı: öncesini okumadan anlaşılmalı.
   YASAK açılışlar: "Bu yazıda ... inceleyeceğiz", "Son yıllarda ... giderek
   önem kazandı", "Yazılım dünyası hızla değişiyor".
   DOĞRU: "Kısa cevap: X kullan. Çünkü ..." / "Hayır, gerekmiyor. ..."

2. HER H2 GERÇEK BİR SORU
   İnsanların aradığı gibi yaz: "X nedir?", "X mi Y mi?", "X ne zaman kullanılır?",
   "X nasıl kurulur?". Soyut başlık kullanma ("Mimari Değerlendirmeler" gibi).
   Her H2'nin hemen altındaki ilk 40-60 kelime o sorunun net cevabıdır; detay,
   istisna ve gerekçe sonra gelir.

3. ALINTILANABİLİR CÜMLE
   Her bölümde en az bir cümle, bağlamsız alıntılandığında doğru ve tam olsun.
   "Bu durumda daha hızlıdır" YANLIŞ (neyden hızlı?).
   "Postgres'te partial index, 10 milyon satırlık tabloda sorguyu 40 ms'den
   2 ms'ye düşürür" DOĞRU.

4. SAYI, TARİH, SÜRÜM
   Model alıntılarken doğrulanabilir veriyi tercih eder. Rakam, sürüm numarası,
   ölçüm ve tarih kullan. "Çok daha hızlı" yerine "3,2 kat hızlı".
   Sürüm ve fiyat yazarken tarihini belirt: "Ağustos 2026 itibarıyla".

5. SADE DİL
   Jargonu ilk geçtiği yerde tek cümlede tanımla. Tanımlamayacaksan kullanma.
   Kısa cümle. Edilgen çatıdan kaçın.

6. YASAKLI DOLGU
   "Sonuç olarak diyebiliriz ki", "unutmayalım ki", "günümüzde", "hızla değişen
   dünyada", "bu makalede ele aldık" — hiçbiri geçmeyecek. Kelime sayısını
   dolgu ile doldurma; söyleyecek şey bitince bölümü bitir.

7. YAPI (mevcut kurallar geçerli)
   - Karşılaştırma tablosu zorunlu
   - SSS bölümü zorunlu; sorular gerçek arama sorgusu formunda olmalı
     (SSS zaten FAQPage JSON-LD'ye dönüşüyor — alıntılanma şansı en yüksek blok)
   - 1100-1600 kelime

8. BAŞLIK VE EXCERPT
   Başlık sorunun kendisi ya da net cevabı olsun. Merak boşluğu bırakma.
   excerpt = yazının 1 cümlelik cevabı, tek başına anlamlı (arama sonucunda ve
   AI özetinde bu görünüyor).
```

---

## Konu seçimi — GSC'nin gösterdiği kazanan formlar

Haftalık konu stratejisti bu formları önceliklendirsin (veriyle doğrulandı):

1. **"X vs Y"** — `sonnet 5 vs gemini 3.5` (68 gösterim), `pulumi vs terraform`
   (51), `sliding window vs token bucket` (%14,3 TO)
2. **"X nedir"** — `embedding nedir` (35 gösterim, 0 tıklama — fırsat)
3. **"en iyi / en popüler X 2026"** — `most popular ai tools 2026`,
   `most used ai tools in 2026` (%11,1 TO)
4. **Sürüm/ürün adı + yıl** — `typescript 7.1` (62), `claude paketler` (73)

Türkçe karşılıkları da üret: "X mi Y mi", "X nedir", "2026'nın en iyi X araçları".

## Mevcut 276 yazı ne olacak

Hepsini yeniden yazma. Öncelik sırası:

1. Gösterimi yüksek, tıklaması sıfır olan yazılar (yukarıdaki tablo) — sadece
   **açılış paragrafını** ve **H2 başlıklarını** düzelt. En ucuz, en yüksek getiri.
2. Kalanına dokunma; yeni yazılar zaten yeni kurallarla çıkacak.

## Ölçüm

- GSC → Arama sonuçları: TO'nun %1,05'ten yukarı hareketi
- GA4 → AI Assistant kanalı oturum sayısı (şu an 33)
- Referrer bazında `chatgpt.com`, `perplexity.ai`, `claude.ai` ayrı segment
