---
title: "Claude Compliance API: Cowork ve Claude Code Denetimi"
slug: "claude-compliance-api-cowork-claude-code-denetimi"
translationKey: "claude-compliance-api-cowork-claude-code"
locale: "tr"
excerpt: "Anthropic, 11 Ağustos'ta Compliance API'yi Claude Code ve Cowork'ün yerel oturumlarına genişletti; üç uç nokta artık tam oturum kaydını döndürüyor."
category: "ai"
tags: ["claude", "compliance", "ai-infrastructure", "automation"]
publishedAt: "2026-08-17"
seoTitle: "Claude Compliance API: Cowork ve Claude Code Denetimi"
seoDescription: "Anthropic, 11 Ağustos'ta Compliance API'yi Claude Code ve Cowork'ün yerel oturumlarına genişletti; üç uç nokta artık tam oturum kaydını döndürüyor."
---

Kısa cevap: Anthropic, 11 Ağustos 2026'da Compliance API'ye üç yeni uç nokta ekledi ve artık Claude Code ile Cowork'ün kullanıcıların kendi bilgisayarlarında çalışan oturumlarının tam metin kayıtlarını döndürüyor. Özellik şimdilik Claude Enterprise organizasyonları için beta aşamasında ve mevcut Compliance Access Key'inizle, ek bir entegrasyon yapmadan kullanılabiliyor.

Bu, güvenlik ve uyumluluk ekiplerinin masaüstünde çalışan AI ajanlarını denetleme kabiliyetindeki somut bir boşluğu kapatıyor: Claude.ai sohbetleri zaten denetlenebiliyordu, ama bir geliştiricinin dizüstü bilgisayarında çalışan Claude Code oturumu ya da Cowork görevinin içinde ne olduğu, bu güncellemeye kadar kurumsal görünürlüğün dışındaydı.

## Compliance API'ye tam olarak ne eklendi?

[Claude Platform sürüm notlarına](https://platform.claude.com/docs/en/release-notes/overview) göre Anthropic, kullanıcı bilgisayarlarında çalışan Cowork ve Claude Code oturumlarının transkriptlerini döndüren üç uç nokta yayımladı: oturumları listeleyen, tek bir oturumun meta verisini getiren ve tam transkriptini döndüren uç noktalar. Üçü de mevcut Compliance Access Key'inizle ve `read:compliance_user_data` yetki kapsamıyla çalışıyor — ayrı bir kurulum ya da yeni bir anahtar gerekmiyor.

Bu, Anthropic'in yaz boyunca attığı ikinci adım. 3 Ağustos 2026'da Compliance API zaten claude.ai web ve mobilde başlatılan Cowork oturumlarını (yani bulutta çalışanları) kapsayacak şekilde genişletilmişti. 11 Ağustos güncellemesi bu tabloyu tamamlıyor: artık hem bulutta hem de yerel makinede çalışan Cowork oturumları, hem de Claude Code'un CLI ve masaüstü uygulaması denetlenebiliyor.

Bu iki adımı art arda okuduğunuzda, Anthropic'in stratejisi netleşiyor: önce en kolay erişilebilir yüzeyi (bulutta çalışan, zaten Anthropic'in sunucularından geçen Cowork oturumları) kapsama almak, sonra daha zor olan yüzeyi (kullanıcının kendi makinesinde, Anthropic'in doğrudan görmediği bir ortamda çalışan oturumlar) eklemek. İkinci adım teknik olarak daha zor, çünkü yerel oturum verisinin güvenli bir şekilde toplanıp API üzerinden sunulması gerekiyor.

## Bu neden şimdi önemli?

Kısa cevap: çünkü "gölge AI" riski artık sohbet pencerelerinde değil, geliştirici makinelerinde çalışan ajanlarda yaşıyor. Claude Code bir geliştiricinin dizüstü bilgisayarında dosya sistemine erişiyor, komut çalıştırıyor, depolara push atıyor. Cowork'ün masaüstü sürümü de benzer şekilde yerel dosyalarla ve uygulamalarla etkileşime giriyor. Bu oturumlar şirketin kendi altyapısında değil, çalışanın makinesinde çalıştığı için güvenlik ekiplerinin standart ağ izleme veya DLP (veri kaybını önleme) araçlarıyla göremediği bir kör nokta oluşturuyordu.

Bu boşluk özellikle finans, sağlık ve kamu gibi düzenlenmiş sektörlerdeki şirketler için sorun yaratıyordu: bir denetçi "geçen ay hangi AI ajanı hangi müşteri verisine dokundu" sorusunu sorduğunda, Claude Code ve Cowork'ün yerel oturumları bu sorunun cevaplanamayan kısmıydı. SOC 2 ya da ISO 27001 denetiminden geçen bir şirket için bu, teorik değil somut bir bulgu maddesi anlamına geliyordu — "AI araç kullanımını denetleyemiyoruz" cevabı, denetçinin kabul edeceği bir cevap değil.

## Üç yeni uç nokta nasıl çalışıyor?

| Uç nokta | Ne döndürüyor | Kapsam |
|---|---|---|
| `GET /v1/compliance/apps/sessions/local` | Organizasyon genelinde yerel oturumların listesi | Claude Code (CLI + masaüstü), Cowork masaüstü |
| `GET /v1/compliance/apps/sessions/local/{session_id}` | Tek bir oturumun meta verisi | Kullanıcı, başlangıç zamanı, durum |
| `GET /v1/compliance/apps/sessions/local/{session_id}/messages` | Tam transkript | Prompt'lar, yanıtlar, araç çağrıları |

Kıyaslamak gerekirse, 3 Ağustos'ta eklenen bulut tarafı iki uç nokta üzerinden çalışıyor: `GET /v1/compliance/apps/sessions/remote` ve `GET /v1/compliance/apps/sessions/remote/{session_id}/messages`. İkisi de aynı Compliance Access Key ile çalışıyor; farkları yalnızca oturumun nerede çalıştığı (bulut mu, yerel makine mi).

## Bir sorguya nasıl bakar?

Aşağıdaki örnek, bir organizasyondaki yerel oturumları listeleyip birinin transkriptini çekmenin ne kadar basit olduğunu gösteriyor:

```bash
curl https://api.anthropic.com/v1/compliance/apps/sessions/local \
  -H "x-api-key: $COMPLIANCE_ACCESS_KEY" \
  -H "anthropic-version: 2023-06-01"

curl https://api.anthropic.com/v1/compliance/apps/sessions/local/ses_01AbCdEf/messages \
  -H "x-api-key: $COMPLIANCE_ACCESS_KEY" \
  -H "anthropic-version: 2023-06-01"
```

Anthropic henüz sayfalama ve filtreleme parametreleri için ayrıntılı dokümantasyon yayımlamadı; yukarıdaki örneği isteklerin genel şekli olarak değerlendirin, tam parametre listesi için [Compliance API dokümantasyonuna](https://platform.claude.com/docs/en/manage-claude/compliance-api) bakmak gerekiyor.

## Kimler kullanabilir?

Özellik şu anda yalnızca Claude Enterprise organizasyonları için beta aşamasında. Diğer plan seviyelerine (Team, Pro) ne zaman veya açılıp açılmayacağı konusunda Anthropic henüz bir taahhütte bulunmadı. Bu, Anthropic'in yaz boyunca sürdürdüğü daha geniş bir örüntüye uyuyor: 5 Ağustos'ta beta'ya giren [Inference Hooks](/tr/posts/claude-inference-hooks-guvenlik-sunucusu) ve 7 Ağustos'ta Managed Agents'a eklenen [oturum bütçesi, danışman modeli ve veri konumu kontrolleri](/tr/posts/claude-managed-agents-butce-danisman-veri-konumu) de aynı şekilde önce kurumsal katmanda çıktı. Anthropic bu yaz somut bir şekilde "üretim ajanı altyapısı" tarafına yatırım yapıyor.

## Rakipler benzer bir şey sunuyor mu?

Dürüst görüşüm şu: bu, ne OpenAI'nin ne de Google'ın şu anda birebir eşdeğerini kamuya açık olarak sunmadığı bir alan. ChatGPT Business ve Enterprise'da sohbet geçmişi ve veri kontrolü araçları var, ama Codex CLI gibi yerel geliştirici araçlarının oturumlarını merkezi bir denetim API'sinden çekebilme dokümantasyonu bulunmuyor. Bu, Anthropic'in kurumsal güvenlik ekiplerine "Claude Code'u geliştiricilerinize güvenle verebilirsiniz, çünkü ne yaptığını sonradan görebilirsiniz" mesajını vermesine izin veren somut bir fark. Ajan tabanlı geliştirme araçlarını [ekip içinde CI/CD hattına](/tr/posts/ai-ajanlari-cicd-guvenle-baglamak) bağlamayı değerlendiren güvenlik ekipleri için bu, Claude Code'u seçme lehine somut bir argüman.

Tek uyarı: beta etiketi hâlâ duruyor, API şekli değişebilir ve dokümantasyon henüz eksiksiz değil. Üretim denetim hattınızı buna bağlamadan önce, Anthropic'in genel kullanıma açılma taahhüdünü beklemek makul bir temkinli yaklaşım.

## Bir güvenlik ekibi bu API'yi nasıl devreye alır?

Kısa cevap: önce hangi yüzeylerin (Claude Code CLI, Claude Code masaüstü, Cowork masaüstü, Cowork web/mobil) organizasyonunuzda aktif kullanıldığını haritalayın, sonra Compliance Access Key'inizin `read:compliance_user_data` kapsamına sahip olduğunu doğrulayın. Bu iki adım tamamlanmadan API çağrısı yazmaya başlamak, genelde yanlış yüzeyi izleyen bir denetim hattıyla sonuçlanıyor.

Pratik bir devreye alma sırası şöyle işliyor:

1. **Envanter çıkarın** — hangi ekiplerin Claude Code'u yerel makinede, hangilerinin Cowork'ü hangi yüzeyde kullandığını listeleyin.
2. **Yetkiyi doğrulayın** — mevcut Compliance Access Key'inizin `read:compliance_user_data` kapsamını taşıdığından emin olun; taşımıyorsa Console üzerinden yeni bir anahtar oluşturmanız gerekiyor.
3. **Periyodik çekim kurun** — `/sessions/local` ve `/sessions/remote` uç noktalarını ayrı ayrı, örneğin günlük bir cron işiyle çekip kendi log altyapınıza (SIEM, veri ambarı) yazın.
4. **Uyarı eşiği belirleyin** — belirli anahtar kelimeler ya da dosya yolu desenleri içeren transkriptler için basit bir kural motoru kurun; API kendisi uyarı üretmiyor, yalnızca ham veriyi döndürüyor.
5. **Saklama süresini netleştirin** — çektiğiniz transkriptleri kendi tarafınızda ne kadar süre saklayacağınızı, şirketinizin veri saklama politikasına göre önceden belirleyin.

Bu beş adımın hiçbiri Anthropic'in dokümantasyonunda reçete olarak verilmiyor — API yalnızca veriyi sağlıyor, denetim mantığını kurmak size kalıyor. Bu da beklenen bir tasarım tercihi: Compliance API bir SIEM ya da DLP aracı değil, onların beslendiği ham veri kaynağı.

## Sıkça Sorulan Sorular

### Compliance API'nin Cowork ve Claude Code genişlemesi ne zaman yayımlandı?

Anthropic bu özelliği 11 Ağustos 2026'da yayımladı ve Claude Enterprise organizasyonları için beta aşamasında sundu. Bu, 3 Ağustos 2026'da eklenen bulut tabanlı Cowork oturumu denetimini tamamlayan ikinci bir genişleme.

### Compliance API'yi kullanmak için ayrı bir entegrasyon kurmam gerekiyor mu?

Hayır. Yeni uç noktalar, mevcut Compliance Access Key'inizle ve zaten sahip olduğunuz `read:compliance_user_data` yetki kapsamıyla çalışıyor. Claude sohbetlerini denetlemek için Compliance API'yi zaten kullanıyorsanız, ek bir kurulum adımı yok.

### Bu özellik hangi plan seviyelerinde kullanılabilir?

Şu anda yalnızca Claude Enterprise organizasyonları için beta aşamasında. Anthropic, Team veya Pro planlarına ne zaman veya açılıp açılmayacağı konusunda henüz bir tarih paylaşmadı.

### Yerel oturum denetimi ile bulut oturumu denetimi arasındaki fark ne?

Yerel oturum uç noktaları (`/sessions/local`) Claude Code'un CLI/masaüstü sürümünü ve Cowork'ün masaüstü uygulamasını kapsıyor; bulut uç noktaları (`/sessions/remote`) ise claude.ai web ve mobilde başlatılan Cowork oturumlarını kapsıyor. İkisi de aynı Compliance Access Key ile erişiliyor, farkları yalnızca oturumun nerede çalıştığı.
