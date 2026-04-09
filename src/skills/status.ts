import { join } from "node:path";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { success, failure, type SkillResult } from "./types.js";

export interface StatusInput {
  cwd: string;
}

export function status(input: StatusInput): SkillResult {
  const crewDir = join(input.cwd, "dev-crew");
  if (!existsSync(crewDir)) {
    return failure("dev-crew/ 不存在，请先执行 init");
  }

  const details: string[] = [];

  // Read resume.md
  const resumePath = join(crewDir, "resume.md");
  if (existsSync(resumePath)) {
    const resume = readFileSync(resumePath, "utf-8");
    details.push("=== resume.md ===");
    details.push(resume.trim());
  }

  // List active changes
  const changesDir = join(crewDir, "changes");
  if (existsSync(changesDir)) {
    const changes = readdirSync(changesDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);

    if (changes.length > 0) {
      details.push(`\n=== 活跃变更 (${changes.length}) ===`);
      for (const name of changes) {
        const proposalPath = join(changesDir, name, "proposal.md");
        const stage = existsSync(proposalPath)
          ? extractStage(readFileSync(proposalPath, "utf-8"))
          : "unknown";
        details.push(`  ${name} — 阶段: ${stage}`);
      }
    } else {
      details.push("\n无活跃变更");
    }
  }

  // Read blockers
  const blockersPath = join(crewDir, "blockers.md");
  if (existsSync(blockersPath)) {
    const blockers = readFileSync(blockersPath, "utf-8");
    const openCount = (blockers.match(/\[OPEN\]/g) ?? []).length;
    if (openCount > 0) {
      details.push(`\n=== Blockers (${openCount} OPEN) ===`);
      details.push(blockers.trim());
    }
  }

  return success("工作区状态", details);
}

function extractStage(content: string): string {
  const match = content.match(/^stage:\s*(.+)$/m);
  return match?.[1]?.trim() ?? "Plan";
}
