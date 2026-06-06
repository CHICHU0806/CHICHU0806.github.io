
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
      <p>这里展示你的项目实践、作品记录和阶段性成果。</p>
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