import { resolve, join, dirname } from "node:path";
import {
  existsSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  appendFileSync,
} from "node:fs";
import { fileURLToPath } from "node:url";
import { success, type SkillResult } from "./types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function pkgRoot(): string {
  return resolve(__dirname, "..", "..");
}

export interface InitInput {
  cwd: string;
  name?: string;
  gitignore?: boolean;
}

export function init(input: InitInput): SkillResult {
  const cwd = input.cwd;
  const projectName = input.name ?? inferProjectName(cwd);
  const gitignore = input.gitignore ?? true;
  const details: string[] = [];

  // 1. dev-crew/ directory
  const crewDir = join(cwd, "dev-crew");
  if (existsSync(crewDir)) {
    details.push("dev-crew/ 已存在，跳过");
  } else {
    mkdirSync(crewDir, { recursive: true });
    details.push("创建 dev-crew/");
  }

  // 2. INSTRUCTIONS.md
  const instrDest = join(cwd, "INSTRUCTIONS.md");
  if (existsSync(instrDest)) {
    details.push("INSTRUCTIONS.md 已存在，跳过");
  } else {
    const instrSrc = join(pkgRoot(), "templates", "INSTRUCTIONS.md");
    writeFileSync(instrDest, readFileSync(instrSrc, "utf-8"));
    details.push("创建 INSTRUCTIONS.md");
  }

  // 3. dev-crew.yaml
  const yamlDest = join(cwd, "dev-crew.yaml");
  if (existsSync(yamlDest)) {
    details.push("dev-crew.yaml 已存在，跳过");
  } else {
    writeFileSync(yamlDest, generateYaml(projectName));
    details.push("创建 dev-crew.yaml");
  }

  // 4. specs/ and memory/
  for (const sub of ["specs", "memory"]) {
    const dir = join(crewDir, sub);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
      details.push(`创建 dev-crew/${sub}/`);
    }
  }

  // 5. resume.md
  const resumePath = join(crewDir, "resume.md");
  if (!existsSync(resumePath)) {
    writeFileSync(
      resumePath,
      `---
active_changes: []
---
## 活跃变更

无

## 待解决

无

## 下一步

告诉 AI 你想做什么，它会自动创建变更计划。
`,
    );
    details.push("创建 dev-crew/resume.md");
  }

  // 6. blockers.md
  const blockersPath = join(crewDir, "blockers.md");
  if (!existsSync(blockersPath)) {
    writeFileSync(
      blockersPath,
      `# 问题与决策

暂无 blocker。
`,
    );
    details.push("创建 dev-crew/blockers.md");
  }

  // 7. .gitignore
  if (gitignore) {
    details.push(...appendGitignore(cwd));
  }

  return success(`工作区初始化完成: ${projectName}`, details);
}

function inferProjectName(dir: string): string {
  const pkgPath = join(dir, "package.json");
  if (existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
      if (pkg.name) return pkg.name;
    } catch {
      /* ignore */
    }
  }
  return dir.split("/").pop() ?? "my-project";
}

function generateYaml(projectName: string): string {
  return `# DevCrew 项目配置
# 文档: https://github.com/lordmos/dev-crew

project:
  name: "${projectName}"
  description: ""

workflow:
  default_mode: standard     # standard | express | prototype
  concurrent_changes: true

verify:
  test_command: ""            # 为空时 AI 基于验收标准审查

git:
  ignore_dev_crew: true      # dev-crew/ 不入库（推荐）

specialists: []               # 按需激活领域专家，运行 crew agents 查看可用列表
                              # 示例: [game-designer, security-engineer]
`;
}

function appendGitignore(dir: string): string[] {
  const gitignorePath = join(dir, ".gitignore");
  const marker = "# DevCrew";
  const rules = `
${marker}
dev-crew/
!dev-crew/specs/
`;

  if (existsSync(gitignorePath)) {
    const existing = readFileSync(gitignorePath, "utf-8");
    if (existing.includes(marker)) {
      return [".gitignore 已包含 DevCrew 规则，跳过"];
    }
    appendFileSync(gitignorePath, rules);
    return ["追加 .gitignore 规则"];
  }
  writeFileSync(gitignorePath, rules.trimStart());
  return ["创建 .gitignore"];
}
