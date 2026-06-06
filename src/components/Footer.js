import { site } from '../data/site.js'

export function Footer() {
    const linksHtml = site.links
        .map((link) => {
            return `
        <a href="${link.href}" target="_blank" rel="noreferrer">
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