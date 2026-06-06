export function PostCard(post) {
    const tagsHtml = post.tags
        .map((tag) => `<span>${tag}</span>`)
        .join('')

    return `
    <article class="card">
      <a href="#/posts/${post.id}">
        <div class="card-meta">
          <span>${post.date}</span>
          <span>${post.category}</span>
        </div>

        <h3>${post.title}</h3>
        <p>${post.summary}</p>

        <div class="tags">
          ${tagsHtml}
        </div>
      </a>
    </article>
  `
}