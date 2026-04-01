# Allpause 全案营销系统 - 设计头脑风暴

## 项目背景
全案营销闭环平台前期模块，覆盖"客户尽调 → 行业诊断 → 定制全案方案 → 签约定价"完整链路。目标用户为销售、策略顾问、方案经理、审批人和管理层。属于 B2B SaaS 后台管理系统。

---

<response>
<text>
## 方案一：Corporate Brutalism（企业新粗野主义）

**Design Movement**: 新粗野主义 + 瑞士国际主义
**Core Principles**:
1. 信息密度优先：大量数据在一屏内高效呈现
2. 结构即装饰：用网格线、分割线和色块本身构成视觉节奏
3. 功能至上：每一个像素都有信息目的

**Color Philosophy**: 以纯白 #FFFFFF 为底，深炭黑 #1A1A1A 为主文字，使用单一强调色 #FF4D00（工业橙）标记关键动作和风险。灰阶梯度 #F5F5F5 → #E0E0E0 → #999 构成层级。

**Layout Paradigm**: 严格的 12 列网格，左侧固定 240px 导航栏，内容区采用报纸式多栏布局，信息卡片紧密排列无间距。

**Signature Elements**:
1. 粗黑边框（2px solid black）包裹所有卡片
2. 全大写字母标题配合超细体正文形成张力
3. 状态指示使用纯色色块而非圆角标签

**Interaction Philosophy**: 点击即响应，无过渡动画，状态切换瞬间完成。悬停时边框加粗而非变色。

**Animation**: 无动画。页面切换使用硬切。唯一的动态元素是数据加载时的脉冲线。

**Typography System**: Geist Mono 用于标题和数据，Geist Sans 用于正文。标题 32px/700，正文 14px/400。
</text>
<probability>0.05</probability>
</response>

<response>
<text>
## 方案二：Soft Industrial（柔性工业风）

**Design Movement**: 包豪斯功能主义 + 北欧极简
**Core Principles**:
1. 清晰的信息层级：通过留白和字重建立视觉优先级
2. 温暖的专业感：避免冰冷的纯白纯黑，使用暖灰和米色调
3. 流程可视化：将业务链路转化为可交互的视觉流

**Color Philosophy**: 暖灰底色 #F8F6F3，深棕文字 #2C2520，主色调为深青 #1B6B5A（代表专业和信任），辅助色 #D4A853（暖金，用于进度和成功状态），警示色 #C45D3E。整体传递"值得信赖的顾问"气质。

**Layout Paradigm**: 左侧 260px 侧边栏采用卡片式导航，内容区使用非对称两栏（主内容 65% + 上下文面板 35%），关键页面使用三栏布局（导航 + 内容 + 实时摘要）。

**Signature Elements**:
1. 圆角卡片（12px）配合 1px 细边框和微妙的内阴影
2. 阶段进度条使用连续色带而非离散节点
3. 右侧浮动的"实时洞察"面板，随内容变化动态更新

**Interaction Philosophy**: 所有交互都有轻柔反馈。表单保存时卡片边框短暂变为主色调。审批动作使用确认抽屉而非弹窗。

**Animation**: 页面切换使用 300ms ease-out 淡入。卡片进入使用 stagger 效果（每张延迟 50ms）。数字变化使用计数动画。侧边栏折叠使用弹簧动画。

**Typography System**: DM Sans 用于标题（600/700），Inter 用于正文（400/500）。标题 28px，副标题 18px，正文 14px，辅助文字 12px。行高统一 1.6。
</text>
<probability>0.08</probability>
</response>

<response>
<text>
## 方案三：Dark Command Center（深色指挥中心）

**Design Movement**: 数据仪表盘美学 + 军事指挥系统
**Core Principles**:
1. 沉浸式数据环境：深色背景让数据和状态指示灯成为焦点
2. 态势感知：一屏内同时展示全局状态和局部细节
3. 操作效率：键盘快捷键 + 命令面板驱动

**Color Philosophy**: 深蓝黑底 #0F1419，卡片背景 #1C2430，文字 #E8ECF1。主色调 #3B82F6（信号蓝），成功 #10B981（翠绿），警告 #F59E0B（琥珀），危险 #EF4444。所有颜色都带有微弱的发光效果。

**Layout Paradigm**: 全屏无边距布局，左侧 56px 图标导航栏（可展开至 240px），内容区使用可拖拽的面板系统，用户可自定义布局。

**Signature Elements**:
1. 卡片使用 1px 半透明边框 + 微弱的内发光
2. 状态指示使用带脉冲动画的圆点
3. 数据变化时使用闪烁高亮效果

**Interaction Philosophy**: 高效操作导向。Cmd+K 打开命令面板。右键上下文菜单。拖拽排序。双击编辑。

**Animation**: 元素进入使用 200ms 淡入+上移。状态变化使用 150ms 色彩过渡。加载使用骨架屏 + 脉冲。面板切换使用滑动。

**Typography System**: JetBrains Mono 用于数据和编号，Inter 用于正文。标题 24px/600，正文 13px/400。数据数字使用等宽字体。
</text>
<probability>0.07</probability>
</response>
