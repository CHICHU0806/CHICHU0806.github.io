import { getProjectById } from '../data/projects.js'

export function ProjectDetail(id) {
    const project = getProjectById(id)

    if (!project) {
        return `
      <section class="empty-state">
        <p>没有找到这个项目。</p>
        <p><a href="#/projects">返回项目列表</a></p>
      </section>
    `
    }

    const tagsHtml = project.tags
        .map((tag) => `<span>${tag}</span>`)
        .join('')

    return `
    <article class="article">
      <header class="article-header">
        <a class="back-link" href="#/projects">← 返回项目列表</a>

        <div class="card-meta">
          <span>${project.date}</span>
          <span>${project.category}</span>
        </div>

        <h1>${project.title}</h1>

        <div class="tags">
          ${tagsHtml}
        </div>
      </header>

      <div class="article-body">
        ${project.detail}
      </div>
    </article>
  `
}