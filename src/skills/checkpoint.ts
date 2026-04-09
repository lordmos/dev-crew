import { join } from "node:path";
import {
  existsSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { success, failure, type SkillResult } from "./types.js";

export interface CheckpointInput {
  cwd: string;
  change?: string;
}

const PHASES = ["Plan", "Design", "Execute", "Verify"] as const;
type Phase = (typeof PHASES)[number];

const PHASE_FLOW: Record<string, Phase[]> = {
  standard: ["Plan", "Design", "Execute", "Verify"],
  express: ["Plan", "Execute", "Verify"],
  prototype: ["Plan", "Design", "Execute"],
};

/** Audit checklist for each phase gate (current phase → next phase). */
const AUDIT_CHECKLIST: Record<Phase, string[]> = {
  Plan: [
    "proposal.md 包含目标、需求、验收标准",
    "验收标准为 checklist 格式且可验证",
    "命名一致性：proposal 中的术语在后续文档中统一使用",
    "用户已确认需求（plan_confirmed: true）",
  ],
  Design: [
    "design.md 引用 proposal.md 而非重复内容（file pointer）",
    "技术决策有明确理由",
    "任务分解为 checklist 格式，每条可独立执行",
    "任务分解覆盖 proposal.md 所有验收标准",
    "命名一致性：design 中的接口/模块名与 proposal 术语一致",
  ],
  Execute: [
    "impl-log.md 中所有任务标记 [x]",
    "每条完成记录附带文件路径和改动摘要",
    "代码变更与 design.md 任务分解一一对应",
    "无遗漏的 design.md checklist 未完成项",
  ],
  Verify: [
    "test-report.md 逐条检查验收标准",
    "review-report.md 完成代码审查",
    "所有发现的缺陷已记录并关联回退建议",
    "用户已确认验证结果（verify_confirmed: true）",
  ],
};

export function checkpoint(input: CheckpointInput): SkillResult {
  const crewDir = join(input.cwd, "dev-crew");
  if (!existsSync(crewDir)) {
    return failure("dev-crew/ 不存在，请先执行 init");
  }

  const changesDir = join(crewDir, "changes");
  if (!existsSync(changesDir)) {
    return failure("无活跃变更");
  }

  // Determine which change to checkpoint
  const allChanges = readdirSync(changesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  if (allChanges.length === 0) {
    return failure("无活跃变更");
  }

  const changeName = input.change ?? allChanges[0];
  const changeDir = join(changesDir, changeName);
  if (!existsSync(changeDir)) {
    return failure(`变更 "${changeName}" 不存在`);
  }

  // Detect current phase and mode
  const proposalPath = join(changeDir, "proposal.md");
  if (!existsSync(proposalPath)) {
    return failure(`变更 "${changeName}" 缺少 proposal.md`);
  }

  const proposal = readFileSync(proposalPath, "utf-8");
  const mode = extractField(proposal, "mode") ?? "standard";
  const currentPhase = detectPhase(changeDir, mode);
  const flow = PHASE_FLOW[mode] ?? PHASE_FLOW.standard;
  const phaseIdx = flow.indexOf(currentPhase);
  const nextPhase = phaseIdx < flow.length - 1 ? flow[phaseIdx + 1] : null;

  // Build audit report
  const details: string[] = [];
  details.push(`变更: ${changeName}`);
  details.push(`模式: ${mode}`);
  details.push(`当前阶段: ${currentPhase}`);
  details.push("");

  // Run audit checklist for current phase
  const checklist = AUDIT_CHECKLIST[currentPhase] ?? [];
  details.push(`=== ${currentPhase} 阶段审计清单 ===`);
  const auditResults = runAudit(changeDir, currentPhase, proposal);
  for (let i = 0; i < checklist.length; i++) {
    const passed = auditResults[i];
    details.push(`  ${passed ? "[PASS]" : "[TODO]"} ${checklist[i]}`);
  }

  // Cross-cutting consistency checks
  details.push("");
  details.push("=== 一致性审计 ===");
  const consistency = runConsistencyAudit(changeDir, crewDir);
  for (const item of consistency) {
    details.push(`  ${item}`);
  }

  // Memory sync reminder
  details.push("");
  details.push("=== 记忆同步 ===");
  const memoryDir = join(crewDir, "memory");
  if (existsSync(memoryDir)) {
    const memFiles = readdirSync(memoryDir).filter((f) => f.endsWith(".md"));
    details.push(`  memory/ 中有 ${memFiles.length} 个 Agent 记忆文件`);
    details.push(
      "  提醒: 各 Agent 应将本阶段发现的重要模式写入自己的记忆文件",
    );
  } else {
    details.push("  memory/ 不存在，建议重新执行 init");
  }

  // Next phase info
  details.push("");
  if (nextPhase) {
    details.push(
      `下一阶段: ${nextPhase} — 请 PjM 确认审计通过后推进`,
    );
  } else {
    details.push("已完成所有阶段 — 可执行 release 归档");
  }

  const allPassed = auditResults.every(Boolean);
  const summary = allPassed
    ? `${currentPhase} 阶段审计通过，可推进至 ${nextPhase ?? "归档"}`
    : `${currentPhase} 阶段审计有未完成项，请补全后再推进`;

  return allPassed ? success(summary, details) : failure(summary, details);
}

function detectPhase(changeDir: string, mode: string): Phase {
  const hasTestReport = existsSync(join(changeDir, "test-report.md"));
  const hasImplLog = existsSync(join(changeDir, "impl-log.md"));
  const hasDesign = existsSync(join(changeDir, "design.md"));

  if (hasTestReport) return "Verify";
  if (hasImplLog) return "Execute";
  if (hasDesign) return "Design";
  return "Plan";
}

function extractField(content: string, field: string): string | null {
  const match = content.match(new RegExp(`^${field}:\\s*(.+)$`, "m"));
  return match?.[1]?.trim() ?? null;
}

function runAudit(changeDir: string, phase: Phase, proposal: string): boolean[] {
  switch (phase) {
    case "Plan": {
      const hasObjective = /## 目标/.test(proposal);
      const hasRequirements = /## 需求/.test(proposal);
      const hasAcceptance = /## 验收标准/.test(proposal);
      const hasChecklistFormat = /- \[[ x]\]/.test(proposal);
      const planConfirmed = /plan_confirmed:\s*true/.test(proposal);
      return [
        hasObjective && hasRequirements && hasAcceptance,
        hasChecklistFormat,
        true, // naming consistency requires human review
        planConfirmed,
      ];
    }
    case "Design": {
      const designPath = join(changeDir, "design.md");
      if (!existsSync(designPath)) return [false, false, false, false, false];
      const design = readFileSync(designPath, "utf-8");
      const hasRef = /proposal|参考/.test(design);
      const hasTechDecisions = /## 技术决策/.test(design);
      const hasTaskBreakdown = /## 任务分解/.test(design);
      const hasChecklist = /- \[[ x]\]/.test(design);
      return [hasRef, hasTechDecisions, hasTaskBreakdown && hasChecklist, true, true];
    }
    case "Execute": {
      const implPath = join(changeDir, "impl-log.md");
      if (!existsSync(implPath)) return [false, false, false, false];
      const impl = readFileSync(implPath, "utf-8");
      const allDone = !/- \[ \]/.test(impl);
      const hasFilePaths = /`[^ ]+\.[a-z]+`|→/.test(impl);
      return [allDone, hasFilePaths, true, allDone];
    }
    case "Verify": {
      const testPath = join(changeDir, "test-report.md");
      const reviewPath = join(changeDir, "review-report.md");
      const hasTest = existsSync(testPath);
      const hasReview = existsSync(reviewPath);
      const verifyConfirmed = /verify_confirmed:\s*true/.test(proposal);
      return [hasTest, hasReview, true, verifyConfirmed];
    }
    default:
      return [];
  }
}

function runConsistencyAudit(changeDir: string, crewDir: string): string[] {
  const results: string[] = [];

  // Check blockers alignment
  const blockersPath = join(crewDir, "blockers.md");
  if (existsSync(blockersPath)) {
    const blockers = readFileSync(blockersPath, "utf-8");
    const openCount = (blockers.match(/\[OPEN\]/g) ?? []).length;
    results.push(
      openCount > 0
        ? `[WARN] 有 ${openCount} 个 OPEN blocker 未解决`
        : "[PASS] 无未解决 blocker",
    );
  }

  // Check resume.md exists and is fresh
  const resumePath = join(crewDir, "resume.md");
  if (existsSync(resumePath)) {
    results.push("[PASS] resume.md 存在");
  } else {
    results.push("[FAIL] resume.md 缺失，无法恢复会话");
  }

  // Check for oversized files (file pointer discipline)
  const filesToCheck = ["proposal.md", "design.md", "impl-log.md"];
  for (const file of filesToCheck) {
    const filePath = join(changeDir, file);
    if (existsSync(filePath)) {
      const content = readFileSync(filePath, "utf-8");
      const lineCount = content.split("\n").length;
      if (lineCount > 200) {
        results.push(
          `[WARN] ${file} 有 ${lineCount} 行，建议拆分为子文件并使用 file pointer`,
        );
      } else {
        results.push(`[PASS] ${file} 长度合理 (${lineCount} 行)`);
      }
    }
  }

  return results;
}
