import * as React from 'react'

const VERSION_MAP: Record<string, number> = { 2003: 11, 2007: 12, 2010: 14, 2013: 15, 2016: 16, 2019: 16 }
const toMso = (v: string) => VERSION_MAP[v.trim()]
const parseList = (value: string) => value.split(',').map(toMso).filter(Boolean)

export type MsoWrapperTag = 'div' | 'span' | 'td' | 'tr' | 'p'

export interface OutlookProps {
  children?: React.ReactNode
  /**
   * Raw HTML rendered inside the conditional comment instead of `children`.
   * Use for VML / ghost-table markup; nothing inside gets Tailwind processing.
   */
  raw?: string
  /** Element used to carry the comment markers (React can't emit bare comments). */
  as?: MsoWrapperTag
  only?: string
  not?: string
  lt?: string
  lte?: string
  gt?: string
  gte?: string
  /** Raw HTML placed right after the opening conditional, before `children`. */
  open?: string
  /** Raw HTML placed right before the closing conditional, after `children`. */
  close?: string
}

export function msoCondition(props: Pick<OutlookProps, 'only' | 'not' | 'lt' | 'lte' | 'gt' | 'gte'>): string {
  if (props.only) {
    const versions = parseList(props.only)
    return versions.length === 1 ? `mso ${versions[0]}` : versions.map(v => `(mso ${v})`).join('|')
  }
  if (props.not) {
    const versions = parseList(props.not)
    return versions.length === 1 ? `!mso ${versions[0]}` : `!(${versions.map(v => `mso ${v}`).join('|')})`
  }
  const parts: string[] = []
  if (props.lt) parts.push(`lt mso ${toMso(props.lt)}`)
  if (props.lte) parts.push(`lte mso ${toMso(props.lte)}`)
  if (props.gt) parts.push(`gt mso ${toMso(props.gt)}`)
  if (props.gte) parts.push(`gte mso ${toMso(props.gte)}`)
  return parts.length ? parts.map(p => `(${p})`).join('&') : 'mso'
}

/**
 * Render content only in Outlook on Windows (MSO conditional comment).
 *
 * With `raw`, the whole `<!--[if mso]>…<![endif]-->` block lives in one
 * wrapper element. With `children`, the opening and closing comments are
 * emitted as two sibling wrapper elements so the children stay real React
 * elements (and keep their Tailwind classes). Both forms balance in Word's
 * HTML parser; other clients only see empty wrapper elements.
 */
export function Outlook({ children, raw, as: Tag = 'div', open = '', close = '', ...cond }: OutlookProps) {
  const condition = msoCondition(cond)
  if (raw !== undefined) {
    return <Tag dangerouslySetInnerHTML={{ __html: `<!--[if ${condition}]>${open}${raw}${close}<![endif]-->` }} />
  }
  /**
   * Marker mode. Outlook parses `<Tag>OPEN</Tag> … <Tag>CLOSE</Tag>`; the
   * wrapper's closing tag would implicitly close whatever OPEN started, so
   * an extra `<Tag>` inside the conditional absorbs it (and the mirror
   * `</Tag>` in the closing marker re-balances).
   */
  const absorb = open ? `<${Tag}>` : ''
  const release = close ? `</${Tag}>` : ''
  return (
    <>
      <Tag dangerouslySetInnerHTML={{ __html: `<!--[if ${condition}]>${open}${absorb}<![endif]-->` }} />
      {children}
      <Tag dangerouslySetInnerHTML={{ __html: `<!--[if ${condition}]>${release}${close}<![endif]-->` }} />
    </>
  )
}
