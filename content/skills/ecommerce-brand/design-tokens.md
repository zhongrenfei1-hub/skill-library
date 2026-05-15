---
title: 独立站设计 Token
description: |
  把品牌视觉变成可执行的 CSS variables —— 色、字体、间距、半径、阴影,
  既给设计师参考,也给前端直接落地。
category: ecommerce-brand
tags: [design-system, css, tokens]
icon: 🎨
updated: 2026-05-15
---

## 最小 token 集合

```css
:root {
  /* Color · 通常 6-10 个变量足够,不要开 50 个色阶 */
  --color-ink:    #1B1B1B;
  --color-paper:  #F5F1EA;
  --color-line:   #D8D2C4;
  --color-accent: #6B4A2E;
  --color-mute:   #6E6E6E;

  /* Type */
  --font-serif: "Noto Serif SC", Georgia, serif;
  --font-sans:  "Noto Sans SC", -apple-system, sans-serif;
  --font-num:   "Cormorant Garamond", Georgia, serif;

  /* Size · 8pt rhythm */
  --fs-sm: .875rem; --fs-base: 1rem; --fs-md: 1.125rem;
  --fs-lg: 1.5rem;  --fs-xl: 2rem;   --fs-2xl: 2.75rem; --fs-3xl: 4rem;

  /* Space · 4pt rhythm */
  --space-2: .5rem;  --space-4: 1rem;  --space-6: 1.5rem;
  --space-8: 2rem;   --space-12: 3rem; --space-16: 4rem;
  --space-24: 6rem;  --space-32: 8rem;

  /* Radius / shadow */
  --radius: 4px;
  --shadow: 0 1px 2px rgba(0,0,0,.04);
}
```

## 一些坚持

- **行高比英文站更大**:中文用 1.7-1.9
- **避免阴影**:用 1px 边或更大留白
- **少用圆角**:`border-radius: 2-4px`,品牌视觉更"成人"
- **数字用 serif**:产品编号 / 价格 用 Cormorant Garamond 等衬线字体,是视觉钩子之一

## 对比度 self-check(WCAG AA)

| 用途 | 阈值 |
|---|---|
| 正文 | 4.5:1 |
| 大标题(>24px / >18px bold) | 3:1 |

用 [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) 把每一对(色 × 底)跑一遍。

## token 命名约定

- **不要**按颜色命名(`--red-500`)
- **要**按角色命名(`--color-accent`、`--color-ink`)
- 这样换色时改一处就行

## 移交

- 给前端:把上面的 CSS 直接 paste 到 theme 入口
- 给设计师:把上面的色 + 字体导入 Figma 作为 variables
