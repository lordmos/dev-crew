import { init } from "../skills/init.js";

interface InitOptions {
  name?: string;
  gitignore: boolean;
}

export async function initCommand(options: InitOptions): Promise<void> {
  console.log("\n🚀 DevCrew 初始化\n");

  const result = init({
    cwd: process.cwd(),
    name: options.name,
    gitignore: options.gitignore,
  });

  for (const line of result.details) {
    console.log(`  ${line}`);
  }

  if (result.ok) {
    console.log(`
✅ ${result.summary}

📂 项目结构:
   INSTRUCTIONS.md          ← AI 行为指令（核心文件）
   dev-crew.yaml            ← 项目配置（入库）
   dev-crew/
   ├── resume.md            ← PjM 编排状态
   ├── blockers.md          ← 问题与决策
   ├── specs/               ← 共享规约（入库）
   └── memory/              ← Agent 长期记忆（自动维护）

🎬 下一步:
   告诉 AI 你想做什么，它会自动创建变更计划并引导你
`);
  } else {
    console.error(`\n❌ ${result.summary}`);
    process.exitCode = 1;
  }
}
