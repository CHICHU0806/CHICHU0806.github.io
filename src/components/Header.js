import { site } from '../data/site.js'
import { navItems } from '../data/nav.js'

function isActive(path, itemPath) {
    if (itemPath === '/') {
        return path === '/'
    }

    return path === itemPath || path.startsWith(`${itemPath}/`)
}

export function Header(path) {
    const navHtml = navItems
        .map((item) => {
            const activeClass = isActive(path, item.path) ? 'is-active' : ''

            return `
        <a class="${activeClass}" href="#${item.path}">
          ${item.label}
        </a>
      `
        })
        .join('')

    return `
    <header class="site-header">
      <div class="container header-inner">
        <a class="logo" href="#/">
          <span class="logo-mark">Y</span>
          <span>${site.name}</span>
        </a>

        <nav class="nav" data-nav>
          ${navHtml}
        </nav>

        <button class="menu-button" data-menu-button aria-label="打开导航菜单">
          ☰
        </button>
      </div>
    </header>
  `
}