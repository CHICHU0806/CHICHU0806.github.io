(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})(),document.querySelector(`#app`).innerHTML=`
  <div class="page">
    <header class="header">
      <a href="#" class="logo">YourName</a>

      <nav class="nav" id="nav">
        <a href="#about">关于</a>
        <a href="#posts">文章</a>
        <a href="#projects">项目</a>
        <a href="#contact">联系</a>
      </nav>

      <button class="menu-btn" id="menuBtn" aria-label="打开菜单">
        ☰
      </button>
    </header>

    <main>
      <section class="hero">
        <p class="eyebrow">Personal Blog</p>
        <h1>这里写你的主页标题</h1>
        <p class="hero-text">
          这里写一句简短的个人介绍，例如你的方向、兴趣或博客定位。
        </p>

        <div class="hero-actions">
          <a href="#posts" class="btn primary">查看文章</a>
          <a href="#projects" class="btn secondary">查看项目</a>
        </div>
      </section>

      <section class="section" id="about">
        <div class="section-title">
          <p>About</p>
          <h2>关于我</h2>
        </div>

        <div class="card">
          <p>
            这里放你的个人介绍。可以写你的专业方向、正在学习的内容、项目经历或技术兴趣。
          </p>
        </div>
      </section>

      <section class="section" id="posts">
        <div class="section-title">
          <p>Posts</p>
          <h2>文章</h2>
        </div>

        <div class="grid">
          <article class="card post-card">
            <span class="date">日期</span>
            <h3>文章标题</h3>
            <p>文章简介或摘要。</p>
          </article>

          <article class="card post-card">
            <span class="date">日期</span>
            <h3>文章标题</h3>
            <p>文章简介或摘要。</p>
          </article>

          <article class="card post-card">
            <span class="date">日期</span>
            <h3>文章标题</h3>
            <p>文章简介或摘要。</p>
          </article>
        </div>
      </section>

      <section class="section" id="projects">
        <div class="section-title">
          <p>Projects</p>
          <h2>项目</h2>
        </div>

        <div class="grid">
          <article class="card project-card">
            <h3>项目名称</h3>
            <p>项目简介。</p>
            <div class="tags">
              <span>标签</span>
              <span>标签</span>
            </div>
          </article>

          <article class="card project-card">
            <h3>项目名称</h3>
            <p>项目简介。</p>
            <div class="tags">
              <span>标签</span>
              <span>标签</span>
            </div>
          </article>
        </div>
      </section>

      <section class="section" id="contact">
        <div class="section-title">
          <p>Contact</p>
          <h2>联系我</h2>
        </div>

        <div class="card">
          <p>这里放你的邮箱、GitHub、博客链接或其他联系方式。</p>
        </div>
      </section>
    </main>

    <footer class="footer">
      <p>© 2026 YourName. All rights reserved.</p>
    </footer>
  </div>
`;var e=document.querySelector(`#menuBtn`),t=document.querySelector(`#nav`);e.addEventListener(`click`,()=>{t.classList.toggle(`show`)});