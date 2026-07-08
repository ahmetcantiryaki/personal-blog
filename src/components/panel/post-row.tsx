import Link from 'next/link'

import { CoverArt } from '@/components/blog/cover-art'
import type { CoverStyle } from '@/components/blog/cover-palettes'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/format'
import type { Category, Post } from '@/payload-types'

interface PostRowProps {
  post: Post
}

const STATUS_LABELS: Record<Post['status'], string> = {
  published: 'Yayında',
  draft: 'Taslak',
}

function categoryTitle(category: Post['category']): string {
  if (category && typeof category === 'object') return (category as Category).title
  return '—'
}

/** One row in the admin posts table: cover thumb, title, status, category, date. */
export function PostRow({ post }: PostRowProps) {
  return (
    <tr className="border-b border-border/60 last:border-0 hover:bg-muted/40">
      <td className="py-3 pl-4 pr-3">
        <div className="h-12 w-20 overflow-hidden rounded-md border border-border/60">
          {post.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.coverImage} alt="" className="h-full w-full object-cover" />
          ) : (
            <CoverArt
              style={post.coverStyle as CoverStyle}
              title={post.title}
              seed={post.slug}
              variant="plain"
            />
          )}
        </div>
      </td>
      <td className="py-3 pr-3">
        <Link
          href={`/panel/posts/${post.id}`}
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          {post.title}
        </Link>
      </td>
      <td className="py-3 pr-3">
        <Badge variant={post.status === 'published' ? 'default' : 'outline'}>
          {STATUS_LABELS[post.status]}
        </Badge>
      </td>
      <td className="py-3 pr-3 text-sm text-muted-foreground">{categoryTitle(post.category)}</td>
      <td className="py-3 pr-3 text-sm text-muted-foreground">
        {post.publishedAt ? formatDate(post.publishedAt, 'tr') : '—'}
      </td>
      <td className="py-3 pr-4 text-right">
        <Link
          href={`/panel/posts/${post.id}`}
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Düzenle
        </Link>
      </td>
    </tr>
  )
}
