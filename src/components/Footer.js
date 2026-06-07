import { site } from '../data/site.js'

export function Footer() {
    const linksHtml = site.links
        .map((link) => {
            const isExternal = link.href.startsWith('http')
            const target = isExternal ? 'target="_blank" rel="noreferrer"' : ''

            return `
        <a href="${link.href}" ${target}>
          ${link.label}
        </a>
      `
        })
        .join('')

    return `
    <footer class="site-footer">
      <div class="container footer-inner">
        <p>© ${site.year} ${site.author}. All rights reserved.</p>

        <div class="footer-links">
          ${linksHtml}
        </div>
      </div>
    </footer>
  `
}