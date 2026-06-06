var e=Object.defineProperty,t=(t,n)=>{let r={};for(var i in t)e(r,i,{get:t[i],enumerable:!0});return n||e(r,Symbol.toStringTag,{value:`Module`}),r};(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var n={name:`YourName`,title:`Personal Blog`,subtitle:`Notes, Projects and Thoughts`,description:`这里写一句简短的个人博客介绍。`,author:`YourName`,year:new Date().getFullYear(),links:[{label:`GitHub`,href:`#`},{label:`Email`,href:`#`}]},r=[{label:`首页`,path:`/`},{label:`文章`,path:`/posts`},{label:`项目`,path:`/projects`},{label:`关于`,path:`/about`}];function i(e,t){return t===`/`?e===`/`:e===t||e.startsWith(`${t}/`)}function a(e){let t=r.map(t=>`
        <a class="${i(e,t.path)?`is-active`:``}" href="#${t.path}">
          ${t.label}
        </a>
      `).join(``);return`
    <header class="site-header">
      <div class="container header-inner">
        <a class="logo" href="#/">
          <span class="logo-mark">Y</span>
          <span>${n.name}</span>
        </a>

        <nav class="nav" data-nav>
          ${t}
        </nav>

        <button class="menu-button" data-menu-button aria-label="打开导航菜单">
          ☰
        </button>
      </div>
    </header>
  `}function o(){let e=n.links.map(e=>`
        <a href="${e.href}" target="_blank" rel="noreferrer">
          ${e.label}
        </a>
      `).join(``);return`
    <footer class="site-footer">
      <div class="container footer-inner">
        <p>© ${n.year} ${n.author}. All rights reserved.</p>

        <div class="footer-links">
          ${e}
        </div>
      </div>
    </footer>
  `}function s(e,t){return`
    <div class="page-shell">
      ${a(t)}

      <main class="main">
        <div class="container">
          ${e}
        </div>
      </main>

      ${o()}
    </div>
  `}var c=[{id:`example-post`,title:`文章标题`,date:`2026-06-06`,category:`分类`,tags:[`标签一`,`标签二`],summary:`这里写文章摘要，用一两句话说明这篇文章主要记录了什么内容。`,file:`example-post`,featured:!0}];function l(e){return c.find(t=>t.id===e)}var u=[{id:`example-project`,title:`项目名称`,date:`2026`,category:`项目分类`,tags:[`标签一`,`标签二`],summary:`这里写项目简介，用几句话说明项目背景、目标和主要内容。`,detail:`
      <p>这里是项目详情内容。</p>
      <p>你可以写项目背景、技术方案、实现过程、遇到的问题和最终结果。</p>
    `,featured:!0}];function d(e){return u.find(t=>t.id===e)}function f({eyebrow:e,title:t,description:n=``}){return`
    <div class="section-title">
      <div>
        <p>${e}</p>
        <h2>${t}</h2>
      </div>

      ${n?`<div class="section-desc">${n}</div>`:``}
    </div>
  `}function p(e){let t=e.tags.map(e=>`<span>${e}</span>`).join(``);return`
    <article class="card">
      <a href="#/posts/${e.id}">
        <div class="card-meta">
          <span>${e.date}</span>
          <span>${e.category}</span>
        </div>

        <h3>${e.title}</h3>
        <p>${e.summary}</p>

        <div class="tags">
          ${t}
        </div>
      </a>
    </article>
  `}function m(e){let t=e.tags.map(e=>`<span>${e}</span>`).join(``);return`
    <article class="card">
      <a href="#/projects/${e.id}">
        <div class="card-meta">
          <span>${e.date}</span>
          <span>${e.category}</span>
        </div>

        <h3>${e.title}</h3>
        <p>${e.summary}</p>

        <div class="tags">
          ${t}
        </div>
      </a>
    </article>
  `}function h(){let e=c.filter(e=>e.featured).slice(0,3),t=u.filter(e=>e.featured).slice(0,2);return`
    <section class="hero">
      <div>
        <p class="eyebrow">${n.subtitle}</p>
        <h1>这里写你的主页标题</h1>
        <p class="hero-text">
          ${n.description}
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
      ${f({eyebrow:`Latest Posts`,title:`最近文章`,description:`这里展示最新发布的文章。`})}

      <div class="grid grid-three">
        ${e.length?e.map(p).join(``):`<div class="empty-state">暂无文章。</div>`}
      </div>
    </section>

    <section class="section">
      ${f({eyebrow:`Featured Projects`,title:`精选项目`,description:`这里展示你希望重点呈现的项目。`})}

      <div class="grid">
        ${t.length?t.map(m).join(``):`<div class="empty-state">暂无项目。</div>`}
      </div>
    </section>
  `}function g(){let e=c.map(p).join(``);return`
    <section class="page-title">
      <p class="eyebrow">Posts</p>
      <h1>文章</h1>
      <p>这里集中展示你的技术文章、学习笔记和长期记录。</p>
    </section>

    <section class="grid grid-three">
      ${c.length?e:`<div class="empty-state">暂无文章。</div>`}
    </section>
  `}var _=t({default:()=>v}),v=`
  <p>
    这里是文章正文。你可以在这里写学习笔记、项目总结、技术记录或其他内容。
  </p>

  <h2>小标题</h2>

  <p>
    这里继续写正文内容。
  </p>

  <pre><code>const message = 'Hello Blog'
console.log(message)</code></pre>

  <h2>总结</h2>

  <p>
    这里写文章总结。
  </p>
`,y=Object.assign({"../posts/example-post.js":_});function b(e){let t=l(e);if(!t)return`
      <section class="empty-state">
        <p>没有找到这篇文章。</p>
        <p><a href="#/posts">返回文章列表</a></p>
      </section>
    `;let n=y[`../posts/${t.file}.js`]?.default||`<p>文章内容不存在。</p>`,r=t.tags.map(e=>`<span>${e}</span>`).join(``);return`
    <article class="article">
      <header class="article-header">
        <a class="back-link" href="#/posts">← 返回文章列表</a>

        <div class="card-meta">
          <span>${t.date}</span>
          <span>${t.category}</span>
        </div>

        <h1>${t.title}</h1>

        <div class="tags">
          ${r}
        </div>
      </header>

      <div class="article-body">
        ${n}
      </div>
    </article>
  `}function x(){let e=u.map(m).join(``);return`
    <section class="page-title">
      <p class="eyebrow">Projects</p>
      <h1>项目</h1>
      <p>这里展示你的项目实践、作品记录和阶段性成果。</p>
    </section>

    <section class="grid">
      ${u.length?e:`<div class="empty-state">暂无项目。</div>`}
    </section>
  `}function S(e){let t=d(e);if(!t)return`
      <section class="empty-state">
        <p>没有找到这个项目。</p>
        <p><a href="#/projects">返回项目列表</a></p>
      </section>
    `;let n=t.tags.map(e=>`<span>${e}</span>`).join(``);return`
    <article class="article">
      <header class="article-header">
        <a class="back-link" href="#/projects">← 返回项目列表</a>

        <div class="card-meta">
          <span>${t.date}</span>
          <span>${t.category}</span>
        </div>

        <h1>${t.title}</h1>

        <div class="tags">
          ${n}
        </div>
      </header>

      <div class="article-body">
        ${t.detail}
      </div>
    </article>
  `}function C(){return`
    <section class="page-title">
      <p class="eyebrow">About</p>
      <h1>关于</h1>
      <p>这里写你的个人介绍、技术方向、学习经历和联系方式。</p>
    </section>

    <section class="article-body">
      <h2>个人介绍</h2>
      <p>
        这里写你的基本介绍。
      </p>

      <h2>技术方向</h2>
      <p>
        这里写你关注的技术方向。
      </p>

      <h2>联系方式</h2>
      <p>
        这里写你的 GitHub、邮箱或其他链接。
      </p>
    </section>
  `}function w(){return`
    <section class="empty-state">
      <p>页面不存在。</p>
      <p><a href="#/">返回首页</a></p>
    </section>
  `}function T(e){let t=e.replace(/^#/,``)||`/`;return t.length>1&&t.endsWith(`/`)?t.slice(0,-1):t}function E(){let e=document.querySelector(`[data-menu-button]`),t=document.querySelector(`[data-nav]`);!e||!t||(e.addEventListener(`click`,()=>{t.classList.toggle(`is-open`)}),t.querySelectorAll(`a`).forEach(e=>{e.addEventListener(`click`,()=>{t.classList.remove(`is-open`)})}))}function D(){let e=document.querySelector(`#app`),t=T(window.location.hash||`#/`),n;n=t===`/`?h():t===`/posts`?g():t.startsWith(`/posts/`)?b(decodeURIComponent(t.replace(`/posts/`,``))):t===`/projects`?x():t.startsWith(`/projects/`)?S(decodeURIComponent(t.replace(`/projects/`,``))):t===`/about`?C():w(),e.innerHTML=s(n,t),E(),window.scrollTo(0,0)}D(),window.addEventListener(`hashchange`,D);