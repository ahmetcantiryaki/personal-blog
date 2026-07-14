import type { Dictionary } from './tr'

/** English UI strings. Must satisfy the Dictionary shape defined by `tr`. */
export const en: Dictionary = {
  siteName: 'Woyable',
  tagline: 'A calm journal on software, AI and the web.',
  author: 'Woyable',

  nav: {
    home: 'Home',
    categories: 'Categories',
    about: 'About',
    search: 'Search',
    allCategories: 'All categories',
    menu: 'Menu',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    skipToContent: 'Skip to content',
    toggleTheme: 'Toggle theme',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
  },

  home: {
    hero: {
      badge: 'AI-powered blog',
      titleLead: 'Calm guides that',
      titleHighlight: 'untangle',
      titleTail: 'technology',
      subtitle:
        'From AI to social media, software to digital marketing — every article is verified against primary sources and written natively in two languages.',
      ctaTools: 'AI Tool Picker',
      ctaTransparency: 'How this blog is made',
      stats: '103+ articles · 2 languages · New content daily',
    },
    showcase: {
      title: 'What makes Woyable different?',
      toolsTitle: 'AI Tool Picker',
      toolsDesc: 'Answer four questions to find the right AI tool — unbiased and data-driven.',
      listenTitle: 'Listen to articles',
      listenDesc: 'Play any article out loud with the listen button at the top of each post.',
      transparencyTitle: 'Full transparency',
      transparencyDesc: 'We openly explain how our content is produced — a first in the space.',
      open: 'Explore',
    },
    featured: 'Featured',
    latest: 'Latest posts',
    allPosts: 'All posts',
    filterAll: 'All',
    empty: 'No published posts yet.',
    readMore: 'Read more',
    loadMore: 'Load more',
    loading: 'Loading…',
  },

  post: {
    minRead: 'min read',
    publishedOn: 'Published',
    tags: 'Tags',
    share: 'Share',
    copyLink: 'Copy link',
    linkCopied: 'Link copied',
    shareOnX: 'Share on X',
    related: 'Related posts',
    like: 'Like',
    liked: 'Liked',
    bookmark: 'Save',
    bookmarked: 'Saved',
    backToHome: 'Back to all posts',
    notFound: 'Post not found.',
    inCategory: 'in',
  },

  category: {
    title: 'Category',
    postsIn: 'Posts in this category',
    empty: 'No posts in this category yet.',
  },

  tag: {
    title: 'Tag',
    postsWith: 'Posts with this tag',
    empty: 'No posts with this tag yet.',
  },

  pagination: {
    label: 'Pagination',
    previous: 'Previous',
    next: 'Next',
    page: 'Page',
  },

  search: {
    title: 'Search',
    placeholder: 'Search posts…',
    submit: 'Search',
    resultsFor: 'Results for:',
    noResults: 'No results found.',
    prompt: 'Type something to search.',
    resultOne: 'result',
    resultMany: 'results',
  },

  auth: {
    loginTitle: 'Sign in',
    loginSubtitle: 'Sign in to like and save posts.',
    registerTitle: 'Sign up',
    registerSubtitle: 'Create a free reader account.',
    name: 'Name',
    email: 'Email',
    password: 'Password',
    login: 'Sign in',
    register: 'Sign up',
    logout: 'Sign out',
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    signUp: 'Sign up',
    signIn: 'Sign in',
    loggingIn: 'Signing in…',
    registering: 'Creating account…',
    loginError: 'Incorrect email or password.',
    registerError: 'Could not complete sign up. Please try again.',
    genericError: 'Something went wrong. Please try again.',
    profile: 'Profile',
    account: 'Account',
  },

  validation: {
    nameRequired: 'Please enter your name.',
    emailInvalid: 'Enter a valid email address.',
    passwordMin: 'Password must be at least 8 characters.',
  },

  profile: {
    title: 'My profile',
    greeting: 'Hi',
    liked: 'Liked',
    bookmarked: 'Saved',
    likedEmpty: "You haven't liked any posts yet.",
    bookmarkedEmpty: "You haven't saved any posts yet.",
  },

  about: {
    title: 'About',
  },

  footer: {
    rss: 'RSS',
    builtWith: 'Built with Next.js and Payload.',
    rights: 'All rights reserved.',
  },

  error: {
    notFoundTitle: 'Page not found',
    notFoundBody: 'The page you are looking for may have moved or never existed.',
    genericTitle: 'Something went wrong',
    genericBody: 'An unexpected error occurred. Please try again.',
    retry: 'Try again',
    goHome: 'Back to home',
  },
}
