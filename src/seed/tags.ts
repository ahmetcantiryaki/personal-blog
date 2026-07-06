import { slugify } from '@/utils/slugify'

import type { TaxonomyEntry } from './categories'

/**
 * Canonical tag mapping. Article front-matter references tags by locale-neutral
 * kebab-case keys; each key maps to a proper English title-case expansion and a
 * natural Turkish translation. Slugs are derived deterministically:
 *   - EN slug = the key itself (already kebab-case, ASCII).
 *   - TR slug = ASCII-transliterated slug of the Turkish title, falling back to
 *     the key when the transliteration is identical.
 * The seed creates ONE tag doc per key carrying both locale rows.
 */
const TAG_TITLES: Readonly<Record<string, { en: string; tr: string }>> = {
  accessibility: { en: 'Accessibility', tr: 'Erişilebilirlik' },
  'ai-agents': { en: 'AI Agents', tr: 'Yapay Zeka Ajanları' },
  'ai-coding': { en: 'AI Coding', tr: 'Yapay Zeka ile Kodlama' },
  'ai-infrastructure': { en: 'AI Infrastructure', tr: 'Yapay Zeka Altyapısı' },
  'ai-reliability': { en: 'AI Reliability', tr: 'Yapay Zeka Güvenilirliği' },
  'ai-tools': { en: 'AI Tools', tr: 'Yapay Zeka Araçları' },
  'api-design': { en: 'API Design', tr: 'API Tasarımı' },
  astro: { en: 'Astro', tr: 'Astro' },
  authentication: { en: 'Authentication', tr: 'Kimlik Doğrulama' },
  automation: { en: 'Automation', tr: 'Otomasyon' },
  backend: { en: 'Backend', tr: 'Arka Uç' },
  'best-practices': { en: 'Best Practices', tr: 'En İyi Uygulamalar' },
  burnout: { en: 'Burnout', tr: 'Tükenmişlik' },
  career: { en: 'Career', tr: 'Kariyer' },
  'ci-cd': { en: 'CI/CD', tr: 'CI/CD' },
  'clean-code': { en: 'Clean Code', tr: 'Temiz Kod' },
  cloud: { en: 'Cloud', tr: 'Bulut' },
  'code-quality': { en: 'Code Quality', tr: 'Kod Kalitesi' },
  collaboration: { en: 'Collaboration', tr: 'İş Birliği' },
  communication: { en: 'Communication', tr: 'İletişim' },
  containers: { en: 'Containers', tr: 'Konteynerler' },
  'core-web-vitals': { en: 'Core Web Vitals', tr: 'Core Web Vitals' },
  'cost-optimization': { en: 'Cost Optimization', tr: 'Maliyet Optimizasyonu' },
  css: { en: 'CSS', tr: 'CSS' },
  databases: { en: 'Databases', tr: 'Veritabanları' },
  deployment: { en: 'Deployment', tr: 'Dağıtım' },
  'design-patterns': { en: 'Design Patterns', tr: 'Tasarım Kalıpları' },
  'developer-experience': { en: 'Developer Experience', tr: 'Geliştirici Deneyimi' },
  'developer-growth': { en: 'Developer Growth', tr: 'Geliştirici Gelişimi' },
  devops: { en: 'DevOps', tr: 'DevOps' },
  docker: { en: 'Docker', tr: 'Docker' },
  documentation: { en: 'Documentation', tr: 'Dokümantasyon' },
  embeddings: { en: 'Embeddings', tr: 'Embeddingler' },
  evals: { en: 'Evals', tr: 'Değerlendirmeler' },
  'fine-tuning': { en: 'Fine-Tuning', tr: 'İnce Ayar' },
  finops: { en: 'FinOps', tr: 'FinOps' },
  freelance: { en: 'Freelance', tr: 'Serbest Çalışma' },
  frontend: { en: 'Frontend', tr: 'Ön Uç' },
  git: { en: 'Git', tr: 'Git' },
  gitops: { en: 'GitOps', tr: 'GitOps' },
  graphql: { en: 'GraphQL', tr: 'GraphQL' },
  images: { en: 'Images', tr: 'Görseller' },
  'infrastructure-as-code': { en: 'Infrastructure as Code', tr: 'Kod Olarak Altyapı' },
  integration: { en: 'Integration', tr: 'Entegrasyon' },
  interview: { en: 'Interview', tr: 'Mülakat' },
  'job-search': { en: 'Job Search', tr: 'İş Arama' },
  kubernetes: { en: 'Kubernetes', tr: 'Kubernetes' },
  learning: { en: 'Learning', tr: 'Öğrenme' },
  'legacy-code': { en: 'Legacy Code', tr: 'Eski Kod' },
  llm: { en: 'LLM', tr: 'LLM' },
  'machine-learning': { en: 'Machine Learning', tr: 'Makine Öğrenmesi' },
  mcp: { en: 'MCP', tr: 'MCP' },
  microservices: { en: 'Microservices', tr: 'Mikroservisler' },
  monitoring: { en: 'Monitoring', tr: 'İzleme' },
  nextjs: { en: 'Next.js', tr: 'Next.js' },
  observability: { en: 'Observability', tr: 'Gözlemlenebilirlik' },
  passkeys: { en: 'Passkeys', tr: 'Passkeyler' },
  performance: { en: 'Performance', tr: 'Performans' },
  'personal-branding': { en: 'Personal Branding', tr: 'Kişisel Marka' },
  'platform-engineering': { en: 'Platform Engineering', tr: 'Platform Mühendisliği' },
  portfolio: { en: 'Portfolio', tr: 'Portfolyo' },
  productivity: { en: 'Productivity', tr: 'Üretkenlik' },
  'prompt-engineering': { en: 'Prompt Engineering', tr: 'Prompt Mühendisliği' },
  rag: { en: 'RAG', tr: 'RAG' },
  react: { en: 'React', tr: 'React' },
  refactoring: { en: 'Refactoring', tr: 'Yeniden Düzenleme' },
  reliability: { en: 'Reliability', tr: 'Güvenilirlik' },
  'remote-work': { en: 'Remote Work', tr: 'Uzaktan Çalışma' },
  rendering: { en: 'Rendering', tr: 'Render' },
  'responsive-design': { en: 'Responsive Design', tr: 'Duyarlı Tasarım' },
  rest: { en: 'REST', tr: 'REST' },
  roadmap: { en: 'Roadmap', tr: 'Yol Haritası' },
  seo: { en: 'SEO', tr: 'SEO' },
  'server-components': { en: 'Server Components', tr: 'Sunucu Bileşenleri' },
  'software-architecture': { en: 'Software Architecture', tr: 'Yazılım Mimarisi' },
  sql: { en: 'SQL', tr: 'SQL' },
  sre: { en: 'SRE', tr: 'SRE' },
  'state-management': { en: 'State Management', tr: 'Durum Yönetimi' },
  'static-site': { en: 'Static Site', tr: 'Statik Site' },
  'system-design': { en: 'System Design', tr: 'Sistem Tasarımı' },
  tailwind: { en: 'Tailwind', tr: 'Tailwind' },
  'technical-writing': { en: 'Technical Writing', tr: 'Teknik Yazım' },
  terraform: { en: 'Terraform', tr: 'Terraform' },
  testing: { en: 'Testing', tr: 'Test' },
  'time-management': { en: 'Time Management', tr: 'Zaman Yönetimi' },
  typescript: { en: 'TypeScript', tr: 'TypeScript' },
  'unit-testing': { en: 'Unit Testing', tr: 'Birim Testi' },
  'vector-database': { en: 'Vector Database', tr: 'Vektör Veritabanı' },
  'version-control': { en: 'Version Control', tr: 'Sürüm Kontrolü' },
  wcag: { en: 'WCAG', tr: 'WCAG' },
  'web-performance': { en: 'Web Performance', tr: 'Web Performansı' },
  'web-security': { en: 'Web Security', tr: 'Web Güvenliği' },
  'web-standards': { en: 'Web Standards', tr: 'Web Standartları' },
  'well-being': { en: 'Well-Being', tr: 'İyi Oluş' },
  workflow: { en: 'Workflow', tr: 'İş Akışı' },
}

/** Deterministic, reviewable tag taxonomy derived from the title map. */
export const TAGS: readonly TaxonomyEntry[] = Object.entries(TAG_TITLES).map(([key, titles]) => {
  const trSlug = slugify(titles.tr)
  return {
    key,
    locales: {
      en: { title: titles.en, slug: key },
      tr: { title: titles.tr, slug: trSlug || key },
    },
  }
})

export const TAG_KEYS: ReadonlySet<string> = new Set(TAGS.map((t) => t.key))
