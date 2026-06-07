/**
 * SEO utilities for Candid Canvas BD
 * Centralised constants so every page uses the same base URL and OG image.
 */

export const SITE_URL = 'https://candid-canvas.netlify.app';
export const SITE_NAME = 'Candid Canvas BD';
export const SITE_TAGLINE = 'Preserving Special Moments';
export const OG_IMAGE = `${SITE_URL}/logo.png`;
export const OG_IMAGE_WIDTH = '1200';
export const OG_IMAGE_HEIGHT = '630';

/** Build a canonical URL for a given pathname (e.g. '/gallery') */
export function canonical(path: string = '/'): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Default page meta for fallback */
export const DEFAULT_META = {
  title: `${SITE_NAME} | Premium Photography & Cinematography in Bangladesh`,
  description:
    'Candid Canvas BD offers premium wedding photography, cinematography, reels and event coverage in Bogura, Bangladesh. 500+ projects. 98% client satisfaction.',
  keywords:
    'wedding photography bangladesh, wedding photographer dhaka, cinematography bangladesh, event photography, reels production, candid photography',
};
