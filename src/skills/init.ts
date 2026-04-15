import { resolve, join, dirname, basename } from "node:path";
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

function normalizePlatforms(
  p: Platform | Platform[] | undefined,
): Platform[] {
  if (!p) return [];
  return Array.isArray(p) ? p : [p];
}

export type Platform = "copilot" | "cursor" | "claude";

export interface InitInput {
  cwd: string;
  name?: string;
  platform?: Platform | Platform[];
  gitignore?: boolean;
}

/** Platform-specific instruction file paths */
const PLATFORM_PATHS: Record<Platform, { path: string; label: string }> = {
  copilot: {
    path: ".github/copilot-instructions.md",
    label: "GitHub Copilot",
  },
  cursor: {
    path: ".cursorrules",
    label: "Cursor",
  },
  claude: {
    path: "CLAUDE.md",
    label: "Claude Code",
  },
};

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

  // 2. INSTRUCTIONS.md (canonical source)
  const instrSrc = join(pkgRoot(), "templates", "INSTRUCTIONS.md");
  const instrContent = readFileSync(instrSrc, "utf-8");
  const instrDest = join(cwd, "INSTRUCTIONS.md");
  if (existsSync(instrDest)) {
    details.push("INSTRUCTIONS.md 已存在，跳过");
  } else {
    writeFileSync(instrDest, instrContent);
    details.push("创建 INSTRUCTIONS.md");
  }

  // 2b. Platform-specific instruction files
  const platforms = normalizePlatforms(input.platform);
  for (const p of platforms) {
    const cfg = PLATFORM_PATHS[p];
    const dest = join(cwd, cfg.path);
    const destDir = dirname(dest);
    if (existsSync(dest)) {
      details.push(`${cfg.path} 已存在，跳过 (${cfg.label})`);
    } else {
      if (!existsSync(destDir)) {
        mkdirSync(destDir, { recursive: true });
      }
      writeFileSync(dest, instrContent);
      details.push(`创建 ${cfg.path} (${cfg.label})`);
    }
  }

  // 3. dev-crew.yaml
  const yamlDest = join(cwd, "dev-crew.yaml");
  if (existsSync(yamlDest)) {
    details.push("dev-crew.yaml 已存在，跳过");
  } else {
    writeFileSync(yamlDest, generateYaml(projectName));
    details.push("创建 dev-crew.yaml");
  }

  // 4. specs/, memory/, and templates/
  for (const sub of ["specs", "memory", "templates"]) {
    const dir = join(crewDir, sub);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
      details.push(`创建 dev-crew/${sub}/`);
    }
  }

  // 4a. Copy doc-format templates
  const docFormatsSrc = join(pkgRoot(), "templates", "doc-formats");
  const templatesDir = join(crewDir, "templates");
  if (existsSync(docFormatsSrc)) {
    for (const file of [
      "proposal.md",
      "design.md",
      "impl-log.md",
      "test-report.md",
      "review-report.md",
    ]) {
      const dest = join(templatesDir, file);
      if (!existsSync(dest)) {
        const src = join(docFormatsSrc, file);
        if (existsSync(src)) {
          writeFileSync(dest, readFileSync(src, "utf-8"));
          details.push(`创建 templates/${file}`);
        }
      }
    }
  }

  // 4b. Initialize per-agent memory files
  const memoryDir = join(crewDir, "memory");
  const agentMemoryFiles: Record<string, string> = {
    "pdm.md": "产品经理",
    "architect.md": "架构师",
    "implementer.md": "开发",
    "tester.md": "测试",
    "reviewer.md": "审查",
  };
  const now = new Date().toISOString();
  for (const [file, label] of Object.entries(agentMemoryFiles)) {
    const memPath = join(memoryDir, file);
    if (!existsSync(memPath)) {
      writeFileSync(
        memPath,
        `---
agent: ${label}
last_updated: ${now}
changes_completed: 0
---
## 项目认知

（随变更积累更新）

## 经验库

（从历史变更中提炼的模式、规则、教训）

## 工作偏好

（用户偏好、团队约定、特殊规则）
`,
      );
      details.push(`创建 memory/${file}`);
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
  return basename(dir) || "my-project";
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
