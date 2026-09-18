import * as React from 'react'
import { Outlook, type MsoWrapperTag } from './Outlook'
import { asset } from '../lib/asset'
import { px } from '../lib/tokens'

const POSITIONS: Record<string, string> = {
  'top,left': '-0.5,-0.5',
  'top,center': '0,-0.5',
  'top,right': '0.5,-0.5',
  'center,left': '-0.5,0',
  'center,center': '0,0',
  'center,right': '0.5,0',
  'bottom,left': '-0.5,0.5',
  'bottom,center': '0,0.5',
  'bottom,right': '0.5,0.5',
}

export interface VmlProps {
  children?: React.ReactNode
  /** `rect` (default), `roundrect`, `oval` or `line`. */
  shape?: 'rect' | 'roundrect' | 'oval' | 'line'
  /** Corner radius for `roundrect`, 0–1. */
  arcsize?: string | number
  /** `shape="line"` start / end, as `"x,y"`. */
  from?: string
  to?: string
  /** Shape width; numbers are pixels. Default 600px. */
  width?: string | number
  /** Shape height; auto-sizes to content when omitted. */
  height?: string | number | null
  type?: 'solid' | 'gradient' | 'gradientradial' | 'tile' | 'pattern' | 'frame'
  /** Fill image, resolved through `asset()`. */
  src?: string
  color?: string
  color2?: string
  angle?: string | number
  focus?: string | number
  focussize?: string
  focusposition?: string
  sizes?: string
  origin?: string
  position?: string
  /** `vertical,horizontal`, e.g. `center,center`; maps to VML origin/position. */
  backgroundPosition?: string
  aspect?: 'atleast' | 'atmost'
  /** Text box inset `top,right,bottom,left`. */
  inset?: string
  stroke?: boolean | string | null
  strokecolor?: string
  fill?: boolean | string | null
  fillcolor?: string
  /** Element carrying the MSO comment markers. */
  as?: MsoWrapperTag
}

const toBool = (v: boolean | string) => (v === true || v === 'true' ? 'true' : 'false')

/**
 * Maizzle `<Vml>`: Outlook-only VML shape around the children. Modern
 * clients render the children as-is (style them with CSS); Outlook
 * draws the shape and puts the children in its text box.
 */
export function Vml({
  children,
  shape = 'rect',
  arcsize,
  from,
  to,
  width = '600px',
  height = null,
  type,
  src,
  color,
  color2,
  angle,
  focus,
  focussize,
  focusposition,
  sizes,
  origin,
  position,
  backgroundPosition,
  aspect,
  inset = '0,0,0,0',
  stroke = null,
  strokecolor,
  fill = null,
  fillcolor,
  as,
}: VmlProps) {
  const bp = backgroundPosition ? POSITIONS[backgroundPosition.replace(/\s/g, '')] : undefined
  const resolvedOrigin = origin ?? bp
  const resolvedPosition = position ?? bp
  const isLine = shape === 'line'
  const element = `v:${shape}`
  const fillResolved = fill === null ? !isLine : fill
  const strokeResolved = stroke === null ? isLine : stroke

  const styleParts: string[] = []
  if (!isLine) {
    styleParts.push(`width: ${px(width)}`)
    if (height) styleParts.push(`height: ${px(height)}`)
  }
  const shapeAttrs = [
    `fill="${fillcolor ? 'true' : toBool(fillResolved)}"`,
    `stroke="${strokecolor ? 'true' : toBool(strokeResolved)}"`,
    styleParts.length ? `style="${styleParts.join('; ')};"` : '',
    strokecolor ? `strokecolor="${strokecolor}"` : '',
    fillcolor ? `fillcolor="${fillcolor}"` : '',
    shape === 'roundrect' && arcsize !== undefined ? `arcsize="${arcsize}"` : '',
    isLine && from ? `from="${from}"` : '',
    isLine && to ? `to="${to}"` : '',
  ]
    .filter(Boolean)
    .join(' ')

  const hasFill = [type, src, color, color2, angle, focus, focussize, focusposition, sizes, aspect, resolvedOrigin, resolvedPosition].some(v => v !== undefined)
  const fillAttrs = hasFill
    ? [
        type ? `type="${type}"` : '',
        src ? `src="${asset(src)}"` : '',
        color ? `color="${color}"` : '',
        color2 ? `color2="${color2}"` : '',
        angle !== undefined ? `angle="${angle}"` : '',
        focus !== undefined ? `focus="${focus}"` : '',
        focussize ? `focussize="${focussize}"` : '',
        focusposition ? `focusposition="${focusposition}"` : '',
        sizes ? `sizes="${sizes}"` : '',
        aspect ? `aspect="${aspect}"` : '',
        resolvedOrigin ? `origin="${resolvedOrigin}"` : '',
        resolvedPosition ? `position="${resolvedPosition}"` : '',
      ]
        .filter(Boolean)
        .join(' ')
    : ''

  const open =
    `<${element} xmlns:v="urn:schemas-microsoft-com:vml" ${shapeAttrs}>` +
    (hasFill ? `<v:fill ${fillAttrs} />` : '') +
    `<v:textbox inset="${inset}" style="mso-fit-shape-to-text: true"><div>`
  const close = `</div></v:textbox></${element}>`

  return (
    <Outlook as={as} open={open} close={close}>
      {children}
    </Outlook>
  )
}
