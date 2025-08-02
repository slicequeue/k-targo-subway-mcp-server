import { z } from "zod";
import { MCPTool } from "./types";
import { getSubwayList, getStationTimetable, getStationAllArgsTimetable } from "../external/tago-subway/service";
import { DailyTypeCode, UpDownTypeCode } from "../external/tago-subway/types/codes";

/**
 * 지하철역 검색 도구
 * 지하철역 이름으로 역 정보를 검색합니다.
 */
export const searchSubwayStationTool: MCPTool = {
  name: "search_subway_station",
  description: "지하철역 이름으로 역 정보를 검색합니다. 역 ID, 역 이름, 노선 정보를 반환합니다.",
  inputSchema: {
    stationName: z.string().describe("검색할 지하철역 이름 (예: 강남, 홍대입구)"),
    pageNo: z.number().optional().default(1).describe("페이지 번호 (기본값: 1)"),
    numOfRows: z.number().optional().default(10).describe("한 페이지당 결과 수 (기본값: 10)")
  },
  handler: async (args) => {
    try {
      const result = await getSubwayList(args.stationName, args.pageNo, args.numOfRows);
      
      return {
        success: true,
        data: {
          stations: result.data.map(station => ({
            stationId: station.stationId,
            stationName: station.stationName,
            routeName: station.routeName
          })),
          paging: {
            totalCount: result.paging.totalCount,
            pageNo: result.paging.pageNo,
            numOfRows: result.paging.numOfRows
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다."
      };
    }
  }
};

/**
 * 지하철역 시간표 조회 도구
 * 특정 역의 시간표를 조회합니다.
 */
export const getSubwayTimetableTool: MCPTool = {
  name: "get_subway_timetable",
  description: "지하철역의 시간표를 조회합니다. 요일별, 상하행별 시간표를 제공합니다.",
  inputSchema: {
    stationId: z.string().describe("지하철역 ID (search_subway_station 도구로 먼저 검색하여 얻을 수 있음)"),
    dailyType: z.enum(["WEEKDAY", "SATURDAY", "SUNDAY"]).describe("요일 구분 (WEEKDAY: 평일, SATURDAY: 토요일, SUNDAY: 일요일/공휴일)"),
    upDownType: z.enum(["UP", "DOWN"]).describe("상하행 구분 (UP: 상행/서울방향, DOWN: 하행/서울반대방향)"),
    pageNo: z.number().optional().default(1).describe("페이지 번호 (기본값: 1)"),
    numOfRows: z.number().optional().default(20).describe("한 페이지당 결과 수 (기본값: 20)"),
    filterNonArrive: z.boolean().optional().default(true).describe("정차하지 않는 열차 필터링 여부 (기본값: true)")
  },
  handler: async (args) => {
    try {
      const dailyTypeCode = DailyTypeCode[args.dailyType as keyof typeof DailyTypeCode];
      const upDownTypeCode = UpDownTypeCode[args.upDownType as keyof typeof UpDownTypeCode];
      
      const result = await getStationTimetable(
        args.stationId,
        dailyTypeCode,
        upDownTypeCode,
        args.pageNo,
        args.numOfRows,
        args.filterNonArrive
      );
      
      return {
        success: true,
        data: {
          stationName: result.data[0]?.subwayStationNm || "알 수 없음",
          dailyType: args.dailyType,
          upDownType: args.upDownType,
          timetables: result.data.map(item => ({
            arrivalTime: item.arrTime,
            departureTime: item.depTime,
            endStation: item.endSubwayStationNm,
            routeId: item.subwayRouteId
          })),
          paging: {
            totalCount: result.paging.totalCount,
            pageNo: result.paging.pageNo,
            numOfRows: result.paging.numOfRows,
            filteredCount: result.paging.filteredNumOfRows
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다."
      };
    }
  }
};

/**
 * 지하철역 전체 시간표 조회 도구
 * 특정 역의 모든 요일, 모든 방향의 시간표를 한 번에 조회합니다.
 */
export const getAllSubwayTimetablesTool: MCPTool = {
  name: "get_all_subway_timetables",
  description: "지하철역의 모든 요일, 모든 방향의 시간표를 한 번에 조회합니다. 평일/토요일/일요일, 상행/하행 모든 조합을 제공합니다.",
  inputSchema: {
    stationId: z.string().describe("지하철역 ID (search_subway_station 도구로 먼저 검색하여 얻을 수 있음)"),
    pageNo: z.number().optional().default(1).describe("페이지 번호 (기본값: 1)"),
    numOfRows: z.number().optional().default(100).describe("한 페이지당 결과 수 (기본값: 100)"),
    filterNonArrive: z.boolean().optional().default(true).describe("정차하지 않는 열차 필터링 여부 (기본값: true)"),
    delayMsec: z.number().optional().default(1000).describe("API 호출 간 지연 시간 (밀리초, 기본값: 1000)")
  },
  handler: async (args) => {
    try {
      const results = await getStationAllArgsTimetable(
        args.stationId,
        args.pageNo,
        args.numOfRows,
        args.filterNonArrive,
        args.delayMsec
      );
      
      return {
        success: true,
        data: {
          stationId: args.stationId,
          totalCombinations: results.length,
          timetables: results.map(result => ({
            dailyType: result.dailyTypeCode,
            upDownType: result.upDownTypeCode,
            stationName: result.data[0]?.subwayStationNm || "알 수 없음",
            timetableCount: result.data.length,
            timetables: result.data.map(item => ({
              arrivalTime: item.arrTime,
              departureTime: item.depTime,
              endStation: item.endSubwayStationNm,
              routeId: item.subwayRouteId
            }))
          }))
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다."
      };
    }
  }
}; 