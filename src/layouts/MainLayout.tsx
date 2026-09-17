import * as React from 'react'
import { Body, Head, Html, Tailwind } from 'react-email'
import { mailviewsConfig, mailviewsTheme } from '../lib/tailwind'

export interface MainLayoutProps {
  children?: React.ReactNode
  title?: string
  bodyClass?: string
  lang?: string
}

const MSO_HEAD =
  '<!--[if mso]>' +
  '<xml><o:OfficeDocumentSettings xmlns:o="urn:schemas-microsoft-com:office:office"><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>' +
  '<style>td,th,div,p,a,h1,h2,h3,h4,h5,h6 {font-family: "Segoe UI", sans-serif; mso-line-height-rule: exactly;}</style>' +
  '<![endif]-->'

/** Full email document: Tailwind setup, Inter web font, Outlook head fixes. */
export function MainLayout({ children, title = '', bodyClass = 'bg-slate-100', lang = 'en' }: MainLayoutProps) {
  return (
    <Html lang={lang}>
      <Tailwind config={mailviewsConfig} theme={mailviewsTheme}>
        <Head>
          <meta name="format-detection" content="telephone=no, date=no, address=no, email=no" />
          {title && <title>{title}</title>}
          <noscript dangerouslySetInnerHTML={{ __html: MSO_HEAD }} />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;300;400;500;600;700&display=swap" rel="stylesheet" />
        </Head>
        <Body className={`font-inter ${bodyClass}`}>{children}</Body>
      </Tailwind>
    </Html>
  )
}
