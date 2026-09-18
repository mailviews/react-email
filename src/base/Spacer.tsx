import * as React from 'react'
import { spacingToPx } from '../lib/tokens'

export interface SpacerProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  type?: 'vertical' | 'horizontal'
  /** Width in px of a horizontal spacer. Falls back to a `w-*` class, then 16. */
  width?: string | number
  outlookFallback?: boolean
}

const HEIGHT_RE = /(?:^|\s)h-([\w./\-[\]%]+)/g
const LEADING_RE = /(?:^|\s)leading-/
const WIDTH_RE = /(?:^|\s)w-([\w./\-[\]%]+)/

/** `h-*` alone doesn't size an empty div in Outlook; pair it with `leading-*`. */
function verticalClass(userClass = ''): string | undefined {
  if (!userClass) return undefined
  const heights = [...userClass.matchAll(HEIGHT_RE)]
  const stripped = userClass.replace(HEIGHT_RE, ' ').replace(/\s+/g, ' ').trim()
  if (!heights.length) return stripped
  if (LEADING_RE.test(stripped)) return stripped
  return `${stripped} leading-${heights[heights.length - 1][1]}`.trim()
}

const px = (v: string | number) => (typeof v === 'number' ? v : Number.parseFloat(v) || 0)

/** Vertical (default) or horizontal spacer, Outlook-safe. */
export function Spacer({ type = 'vertical', width, outlookFallback = true, className, style, ...rest }: SpacerProps) {
  if (type === 'horizontal') {
    // Like Maizzle, a `w-*` class sizes the spacer; strip it so the inline width is the only source.
    const classWidth = className?.match(WIDTH_RE)
    if (width === undefined && classWidth) width = spacingToPx(classWidth[1]) ?? undefined
    if (classWidth) className = className!.replace(WIDTH_RE, ' ').replace(/\s+/g, ' ').trim() || undefined
    width ??= 16
    const widthPx = px(width)
    const numEmsps = Math.ceil(widthPx / 80)
    const percent = Math.round((widthPx / (numEmsps * 16)) * 100)
    const styles: React.CSSProperties = {
      display: 'inline-block',
      width: typeof width === 'number' || Number.isFinite(Number(width)) ? `${width}px` : width,
      fontSize: '16px',
      ...(outlookFallback ? { msoFontWidth: `${percent}%` } : {}),
      ...style,
    } as React.CSSProperties
    return <i {...rest} className={className} style={styles}>{' '.repeat(numEmsps)}</i>
  }
  return (
    <div role="separator" {...rest} className={verticalClass(className)} style={style}>
      &zwj;
    </div>
  )
}
