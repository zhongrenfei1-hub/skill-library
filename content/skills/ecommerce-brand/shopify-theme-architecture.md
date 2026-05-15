---
title: Shopify 主题架构(OS 2.0)
description: |
  用 OS 2.0 JSON-template 模式搭建可由商家编辑的独立站主题 ——
  layout / sections / templates / snippets / config 的分工与最小骨架。
category: ecommerce-brand
tags: [shopify, liquid, theme, os2]
icon: 🧱
updated: 2026-05-15
---

## OS 2.0 关键点

- 模板用 **JSON**(`templates/*.json`),引用一组 `sections/*.liquid`
- 每个 section 自带 `{% schema %}`,商家在后台可拖动 / 配置 blocks
- 全局区域用 **section group**(`sections/header-group.json` / `footer-group.json`)
- 设置面板用 `config/settings_schema.json`,值落到 `config/settings_data.json`

## 最小骨架

```
shopify-theme/
├── assets/             # theme.css, theme.js, 图片
├── config/
│   ├── settings_schema.json
│   └── settings_data.json
├── layout/
│   └── theme.liquid    # 包裹所有页面
├── locales/
│   └── zh-CN.default.json
├── sections/
│   ├── header.liquid           # 含 {% schema %}
│   ├── footer.liquid
│   ├── header-group.json       # 把 header section 注册成 group
│   ├── footer-group.json
│   ├── main-product.liquid     # PDP 主区
│   ├── main-collection.liquid
│   ├── main-page.liquid
│   └── ...                     # 业务 sections (hero, manifesto, ...)
├── snippets/
│   ├── product-card.liquid
│   └── meta-tags.liquid
└── templates/
    ├── index.json
    ├── product.json
    ├── collection.json
    ├── page.json
    ├── cart.json
    └── ...
```

## layout/theme.liquid 关键片段

```liquid
<!doctype html>
<html lang="{{ shop.locale }}">
  <head>
    <title>{{ page_title }} — {{ shop.name }}</title>
    {{ content_for_header }}
    <link rel="stylesheet" href="{{ 'theme.css' | asset_url }}">
  </head>
  <body>
    {% sections 'header-group' %}
    <main>{{ content_for_layout }}</main>
    {% sections 'footer-group' %}
    <script src="{{ 'theme.js' | asset_url }}" defer></script>
  </body>
</html>
```

## section schema 范式

```liquid
{% schema %}
{
  "name": "Hero / 主视觉",
  "settings": [
    { "type": "text", "id": "title", "label": "主标" },
    { "type": "image_picker", "id": "image", "label": "Hero 图片" },
    { "type": "url", "id": "cta_url", "label": "CTA 链接" }
  ],
  "presets": [{ "name": "Hero / 主视觉" }]
}
{% endschema %}
```

## index.json 范式

```json
{
  "sections": {
    "hero": { "type": "hero", "settings": { "title": "三季三款,陪你三年。" } },
    "featured": { "type": "featured-product" }
  },
  "order": ["hero", "featured"]
}
```

## 自定义 metafield

复用品牌叙事数据(主作师傅、产品编号、季节)的最佳载体:

```
namespace: sanshi
key: master_name, number, season_total, specs (json)
```

在 liquid 中:`{{ product.metafields.sanshi.master_name }}`

## 上传

```bash
# 方式 1:Shopify CLI
shopify theme dev   # 本地预览
shopify theme push

# 方式 2:zip 包
zip -r theme.zip .  # 后台上传
```

## 常见坑

- `{% form %}` 标签里如果要加 `data-*` 属性,key 必须**加引号**:
  `{% form 'product', product, 'data-product-form': '' %}`
- `inventory_quantity` 只在 `inventory_management != blank` 时有效
- JSON 模板里 section 必须先在 `sections/` 实际存在,否则 build 失败

## 移交给

- `landing-page-copy` —— 每个 section 的真实文案
- `design-standards` —— theme.css 的 design tokens
