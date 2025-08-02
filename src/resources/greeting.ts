import { MCPResource } from "@/resources/types";
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";

export const greetingResource: MCPResource = {
  name: 'greeting',
  description: '동적 인사말을 생성하는 리소스',
  template: new ResourceTemplate('greeting://{name}', {
    list: undefined
  }),
  handler: async (uri: URL, params: Record<string, string | string[]>) => {
    const name = (params.name as string) || '익명';
    
    // 현재 시간에 따른 인사말 생성
    const now = new Date();
    const hour = now.getHours();
    
    let greeting = '';
    if (hour < 6) {
      greeting = '좋은 새벽이네요';
    } else if (hour < 12) {
      greeting = '좋은 아침이에요';
    } else if (hour < 18) {
      greeting = '좋은 오후에요';
    } else {
      greeting = '좋은 저녁이에요';
    }

    const message = `${greeting}, ${name}님! 현재 시간은 ${now.toLocaleTimeString('ko-KR')}입니다.`;

    return {
      contents: [{
        uri: uri.href,
        text: message,
        mimeType: 'text/plain'
      }]
    };
  }
}; 