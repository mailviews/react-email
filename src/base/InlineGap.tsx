import * as React from 'react'

export interface InlineGapProps {
  raise?: string
  width?: string
  zwsp?: boolean
}

/** Outlook-only inline gap via a hidden mso-font-width em space. */
export function InlineGap({ raise = '', width = '', zwsp = true }: InlineGapProps) {
  const parts: string[] = []
  if (raise) parts.push(`mso-text-raise: ${raise}`)
  if (width) parts.push(`mso-font-width: ${width}`)
  const content = zwsp ? '&emsp;&#8203;' : '&emsp;'
  return <span dangerouslySetInnerHTML={{ __html: `<!--[if mso]><i hidden style="${parts.join('; ')};">${content}</i><![endif]-->` }} />
}
