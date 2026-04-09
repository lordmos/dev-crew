import { join } from "node:path";
import {
  existsSync,
  readdirSync,
  mkdirSync,
  renameSync,
  readFileSync,
} from "node:fs";
import { success, failure, type SkillResult } from "./types.js";

export interface ReleaseInput {
  cwd: string;
  name?: string;
}

export function release(input: ReleaseInput): SkillResult {
  const crewDir = join(input.cwd, "dev-crew");
  if (!existsSync(crewDir)) {
    return failure("dev-crew/ 不存在，请先执行 init");
  }

  const changesDir = join(crewDir, "changes");
  if (!existsSync(changesDir)) {
    return failure("无变更可归档");
  }

  const archiveDir = join(crewDir, "archive");

  // Determine which changes to archive
  const allChanges = readdirSync(changesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  if (allChanges.length === 0) {
    return failure("无变更可归档");
  }

  const toArchive = input.name
    ? allChanges.filter((c) => c === input.name)
    : allChanges;

  if (toArchive.length === 0) {
    return failure(`变更 "${input.name}" 不存在`);
  }

  // Check for open blockers
  const warnings: string[] = [];
  const blockersPath = join(crewDir, "blockers.md");
  if (existsSync(blockersPath)) {
    const blockers = readFileSync(blockersPath, "utf-8");
    const openCount = (blockers.match(/\[OPEN\]/g) ?? []).length;
    if (openCount > 0) {
      warnings.push(`警告: 有 ${openCount} 个未解决的 blocker`);
    }
  }

  // Archive
  if (!existsSync(archiveDir)) {
    mkdirSync(archiveDir, { recursive: true });
  }

  const archived: string[] = [];
  for (const name of toArchive) {
    const src = join(changesDir, name);
    const dest = join(archiveDir, name);
    if (existsSync(dest)) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      renameSync(src, join(archiveDir, `${name}_${timestamp}`));
    } else {
      renameSync(src, dest);
    }
    archived.push(name);
  }

  const details = [
    ...warnings,
    ...archived.map((n) => `归档: ${n}`),
    "请各 Agent 执行记忆整合，将经验写入 memory/*.md",
  ];

  return success(`已归档 ${archived.length} 个变更`, details);
}
