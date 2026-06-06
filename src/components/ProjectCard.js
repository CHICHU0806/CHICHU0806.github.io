export function ProjectCard(project) {
    const tagsHtml = project.tags
        .map((tag) => `<span>${tag}</span>`)
        .join('')

    return `
    <article class="card">
      <a href="#/projects/${project.id}">
        <div class="card-meta">
          <span>${project.date}</span>
          <span>${project.category}</span>
        </div>

        <h3>${project.title}</h3>
        <p>${project.summary}</p>

        <div class="tags">
          ${tagsHtml}
        </div>
      </a>
    </article>
  `
}