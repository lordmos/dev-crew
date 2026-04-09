import { resolve, dirname, join } from "node:path";
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function pkgRoot(): string {
  return resolve(__dirname, "..", "..");
}

interface AgentMeta {
  name: string;
  category: string;
  stages: string[];
  file: string;
}

export async function agentsCommand(): Promise<void> {
  const agentsDir = join(pkgRoot(), "agents");
  const files = readdirSync(agentsDir).filter(
    (f) => f.endsWith(".md") && f !== "README.md"
  );

  const agents: AgentMeta[] = files.map((file) => {
    const content = readFileSync(join(agentsDir, file), "utf-8");
    return {
      name: extractField(content, "name") ?? file.replace(".md", ""),
      category: extractField(content, "category") ?? "未分类",
      stages: extractList(content, "stages"),
      file,
    };
  });

  // Group by category
  const grouped = new Map<string, AgentMeta[]>();
  for (const agent of agents) {
    const list = grouped.get(agent.category) ?? [];
    list.push(agent);
    grouped.set(agent.category, list);
  }

  console.log(`\n🤖 DevCrew 领域专家（共 ${agents.length} 位）\n`);

  for (const [category, members] of grouped) {
    console.log(`  ${category}`);
    for (const m of members) {
      const id = m.file.replace(".md", "");
      const stages = m.stages.length > 0 ? ` [${m.stages.join(",")}]` : "";
      console.log(`    ${id}  ${m.name}${stages}`);
    }
    console.log();
  }

  console.log(`激活方式：在 devcrew.yaml 中添加 specialists 列表`);
  console.log(`  specialists:`);
  console.log(`    - ${files[0]?.replace(".md", "") ?? "agent-name"}`);
  console.log();
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
