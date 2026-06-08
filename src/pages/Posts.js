import {
    getFeaturedPosts,
    getLatestPosts,
    getPostsByIds,
} from '../data/posts.js'

import { postGroups } from '../data/postGroups.js'
import { PostCard } from '../components/PostCard.js'

function renderPostList(posts, emptyText = '暂无文章。') {
    if (!posts.length) {
        return `<div class="empty-state">${emptyText}</div>`
    }

    return `
    <div class="grid grid-three">
      ${posts.map(PostCard).join('')}
    </div>
  `
}

function renderLatestPosts() {
    const latestPosts = getLatestPosts()

    return `
    <details class="post-archive-panel">
      <summary class="post-archive-summary">
        <span>
          <strong>最近文章</strong>
          <em>按照发布时间倒序排列，点击展开查看全部文章。</em>
        </span>

        <span class="summary-mark">展开</span>
      </summary>

      <div class="post-archive-content">
        ${renderPostList(latestPosts, '暂无最近文章。')}
      </div>
    </details>
  `
}

function renderPostGroups() {
    if (!postGroups.length) {
        return `<div class="empty-state">暂无文章合集。</div>`
    }

    return postGroups
        .map((group) => {
            const groupPosts = getPostsByIds(group.posts)

            return `
        <details class="post-archive-panel" ${group.open ? 'open' : ''}>
          <summary class="post-archive-summary">
            <span>
              <strong>${group.title}</strong>
              <em>${group.description}</em>
            </span>

            <span class="summary-mark">展开</span>
          </summary>

          <div class="post-archive-content">
            ${renderPostList(groupPosts, '这个合集暂无文章。')}
          </div>
        </details>
      `
        })
        .join('')
}

export function Posts() {
    const featuredPosts = getFeaturedPosts()

    return `
    <section class="page-title">
      <p class="eyebrow">Posts</p>
      <h1>文章</h1>
      <p>潦草写就，有错请纠</p>
    </section>

    <section class="section section-first">
      <div class="section-title">
        <div>
          <p>Featured</p>
          <h2>精选文章</h2>
        </div>

        <div class="section-desc">
          这里展示你希望优先推荐给读者的文章。
        </div>
      </div>

      ${renderPostList(featuredPosts, '暂无精选文章。')}
    </section>

    <section class="section">
      <div class="section-title">
        <div>
          <p>Latest</p>
          <h2>最近文章</h2>
        </div>

        <div class="section-desc">
          点击展开后，可以按照发布时间倒序查看全部文章。
        </div>
      </div>

      ${renderLatestPosts()}
    </section>

    <section class="section">
      <div class="section-title">
        <div>
          <p>Collections</p>
          <h2>文章合集</h2>
        </div>

        <div class="section-desc">
          按主题整理文章，合集顺序和合集内部文章顺序都可以自定义。
        </div>
      </div>

      <div class="post-groups">
        ${renderPostGroups()}
      </div>
    </section>
  `
}