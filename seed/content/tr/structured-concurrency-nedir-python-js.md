---
title: "Structured Concurrency Nedir? Python ve JS'te Kullanımı"
slug: "structured-concurrency-nedir-python-js"
translationKey: "structured-concurrency-explained-2026"
locale: "tr"
excerpt: "Structured concurrency, bir üst görevin tüm alt görevleri bitmeden sona eremediği; bir alt görev patlarsa kardeşlerinin iptal edildiği bir örüntü."
category: "software-engineering"
tags: ["python", "backend", "best-practices", "system-design"]
publishedAt: "2026-10-18"
seoTitle: "Structured Concurrency Nedir? Python ve JS Örnekleri"
seoDescription: "Structured concurrency, üst görevin ömrünü alt görevlere bağlar. Python'un asyncio.TaskGroup'u ile JS'teki AbortController örüntüsünü karşılaştırıyoruz."
---

Structured concurrency, bir üst görevin ömrünün alt görevlerinin ömrünü sıkı sıkıya kapsadığı anlamına geliyor: üst görev, başlattığı her alt görev bitmeden tamamlanamıyor ve bir alt görev başarısız olursa kardeşleri iptal edilip hata üst göreve öngörülebilir şekilde yayılıyor. Tersi — yaratıcısından daha uzun yaşayabilen, "fırlat ve unut" tarzı yapısal olmayan görevler — sızan arka plan işlerinin ve yutulan istisnaların genelde geldiği yer.

## Structured concurrency gerçekte hangi sorunu çözüyor?

Sessizce çalışmayı sürdüren, görünmez şekilde başarısız olan veya onu başlatan kod ilerledikten sonra hiç temizlenmeyen görevleri çözüyor. Klasik bir hata: `asyncio.create_task()` çağırırsınız veya goroutine tarzı bir arka plan işi başlatırsınız, çağıran fonksiyon döner ve o görev daha sonra bir hata fırlatırsa kimse dinlemiyor olur — istisna ya bir olay döngüsünün varsayılan işleyicisinde kaybolur ya da süreci, hatanın asıl bulunduğu yerle ilgisiz bir noktada çökertir.

Nathaniel J. Smith'in "Notes on structured concurrency, or: Go statement considered harmful" denemesi bu örüntüyü adlandırdı ve yapısal olmayan eşzamanlılık ilkellerinin, async dünyasının `goto` karşılığı olduğunu savundu: teknik olarak güçlü ama bir kod bloğunun ne yapabileceğini yerel olarak akıl yürütmeyi imkânsız kılıyor, çünkü başlatılan bir görevin ömrü hiçbir kapsayan kapsama bağlı değil. Python için yazdığı Trio kütüphanesi, alternatifin erken ve etkili bir uygulamasıydı.

## Python'un asyncio.TaskGroup'u bunu nasıl uyguluyor?

Python 3.11'de eklenen [`asyncio.TaskGroup`](https://docs.python.org/3/library/asyncio-task.html#task-groups), bir alt görev kümesini tek bir `async with` bloğuna bağlıyor: blok, içindeki her görev bitmeden çıkmıyor ve herhangi bir görev (`CancelledError` dışında) hata fırlatırsa grup kalan görevleri iptal ediyor ve yalnızca ilk hatayı değil, toplanan her hatayı içeren bir [`ExceptionGroup`](https://docs.python.org/3/library/exceptions.html#ExceptionGroup) fırlatıyor.

```python
import asyncio

async def fetch_user(user_id: int) -> dict:
    await asyncio.sleep(0.1)
    if user_id == 3:
        raise ValueError(f"user {user_id} not found")
    return {"id": user_id, "name": f"user-{user_id}"}

async def fetch_all(ids: list[int]) -> list[dict]:
    results = []
    try:
        async with asyncio.TaskGroup() as tg:
            tasks = [tg.create_task(fetch_user(i)) for i in ids]
        results = [t.result() for t in tasks]
    except* ValueError as eg:
        for exc in eg.exceptions:
            print(f"basarisiz: {exc}")
    return results
```

`fetch_user(3)` hata fırlatırsa, `TaskGroup` devam eden diğer istekleri anlamsızca çalışmaya bırakmak yerine hemen iptal ediyor; [PEP 654](https://peps.python.org/pep-0654/)'ten gelen `except*` ise diğer istisna türlerini yaymaya bırakırken `ValueError` örneklerini özellikle ele almanıza izin veriyor. Potansiyel olarak birçok eşzamanlı hata arasında türe göre bu seçici ele alış, beklenen görevlerin bir listesi etrafında düz bir `try/except`'in size temiz biçimde veremeyeceği kısım.

## JavaScript'in yerleşik bir karşılığı var mı?

Doğal olarak yok — JavaScript'in, başarısızlık durumunda kardeş işlemleri otomatik iptal eden `TaskGroup`'a denk yerleşik bir ilkeli bulunmuyor. En yaygın yaklaşım el ile yapılan bir örüntü: bir üst görevin, alt işlemlerden biri başarısız olduğunda veya üst görevin kendisi durması gerektiğinde bir grup alt işlemi iptal edebilmesi için bir [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) bağlamak.

```javascript
async function fetchAll(ids) {
  const controller = new AbortController();
  const { signal } = controller;

  const tasks = ids.map(async (id) => {
    try {
      const res = await fetch(`/api/users/${id}`, { signal });
      if (!res.ok) throw new Error(`user ${id}: ${res.status}`);
      return await res.json();
    } catch (err) {
      controller.abort();
      throw err;
    }
  });

  return Promise.allSettled(tasks);
}
```

Bu, structured concurrency'ye yaklaşıyor — bir başarısızlık diğerlerini iptal ediyor — ama bu bir dil garantisi değil, her seferinde elle inşa ettiğiniz bir şey. `Promise.allSettled` her şeyin bitmesini beklerken, `Promise.all` siz `AbortController`'ı kendiniz bağlamadıkça diğerlerini otomatik iptal etmeden ilk başarısızlıkta reddediyor ve hiçbir şey, gelecekteki bir katkıcının `abort` çağrısını tamamen unutmasını önlemiyor.

## Structured ve yapısal olmayan eşzamanlılık gerçekte nasıl kıyaslanıyor?

Pratik farklar, ekiplerin sabahın 3'ünde hata ayıkladığı tam o senaryolarda ortaya çıkıyor — kardeşlere ne olduğu, hataların nerede göründüğü ve bir görevin kendisini yaratan kapsamdan daha uzun yaşayıp yaşamadığı.

| Özellik | Yapısal olmayan (fırlat ve unut) | Structured (TaskGroup / coroutineScope / Swift TaskGroup) |
|---|---|---|
| Alt görev ömrü | Yaratıcısından daha uzun yaşayabilir | Kapsayan kapsama bağlı |
| Bir alt görev başarısız olursa | Diğerleri habersiz çalışmayı sürdürür | Kardeşler iptal edilir |
| Hata görünürlüğü | Sessizce yutulması kolay | Varsayılan olarak üst göreve yayılır |
| Aynı anda birden çok başarısızlık | Genelde yalnızca ilki görülür | Birlikte toplanır (örn. `ExceptionGroup`) |
| Temizlik garantisi | Elle, unutulması kolay | Kapsamın çıkışıyla zorunlu kılınır |

Kotlin'in coroutine'leri (`coroutineScope`, `supervisorScope`) ve Swift'in eşzamanlılık modeli (`TaskGroup`, `async let`), aynı temel fikrin dil seviyesindeki uygulamaları olarak sıklıkla gösteriliyor: bir kapsam kendi alt görevlerinin ömrüne sahip oluyor ve içlerinden biri hâlâ çalışırken kapsam kapanamıyor.

## Yapısal olmayan eşzamanlılık hâlâ ne zaman doğru seçim?

Nadiren, ama gerçekten bağımsız arka plan işleri için var olmaya devam ediyor — amacı özellikle kendisini tetikleyen istek veya fonksiyondan daha uzun yaşamak olan bir görev, örneğin fırlat-unut bir denetim günlüğü yazımı veya başarısızlığın çağıranı etkilememesine bilerek karar verdiğiniz en iyi-çaba bir önbellek ısıtma işlemi gibi. O durumda bile, açık bir hata işleme (bir `.catch()` veya günlüğe kaydedilen bir geri çağırma) eklemeye değer; çünkü structured concurrency'nin en pratik faydası — başarısızlığı birinin sorumluluğu yapmak — sonucu beklememeyi bilerek seçtiğinizde de geçerliliğini sürdürüyor.

Dürüst görüşüm: production kod tabanlarındaki "fırlat ve unut" görevlerin çoğu bilinçli bir tasarım kararı değil, birinin günlüklerde takip etmek zorunda kalacağı bir hata; çünkü görev başarısız olduğunda kimse izlemiyordu. Belirli bir ayırma nedeniniz olmadan `asyncio.create_task()`'a veya beklenmemiş bir promise'e başvuruyorsanız, `TaskGroup` veya açık bir `AbortController` örüntüsü çoğunlukla daha güvenli varsayılan — ve JavaScript'in yerleşik bir karşılığı olmaması, Python'a kıyasla gerçek bir ergonomi maliyeti.

[Yaygın eşzamanlılık hatalarına](/tr/posts/eszamanlilik-hatalari-kacinma-yollari) daha önce çarpmış ekipler bu örüntüyü hemen tanıyor: o hataların yarısı gerçekte "artık önemsemediğimiz bir görev çalışmayı sürdürdü" hatası. [Önbellek geçersizleştirmeyi](/tr/posts/cache-stratejileri-gecersiz-kilma) daha güvenli yapan disiplin — hangi işlemlerin hâlâ devam ettiğini ve onları temizlemenin kimin sorumluluğunda olduğunu tam olarak bilmek — structured concurrency'nin async görevler için zorunlu kıldığı aynı disiplin. [Kesintisiz veritabanı göçleri](/tr/posts/kesintisiz-veritabani-gocu) çalıştırıyorsanız da aynı soru geçerli: her arka plan adımının, başarısız olduğunda hâlâ onu izleyen bir sahibi var mı?

## Sıkça Sorulan Sorular

### Structured concurrency basitçe ne anlama gelir?
Structured concurrency, bir üst görevin başlattığı tüm alt görevler bitmeden tamamlanamaması ve bir alt görev başarısız olursa üst görevin diğerlerini anlamsızca çalışmaya bırakmak yerine iptal etmesi anlamına geliyor. Ömrü hiçbir şeye bağlı olmayan fırlat-unut görevlerin yerine, ömrü kapsayan bir kapsama bağlı görevler koyuyor.

### Python'un asyncio.TaskGroup'u asyncio.gather()'ın yerini mi alıyor?
Tam olarak değil, ama yaygın durumu daha iyi kapsıyor. `asyncio.gather()`, siz `return_exceptions=True` geçip hataları kendiniz ele almadığınız sürece bir görev başarısız olduktan sonra diğerlerini çalışmaya bırakabilirken, `TaskGroup` ele alınmamış bir hatada kardeşleri otomatik iptal ediyor ve her istisnayı, `except*`'in türe göre süzebileceği bir `ExceptionGroup`'ta topluyor.

### JavaScript'te Python'daki gibi yerleşik bir TaskGroup neden yok?
JavaScript'in `Promise` ve `async`/`await` modeli, alt görevlerinin iptalini sahiplenen bir kapsam etrafında hiç tasarlanmadı; iptal daha sonra `AbortController` ile eklendi ve bunu her işleme elle bağlamanız gerekiyor. Bugün, biri başarısız olduğunda kardeş promise'leri otomatik iptal eden dil seviyesinde bir ilkel yok; ekipler bu davranışı kendileri inşa ediyor.

### Structured concurrency, Kotlin'in coroutineScope'u veya Swift'in TaskGroup'uyla aynı şey mi?
Dil seviyesinde aynı temel fikri uyguluyorlar: bir kapsam, içinde yaratılan görevlerin ömrüne sahip oluyor ve alt görevlerden biri hâlâ çalışırken kapsam çıkamıyor. Tam iptal ve hata yayma ayrıntıları dile göre değişiyor, ama temel garanti — üst görevin alt görevlerini görmezden gelerek daha uzun yaşayamaması — Python'un `asyncio.TaskGroup`'unun async koda getirdiği aynı örüntü.
