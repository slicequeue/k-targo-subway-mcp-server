import { z } from "zod";

/**
 * MCP 도구의 입력 스키마 타입
 */
export type ToolInputSchema = Record<string, z.ZodTypeAny>;

/**
 * MCP 도구 핸들러 함수 타입
 */
export type ToolHandler<T extends ToolInputSchema = any> = (
  args: z.infer<z.ZodObject<T>>,
  extra?: any
) => Promise<any>;

/**
 * MCP 도구 인터페이스
 */
export interface MCPTool<T extends ToolInputSchema = any> {
  /** 도구 이름 */
  name: string;
  /** 도구 설명 */
  description: string;
  /** 입력 스키마 */
  inputSchema: T;
  /** 도구 핸들러 함수 */
  handler: ToolHandler<T>;
}

/**
 * MCP 도구들을 관리하는 컨테이너 타입
 */
export type ToolsContainer = Record<string, MCPTool>; 