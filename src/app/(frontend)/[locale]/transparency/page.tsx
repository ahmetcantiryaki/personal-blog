import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { isLocale, LOCALES, type Locale } from '@/i18n/config'
import { buildPageMetadata } from '@/lib/seo'

export const revalidate = 300

interface TransparencyPageProps {
  params: Promise<{ locale: string }>
}

interface PipelineStep {
  title: string
  description: string
}

interface TransparencyContent {
  eyebrow: string
  title: string
  intro: string[]
  pipelineHeading: string
  pipelineSteps: PipelineStep[]
  whyHeading: string
  whyParagraphs: string[]
  correctionsHeading: string
  correctionsParagraphs: string[]
}

const CONTENT: Record<Locale, TransparencyContent> = {
  tr: {
    eyebrow: 'Şeffaflık',
    title: 'Bu Blog Nasıl Üretiliyor?',
    intro: [
      'Bu sitedeki yazıların büyük çoğunluğu, yapay zeka destekli bir editoryal sistemle üretiliyor. Bunu saklamıyoruz, çünkü saklanacak bir şey olduğunu düşünmüyoruz.',
      'Sistem otonom değil; her adımda insan gözetimi var. Ama araştırma, taslak yazım, redaksiyon ve kapak görseli üretiminin büyük kısmını AI modelleri yürütüyor. Aşağıda bunun tam olarak nasıl işlediğini anlatıyoruz.',
    ],
    pipelineHeading: 'Editoryal Süreç',
    pipelineSteps: [
      {
        title: 'Haftalık strateji',
        description:
          'Her hafta, gerçek arama talebi verileri incelenerek hangi konuların okuyucu için değerli olduğuna karar verilir. Rastgele konu seçimi yok; talep var mı diye önce bakılır.',
      },
      {
        title: 'Günlük yazım',
        description:
          'Her yazı, iddiaların birincil kaynaklarla doğrulandığı bir web araştırması eşliğinde kaleme alınır. Kaynağı olmayan iddia, yazıya girmez.',
      },
      {
        title: 'Çift dil, çeviri değil',
        description:
          'Türkçe ve İngilizce sürümler ayrı ayrı, o dilin kendi doğal akışında yazılır. Biri diğerinin çevirisi değildir; ikisi de kendi bağlamında kurulur.',
      },
      {
        title: 'Redaksiyon',
        description:
          'Türkçe metinler TDK kurallarına, İngilizce metinler en-US yazım kurallarına göre ayrı ayrı gözden geçirilir.',
      },
      {
        title: 'Kapak görselleri',
        description:
          'Kapaklar, el çizimi vintage bir stille, bir AI görsel modeli kullanılarak üretilir. Stok fotoğraf kullanılmaz.',
      },
      {
        title: 'İnsan gözetimi',
        description:
          'Bu sistemi kuran, kuralları belirleyen ve çıktıyı denetleyen bir insan var: Ahmet. Yayınlanan her şey onun sorumluluğu altındadır.',
      },
    ],
    whyHeading: 'Neden Bunu Anlatıyoruz?',
    whyParagraphs: [
      'Çünkü okuyucu güveni, gizlenen bir üretim sürecinin üzerine kurulamaz. AI ile üretilen içeriğin etiketlenmesi, önümüzdeki yıllarda yasal bir zorunluluk haline geliyor — AB\'nin AI Act düzenlemesi bunun erken bir işareti. Biz bunu bir yükümlülük değil, bir tercih olarak şimdiden yapıyoruz.',
      'Sektörde çoğu yayın bu süreci ya gizliyor ya da hiç konuşmuyor. Biz tam tersini yapmayı, güven kurmanın en kısa yolunun dürüstlük olduğuna inandığımız için tercih ediyoruz.',
    ],
    correctionsHeading: 'Hata Bulursanız',
    correctionsParagraphs: [
      'AI destekli bir sistem de olsa, hata payı sıfır değildir. Bir yazıda yanlış, eksik ya da güncelliğini yitirmiş bir bilgi görürseniz, bize ulaşın. Her düzeltme talebi bir insan tarafından değerlendirilir ve gerekirse yazı güncellenir.',
    ],
  },
  en: {
    eyebrow: 'Transparency',
    title: 'How This Blog Is Made',
    intro: [
      'Most of the articles on this site are produced by an AI-assisted editorial system. We are not hiding that, because we do not think there is anything to hide.',
      'The system is not autonomous — a human oversees every step. But AI models handle most of the research, drafting, copyediting, and cover art. Here is exactly how it works.',
    ],
    pipelineHeading: 'The Editorial Pipeline',
    pipelineSteps: [
      {
        title: 'Weekly strategy',
        description:
          'Each week, real search-demand data is reviewed to decide which topics are worth covering. Topics are not picked at random — we check whether readers are actually looking for them first.',
      },
      {
        title: 'Daily writing',
        description:
          'Every article is drafted alongside web research that verifies each claim against primary sources. Claims without a source do not make it into the piece.',
      },
      {
        title: 'Two languages, not one translation',
        description:
          'The Turkish and English versions are each composed independently, in that language\'s own natural voice. Neither is a translation of the other — both are built in their own context.',
      },
      {
        title: 'Copyediting',
        description:
          'Turkish text is reviewed against TDK (Turkish Language Association) rules; English text against en-US style conventions — each handled separately.',
      },
      {
        title: 'Cover art',
        description:
          'Covers are generated with an AI image model in a hand-drawn, vintage illustration style. No stock photography.',
      },
      {
        title: 'Human oversight',
        description:
          'A person built this system, sets its rules, and supervises its output: Ahmet. Everything published is his responsibility.',
      },
    ],
    whyHeading: 'Why We Are Telling You This',
    whyParagraphs: [
      'Because reader trust cannot be built on a production process that stays hidden. Labeling AI-generated content is becoming a legal requirement in the coming years — the EU AI Act is an early signal of that. We are doing it now, by choice, not because we have to.',
      'Most publications in this industry either hide this process or never mention it. We choose to do the opposite, because we believe honesty is the shortest path to earning trust.',
    ],
    correctionsHeading: 'Found a Mistake?',
    correctionsParagraphs: [
      'Even with an AI-assisted system, the error rate is not zero. If you spot something wrong, outdated, or missing in an article, reach out to us. Every correction request is reviewed by a human, and the article is updated if needed.',
    ],
  },
}

export async function generateMetadata({ params }: TransparencyPageProps): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const content = CONTENT[locale]
  return buildPageMetadata({
    locale,
    title: content.title,
    description: content.intro[0],
    paths: Object.fromEntries(
      LOCALES.map((l) => [l, `/${l}/transparency`]),
    ) as Record<Locale, string>,
    type: 'website',
  })
}

export default async function TransparencyPage({ params }: TransparencyPageProps) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const content = CONTENT[locale as Locale]

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-8">
        <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          {content.eyebrow}
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
          {content.title}
        </h1>
      </header>

      <div className="prose">
        {content.intro.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="font-serif text-2xl font-semibold tracking-tight">
          {content.pipelineHeading}
        </h2>
        <ol className="mt-6 space-y-6">
          {content.pipelineSteps.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-sm font-medium text-muted-foreground">
                {index + 1}
              </span>
              <div>
                <p className="font-medium">{step.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="prose mt-10">
        <h2>{content.whyHeading}</h2>
        {content.whyParagraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      <section className="prose mt-10">
        <h2>{content.correctionsHeading}</h2>
        {content.correctionsParagraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>
    </div>
  )
}
