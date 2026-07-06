import type { JsonLdNode } from '@/lib/json-ld'

/**
 * Characters that must be escaped so JSON-LD can't break out of a `<script>`:
 * the HTML-significant `<` `>` `&`, plus the JS line/paragraph separators
 * (U+2028 / U+2029) which are valid in JSON strings but break inline scripts.
 * Built via `RegExp` from a string so the separators stay as escapes (a literal
 * regex can't contain real line terminators).
 */
const UNSAFE = new RegExp('[<>&\\u2028\\u2029]', 'g')

function escapeChar(char: string): string {
  return `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`
}

/**
 * Serialize JSON-LD safely for inline `<script>` embedding. Prevents
 * stored-XSS via post content (titles, excerpts) flowing into JSON-LD.
 */
function serialize(data: JsonLdNode): string {
  return JSON.stringify(data).replace(UNSAFE, escapeChar)
}

interface JsonLdProps {
  data: JsonLdNode | JsonLdNode[]
}

/** Renders one or more JSON-LD blocks as server-rendered script tags. */
export function JsonLd({ data }: JsonLdProps) {
  const nodes = Array.isArray(data) ? data : [data]
  return (
    <>
      {nodes.map((node, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serialize(node) }}
        />
      ))}
    </>
  )
}
