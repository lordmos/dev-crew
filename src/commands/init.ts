import { resolve, join, dirname } from "node:path";
import { existsSync, mkdirSync, writeFileSync, readFileSync, appendFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** Resolve path relative to the package root (where templates/ and agents/ live). */
function pkgRoot(): string {
  // dist/commands/init.js → package root is ../../
  return resolve(__dirname, "..", "..");
}

interface InitOptions {
  name?: string;
  gitignore: boolean;
}

export async function initCommand(options: InitOptions): Promise<void> {
  const cwd = process.cwd();
  const projectName = options.name ?? inferProjectName(cwd);

  console.log(`\n🚀 DevCrew 初始化: ${projectName}\n`);

  // 1. Create devcrew/ directory
  const crewDir = join(cwd, "devcrew");
  if (existsSync(crewDir)) {
    console.log("⚠️  devcrew/ 已存在，跳过目录创建");
  } else {
    mkdirSync(crewDir, { recursive: true });
    console.log("📁 创建 devcrew/");
  }

  // 2. Copy INSTRUCTIONS.md to project root
  const instrDest = join(cwd, "INSTRUCTIONS.md");
  if (existsSync(instrDest)) {
    console.log("⚠️  INSTRUCTIONS.md 已存在，跳过");
  } else {
    const instrSrc = join(pkgRoot(), "templates", "INSTRUCTIONS.md");
    const content = readFileSync(instrSrc, "utf-8");
    writeFileSync(instrDest, content);
    console.log("📄 创建 INSTRUCTIONS.md（AI 行为指令）");
  }

  // 3. Generate devcrew.yaml at project root
  const yamlDest = join(cwd, "devcrew.yaml");
  if (existsSync(yamlDest)) {
    console.log("⚠️  devcrew.yaml 已存在，跳过");
  } else {
    const yamlContent = generateYaml(projectName);
    writeFileSync(yamlDest, yamlContent);
    console.log("⚙️  创建 devcrew.yaml（项目配置）");
  }

  // 4. Create specs/ directory
  const specsDir = join(crewDir, "specs");
  if (!existsSync(specsDir)) {
    mkdirSync(specsDir, { recursive: true });
    console.log("📁 创建 devcrew/specs/");
  }

  // 5. Add .gitignore rules
  if (options.gitignore) {
    appendGitignore(cwd);
  }

  // Done
  console.log(`
✅ 初始化完成！

📂 项目结构:
   INSTRUCTIONS.md          ← AI 行为指令（核心文件）
   devcrew.yaml             ← 项目配置（入库）
   devcrew/
   └── specs/               ← 共享规约（入库）

🎬 下一步:
   打开 AI 对话，输入 /crew:plan <变更名称> 开始工作
   或者直接说 "我要做一个新功能" — AI 会自动引导你
`);
}

function inferProjectName(dir: string): string {
  // Try package.json
  const pkgPath = join(dir, "package.json");
  if (existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
      if (pkg.name) return pkg.name;
    } catch { /* ignore */ }
  }
  // Fallback to directory name
  return dir.split("/").pop() ?? "my-project";
}

function generateYaml(projectName: string): string {
  return `# DevCrew 项目配置
# 文档: https://github.com/user/devcrew

project:
  name: "${projectName}"
  description: ""

workflow:
  default_mode: standard     # standard | express | prototype
  concurrent_changes: true

verify:
  test_command: ""            # 为空时 AI 基于验收标准审查

git:
  ignore_devcrew: true      # devcrew/ 不入库（推荐）

specialists: []               # 按需激活领域专家，运行 crew agents 查看可用列表
                              # 示例: [game-designer, security-engineer]
`;
}

function appendGitignore(dir: string): void {
  const gitignorePath = join(dir, ".gitignore");
  const marker = "# DevCrew";
  const rules = `
${marker}
devcrew/
!devcrew/specs/
`;

  if (existsSync(gitignorePath)) {
    const existing = readFileSync(gitignorePath, "utf-8");
    if (existing.includes(marker)) {
      console.log("⚠️  .gitignore 已包含 DevCrew 规则，跳过");
      return;
    }
    appendFileSync(gitignorePath, rules);
    console.log("📝 追加 .gitignore 规则");
  } else {
    writeFileSync(gitignorePath, rules.trimStart());
    console.log("📝 创建 .gitignore");
  }
}
