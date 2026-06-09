import { getPostById } from '../data/posts.js'
import { renderMarkdownWithToc } from '../utils/markdown.js'

const postModules = import.meta.glob('../posts/**/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
})

function escapeHtml(text = '') {
    return text
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;')
}

function renderToc(toc) {
    const visibleToc = toc.filter((item) => item.level >= 1 && item.level <= 4)

    if (!visibleToc.length) {
        return `
      <div class="toc-empty">
        本文暂无目录
      </div>
    `
    }

    return visibleToc
        .map((item) => {
            return `
        <button
          class="toc-link toc-level-${item.level}"
          type="button"
          data-toc-target="${escapeHtml(item.id)}"
        >
          ${escapeHtml(item.title)}
        </button>
      `
        })
        .join('')
}

export function PostDetail(id) {
    const post = getPostById(id)

    if (!post) {
        return `
      <section class="empty-state">
        <p>没有找到这篇文章。</p>
        <p><a href="#/posts">返回文章列表</a></p>
      </section>
    `
    }

    const modulePath = `../posts/${post.file}.md`
    const markdownText = postModules[modulePath]

    const result = markdownText
        ? renderMarkdownWithToc(markdownText)
        : {
            html: '<p>文章内容不存在。</p>',
            toc: [],
        }

    const tagsHtml = post.tags
        .map((tag) => `<span>${tag}</span>`)
        .join('')

    return `
    <div class="article-layout">
      <aside class="article-toc">
        <div class="toc-title">目录</div>
        <nav class="toc-nav">
          ${renderToc(result.toc)}
        </nav>
      </aside>

      <article class="article">
        <header class="article-header">
          <a class="back-link" href="#/posts">← 返回文章列表</a>

          <div class="card-meta">
            <span>${post.date}</span>
            <span>${post.category}</span>
          </div>

          <h1>${post.title}</h1>

          <div class="tags">
            ${tagsHtml}
          </div>
        </header>

        <div class="article-body markdown-body">
          ${result.html}
        </div>
      </article>
    </div>
  `
}