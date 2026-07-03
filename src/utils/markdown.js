import MarkdownIt from 'markdown-it'
import texmath from 'markdown-it-texmath'
import katex from 'katex'
import hljs from 'highlight.js'
import 'katex/dist/katex.min.css'

const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    breaks: false,
})

md.use(texmath, {
    engine: katex,
    delimiters: 'dollars',
    katexOptions: {
        throwOnError: false,
        strict: 'ignore',
    },
})

const defaultFenceRenderer = md.renderer.rules.fence

md.renderer.rules.fence = function (tokens, idx, options, env, self) {
    const token = tokens[idx]
    const rawInfo = token.info ? token.info.trim() : ''
    const language = rawInfo.split(/\s+/g)[0] || 'text'
    const code = token.content

    const highlighted = options.highlight
        ? options.highlight(code, language)
        : md.utils.escapeHtml(code)

    const languageLabelMap = {
        c: 'C',
        cpp: 'C++',
        cxx: 'C++',
        js: 'JavaScript',
        javascript: 'JavaScript',
        ts: 'TypeScript',
        json: 'JSON',
        bash: 'Bash',
        shell: 'Shell',
        powershell: 'PowerShell',
        text: 'Plain Text',
        plaintext: 'Plain Text',
    }

    const label = languageLabelMap[language.toLowerCase()] || language.toUpperCase()

    return `
    <div class="code-block">
      <div class="code-header">
        <span class="code-dot"></span>
        <span class="code-lang">${md.utils.escapeHtml(label)}</span>
      </div>
      <pre><code class="hljs language-${md.utils.escapeHtml(language)}">${highlighted}</code></pre>
    </div>
  `
}

function slugify(text) {
    return text
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\p{L}\p{N}\-_]+/gu, '') || 'section'
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