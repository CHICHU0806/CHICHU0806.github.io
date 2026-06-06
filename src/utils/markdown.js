import MarkdownIt from 'markdown-it'
import katex from 'katex'
import katexPlugin from '@vscode/markdown-it-katex'

import 'katex/dist/katex.min.css'

const md = new MarkdownIt({
    html: false,
    linkify: true,
    typographer: true,
    breaks: false,
})

const plugin = katexPlugin.default ?? katexPlugin

md.use(plugin, {
    katex,
    throwOnError: false,
    strict: 'ignore',
})

export function renderMarkdown(markdownText) {
    return md.render(markdownText)
}