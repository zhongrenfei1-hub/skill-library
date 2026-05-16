import { Link } from 'react-router-dom';

export default function Philosophy() {
  return (
    <div className="container-prose py-16 md:py-24">
      <span className="eyebrow">设计 · Philosophy</span>
      <h1 className="mt-4 text-4xl md:text-6xl font-serif font-medium leading-tight">
        布局哲学
      </h1>
      <p className="mt-6 text-xl text-ink-soft leading-relaxed">
        这不是一份"我们用了 Tailwind"的技术说明。是关于
        <strong className="text-ink">为什么页面长这样、为什么不长成那样</strong>的几条原则。
      </p>

      <Section number="01" title="给一份长内容,而不是一组卡片">
        <p>
          这是一个 skill 资料库,不是 prompt 商店。
          一份 skill 是一段写下来的思考,通常 1000-3000 字。
        </p>
        <p>
          所以我们的页面是为<strong className="text-ink">"读得下去"</strong>设计的,
          不是为"逛得过来"设计。这意味着:大段留白、680px 文字栏、衬线长标题、超长行高、
          没有侧栏推荐你"接下来读什么"。
        </p>
        <p>
          逛得过来的是分类页。读得下去的是单页。两种节奏,不混在一起。
        </p>
      </Section>

      <Section number="02" title="安静比响亮重要">
        <p>
          没有渐变背景、没有 floating 卡片、没有 hover 浮起、没有 emoji 当装饰。
        </p>
        <p>
          全站只用三种"声调":<br/>
          —— 墨色文字(承担信息)<br/>
          —— 鞍棕强调(承担方向)<br/>
          —— 大量留白(承担情绪)
        </p>
        <p>
          唯一允许"响"的地方:产品编号的衬线数字、首页 Hero 的衬线大标。
          这些是品牌的视觉钩子,不是装饰。
        </p>
      </Section>

      <Section number="03" title="数字也是字体">
        <p>
          编号 <span className="numeral text-clay text-2xl">#003</span> 不是文本,是版式元素。
          用 Cormorant Garamond,字距加宽,大字号摆在卡片角落作为锚点。
        </p>
        <p>
          这一条直接借鉴自纸质杂志的设计 ——
          页码、章节号、年份在书籍里是审美元素,不是 metadata。
          网页应该把这个传统拿回来。
        </p>
      </Section>

      <Section number="04" title="不为商家的编辑面板让步">
        <p>
          很多 Shopify / WordPress 主题为了让商家在后台"自由配置",把每一个色、每一行字都暴露。
          结果是<strong className="text-ink">商家越改越丑</strong>。
        </p>
        <p>
          这个站点反过来。
          <code className="text-xs bg-cream-200 px-1 rounded mx-1">settings_schema.json</code>
          只暴露 5 个值:Logo、Hero 标题、Hero 副标、ICP 备案、Footer 文案。
          其余全部由设计系统硬决定。
        </p>
        <p>
          自由是后果,不是手段。
        </p>
      </Section>

      <Section number="05" title="一份 markdown,一个 skill">
        <p>
          为什么是 markdown 不是 CMS?因为 markdown 是
          <strong className="text-ink">version-controlable、locally-editable、AI-readable</strong>。
        </p>
        <p>
          你写一份 skill,git commit,Actions 自动重建并发布。
          没有 admin 登录,没有富文本编辑器,没有"草稿暂存中..."的转圈。
        </p>
        <p>
          唯一的"后台"是
          <Link to="/local" className="link">本地工作区</Link> ——
          可以拖一份 markdown 进来即时预览,但<em>不能</em>从这里直接发布。
          发布必须经过 commit。这条边界是故意的。
        </p>
      </Section>

      <Section number="06" title="对动效的克制">
        <p>
          整个站点只有一个动画:页面加载时的 300ms 上滑淡入。
        </p>
        <p>
          没有 scroll-triggered 动画、没有 parallax、没有 reveal-on-scroll。
          内容是主角。动画无论多优雅,都会偷走读者本来已经稀薄的注意力。
        </p>
      </Section>

      <Section number="07" title="可访问性 = 文明">
        <p>
          所有文字 / 底色组合通过 WCAG AA 对比度。
          所有交互可用键盘到达。所有图片有 alt。
        </p>
        <p>
          这不是"加分项"。这是基础。
          一个不能被屏幕阅读器 / 键盘 / 色弱用户使用的设计,无论多好看,都没完成。
        </p>
      </Section>

      <Section number="08" title="留白是产品的一部分">
        <p>
          Section 之间的 8rem 不是"美观"。
          是为了让读者读完一段后有视觉上的"换气位"。
        </p>
        <p>
          屏幕越小,情绪空间越紧。移动端把 8rem 压到 4rem 是底线,再小就开始挤压认知。
        </p>
      </Section>

      <hr className="my-16 border-ink-line" />

      <p className="text-sm text-ink-mute">
        这套哲学会演化。如果有一条变得不诚实,这页会重写。
        最后更新:2026-05-16。
      </p>
    </div>
  );
}

function Section({ number, title, children }) {
  return (
    <section className="mt-20">
      <div className="flex items-baseline gap-4 mb-6">
        <span className="numeral text-2xl md:text-3xl text-clay">{number}</span>
        <h2 className="text-2xl md:text-3xl font-serif font-medium">{title}</h2>
      </div>
      <div className="prose-skill">{children}</div>
    </section>
  );
}
