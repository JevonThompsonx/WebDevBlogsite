export interface ResolveSafeImageSourceOptions {
  allowInsecureLocalhost?: boolean;
}

function parseUrl(value: string): URL | null {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

function isLocalhost(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
}

export function isRelativePath(value: string): boolean {
  return (
    value.startsWith("/") ||
    value.startsWith("./") ||
    value.startsWith("../") ||
    value.startsWith("#") ||
    value.startsWith("?")
  );
}

export function isSafeLinkHref(href: string): boolean {
  const normalizedHref = href.trim();

  if (normalizedHref.length === 0) {
    return false;
  }

  if (isRelativePath(normalizedHref)) {
    return true;
  }

  const parsed = parseUrl(normalizedHref);

  if (!parsed) {
    return false;
  }

  return ["http:", "https:", "mailto:"].includes(parsed.protocol);
}

export function isExternalHttpLink(href: string): boolean {
  const parsed = parseUrl(href.trim());

  if (!parsed) {
    return false;
  }

  return ["http:", "https:"].includes(parsed.protocol);
}

export function resolveSafeImageSource(
  src: string,
  options: ResolveSafeImageSourceOptions = {},
): string | null {
  const normalizedSrc = src.trim();

  if (normalizedSrc.length === 0) {
    return null;
  }

  if (isRelativePath(normalizedSrc)) {
    return normalizedSrc;
  }

  const parsed = parseUrl(normalizedSrc);

  if (!parsed) {
    return null;
  }

  if (parsed.protocol === "https:") {
    return normalizedSrc;
  }

  if (
    options.allowInsecureLocalhost &&
    parsed.protocol === "http:" &&
    isLocalhost(parsed.hostname)
  ) {
    return normalizedSrc;
  }

  return null;
}
