const basePath = import.meta.env.BASE_URL

export function sitePath(path = '') {
  return `${basePath}${path.replace(/^\/+/, '')}`
}

export function currentRoutePath() {
  const pathname = window.location.pathname
  if (pathname.startsWith(basePath)) {
    return `/${pathname.slice(basePath.length)}`.replace(/\/+$/, '') || '/'
  }
  return pathname.replace(/\/+$/, '') || '/'
}

export function sectionHref(id: string) {
  return `${currentRoutePath() === '/' ? '' : sitePath()}#${id}`
}
