#!/usr/bin/env node

/**
 * DevCrew MCP Server
 *
 * Exposes DevCrew Skills as MCP tools so AI agents (Claude, Copilot,
 * Cursor, etc.) can call them programmatically via the Model Context
 * Protocol.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as skills from "./skills/index.js";
import type { SkillResult } from "./skills/types.js";

function formatResult(result: SkillResult) {
  const lines = [result.summary, ...result.details];
  return {
    content: [{ type: "text" as const, text: lines.join("\n") }],
    isError: !result.ok,
  };
}

const server = new McpServer({
  name: "dev-crew",
  version: "0.4.0",
});

// --- Skill: init ---
server.tool(
  "crew_init",
  "初始化 DevCrew 工作区（创建 dev-crew/ 目录、INSTRUCTIONS.md、配置文件等）",
  {
    cwd: z.string().describe("项目根目录的绝对路径"),
    name: z.string().optional().describe("项目名称（默认从 package.json 或目录名推断）"),
    gitignore: z
      .boolean()
      .optional()
      .default(true)
      .describe("是否自动添加 .gitignore 规则"),
  },
  async (input) => formatResult(skills.init(input)),
);

// --- Skill: plan ---
server.tool(
  "crew_plan",
  "创建一个变更计划（proposal），进入 Plan 阶段",
  {
    cwd: z.string().describe("项目根目录的绝对路径"),
    name: z.string().describe("变更名称（kebab-case）"),
    description: z.string().optional().describe("变更需求描述"),
    mode: z
      .enum(["standard", "express", "prototype"])
      .optional()
      .describe("工作模式（不指定时自动推断）"),
  },
  async (input) => formatResult(skills.plan(input)),
);

// --- Skill: status ---
server.tool(
  "crew_status",
  "查看工作区状态：活跃变更、当前阶段、未解决的 blocker",
  {
    cwd: z.string().describe("项目根目录的绝对路径"),
  },
  async (input) => formatResult(skills.status(input)),
);

// --- Skill: release ---
server.tool(
  "crew_release",
  "归档已完成的变更，触发记忆整合",
  {
    cwd: z.string().describe("项目根目录的绝对路径"),
    name: z.string().optional().describe("要归档的变更名称（不指定则归档全部）"),
  },
  async (input) => formatResult(skills.release(input)),
);

// --- Skill: agents ---
server.tool(
  "crew_agents",
  "列出所有可用的领域专家（Specialist Agent）",
  {},
  async () => formatResult(skills.agents()),
);

// --- Start ---
const transport = new StdioServerTransport();
await server.connect(transport);
