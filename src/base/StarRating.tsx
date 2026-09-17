import * as React from 'react'
import { asset } from '../lib/asset'

export interface StarRatingProps extends React.TableHTMLAttributes<HTMLTableElement> {
  rating?: number | string | false
  /** Text (HTML allowed) shown after the stars, e.g. "(18 reviews)". */
  reviewsText?: string | false
  starWidth?: number | string
}

export function StarRating({ rating = 4, reviewsText = '', starWidth = 16, ...rest }: StarRatingProps) {
  const value = rating === false ? false : Math.min(Math.max(Number(rating ?? 4), 0), 5)
  const full = value !== false ? Math.floor(value) : 0
  const half = value !== false ? value % 1 >= 0.5 : false
  const empty = value !== false ? 5 - full - (half ? 1 : 0) : 0

  return (
    <table cellPadding="0" cellSpacing="0" role="none" {...rest}>
      <tr>
        {Array.from({ length: full }, (_, n) => (
          <td key={`f${n}`} className="pr-1">
            <img src={asset('icon-star-solid.png')} width={starWidth} className="max-w-full align-middle block" alt="" />
          </td>
        ))}
        {half && (
          <td className="pr-1">
            <img src={asset('icon-star-half.png')} width={starWidth} className="max-w-full align-middle block" alt="" />
          </td>
        )}
        {Array.from({ length: empty }, (_, n) => (
          <td key={`e${n}`} className="pr-1">
            <img src={asset('icon-star-outline.png')} width={starWidth} className="max-w-full align-middle block" alt="" />
          </td>
        ))}
        {reviewsText && (
          <td className="pl-1 text-0">
            <span className="inline-block text-xs/4 text-gray-600" dangerouslySetInnerHTML={{ __html: reviewsText }} />
          </td>
        )}
      </tr>
    </table>
  )
}
