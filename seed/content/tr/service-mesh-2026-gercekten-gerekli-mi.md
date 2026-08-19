---
title: "Service Mesh 2026: Gerçekten Gerekli mi?"
slug: "service-mesh-2026-gercekten-gerekli-mi"
translationKey: "service-mesh-2026-do-you-need-it"
locale: "tr"
excerpt: "Kısa cevap: 20'den az servisiniz varsa hayır. Mesh mTLS ve trafik politikası kazandırır ama operasyonel karmaşıklık maliyeti çoğu ekip için kazancını aşıyor."
category: "devops-cloud"
tags: ["kubernetes", "microservices", "gitops", "observability"]
publishedAt: "2026-08-19"
seoTitle: "Service Mesh 2026: Gerçekten Gerekli mi? Karar Rehberi"
seoDescription: "Service mesh ne kazandırır, sidecar mı ambient mi, Gateway API ile örtüşme nerede? 2026'da mesh'e ihtiyacınız olup olmadığını belirleyen karar rehberi."
---

Kısa cevap: 20'den az mikroservisiniz ve dedike bir platform ekibiniz yoksa muhtemelen bir service mesh'e ihtiyacınız yok. Mesh, mTLS, ince taneli trafik yönetimi ve zengin gözlemlenebilirlik kazandırır — ama bu kazanımın maliyeti, çoğu ekip için gerçek fayda kazancını aşıyor.

## Service Mesh Ne Kazandırır?

Bir service mesh, servisler arası (east-west) trafiği uygulama kodundan bağımsız bir altyapı katmanında yönetmenizi sağlar. Üç temel kazanım var: otomatik mTLS ile servisler arası şifreli ve kimlik doğrulamalı iletişim, ince taneli trafik politikası (kanarya dağıtım, devre kesici, yeniden deneme kuralları) ve merkezi gözlemlenebilirlik (her servis çağrısı için otomatik metrik, log ve trace).

Bunların hiçbiri uygulama kodunuzu değiştirmeden gelir — mesh, servisler arasına şeffaf bir proxy katmanı yerleştirerek bunu yapar. Sorun şu ki bu şeffaflık bedava değil: her istek artık bir ya da birkaç ek ağ atlaması geçiyor ve bu atlamaların her biri kendi hata modlarını, sürüm yükseltmelerini ve hata ayıklama karmaşıklığını getiriyor.

## Sidecar mı, Ambient mi: 2026'da Fark Ne?

Kısa cevap: ambient, sidecar'ların pod başına getirdiği kaynak ve operasyon yükünü kaldırır ama L7 işleme için hâlâ ek bir proxy katmanına (waypoint) ihtiyaç duyar. Klasik sidecar modelinde her pod'a bir proxy container'ı enjekte edilir — bu, güçlü izolasyon sağlar ama küme boyutu büyüdükçe bellek ve CPU maliyeti doğrusal olarak artar.

Istio'nun ambient modu bu modeli değiştiriyor: düğüm başına paylaşılan hafif bir L4 proxy (ztunnel) mTLS ve TCP yönlendirmesini üstleniyor, L7 işleme (HTTP yönlendirme, yeniden deneme, devre kesici) ihtiyaç duyulan servisler için ayrı "waypoint" proxy'lerine devrediliyor. 2026 itibarıyla ambient mod üretime hazır kabul ediliyor ve KubeCon Avrupa 2026'da Istio projesi ambient multicluster desteğini beta aşamasına taşıdı.

| Model | Kaynak yükü | Karmaşıklık | Ne zaman uygun |
| --- | --- | --- | --- |
| Sidecar (klasik) | Pod başına yüksek | Yüksek izolasyon, yüksek operasyon yükü | Güçlü per-pod izolasyon şart olduğunda |
| Ambient (ztunnel + waypoint) | Düğüm başına düşük | Orta — L7 için ayrı waypoint yönetimi gerekir | Çoğu 2026 kümesi için varsayılan tercih |
| Mesh yok (sadece Gateway API) | Yok | Düşük | 20'den az servis, basit trafik ihtiyacı |

## Gateway API ile Örtüşme Nerede?

Kısa cevap: Gateway API, kümeye giren (north-south) trafiği standart bir sözlükle yönetir; service mesh ise servisler arası (east-west) trafiği yönetir — ikisi rakip değil, tamamlayıcı. Kubernetes Gateway API, ingress trafiğini tanımlamak için üretici bağımsız bir standart haline geldi ve üç büyük mesh de (Istio, Linkerd, Cilium) bu API'yi destekliyor.

Kafa karışıklığı şurada başlıyor: bazı ekipler sadece north-south trafik yönetimine ihtiyaç duyduğu halde, "Gateway API kullanıyoruz zaten, mesh de ekleyelim" mantığıyla gereksiz bir mesh kurulumuna girişiyor. Linkerd, örneğin, bir Ingress controller değildir — north-south trafiği için Envoy Gateway veya Traefik gibi ayrı bir edge proxy'ye ihtiyaç duyar, kümeye giren trafiği kendisi yönetmez. Gateway API'yi zaten kurduysanız ve ihtiyacınız sadece dışarıdan gelen trafiği yönetmekse, mesh eklemeden önce bu ihtiyacın gerçekten servisler arası trafiği de kapsayıp kapsamadığını sorgulayın.

```yaml
# Sadece north-south trafik yönetimi (mesh gerektirmez)
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: api-route
spec:
  parentRefs:
    - name: api-gateway
  rules:
    - matches:
        - path:
            type: PathPrefix
            value: /api
      backendRefs:
        - name: api-service
          port: 8080
```

## Karmaşıklık Vergisi Ne Kadar Ağır?

Bir mesh kurmak, öğrenme eğrisi, sürüm yükseltme operasyonu ve hata ayıklama zorluğu olmak üzere üç ayrı maliyet ekliyor. mTLS sertifika rotasyonu başarısız olduğunda, waypoint proxy'sinde bir gecikme sıçraması olduğunda ya da bir sürüm yükseltmesi trafik kesintisine yol açtığında, bu artık uygulama ekibinizin değil platform ekibinizin sorunu — ve platform ekibiniz yoksa bu sorun kimsenin sorunu değil, üretim kesintisi demek.

Bu maliyet, [Kubernetes'te sık yapılan hataları ele aldığımız yazıda](/tr/posts/kubernetes-hatalari) bahsettiğimiz "gerekli olmayan karmaşıklığı erken ekleme" tuzağının doğrudan bir örneği. Bir mesh'i "ileride lazım olur" diye bugünden kurmak, bugünkü operasyon yükünü artırırken yarının ölçek sorununu çözmüyor.

## Mesh Yerine Neler Kullanılabilir?

Mesh'in üç temel kazanımının her biri için daha hafif alternatifler var. mTLS için servis mesh yerine bulut sağlayıcınızın yerel ağ şifrelemesi (örneğin VPC içi şifreleme) ya da uygulama seviyesinde mTLS kütüphaneleri yeterli olabilir. Trafik politikası için bir API gateway (Gateway API üzerinden) çoğu senaryoyu karşılar. Gözlemlenebilirlik için ise OpenTelemetry ile uygulama seviyesinde enstrümantasyon, mesh'in otomatik topladığı verinin büyük kısmını mesh olmadan da sağlar — bu konuyu [OpenTelemetry'e başlangıç rehberimizde](/tr/posts/opentelemetry-baslangic-rehberi) detaylı işledik.

Platform mühendisliği bakış açısından bu, [platform engineering'i ele aldığımız yazıda](/tr/posts/platform-engineering-nedir) vurguladığımız "altın yol" (golden path) prensibiyle örtüşüyor: ekiplere karmaşık bir altyapı bileşenini dayatmak yerine, ihtiyaç duydukları belirli yeteneği (şifreleme, yönlendirme, gözlemlenebilirlik) en basit yoldan sağlamak.

## Mesh Kararında Sık Yapılan Hatalar

En sık görülen hata, mesh'i "gelecekte ihtiyacımız olacak" gerekçesiyle bugünden kurmak. Bir mesh, sadece kurulumu değil, sürekli sürüm yükseltmesi, sertifika rotasyonu izleme ve waypoint proxy kapasitesi planlaması gibi devam eden bir işletim yükü de getiriyor — bu yük, servis sayınız 20'nin altındayken kazandığı faydadan daha ağır basıyor.

İkinci sık hata, mesh'i sadece gözlemlenebilirlik için kurmak. Mesh'in otomatik topladığı metrik ve trace verisi cazip görünse de, aynı veriyi uygulama seviyesinde OpenTelemetry ile enstrümante etmek çoğu zaman daha az operasyon yüküyle benzer görünürlük sağlıyor — mesh'i sadece bu amaçla kurmak, gözlemlenebilirlik ihtiyacınızı mTLS ve trafik politikası ihtiyacınızla karıştırmak demek. Üçüncü hata ise mesh'i tek bir büyük "big bang" geçişle tüm kümeye aynı anda uygulamak; bunun yerine düşük riskli bir namespace'te pilot uygulama yapıp gerçek operasyon maliyetini ölçmek, kararı veriye dayandırmanın en güvenli yolu.

## Mesh'e İhtiyacınız Var mı: Karar Testi

```text
Aşağıdaki sorulardan 3 veya daha fazlasına "evet" diyorsanız mesh'i değerlendirin:
1. 20'den fazla mikroservisiniz var mı?
2. Servisler arası trafik farklı takımlar tarafından yönetiliyor mu?
3. Düzenleyici gereksinimler servisler arası şifrelemeyi zorunlu kılıyor mu?
4. Kanarya dağıtım veya A/B trafik bölme sık kullanılan bir ihtiyaç mı?
5. Dedike bir platform/altyapı ekibiniz var mı?

3'ten az "evet" varsa: Gateway API + uygulama seviyesi enstrümantasyon
muhtemelen yeterli, mesh'in karmaşıklık maliyetini üstlenmeyin.
```

## Sıkça Sorulan Sorular

### Service mesh olmadan mTLS nasıl sağlanır?

Bulut sağlayıcınızın VPC içi ağ şifrelemesi (AWS, GCP ve Azure'ın çoğu bölgede varsayılan olarak sunduğu) temel bir koruma sağlar; daha güçlü kimlik doğrulama gerekiyorsa SPIFFE/SPIRE gibi kimlik yönetim araçlarını mesh olmadan da entegre edebilirsiniz.

### Küçük bir ekip Istio ambient modu deneyebilir mi?

Teknik olarak evet, ama küçük bir ekip için asıl soru "deneyebilir miyiz" değil "bunu üretimde kim işletecek" sorusu. Ambient mod sidecar'a göre daha az kaynak tüketse de waypoint proxy yönetimi hâlâ platform bilgisi gerektiriyor.

### Gateway API tek başına yeterli mi?

Sadece kümeye giren trafiği yönetiyorsanız evet, çoğu durumda yeterli. Servisler arası trafik yönetimi, mTLS veya ince taneli iç trafik politikası ihtiyacınız yoksa Gateway API'nin ötesine geçmenize gerek yok.

### Mesh'ten mesh'e geçiş (örneğin Istio'dan Linkerd'e) ne kadar zor?

Zor ve riskli — her iki mesh de farklı proxy modelleri, farklı CRD'ler ve farklı operasyon araçları kullanır. Bu geçiş genelde kademeli bir kümeler arası taşıma gerektirir, tek seferde yapılacak bir işlem değildir.

### Cilium gibi eBPF tabanlı çözümler mesh'in yerini alabilir mi?

Kısmen. Cilium, eBPF ile ağ katmanında mTLS ve gözlemlenebilirlik gibi bazı mesh yeteneklerini proxy'siz sağlayabiliyor, bu da sidecar'ın getirdiği kaynak yükünü ortadan kaldırıyor. Ama ince taneli L7 trafik politikası gibi bazı yetenekler için hâlâ bir mesh katmanına ihtiyaç duyulabiliyor — karar, hangi yeteneklerin gerçekten gerekli olduğuna bağlı.
