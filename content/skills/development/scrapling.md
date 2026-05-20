---
title: Scrapling · 适应性 Python 爬虫
description: |
  开源 Python 爬虫框架(BSD-3-Clause)—— 元素位置 / 属性变了也能用相似度评分继续命中。
  内置 3 套 fetcher(HTTP / Playwright / 隐身)、Cloudflare Turnstile 反检测、MCP server 直接给 Claude 用。
category: development
tags: [scraping, python, anti-bot, playwright, mcp, automation]
icon: 🕷️
featured: true
author: D4Vinci (Karim Shoair)
updated: 2026-05-19
source: https://github.com/D4Vinci/Scrapling
---

## 这个 skill 是干什么的

> 大多数爬虫脚本写完三个月就坏 —— 不是被封,是 CSS / XPath 选择器随对方改版失效。
> Scrapling 把选中的元素做一次"指纹快照",下次抓页时按相似度评分匹配,
> 即使结构变了也能继续命中。配合 Cloudflare Turnstile / Playwright 隐身,可单包覆盖
> 从一次性脚本到大规模爬取的整套需求。

## 何时使用

- 需要长时间运行的爬虫(每周 / 每天跑)—— 不想每次站点改版都改选择器
- 目标站有 Cloudflare / Turnstile / 浏览器指纹检测
- 想让 Claude / Cursor 直接调用爬虫工具(走 MCP server)
- 单仓库内同时有简单 HTTP 抓取 + 复杂 JS 渲染抓取

## 何时不使用

- 一次性、十行以内的脚本(requests + BeautifulSoup 够了)
- 需要登陆态 + 复杂多步交互的 SaaS 后台(用 Playwright 直接写更清楚)
- 高频实时数据流(改用站方官方 API / WebSocket)

---

## 核心机制 · 适应性(Adaptive)

1. 抓页时,Scrapling 给被选中的元素生成**指纹**(标签、属性、文本、层级、邻居等)并存到本地(`storage_file`)。
2. 下次抓同一域名 + 同一 `identifier` 时,把页面里所有候选元素都和指纹做**相似度评分**(连属性顺序这种细节都算进去)。
3. 返回得分最高的元素 —— 即使原来 `.product-price` 变成了 `.price-display`,只要语义和结构相近,仍然能匹配上。

```python
from scrapling.fetchers import Fetcher

# 第一次抓取 + 存指纹
page = Fetcher.get("https://example.com/p/123")
price = page.css_first(".price", adaptive=True, identifier="product_price")

# 几天后对方改了 class 名 —— 仍然能找到
page2 = Fetcher.get("https://example.com/p/123")
price2 = page2.css_first(".price", adaptive=True, identifier="product_price")
# Scrapling 用指纹文件里的"product_price"快照做相似度匹配,无需改代码
```

---

## 三种 Fetcher

| Fetcher | 用途 | 何时选 |
|---|---|---|
| `Fetcher` | 纯 HTTP + TLS 指纹伪装 | 静态页、API 抓取、性能优先 |
| `DynamicFetcher` | Playwright 渲染 | 需要 JS 执行、SPA 抓取 |
| `StealthyFetcher` | Playwright + 反检测加固 | Cloudflare / Turnstile / 浏览器指纹防护 |

```python
from scrapling.fetchers import StealthyFetcher

page = StealthyFetcher.fetch(
    "https://受 cloudflare 保护的站",
    headless=True,
    google_search=True,         # 模拟从 google 跳过来
    wait_selector=".content",   # 等元素出现再返回
)
print(page.status, page.title)
```

---

## 快速上手

```bash
pip install scrapling
scrapling install     # 装 playwright 浏览器
```

```python
from scrapling.fetchers import Fetcher

page = Fetcher.get("https://news.ycombinator.com")
for row in page.css("tr.athing"):
    title = row.css_first(".titleline a").text.clean()
    url   = row.css_first(".titleline a").attrib["href"]
    print(title, url)
```

CSS / XPath / 文本匹配 / 正则全都支持。返回的 `Adaptor` 对象类似 Parsel + BeautifulSoup 的并集。

---

## 配合 MCP(给 Claude / Cursor 用)

Scrapling 自带 MCP server,**在 Claude 之外的进程里做完抓取 + 内容裁剪 + 元素定位**,
只把"用户真正要的那几段"交给 LLM,大幅省 token。

```bash
scrapling mcp serve --port 8080
```

在 Claude Code 的 `.mcp.json` 里登记:

```json
{
  "mcpServers": {
    "scrapling": {
      "command": "scrapling",
      "args": ["mcp", "stdio"]
    }
  }
}
```

之后 Claude 就能直接调用 `scrapling.fetch_url` / `scrapling.extract_main_content` / `scrapling.css_select` 这类工具。

---

## 写爬虫的工程纪律(无论用不用 Scrapling)

- **限流**:`time.sleep(random.uniform(1, 3))`,或用 `asyncio.Semaphore` 做并发上限
- **缓存**:第一次抓的页面落地(`.html.gz`),开发期反复跑同一份缓存
- **错误分流**:4xx vs 5xx vs 拿到 200 但内容是 challenge 页 —— 三种应对不同
- **遵守 robots / ToS**:商业用途之前先看对方有没有 API
- **可观测**:每次抓取记一个 `attempt_id`、成功率、耗时、状态码,出问题能 5 分钟定位

---

## 参考

- GitHub:[D4Vinci/Scrapling](https://github.com/D4Vinci/Scrapling)
- 官方教程:[ScrapingBee 介绍](https://www.scrapingbee.com/blog/scrapling-adaptive-python-web-scraping/)
- 实战 6 步:[RoundProxies 教程](https://roundproxies.com/blog/scrapling/)
- 技术评测:[Apify Technical Review](https://use-apify.com/blog/scrapling-python-web-scraping-framework)
- 与 ZenRows 对比:[ZenRows 2026 教程](https://www.zenrows.com/blog/scrapling-web-scraper)
