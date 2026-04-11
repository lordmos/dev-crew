---
name: crew.checkpoint
user-invocable: true
description: Run a phase audit and consistency check on the current change. Validates all checklist items before advancing to the next PDEVI phase.
metadata:
  author: lordmos
  version: 0.5.0
---

# crew checkpoint — 阶段审计与一致性检查

## Pre-flight Check

Run the `check.sh` script in this skill's directory:

- If `STATUS: NOT_INITIALIZED` → Stop. Tell the user: "DevCrew 工作区尚未初始化，请先运行 /crew.init"
- If `STATUS: INITIALIZED` → Use the output as workspace context. Proceed below.

---

对当前活跃变更执行阶段审计，检查所有审计项是否通过，确保一致性后推进到下一阶段。

## 何时使用

- 每个 PDEVI 阶段结束时**必须执行**
- 用户说"做个检查点"、"检查一下"、"run checkpoint"
- 需要验证当前阶段的产出质量

## 使用方法

### CLI

```bash
npx @lordmos/dev-crew checkpoint [change-name]
```

不指定变更名称时，自动选择第一个活跃变更。

### MCP Tool

```
crew_checkpoint(cwd: string, change?: string)
```

## 审计清单

### Plan 阶段
- [ ] proposal.md 包含目标、需求、验收标准
- [ ] 验收标准为 checklist 格式（`- [ ]`）
- [ ] 命名一致性检查
- [ ] 用户已确认（`plan_confirmed: true`）

### Design 阶段
- [ ] design.md 引用 proposal.md（文件指针，非重复内容）
- [ ] 技术决策附带理由
- [ ] 任务分解为 checklist 格式
- [ ] 任务分解覆盖所有验收标准
- [ ] 命名与 proposal 一致

### Execute 阶段
- [ ] impl-log.md 所有任务标记 `[x]`
- [ ] 每条完成记录附带文件路径和改动摘要
- [ ] 代码改动与 design.md 任务一一对应
- [ ] 无未完成的 design.md checklist 项

### Verify 阶段
- [ ] test-report.md 逐条检查验收标准
- [ ] review-report.md 完成代码审查
- [ ] 缺陷记录附带回退建议
- [ ] 用户已确认（`verify_confirmed: true`）

## 一致性审计

除阶段审计外，还检查：
- blockers.md 是否有 `[OPEN]` 状态的阻断项
- resume.md 是否存在且格式正确
- 文件是否超过 200 行（建议拆分或使用文件指针）

## 输出

审计报告包含 `[PASS]` / `[TODO]` 标记、一致性检查结果、记忆同步提醒和下一阶段建议。
