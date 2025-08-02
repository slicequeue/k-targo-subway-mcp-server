import { searchSubwayStationTool, getSubwayTimetableTool, getAllSubwayTimetablesTool } from '@/tools/subway';
import { ToolsContainer } from '@/tools/types';

export const tools: ToolsContainer = {
  search_subway_station: searchSubwayStationTool,
  get_subway_timetable: getSubwayTimetableTool,
  get_all_subway_timetables: getAllSubwayTimetablesTool
};

export { 
  searchSubwayStationTool,
  getSubwayTimetableTool,
  getAllSubwayTimetablesTool
}
