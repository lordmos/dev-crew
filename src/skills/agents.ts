import { resolve, dirname, join } from "node:path";
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { success, type SkillResult } from "./types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function pkgRoot(): string {
  return resolve(__dirname, "..", "..");
}

export function agents(): SkillResult {
  const agentsDir = join(pkgRoot(), "agents");
  const files = readdirSync(agentsDir).filter(
    (f) => f.endsWith(".md") && f !== "README.md",
  );

  const grouped = new Map<string, { id: string; name: string; stages: string[] }[]>();

  for (const file of files) {
    const content = readFileSync(join(agentsDir, file), "utf-8");
    const id = file.replace(".md", "");
    const name = extractField(content, "name") ?? id;
    const category = extractField(content, "category") ?? "未分类";
    const stages = extractList(content, "stages");

    const list = grouped.get(category) ?? [];
    list.push({ id, name, stages });
    grouped.set(category, list);
  }

  const details: string[] = [];
  for (const [category, members] of grouped) {
    details.push(category);
    for (const m of members) {
      const stages = m.stages.length > 0 ? ` [${m.stages.join(",")}]` : "";
      details.push(`  ${m.id}  ${m.name}${stages}`);
    }
  }

  return success(`共 ${files.length} 位领域专家`, details);
}

function extractField(content: string, field: string): string | undefined {
  const match = content.match(new RegExp(`^${field}:\\s*(.+)$`, "m"));
  return match?.[1]?.trim().replace(/^["']|["']$/g, "");
}

function extractList(content: string, field: string): string[] {
  const match = content.match(new RegExp(`^${field}:\\s*\\[(.+?)\\]`, "m"));
  if (!match) return [];
  return match[1].split(",").map((s) => s.trim());
}
