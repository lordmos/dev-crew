# impl-log.md — Implementer 工作日志

> Execute 阶段创建。用于跨会话恢复实现进度。

```yaml
---
change: {name}
status: in_progress     # in_progress | done
tasks_total: {n}
tasks_done: {n}
---
```

## 已完成

- [x] 任务描述 → `path/to/file`（改动摘要）

## 进行中

- [ ] 任务描述 — 当前状态

## 问题与决策

- {问题描述} → {解决方案}

> 每条已完成任务必须附带文件路径和改动摘要。与 design.md 任务分解一一对应。
