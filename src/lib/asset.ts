const DEFAULT_ASSET_BASE = 'https://assets.mailviews.com/images/components/'

let assetBase = DEFAULT_ASSET_BASE

/**
 * Set where component images are loaded from. Call once, before rendering:
 *
 *   setAssetBase('https://cdn.example.com/emails/')
 */
export function setAssetBase(url: string): void {
  assetBase = url.endsWith('/') ? url : `${url}/`
}

export function getAssetBase(): string {
  return assetBase
}

/** Resolve a component image path against the configured asset base. */
export function asset(path: string | null | undefined): string | undefined {
  if (path == null || path === '') return undefined
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path
  return `${assetBase}${path.replace(/^\/+/, '')}`
}
