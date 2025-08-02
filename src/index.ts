import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { PackageJsonUtil } from "@/utils/PackageJsonUtil";
import { tools } from "@/tools";
import { resources } from "@/resources";

export { PackageJsonUtil } from "@/utils/PackageJsonUtil";
export type { PackageJson } from "@/utils/PackageJsonUtil";
export { ResponseUtil } from "@/utils/ResponseUtil";
export type { MCPResponse } from "@/utils/ResponseUtil";

// MCP 서버 생성
const server = new McpServer({
  name: PackageJsonUtil.getInstance().getName(),
  version: PackageJsonUtil.getInstance().getVersion(),
  title: PackageJsonUtil.getInstance().getName()
});

// 도구 등록
Object.values(tools).forEach(tool => {
  return server.registerTool(
    tool.name,
    {
      title: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema
    },
    tool.handler
  );
});

// 리소스 등록
Object.values(resources).forEach(resource => {
  return server.registerResource(
    resource.name,
    resource.template,
    {
      title: resource.name,
      description: resource.description
    },
    resource.handler
  );
});

// 서버 시작
const transport = new StdioServerTransport();
server.connect(transport);

