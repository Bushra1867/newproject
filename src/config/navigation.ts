export function sectionHref(id: string) {
  const isHomePage = window.location.pathname.replace(/\/+$/, '') === ''
  return `${isHomePage ? '' : '/'}#${id}`
}
