import * as React from 'react'
import { twMerge } from 'tailwind-merge'

export type HrProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>

const HEIGHT_RE = /(?:^|\s)h-([\w./\-[\]%]+)/g
const LEADING_RE = /(?:^|\s)leading-/

/**
 * Maizzle `<Hr>`: a filled `<div>` rule (defaults `my-6 bg-gray-300 h-px`)
 * whose line-height follows its height so Outlook sizes it.
 */
export function Hr({ className, ...rest }: HrProps) {
  const userClass = className ?? ''
  const heights = [...userClass.matchAll(HEIGHT_RE)]
  const userHeight = heights.length ? heights[heights.length - 1][1] : null
  const userHasLeading = LEADING_RE.test(userClass)
  const defaults = ['my-6', 'bg-gray-300']
  if (!userHeight) defaults.push('h-px')
  if (!userHasLeading && !userHeight) defaults.push('leading-px')
  const derived = userHeight && !userHasLeading ? `leading-${userHeight}` : ''
  return (
    <div role="separator" {...rest} className={twMerge(defaults.join(' '), userClass, derived)}>
      &zwj;
    </div>
  )
}
