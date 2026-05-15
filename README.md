# Skill Library · 技能资料库

[![Deploy](https://github.com/zhongrenfei1-hub/skill-library/actions/workflows/deploy.yml/badge.svg)](https://github.com/zhongrenfei1-hub/skill-library/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

按类别整理的 Claude Skills 资料库网站。Anthropic 风格的视觉,markdown 驱动的内容。

**🌐 在线访问**:https://zhongrenfei1-hub.github.io/skill-library/

收录:
- **99 份** 来自 [rampstackco/claude-skills](https://github.com/rampstackco/claude-skills) 的方法论(每份附中文注释 + 完整英文原文)
- **3 份** 针对电商品牌网站的额外手写补充
- **10 个** 分类:电商品牌网站(精选)、内容创作、SEO、设计、开发、营销、运营、UX 研究、产品策略、交互模式

---

## 快速开始

```bash
cd skill-library-site
npm install
npm run dev      # → http://localhost:5173
```

打包部署:

```bash
npm run build    # 输出到 dist/
```

可直接部署到 Vercel / Netlify / Cloudflare Pages / GitHub Pages —— 静态站,无后端。

---

## 项目结构

```
skill-library-site/
├── content/                       # 内容(你往这里加 skill)
│   ├── categories.json            # 分类配置
│   └── skills/                    # skill markdown 文件
│       ├── ecommerce-brand/       # ← 重点分类
│       │   ├── brand-discovery.md
│       │   ├── information-architecture.md
│       │   ├── shopify-theme-architecture.md
│       │   ├── pdp-copy.md
│       │   └── design-tokens.md
│       ├── content-creation/
│       ├── seo/
│       ├── design/
│       ├── development/
│       ├── marketing/
│       └── operations/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   ├── components/                # Header / Footer / Layout / SkillCard / CategoryCard / Markdown
│   ├── pages/                     # Home / Categories / CategoryPage / AllSkills / SkillPage / Search / About / NotFound
│   └── lib/
│       └── content.js             # 加载 + 解析 markdown (import.meta.glob)
├── public/
│   └── favicon.svg
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.cjs
```

---

## 添加新 skill(一步)

在 `content/skills/<分类>/` 下放一份 markdown 文件:

```markdown
---
title: 你的 Skill 标题
description: |
  一段说明,会出现在卡片和列表里。
  支持多行。
category: ecommerce-brand
tags: [shopify, brand-discovery]
icon: 🛍️
featured: true
author: 你的名字
updated: 2026-05-15
---

# 主体写 markdown

正文段落、表格、代码块、列表 —— 全 markdown 支持。
```

保存后 dev server 会热更新,卡片自动出现在分类页 + 首页。

---

## 添加新分类

编辑 `content/categories.json`,加一项:

```json
{
  "slug": "audio-podcast",
  "name": "播客与音频",
  "tagline": "从录制到发布",
  "description": "播客内容、剪辑、托管、分发的 skill。",
  "icon": "🎧",
  "featured": false
}
```

然后 `content/skills/audio-podcast/` 下放 markdown 即可。`slug` 必须与目录名一致。

---

## 已包含的分类

| Slug | 名称 | 状态 |
|---|---|---|
| `ecommerce-brand` | 电商品牌网站 | **★ 精选 · 5 个示范 skill** |
| `content-creation` | 内容创作 | 1 个占位 |
| `seo` | SEO | 1 个占位 |
| `design` | 设计 | 1 个占位 |
| `development` | 开发 | 1 个占位 |
| `marketing` | 营销 | 1 个占位 |
| `operations` | 运营 | 1 个占位 |

---

## 视觉风格

参照 Anthropic Claude 的设计语言:

- 主色:`#1A1815`(ink)/ `#F6F2E8`(cream)/ `#CC785C`(clay,Claude 橙)
- 字体:Source Serif 4(headings)+ Inter(body)
- 大量留白、克制阴影、4px 半径
- 在 [`tailwind.config.js`](tailwind.config.js) 里可调

---

## 技术栈

- **React 18** + **Vite 5**
- **Tailwind CSS 3**
- **React Router 6**
- **marked**(markdown 渲染)
- 内置 frontmatter 解析(无外部依赖)

---

## 部署

### Vercel / Netlify

直接连 git 仓库,默认配置即可识别 Vite。

### GitHub Pages

```bash
npm run build
# 把 dist/ 推到 gh-pages 分支
```

如果部署在子路径,在 `vite.config.js` 加 `base: '/your-repo/'`。

---

## License

MIT
