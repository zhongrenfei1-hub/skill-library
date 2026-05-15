import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="container-prose py-16 md:py-24 prose-skill">
      <span className="eyebrow">关于 / About</span>
      <h1 className="mt-4 text-4xl md:text-5xl font-serif font-medium">
        Skill Library
      </h1>
      <p className="text-xl leading-relaxed">
        按类别整理的 Claude Skills 资料库。 一份 markdown,一个 skill;一个目录,一个分类。
      </p>

      <h2>这是什么</h2>
      <p>
        这是一个安静的资料库 —— 把可复用的工作流(prompt、流程、模板、清单)整理成
        markdown,按类别归档,方便检索和扩展。它不是 Claude 的对话界面,
        也不是 prompt 商店,只是一份不断生长的"做事方法库"。
      </p>

      <h2>主要分类</h2>
      <ul>
        <li><strong><Link to="/categories/ecommerce-brand">电商品牌网站</Link></strong> —— 重点分类。涵盖品牌发现、视觉、IA、文案、Shopify/Next.js 实现。</li>
        <li><Link to="/categories/content-creation">内容创作</Link></li>
        <li><Link to="/categories/seo">SEO</Link></li>
        <li><Link to="/categories/design">设计</Link></li>
        <li><Link to="/categories/development">开发</Link></li>
        <li><Link to="/categories/marketing">营销</Link></li>
        <li><Link to="/categories/operations">运营</Link></li>
      </ul>

      <h2 id="contribute">如何添加 skill</h2>
      <p>
        添加一份新 skill 只需要一步:
      </p>
      <ol>
        <li>
          在 <code>content/skills/&lt;分类目录&gt;/</code> 下新建一份{' '}
          <code>your-skill.md</code> 文件
        </li>
        <li>顶部写 frontmatter,主体写 markdown</li>
        <li>开发模式下保存即热更新,生产模式重新构建即可</li>
      </ol>

      <h3>Frontmatter 模板</h3>
      <pre><code>{`---
title: 你的 Skill 标题
description: |
  一段说明,会出现在卡片和列表里。
  支持多行。
category: ecommerce-brand
tags: [shopify, brand-discovery, copywriting]
icon: 🛍️
featured: true
author: 你的名字
updated: 2026-05-15
---

# 主体用 markdown 写就行

## 子标题

正文段落,**支持** *所有* Markdown 语法。

\`\`\`liquid
{{ product.title }}
\`\`\`
`}</code></pre>

      <h3>支持的 frontmatter 字段</h3>
      <table>
        <thead>
          <tr><th>字段</th><th>必填</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td><code>title</code></td><td>是</td><td>显示标题</td></tr>
          <tr><td><code>description</code></td><td>是</td><td>列表卡片上的简述。支持 <code>|</code> 多行</td></tr>
          <tr><td><code>category</code></td><td>否</td><td>覆盖目录推断的分类</td></tr>
          <tr><td><code>tags</code></td><td>否</td><td>数组,如 <code>[a, b, c]</code></td></tr>
          <tr><td><code>icon</code></td><td>否</td><td>表情或字符</td></tr>
          <tr><td><code>featured</code></td><td>否</td><td><code>true</code> 时优先排序</td></tr>
          <tr><td><code>author</code></td><td>否</td><td>作者署名</td></tr>
          <tr><td><code>updated</code></td><td>否</td><td><code>YYYY-MM-DD</code></td></tr>
        </tbody>
      </table>

      <h3>如何添加新分类</h3>
      <p>
        编辑 <code>content/categories.json</code>,加一项:
      </p>
      <pre><code>{`{
  "slug": "audio-podcast",
  "name": "播客与音频",
  "tagline": "从录制到发布",
  "description": "覆盖播客内容策划、剪辑、托管、分发的完整 skill 集合。",
  "icon": "🎧",
  "featured": false
}`}</code></pre>
      <p>
        然后在 <code>content/skills/audio-podcast/</code> 下放 markdown 即可。
      </p>

      <h2>本地开发</h2>
      <pre><code>{`npm install
npm run dev    # http://localhost:5173
npm run build  # 生成 dist/`}</code></pre>

      <h2>技术栈</h2>
      <ul>
        <li>React 18 + Vite 5</li>
        <li>Tailwind CSS</li>
        <li>React Router</li>
        <li>marked(markdown 渲染)</li>
        <li>内置 frontmatter 解析(无外部依赖)</li>
      </ul>

      <hr />
      <p className="text-sm text-ink-mute">
        Made with care · <a href="https://github.com/rampstackco/claude-skills">参考方法论 rampstack skills</a>
      </p>
    </div>
  );
}
