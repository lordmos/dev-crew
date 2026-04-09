# 最佳实践 1: 从零构建 Todo App

> **串联场景**: 场景 1（从零开始）→ 场景 5（Bug 修复）→ 场景 7（快速原型）
> **项目故事**: 小明用 AI 从零构建一个 Todo 应用，开发中遇到 bug，后来还试了个新功能原型。

---

## 第一幕: 从零开始（场景 1，Standard 模式）

### Step 1 — 初始化

```
小明: 帮我初始化 DevCrew
```

AI 创建了这些文件：

```
project-root/
├── dev-crew.yaml
├── .gitignore            ← 追加了 dev-crew/ 排除规则
└── dev-crew/
    ├── resume.md
    ├── blockers.md
    └── changes/
```

**dev-crew.yaml**:
```yaml
project:
  name: todo-app
  description: ""
workflow:
  default_mode: standard
  concurrent_changes: true
verify:
  test_command: ""
git:
  ignore_dev_crew: true
```

### Step 2 — Plan 阶段

```
小明: 做一个 Todo 应用，支持创建、完成、删除任务，可以按标签分类
```

AI 创建了 `dev-crew/changes/todo-app-mvp/proposal.md`：

```yaml
---
mode: standard
upgraded_from: ""
plan_confirmed: false
---
```

```markdown
# 变更: todo-app-mvp

## 目标
构建一个命令行 Todo 应用，支持任务管理和标签分类。

## 需求
1. 创建任务（标题 + 可选标签）
2. 列出所有任务（支持按标签过滤）
3. 标记任务完成
4. 删除任务
5. 数据持久化（JSON 文件存储）

## 验收标准
- [ ] 可以创建带标签的任务
- [ ] 可以按标签筛选任务
- [ ] 完成/删除任务后数据正确更新
- [ ] 重启后数据不丢失
```

```
AI: 📋 以上是我整理的需求，请确认或修改。
小明: 确认
```

AI 更新 `proposal.md` frontmatter: `plan_confirmed: true`

### Step 3 — Design 阶段

AI 创建了 `dev-crew/changes/todo-app-mvp/design.md`：

```markdown
# 方案: todo-app-mvp

## 技术决策
- 语言: TypeScript (Node.js)
- 存储: JSON 文件 (~/.todo/data.json)
- CLI 框架: commander.js
- 测试: vitest

## 任务分解
- [ ] 1. 初始化项目结构 (package.json, tsconfig.json)
- [ ] 2. 实现 Todo 数据模型 (src/model.ts)
- [ ] 3. 实现存储层 (src/storage.ts)
- [ ] 4. 实现 CLI 命令 (src/cli.ts)
- [ ] 5. 编写测试 (src/__tests__/)
```

### Step 4 — Execute 阶段

AI 按任务清单逐个实现，每完成一个都汇报：

```
AI: ✅ 已完成 [1/5] 初始化项目结构
    - 创建 package.json（依赖: commander, typescript, vitest）
    - 创建 tsconfig.json
    - 创建 src/ 目录

AI: ✅ 已完成 [2/5] Todo 数据模型
    - 创建 src/model.ts（Todo 接口 + TodoList 类）

AI: ✅ 已完成 [3/5] 存储层
    - 创建 src/storage.ts（JSON 文件读写）

AI: ✅ 已完成 [4/5] CLI 命令
    - 创建 src/cli.ts（add/list/done/delete 四个子命令）

AI: ✅ 已完成 [5/5] 测试
    - 创建 src/__tests__/model.test.ts（8 个测试用例）
    - 创建 src/__tests__/storage.test.ts（4 个测试用例）
```

此时 `resume.md` YAML frontmatter：

```yaml
---
active_changes:
  - name: "todo-app-mvp"
    mode: standard
    phase: verify
    progress: "5/5"
    plan_confirmed: true
    verify_confirmed: false
    iterate_count: 0
---
```

### Step 5 — Verify 阶段

```
AI: 🔍 验证中...
    运行测试: 12 passed, 0 failed
    逐项检查验收标准:
    ✅ 可以创建带标签的任务
    ✅ 可以按标签筛选任务
    ✅ 完成/删除任务后数据正确更新
    ✅ 重启后数据不丢失
    
    全部通过。请确认验收。

小明: 确认
AI: ✅ 变更 todo-app-mvp 完成！
```

---

## 第二幕: Bug 修复（场景 5，Express 模式）

几天后，小明发现了一个 bug。

```
小明: 标签名里有空格的时候，筛选失败了。比如 "work todo" 这个标签
```

AI 自动推断 Express 模式（检测到 bug 修复任务）。

### Express 流程: Plan → Execute → Verify

AI 创建了 `dev-crew/changes/fix-tag-filter/proposal.md`：

```yaml
---
mode: express
upgraded_from: ""
plan_confirmed: false
---
```

```markdown
# 变更: fix-tag-filter

## 目标
修复标签包含空格时筛选失败的 bug。

## 需求
标签匹配应支持包含空格的标签名。

## 验收标准
- [ ] "work todo" 等含空格标签可正常筛选
- [ ] 不影响现有的标签筛选功能
```

```
AI: 📋 Express 模式，跳过 Design。确认需求？
小明: ok
```

AI 直接 Execute（没有 Design 阶段，没有 design.md）：

```
AI: ✅ 定位问题: src/cli.ts:28，标签参数按空格分割导致 "work todo" 被拆成两个标签
    ✅ 已修复 src/cli.ts:28（改用引号感知的参数解析）
    ✅ 已添加测试: src/__tests__/model.test.ts（含空格标签的测试用例）
    
    验证: 14 passed, 0 failed。请确认。

小明: 确认
AI: ✅ 变更 fix-tag-filter 完成。
```

**注意**：Express 没有创建 `design.md`，整个变更目录只有 `proposal.md` 一个文件。

---

## 第三幕: 快速原型（场景 7，Prototype 模式）

小明想试试用 TUI 界面替代命令行参数。

```
小明: 做个原型试试用 blessed 做 TUI 界面，看看交互效果
```

AI 自动推断 Prototype 模式（检测到"原型"关键词）。

### Prototype 流程: Plan → Design → Execute（无 Verify）

```yaml
# dev-crew/changes/poc-tui/proposal.md frontmatter
---
mode: prototype
upgraded_from: ""
plan_confirmed: false
---
```

```
AI: 📋 Prototype 模式，跳过 Verify/Iterate。确认需求？
小明: 确认
```

AI 做了轻量 Design + 快速 Execute：

```
AI: Design:
    - 使用 blessed 库
    - 主界面: 任务列表 + 底部命令栏
    
    Execute:
    ✅ 创建 src/tui.ts（主界面，192 行）
    ✅ 创建 src/tui-components.ts（列表组件）
    
    原型完成。运行 `npx ts-node src/tui.ts` 可体验。
    想正式做吗？
```

小明试用后觉得不错：

```
小明: 不错，正式做吧
AI: ✅ 升级为 Standard 模式。
    - 审查现有 design.md，补充键盘快捷键和错误处理
    - 进入 Verify 阶段...
```

AI 更新 `proposal.md` frontmatter: `mode: standard`, `upgraded_from: prototype`。

---

## 第四幕: 收尾归档

三个变更都完成后：

```
小明: 任务都做完了，帮我归档
AI: 📦 归档 3 个已完成变更:
    - todo-app-mvp (Standard)
    - fix-tag-filter (Express)
    - poc-tui (Prototype → Standard)
    
    已移至 dev-crew/archive/
    ✅ 归档完成。
```

---

## 整个过程文件变化总结

| 时间点 | dev-crew/ 下新增/变化的文件 |
|--------|---------------------------|
| init skill | `resume.md`, `blockers.md` |
| Plan（todo-app-mvp） | `changes/todo-app-mvp/proposal.md` |
| Design | `changes/todo-app-mvp/design.md` |
| Execute → Verify → Done | resume.md 更新 |
| Plan（fix-tag-filter） | `changes/fix-tag-filter/proposal.md`（无 design.md） |
| Execute → Verify → Done | resume.md 更新 |
| Plan（poc-tui） | `changes/poc-tui/proposal.md` |
| Design | `changes/poc-tui/design.md` |
| Execute → 升级 → Verify → Done | proposal.md 更新 mode，resume.md 更新 |
| release skill | 所有 changes/ 移至 archive/ |
