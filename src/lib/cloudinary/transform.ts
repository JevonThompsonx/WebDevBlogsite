/**
 * Applies Cloudinary automatic format + quality transformations to a stored URL.
 *
 * f_auto → delivers WebP/AVIF based on the browser's Accept header
 * q_auto → lets Cloudinary pick the optimal quality level for the image
 *
 * Safe to call on non-Cloudinary URLs or URLs that already have transformations —
 * those are returned unchanged.
 */
const FORMAT_QUALITY_CHAIN = "f_auto,q_auto";

/**
 * Cover images: detail page Image has intrinsic width 1280 and renders
 * ~790-870px wide inside site-container (max 80rem) with lg sidebar;
 * cards render 389-556px per grid (100vw / 50vw / 33vw via sizes).
 * Bound delivery to 1280 (matches detail intrinsic width, ~1.6× DPR for
 * ~790px slot and ~2.3× for 556px card) so oversized originals aren't
 * served at full resolution. c_limit only shrinks and never upscales;
 * the durable Cloudinary asset remains untouched.
 */
export const COVER_IMAGE_MAX_WIDTH = 1280;
const COVER_IMAGE_CHAIN = `f_auto,q_auto,w_${COVER_IMAGE_MAX_WIDTH},c_limit`;

function getUploadSegment(url: string): string | null {
  try {
    const { pathname } = new URL(url);
    const marker = "/upload/";
    const idx = pathname.indexOf(marker);
    if (idx === -1) return null;
    const after = pathname.slice(idx + marker.length);
    const segment = after.split("/")[0] ?? "";
    return segment;
  } catch {
    const m = url.match(/\/upload\/([^/?#]+)/);
    return m ? m[1] : null;
  }
}

export function cdnImageUrl(url: string | null): string | null {
  if (!url) return null;
  if (!url.includes("res.cloudinary.com")) return url;
  // Already transformed — don't double-apply (precise segment check)
  const segment = getUploadSegment(url);
  if (segment && (segment.includes("f_auto") || segment.includes("q_auto")))
    return url;
  return url.replace("/upload/", `/upload/${FORMAT_QUALITY_CHAIN}/`);
}

/**
 * Width-bounded delivery variant for cover images: automatic format +
 * quality optimization plus w_1280,c_limit so an oversized camera original
 * is not served at full resolution. Bounding happens at delivery time via
 * URL parameters only — the durable source asset is not resized. Verified
 * against actual rendered widths (detail ~792px effective, card 389-556px)
 * rather than an arbitrary value.
 */
export function coverImageUrl(url: string | null): string | null {
  if (!url) return null;
  if (!url.includes("res.cloudinary.com")) return url;
  const segment = getUploadSegment(url);
  // Already bounded — don't double-apply (precise segment check)
  if (segment && segment.includes("c_limit")) return url;
  // Format/quality-only chain present — upgrade it in place with the bound
  if (segment === FORMAT_QUALITY_CHAIN) {
    return url.replace(
      `/upload/${FORMAT_QUALITY_CHAIN}/`,
      `/upload/${COVER_IMAGE_CHAIN}/`,
    );
  }
  return url.replace("/upload/", `/upload/${COVER_IMAGE_CHAIN}/`);
}

export function isCloudinaryUrl(url: string | null): boolean {
  if (!url) return false;
  try {
    return new URL(url).hostname.toLowerCase() === "res.cloudinary.com";
  } catch {
    return false;
  }
}
