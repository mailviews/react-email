# @mailviews/react-email

Base components, Tailwind setup and layout for the [Mailviews](https://mailviews.com) React Email component library.

Every Mailviews component you download in React Email flavor imports from this package. It gives you the same building blocks, design tokens and Outlook helpers the components are built with, so they render identically to the Maizzle originals.

## Install

```sh
npm install @mailviews/react-email
```

Peer dependencies: `react` (18 or 19) and `react-email` (6.2+).

## Usage

Wrap your email in `MainLayout`. It sets up `<Html>`, `<Head>`, `<Body>` and react-email's `<Tailwind>` with the Mailviews theme and plugin, links the Inter web font and adds the Outlook head fixes.

```tsx
import { MainLayout, Heading, Text, Button, Spacer } from '@mailviews/react-email'

export default function Welcome() {
  return (
    <MainLayout title="Welcome to Acme">
      <table className="w-[600px] max-w-full bg-white" cellPadding="0" cellSpacing="0" role="none">
        <tr>
          <td className="p-6">
            <Heading level={1} className="m-0 text-2xl/8 font-semibold text-gray-950">
              Welcome aboard
            </Heading>
            <Spacer className="h-4" />
            <Text className="m-0 text-base/6 text-gray-700">Thanks for signing up.</Text>
            <Spacer className="h-6" />
            <Button className="bg-indigo-600 hover:bg-indigo-700" href="https://example.com">
              Get started
            </Button>
          </td>
        </tr>
      </table>
    </MainLayout>
  )
}
```

Then render or preview it as you would any React Email template (`email dev`, `render()` from `react-email`, etc.).

### Using the Tailwind setup without `MainLayout`

If you have your own document wrapper, pass the config and theme to `<Tailwind>` yourself:

```tsx
import { Tailwind } from 'react-email'
import { mailviewsConfig, mailviewsTheme } from '@mailviews/react-email'

<Tailwind config={mailviewsConfig} theme={mailviewsTheme}>
  ...
</Tailwind>
```

`mailviewsTheme` carries the design tokens from [`@maizzle/tailwindcss`](https://github.com/maizzle/tailwindcss) (px-based spacing and font sizes, hex palette, custom radii). `mailviewsConfig` registers everything that cannot live in a CSS `@theme` block: desktop-first breakpoints (`sm:` is `max-width: 600px`), email client variants (`gmail:`, `apple-mail:`, `outlook-mac:`, `ogsc:`, …) and `mso-*` utilities.

## Components

| Component | What it does |
| --- | --- |
| `Button` | Bulletproof `<a>` button with optional icon and Outlook padding fallback (`msoPt`, `msoPb`, `msoPx`). |
| `Heading` | `<h1>`–`<h6>` picked by `level`. |
| `Text` | `<p>` by default, `<span>` via `as`. |
| `Spacer` | Vertical (`className="h-6"`) or horizontal (`type="horizontal" width={24}`) gap that Outlook respects. |
| `Divider` | Horizontal rule with `type`, `height`, `color`, `width`, `spaceX`, `spaceY`, `align`. |
| `Pill` | Inline badge with optional Outlook-only line break before it. |
| `StarRating` | Row of star images for a `rating`, with optional `reviewsText`. |
| `TimelineCheck` | Check-mark bullet used by timeline components. |
| `InlineGap` | Invisible inline spacer for gaps between inline elements. |
| `VFill` | VML background image container for Outlook, with `image`, `width`, `height`, `color`, `position`, … |
| `Outlook` | Wraps children (or `raw` HTML) in an `<!--[if mso]>` conditional. Target versions with `only`, `not`, `lt`, `lte`, `gt`, `gte`. |
| `NotOutlook` | Wraps children in `<!--[if !mso]><!-->` so Outlook on Windows skips them. |

React cannot emit bare HTML comments, so `Outlook`, `NotOutlook` and `VFill` render their markers on a wrapper element chosen with `as` (`div`, `span`, `td`, `tr` or `p`). Use `raw` on `Outlook` for VML or ghost-table markup that must not go through Tailwind:

```tsx
<Outlook as="span" raw={`<i hidden style="mso-font-width: 40%">&emsp;&#8203;</i>`} />
```

## Assets

Mailviews components reference images by path and resolve them through `asset()`. The default base is the Mailviews CDN; point it at your own host once, before rendering:

```ts
import { setAssetBase } from '@mailviews/react-email'

setAssetBase('https://cdn.example.com/emails/')
```

Absolute `http(s)://`, protocol-relative and `data:` URLs pass through untouched.

## Utilities

- `toStyle(css)` converts a `prop: value; prop: value` string to a React style object.
- `getAssetBase()` returns the current asset base URL.

## License

MIT
