---
title: "Yazılım Tedarik Zinciri Güvenliği: SBOM'dan SLSA'ya"
slug: "yazilim-tedarik-zinciri-guvenligi"
translationKey: "supply-chain-security-sbom"
locale: "tr"
excerpt: "2025'te 454 binden fazla yeni zararlı paket keşfedildi. Zehirli bir bağımlılığın üretime sızmasını SBOM, VEX, Sigstore ve SLSA nasıl engeller?"
category: "devops-cloud"
tags: ["web-security", "ci-cd", "open-source", "devops"]
publishedAt: "2026-07-19"
seoTitle: "Yazılım Tedarik Zinciri Güvenliği: SBOM, Sigstore, SLSA"
seoDescription: "Zehirli bir bağımlılık üretiminize ulaşabilir mi? SBOM+VEX, cosign ile imzalama ve SLSA build provenance'ı CI'a nasıl kurarsınız, kontrol listesiyle."
---

Evet, ulaşabilir; ve büyük ihtimalle şu an sizi durduran tek şey şans. 2025'te dört büyük paket kayıt defterinde 454 binden fazla yeni zararlı paket bulundu. Buna karşı üç katmanlı savunma var: SBOM'u VEX ile zenginleştirmek, artifact'ları Sigstore ile imzalamak, build'i SLSA ile doğrulanabilir kılmak.

`npm install` komutunu çalıştırdığınız an, o paketin yazarına, o yazarın hesabının ele geçirilip geçirilmediğine ve paketin geçtiği build zincirinin bütünlüğüne örtük olarak güveniyorsunuz demektir. Bu güven artık kör güven olmamalı. Temmuz 2026 itibarıyla tedarik zinciri saldırıları, sıfır günlerden çok daha ucuz ve çok daha sinsi bir giriş noktası haline geldi; çünkü savunmanın büyük kısmı hâlâ "bağımlılıklarımıza güveniyoruz" varsayımı üzerine kurulu.

## Tehdit manzarası gerçekten ne kadar kötü?

Sonatype'ın Ocak 2026'da yayımlanan [2026 Yazılım Tedarik Zinciri Durumu raporu](https://www.sonatype.com/state-of-the-software-supply-chain/2026/open-source-malware) rakamları net ortaya koyuyor: 2025'in tamamında 454.600'den fazla YENİ zararlı paket keşfedildi, bu da npm, PyPI, Maven Central, NuGet ve Hugging Face genelinde bilinen/engellenen zararlı paketlerin KÜMÜLATİF toplamını 1,233 milyonun üzerine taşıdı. Açık kaynak zararlı yazılımının %99'undan fazlası tek başına npm'de görülüyor; bu da JavaScript ekosistemini saldırganların en verimli hedefi hâline getiriyor.

Ölçek de kendi başına bir risk faktörü. En büyük dört kayıt defteri genelinde toplam paket indirme sayısı 2025'te 9,8 trilyona ulaştı; bu, bir önceki yıla göre %67'lik bir artış. Otomasyon ve AI destekli kodlama bu tüketimi hızlandırıyor; bir geliştirici artık haftada değil, dakikada bağımlılık ekliyor olabilir. Sonatype'ın raporuna göre devlet bağlantılı aktörler de (Lazarus Group örneği öne çıkıyor) basit dropper'lardan ve kripto madencilerden, dropper + kimlik bilgisi çalma + kalıcı uzaktan erişimi birleştiren beş aşamalı payload zincirlerine geçti. Bu artık amatör iş değil; hedefli, çok aşamalı bir operasyon.

İşin AI tarafı ayrı bir katman ekliyor. 37 bin AI kod asistanı önerisi üzerinde yapılan bir analizde GPT-5, bileşen sürümlerinin %27,8'inde halüsinasyon gördü ve gerçek zamanlı paket istihbaratı olmadan çalıştığında, önerdiği paketlerin bazıları fiilen zararlı yazılımın kendisi çıktı. Yani AI ajanınız `package.json`'ı sizin için yazıyorsa, SBOM ve provenance kontrolleri lüks değil, zorunluluk hâline geliyor; çünkü artık insan gözünün her satırı gördüğü varsayımı da geçerli değil.

## SBOM tek başına neden yetmiyor, VEX neden devreye giriyor?

Bir SBOM (Software Bill of Materials), yazılımınızın içindeki her bileşeni, sürümünü ve lisansını listeleyen statik bir envanterdir. CycloneDX ve SPDX en yaygın iki format. Sorun şu: bir SBOM üretip bir CVE veritabanına karşı taradığınızda, genellikle yüzlerce "eşleşme" çıkar; bunların büyük çoğunluğu sizin build'inizde hiç çalıştırılmayan bir kod yoluna ait olduğu için gerçek risk taşımaz. Güvenlik ekipleri bu gürültüde boğuluyor ve gerçek acil durumları kaçırma riski artıyor.

VEX (Vulnerability Exploitability eXchange) tam da bu noktada devreye giriyor. VEX belgesi, SBOM'daki bir bileşimin belirli bir CVE'ye karşı sizin spesifik build'inizde istismar edilebilir olup olmadığını beyan eder: "affected", "not_affected", "fixed" veya "under_investigation" gibi durumlarla. Statik envanteri dinamik bir risk değerlendirmesine dönüştürür. SBOM + VEX ikilisi, "bu paket teknik olarak listede var" ile "bu paket bizi gerçekten tehdit ediyor" arasındaki farkı ayırt etmenizi sağlar; bu da güvenlik ekibinin zamanını gerçekten önemli olan CVE'lere ayırmasını sağlar.

| Yaklaşım | Sağladığı | Eksik kaldığı yer |
|---|---|---|
| Statik SBOM (yalnızca envanter) | Bileşen listesi, sürüm, lisans | İstismar edilebilirlik bağlamı yok, çok fazla yanlış pozitif |
| SBOM + VEX | Hangi CVE'lerin gerçekten sizi etkilediği | Build'in kim tarafından, nasıl üretildiğine dair kanıt yok |
| SBOM + VEX + imza (Sigstore) | Artifact'ın değiştirilmediğine dair kriptografik kanıt | Kaynak-artifact zincirinin tam izlenebilirliği yok |
| SBOM + VEX + imza + SLSA provenance | Uçtan uca doğrulanabilir tedarik zinciri | Süreklilik disiplini gerektirir (tek seferlik değil) |

## Artifact imzalama Sigstore ile nasıl çalışır?

Geleneksel kod imzalama, uzun ömürlü bir özel anahtarı güvenli tutmanızı gerektirir; bu anahtar sızarsa tüm imzalarınız şüpheli hâle gelir. [Sigstore](https://www.sigstore.dev/), bu sorunu "keyless signing" ile çözen, CNCF'de graduated statüsüne ulaşmış, üretime hazır bir araç seti. Üç bileşeni var: **cosign** artifact'ları (container image'ları, ikili dosyalar, SBOM'lar) imzalar; **Fulcio** kısa ömürlü sertifikalar veren bir sertifika otoritesi olarak çalışır (OIDC kimliğinize dakikalar süren bir sertifika verir, sonra siler); **Rekor** her imzayı herkese açık, değiştirilemez bir şeffaflık kaydına yazar. Sonuç: özel anahtar yönetmenize gerek kalmadan, "bu artifact'ı gerçekten CI sisteminiz imzaladı" iddiasını herkesin doğrulayabildiği bir sistem.

Sigstore artık niş bir araç değil. Kubernetes, npm'in provenance özelliği ve PyPI'ın trusted publishing mekanizması hepsi Sigstore'un üzerine kurulu. GitHub Actions'ta tipik bir imzalama adımı şöyle görünür:

```yaml
# .github/workflows/release.yml
- name: Generate SBOM
  run: syft packages dir:. -o cyclonedx-json > sbom.json

- name: Sign artifact with cosign (keyless)
  run: |
    cosign sign-blob --yes \
      --output-signature app.sig \
      --output-certificate app.pem \
      dist/app.tar.gz

- name: Verify signature (consumer side)
  run: |
    cosign verify-blob \
      --certificate app.pem \
      --signature app.sig \
      --certificate-identity-regexp "https://github.com/ORG/REPO/.*" \
      --certificate-oidc-issuer "https://token.actions.githubusercontent.com" \
      dist/app.tar.gz
```

Buradaki kritik detay `--certificate-identity-regexp` ve `--certificate-oidc-issuer` parametreleri: doğrulama, sadece "bir imza var mı" değil, "bu imzayı gerçekten beklediğim CI iş akışı mı attı" sorusuna cevap veriyor. [CI/CD pipeline'ınızı sıfırdan kurarken](/tr/posts/cicd-pipeline-nasil-kurulur) bu adımı en baştan mimariye eklemek, sonradan yamamaktan çok daha ucuz.

## SLSA ile build provenance ne anlama geliyor?

Sigstore artifact'ın bütünlüğünü kanıtlar; ama artifact'ın *hangi kaynak koddan, hangi build sisteminde* üretildiğini kanıtlamaz. Bunu [SLSA](https://slsa.dev/) (Supply-chain Levels for Software Artifacts) sağlıyor. SLSA, kaynak koddan artifact'a kadar olan zinciri doğrulanabilir kılan, seviyeli bir çerçeve:

| SLSA seviyesi | Ne sağlar |
|---|---|
| SLSA 1 | Build sürecinin belgelenmesi; provenance üretilir ama doğrulanmaz |
| SLSA 2 | İmzalı provenance; kaynak sürüm kontrolü ve build hizmeti tarafından üretilir |
| SLSA 3 | İzole, güvenilir build platformu; tampering'e karşı ek koruma |
| SLSA 4 (öneri aşaması) | İki kişi incelemesi + hermetik, tekrarlanabilir build'ler |

Pratikte bu, bir tüketicinin "bu container image gerçekten iddia edilen GitHub Actions workflow'u tarafından, iddia edilen commit'ten üretildi mi?" sorusunu kriptografik olarak doğrulayabilmesi demek. Bir saldırgan CI ortamınıza sızıp kötü niyetli bir build enjekte etse bile, provenance kaydı ile gerçek kaynak arasındaki tutarsızlık ortaya çıkar. Bu, [GitOps prensiplerinin](/tr/posts/gitops-nedir) savunduğu "deklaratif ve denetlenebilir dağıtım" felsefesiyle doğrudan örtüşüyor; ikisi birlikte kullanıldığında hem "ne dağıtılıyor" hem "nasıl üretildi" sorularına kanıtlanabilir cevap verirsiniz.

Açıkçası kişisel görüşüm şu: SLSA seviyelerini tek seferde SLSA 3'e çıkarmaya çalışmak çoğu ekip için zaman kaybı. SLSA 2'de imzalı provenance üretip tüketirken bunu birkaç ay stabil çalıştırmak, sonra izole build platformuna geçmek, tersinden gitmekten çok daha az sürtünme yaratıyor.

## CI'a nasıl kablolarsınız? Sertleştirme kontrol listesi

Bu araçların hiçbiri tek başına yeterli değil; birlikte, katmanlı bir savunma oluşturuyorlar. Temmuz 2026'da makul bir CI sertleştirme kontrol listesi şöyle görünmeli:

- Her build'de otomatik SBOM üretimi (Syft, cdxgen gibi araçlarla), CycloneDX veya SPDX formatında.
- SBOM'u statik bırakmayın: yeni CVE'ler geldikçe VEX belgelerini güncelleyen bir süreç kurun.
- Tüm release artifact'larını cosign ile keyless imzalayın; imzayı Rekor'da doğrulayın.
- Dağıtım öncesi `cosign verify` adımını deploy pipeline'ına zorunlu bir gate olarak ekleyin, opsiyonel değil.
- Build sisteminizin SLSA provenance ürettiğinden emin olun (GitHub Actions için `slsa-github-generator` gibi resmi generator'lar mevcut).
- Bağımlılık ekleme/güncelleme PR'larında otomatik zararlı paket taraması çalıştırın (Sonatype, Socket gibi araçlar).
- AI ajanlarının önerdiği bağımlılıkları, insan onayından önce mutlaka gerçek zamanlı paket istihbaratına karşı doğrulayın.
- Secret'ları CI ortamından tamamen ayırın; imzalama anahtarları yerine OIDC tabanlı keyless akışları tercih edin.

Secret yönetimi bu listenin ayrılmaz bir parçası; imzalama sürecinizin kendisi sızdırılmış bir kimlik bilgisiyle çökebilir. Bu yüzden [bulutta secret yönetimini](/tr/posts/bulutta-secret-yonetimi) doğru kurmak, tedarik zinciri güvenliğinin önkoşulu sayılmalı. Ajanların bağımlılık önerme sürecindeki riskleri daha geniş bağlamda görmek isterseniz [AI çöpünün açık kaynak güvenliğini nasıl zorladığına](/tr/posts/ai-copu-acik-kaynak-guvenligi) dair yazımız ve AI ajanlarının kendisinin hedef hâline geldiği [agentjacking saldırılarına](/tr/posts/agentjacking-yeni-ai-ajan-saldirisi) dair yazımız tamamlayıcı okuma. Daha geniş DevOps pratikleri için [devops-bulut](/tr/category/devops-bulut) kategorimize göz atabilirsiniz.

## Sıkça Sorulan Sorular

### SBOM ile VEX arasındaki fark nedir?

SBOM (Software Bill of Materials), bir yazılımın içindeki bileşenlerin ve sürümlerin statik bir listesidir; CycloneDX ve SPDX en yaygın formatlardır. VEX (Vulnerability Exploitability eXchange) ise bu listedeki bileşenlerden hangisinin sizin spesifik build'inizde gerçekten istismar edilebilir olduğunu belirten dinamik bir beyan belgesidir. SBOM tek başına gürültü üretir; SBOM + VEX ikilisi güvenlik ekibinin gerçek risklere odaklanmasını sağlar.

### Sigstore neden özel anahtar gerektirmiyor?

Sigstore'un cosign aracı, "keyless signing" adı verilen bir yaklaşım kullanır: Fulcio sertifika otoritesi, OIDC kimliğinize (örneğin GitHub Actions workflow kimliğinize) dakikalar içinde geçerliliğini yitiren kısa ömürlü bir sertifika verir ve imzalama bu sertifikayla yapılır. Uzun ömürlü bir özel anahtarı saklamanız, döndürmeniz veya sızıntıya karşı korumanız gerekmez; her imza Rekor şeffaflık kaydına yazılır ve herkes tarafından doğrulanabilir.

### SLSA seviyeleri arasında ne fark var, hangi seviyeyi hedeflemeliyim?

SLSA 1 sadece build sürecinin belgelenmesini ister; SLSA 2 imzalı provenance ve sürüm kontrollü kaynak ister; SLSA 3 izole, güvenilir bir build platformu ve tampering korumasını zorunlu kılar. Çoğu ekip için gerçekçi başlangıç noktası SLSA 2'dir: imzalı provenance üretip tüketen bir CI kurup bunu birkaç ay stabil çalıştırdıktan sonra SLSA 3'e geçmek, doğrudan en üst seviyeyi hedeflemekten çok daha az sürtünme yaratır.

### AI kod asistanları tedarik zinciri riskini nasıl artırıyor?

37 bin AI kod önerisi üzerinde yapılan bir analizde GPT-5, bileşen sürümlerinin %27,8'inde halüsinasyon gördü ve gerçek zamanlı paket istihbaratı olmadan çalıştığında bazen fiilen zararlı yazılım olan paketleri önerdi. Bir AI ajanı `package.json` veya `requirements.txt` dosyasını sizin için düzenliyorsa, önerilen her yeni bağımlılığı insan onayından önce gerçek zamanlı zararlı paket taramasından geçirmek artık isteğe bağlı değil, zorunlu bir kontrol adımı.
