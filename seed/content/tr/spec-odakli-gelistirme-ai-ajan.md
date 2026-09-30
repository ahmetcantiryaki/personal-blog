---
title: "Spec Odaklı Geliştirme Nedir? AI Ajanlarıyla Nasıl İşler?"
slug: "spec-odakli-gelistirme-ai-ajan"
translationKey: "spec-driven-development-ai-agents-2026"
locale: "tr"
excerpt: "Spec odaklı geliştirme, AI ajanına kod yazdırmadan önce davranışı yazıya dökme ve çıktıyı o yazıya göre doğrulama disiplinidir; iş akışı ve araçlar burada."
category: "software-engineering"
tags: [ai-coding, ai-agents, best-practices, documentation]
publishedAt: "2026-09-30"
seoTitle: "Spec Odaklı Geliştirme (SDD) Nedir? Saha Rehberi"
seoDescription: "Spec odaklı geliştirme nedir, spec ne içermeli, ajan çıktısı nasıl doğrulanır ve hangi araçlar destekliyor? Eylül 2026 saha notları ve karşılaştırma tablosu."
---

Kısa cevap: Spec odaklı geliştirme (SDD), AI ajanına "şunu yap" demeden önce neyin, neden ve hangi sınırlar içinde yapılacağını yazılı hale getirip; ajan kodu ürettikten sonra çıktıyı o yazıya karşı satır satır doğrulamaktır. Kod yazmak artık darboğaz değil - darboğaz spesifikasyonu netleştirmek ve sonucu denetlemek haline geldi.

## AI kodlama ajanları darboğazı nereye taşıdı?

Eylül 2026 itibarıyla Claude Code, Cursor ve GitHub Copilot gibi ajanlar orta büyüklükte bir özelliği dakikalar içinde koda döküyor. Bu, "kod yazmak yavaş" sorununu pratikte çözdü. Ama aynı hız yeni bir sorun açtı: ajan, söylenmeyen varsayımları kendi tahminiyle dolduruyor ve bu tahminler genelde sizin kafanızdakiyle örtüşmüyor.

Sonuç olarak zor iş iki yöne kaydı. Yukarı akışta, göreve başlamadan önce ne istediğinizi - kenar durumlar, hata davranışı, kapsam dışı bırakılanlar dahil - net biçimde yazmanız gerekiyor. Aşağı akışta ise ajanın ürettiği kodu, "çalışıyor gibi görünüyor" demek yerine, o yazılı beklentiye karşı tek tek kontrol etmeniz gerekiyor. Spec odaklı geliştirme bu iki ucu birbirine bağlayan disiplinin adı.

Bu, [vibe coding](/tr/posts/spec-driven-development-rehberi)'in tam tersi bir refleks: vibe coding'de belirsiz bir istekle başlayıp çıktıyı gözle onaylıyordunuz; SDD'de niyeti önce yazıp sonra doğruluyorsunuz. Ürün gereksinimi yönetimiyle uğraşan [Jama Software da Eylül 2025'te yayımladığı rehberde](https://www.jamasoftware.com/blog/what-is-spec-driven-development-sdd-for-ai-powered-engineering/) aynı noktaya dikkat çekiyor: AI ajanları hızlı kod üretiyor, ama izlenebilir ve denetlenebilir kod üretmeleri için yapılandırılmış bir spesifikasyona ihtiyaçları var.

## Bu bağlamda "spec" tam olarak nedir?

Kısa cevap: Bir SDD speci, davranışı tanımlayan yapılandırılmış bir doğal dil belgesidir - ne resmi bir matematiksel spesifikasyon (TLA+ gibi) ne de "kullanıcı profilini düzenlesin" satırından ibaret bulanık bir Jira bileti. Amaç, ajanın ve sizin aynı kabul kriterlerine bakmanızı sağlamak.

İyi bir spec genelde şu bölümleri içerir: amaç, kapsam (ve kapsam dışı), davranış kuralları, kabul kriterleri. Aşağıdaki gibi kısa bir örnek, "kullanıcı bilmiyor ama sistem biliyor" türü kenar durumları da yakalar:

```markdown
# Spec: E-posta değişikliği doğrulama akışı

## Amaç
Kullanıcı hesap e-postasını değiştirdiğinde, eski adrese bilgilendirme,
yeni adrese doğrulama linki gitmeli.

## Kapsam
- Etkilenen: POST /api/account/email
- Etkilenmeyen: parola değişikliği, 2FA ayarları

## Davranış kuralları
1. Yeni e-posta sistemde kayıtlıysa 409 dön, e-posta gönderme.
2. Doğrulama linki 24 saat geçerli ve tek kullanımlık.
3. Link tıklanana kadar eski e-posta aktif kalır.

## Kabul kriterleri
- [ ] Kayıtlı e-postayla denemede 409 dönüyor, yeni kayıt oluşmuyor
- [ ] Süresi dolan linkte 410 dönüyor
- [ ] Eski adrese giden bildirimde IP ve zaman damgası var

## Kapsam dışı
Kurumsal SSO hesapları (ayrı spec'te ele alınacak)
```

Bu belge iki-üç sayfayı geçmemeli. Daha uzunu, ajanın da sizin de gerçekten okumayacağı bir belgeye dönüşür. Akademik tarafta da benzer bir ayrım var: [arXiv'de Eylül 2025'te yayımlanan bir çalışma](https://arxiv.org/abs/2509.00252), sistem spesifikasyonlarını (mimari, kurallar - oturum başına bir kez yüklenir) ve özellik spesifikasyonlarını (tek bir değişikliğin kabul kriterleri - yukarıdaki örnek gibi) ayrı kategoriler olarak ele alıyor.

## Spec odaklı bir iş akışı sahada nasıl işler?

Kısa cevap: dört adımlı bir döngü - speci yaz, ajana uygulat, çıktıyı speke karşı doğrula, uzun oturumlarda spec ile kod arasındaki sapmayı (drift) düzenli olarak kapat. Sırayla:

**1. Speci yaz.** Göreve başlamadan önce yukarıdaki gibi kısa bir belge hazırlayın. Bunu görev tanımının içine, repo'da `specs/` klasörüne veya ajanın okuyacağı bir dosyaya koyun.

**2. Ajana uygulat.** Speci doğrudan ajana verin, "şuna göre uygula" deyin. Büyük özellikleri tek seferde değil, spec'teki her kabul kriterine karşılık gelen küçük görevlere bölerek ilerletin; bu, doğrulamayı da kolaylaştırır.

**3. Çıktıyı speke karşı doğrula.** Her görev bitiminde kabul kriterlerini tek tek işaretleyin - kod incelemesi burada "güzel görünüyor mu" değil, "kriter karşılandı mı" sorusuna dönüşür. Bu adımı atlarsanız SDD'nin bütün faydası gider; [AI kod incelemesinde güven ama doğrula](/tr/posts/ai-ile-kod-incelemesi-guven-dogrula) yaklaşımı tam olarak bu adıma karşılık gelir.

```bash
# Görev sonunda hızlı kontrol
git diff --stat HEAD~1                    # ajan neyi değiştirdi?
grep -c "\[x\]" specs/email-change.md     # kaç kriter işaretlendi?
```

**4. Drift'e karşı koru.** Uzun bir oturumda (birkaç saat, çok adımlı bir özellik) ajan spec'te olmayan kararlar almaya başlar - değişken adlarını değiştirir, spec'te tanımlanmamış bir hata yolunu kendi kafasına göre ele alır. Her 3-4 görevde bir spec'i yeniden okutup "hâlâ buna uyuyor muyuz" diye sorun. [Uzun AI kodlama oturumlarında bağlamı korumak](/tr/posts/uzun-ai-kodlama-oturumunda-baglami-koru) için kullandığınız checkpoint alışkanlığı burada da işe yarar.

## Hangi araçlar spec odaklı geliştirmeyi destekliyor?

Kısa cevap: En yaygın bilineni GitHub'ın açık kaynak **[Spec Kit](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/)**'i - Temmuz 2025'te duyurulan, MIT lisanslı ve Claude Code, Copilot, Cursor, Gemini CLI dahil çok sayıda ajanla çalışan bir araç seti. Onun yanında AWS'nin **Kiro**'su ve topluluk projesi **OpenSpec** de aynı boşluğu dolduruyor.

Spec Kit'in yaklaşımı "constitution → plan → tasks → implement" adımlarından oluşan bir boru hattı: her aşama bir sonrakini besleyen bir Markdown belgesi üretiyor, böylece ajana serbest metin prompt yerine yapılandırılmış bağlam veriliyor. Bu, [context engineering](/tr/posts/ai-ajanlari-icin-context-engineering) pratiğinin SDD'ye özel bir versiyonu gibi düşünülebilir.

Bu araçların hiçbiri zorunlu değil - Spec Kit'i hiç kurmadan, sadece repo'da bir `specs/` klasörü ve disiplinli bir görev bölme alışkanlığıyla da SDD uygulayabilirsiniz. Araç, işi kolaylaştırır; disiplinin yerini tutmaz.

Hangi aracı seçeceğiniz büyük ölçüde ekibin zaten kullandığı ajana bağlı: Claude Code veya Copilot kullanan bir ekip için Spec Kit'in çoklu-ajan desteği doğrudan avantaj sağlıyor, AWS ekosisteminde çalışan takımlar için Kiro daha az sürtünmeyle entegre oluyor. OpenSpec ise araç bağımsız kalmak isteyen, birden fazla ajanı aynı anda deneyen ekipler için daha esnek bir seçenek. Üçünü de kurup bir haftalık deneme yapmak, hangisinin ekibinizin iş akışına oturduğunu görmenin en hızlı yolu.

| Yaklaşım | Speci kim yazar | Doğrulama adımı | En uygun olduğu yer |
|---|---|---|---|
| Vibe coding | Kimse, ya da tek satırlık prompt | Göz kararı, "çalışıyor gibi" | Tek seferlik demo, hafta sonu denemesi |
| Klasik yukarıdan-aşağı spec | İş analisti/mimar, kod yazılmadan aylar önce | QA'in haftalar sonra manuel testi | Regülasyona tabi, gereksinimi sabit büyük sistemler |
| Spec odaklı geliştirme (SDD) | Geliştirici, göreve başlamadan hemen önce | Ajan çıktısı her görev sonunda kriterlere karşı kontrol edilir | Çok oturumlu özellik geliştirme, takım devri, uzun ömürlü prod kodu |

## Spec odaklı geliştirme ne zaman gereksiz yük, ne zaman gerçekten işe yarar?

Kısa cevap: Bir özellik birden fazla oturum sürecek, başka birinin devralacağı ya da üretime çıkacaksa SDD zaman kazandırır; tek seferlik bir script, atılacak bir prototip ya da "bu akşam dene, yarın sil" türü bir iş için SDD saf ek yüktür.

Spec yazmanın maliyeti sabit bir şeydir - on beş dakikanızı alır. Bu maliyeti geri kazandıran şey, kodun tekrar tekrar okunacak, değiştirilecek veya başka bir ajan/geliştirici tarafından devralınacak olmasıdır. Bir CLI'ı tek seferlik veri temizliği için yazıyorsanız, kimse o kodu bir daha açmayacak; spec yazmak sadece zaman kaybıdır.

Bize sorarsanız, ekiplerin en çok yaptığı hata SDD'yi ya hiç kullanmamak ya da her şeye - üç satırlık bir yardımcı fonksiyona bile - uygulamaya çalışmak. İkisi de yanlış; ölçüt basit: kod sizden sonra da yaşayacak mı? Daha geniş [yazılım mühendisliği](/tr/category/yazilim-muhendisligi) yazılarımızda bu tür pratik ölçütleri işlemeye devam ediyoruz.

## Sıkça Sorulan Sorular

### Spec odaklı geliştirme ile klasik gereksinim dokümanı arasındaki fark nedir?

Klasik gereksinim dokümanı aylar önce, kod yazılmadan çok önce hazırlanır ve genelde iş dilinde yazılır; SDD'deki spec ise göreve başlamadan hemen önce yazılır, davranış ve kabul kriterleri odaklıdır ve doğrudan ajana girdi olarak kullanılır. Fark, zamanlama ve amaçta: biri onay süreci içindir, diğeri ajanın anlayacağı çalışma talimatıdır.

### Speci kim yazmalı, ürün yöneticisi mi geliştirici mi?

Genelde speci görevi uygulayacak geliştirici yazar, çünkü teknik kenar durumları (hata kodları, veri modelleri) en iyi o bilir. Ürün yöneticisi "ne" ve "neden" kısmına katkı verir, ama kabul kriterlerini teknik olarak ifade etmek geliştiricinin işidir. Küçük ekiplerde bu genelde tek kişi olur.

### AI ajanı speke uymazsa ne yapmalı?

Önce spec'in belirsiz olup olmadığını kontrol edin - çoğu uyumsuzluk, ajanın hata yapmasından değil, spec'in bir kenar durumunu atlamasından kaynaklanır. Spec netse ve ajan yine de sapıyorsa, o görevi daha küçük parçalara bölüp her parçayı ayrı doğrulayın; büyük görevlerde sapma birikerek büyür.

### Küçük scriptler ve prototipler için spec yazmaya değer mi?

Hayır, tek seferlik scriptler ve atılacak prototipler için SDD genelde gereksiz yüktür. Bu tür işlerde kodun ömrü kısadır ve kimse onu tekrar okumayacaktır; spec yazmanın maliyeti kazandırdığından fazla olur. Kod üretime çıkacak veya başkası devralacaksa denklem tersine döner.
