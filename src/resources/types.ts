import { z } from "zod";
import { ResourceTemplate as MCPResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * MCP 리소스 콘텐츠 타입 (SDK와 호환)
 */
export type ResourceContent = {
  uri: string;
  text: string;
  mimeType?: string;
  _meta?: Record<string, unknown>;
} | {
  uri: string;
  blob: string;
  mimeType?: string;
  _meta?: Record<string, unknown>;
};

/**
 * MCP 리소스 핸들러 함수 타입
 */
export type ResourceHandler = (
  uri: URL,
  params: Record<string, string | string[]>
) => Promise<{
  contents: ResourceContent[];
}>;

/**
 * MCP 리소스 인터페이스
 */
export interface MCPResource {
  /** 리소스 이름 */
  name: string;
  /** 리소스 설명 */
  description: string;
  /** 리소스 템플릿 */
  template: MCPResourceTemplate;
  /** 리소스 핸들러 함수 */
  handler: ResourceHandler;
}

/**
 * MCP 리소스들을 관리하는 컨테이너 타입
 */
export type ResourcesContainer = Record<string, MCPResource>; 