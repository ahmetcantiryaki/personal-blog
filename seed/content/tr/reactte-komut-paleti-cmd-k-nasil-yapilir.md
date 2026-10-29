---
title: "React'te Komut Paleti (Cmd+K) Nasıl Yapılır?"
slug: "reactte-komut-paleti-cmd-k-nasil-yapilir"
translationKey: "build-command-palette-react"
locale: "tr"
excerpt: "Kısa cevap: cmdk kütüphanesini bir Dialog içine koy, öğeleri Command.Item olarak listele, Cmd+K ile aç/kapat ve ARIA combobox deseniyle erişilebilir hale getir."
category: "web-development"
tags: ["react", "accessibility", "frontend", "typescript"]
publishedAt: "2026-10-29"
seoTitle: "React'te Cmd+K Komut Paleti Nasıl Kurulur?"
seoDescription: "cmdk ile React'te hızlı, erişilebilir bir komut paletinin nasıl kurulduğunu; arama, gruplama, asenkron eylemler ve klavye desenini gösteriyoruz."
---

Kısa cevap: `cmdk` kütüphanesini kurup `Command.Dialog` bileşenini `Cmd+K` klavye kısayoluyla aç/kapat yapın, öğeleri `Command.Item` olarak listeleyin — kütüphane filtrelemeyi ve sıralamayı otomatik hallediyor. Erişilebilirlik için WAI-ARIA'nın combobox desenini takip etmek, ekran okuyucu kullanıcılarının da paleti sorunsuz kullanabilmesini garanti ediyor; bu da büyüyen bir uygulamada gözden kaçırılan bir kullanıcı grubunu dışarıda bırakmamanızı sağlıyor.

## Cmd+K komut paleti nedir, uygulamalar neden ekliyor?

Bir komut paleti, kullanıcının fareyle menüde gezinmek yerine klavyeden yazarak herhangi bir eyleme (sayfa değiştirme, ayar açma, arama yapma) anında ulaşmasını sağlayan bir arayüz. Linear, Raycast ve VS Code gibi araçların popülerleştirdiği bu desen, güçlü kullanıcıların fareye hiç dokunmadan uygulamanın her köşesine erişmesini sağlıyor — ve bu hız hissi, kullanıcıların uygulamayı "profesyonel" olarak algılamasında ölçülebilir bir fark yaratıyor.

Paletin asıl değeri, uygulamanız büyüdükçe ortaya çıkıyor: menü seviyeleri arttıkça bir eylemi bulmak tıklama sayısını artırırken, komut paleti her eylemi tek bir düz liste haline getirip arama kutusuna indiriyor. Bu yüzden çoğu ekip paleti "nice to have" olarak değil, büyüyen bir uygulamanın navigasyon borç ödemesi olarak ekliyor.

## cmdk kütüphanesi mi, Radix Dialog üzerine sıfırdan mı?

`cmdk`, React 18 gerektiren, istemci bileşeni olarak çalışan ve erişilebilir bir combobox olarak da kullanılabilen, hızlı ve stilsiz bir komut menüsü kütüphanesi. `Command`, `Command.Input`, `Command.List`, `Command.Empty`, `Command.Group`, `Command.Item` ve `Command.Separator` parçalarından oluşuyor; `Command.Dialog` ise paleti bir modal içinde render ediyor. Sıfırdan Radix `Dialog` üzerine kurmak, filtreleme ve klavye navigasyonu mantığını kendiniz yazmanız gerektiği için çoğu proje için gereksiz bir yeniden icat — `cmdk` bu mantığı zaten test edilmiş şekilde veriyor.

```tsx
import { Command } from "cmdk"
import { useEffect, useState } from "react"

export function CommandPalette() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <Command.Dialog open={open} onOpenChange={setOpen} label="Komut Paleti">
      <Command.Input placeholder="Bir komut yazın..." />
      <Command.List>
        <Command.Empty>Sonuç bulunamadı.</Command.Empty>
        <Command.Group heading="Gezinme">
          <Command.Item onSelect={() => console.log("ayarlar")}>
            Ayarlara Git
          </Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  )
}
```

## Bulanık arama ve gruplama nasıl çalışır?

`cmdk`, varsayılan olarak her öğeyi kullanıcının yazdığı metinle karşılaştırıp bulanık bir skor hesaplıyor ve sonuçları bu skora göre otomatik sıralıyor — siz `Command.Item`'ları listelemek dışında bir şey yapmıyorsunuz. `Command.Group` ile öğeleri "Gezinme", "Eylemler", "Son Kullanılanlar" gibi başlıklar altında toplamak, liste büyüdükçe kullanıcının zihinsel haritasını koruyor.

Büyük listelerde (binlerce öğe) veya kendi sıralama mantığınızı uygulamak istediğinizde, `Command`'a `shouldFilter={false}` vererek varsayılan filtrelemeyi kapatabilir ve kendi virtualizasyon veya arama mantığınızı devreye alabilirsiniz — bu, sunucu tarafı arama sonuçlarıyla paleti beslemek isteyen uygulamalar için gerekli bir kaçış kapısı.

## Asenkron eylemler ve routing nasıl bağlanır?

Bir `Command.Item`'ın `onSelect` callback'i içinde `await` kullanmak, örneğin bir API çağrısı yapıp sonra yönlendirme yapmak, paletin kendi state'ini bozmuyor çünkü `cmdk` eylemin bitmesini beklemiyor — paleti kapatma kararını siz `onSelect` içinde `setOpen(false)` çağırarak veriyorsunuz. Next.js'te bir sayfaya yönlendirme yapan bir öğe için `onSelect` içinde `router.push()` çağırıp ardından paleti kapatmak yeterli.

| Senaryo | Yaklaşım |
|---|---|
| Statik sayfa linki | `onSelect` içinde `router.push(href)` |
| Arama sonucu (API'den) | `Command.Input` değerini debounce'layıp sunucudan sonuç çek, `shouldFilter={false}` |
| Eylem (örn. "Koyu temaya geç") | `onSelect` içinde state güncelle, paleti kapat |

## Erişilebilirlik için hangi ARIA kurallarına uymanız gerekiyor?

WAI-ARIA Authoring Practices, bir komut paletini modal dialog içinde bir combobox olarak tanımlıyor: dialog açıldığında fokus otomatik olarak giriş kutusuna gitmeli, `Escape` tuşu dialogu kapatmalı ve dialog açıkken fokus dialog dışına çıkmamalı (focus trap). `cmdk`'nin `Command.Dialog`'u bu davranışların çoğunu zaten uyguluyor, ama kendi trigger butonunuzda `aria-expanded` ve `aria-haspopup="dialog"` özniteliklerini elle eklemeniz gerekiyor.

Ekran okuyucu kullanıcıları için en kritik nokta, sonuç sayısının değiştiğini anons etmek — `Command.List`'e bir `aria-live="polite"` bölgesi eklemek (veya `cmdk`'nin kendi dahili anonsunu kullanmak), kullanıcı yazarken "3 sonuç bulundu" gibi bir geri bildirim vermeyi sağlıyor. Bu konuyu [erişilebilir form oluşturma kontrol listemizde](/tr/posts/erisilebilir-form-olusturma-kontrol-listesi) ele aldığımız odak yönetimi ilkeleriyle birlikte okumak faydalı.

## Temalama ve performans için nelere dikkat etmelisiniz?

`cmdk`'nin her parçası, stillemeniz için kendi elementine bir `cmdk-` veri özniteliği ekliyor (örneğin `[cmdk-item]`), yani kendi CSS'inizi veya Tailwind sınıflarınızı doğrudan bu özniteliklere bağlayabilirsiniz — ekstra bir class prop zincirine gerek yok. Binlerce öğeyle çalışan paletlerde en büyük performans riski, her tuş vuruşunda tüm listenin yeniden render edilmesi; bu durumda `shouldFilter={false}` ile kendi debounce'lanmış arama mantığınızı devreye almak, render sayısını önemli ölçüde düşürüyor.

Paletinizi [ileri TypeScript kalıplarıyla](/tr/posts/ileri-typescript-kaliplari) tip güvenli hale getirmek — her komutu bir `discriminated union` olarak tanımlamak gibi — büyük komut setlerinde yanlışlıkla eksik bir `onSelect` yazmanızı derleme zamanında yakalıyor. Komut paletini AI ajanlarının da tetikleyebileceği bir arayüze dönüştürmek isterseniz, [agent odaklı geliştirici araçları](/tr/posts/agent-odakli-gelistirici-araclari) yazımız bu yönün nereye gittiğini gösteriyor.

## Büyük komut setlerini nasıl organize eder, nasıl test edersiniz?

Yüzlerce komutu tek bir düz dizi olarak tanımlamak yerine, her özelliğin kendi komutlarını kendi dosyasında tanımlayıp bir `registerCommands()` fonksiyonuyla birleştirmek, komut sayısı arttıkça kod tabanının dağılmasını önlüyor. Her komutu `{ id, label, keywords, onSelect }` şeklinde tipik bir nesne olarak tanımlamak, hangi komutun hangi özelliğe ait olduğunu izlemeyi kolaylaştırıyor ve bir özelliği kaldırdığınızda ilgili komutları unutmadan silmenizi sağlıyor.

Test tarafında üç katman yeterli: `Command.Item` listesinin doğru komutları render ettiğini doğrulayan bir birim testi, klavye kısayolunun (`Cmd+K`) paleti açıp kapattığını doğrulayan bir entegrasyon testi ve bir `onSelect` çağrısının doğru yönlendirmeyi veya state güncellemesini tetiklediğini doğrulayan bir davranış testi. Bulanık arama mantığının kendisini test etmek gerekmiyor — bu, `cmdk` kütüphanesinin sorumluluğu ve zaten test edilmiş durumda; sizin test etmeniz gereken, kendi komutlarınızın doğru tanımlanmış olması.

## Komutları sunucudan asenkron olarak yüklemek ne zaman gerekir?

Uygulamanız büyüdükçe bazı komutlar (örneğin "şu müşteriye git" gibi veri bağımlı komutlar) sabit bir listede tanımlanamaz; bu durumda `Command.Input`'un değerini debounce'layıp sunucudan sonuç çekmek ve `shouldFilter={false}` ile `cmdk`'nin kendi filtrelemesini devre dışı bırakmak gerekiyor. Bu asenkron yükleme sırasında bir yükleniyor göstergesi (örneğin `Command.Loading`) eklemek, kullanıcının arama kutusuna yazdıktan sonra hiçbir şey olmadığını düşünmesini önlüyor.

Statik komutları (sayfa linkleri, ayarlar) her zaman anında göstermek, sadece veri bağımlı komutları asenkron yüklemek, paletin açılış hızını yavaşlatmıyor — kullanıcı paleti açtığı anda statik liste zaten orada, arama yazarken dinamik sonuçlar araya giriyor.

Bu iki komut türünü (statik ve asenkron) aynı `Command.List` içinde ayrı `Command.Group` başlıkları altında göstermek, kullanıcının hangi sonucun anında geldiğini hangisinin sunucudan yüklendiğini görsel olarak ayırt etmesini sağlıyor — bu da "neden bazı sonuçlar hemen, bazıları bir an sonra geliyor" karışıklığını önlüyor. Yükleme sırasında grup başlığının yanına küçük bir dönen gösterge eklemek, kullanıcıya aramanın hâlâ sürdüğünü, arayüzün donmadığını net şekilde anlatıyor — bu küçük detay, özellikle yavaş bir ağ bağlantısında paletin güvenilir hissettirmesini sağlayan en ucuz iyileştirme.

## Sıkça Sorulan Sorular

### React'te komut paleti yapmak için hangi kütüphane kullanılır?

`cmdk`, React 18 gerektiren ve hem stilsiz bir komut menüsü hem de erişilebilir bir combobox olarak çalışan açık kaynak bir kütüphane. `Command.Dialog`, `Command.Input`, `Command.List` ve `Command.Item` parçalarıyla filtreleme ve klavye navigasyonunu otomatik hallediyor.

### cmdk'de arama nasıl çalışır, kendi sıralama mantığımı yazabilir miyim?

Varsayılan olarak `cmdk` her öğeyi bulanık eşleştirmeyle skorlar ve otomatik sıralar. `Command`'a `shouldFilter={false}` vererek bu davranışı kapatıp kendi arama veya sunucu tarafı filtreleme mantığınızı devreye alabilirsiniz.

### Komut paletini klavye kısayolu olmadan da açılabilir yapmalı mıyım?

Evet — trigger butonuna `aria-expanded` ve `aria-haspopup="dialog"` ekleyip fareyle de açılabilir bir buton sağlamak, klavye kısayolunu bilmeyen veya kullanamayan kullanıcılar için zorunlu bir erişim yolu.

### Binlerce öğeli bir komut paletinde performans nasıl korunur?

`shouldFilter={false}` ile `cmdk`'nin varsayılan filtrelemesini kapatıp kendi debounce'lanmış arama veya virtualizasyon mantığınızı eklemek, her tuş vuruşunda tüm listenin yeniden render edilmesini önlüyor.
