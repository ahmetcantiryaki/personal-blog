---
title: "Ölçeklenen Hata Yönetimi Desenleri"
slug: "olceklenen-hata-yonetimi-desenleri"
translationKey: "error-handling-patterns-guide"
locale: "tr"
excerpt: "Hata değeri mi exception mı kullanmalısınız, nerede yakalayıp nerede yaymalısınız ve correlation ID'yi nasıl kuracağınızı gösteren pratik bir alan notu."
category: "software-engineering"
tags: ["best-practices", "code-quality", "observability", "backend"]
publishedAt: "2026-08-18"
seoTitle: "Ölçeklenen Hata Yönetimi Desenleri"
seoDescription: "Hata değeri mi exception mı kullanmalısınız, nerede yakalayıp nerede yaymalısınız ve correlation ID'yi nasıl kuracağınızı gösteren pratik bir alan notu."
---

Kısa cevap: beklenen, iş akışının parçası olan durumları (doğrulama hatası, bulunamayan kayıt) değer olarak döndürün; gerçekten beklenmedik, kurtarılamaz durumları exception'a bırakın. İkisini karıştırmak, çağrı zincirinin ortasında hangi hatanın normal hangisinin acil olduğunu anlamayı imkânsız hale getirir. Bu yazı, prodüksiyonda saatlerce debug ettiğim gerçek olaylardan çıkardığım desenleri topluyor.

## Hata olarak değer mi, exception mı kullanmalıyım?

Kısa cevap: fonksiyonun normal iş akışının bir parçası olan başarısızlıklarda (kullanıcı girdisi geçersiz, kayıt yok, ödeme reddedildi) hata değeri döndürün; programlama hatası veya gerçekten kurtarılamaz durumlarda (bellek yetmedi, panic, invariant ihlali) exception fırlatın. Ağustos 2026 itibarıyla Go, Rust, Zig gibi diller değer tabanlı hatayı varsayılan yapmış durumda; bu tesadüf değil, üretimde hangi hatanın nerede ele alınacağını okunur kılıyor.

Exception'ların asıl sorunu performans değil — modern JIT'lerde stack unwinding maliyeti çoğu zaman abartılıyor. Asıl sorun kontrol akışının görünmez olması: bir fonksiyonun imzasına bakarak hangi hataları fırlatabileceğini anlayamazsınız, dokümantasyona güvenmek zorunda kalırsınız. Değer tabanlı yaklaşımda hata, fonksiyon imzasının bir parçasıdır; derleyici (veya en azından linter) sizi hata durumunu unutmaya karşı uyarır.

Benim çekince duyduğum yaklaşım, exception'ları normal akış kontrolü için kullanmak — "kullanıcı bulunamadı" gibi beklenen bir durum için `throw new NotFoundException` fırlatıp üç katman yukarıda `catch` etmek. Bu, hem performans hem okunabilirlik açısından kötü: çağıran kod, "bu fonksiyon başarısız olabilir mi" sorusuna cevap alamadan kod yazar.

## Typed error / Result tipi nedir, ne zaman kullanılır?

Kısa cevap: `Result<T, E>` (Rust) veya çoklu dönüş değeri (Go'nun `(value, error)` deseni), bir fonksiyonun başarı ya da başarısızlık döndürebileceğini tip sisteminde açıkça kodlar; böylece derleyici hatayı ele almadan devam etmenizi engeller. TypeScript'te aynı fikri kendi `Result<T, E>` union tipinizle veya bir kütüphaneyle (neverthrow gibi) taklit edebilirsiniz.

Rust'ta `?` operatörü, bir `Result` döndüren ifadenin hata dalını otomatik olarak yukarı fırlatır — bu, "hata varsa hemen dön" boilerplate'ini tek karaktere indirir. Go'da aynı iş `if err != nil { return err }` ile elle yapılır; can sıkıcı görünse de her hata noktası kodda açıkça görünür kalır, bu da code review'da hata yönetimini atlamayı zorlaştırır.

```go
type ValidationError struct {
	Field string
	Msg   string
}

func (e *ValidationError) Error() string {
	return fmt.Sprintf("%s: %s", e.Field, e.Msg)
}

func ParseAge(input string) (int, error) {
	age, err := strconv.Atoi(input)
	if err != nil {
		return 0, &ValidationError{Field: "age", Msg: "sayı olmalı"}
	}
	if age < 0 || age > 150 {
		return 0, &ValidationError{Field: "age", Msg: "makul aralıkta değil"}
	}
	return age, nil
}
```

Typed error'ların asıl kazancı, çağıranın `errors.As` (Go) veya pattern matching (Rust) ile hata türüne göre farklı davranabilmesi: doğrulama hatasında 400 döndürün, veritabanı bağlantı hatasında 503 ve retry.

## Hatayı nerede yakalamalı, nerede yaymalıyım?

Kısa cevap: hatayı, onunla ilgili anlamlı bir karar verebileceğiniz ilk katmanda yakalayın — retry yapabiliyorsanız, kullanıcıya alternatif sunabiliyorsanız ya da fallback değeri atayabiliyorsanız orada durun; aksi halde context ekleyip yukarı taşıyın. Ara katmanlarda "belki birileri ilgilenir" diye `catch` edip loglayan ve sonra yutan kod, sistemi hem yavaşlatır hem de hatanın kaynağını gizler.

| Katman | Yakala mı, yay mı? | Neden |
|---|---|---|
| Repository / DB erişimi | Yay (context ekleyerek sar) | Bu bağlantı hatasının kullanıcı için ne anlama geldiğine repository karar veremez |
| Servis / iş mantığı | Yakala, tipine göre çevir | İş kuralı ihlalini (stok yok) domain hatasına çevirmenin yeri burası |
| HTTP handler / API sınırı | Yakala, HTTP status'e çevir | Kullanıcıya dönecek son nokta; burada yutmak değil, çevirmek olmalı |
| Retry/timeout sarmalayıcı | Yakala, koşullu retry | Retry ve backoff mekaniğinin ayrıntısı ayrı bir konudur; burada sadece "bu sınır retry'a uygun mu" kararı verilir |
| Arka plan worker'ın en dışı | Yakala, logla, devam et | Tek bir mesajın hatası kuyruğun tamamını durdurmamalı |

## Hataları context ile nasıl sarmalamalıyım, yutmadan?

Kısa cevap: hatayı yukarı taşırken orijinal hatayı saklayarak ("wrap" ederek) hangi işlemin, hangi girdiyle başarısız olduğunu ekleyin; asla `catch (e) {}` gibi sessizce yutmayın. Go'da `fmt.Errorf("kullanıcı %d güncellenemedi: %w", userID, err)` orijinal hatayı `%w` ile saklar, böylece çağıran `errors.Is` veya `errors.As` ile alttaki hatayı hâlâ inceleyebilir.

Sessizce yutulan hata, bir SRE'nin en çok nefret ettiği şeydir: sistem "çalışıyor" görünür ama aslında sessizce bozuk veri üretiyordur. Gördüğüm en pahalı olaylardan biri, bir ödeme webhook handler'ının imza doğrulama hatasını `catch` edip sadece `console.log` yazıp 200 döndürmesiydi — üç hafta boyunca kimse fark etmedi çünkü hata hiçbir yerde alarm tetiklemedi.

## Kullanıcıya gösterilen hata mesajı ile loglanan hata nasıl ayrılır?

Kısa cevap: kullanıcıya gösterilen mesaj kısa, aksiyona yönlendirici ve iç detay içermemeli ("Kartınız reddedildi, lütfen bankanızla iletişime geçin"); loglanan hata ise stack trace, request ID, iç durum ve hatanın tam nedenini içermeli. İkisini aynı string'den üretmeye çalışmak genelde her iki tarafı da zayıflatır.

Pratikte bu, hata nesnesinin iki alanı olması demek: kullanıcıya güvenle gösterilebilecek bir `userMessage` ve sadece loglara/APM'e giden bir `internalMessage`. Veritabanı şeması, iç servis adları veya stack trace'in kullanıcı arayüzüne sızması hem güvenlik hem UX açısından kötü bir sinyal.

## Correlation ID nedir, neden gerekli?

Kısa cevap: correlation ID (bazı sistemlerde "trace ID"), bir isteğin sisteme girişinden çıkışına kadar geçtiği tüm servislerde aynı kalan benzersiz bir tanımlayıcıdır; loglara eklendiğinde "bu hata hangi kullanıcı isteğinden geldi" sorusunu saniyeler içinde cevaplamanızı sağlar. Ağustos 2026 itibarıyla bunun endüstri standardı W3C Trace Context spesifikasyonudur — `traceparent` ve `tracestate` HTTP başlıkları aracılığıyla trace ID'yi servisler arasında taşır.

OpenTelemetry, W3C Trace Context'i varsayılan propagation formatı olarak benimsedi; bu da OTel ile enstrümante edilmiş herhangi iki servisin, aralarında özel bir anlaşma olmadan aynı trace ID'yi paylaşabileceği anlamına gelir. Structured logging (JSON formatında, sabit alan adlarıyla loglama) ile birleştirildiğinde, `trace_id` alanını tüm log satırlarına eklemek, dağıtık bir hatayı log arama aracında tek sorguyla yeniden birleştirmenizi sağlar. Correlation ID'yi manuel üretmek yerine gelen `traceparent` başlığını okuyup yaymak, kendi ID formatınızı icat etmekten daha sürdürülebilir.

## Retry ve timeout sınırları nereye konmalı?

Kısa cevap: retry ve timeout, hata yönetiminin bir parçası değil, hata yönetiminin *sınırıdır* — bir hatayı yakaladığınız katmanda "bu geçici mi kalıcı mı" sorusunu sorup cevaba göre retry sınırını oraya koyun; ayrıntılı backoff stratejisi ve circuit breaker mekaniği [Retry, Backoff ve Circuit Breaker](/tr/posts/retry-backoff-circuit-breaker) yazısında ele alınıyor. Burada tek kural: retry'ı, hatanın nedenini bilen katmanda uygulayın, en dışta genel bir "her şeyi 3 kez dene" sarmalayıcısında değil.

## Dev'de gürültülü, prod'da zarif başarısız olma nasıl dengelenir?

Kısa cevap: geliştirme ortamında hata anında ve gürültülü şekilde patlamalı (stack trace, tam mesaj, hatta process'i durdurma) çünkü amaç hatayı erken yakalamak; prod'da ise aynı hata kullanıcıya zarif bir mesajla, sisteme ise tam detayla (log + metrik + alert) ulaşmalı. Google SRE kitabının vurguladığı gibi, "sessizce devam et" prod'da bile doğru varsayılan değildir — asıl fark, kullanıcının gördüğü ile operasyon ekibinin gördüğü arasındaki ayrımdır.

Bunu sağlamanın pratik yolu ortam bazlı bir hata sunum katmanı: aynı hata nesnesi hem dev hem prod'da üretilir, sadece dışa sunum farklıdır. Dev'de `NODE_ENV=development` iken tam stack trace döndürüp prod'da genel mesaja düşen bir middleware, bu ayrımı kod tekrarı olmadan sağlar.

## Hata yönetimi kontrol listesi

- Her hata tipi, çağıranın karar verebileceği kadar bilgi taşıyor mu?
- Hatayı sarmalarken orijinal hatayı (`%w`, `source()`, `cause`) koruyor musunuz?
- Kullanıcı mesajı ile log mesajı ayrı mı?
- Her log satırında correlation/trace ID var mı?
- Retry sınırı, hatanın geçici mi kalıcı mı olduğunu bilen katmanda mı?
- Dev ortamında hata sessizce yutulmuyor mu?
- Panic/crash sonrası process düzgün kapanıyor mu (graceful shutdown)?

## Kaçınılması gereken anti-pattern'ler

- **Boş catch bloğu**: `catch (e) {}` — hatayı yutmak, onu asla olmamış gibi göstermek değil, sadece görünmez kılmaktır.
- **Genel `Exception` fırlatmak**: Çağıranın hatayı ayırt etmesini imkânsız hale getirir.
- **String karşılaştırmasıyla hata ayırt etmek**: `if err.Error() == "not found"` — mesaj metni değişirse kod sessizce bozulur.
- **Her yerde retry**: Idempotent olmayan bir işlemi (ödeme, e-posta gönderimi) körü körüne retry etmek.
- **Stack trace'i kullanıcıya göstermek**: Hem güvenlik riski hem kötü UX.
- **Correlation ID'yi loglamayı unutmak**: Dağıtık sistemde bu, hatayı hiç bulamamakla eşdeğer.

## Sıkça Sorulan Sorular

### Result tipi ile exception aynı anda kullanılabilir mi?

Evet, çoğu büyük sistemde ikisi bir arada bulunur: beklenen iş hataları için `Result`/typed error, programlama hataları ve gerçekten kurtarılamaz durumlar için exception. Önemli olan sınırı net çizmek — hangi hataların değer, hangilerinin exception olacağını takım içinde yazılı bir kural haline getirmek.

### Correlation ID ile request ID aynı şey mi?

Hayır, tam olarak değil: request ID genelde tek bir servisteki bir isteği tanımlar, correlation ID (trace ID) ise o isteğin tetiklediği tüm alt servis çağrılarını kapsayan üst kimliktir. W3C Trace Context'te bu ikisi `traceparent` başlığındaki trace ID ve span ID alanlarıyla ayrı ayrı temsil edilir.

### Hata mesajlarını loglarken hangi alanlar mutlaka olmalı?

Zaman damgası, log seviyesi, `trace_id`, hatanın oluştuğu servis/fonksiyon adı ve orijinal hata mesajı minimum settir; structured logging (JSON) kullanmak bu alanları log arama araçlarında filtrelenebilir kılar. Kullanıcıya özel veya gizli bilgi (şifre, token) asla log satırına yazılmamalı.

### Go'da errors.Is ile errors.As arasındaki fark nedir?

`errors.Is`, sarmalanmış hata zincirinde belirli bir hata değerine (örneğin `sql.ErrNoRows`) eşit bir hata olup olmadığını kontrol eder; `errors.As` ise zincirde belirli bir hata *tipine* uyan bir hatayı bulup o tipe cast eder. İkisi de Go 1.13'te tanıtılan `%w` sarmalama desteğiyle birlikte gelir ve sarmalanmış hataları yutmadan inceleme imkânı sağlar.

---

İlgili yazılar: [Retry, Backoff ve Circuit Breaker](/tr/posts/retry-backoff-circuit-breaker), [Observability 101: Log, Metrik ve Trace](/tr/posts/observability-nedir), [OpenTelemetry'e Başlangıç Rehberi](/tr/posts/opentelemetry-baslangic-rehberi), [İdempotent API: Güvenli Yeniden Deneme](/tr/posts/idempotent-api-tasarimi), [Temiz Kod Prensipleri: Pratik Kontrol Listesi](/tr/posts/temiz-kod-prensipleri).

Kaynaklar: [W3C Trace Context](https://www.w3.org/TR/trace-context/), [OpenTelemetry Context Propagation](https://opentelemetry.io/docs/concepts/context-propagation/), [Go 1.13'te Hatalarla Çalışmak](https://go.dev/blog/go1.13-errors), [The Rust Programming Language — Error Handling](https://doc.rust-lang.org/book/ch09-00-error-handling.html).
