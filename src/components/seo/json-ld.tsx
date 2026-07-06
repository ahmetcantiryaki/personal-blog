import { serializeJsonLd, type JsonLdNode } from '@/lib/json-ld'

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
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(node) }}
        />
      ))}
    </>
  )
}
