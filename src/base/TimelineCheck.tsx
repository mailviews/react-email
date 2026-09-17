import * as React from 'react'
import { asset } from '../lib/asset'

export interface TimelineCheckProps {
  color?: string
  icon?: string
}

/** 12px round marker with a check icon; VML oval fallback for Outlook. */
export function TimelineCheck({ color = '#6EE7B7', icon = 'timelines/icon-check.png' }: TimelineCheckProps) {
  const open = `<!--[if mso]><v:oval xmlns:v="urn:schemas-microsoft-com:vml" style="width: 12px; height: 12px;" stroke="false" fillcolor="${color}"><v:textbox inset="0,0,0,0" style="mso-fit-shape-to-text:true; text-align: center;"><![endif]-->`
  const close = '<!--[if mso]></v:textbox></v:oval><![endif]-->'
  return (
    <div className="size-3 leading-2.5 rounded-full text-center mso-shading-transparent" style={{ backgroundColor: color }}>
      <span dangerouslySetInnerHTML={{ __html: open }} />
      <img src={asset(icon)} width={8} className="max-w-full align-middle mb-px" alt="" />
      <span dangerouslySetInnerHTML={{ __html: close }} />
    </div>
  )
}
