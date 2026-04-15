---
name: crew.agents
user-invocable: true
description: List available domain specialists that can be activated for the DevCrew team — covering game dev, security, DevOps, AI/ML, and more.
metadata:
  author: lordmos
  version: 0.5.1
---

# crew agents — 列出可用领域专家

## Pre-flight Check

Run the `check.sh` script in this skill's directory:

- If `STATUS: NOT_INITIALIZED` → Stop. Tell the user: "DevCrew 工作区尚未初始化，请先运行 /crew.init"
- If `STATUS: INITIALIZED` → Use the output as workspace context. Proceed below.

---

查看所有可用的领域专家（Domain Specialists），了解每位专家的名称、所属领域和适用的 PDEVI 阶段。

## 何时使用

- 用户问"有哪些专家"、"list agents"、"谁能帮忙"
- 需要为特定领域（如安全、游戏开发）激活专家
- 配置 `dev-crew.yaml` 前了解选项

## 使用方法

### CLI

```bash
npx @lordmos/dev-crew agents
```

### MCP Tool

```
crew_agents()
```

## 输出内容

按领域分组展示所有可用专家：

- **专家 ID**：用于 `dev-crew.yaml` 配置
- **专家名称**：角色描述
- **适用阶段**：在 PDEVI 的哪些阶段参与

## 激活专家

在 `dev-crew.yaml` 中添加专家 ID：

```yaml
specialists:
  - game-designer
  - security-engineer
  - devops-engineer
```

激活后，PjM 会在对应 PDEVI 阶段自动调度专家参与协作。

## 可用领域

> 游戏开发（8）· UI/UX（3）· 安全（1）· DevOps（3）· 测试（3）· 工程（5）· 数据（2）· AI/ML（1）· Web3（1）· 空间计算（2）

共 **29 位领域专家**覆盖 10 个领域。
