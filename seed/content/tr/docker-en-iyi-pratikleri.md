---
title: "Üretim İçin Docker En İyi Pratikleri"
slug: "docker-en-iyi-pratikleri"
translationKey: "docker-best-practices"
locale: "tr"
excerpt: "Üretim için Docker en iyi pratikleri: multi-stage build, root olmayan kullanıcı, imaj tarama, sağlık kontrolü ve kaynak limitleri için pratik kontrol listesi."
category: "devops-cloud"
tags: ["docker", "containers", "devops", "best-practices"]
publishedAt: "2026-04-17"
seoTitle: "Üretim İçin Docker En İyi Pratikleri (2026)"
seoDescription: "Docker en iyi pratikleri kontrol listesi: multi-stage build, root olmayan kullanıcı, imaj tarama, sağlık kontrolü ve kaynak limitleri ile üretime hazır konteynerler."
---

Üretim için Docker en iyi pratikleri; küçük ve sabit taban imajları, root olmayan kullanıcı, multi-stage build, imaj tarama, sağlık kontrolleri ve kaynak limitleri etrafında toplanır. Bu altı adım imaj boyutunu düşürür, saldırı yüzeyini daraltır ve gece 3'te alacağınız çağrı sayısını azaltır. Aşağıda hepsini komutlarla anlatan bir kontrol listesi var.

Bu yazı bir kavram anlatımı değil, sahada kullandığımız bir denetim listesi. Her maddeyi bir Node.js API'sini üretime taşırken bizzat çalıştırdık; imaj boyutunu 1.1 GB'tan 180 MB'a indiren adımları da paylaşıyoruz.

## Üretim için Docker en iyi pratikleri kontrol listesi nedir?

Kısa cevap: Üretime çıkmadan önce her imajın geçmesi gereten on kontrol var. Bunları CI hattınıza gömün ki insan hatasına bağlı kalmasın. Aşağıdaki tablo her maddeyi, riskini ve tek satırlık çözümünü özetliyor.

| Kontrol | Neden önemli | Hızlı çözüm |
|---------|--------------|-------------|
| Sabit taban imajı etiketi | `latest` her build'de değişir | `node:22.14-alpine3.21` gibi kesin sürüm |
| Multi-stage build | Derleme araçları imajda kalmasın | `AS build` + `AS runtime` |
| Root olmayan kullanıcı | Konteyner kaçışında hasarı sınırlar | `USER app` |
| .dockerignore | Sırlar ve `node_modules` sızmasın | `.git`, `.env`, `node_modules` |
| Katman önbelleği | Yavaş build'ler CI'yi tıkar | Önce bağımlılıkları kopyala |
| Sağlık kontrolü | Orkestratör ölü konteyneri bilsin | `HEALTHCHECK` yönergesi |
| Kaynak limitleri | Bir konteyner host'u boğmasın | `--memory`, `--cpus` |
| İmaj tarama | Bilinen CVE'leri yakala | `docker scout cves` |
| Salt okunur dosya sistemi | Çalışma anında değişikliği engelle | `--read-only` |
| Sır yönetimi | Sırlar katmanlara gömülmesin | BuildKit secrets |

## Neden multi-stage build kullanmalısınız?

Multi-stage build, derleme aşamasını çalışma aşamasından ayırarak nihai imajdan derleyicileri, geliştirme bağımlılıklarını ve ara dosyaları çıkarır. Sonuç genellikle 5-10 kat daha küçük bir imaj ve belirgin biçimde daralmış bir saldırı yüzeyidir. Bu, Docker en iyi pratikleri arasında en yüksek getirili tek adımdır.

Tek aşamalı bir Node imajını üretime alırken 1.1 GB ile başladık. Multi-stage'e geçince aynı uygulama 180 MB'a düştü, çünkü `devDependencies` ve derleme çıktıları son katmana hiç girmedi. Daha küçük imaj yalnızca disk tasarrufu değildir: çekme (pull) süresi kısalır, dağıtımlar hızlanır ve saldırgana sunulan ikili dosya sayısı azalır.

Pratik bir kural: son aşamaya yalnızca çalışma anında gereken şeyleri kopyalayın. Derleyiciler, test araçları, `git` geçmişi ve kaynak `.ts` dosyaları çalışma imajında işe yaramaz. `COPY --from=build` ile sadece derlenmiş çıktıyı taşıyın.

```dockerfile
# 1. Aşama: derleme
FROM node:22.14-alpine3.21 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 2. Aşama: çalışma
FROM node:22.14-alpine3.21 AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD node healthcheck.js || exit 1
CMD ["node", "dist/server.js"]
```

## Konteynerleri root olmayan kullanıcıyla nasıl çalıştırırsınız?

Dockerfile'a `USER` yönergesi ekleyerek konteyneri ayrıcalıksız bir kullanıcıyla çalıştırın. Varsayılan olarak konteynerler root olarak çalışır; bir saldırgan uygulamadan kaçarsa host üzerinde root yetkileri elde etme riski doğar. Root olmayan kullanıcı, bu senaryoda hasarı ciddi biçimde sınırlar.

Alpine tabanlı resmi Node imajları hazır bir `node` kullanıcısı getirir; sadece `USER node` yazmanız yeter. Özel bir imajda kullanıcıyı kendiniz oluşturun:

```dockerfile
RUN addgroup -S app && adduser -S app -G app
USER app
```

Doğrulaması basit: `docker exec <konteyner> whoami` çıktısı `root` değil, `app` veya `node` dönmeli. Kubernetes kullanıyorsanız aynı garantiyi `securityContext.runAsNonRoot: true` ile pod düzeyinde zorunlu kılın.

## Docker imajlarını güvenlik açıklarına karşı nasıl tararsınız?

İmajları CI hattında `docker scout cves` veya Trivy ile tarayarak bilinen CVE'leri üretime çıkmadan yakalayın. 2026 itibarıyla Docker Scout, Docker Desktop ve CLI ile birlikte gelir; ayrı kurulum gerektirmez. Tarama adımını build'in hemen ardına koyun ve yüksek/kritik açıkta build'i düşürün.

```bash
# Yerelde hızlı kontrol
docker scout cves my-api:1.4.0

# CI'de kritik/yüksek açıkta başarısız ol
docker scout cves --exit-code --only-severity critical,high my-api:1.4.0
```

Gerçek bir olayda, taban imajını üç ay güncellememiş bir ekipte tarama tek seferde yedi kritik `openssl` CVE'si yakaladı. Çözüm koda değil, taban imaj etiketini güncel yamalı sürüme almaya dayanıyordu. Ders: taramayı düzenli çalıştırın, sadece ilk sürümde değil.

## Katman önbelleğini nasıl optimize edersiniz?

Sık değişmeyen katmanları Dockerfile'ın üstüne koyarak Docker'ın önbelleğini en verimli şekilde kullanın. Docker her yönergeyi bir katman olarak önbelleğe alır; bir katman değişirse altındaki tüm katmanlar yeniden kurulur. Bağımlılıkları kaynak kodundan önce kopyalamak, kod değiştiğinde `npm ci` adımının önbellekten gelmesini sağlar.

Sıralamayı yanlış yaptığınızda her küçük kod değişikliğinde tüm bağımlılıklar yeniden kurulur ve CI süreniz katlanır. Doğru sıralama şu:

1. Taban imajı seç (`FROM`)
2. Çalışma dizinini ayarla (`WORKDIR`)
3. Yalnızca bağımlılık manifestini kopyala (`COPY package*.json ./`)
4. Bağımlılıkları kur (`RUN npm ci`)
5. Uygulama kaynağını kopyala (`COPY . .`)
6. Derle (`RUN npm run build`)

BuildKit'i açık tutun (2026'da varsayılan) ve `--mount=type=cache` ile paket yöneticisi önbelleğini build'ler arası kalıcı hale getirin. Bu, temiz build'lerde bile bağımlılık indirmelerini hızlandırır.

## Konteynerlere sağlık kontrolü ve kaynak limitleri nasıl eklenir?

`HEALTHCHECK` yönergesiyle konteynerin gerçekten hizmet verdiğini, `--memory` ve `--cpus` bayraklarıyla da kaynak tüketiminin sınırlı kaldığını garanti edin. Sağlık kontrolü olmadan orkestratör, süreç ayakta ama uygulama takılıysa bunu fark edemez. Limit olmadan tek bir sızıntı tüm host'u boğabilir.

```bash
docker run -d \
  --name my-api \
  --memory=512m \
  --cpus=1.5 \
  --read-only \
  --tmpfs /tmp \
  --restart=on-failure:5 \
  my-api:1.4.0
```

Compose veya Kubernetes kullanıyorsanız aynı ayarları bildirimsel dosyalarda tutun. Kubernetes'te `resources.limits` ve `livenessProbe`/`readinessProbe` ile bunları eşleyin; `readinessProbe`, hazır olmayan pod'a trafik gitmesini engeller.

Ek olarak `--restart=on-failure:5`, çöken bir konteyneri sınırlı sayıda yeniden başlatır; sonsuz döngüde CPU yakmasını engeller. `--read-only` ile kök dosya sistemini salt okunur yapıp yalnızca `/tmp` gibi gereken dizinleri `--tmpfs` ile yazılabilir bırakmak, çalışma anında beklenmedik dosya değişikliklerini büyük ölçüde kapatır.

Konteyner güvenliğini derinleştirmek için [konteyner güvenliği temelleri](/tr/blog/konteyner-guvenligi) ve orkestrasyon tarafında [Kubernetes üretim kurulumu](/tr/blog/kubernetes-uretim-kurulumu) yazılarımıza göz atın. Tüm konuları [DevOps ve bulut](/tr/blog/kategori/devops-cloud) kategorisinde topluyoruz.

## Sıkça Sorulan Sorular

### Alpine mi yoksa distroless imaj mı daha iyi?
İkisi de küçük ve güvenlidir. Alpine, kabuk ve paket yöneticisiyle geldiği için hata ayıklaması kolaydır. Distroless imajlar kabuk bile içermez, bu yüzden saldırı yüzeyi en dardır ama sorun gidermesi zordur. Üretimde en yüksek güvenlik için distroless, geliştirici konforu için Alpine tercih edin.

### İmaj boyutunu düşürmenin en hızlı yolu nedir?
Multi-stage build. Derleme araçlarını ve geliştirme bağımlılıklarını son imajdan çıkararak tek başına genellikle 5-10 kat küçülme sağlar. Ardından Alpine veya distroless taban imaja geçmek ek kazanç verir.

### Sırları Dockerfile'da nasıl güvenli tutarım?
Sırları asla `ENV` veya `ARG` ile geçirmeyin; katmanlara gömülür ve `docker history` ile okunabilir. Bunun yerine BuildKit'in `--mount=type=secret` özelliğini kullanın; çalışma anında sırlar için ise ortam değişkenlerini veya bir sır yöneticisini (Vault, AWS Secrets Manager) çalıştırma sırasında enjekte edin.

### `latest` etiketini üretimde kullanmalı mıyım?
Hayır. `latest` her build'de farklı bir imaja işaret edebilir, bu da tekrar üretilebilirliği bozar ve sessiz kırılmalara yol açar. Her zaman `node:22.14-alpine3.21` gibi sabit, sürüm sabitlenmiş etiketler kullanın ve mümkünse imajı digest (`@sha256:...`) ile sabitleyin.
