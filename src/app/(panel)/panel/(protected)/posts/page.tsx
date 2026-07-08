import Link from 'next/link'

import { PostRow } from '@/components/panel/post-row'
import { getPayloadClient } from '@/lib/payload'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 20

const STATUS_FILTERS = [
  { value: '', label: 'Tümü' },
  { value: 'published', label: 'Yayında' },
  { value: 'draft', label: 'Taslak' },
] as const

type StatusFilter = (typeof STATUS_FILTERS)[number]['value']

interface PostsPageProps {
  searchParams: Promise<{ status?: string; page?: string }>
}

function normalizeStatus(value: string | undefined): StatusFilter {
  return value === 'published' || value === 'draft' ? value : ''
}

function buildHref(status: StatusFilter, page: number): string {
  const params = new URLSearchParams()
  if (status) params.set('status', status)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `/panel/posts?${query}` : '/panel/posts'
}

/** Admin posts index: filterable, paginated table over the Turkish locale. */
export default async function PostsPage({ searchParams }: PostsPageProps) {
  const params = await searchParams
  const status = normalizeStatus(params.status)
  const page = Math.max(1, Number.parseInt(params.page ?? '1', 10) || 1)

  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'posts',
    locale: 'tr',
    overrideAccess: true,
    depth: 1,
    sort: '-publishedAt',
    limit: PAGE_SIZE,
    page,
    ...(status ? { where: { status: { equals: status } } } : {}),
  })

  const { docs, totalPages, totalDocs, hasPrevPage, hasNextPage } = result

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Yazılar</h1>
        <p className="text-muted-foreground">Toplam {totalDocs} yazı.</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {STATUS_FILTERS.map((filter) => (
          <Link
            key={filter.value || 'all'}
            href={buildHref(filter.value, 1)}
            className={cn(
              'inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium transition-colors',
              status === filter.value
                ? 'border-transparent bg-primary text-primary-foreground'
                : 'border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground',
            )}
          >
            {filter.label}
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border border-border/70 bg-card">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border/70 text-xs uppercase tracking-wide text-muted-foreground">
              <th className="py-2.5 pl-4 pr-3 font-medium">Kapak</th>
              <th className="py-2.5 pr-3 font-medium">Başlık</th>
              <th className="py-2.5 pr-3 font-medium">Durum</th>
              <th className="py-2.5 pr-3 font-medium">Kategori</th>
              <th className="py-2.5 pr-3 font-medium">Yayın tarihi</th>
              <th className="py-2.5 pr-4 font-medium text-right">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {docs.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                  Bu filtreye uygun yazı bulunamadı.
                </td>
              </tr>
            ) : (
              docs.map((post) => <PostRow key={post.id} post={post} />)
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Sayfa {page} / {totalPages}
          </span>
          <div className="flex gap-2">
            {hasPrevPage ? (
              <Link
                href={buildHref(status, page - 1)}
                className="rounded-md border border-border px-3 py-1.5 font-medium hover:bg-accent"
              >
                Önceki
              </Link>
            ) : null}
            {hasNextPage ? (
              <Link
                href={buildHref(status, page + 1)}
                className="rounded-md border border-border px-3 py-1.5 font-medium hover:bg-accent"
              >
                Sonraki
              </Link>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}
