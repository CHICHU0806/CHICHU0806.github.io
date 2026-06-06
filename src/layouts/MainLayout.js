import { Header } from '../components/Header.js'
import { Footer } from '../components/Footer.js'

export function MainLayout(content, path) {
    return `
    <div class="page-shell">
      ${Header(path)}

      <main class="main">
        <div class="container">
          ${content}
        </div>
      </main>

      ${Footer()}
    </div>
  `
}