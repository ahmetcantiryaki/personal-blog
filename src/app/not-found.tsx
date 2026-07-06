import Link from 'next/link'

/**
 * Root-level 404. The localized, fully-chromed 404 lives in
 * `[locale]/not-found.tsx`; this neutral bilingual fallback only renders for
 * routes the locale shell never wraps (an invalid locale prefix or a stray
 * top-level path). It ships its own `<html>`/`<body>` because the app has no
 * root layout — each route group renders its own document shell.
 */
export default function RootNotFound() {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          padding: '2rem',
          textAlign: 'center',
          fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
          color: '#3a3733',
          background: '#faf9f7',
        }}
      >
        <p style={{ fontSize: '3rem', fontWeight: 600, margin: 0, color: '#4b7c78' }}>404</p>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>
          Sayfa bulunamadı · Page not found
        </h1>
        <p style={{ margin: 0, color: '#6b6660', maxWidth: '32rem' }}>
          Aradığınız sayfa taşınmış veya hiç var olmamış olabilir. · The page you are looking for
          may have moved or never existed.
        </p>
        <p style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
          <Link href="/tr" style={{ color: '#4b7c78', textDecoration: 'underline' }}>
            Anasayfa
          </Link>
          <Link href="/en" style={{ color: '#4b7c78', textDecoration: 'underline' }}>
            Home
          </Link>
        </p>
      </body>
    </html>
  )
}
