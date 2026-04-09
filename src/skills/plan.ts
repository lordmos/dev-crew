import { join } from "node:path";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { success, failure, type SkillResult } from "./types.js";

export interface PlanInput {
  cwd: string;
  name: string;
  description?: string;
  mode?: "standard" | "express" | "prototype";
}

export function plan(input: PlanInput): SkillResult {
  const crewDir = join(input.cwd, "dev-crew");
  if (!existsSync(crewDir)) {
    return failure("dev-crew/ 不存在，请先执行 init");
  }

  const changesDir = join(crewDir, "changes");
  if (!existsSync(changesDir)) {
    mkdirSync(changesDir, { recursive: true });
  }

  const changeDir = join(changesDir, input.name);
  if (existsSync(changeDir)) {
    return failure(`变更 "${input.name}" 已存在`, [
      "如需恢复，请检查 dev-crew/changes/" + input.name,
      "如需新建，请使用不同名称",
    ]);
  }

  const mode = input.mode ?? inferMode(input.name, input.description);
  mkdirSync(changeDir, { recursive: true });

  const proposalContent = `---
name: ${input.name}
mode: ${mode}
stage: Plan
---

# ${input.name}

## 需求概述

${input.description ?? "（待填写）"}

## 验收标准

- [ ] （待定义）
`;

  writeFileSync(join(changeDir, "proposal.md"), proposalContent);

  const details = [
    `创建 dev-crew/changes/${input.name}/proposal.md`,
    `模式: ${mode}`,
    "阶段: Plan",
  ];

  if (mode !== "express") {
    writeFileSync(
      join(changeDir, "design.md"),
      `---
change: ${input.name}
---

# 设计文档

（Architect 在 Design 阶段填写）
`,
    );
    details.push(`创建 dev-crew/changes/${input.name}/design.md`);
  }

  return success(`变更 "${input.name}" 已创建 (${mode})`, details);
}

function inferMode(
  name: string,
  description?: string,
): "standard" | "express" | "prototype" {
  const text = `${name} ${description ?? ""}`.toLowerCase();
  if (/fix|bug|hotfix|patch/.test(text)) return "express";
  if (/spike|prototype|poc/.test(text)) return "prototype";
  return "standard";
}
