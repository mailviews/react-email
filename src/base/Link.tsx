import * as React from 'react'
import { twMerge } from 'tailwind-merge'

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
}

/** Maizzle `<Link>`: an `<a>` that defaults to `no-underline`. */
export function Link({ href, className, children, ...rest }: LinkProps) {
  return (
    <a {...rest} href={href} className={twMerge('no-underline', className)}>
      {children}
    </a>
  )
}
