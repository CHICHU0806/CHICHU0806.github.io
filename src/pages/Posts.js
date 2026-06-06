import { posts } from '../data/posts.js'
import { PostCard } from '../components/PostCard.js'

export function Posts() {
    const postsHtml = posts
        .map(PostCard)
        .join('')

    return `
    <section class="page-title">
      <p class="eyebrow">Posts</p>
      <h1>文章</h1>
      <p>这里集中展示你的技术文章、学习笔记和长期记录。</p>
    </section>

    <section class="grid grid-three">
      ${
        posts.length
            ? postsHtml
            : `<div class="empty-state">暂无文章。</div>`
    }
    </section>
  `
}