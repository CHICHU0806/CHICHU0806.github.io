import { site } from '../data/site.js'
import { posts } from '../data/posts.js'
import { projects } from '../data/projects.js'

import { SectionTitle } from '../components/SectionTitle.js'
import { PostCard } from '../components/PostCard.js'
import { ProjectCard } from '../components/ProjectCard.js'

export function Home() {
    const featuredPosts = posts
        .filter((post) => post.featured)
        .slice(0, 3)

    const featuredProjects = projects
        .filter((project) => project.featured)
        .slice(0, 2)

    return `
    <section class="hero">
      <div>
        <p class="eyebrow">${site.subtitle}</p>
        <h1>这里写你的主页标题</h1>
        <p class="hero-text">
          ${site.description}
        </p>

        <div class="hero-actions">
          <a class="button button-primary" href="#/posts">阅读文章</a>
          <a class="button button-secondary" href="#/projects">查看项目</a>
        </div>
      </div>

      <aside class="hero-panel">
        <div class="panel-line">
          <span>Current Focus</span>
          <strong>这里写当前方向</strong>
        </div>

        <div class="panel-line">
          <span>Writing</span>
          <strong>技术文章 / 学习笔记</strong>
        </div>

        <div class="panel-line">
          <span>Projects</span>
          <strong>项目实践 / 作品展示</strong>
        </div>
      </aside>
    </section>

    <section class="section">
      ${SectionTitle({
        eyebrow: 'Latest Posts',
        title: '最近文章',
        description: '这里展示最新发布的文章。'
    })}

      <div class="grid grid-three">
        ${
        featuredPosts.length
            ? featuredPosts.map(PostCard).join('')
            : `<div class="empty-state">暂无文章。</div>`
    }
      </div>
    </section>

    <section class="section">
      ${SectionTitle({
        eyebrow: 'Featured Projects',
        title: '精选项目',
        description: '这里展示你希望重点呈现的项目。'
    })}

      <div class="grid">
        ${
        featuredProjects.length
            ? featuredProjects.map(ProjectCard).join('')
            : `<div class="empty-state">暂无项目。</div>`
    }
      </div>
    </section>
  `
}