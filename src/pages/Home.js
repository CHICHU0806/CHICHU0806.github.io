import { site } from '../data/site.js'
import {getLatestPosts, posts} from '../data/posts.js'
import { projects } from '../data/projects.js'

import { SectionTitle } from '../components/SectionTitle.js'
import { PostCard } from '../components/PostCard.js'
import { ProjectCard } from '../components/ProjectCard.js'

export function Home() {

    const latestPosts = getLatestPosts().slice(0, 3)

    const featuredProjects = projects
        .filter((project) => project.featured)
        .slice(0, 2)

    return `
    <section class="hero">
      <div>
        <p class="eyebrow">${site.subtitle}</p>
        <h1>我觉得彳亍</h1>
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
          <strong>机器人运动控制</strong>
        </div>

        <div class="panel-line">
          <span>Writing</span>
          <strong>重庆大学千里战队电控教程</strong>
        </div>

        <div class="panel-line">
          <span>Projects</span>
          <strong>一些正在做或者未来打算做的东西</strong>
        </div>
      </aside>
    </section>

    <section class="section">
      ${SectionTitle({
        eyebrow: 'Latest Posts',
        title: '最近文章',
        description: '潦草写就，有错请纠。'
    })}

      <div class="grid grid-three">
        ${
        latestPosts.length
            ? latestPosts.map(PostCard).join('')
            : `<div class="empty-state">暂无文章。</div>`
        }
      </div>
    </section>

    <section class="section">
      ${SectionTitle({
        eyebrow: 'Featured Projects',
        title: '精选项目',
        description: '展示一些我觉得还不错的项目，欢迎交流和讨论。'
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