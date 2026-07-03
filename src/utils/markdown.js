// ============================================================
// 依赖导入
// ============================================================

import MarkdownIt from 'markdown-it'
import texmath from 'markdown-it-texmath'
import katex from 'katex'
import hljs from 'highlight.js'

import 'katex/dist/katex.min.css'


// ============================================================
// Markdown 基础配置
// ============================================================

const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    breaks: false,

    highlight(code, language) {
        if (language && hljs.getLanguage(language)) {
            try {
                return hljs.highlight(code, {
                    language,
                    ignoreIllegals: true,
                }).value
            } catch {
                return md.utils.escapeHtml(code)
            }
        }

        return md.utils.escapeHtml(code)
    },
})


// ============================================================
// KaTeX 数学公式支持
// ============================================================

md.use(texmath, {
    engine: katex,
    delimiters: 'dollars',
    katexOptions: {
        throwOnError: false,
        strict: 'ignore',
    },
})


// ============================================================
// 代码块渲染：语言栏、行号、语法高亮
// ============================================================

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
    text: 'Text',
    plaintext: 'Text',
}

function getLanguageLabel(language) {
    const normalizedLanguage = language.toLowerCase()
    return languageLabelMap[normalizedLanguage] || language.toUpperCase()
}

function renderCodeLines(highlightedCode) {
    return highlightedCode
        .split('\n')
        .map((line, index, array) => {
            if (index === array.length - 1 && line === '') {
                return ''
            }

            return `
        <span class="code-line">
          <span class="code-line-number">${index + 1}</span>
          <span class="code-line-content">${line || ' '}</span>
        </span>
      `
        })
        .join('')
}

md.renderer.rules.fence = function (tokens, idx, options) {
    const token = tokens[idx]
    const rawInfo = token.info ? token.info.trim() : ''
    const language = rawInfo.split(/\s+/g)[0] || 'text'
    const code = token.content.replace(/^\n+|\n+$/g, '')

    const highlighted = options.highlight
        ? options.highlight(code, language)
        : md.utils.escapeHtml(code)

    const label = getLanguageLabel(language)
    const lines = renderCodeLines(highlighted)

    return `
    <div class="code-block">
      <div class="code-header">
        <span class="code-title">代码块</span>
        <span class="code-lang">${md.utils.escapeHtml(label)}</span>
      </div>

      <pre><code class="hljs language-${md.utils.escapeHtml(language)}">${lines}</code></pre>
    </div>
  `
}


// ============================================================
// 标题 id 与目录生成
// ============================================================

function slugify(text) {
    return (
        text
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\p{L}\p{N}\-_]+/gu, '') || 'section'
    )
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


// ============================================================
// 对外导出：渲染 Markdown 并返回目录
// ============================================================

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