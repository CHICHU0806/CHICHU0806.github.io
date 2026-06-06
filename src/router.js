import { MainLayout } from './layouts/MainLayout.js'

import { Home } from './pages/Home.js'
import { Posts } from './pages/Posts.js'
import { PostDetail } from './pages/PostDetail.js'
import { Projects } from './pages/Projects.js'
import { ProjectDetail } from './pages/ProjectDetail.js'
import { About } from './pages/About.js'
import { NotFound } from './pages/NotFound.js'

function normalizePath(hash) {
    const path = hash.replace(/^#/, '') || '/'

    if (path.length > 1 && path.endsWith('/')) {
        return path.slice(0, -1)
    }

    return path
}

function bindMenuEvents() {
    const menuButton = document.querySelector('[data-menu-button]')
    const nav = document.querySelector('[data-nav]')

    if (!menuButton || !nav) return

    menuButton.addEventListener('click', () => {
        nav.classList.toggle('is-open')
    })

    nav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            nav.classList.remove('is-open')
        })
    })
}

export function renderApp() {
    const app = document.querySelector('#app')
    const path = normalizePath(window.location.hash || '#/')

    let page

    if (path === '/') {
        page = Home()
    } else if (path === '/posts') {
        page = Posts()
    } else if (path.startsWith('/posts/')) {
        const id = decodeURIComponent(path.replace('/posts/', ''))
        page = PostDetail(id)
    } else if (path === '/projects') {
        page = Projects()
    } else if (path.startsWith('/projects/')) {
        const id = decodeURIComponent(path.replace('/projects/', ''))
        page = ProjectDetail(id)
    } else if (path === '/about') {
        page = About()
    } else {
        page = NotFound()
    }

    app.innerHTML = MainLayout(page, path)
    bindMenuEvents()
    window.scrollTo(0, 0)
}