import { init, type Platform } from "../skills/init.js";

interface InitOptions {
  name?: string;
  platform?: string[];
  gitignore: boolean;
}

const VALID_PLATFORMS = ["copilot", "cursor", "claude"] as const;

export async function initCommand(options: InitOptions): Promise<void> {
  console.log("\n🚀 DevCrew 初始化\n");

  // Validate platform values
  const platforms: Platform[] = [];
  if (options.platform) {
    for (const p of options.platform) {
      if (!VALID_PLATFORMS.includes(p as Platform)) {
        console.error(`❌ 不支持的平台: ${p}`);
        console.error(`   支持: ${VALID_PLATFORMS.join(", ")}`);
        process.exitCode = 1;
        return;
      }
      platforms.push(p as Platform);
    }
  }

  const result = init({
    cwd: process.cwd(),
    name: options.name,
    platform: platforms.length > 0 ? platforms : undefined,
    gitignore: options.gitignore,
  });

  for (const line of result.details) {
    console.log(`  ${line}`);
  }

  if (result.ok) {
    const platformHint = platforms.length > 0
      ? `   AI 平台: ${platforms.join(", ")} — 指令文件已就位，AI 将自动读取`
      : `   提示: 使用 --platform copilot|cursor|claude 自动配置 AI 平台`;

    console.log(`
✅ ${result.summary}

📂 项目结构:
   INSTRUCTIONS.md          ← AI 行为指令（核心文件）
   dev-crew.yaml            ← 项目配置（入库）
   dev-crew/
   ├── resume.md            ← PjM 编排状态
   ├── blockers.md          ← 问题与决策
   ├── templates/           ← 文档格式模板（Agent 按需读取）
   ├── specs/               ← 共享规约（入库）
   └── memory/              ← Agent 长期记忆（自动维护）

${platformHint}

🎬 下一步:
   告诉 AI 你想做什么，它会自动创建变更计划并引导你
`);
  } else {
    console.error(`\n❌ ${result.summary}`);
    process.exitCode = 1;
  }
}
