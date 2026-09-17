import * as React from 'react'
import type { MsoWrapperTag } from './Outlook'

export interface NotOutlookProps {
  children?: React.ReactNode
  /** Element used to carry the comment markers (React can't emit bare comments). */
  as?: MsoWrapperTag
}

/**
 * Hide content from Outlook on Windows (downlevel-revealed conditional).
 * Children stay React elements; only the comment markers are raw HTML.
 */
export function NotOutlook({ children, as: Tag = 'div' }: NotOutlookProps) {
  return (
    <>
      <Tag dangerouslySetInnerHTML={{ __html: '<!--[if !mso]><!-->' }} />
      {children}
      <Tag dangerouslySetInnerHTML={{ __html: '<!--<![endif]-->' }} />
    </>
  )
}
