import { addTool } from '@/tools/add';
import { multiplyTool } from '@/tools/multiply';
import { ToolsContainer } from '@/tools/types';

export const tools: ToolsContainer = {
  add: addTool,
  multiply: multiplyTool
};

export { addTool, multiplyTool }
