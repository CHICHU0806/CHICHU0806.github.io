
import { projects } from '../data/projects.js'
import { ProjectCard } from '../components/ProjectCard.js'

export function Projects() {
    const projectsHtml = projects
        .map(ProjectCard)
        .join('')

    return `
    <section class="page-title">
      <p class="eyebrow">Projects</p>
      <h1>项目</h1>
      <p>展示一些我觉得还不错的项目，欢迎交流和讨论。</p>
    </section>

    <section class="grid">
      ${
        projects.length
            ? projectsHtml
            : `<div class="empty-state">暂无项目。</div>`
    }
    </section>
  `
}