---
title: "CI'da Claude Code ile Otomatik Düzeltme Nasıl Yapılır?"
slug: "ci-claude-code-otomatik-duzeltme"
translationKey: "claude-code-ci-automated-fixes-2026"
locale: "tr"
excerpt: "Claude Code'u pipeline'ınızda sınırlı izin modu ve sıfır secret erişimiyle headless çalıştırın; main'e push yerine PR açsın, düzeltmesini asla merge etmesin."
category: "devops-cloud"
tags: ["claude", "ci-cd", "automation", "ai-coding"]
publishedAt: "2026-11-24"
seoTitle: "CI'da Claude Code: Güvenle Otomatik Düzeltme"
seoDescription: "Claude Code'u CI'da sınırlı izin modu ve sıfır secret erişimiyle headless çalıştırın; doğrudan push etmesin, otomatik merge etmesin, sadece PR açsın."
---

Kısa cevap: Claude Code'u kırmızı build'de tetiklenen, secret erişimi olmayan sandboxlanmış bir checkout'ta çalışan ve her yere doğrudan push etmek yerine düzeltmesiyle bir pull request açan headless bir pipeline adımı olarak bağlayın. Flaky bir testte veya bir lint hatasında kırılan build, onu bozan mühendis ikinci kahvesini içmeden önce incelemeye hazır bir PR'a sahip olabilir — ama ancak korkuluklar ilk çalıştırmadan önce yerinde olursa, sonra değil.

## Claude Code ile CI otomasyonu gerçekten ne zaman karşılığını veriyor?

Mekanik ve sınırlı hata kategorilerinde karşılığını veriyor: formatlama ihlalleri, güncelliğini kaybetmiş bir snapshot testi, lint'in işaretlediği bir import, bir bağımlılık güncellemesinin öngörülebilir şekilde bir assertion'ı kırması. Bunlar, "ne değişti" ve "düzeltme neye benziyor"un her ikisinin de dar olduğu hatalar — otomatik bir düzeltmenin yanlış olsa bile doğrulamasının ucuz olduğu yer tam olarak burası.

Yargı gerektiren her şeyde karşılığını vermeyi bırakıyor — ve gürültü üretmeye başlıyor: gerçek bir tasarım sorununa işaret edebilecek başarısız bir entegrasyon testi, şanssızlık yerine bir race condition yüzünden flaky olan bir test, iş mantığına dokunan bir regresyon. Bunları otomatik bir düzeltmeye yönlendirmek ya gerçek hatayı gizleyen makul görünümlü bir yama üretir ya da bir insan kararı olmadan asla başarılı olmayacak yeniden denemelerde CI dakikalarını yakar. Filtre basit: kıdemli bir mühendis otuz saniyeden fazla düşünmeden düzeltecekse otomatikleştirin; bir tasarım tartışması açacaksa açmayın.

## Claude Code'u bir pipeline'da gerçekten nasıl headless çalıştırırsınız?

Claude Code, CI bağlamı için açıkça ayarlanmış bir prompt ve izin moduyla etkileşimsiz çalışıyor — yerel terminal oturumunuzun sahip olduğu izinlerin aynısını istemezsiniz. Minimal bir örüntü:

```yaml
- name: Claude Code auto-fix
  if: failure()
  run: |
    claude -p "Build basarisiz oldu. ./ci-output.log icindeki CI
    loglarini oku, sadece tanimlanan belirli hatayi duzelt
    ve ilgisiz dosyalara dokunma. Bir PR ac; main'e push etme." \
      --permission-mode plan \
      --allowedTools "Read,Edit,Bash(npm test:*)" \
  env:
    ANTHROPIC_API_KEY: ${{ secrets.CLAUDE_CODE_CI_KEY }}
```

`--allowedTools`'u düzeltme kategorisinin ihtiyacı olan en küçük kümeye sınırlayın — bir linter düzeltmesi genel bir shell değil, `Edit` ve bir formatter komutu istiyor. Pratikte bu, her hata kategorisi için ayrı bir CI adımı tanımlamak anlamına gelir: lint düzeltmesi sadece `Edit` ve `Bash(npm run lint:fix)` görsün, bağımlılık güncellemesi kırılması ise ayrıca `Bash(npm install)` görsün ama ikisi de genel bir `Bash(*)` izni asla almasın. Bu ayrım sıkıcı görünse de, bir düzeltme görevinin kapsamını aşıp repo'nun ilgisiz bir köşesine dokunmasını engelleyen şey tam olarak bu — geniş bir izin kümesi "daha esnek" değil, sadece daha az denetlenebilir.

Bu ayrımı kurmanın pratik faydası şurada ortaya çıkıyor: bir düzeltme yanlış giderse, hangi dosyalara dokunabildiğini ve hangi komutları çalıştırabildiğini bilmek, diff'i incelerken aradığınız şeyi daraltıyor. `--allowedTools` geniş tutulduğunda bir incelemeci "bu değişiklik neden burada" sorusunu her satırda sormak zorunda kalır; dar tutulduğunda ise beklenen değişikliğin sınırları zaten baştan belli olur ve inceleme, sürprizleri yakalamaya odaklanabilir.

Anthropic'in 19 Kasım 2026'da Claude Code 2.1.328 ile Amazon Bedrock, Google Cloud'un Agent Platform'u ve Microsoft Foundry'ye taşıdığı auto mode'u burada özellikle açmaya değer; çünkü rutin düzenlemeleri sınıflandırıp daha hızlı bir geçişten yönlendiriyor — tam olarak bir lint düzeltmesinin veya bir snapshot güncellemesinin profili, yargı ağırlıklı bir debug oturumunun aksine.

## Bunu gerçekten güvenli tutan korkuluklar ne?

İşin neredeyse tamamını üç kural yapıyor. Birincisi, Claude Code bir pull request açıyor ve korumalı bir dala asla push etmiyor veya kendi başına merge etmiyor — her değişiklik gönderilmeden önce bir insan onaylıyor, nokta. İkincisi, CI işinin kimlik bilgileri, belirli düzeltme kategorisinin ihtiyaç duyduğundan fazlasına ve kesinlikle altyapıya yazma erişimi olan hiçbir şeye erişim taşımıyor; Claude Code'un kendi [sandbox bash izinleri](/tr/posts/claude-code-sandbox-bash-izinleri) ve [--restricted modu](/tr/posts/claude-code-restricted-mode-nedir) tam olarak bu sınırı, umduğunuz bir politika olmaktan çıkarıp uygulanabilir kılmak için var. Üçüncüsü, dar ve yanlışlanabilir bir talimat verin — "CI'ı geçir" değil "bu belirli başarısız assertion'ı düzelt" — çünkü belirsiz bir hedef, hatayı düzeltmek yerine testi devre dışı bırakan bir düzeltici davet eder.

| Korkuluk | Önlediği şey |
|---|---|
| PR açmak, asla otomatik merge etmemek | İncelenmemiş bir değişikliğin production'a ulaşması |
| Sınırlı `--allowedTools`, düzeltme kategorisinin dışında shell yok | Repo'nun ilgisiz kısımlarına yanal hareket |
| CI işinin kendi dar kapsamının dışında secret erişimi yok | Ele geçirilmiş veya kafası karışmış bir çalıştırma yoluyla kimlik bilgisi sızıntısı |
| Gerçek CI hatasına bağlı, dar ve spesifik prompt | Asıl hatayı düzeltmek yerine bir testi devre dışı bırakmak |

Anthropic'in Kasım ayındaki sürümleri, CI'ın dışında da aynı duruşu güçlendiriyor: Claude Code 2.1.330 artık root, home veya çalışma dizinini hedefleyen daha fazla `rm` komutu için onay istiyor; 2.1.329 ise bir repository'nin hook'larının tam olarak nerede tanımlandığını, çalışmadan önce gösteren bir güven diyaloğu uyarısı ekledi. Yön tutarlı: yıkıcı veya opak herhangi bir şeyden önce daha fazla onay — bu, bir CI korkuluğunun da uygulaması gereken aynı ilke.

## Bir insan botun diff'ini nasıl incelemeli?

Güvenilir bir sistemin otomatik eylemi gibi değil, bir junior mühendisin PR'ı gibi davranın — kırmızıdan yeşile geçen test çıktısını değil, diff'in tamamını okuyun. Düzeltmenin asıl hatayı mı ele aldığını yoksa onu mu dolandığını özellikle kontrol edin: yeni, doğru çıktıyla eşleşen bir snapshot güncellemesi sorun değil; sadece bir regresyonu kodlayan bir snapshot güncellemesi sorun ve statik bir CI kontrolü ikisini birbirinden ayırt edemez. [CI'da Claude Code review ile PR kapısı kurmak](/tr/posts/cida-claude-code-review-ile-pr-kapisi-kurun) bu döngünün inceleme tarafını daha ayrıntılı ele alıyor — düzeltmeyi yazabilen aynı araç, başka birinin düzeltmesini de inceleyebilir ve ikisini birden çalıştırmak gereksiz değil, çünkü farklı şekilde prompt'lanmış ikinci bir geçiş, ilkinden farklı bir hata sınıfını yakalar.

## Tüm bunlar çalışırken bile ne manuel kalmalı?

Bir kullanıcının gözlemleyebileceği davranışı değiştiren her şey, kimlik doğrulama veya ödemelere dokunan her şey ve "düzeltme"nin üç farklı mühendis için makul şekilde üç farklı şey anlamına gelebileceği her şey. Build hatalarınızın mekanik kuyruğunu — formatlama, flaky-ama-gerçekte-bozuk-olmayan testler, bağımlılık güncellemesi kırılması — otomatikleştirin ve yargı gerektiren kararları, yanlış çıktığında nöbetçi olacak kişiye bırakın.

Dürüst görüşüm: burada ilginç olan kısım Claude Code'un düzeltmeyi yazabilmesi değil — çoğu ekibin gerçek darboğazının hiçbir zaman "bir AI bir lint hatasını düzeltebilir mi" olmaması, "korkuluğa, denemesine izin verecek kadar güveniyor muyuz" olması. Önce izin kapsamını ve sadece-PR kuralını doğru alın; bunun değmeye değer olduğu sınırlı hata kategorilerinde düzeltme kalitesi kendiliğinden hallolur.

Birincil kaynak: [Claude Code'un değişiklik günlüğü](https://code.claude.com/docs/en/changelog).

## Sıkça Sorulan Sorular

### Claude Code CI'da düzeltmeleri doğrudan main'e push edebilir mi?

Bunun için yapılandırılmamalı. Güvenli örüntü, Claude Code'un CI tetikli her düzeltme için bir pull request açması ve merge'den önce insan onayı gerektirmesi — ona asla korumalı bir dala push erişimi vermeyin veya kendi değişikliğini merge etmesine izin vermeyin.

### CI tetikli bir Claude Code çalıştırması hangi izinlere sahip olmalı?

Belirli düzeltme kategorisinin ihtiyaç duyduğu en dar küme — tipik olarak `Read` ve `Edit`, test çalıştırmak için tek bir sınırlı `Bash` komutu, daha geniş bir shell erişimi yok ve o CI işinin kendi dar amacı için zaten ihtiyaç duyduğundan fazla kimlik bilgisi yok. Bu kapsamın dışında secret erişimi yok.

### Claude Code'un auto mode'u Bedrock veya Google Cloud'daki kurumsal CI ortamlarında çalışıyor mu?

Evet. Anthropic, Claude Opus 4.6 ve Sonnet 4.6 için auto mode'u, 19 Kasım 2026'daki Claude Code 2.1.328 sürümüyle Amazon Bedrock, Google Cloud'un Agent Platform'u ve Microsoft Foundry'ye taşıdı; bu, bu sağlayıcılardan herhangi birine karşı yapılandırılmış CI çalıştırıcılarını kapsıyor.

### Claude Code ile hangi CI hatalarını otomatikleştirmek güvenli?

Mekanik, sınırlı hatalar: formatlama ve lint ihlalleri, yeni doğru çıktıyla eşleşmesi gereken güncelliğini kaybetmiş snapshot'lar ve bir bağımlılık güncellemesinden kaynaklanan öngörülebilir kırılma. Race condition'lardan kaynaklanan flaky testler veya iş mantığına dokunan regresyonlar gibi yargı gerektiren hatalar için düzeltmeleri otomatikleştirmekten kaçının.
