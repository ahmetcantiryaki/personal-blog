import { Fragment, type ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { tableJSXConverters } from '@/components/blog/table-converters'

/**
 * Unit test for the lexical table JSX converters (the design-system markup the
 * post renderer emits for `EXPERIMENTAL_TableFeature` nodes).
 *
 * The full markdown-string → lexical-nodes step runs inside Payload's editor
 * config (which needs a real Payload instance and is stubbed out in the unit
 * env), so it is proven by the end-to-end verification instead. Here we assert
 * the lexical-nodes → HTML half: given a synthetic table node shaped exactly
 * like the converter output (header row + body row, cells with text), the
 * rendered HTML is a real, correctly structured, design-styled <table>.
 */

/** A lexical node the converters accept. */
interface LexicalNode {
  type: string
  children?: LexicalNode[]
  [key: string]: unknown
}

const text = (value: string): LexicalNode => ({ type: 'text', text: value })

/** Recursive renderer mirroring RichText's `nodesToJSX`: text nodes render as
 *  plain text, table node types delegate back to the converters under test. */
const nodesToJSX = ({ nodes }: { nodes?: LexicalNode[] }): ReactNode =>
  (nodes ?? []).map((node, index) => {
    if (node.type === 'text') return <Fragment key={index}>{String(node.text ?? '')}</Fragment>
    const converter = tableJSXConverters[node.type as keyof typeof tableJSXConverters]
    if (!converter) return null
    return <Fragment key={index}>{converter({ node: node as never, nodesToJSX })}</Fragment>
  })

const render = (node: LexicalNode): string =>
  renderToStaticMarkup(<>{nodesToJSX({ nodes: [node] })}</>)

const tableNode: LexicalNode = {
  type: 'table',
  children: [
    {
      type: 'tablerow',
      children: [
        { type: 'tablecell', headerState: 1, children: [text('Bileşen')] },
        { type: 'tablecell', headerState: 1, children: [text('Görevi')] },
      ],
    },
    {
      type: 'tablerow',
      children: [
        { type: 'tablecell', headerState: 0, children: [text('Embedding modeli')] },
        { type: 'tablecell', headerState: 0, children: [text('Metin → vektör')] },
      ],
    },
  ],
}

describe('tableJSXConverters', () => {
  it('renders a real <table> with <th> header cells and <td> body cells', () => {
    const html = render(tableNode)

    expect(html).toContain('<table')
    expect(html).toContain('</table>')
    expect(html).toContain('<th')
    expect(html).toContain('<td')
    expect(html).toContain('Bileşen')
    expect(html).toContain('Embedding modeli')
  })

  it('wraps the table in an overflow-x-auto container so wide tables scroll on mobile', () => {
    expect(render(tableNode)).toContain('overflow-x-auto')
  })

  it('applies design-system tokens: subtle borders and a muted header background', () => {
    const html = render(tableNode)
    expect(html).toContain('border-border/60')
    expect(html).toContain('bg-muted/60')
  })

  it('marks header cells with scope="col" and body cells without it', () => {
    const headerCell = render({ type: 'tablecell', headerState: 1, children: [text('H')] })
    const bodyCell = render({ type: 'tablecell', headerState: 0, children: [text('B')] })

    expect(headerCell).toContain('<th')
    expect(headerCell).toContain('scope="col"')
    expect(bodyCell).toContain('<td')
    expect(bodyCell).not.toContain('scope="col"')
  })

  it('honours colSpan / rowSpan only when greater than 1', () => {
    const spanned = render({
      type: 'tablecell',
      headerState: 0,
      colSpan: 2,
      rowSpan: 1,
      children: [text('x')],
    })
    expect(spanned).toMatch(/colspan="2"/i)
    expect(spanned).not.toMatch(/rowspan/i)
  })
})
