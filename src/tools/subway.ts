import { z } from "zod";
import { MCPTool } from "./types";
import { getSubwayList, getStationTimetable, getStationAllArgsTimetable } from "../external/tago-subway/service";
import { DailyTypeCode, UpDownTypeCode } from "../external/tago-subway/types/codes";
import { ResponseUtil } from "../utils/ResponseUtil";

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
      
      if (result.data.length === 0) {
        return ResponseUtil.text(`"${args.stationName}" 검색 결과가 없습니다.`);
      }

      const stationInfo = result.data.map(station => 
        `- **${station.stationName}** (${station.routeName})\n  - 역 ID: ${station.stationId}`
      ).join('\n\n');

      const message = `## 지하철역 검색 결과: "${args.stationName}"\n\n${stationInfo}\n\n**총 ${result.paging.totalCount}개 역 발견**`;
      
      return ResponseUtil.success(message, {
        stations: result.data.map(station => ({
          stationId: station.stationId,
          stationName: station.stationName,
          routeName: station.routeName
        })),
        paging: result.paging
      });
    } catch (error) {
      return ResponseUtil.error(`지하철역 검색 중 오류가 발생했습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"}`);
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
      
      if (result.data.length === 0) {
        return ResponseUtil.text(`시간표 정보가 없습니다. (역 ID: ${args.stationId}, 요일: ${args.dailyType}, 방향: ${args.upDownType})`);
      }

      const stationName = result.data[0]?.subwayStationNm || "알 수 없음";
      const dailyTypeText: Record<string, string> = {
        "WEEKDAY": "평일",
        "SATURDAY": "토요일", 
        "SUNDAY": "일요일/공휴일"
      };
      
      const upDownTypeText: Record<string, string> = {
        "UP": "상행(서울방향)",
        "DOWN": "하행(서울반대방향)"
      };

      const timetableInfo = result.data.map(item => 
        `- **${item.arrTime}** 도착 → **${item.depTime}** 출발 (종점: ${item.endSubwayStationNm})`
      ).join('\n');

      const message = `## ${stationName} 지하철 시간표\n\n**${dailyTypeText[args.dailyType]} ${upDownTypeText[args.upDownType]}**\n\n${timetableInfo}\n\n**총 ${result.data.length}개 열차**`;
      
      return ResponseUtil.success(message, {
        stationName,
        dailyType: args.dailyType,
        upDownType: args.upDownType,
        timetables: result.data.map(item => ({
          arrivalTime: item.arrTime,
          departureTime: item.depTime,
          endStation: item.endSubwayStationNm,
          routeId: item.subwayRouteId
        })),
        paging: result.paging
      });
    } catch (error) {
      return ResponseUtil.error(`지하철 시간표 조회 중 오류가 발생했습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"}`);
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
      
      if (results.length === 0) {
        return ResponseUtil.text(`전체 시간표 정보가 없습니다. (역 ID: ${args.stationId})`);
      }

      const stationName = results[0]?.data[0]?.subwayStationNm || "알 수 없음";
      const dailyTypeText: Record<string, string> = {
        "WEEKDAY": "평일",
        "SATURDAY": "토요일", 
        "SUNDAY": "일요일/공휴일"
      };
      
      const upDownTypeText: Record<string, string> = {
        "UP": "상행(서울방향)",
        "DOWN": "하행(서울반대방향)"
      };

      const summary = results.map(result => {
        const dailyText = dailyTypeText[result.dailyTypeCode] || result.dailyTypeCode;
        const upDownText = upDownTypeText[result.upDownTypeCode] || result.upDownTypeCode;
        return `- **${dailyText} ${upDownText}**: ${result.data.length}개 열차`;
      }).join('\n');

      const message = `## ${stationName} 전체 지하철 시간표\n\n**총 ${results.length}개 조합**\n\n${summary}`;
      
      return ResponseUtil.success(message, {
        stationId: args.stationId,
        stationName,
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
      });
    } catch (error) {
      return ResponseUtil.error(`전체 지하철 시간표 조회 중 오류가 발생했습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"}`);
    }
  }
}; 