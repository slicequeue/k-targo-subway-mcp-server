import { z } from "zod";
import { ResponseUtil } from "@/utils/ResponseUtil";
import { MCPTool } from "@/tools/types";

export const addTool: MCPTool<{
  a: z.ZodNumber;
  b: z.ZodNumber;
}> = {
  name: 'add',
  description: '두 수를 더합니다',
  inputSchema: {
    a: z.number().describe('첫 번째 숫자'),
    b: z.number().describe('두 번째 숫자')
  },
  handler: async (args: { a: number; b: number }, extra: any) => {
    const { a, b } = args;

    // 유효성 검사
    if (!(a || b)) {
      return ResponseUtil.error('연산하기 위한 인자가 충분하지 않습니다.');
    }

    // 처리
    const result = a + b;

    // 반환
    return ResponseUtil.data('덧셈 결과', {
      '첫 번째 숫자': a,
      '두 번째 숫자': b,
      '결과': result
    });
  }
};
