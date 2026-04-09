#!/usr/bin/env node

import { Command } from "commander";
import { initCommand } from "./commands/init.js";
import { agentsCommand } from "./commands/agents.js";

const program = new Command();

program
  .name("crew")
  .description("DevCrew — AI Agent 软件开发团队编排工具")
  .version("0.1.0");

program
  .command("init")
  .description("初始化 DevCrew 工作区")
  .option("-n, --name <name>", "项目名称")
  .option("--no-gitignore", "不自动添加 .gitignore 规则")
  .action(initCommand);

program
  .command("agents")
  .description("列出所有可用的领域专家")
  .action(agentsCommand);

program.parse();
