import plugin from 'tailwindcss/plugin'
import { theme } from './theme'

/**
 * Mailviews Tailwind setup for react-email's <Tailwind> component.
 *
 *   <Tailwind config={mailviewsConfig} theme={mailviewsTheme}>
 *
 * `theme` carries the @maizzle/tailwindcss design tokens (px spacing and
 * font sizes, hex palette, custom radii). Everything that can't live in a
 * CSS `@theme` block under react-email (variants, mso-* utilities, email
 * overrides) is registered here through the plugin API.
 */

export const mailviewsTheme = theme

/** px value map mirroring the Maizzle spacing scale (--spacing: 4px). */
const px: Record<string, string> = { px: '1px', 0: '0px' }
for (const n of [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 6.5, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96]) {
  px[String(n)] = `${n * 4}px`
}

const spacingUtilities = [
  'mso-text-raise',
  'mso-line-height-alt',
  'mso-padding-alt',
  'mso-padding-top-alt',
  'mso-padding-right-alt',
  'mso-padding-bottom-alt',
  'mso-padding-left-alt',
  'mso-margin-alt',
  'mso-margin-top-alt',
  'mso-margin-right-alt',
  'mso-margin-bottom-alt',
  'mso-margin-left-alt',
  'mso-para-margin',
  'mso-para-margin-top',
  'mso-para-margin-right',
  'mso-para-margin-bottom',
  'mso-para-margin-left',
  'mso-text-indent-alt',
  'mso-table-tspace',
  'mso-table-rspace',
  'mso-table-bspace',
  'mso-table-lspace',
  'mso-font-width',
  'mso-ansi-font-size',
  'mso-bidi-font-size',
  'mso-element-frame-width',
  'mso-element-frame-height',
  'mso-border-width-alt',
  'mso-border-top-width-alt',
  'mso-border-right-width-alt',
  'mso-border-bottom-width-alt',
  'mso-border-left-width-alt',
]

const keywordUtilities: Record<string, string[]> = {
  'mso-hide': ['all', 'none', 'screen'],
  'mso-line-height-rule': ['exactly', 'at-least'],
  'mso-element': ['frame', 'paragraph-mark-properties', 'table-head', 'none'],
  'mso-element-wrap': ['none', 'auto', 'around', 'no-wrap-beside'],
  'mso-border-shadow': ['yes', 'no'],
  'mso-special-format': ['bullet'],
  'mso-text-raise': ['auto'],
}

const colorUtilities = [
  'mso-shading',
  'mso-color-alt',
  'mso-highlight',
  'mso-border-alt',
  'mso-border-between',
  'mso-border-top-alt',
  'mso-border-right-alt',
  'mso-border-bottom-alt',
  'mso-border-left-alt',
  'mso-shadow-color',
  'text-underline-color',
]

function flattenColors(colors: Record<string, unknown>, prefix = ''): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [key, value] of Object.entries(colors ?? {})) {
    const name = key === 'DEFAULT' ? prefix.slice(0, -1) : `${prefix}${key}`
    if (typeof value === 'string') out[name] = value
    else if (value && typeof value === 'object') Object.assign(out, flattenColors(value as Record<string, unknown>, `${name}-`))
  }
  return out
}

export const mailviewsConfig = {
  plugins: [
    plugin(({ addVariant, addUtilities, matchUtilities, theme }) => {
      // Desktop-first breakpoints (max-width), as in @maizzle/tailwindcss.
      // Registered largest → smallest so the narrower query is emitted last
      // and wins when both match (xs:block must beat sm:flex at 375px).
      addVariant('2xl', '@media (max-width: 1536px)')
      addVariant('xl', '@media (max-width: 1280px)')
      addVariant('lg', '@media (max-width: 1024px)')
      addVariant('md', '@media (max-width: 768px)')
      addVariant('sm', '@media (max-width: 600px)')
      addVariant('xs', '@media (max-width: 430px)')

      // Plain :hover instead of @media (hover: hover) nesting.
      addVariant('hover', '&:hover')

      // Email client targeting variants.
      addVariant('gmail', 'u + .body &')
      addVariant('gmail-android', 'div > u + .body &')
      addVariant('apple-mail', '[class^="apple-mail"] &')
      addVariant('outlook-mac', '#converted-body &')
      addVariant('outlook-android', '#converted-body &')
      addVariant('yahoo', '.\\& &')
      addVariant('thunderbird', '.moz-text-html &')
      addVariant('superhuman', '.ShadowHTML &')
      addVariant('notion', '#mail-content-wrapper &')
      addVariant('spark', '.c17637 &')
      addVariant('ogsc', '[data-ogsc] &')
      addVariant('ogsb', '[data-ogsb] &')

      // Outlook on Windows ignores text-decoration-line; emit the shorthand.
      addUtilities({
        '.underline': { 'text-decoration': 'underline' },
        '.overline': { 'text-decoration': 'overline' },
        '.line-through': { 'text-decoration': 'line-through' },
        '.no-underline': { 'text-decoration': 'none' },
      })

      // Core shadow utilities leave var(--tw-shadow-color) behind; pin them.
      addUtilities({
        '.shadow-2xs': { 'box-shadow': '0 1px rgba(0, 0, 0, 0.05)' },
        '.shadow-xs': { 'box-shadow': '0 1px 2px 0 rgba(0, 0, 0, 0.05)' },
        '.shadow-sm': { 'box-shadow': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)' },
        '.shadow': { 'box-shadow': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)' },
        '.shadow-md': { 'box-shadow': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)' },
        '.shadow-lg': { 'box-shadow': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)' },
        '.shadow-xl': { 'box-shadow': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' },
        '.shadow-2xl': { 'box-shadow': '0 25px 50px -12px rgba(0, 0, 0, 0.25)' },
        '.shadow-none': { 'box-shadow': '0 0 #0000' },
      })

      addUtilities({
        '.mso-fit-shape-to-text': { 'mso-fit-shape-to-text': 'true' },
        '.mso-width-percent': { 'mso-width-percent': '1000' },
      })

      for (const name of spacingUtilities) {
        matchUtilities(
          { [name]: (value: string) => ({ [name]: value }) },
          { values: px, supportsNegativeValues: true },
        )
      }

      for (const [name, values] of Object.entries(keywordUtilities)) {
        matchUtilities(
          { [name]: (value: string) => ({ [name]: value }) },
          { values: Object.fromEntries(values.map(v => [v, v])) },
        )
      }

      const colors = {
        ...flattenColors(theme('colors') as Record<string, unknown>),
        auto: 'auto',
        windowtext: 'windowtext',
        transparent: 'transparent',
      }
      for (const name of colorUtilities) {
        matchUtilities(
          { [name]: (value: string) => ({ [name]: value }) },
          { values: colors, type: 'color' },
        )
      }
    }),
  ],
}
