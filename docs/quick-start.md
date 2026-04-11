# 快速开始

## 安装

```bash
npx skills add lordmos/dev-crew
```

自动将 DevCrew 协议安装到你的 AI Agent（支持 Claude Code、GitHub Copilot、Cursor、Codex 等 44+ 平台）。

> 详见 [skills.sh](https://skills.sh)

## 初始化项目

安装完成后，在 AI 对话中输入：

```
/crew.init
```

AI 会自动创建工作区：

```
your-project/
├── INSTRUCTIONS.md    ← AI 行为指令（核心文件）
├── dev-crew.yaml       ← 项目配置
└── dev-crew/
    ├── resume.md      ← 编排状态
    ├── blockers.md    ← 问题跟踪
    ├── specs/         ← 共享规约
    ├── memory/        ← Agent 长期记忆
    └── templates/     ← 文档格式模板
```

## 开始工作

初始化完成后，直接用自然语言描述需求即可。AI 会自动按 PDEVI 流程工作：

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

> 📖 下一步：阅读 [使用指南](./guide) 了解所有 Skills 和工作模式。
