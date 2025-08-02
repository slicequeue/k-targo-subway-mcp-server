import { CallToolResult } from "@modelcontextprotocol/sdk/types";

/**
 * MCP SDK 응답 헬퍼 유틸리티
 * 가장 많이 사용하는 응답 패턴을 간단하게 제공합니다.
 */

export type MCPResponse = CallToolResult;

export class ResponseUtil {
  /**
   * 기본 텍스트 응답
   */
  static text(message: string): MCPResponse {
    return {
      content: [{ type: 'text' as const, text: message }]
    };
  }

  /**
   * 에러 응답
   */
  static error(message: string): MCPResponse {
    return {
      content: [{ type: 'text' as const, text: message }],
      isError: true
    };
  }

  /**
   * 성공 응답 (데이터 포함 가능)
   */
  static success(message: string, data?: any): MCPResponse {
    const text = data 
      ? `${message}\n\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\``
      : message;
    
    return {
      content: [{ type: 'text' as const, text }]
    };
  }

  /**
   * 구조화된 데이터 응답
   */
  static data(title: string, data: Record<string, any>): MCPResponse {
    const content = `## ${title}\n\n${Object.entries(data)
      .map(([key, value]) => `- **${key}:** ${value}`)
      .join('\n')}`;

    return {
      content: [{ type: 'text' as const, text: content }]
    };
  }
} 