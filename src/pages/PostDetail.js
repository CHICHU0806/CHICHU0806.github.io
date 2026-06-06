import { getPostById } from '../data/posts.js'
import { renderMarkdown } from '../utils/markdown.js'

const postModules = import.meta.glob('../posts/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
})

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

    const content = markdownText
        ? renderMarkdown(markdownText)
        : '<p>文章内容不存在。</p>'

    const tagsHtml = post.tags
        .map((tag) => `<span>${tag}</span>`)
        .join('')

    return `
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
        ${content}
      </div>
    </article>
  `
}