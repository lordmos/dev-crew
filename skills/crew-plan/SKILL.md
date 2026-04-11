---
name: crew-plan
user-invocable: true
description: Create a new change proposal and enter the Plan phase of the PDEVI workflow. Supports Standard, Express, and Prototype modes.
metadata:
  author: lordmos
  version: 0.5.0
---

# crew plan — 创建变更计划

## Pre-flight Check

Run the `check.sh` script in this skill's directory:

- If `STATUS: NOT_INITIALIZED` → Stop. Tell the user: "DevCrew 工作区尚未初始化，请先运行 /crew.init"
- If `STATUS: INITIALIZED` → Use the output as workspace context. Proceed below.

---

创建一个新的变更（change），自动推断工作模式，进入 PDEVI 工作流的 Plan 阶段。

## 何时使用

- 用户描述了一个新需求、功能或修复
- 用户说"开始做"、"新建变更"、"create a change"
- 需要从需求→设计→实现→验证的完整流程

## 使用方法

### CLI

```bash
npx @lordmos/dev-crew plan <name> [options]
```

**参数：**

| 选项                | 说明                   | 示例                        |
| ------------------- | ---------------------- | --------------------------- |
| `<name>`            | 变更名称（kebab-case） | `add-auth-middleware`       |
| `-d, --description` | 变更描述               | `-d "为 API 添加 JWT 认证"` |
| `-m, --mode`        | 工作模式               | `-m express`                |

### MCP Tool

```
crew_plan(cwd: string, name: string, description?: string, mode?: "standard" | "express" | "prototype")
```

## 模式推断

未显式指定模式时，自动推断：

| 信号                              | 推断模式                          |
| --------------------------------- | --------------------------------- |
| 描述含 fix / bug / hotfix / patch | **Express**（P → E → V）          |
| 描述含 spike / prototype / poc    | **Prototype**（P → D → E）        |
| 其他                              | **Standard**（P → D → E → V → I） |

## 创建的文件

```
dev-crew/changes/<name>/
├── proposal.md    ← PdM 需求文档（含验收标准）
└── design.md      ← Architect 技术方案（Express 模式不创建）
```

## 下一步

Plan 创建后，PdM 填写 `proposal.md` 的需求和验收标准，等待用户确认后进入下一阶段。
