#!/usr/bin/env node

import { Command } from "commander";
import { initCommand } from "./commands/init.js";
import { agentsCommand } from "./commands/agents.js";
import { plan } from "./skills/plan.js";
import { status } from "./skills/status.js";
import { release } from "./skills/release.js";
import { checkpoint } from "./skills/checkpoint.js";

const program = new Command();

program
  .name("crew")
  .description("DevCrew — AI Agent 软件开发团队编排工具")
  .version("0.5.0");

program
  .command("init")
  .description("初始化 DevCrew 工作区")
  .option("-n, --name <name>", "项目名称")
  .option(
    "-p, --platform <platforms...>",
    "AI 平台 (copilot, cursor, claude)，自动将指令放到平台读取的位置",
  )
  .option("--no-gitignore", "不自动添加 .gitignore 规则")
  .action(initCommand);

program
  .command("plan <name>")
  .description("创建变更计划")
  .option("-m, --mode <mode>", "工作模式: standard | express | prototype")
  .option("-d, --description <desc>", "变更描述")
  .action((name: string, opts: { mode?: string; description?: string }) => {
    const result = plan({
      cwd: process.cwd(),
      name,
      description: opts.description,
      mode: opts.mode as "standard" | "express" | "prototype" | undefined,
    });
    console.log(result.ok ? `\n✅ ${result.summary}` : `\n❌ ${result.summary}`);
    for (const line of result.details) console.log(`  ${line}`);
    console.log();
    if (!result.ok) process.exitCode = 1;
  });

program
  .command("status")
  .description("查看工作区状态")
  .action(() => {
    const result = status({ cwd: process.cwd() });
    console.log(`\n📊 ${result.summary}\n`);
    for (const line of result.details) console.log(line);
    console.log();
    if (!result.ok) process.exitCode = 1;
  });

program
  .command("release")
  .description("归档已完成的变更")
  .argument("[name]", "要归档的变更名称（不指定则归档全部）")
  .action((name?: string) => {
    const result = release({ cwd: process.cwd(), name });
    console.log(result.ok ? `\n✅ ${result.summary}` : `\n❌ ${result.summary}`);
    for (const line of result.details) console.log(`  ${line}`);
    console.log();
    if (!result.ok) process.exitCode = 1;
  });

program
  .command("agents")
  .description("列出所有可用的领域专家")
  .action(agentsCommand);

program
  .command("checkpoint")
  .description("阶段审计 + 一致性检查 + 记忆同步")
  .argument("[change]", "变更名称（不指定则自动选择第一个活跃变更）")
  .action((change?: string) => {
    const result = checkpoint({ cwd: process.cwd(), change });
    console.log(result.ok ? `\n✅ ${result.summary}` : `\n⚠️  ${result.summary}`);
    for (const line of result.details) console.log(line);
    console.log();
    if (!result.ok) process.exitCode = 1;
  });

program.parse();
