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

  // Parse resume.md for per-change status from the source of truth
  const resumePath = join(crewDir, "resume.md");
  const resumeContent = existsSync(resumePath)
    ? readFileSync(resumePath, "utf-8")
    : null;
  const resumeChanges = resumeContent
    ? parseResumeChanges(resumeContent)
    : new Map<string, ResumeChangeInfo>();

  if (resumeContent) {
    details.push("=== resume.md ===");
    details.push(resumeContent.trim());
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
        const changeDir = join(changesDir, name);
        const resumeInfo = resumeChanges.get(name);

        // Phase: prefer resume.md (source of truth), fallback to file detection
        const phase = resumeInfo?.phase ?? detectPhase(changeDir);
        const mode = resumeInfo?.mode ?? extractField(changeDir, "mode") ?? "standard";

        let line = `  ${name} — 阶段: ${phase} (${mode})`;
        if (resumeInfo?.plan_confirmed) line += " [plan_confirmed]";
        if (resumeInfo?.verify_confirmed) line += " [verify_confirmed]";
        if (resumeInfo?.iterate_count && resumeInfo.iterate_count > 0) {
          line += ` [iterate: ${resumeInfo.iterate_count}]`;
        }
        if (resumeInfo?.progress) {
          line += `\n    进度: ${resumeInfo.progress}`;
        }
        details.push(line);
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

/** Detect phase from file existence in the change directory (consistent with checkpoint.ts). */
function detectPhase(changeDir: string): string {
  if (existsSync(join(changeDir, "test-report.md"))) return "Verify";
  if (existsSync(join(changeDir, "impl-log.md"))) return "Execute";
  if (existsSync(join(changeDir, "design.md"))) return "Design";
  return "Plan";
}

/** Extract a YAML frontmatter field from proposal.md in a change directory. */
function extractField(changeDir: string, field: string): string | null {
  const proposalPath = join(changeDir, "proposal.md");
  if (!existsSync(proposalPath)) return null;
  const content = readFileSync(proposalPath, "utf-8");
  const match = content.match(new RegExp(`^${field}:\\s*(.+)$`, "m"));
  return match?.[1]?.trim() ?? null;
}

interface ResumeChangeInfo {
  phase?: string;
  mode?: string;
  progress?: string;
  plan_confirmed?: boolean;
  verify_confirmed?: boolean;
  iterate_count?: number;
}

/**
 * Parse resume.md YAML frontmatter to extract per-change status.
 * resume.md is the source of truth for phase tracking (per INSTRUCTIONS.md).
 */
/** Parse resume.md YAML frontmatter active_changes with order-independent field matching. */
function parseResumeChanges(
  content: string,
): Map<string, ResumeChangeInfo> {
  const result = new Map<string, ResumeChangeInfo>();

  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) return result;
  const yaml = fmMatch[1];

  const acIdx = yaml.indexOf("active_changes:");
  if (acIdx === -1) return result;

  const lines = yaml.slice(acIdx).split("\n").slice(1);
  let currentName: string | null = null;
  let current: ResumeChangeInfo = {};

  for (const line of lines) {
    const nameMatch = line.match(/^\s*-\s*name:\s*(.+)/);
    if (nameMatch) {
      if (currentName) result.set(currentName, current);
      currentName = nameMatch[1].trim().replace(/^["']|["']$/g, "");
      current = {};
      continue;
    }

    if (current && /^\s{4,}\S/.test(line)) {
      const fieldMatch = line.match(/^\s+(\w+):\s*(.+)/);
      if (fieldMatch) {
        const [, key, rawVal] = fieldMatch;
        const v = rawVal.trim().replace(/^["']|["']$/g, "");
        switch (key) {
          case "mode": current.mode = v; break;
          case "phase": current.phase = v; break;
          case "progress": current.progress = v; break;
          case "plan_confirmed": current.plan_confirmed = v === "true"; break;
          case "verify_confirmed": current.verify_confirmed = v === "true"; break;
          case "iterate_count": current.iterate_count = parseInt(v); break;
        }
      }
      continue;
    }

    // Non-indented non-empty line = end of active_changes
    if (!/^\s/.test(line) && line.trim() !== "") break;
  }

  if (currentName) result.set(currentName, current);
  return result;
}
