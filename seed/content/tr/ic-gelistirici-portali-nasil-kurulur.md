---
title: "İç Geliştirici Portalı Nasıl Kurulur?"
slug: "ic-gelistirici-portali-nasil-kurulur"
translationKey: "build-internal-developer-portal-2026"
locale: "tr"
excerpt: "İç geliştirici portalı, servis kataloğu ve scorecard'larla dağınık bilgiyi tek yere toplar. Backstage temel, Cortex standart takibi için üstüne eklenir."
category: "devops-cloud"
tags: ["platform-engineering", "devops", "developer-experience", "automation"]
publishedAt: "2026-09-08"
seoTitle: "İç Geliştirici Portalı Nasıl Kurulur?"
seoDescription: "İç geliştirici portalı, servis kataloğu ve scorecard'larla dağınık bilgiyi tek yere toplar. Backstage temel, Cortex veya OpsLevel üstüne katman olarak eklenir."
---

Kısa cevap: Bir iç geliştirici portalı kurmak için açık kaynaklı Backstage'i servis kataloğu ve şablon (golden path) katmanı olarak, üzerine de Cortex veya OpsLevel gibi bir scorecard aracını standartları ölçmek için ekleyin — ve bunu 20 kişilik bir platform ekibi değil, iki-üç kişilik bir çekirdek ekiple kademeli olarak yapın.

## İç geliştirici portalı (IDP) hangi sorunu çözer?

Bir IDP, bir ekibin büyümesiyle birlikte artan bilişsel yükü ve kabile bilgisini (tribal knowledge) azaltmak için var. On kişilik bir ekipte "bu servisi kim sahipleniyor, hangi ortamda çalışıyor, nasıl yeni bir servis açarım" soruları Slack'te sorulup cevaplanabilir; elli kişilik bir mühendislik organizasyonunda bu sorular günde onlarca kez sorulur ve her seferinde birinin zamanını çalar.

2026 platform mühendisliği raporlarına göre olgun bir IDP altı temel yeteneği kapsıyor: servis kataloğu, golden path'ler (şablon tabanlı servis oluşturma), self-servis provizyon, scorecard'lar, iş akışı otomasyonu ve governance/standart uygulama. Bu altısını tek bir araçtan beklemek yerine, hangisinin sizin organizasyonunuzda en çok acıyı dindireceğini önceliklendirmek gerekiyor.

## Backstage mi, yönetilen bir araç mı (Port, Cortex)?

Kısa cevap: açık kaynak esnekliği ve sıfır lisans maliyeti istiyorsanız Backstage; hızlı kurulum ve bakım yükü almadan başlamak istiyorsanız Port veya Cortex gibi yönetilen bir SaaS aracı.

| Araç | Model | Güçlü yönü | Zayıf yönü |
|---|---|---|---|
| Backstage | Açık kaynak, kendi barındırma | Servis kataloğu + Scaffolder ile golden path şablonları | Scorecard içermiyor, bakım yükü sizde |
| Port | SaaS, no-code | Hızlı kurulum, 15 kullanıcıya kadar ücretsiz katman | Kişi + varlık başına ücretlendirme, özelleştirme sınırlı |
| Cortex | SaaS, scorecard-öncelikli | Standart ve sahiplik takibinde en güçlüsü | En az özelleştirilebilir, kataloğu Backstage kadar esnek değil |

Spotify'ın açık kaynak çıkardığı Backstage, bu kategoriyi tanımlayan araç. Scaffolder eklentisiyle şablon tabanlı, korkuluklu (guardrail'li) servis oluşturma sunuyor, ama kendi başına scorecard içermiyor — yani "bu servis production'a hazır mı" gibi bir puanlama görmek istiyorsanız ayrı bir araca ihtiyacınız var. Çoğu olgun IDP kurulumu tam olarak bu nedenle Backstage'i bir scorecard platformuyla (Cortex veya OpsLevel) birleştiriyor: biri kataloğu, diğeri standardı cevaplıyor.

## Servis kataloğu ve golden path'lerle nasıl başlanır?

Servis kataloğu, "hangi servisler var, kim sahipleniyor, hangi ortamda çalışıyor" sorusuna cevap veren merkezi bir envanterdir. Backstage'de her servis bir `catalog-info.yaml` dosyasıyla tanımlanır:

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: odeme-servisi
  description: Ödeme işlemlerini yöneten servis
  annotations:
    github.com/project-slug: sirket/odeme-servisi
spec:
  type: service
  lifecycle: production
  owner: odeme-ekibi
  system: e-ticaret
```

Golden path ise "yeni bir servis nasıl açılır" sorusuna standart bir cevap verir — Scaffolder şablonu, geliştiriciye birkaç soru sorar (servis adı, dil, hangi takım) ve arkasında repo oluşturma, CI/CD pipeline bağlama, temel izleme kurulumu gibi adımları otomatik yapar. Bu, "her ekip kendi CI dosyasını sıfırdan yazsın" yaklaşımının yerini alıyor; yeni bir servis dakikalar içinde, şirketin standartlarına uygun biçimde ayağa kalkıyor.

## Scorecard'lar neyi ölçer, Backstage'de neden yok?

Scorecard, bir servisin üretim hazırlığı, güvenlik duruşu veya operasyonel olgunluk gibi standartlara göre nasıl puanlandığını gösteren bir tablo. "Bu servisin health check endpoint'i var mı, on-call rotasyonu tanımlı mı, son 90 günde bir güvenlik taraması yapılmış mı" gibi kontrolleri otomatik puanlar ve ekiplere görünür kılar.

Cortex bu kategoride en güçlü araç — pozisyonlanması tamamen "en iyi uygulamaları ve golden path'leri standardize et" üzerine kurulu, ama bunun bedeli daha az özelleştirilebilir bir katalog. Backstage'in scorecard içermemesi bilinçli bir tasarım: kataloğu ve şablonlamayı çözüyor, standart takibini ayrı bir araca bırakıyor. Bu yüzden üretim IDP yığınlarının çoğu, bir portalı (Backstage) bir scorecard platformuyla (Cortex veya OpsLevel) katmanlıyor — ikisi farklı sorulara cevap veriyor.

## 20 kişilik bir platform ekibi olmadan nasıl kademeli kurulur?

Kısa cevap: tüm altı yeteneği aynı anda kurmaya çalışmayın, en çok acı yaratan bir veya iki yeteneği ilk üç ayda çözün. Tipik bir kademeli yol haritası şöyle işliyor:

1. **Ay 1-2:** Sadece servis kataloğunu kurun — mevcut servisleri `catalog-info.yaml` dosyalarıyla envantere alın. Bu aşamada tek başına "kim neyi sahipleniyor" sorusunu çözmek büyük bir kazanım.
2. **Ay 3-4:** En sık açılan servis türü için bir golden path şablonu yazın (ör. "yeni bir Node.js mikroservisi"). Tek bir şablonu iyi yapmak, on tane yarım şablondan daha değerli.
3. **Ay 5-6:** Bir veya iki kritik scorecard kontrolü ekleyin (health check var mı, on-call tanımlı mı). Hepsini birden değil, en acil ikisini.

İki-üç kişilik bir çekirdek platform ekibi bu sırayla ilerlerse, altı ayın sonunda hem kataloğu hem golden path'i hem de temel scorecard'ı olan çalışan bir IDP'ye sahip olursunuz — 20 kişilik bir ekip kurmadan.

Bu yaklaşımın asıl faydası, her aşamanın kendi başına değer üretmesi. Sadece kataloğu kurup dursanız bile "kim neyi sahipleniyor" sorusu çözülmüş olur; golden path eklemeden önce vazgeçseniz bile hiçbir şey boşa gitmemiş olur. Bu, "önce her şeyi tasarla, sonra tek seferde kur" yaklaşımının tam tersi — ve platform mühendisliğinde başarısız olan projelerin çoğu, tam olarak bu ters yaklaşımı seçtiği için tıkanıyor.

Ekibin ilk altı aydan sonra yapması gereken de belli: hangi golden path'in en çok kullanıldığını ve hangi scorecard kontrolünün en çok ihlal edildiğini ölçüp, bir sonraki üç aylık döngüde onu önceliklendirmek. IDP'yi bir kerelik proje değil, sürekli iyileştirilen bir iç ürün olarak ele almak, altı aylık kurulumun kalıcı bir alışkanlığa dönüşmesini sağlıyor. Bu bakış açısı, IDP'nin "platform ekibinin projesi" olmaktan çıkıp tüm mühendislik organizasyonunun paylaştığı bir araca dönüşmesini de kolaylaştırıyor — ve bu paylaşılan sahiplenme hissi, aracı gerçekten kullanılır kılan şeyin kendisi — kimse zorunlu olmadığı halde başvurduğu bir araç, başarılı bir IDP'nin en net göstergesidir.

Platform mühendisliğinin genel çerçevesini merak ediyorsanız [platform mühendisliği nedir yazımıza](/tr/posts/platform-engineering-nedir) bakabilirsiniz. Bulut maliyetlerini kontrol altında tutmak için [FinOps rehberimiz](/tr/posts/finops-bulut-maliyeti-dusurme) faydalı olabilir. Sıfırdan bir CI/CD pipeline kurmak isteyenler [bu rehbere](/tr/posts/cicd-pipeline-nasil-kurulur) bakabilir; Kubernetes maliyetini düşürmek isteyenler [Kubernetes maliyet optimizasyonu yazımızı](/tr/posts/kubernetes-maliyet-optimizasyonu) inceleyebilir. AI ajanlarının nöbet (on-call) süreçlerine nasıl dahil edilebileceğini merak ediyorsanız [bu yazımıza](/tr/posts/ai-ajanlari-nobeti-devralabilir-mi) göz atabilirsiniz. Daha fazla DevOps içeriği için [DevOps ve Bulut kategorimize](/tr/category/devops-bulut) uğrayabilirsiniz.

Kaynak olarak [Backstage'in resmi dokümantasyonunu](https://backstage.io/docs) ve araç kıyaslamaları için [SquareOps'un Backstage vs Port vs Cortex karşılaştırmasını](https://squareops.com/blog/backstage-vs-port-vs-cortex/) inceleyebilirsiniz.

## Sıkça Sorulan Sorular

### İç geliştirici portalı ile platform mühendisliği aynı şey mi?

Hayır. Platform mühendisliği daha geniş bir disiplin — altyapı, self-servis araçlar ve süreçleri kapsar. İç geliştirici portalı, bu disiplinin geliştiricilere görünen yüzü: servis kataloğu, şablonlar ve scorecard'ları tek bir arayüzde sunan araç katmanı.

### Backstage kurmak için ne kadar mühendislik kaynağı gerekir?

Bir servis kataloğunu ayağa kaldırmak için iki-üç kişilik bir çekirdek ekip yeterli; ilk üç ayda tek bir golden path şablonu ve temel katalog kurmak gerçekçi bir hedef. Backstage'i tam kapasiteyle (çoklu plugin, özel entegrasyonlar) işletmek daha fazla kaynak ister, ama bu aşamaya kademeli olarak ulaşabilirsiniz.

### Scorecard'a hemen mi ihtiyacım var, yoksa katalog yeterli mi?

Küçük ve orta ölçekli ekiplerde sadece bir servis kataloğu bile büyük değer sağlar — "kim neyi sahipleniyor" sorusunu çözer. Scorecard, ekip sayısı arttıkça ve "hangi servisler production standardına uymuyor" sorusu manuel takip edilemez hale geldiğinde öncelik kazanır.

### Port veya Cortex, Backstage'in yerini tamamen alabilir mi?

Kısmen. Port ve Cortex, kurulum ve bakım yükünü azaltan yönetilen alternatifler, ama Backstage'in açık kaynak esnekliği ve topluluk plugin ekosistemi kadar özelleştirilebilir değiller. Çoğu ekip, hızlı başlangıç için yönetilen bir araçla başlayıp, özelleştirme ihtiyacı arttıkça Backstage'e geçmeyi ya da ikisini birlikte kullanmayı tercih ediyor.
