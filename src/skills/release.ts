import { join } from "node:path";
import {
  existsSync,
  readdirSync,
  mkdirSync,
  renameSync,
  readFileSync,
  writeFileSync,
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

  // Memory consolidation: update per-agent memory files
  const memoryDetails = consolidateMemory(crewDir, toArchive);

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
    "",
    "=== 记忆整合 ===",
    ...memoryDetails,
  ];

  return success(`已归档 ${archived.length} 个变更，记忆已整合`, details);
}

/** Update each agent's memory file with a consolidation entry for archived changes. */
function consolidateMemory(crewDir: string, changeNames: string[]): string[] {
  const memoryDir = join(crewDir, "memory");
  if (!existsSync(memoryDir)) {
    mkdirSync(memoryDir, { recursive: true });
  }

  const details: string[] = [];
  const now = new Date().toISOString();
  const changesDir = join(crewDir, "changes");

  // Map agent names to their work record files
  const agentFiles: Record<string, { memFile: string; workFiles: string[] }> = {
    "产品经理": { memFile: "pdm.md", workFiles: ["proposal.md"] },
    "架构师": { memFile: "architect.md", workFiles: ["design.md"] },
    "开发": { memFile: "implementer.md", workFiles: ["impl-log.md"] },
    "测试": { memFile: "tester.md", workFiles: ["test-report.md"] },
    "审查": { memFile: "reviewer.md", workFiles: ["review-report.md"] },
  };

  for (const [agentLabel, config] of Object.entries(agentFiles)) {
    const memPath = join(memoryDir, config.memFile);

    // Collect summaries from work records
    const entries: string[] = [];
    for (const changeName of changeNames) {
      for (const workFile of config.workFiles) {
        const workPath = join(changesDir, changeName, workFile);
        if (existsSync(workPath)) {
          const content = readFileSync(workPath, "utf-8");
          const lineCount = content.split("\n").length;
          entries.push(
            `- 变更 \`${changeName}\`: ${workFile} (${lineCount} 行) — ${agentLabel}已处理`,
          );
        }
      }
    }

    if (entries.length === 0) continue;

    // Read existing memory or create new
    let memory: string;
    if (existsSync(memPath)) {
      memory = readFileSync(memPath, "utf-8");
      // Update last_updated and increment changes_completed
      memory = memory.replace(
        /last_updated:\s*.+/,
        `last_updated: ${now}`,
      );
      memory = memory.replace(
        /changes_completed:\s*(\d+)/,
        (_match, count) => `changes_completed: ${parseInt(count) + changeNames.length}`,
      );
    } else {
      memory = `---
agent: ${agentLabel}
last_updated: ${now}
changes_completed: ${changeNames.length}
---
## 项目认知

（随变更积累更新）

## 经验库

（从历史变更中提炼的模式、规则、教训）

## 工作偏好

（用户偏好、团队约定、特殊规则）
`;
    }

    // Append consolidation log to 经验库
    const consolidationEntry = `\n### ${now.split("T")[0]} 归档记录\n\n${entries.join("\n")}\n`;
    const expIdx = memory.indexOf("## 经验库");
    if (expIdx !== -1) {
      const nextSection = memory.indexOf("\n## ", expIdx + 1);
      const insertPos = nextSection !== -1 ? nextSection : memory.length;
      memory =
        memory.slice(0, insertPos) + "\n" + consolidationEntry + memory.slice(insertPos);
    } else {
      memory += "\n## 经验库\n" + consolidationEntry;
    }

    writeFileSync(memPath, memory);
    details.push(`  更新 memory/${config.memFile} (+${entries.length} 条记录)`);
  }

  if (details.length === 0) {
    details.push("  无 Agent 工作记录需要整合");
  }

  return details;
}
