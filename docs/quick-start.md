# 快速开始

## 安装

```bash
npm install -g @lordmos/dev-crew
```

> 需要 Node.js 18+

## 初始化项目

```bash
cd your-project
crew init
```

`crew init` 会创建：

```
your-project/
├── INSTRUCTIONS.md    ← AI 行为指令（核心文件）
├── dev-crew.yaml       ← 项目配置
└── dev-crew/
    ├── resume.md      ← 编排状态
    ├── blockers.md    ← 问题跟踪
    ├── specs/         ← 共享规约
    └── memory/        ← Agent 长期记忆
```

## 开始工作

打开任意 AI 对话工具（Copilot、Claude、Cursor 等），AI 会自动读取 `INSTRUCTIONS.md`，建立团队，按 PDEVI 流程协作。

```
你: 我要给 API 加认证中间件

AI: [PdM] 创建变更 add-api-auth，模式: Standard
    Plan — 需求整理:
    - 目标: 为所有 /api/ 路由添加 JWT 认证
    - 验收标准: [ ] 未携带 token 返回 401  [ ] 过期 token 返回 401
    请确认。

你: 确认

AI: Design → Execute → Verify — 全部通过。请确认验收。

你: 确认

AI: [OK] 变更 add-api-auth 完成。
```

你只需确认两次（需求 + 结果），其余全部自动。

## 查看可用专家

```bash
crew agents
```

在 `dev-crew.yaml` 中按需激活：

```yaml
specialists:
  - game-designer
  - security-engineer
```
