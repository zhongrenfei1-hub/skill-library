#!/usr/bin/env python3
"""
Import all 99 rampstackco/claude-skills SKILL.md files into the skill library
website, with Chinese annotations.

Source : /Users/qiu/skill/claude-skills-ref/skills/<slug>/SKILL.md
Target : /Users/qiu/skill/skill-library-site/content/skills/<category>/<slug>.md

Each generated .md has:
  1. Chinese frontmatter (title / description / category / tags / icon / source URL)
  2. A Chinese annotation block (when 用 / 不用 / 产出)
  3. The verbatim original English SKILL.md body (after stripping its frontmatter)
  4. A footer link back to the upstream file.
"""

from pathlib import Path
import re
import sys

SRC_ROOT = Path("/Users/qiu/skill/claude-skills-ref/skills")
DST_ROOT = Path("/Users/qiu/skill/skill-library-site/content/skills")
GITHUB_BASE = "https://github.com/rampstackco/claude-skills/blob/main/skills"

# ---- 99 skill annotations (slug → cn_title, cn_summary, category, icon, featured) ----
SKILLS = {
    # ===== ecommerce-brand (9) =====
    "brand-archetype-system": ("品牌原型系统", "用 12 个原型框架把品牌的人格化坐标定下来 —— 谁、为何、怎么说话。", "ecommerce-brand", "👤", False),
    "brand-discovery": ("品牌发现", "动手做品牌前先回答四个问题:受众是谁、要什么、谁竞争、能站在哪里。产出受众画像、竞品矩阵、3-5 个定位领地。", "ecommerce-brand", "🧭", True),
    "brand-ideation": ("品牌创意发散", "把 brand-discovery 的多个定位领地收敛到一个,生成品牌命名 / 视觉方向候选。", "ecommerce-brand", "💡", False),
    "brand-identity": ("品牌识别系统", "把品牌核心(原型、调性、定位)落地成可执行的视觉 + 语言系统。", "ecommerce-brand", "🪪", True),
    "brand-style-guide": ("品牌规范手册", "给设计师 / 文案 / 合作方的最终参考:用法、规则、案例、反例。", "ecommerce-brand", "📘", False),
    "brand-voice": ("品牌语调", '定义"我们怎么说话" —— 4 轴坐标、Do/Don\'t、实测文案样本。', "ecommerce-brand", "🗣️", True),
    "creative-brief": ("创意 Brief", "把战略输入转译为可执行的创意工作 brief —— 目标、受众、信息、约束。", "ecommerce-brand", "📝", False),
    "creative-direction": ("创意方向", "在 brief 之上确立审美方向、参考、调性,带领设计师执行。", "ecommerce-brand", "🎬", False),
    "logo-design": ("Logo 设计", "从概念到落版,含尺寸规范、单色 / 反白版本、最小可用尺寸。", "ecommerce-brand", "✦", False),

    # ===== content-creation (12) =====
    "ai-content-collaboration": ("AI 内容协作", "如何与 AI 协同创作长文 / 营销内容 —— 既保留作者声音又利用模型能力。", "content-creation", "🤖", False),
    "content-and-copy": ("内容与文案", "跨页面、跨触点的文案系统化方法 —— 风格、节奏、版本控制。", "content-creation", "📄", False),
    "content-brief-authoring": ("内容 Brief 撰写", "在动手写之前先写好 brief —— 受众、目的、关键信息、参考。", "content-creation", "📋", False),
    "content-distribution": ("内容分发", "把一篇内容拆成多渠道、多形态的发布矩阵。", "content-creation", "📡", False),
    "content-migration": ("内容迁移", "把旧站 / 旧 CMS 内容迁到新平台,不丢 SEO、不破坏链接。", "content-creation", "🔁", False),
    "content-refresh-system": ("内容刷新系统", "老内容定期复检 + 翻新的 SOP —— 防止内容腐烂。", "content-creation", "♻️", False),
    "content-repurposing": ("内容再利用", "一份长文衍生出 5-10 种次级形态(短文、社媒、邮件、视频脚本)。", "content-creation", "🔂", False),
    "content-strategy": ("内容战略", "内容做什么、不做什么、对谁、目的是什么 —— 写作前的元决策。", "content-creation", "🧭", True),
    "editorial-qa": ("编辑校验", "上线前的内容质量门禁 —— 事实、署名、链接、SEO、合规。", "content-creation", "✔️", False),
    "landing-page-copy": ("落地页文案", "单一转化目标的 7 段式文案写法 —— hero / 痛点 / 方案 / 证据 / 异议 / CTA。", "content-creation", "🎯", True),
    "long-form-content-frameworks": ("长文框架", "1000-5000 字长文的结构模板 —— 钩子、主张、论据、反方、结论。", "content-creation", "📑", False),
    "pillar-content-architecture": ("支柱内容架构", "围绕一个主题的内容生态(pillar + cluster)—— SEO 与内容生命周期的核心范式。", "content-creation", "🏛️", False),

    # ===== seo (15) =====
    "programmatic-seo": ("程序化 SEO", "用数据 + 模板批量生产 SEO 页面 —— 适合长尾、地点、关键词组合页。", "seo", "🔁", False),
    "seo-aeo-geo": ("AEO / GEO SEO", "面向 AI 搜索引擎、生成式搜索的优化 —— 内容结构、引用证据、Schema。", "seo", "🤖", True),
    "seo-audit-orchestration": ("SEO 审计编排", "把多个 SEO 子审计(站点健康、内容、外链、关键词)串成一个完整流程。", "seo", "🎼", False),
    "seo-backlink-audit": ("外链审计", "检查站点外链质量,识别有害链接,规划增长。", "seo", "🔗", False),
    "seo-competitor": ("SEO 竞品分析", "用 Ahrefs / SimilarWeb 拆解竞品的关键词 / 内容 / 外链策略。", "seo", "👀", False),
    "seo-content-audit": ("SEO 内容审计", "现有内容的表现拆解 + 翻新 / 删除 / 合并决策。", "seo", "📊", False),
    "seo-content-gap-audit": ("内容缺口审计", "找到竞品有 / 我们没有的高价值内容主题。", "seo", "🔍", False),
    "seo-keyword": ("关键词研究", "找值得做的关键词集合,按意图(信息 / 导航 / 交易)分桶。", "seo", "🔤", True),
    "seo-keyword-gap-audit": ("关键词缺口审计", '聚焦"竞品在排、我们未排"的关键词差异。', "seo", "🆚", False),
    "seo-offpage": ("站外 SEO", "外链 / 品牌提及 / 引用建设 —— 站外信任信号的建立。", "seo", "🌐", False),
    "seo-onpage": ("站内 SEO", "单页面优化 —— title / meta / heading / 内链 / 结构化数据。", "seo", "📃", True),
    "seo-rank-tracking": ("排名追踪", "建立排名监控系统并解读异常。", "seo", "📈", False),
    "seo-site-health-audit": ("站点健康度审计", "抓取、索引、链接、速度等基线检查。", "seo", "🩺", False),
    "seo-technical": ("技术 SEO", "Sitemap、robots、canonical、hreflang、Schema 等基础设施。", "seo", "⚙️", True),
    "seo-traffic-diagnosis": ("流量诊断", "流量异常或下滑时的根因分析流程。", "seo", "🚨", False),

    # ===== design (7) =====
    "accessibility-audit": ("可访问性审计", "WCAG 检查清单 + 修复优先级 —— 从颜色对比到键盘可达。", "design", "♿", False),
    "art-direction": ("艺术指导", "摄影 / 插画 / 视频的美学方向把控。", "design", "🎬", False),
    "design-standards": ("设计规范", "把视觉系统变成工程可用的 token + 模式。", "design", "📐", True),
    "design-system": ("设计系统", "从 token 到组件库的完整搭建。", "design", "🧱", True),
    "information-architecture": ("信息架构", "站点结构、导航、URL 模式、内容层级。", "design", "🗺️", True),
    "internationalization": ("国际化 (i18n)", "多语言、文案变量、RTL、字体、地区合规。", "design", "🌍", False),
    "media-asset-management": ("媒体资产管理", "图片 / 视频 / 字体的命名、版本、CDN 策略。", "design", "🗄️", False),

    # ===== development (12) =====
    "backup-and-disaster-recovery": ("备份与灾难恢复", "数据备份策略 + 演练 SOP —— RTO / RPO 定义、恢复测试。", "development", "💾", False),
    "code-review-web": ("Web 代码评审", "前端代码评审清单 —— 可读性、性能、安全、可访问性。", "development", "🔍", False),
    "data-warehouse-experimentation": ("数据仓库实验", "在数仓里做事件 / 实验数据建模的工程范式。", "development", "🏭", False),
    "dependency-management": ("依赖管理", "npm / pip / Go mod 依赖的版本、安全、升级策略。", "development", "📦", False),
    "experimentation-platform-orchestrator": ("实验平台编排", "把多个 A/B 平台 / 工具的实验流程串通。", "development", "🧪", False),
    "feature-flagging": ("特性开关", "把发布与上线解耦,做安全的渐进发布。", "development", "🚩", True),
    "frontend-component-build": ("前端组件构建", "组件六维 —— 解剖、变体、状态、API、a11y、测试。", "development", "🧩", True),
    "integration-orchestrator": ("集成编排", "多个 SaaS / API 的集成与状态同步。", "development", "🔌", False),
    "monitoring-and-alerting": ("监控与告警", "关键指标的可观测 + 告警阈值设计。", "development", "📡", False),
    "performance-optimization": ("性能优化", "Core Web Vitals 优化清单 —— LCP / CLS / INP 全覆盖。", "development", "⚡", True),
    "qa-testing": ("QA 测试", "功能 + 回归 + 可访问性测试矩阵。", "development", "🧪", False),
    "security-baseline": ("安全基线", "Web 应用安全的最小完整检查清单 —— OWASP Top 10 + 头部 + 密钥。", "development", "🛡️", False),

    # ===== marketing (10) =====
    "ads-creative-development": ("广告创意开发", "付费广告的视觉 / 文案 / 形式开发流程。", "marketing", "🎨", False),
    "ads-performance-analytics": ("广告绩效分析", "多渠道广告数据归集 + 决策框架。", "marketing", "📊", False),
    "beta-program-management": ("Beta 项目管理", "公开 / 邀请制内测的流程 —— 招募、节奏、反馈处理。", "marketing", "🚀", False),
    "cro-optimization": ("CRO 转化优化", "转化漏斗的实验 + 优化系统。", "marketing", "📈", True),
    "email-deliverability": ("邮件可达性", "SPF / DKIM / DMARC / 信誉评分 / 退订率 —— 把邮件送进收件箱。", "marketing", "📬", False),
    "email-sequences": ("邮件序列", "欢迎 / 复购 / 流失 / Newsletter 的内容 + 节奏。", "marketing", "✉️", False),
    "feature-launch-playbook": ("功能发布手册", "单个功能 / 模块的发布全流程。", "marketing", "📣", True),
    "launch-runbook": ("整体发布 Runbook", "重大发布前的检查清单 + 上线分钟级时间表。", "marketing", "🎬", False),
    "lead-magnet-design": ("引流诱饵设计", '表单 / 邮件订阅前的"换价值"诱饵设计。', "marketing", "🧲", False),
    "paid-media-strategy": ("付费媒体战略", "渠道选择、预算分配、归因、迭代节奏。", "marketing", "💰", False),

    # ===== operations (9) =====
    "after-action-report": ("复盘报告", "项目 / 事件结束后的事实陈述 + 教训 + 改进。", "operations", "📋", False),
    "cost-optimization": ("成本优化", "SaaS / 云 / 人力成本的盘查与降本路径。", "operations", "💸", False),
    "documentation-strategy": ("文档战略", "给什么写文档、按什么结构、谁维护。", "operations", "📚", False),
    "domain-strategy": ("域名战略", "顶级域、子域、地域、品牌防御性注册。", "operations", "🌐", False),
    "incident-response": ("事故响应", "线上事故的分级、动员、沟通、复盘 SOP。", "operations", "🚨", True),
    "skill-creation-walkthrough": ("Skill 创作流程", "如何写一份新的 Claude Skill —— 元 skill。", "operations", "🧙", False),
    "stakeholder-communication": ("利益相关方沟通", "跨部门 / 跨级别的沟通模板。", "operations", "💬", False),
    "team-onboarding-playbook": ("团队上手手册", "新成员第一天到第一个月的标准流程。", "operations", "👋", False),
    "vendor-evaluation": ("供应商评估", "选 SaaS / 服务商的评估打分框架。", "operations", "🏷️", False),

    # ===== ux-research (6) =====
    "discovery-research-synthesis": ("发现研究综合", "把访谈 / 调研数据综合成可用 insight 的方法。", "ux-research", "🧠", False),
    "journey-mapping": ("客户旅程地图", "用户在品牌 / 产品里的完整路径与触点。", "ux-research", "🗺️", False),
    "jtbd-framing": ("JTBD 框架", '"用户雇佣这个产品来完成什么工作"的研究方法。', "ux-research", "🔧", True),
    "usability-testing": ("可用性测试", "让用户实际操作并观察反应的标准方法。", "ux-research", "🧪", False),
    "user-feedback-aggregation": ("用户反馈聚合", "多渠道用户声音的整合 + 优先级排序。", "ux-research", "📥", False),
    "ux-research": ("用户研究", "5-8 个访谈 + 二手研究 + 行为分析的综合方法。", "ux-research", "🔬", True),

    # ===== product-strategy (7) =====
    "analytics-strategy": ("分析战略", "数据驱动决策的整体战略与基础设施。", "product-strategy", "📊", False),
    "experiment-design": ("实验设计", "假设、变量、样本量、显著性的实验设计方法。", "product-strategy", "🧮", False),
    "experimentation-analytics": ("实验分析", "A/B 测试结果的统计解读与决策。", "product-strategy", "📐", False),
    "okr-design": ("OKR 设计", "季度 / 年度目标的拆解与对齐。", "product-strategy", "🎯", False),
    "pm-spec-writing": ("PM Spec 撰写", "IDEA → SPEC → BRIEF → SHIP 的产品文档流程。", "product-strategy", "📝", True),
    "product-analytics-setup": ("产品分析搭建", "事件命名、漏斗、留存、付费等指标体系搭建。", "product-strategy", "📡", False),
    "roadmap-planning": ("路线图规划", "季度 / 半年 / 年度的产品路线图设计。", "product-strategy", "🗺️", False),

    # ===== interactive-patterns (12) =====
    "calculator-design": ("计算器设计", "引导输入参数 → 实时计算 → 行动的交互模式。", "interactive-patterns", "🧮", False),
    "chatbot-flow-design": ("聊天机器人流程", "对话式 UI 的状态、节点、回退、人工切换。", "interactive-patterns", "💬", False),
    "comparison-tool-design": ("对比工具设计", "多产品 / 套餐对比表格的信息架构。", "interactive-patterns", "🆚", False),
    "form-strategy": ("表单战略", "长表单 / 短表单的字段、节奏、错误处理。", "interactive-patterns", "📝", True),
    "funnel-flow-architecture": ("漏斗流程架构", "多步骤转化漏斗的页面 + 状态设计。", "interactive-patterns", "🕳️", False),
    "interactive-product-tour": ("交互式产品导览", "新用户产品功能引导。", "interactive-patterns", "👣", False),
    "multi-step-form-design": ("多步骤表单", "大型表单的分步、进度、保存设计。", "interactive-patterns", "🪜", False),
    "onboarding-wizard-design": ("引导向导", "首次使用产品的 wizard 式引导。", "interactive-patterns", "🧙", False),
    "product-configurator-design": ("产品配置器", "让用户在多变体中配置购买的交互。", "interactive-patterns", "🛠️", False),
    "quiz-and-assessment-design": ("问答 / 评测设计", "用户答题 → 个性化结果的交互。", "interactive-patterns", "❓", False),
    "scheduler-and-booking-design": ("预约与排期", "时间槽选择 + 预约确认的交互。", "interactive-patterns", "📅", False),
    "upgrade-flow-design": ("升级流程", "从免费 / 低版本到付费 / 高版本的转化交互。", "interactive-patterns", "⬆️", False),
}


def parse_frontmatter(text: str):
    """Extract frontmatter dict + body. Returns (fm_dict, body_str)."""
    m = re.match(r"^---\n(.*?)\n---\n?(.*)$", text, re.DOTALL)
    if not m:
        return {}, text
    fm_raw, body = m.group(1), m.group(2)
    fm = {}
    cur_key, cur_lines, in_multi = None, [], False
    for line in fm_raw.split("\n"):
        if not line.strip():
            continue
        kv = re.match(r"^([A-Za-z0-9_-]+):\s*(.*)$", line)
        if kv and not line.startswith("  "):
            if cur_key and in_multi:
                fm[cur_key] = "\n".join(cur_lines).strip()
            k, v = kv.group(1), kv.group(2).strip()
            if v == "|" or v == ">":
                cur_key, cur_lines, in_multi = k, [], True
            else:
                fm[k] = v
                cur_key, cur_lines, in_multi = None, [], False
        elif in_multi and (line.startswith("  ") or line.startswith("\t")):
            cur_lines.append(line.lstrip())
    if cur_key and in_multi:
        fm[cur_key] = "\n".join(cur_lines).strip()
    return fm, body.strip()


def extract_tags(fm: dict, slug: str, category: str) -> list:
    """Pull tags from original frontmatter or derive heuristically."""
    raw = fm.get("category", "") or fm.get("tags", "")
    tags = []
    if raw:
        # tokens split by space, slash, comma
        for tok in re.split(r"[\s,/]+", raw):
            tok = tok.strip("-_").lower()
            if tok and len(tok) > 2 and tok not in ("the", "and"):
                tags.append(tok)
    # also add slug tokens for searchability
    for tok in slug.split("-"):
        if len(tok) > 2 and tok not in tags:
            tags.append(tok)
    return tags[:6]


def render_md(slug: str, meta: tuple, original_text: str) -> str:
    cn_title, cn_summary, category, icon, featured = meta
    fm, body = parse_frontmatter(original_text)
    tags = extract_tags(fm, slug, category)

    # Render frontmatter
    cn_summary_escaped = cn_summary.replace('"', '\\"')
    tags_str = "[" + ", ".join(tags) + "]"
    fm_block = f"""---
title: {cn_title} / {slug.replace('-', ' ').title()}
description: |
  {cn_summary}
category: {category}
tags: {tags_str}
icon: {icon}
featured: {str(featured).lower()}
author: rampstackco
updated: 2026-05-15
source: {GITHUB_BASE}/{slug}/SKILL.md
---
"""

    # Render Chinese annotation header
    cn_block = f"""
## 这个 skill 是干什么的

> {cn_summary}

**原文档分类标签**:`{fm.get('category', 'N/A')}`

下文为完整方法论(英文原文,来自 [rampstackco/claude-skills]({GITHUB_BASE}/{slug}/SKILL.md))。
"""

    # Body separator + original
    return f"{fm_block}{cn_block}\n---\n\n{body}\n\n---\n\n**原文链接**:[{slug}]({GITHUB_BASE}/{slug}/SKILL.md)\n"


def main():
    if not SRC_ROOT.exists():
        print(f"Source root not found: {SRC_ROOT}", file=sys.stderr)
        sys.exit(1)

    DST_ROOT.mkdir(parents=True, exist_ok=True)

    written = 0
    missing = []
    unmapped = []

    src_slugs = sorted([p.name for p in SRC_ROOT.iterdir() if p.is_dir()])

    for slug in src_slugs:
        skill_md = SRC_ROOT / slug / "SKILL.md"
        if not skill_md.exists():
            missing.append(slug)
            continue

        if slug not in SKILLS:
            unmapped.append(slug)
            continue

        meta = SKILLS[slug]
        category = meta[2]
        out_dir = DST_ROOT / category
        out_dir.mkdir(parents=True, exist_ok=True)
        out_path = out_dir / f"{slug}.md"

        original = skill_md.read_text(encoding="utf-8")
        rendered = render_md(slug, meta, original)
        out_path.write_text(rendered, encoding="utf-8")
        written += 1

    # also check map has no extras
    map_only = set(SKILLS.keys()) - set(src_slugs)

    print(f"✓ Wrote {written} skill markdown files")
    print(f"  Source skills:     {len(src_slugs)}")
    print(f"  Mapped skills:     {len(SKILLS)}")
    if missing:
        print(f"  Missing SKILL.md:  {missing}")
    if unmapped:
        print(f"  Unmapped (skipped, please add to SKILLS dict):")
        for s in unmapped:
            print(f"    - {s}")
    if map_only:
        print(f"  In map but not on disk: {sorted(map_only)}")


if __name__ == "__main__":
    main()
