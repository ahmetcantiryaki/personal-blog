---
title: "Vercel Services: Tek Projede Mikroservisler"
slug: "vercel-services-tek-projede-mikroservisler"
translationKey: "vercel-services-multi-framework"
locale: "tr"
excerpt: "Vercel Services artık tek projede Next.js, Go, FastAPI ve Rails'i birlikte çalıştırıyor. Service bindings, container desteği ve atomik deploy'ları inceliyoruz."
category: "devops-cloud"
tags: ["cloud", "containers", "deployment", "docker", "microservices"]
publishedAt: "2026-07-09"
seoTitle: "Vercel Services Nedir? Tek Projede Mikroservis Rehberi"
seoDescription: "Vercel Services artık tek projede Next.js, Go, FastAPI ve Rails'i birlikte çalıştırıyor. Service bindings, container desteği ve atomik deploy'ları inceliyoruz."
---

Vercel, 1 Temmuz 2026'da **Vercel Services**'i açık betaya aldı: artık tek bir Vercel projesi içinde birden fazla framework ve runtime'ı — örneğin bir Next.js ön yüzü, bir Go servisi ve bir FastAPI backend'ini — birlikte tanımlayıp deploy edebiliyorsunuz. Servisler internal ağ üzerinden birbirine bağlanıyor, atomik olarak deploy oluyor ve aynı preview URL'sinde birlikte test ediliyor. Bu, Vercel'i saf bir frontend platformundan tam yığın bir mikroservis platformuna taşıyan en büyük mimari değişikliklerden biri.

Bu yazıda Vercel Services'in nasıl çalıştığını, `vercel.json` üzerinden servisleri nasıl tanımladığınızı, container desteğinin sınırlarını ve bunun ne zaman gerçek bir mikroservis mimarisine, ne zaman tek bir monolit projeye tercih edilmesi gerektiğini ele alıyoruz.

## Vercel Services nedir, neyi çözüyor

Temmuz 2026'ya kadar Vercel'de "çoklu servis" çalıştırmanın standart yolu, her backend'i ayrı bir proje olarak deploy edip aralarında genel internet üzerinden HTTP çağrıları yapmaktı. Bu, ekstra latency, ayrı preview URL'leri ve senkronize deploy sorunları anlamına geliyordu — frontend'i deploy ettiniz ama backend hâlâ bir önceki sürümdeyse, preview ortamınız yanlış davranıyordu.

Vercel Services bunu tek bir proje kapsamına indiriyor. [Resmi Vercel duyurusuna göre](https://vercel.com/blog/vercel-services-run-full-stack-on-vercel), bir proje artık birden fazla framework ya da runtime'dan servis içerebilir; Vercel routing, build, deploy ve production'da otomatik ölçeklendirmeyi kendisi yönetiyor. Kritik fayda üçe ayrılıyor: **atomik deploy'lar** (frontend ve backend birlikte deploy olur, birlikte rollback yapılır), **paylaşılan preview deploy'lar** (bir PR'daki değişikliğin tüm servisleri nasıl etkilediğini tek bir URL'de görürsünüz) ve **dahili servis iletişimi** (servisler genel internete çıkmadan birbiriyle konuşur).

## vercel.json ile servis tanımlamak

Servisler `vercel.json` içindeki `services` anahtarı altında tanımlanıyor. Her servis varsayılan olarak internal'dır — dışarıya açmak istemediğiniz sürece internetten erişilemez.

```json
{
  "services": {
    "web": {
      "directory": "apps/web",
      "framework": "nextjs"
    },
    "inventory": {
      "directory": "apps/inventory",
      "framework": "fastapi"
    },
    "pricing": {
      "directory": "apps/pricing",
      "runtime": "container"
    }
  }
}
```

`pricing` servisindeki `"runtime": "container"` satırı önemli: Vercel, servis paketinizin bir Docker image olarak build edilmesini istiyorsanız bunu destekliyor. [Vercel'in resmi dokümantasyonuna göre](https://vercel.com/docs/services), OCI uyumlu container image'lar Vercel Container Registry'de (VCR) saklanıyor ve otomatik ölçeklenen bir Vercel Function olarak sunuluyor — yani mevcut container'larınızı sıfırdan yeniden yazmadan platforma taşıyabiliyorsunuz.

## Service Bindings: dahili iletişim ve mevcut sınırlar

Servisler arası iletişim **service bindings** ile kuruluyor: bir servise, başka bir servisin internal URL'ini içeren bir ortam değişkeni enjekte ediliyor. Örneğin `orders` servisi `inventory` servisine bir binding tanımlarsa, `orders` içindeki JavaScript kodu `process.env.INVENTORY_URL` üzerinden `inventory`'yi genel internete hiç çıkmadan çağırabiliyor.

Burada bir sınır var: [Vercel'in service bindings dokümantasyonuna göre](https://vercel.com/docs/services/bindings), binding'ler henüz Go veya Rust runtime'ı kullanan servisler için desteklenmiyor. Yani bir Go servisiniz varsa, ona diğer servislerden internal binding üzerinden ulaşabilirsiniz ama Go servisinin kendisi başka bir servise binding tanımlayamıyor — bu servisler arası çağrıyı standart HTTP istemcisiyle yapmanız gerekiyor. Bu, dil desteğinin container tarafında runtime desteğinden bir adım geride olduğunu gösteriyor; Temmuz 2026 itibarıyla hâlâ olgunlaşan bir özellik.

## Ne zaman gerçek bir kazanç, ne zaman gereksiz karmaşıklık

Vercel Services, zaten birden fazla dilde/framework'te yazılmış servisleri tek bir deploy birimi altında toplamak isteyen ekipler için net bir kazanç. Bir Next.js frontend'i, bir Python destekli ML servisi ve bir Go ile yazılmış yüksek performanslı API'yi ayrı repo'larda ve ayrı CI hatlarında yönetmek yerine tek projede, tek preview URL'sinde test edebiliyorsunuz. Bu, [mikroservis mi monolit mi kararımızda](/tr/posts/mikroservis-mi-monolit-mi) tartıştığımız "dağıtık sistemin karmaşıklığını ne zaman göze alırsınız" sorusuna Vercel'in verdiği pratik bir cevap: dağıtık kod tabanı, tek deploy disiplini.

Ama tek bir framework'te yazılmış, tek bir ekip tarafından geliştirilen bir uygulamanız varsa, bunu yapay olarak servislere bölmek [Docker en iyi pratiklerinde](/tr/posts/docker-en-iyi-pratikleri) bahsettiğimiz gereksiz operasyonel yükün aynısını üretir. Vercel Services bir mimari zorunluluk değil, zaten var olan çoklu-servis karmaşıklığını yönetmenin bir yolu.

Burada gözden kaçırılmaması gereken bir nokta daha var: servis sayısı arttıkça `vercel.json` dosyasının kendisi de bir bakım yüküne dönüşüyor. Her yeni servis, kendi build komutunu, kendi ortam değişkenlerini ve kendi binding tanımlarını taşıyor; beş-altı servisi geçtiğinizde bu dosyayı elle senkron tutmak, ayrı repo'ları senkron tutmaktan çok daha kolay olsa da sıfır maliyetli değil. Ekipler genelde bu noktada bir "servis şablonu" (scaffold script'i ya da paylaşılan bir taban `vercel.json` parçası) oluşturarak yeni servis eklemeyi standartlaştırıyor.

| Kriter | Tek proje, çoklu framework (Vercel Services) | Ayrı projeler + genel HTTP |
|---|---|---|
| Deploy senkronizasyonu | Atomik, birlikte rollback | Manuel koordinasyon gerekir |
| Preview ortamı | Tüm servisler tek URL'de | Her servis ayrı preview |
| Servisler arası çağrı | Internal ağ, genel internete çıkmaz | Genel internet üzerinden HTTP |
| Go/Rust binding desteği | Henüz yok (Temmuz 2026) | Zaten HTTP kullanıldığı için sorun değil |
| Container (Docker) desteği | Var, VCR üzerinden | Framework'e bağlı |
| Uygun senaryo | Çoklu dil/framework, tek ekip | Bağımsız ekipler, ayrı release döngüleri |

## Container desteği ve dağıtım hızı

Container desteği özellikle mevcut Docker tabanlı servisleri Vercel'e taşımak isteyenler için pratik bir köprü. Image'ınızı build edip VCR'a gönderdiğinizde, Vercel bunu otomatik ölçeklenen bir function gibi sunuyor — yani [kesintisiz deployment yazımızda](/tr/posts/kesintisiz-deployment) anlattığımız sıfır kesintili geçiş prensipleri burada da geçerli: atomik deploy, anında rollback ve trafiğin kademeli kaydırılması aynı güvenceyle çalışıyor.

Açıkçası bu özelliğin en güçlü yanı teknik değil, organizasyonel: ekipler artık "backend'imiz için ayrı bir bulut sağlayıcıya mı geçelim" sorusunu sormadan Python veya Go yazabiliyor. Daha önce bu tür bir ihtiyaç genelde AWS Fargate ya da Google Cloud Run gibi ayrı bir container platformuna geçmek anlamına geliyordu; şimdi aynı proje, aynı deploy hattı, aynı gözlemlenebilirlik araç setiyle devam edebiliyorsunuz. Vercel'i yalnızca Next.js platformu olarak görenler için bu, [Edge Fonksiyonları ve Render rehberimizde](/tr/posts/edge-fonksiyonlari-render-rehberi) işlediğimiz render/edge stratejisi tartışmasının doğal bir devamı — platform artık render katmanının ötesine, tam backend mimarisine uzanıyor.

Daha fazla altyapı ve deployment yazısı için [DevOps & Bulut kategorisine](/tr/category/devops-bulut) göz atabilirsiniz.

## Sıkça Sorulan Sorular

### Vercel Services production'da kullanıma hazır mı?

Temmuz 2026 itibarıyla özellik açık beta aşamasında. Temel akışlar (routing, atomik deploy, internal iletişim) çalışıyor ama Go/Rust binding desteği gibi bazı parçalar hâlâ olgunlaşıyor; kritik production yükleri için Vercel'in resmi dokümantasyonundaki güncel kısıtlamaları kontrol etmeniz önerilir.

### Vercel Services, Kubernetes'in yerini alır mı?

Hayır, farklı bir ölçek problemi çözüyor. Vercel Services, az sayıda servisi (genellikle bir frontend artı birkaç backend) tek bir proje altında basitçe yönetmek isteyen ekipler için tasarlandı. Onlarca mikroservisi orkestre eden, kendi ölçekleme ve service mesh ihtiyaçları olan sistemler için Kubernetes hâlâ daha uygun bir araç.

### Servisler arası internal iletişim güvenli mi?

Evet, binding üzerinden yapılan çağrılar genel internete hiç çıkmıyor; bu hem gecikmeyi azaltıyor hem de saldırı yüzeyini daraltıyor. Ancak bir servisi kasıtlı olarak dışarıya açmadığınız sürece varsayılan davranışın internal olduğunu unutmayın — yanlışlıkla bir servisi public yapmak klasik bir yapılandırma hatası olabilir.

### Mevcut bir Docker Compose projesini doğrudan taşıyabilir miyim?

Kısmen. Her servisinizi `runtime: container` ile ayrı ayrı tanımlamanız ve servisler arası iletişimi Vercel'in binding sistemine uyarlamanız gerekiyor; Docker Compose dosyanızın birebir çalışması garanti değil. Küçük servis sayılarında geçiş genellikle bir günden az sürüyor, ama servisler arası ağ varsayımlarınızı gözden geçirmeniz gerekir.
