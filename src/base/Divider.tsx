import * as React from 'react'
import { twMerge } from 'tailwind-merge'

export interface DividerProps {
  type?: 'solid' | 'dashed' | 'dotted' | string
  height?: string
  color?: string
  width?: string | number | null
  spaceX?: string | number
  spaceY?: string | number
  align?: 'left' | 'center' | 'right' | string | null
}

const toPx = (v: string | number) => (v === 0 || v === '0' ? '0px' : typeof v === 'number' ? `${v}px` : v)

/** Raw divider line: solid → filled bar; dashed/dotted → border-top. */
export function Divider({ type = 'solid', height = '1px', color = '#d1d5db', width = null, spaceX = '24px', spaceY = '24px', align = null }: DividerProps) {
  const w = width == null ? null : toPx(width)
  const sx = toPx(spaceX)
  const sy = toPx(spaceY)

  const line: React.CSSProperties = { height, lineHeight: height }
  if (type === 'dashed' || type === 'dotted') Object.assign(line, { borderTopStyle: type as 'dashed' | 'dotted', borderTopWidth: height, borderTopColor: color })
  if (type === 'solid') line.backgroundColor = color
  if (sy) Object.assign(line, { marginTop: sy, marginBottom: sy })

  const wrapperClass = twMerge(
    !w && 'w-full',
    align === 'center' && 'mx-auto',
    align === 'right' && 'ml-auto',
    align === 'left' && 'mr-auto',
  )

  return (
    <table cellPadding="0" cellSpacing="0" className={wrapperClass} role="separator">
      <tr>
        {sx && <td style={{ width: sx }}>&zwj;</td>}
        <td style={w ? { width: w } : undefined}>
          <div style={line}>&zwj;</div>
        </td>
        {sx && <td style={{ width: sx }}>&zwj;</td>}
      </tr>
    </table>
  )
}
