import * as React from 'react'
import { twMerge } from 'tailwind-merge'
import { Outlook, type MsoWrapperTag } from './Outlook'
import { msoTdStyle, px, widthFromClass } from '../lib/tokens'

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Max width: `max-width` on the div, `width` on the centered MSO table. Defaults to 600px (`max-w-150`). */
  width?: string | number
  /** Inline CSS for the Outlook ghost `<td>` only, appended after the resolved padding/background. */
  msoStyle?: string
  /** Skip the Outlook ghost table. */
  outlookFallback?: boolean
  /** Element carrying the MSO comment markers (React can't emit bare comments). */
  as?: MsoWrapperTag
}

/**
 * Maizzle `<Container>`: a centered, max-width `<div>` plus a fixed-width,
 * centered Outlook ghost table (Word ignores `max-width`).
 */
export function Container({ width, msoStyle, outlookFallback = true, as, className, style, children, ...rest }: ContainerProps) {
  const classWidth = widthFromClass(className)
  const merged = twMerge('m-0 mx-auto', width != null ? `max-w-[${px(width)}]` : classWidth ? '' : 'max-w-150', className)
  const div = (
    <div {...rest} className={merged} style={style}>
      {children}
    </div>
  )
  if (!outlookFallback) return div
  const msoWidth = width != null ? px(width) : classWidth ?? '600px'
  const td = msoTdStyle(className, msoStyle)
  const open = `<table role="none" cellpadding="0" cellspacing="0" style="width: ${msoWidth}" align="center"><tr><td${td ? ` style="${td}"` : ''}>`
  return (
    <Outlook as={as} open={open} close="</td></tr></table>">
      {div}
    </Outlook>
  )
}
