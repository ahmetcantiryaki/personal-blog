---
title: "AI ile Mülakat Provası Nasıl Yapılır"
slug: "ai-ile-mulakat-provasi-nasil-yapilir"
translationKey: "ai-mock-interview-prep-2026"
locale: "tr"
excerpt: "ChatGPT, Claude veya Gemini'ye iş ilanını ve bir persona promptu verin, sesli modda süreli bir prova yapın ve övgü değil somut geri bildirim isteyin."
category: "career-productivity"
tags: ["interview", "career", "ai-tools", "job-search"]
publishedAt: "2026-09-09"
seoTitle: "AI ile Mülakat Provası Nasıl Yapılır?"
seoDescription: "ChatGPT, Claude veya Gemini'ye iş ilanını ve bir persona promptu verin, sesli modda süreli bir prova yapın ve övgü değil somut geri bildirim isteyin."
---

Kısa cevap: İş ilanını ChatGPT, Claude veya Gemini'ye yapıştırın, tek paragraflık bir mülakatçı personası verin ve modele tek seferde tek soru sormasını kesin şekilde söyleyin; provayı sesli modda yapın ki yazmayı değil konuşmayı çalışın. AI'ın en büyük zayıflığı övgü dağıtmak, bu yüzden somut eleştiri istemezseniz genel bir "harika olmuş" cevabıyla baş başa kalırsınız.

## AI ile mülakat provası nasıl kurulur?

İlk promptta üç şeye ihtiyacınız var: iş ilanı, mülakat türü (davranışsal, teknik veya sistem tasarımı) ve modeli bir öğretmen değil bir mülakatçı gibi davranmaya zorlayan bir persona. Persona talimatı olmadan çoğu model, cevabınızı değerlendirmek yerine iyi bir cevabın nasıl olması gerektiğini anlatmaya kayar.

```text
Bu pozisyon için beni mülakata alan kıdemli bir mühendislik yöneticisisin: [iş ilanını yapıştır].
30 dakikalık davranışsal bir mülakat yürüt. Tek seferde tek soru sor ve cevabımı
verene kadar bekle. Ben sormadıkça iyi bir cevabın nasıl olacağını açıklama.
Her cevaptan sonra bir güçlü ve bir zayıf yön belirt — genel övgü yok, "harika
olmuş" yok. Sonunda iş ilanının gerekliliklerine göre puanlanmış bir özet ver.
```

Bir süre sınırı koyun; çünkü serbest bırakılan bir AI mülakatçı iki saat boyunca seve seve devam eder. Gerçek bir davranışsal tur 30-45 dakika sürer; teknik bir ön eleme genelde 45-60 dakika. Provada bu süreyi tutturmak, çalıştığınız becerinin bir parçası.

İş ilanını bir AI'a yapıştırırken şirket adını ve özel detayları çıkarıp genel bir rol tanımına indirmek makul bir alışkanlık; çoğu ilan zaten kamuya açık olsa da, henüz teklif almadığınız bir şirketin iç bilgiyle karışabilecek ayrıntılarını üçüncü taraf bir servise taşımamak daha temiz bir sınır.

## STAR yöntemiyle davranışsal soru provası nasıl yapılır?

STAR yöntemi — Situation (Durum), Task (Görev), Action (Eylem), Result (Sonuç) — davranışsal bir cevabı, siz önce arka plan hikayesine dalmadan mülakatçının takip edebileceği şekilde yapılandırır. Durumu ve görevi bir iki cümlede özetleyin, zamanınızın çoğunu bizzat sizin yaptığınız eylemlere ayırın ve ölçülebilir bir sonuçla kapatın.

Sesli modda konuşurken metin yazarken fark etmediğiniz doldurma kelimeleri ("şey", "yani", "aslında") de ortaya çıkar; AI'dan transkriptte bunların sıklığını da not etmesini isteyebilirsiniz. AI'dan sizi spesifik olarak yapı konusunda kesmesini isteyin: "Cevabım STAR'ı takip etmiyorsa beni durdur ve hangi kısmı atladığımı söyle." Bu tek talimat en yaygın hatayı yakalar: "ekip" ne yaptıysa onu anlatan, kendisinin ne yaptığını anlatmayan adaylar — bu da mülakatçının gerçek katkınızın ne olduğunu anlamasını imkânsız hale getirir.

Bir haftada dağınık STAR cevaplarını düzelten adayların arkasındaki yaygın örüntü şöyle işler: birinci gün, AI transkripti her cevabın net bir sonuç belirtmeden dört ila altı dakika sürdüğünü gösterir. Beşinci güne gelindiğinde, aynı beş hikaye sorunun farklı ifadelerine karşı tekrar tekrar çalıştırıldıktan sonra her cevap, sonuca bağlı bir sayıyla birlikte 90 saniyeye iner. Çözüm yeni hikayeler değil — aynı hikayeleri, geriye yalnızca STAR yapısı kalana kadar kısaltmak.

## Sistem tasarımı ve kodlama mülakatları sesli modda nasıl prova edilir?

Sistem tasarımı için soruyu sesli anlatın ve AI'ın size geri soru sormasını sağlayın; tıpkı gerçek bir mülakatçının kutular çizmeye başlamadan önce ölçek, tutarlılık gereksinimleri ve trade-off'lar için sizi yoklaması gibi. Kodlama turları için bir şey yazmadan önce yaklaşımınızı sesli anlatın — çoğu teknik mülakat, akıl yürütme sürecinizi nihai çözüm kadar ağırlıklandırır ve zaman baskısı altında sesli düşünmeyi çalışmanın tek yolu sesli mod.

| Asistan | Sesli mod erişimi | Sesli modda kullanılan model | En iyi olduğu alan |
|---|---|---|---|
| ChatGPT (GPT-Live) | Ücretsiz: günlük sınırlı kullanım; Plus/Pro: genişletilmiş veya sınırsız | GPT-Live | Hızlı soru üretimi, doğal karşılıklı akış |
| Claude | Ücretsiz: sadece Haiku; ücretli katmanlar: Sonnet ve Opus | Haiku (ücretsiz) / Sonnet, Opus (ücretli) | STAR hikayelerinde uydurulan detayları yakalamak |
| Gemini Live | Ücretsiz, sınırsız sesli konuşma | Gemini | Uzun bağlam — hikaye havuzunuzu birden fazla iş ilanına karşı aynı anda karşılaştırma |

## Mülakat provası için hangi AI daha iyi: ChatGPT mi Claude mı Gemini mi?

Tek bir kazanan yok — neyi çalıştığınıza bağlı. ChatGPT'nin Advanced Voice'u karşılıklı konuşmada genelde en doğal sesli olarak değerlendiriliyor, bu da onu hacim için iyi yapıyor: çok sayıda soruyu hızlıca geçmek. Claude, STAR hikayenizde olmayan detayları uydurmama konusunda daha temkinli; bu yüzden söylediklerinizi özetlemesini istediğinizde özet, süslemek yerine gerçekte anlattığınıza daha yakın kalıyor. Gemini Live'ın avantajı daha büyük bağlam penceresi — tek bir oturumda cevap havuzunuzu birkaç iş ilanına karşı karşılaştırıyorsanız önemli — ve sesli modu kullanım sınırı olmadan ücretsiz.

Tek bir tanesini seçecekseniz en zayıf olduğunuz mülakat türüne göre seçin: davranışsal hacim için ChatGPT, hikaye doğruluğunu daha sıkı kontrol için Claude, aynı anda birden fazla pozisyona hazırlanıyorsanız Gemini. Üçünü birden kullanmak da bir seçenek — aynı davranışsal soruyu üç asistana sorup geri bildirimlerini karşılaştırmak, tek bir modelin körlüklerine takılmamanızı sağlar ve hangi eleştirinin tekrar ettiğini, hangisinin tek bir modele özgü olduğunu görmenizi kolaylaştırır.

## Aşırı senaryolaştırılmış cevaplardan nasıl kaçınılır?

"Dağınıklığın" karşı ucundaki hata modu, sabit bir metni ezberleyip okunmuş gibi konuşmak. AI'dan aynı davranışsal soruyu bir oturum boyunca üç farklı şekilde sormasını isteyin ("Bir iş arkadaşınla yaşadığın bir çatışmayı anlat" ile "Bir takım arkadaşının yaklaşımına katılmadığın bir anı anlat" gibi) ve her birini notlarınıza bakmadan, hazırlıksız cevaplayın. Cevabınız her seferinde kelime seçimi olarak fark edilir şekilde değişiyor ama aynı STAR yapısını ve aynı sonucu koruyorsa, bir senaryoyu ezberlemek yerine hikayeyi içselleştirmişsiniz demektir — asıl hedef bu, birebir kusursuz bir sunum değil.

Haftada iki ila üç kısa prova oturumu, tek bir uzun maraton oturumdan daha etkili sonuç veriyor; çünkü aradaki gün, bir önceki turda AI'ın işaretlediği zayıf noktayı bilinçli olarak düzeltme fırsatı veriyor. Gerçek mülakat haftasına yaklaştıkça sıklığı artırıp süreyi gerçek formata (30-45 veya 45-60 dakika) sabitlemek, son bir iki provanın gerçek gün provasına en yakın hâli olmasını sağlıyor.

Mülakat provasının teknik tarafı için [sistem tasarımı mülakatı rehberimize](/tr/posts/sistem-tasarimi-mulakati) ve iş arama sürecinin ortasındaysanız [yaygın CV ve ATS hatalarından kaçınma rehberimize](/tr/posts/ai-ile-cv-yazarken-6-hata-ats) bakabilirsiniz. Daha fazla kariyer tavsiyesi için [Kariyer & Üretkenlik kategorimize](/tr/category/kariyer-uretkenlik) göz atın.

Kaynaklar: [OpenAI'ın ChatGPT sesli mod dokümantasyonu](https://help.openai.com/en/articles/6825453-chatgpt-release-notes) ve [Google'ın Gemini Live genel bakışı](https://gemini.google.com/).

## Sıkça Sorulan Sorular

### AI sesli modla ücretsiz mülakat provası yapabilir miyim?

Evet. Gemini Live ücretsiz ve sınırsız sesli konuşma sunuyor. ChatGPT'nin ücretsiz katmanı, kısıtlanmadan veya metne dönmeden önce sınırlı bir günlük sesli kullanım içeriyor. Claude'un ücretsiz katmanı sesli mod veriyor ama yalnızca en küçük modeli Haiku üzerinden.

### AI ile mülakat provası ne kadar sürmeli?

Gerçek formatı taklit edin: davranışsal tur için 30-45 dakika, teknik veya sistem tasarımı ön elemesi için 45-60 dakika. Süre sınırını açılış promptunuzda belirtin; çünkü serbest bırakılan bir AI mülakatçı sınırsız devam eder.

### AI gerçekten faydalı geri bildirim mi veriyor, yoksa sadece cesaretlendirme mi?

Sadece açıkça isterseniz. Varsayılan davranışta bırakıldığında çoğu model genel cesaretlendirmeyle cevap verir. Baştan, her cevap için bir somut güçlü ve bir somut zayıf yön belirtmesini ve cevabınız STAR yapısını takip etmediğinde bunu işaretlemesini talimatlandırın.

### Mülakat cevaplarımı özetlerken hangi AI daha doğru?

Claude genellikle söylemediğiniz detayları uydurmama konusunda daha temkinli; bu da birden fazla prova turunda hikayenizin gerçeklerle tutarlı kalıp kalmadığını AI'ın özetiyle kontrol ediyorsanız önemli.
