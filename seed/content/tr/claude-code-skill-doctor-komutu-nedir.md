---
title: "Claude Code'un /skill-doctor Komutu Ne İşe Yarar?"
slug: "claude-code-skill-doctor-komutu-nedir"
translationKey: "claude-code-skill-doctor-plugin-dir-2026"
locale: "tr"
excerpt: "4 Eylül 2026'da gelen /skill-doctor, Claude Code oturumunda yüklü her skill'in kaç token bağlam tükettiğini ve hiç kullanılıp kullanılmadığını raporlar."
category: "ai"
tags: ["claude", "ai-coding", "developer-experience", "ai-tools"]
publishedAt: "2026-09-09"
seoTitle: "Claude Code /skill-doctor Komutu Açıklandı"
seoDescription: "4 Eylül 2026'da gelen /skill-doctor, Claude Code oturumunda yüklü her skill'in kaç token bağlam tükettiğini ve hiç kullanılıp kullanılmadığını raporlar."
---

Kısa cevap: `/skill-doctor`, Claude Code oturumunuza yüklü her skill'i listeleyen, hiç çağrılmamış olanları işaretleyen ve her birinin her turda bağlamınıza kaç token eklediğini gösteren bir komut. 4 Eylül 2026'da Claude Code 2.1.252 ile geldi ve varlık nedeni basit: listenizde duran, hiç kullanılmayan bir skill bile her mesajda bağlamınızdan pay çalıyor.

## Claude Code'da /skill-doctor ne işe yarar?

`/skill-doctor`, her skill'in bağlam maliyetini ve gerçekte ne sıklıkla kullanıldığını raporlayıp en pahalıdan başlayarak hangilerini kapatmanız gerektiğini önerir. Argümansız çalıştırın:

```bash
/skill-doctor
```

Rapor kişisel skill'leri, proje skill'lerini ve plugin skill'lerini kapsar; yakın zamanda kullanmadığınız pluginler de dahildir. Bilinçli olarak iki kategoriyi atlar: Claude Code'un kendi getirdiği bundled skill'ler ve bir yöneticinin zorla yüklediği kurumsal (enterprise) skill'ler. Bunları zaten siz kapatamıyorsunuz, dolayısıyla araç bunları denetlemekle uğraşmıyor.

## /skill-doctor raporu nasıl okunur?

Raporun tek işi şu: hangi skill'lerin yerini hak ettiğini, hangilerinin etmediğini göstermek. Etkileşimli bir oturumda rapor `/plugin` yöneticisinin Stats sekmesinde açılır; Claude Code'u `-p` bayrağıyla etkileşimsiz çalıştırırsanız rapor düz metin olarak basılır.

Her skill için rapor üç şeyi listeler: girdisinin skill listesine kaç token eklediği, oturumda gerçekte kaç kez çağrıldığı ve hiç çağrılıp çağrılmadığı. Kullanılmamış olarak işaretlenen bir skill otomatik olarak kötü bir skill değildir; son işlerinizde konusu açılmamış olabilir. Bunun sorun olup olmadığı, o skill'i neden kurduğunuza bağlı.

| Skill kaynağı | /skill-doctor kapsıyor mu? |
|---|---|
| Kişisel skill'ler (`~/.claude/skills`) | Evet |
| Proje skill'leri (`.claude/skills`) | Evet |
| Plugin skill'leri | Evet, kullanılmayan pluginler dahil |
| Bundled skill'ler (Claude Code ile gelen) | Hayır |
| Enterprise skill'ler (yönetici tanımlı) | Hayır |

Güvenmeden önce bilmeniz gereken iki uyarı var: `/skill-doctor` Claude Code 2.1.252 veya üzerini gerektiriyor ve oturumunuz feature-flag çekimini atladıysa hiç çalışmıyor. Sürümünüzü kontrol etmek için `claude --version` yeterli; eski bir sürümdeyseniz komut hiç görünmez, hata mesajı vermez, bu yüzden "komut bulunamadı" gördüğünüzde ilk şüpheniz güncelleme olmalı. Ayrıca Remote Control üzerinden kullanılamıyor; telefonunuzdan veya tarayıcınızdan çalıştırmayı denerseniz "Skill usage reports are not available on this connection" yanıtını alırsınız. Çözümü basit: komutu, oturumun gerçekten çalıştığı makinenin terminalinde çalıştırın.

## Kullanılmayan bir skill neden bağlam tüketir?

Listenizdeki her skill, Claude kullansın ya da kullanmasın her turda bağlama eklenir; model neyin çağrılabilir olduğunu tam olarak bu listeden öğrenir. Bir projede kurup unuttuğunuz bir skill, tamamen alakasız bir oturumun 200. mesajında bir kez bile tetiklenmeden bağlam bütçenizden pay almaya devam eder.

Claude Code, skill listesinin bağlam penceresinden ne kadar yer kaplayabileceğine bir üst sınır koyar. Bu sınırı `skillListingBudgetFraction` ayarı belirler ve varsayılan değeri bağlam penceresinin %1'idir:

```json
{
  "skillListingBudgetFraction": 0.01
}
```

`/context` komutunu çalıştırıp "Skills" satırına bakın; bu, listenizin bütçe uygulandıktan sonraki gerçek boyutu — yani modelin aldığı şey, her skill'in açıklamasının ham toplamı değil. Uzun ömürlü bir proje deposunda üç plugin üzerinden bir düzine skill çalıştırıyorsanız, hangilerinin bu tur-başı vergiyi hak ettiğini, hangilerinin ölü yük olduğunu `/skill-doctor` ile öğrenirsiniz.

## --plugin-dir ile neler değişti?

Aynı 8 Eylül 2026 sürümü (Claude Code 2.1.265), `--plugin-dir` bayrağını tek bir plugin yerine bir bütün plugin klasörünü yüklemeye genişletti. Daha önce birden fazla yerel plugin'i test etmek bayrağı tekrarlamak demekti:

```bash
claude --plugin-dir ./plugin-one --plugin-dir ./plugin-two
```

Artık `--plugin-dir`'i bir üst klasöre işaret ettirebilirsiniz; Claude Code, kendi plugin manifest'i olan her alt klasörü otomatik yükler — her birini tek tek yazmanıza gerek kalmaz. `--plugin-dir` hâlâ eskisi gibi tek bir plugin klasörünü veya bir `.zip` arşivini de kabul ediyor ve bu şekilde yüklenen yerel bir plugin, o oturum için aynı isimli kurulu bir marketplace plugin'ine göre önceliklidir — tek istisna, bir yöneticinin managed settings üzerinden zorla açtığı ya da kapattığı bir plugin'i geçersiz kılamaması.

Bayrağı aynı komutta birden fazla kez de tekrarlayabilirsiniz; böylece bir üst klasörle birlikte ayrıca tek bir plugin'i veya bir `.zip` arşivini de aynı oturuma ekleyebilirsiniz. Bu, henüz bir klasöre taşımadığınız tek bir plugin'i test ederken, ekibinizin paylaşılan koleksiyonunu da yanında yüklemek istediğinizde işe yarıyor.

Bu değişiklik en çok kendi iç plugin koleksiyonunu kuran ekipler için önemli: bir başlatma betiğinde her plugin için ayrı bir `--plugin-dir` bayrağı yazmak yerine, artık paylaşılan plugin klasörünü gösteren tek bir bayrak hepsini birden yüklüyor. Bir CI script'inde ya da takım genelinde paylaşılan bir dotfiles reposunda bu, plugin sayısı arttıkça büyüyen bir bayrak listesini bakımı gerekmeyen tek bir satıra indiriyor.

## /skill-doctor her projede çalıştırılmalı mı?

Skill ve plugin sayısının zamanla arttığı her projede çalıştırın; en net örnek takım depoları, çünkü farklı kişiler kendi iş akışları için skill ekliyor ve kimse geri dönüp kimsenin kullanmadığı skill'leri budamıyor. Bir veya iki skill'lik kişisel bir kurulumda bu denetim kesintiye değmez; tek bir kullanılmayan skill'i kapatmanın kazandıracağı bağlam marjinal.

Dikkat etmeniz gereken örüntü şu: kurduğunuzda işe yarar görünen ama haftalarca her `/skill-doctor` raporunda kullanılmamış çıkan ve hiç kaldırılmayan bir plugin. Komut tam olarak bu durumu ortaya çıkarmak için tasarlandı; sabit bir haftalık takvim yerine, siz ya da bir takım arkadaşınız yeni skill eklediğiniz her sprint'ten sonra çalıştırmayı hatırlatıcıya ekleyin.

Takım depolarında ek bir avantaj var: rapor kimin hangi plugin'i kurduğunu değil, oturumda gerçekte neyin çağrıldığını gösterdiği için, "bu skill kimin işine yarıyor" tartışmasını tahminden çıkarıp veriye bağlıyor. Bir plugin üç farklı takım üyesinin oturumunda da kullanılmamış çıkıyorsa, o plugin'i kimin kurduğunu sormaktan önce kaldırmayı konuşmak daha mantıklı.

Uzun vadede bu tür denetimler, projeye eklenen her yeni skill'in gerçek bir maliyeti olduğunu takıma hatırlatan küçük bir disiplin haline geliyor: bir skill eklemek bedava değil, her turda bağlam bütçesinden pay alan kalıcı bir karar. Bu disiplini bir kez kurduğunuzda, yeni bir skill önerisi geldiğinde "gerçekten gerekli mi" sorusu ekip kültürünün doğal bir parçası haline geliyor.

Sadece tüketen değil kendi plugin'lerinizi de kuruyorsanız, [Claude Code eklentilerini kurma, paketleme ve paylaşma rehberimize](/tr/posts/claude-code-eklentileri-kur-paketle-paylas) bakın. Skill'lerin genel mekaniği için [Claude Skills rehberimiz](/tr/posts/claude-skills-nedir-herkes-icin) temelleri anlatıyor; bağlam ve maliyet takibi arıyorsanız [Claude Code'un harcama limitleri ve prompt cache metrikleri yazımız](/tr/posts/claude-code-harcama-limitleri-prompt-cache) bütçe tarafını kapsıyor. Arka plan ajanları ve çoklu skill iş akışları için [subagent rehberimize](/tr/posts/claude-code-subagent-arka-plan-ajanlari) göz atın. Daha fazla içerik için [Yapay Zeka kategorimize](/tr/category/yapay-zeka) bakabilirsiniz.

Kaynaklar: [Claude Code skill dokümantasyonu](https://code.claude.com/docs/en/skills), [plugin rehberi](https://code.claude.com/docs/en/plugins) ve [Claude Code değişiklik günlüğü](https://code.claude.com/docs/en/changelog).

## Sıkça Sorulan Sorular

### /skill-doctor, Claude Code'un bundled skill'lerini denetliyor mu?

Hayır. `/skill-doctor` yalnızca kişisel skill'ler, proje skill'leri ve plugin skill'leri hakkında rapor verir. Claude Code ile birlikte gelen bundled skill'ler ve bir yöneticinin zorla yüklediği enterprise skill'ler rapor dışında tutulur; çünkü ikisini de kendiniz kapatamazsınız.

### /skill-doctor'ı telefonumdan Remote Control üzerinden çalıştırabilir miyim?

Hayır. Remote Control üzerinden `/skill-doctor` çalıştırdığınızda Claude Code "Skill usage reports are not available on this connection" yanıtını döndürür. Bunun yerine komutu, oturumun çalıştığı makinenin terminalinde doğrudan çalıştırmanız gerekir.

### /skill-doctor için hangi Claude Code sürümü gerekiyor?

Claude Code 2.1.252 veya üzeri gerekiyor. Komut ayrıca, sürümden bağımsız olarak feature-flag çekimini atlayan oturumlarda da çalışmıyor.

### --plugin-dir, plugin marketplace'lerinin yerini mi alıyor?

Hayır. `--plugin-dir` yerel geliştirme ve test için bir araç; pluginleri kurmadan, tek bir oturum için doğrudan diskten yükler. Bitmiş bir plugin'i takım arkadaşlarınıza veya topluluğa dağıtmak hâlâ marketplace'ler üzerinden yapılıyor.
