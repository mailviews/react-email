import * as React from 'react'
import { twMerge } from 'tailwind-merge'

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: number | string
}

export function Heading({ level = 1, className, children, ...rest }: HeadingProps) {
  const Tag = `h${level}` as 'h1'
  return <Tag {...rest} className={twMerge('m-0', className) || undefined}>{children}</Tag>
}
