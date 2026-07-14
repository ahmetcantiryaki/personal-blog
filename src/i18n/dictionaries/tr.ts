/** Turkish UI strings. Source-of-truth shape for the dictionary type. */
export const tr = {
  siteName: 'Woyable',
  tagline: 'Yazılım, yapay zeka ve web üzerine dingin bir günlük.',
  author: 'Woyable',

  nav: {
    home: 'Anasayfa',
    categories: 'Kategoriler',
    about: 'Hakkında',
    search: 'Ara',
    allCategories: 'Tüm kategoriler',
    menu: 'Menü',
    openMenu: 'Menüyü aç',
    closeMenu: 'Menüyü kapat',
    skipToContent: 'İçeriğe atla',
    toggleTheme: 'Temayı değiştir',
    light: 'Açık',
    dark: 'Koyu',
    system: 'Sistem',
  },

  home: {
    hero: {
      title: 'Teknolojiyi sadeleştiren sakin rehberler',
      subtitle:
        'Yapay zekadan sosyal medyaya, yazılımdan dijital pazarlamaya — her yazı birincil kaynaklardan doğrulanır ve iki dilde doğal olarak yazılır.',
      ctaTools: 'AI Araç Seçici',
      ctaTransparency: 'Bu blog nasıl üretiliyor?',
    },
    showcase: {
      title: 'Woyable’da farklı olan ne?',
      toolsTitle: 'AI Araç Seçici',
      toolsDesc: 'Dört soruda size uygun yapay zeka aracını bulun — tarafsız, veriye dayalı.',
      listenTitle: 'Yazıları dinleyin',
      listenDesc: 'Her yazının başındaki oynat düğmesiyle içeriği sesli dinleyin.',
      transparencyTitle: 'Tam şeffaflık',
      transparencyDesc: 'İçeriğin nasıl üretildiğini açıkça anlatıyoruz — sektörde bir ilk.',
      open: 'İncele',
    },
    featured: 'Öne çıkan',
    latest: 'Son yazılar',
    allPosts: 'Tüm yazılar',
    filterAll: 'Tümü',
    empty: 'Henüz yayınlanmış yazı yok.',
    readMore: 'Devamını oku',
    loadMore: 'Daha fazla yükle',
    loading: 'Yükleniyor…',
  },

  post: {
    minRead: 'dk okuma',
    publishedOn: 'Yayınlanma',
    tags: 'Etiketler',
    share: 'Paylaş',
    copyLink: 'Bağlantıyı kopyala',
    linkCopied: 'Bağlantı kopyalandı',
    shareOnX: "X'te paylaş",
    related: 'İlgili yazılar',
    like: 'Beğen',
    liked: 'Beğenildi',
    bookmark: 'Kaydet',
    bookmarked: 'Kaydedildi',
    backToHome: 'Tüm yazılara dön',
    notFound: 'Yazı bulunamadı.',
    inCategory: 'kategorisinde',
  },

  category: {
    title: 'Kategori',
    postsIn: 'Bu kategorideki yazılar',
    empty: 'Bu kategoride henüz yazı yok.',
  },

  tag: {
    title: 'Etiket',
    postsWith: 'Bu etiketli yazılar',
    empty: 'Bu etikette henüz yazı yok.',
  },

  pagination: {
    label: 'Sayfalama',
    previous: 'Önceki',
    next: 'Sonraki',
    page: 'Sayfa',
  },

  search: {
    title: 'Ara',
    placeholder: 'Yazılarda ara…',
    submit: 'Ara',
    resultsFor: 'Sonuçlar:',
    noResults: 'Sonuç bulunamadı.',
    prompt: 'Aramak için bir şeyler yazın.',
    resultOne: 'sonuç',
    resultMany: 'sonuç',
  },

  auth: {
    loginTitle: 'Giriş yap',
    loginSubtitle: 'Hesabına giriş yaparak beğen ve kaydet.',
    registerTitle: 'Kayıt ol',
    registerSubtitle: 'Ücretsiz bir okuyucu hesabı oluştur.',
    name: 'Ad',
    email: 'E-posta',
    password: 'Şifre',
    login: 'Giriş yap',
    register: 'Kayıt ol',
    logout: 'Çıkış yap',
    noAccount: 'Hesabın yok mu?',
    haveAccount: 'Zaten hesabın var mı?',
    signUp: 'Kayıt ol',
    signIn: 'Giriş yap',
    loggingIn: 'Giriş yapılıyor…',
    registering: 'Kayıt olunuyor…',
    loginError: 'E-posta veya şifre hatalı.',
    registerError: 'Kayıt tamamlanamadı. Lütfen tekrar dene.',
    genericError: 'Bir şeyler ters gitti. Lütfen tekrar dene.',
    profile: 'Profil',
    account: 'Hesap',
  },

  validation: {
    nameRequired: 'Lütfen adını gir.',
    emailInvalid: 'Geçerli bir e-posta adresi gir.',
    passwordMin: 'Şifre en az 8 karakter olmalı.',
  },

  profile: {
    title: 'Profilim',
    greeting: 'Merhaba',
    liked: 'Beğendiklerim',
    bookmarked: 'Kaydettiklerim',
    likedEmpty: 'Henüz bir yazı beğenmedin.',
    bookmarkedEmpty: 'Henüz bir yazı kaydetmedin.',
  },

  about: {
    title: 'Hakkında',
  },

  footer: {
    rss: 'RSS',
    builtWith: 'Next.js ve Payload ile geliştirildi.',
    rights: 'Tüm hakları saklıdır.',
  },

  error: {
    notFoundTitle: 'Sayfa bulunamadı',
    notFoundBody: 'Aradığın sayfa taşınmış ya da hiç var olmamış olabilir.',
    genericTitle: 'Bir şeyler ters gitti',
    genericBody: 'Beklenmeyen bir hata oluştu. Lütfen tekrar dene.',
    retry: 'Tekrar dene',
    goHome: 'Anasayfaya dön',
  },
}

export type Dictionary = typeof tr
