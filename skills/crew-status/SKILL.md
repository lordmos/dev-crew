---
name: crew-status
user-invocable: true
description: View current DevCrew workspace status — active changes, current phase, progress, and open blockers.
metadata:
  author: lordmos
  version: 0.5.0
---

# crew status — 查看工作区状态

## Pre-flight Check

Run the `check.sh` script in this skill's directory:

- If `STATUS: NOT_INITIALIZED` → Stop. Tell the user: "DevCrew 工作区尚未初始化，请先运行 /crew-init"
- If `STATUS: INITIALIZED` → Use the output as workspace context. Proceed below.

---

展示当前 DevCrew 工作区的概览：活跃变更、各变更所处阶段、进度和待解决的 blocker。

## 何时使用

- 用户说"看看进度"、"什么状态"、"show status"
- 新会话开始时恢复上下文
- 需要了解当前有哪些活跃变更

## 使用方法

### CLI

```bash
npx @lordmos/dev-crew status
```

### MCP Tool

```
crew_status(cwd: string)
```

## 输出内容

- `resume.md` 中的编排状态摘要
- 每个活跃变更的名称和当前阶段（Plan/Design/Execute/Verify）
- 打开的 blocker 数量

## 阶段判定逻辑

根据变更目录中的文件存在性判定当前阶段：

```
test-report.md 存在 → Verify
impl-log.md 存在   → Execute
design.md 存在     → Design
仅 proposal.md     → Plan
```
