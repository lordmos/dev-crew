# test-report.md — Tester 验证报告

> Verify 阶段创建。用于跨会话恢复验证进度，也是 Iterate 回退的依据。

```yaml
---
change: {name}
verdict: in_progress    # pass | fail | in_progress
iterate_round: 0
---
```

## 验收标准检查

- [x] 标准描述 — 通过
- [!] 标准描述 — 失败原因

## 测试执行

{命令、输出摘要、覆盖率}

## 发现的缺陷

- {缺陷描述} → 建议回退 Design / Execute
