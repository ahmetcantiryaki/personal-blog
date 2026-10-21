---
title: "Kubernetes Operatörleri: Ne Zaman Yazmalı?"
slug: "kubernetes-operatorleri-ne-zaman-yazmali"
translationKey: "kubernetes-operators-explained-2026"
locale: "tr"
excerpt: "Kısa cevap: day-2 operasyonları (yedekleme, failover, yükseltme) sürekli insan müdahalesi gerektirdiğinde bir operatör yazın; aksi hâlde Helm chart yeterli."
category: "devops-cloud"
tags: ["kubernetes", "platform-engineering", "automation", "infrastructure-as-code", "devops"]
publishedAt: "2026-10-21"
seoTitle: "Kubernetes Operatörleri: Ne Zaman Yazmalı?"
seoDescription: "Kısa cevap: day-2 operasyonları (yedekleme, failover, yükseltme) sürekli insan müdahalesi gerektirdiğinde bir operatör yazın; aksi hâlde Helm chart yeterli."
---

Kısa cevap: bir operatör yazmaya, uygulamanızın day-2 operasyonları (yedekleme, failover, sürüm yükseltme, ölçeklendirme kararları) sürekli insan müdahalesi gerektirdiğinde değer. Durum bu değilse bir Helm chart veya düz YAML manifesti, operatörün bakım maliyetini üstlenmeden aynı işi görür; karar asıl olarak tekrarlayan operasyonel yüke bakılarak verilir.

Bu ayrımın pratikte göründüğü yer genelde bir incident sonrası retrospektif: "bu failover'ı elle üçüncü kez aynı sırayla yaptık" cümlesi, bir operatör yazma kararının en net tetikleyicisi. Tek seferlik bir kurulumda aynı cümle hiç kurulmaz, bu yüzden de operatöre gerek kalmaz.

## Kubernetes operatörü nedir?

Bir operatör, Kubernetes'in kendi API'sini bir uygulamaya özel operasyon bilgisiyle genişleten bir yazılım parçasıdır. Üç parçadan oluşur: bir CRD (Custom Resource Definition) kümenizdeki nesne türünü tanımlar, bir controller bu nesneleri sürekli izler, bir reconcile loop ise "şu an ne durumdayız" ile "olması gereken durum ne" arasındaki farkı kapatacak eylemleri yürütür. Bir Helm chart sadece YAML şablonlarını bir kez uygular; operatör ise kümenizde sürekli çalışan, durumu izleyip kendiliğinden düzelten bir yazılımdır.

## Reconcile loop nasıl çalışır?

Reconcile loop dört adımı sürekli tekrar eder: izle (watch), karşılaştır (compare), eyleme geç (act), durumu güncelle (update status), ardından gerekirse yeniden kuyruğa al (requeue). Bu döngü sabit bir zamanlayıcıyla değil, izlenen kaynaktaki her değişiklikte olay tetiklemeli olarak çalışır. Örneğin bir veritabanı operatörü, `replicas: 3` tanımlı bir CRD nesnesini izler; kümede sadece 2 pod çalıştığını görürse üçüncüyü başlatır, bitene kadar requeue eder. Bu döngünün idempotent olması zorunlu: aynı reconcile fonksiyonu art arda beş kez çalışsa da sonuç değişmemeli, çünkü Kubernetes bu fonksiyonu nedensiz yere de tekrar tekrar çağırabilir.

## Operatör mü yazmalı, yoksa var olanı mı kullanmalı?

Önce var olan bir operatörü arayın; çoğu popüler veritabanı ve mesaj kuyruğu (PostgreSQL, Redis, Kafka, Elasticsearch) için topluluk veya üretici tarafından bakımı yapılan bir operatör zaten var. Kendi operatörünüzü yazmak, yalnızca işletmenize özgü bir day-2 operasyon mantığı (örneğin özel bir failover sırası veya düzenleyici bir uyumluluk kuralı) hiçbir hazır operatörde karşılanmadığında gerekçeli oluyor. Hazır bir operatörü seçerken bakımının ne kadar aktif olduğuna da bakın: son commit tarihi altı aydan eskiyse ve açık issue sayısı sürekli büyüyorsa, o operatörü production'a almak kendi operatörünüzü yazmaktan daha riskli olabilir.

| Kriter | Helm Chart | Hazır Operatör | Kendi Operatörünüz |
|---|---|---|---|
| Kurulum karmaşıklığı | Düşük | Orta | Yüksek |
| Day-2 operasyon desteği | Yok, elle yapılır | Uygulamaya göre değişir | Tam, sizin tanımladığınız kadar |
| Bakım yükü | Yok | Üretici/topluluk üstlenir | Sizin ekibinizde kalır |
| En uygun senaryo | Durumsuz uygulamalar, tek seferlik kurulum | Standart veritabanları, kuyruklar | Şirkete özgü, tekrarlayan operasyon mantığı |

## Bir operatörü sahiplenmenin bakım maliyeti nedir?

Bir operatör yazmak, kümenizde sürekli çalışan ve Kubernetes API sürümleriyle birlikte güncellenmesi gereken yeni bir yazılım bileşeni eklemek demektir. Her Kubernetes sürüm yükseltmesi, operatörünüzün kullandığı `client-go` ve controller-runtime kütüphanelerinin de güncellenmesini gerektirebilir; bu, operatörü "bir kere yaz, unut" diye bırakamayacağınız anlamına gelir. Bu bakım yükünü üstlenecek belirli bir sahip (ekip veya kişi) atamadan operatörü production'a almak, altı ay sonra kimsenin güncellemeyi hatırlamadığı kritik bir bileşene dönüşmesine yol açar. Ekip operatörün kod tabanını büyüttükçe, reconcile loop'taki bir hatanın tüm kümedeki ilgili kaynakları aynı anda bozma riski de büyür — bu riski [Kubernetes'te sık yapılan hatalar rehberimizde](/tr/posts/kubernetes-hatalari) ele aldığımız "tek bir bileşenin blast radius'unu küçük tutma" ilkesiyle dengelemek gerekir.

## Operatör yazmaya nereden başlanır?

Kubebuilder, CRD ve controller iskeletini saniyeler içinde oluşturan standart araçtır; `kubebuilder init` ile projeyi, `kubebuilder create api` ile her kaynak türünü oluşturursunuz. Operator Framework'ün bir parçası olan Operator SDK, aynı iskeleti operatörünüzü OperatorHub gibi kataloglara paketlemeyi kolaylaştıran ek araçlarla sunar. İkisi de reconcile fonksiyonunuzu Go'da yazmanızı bekler; mantığın kendisini siz yazarsınız, araçlar sadece CRD şemasını, RBAC kurallarını ve controller iskeletini üretir.

```go
// Basitleştirilmiş bir reconcile fonksiyonu iskeleti
func (r *DatabaseReconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {
	var db myappv1.Database
	if err := r.Get(ctx, req.NamespacedName, &db); err != nil {
		return ctrl.Result{}, client.IgnoreNotFound(err)
	}

	current := r.countRunningPods(ctx, &db)
	if current < db.Spec.Replicas {
		r.scaleUp(ctx, &db, db.Spec.Replicas-current)
		return ctrl.Result{RequeueAfter: 10 * time.Second}, nil
	}
	return ctrl.Result{}, nil
}
```

## Bir operatör nasıl test edilir?

Operatör testleri üç katmanda ilerler: önce reconcile fonksiyonunuzu birim testleriyle, gerçek bir küme olmadan sahte (fake) bir Kubernetes client'a karşı test edersiniz; sonra Kubebuilder'ın `envtest` aracıyla gerçek bir API server'ı (etcd dahil, ama kubelet olmadan) ayağa kaldırıp CRD'nizin ve RBAC kurallarınızın gerçekten çalıştığını doğrularsınız; en son Kind veya Minikube gibi tam bir küme üzerinde uçtan uca senaryoları (örneğin bir pod'un gerçekten çökmesi ve operatörün onu gerçekten yeniden başlatması) test edersiniz. Bu üç katmanı atlayıp doğrudan production'da test etmek, reconcile loop'ta bir sonsuz döngüye düştüğünüzde bütün kümeyi etkileyen bir olaya dönüşebilir.

## Bir operatöre gerçekten ihtiyacınız olduğunun işaretleri nedir?

Üç işaret aynı anda görülüyorsa operatör gerekçeli hâle gelir: aynı day-2 operasyonu ayda birden fazla kez elle tekrarlıyorsunuz, bu operasyon birden fazla kaynağın (pod, servis, secret) koordineli şekilde değişmesini gerektiriyor ve hata payı yüksek (yanlış sırayla yapılan bir failover veri kaybına yol açabiliyor). Bu üç işaretten sadece biri varsa, çoğu zaman bir Helm chart'a eklenen basit bir post-install hook veya bir cron job aynı işi, operatörün bakım yükü olmadan görür.

Bu üç işareti bir tablo yerine bir checklist olarak ekibinize sorun: son üç ayda bu operasyonu kaç kez elle yaptınız, her birinde kaç dakika sürdü, kaç kaynağı aynı anda değiştirmeniz gerekti. Sayılar düşükse (ayda bir-ikiden az, tek kaynak) operatör yazmak muhtemelen zamanınıza değmez; sayılar yükseliyorsa ve her tekrarda insan hatası riski büyüyorsa operatör kararı kendini genelde birkaç ay içinde geri öder.

Kişisel görüşüm şu: ekipler operatörü çok erken yazmaya başlıyor, çünkü "Kubernetes-native" olmak teknik olarak çekici görünüyor. Oysa bir operatör, kümenizde yaşayan ve sizin sahiplenmeniz gereken yeni bir dağıtık sistemdir; onu yazmadan önce aynı day-2 mantığının bir cron job veya basit bir script ile çözülüp çözülemeyeceğini sormak, çoğu zaman aylar sürecek bir bakım yükünü önlüyor. Platform ekibi kurduğunuz her operatör, aslında sizin yazdığınız ve sizin desteklediğiniz bir Kubernetes alt sistemidir; bu sorumluluğu üstlenmeye hazır olmadan sadece "trend" olduğu için yazmak, iki yıl sonra kimsenin tam anlamadığı bir kod tabanına dönüşür.

Operatörle ilgili YAML yönetimi tercihlerinizi netleştirmek isterseniz [Helm ve Kustomize karşılaştırmamıza](/tr/posts/helm-mi-kustomize-mi-k8s) bakabilirsiniz; ölçeklendirme kararlarını operatöre mi bırakacağınızı yoksa yerleşik HPA/VPA'ya mı emanet edeceğinizi [otomatik ölçekleme rehberimiz](/tr/posts/kubernetes-otomatik-olcekleme-rehberi) netleştirebilir. Genel olarak Kubernetes'e hâlâ ihtiyacınız olup olmadığını sorguluyorsanız [bu karşılaştırmamıza](/tr/posts/hala-kubernetes-gerekli-mi-2026) göz atın. Resmi kavramlar için [kubernetes.io'nun operator pattern sayfası](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/) ve pratik başlangıç için [Kubebuilder kitabı](https://book.kubebuilder.io/) en güvenilir kaynaklar.

## Sıkça Sorulan Sorular

### Operatör yazmak için Go bilmek şart mı?

Pratikte evet. Kubebuilder ve Operator SDK'nın ana ekosistemi Go üzerine kurulu ve `client-go` kütüphanesi en iyi desteği Go'da sunuyor; Python veya Java ile de operatör yazılabiliyor ama topluluk desteği ve örnek sayısı çok daha az.

### Bir CRD ile bir ConfigMap arasındaki fark nedir?

CRD, Kubernetes API'sine yeni bir kaynak türü ekler ve bu türün kendi şeması, doğrulaması ve versiyon geçmişi olur; bir ConfigMap ise sadece anahtar-değer verisi taşıyan genel bir kaynaktır ve hiçbir controller onu izlemek zorunda değildir.

### Reconcile loop ne sıklıkla çalışır?

Sabit bir aralıkla değil, olay tetiklemeli (event-driven) çalışır: izlenen kaynakta bir değişiklik olduğunda hemen tetiklenir, ayrıca `RequeueAfter` ile belirttiğiniz bir süre sonra da tekrar çalışır. Bu, sabit aralıklı bir polling döngüsünden daha verimlidir.

### Operatör yazmak yerine basit bir cron job yeterli olur mu?

Çoğu zaman evet. Day-2 operasyonunuz tek bir kaynağı etkiliyorsa ve koordinasyon gerektirmiyorsa, bir cron job veya basit bir script aynı işi görür; operatörün asıl değeri, birden fazla kaynağı sürekli ve koordineli şekilde izlemesi, hatalara otomatik tepki vermesi gerektiğinde ortaya çıkar.
