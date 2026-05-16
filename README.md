# Skill Library · 技能资料库

[![Deploy](https://github.com/zhongrenfei1-hub/skill-library/actions/workflows/deploy.yml/badge.svg)](https://github.com/zhongrenfei1-hub/skill-library/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Skills](https://img.shields.io/badge/skills-102-CC785C)](https://zhongrenfei1-hub.github.io/skill-library/skills)
[![Initial JS](https://img.shields.io/badge/initial%20JS-78KB%20gzip-1A1815)](https://zhongrenfei1-hub.github.io/skill-library/)

> 一份 markdown,一个 skill;一个目录,一个分类。
> 安静、可读、可拖、可同步。

**🌐 在线访问**:https://zhongrenfei1-hub.github.io/skill-library/

## 它做什么

把可复用的工作流(prompt、流程、模板、清单)按类别整理成 markdown,做成一个 **既能读、又能扩展、又能本地接入** 的网站。

### 核心特性

- 📚 **102 份内置 skill** —— 99 份来自 [rampstackco/claude-skills](https://github.com/rampstackco/claude-skills) + 3 份电商品牌补充。每份附中文注释 + 完整英文原文。
- 🗂️ **10 个分类** —— 电商品牌网站(精选)、内容创作、SEO、设计、开发、营销、运营、UX 研究、产品策略、交互模式
- 📥 **本地拖拽** —— 把 `.md` 或整个目录拖到 [/local](https://zhongrenfei1-hub.github.io/skill-library/local) 即时解析预览
- 📂 **本地文件夹联动** —— Chrome / Edge 上用 File System Access API 授权一个本地目录,任意编辑后一键重新同步
- ⌘ **Cmd+K 命令面板** —— `/` 或 `⌘K` 全局搜索 skills / 分类 / 页面,键盘可达
- 📑 **目录 ToC + 复制按钮** —— 长 skill 自带右侧粘性目录,一键复制 markdown 全文
- 🎨 **3 个主题** —— 原色(默认)/ 羊皮(sepia)/ 夜色(dark)随时切换
- 🗂️ **SEO 友好** —— sitemap.xml + RSS feed + robots.txt 全套自动生成
- 🎨 **显式布局哲学** —— [/philosophy](https://zhongrenfei1-hub.github.io/skill-library/philosophy) 8 条原则解释"为什么页面长这样"
- 🤖 **markdown-only** —— 没有 CMS、没有数据库、没有富文本编辑器。`git push` 即发布。

### 性能

- **首屏 JS**:~78 KB gzip(vendor-react + index + 主页)
- **每个 skill**:~8-13 KB gzip,只在打开时按需加载
- **预构建索引**:metadata 与 body 分离,Home / Categories / Search 无需载入正文

### 设计语言

参照 Anthropic Claude 的视觉:
- 主色:`#1A1815` ink / `#F6F2E8` cream / `#CC785C` clay
- 字体:Source Serif 4(标题)+ Inter(正文)+ Noto Serif SC(中文兜底)
- 大量留白 · 几乎无阴影 · 4px 半径 · 数字用衬线
- 主题切换:原色 / 羊皮 / 夜色 三套

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
