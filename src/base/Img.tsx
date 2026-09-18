import * as React from 'react'
import { twMerge } from 'tailwind-merge'
import { asset } from '../lib/asset'

export interface ImgProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'width' | 'alt'> {
  /** Image path, resolved through `asset()` unless already absolute. */
  src: string
  alt?: string
  /** Width in pixels, rendered without units. */
  width?: string | number
  /** Wraps the image in a link. */
  href?: string
}

/**
 * Maizzle `<Img>` (plain mode): `max-w-full align-middle` unless
 * overridden, `alt=""` by default, optional `<a>` wrapper.
 */
export function Img({ src, alt = '', width, href, className, ...rest }: ImgProps) {
  const parsed = Number.parseInt(String(width), 10)
  const img = <img {...rest} src={asset(src)} alt={alt} width={Number.isFinite(parsed) ? parsed : undefined} className={twMerge('max-w-full align-middle', className)} />
  return href ? (
    <a href={href} className="no-underline">
      {img}
    </a>
  ) : (
    img
  )
}
