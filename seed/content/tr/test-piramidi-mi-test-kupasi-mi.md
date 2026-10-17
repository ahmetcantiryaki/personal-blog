---
title: "Test Piramidi mi, Test Kupası mı: 2026'da Hangisi?"
slug: "test-piramidi-mi-test-kupasi-mi"
translationKey: "testing-pyramid-vs-testing-trophy-2026"
locale: "tr"
excerpt: "Kısa cevap: Mimariye bağlı. React uygulamasında Test Kupası, çok servisli backend'de Honeycomb, ağır mantıklı monolitte klasik Piramit daha iyi sonuç verir."
category: "software-engineering"
tags: ["testing", "unit-testing", "best-practices", "clean-code"]
publishedAt: "2026-10-17"
seoTitle: "Test Piramidi mi, Test Kupası mı: 2026 Karşılaştırması"
seoDescription: "Test Piramidi ve Test Kupası arasındaki fark ne? React SPA, mikroservis ve monolit için hangi test şeklinin daha iyi sonuç verdiğini örneklerle anlatıyoruz."
---

Kısa cevap: Tek doğru şekil yok, mimarinize bağlı. Bir React SPA için Test Kupası (çoğunlukla entegrasyon testi) daha yüksek güven/maliyet oranı verir; birbiriyle gRPC üzerinden konuşan 12 servisli bir backend için Spotify'ın Honeycomb modeli daha mantıklı; ağır iş mantığı olan bir monolitte ise klasik Test Piramidi hâlâ en iyi seçim.

İki model de aynı soruna farklı cevap veriyor: testleriniz hızlı mı çalışsın, yoksa gerçek entegrasyonları mı doğrulasın? Bu yazıda farkı, hangi mimaride hangisinin işe yaradığını ve 2026'nın test araçlarıyla bunu nasıl kuracağınızı anlatıyoruz.

## Test Piramidi Nedir?

Test Piramidi, testleri üç katmanda görselleştirir: tabanda çok sayıda hızlı ve ucuz birim (unit) testi, ortada daha az entegrasyon testi, tepede ise çok az sayıda uçtan uca (E2E) test. Mantık basit: birim testler milisaniyeler içinde çalışır ve izole bir fonksiyonu doğrular; E2E testler tüm sistemi gerçek bir tarayıcıda çalıştırdığı için yavaş, pahalı ve kırılgandır. Piramit, test sayısını hıza göre ters orantılı dağıtır.

Bu model özellikle ağır iş mantığı olan bir monolitte iyi çalışır: fiyatlandırma kuralları, vergi hesaplamaları veya durum makineleri gibi karmaşık fonksiyonları, aralarındaki entegrasyonu test etmeden izole biçimde doğrulamak hem hızlı hem güvenilirdir.

## Test Kupası Nedir?

Test Kupası, Kent C. Dodds'ın "yeterince test yaz, çoğu entegrasyon testi olsun" ilkesiyle önerdiği bir model. Şekil bir kupaya benzer: altta az sayıda birim testi, ortada (kupanın gövdesinde) çok sayıda entegrasyon testi, üstte az sayıda E2E test, en üstte de statik analiz (TypeScript, ESLint) katmanı.

Dodds'ın temel argümanı şu: izole bir bileşenin birim testi geçebilir ama bileşenler birleştiğinde gerçek entegrasyon bozuk olabilir. Bir formun her alanını tek tek test etmek, formun gerçekten gönderildiğini test etmekten daha az güven verir. Bu yüzden Test Kupası, özellikle frontend uygulamalarında en iyi güven/maliyet oranını entegrasyon testlerinde bulur.

## Test Piramidi mi, Test Kupası mı: Hangisini Ne Zaman Kullanmalısın?

Karar mimariye göre değişir, kişisel tercihe göre değil. Bir React SPA, iyi test edilmiş bir REST backend'e istek atıyorsa Test Kupası kazanır: kullanıcı davranışını simüle eden entegrasyon testleri, gerçek kullanım senaryolarını birim testlerden daha iyi yakalar. Ağır domain mantığı olan bir monolitte ise klasik Piramit kazanır: iş kurallarını izole test etmek hem daha hızlı hem daha az kırılgandır.

| Mimari | Önerilen Model | Neden |
|---|---|---|
| React/Vue SPA + REST backend | Test Kupası | Entegrasyon testleri gerçek kullanıcı akışını yakalar |
| 10+ servisli mikroservis (gRPC) | Honeycomb (Spotify) | Servisler arası sözleşmeler entegrasyonda test edilir |
| Ağır iş mantıklı monolit | Klasik Piramit | İzole birim testleri iş kurallarını hızlı doğrular |
| Kütüphane / SDK | Klasik Piramit | Dış dünyaya açık her fonksiyon ayrı ayrı garanti ister |

## Honeycomb Modeli Mikroservisler İçin Neden Daha Mantıklı?

Spotify'ın yayınladığı Honeycomb modeli, mikroservis mimarilerinde ne Piramit ne Kupa'nın tam uymadığı gözleminden doğdu. On iki servisin birbirine gRPC ile bağlı olduğu bir sistemde asıl risk, tek bir servisin içindeki mantık değil, servisler arasındaki sözleşmenin (contract) bozulmasıdır. Honeycomb bu yüzden ağırlığı entegrasyon testlerine kaydırır ama Test Kupası'ndan farklı olarak servisler arası sözleşme testlerini (consumer-driven contract testing) ayrı bir katman olarak ele alır. [Tüketici güdümlü sözleşme testi](/tr/posts/tuketici-gudumlu-sozlesme-testi) tam olarak bu boşluğu dolduruyor: her servis, kendisini çağıran tarafın beklentisini bağımsız olarak doğrular.

## 2026'da Hangi Araçlar Bu Modelleri Destekliyor?

React Testing Library, 2026 itibarıyla React bileşenlerinde fiili birim/entegrasyon test standardı; bileşeni kullanıcı gibi test etmeyi (DOM'u sorgulayarak, implementasyon detaylarını değil) zorunlu kılan API'siyle Test Kupası'nın felsefesini doğrudan destekliyor. E2E tarafında Playwright ve Cypress pazara hâkim; Vitest ise hızlı birim testleri için Jest'in yerini büyük ölçüde aldı.

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from './LoginForm'

test('kullanıcı doğru bilgiyle giriş yapabilir', async () => {
  render(<LoginForm onSubmit={vi.fn()} />)
  await userEvent.type(screen.getByLabelText('E-posta'), 'ayse@ornek.com')
  await userEvent.type(screen.getByLabelText('Şifre'), 'guvenli123')
  await userEvent.click(screen.getByRole('button', { name: 'Giriş Yap' }))
  expect(screen.getByText('Hoş geldin, Ayşe')).toBeInTheDocument()
})
```

Bu test, `LoginForm`'un iç implementasyonunu değil, kullanıcının gördüğü davranışı doğruluyor — Test Kupası'nın "implementasyon detayına değil, davranışa test yaz" ilkesinin birebir karşılığı. [AI ajanlarını prodüksiyon öncesi test etme](/tr/posts/ai-ajanlari-produksiyon-oncesi-test) rehberinde de aynı ilke geçerli: ajanın iç adımlarını değil, nihai çıktısını doğrulamak daha dayanıklı testler üretiyor.

## CI Süresi Açısından Fark Gerçekten Büyük mü?

Evet, ölçülebilir bir fark var. Tipik bir orta ölçekli React projesinde 500 birim testi genellikle 10-15 saniyede biter; aynı kapsamı 150 entegrasyon testiyle React Testing Library ve bir mock sunucu (MSW gibi) kullanarak sağlamak 40-70 saniye sürer, ama üretimde yakalanan "entegrasyon kırıldı" tipi hata sayısını belirgin şekilde düşürür. E2E testler ise Playwright ile paralel çalıştırıldığında bile genellikle 3-8 dakikayı bulur; bu yüzden hem Piramit hem Kupa, E2E katmanını bilerek en ince tutar.

Buradaki asıl maliyet, test süresinden çok bakım yüküdür. Implementasyon detaylarını test eden birim testleri, bir refactor sırasında onlarca testin aynı anda kırılmasına yol açar; bu, testin kendisi hâlâ "doğru" olsa da geliştiriciyi yavaşlatır. Entegrasyon testleri implementasyon yerine davranışı doğruladığı için refactor sırasında daha az kırılır — bu da Test Kupası'nın pratikte düşük bakım maliyeti sunmasının asıl nedeni.

Kırılganlık (flakiness) açısından da fark var: gerçek bir tarayıcıya bağımlı olduğu için E2E testler zaman zaman gerçek bir hata olmadan başarısız olur; iyi yönetilen bir Playwright paketinde bu oran genellikle %1-3 arasında kalırken, disiplinsiz bir pakette %10'u geçebilir. Entegrasyon testleri gerçek bir tarayıcı yerine bellek içinde bir DOM kullandığı için kırılganlık oranı tipik olarak E2E'nin onda biri kadardır; bu da hem Piramit'in hem Kupa'nın E2E katmanını bilerek ince tutma kararını bir kez daha haklı çıkarıyor.

## Açıkçası Hangi Model Daha Çok Kazanıyor?

Kişisel görüşüm: ekiplerin çoğu, mimarisine bakmadan "Piramit her zaman doğrudur" dogmasıyla büyüdüğü için gereğinden fazla birim testi yazıyor ve gerçek entegrasyon hatalarını üretimde buluyor. Test Kupası'nın asıl değeri yeni bir piramit icat etmesi değil, "şekli mimarine göre seç" demesi. Aynı pragmatizmi [özellik tabanlı testte](/tr/posts/ozellik-tabanli-test-hata-bulma) de görüyoruz: rastgele girdilerle aklınıza gelmeyen kenar durumlarını bulmak, hangi şekli seçerseniz seçin test paketinizi güçlendiriyor.

Asıl hata, şekli alışkanlıkla değil mimariyle seçmemek. [Unit test yazma rehberimizde](/tr/posts/unit-test-nasil-yazilir) anlattığımız gibi, bir birim testinin değeri test sayısından değil neyi gerçekten doğruladığından gelir; bu ilke Piramit'te de Kupa'da da aynı kalıyor. Ekip büyüdükçe bu kararı dokümante etmek de önemli: yeni katılan bir geliştirici, "neden bu kadar az birim testi var" sorusunu sorduğunda cevap mimari tercihte, alışkanlıkta değil olmalı.

Bu kararı bir kez verip unutmak da yanlış: ekip büyüdüğünde, mimari değiştiğinde veya yeni bir servis eklendiğinde test şeklini yeniden değerlendirmek gerekir. Statik bir "biz hep Piramit kullanırız" kuralı, mimari gerçeklik değiştikçe gereğinden fazla bakım maliyeti üretmeye başlar.

## Sıkça Sorulan Sorular

### Test Piramidi ile Test Kupası arasındaki temel fark ne?

Piramit, testleri hız sırasına göre dağıtır: çoğu birim testi, azı entegrasyon, en azı E2E. Kupa ise ağırlığı entegrasyon testlerine kaydırır çünkü izole bir birim testinin geçmesi, gerçek entegrasyonun çalıştığını garanti etmez; Kent C. Dodds bu modeli özellikle frontend uygulamaları için önerdi.

### Hangi mimaride Test Kupası tercih edilmeli?

React veya Vue gibi bir SPA, iyi test edilmiş bir REST ya da GraphQL backend'ine bağlanıyorsa Test Kupası tercih edilmeli. Çünkü asıl risk tek bir bileşenin mantığında değil, bileşenler ve API arasındaki entegrasyonda; entegrasyon testleri bu riski doğrudan kapsıyor.

### Mikroservislerde hangi model kullanılmalı?

On veya daha fazla servisin birbirine gRPC veya REST ile bağlı olduğu sistemlerde Spotify'ın Honeycomb modeli daha uygun. Bu model, entegrasyon testlerinin yanına tüketici güdümlü sözleşme testlerini ekleyerek servisler arası sözleşme kırılmalarını erken yakalıyor.

### React Testing Library neden Test Kupası felsefesine uyuyor?

React Testing Library, bileşenleri implementasyon detaylarıyla değil kullanıcının gördüğü DOM çıktısıyla test etmeyi zorunlu kılan bir API sunuyor. Bu, Test Kupası'nın "davranışa test yaz, implementasyona değil" ilkesiyle birebir örtüşüyor ve 2026 itibarıyla React ekosisteminde fiili standart hâline geldi.
