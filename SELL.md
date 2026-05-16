# Sell · 推广素材

> Sell 环产物。社媒短文、价值主张、关键截图脚本。

---

## 一句话定位

> **一份 markdown,一个 skill。** 102 个可复用工作流,按类别整理,可拖拽、可本地同步。

## 价值主张(从短到长)

### 6 字版
**会读 · 可扩 · 离线**

### 12 字版
**安静的 skill 库,markdown 直发。**

### 30 字版
102 份方法论按类别整理,拖拽即导入,本地文件夹双向同步,免 CMS。

### 60 字版
RampStack 99 个 Claude Skill 的中文注释版 + 电商品牌补充。Anthropic 风格视觉,markdown
驱动内容,Chrome 上能授权本地文件夹做双向同步,git push 即发布。

---

## 推特 / 即刻短文(中文)

### v1 · 价值主张
```
做了个 Claude Skill 资料库站,把 rampstackco 99 个方法论
带中文注释收进来,加了一个能拖 .md / 同步本地文件夹的工作区。
markdown 即内容,git push 即发布,没有后台。
👉 zhongrenfei1-hub.github.io/skill-library
```

### v2 · 强调本地文件夹
```
浏览器 File System Access API 实测靠谱:
授权一个本地目录 → 编辑 .md → 点"重新读取" → 即时刷新。
所有数据只在浏览器,不上传。
做了个 Skill Library 把这个范式跑通了:
zhongrenfei1-hub.github.io/skill-library/local
```

### v3 · 强调布局哲学
```
为什么页面长这样,而不是长成 SaaS 落地页那样?
写了一页解释:大段留白、衬线长标、不为商家编辑面板让步、
数字也是字体、一份 markdown 一个 skill。
zhongrenfei1-hub.github.io/skill-library/philosophy
```

## 小红书短文

```
开源了一个 Claude Skill 资料库网站 🛍️

收录:
✓ 99 份 RampStack 方法论(带中文注释)
✓ 重点分类:电商品牌网站
✓ 10 个分类:SEO / 设计 / 开发 / 营销 / 运营 ...

亮点:
📥 拖一份 .md 进网页就能预览
📂 本地文件夹联动(Chrome 限定)
🎨 Anthropic 风格 UI,大段留白
🤖 markdown 直发,不需要 CMS

链接放评论
```

---

## Hero 截图脚本(等真截图上传时按这个抓)

| 截图 | 路径 | 内容要点 |
|---|---|---|
| 1. 首页 Hero | `/` | 衬线大标 + 副标 + 三个 CTA + 数据条 |
| 2. 电商品牌分类 | `/categories/ecommerce-brand` | 12 张卡片 + featured 徽标 |
| 3. skill 详情 | `/skills/brand-discovery` | 中文注释 + 英文原文 |
| 4. 本地工作区 | `/local` | 拖拽区 + 已导入列表 + 详情 |
| 5. 布局哲学 | `/philosophy` | 8 章节衬线大标 + 编号 |

录屏建议:
- 1.5x 速,15-20 秒
- 拖一份 .md 进 /local 看左侧出现新条目 → 点开 → 看 markdown 渲染
- 切换 /philosophy 滚动展示

---

## Show HN draft (英文)

**Title**: Show HN: A markdown-driven Claude skill library with local folder sync

**Body**:
```
I built a static skill library for Claude (and other agent SDKs).
The thesis: skills are essentially structured markdown; a website serving
them should be just as boring — version-controlled files, no CMS, no admin.

Stack:
- React + Vite + Tailwind, static-deployed to GitHub Pages
- `import.meta.glob` discovers markdown by directory
- Pre-build script extracts frontmatter into a 100KB index for the homepage
- Each skill body is its own lazy-loaded chunk (~8-13KB gzip)

Two interaction modes I'm happy with:
1) Drag a `.md` file or whole folder onto /local — frontmatter parsed,
   preview rendered, never uploaded.
2) "Open local folder" uses File System Access API. Authorize a directory
   once, edit your markdown locally in any editor, click "re-read" to sync.
   Browser-only, no daemon.

I also wrote an explicit /philosophy page about why the layout looks the way
it does, including "anti-patterns we refuse" (no scroll animations, no
shop-style editor settings exposed, etc).

Seeded with 99 skills from rampstackco/claude-skills with Chinese annotations
+ original methodology embedded, plus 3 hand-written for e-commerce brand
sites.

Live: https://zhongrenfei1-hub.github.io/skill-library/
Repo: https://github.com/zhongrenfei1-hub/skill-library

Curious if anyone uses File System Access API in production today and what
gotchas you hit.
```

## 投放策略(下一阶段)

| 渠道 | 内容 | 频率 |
|---|---|---|
| 即刻 | 长文 + Demo 录屏 | 一次性,可置顶 |
| 小红书 | 视觉笔记 + 5 张精选截图 | 每周 1 篇 |
| Twitter | 英文版,强调 FSA + markdown stack | 每周 1 条 |
| Hacker News | Show HN,标题:Show HN: A markdown-driven Claude skill library with local folder sync | 一次性,等首页 v2 |

---

## 待办

- [ ] 录 15 秒 demo GIF(拖拽导入)
- [ ] 截 5 张关键页面
- [ ] Twitter / 即刻首发文案过审
- [ ] 等 GitHub Pages 部署完成,跑 Lighthouse,把分数贴 README
