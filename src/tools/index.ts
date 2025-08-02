import { addTool } from '@/tools/add';
import { multiplyTool } from '@/tools/multiply';
import { searchSubwayStationTool, getSubwayTimetableTool, getAllSubwayTimetablesTool } from '@/tools/subway';
import { ToolsContainer } from '@/tools/types';

export const tools: ToolsContainer = {
  add: addTool,
  multiply: multiplyTool,
  search_subway_station: searchSubwayStationTool,
  get_subway_timetable: getSubwayTimetableTool,
  get_all_subway_timetables: getAllSubwayTimetablesTool
};

export { 
  addTool, 
  multiplyTool,
  searchSubwayStationTool,
  getSubwayTimetableTool,
  getAllSubwayTimetablesTool
}
