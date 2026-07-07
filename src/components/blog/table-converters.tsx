import type { SerializedLexicalNode } from '@payloadcms/richtext-lexical/lexical'
import type { JSX, ReactNode } from 'react'

import { cn } from '@/lib/utils'

/**
 * JSX converters for the lexical `EXPERIMENTAL_TableFeature` nodes.
 *
 * The library's default table converters emit hardcoded inline styles
 * (`border: 1px solid #ccc; padding: 8px`) that ignore the design system and
 * break in dark mode. We override `table`/`tablerow`/`tablecell` here so tables
 * render with design-system tokens: subtle `border-border/60` borders, a muted
 * header-row background, comfortable cell padding, and — critically — an
 * `overflow-x-auto` wrapper so wide tables scroll on a 375px viewport instead of
 * blowing out the page width.
 *
 * The node shape mirrors `@lexical/table`: a cell is a header cell when its
 * `headerState` is greater than 0 (the markdown transformer sets the first row's
 * cells to `TableCellHeaderStates.ROW`). `colSpan`/`rowSpan` are honoured when
 * present (> 1) so merged cells authored in the admin panel survive rendering.
 */

/** Minimal shape of a lexical node the converters receive. */
interface LexicalNode extends SerializedLexicalNode {
  children?: LexicalNode[]
}

interface TableCellNode extends LexicalNode {
  headerState?: number
  colSpan?: number
  rowSpan?: number
}

/**
 * The `nodesToJSX` helper RichText passes to every converter. `nodes` is
 * required (matching the library signature) so this stays assignable to the
 * `JSXConverter` contract under strict function-type checks.
 */
type NodesToJSX = (args: { nodes: SerializedLexicalNode[] }) => ReactNode

interface ConverterArgs<TNode extends LexicalNode = LexicalNode> {
  node: TNode
  nodesToJSX: NodesToJSX
}

const spanAttr = (value: number | undefined): number | undefined =>
  value && value > 1 ? value : undefined

export const tableJSXConverters = {
  table: ({ node, nodesToJSX }: ConverterArgs): JSX.Element => (
    <div className="my-6 overflow-x-auto rounded-lg border border-border/60">
      <table className="w-full border-collapse text-sm">
        <tbody>{nodesToJSX({ nodes: node.children ?? [] })}</tbody>
      </table>
    </div>
  ),

  tablerow: ({ node, nodesToJSX }: ConverterArgs): JSX.Element => (
    <tr className="border-b border-border/60 last:border-b-0">
      {nodesToJSX({ nodes: node.children ?? [] })}
    </tr>
  ),

  tablecell: ({ node, nodesToJSX }: ConverterArgs<TableCellNode>): JSX.Element => {
    const isHeader = (node.headerState ?? 0) > 0
    const children = nodesToJSX({ nodes: node.children ?? [] })
    const className = cn(
      'px-4 py-2.5 text-left align-top',
      isHeader
        ? 'bg-muted/60 font-semibold text-foreground'
        : 'text-muted-foreground',
    )

    if (isHeader) {
      return (
        <th className={className} colSpan={spanAttr(node.colSpan)} rowSpan={spanAttr(node.rowSpan)} scope="col">
          {children}
        </th>
      )
    }

    return (
      <td className={className} colSpan={spanAttr(node.colSpan)} rowSpan={spanAttr(node.rowSpan)}>
        {children}
      </td>
    )
  },
}
