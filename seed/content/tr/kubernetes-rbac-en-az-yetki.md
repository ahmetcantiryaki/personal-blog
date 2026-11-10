---
title: "Kubernetes RBAC'ta En Az Yetki Nasıl Uygulanır?"
slug: "kubernetes-rbac-en-az-yetki"
translationKey: "kubernetes-rbac-least-privilege"
locale: "tr"
excerpt: "Kısa cevap: cluster-admin'i hiçbir workload'a bağlamayın, verbs: [\"*\"] yerine sadece gereken fiilleri yazın ve her workload'a kendi ServiceAccount'unu verin."
category: "devops-cloud"
tags: ["kubernetes", "container-security", "devops", "best-practices"]
publishedAt: "2026-11-10"
seoTitle: "Kubernetes RBAC: En Az Yetki Rehberi (Kas 2026)"
seoDescription: "Kubernetes RBAC'ta en az yetki nasıl uygulanır: Role/ClusterRole farkı, ServiceAccount riski, kubectl auth can-i denetimi ve hazır least-privilege şablonu."
---

Kısa cevap: `cluster-admin`'i hiçbir workload'a bağlamayın, `verbs: ["*"]` yerine yalnızca gereken fiilleri (get, list, watch gibi) yazın ve her workload'a varsayılan ServiceAccount yerine kendi özel ServiceAccount'unu verin. Bu üç kural, Kasım 2026 itibarıyla gördüğümüz RBAC yanlış yapılandırmalarının büyük kısmını tek başına kapatıyor.

RBAC (Role-Based Access Control), kümenizdeki her kullanıcı ve workload'ın Kubernetes API'sine hangi kaynaklarda hangi işlemleri yapabileceğini tanımlar. Yanlış yapılandırıldığında, ele geçirilen tek bir pod'un tüm namespace'leri okuyup Secret'ları sızdırmasına kapı açar.

## Role mi ClusterRole mi Kullanmalısınız?

Kısa cevap: bir workload ya da kullanıcı tek bir namespace'le sınırlıysa Role + RoleBinding kullanın; birden fazla namespace'e veya namespace'siz kaynaklara (Node, PersistentVolume gibi) erişim gerekiyorsa ClusterRole kullanın.

`Role`, bir namespace içinde geçerlidir ve `RoleBinding` ile bir kullanıcıya, gruba veya ServiceAccount'a bağlanır. `ClusterRole` ise küme genelinde tanımlanır; ya `ClusterRoleBinding` ile küme genelinde, ya da bir namespace'teki `RoleBinding` ile o namespace'e özgü şekilde bağlanabilir — bu ikinci kullanım, aynı ClusterRole'ü birden fazla namespace'te tekrar tanımlamadan kullanmanızı sağlar.

Kubernetes'in resmi API referansına göre `ClusterRole` ayrıca `aggregationRule` alanıyla "agregasyonlu" olabilir: `clusterRoleSelectors` altında etiket seçiciler tanımlarsınız ve kontrolcü, eşleşen diğer ClusterRole'lerin kurallarını otomatik olarak sizin `rules` alanınıza yazar. Bu agregasyon aktifken `rules` alanına elle yaptığınız değişiklikler kontrolcü tarafından ezilir — bu yüzden agregasyonlu bir ClusterRole'ü elle düzenlemeyin, etiketi değiştirin.

## En Yaygın Üç Aşırı Yetkilendirme Hatası Nedir?

Kısa cevap: `cluster-admin`'i bir workload'a bağlamak, `verbs: ["*"]` ya da `resources: ["*"]` gibi joker karakter kullanmak ve namespace'in varsayılan ServiceAccount'una güvenmek — üçü de denetim sırasında "neden bu pod her şeyi yapabiliyor?" sorusunun cevabı oluyor.

| Aşırı yetkilendirme | En az yetkili düzeltme |
| --- | --- |
| `cluster-admin`'i bir Deployment'a bağlamak | Sadece gereken namespace ve kaynaklar için özel `Role` tanımlamak |
| `verbs: ["*"]` veya `resources: ["*"]` | `get`, `list`, `watch` gibi açık fiil listesi yazmak |
| Varsayılan ServiceAccount'u kullanmak | Her workload'a özel, tek amaçlı bir ServiceAccount vermek |
| Tüm pod'larda otomatik token bağlama | Token'a ihtiyacı olmayan pod'larda `automountServiceAccountToken: false` |

Üçüncü satır özellikle ihmal ediliyor çünkü Kubernetes 1.22'den beri varsayılan davranış göründüğünden daha güvenli: kümeniz artık eski, süresiz Secret tabanlı token yerine süreli, hedef kitleye (audience) bağlı, otomatik yenilenen bir projected token mountluyor. Yani eski "tüm token'lar sızarsa küme ele geçirilir" korkusu kısmen azaldı — ama token hâlâ o pod'un ServiceAccount'una tanımlı her RBAC iznini taşıyor, bu da aşırı yetkilendirilmiş bir ServiceAccount'u hâlâ tehlikeli kılıyor.

Bu dört satırı tek seferlik bir temizlik olarak görmeyin: yeni bir Helm chart kurulduğunda ya da bir operatör güncellendiğinde, varsayılan değerler genelde en geniş izni isteyen tarafa kayıyor — chart'ın kendi ServiceAccount'u tanımlamaması, sizi sessizce `default`'a geri döndürür. Bu yüzden yeni bir workload her eklendiğinde dört satırı kontrol listesi olarak tekrar gözden geçirmek, kümenin büyümesiyle RBAC yüzeyinin de aynı disiplinle büyümesini sağlar.

## Varsayılan ServiceAccount Neden Risklidir?

Kısa cevap: her namespace'in kendi `default` ServiceAccount'u vardır ve siz başka bir şey belirtmezseniz pod'larınız otomatik olarak buna bağlanır — bu ServiceAccount'a yanlışlıkla geniş bir Role bağlarsanız, o namespace'teki her pod bu yetkiyi devralır.

Pratik kural: `default` ServiceAccount'a hiçbir zaman RoleBinding yapmayın. Bunun yerine her workload için niyetini adından anlaşılan, tek amaçlı bir ServiceAccount oluşturun (`log-shipper-sa`, `metrics-reader-sa` gibi) ve RBAC'ı o özel hesaba bağlayın. API sunucusuyla hiç konuşmayan pod'larda (çoğu basit web servisi gibi) token'ı hiç mountlamayın:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: metrics-reader-sa
  namespace: observability
automountServiceAccountToken: false
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: configmap-secret-reader
  namespace: observability
rules:
  - apiGroups: [""]
    resources: ["configmaps", "secrets"]
    verbs: ["get", "list", "watch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: metrics-reader-binding
  namespace: observability
subjects:
  - kind: ServiceAccount
    name: metrics-reader-sa
    namespace: observability
roleRef:
  kind: Role
  name: configmap-secret-reader
  apiGroup: rbac.authorization.k8s.io
```

Bu tanım, `metrics-reader-sa`'nın yalnızca `observability` namespace'inde ConfigMap ve Secret'ları okuyabildiğini, başka hiçbir namespace'e veya küme genelindeki bir kaynağa dokunamadığını garanti eder — token API sunucusuna sızsa bile saldırgan yalnızca bu dar yüzeyle sınırlı kalır.

## kubectl auth can-i ile RBAC Nasıl Denetlenir?

Kısa cevap: `kubectl auth can-i <verb> <resource> --as=<subject> -n <namespace>` komutu, o öznenin belirli bir eylemi yapıp yapamayacağını anında "yes"/"no" olarak döner; `--list` bayrağıyla da bir öznenin o namespace'teki tüm izinlerini tek seferde listeleyebilirsiniz.

```bash
# Belirli bir ServiceAccount, secrets üzerinde delete yapabilir mi?
kubectl auth can-i delete secrets \
  --as=system:serviceaccount:observability:metrics-reader-sa \
  -n observability

# Aynı ServiceAccount'un namespace'teki TÜM izinlerini listele
kubectl auth can-i --list \
  --as=system:serviceaccount:observability:metrics-reader-sa \
  -n observability
```

Tek tek kontrol yerine kümenin tamamını taramak isterseniz, `rbac-tool` (Alcide) veya `kubectl-who-can` gibi topluluk araçları, belirli bir fiil-kaynak çiftine kimin erişebildiğini ters yönden sorgulayıp "bu Secret'ı kimler silebilir?" sorusunu doğrudan cevaplar. Haftalık bir CI adımı olarak bu taramayı çalıştırmak, yeni bir Helm chart'ın sessizce `cluster-admin` istediği durumları merge olmadan önce yakalar.

`--as` bayrağı sadece kullanıcı adlarıyla sınırlı değil; `--as-group` ile bir grup adı da verip, o grubun üyesi olan herhangi bir kullanıcının ne yapabildiğini test edebilirsiniz — bu, bir RoleBinding'i doğrudan bir ServiceAccount'a değil bir gruba bağladığınız senaryolarda tek tek hesap test etmekten daha hızlı bir doğrulama yolu.

## RBAC'ı Namespace İzolasyonu ve Admission Policy ile Nasıl Birleştirirsiniz?

Kısa cevap: RBAC tek başına yeterli değildir — kim hangi API çağrısını yapabilir sorusunu cevaplar ama bir pod'un hangi imajı çalıştırabileceğini veya `hostNetwork` isteyip isteyemeyeceğini kontrol etmez; bunun için namespace izolasyonunu NetworkPolicy ile ve çalışma zamanı kurallarını OPA Gatekeeper veya Kyverno gibi bir admission controller ile tamamlamanız gerekir.

RBAC + admission policy kombinasyonunu ayrıntılı kurmak istiyorsanız [OPA ve Kyverno karşılaştırmamız](/tr/posts/kod-olarak-politika-opa-kyverno) bu ikisi arasındaki farkı ve hangi senaryoda hangisinin daha az operasyonel yük getirdiğini ele alıyor; burada tekrar etmiyoruz. Küme genelinde Secret'ların nasıl saklandığını da gözden geçirmek istiyorsanız [buluttaki secret yönetimi rehberimiz](/tr/posts/bulutta-secret-yonetimi) iyi bir tamamlayıcı. Otomatik ölçeklenen bir kümede RBAC'ın yeni node'larla nasıl davrandığını merak ediyorsanız [Kubernetes otomatik ölçekleme rehberine](/tr/posts/kubernetes-otomatik-olcekleme-rehberi) bakabilirsiniz.

Açıkçası, takımların en çok ihmal ettiği denetim bu: `cluster-admin`'i bir workload ServiceAccount'una bağlamak, kümenizdeki en yaygın ve en tehlikeli yanlış yapılandırma — ve neredeyse hiçbir ekip bunu düzenli olarak taramıyor. Diğer tüm RBAC hijyeni (wildcard verb'ler, varsayılan SA) bundan sonra gelir.

Bu denetimi tek seferlik bir proje olarak değil, her çeyrek tekrarlanan bir rutin olarak planlayın: kümeler büyüdükçe yeni Helm chart'lar, yeni operatörler ve yeni CI entegrasyonları RBAC yüzeyine sessizce ekleniyor, bu yüzden bir kez temizlemek kalıcı bir çözüm değil.

Daha geniş Kubernetes operasyon konularına [DevOps & Bulut kategorimizden](/tr/category/devops-bulut) göz atabilirsiniz; sık yapılan diğer hatalar için de [10 Kubernetes hatası](/tr/posts/kubernetes-hatalari) yazımıza bakın.

## Sıkça Sorulan Sorular

### Kubernetes'te Role ile ClusterRole arasındaki fark nedir?

Role, tek bir namespace içinde geçerlidir ve sadece o namespace'teki kaynaklara izin tanımlayabilir. ClusterRole küme genelinde tanımlanır; hem namespace'siz kaynaklar (Node, PersistentVolume) için hem de aynı kuralı birden fazla namespace'te tekrar yazmadan kullanmak için uygundur.

### ServiceAccount token'ı artık otomatik mi yenileniyor?

Evet. Kubernetes 1.22'den itibaren varsayılan davranış, eski süresiz Secret tabanlı token yerine süreli, hedef kitleye bağlı ve kubelet tarafından otomatik yenilenen bir projected token mountlamaktır. Bu, sızan bir token'ın ömrünü kısaltır ama o token'ın taşıdığı RBAC iznini sınırlamaz.

### kubectl auth can-i gerçek API sunucusu davranışını mı test ediyor?

Evet, `kubectl auth can-i` doğrudan API sunucusunun yetkilendirme (authorization) katmanına sorar ve o öznenin gerçekten ne yapabildiğini döner; bu bir simülasyon değil, canlı RBAC kurallarının sorgusudur. `--as` ile başka bir kullanıcı veya ServiceAccount adına, `--list` ile de tüm izin setini tek seferde sorgulayabilirsiniz.

### Her pod'a kendi ServiceAccount'unu vermek operasyonel yük yaratır mı?

Başlangıçta biraz evet, ama yük düşük: her workload için bir ServiceAccount + Role + RoleBinding manifestosu, genelde bir Helm chart şablonuna tek seferlik eklenir ve sonrasında otomatik üretilir. Buna karşılık, varsayılan ServiceAccount'u paylaşmanın getirdiği "bir pod ele geçirilince namespace'in tamamı risk altında" senaryosuyla kıyaslandığında bu yük önemsiz kalıyor.
