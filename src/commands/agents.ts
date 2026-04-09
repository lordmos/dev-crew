import { agents } from "../skills/agents.js";

export async function agentsCommand(): Promise<void> {
  const result = agents();

  console.log(`\n🤖 DevCrew 领域专家（${result.summary}）\n`);
  for (const line of result.details) {
    console.log(`  ${line}`);
  }
  console.log(`\n激活方式：在 dev-crew.yaml 中添加 specialists 列表`);
  console.log(`  specialists:`);
  console.log(`    - security-engineer`);
  console.log();
}
