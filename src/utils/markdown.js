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
    macros: {
        '\\ii': '\\text{i}',
        '\\jj': '\\text{j}',
        '\\kk': '\\text{k}',
    },
})

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