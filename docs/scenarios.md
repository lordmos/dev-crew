# 使用场景

| 场景 | 你说 | DevCrew 做 |
|------|------|------------|
| 从零开始 | "有个想法，从零构建" | 初始化 → 引导需求 → Standard |
| 已有 PRD | "需求文档在这，执行吧" | 导入 PRD → 提炼 → Standard |
| 中途接入 | "代码已有，帮我续上" | 扫描代码 → 建基线 → Standard |
| 头脑风暴 | "讨论一下方案" | `/crew:explore`（不改代码） |
| Bug 修复 | "有个 bug，快修" | Express 模式 |
| 代码重构 | "这段代码要重构" | Standard 完整流程 |
| 快速原型 | "先做个原型验证" | Prototype 模式 |
| 学习代码库 | "帮我理解这段代码" | `/crew:explore`（分析代码） |

## 从零开始

当你有一个新想法时，告诉 AI，DevCrew 会自动进入 Standard 模式：

1. **Plan** — AI 引导你梳理需求，明确验收标准
2. **Design** — 生成技术方案和任务分解
3. **Execute** — 编码实现
4. **Verify** — 自动测试和代码审查
5. **Iterate** — 问题自动修复

## Bug 修复

Bug 修复使用 Express 模式（跳过 Design）：

1. **Plan** — 定位问题，确认修复目标
2. **Execute** — 编码修复
3. **Verify** — 验证修复有效

## 快速原型

原型验证使用 Prototype 模式（跳过 Verify + Iterate）：

1. **Plan** — 明确原型目标
2. **Design** — 快速技术方案
3. **Execute** — 快速实现
