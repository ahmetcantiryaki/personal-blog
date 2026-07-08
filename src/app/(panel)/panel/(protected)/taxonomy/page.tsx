import { TaxonomyForm, type TaxonomyRow } from '@/components/panel/taxonomy-form'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

type Collection = 'categories' | 'tags'

/**
 * Load every doc of a taxonomy collection in both locales and merge them into a
 * single row per `id`, so the admin form can edit tr + en side by side.
 */
async function loadRows(collection: Collection): Promise<TaxonomyRow[]> {
  const payload = await getPayloadClient()
  const [tr, en] = await Promise.all([
    payload.find({ collection, locale: 'tr', depth: 0, limit: 500, pagination: false, sort: 'key' }),
    payload.find({ collection, locale: 'en', depth: 0, limit: 500, pagination: false, sort: 'key' }),
  ])

  const enById = new Map(en.docs.map((doc) => [doc.id, doc]))

  return tr.docs.map((trDoc) => {
    const enDoc = enById.get(trDoc.id)
    return {
      id: trDoc.id,
      key: trDoc.key,
      tr: {
        title: trDoc.title ?? '',
        slug: trDoc.slug ?? '',
        description: 'description' in trDoc ? (trDoc.description ?? '') : '',
      },
      en: {
        title: enDoc?.title ?? '',
        slug: enDoc?.slug ?? '',
        description: enDoc && 'description' in enDoc ? (enDoc.description ?? '') : '',
      },
    }
  })
}

export default async function TaxonomyPage() {
  const [categories, tags] = await Promise.all([loadRows('categories'), loadRows('tags')])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Taksonomi</h1>
        <p className="text-muted-foreground">Kategorileri ve etiketleri yönetin.</p>
      </div>
      <TaxonomyForm categories={categories} tags={tags} />
    </div>
  )
}
