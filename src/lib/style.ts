import type { CSSProperties } from 'react'

/** Convert a `prop: value; prop: value` string to a React style object. */
export function toStyle(css: string | null | undefined): CSSProperties {
  const out: Record<string, string> = {}
  if (!css) return out
  for (const decl of css.split(';')) {
    const i = decl.indexOf(':')
    if (i === -1) continue
    const prop = decl.slice(0, i).trim()
    const value = decl.slice(i + 1).trim()
    if (!prop || !value) continue
    const key = prop.startsWith('--') ? prop : prop.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
    out[key] = value
  }
  return out
}
