# 全链路 AI 短视频智能生产与投放平台

> `SepAIClipFlow` 是一个端到端的 AI 驱动短视频自动化工厂，旨在帮助内容创作者、运营团队和品牌方高效完成从创意构思、素材管理、智能剪辑、内容生成到巨量千川投放的全链路工作。平台通过智能体驱动，将模糊需求转化为可执行任务，并沉淀可复用的素材、脚本和成片资产，实现短视频的规模化、高质量生产与稳定投放。

## 核心功能

| 功能模块 | 说明 | 核心价值 |
|---|---|---|
| **智能体驱动工作流** | 将用户模糊需求（如“给XX类目跑5条”）逐步澄清为可执行的视频生产任务 | 降低使用门槛，引导式创作，实现“一句话指令” |
| **素材工作流** | 支持用户上传、智能联网查找或 AI 生成素材，并进行精准入库、AI 视觉打标、分类与搜索 | 建立结构化素材资产，解决素材荒，提升素材复用率 |
| **脚本工作流** | 从网络优质视频或用户上传视频反推脚本，支持手写、AI 整理、评分晋升机制（草稿/主库/拒绝） | 沉淀爆款逻辑，实现结构复用，提升内容生产效率 |
| **爬虫模块** | 集成 `yt-dlp` 和搜索引擎，支持抖音/B站内容抓取，并通过浏览器扩展回灌 | 快速获取外部优质内容，丰富素材和脚本来源 |
| **TTS 与音频拟合** | 集成 ElevenLabs 接口生成高质量语音，并支持用户音频/TTS 自动对齐到渲染产物，生成 SRT 字幕 | 提升视频听觉体验，简化后期制作，满足无障碍需求 |
| **智能渲染引擎** | 基于 `ffmpeg` 流水线，支持 `fade`/`xfade` 等多种转场效果，实现视频的自动化合成 | 自动化剪辑，提升生产效率，保证视频质量 |
| **巨量千川投放** | 支持 OAuth 授权、TOS 对象存储、投前质检和 30 秒 cron 轮询，实现自动化投放与效果监控 | 提前规避投放风险，提高过审率，优化投放效果 |
| **案例库** | 归档优质素材和成片，支持 ECP/首发标签，便于复盘与二次创作 | 资产沉淀，方便二次编辑与复盘，指导后续创作 |
| **迭代优化** | 针对投放失败素材，支持自动重生成并重投，直至达标或策略用尽 | 持续优化投放效果，降低试错成本 |

## 技术栈

本项目采用现代化的全栈技术架构，旨在提供高性能、可扩展且易于维护的短视频生产解决方案。

- **前端**: `React 19` / `Vite 7` / `Tailwind CSS 4` / `Radix UI` / `tRPC Client` / `Zod` / `Pinia` (原 README 描述为 Vue 3.5，实际代码为 React)
- **后端**: `Node.js ≥ 22` / `Express 5` / `TypeScript 6` (严格模式) / `tRPC Server` / `Drizzle ORM` / `MySQL` (原 README 描述为 better-sqlite3，实际代码为 MySQL)
- **依赖注入**: `tsyringe DI`
- **数据库**: `MySQL` (通过 Drizzle ORM 管理)
- **实时通信**: `WebSocket`
- **日志**: `Pino`
- **包管理**: `pnpm`
- **外部依赖**: `ffmpeg` (视频处理), `yt-dlp` (爬虫)
- **可选集成**: `ElevenLabs` (TTS), `Codex Relay` / `OpenAI` / `Anthropic` (AI 能力), `火山引擎 TOS` (千川投放)

## 项目结构

本项目采用 Monorepo 结构，清晰划分了客户端、服务端和共享模块，便于开发与维护。

```
.
├── client/                     # 前端应用 (React SPA)
│   ├── public/                 # 静态资源
│   ├── src/                    # 源代码
│   │   ├── components/         # UI 组件
│   │   ├── contexts/           # React Contexts
│   │   ├── hooks/              # 自定义 Hooks
│   │   ├── lib/                # 工具函数与 tRPC 客户端
│   │   └── pages/              # 页面组件
│   └── vite.config.ts          # Vite 配置
├── server/                     # 后端服务 (Node.js Express)
│   ├── _core/                  # 核心服务与工具 (tRPC, LLM, OAuth, S3等)
│   ├── drizzle/                # Drizzle ORM 数据库迁移与 Schema
│   ├── routers/                # tRPC 路由定义
│   └── index.ts                # 后端入口文件
├── shared/                     # 客户端与服务端共享代码 (类型定义、常量、错误处理)
│   ├── _core/                  # 共享核心模块
│   └── types.ts                # 共享类型定义
├── scripts/                    # 辅助脚本 (数据迁移、导入、冒烟测试)
├── package.json                # 项目依赖与脚本 (pnpm workspace)
├── tsconfig.json               # TypeScript 配置
└── ...                         # 其他配置文件 (drizzle.config.ts, vite.config.ts等)
```

## 系统要求

| 项 | 要求 |
|---|---|
| Node.js | ≥ 22 (推荐 24.x) |
| pnpm | 任意近期版本 |
| ffmpeg | 8.x (需在 PATH 中可访问，或在 config 中指定绝对路径) |
| yt-dlp | 任意近期版本 (仅爬虫功能需要) |
| 磁盘空间 | 视频素材 + MySQL 数据库，预留 5 GB+ |
| 数据目录 | `~/.clip-flow/` (首次启动自动创建) |

## 快速开始

请确保已安装 Node.js (≥ 22) 和 pnpm。

1.  **克隆仓库**

    ```bash
    git clone <your-repo-url>
    cd <your-repo-name>
    ```

2.  **安装依赖**

    ```bash
    pnpm install
    ```

3.  **配置环境变量**

    复制 `.env.example` 文件并重命名为 `.env`，然后根据需要填写 API 密钥等敏感信息。

    ```bash
    cp .env.example .env
    ```

    `.env` 示例：

    ```
    CODEX_RELAY_API_KEY=
    ELEVENLABS_API_KEY=
    ELEVENLABS_VOICE=
    QIANCHUAN_APP_ID=
    QIANCHUAN_APP_SECRET=
    QIANCHUAN_AGENT_ID=
    QIANCHUAN_ADVERTISER_ID=
    ```

4.  **数据库迁移**

    ```bash
    pnpm run db:push
    ```

5.  **启动开发服务器**

    ```bash
    # 启动后端服务 (自动热重启)
    pnpm run dev

    # 在新终端中启动前端开发服务器 (代理到后端)
    cd client && pnpm run dev
    ```

    启动后访问 **http://localhost:5173** (前端开发端口) 即可。

## 配置

用户级配置文件位于 `~/.clip-flow/config.json`。首次启动时会自动生成，默认包含 AI provider 占位 (`codex / claude / openai / custom`)、千川 OAuth 字段、TOS 字段等。此文件可由前端 **设置** 页面热修改，或直接编辑 JSON。

## WebSocket 事件

服务在 `ws://localhost:3900/ws` 广播。所有事件结构均为 `{event, data, timestamp}`。

| 命名空间 | 事件 |
|---|---|
| asset | `asset:ingested` |
| script | `script:created`, `script:scored` |
| render | `render:started`, `render:progress`, `render:completed`, `render:failed` |
| qianchuan | `qianchuan:uploaded`, `qianchuan:diagnosed`, `qc:updated` |
| case | `case:archived` |
| iterate | `iterate:started`, `iterate:progress`, `iterate:success`, `iterate:exhausted`, `iterate:failed` |
| crawl | `crawl:started`, `crawl:progress`, `crawl:completed`, `crawl:failed` |
| agent | `agent:started`, `agent:step`, `agent:completed`, `agent:failed` |

爬虫的 `crawl:progress` 携带 `{taskId, phase, total, completed, current}`，phase 取值：`research`（搜索引擎）/ `metadata`（yt-dlp 抽取元数据）/ `script`（生成脚本）/ `download`（下载素材）/ `import`。

## 关键 API

| 方法 | 路径 | 用途 |
|---|---|---|
| GET | `/api/health` | 心跳检测 |
| GET | `/api/dashboard` | 汇总：素材 / 脚本 / 渲染数据 |
| GET/POST | `/api/scripts` | 脚本列表 / 创建脚本 |
| GET | `/api/scripts/library` `/drafts` | 获取主库 / 草稿脚本 |
| POST | `/api/scripts/:id/promote` | 强制晋升脚本到主库 |
| POST | `/api/crawler/research-scripts` | 关键词搜索 + 逆向脚本 (异步，监听 WS 事件) |
| POST | `/api/crawler/import` | 给定 URL 列表导入素材 + 脚本 |
| POST | `/api/render` | 启动视频渲染任务 |
| POST | `/api/render/:id/attach-audio` | 上传音轨拟合 + 自动重提交千川 |
| GET | `/api/qc-cron/status` | 获取千川 cron 轮询状态 |
| POST | `/api/qc-cron/refresh` | 立即触发一次千川 cron 轮询 |

## 开发命令

```bash
# 类型检查
pnpm run check

# 构建后端 (输出到 dist/)
pnpm run build

# 启动后端开发服务器 (tsx 热重启)
pnpm run dev

# 启动前端开发服务器 (Vite dev server，端口 5173，代理到后端 3900)
cd client && pnpm run dev

# 运行数据库迁移
pnpm run db:push

# 格式化代码
pnpm run format

# 运行测试
pnpm run test

# 冒烟测试爬虫端到端
node scripts/smoke-crawl.mjs "美妆护肤" "紧致提拉,抗老精华"
# 实时打印 WS 事件流，并 diff 草稿/主库变化
```

## 常见问题

**Q: 端口被占用？**  
A: 后端默认端口为 3900，前端开发服务器默认端口为 5173。如果端口被占用，可以编辑 `~/.clip-flow/config.json` 的 `port` 字段修改后端端口，或检查占用进程并终止。前端端口可在 `client/vite.config.ts` 中修改。

**Q: 爬虫返回 0 个视频链接？**  
A: 搜索引擎（如 360.cn / Bing）对短时间内重复请求会触发风控。请等待几分钟后重试；若长期为 0，请尝试更换关键词或考虑接入 SerpAPI 等付费搜索服务。

**Q: AI 评分 / 整理失败？**  
A: 请检查 `~/.clip-flow/config.json` 中 `ai.providers.<x>.apiKey` 字段是否已正确配置。如果未配置 API Key，爬虫将回退使用 `heuristicScript` 模板生成（可用但质量较低）。

**Q: ffmpeg / yt-dlp 找不到？**  
A: 请确保 `ffmpeg` 和 `yt-dlp` 已安装并将其路径加入系统 PATH 环境变量中。或者，您可以在 `~/.clip-flow/config.json` 的 `media.ffmpeg_path` 字段中指定 `ffmpeg` 的绝对路径。

**Q: `better-sqlite3` 安装失败？**  
A: (此项目已切换至 MySQL，不再使用 `better-sqlite3`。如果您在其他项目中遇到此问题，通常需要 Node-gyp + Python + Visual Studio Build Tools (Windows) / build-essential (Linux) 来编译原生模块。)

## 数据流概览

```mermaid
graph TD
    A[素材入库 (assets/ingest)] --> B{AI 视觉打标 (VLM)}
    B --> C[脚本生成 (scripts/create or crawler/research)]
    C --> D{AI 评分 / 启发式}
    D --> E[自动晋升到主库 (status: active)]
    E --> F[渲染编排 (render/start)]
    F --> G{ffmpeg 流水线 + xfade 转场}
    G --> H[音频拟合 (render/:id/attach-audio)]
    H --> I{TTS 合成或用户上传}
    I --> J[巨量千川质检 (qc-cron 轮询)]
    J --> K{首发 / ECP 高质 / 低效 标签}
    K -- 失败 --> L[迭代 (iterate) 自动重生成]
    K -- 成功 --> M[案例归档 (case/archive)]
    L --> F
```

## 许可证

私有项目，未经授权禁止分发和使用。

---

*由 Manus AI 自动生成与完善。*
