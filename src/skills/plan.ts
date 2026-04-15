import { join } from "node:path";
import { existsSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
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

  // Validate name: must be kebab-case, no path traversal
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.name)) {
    return failure(`变更名称 "${input.name}" 无效`, [
      "名称仅允许小写字母、数字和连字符（kebab-case）",
      "示例: add-login, fix-nav-bug, redesign-dashboard",
    ]);
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
mode: ${mode}
plan_confirmed: false
---

# ${input.name}

## 目标

${input.description ?? "（待填写）"}

## 需求

（待细化）

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
      `# 设计文档

（Architect 在 Design 阶段填写）
`,
    );
    details.push(`创建 dev-crew/changes/${input.name}/design.md`);
  }

  // Sync resume.md with new change
  const resumePath = join(crewDir, "resume.md");
  if (existsSync(resumePath)) {
    let resume = readFileSync(resumePath, "utf-8");
    const entry = [
      `  - name: ${input.name}`,
      `    mode: ${mode}`,
      `    phase: Plan`,
      `    plan_confirmed: false`,
      `    iterate_count: 0`,
    ].join("\n");

    if (/active_changes:\s*\[\]/.test(resume)) {
      resume = resume.replace(/active_changes:\s*\[\]/, `active_changes:\n${entry}`);
    } else if (/active_changes:/.test(resume)) {
      const fmEnd = resume.indexOf("\n---", 4);
      if (fmEnd !== -1) {
        resume = resume.slice(0, fmEnd) + "\n" + entry + resume.slice(fmEnd);
      }
    }
    writeFileSync(resumePath, resume);
    details.push("更新 dev-crew/resume.md");
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
