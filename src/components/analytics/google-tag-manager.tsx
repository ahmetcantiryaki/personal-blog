import { GoogleTagManager as NextGoogleTagManager } from '@next/third-parties/google'

/**
 * Google Tag Manager integration via the official `@next/third-parties`
 * component. GA4 (and any other tags) are configured inside the GTM container,
 * so this is the single measurement entry point for the frontend.
 *
 * Both the script loader and the <noscript> fallback render only in production
 * builds and only when NEXT_PUBLIC_GTM_ID is set, keeping dev and e2e runs
 * tag-free. The env var is inlined at build time, so the guard tree-shakes.
 */
const gtmId = process.env.NEXT_PUBLIC_GTM_ID

const isEnabled = process.env.NODE_ENV === 'production' && Boolean(gtmId)

/** Injects the GTM loader script. Place inside <body> (frontend layout only). */
export function GoogleTagManager() {
  if (!isEnabled || !gtmId) {
    return null
  }

  return <NextGoogleTagManager gtmId={gtmId} />
}

/**
 * Classic GTM <noscript> iframe fallback. The official component only renders
 * the <script> tags, so we add this manually for snippet parity. Place it
 * immediately after the opening <body> tag.
 */
export function GoogleTagManagerNoScript() {
  if (!isEnabled || !gtmId) {
    return null
  }

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
        title="Google Tag Manager"
      />
    </noscript>
  )
}
