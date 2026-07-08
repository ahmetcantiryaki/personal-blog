import { Bookmark, Eye, FileText, Heart } from 'lucide-react'

import { StatCard } from '@/components/panel/stat-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getDashboardStats, type TopPost } from '@/lib/panel/stats'
import { routes } from '@/lib/routes'

const SITE_ORIGIN = 'https://woyable.com'

/** Absolute URL to the live post (tr locale) on the public site. */
function livePostUrl(post: TopPost): string | null {
  if (!post.slug) return null
  return `${SITE_ORIGIN}${routes.post('tr', post.slug)}`
}

/** Admin dashboard: headline metrics plus the most-read posts. */
export default async function PanelDashboardPage() {
  const stats = await getDashboardStats()

  const postsHint = `${stats.publishedPosts.toLocaleString('tr-TR')} yayında · ${stats.draftPosts.toLocaleString('tr-TR')} taslak`

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Woyable yönetim paneline hoş geldiniz.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Toplam Yazı" value={stats.totalPosts} hint={postsHint} icon={FileText} />
        <StatCard label="Görüntülenme" value={stats.totalViews} icon={Eye} />
        <StatCard label="Beğeni" value={stats.totalLikes} icon={Heart} />
        <StatCard label="Kaydetme" value={stats.totalBookmarks} icon={Bookmark} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl">En Çok Okunanlar</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.topPosts.length === 0 ? (
            <p className="text-sm text-muted-foreground">Henüz görüntülenme verisi yok.</p>
          ) : (
            <ol className="flex flex-col divide-y divide-border/60">
              {stats.topPosts.map((post, index) => {
                const url = livePostUrl(post)
                return (
                  <li key={post.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                    <span className="w-5 shrink-0 font-serif text-lg font-semibold text-muted-foreground tabular-nums">
                      {index + 1}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">
                      {url ? (
                        <a
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="transition-colors hover:text-primary"
                        >
                          {post.title}
                        </a>
                      ) : (
                        post.title
                      )}
                    </span>
                    <span className="shrink-0 text-sm text-muted-foreground tabular-nums">
                      {post.views.toLocaleString('tr-TR')} görüntülenme
                    </span>
                  </li>
                )
              })}
            </ol>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
