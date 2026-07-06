'use client'

import { Check, Link2, Share2 } from 'lucide-react'
import * as React from 'react'
import { toast } from 'sonner'

import type { Dictionary } from '@/i18n'
import { cn } from '@/lib/utils'

interface ShareButtonsProps {
  url: string
  title: string
  dict: Dictionary
}

/** Copy-link + share-on-X buttons. Absolute URL is resolved on the client. */
export function ShareButtons({ url, title, dict }: ShareButtonsProps) {
  const [copied, setCopied] = React.useState(false)

  const absoluteUrl = React.useMemo(() => {
    if (typeof window === 'undefined') return url
    return new URL(url, window.location.origin).toString()
  }, [url])

  const copy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(absoluteUrl)
      setCopied(true)
      toast.success(dict.post.linkCopied)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error(dict.auth.genericError)
    }
  }, [absoluteUrl, dict.auth.genericError, dict.post.linkCopied])

  const xHref = `https://x.com/intent/post?text=${encodeURIComponent(title)}&url=${encodeURIComponent(
    absoluteUrl,
  )}`

  const btn =
    'inline-flex size-9 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

  return (
    <div className="flex items-center gap-2">
      <span className="mr-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
        <Share2 className="size-4" aria-hidden />
        {dict.post.share}
      </span>
      <button type="button" onClick={copy} aria-label={dict.post.copyLink} className={btn}>
        {copied ? <Check className="size-4 text-primary" /> : <Link2 className="size-4" />}
      </button>
      <a
        href={xHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={dict.post.shareOnX}
        className={cn(btn)}
      >
        <svg viewBox="0 0 24 24" aria-hidden className="size-4 fill-current">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.653l-5.214-6.817-5.966 6.817H1.685l7.73-8.835L1.254 2.25h6.82l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>
    </div>
  )
}
