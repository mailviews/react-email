import * as React from 'react'
import { twMerge } from 'tailwind-merge'
import { asset } from '../lib/asset'

export interface ButtonProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string
  variant?: 'solid' | 'outline' | 'link' | string
  align?: 'left' | 'center' | 'right' | string | null
  msoPt?: string | number
  msoPb?: string | number
  icon?: string | null
  iconWidth?: string | number
  iconPosition?: 'left' | 'right' | string
  iconClass?: string
  iconAlt?: string
  msoPx?: string | number
  outlookFallback?: boolean
}

/**
 * Mailviews <Button>: solid / outline / link variants, optional icon, and
 * Outlook padding via hidden mso-font-width spacers. Hover styling comes
 * from the passed className (e.g. `hover:bg-indigo-700`).
 */
export function Button({
  href,
  variant = 'solid',
  align = null,
  msoPt = '16px',
  msoPb = '30px',
  icon = null,
  iconWidth = 12,
  iconPosition = 'right',
  iconClass = '',
  iconAlt = '',
  msoPx = 150,
  outlookFallback = true,
  className,
  style,
  children,
  ...rest
}: ButtonProps) {
  const alignClass = align ? ({ left: 'text-left', center: 'text-center', right: 'text-right' } as Record<string, string>)[align] || '' : ''

  const base = ['inline-block', 'text-center', 'no-underline', 'px-6', 'py-4', 'text-base', 'leading-none']
  if (variant === 'outline') base.push('rounded-lg', 'font-semibold', '[border:1px_solid_#d1d5db]', 'bg-white', 'text-gray-600')
  else if (variant === 'link') base.push('font-medium', 'bg-transparent', 'text-indigo-600')
  else base.push('rounded-lg', 'font-medium', 'bg-indigo-600', 'text-slate-50')

  const mergedClass = twMerge(base.join(' '), className)
  const textSpanStyle = outlookFallback ? ({ msoTextRaise: msoPt } as React.CSSProperties) : undefined
  const msoPxValue = /^\d+(\.\d+)?$/.test(String(msoPx).trim()) ? `${String(msoPx).trim()}%` : String(msoPx).trim()
  const parsedIconWidth = Number.parseInt(String(iconWidth), 10)

  const spacerLeft = `<!--[if mso]><i style="mso-font-width: ${msoPxValue}; mso-text-raise: ${msoPb};" hidden>&emsp;</i><![endif]-->`
  const spacerRight = `<!--[if mso]><i style="mso-font-width: ${msoPxValue};" hidden>&emsp;&#8203;</i><![endif]-->`
  const iconGap = '<!--[if mso]><i style="mso-font-width: 30%;" hidden>&emsp;&#8203;</i><![endif]-->'

  const iconEl = icon ? (
    <span style={textSpanStyle}>
      <img src={asset(icon)} width={parsedIconWidth} alt={iconAlt} className={twMerge('max-w-full align-baseline', iconClass)} />
    </span>
  ) : null

  // Maizzle's output keeps whitespace between these inline parts; mirror it
  // so text and icon don't touch.
  const parts: React.ReactNode[] = []
  if (outlookFallback) parts.push(<span key="sl" dangerouslySetInnerHTML={{ __html: spacerLeft }} />)
  if (icon && iconPosition === 'left') {
    parts.push(<React.Fragment key="il">{iconEl}</React.Fragment>)
    if (outlookFallback) parts.push(<span key="gl" dangerouslySetInnerHTML={{ __html: iconGap }} />)
  }
  parts.push(<span key="t" style={textSpanStyle}>{children}</span>)
  if (icon && iconPosition === 'right') {
    if (outlookFallback) parts.push(<span key="gr" dangerouslySetInnerHTML={{ __html: iconGap }} />)
    parts.push(<React.Fragment key="ir">{iconEl}</React.Fragment>)
  }
  if (outlookFallback) parts.push(<span key="sr" dangerouslySetInnerHTML={{ __html: spacerRight }} />)

  return (
    <div className={alignClass || undefined}>
      <a {...rest} href={href} style={style} className={mergedClass}>
        {parts.map((part, i) => (
          <React.Fragment key={i}>
            {i > 0 && ' '}
            {part}
          </React.Fragment>
        ))}
      </a>
    </div>
  )
}
