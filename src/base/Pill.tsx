import * as React from 'react'
import { twMerge } from 'tailwind-merge'
import { Outlook } from './Outlook'

export interface PillProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Add an Outlook-only 8px break before the pill. */
  msoBreak?: boolean
  msoPx?: string | number
}

export function Pill({ msoBreak = false, msoPx = '40%', className, children, ...rest }: PillProps) {
  const merged = twMerge(
    'inline-block py-0.5 px-2 text-xs font-medium mso-text-raise-[2px] rounded-full border border-solid border-gray-300 text-gray-600 mso-padding-alt-0 bg-gray-50',
    className,
  )
  const gap = `<!--[if mso]><i hidden style="mso-font-width: ${msoPx}">&emsp;&#8203;</i><![endif]-->`
  return (
    <>
      {msoBreak && <Outlook raw='<div role="separator" style="height:8px">&zwj;</div>' />}
      <span {...rest} className={merged}>
        <span dangerouslySetInnerHTML={{ __html: gap }} />
        <span>{children}</span>
        <span dangerouslySetInnerHTML={{ __html: gap }} />
      </span>
    </>
  )
}
