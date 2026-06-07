/**
 * SEO utilities for Candid Canvas
 * Centralised constants so every page uses the same base URL, brand name, and OG image.
 */

export const SITE_URL = 'https://candid-canvas.netlify.app';
/** Primary brand shown in Google site name, og:site_name, and titles */
export const SITE_NAME = 'Candid Canvas';
/** Full legal / local business name */
export const SITE_NAME_FULL = 'Candid Canvas BD';
export const SITE_TAGLINE = 'Preserving Special Moments';
export const OG_IMAGE = `${SITE_URL}/logo.png`;
export const FAVICON_URL = `${SITE_URL}/favicon-48x48.png`;
export const OG_IMAGE_WIDTH = '1200';
export const OG_IMAGE_HEIGHT = '630';

export const BRAND_KEYWORDS =
  'Candid Canvas, candid canvas, Candid Canvas BD, candid canvas bangladesh, candid canvas photography, candid canvas bogura';

/** Build a canonical URL for a given pathname (e.g. '/gallery') */
export function canonical(path: string = '/'): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Default page meta for fallback */
export const DEFAULT_META = {
  title: `${SITE_NAME} | Premium Photography & Cinematography in Bangladesh`,
  description:
    'Candid Canvas — official website for premium wedding photography, cinematography, reels and event coverage in Bogura, Bangladesh. 500+ projects. 98% client satisfaction.',
  keywords: `${BRAND_KEYWORDS}, wedding photography bangladesh, wedding photographer bogura, cinematography bangladesh, event photography, reels production`,
};
