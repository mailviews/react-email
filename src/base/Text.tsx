import * as React from 'react'
import { twMerge } from 'tailwind-merge'

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'p' | 'span'
}

export function Text({ as = 'p', className, children, ...rest }: TextProps) {
  const Tag = as
  const merged = twMerge(as === 'span' ? '' : 'mt-4 text-base', className) || undefined
  return <Tag {...rest} className={merged}>{children}</Tag>
}
