---
title: "Gemini Artık Sohbette Dosya Oluşturup Düzenliyor"
slug: "gemini-sohbette-dosya-olusturma-duzenleme"
translationKey: "gemini-create-edit-files-in-chat"
locale: "tr"
excerpt: "Gemini artık sohbette PDF, Doküman, Sayfalar ve slayt dosyaları oluşturup düzenliyor; PDF mobilde de çalışır, diğerleri şimdilik yalnızca web'de."
category: "ai"
tags: ["gemini", "ai-tools", "productivity", "automation"]
publishedAt: "2026-11-08"
seoTitle: "Gemini Sohbette Dosya Oluşturma ve Düzenleme"
seoDescription: "Gemini artık sohbette PDF, Doküman, Sayfalar ve slayt dosyaları oluşturup düzenliyor; PDF mobilde de çalışır, diğerleri şimdilik yalnızca web'de."
---

Kısa cevap: Google, 29 Ekim 2026'da Gemini uygulamasına sohbet içinde dosya oluşturma, önizleme ve düzenleme özelliği ekledi; PDF, Google Dokümanlar, Sayfalar, slayt taslağı, Markdown, düz metin ve kod dosyalarını kapsıyor. PDF önizleme ve düzenleme hem web hem mobilde çalışıyor, diğer formatlar şimdilik yalnızca web'de.

## Bu özellik tam olarak ne yapıyor?

Gemini'ye bir rapor, bütçe tablosu veya sunum taslağı istediğinizde artık dosyayı doğrudan sohbet penceresinde önizleyebiliyor, tam ekran açıp elle düzenleyebiliyor, bir bölümü işaretleyip "bunu değiştir" diyebiliyor ve ardından takip sorularıyla ince ayar yapabiliyorsunuz. [Google'ın Workspace Updates duyurusuna](https://workspaceupdates.googleblog.com/2026/10/create-preview-and-edit-files-directly-in-the-Gemini-app.html) göre bu, Nisan 2026'daki önceki dosya üretim özelliğinin üzerine inşa edilmiş; o sürüm PowerPoint formatını desteklemiyordu, yenisi slaytları PPTX olarak da indirmenize izin veriyor.

## Hangi dosya türleri destekleniyor, nerede?

Aşağıdaki tablo hangi formatın hangi platformda çalıştığını özetliyor; bu ayrım önemli çünkü mobilde PDF dışında tam düzenleme şu an mevcut değil.

| Dosya türü | Web'de düzenleme | Mobilde düzenleme |
|---|---|---|
| PDF | Var | Var |
| Google Doküman | Var | Yalnızca önizleme |
| Google Sayfalar | Var | Yalnızca önizleme |
| Slayt taslağı | Var | Yalnızca önizleme |
| Markdown / düz metin / kod | Var | Yalnızca önizleme |

## Slayt oluşturmak nasıl çalışıyor?

Bir konu verdiğinizde Gemini önce bir anahat ve düzen önizlemesi hazırlıyor; beğenmediğiniz kısmı değiştirmesini isteyebiliyor, sonra "Google Slaytlar'da aç" diyerek düzenlemeyi orada sürdürebiliyor veya PPTX ya da PDF olarak indirebiliyorsunuz. Nisan 2026'daki ilk sürümde PowerPoint dışa aktarımı yoktu; bu, slayt setinizin Google ekosisteminin dışına çıkabilmesi anlamına geldiği için küçük ama pratik bir fark.

## İyi bir prompt neye benziyor?

İsteğinizde bölümleri, uzunluğu ve dışa aktarım formatını baştan belirtmek, belirsiz bir "bana rapor yaz" isteğinden çok daha yakın bir ilk taslak veriyor:

```markdown
Google Dokümanlar'da tek sayfalık bir rapor oluştur:
- Başlık: Q4 Pazarlama Özeti
- Bölüm 1: Ana sonuçlar (3 madde, rakamlarla)
- Bölüm 2: Q3'ten bu yana değişenler (tek kısa paragraf)
- Bölüm 3: Sonraki adımlar (numaralı liste, 3 madde)
Tamamı 400 kelimeyi aşmasın. Hazır olunca Google Dokümanlar'a aktar.
```

Gemini bu tür yapılandırılmış isteklere, açık uçlu bir istekten çok daha tutarlı uyuyor; önizlemeyi dışa aktarmadan görebildiğiniz için de biçim hatalarını, ekibinizin açacağı belgeye ulaşmadan yakalıyorsunuz.

## Bu, eski Canvas özelliğinden farklı mı?

Evet, net bir fark var. Canvas, kod ve metni yan panelde düzenlemek için tasarlanmış daha dar kapsamlı bir araçtı; yeni akış ise gerçek dosya formatlarını (PDF, DOCX benzeri Doküman çıkışı, XLSX benzeri Sayfalar çıkışı, PPTX) üretip bunları Google'ın kendi uygulamalarına veya bilgisayarınıza aktarmanıza izin veriyor. Yani Canvas bir "taslak alanı"ydı, bu ise uçtan uca bir dosya üretim hattı.

## Kimler kullanabilir, bir kısıtlama var mı?

Google, yeteneklerin Gemini uygulamasının desteklediği her dilde ve tüm kullanıcılara açık olduğunu söylüyor; ancak erişim hesabınıza bağlı kalabiliyor. Okul veya işyeri Gemini hesabınızı yönetiyorsa, yöneticinin politikası bu özelliği kısıtlayabilir. [ChatGPT'nin Google Docs ve Sheets iş akışını anlattığımız yazıda](/tr/posts/chatgpt-google-docs-sheets-is-akisi) benzer bir kurumsal kısıtlama deseninden bahsediyoruz; büyük AI asistanlarının hepsinde yönetici kontrolü benzer şekilde işliyor.

## Bunu gerçek bir işte nasıl kullanırsınız?

Tek sayfalık bir rapor için akış şöyle: önce verinizi veya notlarınızı Gemini'ye yapıştırın, "bundan tek sayfalık bir rapor hazırla" deyin, önizlemede beğenmediğiniz paragrafı işaretleyip "bunu daha kısa yaz" diyerek düzeltin, son olarak Google Dokümanlar'a aktarıp ekibinizle paylaşın. Bütçe tablosu için de aynı mantık geçerli: rakamlarınızı verin, Gemini bir Sayfalar taslağı hazırlasın, formülleri kontrol edin, ardından Sayfalar'da canlı olarak düzenlemeye devam edin. [Tablolar için ChatGPT mi Gemini mi karşılaştırmamızda](/tr/posts/tablolar-icin-chatgpt-mi-gemini-mi) bu iki aracın tablo üretimindeki farklarını daha detaylı ele alıyoruz.

Round-trip düzenlemede dikkat edilmesi gereken bir tuzak var: Gemini'de önizlemede yaptığınız değişiklik ile dosyayı Google Dokümanlar'da açtıktan sonra yaptığınız değişiklik aynı anda senkronize olmuyor; dosyayı dışa aktardıktan sonra Gemini sohbetinden tekrar düzenlemeye çalışmak, iki farklı sürümün çatallanmasına yol açabiliyor. Güvenli yol, düzenlemeyi bir yerde bitirip diğerine geçmek, ikisi arasında gidip gelmemek.

## Dışa aktarmadan önce oluşturulan dosya gerçekte nasıl görünüyor?

Kısa cevap: Gemini, dosya sohbetten çıkmadan önce parça parça düzenleyebileceğiniz yapılandırılmış bir önizleme gösteriyor, düz metin yığını değil. Bir sayı ve not yığınından tek sayfalık rapor istediğinizde, gerçek bir doküman taslağına benzer bir sonuç alıyorsunuz:

```markdown
# Haftalık Satış Özeti

## Öne Çıkanlar
- Gelir: 48.200 TL (haftalık +%6)
- En iyi bölge: Marmara (toplamın %32'si)
- Yeni müşteri: 14

## Bölge Kırılımı
| Bölge | Gelir | Değişim |
|---|---|---|
| Marmara | 15.400 TL | +%9 |
| Ege | 11.800 TL | +%2 |
| İç Anadolu | 20.900 TL | +%7 |

## Sonraki Hafta
- 3 bekleyen anlaşmayı takip et
- Güncellenen fiyatlandırma sayfasını yayına al
```

Sadece "Sonraki Hafta" bölümünü işaretleyip Gemini'den "yenileme görüşmesiyle ilgili bir eylem maddesi daha ekle" demeniz, dosyanın tamamını yeniden üretmek yerine sadece o bloğu güncelliyor. Asıl zaman kazandıran kısım bu, ilk taslak değil; bir satırı elle düzeltmek zaten saniyeler sürer, ama bir asistandan "sadece bu kısmı değiştir" isteyip üstteki tabloyu veya başlık yapısını bozmadan değişikliği yapmasını sağlamak, çoğu AI yazma aracının hâlâ beceremediği bir şey.

Bu önizleme mantığı, rapor dışında bütçe tablosu veya sunum taslağı için de aynı şekilde işliyor: değiştirmek istediğiniz hücreyi veya slaytı işaretlersiniz, Gemini sadece o parçayı günceller, kalan yapıyı olduğu gibi bırakır. Büyük bir dokümanın ortasında tek bir paragrafı değiştirmek istediğinizde dosyanın tamamını yeniden yapıştırıp baştan istemek zorunda kalmamak, özellikle uzun raporlarda gerçek bir fark yaratıyor.

## Ticari hesaplar için veri ve gizlilik notu ne diyor?

Kurumsal ve eğitim Workspace hesaplarında dosya içerikleri, kuruluşunuzun mevcut Workspace veri işleme sözleşmesi kapsamında kalıyor; yani bu özellik ayrı bir veri paylaşım rejimi getirmiyor, var olan Workspace politikanızı genişletiyor. Yöneticiniz özelliği kapatmışsa, Gemini dosya oluşturma isteğinizde bunu belirtiyor.

Kişisel görüşüm şu: Google'ın burada "her yerde aynı deneyim" sözü biraz eksik kalıyor, çünkü asıl değerli olan Doküman ve Sayfalar düzenlemesi hâlâ mobilde yok; bir rapor üzerinde telefonda hızlı bir düzeltme yapmak isteyen biri, bilgisayara geçmek zorunda kalıyor. Bu, aynı hafta duyurulan [ChatGPT Images 2.6'daki GIF ve referans özellikleriyle](/tr/posts/chatgpt-images-2-6-gif-ve-referans) karşılaştırıldığında, iki büyük asistanın da aynı anda "sohbet içi üretimi genişletme" yarışında olduğunu gösteriyor; ama hiçbiri henüz platformlar arası tam parite sunmuyor.

## Sıkça Sorulan Sorular

### Gemini'de dosya oluşturmak ücretsiz mi?

Google, özelliğin Gemini uygulamasını kullanan herkese açık olduğunu söylüyor; ancak okul veya işyeri hesabınız varsa yöneticinizin politikası erişimi kısıtlayabilir, bu yüzden "ücretsiz mi" sorusunun cevabı hesap türünüze bağlı.

### Mobilde Google Dokümanlar veya Sayfalar düzenleyebilir miyim?

Şu an için hayır, en azından tam düzenleme anlamında. PDF önizleme ve düzenleme mobilde çalışıyor ama Doküman, Sayfalar ve slaytları gerçekten düzenlemek hâlâ web tarayıcısı gerektiriyor.

### Slaytları PowerPoint olarak indirebilir miyim?

Evet. Nisan 2026'daki ilk sürümün aksine, güncellenmiş akış slayt setinizi PPTX veya PDF olarak dışa aktarmanıza izin veriyor; isterseniz düzenlemeyi Google Slaytlar'da da sürdürebilirsiniz.

### Bu, Gemini'nin eski Canvas özelliğinden farklı mı?

Evet. Canvas, kod ve metni yan panelde düzenlemek için dar kapsamlı bir araçtı; yeni akış gerçek PDF, Doküman, Sayfalar ve slayt dosyaları üretip bunları Google'ın kendi uygulamalarına veya cihazınıza aktarmanıza izin veren uçtan uca bir dosya hattı.
