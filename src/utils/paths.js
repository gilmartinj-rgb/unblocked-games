/**
 * Utility to resolve asset, JSON, and iframe URLs across development,
 * custom domains, and GitHub Pages subpaths (e.g. https://user.github.io/repo/).
 */
export const resolveUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }

  const base = import.meta.env.BASE_URL || './';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = path.startsWith('/')
    ? path.slice(1)
    : path.startsWith('./')
    ? path.slice(2)
    : path;

  return `${cleanBase}${cleanPath}`;
};

export const resolveIframeSrc = (iframeString) => {
  if (!iframeString) return resolveUrl('games/snake.html');

  const match = iframeString.match(/src=["'](.*?)["']/);
  const rawSrc = match && match[1] ? match[1] : iframeString;

  if (rawSrc.startsWith('http://') || rawSrc.startsWith('https://')) {
    return rawSrc;
  }

  return resolveUrl(rawSrc);
};
