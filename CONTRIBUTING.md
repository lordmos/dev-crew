# 贡献指南

感谢你对 DevCrew 的兴趣！以下是参与贡献的方式。

## 当前最需要的帮助

| 类型 | 说明 |
|------|------|
| 🧪 **实测** | 把 `INSTRUCTIONS.md` 放入你的项目，验证 AI 行为是否符合预期 |
| 📝 **文档反馈** | 报告不清晰、有歧义或缺失的地方 |
| 🐛 **Bug 报告** | 发现文档矛盾或流程问题 |
| 💡 **功能建议** | 提出新场景或改进建议 |
| 🤖 **领域专家** | 贡献新的领域专家 Agent 定义 |

## 如何贡献

### 报告问题

1. 先搜索已有 Issue，避免重复
2. 创建新 Issue 时说明：
   - 使用场景
   - 期望行为 vs 实际行为
   - 使用的 AI 平台（Copilot / Claude / Cursor 等）

### 提交 PR

1. Fork 本仓库
2. 创建分支：`git checkout -b feature/your-feature`
3. 提交变更：`git commit -m "feat: 描述"`
4. 推送：`git push origin feature/your-feature`
5. 创建 Pull Request

### Commit 规范

```
feat: 新功能
fix: 修复
docs: 文档更新
refactor: 重构
test: 测试
```

## 贡献领域专家

如果你想贡献新的领域专家 Agent：

1. 参考 `agents/` 下现有专家文件的格式
2. 包含 YAML frontmatter（name / category / stages / source）
3. 定义该专家在 PDEVI 各阶段的具体贡献
4. 在 PR 中说明为什么需要这个专家

## 行为准则

- 尊重所有参与者
- 建设性地讨论和评审
- 保持友好和包容

## 项目结构

```
├── src/                ← TypeScript 源码
│   ├── cli.ts          ← CLI 入口
│   ├── mcp-server.ts   ← MCP Server 入口
│   └── skills/         ← 技能实现
│       ├── init.ts     ← 工作区初始化
│       ├── plan.ts     ← 创建变更计划
│       ├── checkpoint.ts ← 阶段审计与门禁
│       ├── status.ts   ← 工作区状态查询
│       ├── release.ts  ← 归档与记忆整合
│       ├── agents.ts   ← 领域专家列表
│       └── types.ts    ← 公共类型定义
├── templates/          ← 初始化时复制到项目的模板
│   ├── INSTRUCTIONS.md ← 核心协议文档
│   └── doc-formats/    ← 文档格式模板 (proposal/design/impl-log 等)
├── agents/             ← 领域专家定义
│   ├── README.md       ← 专家目录速查表
│   └── *.md            ← 各专家的 prompt
├── skills/             ← Skills（可通过 skills.sh 安装）
│   └── crew-*/SKILL.md ← 各 Skill 定义
├── docs/               ← VitePress 用户文档站点
├── package.json        ← 包配置与脚本
└── tsconfig.json       ← TypeScript 编译配置
```

## 许可证

本项目使用 [MIT 许可证](LICENSE)。提交 PR 即表示你同意将贡献置于相同许可证下。
