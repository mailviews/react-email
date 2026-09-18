import { theme as baseTheme } from './theme'

/**
 * Design tokens the Maizzle-style layout components need at render time.
 *
 * react-email's <Tailwind> inlines utility classes after our components
 * have rendered, so the MSO ghost-table markup (raw HTML inside
 * conditional comments) never gets Tailwind processing. Section and
 * Container therefore resolve the few utilities Outlook needs on the
 * ghost <td> themselves: padding and background-color, plus widths.
 */

const colors = new Map<string, string>()
const containers = new Map<string, string>()
const appended = new Set<string>()
let spacingBase = 4
let themeCss = baseTheme

function register(css: string): void {
  for (const m of css.matchAll(/--color-([a-z0-9-]+)\s*:\s*([^;]+);/gi)) colors.set(m[1].toLowerCase(), m[2].trim())
  for (const m of css.matchAll(/--container-([a-z0-9-]+)\s*:\s*([^;]+);/gi)) containers.set(m[1].toLowerCase(), m[2].trim())
  const spacing = css.match(/--spacing\s*:\s*([\d.]+)px/)
  if (spacing) spacingBase = Number(spacing[1])
}

register(baseTheme)

/**
 * Append `@theme {}` tokens (brand colors, fonts, spacing) to the Mailviews
 * theme and register them for the layout components. Returns the CSS to
 * pass to `<Tailwind theme={…}>`. Calling it twice with the same CSS is a
 * no-op, so it is safe at module scope.
 */
export function extendTheme(css: string): string {
  if (!appended.has(css)) {
    appended.add(css)
    register(css)
    themeCss = `${themeCss}\n${css}`
  }
  return themeCss
}

/** The Mailviews theme plus everything added through `extendTheme()`. */
export function getTheme(): string {
  return themeCss
}

/** `px` → 1px, `0` → 0, `6` → 24px, `[12px]` → 12px; null when not a length. */
export function spacingToPx(value: string): string | null {
  if (value === 'px') return '1px'
  if (value === '0') return '0'
  if (/^\d+(\.\d+)?$/.test(value)) return `${Number(value) * spacingBase}px`
  const arbitrary = value.match(/^\[(.+)\]$/)
  if (arbitrary) return arbitrary[1].replace(/_/g, ' ')
  return null
}

/** `white` → #fffffe, `neutral-200` → #e5e5e5, `[#7C1D48]` → #7C1D48; null when unknown. */
export function colorToCss(value: string): string | null {
  const arbitrary = value.match(/^\[(.+)\]$/)
  if (arbitrary) return /^(#|rgb|hsl|oklch)/i.test(arbitrary[1]) ? arbitrary[1].replace(/_/g, ' ') : null
  if (value === 'transparent') return 'transparent'
  return colors.get(value.toLowerCase()) ?? null
}

/** Width from `w-*` / `max-w-*` utilities (`max-w-150` → 600px, `w-[336px]` → 336px, `w-full` → 100%). */
export function widthFromClass(className: string | undefined): string | null {
  if (!className) return null
  let width: string | null = null
  for (const token of className.split(/\s+/)) {
    if (!token || token.includes(':')) continue
    const m = token.match(/^(?:max-)?w-(.+)$/)
    if (!m) continue
    if (m[1] === 'full') width = '100%'
    else width = spacingToPx(m[1]) ?? containers.get(m[1]) ?? width
  }
  return width
}

export const px = (value: string | number): string => (typeof value === 'number' || /^\d+(\.\d+)?$/.test(String(value).trim()) ? `${value}px` : String(value))

type Side = 'top' | 'right' | 'bottom' | 'left'
const SIDES: Record<string, Side[]> = {
  '': ['top', 'right', 'bottom', 'left'],
  x: ['left', 'right'],
  y: ['top', 'bottom'],
  t: ['top'],
  r: ['right'],
  b: ['bottom'],
  l: ['left'],
}

/**
 * Inline style for the Outlook ghost `<td>` behind a Section/Container:
 * background-color and padding resolved from the element's utility
 * classes (variants are skipped, Outlook has no media queries), then the
 * `msoStyle` prop so it wins on duplicates. Mirrors Maizzle's
 * msoPlaceholders transformer.
 */
export function msoTdStyle(className: string | undefined, msoStyle?: string): string {
  const padding: Partial<Record<Side, string>> = {}
  let background: string | undefined
  for (const token of (className ?? '').split(/\s+/)) {
    if (!token || token.includes(':')) continue
    const p = token.match(/^p([trblxy]?)-(.+)$/)
    if (p) {
      const value = spacingToPx(p[2])
      if (value !== null) for (const side of SIDES[p[1]]) padding[side] = value
      continue
    }
    const bg = token.match(/^bg-(.+)$/)
    if (bg) {
      const value = colorToCss(bg[1])
      if (value) background = value
    }
  }

  const parts: string[] = []
  if (background) parts.push(`background-color: ${background}`)
  const { top, right, bottom, left } = padding
  if (top !== undefined && right !== undefined && bottom !== undefined && left !== undefined) {
    let shorthand: string
    if (top === right && right === bottom && bottom === left) shorthand = top
    else if (top === bottom && right === left) shorthand = `${top} ${right}`
    else if (right === left) shorthand = `${top} ${right} ${bottom}`
    else shorthand = `${top} ${right} ${bottom} ${left}`
    parts.push(`padding: ${shorthand}`)
  } else {
    for (const side of ['top', 'right', 'bottom', 'left'] as Side[]) if (padding[side] !== undefined) parts.push(`padding-${side}: ${padding[side]}`)
  }
  const extra = msoStyle?.trim().replace(/;\s*$/, '')
  if (extra) parts.push(extra)
  return parts.join('; ')
}
