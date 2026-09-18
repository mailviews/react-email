import * as React from 'react'
import { twMerge } from 'tailwind-merge'
import { Outlook, type MsoWrapperTag } from './Outlook'
import { msoTdStyle, px, widthFromClass } from '../lib/tokens'

export interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Max width of the section: `max-width` on the div, `width` on the MSO table. */
  width?: string | number
  /** Inline CSS for the Outlook ghost `<td>` only, appended after the resolved padding/background. */
  msoStyle?: string
  /** Skip the Outlook ghost table. */
  outlookFallback?: boolean
  /** Element carrying the MSO comment markers (React can't emit bare comments). */
  as?: MsoWrapperTag
}

/**
 * Maizzle `<Section>`: a `<div>` wrapped in an Outlook-only ghost table
 * whose cell repeats the div's padding and background colour, since
 * Word ignores both on a div.
 */
export function Section({ width, msoStyle, outlookFallback = true, as, className, style, children, ...rest }: SectionProps) {
  const merged = width != null ? twMerge(`max-w-[${px(width)}]`, className) : className ? twMerge(className) : undefined
  const div = (
    <div {...rest} className={merged || undefined} style={style}>
      {children}
    </div>
  )
  if (!outlookFallback) return div
  const msoWidth = width != null ? px(width) : widthFromClass(className) ?? '100%'
  const td = msoTdStyle(className, msoStyle)
  const open = `<table role="none" cellpadding="0" cellspacing="0" style="width: ${msoWidth}"><tr><td${td ? ` style="${td}"` : ''}>`
  return (
    <Outlook as={as} open={open} close="</td></tr></table>">
      {div}
    </Outlook>
  )
}
