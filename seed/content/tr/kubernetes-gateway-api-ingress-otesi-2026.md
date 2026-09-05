---
title: "Kubernetes Gateway API: Ingress'in Ötesi 2026"
slug: "kubernetes-gateway-api-ingress-otesi-2026"
translationKey: "kubernetes-gateway-api-2026"
locale: "tr"
excerpt: "Kısa cevap: Gateway API, Ingress'in annotation karmaşasını GatewayClass, Gateway ve HTTPRoute ile değiştiriyor; Haziran 2026'da v1.6.0 ile GA oldu."
category: "devops-cloud"
tags: ["kubernetes", "devops", "cloud", "platform-engineering"]
publishedAt: "2026-09-05"
seoTitle: "Kubernetes Gateway API Nedir? Ingress'ten Geçiş Rehberi 2026"
seoDescription: "Kısa cevap: Gateway API, Ingress'in annotation karmaşasını GatewayClass, Gateway ve HTTPRoute ile değiştiriyor; Haziran 2026'da v1.6.0 ile GA oldu."
---

Kısa cevap: Kubernetes Gateway API, Ingress kaynağının annotation karmaşasını ve tek-rol modelini, GatewayClass, Gateway ve HTTPRoute gibi ayrı kaynaklarla çözen resmi trafik yönlendirme standardı. Haziran 2026'da yayınlanan v1.6.0 sürümüyle TCPRoute ve UDPRoute de Standard (GA) seviyesine ulaştı; HTTPRoute, Gateway ve GatewayClass zaten v1 GA statüsünde.

## Ingress neden yetersiz kaldı?

Kısa cevap: Ingress, karmaşık trafik yönlendirme ihtiyaçlarını (header bazlı yönlendirme, trafik bölme, çapraz namespace referansları) tek bir standart alan seti içinde karşılayamadığı için, her controller kendi özel annotation'larını icat etti — bu da bir NGINX Ingress tanımını bir Traefik veya Istio ortamına taşımayı neredeyse imkansız hale getirdi.

Ingress'in ikinci sorunu rol ayrımı eksikliğiydi: platform ekibinin yönettiği altyapı ile uygulama ekibinin yönettiği yönlendirme kuralları aynı YAML dosyasında karışıyordu. Büyük organizasyonlarda bu, her route değişikliği için platform ekibinin onay vermesi gerektiği anlamına geliyordu — Gateway API'nin çözdüğü tam olarak bu darboğaz.

## Gateway API'nin kaynak modeli nasıl işliyor?

Kısa cevap: Model üç katmana ayrılıyor — GatewayClass (bulut sağlayıcısı veya controller'ın sunduğu şablon), Gateway (bu şablondan oluşturulan gerçek dinleyici/IP) ve HTTPRoute (bu Gateway üzerinden hangi trafiğin nereye gideceğini tanımlayan kural). Platform ekibi GatewayClass ve Gateway'i yönetirken, uygulama ekipleri kendi namespace'lerinde HTTPRoute tanımlayabiliyor.

Bu ayrım, rol bazlı erişim kontrolünü (RBAC) doğal olarak mümkün kılıyor: bir uygulama ekibi kendi HTTPRoute'unu değiştirebilirken, Gateway'in TLS sertifikasına veya dinleme portuna dokunamıyor. `ReferenceGrant` kaynağı da namespace'ler arası referanslara (örneğin bir HTTPRoute'un başka bir namespace'teki bir Service'e yönlenmesine) açık izin vermeyi zorunlu kılarak, yanlışlıkla trafik sızıntısını engelliyor.

## Trafik bölme ve header bazlı yönlendirme nasıl yapılır?

Kısa cevap: HTTPRoute içindeki `weight` alanıyla iki servis arasında yüzdesel trafik bölme (örneğin canary dağıtımda %90/%10) doğrudan API seviyesinde tanımlanıyor; ek bir annotation veya controller'a özgü CRD'ye gerek kalmıyor. Header, path ve method bazlı eşleştirme kuralları da aynı şekilde standart alanlar üzerinden çalışıyor.

Bu, [blue-green ve canary deployment stratejileri arasındaki farkı](/tr/posts/blue-green-mi-canary-mi) uygularken özellikle değerli — Gateway API ile canary'nin trafik yüzdesini değiştirmek, controller'dan bağımsız tek bir YAML alanını güncellemek kadar basit hale geliyor.

## Hangi controller'lar Gateway API'yi destekliyor?

Kısa cevap: Envoy Gateway, Istio, NGINX Gateway Fabric ve büyük bulut sağlayıcılarının kendi controller'ları (örneğin Azure'ın App Routing Gateway API'si, Haziran 2026'da GA'ya ulaştı) Gateway API'yi destekliyor; hangisini seçtiğiniz, ihtiyacınız olan Gateway API sürümüne ve ek özelliklere (mTLS, gözlemlenebilirlik) bağlı.

| Sürüm | Yayın tarihi | Öne çıkan değişiklik |
|---|---|---|
| v1.0 | Ekim 2023 | Gateway, GatewayClass, HTTPRoute GA'ya ulaştı |
| v1.5 | 27 Şubat 2026 | Deneysel özelliklerin çoğu Standard'a taşındı |
| v1.6.0 | 30 Haziran 2026 | TCPRoute ve UDPRoute Standard (GA) seviyesine ulaştı |

Gateway API, standart kanalda yaklaşık dört aylık bir yayın ritmi izliyor; bu, controller'ların hangi özelliği ne zaman destekleyeceğini tahmin etmeyi kolaylaştırıyor.

## Ingress'ten Gateway API'ye nasıl geçilir?

Kısa cevap: Geçişi aşamalı yapın — önce mevcut Ingress kaynaklarınızın yanına bir GatewayClass ve Gateway kurup trafiğin küçük bir yüzdesini yeni yapıya yönlendirin, sonra HTTPRoute'ları servis servis taşıyıp eski Ingress tanımlarını kaldırın. İki sistemi aynı cluster'da bir süre paralel çalıştırmak, geçiş sırasında kesintiyi sıfıra indiriyor.

Pratik adım sırası şöyle işliyor:
1. Controller'ınızın (Istio, Envoy Gateway, NGINX Gateway Fabric) Gateway API desteğini ve sürümünü doğrulayın.
2. Platform ekibi için bir GatewayClass ve bir veya birkaç Gateway (örneğin bölge başına bir tane) tanımlayın.
3. En az riskli servisten başlayarak Ingress kurallarını HTTPRoute'a birebir çevirin.
4. Trafiği izleyip sorun çıkmazsa bir sonraki servise geçin; tüm servisler taşındıktan sonra eski Ingress controller'ını kaldırın.

Bu süreç, [servis mesh'e gerçekten ihtiyacınız olup olmadığı sorusuyla](/tr/posts/service-mesh-2026-gercekten-gerekli-mi) da kesişiyor — Gateway API, mesh'in sağladığı bazı trafik yönetimi özelliklerini (ağırlıklı yönlendirme gibi) mesh kurmadan da sağlıyor; bu yüzden bazı ekipler için Gateway API tek başına yeterli oluyor.

## Gateway API service mesh'in yerini alıyor mu?

Kısa cevap: Hayır — Gateway API, kuzey-güney trafiğini (dış istemciden cluster'a giren trafik) yönetmek için tasarlandı, service mesh ise doğu-batı trafiğini (servisler arası iç trafik) mTLS ve gözlemlenebilirlikle güçlendiriyor; ikisi farklı katmanlarda çalışıyor ve birbirini tamamlıyor. Istio gibi bazı mesh çözümleri zaten kendi Gateway API implementasyonunu sunduğu için, tek bir controller hem dış hem iç trafiği yönetebiliyor.

Küçük ve orta ölçekli ekipler için pratik tavsiye şu: yalnızca dış trafik yönlendirmesi (canary, header bazlı routing) gerekiyorsa mesh kurmadan sade bir Gateway API controller'ı (Envoy Gateway veya NGINX Gateway Fabric) yeterli oluyor. Servisler arası mTLS, devre kesici (circuit breaker) veya ayrıntılı trafik telemetrisi gerekiyorsa, o zaman mesh'e geçmek mantıklı hale geliyor; aksi halde yalnızca Gateway API ile başlayıp ihtiyaç arttıkça mesh'i sonradan eklemek, baştan ikisini birlikte kurmaktan daha az karmaşıklık getiriyor.

## Gateway API maliyeti ve operasyonel yükü artırıyor mu?

Kısa cevap: Kısa vadede öğrenme eğrisi ve iki kaynak tipini (GatewayClass + HTTPRoute) yönetme yükü artıyor, ama uzun vadede annotation'lara dayalı özel scriptleri ve controller'a özgü belgeleri ortadan kaldırdığı için operasyonel yük düşüyor. Benim gözlemim: platform ekibi ile uygulama ekibi arasındaki route değişikliği onay sürecini otomatikleştiren ekipler, geçişin ilk ayında zaman kaybetse de üçüncü aydan itibaren net kazanca geçiyor; bu kazanç, özellikle çok takımlı büyük organizasyonlarda daha da belirgin hale geliyor.

CI/CD pipeline'ınıza HTTPRoute doğrulamasını eklemek de bu geçişin doğal bir parçası olmalı; [sıfırdan CI/CD pipeline kurma rehberi](/tr/posts/cicd-pipeline-nasil-kurulur) bu tür manifest doğrulama adımlarını nasıl ekleyeceğinizi ve hangi aşamada devreye alacağınızı gösteriyor.

Kubernetes maliyet optimizasyonu açısından da bir etkisi var: Gateway API'nin bölge başına tek bir Gateway paylaşma modeli, her takımın kendi Ingress controller'ını ayrı ayrı çalıştırmasına göre daha az kaynak tüketiyor. Büyük cluster'larda onlarca ayrı Ingress controller yerine birkaç paylaşılan Gateway işletmek, [Kubernetes maliyet optimizasyonu](/tr/posts/kubernetes-maliyet-optimizasyonu) hedefleyen ekipler için de doğrudan bir kazanç.

Yaygın bir hata da şu: ekipler geçişi "tek seferde her şeyi taşı" şeklinde planlayıp, ortada kalan bir haftalık geçiş döneminde hem Ingress hem Gateway API'yi aynı anda hata ayıklamak zorunda kalıyor. Geçişi servis bazında küçük parçalara bölmek, her adımda geri dönüş (rollback) seçeneğinizin açık ve net kalmasını sağlıyor; bu da özellikle üretimdeki kritik servisler için riski büyük ölçüde azaltıyor.

## Sıkça Sorulan Sorular

### Gateway API şu anda GA (kararlı) mı?

Evet, Gateway, GatewayClass ve HTTPRoute v1.0'dan (Ekim 2023) beri v1 GA statüsünde. Haziran 2026'daki v1.6.0 sürümüyle TCPRoute ve UDPRoute da Standard (GA) seviyesine ulaştı.

### Gateway API Ingress'in yerini tamamen alıyor mu?

Ingress kaynağı kaldırılmadı ve hâlâ çalışıyor, ama Kubernetes topluluğu yeni özellik geliştirmesini Gateway API'ye yönlendiriyor. Karmaşık trafik yönlendirme, çoklu takım modeli veya trafik bölme ihtiyacınız varsa Gateway API net bir yükseltme.

### Gateway API'ye geçiş için hangi controller'ı seçmeliyim?

Mevcut altyapınıza bağlı — zaten Istio kullanıyorsanız Istio'nun Gateway API desteğini, sade bir HTTP yönlendirmesi istiyorsanız Envoy Gateway veya NGINX Gateway Fabric'i değerlendirin. Üçü de v1.6 seviyesindeki temel kaynakları destekliyor.

### Gateway API ile trafik bölme (canary) nasıl yapılır?

HTTPRoute kaynağındaki `backendRefs` alanına birden fazla servis ekleyip her birine bir `weight` (ağırlık) değeri vererek yapılır — örneğin %90 eski sürüme, %10 yeni sürüme. Bu, ek bir annotation veya controller'a özgü CRD gerektirmeden standart API üzerinden çalışır.
