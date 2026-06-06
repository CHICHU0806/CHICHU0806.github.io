import MarkdownIt from 'markdown-it'
import markdownItKatex from '@vscode/markdown-it-katex'

import 'katex/dist/katex.min.css'

const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    breaks: false,
})

const katexPlugin = markdownItKatex.default ?? markdownItKatex

md.use(katexPlugin, {
    throwOnError: false,
    strict: 'ignore',
})

function slugify(text) {
    return text
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\p{L}\p{N}\-_]+/gu, '')
        || 'section'
}

function createUniqueSlug(text, slugMap) {
    const baseSlug = slugify(text)
    const count = slugMap.get(baseSlug) || 0

    slugMap.set(baseSlug, count + 1)

    if (count === 0) {
        return baseSlug
    }

    return `${baseSlug}-${count + 1}`
}

md.renderer.rules.heading_open = function (tokens, idx, options, env, self) {
    const token = tokens[idx]
    const contentToken = tokens[idx + 1]

    const level = Number(token.tag.replace('h', ''))
    const title = contentToken?.content || ''
    const id = createUniqueSlug(title, env.headingSlugMap)

    token.attrSet('id', id)

    env.toc.push({
        id,
        level,
        title,
    })

    return self.renderToken(tokens, idx, options)
}

export function renderMarkdownWithToc(markdownText = '') {
    const env = {
        toc: [],
        headingSlugMap: new Map(),
    }

    const html = md.render(markdownText, env)

    return {
        html,
        toc: env.toc,
    }
}