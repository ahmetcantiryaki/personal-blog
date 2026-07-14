import Image from 'next/image'

interface CreatorCardProps {
  /** Small caption above the profile row, e.g. "created by". */
  label: string
}

/** Inline X (Twitter) logo — lucide's bird icon is the pre-rebrand mark. */
function XLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

/**
 * Compact header variant: mini avatar + handle, reads like a nav item.
 * Links to the same X profile as the footer card.
 */
export function CreatorChip({ ariaLabel }: { ariaLabel: string }) {
  return (
    <a
      href="https://x.com/ahmetcantryk"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className="inline-flex items-center gap-2 rounded-full border border-border/70 py-1 pl-1 pr-3 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <Image
        src="/images/ahmetcantryk.jpg"
        alt=""
        width={24}
        height={24}
        className="rounded-full"
      />
      @ahmetcantryk
      <XLogo className="size-3" />
    </a>
  )
}

/**
 * "Created by" card in the footer, styled like an X profile card: avatar,
 * display name, @handle, X logo. The whole card links to the profile.
 */
export function CreatorCard({ label }: CreatorCardProps) {
  return (
    <a
      href="https://x.com/ahmetcantryk"
      target="_blank"
      rel="noopener noreferrer"
      className="group block w-full max-w-xs rounded-xl border border-border/70 bg-card p-4 shadow-sm transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <XLogo className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
      </div>
      <div className="mt-3 flex items-center gap-3">
        <Image
          src="/images/ahmetcantryk.jpg"
          alt="Ahmet Can Tiryaki"
          width={44}
          height={44}
          className="rounded-full border border-border/60"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">Ahmet Can Tiryaki</p>
          <p className="truncate text-xs text-muted-foreground">@ahmetcantryk</p>
        </div>
      </div>
    </a>
  )
}
