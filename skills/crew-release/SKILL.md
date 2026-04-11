---
name: crew.release
user-invocable: true
description: Archive completed changes and consolidate agent memory. Moves change artifacts to archive and updates each agent's long-term knowledge base.
metadata:
  author: lordmos
  version: 0.5.0
---

# crew release — 归档变更与记忆整合

## Pre-flight Check

Run the `check.sh` script in this skill's directory:

- If `STATUS: NOT_INITIALIZED` → Stop. Tell the user: "DevCrew 工作区尚未初始化，请先运行 /crew.init"
- If `STATUS: INITIALIZED` → Use the output as workspace context. Proceed below.

---

将已完成的变更归档，并触发各 Agent 的记忆整合——从工作记录中提炼经验，写入长期记忆文件。

## 何时使用

- 变更通过 Verify 阶段且用户确认后
- 用户说"完成了"、"归档"、"release"、"收工"
- 需要清理活跃变更列表

## 使用方法

### CLI

```bash
npx @lordmos/dev-crew release [change-name]
```

不指定名称时，归档所有已完成的变更。

### MCP Tool

```
crew_release(cwd: string, name?: string)
```

## 执行步骤

1. **归档**: 将 `dev-crew/changes/<name>/` 移动到 `dev-crew/archive/<name>/`
2. **记忆整合**: 扫描归档变更中的工作记录，为每个 Agent 更新记忆文件

### 记忆整合映射

| Agent | 记忆文件 | 提炼来源 |
|-------|---------|---------|
| PdM（产品经理） | `memory/pdm.md` | proposal.md |
| Architect（架构师） | `memory/architect.md` | design.md |
| Implementer（开发） | `memory/implementer.md` | impl-log.md |
| Tester（测试） | `memory/tester.md` | test-report.md |
| Reviewer（审查） | `memory/reviewer.md` | review-report.md |

每个 Agent 的记忆文件中追加整合条目，更新 `last_updated` 时间戳和 `changes_completed` 计数器。

## 注意事项

- 若存在 `[OPEN]` blocker，会发出警告但不阻断归档
- 归档后变更不再出现在 `crew status` 的活跃列表中
