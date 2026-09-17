import * as React from 'react'
import { asset } from '../lib/asset'
import type { MsoWrapperTag } from './Outlook'

export interface VFillProps {
  children?: React.ReactNode
  width?: string | number
  height?: string | number | null
  type?: string
  sizes?: string | null
  origin?: string | null
  position?: string | null
  aspect?: string | null
  color?: string | null
  inset?: string
  stroke?: string
  strokecolor?: string | null
  fill?: string
  fillcolor?: string
  image?: string
  as?: MsoWrapperTag
}

/**
 * Outlook-only VML rect whose <v:fill> paints the background image
 * (Outlook ignores CSS background-image). Every other client renders the
 * children as-is and relies on the CSS background on the parent cell.
 */
export function VFill({
  children,
  width = '600px',
  height = null,
  type = 'frame',
  sizes = null,
  origin = null,
  position = null,
  aspect = null,
  color = null,
  inset = '0,0,0,0',
  stroke = 'f',
  strokecolor = null,
  fill = 't',
  fillcolor = 'none',
  image = '',
  as: Tag = 'div',
}: VFillProps) {
  const px = (v: string | number | null) => (v == null ? v : typeof v === 'number' || /^\d+(\.\d+)?$/.test(String(v)) ? `${v}px` : String(v))
  width = px(width) as string
  height = px(height) as string | null
  const rectFill = fillcolor ? 't' : fill
  const rectStroke = strokecolor ? 't' : stroke
  const strokeAttr = strokecolor ? ` strokecolor="${strokecolor}"` : ''
  const fillAttr = fillcolor ? ` fillcolor="${fillcolor}"` : ''
  const heightStyle = height ? `height:${height}` : ''
  const fitToShape = height ? 'false' : 'true'
  const fillOpts =
    (sizes ? ` sizes="${sizes}"` : '') +
    (aspect ? ` aspect="${aspect}"` : '') +
    (origin ? ` origin="${origin}"` : '') +
    (position ? ` position="${position}"` : '') +
    (color ? ` color="${color}"` : '')

  const open =
    '<!--[if mso]>' +
    `<v:rect fill="${rectFill}" stroke="${rectStroke}" style="width:${width};${heightStyle}" xmlns:v="urn:schemas-microsoft-com:vml"${strokeAttr}${fillAttr}>` +
    `<v:fill type="${type}" src="${asset(image) ?? ""}"${fillOpts} />` +
    `<v:textbox inset="${inset}" style="mso-fit-shape-to-text:${fitToShape}"><div><![endif]-->`
  const close = '<!--[if mso]></div></v:textbox></v:rect><![endif]-->'

  return (
    <>
      <Tag dangerouslySetInnerHTML={{ __html: open }} />
      {children}
      <Tag dangerouslySetInnerHTML={{ __html: close }} />
    </>
  )
}
