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

export interface OutlookBgProps {
  children?: React.ReactNode
  /** Background image, resolved through `asset()`. */
  src: string
  /** Rectangle width; numbers are pixels. Default 600px. */
  width?: string | number
  /** Rectangle height; auto-sizes to content when omitted. */
  height?: string | number | null
  /** VML fill type. Default `frame` (scale to fill). */
  type?: 'solid' | 'gradient' | 'gradientradial' | 'tile' | 'pattern' | 'frame'
  sizes?: string
  origin?: string
  position?: string
  /** `vertical,horizontal`, e.g. `center,center`; maps to VML origin/position. */
  backgroundPosition?: string
  aspect?: 'atleast' | 'atmost'
  color?: string
  /** Text box inset `top,right,bottom,left`. */
  inset?: string
  stroke?: boolean | string
  strokecolor?: string
  fill?: boolean | string
  /** Fallback colour while the image loads. Default `none`. */
  fillcolor?: string
  /** Element carrying the MSO comment markers. */
  as?: MsoWrapperTag
}

const toBool = (v: boolean | string) => (v === true || v === 'true' ? 'true' : 'false')

/**
 * Maizzle `<OutlookBg>`: VML background image for Outlook on Windows.
 * Give the parent a CSS background for every other client and put the
 * content inside; Outlook paints the image through a `<v:rect>`.
 */
export function OutlookBg({
  children,
  src,
  width = '600px',
  height = null,
  type = 'frame',
  sizes,
  origin,
  position,
  backgroundPosition,
  aspect,
  color,
  inset = '0,0,0,0',
  stroke = false,
  strokecolor,
  fill = true,
  fillcolor = 'none',
  as,
}: OutlookBgProps) {
  const bp = backgroundPosition ? POSITIONS[backgroundPosition.replace(/\s/g, '')] : undefined
  const resolvedOrigin = origin ?? bp
  const resolvedPosition = position ?? bp

  const rectAttrs = [
    `fill="${fillcolor ? 'true' : toBool(fill)}"`,
    `stroke="${strokecolor ? 'true' : toBool(stroke)}"`,
    `style="width: ${px(width)};${height ? ` height: ${px(height)};` : ''}"`,
    strokecolor ? `strokecolor="${strokecolor}"` : '',
    fillcolor ? `fillcolor="${fillcolor}"` : '',
  ]
    .filter(Boolean)
    .join(' ')

  const fillAttrs = [
    `type="${type}"`,
    `src="${asset(src)}"`,
    sizes ? `sizes="${sizes}"` : '',
    aspect ? `aspect="${aspect}"` : '',
    resolvedOrigin ? `origin="${resolvedOrigin}"` : '',
    resolvedPosition ? `position="${resolvedPosition}"` : '',
    color ? `color="${color}"` : '',
  ]
    .filter(Boolean)
    .join(' ')

  const open = `<v:rect xmlns:v="urn:schemas-microsoft-com:vml" ${rectAttrs}><v:fill ${fillAttrs} /><v:textbox inset="${inset}" style="mso-fit-shape-to-text: true"><div>`
  const close = '</div></v:textbox></v:rect>'

  return (
    <Outlook as={as} open={open} close={close}>
      {children}
    </Outlook>
  )
}
